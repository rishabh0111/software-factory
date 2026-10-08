# Ticket body and resolution

## Title

The question as a short phrase people will recognise when they see it in a list: `Which sync conflict rule wins?`, not `Research 3`. Other tickets and the map refer to it by this title.

## Body

The first lines depend on the tracker (see [../references/tracker-ops.md](../references/tracker-ops.md)): `Part of #<map>` where the tracker has no native parent link, and `Blocked by: #<n>, #<n>` where it has no native blocking. Leave out a line that doesn't apply.

```markdown
Part of #<map>
Blocked by: #<n>, #<n>
Mode: <AFK | HITL>

## Question

<One decision or investigation. Sized so one session can resolve it.>

## Why it matters

<Which later decision, or which part of the destination, waits on this answer.>

## Resolved when

<What the answer must contain to count: a choice between named options, a fact with its primary source, a verdict on a prototype, a list of what was done.>
```

`Mode:` is always AFK for research and HITL for prototype and grilling. For a task it says which, and an HITL task adds a `## Checklist` the person can follow without asking anything.

## Resolution comment

Posted once, when the ticket is resolved, then the ticket is closed. Assets are linked, not pasted (prototype branches, questionnaire files). Research findings are the exception: they go in the comment in full, split across comments if longer than 60,000 characters.

```markdown
## Resolution

**Answer:** <the decision, in one or two sentences>

**Why:** <the reasons that settled it; the options turned down and why>

**Decided by:** <the person's name or handle for HITL; "agent (research)" or "agent (task)" for AFK>

**Evidence:** <links: findings sources, prototype branch, questionnaire, task output such as new URLs or row counts. No secrets: say where a credential is stored, never the value.>

**Opens:** <new tickets this answer created, by title, or "none">
```

A ticket ruled out of scope gets a shorter comment instead, then is closed:

```markdown
Out of scope for <map title>: <why>. Listed under the map's Out of scope.
```

A ticket made wrong by a later answer:

```markdown
Superseded by <new ticket title> after <ticket title that changed it>.
```
