# Build to the contract, then finish

The contract build of [html mode](../html.md): a surface whose direction was decided in
consultation's [new-work](../consultation/new-work.md) and recorded as a
`## Direction contract` in its surface brief. html.md routes here when that contract
exists. Two paths share one finish:

- **Comp-led:** an approved comp exists (a locked comp, or shotgun's comp round approved
  one). The comp is a measured spatial contract.
- **Code-led:** no comp of this page. The ambition lives in the contract's FIRST VIEWPORT
  block, its named signature interaction and motion grammar; a picked HTML sketch is the
  composition the build matches; a chosen decision comp rides to the finish review as a
  critique reference only. Operate and Read surfaces are always code-led.

Build the assigned direction, not a safer interpretation of it. The form supplies
structure, reading order, component conventions and native motion; the product supplies
every fact. Commit every atom: nav, buttons, inputs and links are rebuilt in the form's
vocabulary. Land the first build fully committed; later passes make the committed thing
clear and effective, never diluted. Read
[the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) immediately before the
first UI edit, and [build.md](../../sf-frontend-ui/references/build.md) for the standing
build rules.

## Comp-led: the comp is a measured contract

Only the user can downgrade an approved comp's authority, in explicit words. Builders
reliably believe their recreation of an image succeeded when it did not, so this path runs
as gated phases whose checks measure the screen against the comp. If the design-check CLI
recorded in `docs/agents/tools.md` is present, its `build-phase` verbs (`start`, `advance`,
`scaffold`, `record`, `finish`), `comp-spec`, `font-match`, `comp-diff` and `embed-prompt`
run the gates and keep their state; follow what each prints, and treat a failed gate as
work to do, never a reason to skip ahead. Without it, run the same phases by hand: keep a
phase log in `.design/build/state.md`, do each check below by eye on paired crops (the
comp region beside the same region of your capture, cut with a small script), and write
each phase's evidence into the log before opening the next. Either way, nothing for a
later phase is written while an earlier one is open.

The path asks the builder to hold a measured layout, place plates at their boxes and act
on numeric readings over a dozen attempts. A smaller or faster model stalls at the hero:
if that is the model in hand, say so before the direction round and take code-led.

### Phase 0: comps

The comp round ([shotgun](../shotgun.md), its comp discipline and one approval point):
three comps of the surface at its own viewport, each saved with its prompt beside it, the
chosen one recorded as approved. A comp locked in a surface round, or in the direction
round's decision comps, has already discharged this phase.

**Done when** one comp is recorded approved.

### Phase 1: spec (the region map)

The approved comp is a north star for translation into semantic, responsive, accessible
code, never a licence to recompose: keeping its palette and mood while redrawing its
topology is a second art direction. Core UI text and controls are never rasterised.

1. Lay a coordinate grid over the comp (`comp-spec --grid`, or a script that draws one)
   and open the original and gridded images.
2. Write `regions.json`: a `regions` array; each region has a stable `id`, a `kind`, a
   `note` saying what the comp shows there (plate prompts and checks read it), and exactly
   one of `pixelBox`, a normalised `box`, or a `grid` span, in the original comp's
   dimensions. `parentId` names an enclosing `container: true` region; parent and children
   keep separate ids and crops, and containment never transfers approval.
3. **Medium follows the pixels.** A figure, product object, machinery, any illustration
   with perspective, shading or drawing skill, and any texture by name (woven cloth, paper
   grain, leather, brushed metal) is `plate`, `image` or `texture` and ships as a raster.
   Text, controls, chrome, diagrams with countable elements, flat shape systems, and
   anything that must move, scale or respond are semantic (`text`, `control`, `chrome`).
   Writing CSS for a sculpted panel's finish, or a many-vertex `clip-path` for a torn edge,
   quietly deletes the approved design. A text, control or chrome region whose crop looks
   painted (many colours, soft gradients) is flagged; reclassify painted material now, or
   mark it `codeDrawn` with a reason so the review shows it first. Dropping an image-native
   region is the user's decision at the approval point, never a silent flattening.
4. **Split by what varies independently:** content the site swaps (room photos,
   products, people), moving parts (anything a hover or the signature interaction moves),
   and structure (frames, surrounds, ornament). A window with open shutters onto a room is
   three kinds: the surround as a plate with a transparent opening, the room as an image
   region beneath it, each shutter its own plate. A raster region whose note names a frame
   and the view through it is a baked composite: split it.
5. **Name everything with ink.** What is never named can never be missing. A text,
   control or chrome region larger than a quarter of the comp is a column: name the
   elements inside it. Text and control regions narrow to their ink only when the narrowed
   box keeps at least 95% of the span's contrasting pixels; check the crop, especially for
   compound controls and multiline text. A plate's box holds its whole artwork with a
   margin (`bleed: true` only where the page truly crops it). Callout lines and arrows
   belong to the drawing's plate; only their labels are text. An inline SVG past an icon's
   budget (a diagram, leader lines, an "approximation" of artwork) is a plate; an icon under
   64px with a few paths, or a chart drawn from data at runtime, stays code.
6. **Inspect the map** before any asset: a numbered overlay, exact crops, and comparison
   sheets of masked references (`comp-spec --regions regions.json --inspect-map`, or your
   own script). Open the sheets first, then single crops; check bounds against the
   original and look at excluded foreground pixels as well as geometry. Every overlapping
   non-container code box is masked whole, including its empty space; bound separate text
   elements separately so artwork in the gaps stays visible. Correct and inspect again, into
   a new output folder each time. Zero errors does not certify accuracy; coverage warnings
   are hints. An automatic band scaffold (`--auto`) is not element identification.
7. **Type is measured.** Read the lead text's cap height, width class and weight off the
   pixels and choose the nearest obtainable face to that shape (the CLI's `font-match
   --measure` and `--rank` do this against a font catalogue; by hand, render three to five
   candidates at that cap height with the region's words and compare crops). Install no
   browser to rank; record the face the measurement chose.
8. Measure the map into a spec: each region's box, sampled palette and medium. From here
   the spec is the build's reference. Anything not in the spec does not exist on the page:
   no borders, rules, containers or chrome the comp does not show. Three concessions only:
   fonts (the closest obtainable face), icon glyphs (the pictogram only, never a control's
   chrome), and genuine defects in the comp such as misspellings.

If the request ends at mapping, stop with the map, the inspection report and open findings.

**Done when** every inked area of the comp is named, the map inspection is clean or its
remaining findings are written down, and the lead text region has a measured face.

### Phase 2: plates

Every raster region ships as a **plate**: the region regenerated at asset resolution from
its comp crop as reference, UI text removed, at least 1.5x the region's pixel size, at its
spec path. Isolated figures, objects and ink are transparent cutouts (native PNG alpha);
photographs and full-frame artwork stay opaque; a texture is a clean patch of the comp
region mirror-tiled to size, generated only when no clean patch exists. A crop of the comp
is a reference, never a shipping pixel, and the approved comp is never edited, composited
into or regenerated. A single-file deliverable still produces plates and inlines them as
data URIs.

With parallel subagents, dispatch the `design-asset-producer` agent with the spec and comp
paths ([agent](../../../agents/design-asset-producer.md)); without a subagent tool, read that
agent file and run it in this session as its In-session section says.

**Provenance.** Every raster the artifact references carries the exact prompt it was
generated from embedded in the file (`embed-prompt`, or for PNG a `tEXt` chunk written with
a small script) or, for a sourced, stock or pre-existing raster, its origin. A raster
created or replaced later, in a fix round or a rebuild, is produced the same way; a raster
a round abandons is deleted in that round. Generated imagery is material, not a claim:
evidence rules bind assertions, specs, testimonials and photographs presented as real.
Convert images with a converter already present; probe for one at most once per session.

**Done when** every raster region has a plate at its path, each compared with its crop for
subject, placement, scale, palette and style, cutouts checked for real alpha on light and
dark grounds, and every plate carries its provenance.

### Phase 3: plan and asset review (the user)

The user reviews two things before any page code: the plates that will ship, and the plan
for everything else, which regions code draws. A painted region planned as code is the
most expensive mistake on this path, and this is where the user catches it. Text, controls
and chrome are judged later, in the first viewport.

Build the review packet from the spec (never by hand): every raster region with its plate
beside its comp crop, and every code region with its crop, kind and note, flagged and
`codeDrawn` regions first. With the CLI, its `component-review plan`, `capture`, `serve`,
`status` and `verify` verbs produce, show and verify it, and refuse while any raster region
lacks a plate. Without it, write the packet as a local HTML page in the designs folder, open
it ([browser.md](../browser.md)), and collect the decisions with decision briefs. Never
submit the review or record an approval on the user's behalf. If no one reviews (no
browser and no answer, or the review sits idle), stop here and report the review as pending
with its packet path: a waiting review is pending work, not a finished build.

Apply the decisions exactly as given:
- **approve:** once every item is approved and the inventory confirmed, go to the hero.
- **revise** a plate: regenerate it at the same path with the feedback.
- **revise with split** an asset: replace the region with its layers (a frame plate with a
  transparent opening, the content as its own image region at the opening's box, each
  moving part its own plate), named `<id>-frame`, `<id>-view`, `<id>-shutter-left`; re-measure
  and produce the plates.
- **revise** a plan item: change the regions file as asked, re-measure, produce new plates.
- **reclassify** a code region: change its `kind` and rewrite its `note` to describe the
  material; re-measure and produce its plate (with the asset producer when available).
- **missing:** add the region, re-measure, produce its plate if raster.

Then run the review again; unchanged decisions carry over so the user sees only what
changed. Any spec change, or a plate replaced after acceptance, needs a new round.

**Done when** the user accepted the plates and plan for the current spec.

### Phase 4: hero

1. Write the measured layout as custom properties (`--r-<id>-x/y/w/h` in % of the comp, plus
   cap height, font size, family and weight where measured) and a reference page with every
   region at its box and every plate placed (`build-phase scaffold`, or by hand). Bind the
   numbers to your own semantic structure, one element per region; the reference checks
   positions and is never the page.
2. Build only the first viewport at the comp's own dimensions, the comp's words verbatim
   (rewording is a stated decision after the hero passes), each text region sized from its
   measured cap height in its measured face, served from the project's own font files with
   `@font-face` (no hosted font stylesheet, no font data URI). Plates first: place every
   plate at its box before any text or control, capture, and check the plate regions read
   as a match while no text exists; then lay the semantic layer over them from the spec's
   palette and boxes.
3. Capture the first viewport and compare it region by region with the comp
   (`comp-diff`, or paired crops): a side-by-side, a heat map, one paired crop per region.
   Verdicts per region: **match**, **drift** (present, off in size or spacing), **missing**
   (needs its material), **contradicted** (re-derive its structure from the spec box). Read
   each text region's cap height, line count, weight, ink colour and position against the
   comp, each chrome strip's height, and the frame for ink where the comp is calm (an extra
   label, nav item or divider), and state each miss as a number ("cap height 78px built,
   103px in the comp"): the number is the edit. Open failing crops in order before editing.
   Hard blocks at any score: a missing or unreferenced plate, a contradicted plate or text
   block, an SVG illustration, a clipped plate, an organic `clip-path`, invented ink. With
   no hard block and the overall match at 72% or better, the remaining readings are
   advisories for the polish pass before responsive.
4. After three failed attempts, show the user the first-viewport review (the same review
   page, one item: the assembled first viewport beside the comp, listing every file the
   page loads) instead of iterating. Once they accept a first viewport, the overall bar and
   the numeric readings become advisories while the capture still matches it; the hard
   blocks still hold. When the capture drifts from what they accepted, restore it; that
   review is never requested again. A plate the accepted screenshot lacks is a question for
   the user; carry out their answer.

**Done when** the hero passes with no hard block, or the user accepted a first viewport and
the capture still matches it.

### Phases 5-7: sections, motion, responsive

- **Sections:** the rest of the surface inside the spec's system: the same corner
  language, line weights and palette, nothing the comp never shows. Regions the comp does
  not cover inherit the recorded system.
- **Motion:** the signature interaction, reveals and motion, orchestrated once.
- **Responsive:** the other viewports, and the first viewport at common desktop widths
  (1280 to 1600), not only at the comp's width: fluid columns, sizes in proportion to the
  viewport, so nothing the comp's first viewport shows drops below it. Capture
  `desktop.png` (1440 wide, full page) and `mobile.png` (390 wide); compare the desktop
  first viewport (1440 wide at the comp's aspect) with the comp. A displaced region is
  present but pushed down: resize what sits above it. After three failed attempts, take the
  first-viewport review route. A mobile-first surface was comped portrait.

**Done when** each phase's check is logged as passed.

## Both paths

- **The first viewport is a thesis, not a header.** Show the mechanism at once, at the
  scale the form has in life. The memory test: if someone left after one viewport, what
  would they describe an hour later? A mood means the concept has not committed.
- **Prove, don't claim.** Show the subject doing its job; author demonstration data at full
  fidelity and label it synthetic; claims stay uninventable.
- **Author the assets.** Every blank the ask left open is yours to author at production
  fidelity: names, entries, copy, covers, thumbnails, textures. Content is authorable,
  claims are labelable, no section is omittable. Gradients, glass, icon tiles and
  many-vertex `clip-path` shapes where an asset belongs are the gap wearing chrome.
- **Build the form's web leverage.** When the world names a technique (canvas, WebGL, view
  transitions, generative motion), build the technique, not a static imitation.
- **Pace the scroll.** Vary density, scale, image, motion and quiet in one grammar; a dense
  passage earns a quiet one; end on a real close. One spacing rhythm, more space above a
  heading than below it ([layout.md](../../sf-frontend-ui/references/layout.md)).
- **Real imagery when the brief implies it:** search the subject's physical object, not the
  category; one decisive photo beats five; verify every URL resolves
  ([imagery.md](../../sf-frontend-ui/references/imagery.md)).
- **Motion as material:** the form's native motion once, orchestrated; bound expensive
  effects; content visible by default
  ([motion.md](../../sf-frontend-ui/references/motion.md)).

Preserve semantics, accessibility, performance, responsiveness, project conventions and
working behaviour.

## Inspect and finish

**One batched inspection round.** Desktop and mobile on the web; on a native platform, the
shipped device classes per OS from the simulator or emulator
([ios.md](../../sf-frontend-ui/references/ios.md),
[android.md](../../sf-frontend-ui/references/android.md)); plus the user's own viewport
width when known (the width that breaks is the one they see first). On anything
interactive, drive every interaction and reachable state (open, closed, hover, focus,
error, empty, overlong content) and check each for overlap and clipping. Critique against
the request and the contract, fix material gaps in one batch, confirm with one final
round: two rounds is the ceiling, and it never closes an open gate. On comp-led, compare the
final desktop capture with the comp region by region again (never from one full-page
thumbnail). On a Persuade surface, a first-time visitor knows within seconds what this is,
why it matters and what to do.

**Valid captures.** Settle or disable entrance motion first; capture full pages from the
document top and the comp comparison at the comp's own pixel size; open every file once
and confirm it shows what its name claims: no black or blank areas, no wrong section, no
half-loaded state. Save one file per viewport in `.design/review/` (`desktop.png`,
`mobile.png`, `user-<width>.png`; native: `phone.png`, `tablet.png`, suffixed per OS on
adaptive).

After the second round the build thread stops hunting; what remains goes through the
review. On the web, if the design-check CLI is present, run its `detect --json` on the
changed targets once, fix what is mechanical and pass the rest on; without it, scan the
changed files once for the tells in
[tells.md](../../sf-frontend-ui/references/tells.md). Native platforms skip the scan: the
reviewer's floor check is their only gate.

**Finish review.** Dispatch the `design-finish-reviewer` agent
([agent](../../../agents/design-finish-reviewer.md)) fresh, with no inherited conversation:
the original request, confirmed answers, artifact path, every screenshot path (each
inspected viewport named required), the direction contract, scan findings, any quality-bar
card paths, the approved comp (or, code-led, the chosen decision comp labelled as critique
reference), on comp-led the phase log, spec and diff folders, and on native the platform
reference paths plus a line saying no scan ran. Wait with one long timeout and spend the
wait on the next independent step. Check the return has its sections; respawn once on an
empty return. Without a subagent tool, step fully out of the build, read the agent file and
run it in this session as its In-session section says, and disclose that in one line.

**Act on the disposition word**, reported verbatim:
- **recapture:** the evidence failed. Recapture what it names, then a full review.
- **rebuild:** fidelity failed wholesale. Re-derive the named regions, produce the named
  assets, then a fresh full review. Tell the user what is happening; consult them only on a
  second rebuild directive or when a rebuild would discard approved content.
- **fix:** apply the material fixes in one batch, keep the gates passing, recapture the same
  files, and return them to the same reviewer for its verdict pass (resolved, partial,
  unresolved per fix). Partial or unresolved fixes get another batch. Two rounds ends an
  unattended run; in an attended session, put the open items in front of the user and let
  them choose between shipping and another round. Stop when a round resolves nothing. The
  reviewer's list is the only list you work from.
- **ship:** report the verdict at its scope and continue to documentation.

Before any result goes back for review, check every raster the artifact ships carries its
provenance (`embed-prompt --scan`, or your script) and embed what is missing; delete only
rasters a round abandoned. Report the verdict under the reviewer's word and at its actual
scope: a verdict pass that scored three fixes supports "three fixes resolved", never "no
issues remain". When the user answers a ship with contrary evidence (their screenshot, a
named mismatch), that evidence leads a fresh full review.

**Document.** After the last correction, dispatch the `design-documenter` agent
([agent](../../../agents/design-documenter.md)) with the project root, artifact path, direction
contract, PRODUCT.md, [document.md](../consultation/document.md) and the write boundary;
without a subagent tool, run it in this session per its In-session section. A new world or
an approved system change needs a token-bearing DESIGN.md (and the `.design/design.json`
sidecar when the project keeps one); an ordinary extension compares the build with the
incumbent system, keeps its files and reports drift without repairing it unasked.

On comp-led with the CLI, record the final disposition with `build-phase finish
--disposition <word>` before the final response; any edit after the last capture voids it,
so record it again. Never record `fix` to end a run over an open gate: take the route the
gate names, or report that phase as open.

**Done when** the reviewer returned `ship` (or the user chose to ship with the open items
listed), DESIGN.md is written or confirmed, every raster carries its provenance, and the
surface brief's FINISH line is discharged. Then continue at html.md's Save step.
