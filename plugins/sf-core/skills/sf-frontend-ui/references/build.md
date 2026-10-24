# Building it

The engineering half of the floor: how components, state, accessibility, responsiveness, loading and
performance are built so the design survives contact with real data. Read it when you write or
restructure components, not for a style tweak.

## Contents

1. Component architecture
2. State
3. Accessibility in code
4. Responsive and touch
5. Loading and transitions
6. Theming
7. Performance
8. Integrity

## 1. Component architecture

Colocate everything a component owns:

```
src/components/
  TaskList/
    TaskList.tsx          # implementation
    TaskList.test.tsx     # tests
    TaskList.stories.tsx  # stories, if the project uses them
    use-task-list.ts      # a hook, if the state is complex
    types.ts              # component types, if needed
```

**Composition over configuration.** Slots read better and extend without new props:

```tsx
// Composable
<Card>
  <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
  <CardBody><TaskList tasks={tasks} /></CardBody>
</Card>

// Over-configured
<Card title="Tasks" headerVariant="large" bodyPadding="md" content={<TaskList tasks={tasks} />} />
```

**Focused components.** One job each; past about 200 lines, split.

**Data apart from presentation.** The container owns fetching and every data state; the presentation
component renders what it is given:

```tsx
export function TaskListContainer() {
  const { tasks, isLoading, error, refetch } = useTasks();
  if (isLoading) return <TaskListSkeleton />;
  if (error) return <ErrorState message="Couldn't load tasks." retry={refetch} />;
  if (tasks.length === 0) return <EmptyState message="No tasks yet" action="Create a task" />;
  return <TaskList tasks={tasks} />;
}
```

**One vocabulary.** The same button shape, form-control set and icon style on every screen; if Save
looks different in two places, one is wrong. Every interactive component ships default, hover, focus,
active, disabled, loading and error.

**Overlays escape their container.** An absolutely positioned dropdown inside an `overflow: hidden` or
`overflow: auto` ancestor gets clipped; use `<dialog>`, the popover API, `position: fixed` or a portal.

## 2. State

Choose the simplest approach that works:

```
Local state (useState)           -> component-specific UI state
Lifted state                     -> shared between 2-3 siblings
Context                          -> theme, auth, locale (read-heavy, write-rare)
URL state (searchParams)         -> filters, pagination, shareable UI state
Server state (React Query, SWR)  -> remote data with caching
Global store (Zustand, Redux)    -> complex client state shared app-wide
```

Prop drilling past three levels means the tree wants context or restructuring. Counts and totals shown
in scope are computed from the rows in the current view and recomputed on every switch.

## 3. Accessibility in code

```tsx
<button onClick={handleClick}>Save</button>            // focusable by default
<div role="button" tabIndex={0} onClick={handleClick}  // only when a <button> is impossible
     onKeyDown={e => { if (e.key === 'Enter') handleClick(); if (e.key === ' ') e.preventDefault(); }}
     onKeyUp={e => { if (e.key === ' ') handleClick(); }}>Save</div>

<button aria-label="Close dialog"><XIcon /></button>   // icon-only controls get a name
<label htmlFor="email">Email</label><input id="email" type="email" />
```

Move focus when content changes, and hold it inside an open dialog:

```tsx
function Dialog({ isOpen, onClose }: DialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (isOpen) closeRef.current?.focus(); }, [isOpen]);
  return (
    <dialog open={isOpen}>
      <button ref={closeRef} onClick={onClose}>Close</button>
    </dialog>
  );
}
```

Standing checks: semantic landmarks; headings in order; alt text that says what the picture shows
(`alt=""` on decorative repeats); inputs with labels, clear errors and required markers; ARIA roles,
names and states on custom widgets; live regions for changes the user did not trigger. Reduced motion
needs an intentional alternative that keeps state changes and hierarchy; a global `0.01ms` kill that
destroys useful feedback fails it, as does flashing above threshold or motion that blocks focus,
reading or the task. Contrast: text meets 4.5:1 (3:1 at large sizes); icons, input borders, focus
rings and chart marks that carry meaning meet 3:1 against what is next to them; 7:1 is the AAA bar
for body text where the brief asks for it. The page stays usable in `forced-colors: active`: borders
and focus rings survive, and no state is shown by colour alone. Full list:
[accessibility-checklist.md](../../../references/accessibility-checklist.md).

## 4. Responsive and touch

Mobile first, then widen:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

- Check 320, 390, 768, 1024 and 1440. Responsive behaviour on app screens is structural (the sidebar
  collapses, tables become two-line lists, columns change at breakpoints), not fluid type.
- No fixed widths that break on a phone; no sideways page scroll; text at 200% keeps the layout.
- Touch targets 44x44px. WCAG 2.5.8 sets a 24x24 CSS px minimum, met by spacing when a 24px circle
  centred on the target overlaps no other target or other undersized target's circle.
- **Touch gestures work under touch.** Custom sliders, drag surfaces and scrolling control strips: a
  pointer-event drag surface sets `touch-action`, drag state clears on `pointercancel`, lost capture and
  blur, and the page scroll is neither swallowed nor stealing the drag. Exercise the gesture with
  synthesized touch when a browser tool can; a rendered viewport proves layout, not the gesture. Say what
  produced the evidence and what stayed untested.
- Hover styles sit behind `@media (hover: hover) and (pointer: fine)`; touch fires hover on tap and
  leaves it stuck.

## 5. Loading and transitions

Skeletons for content, never a spinner in the middle of it: the final layout with each value replaced by
a flat bar at its real size, labels and headers shown at once, no shimmer gradient, no shift when the
data lands. A refresh keeps the old values and updates a freshness stamp.

```tsx
function TaskListSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 3 }).map((_, i) => <li key={i} className="h-12 bg-surface rounded" />)}
    </ul>
  );
}
```

Optimistic updates for perceived speed, with rollback:

```tsx
function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
      return { previous };
    },
    onError: (_err, _id, context) => queryClient.setQueryData(['tasks'], context?.previous),
  });
}
```

## 6. Theming

Every colour through a token; dark mode a full scheme, not an invert; no values that fail to update on
a theme switch; one token type per job (never a spacing token as a radius). `color-scheme` set on the
root so form controls and scrollbars follow.

## 7. Performance

- No layout thrash: never read and write layout properties in one loop.
- Animate `transform`, `opacity`, `clip-path`; bound blur, filter and shadow effects and drop any that
  lose frames.
- `will-change` only on an element about to animate, removed after.
- Images lazy-loaded below the fold, sized (`width`/`height` or `aspect-ratio`), served at about twice
  their CSS width; the hero gets `fetchpriority="high"`.
- No unused imports or dependencies; memoise what re-renders without reason.
- Pause loops off screen and when the tab is hidden.

## 8. Integrity

The implementation expresses one product-specific system: no repeated shortcuts, no drift from the
design system, no misleading or decorative content, no structure interchangeable with an unrelated
product. Desktop shells (Electron, WebView2, CEF) are checked in their own window, not a browser tab;
where no rendered check can run (Tauri on WebKit), say so.
