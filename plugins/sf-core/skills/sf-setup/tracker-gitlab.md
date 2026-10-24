# Issue tracker: GitLab

**Forge:** GitLab (`<host>`, project `<group>/<project>`). **Tracker:** GitLab Issues.

Use the `glab` CLI. Inside a clone it picks the project from the remote; elsewhere add `-R <group>/<project>`. For a self-hosted instance, log in once with `glab auth login --hostname <host>`. GitLab calls comments **notes** and pull requests **merge requests** (MRs).

## Operations

- **Create**: `glab issue create --title "<title>" --description "$(cat <file>)" --label "<label>"`. Several labels go comma-separated.
- **Read**: `glab issue view <n> --comments`, or `-F json` for structured output.
- **List**: `glab issue list --label "<label>" -O json`; add `--closed` or `--all` to widen the state.
- **Comment**: `glab issue note <n> --message "<text>"`.
- **Label**: `glab issue update <n> --label "<label>"`, and `--unlabel "<label>"` to take one off.
- **Assign**: `glab issue update <n> --assignee @me`.
- **Close**: post the reason as a note first, then `glab issue close <n>`, which takes no comment of its own.
- **Parent and child**: GitLab issues have no general parent field. Start the child description with `Part of #<parent>` and link the two: `glab api --method POST projects/:id/issues/<parent>/links -f target_project_id=<project-id> -f target_issue_iid=<child> -f link_type=relates_to`. Where the tier offers epics or tasks, they may hold the hierarchy instead; the linked issue works on every tier.
- **Link a blocker**: post the quick action as a note on the blocked issue: `glab issue note <blocked> --message "/blocked_by #<blocker>"`. Blocking links need a paid tier; on the free tier, start the blocked issue's description with `Blocked by: #<n>, #<n>`. Read a ticket's links with `glab api projects/:id/issues/<n>/links`. An issue is unblocked when every blocker is closed.

## Merge requests as a request surface

**MRs as a request surface: no.** Set to `yes` when this repository treats outside merge requests as feature requests; `sf-triage` reads this flag.

When `yes`, outside MRs move through the same triage labels as issues:

- **Read**: `glab mr view <n> --comments`, and `glab mr diff <n>` for the code.
- **List outside MRs**: `glab mr list -F json`, keeping only those whose author is not a project member.
- **Comment, label, close**: `glab mr note`, `glab mr update --label` / `--unlabel`, `glab mr close`.

Issues use `#42` and MRs `!42`; the two number sequences are separate.

## When a skill says

- **"Publish to the issue tracker"**: create an issue.
- **"Fetch the relevant ticket"**: `glab issue view <n> --comments`.

## Decision-map operations

Used by `sf-decision-map`. The **map** is one issue; its **tickets** are child issues.

- **Map**: an issue labelled `decision-map:map` whose description holds Notes, Decisions so far and Fog.
- **Child ticket**: an issue whose description starts with `Part of #<map>`, linked to the map (see **Parent and child**), labelled `decision-map:<type>`, where type is `research`, `prototype`, `decision-rounds` or `task`.
- **Blocking**: native blocking links (see **Link a blocker**), with the `Blocked by:` line as the fallback.
- **Frontier**: the map's open children with no open blocker and no assignee; the first in map order wins.
- **Claim**: `glab issue update <n> --assignee @me`, before any other write in the session.
- **Resolve**: note the answer, close the issue, then add a one-line gist with a link to the map's Decisions so far.
