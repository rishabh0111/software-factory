# Open a PR

The **Open a PR** branch of `sf-ship`: take the current feature branch through the release gates, push it, and open or update its pull or merge request. Steps 1 and 2 of [SKILL.md](SKILL.md) have run: you hold the forge, the base and the workspace state.

The run is a sequence of **stages**. Each stage ends on its own done-condition; the next starts only after it. A stage that lives in a file is read in full from that file before it starts.

| # | Stage | Where |
|---|---|---|
| 1 | Preflight | below |
| 2 | Distribution check | below |
| 3 | Merge the base | below |
| 4 | Tests and evals | [pipeline/tests.md](pipeline/tests.md) |
| 5 | Coverage audit | [pipeline/test-coverage.md](pipeline/test-coverage.md) |
| 6 | Plan completion and scope | [pipeline/plan-completion.md](pipeline/plan-completion.md) |
| 7 | Pre-landing review | [pipeline/review.md](pipeline/review.md) |
| 8 | Release prep: version, changelog, TODOS, docs, commits | [pipeline/release-prep.md](pipeline/release-prep.md) |
| 9 | Verify and push | [pipeline/verify-and-push.md](pipeline/verify-and-push.md) |
| 10 | Publish the PR, or hand off without one | [pipeline/pr-body.md](pipeline/pr-body.md), [pipeline/handoff.md](pipeline/handoff.md) |

A request to distribute an Apple app through TestFlight or the App Store is not this branch: run [pipeline/apple-release.md](pipeline/apple-release.md) from whatever branch is checked out.

**Routine work needs no confirmation:** including uncommitted changes, choosing a micro or patch bump, drafting the CHANGELOG and commits, marking completed TODOs, applying the review's auto-fixes, and generating coverage tests within the coverage stage's caps. Every question the stages name is still asked; routine authorization never waives one.

**A new invocation reruns stages 1 to 9 in full**, including both reviews and the docs check, even when an earlier run got further. Stages 8, 9 and 10 detect work already done (a bump, a push, an open PR) so a rerun never duplicates it; that detection never skips verification.

## The invocation record

Keep one private Markdown file outside the repository (under the system temp folder) for this run, and note its absolute path. It lets a paused run resume and lets later stages cite earlier evidence. Its headings:

- **Release:** base, versions, bump level, the reviewed tree, fix-cycle count.
- **Decisions:** each user answer with the finding, files and action it authorized. An answer covers only that scope; a repair never widens it.
- **Checks:** each command, its result and counts, timestamp, log path and the tree snapshot it ran on.
- **Documentation:** the docs check outcome and the snapshot it was taken against.
- **Work list:** the ordered stages still to run, with the current one marked.

The **tree snapshot** identifies the exact content a check ran on, uncommitted and untracked files included. It is a Git tree hash, not a commit:

```bash
T=$(mktemp) && cp "$(git rev-parse --git-path index)" "$T" && GIT_INDEX_FILE=$T git add -A && GIT_INDEX_FILE=$T git write-tree; rm -f "$T"
```

Compare two snapshots with `git diff --name-only <old-tree> <new-tree>`.

## Repairs re-enter the work list

A change made after a stage ran invalidates the evidence that stage gathered. Insert the stages it invalidates ahead of the pending work, in order, then carry on:

- **Code, tests, prompts or build inputs changed** (a fix from review, a coverage test, a merge): rerun from stage 4 through stage 7, then continue.
- **Only docs or release metadata changed** (`CHANGELOG.md`, the version file, TODOS): rerun stage 9 only, after rechecking the docs outcome from stage 8.

Fix cycles count across the whole invocation: the third cycle that still produces fixes stops the run and reports the recurring findings.

## 1. Preflight

1. Note the current branch as `<branch>`. On the base or the default branch, stop: "You're on the base branch. Ship from a feature branch."
2. `git status` (never `-uall`). Uncommitted changes ship with the branch; nothing to ask.
3. `git fetch origin <base>`; a failed fetch stops the run until access is restored. Then read `git diff origin/<base> --stat`, the untracked files, and `git log origin/<base>..HEAD --oneline`.
4. Classify the diff per [diff-scope.md](../../references/diff-scope.md) and keep the `SCOPE_*` lines; later stages quote them.
5. For a diff over 200 lines, suggest the user run `/sf-plan-review` on it; with `SCOPE_FRONTEND=true`, mention its design lens for a full visual audit. Continue without waiting: stage 7 applies the review gates.

## 2. Distribution check

A new standalone artifact (a CLI binary, a package, a tool) needs a way to reach its users after merge; a web service already deployed does not.

1. List candidate paths: `git diff origin/<base> --diff-filter=A --name-only | grep -E '(^|/)(cmd/[^/]+/main\.go|bin/[^/]+|Cargo\.toml|setup\.py|package\.json)$'`, plus matching untracked files. Read each: a new manifest alone is not a publishable artifact; also check existing manifests for newly declared binaries or exports. Continue only when a new distributable is present.
2. Look for a release workflow: `.github/workflows/` names matching `release|publish|dist`, or `release|publish|deploy` jobs in `.gitlab-ci.yml`.
3. A new artifact with no pipeline: ask "Users cannot download this artifact after merge without a release pipeline." A) add the platform's release workflow now, B) defer it as a P1 distribution TODO (stage 8), C) not needed (internal, web-only, or covered by existing deployment).
4. On A, add packaging and publish configuration in the repository's CI conventions. Ask for unknown targets, registries or access; never invent credentials, and never publish a release during this run. The new workflow goes through tests and review with the rest.

Done when no new distributable exists, or the user's A, B or C is recorded.

## 3. Merge the base

```bash
git merge origin/<base> --no-edit
```

Resolve simple conflicts yourself (version file, generated schema, CHANGELOG ordering). A complex or ambiguous conflict stops the merge: show the conflicting choices, ask for the resolution, and wait before editing. Already up to date: continue.

If the merge changed the artifact or distribution configuration stage 2 inspected, repeat stage 2 on the merged content. Done when the branch contains `origin/<base>` with no conflict markers.

## After the PR

The PR is published at the end of stage 10. Report its URL, then:

- **Review comments arrive** (from people or review bots): work through them with `sf-respond-to-review`, then rerun this branch so the gates cover the fixes.
- **Merge and deploy:** suggest the user run the **Land** branch (`/sf-ship land`).
- **A non-obvious pattern, pitfall or architectural insight** surfaced during the run: list it with the files it concerns and suggest `/sf-learn capture`. List only what would save a future session time.
