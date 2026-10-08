# Test first

Read by the test author and the implementer. The point: a test you never saw fail may not test anything.

## Find the stack

Before the first test, find out how this repo tests, and use its commands for every run:

- Build and manifest files at the root: for example `Makefile` or `justfile`, `pom.xml` or `build.gradle`, `Cargo.toml`, `go.mod`, `Gemfile`, `pyproject.toml`, `package.json`.
- Checked-in wrappers first: `./gradlew`, `./mvnw`, `make test`, a script in the repo, rather than a globally installed tool.
- How to run one focused test and how to run the whole suite.
- Where tests live, how they're named, what the neighbouring tests look like.
- What CI runs (`.github/workflows/`, `.gitlab-ci.yml`): that's the command that gates merges.
- The glossary and the ADRs for the area (the `sf-spec` skill's `references/domain-modeling.md` section 1 says where they live). Name tests, functions and types with the glossary's terms, not their avoided synonyms, and don't write a test or code that contradicts an ADR; if the ticket seems to need that, report it.

`commands.test` in config is the full suite. Never assume `npm test`, `pytest` or any other default.

## The cycle

1. **Write one test for one behaviour.** A clear name that says the behaviour. Real code, not mocks, except at the boundaries listed under "Mock only at the boundaries" below. Pick the smallest layer that catches the break: a unit test, then an integration test; an end-to-end test only for a user journey the smaller tests can't see.
2. **Watch it fail.** Run the focused test. It must fail, not error, and fail because the behaviour is missing. A typo, an import error in the test itself or a broken fixture isn't a valid red: fix it and run again. For a symbol that doesn't exist yet, "not defined" is acceptable only when that symbol is what the ticket adds. If the test passes straight away, it tests behaviour that already exists: change the test, unless it guards a failure path or ordering the new code could break (see [test-author-prompt.md](test-author-prompt.md#after-it-reports)); then keep it and say so in the report.
3. **Make it pass** with the smallest change (see [smallest-change.md](smallest-change.md)). No extra options, no features the ticket didn't ask for.
4. **Watch it pass, and run the full suite.** A green focused test isn't a green suite. Run `commands.test` before committing. Name each failing test from that run in the report, whoever caused it.
5. **No refactoring inside the cycle.** The change that turns the test green is the change. Clean-ups you'd like to make go in the report as candidates for review, not into this commit.

## Tests that catch real breaks

Ask first which edit to the production code would turn this test red. With no answer, the test protects nothing; build it around something observable. If only a deliberate decision would fail it (a constant's value, exact wording), it's a change detector; test the behaviour that depends on the decision instead. Exact wording that the spec or the plan's `Produces` names as part of the interface (an error message callers match on, a status, a field) is the behaviour: pin it exactly.

**Derive expected values independently.** Use literals and hand-checked fixtures. An expected value computed by the code under test, or by its helpers, passes whatever that code does.

```text
bad:  expected = build_query(tag="urgent"); assert build_query(tag="urgent") == expected
good: assert build_query(tag="urgent") == 'tag:"urgent"'
```

More rules:

- **One logical assertion per test.** A test checks one behaviour. Several `assert` lines are fine when together they describe that one outcome; a second behaviour gets its own test.
- **Readable alone.** Each test shows its own setup and its expected values. Shared helpers may hide setup noise, never the values being asserted.
- **Assert behaviour, not mocks.** An assertion that passes because a mock exists says nothing about the code. If you're checking the mock, remove the mock or the assertion.
- **Mock only at the boundaries**: external APIs and services, the clock, randomness, and the filesystem when a real temporary directory won't do. A database is reached through a test database or the stand-in the plan names, not a mock. Never mock code this repo owns, its own classes or internal collaborators, even when they're slow: use the real module or a local stand-in. Before replacing something at a boundary, learn what the real thing does, and keep the side effects the test depends on real.
- **When mock setup outgrows the test**, use the real components instead. Heavy mocking or a huge setup means the design is coupled: say so in the report as a concern; don't paper over it with more doubles. Code that's hard to test usually has an unclear design.
- **Mirror real data completely.** A fake response has every field the real one has, not only the ones this test reads.
- **Make doubles specific.** If the contract cares which arguments were passed, how often, or in what order, the test checks that too. Give success, error and malformed input their own fixtures.
- **Test your code, not the framework.** Check the contract at your boundary: the route you register, the payload you send to an external service.
- **Read back through the interface.** Verify a write by reading it back the way callers do (create, then get), not by querying the storage directly, unless the storage format is itself the contract (a migration, a file format other tools read).
- **When upstream behaviour surprises you**, add one narrow characterisation test that pins what the library or service actually does, so a change in it shows up as a failure rather than a mystery.
- **No fixed sleeps.** Wait for the condition itself, polling fresh state at a sensible interval, with a timeout whose failure message names the condition (`waited 5s for job 42 to reach "done"`). A fixed delay only when the test is about timing, with a comment saying why.
- **Run scripts and configs; don't grep them.** Asserting a file contains a line proves only that the file is the file.
- **No test-only methods in production code.** Cleanup only tests need lives in test helpers.

## Mutation check

Before reporting, imagine each realistic mutation of the production change and check that at least one test fails for it:

- a constant or argument swapped for another value
- a condition flipped so the other branch runs
- a state update or side effect deleted
- the function returning nothing, or a zero value, instead of its result
- a validation removed, so zero, null, blank, malformed or unauthorised input gets through

A mutation nothing catches is behaviour without protection. Add the test, or say in the report which mutation survives and why that's acceptable.

## Bug fixes

The regression test goes at the seam named in `state.md`'s `## Debug` section, where it reproduces the bug as it happens at the real call site. If debug found no correct seam, write the best test available, say in the report that it's shallower than the bug, and the controller records it for review. The debug red command must pass after the fix too.
