# Finishing without a forge

Used instead of steps 3 to 6 when there's no forge to open a PR/MR on: `git remote` prints nothing, or `tracker.kind` is `local` and `tracker.cli` is `none`. There is no CI and no branch protection here, so the local checks and a person's decision stand in for them.

## 1. Before offering anything

1. Step 2 of SKILL.md passed: clean tree on `sf/<run-id>`, fingerprint equal to `report.md` and `findings.md`, `Overall: pass`, no open must-fix. Without that, nothing below is offered; send the run back as step 2 says.
2. Run `commands.test` on the head once more and save `evidence/local-final.log`. Compare failures with the baseline (`evidence/baseline.log`, else `baseline:` in config): a failure whose signature also appears there is `pre-existing`, reported but not blocking. A new failure stops here and goes back to `build`.
3. Find the target: `code.default_branch`. If `state.md` names a different base (`Build base:` or the `## Debug` base), and that branch isn't the default branch, ask which one to merge into, recommending the one the run's branch was cut from. Merging into the wrong branch is costly to undo.
4. Check the target hasn't moved: `git merge-base --is-ancestor <target> HEAD`. If it fails, the target has commits the verified head doesn't. Rebase `sf/<run-id>` onto the target with `git -c core.longpaths=true rebase <target>` (the setting avoids "Filename too long" under deep Windows paths), record the old and new patch-ids in `ledger.md` as the merge gate describes, set `Next` to verify, and stop. Never merge a tree that verify and review didn't stamp.

Everything here uses local branches. Never run `git fetch origin` on this path, even when a remote exists: the target is the local branch.

## 2. The options

Show these, with the evidence lines from `report.md` and the head SHA:

1. **Merge into `<target>` locally.** Recommended when the checks above pass.
2. **Push the branch** for a PR/MR opened by hand. Only offered when a remote exists; it needs the `open_pr` gate.
3. **Keep the branch** as it is, to handle later.

Discarding the work is not on the list. It happens only when a person asks for it in so many words (section 5).

**Who decides.** A local merge always needs a person's yes, whatever `policy.merge` says: no CI ran and nothing protects the branch. Unattended, take option 3: set the run to `waiting for human`, write `Next: choose merge, push or keep for sf/<run-id> at <sha>`, and log it in `runs/<run-id>/decisions.md`. Never append to the tracked `.software-factory/decisions.md` here: that dirties the branch and changes the fingerprint, and the person's "merge" would then fail step 2 and send the run back through verify and review.

## 3. Merge locally (option 1, after a yes)

Find where `<target>` is checked out with `git worktree list`.

- Checked out in a checkout with a clean tree: run `git -C <that checkout> merge --ff-only sf/<run-id>`.
- Checked out in a checkout with uncommitted changes: stop and ask the person. Never stash, reset or overwrite their work.
- Not checked out anywhere: `git fetch . sf/<run-id>:<target>`, which refuses anything but a fast-forward.

Then `git rev-parse <target>` must equal the recorded head SHA.

A fast-forward lands exactly the commits that were verified and reviewed, so the evidence still applies. It creates no commit, so there is no merge message to write. If the fast-forward is refused, the target moved after the check: go back to section 1 step 4. Never use `--no-ff`, `--squash` or a manual conflict resolution here; each makes a tree nobody checked.

Record the merge in the ship record: target, its old and new SHA. The head SHA serves as the merge commit in steps 7 and 8. Don't push the target branch: with no remote there's nowhere to push, and with one, pushing the default branch is the team's process, not this skill's.

Then continue with step 7 (deploy) of SKILL.md, under its own gate.

## 4. Clean up (only with a yes)

After a successful merge (a local one here, or a confirmed forge merge from step 6 of SKILL.md), offer, recommending yes:

- delete the branch with `git branch -d sf/<run-id>` (the safe form refuses an unmerged branch);
- if `state.md` records a worktree that sf-build created, remove it with `git worktree remove <path>`. Capture the path first, and run the command from the original checkout (`git -C <original checkout> worktree remove <path>`), never from inside the worktree being removed.

After a forge merge, the remote branch is the forge's or the project's setting to delete; delete only the local `sf/<run-id>`, and only once the merge commit is confirmed on trunk (a squash merge makes `git branch -d` refuse; then use `-D` only with the person's yes, naming the merge commit).

If `git worktree remove` refuses because the worktree has modified or untracked files, those files exist nowhere else. Never add `--force` on your own. Show the list (`git -C <path> status --porcelain -uall`) and ask whether to commit them, move them, or delete them.

Unattended: leave the branch and worktree in place and note them in `Next`.

## 5. Discard (only on an explicit request)

Only when a person asks to throw the work away. Show what will be lost:

- branch `sf/<run-id>` and its commits (`git log --oneline <target>..sf/<run-id>`)
- the worktree path, if any, and any uncommitted files in it

Ask them to type the branch name to confirm. Anything else, including "yes", is not a confirmation. Then remove the worktree (same rule on `--force` as above) and run `git branch -D sf/<run-id>`. Set the run's status to `stopped` with the reason. Unattended runs never discard.

## 6. Record

In the ship record's `Local finish` section: the option chosen, by whom, the target and its SHAs, and any cleanup done. Update `state.md`: the ship stage line and `Next`.
