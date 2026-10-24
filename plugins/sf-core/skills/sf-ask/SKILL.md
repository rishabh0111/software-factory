---
name: sf-ask
description: Ask which skill or flow fits your situation. A guide to every software-factory skill and when to use it.
disable-model-invocation: true
---

# Ask

The user doesn't remember every skill, so they ask. Answer with the flow and the one command to run next.

The summaries here are for orientation. Before you say what a skill does, or tell the user a step can be skipped, read that skill's `SKILL.md`. Every skill, with its one-line purpose and whether it runs on its own, is in [catalog.md](catalog.md).

A **flow** is a path through the skills. Most work travels the **main flow**; a few **on-ramps** merge onto it; the rest is **upkeep**, **standalone**, or **runs on its own** underneath everything.

## Before anything: setup

`/sf-setup` runs once per repository. It records the issue tracker, the project's commands, the labels, the docs layout, the work-docs folders and the optional tools that the other skills read. When `docs/agents/issue-tracker.md` is missing, recommend `/sf-setup` first, whatever the question.

## The main flow: idea → shipped change

1. **Agree what to build.**
   - In a repository, use `/sf-align`. It interviews in decision rounds and records the project's language in a glossary and decision records (ADRs), so the next session starts from them.
   - When the idea is still fuzzy, start with `/sk-brainstorming`: it finds out what is actually wanted, then hands over to the next step.
2. **A question that talk can't settle** (a state model, a UI you need to see): `sf-prototype` answers it with throwaway code. Use `/sk-handoff` to move into and out of the prototype's directory.
3. **Plan.** `/sf-plan` runs one branch per run:
   - **spec**: a spec on the tracker (what to build)
   - **tickets**: tracer-bullet tickets with blocking edges (how to slice it)
   - **implementation plan**: a task-by-task plan file with files, interfaces and test code (how to build one piece)

   For a single sitting, only the implementation plan is needed. For a UI or a risky plan, review it with `/sf-plan-review` (CEO/scope, engineering, design and developer-experience lenses) and design it with `/sf-design`.
4. **Build.**
   - A written implementation plan: `/sf-execute <plan path>`. It runs inline, or with a fresh implementer and reviewer per task.
   - One ticket or spec, with no written plan: `/sf-implement`, clearing context between tickets.

   Either way, `sf-tdd` drives each slice red then green, and `sf-verify` refuses "done" without fresh command output.
5. **Review.** `/sf-code-review` reviews the change on three axes (standards, the spec, quality), each run by a reviewer that did not write it. The other review entry points (the `sf-reviewers` aspect review, the security-deep differential review, responding to comments, `sf-doubt-check`) are in the [Which review is which](../sf-code-review/SKILL.md#which-review-is-which) table; read it before routing a review question.
6. **Test the running thing.** For a screen or an API, CLI, job or webhook, `/sf-qa`. For speed, `/sf-benchmark`. For a developer-facing product, `/sf-devex-review`.
7. **Ship.** `/sf-ship` picks a branch from what the user asks:
   - **open a PR**: release gates (tests, coverage, plan completion, pre-landing review, release prep), then push and open the PR or MR
   - **land**: merge an open PR, deploy it, or roll it back
   - **canary**: watch production after a deploy, or capture a baseline before one
   - **set up deploy**: record how this project deploys and how to check it
   - **finish without a PR**: merge into the base locally, or keep the branch for later
   - **App Store release**: TestFlight or the App Store

   `/sf-release-docs` brings the docs, changelog and TODOS in line after a release.
8. **Learn.** `/sf-learn` has three branches:
   - **retro** (the default): improvement candidates for the agent's environment from a session
   - **capture**: one lesson from a solved problem, only when a future person would repeat the mistake without it
   - **refresh**: prune and correct stale lessons

### Context hygiene

- **Keep steps 1–3 in one session** where you can: the plan builds on the alignment.
- **Start each ticket fresh.** The ticket carries what it needs.
- **Between sessions:** `/sk-handoff` hands the session to a fresh agent. A multi-session effort keeps its state on the tracker (the decision map, the spec and its tickets) and in the work docs, so the next session starts from them.
- **At a phase boundary** (alignment done, plan done, build done), decide in this order:
  1. **Continue** when the next phase needs what is in context.
  2. **Clear** when it needs none of it.
  3. **Hand off** when the next phase runs somewhere else: another directory, tool or person.
  4. **Subagent** for a scoped side task whose report is all you need.
  5. **Compact** for everything else.

## On-ramps

- **Something is broken.** `sf-debug` applies on its own: it builds one command that fails on this exact bug before any theory, then fixes with a regression test. Afterwards, `/sf-learn capture` records the lesson when one is worth keeping.
- **Issues are piling up.** `/sf-triage` turns raw reports and requests into agent-ready tickets, which `/sf-implement` picks up. Tickets that `/sf-plan` made are ready already; they skip triage.
- **Long work**, too big to align in one session: `/sf-decision-map` → `/sf-plan` → `/sk-handoff`. The decision map charts the open decisions on the tracker and resolves them one at a time; it ends in decisions, not code. When the map is clear, `/sf-plan` turns it into a spec and tickets on the tracker. `/sk-handoff` carries the work between sessions.
- **A screen that looks generic, or needs a design pass.** `/sf-design critique` scores what is built; `/sf-design refine` applies one move (polish, bolder, quieter, typeset and others); `/sf-design direction` art-directs a page or app screen from scratch. `sf-frontend-ui` holds the quality floor every UI edit meets, and applies on its own.
- **An unfamiliar codebase.** `/sf-map-codebase` maps it into seven reference docs (stack, integrations, architecture, structure, conventions, testing, concerns) in the codebase-map folder before you plan.
- **A risky session.** `/sf-guard` has four modes:
  - **freeze** (the default): asks before destructive commands and restricts edits to one folder
  - **careful**: destructive-command warnings only, no edit boundary
  - **unfreeze**: lifts the edit boundary
  - **git-guardrails**: installs a hook that blocks dangerous git commands in every session, not only this one

## Upkeep

- `/sf-architecture-review` surveys the codebase for modules worth deepening. Picking one becomes a new idea for step 1.
- `sf-module-design` is the vocabulary for shaping a module: depth, seams, interfaces.
- `sf-simplify-code`, `sf-incremental-build`, `sf-frontend-ui`, `sf-docs-and-adrs`, `sf-doubt-check` and `sf-source-check` apply on their own when their situation comes up. [catalog.md](catalog.md) says when.

## Runs on its own underneath

`sf-tdd`, `sf-debug`, `sf-verify`, `sf-code-review`, `sf-glossary` and the others marked "on its own" in [catalog.md](catalog.md) load when their situation arises. The user never has to type them, but can.

## Optional plugins

When one of these fits, name it with its install line, `/plugin install <plugin> --marketplace rishabh0111/software-factory`:

- `sf-reviewers`: specialist review agents (`guideline-reviewer`, `silent-failure-hunter`, `pr-test-analyzer`, `type-design-analyzer`, `comment-analyzer`, `code-simplifier`) and `/sf-reviewers:review-pr` to run them
- `sf-security`: audit and hardening
- `sf-security-deep`: risky-diff review (`/sf-security-deep:diff-review`) and variant hunting
- `sf-ops`: CI/CD, migrations, observability, performance, incidents

## Elsewhere

- **Company work** (sales, support, finance, legal, HR, marketing and more): `/af-ask`, from agent-factory.
- **General thinking, writing and research** (`/sk-stress-test`, `/sk-research`, `/sk-writing` and more): `/sk-ask`.

## Reply

- **Flow:** where the user is on the map, in one line.
- **Run:** the command, with its argument.
- **Then:** the next one or two steps.
