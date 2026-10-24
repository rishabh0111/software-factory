# Overdrive: past conventional limits

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the user's pick of one direction (step 2), always.

Open the run with one line saying overdrive is running and that it proposes
directions before building.

Overdrive uses the full power of the platform to make one part of an interface feel
extraordinary: a table that handles a million rows, a dialog that morphs from its
trigger, a form that validates in real time, a cinematic page transition. Context
decides what extraordinary means: a particle system suits a creative portfolio and
embarrasses a settings page, where instant optimistic saves and animated state
transitions are the extraordinary version. It enhances how an interface feels, not
what the product does: real-time collaboration, offline support or new backend
capability are product decisions. It is the wrong move to cover weak fundamentals
(fix those with the other moves first) and for ordinary motion (animate).

Craft depth: [motion.md](../../sf-frontend-ui/references/motion.md), the floor's
motion line ([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)),
[performance-checklist.md](../../../references/performance-checklist.md).

## 1. Decide what extraordinary means here

Ask what would make a user of this interface say "that's nice":

- **Visual and marketing surfaces** (pages, heroes, portfolios): often sensory: a
  scroll-driven reveal, a shader background, a cinematic transition, generative art
  that answers the cursor.
- **Functional UI** (tables, forms, dialogs, navigation): how it feels: a dialog
  morphing from its button through View Transitions, a 100k-row table at 60fps
  through virtual scrolling, streaming validation, drag and drop with spring physics.
- **Performance-critical UI**: invisible but felt: a search filtering 50k items
  without a flicker, a complex form that never blocks the main thread, near-real-time
  image processing.
- **Data-heavy interfaces**: fluidity: Canvas or WebGL rendering for large datasets,
  animated transitions between data states, force-directed layouts that settle.

Done when the kind of extraordinary for this surface is named in one line.

## 2. Propose before building

This move misfires most easily, so no code before the user picks:

1. Think through two or three directions that differ in technique, ambition and
   aesthetic, each described as what the result looks and feels like.
2. Ask with a decision brief; each option carries its description and trade-offs
   (browser support, performance cost, complexity) inside the option, since a
   structured question hides any text written beside it.
3. Build only the direction the user confirms.

Done when the user has confirmed one direction.

## 3. Pick from the toolkit

By what you are trying to achieve:

- **Cinematic transitions**: View Transitions API (same-document in all browsers;
  cross-document not in Firefox) for shared-element morphs; `@starting-style` (all
  browsers) to animate from `display: none`; spring physics (mass, tension, damping)
  through the project's motion library, GSAP, or your own solver.
- **Scroll-linked motion**: `animation-timeline: scroll()` (Chrome, Edge, Safari;
  Firefox behind a flag), always with a static fallback.
- **Rendering beyond CSS**: WebGL (all browsers; Three.js, OGL, regl) for shaders,
  post-processing, particles; WebGPU (Chrome, Edge, Safari 26+, Firefox on Windows
  and macOS) with a WebGL2 fallback; Canvas 2D and OffscreenCanvas in a worker;
  SVG filter chains (displacement, turbulence, morphology).
- **Living data**: virtual scrolling (by hand for simple cases, TanStack Virtual for
  complex), GPU charts (deck.gl, regl), animated transitions between chart states
  (D3 `transition()` or View Transitions).
- **Complex properties**: `@property` (all browsers) to animate gradients and typed
  values; the Web Animations API for composable, cancellable, reversible
  choreography.
- **Performance boundaries**: Web Workers for heavy computation, OffscreenCanvas for
  off-thread rendering, WASM for codecs, physics and image processing.
- **Device**: Web Audio (after a user gesture) for spatial or reactive sound;
  orientation, ambient light, geolocation sparingly and with permission.

Done when the confirmed direction maps to named techniques and their fallbacks.

## 4. Implement with discipline

Every technique degrades gracefully, and the experience without it is still good:

```css
@supports (animation-timeline: scroll()) {
  .hero { animation-timeline: scroll(); }
}
```

```javascript
if ('gpu' in navigator) { /* WebGPU */ }
else if (canvas.getContext('webgl2')) { /* WebGL2 fallback */ }
/* the CSS-only fallback must still look good */
```

- Target 60fps; below 50, simplify.
- Heavy resources (WebGL contexts, WASM modules) initialise lazily near the viewport.
- Off-screen rendering pauses.
- Test on real mid-range devices.
- Sound only with explicit opt-in; every bleeding-edge API has a working fallback.
- One extraordinary moment; competing ones turn focus into noise.

The gap between cool and extraordinary is the last 20%: the spring's easing, the
stagger offset, the secondary motion that makes a transition feel physical. Keep
refining past the first version that works.

## 5. Verify in the browser

Ambitious effects rarely work first time; an effect that runs can still stutter,
ease wrong or land on the wrong frame. Look at timing, easing and smoothness in the
browser (per [browser.md](../browser.md)), batch the fixes between looks, and keep
going until it is right.

## Done when

- **Wow**: someone who has not seen it reacts.
- **Removal**: taking it away diminishes the experience.
- **Device**: smooth on a phone, a tablet and a low-end laptop.
- **Context**: it makes sense for this brand and audience.
- Without the enhancement, the fallback still looks good.
