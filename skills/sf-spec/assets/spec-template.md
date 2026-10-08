---
id: SPEC-<slug>
title: <Title>
status: draft            # draft | checked
work_type: feature       # feature | refactor
source: <issue URL, runs/<run-id>/brief.md, or "request in run <run-id>">
runs: [<run-id>]
constitution: <version from .software-factory/constitution.md, or none>
companions: []           # optional: files under .software-factory/specs/SPEC-<slug>/ (a per-entity matrix, a state machine, a diagram); the checker and the holdout writer read them
updated: YYYY-MM-DD
---

<!--
This file is the contract the plan, the holdout scenarios, the build and the review work from.
Delete these comments and any optional section that doesn't apply. Don't leave "N/A".
-->

# <Title>

## Why

<One paragraph: the problem or need, who has it (one primary user or system), and why it matters now. Every trade-off later resolves against this.>

## Terms and decisions

<!-- Optional. Glossary terms this spec relies on (definitions stay in the glossary; use its preferred word throughout) and ADRs it depends on or produced. -->

- **<Term>**: [GLOSSARY.md](../../GLOSSARY.md)
- ADR: [NNNN-<slug>](../../docs/adr/NNNN-<slug>.md)

## Verified current state

As of YYYY-MM-DD:

- `<path:line>`: <what it does today, as read from the code>
- <For a change to one of a family, a short table: member, has the wanted behaviour?, gap.>
- <Or: "New. Searched for <terms> in <places>; nothing related found.">

## Capabilities

### CAP-1: <short name>

- **Intent:** <who or what can do what, to achieve what. What, not how.>
- **Priority:** <optional: P1, P2, … P1 is the smallest useful version: what ships if the run is cut. The plan orders batches by it after dependencies.>
- **Surface:** <optional: the exact external surface callers or users touch, e.g. `PATCH /api/todos/:id` with body `{"done": true}`, `--dry-run`, `exportCsv(rows)`, the button text "Save". Holdouts test against these names: prefer a surface that already exists, the highest one, and as few new ones as possible. Internals stay in the plan.>
- **Success:**
  1. <Pass/fail check, e.g. "Exporting a report with 0 rows produces a CSV containing only the header row.">
  2. <Pass/fail check>
- **Failure paths:** <optional: what must happen on bad input, missing permission, a dependency down, a repeat call, and how the system recovers when a failure leaves state half-changed. For auth, payments, uploads, webhooks or model calls: one to three abuse cases (how someone could misuse it, and what must happen instead).>
- **Operability:** <optional, for external calls, queues or background jobs: the questions the on-call person must be able to answer, e.g. "which exports failed in the last hour, and why".>

### CAP-2: <short name>

- **Intent:** …
- **Success:**
  1. …

## Data

<!-- Optional, when the work stores or changes data. Holdouts read only the spec, so entity rules live here, not only in clarifications. -->

- **<Entity>:** <what identifies it and what must be unique; its states and the allowed transitions, e.g. draft → sent → paid, never paid → draft; expected volume.>

## Constraints

- <A rule that rules something out, e.g. "No new runtime dependency.", "Constitution rule III applies: tests first.">
- <A trimmed prototype snippet that encodes a decision (state machine, schema, type) may sit here in a code block, marked "from prototype <branch>".>

## Non-goals

- <At least one thing this deliberately doesn't do, including anything cut from the smallest useful version.>

## Do not touch

- <Behaviour, interface, file or data that works and must stay as it is, with `path:line` where useful.>

## Overrides

<!-- Optional: only when this spec changes another spec's capability, non-goal or Do not touch line. It's a direction question first (references/spec-rules.md, Overriding another spec); the other spec gets its matching note in the same commit. -->

- SPEC-<other>/<CAP-n | non-goal | do-not-touch>: "<the overridden line>" -> <what changes> (<source>, YYYY-MM-DD)

## Success signal

<One or two sentences: the moment someone can see this worked. Concrete enough to test or demonstrate.>

## Rollback

<How to undo it. For data, infrastructure, shared state or a public interface, the actual steps (e.g. down-migration, feature flag off). Otherwise: "Revert the PR/MR." Say "one-way" and why when the change destroys or migrates data, sends something external, or changes what an input consumers already send means or what an existing output looks like; a backward-compatible addition is two-way.>

## Recipe

<!-- Refactor or migration only. -->

- **Tool:** <ast-grep | OpenRewrite | language codemod | by hand, with reason>
- **Pattern:** <from → to>
- **Targets:** <count and how they were found, e.g. "47 files: `git grep -l old_api`">
- **Done when:** <command that prints nothing when no targets remain>

## Assumptions

- <A taste call or default the spec proceeds under, and why. Each is also in decisions.md.>

## Open questions

<!-- Unattended: at most three, ranked scope > security and privacy > user experience > technical. After grilling: normally none. Remove each once answered. -->

- [NEEDS CLARIFICATION: <question>?] Recommended: <answer>, because <reason>. (<scope | security | UX | technical>)

## Clarifications

### YYYY-MM-DD

- Q: <question> → A: <answer> (<by user | default, unattended>)

## Retired

<!-- IDs here are never reused. -->

- CAP-<n>: <short name>. Retired YYYY-MM-DD: <reason>.
