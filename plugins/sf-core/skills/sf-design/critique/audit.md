# Critique: technical audit

The technical audit sub-run of [critique mode](../critique.md): a code-level check of what is
measurable and verifiable in the implementation. It documents; refine mode fixes. Score five
dimensions 0-4 and write the [audit report](#audit-report).

**Branch by platform.** Web (including desktop web shells): [web dimensions](#web-dimensions).
Native (`ios`, `android`, `adaptive`): [native dimensions](#native-dimensions), audited from source
(SwiftUI, UIKit, Compose, React Native, Flutter), with no browser or scan, scored against
[ios.md](../../sf-frontend-ui/references/ios.md) and/or
[android.md](../../sf-frontend-ui/references/android.md) (both for `adaptive`), including their slop
tests. Read the platform reference before scoring.

The rules themselves are the standing build rules in
[build.md](../../sf-frontend-ui/references/build.md) and the
[quality floor](../../sf-frontend-ui/SKILL.md#quality-floor); depth checklists are
[accessibility-checklist.md](../../../references/accessibility-checklist.md) and
[performance-checklist.md](../../../references/performance-checklist.md). This file says how to score
them and what to report.

**Performance is unmeasured here.** The audit reads the code and the render for performance
anti-patterns and marks every performance finding `unmeasured`. Measured numbers (load, Core Web
Vitals, bundle size, before and after) come from `/sf-benchmark`; suggest it when a performance
finding is P0 or P1, or the user wants numbers.

## Web dimensions

What to check in each dimension is the standing build rules in
[build.md](../../sf-frontend-ui/references/build.md) plus the
[quality floor](../../sf-frontend-ui/SKILL.md#quality-floor). Check every rule of the named section
on the code and the render; below is only what the audit adds: the score bands and the
audit-specific checks.

### 1. Accessibility

Check: [build.md §3](../../sf-frontend-ui/references/build.md#3-accessibility-in-code) and the
floor's contrast, keyboard and accessibility lines. The audit adds: note AAA contrast (7:1) where the
brief asks for it.

Score: 0 inaccessible (fails WCAG A) · 1 major gaps (few labels, no keyboard navigation) · 2 partial
(some effort, significant gaps) · 3 good (WCAG AA mostly met) · 4 excellent (WCAG AA fully met,
approaching AAA).

### 2. Performance (unmeasured)

Check: [build.md §7](../../sf-frontend-ui/references/build.md#7-performance), read from the code and
the render. Mark every finding `unmeasured`; suggest `/sf-benchmark` as the intro says.

Score: 0 severe (layout thrash, nothing optimised) · 1 major (no lazy loading, expensive animation) ·
2 partial · 3 good (minor improvements possible) · 4 excellent (lean, well optimised).

### 3. Theming

Check: [build.md §6](../../sf-frontend-ui/references/build.md#6-theming) and the floor's tokens line.

Score: 0 no theming (hard-coded everything) · 1 minimal tokens · 2 tokens exist, used inconsistently ·
3 tokens used, a few hard-coded values · 4 full token system, dark mode works throughout.

### 4. Responsive design

Check: [build.md §4](../../sf-frontend-ui/references/build.md#4-responsive-and-touch) and the floor's
responsive line. The audit adds: where WCAG 2.5.8's 24px minimum applies, its other exceptions also
pass a target (an equivalent control, inline text, user-agent styling, an essential size); and a
missing phone or tablet variant is a finding of its own. **Evidence statement**: for every touch and
gesture finding, say what produced the evidence (emulated viewport, synthesised touch, which engine,
physical device) and what stayed untested.

Score: 0 desktop-only · 1 some breakpoints, many failures · 2 works on a phone, rough edges · 3
responsive, minor target or overflow issues · 4 fluid at every width, proper targets, gestures work
under touch.

### 5. Implementation integrity

Check: [build.md §8](../../sf-frontend-ui/references/build.md#8-integrity). The audit's method: take
assessment B's scan (the design-check CLI's `detect` output, or the manual tells scan; see
[critique.md](../critique.md#assessment-b-scan-and-browser-evidence)) and verify each finding in
context; reuse it rather than scanning again. Keep the deterministic findings apart from visual
judgment, and name the false positives. Desktop apps follow
[critique.md](../critique.md#desktop-apps).

Score: 0 systemic drift · 1 major repeated failures · 2 several verified issues · 3 minor isolated
issues · 4 coherent and intentional.

## Native dimensions

### 1. Accessibility (VoiceOver, TalkBack)

Check for: interactive elements without labels, traits or roles, or state announcements; illogical
reading and focus order, unreachable controls, focus lost on navigation; fixed point sizes defeating
Dynamic Type (iOS) or px instead of sp (Android), layouts that clip or overlap at large sizes; touch
targets under the platform size or crammed together; Reduce Motion ignored (parallax and large slides
with no crossfade); text failing contrast in light or dark.

Score: 0 screen reader unusable · 1 unlabelled controls, no scaling · 2 labels exist, order or scaling
breaks · 3 minor gaps · 4 labelled, ordered, scales cleanly, Reduce Motion honoured.

### 2. Performance (unmeasured)

Check for: heavy work before the first frame; long content without recycling (FlatList, LazyColumn,
List); synchronous work in scroll or gesture paths, dropped frames at 60/120 Hz; unnecessary
re-renders (React Native) or recompositions (Compose), missing memoisation or keys; full-size images
decoded for thumbnails, no caching; a bloated JS bundle or binary, unused dependencies.

Score: 0 janky everywhere · 1 unvirtualised lists, slow launch · 2 partial · 3 minor improvements
possible · 4 fast launch, smooth scroll, lean.

### 3. Appearance and theming

Check for: raw hex instead of semantic system colours (iOS), Material colour roles (Android) or design
tokens; missing dark variants, poor dark contrast, quick inverts; Dynamic Color (Android 12+) with no
static fallback scheme, or ignored where it fits; hand-rolled materials where system materials or
tonal elevation are expected.

Score: 0 hard-coded everything · 1 minimal tokens · 2 tokens used inconsistently · 3 a few hard-coded
values · 4 semantic throughout, both appearances first-class.

### 4. Platform conformance

Check for: system gestures broken (iOS edge-swipe back disabled, Android predictive Back hijacked);
content under the notch, Dynamic Island, home indicator, status bar or keyboard; off-platform
navigation (custom global nav, overloaded tab bars, iOS patterns on Android or the reverse);
web-shaped controls (HTML-style buttons, custom toggles, hover-dependent affordances); mixed icon sets
instead of SF Symbols or Material Symbols; repeated shortcuts or decorative patterns that conflict
with the product, the platform or the design system.

Score: 0 a web port, nothing native · 1 three or four kinds of violation · 2 one or two noticeable ·
3 subtle issues · 4 fully native; a fluent user trusts every screen.

### 5. Adaptivity

Check for: a phone layout stretched onto a tablet instead of using size classes or window size
classes; landscape clipped, ignored or locked without reason; inputs hidden behind the keyboard, no
inset adjustment; iPad Split View or Android multi-window breaking the layout; hinge-unaware layouts on
foldable posture change.

Score: 0 one screen size only · 1 landscape or tablet broken · 2 partial · 3 minor edge cases · 4
adapts across sizes, orientations and windowing.

## Audit report

Severity tags are the [rubric's](rubric.md#severity); bands are the
[rubric's rating bands](rubric.md#scores).

**Audit score**

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | ? | the most critical issue, or "--" |
| 2 | Performance (unmeasured) | ? | |
| 3 | Theming (native: Appearance and theming) | ? | |
| 4 | Responsive design (native: Platform conformance) | ? | |
| 5 | Implementation integrity (native: Adaptivity) | ? | |
| **Total** | | **??/20** | **band** |

**Verdict.** Start here. Web: *Implementation integrity*, pass or fail: does the implementation
express a coherent, product-specific system? Cite verified evidence and scan findings. Native:
*Platform conformance*, pass or fail: does this read as a native app or a ported website? List the
specific violations plainly.

**Executive summary**: the audit score and band; issue counts by severity (P0/P1/P2/P3); the top three
to five critical issues; recommended next steps.

**Findings by severity.** Each issue:
- **[P?] Issue name**
- **Location**: component or screen, file, line
- **Category**: one of the five dimensions
- **Impact**: how it affects users
- **Standard**: the WCAG criterion, HIG or Material rule it violates, if any
- **Recommendation**: how to fix it
- **Refine move**: the `/sf-design refine` move, or `/sf-benchmark` for a measurement

**Patterns and systemic issues**: recurring problems that show a systemic gap rather than a one-off
("hard-coded colours in 15+ components, should use tokens"; "touch targets consistently under the
floor size across the phone tab bar and list rows").

**Positive findings**: good practice to keep and replicate.

Every finding states its impact, gives a specific fix, and is verified in context before it is
reported.
