# Generating `.software-factory/verify.md`

`verify.md` is the repo's own recipe for driving the real app the way a user does: launch it, check it's healthy, exercise a feature, capture proof, and clean up. Its reader is an agent meeting the app for the first time, opening the file in the middle of a run with no other context. It's committed so every run and every teammate uses the same recipe.

Write it once, the first time `sf-verify` needs it. After that, extend it when a spec adds a feature it doesn't map, and fix it when it's wrong.

## 1. Study the code first

The code should settle each point below. Put a question to the user only when it can't be observed, leading with your best guess; unattended, take the guess and log it in `runs/<run-id>/decisions.md`.

- **Surface:** what a user touches. Web UI, CLI or TUI, API, desktop, mobile, or a library with no running surface. If there are several, pick the primary one and list the others.
- **Run:** how it starts locally. Prefer `commands.run` from config, then the repo's documented dev command. Note ports, environment variables (names only, never values), seed data and sign-in.
- **Drive:** how an agent can operate it. Existing harnesses first (Playwright or Cypress specs, curl-able endpoints, a CLI with `--json` output). Then the generic route: the browser MCP from `tools.browser_mcp` for web, a shell session for CLI, HTTP for services. Never name a run's headless fallback script (under `runs/<run-id>/evidence/`) here: teammates don't have it.
- **Observe:** what can be captured as proof: accessibility snapshots, screenshots, console messages, network requests, terminal transcripts, response bodies, exit codes, database rows, files written.
- **Isolate:** can a second instance run beside the user's own (its own port, data folder, profile)? If not, say so: refuse to drive an instance the run didn't start.

When the checkout fails to build or to start without changes, report that precisely as the app gate's `error` instead of writing steps against a broken base. One exception: when startup is blocked only by a missing asset that has nothing to do with the features (a local config file copied from an `.example`, an empty uploads folder, a placeholder icon), create it as marked scaffolding in a temp copy, list it under Launch, and remove it in Cleanup. Never scaffold something a feature under test reads.

## A library

When step 1 finds no running surface (a library or SDK that other code imports), write the short form instead of steps 2 and 3: the title, `Surface: library (no running surface; app gates are n/a)`, the public entry points (package root, `exports`, type definitions) and where the getting-started and usage docs are. Leave out Launch, Doctor, Drive, Evidence, Cleanup, Known noise and Features. There is nothing to launch, so there is no end-to-end proof to run.

Commit it alone with the same message as in step 3. No gate has run yet, so `sf-verify` doesn't restart: it re-records its start fingerprint `W` and goes on.

## 2. Write it

Use [../assets/verify-template.md](../assets/verify-template.md). Base each section on the findings of step 1 and leave no placeholder behind.

- **Launch:** the precise start command, the readiness signal to wait for (a particular log line, a port that accepts connections, a shell prompt), and the timeout after which startup counts as failed. For a short-lived CLI, launch means build once, then run each drive in its own fresh shell.
- **Doctor:** a single check that changes nothing and decides whether this instance is fit to drive: the process is running, the build is the expected one, this run's process holds the port, and the sign-in still works. Run it before the first drive and after any drive that failed. When Doctor passes but the UI is stuck, reset to a known state or relaunch before driving again.
- **Drive:** real selectors and commands from this repo. Use stable handles: accessible names and roles, labels, `data-testid`, route paths, prompt strings. Never use generated CSS or CSS-in-JS class names, build hashes, child indexes or DOM position. Coordinates only right after a fresh screenshot, never from memory. Record each action with the state it produced.
- **Evidence:** what to capture and where (`runs/<run-id>/evidence/app/`). Proof standards: go through the route a user would take, never through internal setters or endpoints that exist only for tests; record each step together with the state it led to, rather than the last screen alone; confirm side effects, not just what shows on screen; mock an external system only at a boundary that production itself already keeps separate. When the safe route is a dry-run mode, check what it actually leaves untouched (files, network calls, git refs) instead of assuming the flag does what it says.
- **Cleanup:** stop what the run started, by process ID or container, never by process name. Remove scratch data. Never delete evidence: after cleanup, check the evidence files still exist.
- **Known noise:** console errors and failed requests that already happen on the default branch, so the app gate can tell new ones from old. Fill it from the base, in step 3, never from memory. Write `none` only when the base load showed none.
- **API files:** for a web service or API, the files that define its routes or endpoints when their names don't say so (`app.js`, `server.py`). The scope rules treat any change to them as `api`.
- **Prompt files:** files that hold prompts, tool definitions or model calls when their names don't say so. The scope rules treat any change to them as `prompts`.
- **Logs:** where the app writes errors locally (a file, the launch terminal, a local collector), and whether responses carry a request or trace ID. The app gate uses it to check that an error shows up there.
- **Database:** when the repo has migrations: how to create a throwaway database, the variable that points the app at it (name only), and the migrate up, down and schema-dump commands. Gate 6a uses it; never a shared or production database.
- **Features:** the top user-facing features (start with three to five, plus every feature the current spec touches). For each: what it is from the user's side; every entry point a user can reach it by (menu, deep link, shortcut, command, endpoint), since a proof through one entry point doesn't cover the others; preconditions (sign-in and role, data, permissions, feature flags, services); how to drive it; how to reset it to a known state; the states it can show (empty, loading, error, success); the observable end state that proves it works; short sub-feature IDs (`cart.add`, `cart.coupon`) so evidence and reports can cite them; and gotchas, including surfaces that look right but aren't the real one.

If a helper script would make driving reliable, put it in `.software-factory/verify/` and show its exact invocation in `verify.md`. If the reader must work out what a helper does from its source, it hasn't helped.

## 3. Prove it before using it

Run it once end to end: launch, doctor, drive one mapped feature, capture evidence, clean up, then confirm the evidence is still there. Run the cleanup after every failed attempt too, so nothing is left holding a port. A `verify.md` that was never executed is a draft, and the app gate can't pass on a draft.

**Seed Known noise from the base.** Launch the merge base from a temp copy ([design-review.md](design-review.md#the-base-app)), load each mapped page or call each mapped endpoint once, and list every console error and failed request it shows (a missing `/favicon.ico` is common). Those go into Known noise with the base's short SHA. Anything the head shows that the base didn't is not noise. If the base can't launch, write `Known noise: not seeded (<reason>)`; the app checker then reports every console error and lets `sf-verify` compare it with the base by hand.

Then commit it alone: `git add .software-factory/verify.md .software-factory/verify/ && git commit -m "chore(sf): add verification procedure"`. This is the only commit `sf-verify` makes.

## 4. Keep it honest

When a drive fails, decide which of three it is:

- **Doc drift:** the app works but `verify.md` describes it wrong (a renamed button, a new route, a missing Known noise line). Fix `verify.md`, commit it alone, and restart verification. At most once per run. The commit changes the fingerprint, but not the product: carry over the records that don't read `verify.md` as [evidence.md](evidence.md#carrying-records-over-a-software-factory-only-commit) says, and re-run only the rest.
- **Harness gap:** the app works but the recipe can't drive it. Fix the recipe the same way.
- **Product failure:** the app doesn't do what the feature map or spec says. That's a gate `fail` for the builder. Never edit `verify.md` to match broken behaviour.

A feature that can't be reached is reported with the concrete prerequisite that's missing and the route tried.

Normal runs re-drive only the features the current spec touches, so the rest of the map can rot unseen. When `verify.md`'s "Proven" date is more than three months old, or a run fixed doc drift, say in the report's Notes that a [maintain pass](maintain-mode.md) is due.
