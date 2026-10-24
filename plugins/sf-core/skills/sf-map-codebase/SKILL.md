---
name: sf-map-codebase
description: Map an existing codebase into seven reference docs (stack, integrations, architecture, structure, conventions, testing, concerns).
disable-model-invocation: true
argument-hint: "[--focus tech|arch|quality|concerns|tech+arch|intent] [--paths p1,p2,...] [focus hint]"
---

# Map the codebase

Map an existing codebase into structured reference documents in the codebase-map folder that [work-docs.md](../../references/work-docs.md) names. Read-only mapper subagents explore one focus area each, with fresh context, following [codebase-mapper.md](codebase-mapper.md), and return their documents in full; you write them.

Run it before planning work on an unfamiliar codebase, before a major refactor, or after significant change to refresh the map. A repository with no code yet, or under five files, has nothing to map: say so and stop.

## Arguments

| Argument | Effect |
|---|---|
| none | Full map: four mappers in parallel, all seven documents. |
| `--focus <area>` | One mapper for that area only: `tech`, `arch`, `quality`, `concerns`, `intent`, or `tech+arch` (the default when `--focus` has no value). |
| `--paths <p1,p2,...>` | Every mapper explores only these repo-relative prefixes. Reject a value containing `..`, starting with `/`, or holding a shell metacharacter (`;` `` ` `` `$` `&` `|` `<` `>`); when every value is rejected, map the whole repo and say so. |
| other text | A focus hint passed to every mapper. |

| Focus | Documents |
|---|---|
| `tech` | STACK.md, INTEGRATIONS.md |
| `arch` | ARCHITECTURE.md, STRUCTURE.md |
| `quality` | CONVENTIONS.md, TESTING.md |
| `concerns` | CONCERNS.md |
| `tech+arch` | STACK.md, INTEGRATIONS.md, ARCHITECTURE.md, STRUCTURE.md |
| `intent` | TRUST-BOUNDARIES.md, FLOWS.md, PERMISSIONS.md, VARIABLES.md, and EMAILS.md, CRON.md, SEO.md, AUTOMATION.md where the capability exists |

The `intent` focus maps who may do what, where each flow enforces it, which values are secrets and what runs on its own: the documented intent a reviewer, a security audit or a coverage map checks the code against. It runs only when named (the full map stays the four focus areas above), and on a request for the system or permission docs a reviewer needs. Its rules, including where its documents go, are in [intent-docs.md](intent-docs.md): read that file before step 1 of an intent run.

## 1. Resolve the folder

Take the codebase-map folder from work-docs.md as `MAP_DIR`, then:

```bash
ls "$MAP_DIR"/*.md 2>/dev/null || true
date +%Y-%m-%d
```

Done when you hold `MAP_DIR`, the documents already in it, today's date, the focus areas in scope and the validated scope (`full repo` or the path list).

## 2. Check the existing map

When any document this run would produce already exists, list them with their modification dates and ask:

1. **Refresh**: regenerate every document in scope.
2. **Update**: regenerate only the documents the user picks.
3. **Skip**: keep the map as it is, and stop.

Record the documents this run regenerates as `UPDATED_DOCS`, and drop focus areas none of whose documents are in it. Done when the user has answered, or no document in scope existed.

## 3. Run the mappers

**With a subagent tool:** dispatch one general-purpose subagent per focus area in scope, all in a single message so they run in parallel. Use a general-purpose agent, which reads files and runs shell commands; a search-only or browser agent cannot map a codebase. Tell the user the mappers return nothing until they finish, often one to five minutes. While they run, leave the codebase to them: no reading, mapping or writing of your own. Each prompt:

```text
Read <this skill's directory>/codebase-mapper.md in full and follow it as your instructions. For the intent focus, also read <this skill's directory>/intent-docs.md in full.
You are read-only: explore with Read, Grep, Glob and read-only shell commands, and write no files.
Focus: <focus>
Today's date: <date>
Scope: <full repo, or the validated path list>
Hint: <focus hint, or none>
Set every date stamp (`**Analysis Date:**`, the footer, `<!-- refreshed: ... -->`) to today's date, overwriting any date already there.
Return each of these documents in full, each under a `=== <NAME>.md ===` header: <the focus's documents>
```

**Without a subagent tool:** run each focus area yourself, one after another, following codebase-mapper.md with the same date, scope and templates, and write each document as you finish it.

Done when every focus area in scope has returned its documents or failed, with each failure noted.

## 4. Write the documents

Split each reply at its `=== <NAME>.md ===` headers and write the content under each to `$MAP_DIR/<NAME>.md`, creating the folder if needed; an intent document goes to the path resolved for it under *Where the documents go* in [intent-docs.md](intent-docs.md). Then:

```bash
wc -l "$MAP_DIR"/*.md
```

Done when every returned document is on disk and has more than 20 lines; name each missing or short document and the focus area that owned it.

## 5. Stamp freshness

Stamp the commit each document describes into its frontmatter. This is a shell step because the human-readable dates are rewritten on every update run, so only a stamp no agent writes can show what a document actually reflects:

```bash
COMMIT=$(git rev-parse HEAD 2>/dev/null) || COMMIT=""
STAMP_DATE=$(date +%Y-%m-%d)
if [ -n "$COMMIT" ]; then
  for f in $(echo "${UPDATED_DOCS:-STACK.md,INTEGRATIONS.md,ARCHITECTURE.md,STRUCTURE.md,CONVENTIONS.md,TESTING.md,CONCERNS.md,TRUST-BOUNDARIES.md,FLOWS.md,PERMISSIONS.md,VARIABLES.md,EMAILS.md,CRON.md,SEO.md,AUTOMATION.md}" | tr ',' ' '); do
    p="$MAP_DIR/$f"; [ -f "$p" ] || continue
    awk -v c="$COMMIT" -v d="$STAMP_DATE" '
      NR==1 && $0=="---" { fm=1; print; print "last_mapped_commit: " c; print "last_mapped_at: " d; next }
      NR==1 { print "---"; print "last_mapped_commit: " c; print "last_mapped_at: " d; print "---" }
      fm && $0=="---" { fm=0 }
      fm && /^last_mapped_(commit|at):/ { next }
      { print }' "$p" > "$p.tmp" && mv "$p.tmp" "$p" && echo "stamped: $f" || echo "failed: $f"
  done
else
  echo "skipped: not a git repo"
fi
```

`UPDATED_DOCS` keeps an update run from stamping documents it did not regenerate. Done when every written document prints `stamped`, or the step prints `skipped`; report any `failed` line.

## 6. Scan for secrets

The map is committed, so check it for leaked credentials first:

```bash
grep -E '(sk-[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|glpat-[a-zA-Z0-9_-]+|AKIA[A-Z0-9]{16}|xox[baprs]-[a-zA-Z0-9-]+|-----BEGIN.*PRIVATE KEY|eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.)' "$MAP_DIR"/*.md
```

On a match, show the flagged lines, stop before committing, and wait until the user edits the files or replies that the content is not sensitive. Done when the scan prints nothing, or the user has cleared each match.

## 7. Commit

```bash
git check-ignore -q "$MAP_DIR" || { git add "$MAP_DIR"/*.md && git commit -m "docs: map existing codebase"; }
```

Done when the commit exists, or the folder is git-ignored and you say so.

## 8. Report

List each document with its line count and a one-line description, then the stamped commit. Point to what comes next: `/sf-plan` for a known piece of work, `/sf-decision-map` for a large unclear one, and `/sf-map-codebase --focus <area>` to refresh one area later.
