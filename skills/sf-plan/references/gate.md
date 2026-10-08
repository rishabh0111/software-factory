# The plan gate

One question to a person, after the review (SKILL.md section 7). Record the answers under `### Gate` in `plan-review.md` ([plan-review.md](plan-review.md#6-record)).

## What the gate shows, in this order

1. **Security first.** Every security finding from the review, accepted or rejected, with its decision. A security risk the reviewer and the planner both see (the finding was accepted) is flagged as such, not buried in the list.
2. **Open user challenges.** For each: what the spec says (quoted), the proposed change, why, what the reviewer may be missing, and the cost if wrong. This includes a plan that needs to break a constitution MUST or contradict an ADR.
3. **Tickets.** A numbered list, one row per ticket: ID, title, `after`, `covers`, batch, size, risk, and its Delivers line. Mark tickets with `hitl:` (naming the person's step) and `unknown:` (naming the question).
4. **Seams under test.** For each planned ticket, the `Seams under test` line from its plan, so a person can object before tests are written at the wrong place.
5. **Decisions.** Each `spec stands` decision with its quoted spec line. Then the taste decisions; for design-it-twice choices, the constraints, the chosen interface and the runner-up. With eight or more taste decisions, group them by ticket and say the plan has high ambiguity, so the person reads them rather than skims.
6. **Deferred.** Work the review or the planner cut as outside the spec, one line each with why; it goes to `For the merge gate:` in `state.md` too.
7. **The `tickets-check` output**: the `ready:` line and any warnings.

Ask: "Approve these tickets and plans, or say what to change? Recommended: approve as listed."

## After the answer

- Apply the changes, re-run section 4's checks (`tickets-check` included) and each changed plan's self-check.
- A change to a plan's Interfaces block or to the ticket graph (a ticket added, split, merged or dropped, or an `after` edge changed) gets one scoped re-review of the changed files: as round 2 if round 2 hasn't run, otherwise a new `## Review <n>` with one round. Wording and taste-only changes don't.
- Record the answers under `### Gate` with a new status line.
- An approved user challenge sends the run back to `sf-spec`.

## Without a person

Approve as listed and log that in the run's `decisions.md`; `spec stands` decisions don't stop the run. An open user challenge (one the planner wants to accept) can't be defaulted: set `state.md` status `waiting for human`, name it in `Next`, and stop. The same applies in `plan <ticket-id>` mode, which has no gate; its taste and `spec stands` decisions go to the run's `decisions.md` and the report.
