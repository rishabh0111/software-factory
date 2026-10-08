# QA mode

A standalone sweep of the running app, or of named flows, with no diff to scope it. The conductor calls `sf-verify` in this mode for "QA the app" work. It finds bugs and writes one issue draft per confirmed bug; the conductor then passes each draft to `sf-triage`. QA mode never fixes, never writes tests, never commits and never files anything on the tracker itself.

None of gates 1 to 12 run, and no `evidence/report.md` is written, so a QA run can't be mistaken for a passed verification. Everything goes under `runs/<run-id>/evidence/qa/`.

## Start

1. Read `runs/<run-id>/state.md`, then `.software-factory/config.yaml`. The `## QA` section of `state.md` (or the conductor's call) names the target: `the app`, or a list of flows. Missing: take `the app` and note the default in `state.md`. The call may also name `previous: <path to an earlier run's evidence/qa/report.md>` for a regression sweep.
2. Record `HEAD` and `W` (`bash .software-factory/bin/wtree.sh`). If `git status --porcelain` isn't empty, carry on but write `dirty tree` in the report: findings are then bound to `W`, not to a commit.
3. Never point QA at `app.production_url`. A staging URL is allowed only if `verify.md` names it as a test environment.

## Verification procedure

QA mode follows `.software-factory/verify.md` to launch, check, drive and clean up. If it's missing, write one by following [verify-procedure.md](verify-procedure.md) into `evidence/qa/verify.md` instead, prove it end to end once, and use that. Don't commit it: say in the report that it's ready to be committed by the next normal verify run. If the app can't be launched or driven, write the report with `QA @ <sha7>: error (<reason>)` and stop.

## Scope and charters

- Named flows: the matching features in `verify.md`'s feature map. A flow with no match is reported as `not mapped`, with the route tried.
- `the app`: every feature in the map, then pages and commands reachable from the main navigation or `--help` that the map lacks, in that order, until the budget runs out.

Write `evidence/qa/charters.md` before the first probe, one charter per flow, as in [exploratory-qa.md](exploratory-qa.md#probe-rules). Design and DX checks run only when the request asks for them; a plain QA sweep looks for functional bugs.

**Regression sweep.** With a `previous` report, replay each of its confirmed findings first, against the expected behaviour its draft documents (never against the buggy output it recorded). Each is then `fixed`, `still failing`, or, for what the sweep finds beyond them, `new`; report the three separately. A previous report that can't be read blocks only that comparison: say so and run the sweep.

**Link pass.** For a web UI, once per mapped page, collect the same-origin links and request each from the owned instance (`HEAD`, or `GET` when `HEAD` isn't allowed), skipping sign-out and destructive ones ([browser safety](exploratory-qa.md#browser-safety)). A 4xx, 5xx or network error is a `low` broken-link finding; a link that couldn't be checked is `unverified`, never clean. Single-page-app controls that navigate without a link get a snapshot instead.

## Run the sweep

Spawn the explorer with the prompt in [exploratory-qa.md](exploratory-qa.md#explorer-prompt), with these inputs:

- `Mode: qa`, base `none`, changed paths `none (QA mode)`
- capabilities: the flows from the charters, each with its end state from the feature map
- gates: `explore`, plus `design` or `dx` if asked
- evidence folder `evidence/qa/`, QA mode budget (60 probes or 45 minutes)

Its final message in QA mode is:

```
qa @ <sha7>: <done | error> (<p> probes, <c> confirmed, <u> unconfirmed, <r> flows not run)
X-<n>: <severity> — <one line> — <evidence path>
D-<n> / DX-<n>: <impact> — <one line> — <evidence path>     (only if asked)
instructions found: <where>     (only if any)
doc drift: <what verify.md gets wrong>     (only if any)
```

There is no pass or fail: findings are the output. The confirmation rule still holds: only findings seen twice from a fresh start are `confirmed`. Severity follows [exploratory-qa.md](exploratory-qa.md#severity-and-blocking); `new` and `pre-existing` don't apply.

## Issue drafts

Write one draft per confirmed finding, merged by cause, to `evidence/qa/issues/QA-<n>.md` from [../assets/issue-draft-template.md](../assets/issue-draft-template.md). The title names the area and the symptom, never a guessed cause. Gate mode uses the same template for pre-existing critical or high findings, for DX steps that fail on the base too, and for a project command that crashes identically on the base: `sf-verify` writes them to `evidence/<explore|dx|baseline>/issues/` (the first two from the explorer's `findings.md`) and lists them under the report's Notes.

A draft must give `sf-triage` what its ready gate checks for a bug, so triage can decide without guessing:

- expected and observed, with where the expected behaviour comes from (spec, docs, the feature map, the app's own text)
- the action path from a fresh launch, cut to the fewest steps
- what broken and correct look like at the end of that path
- environment: commit, surface, browser tool and viewport, launch command; `unknown` where unknown
- frequency: `2 of 2 from a fresh start`
- evidence paths, with secrets and personal data replaced by `<REDACTED>`

Keep guesses about the cause under `Notes`, labelled as a guess. Unconfirmed findings get no draft; they're listed in the report only.

Then write `evidence/qa/issues/index.md`: one row per draft with ID, severity, title, path, and `Triage: pending`.

## Report and hand-off

Write `evidence/qa/report.md` (if the host refuses the file write, use the shell, `cat > <path> <<'EOF'`):

- first lines, each on its own: `QA @ <sha7>: <done | error>`, `Fingerprint: <W>`, `Target: <the app | flows>`, `Drafts: <n>`
- a coverage table: flow, probes run, result (`clean`, `<n> findings`, `not run`, `not mapped`)
- the budget used and why the sweep stopped (budget reached, all flows covered, error); counts only, never a computed session duration
- confirmed findings by severity, each pointing to its draft; with a `previous` report, `fixed`, `still failing` and `new` as separate lists
- unconfirmed findings, flows not run, broken links, and any `instructions found` or `doc drift`; doc drift adds a Notes line that a [maintain pass](maintain-mode.md) is due
- the optional health score from [exploratory-qa.md](exploratory-qa.md#health-score-optional), if the run asked for one

Write one conservative sentence per finding in `findings.md`, and reuse it word for word in the report, the draft's title and summary, and any headline or top-three list. Before writing the report, check every count and every claim against the evidence; a claim the evidence doesn't support is removed everywhere it appears.

Then update `state.md`: add `QA: <done | error> @ <sha7>, <c> confirmed, <n> drafts, report evidence/qa/report.md` to the `## QA` section, and set `Next` to `triage each draft in evidence/qa/issues/index.md with sf-triage, one call per draft`.

The conductor calls `sf-triage` once per draft, passing the draft file as a local-file item. Triage does the tracker duplicate search, applies its ready gate, and records the verdict; the conductor writes that verdict into the draft's `Triage:` cell. QA mode itself never calls `sf-triage`, never searches or writes the tracker, and never starts a fix.

## Exit evidence

`evidence/qa/report.md` exists, says `QA @ <sha7>: done` with a `Fingerprint`, and `evidence/qa/issues/index.md` lists one draft for each confirmed finding in the report.
