# software-factory

Agent skills that take software from an idea to a reviewed, verified, shipped change.

Website and guide: https://rishabh0111.github.io/software-factory/

## Start in three steps

Needs Claude Code 2.1.295 or later (the `sf-guard` skill hooks need it), and git.

```
/plugin install sf-core --marketplace rishabh0111/software-factory
/sf-setup
/sf-start
```

- `sf-core` installs `skills-core` from [rishabh0111/skills](https://github.com/rishabh0111/skills) with itself.
- `/sf-setup` runs once per repository. It records your issue tracker (GitHub, GitLab, Bitbucket or local files), your test and build commands, the labels, where docs and work documents live, and which optional tools are installed.
- `/sf-start` asks what you are working on and names the command to run next.

## How work flows

| You have | Run |
|---|---|
| A small fix | Ask for it. `sf-tdd`, `sf-debug` and `sf-verify` apply on their own |
| A bug | Describe the symptom; `sf-debug` builds a failing check before any fix |
| A new feature | `/sf-align` → `/sf-plan` → `/sf-execute` → `/sf-code-review` → `/sf-ship` |
| One ticket, no written plan | `/sf-implement`, then `/sf-code-review` and `/sf-ship` |
| A user interface | add `/sf-design` before `/sf-execute` and `/sf-qa` before `/sf-ship` |
| A big or unclear effort | `/sf-decision-map` → `/sf-plan` for a spec and tickets → `/sk-handoff` between sessions |
| An unfamiliar codebase | `/sf-map-codebase` writes a map of it under `docs/codebase/` |
| Finished work | `/sf-ship` opens the PR, lands it, deploys and watches production; `/sf-learn` runs a retro, captures a lesson or refreshes stale ones |
| A risky session | `/sf-guard` asks before destructive commands and can freeze edits to one folder or install git guardrails |
| A question about which skill fits | `/sf-ask` |

Three rules run through every skill:
- nothing is called done until a command's output shows it
- tests come first
- the code that was written is reviewed by an agent that did not write it

## Plugins

| Plugin | What it adds |
|---|---|
| `sf-core` | The whole path: start, setup, align, glossary, plan, plan-review, design, decision-map, execute, implement, incremental-build, tdd, debug, verify, doubt-check, source-check, code-review, respond-to-review, simplify-code, frontend-ui, module-design, architecture-review, prototype, qa, devex-review, benchmark, ship, release-docs, docs-and-adrs, worktrees, triage, learn, map-codebase, guard |
| `sf-reviewers` | Review agents: guideline reviewer, silent-failure hunter, test analyser, type-design analyser, comment analyser, code simplifier; `/sf-reviewers:review-pr` |
| `sf-security` | Security audit and build-time hardening |
| `sf-security-deep` | Differential review of risky changes (`/sf-security-deep:diff-review`) and variant analysis after a bug (CC-BY-SA-4.0) |
| `sf-ops` | CI/CD, migrations, observability, performance, constraints, incident response, deploy checklists |

Install the optional plugins per project:

```
/plugin install sf-reviewers --marketplace rishabh0111/software-factory
```

## Requirements by skill

- **`sf-qa`, `sf-benchmark`, `sf-devex-review`, `sf-design`** and **`sf-ship`'s browser checks** use a headless browser CLI when `/sf-setup` records one, otherwise the chrome-devtools MCP server.
- **`sf-design`** uses an image-generation tool when one is recorded, otherwise HTML mockups; **`sf-doubt-check`** and **`sf-plan-review`** use a second-model CLI when one is recorded, otherwise a fresh subagent. `/sf-setup` detects all of these.
- **`sf-ship`** uses `gh` for GitHub or `glab` for GitLab, matching your repository.
- **Scripts** need Bash (Git Bash on Windows).

## Add a skill

Create `plugins/<plugin>/skills/sf-<name>/SKILL.md` (`/sk-build-skill` helps you write and test it), then run `node scripts/build-site.mjs` to update the website's command sheet. The CI check fails if the site is out of date or a plugin does not validate.

## Also

- [agent-factory](https://github.com/rishabh0111/agent-factory): specialist agents for company work.
- [skills](https://github.com/rishabh0111/skills): general-purpose skills for thinking, writing and research.

## Licence

MIT. Some plugins include content under other licences. Each licence file sits beside the content it covers.
