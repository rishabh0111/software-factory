# Re-verification and overrides

For [goal-backward-verification.md](../goal-backward-verification.md) when `$VERIFICATION` already exists: re-verifying after gaps were closed, and accepting deliberate deviations through overrides.

## Re-verification mode

Triggered when the previous report's frontmatter has a `gaps:` list.

1. Take the must-haves (truths, artifacts, key links, prohibitions) and the `gaps:` from the previous report. Do not re-derive them: what a must-have is was fixed before this round started.
2. **Failed items:** the full check, levels 1–4.
3. **Passed items:** a regression check only: still exists, still substantive. Skip the reasoning checks for them.
4. Carry `overrides:` forward. An override whose must-have the code now satisfies is no longer needed: mark the truth VERIFIED; leave the override in place as documentation.
5. Fill `re_verification:` (previous status and score, gaps closed, gaps remaining, regressions).
6. Apply the **evidence gate** below to every Step 7 blocker.

## The evidence gate (re-verification only)

Truths, artifacts and links cannot drift between rounds: they come from the previous report verbatim. Step 7's per-file scan can: left unbounded, the verifier's fresh opinions ("architecturally fragile") become blockers, revert an all-green gap-closure round and demand another, with no end. The gate bounds that.

**Always blocking:**

- **Debt markers.** An unreferenced `TBD`, `FIXME` or `XXX` is self-evidencing: its presence is the evidence. No other Step 7 category gets this carve-out; stub, hollow-prop and empty-implementation findings all involve judgment.
- **Carried-forward gaps.** The finding matches an item in the previous `gaps:` list (same matching rule as overrides, below).
- **Regressions.** The flagged file changed since the previous report's `verified:` timestamp:

  ```bash
  git log --since="$PREV_VERIFIED_TS" --oneline -- "$file"
  ```

  Non-empty means changed. Check per file, not per line. **Fail closed:** unavailable history or an unparseable timestamp counts as changed.

**Every other blocker is new scope**, and stays blocking only with **deterministic evidence**:

- one named test that **fails** when you run it (run that test alone; record the command and the failing output), or
- another reproducible artifact: a command and its output showing the defect (a crash, a failing probe, a bad response).

An assertion, an opinion or an architectural preference with no failing test and no reproducible output is not evidence, however well argued. Such a finding is **📋 advisory**: record it under `advisory:` with its reasoning, keep it out of the `gaps_found` trigger, and never let it revert a completed must-have or, alone, justify another gap-closure round.

Evidence is the bar, not traceability: a newly found defect with a real failing test blocks even when no requirement names it. Security findings with evidence block as usual.

Worked example. The previous round had four gaps, all closed by approved follow-up work:

- "The retry backoff is fragile under sustained load": not a previous gap, its file last changed three weeks before the follow-up work, no test, no reproduction → advisory.
- `TBD: handle the timeout case` in a file the follow-up edited → debt marker, blocks.
- A previously closed gap's file now fails the same named test that proved it broken → carried-forward gap, blocks.

## Overrides

An override accepts a must-have that will not pass as written because the deviation is known and acceptable. It stops verification looping on items that will never pass as originally specified.

**Use one when** the requirement changed after planning and the spec has not caught up, an alternative implementation meets the intent but not the wording, the item moved to later work with explicit tracking, or an external constraint made it impossible or unnecessary.

**Do not use one when** the implementation is simply incomplete (fix it), the must-have is unclear (clarify it), someone wants to skip verification, or more than two or three must-haves of the same work would need one (revisit the plan instead).

**Format** (in the frontmatter of `$VERIFICATION`):

| Field | Content |
|---|---|
| `must_have` | The truth, artifact or link overridden; need not match exactly |
| `reason` | Why the deviation is acceptable; specific, never just "not needed" |
| `accepted_by` | Who accepted it (name or role) |
| `accepted_at` | ISO timestamp |

**Matching** (also used by the evidence gate for carried-forward gaps):

1. Normalise both strings: lowercase, strip punctuation, collapse whitespace.
2. Tokenise and intersect.
3. Match at **80% token overlap in either direction**; file paths, component names and API endpoints weigh more than common words.
4. An override matching several must-haves applies to the one with the highest overlap; still tied, the first, with a warning in the report.

| Must-have | Override `must_have` | Match? |
|---|---|---|
| "User can authenticate via OAuth2 PKCE" | "OAuth2 PKCE flow implemented" | yes: `OAuth2`, `PKCE` |
| "Rate limiting on /api/auth/login" | "Rate limiting on login endpoint" | yes: `rate limiting`, `login` |
| "src/components/Chat.tsx provides message list" | "Chat.tsx message list rendering" | yes: `Chat.tsx`, `message`, `list` |
| "Chat component renders messages" | "OAuth2 PKCE flow implemented" | no |

**Effect:** the truth shows as `PASSED (override)`, visibly distinct from VERIFIED and FAILED, with the reason and acceptor in its evidence; it counts toward the score (`score: 5/5`, `overrides_applied: 2`); work whose items are all VERIFIED or overridden can be `passed`. Overrides never suppress a human-verification item.

**Lifecycle:** overrides are added by a person (the report only suggests them), carry forward across re-verification, and are never removed automatically. Stale ones can be cleaned up when the work closes; leaving them is harmless.
