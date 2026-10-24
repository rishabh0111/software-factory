# Tells

A tell is a device that makes a UI read as machine-made. Most began as good ideas on good sites; they
became tells by being produced by default, everywhere, without a reason. Reaching for one when the
choice was free means nothing was decided, and recognising one means rewriting the element, not
softening it. The brief's own words can earn back any tell except the ones marked **ban**.

This registry is dated and it never names a replacement font, colour or component: every published
"use this instead" list has become the next wave of tells within months. Replacements here are
procedures (derive from the subject, from the brand, from the data), not products.

**Scope:** *page* = Persuade, Experience and Read pages; *app* = app screens; *all* = both. App-screen
tells specific to dashboards are in [app-screens.md](app-screens.md#tells-of-generated-dashboards).

## Contents

1. First wave (2023-2024)
2. Second wave (2025)
3. Third wave (2025-2026): the fix that became the look
4. Gallery fashion, banned as house style
5. Structural tells
6. Surface habits
7. Product tells
8. Copy tells
9. Motion tells
10. Why removal is not enough

## 1. First wave (2023-2024)

| Tell | Scope | Do instead |
|---|---|---|
| Violet / indigo gradients on hero, buttons and glows | all, **ban** | Colour from the subject or brand; flat fills |
| Gradient-filled headline text | all, **ban** | Solid ink; emphasis from weight or size |
| Glass panels: backdrop blur, translucent cards | all | Opaque surfaces one tone step from the ground |
| A glowing or gradient "Get started" button | all, **ban** | A flat button named for its action |
| A soft grey drop shadow under every card | page **ban**; app: faint only | A tone step, or no box |
| Three identical feature cards, each an icon in a rounded square | page **ban** | A composed section carrying the real content |
| Emoji as icons or bullets | all, **ban** | Words, a drawn icon, or a real picture |
| Centred headline, subtitle, two buttons, screenshot below | page | A hero composed from the subject: one dominant thing, one action |
| The same default typeface on every generated page | all | A face chosen for the brief, really loaded |

## 2. Second wave (2025)

| Tell | Scope | Do instead |
|---|---|---|
| Eyebrow / kicker: a small tracked uppercase label above a heading | all, **ban** | Fold it into the heading or the first sentence, or delete it |
| Pill badge above the hero headline ("New", "Beta", "Introducing") | all, **ban** | Say it in the supporting sentence |
| One word of the headline in italic serif, colour or underline | all | One face, one colour |
| A bento grid of rounded tiles as the feature section | page | A composed section; tiles only when the content is tiles, filled, strict sizes |
| Near-black ground, one neon accent and a glow | all, **ban** | A true neutral dark, colour on the content, no glow |
| Floating rounded pill navigation with blur | page | A plain bar |
| A fake dashboard hero built from grey bars and donut charts | all | A real interface fragment with real data, or no image |
| A decorative status dot ("Available for work", a pulsing "live") | page | Remove it |
| Fade-and-rise on every section | all | One signature move; entrances varied by content (see [motion.md](motion.md)) |

## 3. Third wave (2025-2026): the fix that became the look

The remedy published for the first two waves was "warm it up and make it editorial". Models adopted it
wholesale and it is now the most recognisable generated look of all.

| Tell | Scope | Do instead |
|---|---|---|
| Yellow-cream ground with a terracotta, rust or clay accent (terracotta alone is suspect; cream alone is a warning) | all, **ban** | Warmth from a low-chroma stone, a deep ink, a photograph, or a full warm field |
| A high-contrast or soft serif display as the shortcut to "premium" | page | A face chosen for this subject, whatever its class |
| An oversized italic serif headline | page | As above |
| Broadsheet cosplay: hairline rules everywhere, zero radius, dense columns | page, **ban** | Structure from space and tone |
| Performative labels: "Field notes", "Quietly trusted by", "On our desks" | all | Plain section names |

## 4. Gallery fashion, banned as house style

These are common on award sites now, and in the study behind this registry they appear more often on
top-scored sites than on weak ones (monospace labels 44% against 24%, index numbering 38% against 21%,
thin rules 61% against 52%). They are banned on pages regardless: they are the first things a
generator copies from a gallery, they carry no information, and a page built without them has to find
real structure. Tiny tracked capitals are the one item the data also condemns: 16% of top sites
against 57% of weak ones.

| Tell | Scope | Do instead |
|---|---|---|
| Monospace micro-labels, mono as a "technical" voice, mono captions | page **ban**; app: IDs, keys, code, or every figure as one decision | The text face; tabular figures for data |
| Index numbering: 01 / 02 / 03, (001), "Step 02", numbered section markers | page **ban**; app: only as data (a rank, a node number) | Order by position, scale or words; `<ol>` when it is truly a list |
| Thin rules: hairline dividers, ruled grids, 1px outlined boxes and tiles | page **ban**; app: allowed within [limits](app-screens.md#house-rules) | Space, tone steps, filled shapes, a thick bar (4px or more) if a bar is the idea |
| Design-tool chrome as ornament: crosshairs, crop marks, selection handles, dashed guides, rulers | all, **ban** | Remove |
| Agency micro-meta: local time, coordinates, weather, version stamps, "©2026 — Scroll", middle-dot strings | page | Remove |
| Tiny uppercase letter-spaced captions scattered around the viewport | page **ban**; app: one context label at most | Sentence case at a readable size, beside the content it describes |

## 5. Structural tells

| Tell | Scope | Do instead |
|---|---|---|
| Same-size cards of icon, heading and text as the page structure; nested cards | all (nested: **ban**) | A composition per section; one level of container |
| The hero-metric template: big number, small label, supporting stats, accent | page | The number inside the sentence or section that needs it |
| A headline as a full sentence at display size, three or four lines | page, **ban** | A title of about five words; the rest goes below |
| The stock section order: hero, logos, features, testimonial, pricing, CTA | page | The order of the argument ([copy.md](copy.md#1-write-the-argument-first)) |
| Every section the same layout family | page | A different composition per section |
| Everything centred | page | Left-anchored, one centred moment |
| One medium border radius (12-16px) on everything | all | Square or fully round on pages; tight or soft on app screens, chosen once |
| Nine nearly equal font sizes | all | Few sizes, far apart |
| Invented social proof: logos, quotes, star rows, "10,000+ teams" | all, **ban** | Real proof, or the thing itself shown large |
| Text or a CSS box where a picture belongs | page | A real picture, or a design that needs none |
| A modal for a task that needs neither interruption nor protected focus | all | Inline or progressive alternatives first |
| A distinctive first screen followed by stock blocks | page | The idea carried into every section |

## 6. Surface habits

| Tell | Scope | Do instead |
|---|---|---|
| A coloured `border-left` or `border-right` over 1px on cards, list items, callouts or alerts | all, **ban** | A tone step, a heading, a status pill |
| Hard offset shadows (`box-shadow: 4px 4px 0`) outside a world that is actually neobrutalist | all | A tone step, or a real soft shadow on what floats |
| Zero-offset coloured halos | all | Depth from offset and blur, or none |
| Sparklines, progress rings and soft-shadowed rounded rectangles standing in for content | all | The content |
| A system display face (Impact, Arial Black, the platform sans) as the display voice of an own-world page | page | A sourced, self-hosted face; the closest installed font is a failure, not a fallback |
| Unicode glyphs or emoji for an icon system | all, **ban** | One drawn set, one stroke and weight |
| Geometric masks (circle, polygon, radial cutout) approximating a photographic subject's edge | all | An alpha matte from the image, or a cut-out asset |
| Light or dark picked by category | all | Picked from the use scene: who, where, under what light |
| Browser defaults left on selection, caret, scrollbar, focus ring, underline, table numerals | all | Themed from the palette |

## 7. Product tells

Product UI's failure mode is not flatness but strangeness without purpose. The test: can a
category-fluent user trust the interface immediately, or must they pause at every subtly-off component?

| Tell | Scope | Do instead |
|---|---|---|
| Decorative motion that conveys no state | app | Motion for state change, feedback, loading, reveal only |
| An inconsistent component vocabulary across screens | app | One button shape, one form-control set, one icon style |
| Display fonts in labels, buttons and data | app | The text face |
| Standard affordances reinvented for flavour (reshaped scrollbars, odd form controls, non-standard modals) | app | The platform's standard controls |
| Heavy colour or full-saturation accents on inactive states | app | Neutral inactive states; the accent on what is selected or acting |
| A world's own interface worn as a costume (a terminal's key bar, an instrument bezel, ledger paper for a table) | app, Read | Type, palette, density and one signature move from the world; standard controls |
| A web port on native: reinvented nav bars, custom back gestures, web-shaped buttons, hover affordances | native | The platform's components ([ios.md](ios.md), [android.md](android.md)) |

## 8. Copy tells

The genre's verbs and adjectives (unlock, supercharge, seamless, elevate, effortless, cutting-edge,
all-in-one); the correction ("not just X, it's Y"); tricolon headlines; "Get started" and "Learn more"
as labels; em dashes as a habit; lorem ipsum. Detail: [copy.md](copy.md#6-things-that-read-as-generated).

## 9. Motion tells

An identical fade-up on every block; a dozen staggered hero entrances; a hover lift on every card;
bounce easing; infinite loops that mean nothing; reveals that fail and leave a blank band; preloaders,
gates, scroll hijacking, custom cursors, scramble text. Detail:
[motion.md](motion.md#9-what-gives-generated-motion-away).

## 10. Why removal is not enough

A page with every tell removed and nothing in their place is an empty page with good manners, and that
is a tell too: the avoidance aesthetic, which anyone could guess from the category plus this list. The
tells were filling a gap where an idea should have been. Fill that gap first (the idea from the
subject, a composition that carries it, real pictures or committed type, the product's real data),
then check the list.
