# Building the red command

The red command is what every later step leans on. With a tight one, bisecting, testing hypotheses and confirming the fix are mechanical. Without one, reading code just produces stories. Spend most of the stage's effort here.

## Ways to build one

Try them roughly in this order. Use the repo's own tools and commands (`commands.test` in config, or what the build files show); never assume `npm test`.

1. **A failing test** at the seam that reaches the bug: unit, integration or end-to-end, whichever actually runs the buggy path.
2. **An HTTP call** (`curl` or a short script) against a locally running server, checking the response body or status.
3. **A CLI run** on a fixture input, with its output compared to a known-good copy.
4. **A headless browser script** (Playwright or similar) that operates the page and asserts on what it renders, logs or requests.
5. **A replayed capture**: something recorded from the real failure (an HTTP request, a message body, an event stream) replayed against just the code that handles it, with nothing else running.
6. **A throwaway harness**: the smallest slice of the system (one service, fakes for the rest) that reaches the bug with one call.
7. **Generated inputs** when the output is only wrong for some values: throw many random cases at the code and assert the rule that a bad case violates.
8. **A bisect harness** when the bug appeared between two known states: build, check, repeat, driven by `git bisect run`.
9. **A differential run**: the same input through the old and new version, or two configs, with the outputs compared.

## Tightening it

Once you have a loop, improve it before using it:

- **Faster**: skip unrelated setup, cache what can be cached, narrow to one test.
- **Sharper**: check the exact symptom (the error text, the wrong value), not just a non-zero exit.
- **More deterministic**: pin the clock, seed random generators, isolate the filesystem, stub the network.

A 30-second flaky loop is little better than none. A two-second deterministic one finds the bug.

## When the symptom only shows in the UI

If the report's symptom is something a person sees on screen (a wrong label, a missing row, a dialog that never closes), the red command drives the reported path the way a user does: a headless browser script (option 4) through the same clicks and inputs, checking the state that tells correct from broken. A lower seam (a unit or API test) is fine as well, but not instead, unless you show it reaches the same end state; say why under `Red evidence` in the `## Debug` section. A screenshot, a state dump or reading the source is never a reproduction on its own.

## Intermittent bugs

Aim for a higher failure rate, not a perfect reproduction. Loop the trigger many times, run copies in parallel, add load, narrow timing windows with deliberate delays. A bug that fails half the time can be debugged; one that fails 1% of the time can't, so keep raising the rate. Record the rate you reached (`<k> of <n> runs red`) as part of the evidence.

## The command itself

- One line, runnable from the repo root, with no prompts. Credentials come from environment variables, never literals.
- Arrange preconditions any way you like, but the symptom must come from the code path under test. Never write the broken state directly (a setter, a database update, a forced flag) and then observe it: that proves the check, not the bug. State inspection may confirm a symptom; it must not create one.
- It exits non-zero while the bug is present and zero once it's fixed. If the natural check inverts this (a scanner that exits 0 on findings), wrap it so it doesn't.
- Supporting files live in `runs/<run-id>/evidence/repro/`. That folder is gitignored, so the command keeps working for `sf-build` and `sf-verify` on this machine; the lasting check is the regression test `sf-build` writes.
- If the best seam is a test inside the repo's test folders, keep the test in `evidence/repro/` and make the red command a script there that copies it into place under a name unique to the run, runs it, and removes it again (with `trap`, so it's removed on failure too). The tree stays clean.
- Keep two commands: the **original repro** (the full scenario as first reproduced) and the minimised **red command**. Both go in the `## Debug` section. The minimised one is quicker for bisecting and probes; the original one proves the reported scenario is fixed, since a cut can drop a second trigger. `sf-build` and `sf-verify` run both after the fix.

## When the red command is the test suite

The run's base may already fail for reasons that have nothing to do with this bug (the shared baseline rule). Before trusting a red run of `commands.test`, or of the suite narrowed to a folder or pattern:

1. Find the baseline: `evidence/baseline.log` if the conductor wrote one for this base, else `baseline:` in config (`pass`, or `fail: <signature>` with its commit). If neither covers this base, run the same command on the base commit once, in a temporary worktree (`git worktree add --detach .software-factory/runs/<run-id>/base-tree <sha>`, removed at exit), and save `evidence/debug-baseline.log` with the header below.
2. Compare signatures: the failing test names and error lines in the red output against those in the baseline. A failure whose signature is in the baseline is `pre-existing`. It is not this bug's reproduction, whatever the exit code says.
3. The red command must fail on a signature the baseline doesn't have and that shows the reported symptom. Then narrow it to the tests or files that carry that failure, so it exits zero once the bug is fixed. A command that stays red because of a pre-existing failure can never confirm a fix.
4. Exception: when the report is about the baseline failure itself (failing CI on the default branch, for example), that failure is the reproduction. Say so in the `## Debug` section.

Record which baseline you compared with, and any pre-existing failures you set aside, under `Red evidence`.

## Confirming the red evidence

The debugger shouldn't be the only judge of its own reproduction. Before hypotheses, give a fresh read-only subagent:

- the symptom as the report states it (quoted, redacted)
- `evidence/debug-red.log` and `evidence/debug-red-min.log`
- for a UI symptom, the screenshot or the script's final-state output

Ask only: "Does this output visibly show the reported symptom, and not a different failure nearby? Answer yes, no or unsure, quoting the lines." It doesn't see your theories. `no` or `unsure` means the command isn't red yet: sharpen the check or capture better evidence. Record the answer as `Red confirmed by: <reviewer> | yes | <quoted line>` in the `## Debug` section. With no subagents, do it yourself as a separate pass that reads only the files above, and write `self` as the reviewer.

## When it won't go red

Pick the outcome that fits, write it under `## Debug` with what you tried, and stop:

- **`already fixed`**: the report's steps pass on the current default branch. Save that run as `evidence/debug-already-fixed.log`, note the version the reporter ran if it differs, and set `Next` to the conductor with this verdict. No ticket is built. If a known PR or commit is the fix, say so: the conductor checks it with `sf-verify`'s existing-fix mode.
- **`could-not-reproduce`**: you tried within the budget and the symptom never showed. List each attempt (environment, steps, result). Set `waiting for human`; the conductor can return it to the reporter through triage's `needs-info`.
- **`blocked: <what's missing>`**: the environment can't provide something the reproduction needs (an account state, a device, a service, a browser tool). Name it. Set `waiting for human` and ask for one of: access to an environment where it reproduces, a redacted captured artifact (log dump, HAR file, core dump, recording with timestamps), or permission to add temporary instrumentation where it happens. Recommend the one most likely to work.

## Recording a run

Every saved run starts with a header that binds the output to the code it ran on:

```bash
bash .software-factory/bin/record.sh debug-red .software-factory/runs/<run-id>/evidence/debug-red.log -- <command words>
```

`record.sh` runs the command from its arguments (no `bash -c` on a string, which some agent hosts refuse), keeps the full output and its exit code in the log (stdout stays quiet: one `recorded` line, plus the last 5 output lines on a failure; read the log for more, or pass `--tee` first to echo everything), and appends a record with the command hash, exit code and content fingerprint to `records.jsonl` beside the log. When the command needs the shell (`&&`, `|`, redirects), pass it as `bash -c '<the literal command>'`, never through a variable.

Redact the file before showing any of it, then cite just the few lines that show the failure.
