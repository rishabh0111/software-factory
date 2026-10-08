# Brief template

Written to `runs/<run-id>/brief.md` when the verdict is `ready` or `ready-for-human`. It is the contract the next stage works from; the original item is background. `sf-spec` turns a feature brief into a spec. `sf-debug` turns a bug brief into one failing command.

Rules:

- Describe behaviour, not implementation. "Exports with zero rows return an empty CSV with headers", not "add a check in `export.ts`".
- Name the interfaces involved (types, commands, endpoints, config keys) so the brief survives files being moved. Put `path:line` citations only under `Where we looked`, which is allowed to go stale.
- Every acceptance criterion is pass/fail and can be checked on its own. "Works correctly" and "edge cases handled" are not criteria.
- State what is out of scope, so the builder doesn't widen the change.
- Quote the reporter where wording matters. Mark guesses as hypotheses.
- Leave out secrets, tokens and personal data that appeared in the item.
- The title names the area and the symptom, never a guessed cause ("Export: empty CSV for archived projects", not "Export: null check missing").
- For a PR/MR: current behaviour is the state of the diff, desired behaviour is what's left (finish it, close gaps, answer review points), and the brief says which of the PR's own pieces to reuse.
- For `ready-for-human`, add a `Why a person` line under the header.

```markdown
# Brief: <one-line summary>

- **Item:** <URL or path>
- **Work type:** <feature | bug | security | upgrade | refactor | small change | machine failure>
- **Triaged:** <YYYY-MM-DD>, run <run-id>

## Current behaviour

<What happens now. For a bug, the broken behaviour, with the reporter's quote, version and environment (or `unknown`), and frequency. For performance, the measurement, how it was taken, and any profile. For a PR/MR, what the diff does now. For a feature, the status quo it builds on.>

## Desired behaviour

<What should happen afterwards, including error and empty cases.>

## Steps to see it   <!-- bugs -->

1. <action>
2. <action>
- **Broken end state:** <what you see>
- **Correct end state:** <what you should see>

## Key interfaces

- `<TypeOrCommand>`: <what changes and why>

## Acceptance criteria

1. <pass/fail criterion>
2. <pass/fail criterion>

## Out of scope

- <adjacent thing that must not change>

## Where we looked

- <path:line or search, and what it showed>
- Hypotheses: <labelled as such>
```
