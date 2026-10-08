<!-- Format of runs/<run-id>/tickets.md. Other skills parse it:
     - one `## <ID>: <title>` heading per ticket; IDs are T1, T2, ... and never reused
     - field lines exactly `- <field>: <value>`, in this order, before the Delivers line
     - status: todo | in-progress | done | parked: <reason> | dropped: <reason>
     - covers: spec capability IDs, comma-separated; `none (prefactor)` for prefactoring, `none (docs)` for a docs ticket added by sf-ship
     - after: ticket IDs, comma-separated, or `none`
     - batch: PR-<n>; verify: one line
     - size: `~<total> (prod ~<n>, test ~<n>)`: estimated changed lines, tests counted separately,
       nothing under .software-factory/ counted. The first number is the total.
     - Estimate line: exactly `Estimate: prod=<n> test=<n> batches=<n>`, whole numbers, summed over
       tickets that aren't dropped; batches counts open batches. The conductor parses it to confirm the lane.
     - tracker: issue reference such as #42, or `none`; plan: path relative to the run folder, or `none`
     - risk: `low`, `medium` or `high: <reason>; extra check: <one check outside the ticket's own verify>`.
       High: a new integration, an unproven library, a data or auth change, a hot path.
     - hitl: `none`, or the step a person must do (`create the OAuth app and put its id in .env`).
       sf-build stops before that step with status `waiting for human`.
     - unknown: `none`, or the open question that has to be answered first for the ticket to start. A ticket
       with an unknown isn't ready; settle it (answer, decision line, or a spike ticket) and set `none`.
     - Check the file with `scripts/tickets-check` (SKILL.md section 4); it parses these lines.
     File order is build order within a batch. Delete these comment lines when filling. -->

# Tickets: <run-id>

- **Spec:** .software-factory/specs/SPEC-<slug>.md
- **Next id:** T6
- **PR line limit:** 400

Estimate: prod=210 test=140 batches=2

## Batches

| Batch | Tickets | Est. lines | Status |
|---|---|---|---|
| PR-1 | T1, T2 | ~230 | open |
| PR-2 | T3, T4, T5 | ~360 | open |

<!-- Batch status: open | shipped. sf-ship sets shipped. -->

## T1: Cart total uses the shared money type

- status: done
- covers: none (prefactor)
- after: none
- batch: PR-1
- size: ~60 (prod ~60, test ~0)
- verify: The existing cart tests pass unchanged.
- tracker: none
- plan: plans/T1.md
- risk: low
- hitl: none
- unknown: none

Delivers: The cart computes totals with the shared money type, so discount amounts can be added without rounding drift. No behaviour change.
Must not change: cart totals for every existing test case.

## T2: A shopper applies a valid discount code and sees the new total

- status: in-progress
- covers: SPEC-cart/CAP-2
- after: T1
- batch: PR-1
- size: ~170 (prod ~90, test ~80)
- verify: Applying a valid code through the API lowers the total by the code's value and the cart page shows a discount line.
- tracker: #42
- plan: plans/T2.md
- risk: high: first use of the discount service; extra check: a code applied twice in two tabs changes the total once
- hitl: none
- unknown: none

Delivers: A shopper enters a valid code and the total drops by its value, with a discount line showing the code and amount.
Must not change: tax computation; carts with no code.

## T3: Invalid and expired codes are refused with a reason

- status: todo
- covers: SPEC-cart/CAP-3
- after: T2
- batch: PR-2
- size: ~120 (prod ~60, test ~60)
- verify: An expired code and an unknown code each leave the total unchanged and return their own refusal message.
- tracker: none
- plan: none
- risk: low
- hitl: none
- unknown: none

Delivers: The shopper learns why a code was refused, and the total stays as it was.
Must not change: carts with an already-applied valid code.
