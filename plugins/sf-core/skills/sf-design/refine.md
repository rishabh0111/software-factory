# Refine: one move on a shipped surface

The refine mode of [design](SKILL.md). The designer, DESIGN SETUP, the designs
directory and the decision brief are in [SKILL.md](SKILL.md).

Refine improves an interface that already exists, inside its visual world, by one
**move**: polish it, make it bolder or quieter, distill it, harden it, fix its type,
layout, colour, motion, copy or responsiveness, add delight or onboarding, push it
into overdrive, or make it faster. Each move is a reference file in
[refine/](refine/). This file picks the move and carries what every move needs;
the move file carries only its own job.

Refinement preserves: the incumbent identity, behaviour, copy and everything
outside scope stay. When the concept itself is wrong, say so and suggest
`/sf-design direction` (a replacement world) instead of smuggling one in. A missing
DESIGN.md alone does not make a project greenfield: the shipped screens are the
visual authority. Finish the job: the move's result is complete except assets
only the user can supply.

## Moves

| Move | Reach for it when | Reference |
|---|---|---|
| **polish** | the feature works and needs its final pass before shipping, or a critique snapshot holds open P0/P1 findings | [refine/polish.md](refine/polish.md) |
| **bolder** | one named section reads flat or safe beside the rest of the page | [refine/bolder.md](refine/bolder.md) |
| **quieter** | the surface is loud, saturated or overstimulating | [refine/quieter.md](refine/quieter.md) |
| **distill** | the screen is cluttered: too many actions, repeats, decoration, variants | [refine/distill.md](refine/distill.md) |
| **harden** | the UI only works with perfect data: errors, empty, loading, long text, i18n, permissions are missing | [refine/harden.md](refine/harden.md) |
| **onboard** | first-run, empty states or activation need designing | [refine/onboard.md](refine/onboard.md) |
| **animate** | state changes, feedback or one authored moment need motion | [refine/animate.md](refine/animate.md) |
| **colorize** | the UI is grey or monochrome and colour should carry hierarchy and state | [refine/colorize.md](refine/colorize.md) |
| **typeset** | hierarchy, faces, measure or line breaks are weak | [refine/typeset.md](refine/typeset.md) |
| **layout** | spacing, grouping, rhythm or reading order are off | [refine/layout.md](refine/layout.md) |
| **delight** | a meaningful moment (completion, first use, recovery, waiting) deserves personality | [refine/delight.md](refine/delight.md) |
| **overdrive** | the user wants something technically extraordinary: cinematic transitions, shaders, a million-row table | [refine/overdrive.md](refine/overdrive.md) |
| **clarify** | labels, errors, empty-state or helper copy confuse | [refine/clarify.md](refine/clarify.md) |
| **adapt** | the design must work on another screen size, device, input, print or email; native targets take [refine/adapt-native.md](refine/adapt-native.md) | [refine/adapt.md](refine/adapt.md) |
| **optimize** | the UI is slow to load, janky or heavy | [refine/optimize.md](refine/optimize.md) |

Generating variants of an element to choose from, in a board or the live browser,
is shotgun mode (`/sf-design shotgun`), not a refine move.

## Step 1: Read the signals

Gather the project's current state once, before choosing.

- If the design-check CLI recorded in `docs/agents/tools.md` is present, run its
  `signals` verb once and read its JSON. On a web target with scan targets, run its
  `detect --json` over the changed markup and style files (the dirty tree first,
  else the source directory). Skip `detect` on native projects, and skip it when it
  errors or the tree is too large to scan quickly.
- Otherwise: read `git status` and the changed UI files; read the newest snapshot
  with `status: open` under `.design/critique/<slug>/` (slug and front matter in
  "Critique snapshots" below); open the rendered target per
  [browser.md](browser.md) (BROWSER SETUP first) and look at it at the sizes it
  ships at.

Done when you can state, in one line each: which files changed, whether an open
critique exists and its P0/P1 counts, and what the rendered target shows.

## Step 2: Pick the move

The move the user named wins. Otherwise reason over the complaint and the signals;
there is no score to obey:

- An open critique with a low score or any P0/P1 → **polish** (it consumes the
  snapshot as its backlog).
- No critique ever on a set-up project with a real surface → suggest
  `/sf-design critique <surface>` first, in one line, and continue with the move
  the complaint implies.
- Detector hits or what you saw on the render point at a family: many quality or
  contrast hits → polish; gradient text, eyebrows, glow, saturation → quieter or
  typeset; flat or grey palette → colorize; cramped or uniform spacing → layout;
  unclear labels and errors → clarify; missing states → harden; slow or janky →
  optimize.
- Changed files pointing at one surface → scope the move to those files and name
  them.
- No complaint and no argument → lead with the two or three highest-value moves,
  each with a one-line reason from the signals and the exact command to type, then
  the table above. The pick is a suggestion the user confirms; run nothing yet.
- A workflow or move-selection question → answer it from the table and the move
  files, and run nothing unless the user also asks for it.

When two moves fit equally, ask once with a decision brief (format in
[SKILL.md](SKILL.md)). Done when one move is named in one line ("Running the
layout move on `app/settings/page.tsx`") or the user has your two or three picks.

## Step 3: Shared preamble

Every move runs on this; the move files assume it.

1. **Resolve the target.** A named file, route, component or URL. A vague target
   gets your reading stated in one line. Done when the target is a path or URL you
   can open.
2. **Load the context.** If the design-check CLI is present, run its `context`
   verb once with `--target <path>`; it loads PRODUCT.md, DESIGN.md, the matching
   surface brief and native-platform guidance, so follow what it prints. When it
   refuses or fails, send one message before the next tool call, "Context loading
   did not run; I'll read the existing project context directly", and continue as
   if it were absent. Absent: read PRODUCT.md and DESIGN.md (repo root, or where
   `docs/agents/work-docs.md` says) without inventing what is missing. Done when
   you can name the audience, the surface's mode
   ([modes](../sf-frontend-ui/SKILL.md#modes)) and the tokens you will work in.
   A narrow refinement proceeds on the incumbent implementation without
   PRODUCT.md or DESIGN.md; offer `/sf-design consultation` afterwards, or
   dispatch the `design-documenter` agent to record DESIGN.md from the shipped
   build (without a subagent tool, read [that agent file](../../agents/design-documenter.md)
   and run it in this session as its In-session section says).
3. **Check the platform.** The CLI's `context` names it; otherwise read PRODUCT.md,
   then the project (an Xcode project or SwiftUI sources → `ios`; an Android Gradle
   module or Compose → `android`; React Native, Expo or Flutter shipping to both →
   `adaptive`; else web). On `ios`, `android` or `adaptive`: read
   [ios.md](../sf-frontend-ui/references/ios.md) and/or
   [android.md](../sf-frontend-ui/references/android.md); the adapt move becomes
   [adapt-native](refine/adapt-native.md); `detect`, the browser and every web-only
   tool in a move are skipped; the render is the simulator or emulator per those
   references' build-verification sections. Done when the platform is named.
4. **Inspect visual truth.** Look at the target and its neighbours as they render
   before editing. When the app cannot run, start from committed visual-regression
   goldens or screenshot fixtures: check they match the current tokens, CSS,
   components and assets, resolve conflicts, and compare theme and variant
   captures. Done when you have seen the current state at the shipping sizes.
5. **Ask once for missing context.** Each move file opens with a **Needs** line.
   What PRODUCT.md, DESIGN.md and the code cannot answer, ask in one decision
   brief, then proceed.
6. **Read the floor.** Immediately before the first UI edit, including a small one,
   read [the quality floor](../sf-frontend-ui/SKILL.md#quality-floor) and the
   craft reference the move file names. Planning-only work skips this.

## Step 4: Run the move

Read the move's reference file in full and execute it top to bottom. Every step in
it ends on a completion criterion; meet each before the next.

**Verify by looking.** Check the rendered result at the sizes it ships at (web:
390, 768, 1440; native: the device classes it targets), in light and dark when
both exist. Batch the checks: one look runs every check the move and the floor
name, you fix everything that look shows, then you look again. A detector result
is defect evidence, never proof of quality. Say what produced each piece of
evidence (render, emulated viewport, synthesized input, which engine, device) and
name what stayed untested.

## Critique snapshots

Polish reads and closes them; Step 1 reads them. If the design-check CLI is
present, its critique-storage verbs (`latest`, `close`) do this job against its
own store. Otherwise snapshots live at
`.design/critique/<slug>/<YYYYMMDDTHHMMSSZ>.md`, where `<slug>` is the resolved
target path or URL lower-cased, every run of non-alphanumerics replaced by `-`,
trimmed. Front matter: `target`, `total_score`, `max_score`, `na_heuristics`,
`p0_count`, `p1_count`, `fingerprint` (sha256 of the target file's bytes; empty for
a URL), `status` (`open` or `closed`). The latest snapshot is the newest file by
timestamp. It is **current** when `status: open` and, for a file target, the
target's sha256 today equals `fingerprint`; a URL stays current until closed. A
changed, deleted or replaced file target closes it: set `status: closed` and keep
the file for the trend. Suppressed findings the user keeps are in
`.design/critique/ignore.md`. Scoring and writing snapshots is critique mode's job
([critique.md](critique.md)).

## Completion

Done when the move's own done criteria are each answered with rendered or source
evidence, every floor check ran on the final render (or its absence is stated),
and your report lists what changed, the evidence source for each check, sample
content to replace, and what stayed untested.

Then offer next steps with a decision brief:

- After any move but polish: the polish move as the final pass.
- `/sf-design critique` to re-score the surface.
- `/sf-qa` to exercise the running app end to end.
- After optimize: `/sf-benchmark` for measured before and after numbers.
- For a fresh-eyes read of a finished build against its direction: dispatch the
  `design-finish-reviewer` agent (without a subagent tool, read
  [that agent file](../../agents/design-finish-reviewer.md) and run it in this
  session as its In-session section says).
