# Publish the PR

Stage 10 of [the Open a PR branch](../open-pr.md): write the title and body, then create or update the pull or merge request. A run that must not open a PR (`--no-pr`, an automation lane, an unattended parent that says so) takes [handoff.md](handoff.md) instead.

## 1. Find the existing PR

```bash
gh pr list --head <branch> --state open --json number,title,url,isDraft
glab mr list --source-branch <branch> -F json
```

An empty list means a new PR; one match is the PR to update. A failed lookup or several matches stop publication until resolved: never read them as "no PR". Repeat the lookup right before publishing; if the PR or its title changed in between, prepare the title again and write a fresh body.

## 2. Title

A new PR: `<type>(<scope>): <summary>` in Conventional Commits form, naming the change the way the CHANGELOG leads with it. An existing PR keeps its title unless it no longer describes the branch. When the title or body mentions a version, it is the version stage 8 wrote. Write the title into a file with your file-write tool; it is never typed into a shell argument.

## 3. Links

- **Issues:** collect references from `git log origin/<base>..HEAD --format=%B` (`#N`, `fix #N`), each issue the user named as fixed, and each failing CI run this branch fixes. Interactive runs ask once about bare `#N` references; a `fix #N` answer promotes one to fixed. `Supersedes #N` or `Credit #N` for a related PR only when its owner confirms. Use the forge's closing syntax from `docs/agents/issue-tracker.md`.
- **Plan ticket:** when the plan bound in stage 6 names a tracker ticket, the PR closes it (`Closes #N`) only when the plan audit passed with every item DONE or CHANGED and every verification check passed. Partial, deferred, dropped or unverified scope writes `Linked to #N (partial delivery, not auto-closing)` and names the remaining work. Never infer a ticket number from a branch name.
- **Plan binding:** add `Plan: <repo-relative path>` so a rerun binds the same plan.

## 4. Pictures

Pick the smallest evidence that shows the change worked: one to three before/after pairs, the strongest first.

- **A visible change** (a page, a component, a rendered doc): screenshot the changed screen at the base and on this branch, at the same viewport, with the browser [../browser.md](../browser.md) sets up. The base side runs from a worktree at `origin/<base>` when it can run locally; otherwise use the after-picture alone and say so. Save both under `.context/pr-shots/` and show them to the user.
- **A CLI change:** save the output of a command this run already ran, at the base and on this branch, to `.context/pr-shots/before.txt` and `after.txt`. Never run a command with side effects just to make a picture.
- **No visible surface:** the test output that went from failing to passing, or the source section that shows the change.

A screenshot reaches the PR body only when the host gives you a way to upload it to the forge and the repository is public, or the user approved images for a private one (recorded in **Decisions**). Embed the URL the upload returns, with the caption as alt text. Otherwise, and whenever an upload fails, the body carries the text version: the caption, then a collapsed before/after of the captured text or a description of what the screenshot shows. Never block publication on an image, and never put a capture that shows a secret anywhere: recapture without it.

## 5. The body

Skip preambles and keep prose brief, in the domain language of the project's glossary. Sections whose stage did not run are left out, except **Documentation**, which is always present. Never reuse an earlier run's body. Results that are unavailable, partial or not run are written as such, never as passed.

````markdown
## Summary

<The smallest view that makes the key point clear, next to one or two lines of text. Pick one or two of:
- pseudocode for logic or an algorithm;
- a call tree for runtime control flow;
- a component tree for UI structure, with the state and module boundaries that matter;
- a shallow file tree for file responsibility or a broad refactor;
- a Mermaid sequence or flow diagram for component interaction or data flow;
- a `diff` of one of the above when the point is what changes in a shape that already exists;
- the whole block when most of it is new or a copyable target shape is needed.
Keep only the calls, files, props, states and boundaries the reader needs. Group the substantive commits by theme in one or two lines; never paste the commit list.>

## Evidence

- **Before:** <screenshot, output, or the failing test run>
  **After:** <screenshot, output, or the passing test run>

Screenshots are the strongest evidence for a visual change; execution evidence (the exact test that went red to green, console output) is next.

<Tests ran: one line per lane, "<lane>: N", or "<lane>: count unavailable".>
<Coverage: the stage 5 diagram (collapsed when long), "Tests: {before} → {after} (+{delta} new)", "Coverage: {X}% value-weighted ({Y}% including {W} weakly covered paths)", "Test value: {K} written, {R} rejected by the authoring gate, {E} existing tests extended, {W} paths weakly covered", each regression proof line, the gate result line, weak paths and leftover gaps as proposed tests with value cards.>
<Evals: suites, pass/fail counts and cost; any measurement table; or "No prompt-related files changed — evals skipped.">
<Pre-landing review: the stage 7 summary line, the findings, the `Gate edits:` line with each kept finding's path and reason and each open finding's path; missing reviewers named as missing coverage.>
<Verification Results: plan checks as N PASS, M FAIL, K BLOCKED, J NOT RUN, with accepted risks.>
<Exploratory QA: surfaces checked, reproducers, fixes, and blocked or not-run coverage.>
<Plan completion: the audit checklist or its not-run line, the `Acceptance edits:` line, each [ACCEPTANCE_EDITED] item as a scope change, deferred and dropped items, manual verifications with the user's evidence.>
<Scope Check: CLEAN, or the drift and missing requirements.>

## Merge Danger

**Door:** <one-way or two-way>

<One line when it helps: why. A two-way door can be walked back cheaply; destructive actions, data migrations and hard-to-reverse decisions are one-way doors.>

**Blast Radius:** <one word>

<Optional: what could break on merge: layout shift, consumer breakage, mobile, data, performance.>

## Documentation

<The stage 8 outcome: current; updated, with the doc files changed; or gap: <what is missing>, with the user's choice to ship it.>

## Issues

<Closes / Linked to / Fixes lines from section 3, the Plan: line, unsaved TODO follow-ups, and TODOs completed or added.>
````

## 6. Publish

The body is world-readable on a public repository. Write it into one private file with your file-write tool and confirm it is non-empty; a change to the body means writing a fresh file. Every retry sends the same files.

**Existing PR:**

```bash
gh pr edit <number> --body-file "<body file>" && gh pr edit <number> --title "$(cat "<title file>")"
glab mr update <number> --description "$(cat "<body file>")" && glab mr update <number> --title "$(cat "<title file>")"
```

Read the title back. Then settle the draft state: an existing draft with no open gate finding is marked ready (`gh pr ready <number>`; `glab mr update <number> --ready`) unless the user asked for a draft; a draft with an open finding stays a draft (print `Draft kept: Gate edits: N open` and the findings); a ready PR with an open finding is published only under the human authorization stage 9 recorded, otherwise stop and report.

**New PR:** add `--draft` when any gate finding is `open` (the human marks it ready after dispositioning it); otherwise create it ready.

```bash
gh pr create --base <base> --title "$(cat "<title file>")" --body-file "<body file>"
glab mr create --target-branch <base> --title "$(cat "<title file>")" --description "$(cat "<body file>")"
```

Bitbucket or plain git: print the creation URL the push gave, the title and the body file for the user to paste.

**Posted:** remove the two files and output the PR URL. **Failed** (a CLI error, no usable remote or CLI): print the error, the branch, the remote URL and the commands for posting by hand. The code is pushed, so this is not a stop, but never report a PR that was not created; with open gate findings, also say they were not disclosed on the forge.
