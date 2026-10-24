---
name: sf-plan
description: Plan work as a spec on the issue tracker, tracer-bullet tickets with blocking edges, or a bite-sized implementation plan.
disable-model-invocation: true
---

# Plan

Three branches, one artifact each. Run the branch the user names; otherwise pick it by what you hold, and ask when two fit:

| Branch | You hold | It produces | Steps |
|---|---|---|---|
| **Spec** | a design agreed in the conversation, and no spec for it yet | a spec published to the issue tracker | [spec.md](spec.md) |
| **Tickets** | a spec, a plan or a conversation to break into pieces | tracer-bullet tickets with blocking edges, published to the issue tracker | [tickets.md](tickets.md) |
| **Implementation plan** | a spec or a ticket to build now | a task-by-task plan file in the plans folder | [implementation-plan.md](implementation-plan.md) |

One run is one branch. Each ends on its own completion criterion; the next branch is a fresh run the user starts.

## Before any branch

1. **Configuration.** Read `docs/agents/issue-tracker.md`: its operations (Create, Read, Label, Parent and child, Link a blocker) are how this skill fetches and publishes, whatever the tracker is. The Spec and Tickets branches also read `docs/agents/triage-labels.md`, which maps the `ready-for-agent` role to this tracker's label string. When a file the branch needs is missing, stop and tell the user to run `/sf-setup`.
2. **Source.** Work from the conversation. When the user passes a reference (a spec path, an issue number or URL), fetch it with the tracker's Read operation and read its full body and comments. Look for prior work (a design, a spec, an earlier plan) as [work-docs.md](../../references/work-docs.md) describes under Find prior work.
3. **Lessons.** Search the lessons folder named in [work-docs.md](../../references/work-docs.md) for lessons related to this work, and carry the relevant ones into what you write.
4. **Codebase.** Explore the area the work touches, if you have not already. Read `docs/agents/domain.md` and follow it: the glossary's terms in everything you write, and any ADR in the area respected, or its conflict named.

Done when you hold the branch, its source text, the relevant lessons, and the glossary's vocabulary for the area.

Then open the branch's file and follow it to its completion criterion.

## Code in planning artifacts

The spec and the tickets live on the tracker and outlast the code they describe, so they carry no file paths and no code snippets. One exception: when a prototype produced a snippet that encodes a decision more precisely than prose can (a state machine, a reducer, a schema, a type shape), inline it within the decision it encodes, trimmed to the decision-rich part, and note that it came from a prototype.

The implementation plan is the opposite: it is consumed right away, so it names exact files, signatures and tests.
