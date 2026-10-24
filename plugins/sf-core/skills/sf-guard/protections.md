# What the guard hooks check

Depth for [SKILL.md](SKILL.md): every pattern the two session hooks act on, and how each decides. Both answer Claude Code with a `hookSpecificOutput` payload carrying `permissionDecision` (`ask` or `deny`); the decision has to sit under `hookSpecificOutput`, since Claude Code ignores a top-level `permissionDecision`.

## Destructive-command check (`bin/check-careful.sh`)

Runs on every Bash and PowerShell call. It reads `tool_name` and `tool_input.command` with a real JSON parser, then applies the tiers below in order; the first match decides.

### Obfuscation tripwire (ask)

`${IFS}` / `$IFS` word-splitting and base64 decoded into a shell. String matching cannot see what these expand to, so they always ask.

### Deny tier

Two catastrophic shapes are denied, not asked:

- `rm -r` / `-R` / `--recursive` whose every target is `/`, `~`, `$HOME` or `/*` (quoted or not, options in any position);
- force-push (`-f`, `--force`, or a `+ref` refspec) to the repository's default branch, read from `origin/HEAD` and falling back to `origin/main` then `origin/master`. A bare `git push --force` counts when the current branch is the default.

Only simple commands reach this tier: anything with `;`, `&&`, `||`, `|` or a newline falls through to the ask tier, because string matching cannot tell what a compound command targets. `--force-with-lease` is never denied. The way past a deny is ending the session that invoked `/sf-guard`.

### Safe exceptions (allow)

A single, single-line `rm -r` whose every target is a build artifact runs without asking: `node_modules`, `.next`, `dist`, `__pycache__`, `.cache`, `build`, `.turbo`, `coverage` (optionally under a plain path). Command substitution in the target, or any second command, loses the exception.

### Ask tier

| Pattern | Example | Risk |
|---|---|---|
| `rm -r` / `-R` / `-rf` / `--recursive` | `rm -rf /var/data` | Recursive delete |
| `DROP TABLE` / `DROP DATABASE` | `DROP TABLE users;` | Data loss |
| `TRUNCATE` | `TRUNCATE orders;` | Data loss |
| `git push --force` / `-f` / `+ref` | `git push -f origin main` | History rewrite |
| `git reset --hard` | `git reset --hard HEAD~3` | Uncommitted work lost |
| `git checkout .` / `git restore .` | `git checkout .` | Uncommitted work lost |
| `kubectl delete` | `kubectl delete pod` | Production impact |
| `docker rm -f` / `docker system prune` | `docker system prune -a` | Containers and images lost |

The user can approve any ask.

### PowerShell and cmd (ask)

Checked on the PowerShell tool's command, and on any `pwsh`, `powershell` or `cmd` launched from Bash. Matching ignores case, covers aliases in command position, accepts parameter prefixes (`-r`, `-fo`) and drops cmd `^` and PowerShell backtick escapes. The ask-tier table above applies there too, plus:

| Pattern | Example |
|---|---|
| `Remove-Item` / `rm` / `ri` / `del` / `erase` / `rd` / `rmdir` with `-Recurse` or `-Force` | `gci \| ri -r -fo` |
| cmd `rd /s`, `rmdir /s`, `del /s`, `erase /s` | `cmd /c rd /s /q C:\proj` |
| `Format-Volume`, `Clear-Disk`, `Clear-Content`, `[IO.Directory]::Delete`, `[IO.File]::Delete` | `Clear-Disk -Number 1` |
| `-EncodedCommand`, `iex`, `Start-Process` of a shell, `& $cmd` (cannot be inspected) | `irm $url \| iex` |

### Project patterns (add-only)

Extra ask rules, one POSIX ERE per line, `#` comments allowed:

- global: `~/.claude/guard/careful-patterns.txt`
- per project: `.claude/guard/careful-patterns.txt`

They are consulted only after every built-in check came up empty, so a pattern file can add a warning and never suppress one. An invalid regex line is skipped.

### When the payload cannot be read

No parser on PATH, or a payload that is not JSON: ask. A payload with no `command` field (not a shell call): allow.

## Edit boundary (`bin/check-freeze.sh`)

Runs on every Edit, Write and NotebookEdit. With no `.claude/guard/freeze-dir.txt`, or an empty one, it allows everything. Otherwise:

1. It reads `file_path` (Edit, Write) or `notebook_path` (NotebookEdit).
2. It canonicalizes both the path and the boundary the same way: `C:\x`, `c:/x` and `/c/x` are one path, UNC `\\srv\share` stays `//srv/share`, `/cygdrive/c` becomes `/c`, and comparison ignores case on Windows. A relative path is joined to the current directory.
3. It resolves symlinks through the final component, so an in-boundary link pointing outside is checked against its target.
4. It allows a path equal to the boundary or under `<boundary>/` (the trailing `/` keeps `/src` from matching `/src-old`); everything else is denied with a message naming the tool, the path, the boundary and `/sf-guard unfreeze`.

The boundary fails closed: an unreadable payload, missing or outdated helpers, a relative legacy boundary, or the hook dying unexpectedly all deny. A payload that parses but carries no path field (not a file tool) is allowed. Boundaries containing spaces work.

`bin/freeze-state.sh` is the only writer of the boundary file. It takes a lock directory (`.claude/guard/.freeze-mutation.lock`), writes through a temp file and an atomic rename, and prints `FREEZE_DIR=` on success or a `FREEZE_BUSY` / `FREEZE_PRESERVED` / `FREEZE_ERROR` line when it changed nothing. `bin/hook-extract.sh` holds the JSON extraction, path canonicalization, JSON encoding and state-root lookup that both hooks and the writer share, so a parsing fix reaches all three.
