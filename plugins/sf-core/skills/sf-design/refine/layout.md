# Layout: priority as reading order, grouping and rhythm

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** nothing beyond the shared preamble; the rendered states are the evidence.

Layout turns product priority into reading order, grouping, rhythm and usable
space. Diagnose the structural problem before moving boxes. The move changes
structure inside the established world; replacing the identity is
`/sf-design direction`, and adapting to another device or medium is the adapt move.

By mode ([modes](../../sf-frontend-ui/SKILL.md#modes)):
- **Persuade, Experience**: composition may be asymmetric, fluid or deliberately
  disruptive when the world earns it.
- **Operate, Read**: predictable structure, stable density and navigable linearity
  are affordances.
- **Native**: [ios.md](../../sf-frontend-ui/references/ios.md) and
  [android.md](../../sf-frontend-ui/references/android.md) for navigation, insets,
  adaptation and touch targets.

Craft depth: the floor's space line
([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)),
[layout.md](../../sf-frontend-ui/references/layout.md), and on Operate surfaces
[app-screens.md](../../sf-frontend-ui/references/app-screens.md).

## 1. Two isolated assessments

Run the layout assessment before you see any mechanical findings. With a subagent
tool, dispatch a general-purpose subagent for the scan while you assess; otherwise
assess first, then scan.

**Layout assessment.** Across representative states and viewports, answer each
with rendered or source evidence:

- **Reading order**: the squint test. With detail blurred, the primary element, the
  secondary element and the major groups are identifiable, in order.
- **Grouping**: related items close and distinct groups apart, or containers
  compensating for weak proximity.
- **Rhythm**: tight and generous intervals in a deliberate cadence, or one spacing
  value repeated until everything weighs the same.
- **Structure**: the topology fits the content and task; repeated cards, columns or
  sections are genuinely equivalent, not a framework default.
- **Density**: information per region fits use frequency, decision complexity and
  mode.
- **Adaptation**: at narrow, intermediate, wide, zoomed and localised states, what
  reorders, collapses, wraps, scrolls or stays fixed; DOM and focus order agree with
  visual order.
- **Extremes**: long content, empty states, overlays, sticky elements, safe areas
  and small touch targets expose no structural failure.

**Mechanical scan.** If the design-check CLI is present, run its
`detect --json --scope layout` over the target files or directories. Otherwise
write a small script in the scratch area that lists every distinct margin, padding,
gap, width and `z-index` value in the target's styles with file and line, and on
the render read the computed spacing of each group and check for horizontal
overflow at 320-390px (per [browser.md](../browser.md)). Either way, also inspect
arbitrary spacing, overflow, stacking and container behaviour a scan cannot
resolve.

Synthesise both before editing. A clean scan cannot prove hierarchy or rhythm.
Done when every assessment question has evidence and the scan's findings are listed.

## 2. Set the spatial thesis

Name the primary reading or task path; what belongs together and what must
separate; which element leads and which supports; the density and spacing rhythm;
how the structure changes across containers, viewports, input modes and content
extremes. Choose the simplest structural model that expresses those relationships,
with layout primitives chosen for the relationships they control and spacing and
container roles named semantically. Done when the thesis is written.

## 3. Apply

- Group by meaning, with proximity before containers or decoration.
- Rhythm from deliberate contrast between tight and generous intervals.
- A documented spacing scale; a 4-unit base gives the middle steps an 8-only scale
  misses.
- Hierarchy follows product priority, not framework defaults.
- Distinct content stays distinct without turning every group into a component.
- Responsive behaviour is structural: reorder, collapse, reflow or reveal by what
  stays important.
- Container-aware components when one component lives in several contexts.
- `gap` for sibling rhythm where it states the relationship more directly than
  child margins.
- Touch targets stay usable even when their visible marks are small.
- Depth only where it clarifies state or hierarchy.
- Optical corrections only after looking at the render.

Repetition supports recognition; break it only when content or priority changes.
Done when the thesis is built.

## Done when

Answer each with rendered or source evidence, then rerun the scan:

- The squint test shows primary, secondary and major groups in order.
- The reading and task path is clear at every supported size.
- Related content groups naturally; unrelated content stays apart.
- Spacing has an intentional rhythm.
- Density matches use frequency and content complexity.
- Long text, empty states, localisation, zoom and dynamic content keep the structure.
- Keyboard, touch and assistive-technology order agree with visual order.
- The final scan has no unexplained findings.

## Variant parameter (shotgun live variants)

When shotgun mode's live browser variants run this move, every variant declares a
coarse `density` parameter and authors spacing against `var(--p-density, 1)`:

```json
{"id":"density","kind":"range","min":0.6,"max":1.4,"step":0.05,"default":1,"label":"Density"}
```

One more structural parameter only when the topology genuinely branches. The
parameter contract is in [shotgun.md](../shotgun.md).
