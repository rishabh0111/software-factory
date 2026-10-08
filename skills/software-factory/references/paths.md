# Paths by work type

The stages each work type runs, in order, and how the hand-offs work. Stage names are the `sf-*` skills without the prefix.

## Build paths

| Work type | Path |
|---|---|
| Idea or feature | spec → holdout → plan → build → verify → review → ship → learn |
| Large or foggy effort | wayfind → spec → holdout → plan → build → verify → review → ship → learn |
| Tracker issue | triage, then the path for the type triage reports. A `ready-for-human` verdict ends the run: report it, a person does the work |
| Bug from a person | triage → debug → holdout → build → verify → review → ship → learn |
| Existing fix to check | (triage →) `sf-verify <run-id> existing-fix <PR, MR or commit>`. Then by its `Existing fix:` outcome: `confirmed` finishes the run; `insufficient fix` continues as a bug from a person at debug, with the artifact linked, and never as a PR competing with it; `inconclusive` waits for a person |
| Machine-reported failure | debug → build → verify → review → ship |
| Security finding | debug → build → verify → review → ship. Merge always needs a person's yes |
| Dependency upgrade | One direct dependency per run. If Renovate or Dependabot is set up, let it make the bump; otherwise bump it with the package manager, never by editing the lockfile by hand. Read the changelog from the old version to the new one and quote its breaking items in the PR/MR body. Then verify. Only if the build is red: debug → build → verify. Then review → ship; review reads the transitive lockfile diff |
| Performance | debug → build → verify → review → ship. The red command is a measurement on the reported path that fails while the metric misses its target; debug records the baseline and its spread across runs. One change at a time: verify's performance gate must show an improvement beyond that spread. A neutral result is reverted, and the attempt is kept as a ledger line |
| Removal or deprecation | spec → holdout → plan → build per batch → verify → review → ship per batch. The spec names who still uses it (count the call sites, consumers and docs), the replacement, and the migration cost; with no replacement and live consumers, ask before going on. Plan it as expand, migrate, contract: add the replacement, move the users, then remove |
| Refactor or migration | spec (target and recipe) → plan as a campaign → build per batch → verify → review → ship per batch. Prefer a codemod tool (ast-grep, OpenRewrite, the language's own) over hand edits; agents handle what the tool can't |
| Small change | build → verify → review → ship. Only for an edit to an existing flow. If the diff grows past about 50 lines, or adds a flow, route, command, dependency or file of production code, switch to the feature path and say so |

**Bug path outcomes from debug.** `already fixed`: finish the run, offering the evidence to the reporter through `sf-triage`. `could-not-reproduce`: call `sf-triage <run-id>` to post a `needs-info` question to the reporter (the attempts are in `## Debug`), and stop. `blocked: <capability>`: stop as `waiting for human`, naming the missing capability.

**Re-read before debug and build.** On a run whose source is a tracker item, re-read the item (comments, state, assignee, linked PRs/MRs) just before `debug` and before `build`. A new fix artifact switches the run to the existing-fix path. A person claiming the work, the item closing, or the request changing sends the run back to `sf-triage`.

**Only heavier.** During a run the path and the lane move only toward more stages. Hidden complexity upgrades: a small change that grows (above), a debug run whose fix needs a behaviour decision (go to spec), a light-lane plan over budget. Write the switch and its reason under Notes in `state.md` and tell the user. Nothing downgrades mid-run, even when the work later looks smaller.

## Wayfind hand-offs

`sf-wayfind` charts a map of decision tickets on the tracker and resolves one per session. Each session ends with a status line in `## Wayfind`:

- `charted`, `resolved`, `waiting`: planned stops. Keep the stage open; the next session resumes from `Next`.
- `destination-reached next=spec`: run `sf-spec`, which reads the `## From map` section in `runs/<id>/brief.md`. Continue the feature path from there.
- `destination-reached next=none`: the effort ended in a locked decision, logged in `decisions.md`. Finish the run.
- `no-map`: the effort turned out small enough for one session. Continue with `sf-spec`.

## Sweep paths

A sweep finds problems; it doesn't fix them. Each finding taken forward becomes its own run.

| Work type | Sweep | Then |
|---|---|---|
| QA sweep | `sf-verify <run-id> qa [flows]`. Writes `evidence/qa/report.md` and one draft per confirmed bug in `evidence/qa/issues/` | For each draft in `evidence/qa/issues/index.md` with `Triage: pending`: call `sf-triage <run-id> draft <path>`, one call per draft. Each `ready` verdict starts a new bug run with that draft as its source |
| Security audit | `sf-review <run-id> security-audit [path]`. Writes `review/security-audit.md` and one draft per confirmed finding in `review/audit/` | Triage each draft as a security item, critical first. Drafts stay local: never post them publicly. Exposed secrets need a person to revoke them first |
| Verify upkeep | `sf-verify <run-id> maintain`: re-drives every feature mapped in `verify.md`, fixes doc drift and harness gaps in one commit on `sf/<run-id>`, and drafts product gaps in `evidence/maintain/issues/` | Triage each draft as for a QA sweep. On `changed`, review → ship the `verify.md` commit like a small change; `clean` ends the run; `blocked` waits for a person |
| Architecture improvement | `sf-review <run-id> architecture-scan [path or direction]`. Writes `review/architecture-scan.md` with a `Recommended:` line | Attended: ask which candidates to take forward, recommending the top one. Unattended: take the recommended one and log it. Each chosen candidate starts a refactor run whose source is its report section |

The sweep run itself ends `done` when its drafts are triaged or its candidates chosen. Record the new run IDs in its `state.md`.

## External PRs and MRs

Triage reads an external PR/MR's diff as text. Its `ready` means the brief lists what is left to do on the diff: the conductor runs verify → review on the PR/MR head, report-only, and passes the findings back through `sf-triage` as one comment under `policy.comment`; it never pushes to the contributor's branch. A collaborator's PR/MR with work left continues as the brief's work type on a branch made from the PR/MR head, reusing what it added. `ready-for-human` means the next step is a person's review and merge: report it and stop.

## Pre-existing bugs found during verify

When a normal run's `sf-verify` finds bugs that also happen on the base commit, it lists them in the report's Notes as drafts. They don't block the run. At finish, offer them for triage the same way as a QA sweep's drafts.
