# Shared exploratory QA

The probe procedure every QA run uses. The **caller** (`/sf-qa` test and fix, `/sf-qa`
report only, or `/sf-ship`'s pre-landing review) owns decisions, tests, fixes and
publication. Discovery itself writes only reports, evidence and owned fixture state: no
workflows, framework installs or publication.

## 0. Preparation

Complete these Reads in order, in earlier responses than the first probe, awaiting each
result:

1. [scope.md](scope.md), and select the surfaces.
2. The selected surface methods: [system-functional.md](system-functional.md) for
   functional surfaces; [qa-patterns.md](qa-patterns.md) for browser surfaces only.

A supplied target, an isolation description, a section index or a remembered method is
not a completed Read; a Read already completed in this invocation is not repeated.
Missing or unreadable assets, prerequisites or permission block the affected probes, not
independent safe checks; report them as QA setup blockers.

## 1. Charter and preflight

Reuse the resolved `REPORT_DIR`; otherwise own a fresh subdirectory of
`.context/qa-reports`. Write a **charter** per behavior into the report as Markdown:
contract, risk, entrypoint, isolation, exit condition, source, commands and inputs. State
each expected result before probing; never invent the plan afterwards.

Probe budget:

- `/sf-ship`: no plan or server required; a smoke budget of 5
  minutes or 12 probes, whichever comes first (`SECONDS=300` across surfaces). Its
  explicit plan checks and revalidation remain required beyond it.
- `/sf-qa`: browser Quick `SECONDS=180`; browser Full or Regression `SECONDS=900`;
  functional modes have no default total timer.

Use the shorter of the mode and caller limits; an unlimited mode takes the caller's bound.
Without a total limit, create no `DEADLINE_FILE` and announce finite command timeouts.
Stop when the scoped contracts are tested or blocked: each documented input rule of each
field needs a probe that breaks only that rule and satisfies every other; rules left
uncovered at a cap go in the limits. Checkpoints live in `REPORT_DIR`, or
`REPORT_DIR/browser` and `REPORT_DIR/functional` in a mixed standalone run, with one final
report at `REPORT_DIR`. Caller paths win.

Names (quote every path):

- `PROBE_DIR`: this surface's owned probe directory, per the line above.
  `DEADLINE_FILE`: `PROBE_DIR/deadline.json`, present only for a bounded run.
- `SECONDS`: the total probe budget. `NNN`: a fresh three-digit ID (001, 002, ...) for
  each capture or checkpoint, never reused.
- The **deadline guard**: **start** writes the deadline as a UTC epoch, **status**
  prints the remaining seconds (`expired` at 0 or below), **run** executes one command
  stopped at the deadline:

  ```bash
  echo $(( $(date -u +%s) + <SECONDS> )) > "DEADLINE_FILE"                    # start (use EARLIER_UTC's epoch when sooner)
  _R=$(( $(cat "DEADLINE_FILE") - $(date -u +%s) )); echo "remaining=${_R}s"; [ "$_R" -gt 0 ] || echo expired   # status
  timeout "$(( $(cat "DEADLINE_FILE") - $(date -u +%s) ))" COMMAND ARGS       # run
  ```

- The **evidence capture** (functional): one command, its exit code, stdout, stderr and
  duration stored under `PROBE_DIR/.qa-evidence/NNN/`:

  ```bash
  _E="PROBE_DIR/.qa-evidence/NNN"; mkdir -p "$_E"; _S=$(date +%s)
  timeout "LIMIT" COMMAND ARGS >"$_E/stdout" 2>"$_E/stderr"; echo $? >"$_E/exit"; echo $(( $(date +%s) - _S )) >"$_E/duration"
  ```

  `LIMIT` is the guard's remaining seconds when bounded, else a finite command timeout.
  Classify each capture `complete`, `incomplete` (exit 124 or truncated output) or
  `sensitive` (it carries credentials or private payloads).

Start the guard once, before the baseline, when bounded; `EARLIER_UTC` is the caller's
absolute deadline, if any. Run every functional probe through the evidence capture.
Output is public only when it is approved public or synthetic output: screen every
capture for credentials before quoting it, and await a safe Read of a complete private
capture's `stdout`. Sensitive and incomplete captures cannot anchor a checkpoint. Bounded
browser runs check the guard's status before each browser action. No detached probes.
Never reset `DEADLINE_FILE` or bypass the guard; expiry or an invalid or missing
`DEADLINE_FILE` stops probing, and unfinished coverage is reported.

## 2. Probe loop

A probe is one native command or interaction plus its checks, excluding bookkeeping.
Never batch probes.

1. **Success first:** demonstrate the output and the durable effect. Guard when bounded;
   await completion.
2. **Decide whether another probe is needed.** When bounded, run the guard's status.
   Expired, or no safe next probe: stop exploring and write the report (§4), not a
   checkpoint. Otherwise **publish before probing**:
   - **Classify the last result first.** Public or synthetic observations are kept whole
     and unchanged, including owned fixture paths, IDs, hashes and existing credential
     placeholders (an absolute state path is not a secret). Actual secrets and private
     payloads are withheld, with the redaction and replay limits disclosed in the report.
     If no safe exact observation remains, stop that probe chain; never invent a
     substitute path, identity or state.
   - Create (browser) or compose (functional) `exploration-NNN.json` in `PROBE_DIR`, with
     exactly four top-level fields: `observationCommand` (the last completed probe's full
     outer command, guard included), `observed` (its exact decoded child JSON with no
     wrapper or extra keys, or its full non-JSON text with whitespace and fences
     verbatim, never summarized, relabeled or timed), `hypothesis` (why the next
     command), `nextCommand` (the exact command or request, guarded when bounded).
   - Functional `observed` is copied byte for byte from `PROBE_DIR/.qa-evidence/PREV/stdout`
     (PREV: the last complete capture), never retyped. Keep every safe JSON key, value
     and identity hash unchanged. An incomplete capture is reported as a limit, never
     reconstructed.
   - Check the fields, then Write the checkpoint and await success before dispatching.
     No drafts or placeholders; a published note is never corrected, backfilled or
     overwritten.
3. **Run that exact probe**, under the guard when bounded. Report refusals as not run and
   keep the initial state, inputs and results. Repeat from step 2.
4. **Confirm a failure** by replaying the exact failing command or request from the same
   initial fixture state through steps 2–3 (same native command, fresh capture ID), then
   minimize through the same gates. Another input or a regression test is not that replay.
   Expiry leaves confirmation or minimization incomplete.
5. **Revalidate after change.** When source, commands or fixtures change (a test-and-fix
   repair, or the user or another process), re-review the affected contracts (unproven
   means affected) and return to step 2 for each. Report-only runs and discovery callers
   never make those changes themselves. Keep the original limits and notes; outcomes
   change only on fresh evidence.

## 3. Parent handoff

- **`/sf-qa` test and fix:** the fix loop owns severity, root cause and the regression
  gate before any verified repair.
- **`/sf-qa` report only:** return proposals only, each a test stub with its failing
  contract and expected assertion; create no tests and freeze no buggy output.
- **`/sf-ship`:** return each verified defect to its fix queue; `test_stub` proposals need the user's approval there.
- **Planning:** propose charters only; run nothing.

Choose the smallest native test: unit for logic, integration for state and requests, E2E
only when smaller tests miss the journey, not automatically both. Mock only unrelated
services. Never freeze buggy output, weaken tests or delete valid red tests.

**Test value bar.** Write or propose a test only when it answers all four; otherwise
extend an existing test or drop it:

1. What observable behavior, invariant or independent contract does it protect?
2. What credible regression makes it fail? (A reproduced bug answers 1 and 2.)
3. Why does existing coverage not catch that? Prefer a row in an existing table-driven
   test or shared fixture over a near-duplicate.
4. Does it need a production seam (export, flag, wrapper, injection hook) no production
   caller needs? Then test at the real boundary instead.

Value card: `Value: protects=<...>; fails_when=<...>; why_new=<...>; seam=none;
no_claim=<...>` (seam is `none` or its name; `no_claim` is one sentence on what green
does not prove and which fixtures or mocks stand in for what; it never waives a required
live check). Each field at most 160 UTF-8 bytes (clamp to 157 plus `...`; written JSON
keeps full values). A missing upstream card never blocks: derive it; ignore unknown
fields.

Example: `Value: protects=refundPayment rejects an empty reason; fails_when=the reason
guard is removed or inverted; why_new=billing.test.ts covers processPayment only;
seam=none; no_claim=provider acceptance (mocked provider; unit only)`. Rejected
(covered_elsewhere): "checkout renders"; checkout.e2e.ts:15 covers it, so extend that
test.

## 4. Final report

Use the surface's report template and link each checkpoint; keep browser scores,
functional outcomes and proposed versus executed tests separate.

Write `PROBE_DIR/annotations.json`: `{evidence: [{capture, command, contract, expected,
classification}], limits: ["checkpoint 001"]}` (limits is a non-empty string array; a
browser-only run has `evidence: []`). Before the Markdown, fill each evidence entry's
observed field from its capture's `stdout`, and list one `[checkpoint
NNN](exploration-NNN.json)` link per checkpoint (once per `PROBE_DIR`); you classify.
Annotate every safe capture, failures and replays included: an omitted capture is
withheld and keeps the verdict inconclusive. A capture taken before an input change is
`superseded`, closed only when the same command reran on current inputs; after a fix,
every earlier capture is superseded, even from a client that prints no snapshot, so
rerun each one the verdict relies on or report it as an open remainder. Disclose withheld
and incomplete evidence.

Evidence is invocation-local; `/sf-ship` reruns once per invocation. Missing
prerequisites, expectations or observations, timeouts and refusals never pass. A pass
requires every required current-input contract to pass with no required remainder. A
required failure leaves `/sf-ship` blocked unless the
user explicitly accepts that named risk; non-interactive runs return blocked. Only a
nonbehavioral diff may be not applicable (with a reason); prompts and templates are
behavioral. Report blocked, inconclusive and not-run coverage without claiming success.
