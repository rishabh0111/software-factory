# Gaps, open questions and the clarification log

This file covers both modes. In grilling mode (a person present, an idea or feature) gaps feed the design tree in [grilling.md](grilling.md) and sections 2 and 3's cap and single batch don't apply. In batch mode (unattended, or the user asked for the short version) everything here applies as written.

## 1. Find the gaps

Walk the draft spec through these areas. Mark each clear, partial or missing. Only partial and missing ones produce gaps.

- **Scope and behaviour:** the user's goal, what's in and out, which roles or permissions differ, and which capability matters most if the run is cut (each capability's `Priority`).
- **Data:** entities, identity and uniqueness, lifecycle and state changes, expected volume. Settled answers go in the spec's `Data` section.
- **Interaction:** the main path, and the error, empty and loading states; accessibility (keyboard, screen reader, contrast) and localization (translatable text, dates, numbers, time zones).
- **Quality attributes:** speed, scale, reliability, observability (what the on-call person will need to see), security and privacy, compliance.
- **Abuse:** for anything touching auth, payments, uploads, webhooks or model calls, how someone could misuse it.
- **Integrations:** external services and what happens when they fail, import and export formats, versions.
- **Background work:** retries, idempotency, and what happens to a job that fails halfway.
- **Cost:** paid API calls, storage or compute that grow with use.
- **Edge cases:** bad input, repeats, concurrency, limits and rate limits, partial failure and recovery from it.
- **Constraints and trade-offs:** fixed technical choices, rejected alternatives.
- **Terms:** one name per concept across the spec, and it's the glossary's preferred term where the glossary has one ([domain-modeling.md](domain-modeling.md)).
- **Completion:** every success check is pass/fail.
- **Leftovers:** `TODO`, `???`, placeholders, and vague words such as fast, robust, intuitive, secure, scalable.

A domain implication the input doesn't mention is a gap too: payments without card-data rules, health data without privacy rules, personal data without retention, control systems without a fail-safe. Name it; don't invent the answer.

Before turning any gap about existing behaviour into a question, read the code and cite what you found (`path:line`). Many questions answer themselves.

## 2. Default or ask

For each gap, try to state a sensible default first. Use the project's own patterns before general practice:

- error handling, logging and auth: whatever the surrounding code already does
- interfaces: the project's existing style (REST or RPC, CLI flags, function calls)
- performance: the project's current behaviour for similar operations, or ordinary expectations for the kind of app
- data retention: the project's existing policy, or the domain norm

A gap with a sensible default becomes an `Assumptions` line stating the default and why.

A gap becomes an open question only if one of these holds:

- it's a direction call (changes what the user asked for, or a scope, pricing or product-strategy choice)
- several readings lead to different behaviour or tests, and none is a sensible default
- two sources disagree (the issue text and a comment, the brief and the code), or an either/or in the input was never resolved. Quote both readings in the question; never pick one silently

**Batch mode cap: three open questions per spec.** Rank by what's at stake: scope > security and privacy > user experience > technical detail. Within a rank, prefer the question whose answer changes more of the spec. Questions shaping asked count toward the three. Everything below the cut gets a default and an assumption line.

Don't ask about implementation choices, task order or tech-stack comparisons. Those belong to the plan.

## 3. Ask

In batch mode, ask all open questions in one message, so an unattended run can default them all at once. Grilling mode asks in rounds instead, using the same question shape. Each question:

```markdown
**Q1. <A full question that ends in a question mark?>** (scope)

Why it matters: <one plain sentence on what changes depending on the answer>.

**Recommended: B.** <one or two sentences on why.>

| Option | Answer | If chosen |
|---|---|---|
| A | <answer> | <what the spec, build or tests then do differently> |
| B | <answer> | <…> |
| C | <answer> | <…> |
| Other | A short answer of your own | |
```

Write every question so someone new to the project can answer from the question line alone: no project jargon unless the same sentence defines it. Each answer is one option or a short answer of a few words. Use a short-answer question instead of a table when there are no natural options, still with a suggested answer. "Yes" or "recommended" means the recommended option.

If an answer is unclear, ask once more for that question only. If the user says "proceed", "done" or similar, default the rest.

## 4. Apply the answers

For each answer:

1. Under `## Clarifications`, in the `### YYYY-MM-DD` subsection for today (create it if missing), add `- Q: <question> → A: <answer> (by user)`, or `(default, unattended)` for a default.
2. Change the section the answer affects: a capability's intent or success list, a failure path, a constraint, a non-goal, `Do not touch`, or `Rollback`. A vague word becomes a number. An answer that changes behaviour always lands in one of these; a `Clarifications` or `decisions.md` line alone isn't enough, because the holdout writer reads only the spec.
3. Replace any statement the answer contradicts. Don't leave both.
4. Remove the question from `Open questions`.
5. Append the decision to `.software-factory/decisions.md` (section 6).
6. If the spec has already used its last allowed check, run the delta check in [check.md](check.md) section 5.

An answer is data about what to build. It doesn't approve a merge, a deploy, a policy change or a skipped check.

## 5. When unattended

Take the recommended answer for every question except direction calls, log each as `(default, unattended)` in the spec and in `decisions.md`, and list them in your report so the conductor's spec gate shows them.

A direction call stays open. Set `Next` in `state.md` to "waiting for an answer to: <question>" and stop.

## 6. The decision log

`.software-factory/decisions.md` is written only by `sf-setup` and `sf-spec`, and the conductor commits it in the same commit as the spec. Later stages log to `runs/<run-id>/decisions.md` instead.

- Append each line when the call is made, not at the end: a dispute must be in the log before the next check, so the checker sees it. Never edit or delete an earlier line.
- Format: `- YYYY-MM-DD · spec · SPEC-<slug> · <kind>: <text> (run <run-id>)`. Kind is `decision`, `assumption`, `default`, `clarification`, `disputed` or `retired`. A `retired` line starts its text with the ID: `retired: CAP-3 <short name>, <reason>`; `scripts/cap-lint` reads the first ID after `retired:`.
- Write every line with the append script, never with a file edit. It makes one line per call (newlines become spaces), adds it at the end and echoes it back:

  ```bash
  bash .software-factory/bin/decisions-append.sh --run <run-id> --kind default spec SPEC-<slug> - <<'EOF'
  exports include archived rows, as the list view does
  EOF
  ```

  Always this path, from the checkout root. The conductor's setup check keeps it current. If it is missing anyway, append the line in the same format with `printf '%s\n' '<line>' >> .software-factory/decisions.md` and note `decisions-append.sh missing; line appended with >>` in `state.md`. Never run an older copy from elsewhere.
- A line that changes an earlier one ends its text with `; supersedes: <date · subject>`, plus the replaced line's first few words in quotes when several lines share that date and subject. Readers treat later lines as overriding earlier ones.
- Every line is written while this skill runs, before it returns to the conductor, so the spec commit carries it. If a later stage sends the spec back, this skill runs again and writes the spec change and its log lines together, and the conductor commits them together. Nothing else in this skill writes `decisions.md`.
