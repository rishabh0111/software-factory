# Writing the PR/MR description

The description is what a person reads before deciding to merge. Fill [../assets/pr-body-template.md](../assets/pr-body-template.md) from the run's files and write it to `runs/<run-id>/evidence/pr-body.md`. Keep prose short and skip preambles. Use the project's own terms from `GLOSSARY.md` (or the glossary the spec names) for domain concepts.

## The repo's own template

Look for one first: `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`, `docs/pull_request_template.md`, `pull_request_template.md`, `.gitlab/merge_request_templates/*.md` (`Default.md` if there are several). If one exists, fill its sections first, in its order, with facts from the run (leave a checkbox unticked when the run didn't do it), then put ours below a `---` line. With several templates and no default, pick the one whose name fits the work type and say which in the ship record.

## Closing issues

- `Closes #<n>` for the source issue only when the run's work for it is complete: every ticket of that issue shipped in this or an earlier merged PR, none `parked` or dropped, and no later batch still to come. Otherwise write `Part of #<n>` (GitHub) or `Refs #<n>`, and list the remaining work (later batches, parked tickets) in one line each.
- Each shipped ticket whose `tracker:` field names a published issue gets its own `Closes #<m>`, under the same rule for that ticket.
- GitLab closes on `Closes #<n>` only when the MR targets the default branch; GitHub the same. After the merge, re-read each issue it should have closed; still open: close it with a one-line comment naming the merge commit, under `policy.close` ([../SKILL.md](../SKILL.md#1-gates-and-permissions)); without that permission, list it in the report.

## Summary visuals

Add a visual under Summary only when prose can't carry the key point, and then use the lightest one that makes it plain. One or two, placed next to the sentence they support, keeping only the calls, files, props or states that matter:

- logic or an algorithm: pseudocode
- runtime control flow: a call tree (indented names)
- UI structure: a component tree with the state and module boundaries that matter
- file responsibility or a broad refactor: a shallow file tree with one comment per entry
- component interaction or data flow: a Mermaid sequence or flow diagram
- what changes, when the surrounding shape exists: a `diff` block shaped like the topic (component tree, file layout, call tree, state)
- the full block: when it is mostly new code, when trimming it would obscure who owns what or what runs first, or when a reader needs a target shape to copy

## Evidence

- Copy verify's lines exactly as written; never restate them.
- **Before and after.** For a bug or a test-first change: the red run (`evidence/debug-red-final.log`, or the ticket's failing test run), then the green line from `report.md` for the same command.
- **Screenshots.** When the change is visual and verify saved screenshots under `evidence/app/`, attach or link them first; they are the best evidence for a UI change.
- **Second opinion.** One line: `ran (<tool>)`, or `not run: <reason>` from `findings.md`. Unavailable is missing coverage, never a pass.
- **Outside the repo.** Requirements met only by config outside the repo (DNS, provider settings, secrets, dashboards) that review marked cannot-verify: list each with the exact check a person must do.
- **Dependency upgrades.** For a bumped dependency, quote the breaking or behaviour-change items from its changelog between the old and new versions, with a link.

## Bug

Only for bug runs (a `## Debug` section in `state.md`); otherwise omit the section. Symptom and steps to reproduce from the issue or triage, root cause from `## Debug`, the red command, and its result before (from `debug-red-final.log`) and after (verify's regression gate line).

## Merge danger

- **Door:** decided by one rule, applied to the diff, whatever the spec's Rollback says. `one-way` when any of these holds: it destroys or migrates data; it sends something external (emails, payments, published packages); it changes what an input consumers already send means, or what an existing output looks like (a field that was ignored is now applied, a status code or response shape changes, a default changes); or the spec's Rollback says it can't be undone cleanly. Otherwise `two-way`: reverting the PR/MR fully undoes it, which includes a backward-compatible extension (a new optional field or endpoint that old clients never send). Give the reason in one line. When the rule says `one-way` and the spec's Rollback only says "Revert the PR/MR", keep `one-way` and add `spec Rollback understates it: <why>`; sf-ship's deploy step then needs a person's yes as for any one-way rollback. With no spec, judge from the diff and say so.
- **Rollback:** the spec's Rollback steps, as written, or "Revert the PR/MR."
- **Blast radius:** one word (`none`, `local`, `module`, `service`, `users`, `consumers`), then who or what could break if it's wrong: callers and consumers of changed APIs, layout shift, mobile, data, other services, jobs. Use verify's scope list.

## Before sending

Scan the title and body ([secret-scan.md](secret-scan.md)). After creating or editing, read the title and body back once from the forge and check they match what was scanned ([forge-commands.md](forge-commands.md#find-or-open-the-prmr)).
