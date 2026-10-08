# Environment checks

Mistake classes say what an agent got wrong. These checks say what in the repo's environment made the run slower, costlier or blinder than it had to be. Each candidate becomes a proposal like a class does (step 6 of SKILL.md), with its evidence, and is never applied by sf-learn itself.

## Friction

From the session transcripts, ledger and state (see [evidence.md](evidence.md)):

| Category | Look for | Typical proposal |
|---|---|---|
| Navigation | a long search for one piece of information; a hidden dependency between files (a change in one needed a change in another nobody pointed to) | a one-line navigation pointer in the doc the agent opened first, or a check that the two files agree |
| Tool cost | an expensive or repeated tool call: huge outputs, a full test suite where one test would do, a token-heavy CLI or MCP server | a narrower command in `commands` or `verify.md`, a quieter flag, a cheaper tool |
| No-op instructions | lines in `CLAUDE.md`, `AGENTS.md`, `lessons.md` docs rules or skill prompts that the agent followed or ignored with no effect on what it did, or that repeat what a check already enforces | delete the line, or replace it with the check |
| Information access | a crucial fact the agent didn't have and had to guess or ask: server logs, a third-party service's state, production errors | tee dev-server logs to a file `verify.md` names; read-only access to the service; a documented command |

Rank them with the classes (step 8). One occurrence of friction is enough to report, since cost repeats every run; mark it `seen once`.

## Guardrails

- **No guardrail at all.** When neither CI (`code.ci` missing) nor a pre-commit hook runs `commands.lint`, `commands.typecheck` and `commands.test`, that is itself a finding, reported every learn run until fixed.
- **An existing check, unwired or broken.** Before proposing any new check, look for one the repo already has that covers the class: a lint rule turned off, a script in `package.json` or the build file that no CI job calls, a CI job that is skipped, `continue-on-error`, or fails silently. Wiring or fixing it is the proposal.

## Reviewer gaps

A class first caught after `sf-review` (by verify, CI, a person on the PR, or production) slipped past review. When no deterministic check can cover it, propose a line for the reviewer's brief (`CODING_STANDARDS.md` or the review standards source). When an existing reviewer rule is unclear or produced noise, propose clarifying or removing it.

## Steering files

`CLAUDE.md` and `AGENTS.md` load into every agent's context. When the repo's copies are large (past about 200 lines) or mostly rules, propose moving each mechanical rule into a check and each judgment rule into the coding standards, leaving navigation pointers. Propose only; the user's global files are out of scope.

## Contradictions

Two rules in `lessons.md` (or a rule and a standards line) that require opposite things: flag both for a person. Never pick one yourself.

## Feature flags

Flags past the expiry their owner set, or flags whose rollout finished and whose both branches are still in the code, are listed like expired exceptions: flagged for a person with file:line, never removed by sf-learn.
