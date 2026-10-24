# Onboard: first value, fast

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the "aha moment" users should reach, and their experience level.

Onboarding gets people to the moment that proves the product is worth their time;
its job is that moment, not teaching the whole product. The move designs first-run
flows, empty states, contextual help and activation. It is the wrong move for error
and edge states in general (harden) or for wording alone (clarify).

Craft depth: [the quality floor](../../sf-frontend-ui/SKILL.md#quality-floor) (states,
modals), [copy.md](../../sf-frontend-ui/references/copy.md),
[app-screens.md](../../sf-frontend-ui/references/app-screens.md),
[motion.md](../../sf-frontend-ui/references/motion.md) for any tour or reveal motion.

## 1. Assess

- **The challenge**: what users try to do, what confuses them, where they stall or
  drop off, the aha moment.
- **The users**: experience (beginner, power, mixed), motivation (exploring,
  required by work), time they will give (5 or 30 minutes), what they know already
  (a competitor, nothing in the category).
- **Success**: the minimum they must learn, the key action (first project, first
  invite), and how you will know it worked (completion rate, time to value).

Done when the aha moment and the key action are each one sentence.

## 2. Principles the design follows

- **Show, don't tell**: working examples and real functionality, one thing at a
  time; never a tutorial mode cut off from the product.
- **Optional where possible**: a visible Skip or "I'll explore on my own"; the
  product stays reachable.
- **Time to value**: front-load the most important concepts, teach the 20% that
  delivers 80%, leave advanced features for discovery in context.
- **Context over ceremony**: teach a feature when the user meets it; empty states
  and point-of-use hints are onboarding.
- **Respect intelligence**: concise, no over-explaining standard patterns.

## 3. Design the experience

### Initial product onboarding

- **Welcome**: what the product is, what the user will accomplish, an honest time
  estimate, a skip.
- **Account setup**: the minimum fields (collect more later), why each is asked,
  smart defaults, social sign-in when appropriate.
- **Core concepts**: one to three, plain language, interactive where possible,
  progress shown in words or position ("1 of 3"; a real `<ol>` when order matters).
- **First success**: the user accomplishes something real, with pre-populated
  examples or templates, a proportionate acknowledgement and clear next steps.

### Feature discovery

- **Contextual tooltips**: at the first relevant moment, pointing at the element,
  brief benefit, dismissable with "Don't show again", optional "Learn more".
- **Feature announcements**: what is new and why it matters, try it now,
  dismissable.
- **Progressive onboarding**: teach on encounter, mark new or unused features,
  unlock complexity gradually.

### Guided tours

Use for complex interfaces, significant product changes, or tools that need domain
knowledge. Spotlight one element and dim the rest; 3-7 steps per tour; users click
through freely and can skip; replayable from help. Interactive over passive (users
press real buttons), workflow over features ("Create a project", not "This is the
project button"), sample data so actions work.

### Interactive tutorials

Use when users need hands-on practice, concepts are unfamiliar, or stakes are high.
A sandbox with sample data, clear objectives ("Create a chart showing sales by
region"), step-by-step guidance, validation that they did it, a graduation moment.

### In-product help

Contextual help links, a keyboard-shortcut reference, a searchable help centre,
short videos for complex workflows. Patterns: a `?` beside complex features,
"Learn more" in tooltips, shortcut hints on controls (`⌘K` on the search box).

Done when every first-run screen and hint the plan needs is built.

## Empty states

Every empty state carries: what will be here ("Your recent projects will appear
here"), why it matters ("Projects help you organise your work and collaborate with
your team"), how to start ([Create project] or [Start from template]), a picture
drawn from the subject when the surface has room (per
[imagery.md](../../sf-frontend-ui/references/imagery.md)), and help when useful
("Need help getting started? [Watch 2-min tutorial]").

By type: **first use** emphasises value and offers a template; **user cleared**
stays light and makes recreating easy; **no results** suggests another query or
clearing filters; **no permission** explains why and how to get access; **failed to
load** explains and offers retry.

## Implementation

- Tooltips and tours: the project's existing library, else a maintained one
  (Popper or Tippy for tooltips; Shepherd, Intro.js or React Joyride for tours).
- Any modal: focus trap, backdrop, Escape to close.
- Remember what was seen and dismissed (`localStorage.setItem('onboarding-completed', 'true')`,
  `'feature-tooltip-seen-reports'`), so onboarding shows once and returning users
  skip the first-run flow.
- Track completion and drop-off points in the project's analytics.

The flow lets users into the product at once, explains only what is not obvious,
shows each tooltip once, leaves the UI usable during a tour, keeps Skip easy to
find, and teaches inside the real product.

## Done when

- The aha moment is reachable quickly, and the key action is the obvious next step.
- Skip works everywhere and dismissals stick across sessions.
- Every empty state has its what, why and how.
- The report names the measures to watch with real users: time to completion,
  comprehension, the desired next action, skip rate, completion rate, time to value.
