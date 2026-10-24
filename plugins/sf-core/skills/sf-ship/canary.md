# Canary

The **Canary** branch of `sf-ship`: watch production right after a deploy and catch what CI cannot (a missing environment variable, a CDN serving stale assets, a migration slower on real data) in the first ten minutes, not the first ten hours. It drives the browser per [browser.md](browser.md): run its setup check first. Canary is read-only: it observes and reports, and changes code only when the user asks to investigate and fix.

## Arguments
- `<url>` — monitor a URL for 10 minutes after deploy
- `<url> --duration 5m` — custom monitoring duration (1m to 30m)
- `<url> --baseline` — capture baseline screenshots (run BEFORE deploying)
- `<url> --pages /,/dashboard,/settings` — specify pages to monitor
- `<url> --quick` — single-pass health check (no continuous monitoring)

### Phase 1: Setup

```bash
mkdir -p .context/canary-reports
mkdir -p .context/canary-reports/baselines
mkdir -p .context/canary-reports/screenshots
```

Parse the user's arguments. Default duration is 10 minutes. Default pages: auto-discover from the app's navigation.

### Phase 2: Baseline Capture (--baseline mode)

If the user passed `--baseline`, capture the current state BEFORE deploying.

For each page (either from `--pages` or the homepage):

Run the **Page check** from [browser.md](browser.md), saving the screenshot to `.context/canary-reports/baselines/<page-name>.jpg`.

Collect for each page: screenshot path, console error count (`CONSOLE_ERRORS=`), load time (`loadEventEnd` in `NAV=`), and the text snapshot between `TEXT_START` / `TEXT_END`.
Also run Phase 3's read-only link check for each monitored page and retain the URLs whose `LINK` status is 404. Repeat the same check each monitoring round; other HEAD failures are unknown, not broken links. Compare console messages by identity, not just count, and retain the text snapshot for evidence when a page's content disappears.

Save the baseline manifest to `.context/canary-reports/baseline.json`:

```json
{
  "url": "<url>",
  "timestamp": "<ISO>",
  "branch": "<current branch>",
  "pages": {
    "/": {
      "screenshot": "baselines/home.jpg",
      "console_errors": 0,
      "console_error_messages": [],
      "load_time_ms": 450,
      "broken_links": [],
      "text_snapshot": "<TEXT_START/END content>"
    }
  }
}
```

Then stop and tell the user: "Baseline captured. Deploy your changes, then run the **Canary** branch on `<url>` to monitor."

### Phase 3: Page Discovery

If no `--pages` were specified, auto-discover pages to monitor:

1. `new_page` {url: "<url>"}.
2. `evaluate_script` with:
   ```js
   async () => {
     const links = [...new Set([...document.querySelectorAll("a[href]")].map(a => a.href))].filter(h => new URL(h).origin === location.origin && !/logout|signout|delete|remove|cancel|unsubscribe/i.test(h));
     const out = [];
     for (const l of links) { const r = await fetch(l, { method: "HEAD" }).catch(e => ({ status: "ERR " + e.message })); out.push("LINK " + r.status + " " + l); }
     return out;
   }
   ```
3. `close_page`.

Extract the top 5 internal navigation links from the `LINK` lines (same-origin only — the script already filters). Always include the homepage. Ask:

- **Context:** Monitoring the production site at the given URL after a deploy.
- **Question:** Which pages should the canary monitor?
- **RECOMMENDATION:** Choose A — these are the main navigation targets.
- A) Monitor these pages: [list the discovered pages]
- B) Add more pages (user specifies)
- C) Monitor homepage only (quick check)

### Phase 4: Pre-Deploy Snapshot (if no baseline exists)

If no `baseline.json` exists, take a quick snapshot now as a reference point.

For each page to monitor:

Run the **Page check** for each page with the screenshot saved as `.context/canary-reports/screenshots/pre-<page-name>.jpg`.

Save the same manifest schema as Phase 2 to `.context/canary-reports/pre-monitor.json`, with the screenshots' actual paths. This is a monitoring-start reference, not evidence of pre-deploy health. Use it when no baseline exists; never overwrite an existing baseline during monitoring.

### Phase 5: Continuous Monitoring Loop

Monitor for the specified duration. Every 60 seconds, check each page. Every check re-opens the page from its URL with `new_page` and captures fresh evidence:
Record the start and deadline. After each full round, wait `max(0, 60 - elapsed-round-seconds)` seconds using the host's wait tool or `sleep`. If a round exceeds 60 seconds, start the next immediately and report the actual cadence; never overlap rounds. Stop at the deadline after the current round.

Run the **Page check**, saving the screenshot to `.context/canary-reports/screenshots/<page-name>-<check-number>.jpg`.

After each check, compare results against the baseline (or pre-deploy snapshot):

1. **Page load failure** — `new_page` or a read step returns a tool error, or the page never loads → CRITICAL ALERT
2. **New console errors** — errors not present in baseline → HIGH ALERT
3. **Performance regression** — load time exceeds 2x baseline → MEDIUM ALERT
4. **Broken links** — new 404s not in baseline → LOW ALERT

**Alert on changes, not absolutes.** A page with 3 console errors in the baseline is fine if it still has 3. One NEW error is an alert.

**Don't cry wolf.** Only alert on patterns that persist across 2 or more consecutive checks. A single transient network blip is not an alert.

**After a CRITICAL or HIGH pattern is confirmed on two consecutive checks**, immediately ask the user. A first occurrence is pending, not yet an alert:

```
CANARY ALERT
════════════
Time:     [timestamp, e.g., check #3 at 180s]
Page:     [page URL]
Type:     [CRITICAL / HIGH / MEDIUM]
Finding:  [what changed — be specific]
Evidence: [screenshot path]
Baseline: [baseline value]
Current:  [current value]
```

- **Context:** Canary monitoring detected an issue on [page] after [duration].
- **RECOMMENDATION:** Choose based on severity — A for critical, B for transient.
- A) Investigate now — stop monitoring, focus on this issue
- B) Continue monitoring — this might be transient (wait for next check)
- C) Rollback — revert the deploy now, through Step 8 of [land-and-deploy.md](land-and-deploy.md) with its approval
- D) Dismiss — false positive, continue monitoring

### Phase 6: Health Report

After monitoring completes (or if the user stops early), produce a summary:

```
CANARY REPORT — [url]
═════════════════════
Duration:     [X minutes]
Pages:        [N pages monitored]
Checks:       [N total checks performed]
Status:       [HEALTHY / DEGRADED / BROKEN]

Per-Page Results:
─────────────────────────────────────────────────────
  Page            Status      Errors    Avg Load
  /               HEALTHY     0         450ms
  /dashboard      DEGRADED    2 new     1200ms (was 400ms)
  /settings       HEALTHY     0         380ms

Alerts Fired:  [N] (X critical, Y high, Z medium)
Screenshots:   .context/canary-reports/screenshots/

VERDICT: [DEPLOY IS HEALTHY / DEPLOY HAS ISSUES — details above]
```

Save report to `.context/canary-reports/{date}-canary.md` and `.context/canary-reports/{date}-canary.json`.
Per-page and overall status: BROKEN if any confirmed CRITICAL alert occurred; otherwise DEGRADED if any confirmed alert occurred; otherwise HEALTHY. Note resolved incidents separately without erasing them from the run's status. JSON fields: `url`, `started_at`, `ended_at`, `status`, `pages` (URL, checks, latest metrics, status), and `alerts` (severity, URL, first_seen, confirmed_at, evidence, resolved). Unconfirmed transients go in a separate `observations` array.

Write a JSONL entry: `{"skill":"canary","timestamp":"<ISO>","status":"<HEALTHY/DEGRADED/BROKEN>","url":"<url>","duration_min":<N>,"alerts":<N>}`
Append it to `.context/canary-history.jsonl`; never overwrite history.

### Phase 7: Baseline Update

If the deploy is healthy, offer to update the baseline:

- **Context:** Canary monitoring completed. The deploy is healthy.
- **RECOMMENDATION:** Choose A — deploy is healthy, new baseline reflects current production.
- A) Update baseline with current screenshots
- B) Keep old baseline

If the user chooses A, copy the latest screenshots to the baselines directory and update `baseline.json`.

## Rules

- **Speed matters.** The first minutes after a deploy are the point: reach the first monitoring round as soon as the page list is settled.
- **Baseline is king.** Without a baseline, canary is a health check. Suggest `--baseline` before the next deploy.
- **Thresholds are relative.** 2x the baseline load time is a regression; 1.5x may be normal variance.
- **Screenshots are evidence.** Every alert carries a screenshot path.
