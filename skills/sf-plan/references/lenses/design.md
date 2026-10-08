## Lens: design (when a plan changes something people see or operate)

Review the plans as a product designer reading them before any screen exists. The question is what decisions the plans leave open that an implementer will fill with a default nobody chose. Don't produce mockups. Read the existing UI code, any design system or `DESIGN.md`, and shared components before rating. If the project has no design system file, say so once in the output; it's a gap, not a finding per plan.

A UI ticket whose spec gives no design reference (a mockup, a prototype, an existing screen to match) and no layout rule is a high finding: the implementer will guess the layout. Name what's missing.

### Rate each dimension

For each dimension, give a score from 0 to 10 for how fully the plans decide it, and say concretely what would make it a 10 for this change. A score below 10 names the missing decision. Below 7 is a high finding; a dimension the spec explicitly requires and the plans don't address is critical.

1. **States.** For each UI feature, what the user sees while loading, when empty, on error, on success and when partial (some items failed, some data missing). Empty states say what happened and offer the next action, not just "No items found". Errors say what the user can do next and keep what they entered. Ask for a table:

   ```
   FEATURE        | LOADING | EMPTY | ERROR | SUCCESS | PARTIAL
   ---------------|---------|-------|-------|---------|--------
   <each feature> | <spec>  | <spec>| <spec>| <spec>  | <spec>
   ```

2. **Hierarchy.** What the user sees first, second and third on each screen or step, what the primary action is, and how the user gets to and from each screen (entry points, back, where they land after the action). If everything is equally prominent, nothing is. Vague descriptions ("clean, modern layout", "a dashboard with widgets") decide nothing; ask for the specific layout, component and copy.
3. **Consistency with existing UI.** Which existing components, patterns, tokens and copy conventions the plans reuse. A new component needs a reason the existing ones don't fit. Names and wording match what users already see elsewhere in the product.
4. **Accessibility.** Keyboard path through every interaction and where focus goes after it (dialogs, errors, new content), labels and roles for screen readers, colour contrast, touch targets of at least 44 px, and no information carried by colour alone.
5. **Responsive behaviour.** What changes at each viewport the product supports: which elements move, collapse or hide, and how navigation and tables behave on a narrow screen. "Stacks on mobile" is not a decision.
6. **Specific, not generic.** Name the surface's mode: persuade (a landing page), operate (a tool used daily), read (docs, reports) or experience (media, games). Then flag the generic look an implementer reaches for by default: a card grid as the first impression, stacked cards as an app layout, a carousel with no purpose, a hero that could belong to any product, copy that describes a mood instead of the user's task. Each should be replaced by the layout this product's task needs, named concretely.

Also check edge content: very long names, zero, one and many items, maximum-length input, slow responses, double submits, navigating away mid-operation, a stale session, and the same screen open in two tabs.

Subtraction is the default: an element no success check or user task needs is a "could cut" finding.

### Output

After the findings table, add:

| Dimension | Score | What would make it a 10 |
|---|---|---|

and a list of open decisions:

| Decision needed | If left open, what happens |
|---|---|
| Empty state for the order list | The implementer ships "No items found" with no next step |

Design findings are proposals for the planner. Changing what the spec says a user can do is a user challenge, not a design fix.
