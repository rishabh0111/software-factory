# TODOS.md Format Reference

The one format for `TODOS.md` items, used by `sf-code-review`, `/sf-ship` (its test and release-prep stages), `/sf-plan-review` (its step 7) and `/sf-release-docs` whenever they add or close an item.

---

## File Structure

```markdown
# TODOS

## <Component>     ← e.g., ## Checkout, ## API, ## Infrastructure
<items sorted P0 first, then P1, P2, P3, P4>

## Completed
<finished items with completion annotation>
```

**Sections:** organise by component or area of the project (`## Checkout`, `## API`, `## Infrastructure`). Within each section, sort items by priority (P0 at top).

---

## TODO Item Format

Each item is an H3 under its section:

```markdown
### <Title>

**What:** One-line description of the work.

**Why:** The concrete problem it solves or value it unlocks.

**Context:** Enough detail that someone picking this up in 3 months understands the motivation, the current state, and where to start.

**Effort:** S / M / L / XL
**Priority:** P0 / P1 / P2 / P3 / P4
**Depends on:** <prerequisites, or "None">
```

**Required fields:** What, Why, Context, Effort, Priority
**Optional fields:** Depends on, Blocked by

---

## Priority Definitions

- **P0** — Blocking: must be done before next release
- **P1** — Critical: should be done this cycle
- **P2** — Important: do when P0/P1 are clear
- **P3** — Nice-to-have: revisit after adoption/usage data
- **P4** — Someday: good idea, no urgency

---

## Completed Item Format

When an item is completed, move it to the `## Completed` section preserving its original content and appending:

```markdown
**Completed:** vX.Y.Z (YYYY-MM-DD)
```
