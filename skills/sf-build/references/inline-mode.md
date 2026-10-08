# Inline mode: no subagents

Use this when the harness has no tool for starting subagents, or a subagent dispatch fails for that reason. You then play every role in this session: test author, implementer and reviewer. Never write a brief and pretend it was dispatched; if there's no subagent tool, say so and work inline.

The process stays the same as SKILL.md describes: one batch per call, one ticket at a time in file order, test first, the smallest change, the same checks, the same fix-loop cap, the same ledger and commits. What changes is who does each step, and that the author reviews their own work. That review is weaker, and the record must say so.

## Start

1. Append `run: no subagents: roles shared one context, review independence lower` to `ledger.md`. Add the same line under `For review` in `state.md`'s `## Build` section when you write it, so `sf-verify` and `sf-review` know.
2. If `tools.second_opinion` names another agent CLI (not `none` or `pending`), use it for the task reviews: run it read-only the way the `sf-review` skill's `references/second-opinion.md` shows, with the task reviewer prompt as its input. That gives back some independence. Ledger `run: task reviews by <cli>`.
3. Read the plan and spec once, then re-read each ticket's plan file from disk when you start that ticket. What you remember is a summary; the file has the exact values.

## Each ticket

1. **Start.** Record `BASE`, ledger `<id>: start | base <sha7>`, set `status: in-progress`.
2. **Tests, as the test author.** Write the test brief to `briefs/<id>-tests.md` exactly as for a subagent. Then write the tests from that brief only: the ticket, the plan's test cases, the spec text. On the bug path you already know the root cause; write the test against the symptom and the seam anyway, not against your intended fix. Run them and watch them fail for the expected reason. Save `evidence/<id>-red.log` and `evidence/<id>-tests.sha` as [guards.md](guards.md) says. A test that passes before any code changed is a finding about the test: fix the test first, unless it guards a failure path or ordering, as [test-author-prompt.md](test-author-prompt.md#after-it-reports) allows, with its ledger line. Same exemptions as SKILL.md (behaviour-preserving refactor, config-only, docs-only), ledgered.
3. **Code, as the implementer.** Follow [implementer-prompt.md](implementer-prompt.md) as if it were addressed to you: the smallest change that turns the tests green ([smallest-change.md](smallest-change.md)), the full suite, one commit with the usual message and footer. Compare each run's output with the plan's `Expected:` line for that step. A mismatch caused by the code is debugged to its cause (trace the bad value back, as the `sf-debug` skill's `references/root-cause.md` does), never patched to match; a wrong plan line gets a `Ruling:` ledger line. Write the report to `reports/<id>-impl.md`: what changed, the tests, the commands, their output, and each Expected line with match or mismatch. Don't touch the tests you wrote in step 2. If one is wrong, go back to the test-author role as [fix-loop.md](fix-loop.md#a-separately-written-test-is-wrong) says: evidence first, a `test-change` ledger line with its reason, and a new `<id>-red.log` and `<id>-tests.sha`.
4. **Checks.** Run every check in [guards.md](guards.md). These don't depend on who wrote the code, so they carry full weight.
5. **Self-review against the plan.** Write the review package with `scripts/review-package` as usual. Then, as a separate pass after the commit, read the package file (not your memory of the change) and fill in the [task reviewer's template](task-reviewer-prompt.md) for yourself. Go through the plan line by line: each item is done, missing or changed. Every change from the plan needs a `Ruling:` ledger line. Save the result as `review/<id>-r0.md` and ledger `<id>: review (self) | <n> critical, <n> important, <n> minor | review/<id>-r0.diff`.
6. **Fix loop.** Same entry rules and cap as [fix-loop.md](fix-loop.md). Each Critical or Important fix starts from a test: first a test that shows the reported problem and is seen to fail, then the fix, then that test seen passing, then the full suite. Then the checks, and a scoped self-review of the fix diff. There's no stronger model to escalate to; from round 4, re-read the spec and plan from disk and write down which assumption you may have wrong before the next attempt. Add `no fresh implementer (inline)` to those rounds' fix-round ledger lines.
7. **Checkpoint.** Before the next ticket: every test the plan names exists and ran; every `Expected:` line was compared and every mismatch was fixed at its cause or ruled; the commit exists, the ledger has the `complete` (or `unfinished`) line, `tickets.md` has the new status, and `state.md`'s `Next` names the next ticket. A lost session resumes from these files and `git log`, so never batch them for later. Print one line of progress; don't wait for a reply unless one of fix-loop.md's stop conditions applies.

## Keep the context small

Everything you read stays in this session. Send long command output to a file under `evidence/` and read its tail. Read a ticket's plan, not the whole ticket list. If the session gets compacted mid-ticket, trust the ledger and `git log` over what you remember, and re-read the plan.

## Finish

Finish as SKILL.md step 6 says. In the report to the conductor, say plainly that the build ran inline, that each task review was a self-review (or by the second-opinion CLI), and list every `Ruling:` line with its cost if wrong. `sf-review` still runs its full, independent review afterwards; inline mode never replaces it.
