# Polish: the final pass before shipping

A move of [refine mode](../refine.md). The shared preamble, verification rules,
snapshot format and next steps are there.

**Needs:** the quality bar and the shipping constraints (time, deliberately
unfinished work).

Polish is refinement, never concealed redesign: the incumbent world, content,
behaviour and everything outside scope stay. It is the wrong move when the concept
itself is wrong (say so; suggest `/sf-design direction`, or the bolder move for one
flat section) and when the feature is not functionally complete (finish it
first). Polish consumes a critique as its backlog; scoring belongs to
`/sf-design critique`.

Craft depth: [the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor),
[app-screens.md](../../sf-frontend-ui/references/app-screens.md) on Operate
surfaces, [tells.md](../../sf-frontend-ui/references/tells.md).

## 1. Establish the system

Read DESIGN.md and representative tokens, shared components, patterns and
neighbouring flows; with no formal system, use the project's coherent conventions.
Classify each drift before fixing it:

- **missing token**: the system needs a reusable value;
- **one-off implementation**: an existing shared component or pattern should replace it;
- **conceptual mismatch**: flow, information architecture or hierarchy differs from comparable areas;
- **local defect**: the implementation is incomplete or inconsistent.

Fix the cause at the narrowest correct level. Ask when a binding system principle
cannot be inferred. Done when every drift you found carries one of the four labels.

## 2. Gather the evidence

Use the feature yourself at its representative sizes (web: desktop and mobile;
native: the shipped device classes on simulator, emulator or hardware). Determine
whether the path is functionally complete, the quality bar and time available,
known constraints or deliberately unfinished work, and the states, content
lengths, roles and input methods users will meet.

Read the prior critique as one input. With the CLI, its critique-storage `latest`
for the resolved target (JSON with the snapshot `body` and its `snapshot_file`);
exit 2 means none exists or the target changed. Without it, find the latest
snapshot under `.design/critique/<slug>/` and test whether it is current (rule in
[refine.md](../refine.md#critique-snapshots)); a stale one gets `status: closed`.
When current, take its P0/P1 findings into the backlog, name the snapshot read,
and keep its file path until step 5. Run your own independent pass either way.

Done when you have used the path end to end and hold a backlog: the snapshot's
P0/P1 items (if current) plus what your pass found.

## 3. Triage

Separate functional defects from cosmetic ones and fix in this order:

1. broken or blocked tasks, data loss, misleading state, inaccessible paths;
2. missing loading, empty, error, success, disabled and permission states;
3. flow, hierarchy, responsive and design-system drift;
4. visual and motion inconsistencies;
5. code and asset cleanup.

Bring the whole path to one bar before perfecting any corner. Done when every
backlog item has a tier.

## 4. Polish the whole path

- **Flow and hierarchy.** Match neighbouring mental models, terminology,
  disclosure, routing, save behaviour and optimistic or pessimistic patterns. Make
  the primary task and current state obvious while keeping a hierarchy. Connect
  arrival, transition, empty and recovery paths.
- **Layout and type.** Align to the grid and spacing scale, optically as well as
  mathematically. Keep same-role type consistent; test measure, wrapping,
  localisation expansion, zoom and font loading at every supported viewport, not
  only the current screenshot.
- **Colour, imagery, icons.** Semantic tokens with stable meanings across themes;
  contrast in every state; one icon family, stroke and size, optically aligned;
  images with correct aspect ratios, responsive sources, useful alt text and no
  layout shift.
- **Interaction and state.** Every control's states; visible focus, logical tab
  order, labels, platform touch targets. Motion coherent, interruptible and
  performant; add none just to make polish visible. Validate long, missing,
  localised, offline, slow and permission-limited content where the product meets it.
- **Content and code.** Consistent terminology, capitalisation and punctuation;
  ask before changing claims. Remove debug output, dead code, unused imports,
  obsolete styles and polish-created duplication. Replace custom implementations
  with the shared component where the system owns the pattern. Promote genuinely
  reusable values to tokens; a single local exception stays local.

Done when every backlog item is fixed or recorded as a narrow intentional exception.

## 5. Verify and finish

Walk the whole path again with mouse, keyboard and touch where they apply, in one
batched round:

- web: mobile, intermediate and wide layouts and the supported browsers; native:
  phone and tablet size classes in both supported orientations and the supported
  OS versions;
- loading, empty, error, success, disabled, long-content and missing-content states;
- zoom, contrast, focus, semantics, screen-reader names;
- console errors and runtime warnings, layout shift, interaction latency, image
  loading, dropped frames on native;
- agreement with DESIGN.md, neighbouring features and the user's scope.

If the design-check CLI is present, run its `detect` on the changed files once and
fix the real findings; a clean scan does not replace your look. Finish with a
source diff review: remove accidental churn, orphaned code, redundant values and
temporary artifacts.

Close the snapshot when this pass cleared every P0/P1 it took from it: the CLI's
critique-storage `close` with the target and the retained `snapshot_file`, or set
`status: closed` in the retained snapshot file. Close only the snapshot you read;
a newer critique keeps its backlog live. Leave it open when no snapshot was read,
its path was not retained, or priority issues remain.

Done when the feature is functionally complete and consistently finished across
the path, the diff is clean, and the snapshot is closed or the reason it stays
open is stated.
