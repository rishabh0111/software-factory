# Shape: plan before design

The planning job of [consultation](../consultation.md): discover what should be made and
how it should work, then return a confirmed design brief. It comes before any visual
design and writes no code and no direction contract. Run it when the user wants a
surface or feature planned first ("shape", "plan the UX", "brief before building"), or
when another mode finds the request too open to design against.

Needs PRODUCT.md: when it is missing, run [product.md](product.md) first, then come back.

## Step 1: Discovery interview

Choose no visual direction yet. Ask with decision briefs, two or three related questions
per round, then wait. One round is the default; a second only when the answers expose a
material gap. Assert the likely reading and invite correction rather than handing over a
questionnaire; leave settled facts settled. A sparse prompt needs at least one answer
round; a precise one needs only a compact confirmation.

**Round 1, purpose, people and outcome** (pick the two or three that most change the
result):
- What is this surface or feature for, and what problem must it solve?
- Who reaches it, in what situation and state of mind?
- What is the one thing they must understand or do, and what does success look like?
- What is true here that a neighbouring product or a template could not claim?

**Round 2, material, behaviour and boundaries** (only for open material decisions):
- What real content, evidence, data and assets must it carry, with realistic minimum,
  typical and maximum ranges?
- Which states and transitions matter: first run, empty, loading, error, success,
  permissions, overflow, expert use?
- What fidelity, breadth and interactivity: exploration, a production screen, a full
  flow, a wider surface?
- What must stay untouched, and what would make a polished result feel wrong?
- Which platform, framework, performance, accessibility, localisation or delivery
  constraints bind?

Questions name outcomes, never CSS values or canned style lanes: visual world and concept
belong to [new-work.md](new-work.md).

**Done when** every material question has an answer, or is marked as an assumption after
the second round.

## Step 2: Resolve the direction (only when the work needs one)

For a new surface, a brand expansion or a replacement world, run
[new-work.md](new-work.md) through its sections 1 to 4 (what is already true, the ask,
the amount of invention, the committed world), reusing this interview, and return here
before its section 5 (the contract) and before any build. Inside an established world,
use its structure round only when composition or interaction is still materially open.

**Done when** a direction is chosen, or the work is an extension that inherits its
surface.

## Step 3: Write the brief

Write the smallest useful brief:

1. **Job and audience:** who arrives, their context and need, and the surface's mode
   ([modes](../../sf-frontend-ui/SKILL.md#modes)).
2. **Outcome and proof:** the primary task or action, success, real evidence, the
   product-specific truth.
3. **Selected direction:** visual authority, the structural or interaction thesis,
   sequence, focal moment, and what it means for the build.
4. **Scope and boundaries:** fidelity, breadth, interactivity, the named target, what
   stays untouched, explicit anti-goals.
5. **States and ranges:** realistic content and data ranges, the material states.
6. **Interaction and layout:** hierarchy, topology, responsiveness, affordances, feedback,
   transitions; intent, not CSS.
7. **Constraints and open decisions:** platform, delivery, accessibility, localisation,
   reusable components, and the choices a builder must not invent.

Three to five bullets when the task is settled; the full structure only for ambiguous,
multi-screen or standalone planning. The brief states decisions, not the conversation.
Save it in the specs folder named in
[work-docs.md](../../../references/work-docs.md).

**Done when** the brief is saved and covers every section that applies.

## Step 4: Confirm and stop

Present the brief for explicit confirmation or one correction round, then stop. With no
one to answer, mark the assumptions plainly, save the brief and stop. Suggest the next
step: `/sf-design shotgun` to see options, `/sf-design direction` to build a public page
or app screen, or `/sf-plan` to turn the brief into an implementation plan.

**Done when** the user confirmed the brief (or the assumptions are marked) and one next
step is suggested.
