# Reality rows

The reality rows the CEO and Engineering lenses must carry. The CEO lens works them in
0B; the Engineering lens works them in Scope Challenge A. A review emits one
grep-able line per row:

```
REALITY: <row> pass|finding|n/a <summary> <file:line>
```

A receipt is `path:line`, `path:line-line` or a commit sha; a row without one
is not a row. Tier 1 rows are required in every review and never `n/a`. Tier 2
rows are required only when the review's detected scope (`db`, `perf`,
`search`, `incident`, `dependency`) names theirs; otherwise they may be omitted
or marked `n/a`. A tier 1 row marked `n/a` is missing.

## Rows

Each row carries its check and the incident that earned it.

- premise-table (tier 1): `premise | claim | file:line receipt | verdict` for every factual claim; no receipt means `unverified`, and `unverified=<n>` is scored in the Completion Summary.
  Incident: A wave rested on "13 of 28 threads ran nothing" with no per-thread evidence; the first table found 1 FALSE and 3 UNVERIFIED claims in 27.
- already-done (tier 1): `git fetch origin <base>`, then `git log origin/<base> --since=<ask date> -- <named files>` and `--grep <symbols>`; report a hit before any task is written.
  Incident: A fix was re-planned and rebuilt the day after main merged it; nobody read the base log.
- surface-check (tier 1): Every named CLI command, flag or HTTP route verified against the registry or `--help`; a miss is a finding.
  Incident: The installer relied on `bun upgrade --version`; `bun upgrade --help` on the target listed only `--canary`.
- binding-decisions (tier 1): Read the plan's `## Binding decisions` and the decisions already recorded in the plan file (decision ledgers, CEO Plan); they outrank project defaults and CLAUDE.md, and a reintroduced overruled default is a finding.
  Incident: An owner decision taken mid-review was undone two phases later by the project default it had replaced.
- numbers (tier 1): Every number re-derived from raw data and tagged `[measured: <source>]` or `[estimated]`; a cited baseline is `[re-measure before gate]`.
  Incident: An effort table with no basis was credited until a reviewer re-counted it; quoted parity ratios were off by two decimals.
- deferred-asks (tier 1): The linked issue's requests the plan leaves out, each with its reason, listed in the gate template.
  Incident: An issue asked for six things; the plan shipped four and the owner found the other two after merge.
- pr-count (tier 1): The PR count the repo's ship policy states (default one PR per wave); a split shows the queue cost per extra PR and checks user-facing references across it.
  Incident: A five-PR wave became seven in the Eng phase; the cost of each extra gate had never been stated.
- prior-art (tier 2, scope dependency): For a vendored or patched dependency or a known library behavior: search the upstream tracker and open PRs; record `adopt <link>` or `diverge because <reason>`.
  Incident: A patched vendored hunk was dropped on upgrade because nobody had recorded why the fork diverged.
- transaction-semantics (tier 2, scope db): For a driver, pool or protocol change: the surrounding transaction on idle, pooled and reserved connections; crash robot rerun after the change.
  Incident: A pool change ended transactions on idle connections; the crash robot was not rerun.
- contract-assumptions (tier 2, scope dependency): One row per default or flag assumed from another repo, rechecked against merged code before the next stage.
  Incident: A sibling repo's default changed between planning and build; the plan still assumed the old flag.
- falsification-box (tier 2, scope incident): Top hypothesis, the evidence that kills it, a time box, and the action in each branch.
  Incident: An outage plan chased its first hypothesis for a day with nothing stated that would have killed it.
- stop-reasons (tier 2, scope incident): Every new stop reason, hold code and progress line names the test that triggers it.
  Incident: A hold code shipped with no test that could produce it; it first fired in production.
- reporter-environment (tier 2, scope incident): A repro that does not match the reporter's environment is `class not confirmed`, never `ruled out`.
  Incident: A bug was "ruled out" on a different runtime than the reporter's; the reporter still had it.
- units (tier 2, scope perf): A change to an input's units or accuracy lists every threshold that consumes it and shows the re-tune.
  Incident: A timing input moved from ms to s; three downstream thresholds kept their numbers.
- perf-table (tier 2, scope perf): Machine, engine, data size, N, p50/p95, statistics state, base and branch interleaved, pathological and steady-state cases, `reproduced on main?`.
  Incident: A speedup came from one warm-cache run with no base comparison; main was as fast.
- recall (tier 2, scope search): A search or query-plan change reports recall against exact search across scope buckets.
  Incident: A query-plan change sped up the hot path and dropped recall on the smallest bucket.
- dependency-fallback (tier 2, scope dependency): What ships without each predecessor, and by when.
  Incident: A stacked PR waited on a predecessor that never merged; nothing said what it could ship alone.
- obligation-tiers (tier 2, scope dependency): Must-ship, next PR, deferred, under a stated size budget; the ledger status column carries the tier.
  Incident: A PR outgrew review because every accepted finding was treated as must-ship.

## Check

Before the phase closes, check the review's `REALITY:` lines against the rows
above and print one line:

```
PLAN_REALITY: phase=<ceo|eng> rows=<present>/<required> missing=<ids|none> [unreceipted=<ids>] [unreceipted_numbers=<n>] [unquoted=<n>] [unverified=<n>] verdict=complete|repair
```

- **Required:** every tier 1 row, plus each tier 2 row whose scope is detected.
- **Missing:** a required row with no line, or a tier 1 row marked `n/a`.
- **Unreceipted:** a required row whose line carries no receipt.
- **Unreceipted numbers:** a clause in a row that states a measured number (a unit such as s, ms, %, $, tokens, MB, GB or ×, or a number after measured/costs/takes/took) with no receipt, script or command of its own and no `[estimated]` or `[re-measure before gate]` tag. Print one `NUMBER_UNRECEIPTED: <clause>` line each.
- **Unquoted:** a row claiming a decision rule exists without quoting it, linking its `file:line`, or a fenced or quoted block right after it.
- **unverified=** carries the premise table's count.

`verdict=complete` only with nothing missing, unreceipted, unquoted or unreceipted
in numbers; otherwise `repair`. Repair twice, then warn at the gate.
