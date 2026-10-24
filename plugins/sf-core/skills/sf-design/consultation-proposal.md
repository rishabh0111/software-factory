## Phase 3: The Complete Proposal

Read this section in full, then apply its design/font rules → draft independently → offer outside voices → synthesize for Q2. Preview and writes require their later approvals.

### Your Design Knowledge (use to inform proposals — do NOT display as tables)

**Calibration: the clustered looks.** Generated interfaces cluster around a few looks whatever the subject: cream/serif/terracotta (or signal red); near-black/neon/glowing edges; broadsheet hairlines/italic serif/tiny tracked mono; flat saturated ink with black boxes, hard offset shadows and heavy condensed display type. Use one only when the brief specifically calls for it. Otherwise choose a direction grounded in these users, rather than the category stereotype or its obvious opposite. For example, a book product can draw color from jackets and cloth instead of defaulting to cream and serif.

**Aesthetic directions** (pick the one that fits the product):
- Brutally Minimal — Type and whitespace only. No decoration. Modernist.
- Maximalist Chaos — Dense, layered, pattern-heavy. Y2K meets contemporary.
- Retro-Futuristic — Vintage tech nostalgia. Phosphor palette, bitmap type, warm monospace for data (no glow halos, no grid-paper backgrounds).
- Luxury/Refined — Serifs, high contrast, generous whitespace, precious metals.
- Playful/Toy-like — Rounded, springy (no overshoot), bold primaries. Approachable and fun.
- Editorial/Magazine — Strong typographic hierarchy, asymmetric grids, pull quotes.
- Brutalist/Raw — Exposed structure, one utilitarian grotesk, visible grid, no polish (a system stack only when the user asks for it by name).
- Art Deco — Geometric precision, metallic accents, symmetry, decorative borders.
- Organic/Natural — Earth tones, rounded forms, hand-drawn texture, grain.
- Industrial/Utilitarian — Function-first, data-dense, monospace accents, muted palette.

**Decoration levels:** minimal (typography does all the work) / intentional (subtle texture, grain, or background treatment) / expressive (full creative direction, layered depth, patterns)

**Layout approaches:** grid-disciplined (strict columns, predictable alignment) / creative-editorial (asymmetry, overlap, grid-breaking) / hybrid (grid for app, creative for marketing)

**Color approaches:** Restrained (1 accent + neutrals, color is rare and meaningful) / Committed (one hue owns the page, neutrals derive from it) / Full palette (primary + secondary + semantic colors for hierarchy) / Drenched (color as the primary design tool, surfaces carry it)

**Motion approaches:** minimal-functional (only transitions that aid comprehension) / intentional (subtle entrance animations, meaningful state transitions) / expressive (full choreography, scroll-driven, playful)

**Choosing faces: a procedure, not a menu.** (1) Name the audience's world (publication, notation, identity or object they read) and mode: Persuade (marketing), Operate (tasks), Read (long content), Experience (immersive). Match its tone. (2) Shortlist three faces per display/body/label/mono role. (3) Apply role exclusions. (4) Check each proposed family's official Google Fonts/Fontshare listing via WebSearch or the browser for its exact name, required weights, license and loading URL; for a local face, inspect its files and license. Omit faces you cannot verify. (5) Specify the verified loading source and strategy.

**Font-verification fallback:** Skipping competitive research does not waive font verification. Offline, check local files/licenses. Otherwise describe roles/weights/proportions; mark font selection as pending verification in DESIGN.md. Continue palette/layout; defer the preview until fonts can be verified, or honor a user skip. Invent no face or URL.

**Overused as display** (never the display voice, on any surface; the body/UI exception below is the only one): Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins, Space Grotesk, Space Mono, Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, IBM Plex Sans, IBM Plex Serif, DM Sans, DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans, Geist.

**Fine as body/UI on an Operate or Read surface when the proposal says so:** DM Sans, Instrument Sans, IBM Plex Sans. **Mono for data and code:** JetBrains Mono, IBM Plex Mono, Fira Code.

**Banned in any role:** Papyrus, Comic Sans, Lobster, Impact, Jokerman, Bleeding Cowboys, Permanent Marker, Bradley Hand, Brush Script, Hobo, Trajan, Raleway, Clash Display, Courier New.

**Freely available faces on no default list** (verified 2026-09-08; re-verify in-session; see font-verification fallback if offline): Satoshi, General Sans, Clash Grotesk, Cabinet Grotesk (Fontshare); Instrument Serif, Source Sans 3, JetBrains Mono, Fira Code (Google Fonts). Short on purpose. A long list of "good" fonts is how the last convergence happened.

User asks for a listed face by name: comply, state the tradeoff once.

**Anti-convergence directive:** VARY aesthetic, faces and palette across project generations; justify repetition. Light vs dark is not one of the dials: fix it to the use scene (who, where, lighting) until that scene changes. Unjustified convergence is slop.

**AI slop anti-patterns** (never include in your recommendations):
- Purple/violet/indigo gradient backgrounds or blue-to-purple color schemes
- **The 3-column feature grid:** icon-in-colored-circle + bold title + 2-line description, repeated 3x symmetrically. THE most recognizable AI layout.
- Icons in colored circles as section decoration (SaaS starter template look)
- Centered everything (`text-align: center` on all headings, descriptions, cards)
- Uniform bubbly border-radius on every element (same large radius on everything)
- Decorative blobs, floating circles, wavy SVG dividers (if a section feels empty, it needs better content, not decoration)
- Emoji as design elements (rockets in headings, emoji as bullet points)
- Colored left-border on cards (`border-left: 3px solid <accent>`)
- Generic hero copy ("Welcome to [X]", "Unlock the power of...", "Your all-in-one solution for...")
- Cookie-cutter section rhythm (hero → 3 features → testimonials → pricing → CTA, every section same height)
- system-ui or `-apple-system` as the PRIMARY display/body font — the "I gave up on typography" signal. Pick a real typeface.
- A colored edge on a rounded card: the side-tab in a costume. Signal state with a background tint, an icon, or a label.
- A training-data default as the display voice means you stopped looking. As body or UI on an Operate or Read surface, several of these are fine. Say which and why.
- Headings within a step of body size. Pick a scale and let the levels differ by more than a weight.
- Emphasis is weight or size. Gradient text is emphasis in a costume.
- Cream ground, serif display, terracotta accent: look number one. Fine when the brief asked for it; a default when it did not.
- A card inside a card is always wrong. Cards are the lazy container; nesting them is the lazy container squared.
- An illustration built from CSS shapes standing in for an asset. Produce the asset or ship nothing.
- Glowing edges on dark surfaces: look number two. Depth has an offset; a zero-offset colored halo is decoration.
- A radial gradient halo behind the hero content. Look number two again.
- A spotlight glow washing the top of the page. Same family as the halo.
- An infinitely scrolling logo strip. If the logos matter, show them still; if they do not, cut them.
- The rounded-square icon above every heading. Try side by side, or drop the container.
- Look three: the italic display serif reaching for editorial credibility. Earn it with the content or set the display upright.
- A pill-shaped label floating above the hero headline. The headline carries its own weight; cut the chip.
- A kicker above a heading is the strongest default there is: the heading carries its own weight, so delete the label. If the user wants it anyway, comply and say the tradeoff once.
- "Seamless", "effortless", "supercharge", "streamline": words that describe nothing. Say what the product does.
- Short. Punchy. Fragments. Every sentence a slogan. Write like a person explaining something.
- Display type past 6rem on a page that is not a poster. Size is not hierarchy.
- "Built for the way you work", "Designed for teams like yours", "Meet your new...": phrases that perform a launch instead of describing one.
- Gradient buttons as the primary call to action. One solid color the palette owns.
- A generic stock-photo hero, or a gray placeholder div standing in for one. Show the product or show nothing.
- Rounded cards with drop shadows as the container for everything. App UI made of stacked cards is not layout.
- A testimonial row with avatars, five stars, and quotes nobody said. Real names with real claims, or cut it.
- The cookie-cutter hero: headline left, screenshot right, two buttons. The first template every generator reaches for.
- "Get Started" and "Learn More" as the only calls to action. Name the outcome the click buys.
- Three big numbers with tiny labels under the hero ("10k+ users", "99.9%"). The template counts, not the product.
- A grid of cards with the same shape, the same icon slot, the same two lines. Content of unequal weight given equal boxes.
- Frosted-glass panels with blurred backdrops as the default surface. One translucent layer where it explains depth, not everywhere.
- Generated SVG doodles and mascots in place of art direction. Commission or license an asset, or ship none.
- Every secondary action in a modal. Inline, a side panel, or a new page usually costs the user less.
- Sparklines, progress rings, and fake avatars filling space where content should be. Real data or an honest empty state.
- Dark because it is a dev tool, light because it is health. Light or dark comes from the use scene: who, where, under what light.
- Only the happy path is designed. Empty, loading, error, and long-content states are part of the component.

### Coherence Validation

After any override, gently flag mismatches and offer alternatives: Brutalist/Minimal + expressive motion → quieter motion or keep intentionally; Drenched + minimal decoration → supporting decoration; editorial + dense data → hybrid layout. Never block; accept the user's final choice and proceed.

### Independent proposals, then synthesis

Draft your own direction from the brief: fill Q2's aesthetic, palette, role-specific type, layout, spacing, motion and two deliberate risks before dispatching either voice. Keep that draft out of both reviewers' prompts; send the same brief, not your answer. Outside voices run only after user opt-in.

## Design Outside Voices (independent)

Use AskUserQuestion:
> "Want outside design voices? One subagent proposes an independent design direction; another does an independent indie-studio design direction proposal."
>
> A) Yes — run outside design voices
> B) No — proceed without

If user chooses B, skip both voices, and continue to Q2 with your draft; Q2 names the voices as declined.

**If accepted:** Create a private file for the Phase 1 product brief, including Phase 2 research status:
```bash
_DESIGN_BRIEF=$(mktemp "${TMPDIR:-/tmp}/design-brief-XXXXXXXX") || exit 1
printf 'DESIGN_BRIEF=%s\n' "$_DESIGN_BRIEF"
```
Write the product brief to that path; remember its absolute path across fresh Bash calls. Neither voice inherits context: give both the same brief. Keep your draft direction out of both prompts; give each subagent the product brief's absolute path. Never paste brief text into shell source.

Run both voices as independent subagents and await both before synthesis. Overlap calls
if supported; keep each call blocking.

1. **Direction design voice** (Agent tool):
Prompt (include the actual plan/product/frontend source context, not only file paths):

"Given this product context, propose a complete design direction:
- Visual thesis: one sentence describing mood, material, and energy
- Typography: specific font names with display/body/UI roles (no Inter/Roboto/Arial/system defaults); the parent verifies font availability before adoption
- Color system: hex values and CSS variables for background, surface, primary text, muted text, accent
- Layout: composition-first, not component-first. First viewport as poster, not document
- Differentiation: 2 deliberate departures from category norms
- Anti-slop: none of purple gradient palette, the 3-column feature grid, centered everything, decorative blobs and dividers, nested cards, kicker above heading, icon tile above every heading, dark-mode glow

Be opinionated. Be specific. Do not hedge. This is YOUR design direction — own it.

End with Recommendation: <direction> because <product-specific reason>."

Request a complete design proposal ending with Recommendation: <direction> because <product-specific reason>. Refusal, empty/malformed output or a missing Recommendation marker means this voice is unavailable.

2. **Claude design subagent** (Agent tool, `run_in_background: false` when available; await its result. A launch receipt means it went background: await its completion notice.):
"Read the complete product brief at [the absolute DESIGN_BRIEF path printed above].

Propose a surprising indie-studio direction beyond conventional enterprise UI.
- Propose an aesthetic direction, typography stack (specific font names), color palette (hex values)
- 2 deliberate departures from category norms
- What emotional reaction should the user have in the first 3 seconds?

Do not fall back on these defaults: a cream ground with a high-contrast serif and terracotta accent; near-black with one neon accent and glowing edges; broadsheet hairlines with an italic display serif and tiny tracked mono labels; italic accent words inside headlines; numbered 01 / 02 / 03 section labels; pill-shaped buttons; purple gradient palette, the 3-column feature grid, centered everything, decorative blobs and dividers, nested cards, kicker above heading, icon tile above every heading, dark-mode glow. If your first idea is one of these, name it and choose again.

Be bold and specific."

**Error handling (all non-blocking):**
- On any direction-voice error: proceed with Claude subagent output only; identify it as the only completed independent proposal.
- If Claude subagent also fails: "Outside voices unavailable — continuing to Q2 with my draft direction."

Present only completed, available voice outputs with their actual source and status.
Output headers: `DIRECTION VOICE (design direction):` and `CLAUDE SUBAGENT (design direction):`.

**Handoff:** Retain every completed proposal (two, one, or none) with its source/status. Do not choose a direction here. Q2 compares these proposals with your earlier draft.
After both voices finish (including failure), delete only the private brief you created, using its remembered absolute path.

Taste differences are alternatives, not issues.

Compare completed outside proposals: explain agreements, differences, and ideas adopted with attribution. Verify any newly suggested fonts before adopting them using the same procedure above. Tie the recommendation to the memorable-thing answer. Do not count agreement as a vote or invent a missing proposal. Q2 names completed, unavailable, or declined voices and presents the recommendation.

**AskUserQuestion Q2 — present the full proposal with SAFE/RISK breakdown:**

```
Based on [product context] and [research findings / my design knowledge]:

AESTHETIC: [direction] — [one-line rationale]
DECORATION: [level] — [why this pairs with the aesthetic]
LAYOUT: [approach] — [why this fits the product type]
COLOR: [approach] + proposed palette (hex values) — [rationale]
TYPOGRAPHY: [display, body, label, mono assignments; a face may serve multiple roles] — [why these fonts]
SPACING: [base unit + density] — [rationale]
MOTION: [approach] — [rationale]

This system is coherent because [explain how choices reinforce each other].

INDEPENDENT INPUT: [completed/unavailable/skipped voices; agreements, differences, ideas adopted and product-specific reasons — omit comparisons if none completed]

SAFE CHOICES (category baseline — your users expect these):
  - [2-3 decisions that match category conventions, with rationale for playing safe]

RISKS (where your product gets its own face):
  - [2-3 deliberate departures from convention]
  - For each risk: what it is, why it works, what you gain, what it costs

Safe choices meet category expectations; risks make the product memorable.
Which risks appeal to you? Try others or adjust anything else?
```

Coherence alone can look generic. Propose at least 2 creative risks—type, accent, spacing, layout or motion—with rationale, benefit and cost alongside the category's safe choices.

**Options:** A) Looks great — proceed to Phase 5 if fonts are verified. B) Adjust [section] — Phase 4, then Q2 again. C) Different risks — revise the proposal, then Q2 again. D) Start over — draft another direction using the same confirmed brief. E) Skip the preview — proceed to Phase 6's Q-final, not straight to writing.

Revisions recheck fonts and coherence. If the product brief changes, label old proposals stale and offer fresh independent voices; do not claim they reviewed new context.

---

## Phase 4: Drill-downs (only if user requests adjustments)

Use one focused AskUserQuestion per requested drill-down: **Fonts:** 3-5 verified candidates with roles, rationale/evocation and preview offer; **Colors:** 2-3 hex palettes and color theory; **Aesthetic:** product-fit directions and why; **Layout/Spacing/Motion:** concrete product-specific tradeoffs. Carry the selected adjustment into the full Q2 proposal and re-check its font verification and coherence before asking Q2 again.

---

## Phase 5: Design System Preview (default ON)

After Q2 approval: pending fonts or a preview skip → Phase 6 with limitations. Generation unavailable/failed → offer Path B or skip, not unbounded retries.

### Path A: AI Mockups (if DESIGN_READY)

Apply the proposed system to realistic product screens:

```bash
_DESIGN_DIR="<designs dir>/design-system-$(date +%Y%m%d)"
mkdir -p "$_DESIGN_DIR"
echo "DESIGN_DIR: $_DESIGN_DIR"
```

Brief: Phase 3 aesthetic/colors/type/spacing/layout plus Phase 1 product context, written with your file-write tool into `$_DESIGN_DIR/brief.md`, exactly as it should appear. The text never goes into a shell command, heredoc or quoted argument.

Brief shape: `Product name: [name]. Product type: [type]. Aesthetic: [direction]. Colors: primary [hex], secondary [hex], neutrals [range]. Typography: display [font], body [font]. Layout: [approach]. Show a realistic [page type] screen with [specific content for this product].` Then generate 3 variants from that brief with the designer (`variants`), saving each into `$_DESIGN_DIR/`.

<!-- design:round-accounting -->
**Round accounting:** names are never overwritten (a taken one is bumped), so use only the actually `saved` paths. Tell the user how many of `requested` images were saved and name each `failures` entry. Nothing saved: report `failures` and stop here (offer Path B or skip); run no check or board.

Run quality check (`check`) on each saved path, starting with the first, against the same brief file; never include failed variants: view the image and judge it against the brief, or hand both to an independent subagent that can view images.

A failed check means regenerate addressing its issues, then recheck. A check you could not run is missing automated coverage; disclose it and inspect visually.

**Before presenting, self-gate:** Would a human designer be embarrassed to sign each variant? If yes, discard and regenerate. Hard rejects: purple gradient hero, 3-column SaaS grid, centered-everything, overused display face, generic stock photo, system-ui, gradient CTA, bubble-radius everything. Any trigger requires regeneration.

Read each accepted PNG inline, then open the board with those paths before inviting choices/remix.

### Comparison Board + Feedback Loop

<!-- design:board -->
Write this round's board images (saved paths that passed checks, in order) as a JSON array to `$_DESIGN_DIR/board-images.json` with the Write tool; board letters A, B, C follow that order. Then build the board (`compare`): write `$_DESIGN_DIR/design-board.html`, a page showing those images side by side, each under its letter, and open it in the default browser.

**Wait with AskUserQuestion:** "Review <BOARD_PATH>, then tell me your preferred variant, ratings, comments, or which new variants you want." The board shows; the question waits. Do not poll.

Read the user's reply for `preferred`, `ratings`, `comments`, `overall`, or a regenerate request: `different`, `match`, `more_like_<letter>` or custom text (including remix). Honor a remix map (`{"layout":"A","colors":"B"}`) if given; clarify missing detail.

**Board or chat:** revisions regenerate; a final choice needs summary confirmation; skip goes to Phase 6 without a mockup. Ask if no choice/detail; never infer approval from silence. A choice with revision notes is a revision.

**Regenerate:**
1. Revise the brief in the brief file, preserving unrelated constraints.
2. Run the designer's `variants` with the new brief, with the same round accounting. Re-run the quality check and visual self-gate on every new image (its saved path).
3. Rebuild with the board block above (it rewrites board-images.json).
4. Reload the board in the user's browser (same tab).
5. AskUserQuestion with the same board path until a final choice, skip or stop. Failed generation or a board that cannot be opened uses the fallback, not another wait.

**BOARD FALLBACK:** If the board cannot be opened: show each variant inline with Read, then AskUserQuestion: "The comparison board could not be opened. Which variant? Any changes?" Route chat feedback as above.

**After receiving feedback (any path):** summarize PREFERRED, RATINGS, YOUR NOTES, DIRECTION; AskUserQuestion "Is this right?" A confirmed final choice permits Write of `$_DESIGN_DIR/approved.json` with `approved_variant`, `approved_path` (file name of that letter's entry in this board's `board-images.json`, never the directory listing), `feedback`, `date` (UTC), `screen` (the product page depicted by the chosen mockup), and `branch` (the current `git branch --show-current` result, empty if detached). Use valid JSON, never shell interpolation. This approves the image only; Q-final gates project writes.

After final image confirmation, extract the tokens from `APPROVED_IMAGE` (the confirmed letter's `board-images.json` entry) with the designer's `extract`: colors, typography, spacing, layout and components read off the image. Extraction writes nothing; DESIGN.md waits for Q-final.

Compare extracted tokens with the approved image and verified fonts; show discrepancies at Q-final. Empty results, an "Unable to extract" mood or a failed extraction → disclose fallback to Phase 3 values, never invent measured tokens.

Late visual changes return to the feedback loop: regenerate, recheck, reconfirm, then extract again. A single mockup refines with the designer's `iterate` (the feedback in a file in `$_DESIGN_DIR`, never inline), saved to `$_DESIGN_DIR/refined.png`; use its saved path. Variants must regenerate.

**Plan mode:** Carry the approved mockup paths/tokens into Phase 6's "## Proposed DESIGN.md" plan section. Its Q-final approval governs saving that content; defer the actual DESIGN.md to implementation.

### Path B: HTML Preview Page (fallback if DESIGN_NOT_AVAILABLE)

Create and open the HTML preview:

```bash
PREVIEW_FILE="/tmpdesign consultation-preview-$(date +%s).html"
```

Write the preview HTML to `$PREVIEW_FILE`, then open it:

```bash
open "$PREVIEW_FILE"
```

### Preview Page Requirements (Path B only)

Write a **single, self-contained HTML file**, no frameworks:

1. **Loads proposed fonts** via `<link>` from their step (4) verified Google Fonts/Fontshare/self-hosted source.
2. **Uses the proposed palette** throughout.
3. **Shows the product name**, not Lorem Ipsum, in the hero.
4. **Font specimen section:**
   - Each candidate in its hero/body/button/table role; compare same-role alternatives side by side using real domain content (e.g. civic tech: government data).
5. **Color palette section:**
   - Named hex swatches; primary/secondary/ghost buttons, cards, inputs, success/warning/error/info alerts; background/text contrast pairs.
6. **Realistic product mockups:** Render 2-3 Phase 1 product-type layouts with the full system, product name, domain content and proposed spacing/layout/radii:
   - **Dashboard/web app:** metrics table, sidebar nav, avatar header, stat cards.
   - **Marketing:** real-copy hero, features, testimonials, CTA.
   - **Settings/admin:** labeled inputs, toggles, dropdowns, save.
   - **Auth/onboarding:** branded login, social buttons, validation states.
7. **Light/dark toggle:** CSS custom properties plus a JS button.
8. **Clean, professional layout.**
9. **Responsive** at every width.

Show how their product feels, beyond a font/color inventory.

If `open` fails (headless environment), tell the user: *"I wrote the preview to [path] — open it in your browser to see the fonts and colors rendered."*

If the user says skip the preview, go directly to Phase 6.

---

## Phase 6: Write DESIGN.md & Confirm

Only Path A extracts tokens from an image, as above. For Path B, use the approved HTML preview's CSS values. No preview: approved Phase 3 values; mark only unverified fonts pending. Retain rationale and unchanged existing decisions.

**Confirm before writing.** Prepare the complete DESIGN.md contents in the [DESIGN.md format](consultation/design-md-format.md), identify every token source (approved mockup extraction, approved HTML, or Phase 3 fallback), mark any unverified font pending, and show the exact CLAUDE.md guidance you would add or update. Show decisions and agent-selected defaults together with that preview. AskUserQuestion Q-final:
- A) Approve — write DESIGN.md and CLAUDE.md; in plan mode, save Proposed DESIGN.md in the plan only
- B) Revise — return to Phase 3, then confirm again
- C) Start over — return to Phase 1

Wait. Only A permits the writes below; B/C leave project files untouched. Honor prior explicit approval of these exact writes without re-asking. Any subsequent token, font or direction change invalidates that approval: update the proposal, reverify affected fonts/preview, and ask Q-final again. A changed product brief also invalidates prior independent proposals.

**If in plan mode:** Write the DESIGN.md content into the plan file as a "## Proposed DESIGN.md" section. Do NOT write the actual file — that happens at implementation time.

**If NOT in plan mode:** apply the approved Phase 0 format choice, then write root `DESIGN.md`. New, fresh and converted files take the [DESIGN.md format](consultation/design-md-format.md): tokens in the five front-matter groups, the line-2 format marker, the canonical sections, and the seed line when no implementation exists yet. Offer its optional sidecar when the system has values the front matter cannot hold. A kept-legacy or unknown-format Update instead retains its own shape; persist `legacy-keep` only for the chosen legacy path. Preserve the prior file in a backup before a fresh replacement.

Use the approved values; leave out invented `components` entries and unverified fontFamily values, describing pending font roles in prose. Add a Decisions Log row for today's decisions (on a new file: `Initial design system created`, by `sf-design` consultation mode from [product context / research]). Outside plan mode, after writing DESIGN.md, Read it back and classify it with the Phase 0 format check: require `spec` for new/fresh/converted/spec files, `legacy` with `legacy-keep` for a kept legacy file, or the disclosed `unknown` format for a preserved unknown file. Never convert a kept file just to make validation say spec.

**Outside plan mode, update CLAUDE.md** (or create it if it doesn't exist) — append this section:

```markdown
## Design System
Read DESIGN.md before visual or UI work: it defines the fonts, colors, spacing, and
aesthetic direction. Ask the user before departing from it. When reviewing or QA-ing
UI, flag code that doesn't match DESIGN.md.
```

After shipping DESIGN.md, if the session produced screen-level mockups or page layouts
(not just system-level tokens), suggest:
"Want to see this design system as working Pretext-native HTML? Run `sf-design` in html mode."

---
