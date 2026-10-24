# Diff scope

Used by `sf-code-review` (step 4) and by `/sf-ship`'s **Open a PR** and **Land** branches. Classify the change into `SCOPE_*` flags from its file list. Collect every changed path once:

```bash
{ git diff "<base>...HEAD" --name-only; git diff HEAD --name-only; git ls-files --others --exclude-standard; } | sort -u
```

A base that does not resolve (`git rev-parse --verify -q "<base>^{commit}"` fails) is `SCOPE_ERROR=no_base`: run `git fetch origin <base>` and classify again. Changed files that match no rule below are `SCOPE_ERROR=unmatched`: unknown scope, never docs-only.

Match each path against every rule; a path can set several flags:

| Flag | Paths |
|---|---|
| `SCOPE_FRONTEND` | `*.css` `*.scss` `*.less` `*.sass` `*.pcss`, `*.tsx` `*.jsx` `*.vue` `*.svelte` `*.astro`, `*.erb` `*.haml` `*.slim` `*.hbs` `*.ejs`, `*.html`, `*.dart`, `tailwind.config.*` `postcss.config.*`, `app/views/*` `*/components/*` `styles/*` `css/*` `app/assets/stylesheets/*` |
| `SCOPE_PROMPTS` | `*prompt*` `*system_prompt*` `prompts/*` `*/prompts/*` `*.prompt.*`, `*evaluator*` `*scorer*` `*judge*` `*classifier*`, `evals/*` `*/evals/*` `test/evals/*`, `SKILL.md` `*/skills/*`, `*tool_definitions*` `*tools.json` |
| `SCOPE_TESTS` | `*.test.*` `*.spec.*` `*_test.*` `*_spec.*`, `test/*` `tests/*` `spec/*` `__tests__/*` `cypress/*` `e2e/*` |
| `SCOPE_DOCS` | `*.md` |
| `SCOPE_CONFIG` | `package.json` `package-lock.json` `yarn.lock` `bun.lock` `bun.lockb`, `Gemfile` `Gemfile.lock`, `*.yml` `*.yaml`, `.github/*`, `requirements.txt` `pyproject.toml` `go.mod` `Cargo.toml` `composer.json`, `pubspec.lock` |
| `SCOPE_MIGRATIONS` | `db/migrate/*` `migrations/*` `*/migrations/*` `alembic/*` `prisma/migrations/*`, `db/data/*` `data_migrations/*` `*/data_migrations/*` |
| `SCOPE_API` | `api/*` `*/api/*` `*controller*` `*route*` `*endpoint*`, `*.graphql` `*.gql` `openapi.*` `swagger.*` |
| `SCOPE_AUTH` | `*auth*` `*session*` `*jwt*` `*oauth*` `*permission*` `*role*` |
| `SCOPE_BACKEND` | not frontend and `*.rb` `*.py` `*.go` `*.rs` `*.java` `*.php` `*.ex` `*.exs` `*.ts` `*.js` `*.mjs` `*.cjs` `*.mts` `*.cts`; also `*.dart` |

Print the flags as `SCOPE_<NAME>=true|false` lines so later steps can quote them.
