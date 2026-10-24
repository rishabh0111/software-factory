# Quieter: lower the intensity, keep the point of view

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** what is working and must survive, when the code does not show it.

Quiet design is harder than bold: subtlety needs precision. The move reduces
intensity in a loud, aggressive or overstimulating design while keeping its
personality. Quiet that loses intent collapses to generic: grey text on white, one
sans at one weight, a grid of identical cards. It is the wrong move when the
surface is cluttered rather than loud (distill) or when the world itself is wrong
(`/sf-design direction`).

By mode ([modes](../../sf-frontend-ui/SKILL.md#modes)):
- **Persuade, Experience**: a more restrained palette, more whitespace, more
  typographic air; drama reduced, the point of view intact.
- **Operate, Read**: less visual noise: fewer background accents, flatter
  surfaces, less colour, less motion, so the tool disappears into the task.

Craft depth: [the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) (contrast
on coloured fields, depth, motion easing),
[colour.md](../../sf-frontend-ui/references/colour.md),
[type.md](../../sf-frontend-ui/references/type.md),
[motion.md](../../sf-frontend-ui/references/motion.md),
[tells.md](../../sf-frontend-ui/references/tells.md) (glow, glass, gradients).

## 1. Assess

Name the intensity sources: colour saturation, contrast extremes, visual weight
(too many heavy elements competing), animation excess, complexity (patterns,
decoration), scale (everything large, no hierarchy). Then the context: purpose
(marketing, tool, reading), audience (some contexts need energy), what works, the
core message. Ask when these are unclear from the code. Done when each source is
named with the element that carries it.

## 2. Plan

Decide the colour approach (desaturate or shift to restrained tones), the hierarchy
approach (the very few elements that stay bold, the rest that recede), what is
removed entirely, and how restraint signals quality. Done when the plan names the
elements that stay loud.

## 3. Reduce

- **Colour.** Saturation down to roughly 70-85%; muted tones for bright ones; fewer
  colours; neutrals do more and colour becomes the accent; high contrast only where
  it matters; tinted neutrals instead of pure grey.
- **Weight.** Lighter weights (900 → 600, 700 → 500), smaller sizes where right;
  hierarchy through weight, size and space rather than colour and boldness; more
  breathing room; thinner, fainter or no borders.
- **Simplification.** Remove gradients, shadows, patterns and textures that serve
  nothing; simplify radius extremes and custom shapes; flatten layering; reduce
  blur, glow and stacked shadows.
- **Motion.** Shorter travel (10-20px instead of 40px), gentler ease-out (the
  ease-out-quart family); keep functional motion, drop flourishes and dramatic
  micro-interactions; remove animation that serves no purpose.
- **Composition.** Smaller scale jumps, rogue elements back on the grid, spacing
  evened into one rhythm.

Keep a hierarchy (some anchors stay large and strong), keep colour (quiet is not
grayscale), keep character, and keep every functional affordance clear. Done when
each source from step 1 is reduced or deliberately kept.

## Done when

- Users still accomplish the task as easily.
- It still has character; nobody would call it generic.
- Text is easier to read for extended periods.
- The point of view survives the cuts: restrained, not absent.
