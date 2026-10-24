# Fix loop (test and fix)

Runs after the baseline probes and their report of findings, only in the test-and-fix
branch. Report-only runs never load it.

## Triage

Sort issues by severity ([../references/issue-taxonomy.md](../references/issue-taxonomy.md))
and apply the fix tier. Lower-tier issues, and those not fixable from source (third-party
widgets, infrastructure), are **deferred**. Before fixing each component or page, search
the lessons folder again with one noun of letters, digits or hyphens only
(`checkout-button`, `payment`; never a path, quotes or spaces) and name an applicable
lesson in one sentence, or continue if none applies.

## For each fixable issue, in severity order

### 1. Diagnose

Use the probe loop's minimized exact replay and record actual against documented behavior
before any edit. Environment failures and unclear contracts never authorize a repair: ask.
For browser defects, diagnose with the browser's own evidence:

```
UI bug:          reproduce (navigate, trigger, screenshot) → inspect (console errors and
                 warnings, the DOM element, computed styles, the accessibility tree) →
                 diagnose (actual vs expected DOM and styles; is the right data reaching
                 the component? root cause in HTML, CSS, JS or data?)

Network issue:   capture (network list, trigger the action) → analyze (URL, method,
                 headers, payload, status, body, timing) → diagnose: 4xx = client sends
                 wrong data or URL; 5xx = server error (check server logs); CORS = origin
                 headers and server config; timeout = server time or payload size;
                 missing request = the code never sends it

Performance:     baseline trace → identify (LCP, CLS, INP, long tasks over 50ms,
                 unnecessary re-renders) → fix the specific bottleneck → a second trace
                 compared with the baseline
```

### 2. Regression test before repair

The reproduced bug already answers what the test protects and what makes it fail; answer
the rest of the test value bar in [exploratory.md](exploratory.md) §3 and write its value
card. Extend an existing table or fixture when one covers the boundary; never add a
production seam for the test. Match 2-3 nearby tests' naming, imports, assertions and
fixtures, and detect the command that runs them. Write the new native test, run it before
the repair, and prove the defect caused its failure, not a bad fixture, import or service.
Attribute it in the language's comment syntax:

```text
// Regression: ISSUE-NNN — short defect description
// Found by /sf-qa on YYYY-MM-DD
// Report: <REPORT_FILE>
```

Name it `{component}.regression-N.test.{ext}` with N one above the highest existing
(starting at 1); never replace an existing file. Choose the smallest native level (unit
for logic, integration for state and requests, E2E only when smaller tests miss the
journey). A CSS-only defect may rest on browser evidence; missing infrastructure stays
coverage debt. Keep a valid red regression; narrowly correct a proved fixture or test
error, or report the bug unresolved. A clear, healthy but uncovered contract may gain a
passing test with no product edit.

### 3. Fix

Read the surrounding source and make the minimal fix in the responsible files only. No
unrelated refactors or features.

### 4. Re-test

Re-run the regression, the original failing probe and the adjacent happy path, and
inspect each final state: an accepted request does not verify a worker repair. Browser
defects: read [browser-verify.md](browser-verify.md). A failed or unavailable recheck
stays unresolved: try one revised minimal fix, else classify it reverted.

### 5. Commit verified work

```bash
git add <only-verified-source-and-regression-files>
git commit -m "fix(qa): ISSUE-NNN — short description"
```

One verified fix with its regression per commit, never unrelated fixes. A healthy-contract
test commits as `test(qa): regression test for {contract}`. Leave unresolved repairs and
valid red regressions uncommitted and tell the user what remains.

### 6. Classify and record

- **verified:** passed step 4 (with a native regression where one is possible); disclose
  any missing coverage.
- **best-effort:** fix applied but not fully verifiable (needs auth state, an external
  service).
- **reverted:** a regression appeared or the finding stayed unresolved: undo only this
  run's repair (revert its commit if made), keep the valid regression and evidence, mark
  the issue deferred. Never discard user changes.

Record per issue: the test file, command, attribution, tested boundary, value card and
red/green evidence, or why the test is deferred.

### 7. Self-regulation

Every 5 fixes, and after any revert, check whether the loop is doing more harm than good.
Stop immediately after two reverts, or after one edit to a file unrelated to its finding.
Stop too when fixes keep spanning many files or only low issues remain. Show the user what
was done and ask whether to continue. Test-only commits do not count toward these limits.
Hard cap: 50 fixes.

## Final QA

Re-run every affected contract and adjacent happy path on the final inputs; rechecks a
caller requires are never skipped as unaffected. Browser surfaces: recheck the affected
pages and compute the final health score. Warn prominently about a worse score or a
regressed contract. Blocked or inconclusive rechecks never verify a repair.

## Limits

Outside an explicitly approved test bootstrap, tests come only from step 2. Never modify
CI configuration or weaken, freeze or delete existing tests. When in doubt, stop and ask.
