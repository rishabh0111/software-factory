# Claude Code Tool Notes

Claude Code is the reference harness: skills speak its vocabulary
(`Agent` for a subagent dispatch, todos, `Skill`). These notes cover two
Claude Code specifics: a cheaper orchestration shape, opt-in by the user
and changing nothing the skills require, and the worktree isolation a
parallel batch needs.

## Cheaper orchestration for subagent-driven development

The controller session is the most expensive seat in a
subagent-driven `sf-execute` run: it reads every dispatch
result and every report, and it usually runs on the session's most
capable model. Claude Code supports nested subagents (three layers below
the main conversation by default; `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`
adjusts it), so the whole loop can run one layer down.

When the user asks for it — or has said the session model is
too expensive to spend on coordination — dispatch ONE orchestrator
subagent on a mid-tier model with the plan path and the instruction to
follow `sf-execute`'s [subagent-driven-development.md](../subagent-driven-development.md) end to end
(it cannot invoke `sf-execute` itself: the skill is user-invoked). The orchestrator
dispatches its own implementers and reviewers per that skill's Model
Selection; the workspace and ledger live on disk, so nothing is lost to
the extra layer. Its final message must carry the "Rulings I made" list
verbatim — that list is how the decisions reach the user, and
you relay it, not summarize it.

Do this only for a whole plan. Nesting a single task's dispatch buys
nothing and adds a seat.

## Isolated worktrees for a parallel batch

A parallel batch in subagent-driven mode needs one isolated worktree per
implementer. The `Agent` tool provides it: dispatch each implementer of
the batch with `isolation: "worktree"`, all in one message. Each child
works on its own branch in its own worktree; the branch name comes back
with the result, and that is the branch you review, fix-loop and merge.
Pass the child's worktree root as `[WORKTREE_ROOT]` only if you created
the worktree yourself; otherwise tell the implementer to use the root
`git rev-parse --show-toplevel` prints in its own working directory.
