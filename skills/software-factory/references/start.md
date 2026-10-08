# Run start: setup check, reconcile, branch and checkout

## Setup version check

Before any run, compare the repo's setup with the installed `sf-setup` (the folder `../sf-setup/` beside this skill's folder). The setup is older when any of these holds:

- config `version` is missing or lower than `version` in `../sf-setup/assets/config-template.yaml`;
- a key path in that template is missing from config (for example `policy.comment`, `deploy.trigger`, `limits.evidence_max_age_h`), except a `baseline.<cmd>` key whose `commands.<cmd>` is `none` or `unknown`, which the template says to leave out;
- a file in `../sf-setup/scripts/` is missing from `.software-factory/bin/` or differs from it (`cmp -s`);
- `.gitattributes` lacks `.software-factory/bin/* text eol=lf`.

Then run `sf-setup upgrade` (with `unattended` when the run is) before creating the run, and continue with the upgraded config. Write one line under Notes in `state.md` once it exists: `setup upgraded <old> -> <new> before this run`. On a new run the upgraded files go into the branch's first commit (see Setup files below). On a resume, commit them in the run's `Checkout:` as their own commit at the current head, in the repo's commit style (e.g. `chore: upgrade software-factory setup`), never squashed into another commit. Wherever it lands, if `bin/` changed the merge gate lists it once under `Needs a person's look` as a setup upgrade; tell the user (attended) or note it (unattended). Then re-check finished stages as in [Resuming after a setup upgrade](#resuming-after-a-setup-upgrade).

If `../sf-setup/` can't be found, say so under Notes and continue with what is there; a stage that needs a missing script stops and names it. No stage silently runs an older copy of a script when a newer one is installed: the check above is what keeps `bin/` current.

## Resuming after a setup upgrade

Write `Setup version: <config version>` in `state.md` when the run is created. On resume, when the setup check just ran `sf-setup upgrade`, or config `version` is now higher than `Setup version:`, or `state.md` has no `Setup version:` line (a run created before the rule: treat it as older than the current setup), the stages already marked `done` ran under older rules. Before continuing:

1. For each `done` stage, in order, check its exit evidence against the current rules: the row in [stages.md](stages.md#exit-evidence) and that stage skill's own exit check, as they read now. Use the evidence on disk; don't re-run anything to look.
2. Evidence that still meets the rules stands: the stage stays `done`.
3. Evidence that no longer meets them: re-run that stage only, and only the part the new rule covers when the stage allows it (for example `sf-spec` adding the `Overrides` section and the note in the other spec, then a new spec check). Every later stage that read its output is re-checked the same way; one whose evidence is now void (a changed fingerprint voids verify and review) runs again in the normal order. A medium from that spec delta check whose fix would edit the spec body (and so void the checked hash) isn't applied: it goes into `state.md`'s `## Spec` section under `Deferred to plan:`, and the plan carries it as a note.
   - **Records whose required form changed.** Evidence includes the lines a stage wrote, not only its files. Re-check each one whose format the new rules changed. Example: `sf-build`'s `test-change` ledger lines must now cite `SPEC-<slug>/CAP-<n>` for gate 4 to accept a spec-changed assertion by rule; a line that names the capability any other way is amended. Amend by appending a new line in the current form with `| amends: <first words of the old line>`, never by editing the old one ([ledger.md](../../sf-build/references/ledger.md#rules)). The conductor writes these amendments; verify and review never write the ledger.
4. Write one Notes line: `re-checked <stages> under setup <old> -> <new>: <all stand | re-ran <stages>: <rule>>`, and set `Setup version:` to the new value. If a re-check can't be done (the rule needs something the old evidence never recorded), say which stage ran under older rules in that line; `sf-ship` reads it.

## Browser check

When the run's scope may include a web UI (the work touches a page, or `verify.md` describes one) and the path includes build or verify, check the browser before the first stage, from the main session: one real read-only call to the MCP in `tools.browser_mcp` (`list_pages`, or Playwright `browser_tabs` list). `browser_status` in config is what setup saw once and can be stale. If the call fails after one retry, or no MCP is set, check that a throwaway headless Chrome or Edge with a temporary profile can start, as in [sf-verify's browser fallback](../../sf-verify/references/gates.md#browser-check-and-fallback), and stop it again. Never attach to the user's own browser or profile. Write the result as `Browser:` in `state.md` (`mcp <name>`, `headless CDP fallback (MCP failed: <error>)`, or `none`); `sf-build` and `sf-verify` use it, and `sf-verify` checks again before its UI gates. Say it in the report when the fallback was used, and recommend fixing the MCP with `sf-setup` (`--isolated`). Config isn't changed: a stage never edits `config.yaml` mid-run.

## Reconcile waiting runs

This is its own start step (step 3 in SKILL.md), run every time before choosing a run, also when the user named the run to resume. Look at every run whose status is `waiting for human` and whose `PR/MR:` line has a link. Read its state with one read-only forge call (`gh pr view <n> --json state,mergeCommit`, `glab mr view <n> -F json`):

- merged: set the run's status to `done`, with a Notes line `reconciled: PR/MR merged at <sha7> while waiting; learn not run` (or `learn done` if its checklist says so), and clear `Owner:`;
- closed without merging: set it to `stopped`, with `reconciled: PR/MR closed without merge`;
- open, or the read failed: leave it as it is.

This touches only gitignored run files, so unattended runs do it too. A run without an `Owner:` line (an older template) is reconciled the same way. Mention each reconciled run in the report.

## Branch and checkout

Before the first stage that commits (spec or build, whichever comes first; debug makes no commits):

1. Create the branch without checking it out: `git branch --no-track sf/<run-id> <default-branch-ref>` from the up-to-date default branch (or the `Base:` that debug names). A bare `git push` can then never target the default branch. Push only with an explicit refspec (`git push -u origin sf/<run-id>`).
2. Give the run its checkout:
   - **Unattended**, or the working tree has changes this run didn't make: a worktree. Use the host's worktree tool if it has one; otherwise `git worktree add <repo>/../<repo-name>-sf-<run-id> sf/<run-id>`. Run `commands.install` in it when known and not `none`. The main checkout is never switched, so a scheduled run never works in a checkout someone else uses.
   - **Attended** with a clean tree (setup's own uncommitted files don't count): `git switch sf/<run-id>` in place.
   - If the worktree can't be created: with a clean tree, work in place and note `no worktree: <reason>`; with changes this run didn't make, attended ask the person to commit or stash them, unattended stop with `waiting for human`.
3. Record `Checkout: <absolute path>` and `Run files: <absolute path of .software-factory/runs/<run-id>/ in the main checkout>` in `state.md`. Run files are gitignored, so they don't exist in a new worktree: every stage reads and writes `runs/<run-id>/` at the `Run files:` path, and works, runs commands and commits in `Checkout:`. Pass both paths when calling a stage.
4. **Setup files.** If `sf-setup`'s files are uncommitted in the main checkout, copy them into the checkout (`.software-factory/config.yaml`, `.software-factory/bin/`, `.software-factory/decisions.md`, `.gitignore`, `.gitattributes`, the instructions file's `## software-factory` block) and commit them there as the branch's first commit, in the repo's commit style (e.g. `chore: add software-factory setup`). In place, that is the same as committing them. With a worktree, the main checkout keeps its uncommitted copies; tell the user to drop them once the branch merges.

`sf-build` reuses this checkout ([../../sf-build/references/worktree.md](../../sf-build/references/worktree.md)); it makes its own only when called without one.
