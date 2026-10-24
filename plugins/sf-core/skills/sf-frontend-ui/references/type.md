# Type

Typography is most of what a visitor sees and most of what makes a UI look designed or assembled. This
file is how good type is set on pages; app screens take their scale from
[app-screens.md](app-screens.md#type), and native apps from the platform's text styles
([ios.md](ios.md), [android.md](android.md)).

## Contents

1. What the study measured
2. The scale: few sizes, far apart
3. Setting display type
4. Setting text
5. Loading fonts
6. One family or two
7. Details that separate set type from typed text
8. Mistakes no meter sees

## 1. What the study measured

From 202 measurable gallery sites (Chrome, 1440x900 and 390x844):

| | Median | Middle half | Note |
|---|---|---|---|
| Hero headline size | 72px (5.0vw) | 43-109px | Top-scored sites: 6.0vw |
| Largest type on the page | 6.4vw | up to 10.4vw | Top-scored 8.4vw, weak 5.0vw |
| Hero headline on a phone | 40px | 32-59px | |
| Hero tracking | -0.01em | -0.03 to 0 | Tighter as size grows |
| Hero leading | 1.0 | 0.95-1.1 | |
| Body size | 16px | 14-18px | |
| Headline ÷ body | 4.3 | | Top-scored 4.7 |
| Typefaces in real use | 2 | 31% one, 45% two, 22% three | |
| Hero weight | regular 48%, medium 18%, bold or heavier 22% | | Big type need not be bold |
| Hero in capitals | 24% | | |
| Hero centred | 39% | | 52% on weak sites |

Size contrast is the main lever and the best sites pull it harder. Weight is not: half the heroes are
regular. Scale and spacing make type confident.

## 2. The scale: few sizes, far apart

About 30 of the 114 strongest sites use two or three sizes with nothing between, and none a graded five-
or six-step scale. One display size, one text size and a small size carry the page; a lead and a heading
size exist when needed. Five is the ceiling. Nine sizes all near each other (16, 18, 20, 24, 28, 32…)
reads as mush.

```css
:root {
  --step-small:   clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);  /* 13-14px  captions, legal */
  --step-body:    clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);   /* 17-19px  paragraphs */
  --step-lead:    clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);     /* 20-26px  supporting line */
  --step-head:    clamp(2rem, 1.3rem + 3.2vw, 4rem);            /* 32-64px  section headings */
  --step-display: clamp(3rem, 1rem + 5vw, 6rem);                /* hero headlines */
}
```

- **Display size belongs to the composition.** A headline that is a sentence tops out around 6rem
  (96px), where it still holds two lines. A name or wordmark used as the page's image may run larger
  (16-24vw for a monument wordmark), sized to fit by measurement; a quiet instrument's headline may be
  28px. Always a `clamp()` bounded on phones and very wide screens.
- **Keep the gap:** display at least four times the body size on desktop; nothing between lead and head
  unless the design truly needs a sixth size.
- Resist a subheading size for every card and label. If two sizes look almost the same, make them the
  same.
- Product UI uses a fixed rem scale with steps 1.125-1.2 apart, not fluid display type.

## 3. Setting display type

Large type exposes spacing that is invisible at text size. For anything over 40px:

```css
.display {
  font-size: var(--step-display);
  line-height: 0.95;          /* 0.85-1.05; tighter for capitals and condensed faces */
  letter-spacing: -0.03em;    /* -0.02 to -0.04em; -0.04em is the floor */
  font-kerning: normal;
  text-wrap: balance;
  max-width: 14ch;            /* choose the measure so lines break where you want */
  margin: 0;
}
```

- **Tracking scales with size.** A value right for 120px chokes 32px; set it per step.
- **Leading under 1.0 needs checking** for descenders colliding with the next line's ascenders and
  accents.
- **All capitals** want slightly open tracking (0 to +0.03em) even at display size, leading about 0.9.
- **Optical alignment.** Round or diagonal left edges (O, C, A, T, W) look indented at size; pull the
  headline left about 0.04-0.06em (`margin-left: -0.05em`).
- **Viewport-wide type.** Size it in `vw`, verify at 390 and 1440, `white-space: nowrap` and let the
  container clip; compute from the character count: `font-size ≈ width ÷ (characters × k)`, k from
  [copy.md](copy.md#2-the-two-line-headline). A line meant to fit the width is fitted by measurement (a
  small script, or SVG text with `textLength`), never a guessed size.
- No text shadow, outline stroke or gradient fill on display type.

## 4. Setting text

```css
body { font-size: var(--step-body); line-height: 1.5; font-kerning: normal; text-rendering: optimizeLegibility; }
p { max-width: 62ch; text-wrap: pretty; margin: 0; }
p + p { margin-top: 0.9em; }
.lead { font-size: var(--step-lead); line-height: 1.35; max-width: 40ch; }
small, .caption { font-size: var(--step-small); line-height: 1.45; }
```

- **Measure** 45-75 characters (Read surfaces 60-75); past about 88 the eye loses the next line. Data and
  compact UI may run denser.
- **Leading** 1.45-1.6 for body, 1.3-1.4 for the lead, looser for long reading.
- **Running text in full ink** at 16px or more. Secondary text is the same face in `--muted`, not a
  lighter weight, never under 13px.
- No centred paragraphs over three lines; no justified text.
- Light text on dark looks heavier: drop one weight step or add 0.01em tracking, raise leading slightly.

## 5. Loading fonts

- Self-host with `@font-face` and `font-display: swap`, or the framework's font loader
  (`next/font`), or the provider's stylesheet with `preconnect`. Request only the weights you use (two or
  three).
- A fallback stack of the same kind (sans for sans, serif for serif).
- **Check the face actually rendered.** A fallback face makes every screenshot a lie: nothing judged from
  it is real. Fix the load first.
- Preload the display face (`<link rel="preload" as="font" type="font/woff2" crossorigin>`) when it
  animates in on load.

## 6. One family or two

A third of the studied sites use one family for everything, the safest way to look coherent. With two:

- Each has a job and they never swap: one sets headlines, the other everything else.
- No third face for labels, numbers or quotes. No two faces inside one headline.
- Italic is for titles of works and real emphasis in paragraphs, never decoration.
- A face is chosen for the brief. The closest installed font, or a system display face standing in for
  an own-world voice, is a failure, not a fallback.

## 7. Details that separate set type from typed text

- Curly quotes and apostrophes, real dashes, a real ellipsis ([copy.md](copy.md#7-micro-typography)).
- `font-variant-numeric: tabular-nums` for prices, tables and dates in columns; `oldstyle-nums` suits
  serif body text.
- Links: `text-underline-offset: 0.18em; text-decoration-thickness: 0.07em`, clearing the descenders.
- `hyphens: none` on headings; `overflow-wrap: anywhere` only on long URLs or emails.
- A heading belongs to the text after it: space above at least twice the space below.
- `::selection { background: var(--accent); color: var(--accent-ink); }` and a visible `:focus-visible`
  outline in the accent, so the browser's own states belong to the design.
- No weight change on hover; the line reflows.

## 8. Mistakes no meter sees

- A headline within two lines that breaks badly: one orphan word, or a split phrase ("Stools for /
  small kitchens"). Author the break.
- Display type so tight letters touch, or so loose it falls apart.
- A confident hero followed by section headings almost as large. One size dominates per screen.
- Body text in a display face drawn for large sizes only.
- Everything bold. If every line is emphasised, none is.
