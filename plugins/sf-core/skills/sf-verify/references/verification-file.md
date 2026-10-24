# The VERIFICATION.md file

The shape of `$VERIFICATION` for [goal-backward-verification.md](../goal-backward-verification.md) Step 11. Emit a frontmatter key only when its condition holds; keep every table, writing "none" in an empty one so a reader can tell "checked and clean" from "not checked".

```markdown
---
work: docs/plans/2026-10-20-chat.md        # the plan, spec or ticket verified
verified: YYYY-MM-DDTHH:MM:SSZ
base: <commit the work started from>
status: passed | gaps_found | human_needed
score: N/M must-haves verified
behavior_unverified: 0          # PRESENT_BEHAVIOR_UNVERIFIED + insufficient_spec truths, excluded from the score
overrides_applied: 0            # PASSED (override) truths included in the score
overrides:                      # only when overrides exist; carried forward on re-verification
  - must_have: "Must-have text that was overridden"
    reason: "Why the deviation is acceptable"
    accepted_by: "name"
    accepted_at: "ISO timestamp"
re_verification:                # only when a previous file existed
  previous_status: gaps_found
  previous_score: 2/5
  gaps_closed: ["Truth that was fixed"]
  gaps_remaining: []
  regressions: []
gaps:                           # only when status is gaps_found
  - truth: "Observable truth that failed"
    status: failed | partial
    reason: "Why it failed"
    artifacts:
      - path: "src/path/to/file.tsx"
        issue: "What is wrong"
    missing: ["Specific thing to add or fix"]
deferred:                       # only when Step 10 deferred items
  - truth: "Truth not yet met"
    addressed_in: "Task 7 / ticket #42"
    evidence: "The matching goal or acceptance-criterion text"
advisory:                       # re-verification only: new-scope findings without evidence
  - finding: "Short description"
    category: architectural | security | other
    reason: "Why raised; what would resolve it"
    evidence_status: "none provided"
behavior_unverified_items:      # whenever behavior_unverified > 0, whatever the status
  - truth: "Truth whose transition or invariant no test exercises"
    reason: present_behavior_unverified | insufficient_spec
    test: "What to trigger"
    expected: "What must hold afterwards"
    why_human: "Why presence checks cannot see it"
coincidental_reliance_items:    # whenever a VERIFIED truth holds incidentally
  - truth: "Truth that holds incidentally"
    reason: undeclared-precondition | incidental-ordering | fixture-only
    harden: "Precondition or ordering to declare or enforce"
decision_coverage: {honored: N, total: M, not_honored: []}   # nulls, not zeros, when not evaluated
human_verification:             # only when status is human_needed
  - test: "What to do"
    expected: "What should happen"
    why_human: "Why it cannot be checked programmatically"
---

# {Work name}: verification

**Goal:** {from the spec, plan or ticket}
**Verified:** {timestamp} against {base}..{head}
**Status:** {status}
**Re-verification:** {yes, after gap closure | no, initial}

## Observable truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | {truth} | ✓ VERIFIED | {file:line, command and output} |
| 2 | {truth} | ✗ FAILED | {what is wrong} |
| 3 | {truth} | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | {present and wired; no test exercises the transition} |
| 4 | {truth} | ⚠️ insufficient_spec | {non-inferable; no explicit evidence} |
| 5 | {truth} | ✓ VERIFIED (coincidental-reliance) | {holds incidentally; see coincidental_reliance_items} |
| 6 | {truth} | PASSED (override) | {Override: reason, accepted by who on when} |

**Score:** {N}/{M} verified ({P} behaviour-unverified)

## Prohibitions

| # | Must not | Tier | Status | Evidence |
|---|---|---|---|---|

## Required artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|

## Key links

| From | To | Via | Status | Details |
|---|---|---|---|---|

## Data-flow trace

| Artifact | Data variable | Source | Produces real data | Status |
|---|---|---|---|---|

## Behavioural spot-checks

| Behaviour | Command | Result | Status |
|---|---|---|---|

## Probes

| Probe | Command | Result | Status |
|---|---|---|---|

## Requirements coverage

| Requirement | Description | Status | Evidence |
|---|---|---|---|

## Decision coverage

{honored}/{total} honored. Not honored: {list, or none}. Warnings only; the status does not depend on them.

## Anti-patterns

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|

## Test quality audit

| Test file | Linked requirement | Active | Skipped | Circular | Assertion level | Verdict |
|---|---|---|---|---|---|---|

## Deferred items

| # | Item | Addressed in | Evidence |
|---|---|---|---|

## Advisory (new scope, no evidence)

Re-verification only; include it, even as "none", whenever re-verification ran.

| # | Finding | Category | Why advisory |
|---|---|---|---|

## Human verification

{Each item as Test / Expected / Why human, or "n/a: <reason>"}

## Gaps summary

{What is missing and why, grouped by root cause}
```

An override suggestion, when a failure looks intentional, goes in the truth's evidence or under the gaps summary:

```markdown
**This looks intentional.** {What achieves the same intent.} To accept the deviation, add to the frontmatter of this file, then re-run verification:

    overrides:
      - must_have: "{must-have text}"
        reason: "{why the deviation is acceptable}"
        accepted_by: "{name}"
        accepted_at: "{ISO timestamp}"
```
