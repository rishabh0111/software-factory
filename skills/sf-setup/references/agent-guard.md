# Agent guard: destructive commands and edit scope

Permission rules in the agent's own config that block, or ask before, commands that destroy work or data, and optionally keep file edits inside the repo.

Be plain with the user about what this is. These rules match the command text the agent writes. They stop the usual form of a command, not every way to run it: `bash -c 'rm -rf x'`, `/bin/rm`, a script that deletes files, `git -C . push --force`, an alias or a `+branch` refspec can all get past them. They catch mistakes, not a determined bypass. The real lock is branch protection on the forge (question G), plus backups for data. For OS-level limits on what shell commands can touch, the agent's sandbox, where it has one, is stronger than any rule list.

Show the exact file change before writing, merge with what's already there (never drop the user's existing rules), and write only on a yes. Unattended, change nothing: record `agent_guard: pending`.

## The list

Chosen so the software-factory skills' own commands still run: sf-ship's `git push --force-with-lease` on its own branch, and the temporary `git worktree remove --force` other skills use on their throwaway copies.

| Command | Rule | Why |
|---|---|---|
| `git push --force` / `-f`, `git push origin +<branch>` | deny | Rewrites shared history. sf-ship only ever needs `--force-with-lease` |
| `git reset --hard` | ask | Drops uncommitted work |
| `git clean` (any flags) | ask | Deletes untracked files for good |
| `git checkout .`, `git restore .` | ask | Drops uncommitted changes |
| `git branch -D` | ask | Deletes an unmerged branch |
| `rm -rf`, `rm -fr`, `rm -r`, `rm -R` | ask | Recursive delete |
| `DROP TABLE`, `DROP DATABASE`, `TRUNCATE` in a command | ask | Data loss. Only catches SQL written on the command line, not in a file |
| `kubectl delete`, `helm uninstall`, `terraform destroy`, `docker system prune` | ask | Removes running or stored infrastructure |

"ask" means a person approves each one. In an unattended run nobody can approve, so an ask acts as a block. That's intended. If a skill's cleanup step hits one (removing a temporary copy), the folder is left behind, which is harmless.

## Claude Code

Syntax checked against code.claude.com/docs/en/permissions on 2026-10-07. Re-check that page if Claude Code warns about a rule at startup.

Write to `.claude/settings.json` in the repo (shared with the team; recommend this) or `.claude/settings.local.json` (this user only). Rules are checked deny first, then ask, then allow; an allow rule can't carve an exception out of a deny or ask rule. A `*` matches any text; a trailing ` *` also matches the bare command. Deny and ask rules apply to each part of a compound command (`a && b`, pipes, subshells).

```json
{
  "permissions": {
    "deny": [
      "Bash(git push --force *)",
      "Bash(git push -f *)",
      "Bash(git push * --force)",
      "Bash(git push * --force *)",
      "Bash(git push * -f)",
      "Bash(git push * -f *)",
      "Bash(git push * +*)"
    ],
    "ask": [
      "Bash(git reset --hard *)",
      "Bash(git clean *)",
      "Bash(git checkout .)",
      "Bash(git restore .)",
      "Bash(git branch -D *)",
      "Bash(rm -rf *)",
      "Bash(rm -fr *)",
      "Bash(rm -r *)",
      "Bash(rm -R *)",
      "Bash(rm -Rf *)",
      "Bash(*DROP TABLE*)",
      "Bash(*drop table*)",
      "Bash(*DROP DATABASE*)",
      "Bash(*drop database*)",
      "Bash(*TRUNCATE *)",
      "Bash(*truncate *)",
      "Bash(kubectl delete *)",
      "Bash(helm uninstall *)",
      "Bash(terraform destroy *)",
      "Bash(docker system prune *)"
    ]
  }
}
```

`--force-with-lease` isn't matched: the rules need a space or the end of the command right after `--force`. On native Windows, where the agent may use PowerShell, add `"PowerShell(Remove-Item * -Recurse*)"` to `ask`; PowerShell rules also match aliases such as `rm` and `del`.

**Keeping edits in the repo.** Claude Code's file tools already need approval to edit outside the working directory in its default and `acceptEdits` modes (in `auto` mode a classifier decides instead). The rule syntax can't say "deny everything except this folder", so the recommendation is:

- keep that default, and don't run this repo in `bypassPermissions` mode; to rule it out, add `"disableBypassPermissionsMode": "disable"` inside `permissions`;
- optionally deny edits to the files that matter most outside the repo, for example `"Edit(~/.ssh/**)"`, `"Edit(~/.gitconfig)"`, `"Edit(~/.bashrc)"`, `"Edit(~/.zshrc)"`, `"Edit(~/.claude/settings.json)"` in `deny`;
- for shell commands, the sandbox (`"sandbox": {"enabled": true}`) limits writes to the working directory at OS level. It runs on macOS, Linux and WSL2, not native Windows, and it doesn't cover the file tools, which the rules above handle.

Afterwards the user restarts Claude Code and checks the rules with `/permissions`.

## OpenCode

Syntax from OpenCode's permissions docs (read 2026-10-07; re-check at opencode.ai/docs/permissions). In `opencode.json`, inside `"permission"`, the last matching rule wins, so keep the user's catch-all `"*"` first and add these after it:

```json
{
  "permission": {
    "bash": {
      "*": "<keep the user's existing value>",
      "git push --force*": "deny",
      "git push -f*": "deny",
      "git push * --force": "deny",
      "git push * --force *": "deny",
      "git reset --hard*": "ask",
      "git clean *": "ask",
      "git branch -D *": "ask",
      "rm -rf *": "ask",
      "rm -r *": "ask",
      "kubectl delete *": "ask",
      "terraform destroy*": "ask"
    },
    "external_directory": "ask"
  }
}
```

`git push --force*` also matches `--force-with-lease`; if sf-ship runs under OpenCode, use `"git push --force *"` and `"git push --force"` instead. `external_directory` already defaults to `ask`; set it to `"deny"` to keep every tool inside the folder OpenCode started in.

## Codex

Mark this `to check` and confirm against the current Codex docs (developers.openai.com/codex) before writing. As of the Codex source read on 2026-10-07:

- `sandbox_mode = "workspace-write"` in `~/.codex/config.toml` limits writes to the workspace at OS level, and `approval_policy = "on-request"` keeps approvals on.
- Command rules are Starlark files in a `rules/` folder of the Codex config (for example `~/.codex/rules/default.rules`):

  ```starlark
  prefix_rule(pattern = ["git", "push", ["--force", "-f"]], decision = "forbidden",
              justification = "Use --force-with-lease on your own branch.")
  prefix_rule(pattern = ["git", "reset", "--hard"], decision = "prompt")
  prefix_rule(pattern = ["git", "clean"], decision = "prompt")
  prefix_rule(pattern = ["rm", ["-rf", "-fr", "-r", "-R"]], decision = "prompt")
  ```

  These match leading tokens only, so `git push origin --force` isn't caught.

## Other agents

If the agent has its own allow and deny list for shell commands (Cursor and others do, in their settings), mirror the table above in it. If it has none, recommend the user keep approvals on for shell commands in this repo and avoid auto-run modes. Record `tools.agent_guard: manual`.

## Record

Set `tools.agent_guard` in config to the agent whose rules you wrote (`claude-code`, `opencode`, `codex`), `manual`, or `none`, and list the file changed in the report. `.claude/`, `opencode.json` and `.codex/` are agent config: sf-build treats changes to them as protected paths, and sf-ship won't merge one without a person's yes.
