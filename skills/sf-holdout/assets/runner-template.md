# Runner: <set-id>

How the holdout runner runs this set's `exec` scenarios in a temporary copy of the repo. See `sf-holdout/references/running-holdouts.md` for the full procedure.

- **Target folder in the copy:** <e.g. tests/holdout/ — must be a folder the test framework picks up and that the repo doesn't use>
- **Install:** <command, default `commands.install` from config>
- **Run one scenario:** <command with {file}, e.g. `npx vitest run {file}` or `python -m pytest -q {file}`>
- **Proof a test ran:** <output pattern, e.g. `1 passed` / `Tests  1 passed` / a non-zero collected count>
- **Timeout per scenario:** <seconds, e.g. 120>
- **Services needed:** <none | e.g. `docker compose up -d db` before running, `docker compose down` after>
- **Environment:** <variable names only, e.g. DATABASE_URL pointing at the test service; never secret values>
- **Start the app for rubric scenarios:** <command, default `commands.run`; the URL or port to reach it>

A scenario passes only when the run command exits 0 and the proof pattern appears. Anything else is a fail.
