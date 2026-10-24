# Refresh scope and triage

Step 1 of [refresh.md](../../refresh.md). Done when the candidate list is fixed and, for a broad sweep, the order of clusters is set.

1. List every `.md` file under the lessons folder, excluding `README.md` files and anything under `_archived/` (when `_archived/` exists, the report lists its files as legacy to clean up). READMEs are excluded only as candidates: whenever an action deletes, renames, moves, consolidates or replaces a lesson a catalog README lists, update that README's rows as part of the action.
2. Strip words that describe the run rather than name a lesson, category, module or keyword: an operation word (`refresh`, `audit`, `check`), a worth-lens intent, a mode token. The remainder is the hint; an empty remainder means the whole store.
3. With a hint, narrow by the first strategy that produces results: subfolder name, then frontmatter (`module`, `component`, `tags`, `title`), then filename, then content keyword. No match: ask the user to clarify (interactive) or report the miss and exit (non-interactive).
4. An empty store gets:

   ```text
   No lessons found in <lessons-dir>.
   Run `/sf-learn capture` after solving a problem to start the store.
   ```

5. **Broad sweep** (9 or more lessons): triage before investigating deeply. Read all frontmatter, cluster by module and category, spot-check that each cluster's primary referenced files still exist, and start with the highest-impact cluster (interactive: confirm the starting area; non-interactive: every cluster, in impact order). Review lessons before the pattern docs built on them, because stale lessons make a pattern look sounder than it is. When the user named a pattern doc you may start there, but inspect its supporting lessons before changing it.
