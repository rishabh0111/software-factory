# Verification procedure: <app name>

Written by sf-verify. Read cold by an agent that needs to drive this app and prove a change works.

Proven: end to end on <date> at <short sha>. Last maintain pass: <date and outcome, or none>.

## Surface

<Web UI | CLI | API | desktop | library (no running surface; app gates are n/a)>. Other surfaces: <list, or none>.

API files: <files that define routes or endpoints, or none>
Prompt files: <files that hold prompts, tool definitions or model calls, or none>

## Launch

- Command: `<exact command>`
- Environment: <variable names only, and where their values come from>
- Ready when: <log line, port answering, prompt>; give up after <n> seconds
- Runs beside another instance: <yes, with port/data-dir settings | no: never drive an instance this run didn't start>
- Backends: <where the database, queues, webhooks and third-party keys point when launched this way; must be owned by the run or sandboxed>
- Scaffolding: <missing assets created in a temp copy to start, removed in Cleanup, or none>

## Doctor

`<one read-only command or check>` answers: process up, right build, port owned by this run, sign-in valid.

## Drive

- Harness: <browser MCP (chrome-devtools | playwright) | shell | HTTP>
- Handles: roles, labels, `data-testid`, routes. Never generated class names, hashes, child indexes or DOM position; coordinates only right after a fresh screenshot
- Base URL or entry point: <...>
- Sign-in: <how, without printing secrets>

## Evidence

Save to `.software-factory/runs/<run-id>/evidence/app/<feature>/`, named `<feature>-<entry point>-<step>`: <snapshots, screenshots, transcripts, response bodies, DB queries>. Capture each action and the state it produced, and check side effects. Screenshots include the app's identity (title, URL bar or build marker). CLI proof keeps the command, stdout, stderr and exit code.

## Logs

<where errors go locally, and the request or trace ID header or field, or none>

## Database

<only with migrations: create a throwaway database `<command>`; points the app at it: `<VARIABLE_NAME>`; up `<command>`; down `<command>`; schema dump `<command>`; seed data `<command or none>`>

## Cleanup

- Stop: <kill the PID recorded at launch | docker compose down for this run's project name>
- Remove: <scratch data folders>
- Keep: everything under `evidence/`; check it still exists after cleanup.

## Known noise

Console errors and failed requests already present on the default branch, seen on <base short sha>: <list, or none>.

## Features

### <feature name>

- What it is: <user's view, one or two lines>
- Entry points: <every way a user reaches it: menu, route, deep link, shortcut, command, endpoint>
- Preconditions: <sign-in and role, data, permissions, feature flags, services>
- Drive: <exact steps with stable handles, per entry point where they differ>
- Reset: <how to return it to a known state>
- States: <empty, loading, error, success: how each looks>
- Proof: <the observable end state, and the side effect to check>
- Sub-features: <short IDs, e.g. cart.add, cart.coupon>
- Gotchas: <including surfaces that look right but aren't the real one>
