# Harden: build for the data real users bring

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** target locales, supported browsers, and the API's error contract, when
the code does not show them.

A design that only works with perfect data is not production-ready. Harden designs
and builds what is missing for real inputs, errors, languages and network
conditions: error, empty, loading, permission and long-content states, i18n,
resilient input. Exercising the running app end to end to find what breaks is
`/sf-qa`; harden is the design-and-build side. It is the wrong move for a first-run
experience (onboard) or for wording alone (clarify).

Craft depth: [the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) (states,
type sizes, accessibility, responsive),
[accessibility-checklist.md](../../../references/accessibility-checklist.md),
[copy.md](../../sf-frontend-ui/references/copy.md) (error and empty-state wording),
[app-screens.md](../../sf-frontend-ui/references/app-screens.md).

## 1. Find the weak points

Run the target against each, and note what breaks:

- **Extreme inputs**: very long text (names, titles, descriptions), very short or
  empty, emoji, RTL, accents, millions and billions, 1000+ list items, 50+ options,
  no data.
- **Errors**: offline, slow, timeout; API 400, 401, 403, 404, 429, 500; validation;
  permission; concurrent operations.
- **i18n**: long translations (German runs about 30% longer), RTL (Arabic, Hebrew),
  CJK and emoji, date, time, number and currency formats.

Done when a list of failures exists, each with the input that caused it.

## 2. Harden each dimension

### Text overflow and wrapping

```css
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.line-clamp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.wrap { overflow-wrap: break-word; hyphens: auto; }
.flex-item { min-width: 0; }            /* lets flex items shrink below content size */
.grid-item { min-width: 0; min-height: 0; }
```

Containers grow with their text; text scales to 200% without breaking; inputs stay
at 16px or more on iOS Safari, which force-zooms focused inputs below that. Size
floors are in [type.md](../../sf-frontend-ui/references/type.md).

### Internationalisation

- Budget 30-40% extra space; layouts that adapt to content; test the longest
  language; no fixed widths on text containers (`px-4 py-2`, not `w-24`, on a
  button).
- RTL through logical properties (`margin-inline-start`, `padding-inline`,
  `border-inline-end`) and `[dir="rtl"] .arrow { transform: scaleX(-1); }`.
- **Arabic script** (Arabic, Persian, Urdu, Pashto, Kurdish): preserve the
  zero-width non-joiner (U+200C), which Persian and Kurdish use inside compound
  words; a sanitizer that strips it changes meaning. Store Yeh and Kaf as typed
  (Persian ی U+06CC, ک U+06A9; Arabic ي U+064A, ك U+0643) and treat them as
  equivalent in search and validation. Format digits by locale
  (`new Intl.NumberFormat('fa-IR').format(1234)` → ۱٬۲۳۴; `ar-SA` → ١٬٢٣٤).
  Respect the calendar (`new Intl.DateTimeFormat('fa-IR')` for Solar Hijri,
  `'ar-SA-u-ca-islamic'` for Hijri).
- UTF-8 everywhere; test CJK, emoji (2-4 bytes) and every script you ship.
- Dates, numbers, currency through `Intl` (`'en-US'` 1/15/2024, `'de-DE'`
  15.1.2024; `{ style: 'currency', currency: 'USD' }`).
- Plurals through the i18n library (`t('items', { count })`), never
  `item${count !== 1 ? 's' : ''}`.

### Error handling

- **Network**: a clear message saying what happened, a retry, offline mode where it
  applies, timeouts handled.
- **Forms**: inline errors at the field, specific with a suggested fix; submission
  blocked only when it must be; the user's input preserved.
- **API by status**: 400 shows validation errors; 401 goes to sign-in; 403 explains
  the permission; 404 shows a not-found state; 429 explains the rate limit; 500
  shows a general error with a way to get support.
- **Degradation**: core function without JavaScript where the stack allows,
  progressive enhancement, fallbacks for unsupported features. One failing
  component never blocks the whole interface.

```jsx
{error && (
  <ErrorMessage>
    <p>Failed to load data. {error.message}</p>
    <button onClick={retry}>Try again</button>
  </ErrorMessage>
)}
```

### Edge cases and boundaries

- **Empty**: no items, no results, no notifications, no data, each with the next
  action (empty-state design is in [onboard.md](onboard.md#empty-states)).
- **Loading**: initial, pagination, refresh; say what is loading ("Loading your
  projects..."); a time estimate for long operations.
- **Large data**: pagination or virtual scrolling, search and filter, never all
  10,000 items at once.
- **Concurrency**: no double submission (disable while pending), race conditions
  handled, optimistic updates with rollback, conflict resolution.
- **Interrupted gestures** (custom sliders, drag surfaces, scrollable control
  strips): a second pointer mid-drag leaves the first drag on its pointer or ends
  it cleanly; on `pointercancel`, `lostpointercapture`, release outside the
  control, or window `blur`, clear the dragging state and release capture; the
  next tap or drag works without a reload.
- **Permissions**: no view, no edit, read-only, each saying why.
- **Browsers**: feature detection, CSS fallbacks, polyfills where needed, tested in
  the target browsers.

### Input validation

- Client side: required fields, formats (email, phone, URL), length limits,
  patterns, custom rules, with constraints shown before submission:

```html
<input type="text" maxlength="100" pattern="[A-Za-z0-9]+" required aria-describedby="username-hint" />
<small id="username-hint">Letters and numbers only, up to 100 characters</small>
```

- Server side, always: validate and sanitize every input, guard against injection,
  rate-limit. Client checks are convenience, never protection.

### Accessibility resilience

Beyond the floor and the checklist: skip links on long content, live regions that
announce dynamic changes, Windows high-contrast (forced-colors) mode tested.

### Performance resilience

Progressive image loading, skeletons that keep the final layout, optimistic
updates, offline support where it applies; listeners, subscriptions, timers and
pending requests cleaned up on unmount; input debounced
(`debounce(handleSearch, 300)`) and scroll throttled (`throttle(handleScroll, 100)`).
Deeper speed work is the [optimize](optimize.md) move.

Done when every failure from step 1 has a built state or fix.

## 3. Test

- **By hand**: extreme data, other languages, offline and throttled (3G), screen
  reader, keyboard only, the oldest supported browsers.
- **Automated**: unit tests for edge cases, integration tests for error paths, E2E
  for critical paths, a behavioural regression for each confirmed gesture fix when
  the test runner can drive input, visual regression, accessibility (axe, WAVE).

## Done when

Each of these was tried and holds:

- names of 100+ characters; emoji in every text field; Arabic or Hebrew; Chinese,
  Japanese or Korean;
- internet off and throttled; 1000+ items; submit clicked ten times fast;
- a second finger mid-drag, a scroll across the control, release outside it, a
  window switch mid-drag, then a fresh drag;
- each forced API error; all data removed.

For gestures, the report says what produced the evidence (emulated viewport,
synthesized touch, which engine, physical device) and names what stayed untested.
