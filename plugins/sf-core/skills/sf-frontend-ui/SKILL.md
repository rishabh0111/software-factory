---
name: sf-frontend-ui
description: Use when building or changing any user interface - a web page, an app screen, a component, a native iOS or Android screen - or when a UI looks generic, templated or AI-made.
---

# Frontend UI

The quality floor for every UI edit, at any size and any speed. A model left to its defaults builds the
average of every interface it has seen: a centred headline under a small label, a row of icon cards, a
soft gradient, a cream ground with a rust accent. Nothing in it is wrong and nothing in it was
decided. This skill is what decided looks like.

It holds rules, not a design job. To run one (choose a direction, explore variants, critique, audit or
polish a whole surface), suggest the user run `/sf-design`.

## Before the first edit

1. **Read what is already true.** PRODUCT.md and DESIGN.md (at the repo root, or where
   `docs/agents/work-docs.md` says), the incumbent screens, tokens and components. Done when you can
   name the palette, type, spacing scale and component set you will build in, or know that none exists.
2. **The brief wins.** Pinned aesthetics, eras, fonts, palettes and brand assets stay, even where a rule
   below bans them; keep the brand's asset and name it in your report. Refinement keeps the incumbent
   identity, copy and everything outside scope. A redesign keeps product truth, content and function
   and treats the old look as evidence; it never splits the difference into polish on the discarded
   look. Ask before replacing factual copy or adding claims.
3. **Name the kind and the mode** (below) in one line of your notes. A vague request gets your reading
   stated in one line, not a question; ask only when a missing fact blocks the work.
4. **Name what is real:** the content, the data, the imagery that exists (the project's own pictures,
   an image tool, open collections, or nothing), the one thing the visitor must do. Plan around what
   exists. Sample details fill gaps and are listed in your report; proof (customers, quotes, logos,
   ratings, user counts) is never invented.

## Modes

The mode names what the visitor's success looks like on this surface. Choose it from the requested
surface, not the product: a tool's landing page is Persuade, a fashion house's docs are Read, a docs
index is Read.

| Mode | The visitor | Surfaces | Ambition shows as |
|---|---|---|---|
| **Persuade** | decides and acts | landing, marketing, campaign, pricing, product site | a point of view: bold, distinct work, real imagery, the offer and its working action in the opening |
| **Experience** | is inside the work | portfolio, gallery, showcase | the artifact leading from the first viewport while the interface recedes |
| **Operate** | completes a task | app UI, dashboard, editor, admin, settings, tools | precision and restraint; earned familiarity; brand in exact details |
| **Read** | understands something | docs, articles, guides, help, changelog | a calm reading column inside a frame that could belong to no other product |

On Operate and Read, a world or concept lends only type, palette, density and one signature move; the
layout, navigation and controls stay the platform's standard ones. Persuade's opening makes the offer
intelligible and exposes the category's real action in working form (the search, the open slots, add
to cart), not a link to it elsewhere. Depth: Operate in [app-screens.md](references/app-screens.md),
Read in [layout.md](references/layout.md#12-read-surfaces), Persuade and Experience in
[layout.md](references/layout.md) and [imagery.md](references/imagery.md).

**Kind.** A **page** is read and scrolled (Persuade, Experience, Read). An **app screen** is worked in
(Operate). A product site that shows its app is a page; the interface fragments on it follow the
app-screen rules inside them, marked with `data-ui` on the fragment root. When a request holds both,
build each by its own rules with one shared palette and typeface. Before building an app screen, read
[app-screens.md](references/app-screens.md) whole. Native: read [ios.md](references/ios.md) or
[android.md](references/android.md) (both for a cross-platform app); the platform governs structure,
navigation and interaction in every mode.

## Quality floor

Each line is a check on the rendered result, not an intention. Run them in one batched look at the
render at the sizes it ships at (web: 390, 768, 1440; native: the device classes it targets), fix what
that look shows, then look again. If the design-check CLI recorded in `docs/agents/tools.md` is present,
run its detect verb on the changed files and act on its findings; otherwise make these checks by eye on
the render.

### Every surface

- **Tokens.** Every colour, size, radius and space comes from the project's tokens or the scale you set
  first; a raw hex in a component starts a second palette. Semantic names (`--ink`, `--surface`,
  `--accent`), dark variants that work, nothing that breaks on a theme switch.
- **Contrast.** Body, placeholder and every text tier that carries words 4.5:1; large and display text
  3:1. On a coloured field, secondary text takes that field's ink, never grey. Focus and hover raise
  contrast.
- **Colour.** One ground, one ink, one accent. The accent marks the action and at most one other
  recurring thing (on app screens: data, state and selection). Light or dark is picked from the use
  scene (who, where, under what light), not the category. Detail: [colour.md](references/colour.md).
- **Type.** Two typefaces at most, usually one. Few sizes far apart (five is the ceiling on a page);
  body 16px or more on pages, 13-16px on dense app screens, nothing under 11px; measure 45-75ch;
  display tracking no tighter than -0.04em; headings balanced, space above a heading at least twice the
  space below; tabular figures wherever numbers align. Run the real copy at every width and fix what
  overflows. Detail: [type.md](references/type.md).
- **Space.** One grid, one pair of equal outer margins, one gap scale; tight groups, generous
  separation, the gap between sections clearly larger than any gap inside one. Read the computed values.
- **Depth.** Surfaces are told apart by a tone step. Shadows only on what floats (menu, popover, dialog,
  tooltip), with a real offset and a soft blur.
- **States.** Default, hover, focus, active, disabled (legible, saying why), loading, empty, error,
  success, permission: every one the component can reach, built and looked at. Empty states teach the
  next step; errors name the problem and the recovery; loading keeps the final layout.
- **Browser surfaces.** Text selection, caret, focus ring, scrollbar colour (`scrollbar-color`, never a
  reshaped scrollbar), link underline offset and the numerals in tables are themed from the palette.
- **Accessibility (WCAG 2.2 AA).** Real buttons and links; keyboard reach with a visible focus in a
  logical order; a label on every input (above the field, never a placeholder standing in); alt text;
  one `h1` and no skipped heading levels; landmarks; colour never the only signal; focus moved into and
  held in dialogs. Touch targets 44px (iOS 44pt, Android 48dp); WCAG's 24px floor only where spacing
  allows. Checklist: [accessibility-checklist.md](../../references/accessibility-checklist.md).
- **Responsive.** The phone is its own composition, not the desktop shrunk: no sideways page scroll at
  320-390px, re-authored line breaks, re-cropped pictures, navigation folded. Text scaled to 200% keeps
  the layout.
- **Motion.** Content is painted on the first frame; motion only adds arrival. Ease-out curves, never
  bounce or elastic; `transform`, `opacity`, `clip-path`, never layout properties. Every move has a
  `prefers-reduced-motion` version that keeps the state change and drops the travel. Budget by mode:
  [motion.md](references/motion.md).
- **Copy.** The product's own words. Controls name their action ("Book a table", "Invite member"), one
  name per action across the surface. Every requirement in the brief present and findable within
  seconds. Detail: [copy.md](references/copy.md).
- **Icons** are drawn: one real library or authored SVG set, one stroke and weight. Emoji and Unicode
  glyphs never stand in for icons, bullets or decoration.
- **Engineering.** Components focused and composed, data fetching apart from presentation, the
  simplest state that works, overlays that escape clipping containers, no layout thrash. Depth and
  examples: [build.md](references/build.md).

### Banned on every surface

Each has a replacement. The full registry, with how each device became a tell, is
[tells.md](references/tells.md).

| Banned | Instead |
|---|---|
| Eyebrow or kicker: a small label or pill badge above a heading ("New", "Introducing") | The words in the heading or the first sentence, or nothing |
| Gradient text; gradients on grounds, buttons, cards, tiles | Flat colour. Exceptions: a neutral scrim under text on a photo; an area fade under one line chart |
| Glass and backdrop blur as decoration; glows; neon on dark | Opaque surfaces one tone step apart. Native system materials behind bars and sheets belong to the platform |
| Violet or indigo as the palette; a yellow-cream ground with terracotta, rust or clay | Colour from the subject, the brand or a low-chroma stone; warmth from a full warm field or a deep ink |
| A coloured `border-left`/`border-right` over 1px on cards, list items, callouts, alerts | A tone step, a heading, or a status pill |
| Hard offset block shadows (`4px 4px 0`) outside a world that chose neobrutalism; zero-offset coloured halos | A tone step, or a real shadow on what floats |
| Icons in tinted squares or circles on every card or KPI; nested cards | A label and the content; one plain icon where it helps |
| Sparklines, rings and soft rounded rectangles standing in for content; grey-bar fake dashboards | The real content, a real interface fragment, or nothing |
| Monospace as a "technical" costume | The text face with tabular figures; mono for code (and on app screens for IDs, keys, or every figure as one decision) |
| A styled accent word in a headline (italic, serif, coloured, underlined) | One face, one colour; the words carry the emphasis |
| A modal for a task that needs neither interruption nor protected focus | Inline or progressive disclosure |
| Lorem ipsum, Acme, John Doe, invented proof, totals that do not add up | Believable sample content computed from its parts, listed in the report |
| Geometric masks faking an organic contour | A real alpha matte or a cut-out asset, or no effect |
| Zebra striping on rows, lists and menus | Space, or 1px row rules on app screens |

### Pages only

These hold on Persuade, Experience and Read pages. App screens relax some of them within the limits in
[app-screens.md](references/app-screens.md#house-rules). On any page, real `<pre>`/`<code>`, real tables
and form fields, and a `data-ui` fragment keep their own conventions.

| Rule | Instead |
|---|---|
| Every headline two lines or fewer at every width; one `h1` on the first screen that says what this is; a heading naming every section | Cut words, then widen the measure, size last |
| A statement or quote set large stays a `<p>`/`<blockquote>` at 36px or less (24px on a phone), about 25 words | Larger than that it is a headline and gets two lines |
| No thin rules: hairline dividers, 1px outlined boxes, grid lines, crop marks | Space, a tone step, a change of scale, a filled shape |
| No shadows on anything at rest | A tone step |
| No index numbering (01 / 02, "Step 2") | Order by position, size or words; a real `<ol>` when order matters |
| No tiny uppercase tracked labels | Sentence case at a readable size |
| No icon-topped feature cards, no rows of identical cards, no bento of rounded tiles | A composed section; a repeated module only for archives (a menu, a schedule, a work index) |
| No floating pill navigation | A plain bar: wordmark, three to five links, one action |
| No emoji, gradient blobs, decorative shapes, dot grids, wave dividers | A real picture, a picture drawn from the subject, or a field of flat colour |
| No system display face (Impact, Arial Black, Georgia, the platform sans) as the display voice of an own-world page | A sourced, self-hosted face whose character fits the brief |
| Buttons flat, one fill, square-cornered or fully round, decided once; one primary per screen, a second action as a text link | The 9-16px "soft" radius on everything is the template's |
| Equal outer margins; no empty half beside text; no blank stretch over half a screen | Close every void with the section's picture, a second column, a list or a figure |
| Left-aligned; one centred moment at most | Text hangs from one or two anchor lines |
| Persuade and Experience: at least four real pictures, usually six to twelve; one dominant image over six small ones | Order of preference and honesty: [imagery.md](references/imagery.md) |
| Persuade and Experience move: one signature move named from the subject, entrances varied per section in reading order, press and hover feedback on every control, one moving picture | A still page reads as a mock-up; recipes in [motion.md](references/motion.md) |

Taking the tells away is half the job. A page that loses its labels, rules and cards and gains nothing
reads as thin, and a richer page with tells beats it. Fill the space with scale, the full content,
pictures of this subject's world and whole fields of colour. On Persuade and Experience the idea comes
from the subject, not the category: name something that belongs to this client and no competitor (its
name, place, ritual, artefact, constraint), make it the device the page is built on, and carry it into
every section, pricing and footer included. Depth: [layout.md](references/layout.md).

## Special cases

- **A component or one section.** Match the surrounding design, apply the floor, look at it in place.
- **An existing brand or design system.** Map its colours and faces onto the roles above; its tokens
  win. A banned device the brand owns stays, named in your report.
- **No checkout or form backend.** The primary action goes to the real destination when the brief
  names one; otherwise a `mailto:` with the visitor's choices filled in, or a `#checkout` stub named in
  your report. Never a fake payment form.
- **No browser to render in.** Say so in your report; every check that needed the render is unrun.
- **No font files to self-host.** Link the chosen face from a font provider's stylesheet so it loads
  in the visitor's browser; a system face is never the stand-in for a display voice.
- **No pictures obtainable in this session** (no project images, no image tool, no network). Draw the
  subject's own things to [imagery.md](references/imagery.md#8-drawing-the-subject), build each picture
  slot at its real size and crop, and list in your report the exact photographs each slot needs. The
  picture floor stays an open gap you name, not one you paper over.

## Red flags

| Thought | Reality |
|---|---|
| "It just needs to look nice, fast" | Speed changes how many rounds you run, not the floor. The template is not the quick version; it is the wrong one |
| "Warm, editorial, cream and serif will feel premium" | That is the current generated look; take warmth from the subject |
| "Three feature cards and a stats strip cover it" | Use the number the content has, in a composition that carries it |
| "No photos, so gradient swatches will do" | Draw the subject's own things, find honest pictures of its world, or commit to type and colour |
| "Settings is just one long form" | One view per area, one save model, every control's states built |
| "Motion is polish; skip it when fast" | On Persuade and Experience the motion layer is part of the floor; on app screens it is state feedback only |
| "Offline, so the system font will do" | Link the face; it loads where the page is viewed |
| "Accessibility and responsive later" | Both are part of the floor; retrofitting costs more |
| "The design isn't final" | Build on the system's defaults; template UI misleads reviewers as much as unstyled UI |

## Done when

- [ ] Kind and mode named; the brief's pinned choices kept.
- [ ] Every line of the quality floor checked on the render at every width it ships at, in light and
      dark when both exist, with zero banned devices (or each one owned by the brand and named).
- [ ] Every state the change can reach built and looked at; keyboard pass done; no console errors.
- [ ] The design-check CLI's findings acted on, or its absence stated.
- [ ] Report lists the sample content and placeholder pictures to replace and any check not run.
