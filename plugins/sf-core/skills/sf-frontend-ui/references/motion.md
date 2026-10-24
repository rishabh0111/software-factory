# Motion

Read this before adding any animation. The still UI must already be finished; motion never rescues a
weak layout. A page that needs animation to look finished is not finished.

## Contents

1. Budget by mode
2. What strong pages do with motion
3. Four questions before any animation
4. Tokens
5. Scroll behaviours, ranked
6. Recipes
7. Signature moves
8. Reduced motion and performance
9. What gives generated motion away
10. Rules for motion

## 1. Budget by mode

**Persuade and Experience pages.** A page that does not move reads as a mock-up. The motion layer has:

- **One signature move:** the thing a visitor would describe an hour later (the headline rising out of
  a mask, the image opening like a shutter, the wordmark scaling with the scroll). The only move allowed
  to be loud. Pick it by subject (section 7); a move that says nothing about the subject is decoration.
- **Section entrances, choreographed per section:** the parts arrive in reading order (heading, text,
  picture, details), staggered 60-90ms, rising 16-32px with opacity, once. Vary the manner with the
  content: a list row by row, a picture from a mask or a slight scale, a figure counting up once, a
  statement line by line. One identical preset stamped on every section is the most cited motion tell.
- **Feedback under the hand:** buttons that give on press, links that answer the pointer, a menu that
  opens from where it was clicked.
- **One moving picture:** a muted looping clip with a poster, a slow drift or scale on a large
  photograph, or a scroll-linked move on the hero picture.
- **Scroll scenes**, when a design job deals them (a camera through a field of pictures, a picture that
  grows from a window to the whole screen, type crossing a held stage): two or three per page at most,
  each held for one to four screens, each with a phone version and a finished composition under reduced
  motion. Building one is a design job: suggest the user run `/sf-design`.

Reach past transform and opacity where it stays smooth: blur, backdrop-filter, clip-path, mask and
shadow belong to the palette of moves.

**Read pages.** Feedback, and at most one quiet signature move in the frame; nothing moves in the
reading column.

**Operate (app screens) and native.** Motion is state, not decoration: state change, feedback, loading,
reveal, nothing else. 150-250ms on most transitions. No entrances, no orchestrated page-load sequence:
the product loads into a task. Native apps use the system transitions and honour Reduce Motion / Remove
animations ([ios.md](ios.md), [android.md](android.md)).

## 2. What strong pages do with motion

Measured on 99 recent gallery Sites of the Day at 1440 and 390, recording the transitions, tweens and
scroll triggers that ran. Where the gallery does something the house bans, the house version follows.

- **The stack.** Two in three use a smooth-scroll library, three in five ship Three.js. The quiet layer
  (reveals, line rises, the ink fill) needs none of it: CSS scroll timelines and view transitions do that
  work.
- **Curves.** Strong ease-outs ran most: expo out (`.16,1,.3,1`, `.19,1,.22,1`) on 14 sites, cubic out on
  13, quint out on 7. In-out curves for wipes and travel. Ease-in only for exits, short. Colour changes on
  plain `ease`. Overshoot sat in 19 stylesheets and ran on 2.
- **Durations.** Hover colour 200-300ms; small interface moves 300-450ms; reveals and line rises
  600-1,000ms; picture openings and wipes 1,100-1,600ms. Median of everything that ran: 420ms.
- **Staggers.** 20-40ms between characters, 75-120ms between lines, 50-100ms between list items.
- **Scroll-linked motion is locked to the scrollbar** on 14 of 18 scrubbing sites. Reveals fire when the
  element's top is 80-95% down the viewport, once.
- **How much moves.** A median of 130 script-moved elements, from a few gestures (one split heading is
  20-60 elements). Eight moving elements is a floor for a Persuade page, not a target.
- **Waiting is the commonest cost.** 60 of 99 open on a loading screen, 26 with a counter; half the
  usable pages were unreadable 2.5s after load, a third at 4.5s. Readers' design marks were the same
  whatever the wait; only usability fell. House: no preloader, the message readable on the first frame,
  the load sequence over by 1.2s.
- **Pins cost length.** Pages with sticky or pinned stages are twice as long (16.6 screens against 7.5)
  for fewer words per screen. House: at most two held stages, about one screen per step, three screens
  per stage.
- **Reduced motion is mostly missing** (35 of 99 have any rule). Every recipe here keeps the finished
  state as the reduced state.

## 3. Four questions before any animation

1. **How often will someone see it?** Once per visit (hero load, a section reveal): it can take its time.
   Many times (hover, menu, accordion): fast and small. Hundreds of times (keyboard actions, typing): no
   animation.
2. **What is it for?** It shows where something came from, confirms an action, keeps a change from being
   jarring, explains how the product works, or is the signature move. "It looks nice" is valid only for
   the signature move.
3. **Which easing?** Entering or leaving: ease-out, so movement starts the instant the eye arrives.
   Between two places on screen: ease-in-out. Colour and opacity on hover: `ease`. Constant travel:
   `linear`. Not `ease-in` for anything the visitor waits to see. The CSS keyword curves are weak; use
   the tokens.
4. **How long?** Press 100-160ms. Hover 150-200ms. Menus and popovers 150-250ms. Dialogs and drawers
   250-450ms. Section and hero reveals 500-900ms. Leaving takes about 70% of arriving.

## 4. Tokens

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);          /* entrances, moving hovers, UI under 600ms */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);          /* reveals of 800ms and longer, line rises, openings */
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);       /* wipes, panels, things that travel while visible */
  --ease-soft: cubic-bezier(0.33, 1, 0.68, 1);         /* slow scale and drift on photographs */
  --ease-exit: cubic-bezier(0.55, 0.055, 0.675, 0.19); /* something leaving for good, short */
  --t-press: 140ms;
  --t-hover: 180ms;
  --t-ui: 240ms;
  --t-reveal: 800ms;
  --t-open: 1200ms;                                    /* picture openings and clip wipes */
  --stagger-line: 90ms;
  --stagger-item: 70ms;
}
```

`--ease-out` (quint out) is the most frequent chosen curve that ran. `--ease-expo` is what long reveals
use. `--ease-exit` serves exactly one job: something leaving for good, at 60-70% of the matching
entrance. Not adopted: `.4,0,.2,1` (a framework default) and overshoot curves on interface elements. A
hover that moves something (a label roll, an arrow) takes `--t-ui` to 400ms.

## 5. Scroll behaviours, ranked

| Behaviour | Pages of 99 | What it serves | House version |
|---|---|---|---|
| Smooth-scroll library | 67 | A feeling of weight | Optional, light (lerp 0.1-0.14), off for touch and reduced motion |
| Held (sticky or pinned) stage | 44 | One picture or object carries several claims | Two or three per page, one to four screens each; other sticky stages three screens at most |
| Split text | 40 | Lines and words arriving as they are read | Lines for headings and statements; words only for the ink fill; characters only for a heading of one to three words |
| Colour by chapter | 34 | Tells chapters apart without padding bands | Hard cuts at section edges; the header ink follows in 300ms |
| Scroll-scrubbed scene | 26 | Explains a product by moving it | With a finished composition for reduced motion |
| Parallax depth | 24 | Depth in collages | Travel under 8% of the element; pictures held at 106-110% in their frames |
| Marquee | 21 | Life on a static band | One per page, pausable |
| Masked line or word rise | 18 | Headings that arrive like set type | Masked line reveal on load; lines that rise on scroll below the fold |
| Wheel drives a scene, no page scroll | 16 | Browsing one object | Not used |
| Blur-in | 15 | Soft arrival | At most 8px, 600ms, gone once settled; never on body text |
| Inset frame to full-bleed | 14 | Hand-over from a type screen to the big picture | Opening window, about one screen of scroll |
| Grey-to-ink text fill | 14 | Paces one statement | Once per page, starting at 45% ink |
| Sheet slides over a held layer | 11 | Page-turn rhythm | Sheet over a held picture |
| Scramble or decode | 11 | A "code" voice | Not used |
| Horizontal track pinned to vertical scroll | 8 | Walking through rooms or a collection | Native drag row first; pinned only under three screens long, with keyboard support |
| Curtain footer | 8 | The page ends as a scene | Allowed |
| Rolling digits | 6 | Figures that arrive | For pages whose case is a handful of numbers |
| Index with hover preview | 5 | Navigating work by name | Anchored to the row |

## 6. Recipes

All recipes keep content visible with JavaScript off, put every hidden state inside
`prefers-reduced-motion: no-preference`, and use the tokens. The hidden state applies only under
`html.js`, set by one inline line:

```html
<script>document.documentElement.classList.add('js')</script>
```

Two notes that apply to several: `animation-timeline: view()` watches the nearest scroll container and
`overflow: hidden` makes one, so a picture in an `overflow: hidden` frame never animates (use
`overflow: clip`, or name the timeline on the section). Scroll-linked means linear: the scroll is the
easing.

### Load sequence in 1.2 seconds

Everything is in the HTML and painted on the first frame; the sequence only adds arrival. Nothing waits
for the load event; nothing in the navigation animates.

```html
<header class="hero">
  <h1 class="display lines">
    <span class="line"><span data-line style="--i:0">Stools for</span></span>
    <span class="line"><span data-line style="--i:1">small kitchens</span></span>
  </h1>
  <p class="lead" data-load style="--d:420ms">…</p>
  <a class="button" data-load style="--d:480ms" href="#stools">See the stools</a>
  <figure class="hero__picture" data-open><img src="stool.jpg" alt="…" fetchpriority="high"></figure>
</header>
```

```css
.hero__picture { overflow: clip; margin: 0; }
@media (prefers-reduced-motion: no-preference) {
  .js .hero [data-line] { transform: translateY(105%); animation: load-line 800ms var(--ease-expo) forwards; animation-delay: calc(100ms + var(--i) * var(--stagger-line)); }
  .js .hero [data-load] { opacity: 0; transform: translateY(12px); animation: load-rise 500ms var(--ease-out) forwards; animation-delay: var(--d); }
  .js .hero [data-open] { clip-path: inset(0 0 100% 0); animation: load-open 1000ms var(--ease-in-out) 150ms forwards; }
  .js .hero [data-open] img { transform: scale(1.08); animation: load-settle 1100ms var(--ease-expo) 100ms forwards; }
}
@keyframes load-line { to { transform: none; } }
@keyframes load-rise { to { opacity: 1; transform: none; } }
@keyframes load-open { to { clip-path: inset(0); } }
@keyframes load-settle { to { transform: none; } }
```

All settled by 1.2s, four things at most. Preload the display font so the lines rise in the real face;
give the picture `fetchpriority="high"` and a ground colour sampled from it so a slow image opens onto its
own colour.

### Masked line reveal

Each line slides up from behind its own baseline; with headlines capped at two lines, you author the
breaks and wrap each line.

```css
.lines .line { display: block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.lines [data-line] { display: block; }
@media (prefers-reduced-motion: no-preference) {
  .js .lines [data-line] { transform: translateY(105%); animation: line-up 900ms var(--ease-out) forwards; animation-delay: calc(var(--i) * 110ms + 150ms); }
}
@keyframes line-up { to { transform: none; } }
```

The padding / negative-margin pair stops descenders being clipped. On a phone, check the authored lines
do not each wrap; if they do, author a shorter break or reduce the size.

### Reveal on scroll, once

For the sections that deserve it, not every block.

```css
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 700ms var(--ease-out), transform 900ms var(--ease-out); }
  .js [data-reveal].is-in { opacity: 1; transform: none; }
}
```

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

Never a scroll listener, never a replay on re-entry, never anything left at `opacity: 0` if the observer
fails.

### Image shutter

An image opens from one edge while settling inside its frame; for the one hero or showcase image.

```css
.shutter { overflow: hidden; }
@media (prefers-reduced-motion: no-preference) {
  .js .shutter { clip-path: inset(0 0 100% 0); transition: clip-path 1100ms var(--ease-in-out); }
  .js .shutter img { transform: scale(1.12); transition: transform 1500ms var(--ease-soft); }
  .js .shutter.is-in { clip-path: inset(0); }
  .js .shutter.is-in img { transform: none; }
}
```

### Press and hover

```css
.button { transition: transform var(--t-press) var(--ease-out), background-color var(--t-hover) ease, color var(--t-hover) ease; }
.button:active { transform: scale(0.97); }
.link { text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 0.2em; text-decoration-thickness: 0.07em; transition: text-decoration-color var(--t-hover) ease; }
@media (hover: hover) and (pointer: fine) {
  .button:hover { background-color: var(--accent-strong); }
  .link:hover { text-decoration-color: currentColor; }
}
```

Hover behind `(hover: hover)`; it raises contrast, never lowers it; no weight change; no lift or scale on
every card, one consistent small response.

### Scroll-linked progress without JavaScript

For a wordmark that scales as the hero leaves, a picture that drifts a few percent, a progress bar.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .drift { animation: drift linear both; animation-timeline: view(); animation-range: entry 0% exit 100%; }
    @keyframes drift { from { transform: translateY(-4%); } to { transform: translateY(4%); } }
  }
}
```

Travel under 8%; large parallax makes text hard to read and looks dated.

### Pinned story

A heading holds while items pass; `position: sticky`, never hijacked scrolling.

```css
.story { display: grid; grid-template-columns: 5fr 7fr; gap: var(--gutter); align-items: start; }
.story__title { position: sticky; top: 18vh; }
@media (max-width: 800px) { .story { grid-template-columns: 1fr; } .story__title { position: static; } }
```

### Index with preview, anchored to the row

Rows of names; pointing at a row or tabbing to it opens one frame level with that row. The frame follows
the row, never the pointer.

```css
.index { position: relative; }
.index__list { list-style: none; margin: 0; padding: 0; }
.index__row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 0 var(--gutter); padding-block: 0.3em; font-size: var(--step-head); color: inherit; text-decoration: none; transition: opacity var(--t-hover) ease; }
.index__thumb { order: -1; flex-basis: 100%; width: 100%; height: auto; margin-bottom: 0.4rem; }
.index__frame { display: none; }
@media (hover: hover) and (pointer: fine) {
  .index__list { max-width: 62%; }
  .index__thumb { display: none; }
  .index__list:has(.index__row:hover, .index__row:focus-visible) .index__row:not(:hover, :focus-visible) { opacity: 0.4; }
  .index__frame { display: block; position: absolute; top: 0; right: var(--margin); width: 30%; aspect-ratio: 4 / 3; z-index: 1; pointer-events: none; clip-path: inset(100% 0 0 0); transition: clip-path 320ms var(--ease-out), transform 360ms var(--ease-out); }
  .index__frame.is-open { clip-path: inset(0); }
  .index__frame img { width: 100%; height: 100%; object-fit: cover; }
}
@media (prefers-reduced-motion: reduce) { .index__frame { transition: none; } }
```

```js
(() => {
  const root = document.querySelector('.index');
  if (!root) return;
  const frame = root.querySelector('.index__frame');
  const picture = frame.querySelector('img');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let warmed = false;
  const show = (row) => {
    if (!fine.matches) return;
    if (!warmed) { warmed = true; root.querySelectorAll('[data-preview]').forEach((a) => { new Image().src = a.dataset.preview; }); }
    picture.src = row.dataset.preview;
    const y = row.offsetTop + row.offsetHeight / 2 - frame.offsetHeight / 2;
    const max = root.offsetHeight - frame.offsetHeight;
    const opening = !frame.classList.contains('is-open');
    if (opening) frame.style.transitionProperty = 'clip-path';   // open in place, not sliding from the top
    frame.style.transform = `translateY(${Math.min(max, Math.max(0, y))}px)`;
    if (opening) { frame.getBoundingClientRect(); frame.style.transitionProperty = ''; }
    frame.classList.add('is-open');
  };
  const hide = () => frame.classList.remove('is-open');
  root.querySelectorAll('.index__row').forEach((row) => {
    row.addEventListener('pointerenter', () => show(row));
    row.addEventListener('focus', () => show(row));
  });
  root.addEventListener('pointerleave', hide);
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) hide(); });
})();
```

Each row holds `<a class="index__row" data-preview="…">` with its name, year and an `index__thumb`
image; the section holds one `<div class="index__frame" aria-hidden="true"><img alt=""></div>`. On touch
screens each row shows its own picture above the name. Dimmed rows stay at 0.4, the floor for dimmed
text. Image trails and cursor-borne previews are the gimmick version.

### Lines that rise on scroll

For a heading or statement whose breaks you do not control: split after fonts load, reveal once, then
give the plain text back so it rewraps. Plain text only.

```css
[data-lines] .line { display: block; overflow: clip; padding-bottom: 0.12em; margin-bottom: -0.12em; }
[data-lines] .line > span { display: block; }
@media (prefers-reduced-motion: no-preference) {
  .is-split .line > span { transform: translateY(110%); }
  .is-split.is-in .line > span { transform: none; transition: transform 900ms var(--ease-expo) calc(var(--i) * var(--stagger-line)); }
}
```

```js
(() => {
  const els = [...document.querySelectorAll('[data-lines]')];
  if (!els.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const restore = (el) => { el.textContent = el.dataset.text; el.classList.remove('is-split', 'is-in'); };
  const split = (el) => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.dataset.text = text;
    el.textContent = '';
    const words = text.split(' ').map((word) => {
      const s = document.createElement('span');
      s.style.display = 'inline-block';
      s.textContent = word;
      el.append(s, ' ');
      return s;
    });
    const lines = [];                                     // group words by the line they landed on
    for (const w of words) {
      const last = lines.at(-1);
      if (last && Math.abs(last.top - w.offsetTop) < 4) last.words.push(w.textContent);
      else lines.push({ top: w.offsetTop, words: [w.textContent] });
    }
    el.textContent = '';
    lines.forEach((line, i) => {
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'line';
      inner.style.setProperty('--i', i);
      inner.textContent = line.words.join(' ');
      mask.append(inner);
      el.append(mask, ' ');
    });
    el.classList.add('is-split');
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      e.target.classList.add('is-in');
      e.target.querySelector('.line:last-of-type > span').addEventListener('transitionend', () => restore(e.target), { once: true });
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.fonts.ready.then(() => els.forEach((el) => { split(el); io.observe(el); }));
  let width = innerWidth;                                 // a width change before the reveal: give the text back
  addEventListener('resize', () => {
    if (innerWidth === width) return;
    width = innerWidth;
    els.filter((el) => el.matches('.is-split:not(.is-in)')).forEach((el) => { io.unobserve(el); restore(el); });
  });
})();
```

Masked rises from 100-120% below the line, 0.6-1.2s, 75-120ms between lines, fired when the block's top
is 80-95% down the viewport.

### Opening window

A type screen hands over to the one big picture: it shows as a window in the middle of a held stage and
opens to full-bleed over about one screen of scroll.

```css
.opening__stage { height: 100svh; overflow: clip; }
.opening__stage img { display: block; width: 100%; height: 100%; object-fit: cover; }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .opening { height: 200svh; view-timeline-name: --opening; --inset-y: 20%; --inset-x: 28%; }
    .opening__stage { position: sticky; top: 0; animation: opening-window linear both; animation-timeline: --opening; animation-range: contain 0% contain 75%; }
    .opening__stage img { animation: opening-settle linear both; animation-timeline: --opening; animation-range: contain 0% contain 75%; }
  }
}
@media (max-width: 700px) { .opening { --inset-y: 18%; --inset-x: 8%; } }
@keyframes opening-window { from { clip-path: inset(var(--inset-y) var(--inset-x)); } to { clip-path: inset(0); } }
@keyframes opening-settle { from { transform: scale(1.15); } to { transform: none; } }
```

Two screens tall, held for one, fully open after three quarters so the picture rests before the page
moves on. Without scroll timelines and under reduced motion, a full-bleed screen.

### Held picture, passing captions

The picture holds on one side while short captions pass; the caption at the middle of the screen is lit
and its picture shown.

```css
.steps { display: grid; grid-template-columns: 7fr 5fr; column-gap: var(--gutter); }
.steps__media { margin: 0; align-self: start; }            /* a stretched grid item cannot stick */
.steps__pictures img { display: block; width: 100%; height: auto; }
.steps__list { list-style: none; margin: 0; padding: 0; }
.steps__item { min-height: 80svh; display: flex; flex-direction: column; justify-content: center; }
.js .steps__media { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; justify-content: center; gap: 0.75rem; }
.js .steps__pictures { position: relative; aspect-ratio: 4 / 5; max-height: 80svh; }
.js .steps__pictures img { position: absolute; inset: 0; height: 100%; object-fit: cover; opacity: 0; transition: opacity 500ms ease; }
.js .steps__pictures img.is-on { opacity: 1; }
.js .steps__item { opacity: 0.4; transition: opacity var(--t-ui) ease; }
.js .steps__item.is-active { opacity: 1; }
@media (max-width: 800px) {
  .steps { display: block; }
  .js .steps__media { height: auto; z-index: 1; background: var(--bg); padding-block: 0.5rem; }
  .js .steps__pictures { aspect-ratio: 3 / 2; max-height: 42svh; }
  .steps__item { min-height: 60svh; }
}
@media (prefers-reduced-motion: reduce) { .js .steps__pictures img, .js .steps__item { transition: none; } }
```

```js
(() => {
  const root = document.querySelector('.steps');
  if (!root || !('IntersectionObserver' in window)) return;
  const items = [...root.querySelectorAll('.steps__item')];
  const pictures = [...root.querySelectorAll('.steps__pictures img')];
  const count = root.querySelector('.steps__count');
  const show = (i) => {
    items.forEach((el, k) => el.classList.toggle('is-active', k === i));
    pictures.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (count) count.textContent = `${i + 1} of ${items.length}`;
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) show(items.indexOf(e.target));
  }, { rootMargin: '-45% 0px -45% 0px' });                  // a band across the middle of the screen
  items.forEach((el) => io.observe(el));
  show(0);
})();
```

Without JavaScript, two plain columns. Inactive items no lower than 40%; crossfades 400-600ms; about one
screen per step; a visible count on any held sequence over two steps, as a plain sentence ("2 of 4"), not
a zero-padded numeral.

### Sideways gallery

A short collection (eight items or fewer) moved sideways by the vertical scroll while the stage holds.
The native drag row is the base; the pinned version only on wide screens with motion allowed and a row
under three screens long.

```css
.gallery__track { display: flex; gap: var(--gutter); list-style: none; margin: 0; padding: 0 var(--margin); overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--margin); }
.gallery__item { flex: 0 0 min(72vw, 28rem); scroll-snap-align: start; }
.gallery__item img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; }
.gallery.is-pinned .gallery__stage { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; justify-content: center; gap: 2rem; overflow: clip; }
.gallery.is-pinned .gallery__track { overflow: visible; scroll-snap-type: none; }
.gallery.is-pinned .gallery__item { flex-basis: calc(62svh * 0.8); }
```

```js
(() => {
  const root = document.querySelector('.gallery');
  if (!root) return;
  const track = root.querySelector('.gallery__track');
  const wide = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
  let dx = 0, queued = false;
  const place = () => {
    queued = false;
    if (!root.classList.contains('is-pinned')) return;
    const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / dx));
    track.style.transform = `translate3d(${(-p * dx).toFixed(1)}px, 0, 0)`;
  };
  const measure = () => {
    root.classList.add('is-pinned');                       // measure the row as it would be when pinned
    track.style.transform = '';
    dx = track.scrollWidth - track.clientWidth;
    const pin = wide.matches && dx > 0 && dx < innerHeight * 3;
    root.classList.toggle('is-pinned', pin);
    root.style.height = pin ? `${innerHeight + dx}px` : ''; // one pixel of scroll moves the row one pixel
    place();
  };
  track.addEventListener('focusin', (e) => {               // keyboard: bring the focused item into view
    if (!root.classList.contains('is-pinned')) return;
    const item = e.target.closest('.gallery__item');
    const x = Math.min(dx, Math.max(0, item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
    scrollTo({ top: root.getBoundingClientRect().top + scrollY + x, behavior: 'instant' });
  });
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(place); } }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  wide.addEventListener('change', measure);
  measure();
})();
```

Speed 1:1; the hold ends when the last picture reaches the margin. Phones, narrow windows, reduced motion
and long rows get the native snapping row. Never put the only copy of an action inside the moving row.

### Receding hero

As the first screen leaves, its picture sinks a little and darkens while the words lift away faster.

```css
.hero { position: relative; min-height: 100svh; overflow: clip; display: grid; align-items: end; view-timeline-name: --hero; }
.hero__picture { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero::after { content: ''; position: absolute; inset: 0; background: var(--ink); opacity: 0; pointer-events: none; }
.hero__copy { position: relative; z-index: 1; padding: var(--margin); }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .hero__picture { animation: hero-sink linear both; animation-timeline: --hero; animation-range: exit 0% exit 100%; }
    .hero::after { animation: hero-dim linear both; animation-timeline: --hero; animation-range: exit 0% exit 100%; }
    .hero__copy { animation: hero-lift linear both; animation-timeline: --hero; animation-range: exit 0% exit 70%; }
  }
}
@keyframes hero-sink { to { transform: translateY(8%) scale(1.06); } }
@keyframes hero-dim { to { opacity: 0.35; } }
@keyframes hero-lift { to { transform: translateY(-6%); opacity: 0; } }
```

Travel under 8%; the overlay a flat ink up to 35%, not a gradient. Static where unsupported or reduced.

### Page to page

The browser's own view transitions: the old page fades quickly, the new one rises in, and the picture
clicked travels into place as the new page's hero. No library, no full-screen curtain.

```css
@view-transition { navigation: auto; }
@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }
::view-transition-old(root) { animation: vt-leave 200ms var(--ease-exit) both; }
::view-transition-new(root) { animation: vt-arrive 380ms var(--ease-out) 60ms both; }
::view-transition-group(*) { animation-duration: 480ms; animation-timing-function: var(--ease-in-out); }
::view-transition-image-pair(*.picture) { overflow: clip; }
::view-transition-old(*.picture), ::view-transition-new(*.picture) { height: 100%; object-fit: cover; }
@keyframes vt-leave { to { opacity: 0; } }
@keyframes vt-arrive { from { opacity: 0; transform: translateY(16px); } }
```

The two pictures share a `view-transition-name` (once per page) and `view-transition-class: picture`. The
new page is readable within half a second.

### Ink fill

One statement fills from part-ink to full ink as it rises through the screen; readable before it fills.

```css
[data-fill] { --fill: var(--ink); color: var(--fill); }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .is-filling > span { display: inline-block; color: color-mix(in oklab, var(--fill) 45%, transparent); animation: ink-fill linear both; animation-timeline: view(); animation-range: cover 20% cover 45%; }
  }
}
@keyframes ink-fill { to { color: var(--fill); } }
```

```js
(() => {
  if (!CSS.supports('animation-timeline: view()') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-fill]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const s = document.createElement('span');
      s.textContent = word;
      el.append(s, i < words.length - 1 ? ' ' : '');
    });
    el.classList.add('is-filling');
  });
})();
```

One statement per page, three to five lines, 32px or larger, starting at 45% (about 3:1). Full ink
without scroll timelines or under reduced motion.

### Rolling figures

For pages whose case is a handful of numbers: each digit rolls up to its value once, columns a beat
apart; the real number stays in the text for screen readers.

```css
.roll__digits { display: inline-flex; font-variant-numeric: tabular-nums; line-height: 1; }
.roll__col { display: inline-block; height: 1em; overflow: clip; }
.roll__strip { display: flex; flex-direction: column; transform: translateY(calc(var(--d) * -1em)); }
.roll__strip > span { height: 1em; }
@media (prefers-reduced-motion: no-preference) {
  .roll:not(.is-in) .roll__strip { transform: none; }
  .roll.is-in .roll__strip { transition: transform 1100ms var(--ease-expo) calc(var(--i) * var(--stagger-item)); }
}
```

```js
(() => {
  const els = [...document.querySelectorAll('[data-roll]')];
  if (!els.length) return;
  els.forEach((el) => {
    const value = el.textContent.trim();
    const said = Object.assign(document.createElement('span'), { className: 'sr-only', textContent: value });
    const shown = Object.assign(document.createElement('span'), { className: 'roll__digits' });
    shown.setAttribute('aria-hidden', 'true');
    let i = 0;
    for (const ch of value) {
      if (!/\d/.test(ch)) { shown.append(ch); continue; }
      const col = Object.assign(document.createElement('span'), { className: 'roll__col' });
      const strip = Object.assign(document.createElement('span'), { className: 'roll__strip' });
      strip.style.setProperty('--d', ch);
      strip.style.setProperty('--i', i++);
      for (let n = 0; n < 10; n++) strip.append(Object.assign(document.createElement('span'), { textContent: n }));
      col.append(strip);
      shown.append(col);
    }
    el.classList.add('roll');
    el.replaceChildren(said, shown);
  });
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  els.forEach((el) => io.observe(el));
})();
```

Three or four figures at display size, never in running text, never a value that changes after load.

### Accordion

```css
.acc__panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 320ms var(--ease-out); }
.acc__panel > div { overflow: hidden; }
.acc[open] .acc__panel, .acc__item.is-open .acc__panel { grid-template-rows: 1fr; }
```

`grid-template-rows` from `0fr` to `1fr` opens to the content's real height without measuring.

### Menu or dialog

```css
.menu { transform-origin: top right; transition: opacity var(--t-ui) var(--ease-out), transform var(--t-ui) var(--ease-out); }
.menu[hidden], .menu.is-closed { opacity: 0; transform: scale(0.97) translateY(-6px); pointer-events: none; }
```

Things open from where they were triggered (`transform-origin` at the trigger). Nothing enters from
`scale(0)`; start at 0.95-0.98. A centred dialog is the one case that scales from its centre.

## 7. Signature moves

| Move | What happens | Build with |
|---|---|---|
| Masked headline | Lines rise from behind their baselines on load | Masked line reveal |
| Shutter image | The hero image opens from an edge, settling from 1.12 scale | Image shutter |
| Scaling wordmark | A giant wordmark shrinks or grows a few percent as the hero scrolls out | Scroll-linked progress on `scale` |
| Pinned story | A heading holds while its items scroll past | Pinned story |
| Index with preview | Text rows; the hovered row shows its image | Index with preview |
| Curtain footer | The last section is revealed from under the page | `position: sticky; bottom: 0` footer under a main with a background and `z-index` |
| Slow crossfade | The hero crossfades through 3-4 photographs, 5-6s each | Stacked images, opacity keyframes, paused when the tab is hidden |
| Edge-to-edge marquee | One line of very large type travels sideways, slowly | Duplicated content, `translateX(-50%)` linear loop, paused on hover and under reduced motion |
| Drag row | A horizontally scrollable row of large images with snapping | `overflow-x: auto; scroll-snap-type: x mandatory` |
| Colour by chapter | Each chapter its own full-bleed field; a fixed header takes the ink beneath | Section backgrounds in CSS; never recolour the whole page from an observer |
| Opening window | A window in a held stage opens to full-bleed | Opening window |
| Ink-fill statement | One statement fills from 45% to full ink | Ink fill |
| Sheet over a held picture | A full-bleed photograph holds; the next chapter slides over it as an opaque sheet | A 100svh sticky figure followed by a section with its own background and a higher `z-index`; no script |
| Sideways gallery | A short row moves sideways while the stage holds | Sideways gallery |
| Pushed line | A line of very large type pushed sideways by the scroll, reading whole mid-run | `animation-timeline: view()`, `translateX` 12% to -12%, linear |
| Rolling figures | The few figures that make the case roll up once | Rolling figures |
| Carried picture | The picture clicked travels into place as the next page's hero | Page to page |

Pick by subject: a portfolio wants the index with preview; a restaurant the slow crossfade; a product the
shutter on its hero object; a place with one great photograph the opening window; chapters that each own a
picture the sheet; a short set of rooms or pieces the sideways gallery; a brand whose claim is a word the
pushed line; a report or practice that leads with numbers rolling figures; a portfolio with built case
pages the carried picture.

## 8. Reduced motion and performance

- `prefers-reduced-motion: reduce` means fewer and gentler, not none: keep opacity and colour changes,
  drop travel, scale, parallax and autoplay. The reduced page is the finished page. A global `0.01ms`
  kill that destroys useful feedback is not a reduced-motion design.
- Animate `transform`, `opacity` and `clip-path`; `grid-template-rows` for accordions is the accepted
  exception. Never `width`, `height`, `top`, `left`, `margin` or `padding`.
- Set the transform on the element that moves, not on many children through one parent variable.
- `will-change` only on an element about to animate, removed after.
- Pause loops off screen and when the tab is hidden.
- No scroll hijacking and no custom cursor.

## 9. What gives generated motion away

- The same fade-up on every block; a dozen staggered hero entrances; hover lift or zoom on every card.
- Bounce or elastic easing on interface elements.
- Infinite loops that mean nothing: pulsing dots, floating shapes, shimmering text, rotating badges.
- A reveal that never fires and leaves a blank band. Look at every screenshot after the motion pass.
- **Preloaders and counters.** House: none. If a scene must load, the HTML first screen is there at once
  and the scene fades in behind it.
- **Gates** (enter, sound, age or gesture before content). House: none; sound is a control, off by
  default.
- **Scroll hijacking** and wheel-driven scenes. House: native scroll; a scene runs on a sticky stage that
  ends, with a count.
- **Smooth scroll with a long ease** that keeps sliding after the hand stops.
- **Custom cursors**, image trails, labels that exist only on hover. House: the system cursor.
- **Scramble and typewriter text.** House: real words arrive whole.
- **Long held runways.** House: about one screen per step, three per stage, a line of text on every held
  screen.
- **Content held at zero opacity:** reveals that keep text invisible, dims at 10-15%, statements left half
  pale. House: reveals only below the fold, never over 900ms in view; dims no lower than 40%; fills start
  at 45%.
- **Motion over words:** marquees crossing statements, a sliding line cropping its own words, blur left
  on text. House: nothing moves across text being read; a moving line reads whole at some point.
- **Endless loops with no off switch.** House: loops pause off screen and stop under reduced motion.
- Banned devices in motion form become plain ones: hairline progress rails become a plain count ("2 of
  4"); zero-padded counters a plain count or nothing; crossfading gradient grounds flat chapter colours
  with hard cuts; monospace HUD labels small text in the text face.

## 10. Rules for motion

1. **First frame.** The headline, sentence and picture are in the HTML and painted on the first frame;
   the load sequence starts without waiting for the load event and is settled by 1.2s, four elements at
   most.
2. **No preloader, counter, gate, custom cursor or wheel capture.** Smoothing, if any, light and off for
   touch and reduced motion.
3. **Curves.** `--ease-out` under 600ms; `--ease-expo` for reveals of 800ms or more; `--ease-in-out` for
   wipes and travel; `--ease-exit` only for things leaving for good; `linear` for scroll-linked motion and
   loops; `ease` for colour. No overshoot.
4. **Durations.** Press 140ms; hover colour 180-200ms; hover that moves 300-400ms; menus 240ms; reveals
   700-900ms; picture openings 1,100-1,300ms; exits 60-70% of the entrance.
5. **Staggers.** Lines 80-110ms; list items 50-90ms; characters 20-40ms only in a heading of one to three
   words; four steps at most in a sequence.
6. **Reveals.** Once, when the top is 85-90% down the viewport; rise 12-32px or from a line mask; nothing
   in view hidden over 900ms; nothing above the fold waits for scroll.
7. **Scroll scenes are where a page is bold;** outside them, scroll-linked travel is linear, parallax
   under 8%, scale between 0.94 and 1.15, built with scroll timelines inside `@supports`, static without.
8. **One of each:** one signature move, one moving picture, one marquee at most, a quiet section between
   two scenes.
9. **Text stays readable:** fills from 45%, dims no lower than 40%, blur at most 8px and gone once
   settled.
10. **Colour by chapter** as hard cuts; the fixed header's ink follows in 300ms.
11. **Horizontal motion:** the native drag row first; the pinned gallery only under three screens, with
    keyboard support.
12. **Page to page:** view transitions, 480ms at most, off under reduced motion.
13. **Reduced motion:** every hidden state inside `no-preference`; the reduced page is the finished page;
    loops stop.
