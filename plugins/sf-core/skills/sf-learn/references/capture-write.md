# Capture write

Step 3 of capture Full mode ([capture.md](../capture.md)). Start only when every research input is in: your classification and draft, the finder's `related.json`, and session history (which may have stopped at the probe). Done when the lesson file is written and its frontmatter passes the parser-safety check.

## 1. Collect the research

Read each artifact under `{run_dir}/`: `related.json`, and `session-history.md` when synthesis ran. The artifact is authoritative; use a subagent's inline return only when its file is absent or empty, because an inline return can collapse into an executive summary.

## 2. Act on overlap

| `related.json` says | Action |
|---|---|
| **Pack-covered**: `pack_overlap` names a rule that already prescribes this | Write no lesson that restates the rule. Interactive: show the rule with its citation `(pack: <id>, <path within the pack>)` and ask: refine the rule in place (writable packs only, see step 4), capture only the repo-specific nuance as a lesson citing the rule, or skip. Non-interactive: write nothing and end with `Documentation skipped — covered by pack rule (pack: <id>, <path within the pack>)`. |
| **High**: an existing lesson covers the same problem, root cause and solution | **Update that lesson** with the fresher context (examples, references, prevention tips). Keep its path and frontmatter structure, add `last_updated: YYYY-MM-DD`, and keep the title unless the problem framing materially shifted. Two lessons on one problem drift apart; the newer context belongs in the existing one. |
| **Moderate**: same area, different angle, cause or solution | Create the new lesson, and flag the overlap for the refresh check. |
| **Low or none** | Create the new lesson. |

## 3. Fold in session history

When session history found relevant prior sessions: dead ends and failed approaches go into **What Didn't Work** (bug track) or **Context** (knowledge track); cross-session patterns enrich **Prevention** or **Why This Matters**. Tag that content "(session history)". Thin findings or `no relevant prior sessions`: go on without.

## 4. Choose the destination

Settle the destination once, here: it fixes the output path and the frontmatter shape every later step uses.

- **Default, a lesson**: the existing lesson's path when step 2 chose update, else `<lessons-dir>/<category>/<filename>.md`, in the shape of [lesson-format.md](lesson-format.md).
- **A rule pack** (interactive Full only): offer it when the capture is prescriptive (a standing always/never rule, not the story of an incident) and at least one resolved pack root is **writable** (its `roots` entry has no `url`/`ref`, so it is a path source rather than a git cache). Ask where it lands: the lessons folder (default), a named writable pack, or a new pack (create the folder and append its entry to the `packs:` list in `<lessons-dir>/packs.yaml`; the one config write capture may make). A pack rule is `<pack dir>/<kebab-case title>.md` at the pack's top level, where pack discovery reads rules. Its shape: `title`, a situational `applies_when` list, prescriptive prose, and no bug-track fields. Git-sourced packs show as `(upstream: manual)` and are never written. Incident-shaped captures and every non-interactive run keep the default.

## 5. Assemble and write

1. Assemble the file in the destination's shape from the draft and the collected pieces, keeping the template's section order unless the user asked for another.
2. Check the frontmatter against [schema.yaml](schema.yaml) (a lesson) or the rule shape (`title` present, `applies_when` a non-empty list), applying the YAML-safety rule in [lesson-format.md](lesson-format.md) to every array item.
3. `mkdir -p` the destination folder and write the file.
4. Run the **frontmatter parser-safety check** in [validation.md](validation.md) on it, and fix and re-run until it passes.
