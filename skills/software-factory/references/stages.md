# Stage exit evidence and run rules

## Exit evidence

A stage is done when this exists. Check it yourself.

| Stage | Exit evidence |
|---|---|
| wayfind | `state.md`'s `## Wayfind` section ends with `sf-wayfind status=destination-reached` or `status=no-map`. `charted`, `resolved` and `waiting` are planned stops, not failures: keep the stage open and resume from `Next` |
| triage | `## Triage` ends with `sf-triage verdict=<v> type=<work type> item=<ref>`, where `<v>` is ready, ready-for-human, needs-info, duplicate or out-of-scope. A `duplicate` marker may add `fix=<PR, MR or commit>` |
| spec | `.software-factory/specs/SPEC-<slug>.md` exists, open questions are answered or defaulted, and the last line of the latest `evidence/spec-check-<n>.md` shows `critical=0` |
| holdout | The holdout set's `index.md` lists active scenarios with IDs `SPEC-<slug>/CAP-n/Sm` (or `BUG-<run-slug>/CAP-1/Sm` on the bug path). Read only the index, never the scenarios |
| plan | `tickets.md` has tickets with `after` dependencies and `PR-<n>` batches, and the last line of `plan-review.md` shows `open-critical=0 open-user-challenges=0` |
| debug | `## Debug` names the red command and root cause, and `evidence/debug-red*.log` shows it failing. Or it records `already fixed`, `could-not-reproduce` or `blocked: <capability>`: see the bug path outcomes in [paths.md](paths.md) |
| build | Every ticket in the batch is `done` or `parked` in `tickets.md`, and `evidence/build-final.log` shows the tests passing on the final commit |
| verify | `evidence/report.md` has `Overall: pass` and a `Fingerprint:` equal to `bash .software-factory/bin/wtree.sh` now |
| verify, existing-fix mode | `state.md` has an `Existing fix: <confirmed | insufficient fix | inconclusive> @ <sha7>` line, matching the first line of `evidence/existing-fix/report.md` |
| verify, maintain mode | `state.md` has a `Maintain @ <sha7>: <clean | changed | blocked>` line, matching the first line of `evidence/maintain/report.md` |
| review | `review/findings.md` has `Verdict: pass`, `Open must-fix: 0`, and a `Fingerprint:` equal to `wtree.sh` now |
| ship | The PR/MR is merged on the verified commit (or waiting for a human, per policy), and the post-deploy check passed if a deploy ran |
| learn | `lessons.md` and `decisions.md` updated on `sf/<run-id>-learn`, or a note that nothing new was learned |

## Stops

Stop and report, with the run left resumable, when:

- a stage's exit evidence can't be produced after two attempts
- the policy for the next action is `manual` and no person has approved it
- triage says the work isn't ready, is a duplicate (unless it names a fix to check), is out of scope, or is `ready-for-human`
- something only a person can decide is open and the run is unattended
- a request needs something the config marks `pending` and no stage has an `n/a` path for it. A pending scanner (`pending:` lists gitleaks, `tools.scanners: []`) never stops a run: verify's gate 4a is `n/a` and the report recommends `sf-setup`. A pending browser MCP doesn't either: the headless fallback covers it ([start.md](start.md#browser-check))

## Triage verdicts

- `ready`: add the stages for the reported work type and continue.
- `ready-for-human`: the work needs a person (a judgment call, access agents don't have, manual testing), or an external PR/MR is ready for a person to merge. Report it and stop; the run ends `done`.
- `duplicate` with `fix=` on a bug: don't stop. Call `sf-verify <run-id> existing-fix <ref>` and continue by its outcome ([paths.md](paths.md)). An `insufficient fix` outcome goes back through `sf-triage`, which can now give `ready` with the artifact linked.
- `duplicate` without `fix=`, `out-of-scope`, `needs-info`: stop and report.

## Run rules

**Commit the spec.** After spec passes, in the run's `Checkout:` on `sf/<run-id>`, commit the spec, any `GLOSSARY.md`, `docs/adr/` and `constitution.md` changes, and `.software-factory/decisions.md` in one commit, in the repo's commit style (Conventional Commits fallback: `docs(spec): <slug>`). Later stages log decisions in `runs/<run-id>/decisions.md`, which isn't committed, so the branch stays clean.

**Lane.** After spec, write a provisional `Lane: light` in `state.md` when the work type isn't security and the spec looks small (at most about three capabilities); otherwise `Lane: full`. After plan, the plan's estimate decides: keep `light` only if the `Estimate: prod=<n> test=<n> batches=<n>` line in `tickets.md` shows `prod` at most 150 and one batch; otherwise switch to `full`. A lane never goes from `full` back to `light`. Stage skills read the lane: light means fewer checks and reviewers, never fewer gates.

**Holdout and plan in parallel.** Plan never reads holdouts, so after spec they may run at the same time. Both must pass before build. Start the holdout writer in the background, run plan, then wait for the writer before build:

- Wait for the background agent's completion notice if the host gives one; otherwise poll its output (the set's `index.md`, or the agent's output file) every minute or so, up to 30 minutes, then treat it as failed (one retry, then stop).
- Hosts that block a foreground `sleep`: don't build timers out of `sleep`. Rely on the completion notice, and meanwhile do other useful work (the plan, reading evidence). If you must poll, check the output file with one quick read per tool call (`test -s <file>`, `tail -n 5 <file>`), or use the host's own wait or monitor tool with a bounded until-loop (`until test -s <file>; do sleep 30; done`, with a 30-minute cap) run in the background. Stop any background loop or timer you started as soon as the result is in, so nothing is left running.
- Never end your turn, hand back or report while a stage you started is still running: on many hosts the session ends with the turn, and the background work is lost.
- If a stop is unavoidable (the host ends the session, a person asks to stop), write `running: <stage> (<agent ID or output path>, started <UTC time>)` in `state.md`'s `Next`. A resume first collects that result, or restarts the stage if nothing was written.

The same applies to any subagent a stage starts in the background.

**Batches.** When `tickets.md` has more than one `PR-<n>` batch, run build → verify → review → ship once per batch, in order. Each batch is its own PR/MR.

**Loops back to build.** Go back to `build` with the findings when verify or review fails, when ship adds a docs ticket, or when ship accepts human review comments on the PR/MR. Then run verify and review again. Count these loops in `state.md`; after `limits.max_fix_rounds` (default 5), park the open findings in `ledger.md` and hand the run to the user. When plan review approves a user challenge to the spec, go back to `spec`.

**Decision-log script.** Every stage appends decision lines with `bash .software-factory/bin/decisions-append.sh` (that path, from the checkout root), never by editing the file. If the script is missing, append the line in the same format with `printf '%s\n' '<line>' >> <log>` and add `decisions-append.sh missing; line appended with >>` under Notes in `state.md`. A missing script after the setup check means the check failed: say so in the report.

## Finish report

Report in a few lines:

- what changed, with the PR/MR link
- what verified it (the evidence lines from `sf-verify`)
- defaults taken (`decisions.md`), parked findings with rulings and deferred minors (`ledger.md`), one line each
- test changes accepted by rule (verify's `accepted-by-rule:` lines), and how the UI was driven when it wasn't the browser MCP (`Browser:` in `state.md`)
- a setup upgrade and its stage re-checks (`re-checked` Notes line), when there was one
- bug drafts `sf-verify` found that predate this change, for triage
- what's left for a person
