# Critique rubric

How [critique mode](../critique.md) and direction mode's look rounds judge a render: the scores, the
caps, the severity scale, the passes, the fix order and the one report format. What good looks like
(the floor, the bans, the tells) is in [sf-frontend-ui](../../sf-frontend-ui/SKILL.md#quality-floor);
this file is how to look and how to write down what you saw.

**Judge the pictures.** The screenshots show what is there; the source shows what was meant. If a
problem is visible in a screenshot, it is real, whatever the code says. When you built the thing
yourself, score it again as the juror who did not.

## Scores

Three scores, each measuring one thing. Report each by its own name.

| Score | Measures | Scale | Written |
|---|---|---|---|
| **Health score** | usability against Nielsen's 10 heuristics | each heuristic 0-4; total out of the applicable maximum | `28/40`, `24/32` |
| **Juror score** | design quality as an award jury reads screenshots | four criteria 1-10, weighted overall | `overall 7.4` |
| **Audit score** | technical quality of the implementation ([audit.md](audit.md)) | five dimensions 0-4 | `15/20` |

**Rating bands** for the health and audit scores, read off the percentage of the applicable maximum:

| Band | Share | Health (of 40) | Audit (of 20) | Means |
|---|---|---|---|---|
| Excellent | 90%+ | 36-40 | 18-20 | minor polish only; ship it |
| Good | 70%+ | 28-35 | 14-17 | address the weak areas; solid foundation |
| Acceptable | 50%+ | 20-27 | 10-13 | significant improvements needed before users are happy |
| Poor | 30%+ | 12-19 | 6-9 | major overhaul; the core experience is broken |
| Critical | below 30% | 0-11 | 0-5 | redesign; unusable or fundamentally broken as it stands |

The juror score carries calibration instead of bands ([Juror score](#juror-score)).

## Health score

Score each of Nielsen's 10 heuristics 0-4. A 4 means genuinely excellent, not good enough. Most real
interfaces score 20-32 out of 40.

**Applicability.** Heuristics 7 (Flexibility and efficiency) and 10 (Help and documentation) may be
scored `n/a` on Persuade and Experience surfaces (landing pages, campaigns, portfolios, bodies of
work), as may any heuristic that genuinely cannot apply to the surface. Write `n/a` with a one-line
reason. The applicable maximum is 4 times the number of heuristics scored: `/40` when all ten apply,
`/32` when two are `n/a`. Never print `/40` over a partial set; the band comes from the percentage
(24/32 is 75%, so Good). The snapshot records the applicable maximum and which heuristics were `n/a`.

### 1. Visibility of system status

Keep users informed about what is happening through timely, fitting feedback.
Check for: loading indicators during async work; confirmation of actions (save, submit, delete);
progress through multi-step processes; current location (breadcrumbs, active states); inline form
validation, not only on submit.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| no feedback; the user guesses what happened | rare feedback; most actions show no response | partial; some states shown, major gaps | most operations give clear feedback, minor gaps | every action confirms; progress always visible |

### 2. Match between system and the real world

Speak the user's language; follow real-world conventions; information in natural, logical order.
Check for: familiar terms (no unexplained jargon); an order that matches expectation; recognisable
icons and metaphors; language fit for the audience; a natural reading flow.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| pure technical jargon, alien to users | mostly confusing; needs domain expertise | mixed; some jargon leaks through | mostly natural; an occasional term needs context | speaks the user's language throughout |

### 3. User control and freedom

A clear emergency exit from unwanted states without an extended dialogue.
Check for: undo and redo; cancel on forms and modals; a clear way back to safety; an easy way to
clear filters, search and selections; escape from long or multi-step processes.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| users get trapped; only a refresh gets out | exits exist but are obscure | main flows have escape, edge cases do not | users can exit and undo most actions | undo, cancel, back and escape everywhere |

### 4. Consistency and standards

Users never wonder whether different words, situations or actions mean the same thing.
Check for: one term per concept; the same action giving the same result everywhere; platform
conventions; visual consistency (colour, type, spacing, components); the same gesture doing the same
thing.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| feels like several products stitched together | similar things look and behave differently | main flows match, details diverge | an occasional deviation, nothing confusing | one cohesive, predictable system |

### 5. Error prevention

A design that prevents problems beats a good error message.
Check for: confirmation before destructive actions; constraints that block invalid input (pickers,
selects); smart defaults; labels that prevent misreading; autosave and draft recovery.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| errors easy to make; no guardrails | a few inputs validated, most not | common errors caught, edge cases slip | most error paths blocked up front | errors nearly impossible through constraints |

### 6. Recognition rather than recall

Minimise memory load: objects, actions and options visible or easy to retrieve.
Check for: visible options, not buried menus; contextual hints; recent items and history;
autocomplete and suggestions; labels on icons.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| users must memorise paths and commands | many hidden features, few cues | main actions visible, secondary ones hidden | most things discoverable | nothing needs memorising |

### 7. Flexibility and efficiency of use

Accelerators, invisible to novices, speed up experts.
Check for: keyboard shortcuts for common actions; customisable elements; recents and favourites;
bulk actions; power features that leave the basics simple.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| one rigid path | few alternatives to the main path | basic keyboard support, limited bulk actions | keyboard navigation, some customisation | multiple paths, power features, customisable |

### 8. Aesthetic and minimalist design

No irrelevant or rarely needed information; every element serves a purpose.
Check for: only what each step needs; a hierarchy that directs attention; purposeful colour and
emphasis; no decoration competing for attention; focused layouts.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| everything competes equally | cluttered; hard to find what matters | main content clear, periphery noisy | focused, minor noise | every element earns its place |

### 9. Help users recognise, diagnose and recover from errors

Plain-language messages that name the problem precisely and suggest the fix.
Check for: no error codes shown to users; specific identification ("Email is missing @", not
"Invalid input"); an actionable recovery; the error shown at its source; handling that keeps the
user's work.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| codes, jargon, or no message | "Something went wrong" with no guidance | names the problem, not the fix | names the problem and the next step | pinpoints, suggests the fix, keeps the work |

### 10. Help and documentation

Even when the system works without docs, help is easy to find, task-focused and concise.
Check for: searchable help; contextual help (tooltips, inline hints, guided tours); task-focused
organisation; scannable content; access without leaving the current context.

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| no help anywhere | help exists but is hard to find or irrelevant | FAQ or docs exist, not contextual | searchable, mostly task-focused | the right help at the right moment |

## Juror score

Score like an Awwwards juror: four criteria, 1-10 each, weighted **design 40%, usability 30%,
creativity 20%, content 10%**.

**Design (40%)**: composition, typography, colour, imagery, craft.
- 9-10: every screen holds as a poster; nothing could be removed or moved.
- 8: confident and coherent; one or two soft spots a designer would notice.
- 7: clean and professional, a clear system, little tension.
- 6: tidy but anonymous; reads as a kit.
- 5 or less: weak hierarchy, accidental spacing, default type, mismatched images.

**Usability (30%)**: orientation in three seconds, readable text, obvious actions, an honest phone.
- 9-10: you know what it is, who it is for and what to do without scrolling; flawless on a phone.
- 8: clear and comfortable; minor friction (a long section, a small target).
- 7: works, with one real problem (weak contrast somewhere, a cramped phone layout).
- 6 or less: you have to hunt, or something breaks.

**Creativity (20%)**: an idea you can state in a sentence, carried through.
- 9-10: a concept specific to this subject that you have not seen applied this way.
- 8: a clear idea with one memorable move.
- 7: a tasteful execution of a known approach.
- 6 or less: the category default.

**Content (10%)**: words and pictures that are specific, true-sounding and edited.
- 9-10: every line could only be about this subject; the imagery is the subject.
- 7-8: clear and concrete, some generic lines.
- 6 or less: slogans, filler, stock.

`overall = 0.4·design + 0.3·usability + 0.2·creativity + 0.1·content`, then apply the [caps](#caps).

**Calibration.** Real Awwwards Sites of the Day land around 7.5-8.0 overall from the jury; an honest
8.5 is rare. A single juror's score carries about half a point of noise. A first score of 9 for your
own work gets scored again.

## Caps

Caps override the arithmetic. Record each one applied. Caps marked *(pages)* are page rules; app
screens skip them ([app-screen passes](#app-screen-passes)).

- A floor check still failing on the render, or a scan finding still standing unrefuted: overall at
  most **6.0**.
- A banned device from the floor visible in a screenshot (a headline of three or more lines at any
  width, an eyebrow label, monospace labels, 01/02/03 numbering, a decorative gradient, a shadow on a
  resting element, a decorative hairline; the full list is
  [Quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)): overall at most **6.5**.
- Pass 3 fails (the page could belong to anyone): creativity at most **6**.
- The idea passes for the nearest competitor (pass 14): creativity at most **7**.
- *(pages)* No live thing (pass 14): creativity at most **7.5**.
- *(pages)* Fewer than four real pictures (photographs, archival images, footage; drawings do not
  count): design at most **6.5**.
- *(pages)* A page that barely moves, or motion that is one identical fade on every block: design at
  most **7**.
- Two or more desktop screens that are mostly empty ground, or running text that is small and grey:
  design at most **6.5**.
- Unequal page margins, a section huddled on one side with the other half empty, or a blank stretch
  taller than half a screen: design at most **6.5**.
- Any placeholder (grey box, lorem, "Image here"): content at most **5**.
- A section the brief asked for that is missing or reduced to a few words: content at most **6**.
- The five-second pass fails (no clear title on the first screen saying what this is): usability at
  most **6**.
- No real button for the primary action on the first screen: usability at most **7**.
- A section of running text with no heading naming it: usability at most **7**.
- Anything covering a headline at any scroll position: usability at most **6**.
- A blank band where a reveal did not fire, or content clipped off-screen: usability at most **5**.

## Severity

Every issue, in critique and audit alike, carries one tag:

| Tag | Name | Means | Action |
|---|---|---|---|
| **P0** | Blocking | prevents task completion | fix immediately |
| **P1** | Major | significant difficulty or confusion, or a WCAG AA or platform-guideline violation | fix before release |
| **P2** | Minor | an annoyance with a workaround | fix in the next pass |
| **P3** | Polish | no real user impact | fix if time permits |

Unsure between two levels: would a user contact support about this? If yes, it is at least P1.
Prioritise ruthlessly: not everything is P0, and a long tail of P3s buries what matters, so keep P3s
few.

## Passes

Make each pass on its own; do not blend them. Open the desktop first screen, then the desktop
full-page shots, then the tablet and phone shots. Pages take the page passes; app screens take the
app-screen passes; every design review also runs the design review lenses.

### Page passes

1. **One second, then five.** Glance and look away. There should be exactly one answer: a word, an
   image, an object. "A website" means there is no focal point. Then give the first screen five
   seconds as a stranger: can you say what this is, who it is for and what to do next? A title that
   only makes sense after scrolling is not a title.
2. **Squint.** Blur your attention until text becomes grey bars. The page should reduce to two or
   three large masses with clear size differences. Many small similar masses means everything is
   medium and nothing leads.
3. **Cover the logo.** Could this first screen belong to a competitor, or to a different industry? If
   swapping the name and the noun in the headline gives an equally valid page, the page has no idea.
   Compare with the direction (DESIGN.md or the direction sheet, where one exists). Then scroll: does
   the idea reach the pricing, the FAQ and the footer, or does the page turn into stock blocks after
   the first screen?
4. **Edges.** Follow the left edge of every text block down the page and count the distinct x
   positions. A composed page has two or three, reused on purpose; six means things were placed one at
   a time.
5. **Space and frame.** Are related things close and unrelated things far? Is the gap between sections
   clearly larger than any gap inside one? Is any region empty by accident (a hole, usually beside a
   short column or under a removed decoration) rather than by decision (a rest)? Then the frame: equal
   left and right margins? A section with its text in one half and the other half empty? A stretch of
   nothing taller than half a screen? Readers name these first ("pushed to the left", "random empty
   space"); among recent Sites of the Day about 1 section in 100 leaves half the width empty.
6. **Type.** Is the jump from body to headline decisive (three times or more)? Check the floor's type
   line ([type.md](../../sf-frontend-ui/references/type.md) for depth), then look for a headline
   ending on one orphan word and a paragraph centred over more than three lines.
7. **Colour.** Name the proportions: which colour holds most of the surface, which supports, where the
   accent sits. An accent in ten places means nothing; one on the single action and one detail means
   "here".
8. **Images.** Count the real pictures against the floor's minimum and look for a moving one. A page of
   drawings only, or of type only, looks unfinished beside one with photographs and footage. Is every
   image doing a job (showing the thing, setting the place, proving the claim)? Do the crops share
   ratios? Anything a grey box, a stretched photo, a fake screen made of bars? Does the photography
   share one light and one grade, or is it a stock mix?
9. **Sameness.** Write one word for each section's layout (split, list, full-bleed, grid, statement,
   index ...). The same word twice in a row, or three times on the page, is the template showing.
10. **Phone.** Is the phone screen a composition of its own, with its own crop and line breaks, or the
    desktop squeezed? Is its first screen still one clear thing?
11. **Fullness.** Go through the desktop shots screen by screen. Is each a composed poster, or a narrow
    column of small text with dead ground either side? Is any statement held on screen for three
    screens? An austere page is not a restrained one: one that could pass for an unfinished wireframe
    (grey shapes, grey text, one small column) is underbuilt. A single motif blown up to fill a screen
    with nothing to read is a hole too, however bold.
12. **Substance.** Does every section the brief asked for deliver its information completely and at a
    readable size (the full menu, each room, every speaker, the price and what it includes)? Would the
    visitor leave knowing what they came to find out? Is the primary action a real button on the first
    screen?
13. **Collisions.** Is anything lying on a headline, a statement or a button at any scroll position?
    Does anything run off the edge of the phone screen? A row that scrolls sideways on the phone reads
    as cut off, unless the cut is plainly deliberate (a partial card at the edge).
14. **The competitor and the live thing.** Put the nearest competitor's name on the page: does the idea
    still work? Then name the one live thing (what the visitor can do, or what differs each visit). A
    weak answer to either is the first problem of the round, ahead of any detail.

Passes 11-13 guard substance: a richer page full of template devices beats a cleaner page that is
thin, so a page that lost its tells must not have lost its content with them (the floor's closing
paragraph in [Pages only](../../sf-frontend-ui/SKILL.md#pages-only)).

### App-screen passes

For dashboards, admin, settings, inboxes, tools: screens people work in. The screen's one question,
its face and its signature element are defined in
[app-screens.md](../../sf-frontend-ui/references/app-screens.md). Answer each in writing, at every
width.

1. Is the screen's question answered by the biggest thing on it, and is that read first? Is the
   largest figure the one that answers the title row's sentence?
2. Does every block share the screen's edges? A dead strip on one side, a card stopping short, an
   orphan cell, a stretched card with a blank band (a legend pinned to its foot, four rows in a card
   kept at its neighbour's height)?
3. Is colour only on data, on status and on the one primary action, and does the main data element
   carry the one hue? Does the product's face show on the first screen?
4. Do the numbers add up and line up digit for digit? List every fact that appears twice and check the
   copies agree; recompute each total and change from the values as displayed; check that every
   relative figure names what it is against.
5. Does every zero look like a zero and every missing value like a dash? Does every count badge sit on
   a queue that needs action, with its noun clear from the label?
6. Does every legend swatch match the mark it explains? Does any caption have to say which bars are
   which (then encode it in the chart)? Does any label collide with a line or another label?
7. On the phone, is the navigation folded away, and does each block still answer its question?

### Design review lenses

Every design review (critique's assessment A) also reads the surface through these:

- **Design specificity.** Is the composition, interaction and visual language grounded in this
  product, or could an unrelated product use it unchanged? Page passes 3 and 14 (app screens: pass 3's
  face) decide it. Judge it before any scan output is seen.
- **Holistic design.** Hierarchy, information architecture, emotional fit, discoverability,
  composition, type, colour, accessibility, states, copy, edge cases, each against the
  [quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) for the surface's
  [mode](../../sf-frontend-ui/SKILL.md#modes).
- **Cognitive load.** The checklist and the working-memory count in
  [cognitive-load.md](cognitive-load.md): report each failed item and every decision point with more
  than four visible options.
- **Emotional journey.** The peak-end rule (is the best moment and the last moment of the main flow
  good?), emotional valleys (where frustration or doubt pools), reassurance at high-stakes moments
  (payment, deletion, submission).
- **Heuristics.** The [health score](#health-score).
- **Personas.** Two or three from [personas.md](personas.md), walked through the primary action.

## What to fix first

Order of work; later items cannot rescue earlier ones. Within one severity, issues are listed in this
order, and a look round fixes in it.

1. **The idea.** If pass 3 fails, change the concept, not the details.
2. **Hierarchy.** One dominant element per screen: make the big thing bigger and the small things fewer
   before touching anything else.
3. **Composition.** Shared edges, section spacing, variety between sections, holes.
4. **Typography.** Scale contrast, line breaks, measure, leading.
5. **Imagery.** Replace weak pictures, unify crops and grade.
6. **Colour.** Proportion and accent discipline.
7. **Detail.** States, focus, small alignments, phone refinements.
8. **Motion.** Last.

When removing something leaves a gap, close the gap, enlarge what remains, or let a picture or a
colour field take the space; an ornament never refills it.

## Report format

One format serves both uses. A **look round** (direction mode, or any build loop) writes the
[round block](#round-block). A **critique run** writes the [full report](#full-report), which contains
the round block's lines in its sections 2, 5 and 8, so a critique and a look round of the same surface
compare line for line.

Name problems the way a designer would to a colleague: "the supporting paragraph starts 40px left of
the headline's edge", "the testimonial section is the third split layout in a row", "the phone hero
crops the bottle out of frame". "Could be more polished" is not a finding. Be direct and specific
("the submit button", not "some elements"), say what is wrong and why it matters to users, and give
a concrete fix; drop "consider exploring" entirely.

### Round block

Write it down; do not just think it.

```
ROUND n
Seen in one second: …
Idea (one sentence): …
Live thing: …            (app screen: "Question: …", the screen's one question)
Layout words by section: hero=… / …=… / …
Juror score: design _ · usability _ · creativity _ · content _ → overall _._
Caps applied: …
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. [P?] …
2. [P?] …
3. [P?] …
```

### Full report

In this order:

1. **Method line** (first line of the report): `Method: dual-agent (A: <agent-id> · B: <agent-id>)`,
   or `DEGRADED: single-context (<reason>)`, or
   `Method: design review only (scan not applicable, native platform)`.
2. **Read**: the round block's first four lines (seen in one second, idea, live thing or question,
   layout words).
3. **Design specificity verdict.** *Unanchored assessment*: assessment A's verdict on coherence,
   structural sameness, category-interchangeable choices and missed chances for product character.
   *Scan*: what assessment B found, with counts and file locations, what it caught that A missed, and
   its false positives (native: `not applicable (native platform)`). *Visual overlays*: only when an
   overlay really ran in the page, say it is visible in the `[Human]` tab and summarise its console
   output; when injection was tried and failed, say no reliable overlay exists and give the fallback
   signal.
4. **Health score**:

   | # | Heuristic | Score | Key issue |
   |---|---|---|---|
   | 1 | Visibility of system status | ? | the finding, or "solid" |
   | 2 | Match between system and real world | ? | |
   | 3 | User control and freedom | ? | |
   | 4 | Consistency and standards | ? | |
   | 5 | Error prevention | ? | |
   | 6 | Recognition rather than recall | ? | |
   | 7 | Flexibility and efficiency | ? | |
   | 8 | Aesthetic and minimalist design | ? | |
   | 9 | Error recovery | ? | |
   | 10 | Help and documentation | ? | |
   | **Total** | | **??/applicable max** | **band** |

5. **Juror score** and caps applied (the round block's two score lines).
6. **Overall impression**: a gut reaction; what works, what does not, the single biggest opportunity.
7. **What's working**: two or three things, each with why it works.
8. **Priority issues**: three to five, ordered by severity, then by [fix order](#what-to-fix-first).
   Each: **[P?] What** (the problem named) · **Seen in** (the screenshot) · **Why it matters** (to
   users or goals) · **Fix** (concrete) · **Refine move** (the `/sf-design refine` move that addresses
   it, or another route named in critique.md).
9. **Persona red flags**: per selected persona, the exact elements and interactions that failed them on
   the primary action (what broke, never a persona description).
10. **Cognitive load**: failed checklist items, the rating, and each decision point over four options.
11. **Emotional journey**: peak, end, valleys, missing reassurance.
12. **Minor observations**: brief notes.
13. **Questions to consider**: provocative questions that might unlock better solutions ("What if the
    primary action were more prominent?", "Does this need to feel this complex?", "What would a
    confident version of this look like?").
14. **Audit** (when the audit ran): the [audit report](audit.md#audit-report).
15. **Run notes**: evidence sources (viewport emulation, real device, goldens), scan used (the CLI's or
    the manual tells scan), skipped or failed steps with reasons, checks left unrun.

## Look rounds

A build loop (direction mode's Look step) runs at most three rounds: critique, fix the top three,
re-render, critique. Stop early when a round finds no problem a stranger would notice. If round three
still scores under 7.5 overall, say so plainly with the remaining problems listed; do not round up.

## Blind comparison

To compare builds (variants, before and after, with and without a method), give a separate agent the
juror brief: this file's [juror score](#juror-score), [caps](#caps) and [passes](#passes), the builds
captured the same way in anonymous `A/`, `B/`, `C/` folders, screenshots only, no source and no names.
One juror per comparison carries about half a point of noise per score, and model jurors are not
people; repeat with fresh jurors before trusting a gap under a point. In testing, jurors rewarded, in
this order: an idea that belongs to this client (pass 3, 14), one live thing (pass 14), full content
at a readable size (pass 12), a first screen with one dominant element and a real button (passes 1,
12), drawings of the subject with detail (pass 8); what they punished is in the caps.
