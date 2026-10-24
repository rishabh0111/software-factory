# Capture

The **capture** branch of [SKILL.md](SKILL.md): write one solved problem as a durable **lesson** in the lessons folder, grounded against the current tree and findable by the next agent.

**Done** when one qualifying lesson is written or updated, its frontmatter and claims are validated, vocabulary capture is recorded, and the report for the run's mode is emitted; or, when nothing qualifies, nothing is written and the report says why.

**One lesson per run.** A session that produced several runs capture several times, one after another. Grounding, overlap detection and cross-referencing each assume a single solved problem grounded fresh against the tree; batching drafts and stitching cross-references between them afterward is how drafting labels ("Lesson 3") leak into a written doc.

## The bar

Document only a problem that is solved and verified. A lesson earns its place only when it holds durable project reasoning that the final code, tests, types, comments and existing docs do not readily give back, and losing it would plausibly cause recurrence, material risk or substantial rediscovery. The counterfactual: if the lesson disappeared, would a future engineer reading the final implementation still be likely to repeat the mistake or redo the investigation? Completion, effort and diff size establish nothing.

- When the counterfactual fails, write nothing and report why. Judge it from the session; an explicit invocation asks for the judgment now and leaves the bar where it is.
- Phrases like "that worked", "it's fixed" or "problem solved" mark the checkpoint for this judgment, not a pass.
- An existing lesson that became materially wrong or incomplete qualifies, because leaving it misleads: update it in place.
- A standalone request to create or bootstrap the glossary is a refresh job: suggest `/sf-learn refresh` and stop. Capture seeds only the glossary area its own lesson touched.

## Mode and depth

Interactive or non-interactive comes from the flags in [SKILL.md](SKILL.md). Interactive capture asks only at the steps that say so: discoverability consent, a multi-candidate refresh, and the rule-pack overlap and destination choices.

Depth:

- **Full** is the default for every run. Its token cost is small next to the work that produced the lesson, and it buys overlap detection, cross-referencing, session history and semantic grounding. An interactive run chooses depth itself and never asks: the context budget is something the agent can see and the user cannot. Choose **Lightweight** only when the session is close to its context limit.
- In non-interactive mode only an explicit token sets depth: `depth:lightweight` runs Lightweight; `depth:full` or no token runs Full. An unknown `depth:` token, more than one, or a `depth:` token in an interactive run: write nothing and emit the skipped report with the reason.

Every non-interactive exit, including one before any step runs, ends on `Documentation complete`, or `Documentation skipped` with the reason.

## Full mode

Run in order; each reference is a required read at its step.

1. **Research**: [references/capture-research.md](references/capture-research.md). Set up the run folder, scan auto memory, resolve rule packs, dispatch the related-docs finder, then classify and draft the body in this context while it runs.
2. **Session history**: [references/session-history.md](references/session-history.md), started after the finder is dispatched so it overlaps your drafting. It always runs the cheap probe and asks nothing; its result, including `no relevant prior sessions`, is the last research input. Go straight on to step 3 when it returns.
3. **Write**: wait for every research input, then [references/capture-write.md](references/capture-write.md): act on overlap, choose the destination, assemble, write, check frontmatter.
4. **Vocabulary**: [references/vocabulary.md](references/vocabulary.md), unconditionally, and run its **Capture** section.
5. **Validate**: [references/validation.md](references/validation.md): the mechanical claims check, then the semantic grounding validator over the lesson and any glossary entries this run wrote.
6. **Refresh check**: decide whether the new lesson shows an older one is stale (below).
7. **Discoverability**: [references/discoverability.md](references/discoverability.md).
8. **Review** (interactive only): [references/review-lenses.md](references/review-lenses.md), the optional specialist pass for the lesson's problem type.
9. **Report**: [references/capture-report.md](references/capture-report.md). The report is the last thing capture writes; end the turn after it, with no "what next?" menu.

**Lightweight mode** replaces steps 1-8 with one pass in this context: [references/capture-lightweight.md](references/capture-lightweight.md).

## The refresh check

Refresh is a targeted follow-up, never a default and never a prerequisite: write the new lesson first. Run it when the new lesson is evidence that an older one misleads:

- a related lesson or pattern doc recommends what the new fix contradicts, or the fix supersedes an older solution;
- the work was a refactor, migration, rename or dependency upgrade that likely broke references in older lessons;
- a pattern doc now looks too broad or unsupported;
- the finder reported high-confidence refresh candidates, or **moderate** overlap worth a consolidation review.

Leave it when no related lessons turned up, they still agree with the new one, the overlap is superficial, or the review would be broad with weak evidence.

- One obvious stale candidate: run refresh now with that narrow scope.
- Several candidates in one area: ask whether to run a targeted refresh for that module, category or pattern set.
- Tight context or Lightweight mode: recommend instead of running.
- Non-interactive: never run it and never ask; put the scope in the report's `Refresh recommendation` line.

A recommendation names the narrowest useful scope as inline code: a file (`/sf-learn refresh release-version-drift`), a module (`/sf-learn refresh payments`), a category (`/sf-learn refresh performance-issues`) or a pattern topic (`/sf-learn refresh critical-patterns`). An unscoped refresh is only for a user who asks for a broad sweep.

## What capture writes

The one lesson; the glossary changes vocabulary capture makes (creating the glossary when it is absent is expected); in interactive Full mode after consent, one discoverability line in the instruction file (edited, never created); and in interactive Full mode when the user picks it at the destination step, a rule file in a writable rule pack plus its `packs:` entry in `<lessons-dir>/packs.yaml`. Edits to other lessons belong to refresh.
