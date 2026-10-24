# Land and deploy

The **Land** branch of `sf-ship`: pick up an open PR, check it is ready, merge it with the user's approval, follow the deploy, verify production, and report the evidence. Steps 1 and 2 of [SKILL.md](SKILL.md) have run: you hold the forge and the base. This branch needs GitHub or GitLab; on another forge, stop: "This forge has no CLI path here. Open the PR with `/sf-ship`, then merge it in the forge's web UI."

**Arguments:** none (the PR for the current branch, no verification URL), `<url>` (also verify the deploy at this URL), `#123` (that PR), or `#123 <url>`.

**What runs without asking:** read-only detection and polling. **What always asks:** first-run confirmation (step 1.5) and merge approval (step 3.5). **What stops the run:** missing access, an unknown target or state, an unapproved red or pending check, missing CI, a conflict, or failing tests. After any merge error, read the server state before deciding anything. No approval overrides a blocker or covers a different revision than the one approved.

Narrate as you go: name the actual PR and app, and explain the stakes before each question. On a first run, say what each check does; on a confirmed setup, keep updates brief.

| Step | Where |
|---|---|
| 1.5 first-run dry run (only on `FIRST_RUN` or `CONFIG_CHANGED`) | [land-and-deploy/first-run-validation.md](land-and-deploy/first-run-validation.md) |
| 3.5 readiness gate, the last check before the irreversible merge | [land-and-deploy/readiness-gate.md](land-and-deploy/readiness-gate.md) |
| 4-5 merge, and deploy strategy | [land-and-deploy/merge-and-deploy.md](land-and-deploy/merge-and-deploy.md) |

Read each file in full when its step comes up.

## Step 1: Pre-flight

Tell the user: "Checking access and finding your PR."

1. Check GitHub CLI authentication:
```bash
gh auth status
```
If unauthenticated, **STOP**; ask the user to run `gh auth login`, then retry.
GitLab: `glab auth status`; if unauthenticated, ask for `glab auth login`.

2. Save any URL as `VERIFY_URL` (an explicit verification request). Set `PR_NUMBER`
to the numeric `#NNN` argument, or detect it once from the current branch:
```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner) || exit 1
if [ -z "$PR_NUMBER" ]; then
  PR_NUMBER=$(gh pr view --repo "$REPO" --json number -q .number) || exit 1
fi
PR_JSON=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json number,state,title,url,mergeable,baseRefName,headRefName,headRefOid,baseRefOid) || exit 1
PR_HEAD=$(printf '%s' "$PR_JSON" | jq -er .headRefOid) || exit 1
HEAD_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .headRefName) || exit 1
BASE_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .baseRefName) || exit 1
```
GitLab:
```bash
REPO=$(glab repo view -F json | jq -er .path_with_namespace) || exit 1
if [ -z "$PR_NUMBER" ]; then
  PR_NUMBER=$(glab mr view -F json | jq -er .iid) || exit 1
fi
PR_JSON=$(glab mr view "$PR_NUMBER" -R "$REPO" -F json) || exit 1
PR_HEAD=$(printf '%s' "$PR_JSON" | jq -er .sha) || exit 1
HEAD_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .source_branch) || exit 1
BASE_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .target_branch) || exit 1
```
Carry these values across fresh shells. Every later command targets this repository
and PR, never implicit current-branch detection. A failed query is unknown, not an
empty PR. Tell the user the selected number, title, head → base and head SHA.

3. No PR: **STOP**, suggest the **Open a PR** branch ([open-pr.md](open-pr.md)). CLOSED: **STOP**, ask to reopen it. MERGED:
**STOP**, suggest the **Canary** branch ([canary.md](canary.md)); do not merge again or claim a deploy happened.
Only OPEN (GitLab: `opened`) continues. Before any HEAD-based evidence, require the matching clean checkout:
```bash
LOCAL_HEAD=$(git rev-parse HEAD) || exit 1
LOCAL_BRANCH=$(git branch --show-current) || exit 1
LOCAL_STATUS=$(git status --porcelain) || exit 1
if [ "$LOCAL_HEAD" != "$PR_HEAD" ] || [ "$LOCAL_BRANCH" != "$HEAD_BRANCH" ] || [ -n "$LOCAL_STATUS" ]; then
  echo "LOCAL_TARGET_MISMATCH"
  exit 1
fi
git fetch "https://github.com/$REPO.git" "$BASE_BRANCH" || exit 1   # GitLab: git fetch origin "$BASE_BRANCH"
BASE_SHA=$(git rev-parse FETCH_HEAD) || exit 1
```
Classify the diff against `BASE_SHA` per [diff-scope.md](../../references/diff-scope.md) and keep the `SCOPE_*` flags.
On mismatch, **STOP** and ask the user to save their work, check out/update the PR
branch, and rerun. Do not switch, reset, or stash for them. Preserve `BASE_SHA`, the
PR's commit list and all scope flags before merging; cleanup may change HEAD afterward.
Unknown scope is not docs-only. `DOCS_ONLY=true` requires SCOPE_DOCS and no other scope.

---

## Step 1.5: First-run dry-run validation

Check for prior setup confirmation and changed configuration (not proof of a successful deploy):

```bash
if [ ! -f .context/land-deploy-confirmed ]; then
  echo "FIRST_RUN"
else
  # Check if deploy config has changed since confirmation
  SAVED_HASH=$(cat .context/land-deploy-confirmed 2>/dev/null)
  CURRENT_HASH=$(sed -n '/## Deploy Configuration/,/^## /p' CLAUDE.md 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
  # Also hash workflow files that affect deploy behavior
  WORKFLOW_HASH=$(find .github/workflows -maxdepth 1 \( -name '*deploy*' -o -name '*cd*' \) 2>/dev/null | xargs cat 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
  COMBINED_HASH="${CURRENT_HASH}-${WORKFLOW_HASH}"
  if [ "$SAVED_HASH" != "$COMBINED_HASH" ] && [ -n "$SAVED_HASH" ]; then
    echo "CONFIG_CHANGED"
  else
    echo "CONFIRMED"
  fi
fi
```

**If CONFIRMED:** Say "Setup was previously confirmed." Go to Step 2; do NOT read the dry-run section.

**If FIRST_RUN or CONFIG_CHANGED:** run the dry run in [land-and-deploy/first-run-validation.md](land-and-deploy/first-run-validation.md). Its choice A saves the fingerprint and continues to Step 2; B and C stop.

---

## Step 2: Pre-merge checks

Tell the user: "Checking CI status and merge readiness..."

Run the **CI gate** on exactly `PR_HEAD` (Steps 3 and 4 run it again):

```bash
gh pr view "$PR_NUMBER" --repo "$REPO" --json headRefOid -q .headRefOid
gh pr checks "$PR_NUMBER" --repo "$REPO" --json name,bucket,link
gh pr checks "$PR_NUMBER" --repo "$REPO" --required --json name
gh pr view "$PR_NUMBER" --repo "$REPO" --json headRefOid -q .headRefOid
```
GitLab:
```bash
glab mr view "$PR_NUMBER" -R "$REPO" -F json | jq -r .sha
glab api "projects/:id/pipelines?sha=$PR_HEAD"
glab api "projects/:id" | jq -r .only_allow_merge_if_pipeline_succeeds
glab mr view "$PR_NUMBER" -R "$REPO" -F json | jq -r .sha
```

Both head reads must equal `PR_HEAD`; a moved head or a failed query is ERROR. Grade
each check by `bucket`: `pass`, `skipping` and `neutral` pass, `pending` waits, `fail`
and `cancel` fail. A check named by the `--required` query is `required=y`, any other
`required=n`; when that query failed, every check is `required=?` (a "no required
checks" reply is an empty list, not a failure). GitLab grades the newest pipeline on
the SHA: `success` passes, `running`/`pending` wait, `failed`/`canceled` fail; it is
`required=y` when `only_allow_merge_if_pipeline_succeeds` is true, `n` when false, `?`
when unread. No checks or pipeline on `PR_HEAD` is NO_CHECKS; re-poll once after 60 s
for late registration. Leave out the checks Step 3.5 excluded for this head
(`CI_OVERRIDE`). The verdict is FAIL with any failing check, else PENDING with any
pending, else PASS. Print it as line 1, `VERDICT <verdict> <sha>`, then one line per
check: name, bucket, `required=`, link.

It gates on all checks on this head, required or not. Act on line 1,
`VERDICT <verdict> <sha>` (`<sha>` must be `PR_HEAD`), never on the exit code.
Auth/network/schema errors are ERROR, never "no required checks".
1. ERROR, or FAIL on a `required=y|?` check: **STOP**, show the output.
2. Only `required=n` failures, or NO_CHECKS ("no CI ran on `<sha>`" after a 60 s
   re-poll): Step 3.5 must approve it.
3. PENDING: Step 3. PASS: skip Step 3's wait;
   continue to Step 3.4, then Step 3.5 before merging.

Also check for merge conflicts:
```bash
gh pr view "$PR_NUMBER" --repo "$REPO" --json mergeable -q .mergeable
```
GitLab: `glab mr view "$PR_NUMBER" -R "$REPO" -F json | jq -r '.detailed_merge_status, .merge_status'`
(`conflict` or `cannot_be_merged` is CONFLICTING; `checking`, `unchecked` or no reply is UNKNOWN).
If `CONFLICTING`: **STOP**, resolve conflicts first. Failed/UNKNOWN readback: **STOP**,
readiness is not established.

---

## Step 3: Wait for CI (if pending)

Poll in 4-minute rounds (300 s shell timeout), 15 minutes max; record the wait.
Each round repeats the CI gate (Step 2) every 30 seconds for up to 240 s and ends
early once the verdict leaves PENDING.

Other verdicts follow Step 2. PENDING at 15 minutes: list the still-pending checks;
ask A) wait 15 more minutes, B) exclude named `required=n` checks (Step 3.5
approves each), or C) stop.

---

## Step 3.4: VERSION drift detection

Check that another workspace has not claimed this PR's VERSION since the PR was opened.

```bash
BRANCH_VERSION=$(git show "$PR_HEAD:VERSION" 2>/dev/null | tr -d '\r\n[:space:]')
BASE_VERSION=$(git show "$BASE_SHA:VERSION" 2>/dev/null | tr -d '\r\n[:space:]')
# VERSION claimed by each other open PR against the same base
gh pr list --repo "$REPO" --base "$BASE_BRANCH" --state open --limit 100 --json number,headRefOid \
  --jq ".[] | select(.number != $PR_NUMBER) | \"\(.number) \(.headRefOid)\"" |
while read -r N SHA; do
  V=$(gh api -H "Accept: application/vnd.github.raw" "repos/$REPO/contents/VERSION?ref=$SHA" 2>/dev/null | tr -d '\r\n[:space:]')
  echo "PR #$N VERSION=${V:-none}"
done
```
GitLab: list with `glab mr list -R "$REPO" --target-branch "$BASE_BRANCH" --per-page 100 -F json`
(`.iid`, `.sha`) and read each file with `glab api "projects/:id/repository/files/VERSION/raw?ref=$SHA"`.

Compare numeric version components, not lexical strings. A missing/unparseable
version on only one side is unavailable, not green.

0. Neither `PR_HEAD` nor `BASE_SHA` has a VERSION file (`NO_VERSION=true`):
   print `VERSION check: not applicable (no VERSION file)` and continue to
   Step 3.5. Never expect a version-prefixed title, CHANGELOG version header or tag.
1. A failed `gh`/`glab` query or an invalid result: report VERSION check unavailable
   with the reason; continue to Step 3.5. CI's version gate is the backstop.
2. `BRANCH_VERSION > BASE_VERSION` and no other open PR's VERSION equals it: no drift; continue.
3. `BRANCH_VERSION <= BASE_VERSION`, or another open PR's VERSION equals it: **STOP** with "VERSION drift detected", the versions
   and instructions to rerun the **Open a PR** branch from the feature branch. Its version step ([pipeline/release-prep.md](pipeline/release-prep.md)) reconciles VERSION, the manifest and the CHANGELOG header together. Do NOT
   auto-bump or merge here: duplicate versions can overwrite another branch's release notes.

---

## Step 3.5: Readiness gate

Run [land-and-deploy/readiness-gate.md](land-and-deploy/readiness-gate.md). It ends with the user's merge approval for this exact head, or a stop.

---

## Steps 4-5: Merge and choose the deploy route

Run [land-and-deploy/merge-and-deploy.md](land-and-deploy/merge-and-deploy.md). It ends with `MERGE_SHA` recorded and a deploy route chosen.

---

## Step 6: Wait for deploy (if applicable)

Unless returning for rollback, set `TARGET=production` and `DEPLOY_SHA=MERGE_SHA`. Use the deployment facts from
Steps 3.5/5; preserve status separately from canary health. A reachable URL alone
does not prove this revision deployed. No configured trigger: do not invent one.

### Strategy A: GitHub Actions workflow

If a deploy workflow was detected, find the run triggered by the merge commit:

```bash
gh run list --repo "$REPO" --branch "$BASE_BRANCH" --limit 10 --json databaseId,headSha,status,conclusion,name,workflowName
```
GitLab: `glab api "projects/:id/pipelines?sha=$DEPLOY_SHA&ref=$BASE_BRANCH"`, then its jobs with
`glab api "projects/:id/pipelines/<pipeline-id>/jobs"`.

Match `DEPLOY_SHA`, workflow and target environment. If no run appears yet, repeat
the lookup within the same 20-minute deadline. A name match on another SHA is not evidence.

Poll every 30 seconds:
```bash
gh run view <run-id> --repo "$REPO" --json status,conclusion
```
GitLab: `glab api "projects/:id/pipelines/<pipeline-id>"` (`status`), or watch it with `glab ci view`.

### Strategy B: Platform CLI (Fly.io, Render, Heroku)

If a deploy status command was configured in CLAUDE.md (e.g., `fly status --app myapp`), use it instead of or in addition to GitHub Actions polling.

**Fly.io:** Check the configured app (do not issue `fly deploy`):
```bash
fly status --app {app} 2>/dev/null
```
Look for started Machines and a release tied to `DEPLOY_SHA`; time alone is not proof.

**Render:** Check its release record for the connected branch/revision, then reachability:
```bash
curl -sf {production-url} -o /dev/null -w "%{http_code}" 2>/dev/null
```
Poll every 30 seconds. HTTP 200 proves reachability, not which release is live.

**Heroku:** Check latest release:
```bash
heroku releases --app {app} -n 1 2>/dev/null
```

### Strategy C: Auto-deploy platforms (Vercel, Netlify)

When configured to auto-deploy on this merge, wait 60 seconds, inspect the deployment
record for `DEPLOY_SHA`, then Step 7. No record means deployment UNVERIFIED, not success.

### Strategy D: Custom deploy hooks

Run only the configured read-only status command. Check its exit code and revision
output; a generic health check cannot certify a new deployment.

A recorded command trigger follows Step 5 route 2: it runs from a checkout of the default
branch, by the user or by you only with their explicit approval. A zero exit or a reachable
URL is not revision proof on its own.

### Common: Timing and failure handling

Record deploy start time. Show progress every 2 minutes: "Deploy is still running... ({X}m so far). This is normal for most platforms."

Matching revision successfully deployed: record `DEPLOY_STATUS=PASSED`, duration,
and evidence. Continue to Step 7, or Step 5's URL question if none is available.

If deploy fails/cancels: record `DEPLOY_STATUS=FAILED`, then ask:
- **Re-ground:** "The deploy workflow failed after the merge. The code is merged but may not be live yet. Here's what I can do:"
- **RECOMMENDATION:** Choose A to investigate before reverting.
- A) Let me look at the deploy logs to figure out what went wrong
- B) Revert the merge immediately — roll back to the previous version
- C) Continue to health checks anyway — the deploy failure might be a flaky step, and the site might actually be fine

**A:** Read `gh run view <run-id> --repo "$REPO" --log-failed` (GitLab: `glab ci trace <job-id>`; or configured platform
logs), summarize the cause and evidence limits, then ask: revert (Step 8), inspect
health (Step 7), or finish unverified (Step 9). No automatic code edits or redeploy.
**B:** Step 8. **C:** Step 7 if a URL exists, otherwise Step 5's URL question. A passing
canary never erases FAILED deployment evidence.

At 20 minutes (including waiting for a run to appear), ask: **A)** wait another bounded
20 minutes, **B)** finish without verification. A resets only the wait deadline and
resumes the same lookup/poll; B records pending/unknown deployment and goes to Step 9.
Status-query failure is unknown: show the error and offer the same bounded wait or
finish choices, not a fabricated success. During rollback monitoring, failure offers
logs or a pending report, never a second automatic revert.

---

## Step 7: Post-deploy check (depth by scope)

Tell the user which target/revision is confirmed or unverified, then check its URL.
If browser access is unavailable, record SKIPPED with the reason for this target.
Staging choice A returns to its production route; C goes to Step 9 without claiming
STAGING VERIFIED. Production goes to Step 9 with incomplete health evidence.

Use the saved pre-merge scope and Step 5's precedence rule; URL/triggered-deploy paths
still verify docs-only. Set `TARGET=production` unless entering from staging choice A/C.

| Diff Scope | Canary Depth |
|------------|-------------|
| SCOPE_DOCS only | Smoke when Step 5 routes here; otherwise skipped there |
| SCOPE_CONFIG only | Smoke: the read sequence below; `responseStatus` in `NAV=` must be 200 |
| SCOPE_BACKEND only | Console errors + perf check |
| SCOPE_FRONTEND (any) | Full: console + perf + screenshot |
| Mixed scopes | Full canary |

**The check:** run the browser setup check and the **Page check** in [browser.md](browser.md), saving the screenshot to `.context/deploy-reports/post-deploy.jpg`, plus a `take_snapshot` {filePath: ".context/deploy-reports/post-deploy-snapshot.txt"} before `close_page` as annotated evidence. Read the screenshot so the user sees it. Load time (`loadEventEnd`) must be under 10 seconds.

**Health assessment:**
- Page loads successfully with 200 status (`responseStatus` in `NAV=`) → PASS
- No critical console errors → PASS
- Page has real content (not blank or error screen) → PASS
- Loads in under 10 seconds → PASS

Assess only checks required by the selected depth; mark unperformed checks N/A.
All required checks pass: record HEALTHY for this target. Staging returns through
Step 5a's chosen A/C route; production goes to Step 9. Preserve deployment uncertainty.

If any fail: show the evidence (screenshot path, console errors, perf numbers). Ask:
- **Re-ground:** "I found some issues on the live site after the deploy. Here's what I see: {specific issues}. This might be temporary (caches clearing, CDN propagating) or it might be a real problem."
- **RECOMMENDATION:** Choose based on severity — B for critical (site down), A for minor (console errors).
- A) Accept these observed issues for now — report DEGRADED, not healthy
- B) That's broken — revert the merge and roll back to the previous version
- C) Let me investigate more — open the site and look at logs before deciding

**A:** Record DEGRADED and the user's acknowledgment, then Step 9 (do not silently
continue from failed staging to production verification). **B:** Step 8, only with
explicit rollback approval. **C:** Inspect the page/evidence and read-only logs;
summarize findings, then ask for one recheck (repeat Step 7), rollback (Step 8), or
finish DEGRADED (Step 9). These investigations never modify or redeploy code.
When `ROLLBACK=true`, failures remain ROLLBACK PENDING; offer investigation or report,
not another revert. Keep staging/production screenshots distinct when checking both.

---

## Step 8: Revert (if needed)

Enter only after the user's explicit rollback choice. Explain that this adds inverse
commits; production is not restored until rollback deploys and health is checked.
Require a clean worktree, fetch `BASE_BRANCH` from `REPO`, switch to the local base
and fast-forward only to that fetched tip. Dirty, diverged, or occupied base: **STOP**
with ROLLBACK PENDING, never reset/force or discard work.

Inspect the actual landed commit, not just the requested merge method:
```bash
git show --no-patch --format='%H %P' "$MERGE_SHA"
```
- Two parents: verify parent 1 is the base-side history, then
  `git revert -m 1 "$MERGE_SHA" --no-edit`.
- One-parent **confirmed squash**: `git revert "$MERGE_SHA" --no-edit`.
- **Rebase merge:** establish the exact landed commit range for this PR and revert
  it newest-first. `mergeCommit.oid` alone is only the last commit, not the range.
  Unknown range/method (including an external merge) or other parent shapes: **STOP**
  with ROLLBACK PENDING and request manual rollback; do not guess.

Conflicts: stop, show `git status` and the attempted command, leave resolution to the
user. After a clean revert, record `REVERT_SHA` and push to the selected base:
`git push "https://github.com/$REPO.git" "HEAD:refs/heads/$BASE_BRANCH"` (GitLab: `git push origin "HEAD:refs/heads/$BASE_BRANCH"`). If branch
protection rejects it, keep the commit, create `revert/pr-<number>-<timestamp>` there,
push that branch and open a revert PR against `BASE_BRANCH`
(`gh pr create --repo "$REPO" --base "$BASE_BRANCH" --head "<revert-branch>" --fill`;
GitLab: `glab mr create -R "$REPO" --target-branch "$BASE_BRANCH" --source-branch "<revert-branch>" --fill`). Report its URL and
ROLLBACK PENDING; never merge it without separate approval. Other push errors stop
with the error and pending status, not a protection bypass.

After a successful base push, set `ROLLBACK=true`, `TARGET=production`,
`DEPLOY_SHA=REVERT_SHA`, and reset production deployment/health to UNKNOWN/SKIPPED
for that revision. Keep original/staging evidence separately. Monitor via Steps 6-7
without resetting those values. Only a confirmed rollback deployment
and healthy production canary yields REVERTED (or a confirmed base revert where no
deploy is required). All incomplete, failed, skipped or PR-based rollback paths go
to Step 9 as ROLLBACK PENDING. Preserve the original merge SHA in the report.

---

## Step 9: Deploy report

Choose the first matching verdict; never infer deployment success from merge or HTTP 200:

| Evidence | Verdict |
|----------|---------|
| Rollback requested, not yet confirmed on base and live/healthy (when deploy applies) | ROLLBACK PENDING |
| Rollback confirmed as described in Step 8 | REVERTED |
| Any accepted target-health failure | DEGRADED |
| User chose staging-only and staging passed | STAGING VERIFIED — PRODUCTION UNVERIFIED |
| Explicit no-deploy confirmation or Step 5's docs-only skip | MERGED — NO DEPLOY NEEDED |
| Matching production deployment PASSED and production HEALTHY | DEPLOYED AND VERIFIED |
| Matching production deployment PASSED but canary skipped/unavailable | DEPLOYED (UNVERIFIED) |
| Everything else, including failed/pending/unknown deploy even with a healthy old site | MERGED (UNVERIFIED) |

Display **LAND & DEPLOY REPORT** and save `.context/deploy-reports/{date}-pr{number}-deploy.md`
(`date` = UTC YYYY-MM-DD). Include PR/title/repository, head → base, approved head,
merge timestamp/SHA/method/path, first-run status, CI/review status and warnings,
scope, separate deploy/staging/canary outcomes with evidence links/errors, console
count, load time, screenshot paths (N/A when not checked), verdict and next action.
Record dry-run, CI wait, queue, deploy, staging, canary and total durations in seconds;
skipped stages have duration 0 with a reason, never a fabricated pass. Inline review
is passed/skipped/not-needed; inline fixes stopped before merge and cannot appear here.
For rollback include revert SHA or PR URL and unresolved work.

```bash
mkdir -p .context/deploy-reports
```

---

## Step 10: Suggest follow-ups

State the verdict in plain English. Verified: changes are live. Unverified/degraded:
name the missing evidence/issues and the exact workflow or status command, or the **Canary** branch, to check next. No deploy needed: merged, verification skipped for the stated reason.
Staging-only: production remains unverified, not necessarily undeployed. Rollback
pending: identify who must resolve conflicts, merge the revert PR, or verify its deploy.
REVERTED: cite rollback evidence; do not claim the original branch survived cleanup.
Offer the **Canary** branch for extended monitoring, `/sf-benchmark` on `<url>` when performance
matters, and `/sf-release-docs` when docs need updating, each for the user to run.

---

## Important Rules

- Never force-push, bypass CI, replay a confirmed merge, or hide missing evidence.
- Auto-detect facts; ask when unknown or when an explicit approval gate applies.
- Poll at each step's stated interval and deadline (4-minute CI rounds in Step 3; 30 seconds for merge readback and deploy status), with its progress messages.
- After merge failures, offer approved rollback when appropriate; never revert a rollback automatically.
- Verify once; the **Canary** branch provides extended monitoring. Rechecks require the user's choice.
- Use `--delete-branch` (GitLab: `--remove-source-branch`); reconcile failed cleanup non-destructively with confirmation.
