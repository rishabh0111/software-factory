# Refresh report and commit

Steps 6 and 7 of [refresh.md](../../refresh.md).

## Report

Print it in full as markdown: the deliverable, not an internal summary, self-contained and never abbreviated.

```text
Lesson Refresh Summary
======================
Scanned: N lessons

Kept: X
Updated: Y
Consolidated: C
Replaced: Z
Deleted: W
Skipped: V
Marked stale: S

Worth lens: <confirmed | recommended-only (non-interactive) | off>
Glossary: <scanned, no qualifying terms | created with N entries (M seeded) | updated — N added, N refined, N reconciled, N folded, N retired, N deleted, N scrubbed | repo-wide map created with N entries>
```

Then, for **every** lesson processed: path, outcome, evidence (memory-sourced findings tagged "(auto memory [claude])", `retire_when` results with the date checked), and the action taken or recommended. For a Consolidate: which lesson was canonical, what was merged, what was deleted. Group Keeps under a reviewed-without-edits section.

Split the actions into **Applied** (writes that succeeded) and **Recommended**. Recommended holds failed writes (with enough context for a human to apply them) and everything that never runs unattended: relocations that failed the four-condition gate (lesson, target, failing condition), splits (lesson, proposed boundaries), worth verdicts in non-interactive mode, category-shape observations, potential product regressions where code violates independently supported guidance, guidance files a lesson names that contradict it, and the discoverability recommendation. When no write succeeded, the report is a maintenance plan. When `_archived/` exists, list its files and recommend restoring, deleting or consolidating each.

## Commit

Skip when nothing changed. Check the current branch, whether the tree holds unrelated uncommitted changes, and the recent commit style. Stage **only** the files this refresh modified, and write a message in the repo's convention that says what the refresh did ("update 3 stale lessons, consolidate 2 overlapping, delete 1 obsolete").

**Interactive**, ask with the recommended option first:

- on the default branch: branch, commit and open a PR (recommended, with a specific branch name) / commit directly to the current branch / don't commit;
- on a clean feature branch: commit to it (recommended) / separate branch / don't commit;
- on a dirty feature branch: stage and commit only the refresh's files / don't commit.

**Non-interactive**: on the default branch (main, master, or whatever the remote designates), create a branch named for what was refreshed (`docs/refresh-auth-lessons`), commit, and try to open a PR; when PR creation fails, report the branch name. On a feature branch, commit separately on it. On any git failure, put the recommended commands in the report and continue.
