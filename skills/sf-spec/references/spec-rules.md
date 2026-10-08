# Spec rules

Every spec written from [../assets/spec-template.md](../assets/spec-template.md) meets these ten rules. `SKILL.md` section 6 reads the spec against them once more before the check.

1. Each capability has an **intent** (what someone or something can do, and why) and a **success** list (numbered pass/fail checks a test or a demonstration can decide). Missing either, it isn't a capability.
2. Intents say what, not how. Name the exact external surface users or callers touch (routes, CLI flags, public function names, field names, visible copy) under `Surface`; holdouts test against it, so prefer the highest surface that already exists and as few new ones as possible (ideally one). Internal design, file names and libraries belong in the plan. The exception is a trimmed prototype snippet that encodes a decision (a state machine, a schema, a type), under `Constraints`, marked `from prototype <branch>`. Code citations belong in `Verified current state` and `Do not touch`.
3. A constraint rules something out. If it rules nothing out, delete it.
4. At least one non-goal.
5. The success signal can be tested or demonstrated.
6. Numbers, not adjectives: "under 2 s for 10k rows", not "fast". If you lack a number, say so, give the default you assumed, and say how to measure the real value.
7. Anything touching data, infrastructure, shared state or a public interface has a rollback. Otherwise rollback is "revert the PR/MR"; say so.
8. Every load-bearing point in the input lands in a capability, constraint, non-goal or assumption. A point is load-bearing if the plan, the build or the tests would differ without it. The other way too: nothing lands that no source point or answer asked for. Complaints about how the team works (process feedback) go to `Notes` in `state.md`, not capabilities.
9. Lean: no background, hedges or repetition.
10. It uses the glossary's preferred words, and lists the terms it relies on and its ADRs under `Terms and decisions`.

## Optional parts of the template

- `Priority: P1, P2, …` per capability. P1 is the smallest useful version: what ships if the run is cut. The plan orders batches by it after dependencies.
- `Failure paths` include recovery when a failure can leave state half-changed. A capability touching auth, payments, uploads, webhooks or model calls lists one to three abuse cases there, so holdouts and tests cover them.
- `Operability` for capabilities with external calls, queues or background jobs: the questions the on-call person must be able to answer.
- `## Data` when the work stores or changes data: entities, identity and uniqueness, states and allowed transitions, volume.
- `companions:` in the frontmatter for material too big for the spec (a per-entity matrix, a state machine, a diagram), as files under `.software-factory/specs/SPEC-<slug>/`. The checker and the holdout writer read them; diagrams never go in the spec itself.

## IDs

`CAP-1`, `CAP-2`, …, never renumbered or reused; a changed meaning retires the old ID. Rules in [capability-ids.md](capability-ids.md); `scripts/cap-lint` checks them.

## Overriding another spec

Before drafting, read the other specs in `.software-factory/specs/` that cover the same area: their capabilities, non-goals and `Do not touch` lines. A new spec overrides another when one of its capabilities, constraints or success checks contradicts another spec's capability, non-goal or `Do not touch` line (for example, the earlier spec lists "Editing titles" as a non-goal and the new one adds title editing).

An override is a direction question, never a default:

- **Attended:** ask, naming both lines and recommending the newer request when the source item asks for it explicitly.
- **Unattended:** if the source item explicitly asks for the behaviour the other spec excludes (quote the item's words), record the override as a user challenge to that spec: write it in both specs as below, log `decision: overrides SPEC-<other>/<item>; requested by <source> (user challenge, unattended)` in `decisions.md`, and list it in the report and under `For the merge gate:` in `state.md`'s `## Spec` section. The merge then needs a person's yes ([merge-gate.md](../../sf-ship/references/merge-gate.md#needs-a-persons-look)). If the source doesn't ask for it explicitly (the override is your own reading), it's an open direction question: stop as [clarify.md](clarify.md) section 5 says.

Recording it in both specs, in the same commit as the new spec:

- **The new spec:** an `## Overrides` section, one line per override: `- SPEC-<other>/<CAP-n | non-goal | do-not-touch>: "<the overridden line>" -> <what changes> (<source>, YYYY-MM-DD)`.
- **The other spec**, keeping its file, slug and IDs: a non-goal or `Do not touch` line gets ` (overridden by SPEC-<new>/CAP-<n>, YYYY-MM-DD)` appended; a capability whose meaning changes is retired as in [capability-ids.md](capability-ids.md) with the reason `overridden by SPEC-<new>/CAP-<n>`. Don't otherwise edit it. Run `scripts/cap-lint` on it too.

## Refactor or migration

Capabilities state the target as checkable properties ("`git grep -n old-lib` prints nothing"); the `Recipe` section names the tool, pattern, targets and done-check. In grilling mode, also ask what sits behind the new seam (what the deepened module hides) and which existing tests must survive the change.
