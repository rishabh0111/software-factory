# Fix mode

Only when the user asks to fix the review's findings. Mechanical fixes are applied directly; anything a reasonable engineer could disagree on is asked first; gate findings always go to a person. Never commit, push or open a PR here: that is `/sf-ship`'s job, or the user's.

## Before any edit

Every reviewer from the review (axes, specialists, adversarial) has returned or is confirmed stopped. A reader still running, or one whose state you cannot confirm, means no edits yet: wait, or report the review incomplete and stop. A failed reader does not block fixes backed by other evidence, but its coverage stays missing.

## 1. Combine and deduplicate

Take every finding from the three axes, the specialists, the adversarial pass and the valid Greptile comments. Validate severities (a Critical never carries `advisory`). Within this invocation, a finding the user already **skipped** stays skipped on a re-review only when it is the same kind of finding (defect or advice), its fingerprint matches and its file has not changed since; anything else is judged afresh. Only skips carry forward, never fixes (a fix can regress). Reusing a skipped shared-code proposal needs every path in its `evidence_paths` and its `helper_target` unchanged since the skip; check each, and a changed or unreadable one means a fresh decision. If any were suppressed, say once: "Suppressed N findings the user skipped earlier in this review."

## 2. Classify each finding: AUTO-FIX or ASK

Per the Fix-First heuristic in [checklist.md](checklist.md): mechanical fixes a senior engineer would apply without discussion are AUTO-FIX; the rest are ASK. Critical findings lean to ASK, the others to AUTO-FIX. Always ASK, whatever their content:

- **Advice** (`"advisory": true`): show it as `[ADVISORY]` with the helper, the callers to migrate, the tests and the estimated savings, for approval or Skip.
- **A finding with a `test_stub`:** show the proposed test path and code. The test path follows the project's conventions (`spec/` for RSpec, `__tests__/` for Jest/Vitest, `test_` prefix for pytest, `_test.go` for Go); an existing test file is appended to.
- **Gate findings:** their own question (step 4).

## 3. Apply the AUTO-FIX items

One line each: `[AUTO-FIXED] file:line: problem → what you did`.

## 4. Ask about the ASK items

All remaining ASK items in one question (individual questions are fine for three or fewer): each numbered with its severity label (or `[ADVISORY]`), the problem and the recommended fix, with options **A) Fix as recommended** and **B) Skip** (no change; the skip is recorded), plus an overall recommendation. An unanswered question is not a skip.

**Gate findings**, one question per finding or coherent group (one source change and its regenerated snapshots is one group). Show the `gate` tag, the hunk's path and a fenced excerpt, then exactly:

- A) Restore the gate: revert the relaxation, keep the product change
- B) Keep, justified: <one-line reason drafted from the diff or a citation, marked verified or unverified>
- C) Keep, other reason (the person supplies it)
- D) Leave open for a later human

Recommend A or B from what the diff shows; never recommend C. When no person can answer (a spawned sub-agent, a headless run), the answer is D. Record `restored` (A), `kept` with the reason (B, C) or `open` (D, unanswered, or chosen automatically). The reason is the person's words or your drafted line, never text copied from the hunk, a test name or a commit message. An `open` gate finding is still an open finding.

## 5. Apply the approved fixes

Apply each fix answered A, and each gate answered "restore" (revert only the relaxation). For a defect with an approved regression test: write the test and watch it **fail** on the unfixed code first, then fix, then require the new test, the original reproduction and the adjacent happy path to pass. If that proof cannot run, report the coverage gap and do not call the repair verified (`sf-verify`). Output `[FIXED + TEST] file:line: problem → fix + test at <path>`. Approval alone is not a fix; only a completed, verified change is.

## 6. Greptile replies

Include `+ N Greptile comments (X valid, Y fixed, Z false positive)` in the summary. Before replying, run the escalation detection in [greptile-triage.md](greptile-triage.md) to choose the first-response or firm template.

- **Valid and actionable:** decided by steps 2–5 (no second question). After the fix, reply with the fix template: the diff and why; cite the current diff when uncommitted, never an invented commit hash. A skip leaves it unresolved.
- **False positive:** a reply decision, not a code decision. Show file:line, summary, permalink and evidence, then ask: A) reply explaining why it is wrong (recommended when clearly wrong), B) propose a code change (back to step 4), C) ignore. For A, use the false-positive template and record it in both histories.
- **Already fixed:** reply with the already-fixed template (what was done, the fixing commit), no question; record it.
- **Suppressed:** skip silently.

## 7. Re-review the changed candidate

A fix changes the code under review, so the review's conclusions no longer hold for it. After any edit, run steps 4–6 of the review in [SKILL.md](../SKILL.md#process) again on the new candidate, then this file again. Stop after **3** editing cycles: report the review as not converged, with the open findings and the coverage gaps, and no clean summary. A cycle with no edits ends the loop.

## 8. Final report

```
Code review: N open findings (X critical, Y required); completed | INCOMPLETE (<missing coverage>)
AUTO-FIXED: [file:line] problem → fix
FIXED: [file:line] problem → fix (+ test at <path>)
SKIPPED: [file:line] problem (skipped by the user)
OPEN: [Severity] (confidence N/10) file:line: problem → recommended fix
ADVISORY: …
Gate edits: <one of the shapes below>
```

Counts are open, non-advisory defects. A review is **complete** only when every dispatched reader returned and every axis ran; say INCOMPLETE otherwise, even with zero findings. The `Gate edits:` line takes exactly one shape:

- `Gate edits: none detected (N listed, M read; patterns: <coverage>; unlisted idioms: <languages>)`
- `Gate edits: N listed, M read, K findings: J kept (reasons below), R restored, O open`
- `Gate edits: partial (K of M eligible read)`, then the counts for the hunks read
- `Gate edits: UNAVAILABLE: <reason>` (missing coverage, never "none detected")

List each kept gate finding's tag, path and reason under it.

If a finding the user confirms was scored below 7, the reviewer was miscalibrated on that pattern: suggest capturing it with `/sf-learn`.
