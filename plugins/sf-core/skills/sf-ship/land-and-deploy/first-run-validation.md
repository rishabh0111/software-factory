# First-run dry run

Step 1.5 of the **Land** branch ([land-and-deploy.md](../land-and-deploy.md)), run only when its check printed `FIRST_RUN` or `CONFIG_CHANGED`. Nothing has been merged or deployed yet.

**CONFIG_CHANGED:** Say "Your deploy configuration changed; I'll validate it again."
**FIRST_RUN:** Say "This is the first run for this project. I'll detect the setup,
test read-only access, and show you what merge would trigger before asking for approval."
Both follow 1.5a-e. Explain each check in plain English; nothing deploys in this dry run.

### 1.5a: Deploy infrastructure detection

Run the deploy configuration bootstrap to detect the platform and settings:

```bash
# Check for persisted deploy config in CLAUDE.md
DEPLOY_CONFIG=$(grep -A 20 "## Deploy Configuration" CLAUDE.md 2>/dev/null || echo "NO_CONFIG")
echo "$DEPLOY_CONFIG"

# If config exists, parse it
if [ "$DEPLOY_CONFIG" != "NO_CONFIG" ]; then
  # Cut at the FIRST ": ", not the last. A greedy 's/.*: *//' ate the scheme of
  # any URL: "Production URL: https://x.com" became "//x.com", because the last
  # ":" belongs to "https:".
  PROD_URL=$(echo "$DEPLOY_CONFIG" | grep -i "production.*url" | head -1 | sed 's/^[^:]*: *//')
  PLATFORM=$(echo "$DEPLOY_CONFIG" | grep -i "platform" | head -1 | sed 's/^[^:]*: *//')
  echo "PERSISTED_PLATFORM:$PLATFORM"
  echo "PERSISTED_URL:$PROD_URL"
fi

# Auto-detect platform from config files
[ -f fly.toml ] && echo "PLATFORM:fly"
[ -f render.yaml ] && echo "PLATFORM:render"
([ -f vercel.json ] || [ -d .vercel ]) && echo "PLATFORM:vercel"
[ -f netlify.toml ] && echo "PLATFORM:netlify"
[ -f Procfile ] && echo "PLATFORM:heroku"
([ -f railway.json ] || [ -f railway.toml ]) && echo "PLATFORM:railway"

# Detect deploy workflows
for f in $(find .github/workflows -maxdepth 1 \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null); do
  [ -f "$f" ] && grep -qiE "deploy|release|production|cd" "$f" 2>/dev/null && echo "DEPLOY_WORKFLOW:$f"
  [ -f "$f" ] && grep -qiE "staging" "$f" 2>/dev/null && echo "STAGING_WORKFLOW:$f"
done
```

If `PERSISTED_PLATFORM` and `PERSISTED_URL` were found in CLAUDE.md, use them directly
and skip manual detection. If no persisted config exists, use the auto-detected platform
to guide deploy verification. If nothing is detected, ask the user
in the decision tree below.

To record deploy settings for later runs, suggest the **Set up deploy** branch ([setup-deploy.md](../setup-deploy.md)).

Parse the output and record: the detected platform, production URL, deploy workflow (if any),
and any persisted config from CLAUDE.md.

### 1.5b: Command validation

Test each detected read-only command. Gather staging facts in 1.5c before displaying
the combined validation table below; no deploy trigger runs during this dry run.

```bash
# Test gh auth (already passed in Step 1, but confirm)
gh auth status 2>&1 | head -3
# GitLab: glab auth status 2>&1 | head -3

# Test platform CLI if detected
# Fly.io: fly status --app {app} 2>/dev/null
# Heroku: heroku releases --app {app} -n 1 2>/dev/null
# Vercel: vercel ls 2>/dev/null | head -3

# Test production URL reachability
# curl -sf {production-url} -o /dev/null -w "%{http_code}" 2>/dev/null
```

Run whichever commands are relevant based on the detected platform. Build the results into this table:

```
╔══════════════════════════════════════════════════════════╗
║         DEPLOY INFRASTRUCTURE VALIDATION                  ║
╠══════════════════════════════════════════════════════════╣
║  Platform:    {platform} (from {source})                   ║
║  App:         {app name or "N/A"}                          ║
║  Prod URL:    {url or "not configured"}                    ║
║  COMMAND VALIDATION                                        ║
║  ├─ gh auth status:     ✓ PASS                             ║
║  ├─ {platform CLI}:     ✓ PASS / ⚠ NOT INSTALLED / ✗ FAIL ║
║  ├─ curl prod URL:      ✓ PASS (200 OK) / ⚠ UNREACHABLE   ║
║  └─ deploy workflow:    {file or "none detected"}          ║
║  STAGING DETECTION                                         ║
║  ├─ Staging URL:        {url or "not configured"}          ║
║  ├─ Staging workflow:   {file or "not found"}              ║
║  └─ Preview deploys:    {detected or "not detected"}       ║
║  WHAT WILL HAPPEN                                          ║
║  1. Wait for all CI on this head (CI gate)                ║
║  2. Readiness checks and explicit merge approval          ║
║  3. Merge PR via {merge method}                            ║
║  4. {Wait for deploy workflow / Wait 60s / Skip}           ║
║  5. {Run canary verification / Skip (no URL)}              ║
║  MERGE METHOD: {squash/merge/rebase} (from repo settings)  ║
║  MERGE QUEUE:  {detected / not detected}                   ║
╚══════════════════════════════════════════════════════════╝
```

**Validation failures are WARNINGs, not BLOCKERs** (except `gh auth status` which already
failed at Step 1). If `curl` fails, note "I couldn't reach that URL — might be a network
issue, VPN requirement, or incorrect address. Health verification is unavailable."
If platform CLI is not installed, note "The {platform} CLI isn't installed on this machine.
Platform status is unavailable. HTTP checks can show reachability, not a deployed
revision; I'll need the configured trigger and its deployment evidence."

### 1.5c: Staging detection

Check for staging environments in this order:

1. **CLAUDE.md persisted config:** Check for a staging URL in the Deploy Configuration section:
```bash
grep -i "staging" CLAUDE.md 2>/dev/null | head -3
```

2. **GitHub Actions staging workflow:** Check for workflow files with "staging" in the name or content:
```bash
for f in $(find .github/workflows -maxdepth 1 \( -name '*.yml' -o -name '*.yaml' \) 2>/dev/null); do
  [ -f "$f" ] && grep -qiE "staging" "$f" 2>/dev/null && echo "STAGING_WORKFLOW:$f"
done
```

3. **Vercel/Netlify preview deploys:** Check PR status checks for preview URLs:
```bash
gh pr checks "$PR_NUMBER" --repo "$REPO" --json name,state,bucket,link
```
GitLab: `glab api "projects/:id/environments?states=available"` (`name`, `external_url`).
Look for check names containing "vercel", "netlify", or "preview" and inspect the
link for a preview URL. A check-details link is not necessarily the preview itself.

Record candidates, not proof that this revision is deployed. Step 3.5 refreshes
deployment facts on every run, and handles any true staging-first request before merge.

### 1.5d: Readiness preview

Tell the user: "Before I merge any PR, I run a series of readiness checks — code reviews, tests, documentation, PR accuracy. Let me show you what that looks like for this project."

Preview the readiness checks that will run at Step 3.5 (without re-running tests):

```bash
gh pr view "$PR_NUMBER" --repo "$REPO" --json reviews --jq '.reviews[] | {author: .author.login, state, commit: .commit.oid, submittedAt}'
```
GitLab: `glab api "projects/:id/merge_requests/$PR_NUMBER/approvals"` (`approved_by`; approvals record no commit).

Show a summary of review status: which reviews have been run, how stale they are.
Also check if CHANGELOG.md and VERSION have been updated.

Explain in plain English: "When I merge, I'll check: has the code been reviewed recently? Do the tests pass? Is the CHANGELOG updated? Is the PR description accurate? If anything looks off, I'll flag it before merging."

### 1.5e: Dry-run confirmation

Tell the user: "That's everything I detected. Take a look at the table above — does this match how your project actually deploys?"

Present the full dry-run results to the user:

- **Re-ground:** "First deploy dry-run for [project] on branch [branch]. Above is what I detected about your deploy infrastructure. Nothing has been merged or deployed yet — this is just my understanding of your setup."
- Show the infrastructure validation table from 1.5b above.
- List any warnings from command validation, with plain-English explanations.
- If staging was detected: "I found {url/workflow}. A staging URL does not prove production is held. Before merge I'll check the triggers; afterward I can verify an existing staging deployment, but production may already be live."
- If no staging was detected: "I didn't find staging. I'll identify what merge triggers before asking you to approve it."
- **RECOMMENDATION:** Choose A if all validations passed. Choose B if there are issues to fix. Choose C to configure deploys more thoroughly with the **Set up deploy** branch.
- A) That's right — this is how my project deploys. Let's go.
- B) Something's off — let me tell you what's wrong
- C) I want to configure this more carefully first (the **Set up deploy** branch)

**If A:** Say "Setup confirmed. I'll save its fingerprint, skip unchanged dry runs,
and still refresh deployment facts before each merge approval."

Save the deploy config fingerprint so we can detect future changes:
```bash
mkdir -p .context
CURRENT_HASH=$(sed -n '/## Deploy Configuration/,/^## /p' CLAUDE.md 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
WORKFLOW_HASH=$(find .github/workflows -maxdepth 1 \( -name '*deploy*' -o -name '*cd*' \) 2>/dev/null | xargs cat 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
echo "${CURRENT_HASH}-${WORKFLOW_HASH}" > .context/land-deploy-confirmed
```
Continue to Step 2.

**If B:** **STOP.** "Tell me what's different about your setup and I'll adjust. You can also run the **Set up deploy** branch to walk through the full configuration."

**If C:** **STOP.** "The **Set up deploy** branch walks through your deploy platform, production URL, and health checks in detail. It saves everything to CLAUDE.md so I'll know exactly what to do next time. Run the **Land** branch again when that's done."

---
