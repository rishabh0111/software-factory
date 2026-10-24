# Investigating lessons

Step 2 of [refresh.md](../../refresh.md). Done when every lesson in scope has its evidence and a recommended outcome, and the set-level findings (overlap, supersession, contradiction) are recorded.

## Each lesson

Read it and check its claims against the current codebase. These dimensions go stale independently:

- referenced paths, classes and modules;
- the recommended solution itself: does it still match how the code works?
- code snippets;
- cross-referenced docs. For a knowledge-track lesson this includes a guidance file it names or links (a skill's `SKILL.md`, a runbook, a root instruction file): does it state a different order or rule for the same procedure? Compare only guidance the lesson names; never go searching the guidance layer for one;
- overlap with other lessons in scope: pairs covering the same problem, files or solution, and which is broader or more current;
- vocabulary: project-specific terms and whether the glossary defines them accurately, and whether each in-scope glossary entry still names a concept the project has. Collect the signal; edit nothing yet.

Match depth to specificity: a lesson citing exact paths and snippets needs more checking than a general principle.

**Auto memory.** When a "user's auto-memory" block is in context, scan it for notes in the same domain. A memory signal corroborates code evidence or prompts a deeper look; it never decides an outcome alone, and in non-interactive mode memory-only drift means stale-mark. Tag memory-sourced evidence "(auto memory [claude])".

**Declared retirement condition.** When a lesson has `retire_when`, check whether that condition is now met, the way the field says, through whatever its source exposes (an issue tracker, release notes, a version the repo pins). Record the result and the date checked in the report, never in the lesson; when the source cannot be reached, record that. This context runs this check itself, since investigation subagents carry only the clauses below. Never infer a condition for a lesson that declares none.

## The set

After the individual lessons: overlaps, supersession (an older narrow lesson a newer one subsumes), and contradictions, between lessons or between a lesson and guidance it names. Category-shape problems (a folder whose lessons span unrelated themes, a near-empty category) are report-only observations: never restructure folders or create categories.

## Subagents

Pick the lightest approach: this context for a small scope, parallel investigation subagents for 3 or more independent lessons, batches for a broad sweep. Lessons that overlap or share a root issue are investigated together. Two roles: **investigation** subagents are read-only and return evidence plus a recommended outcome; **replacement** subagents write successor lessons, one at a time (see [actions.md](actions.md)). This context merges results, resolves contradictions, and does every deletion and metadata edit.

Every investigation subagent's prompt carries these three clauses verbatim (plus the worth clause in [worth-audit.md](worth-audit.md) when the worth lens is on):

> Use your host's dedicated file search and read tools (Glob, Grep, and Read where they exist) for all investigation, rather than shell commands (ls, find, cat, grep, test, bash) for file operations. This avoids permission prompts and is more reliable. If your host exposes no such tools, use whatever read capability it does provide.
>
> Also scan the "user's auto-memory" block injected into your system prompt (Claude Code only). Check for notes related to the lesson's problem domain. Report any memory-sourced drift signals separately from codebase-sourced evidence, tagged with "(auto memory [claude])" in the evidence section. If the block is not present in your context, skip this check.
>
> If the lesson is knowledge-track and names or links a guidance file (a skill's `SKILL.md`, a runbook, a root instruction file), read that file and, when it states a different order or a contradictory rule for the same procedure, return both conflicting quotes plus which side current code follows — or that code witnesses neither. Read only guidance the lesson names; do not search for one, and do not edit it.
