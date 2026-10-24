# Distill: strip to the essence

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the one primary user goal, when the code does not show it.

Remove what does not earn its place: redundant elements, repeated information,
decorative noise, cosmetic complexity. Simplicity removes obstacles between users
and their goals, never features they need. It is the wrong move when the surface is
loud but not cluttered (quieter) or when the domain is genuinely complex and the
task needs its density (match complexity to the real task).

Craft depth: [the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) (nested
cards, rows of identical cards, one primary action per screen, modals),
[layout.md](../../sf-frontend-ui/references/layout.md),
[copy.md](../../sf-frontend-ui/references/copy.md).

## 1. Assess

Name the complexity sources: too many elements (competing buttons, redundant
information), excess variation (colours, fonts, sizes, styles without purpose),
information overload (everything visible at once), visual noise (borders, shadows,
backgrounds, decoration), confusing hierarchy, feature creep (too many options,
actions, paths). Then find the essence: the one primary goal, what is necessary
versus nice to have, what can be removed, hidden or combined, the 20% that
delivers 80% of the value. Ask when these are unclear from the code. Done when the
primary goal is one sentence and each complexity source is named.

## 2. Plan

The core purpose, the essential elements, what moves behind progressive
disclosure, what consolidates. Expect to say no to good ideas. Done when every
element on the screen is marked keep, hide, merge or remove.

## 3. Simplify

- **Information architecture.** Remove secondary actions and redundant information;
  hide complexity behind clear entry points (accordions, step-through flows,
  disclosure); merge similar actions and forms; one primary action, few secondary,
  the rest tertiary or hidden; say each thing once.
- **Visual.** One or two colours plus neutrals; one family, three or four sizes, two
  or three weights; remove decoration that serves neither hierarchy nor function;
  flatten nesting and needless containers, using spacing and alignment where cards
  stood; one spacing scale.
- **Layout.** Simple vertical flow where a complex grid stood; secondary sidebar
  content inline or hidden; generous use of width; one alignment; content that
  breathes.
- **Interaction.** Fewer choices and buttons; smart defaults for common choices;
  inline editing where a modal flow stood; drop a step where the flow allows; one
  obvious next action.
- **Content.** Cut filler, keep meaning; active voice ("Save changes"); plain
  language; scannable paragraphs and headings; no marketing fluff, hedging,
  headers restating intros, or repeated explanations.
- **Code.** Dead CSS, unused components and orphaned files gone; shallower component
  trees; consolidated styles; fewer variants (three that cover 90% beat twelve).

Keep every necessary function, accessible labels and ARIA, the information users
need to decide, and enough hierarchy that the important thing stands out;
minimalism that becomes mystery has gone too far. Done when every element from
step 2 has been dealt with as marked.

## 4. Record what was removed

For each removed feature or option: why it went, whether it needs another access
point, and what user feedback to watch. Done when the report carries this list.

## Done when

- Users reach the goal faster, with less to understand.
- Every necessary feature is still reachable.
- What matters most is obvious.
- The simpler page is no slower, ideally faster.
