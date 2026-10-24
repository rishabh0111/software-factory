# Validating a lesson

A written lesson becomes trusted knowledge: future agents act on its claims without re-checking them. Three checks guard it. Capture runs all three (Lightweight skips the semantic validator); refresh runs the first two on every lesson it writes, moves, merges or splits. Run the scripts as [SKILL.md](../SKILL.md) shows. No check is a hard stop: you judge every flag, because lessons legitimately cite deleted paths and pre-fix states.

## Frontmatter parser-safety check

```bash
"$PY" "$SKILL_DIR/scripts/validate-frontmatter.py" <lesson-path>
```

It catches frontmatter strict YAML parsers silently misread: malformed `---` delimiters, an unquoted ` #` in a scalar (truncated as a comment), an unquoted `: ` in a scalar (read as a nested mapping). Exit 0: parser-safe. Exit 1: stderr names the fields; quote the whole value, rewrite, and re-run until exit 0. Success is never reported while it fails. It checks neither schema rules nor reserved-indicator characters, which fail loudly downstream; it needs only the Python standard library.

**Manual fallback**, at exactly the script's scope (checking wider invites edits it would not require):

1. The opening and closing delimiters are each a line whose content is `---` (trailing whitespace is fine; `----` or `---extra` is not).
2. Each **top-level** `key: value` whose value is not already quoted or structured (does not start with `"`, `'`, `[`, `{`, `|` or `>`) contains no ` #` and no `: `; quote the whole value if it does.

Nested values, array items and quoted values are out of scope here; array items follow the YAML-safety rule in [lesson-format.md](lesson-format.md).

## Mechanical claims check

Optionally `git fetch --quiet` first (skip silently offline: the network is never a correctness dependency). Then:

```bash
"$PY" "$SKILL_DIR/scripts/validate-doc-claims.py" <lesson-path>
```

It checks the body's cited repo paths, commit SHAs, relative links and drafting scaffold against the tree. Exit 0: nothing flagged. Exit 1: a **FLAG** is a claim it can defend; a **NOTE** is an item it could not classify (notes leave the exit code alone). Resolve every flag by **fix**, **annotate** or **confirm intentional**, never an automatic rewrite or pass:

| Flag | Likely meaning | Resolution |
|---|---|---|
| path not found anywhere | Typo, or drafted from memory | Fix the citation or remove the claim |
| path missing here, exists upstream | Stale checkout | Verify against upstream; annotate if the lesson implies the file is present locally |
| path deliberately gone (the lesson says removed or renamed) | Historical citation | Confirm the prose marks it historical ("removed by this fix", "pre-fix state"); add the marker if absent |
| SHA does not resolve, cited as a commit | Fabricated or from another repo | Replace with the PR number, or drop |
| NOTE: unresolved hex, no commit context | Session id or content hash the script cannot tell from a commit | Read the line: not a commit citation, nothing to do; a commit citation, verify it |
| SHA reachable from HEAD only | Local commit; rebase or squash will change it | Replace with the PR number |
| SHA reachable from upstream only | Checkout predates the merge | Keep with a temporal qualifier; verify the landed claim with `gh` |
| SHA exists but unreachable | Rebased away | Replace with the PR number |
| scaffold ("Lesson 3", "Learning 3", `{{…}}`) | Drafting-context leak | Always fix: a real path or link |
| relative link unresolved | Wrong target | Fix the path |

**Manual fallback:** scan the body for cited paths that do not exist, hex words presented as commits (in commands and code blocks as much as prose), numbered-draft labels and `{{…}}` scaffold, and broken relative links.

After any body edit from this check or the next, re-run it until it is clean or every remaining flag is confirmed intentional.

## Semantic grounding validator

Capture Full mode only (interactive and non-interactive). Two trees are ground truth: **code-behavior** claims (enum values, status semantics, limits, defaults) verify against the local working tree, which is what this session produced; **merge-state** claims ("fixed in #1608", "landed") verify against the remote, with `gh pr view` primary and local reachability the fallback. The claims script's `INFO: worktree is N commits behind …` line says how far to distrust the local tree for merge-state.

Dispatch one read-only generic subagent covering the lesson and every glossary entry this run added or edited (a glossary entry written from a session summary is how wrong semantics enter the vocabulary). Use the mid-tier model class reviewer subagents use; a model the user's or project's instructions name for this validator, or a model configured for its role, wins over that default. Prompt:

```
You are a grounding validator for documentation about to enter a permanent
knowledge store. You are read-only: never edit files. Inspect with Read,
Grep, Glob, git (non-mutating), and gh when available.

Inputs: the doc content below, the glossary entries below (if any), and
this staleness context: <INFO line from the claims script, or "none">.

Check every factual claim in three categories:

1. CODE-BEHAVIOR CLAIMS: assertions about how code behaves: enum values,
   status semantics, limits, defaults, ordering, state transitions. For
   each, locate the defining source in the current tree and quote the
   defining line(s) with file:line. Verdict: verified (with quote),
   contradicted (with the quote showing otherwise), or unverifiable
   (defining source not found).

2. MERGE-STATE CLAIMS: assertions that a change landed ("fixed in",
   "merged", "shipped in", "resolved by #N"). Primary check: gh pr view
   <n> --json state,mergedAt,baseRefName (remote truth). Fallback: git
   reachability from the upstream default branch. Verdict: verified,
   contradicted (e.g. PR open, not merged), or unverifiable (offline / no
   gh); mark unverifiable as "degraded", do not guess.

3. INTERNAL COMPLETENESS: countable assertions ("six PRs", "three root
   causes", "all N consumers"). Count the substantiating items in the doc
   itself. Verdict: complete, or short (found M of N).

Ignore session narrative ("we first tried X"): that describes the
conversation, not the tree. Ignore style.

Return a structured list, one entry per claim checked:
  claim (verbatim) | category | verdict | evidence (quote + file:line, or
  command output) | suggested edit (only for non-verified claims)
```

Apply its verdicts:

- **contradicted**: fix the lesson from the quoted evidence (the quote, not the conversation, is authoritative).
- **unverifiable** behavior: soften or attribute ("per this session's conclusion…"), or drop the claim.
- **unverifiable / degraded** merge-state: keep it with an as-of qualifier ("as of this writing") and record degraded verification.
- **short**: complete the enumeration or restate the count to what the lesson substantiates.
- **verified**: no change.

## Reporting

One line in the run report (`Grounding:`): flags adjudicated (fixed / annotated / confirmed), claims checked, claims softened or corrected, `degraded — merge-state claims unverified offline` when it applies, and "checked manually" for any check that ran by its fallback.
