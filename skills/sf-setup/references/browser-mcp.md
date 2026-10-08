# Adding a browser MCP server

Pin the version. An unpinned `@latest` runs whatever was published most recently, which is how backdoored packages spread. Unattended, add nothing: record `browser_mcp: pending` with the command below.

## Already available

If the running agent already has browser MCP tools (names containing `chrome-devtools` or `playwright`), don't add another server and don't ask section B. Test it with one real, read-only call: `list_pages` for Chrome DevTools, `browser_tabs` with `action: list` (or a snapshot of a blank page) for Playwright. Tools being listed proves nothing; only a call that returns does.

- The call returns: record `browser_mcp: <name>` and `browser_status: ready`.
- The call fails (for example "Could not connect to Chrome" or "DevToolsActivePort" not found): record `browser_mcp: pending` and `browser_status: "failed: <one-line error>"`, and add a `pending:` entry: start the browser the server drives, then call `list_pages` once from the main session and re-run setup. A server started from a subagent may not be able to launch the browser itself; once the main session has made one call, subagent calls usually work. Later stages treat `pending` as no MCP: the conductor and `sf-verify` re-check at run start and fall back to a throwaway headless browser with a temporary profile, never the user's own ([gates.md](../../sf-verify/references/gates.md#browser-check-and-fallback)).

This applies attended and unattended alike: testing an existing tool changes no config.

| Server | Package | Use when |
|---|---|---|
| Chrome DevTools MCP | `chrome-devtools-mcp@1.10.1` | Default: open the app, click through it, read console and network errors |
| Playwright MCP | `@playwright/mcp@0.0.83` | The project already uses Playwright |

Below, `<name>` is `chrome-devtools` or `playwright`, and `<package>` is the pinned package from the table.

## Isolated profile

Recommend running the browser with a fresh, temporary profile each session: add `--isolated` after `<package>` (both servers accept it). For Chrome DevTools MCP this is the recommended form in every command below: `chrome-devtools-mcp@1.10.1 --isolated`. Without it, Chrome DevTools MCP keeps one persistent profile, so cookies and sign-ins from one run, production ones included from the post-deploy check, carry into the next. Never point the server at the user's everyday Chrome (`--autoConnect`, `--browserUrl`, `--wsEndpoint`): that hands the agent their signed-in sessions. Offer it as a yes/no in section B (recommended: yes) and record `tools.browser_isolated`. For a server that already exists and whose arguments the session can't see (no project `.mcp.json`, no readable agent config), record `unknown`, not `n/a`. A failing call whose error names a profile folder (for example `Could not find DevToolsActivePort for chrome-beta at ...\Chrome Beta\User Data`) means the server is set to attach to that person's own browser (`--autoConnect`, `--channel`): record `browser_isolated: false` and `browser_status: "failed: <error>"`, and offer the `--isolated` form. A page list (`list_pages`) showing sites unrelated to the project (mail, chat, other apps) is a warning sign that it drives a shared, signed-in profile: say so in the report. Don't copy the listing into any file. A test that needs a signed-in state signs in during the run with test credentials.

When an existing server was found (see above), read its arguments where the agent's config shows them. If it attaches to the user's Chrome, say so plainly and offer to switch it to the isolated form; changing it is an agent-config change, so unattended record it under `pending:`.

## Claude Code

```
claude mcp add --scope project <name> -- npx -y <package> --isolated
```

`--scope project` writes `.mcp.json` in the repo, so teammates get the server too. Claude Code asks each person to approve project servers the first time.

On native Windows (not WSL), wrap the command: `claude mcp add --scope project <name> -- cmd /c npx -y <package> --isolated`.

## Codex

```
codex mcp add <name> -- npx -y <package> --isolated
```

## OpenCode

Add to `opencode.json` at the repo root, merging with any existing `"mcp"` block:

```json
{
  "mcp": {
    "<name>": {
      "type": "local",
      "command": ["npx", "-y", "<package>", "--isolated"]
    }
  }
}
```

## Cursor

Add to `.cursor/mcp.json` at the repo root, merging with any existing servers:

```json
{
  "mcpServers": {
    "<name>": {
      "command": "npx",
      "args": ["-y", "<package>", "--isolated"]
    }
  }
}
```

## Other agents

Tell the user the server command, `npx -y <package> --isolated`, and ask them to add it the way their agent adds MCP servers. Record it as `pending` until they confirm.

After adding a server, the agent usually needs a restart to load it. Say so.
