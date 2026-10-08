# Merge gate

What sf-ship checks between "verified" and "merged", and the commands for each check. `<trunk>` is `code.default_branch`. Write every result to the ship record.

## Trunk ref

`<trunk-ref>` is the trunk the head is compared with. Decide it once, before the binding, and write it in the ship record:

- **Forge path** (a remote exists and step 3 opens a PR/MR): `origin/<trunk>`. Run `git fetch origin <trunk>` before reading it.
- **No-forge path** (`git remote` prints nothing, or `tracker.kind: local` with `tracker.cli: none`): the local `<trunk>`. Never run `git fetch origin` on this path. With no remote it fails; with one, the local finish merges into the local branch, so that is the trunk that counts.

## Binding

A verdict describes one patch on one base. Record these values when ship starts, and again after any rebase:

```sh
git fetch origin <trunk>                              # forge path only
git rev-parse HEAD                                    # head SHA
git rev-parse <trunk-ref>                             # trunk SHA
git merge-base HEAD <trunk-ref>                       # base SHA
git diff "$(git merge-base HEAD <trunk-ref>)" HEAD | git patch-id --stable   # first field is the patch-id
bash .software-factory/bin/wtree.sh                   # content fingerprint
```

Rules:

- The fingerprint must match the one `sf-verify` and `sf-review` recorded. That is what makes their verdicts apply to this head.
- A rebase or a base change rewrites SHAs without touching any check, so it can void a verdict silently. After one, compare the old and new patch-ids. Equal means the change itself is the same; different means it changed. Either way the fingerprint changed, so verify and review run again before ship continues. Writing both patch-ids in `ledger.md` lets review see whether the patch changed.
- Never accept matching commit messages, or a green check on an older SHA, as evidence for the current head.
- From the binding on, sf-ship writes no tracked file. A decision goes to `runs/<run-id>/decisions.md`; an edit to `.software-factory/decisions.md` or any other tracked file would change the fingerprint and void the verdicts.

## Reading checks

One pass reads the head, then every check, then the head again. A head that moved between the two reads voids the pass. Commands per forge are in [forge-commands.md](forge-commands.md#read-the-head-and-checks).

Read all checks, not only required ones: an optional check can still show a real defect.

| Result | Counts as |
|---|---|
| Success (GitHub `state: SUCCESS`; GitLab job `status: success`) | pass |
| Skipped (GitHub `SKIPPED`; GitLab `skipped` or `manual`) | pass only if the check is not required (GitHub) or the pipeline's overall status is `success` (GitLab). List each one in the ship record |
| Pending, queued, running, created, waiting | pending |
| GitHub `NEUTRAL` | hold. It is not a pass. Read what it reports and ask a person, or treat it as a failure when unattended |
| GitLab `failed` with `allow_failure: true` (pipeline "passed with warnings") | hold, as above |
| Failure, error, cancelled, timed out, action required, startup failure, stale, any value not in this table, a missing field | failure |

The CI verdict for the head is the worst row: any failure fails, else any hold holds, else any pending waits, else pass.

No checks at all: right after a push, wait up to 2 minutes for checks to register (skip the wait when `code.ci` is `missing`). If there are still none, record "no CI ran on <sha>". sf-verify's local evidence still stands, but the merge then needs a person's yes whatever the policy says.

**Excluding a check.** A person may exclude one named non-required check that fails or holds, for the recorded head only: record the check name, the head SHA, who decided and why in `runs/<run-id>/decisions.md` and the ship record. The exclusion dies with that head; any new head reads every check again. A required check can't be excluded, and an agent never excludes one on its own.

GitLab: the MR's `head_pipeline.sha` must equal the MR's `sha`. A pipeline for another SHA is not evidence for this head. If the pipeline has downstream (bridge) jobs, read the downstream pipeline's jobs too.

## Failures and flakes

1. Read the failing log ([forge-commands.md](forge-commands.md#logs-and-reruns)). Copy the relevant lines to the ship record.
2. If the failure is in a file the branch changes, or in a test that covers one, it is real. Go back to `build` with the excerpt in `ledger.md`.
3. If it is outside the diff, check for a stale base first: `git merge-base --is-ancestor <trunk-ref> HEAD`. If trunk is not an ancestor, a change on trunk may be the cause; handle it as a failed "before merging" check (rebase), not as a flake.
4. Otherwise it may be a flake or an infrastructure fault. It earns one fresh run of the whole pipeline or workflow, not a retry of the single job. One only.
5. If the second run fails the same way (same check, same error), it was never a flake. Treat it as real: read the full logs and go back to `build` (or to `debug` if the cause isn't clear). Never retry a third time.

## Before merging

Forge path only (the no-forge path uses [local-finish.md](local-finish.md)). Run these right before the merge, against freshly fetched trunk, and write each result to the ship record.

**1. PR/MR state and target.** Read the state and target branch from the forge ([forge-commands.md](forge-commands.md#read-the-head-and-checks)). Closed without a merge: stop, `waiting for human`. Already merged (someone else merged it): don't merge again; record the merge SHA and go to the deploy step under its own gate. Open: the target branch must equal `code.default_branch`; a retargeted PR/MR voids the gate's approval, since the SHA guard protects the head, not the destination. Stop and ask.

**2. Conflicts and overlap.**

```sh
git fetch origin <trunk>
git merge-tree --write-tree origin/<trunk> HEAD > /dev/null; echo $?   # 0 clean, 1 conflicts (git 2.38+)

BASE=$(git merge-base HEAD origin/<trunk>)
git diff --name-only "$BASE" origin/<trunk>   # files trunk changed since the base
git diff --name-only "$BASE" HEAD             # files this branch changes
```

**3. Has trunk moved?** If `origin/<trunk>` is not the recorded base (`git merge-base --is-ancestor origin/<trunk> HEAD` fails), the verified tree isn't what will land. That is acceptable only when the forge's CI tests the merge result against current trunk: a merge queue or merge train, or a GitLab merged-results pipeline (or a GitHub `pull_request` workflow, which builds a temporary merge commit) that started after trunk's current SHA landed and passed on this head. If you can't tell, it doesn't. Otherwise, rebase and re-verify.

**4. Deleted and renamed symbols.** A merge can be textually clean and still break trunk when trunk added callers of something this branch removes. List the names the branch deletes or renames:

```sh
git diff -U0 "$BASE" HEAD -- . ':(exclude).software-factory' \
  | grep -E '^-[^-]' \
  | grep -oE '\b(def|func|function|class|interface|type|const|struct|enum|fn)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*' \
  | awk '{print $NF}' | sort -u > runs/<run-id>/evidence/removed-symbols.txt
```

Drop names that still appear at `HEAD` (`git grep -qw <name> HEAD`): those were kept or moved, not removed. For each remaining one, `git grep -nw <name> origin/<trunk>` outside this branch's changed files. Any hit on trunk that isn't in the merge base is a new caller: rebase and re-verify.

**5. Decisions log.** `git diff "$BASE" HEAD -- .software-factory/decisions.md | grep -E '^-[^-]'` prints nothing. The log is append-only; a deleted or edited line goes to a person.

**6. Soak.** When `limits.merge_soak_minutes` is set above 0, the head and its CI verdict must have stayed unchanged for that long, timed from the first passing CI pass in the ship record. Any change restarts the clock; missing history doesn't count as time served.

The head may merge as it is when:

- `git merge-tree` exits 0, and
- trunk hasn't moved, or the forge tested the merge result as in check 3, and
- no file trunk changed is also changed by this branch, and
- no file trunk changed is CI config: `.github/workflows/`, `.github/actions/`, `.gitlab-ci.yml`, `.gitlab/ci/`, and any local file `.gitlab-ci.yml` includes. These decide which checks ran, so a change there makes the head's CI result stale, and
- check 4 found no new caller.

If any fails, rebase:

```sh
OLD=$(git rev-parse HEAD)
git -c core.longpaths=true rebase origin/<trunk>   # on conflict: git rebase --abort, go back to build
git push --force-with-lease=sf/<run-id>:"$OLD" origin sf/<run-id>
```

`core.longpaths` matters only on Windows, where a deep worktree path otherwise fails with "Filename too long" before the rebase starts; elsewhere git ignores it. That error is not a conflict: retry with the setting, and if it persists, stop and report it rather than sending the run to `build`.

Force-push only the run's own branch, only with the lease, after the secret scan of the new range ([secret-scan.md](secret-scan.md)). Then record the new binding and send the run back to verify (see Binding).

Also check the forge agrees before merging: GitHub `mergeStateStatus` is `CLEAN` (or `HAS_HOOKS`); GitLab `detailed_merge_status` is `mergeable`. `BEHIND` or `need_rebase` means rebase. `BLOCKED`, `not_approved` or `discussions_not_resolved` means the forge wants something from a person: report what, and wait.

## Merge errors

After any non-zero exit from a merge or enqueue command, read the PR/MR state from the forge before doing anything else:

- `merged`: record the merge SHA and continue; never merge again.
- Open, and the error says the head moved (GitHub head-mismatch, GitLab 409): a head change, as in step 4 of `SKILL.md`.
- Open, with any other error, or an error you can't classify: stop and report the error and the state. Don't retry.
- Closed: stop.

Never pass `--admin`, never use a protection bypass or an admin-merge API, and never change branch protection or required checks to get a merge through.

## Needs a person's look

Some changes alter what agents or CI do on every later run, so a passing check proves little about them. Find them once, at the binding, and list them in the description's `Needs a person's look` line and the ship record:

```sh
BASE=$(git merge-base HEAD <trunk-ref>)
git diff --name-only "$BASE" HEAD | grep -E '^\.software-factory/bin/|^\.software-factory/config\.yaml$|^\.github/(workflows|actions)/|(^|/)\.gitlab-ci\.yml$|^\.gitlab/|^\.circleci/|^Jenkinsfile$|^azure-pipelines\.yml$|^bitbucket-pipelines\.yml$|^\.buildkite/|^\.pre-commit-config\.yaml$|^\.husky/|(^|/)\.?lefthook(-local)?\.ya?ml$|(^|/)(CLAUDE|AGENTS|GEMINI)\.md$|^\.claude/|^\.mcp\.json$|^\.cursor/|^\.codex/|^opencode\.jsonc?$'
```

This is `sf-build`'s protected-path list ([guards.md](../../sf-build/references/guards.md#3-no-protected-path-touched)). For each hit, name the file and the commits that change it (`git log --format='%h %s' "$BASE"..HEAD -- <file>`).

**Setup files.** `sf-setup` writes `.software-factory/bin/`, `.software-factory/config.yaml`, `.software-factory/decisions.md`, `.gitattributes`, `.gitignore` and the instructions file's `## software-factory` block. A setup commit is one that changes only those. Judge them by file and content, not by where the commits sit on the branch or how many there are (a first-run setup, a setup commit at run start, an upgrade committed mid-run on resume are all treated alike):

- **First setup.** `.software-factory/bin/` doesn't exist on the base: list the setup commits' `.software-factory/` files as `setup: <files> (<sha7s>)` for information. They don't need a yes.
- **Setup upgrade.** `bin/` exists on the base, and every `bin/` file the branch changes is byte-identical at `HEAD` to the installed `sf-setup/scripts/` copy (`cmp -s`). List one item for all setup commits together: `setup upgrade: .software-factory/bin/ and config.yaml replaced by sf-setup <old> -> <new> (<sha7s>); scripts decide evidence, so a person confirms the upgrade`, taking the versions from the `setup upgraded` Notes lines in `state.md` (or `unknown`). It needs a person's yes (so `merge: auto` waits), but isn't reported file by file.
- **Anything else** is judged as below: a `bin/` file that differs from the installed copy, or a `config.yaml` change in a commit that also changes other files (list that file by commit).

Every other hit makes the merge need a person's yes, whatever `policy.merge` says.

Four more kinds of change need a person's yes, because they widen who can do what, what the product holds about people, what an earlier spec promised, or what the tests used to pin:

- **Auth scope.** Any changed file in verify's `auth` scope ([gates.md](../../sf-verify/references/gates.md#scope)), and any diff that adds or changes a sign-in flow, role or permission grant, token scope, CORS rule or session setting.
- **Personal data.** A migration (verify's `migrations` scope) that adds columns or tables holding personal data (names, emails, phone numbers, addresses, birth dates, government IDs, payment details, precise location, health data), or copies or exposes existing ones.

- **Spec override.** The run's spec overrides another spec's capability, non-goal or `Do not touch` line (its `Overrides` entries, [spec-rules.md](../../sf-spec/references/spec-rules.md#overriding-another-spec)). Name each override with both spec IDs. A spec from before that rule may have no `Overrides` section (`state.md` Notes say which stages ran under older skills): then read its `Terms and decisions` and `Non-goals` for lines that reverse another spec, and list those.
- **Test changes accepted by rule.** Every `accepted-by-rule:` line in verify's `report.md` Notes: an existing test's assertion changed or removed because the spec changed the behaviour it pinned, accepted without a person by gate 4's rule ([gates.md](../../sf-verify/references/gates.md#deciding-each-finding)). List each with its file and line, the plan entry, the `test-change` ledger line and the capability whose holdouts passed, so a person confirms the old expectation was meant to go.

List each in the description's `Needs a person's look` line with its files and commits, and in the ship record.

## Waiting for a person, and resuming

With `merge: manual` (or any merge that needs a yes) and nobody present, ship stops after the CI pass and the before-merge checks. Write a `## Waiting for merge` entry in the ship record: the time, what is waiting (`merge: manual`, or the reasons from the merge row), the recorded head SHA, the CI verdict, the last comment ID read, and the exact merge command with its SHA guard. Set `state.md` to `waiting for human` with `Next: merge <PR link> at <sha7> after re-check`.

A comment or a push can arrive while nobody is watching. So when the run is resumed for the merge (a person says yes, or the conductor resumes it), never act on the stored state. First:

1. Read the PR/MR state and target branch first, as in [Before merging](#before-merging) check 1: merged by someone else, record the merge SHA and go to deploy under its own gate (never merge again or claim a deploy you didn't see); closed, stop; retargeted, stop and ask.
2. Read the PR/MR head SHA. If it isn't the recorded head, someone pushed: all evidence is void. Record it and set `Next` to verify; verify, review and ship start again on the new head.
3. Run one full CI pass on the head ([Reading checks](#reading-checks)). Anything but pass: handle it as in step 4 of `SKILL.md`.
4. Read new review comments since the recorded ID ([review-comments.md](review-comments.md)). An accepted point goes to `build`; a question waits for its answer.
5. Re-run [Before merging](#before-merging).

Merge only when the head is unchanged, the checks still pass, no new comment is unanswered, and the before-merge checks pass. Add a `Resumed` line to the ship record with the results. If the host can schedule a wake-up, it may run steps 1 to 4 on a timer while waiting and record each; acting still needs the yes.

## Merge message

A squash or merge commit lands on trunk under a message ship writes, so it follows the repo's commit style:

1. Read the last 20 subjects on trunk: `git log --no-merges --format=%s -20 <trunk-ref>`.
2. If they follow one consistent convention (Conventional Commits, `Add X (#70)`, a ticket prefix, a capitalised imperative), write the subject the same way. If the convention ends subjects with the PR/MR number, add it yourself: an explicit subject replaces the forge's default. Otherwise use Conventional Commits: `<type>(<scope>): <summary>`, imperative, no trailing period, at most 72 characters.
3. Body: two or three lines from the description's summary, and the same `Closes`, `Part of` or `Refs` lines as the description ([pr-description.md](pr-description.md#closing-issues)). No evidence dump.
4. Use the same subject as the PR/MR title, so the forge's default squash message matches if a person merges by hand.

Write it to `runs/<run-id>/evidence/merge-message.md` (subject on the first line, blank line, body) scan it ([secret-scan.md](secret-scan.md)), and pass it explicitly; commands are in [forge-commands.md](forge-commands.md#merge-on-the-checked-head). Record the subject in the ship record. A local fast-forward ([local-finish.md](local-finish.md)) creates no commit, so it needs no message.
