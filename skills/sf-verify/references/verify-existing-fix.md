# Verify an existing fix

The conductor calls `sf-verify <run-id> existing-fix <PR, MR or commit>` when an open PR or MR, or a merged commit, plausibly already fixes a reported bug (`sf-triage` says "needs verifying, not rebuilding"). The existing artifact owns the fix. Your job is only to check it. Leave it unchanged, write no alternative patch of your own, and open no second PR.

None of gates 1 to 12 run, and no `evidence/report.md` is written. Everything goes under `runs/<run-id>/evidence/existing-fix/`.

## 1. Check there is something to verify

Proceed only if one of these exists:

- an open PR or MR whose code changes target the reported symptom
- a merged PR or MR
- a merged commit whose code and message match the symptom

A comment saying "fixed", a tracker status, a branch name or a guessed cause, without a PR or commit, is not enough: write the report as `inconclusive (no artifact)`.

Several candidates: take the one linked from the issue. If none is linked, pick the candidate that touches the affected code most directly, and give the reason in the report.

## 2. Protect the working tree

Work in temp copies outside the repo, never in the person's checkout: `git worktree add --detach "$TMP/sf-fix-base-<sha7>" <baseline rev>` and `git worktree add --detach "$TMP/sf-fix-head-<sha7>" <patched rev>`. Fetch an open PR's head first (`gh pr checkout` is not allowed here; use `git fetch origin pull/<n>/head` on GitHub or `git fetch origin merge-requests/<n>/head` on GitLab).

Record at the top of `evidence/existing-fix/report.md`: the baseline revision, the patched revision, the artifact URL, and the build and environment inputs both runs share (launch command, seed data, browser tool and viewport).

## 3. Measure the baseline

- Open PR or MR: its target branch at the merge base is the baseline.
- Merged fix: the commit just before the fix, when it builds and shows the old behaviour.

Find the reported path in `verify.md`'s feature map first. If the feature isn't mapped, add it per [verify-procedure.md](verify-procedure.md) into `evidence/existing-fix/verify.md` (don't commit it here), or report `inconclusive (path not mapped)`. Never invent routes or selectors. When `state.md` has a `## Debug` section, use its red command, the original un-minimised one when both are recorded.

On the baseline, through `verify.md`: launch, doctor, drive the reported path through the real user path (UI actions for a UI symptom), observe the symptom, reset, and drive it again. Capture screenshots or transcripts and the same state check both times.

A baseline needs the symptom reproduced on two separate drives; with fewer, you have none. Never claim the fix works.

## 4. Measure the patched build

Build and launch the patched revision with the same environment and data. Drive the same path twice. Both times the broken state must be gone and the expected state present, captured with the same state check. Compiling or a passing test suite is not the after result: it must come from the running patched app.

## 5. Outcome

| Outcome | When | Report and `state.md` |
|---|---|---|
| `confirmed` | two baseline drives both reproduce the symptom, and two drives of the patched build both show it gone | before and after evidence; `Next`: finish, with the artifact linked so the conductor can tell the person or close the issue through `sf-triage` |
| `insufficient fix` | the symptom shows on both builds | link the artifact and say it doesn't resolve the symptom; `Next`: debug on the bug path, with the artifact linked. Never open a competing PR |
| `inconclusive` | no baseline, the patched app won't run, or the evidence doesn't show the discriminating state | say which half couldn't be measured and why; `Next`: waiting for human. Never claim success |

First lines of the report, each on its own: `Existing fix: <confirmed | insufficient fix | inconclusive> @ <patched sha7>`, `Artifact: <URL>`, `Baseline: <sha7>`. Add the same `Existing fix:` line to `state.md`. This mode posts nothing on the tracker or the forge itself.

## 6. Cleanup

Stop both builds by process ID, remove both temp copies (`git worktree remove --force`), and leave the person's checkout exactly as it was. Check the evidence files still exist.
