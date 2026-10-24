# Critique: personas

A design review lens of the [critique rubric](rubric.md#design-review-lenses). Five archetypes, each
exposing failures a single design-director view misses. Select two or three by
[interface type](#selecting-personas), walk the primary action as each, and report the specific red
flags you found: the exact elements and interactions that failed them, never a description of the
persona.

## Alex, the impatient power user

Expert with similar products; expects efficiency, hates hand-holding; finds shortcuts or leaves.
Skips onboarding, looks for shortcuts at once, tries to bulk-select and batch-edit, resents
unnecessary steps, abandons anything slow or patronising.

Test: core task done in under 60 seconds? Shortcuts for common actions? Onboarding skippable? Modals
dismiss with Esc? A power path (shortcuts, bulk actions)?

Red flags: forced or unskippable tutorials; no keyboard path for primary actions; slow animations that
cannot be skipped; one-at-a-time workflows where batch is natural; redundant confirmations for
low-risk actions.

## Jordan, the confused first-timer

Has never used this kind of product; needs guidance at every step; abandons rather than works it out.
Reads every instruction, hesitates before anything unfamiliar, looks for help constantly, misreads
jargon, takes every label literally.

Test: the first action obvious within five seconds? Every icon labelled with text? Help at decision
points? Terms that assume prior knowledge? A clear back or undo at every step?

Red flags: icon-only navigation; unexplained jargon; no visible help; an ambiguous next step after an
action; no confirmation that an action succeeded.

## Sam, the accessibility-dependent user

Screen reader (VoiceOver, NVDA), keyboard only; may have low vision, a motor impairment or cognitive
differences. Tabs through linearly, relies on labels and heading structure, cannot see hover or
visual-only cues, needs the floor's contrast, may zoom to 200%.

Test: the whole primary flow keyboard-only? Every interactive element focusable with a visible focus?
Meaningful alt text? Contrast at the
[floor's ratios](../../sf-frontend-ui/SKILL.md#quality-floor)? State changes (loading, success,
errors) announced?

Red flags: click-only interactions; missing or invisible focus; meaning carried by colour alone;
unlabelled fields or buttons; time limits with no extension; custom components that break the screen
reader's flow.

## Riley, the deliberate stress tester

Methodical; pushes past the happy path and probes for gaps. Tries empty states, long strings, emoji,
RTL text and pasted spreadsheet data; navigates backwards, refreshes mid-flow, opens several tabs;
compares what the UI promises with what happens.

Test: what happens at 0 items, 1000 items, very long text? Do error states recover or leave the UI
broken? Is state kept on refresh mid-workflow? Anything that seems to work but gives a wrong result?

Red flags: features that silently fail or produce wrong results; errors that expose technical details
or leave the UI broken; empty states with no guidance ("No results" and nothing else); data lost on
refresh or navigation; similar interactions behaving differently in different places.

Critique records what Riley sees on the surface; a flow that is functionally broken is a `/sf-qa`
finding, suggested in passing.

## Casey, the distracted phone user

One-handed, on the go, often interrupted, possibly on a slow connection. Thumb only, prefers actions
low on the screen, leaves and returns mid-flow, switches apps, types as little as possible.

Test: primary actions in the thumb zone (bottom half)? State kept across an interruption? Usable on a
slow connection? Autocomplete and smart defaults on forms? Touch targets at the floor's size?

Red flags: important actions at the top of the screen; progress lost on a tab switch; free-text inputs
where a selection would do; heavy assets on every page with no lazy loading; tiny or crowded targets.

## Selecting personas

| Interface type | Personas | Why |
|---|---|---|
| Landing page, marketing | Jordan, Riley, Casey | first impressions, trust, phone |
| Dashboard, admin | Alex, Sam | power use, accessibility |
| E-commerce, checkout | Casey, Riley, Jordan | phone, edge cases, clarity |
| Onboarding flow | Jordan, Casey | confusion, interruption |
| Data-heavy, analytics | Alex, Sam | efficiency, keyboard |
| Form-heavy, wizard | Jordan, Sam, Casey | clarity, accessibility, phone |

## Project-specific personas

When PRODUCT.md describes the audience, derive one or two more personas: read the audience, find the
primary archetype the five above miss, and write it in this shape:

```
### <Role>, "<Name>"
Profile: 2-3 characteristics taken from PRODUCT.md
Behaviours: 3-4 behaviours of that audience
Red flags: 3-4 things that would alienate this user
```

Derive them only from real product context; with none, the five above are the set.
