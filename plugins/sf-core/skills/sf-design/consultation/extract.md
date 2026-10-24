# Consultation: consolidate into the system

The consolidate job of [consultation](../consultation.md): pull repeated components and hard-coded
values into the design system, move every use onto the shared version, and record it. The designer,
DESIGN SETUP, the designs directory and the decision brief are in [SKILL.md](../SKILL.md).

The bar is **three or more uses with the same intent**. Duplication is cheaper than a premature
abstraction; two things that look alike but serve different purposes stay separate.

## Step 1: Find the design system

Locate the design system, component library or shared UI directory and learn its conventions:
component organization, naming, token structure, import and export patterns. Read DESIGN.md if it
exists ([format](design-md-format.md)).

When none exists, ask one decision brief for where it should live and how it should be structured
(path, token file format, component folder layout), with a recommendation that fits the project's
stack, and wait. Create nothing before the answer.

Done when: the system's location and conventions are known, or the user chose them.

## Step 2: Find what repeats

Search the target area for:

- **Repeated components:** a UI pattern built three or more times (buttons, cards, inputs).
- **Hard-coded values:** colours, spacing, type, shadows that should be tokens.
- **Inconsistent variations:** several implementations of one concept.
- **Composition patterns:** repeated layout or interaction groups (form rows, toolbar groups, empty
  states).
- **Type styles:** repeated font-size + weight + line-height combinations.
- **Animation patterns:** repeated easing, duration or keyframe combinations.

Count uses and name each one's intent. Keep a candidate only at three or more uses with one intent.
A repeated pattern that breaks the [quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) is
fixed during migration (Step 5) rather than enshrined as is.

Done when: each candidate has its use sites listed, its intent named, and a keep or drop verdict.

## Step 3: Plan the extraction

Write the plan: components to extract and their variants; tokens to create, named primitive versus
semantic in the system's own conventions; prop names; the migration path for every use. Extract what
is clearly reusable now; the system grows incrementally. Present the plan as a decision brief
(approve, trim, cancel); in plan mode the plan is the deliverable and nothing is edited.

Done when: the user approved the plan, or trimmed it and approved the rest.

## Step 4: Build the shared versions

- **Components:** a clear props API with sensible defaults, the variants the plan names, typed props
  with documentation, and accessibility built in: the floor's accessibility and states lines
  ([SKILL.md](../../sf-frontend-ui/SKILL.md#quality-floor)) hold for the shared component.
- **Tokens:** each one carries a semantic meaning, sits in the system's hierarchy and documents when
  to use it. A value with no meaning of its own stays a literal.
- **Patterns:** when to use it, a code example, its variations and combinations.

Done when: every planned component and token exists, typed and documented, and nothing unplanned
was added.

## Step 5: Migrate every use

1. **Capture before:** if BROWSER SETUP in [browser.md](../browser.md) is `READY`, screenshot each
   affected screen at the widths it ships at, in your own tab; note the tests that cover it.
2. **Replace systematically:** search for every instance found in Step 2 and move it onto the shared
   version.
3. **Verify parity:** the same screenshots again, compared side by side, and the tests run.
   Visual and functional behaviour match, except the planned fixes of floor violations, which you
   list. Without a browser, say so and compare the computed styles in code.
4. **Delete dead code:** the old implementations, now unused.

Done when: no instance of an extracted pattern remains outside the system, parity is shown (or its
gaps listed), and the old code is gone.

## Step 6: Document

Add the new components to the component library and any catalog (Storybook or the equivalent), with
token usage, values, examples and guidelines. Then update DESIGN.md: its front matter tokens and
components and the matching sections, through the Refresh path of [document.md](document.md) so every
confirmed decision is kept, with a Decisions Log row naming what was consolidated.

Done when: the catalog and DESIGN.md both show the extracted components and tokens, and DESIGN.md
reads back in its format.
