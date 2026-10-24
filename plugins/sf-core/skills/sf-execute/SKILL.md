---
name: sf-execute
description: Run a written implementation plan from /sf-plan task by task, inline or with a fresh implementer and reviewer per task.
disable-model-invocation: true
---

# Execute a plan

Run a multi-task implementation plan (the file `/sf-plan` writes, with `### Task N` blocks, Interfaces and `Expected:` lines) to the end, keeping a ledger that survives compaction and closing with one fresh-context review of the whole branch.

The input is that plan file. One ticket or spec with no plan is `/sf-implement`'s job: it builds the work directly in one session. When the user hands you a ticket or a spec, suggest `/sf-implement <reference>` for work one session can hold, or `/sf-plan` to write a plan first.

**Core principle:** the plan already did the thinking. Execute it exactly, prove each step with a test you watched fail and then pass, and leave a record that survives your own forgetting.

## Modes

| Mode | Who implements | Review | Steps |
|---|---|---|---|
| **Inline** | you, every task, in this session | per task: TDD; at the end: one fresh reviewer | [inline.md](inline.md) |
| **Subagent-driven** | a fresh implementer subagent per task; independent tasks can run in parallel | per task: a fresh task reviewer; at the end: one fresh reviewer | [subagent-driven-development.md](subagent-driven-development.md) |

Pick the mode in this order:

1. **The user's choice**, from the plan handoff or this request.
2. **No subagent tool** in this harness → inline. Never fabricate a dispatch. The per-harness tool maps in `references/` say what the dispatch tool is called where you run.
3. Otherwise recommend one and ask once, before setup. Subagent-driven when the user wants a review gate on every task, or the plan is long enough that its later tasks would run on a compacted context. Inline when the tasks are mostly transcription from a fully specified plan: it runs well on a mid-tier session model, and the one seat where the most capable model earns its cost is the final review.

Both modes share the setup, the workspace, the ledger, the deviation rules, the final review and the finish below, so a plan can change mode mid-flight and the new executor resumes from the same ledger.

## How you run

- **Continuous execution.** Execute every task without pausing to check in. "Should I continue?" and progress summaries spend the user's time; they asked you to execute the plan.
- **Narration:** at most one short line between tool calls. The ledger and the tool results carry the record.
- **Rulings, not stalls.** Conflicts, ambiguities, plan defects, a cap you would have asked to exceed: decide them. The spec is the binding authority, the plan is its argument, and your judgment settles what neither answers. Ledger every decision as a ruling (format below) and keep going. Deviating from the plan without a ledgered ruling is a decision made in secret. A wrong ruling costs rework the user can see and undo; a session parked on a question costs their day and buys nothing.

Four things stop you, and only these. For each, stop and ask:

1. An irreversible or destructive operation.
2. A security-sensitive action, including any package install that fails or that the plan did not name ([executor-rules.md](executor-rules.md), Rule 3).
3. A side effect outside this worktree that norms say you ask about first: a merge, a push to a shared branch, a publish.
4. A plan defect no small ruling repairs: every path forward is a guess, or the only path is an architectural change the plan never named ([executor-rules.md](executor-rules.md), Rule 4).

## Setup

1. **Worktree.** Call the Skill tool with "sf-worktrees" to create an isolated workspace or verify the current one. Implementation starts on a main or master branch only with the user's explicit consent.
2. **Workspace.** Run `bash scripts/sdd-workspace PLAN_FILE` from this skill's directory. It prints the plan's git-ignored directory (`<repo-root>/.scratch/execute/<plan-basename>/`), home to every artifact of this plan: ledger, briefs, reports, test logs, review packages. Another plan's directory is never yours to read or write. `git clean -fdx` destroys it; recover from `git log`.
3. **Ledger.** Open `<workspace>/progress.md`.
   - Its first line names your plan file → resume. A task with a `complete` line is done: never redo or re-dispatch it. A task whose last line is a fix round is mid-loop: resume at the next round. A task with a `dispatched` line and no `complete` line ran in parallel: check its branch with `git log` before deciding it needs redoing. After compaction, trust the ledger and `git log` over your own recollection; the commits it names exist even when you no longer remember making them.
   - Its first line names a different plan, or there is no ledger → start fresh: create it with the header line, then the `Worktree:` line.
4. **Plan and spec.** Read the plan once, note its context, Global Constraints and Review Focus, and create a todo per task. Read the spec the plan names (fetch a tracker reference through `docs/agents/issue-tracker.md`): conflicts inside the plan resolve against it. A plan with no reachable spec gets a ledger note saying so; rulings made without one are provisional.
5. **TDD.** Call the Skill tool with "sf-tdd" now, before Task 1. It governs every step of every task, in either mode; a plan whose steps already say "write the failing test first" does not exempt you from it.
6. **Pre-flight scan.** Before Task 1, scan the plan for conflicts and write the result to the ledger as a table, not a verdict:
   - One row for every pair of tasks that share a file or an interface: the two tasks, what one produces against what the other consumes, and what you found.
   - One row for every task: whether its own text agrees with itself (the tests it specifies against the code it specifies, the files it creates against the files it later touches).
   - Anything the plan mandates that the review rubric treats as a defect (a test that asserts nothing, verbatim duplication of a logic block), and anything that contradicts the Global Constraints.

   A plan whose tasks share nothing gets the single row `Pre-flight: no shared files or interfaces`. "The scan is clean" without these rows is not a scan you ran. Rule on every conflict a row surfaces, spec as the authority, and record the ruling beside its row. The per-task review remains the net for conflicts that only emerge from implementation.

Setup is done when the worktree is verified, the ledger holds its header, `Worktree:` line and pre-flight table, sf-tdd is loaded, and every task has a todo.

## The task loop

Run it per your mode's file: [inline.md](inline.md) or [subagent-driven-development.md](subagent-driven-development.md). Both apply [executor-rules.md](executor-rules.md) to work the plan never named and to every commit; implementers receive its path in their dispatch.

Everything you print, and every tool result, stays resident in your context for the rest of the session and is re-read on every later turn. Hand artifacts over as files, redirect long output to the workspace and read its tail, read a brief rather than the whole plan, and let bookkeeping ride along with work: a ledger append goes in the same call as the commit or the dispatch, never in a call of its own.

## The ledger

One file, `<workspace>/progress.md`, one line per event, appended as it happens. These are its line formats, for both modes:

| Line | When |
|---|---|
| `# Execution ledger — plan: <plan file path>` | first line, at creation |
| `Worktree: <output of git rev-parse --show-toplevel>` | second line; the root every commit check compares against |
| `Pre-flight: ...` rows | setup step 6 |
| `Task <N>: Ruling: <what you decided> — <why> — <what it costs if wrong>` | every deviation from the brief, plan conflict or adjudication |
| `Task <N>: [Rule <R> - <type>] <description>` | each auto-fix under the deviation rules |
| `Task <N>: minor (deferred): <one-liner>` | a Minor finding, or an out-of-scope discovery |
| `Task <N>: dispatched (parallel, branch <branch>, base <base7>)` | subagent-driven, parallel batch |
| `Task <N>: fix round <R>/5 (<X> addressed, <Y> open — <one-liners>; commits <a7>..<b7>)` | subagent-driven fix loop |
| `Task <N>: parked — <finding> — Ruling: <why the code stands>` | subagent-driven breaker |
| `Task <N>: complete (commits <base7>..<head7>, <evidence>)` | task done; evidence per mode |
| `Final: ...` | final review: rulings, deferred minors, fixes |

## Final review

After the last task's `complete` line:

1. **Package.** Run `bash scripts/review-package PLAN_FILE MERGE_BASE HEAD` (MERGE_BASE is the commit the branch started from, e.g. `git merge-base main HEAD`). It prints the file the reviewer reads; the diff never enters your context.
2. **Reviewer.** Dispatch one fresh reviewer from [code-reviewer.md](code-reviewer.md) on the most capable available model, named explicitly (an omitted model inherits the session's). Hand it the package path, the plan and spec, the plan's Review Focus verbatim, and the ledger path so it weighs your `Ruling:` lines and triages the `minor (deferred)` and `parked` lines. This is the one fresh context the whole run buys: your own read of the diff never replaces it. With no subagent tool, inline mode has a fallback in [inline.md](inline.md).
3. **Sort the findings before acting on any.** The reviewer's severity labels are advice; the gate is yours.
   - **Re-grade by effect.** A finding's grade is what a reasonable person using this software gets if it ships, not whether the spec names the input that triggers it. A reviewer who set a finding at Minor because the spec was silent graded the spec, not the effect. A deferred minor whose effect warrants it is promoted here.
   - **Declined to judge.** Every line the reviewer set aside is a ruling you make: `Final: Ruling: <behavior set aside> — <what a reasonable person gets, and why that stands or is now a finding> — <cost if wrong>`.
   - **Critical and Important** enter the fix pass.
   - **Minor** goes to the ledger as `Final: minor (deferred): <one-liner>`. Minors never enter the fix pass and never become rulings: a ruling decides a conflict, not a declined polish suggestion.
4. **Fix pass.** One pass, run per your mode's file. A finding you decide not to fix is a ruling, `Final: Ruling: <finding> — <why the code stands> — <cost if wrong>`. There is no second fix pass: residual findings reach the user in your final message, before they choose how to integrate the branch.

## Finish

1. Collect every ledger line containing `Ruling:` (pre-flight rulings, task rulings, parked findings, breaker and final adjudications) into your final message under **Rulings I made**, in the order you made them, each with what it costs if wrong. Collect every `minor (deferred)` line under **Deferred minors**. Both lists are exhaustive: if the ledger holds a line, the list holds it. Your final message is the only place the decisions you took on the user's behalf, and the findings you chose not to act on, reach them.
2. With the final review's fixes committed, delete this plan's workspace directory: git history is the record now. Sibling directories belong to other plans; leave them.
3. End by suggesting the user run `/sf-ship` to integrate the branch.

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "I remember what Task N says" | You remember a summary. The brief has the exact values. Read it. |
| "The plan is wrong here, I'll just do the right thing" | Do the right thing and ledger the ruling. Unledgered deviation is a decision made in secret. |
| "Let me check in before the next task" | Only the four stops stop you. Progress prompts spend the user's time. |
| "Ledger bookkeeping is overhead" | The ledger is what survives compaction. Executors without one have redone entire completed task sequences. |
| "I'll write the ledger lines after a few tasks" | Compaction does not wait for a convenient moment. One line per event, in the same call as the work. |
| "I read the diff carefully; the final reviewer is redundant" | Same author, same blind spots. The final reviewer is the only fresh context the run buys. |
| "The reviewer said Minor, so it's Minor" | The label graded the spec's silence. Grade what the person gets, then gate. |
| "I'll fix the minors too while I'm in there" | Every minor fixed is a test, a fix and a suite run nobody asked for. Ledger them; the user decides. |
