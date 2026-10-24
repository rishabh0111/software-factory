---
name: sf-setup
description: Configure this repository for the other skills (issue tracker, project commands, triage labels, docs layout, work docs, optional tools).
disable-model-invocation: true
---

# Setup

Write the per-repository configuration the other skills read. The user attends: work in **rounds**, one topic per round, each question carrying your **recommended answer** so the user can accept it in a word. Anything the repository can tell you is a **lookup**, not a question: read the remote, the manifests, the existing files, and ask only for choices.

Setup owns these outputs. Every one must exist and be filled when you finish:

| Output | Read by |
|---|---|
| `docs/agents/issue-tracker.md` | plan, triage, decision-map, code-review, implement, verify, ship |
| `docs/agents/triage-labels.md` | triage, plan |
| `docs/agents/domain.md` | glossary, architecture-review, debug, tdd, learn |
| `docs/agents/work-docs.md` | plan, execute, design, plan-review, code-review, ship, learn, debug, map-codebase |
| `docs/agents/tools.md` | qa, design, plan-review, doubt-check, benchmark, devex-review, ship |
| `## Agent skills` section in `CLAUDE.md` / `AGENTS.md` | every agent session |
| `## Testing` section in `CLAUDE.md` / `AGENTS.md` | ship, plan-review, qa, implement |

A re-run **updates in place**: read each output that already exists, keep what is still true, change only what this run decides, and replace a section under its own heading. One copy of each section, ever.

## 1. Survey

Gather the facts before the first question. Record each with its evidence:

- `git remote -v`: host of each remote (`github.com`, a `gitlab` host, `bitbucket.org`, other, none).
- CLIs and auth: `gh auth status`, `glab auth status`; for Bitbucket, whether `BITBUCKET_USER` and `BITBUCKET_TOKEN` are set.
- `CLAUDE.md` and `AGENTS.md` at the root: which exist, and whether they already hold `## Agent skills`, `## Testing` or `## Deploy Configuration`.
- `docs/agents/`: prior setup output.
- `.scratch/`: local tickets already in use.
- Manifests and task runners: `package.json` plus lockfile, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Makefile`, `justfile`, `Gemfile`, `composer.json`, `mix.exs`, Gradle or Maven files, `*.sln` / `*.csproj`, and the CI config (`.github/workflows/`, `.gitlab-ci.yml`, `bitbucket-pipelines.yml`), which shows the commands the team actually runs.
- Domain docs: `GLOSSARY.md`, `GLOSSARY-MAP.md`, any ADR folder (`docs/adr/`, `doc/adr/`, `docs/decisions/`, `src/*/docs/adr/`).
- Work docs: existing folders of specs, designs, plans, lessons or a codebase map (`docs/specs/`, `docs/designs/`, `docs/plans/`, `docs/solutions/`, `docs/codebase/`, or other folders holding dated spec or plan files).
- Monorepo signals: `pnpm-workspace.yaml`, a `workspaces` field, populated `packages/*` or `apps/*`.

Show the survey as a short table: found, missing, and on a re-run, what the current setup says.

## 2. Tracker round

Two facts, settled together: the **forge** (where code is hosted and pull or merge requests open) and the **tracker** (where tickets live). They usually match; a GitHub repository may still keep tickets local.

Recommend from the survey: a `github.com` remote or working `gh` → GitHub; a `gitlab` host or working `glab` → GitLab; `bitbucket.org` → Bitbucket; any other remote or none → plain git, with local files as the tracker. Offer the other trackers, plus **other** (Jira, Linear and the like): the user describes the workflow in a paragraph and you write the tracker doc from it, covering every operation the reference files define.

Write `docs/agents/issue-tracker.md` from the matching reference, filled with this repository's details (owner, project path or workspace):

- [tracker-github.md](tracker-github.md)
- [tracker-gitlab.md](tracker-gitlab.md)
- [tracker-bitbucket.md](tracker-bitbucket.md)
- [tracker-local.md](tracker-local.md)

Done when the doc names the forge and the tracker and gives a working instruction for every operation in its reference. On a forge, run the read-only list command once to prove access; a failure goes into the summary with the fix (log in, set the token).

## 3. Commands round

Find the test, single-test-file, lint, typecheck and build commands from the manifests, task runners and CI. Prefer the project's own entry point (`npm run test`, `make test`) over the raw tool, and use the package manager the lockfile names. A command with no evidence is recorded as `none`; it is never guessed.

Present each command with its source (`package.json` script `test`, CI step `lint`) and ask the user to confirm or correct the set in one answer.

Write a `## Testing` section in each instruction file chosen in step 7:

```markdown
## Testing

- Framework: <name and version, or none>
- Test: `<command>`
- Single test file: `<command with a path placeholder>`
- Lint: `<command or none>`
- Typecheck: `<command or none>`
- Build: `<command or none>`
```

When `## Testing` already exists, update these lines and keep every other line in it.

## 4. Labels round

Ask one question: keep the default label strings? Recommend **yes**, unless the forge already has labels that cover the same roles, in which case recommend mapping to those. List existing labels (`gh label list`, `glab label list`) before asking.

Write `docs/agents/triage-labels.md` and create missing labels on the forge as [labels.md](labels.md) describes. Done when every role in that file has a label string and, on GitHub or GitLab, every string exists on the forge.

## 5. Docs layout round

Recommend from the survey: an existing glossary or ADR folder is kept where it is; otherwise **single-context** (root `GLOSSARY.md`, `docs/adr/`), or **multi-context** when monorepo signals are present. Then ask whether to create empty stubs now; recommend **no**, since the glossary skill creates them the first time a term or decision is resolved.

Write `docs/agents/domain.md` and any agreed stubs as [docs-layout.md](docs-layout.md) describes.

In the same round, settle the **work docs** folders. Recommend the defaults in [work-docs.md](../../references/work-docs.md), except that an existing folder the survey found for a kind is kept where it is. Write `docs/agents/work-docs.md` from the template in [docs-layout.md](docs-layout.md). Done when it names one folder for every kind in that reference.

## 6. Tools round

Detect each optional tool in [tools.md](tools.md) with the check its section gives (`command -v`, `claude mcp list`, `.mcp.json`), and show what is present and what is missing. When the chrome-devtools MCP is missing, offer its install line and recommend **yes** when the repository has a web UI; run it only on yes. Write `docs/agents/tools.md` from the template at the end of tools.md. Done when every row records a tool or `none`.

## 7. Instruction file round

The target is every one of `CLAUDE.md` and `AGENTS.md` that exists. When neither exists, ask which to create and recommend `CLAUDE.md`, since deployment settings are kept there.

Write this section, replacing an existing `## Agent skills` section in place and leaving the rest of the file untouched:

```markdown
## Agent skills

- Issue tracker: <forge> forge, tickets in <tracker>. See `docs/agents/issue-tracker.md`.
- Triage labels: <default strings | mapped to existing labels>. See `docs/agents/triage-labels.md`.
- Domain docs: <single-context | multi-context>, ADRs in `<folder>`. See `docs/agents/domain.md`.
- Work docs: specs, designs, plans, lessons and the codebase map. See `docs/agents/work-docs.md`.
- Tools: <recorded tools, or none>. See `docs/agents/tools.md`.
- Commands: see `## Testing`.
```

Before writing anything, show the user the complete draft of every file this run changes, and apply their edits.

## 8. Deployment

When the survey found a deploy platform file or a deploy workflow and `CLAUDE.md` has no `## Deploy Configuration`, note in the report that `/sf-ship` setup-deploy records it, for the user to run after setup.

## 9. Check and report

Re-read every output in the table at the top. Setup is complete when each file exists, no placeholder is left in it, every tracker operation has a concrete instruction, and each instruction file has exactly one `## Agent skills` and one `## Testing` section.

Report the files written or updated, the forge and tracker, the commands recorded, and anything left for the user (a missing login, labels to create by hand). Point to `/sf-start` for what to run next.
