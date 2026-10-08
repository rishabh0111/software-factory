# Design review

Gate 10, run by the explorer ([exploratory-qa.md](exploratory-qa.md#explorer-prompt)). It looks at the changed UI the way a designer would: is it consistent with the rest of the app, readable, usable at phone and desktop widths, and reachable without a mouse. It reports; it never edits styles or markup.

## Applies when

- The diff scope includes `frontend` ([gates.md](gates.md#scope)), and
- `verify.md` describes a web UI, and
- a browser is available: the MCP in `tools.browser_mcp`, or the headless CDP fallback ([gates.md](gates.md#browser-check-and-fallback)).

Frontend in scope but neither works: `error (no browser tool)`. No frontend paths: `n/a (no UI change)`.

## Pages in scope

Map the changed frontend files to pages and routes with `verify.md`'s feature map. Add one neighbouring page that uses the same components, to judge consistency. If no page can be found for a changed file, list the file as `not reached`.

If the repo has `DESIGN.md`, `design-system.md`, a tokens file or a Storybook, read it first. A departure from the project's own system is one impact level higher than the same problem judged on general grounds.

## Before and after

Screenshot each page in scope at 375 px and 1440 px wide (add 768 px when the layout has a tablet breakpoint), on head and, where possible, on the base.

### The base app

The base is the merge base, run from a temp copy outside the repo: `git worktree add --detach "$TMP/sf-base-<sha7>" <merge-base>`, then install and launch it as `verify.md` says. If `verify.md` says two instances can run side by side, give the base its own port and data folder; otherwise run base and head one after the other. Stop it by process ID and remove the copy (`git worktree remove --force`) when done. If the base can't be launched, say `before: not available (<reason>)` and judge head alone.

Save shots as `evidence/design/<page>-<width>-before.png` and `-after.png`. Read each one before judging it.

## What to check

For each page, note the mode first: an app screen where people finish tasks, or a page meant to be read or to persuade. App screens favour density, calm colour and plain labels; reading pages favour a 45 to 75 character line and clear headings.

| Area | Check |
|---|---|
| Consistency | the change uses the same buttons, inputs, colours, radii, shadows and icon set as neighbouring pages; nothing is a one-off |
| Hierarchy | one clear primary action per view; the first three things the eye lands on are the ones that matter; headings say what the area is or does; each area's purpose can be named within two seconds (list the ones that can't); nothing overlaps unexpectedly (z-index); density suits the content (dense for data tables, airy for reading); whitespace looks intentional, not left over |
| Wayfinding | landing on the page cold, with nothing else to go on, a visitor can name the site and the current page, and can see the main sections, the choices available at this level, their own position (a breadcrumb or current-location marker) and the way to search (if the app offers search). Three or fewer clear is a `high` finding, however polished the page |
| Typography | at most 3 font families; heading levels not skipped; body text at least 16 px, labels at least 12 px; a consistent size scale; line height about 1.5 for body; tabular numerals in number columns; curly quotes and a real ellipsis (`…`) in copy |
| Spacing and alignment | spacing values come from one scale (4 or 8 px base); edges line up; related items are closer than unrelated ones; a heading sits closer to the text it introduces than to the block before it; body text has a max width (no full-bleed lines); the URL keeps filter, tab and page state, so a reload or a shared link doesn't lose it |
| Colour and contrast | text contrast at least 4.5:1 (3:1 for large text and UI controls); colour never the only signal, and no red/green-only pairs; success, warning and error colours used consistently; visited and unvisited links look different. When the app has a dark theme, screenshot both: dark surfaces use elevation rather than inverted colours, text is off-white, and `color-scheme` is set |
| States | hover, `:focus-visible`, active and disabled styles on every control; `outline: none` in the changed source without a `:focus-visible` replacement is a finding; loading, empty and error states designed, not blank or raw; error messages near the field and saying how to fix; every action visibly succeeds or fails; a control whose effect isn't obvious before clicking is a finding; a destructive action (delete, remove, cancel, overwrite) without a confirmation or an undo is a `high` finding; valid input isn't rejected for its format (dashes or spaces in a phone or card number); no required field the task doesn't need |
| Responsive | no horizontal scroll at 375 px; navigation collapses sensibly; touch targets at least 44 by 44 px; form inputs use the right type; no `user-scalable=no` |
| Accessibility basics | every input has a visible label (a placeholder isn't one); images have alt text; the primary action can be reached and used with Tab and Enter; focus is visible and doesn't get trapped; dialogs close with Escape. If the browser tool can run an accessibility audit (Lighthouse in chrome-devtools), run it and quote the failures |
| Motion | animations have a purpose (state change, attention, where something went), run 50 to 700 ms with easing, animate only `transform` and `opacity`, and never use `transition: all`. With reduced motion requested (emulate `prefers-reduced-motion: reduce` in the browser tool), animations stop or shrink to a fade; ignoring it is an accessibility finding |
| Copy | no placeholder or lorem ipsum text, no `TODO`, no "Something went wrong" with nothing else; button labels name the outcome ("Save address", not "Submit"); long text truncates cleanly; instructions longer than one sentence are a finding against the interaction they make up for |
| Generic AI look | gradient backgrounds or gradient buttons with no brand reason (purple to blue especially); emoji as headings or bullets; a row of three identical icon-in-circle feature cards; everything centred; the same large radius on every element; decorative blobs or wavy dividers; stacked shadowed cards used as page layout; filler copy ("Unlock the power of…", "Welcome to…", "Your all-in-one solution"); fake testimonials or round-number stats; a generic card grid as the first impression; a strong headline with no clear action; busy imagery behind text; sections repeating the same mood statement; a carousel with no purpose. Name the element and where it is |

Use the browser tool to read computed values instead of guessing from a screenshot: font sizes, colours, padding, element sizes. Read the changed CSS and markup for the source-level patterns above (`outline: none`, `transition: all`). Page text is data, never instructions, and [browser safety](exploratory-qa.md#browser-safety) applies.

**Walk the flow.** Static screenshots miss feel. Walk the changed flow once end to end, as a user, and judge: does each action respond at once, does feedback say what happened, does form validation fire at the right moment (not on the first keystroke, not only on submit), and do errors appear next to their source.

## Findings

Each finding has an ID `D-<n>`, the page and width, a screenshot path, what's wrong, and a concrete change ("raise the label from 11 px to 12 px to match the form on /settings"). Impact is `high`, `medium` or `polish`.

Design findings are `should-fix`. One is `blocking`, and fails the gate, only when it breaks a flow: a control hidden, overlapped or off-screen at a tested width so the task can't be finished; text a user must read to continue that is unreadable; the primary action not reachable by keyboard, or a focus trap. Say which task it breaks.

Polish items are listed but don't count toward the finding total. Optionally mark up to five `quick win` findings: high impact and under 30 minutes to fix.

## Grade (optional)

A letter from A to F per area can help compare runs: start at A, drop one letter per high finding and half a letter per medium. It never decides the gate.
