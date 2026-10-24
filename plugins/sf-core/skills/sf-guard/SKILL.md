---
name: sf-guard
description: Safety mode for the session. Warns before destructive commands, restricts edits to one directory, and installs persistent git guardrails.
disable-model-invocation: true
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: bash
          args: ["${CLAUDE_PLUGIN_ROOT}/skills/sf-guard/bin/check-careful.sh"]
          onFailure: block
          statusMessage: "Checking for destructive commands..."
    - matcher: "PowerShell"
      hooks:
        - type: command
          command: bash
          args: ["${CLAUDE_PLUGIN_ROOT}/skills/sf-guard/bin/check-careful.sh"]
          onFailure: block
          statusMessage: "Checking for destructive commands..."
    - matcher: "Edit"
      hooks:
        - type: command
          command: bash
          args: ["${CLAUDE_PLUGIN_ROOT}/skills/sf-guard/bin/check-freeze.sh"]
          onFailure: block
          statusMessage: "Checking freeze boundary..."
    - matcher: "Write"
      hooks:
        - type: command
          command: bash
          args: ["${CLAUDE_PLUGIN_ROOT}/skills/sf-guard/bin/check-freeze.sh"]
          onFailure: block
          statusMessage: "Checking freeze boundary..."
    - matcher: "NotebookEdit"
      hooks:
        - type: command
          command: bash
          args: ["${CLAUDE_PLUGIN_ROOT}/skills/sf-guard/bin/check-freeze.sh"]
          onFailure: block
          statusMessage: "Checking freeze boundary..."
---
# Guard

Session safety. Invoking this skill registers two hooks for the rest of the session (see the frontmatter):

- the **destructive-command check** (`bin/check-careful.sh`) on every Bash and PowerShell call: it asks before a destructive command and denies two catastrophic ones;
- the **edit boundary** check (`bin/check-freeze.sh`) on every Edit, Write and NotebookEdit: while a boundary is set, it denies any edit outside it.

This skill's folder is `${CLAUDE_SKILL_DIR}`; the hook scripts sit in its `bin/`. Their state (the boundary, project patterns) lives in `.claude/guard/` under the project.

## Pick the mode

| The user asked for | Mode |
|---|---|
| `/sf-guard`, `/sf-guard freeze`, or edits restricted to one folder | **freeze** |
| `/sf-guard careful`, or warnings only with no edit boundary | **careful** |
| `/sf-guard unfreeze`, or edits unlocked | **unfreeze** |
| `/sf-guard git-guardrails`, or git push / reset blocked in every session, not only this one | **git-guardrails**: follow [git-guardrails.md](git-guardrails.md) |

The destructive-command check runs in every mode, because invoking the skill registers it. The mode is done when its last step below has been reported to the user.

## careful

1. Set nothing: with no boundary set, the edit-boundary hook allows every edit.
2. Tell the user: "**Careful mode active.** Destructive commands (rm -rf, DROP TABLE, force-push, git reset --hard and the rest) ask before running, and you can approve them; recursive delete of `/` or `~` and force-push to the default branch are denied. The check ends with the session."

## freeze

1. Get the directory. Use the path the user gave with the command; otherwise ask with AskUserQuestion as free text (not multiple choice): "Which directory should edits be restricted to? Edits outside it will be blocked."
2. Set the boundary with the state writer, which resolves the physical absolute path and holds a lock while it writes:
   ```bash
   CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR}" bash "${CLAUDE_SKILL_DIR}/bin/freeze-state.sh" set "<user-provided-path>"
   ```
3. Read the result. Success prints `FREEZE_DIR=<path>`: report that path. Any `FREEZE_BUSY`, `FREEZE_PRESERVED` or `FREEZE_ERROR` line means **no boundary changed**: show the user the message, leave `.claude/guard/` as it is, and retry once the other writer has finished or inspect the state together. Every change to the boundary goes through `freeze-state.sh`, since its lock is what keeps two writers from corrupting the state file.
4. On success, tell the user: "**Guard mode active.** Destructive commands ask before running (two catastrophic shapes are denied), and Edit, Write and NotebookEdit are restricted to `<FREEZE_DIR>/`. Run `/sf-guard` again to move the boundary, `/sf-guard unfreeze` to remove it. Ending the session stops the hooks but keeps the boundary file, which applies again the next time `/sf-guard` is invoked."

## unfreeze

1. Clear the boundary:
   ```bash
   CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR}" bash "${CLAUDE_SKILL_DIR}/bin/freeze-state.sh" clear
   ```
2. `FREEZE_CLEARED` means done. On `FREEZE_BUSY` or `FREEZE_PRESERVED`, leave the state and the lock directory untouched and report the message, as in freeze step 3.
3. Tell the user the edit boundary is gone and that the hooks stay registered for this session (the boundary check now allows every edit, the destructive-command check keeps running). `/sf-guard` sets a new boundary.

## What the hooks guard

Both hooks are tripwires against accidents, not a security boundary. The destructive-command check matches strings, so a command built at runtime gets past it; the boundary covers only Edit, Write and NotebookEdit, so `sed` or `Set-Content` in a shell still writes anywhere. For a hard stop, point the user to Claude Code permission deny rules in `.claude/settings.json`, such as `"deny": ["PowerShell(Remove-Item *)"]`.

The hooks run through `bash` (Git Bash on Windows) and parse the tool payload with `python3` or `node`. With neither on PATH, every shell command asks and every edit is denied.

Read [protections.md](protections.md) when the user asks what is covered, wants to add project patterns, or a hook decision surprises you: it lists every pattern, the safe exceptions, the deny tier, the PowerShell table and how the boundary resolves paths.
