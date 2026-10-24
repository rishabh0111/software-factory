# Adapt (web): rethink for another context

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the target devices and platforms, and their usage contexts.

Adapt takes an existing design to another screen size, device, input, medium or use
case. Treating adaptation as scaling is the trap; the job is rethinking the
experience for the new context. This file is for the web, mobile web included. On
`ios`, `android` or `adaptive` targets, run [adapt-native.md](adapt-native.md)
instead. Spacing and reading-order problems at one size are the layout move.

Craft depth: the floor's responsive and accessibility lines
([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)),
[layout.md](../../sf-frontend-ui/references/layout.md),
[imagery.md](../../sf-frontend-ui/references/imagery.md).

## 1. Assess

1. **Source context**: what it was designed for (desktop web, a mobile app), the
   assumptions it made (large screen, mouse, fast connection), what works there.
2. **Target context**: device (phone, tablet, desktop, TV, watch, print), input
   (touch, mouse, keyboard, voice, gamepad), screen (size, resolution,
   orientation), connection (wifi, slow 3G, offline), usage (on the go or at a
   desk, a glance or focused reading), platform expectations.
3. **Challenges**: what will not fit (content, navigation, features), what will not
   work (hover on touch, tiny targets), what is inappropriate (desktop patterns on
   mobile, mobile patterns on desktop).

Done when each of the three has an answer for every target context.

## 2. Plan by target

- **Desktop → mobile.** Layout: one column, vertical stacking, full-width
  components, bottom navigation where it fits. Interaction: touch targets per the
  floor, nothing hover-dependent, swipe where it fits (lists, carousels), bottom
  sheets for dropdowns, controls within thumb reach, more space between taps.
  Content: progressive disclosure, primary content first and secondary in tabs or
  accordions, tighter copy, body at the floor's size. Navigation: a drawer or
  bottom bar, less depth, sticky headers for context, a back path in the flow.
- **Tablet.** Two columns, side panels for secondary content, master-detail (list
  plus detail), structure by orientation; touch and pointer both; targets per the
  floor with denser layouts than phone; side drawers; multi-column forms where
  they fit.
- **Mobile → desktop.** Multi-column layouts, persistent side navigation, several
  panels at once, max-width constraints (no stretching to 4K); hover for extra
  information, keyboard shortcuts, context menus, drag and drop where it helps,
  Shift/Cmd multi-select; more shown up front, wide data tables, richer
  visualisations, fuller descriptions.
- **Screen → print.** Page breaks at logical points; navigation, footer and
  interactive elements removed; black and white or limited colour; binding
  margins; shortened content expanded (full URLs, hidden sections); page numbers,
  headers, footers, print date and title; print-ready charts.
- **Web → email.** 600px maximum, one column, inline CSS, table-based layout for
  client compatibility; large obvious button CTAs, no hover, deep links into the
  web app for anything complex.

Keep core functionality on every context, one information architecture across
contexts, each platform's expectations, landscape on mobile and tablet, and touch
on desktop (many desktops have it); assume no device is powerful by its size. Done
when each target has its plan.

## 3. Implement

- **Breakpoints**: content-driven (stretch until the design breaks, break there);
  as a starting frame, mobile 320-767px, tablet 768-1023px, desktop 1024px+.
- **Techniques**: Grid and Flexbox to reflow, container queries for component
  context, `clamp()` for fluid values, media queries per context, display changes
  sparingly (`display: none` still downloads).
- **Touch**: larger targets with more spacing, no hover-only interactions, touch
  feedback (highlights), thumb zones (the bottom is easier to reach).
- **Content**: core content first with enhancements on larger screens, lazy
  loading off screen, responsive images (below).
- **Navigation**: drawer on mobile, bottom bar for app-like flows, persistent side
  navigation on desktop, breadcrumbs for context on small screens.

Done when every planned change is built.

## Responsive reference

- **Mobile first.** Base styles for mobile, `min-width` queries layering
  complexity; desktop-first `max-width` makes mobile load styles it discards.
- **Breakpoints.** Three usually suffice (640, 768, 1024px); `clamp()` covers
  fluid values between them.
- **Input method, not screen size.** A touch laptop and a tablet with keyboard
  break size assumptions. Query the pointer; functionality never depends on hover.

```css
@media (pointer: fine)   { .button { padding: 8px 16px; } }
@media (pointer: coarse) { .button { padding: 12px 20px; } }
@media (hover: hover)    { .card:hover { transform: translateY(-2px); } }
@media (hover: none)     { .card { /* active state instead of hover */ } }
```

- **Safe areas.** Notches, rounded corners and home indicators:

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
.footer { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- **Responsive images.** `srcset` lists real widths (`w` descriptors), `sizes`
  says how wide the image displays, and the browser picks by viewport and pixel
  ratio. `<picture>` is for art direction (a different crop), not resolution.

```html
<img src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw" alt="...">

<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

- **Patterns.** Navigation in three stages (drawer on mobile, compact horizontal on
  tablet, full with labels on desktop); tables as cards on mobile (`display: block`
  with `data-label`); `<details>`/`<summary>` for content that collapses on mobile.
- **One codebase**, feature detection over device detection.

## 4. Verify

In one batched round:

- real devices where available (at least one iPhone, one Android, a tablet when
  relevant; a cheap Android exposes performance a simulator hides), both
  orientations, Safari, Chrome, Firefox and Edge, iOS, Android, Windows and macOS,
  touch, mouse and keyboard, 320px and 4K, a throttled network. DevTools emulation
  is a first pass for layout; it misses real touch, CPU and memory, network
  latency, font rendering and browser chrome and keyboards.
- **Custom controls** (sliders, drag surfaces, scrollable control strips) in scope:
  tap it and confirm the designed response, then drag it with the target input and
  confirm the drag completes. Swipe along the page's scroll axis across it: the
  page or container scrolls and the control stays still. Drag from the control
  along its own axis: the control moves and the page stays still. Neither failure
  throws an error, so try both.

Say what produced each piece of evidence: emulated viewport, synthesized touch
through a browser tool, which engine (Chromium is not Safari), or a physical
device. Screenshots and resized viewports verify layout, never a gesture.
Unreachable hardware is a reported gap; name it and move on.

## Done when

- The adaptation feels native to each target context, with core function intact.
- Every target size, orientation and input in scope was checked, with its evidence
  source named.
- Every custom control in scope passed tap, drag and scroll-across, or its gap is named.
