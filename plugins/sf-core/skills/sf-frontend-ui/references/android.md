# Android

For native apps shipping to Android hardware: Jetpack Compose, Android Views, React Native, Expo,
Flutter.

On native, the mode narrows what expression may override. Material Design 3 governs structure,
navigation and interaction in every mode; brand speaks through Material's theming: colour roles, type
scale, shape and motion. A Material-everywhere cross-platform app that also ships to iPhone still owes
iOS its guarantees on that hardware: safe-area insets, Reduce Motion, edge-swipe back
([ios.md](ios.md)).

## The Android slop test

Would a fluent Android user trust this app, or trip on off-spec components? The commonest tell is an
iOS app wearing Android's skin: a bottom-only navigation copied from iPhone, a back arrow that ignores
the system Back gesture, Cupertino-shaped switches and dialogs. Material 3 is the rulebook; follow its
components and theme the brand through it.

## Layout and structure

- **Material navigation, matched to size.** A navigation bar (bottom, 3-5 destinations) on compact
  width; a navigation rail or drawer on expanded width. Never a phone bottom bar left untouched on a
  tablet; window size classes, not a stretched phone layout.
- **System Back always works.** Honour predictive Back and the Back button; never trap the user or
  hijack the gesture.
- **Edge-to-edge with window insets.** Apply the status bar, navigation bar, display cutout and IME
  insets so content never hides behind system bars or the keyboard.
- **A top app bar for screen context**; a FAB when the screen has a single primary action.
- **Adapt:** landscape works or is locked for a stated reason; multi-window keeps the layout whole;
  foldables respond to the hinge and posture changes.

## Touch targets

**48x48dp minimum** for every touch target, with at least 8dp between them.

## Typography

- **The Material type scale:** Display, Headline, Title, Body and Label roles (large / medium / small).
  Map text to roles; never hand-pick sizes per screen.
- **Roboto is the system face;** theme a brand face in through the type scale, keeping body, labels and
  controls legible and consistent.
- **sp units, never fixed px,** so type follows the system font-size setting; layouts reflow rather than
  clip at large scales.

## Colour and theming

- **Material colour roles** (primary, on-primary, surface, surface-variant, secondary-container,
  outline, error). Role tokens resolve light, dark and contrast variants; raw hex breaks there.
- **Dynamic Color (Material You)** where it fits: the scheme from the wallpaper on Android 12+, with a
  static fallback scheme.
- **Dark theme is a first-class scheme,** designed and tested, never a quick invert.
- **Tonal elevation** through the standard surface tonal levels (plus shadow where appropriate); no
  arbitrary drop shadows or hand-rolled materials.

## Components and motion

- **Material components:** buttons (filled / tonal / outlined / text), FAB, switches, chips, snackbars,
  bottom sheets, Material dialogs, navigation bar / rail / drawer. Never port iOS controls or invent
  equivalents. **Material Symbols** for icons, one set.
- **One FAB, one primary action.** Never stacked FABs, never one spent on a secondary task.
- **Snackbars for transient feedback** (actionable when useful); dialogs only for decisions that must
  interrupt.
- **Material motion patterns:** container transform, shared axis, fade through, with standard easing and
  durations; honour the system Remove animations setting with a crossfade or an instant cut.

## Accessibility

Every interactive element has a TalkBack label, role and state; reading and focus order follow the
layout, every control is reachable, and focus is not lost on navigation. Text passes contrast in light
and dark.

## Performance

No heavy work before the first frame; long content in `LazyColumn` / `RecyclerView` / `FlatList`; nothing
synchronous in scroll or gesture paths; no wasted recompositions or re-renders (stable keys,
memoisation); thumbnails decoded small and cached; no bloated bundle or unused dependencies.

## Verifying the build

- **Screenshots come from the emulator or a connected device, never a browser.** Build and install,
  then `adb exec-out screencap -p > <path>` (pick a device with `adb -s <serial>` when several are
  attached). Capture every device class the app ships to: at least one phone and, when tablets are a
  target, one tablet.
- **Dark theme and font scale are in the pass.** Read the current settings first
  (`adb shell cmd uimode night`, `adb shell settings get system font_scale`), then
  `adb shell cmd uimode night yes` and `adb shell settings put system font_scale 1.3` catch the clipped
  labels a fixed layout hides; restore both after. With several targets, put the capture's `-s <serial>`
  on these commands too.
- **Emulators give breadth; gestures, refresh rates and performance need hardware.** Say which produced
  the evidence.
