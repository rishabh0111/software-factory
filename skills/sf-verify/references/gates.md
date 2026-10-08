# Gates

Detail for each gate in `sf-verify`. Every command runs from the repo root through the recorder, `.software-factory/bin/record.sh` ([evidence.md](evidence.md)), unless it says it runs in a temp copy. Pass the command as arguments after `--`; never wrap a variable in `bash -c`.

Result values: `pass`, `fail`, `error` (couldn't check), `pre-existing` (gates 1 and 2 only: every failure also occurs on the base, see [Baseline](#baseline-gates-1-and-2)), `n/a (<reason>)`, `skipped (earlier gate failed)`, `waived (<who>, see runs/<run-id>/decisions.md)`. Only `pass`, `pre-existing`, `n/a` and `waived` let the overall result pass.

## Scope

Changed paths are the union of `git diff --name-only -z <merge-base> HEAD -- . ':(exclude).software-factory'` and, as a safety net, `git ls-files --others --exclude-standard -- . ':(exclude).software-factory'` (should be empty, since step 1 requires a clean tree). If the merge base can't be resolved, scope is `couldn't look` and the report fails.

`.software-factory/` holds the factory's own files (setup scripts, spec, decisions, `verify.md`). It is never part of the change's scope, size or tamper checks, even when the run branch commits to it.

**Test files.** A path is a test file when it is under a `test/`, `tests/`, `spec/`, `specs/` or `__tests__/` folder at any depth; is named `*.test.*`, `*.spec.*`, `*_test.*` or `test_*.*`; is a root-level `test.*`, `tests.*` or `spec.*`; or matches the test runner's own config (package.json `ava.files`, jest `testMatch`, vitest `include`, pytest `testpaths`). As a regex over repo-relative paths, before the runner globs:

```
(^|/)(tests?|specs?|__tests__)/|\.(test|spec)\.[^/]+$|_test\.[^/]+$|(^|/)test_[^/]+$|^(tests?|spec)\.[^/]+$
```

Each path can set several scopes, except that a test file sets only `tests`, and a path that sets `prompts` never sets `docs`:

| Scope | Paths |
|---|---|
| frontend | `*.css *.scss *.sass *.less *.pcss *.tsx *.jsx *.vue *.svelte *.astro *.html *.erb *.haml *.slim *.hbs *.ejs`, `tailwind.config.*`, `postcss.config.*`, `components/`, `views/`, `templates/`, `static/`, `public/`, `styles/`, `css/` |
| backend | source files (`*.py *.go *.rs *.java *.kt *.rb *.php *.cs *.ts *.js *.mjs *.cjs`) that aren't frontend or test files |
| api | `api/`, `*route*`, `*controller*`, `*endpoint*`, `*handler*`, `openapi.*`, `swagger.*`, `*.graphql`, `*.proto`; any file listed under `API files` in `verify.md`; and any changed file whose added or removed lines define a route (see API by content below) |
| tests | test files as defined above, and `e2e/` |
| migrations | a `migrations/` folder at any depth, `db/migrate/`, `db/data/`, `data_migrations/`, `alembic/`, `prisma/migrations/` |
| prompts | `prompts/`, `system_prompts/`, `*.prompt*`, `*prompt_builder*`, files listed under `Prompt files:` in `verify.md`, eval cases (`evals/`), and any changed file whose added or removed lines define a prompt, a tool definition or a model call (see Prompts by content below). Prompts and templates are behaviour, even in Markdown |
| auth | `*auth*`, `*session*`, `*permission*`, `*role*`, `*jwt*`, `*oauth*`. Note it in the report: `sf-ship` decides whether it needs a person's look |
| config | lockfiles, manifests (`Cargo.toml`, `go.mod`, `package.json`, `pom.xml`, `pyproject.toml`), `*.gradle*`, `*.yml`, `*.yaml`, `*.toml`, and repo housekeeping files: `.gitattributes`, `.gitignore`, `.editorconfig`, `.npmrc`, `.nvmrc` (these set no other scope, so `sf-setup`'s `.gitattributes` line never counts as backend) |
| agent-config | `.claude/`, `CLAUDE.md`, `AGENTS.md`, `.mcp.json`, `.github/workflows/`, `.gitlab-ci.yml`; a `CLAUDE.md` or `AGENTS.md` change counts only outside its `## software-factory` block (see Pointer block below) |
| docs | `*.md`, `docs/` (including `GLOSSARY*.md` and `docs/adr/`) |

**API by content.** Routes often live in a file whose name says nothing (`app.js`, `server.py`, `main.go`). A changed file sets `api` when a line the diff adds or removes matches the route pattern. Markdown files are skipped: a README line that mentions `PATCH /api/todos/:id` documents a route, it doesn't define one (it still sets `docs`, and gate 11 covers API docs):

```bash
mb=$(git merge-base <default_branch> HEAD)
git diff -U0 --no-color "$mb" HEAD -- . ':(exclude).software-factory' ':(exclude)*.md' \
  | awk '/^\+\+\+ b\//{f=substr($0,7); next} /^---/{next} /^[-+]/{print f ": " substr($0,2)}' \
  | grep -E '\b(app|router|server|api|bp|blueprint)\.(get|post|put|patch|delete|all|route|use)\(|\.route\(|@[A-Za-z_.]*\.(route|get|post|put|patch|delete)\(|@(Get|Post|Put|Patch|Delete|All|Controller|RequestMapping|GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\(|url\.pathname *===?|req\.(method|url) *===?|[^A-Za-z0-9_./]/api(/|\b)' \
  | grep -Ev 'fetch\(|axios|XMLHttpRequest|\.ajax\(' | sed 's/: .*//' | sort -u
```

Each file it prints sets `api`, besides its other scopes. When `verify.md` has an `API files:` line, those paths set `api` whenever they change, even if the changed lines aren't route lines (a handler body edit).

**Pointer block.** `sf-setup` writes a `## software-factory` block into `CLAUDE.md` or `AGENTS.md`, and may create the file for it, so the first run's branch often carries it. That block is the factory's own pointer, not an agent-config change. For each of the two files the diff touches, compare base and head with the block (its heading to the next `## ` heading), the file's `# ` title and blank lines removed:

```bash
strip() { awk '/^## /{skip=($0 ~ /^## software-factory[[:space:]]*$/)} !skip' | grep -Ev '^[[:space:]]*$|^# '; }
f=CLAUDE.md   # then AGENTS.md
if [ "$(git show "$mb:$f" 2>/dev/null | strip)" = "$(git show "HEAD:$f" 2>/dev/null | strip)" ]; then echo "$f: pointer block only"; fi
```

`pointer block only` means the file sets no scope (not `agent-config`, not `docs`). Any other difference sets `agent-config` as usual.

**Prompts by content.** Prompts often sit inside ordinary source files. A changed file sets `prompts` when a line the diff adds or removes matches:

```bash
git diff -U0 --no-color "$mb" HEAD -- . ':(exclude).software-factory' \
  | awk '/^\+\+\+ b\//{f=substr($0,7); next} /^---/{next} /^[-+]/{print f ": " substr($0,2)}' \
  | grep -E '(messages|completions|responses)\.create\(|generate(Text|Object|Content)\(|stream(Text|Object)\(|\b(system_prompt|systemPrompt|SYSTEM_PROMPT|input_schema|tool_choice|function_call)\b|"role" *: *"system"|role: *.system.' \
  | sed 's/: .*//' | sort -u
```

A path that matches nothing counts as backend. A change that sets `prompts` is never docs-only. Docs-only changes still run gates 1, 2, 4 and 4a, and gate 11 when the changed docs are a getting-started, usage or reference page for a developer-facing surface; the others are `n/a (docs only)`. Note `agent-config` in the report: `sf-ship` needs a person's yes to merge it.

## 1. Build, lint, typecheck

Run `commands.build`, `commands.lint`, `commands.typecheck` from config, each as its own record. `unknown` means `n/a (no command)`. Run `commands.install` first if dependencies are missing; installing changes no tracked content in a correctly ignored repo, and the recorder will show it if it does. A non-zero exit goes through the [baseline comparison](#baseline-gates-1-and-2) before it counts as `fail`.

**Lint warnings.** Lint passes on exit 0, warnings or not. A warning only fails the gate when the project's own command already makes it an error (for example `--max-warnings 0`, so it exits non-zero). A warning the diff introduces (on a line the diff added or changed, and absent from the base output when you have one) is a should-fix finding: list it in the report's `## Findings` as `L-<n>`, gate `lint`, with the rule and `file:line`.

## 2. Test

Run `commands.test`, the full suite. `unknown` is `error`: there's no way to verify without it. Pass needs exit 0 and output showing at least one test ran. A non-zero exit goes through the [baseline comparison](#baseline-gates-1-and-2) before it counts as `fail`. Note new warnings in the evidence line; they are review material, not a gate failure.

## Baseline (gates 1 and 2)

A project command can already fail on the base. Only failures this change introduces fail the gate.

1. Run the command on head through the recorder as usual. Exit 0 is `pass` (for test, with tests run).
2. Otherwise get the base result for the same command, first match wins:
   - config `baseline`, when its commit equals the merge base: `pass`, or `fail: <one-line signature>` for that command. Use it only if it accounts for every head failure; if not, take the third route.
   - `evidence/baseline.log`, for the test command, when it was taken on the current merge base (the commit it names, or the base in `state.md`). The conductor writes it at run start; a rebase since then makes it stale.
   - Neither covers the merge base: run the command on the base yourself in a temp copy outside the repo (`git worktree add --detach "$TMP/sf-base-<sha7>" <merge-base>`, `commands.install`, the command, then `git worktree remove --force`). Save the output to `evidence/baseline-<label>.log`. The copy is outside the repo, so the fingerprint doesn't change.
3. Take the failure signatures from both outputs:
   - a failing test: test file and test name
   - a lint or typecheck error: rule or error code, file and message, without the line number (it shifts with the diff)
   - a whole-command crash (non-zero exit with no test or check results): its first error line
   In each, make paths repo-relative and drop times, durations, temp folder names and colour codes.
4. A head signature that also appears on the base is `pre-existing`; any other is `new`. If the base result can't be had (the copy won't install or build), every head failure is `new`, with the reason in the evidence line. Never assume pre-existing.
5. **Flaky check.** For each `new` failing test, run that test alone 3 times on head (the runner's own filter: `-t`, `-k`, `--grep`, `-run`), each through the recorder as `test-rerun-<n>`. All 3 fail: it stands as `new`. Any of them passes: it is still `new` and still fails the gate, but mark it `flaky (<k> of 3 failed alone)` in the evidence line and its For-the-builder line, and add "fails only in the full suite or intermittently: check order dependence or timing before changing logic" so build doesn't chase a failure it can't reproduce. No way to run one test alone: say `flaky check not possible` in the evidence line.
6. Any `new` signature: `fail`, listing only the new ones for the builder. All `pre-existing`: the gate is `pre-existing`, which doesn't block. Write the comparison to `evidence/baseline-<label>.md`: the base source used, then one line per head signature with `new` or `pre-existing`.

Pre-existing failing tests (not a whole-command crash) go in `## Findings` and into one issue draft per run listing every pre-existing failing test signature, at `evidence/baseline/issues/test-failures.md` from [../assets/issue-draft-template.md](../assets/issue-draft-template.md), listed under Notes for `sf-triage`. They are not lost just because they don't block.

A pre-existing whole-command crash means the command gave no evidence on head (for test: no test ran). Say so in the evidence line, list it in `## Findings` as `pre-existing`, and add to Notes `recommend a fix ticket: <command> fails on base with <signature>`, with an issue draft from [../assets/issue-draft-template.md](../assets/issue-draft-template.md) at `evidence/baseline/issues/<label>.md` for `sf-triage`. Later gates still run; holdouts and the app gates carry the evidence the suite couldn't.

## 3. Regression

When `state.md` has a `## Debug` section, run its red command exactly as written. When it records both an original and a minimised red command (`Red command (original)`, `Red command (minimised)`), run both; the original, un-minimised scenario is the one the person reported, and a fix that only cures the minimised case is a fail. When only one red command is recorded but `evidence/debug-red.log` shows a longer original scenario than `debug-red-min.log`, run that original too.

Run each red command twice on head, as `regression-1` and `regression-2`. Both runs must exit 0. Then check that it still exercises the bug: the command and its target files must be the same as in `evidence/debug-red-final.log`. A red command that was edited to pass is a fail.

## 4. Floor-guard

```bash
bash .software-factory/bin/record.sh floor-guard .software-factory/runs/<run-id>/evidence/floor-guard.log -- node .software-factory/bin/floor-guard.mjs --base <code.default_branch>
```

It prints one JSON object on stdout and exits `0` clean, `1` findings, `2` couldn't check. Save the JSON in the log. On `1`, copy each finding into the report as `<rule> <file>:<line>`. If `node` isn't installed, the gate is `error (node missing)`; recommend installing Node.js.

floor-guard skips `.software-factory/`: the setup scripts there quote the very patterns it looks for. If a finding still names a path under `.software-factory/` (a copy from before that fix), it isn't part of the change: drop it. When no other finding remains, the gate is `pass` with the evidence line `<n> .software-factory/ findings ignored`, and Notes say to re-copy `floor-guard.mjs` from `sf-setup`. The hand checks below skip `.software-factory/` too.

It catches structural moves: skips, focus, deleted tests, removed assertions, suppression comments (including `Stryker disable`), stubs, lowered thresholds, deselected tests. It can't see a changed expectation or a mocked unit; gates 5, 6 and 8 cover those.

### Deciding each finding

A floor-guard or hand-check finding fails the gate unless one of these clears it:

- **A person's ruling.** `ledger.md` has a `Ruling:` line from a person naming that rule and `file:line`. Unattended runs make no rulings.
- **Accepted by rule.** Only for `assertion-removed` (an assertion removed or edited in a test file that still exists), when the spec changes the behaviour the test pinned. No person is needed when all three hold:
  1. the ticket's plan (`plans/T<n>.md`) lists that test under `Tests changed` or `Tests made obsolete`;
  2. `ledger.md` has a `test-change` line for that file (and test, when named) whose reason cites the spec capability whose behaviour changes, as `SPEC-<slug>/CAP-<n>`;
  3. gate 6's summary for `HEAD` has that capability's line as `pass` (run now or carried).

  Gate 6 runs after gate 4, so decide these findings once gate 6 has a result. When all three hold, the finding doesn't fail the gate; write it in the report under Notes as `accepted-by-rule: <rule> <file>:<line> | plan: plans/T<n>.md Tests <changed|made obsolete> | ledger: <the test-change line> | holdouts: SPEC-<slug>/CAP-<n> pass @ <sha7>`, and the gate's evidence line ends `, <k> accepted-by-rule`. `sf-ship` lists every such line under `Needs a person's look`. If any of the three is missing (no holdout set, the capability `partial` or `fail`, a reason citing only "the test was wrong"), the finding fails the gate and needs a person's ruling.

No other finding is accepted by rule: deleted test files, skips, suppressions, stubs, lowered thresholds, deselected tests, cache or baseline changes, eval weakening and decision-log rewrites always need a fix or a person.

Also check by hand, since floor-guard doesn't:

- the diff adds or changes a mutation cache (`reports/stryker-incremental.json`, `mutants/`, PIT history files) or a Schemathesis baseline. Each is a finding: `cache-or-baseline-changed <file>`.
- a change to an end-to-end test touches an `expect(` line together with a locator change (see Playwright healer below). Finding: `assertion-edited <file>:<line>`.
- the diff raises an eval budget, lowers an eval pass threshold, adds retries, or skips or deletes an eval case (in eval config, `evals/` or the eval runner). Finding: `eval-weakened <file>:<line>`. A red eval is fixed at its cause, never by loosening the eval.
- `git diff <merge-base> HEAD -- .software-factory/decisions.md` shows a removed or changed line (a `-` line other than the `---` header). The decision log is append-only. Finding: `decision-log-rewritten <line>`. This is the one check that reads inside `.software-factory/`.

## 4a. Scanners

Deterministic secret and dependency-advisory checks on the run's diff, so security doesn't rest on an LLM reviewer alone. Runs even when build or test failed, like floor-guard.

**Applies when** `tools.scanners` in config lists at least one of `gitleaks`, `osv-scanner`, `npm-audit`, `pip-audit`. No key or an empty list: `n/a (no scanners in tools.scanners)`, and Notes recommend running `sf-setup` to add them. A listed tool that isn't on `PATH` is `error (<tool> not on PATH)`. Use only the tool on `PATH`: never a copy from the repo (`node_modules/.bin`, `vendor/`), never `npx`, `pipx run` or `go run`, never an install.

**Secrets.** Only the run's commits, always with `--redact`, so no secret value reaches a log:

```bash
bash .software-factory/bin/record.sh scan-gitleaks .software-factory/runs/<run-id>/evidence/scan/gitleaks.log -- gitleaks git --redact --no-banner --log-opts=<merge-base>..HEAD --report-format json --report-path .software-factory/runs/<run-id>/evidence/scan/gitleaks.json .
```

For gitleaks older than 8.19 use `gitleaks detect --redact --no-banner --source . --log-opts=<merge-base>..HEAD` with the same report flags. Exit 1 means leaks were found: each is a finding `secret <rule> <file>:<line> <commit sha7>`, never the value. If the diff adds or changes `.gitleaks.toml` or `.gitleaksignore`, list what it allow-lists: a person checks it.

**Dependencies.** Only when the diff changes a lockfile (`package-lock.json`, `npm-shrinkwrap.json`, `pnpm-lock.yaml`, `yarn.lock`, `poetry.lock`, `uv.lock`, `Pipfile.lock`, pinned `requirements*.txt`, `go.sum`, `Cargo.lock`, `Gemfile.lock`, `composer.lock`); otherwise this half is `n/a (no lockfile changed)`. For each changed lockfile, use the first listed tool that reads it:

| Tool | Command on head (log to `evidence/scan/<tool>-<n>.json`) |
|---|---|
| `osv-scanner` | v2: `osv-scanner scan source -L <lockfile> --format json`; v1: `osv-scanner --lockfile <lockfile> --format json` |
| `npm-audit` | `npm audit --json --package-lock-only`, run in the folder holding `package-lock.json` |
| `pip-audit` | `pip-audit --disable-pip --no-deps -r <requirements file> -f json`, only for fully pinned requirements. Never without `--disable-pip`: that installs packages and runs their build code |

Then run the same command on the base's version of the lockfile, copied into a temp folder outside the repo (`git show <merge-base>:<lockfile>`, with `package.json` beside it for npm). An advisory ID present on head and not on base is `new`; one on both is `pre-existing`. A lockfile that didn't exist on base: every advisory is `new`. These tools exit non-zero when they find something; that's a result, not an error.

**Result.** `fail` on any secret finding, or any `new` advisory rated high or critical (CVSS 7.0 or above, or the advisory's own `HIGH`/`CRITICAL`). A new advisory with lower or unknown severity, and every pre-existing one, is a should-fix finding `S-<n>` (package, locked version, fixed version, advisory ID). Write the gate record `scanners` yourself, as for holdouts, `exit` 0 only when it passes, `log` pointing to `evidence/scan/summary.md`.

## 5. Mutation (diff-scoped)

Applies when a tool is already set up in the repo: a Stryker config or `@stryker-mutator/core` in `devDependencies`; `mutmut` in `pyproject.toml`, `setup.cfg` or dev requirements; the PIT plugin in `pom.xml` or `build.gradle`. Never install one. No tool: run the [fallback](#fallback-three-hand-mutations) instead. No changed source lines (tests or docs only) means `n/a (no source lines changed)`.

**Project numbers.** For every threshold in this file and in [performance.md](performance.md), take the project's own first (the tool's config, then a `quality:` block in `.software-factory/config.yaml`: `mutation_threshold`, `changed_line_coverage`, `perf_threshold_pct`, each with its reason), and only then the default named here. Log a default you take in `runs/<run-id>/decisions.md` once.

Never use a cache from the run's branch: no `--incremental`, no PIT history input, and mutmut starts with an empty `mutants/` folder. A cache restored from the default branch's CI is allowed.

**Threshold.** Use the project's own (Stryker `thresholds.break`, PIT `mutationThreshold`, then `quality.mutation_threshold`). If none is set, use 60% and log that default in `runs/<run-id>/decisions.md` once. Score on changed lines = (killed + timeout) / (killed + timeout + survived + no coverage).

**Stryker.** Build the changed line ranges, then run only those:

```bash
mb=$(git merge-base <default_branch> HEAD)
ranges=$(git diff -U0 --no-color "$mb" HEAD -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.mjs' '*.cjs' '*.mts' '*.cts' '*.vue' '*.svelte' ':(exclude).software-factory' \
  | awk '/^\+\+\+ b\//{f=substr($0,7)} /^@@/{split($3,a,","); s=substr(a[1],2); n=(a[2]==""?1:a[2]); if(n>0 && f !~ /(^|\/)(tests?|specs?|__tests__)\/|\.(test|spec)\.[^\/]+$|_test\.[^\/]+$|(^|\/)test_[^\/]+$|^(tests?|spec)\.[^\/]+$/) printf "%s:%d-%d\n", f, s, s+n-1}' \
  | paste -sd, -)
bash .software-factory/bin/record.sh mutation .software-factory/runs/<run-id>/evidence/mutation.log -- npx --no-install stryker run --mutate "$ranges" --reporters clear-text,json
```

The awk pattern is the [test-file](#scope) regex. If the runner's config names other test globs, add each as a `':(exclude,glob)<glob>'` pathspec.

Stryker exits non-zero below `thresholds.break`. When `break` isn't set, compute the score from `reports/mutation/mutation.json` (statuses `Killed`, `Timeout`, `Survived`, `NoCoverage`) and apply the threshold yourself. List each survivor as `file:line mutatorName`.

**mutmut.** POSIX only: on Windows without Docker, `n/a (mutmut needs POSIX)`. Run in a temp copy (`git worktree add --detach "$TMP/sf-mut-<sha7>" HEAD`, install, then remove the copy). Limit `paths_to_mutate` to the changed source files in the copy's config, run `mutmut run`, then `mutmut export-cicd-stats` and read `mutants/mutmut-cicd-stats.json` (`killed`, `survived`, `timeout`, `no_tests`). Scope is changed files, not lines; say so in the evidence line.

**PIT.** Run the project's configured PIT goal or task with `targetClasses` limited to changed classes and the threshold passed as `mutationThreshold`. Never pass `historyInputLocation` or `withHistory`. PIT's line-level diff mode is a paid add-on; class scope is the fallback.

### Fallback: three hand mutations

With no mutation tool, test the tests by experiment anyway, on a small sample:

1. Make a temp copy outside the repo: `git worktree add --detach "$TMP/sf-mut-<sha7>" HEAD`, then `commands.install` in it.
2. From the changed source lines (not test files, see [Scope](#scope)), pick 3, preferring conditions, boundaries and calls whose result matters. For each, one at a time, apply one one-line mutation in the copy: negate a condition (`==` to `!=`, drop a `!`), shift a boundary (`<` to `<=`, `+ 1` to `+ 0`), or drop a call or its return value (delete the statement, return early).
3. Run the focused tests for that file (the tests that import it, through the runner's filter), or `commands.test` when there's no focused way. Save the output to `evidence/mutation-fallback/m<n>.log`. Revert the mutation (`git checkout -- <file>` in the copy) before the next one.
4. A mutant whose run still passes survived. Remove the copy (`git worktree remove --force`).

The gate result is `n/a (no mutation tool; fallback <k> of 3 killed)`: three samples are not a score, so they never fail the gate. Each survivor is a should-fix finding `M-<n>`: `<file>:<line> <mutation> survived`, so review and build see that no test checks that line. Write the gate record by hand with `log: evidence/mutation-fallback/`.

### Changed-line coverage

When the gate 2 run already wrote a coverage report (`lcov.info`, `coverage.xml` in Cobertura format, `coverage.out` for Go, newer than the run's start), intersect it with the changed source lines from the Stryker ranges command above. Never run an extra coverage command for this. Coverage = covered changed lines / instrumented changed lines. Uncovered changed lines are a should-fix finding `C-1` listing `file:line` ranges. Below `quality.changed_line_coverage` when the project set one: gate 5 fails, through its own record labelled `coverage`. With no project number, 80% is used only to word the finding, never to fail. No report: say `coverage: not reported by the suite` in the evidence line.

## 6. Holdouts

See `SKILL.md` and [holdout-runner-prompt.md](holdout-runner-prompt.md). The record's `exit` is 0 only if the summary's first line says `pass`, its SHA is `HEAD` (or a commit that differs from `HEAD` only in `.software-factory/` paths that don't re-run holdouts, see [evidence.md](evidence.md#carrying-records-over-a-software-factory-only-commit)), and no line says `leak suspected`; a targeted run also needs the carry condition in [holdout-runner-prompt.md](holdout-runner-prompt.md#full-or-targeted). The evidence line names the mode, `full` or `targeted (<n> run, <k> carried from <sha7>)`, and `sf-ship` reads it.

## 6a. Migrations

Applies when the scope includes `migrations`. Every migration needs a down path that was run before merge; `sf-ship` reads this gate's record before a deploy.

Use the `## Database` section of `verify.md`: how to create a throwaway database, the variable that points the app at it (name only), and the project's migrate up, down and schema-dump commands. If the section is missing, add it the way step 2 of `SKILL.md` adds a missing feature. Never run against a database named in `.env`, a shared or staging database, or anything behind `app.production_url`: the database must be one this run created.

1. Create the throwaway database at the base schema: run the up command from a temp copy at the merge base (`git worktree add --detach`), or the project's own reset. If `verify.md` gives seed data, load it now, so the new migrations run over existing rows, not only an empty table.
2. On head: up (`migrate-up-1`), dump the schema; down by the number of migrations the diff adds (`migrate-down`); up again (`migrate-up-2`), dump again. Each through the recorder.
3. Pass when all three exit 0 and the two dumps are the same (ignore the migration tool's own bookkeeping table timestamps). No dump command: compare the tool's status output instead and say so.
4. Drop the throwaway database and remove the temp copy.

A migration tool with no down command (some only go forward) is `n/a (<tool> has no down migrations)`; Notes say a person must accept the rollback plan at ship. A migration file with an empty or raising down step is `fail` (`<file>: no down step`). A database that can't be created is `error`, with the reason.

## 6b. Evals

Applies when the scope includes `prompts`: a prompt, template, tool definition, model call or eval case changed. A model-behaviour change that a unit test passes can still make answers worse; only the project's evals see that.

- Use `commands.eval` from config. `unknown` or missing: `error (prompts changed, no eval command)`, never `n/a`; Notes recommend recording it with `sf-setup`. `none` (a person said the project has no evals): `n/a (commands.eval: none)`, and Notes say the prompt change went unevaluated.
- If the repo documents an eval selector (a dependency map, a `--affected` flag), use it and include every plausibly affected suite; otherwise run every suite. Use the project's full pre-merge tier, never a cheaper or faster one.
- Run it through the recorder (`eval`) with an outer time limit (`timeout <seconds>` from the project's declared suite duration, else 30 minutes). Silence is not success: hitting the limit is `error (eval timed out)`.
- The record needs the suite's own counts (passed, failed, skipped). No counts in the output: `error`. Skipped or unstarted cases don't count as passed: any skipped case is `error`, unless it is skipped on the base the same way.
- Getting to green by loosening the check is forbidden: no higher budgets, no lower thresholds, no added retries, no skipped cases (gate 4 looks for these in the diff).
- A failing case goes through the [baseline comparison](#baseline-gates-1-and-2) with the case name as its signature, before it counts as `fail`. Paid evals on the base run only when the head run failed.

## 7. App

Applies when the scope includes frontend, api or backend code behind a user-facing surface, and `verify.md` describes a running surface. The checker in [app-check-prompt.md](app-check-prompt.md) follows `verify.md`: launch, doctor, drive, evidence, cleanup.

- Web UI: through the browser MCP in `tools.browser_mcp` (Chrome DevTools or Playwright), re-checked first; if it fails, through the [headless fallback](#browser-check-and-fallback). Only when neither works and the change has a UI part is the gate `error (no browser tool)`; recommend running `sf-setup` to add one.
- CLI or service: through the shell or HTTP, as `verify.md` says.

Pass needs, for every feature the spec's capabilities touch: the observable end state reached through the real user path, from every entry point the feature map lists for it (a feature proven through one entry point isn't proven through another), side effects checked (row written, file created, message sent), and no new console errors or failed requests compared with the default branch's known list in `verify.md`. Evidence (snapshots, screenshots, transcripts, response bodies) goes to `evidence/app/`, with file names that carry the feature and entry point.

If a feature can't be reached, the result is `fail` with the missing prerequisite (auth, seed data, external service), not `pass`.

**Telemetry.** When `verify.md` names a `Logs:` location, the checker causes one error on a changed feature through its documented error path (invalid input, a missing record) and looks for it in that location, by its request or trace ID when the app returns one. Not found, or found without an ID that ties it to the request: a should-fix finding `T-1`, since a production failure there would be invisible.

**Browser safety.** Both checkers follow [exploratory-qa.md](exploratory-qa.md#browser-safety): only configured URLs, only pages they opened, no reading of cookies or tokens through scripts.

### Browser check and fallback

`browser_status: ready` in config is what setup saw once; it goes stale (the server's browser closed, a config that attaches to someone's profile). So before the first gate that drives a web UI (7, 9, 10, or 12's web fallback), check the browser yourself, from the main session:

1. **Re-check the MCP.** When `tools.browser_mcp` names a server, make one real read-only call: `list_pages` for chrome-devtools, `browser_tabs` with `action: list` for Playwright. Tools being listed proves nothing. If the call returns, use the MCP; don't copy the listing anywhere. A connect error gets one retry.
2. **Fallback.** If the call still fails, or `browser_mcp` is `none` or `pending`, start a throwaway headless browser with a new temporary profile and drive it over the Chrome DevTools Protocol:

   ```bash
   prof="${TMPDIR:-/tmp}/sf-cdp-<run-id>"   # short path in the OS temp folder; never under evidence/
   rm -rf "$prof" && mkdir -p "$prof"        # a new, empty profile; never an existing user data folder
   command -v cygpath > /dev/null && prof=$(cygpath -m "$prof")   # Git Bash: a Windows path for chrome.exe
   "<chrome or msedge>" --headless=new --remote-debugging-port=0 --user-data-dir="$prof" --no-first-run --no-default-browser-check about:blank > /dev/null 2>&1 &
   pid=$!
   # the port is the first line of "$prof/DevToolsActivePort" once it appears
   ```

   The binary is Chrome or Edge: `chrome`/`google-chrome`/`chromium`/`microsoft-edge` on PATH, or the usual install paths (Windows `C:/Program Files/Google/Chrome/Application/chrome.exe`, `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`; macOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`). Pass the checker `Browser tool: cdp http://127.0.0.1:<port>`. It drives the browser with a small script it writes under `evidence/app/cdp/` (Node's built-in `WebSocket` on Node 22+, or Playwright's `chromium.connectOverCDP` when the repo already has Playwright), never in the repo. The profile always stays in the OS temp folder, never beside the script: a run's evidence path can be deep enough that Chrome can't create its profile there on Windows (260-character limit).

   When the gates are done, stop the browser and its child processes, then delete the profile:

   ```bash
   if command -v taskkill > /dev/null; then   # Windows (Git Bash): $! is a wrapper, not chrome.exe
     wpid=$(ps -p "$pid" | awk 'NR==2 {print $4}')   # the WINPID column
     [ -n "$wpid" ] && MSYS_NO_PATHCONV=1 taskkill /PID "$wpid" /T /F
   else
     kill "$pid"
   fi
   rm -rf "$prof"
   ```

   If `rm` reports the folder in use, a process is still running: on Windows stop every process whose command line contains `sf-cdp-<run-id>` (PowerShell `Get-CimInstance Win32_Process | Where-Object CommandLine -like '*sf-cdp-<run-id>*' | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`), elsewhere `pkill -f sf-cdp-<run-id>`, then delete it again.
3. **Never the user's browser.** Don't attach to an already-running browser, its debugging port or its profile (`--autoConnect`, `--browserUrl`, `--wsEndpoint`, a channel's `User Data` folder). The fallback always starts its own process on its own temporary profile.
4. **Say so.** The gate's evidence line names the route: `browser: mcp`, or `browser: headless CDP fallback (MCP failed: <one-line error>)`. With the fallback, Notes recommend fixing the MCP with `sf-setup` (an isolated profile, [browser-mcp.md](../../sf-setup/references/browser-mcp.md)). `verify.md` never names a fallback script as the way to drive the app: the script lives in the run's evidence, which a teammate doesn't have.

Only when no Chrome or Edge can be started is a UI gate `error (no browser tool)`.

## 8. API contract (Schemathesis)

Applies when the repo has an OpenAPI or Swagger document (`openapi.*`, `swagger.*`, or a schema URL in `verify.md`) and the API can be launched per `verify.md`.

```bash
schemathesis run <schema path or URL> --url <base URL> --checks all --report junit --report-dir .software-factory/runs/<run-id>/evidence/api
```

Use the project's installed Schemathesis. If it isn't installed and `uv` is, use the pinned `uvx schemathesis@4.29.4 run ...`. Otherwise `error (schemathesis not available)`.

- Exit `0` pass, `1` fail, `2` error: Schemathesis couldn't do its job or tested nothing. Exit 2 is never a pass.
- Baseline: use only the baseline file as it is on the default branch (`git show <default_branch>:<path> > "$TMP/baseline.json"`, then `--baseline "$TMP/baseline.json"`). Never pass a baseline path that doesn't exist: Schemathesis would record every failure into it and exit 0. Never run `--baseline-update` here.
- If the diff changes `schemathesis.toml` or the baseline file, the gate fails until a person accepts the change in `ledger.md`.
- Report each failure as `<METHOD> <path>: <check>`.

## 9 to 11. Explore, design, DX

One fresh read-only subagent, the explorer, runs these once gates 1 and 2 have passed (it may overlap gates 4 to 8, see [exploratory-qa.md](exploratory-qa.md#before-spawning)), with the prompt in [exploratory-qa.md](exploratory-qa.md#explorer-prompt). It starts its own app instance per `verify.md` and drives it beyond the happy path that gate 7 proved. For a library (`verify.md` surface `library`), gates 9 and 10 are `n/a (library)`; the explorer is spawned only when gate 11 applies, skips Launch and Doctor, and runs DX alone. All three are report-only: the explorer never edits, and its findings go to the report, not into the code.

| Gate | Procedure | Applies when | Fails when |
|---|---|---|---|
| 9 explore | [exploratory-qa.md](exploratory-qa.md) | the scope has a user-facing part and `verify.md` has a running surface | a confirmed critical or high finding that is `new` or `unknown` |
| 10 design | [design-review.md](design-review.md) | frontend in scope, a web UI, and a browser tool | a design finding breaks a flow (task can't be finished at a tested width, or by keyboard) |
| 11 DX | [devex-check.md](devex-check.md) | an API, CLI, SDK or its getting-started docs changed | a documented getting-started step or example for the changed surface fails on head, or a changed command or endpoint can't be called as documented |

Everything else they find is `should-fix` or `pre-existing`. Those go in the report's `## Findings` section and don't affect `Overall`. Pre-existing critical or high findings also get an issue draft ([qa-mode.md](qa-mode.md#issue-drafts)), listed under the report's Notes for the conductor to pass to `sf-triage`.

Take `wtree.sh` before spawning the explorer and again after its reply. Write one record per gate (`explore`, `design`, `dx`): `exit` 0 when the reply's line for that gate says `pass`, `wtree` set only when both fingerprints equal `W`, `log` pointing to that gate's `findings.md`. A reply line that says `error`, or a missing line for a gate that applies, is `error`.

## 12. Performance

Run by `sf-verify` itself after the explorer, following [performance.md](performance.md): the repo's benchmarks or budget on base and head, or, without them, page timing through the browser MCP for a web UI. Fails on a timing regression beyond the threshold (the project's or `quality.perf_threshold_pct`, else 10%, logged in `runs/<run-id>/decisions.md`), the base's spread and an absolute floor, or on a budget the repo set. Size and request count without a budget are reported, not judged. `n/a (no benchmarks or budget)` when neither the repo nor the web fallback gives anything to measure.

## Playwright healer

`sf-verify` never runs a healer: verifiers don't edit. When end-to-end tests fail only because locators changed, `sf-build` may use the Playwright healer agent under these limits, and this gate list checks them on the next verify:

- it may change locators only; never an `expect(` line, an expected value or a timeout
- it never adds `test.fixme`, `test.skip` or `.only` (floor-guard flags these)
- at most 3 heal attempts per test, then it reports the test as failing
- any healer diff that touches an `expect(` line is rejected (gate 4 finding `assertion-edited`)
