# Looking for it already existing, owned or rejected

Step 3 of the skill. Do every check. Report where you looked under `Where we looked` in the brief, or in the verdict's reason.

## 1. Domain docs first

Before searching code, read `GLOSSARY.md` (or `GLOSSARY-MAP.md`, then the glossary of the context the item touches) and the ADRs in `docs/adr/` that touch the area. Search with the glossary's terms as well as the item's words. An ADR that rejects what the item asks for is a written basis for `out-of-scope`, cited like a non-goal.

## 2. Duplicate items

Search open and closed items by error text, area, trigger, symptom and the item's own URL. Rate the best match:

- `confident`: the error signature matches; or area, trigger and symptom all match; or a common cause has been confirmed
- `possible`: a shared cause is plausible but not shown
- `weak`: only surface wording matches
- `none`

A long-closed match is a regression lead, not a live duplicate.

## 3. Existing fix

Search open and merged PRs/MRs and `git log` for a change that addresses this. A claim in a comment without a commit or PR/MR is not a fix. A fix artifact found for a bug goes in the marker as `fix=<ref>`: the conductor then checks it rather than building a competing one.

## 4. Already built

For a feature request, search the code by concept, not by the request's wording. Cite `path:line` if found.

## 5. Claimed

An assignee on the item, or a comment by a person saying they are fixing it, giving a concrete plan, or asking someone else to implement it, means someone owns the work. A bot summarising or diagnosing is not ownership. A claim with no artifact fails gate condition 3: `needs-info`, waiting on the maintainer: "Is <person> still working on this?".

## 6. Past rejections

Read every file in `.software-factory/out-of-scope/`. Match by concept: "night theme" matches `dark-mode.md`. Also read `.software-factory/constitution.md` and the README's stated non-goals if present. A match is a candidate, not yet a verdict: see "Confirming a rejection" in [writes.md](writes.md).

## 7. A bounded trace (bugs)

Read along the code, starting where the reported action enters and ending where the reported result appears, without changing anything, for at most about ten files. Cite what you found as `path:line` under `Where we looked`, and label any cause as a hypothesis. Stop at the first point where the trace leaves this repo.

If the trace shows the symptom comes from a dependency or another repo below the code path (a library bug, an upstream service, a platform), the verdict is `out-of-scope` with reason `upstream: <project>`; the comment says where to report it. No out-of-scope record is written.
