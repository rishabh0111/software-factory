---
name: sf-design
description: Design work in six modes - consultation (product context, planning, design system and new visual worlds), shotgun (variants on a comparison board), direction (art-directed build of a page or app screen), html (production HTML), refine (one improvement move) and critique (score built UI).
disable-model-invocation: true
---

# Design

Each mode is a complete method in its own file:

| Mode | Reach for it when | Method |
|---|---|---|
| **consultation** | the project needs product context, a plan or a design system: "PRODUCT.md", "shape this", "plan the UX", "design system", "brand guidelines", "create/record DESIGN.md", "new visual direction", "redesign the look", or a new project's UI has no DESIGN.md yet | [consultation.md](consultation.md) |
| **shotgun** | the user wants to see options: "explore designs", "show me options", "design variants", "variants of this element", "visual brainstorm", "live mode", "I don't like how this looks", or a UI feature is described but not yet seen | [shotgun.md](shotgun.md) |
| **direction** | a public-facing page or an app screen must be built end to end with an art direction: "build a landing page", "make this site look designed", "it looks generic / AI-made", "a dashboard that doesn't look like a template" | [direction.md](direction.md) |
| **html** | a design is approved or a direction contract is recorded and needs to become real: "finalize this design", "turn this into HTML", "implement this design", "code the mockup", "build from the comp" | [html.md](html.md) |
| **refine** | something built needs one improvement: "polish", "bolder", "quieter", "simplify", "harden", "onboarding", "animate", "add colour", "fix the type", "fix the layout", "delight", "go further", "clearer copy", "make it responsive", "make it faster" | [refine.md](refine.md) |
| **critique** | built or rendered UI needs judging: "critique", "review the design", "audit", "score this page", "accessibility check" | [critique.md](critique.md) |

Every mode builds on the quality floor in [sf-frontend-ui](../sf-frontend-ui/SKILL.md#quality-floor)
and links to its depth instead of restating it. Working files go in `.design/` at the project
root; user-facing designs go in the designs directory (path rule below). Third-party sources
and their licences: [NOTICE](NOTICE).

The mode the user named wins. Otherwise pick from the table and say which mode
you are running in one line. Read that mode's method file in full and execute it
top to bottom. When a mode's next-step menu names another mode, continue to it
the same way.

## The designer

Use the **designer** by default to turn design briefs into real visual mockups. The
designer is the image-generation tool recorded in `docs/agents/tools.md`; without
one, HTML/CSS mockups rendered in the browser and captured as screenshots.

Operations: `generate` (single mockup), `variants` (multiple directions), `compare`
(side-by-side review board), `iterate` (refine with feedback), `check` (quality
gate: judge the image against its brief), `evolve` (improve from screenshot),
`extract` (read the colors, typography, spacing, layout and component inventory
off an approved image).

Setup is handled by the DESIGN SETUP section below. If it finds `DESIGN_READY`,
the designer is available and you should use it.

## DESIGN SETUP (run this check BEFORE any design mockup command)

Read `docs/agents/tools.md` for the designer: a recorded image-generation tool, or
HTML authoring plus a browser that can render a page and capture a screenshot (the
headless browser CLI recorded there; without one, the chrome-devtools MCP).
Either one means `DESIGN_READY`; neither means `DESIGN_NOT_AVAILABLE`.

If `DESIGN_NOT_AVAILABLE`: skip visual mockup generation. Design mockups are a
progressive enhancement, not a hard requirement. Each mode says what it does instead.

Comparison boards are local HTML files: open them with `open file://...` on macOS
(`xdg-open` elsewhere). The user just needs to see the file in their default browser.

If `DESIGN_READY`: the designer is available for visual mockup generation.
Image operations never overwrite (a taken name gets `-2`); for each round record
how many images were `requested`, which were `saved` (their paths) and every
`failures` entry. Briefs and feedback are free text: write each into a file in
the design directory with your file-write tool, never inline in a shell command.

**Path rule:** Design artifacts belong in the **designs directory**: the designs
folder named in [work-docs.md](../../references/work-docs.md). Keep them even if
temporary; a plan file's Approved Mockups table links into it. These are user files, not
application source. Cross-session state (the taste profile, learnings) lives in
`.claude/design/` at the repo root.

## Asking: the decision brief

Every AskUserQuestion is a decision brief:

```
D<N> — <one-line question title>
Project/branch/task: <1 short grounding sentence using the current branch>
ELI10: <plain English a 16-year-old could follow, 2-4 sentences, name the stakes>
Stakes if we pick wrong: <one sentence on what breaks, what user sees, what's lost>
Recommendation: <choice> because <one-line reason>
Completeness: A=X/10, B=Y/10   (or: Note: options differ in kind, not coverage — no completeness score)
Pros / cons:
A) <option label> (recommended)
  ✅ <pro — concrete, observable, ≥40 chars>
  ❌ <con — honest, ≥40 chars>
B) <option label>
  ✅ <pro>
  ❌ <con>
Net: <one-line synthesis of what you're actually trading off>
```

D-numbering: first question in a skill invocation is `D1`; increment yourself. This is a model-level instruction, not a runtime counter.

ELI10 is always present, in plain English, not function names; Recommendation is ALWAYS present. Keep the `(recommended)` label.

Completeness: use `Completeness: N/10` only when options differ in coverage. 10 = complete, 7 = happy path, 3 = shortcut. If options differ in kind, write: `Note: options differ in kind, not coverage — no completeness score.` Do not fabricate scores.

`Pros / cons:` in question text; descriptions use literal ✅/❌ bullets, not Pro:/Con:. Each real option: ≥2 pros and ≥1 con, ≥40 chars each. One-way/destructive escape: `✅ No cons — this is a hard-stop choice`.

Neutral posture: `Recommendation: <default> — this is a taste call, no strong preference either way`; `(recommended)` STAYS on the default option.

Effort both-scales: when an option involves effort, label both human-team and CC time, e.g. `(human: ~2 days / CC: ~15 min)`, so AI compression is visible at decision time.

`Net:` line closes question text. Per-mode instructions may add stricter rules.

**5+ options — split, never drop.** AskUserQuestion caps every call at **4
options**. With 5+ real options, NEVER drop, merge or silently defer one to fit:
**batch into ≤4-groups** (coherent alternatives) or **split per-option**
(independent scope items; the default when unsure): sequential `D<N>.k` calls,
each with its ELI10, Recommendation, kind-note and buckets **A) Include, B)
Defer, C) Cut, D) Hold** (stop chain, discuss); a `D<N>.final` validates the
assembled set; for N>6 fire a `D<N>.0` meta-question first.

**Tool resolution.** Prefer any `mcp__*__AskUserQuestion` variant in your tool
list (hosts may disable native); otherwise use native AskUserQuestion. If a call
errors before the user could have seen it, retry the SAME call once.

**Prose fallback — when AskUserQuestion is unavailable, render the decision brief as a markdown message, not a tool call.** Same information as the tool format above in paragraphs, not ✅/❌ bullets. It MUST surface this triad:

1. **A clear ELI10 of the issue itself** — plain English on what's being decided and why it matters (the question, not per-choice), naming the stakes. Lead with it.
2. **Completeness scores per choice** — explicit on EACH choice, per the Completeness rule above; never drop the score.
3. **The recommendation and why** — the `Recommendation: <choice> because <reason>` line plus the `(recommended)` marker on that choice.

Layout: a `D<N>` title; an explicit reply line listing the offered selectors; the issue ELI10; the Recommendation line; ONE paragraph per choice with its `(recommended)` marker, `Completeness: X/10`, and 2-4 sentences of reasoning (never a bare bullet list); a closing `Net:` line. Split chains / 5+ options: one prose block per per-option call, in order. Before an interactive prose question, finish the tool calls that do not depend on its answer; then send the complete brief as the turn's final message and STOP and wait for the typed answer. In plan mode this satisfies end-of-turn like a tool call.

**Continuation — mapping a typed reply back to a brief.** Each brief carries a stable label (`D<N>`, or `D<N>.k` in a split chain) the user references (e.g. "3.2: B"). A bare letter maps to the most-recent UNANSWERED brief; if more than one is open (a split chain), do NOT guess — ask which `D<N>.k` it answers.

**One-way / destructive confirmations in prose.** Require an explicit typed confirmation (the exact option letter or word), state plainly what is irreversible, and NEVER proceed on a vague, partial or ambiguous reply — re-ask.

## Completion

Done when the chosen mode has reached its own final step, as its Completion or last
step states: consultation has written its job's file (DESIGN.md or the plan's Proposed
DESIGN.md after Q-final, PRODUCT.md, a confirmed brief, or a recorded direction
contract); shotgun has saved `approved.json` and offered next steps (its live branch ends
with the accepted variant in source and no `approved.json`); direction has delivered its
report; html has saved `finalized.json` (a contract build also its finish verdict and
DESIGN.md) and offered next steps; refine has run its move to that move's done criteria;
critique has delivered its report and closed with questions.

Report status using one of:
- **DONE** — completed with evidence valid for the final consumed inputs; name reuse and anything not independently verified.
- **DONE_WITH_CONCERNS** — completed, but list concerns.
- **BLOCKED** — cannot proceed; state blocker and what was tried.
- **NEEDS_CONTEXT** — missing info; state exactly what is needed.
