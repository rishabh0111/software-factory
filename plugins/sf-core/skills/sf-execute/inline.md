# Inline mode

You implement every task yourself, in this session, in plan order: no implementer subagent and no reviewer per task, one fresh-context review of the whole branch at the end. Setup, the ledger, the final review's sorting and the finish are in [SKILL.md](SKILL.md).

Inline gives up a fresh context per task and a second pair of eyes per task, and keeps what they bought by other means: the brief is the spec, the ledger is your memory, TDD is the per-task gate, and the final reviewer is the second pair of eyes. Over a long plan the last tasks get the least of you; the ledger is what keeps that recoverable.

## Per task

### 1. Take the task

Run `bash scripts/task-start PLAN_FILE N` from this skill's directory. It prints the brief path and BASE (the commit the task's range is cut from) in one call. Read the brief for every task, including ones you remember from setup: what you remember is a summary, the brief has the exact values, signatures and test cases. Mark the task's todo in_progress.

### 2. Work the steps

The plan's steps are already in red-green order; follow them in that order under sf-tdd. A test step's code is written first and run first. Watching it fail is a step, not a formality: a test that passes before the implementation exists is a finding about the test.

Every step that runs a command has an `Expected:` line. Run the command, read its output, compare. Three outcomes:

- **Matches.** Next step.
- **The code is wrong.** Call the Skill tool with "sf-debug". Find the cause; never patch the symptom to make the output match.
- **The plan is wrong**: a step contradicts the spec, an earlier task's interface does not match what this task consumes, a command cannot work. Rule on the smallest change that satisfies the spec, ledger it as a `Task <N>: Ruling:` line, and continue. Later tasks touching the same interface read the ruling from the ledger.

Work the plan never named (a bug, missing critical functionality, a blocking issue, an architectural change) goes by the deviation rules in [executor-rules.md](executor-rules.md). Commit as the plan's commit steps say, through the commit protocol in the same file. A task may span several commits; its range is cut from BASE, never `HEAD~1`.

Run the focused test for each step as the plan says. The end-of-task run in step 4 is the contract, not a substitute for the per-step runs: they are how you learn which step broke something.

### 3. The completion contract

Before a task's `complete` line, all of these are true, with evidence from this session rather than the diff looking right:

- Every test the brief names exists and ran in this task, and you read its output.
- Every `Expected:` line in the brief was compared against real output.
- Every deviation from the brief has a `Ruling:` line or a `[Rule N]` line in the ledger.
- The final test run for the task passed: step 4 is that run.

Call the Skill tool with "sf-verify": it governs the claim. A missing item means the task is not complete: finish it.

### 4. Complete the task

Run `bash scripts/task-done PLAN_FILE N BASE -- <test command>` with the test command the brief names for the whole task. It runs the tests, keeps the full output in the workspace, prints the tail, and only when they pass appends `Task <N>: complete (commits <base7>..<head7>, tests: <command> → <result>)`. A failing run records nothing: the task is not complete. When it records, mark the todo complete and take the next task.

## Final review without a subagent tool

When this harness cannot dispatch, read [code-reviewer.md](code-reviewer.md) and perform that review yourself against the package, as a separate pass after the last task's `complete` line. Ledger `Final review: self-review (no subagent tool)`, and say so in your final message: a self-review by the author is weaker than a fresh reviewer, and the user decides whether that is enough before merge.

## Final fix pass

Fix the Critical and Important findings yourself, in one pass. Each fix is verified by TDD, not by a second reviewer: write the test that reproduces the finding, watch it fail, make it pass, then run the whole suite. Ledger each as `Final: fixed <finding> — <test name> RED→GREEN, suite <N>/<N>`. A fix without a test that failed first is not verified; a suite that is not green means the pass is not over. No re-review follows: the covering tests answer "addressed" and the suite run answers "broke nothing".

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "The plan's code is right, skip watching the test fail" | A test you never saw fail proves nothing. It is one step. Run it. |
| "I'll run the full suite at the end instead of per step" | Per-step runs tell you which step broke it. The end-of-task run is the contract, not a substitute. |
| "Tests should pass, the change was trivial" | "Should" is not evidence. The contract requires the command and its output. |
| "Subagents are slow and expensive, I'll skip the final review too" | Inline already removed the per-task reviewers. One review of the whole branch is the floor. |
| "The fix is obvious, no need for a failing test first" | The failing test is the only proof the finding was real and is now gone. |

## Example

```
You: Executing docs/plans/feature-plan.md inline.

[Setup: worktree verified; sdd-workspace → fresh ledger; Worktree: line written]
[Plan and spec read; sf-tdd loaded]
[Pre-flight: 2 shared-interface rows, 4 self-consistency rows, clean; written to ledger]
[Todos created]

Task 1: Hook installation script
[task-start plan 1 → brief read; BASE a1b2c3d]
[Step 1: failing test written]
[Step 2: run — FAIL: install_hook not defined. Matches Expected.]
[Step 3: implemented]
[Step 4: run — PASS 1/1. Matches Expected.]
[Step 5: commit-check, stage, commit d4e5f6a]
[Contract: tests ran, output read, no deviations]
[task-done plan 1 a1b2c3d -- npm test -- hooks → Task 1: complete (commits a1b2c3d..d4e5f6a, tests: npm test -- hooks → 1/1 pass)]

Task 2: Recovery modes
[task-start plan 2 → brief read; BASE d4e5f6a]
[Step 2: FAIL on an import error: Task 1 produces installHook, the brief consumes install_hook]
[Ledger: Task 2: Ruling: install_hook → installHook — matches Task 1 Produces — cost if wrong: one rename]
[Steps 3-5 as planned; commit b7c8d9e]
[task-done plan 2 d4e5f6a -- npm test -- recovery → Task 2: complete (..., 8/8 pass)]

...

[review-package plan MERGE_BASE HEAD; dispatch code-reviewer on the most capable model]
Reviewer: One Important (progress interval hardcoded), two Minor. Declined to judge: none.
[Re-grade: Important stands; minors → ledger as deferred]
[Fix: test_progress_interval_configurable RED → extract PROGRESS_INTERVAL → GREEN; suite 12/12; commit]
[Ledger: Final: fixed hardcoded interval — test_progress_interval_configurable RED→GREEN, suite 12/12]

Rulings I made:
- Task 2: install_hook → installHook (brief typo; cost if wrong: one rename)

Deferred minors:
- README lacks a usage example
- recovery.js could split verify and repair into two files

[Workspace deleted]
Plan done. Run /sf-ship to integrate the branch.
```
