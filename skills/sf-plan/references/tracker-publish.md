# Publishing tickets to the tracker

Only when the user asks. Tickets in `tickets.md` stay the source of truth; the tracker copy is for people to follow along.

## Before publishing

- Read `tracker` in config. If `signed_in` is `pending` or `cli` is `none`, stop and say which sign-in step is missing.
- Publish in dependency order (tickets with no `after` first), so every blocker already has an issue number when a ticket that waits on it is created.
- Skip tickets with status `dropped`, and tickets that already have a `tracker:` value.
- The issue body has no file paths, no secrets, no holdout content and no text copied from logs. Write the body to a temp file and pass the file; never build it from untrusted text inside a shell command line.
- Before each `issue create`, scan the exact body file for secrets with the credential patterns in [../../sf-review/references/security.md](../../sf-review/references/security.md) ("Secrets"), or `gitleaks detect --no-git --source <file>` if installed. Any hit stops publishing; nothing is sent.
- On GitHub, probe once whether sub-issues and issue dependencies work (on the first child and the first blocking edge you create), and record the result in the run's `decisions.md` as one line, e.g. `tracker: sub-issues yes, native blocking no`. Later tickets use what the probe found.
- Find the tracker's ready-for-agent label using the mapping in [../../sf-triage/references/tracker.md](../../sf-triage/references/tracker.md) ("Labels"), reusing an earlier mapping from the decision logs. If it is missing, offer to create it (a person is present when publishing); if declined, add the line `State: ready-for-agent (label not on this tracker)` at the top of each body instead.

## Issue body

```markdown
Part of #<source issue>          <!-- only if the run started from an issue -->
Blocked by: #<n>, #<n>           <!-- only if the ticket has `after` and native blocking isn't available; omit the line otherwise -->

## What to build

<the ticket's Delivers text>

## Acceptance

- Verify: <the ticket's verify line>
- Covers: <the ticket's covers>
- Must not change: <the ticket's must-not-change text>
- Needs a person: <the ticket's hitl step; omit the line when `none`>
```

The title is the ticket's title. The `Blocked by` line is at the top so it shows in previews. When the run started from an issue, also make each ticket a native sub-issue of it where the tracker supports that; the `Part of` line stays as the fallback and for readers.

## Per tracker

| `tracker.kind` | Create | Blocking |
|---|---|---|
| `github` | `gh issue create --title "<title>" --label <ready label> --body-file <file>`. Sub-issue of the source issue: `gh api --method POST repos/<p>/issues/<source>/sub_issues -F sub_issue_id=<db id>` (db id from `gh api repos/<p>/issues/<n> --jq .id`) | Native first: for each `after`, `gh api --method POST repos/<p>/issues/<n>/dependencies/blocked_by -F issue_id=<numeric id of the blocking issue>`, and then omit the `Blocked by` line. If the probe found dependencies unavailable, the `Blocked by` line instead |
| `gitlab` | `glab issue create --title "<title>" --label <ready label> --description "$(cat <file>)"`; relate it to the source issue with `glab issue note <n> --message "/relate #<source>"` | The `Blocked by` line. GitLab Free has no native blocking links. On Premium or Ultimate you may also post `/blocked_by #<n>` as a note (`glab issue note <n> --message "/blocked_by #<m>"`); keep the text line either way |
| `local` | Write `<tracker.local_dir>/<NN>-<slug>.md`; `NN` counts up from `01`, blockers before the tickets that wait on them. The file starts with `State: open` and `Labels: ready-for-agent` lines, then the same body | `Blocked by` names the local numbers |
| `other` | Don't publish. Tell the user the tickets are in `tickets.md` | |

GitLab numbers issues and merge requests separately, so `#12` in an issue body means issue 12.

## After publishing

- Write each issue number (or local file number) into the ticket's `tracker:` field in `tickets.md`.
- Don't close, edit or relabel the source issue.
- When a ticket's status changes to `done`, `sf-build` or `sf-ship` may close its issue; that is their call, not this skill's.

## Closing issues from the PR

A published ticket issue is closed by the PR that ships it, using the keyword the tracker understands. `sf-ship` writes, in the PR body, one line per ticket of the batch being shipped that has a `tracker:` value:

- `Closes #<n>` when the ticket is `done` in this batch.
- `Part of #<n>` when it is `parked`, or only partly delivered (its capability continues in a later batch).

For the source issue the run started from: `Closes #<source>` only on the PR that carries the last open batch and leaves no ticket `parked`; every earlier PR, and one with parked tickets, writes `Part of #<source>`. On a local tracker, `sf-ship` sets `State: closed` in the issue file instead.
