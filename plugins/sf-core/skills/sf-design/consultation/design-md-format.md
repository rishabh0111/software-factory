# DESIGN.md format

The one format every DESIGN.md that [consultation](../consultation.md) writes takes: proposing a
system (Phase 6 of [consultation-proposal.md](../consultation-proposal.md)), recording one from code
([document.md](document.md)) and consolidating one ([extract.md](extract.md)). It is the open
[DESIGN.md format](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md)
plus our format marker, two trailing sections and an optional sidecar.

**Tokens are normative; prose says where and why to apply them.** A file has three layers, in this
order: YAML front matter (the tokens), the markdown body (canonical sections), and optionally a JSON
sidecar at `.design/design.json` for what the front matter cannot hold.

## Front matter: the token schema

```yaml
---
# design-md-format=spec
name: <project name>
description: <one line: mood, material, energy>
colors:
  primary: "#b8422e"        # descriptive slug per colour the project uses
  on-primary: "#faf7f2"
  surface: "#faf7f2"
  text: "#1d1a17"
  text-muted: "#6b645c"
  error: "#b3261e"
typography:
  display:
    fontFamily: "<face>, <fallback>"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "<face>, <fallback>"
    fontSize: "1rem"
    lineHeight: 1.5
  label:
    fontFamily: "<face>"
    fontSize: "0.75rem"
    letterSpacing: "0.04em"
  mono:
    fontFamily: "<face>"
    fontFeature: "tnum"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
---
```

Every entry is a token the project uses or the user approved; the values above only show the shape.

- **Marker.** Line 2 is `# design-md-format=spec`; the Phase 0 format check in
  [consultation.md](../consultation.md) reads it. Keep it on every write.
- **Five token groups, no others:** `colors`, `typography`, `rounded`, `spacing`, `components`.
  Shadows, motion, breakpoints and focus rings live in the sidecar's `extensions`, or in prose when
  there is no sidecar.
- **Token refs** are `{group.key}` (`{colors.primary}`, `{rounded.md}`). Components may reference
  primitives; primitives hold literal values.
- **Colours** accept any valid CSS colour string. Hex is the portable default; an incumbent `oklch()`,
  `hsl()`, `rgb()`, wide-gamut or mixed value stays as written when it is the project's normative
  source. One format per token: the source of truth stays single.
- **Typography** is one object per role the system has (`display`, `headline`, `title`, `body`,
  `label`, `mono`), carrying only the real props of `fontFamily`, `fontSize`, `fontWeight`,
  `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation`. A font not yet verified stays out of
  `fontFamily`; its role is described in prose as pending.
- **Scale keys are open-ended.** Keep the names the project already uses (`oxblood-deep`,
  `surface-container-low`, numeric steps); colour keys are descriptive slugs, never a renamed default
  scale.
- **Components** take at most these eight props: `backgroundColor`, `textColor`, `typography`,
  `rounded`, `padding`, `size`, `height`, `width`. Borders, shadows, focus rings, motion and
  backdrop effects go to the sidecar component snippet or the Components prose.
- **Variants are sibling keys** (`button-primary`, `button-primary-hover`, `button-primary-active`),
  not nested schema.
- **Only what exists.** Empty scale keys and invented components stay out of the file.

## Body: the sections

The title line is `# Design System: <project name>`. Then these eight canonical sections, in this
order, with these exact headings (tools parse them); omit a section that does not apply rather than
fill it with invented rules:

1. `## Overview`
2. `## Colors`
3. `## Typography`
4. `## Layout`
5. `## Elevation & Depth`
6. `## Shapes`
7. `## Components`
8. `## Do's and Don'ts`

After them, two of ours: `## Motion` and `## Decisions Log`. The format preserves trailing sections;
the canonical eight stay first and unrenamed ("Colors", never "Color Palette & Roles").

```markdown
# Design System: [Project Name]

## Overview

**Creative North Star: "[named metaphor]"**

[2-3 paragraphs: personality, density and aesthetic philosophy, worked outward from the North Star.
Only confirmed visual rejections.]

**Product:** [one line; product facts live in PRODUCT.md]
**Mode per surface:** [one line each: Persuade / Operate / Read / Experience]
**Reference sites:** [URLs, if research was done]
**Key Characteristics:**
- [3-5 first-five-second impressions]

## Colors

[One sentence on the palette's character.]
**Strategy:** [Restrained / Committed / Full palette / Drenched], [why]
**Light or dark:** [from the use scene: who, where, under what light]

### Primary
- **[Descriptive Name]** (#HEX or oklch(...)): [where and why it is used]

### Secondary (only with a second accent)
### Tertiary (only with a third)
### Neutral
- **[Descriptive Name]** (#HEX): [text / background / border / divider role]

### Status (if used)
- **[Descriptive Name]** (#HEX): [success / warning / error / info role]

[Which tokens signal interaction or emphasis, how neutrals derive from the palette, how dark
surfaces keep hierarchy rather than inverting lightness.]

**The [Name] Rule.** [optional doctrine, e.g. "The accent covers at most 10% of a screen."]

## Typography

**Display Font:** [family] (with [fallback])
**Body Font:** [family] (with [fallback])
**Label/Mono Font:** [family, if distinct]
**Character:** [1-2 sentences on the pairing: its source world, register, loading source]

### Hierarchy
- **Display** ([weight], [size or clamp], [line-height]): [purpose, where it appears]
- **Headline** / **Title** / **Body** ([measure, e.g. 65ch]) / **Label** ([tracking], [case]): [purpose]

[Scale ratio and why; justified exceptions to the overused-face list.]

## Layout

[Grid or spatial model per breakpoint, container and max width, density, the spacing rhythm from
small to large, intentional grid breaks. Exact values only when observed or approved.]

## Elevation & Depth

[Shadows, tonal layering or a hybrid. "Flat, depth by tone steps" is a complete answer; say so.]

### Shadow Vocabulary (if any)
- **[Role]** (`box-shadow: [exact value]`): [when to use it]

## Shapes

[Corner and radius hierarchy and where each applies, borders, clipping, recurring silhouettes.
A nested element's inner radius is the outer radius minus the gap.]

## Components

[Per component: a one-line character, then shape, colour assignment, padding, every state it
reaches, and distinctive behaviour.]

### Buttons
- **Shape:** [radius described (exact value)]
- **Primary:** [colour assignment + padding, semantic and exact]
- **Hover / Focus / Active / Disabled:** [treatments, transitions]
- **Secondary / Ghost (if any):** [brief]

### Chips (if used)
### Cards / Containers
- **Corner, Background, Shadow (see Elevation & Depth), Border, Internal Padding**
### Inputs / Fields
- **Style, Focus, Error / Disabled**
### Navigation
- **Style, typography, default / hover / active, mobile treatment**
### [Signature Component] (if the project has a distinctive one)

## Do's and Don'ts

### Do:
- **Do** [specific prescription with exact values or a named rule].

### Don't:
- **Don't** [prohibition confirmed by the incumbent system or the user, including the tempting
  tells for this category].

## Motion

- **Approach:** [minimal-functional / intentional / expressive]
- **Easing:** [the curves for enter, exit, move]
- **Duration:** [the steps in use]
- **The one authored moment:** [what it is, if any]

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| [today] | [decision] | [why; who confirmed it] |
```

## Writing the prose

- **Front matter first.** Prose names a token and its role; it never restates a value differently.
- **Descriptive, then exact:** "gently curved edges (8px)", never "rounded-lg"; every number in
  parens beside its description; no raw class names.
- **Functional:** each token says where and why it is used.
- **Named Rules**, `**The [Name] Rule.** [short doctrine]`, one to three per section where the system
  has real invariants. They are the most citable lines for agents reading the file.
- **Decisive where the evidence is:** hard language for invariants, softer for provisional guidance.
  An audit test ("the accent never fills a surface") only when the system or the user grounds it.
- **Strictly visual.** PRODUCT.md holds the product; carry a line from it only when it is a durable
  brand commitment that constrains the visuals (a binding logo, an identity asset, an accessibility
  need). Page strategy and one surface's concept stay in that surface's brief, never a system rule.
- **Colours grouped by role** (Primary, Secondary, Tertiary, Neutral, Status), never by hue order.
- **Motion** that belongs to one component is described with that component; `## Motion` holds the
  system-wide approach. Budgets per mode: [motion.md](../../sf-frontend-ui/references/motion.md).
- What good depth, contrast, type and states look like is the
  [quality floor](../../sf-frontend-ui/SKILL.md#quality-floor); DESIGN.md records this system's
  choices within it, never a rule below it.

## Seed: a DESIGN.md before code exists

A DESIGN.md proposed before there is an implementation is a seed. Directly after the front matter,
add:

```markdown
<!-- SEED: decided with the user before implementation; run /sf-design consultation to record it from code once there is code. -->
```

Tokens the user approved go in the front matter; a value not yet decided stays out and reads
`[to be resolved during implementation]` in prose. `## Components` appears only for components the
approved proposal specified. A seed has no sidecar. Recording from code later replaces the
placeholders and removes the seed line.

## The sidecar: `.design/design.json` (optional)

The sidecar extends the front matter with what its five groups cannot hold: tonal ramps, shadow,
motion and breakpoint tokens, display names, self-contained component snippets, and the narrative.
Offer it at the confirm step when the system has such values; once a project has one, regenerate it
whenever DESIGN.md is regenerated. A sidecar-only refresh leaves DESIGN.md untouched.

```json
{
  "schemaVersion": 2,
  "generatedAt": "ISO-8601",
  "title": "Design System: [Project Name]",
  "extensions": {
    "colorMeta": {
      "primary": { "role": "primary", "displayName": "Editorial Magenta", "canonical": "oklch(60% 0.25 350)", "tonalRamp": ["...8 steps..."] }
    },
    "typographyMeta": {
      "display": { "displayName": "Display", "purpose": "Hero headlines only." }
    },
    "shadows":     [{ "name": "ambient-low", "value": "0 4px 24px rgba(0,0,0,0.12)", "purpose": "..." }],
    "motion":      [{ "name": "ease-standard", "value": "cubic-bezier(0.4, 0, 0.2, 1)", "purpose": "..." }],
    "breakpoints": [{ "name": "sm", "value": "640px" }]
  },
  "components": [
    {
      "name": "Primary Button",
      "kind": "button | input | nav | chip | card | custom",
      "refersTo": "button-primary",
      "source": "code | synthesized",
      "description": "One line: what and when.",
      "html": "<button class=\"ds-btn-primary\">Save changes</button>",
      "css": ".ds-btn-primary { ... } .ds-btn-primary:hover { ... } .ds-btn-primary:focus-visible { ... }"
    }
  ],
  "narrative": {
    "northStar": "...",
    "overview": "...",
    "keyCharacteristics": ["..."],
    "rules": [{ "name": "The One Voice Rule", "body": "...", "section": "colors|typography|elevation|..." }],
    "dos": ["Do ..."],
    "donts": ["Don't ..."]
  }
}
```

- **Keyed by front-matter name.** `colorMeta.<token>` and `typographyMeta.<token>` carry metadata
  only; primitive values stay in the front matter. `canonical` holds the exact value when the front
  matter carries an approximation.
- **Tonal ramps:** eight steps per colour, dark to light, same hue, lightness from about 15% to 95%,
  chroma reduced near white and black. Use the project's own tonal scale when it has one; otherwise
  compute the steps in OKLCH.
- **Components:** five to ten that best show the system: each button variant as its own entry, input,
  navigation, chip, card, then signature components; utility and wrapper components stay out. When
  the project has no components yet, synthesize the canonical primitives from the tokens and mark
  them `"source": "synthesized"`.
- **Snippets are drop-in and self-contained**, rendering correctly inside a shadow DOM with no
  framework: expand utility classes to literal CSS; reference `:root` custom properties with
  `var(--token)` where they exist, resolve JS-theme tokens to literals; inline icons as SVG (no icon
  fonts, packages or image URLs); include `:hover`, `:focus-visible` and, where meaningful, `:active`;
  keep only the component's distinctive CSS, no universal resets; prefix every class with `ds-`.
- **Narrative is verbatim** from DESIGN.md: `northStar` from the North Star line, `overview` from the
  Overview paragraphs, `keyCharacteristics` from its list, `rules` from every Named Rule tagged with
  its section, `dos` and `donts` from Do's and Don'ts.
