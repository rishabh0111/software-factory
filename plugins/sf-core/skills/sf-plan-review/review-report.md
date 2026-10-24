# Plan review report

The terminal `## PLAN REVIEW REPORT` every lens writes at the end of the plan file, the
review readiness it displays afterwards, and the Implementation Tasks section of the plan
body. Reached from step 8 of [SKILL.md](SKILL.md).

## Generate the report

Read the plan file's existing `## PLAN REVIEW REPORT`, if any, for prior rows. Fill this
lens's row from its completion summary (or DX scorecard) and the **Report row** rules in
the lens file, adding one to its prior run count. Rows for other lenses keep their
status, attribution and freshness.

Each Status cell carries the run's date and short commit, e.g. `CLEAR (2026-03-16,
abc1234)`, so later reviews can judge freshness. Display `clean` as CLEAR and
`issues_open` as ISSUES OPEN, keeping freshness and not-persisted labels; other statuses
keep their recorded meaning.

**Outside Review** describes this run's attempt: "N findings; R resolved; U unresolved";
with none, "0 findings — completed review"; disabled or unavailable, the actual reason and
"no completed outside review", never implying zero findings. A prior row without counts
says "finding count not recorded".

```markdown
## PLAN REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/sf-plan-review` CEO lens | Scope & strategy | {runs} | {status} | {findings} |
| Outside Review | outside voice | Independent 2nd opinion | {runs} | {outside_status} | {findings} |
| Eng Review | `/sf-plan-review` Engineering lens | Architecture & tests (required) | {runs} | {status} | {findings} |
| Design Review | `/sf-plan-review` Design lens | UI/UX gaps | {runs} | {status} | {findings} |
| DX Review | `/sf-plan-review` Developer-experience lens | Developer experience gaps | {runs} | {status} | {findings} |
```

Below the table:

- **OUTSIDE COVERAGE:** each lens's outside-voice attempt with its completion state and
  findings, including unavailable, disabled and skipped ones; never infer completion from
  another lens. Omit the line only when no outside voice applied.
- **VERDICT:** the CLEAR reviews (e.g. "CEO + ENG CLEARED — ready to implement"); if Eng
  Review is not CLEAR, append "eng review required".
- **Unresolved-decisions status (always last).** Count this review's open items from its
  ledger. Count the open items the existing report lists for other lenses whose rows are
  still fresh (the seven-day window below), excluding the current lens. Both zero: end
  with the exact unbolded line `NO UNRESOLVED DECISIONS`. Otherwise write the bold label
  `**UNRESOLVED DECISIONS:**` (not a heading), one bullet per current open item, and,
  when the prior count N is positive, a final bullet `- + N unresolved from prior
  reviews`. The last bullet is the final non-whitespace line: no count line or prose
  after it.

## Write it to the plan file

The report is always the last section of the plan file. Delete, then append:

1. Read the plan file. Keep its content and apply only accepted changes, with the full
   review output. Locate any existing `## PLAN REVIEW REPORT`.
2. If found, Edit it out entirely: from `## PLAN REVIEW REPORT` to the next `## `
   heading or end of file, replaced with the empty string, wherever it sits. A failed
   Edit stops the step with its error.
3. Read the file again, then append the new report at the end (Edit against the suffix
   you just read, or Write the complete file; Write a new file when none exists). Never
   replace the old report in place.
4. **Read-back:** Read the saved file and verify the accepted changes, the full review
   output, this lens's row, the verdict and the final status line, with `## PLAN REVIEW
   REPORT` as the last section. A failure stops before Review readiness.

When writing is forbidden, assemble the same complete plan, output and report in chat,
labeled not persisted, skip the file steps, and claim no read-back.

## Review readiness

After the read-back passes, display readiness from the report rows.

1. **Freshness.** A row older than 7 days never clears, and an older success never
   replaces a newer failure. Compare each row's commit with `git rev-parse --short HEAD`;
   when they differ, run `git rev-list --count <stored>..HEAD` and note "{lens} review
   from {date} may be stale — {N} commits since review". A failed command is UNKNOWN,
   treated as stale; a row with no commit gets a re-run suggestion. Omit notes when all
   are current.
2. **Verdict.** CLEARED requires the Eng Review row to be `clean`, within 7 days and
   fresh; otherwise NOT CLEARED with its missing, stale or open-issue reason. Other rows
   are context, never a substitute: recommend CEO Review for product or scope decisions,
   Design Review for UI/UX work; the outside voice never gates shipping.
3. **Display**, showing missing, stale, disabled and unavailable results explicitly,
   never as CLEAR:

```
+====================================================================+
|                    REVIEW READINESS                                |
+====================================================================+
| Review          | Runs | Last Run            | Status    | Required |
|-----------------|------|---------------------|-----------|----------|
| Eng Review      |  1   | 2026-03-16 15:00    | CLEAR     | YES      |
| CEO Review      |  0   | —                   | —         | no       |
| Design Review   |  0   | —                   | —         | no       |
| DX Review       |  0   | —                   | —         | no       |
| Outside Voice   |  0   | —                   | —         | no       |
+--------------------------------------------------------------------+
| VERDICT: CLEARED — Eng Review passed                               |
+====================================================================+
```

## Implementation Tasks

Every lens turns its findings into build-actionable tasks in the plan body, above the
terminal report. Each task derives from a specific finding; no padding.

```markdown
## Implementation Tasks
Synthesized from this review's findings. Each task derives from a specific finding
above; check it off as you ship.

- [ ] **T1 (P1, human: ~2h / agent: ~15min)** — <component> — <imperative title>
  - Surfaced by: <section> — <finding text or line reference>
  - Files: <paths to touch, or "to be determined">
  - Verify: <test command or manual check>
- [ ] **T2 (P2, human: ~30min / agent: ~5min)** — ...
```

- Task priority follows the finding's severity: P0 and P1 block shipping; P2 should land
  on the same branch; P3 is a follow-up TODO.
- A finding with no actionable task gets none; never invent one. A section with zero
  findings gets `_No new tasks from <section>._`
- Effort shows human and agent time. Default ratios (human ÷ agent): scaffolding ~100x,
  tests ~50x, features ~30x, a bug fix with its regression ~20x, architecture ~5x,
  research ~3x. Adjust to the actual work and state the assumption.
- Only approved work becomes a task; pending remedies stay in the ledger.
