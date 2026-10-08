# Running holdouts

The contract `sf-verify` follows to run a scenario set written by `sf-holdout`. The goal is a pass or fail per capability, with the failing IDs, for one exact commit, with nothing about the scenarios reaching the builder.

Inputs: the run ID, the set ID (`SPEC-<slug>` or `BUG-<run-slug>`), the commit under test (full SHA; `<sha7>` below is its first 7 characters), `holdouts.dir` from config, and the scope: `full`, or `targeted` with a list of capability IDs and scenario IDs. `sf-verify` chooses the scope ([holdout-runner-prompt.md](../../sf-verify/references/holdout-runner-prompt.md#full-or-targeted)).

## 1. Who runs them

A fresh holdout runner: a subagent that hasn't built or planned anything in this run. It may read the holdout folder and the repo, and may write only to the temp copy and to `<dir>/<set-id>/results/`. It never edits the project repo or the builder's worktree. Its logs and scratch files go in the temp copy or the OS temp folder, never beside the holdout set or the repo, and are removed before it replies.

The session that calls it (the conductor and `sf-verify`) gets back only the summary in §5. It doesn't open the scenario files, the results file or the runner's logs.

## 2. Run exec scenarios in a temp copy

1. Read `<dir>/<set-id>/index.md`. Take rows with status `active`. In a targeted run, keep only the scenarios of the listed capabilities, the listed scenario IDs, and active scenarios not yet in the last results file (new since then).
2. Make a clean copy of the commit outside the repo and every worktree, for example `git worktree add --detach "$TMP/sf-holdout-<run-id>-<sha7>" <sha>`. Never use the builder's worktree.
3. In the copy, run the install command from `RUNNER.md` (default `commands.install`).
4. Copy each `exec` file to the target folder `RUNNER.md` names.
5. Run each scenario with the `RUNNER.md` command, one `{file}` at a time, with its timeout. Save the full output to the results file (§5), not to the run folder.
6. A scenario passes only if the command exits 0 and the output shows at least one test ran. Exit non-zero, a compile or import error, a skip, zero tests collected, or a timeout is a fail.
7. Remove the copy: `git worktree remove --force <path>`, then delete the folder if anything is left.

## 3. Judge rubric scenarios

Start the app from the temp copy (`commands.run`, or the start command in `RUNNER.md`). Give each `rubric` file to a judge that follows [judge.md](judge.md). Use `tools.second_opinion` for the judge when it is configured (see [second-opinion.md](second-opinion.md)); otherwise a fresh subagent. If the runner can't start a subagent either, it judges each rubric itself and adds `judge: runner` to the summary, so the lower independence is visible. The judge gets the rubric file, the copy's path and how to reach the running app. It doesn't get the builder's plan, summary, commit messages or PR text.

Judges may run in parallel; they don't change files. Stop the app and remove the copy afterwards.

## 4. Leak check

Before reporting, the runner checks that scenario content hasn't reached the code:

- Search the diff `git diff <default_branch>...<sha>` for every active scenario's canary token. A hit means a scenario file was copied into the repo.
- Search the same diff for the distinctive literal values used in each scenario's Given and Then (skip common values such as `0`, `1`, `true`, empty strings). A hit in non-test code suggests special-casing.

The leak check always covers every active scenario, in a targeted run too. Report a hit as `leak suspected: <ID>` with no detail. `sf-verify` then fails, and `sf-holdout` retires that scenario and writes a replacement with new values and a new ID.

## 5. Record and report

Write the full detail to `<dir>/<set-id>/results/<run-id>-<sha7>.md`: per ID, the command, exit code, output, judge verdicts with evidence, the judge's notes on weak expectations, and leak-check hits. This file stays in the holdout folder. People may read it; agents that build or plan don't.

Return to the caller only this, and nothing else:

```
holdouts <set-id> @ <sha7>: <pass | fail> (<passed> of <total> passed)
mode: <full | targeted (<run> of <active> active scenarios run)>
<set-id>/CAP-1: pass (3 of 3)
<set-id>/CAP-3: partial (1 of 3 failed)
<set-id>/CAP-4: fail (2 of 2 failed)
<set-id>/CAP-3/S2: fail      # one line per failing scenario ID only; passing IDs are not listed
judge: runner               # only if the runner judged rubric scenarios itself
leak suspected: <ID>        # only if any
```

Counts, capability lines and failing-ID lines cover only the scenarios that ran. Per-ID `pass` lines are over-sharing: the caller drops them. A capability line says `pass` when all its scenarios pass, `fail` when all fail, and `partial` otherwise.

The overall result is `pass` only when every scenario that ran passes and no leak is suspected. `sf-verify` copies this summary into `runs/<run-id>/evidence/holdouts-<sha7>.md`.

Never put any of these in the summary, the run folder, the conversation, a builder's prompt, a ticket, a plan, a PR, a commit or a tracker comment: scenario text, input or expected values, test names beyond the ID, assertion messages, stack traces or test output.

When the builder gets a failure, it gets the capability lines and the instruction to re-read that capability's intent and success statement in the spec. The fix comes from the spec, not from the scenario.

## 6. Separate owner

When the holdouts live in a private repo the build machine doesn't have, a different person or a CI job runs §2 to §5 on their side and posts back only the §5 summary for the given SHA (for example as a commit status or a file the user drops into `runs/<run-id>/evidence/`). `sf-verify` treats that summary like its own runner's, after checking the SHA matches the commit under test.
