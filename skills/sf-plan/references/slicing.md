# Slicing a spec into tickets

## Vertical slices

A ticket cuts one narrow path through every layer the behaviour needs (data, logic, API, UI, tests), so that when it's done something works end to end and can be checked. A ticket that builds one layer for many features ("add all the tables") is a horizontal slice; avoid it, because nothing can be verified until the other layers exist.

- **Verifiable alone.** Its `verify` line names a command or observation that proves it done without waiting for later tickets.
- **Fits a fresh context.** An implementer that has seen only the ticket, its plan and the spec can finish it. If it needs more, split it.
- **Prefactor first.** If a refactor would make the work simpler, it's its own ticket at the front, with no behaviour change, verified by the existing tests staying green.
- **Covers.** List the spec capability IDs (`SPEC-<slug>/CAP-n`) the ticket delivers or advances. Every capability is covered by at least one ticket. A ticket covering nothing is either prefactoring (say so in its Delivers line) or shouldn't exist.
- **Must not change.** Copy the spec's boundaries that this ticket could plausibly damage. Name behaviour, not files.
- **No file paths or code** in tickets. Paths go stale; plans carry them. Exception: a schema, type shape or state table the spec settles more precisely than prose can.
- **Glossary words.** Titles and Delivers lines name domain concepts with the glossary's preferred term, never a word it lists under `Avoid` ([reading.md](reading.md) section 3).
- **Not too small either.** No ticket for setup, config, scaffolding or docs alone: fold it into the ticket whose result needs it. Split only where a reviewer could reject one ticket and accept its neighbour.
- **Shared setup has one owner.** A test harness, schema, contract or fixture several tickets need belongs to the earliest ticket that needs it; the others list that ticket in `after`.

## Split, never shrink

A ticket delivers its slice completely or is split. Words like "for now", "placeholder", "simplified", "stub", "hard-coded until", "wired later" or "TODO" in a Delivers line, a plan step or a Decisions line mean the rest is a second ticket: write it, with its own `covers` and `after`, rather than leaving the gap to be found at review. A deliberate stub is allowed only when a named ticket in the same run replaces it, and the plan says which.

## Order: tracer bullet, then risk

Among tickets free to go first (after any prefactoring):

1. **Tracer bullet.** The first ticket is the thinnest path through every layer the work touches (entry point to storage and back, one case), so the layers are proven to connect before anything is built on them.
2. **Riskiest next.** Then the ticket whose failure would change the plan: a new integration, an unproven library, a performance-critical path, or the capability the spec is least certain about. Learn that early, while the rest is still cheap to change.
3. **Priority.** If the spec gives capabilities a `Priority` (P1, P2, ...), order the remaining batches by it after dependencies, so the most valuable slice ships first if the run is cut short.

## Risk, people and unknowns

Every ticket has three more fields ([../assets/tickets-template.md](../assets/tickets-template.md)):

- **`risk`**: `low`, `medium`, or `high: <reason>; extra check: <check>`. High means a new integration, an unproven library, a data, schema or auth change, money, or a hot path; or a file with repeated fixes or reverts in its history. A high-risk ticket names one check beyond its own `verify` (for the merge gate), and `sf-build` pauses before it when a person is present.
- **`hitl`**: the step only a person can do (create an OAuth app, approve a paid plan, add a DNS record), named exactly; `none` otherwise. `sf-build` stops before that step with status `waiting for human`.
- **`unknown`**: a question that must be answered before the ticket can start without guessing its design; `none` otherwise. Plan the whole run anyway: settle the unknown now if you can (an answer from the code, a decision line), else record it here, or add a spike ticket the unknown waits on. Work that hinges on an open question is never designed on a guess. A ticket with an unknown isn't ready.

## Prerequisites (`after`)

`after` lists tickets that must be `done` before this one can start, because it uses something they produce. Not because they come earlier in the list. Too many edges serialise work for no reason and hide which ticket really blocks which. Too few let an implementer start on a foundation that isn't there.

Check each edge by asking: "Could an implementer finish this ticket correctly if that one weren't done?" If yes, remove the edge.

`scripts/tickets-check` rejects an `after` that names no ticket or a dropped one, a cycle (it prints the path), and an edge into a later batch.

## Wide changes: expand, migrate, contract

Some changes break many call sites at once (renaming a column, retyping a shared symbol). No vertical slice of them can land with the build green. Sequence them instead:

1. **Expand.** Introduce the new form while keeping the old one working, so every caller still builds.
2. **Migrate.** Switch callers over in groups, each group as large as one package or folder so a mistake stays contained. Each batch is a ticket with `after: <expand ticket>`, and the build stays green after each because the old form still exists. Prefer a codemod tool (ast-grep, OpenRewrite, the language's own) and leave the agent the cases the tool can't do.
3. **Contract.** Delete the old form once nothing uses it, in a ticket with `after` listing every migrate ticket. For a public endpoint, package export, CLI flag or config key, "nothing uses it" needs evidence beyond the repo (access logs, registry download or dependent counts, a search of known consumers) or a person's yes, named in the contract ticket's `verify` line; and the old form ships a deprecation warning and a note naming its replacement in an earlier release, unless the spec says otherwise.

When no single migrate ticket can leave the build green by itself, the three steps stay in order but share one PR batch that ends with an integrate-and-verify ticket; the build is promised green only there.

The refactor and migration path in the conductor plans its whole campaign this way, one PR batch per shard.

## Size and batches

Estimate `size` as changed lines including tests, from the code you read, and give production and test lines separately: `~170 (prod ~90, test ~80)`. Files under `.software-factory/` don't count; the spec, glossary and ADRs count as docs, not code. Round to a sensible figure (`~80`, `~250`); it's a guide, not a promise.

Sum the tickets that aren't `dropped` into the `Estimate: prod=<n> test=<n> batches=<n>` line in `tickets.md` (whole numbers, no `~`; `batches` counts open batches). The conductor reads it after plan to confirm the lane: the light lane needs `prod` at most 150 and `batches=1`.

- A ticket over `limits.max_pr_lines` is split.
- Batches group consecutive tickets in dependency order up to `limits.max_pr_lines`. A batch may depend on earlier batches, never later ones, and must leave the default branch working when merged alone.
- **A capability across batches.** When one capability is split over several PR batches and a partial version would be visible to users (a button that does half its job, an endpoint that returns part of the data), the first of those tickets adds a default-off feature flag (the project's flag mechanism, or a config value if it has none), every later ticket works behind it, and the last ticket turns it on and removes it. Name the flag in each ticket's Delivers line. Internal-only partial work needs no flag.
- A ticket's real diff can exceed its estimate. `sf-build` reports that; if a batch's real size passes the limit, the remaining tickets move to the next batch rather than growing the PR.

## IDs and changes

- IDs are `T1`, `T2`, … in the order first written. An ID is never reused or renumbered. `Next id` in `tickets.md` is one past the highest ever used.
- Order in the file is the build order within a batch. Reorder by moving sections; never by changing IDs.
- When the spec changes, add tickets for new capabilities, set tickets that are no longer needed to `status: dropped: <reason>`, and leave `done` tickets as they were.

## Ticket review list

Before writing, check each ticket:

1. Does its Delivers line describe behaviour a user or caller sees, not a layer?
2. Does its `verify` line name something checkable now?
3. Is every `after` edge a real prerequisite?
4. Is it within the size limit?
5. Is every spec capability covered somewhere?
6. Does it span two subsystems, or does its title need "and"? Split it.
7. Does any of it say "for now", "placeholder" or "wired later"? Split it (above).
8. Are `risk`, `hitl` and `unknown` filled, and is the tracer bullet first and the riskiest work early?

Then run `scripts/tickets-check` (SKILL.md section 4).

## How sf-build works the graph

For `sf-build` and the conductor: work batches in order. Readiness comes from `node <sf-plan>/scripts/tickets-check <tickets.md>`: its `ready:` line lists tickets that are `todo`, have every `after` ticket `done` and no `unknown`. Within the current batch, take the first ready ticket in file order. A ticket listed under `unknown:` waits like a direction call: attended, ask the person; unattended, set `waiting for human` if nothing else is ready. A ticket with `hitl` is built up to the person's step, then stops with status `waiting for human` naming the step. A `risk: high` ticket pauses for a person's go-ahead before it starts when one is present. Build one ticket at a time, with one writer; no parallel implementers and no agent that merges their branches. When a ticket is done, re-compute what's ready, call `sf-plan <run-id> plan <ticket-id>` for any ready ticket without a plan (it writes and reviews the plan), and continue once `plan-review.md`'s last line shows `open-critical=0 open-user-challenges=0`. A batch is ready to ship when all its tickets are `done` or `parked`.

Status changes are made by `sf-build`: `todo` → `in-progress` → `done`, or `parked` with a `ledger.md` entry. A ticket that waits on a `parked` or `dropped` ticket stays blocked; report it rather than working around it.
