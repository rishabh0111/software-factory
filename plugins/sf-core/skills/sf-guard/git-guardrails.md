# Git guardrails

The **git-guardrails** mode of [SKILL.md](SKILL.md): install a hook in the user's settings that blocks dangerous git commands in every session, whether or not `/sf-guard` is invoked. Where the session guard asks before a force-push, this hook refuses every push.

## What it blocks

- `git push` (every variant, `--force` included)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

A blocked command exits 2 with a `BLOCKED:` message on stderr telling the agent the user has prevented it. A payload the script cannot parse is blocked too. It parses with `jq`, `python3` or `node`, whichever works first.

## Steps

1. **Ask the scope**: this project only (`.claude/settings.json`) or all projects (`~/.claude/settings.json`).
2. **Copy the script** [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh) to `.claude/hooks/block-dangerous-git.sh` (project) or `~/.claude/hooks/block-dangerous-git.sh` (global).
3. **Add the hook** to the settings file for that scope, merging into an existing `hooks.PreToolUse` array and keeping every other setting. The command runs the script through `bash`, so it works without an executable bit.

   Project:

   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash|PowerShell",
           "hooks": [
             { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/block-dangerous-git.sh\"" }
           ]
         }
       ]
     }
   }
   ```

   Global: the same entry with `"command": "bash ~/.claude/hooks/block-dangerous-git.sh"`.
4. **Ask about the list**: offer to add or remove patterns, and edit the `DANGEROUS_PATTERNS` array in the copied script.
5. **Verify** both outcomes against the installed copy:

   ```bash
   echo '{"tool_input":{"command":"git push origin main"}}' | bash <installed-script>; echo "exit=$?"
   echo '{"tool_input":{"command":"git status"}}' | bash <installed-script>; echo "exit=$?"
   ```

   Done when the first prints `BLOCKED:` and `exit=2`, and the second prints `exit=0`.
