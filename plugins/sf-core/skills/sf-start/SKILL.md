---
name: sf-start
description: Start here. Asks what you are working on and tells you which skill to run next.
disable-model-invocation: true
---

# Start

Find the user's situation, then name the one command to run next and why. Recommend a single path; mention an alternative only when the choice is close.

**A question about a specific skill or flow** ("which skill reviews a PR?", "when do I use decision-map?"): hand it to `/sf-ask`, the full guide to every skill.

## 1. First run in this repository

When `docs/agents/issue-tracker.md` is missing, the repository is not set up. Say so, and recommend `/sf-setup` before anything else: it records the issue tracker, the project's commands, the labels, the docs layout, the work-docs folders and the optional tools that the other skills read.

## 2. Ask what they are doing

When the user already said, skip the question. Otherwise ask one question with these options, recommending the one that fits what you can see (the branch, open changes, recent commits, the work-docs folders):

1. A small fix or tweak
2. A bug: something broken, failing or slow
3. A new feature
4. A big or unclear effort that will take several sessions
5. Review, test or ship work that is already written
6. Picking up where I left off
7. Company work: sales, support, finance, legal, HR, marketing, operations, data, design, product
8. Thinking something through: an idea, a decision, a piece of writing

## 3. Route

| Situation | Run | Then |
|---|---|---|
| Small fix | Ask for the change directly | `sf-tdd`, `sf-debug` and `sf-verify` apply on their own |
| Bug | Describe the symptom | `sf-debug` builds a failing check before any fix |
| New feature, idea still fuzzy | `/sk-brainstorming` | `/sf-plan` |
| New feature, idea clear | `/sf-align` | `/sf-plan` (implementation plan) → `/sf-execute` → `/sf-code-review` → `/sf-ship` |
| Feature with a user interface | the feature path | add `/sf-design` before `/sf-execute`, and `/sf-qa` before `/sf-ship` |
| Big or unclear effort | `/sf-decision-map` (many open decisions) | `/sf-plan` (spec, then tickets on the tracker) → `/sk-handoff` between sessions; the tracker and the docs hold the state |
| Unfamiliar codebase | `/sf-map-codebase` | then the path that fits the work |
| A ticket from the tracker | `/sf-triage` when it is unclear; otherwise `/sf-implement` (one ticket, no written plan) | `/sf-code-review` → `/sf-ship` |
| A written implementation plan | `/sf-execute <plan path>` | `/sf-ship` |
| Review written work | `/sf-code-review` | its **Which review is which** table names the other review entry points; `/sf-respond-to-review` for comments from others |
| Test a running app | `/sf-qa` | `/sf-benchmark` for speed, `/sf-devex-review` for developer experience |
| Ship | `/sf-ship` (open a PR, land, canary, set up deploy, or finish without a PR) | `/sf-release-docs` after a release, `/sf-learn` after the work |
| Learn from finished work | `/sf-learn` (retro by default; `capture` for one lesson, `refresh` to prune stale ones) | |
| Pick up again | the open tickets on the tracker, or the latest plan in the plans folder | `/sk-handoff` before stopping |
| Risky session | `/sf-guard` (freeze by default; `careful`, `unfreeze` or `git-guardrails`) | asks before destructive commands; freeze also limits edits to one folder |
| Company work | ask for the specialist: "have the legal specialist review this NDA" | needs the agent-factory department plugin; specialists read `company.md` first |
| Thinking it through | `/sk-stress-test` for a plan or decision, `/sk-brainstorming` for an idea, `/sk-research` for a question | `/sk-handoff` passes the session to a fresh agent |

## 4. Reply

End with exactly this:

- **Run:** the command, with a one-line argument if it needs one
- **Why:** one sentence tied to what the user said
- **After that:** the next one or two steps from the table

Done when the user has one command to run.
