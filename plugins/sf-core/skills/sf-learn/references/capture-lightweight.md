# Capture, Lightweight mode

One pass in this context, for a session close to its context limit, or a non-interactive call with `depth:lightweight`. It writes the same kind of lesson as Full mode and launches no subagents: it gives up the finder's overlap detection and cross-references, session history, the semantic validator and the review lenses. Done when the lesson is written, both script checks pass, and the completion output is emitted.

1. **Extract** the problem and solution from the conversation. Scan an auto-memory block in context as [capture-research.md](capture-research.md) step 2 says, tagging what you use. Ground code-behavior and merge-state claims exactly as its step 6 says.
2. **Classify** as its step 5 says: read [schema.yaml](schema.yaml) and [lesson-format.md](lesson-format.md), sample the corpus, and pick track, category, `component`, `root_cause` and filename by the corpus-first rule.
3. **Write a minimal lesson.** Check the exact path `<lessons-dir>/<category>/<filename>.md` first. It exists: read it, and update it only when it covers the same problem (keep path and frontmatter structure, add `last_updated: YYYY-MM-DD`); otherwise pick a distinct filename and re-check that path. This is exact-path collision handling only, never Full mode's overlap research. Fill the track's template:
   - bug track: problem, root cause, solution with the key snippets, one prevention tip;
   - knowledge track: context, guidance with key examples, one note on when it applies;
   - frontmatter with the track's fields and the YAML-safety rule applied.
4. **Vocabulary**, update-only: read [vocabulary.md](vocabulary.md) and run its Lightweight rule.
5. **Discoverability**, read-only: judge from the project instructions already in context, opening no file, against the three things in [discoverability.md](discoverability.md). Record `no gap`, `gap noted — instruction-file tip emitted`, or `not applicable — no project instructions`.
6. **Mechanical claims check** and **frontmatter parser-safety check** from [validation.md](validation.md), each to a clean result, with its manual fallback when the script is missing.

A Lightweight lesson may overlap an existing one; a later `/sf-learn refresh` catches it. Suggest `/sf-learn refresh <scope>` only for an obvious narrow target.

## Completion output

Non-interactive: the Lightweight report in [capture-report.md](capture-report.md). Interactive:

```
✓ Documentation complete (lightweight mode)

File created:
- <lessons-dir>/<category>/<filename>.md

[When the discoverability check found a gap:]
Tip: your AGENTS.md/CLAUDE.md does not point agents to <lessons-dir>;
a one-line mention helps every agent find these lessons.

Note: written in lightweight mode. For cross-references, overlap detection,
specialist reviews and semantic grounding, re-run `/sf-learn capture` in a
fresh session.
```
