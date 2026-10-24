# Issue tracker: Bitbucket

**Forge:** Bitbucket Cloud (workspace `<workspace>`, repository `<repo>`). **Tracker:** Bitbucket Issues.

Bitbucket has no official CLI for issues; use the REST API with `curl`. Credentials come from the environment: `BITBUCKET_USER` (the account email for an API token) and `BITBUCKET_TOKEN`. Every call below starts with

```bash
BB="https://api.bitbucket.org/2.0/repositories/<workspace>/<repo>"
curl -s -u "$BITBUCKET_USER:$BITBUCKET_TOKEN" -H "Content-Type: application/json" ...
```

The issue tracker must be enabled in the repository settings. Bitbucket Server and Data Center have no issue tracker: use Jira (record it as an "other" tracker) or local files.

## Labels on Bitbucket

Bitbucket issues carry no free labels. Map the roles onto native fields:

- **Category role** → `kind`: `bug` or `enhancement`.
- **State role and `decision-map:` labels** → `component`. Each label string in `docs/agents/triage-labels.md` must exist as a component; components are created by an admin under Repository settings → Issues → Components, since the API cannot create them.
- **`wontfix`** may also set `state` to `wontfix`.

## Operations

- **Create**: `POST $BB/issues` with `{"title": "<title>", "content": {"raw": "<body>"}, "kind": "<kind>", "component": {"name": "<label>"}}`.
- **Read**: `GET $BB/issues/<n>`, and `GET $BB/issues/<n>/comments` for the discussion.
- **List**: `GET $BB/issues?q=<query>` with a filter such as `state="new" OR state="open"` and `component.name="<label>"`, URL-encoded; follow the `next` link to page.
- **Comment**: `POST $BB/issues/<n>/comments` with `{"content": {"raw": "<text>"}}`.
- **Label**: `PUT $BB/issues/<n>` with `{"component": {"name": "<label>"}}`; send `{"component": null}` to clear it.
- **Assign**: look up your id with `GET https://api.bitbucket.org/2.0/user` (`account_id`), then `PUT $BB/issues/<n>` with `{"assignee": {"account_id": "<id>"}}`.
- **Close**: comment the reason, then `PUT $BB/issues/<n>` with `{"state": "resolved"}`, or `"wontfix"`, `"invalid"` or `"duplicate"` as fits.
- **Parent and child**: no native hierarchy. Start the child body with `Part of #<parent>` and list the child in the parent body.
- **Link a blocker**: no native dependency. Start the blocked issue's body with `Blocked by: #<n>, #<n>`. An issue is unblocked when every listed issue is `resolved` or `closed`.

## Pull requests as a request surface

**PRs as a request surface: no.** Set to `yes` when this repository treats outside pull requests as feature requests; `sf-triage` reads this flag.

When `yes`: read with `GET $BB/pullrequests/<n>` and `GET $BB/pullrequests/<n>/diff`, list with `GET $BB/pullrequests?state=OPEN`, comment with `POST $BB/pullrequests/<n>/comments`, close with `POST $BB/pullrequests/<n>/decline`. Pull requests carry no component, so record the triage role as the first line of the triage comment (`Triage: <label>`).

Issues and pull requests use separate number sequences.

## When a skill says

- **"Publish to the issue tracker"**: create an issue.
- **"Fetch the relevant ticket"**: read the issue and its comments as above.

## Decision-map operations

Used by `sf-decision-map`. The **map** is one issue; its **tickets** are child issues.

- **Map**: an issue with component `decision-map:map` whose body holds Notes, Decisions so far and Fog.
- **Child ticket**: an issue whose body starts with `Part of #<map>`, with component `decision-map:<type>`, where type is `research`, `prototype`, `decision-rounds` or `task`, and listed in the map body.
- **Blocking**: the `Blocked by:` line.
- **Frontier**: the map's listed children that are open, have no open blocker and no assignee; the first in map order wins.
- **Claim**: set yourself as assignee, before any other write in the session.
- **Resolve**: comment the answer, set `state` to `resolved`, then add a one-line gist with a link to the map's Decisions so far.
