# Setup questions: options and reasons

One section at a time, recommended answer first. Unattended, take the recommended answer, but a step that installs, signs in, writes hooks, changes agent or git config or protects a branch becomes `pending` (see SKILL.md, Unattended). The exception is repo-local `core.longpaths` on Windows (J), which unattended setup sets.

## A. Issue tracker

Where should issues and work items live?

- Recommend the forge the remote points at. A GitLab remote that isn't `gitlab.com` is self-managed: confirm the host, e.g. `gitlab.example.com` or `10.0.0.5:8929`. With no forge remote, recommend local files.
- Options: **GitHub Issues** (uses `gh`), **GitLab Issues** (uses `glab`, gitlab.com or self-managed), **Local files** (markdown under `.software-factory/issues/`, no forge, `signed_in: n/a`), **Other** (Jira, Linear…: ask for one paragraph on how they work and record it as written).
- Code hosting and issue tracking can differ (code on GitLab, issues in Jira). Ask only if the user hints at it.
- Explore found a local issue folder: recommend **Local files** with that folder as `local_dir`, unless the forge's tracker is clearly the live one.

**Triage labels.** Once the tracker can be read, list its labels. If some already mean a triage role under another name (`status: ready`, `bug:triage`, `blocked-on-reporter`), ask once whether to use them, proposing the mapping (recommended: yes), and record it under `tracker.labels`. On "use the defaults", leave the map empty: triage then creates the canonical labels when a person agrees. Unattended, leave the map empty: triage already matches the canonical names and its own accepted names (`sf-triage/references/tracker.md`, Labels) case-insensitively, so an entry is needed only for a label outside that table, and choosing one is a judgement for a person. List such candidate labels in the report.

## B. Browser checks

Only if the project has a web UI and no working browser MCP was found in Explore (see [browser-mcp.md](browser-mcp.md#already-available)). Recommend **Chrome DevTools MCP** so agents can open the app, click through it and read console errors. Alternative: **Playwright MCP**, if the project already uses Playwright. Otherwise, or if the user declines, skip it. Then ask whether to run it with a fresh temporary profile each session (`--isolated`, recommended: yes; see [browser-mcp.md](browser-mcp.md#isolated-profile)). Adding a server changes the agent's config: unattended, record `browser_mcp: pending` with the command from [browser-mcp.md](browser-mcp.md).

## C. Docker

Recommend **yes** if the project has a `Dockerfile` or compose file, its tests need services (databases, queues), or the user wants agents to run in containers. Otherwise recommend **skip for now**; re-running this skill adds it later.

## D. Project commands

Show the commands found (install, build, test, lint, typecheck, run, deploy). Ask for the app's local URL if it has a UI or an API; `unknown` is fine. The production URL and the deploy setup are section L. If the repo has prompt files, show the eval command found (`eval`), or ask for one; prompts with no eval runner are `unknown`, which later stages report as a gap whenever a prompt changes. Ask the user to confirm or correct them. Mark a command the project doesn't need (no install step in a stdlib-only project, no build for an interpreted one) as `none`, and any you couldn't find as `unknown`; don't invent them. `none` means "not needed"; `unknown` means nobody knows yet. The baseline (SKILL.md step 4) may later replace a red command with a narrower one, with the user's yes.

## E. Permissions

What may agents do without asking? Recommend: implement and open a PR/MR on their own; merge and deploy only after the user says so. Also: **comment** (tracker and PR/MR comments and labels, recommended `auto`; `manual` when the tracker is public and the user wants to read each one first) and **close** (closing tracker items, recommended `manual`). If merges will be automatic, ask for `limits.merge_soak_minutes`: how long the PR/MR head and its CI result must stay unchanged before the merge (recommended `0`; `30` or more for a busy repo). Each is `auto`, `manual` or `never`, set separately. When the deploy trigger is `on-merge`, say that merging deploys, so `merge: auto` only takes effect with `deploy: auto` too. On a re-run, skip the keys already set unless the user wants to change them; a policy key the config lacks (an upgrade from an older setup) is always asked, or defaulted unattended ([upgrade.md](upgrade.md)).

## F. Second opinion

If exploration found another agent CLI, recommend it as an independent reviewer (a different model family catches different mistakes). Otherwise record `none`.

## G. Protect the main branch

Recommend **yes**. Skills can only advise; this is the one setting that stops an agent's change from reaching the main branch without a merge request and passing CI. It needs admin or Maintainer rights. Skip the question if the tracker is local or the remote is neither GitHub nor GitLab. Commands: [protect-branch.md](protect-branch.md).

## H. Local gates

Skip if the repo has commit hooks. Offer a pre-commit hook running format, lint, typecheck and fast tests on staged files with the project's own tools: husky + lint-staged (JS/TS), `pre-commit` (Python), lefthook (other or mixed). Recommend **yes** when a lint, format or typecheck command is known, else **skip**. See [pre-commit.md](pre-commit.md).

## I. Agent guard

Offer the running agent's permission rules that block force-pushes, ask before `rm -rf`, `git reset --hard`, `git clean`, `DROP TABLE`, `kubectl delete` and similar, and keep edits in the repo where supported. Recommend **yes**, and say plainly it's best-effort: indirect commands get past it; branch protection (G) is the real lock. See [agent-guard.md](agent-guard.md).

## J. Long paths (Windows only)

Ask when `git config core.longpaths` isn't `true`. Recommend **yes**: `git config core.longpaths true` in this repo. Without it, git fails on paths over 260 characters ("Filename too long"), which deep worktrees, temp folders and `node_modules` reach; a rebase or checkout then fails before it starts and looks like a conflict, and `git rev-list` on a commit range can fail the same way. Record `code.longpaths: true`, or `false` on no.

Unattended, set it without asking: it is repo-local, changes nothing outside this clone, and later scripts depend on it. This is the one git setting unattended setup may change. Log it in `decisions.md`.

## K. CI

Ask when no CI job runs the test command on PRs/MRs. Recommend **yes**: a minimal job running the project's own commands, with every action or image pinned. Details and templates: [ci.md](ci.md#k-a-minimal-ci-job). Unattended: `code.ci: pending`.

## L. Deploy

Ask always; skip the questions detection settled. Record `deploy.trigger` (`on-merge`, `manual-command` or `none`), `deploy.platform`, `deploy.workflows`, `deploy.status` (a read-only status command), `deploy.health_url`, `app.production_url`, `app.staging_url` if there is one, and `app.errors_command` (a read-only way to list recent production errors, from the error tracker's CLI; `none` without one). Then dry-run them read-only and record `deploy.validated`. Recommended: what detection found; `none` for a library or CLI. Details: [deploy.md](deploy.md).

## M. Scanners

Ask when `gitleaks` or `osv-scanner` isn't installed. Recommend **yes** to pinned installs of both: they are deterministic checks on secrets and vulnerable dependencies that later stages run on every diff, next to the LLM reviewers. Record the ecosystem's advisory command too. Install commands: [tools.md](tools.md#scanners-section-m). Unattended: `pending` with the install command.

## N. Dependency updates

Ask when no Renovate or Dependabot config exists and the remote is on GitHub or GitLab. Recommend **Renovate**; Dependabot or skip are fine. See [ci.md](ci.md#n-dependency-updates).

## Quality bar and limits (optional)

Don't ask on a first run unless the user brings it up; the stages have defaults. When asked, or when the repo already states a bar (a mutation threshold in the Stryker or PIT config, a coverage floor in CI), record it under `quality:` (`mutation_threshold`, `perf_threshold_pct`, `changed_line_coverage`, each a percent with a one-line reason as a comment) and `limits.evidence_max_age_h` (default 24).
