# App screens

Dashboards, admin, analytics, settings, billing, inboxes and queues, wallets, editors and builders, the
detail page of one object: the screens people work in (Operate mode). Read this file whole before you
build one. Where it relaxes a page rule, it says so in [House rules](#house-rules); everything else in
the quality floor in `SKILL.md` still holds.

A generated dashboard is the average of every dashboard template: a dark or tinted sidebar with a
coloured pill on the active item, "Welcome back" and a waving hand, four KPI cards each with an icon in
a tinted circle, a green "+12.5%" and a sparkline, a gradient area chart, a zebra table under uppercase
headers. Nothing in it is wrong and none of it was decided.

The numbers below come from a study of 23 real product screens (17 products, 17 light and 6 dark, all
at 1440-1512px), measured from their pixels. Where a rule goes past the study it says **house rule**;
those came from blind testing. What separates real screens from generated ones, in order of how much it
shows:

1. **Colour goes on data, not chrome.** The median screen has about 3% coloured pixels; 17 of 23 stay
   at 5% or less. 12 have no filled primary button at all.
2. **KPIs are type, not tiles.** None puts an icon in a coloured circle on a KPI; none draws a
   sparkline on one.
3. **Surfaces are flat.** 17 of 23 give cards no shadow; separation is a 1px line or one tone step.
4. **No hero header.** 9 screens have no heading over 16px; where there is one, the median is 24px.
5. **Charts carry almost no chrome.** A single series has no legend; gridlines are 3-7 faint lines or
   none.
6. **Navigation recedes.** The active item is a neutral grey pill or a change of text colour.
7. **Tables are rules and alignment.** No zebra, no header bands, numbers right-aligned.
8. **Data states are honest.** Zeros print as zeros, missing values as a grey dash, an empty section
   keeps its frame.

## Contents

- The bar: earned familiarity
- Quiet is the start, not the goal
- Before building: data, question, finding
- The shell
- The canvas and the title
- KPIs
- Charts
- Tables and lists
- Forms and settings
- Type and colour
- Density
- Empty, zero, loading and error states
- Motion
- The phone
- House rules
- Tells of generated dashboards

## The bar: earned familiarity

Someone who uses tools like this one should know where everything is before they notice the style. The
test is whether a category-fluent user can trust the interface at once or must pause at every
subtly-off component. Product UI fails by strangeness without purpose: over-decorated buttons,
mismatched controls, gratuitous motion, display fonts where labels belong, invented affordances for
standard tasks. The tool disappears into the task.

A brand or concept lends a working screen four things and only these: **type, palette, density and one
signature move**. It never supplies the layout, the navigation model or the controls. Every control is
a standard one (web components on the web, the platform's native controls in an app): buttons, tabs,
inputs, selects, filters, tables with sortable headers, navigation that reads as navigation. A world
taken from a tool or instrument the audience operates (a terminal, a scope, a cockpit) or from a
fictional interface comes back as a costume of that tool: take only what transfers as the four. Name
the signature move concretely (service health drawn as a transit map, a schedule set in a timetable's
column rhythm); a style that shows up only as a colour scheme has not found its move.

Colour does real jobs here: a committed palette for the shell (a coloured rail or header, a tinted
ground), state colours, data series, selection and the signature move. A grey screen with one accent
is the category default without the category's polish, not restraint. The finish bar is the best
product in the category: an aligned grid, consistent spacing, a real type scale, clear hierarchy, and
the signature move added to a screen already that clean. With the product name covered, the screen
still reads as a product of its category, the visitor could do the task from it, and it is at least as
clean as the category standard and more distinctive than it.

**Product permissions.** App screens can afford what pages cannot: system fonts and familiar sans
defaults; standard navigation (top bar and side nav, breadcrumbs, tabs, command palettes); density
(tables with many rows, panels with many labels); consistency over surprise, with delight saved for
moments, not screens.

## Quiet is the start, not the goal

In blind testing, screens built only to be clean and quiet lost to richer screens. Each reason is now a
rule below:

- **The first screen was thin:** one large flat-line chart filled it and half the blocks started below
  the fold. On a 1440x900 screen every block the brief names shows its header and first rows.
- **The product was missing:** no name, no workspace, no mark. The shell names the product and scope.
- **Restraint hid meaning:** a latency rise and a request rise were the same grey. Colour on a change
  says good or bad.
- **There was nothing to do:** no control for the screen's job. The most frequent job is one click away.
- **Rows ended ragged**, and **a style's move was over-applied** (a tray around every card, an icon
  rail where people needed labels). Keep the move where it carries meaning.

**Give the product a face.** The judges' most common complaint was "a well-applied kit, not a product
with its own identity" (stock grotesk, a #f8f8f8 ground, white 12px cards, lime on black). Choose, in
your notes before markup:

- **One face from the brief:** a ground tinted from the product's world, a figure face with character,
  or the brand's hue on the main data element. Check it shows on the first screenshot.
- **The chosen typeface, really loaded.** A fallback face lands on the default look.
- **The product's mark and name** at the top of the shell, drawn for this product (a monogram or
  symbol from its name or object), never a black square with a letter.
- **One element only this product has,** built from its own things: an energy home's power flow, a
  bakery's sell-out strip, a leave planner's cover against the minimum, a running club's pace groups as
  a unit chart, a couple's budget as three lanes, the deploy's commit as the hero of the overview.
- **The one chart hue on the main data element:** today's line, the booked bars, the current period,
  the margin that breaks. A screen whose only hue is a delta reads as a kit.
- **People and objects as themselves:** each person a stable initial and a pale tint of their own hue,
  neighbours at least 60 degrees apart (identity, not data: pale, out of legends); products show their
  thumbnails; media shows its cover.
- **Words of the trade** in labels and empty states ("Waiting on the customer", "Off sick", "Due on the
  28th"), never the template's "Items", "Records", "Status".

## Before building: data, question, finding

### Inventory the data and the jobs

In 8-12 lines of notes: **the objects** the screen shows and their fields with units; **realistic
magnitudes** (how many, a typical amount, a rate's range, how values move over a day or a year, how
small they are for a new account); **the people** (who opens this, how often, on what device); **the
jobs** (what they do next, which comes up most); **the product's own things** (name and mark, the scope
it belongs to, its people, the objects recognised by sight). Plan where each appears.

Then write the data as a small JSON or JS file the screen renders from: believable names, amounts that
add up, dates in order, a unit on every figure. Totals are computed from rows, never typed separately.
Small numbers stay small (a new account has 1, 6 or 9 of something). Write the figures that must agree
as assertions (`console.assert(sold - cancelled === rsvps)`) and read the console: a table that did
not reconcile with its own KPI cost a judge's trust in the whole screen.

**Data that tells the truth** (house rules):

- **A fact shown twice is one variable.** A window, total or state in two cards comes from one value,
  and the copy and the chart annotation are both built from it.
- **Totals and deltas come from the parts as shown.** Sum the rounded values on screen (£21.68 + £8.34
  − £3.81 is £26.21, not £26.22); a change is the difference of the two displayed values.
- **Every relative figure names its baseline** in the same phrase ("45 m earlier than last Sunday",
  "+5 on the usual Monday").
- **One name per time:** the header and the card use the same words for the same moment.
- **If a caption must say which bars are which, encode it in the chart** instead: a marked period in a
  second tone with its own legend entry, a signed axis, a label on the mark.

### Name the screen's one question

Every screen answers one question first ("Which deploy broke?", "Who is waiting for a reply?"). Write
it in one line. It decides **what is biggest** (the largest block, and the largest figure, answer it),
**what comes first** in reading order, and **what is left out** (a few numbers may beat a chart; a
settings page links to analytics instead of drawing one).

Then name the **one finding**: the fact in today's data that most needs attention ("the 23:28 deploy
doubled the error rate"). Put it where it is read first, as the line under the title or the subline of
the headline figure, next to the action it drives.

List the blocks as answers to the next questions, one line each; a block with no question is deleted.
This avoids the stock order of KPI row, big chart, two small charts, table. When the product is the
same kind as a well-known screen, take the structure from the product's own things instead of
rebuilding the familiar arrangement.

- **Everything the brief names is on the first screen.** At 1440x900 each block shows its header and
  first rows or its figure. Size the headline block to the question (about 200-360px tall), cap long
  lists at 4-6 rows with "View all", put time-sensitive blocks (bills due, SLAs running out, a failed
  deploy) before long tables. A chart flat for most of its window gets two-thirds of the width, with the
  next answer beside it.
- **The most frequent job is one click away:** a primary button in the title row, an action on the row
  that needs it, a "View logs" on the failed item. A screen with no control for its job is a report.
- **Show the evidence beside the answer:** "Error rate 0.28%" with its spike annotated ("peaked at 3.9%
  after the 23:28 deploy, reverted") beats the bare number and a second chart.

Build the shell first, empty, and look at it at 1440 and 390 before data goes in. Write the grid
arithmetic in a comment: the column count, the gutter, and the sum that proves cards land on the canvas
edges. Then every block renders from the dataset, and every block gets its empty, zero, loading and
error state, every row and control its hover, selected, focus and disabled state.

## The shell

### Five archetypes

| Shell | In the study | What it is |
|---|---|---|
| **Open plane** | 5 | A labelled sidebar on the page ground (or within 1-2% of it), separated by nothing or one 1px hairline; no top bar; a fluid canvas with a 24-64px gutter, or a centred column |
| **Tinted frame, white sheet** | 8 | Sidebar and top bar share one tinted ground (#f6f6f6-#f9fbfc); the page sits on a white sheet inset 8px from the right and bottom, radius 10-16, a 1px #eaeaea-#ededed edge, no shadow. Variants: a flush L-frame; floating panels inset 8-12px with a 12px gap |
| **Ruled T-frame** | 4 | A 210-240px sidebar and a 64px top bar on one ground, divided only by 1px rules; the workspace switcher at the top bar's right end behind a full-height divider. Three of four are dark |
| **Icon rail** | 3 | An unlabelled 50-60px rail; 15-18px icons on a 34-49px pitch; active by colour or a 2% tint band; groups split by hairlines. Saves about 180px |
| **No sidebar** | 3 | A 46-48px top bar over a centred 1088-1208px column with 152-212px gutters; for reports, viewers, products with few destinations |

All six dark screens use one ground everywhere, divided by 1px rules (#161616-#232323) or nothing. No
screen puts a dark or saturated sidebar against a light canvas (0 of 17). Product UI often takes a
second neutral layer for sidebars, toolbars and panels, slightly cooler or warmer than the content
surface.

### Sidebar

- **Width** 210-292px, median 230, most at 224-240.
- **Rows:** a 32px hit area on a 34px pitch is the mode; roomy versions 40-52px on 42-60px. Icons
  14-20px (median 16), outline at about 1.5px. Labels 14px at 400 in ink or a #4b4d4f-#63666e grey,
  8-10px after the icon.
- **Active item:** a neutral grey pill (#e9e9e9-#ededed, radius 4-16, median 8, inset 8-14px) with the
  label unchanged, on light; brightness alone (#bbb to #fff) on dark. A left accent bar appears once in
  23.
- **Groups:** sentence-case grey labels at 12-13px, never uppercase, with 22-56px above and 13-33px to
  the first item; or hairlines. Settings and help at the bottom.
- **Top and bottom:** the workspace switcher at the top (or in the top bar); a user row or one upsell at
  the bottom.
- **The product is named** (house rule): its mark and name at the top, the scope shown as a switcher or
  breadcrumb.
- **Counts on nav items** (house rule) only on a queue that needs action, with the noun clear from the
  label ("Requests 5").
- **Labels by default.** An icon rail only when there are five destinations or fewer and the width is
  needed; it carries the product mark, a tooltip and an accessible name on every icon. Nav items are
  other screens, never anchors into one long page.

### Top bar

The default is none (14 of 23 have one). Heights 44-51px on light chrome, or 64px with a 1px rule. It
holds something real: search (centred, about 548x32, with a shortcut hint), the workspace switcher, or
the object's name. A mostly blank top bar is flagged. The right cluster sits 24-46px from the edge.

### Right rail and floating buttons

A right rail (`1fr 384px`, 24px gap, starting level with the first card) only for a stable secondary
stream: recent items, the selected object's details, share links. A pinned column only when a figure
must stay in view while the rest scrolls. No floating button unless it is the screen's one primary
action and covers nothing at any width (house rule).

## The canvas and the title

### Width and gutters

- **Fluid** (14 screens): side padding 17-64px, median 29; content 1120-1312px. **Centred** (8):
  624-1208px, median about 1126. Data pages land at 1100-1250 either way; narrow personal homes (624,
  864) were flagged for wasting the width.
- **Top offset** to the title 20-88px, median 36: tools at 20-36, greeting homes at 50-88.
- **One gutter**, horizontal and vertical. Mixed gutters (12 against 16) are flagged.

### One left edge, one right edge

The strongest screens run one left edge from the header to the last row; row rules may bleed 7-8px past
the text column. The grid's arithmetic closes (3 x 372 + 2 x 17 = 2 x 568 + 16 = 1152; 12 x 77 + 11 x
16 = 1100): write your sum down. Failures: cards stopping 120px short of the right edge; a 0px right
gutter against a 40px left; a column centred on the window instead of the area beside the sidebar.

- **The grid fits the data.** Dead space from a grid that does not fit is the commonest failure (10
  screens): four KPIs in three columns orphaning the fourth, a lone card beside 810px of nothing. Choose
  the column count from the item count and let a lone card span.
- **Cards in a row share a bottom edge** (ragged rows 26-190px apart were marked down every time).
  Balance by content first (equal row counts, the same cap, blocks of similar height); two stacked cards
  beside a tall one count as one block. Only then stack them, or let the shorter card fill the height
  with its content top-aligned and only a footer action or total pinned to its foot.
- **A stretched card stretches only with content to fill.** A legend or note stays under its chart; a
  filtered block shrinks to its rows, or keeps a fixed number of rows with one sentence in the empty
  ones. No blank band over 40px inside a card, or over 64px before a new section heading.
- **Narrow blocks do not span the canvas.** A table of five columns or fewer, or a list of six rows or
  fewer, runs to about 760px at 1440 and pairs with the next block.

### The title

- **One `h1` on every screen**, 18-48px in the canvas (median and mode 24) at 600-700; or, with nothing
  over 16px, the breadcrumb's last item or the top bar's page name as the `h1`.
- **A noun, not a greeting** ("Analytics", the object's name). A greeting suits a personal or team home
  only, never with an emoji.
- **An optional second line:** one 14-16px grey sentence about the data (the finding, the period, the
  scope), never about the interface ("this page shows…"); or a 12px line naming the data's source.
- **Right of the title:** real actions only; otherwise a freshness stamp ("Updated 16:09", with
  refresh).
- **One primary action per screen,** usually near-black (#1d1f20) or inverted white on dark, or the
  brand hue; 12 of 23 have none.

### Tabs, filters and the date range

- The date range at page level or on each card, never both; a card's own period sits right-aligned in
  grey in its header.
- **Underline tabs** sit on a full-width 1px rule; the indicator 1-4px (median 2), label-wide or 8-11px
  past it. A **segmented control** is as wide as its options, full width only below about 480px.
- Control height in title and filter rows 28-40px, median 34 (clusters at 32 and 36). Scope on the left
  (date first, then filters), utility and refresh on the right. 13-64px (median 24) to the first card.

## KPIs

- **No tile of its own** by default: one container split by 1px dividers into equal columns, or bare
  text. Better still, each headline number leads the card that explains it.
- **Count** 1-6 per row (median 3-4), matching the grid.
- **Size:** values 16-40px (median 26, mode 24), nothing at 48px; labels 12-16px (median 14); the value
  about 1.7 times the label. **Weight:** a large number at regular weight under a semibold label is
  common; bold for money only.
- **Label above value,** grey, sentence case. No icon in a coloured circle, no sparkline, no tinted
  tile. An info icon beside the label is fine. Units are a smaller grey suffix ("5 mins", "2 m 24 s").
- **The answer figure leads:** 30-36px and at least 1.3 times its siblings (18-24px). No other figure
  on the screen is larger.
- **One figure, one place:** not repeated in a legend beside it; a strip whose every cell names a panel
  below is dropped in favour of each panel leading with its number.
- **As tabs:** the selected KPI carries a 2px rule or the active fill and an ink label; the others keep
  grey labels with values in ink (400 against 500). Never grey a value: it reads as disabled. On a phone,
  a 2-up grid with the selected cell filled, or a row that scrolls sideways.

### Deltas

- Optional (9 of 20). 10-15px, never larger than the label; text, a small glyph, or a pale pill.
- **The window in words:** "vs prior 30 days". **Colour only the number,** or set the delta grey.
- **Colour says good or bad, not up or down** (house rule). Latency, error rate, cost, churn and
  time-to-reply are better falling; a bad-direction change takes `--negative`, a good one `--positive`
  or grey.
- **Zero or undefined change is grey.** From zero, "+4 (new)"; with nothing to compare, a short grey
  dash. Never three green "up 100%" pills, a ">999%" or a red "0.00%".

## Charts

### Which chart for which question

| Question | Form |
|---|---|
| Is it moving over time? | One line; an area only with a fill of 15% or less |
| How much per period? | Columns with square corners |
| How is it distributed? | A histogram with equal bins |
| Who ranks? | A sorted horizontal bar list, or the row's fill as the bar in a one-figure list |
| What share? | A thin ring, or a 100% stacked bar with 2px seams; five parts at most |
| How far to the target? | A progress bar, both ends labelled, the fill the true ratio |
| How much of the plan is used? (house rule) | A track as long as the plan, spent filled, committed as a lighter segment, an overrun past the end in the negative colour |
| Has it drifted from target? (house rule) | One row per part: the current share as a bar with a 1px tick at the target; never two stacked bars to compare |
| Where? | A map with a list beside it carrying the magnitudes |
| Per period and running total? | The two side by side at equal width with the same dates, once per screen, only when the total crosses a line that matters |
| Which way did it flow, and how much? (house rule) | Columns above and below one zero line on one scale, the axis signed and captioned each side, a marked period in a second tone with its own legend entry |
| Who is away when? (house rule) | A timeline of people by day, each kind of booking its own mark (below) |
| Is there enough cover? (house rule) | A team-by-day matrix of slack against the minimum (+2, +1, 0, −1), one hue ramping toward the negative, the headcount on hover |
| When in the day, against last time? (house rule) | One row per item on a shared axis: a 2px grey track, an ink dot for today, a hollow tick for the comparison day |

- **A series flat except for one event** gets at most two-thirds of the width and about 140px of height,
  or a range capped at about twice its reference line with the off-scale peak labelled.
- **A forecast is not a fact:** after today the line is dashed, the end value labelled, the gap to a
  target bracketed.
- **What the brief asks to see over time is drawn on the first screen;** KPI tabs may switch the chart
  only between metrics the brief did not name.
- With only a few numbers, draw no chart.

Draw charts as your own SVG to these rules, or with a chart helper or library configured to them, never
a library's defaults and never a picture of a chart. Lay labels out after fonts load. A legend is built
from the same style object as the marks, so each swatch is the mark it explains, scaled down.

### One question, one series

One series per chart is the norm; three is the most. Switch metrics with a control instead of
overlaying lines. Plots run 112-264px tall (median about 195), an aspect of 1.8 to 5.2.

### Axes and gridlines

- **Gridlines** horizontal only, 3-5, 1px solid, about #e5e5e5 on light, #2b2b2b on #111. Dashed lines
  only in chart grids, reference lines and empty slots.
- **No y-axis line;** the baseline is the one heavier line.
- **Y ticks** 4-7 (median 5) at 11-16px in grey; round even steps, the top tick above the maximum,
  integers for counts, zero as the baseline for bars and counts. Never without a scale; never uneven
  ticks, a 0.8 on a count, or a cumulative axis starting at 1. Axis text no larger than the data.
- **X labels** 4-8, flat, never rotated, first and last pulled inside, on one step all the way (choose a
  step that lands on the end, or leave the end unlabelled). Time goes on a time scale.

### Marks

- **Lines** 1-3px (median 2), straight segments (smoothing invents values), no point markers except a
  hover dot. **Fill:** none, or a flat tint of about 14%, or a fade from the line over 150-200px.
- **Bars** square, or at most a 4px top radius with a square base; stacked segments split by 1-2px seams.
- **Colour:** one hue per chart; neutral series are fine and often better (signs instead of colour).
  The one hue goes on the main data element. One subject keeps one hue across the screen. Status
  colours are for status. Four hues on a screen at most.
- **Legends:** none for a single series; otherwise five items at most, as 5-8px dots with 12-14px grey
  labels in the card header, or a small table (dot, name, value, change). Never list a series with no
  data.
- **Rings** only for three to five parts not already listed beside them; thin strokes (3-5px on a
  90-154px ring); no slice labels; the total in the centre or beside it.
- **Progress bars** 4-24px (median 8), rounded, both ends labelled, the fill the true ratio, no stub at
  zero.
- **Tooltips** bare text or a plain box without an arrow: label and value on one line.
- **Annotate the event that matters.** A step or spike over about three times the usual change gets a
  1px marker and a 12px label naming its cause ("Deploy a3f09c1"); reference lines (budget, SLO) are 1px
  dashed with their label at the end.
- **Labels never collide.** Annotation labels sit in rows above the plot beside their own leader lines,
  reserved only when a label exists; a "Now" label goes on the side its series does not cross.
- **Short and empty histories are drawn honestly:** a flat zero line with one spike, missing bars for
  empty periods, no padded range, no "No data" picture, and no lone point given the screen's largest
  plot.

### Calendars and timelines (house rule)

People down the left on a fixed 160-220px column, grouped under a team subheader; days across with faint
1px day lines, weekends one tone step darker, today a 1px line in the data hue with its date in ink.
Bars 20-24px at radius 4; one-line names on a 32px pitch, a name with a subline 40-44px. **Every kind of
booking has its own mark:** holiday a pale fill, off sick a 1px diagonal hatch, long leave a darker grey
step, working away an outline, a pending request a dashed outline; a style with a hue budget may give
the kind the screen is about a 3px edge in the hue inside the bar (a data mark, not a container border).
Full colour only for what needs a decision. A label sits inside its bar; a short bar shows the kind's
code with the full label in its tooltip, or the label after the bar's end. Multi-office holidays name
their office. Every legend swatch is the mark itself and lists only kinds on screen.

## Tables and lists

### Rows

Single-line rows 36-53px (median 45); two-line rows with media 56-92px (median 72, the media height plus
24-32px); key-value rows inside cards 21-32px. In a two-line cell line 2 sits about 21px below line 1,
one size smaller and grey; two-line labels need at least a 40-44px pitch. Overview lists show 2-5 rows.

### Header

11-14px (median 12), regular, grey, sentence case; no fill band; no rule under it on most, and where
there is one it is the strongest line in the table. Header row 36-40px. Numeric headers right-aligned
and flush with their values; a header over a control aligns with it. A sort glyph on the active column
only.

### Dividers

No zebra. About half the lists have no row dividers (a 61-92px pitch or 2-8px gaps between filled
rows); otherwise 1px, 3-7% darker than the surface (#ededed-#f4f4f4 on white). Pick one extent per
screen: bleeding 8-9px past the text, starting at the text column, or the full inner width.

### Figures and alignment

- **Numbers right-aligned** in tabular figures (or a monospace). **Fixed decimals per metric:** money 2,
  percentages 1 or 2, counts none. Thousands separators; abbreviate only in a capacity line ("12.7k of
  20.0k"). A sign on every change. No space after a currency sign.
- **The identity column gets the most width** (a third to a half) and is never the one cut; shorten
  names editorially and use the same short name at every width.
- **One right edge per row or card.** **Two measures stack in one cell** (a count over its grey
  percentage, a date over its time) on one right edge.
- **Dates** ISO and right-aligned where rows are compared; in words for recency ("Today", "6 days").
- **IDs** in a monospace at body size, truncated to about 8 characters with an ellipsis and a copy icon.
- Truncate to one line with an ellipsis; never break inside a word. A breakdown in a narrow card goes in
  fixed mini-columns or `nowrap` items with the separator attached to the next item.
- **An edited cell shows that it changed** (house rule): a mark on the value, and the baseline named in
  the header or a caption.

### Ink inside rows

Only the identity and the key number take the primary ink. A missing value is a grey dash; a real zero
is printed. The sign lives in the text ("+" on income), not in red on every negative. Link colour on the
name cell only, no underline.

### Status pills

15-28px tall (median 20), text 11-14px at 500; a full pill or a 3-5px tag; a pale tint with dark text of
the same hue, optionally a 1px border a step darker (#dcfae5 / #04250e, #ffedea / #831c1e). Neutral
states as monochrome chips with a glyph. A state machine uses one hue at three intensities (grey off,
full hue for the call to action, a dark tint for running); a saturated fill with white text only for
that one rare call to action (past about a fifth of rows, use the pale pair or a 6px dot). One status
mark per row. A chip is never squeezed: `flex: none; white-space: nowrap`.

### Media

16px logos in dense rows; 24-32px avatars; 48-50px in two-line rows. Circles for people, tokens and
companies; a 2-3px radius for artwork and flags; 8px for photographs. One fixed media slot down the
list; 10-16px to the text.

### Actions and paging

- **No pagination on an overview:** cap the rows, link out ("View all" in the header), state the total.
- Row actions: none, or one kebab at the far right. A trailing action column only when most rows carry
  the action. A row that needs doing (a bill to pay, a failed deploy) gets a visible ghost button or ink
  text action in one fixed trailing column at the same pitch, never muted grey text.
- Checkboxes only where bulk actions exist.
- Hover and selected: a 1px outline at 6px radius, or a darker border with a 1px ring; a list that
  drives a detail pane marks the selected row with the nav pill's `--active` fill (house rule).
- Toolbar: one search, 30-36px tall.
- **A full list screen** (house rule): the total above the table, the header kept in view while
  scrolling, paging or load-more at the end with the range ("1-50 of 1,284").

### Lists that carry data

- **The row fill is the bar** (radius 8, as wide as its share of the largest; 44px rows, 2px gaps), only
  in a one-figure ranking list.
- **Bar list:** a 64px pitch, a label line, a 10px pill bar with the value 5px after its end, the longest
  about 88% of the width, one colour, no track.
- **Inline bars are thin and grey** (2-3px) unless they are the main series; the top item in ink.
- **A timeline draws its comparison** as a mark on the same axis, not only a line of text.
- **Legend as table** on a 57px pitch; **key-value well** (tinted, radius 8, 32px rows); **feed as row
  cards** (63px, 8px gaps, a fill a step lighter and a border a step darker than the panel); **tree**
  (no dividers, 8px indent per level, a 30px pitch, about 45px between groups).

## Forms and settings

### Fields

- **Label above the field**, 14px at 500, 8-10px gap. No floating labels, no placeholder as label.
- **Inputs** 38-40px in forms (radius 8-10); toolbar and filter controls 28-40px (median 32). One
  control height per context.
- Inputs stay white with a 1px #e5e7eb-#e8e8e8 border even on a grey panel; filter and select controls a
  step darker (#cdcfcf-#d1d5db). A leading icon at 14px, 13px from the edge, text from 38px.
- **Spacing:** 24px from a description to the first label, 16px between fields, 16px to Save.
- A joined input and action share a border and square their inner corners.
- **Toggles** 28x16 to 33x20; on is a semantic green or near-black, not the brand accent.
- **Disabled** controls stay legible and say why; 30% opacity panels and 1.4:1 Save buttons fail.

### Settings layout

- **One view per area** (house rule): each area (general, members, billing, notifications) is its own
  view from the sidebar or a sub-nav, with the area's name as the `h1`. One long page with anchors put
  the first area the brief named four screens down and was marked down.
- Each section is a row: a label column (about 450px: a 16/500 title, a 14px grey description) beside a
  panel (about 700px, #fafafa, radius 16, padding 16, no border, no shadow). The title's cap top aligns
  with the panel's first line. Sections split by a full-width 1px rule with 32px above and below. A tall
  panel never leaves the label column empty: put the section's help or a summary of its current values
  there, or narrow the column.
- A switch row: a 14/500 title, a status badge 8px after it, a 14px grey description, the toggle on the
  right 16px from the edge, centred on the title line.
- A plan-gated feature: a 48px tinted strip with a 32px button directly above the locked panel, which
  stays readable.
- Narrow containers stack: label, 10px, field, 26px to the next pair.
- **One save model per view:** every control saves itself with a quiet "Saved" stamp, or one Save per
  panel at its bottom right. Never both on one view.
- **Show what the setting produces:** beside the control, a small preview of the result (the invite
  email, the notification as it arrives, the next invoice).
- **Destructive actions** (house rule) go last, in their own section, as a text or outlined button in the
  negative colour, with the consequence in words and a confirmation that names the object.
- A usage strip opens a settings view only when usage is its question, its figures smaller than the
  `h1`.

### Buttons

27-40px tall (median 34, mode 32): a 6-8px radius in tight styles, full pills in soft ones. One filled
primary per screen, usually near-black; a secondary white with a 1px border; a tertiary text. Controls
in one row share a height.

## Type and colour

### Type

- **One grotesk.** All 23 screens use a neo-grotesk, 14 alone. A second face always has one job (a
  monospace for figures or IDs, a serif for one greeting, a brand face on the wordmark); never three.
  Axis ticks, chart notes and labels stay in the text face.
- **App type is not display type:** the `h1` stays 18-32px, no figure reaches 48px. No display faces in
  labels, buttons or data.
- **A fixed rem scale, not fluid:** clamp-sized headings do not serve product UI. Steps 1.125-1.2 apart.

| Role | Range | Median |
|---|---|---|
| Page title | 14-48 | 24 |
| KPI value | 16-40 | 24 |
| Card title (500-600) | 14-24 | 16 |
| Body, nav, cells | 13-16 | 14 |
| Labels, meta | 11-14 | 12 |
| Axis ticks | 11-16 | 12 |
| Pills, badges | 11-14 | 12 |

  4-9 sizes per screen (median 6); clean scales are 12/14/18/24, 12/14/16/30, 12/14/16/24. Weights:
  median 3; 700 does one job (money, the greeting or the title).
- **Figures** tabular on every number in a table, KPI or anything that updates; check that
  `tabular-nums` actually changes the face's digit widths, or take another face.
- **Case** sentence case; tracking 0, negative only on large type (-0.02em at 32px). Line height 20px
  for 14px text, 24px for 16px. Prose still keeps 45-75ch; data and tables can run denser.

### Colour on light screens

- **Product defaults to restrained:** the accent on primary actions, current selection and state, not
  decoration. A single surface can earn more (one category colour carrying a report, a drenched welcome
  screen).
- **Ground models:** white cards on an off-white ground (#f3f5f7-#fdfdfd); grey panels on white; a framed
  sheet. The sidebar is never dark or saturated against a light canvas.
- **Lines in three steps:** card edges about #eaeaea; row rules a step lighter (#efefef-#f4f4f4);
  control borders a step darker (about #d1d5db).
- **Text in three tiers,** each reaching 4.5:1 on its surface, placeholders included (#6b6b6b is about
  the lightest grey that holds on white and #f9fafb).
- **Accent placement:** on data only with greyscale chrome, on actions only, or none. One accent family.
- **A state-rich semantic vocabulary,** standardised: hover, focus, active, disabled, selected, loading,
  error, warning, success, info. Text greens dark enough to pass (about #247b50, 5.2:1); pale pairs for
  pills; a notice #fffbeb with a #fde68a border and #92400e text; a count badge #c4242a-#dc3532.

### Colour on dark screens

- **Ground** #000, #111 or #171719; no navy and no slate.
- **Surfaces:** a lighter step with no border (#111 on #000, a tone-step well at #222-#2a2a2a); the
  ground's fill with a 1px line (#2e2e2e on #111); or, once, darker than the ground with a soft shadow.
- **Lines:** structural lines 22-31 levels above the ground; interactive outlines brighter
  (#373737-#4c4c4c) so an outlined button reads as clickable.
- **Text** #fff; two greys at most, far enough apart to read as two (about #b4b4b4 secondary, #949494
  meta), both at 4.5:1.
- **Accent** on data or one selected state; active nav by brightness; emphasis by an inverted pill, a
  grey-filled button or an outline.
- **Status** as a hue on a dark tint of itself (#3fc07a on #172a1d). When the accent is green or
  yellow-green, `--positive` is the accent (light screens too), or the sign carries meaning in ink.
- Colour share at or under 3%.

### Surfaces, radius, icons, spacing

- **A border or a shadow, never both.** Shadows that exist are faint (alpha .06 or less at 0 2px 8px);
  real shadows are for what floats.
- **Radius is bimodal:** tight 4-8px or soft 16-24px, chosen once; controls follow (6px with tight cards,
  pills with soft). Nested radii step down (20, 10, 8, 5, 4). Three panel radii at most.
- **Group, don't box:** a set of KPIs is one card split by dividers, or a bare strip with 48-52px
  vertical dividers.
- **Icons:** outline, one set; nav 14-20px (median 16) at about 1.5px; inline 12-14px; about 10px to the
  label; grey. Never in a saturated circle; a container only if neutral, or to code node types in a
  builder.
- **Spacing** on a 4px base: card gap 6-24px (median 16), card padding 12-34px (median 20), section gap
  24-64px.

### Default tokens

The study's medians for anything the product does not set, with greys moved to pass 4.5:1:

```css
:root {
  --ground: #f9fafb;  --surface: #ffffff;  --raised: #f9f9f9;  --active: #eeeeee;
  --border: #e8e8e8;  --rule: #f2f2f2;     --control: #d1d5db;
  --text: #111111;    --muted: #5f6368;    --faint: #6b6b6b;    /* placeholders use --faint */
  --primary: #1d1f20;                      /* near-black fill, white label */
  --accent: /* one hue, about 3% of pixels: the data, plus at most one control */;
  --positive: #247b50;  --pill-positive-bg: #dcfae5;  --pill-positive-ink: #04250e;
  --negative: #c4242a;  --pill-negative-bg: #ffedea;  --pill-negative-ink: #831c1e;
  --pill-warning-bg: #fffbeb;  --pill-warning-ink: #92400e;  /* notice border #fde68a */
  --grid: #e5e5e5;  --chart-span: 0.06;    /* opacity of a shaded span in a chart */
  --radius-card: 8px;  --radius-control: 6px;  --radius-chip: 4px;  /* soft: 20 / 14 / 999 */
  --gap: 16px;  --card-pad: 20px;  --pad: 24px;
  --nav-row: 34px;  --control-height: 32px;  --row-height: 48px;
  --fs-title: 24px;  --fs-section: 16px;  --fs-kpi: 24px;  --fs-body: 14px;  --fs-small: 12px;
}
:root[data-theme="dark"] {
  --ground: #000000;  --surface: #111111;  --raised: #222222;  --active: #222222;
  --border: #1a1a1a;  --rule: #161616;     --control: #444444;  /* on a #111 ground the border is #2e2e2e */
  --text: #ffffff;    --muted: #b4b4b4;    --faint: #949494;
  --primary: #ffffff;                      /* inverted: white fill, black label */
  --positive: #3fc07a;  --pill-positive-bg: #172a1d;  --pill-positive-ink: #3fc07a;
  --negative: #e5566f;  --pill-negative-bg: #2c1a20;  --pill-negative-ink: #e5566f;
  --grid: #2b2b2b;  --chart-span: 0.12;
}
.num { font-variant-numeric: tabular-nums; }
td.num, th.num { text-align: right; }
```

## Density

Studied screens hold 6 to about 120 data points (median 25). **Sparse** (6-25: homes, settings, one
object): card padding 20-24px, rows 56-92px, body 14-16px. **Medium** (25-50: analytics, finance homes,
lists): rows 44-56px, padding 16-24px. **Dense** (about 120: research, monitoring, long sessions): a 13px
body, 28px list rows, 42px table rows, framed with generous air (100px gutters, 64px between bands, 32px
card padding). Density is three settings moved together: row pitch, padding and type size.

Placed space reads as calm; leftover space reads as unfinished: emptiness from a fixed grid and repeated
gaps looks deliberate, from a grid that does not fit the data, an empty column, a blank top bar or a
stretched card it looks accidental. Design for the data the account has as well as the data it will
have: size the block to the question, not to the data the product hopes for.

## Empty, zero, loading and error states

- **A real zero** is printed in the normal style ("$0", "0.00%"); it may dim to grey when the caption
  beside it becomes the next step.
- **Missing or not applicable** is a grey dash at text size; "--" at 24px reads as loading.
- **Counts and frames follow the view:** counts in tabs and tiles computed from the current view; a
  filtered block shrinks to its rows, or keeps its rows with one empty-state sentence.
- **An empty side card fills with the reference data** (last Sunday's sell-out times under "Nothing has
  sold out yet today"), not a dashed box in white space.
- **Red is a signal, not a texture:** one red mark per object at most, on the overdue or failing fact.
- **An empty section keeps its frame and header** and adds one sentence spanning the block
  (`grid-column: 1 / -1`): a 1px dashed box, radius 8, about 38px tall, or a bordered box with an add
  link. An empty slot in a builder is a dashed 1px box on the canvas colour.
- **An empty chart is drawn:** the zero line, missing bars, no padded range, no picture.
- **Empty states teach the interface,** not "nothing here".
- **First run:** keep the frame and the title, put the first action where the data will appear, and show
  setup progress at its true percentage.
- **Loading** (house rule): the final layout, values replaced by flat grey bars at their real size, rows
  at their pitch, labels shown at once, no shimmer, no layout shift; a refresh keeps the old values and
  updates the freshness stamp.
- **Error** (house rule): inside the block that failed, never a full-screen banner; one sentence saying
  what failed and when the data was last good ("Couldn't load deployments. Last updated 09:14.") and a
  Retry text button; the negative colour only on a small icon or the pill pair.
- **Stale or static data:** a freshness stamp with refresh; a snapshot that cannot refresh says so in one
  quiet notice. A notice tint is never a ground.
- **Limits and usage:** a bar at the true ratio with both ends labelled.

## Motion

App screens have no motion floor. Motion is feedback and state: press, hover, focus, a menu or sheet
opening, a row arriving. 150-250ms on most transitions; users are in flow. Nothing performs an entrance
and there is no orchestrated load sequence (house rule). Detail: [motion.md](motion.md).

## The phone

House rules (the study has no phone screens). The sidebar never takes more than 30% of a phone's width.

- **Navigation folds:** a 48px top bar with the screen's name, a menu button opening a full-screen sheet
  (nav, switcher, account) and at most one action; or a bottom bar of four or five short-labelled
  destinations. An icon rail becomes that bottom bar.
- Margins 16-20px; touch targets 44px; data and labels 14px, sublines no smaller than 12px.
- **The title stays** at 20-24px; header actions move into a kebab, except the one primary.
- **Filters** collapse into one row of chips or a Filters sheet; tabs scroll sideways inside their own
  row, never the page. The first list row starts in the top 60% of the screen.
- **KPIs:** a 2-column grid (an even count after any full-width lead, or the last cell full width) or a
  label-left value-right list; never four squeezed columns.
- At most one row of controls above a chart. **Charts** full width, 160-200px tall, 3-4 x labels, a dot
  legend above (2-column, or behind a "Key" disclosure if it would wrap to three lines); y ticks in their
  own lane, never on the line.
- **Row actions** are text actions or one compact trailing button, with one filled bulk action for the
  list.
- **When a strip collapses, drop the item least relevant to the main action,** not the last in source
  order.
- **Tables become two-line rows below about 640px:** identity and key number on line 1, the other named
  fields in 13px grey on line 2, the one action at the right; fields move, never drop. A table that must
  stay a table scrolls inside its own frame with its first column fixed.
- **The tablet (641-1100px) is its own band:** the sidebar folds, tables keep four or five columns with
  secondary fields as sublines, two narrow panels stack once either would be under about 340px.
- **Blocks that carry an action move up:** a right rail with an action becomes a one-line summary row
  above the list ("5 items low · Review").
- **Several panes** (list and detail): one at a time; choosing a row pushes the detail; back returns to
  the list at its scroll position.
- Settings stack the label column above its panel; a right rail moves under the main column or into a
  tab; builders show the work read-only, with the palette as a bottom sheet if editing stays.

## House rules

The page rules in `SKILL.md` were written for pages read once. An app screen is read every day, and part
of what those rules ban is the structure of a working screen. These relax, with limits:

| Allowed on app screens | Limit |
|---|---|
| **1px borders** on cards, panels, tables and controls | About 1.1-1.3:1 against the ground on light (#e5e7eb-#ededed on white); #1a1a1a on #000, #2e2e2e on #111. Controls a step stronger. A border or a shadow, never both |
| **Row rules** in tables and lists | 1px, 3-7% darker than the surface. No zebra, no header band |
| **Dashed lines** | In chart grids, reference lines and empty slots only |
| **Small labels** above values | 12-14px, sentence case, grey at 4.5:1; meta and axis text 11-12px; nothing under 11px; at most one tracked uppercase label on a screen (a switcher's context label). Never above a heading as an eyebrow |
| **Rows of identical cards** | Peer metrics or peer objects only: 3-6 across, equal widths, one gap, no orphan, edges aligned across rows, no icon on top. Prefer one divided card; mixed spans beat a uniform grid |
| **Monospace** | IDs, keys and code; or every figure, as one decision. Otherwise tabular figures in the text face |
| **Pills** | Inside rows and beside a value only: 16-24px, a pale tint with dark text of the same hue. Never above a heading |
| **Index numbers** | Only as data: a rank, a node number |
| **Icons** | 14-20px outline, one set, grey: in the nav, before a label, or as a single affordance (kebab, chevron, info). A container only if neutral, or for node-type tiles in a builder (name the reason in your report) |
| **Shadows** | On what floats: menu, popover, tooltip, composer, dialog. A resting card at most a small blur under 8% black |
| **A second typeface** | With one job: a mono for IDs or figures, a serif for one greeting |
| **A gradient** | Only as an area fade under one line chart; a flat tint of about 14% is safer |
| **System fonts and standard navigation** | A well-tuned familiar sans and the platform's patterns are a virtue here |

Still banned, as on pages:

| Banned | Instead |
|---|---|
| Gradients on grounds, buttons, cards, text and KPI tiles | Flat fills |
| Glows, glass, backdrop blur | Opaque surfaces one tone step from the ground |
| An icon in a coloured circle or tinted square on every KPI or card | A label and a number |
| Rainbow charts: more than four hues, a hue per bar, one subject in two hues | One hue per chart, neutrals for the rest |
| Sparklines on KPIs | The trend in its own chart, or nowhere |
| Emoji in greetings, labels, nav or empty states | Words |
| Lorem ipsum, Acme, John Doe, "User 1"; vanity figures; totals that do not add up | Believable sample data computed from rows, listed in the report |
| Status colour on a zero or undefined change | Grey, or the change in words ("+4 (new)") |
| A dark or saturated sidebar on a light screen; a navy or slate dark theme | The page ground for the sidebar; true neutral darks |
| The accent on chrome: a tinted nav row with a left bar, coloured tab pills, a brand fill on every button | The accent on data and at most one control; a near-black primary |
| Uppercase tracked table headers, zebra rows, header bands | 12px grey sentence-case headers; rules or space |
| Left-aligned numbers, proportional figures in columns | Right-aligned tabular figures |
| A hero header, a greeting with an emoji, an illustrated welcome banner | A noun title at 24px |
| Pagination under a five-row overview list | Capped rows, "View all", the total |
| Violet and indigo accents; cream with terracotta | The product's own palette |
| A landing-page title (over 32px) or a figure at 48px or more | An 18-32px title; figures at 16-40px |
| Icons in boxes repeated down a list or on every peer card | One plain 16px icon where it helps, or none |
| Every row a different hue; a "left" amount in green on every budget row | Grey for what is fine; colour only on the rows at risk or over |
| A screen that names no product and offers no action | The product's mark and scope in the shell; its main job one click away |

On violet and indigo: 10 of the 23 studied screens use them, always as a data hue or a single control.
The ban is house taste, not a finding; a brand that owns the hue keeps it.

## Tells of generated dashboards

| Tell | What replaces it |
|---|---|
| A dark navy or tinted sidebar with a coloured active pill and a left bar | The sidebar on the page ground; a neutral grey pill, or the label brightening on dark |
| "Welcome back, Alex" with a waving hand and a subtitle | A noun title at 24/600 |
| Four KPI cards, each with an icon in a tinted circle | One container split by hairlines, label over value |
| A green "+12.5%" pill on every KPI | A delta in words with its window; grey for zero; "+4 (new)" from zero |
| A sparkline on every KPI | The trend in its own chart |
| KPI values at 36-48px, bold, in the brand colour | 24-30px at 400-600 in ink |
| A gradient area chart with a smoothed spline and a dot on every point | A 2px straight line, usually no fill, no markers |
| A rainbow palette, a hue per bar or per chart | One hue per chart; the accent on data; four hues at most on a screen |
| Gridlines every 20px, axis lines both sides, a legend for one series | 3-5 faint lines, no y-axis line, no legend for a single series; round ticks above the maximum |
| A fat donut with slice labels and a big total in the hole | A thin ring, no slice labels, the legend as a table of values |
| Cards with a 16-24px radius, a 1px border and a large soft shadow | A border or a tone step, no shadow; tight or soft radius, chosen once |
| A zebra table under uppercase headers with a checkbox, avatar, status chip and kebab on every row | Rules and alignment: 12px grey headers, one status mark, one action where needed |
| Left-aligned numbers in proportional digits | Right-aligned tabular figures, fixed decimals, units in grey |
| Saturated status chips with white text | Pale tints with dark text of the same hue |
| The accent on every button, tab and link | No filled primary, or near-black |
| A top bar with search, a bell and an avatar on every screen, or one left mostly empty | No top bar, or one carrying search, the switcher or the object's name |
| Export, Share and a date picker clustered by the title | Actions only when real; a freshness stamp instead |
| Placeholder people and companies, round vanity totals, growth on a week-old account | The product's own data, small numbers at their real size, totals summed from rows |
| Pagination under a short list | Capped rows and "View all" |
| An equal four-up grid whatever the data, with orphan cells and stretched cards | A column count chosen by the item count; spans that land on the same lines |
| Neon on dark, glowing borders, glass | True neutral darks, lightness steps, colour on the data |
| The kit's own face: a stock grotesk on #f8f8f8 with white 12px cards and no hue on the data, or lime on black | One face from the brief and one element only this product has |
| A coloured icon per category in a list | One grey icon set; colour, if any, on the numbers |
| An illustration and "No data yet" in an empty chart | The zero line drawn, and one sentence in the frame |
| A long settings page scrolled by sidebar anchors, with mixed save buttons and autosave | One view per area, one save model |

A screen with every tell removed and nothing in their place is a tidy template. What fills the space is
the product: its own data at its real size, the screen's one question answered by its biggest block, and
a grid whose sums close.
