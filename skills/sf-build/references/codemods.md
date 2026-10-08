# Codemods first

For a migration, an API rename, a dependency upgrade that changes call sites, or any change repeated across many files, a deterministic tool makes the change and agents handle what it can't. Tools are repeatable and reviewable; an agent editing 200 files by hand is neither.

## Pick the tool

Use what the spec's recipe names. Otherwise, in this order:

1. **The language's or framework's own migration tool**: `go fix`, `cargo fix` / `cargo clippy --fix`, `dotnet format`, Python's `pyupgrade`, a framework's upgrade command, an ESLint rule with `--fix`.
2. **A structural search-and-replace tool**: ast-grep (`sg`, many languages), OpenRewrite recipes (Java, Kotlin, Gradle, Maven, YAML), Comby, jscodeshift, Rector (PHP).
3. **A plain text replace** (`sed`, `perl -pi`) only when the pattern is unambiguous text, such as a renamed config key.

Check the tool is installed (`<tool> --version`). If it isn't, ask to install it at a pinned version (recommended: yes). Unattended, don't install anything: make the change by hand for this ticket only, add `run: <tool> not installed; <id> edited by hand` to the ledger, and log it in `runs/<run-id>/decisions.md`. Anything run through `npx` or similar is pinned to a version.

## Run it

1. Write the rule or recipe to `runs/<run-id>/evidence/<id>-codemod.<ext>`, or name the published recipe and version.
2. Dry-run it first where the tool allows, and save the list of files it would change. Check the list is what the ticket's plan expects. A rule that matches far more or fewer files than expected is wrong; fix the rule, not the output.
3. Run it on the ticket's files only (the shard in the plan). Save the command and output with the header from [guards.md](guards.md#recording-a-run) to `evidence/<id>-codemod.log`.
4. Commit the tool's output alone, in the repo's commit style (Conventional Commits: `refactor(<scope>): apply <tool> <rule or recipe>`), with `Ticket: <id>` in the footer. A reviewer can re-run the tool and compare.
5. Run `commands.test`. What the tool couldn't handle, and anything now failing, is the residue.

## The residue

Dispatch the implementer for the residue only, with the list of files and failures. Its commit is the second one for the ticket. The usual rules hold: smallest change, full suite, and test changes ledgered.

## Refactors over thin tests

A refactor that must not change behaviour gets no separate test author when the existing suite covers the code it changes: the suite is the check. Run it before the codemod and after the residue and save both runs.

Check that first. For each file the refactor changes, find a test that exercises it (grep the test folders for its module and its public names, or run the suite with coverage if the repo has it set up). Where none exists:

1. Before any change, dispatch the test author with a brief that asks for **characterisation tests**: tests that pin what the code does today through its public interface, whatever that is, with expected values read from running the current code on hand-picked inputs. Odd current behaviour is pinned too and noted in the report, not corrected.
2. Run them on `BASE`: they must pass. Save `evidence/<id>-characterise.log` and record their hashes in `<id>-tests.sha` as for any separately written tests.
3. Do the refactor. The same tests must still pass, unchanged.
4. Ledger `<id>: tests | <n> characterisation files by separate author | evidence/<id>-characterise.log`.

Where a seam for such a test doesn't exist without changing the code, say so in the ledger (`<id>: Ruling: refactor over untested code | <why no seam> | Cost if wrong: <…>`) so `sf-review` and `sf-verify` know.

## Shards

A campaign plan splits the change into shards, one ticket each, small enough for one PR under `limits.max_pr_lines`. Keep the same rule and tool version across shards; if the rule changes partway, ledger a ruling and re-run it on the shards already done.
