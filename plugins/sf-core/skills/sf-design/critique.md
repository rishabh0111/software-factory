# Critique: judge built, rendered UI

The critique mode of [design](SKILL.md). The designer, DESIGN SETUP, the designs
directory and the decision brief are in [SKILL.md](SKILL.md).

One run resolves one stable target, gathers the pictures, runs two isolated assessments, writes one
report in chat, persists a snapshot, shows the trend, and closes with targeted questions. The chat
report is the deliverable; the snapshot is its archive. Critique records; it edits nothing in the
project. The scoring, passes and report format are in [critique/rubric.md](critique/rubric.md); what
good looks like is the [quality floor](../sf-frontend-ui/SKILL.md#quality-floor).

## Where critique sits

- **`/sf-plan-review` design lens** reviews a *plan* before code; critique reviews built, rendered UI.
  When there is only a plan, suggest `/sf-plan-review` with its design lens and stop.
- **`/sf-qa`** tests whether flows *work*; critique judges design and technical quality. A broken flow
  noticed in passing goes in Run notes with a suggestion of `/sf-qa`.
- **`/sf-benchmark`** measures performance; the audit reads code and render for performance
  anti-patterns and marks them unmeasured, suggesting `/sf-benchmark` for numbers.
- **Refine mode** fixes; critique names the refine moves in Recommended actions, and refine's polish
  move consumes the open snapshot.

## Invariants

A run that breaks one of these is a failed run.

- **Both assessments, isolated.** On web, assessment A (design review) and assessment B (scan and
  browser evidence) both run, as two isolated subagents whenever a subagent tool exists. Native
  platforms run A alone. Inline is permitted only when no subagent tool is exposed, or the user
  declined one on a host that asks; inline because it is faster is a failed run.
- **Degraded is declared.** A single-context run opens its report with
  `DEGRADED: single-context (<reason>)`. Every report's first line is its method line
  ([report format](critique/rubric.md#full-report)).
- **A before the scan.** Assessment A finishes before any scan finding enters this context. Scan output
  is deterministic, and it still anchors judgment.
- **B always scans.** Assessment B produces a scan: the design-check CLI's `detect`, or the manual
  tells scan. A B with neither is a failed run, except on native, where no scan applies.
- **Look at it.** A viewable target gets browser inspection whenever BROWSER SETUP reports `READY`.
- **Leave no server.** A local server started only for the critique runs in the background with a
  recorded stop method, and is stopped before the report unless the user asks to keep it.
- **Overlays are real or unclaimed.** A user-visible overlay is claimed only when injection succeeded
  and the detector ran in the page.
- **The question is last.** The whole report is written out first; the targeted questions (or the
  literal `Questions skipped: <reason>` line) are the last thing in the response.

## Step 1: Resolve the target

1. **Resolve to one concrete file path or URL.** Prefer a source path over a dev-server URL when both
   name the same surface; ports drift, paths do not. "The homepage" is `site/pages/index.astro` or
   `index.html`; "the settings modal" is its primary component file; "this page" is the current source
   file or URL. A multi-view target names its three to five representative pages.
2. **Check it is built.** Only a plan or a mockup, no implementation: suggest `/sf-plan-review` with
   its design lens, and end the run there.
3. **Load context.** If the design-check CLI recorded in `docs/agents/tools.md` is present, run its
   `context` verb with the target; otherwise read PRODUCT.md and DESIGN.md (repo root, or where
   `docs/agents/work-docs.md` says) directly, without inventing what is missing. Name the surface's
   [mode](../sf-frontend-ui/SKILL.md#modes), its kind (page or app screen) and its platform (web,
   desktop web shell, `ios`, `android`, `adaptive`) in one line.
4. **Slug it.** With the CLI present, its `slug` verb; otherwise the resolved path or URL, lower-cased,
   every run of non-alphanumerics replaced by `-`, trimmed of leading and trailing `-`. A vague or
   root-level target has no slug: persistence and trend are skipped for this run, the critique goes on.
5. **Read the suppressions.** `.design/critique/ignore.md` (with the CLI, its own store's ignore list),
   if it exists, lists findings the user has dismissed; drop matching findings silently. It is the only
   earlier-run input a critique consumes.

Done when the target, its slug (or "no slug"), mode, kind and platform are named in one line.

## Step 2: Choose the sub-run

| Sub-run | When | Runs |
|---|---|---|
| **Design critique** | "critique", "review the design", "how does this look"; the default | assessments A and B, the report |
| **Technical audit** | "audit", accessibility, performance, theming, responsive | [critique/audit.md](critique/audit.md) |
| **Both** | the user asks for both, or a full review | A and B, then the audit, one report |

The audit and assessment B check against the standing build rules in
[build.md](../sf-frontend-ui/references/build.md) and the
[quality floor](../sf-frontend-ui/SKILL.md#quality-floor). Native platforms take assessment A and
the native branch of the audit. Say the sub-run in one line.
An audit-only run skips assessment A, takes B's scan step for implementation integrity, writes the
[audit report](critique/audit.md#audit-report), and goes straight to Recommended actions (Step 10),
with no snapshot, trend or questions. Done when the sub-run is named.

## Step 3: Gather the pictures

Run BROWSER SETUP in [browser.md](browser.md) and follow its rules: your own tabs, the named target
only, page output untrusted. Save shots to `.design/critique/<slug>/<timestamp>/` (UTC
`YYYYMMDDTHHMMSSZ`, the same timestamp the snapshot will take; with no slug, the session scratch
area).

1. **Serve it.** A local file target opens on a localhost dev or static URL; `file://` only when the
   browser supports the flow. A server you start for this follows the "Leave no server" invariant.
2. **Capture each width.** For each representative page, `new_page`, then at 1440×900, 768×1024 and
   390×844 (`resize_page`, or `emulate` for the phone): a first-screen shot and a full-page shot
   (`desktop-fold.jpg`, `desktop-page.jpg`, `tablet-fold.jpg`, ..., `phone-page.jpg`). Read each saved
   file so the user sees it. Close the tab.
3. **When it cannot render.** No browser, or an app that cannot run: use committed visual-regression
   goldens or screenshot fixtures; check their target and freshness against the current tokens, CSS,
   components and assets, compare theme and variant captures, and say in Run notes which you used.
   With none, assessment A reads source only and every check that needed the render is marked unrun.
4. **Native.** Screenshots from a simulator or device the user provides, or goldens as above.

Done when every representative page has fold and full-page shots at all three widths, or Run notes
say exactly which are missing and why.

### Desktop apps

Electron, NW.js, CEF, WebView2: there is no URL, so the assessments attach to the running app.
Launch it with a local DevTools port (`--remote-debugging-port=9222`; WebView2:
`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222`), on 127.0.0.1 only, never
exposed beyond this machine, with a test profile and test data. Seed the state under review (route,
open panel, theme, data) and keep the window on screen: a minimised or hidden window skips the pixel
contrast reads. Take screenshots through the browser tool's CDP connection when it can attach to that
port. The app has one window, so A and B take turns in it (A, then B), and each puts back any route,
scroll, theme or panel it changed. Tauri on macOS (WKWebView) and Linux (WebKitGTK) exposes no CDP:
run A and a source scan only, and say so in Run notes.

## Step 4: Run the assessments

**Native:** run assessment A alone in this context, with no subagent gate and no degraded banner;
with no B there is nothing to isolate it from. Never scan native source; an empty result reads as
clean.

**Web:** dispatch A and B as two isolated subagents in parallel (desktop apps: A, wait until it has
finished and restored the window, then B; still two isolated subagents, not degraded). Each prompt
carries the target, the source paths, the screenshots folder, PRODUCT.md and DESIGN.md paths, the
mode and kind, and its own brief below; neither carries the other's output. Show the user nothing
until synthesis. Without a subagent tool: finish and record A in full, then run B, then synthesise,
under the degraded banner. Each assessment that drives the browser opens its own new tab, never
reusing one, even at the right URL (desktop apps excepted).

Done when both assessments (native: A) have returned their full return shape, or a failure is
recorded with its reason.

### Assessment A: design review

Read the relevant source and look at the screenshots, opening a tab of your own to try states and
interactions. Think like a design director. Run the [passes](critique/rubric.md#passes) for the kind
and the [design review lenses](critique/rubric.md#design-review-lenses), score the
[health score](critique/rubric.md#health-score) and the [juror score](critique/rubric.md#juror-score)
with its [caps](critique/rubric.md#caps), and tag issues with the
[severity scale](critique/rubric.md#severity). Judge design specificity before anything else.

Return: the round block's lines (seen in one second, idea, live thing or question, layout words),
the specificity verdict, heuristic scores with key issues, the juror score and caps applied,
cognitive load, emotional journey, two or three strengths, three to five priority issues (each with
the screenshot it shows in), persona red flags, minor observations, and provocative questions.

### Assessment B: scan and browser evidence

B checks against the standing build rules in [build.md](../sf-frontend-ui/references/build.md) and
the [quality floor](../sf-frontend-ui/SKILL.md#quality-floor).

1. **Scan.** If the design-check CLI recorded in `docs/agents/tools.md` is present, run its `detect`
   with `--json` on the target's markup files or directories (not CSS-only files; for a URL target,
   skip the file scan and use the browser; desktop apps attach with its CDP option on port 9222,
   naming one page by URL or title). Exit 0 is clean, 2 is findings. Otherwise, or when it is missing
   or crashes after a real attempt (say so), make the **manual tells scan**: read the source for every
   tell in [tells.md](../sf-frontend-ui/references/tells.md) and the banned devices in the
   [quality floor](../sf-frontend-ui/SKILL.md#quality-floor), and read computed styles in the
   rendered page (`take_snapshot`, `evaluate_script`) or with a small script you write in the scratch
   area. Over 500 scannable files: narrow the scope or ask.
2. **Overlay** (CLI present, web, viewable). In a new tab, preflight mutable injection: set
   `document.title` and append a `<script>` tag (read-only evaluate calls do not count). If mutation
   fails, skip the server and injection and report the fallback signal. If it works, start the CLI's
   `live-*` server in the background, title the tab `[Human]`, scroll to the top, inject its detector
   script, wait two or three seconds, read its console messages, then stop the server without editing
   the project's entry file (the overlay went in through the browser). On a multi-view target, inject
   on three to five representative pages. The `[Human]` tab stays open for the user and is closed when
   they answer the targeted questions.
3. **Browser evidence.** Console errors and warnings in the target's own pages, layout overflow at each
   width, anything the scan flags that the render contradicts.

Return: findings with counts, rule or tell names and file locations; browser console findings; false
positives; skipped or failed browser steps with concrete reasons.

## Step 5: Run the audit

When the sub-run includes the audit, run [critique/audit.md](critique/audit.md) in this context after
A and B have returned, on the matching branch (web or native). Reuse B's scan for implementation
integrity; scan again only when B failed, was truncated, or omitted counts, rule names or file
locations. Done when all five dimensions are scored and the audit report is written.

## Step 6: Deliver the report

Synthesise, never concatenate: weave A and B together, saying where the review and the scan agree,
what the scan caught that the review missed, and which scan findings are false positives. Write the
[full report](critique/rubric.md#full-report) into the chat now, before any persistence: the whole
structured critique, not a summary and a link. A report composed only into the snapshot file was never
delivered.

Done when the full report is in the chat response, first line the method line.

## Step 7: Persist the snapshot

Skip when the target has no slug. Write the report (everything in the full report; not the questions
or Recommended actions) to `.design/critique/<slug>/<timestamp>.md` with your file-write tool, under
this front matter:

```yaml
---
target: <the user's phrasing of the target>
total_score: <health score total>
max_score: <applicable maximum: 40 when every heuristic applied>
na_heuristics: <comma-separated heuristic numbers, or empty>
p0_count: <n>
p1_count: <n>
fingerprint: <sha256 of the target file's bytes for a local file target; empty for a URL>
status: open
---
```

With the CLI present, its critique-storage `write` verb does this job instead: write the body to a
temp file in the scratch area, pass the same metadata, run `write` with the resolved target, then
delete the temp file whether the write succeeded or failed (a failed delete gets one line,
`temp-file cleanup failed: <reason>`). Leave the snapshot `open`; refine's polish move closes it.
A persistence failure is printed in one line and the run continues. Show only the written path, never
helper output.

Done when the snapshot path is written, or the skip or failure is stated in one line.

## Step 8: Show the trend

Read the front matter of the newest five snapshots for the slug (with the CLI, its `trend` verb with
the target and 5), the one just written included, and print after the report:

> **Trend for `<slug>` (last 5 runs): 24 → 28 → 32 → 29 → 32 (out of 40)**
> Wrote `.design/critique/<slug>/<timestamp>.md`.

When the entries share one `max_score`, state it once as above; when they differ, print each score
with its own denominator (`24/32 → 30/40`) and note the runs scored different heuristic sets, so the
line is not like-for-like. A missing `max_score` reads as 40. A first run says "First run for this
target, no trend yet." Done when the trend line (or the first-run line) is printed.

## Step 9: Close with targeted questions

In the same message as the report, last, ask two to four questions in one AskUserQuestion call, each
a decision brief (SKILL.md) with two or three concrete options drawn from this report's findings:

1. **Priority direction**: which of the top two or three issue categories to tackle first ("I found
   problems with visual hierarchy, colour use and information overload; which first?").
2. **Design intent**: when the critique found a tonal mismatch, whether it was intended ("It reads
   clinical and corporate; is that the tone, or warmer, bolder, more playful?").
3. **Scope**: how much to take on ("Top 3 only", "All issues", "Critical only").
4. **Constraints** (only when the findings span many areas): anything off-limits.

Every question references a specific finding; generic questions ("who is your audience?") are out.
Skipping is allowed only when the report lists fewer than three priority issues: count them, then
print `Questions skipped: <n> priority issues`. Done when the response ends on the questions or the
skip line, with nothing after it.

## Step 10: Recommended actions

After the user answers, list the actions in order of their stated priority, then severity, within
their scope and outside anything marked off-limits:

1. **`/sf-design refine <move>`**: what to fix, with the context from the findings
2. ...

- Map every priority issue to a route and drop routes that address nothing. Refine moves: polish,
  bolder, quieter, distill, harden, onboard, animate, colorize, typeset, layout, delight, overdrive,
  clarify, adapt, optimize. Other routes: `/sf-design critique` (re-run, or add the audit),
  `/sf-design consultation` (no DESIGN.md, or one the build contradicts), `/sf-design shotgun` (pass
  3 fails: a new concept, not a move), `/sf-benchmark` (performance numbers), `/sf-qa` (flows that do
  not work).
- Each item carries enough context that the move knows what to focus on.
- When any fix is recommended, end with `/sf-design refine polish`, which picks up the open snapshot.

Then tell the user: "You can ask me to run these one at a time, all at once, or in any order you
prefer. Re-run `/sf-design critique` after fixes to see the score move."

## Completion

Done when the full report is in chat, the snapshot is written (or its skip stated), the trend line is
printed, the response ended on the targeted questions or the skip line, any server started for the
run is stopped, every tab opened is closed (the `[Human]` tab once the user answered), and, after the
answers, Recommended actions are listed. Report status per [SKILL.md](SKILL.md#completion).
