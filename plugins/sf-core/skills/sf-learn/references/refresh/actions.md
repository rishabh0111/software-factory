# Refresh actions

Step 4 of [refresh.md](../../refresh.md): follow the flow matching each lesson's outcome. Done when every lesson's flow has finished, every lesson written, moved, merged or split passes both script checks in [validation.md](../validation.md), and no citation or catalog row points at a removed path.

**Catalog READMEs.** A README row is inventory, not a citation: after any action the surviving lesson has exactly one row and a removed lesson none. Update rows as part of the action that moved, removed or replaced the lesson.

## Keep

No edit. Say in the report why the lesson remains trustworthy.

## Update

Fix in place only when the solution is still substantively correct: a renamed file reference (`app/models/auth_token.rb` to `app/models/session_token.rb`), a renamed `module:`, outdated links, implementation notes after a folder move, frontmatter brought to the current format, or a relocation. A typo with no effect on understanding, a style rewording or a cosmetic cleanup is churn and is skipped. An old fix that is now an anti-pattern, architecture that changed enough to mislead, or a materially different troubleshooting path is a Replace.

### Relocation

Read the content and decide the direction: the folder is wrong (move it) or the frontmatter is wrong (fix `category` in place, an ordinary Update). Never create a category folder for a relocation. Non-interactive, apply it only under the four-condition gate in [classify.md](classify.md); otherwise record the lesson, the proposed target and the failing condition under **Recommended**.

1. Confirm the target folder exists.
2. `git mv` the file so history follows it.
3. Set frontmatter `category` to the new folder.
4. Rewrite inbound links across the repo's markdown, catalog rows included.
5. Re-check the moved lesson's **outgoing** relative links (the move changed their base) with the mechanical claims check, and fix any that no longer resolve.

## Consolidate

This context does it directly; the lessons are already read and the merge is a focused edit. Work cluster by cluster:

1. Pick the canonical lesson: the broader, more current, more accurate one.
2. Take from the subsumed lesson whatever the canonical one lacks: edge cases, prevention rules, other debugging approaches.
3. Integrate it where it belongs in the canonical lesson (a sentence inline, a labeled section for a substantial sub-topic), not appended at the end.
4. Repoint other docs' references to the canonical lesson. Catalog rows: when both lessons had rows, drop the subsumed row (folding any unique description into the canonical row); when only the subsumed lesson had one, repoint it to the canonical lesson.
5. Delete the subsumed lesson: no archive, no redirect metadata.
6. Run the mechanical claims check on the canonical lesson: merged content brings its citations, and consolidation is where cross-references most often dangle.

Three or more overlapping lessons: merge the two closest first, then judge the result against the next.

## Split

Only when the retrieval-value test inverts: someone searching one sub-topic would be materially harmed by wading through the others, and each fragment stands on its own value. Splitting doubles the drift surface, the very risk consolidation removes. Non-interactive: never split; record the lesson, the proposed boundaries and the evidence under **Recommended**. One split at a time:

1. Dispatch one subagent with the original's full content, the sub-topic boundaries, the target paths and categories, and the contents of [schema.yaml](../schema.yaml) and [lesson-format.md](../lesson-format.md). Context every fragment needs (root cause, environment, background) is copied into each, not cross-referenced.
2. Run both script checks on every successor.
3. Repoint each inbound citation to the fragment that carries the cited content (the most relevant one when it spans several), and update catalog rows.
4. Delete the original.

## Replace

One at a time; a subagent writes each successor to protect this context.

**With sufficient evidence:**

1. Dispatch one subagent with: the old lesson's full content; the investigation evidence (what changed, what the code does now, why the old guidance misleads); the target path and category (the old category unless the category itself changed); and the contents of [schema.yaml](../schema.yaml) and [lesson-format.md](../lesson-format.md). It picks `component` and `root_cause` by the corpus-first rule, counting the old lesson as one of the corpus (its `component` counts for the area, its `root_cause` only for the cause it describes), takes fields, enums and section order from the pasted contracts and never from memory, and uses the dedicated search and read tools for further context.
2. Run both script checks on the successor. Claims-check flags are adjudication input: a successor describing removed code legitimately cites missing paths. Scaffold flags are always fixed.
3. Delete the old lesson and repoint catalog rows to the successor. The successor may carry `supersedes: [old filename]`; git history records the same.

**With insufficient evidence:** stale-mark the lesson (`status: stale`, `stale_reason`, `stale_date`), report what was found and what is missing, and recommend `/sf-learn capture` at the user's next encounter with that area.

## Delete

Only for a lesson that is clearly obsolete, redundant with nothing to merge, or whose problem domain is gone; never for age alone. Before deleting, run a final inbound-link search across the repo's markdown (content search, reading only around the matches). Each match will dangle: clean it up, catalog rows included, without re-arguing the classification. A citation that investigation never saw and that is anything but unambiguously decorative stops the delete: reclassify (non-interactive: stale-mark; interactive: ask whether Replace fits). Delete once every late citation is decorative.
