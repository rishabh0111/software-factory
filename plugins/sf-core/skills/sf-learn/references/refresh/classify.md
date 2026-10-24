# Classifying a lesson

Step 3 of [refresh.md](../../refresh.md). Done when every lesson in scope has exactly one outcome (or a stale-mark), and every question **Decide** calls for has been asked.

## Outcomes

| Outcome | Meaning | Action |
|---|---|---|
| **Keep** | Still accurate and useful | No edit; report it as reviewed. No review breadcrumb or `last_refreshed` on its own. |
| **Update** | The solution still holds; references drifted (paths, names, links, snippets, metadata, misfiling) | Fix in place |
| **Consolidate** | Lessons overlap heavily and both are correct | Merge unique content into the canonical lesson, delete the subsumed one |
| **Replace** | The guidance now misleads and a trustworthy successor can be written | Successor via subagent, then delete the old |
| **Delete** | No longer useful, applicable or distinct | Delete the file |

**Split** (one lesson holding several independent problems becomes focused successors) and **relocation** (moving a misfiled lesson) are variants handled in [actions.md](actions.md).

## Judgment rules

- **Descriptive drift versus implementation conflict.** Claims about current mechanics follow current code: the lesson changes, product code does not. Guidance with independent evidence that it still governs is classified from that evidence; when code stops satisfying it, keep the guidance and report the conflict as a potential product regression, without adjudicating or fixing the code. Guidance with no independent support goes through the ordinary Update, Replace or stale-mark rules.
- **A met retirement condition is evidence, not age.** When the `retire_when` check finds the condition met, the premise the guidance rested on is gone: classify from that evidence. When code still carries the workaround the lesson explains, the lesson stays (Keep, or Update where the evidence contradicts a claim), and removing that code is the recommended action in its report entry (non-interactive: under **Recommended**). A met condition is a reason to verify the removal, not proof it is safe. An unmet condition decides nothing; one that could not be checked falls under **unverifiable is not false**.
- **The Update/Replace line.** Rewriting the solution, or changing what the lesson recommends, is Replace, not Update. Replace needs evidence that the recommendation no longer governs and that a trustworthy successor can be written; code contradiction alone goes through the drift/conflict rule above. For guidance the lesson names: when the named guidance is right and the lesson's recommendation no longer governs, Replace; when the lesson is right and the named guidance is wrong, the guidance file is the recommended action in the report (non-interactive: under **Recommended**, beside the discoverability recommendation); when code witnesses neither side, ask (interactive) or stale-mark and report the contradiction under **Recommended** (non-interactive).
- **Replace needs real evidence**: from the investigation, the conversation, newer lessons or PRs, or the user. When you cannot confidently document the current approach, stale-mark and recommend `/sf-learn capture` for the user's next encounter with that area.
- **Age alone is not staleness.** A two-year-old lesson that still matches the code is a Keep; age only prompts a harder look.
- **No churn.** Never edit for typos, wording or cosmetics.
- **Unverifiable is not false.** A claim the repo cannot corroborate (a schema or index fact, an operational practice, an environment behaviour) is not thereby wrong; repos rarely witness their own operations. Never delete, strip in a merge, or stale-mark content solely because no in-repo artifact confirms it. Act only on contradiction; keep unverifiable-but-plausible claims and note the gap in the report.
- **The retrieval-value test** (Consolidate versus separate): would someone searching this topic in six months be better served by separate lessons (genuinely different sub-problems or audiences), or do they only add drift risk? Two lessons saying the same thing will eventually say different things. Two accurate lessons about *different sub-problems* of one feature (request volume versus response ordering, say) stay separate even when they cite the same file: shared code is not a shared problem. A subsumed lesson with nothing unique is a straight Delete. Deleting the subsumed lesson after merging is part of Consolidate and needs no auto-delete gate.
- **Split** is the inverse, and its bar is high: each fragment must have independent retrieval value; length alone is never a reason.
- **Relocation** (an Update variant) only when the folder and the frontmatter `category` disagree, or the content plainly belongs in another **existing** category. A mismatch proves something is wrong, not which side: settle the direction from the content first, and never relocate on an arguable call. Non-interactive auto-relocation needs all four: (1) frontmatter and folder disagree per the category mapping, (2) the content clearly shows the folder is wrong, (3) the target folder exists, (4) every inbound citation is in-repo and mechanically rewritable. Otherwise recommend.
- **Memory signals** never carry an outcome alone (see [investigate.md](investigate.md)).

## Before any Delete

1. **Is the problem domain still active?** Missing files prove the *implementation* is gone, not the problem. When the app still deals with what the lesson covers (the auth-token file is gone but sessions are still handled), that is Replace, not Delete. A lesson that never referenced in-repo code (developer environment, onboarding, process) can never show "implementation gone" and **never auto-deletes**: stale-mark (non-interactive) or ask (interactive) when its currency is in doubt.
2. **Inbound links.** Search the repo's markdown (not source code) for the filename slug and read around each match. **Decorative** citations (see-also pointers, a principle already stated inline) permit Delete with cleanup in the same commit. **Substantive** ones (the citing doc relies on the content) point to Replace, or Keep with narrowed scope. Mixed or unclear: stale-mark.

**Auto-delete** (no confirmation, either mode) only when all three hold: the implementation once lived in this repo and is gone (or the lesson is fully superseded or plainly redundant); the problem domain is gone, or for a superseded or redundant lesson, the surviving canonical lesson already states its guidance (topical overlap is not coverage: find the specific content there first); inbound citations are absent or unambiguously decorative. Any condition fails: Replace, Update, Consolidate, stale-mark, or ask.

**Pattern docs** (`<lessons-dir>/patterns/`) get the same five outcomes judged as *derived* guidance: does the generalized rule still hold given the refreshed lessons beneath it? A pattern with no supporting lessons is itself a stale signal. Base a pattern Replace on the refreshed lessons, not fresh invention.

## Decide (interactive only)

Apply unambiguous Keeps, Updates and Consolidations without asking. Ask only when the action is genuinely ambiguous, a Delete fails the auto-delete gate, the canonical lesson in a Consolidate is not clear-cut, or you are about to Replace or Split (Split writes successors and deletes the original: confirm its fragment boundaries like a Replace). Show the path, 2-4 evidence bullets and the recommended action; offer only plausible alternatives plus "skip for now". On a broad sweep, work in batches and confirm before each next batch rather than front-loading the whole queue.

Capture records a newly solved problem; refresh keeps the store true as the code moves, lesson by lesson and as a set. Consolidate proactively: every capture adds a lesson, and redundant lessons drift.
