# Executor rules

Rules for whoever writes the code while a plan executes: you in inline mode, each implementer in subagent-driven mode. Two parts: what to do with work the plan never named, and how every commit is made.

## Deviation rules

While executing you will find work the plan does not name. Classify it, and act by its rule. Every deviation gets a ledger line: an implementer puts it in its report, and the controller ledgers it.

**Rules 1-3 are fixed without asking.** The shared process: fix it inline, add or update a test where one applies, verify the fix, continue the task, and record `[Rule <N> - <type>] <description>`.

**Rule 1: bugs.** Code does not work as intended: broken behavior, errors, incorrect output. Wrong queries, logic errors, type errors, null dereferences, broken validation, security vulnerabilities, race conditions, memory leaks.

**Rule 2: missing critical functionality.** Code lacks what correct, secure or performant operation requires: error handling, input validation, null checks, auth on protected routes, authorization, CSRF or CORS handling, rate limiting, needed database indexes, error logging. These are correctness requirements, not features. Security mitigations the plan or spec assigns to this task's files count here: when one is absent from the implementation, add it.

**Rule 3: blocking issues.** Something prevents completing the task: wrong types, broken imports, a missing environment variable, a database connection error, a build config error, a missing referenced file, a circular dependency.

A package install is never a Rule 3 fix. A package the plan did not name is not installed, and when a package the plan names fails to install or cannot be found, you install no similarly named alternative and retry no other name: a failed install may mean a hallucinated or typo-squatted package, and a substitute could be worse. Stop and ask (stop 2 in [SKILL.md](SKILL.md)), naming the package, the command and its error, and asking the user to confirm the package exists and is legitimate and its name is spelled right. An implementer reports this as BLOCKED.

**Rule 4: architectural changes. Stop and ask.** The fix needs a significant structural change: a new database table (a new column is Rules 1-2), a major schema change, a new service layer, switching libraries or frameworks, changing the auth approach, new infrastructure, a breaking API change. Report what you found, the proposed change, why it is needed, its impact, and the alternatives; the user decides. This is stop 4 in [SKILL.md](SKILL.md). An implementer reports it as BLOCKED.

**Priority.** Rule 4 applies → stop. Rules 1-3 apply → fix. Genuinely unsure → Rule 4. The test: does it affect correctness, security, or the ability to complete the task? Yes → Rules 1-3. Maybe → Rule 4. Missing validation is Rule 2; a crash on null is Rule 1; a new table is Rule 4; a new column is Rule 1 or 2 by context.

**Scope boundary.** Auto-fix only what the current task's changes caused. Pre-existing warnings, lint errors and failures in unrelated files are out of scope: record each as a `minor (deferred)` line, leave it unfixed, and move on; re-running builds in the hope they clear is not a fix.

**Attempt limit.** After three auto-fixes on one task, stop fixing: record the remaining issues as `Ruling:` lines, finish what the task can deliver, and continue to the next task. When the remaining issues block that task too, it is stop 4.

## Commit protocol

Commit as each task's commit steps say, through these steps:

1. **Guard.** Run `bash <folder of this file>/scripts/commit-check WORKTREE_ROOT`, with the root from the ledger's `Worktree:` line, or the working directory your dispatch names. It fails on cwd drift out of the worktree, a detached HEAD, or a default or protected branch. On a failure, fix the cause and re-run; never move a protected branch's ref by hand.
2. **Paths.** Every file you create or edit lies inside the worktree root. Prefer relative paths; an unavoidable absolute path is built from `git rev-parse --show-toplevel` run inside the worktree, never from an earlier `pwd` (an orchestrator's cwd resolves to the main repository and writes there silently). The one file written outside the worktree is the report file your dispatch names.
3. **Stage by name.** Check `git status --short`, then stage each task-related file individually. `git add .` and `git add -A` are never used: they sweep in other work and generated files.
4. **Message.** The plan's commit step gives the message; otherwise write a Conventional Commit, `<type>(<scope>): <summary>`, with a body only when the why is not obvious. Types: `feat` (new feature, endpoint, component), `fix` (bug fix), `test` (test-only change, as in a red step), `refactor` (no behavior change), `perf`, `docs`, `style` (formatting only), `chore` (config, tooling, dependencies).
5. **Record the hash.** `git rev-parse --short HEAD`, for the ledger or report.
6. **Deletions.** `git show --first-parent --diff-filter=D --name-only --pretty=format: HEAD` lists files the commit deleted. An intentional deletion is recorded in the ledger or report; an unexpected one is a Rule 1 bug: revert it and fix before going on.
7. **Untracked files.** `git status --short | grep '^??'` after running scripts or tools. Commit each new file that is intentional; add generated or runtime output to `.gitignore`. No generated file is left untracked.
