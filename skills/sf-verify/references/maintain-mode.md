# Maintain mode

A feature map rots as the app changes, and a normal verify run only re-drives the features the current spec touches. The conductor calls `sf-verify <run-id> maintain` on request, after a QA sweep reports doc drift, or when `verify.md`'s "Proven" date is old. It drives every feature in `verify.md`, from every entry point, and fixes the recipe where it is wrong.

None of gates 1 to 12 run, and no `evidence/report.md` is written. Notes and evidence go under `runs/<run-id>/evidence/maintain/`.

## Edit scope

Only `.software-factory/verify.md` and `.software-factory/verify/` (its helper scripts). Never product code. When the map promises a behaviour the app has stopped showing, decide which case it is: doc drift, where you correct the map, or a product gap, which you report and never hide by rewriting the map.

## Pass

1. **Index hygiene.** Read the feature list. Fix missing, extra, duplicate or dead entries (a route or command that no longer exists in source).
2. **Source wave.** One fresh read-only subagent per feature, run in parallel; wait for all of them before the next wave, never ending your turn while one runs. Each explains from source how the feature works for a user, lists its entry points with `file:line`, flags likely drift with citations, and returns one live recipe. Subagents never drive the app and never edit. Reply shape: summary, entry points, drift or `none`, recipe.
3. **Reconcile.** Every feature has a reply. Where recipes overlap, combine them so the live pass needs the fewest distinct app states it reasonably can. Check a sample of the drift the subagents cited. Sweep recent churn for user-facing surfaces the map lacks (`git log --since=<Proven date> --name-only` on the default branch, filtered by the frontend, api and CLI scopes in [gates.md](gates.md#scope)); call one missing only with a concrete source path.
4. **Live pass.** Required even when the source looks clean. You drive; follow `verify.md`'s launch model (servers and UIs: start one instance, keep it up, and drive it one feature at a time; short-lived CLIs: a new session for each drive). Drive every feature from every entry point at least once. Hold these the whole pass:
   - Doctor before the first drive, on each fresh session, and after any failed drive. When Doctor passes but the UI is stuck, reset to a known state or relaunch; don't retry on a wedged instance.
   - Evidence captured so far survives every cleanup; check it at its path.
   - Nothing a drive started outlives it: clear up what a failed attempt left behind, whatever state the session is in (hung, ended, or used by others).
   - A Doctor failure caused by drift in `verify.md` is drift: fix it and try again once; only then may the pass be `blocked`.
   - Mark a feature `unreachable` only when you can name the concrete prerequisite (sign-in, data, OS, external service) and the route tried; a prerequisite the map doesn't name is drift.
   - Browser safety from [exploratory-qa.md](exploratory-qa.md#browser-safety) applies.
5. **Triage.** Wrong or missing description: doc drift, fix it. Working behaviour the recipe can't drive: harness gap, fix it (helpers in `.software-factory/verify/` with their exact invocation in `verify.md`). Broken app behaviour: product gap, one issue draft per gap from [../assets/issue-draft-template.md](../assets/issue-draft-template.md) in `evidence/maintain/issues/`, never a map change. Re-drive every fix live before keeping it.
6. **Ship or stop.**

| Outcome | When | What happens |
|---|---|---|
| `clean` | each feature was covered both from source and live, and none needed a change | no commit |
| `changed` | proven corrections | re-read every changed line, update the "Proven" line, and commit `verify.md` and `verify/` alone on `sf/<run-id>` (`chore(sf): update verification procedure`); the conductor takes it through review and ship as a small change |
| `blocked` | coverage couldn't finish, or a proven fix couldn't be kept safely | no commit; say exactly what blocked it |

Write `evidence/maintain/report.md`: first line `Maintain @ <sha7>: <clean | changed | blocked>`, then a coverage table (feature, entry points driven, result `ok`, `drift fixed`, `harness fixed`, `product gap`, `unreachable (<prerequisite>)`), and the issue drafts. Add the same first line to `state.md`, and set `Next` to triage each draft with `sf-triage`, then review on `changed`.
