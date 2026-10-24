# QA issue taxonomy

The one severity scale and category list for every QA finding, browser or functional.

## Severity

Use the highest severity that applies, and record the impact and any workaround.

| Severity | Definition | Examples |
|---|---|---|
| **critical** | Data loss, a security or privacy exposure, or the core app unusable for all users | form submit causes an error page, checkout broken, data deleted without confirmation |
| **high** | A core or major task blocked, with no workaround | search returns wrong results, a file upload silently fails, an auth redirect loop |
| **medium** | A task impaired, but a workaround exists | a page load over 5s, missing validation that still lets submit work, layout broken on mobile only |
| **low** | Cosmetic, copy or friction, with no lost task completion | a footer typo, a 1px misalignment, an inconsistent hover state |

The health score's Console and Links categories count occurrences instead of severity.

## Categories

The health score's eight categories, each a finding's primary home in this order of
precedence: Links, Accessibility, Functional, Performance, Visual, Content, UX, Console.

1. **Links:** 404s and wrong destinations, missing routes or anchors, client-side routes
   that fail, timeouts.
2. **Accessibility:** missing alt text, unlabeled inputs, broken keyboard navigation,
   focus traps (can't escape a modal or dropdown), missing or wrong ARIA, insufficient
   contrast, content a screen reader can't reach.
3. **Functional:** dead buttons, missing, wrong or bypassed form validation, incorrect
   redirects, state lost on refresh or back, race conditions (double submit, stale data),
   wrong or empty search results.
4. **Performance:** page loads over 3 seconds, janky scrolling, layout shifts after load,
   over 50 requests on one page, large unoptimized images, blocking JavaScript.
5. **Visual:** layout breaks (overlap, clipped text, horizontal scrollbar), broken or
   missing images, z-index errors, font and color inconsistencies, animation glitches,
   alignment off the grid, dark mode and theme issues.
6. **Content:** typos and grammar, outdated or wrong text, placeholder or lorem ipsum left
   in, truncation without an ellipsis or "more", wrong button or field labels, missing or
   unhelpful empty states.
7. **UX:** confusing navigation and dead ends, missing loading indicators, interactions
   over 500ms with no feedback, unclear errors ("Something went wrong"), no confirmation
   before destructive actions, inconsistent patterns across pages.
8. **Console:** uncaught exceptions, failed requests (4xx, 5xx), CORS errors, mixed
   content, CSP violations; deprecation warnings are noted as future breakage.

## Per-page checklist

For each page visited in a browser QA session:

1. **Visual scan:** the Phase 3 read sequence (`take_snapshot` when you need uids); look
   for layout issues, broken images, misalignment.
2. **Interactive elements:** click every button, link and control; does each do what it
   says?
3. **Forms:** fill and submit (a non-LOCAL target needs consent first: browser rule 3);
   empty submission, invalid data, long text, special characters.
4. **Navigation:** every path in and out: breadcrumbs, back button, deep links, mobile
   menu.
5. **States:** empty, loading, error, full and overflow.
6. **Console:** `CONSOLE_ERRORS=` after interactions; any new errors or failed requests?
7. **Responsiveness:** mobile and tablet viewports where relevant.
8. **Accessibility:** the Phase 4 accessibility checks.
9. **Auth boundaries:** never sign the user out or switch accounts yourself. If the
   signed-out or other-role view matters, ask the user to switch in the attached browser
   and re-run the page sequences.
