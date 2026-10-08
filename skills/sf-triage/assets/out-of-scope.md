# Out-of-scope record

One file per concept at `.software-factory/out-of-scope/<concept>.md`, committed. The name is a short kebab-case concept a reader recognises without opening the file: `dark-mode.md`, `plugin-system.md`.

## When to write

- Only for a rejected feature request (a PR/MR proposing one counts).
- Only when a person confirmed the rejection, or an existing record or written non-goal already covers it.
- Not for bugs, questions, or requests that are already built. A record for something already built would make future triage reject real duplicates as unwanted.

## How to match

Read every record before writing. Match by concept, not keyword. If one matches, add the new item to its `Prior requests` list instead of creating another file. A maintainer who later accepts the concept deletes its file; items already closed stay closed.

## Reason

Give a reason that will still hold in a year: project scope, a technical constraint, or a choice already made. "Not now" or "too busy" is a deferral, not a rejection; don't record it.

## Template

```markdown
# <Concept name>

<One sentence: what this project does not do.>

## Why

<A short paragraph, written like a small design note. Name the constraint or scope decision, and cite the code or document it rests on (`path:line`, constitution rule, ADR, README section). Where it helps, add a short code or interface excerpt or an example that shows the constraint.>

## Decided

<YYYY-MM-DD>, by <maintainer name or "existing record"/"constitution">, run <run-id>.

## Prior requests

- <item link>: "<item title>"
```
