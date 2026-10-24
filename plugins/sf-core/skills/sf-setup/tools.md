# Optional tools

Skills use these tools when they are installed and fall back when they are not. This file is the one place that names them: how to detect each, the shape of a call, and the fallback. The setup tools round detects them and records what it found in `docs/agents/tools.md`; skills choose from that record.

## Headless browser CLI

Drives a browser from the shell: screenshots, page snapshots, console output. Used by `sf-qa`, `sf-design`, `sf-benchmark`, `sf-devex-review` and `sf-ship` (canary, land-and-deploy, PR pictures).

| Tool | Detect | Shape of a call |
|---|---|---|
| A gstack-style `browse` binary | `command -v browse`, or an executable `~/.claude/skills/gstack/browse/dist/browse` | `B=<path>`, then `$B goto <url>`, `$B snapshot -i`, `$B screenshot <file>`, `$B console` |
| `agent-browser` | `command -v agent-browser` | `agent-browser open <url>`, `agent-browser snapshot`, `agent-browser screenshot <file>` |
| Playwright CLI | `npx --no-install playwright --version` | `npx playwright screenshot --full-page <url> <file>` |

Record the first one found, with its path. **Fallback:** the chrome-devtools MCP, below.

## Chrome DevTools MCP

The browser MCP server the browser skills' rules are written against (`list_pages`, `new_page`, `take_snapshot`, `take_screenshot`, `performance_*`, `lighthouse_audit`).

- **Detect:** `claude mcp list` names `chrome-devtools`, or `.mcp.json` does. In a session, a `list_pages` tool that returns a page list means it is ready.
- **Install** (asks the user first; it adds a project-level server):

  ```bash
  claude mcp add chrome-devtools --scope project -- npx -y chrome-devtools-mcp@latest --isolated
  ```

  or the same entry in `.mcp.json`:

  ```json
  { "mcpServers": { "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest", "--isolated"] } } }
  ```

  `-y` skips the npx confirmation. Without connect flags the server launches Chrome with its own dedicated profile (under `~/.cache/chrome-devtools-mcp/`); `--isolated` uses a temporary profile wiped when the browser closes. `--autoConnect` (Chrome 144+, remote debugging enabled at `chrome://inspect/#remote-debugging`) attaches to the user's running Chrome instead; use it only when a test needs the logged-in state, under the Profile Isolation rules in `sf-qa`'s `SKILL.md`.
- **Without a server in the harness**, the same tools run from the shell: `npx -p chrome-devtools-mcp chrome-devtools <tool>`, for example `chrome-devtools lighthouse_audit --output-format=json`.
- **Fallback:** none for a live browser step. Record that step SKIPPED or blocked with the reason; unit tests and curl never stand in for it.

## Image generation

Turns a design brief into a mockup image. Used by `sf-design` and the `sf-plan-review` design lens.

| Tool | Detect | Shape of a call |
|---|---|---|
| A gstack-style `design` binary | `command -v design`, or an executable `~/.claude/skills/gstack/design/dist/design` | `D=<path>`, then `$D generate --brief "<brief>" --output <file>`, `$D variants`, `$D compare` |
| An image-generation MCP server | `claude mcp list` names one with an image-generation tool | the server's own tool |

**Fallback:** HTML mockups: write each variant as a self-contained HTML/CSS file, render it in the browser recorded above and capture a screenshot.

## Second-model CLI

Gets an outside opinion from a different model family. Used by `sf-doubt-check` and the `sf-plan-review` outside voice.

| Tool | Detect | Shape of a call |
|---|---|---|
| `codex` | `command -v codex` and `codex --version` | `codex exec --sandbox read-only -C <repo-path> - < <prompt-file>` |
| `gemini` | `command -v gemini` and `gemini --version` | `gemini --approval-mode plan -p "" < <prompt-file>` |

Write the prompt to a file and pass it on stdin, never as a quoted argument, and keep the CLI read-only: a reviewed artifact can carry instructions the CLI would otherwise run against the workspace. Flags differ across versions; confirm the call with `--help` before the first run. **Fallback:** a fresh subagent given only the artifact and the review prompt, with no session context.

## Design-check CLI

A design-quality engine used by `sf-design` (every mode) when present. Skills call it "the design-check CLI" and always carry a fallback, so it is optional; it is never installed by a skill.

| Tool | Detect | Shape of a call |
|---|---|---|
| The `impeccable` launcher | `command -v impeccable`; else an executable `scripts/impeccable` (Windows: `scripts/impeccable.cmd`) inside an installed `impeccable` skill folder: `.claude/skills/impeccable/` in the project, or `~/.claude/skills/impeccable/`. Its engine binary sits beside the launcher or in `~/.impeccable/bin/` | `<path> <verb> [--target <file or route>] [--json]` |

What it adds, by verb (confirm with `<path> --help` before the first run; verbs change between versions):
- **Context loading:** `context` loads PRODUCT.md, DESIGN.md, the matching surface brief and native-platform guidance once per session and prints directives; `signals` summarises project state for routing; `doctor --json` reports drift between its own artifacts (PRODUCT.md, DESIGN.md and its sidecar, its config, surface briefs, the hook) and what the installed version reads, by severity (`auto` items `doctor --fix` applies; `mention` items to state; `route` items that name a job such as recording DESIGN.md). A commit count since DESIGN.md changed is not proof it is wrong.
- **Detection:** `detect [--json] [--scope layout] <files or URL>` runs its deterministic rule set over local files or a page (`--cdp <port>` for a desktop app with a local DevTools port); `ignores` and `hooks ignore-rule|ignore-file|ignore-value` manage suppressions in its project config, each with a `--reason "<who decided: evidence>"`.
- **Critique storage:** `critique-storage slug|write|trend|latest|close`.
- **Live mode:** `live-*` verbs drive in-browser variant iteration on a running dev server (`sf-design` shotgun's live branch); `generate-image`, `comp-spec`, `font-match`, `comp-diff`, `embed-prompt`, `build-phase`, `concept-seed`, `serve-question` and `component-review` serve the comp-led build.

Never run its `install` or `update` from a skill: installing it, which downloads a platform binary, is the user's decision. It keeps its own working files under `.impeccable/` in the project. **Fallback:** the manual method each `sf-design` step gives (read the files, scan for the tells in `sf-frontend-ui/references/tells.md`, inspect the rendered page in the browser above).

Triage its findings the same way wherever they appear: a real design problem is fixed, never ignored to push a write through; a confident false positive or sanctioned exception (a fixture, documentation of bad design, literal domain motion, a choice the user confirmed) gets the narrowest ignore with its evidence as the reason, disclosed in the reply; an uncertain one is left standing and asked about in one line.

### Optional hook (the user adds it; no skill installs it)

The CLI can check UI files after every edit, the way its own plugin's PostToolUse hook does. A user who wants that may add this to their own `.claude/settings.local.json` (or `~/.claude/settings.json`), with the detected launcher path:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "[ ! -x \"$HOME/.claude/skills/impeccable/scripts/impeccable\" ] || \"$HOME/.claude/skills/impeccable/scripts/impeccable\" hook", "timeout": 5, "statusMessage": "Checking UI changes" }
        ]
      }
    ]
  }
}
```

It scans design-relevant files (`.tsx`, `.jsx`, `.html`, `.vue`, `.svelte`, `.astro`, `.css`, `.scss`, `.sass`, `.less`, `.ts`, `.js`) and pushes a short reminder after the edit: the mechanical tier (broken images, overflow, contrast, gradient text, glow shadows, design-system drift) per edit. Upstream also wires `SessionStart` and a `Stop` deep pass running the full rule set over the session's touched files; add those only if wanted. Its switches live in the CLI's project config (`hook.enabled`, `hook.quiet`, `hook.perEditRules`, `detector.extensions` for template engines such as `.blade.php`). Without the hook, `sf-design` runs one manual detector pass at the end of a build.

## Direction scripts

`sf-design`'s direction mode vendors zero-dependency Node scripts (`skills/sf-design/direction/scripts/`): `draw.mjs` and `lint.mjs` (Node 18+), `inspect.mjs` and `scenes.mjs` (Node 22+ for its built-in WebSocket, plus a local Chrome, Edge or Chromium driven headless over the DevTools protocol), `assets.mjs` (Node 18+; network: keyless HTTPS searches of Openverse, Wikimedia Commons, the Art Institute of Chicago, the Met, the Internet Archive and NASA, and downloads of chosen images or clips into the project).

- **Detect:** `node --version` (22 or newer for the inspector); a browser at a standard install path (Chrome, Edge, Brave or Chromium on Windows, macOS or Linux), or `CHROME_PATH` / `PUPPETEER_EXECUTABLE_PATH` set to one.
- **What they write:** only inside the project: `.design/` (sheet, draw history, inspector and scene screenshots, the browser's throwaway profile in `.design/tmp/`, removed after each run) and, for `assets.mjs --get`, `assets/` with `assets/credits.json`. `DESIGN_DRAW_HISTORY` and `DESIGN_BROWSER_TMP` move the history and the profile.
- **Fallback:** without Node 22 or a browser, run `lint.mjs` alone and screenshot with the headless browser CLI or the MCP above; without network, draw the pictures instead of searching.

## Template for `docs/agents/tools.md`

```markdown
# Tools

Detected by `/sf-setup` on <date>. Skills use a recorded tool and fall back as the plugin's tools map says when a row reads `none`.

| Kind | Recorded | How to call it |
|---|---|---|
| Headless browser CLI | <tool and path, or none> | <call shape, or none> |
| Chrome DevTools MCP | <configured, scope, profile flag, or not configured> | MCP tools |
| Image generation | <tool and path, or none> | <call shape, or none> |
| Second-model CLI | <tool and version, or none> | <call shape, or none> |
| Design-check CLI | <launcher path and version, or none> | `<path> <verb>`, or none |
| Direction scripts | <Node version; browser path, or none> | `node <sf-design>/direction/scripts/<script>.mjs` |
```
