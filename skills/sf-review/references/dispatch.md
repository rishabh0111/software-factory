# Running the reviewers

How `sf-review` step 3 dispatches the spec, standards and specialist reviewers and the lead, and what it does when one fails.

## What each one gets

Give each reviewer only what its brief lists. Every brief gets the package path, the holdout folder path only as a path never to read, both decision logs (`.software-factory/decisions.md`, then `runs/<run-id>/decisions.md`; later lines supersede earlier ones), and `[PRIOR_MUST_FIX]`: one line per must-fix finding from the previous round (ID, location, summary), or "none". Reviewers use it to look for the same class of problem elsewhere in the diff, not only at the old location.

| Reviewer | Also gets |
|---|---|
| Spec | The spec path and capabilities in scope; on a bug run, the root cause and file:line from `state.md`'s `## Debug`; each plan's `## Failure modes` section; and the claims files (plans, build summary lines in `ledger.md`, commit messages), to read last. See [spec-reviewer-prompt.md](spec-reviewer-prompt.md) |
| Standards | The standards sources: repo rules, `lessons.md`, `.software-factory/constitution.md`, the glossary, ADRs touching the changed areas, and lint configs. See [standards-reviewer-prompt.md](standards-reviewer-prompt.md) |
| Specialist | Its checklist in the shared prompt of [specialists.md](specialists.md); `lessons.md` and the constitution |
| Second opinion | The spec and standards briefs, as in [second-opinion.md](second-opinion.md), with failure modes and prior must-fix pasted into the brief file |
| Lead | Everything in [lead-prompt.md](lead-prompt.md)'s Inputs: all reviewer outputs, the incomplete list, prior-round must-fix, ledger rulings, builder-deferred ledger lines and the `For review` list, the plans' failure-mode lists, lint warnings, the verify report and evidence folder, the standards sources and both decision logs |

Reviewers cite line numbers in the file at the head commit, never line numbers in the package file. The lead corrects any that slip through.

## Model

The model tier is a preference, used when the host lets you pick a model per dispatch. Then name the model on every dispatch: the spec and standards reviewers and the lead run on the most capable model the host offers (this is the one review of the whole branch, and a cheaper default misses what matters most here), and specialists may run on the host's default. When the host has no per-dispatch choice, every reviewer runs on the session's model; that is not a deviation and needs no decision line. Record the models used, or `models: host default (no per-dispatch choice)`, in `findings.md`.

## Running and waiting

Each reviewer is a fresh subagent that didn't build or plan this run. Reviewers don't dispatch their own subagents and don't re-run the test suite; `sf-verify` already did. Read-only reviewers may run in parallel; red-team runs after the other specialists, and the lead after everyone. Never end your turn, report or hand back while one you started is still running: wait for its completion notice or poll its output; if a stop is unavoidable, name it in `state.md`'s `Next` (`running: <agent or output path>`).

Wait for parallel reviewers in bounded stretches of a few minutes, not by short polling and not by one open-ended wait. Between stretches, write one status line naming the reviewers still running. A subagent that ended without a reply counts as a failed attempt.

## Failures

If a reply is truncated, missing its findings block or verdict line, or never arrives, re-run that reviewer once with the same brief. Never fill in findings for it.

A reviewer or specialist that fails twice is `incomplete`. List it on the `Incomplete:` line of `findings.md` and pass the list to the lead.

- Spec, standards, or security (when triggered) incomplete: the review isn't valid. Write `Verdict: fail` with `Incomplete: <names>`, set `Next` to review again with the reason `incomplete review`, not to build, since there is nothing for the builder to fix.
- Any other specialist incomplete: the verdict stands on the rest, and the missing coverage is listed, never reported as clean.
- Second opinion: the fallback in [second-opinion.md](second-opinion.md).

## File writes

If the host refuses a file write under `runs/<run-id>/` (yours or a subagent's), use the shell (`cat > <path> <<'EOF'`); a subagent may instead return the content under `--- <path> ---` for you to write.
