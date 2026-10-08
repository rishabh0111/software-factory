# Deploy

How a merged change reaches production, and how ship knows which revision is live. Read `deploy` and `commands.deploy` from config. Every result goes to the ship record's `Deploy` section.

## How the repo deploys

`deploy.trigger` says what starts a deploy:

| `deploy.trigger` | Meaning | Ship does |
|---|---|---|
| `none` | nothing deploys this repo (a library published by hand, an internal tool) | stops after the merge; the verdict is `merged, no deploy (deploy.trigger: none)` |
| `on-merge` | a CI workflow or the platform deploys when trunk moves | runs no command: finds and watches the deploy for the merge SHA ([Watch a triggered deploy](#watch-a-triggered-deploy)) |
| `manual-command` | someone runs `commands.deploy` | runs it, with the `deploy` gate ([Run the command](#run-the-command)) |
| missing or `unknown` | not known | treats it as possibly `on-merge` (see below) |

`deploy.platform` and `deploy.workflows` name what setup found; use them first.

**Unknown is not none.** Before the merge gate, when the trigger is missing or `unknown`, look for automatic deploys read-only: workflows on push to `<trunk>` with deploy steps (`.github/workflows/*` with `on: push` to the trunk, `.gitlab-ci.yml` jobs with `environment:` that run on the default branch) and platform files (`vercel.json` or `.vercel/`, `netlify.toml`, `fly.toml`, `render.yaml`, `railway.json`, `Procfile`). Any hit: handle the merge as `on-merge` and record the files found. No hit: the trigger stays unknown. Then, after the merge, report `merged, deploy not tracked (deploy.trigger unknown)`. Never write "nothing was deployed" unless `deploy.trigger` is `none`.

## The merge can be the deploy

When the trigger is `on-merge` (configured or detected), merging is a production deploy. The merge then needs the `deploy` gate as well as the `merge` gate, and a yes-question says so: "Merging deploys to production via <workflow or platform>. Merge and deploy <sha7>?" With `merge: auto` and `deploy: manual`, the merge waits for a person.

## Before the first deploy

When `deploy.validated` isn't a pass, the first time ship deploys a repo, and again when the deploy config changed since the last ship record that deployed (hash `deploy.*` from config plus the deploy workflow and platform files; compare with the hash in the last such record), do a dry run and show a person:

- what the merge or command will trigger: the workflow or platform, its branch filter, any approval step;
- `deploy.status` run once, read-only, and its output;
- `deploy.health_url` (else `app.production_url`) fetched once.

A failed status command or URL is noted, not blocking, but the deploy then needs a person's yes. Record the hash and the result. Unattended, the first deploy waits for a person.

## Record the rollback

Before the deploy starts, copy the spec's `## Rollback` section into the ship record, as written. No spec: `Revert the PR/MR.` When the scope includes `migrations` (verify's scope table), the rollback has a down step: verify's evidence must show it ran, or a person says yes to deploying without that proof. A change that is one-way, by the spec's Rollback or by the description's `Door` rule ([pr-description.md](pr-description.md#merge-danger)), also needs a person's yes. If either says one-way, it is one-way.

## Baseline

Take the pre-deploy production baseline ([post-deploy-check.md](post-deploy-check.md#baseline)) before merging when the trigger is `on-merge`, otherwise before running the command.

## Run the command

`manual-command` only. Run `commands.deploy` exactly as configured, from a clean checkout of the merge commit. Save the full output to `runs/<run-id>/evidence/deploy.log`. A non-zero exit is a failed deploy. Never deploy by another route, and never redeploy on your own after a failure.

## Watch a triggered deploy

`on-merge` only. Find the run or release for the merge SHA, not by name:

| | Find | Watch |
|---|---|---|
| GitHub Actions | `gh run list --commit <merge-sha> --json databaseId,workflowName,event,status,conclusion,headSha` | `gh run view <id> --json status,conclusion,jobs` |
| GitHub deployments | `gh api "repos/{owner}/{repo}/deployments?sha=<merge-sha>"` | `gh api repos/{owner}/{repo}/deployments/<id>/statuses` |
| GitLab | `glab api "projects/:id/pipelines?sha=<merge-sha>"`; `glab api "projects/:id/deployments?environment=<env>&order_by=created_at&sort=desc"` (match `sha`) | pipeline `status`; deployment `status` |
| Platform | `deploy.status`, if configured | its output |

A run whose `headSha`/`sha` isn't the merge SHA is not evidence, even with the right name. Tell staging from production by the environment name; a staging success is not a production deploy. No run found within 5 minutes of the merge: record `deploy not found for <sha7>` and treat it as unknown.

## Deadline

Wait for a deploy (command or triggered) up to 20 minutes, with a progress line in the ship record every few minutes. Past it, stop resumable: `Next: check deploy of <merge-sha7>`. A status query that fails is unknown, not success and not failure.

## Confirm the revision

A 200 from the site proves it is up, not which revision is live. Confirm the merge SHA from one of: the deploy run or deployment for that SHA finished successfully on the production environment, `deploy.status` names the SHA, or the app reports its version or commit (a `/version` endpoint, a header, a footer). Record `Revision confirmed: yes (<how>)` or `no`. Without it the verdict is `deployed (revision unconfirmed)`, and the post-deploy check can't call that SHA healthy.

## Verdict

One line at the end of the ship record, never inferred from the merge or an HTTP 200:

- `merged, deployed and verified` (revision confirmed, post-deploy healthy)
- `merged, deployed (revision unconfirmed)` or `merged, deployed, not verified (<reason>)`
- `merged, deploy degraded` or `merged, deploy broken` (post-deploy verdict), with the revert recommendation
- `merged, deploy failed` (command exit or failed run)
- `merged, deploy not tracked (<reason>)` or `merged, no deploy (deploy.trigger: none)`
- `merged, deploy waiting for a person`
