# Shotgun: Visual Design Exploration

The shotgun mode of [design](SKILL.md). The designer, DESIGN SETUP, the designs
directory and the decision brief are in [SKILL.md](SKILL.md).

Design shotgun: generate multiple AI design variants, open a comparison board,
collect structured feedback, and iterate. Standalone design exploration you can
run anytime.

You are a design brainstorming partner. Generate multiple AI design variants, open them
side-by-side in the user's browser, and iterate until they approve a direction. This is
visual brainstorming, not a review process.

## When to use which mode

Shotgun **explores**: it generates variants, compares them and the user picks one.
It records the pick (`approved.json`); it leaves DESIGN.md and production code to
the modes that own them:

- **consultation** sets the design system and writes DESIGN.md.
- **direction** ([direction.md](direction.md)) runs a full art-directed build of a
  public-facing page or app screen, with dealt directions and an inspector gate.
- **html** builds production code from an approved variant.

The one source write shotgun makes is the live branch's Accept: the user accepts one
element's variant in their running app and it is made permanent in source
([shotgun/live.md](shotgun/live.md)). A whole surface built from an approved variant
is html mode.

**Designs directory.** All design artifacts go to the designs directory (the path
rule in [SKILL.md](SKILL.md)), even when they are temporary; keep them out of
`.context/` and arbitrary `/tmp/` paths.

---

Run DESIGN SETUP in [SKILL.md](SKILL.md). If `DESIGN_NOT_AVAILABLE`: skip visual
mockup generation; tell the user no image or HTML generation is available in this
session, so this mode cannot produce variants.

> **STOP.** Before writing variant concepts or design briefs (Step 3 onward) — the UX-principles doctrine governs every design direction, Read [ux-principles.md](ux-principles.md) and execute it
> in full. Do not work from memory — that section is the source of truth for this step.

## Step 0: Session Detection

Check for prior design exploration sessions for this project:

```bash
setopt +o nomatch 2>/dev/null || true
_PREV=$(find "<designs dir>/" -name "approved.json" -maxdepth 2 2>/dev/null | sort -r | head -5)
[ -n "$_PREV" ] && echo "PREVIOUS_SESSIONS_FOUND" || echo "NO_PREVIOUS_SESSIONS"
echo "$_PREV"
```

**If `PREVIOUS_SESSIONS_FOUND`:** Read each `approved.json`, display a summary, then
AskUserQuestion:

> "Previous design explorations for this project:
> - [date]: [screen] — chose variant [X], feedback: '[summary]'
>
> A) Revisit — reopen the comparison board to adjust your choices
> B) New exploration — start fresh with new or updated instructions
> C) Something else"

If A: regenerate the board from existing variant PNGs, reopen, and resume the feedback loop.
If B: proceed to Step 1.

**If `NO_PREVIOUS_SESSIONS`:** Show the first-time message:

"This is design shotgun mode — your visual brainstorming tool. I'll generate multiple AI
design directions, open them side-by-side in your browser, and you pick your favorite.
You can run `sf-design` in shotgun mode anytime during development to explore design directions for
any part of your product. Let's start."

## Step 1: Context Gathering

When shotgun mode is invoked from the `sf-plan-review` design lens, consultation mode, or another
skill, the calling skill has already gathered context. Check for `$_DESIGN_BRIEF` — if
it's set, skip to Step 2.

When run standalone, first name the **job** from the request:

- **Surface**: a whole page or screen ("explore the pricing page", "show me options
  for onboarding"). Its variants are north-star **comps**: high-fidelity images of the
  finished screen, each testing a composition.
- **Element**: a named part of a screen ("3 bolder variants of the pricing cards",
  "ideas for the hero heading"). Parse three things from the user's sentence:
  - **Count**: the number in the request; none means 3.
  - **Direction**, mapped onto the refine moves (never invent a new one): bold,
    stronger, punchier → `bolder`; quiet, calmer, softer → `quieter`; simpler, minimal,
    stripped → `distill`; refined, tightened → `polish`; font and type words →
    `typeset`; colour words → `colorize`; arrangement and spacing words → `layout`;
    device and breakpoint words → `adapt`; motion words → `animate`; playful words →
    `delight`; rule-breaking words → `overdrive`. Intent with no vocabulary word ("feel
    like a bank", "more premium") is **freeform**, the wording carried as the prompt;
    a move plus extra intent ("bolder, but keep it monochrome") is that move with the
    rest as the prompt. Wording that names no direction ("better", "improve",
    "different", "some options", bare "variants"): ask one decision brief offering the
    vocabulary (bolder, quieter, simpler, polished, typography, colour, layout, motion,
    playful, rule-breaking) and map the answer; "surprise me" or "you pick" is
    freeform with the original wording.
  - **Element description**, resolved on the page to one element (Step 3).

  For an element job the rendered page is the source of truth: ask only when the
  element does not resolve uniquely or no direction was named. A missing PRODUCT.md or
  DESIGN.md is never a reason to interview the user here; offer
  `/sf-design consultation` in one line after the session ends.

For a surface job, gather context to build a proper design brief.

**Required context (5 dimensions):**
1. **Who** — who is the design for? (persona, audience, expertise level)
2. **Job to be done** — what is the user trying to accomplish on this screen/page?
3. **What exists** — what's already in the codebase? (existing components, pages, patterns)
4. **User flow** — how do users arrive at this screen and where do they go next?
5. **Edge cases** — long names, zero results, error states, mobile, first-time vs power user

**Auto-gather first:**

```bash
cat DESIGN.md 2>/dev/null | head -80 || echo "NO_DESIGN_MD"
cat PRODUCT.md 2>/dev/null | head -120 || echo "NO_PRODUCT_MD"
```

A `PRODUCT.md` (a product-context file) answers the job-to-be-done and audience questions: confirm, do not re-ask.
Where they disagree, DESIGN.md wins on visual decisions, PRODUCT.md on durable product
and voice decisions, and the surface brief (Step 5) on this surface's strategy. If the
design-check CLI recorded in `docs/agents/tools.md` is present, its `context` verb
loads all three at once; otherwise read the files directly.

```bash
ls src/ app/ pages/ components/ 2>/dev/null | head -30
```

```bash
setopt +o nomatch 2>/dev/null || true  # zsh compat
ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
# The default work-docs folders; use the ones docs/agents/work-docs.md names when it exists.
for d in docs/specs docs/designs docs/plans docs/solutions docs/codebase; do
  ls -t "$ROOT/$d"/*.md 2>/dev/null
done | head -10
```

If DESIGN.md exists, tell the user: "I'll follow your design system in DESIGN.md by
default. If you want to go off the reservation on visual direction, just say so —
shotgun mode will follow your lead, but won't diverge by default."

**Check for a live site** (to screenshot for the "I don't like THIS" case, and to
decide the live branch in Step 3):

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "NO_LOCAL_SITE"
```

Probe the project's own dev-server URL too (from `package.json` scripts, its config or
the user's message): a busy default port usually means the app is already running.
If the user referenced a URL or said something like "I don't like how this looks,"
screenshot that page in the browser in Step 3c and generate improvement variants from that
screenshot instead of from text alone. If they didn't name the URL,
ask for it — never guess which page they mean. If a probe printed `200`, offer
that URL as the default in the AskUserQuestion below (still ask — never assume).

**AskUserQuestion with pre-filled context:** Pre-fill what you inferred from the codebase,
DESIGN.md, and any design doc the search found. Then ask for what's missing. Frame as ONE question
covering all gaps:

> "Here's what I know: [pre-filled context]. I'm missing [gaps].
> Tell me: [specific questions about the gaps].
> How many variants? (default 3, up to 7)"

Two rounds max of context gathering, then proceed with what you have and note assumptions.
Three is the default because one variant invites rubber-stamping and the spread
between three surfaces the choice worth making; the user's number wins, up to 7 on
the board (the designer's `briefs.json` limit) and 8 in the live branch.

Done when you can state the job (surface or element), the count, the five dimensions
or your stated assumption for each, and for an element job its direction and element
description.

## Step 2: Taste Memory

Read both the persistent taste profile (cross-session) AND the per-session approved
designs to bias generation toward the user's demonstrated taste. This runs by default
on every session.

**Persistent taste profile (v1 schema at `.claude/design/taste-profile.json`):**

Read it per [taste-profile.md](taste-profile.md), "Reading it".

**Per-session approved.json files (legacy, still supported):**

```bash
setopt +o nomatch 2>/dev/null || true
_TASTE=$(find "<designs dir>/" -name "approved.json" -maxdepth 2 2>/dev/null | sort -r | head -10)
```

If prior sessions exist, read each `approved.json` and extract patterns from the
approved variants; resolve each approved image per [taste-profile.md](taste-profile.md), "Resolving an approved image"
(a missing image means that image is gone: skip it, never substitute another). Merge these into the taste-profile.json-derived signal — if the
profile already says "user prefers Geist font" (from aggregated history), the
approved.json files add the specific recent approval context.

Limit to last 10 sessions. Try/catch JSON parse on each (skip corrupted files).

**Updating taste profile after a shotgun session:** When the user picks a
variant, record `approved` for the approved image path (the
`APPROVED_IMAGE` noted when approved.json is saved). When they
explicitly reject a variant, record `rejected` for that variant's path.
[taste-profile.md](taste-profile.md), "Updating it", covers schema migration from approved.json and conflict flagging.

## Step 3: Generate Variants

**Live branch.** For an element job on a web project, when the design-check CLI
recorded in `docs/agents/tools.md` is present and a dev server answers (Step 1's
probe), read [shotgun/live.md](shotgun/live.md) and follow it in place of Steps
3b-6: it plans with Step 3a and the user picks in the running app. Without the CLI or a
running dev server, or on a native project, the element's variants run on the board
below, evolved from a screenshot of the element.

Set up the output directory:

```bash
_DESIGN_DIR="<designs dir>/<screen-name>-$(date +%Y%m%d)"
mkdir -p "$_DESIGN_DIR"
echo "DESIGN_DIR: $_DESIGN_DIR"
```

Replace `<screen-name>` with a descriptive kebab-case name from the context gathering.

### Step 3a: Concept Generation

Before any generation, write N text concepts, each a distinct creative direction,
never a minor variation. Plan them in four moves, in order.

1. **Identity lock.** On an existing surface the brand is already chosen, and the
   worst outcome is N off-brand variants the user cannot accept. Read the identity,
   in priority order, from DESIGN.md's visual fields, the CSS custom properties, the
   computed styles of the target and its parent, and sibling components. Write ONE
   sentence of what is actually on screen: the dominant surface and accent colours
   (real values), the loaded font pairing, the layout topology (stacked, side-by-side,
   grid, asymmetric, overlay), the surface treatment (corners, borders, shadows,
   decoration density) and the voice read off the copy. Skip an axis rather than
   fabricate it, and name data, never an aesthetic family. A missing DESIGN.md never
   excuses this sentence; only a greenfield project (no DESIGN.md and no shipped
   screens) has no lock.
2. **Mode.** **Default** keeps the lock and varies expression within it: existing
   faces and tokens only; new fonts, hues or aesthetic signals belong to departure.
   **Departure** sets the lock aside, and runs only on the user's explicit ask in this
   request ("redesign this", "something completely different") or on a greenfield
   project; a stale critique or an old note is not an ask. Unsure means default:
   three on-brand variants with a similar feel are recoverable, three off-brand ones
   are not.
3. **Axes.** **Default:** each concept commits to a different primary axis:
   **hierarchy** (what commands the eye), **layout topology**, **typographic system**
   (pairing logic, scale ratio, case and weight within the available faces), **colour
   strategy** (which existing palette role carries the surface: restrained, committed,
   full palette, drenched), **density** (minimal, comfortable, dense), **structural
   decomposition** (merge, split, progressive disclosure). **Departure:** derive each
   concept from PRODUCT.md's brand-personality words (else the request and Step 1's
   context) through a physical, spatial or material experience that embodies them,
   written as one concrete sentence naming a real-world referent ("a museum exhibition
   label system", never "clean and minimal"); each differs from the others and from
   the current surface, and a rationale that would fit a neighbouring product is a
   reflex: replace it. For a **surface** with one committed direction, vary the
   structural uncertainty an image can resolve (what leads the screen, topology,
   sequence, density, hierarchy, focal composition, interaction framing); when the
   user shortlisted several concepts, spread the variants across them.
   An **element** job with a direction varies along that move's dimension, a different
   one per variant: `bolder` amplifies scale, saturation or structure; `quieter` pulls
   back colour, ornament or spacing; `distill` removes visual noise, redundant content
   or nested structure; `polish` refines rhythm, hierarchy or micro-detail; `typeset`
   varies scale ratio, case and weight (departure: the pairing and the ratio);
   `colorize` gives each a different existing palette role and contrast strategy
   (departure: a different hue family, chroma and contrast); `layout` changes the
   structural arrangement, never spacing tweaks; `adapt` targets a different context
   (mobile-first, tablet, desktop, print or low-data); `animate` uses a different
   motion vocabulary (cascade stagger, clip wipe, scale-and-focus, morph, parallax);
   `delight` a different flavour (micro-interaction, typographic surprise, illustrated
   accent, sonic or haptic, easter egg); `overdrive` breaks a different convention
   (scale, structure, motion, input model, state transitions). The move's own file in
   [refine/](refine/) carries its depth.
   A **freeform prompt** is the ceiling on direction: every concept honours it with a
   different reading. In default mode it narrows the axes, not the identity ("more
   confident": one amplifies hierarchy, one commits the accent, one tightens density);
   in departure it narrows the lanes, not the families ("newspaper front page":
   broadsheet, tabloid, trade journal). A prompt that collides with a DESIGN.md
   invariant or binding brand commitment keeps the invariant unless the user revokes it.
4. **Squint test** (anti-convergence). Default: hold each concept against the lock;
   drift in palette, type voice or rhetoric means it crossed into departure by
   accident, so rework it; then confirm every concept has a different primary axis
   (three "tighter density" variants is failure). Departure: label each concept with a
   concrete family of your own choosing (shared or interchangeable labels mean rework),
   then read the one-line descriptions side by side (two that rhyme mean rework). When
   the primary axis is colour or theme, the set shares no theme plus dominant hue:
   three colour worlds, not three shades. Concrete test for both: if someone could swap
   the headline text between two variants without noticing, they're too similar.
   Variants should feel like separate design teams made them, not one team on
   different days.

Present them as a lettered list, each line naming its primary axis or referent:

```
I'll explore 3 directions:

A) "Name" — one-line visual description of this direction
B) "Name" — one-line visual description of this direction
C) "Name" — one-line visual description of this direction
```

Draw on DESIGN.md, taste memory, and the user's request to make each concept distinct.

Done when N concepts are listed, each on its own axis (or family), with the identity
sentence written (or the project stated greenfield) and every concept through the
squint test.

### Step 3b: Concept Confirmation

Use AskUserQuestion to confirm before generating:

> "These are the {N} directions I'll generate. They run in parallel, so the whole set
> typically takes about 60 seconds."

Options:
- A) Generate all {N} — looks good
- B) I want to change some concepts (tell me which)
- C) Add more variants (I'll suggest additional directions)
- D) Fewer variants (tell me which to drop)

If B: incorporate feedback, re-present concepts, re-confirm. Max 2 rounds.
If C: add concepts, re-present, re-confirm.
If D: drop specified concepts, re-present, re-confirm.

### Step 3c: Parallel Generation

**If evolving from a screenshot** (user said "I don't like THIS", or an element job),
take ONE screenshot of the page the user named, in the browser ([browser.md](browser.md); PNG, the format the evolve step reads):

1. `new_page` {url: "<url>"}
2. `take_screenshot` {filePath: "$_DESIGN_DIR/current.png", format: "png", fullPage: true}
   (an element job: `take_snapshot`, then `take_screenshot` with that element's `uid`)
3. `close_page`

Then Read `$_DESIGN_DIR/current.png` so the user
sees what you're evolving from.

On an established world, a **surface** job anchors on a pixel reference too, because
DESIGN.md words alone drift where a picture does not: screenshot a representative
existing page the same way as `current.png`. The reference carries chrome, palette,
type and component character; its own content stays behind, and a banner, hero or
card lifted verbatim is the reference leaking. A variant is never the reference image
for another variant: the set would collapse into one composition.

**Write each brief** in this thread (you hold the full context and will see every
image). For a surface comp, 150 to 300 words carrying only what the image model cannot
know; a brief that pins everything down gets back a template:

1. **The surface**: the kind of screen (desktop web app, documentation page, landing
   page, native app screen) for the product by name, edge to edge with crisp readable
   text, no browser window, device or desk around it, at the surface's own viewport:
   portrait at device size for a native or mobile-first surface, desktop landscape
   otherwise.
2. **The product and the visitor's job** in plain words, with the real content that
   answers it: names, numbers with units, the offer or state, each claim at its honest
   certainty, the next action by name. Base it on the real content and the concepts
   developed with the user.
3. **What leads** this variant (summary-led, timeline-led, offer-led, reference-led:
   its axis from Step 3a) and the parts the screen holds in reading order, a phrase
   each. Show enough beyond the opening moment to prove the concept governs the whole
   surface.
4. **The frame** in one line: the product's mark and name, its navigation, its utility
   controls and the far edge, so the image is a finished screen, never a fragment; a
   screen with no navigation says so.
5. **The look**, from a picture wherever one exists: with a reference image, one
   sentence on what it contributes and nothing more about style; with reference images
   the user supplied, one sentence that they are style inspiration adapted into a
   working product, their layout and content not copied; with no picture, two to four
   sentences of concrete visual law (the ground and main colours and what each does,
   the type voices, the one signature). Sizes, positions, colours and component
   styling stay out, except a colour, face or brand element the user pinned: that is
   content, so state it.

On an established world the comps keep its palette, type voice, material, component
character, imagery stance and motion grammar fixed: no palette artifact, no new
atmosphere questions, no new type voice or motif. When the world cannot carry a
concept, return to Step 3a with a new concept, or suggest `/sf-design consultation`
for a new world. A comp is a direction test; text, responsive behaviour, accessibility,
semantics and interaction states are built later from the approved one.

**Generate every variant with the designer's `variants`.** Write one entry per
confirmed concept to `$_DESIGN_DIR/briefs.json`: a JSON array of `{"brief": "<the full
variant-specific brief>"}` objects, in concept order (A, B, C, ...), at most 7. When
evolving, add `"screenshot": "<_DESIGN_DIR>/current.png"` to every entry; those variants
use `evolve` from that screenshot. Generate the variants in parallel where the designer
allows it, each saved as `$_DESIGN_DIR/variant-{letter}.png`.

Run the quality check (`check`) on each image and regenerate once when it fails (both
images are kept). `check` judges the image against its brief and, as the shipped
screen, these four:

- **Subject present.** Point at the subject's content; an image of the world with
  nothing of the subject fails however faithful its atmosphere (the deletion usually
  rides in on an exclusion list). Regenerate with the subject's content named.
- **Mode readable.** The visitor's job and the surface's mode
  ([modes](../sf-frontend-ui/SKILL.md#modes)) read back from the image with no caption.
  Regenerate with the visitor's job as the brief's spine.
- **One dominant move.** The world enters through one lead move plus the material,
  type and spacing that support it; a second element competing with the lead at the
  same scale is the image shouting. Regenerate keeping the strongest move and quieting
  the rest (the floor's statement: [layout.md](../sf-frontend-ui/references/layout.md),
  "Persuade and Experience surfaces").
- **A screen, not a poster.** An image that could hang as a poster, or reads as a
  photograph with text on it, is not a comp; regenerate.

Never overwrite an image: a taken name is bumped (`-2`, `-3`, ...),
so use the actually saved path from here on and report every saved path. For each
variant record `saved` (every image it saved, in order; the last is its pick),
`operation`, `status`, `error`, `retryable` and `check` (`pass`, `fail` or `skipped`).

### Step 3d: Results

After the variants are generated:

<!-- design:round-accounting -->
1. Round accounting first: this round's images are exactly the saved paths (never a
   directory listing; older rounds stay on disk). Tell the user: "{saved} of {N}
   images saved in ~{actual time}", listing every saved path. A `skipped` check is missing
   automated coverage, not a pass: say so.
2. For any failures: report explicitly with the error. Do NOT silently skip. Rerun each
   failed variant with `retryable: true` once, using its own operation and its brief read
   from `briefs.json` as data: `generate` from that brief, or for a screenshot entry
   `evolve` from `$_DESIGN_DIR/current.png` with that brief, saved as
   `$_DESIGN_DIR/variant-<letter>.png` (bumped if taken).
3. If zero variants succeeded: fall back to sequential generation, running `generate`
   yourself one variant at a time into `$_DESIGN_DIR`, showing each as it lands. Tell
   the user: "Parallel generation failed (likely rate limiting). Falling back to
   sequential..." If that also saves nothing, report the failures and stop: no board.
4. Read each saved image inline (Read tool, the saved paths, workspace-relative where
   the viewer is sandboxed) so the user sees all variants at once in their terminal,
   before the board opens.
5. Proceed to Step 4 with each variant's pick (its last saved path), in letter order,
   as this round's board images.

## Step 4: Comparison Board + Feedback Loop

Create the comparison board and open it:

<!-- design:board -->
Write this round's board images (saved paths that passed checks, in order) as a JSON array to `$_DESIGN_DIR/board-images.json` with the Write tool; board letters A, B, C follow that order. Then build the board (`compare`): write `$_DESIGN_DIR/design-board.html`, a page showing those images side by side, each under its letter, and open it in the default browser.

**PRIMARY WAIT: AskUserQuestion with the board path**

Once open, wait with AskUserQuestion including the board path:

"I've opened a comparison board with the design variants:
<BOARD_PATH> — Rate them, leave comments, tell me which
elements you like and want remixed, what feels false to the product, and which variant
you prefer: approve it, combine it with another, revise it, or reject the round. If you
want new variants (different, more like B, or a remix such as layout from A and colors
from B), tell me and I'll generate them."

**The user chooses variants against the board; AskUserQuestion only waits.**

**After the user responds to AskUserQuestion:**

The reply carries this feedback shape:
```json
{
  "preferred": "A",
  "ratings": { "A": 4, "B": 3, "C": 2 },
  "comments": { "A": "Love the spacing" },
  "overall": "Go with A, bigger CTA",
  "regenerated": false
}
```

**If they chose a variant:** Read `preferred`, `ratings`, `comments` and `overall`
direction from their reply, then go to Step 5.

**If they asked to regenerate or remix:**
1. Read the regenerate action from the reply (`"different"`, `"match"`, `"more_like_B"`,
   `"remix"`, or custom text)
2. If it is a remix, read the remix spec (e.g. `{"layout":"A","colors":"B"}`)
3. Generate new variants with `iterate` or `variants` using an updated brief (do round accounting as for the first round)
4. Rebuild the board as above (it rewrites board-images.json)
5. Reload the board in the user's browser (same tab)
6. **AskUserQuestion again** with the same board path to
   wait for the next round of feedback. Repeat until the user chooses a variant.

**BOARD FALLBACK:** If the board cannot be opened: show each variant inline using the Read tool (so the user can see them),
then use AskUserQuestion:
"The comparison board could not be opened. I've shown the variants above.
Which do you prefer? Any feedback?"
The variants count as shown only where images render; a text-only surface is not a
display.

## Step 5: Approval

This is the round's one approval point, and it has no skip condition: nothing is
built from a variant until the user approves it or explicitly delegates the choice. A
structured simulated user counts as the user and gets the same question.

Output a clear summary confirming what was understood:

"Here's what I understood from your feedback:

PREFERRED: Variant [X]
RATINGS: A: 4/5, B: 3/5, C: 2/5
YOUR NOTES: [full text of per-variant and overall comments]
DIRECTION: [regenerate action if any]

Is this right?"

Use AskUserQuestion to confirm before saving. When the question tool errors, ask the
same in prose (SKILL.md, "Prose fallback"); only when both fail, or the user says
"you pick", is the choice delegated: choose from the brief, PRODUCT.md and DESIGN.md,
state that evidence, record it exactly as an approval with `"delegated": true`, and
disclose it in your next reply, not your last. Approval refines this surface's brief;
DESIGN.md stays as it is.

**Save the approved choice.** Map the confirmed letter through this board's `board-images.json` (never the directory listing) and write `$_DESIGN_DIR/approved.json` with `approved_variant`, `approved_path` (that image's file name), `feedback` (the user's feedback, `none` when they gave none), `date`, `screen` and `branch` (`git branch --show-current`), plus `delegated` when it applies; that image's path is `APPROVED_IMAGE`. If the letter is not on this board, say `NO_BOARD_IMAGE: <VARIANT> is not on this board` and reselect from the board.

**Surface job:** also record the approved comp in the **surface brief**, the note of
this surface's strategy: add `Approved comp: <APPROVED_IMAGE>` to it, with one line on
the composition and the parts of the comp that must not be literalized. The surface
brief is the one the design-check CLI's `context` verb reports when the CLI is
present; otherwise `$_DESIGN_DIR/surface-brief.md` (create it with the surface, the
visitor's job and what leads). The `design-finish-reviewer` treats comps with no
recorded approval as a material finding.

Done when `approved.json` exists in `$_DESIGN_DIR` naming an image on this board, and
for a surface job the surface brief carries the `Approved comp:` line.

## Step 6: Next Steps

If invoked from another skill: return the structured feedback for that skill to consume.
The calling skill reads `approved.json` and resolves the approved image per
[taste-profile.md](taste-profile.md), "Resolving an approved image".

If standalone, offer next steps via AskUserQuestion:

> "Design direction locked in. What's next?
> A) Iterate more — refine the approved variant with specific feedback
> B) Finalize — generate production Pretext-native HTML/CSS with `sf-design` in html mode
> C) Save to plan — add this as an approved mockup reference in the current plan
> D) Done — I'll use this later"
