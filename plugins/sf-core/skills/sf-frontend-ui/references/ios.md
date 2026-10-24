# iOS and iPadOS

For native apps shipping to Apple hardware: SwiftUI, UIKit, React Native, Expo, Flutter.

On native, the mode narrows what expression may override. Human Interface Guidelines conformance
governs structure, navigation and interaction in every mode; brand speaks through the layer the
platform leaves open: tint, type, motion and content.

## The iOS slop test

Would a fluent iPhone user trust this app, or pause at off-spec controls? The tell is "ported from a
website": reinvented navigation bars, custom back gestures, web-shaped buttons, hover-dependent
affordances, a web icon set. Default to the platform's components; depart only for a reason the user
would thank you for.

## Layout and structure

- **Safe area.** Lay out inside the safe-area insets: no controls under the notch, Dynamic Island, home
  indicator or rounded corners, and nothing hidden behind the keyboard.
- **System navigation.** A tab bar for 2-5 top-level sections (sections, never actions), a navigation
  stack for hierarchy, a sheet for self-contained tasks. No custom global nav, no mixed metaphors, no
  overloaded tab bar.
- **Edge-swipe back stays alive.** The left-edge back gesture is muscle memory; never disable or
  overlay it.
- **Large titles** on top-level screens, collapsing to inline on scroll; deep detail screens stay inline.
- **Adapt to size, not scale.** iPad uses size classes, not a stretched phone layout; landscape works or
  is locked for a stated reason; Split View and Stage Manager windows keep the layout whole.

## Touch targets

**44x44pt minimum** for every tappable control, with breathing room between neighbours.

## Typography

- **Dynamic Type.** The system text styles (Large Title through Caption) so text follows the user's
  reading size; no hard-coded point sizes. Layouts reflow at the largest sizes instead of clipping.
- **San Francisco carries the UI.** Body, labels and controls stay on SF Pro / SF Compact; a brand face
  may appear in display moments.
- **11pt floor**; Body is 17pt.

## Colour and materials

- **Semantic system colours** (label, secondaryLabel, systemBackground, separator, tint). They adapt to
  Dark Mode and Increase Contrast; raw hex breaks there.
- **Dark Mode is a first-class appearance.** Design and test both; text passes contrast in each.
- **One tint colour** drives interactive elements; decoration is not its job.
- **System materials** for blur and translucency behind bars and sheets; no hand-rolled glassmorphism.

## Components and controls

- **Platform controls:** switch, segmented control, stepper, system pickers, action sheets, alerts,
  context menus, swipe actions. Reinventing these for flavour is the most common native slop.
- **SF Symbols** for icons: baseline-aligned, Dynamic Type-aware, with weight and scale variants. No web
  icon set mixed in.
- **Deliberate modality.** A sheet for a focused, dismissible sub-task; a full-screen cover for
  immersion. Clear Cancel and Done; swipe-to-dismiss honoured unless data loss needs a guard.
- **Grouped / inset lists** for settings-shaped content; no bespoke card stacks.

## Accessibility

Every interactive element has an accessibility label, trait and state announcement; VoiceOver reading
and focus order follow the layout, every control is reachable, and focus is not lost on navigation.

## Motion

- **System transitions.** Push slides, sheets rise, dismissal reverses the entrance. Custom transitions
  that fight the navigation model disorient.
- **Honour Reduce Motion:** a crossfade instead of parallax and large slides.

## Performance

No heavy work before the first frame; long content in recycling lists (`List`, `LazyVStack`,
`FlatList`); nothing synchronous in scroll or gesture paths, so 60/120Hz holds; no wasted re-renders;
thumbnails decoded at thumbnail size and cached; no bloated bundle or unused dependencies.

## Verifying the build

- **Screenshots come from the Simulator, never a browser.** Build and run, then
  `xcrun simctl io booted screenshot <path>` (with several running, replace `booted` with the target's
  UDID from `xcrun simctl list devices booted`; display names collide, UDIDs do not). Capture every
  device class the app ships to: at least one iPhone and, when iPad is a target, one iPad.
- **Dark Mode and Dynamic Type are in the pass.** `xcrun simctl ui booted appearance dark` flips
  appearance (reuse the capture's UDID); a check at a large Dynamic Type size catches the truncation a
  fixed layout hides.
- **Simulators give breadth; posture, gestures and performance need hardware.** Say which produced the
  evidence.
