---
# design-md-format=spec
name: software-factory site
description: An image-led landing page for an engineering tool. Friendly flat illustrations carry the story, graphite ink on a cool white ground, one green that means "checked", and commands in mono.
colors:
  bg: "#FFFFFF"
  surface: "#F3F5F6"
  raised: "#E8ECEE"
  border: "#C9D1D6"
  border-strong: "#77838A"
  text: "#121719"
  text-muted: "#4A555B"
  primary: "#0B6A4C"
  primary-hover: "#08553D"
  on-primary: "#FFFFFF"
  primary-soft: "#E2F1EA"
  warning: "#8A5300"
  warning-soft: "#FBEFD9"
  error: "#B42318"
  success: "#0B6A4C"
  dark-bg: "#0E1214"
  dark-surface: "#161B1E"
  dark-raised: "#1E2529"
  dark-border: "#30393E"
  dark-border-strong: "#7D8A91"
  dark-text: "#E8EDEF"
  dark-text-muted: "#A9B4BA"
  dark-primary: "#5BD0A0"
  dark-primary-hover: "#7EDCB5"
  dark-on-primary: "#062118"
  dark-primary-soft: "#13342A"
  dark-warning: "#F2B755"
  dark-warning-soft: "#3A2C12"
  dark-error: "#FF8A7A"
  dark-success: "#5BD0A0"
typography:
  display:
    fontFamily: Source Sans 3
    fontWeight: 650
    fontSize: clamp(2.375rem, 1.6rem + 3vw, 3.75rem)
    lineHeight: 1.05
    letterSpacing: -0.02em
  h2:
    fontFamily: Source Sans 3
    fontWeight: 650
    fontSize: clamp(1.75rem, 1.35rem + 1.5vw, 2.5rem)
    lineHeight: 1.12
    letterSpacing: -0.012em
  h3:
    fontFamily: Source Sans 3
    fontWeight: 650
    fontSize: 1.25rem
    lineHeight: 1.3
  body:
    fontFamily: Source Sans 3
    fontWeight: 400
    fontSize: 1.125rem
    lineHeight: 1.6
  small:
    fontFamily: Source Sans 3
    fontWeight: 400
    fontSize: 0.9375rem
    lineHeight: 1.5
  label:
    fontFamily: Source Sans 3
    fontWeight: 600
    fontSize: 0.875rem
    lineHeight: 1.4
    letterSpacing: 0.01em
  mono:
    fontFamily: JetBrains Mono
    fontWeight: 450
    fontSize: 0.9em
    fontFeature: "calt 0"
rounded:
  sm: 4px
  md: 6px
  lg: 10px
  xl: 18px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  link:
    textColor: "{colors.primary}"
  command-block:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
  inline-code:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.sm}"
  table-row-divider:
    borderColor: "{colors.border}"
  nav-link:
    textColor: "{colors.text}"
  nav-link-current:
    textColor: "{colors.text}"
    borderColor: "{colors.primary}"
  diagram-stroke:
    borderColor: "{colors.border-strong}"
---

# software-factory site

## Overview

**Creative North Star:** a picture book for engineers. Visitors don't read, so illustrations do the explaining and words are kept to labels. A reader should be able to copy the install commands from the first screen and understand each path from its picture and command chain alone.

**Product context:** free, open-source agent skills installed as Claude Code plugins. Readers are developers using a coding agent, people new to agent workflows, and solo founders. Project type: a two-page static site served from `software-factory/docs/` on GitHub Pages: `index.html` (one scrolling page) and `commands.html` (generated cheat sheet). `skills.html`, `get-started.html` and `specialists.html` are redirect stubs kept so old links work.

**Mode per surface:**
- Home: Persuade by showing. Hero illustration, headline, install block; then illustrated cards for start, paths and rules, and the flow diagram.
- Commands: Operate. A compact grid generated from the skills on disk by `scripts/build-site.mjs`.

**Key characteristics:**
- Illustrations lead every section. Words are the copy deck's labels and one-line captions, never paragraphs.
- Graphite text on a cool white, or near-black ground, with contrast well above AA.
- One green. It marks the primary action, links and anything "checked" or "passing".
- Mono for commands and skill names, sans for everything else.
- Cards with a gentle hover lift and a subtle entrance; nothing moves for readers who ask for reduced motion.
- Nothing hard-codes the skill list or a skill count; the cheat sheet is generated.

## Colors

**Strategy:** Restrained. Neutrals plus one accent. The accent is green because the product's promise is evidence: a passing check. Using green only for the primary action, links and "verified" states keeps that meaning intact.

**Light or dark:** both, with no default preference. Readers arrive from an editor or a terminal, which may be in either mode, so the site follows the operating system setting and offers a toggle that remembers the choice in the browser.

Neutrals are cool graphite (a little blue-green in the grey) so they sit with the green accent without looking warm or cream. In dark mode, surfaces step up in lightness (`dark-bg` → `dark-surface` → `dark-raised`) rather than inverting the light palette; borders stay visible but quiet. The dark accent is lighter and slightly desaturated so it holds 7:1 or better on dark surfaces without glowing.

Contrast, measured: body text 18.1:1 (light) and 16.0:1 (dark); muted text 7.7:1 and 8.9:1; links 6.6:1 and 10.8:1; button text on primary 6.6:1 and 8.9:1. Diagram strokes use `border-strong`, at least 3.3:1 against every surface in light and 3.8:1 in dark. The light `border` token (1.55:1) is only for dividers that carry no meaning.

`warning` marks the "brought to you first" gate in the specialist diagram. `error` appears only as the red half of `sf-tdd`'s red → green, always next to the words.

## Typography

- **Source Sans 3** (variable, weights 400–700, Latin subset) for display, headings and body. It comes from a documentation and interface tradition: plain, open, legible at small sizes, and not one of the overused display faces. The display voice is set upright at weight 650 with slight negative tracking.
- **JetBrains Mono** (variable, weights 400–600, Latin subset) for commands, skill names, paths and code. Ligatures are off (`calt 0`) so `->` and `!=` read as typed.

Both faces are self-hosted from `assets/fonts/` with their SIL Open Font License files beside them. There are no external font requests. Both use `font-display: swap`, and the fallback stacks are matched in size (`Segoe UI`, `system-ui`, sans-serif; `Cascadia Mono`, `Consolas`, `ui-monospace`, monospace). Glyphs outside the Latin subset, such as `→`, fall back to the system face.

Scale: body 18px; card captions 17px; h3 20px; h2 28–40px; display 38–60px. Each heading level differs by size, not only weight. Labels are 14–15px semibold. Nothing goes below 14px except diagram captions inside SVG, which are 12–13px at the diagram's full size.

## Layout

- Max content width 76rem. Side gutter 16px below 600px, 24px to 1024px, 40px above.
- Sections alternate `bg` and `surface` grounds instead of rules; 96px vertical padding on desktop, 64px on mobile; 40px between a section heading and its cards.
- Hero: copy and install block left, illustration right from 960px; below that the illustration comes first, full width, then the copy.
- Card grids: start cards 1 → 2 → 3 columns; path cards 1 → 2 (last spans) → 3 + 2 at 1100px; rule tiles 1 → 2 → 4.
- Header: wordmark left, Commands and GitHub links, theme toggle last. Below 540px the links wrap under the wordmark and the header stops being sticky.
- The flow diagram keeps its natural legibility on phones by scrolling sideways inside a focusable, labelled region with a "Scroll sideways" hint. The page itself never scrolls sideways at 360px.

## Elevation & Depth

Mostly flat. Depth comes from surface steps (`bg` → `surface` → `raised`), alternating section grounds and 1px borders. The one shadow is the hover lift on cards: a soft, low-opacity drop (`--lift`) shown only while the card is raised. No glows in dark mode. The sticky header uses the page background with a bottom border.

## Shapes

- `rounded.md` (6px) for buttons and the theme toggle.
- `rounded.lg` (10px) for command blocks and cheat-sheet cells.
- `rounded.xl` (18px) for illustrated cards and the flow figure, matching the rounded panel inside each illustration.
- `rounded.sm` (4px) for inline code.
- A copy button inside a command block uses 6px, which is `rounded.lg` minus its 4px inset.

## Components

- **Primary button / copy button:** solid `primary`, `on-primary` text, 44px minimum height. Hover: `primary-hover`. Focus-visible: 3px outline in `text` colour, offset 3px. One per screen: on the home page it is "Copy the 3 commands".
- **Text link:** `primary` colour, underlined (1px, offset 3px); hover thickens the underline to 2px. Links are never colour-only.
- **Command block:** `surface` ground, 1px `border`, mono 15px, under a bar with three muted dots and the copy button. After copying, the label reads "Copied" for two seconds and a polite live region announces it. If the clipboard is unavailable the label reads "Select and copy" and the text is selected. Without JavaScript the button stays hidden and the text is selectable.
- **Inline code:** mono at 0.88em on `raised`, 4px radius.
- **Illustration:** SVG files in `assets/illustrations/` (hero 720x420, cards 240x180), drawn on a rounded `surface` panel with a soft `primary-soft` ellipse, graphite figures and green checks. Each file carries its own light and dark palette under `prefers-color-scheme`, which follows the page's `color-scheme`, so the toggle reaches them. Embedded as `<img>` with `alt` taken from the SVG's `<title>`.
- **Illustrated card:** illustration on top, then an h3 label and a one-line muted caption, inside an 18px-radius card with a 1px border. Start cards add a green numbered disc; path cards add a command chain; rule tiles add the skill name in small mono. Hover: lifts 4px with the `--lift` shadow and a stronger border. On phones rule tiles sit image-beside-text; the two wide path cards do the same at 1100px and up.
- **Command chain:** an ordered list of mono chips on `primary-soft`, joined by arrows that screen readers skip; "or" separates alternatives. Plain-language steps use a sans chip.
- **Flow figure:** `assets/flow.svg` in an 18px-radius bordered figure. `alt` is its `<title>`; the full description sits in a visually hidden paragraph linked by `aria-describedby`.
- **Cheat-sheet cell:** command in mono (green and slash-prefixed when the user types it), one-line label below. Generated between `<!-- commands:start -->` and `<!-- commands:end -->`, grouped by plugin, with user-run skills first and an "Also applies on its own" group on `surface`. Hand edits inside the markers are overwritten.
- **Footer link card:** a small muted kicker ("Company work?") over the underlined link name, in a bordered card that lifts 3px on hover.
- **Navigation link:** `text` colour; the current page has a 2px `primary` underline and `aria-current="page"`.
- **Theme toggle:** a button whose visible label names the current theme ("Theme: Light" / "Theme: Dark"). Hidden until the script runs, follows the OS setting until clicked, and remembers the choice in `localStorage`.
- **Skip link:** first focusable element; hidden until focused, then shown top-left as a primary button.

## Do's and Don'ts

- Do let an illustration carry each idea; keep text to a label and one line.
- Do keep green for actions, links and "checked" states only.
- Do put every command in a command block, chain chip or inline code, in mono, exactly as typed.
- Do give every SVG a `<title>` and `<desc>`, and use the title as the `alt`; complex diagrams also get a hidden long description.
- Do regenerate the cheat sheet with `node scripts/build-site.mjs` after adding a skill; `--check` fails when it is stale.
- Do check both themes at 375px and 1280px before shipping a change.
- Don't write a skill count or a hard-coded skill list into copy, headings, alt text or the social image.
- Don't add paragraphs, instructions or kicker labels above headlines; if it needs reading, draw it.
- Don't use gradients, glow, frosted glass, emoji or stock photography.
- Don't centre body text or headings.
- Don't load fonts, scripts or images from another origin.

## Motion

- **Approach:** lively but quiet.
- **Easing:** enter `cubic-bezier(0.22, 1, 0.36, 1)`; colour changes ease-out.
- **Duration:** micro 100ms (link underline, button colour); hover lift 220ms; entrance 600ms.
- **Authored moments:** the hero copy and illustration rise in on load, staggered by about 80ms; the hero illustration floats 6px on a slow 6s loop; cards rise 22px and fade in as they scroll into view, staggered 70ms per card. The scroll entrance is armed only when the script runs, so content is never hidden without JavaScript.
- Under `prefers-reduced-motion: reduce` there is no entrance, no float, no lift and no transition.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-10-23 | Initial design system created | Created by `sf-design` (consultation mode) from `company.md`, the site copy and the brief: calm, precise, light and dark, high contrast, no stock gradients, no emoji. Research and outside voices were not run. |
| 2026-10-23 | Self-host Source Sans 3 and JetBrains Mono | The brief rules out external fonts; a system stack as the primary face reads as unconsidered. Two OFL faces, Latin subsets, about 60 KB together, served from the site's own folder with licences beside them. |
| 2026-10-23 | One green accent meaning "checked" | The product's promise is evidence before "done"; the accent carries that meaning and nothing else. |
| 2026-10-23 | Theme follows the OS, toggle overrides | Readers come from editors and terminals in either mode; neither theme is the default. |
| 2026-10-23 | Diagrams as `<img>` SVG files that follow the page theme | Each SVG switches palette with `prefers-color-scheme`; the page sets `color-scheme` on the root, which the embedded SVG follows, so the toggle reaches the diagrams without inlining them. |
| 2026-10-23 | No Pretext layout engine, no `contenteditable` | The html mode's defaults conflict with the brief (static HTML, no external or extra scripts). Plain CSS layout is enough for documentation pages. |
| 2026-10-23 | Image-led rebuild: illustrations join the system | Visitors don't read. The old "no illustrations beyond the diagrams" rule is replaced: flat SVG illustrations carry the hero, start, path and rule sections, and copy is cut to labels. |
| 2026-10-23 | Two pages instead of four | Get started, Skills and Specialists folded into the home page and a cheat sheet; the old URLs redirect (Specialists to the agent-factory site). |
| 2026-10-23 | Hover-lift shadow and entrance motion | The owner asked for a livelier page. One soft shadow, only on hover; all motion respects reduced-motion. |
| 2026-10-23 | Cheat sheet generated from SKILL.md frontmatter | Skills will be added later, so nothing may hard-code the list or a count. `scripts/build-site.mjs` writes it from `plugins/*/skills/*/SKILL.md`, with labels from `docs/commands.labels.json`. |
