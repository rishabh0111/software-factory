# Verify report: <run-id>

Overall: <pass | fail>
Fingerprint: <40-hex wtree, the same at start and end>
Head: <full sha> on sf/<run-id>
Base: <default_branch> @ <merge-base sha>
Date: <UTC>
Scope: <frontend, backend, api, tests, migrations, prompts, auth, config, agent-config, docs> (paths under .software-factory/ excluded)
Isolation: <container | host>

## Gates

| # | Gate | Result | Command | Evidence |
|---|---|---|---|---|
| 1 | build | pass | `<command>` | evidence/build.log: exit 0 |
| 1 | lint | n/a (no command) | | |
| 1 | typecheck | pass | `<command>` | evidence/typecheck.log: exit 0, 0 errors |
| 2 | test | pass | `<command>` | evidence/test.log: 214 passed, 0 failed, 3 skipped (unchanged) |
| 3 | regression | pass | `<red command (original)>` | evidence/regression-1.log, regression-2.log: exit 0 twice (was 1 in debug-red-final.log) |
| 4 | floor-guard | pass | `node .software-factory/bin/floor-guard.mjs --base main` | evidence/floor-guard.log: clean (or: 2 findings, 2 accepted-by-rule, see Notes) |
| 4a | scanners | pass | gitleaks, osv-scanner | evidence/scan/summary.md: 0 secrets in <merge-base>..HEAD; package-lock.json 0 new high+ advisories, 1 pre-existing |
| 5 | mutation | pass | `<command>` | evidence/mutation.log: 41 of 46 mutants on changed lines detected (89%, threshold 60%); changed-line coverage 92% (or: n/a (no mutation tool; fallback 2 of 3 killed)) |
| 6 | holdouts | pass | holdout runner SPEC-<slug> | evidence/holdouts-<sha7>.md: full, 7 of 7 passed (or: targeted, 2 of 2 run, 5 carried from <sha7>) |
| 6a | migrations | n/a (no migrations in scope) | | (or: up, down, up exit 0; schema dumps equal) |
| 6b | evals | n/a (no prompts in scope) | | (or: `<commands.eval>`: 48 passed, 0 failed, 0 skipped) |
| 7 | app | pass | app checker | evidence/app/: 3 of 3 capabilities, no new console errors |
| 8 | API contract | n/a (no OpenAPI document) | | |
| 9 | explore | pass | explorer | evidence/explore/findings.md: 22 probes, 4 flows, 0 blocking, 2 should-fix, 1 pre-existing |
| 10 | design | pass | explorer | evidence/design/findings.md: 2 pages at 375/1440, 0 blocking, 3 should-fix |
| 11 | DX | n/a (no developer-facing change) | | |
| 12 | performance | pass | `<benchmark command>` | evidence/perf/summary.md: 0 regressions over 10% (p50 request 41.2 → 42.0 ms, +1.9%) |

Result values: pass, fail, error (couldn't check), pre-existing (gates 1, 2 and 6b: every failure also occurs on the base; comparison in evidence/baseline-<label>.md), n/a (reason), skipped (earlier gate failed), waived (who, see runs/<run-id>/decisions.md). Gates 9 to 11 fail only on blocking findings; should-fix and pre-existing findings are listed below and don't affect Overall.

## Findings

<Only when there is anything: pre-existing failures from gates 1 and 2, new lint warnings, scanner, mutation, coverage and telemetry findings, and findings from gates 9 to 11. They don't affect Overall. Blocking findings also appear under For the builder. Pre-existing critical or high findings, crashing base commands and pre-existing failing tests get an issue draft for sf-triage (qa-mode.md, Issue drafts).>

| ID | Gate | Severity | Status | Finding | Evidence |
|---|---|---|---|---|---|
| X-1 | explore | medium | should-fix | Cart total flashes "NaN" while the discount request is in flight | evidence/explore/x-1.png |
| D-1 | design | medium | should-fix | Coupon field label is 11 px; the rest of the form uses 14 px | evidence/design/cart-1440-after.png |
| X-2 | explore | high | pre-existing, draft evidence/explore/issues/X-2.md | Order history 500s for accounts with no orders (same on base) | evidence/explore/x-2.json |
| B-1 | test | - | pre-existing, draft evidence/baseline/issues/test.md | `npm test` crashes before any test runs: `<first error line>` (same on base) | evidence/baseline-test.md |
| L-1 | lint | - | should-fix | New `complexity` warning at src/slug.js:12 | evidence/lint.log |
| S-1 | scanners | medium | pre-existing | lodash 4.17.20: GHSA-xxxx, fixed in 4.17.21 | evidence/scan/osv-1.json |
| M-1 | mutation | - | should-fix | src/cart.js:41 `>` to `>=` survived: no test checks the boundary | evidence/mutation-fallback/m2.log |
| C-1 | coverage | - | should-fix | Changed lines not covered: src/cart.js:50-58 | coverage/lcov.info |
| T-1 | app | - | should-fix | Induced 400 on /cart not found in the log by request ID | evidence/app/cart-telemetry.txt |

## For the builder

<Only when Overall is fail. One line per item, so sf-build can act on it.>

- build, lint, typecheck, test: `<new failure signature>` (only failures not on base; see evidence/baseline-<label>.md); add `flaky (<k> of 3 failed alone): check order dependence or timing before changing logic` when the rerun says so
- regression: `<red command (original | minimised)>: exit <code> on run <1 | 2>`
- floor-guard: `<rule> <file>:<line>`
- scanners: `secret <rule> <file>:<line> <sha7>` (never the value) or `<package> <version>: <advisory ID> (<severity>), fixed in <version>`
- mutation: `<file>:<line> <mutator> survived`
- coverage: `changed-line coverage <x>% below the project's <t>%: <file>:<lines>`
- migrations: `<migration file>: <up | down | second up> failed: <first error line>` or `schema differs after down/up: <object>`
- evals: `<suite>/<case>: <expected> vs <observed>`, or `skipped: <case>`
- holdouts: `SPEC-<slug>/CAP-<n>: partial (1 of 3 failed)`. Re-read CAP-<n>'s intent and success statement in the spec; fix from the spec.
- app: `<CAP-n>: <what went wrong>` (`<evidence path>`)
- API: `<METHOD> <path>: <check>`
- explore: `X-<n> <severity>: <steps in one line> — expected <x>, observed <y>` (`<evidence path>`)
- design: `D-<n>: <the task it breaks, page and width>` (`<evidence path>`)
- DX: `DX-<n>: <the documented step or example that fails, file:line>` (`<evidence path>`)
- performance: `<metric>: <base> → <head> (+<pct>%, threshold <t>%)`
- stale: `<gate>: content changed while it ran (<files>)`

## Notes

<accepted-by-rule lines from gate 4, one per finding, in the form gates.md gives; how the UI was driven when not through the browser MCP (`browser: headless CDP fallback (MCP failed: <error>)`); defaults taken (logged in runs/<run-id>/decisions.md, including the 10% performance threshold), scanners or eval command missing from config (recommend sf-setup), a migration with no down path (a person accepts the rollback plan at ship), `auth` in scope, a maintain pass due, fix tickets recommended for commands that fail on base, doc drift fixed in verify.md, gates waived by a person, agent-config paths in the diff that need a person's yes to merge, issue drafts for pre-existing findings waiting for sf-triage, instruction-like text found in the app.>
