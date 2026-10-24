# Product context: PRODUCT.md

The capture job of [consultation](../consultation.md). PRODUCT.md records durable
product truth: who uses the product, for what, what it can truthfully claim, and what
future work must preserve. It holds no visual decisions; DESIGN.md holds those
([format](design-md-format.md)). Every mode reads PRODUCT.md as the user's prior
answers, so a filled section is never asked again.

Run this job when PRODUCT.md is missing and the work ahead needs product truth (a new
surface, a new or replacement visual world, a design system), or when the user asks to
capture or refresh it. A narrow refinement of existing code proceeds without it and
offers this job afterwards.

## Step 1: Load what exists

Find PRODUCT.md where `docs/agents/work-docs.md` says, else at the repo root. If the
design-check CLI recorded in `docs/agents/tools.md` is present, its `context` verb
resolves the path and loads PRODUCT.md, DESIGN.md and platform guidance; otherwise read
the files directly. In a child app that inherits a root PRODUCT.md, confirm which facts
are shared and which are this app's before writing.

- **No PRODUCT.md:** explore, interview, write it.
- **PRODUCT.md exists:** ask what is stale or missing; leave confirmed fields closed
  unless the user reopens them.
- **Older PRODUCT.md:** add only durable missing facts. A file with no `## Platform`
  means `web` unless the code says otherwise.
- **Only DESIGN.md exists:** leave it untouched and create PRODUCT.md.
- **Redesign or rebrand:** keep confirmed product truth unless the user changes it;
  visual replacement happens later, in [new-work.md](new-work.md).

Every write updates the one file in place: one product authority, never a second file.

**Done when** you hold the PRODUCT.md path (existing or to create) and the branch above.

## Step 2: Explore before asking

Scan enough that the user never repeats a known fact: product docs and copy, package and
config files and app boundaries, features, workflows, routes and roles, names, logos,
legal and proof assets, brand commitments, platform and accessibility signals, and the
dev command and entry file.

Repository evidence is a hypothesis to confirm, never the user's approval. Note how
mature the visual system is, without recording, extending or replacing it here.

Form a platform hypothesis: `web`, `ios`, `android` or `adaptive` (one product whose
design language genuinely changes per OS). Mobile web is `web`; a native wrapper around a
website keeps the web's design language.

**Done when** you have a pre-filled reading for every PRODUCT.md section the evidence
supports, and a list of the material gaps.

## Step 3: Interview for product truth

Ask with decision briefs, at most three focused questions per round, about material
gaps only. A new PRODUCT.md needs one real answer or approval round before it is
written; confirm every inference.

Whether anyone can answer is mechanical: a question tool in your tool list proves an
answer path exists. Send the real first round before concluding no one is there. Only
after it errors or times out, infer from the explicit brief, label every inferred fact
`(inferred)` in PRODUCT.md, and say so in your first reply.

Ask first about what most changes later decisions:

1. Who is the primary user, in what situation, doing what job?
2. What does the product make possible, and what mechanism or position sets it apart?
3. What constraints, assets, evidence or facts must future work preserve?

Confirm an ambiguous platform separately. When the project has no framework and the
request implies building, the stack is the user's decision: ask once (plain static
HTML/CSS, a named framework, or your recommendation, plus any deploy target that
constrains it) and record the answer under `## Stack`, including `delegated: <choice and
why>` when they leave it to you. Add a round only for a material gap in audience, brand
commitment, evidence or accessibility. Record undecided facts as undecided.

Visual direction waits for the propose job and new-work: this interview asks nothing
about look, feel, references, colours, type or style. A binding visual constraint the
user volunteers is recorded as stated, under Brand Commitments.

What belongs: users, jobs, workflows, purpose, success, positioning, operating context,
capabilities, constraints, terminology, evidence, platform, accessibility, confirmed
voice, assets and brand commitments. What stays out: visual worlds, palettes, type,
components or page concepts; visitor mode, narrative, call-to-action or proof sequence
and other per-surface strategy (those go in a surface brief); any invented testimonial,
customer, benchmark, price, licence or deployment claim.

**Done when** every material gap is answered, marked undecided, or labelled inferred
after a failed probe.

## Step 4: Write PRODUCT.md

Write confirmed facts and explicitly marked open decisions only; omit sections that do
not apply.

```markdown
# Product

<!-- product-schema 1 -->

## Platform

web

## Stack
[Greenfield only: "static HTML/CSS", "Astro", or "delegated: <choice and why>". Omit when the codebase already answers it.]

## Users
[Primary users, their situation and job. Other audiences only when confirmed.]

## Product Purpose
[What it does, why it exists, what success means.]

## Positioning
[The mechanism or claim a neighbouring product could not truthfully copy.]

## Operating Context
[Workflows, environments, tools, documents, materials and rituals that are factual parts of using or evaluating it.]

## Capabilities and Constraints
[Confirmed functionality, technical constraints, terminology, explicitly undecided facts.]

## Brand Commitments
[Existing name, voice, assets, personality, identity constraints and references the user made binding. Omit when none.]

## Evidence on Hand
[Real content, data, demos, testimonials, case studies, press and assets, with paths. State absences future work must not fabricate.]

## Product Principles
[Three to five durable strategic principles from confirmed answers; no visual recipes.]

## Accessibility & Inclusion
[Known user needs or required standard. Omit when none was established.]
```

`## Platform` holds the bare value. Keep useful headings an older file already has.
Keep the `product-schema` comment verbatim on every write: it tells a later run that a
short record is deliberate rather than written before a section existed. Raise its number
only when this template changes. When a later template retires a section, delete it once
the user agrees.

When the platform is `ios`, `android` or `adaptive`, read
[ios.md](../../sf-frontend-ui/references/ios.md),
[android.md](../../sf-frontend-ui/references/android.md) or both before any design work:
a session that started without PRODUCT.md had no way to load them.

**Done when** PRODUCT.md exists at the resolved path, carries the confirmed record and
the schema comment, and you have read it back. Interview notes or later design prose never
stand in for the file.

## Step 5: Record workflow defaults

**Build path.** When an image tool exists (DESIGN SETUP in [SKILL.md](../SKILL.md) finds
`DESIGN_READY` with image generation) and none is recorded, ask once, as its own decision
brief, how new Persuade and Experience surfaces start
([modes](../../sf-frontend-ui/SKILL.md#modes)):

- **comp-first:** an image sets the bar before any code; bolder composition, slower, and
  the build must match the image.
- **code-first:** build directly; the ambition is written into the direction contract and
  audited at the finish; leaner and faster.

Say in the question that app screens and documents are built code-first either way.
Write only the answer received to `.design/config.json` as `"buildPath": "comp"` or
`"code"`, merged with existing keys (`.design/config.local.json`, gitignored, wins on one
machine). A recommendation is not an answer and silence is not a value: with no answer,
record nothing and say in one line which path this session takes (comp-first on a
Persuade or Experience surface when images exist, code-first otherwise). A recorded value
is a confirmed answer: honour it without asking again. This is a workflow setting, never
product truth, so it stays out of PRODUCT.md. Without image generation there is no
choice: code-first.

**Live mode.** For a runnable web project, when the design-check CLI is present, offer its
live-mode setup ([shotgun/live.md](../shotgun/live.md), First-time setup), leaving any
existing live config untouched; any content-security-policy edit needs its stated consent.

**Done when** the build path is recorded, or its absence is stated with this session's
path, and live setup was offered or ruled out.

## Step 6: Wrap up or resume

Summarise what was captured and what is deliberately undecided. A missing DESIGN.md alone
is no reason to offer one.

If another job invoked this one, resume it now. Otherwise suggest the next step from the
project's state:
- empty or early project: name the surface to build, or plan it first with
  [shape.md](shape.md);
- coherent interface with no DESIGN.md: the record job,
  [document.md](document.md);
- an existing surface needing work: the matching `/sf-design refine` move;
- web project ready for visual iteration: `/sf-design shotgun`.

**Done when** the summary is given and either the calling job has resumed or one next step
is suggested.
