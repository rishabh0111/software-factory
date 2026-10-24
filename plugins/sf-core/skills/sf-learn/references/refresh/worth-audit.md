# Worth audit

Read only after the user confirmed the worth lens ([refresh.md](../../refresh.md)), or when non-interactive mode inferred it. It adds one test to classification; the five outcomes, the subagent roles and the action flows stay as they are. Done when every lesson that survived the accuracy classification has a worth verdict with its quoted evidence.

## The bar

The worth lens applies capture's bar (**The bar** in [capture.md](../../capture.md)) to lessons written before it existed or that grew past it.

## Recoverability needs positive evidence

A lesson's reasoning is recoverable only when a named in-repo artifact states it in its own text: a test whose assertion or comment carries the rule, a code comment beside the mechanism, the project's always-loaded instructions, a skill reference, or another surviving lesson. Topical overlap is not coverage: find the specific reasoning and quote it. **Unverifiable is not false** ([classify.md](classify.md)) still holds: a claim no artifact corroborates is kept, never treated as recoverable. A lesson describing a mechanism that no longer exists goes through the ordinary Delete gate, not this lens.

Every investigation subagent prompt on this path carries this clause verbatim:

> For each claim the lesson makes that a reader would need in order to avoid repeating a mistake or redoing an investigation, search the repository for an in-repo artifact whose own text states that reasoning (a test, a code comment, the root agent-instructions file, a skill reference, another lesson). Return, per claim: recoverable with the artifact path and the quoted sentence, or not recoverable. Do not infer coverage from a related file name or topic.

## Routing

Classify for accuracy first, then apply the worth test to lessons that survived:

- **Every claim recoverable, citations absent or decorative**: Delete, with the Delete flow's citation cleanup. The quoted artifacts are the evidence bullets.
- **Some claims recoverable**: Update. Cut the recoverable content and keep the measured facts, cross-file invariants and rejected alternatives nothing else records. Point at the artifact in one line where a reader would look for the cut material. Narrow the frontmatter to match.
- **Nothing recoverable**: Keep.

A lesson whose only remaining content is a session narrative, a list of what changed, or a restatement of a contract another file owns has no non-recoverable claim and goes to Delete.

**Interactive**: the run-start confirmation authorized the lens; batch broad sweeps and confirm between batches as **Decide** says, presenting each worth verdict with its quoted artifacts. **Non-interactive**: worth-based Delete and Update are never applied; record each under **Recommended** with the quoted artifacts so a human can apply the batch. Accuracy-based actions apply as usual.

The report's summary carries `Worth lens: confirmed | recommended-only (non-interactive) | off`, and each worth verdict lists the artifacts it rests on.
