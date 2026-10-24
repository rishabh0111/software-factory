# Issue tracker: local files

**Forge:** <GitHub | GitLab | Bitbucket | plain git>. **Tracker:** markdown files under `.scratch/`.

Tickets live in the repository as markdown. Pull or merge requests, if any, still open on the forge named above.

## Layout

- One folder per feature or effort: `.scratch/<slug>/`.
- The spec: `.scratch/<slug>/spec.md`.
- Tickets: one file each at `.scratch/<slug>/issues/<NN>-<slug>.md`, numbered from `01`. A ticket is never merged into a shared file.

## Operations

- **Create**: write a new file in the layout above, creating the folder when needed. The ticket number is the next free `NN` in that folder.
- **Read**: open the file. The user usually passes its path or number.
- **List**: scan `.scratch/*/issues/` and read the `Status:` line of each file.
- **Comment**: append to the end of the file under a `## Comments` heading, newest last.
- **Label**: set the `Status:` line near the top to the role's string from `docs/agents/triage-labels.md`. A category role goes on a `Category:` line.
- **Assign**: set an `Assignee:` line.
- **Close**: append the closing reason as a comment and set `Status: closed` (or `Status: wontfix` for a rejected request).
- **Parent and child**: a child lives in its parent's `.scratch/<slug>/issues/` folder; a child of a ticket adds `Part of: <NN>`.
- **Link a blocker**: a `Blocked by: <NN>, <NN>` line near the top. A ticket is unblocked when every listed ticket is closed or resolved.

## When a skill says

- **"Publish to the issue tracker"**: create a file under `.scratch/<slug>/`.
- **"Fetch the relevant ticket"**: read the file at the given path.

## Decision-map operations

Used by `sf-decision-map`. The **map** is one file; each **ticket** is a file beside it.

- **Map**: `.scratch/<effort>/map.md`, holding Notes, Decisions so far and Fog.
- **Child ticket**: `.scratch/<effort>/issues/<NN>-<slug>.md`, with the question in the body, a `Type:` line (`research`, `prototype`, `decision-rounds` or `task`) and a `Status:` line (`open`, `claimed` or `resolved`).
- **Blocking**: the `Blocked by:` line; a ticket is unblocked when every listed file is `resolved`.
- **Frontier**: the ticket files that are open, unblocked and unclaimed; the lowest number wins.
- **Claim**: set `Status: claimed` and save before any other work.
- **Resolve**: write the answer under an `## Answer` heading, set `Status: resolved`, then add a one-line gist with a link to the map's Decisions so far.
