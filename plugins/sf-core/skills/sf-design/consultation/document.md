# Consultation: record the incumbent system

The record job of [consultation](../consultation.md): write DESIGN.md from the design system the
code already has, so new screens stay on it. The designer, DESIGN SETUP, the designs directory and
the decision brief are in [SKILL.md](../SKILL.md). The file it writes takes the
[DESIGN.md format](design-md-format.md).

Run it when the code has a coherent visual system and no DESIGN.md; when a first implementation is
built and its seed DESIGN.md needs real tokens; when DESIGN.md has drifted from the code; or before a
large redesign, to keep the current state as a reference. You are a _recorder_: the file states what
the code repeatedly does, confirmed with the user.

## Step 1: Read what exists

Run the Phase 0 DESIGN.md check in [consultation.md](../consultation.md) (it reads and classifies
the file; this job writes nothing until Step 6). If the design-check CLI recorded in
`docs/agents/tools.md` is present, run its `context` verb to load PRODUCT.md and DESIGN.md;
otherwise read them directly. PRODUCT.md, when present, gives the brand personality used in Step 4.

With an existing DESIGN.md, show it and ask one decision brief: **Refresh** (recommended: re-scan,
update drifted values, keep every confirmed decision), **Merge** (add what the scan finds that the
file lacks, change nothing it states), **Replace** (back up to `DESIGN.md.bak`, write anew), or
**Cancel**. Every path but Replace keeps the confirmed decisions: Decisions Log rows, user-chosen
names, Named Rules, Do's and Don'ts; a scan that contradicts one becomes a question in Step 5, never
a silent edit. A kept-legacy or unknown-format file keeps its own shape, as Phase 0 says.

Done when: the existing file's state and the user's choice are recorded, or the user cancelled.

## Step 2: Scan the code

Search in this order and record each value with its name, its file and how many places use it:

1. **CSS custom properties:** declarations of `--color-`, `--font-`, `--spacing-`, `--radius-`,
   `--shadow-`, `--ease-`, `--duration-` (and the project's own prefixes) in stylesheets such as
   `src/styles/`, `public/css/`, `app/globals.css`.
2. **Utility-framework config:** a `tailwind.config.{js,ts,mjs}` `theme.extend` block (colors,
   fontFamily, spacing, borderRadius, boxShadow), or the equivalent.
3. **CSS-in-JS themes:** `theme.ts`, `tokens.ts` or the equivalent for styled-components, emotion,
   vanilla-extract, stitches.
4. **Token files:** `tokens.json`, `design-tokens.json`, Style Dictionary output, W3C design-token
   format.
5. **Components:** the main button, card, input, navigation and dialog components, with their
   variant APIs and default styles.
6. **The global stylesheet:** base typography and colour assignments.
7. **The rendered site** (optional): run BROWSER SETUP in [browser.md](../browser.md); if `READY`,
   open the running app in your own tab and read computed styles (`get_css_styles`, or
   `getComputedStyle` via `evaluate_script`) from `body`, `h1`-`h3`, `a`, `button`, a card and an
   input. This catches values the tokens miss and gives the type ramp **as used**: the sizes,
   weights and line heights actually rendered, not the ones declared.

If the scan finds no tokens, no components and no rendered site, there is nothing to record: offer
the propose job (consultation's phases) in a decision brief; the user picks. An explicit request to
replace a coherent incumbent identity is the propose job too, through Phase 0's **Start fresh**.

Done when: every source above was searched (or noted absent) and each value carries a use count.

## Step 3: Draft the tokens

Keep **durable, reused rules only**: a value used in one place is a one-off and stays out; a value
repeated with one intent is the system. Then build the draft in the format's front matter and
sections:

- **Colors:** group by role, Primary / Secondary / Tertiary / Neutral, plus Status if used. One accent
  is Primary + Neutral; leave Secondary and Tertiary out rather than invent them. Keep the project's
  canonical colour space.
- **Typography:** map the observed ramp onto display / headline / title / body / label (and mono);
  note the families with fallbacks and the scale ratio.
- **Elevation & Depth:** the shadow vocabulary, or "flat, tonal layering" stated as the answer.
- **Components:** per common component (button, card, input, chip, list item, tooltip, navigation):
  radius, colour assignment, padding, hover and focus treatment, every state it reaches.
- **Layout:** grid, container, breakpoints, spacing rhythm, density. **Shapes:** radius, corners,
  borders, clipping, recurring forms. **Motion:** the easings and durations in use.

**Never canonize a floor violation.** Check each candidate rule against the
[quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) and its tells. A pattern that breaks it
(however often it repeats) stays out of DESIGN.md's tokens, Do's and Named Rules; list it with its
files for the user in Step 5 and suggest `/sf-design critique`, or the matching move of
`/sf-design refine`, to fix the code. If the user keeps it anyway, record it in the Decisions Log
with its tradeoff, stated once.

Done when: every token in the draft is reused, traced to its files, and inside the floor; every
floor violation found is on the Step 5 list.

## Step 4: Ask for the language the code cannot give

Two rounds of at most three decision briefs each, waiting between rounds:

- **Creative North Star:** one named metaphor for the whole system ("The Lab Notebook"); offer two
  or three that honour PRODUCT.md's brand personality.
- **Overview voice:** mood adjectives, the aesthetic philosophy in two or three sentences, any
  confirmed visual anti-reference.
- **Colour names:** two or three descriptive names per key colour from its hue and saturation
  ("Deep Muted Teal-Navy").
- **Elevation philosophy:** flat, layered or lifted; if shadows exist, ambient or structural.
- **Component feel:** one phrase for buttons, cards and inputs ("tactile and confident").

Done when: each item has a user-chosen answer, or the user waived it.

## Step 5: Confirm before writing

Show the complete DESIGN.md as it would be written, with each token's source file, the Step 3
floor-violation list, every conflict with a confirmed decision, and whether a sidecar will be
written (see the format's sidecar section). Ask a decision brief: **Approve** (write; in plan mode,
save "## Proposed DESIGN.md" in the plan only), **Revise** (return to the step concerned), **Cancel**.

Done when: the user approved, or chose revise or cancel and project files are untouched.

## Step 6: Write and check

Write as Phase 6 of [consultation-proposal.md](../consultation-proposal.md) writes, from its plan-mode
rule through the CLAUDE.md section: plan mode, backup, the read-back format check, CLAUDE.md. When
the file was a seed, the scan's values replace its placeholders and the seed line goes. Then write
the sidecar if approved, its narrative copied verbatim from the file you just wrote.

Show the result, name its non-obvious choices (descriptive colour names, the North Star, Named
Rules), and offer to revise a section or add a component the scan missed. Your own write is the
freshest source for the rest of the session. Then run Capture Learnings in
[consultation.md](../consultation.md).

Done when: DESIGN.md reads back in the expected format, every approved token is in it, and the
sidecar (if any) matches it.
