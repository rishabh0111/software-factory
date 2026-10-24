# Optimize: find the bottleneck, fix it in code

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the slow path users complain about, and the devices and networks they use.

Performance is a feature. Optimize diagnoses the actual bottleneck of this
interface and fixes it in code; optimizing what is not slow spends effort on
nothing. Measured before-and-after numbers, baselines and regression tracking are
`/sf-benchmark`, which this move suggests when it ends. It is the wrong move for
missing loading or offline states (harden) and for jank in one animation whose
design is the problem (animate).

Checklist depth: [performance-checklist.md](../../../references/performance-checklist.md)
(Core Web Vitals targets, image, JavaScript, CSS, font, network and rendering
items). Responsive images are in [adapt.md](adapt.md#responsive-reference).

## 1. Diagnose

1. **Read the current state**: Core Web Vitals (LCP, INP, CLS), first contentful
   paint and time to interactive, total blocking time, bundle sizes (JS, CSS,
   images), frame rate, memory and CPU, request count, payloads and the waterfall.
   Use the browser's performance trace and Lighthouse per [browser.md](../browser.md),
   the bundle analyser, and the project's monitoring (Sentry, DataDog, New Relic)
   or CrUX field data when available. A quick reading here is diagnosis; the
   recorded baseline is `/sf-benchmark`'s.
2. **Find the bottleneck**: what is slow (initial load, interactions, animation),
   what causes it (large images, expensive JavaScript, layout thrash), how bad
   (perceivable, annoying, blocking), who it hits (everyone, mobile, slow
   connections). Desktop Chrome on a fast connection is not representative.

Done when the biggest bottleneck is named with the evidence that shows it.

## 2. Fix, biggest first

Work the checklist's items for the bottleneck's area, plus these:

- **Images**: compression at 80-85% quality (usually imperceptible), a CDN, no
  3000px file for a 300px slot.
- **JavaScript**: route and component splitting with lazy loading
  (`const HeavyChart = lazy(() => import('./HeavyChart'))`), unused dependencies
  removed.
- **CSS**: unused CSS removed, files minimised, `contain` on independent regions.
- **Loading strategy**: preload critical assets, prefetch likely next pages, a
  service worker for caching or offline.
- **Rendering**: batch DOM reads, then writes, never interleaved:

```javascript
const heights = elements.map(el => el.offsetHeight);        // all reads
elements.forEach((el, i) => { el.style.height = heights[i] * 2; }); // all writes
```

  Flatter, smaller DOM; `content-visibility: auto` on long lists; virtual scrolling
  for very long ones (react-window, TanStack Virtual).
- **Paint and composite**: `transform` and `opacity` for movement; blur, filters,
  masks, clip paths, shadows and colour shifts allowed where they add meaning, with
  their paint area bounded and isolated; `will-change` only on known expensive
  operations (each one is a layer and memory).
- **Animation**: 16ms per frame; `requestAnimationFrame` for JS animation; CSS
  animation where it can; no long JavaScript during an animation; scroll handlers
  debounced or throttled; `IntersectionObserver` for viewport entry instead of
  scroll math.
- **Frameworks**: fewer re-renders, memoised computed values, debounced expensive
  operations, lazy routes; inline functions in render avoided where profiling shows
  cost; React DevTools Profiler to find it.
- **Network**: small files combined, an SVG sprite for icons, small critical assets
  inlined, unused third-party scripts removed; paginated APIs, only needed fields
  (GraphQL or a narrower endpoint), gzip or brotli, caching headers, a CDN for
  static assets; adaptive loading by `navigator.connection`, optimistic UI, request
  prioritisation, progressive enhancement.
- **LCP**: hero image optimised, critical CSS inlined, key resources preloaded,
  server-side rendering where the stack supports it; above-the-fold content never
  lazy-loaded.
- **INP**: long tasks broken up, non-critical JavaScript deferred, heavy work in
  workers, less JavaScript executed.
- **CLS**: dimensions on images and video, `aspect-ratio` on containers
  (`.image-container { aspect-ratio: 16 / 9; }`), space reserved for ads and embeds,
  nothing injected above existing content, no animation that shifts layout.

Accessibility and functionality stay intact; skip micro-optimisations while a major
bottleneck remains; mobile counts as much as desktop. Done when the named
bottleneck is fixed and the next-biggest has been checked.

## 3. Check the fix

Re-read the same metrics on the same path: low-end Android as well as a flagship,
throttled to 3G, functionality regression-free, and it feels faster. Done when the
user-facing numbers moved on the bottleneck you fixed; suggest `/sf-benchmark` to
record the before and after.

## Done when

- The bottleneck is named, fixed, and its metric moved.
- Nothing regressed in function or accessibility.
- The report suggests `/sf-benchmark` for measured numbers.
