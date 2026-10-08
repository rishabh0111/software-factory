# Review: <run-id>

Verdict: <pass | fail>
Fingerprint: <40-hex wtree, recorded before the diff was read and unchanged at the end>
Head: <full sha> on sf/<run-id>
Base: <default_branch> @ <merge-base sha><, behind <remote> by <n> commits | , fetch failed: base freshness unknown>
Reviewed: <UTC>
Open must-fix: <n>
Open should-fix: <n>
Per axis: spec <n> (worst R<id>) · standards <n> (worst R<id>) · <specialist> <n> (worst R<id>) ...
Lane: <light | full>
Diff: <p> production, <t> test, <d> docs lines (outside .software-factory/)
Reviewers: spec (subagent<, second opinion: codex>), standards (subagent<, second opinion: codex>), specialists: <names and the trigger that fired, or none>, lead (subagent)
Second opinion: <ran: <cli> | not run: <reason>>
Incomplete: <reviewers that failed twice, or none>

Verdict is pass only when Open must-fix is 0 and no spec, standards or security reviewer is incomplete. A ruling in ledger.md is the only way a must-fix is closed without a new review. Per axis counts open findings; there is no winner across axes.

## Spec

| ID | Severity | Location | Finding | Spec line | Raised by |
|---|---|---|---|---|---|
| R1 | must-fix | src/cart.ts:42 | Discount applied after tax | CAP-3: "Discounts apply to the pre-tax subtotal" | subagent, codex |

Cannot verify from the diff: <CAP-n: settled by <evidence path:line> | act-on R<n> | open: what a person should check; or none>

## Standards

| ID | Severity | Location | Finding | Rule | Raised by |
|---|---|---|---|---|---|
| R2 | should-fix | src/cart.ts:88 | Payment error caught and logged, then reported as success | pass 1: errors | subagent |

## Specialists

| ID | Severity | Location | Finding | Specialist | Raised by |
|---|---|---|---|---|---|

## Claims

| ID | Severity | Location | Claim | What the code does |
|---|---|---|---|---|

## Builder-deferred items

| Ledger line | Ruling | Finding ID or reason |
|---|---|---|

## Declined to judge

Behaviours a reviewer set aside, with the lead's ruling. Those the lead turned into findings appear in their axis table instead.

| Location | Behaviour | Set aside by | Why the lead dismissed it |
|---|---|---|---|

## Dismissed

| Location | Finding | Raised by | Why dismissed |
|---|---|---|---|

## Checked and fine

- <behaviour or area the lead confirmed correct, one line each, so fix rounds don't reopen it>

## Notes

- Agreement: <the lead's one or two sentences>
- <Merging needs a person's yes: the diff touches CI config / agent config / `.software-factory/bin/` after the first setup commit.>
- <High-risk ticket T<n>: extra check for the merge gate: <check>.>
- <Second opinion fell back: reason.>
