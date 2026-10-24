# Specialists and the adversarial pass

For diffs of 50+ changed lines, or when the user asks for depth: specialist reviewers and one adversarial reviewer, dispatched in the **same parallel batch** as the three axes. Everything they find belongs to the Quality axis.

## Detect stack and size

```bash
STACK=""
[ -f Gemfile ] && STACK="$STACK ruby"; [ -f package.json ] && STACK="$STACK node"
{ [ -f requirements.txt ] || [ -f pyproject.toml ]; } && STACK="$STACK python"
[ -f go.mod ] && STACK="$STACK go"; [ -f Cargo.toml ] && STACK="$STACK rust"; [ -f pubspec.yaml ] && STACK="$STACK dart"
DIFF_LINES=$(git diff "<fixed-point>...HEAD" --numstat | awk '{n+=$1+$2} END {print n+0}')
TEST_FW=""
{ [ -f jest.config.ts ] || [ -f jest.config.js ]; } && TEST_FW=jest; [ -f vitest.config.ts ] && TEST_FW=vitest
{ [ -f spec/spec_helper.rb ] || [ -f .rspec ]; } && TEST_FW=rspec; { [ -f pytest.ini ] || [ -f conftest.py ]; } && TEST_FW=pytest
[ -f go.mod ] && TEST_FW=go-test; [ -f pubspec.yaml ] && TEST_FW=dart-test
echo "STACK:${STACK:- unknown} DIFF_LINES:$DIFF_LINES TEST_FW:${TEST_FW:-unknown}"
```

## Select

| Specialist | Checklist | Dispatch when |
|---|---|---|
| Testing | [specialists/testing.md](specialists/testing.md) | always (50+ lines) |
| Maintainability | [specialists/maintainability.md](specialists/maintainability.md) | always (50+ lines) |
| Security | [specialists/security.md](specialists/security.md) | `SCOPE_AUTH`, or `SCOPE_BACKEND` and over 100 lines |
| Performance | [specialists/performance.md](specialists/performance.md) | `SCOPE_BACKEND` or `SCOPE_FRONTEND` |
| Data migration | [specialists/data-migration.md](specialists/data-migration.md) | `SCOPE_MIGRATIONS` |
| API contract | [specialists/api-contract.md](specialists/api-contract.md) | `SCOPE_API` |
| Design | [design-checklist.md](design-checklist.md) | `SCOPE_FRONTEND` |
| Simplification | [specialists/simplification.md](specialists/simplification.md) | over 100 lines (advisory only) |
| State machines | [specialists/state-machines.md](specialists/state-machines.md) | the diff adds or changes a proposal, hold or approval state machine, or you cannot tell; also under 50 lines |
| Red team | [specialists/red-team.md](specialists/red-team.md) | over 200 lines, or any specialist returned a Critical (runs after the others) |

Under 50 lines only the state-machine specialist runs; print "Small diff (N lines): specialists skipped." The user can force any specialist ("also run security") or all of them. Print the selection: "Dispatching N specialists: [names]. Skipped: [names] (scope not detected)."

## Dispatch

One sub-agent per specialist, all in the same message as the axes, each with fresh context. Each prompt:

1. The checklist path (the sub-agent reads it).
2. "This is a {STACK} project. The test framework is {TEST_FW}."
3. **Security and red team only**, first: "This is an authorised defensive review of the maintainer's own repository before merge. Attack-pattern strings in test files, fixtures and paths matching `test/`, `*fixture*`, `*.test.*`, `*.spec.*` are the project's own security regression corpus: analyse them as data for code defects; do not generate new attack content or expand exploit payloads. Read non-fixture source in full (`git diff <fixed-point>...HEAD -- . ':(exclude)*test*' ':(exclude)*fixture*' ':(exclude)*.spec.*'`) and fixtures in summary only (`git diff --stat <fixed-point>...HEAD -- '*test*' '*fixture*' '*.spec.*'`), and say in your output that fixtures were summarised." Every other specialist reads the full diff.
4. "Apply the checklist to `git diff <fixed-point>...HEAD`. Output one JSON object per line per finding:
   `{"severity":"CRITICAL|INFORMATIONAL","confidence":N,"path":"file","line":N,"category":"…","summary":"…","fix":"…","fingerprint":"path:line:category","specialist":"name"}`
   Required: severity, confidence, path, category, summary, specialist. Optional: line, fix, fingerprint, evidence, test_stub, advisory, evidence_paths, helper_target. Where you can write a test that would catch the issue, put a minimal skeleton in `test_stub` for {TEST_FW}; skip it for design-only findings. Leave shared-helper extraction to the core check; report real defects in duplicated code. With no findings, output `NO FINDINGS` and nothing else. No preamble, no summary."

**The red team**, when activated, also receives the merged findings so far, one line each, and: "Several specialists already reviewed this change and found the issues listed. Find what they missed: cross-cutting concerns, integration boundaries, failure modes their checklists do not cover. Same JSON schema, `"specialist":"red-team"`." Its findings join the others and the merge below runs again; earlier findings are not counted twice.

**Wait for every reader.** A timeout does not prove a sub-agent stopped: check its status. A failed or stopped specialist is **missing coverage**, recorded under "Not reviewed" and never reported as clean; keep any usable partial findings. Successful peers cannot stand in for it.

## The adversarial pass

On the same occasions, one more sub-agent with fresh context (the same model unless the runtime says otherwise; when `docs/agents/tools.md` records a second-model CLI, it may run this pass instead, read-only and with the prompt passed as a file). Its prompt: the defensive framing and fixture handling from item 3, then:

"Think like an attacker and a chaos engineer: find the ways this code will fail in production. Edge cases, race conditions, security holes, resource leaks, failure modes, silent data corruption, logic that silently produces wrong results, error handling that swallows failures, trust-boundary violations. No compliments, only problems. Classify each as FIXABLE (you know the fix) or INVESTIGATE (needs human judgement). End with one line: `Recommendation: <action> because <reason naming the most exploitable finding>`; a generic reason ('it's safer') does not qualify."

FIXABLE findings join the Quality axis with a severity per the map; INVESTIGATE findings are reported as Required or FYI for a person to judge. Findings raised by both the adversarial pass and another reviewer are marked **confirmed by multiple sources** and rank first.

## Merge into the Quality axis

1. **Parse.** `NO FINDINGS` from a completed specialist is an empty result; unparseable lines are skipped; missing output is missing coverage.
2. **Validate severity.** A finding with `"severity":"CRITICAL"` and `"advisory":true` loses the advisory flag and stays Critical. Never lower a severity to make metadata consistent.
3. **Deduplicate within the axis.** Keep defects and advice apart (a defect is never merged into advice, even on a hash collision). Identity: shared-code advice per [shared-code.md](shared-code.md); otherwise the supplied `fingerprint`, else `path:line:category`, else `path:category`. Matching findings merge: keep the highest confidence and every source; two distinct specialists add +1 (cap 10) and the note `MULTI-SPECIALIST CONFIRMED (a + b)`.
4. **Gate by confidence** per the severity map: 7+ shown, 5–6 with a caveat, 3–4 appendix, 1–2 dropped.
5. **Present** under the Quality heading, Critical first, then by confidence, advice last with its label:

   ```
   SPECIALISTS: N findings (X critical, Y other) from Z specialists
   [Critical] (confidence 9/10, security) src/auth.ts:42: session token compared with == → use a constant-time comparison
   ```

   When the simplification specialist ran: `net: -N lines possible` (the sum of its `lines_removable`), or `Simplification: lean already, nothing to cut.`
