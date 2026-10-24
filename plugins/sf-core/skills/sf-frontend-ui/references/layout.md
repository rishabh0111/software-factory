# Layout

How a page is put together: the idea it is built on, margins, the grid, where text sits, how sections
differ, navigation, endings and the phone, plus what Persuade, Experience and Read surfaces each owe.
App screens have their own shell and grid rules in [app-screens.md](app-screens.md#the-shell). Numbers
come from panel notes on 114 strongly scored gallery sites and from a study of 97 Sites of the Day
(hand tallies, so read them as "about").

## Contents

1. The idea
2. What strong pages do
3. Margins and the grid
4. Where text sits
5. Empty space
6. The frame: margins, balance and titles
7. Sections: carry the idea, vary the arrangement
8. Navigation
9. Endings
10. The phone is a second composition
11. Persuade and Experience surfaces
12. Read surfaces
13. How pages fail

## 1. The idea

A page composed well around a category idea loses to one built from something only this subject has. In
blind tests, the page that won each brief was built from an item on the subject's own inventory: its
name and what it means, its street, its one constraint. Write the sentence before building:

> On this page, **[something that belongs to the subject]** becomes **[the device the composition uses]**.

Places to look: **its output** (put the real output on the page as material); **its object or shape**
(enlarge it, crop it, make it the frame or the one motif); **its name** (can the letters hold a
photograph, stack into a wall, split to two corners?); **its place** (one view that makes someone want
to be there); **its ritual** (a sequence the page can perform as it scrolls); **its artefact** (the
ticket, menu, label, receipt or manual that already exists in its world); **its opposite** (which other
category owns the feeling this one lacks?).

**The competitor test:** put the nearest real competitor in the sentence. If it still works, the idea
belongs to the category (a loaf of bread is every bakery; the seven doors of the street this one is
named after are only this one). "Clean and modern" is not an idea.

**One live thing** on a Persuade page: one thing the visitor can do, or that differs each visit, made
from the idea (pick a wood and see the chair in it; set the loan and read the real monthly figure; see
whether the hut's stove is lit and how long until the last ferry). It uses the subject's real content,
works with a thumb, has a plain fallback without script, never blocks reading, and is one thing, not a
playground. In blind tests every winning page had one.

Running the full direction-finding job (inventory, argument, directions) is a design job: suggest the user
run `/sf-design`.

## 2. What strong pages do

- **Tight margins, content to the edges.** About 45 of 114 use outer margins of 32px or less; about 8
  use 80px or more. The centred 1100-1300px container is the minority among strong sites and the usual
  frame of the ones the panel called stock.
- **Text hangs from an off-centre line** (about 22): a third across, 42%, the midpoint.
- **Two or three type sizes with nothing between** (about 30).
- **One thing per screen** (about 20): one statement, one object, one project.
- **Sections told apart by their ground:** about 20 change the whole background at each section, about
  12 alternate light and dark, about 10 separate by space alone.
- **Sections recomposed, not repeated** (about 14); about 12 alternate a full-bleed image screen with a
  near-empty type screen.
- **The system broken once, on purpose** (about 14): one centred line on a split page, one paper card on a
  dark page, colour held back until the last screen.
- **Often no navigation bar** (about 45), and endings that are a designed scene.
- **Few words.** Median 575 on the whole study; some of the best carry under 200.

## 3. Margins and the grid

```css
:root {
  --margin: clamp(1rem, 2.2vw, 2rem);   /* 16-32px: tight, so content reaches the edges */
  --gutter: clamp(0.75rem, 1.4vw, 1.5rem);
}
.wrap { padding-inline: var(--margin); }
.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); }
```

- One pair of margins and one grid for the whole page; every left edge is a column line.
- No `max-width: 1200px; margin: auto` wrapper by reflex. Large things (type, images, fields) run the
  full width; constrain the measure of running text in `ch` on the paragraph, not the page.
- On very wide screens cap the layout at about 1760-1920px, or let `vw` type stop growing with a
  `clamp()`.
- A direction that calls for wide margins (uneven photographs, a quiet instrument) says so; follow it.
- Never draw the grid: column lines, crosshairs and guides are banned ornaments; the grid is felt through
  alignment.

## 4. Where text sits

- **Pick the anchor line and reuse it.** If the hero headline starts at column 5, the section headings,
  the pricing figure and the footer links start there too. Two or three anchor lines per page.
- **Off-centre beats centred:** a heading in the left third with its paragraph in the far-right column on
  the same baseline; a headline in the bottom third under a deliberate void; text docked in corners with
  the middle given to the picture.
- **Opposite ends:** two short texts at opposite ends of one baseline (name left, one-line description
  right) is the commonest alternative to the centred stack.
- **Centred is a decision:** one axis, wide empty flanks, one element per screen; never a centred stack of
  heading, paragraph and two buttons.
- **Rows for long copy:** heading in the left third, body in the right two-thirds, the same split for
  every row.
- Stagger sparingly: a second line indented by a third so a two-line headline steps across.

## 5. Empty space

Readers judged every large empty area either a **rest**, which something closes, or a **hole**, which
nothing closes. Strong sites have plenty of rests; about half still leave at least one hole, and holes are
what visitors name ("big random blank spaces").

**A void is placed when something closes it:** the picture itself with the type docked at its edge; a
picture across the void; type large enough to span it, or two short texts at its two ends; on a
one-screen page, the wordmark, navigation and one fact in the corners like a mount around a print. About
one closer in five in the study is a hairline; that device is banned here.

**Where holes come from,** in order: a section gap stretched too far (bands of 250-760px of plain
ground); text in one half and nothing in the other; content arriving late (a reveal not yet fired); a
short block stretched to a full screen (a footer padded to the viewport, a lone section title); a pinned
scene holding almost nothing for several screens; pictures of different heights top-aligned in a row.

- Name what closes every void. If nothing does, move the section's picture into it, make the main
  element bigger, or take the space out.
- Keep the void clean: no stray caption, decorative shape, faint watermark or grid lines.
- Sections sit 120-240px apart on desktop (last line to first line; study median about 230-250px) and
  72-112px on a phone; a change of ground lets the gap shrink a little. Over about 40% of a screen of
  plain ground between two sections is a hole.
- The gap between sections is clearly larger than any gap inside one; a heading has at least twice as
  much space above as below.
- No stretch over about half a screen holds nothing. A pinned stage holds something at every scroll
  position.
- Content is in place on the first paint ([motion.md](motion.md)).
- Size a section to its content: `min-height: 100vh` belongs to a section that fills the screen.
- In a row of pictures of different heights, align the bottoms, put something under the short one, or
  crop to one ratio.
- A rest is one thing on a screen (a line, an object, a picture, a field of colour), once per page at
  most. Two near-empty screens fail.
- When a section looks empty, the answer is almost never "add something": make the main element bigger,
  or cut the section.

## 6. The frame: margins, balance and titles

Readers judge the frame before any detail: "no good margin", "everything is shifted to one side", "no
clear title", "random unclear sections".

**One pair of equal margins.** Left and right match at every width (the studied sites match to a few
pixels: 16 and 16, 32 and 32, 140 and 137). The usual margin is tight (median about 28px at 1440); here
16-32px, never under 16px on any width, the phone included. The navigation sits on the same margins as
the content. A bleed starts from the margin (a row of pictures running off the right edge begins on the
left margin) and never moves it. Asymmetry belongs inside the frame.

**Use the width the page has set up.** Text in one half is common; the other half then holds the section's
own picture, a full-bleed picture behind the text, a second column, a list or a figure, never plain
ground. The middle counts too (a card at the left edge and a lone button at the right with the middle
third empty is a hole), and the first screen counts: when the sentence and button take the left third,
the upper right holds the picture, a fact or the action. An empty block taking 28% or more of the first
screen reads as a hole.

**A title that says what this is, on the first screen.** Of 97 first screens, 40 say what the thing is in
words, 42 only through pictures, small print or a bare name, 15 not at all; the last group lost
usability and content points. Size alone does not do it. One `h1` at display size (32px or more on
desktop, mostly 50-150px on clear first screens), two lines at most, saying what this is: the name with
what it does, the product with what it is for, the event with its date and place. If the `h1` is the
name, the line under it (18px or more) says what the thing is. It is there on the first paint.

**A heading on every section.** 82% of studied text sections open with one (median 57px, about three and
a half times body), starting on the outer margin or the page's anchor line, the same place for every
section. Where a studied section had no heading the stand-in was a small label in caps, mono or a
bracketed number, all banned here: put those words in a real heading ("The rooms", "Prices") and let the
first sentence carry the rest. A statement opens a section as its heading only when it names what the
section holds.

## 7. Sections: carry the idea, vary the arrangement

The commonest failure in every score band is a distinctive first screen followed by stock blocks: icon
cards, a three-up row, an accordion, a link-column footer.

- **The idea survives to the last pixel.** Ask of each section, pricing and FAQ included, what the idea
  does here. If the page is a menu, the prices are menu lines; if the name is a monument, the footer is the
  name again; if the object's shape is the motif, the button and the image masks carry it.
- **No two neighbours share a layout:** list, split, statement, full-bleed, mosaic, table, strip, pinned.
  A shape used three times is the template showing.
- **Alternate dense and empty, image and type, light and dark.**
- **A repeated module is for archives only** (a work index, a menu, a schedule).
- **Break the system once** after it is established: one centred line, one inverted section, one image at
  a different scale.
- **Short pages are fine.** A quarter of studied sites are one or two screens; each section carries a
  claim ([copy.md](copy.md#1-write-the-argument-first)).

## 8. Navigation

- The plain form: the wordmark at one end, three to five text links (median 3), one action, all at text
  size on the page ground with no bar, border or background. Less is normal: links in the corners, a
  single action, or the navigation folded into the content.
- A fixed navigation never sits on content at any scroll position, phone included; floating pill bars are
  where it most often covered text. Over pictures it gets a solid band or hides while scrolling down.
- On a phone: wordmark and one action in view; links in a simple full-screen sheet opened by a text
  button ("Menu"), or in the footer when there are three.
- Navigation is small furniture: no more than about a tenth of the first screen on desktop, one row on a
  phone. A nav that ate the hero cost a whole point of usability in blind tests.

## 9. Endings

End on a designed scene: the name at full width (about 18 of 114; strong but now a studio habit, so use it
when the page is name-led), the hero repeated in inverted colours (about 12), a closing scene of its own
such as the one contact fact set as a headline (about 14), or one quiet line (about 22). Link-column
footers appear in the panel notes only as criticism. Practical facts (address, hours, email, legal line)
in the text face at a readable size, on the page's anchor lines.

## 10. The phone is a second composition

- Design 390px as its own page: one dominant thing on the first screen (a 20vw desktop wordmark may stack
  on two lines at 26vw and be stronger).
- Re-author line breaks; re-crop images to portrait (`object-position` per breakpoint, or a different
  crop); keep unevenness with alternating widths rather than making everything full width.
- Margins 16-20px; body 16-18px; touch targets 44px.
- Sideways scroll and three-line headlines usually appear here first; check 390 every round.

## 11. Persuade and Experience surfaces

On these the design is what the visitor judges, so the concept may own and structure the page.

- **Persuade:** the opening makes the offer intelligible and desirable, exposes a clear action in its
  working form, and demonstrates something only this product can prove. Conversion lives in the form's
  own vocabulary: a hook that lands in one line, a visible primary action, a legible reading order. A
  committed form that hides the offer or the action has not finished.
- **Experience:** the work itself leads from the first viewport.
- **The world carries the page, never a picture of it.** A facade, a shutter or a book can be what the page
  is built on; a viewport painted whole as a facade or a travel poster, with no working parts, is a
  picture of the world, not its website. The world's material is the ground and the major surfaces and
  its type sets the headlines; a world reduced to an accent on a neutral template is the category default
  with a sticker on it. Coverage is not performance: one dominant move, the rest in the world's material
  without acting it out.
- **Both ends erase the direction:** the painted poster, and the generic product page (a headline over
  subcopy and a button, a row of equal cards). A split hero (copy one side, product the other, a badge row
  under it) or a centred headline over cards is the template whatever world paints it.
- **The world never absorbs the page's parts.** Navigation set into a facade reads as links, copy on a
  shutter as set text, an action on a door plaque as plainly clickable; text reads against what is behind
  it, sections keep a steady rhythm, the primary action is unmistakable, the next section starts as a
  section. Fix a poster by making its parts work where the world put them, never by moving them into a
  standard layout on the world's colour.
- **An object is seen once,** at one scale, from one point of view, keeping its real form: a book opens to
  two pages on one gutter, never a third panel; more content goes on its own surfaces or the next spread,
  never on extra copies or impossible folds.
- **Loaded symbols stay out of the decoration.** A subject's world does not license emblems tied to
  militarism, supremacy or hate movements as motifs, badges or ornament (the Rising Sun flag's rays, the
  Confederate battle flag, Nazi-era insignia and their stylised variants); use that world's neutral forms.
  Content that documents such a symbol as fact stays as it is.
- When torn between refined and committed, commit.

## 12. Read surfaces

The visitor came to understand something, so the page is first a document of its kind, framed by the
world: documentation reads as documentation, a guide as a guide, an article as an article, a changelog
as a changelog.

- **The reader's question leads,** and comprehension and wayfinding stay intact at every step. The first
  viewport is the document's shell: the navigation and where the reader stands in it, the title and the
  opening that answers or frames the question, the reading column, and the way forward (contents,
  headings, next and previous).
- **The world owns the frame and serves the column.** The frame is the masthead, navigation rail, ground,
  title and section openers, and how code, tables and callouts are set: there the palette, type and
  signature move commit fully, so the page could belong to no other product. The column stays calm: a
  reading face, real contrast, a real measure (on the web about 60-75 characters with body near 16px; in
  a native app the platform's body style and readable width), nothing performing behind the text.
- **Monospace** is for code, parameters and small labels, never the running text or headings by default.
  Code, tables, notes and figures sit in the standard forms readers know, set in the world's type and
  palette.
- **The world never supplies the reading order** or replaces navigation with something a reader must
  learn; a document never reads as a poster, a magazine cover or a book photographed open.
- **The signature move** is one system used where it earns its place (a masthead, a coloured rail, a
  running head, a margin system, a numbering scheme, a way of setting code), never a frame around every
  element.
- **What transfers best:** the world's publishing traditions (reference books, type specimens,
  timetables, field guides, technical manuals, scholarly apparatus, a newspaper's wayfinding). A tool,
  instrument or fictional interface from the audience's world comes back as a costume; take only type,
  palette, density and a signature move from it.
- **Check:** can a reader tell where they are and where to go next, and read the body comfortably? Cover
  the name: could this be any other product's docs? Then the frame has not taken the world; push the
  masthead, rail, ground and openers further. If it reads as an artifact of the world before a document,
  the world has reached the column; pull it back to the frame.

## 13. How pages fail

From panel notes on 54 sites scoring under 6.8: the whole page is the category's stock template (about
20); centred headline, pill badge, two buttons, screenshot or tile grid (about 9); a distinctive hero,
then stock modules in the usual order (about 8, and about 17 more in the middle band); a default
typeface with no character (about 13); text too small or too low in contrast (about 13); legibility lost
over busy photographs (about 9); an undersized headline and no focal point (about 9); the page never says
what the thing is, or shows no work (about 12 and 7); thin content stretched over many screens, or a
single gag (about 11); gates, preloaders and entry pop-ups (about 9); a phone layout that is the desktop
shrunk or broken (about 8); fixed elements on content and colliding lines (about 7 and 5).

The faults of the best sites, not to copy: body text at 9-13px (about 24 of 90), information hidden behind
the concept (about 20), the idea running out mid-page (about 15), text over footage with no scrim (about
12), gates and blank first paints (about 12), floating elements colliding with content (about 11), and a
first screen with no statement of what this is and no action (about 9).
