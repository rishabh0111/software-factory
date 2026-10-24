# Colour

How a palette is applied so the UI looks decided rather than tinted. Pages are covered here; app
screens add their own budget in [app-screens.md](app-screens.md#colour-on-light-screens); native apps
use the platform's semantic colours or colour roles ([ios.md](ios.md), [android.md](android.md)).

## Contents

1. What the study measured
2. Light or dark
3. The roles
4. Proportion
5. Surfaces without lines or shadows
6. Colour fields
7. Dark pages
8. Colour and photographs
9. Contrast
10. Banned families, and what "warm" means

## 1. What the study measured

- 41% of the studied pages are dark, 59% light; a quarter sit on pure white, 12% on pure black.
- Schemes: monochrome plus one accent 23%, light neutral 22%, dark neutral 14%, several flat colours 13%,
  strictly two-tone 12%, colour carried by photographs 9%, one saturated field 6%.
- Buttons are neutral (black, white, grey) on 52% of sites; a coloured button is a choice.
- Gradient fills on 22% of top-scored sites against 52% of weak ones; gradient text 2% against 13%.
- One site in 246 has a terracotta primary button and none a violet one: those are colours of generated
  pages, not of the gallery. Warm off-white grounds occur (32 sites), nearly always with a dark or green
  ink rather than an orange accent.
- Top sites change the field colour between sections more often (a median of two section grounds
  against one).

## 2. Light or dark

Pick it from the use scene: who uses this, where, under what ambient light (a kitchen at dawn, a
trading floor, a phone on a night bus). Never from the category ("developer tools are dark").

## 3. The roles

```css
:root {
  --bg: …;          /* the ground: most of the surface */
  --surface: …;     /* one tone step from the ground: panels, fields, tiles */
  --ink: …;         /* main text and the strongest marks */
  --muted: …;       /* secondary text; still 4.5:1 on --bg */
  --accent: …;      /* the one accent */
  --accent-ink: …;  /* text on the accent */
  /* --field-1 … --field-n and their inks, when the palette has section fields */
}
```

Every colour in the build is a token. A raw hex in a component is a second palette starting. No greys
between the roles: a quieter text is `--muted`, a quieter surface is `--surface`.

## 4. Proportion

Decide the shares before colouring anything and check them in the screenshot:

- **Ground** 70-90% of the page.
- **Ink:** text and perhaps one inverted section.
- **Accent** under 5% of any screen: the action and at most one other recurring thing. In five places it
  stops meaning "here".

Palettes with fields work differently: each section is one field at full strength, and the proportion
rule applies inside it. The accent is not for headings, icons, bullets, borders or underlines unless the
direction makes it so. A headline is ink.

## 5. Surfaces without lines or shadows

On pages a surface is told apart from the ground by tone alone:

```css
.panel { background: var(--surface); }            /* 2-6 lightness points from --bg */
.field { background: var(--surface); border: 0; }
.field:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

- One step is enough. If a panel does not read, add padding or space before a second tone.
- No panel inside a panel.
- Images need no frame. A light photograph melting into a light ground gets a new crop or sits on
  `--surface`; never an outline.
- A thick bar (4px or more) in ink or accent is a graphic element where the direction uses it. A 1px line
  is not.
- What floats (a menu, a dialog) carries a real shadow: an offset and a soft blur. A zero-offset coloured
  halo is decoration.

## 6. Colour fields

A section that changes the whole ground is the strongest colour move available; it replaces dividers,
cards and background decoration at once.

- Fields meet edge to edge with a hard line. Nothing fades.
- Every field has its own ink. Never `--muted` on a coloured field: the field's ink at full strength, or
  at 70% opacity for secondary text if it still passes contrast.
- Neighbouring fields differ in lightness, not only hue, or the page vibrates.
- Order them like chapters: open strong, rest, surprise, close dark or very light.
- The meta theme colour and the navigation follow the first field; a fixed header takes the ink of the
  chapter beneath it.

## 7. Dark pages

- `color-scheme: dark` on the root so form controls and scrollbars follow.
- The ground is a deep tone with a slight tint from the palette; the ink a soft light, not `#fff` on
  `#000`, unless the direction is a stark two-tone.
- Secondary text is where dark pages fail: check `--muted` at 4.5:1.
- Depth on dark comes from a lighter surface step, never from glows or coloured light.
- Lighter font weights than on a light page.

## 8. Colour and photographs

- When photographs carry the colour, the interface stays neutral and takes its ink from the darkest tone
  in the imagery.
- No brand-colour wash over photographs: leave them alone, or commit to one treatment for all
  ([imagery.md](imagery.md#6-treatment)).
- Text over a photograph needs a calm region; if there is none, move the text off. A neutral scrim
  (black or the ink, 30-55%, flat or fading over the text area only) is the one gradient allowed.
- A flat field sampled from a photograph (its sky, its shadow) makes a section sit with that image.

## 9. Contrast

- Body text 4.5:1 or better; display type and large numerals 3:1 or better; aim for 7:1 for ink on
  ground.
- Text over photographs and footage is measured at the text's own position, across the whole loop.
- No lowered opacity on text to make it soft without checking the resulting ratio.
- Focus and hover states increase contrast, never reduce it.

## 10. Banned families, and what "warm" means

- **Cream with terracotta.** A yellow-cream ground (roughly hue 22-62, light and noticeably saturated)
  with a rust, clay or burnt-orange accent is the house look of AI assistants and the pages they
  generate. Either half alone is suspect; together they are unmistakable.
- **Violet and indigo.** The first wave of generated pages was purple; it still reads that way.

For warmth: a low-chroma stone, bone or putty ground (saturation under about 15%); a deep green, brown or
oxblood ink; photographs; or a full warm field (mustard, tomato red, pink) used flat and with conviction.
Warmth is not beige. A brand that owns a banned colour keeps it; name it in your report.
