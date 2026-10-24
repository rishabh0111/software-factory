---
name: sf-learn
description: Run a retrospective on a session, or capture and refresh lessons from finished work.
disable-model-invocation: true
argument-hint: "[retro|capture|refresh] [context or scope hint] [mode:non-interactive] [depth:lightweight|full]"
---

# Learn

Three jobs that make the next run better. Run the branch the user names; with no branch word, run **retro**.

| Branch | Invocation | Follow | Done when |
|---|---|---|---|
| **retro**: improve the agent's environment | `/sf-learn`, `/sf-learn retro [session]` | [retro.md](retro.md) | the improvement candidates are presented to the user, most severe first |
| **capture**: write one lesson from a solved problem | `/sf-learn capture [context]`, or "document what we learned" | [capture.md](capture.md) | one lesson is written or updated and validated, or nothing qualified and the report says why |
| **refresh**: prune and correct stale lessons | `/sf-learn refresh [scope]` | [refresh.md](refresh.md) | every lesson in scope has one outcome, the report is printed, and the changes are committed |

Strip the branch word before the branch file reads its arguments.

## Where lessons and terms go

- **The lessons folder** is the Lessons folder that [work-docs.md](../../references/work-docs.md) resolves for this repository (default `docs/solutions/`). Resolve it before the first read or write; `<lessons-dir>` below means that path.
- **The glossary** is the file `docs/agents/domain.md` names (a root `GLOSSARY.md` when that file is absent; in a multi-context repository, the glossary of the context the lesson touched), written in the format of [GLOSSARY-FORMAT.md](../sf-glossary/GLOSSARY-FORMAT.md).

## The lesson format

A lesson is one markdown file at `<lessons-dir>/<category>/<slug>.md` whose frontmatter carries the lookup keys, in the shape [references/lesson-format.md](references/lesson-format.md) defines. `sf-plan` and `sf-debug` read lessons back by searching that frontmatter, so `title` names the problem in one line, and `tags`, `module`, `component` and `symptoms` hold the words a later search for this problem would use.

## Flags

- `mode:non-interactive` (alias `mode:headless`), or a caller plainly asking for an unattended run: ask nothing in any phase, and end on the branch's terminal signal. Bare "automatically" invokes the skill and is no such signal. Without either, the run is interactive.
- `depth:lightweight` / `depth:full`: capture only, non-interactive only; [capture.md](capture.md) owns the rule.

Flags are not context: remove every `mode:` and `depth:` token before reading the remainder as the hint.

## Asking the user

Ask through the host's blocking question tool in the current tool list (match by capability; a listed but unloaded tool gets loaded through the host's tool-discovery primitive). Use numbered options in chat only when no such tool is listed or the call errors. Ask one question at a time, multiple choice where possible, recommended option first with a one-sentence reason. A question a branch calls for is always asked; in non-interactive mode the branch states what happens instead.

## Running the bundled scripts

Scripts live in this skill's `scripts/` folder. Shell state does not persist, so set both variables in every command block:

```bash
SKILL_DIR="<absolute path of this SKILL.md's folder>";
PY="$(for c in python3 python py; do command -v "$c" >/dev/null 2>&1 && "$c" -c '' >/dev/null 2>&1 && { echo "$c"; break; }; done)"; [ -n "$PY" ] || { echo "no working Python 3 interpreter on PATH" >&2; exit 1; };
"$PY" "$SKILL_DIR/scripts/<script>" <args>
```

When a script or a Python interpreter is missing, run the manual fallback the calling step gives and say in the report that it ran manually. A missing script is never a silent skip.

## Subagents

- Paste the contents of every skill-local file a subagent needs into its prompt: it resolves relative paths against the user's project, not this skill.
- Omit the `mode` parameter on every spawn, so the user's permission settings apply.
- Subagents write only to the per-run scratch folder or return text; the orchestrator (this context) writes every file in the repository.
- A rejected dispatch: correct a pre-launch argument error once, leave capacity-limited work queued, and when a launch still fails, do that role in this context with the same inputs and output path, and note the substitution in the report.

## Write boundary

This skill writes lessons, the glossary, refresh's commit, and in interactive runs only: one discoverability line in the project's instruction file (with consent) and a rule-pack rule plus its `packs.yaml` entry (when the user picks that destination). It never changes product code, and it never edits a skill, runbook or instruction file to settle a contradiction: it reports the contradiction.
