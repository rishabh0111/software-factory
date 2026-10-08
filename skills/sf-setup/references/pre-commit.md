# Local gates: pre-commit hooks

A pre-commit hook runs the project's format, lint, typecheck and fast tests before each commit, so an agent's commit fails in seconds instead of in CI minutes later. It's a convenience, not a lock: anyone can skip it with `git commit --no-verify`, and it runs only where it's installed. CI and branch protection stay the real gate. sf-build never skips hooks.

Show every command and file before running or writing it, and act only on the user's yes. Unattended, write no hooks: record `pre_commit: pending`.

## 1. Is there one already?

Any of these means the repo has hooks. Record `tools.pre_commit: existing` and don't add another:

- `.husky/` folder, or `husky`, `simple-git-hooks` or `lint-staged` in `package.json`
- `.pre-commit-config.yaml`
- `lefthook.yml`, `lefthook.yaml`, `.lefthook.yml` or `lefthook-local.yml`
- `git config core.hooksPath` prints a path
- an executable `.git/hooks/pre-commit` that isn't a `.sample`

## 2. What to recommend

- **Recommend yes** when at least one of `commands.lint`, `commands.typecheck` or a format command is known. Without any of them a hook has nothing useful to run: recommend skip.
- **Use only the repo's own tools.** Run the formatter, linter, type checker and test runner the project already has, at the versions its lockfile pins. Don't add a new formatter or linter config as part of this; that's a separate decision for the user.
- **Keep it fast.** Format and lint only the staged files. Typecheck the whole project (types cross files), but drop it from the hook if it takes more than about 20 seconds. Tests: only a fast subset (unit tests, or the runner's changed-files mode such as `vitest run --changed` or `jest --onlyChanged`). If no fast subset exists, leave tests to CI and sf-verify. Offer the slow parts as a `pre-push` hook instead.

Which tool:

| Project | Tool |
|---|---|
| JavaScript or TypeScript (`package.json`) | husky + lint-staged |
| Python, no `package.json` | `pre-commit` |
| Other languages, or several | lefthook (one binary, any language) |

The user may prefer another; take their choice.

## 3. Pin versions

Look up the current release, show it, and pin that exact version. Never use `latest`, a range or an unpinned `rev`.

- npm: `npm view husky version`, `npm view lint-staged version`, then install with `--save-exact`.
- pre-commit: add `pre-commit==<version>` to the project's dev dependencies (or install with `pipx install pre-commit==<version>`). For remote hook repos, `rev:` is a tag; `pre-commit autoupdate --freeze` replaces tags with commit SHAs.
- lefthook: as a pinned dev dependency (`npm install -D --save-exact lefthook@<version>`, or `go install github.com/evilmartians/lefthook@v<version>`), or the OS package with its version recorded.

## 4. Set it up

Replace `<…>` with the repo's real commands. Leave out any line whose command is `none` or `unknown`, and tell the user which.

### husky + lint-staged

Use the repo's package manager as its lockfile shows: bun for `bun.lock` or `bun.lockb`, yarn for `yarn.lock`, pnpm for `pnpm-lock.yaml`, npm for `package-lock.json`. No lockfile, or several: use npm (or the `packageManager` field in `package.json` if set) and say which you chose.

```sh
npm install -D --save-exact husky@<version> lint-staged@<version>
npx husky init        # creates .husky/pre-commit and adds "prepare": "husky" to package.json
```

`.husky/pre-commit` (husky 9 needs no shebang):

```sh
npx lint-staged
<typecheck command, e.g. npm run typecheck>
<fast test command, if there is one>
```

Replace `npx` with `pnpm exec`, `yarn` or `bunx` to match the package manager.

`.lintstagedrc.json`, using the tools the repo already has:

```json
{
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["<linter> --fix", "<formatter> --write"],
  "*.{json,md,css,scss,yml,yaml}": "<formatter> --write"
}
```

lint-staged re-stages the files its commands fix.

### pre-commit (Python)

Local hooks call the project's own commands, so the project's lockfile pins their versions:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: format
        name: format
        entry: <format command, e.g. ruff format>
        language: system
        types: [python]
      - id: lint
        name: lint
        entry: <lint command, e.g. ruff check --fix>
        language: system
        types: [python]
      - id: typecheck
        name: typecheck
        entry: <typecheck command, e.g. mypy .>
        language: system
        pass_filenames: false
        types: [python]
      - id: fast-tests
        name: fast tests
        entry: <fast test command>
        language: system
        pass_filenames: false
        types: [python]
```

Then `pre-commit install`.

### lefthook

```yaml
# lefthook.yml
pre-commit:
  commands:
    format:
      glob: "<pattern, e.g. *.go>"
      run: <format command> {staged_files}
      stage_fixed: true
    lint:
      glob: "<pattern>"
      run: <lint command> {staged_files}
    typecheck:
      run: <typecheck command>
    fast-tests:
      run: <fast test command>
```

Then `lefthook install`.

## 5. Check it works

Run the hook once on the current staged files, without committing:

- husky: `npx lint-staged`, then each other line of `.husky/pre-commit`
- pre-commit: `pre-commit run` (staged files only; `--all-files` would reformat the whole repo, so ask first)
- lefthook: `lefthook run pre-commit`

Then check the hook will actually run, since git skips a hook it can't execute without a word:

- husky: `.husky/pre-commit` exists, `package.json` has `"prepare": "husky"` (so a fresh clone installs it on `npm install`), and `git config core.hooksPath` prints `.husky/_`. On macOS and Linux the file is executable (`test -x .husky/pre-commit`); if not, `chmod +x` it and record the mode with `git update-index --chmod=+x .husky/pre-commit`.
- pre-commit and lefthook: `.git/hooks/pre-commit` exists and is executable.

If it fails on code that was already there, show the output. The user decides whether to fix that first or drop the failing step.

## Secret scan

When `gitleaks` is installed (or being installed, section M), offer a secret-scan step in the same hook (recommended: yes). It scans only what is about to be committed: `gitleaks git --pre-commit --staged --redact --no-banner` (gitleaks 8.19 and later; older versions: `gitleaks protect --staged --redact`). Add it as the first line of `.husky/pre-commit`, a `local` hook with `pass_filenames: false` in `.pre-commit-config.yaml`, or a `secrets:` command in `lefthook.yml`. When the repo already has hooks, offer it as one added step and show the change. `--redact` keeps the secret's value out of the output. A hit stops the commit; the fix is to remove the secret and rotate it, never `--no-verify`.

## Record

Record `tools.pre_commit` in config and list the new files in the report. These files are hook config: sf-build treats changes to them as protected paths. Suggest committing them; don't commit unless the user asks.
