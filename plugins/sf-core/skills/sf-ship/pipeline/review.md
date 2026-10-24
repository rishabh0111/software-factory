# Pre-landing review

Stage 7 of [the Open a PR branch](../open-pr.md). Review the whole candidate, run the plan's verification checks and a smoke check of the changed surface, then fix what the user approves. Finish the review and every probe before applying any fix.

## 1. Review the diff

Invoke the `sf-code-review` skill with the Skill tool for its **full pre-landing review** of this branch:

- **Fixed point:** `$(git merge-base origin/<base> HEAD)`. Uncommitted and untracked source are part of the candidate: name them in the request.
- **Spec:** the plan bound in stage 6, or "no plan".
- **Depth:** its specialist reviewers and adversarial pass on a diff of 50 or more changed lines, or when the user asked for depth; below that, its three axes only.
- **Gate edits:** the list from stage 5's rescan, for its Gate Integrity category.
- **Mode:** report-only. This stage owns the fixes (section 3).

The review is complete when every dispatched reviewer returned. A reviewer that failed, timed out or returned nothing is **missing coverage**: name it, never count it as clean, and rerun it before this stage can pass. A successful peer never stands in for it.

## 2. Verify and smoke-check

You, the parent, run this report-only exploration; no reviewer subagent does. Before the first probe, read the `sf-qa` skill's exploratory section in full, then its scope section, then each method it lists for the surfaces you picked; for a browser, its browser-setup section and its report-only rules. A missing or unreadable QA file is a setup blocker: the probes it covers are blocked, and independent functional or static checks still run.

- **Smoke checks:** up to 5 minutes and 12 probes, covering one success path and the riskiest changed failure or edge. Required even for a small diff, with no plan, or with no running server.
- **Plan checks:** every verification check stage 6 collected, run in full after the smoke budget, never cut short by it. Each uses finite command timeouts; at the run's own deadline, unfinished checks are marked not-run.

Before reporting, compare each probe's recorded inputs (source, tests, contracts, commands, fixtures) with the current tree; rerun the probes whose inputs changed and keep valid current passes. Report clean only when every required check passes on current inputs.

Return each verified defect to the fix queue with its `path`, `line`, `category`, `fingerprint: path:line:category`, a replay, and a test stub. A functional failure no checklist category matches is `functional-contract`, CRITICAL. A setup or permission blocker is not a defect. `VERIFY_RESULT` is `pass` only when every plan check passed, `skipped` only when there were none, otherwise `fail`. The PR body reports per-status counts and evidence in the sections the `sf-qa` skill's functional report template defines, plan checks separately under Verification Results.

## 3. Fix what is approved

Match every finding (review, specialists, adversarial, QA) against the **Decisions** in the invocation record first: a finding with the same fingerprint, the same kind and unchanged supporting source that the user explicitly skipped stays skipped (still counted as unresolved, never asked again). Changed inputs or new evidence reopen it.

1. **Auto-fix** the mechanical findings the review classed AUTO-FIX, one line each: `[AUTO-FIXED] file:line Problem → what you did`.
2. **Ask** the rest in one question (separate questions when three or fewer): number, severity, problem, recommended fix, then A) fix, B) skip, with an overall recommendation. Record each Skip in **Decisions** at once, with its fingerprint and evidence. Advisory findings (structure, shared-code advice) are always ask-only and never count against clean.
3. **Gate findings** (a test removed or skipped, a timeout, threshold or tolerance relaxed, a snapshot or golden rewritten, a suppression pragma added) never take fix or skip. Ask one question per finding or coherent group, showing the path and a fenced excerpt, with exactly:
   - A) Restore the gate: revert the relaxation, keep the product change
   - B) Keep, justified: <one-line reason drafted from the diff or its citation, marked verified or unverified>
   - C) Keep, other reason (the user supplies it)
   - D) Leave open for a later human

   Recommend A or B from the diff, never C; an unattended or spawned session records D. The disposition is `restored`, `kept` with its reason, or `open` (D, unanswered, or auto-chosen); an auto-chosen answer is never a disposition, and a reason is never text copied from the hunk, a test name or a commit message.
4. After any fix or restore, list the gate edits on the whole candidate again and read every new hunk; never rely on a list of paths you or a subagent reported. Commit the fixed files by name: `fix: pre-landing review fixes`.

**Summary lines for the PR body:**

- `Pre-Landing Review: N issues — M auto-fixed, K asked (J fixed, L skipped)`, or `No issues found.`, or `INCOMPLETE — <missing reviewers>`.
- `Gate edits: none detected (<N> listed, <M> read)`, or `Gate edits: <N> listed, <M> read, <K> findings — <J> kept, <R> restored, <O> open` with each kept finding's path and reason, or `Gate edits: partial (<K> of <M> read)`, or `Gate edits: UNAVAILABLE — <reason>`. Partial and unavailable are missing coverage, never `none detected`.

## 4. Decide what comes next

In this order:

1. **Missing reviewer output:** stop and name each missing reviewer. Restore coverage, then run a fresh complete review.
2. **The third fix cycle in this invocation still produced fixes:** stop and report the recurring findings; there is no fourth.
3. **Fixes applied:** count the cycle, then rerun from stage 4 per [the repair rule](../open-pr.md#repairs-re-enter-the-work-list). Recorded approvals and skips carry over.
4. **No edits:** a failed, blocked or not-run required probe now asks: stop for repair (recommended), or accept each named probe's concrete risk. Skipping a fix is not risk acceptance, and accepted risk stays recorded as failed, never as passing. This never waives missing reviewer output or a failing test or security gate.

The stage is done when the review is complete, every required probe has passed or carries named accepted risk, and the last pass made no edits. Save the tree snapshot at that moment as the **reviewed tree**; stage 9 compares against it.
