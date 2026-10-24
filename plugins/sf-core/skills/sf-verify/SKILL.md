---
name: sf-verify
description: Use when about to say work is done, fixed, passing or ready, or to sound pleased with it; before committing, pushing, opening a PR or moving to the next task; when a subagent or tool reports success; when earlier results seem good enough because someone is waiting; and at the end of a ticket, feature or plan.
---

# Verify before you claim

**Core principle:** evidence before claims, always. A claim about the state of the work is only as good as the command output behind it, and that output has to be **fresh**.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIM WITHOUT FRESH VERIFICATION EVIDENCE
```

**Fresh** means run in this turn, after the last edit to anything the claim covers. A run from before an edit, from earlier in the session, from another agent or from CI on an older commit is history, not evidence. If you have not run the proving command since the last change, you cannot say it passes.

## The gate

Before any statement about the state of the work:

1. **Identify** the command whose output proves the claim.
2. **Run** it, in full and fresh.
3. **Read** the whole output: exit code, counts, failures, warnings, and that it ran what you think (a suite that selected zero tests exits 0).
4. **Compare** the output with the claim.
   - It confirms the claim: state the claim and quote the evidence.
   - It does not: state the actual status and quote the evidence.
5. **Only then** speak.

Skipping a step is not a shortcut through verification. It is a false report.

## When you cannot run it yet

Time pressure, a slow suite, a missing service or a user who is waiting never turn an unrun check into a passing one. The honest report is always available and always fast:

- Say what is done, what was last verified, when, and against which revision.
- Say what changed since and has not been re-run.
- Start the proving command, or name the one that would prove it, and report the result when it lands.

"Implemented; the suite last passed before the HALF_EVEN change and has not been re-run; running it now" is a complete, true answer. "Done, all tests pass" is not, however likely it feels. If the user then chooses to merge on that basis, that is their decision, made with the true status in front of them.

## What each claim needs

| Claim | Requires | Not enough |
|---|---|---|
| Tests pass | Test command output, this turn: N run, 0 failed | An earlier run, "should pass", a partial filter |
| Linter clean | Linter output: 0 errors | A partial check, extrapolation |
| Build succeeds | Build command: exit 0, artifacts produced | Linter passing, logs looking fine |
| Bug fixed | The original symptom, reproduced, now gone | Code changed, assumed fixed |
| Regression test works | Red-green cycle observed (below) | The test passing once |
| Subagent completed | The VCS diff and your own run of its checks | The subagent's report |
| Requirements met | Each requirement checked off against evidence | Tests passing |
| Feature, ticket or plan done | A goal-backward verification report (below) | Every task ticked |
| Code matches its docs | Each documented rule cited to its enforcing `file:line`, or proved unenforced (below) | The docs existing, a comment saying "admin only" |

## Patterns

**Tests:**
```
Yes: [run the suite] [see 34/34 pass] "All 34 tests pass."
No:  "Should pass now." / "Looks correct."
```

**Regression test (red-green):**
```
Yes: write → run (pass) → revert the fix → run (MUST FAIL) → restore → run (pass)
No:  "I've written a regression test." (never seen red)
```

**Build:**
```
Yes: [run the build] [see exit 0] "Build passes."
No:  "The linter passed." (a linter does not compile)
```

**Requirements:**
```
Yes: re-read the plan or ticket → list each requirement → check each against evidence → report gaps or completion
No:  "Tests pass, so it's complete."
```

**Delegated work:**
```
Yes: subagent reports success → read the VCS diff → run its checks yourself → report the state you observed
No:  pass the subagent's report on as fact
```

## End of a ticket, feature or plan

Task completion is not goal achievement: every task can be ticked while the goal is missed (a placeholder component, an endpoint nobody calls, a notification written that no screen reads). When a ticket, feature or plan is about to be called done, verify against its goal, per [goal-backward-verification.md](goal-backward-verification.md). Done when its report is written at the path that file names and its status is stated to the user.

## The code against its documented intent

When the claim is that the code does what the system docs say (permissions, flows, trust boundaries, secrets), or a release needs the docs confirmed against the code without rewriting them, follow [references/documented-intent.md](references/documented-intent.md). Done when every documented rule in scope is marked enforced, unenforced or unverifiable, each with its citations.

## Red flags: stop and run the check

- "Should", "probably", "seems to", "I believe it passes".
- Satisfaction before evidence: "Great!", "Perfect!", "Done!", "All set".
- About to commit, push, open a PR or close a ticket without a run this turn.
- Passing on a subagent's, tool's or CI's success report as your own observation.
- A partial check standing in for the whole claim.
- "It passed earlier" while files have changed since.
- "The user is waiting" or "they told me to just confirm".
- "Just this once", or being tired and wanting it over.
- Any wording that implies success without a fresh run behind it.

## Rationalizations

| Excuse | Reality |
|---|---|
| "Should work now" | Run it. |
| "I'm confident" | Confidence is not evidence. |
| "It passed 40 minutes ago" | Before the last edit is history. Fresh means after the change. |
| "The change since was tiny" | A one-line change to a rounding mode is exactly what tests exist for. |
| "The user is waiting / in a hurry" | The honest status takes one sentence. Give it, and start the run. |
| "The user asked me to just confirm it" | You can tell them the true status; you cannot certify what you did not check. |
| "The subagent said it passed" | Verify independently: diff, then your own run. |
| "The linter passed" | A linter is not a compiler and not a test suite. |
| "A partial check is enough" | A partial check proves the part it checked. |
| "Every task is ticked and the tests pass" | Tasks and unit tests are not the goal. Verify the goal. |
| "Different words, so the rule doesn't apply" | The rule covers every way of implying success. |

## When this applies

Always before:

- any form of a success or completion claim, and any expression of satisfaction with the work;
- committing, pushing, opening a PR, closing a ticket, moving to the next task;
- handing work to another agent or person as finished.

The rule covers exact phrases, paraphrases, synonyms and implications: anything that tells the reader the work is correct or complete.
