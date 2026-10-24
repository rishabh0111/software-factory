# Issue tracker: GitHub

**Forge:** GitHub (`<owner>/<repo>`). **Tracker:** GitHub Issues.

Use the `gh` CLI. Inside a clone it picks the repository from the remote; elsewhere add `-R <owner>/<repo>`.

## Operations

- **Create**: `gh issue create --title "<title>" --body-file <file>` (write multi-line bodies to a file or pass a heredoc to `--body-file -`). Add `--label "<label>"` per label.
- **Read**: `gh issue view <n> --json number,title,body,state,labels,assignees,comments`.
- **List**: `gh issue list --state open --label "<label>" --json number,title,labels,assignees --limit 200`.
- **Comment**: `gh issue comment <n> --body-file <file>`.
- **Label**: `gh issue edit <n> --add-label "<label>"`, and `--remove-label "<label>"` to take one off.
- **Assign**: `gh issue edit <n> --add-assignee @me`.
- **Close**: `gh issue close <n> --comment "<reason>"`; add `--reason "not planned"` for a rejected request.
- **Parent and child**: create the child with `gh issue create --parent <parent> ...`, or attach it later with `gh issue edit <parent> --add-sub-issue <child>`. On an older `gh` without these flags: `gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-id>`, where `<child-id>` is the database id (`gh api repos/<owner>/<repo>/issues/<child> --jq .id`). Where sub-issues are unavailable, start the child body with `Part of #<parent>`.
- **Link a blocker**: `gh api --method POST repos/<owner>/<repo>/issues/<blocked>/dependencies/blocked_by -F issue_id=<blocker-id>`, with the blocker's database id as above, never its `#number`. The issue's `issue_dependencies_summary.blocked_by` counts its open blockers. Where dependencies are unavailable, start the blocked issue's body with `Blocked by: #<n>, #<n>`. An issue is unblocked when every blocker is closed.

## Pull requests as a request surface

**PRs as a request surface: no.** Set to `yes` when this repository treats outside pull requests as feature requests; `sf-triage` reads this flag.

When `yes`, outside PRs move through the same triage labels as issues:

- **Read**: `gh pr view <n> --comments`, and `gh pr diff <n>` for the code.
- **List outside PRs**: `gh api --paginate 'repos/<owner>/<repo>/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, labels: [.labels[].name]}'`.
- **Comment, label, close**: `gh pr comment`, `gh pr edit --add-label` / `--remove-label`, `gh pr close`.

Issues and PRs share one number sequence, so `#42` may be either: try `gh pr view 42`, then `gh issue view 42`.

## When a skill says

- **"Publish to the issue tracker"**: create an issue.
- **"Fetch the relevant ticket"**: read it as above.

## Decision-map operations

Used by `sf-decision-map`. The **map** is one issue; its **tickets** are child issues.

- **Map**: an issue labelled `decision-map:map` whose body holds Notes, Decisions so far and Fog.
- **Child ticket**: a sub-issue of the map (see **Parent and child**), labelled `decision-map:<type>`, where type is `research`, `prototype`, `decision-rounds` or `task`. Without sub-issues, list the child in a task list in the map body and start the child body with `Part of #<map>`.
- **Blocking**: native dependencies (see **Link a blocker**), with the `Blocked by:` line as the fallback.
- **Frontier**: the map's open children with no open blocker and no assignee; the first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me`, before any other write in the session.
- **Resolve**: comment the answer, close the issue, then add a one-line gist with a link to the map's Decisions so far.
