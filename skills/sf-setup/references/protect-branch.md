# Protecting the main branch

Goal: nothing reaches the default branch except through a pull or merge request whose CI passed. Read the current settings first and change only what's missing. Show every command before running it. Unattended, run none of them: record `branch_protected: pending` with the commands that would finish it.

## GitHub

Read the current protection (a 404 means none):

```
gh api repos/{owner}/{repo}/branches/<branch>/protection
```

Set it: require a pull request with one approval and passing status checks, with the branch up to date before merging.

```
gh api -X PUT repos/{owner}/{repo}/branches/<branch>/protection --input - <<'EOF'
{
  "required_status_checks": { "strict": true, "contexts": [] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "restrictions": null
}
EOF
```

`gh` fills in `{owner}` and `{repo}` from the current repo. This needs admin rights. Private repos on GitHub Free don't support branch protection: report that and suggest a public repo or a paid plan.

`contexts` is empty because CI check names aren't known yet. Once CI has run on a pull request, offer to add its check names here so they become required.

## GitLab (gitlab.com or self-managed)

Use the project path URL-encoded, e.g. `group%2Fapp`. On self-managed, add `--hostname <host>` to each command.

Read the current protection (a 404 means none):

```
glab api projects/<path>/protected_branches/<branch>
```

If the branch isn't protected, protect it so nobody pushes directly and only Maintainers merge:

```
glab api -X POST projects/<path>/protected_branches -f name=<branch> -f push_access_level=0 -f merge_access_level=40
```

If it's already protected with other levels, show the current levels and ask before changing them: the change means unprotecting and re-protecting it (`-X DELETE`, then the POST above).

Require a successful pipeline before merging. This works on every tier, including Free:

```
glab api -X PUT projects/<path> -f only_allow_merge_if_pipeline_succeeds=true
```

These need the Maintainer role or higher. On GitLab Free, approvals don't block a merge, so the Maintainer-only merge rule above is what keeps an agent's account (give it the Developer role) from merging on its own.
