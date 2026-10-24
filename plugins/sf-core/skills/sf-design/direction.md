# Direction: an art-directed build of a page or app screen

The direction mode of [design](SKILL.md). The designer, DESIGN SETUP, the designs
directory and the decision brief are in [SKILL.md](SKILL.md).

A built page left to a model's defaults is the average of every page it has seen. This
mode replaces those defaults with decisions: a script **deals** researched directions and
you choose among them; the **idea** comes from the subject; a real-browser **inspector**
measures the [quality floor](../sf-frontend-ui/SKILL.md#quality-floor) instead of hoping
for it; and you **look** at what you made and fix it, in rounds.

## When to use which mode

- **direction** (this mode): build a public-facing page (landing, product, portfolio,
  event, restaurant, one-pager) or an app screen (dashboard, admin, settings, inbox) end to
  end, from a dealt direction to a gated, looked-at build.
- **shotgun**: see several variants side by side and pick one; it builds nothing for
  production.
- **consultation**: set the design system (DESIGN.md) or decide a new visual world; when
  DESIGN.md exists, direction keeps it (`--keep palette,type`) and deals composition only.
- **html**: production HTML from an already approved variant or a recorded direction
  contract.
- **refine**, **critique**: improve or score something already built.

## Setup

- `<skill>` below is this mode's folder, `sf-design/direction/`. Run every command from the
  project root, so working files land in **`.design/`** there: the sheet
  (`.design/direction.json`), the draw history (`.design/history.json`, so consecutive
  builds in this project do not repeat), inspector output (`.design/inspect/`), scene sheets
  (`.design/scenes/`), before/after captures, and the browser's throwaway profile
  (`.design/tmp/`, removed after each run). Add `.design/` to `.gitignore` when the user
  agrees.
- The scripts need **Node 22+** and an installed **Chrome, Edge or Chromium** (set
  `CHROME_PATH` if it is somewhere unusual); they install nothing. `draw.mjs` and `lint.mjs`
  run on Node 18+. **`assets.mjs` uses the network**: plain HTTPS searches of open image and
  video collections (Openverse, Wikimedia Commons, the Art Institute of Chicago, the Met,
  the Internet Archive's Prelinger films, NASA) with no keys, and downloads of the files you
  choose into `assets/`. Requirements are recorded in
  [tools.md](../sf-setup/tools.md#direction-scripts).
- The sheet and the inspector's messages were written with their own file names. Read them
  through this map: "SKILL.md step N" is step N below; `references/copy.md`, `type.md`,
  `colour.md`, `layout.md`, `imagery.md`, `motion.md`, `tells.md`, `app-screens.md` are the
  files of the same names in `sf-frontend-ui/references/`
  (e.g. [copy.md](../sf-frontend-ui/references/copy.md)); `references/critique.md` is
  [critique/rubric.md](critique/rubric.md); `references/scenes.md` and `research.md` are
  [direction/scenes.md](direction/scenes.md) and [direction/research.md](direction/research.md).
- Read PRODUCT.md and DESIGN.md first; they answer much of step 1.

## Page or app screen

Decide first which kind of work this is ([modes](../sf-frontend-ui/SKILL.md#modes)).

- **A page** is read and scrolled: it follows **the page run** below.
- **An app screen** is worked in: it follows **the app-screen run**, with its own draw
  (`draw.mjs --app`), its own rules
  ([app-screens.md](../sf-frontend-ui/references/app-screens.md)) and `inspect.mjs --app`.

A product site that shows its app is a page; the interface fragments on it follow the
app-screen rules inside. Deal the product's app style once, in its own folder, keeping the
page's colours and type:

```bash
node <skill>/scripts/draw.mjs --app --kind <kind> --brief "<the product>" --keep palette,type --out .design/app
```

and build every fragment the page shows (the hero's live screen, a feature's crop, a chart)
as a real piece of that app: `<skill>/assets/app.css` for panels, tables and controls,
`<skill>/assets/charts.js` for charts, real data that adds up, one finding stated, cropped
and scaled the way the page's blueprint treats a picture, its root marked `data-ui`. A
fragment that looks like a working product is the strongest picture a software page has.
When a request holds both (a landing page and the dashboard behind it), build each with its
own run and one shared palette and typeface.

## The page run

Do these in order. Steps 1-5 take minutes and decide whether the page is any good.

### 1. Read the brief and the project

Find what is real: the subject, the audience, the one thing the page must get someone to
do, the stack, any brand (colours, fonts, logo), and above all **what imagery truly
exists** (the project's photographs or product shots, a real interface, an image tool, or
nothing), per [imagery.md](../sf-frontend-ui/references/imagery.md#2-decide-what-imagery-exists).
Nothing of its own is rarely nothing: the subject's city, street, materials and history are
in open archives (step 6). A vague request gets your reading stated in one line; ask only
when a missing fact blocks the work (no product name).

Then **inventory the subject** in your notes: eight to twelve things that belong to this
client and no competitor: its name and what it means; its address, door number, street and
neighbourhood and what that place looks like (tiles, signs, paint, shop-front type, light,
weather); the numbers in the brief (seats, rooms, minutes to the sea, the price, the year);
the constraint it lives with (one batch a month, closed in winter, by appointment); its
materials and colours; its rituals and hours (the oven lit at five, the ferry at seven); the
printed things of its world (a timetable, a label, a ticket, a sign). The idea comes from
this list, and each place, material and printed thing on it is a picture query for step 6.

**Done when** the inventory holds at least eight subject-only items and the real imagery is
named.

### 2. Write the argument

Before any design, list the page as claims with their proof, one line per section, as
[copy.md](../sf-frontend-ui/references/copy.md#1-write-the-argument-first) shows. The claims
decide which sections exist and in what order; a section with no claim is deleted.

**Done when** every planned section has a claim and its proof.

### 3. Draw the direction

```bash
node <skill>/scripts/draw.mjs --sector <sector> --brief "<one line about the subject>" \
  --sections <roles in the order of your argument> [--tone <tone>] [--have <assets>] [--keep palette,type] \
  --options 3
```

This deals three directions with a short summary each. Hold each against your inventory:
which way of composing can carry something only this client has? Choose that one, not the
most familiar, and write one line on why: a direction that did not suit the subject was the
commonest cause of a weak page in testing. Then deal the full sheet:

```bash
node <skill>/scripts/draw.mjs <the same arguments, without --options> --direction <chosen id>
```

- `--sector`: `draw.mjs --list sectors`; pick the closest.
- `--sections`: roles from `--list roles` (features, showcase, how-it-works, testimonial,
  proof, stats, pricing, faq, cta, footer, intro, about, work, gallery, list, contact); the
  hero is implied.
- `--tone` (quiet, bold, warm, technical, playful, luxury, editorial): only when the brief
  clearly asks for one.
- `--have`: assets that really exist: `photography` (the project's own photographs),
  `product-photo` (of the specific product, or an image tool that can make them),
  `product-ui` (real screenshots), `illustration`, `video`. Leave it out when there are
  none; the draw then avoids compositions that depend on them and the sheet says how to fill
  picture slots honestly. Pictures found in open collections are not the project's own.
- `--keep palette,type`: when the brand or DESIGN.md fixes colours or faces; the draw deals
  composition and you map the brand's values onto the roles.

The **direction sheet** it prints is the art direction for this build:

- **Adopt it.** Blending it with the layout you would have made anyway undoes it; unfamiliar
  is the point.
- **Redraw one slot** (`--redraw hero | type | palette | photos | scenes | section:<role> |
  direction`) only for a reason you can state: it contradicts a stated brand constraint, or
  needs an asset that does not exist. Record every redraw for the report.
- When a dealt section cannot hold the real content (it compares three plans and there is
  one price), list the others with `--alternatives <role>` and take the one whose
  assumptions match the content with `--redraw section:<role>=<id>`; the content never bends
  to fit.
- **Check the palette against the subject.** A dealt palette is proportions (one ground,
  one ink, one accent, fields) as much as colours. If its colours fight the subject's
  material, redraw the palette once; if the subject has unmistakable colours of its own,
  keep the proportions, take the colours from the subject, and say so in the report.
- Reprint it with `draw.mjs --show`; in a long session, reread it before each section.
- More references: `draw.mjs --photos <set|query>` and `--site <id>` (a studied site in
  full; take its principle, never its names, copy or images).

**Done when** the full sheet is dealt and the choice and every redraw have a written reason.

### 4. Find the idea

The direction is a way of composing; the idea is what makes the page belong to this subject.
Write the idea sentence, run the competitor test and name the one live thing exactly as
[layout.md §1](../sf-frontend-ui/references/layout.md#1-the-idea) sets out, filling the first
blank from your inventory, never the category. The live thing is built in step 6 as part of
the page, never added as motion in step 9.

The sheet's scroll scenes carry the idea too: decide from the inventory what each one
shows before building (the fly-through passes through this studio's own title cards; the
picture that opens to the whole screen is the room the guest will wake up in). A scene
filled with pictures that could belong to anyone is a screensaver.

**Done when** the idea sentence passes the competitor test and the live thing is named with
its phone version and no-script fallback.

### 5. Write the words

Write the whole page as a plain-text copy deck before markup, by
[copy.md](../sf-frontend-ui/references/copy.md): headlines that fit two lines at every width
(its §2 arithmetic), the supporting sentence and one named primary action on the first
screen, the first screen answering the visitor's first question in large type, every section
the visitor came for with its own heading and navigation entry, and the full content (the
whole menu with prices, every room, every speaker, the price with what it includes, an
answer per real question): thin sections are the commonest reason a clean page loses to a
busier one. Sample details fill gaps and go in the report; proof is never invented
(copy.md §5).

**Done when** the deck holds every section's full content and every headline passed the
two-line arithmetic.

### 6. Build it, still

Build with motion off in your head; a page that needs animation to look finished is not
finished. Order of work:

1. **Tokens:** the sheet's colour and type roles as custom properties; everything
   downstream references tokens. `<skill>/assets/base.css` (reset, token names, fluid type
   steps, grid, focus and selection, motion helpers; no look of its own) and `base.js` (its
   reveal helper) are an optional start.
2. **The hero, exactly as the blueprint describes it,** at desktop and phone width: the big
   thing big and the small things small before anything else exists.
3. **Each section from its blueprint** with this project's content: keep the geometry,
   change the subject; neighbours never share a layout; the idea carried into every section,
   pricing, FAQ and footer included.
4. **Imagery** in the order of preference in
   [imagery.md](../sf-frontend-ui/references/imagery.md) (own, generated, open collections,
   drawn from the subject, the dealt photographs, type and colour alone). Search the open
   collections with the inventory, not the category:
   ```bash
   node <skill>/scripts/assets.mjs "<query>"            # images; --video for footage
   node <skill>/scripts/assets.mjs --get <ref>[,<ref>]  # download into assets/ with its credit
   node <skill>/scripts/assets.mjs --credits            # the footer credit line and the report list
   ```
   (`--help` lists sources, licence filters, sizes and the video cap.) Look at each before
   choosing; a found picture shows the client's world and is never presented as the client's
   own product, room, dish, person or team. The picture floor, the credits and the video
   rules are in imagery.md and the [floor](../sf-frontend-ui/SKILL.md#pages-only); the
   inspector checks them.
5. **The live thing** from step 4, built into the section where it proves the claim, with
   real content, a thumb-sized phone version and a plain fallback.
6. **The scroll scenes** when the sheet deals them, each with the section it carries, built
   now and seen in every look round: [direction/scenes.md](direction/scenes.md).
7. **Fullness, the frame, states and semantics,** per the floor's
   [Pages only](../sf-frontend-ui/SKILL.md#pages-only) rules and
   [layout.md](../sf-frontend-ui/references/layout.md) §5-6: each desktop screen a poster with
   one dominant thing; one deliberate rest per page at most; equal outer margins; no void
   that nothing closes; real links and buttons, visible focus, alt text, a phone layout that
   is its own composition.

**Done when** every section of the deck is built from its blueprint with real content, and
the imagery, live thing and dealt scenes are in place.

### 7. Gate

```bash
node <skill>/scripts/lint.mjs <source files or folder>
node <skill>/scripts/inspect.mjs <url or path/to/index.html>
node <skill>/scripts/scenes.mjs <url or path/to/index.html>     # when the page has scroll scenes
```

`lint.mjs` scans source for banned patterns and stock phrases (a line that must keep a
flagged pattern for a real reason carries the comment `design-ignore`). `inspect.mjs` opens
the page at 1440, 768 and 390, measures it (headline lines, type sizes, fonts actually
loaded, colour, rules, shadows, gradients, contrast, overflow, motion, and the frame: equal
margins, one-sided sections, blank stretches, the title, untitled sections, text at the
screen edge), serves local files over a throwaway server on 127.0.0.1, and saves screenshots
to `.design/inspect/`. With scenes on the sheet it also films the scroll; `scenes.mjs`
photographs every scene at 0, 10 ... 100% of its hold on desktop and phone, and the
reduced-motion page. Fix every `FAIL`; treat each `WARN` as wrong unless you can defend it
to a designer in one sentence. The meter is evidence: fix what it measures, never hide from
it. If the page must also open from the file system, open `index.html` that way once.

**Done when** `inspect.mjs` reports 0 FAIL at all three widths (and `scenes.mjs` reports
every scene ran, when there are scenes).

### 8. Look

Passing the gate means nothing banned was measured, not that the page is good. Open every
screenshot the inspector lists, every width, and critique them with
[critique/rubric.md](critique/rubric.md): the [passes](critique/rubric.md#passes), the
[juror score](critique/rubric.md#juror-score) and its [caps](critique/rubric.md#caps), in
the [round block](critique/rubric.md#round-block) format, rounds as
[Look rounds](critique/rubric.md#look-rounds) says. Fix the top three problems, run the
inspector again, look again. Three rounds at most. Judge only the pictures: a problem visible
in a screenshot is real, whatever the code says.

**Done when** the last round's critique is written in the round-block format and its top
three are fixed or carried into the report.

### 9. Move

Now the motion layer, required and more than one fade: the inspector counts the elements
that really move while the page loads and scrolls, fails a page under eight and warns under
sixteen. Around any scenes (already built in step 6) it has four parts, as the floor's
[Pages only](../sf-frontend-ui/SKILL.md#pages-only) rules and
[motion.md](../sf-frontend-ui/references/motion.md) set out: the sheet's signature move, done
once and well; an entrance for the parts of every section (heading, then text, then picture,
staggered 60-90ms, rising 16-32px with opacity, triggered once, never leaving content hidden
if the script fails); press, hover and focus feedback on every control and the live thing;
one moving picture. Transform and opacity only, each with a `prefers-reduced-motion`
fallback that keeps the content. A move that changes colour or layout of whole screens is
composition and belongs in step 6. Then run the inspector once more and check every
screenshot for content that failed to appear.

**Done when** the inspector reports no `still-page` FAIL and no `reduced-hidden` FAIL.

### 10. Report

Report only when all of these are true; each was skipped in a test run that came out badly:
- `inspect.mjs` shows **0 FAIL** at 1440, 768 and 390 on the final version;
- you opened every screenshot it listed after the last change, not only the first screen;
- with scenes, `scenes.mjs` ran on the final page with no problems and you read every
  sheet (desktop, phone, reduced motion);
- a stranger reading the first screen for five seconds can say what this is and what to do;
- every section has a heading, the margins match, no stretch of the page is empty;
- the last round's critique is written down in the round-block format.

Tell the user briefly: the direction dealt (name and seed) and any redraws with reasons; the
idea sentence and the live thing; the final scores of the last round and what still falls
short; every found picture and clip with title, creator, licence and source page
(`assets.mjs --credits`) and where its credit sits; which dealt photographs and drawings
stand in for photography; and the sample content to swap before launch. Claim no check you
did not run. Save the report with the screenshots in the designs directory
(`<designs dir>/<page>-<date>/direction-report.md`).

## The app-screen run

1. **Inventory the data and the jobs, and name the screen's one question:**
   [app-screens.md, Before building](../sf-frontend-ui/references/app-screens.md#before-building-data-question-finding).
   **Done when** the dataset is written and the question is one sentence.
2. **Choose a style.**
   ```bash
   node <skill>/scripts/draw.mjs --app --kind <kind> --brief "<one line about the product>" \
     --screens <screens> [--theme light|dark] [--keep palette,type] --options 3
   ```
   It deals up to three of the library's styles (`--app --list kinds | styles | screens |
   signatures`; screens are overview, analytics, list, detail, settings, wallet, builder,
   inbox, home, report). Choose by how the product is used (long sessions or a quick look,
   money or media, a team or one person, day or night), not by familiarity, write one line on
   why, then deal the sheet with the same arguments, without `--options`, plus `--style
   <id>`. Keep the style's one move intact and take every other value from app-screens.md's
   defaults. Redraw (`--redraw style | shell | screen:<name>`) only for a stated reason (it
   contradicts the brand, or the product is used in a way the style does not suit). With a
   brand, `--keep palette,type` and keep the style's colour budget. Then, before any markup,
   choose **its face** (from the sheet's "Its face" list, or your own of the same weight) and
   a **signature element** (from the sheet's list, or built from the product's things), and
   write where each appears on the first screen: a style dealt to two products must not give
   them the same face. **Done when** the sheet is dealt and the face and signature element
   are written next to the question.
3. **Build the shell** first, empty: sidebar or rail, top bar if the shell has one, canvas
   and gutters, title row. `<skill>/assets/app.css` is a neutral start; put the sheet's
   tokens in its `:root`. Look at it at 1440 and 390, and write the grid arithmetic in a
   comment (columns, gutter, and the sum that proves the cards land on the canvas edges).
   **Done when** the empty shell is checked at both widths.
4. **Put in the data.** Render every block and every chart from the dataset, the charts with
   `<skill>/assets/charts.js` (its header lists `Charts.line`, `bars`, `diverging`, `ring`,
   `barList`, `plan`, `bullet`, `timeline`, `matrix`, `timeStrip` and their options; put a
   returned legend in the card's header) or your own SVG to app-screens.md's chart rules.
   Format every figure by its table rules; the product's own words for labels; no
   placeholder data and no invented vanity totals. **Done when** every block renders from the
   dataset.
5. **Build the states:** every block's empty, zero, loading and error state; every row and
   control's hover, selected, focus and disabled state, each looked at in the browser.
   **Done when** each state was seen rendered.
6. **Check.** `lint.mjs --app` and `inspect.mjs --app` (an `--app` sheet switches both by
   itself). Fix every `FAIL`; defend or fix every `WARN`. Then look at every width and answer
   the [app-screen passes](critique/rubric.md#app-screen-passes) in writing; the page caps
   for pictures, motion and the live element do not apply. Fix the worst three, inspect and
   look again, three rounds at most. **Done when** 0 FAIL at all widths and the last round's
   answers are written.
7. **Report:** the style dealt (name and seed) and any redraws with reasons; the face and the
   signature element; each screen's one question; any check allowed with `--allow` and why
   (e.g. `icon-chips` for node-type tiles in a builder); the sample data to replace, listed
   so it can be found. App screens have no motion floor: motion is feedback only.

## Special cases

- **An existing brand or design system:** `--keep palette,type`, map its colours and faces
  onto the roles, take composition from the draw; the floor still holds. When the brand
  itself needs a banned device (its logo sits in a gradient, its accent is violet), keep the
  asset, say so, and pass `--allow <rule>` to the inspector for that rule only.
- **Redesign, restyle or review of an existing page or app screen.**
  1. Record the before: run the project and `inspect.mjs <url> --out .design/before` (with
     `--app` for an app screen), lint its source, and read the code: framework, styling
     method (Tailwind v3 or v4, CSS modules, styled-components, plain CSS), components, and
     what must survive (routes, forms, data, behaviour, brand assets).
  2. A review stops here: suggest `/sf-design critique` on the before screenshots, which
     lists findings with the inspector's measurements and the three changes that would move
     the page most.
  3. Keep the stack, the content and what works: no framework or styling migration; check
     the dependency file before adding anything. A restyle keeps the layout and takes type,
     colour and components from a dealt direction (`--keep` what the brand fixes); a redesign
     deals a full direction and rebuilds sections from its blueprints inside the existing
     components. Either way continue from step 2 with the real content.
  4. Order of work, most effect for least risk: type, colour (one ground, one ink, one
     accent), the frame (margins, rhythm, a title on the first screen, a heading on every
     section), states (hover, focus, loading, empty, error), then the stock components
     replaced by the dealt blueprints.
  5. Prove it: `inspect.mjs --out .design/after`, compare before and after at every width,
     click through every link, form and menu that worked before, and report the
     measurements side by side.
- **A component or a single section:** skip the draw unless there is no direction to follow;
  match the surroundings, apply the floor, still inspect the result.
- **No checkout or form backend:** as the floor's
  [Special cases](../sf-frontend-ui/SKILL.md#special-cases) say.
- **No Chrome or Node 22:** run `lint.mjs` (Node 18+), take screenshots with the browser in
  [browser.md](browser.md), critique those, and say in the report the inspector could not run.
- **No network:** if `assets.mjs` reaches no source, draw the pictures and say in the report
  the open collections could not be searched.

## Evals

[direction/evals/evals.json](direction/evals/evals.json) holds ten briefs (six pages, four
app screens). To test a change to this mode: give each prompt to a fresh agent with this
mode and to one without it, render both with `inspect.mjs` (`--app` for evals 7-10), have a
judge who does not know which is which score the screenshots with
[critique/rubric.md](critique/rubric.md#blind-comparison), and record both FAIL counts.
The study behind the numbers is [direction/research.md](direction/research.md).

## Completion

Done when the run's step 10 (or the app-screen run's step 7) report is delivered with every
listed condition true, or the run stopped at a review with its findings handed to
`/sf-design critique`. Suggest next: `/sf-design refine` for a named weakness, `/sf-qa` to
exercise the page's forms and flows, `/sf-benchmark` for load performance.
