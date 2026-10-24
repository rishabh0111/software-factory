# Verify and push

Stage 9 of [the Open a PR branch](../open-pr.md). **No completion claim without fresh verification evidence.** Run the five steps in order. A content change during or after this stage restarts it at step 1; a commit that only records content already verified keeps the evidence valid.

## 1. Finish writers and build

Confirm every subagent that could still write has finished or been stopped; a timeout alone is not proof. Then run the project's declared generation and build commands (from `CLAUDE.md`, `AGENTS.md`, manifests, build files and CI) and record the results. None declared: record "not applicable" with the sources you checked. A missing prerequisite or failed build stops the run: **Build failed or prerequisite missing**, with the command, the error and the repair needed. Never invent a substitute command.

## 2. Compare with the reviewed tree

Take a tree snapshot and diff it against the reviewed tree from stage 7 (`git diff --name-only <reviewed-tree> <current-tree>`). A missing snapshot blocks this comparison, whatever HEAD says.

1. **Behavior, tests, prompts or build inputs changed:** rerun from stage 4 per the repair rule, then return here.
2. **Only authored docs or release metadata changed:** recheck the plan items those files touch with their recorded verification; if one no longer holds, rerun the plan audit's gate, then return here.
3. **Nothing else changed:** continue.

## 3. Recheck the docs outcome

Compare the current tree with the snapshot the docs outcome was recorded against. Docs or user-facing behavior changed since: rerun the docs check and the commits from stage 8, then return here. An earlier invocation's outcome never counts.

## 4. Check every receipt

Run any declared docs, link or generated-file checks, naming any that are unavailable.

A check's earlier result is reused only when its inputs match: compare the hashes or bytes of every file, fixture, dependency and parameter it consumed. Changed or unknown inputs mean a rerun. A model judge also compares the full request, rubric and parameters. Cite the original command, result, timestamp and log; never resample.

For each test lane from stage 4, compare the tree snapshot recorded with its run to the current one. Only release metadata (`CHANGELOG.md`, the version file, a version-only edit to the manifest) is exempt; scripts, dependencies and runtime config are not. Docs, TODOS, new or generated tests and fixes make the evidence stale. A run older than 24 hours is stale.

| Receipt | Action |
|---|---|
| **Fresh:** exit 0, same command, only exempt paths changed | Cite label, exit, timestamp, log and `tests_ran`. |
| **Stale or missing** | Rerun the lane's command the same way, read the result, check again. |
| **ZERO-RUN** (`tests_ran: 0`) | A failed lane, never fresh, whatever the exit code. |
| `tests_ran: unknown` | Keep the exit-0 verdict, cite `count unavailable`. |

No test lanes at all: the untested-scope approval from stage 4 must cover the final content, or the run goes back to stage 4. Report the gap, never fresh. A new, changed or unwaived test failure stops publication and goes back to stage 4's failure triage.

## 5. Report, then push

Commit any approved, verified release change still uncommitted (generated outputs included), using stage 8's grouping rules. Leave unrelated user files alone.

Paste the build, docs and test results. A waiver is reused only for the same verified pre-existing failures and the same scope; cite the approval and the failing counts, never "all green". Then two honesty lines, written as an auditor of this session's own edits, not a defender of them:

- each gate finding from stage 7 with its path, disposition (`kept`, `restored`, `open`) and reason, or the `Gate edits:` coverage line when there are none;
- each test lane's `tests_ran` (N, ZERO-RUN or `count unavailable`).

**An open gate finding against an existing ready PR.** Before pushing, when stage 7 left a finding `open`, look up an open PR for `<branch>` (`gh pr list --head <branch> --state open --json number,isDraft`; `glab mr list --source-branch <branch> -F json`, field `draft`). A failed lookup stops here. An existing PR that is not a draft:

- in an unattended or spawned session, stop before pushing and report the open findings and the PR;
- otherwise ask once: A) resolve the open items now (back to stage 7); B) publish ready with a `Gate edits: N open` banner, recorded in **Decisions** as a human-authorized publication. A ready PR is never converted to a draft.

A new PR or an existing draft needs no question: stage 10 opens it as a draft.

**Push only what is not already there:**

```bash
LOCAL=$(git rev-parse HEAD) || exit 1
REMOTE_REF=$(git ls-remote --heads origin "refs/heads/<branch>") || { echo "BLOCKED: cannot read the remote branch"; exit 1; }
REMOTE=$(printf '%s\n' "$REMOTE_REF" | awk '{print $1}')
[ "$LOCAL" = "${REMOTE:-none}" ] && echo "ALREADY_PUSHED" || git push -u origin <branch>
```

From a detached HEAD the push is `git push -u origin HEAD:refs/heads/<new-branch>`.

**A failed push stops the run**, with no publication and no claim of one:

- **Non-fast-forward:** fetch the remote branch, merge it under stage 3's conflict rules, and rerun from stage 4.
- **Authentication, hook or network failure:** repair the cause, then repeat this stage from step 1 even with unchanged content. A failing hook is fixed, never bypassed.

Only a successful push or a verified `ALREADY_PUSHED` continues to stage 10. Nothing writes docs after the push.
