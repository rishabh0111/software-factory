# Fix levels

Pick the highest level that makes the mistake impossible or makes it fail loudly. A lower level is allowed only when you can say why each higher one doesn't work for this class. Write that reason in the proposal.

## 1. Architecture: remove the way to get it wrong

- Every piece of state gets a single owner, and every task a single supported path.
- Hide internals so the wrong import fails to resolve (package exports, module visibility, a separate package).
- Replace lists that are kept in sync by hand with one source the others are generated from.
- Delete old ways of doing the task and dead code an agent might copy.

Use it when: the mistake exists because there are two ways to do something, or a list that must be kept in sync.

## 2. Types: make the bad state unwritable

- A branded or newtype ID so two kinds of ID can't be swapped.
- A union or enum instead of a free string.
- A constructor or parser that is the only way to get a validated value.
- Required fields instead of optional ones that are always meant to be set.

Use it when: the language has a type checker in `commands.typecheck`, and the mistake is a wrong value, shape or call order.

## 3. Lint or CI check: fail with the fix in the message

- First look for an existing rule, script or CI job that covers the class but is unwired, disabled or failing silently; fixing it beats adding a new one.
- A rule added to whatever linter the repo uses (ESLint, Ruff, golangci-lint, Clippy, a Semgrep or ast-grep rule), a hook that runs before each commit, or a job in CI. Pick whichever the repo already runs and is cheapest to extend.
- The failure message points to the right file, type or function, e.g. "Use `db/client.ts#query`, not `pg` directly".
- If the pattern is already common, ratchet: fail only on new occurrences (a baseline file, or a check limited to changed lines), and let the count only go down.
- Local runs and CI use one identical command. A check that runs only in one place is half a check.

Use it for every mechanical violation: a banned call, an import shape, a file in the wrong place, a fixed syntactic pattern, a missing file next to another.

## 4. Test: pin the behaviour

- A test at the boundary where the mistake happened, covering every site with the same defect, not only the one that was caught.
- If a test keeps passing when everything it calls returns nothing, it proves nothing. Fix or delete it.

Use it when: the mistake is wrong behaviour that no type or pattern can describe.

## 5. Docs or agent rules: judgment calls only

- `CODING_STANDARDS.md` or the reviewer's brief, not `CLAUDE.md`/`AGENTS.md`, which load into every agent's context and should stay short: they hold navigation pointers to docs, not rules.
- Of all the agents, the reviewer carries the lightest context load, so standards belong in what it reads, not in what the implementer carries.
- Extend an existing doc before proposing a new one; a doc is a reference file other files point to.
- When `CODING_STANDARDS.md` passes about 1,000 lines, split it by topic into docs and leave pointers.
- Only for calls no check could make: consistency across files, matching the surrounding design, naming that depends on meaning.

Nothing fails when an agent skips a doc. A docs-only rule that is broken again moves up a level.

## Proving a check

The proposal names a real past mistake: the commit, or the diff from the ledger, that contained it. Whoever builds the check proves it:

```sh
git worktree add ../sf-proof <commit-with-the-mistake>
cd ../sf-proof && <check command>        # must fail, and the message must name the fix
cd - && git worktree remove ../sf-proof
<check command>                          # on current trunk: must pass (with the ratchet baseline, if any)
```

If the mistake was caught before it was committed, rebuild it: apply the finding's diff to a scratch branch and run the check there. Both outputs go into that run's evidence. Without them, the rule stays `proposed`.

## Exceptions

Each exception is placed on the line it excuses and states why, when it expires, and who approved it. It is also listed in the `Exceptions` table in `lessons.md`. An agent never grants, renews or extends one.
