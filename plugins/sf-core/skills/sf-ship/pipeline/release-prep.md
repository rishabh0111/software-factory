# Release prep

Stage 8 of [the Open a PR branch](../open-pr.md): version, CHANGELOG, TODOS, the docs check, then commits. All of it runs on the reviewed tree from stage 7.

## Version

Reuse a bump level already recorded in this invocation. Otherwise:

1. **Classify, read-only.** The version file is `VERSION`, else the manifest's version field. Compare it on this branch with `git show origin/<base>:<file>` and keep the base value as `BASE_VERSION`:
   - **Fresh** (same as base): choose the level in item 2, then write it in item 3.
   - **Already bumped:** keep the current value as `NEW_VERSION`. Without a recorded level, derive it from the first component that changed. Never bump twice.
   - **Overtaken:** the branch value is not above the base value, or another open PR against the base already claims it (the **Land** branch reports this as VERSION drift). Treat it as fresh from the current `BASE_VERSION`, keeping the recorded level, and rewrite the version file, manifest and CHANGELOG header together.
   - **Drift:** the manifest disagrees with `VERSION` while `VERSION` matches base. Stop: reconcile the manual edit, then classify again.
   - **No version file:** ship without a version change: skip the rest of this section and the CHANGELOG, and never create a version file.
   - **A configured version file missing, empty or malformed:** stop and show it; fix it, then classify again. Never substitute `0.0.0`.
2. **Choose the level** from the diff. Micro (when the file has a fourth component): under 50 lines, trivial tweaks or config. Patch: 50 or more lines with no feature signal. Minor: ask, for any feature signal (a new route, page, migration or module) or 500 or more lines. Major: ask, for milestones or breaking changes. The question offers the recommended level with its reason, the next smaller level, and cancel; cancel stops before any release write or push.
3. **Write the bump:** raise `BASE_VERSION` at the level and write it in the file's own format (three or four components), then to the manifest and to existing lockfiles, never creating one. `VERSION` is authoritative; a four-component value is written to a three-component manifest as its first three (`1.67.0.0` → `1.67.0`).

## CHANGELOG

Skipped with no version file.

1. Read the `CHANGELOG.md` header for its format.
2. List every commit on the branch (`git log origin/<base>..HEAD --oneline`) and keep the list as a checklist; read the full diff to see what each one changed.
3. Group the commits by theme before writing: features, performance, fixes, removals, infrastructure and tests, refactors.
4. Write one entry for the new version, replacing any entries this branch already added: `## [<version>] - <YYYY-MM-DD>` after the file header and before the first release entry, with `### Added`, `### Changed`, `### Fixed` and `### Removed` as they apply.
5. **Voice:** lead with what the user can now do that they could not before, in plain language. No implementation detail, no internal tracking, no contributor-only notes.
6. Cross-check against the commit list: every user-facing change is represented. Merges, version bumps and fixes to work introduced earlier on this branch need no bullet.

Infer the entry from the diff and history; the user is not asked to describe the changes.

## TODOS

Follow [todos-format.md](../../../references/todos-format.md).

1. **Open or create** root `TODOS.md`. An approved deferral from an earlier stage authorizes creating it with `# TODOS` and `## Completed`; otherwise a missing file asks A) create it, organized by component and priority, B) skip.
2. **Organization:** component headings, `**Priority:**` P0 to P4, `## Completed` at the bottom. A disorganized file asks A) reorganize, keeping every item (recommended), B) leave it.
3. **Add approved deferrals:** the distribution follow-up from stage 2 (P1), each plan item deferred in stage 6 (P1, with `Deferred from plan: <plan path>`), and the P0 test-failure entries from stage 4, deduplicated. Dropped scope never becomes a TODO, and no follow-up is invented.
4. **Mark completions:** move an item proven done by the diff, the untracked files or the commits to `## Completed` with `**Completed:** v<version> (<YYYY-MM-DD>)`. Uncertain items stay open.
5. **Summarize** additions, deferrals and completions. A declined creation or failed write is a warning, not a stop: the PR body carries the unsaved follow-ups, never a claim that they were saved.

## Docs check

Run on every invocation. Read the diff against the base and the project's docs (README, CHANGELOG, usage and setup docs, `CLAUDE.md` and `AGENTS.md`). The docs are **current** when every change in the diff to user-facing behavior, commands, configuration or setup is already described on the branch, or the diff changes none of them.

Docs not current: stop before the commits and ask: A) pause so the user runs `/sf-release-docs` on this branch, then reruns `/sf-ship` (recommended); B) ship with the named documentation gap.

Record the outcome under **Documentation** in the invocation record, with the tree snapshot: `current`, `updated` (the user ran `/sf-release-docs` and its changes are on the branch), or `gap: <what is missing>`. The PR body always carries it. The step is done when the outcome is recorded.

## Commits

Make bisectable commits; work already committed stays as it is. Never create an empty commit.

1. Group each change with its tests, config and routes, views, and the docs it needs; a migration may stand alone. Under 50 lines across fewer than four files may be one commit.
2. Order by dependency: infrastructure, then models and services, then controllers and views. Each commit works on its own: no broken import, no missing code.
3. The version file, CHANGELOG and TODOS go last, in one commit: `chore(release): bump version and changelog (v<version>)`. Only that commit carries the version. No Git tag.
4. Messages follow Conventional Commits, `type(scope): summary`, with a short body when the reason is not obvious. Fixing an issue the user named adds a `Fixes: #<n>` trailer.
