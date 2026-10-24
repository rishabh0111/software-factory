# Design lens

The Design lens of [sf-plan-review](SKILL.md). Review the plan as a senior product
designer: find the missing design decisions and add them to the plan before
implementation. The output is a better plan, not a document about the plan. Run it
inside the skill's method: target, plan file, base branch, shared context, decision
procedure, TODOs, outputs and exit gate all come from [SKILL.md](SKILL.md).

Posture: opinionated and collaborative. Find every gap, say why it matters, recommend a
concrete fix, and get its own decision before editing the plan. When first copying the
plan into the plan file, keep existing requirements and record unapproved gaps as
pending; a gap-to-token mapping is a proposed fix, and a score rises only after the fix
is approved.

## Design principles

Every recommendation names the principle it serves:

1. **Empty states are features.** "No items found." is not a design; every empty state
   needs warmth, a primary action and context.
2. **Every screen has a hierarchy.** What does the user see first, second, third? If
   everything competes, nothing wins.
3. **Specificity over vibes.** "Clean, modern UI" is not a decision. Name the font, the
   spacing scale, the interaction pattern.
4. **Edge cases are user experiences.** 47-character names, zero results, error states,
   first-time vs power user.
5. **AI slop is the enemy.** Generic card grids, hero sections, 3-column features: if it
   looks like every other generated site, it fails.
6. **Responsive is not "stacked on mobile".** Each viewport gets intentional design.
7. **Accessibility is not optional.** Keyboard, screen readers, contrast, touch targets:
   specified in the plan or they won't exist.
8. **Subtraction default.** An element that doesn't earn its pixels is cut.
9. **Trust is earned at the pixel level.** Every decision builds or erodes trust.

## How great designers see

Perceptual instincts, running automatically as you review:

1. **The system, not the screen:** what comes before, after, and when things break.
2. **Empathy as simulation:** bad signal, one hand free, boss watching, first time vs
   the 1000th.
3. **Hierarchy as service:** respecting the user's time, not prettifying pixels.
4. **Constraint worship:** "If I can only show 3 things, which 3 matter most?"
5. **The question reflex:** questions before opinions. Who is this for? What did they
   try before?
6. **Edge-case paranoia:** a 47-character name, zero results, a failed network,
   colorblindness, RTL.
7. **"Would I notice?":** invisible is perfect.
8. **Principled taste:** "this feels wrong" traces to a broken principle; taste is
   debuggable (Zhuo).
9. **Subtraction:** "as little design as possible" (Rams); "subtract the obvious, add
   the meaningful" (Maeda).
10. **Time horizons:** the first 5 seconds (visceral), 5 minutes (behavioral), the
    5-year relationship (reflective), all at once (Norman).
11. **Design for trust:** pixel-level intentionality about safety, identity and
    belonging (Gebbia).
12. **Storyboard the journey:** every moment is a scene with a mood, not just a screen
    with a layout (Gebbia).

Key references: Rams' 10 principles, Norman's 3 levels, Nielsen's 10 heuristics, the
Gestalt principles, Krug (the 3-second scan, the trunk test, satisficing, the goodwill
reservoir), Redish (writing for scanning), Jarrett (forms that work), Ive ("People can
sense care and can sense carelessness"). Never say "this feels off" without naming the
broken principle; apply subtraction before suggesting additions.

## How users actually behave

Observed behavior, not preferences:

- **Don't make me think.** Self-evident beats self-explanatory beats explained.
- **Clicks don't matter, thinking does.** Three mindless clicks beat one that needs
  thought.
- **Omit, then omit again.** Cut half the words, then half the rest. Happy talk and
  instructions must die.
- **Users scan, they don't read:** prominence = importance, clearly defined areas,
  headings, highlighted key terms. Billboards at 60 mph, not brochures.
- **Users satisfice:** they pick the first reasonable option, so make the right choice
  the most visible one.
- **Users muddle through** and stick with whatever worked, however badly.
- **Users don't read instructions:** guidance is brief, timely and unavoidable.
- **Use conventions** (logo top-left, nav top or left, magnifying-glass search);
  innovate only when you know the idea is better.
- **Visual hierarchy:** related things grouped, nested things contained, more important
  more prominent. Everything is noise until proven otherwise.
- **Clickable things look clickable** without hover, especially on mobile.
- **Eliminate noise** (shouting, disorganization, clutter) by removal, not addition.
- **Clarity beats consistency** when the two conflict.
- **Navigation is wayfinding:** what site, what page, what sections, what options here,
  where am I, how do I search. Persistent nav, breadcrumbs for depth, current section
  marked. The trunk test: cover everything but the nav and you still know all of that.
- **The goodwill reservoir.** It drains when you hide what users want (pricing,
  contact, shipping), punish them for not doing it your way, ask for needless
  information, put sizzle in the way (splash screens, forced tours, interstitials), or
  look sloppy. It refills when you make the main task obvious, say what they want to
  know up front, save steps, make errors recoverable, and apologize when in doubt.
- **Mobile, same rules, higher stakes:** visible affordances, 44px touch targets, no
  hover-to-discover; things needed in a hurry close at hand.

## Pre-review

After the shared context: map the UI scope (pages, components, interactions), whether
DESIGN.md exists (if not, that is a gap), existing design patterns to align with, and
prior design reviews in the report. Retrospective: for areas flagged in earlier design
cycles, say in that pass whether the issue recurs or was only partly fixed.

**UI scope gate.** If the plan has none of new screens or pages, changes to existing UI,
user-facing interactions, frontend framework changes or design system changes, say
"This plan has no UI scope. A design review isn't applicable." and end this lens.

**The designer.** Read `docs/agents/tools.md`: a recorded image-generation tool, or HTML
authoring plus a browser that can render a page and capture a screenshot (the recorded
headless browser CLI, else the chrome-devtools MCP). Either means `DESIGN_READY`;
neither means `DESIGN_NOT_AVAILABLE`, and mockups are skipped (they are an
enhancement, not a requirement). Operations: `generate` (one mockup), `variants`
(several directions), `compare` (side-by-side board), `iterate` (refine with feedback),
`check` (judge an image against its brief), `evolve` (improve from a screenshot).

Designer rules: images never overwrite (a taken name becomes `-2`), so each round
records how many were `requested`, which were `saved` (their paths) and every `failures`
entry, and later steps use only saved paths. Briefs and feedback are free text written
to files in the design directory with the file-write tool, never inline in a shell
command. Design artifacts live in a `designs/` directory beside the plan file and stay
there (the Approved Mockups table links into it); they are user files, not application
source, so generating them is allowed in plan mode.

## Step 0: Design scope assessment

- **0A. Initial rating.** Rate overall design completeness 0-10 and say what a 10 looks
  like for this plan ("a 3/10: it describes what the backend does but never what the
  user sees"; "a 7/10: good interactions, missing empty, error and responsive states").
- **0B. DESIGN.md status.** Present: "All design decisions will be calibrated against
  your stated design system." Absent: "No design system found. Recommend `/sf-design`
  consultation first. Proceeding with universal design principles."
- **0C. Existing leverage.** The UI patterns, components and decisions this plan should
  reuse.
- **0D. Focus.** Ask (admin): "I've rated this plan {N}/10 on design completeness. The
  biggest gaps are {X, Y, Z}. I'll generate visual mockups next, then review all 7
  dimensions. Want me to focus on specific areas instead?" Stop for the answer.

## Step 0.5: Visual mockups

With UI scope and `DESIGN_READY`, generate mockups without asking: "Generating visual
mockups with the designer. This is how we review design — real visuals, not text
descriptions." Skip only when `DESIGN_NOT_AVAILABLE`, when the first generation fails
before producing an image (a missing API key counts the same), or when the user says
"skip mockups" or "text only". Without the designer: "No image or HTML generation is
available in this session, so visual mockups are off. Proceeding with text-only
review." and go to the passes.

```bash
_DESIGN_DIR="$(dirname "<plan file>")/designs/<screen-name>-$(date +%Y%m%d)"
mkdir -p "$_DESIGN_DIR"
```

`<screen-name>` is descriptive kebab-case (`settings-page`, `onboarding-flow`). One
screen at a time: write its brief from the plan (and DESIGN.md) to
`$_DESIGN_DIR/brief-<screen-name>.md`, generate 3 `variants`, and do round accounting
(nothing saved: report the failures and stop, no check, no board). `check` each saved
image against the brief (view it yourself, or hand both to a subagent that can view
images); flag failures and offer to regenerate them.

**The board is the chooser.** Write the saved, passing paths in order as a JSON array to
`$_DESIGN_DIR/board-images.json` (letters A, B, C follow that order), build
`$_DESIGN_DIR/design-board.html` with `compare` (the images side by side, each under its
letter) and open it (`open file://...` on macOS, `xdg-open` elsewhere). Then wait with
one AskUserQuestion carrying the board path: "I've opened a comparison board with the
design variants: <BOARD_PATH>. Rate them, leave comments, tell me which elements you like
and want remixed, and which variant you prefer. If you want new variants (different,
more like B, or a remix such as layout from A and colors from B), tell me and I'll
generate them." Never show variants inline and ask which one the user prefers.

- **They chose:** read the preferred variant, ratings, comments and overall direction
  from the reply.
- **They asked for more:** read the action (`different`, `match`, `more_like_B`,
  `remix` with its spec such as `{"layout":"A","colors":"B"}`, or free text), generate
  with `iterate` or `variants` from an updated brief, account for the round, rebuild the
  board (rewriting `board-images.json`), reload it in the same tab and wait again.
- **The board cannot open:** show each variant with Read, then ask "The comparison board
  could not be opened. I've shown the variants above. Which do you prefer? Any feedback?"

Confirm what you understood ("PREFERRED: Variant X / RATINGS / YOUR NOTES / DIRECTION —
is this right?") with one question; never re-ask which variant they picked. Then map the
confirmed letter through this board's `board-images.json` (never a directory listing)
and write `$_DESIGN_DIR/approved.json` with `approved_variant`, `approved_path`,
`feedback` (`none` when none), `date`, `screen` and `branch`. A letter not on this board
gets `NO_BOARD_IMAGE: <VARIANT> is not on this board` and a reselection. The approved
direction is the visual reference for every pass. When the user asked for several
variant sets or screens, each gets its own subdirectory and board, all chosen before the
passes start.

## Design outside voices

Ask (admin): "Want outside design voices before the detailed review? One subagent
evaluates against the design hard rules and litmus checks; another does an independent
completeness review." **A)** Yes **B)** No. On B, record `skipped` and continue.

On A, run both as independent, blocking subagents (overlap them when the host allows;
a launch receipt means it went to the background, so wait for its completion notice),
each given the actual plan and relevant source, not only paths. Ask each for a severity
per finding (P0–P3) and a final `Recommendation: <action> because <reason>` line, with a
reason when there are no findings.

1. **Hard-rules voice:** "Read the plan at [path]. Classify each surface as PERSUADE,
   OPERATE, READ, EXPERIENCE or HYBRID, then evaluate it against the hard rejections,
   litmus checks and rule set in Pass 4 below [paste them]. For each finding: what's
   wrong, what happens if it ships, the specific fix. Be opinionated. No hedging."
2. **Completeness voice:** "Read the plan at [path]. You are an independent senior
   product designer who has not seen any prior review. Evaluate information hierarchy
   (what the user sees first, second, third), missing states (loading, empty, error,
   success, partial), the user journey and where its emotional arc breaks, specificity
   ('48px Söhne Bold header, #1a1a1a on white' vs 'clean modern card-based layout'), and
   the decisions that will haunt the implementer if left ambiguous. For each: what's
   wrong, severity, the fix."

A refusal, empty or malformed output, or a missing severity or Recommendation makes that
voice unavailable; continue with the other, tagged `[single-voice]`; both failing gives
"Outside voices unavailable — continuing with primary review." Show the outputs under
`HARD-RULES VOICE (design critique):` and `COMPLETENESS VOICE (design completeness):`,
then the scorecard:

```
DESIGN OUTSIDE VOICES — LITMUS SCORECARD
  Check                                    Compl.  Rules  Consensus
  1. Brand unmistakable in first screen?   —       —      —
  2. One strong visual anchor?             —       —      —
  3. Scannable by headlines only?          —       —      —
  4. Each section has one job?             —       —      —
  5. Cards actually necessary?             —       —      —
  6. Motion improves hierarchy?            —       —      —
  7. Premium without decorative shadows?   —       —      —
  Hard rejections triggered:               —       —      —
```

CONFIRMED = both agree, DISAGREE = they differ, NOT SPEC'D = not enough to judge. Hard
rejections open Pass 1 tagged `[HARD REJECTION]`; DISAGREE items go to their pass with
both views; CONFIRMED failures are pre-loaded as known issues in their pass. Every voice
finding still goes through the decision procedure. Record the result in the report's
Outside Review row and OUTSIDE COVERAGE line: `clean` (completed, no findings),
`issues_found`, `unavailable` or `skipped`.

## The rating method

Each of Passes 1–6:

1. Rate 0-10: "Information Architecture: 4/10".
2. Name the gap: "a 4 because the plan defines no content hierarchy; a 10 has primary,
   secondary and tertiary for every screen".
3. Recommend the concrete fix and its alternatives (2-3 options, each with the effort to
   specify now and the risk if deferred), tied to a design principle.
4. Resolve it through the decision procedure: one issue per question.
5. Apply only the chosen fix to every affected plan reference (including matching
   established DESIGN.md tokens), then re-rate with the reason: "Now 8/10 — still
   missing mobile nav hierarchy".
6. Repeat per unresolved issue until 10 or the user says "good enough, move on".

A declined fix stays documented and keeps the score below 10. A gap already listed in
the input plan is still an unresolved finding: knowing its cause or the matching token
does not approve the change. An exact decision already made carries across passes:
apply it everywhere it reaches without asking again, and reopen it only when new
evidence exposes an unresolved requirement or tradeoff. A faithful restatement of an
existing or approved contract (a wireframe of the unchanged layout, the accepted journey
rendered as the required storyboard) is evidence, recorded directly; ask only if
producing it would introduce or change a decision. An explicitly excluded artifact is
not a missing requirement: assess the same dimension with permitted evidence. On a
re-run of this lens, sections rated 8+ get a quick pass and those below 8 full treatment.

**Show what 10/10 looks like.** With `DESIGN_READY` and a pass below 7, offer a mockup of
the improved version: write the 10/10 description to a brief in
`"$(dirname "<plan file>")/designs/ideal-$(date +%Y%m%d)"`, `generate` one image
`ideal-<dimension>.png`, and show the saved file with Read (nothing saved: report the
failures and continue in text).

## Review passes

### Pass 1: Information architecture

Rate: does the plan define what the user sees first, second, third? To 10: add the
information hierarchy, with an ASCII diagram of screen structure and navigation flow.
Apply constraint worship: if only 3 things can show, which 3?

### Pass 2: Interaction state coverage

Rate: does the plan specify loading, empty, error, success and partial states? To 10:
add the state table, describing what the user sees, not backend behavior. Empty states
get warmth, a primary action and context.

```
  FEATURE              | LOADING | EMPTY | ERROR | SUCCESS | PARTIAL
  ---------------------|---------|-------|-------|---------|--------
  [each UI feature]    | [spec]  | [spec]| [spec]| [spec]  | [spec]
```

### Pass 3: User journey and emotional arc

Rate: does the plan consider the user's emotional experience? To 10: render the accepted
journey as the required storyboard (no question needed to create it), applying the 5
second / 5 minute / 5 year horizons:

```
  STEP | USER DOES        | USER FEELS      | PLAN SPECIFIES?
  -----|------------------|-----------------|----------------
  1    | Lands on page    | [what emotion?] | [what supports it?]
```

### Pass 4: AI slop risk

Rate: does the plan describe specific, intentional UI or generic patterns? Record each
hard-rejection hit and each litmus YES/NO with evidence (plan text, approved mockups,
referenced contracts; pixels or computed values when a rendered surface exists). An
unresolved hard rejection caps this pass below 8; litmus answers support findings, not a
separate score.

**Classify the surface first.** The mode is what the visitor's win looks like on this
surface, not what the product is: a dev tool's landing page is Persuade; a fashion
house's docs are Read.

- **PERSUADE** (marketing, landing, pricing, campaigns): they decide and act; design is
  the product. Landing rules.
- **OPERATE** (dashboards, admin, settings, editors, tools): they finish a task;
  scanability and native expectations beat expression. App UI rules.
- **READ** (docs, articles, guides, changelogs): they understand something. Read rules.
- **EXPERIENCE** (portfolios, galleries, showcases): the work owns the first viewport.
  Experience rules.
- **HYBRID:** classify per section, not per page.

**Hard rejections** (flag any):
1. Generic SaaS card grid as the first impression
2. Beautiful image with a weak brand
3. Strong headline with no clear action
4. Busy imagery behind text
5. Sections repeating the same mood statement
6. Carousel with no narrative purpose
7. App UI made of stacked cards instead of layout

**Litmus checks** (YES/NO with evidence; compare with the voices' scorecard):
1. Brand or product unmistakable in the first screen?
2. One strong visual anchor present?
3. Understandable by scanning headlines only?
4. Each section has one job?
5. Are the cards actually necessary?
6. Does motion improve hierarchy or atmosphere?
7. Would it feel premium with all decorative shadows removed?

**Landing rules** (PERSUADE):
- The first viewport reads as one composition, not a dashboard; poster in stance, not in
  type size (display stays under 6rem).
- Brand-first hierarchy: brand > headline > body > CTA; the brand is the loudest text.
- Expressive, purposeful typography, never a default stack (Inter, Roboto, Arial,
  system); two text faces at most, plus a mono for data and code.
- No flat single-color background by default: texture from the brand or a real asset,
  never a halo, spotlight, stripe or grid-paper gradient.
- Hero: full-bleed, edge to edge, no inset, tiled or rounded variants. Budget: brand,
  one headline, one supporting sentence, one CTA group, one image. No cards in the hero.
- One job per section: one purpose, one headline, one short supporting sentence.
- Motion: one authored moment on the first viewport (an entrance or a scroll-linked
  reveal), ease-out from a visible default; hover states only where they carry
  information.
- Color: CSS variables, one accent by default, no purple-on-white defaults.
- Copy in product language, not design commentary.

**App UI rules** (OPERATE):
- Calm surface hierarchy, strong typography, few colors; dense but readable, minimal
  chrome.
- Organize: primary workspace, navigation, secondary context, one accent.
- Avoid dashboard-card mosaics, thick borders, decorative gradients, ornamental icons.
- Utility copy: orientation, status, action; not mood or aspiration.
- Section headings state what the area is or what the user can do ("Selected KPIs",
  "Plan status").

**Read rules** (READ):
- Measure 65-75ch, one reading column, headings closer to what follows than to what
  precedes.
- Wayfinding is a feature: where am I, what is next, where do I search.
- A docs index is Read, not Persuade: no hero, no CTA theater.

**Experience rules** (EXPERIENCE):
- The work fills the first viewport; chrome earns every pixel.
- One authored transition, not a scroll-jacked tour.
- Never crop the artifact to fit a template.

**Universal rules:**
- A CSS-variable color system.
- No default font stack as the display voice (Inter, Roboto, Arial, system); DM Sans,
  Instrument Sans or IBM Plex Sans are fine for body and UI on an Operate or Read surface
  when the proposal assigns that role.
- One job per section. If deleting 30% of the copy improves it, keep deleting.
- Cards earn their existence: no decorative card grids; cards only when the card is the
  interaction.
- Body text at least 16px and 4.5:1 contrast.
- Visible labels: a placeholder is never the only label.
- Visited links look different from unvisited ones.
- A heading sits closer to the section it introduces than to the one before it.

**Reflexes no detector catches** (check by hand, every time):
- **Browser surfaces carry the design.** Selection color, caret, scrollbars, focus
  rings, underline offset and tabular numerals ship with browser defaults; theme them
  from the palette. The cheapest tell of an assembled page, and the one most often
  skipped.
- **One authored motion moment,** exponential ease-out from an already-visible default;
  content never waits on animation timing.
- **Depth has an offset:** offset plus soft blur. A zero-offset colored halo is
  decoration.
- **Secondary text on a colored surface is tinted from that hue,** never gray.
- **More space above a heading than below it;** read the computed values.
- **Light or dark comes from the use scene** (who, where, under what light), never the
  category.

**Calibration: the three looks.** Generated interfaces land in one of three looks
whatever the product: (1) cream ground, high-contrast serif display, terracotta or
signal-red accent; (2) near-black, one neon accent, glowing edges; (3) broadsheet
hairlines, italic display serif, tiny tracked mono labels. Each is fine when the brief
asks for it. If the brief left the look open and the plan landed in one anyway, the
looking stopped. Test: could someone guess the look from the category alone, or from
"the category, but avoiding the obvious"? Then start over. "It's about books, so cream
and a serif" fails; book cloth comes in every saturated color there is.

**The slop blacklist:**
1. Purple, violet or indigo gradient backgrounds; blue-to-purple schemes.
2. The 3-column feature grid: icon in a colored circle, bold title, 2-line description,
   repeated 3x. The most recognizable generated layout.
3. Icons in colored circles as section decoration.
4. Everything centered.
5. One large border-radius on every element.
6. Decorative blobs, floating circles, wavy SVG dividers (an empty section needs better
   content, not decoration).
7. Emoji as design elements.
8. A colored left border on cards.
9. Generic hero copy ("Welcome to [X]", "Unlock the power of...", "Your all-in-one
   solution for...").
10. Cookie-cutter rhythm: hero → 3 features → testimonials → pricing → CTA, every section
    the same height.
11. `system-ui` or `-apple-system` as the primary display or body font.

Rule ids a finding may cite as `[rule-id]`: border-accent-on-rounded, overused-font,
flat-type-hierarchy, gradient-text, cream-palette, nested-cards, monotonous-spacing,
bounce-easing, pulsing-dot, blinking-cursor, shape-assembled-illustration, dark-glow,
radial-halo, radial-spotlight-glow, marquee (logo marquee), icon-tile-stack (an icon tile
above every heading), italic-serif-display, hero-eyebrow-chip, kicker-above-heading,
numbered-section-labels, em-dash-overuse, marketing-buzzword, aphoristic-cadence,
oversized-h1, extreme-negative-tracking, thin-border-wide-shadow,
repeating-stripes-gradient, grid-paper-background, theater-slop-phrase,
image-hover-transform. Judgment tells with no rule id: gradient CTA button, stock-photo
hero, cards as the default component, a generic testimonial section, left-text
right-image hero, generic CTA labels, the hero-metric template, identical card grids,
glassmorphism, hand-drawn SVG illustration, modal by default, monospace as costume,
content stand-ins, a mode picked by category, unthemed browser surfaces, missing states.

To 10: rewrite vague UI descriptions with specific alternatives. "Cards with icons":
what sets these apart from every SaaS template? "Hero section": what makes it feel like
this product? "Clean, modern UI": meaningless, replace it with decisions. "Dashboard with
widgets": what makes it not every other dashboard? Read each Step 0.5 mockup and judge it
against the blacklist; a generic one is flagged with an offer to `iterate` with more
specific direction (feedback in a file; later views use its newly saved path).

### Pass 5: Design system alignment

Rate: does the plan align with DESIGN.md? Without one, rate the plan's explicit token
and component specifications; missing ones are findings. To 10: annotate the plan with
specific tokens and components; when DESIGN.md has YAML front matter, cite tokens by
path (`{colors.primary}`, `{rounded.md}`) so plan and file share one vocabulary. No
DESIGN.md: flag the gap and recommend `/sf-design` consultation. Flag any new component
that does not fit the existing vocabulary. A token alignment an earlier pass already
approved is applied, not asked again; an unapproved violation still needs its first
decision.

### Pass 6: Responsive and accessibility

Rate: does the plan specify mobile and tablet, keyboard navigation, screen readers? To
10: responsive specs per viewport (intentional layout changes, not "stacked on mobile"),
keyboard patterns, ARIA landmarks, 44px touch targets, contrast requirements.

### Pass 7: Unresolved design decisions

The unscored decision register. Start from choices left open in earlier passes. Each new
item cites a real in-scope element and the decision it lacks in the plan, source,
DESIGN.md or an approved mockup; a page name or an outside suggestion does not prove a
control exists. When existence is unknown, keep the item conditional and say what to
verify. Accepted user-facing outcomes stay accepted; choosing implementation mechanics
does not reopen them.

```
  DECISION NEEDED                  | IF DEFERRED, WHAT HAPPENS
  ---------------------------------|---------------------------
  What does the empty state look like? | Engineer ships "No items found."
  Mobile nav pattern?              | Desktop nav hides behind a hamburger
```

Use approved mockups as evidence: "Your approved mockup shows a sidebar nav, but the plan
doesn't say what happens to it at 375px." One question per decision; edit the plan as
each is made.

### After the passes

If mockups were generated and the passes changed significant decisions (an IA
restructure, new states, layout changes), offer once: "The review passes changed [list].
Want me to regenerate mockups to match the updated plan?" On yes, `iterate` or
`variants` from a feedback or brief file into the same `$_DESIGN_DIR`, with round
accounting and a rebuilt board.

## TODOs in this lens

Design debt: missing accessibility, unresolved responsive behavior, deferred empty
states.

## Lens outputs

- **Approved Mockups** (only if mockups were generated):

  ```
  ## Approved Mockups

  | Screen/Section | Mockup Path | Direction | Notes |
  |----------------|-------------|-----------|-------|
  | [screen name]  | [absolute $_DESIGN_DIR]/[filename].png | [one-line direction] | [constraints from review] |
  ```

  The implementer builds from these paths; they persist across sessions.
- **Design Review Completion Summary**, as its own `## Design Review Completion Summary`
  section above the terminal report (never inside it), replacing this review's earlier
  one: the box below, the deferred list and the unresolved decisions. The overall score
  is the lowest of Passes 1–6, before and after approved fixes; Pass 7 is unscored and
  Step 0's impression keeps its own row. "Decisions made" counts only individually
  approved new decisions.

```
  +====================================================================+
  |         DESIGN PLAN REVIEW — COMPLETION SUMMARY                    |
  +====================================================================+
  | System audit         | [DESIGN.md status, UI scope]                |
  | Step 0               | [initial rating, focus areas]               |
  | Pass 1  (Info Arch)  | ___/10 → ___/10 after fixes                 |
  | Pass 2  (States)     | ___/10 → ___/10 after fixes                 |
  | Pass 3  (Journey)    | ___/10 → ___/10 after fixes                 |
  | Pass 4  (AI Slop)    | ___/10 → ___/10 after fixes                 |
  | Pass 5  (Design Sys) | ___/10 → ___/10 after fixes                 |
  | Pass 6  (Responsive) | ___/10 → ___/10 after fixes                 |
  | Pass 7  (Decisions)  | ___ resolved, ___ deferred                  |
  +--------------------------------------------------------------------+
  | NOT in scope         | written (___ items)                         |
  | What already exists  | written                                     |
  | TODOS.md updates     | ___ items proposed                          |
  | Approved Mockups     | ___ generated, ___ approved                 |
  | Decisions made       | ___ added to plan                           |
  | Decisions deferred   | ___ (listed below)                          |
  | Overall design score | ___/10 → ___/10                             |
  +====================================================================+
```

After read-back: all passes 8+ → "Plan is design-complete. Run the Design lens again
after implementation for visual QA." Any below 8 → name what is unresolved and why.

## Report row

- **Fields:** `status`, `initial_score`, `overall_score`, `unresolved`,
  `decisions_made`, `commit`, timestamp in ISO 8601.
- **Status:** `clean` with an overall score of 8+ and 0 unresolved; otherwise
  `issues_open`.
- **Findings cell:** "score: {initial_score}/10 → {overall_score}/10, {decisions_made}
  decisions".

## Next steps

- **Engineering lens:** the required gate. Stress it when this review added interaction
  specs, new flows or changed the IA; flag an Eng row that predates this review.
- **CEO lens:** only for fundamental product gaps (initial score below 4, major IA
  structure problems, or doubt about the problem itself) and no CEO row yet. Most design
  reviews should not trigger it.
- **`/sf-design`** shotgun mode to explore new visual directions for issues found, or
  html mode to turn approved mockups into working HTML. These produce design artifacts,
  not application code.

Ask, always including E: **A)** Run the Engineering lens next (required gate) **B)** Run
the CEO lens **C)** Suggest `/sf-design` shotgun to explore variants **D)** Suggest
`/sf-design` html from the approved mockups **E)** Skip — I'll handle next steps
manually. Both lenses needed: Engineering first.
