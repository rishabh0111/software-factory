# Animate: motion that explains

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** performance constraints and target devices, when the code does not
show them.

Motion explains state, relationship and hierarchy, or makes one authored moment
the surface has earned. Motion without a purpose is animation debt. It is the wrong
move for a page that needs a technically extraordinary effect the user asked for
(overdrive) or for motion whose job is personality at one moment (delight, which
loads this file for its motion).

By mode ([modes](../../sf-frontend-ui/SKILL.md#modes)):
- **Persuade, Experience**: motion may carry the voice; one rehearsed focal
  sequence beats repeated section reveals.
- **Operate, Read**: feedback, state and continuity; routine transitions fast, no
  page-load choreography to wait through.
- **Native**: the Motion sections of [ios.md](../../sf-frontend-ui/references/ios.md)
  and [android.md](../../sf-frontend-ui/references/android.md), including Reduce
  Motion; the web tooling below does not apply.

Craft depth: the floor's motion line
([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)) and the per-mode
budget in [motion.md](../../sf-frontend-ui/references/motion.md).

## 1. Find the job

Read the existing motion language, interaction states, target devices and
performance budget. Mark only the places where motion would acknowledge an action,
make a state change or spatial relationship legible, keep continuity through
navigation or layout change, direct attention at a meaningful moment, or embody the
chosen world. A static area stays static. Done when each marked place has its job
named.

## 2. Write the motion thesis

A short plan before code:

- **Focal moment**: the one sequence that deserves authorship, if any, drawn from
  this product and surface. A generic fade-and-rise, hover lift, parallax layer or
  scroll reveal is not a thesis.
- **Continuity**: the state, layout or navigation changes that need explaining.
- **Feedback**: the controls and outcomes that need acknowledging.
- **Budget**: the expensive effects and how often they run.

Done when the four lines are written.

## 3. Choose material by meaning

- **Continuity and relationship**: shared-element motion, FLIP transforms, view
  transitions, deliberate spatial movement.
- **Focus and depth**: bounded blur, filter, backdrop, light or shadow change.
- **Reveal and composition**: masks, clip paths, cropping, controlled occlusion.
- **Material and energy**: colour, gradient position, texture, distortion or
  shaders when the world and runtime support them.
- **State and feedback**: the smallest change that makes cause and result
  unmistakable.

One strong material idea through the focal sequence, with quiet supporting states,
is usually enough; stacking techniques is spectacle. Stagger siblings only when a
list appears as a list, cap the total delay, and leave scrolled sections
unstaggered.

## 4. Timing and easing

Timing expresses distance and consequence. Take durations, exit ratios and easing
curves from [motion.md](../../sf-frontend-ui/references/motion.md) (its "How long?"
step and easing tokens). Long feedback reads as latency. Done when every
animation in the thesis has a duration and curve from that scale.

## 5. Implement to the runtime

- CSS transitions and keyframes for declarative state and bounded sequences.
- The Web Animations API or the project's motion library for interruption,
  sequencing and dynamic values.
- View Transitions or shared-element techniques when continuity is the point.
- Scroll-driven motion only when the scroll relationship itself carries meaning,
  with a robust fallback.
- The existing stack first; a new dependency only for what it cannot express.

The default state shows the content, so a failed script hides nothing. Layout
properties change through FLIP, transforms or grid techniques. Blur, filter,
shadow, canvas and shader work stays bounded to isolated regions; `will-change`
only during a known animation. Measure on the target viewports and devices.

## 6. Accessibility and control

Respect autoplay and sound preferences; every nonessential loop stops when off
screen or hidden. Every web animation has a `prefers-reduced-motion` path that is
an intentional alternative: spatial movement reduced or removed, the opacity,
colour and state changes that carry meaning kept, feedback still legible.

## Done when

- The focal motion is specific to this world and surface.
- Every supporting animation explains feedback, state or relationship; removing
  any one would lose meaning or authored character.
- Interruption and repeated use behave correctly.
- Desktop, mobile and keyboard paths stay usable.
- The reduced-motion path keeps meaningful feedback and state changes.
- Expensive effects stay smooth on the target device.
