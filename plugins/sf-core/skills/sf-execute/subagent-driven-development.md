# Subagent-driven mode

You are the controller. A fresh implementer subagent builds each task, a fresh task reviewer checks it (spec compliance and code quality) before it counts as done, and one broad reviewer checks the whole branch at the end. Setup, the ledger, the final review's sorting and the finish are in [SKILL.md](SKILL.md).

Subagents never inherit your session's context or history: you construct exactly what each one needs, which keeps it focused and keeps your own context for coordination. You never write the code yourself, not even a fix: controller fixes pollute your context and skip review.

## Model selection

Use the least powerful model that can handle each role, and **always name the model in the dispatch**: an omitted model inherits the session's, often the most capable and most expensive, which silently defeats this section.

| Role | Model |
|---|---|
| Implementer, the task's plan text holds the complete code (transcription plus testing), or a single-file mechanical fix | cheapest tier |
| Implementer, 1-2 files from a prose description with a complete spec | mid tier |
| Implementer, multi-file integration, pattern matching, debugging | standard tier |
| Implementer, design judgment or broad codebase understanding | most capable |
| Task reviewer | scaled to the diff's size, complexity and risk; mid tier is the floor |
| Scoped re-reviewer of a small fix diff | cheap to mid tier |
| Fix rounds 4-5 implementer | at least one tier above the implementer that got stuck |
| Final whole-branch reviewer | most capable available |

**Turn count beats token price.** Wall-clock and context cost scale with how many turns a subagent takes, and the cheapest models routinely take two to three times the turns on multi-step work, costing more overall. That is why mid tier is the floor for reviewers and for implementers working from prose.

## Per task

**Batch small same-shape work.** When several tasks are each a small, independent edit of the same kind (the same one-line fix, constant change or field addition across files), send them as one dispatch to one implementer: one brief listing every file and its change, one diff reviewed as a unit. One dispatch per task is for work that needs its own judgment, its own tests or its own review surface.

### 1. Dispatch the implementer

- Record BASE (`git rev-parse HEAD`) before dispatching: the review package and fix-round diffs are cut from it.
- Run `bash scripts/task-brief PLAN_FILE N` from this skill's directory. It writes the task's full text to a file in the workspace and prints the path. The brief stays the single source of requirements: exact values (numbers, magic strings, signatures, test cases) appear only there, and no subagent ever reads the whole plan.
- Name the report file after the brief (`…/task-N-brief.md` → `…/task-N-report.md`). The implementer writes its full report there and returns only the short status contract.
- Fill [implementer-prompt.md](implementer-prompt.md). The dispatch carries, and only carries: one line on where the task fits; the brief path, introduced as "read this first: it is your requirements, with the exact values to use verbatim"; interfaces and decisions from earlier tasks the brief cannot know, including any ledgered ruling or parked finding in the area this task touches; your resolution of any ambiguity you noticed in the brief; the path of [executor-rules.md](executor-rules.md); the working directory; the report-file path. A dispatch describes one task, never the session's history: pasted "state after Tasks 1-3" summaries are how one real dispatch reached 42k characters, 99% of it history.
- Record the implementer's agent identity from the dispatch result: fix rounds 1-3 resume it.

The implementer never dispatches subagents of its own, helpers or reviewers; the template says so. Every reviewer a worker spawns duplicates the task review you dispatch anyway.

### 2. Parallel dispatch

Tasks run one at a time, except a **parallel batch**: a set of tasks that meets all three conditions at once.

1. **Frontier.** Every task each one consumes from (its Interfaces Consumes line) is complete, and none consumes what another task in the set produces.
2. **No shared files.** Their Files blocks are disjoint, and the pre-flight table has no shared-file row between any two of them. A manifest, lockfile, fixture, migration sequence or generated file counts as shared.
3. **Isolated worktrees.** Each implementer gets its own worktree on its own branch cut from the same BASE: through "sf-worktrees", or the dispatch tool's own isolation where the harness has one (see the per-harness map in `references/`).

When any condition fails, dispatch one at a time. For a batch:

- Dispatch every implementer of the batch in one message, and ledger one `dispatched` line per task in the same call.
- Each task then runs this file's report handling, task review and fix loop on its own branch: `bash scripts/review-package PLAN_FILE BASE <task branch>` from your checkout, since worktrees share refs.
- When a task's review is clean (or its breaker has parked every open finding), merge its branch into the plan branch, in task-number order, and then write its `complete` line. After the batch is merged, run the full suite once.
- A merge conflict or a red suite means the independence call was wrong. Abort that merge, ledger a ruling naming the overlap, and run that task again on its own from the merged head, with a fresh implementer and the same brief.

**Waiting on dispatched subagents.** While you have local work (ledger updates, packaging the next review, reading reports), keep working; child results arrive on their own. When genuinely idle, wait in bounded stretches of five to ten minutes where the platform allows, never in short polls and never in one silent open-ended wait. Between stretches post one status line, list your live children, and chase any that finished without reporting.

### 3. Handle the report

The implementer reports one of four statuses:

- **DONE:** generate the review package and dispatch the task reviewer (step 4).
- **DONE_WITH_CONCERNS:** read the concerns first. Concerns about correctness or scope are addressed before review; observations ("this file is getting large") are noted, and review proceeds.
- **NEEDS_CONTEXT:** provide the missing context and re-dispatch.
- **BLOCKED:** something has to change before a retry. A context problem → more context, same model. More reasoning needed → a more capable model. Too large → break it into smaller pieces. The plan is wrong → rule on the correction, ledger it, and re-dispatch carrying the ruling. Never re-dispatch the same model with nothing changed.

Questions from the implementer, before or during the task, get clear and complete answers, with more context where it helps.

### 4. Review the task

The task review is a task-scoped gate; the broad review happens once, at the end. It is never skipped, and implementer self-review never replaces it.

- Run `bash scripts/review-package PLAN_FILE BASE HEAD` with the BASE recorded before dispatch (never `HEAD~1`, which drops all but the last commit of a multi-commit task). It prints the package path; the diff never enters your context. Without bash, write `git log --oneline`, `git diff --stat` and `git diff -U10` for the range to one uniquely named file. No task reviewer is dispatched without a diff file.
- Fill [task-reviewer-prompt.md](task-reviewer-prompt.md) with three paths (the brief, the report, the package) and the global constraints that bind the task.
- The global-constraints block is the reviewer's attention lens: copy the binding requirements verbatim from the plan's Global Constraints or the spec, with exact values, exact formats and stated relationships between components ("same layout as X"). The template already carries the process rules.
- Add a directive only with a concrete, task-specific reason; "check all uses" or "run race tests if useful" without one sends the reviewer wandering. Leave the tests the implementer ran to its report: the reviewer does not re-run them.
- Let the reviewer raise every finding. A prompt containing "do not flag", "don't treat X as a defect", "at most Minor" or "the plan chose" is pre-judging, usually to spare yourself a review loop; a finding you think is a false positive is adjudicated in the loop.

A report missing either verdict, spec compliance or task quality, is incomplete: send it back. Each "⚠️ Cannot verify from diff" item (a requirement in unchanged code or across tasks) is yours to resolve before the task completes, since you hold the plan and the cross-task context. A confirmed gap is a failed spec review and enters the fix loop.

### 5. The fix loop

The loop starts on spec ❌, any Critical or Important finding, or a ⚠️ item you confirmed as a gap. Two kinds of finding leave before it starts:

- **Minor** findings go to the ledger as `minor (deferred)` lines; the final reviewer triages that list. Minors never enter the loop.
- A finding labeled **plan-mandated**, or any finding that conflicts with the plan's text, is yours to rule on: weigh it against the plan with the spec as the authority, and ledger the ruling before acting. A plan mandate never dismisses a finding by itself, and no fix contradicting the plan goes out without a recorded ruling.

Everything else enters the loop. A round is one fix dispatch plus one scoped re-review, five rounds at most per task:

- **Rounds 1-3: resume the original implementer** with the open findings verbatim. Its context is intact: it knows the task, the code and its own choices. Where the harness cannot message a live subagent, dispatch a fresh implementer with the brief path, the report-file path and the findings; the report file is the persistent memory either way.
- **Rounds 4-5: a fresh implementer on a more capable model**, with the brief path, the report-file path, the open findings and this framing: "A prior implementer attempted this task [N] times; you own it now. Read the report file for what was tried." A loop that survives three resumes usually means the implementer cannot see its own problem.

Every round, the implementer fixes, re-runs the tests covering the amended code (name the covering test files in the fix message; a one-line fix does not need the whole suite), appends a fix report to the same report file, and returns the short contract. Before the re-review, confirm the fix report holds the covering tests, the command and the output.

**The re-review is scoped.** Run `bash scripts/review-package PLAN_FILE FIX_BASE HEAD`, FIX_BASE being the head the previous review saw, and fill [re-review-prompt.md](re-review-prompt.md) with the findings, the brief, the report file and the package path. The re-reviewer marks each finding ADDRESSED or NOT ADDRESSED and inspects the fix diff only. New Critical or Important breakage in the fix diff joins the open findings; out-of-scope observations go to the ledger as deferred minors and never extend the loop. After each round, ledger the `fix round` line.

**The breaker.** When round 5's re-review still leaves findings open, stop dispatching and adjudicate each open finding yourself:

- **The reviewer is wrong, or the point is contestable:** park it with a ruling saying why the code stands. The final review sees both sides.
- **Real, but nothing downstream builds on it:** park it the same way, with a ruling that says it is real and deferred.
- **Real and load-bearing** (a later task builds on it, or it reveals a plan defect): rule on the smallest change that unblocks the dependent work, ledger it, and carry it into the next task's dispatch. Parking a structural failure silently lets every dependent task build on it. Stop only when the defect leaves every path forward a guess.

Adjudicate only at the cap: adjudicating earlier to end a loop is pre-judging under another name. Every adjudication is a ledger line; a silent discard is forbidden.

### 6. Complete the task

When the review is clean, or every open finding is parked with a ruling at the cap, ledger the `complete` line in the same call as your other bookkeeping, with `review clean` or `<K> parked` as its evidence. Mark the todo complete. The next task starts only when the current one has no open Critical or Important finding that is neither fixed nor parked with a ruling.

## Final fix wave

When the final review's sorted findings leave Critical or Important items, dispatch **one** fix implementer with the complete list, never one per finding: per-finding fixers each rebuild context and re-run suites, and one real session's final fix wave cost more than all its tasks combined. Then run exactly one scoped re-review of the fix range with [re-review-prompt.md](re-review-prompt.md). Adjudicate any residual finding as at the breaker: park it with a ruling, or rule on a load-bearing one and ledger what you decided.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Close enough on spec compliance" | Reviewer found spec gaps = not done. Fix, or hit the cap and adjudicate: those are the only exits. |
| "I'll fix it myself, dispatching is overhead" | Controller fixes pollute your context and skip review. Resume the implementer. |
| "One more round will converge" | Past the cap, rounds do not converge: the failure is structural. Adjudicate and route. |
| "The reviewer will just find something new anyway" | Scoped re-reviews verify fixes; they cannot wander. New findings on untouched code go to the ledger, not the loop. |
| "This finding is obviously wrong, I'll drop it" | You adjudicate only at the cap, and every ruling is a ledger line. |
| "The fix was small, skip the re-review" | Unreviewed fixes are how regressions land. Every round ends with a scoped re-review. |
| "Reviews slow the loop down" | The loop without reviews is unverified churn. Reviews are its brakes and steering. |
| "These two tasks look independent, run them in parallel in this checkout" | Parallel needs all three conditions, isolated worktrees included. Two implementers committing in one checkout race on the index and on each other's test runs. |
| "The implementer spawned its own reviewer: free extra assurance" | A duplicate seat on the same diff; the task review is the gate. A worker-spawned reviewer is a defect to flag. |

## Example

```
You: Executing docs/plans/feature-plan.md, subagent-driven.

[Setup per SKILL.md: worktree, fresh ledger, plan and spec read, sf-tdd, pre-flight table]

Task 1: Hook installation script
[task-brief plan 1; BASE a1b2c3d; dispatch implementer (cheapest tier: plan holds the code)]
Implementer: "Should the hook install at user or system level?"
You: "User level (~/.config/hooks/)."
Implementer: DONE. 2 commits, 5/5 passing. Report: …/task-1-report.md
[review-package plan a1b2c3d HEAD; dispatch task reviewer (mid tier)]
Task reviewer: Spec ✅. Issues: none. Task quality: Approved.
[Ledger: Task 1: complete (commits a1b2c3d..d4e5f6a, review clean)]

Tasks 2 and 3: frontier, disjoint Files, no pre-flight row between them
[Ledger: two dispatched lines; dispatch both implementers in one message, each in its own worktree]
Task 2 reviewer: Spec ❌ missing progress reporting ("report every 100 items"); Important: magic number 100.
[Fix round 1: resume Task 2's implementer with both findings]
Implementer: fixed; test/recovery.test.js 10/10; fix report appended.
[review-package plan FIX_BASE task-2-branch; scoped re-review]
Re-reviewer: both ADDRESSED (src/recovery.js:7, :41). New breakage: none.
[Ledger: Task 2: fix round 1/5 (2 addressed, 0 open; commits d4e5f6a..b7c8d9e)]
Task 3 reviewer: Spec ✅, Approved.
[Merge task 2 branch, then task 3 branch; full suite 18/18; two complete lines]

...

[review-package plan MERGE_BASE HEAD; final code-reviewer, most capable model]
Final reviewer: all requirements met; deferred minors triaged, none block merge.
[Rulings I made / Deferred minors in final message; workspace deleted]
Plan done. Run /sf-ship to integrate the branch.
```
