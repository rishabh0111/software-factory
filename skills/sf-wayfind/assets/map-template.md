# Map body

The map issue's title names the effort in a few words, for example `Map: offline sync`. Its body is the whole effort at low resolution, read once at the start of every session. Keep it short. Don't list open tickets; they are found by query.

```markdown
## Destination

<One or two lines: what the end of this map is. "A spec, SPEC-<slug>, for <thing>", or "A locked decision on <question>". Add "(proposed)" if no person has confirmed it yet.>

## Notes

<Domain in a sentence. Standing preferences for this effort. Skills or documents every session should read. Who drives the map.>

## Decisions so far

<!-- One line per resolved ticket, appended when it closes. Gist only; the ticket holds the detail. -->

- [<ticket title>](<link>): <the answer, summarised in one line>

## Not yet specified

<!-- Questions you can see coming but can't yet phrase precisely. In scope. Coarse is fine: one patch may become several tickets, or none. Delete a patch when it becomes tickets. -->

- <area>: <the suspected question, as far as you can see it>

## Out of scope

<!-- Work judged to lie past the destination. One line each, with why. Closed tickets ruled out link here. Nothing here comes back unless the destination is redrawn as a new effort. -->

- <gist> — <why it's out of scope> (<link to closed ticket, if any>)
```

When the destination is reached, add one line under the title before closing the map:

```markdown
## Outcome

<Spec: .software-factory/specs/SPEC-<slug>.md> | <Decision: the full text, as logged in runs/<run-id>/decisions.md. With no spec, this is the decision's lasting record>
```

## Fog or ticket?

Ask whether the question can already be phrased exactly. Whether it can already be answered doesn't matter.

- A sharp question that is blocked is still a ticket. Wire the block.
- A question you can only gesture at is fog. It goes under Not yet specified.
- Already decided, already a ticket, or past the destination: not fog.
