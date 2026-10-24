# Coverage audit

Stage 5 of [the Open a PR branch](../open-pr.md). The goal is that every changed behavior is protected by a test that would catch a real regression; the test count is not a goal. The audit judges what the diff actually codes, not what the plan promised.

## Dispatch

Run the audit in a fresh subagent (Agent tool, `general-purpose`, in the foreground: wait for its result). The subagent gets a clean context; you, the parent, own the gate. Work inline only under **Audit failure** below.

**Generation allowance:** at most two generation passes per invocation, counted before each dispatch (failures and zero-test passes included); re-entering the stage never resets the count. With both used, a dispatch is audit-only. Per pass: at most 30 code paths, 5 new or extended tests (the `Generation cap:` in `## Test Coverage` overrides 5), and 2 minutes of exploration per test.

Give the subagent: `<base>`, the test command and conventions from stage 4 (or the declined bootstrap), the paths and commands it may use, the remaining gaps from an earlier pass, passes used, and the `## Test Coverage` values the gate reads. No allowance means audit only; a missing permission is not approval. Then paste the prompt below.

````text
You are running a coverage audit for a ship workflow. Read `git diff origin/<base>` (uncommitted tracked changes included) and the relevant untracked source and tests. Do not commit or push. Do only this audit; return any decision the user must make to the parent instead of asking.

Generation: <allowed|audit-only>; passes used: <N> of 2. Audit-only overrides every generation instruction below.

1. Trace every changed codepath. Read each changed file in full in its own read before drawing anything. From each entry point (route, exported function, listener, render) follow the data: where input comes from, what transforms it, where it goes, what can go wrong (null, invalid input, network failure, empty collection). Diagram every added or modified function, every branch (if/else, switch, guard, early return), every error path, every call into code with its own branches, and every edge input.

2. Map user flows, interaction edge cases and visible error states: the journey through the changed code; double submit, navigating away mid-operation, stale data, slow connection, two tabs; what the user sees on each handled error and whether they can recover; zero, one, maximum and huge inputs. A flow with no test is as much a gap as an untested branch.

3. Check every branch and flow against existing tests. Rate each test:
   ★★★ behavior with edge cases and error paths · ★★ correct behavior, happy path only · ★ smoke, existence or trivial assertion (weak: never counts as coverage).

   Test value bar. Propose or write a test only with all four answers; otherwise extend an existing test or drop the idea:
   1. What observable behavior, invariant or contract does it protect?
   2. What credible regression makes it fail?
   3. Why does existing coverage not already catch that? Prefer a new row in an existing table-driven test or fixture over a near-duplicate.
   4. Does it need a production seam (export, flag, wrapper, hook) no production caller needs? Then test at the real boundary instead.
   A test that breaks under a behavior-preserving refactor asserts implementation: rewrite it at the owning boundary, unless exact output is the declared contract (goldens, prompt bytes, wire formats).
   Retention bar: keep a test that independently enforces a public API, protocol, config, migration, storage, security, platform, default, prompt-byte, golden, package, release or architecture contract. Static or slow is no reason to delete.

   Value card, as a header comment in each generated or extended test beside its attribution: `Value: protects=<...>; fails_when=<...>; why_new=<...>; seam=none|<name> (non-test callers: N); no_claim=<what green does not prove, and which mocks stand in for what>`. Each field at most 160 bytes. With no comment syntax for the file type, put the card in the PR body's Test value details.
   Example: Value: protects=refundPayment rejects an empty reason; fails_when=the reason guard is removed or inverted; why_new=billing.test.ts covers processPayment only; seam=none; no_claim=provider acceptance (mocked provider; unit only)

   Unit, E2E or eval: mark [→E2E] for a common flow across 3+ components, an integration point where mocks hide real failures, or an auth, payment or data-destruction flow; mark [→EVAL] for a prompt template, system instruction or tool definition change, or a critical LLM call; keep unit tests for pure functions, side-effect-free helpers, single-function edge cases and rare internal flows.

4. Regressions. Code that worked before and the diff broke (changed existing behavior, uncovered changed path, a new failure mode for existing callers) gets a regression test immediately, without asking; when unsure, write it. Prove it red first: it must fail at HEAD in its own assertion before any repair (passing at HEAD drops the regression label; an import, fixture or environment failure is a test defect: correct once or drop). Unless told `Base control: off`, run it once at base as the control, within 90 seconds per test (`Base control budget:` overrides) and 3 minutes per run: `git worktree add --detach <tmp> origin/<base>`, copy in the test and its new test-only fixtures at the same paths, link `node_modules` when present, run the single-test command in <tmp> under `timeout`, then `git worktree remove --force <tmp>`. Install nothing and run no build there. Passing at base is the control; an assertion failure at base marks the test invalid (correct once or drop); any other failure is "base control unavailable: <reason>". Record per test: `Regression proof — fails at HEAD: yes · passes at base: yes | unavailable (<reason>) | manual · passes after fix: yes | pending`.

5. Output the coverage diagram, code paths and user flows together:

```
CODE PATHS                                            USER FLOWS
[+] src/services/billing.ts                           [+] Payment checkout
  ├── processPayment()                                  ├── [★★★ TESTED] Complete purchase — checkout.e2e.ts:15
  │   ├── [★★★ TESTED] happy + declined + timeout      ├── [GAP] [→E2E] Double-click submit
  │   ├── [GAP]         Network timeout                 └── [GAP]        Navigate away mid-payment
  │   └── [GAP]         Invalid currency
  └── refundPayment()                                 [+] Error states
      ├── [★★  TESTED] Full refund — :89                ├── [★★  TESTED] Card declined message
      └── [★   TESTED] Partial (non-throw only) — :101  └── [GAP]        Network timeout UX

LLM integration: [GAP] [→EVAL] Prompt template change — needs eval test

COVERAGE: 5/13 paths tested (38%)  |  Code paths: 3/5 (60%)  |  User flows: 2/8 (25%)
QUALITY: ★★★:2 ★★:2 ★:1  |  GAPS: 8 (2 E2E, 1 eval)
Legend: ★★★ behavior + edge + error | ★★ happy path | ★ smoke | [→E2E] integration test | [→EVAL] LLM eval
```

   Use `[GAP]`, `[★★ TESTED]`, `[→E2E]`, `[→EVAL]`; keep user-flow markers off code-path rows. X = paths with a ★★/★★★ test ÷ total paths (value-weighted; the gate uses X). Y = paths with any test ÷ total. A path with only weak tests is uncovered in X, covered in Y, and listed in `weak_gaps`, not `gaps`. Rate only tests reachable from changed paths. A test-only diff returns a skipped audit: null coverage, zero gaps, "No new application code paths to audit."

6. Generate tests (generation allowed and a framework exists). Extend an existing test before creating a file. Error handlers and edge cases first. Match the conventions of 2-3 existing test files. Mock only services unrelated to the behavior under test. [→E2E] paths use the project's E2E framework; [→EVAL] paths its eval framework, or are flagged for manual eval. Never add a production seam for a test. Run each test: a pass is kept and reported (the parent commits it later); a failure is diagnosed as a test defect (corrected once) or a broken product contract (kept red and reported to the parent), never deleted or weakened to manufacture green. Record each declined proposal in `tests_rejected` with a reason code: `duplicate_protects`, `needs_seam`, `incomplete_card`, `no_credible_regression`, `covered_elsewhere`, `implementation_coupled`. Tests you wrote in this pass count as unrated (weak) until the parent's rater rates them. One gap lands in at most one of `tests_extended`, `tests_added`, `tests_rejected`. List each remaining gap under the diagram as a proposed test with its value card. No framework and a declined bootstrap: diagram only, "Test generation skipped — no test framework configured."

7. Report rules: a reported command names the command and its observed result; a command you did not run is not reported; any change you made to a test, validator, CI step, timeout, threshold, snapshot or suppression pragma is listed first, on its own line, with its reason; say what you verified, what you reused and what you could not check.

End with one JSON object on the LAST line:
{"coverage_pct":Y,"coverage_pct_value":X,"gaps":N,"weak_gaps":[{"path":"...","existing_test":"...","reason":"star_one|gate_failed|unrated"}],"diagram":"<full markdown diagram>","tests_added":["path"],"tests_extended":["path"],"tests_rejected":[{"path_or_gap":"...","reason_code":"...","reason":"..."}],"regression_proof":{"red_at_head":N,"base_green":N,"base_unavailable":N},"test_files_before":N,"test_files_after":N}
Use null for an undetermined coverage percentage, never zero.
````

## Parent processing

1. Parse the last line. A missing key counts as empty and a wrongly typed key is ignored, each named in the summary.
2. **Machine checks** on every test written this run: a value card with `protects`, `fails_when`, `why_new` and `seam` filled (else `incomplete_card`); `protects` unique across the run after casefolding and stripping punctuation (a later duplicate is `duplicate_protects`); seam `none`, or a named seam with at least one non-test caller (else `needs_seam`). Move each failure to `tests_rejected` and remove it before anything else reads the diff: delete an untracked new file; for a tracked file, revert only this run's hunk with Edit.
3. **Rating.** When surviving tests were written this run, dispatch one read-only foreground subagent, with no generation permission and no pass used, to rate them against the ★ rubric and the value bar and return `{"coverage_pct_value":N,"weak_gaps":[...]}`. Use those values. A failed or invalid rating skips the gate for this run ("rating unavailable").
4. **Gate edits.** A subagent's green is a claim until you read its gate hunks. List every test, CI, runner or lint config, snapshot and golden hunk in the whole candidate (`git diff "$(git merge-base origin/<base> HEAD)"` plus untracked files), not just the paths it reported, and carry the list into stage 7, whose review asks the disposition question.
5. Keep for the PR body: the diagram, `Tests: {before} → {after} (+{delta} new)`, the coverage line, the test value counts (K added, R rejected, E extended, W weak), each regression proof line, and weak paths as proposed strengthening.

**Audit failure** (a failed or stopped subagent, invalid output, or no result after about ten minutes): confirm the subagent stopped, then run the same audit inline. The fallback recovers the audit; it never passes or bypasses the gate. Partial results stay incomplete, never passing coverage.

## Coverage gate

The parent owns the gate, including after a fallback. It asks; it never hard-fails. Generated tests stay uncommitted until stage 8.

Read `## Test Coverage` in `CLAUDE.md`: `Minimum:` (default 60%), `Target:` (default 80%), `Generation cap:` (5), `Base control:` (`auto` or `off`), `Base control budget:` (90 seconds), `Star rating:` (`auto` or `off`).

**Gate number:** skip the gate with a stated reason when rating was unavailable, the diff is test-only, or coverage is null. `Star rating: off`, or a missing or invalid `coverage_pct_value`, gates on Y and says so. A value above Y is clamped to Y. Otherwise gate on X.

Option A reads "Strengthen the weak tests and generate tests for true gaps ({slots} of {2 × cap} slots left)"; with no slots left it reads "List the remaining gaps as proposed tests in the PR body" and dispatches nothing.

- **At or above target:** pass. List weak paths in the PR body as proposed strengthening.
- **At or above minimum, below target:** ask, stating X, Y, the weak count and the gap count. Recommend A. A) as above; B) ship anyway, I accept the coverage risk; C) these paths need no tests, mark them intentionally uncovered. A with slots runs one more pass and returns here. B and C put their line in the PR body.
- **Below minimum:** ask, recommend A. A) as above; B) override and ship with low coverage. B puts `Coverage gate: OVERRIDDEN at {X}%` in the PR body.

**Spawned or unattended sessions** take A limited to true gaps within the remaining slots, never edit tests for weak paths, and list weak paths as proposed strengthening.

## Test plan for QA

After the diagram, write `.context/<branch>-ship-test-plan-<YYYYMMDD-HHMMSS>.md` so `/sf-qa` can use it: affected pages or routes (what to test and why), key interactions, edge cases, and the critical end-to-end paths.
