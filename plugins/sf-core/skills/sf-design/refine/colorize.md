# Colorize: colour as hierarchy, meaning and atmosphere

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the confirmed brand colours.

Introduce colour that does jobs, inside the current world: confirmed brand and
semantic conventions stay. It is the wrong move when the task needs a new identity
(`/sf-design direction`, which replaces DESIGN.md) or when the surface is already
loud (quieter).

By mode ([modes](../../sf-frontend-ui/SKILL.md#modes)):
- **Persuade, Experience**: colour may carry the voice and own large regions when
  the world calls for it.
- **Operate, Read**: colour encodes action, selection, status, wayfinding and
  reading hierarchy; rarity gives the accent its force.

Craft depth: the floor's colour and contrast lines
([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)) and
[colour.md](../../sf-frontend-ui/references/colour.md) (strategies, OKLCH, dark themes).

## 1. Audit

Read DESIGN.md, tokens, assets, current themes and representative states. Name:
the confirmed brand colours; the current surface, text, action and semantic roles;
where greyscale hides hierarchy or state; contrast failures and colour-only
signals; light, dark and data-visualisation needs; whether the request is more
colour or a new identity. Ask only when a binding brand decision cannot be
inferred. Done when each item has an answer from the source.

## 2. Choose a strategy

Name the emotional temperature, the dominant relationship, the contrast range and
the colour dosage before editing; the strategy follows the brief and the world,
restrained or immersive. Build roles, not a bag of swatches:

- canvas and elevated surfaces;
- primary and secondary text;
- action, focus and selection;
- borders and separators;
- success, warning, error, information;
- data categories or scales when needed.

Work in the project's colour space; a new web palette prefers OKLCH. Hue comes from
product meaning and the direction, not a category's default. Done when every role
has a token name and a value.

## 3. Apply at system scale

- The strongest colour owns a deliberate region or role, not scattered accents.
- The primary action stays easy to find; its colour is not spent on decoration.
- Neutrals take the brand tint only when it creates cohesion; neutral grey is
  valid when it serves the world.
- Semantic meanings stay consistent, following platform and domain conventions.
- Data uses lightness, chroma, shape, label or pattern as well as hue.
- Dark mode designs its own elevation and contrast; never a mechanical inversion.
- With a token system: primitive values plus semantic tokens, so a theme change
  remaps roles.
- Explicit colours over chains of translucent overlays, whose contrast depends on
  what lies beneath.
- OKLCH ramps vary lightness and pull chroma down near white and black.

Done when every colour in the diff maps to a role or a named atmospheric purpose.

## 4. Check contrast and perception

Measure computed foreground and background pairs: text tiers per the floor, and
controls, icons and focus indicators at 3:1 (WCAG non-text contrast). Cover
interactive states, overlays, text on images, disabled content and both themes.
Simulate common colour-vision deficiencies (the browser's rendering emulation, or
by eye on a desaturated capture). Done when every pair has a measured ratio.

## Done when

- Every colour has a stable role or a world-specific atmospheric purpose.
- Attention lands on the intended action, content or state.
- The palette holds across quiet, dense, interactive, error and empty states.
- Light and dark are each composed.
- Contrast and non-colour cues pass in every relevant state.
- It reads as this product, not a generic colourful treatment.

## Variant parameter (shotgun live variants)

When shotgun mode's live browser variants run this move, every variant declares a
`color-amount` parameter and authors its CSS against `var(--p-color-amount, 0.5)`,
so the user slides from neutral to the variant's full strategy without
regenerating:

```json
{"id":"color-amount","kind":"range","min":0,"max":1,"step":0.05,"default":0.5,"label":"Color amount"}
```

At most two more variant-specific parameters (palette, temperature, tint
behaviour). The parameter contract is in [shotgun.md](../shotgun.md).
