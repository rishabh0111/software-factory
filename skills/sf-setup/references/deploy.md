# Deploy: record it and dry-run it

`sf-ship` needs to know what a merge sets off, how to read the deploy's state and how to tell production is healthy. Setup records this in config `deploy:` and checks it read-only once, so the first real deploy isn't also the first test of these settings.

## 1. Ask (section L)

Start from what Explore detected ([explore.md](explore.md#deploy)). If several platforms or deploy workflows were found, ask which one serves production. Confirm what kind of project this is (library, CLI, API or web app); for a library or CLI the trigger is usually `none`.

1. **Trigger.** Recommend from the detection:
   - `on-merge`: merging to the default branch deploys (a platform's auto-deploy, or a workflow on push to it)
   - `manual-command`: someone runs a command; record it as `commands.deploy`
   - `none`: nothing deploys
2. **Status.** A read-only command that shows the latest deploy and which commit it ran. Typical:
   - deploy workflow on GitHub: `gh run list --workflow <file> --branch <default> --limit 1 --json headSha,status,conclusion`
   - on GitLab: `glab ci list --ref <default> --per-page 1 --output json` (or `glab api "projects/:id/deployments?environment=production&order_by=created_at&sort=desc&per_page=1"`)
   - Fly: `fly status --app <app>`; Vercel: `vercel ls --prod` (with the project linked)
   - none available: `unknown`, and `sf-ship` falls back to polling `health_url`
3. **Health URL.** The production URL, or its health path when one answers 2xx (`/health`, `/healthz`, `/api/status`). Ask the user to confirm it; never infer a production URL from the repo name. Also set `app.production_url`.

4. **Staging and errors.** `app.staging_url` when a pre-production copy exists, and `app.errors_command`: a read-only command that lists recent production errors (an error tracker's CLI, a log query); `none` without one. Run it once in the dry run, as for status.

Record the platform and the deploy workflows with their branch filters. Unattended: take what detection makes unambiguous, leave the rest `unknown`, and log each value.

## 2. Dry run

Read-only, attended and unattended alike. Never trigger a deploy, re-run a workflow or push.

1. Run `deploy.status` once. It must exit 0 and name a commit or a deploy. A sign-in error is `pending` on that sign-in, not a failure of the deploy setup.
2. Request `deploy.health_url` once with a GET and a 10-second timeout (`curl -sS -o /dev/null -w '%{http_code}' --max-time 10 <url>`). Record the status code. Don't send credentials or cookies.
3. Show the user, in two or three lines, what a merge to the default branch will set off: each workflow that runs on push to it, the platform's auto-deploy, or nothing (manual-command). This is what `sf-ship` will start when it merges.
4. Record `deploy.validated` as `YYYY-MM-DD pass` when both answered as expected, else `YYYY-MM-DD fail: <which step, one line>`.

A failed dry run doesn't stop setup. Attended, offer to correct the value and run the step again. `sf-ship` treats a deploy setup that isn't `pass` as needing a person at the deploy step.

## 3. When to redo it

When `deploy.workflows`, the platform file or `commands.deploy` changes, or the user asks. Re-running setup redoes it.
