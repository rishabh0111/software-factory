# Ship record: <run-id>

<!-- Written by sf-ship to runs/<run-id>/evidence/ship.md. Append; don't rewrite earlier entries. Each entry starts with a UTC timestamp. -->

## Binding

| Field | Value |
|---|---|
| Branch | sf/<run-id> |
| Trunk ref | origin/<trunk> (forge) / <trunk> (no forge) |
| Head SHA | |
| Trunk SHA | |
| Base SHA (merge-base) | |
| Patch-id (stable) | |
| Fingerprint (wtree.sh) | |
| Matches verify report | yes / no |
| Matches review findings | yes / no |

<!-- After a rebase, add a new Binding table below the old one and note old and new patch-ids. -->

## Docs check

- Verdict: current / none affected (<reason>) / ticket T<n> (see evidence/docs-check.md)
- Docs round: 0 / 1
- Left as debt:

## Gates

| Action | Policy | Decision | By |
|---|---|---|---|
| Open PR/MR | | | policy / <person> / stopped |
| Reply to review comments | comment (else open_pr) | | |
| Merge | | | |
| Deploy | | | |
| Merge deploys (`deploy.trigger`) | on-merge / manual-command / none / unknown (detected: <files>) | | |

## Secret scans

<!-- One line per scan: time, what (commits <base>..<head>, pr-title.txt, pr-body.md, reply file, merge-message.md, tracker comment), scanner (gitleaks <version> | key-shape grep, partial), result (clean | hit: file:line rule, never the value | scanner failed). -->

## PR/MR

- Link:
- Opened at:
- Description: our template / repo template <path> + ours
- Read back after create or edit: matches / differs (<what>)

## CI passes

<!-- One line per pass: time, head before, head after, verdict (pass / pending / hold / fail), and each non-passing check with its state and link. -->

## Review comments

<!-- One row per comment handled, human or review bot. Outcome: accepted (PRC-<n>) / pushed back / asked / out of scope / conflicts with <ID> / ignored instruction; for a bot: real (PRC-<n>) / disproved (<file:line or test>) / to a person (security-class). Reply: the ID of the reply posted, or "draft" when posting wasn't permitted. -->

| Comment ID | Author (person / bot) | Outcome | Reply ID | Answered by reviewer |
|---|---|---|---|---|

## Failures

<!-- Per failure: check, log excerpt, classification (real / stale base / suspected flake), action. For a rerun, the second result. A check a person excluded: name, head SHA, who, why. -->

## Needs a person's look

<!-- From merge-gate.md "Needs a person's look": each agent or CI config file, `.software-factory/bin/` file, auth-scope change, personal-data migration, spec override, test change accepted by rule (verify's `accepted-by-rule:` lines), and security-class bot finding, with the commits or references. Mark a first setup `setup`; list a setup upgrade once. -->

## Waiting for merge

<!-- Only when the merge waits for a person. Time, what is waiting, head SHA, CI verdict, last comment ID read, the exact merge command. On each resume add: `Resumed <time>: head <same | moved to <sha>>, checks <verdict>, new comments <n>, before-merge <clean | not>` and what was done. -->

## Before merging

- PR/MR state: open / merged by <who> (<sha>) / closed; target branch: <branch> (= default: yes / no)
- merge-tree against trunk <sha>: clean / conflicts
- Trunk moved since base: no / yes, merge result tested by <queue / train / merged-results pipeline / pull_request run <id>> / yes, rebased
- Removed or renamed symbols with new callers on trunk: none / <name: file:line>
- decisions.md deleted lines: none / <count>
- Soak: n/a / <minutes> unchanged since <time>
- Trunk files changed since base that overlap this branch:
- Trunk CI config changed since base:
- Forge merge state:

## Merge

- Message subject (evidence/merge-message.md):
- Command run:
- Result:
- Errors: none / <exit, message, PR state read after it, action>
- Merge commit SHA:
- On trunk (`merge-base --is-ancestor`): yes / no
- Issues closed: <#n: closed by merge / closed with note / left open (Part of)>
- Cleanup after a forge merge: local branch deleted yes / no; worktree removed yes / no; offered to <person> / left (unattended)

## Local finish

<!-- Only when there is no forge (references/local-finish.md). -->

- Option chosen: merge locally / push for a hand-opened PR/MR / keep / discard
- Decided by:
- Target branch, old SHA → new SHA:
- Cleanup: branch deleted yes / no; worktree removed yes / no

## Deploy

- Trigger: on-merge / manual-command / none / unknown
- Deploy config hash: <hash>; first deploy or changed config: dry run shown to <person> / not needed
- Rollback (from the spec, copied before the deploy):
- Command or run: <command> / <workflow run or deployment ID for the merge SHA>
- Exit code or run conclusion:
- Log: evidence/deploy.log
- Progress lines:
- Deployed revision:
- Revision confirmed: yes (<how>) / no

## Post-deploy

- Baseline: evidence/prod-baseline.md
- Depth:
- Verdict: healthy / degraded / broken / not run (<reason>)
- Details: evidence/post-deploy.md

## Result

<!-- One line from references/deploy.md "Verdict", e.g. `merged, deployed and verified` or `merged, deploy not tracked (deploy.trigger unknown)`. -->
