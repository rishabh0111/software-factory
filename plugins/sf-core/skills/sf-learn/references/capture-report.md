# Capture report

The last thing capture writes. Render refresh suggestions as `/sf-learn refresh <scope>` in inline code. `File:` lists the destination the write step settled on: a pack rule's path when the user routed the capture into a pack, the lesson's path otherwise. Report rule-pack `warnings`/`errors`, or "rule packs unresolved", once, on a `Packs:` line, when there were any.

## Non-interactive

A terminal report and nothing after it: no question, no menu. It ends the skill, not the turn: a caller's next step follows in the same session.

Full (`depth:full`, or no depth token):

```
✓ Documentation complete (non-interactive mode)

File: <lessons-dir>/<category>/<filename>.md  (created | updated)
Track: <bug | knowledge>
Category: <category>
Overlap: <none | low | moderate — see <path> | high — existing doc updated>
Grounding: <clean | N flags adjudicated (X fixed, Y annotated, Z confirmed) | N claims softened or corrected | degraded — merge-state claims unverified offline>
Instruction-file edit: <none needed | gap noted, not applied>
Glossary: <scanned, no qualifying terms | created with N entries (M seeded from the lesson's area) | updated — N added, N refined, N folded, N scrubbed>
Refresh recommendation: <none | /sf-learn refresh <scope>>

Documentation complete
```

Lightweight (`depth:lightweight`):

```
✓ Documentation complete (non-interactive lightweight mode)

File: <lessons-dir>/<category>/<filename>.md  (created | updated)
Track: <bug | knowledge>
Category: <category>
Grounding: <mechanical check clean | N flags adjudicated>
Discoverability: <no gap | gap noted — instruction-file tip emitted | not applicable — no project instructions>
Glossary: <not present | scanned, no qualifying terms | updated — N added, N refined, N folded, N scrubbed>
Refresh recommendation: <none | /sf-learn refresh <scope>>

Documentation complete
```

Nothing written (unsolved or unverified problem, failed bar, pack-covered, bad `depth:` token):

```
✗ Documentation skipped (non-interactive mode)

Reason: <one sentence, e.g. "no solved problem detected in the conversation">

Documentation skipped
```

## Interactive

```
✓ Documentation complete

Ran Full mode.
Auto memory: 2 relevant entries used as supplementary evidence

Research:
  ✓ Classified: performance_issue in background_job (component from corpus), category: performance-issues/
  ✓ Drafted: 3 code fixes, prevention strategies
  ✓ Related docs: 2 related issues
  ✓ Session history: 3 prior sessions on this branch, 2 failed approaches surfaced

Grounding:
  ✓ Mechanical check: 14 paths, 2 SHAs, 3 links checked — 1 flag annotated as historical
  ✓ Semantic validator: 9 claims verified, 1 merge-state claim softened to pending

Reviews:
  ✓ Performance: query optimization approach validated
  ✓ Code simplicity: examples are minimal

Files written:
- <lessons-dir>/performance-issues/n-plus-one-brief-generation.md (created)
- GLOSSARY.md (created with 3 entries: BriefSystem, EmailQueue, Brief Status)

Refresh recommendation: none
```

When high overlap updated an existing lesson:

```
✓ Documentation updated (existing lesson refreshed with current context)

Overlap: <lessons-dir>/performance-issues/n-plus-one-queries.md
  Matched: problem statement, root cause, solution, referenced files
  Action: updated with fresher code examples and prevention tips

File updated:
- <lessons-dir>/performance-issues/n-plus-one-queries.md (last_updated: 2026-03-24)
```

End the turn after the report. Cross-references the run found are already in the lesson; fixing other lessons is refresh's job, reached through the `Refresh recommendation` line.

## Common mistakes

| Wrong | Right |
|---|---|
| A subagent writes into the lessons folder or another tracked path | Subagents write only to `{run_dir}/` and return the path; this context writes the one lesson |
| A subagent returns its long body only inline | It writes the artifact and this context reads it back; inline is the fallback |
| Writing before research is in | Research completes, then the write step runs |
| Non-interactive capture edits AGENTS.md/CLAUDE.md | Non-interactive Full reports `gap noted, not applied`; Lightweight prints a tip; only interactive Full edits, after consent |
| A new lesson where an existing one covers the problem | High overlap updates the existing lesson |
| Code behaviour or merge state asserted from memory | Read the defining line first; cite PR numbers; soften what cannot be verified |
| Several lessons batched through one run | One lesson per run, run again for the next |
