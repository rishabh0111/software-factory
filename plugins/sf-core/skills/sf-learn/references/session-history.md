# Session history

Reads earlier agent sessions on this machine. Capture Full mode runs it as step 2 to find what earlier sessions tried on the same problem; retro uses the discovery and extraction steps to read a session the user names. It asks nothing, so non-interactive Full runs it too. It is a two-stage probe: cheap discovery and metadata always run; expensive extraction and synthesis run only when a candidate clears the relevance bar. Done when it returns a digest or `no relevant prior sessions`; either is a valid input, and the lesson is written without session context on the latter.

Scripts live in `"$SKILL_DIR/scripts/session-history/"` (run them as [SKILL.md](../SKILL.md) shows). When they are not on disk, say once "Session history scripts were not found in this skill's folder; skipping the session-history probe for this run." and go on without session context.

## Context values

Run each as its own command; a non-zero exit is a normal state here:

- `git rev-parse --abbrev-ref HEAD`: the branch to filter on. `HEAD` (detached) or an error: skip branch filtering.
- `git rev-parse --show-toplevel`: the repo filter. An error: use the working directory.

## Discovery

Start with a 7-day window unless the problem clearly spans longer:

```bash
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd); REPO_NAME=$(basename "$REPO_ROOT"); SCAN_DAYS="7";
bash "$SKILL_DIR/scripts/session-history/discover-sessions.sh" "$REPO_NAME" "$SCAN_DAYS" --cwd "$REPO_ROOT" | tr '\n' '\0' | xargs -0 "$PY" "$SKILL_DIR/scripts/session-history/extract-metadata.py" --cwd-filter "$REPO_ROOT"
```

Where sessions live, per harness:

- **Claude Code**: `~/.claude/projects/` (or `$CLAUDE_CONFIG_DIR/projects/`); records cwd and git branch.
- **Codex**: `~/.codex/sessions/` (or `$CODEX_HOME/sessions/`), plus `~/.agents/sessions/`; records cwd.
- **Pi**: `~/.pi/agent/sessions/` (`PI_CODING_AGENT_DIR` / `PI_CODING_AGENT_SESSION_DIR` override); records cwd.
- **oh-my-pi (`omp`)**: `~/.omp/agent/sessions/`, named profiles under `~/.omp/profiles/<name>/agent/sessions/`, XDG `$XDG_DATA_HOME/omp/sessions` and `$XDG_DATA_HOME/omp/profiles/<name>/sessions` (`PI_CONFIG_DIR` / `PI_CODING_AGENT_DIR` / `PI_CODING_AGENT_SESSION_DIR` override); records cwd.
- **Cursor**: records no cwd, so its sessions always stay in.

`--cwd-filter` keeps a session whose recorded cwd is the repo root, an ancestor of it, or a path inside it (on path-component boundaries: `my-repo` does not match `my-repo-old`), and drops sessions of cwd-recording harnesses that have none. Keep a Claude session even when its project folder name lacks the repo basename: that is how Claude stores sessions started in a parent folder.

Then:

- `_meta.files_processed` is `0`: return `no relevant prior sessions`.
- No branch match on the first pass, or any Codex, Pi or omp sessions in play: derive 2-4 keywords from the topic and re-run the metadata step with `--keyword K1,K2,...`.
- Keep at most 5 sessions across all harnesses, ranked by branch match, keyword match count, size over 30KB, then recency. Exclude the current session.

**Escalation check.** Go on to extraction only when a kept candidate matches the current branch or at least 2 topic keywords. Otherwise record `no relevant prior sessions` and stop: this check is what keeps the always-on probe cheap.

## Extraction

Create `SCRATCH=$(mktemp -d "${TMPDIR:-/tmp}/learn-sessions-XXXXXX")` and extract each selected session into it:

```bash
"$PY" "$SKILL_DIR/scripts/session-history/extract-skeleton.py" --output "$SCRATCH/<session-id>.skeleton.txt" < <session-file>
```

Add `extract-errors.py` (same `--output` shape) for a session where dead ends or recurring errors are likely useful.

## Synthesis

Dispatch a generic subagent (never a named agent type) whose prompt holds the full text of [agents/session-historian.md](agents/session-historian.md), plus:

- **Session context**, only when the values above resolved: repo name and branch.
- **Time window**: `7 days` unless the problem clearly spans longer.
- **Problem topic**: one sentence naming the concrete issue (error, module, what broke and how it was fixed). Not a paragraph, not a list of related topics.
- **Filter rule**: "Only surface findings directly relevant to this specific problem. Ignore unrelated work from the same sessions or branches."
- **`scratch_dir`** and a **`sessions`** array of extracted file paths with their metadata.
- **Output schema**: "Structure your response with these sections (omit any with no findings): What was tried before / What didn't work / Key decisions / Related context".

Nothing else: extra context blocks, exclusion lists or keyword bullets make the synthesis widen its search and multiply wall time. The subagent writes its prose to `{run_dir}/session-history.md` and returns the path, or the prose inline when there is no run folder or the write failed. When synthesis fails, note it and go on without session context.
