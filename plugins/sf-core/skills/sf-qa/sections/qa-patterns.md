# Browser QA method

Only for selected browser surfaces. Source and diff reads map changes to pages before
the probes; discovery itself stays black-box, and diagnosis belongs to the caller. The
shared loop in [exploratory.md](exploratory.md) owns execution order: its checkpoint rule
covers every probe after the baseline, including orientation, link checks, exact replay
and extra evidence. These phases are techniques inside that loop; never batch across
checkpoints. A selected browser surface always gets the browser, even for a backend-only
change; API, CLI, job, worker and webhook targets never select it.

## Modes

`/sf-qa` chooses Full, Quick or Regression (conflicting depth flags are settled by asking
before any probe). `/sf-ship` keeps its smoke and plan
bounds. Diff-aware selects scope, not another pass. Time caps include checkpoints and
evidence; at exhaustion, stop probing and report unfinished coverage, never skip a
checkpoint.

**Diff-aware** (automatic on a feature branch with no URL). With the detected base:

```bash
git diff <base>...HEAD --name-only
git log <base>..HEAD --oneline
```

Map changed controllers, routes, views, components, models, services and styles to pages;
check the commit and PR intent; add related TODO bugs to the plan. Open static pages
directly. A browser-surface API probe: `new_page` {url: "<base-url>"}, then
`evaluate_script` with `async () => { const r = await fetch("<base-url>/api/...", {
method: "GET" }); return { API_STATUS: r.status, API_BODY: (await r.text()).slice(0,
4000) }; }`, then `close_page`.

With the URL missing, after selecting and isolating the surface, look for a local app:

```bash
for p in 3000 4000 8080; do curl -sI --max-time 3 "http://localhost:$p" >/dev/null 2>&1 && echo "Found app on :$p"; done
```

Use the supplied URL, else the first responder, staging or preview; ask if none. Test
changed and adjacent pages and flows; new bugs absent from TODOS.md are flagged in the
report. **No identifiable pages:** Quick plus the discovered interactions, even for
backend, config or infrastructure changes.

**Full** (default with a URL): every reachable page (5-15 minutes); score health and
document the evidenced issues (typically 5-10), never invented ones.

**Quick** (`--quick`, 3 minutes): the homepage and the top 5 navigation targets. Check
loads, console and broken links and score with the rubric; skip detailed issues and the
per-page checklist, never the loop's gates.

**Regression** (`--regression <baseline>`): run Full, then append fixed and new issues
and the score delta, preserving the supplied baseline. A missing or unreadable baseline
blocks the comparison, not the Full run.

## Phases

### Phase 1: Initialize

Reuse the caller's browser setup and owned artifact paths: the browser is `READY`.
Complete only missing setup within the caller's authority. Clamp the loop's deadline
guard to the caller's running deadline.

### Phase 2: Authenticate (if needed)

Follow the browser access decision in [browser-setup.md](browser-setup.md) for a
signed-in test profile; rerun after the user handles sign-in, 2FA, OTP or CAPTCHA.

### Phase 3: Orient

Establish the successful baseline before any challenge: observe the page's or
interaction's expected result and state, not merely a successful load.

**Read and flow sequence** (one sequence on one page, closed at its end; for an
interaction, add the flow step):

1. `new_page` {url: "<target-url>"}.
2. `take_snapshot`.
3. `take_screenshot` {filePath: "$REPORT_DIR/screenshots/initial.jpg", format: "jpeg",
   quality: 60, fullPage: true}; in a flow, `issue-001-step-1.jpg` without `fullPage`.
4. Flow only: `click` {uid: "<uid from the snapshot>"}; `wait_for` {text: ["<expected
   result text>"]}; `take_snapshot` again and record the change between `DIFF_START` and
   `DIFF_END`; `take_screenshot` {filePath: "$REPORT_DIR/screenshots/issue-001-result.jpg",
   format: "jpeg", quality: 60}.
5. `URL=` from `list_pages`.
6. `CONSOLE_ERRORS=`: `list_console_messages` {types: ["error"]}.
7. `TEXT_START`/`TEXT_END`: `evaluate_script` `() => document.body.innerText.slice(0, 20000)`.
8. `close_page`.

Read every saved screenshot. Never delete reports or screenshots.

**Links** (same-origin safe paths; HEAD requests only on LOCAL targets, since they carry
cookies): `new_page` {url: "<target-url>"}, then `evaluate_script` with:

```js
async () => {
  const links = [...new Set([...document.querySelectorAll("a[href]")].map(a => a.href))].filter(h => new URL(h).origin === location.origin && !/logout|signout|delete|remove|cancel|unsubscribe/i.test(h));
  const local = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|\[::1\])$|\.(localhost|test)$/.test(location.hostname);
  const out = [];
  for (const l of links) { if (!local) { out.push("LINK ? " + l); continue; } const r = await fetch(l, { method: "HEAD" }).catch(e => ({ status: "ERR " + e.message })); out.push("LINK " + r.status + " " + l); }
  return out;
}
```

then `close_page`. `LINK` 4xx/5xx or `ERR` is broken; `LINK ?` is unverified. Snapshot SPA
buttons and menus the link list misses.

Framework: `__next` or `_next/data` = Next.js; `csrf-token` = Rails; `wp-content` =
WordPress; navigation without reloads = SPA.

### Phase 4: Explore

Choose each next candidate from the preceding result; core flows before secondary pages.
For each page, run the read sequence with `page-<name>.jpg` and work the per-page
checklist and categories in [../references/issue-taxonomy.md](../references/issue-taxonomy.md):
layout, controls, empty, invalid and edge-case forms, navigation, empty, loading, error
and overflow states, console after every interaction. Quick skips the checklist.

For a complex flow, write its charter as a step plan the browser can follow, each step
with its expected result and checks:

```markdown
### Steps
1. Click the checkbox on the first task
   - Expected: strikethrough animation, task moves to "completed"
   - Check: no console errors; network shows PATCH /api/tasks/:id {status: "completed"}
2. Click undo within 3 seconds
   - Expected: task returns to the active list
   - Check: PATCH /api/tasks/:id {status: "pending"}
3. Toggle the same task 5 times rapidly
   - Expected: no glitches, consistent final state
   - Check: no duplicate requests; the DOM shows exactly one instance of the task
```

**Accessibility**, on each core page: every interactive element has an accessible name in
the snapshot tree; headings run h1 → h2 → h3 with no skipped level; Tab order (via
`press_key`) follows a logical sequence and focus is visible; body text meets 4.5:1
contrast (`get_css_styles`); dynamic changes are announced through ARIA live regions.

**Mobile:** `new_page` {url: "<page-url>"}; `emulate` {viewport:
"375x812x2,mobile,touch"}; `take_screenshot` {filePath:
"$REPORT_DIR/screenshots/page-mobile.jpg", format: "jpeg", quality: 60, fullPage: true};
`emulate` without `viewport`; `close_page`.

### Phase 5: Document

Confirm each issue by the loop's exact replay, then minimize and capture its evidence at
once. A timeout before the replay finishes leaves confirmation incomplete; later timeouts
leave a confirmed defect intact with its evidence or minimization unfinished.

- **Interactive:** the Phase 3 sequence with the flow step. Alternatives: `fill` {uid:
  "<email field uid>", value: "qa@example.com"}, `click` {uid: "<Save button uid>"} (find
  uids by role and name in the snapshot), `wait_for` {text: ["<done text>"]}. Link the
  before and after screenshots in the repro steps.
- **Static** (copy, layout, images): `new_page`; `take_snapshot`, naming the affected
  element's uid and role in the description; `take_screenshot` {filePath:
  "$REPORT_DIR/screenshots/issue-002.png", uid: "<element uid>"} (no uid when the issue
  spans the page); `close_page`.

### Phase 6: Wrap up

Format the retained evidence, with no new probes, in
[../templates/qa-report-template.md](../templates/qa-report-template.md) under the
caller's artifact and mixed-report rules: score, Top 3 Things to Fix by severity, console
health, severity counts, date, duration, page and screenshot counts, framework. Save
`baseline.json`: `date` (YYYY-MM-DD), `url`, `healthScore`, `issues` (`id`, `title`,
`severity`, `category`), `categoryScores`. Regression: fixed = in the prior baseline only,
new = in the current run only.

## Health score

Score each tested category 0-100, then take the weighted average.

- **Counting.** Deduplicate one root cause across pages. Give each finding one primary
  category, the first that applies: Links (navigation), Accessibility (access barriers),
  Functional (behavior), Performance (speed), Visual (layout), Content (copy), UX
  (friction), Console (errors remaining). No double deductions.
- **Coverage.** Exclude untested categories; label a partial score provisional with its
  coverage; with nothing tested, "not scored". Compare scores only across identical
  coverage.
- **Console (15%):** reproducible errors and exceptions, deduplicated by message and
  source across pages, excluding warnings, info and defects scored elsewhere: 0 → 100;
  1-3 → 70; 4-10 → 40; 11+ → 10. Warnings never change the score; list them under Console
  Health, and in test and fix treat a warning on a page this branch changed as a finding
  within the tier.
- **Links (10%):** unique broken destinations, client-side routes included (repeatable
  4xx/5xx, missing routes or anchors, timeouts), excluding expected auth redirects and
  resource or API requests: 0 → 100; each broken link −15, floor 0.
- **Visual, Functional, UX, Content, Performance, Accessibility:** start at 100 and deduct
  per finding by severity ([../references/issue-taxonomy.md](../references/issue-taxonomy.md)):
  critical −25, high −15, medium −8, low −3; floor 0.

| Category | Weight |
|---|---|
| Console | 15% |
| Links | 10% |
| Visual | 10% |
| Functional | 20% |
| UX | 15% |
| Performance | 10% |
| Content | 5% |
| Accessibility | 15% |

**Final score** = Σ(category score × weight) / Σ(tested weights), with decimal weights
(15% = 0.15); round only the final score to the nearest integer (0.5 rounds up).

## Framework-specific checks

- **Next.js:** hydration errors (`Hydration failed`, `Text content did not match`),
  `_next/data` 404s, routing by link click (not only by navigation), dynamic-content CLS.
- **Rails:** N+1 warnings in development, form CSRF, Turbo/Stimulus transitions, flash
  messages appearing and dismissing.
- **WordPress:** plugin JavaScript conflicts, the signed-in admin bar, `/wp-json/`, mixed
  content.
- **SPA:** navigation by snapshot, stale state on return, back/forward history, console
  signs of leaks after extended use.

## Discovery rules

Never read source code during browser discovery: use realistic end-to-end flows and check
the console after every interaction. For a missing click target, use snapshot uids, then
`evaluate_script` element lookups. Follow browser setup's safety rules: one question
listing the non-LOCAL mutations per run, before acting.
