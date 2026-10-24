# Tickets branch

Break a spec, a plan or a conversation into **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it.

## 1. Look for prefactoring

While exploring, look for changes that make the work easier to slice: "make the change easy, then make the easy change". A prefactor becomes the first ticket, blocking the ones it eases.

## 2. Draft vertical slices

Break the work into **tracer bullet** tickets:

- Each slice cuts a narrow but complete path through every layer it needs (schema, API, UI, tests): vertical, never one layer on its own.
- A completed slice is demoable or verifiable on its own.
- Each slice fits in a single fresh context window.
- Prefactoring comes first.

Give each ticket its **blocking edges**: the tickets that must complete before it can start, and only those. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks every call site at once and no vertical slice can land green. Sequence it as **expand–contract**:

1. **Expand**: add the new form beside the old, so nothing breaks.
2. **Migrate**: move the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand. CI stays green batch to batch because the old form still exists.
3. **Contract**: delete the old form once no caller remains, in a ticket blocked by every migrate batch.

When even the batches cannot stay green alone, keep the sequence but let them share an integration branch, all blocking a final integrate-and-verify ticket; green is promised only there.

## 3. Quiz the user

Present the breakdown as a numbered list. For each ticket:

- **Title**: a short descriptive name.
- **Blocked by**: the tickets that must complete first, if any.
- **What it delivers**: the end-to-end behavior this ticket makes work.

Ask:

- Does the granularity feel right, or is it too coarse or too fine?
- Are the blocking edges right: does each ticket depend only on tickets that genuinely gate it?
- Should any tickets be merged or split?

Iterate until the user approves the breakdown. Done when they have approved it.

## 4. Publish

Publish the approved tickets in dependency order, blockers first, so every blocking edge can name a real reference:

- Create each ticket with the tracker's Create operation, using the body template below. On a local tracker the numbering follows the same order, from `01`, one file per ticket.
- Link each blocker with the tracker's Link a blocker operation. Where the tracker has native blocking, use it and drop the template's Blocked by section; otherwise keep the section.
- When the source was an existing issue, attach each ticket to it with the Parent and child operation. Leave the parent itself unchanged: no closing, no edits.
- Apply the `ready-for-agent` label string to each ticket, unless the user said otherwise; the tickets are agent-ready by construction.

Follow the code rule in [SKILL.md](SKILL.md) (no file paths or snippets, except a prototype's decision-rich snippet).

<ticket-template>

## Parent

A reference to the parent issue. Omit when the source was not an existing issue.

## What to build

The end-to-end behavior this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

A reference to each blocking ticket, or "None (can start immediately)". Omit when the blockers are native links.

</ticket-template>

Done when every approved ticket is on the tracker, with its blockers linked and its label applied. Report the tickets in dependency order and name the **frontier**: the tickets whose blockers are all done, which for a fresh breakdown are the ones with no blockers. Suggest `/sf-implement <ticket>` for one frontier ticket at a time, clearing context between tickets, or `/sf-plan` for an implementation plan when a ticket is large enough to need one.
