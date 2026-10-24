# Tests and evals

Stage 4 of [the Open a PR branch](../open-pr.md), run on the merged code. The **Failure ownership** section is also used by the Finish-without-a-PR menu in [SKILL.md](../SKILL.md).

## Find the test command

The project's own record wins: the `## Testing` section of `CLAUDE.md` or `AGENTS.md` (written by `/sf-setup`), then a `TESTING.md`. A documented command is used as written: no detection, no bootstrap.

Otherwise gather **markers**. A marker is evidence for the question you ask, never a command to run on a guess: probing a runner the project never had fails loudly and teaches nothing.

| Marker | Ecosystem | Command to offer |
|---|---|---|
| `manage.py` | Django | `python manage.py test` (`pytest` when pytest-django is a dependency) |
| `pytest.ini`, `tox.ini`, pytest in `pyproject.toml`, `test_*.py` | Python | `pytest` |
| `go.mod` (with `*_test.go`) | Go | `go test ./...` |
| `Cargo.toml` (tests may sit in `src/` as `#[test]`) | Rust | `cargo test` |
| `pubspec.yaml` | Dart / Flutter | `flutter test` or `dart test`, `fvm` prefix with `.fvmrc` |
| `pom.xml` / `build.gradle(.kts)` | JVM | `mvn test` / `./gradlew test` |
| `Gemfile`, `Rakefile`, `.rspec` | Ruby | `bundle exec rspec`, `bin/rails test` or `rake test` |
| `mix.exs` | Elixir | `mix test` |
| `composer.json` | PHP | `composer test` or `./vendor/bin/phpunit` |
| `package.json` with a `test` script | Node | that script, through the package manager the lockfile names |
| `Makefile` with a `test:` target | any | `make test` |

**Existing tests** are any of: a test config file, a declared test script or make target, test files in git (`tests/`, `spec/`, `__tests__/`, `test_*.py`, `*_test.go`, `*.test.ts`, `*_spec.rb`, `*Test.java`), or Rust `#[test]` blocks. A missing config or `tests/` folder is not evidence of no tests: Django keeps them in `<app>/tests.py`, Go beside the source, Rust inside `src/`.

With existing tests, ask the user to confirm the command (the table's candidates plus "Other"), then record it in `## Testing` in the format `/sf-setup` uses so it is never asked again. Where the ecosystem ships a runner, that runner is the candidate: never install a second framework beside a working one. Read two or three existing test files for naming, imports, assertion style and setup; the coverage stage writes tests in that style.

## Bootstrap a framework (no tests at all)

Run this only when an ecosystem matched and there is no existing-test evidence, or when the user picked **Add tests** at the gate below. `## Testing` reading `Framework: none (declined)` means the user declined before: skip bootstrap unless they picked Add tests in this run.

1. **Choose.** Look up current practice for the runtime with web search when the host has it; otherwise use: Node vitest + @testing-library (Next.js adds Playwright), Python pytest + pytest-cov, Django pytest-django, Ruby minitest or rspec, Go stdlib testing, JVM JUnit 5, Rust built-in `cargo test`, Dart test / flutter_test, PHP phpunit, Elixir ExUnit. Ask: A) the primary pick with its packages and why, B) the alternative, C) skip for now. C records `Framework: none (declined)` in `## Testing`. A monorepo asks which runtime first.
2. **Install and configure** the packages, a minimal config, the test folder, and one example test. Note every file you touch first: a failed install is debugged once, then only this bootstrap's own changes are undone, never the user's edits.
3. **First real tests.** Write three to five tests for recently changed, risky code (`git log --since=30.days --name-only --format="" | sort | uniq -c | sort -rn | head -10`; error handlers before business logic before endpoints before pure functions), each asserting what the code does. A test that fails is fixed once if the test is wrong; a failure in the code under test is a finding for the user, never a silent deletion. No secrets in test files.
4. **Verify** with the full suite. Still failing after one debugging pass: undo this bootstrap's changes and continue without tests, telling the user why.
5. **CI.** With GitHub Actions (or no CI at all), add `.github/workflows/test.yml` running the verified command on push and pull request. Another CI provider: tell the user to add the test step to it.
6. **Record** the framework, the command and the test layout in `## Testing`, keeping every other line there, and commit the bootstrap's own files by name: `chore(test): bootstrap <framework>`. If unrelated changes are already staged, ask before committing.

## Run the suites

Run every applicable suite with its exact command, independent suites in parallel, each teeing to its own log under `.context/evidence/`, with `set -o pipefail` so a failing runner is not masked by `tee`. Record each **lane** in the invocation record: label, command, exit code, log path, timestamp, and the tree snapshot it ran on. Stage 9 reuses these receipts instead of rerunning when nothing changed.

**A lane passes on its runner's summary line, not on exit 0 alone.** Read `tests_ran` from the runner's own summary and keep the three states apart:

1. `tests_ran: N` with N > 0 and exit 0: the lane passed. Record N for the PR body.
2. `tests_ran: 0`, a **ZERO-RUN**: "No tests found", "no tests ran", "0 examples", `0 pass 0 fail`, only `[no test files]`, or an empty selection after a filter. Exit 0 here is not a pass: triage it as a failed lane. A bad selector, a missing file or a skipped `describe` is an in-branch failure until shown otherwise.
3. `tests_ran: unknown`: the summary was not recognized. Keep the exit-0 pass and write `count unavailable` for that lane in the PR body; it is never a ZERO-RUN and never a counted pass.

**No applicable suite at all:** name the untested scope and ask: A) add tests (recommended), which runs the bootstrap and returns here; B) ship with this named testing gap; C) stop. B continues with the gap recorded, never as passing tests, and reuses only an earlier B for the same scope and content; a declined bootstrap alone is not that approval. A declared suite that cannot run is a blocker, not an absent suite.

## Failure ownership

A failing test does not stop the run until its owner is known. A failed lane first gets the flake measurement in **Measure, then fix** below.

**Classify each failure** against `git diff origin/<base>...HEAD --name-only`:

- **In-branch:** the failing test file changed on this branch, or the output points at code this branch changed, or you can trace the failure to the diff.
- **Pre-existing:** neither the test nor the code it covers changed here, and no branch change explains it.
- **Ambiguous is in-branch.** Stopping the developer is cheaper than shipping a broken test. This is judgment from the diff and the output; there is no dependency graph to consult.

**In-branch failures stop the run.** Show them; the developer fixes their own failures before shipping.

**Pre-existing failures** get one question listing each failure with `file:line` and the error. The repository mode decides the recommendation: **solo** when the top author holds 80% or more of `git shortlog -sn --since=90.days HEAD`, otherwise **collaborative**.

- Solo, recommend A (the context is fresh and nobody else will fix it): A) investigate and fix now, B) add a P0 TODO and fix after this lands, C) skip, I know about it.
- Collaborative, recommend B (the person who broke it fixes it): A) fix now anyway, B) open a ticket for the likely author, C) add a P0 TODO, D) skip.

Carry out the choice:

- **Fix now:** root cause first (`sf-debug`), the smallest fix, committed separately: `fix(test): pre-existing failure in <test-file>`.
- **P0 TODO:** add it in the format of [todos-format.md](../../../references/todos-format.md), with the error output and the branch it was seen on, creating `TODOS.md` if needed.
- **Ticket:** find the likely author from both the test and the code it covers (`git log --format="%an (%ae)" -1 -- <file>`), preferring the production-code author. Create the ticket with the **Create** operation in `docs/agents/issue-tracker.md`, assigned to them when that is a valid login there. Title `Pre-existing test failure: <test name>`; the body names the branch, the first ten lines of the error in a fence, the last author and the date. Title and body go into files written with your file-write tool, never into a quoted shell argument. A failed create or assignee: create it unassigned and name the person in the body, or give the user the text to file by hand.
- **Skip:** note "Pre-existing test failure skipped: `<test>`" for the PR body.

The step is done when no in-branch failure remains and every pre-existing one has its recorded disposition. Report each lane's count (or `count unavailable`) in one line.

## Evals (prompt-related changes)

Evals are mandatory when `SCOPE_PROMPTS=true` or the diff touches prompts, skill templates, judges or eval harness code. Select from the full diff, uncommitted changes included.

1. **Select** with the project's own contract: the eval commands, selector and dependency map in `CLAUDE.md`, `AGENTS.md` or package scripts. Follow shared judges, fixtures and helpers to every suite they feed, and use the project's full pre-merge tier, never a cheaper development tier. Uncertain selection includes every plausibly affected suite. Prompt changes with no known selector or command: report the validation gap and ask before shipping. A selector that reports no affected suites is recorded as that result.
2. **Run** with the project's command, keeping its exit status, concurrency and retry policy; stop on the first failing paid suite before starting another. A suite that runs 30 minutes or more is launched detached (`nohup sh -c '<command>; echo "### EXIT=$? ###"' > .context/evidence/evals.log 2>&1 &`) with an outer timeout covering its declared duration, then polled for the exit marker: silence is not success. Skipped or unstarted cases never count as coverage.
3. **Record** each suite's counts and available costs for the PR body. A red case goes to **Measure, then fix**; all green continues to stage 5.

## Measure, then fix

For a red eval case, or a failed test lane that might be flaky. Every rerun here is **diagnostic**: it never changes the verdict of the run that failed, its output is labeled diagnostic under `.context/ship-measure/`, and the lane's verdict comes only from one full gate run at the end. A budget is never raised, a threshold never lowered, a verdict retry never added, and a case never skipped to get a pass.

**Flaky test lane.** Before calling a failure pre-existing, rerun that lane's exact file list ten times (the first alone as baseline, the rest in parallel, each with its own home and state folders, retries off, a ten-minute cap). A runner that cannot take a file list reruns the whole command ten times. Report the pass rate, how many completed, and one failure capture, then classify ownership.

**Red eval case:**

1. **Classify** from the red line's cause and expected/received detail: a product change on this branch, a detector or actor defect, a fixture defect, a provider event, or a model miss. A detector fix gets a free replay test before any paid trial. Infrastructure (a provider outage, a lost runner) may skip measurement as `unmeasured` with its reason in the PR body; it never counts as a pass.
2. **Show the plan:** trials, pass bar and budget, with a cost estimate from pass-rate history or "estimate unknown". A run past the budget needs the user's approval first.
3. **Measure** the case alone on the current head with the project's single-case command, in parallel, saving each trial's capture under `.context/ship-measure/<case>/<round>/`. No documented single-case command: ask once and record the answer.
4. **Decide** by pass count: 9/10 meets the bar; 8/10 meets it when every red trial qualifies (`provider` on that trial's own provider error, `judge-noise`, or `model-miss` with the cited line); 7/10 extends once with one more batch on the unchanged tree, never a third; lower is a fix round. Behavior cases run in twelves: 11/12, 10/12 and 9/12 hold the same three places. A red trial classed `timeout`, `hang`, `regression` or `fixable` always means a fix round.
5. **Fix at the cause** from the captures, then measure again as a new round. Call a case fixed only with a named causal change and every failure in the closing measurement explained; report "observed k/n after fix at `<cause>`", never a proven rate.
6. **Stop** at the round limit, the budget, or two void batches: no push, and report every trial.

**Gate once.** When every red case meets its bar, run the full gate once. When CI runs that gate on push, the push is the gate run: read it and start no second paid run. The measurement table, estimated and actual spend per case, goes in the PR body.
