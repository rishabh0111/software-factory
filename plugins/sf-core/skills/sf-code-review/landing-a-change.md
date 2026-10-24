# Writing and landing a change

For the author's side of review, and for a reviewer deciding whether a change is reviewable at all: how big a change should be, how to describe it, what to clean up after it, how fast to review, how to settle a disagreement, and when to bring in a second model.

## Change sizing

Small, focused changes are easier to review, faster to merge and safer to deploy.

```
~100 lines changed   → good: reviewable in one sitting
~300 lines changed   → acceptable for a single logical change
~1000 lines changed  → too large: split it
```

**One change** is a self-contained modification that addresses one thing, includes its tests, and leaves the system working. One part of a feature, not the whole feature. A reviewer handed a change too big to review properly asks for a split rather than skimming it.

| Strategy | How | When |
|---|---|---|
| **Stack** | Submit a small change, start the next on top of it | Sequential dependencies |
| **By file group** | Separate changes for groups needing different reviewers | Cross-cutting concerns |
| **Horizontal** | Shared code or stubs first, then the consumers | Layered architecture |
| **Vertical** | Smaller full-stack slices of the feature | Feature work |

Large changes are fine when the reviewer only has to confirm intent: deleting whole files, automated refactors.

**Refactoring and new behaviour are two changes.** Submit them separately; small cleanups such as a rename can ride along at the reviewer's discretion.

## Change descriptions

A description stands alone in version-control history.

- **First line:** short, imperative, standalone: "Delete the FizzBuzz RPC", not "Deleting the FizzBuzz RPC". Someone searching history understands it without the diff.
- **Body:** what changes and why, with the context, decisions and reasoning the code does not show; links to tickets, benchmarks or design docs; the approach's known shortcomings.
- **Not:** "Fix bug", "Fix build", "Add patch", "Moving code from A to B", "Phase 1", "Add convenience functions".

## Dead-code hygiene

After a refactor or implementation change, list the code it left unreachable or unused, and **ask before deleting it**:

```
DEAD CODE IDENTIFIED:
- formatLegacyDate() in src/utils/date.ts: replaced by formatDate()
- OldTaskCard in src/components/: replaced by TaskCard
- LEGACY_API_URL in src/config.ts: no remaining references
→ Safe to remove these?
```

Dead code confuses later readers and agents; silently deleting something you are unsure of is worse.

## Review speed

Slow reviews block whole teams; the cost of switching context to review is smaller than the cost of everyone waiting.

- Respond within one business day at most; ideally soon after the request, unless deep in focused work. A typical change should get through several rounds in one day.
- Prefer fast individual responses over a fast final approval: quick feedback lowers frustration even across several rounds.
- Speed is about turnaround, never about lowering the bar. A rushed approval is not a fast review.

## Settling disagreements

In order:

1. Technical facts and data override opinions and preferences.
2. The style guide is the authority on style.
3. Design is judged on engineering principles, not taste.
4. Consistency with the codebase is acceptable when it does not degrade overall health.

Do not accept "I'll clean it up later": deferred cleanup rarely happens. Require it before merge unless it is a genuine emergency; if the surrounding issues cannot be fixed in this change, require a filed ticket the author owns.

**Honesty both ways.** No rubber stamps: "LGTM" without evidence of review helps nobody. Do not soften a real bug into "might be a minor concern". Push back on approaches with clear problems and propose an alternative; sycophancy is a review failure. And when the author has the full context and still disagrees after hearing the evidence, defer to their judgement. Comment on the code, never the person.

## A second model

Different models have different blind spots:

```
Model A writes the code → Model B reviews correctness and architecture → Model A addresses the feedback → a human makes the final call
```

When `docs/agents/tools.md` records a second-model CLI, it can play B (read-only, prompt passed as a file). Otherwise a fresh sub-agent with no session context is the fallback. A prompt for it: "Review this change for correctness, security and adherence to our conventions. The spec says [X]. The change should [Y]. Label each finding Critical, Required, Optional, Nit or FYI, with a confidence from 1 to 10." Two models agreeing is a signal, not a mandate: the user decides.

## Review checklist

```markdown
## Review: [change title]

### Context
- [ ] I understand what this change does and why

### Correctness
- [ ] Matches the spec or task
- [ ] Edge cases and error paths handled
- [ ] Tests cover the change, and would catch a regression

### Readability and structure
- [ ] Names clear and consistent; logic straightforward
- [ ] No unnecessary complexity; refactors reduce it rather than relocate it
- [ ] Follows existing patterns; no feature logic in shared modules; files stay a healthy size

### Security
- [ ] No secrets in code; input validated at boundaries; no injection; auth checks in place
- [ ] External data treated as untrusted

### Performance
- [ ] No N+1 patterns or unbounded operations; list endpoints paginated

### Verification
- [ ] Tests pass and the build succeeds (fresh runs)
- [ ] Manual verification done where needed
- [ ] Dependency upgrades read against their changelog, one per change, lockfile diff reviewed

### Verdict
- [ ] **Approve**: every Critical resolved; every Required resolved or explicitly deferred with a reason
- [ ] **Request changes**
```
