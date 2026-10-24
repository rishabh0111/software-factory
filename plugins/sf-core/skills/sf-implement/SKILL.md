---
name: sf-implement
description: "Implement one ticket or spec directly in this session, without a written implementation plan."
disable-model-invocation: true
---

Build one piece of work, a ticket or a spec, in this session.

A written multi-task plan (a `/sf-plan` implementation plan) is `/sf-execute`'s input: when the user hands you a plan file, suggest `/sf-execute <plan path>` instead. When the work is more than one session can hold, suggest `/sf-plan` to break it into tickets or write a plan.

1. **Source.** For a ticket reference, fetch it with the Read operation in `docs/agents/issue-tracker.md` (missing → tell the user to run `/sf-setup`) and state its title before starting; ask when the reference is ambiguous. For a spec, read it.
2. **Build.** Call the Skill tool with "sf-tdd" wherever you can, at the pre-agreed seams (a spec's Testing Decisions name them). Run the typecheck and single test files regularly, and the full test suite once at the end, using the commands in the `## Testing` section of `CLAUDE.md` or `AGENTS.md`.
3. **Review.** Call the Skill tool with "sf-code-review" to review the work.
4. **Commit** your work to the current branch.

Done when every acceptance criterion of the ticket or spec is met, the full suite has passed, the review's findings are handled, and the work is committed.
