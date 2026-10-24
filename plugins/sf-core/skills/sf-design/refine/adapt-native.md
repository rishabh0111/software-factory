# Adapt (native): another device class, orientation or platform

A move of [refine mode](../refine.md), reached from the platform check when the
target is `ios`, `android` or `adaptive`. The shared preamble, verification rules
and next steps are there; the web version is [adapt.md](adapt.md).

**Needs:** the target device classes and platforms, and their usage contexts.

Adapt an existing native design to another device class, orientation, platform or
origin. Scaling is the trap; the job is rethinking the experience for the new
context inside the platform's conventions. Read the target platform's reference
before planning if the preamble did not: [ios.md](../../sf-frontend-ui/references/ios.md),
[android.md](../../sf-frontend-ui/references/android.md) (both for a cross-platform
app).

## 1. Assess

1. **Source context**: what it was designed for and what it assumed (phone only,
   portrait only, one platform's idioms, a website).
2. **Target context**: device class (phone, tablet, foldable), orientation,
   platform, usage posture (one-handed on the go, two-handed at rest).
3. **What breaks**: navigation that does not fit, layouts that stretch instead of
   restructuring, gestures or controls that do not exist there.

Done when each has an answer for every target.

## 2. Plan by adaptation

### Phone → tablet

- Restructure through size classes (iOS) or window size classes (Android); a
  scaled-up phone UI is the failure.
- Navigation changes shape: the iPad tab bar stays or becomes a sidebar; the Android
  navigation bar becomes a rail or drawer at expanded width.
- Use the width: split view or master-detail, multi-column grids, popovers where the
  phone used sheets.
- Multitasking is a size: Split View and multi-window can hand a tablet a
  phone-width window, which size-class layout handles.

### Orientation and foldables

Landscape restructures (side-by-side panes, repositioned controls), never clips or
letterboxes; lock orientation only when the task demands it. Foldables react to
posture and hinge through window size classes; test folded, unfolded and tabletop.

### iOS ↔ Android

Translate idioms; never transplant them:

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail / drawer |
| Edge-swipe back, back chevron | Predictive Back gesture / button |
| Switch, segmented control, system pickers | Material switch, chips, Material pickers |
| Action sheet | Bottom sheet / Material dialog |
| SF Symbols, SF Pro, Dynamic Type | Material Symbols, Roboto, sp scaling |
| Semantic system colors, materials | Material color roles, tonal elevation |
| System push/sheet transitions | Container transform, shared-axis, fade-through |

Rebuild navigation and controls in the target's vocabulary; carry the brand's
expressive layer (palette intent, type accent, motion personality) through the
target's theming system.

### Web → native

Reconform, never reflow: the platform's navigation model for web navigation,
platform controls for HTML-shaped ones, touch-first affordances for hover ones,
Dynamic Type or sp for px type. Then hold the result to the full platform
reference; its "would a fluent user trust this" test is the acceptance bar.

Done when each target has its plan.

## 3. Implement

- Structure follows size classes or window size classes, never device-model checks.
- Safe areas and window insets (notch, hinge, status bar, keyboard) hold in every
  new configuration.
- Core functionality stays on every device class; a stretched phone layout, ported
  controls and orientation locks that dodge a layout bug are the failures to catch.

## 4. Verify

Simulators and emulators for breadth, real hardware for truth: at least one phone
and one tablet per shipped platform, both orientations, split screen where
supported, captured per the platform reference's build-verification section.
Posture, gestures and performance need hardware; say which produced each piece of
evidence.

## Done when

- The adaptation feels native to each target context.
- Every device class, orientation and multitasking size in scope was captured, with
  its evidence source named.
