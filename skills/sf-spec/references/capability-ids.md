# Capability IDs

Capabilities are `CAP-1`, `CAP-2`, … within the spec. Other files refer to them as `SPEC-<slug>/CAP-<n>`: holdout scenario IDs, tickets, review findings.

- Never renumber, never reuse. A new capability takes one more than the highest number ever used in this spec, counting `Retired` and `decisions.md`.
- To drop a capability, move it to `Retired` with the date and reason, and append a `retired` line to `decisions.md` whose text starts with the ID (`retired: CAP-3 <short name>, <reason>`; [clarify.md](clarify.md) section 6).
- If a capability's meaning changes (not just its wording), retire it and add a new one, so tests tied to the old meaning visibly go stale.
- On an update to an existing spec, keep its file, slug and IDs.
- A new spec that changes another spec's capability, non-goal or `Do not touch` line records the override in both specs in the same commit: an `## Overrides` line in the new spec, and in the other spec a retired capability or an `(overridden by SPEC-<new>/CAP-<n>, date)` note. It's a direction question first: [spec-rules.md](spec-rules.md#overriding-another-spec).
- `scripts/cap-lint` checks these rules against the spec as last committed and against `decisions.md`; [check.md](check.md) section 1 runs it before every check. Its result is a fact, not an opinion: fix what it reports.
