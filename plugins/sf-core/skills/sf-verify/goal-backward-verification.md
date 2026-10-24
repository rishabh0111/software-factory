# Goal-backward verification

The end-of-work branch of `sf-verify`: before a ticket, feature or plan is called done, check that its **goal** holds in the codebase, not that its tasks were ticked. A task "create chat component" is complete with a placeholder file; the goal "working chat interface" is not.

Work backwards from the outcome:

1. What must be **true** for the goal to be achieved?
2. What must **exist** for those truths to hold?
3. What must be **wired** for those artifacts to work, and does real **data flow** through the wiring?

Then check each level against the actual code, and write the result as a report.

## Stance

Start from the hypothesis that the tasks were completed and the goal was missed, and let the code falsify it. A completion report, a ledger line or a subagent's summary records what an agent **said** it did; the code records what exists. They often differ.

How verification goes soft, and what to do instead:

- Read the code a report bullet describes, not the bullet.
- Treat "file exists" as level 1 of four; a stub satisfies existence and nothing else.
- When absence of an implementation is observable, the truth is FAILED, not UNCERTAIN.
- Grade every truth on its own evidence; a high share of ticked tasks and the truths that passed early earn the later ones no credit.

**Run it fresh.** The agent that did the work grades it softer. When a subagent tool is available, dispatch a fresh subagent with this file, the plan or ticket path, the spec path and the base commit; it returns the report path and status. Without one, apply the stance above yourself.

## Inputs and the report path

Find the plan, spec or ticket per **Find prior work** in [work-docs.md](../../references/work-docs.md). Hold:

- `$PLAN`: the plan file (when there is one), `$SPEC`: the spec it implements, the ticket's acceptance criteria when the work came from a tracker (read through the tracker doc `sf-setup` wrote);
- `$REPORT`: any completion record (the `sf-execute` ledger, a subagent's summary, a PR body);
- `$BASE`: the commit the work started from (the plan ledger's first base, the branch's merge-base, or ask).

**Pre-flight:** confirm the plan, spec or ticket can be read before checking anything. Unreadable inputs are reported as "verification not run: <what could not be read>", never as a pass.

**The report is named after the work it verifies**, so several plans in one folder never share a report:

| Work | Report |
|---|---|
| A plan file `docs/plans/2026-10-20-chat.md` | `docs/plans/2026-10-20-chat.VERIFICATION.md`, beside the plan |
| A spec with no plan | `<spec-basename>.VERIFICATION.md`, beside the spec |
| A ticket with no plan or spec file | `.scratch/<ticket-slug>/VERIFICATION.md`, and post its summary and status to the ticket as a comment |

Below, `$VERIFICATION` is that path.

## Step 0: previous report

If `$VERIFICATION` exists and its frontmatter has a `gaps:` list, this is **re-verification**: take the must-haves and gaps from it, give failed items the full check (levels 1–4) and passed items a regression check (exists, still substantive), carry its `overrides:` forward, and apply the evidence gate to new anti-pattern findings. The rules: [references/re-verification.md](references/re-verification.md). Otherwise this is an initial verification; continue with Step 1.

## Step 1: load the goal

Read the spec, the plan or the ticket's acceptance criteria, and `$REPORT` if one exists. Extract the goal: the outcome to verify, not the task list.

## Step 2: establish the must-haves

Build one list of must-haves from every source, in this order. Done when every acceptance criterion is on the list and every truth has its artifacts and links.

1. **Acceptance criteria** of the spec or ticket. These are the contract: always verified, whatever the plan says.
2. **The plan**, read for what `sf-plan` writes:
   - the **Goal** line, as a truth;
   - **Global Constraints**, as truths, and each "must not" constraint as a **prohibition**;
   - each task's **Files** (Create/Modify) as **artifacts**, and its **Interfaces** (Consumes/Produces) as **key links** between them;
   - each **Review Focus** line as a **non-inferable truth** (below).
   A plan that carries an explicit `must_haves:` block (truths, artifacts with `min_lines`/`contains`/`exports`, key links with `from`/`to`/`via`/`pattern`, prohibitions) adds those too.
3. **Deduplicate.** When a plan truth restates an acceptance criterion, keep the criterion's wording.
4. **The plan never reduces scope.** If the spec has five criteria and the plan covers three, all five are verified.
5. **Fallback** when neither source yields truths: state the goal, derive 3–7 observable, testable truths, map each to the files that must exist, and each file to what it must be connected to (this is where stubs hide). Write the derived list down before checking it.

**Prohibitions** are negative checks: verified means the must-not did not happen. A prohibition enforced by a test that would fail on a violation is **test-tier**: run that test; a test-tier prohibition with no such test is unverified and flagged, never green. A prohibition only a reader can judge is **judgment-tier**: record your reading as non-authoritative and add it to the human-verification items. Neither tier is ever absorbed silently into `passed`.

**Non-inferable truths** are behaviours the spec does not settle (does `[1,2]` touching `[2,3]` merge? is a "character" a grapheme or a code unit?). A verifier confidently passes these almost every time, because it cannot see a gap it does not perceive; asking yourself "am I sure?" barely helps. So route on the tag, never on your own confidence: a truth from a **Review Focus** line, or one tagged `verification: backstop`, needs **explicit evidence**: a passing test that exercises exactly that case, or behaviour you observed directly. Presence and wiring never qualify. Without explicit evidence, mark it `insufficient_spec` and add a human-verification item asking for a held-out test. Every other truth is graded normally and never abstained.

## Step 3: verify each truth

For each truth: find its supporting artifacts (Step 4) and links (Step 5), then give it exactly one status.

| Status | Meaning |
|---|---|
| ✓ VERIFIED | Every supporting artifact and link passes; for a behaviour-dependent truth, a test exercising the behaviour passed |
| ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Artifacts present and wired, but the truth asserts runtime behaviour no test exercises |
| ⚠️ insufficient_spec | A non-inferable truth without explicit evidence (Step 2) |
| ✗ FAILED | An artifact missing or a stub, or a link not wired |
| ? UNCERTAIN | Cannot be checked programmatically; goes to a human |
| PASSED (override) | Would fail, but an accepted override covers it |

**Behaviour-dependent truths.** A truth whose correctness hinges on runtime behaviour grep cannot see: a **state transition**, or a **cancellation, cleanup or ordering invariant** ("cancels the in-flight task and bumps the generation counter", "resets the busy flag on abort", "rolls back on failure"). Presence and wiring are necessary, not sufficient: the code can be present and wired and still leak state on the exact path the invariant covers. Such a truth is VERIFIED only when one named test exercising the transition passes (Step 8); otherwise it is PRESENT_BEHAVIOR_UNVERIFIED and becomes a human-verification item.

**Overrides.** Before marking a truth FAILED or PRESENT_BEHAVIOR_UNVERIFIED, look for a matching entry in the `overrides:` list of `$VERIFICATION`. A match makes it PASSED (override), with evidence `Override: <reason>, accepted by <who> on <when>`. When a failure looks intentional (an alternative implementation meets the same intent), suggest an override in the report instead of quietly passing it. Matching and the override format: [references/re-verification.md](references/re-verification.md).

**Reliance check (advisory).** Before finalising a VERIFIED truth, ask why it holds, and classify the evidence you recorded (not your confidence). Flag `coincidental-reliance` when the evidence rests on an **undeclared precondition** (state nothing in the work or a declared prerequisite guarantees), an **incidental ordering** (an order or side effect nothing enforces), or a **fixture-only** precondition (the test's setup establishes it; production has no equivalent). Do not flag a precondition the code establishes or defaults, an ordering the code enforces (an `await`, explicit sequencing), a fixture that only supplies input the real caller also supplies, or unease that names no specific state, ordering or fixture. Record `✓ VERIFIED (coincidental-reliance)` and a `coincidental_reliance_items` entry naming what to declare or enforce. It changes no score, no status, and adds no human item.

## Step 4: verify artifacts (four levels)

For each artifact:

```bash
test -f "$path" && echo EXISTS || echo MISSING          # level 1: exists (a directory is not a file)
wc -l < "$path"                                         # level 2: substantive, against min_lines
grep -c -F "$contains" "$path"                          #          against each declared string or export
grep -r -l "$name" "${search_path:-src/}" | grep -v -F "$path"   # level 3: imported or used elsewhere
```

- **Level 2, substantive:** real implementation, not placeholder. A file under its declared size, missing a declared string or export, or matching the stub patterns is a STUB.
- **Level 3, wired:** imported AND used. Imported but unused, or used without import, is PARTIAL; neither is ORPHANED.
- **Level 4, data flows:** for an artifact that renders dynamic data, trace the rendered value back to its source. A chain ending in a static return, a hardcoded literal or a mock instead of a real query is HOLLOW. Procedure and recipes: [references/stub-and-wiring-patterns.md](references/stub-and-wiring-patterns.md).

| Exists | Substantive | Wired | Data flows | Status |
|---|---|---|---|---|
| ✓ | ✓ | ✓ | ✓ (or n/a) | ✓ VERIFIED |
| ✓ | ✓ | ✓ | ✗ | ⚠️ HOLLOW: wired but data disconnected |
| ✓ | ✓ | ✗ | – | ⚠️ ORPHANED |
| ✓ | ✗ | – | – | ✗ STUB |
| ✗ | – | – | – | ✗ MISSING |

With no declared artifacts, report Step 4 as not applicable; with an unreadable plan, as not evaluated. Never as VERIFIED.

On an unfamiliar stack, read only the matching section of [references/stub-and-wiring-patterns.md](references/stub-and-wiring-patterns.md) (components, API routes, schemas, hooks, environment config).

## Step 5: verify key links

Key links are the connections the goal depends on; if one is broken the goal fails with every artifact present. Most stubs hide here.

```bash
grep -n -E "$pattern" "$from" || grep -n -E "$pattern" "$to"   # link declares a pattern
grep -n -F "$to" "$from"                                        # link declares none: does the source reference the target?
```

WIRED: the pattern is found, or the source references the target. PARTIAL: the source exists but the pattern is absent. NOT_WIRED: the source is missing or never references the target. Without declared links, check the four standard ones for the stack: **Component → API** (the call is made and its response used), **API → Database** (a real query whose result is returned), **Form → Handler** (submission reaches a handler that persists), **State → Render** (state changes reach the output). Recipes: [references/stub-and-wiring-patterns.md](references/stub-and-wiring-patterns.md).

## Step 6: requirements and decisions coverage

**Requirements.** When the spec or ticket uses requirement IDs, map every ID it assigns to this work to the truths and artifacts verified above: SATISFIED (evidence found), BLOCKED (no or contradicting evidence), NEEDS HUMAN (UI behaviour, UX quality). An ID assigned to this work that no plan task claims is **ORPHANED** and always appears in the report.

**Decisions.** For each decision the spec or plan records, search its key phrase across the plan, `$REPORT`, the changed files and the branch's commit subjects:

```bash
grep -n -i -F "$DECISION_PHRASE" "$PLAN" "$REPORT" $(git diff --name-only "$BASE"...HEAD)
git log --format=%s "$BASE"..HEAD | grep -i -F "$DECISION_PHRASE"
```

A decision with no match is "not honored". This is a warning only, because a paraphrase can miss: it never changes the status. Report `honored / total` and the list, even when all are honored; when the evidence could not be read, report "decision coverage: not evaluated", never zero.

## Step 7: scan the changed files

List the files changed since `$BASE` (`git diff --name-only "$BASE"...HEAD`; for each commit hash `$REPORT` cites, `git cat-file -t <hash>` confirms it exists). Scan each:

```bash
grep -n -E "TBD|FIXME|XXX" "$file"                                       # debt markers
grep -n -E "TODO|HACK|PLACEHOLDER" "$file"
grep -n -i -E "placeholder|coming soon|will be here|not yet implemented|not available" "$file"
grep -n -E "return null|return \{\}|return \[\]|=> \{\}" "$file"           # empty implementations
grep -n -E "=\s*\[\]|=\s*\{\}|=\s*null|=\s*undefined" "$file" | grep -v -E "test|spec|mock|fixture"
grep -n -E "=\{(\[\]|\{\}|null|undefined|''|\"\")\}" "$file"              # props hardcoded empty
```

- **Stub classification.** A match is a STUB only when the value reaches rendering or user-visible output and no other path fills it with real data. An initial state a fetch or store later overwrites is not a stub: check for the fetch (`useEffect`, `fetch`, `query`, `useSWR`, `useQuery`, `subscribe`) writing the same variable first.
- **Debt-marker gate.** A `TBD`, `FIXME` or `XXX` in a changed file is a 🛑 blocker unless the same line references follow-up work (`#123`, `issue #123`, `PR #123`, a ticket key). Unreferenced, completion is not auditable: list each under `gaps`.
- **Test quality.** For tests linked to requirements, check they prove what they claim: no skipped tests standing in for a requirement, no circular expected values, assertions strong enough for the requirement. Procedure: [references/test-quality-audit.md](references/test-quality-audit.md).

Classify each finding: 🛑 blocker (prevents the goal, or an unreferenced debt marker), ⚠️ warning (incomplete), ℹ️ info, and in re-verification only 📋 advisory (new scope without evidence, per the evidence gate).

## Step 8: behavioural spot-checks and probes

Static checks find smells; spot-checks show that key behaviours produce the expected output. Run them for work that produces runnable code; for documentation- or config-only work, record "spot-checks: skipped (nothing runnable)".

Pick 2–4 truths checkable with one command each:

```bash
curl -s "http://localhost:$PORT/api/$ENDPOINT" | node -e "let b='';process.stdin.on('data',c=>b+=c).on('end',()=>{const d=JSON.parse(b);process.exit((Array.isArray(d)?d.length:Object.keys(d).length)>0?0:1)})"
node "$CLI_PATH" --help 2>&1 | grep -q "$EXPECTED_SUBCOMMAND"          # a CLI exposes what it should
ls "$BUILD_OUTPUT_DIR"/*.{js,css} 2>/dev/null | wc -l                 # a build produces output
node -e "const m=require('$MODULE_PATH'); console.log(typeof m.$FUNCTION_NAME)" | grep -q function
npx vitest list | grep -q "$TEST_NAME"    # a test EXISTS: enumerate (pytest --collect-only -q, go test -list '.*', cargo test -- --list)
npx vitest run -t "$TEST_NAME"            # ONE named test PASSES (pytest -k, go test -run, cargo test NAME -- --exact)
```

Record each as PASS (output matches), FAIL (failed, empty or wrong: a gap) or SKIP (needs a server or external service you must not start: a human item). For a behaviour-dependent truth (Step 3), the single named test that exercises its transition is what upgrades it to VERIFIED.

Constraints: each check under ~10 seconds; start no servers or services; change no state (no writes, no mutations); run the full test suite **at most once** per verification and `grep` its saved output, never re-run it filtered per truth; prove a test exists by enumeration and that it passes by running it alone.

**Probes.** When the plan, spec or `$REPORT` names probe or check scripts (or "PASS markers", "runnable checks"), run every one yourself from the repository root (`timeout 30 bash "$probe"`): exit 0 is PASS; anything else is FAILED with its output quoted; a named probe that is missing is MISSING_PROBE and a gap. The report's own probe results are never a substitute.

## Step 9: human-verification items

Always needs a human: visual appearance, completing a user flow, real-time behaviour, external service integration, how fast it feels, whether an error message is clear. Needs a human when uncertain: wiring grep cannot trace, behaviour that depends on dynamic state, edge cases.

Add as well: every PRESENT_BEHAVIOR_UNVERIFIED truth, phrased around its invariant (what to trigger, what must hold afterwards, why presence checks cannot see it); every `insufficient_spec` truth; every judgment-tier prohibition; every check the plan defers to a person at the end. Merge duplicates.

Write each item so the person can do it without reconstructing context:

```markdown
### 1. {Test name}
**Test:** {what to do: URL, input, clicks}
**Expected:** {what should happen}
**Why human:** {why it cannot be checked programmatically}
```

**Infrastructure work** (schema, internal APIs, data models, build tooling, CI, migrations, a service layer, a core library: goal and criteria describe only technical artifacts, nothing a user sees) has no user-facing steps: invent none ("manually run the method"). Record "Human verification: n/a, infrastructure work with no user-facing elements". The exceptions still apply: a PRESENT_BEHAVIOR_UNVERIFIED or `insufficient_spec` truth is an evidence gap, not a user-facing step, and still produces its item. Infrastructure work is exactly where state leaks hide.

## Step 10: status, score and deferred items

Decide the status in this order; the first rule that fires wins:

1. Any truth FAILED, artifact MISSING or STUB, link NOT_WIRED, blocker from Step 7 or the test-quality audit, or MISSING_PROBE → **`gaps_found`**.
2. Any human-verification item at all → **`human_needed`**.
3. Otherwise → **`passed`**.

`passed` is valid only when the human-verification list is empty. A PRESENT_BEHAVIOR_UNVERIFIED truth is never FAILED and never VERIFIED: alone it gives `human_needed`; under `gaps_found` it is kept in `behavior_unverified_items` so it is not lost.

**Score:** `verified / total` truths, counting VERIFIED (including coincidental-reliance) and PASSED (override); PRESENT_BEHAVIOR_UNVERIFIED and `insufficient_spec` are excluded and reported separately as `behavior_unverified: P`. A clean N/N therefore certifies that every behaviour-dependent truth had behavioural evidence.

**Deferred items.** Before reporting a gap, check whether later work explicitly covers it: a later task of the same plan, or a later ticket of the same spec (through the tracker doc). Defer a gap only on clear, specific evidence (its concern appears in that work's goal or acceptance criteria) and record which task or ticket and the matching text. Vague or tangential matches stay gaps. Deferred items do not count toward the status: recompute it after filtering.

**Group gaps by concern**: when several truths fail from one root cause, say so, so a follow-up plan can close them together.

## Step 11: write the report and reply

Write `$VERIFICATION` with the file-write tool, from [references/verification-file.md](references/verification-file.md): frontmatter with status, score, gaps, deferred, overrides and the item lists; then the tables for truths, artifacts, links, data flow, spot-checks, probes, requirements, decisions, anti-patterns and test quality, the human items and a gaps summary.

Read the status back and fix it until it is one of the three values and matches Step 10:

```bash
grep -qE '^status: (passed|gaps_found|human_needed)$' "$VERIFICATION"
```

Leave the report uncommitted unless the user asks you to commit it. Reply to the user with the status, the score, the report path and, by status: the gaps blocking the goal and what is missing; the human checks to run, with what to expect; or that every must-have is verified. For tracker-only work, post the same summary to the ticket.

## Reasoning checks

Run these at decision points, not on every line; skip them for plain existence checks and for unambiguous test output:

- **Inversion first.** Before grading, list three concrete ways the work could be wrong despite passing tests (a missed edge case, silent data loss, a race, an unhandled error path), and turn each into a check. Check whether a documented deviation in `$REPORT` changes what a must-have means: a must-have written for approach A may need reinterpreting, not literal checking, when B was used.
- **Disconfirmation pass after.** Once the first pass is done, find one requirement only partly met, one test that passes without testing the stated behaviour, and one error path with no test. Report them even when the work passes.
- **Chesterton's fence.** Before calling existing code dead or redundant, find why it was written (blame, comments, tests, the plan that added it). If the reason is unclear, record "purpose unknown, recommend keeping" as a warning, with the commit that introduced it.

Calibrated examples of good and bad verdicts: [references/calibration-examples.md](references/calibration-examples.md).

## Done when

- [ ] The previous report was checked (Step 0), and re-verification used its must-haves and gaps.
- [ ] Every acceptance criterion is a must-have; the plan added, never removed.
- [ ] Every truth has one status and quoted evidence.
- [ ] Every artifact was checked at every level that applies; every key link was checked.
- [ ] Requirements, orphaned IDs and decisions were reported.
- [ ] Changed files were scanned, debt markers gated, linked tests audited.
- [ ] Spot-checks and named probes ran, or were skipped with a reason.
- [ ] Human items were listed, or "n/a" recorded with a reason.
- [ ] The status follows Step 10, deferred items were filtered, and the score excludes behaviour-unverified truths.
- [ ] `$VERIFICATION` is written at its own path, its status line reads back valid, and the user has the status and the path.
