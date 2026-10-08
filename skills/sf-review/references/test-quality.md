# Test-quality lens

Finds tests that cost more than they protect: low-value or duplicate tests, tests that assert implementation details, and production code kept alive only by tests. Report-only. It never deletes, rewrites or skips a test; `sf-build` acts on findings someone chose to fix.

The `testing` specialist asks whether changed behaviour is tested. This lens asks whether the tests that exist are worth keeping. Zero findings is a valid result; a few well-evidenced ones beat a long speculative list.

## Where it runs

- **Diff review:** as the `test-quality` specialist when the diff adds or changes test files (scope `tests`) with over 50 test lines, or when the diff adds an export, flag, wrapper or hook to production code that only tests use. It runs in both lanes. It looks at the tests the diff touches and the production symbols it adds. If a plan lists `Tests made obsolete`, those tests are its first candidates.
- **Architecture scan:** over the scanned path, as one pass of [architecture-scan.md](architecture-scan.md). Test-only production code and tests pinned to shallow modules feed its candidates. Give the pass a time budget (about a third of the scan); tests not reached are listed as not assessed, never as fine.

## The value bar

A test earns its place when it has all four answers:

1. What observable behaviour, invariant or contract does it protect?
2. What believable regression makes it fail?
3. Why doesn't existing coverage already catch that? (One more case in a table-driven test or fixture that already exists is better than a near-copy.)
4. Does it force production code to expose something only tests use, such as an export, flag, wrapper or injection hook? Then it belongs at the real interface instead.

A test that breaks under a behaviour-preserving refactor asserts implementation. It should be rewritten at the owning module's interface, unless exact output is the declared contract (golden files, wire formats, prompt text, generated code).

## Low-value patterns

A match is a candidate, not a verdict:

- no assertion, or only `toBeDefined`/`not.toThrow` on a computed value
- comparing a value with itself, or with a copy the code under test produced
- copied fixtures, inventories or export lists that mirror the source
- grepping source text or imports when that text is not a declared contract
- private helper or call-shape tests that a test at the real interface already covers
- the same contract checked twice with different names
- each caller re-testing a shared helper's behaviour
- mocks of the unit under test, or assertions only that a mock was called
- a test that exists only so a test-only export, global or wrapper isn't deleted
- a large new or regenerated snapshot (`.snap`, `__snapshots__`, golden files written by `-u`) that no specific assertion narrows: nobody reviews it, so it pins whatever the code did
- a test whose size doesn't match its job: a unit-level check that starts a server, a database or the network (a large test doing a small test's work) is slow and flaky for no gain
- production code whose only callers are tests

Test files are those `sf-verify`'s [scope rules](../../sf-verify/references/gates.md#scope) define: `test/`, `tests/`, `spec/`, `specs/` and `__tests__/` folders, `*.test.*`, `*.spec.*`, `*_test.*` and `test_*.*` files, root-level `test.*`, `tests.*` and `spec.*`, and whatever the runner's config names (package.json `ava.files`, jest `testMatch`, vitest `include`, pytest `testpaths`). Add the runner's globs to the pattern below when the repo sets them.

Cheap mechanical leads, read-only, before reading tests:

```bash
FILES=$(git ls-files -- <scope> ':(exclude).software-factory' | grep -E '(^|/)(tests?|specs?|__tests__)/|\.(test|spec)\.[^/]+$|_test\.[^/]+$|(^|/)test_[^/]+$|^(tests?|spec)\.[^/]+$')
if [ -z "$FILES" ]; then echo "no test files"; exit 0; fi
# 1. files with no assertion keyword
xargs grep -L -E 'assert|expect|must|refute|should|t\.(Fail|Fatal|Error)' <<<"$FILES"
# 2. tests that read source text
xargs grep -l -E 'readFileSync\(|read_text\(|open\(.*\.(ts|js|py|go|rb)' <<<"$FILES" | head
# 3. copied export lists
xargs grep -l -E 'Object\.keys\(.*(exports|module)|__all__|toMatchInlineSnapshot\(\s*`\s*\[' <<<"$FILES" | head
# 4. files identical once whitespace is stripped
for f in $FILES; do
  sum=$(sed 's/[[:space:]]//g' "$f" | tr -d '
' | md5sum | awk '{print $1}')
  echo "$sum $f"
done | sort | awk '{ if ($1 == last) print "near-duplicate: " lastf " " $2; last = $1; lastf = $2 }'
```

## Keep these

Don't report a test that independently guards a public API, protocol, config default, migration, storage format, security rule, platform behaviour, golden output, package export or release contract. Call order counts when the order is observable. A source grep counts when it is the cheapest independent guard of a declared rule. Static or slow is no reason to remove a test. Anything reachable from the package entry point (`package.json` `exports`/`main`, index re-exports, public modules) is never test-only.

## Evidence for each finding

Read the whole test, the production code it protects, its callers and any overlapping tests. A finding needs:

| Field | Content |
|---|---|
| `test` | file and test name |
| `detects` | what regression it catches today, or "nothing beyond <other test>" |
| `non_test_callers` | hit count from the caller search below, for test-only-code findings |
| `search` | the exact command run |
| `stronger_proof` | the test or interface that already covers it, or should |
| `history` | `git log --oneline --follow -- <test>`, first lines: why it exists |
| `unlocks` | test-only exports, wrappers or flags that could go with it |
| `validation` | the command that proves the suite still passes without it (the repo's focused test command for that file), or `validation not run: no runner` |
| `verdict` | `retire`, `rewrite` (at the owning interface), `extend` (merge it as a case into a table or fixture that already exists) |

Caller search for a symbol, excluding tests:

```bash
git grep -wnF -e '<symbol>' -- . ':(exclude).software-factory' \
  ':(exclude,glob)**/test/**' ':(exclude,glob)**/tests/**' ':(exclude,glob)**/spec/**' ':(exclude,glob)**/specs/**' ':(exclude,glob)**/__tests__/**' \
  ':(exclude,glob)**/*.test.*' ':(exclude,glob)**/*.spec.*' ':(exclude,glob)**/*_test.*' ':(exclude,glob)**/test_*.*' \
  ':(exclude,glob)test.*' ':(exclude,glob)tests.*' ':(exclude,glob)spec.*'
```

Grep misses re-exports, reflection, dynamic dispatch and generated code. Mark test-only-code findings `proof: grep only`; whoever removes the code confirms it with the repo's typecheck or build. A finding with an incomplete row is reported as `incomplete`, not as a candidate.

## Output

In a diff review, use the shared prompt in [specialists.md](specialists.md) with this file's "The value bar", "Low-value patterns" and "Keep these" sections as `[CHECKLIST]`. Each finding adds `"verdict"` and `"stronger_proof"`. Severity is `minor` or `important`; an assertion-free test for changed behaviour is `important` here and the lead may raise it to must-fix.

In an architecture scan, list findings in the report's `Test quality` section as a table with the fields above, grouped by the production module they protect, with test and production lines that each group would remove counted separately.
