# Critique: cognitive load

A design review lens of the [critique rubric](rubric.md#design-review-lenses). Cognitive load is the
total mental effort an interface asks for; overloaded users make mistakes, get frustrated and leave.
Report each failed checklist item, the rating, and every decision point with more than four visible
options.

## Three kinds of load

- **Intrinsic: the task itself.** It cannot be removed, only structured: discrete steps, scaffolding
  (templates, defaults, examples), progressive disclosure, related decisions grouped.
- **Extraneous: bad design.** Pure waste; remove it. Sources: navigation that needs mental mapping,
  labels that force a guess, clutter competing for attention, inconsistent patterns that block
  learning, steps between intent and result.
- **Germane: learning.** Good load that leads to mastery. Support it with gradual disclosure,
  consistent patterns that reward learning, feedback that confirms understanding, onboarding that
  teaches through action rather than walls of text.

## Checklist

- [ ] **Single focus**: the primary task can be done without distraction from competing elements.
- [ ] **Chunking**: information comes in digestible groups (four items or fewer per group).
- [ ] **Grouping**: related items are visibly grouped (proximity, a shared ground).
- [ ] **Visual hierarchy**: what matters most is clear at once.
- [ ] **One thing at a time**: one decision before the next.
- [ ] **Minimal choices**: four or fewer visible options at any decision point.
- [ ] **Working memory**: nothing from a previous screen must be remembered to act on this one.
- [ ] **Progressive disclosure**: complexity appears only when needed.

**Rating** by failed items: 0-1 low (good) · 2-3 moderate (address soon) · 4+ high (critical fix).

## The working-memory count

People hold about four items in working memory at once (Miller's law as revised by Cowan, 2001). At
each decision point, count the distinct options, actions or pieces of information the user must weigh
together: four or fewer is manageable; five to seven pushes the limit (group or disclose
progressively); eight or more overloads (users skip, misclick or abandon).

Applied: one primary action and one or two secondary, the rest in a menu; five or fewer top-level
navigation items, the rest grouped under clear categories; one reading path in a long article, with
related links gathered at the end; four or fewer sibling choices per level in a docs sidebar before
grouping; one decision per screen in a portfolio or gallery index (which piece to open), not filter,
sort and tag controls all at once.

## Common violations

| Violation | Problem | Fix |
|---|---|---|
| Wall of options | ten or more choices with no hierarchy | group, highlight the recommended one, disclose progressively |
| Memory bridge | step 3 needs what was shown in step 1 | keep the context visible, or repeat it where it is needed |
| Hidden navigation | the user must build a mental map | always show the current location (breadcrumbs, active states, progress) |
| Jargon barrier | domain language forces translation | plain language; define unavoidable terms inline |
| Visual noise floor | every element has the same weight | one primary element, two or three secondary, the rest muted |
| Inconsistent pattern | similar actions work differently in different places | the same kind of action gets the same kind of UI |
| Multi-task demand | reading, deciding and navigating at once | sequence the steps |
| Context switch | one decision needs several screens, tabs or modals | co-locate what each decision needs |
