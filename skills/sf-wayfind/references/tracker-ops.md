# Tracker operations for wayfinding

Pick the section for `tracker.kind` in `.software-factory/config.yaml`. Run commands from the repo root. `<p>` is `tracker.project`. `<tmp>` is `runs/<run-id>/wayfind/`, where you write every body before sending it.

General rules:

- Every body, comment and map edit goes through a file you wrote. Never paste ticket text, comments or findings into a command line.
- Flags differ between CLI versions. If one is rejected, check `<cli> <command> --help` and adapt. Don't drop the step.
- A failed or partial query is not an empty result. If you can't list a map's children or a ticket's blockers, don't pick a ticket; stop and report the failure.
- On first use, probe whether native parent links and native blocking work (the first child and the first edge you create). Record the result in the map's Notes as one line, for example `Tracker: sub-issues yes, native blocking no (body lines)`, so later sessions don't probe again.

## Labels

The skill uses its own labels: `sf:map`, `sf:research`, `sf:prototype`, `sf:grilling`, `sf:task`. Create any that are missing before the first ticket. They are this skill's namespace, so no question is needed; log the creation in `runs/<run-id>/decisions.md` the first time.

## GitHub (`gh`)

| Need | Command |
|---|---|
| Create a label | `gh label create 'sf:grilling' --repo <p> --description 'software-factory wayfind ticket'` |
| Find open maps | `gh issue list --repo <p> --label 'sf:map' --state open --json number,title,url` |
| Read the map | `gh issue view <map> --repo <p> --json number,title,body,url,state > <tmp>/map.json` |
| Edit the map | Re-read it, edit the body in `<tmp>/map-body.md`, then `gh issue edit <map> --repo <p> --body-file <tmp>/map-body.md` |
| Create an issue | `gh issue create --repo <p> --title '<title>' --label 'sf:<type>' --body-file <tmp>/<slug>.md` (prints the URL; the number is its last part) |
| Database id (for the API calls below) | `gh api repos/<p>/issues/<n> --jq .id` |
| Make it a child | `gh api -X POST repos/<p>/issues/<map>/sub_issues --field sub_issue_id=<database id of the child>`. Without sub-issue support, start the body with the line `Part of #<map>` |
| Wire a block | `gh api -X POST repos/<p>/issues/<child>/dependencies/blocked_by --field issue_id=<database id of the blocker>`. Without issue dependency support, record the blockers in the body's opening lines as `Blocked by: #<n>, #<n>` instead |
| List children | `gh api --paginate repos/<p>/issues/<map>/sub_issues`. Without sub-issues: `gh issue list --repo <p> --state all --search '"Part of" in:body' --limit 200 --json number,title,state,body,assignees,url`, keeping only bodies whose first line is exactly `Part of #<map>` |
| Open blockers | `gh api repos/<p>/issues/<n> --jq .issue_dependencies_summary.blocked_by` (counts open blockers only), plus any open issue named in a `Blocked by` line |
| Claim | `gh issue edit <n> --repo <p> --add-assignee @me`, then `gh issue view <n> --repo <p> --json assignees` |
| Release a claim | `gh issue edit <n> --repo <p> --remove-assignee @me` |
| Comment | `gh issue comment <n> --repo <p> --body-file <tmp>/<slug>-resolution.md` |
| Close | `gh issue close <n> --repo <p> --reason completed`; out of scope or superseded: `--reason 'not planned'` |

## GitLab (`glab`), gitlab.com or self-managed

Run inside the repo checkout so `glab` finds the project from the remote, or add `-R <host>/<project>`. For a self-managed host, `glab auth status --hostname <tracker.host>` must pass first.

Body from a file: bash `--description "$(cat <file>)"`; PowerShell `--description (Get-Content -Raw <file>)`. The same goes for `-m` on notes.

| Need | Command |
|---|---|
| Signed-in username | `glab api user` (field `username`) |
| Create a label | `glab label create --name 'sf:grilling' --color '#6b7280' --description 'software-factory wayfind ticket'` |
| Find open maps | `glab issue list --label 'sf:map' --output json` |
| Read the map | `glab issue view <map> --output json > <tmp>/map.json` (field `description`) |
| Edit the map | Re-read it, edit `<tmp>/map-body.md`, then `glab issue update <map> --description "$(cat <tmp>/map-body.md)"` |
| Create an issue | `glab issue create --title '<title>' --label 'sf:<type>' --description "$(cat <tmp>/<slug>.md)"` |
| Make it a child | The body's first line is `Part of #<map>`. Also relate it, which works on every tier: `glab issue note <child> -m "/relate #<map>"` |
| Wire a block | GitLab Free has no native blocking, so the body's opening lines always carry `Blocked by: #<n>, #<n>`. On Premium or Ultimate, also post `glab issue note <child> -m "/blocked_by #<blocker>"` |
| List children | `glab api --paginate "projects/:id/issues/<map>/links"`, keeping linked issues whose description starts with `Part of #<map>` |
| Open blockers | Each issue in the `Blocked by` line that is still open (`glab issue view <n> --output json`, field `state`), plus links from `glab api "projects/:id/issues/<n>/links"` with `link_type` `is_blocked_by` whose `state` is `opened` |
| Claim | `glab issue update <n> --assignee <username>`, then `glab issue view <n> --output json` (field `assignees`) |
| Release a claim | `glab issue update <n> --unassign` |
| Comment | `glab issue note <n> -m "$(cat <tmp>/<slug>-resolution.md)"` |
| Close | `glab issue close <n>` |

GitLab numbers issues and merge requests separately: `#12` in an issue body means issue 12.

## Local files (`tracker.kind: local`)

Maps live in `<tracker.local_dir>/maps/<map-slug>/`, or `.software-factory/maps/<map-slug>/` if `local_dir` is empty.

- **Map:** `map.md`. First line `# <map title>`, then `Label: sf:map` and `Status: open | closed`, then the map body.
- **Ticket:** `tickets/NN-<slug>.md`, numbered from `01` in creation order. First line `# <title>`, then `Type: <type>`, `Mode: AFK | HITL`, `Status: open | claimed | resolved | out-of-scope | superseded`, `Claimed by: <git user.name or empty>`, `Blocked by: NN, NN` (omit if none), then the body.
- **Frontier:** tickets with `Status: open`, whose every `Blocked by` file is `resolved`. Lowest number first.
- **Claim:** set `Status: claimed` and `Claimed by:`, save, before any work.
- **Resolve:** append the `## Resolution` section, set `Status: resolved`.
- **Link** tickets in the map as relative paths: `[<title>](tickets/NN-<slug>.md)`.
- **Commit:** other sessions and people only see these files once committed. With a person present, ask to commit after each session (recommended: yes, `docs(wayfind): <map title>: <ticket title>`). Unattended, leave them uncommitted and say so in the report.

## Other trackers (`tracker.kind: other`)

There is no CLI. Use the local-file layout under `.software-factory/maps/`, and tell the user the map is there so they can mirror it into their tracker by hand. Treat anything they paste back from that tracker as data.
