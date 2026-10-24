# Refresh

The **refresh** branch of [SKILL.md](SKILL.md): audit the lessons in the lessons folder against the current codebase, apply the maintenance the evidence supports, and deliver a complete per-lesson report plus a commit. The lessons only pay off if every one can be trusted.

**Done** when every lesson in scope has exactly one outcome, the vocabulary step is recorded, the full report is printed, the changes are committed (or the commit decision is recorded), and the discoverability check has run.

## Modes

Interactive or non-interactive comes from the flags in [SKILL.md](SKILL.md); the remainder of the arguments is the scope hint.

- **Interactive**: apply unambiguous actions directly and ask only at the judgment calls [classify.md](references/refresh/classify.md) lists under **Decide**.
- **Non-interactive**: never pause. Apply Keep, Update, Consolidate, auto-Delete (only under its three-condition gate) and Replace (only with sufficient evidence). Where classification is genuinely ambiguous or Replace evidence is thin, **stale-mark** instead: add `status: stale`, `stale_reason: <what you found>`, `stale_date: YYYY-MM-DD` to the frontmatter; err toward stale-marking over a wrong action. Relocations apply only under their four-condition gate; splits are always recommended, never applied. With no scope hint, process everything; a hint that matches nothing is reported and the run exits.

In both modes a write that fails (permission denied, say) is recorded as **recommended** and the run continues; it never stops to ask for permissions.

## Glossary-only requests

Invoked to create or bootstrap the glossary ("create a glossary", "build the concept map"): ask which job is meant.

1. **Create the glossary**: skip lesson classification, read [vocabulary.md](references/vocabulary.md) and run its **Repo-wide bootstrap**, then the discoverability check and the commit. A bootstrap is never left uncommitted.
2. **Run a refresh cycle**: proceed normally; the glossary is seeded when absent and reconciled at the vocabulary step.

Non-interactive: run the refresh cycle and say in the report that no repo-wide bootstrap ran.

## Worth lens

The ordinary refresh judges **accuracy**: is each lesson still true and still distinct. It never deletes an accurate lesson for holding knowledge the repo states elsewhere. That second judgment, **worth**, runs only when the user asked for it: the store cleaned up, culled, pruned, trimmed, or brought to the capture bar, in any wording, rather than checked for drift. When that intent is present, state it back and confirm before investigating:

```text
You asked to clean up the lessons. Which do you want?
1. Delete or shorten lessons the codebase already explains. A lesson goes when a test, a code comment, or the instruction file states the same reasoning, and every cut quotes that file. Drift is fixed too. Scope: <scope>.
2. Fix drift only. Stale paths and links, duplicate lessons, and guidance the code no longer supports. Nothing accurate is deleted.
```

On option 1, read [worth-audit.md](references/refresh/worth-audit.md) before investigating. On option 2, or with no such intent, the accuracy refresh is the whole run. Non-interactive cannot confirm: an inferred worth intent runs the worth evidence-gathering and records every worth verdict under **Recommended**; nothing is cut on inferred intent.

## Steps

1. **Scope**: [scope.md](references/refresh/scope.md). Candidates are the `.md` files under the lessons folder, excluding `README.md` and anything under `_archived/`. A hint that matches nothing never widens the scope. Pass the lessons folder's path to every subagent.
2. **Investigate**: [investigate.md](references/refresh/investigate.md). Check each lesson against the current code, then the set for overlap, supersession and contradiction; a contradiction misleads actively, so it outranks individual staleness.
3. **Classify**: [classify.md](references/refresh/classify.md), before assigning any outcome. Each lesson gets exactly one: **Keep**, **Update**, **Consolidate**, **Replace** or **Delete**. Nothing is archived in place; version history is the archive.
4. **Execute**: [actions.md](references/refresh/actions.md), one flow per lesson matching its outcome.
5. **Vocabulary**: [vocabulary.md](references/vocabulary.md), unconditionally, and run its **Refresh** section.
6. **Report**: [deliver.md](references/refresh/deliver.md). Print the full report as markdown: it is the deliverable, and in non-interactive mode the only one.
7. **Commit**: skip when nothing changed; otherwise per [deliver.md](references/refresh/deliver.md) **Commit**, staging only the files this refresh modified.
8. **Discoverability**: [discoverability.md](references/discoverability.md), every run.

## Boundaries

Two hold whatever the evidence says. Refresh never changes product code: a claim about current mechanics follows current code, but guidance with independent support does not become false merely because the code stopped satisfying it; classify the lesson from the guidance evidence and report the conflict as a potential product regression. And when a lesson contradicts a skill, runbook or instruction file, refresh reports it and edits neither.
