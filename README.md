# software-factory

Hand your coding agent an idea, an issue or a failing build, and get back a reviewed, verified pull request, ready for you to merge.

software-factory is a set of agent skills that runs the whole path from idea to production: spec, plan, build, verify, review, merge and deploy. Every stage has to show evidence before the next one starts, and nothing reaches your main branch without your yes.

## Why

Coding agents write code fast. Trusting it is the slow part. Agent-written tests often check too little, agents learn to pass the tests they can see, and a green build doesn't mean the change is right. software-factory is built around that problem:

- **Hidden acceptance tests.** Scenarios are written from the spec before any code exists and kept where the builder can't see them, so passing them means the behaviour is really there.
- **Tamper checks.** Skipped tests, weakened assertions and silenced linters are caught in the diff, and mutation testing checks that tests actually catch bugs.
- **Evidence tied to the exact code.** Test runs and reviews are bound to a fingerprint of the code; change one line and they go stale.
- **Reviewers who didn't write it.** Read-only reviewers check the spec and the standards separately, with a second model when one is available.
- **Merges only through your forge.** The verified commit is merged by GitHub or GitLab, with CI green, after a person says yes.

## Install

Any agent that supports Agent Skills (Claude Code, Codex, OpenCode, Cursor and others):

```
npx skills@latest add rishabh0111/software-factory
```

Claude Code, as a plugin:

```
/plugin marketplace add rishabh0111/software-factory
/plugin install software-factory@software-factory
```

## Use

Run setup once per repo (in Claude Code: `/sf-setup`). It asks where your issues live and installs only what that needs: `gh` or `glab`, a browser for UI checks, Docker if the project uses it. It records your project's commands and what agents may do without asking, and offers to protect your main branch.

Then hand it work:

```
/software-factory add CSV export to the reports page
/software-factory #142
/software-factory fix the failing CI on main
/software-factory plan a move from REST to GraphQL      # too big for one session: charts the decisions first
/software-factory QA the checkout flow                    # finds bugs, drafts issues
/software-factory audit security                          # finds vulnerabilities, drafts private issues
/software-factory improve the architecture of src/billing
/software-factory resume
```

It works out the kind of work and takes the matching path. A new feature goes through spec, plan, build and the rest. A failing build starts from the failing command. A one-line fix skips the planning. Say "run unattended" and it takes the recommended answer at each question, logs it, and stops only where a person must decide.

## The skills

| Skill | What it does |
|---|---|
| `software-factory` | The entry point. Picks the path, runs the stages in order, checks each one's evidence, resumes stopped runs |
| `sf-setup` | One-time setup per repo; upgrades older setups |
| `sf-wayfind` | For efforts too big for one session: a map of decisions on your tracker, resolved one at a time, ending in a spec |
| `sf-triage` | Decides whether an issue is clear and reproducible enough for an agent; dedupes; records rejections |
| `sf-spec` | Questions you until nothing is assumed, keeps a glossary and decision records, and writes a spec with stable IDs |
| `sf-holdout` | Writes the hidden acceptance tests from the spec, before any code |
| `sf-plan` | Splits the spec into small dependent tickets, plans each one, and has a second reviewer check the plans |
| `sf-debug` | Reproduces a bug with one failing command before anyone fixes it |
| `sf-build` | Builds one ticket at a time, tests first, smallest change |
| `sf-verify` | Runs every gate, checks for weakened tests, runs the hidden tests, explores the real app, and ties the evidence to the code |
| `sf-review` | Read-only review by agents that didn't write the code; also runs security audits and architecture scans |
| `sf-ship` | Updates docs, opens the PR/MR, watches CI, answers review comments, merges only the verified commit, deploys and checks |
| `sf-learn` | Turns repeated mistakes into lint rules or tests, and checks that fixed bugs stay fixed |

## Principles

- **Easy to set up.** Skills only. Setup installs what a repo needs, when it needs it.
- **Evidence, not claims.** A stage is done when a command's output shows it, not when an agent says so.
- **Runs where you are.** GitHub or GitLab, hosted or self-managed; any agent that reads skills.
- **Safe by default.** Merging and deploying need a person's yes unless you change that. Setup offers to switch on your forge's branch protection, so changes reach the main branch only through a merge request whose CI passed.

## Status

Early. Tried end to end on trial projects, through to a merge-ready pull request; not yet on a large production codebase or on GitLab. Feedback and issues are welcome.

## Licence

MIT, see [LICENSE](LICENSE).
