# New visual work: decide the world, record the contract

The new-work job of [consultation](../consultation.md), for a new surface or a
replacement visual identity. It decides what is already true, how much to invent, which
world the surface lives in, and records that as a direction contract. The build itself
runs in html mode ([html/build.md](../html/build.md)); a public-facing page or app screen
built with dealt directions and an inspector gate runs in
[direction mode](../direction.md) instead.

Authorities: PRODUCT.md owns product truth, DESIGN.md owns durable visual decisions, a
**surface brief** owns the strategy of one route or artifact. When PRODUCT.md is missing,
run [product.md](product.md) first; a missing DESIGN.md does not send you back there.
Visual authority is evidence, not a filename: a coherent identity already in code counts.

Rules that hold throughout:
- **The brief wins.** Pinned aesthetics, eras, materials, fonts and palettes are honoured
  even against a calibration warning; steering a clear brief toward your own taste is
  failure.
- **Refinement preserves; redesign replaces.** A redesign keeps product truth, content,
  function, native affordances and constraints, treats the old look as evidence and
  anti-reference, and replaces DESIGN.md. Polish on a discarded look is the split
  difference to avoid.
- **Loaded symbols stay out of decoration.** A subject's world does not license emblems
  tied to militarism, supremacy or hate movements (the Rising Sun flag's rays, the
  Confederate battle flag, Nazi-era insignia and their stylised variants) as motif, badge
  or ornament; use that world's neutral forms. Content documenting such a symbol as fact
  stays as it is.
- The surface's mode decides what its opening must do and how far the world may reach:
  [modes](../../sf-frontend-ui/SKILL.md#modes). Where a mode's rules and shared guidance
  conflict, the mode wins.

## 1. Decide what is already true

Read DESIGN.md, representative code, tokens, components and assets. When the app cannot
run, start from committed visual-regression goldens or screenshot fixtures, check them
against current tokens, CSS and assets, and compare theme and variant captures.

- **Redesign:** keep product truth, content, function, constraints and explicit brand
  commitments; replace the old visual world.
- **Established world:** inherit it. With no DESIGN.md, record the identity in code
  ([document.md](document.md)) rather than inventing a replacement.
- **Incomplete brand:** keep confirmed assets and recognisable traits; expand the system
  with the user for this surface.
- **No visual authority:** create a new world with the user.

A section, component, feature or state inside an established surface inherits that
surface; it never becomes an identity exercise.

**Done when** the case is named with the evidence for it.

## 2. Ask what will change the work

Before building, confirm with a decision brief: two or three related questions, or a
compact confirmation for a precise request. DESIGN.md settles the world, never this
surface's purpose or concept, so confirmation is always owed.

- **Persuade:** who must act, what they should believe, which real proof, content or
  assets earn it.
- **Operate:** the task, the information, the important states, frequency, constraints.
- **Read:** the reader's question, the source material, structure, wayfinding.
- **Experience:** what leads, how exploration unfolds, which interaction or transition
  matters.

In every mode also ask what success looks like, what must stay untouched, and what would
make a polished result feel wrong. Questions name outcomes, never CSS values or style
lanes. When a [shape](shape.md) brief exists, it answers these.

**Done when** the answers (or confirmed readings) are recorded for the surface brief.

## 3. Choose the amount of invention

### Extend an existing surface

Inherit its world and composition. Resolve only the new purpose, content, hierarchy,
states, interaction, and how the addition joins its surroundings. No concept round and no
DESIGN.md change unless the user approves a durable system change.

### A whole surface inside an established world

Keep the visual system fixed. Derive five to seven materially different structures from
the content, the task and how users behave, ordered by resonance. For a genuinely open
whole page, screen or flow, **deal** three of them rather than choosing: if the
design-check CLI recorded in `docs/agents/tools.md` is present, run its `concept-seed
--scope surface --mode <mode>` and follow what it prints; otherwise draw three distinct
indices from your ordered list with a random source you did not pick
(`node -e "const c=require('crypto');const s=new Set();while(s.size<3)s.add(c.randomInt(N));console.log([...s])"`)
and lead with the first one drawn. The deal breaks the ranking rut while the user keeps a
real choice.

Present the three as full cards of equal weight (the dealt lead first, marked as the
deal), with steer and re-roll. Every card shows composition, never identity: the world is
settled. With an image tool and a comp-first build path (product.md, Step 5), each card is
a first-viewport comp generated under [shotgun](../shotgun.md)'s comp discipline, anchored
on a screenshot of a representative existing page passed as a reference image, because a
pixel reference holds a design system where prose drifts. Without images, or code-first,
each card is an HTML sketch of the first viewport (a schematic wireframe when no sketch
exists). Put them on shotgun's comparison board, or as a decision brief when no board can
open. Locking a card is the approval and sets the build path: a locked comp builds
comp-led with that comp approved (shotgun's three-comp round is then already discharged);
a locked sketch builds code-led and is the composition the build matches. A local
extension or a precisely specified narrow request skips the deal.

### Create or replace the visual world

1. **The rut.** Name in one sentence the product's unique mechanism, the audience's real
   scene, its cultural home, and what this first surface must prove. Name the page this
   category always ships and its predictable opposite: both are the rut and stay off the
   list below. A brief that paints its own picture (a product name, a titled artifact, a
   governing metaphor) adds its literal reading to the rut: spend at most one candidate on
   it.
2. **Seven candidates.** From that cultural world, list seven concrete visual systems,
   artifacts, places or rituals the audience knows by heart, each with one line on why it
   resonates and can carry the mechanism, and one on how it looks (ground and main
   colours, type voices, the one signature that makes it recognisable), ordered by
   resonance. The audience's world includes its graphic and screen traditions: the
   notation, publications, identity programmes, data graphics and interfaces it reads
   daily; a nameable abstract system (a poster school, a documentation standard) is as
   concrete as an object. On an Operate or Read surface, the seven come from anywhere in
   that world except the tools and instruments the audience operates (a terminal or a
   control panel handed to a working screen comes back as a costume). On a Persuade or
   Experience surface those tools count toward the rut: one candidate at most. Also ask
   what the thing would look like as a physical object and what its world looked like
   before the web. Near-duplicates count once; when more than three share one material
   family, dig until the list spans at least three families.
3. **Directions.** Turn the material into complete directions, each joining a reusable
   visual world to a concrete first-surface experience. Every direction must already be
   viable: every relationship and claim it shows true, a real palette and component
   family, a distinctive composition with one product-specific experience, workable at
   full scale within the assets, tools and performance budget. A candidate that fails on
   truth is replaced before the deal. Truth binds claims, not demonstrations: illustrative
   material is authored at full fidelity, labelled synthetic wherever a visitor could take
   it for real, and listed for replacement; prices, customers, benchmarks, endpoints and
   capabilities the product lacks stay uninventable.
4. **The deal.** If the CLI is present, run its `concept-seed --scope direction --mode
   <mode>` and follow it: it assigns the direction and deals challengers from its catalogue
   of worlds, each with a quality-bar card. Otherwise deal the assigned direction from your
   list with the random draw above, and take as challengers up to three directions from
   outside your list (a dealt app style or direction from
   [direction mode](../direction.md)'s library, or a world the user named). On a new or
   replacement world, artifact code waits until the deal has run and its assignment is
   acknowledged: the deal is what keeps runs from converging on the category default.
   Fuse each challenger before judging it (the challenger supplies form and system
   grammar, the product supplies every fact, clarity wins conflicts) and weigh it against
   the assigned direction on two axes only, audience identification and product clarity.
   Verdict per challenger, decided before any borrowing: **wins** (beats it on both: the
   new build candidate), **competitive** (holds one axis: a full alternate), **declined**
   (loses both). A declined challenger still donates: name the one discipline of its
   system the assigned direction lacks (a palette's total commitment, a grid's density
   courage, a form's structural honesty) and raise the assigned direction to match, written
   as its own line named for its donor. A donation is discipline, never clothes: a
   button's shadow or a display face is clothes, and one world owns the page.
5. **Present.** One direction, fully committed and already raised, raises visible:
   world, first viewport, visitor path, signature interaction, cross-surface reach,
   honest risk. Winning and competitive challengers are full alternates with their case
   line; declined ones show compact, each with its verdict and what the direction kept from
   it, still adoptable on request. At most three full-card challengers; more wait in the
   re-roll pool, noted in one line. When your own top-ranked grounded candidate is not the
   assigned direction, add one card for it, labelled as your pick, same anatomy, its risk
   line naming its familiarity when true; never a ranked list, never in the lead position
   (when the deal lands on your top candidate, the assigned card says so). Every card has
   the same anatomy: thesis, palette, materials, first viewport, honest risk, plus the
   challengers' case lines. Offer re-roll with an optional one-line steer in three
   registers: plain (a fresh hand), safer (your remaining conventional candidates plus the
   category standard against named competitors), bolder (foreign forms only, full
   commitment). The register is the user's to choose; "bolder" or "safer" said while a
   direction round is open means these registers, never the refine moves of those names.
   Show the hand on shotgun's comparison board (cards and images) or, without a board, as
   a decision brief whose options are the assigned direction, the pick, the winning and
   competitive challengers and the standing exit last, with declined challengers folded
   into the assigned option's description as kept lines. With an image tool and comp-first,
   each card carries a first-viewport comp produced in reading order (assigned, pick,
   challengers, standard), each saved with its prompt beside it, all at the surface's own
   aspect and one fidelity; with parallel subagents, one `design-asset-producer` per card
   in its decision-comp job ([agent](../../../agents/design-asset-producer.md)), up to four
   at a time. Unchosen comps stay as the round's spent hand and imply no approval.

**The standing exit.** Every direction round offers one quiet permanent alternative: the
category standard, played straight. It is the user's door: never recommended, never
weighed against the deal, never used to soften the dealt directions. When the user takes
it (the standard card, a safer steer, or words asking for the familiar path), convention
becomes the commitment: ask once for two or three products it should sit alongside, make
their craft level the bar, and execute the standard at full fidelity without irony.
Record a standing preference as a brand commitment in PRODUCT.md.

**Re-rolls.** A re-roll removes every direction already shown. After two consecutive
re-rolls, ask what quality is missing. Re-roll on your own only on named factual grounds
(the assigned direction cannot carry the product's truth or task); taste is never
grounds, and neither is a look mismatch. A user- or brief-pinned direction beats the
deal. Resolve collisions field by field: every pinned constraint holds; where the brief
leaves a dimension open, the assignment binds through its topology, controls, state
vocabulary and ritual; where only its materials clash with a pinned direction or a brand
commitment, translate the material and name the translation.

When the user locks a world from a catalogue or quality-bar card, carry its palette and
material, type and composition, topology, controls and state, and responsive rules into
the product as far as the mode allows, and open that card's board and hero before
building: they set the craft level, never the composition.

**Unanswered page.** If the board closes unanswered, re-present once as a decision brief;
with no answer there either, proceed with the assigned direction and state the
assumptions.

**Done when** the user locked a direction (or the standard, or delegated with the
evidence stated), or, for an extension, the inherited world is confirmed.

## 4. Commit the world

**Colour strategy before colours**, with
[colour.md](../../sf-frontend-ui/references/colour.md) for the depth: Restrained, Committed
(one saturated colour carries 30-60% of the surface), Full palette (three or four named
roles), or Drenched (the surface is the colour). Persuade and Experience surfaces may take
the bolder strategies when the brief allows. Colour commits at page scale: fields that own
whole regions, not accents scattered on a neutral ground. Light or dark comes from one
written sentence of physical scene: who uses this, where, under what light.

**Faces** are chosen like objects from the subject's world, in the mode's register, by the
font procedure and lists in
[consultation-proposal.md](../consultation-proposal.md) ("Choosing faces"), with
[type.md](../../sf-frontend-ui/references/type.md) for the depth. A subject association
(books want a serif, tech wants a mono) is never the reason to take a listed default.

**Calibration.** Self-check against the clustered looks in
[consultation-proposal.md](../consultation-proposal.md) ("Calibration") and the tells in
[tells.md](../../sf-frontend-ui/references/tells.md): if someone could guess the aesthetic
from the category alone, or from the category plus its avoidance, rework until neither is
obvious. Energy is not the enemy of trust: a brief's negative constraints (no
gamification, no hype) rule out those devices, not exuberance. A warm, bookish or
child-facing subject renders by default as cream ground, italic-accented serif and
lamplight even when nothing asked for it: treat that first palette as spent. Before code,
reread the OWN-WORLD block below; when it says cream, paper, parchment, ivory or lamplight
for a Persuade surface the brief did not pin, rework it from the world's saturated
materials (book cloth, thread, jackets, endpapers). A pinned world pins the world, not its
softest rendition.

**Done when** the colour strategy, the faces (verified) and the light/dark scene sentence
are written, and the calibration check is passed.

## 5. Record the decision

Before code, write the direction as a development-only contract under
`## Direction contract` in the surface brief, about 150 words in six blocks:

- **THESIS:** the one idea this surface owns and the category-default arrangement it
  refuses.
- **OWN-WORLD:** the palette and component language, recognisable with all content removed.
- **STORY:** what the visitor understands, believes and does.
- **FIRST VIEWPORT:** the exact composition, what is where at what scale, where the
  primary action sits.
- **FORM:** the chosen form, its position on your ordered list, and the deal's reference
  (the CLI's printed seed reference, or `seed: <your random draw and the date>`; when no
  deal ran because the direction was pinned, `seed: none (pinned)`).
- **FINISH:** verbatim "unreviewed and undocumented is unfinished; this build ends with
  the finish review, the verdict, DESIGN.md, and every shipping raster carrying its
  provenance".

A block that reads like a mood means the direction is not decided yet; the finish review
audits the render against this contract.

The surface brief lives in the designs folder (
[work-docs.md](../../../references/work-docs.md)) as `<surface>/surface-brief.md`, or
through the CLI's surface-brief verbs when present. Read an existing brief before updating
it. Keep it small: scope and mode; audience, job, action or task, proof and content,
constraints; the chosen direction and memorable moment; open decisions. Global product
truth and DESIGN.md tokens stay in their own files. After writing, read it back and check
all six blocks are present.

The contract never enters implementation source or anything a browser receives: no HTML
or framework comments, hidden DOM, `<template>`, `data-*` attributes, rendered JSX output,
serialised props or state, server-component payloads, client bundles, metadata or JSON-LD,
accessibility-only text, or files served beside the artifact. A build step that strips
development metadata is not a safety boundary. Reviewers and the documenter receive the
contract from the surface brief.

On a new or replacement world, DESIGN.md is written at the finish from the built world by
the `design-documenter` ([agent](../../../agents/design-documenter.md)): a rulebook written
before the build gets defended against reality. A new world shipped with no DESIGN.md is an
incomplete run; an ordinary extension leaves DESIGN.md as it is.

For [shape](shape.md), return the direction there and stop before this section.

**Done when** the surface brief holds all six blocks, read back. Then continue in html mode
at [html/build.md](../html/build.md): comp-led when a comp is approved or the recorded path
is comp-first on a Persuade or Experience surface with an image tool; code-led otherwise.
