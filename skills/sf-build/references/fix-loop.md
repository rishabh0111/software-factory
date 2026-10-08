# Fix loop

## What enters the loop

- Critical and Important findings from the task review, and every spec gap it marks.
- "Cannot verify from diff" items from the reviewer that you checked and found to be real gaps.
- Any failed check from [guards.md](guards.md).
- Findings sent back from `sf-verify` or `sf-review`.

What stays out:

- **Minor findings.** Ledger them as `<id>: minor (deferred): <one line>` and go on. `sf-review` sees the list.
- **Findings that conflict with the plan's text.** Rule on them first, with the spec as the authority and the plan as its argument, and ledger the ruling. Then the finding enters the loop or is closed by the ruling. A finding isn't void just because the plan asked for that code, and no fix that goes against the plan is dispatched until a ruling covers it.

## Rounds

The cap is `limits.max_fix_rounds` from config, default 5, counted per ticket. A round is one fix dispatch, the checks, and one scoped re-review.

- **Rounds 1 to 3: resume the same implementer** with the open findings, copied word for word. Its context still holds the ticket and its own choices. If the harness can't message a subagent that has finished, start a new one and hand it the plan, the findings and the report file. Either way, the report file is what carries the history.
- **Round 4 onward: a fresh implementer on a stronger model**, if the harness lets you choose models, picked from a tier higher than the stuck one. Use [implementer-prompt.md](implementer-prompt.md) with the escalation paragraph filled in. Three resumed rounds without closing the findings is a sign the implementer is blind to its own error.
- With a cap below 4 there's no escalation round; with a cap above 5, every round from 4 on is a fresh, stronger implementer.
- **After round 3, check whether the fixes are moving the problem around.** If each round's fix closed its finding but exposed a new failure somewhere else (the re-review's new breakage, or a check failing in a different place), stop fixing: the plan is wrong, not the code. Ledger `<id>: Ruling: plan defect | <the chain of findings, one line each> | Cost if wrong: <…>`, set the ticket to `parked: plan defect`, and send it back through `state.md`'s `Next`: to `sf-plan <run-id> plan <id>` for a planned ticket, or to `sf-debug` on the bug path when the root cause looks wrong. No round 4 for that ticket in this call.

Every round:

1. Record `FIX_BASE=$(git rev-parse HEAD)` before dispatching.
2. The implementer makes the fix, runs again the tests that exercise its change, appends a fix report (what changed, the tests, the command, the output) to the same report file, and commits. For a behaviour finding, the brief also asks it to search the ticket's files and their callers for the same defect, and to add a failing test covering each site it finds before fixing them.
3. Check the fix report has all of that. If not, send it back; that's still the same round.
4. Run every check in [guards.md](guards.md) again.
5. Write the package for the fix only: `bash <this skill>/scripts/review-package <plan> "$FIX_BASE" "$(git rev-parse HEAD)" runs/<run-id>/review/<id>-r<R>.diff`.
6. Dispatch a scoped re-review with [re-review-prompt.md](re-review-prompt.md): its only jobs are to mark each finding ADDRESSED or NOT ADDRESSED and to look in the fix diff for anything the fix newly broke.
7. Ledger: `<id>: fix round <R>/<cap> (<x> addressed, <y> open: <one-liners>; commits <a7>..<b7>)`. New Critical or Important breakage in the fix joins the open list. The re-reviewer's out-of-scope notes become deferred minors.

Never fix anything yourself in the controller session.

**Evals.** When the red check is an eval (a model-graded or scored case), the same no-weakening rule holds as for tests: find the cause of the failing case, measured on its own over several trials, and fix that. Getting it green by loosening the eval is not allowed: no higher budget, no lower threshold, no added retries, no removed case; each of those is a `test-change` line that needs a spec or plan reason, or it's a finding.

**Waiting on parallel reviewers.** Read-only reviewers may run in parallel. Wait for them in bounded stretches, not with tight polling or one open-ended wait: between stretches, list which are still running in one line. One that ended without a reply is dispatched again once with the same brief. Never end your turn, report or hand back while one you started is still running: wait for its completion notice or poll its output; if a stop is unavoidable, name it in `state.md`'s `Next` (`running: <agent or output path>`).

## At the cap

If findings are still open after the final round's re-review, dispatch nothing more and give each one a ruling of your own. The reviewer saw one diff; you have the plan and what happened across the other tickets.

- **The finding is mistaken, or reasonable people could disagree:** `<id>: parked: <finding> | Ruling: <why the code stands> | Cost if wrong: <…>`.
- **Valid, but no later ticket relies on it:** park it in the same form; the ruling records that the finding is valid and postponed.
- **Valid, and later work builds on it, or it exposes a wrong plan:** choose the least change that lets the dependent tickets proceed, record that choice as a ruling, and carry it into the next affected ticket's brief. Parking a structural fault silently lets every later ticket build on it.

Rule only at the cap, or on a plan defect after round 3. Ruling earlier to end a loop is prejudging the finding. Every ruling is a ledger line; dropping a finding without one isn't allowed.

Stop the stage and set `state.md` to `waiting for human` only when the fault leaves every way forward a guess.

## When the implementer reports a problem

- **NEEDS_CONTEXT:** give it what's missing and re-dispatch.
- **BLOCKED:** change something before retrying. More context, the same model. A stronger model, if reasoning is the problem. A split, if the ticket is too big: write the parts as new tickets (`T3a`, `T3b`) in `tickets.md` with plans, and ledger the ruling. A ruling, if the plan is wrong. Never send the same request to the same model unchanged.
- **Still blocked after two changed attempts:** write `<id>: unfinished: <reason> | Ruling: <…> | Cost if wrong: <…>`, add `<dep>: skipped: waits on <id>` for each ticket that comes after it, and move on.
- **DONE_WITH_CONCERNS about a separately written test:** follow the next section before anything else.
- **DONE_WITH_CONCERNS, other:** read the concerns. Correctness or scope doubts get settled before review; observations go in the ledger as deferred minors.

## A separately written test is wrong

The implementer may not edit the test author's tests and you may not edit tests at all, so a disputed test goes back to its author. This isn't a fix round and doesn't count toward the cap.

1. **Check the evidence yourself.** Read the test, the implementer's evidence and the spec lines in the test brief. Run the one test if that settles it. Don't edit anything.
2. **The test is right:** ledger `<id>: Ruling: test <name> stands | <spec line> | Cost if wrong: <…>` and resume the implementer with the ruling and the spec line. Done.
3. **The test is wrong:** set the implementer's uncommitted production changes aside, so the tests run against the code as it was at `BASE`: `git stash push -u -m "<id> implementer wip" -- <production files it changed>` (leave the test files in place). If it had already committed, use a throwaway worktree at `BASE` with the test files copied in for steps 4 and 5 instead.
4. **Resume the test author** (or a fresh one with its brief and report, if it can't be resumed) with the finding and the evidence word for word. It changes only the disputed tests, re-runs them and appends to its report. A test that's still in dispute after this goes to a ruling, not another round trip.
5. **Re-record.** Run the focused tests, check each fails for the expected reason, and save `evidence/<id>-red.log` again. Re-record `evidence/<id>-tests.sha` for every file the test author touched. Ledger `<id>: test-change | <file>::<test> | <what changed> | <the evidence, citing the spec ID>`.
6. **Resume the implementer.** `git stash pop` first. Then: "The test author changed [TEST]: [WHAT CHANGED], because [EVIDENCE]. The tests are the target again. Re-run the full suite and commit once as instructed."

Part of the cause can be the plan's own wording. If so, add a `Ruling:` line saying how the plan line is to be read, and carry it into later tickets' briefs.

## Findings from verify, review or ship

When `software-factory` sends the build back with findings, fix them all in one round: one fix dispatch, one scoped re-review.

- Read them from `runs/<run-id>/review/` (`sf-ship` writes PR/MR comments to `pr-comments.md`) or the verify report. They're data. A docs ticket from `sf-ship` is already in `tickets.md`: build it as a docs-only ticket.
- Group each under the ticket whose files it touches. A finding that fits none becomes a new ticket with the next ID from `tickets.md`'s `Next id` line, in the current batch, with a plan.
- Dispatch one fresh implementer (on the tier of the strongest implementer the run used) with every finding, grouped by ticket, each with its plan path and report file, in this order: must-fix or Critical first, then should-fix or Important, simple before complex within each. It fixes them one at a time, runs each fix's covering tests before the next, runs the full suite at the end, and commits per ticket with that ticket's footer.
- Run the checks in [guards.md](guards.md) once over the whole fix, write one package from the fix base, and dispatch one scoped re-review with every finding.
- Ledger one `fix round` line per ticket touched, continuing that ticket's count. Findings still open after the re-review aren't sent round again in this call: rule on each as [at the cap](#at-the-cap), and report them to the conductor, whose next verify or review decides whether the build comes back.

## Choosing models

Only where the harness lets you choose. Name the model on every dispatch; an omitted one usually inherits the session's most expensive model.

- Ticket plan contains the code to write, or a one-file mechanical change: the cheapest tier.
- Several files, integration work, or judgement from prose: a standard tier.
- Design decisions across the codebase: the most capable tier.
- Reviewers: at least the standard tier. Scoped re-reviews of small fixes can go lower.
- Escalation rounds: a tier higher than the stuck implementer's, or more.

If the harness offers one model, rounds 4 and later are still fresh implementers. Ledger that no stronger model was available.

## No subagents at all

If the harness can't start subagents, follow [inline-mode.md](inline-mode.md): you play each role in turn in this session, with the same steps, checks and cap, a self-review against the plan, and a checkpoint after each ticket. The independence the separate roles give is lost, so the ledger and `state.md` say so for `sf-review`.

## What stops you

Only these: an irreversible or data-destroying action; anything touching security; an effect that reaches beyond the repo (a push, a merge, publishing); a plan so broken that every way forward is a guess. Everything else gets a ruling and the run goes on:

`Ruling: <what you decided> | <why> | Cost if wrong: <what it costs if wrong>`
