# Forge commands

The commands sf-ship uses, per `tracker.cli`. `<trunk>` is `code.default_branch`, `<n>` a GitHub PR number, `<iid>` a GitLab MR number, `<sha>` the full head SHA recorded in the ship record. Sign-in belongs to the user's CLI; never print or pass tokens.

On self-managed GitLab, `glab` takes the host from the git remote. If it picks the wrong one, add `--hostname <tracker.host>` to `glab api` calls. In `glab api` paths, `:id` is replaced with the current repo's project.

Check the CLI supports a flag before relying on it (`gh pr merge --help`, `glab mr merge --help`). If the SHA-guard flag is missing, use the API form below, or don't merge.

## Find or open the PR/MR

Write the description to `runs/<run-id>/evidence/pr-body.md` first.

| | GitHub | GitLab |
|---|---|---|
| Existing one for the branch | `gh pr list --head sf/<run-id> --state open --json number,url` | `glab mr list --source-branch sf/<run-id> -F json` |
| Open | `gh pr create --base <trunk> --head sf/<run-id> --title "<title>" --body-file runs/<run-id>/evidence/pr-body.md` | `glab mr create --source-branch sf/<run-id> --target-branch <trunk> --title "<title>" --description "$(cat runs/<run-id>/evidence/pr-body.md)" --yes` |
| Update the description | `gh pr edit <n> --body-file runs/<run-id>/evidence/pr-body.md` | `glab mr update <iid> --description "$(cat runs/<run-id>/evidence/pr-body.md)"` |

Don't pass `--draft`. Leave squash and branch-removal settings to the project's defaults when opening. Write the title to `runs/<run-id>/evidence/pr-title.txt` and scan it and the body first ([secret-scan.md](secret-scan.md)).

**Lookup.** The existing-PR query must succeed and return zero or one result. A failed command, an error, or more than one match stops ship: it never means "none exists", since opening a second PR/MR on the same branch splits review and CI.

**Read back.** After opening or editing, read the title and description once (`gh pr view <n> --json title,body`; `glab api projects/:id/merge_requests/<iid>`, fields `title`, `description`) and check they equal the scanned files. A difference (a forge template or bot rewrote it) is recorded and, if it adds text, scanned.

## Read the head and checks

GitHub, one pass:

```sh
gh pr view <n> --json headRefOid --jq .headRefOid
gh pr checks <n> --json name,state,bucket,link,workflow
gh pr checks <n> --required --json name,state,bucket
gh pr view <n> --json headRefOid --jq .headRefOid
gh pr view <n> --json state,baseRefName,mergeable,mergeStateStatus
```

Act on the JSON, not the exit code (`gh pr checks` exits 8 while checks are pending). An empty result with "no checks reported" on stderr means no checks exist yet.

GitLab, one pass:

```sh
glab api projects/:id/merge_requests/<iid>
# use: state, target_branch, sha, head_pipeline.id, head_pipeline.sha, head_pipeline.ref, head_pipeline.status, detailed_merge_status
glab api --paginate projects/:id/pipelines/<pipeline-id>/jobs
# use per job: name, status, allow_failure, web_url
glab api projects/:id/pipelines/<pipeline-id>/bridges
# downstream pipelines; read their jobs the same way
glab api projects/:id/merge_requests/<iid>        # re-read sha
```

## Logs and reruns

| | GitHub | GitLab |
|---|---|---|
| Failed log | `gh run view <run-id> --log-failed` (the run ID is in the check's `link`) | `glab api projects/:id/jobs/<job-id>/trace` |
| One fresh run (flake rule) | `gh run rerun <run-id>` (the whole run, not `--failed` or `--job`) | MR pipeline: `glab api -X POST projects/:id/merge_requests/<iid>/pipelines`. Branch pipeline: `glab ci run --branch sf/<run-id>` |

## Merge on the checked head

Merge now, after every check passed on `<sha>`. `<subject>` is the first line of `runs/<run-id>/evidence/merge-message.md`; for GitHub, also write the body alone to `<body-file>` (`runs/<run-id>/evidence/merge-body.md`) ([merge-gate.md](merge-gate.md#merge-message)):

- GitHub: `gh pr merge <n> --squash --match-head-commit <sha> --subject "<subject>" --body-file <body-file>`
- GitLab: `glab mr merge <iid> --sha <sha> --squash --squash-message "$(cat runs/<run-id>/evidence/merge-message.md)" --auto-merge=false --yes`
- GitLab API form: `glab api -X PUT projects/:id/merge_requests/<iid>/merge -f sha=<sha> -f squash=true -f squash_commit_message="$(cat runs/<run-id>/evidence/merge-message.md)"`

Without squash, GitLab takes the message as `--message` (API: `merge_commit_message`). If the CLI rejects a message flag, check `--help`; if it has none, use the API form rather than merging under the forge's default message.

`glab mr merge` sets auto-merge by default, so pass `--auto-merge=false` for an immediate merge. The GitLab API answers 409 when `sha` doesn't match the head, and 405 or 422 when the MR can't be merged. Use `--merge` or `--rebase` (GitHub) or drop `--squash` (GitLab) only when the project doesn't allow squash.

## Auto-merge

Only when the merge gate allows it and `code.branch_protected` is `true` (see SKILL.md step 6).

| | GitHub | GitLab |
|---|---|---|
| Arm (pass the same message flags as above) | `gh pr merge <n> --squash --auto --match-head-commit <sha>` | `glab mr merge <iid> --sha <sha> --squash --yes` (auto-merge is the default), or `glab api -X PUT projects/:id/merge_requests/<iid>/merge -f sha=<sha> -f squash=true -f auto_merge=true` |
| Disarm | `gh pr merge <n> --disable-auto` | GitLab cancels auto-merge itself when new commits are added. Confirm with the MR's `merge_when_pipeline_succeeds` field. To cancel by hand: `glab api -X POST projects/:id/merge_requests/<iid>/cancel_merge_when_pipeline_succeeds`. It answers 201 even when it refuses, so re-read the MR afterwards. Newer servers also offer `cancel_auto_merge`, which answers 409 on refusal |

On GitLab servers that reject `auto_merge`, the older parameter is `merge_when_pipeline_succeeds=true`.

GitHub only disables auto-merge on its own when someone without write access pushes. A push by a writer leaves it armed, which is why sf-ship keeps watching and disarms on any head change.

## Merge queues and trains

If the repo uses a GitHub merge queue (branch protection or a ruleset requires it; `gh pr merge` then reports it adds the PR to the queue) or a GitLab merge train (`merge_trains_enabled` on the project), merging means enqueueing, with the same SHA guard and message flags. Then poll the entry every 60 seconds for up to 30 minutes:

- GitHub: `gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){state mergeQueueEntry{state position}}}}' -f o=<owner> -f r=<repo> -F n=<n>`
- GitLab: `glab api projects/:id/merge_trains/merge_requests/<iid>` (`status`), and the MR's `state`

Merged: continue. Removed from the queue or train without merging: stop and report why (a failed queue build is a CI failure on the merge result). Past 30 minutes: stop resumable with `Next: check queue for <PR link>`. Never dequeue or cancel the forge's request yourself. A queue or train tests the merge result, which answers [merge-gate.md](merge-gate.md#before-merging) check 3.

## After the merge

| | GitHub | GitLab |
|---|---|---|
| Confirm merged | `gh pr view <n> --json state,mergedAt,mergeCommit` (`state` is `MERGED`; the SHA is `mergeCommit.oid`) | `glab api projects/:id/merge_requests/<iid>` (`state` is `merged`; the SHA is `merge_commit_sha` when set, else `squash_commit_sha` for a fast-forward squash) |

Then `git fetch origin <trunk>` and `git merge-base --is-ancestor <merge-sha> origin/<trunk>` must succeed.

| | GitHub | GitLab |
|---|---|---|
| Issue still open? | `gh issue view <m> --json state` | `glab api projects/:id/issues/<m>` (`state`) |
| Close with a note (under `policy.close`) | `gh issue close <m> --comment "$(cat <file>)"` | `glab issue close <m>` then `glab issue note <m> -m "$(cat <file>)"` |
