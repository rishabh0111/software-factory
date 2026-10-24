# Imagery

Pictures are where generated pages most obviously give up: a grey box, an icon in a square, a fake
dashboard, an abstract blob, a gradient swatch. This file is what the pictures are, where real ones come
from, how they are cropped and placed, and what to do when there are none. It applies to Persuade and
Experience pages most; Read pages use figures where they explain; app screens show the product's own
objects (thumbnails, covers, maps) and never decoration.

## Contents

1. What the study measured
2. Decide what imagery exists
3. Real pictures from open collections
4. Generic photographs
5. Cropping and placing
6. Treatment
7. Showing software
8. Drawing the subject
9. Type and colour alone
10. Markup and credits
11. Video
12. Where pictures and footage go

## 1. What the study measured

- On 60% of studied sites one piece of media covers at least half the first screen (top-scored 68%,
  weak 48%); on half of them it covers nearly all of it.
- Only 15% of heroes have no media, and those are deliberate typographic statements.
- Media has square corners on 73% of sites (94% of all pictures in a later study); where rounded, one
  radius for every image.
- Top-scored pages carry far more imagery (a median of 37 images against 5): strong sites show, weak ones
  tell.
- Kinds: a mix 32%, photography 14%, generative or WebGL scenes 13%, real product interface 12%, 3D
  renders 11%, illustration 9%, video 6%, type only 3%.
- Legibility (text lost over a busy image) was a named weakness on 13 of the 54 weakest sites.
- In a study of 91 Sites of the Day the median page carries 7 pictures (top sites 8, lowest 2); footage
  on 42% (half of the top ones, one of the 16 lowest); 42% of scrolled screens hold no picture and 19% are
  90% picture or more; two ratios hold three quarters of a site's pictures.

## 2. Decide what imagery exists

In order of preference:

1. **The project's own images:** product shots, the place, the people, the work. Ordinary photographs of
   the real thing beat beautiful photographs of something else. Ask; look in the repository.
2. **Images you can generate** with an image tool in this session. Prompt as a photographer's brief:
   subject, angle, light, background, crop ratio, "no text". Generate the hero first and match the rest
   to its light.
3. **Real pictures of the subject's world from open collections** (section 3), whenever an honest one
   exists: it is real, carries detail no drawing in a page's budget reaches, and carries history.
   Honest means nobody could take it for the client's own product, room, dish, person or team.
4. **Pictures drawn in code from the subject itself** (section 8), for what no honest picture exists
   of. Pages that drew their subject with care beat pages that borrowed unrelated photographs, and pages
   that showed nothing, every time in testing.
5. **Generic photographs** (section 4), only where an honestly generic picture fits.
6. **Type and colour alone,** done on purpose (section 9).

When the project has footage or a real picture of its own process or product, the first screen shows it,
large (about 40% of the screen or more).

**The floor on Persuade and Experience pages:** at least four real pictures, usually six to twelve
(photographs, archival images, maps, engravings, footage, raster artwork; for software, cropped interface
fragments). SVG drawings do not count toward the floor: draw what no picture exists of, and still carry
real pictures. Add one moving picture wherever an honest clip exists. Models skip pictures because
finding them is work; the page fails without them.

## 3. Real pictures from open collections

Archives, museums and photographers publish millions of pictures usable with a credit: Openverse (one
index over Flickr, Wikimedia Commons, museums and libraries), Wikimedia Commons (archival photographs,
old maps, scans of prints and books, places as they look now), and museum open-access collections such as
the Art Institute of Chicago and the Metropolitan Museum of Art (public-domain paintings, prints,
drawings, photographs, textiles and objects). Searching them is network work done as part of a design
job; `/sf-design` carries the search procedure.

**What to search for:** the subject's inventory, not its category ("bakery" finds other people's
bakeries). Its place, in old postcards and photographs and as it looks today; its maps (the street plan,
the chart of its bay); its materials close enough to read as a surface (the quay's stone, the oak's
grain, its tiles); its trade's history (old tools, engravings, trade catalogues, patent drawings); museum
objects of its kind; scientific imagery (botanical and zoological plates, star charts, microscope
photographs, satellite views, geological sections). Search in the place's own words (azulejo, not "blue
tile"), add a medium (postcard, engraving, lithograph, aerial photograph) or a decade, and try two or
three queries per idea; museum sources match best on one or two words.

**A good find** belongs to this subject's world and would not fit the nearest competitor's page; still
reads at the crop the slot needs (open the file: a title is not a picture); is twice the width it is
shown at; belongs to one family with the others (all engravings, or all photographs of one era; a 1900
postcard beside a modern stock photo beside a botanical plate reads as a scrapbook); and has no
watermark, burned-in text, unremovable frame, or recognisable living person who could be taken for the
client's staff or customers.

**Use it creatively:** one archival photograph as the full-bleed hero (the street a century ago behind
the business that stands in it today, the year in the caption); a museum engraving enlarged until its
line becomes texture, returning at different scales as the one motif; an engraving or map on white paper
set with `mix-blend-mode: multiply` on a colour field; the real map of the street as the contact section;
a material close-up as a whole field; a run of postcards or plates as the gallery, one size, one
treatment.

**Stay honest:**

- **A found picture is never the client's own.** It may show the city, the materials, the history, the
  kind of thing it makes; never its product, room, dish, person, team or customers.
- **Caption from the source** ("Gand, unloading a steamer, 1905"); never a caption that ties it to the
  client.
- **Credit every picture.** CC BY and CC BY-SA need the title, creator, a link to the source and a link to
  the licence; public domain needs none, but give one anyway.
- **Respect the licence.** Commercial-use licences only by default (CC0, public domain, CC BY, CC BY-SA).
  CC BY-SA: an altered version is shared under the same licence. NC and ND are out for a client's site.
  Watch for personality rights, trademarks, US-only public domain, and archive statements in place of a
  licence.
- **Download, do not hotlink:** save into the project at the width it is shown (1920px typical, 1280 for
  half-screen, 3840 for a very large hero where the source has it).
- **List them in your report:** file, title, creator, licence, source page, where the credit sits.

If two or three honest queries per idea find nothing that fits, draw (section 8). Without network access,
draw and say so in your report.

## 4. Generic photographs

Real photographs of places, light, texture and weather, from a free stock library, only where an honestly
generic picture fits (the open sea for a house on the sea, fog for a quiet retreat). They never stand in
for a specific product, dish, room, person or screen: a foggy motorway on a restaurant page reads as stock
at once. Use three to six from one set so they share light; put text only in their calm area; request
twice the CSS size, capped around 2400 wide; list them in your report for replacement.

## 5. Cropping and placing

- **A small set of ratios,** for example 4:5 portraits, 16:10 landscapes, 1:1 details; two ratios for at
  least 75% of pictures. Random ratios look like a stock dump.
- **Go large.** A photograph at full width, or half the screen at full height, has presence; six small
  ones in a grid have none. If it is good, give it room; if not, cut it.
- **Crop with intent:** `object-fit: cover` with an `object-position` per image so the subject sits where
  the composition needs it.
- **Let images touch edges.** Full-bleed or bleeding off one side reads as designed; equal margins on all
  sides read as placed by default.
- **Overlap sparingly:** a headline's last line over the picture's top edge, or a small image over a large
  one by a fixed 40-80px; one overlap per screen. Nothing ever lies on top of a headline or a statement.
- **Square corners** unless the direction or the one motif says otherwise; if rounded, one radius (4px)
  for every picture and clip.
- **No frames:** no borders, shadows, device mock-ups or browser chrome around pictures.
- **Captions:** one short line in the small size and soft ink under the image, left-aligned to its edge;
  most images need none.

## 6. Treatment

One treatment for the whole page:

- **Untouched,** the default; pick images whose light already agrees.
- **Greyscale:** `filter: grayscale(1) contrast(1.05)`, for every image or none.
- **Multiply on a field:** on a light flat ground, `mix-blend-mode: multiply` makes a white studio
  background vanish.
- **Darkened for a dark page:** `filter: brightness(0.85) contrast(1.05)`.

Not treatments: colour washes, duotone overlays, blur, grain overlays, vignettes, tilted polaroid frames
with shadows, blurred copies behind a picture as a glow.

Text on a photograph gets a neutral scrim over the text area only: a solid block at 40-55% black, or a
fade from 55% black to transparent over the lower third. Never a coloured overlay.

## 7. Showing software

- Build a real fragment of the interface in HTML at its true size with believable content (real labels,
  numbers that add up, one item hovered or selected, proper alignment), cropped to the part that makes
  the point: one control, one row, one panel. Grey bars standing in for text are worse than no image.
- Put it directly on the page or one flat stage colour. No laptop; no phone frame unless the product is a
  phone app, and then a plain rounded rectangle.
- Inside a fragment, the product's own conventions apply (small radii, 1px control borders, a shadow on
  an open menu) and the app-screen rules govern ([app-screens.md](app-screens.md)). Mark its root with
  `data-ui` and scope its CSS under `[data-ui]`; `data-ui` is for cropped fragments only, never a heading
  or a whole section.
- A fragment that looks like a working product is the strongest picture a software page has.
- Real screenshots the user supplies are shown large and uncropped at least once.

## 8. Drawing the subject

When nothing real can be photographed and no honest picture exists, draw it, and draw it well, in inline
SVG and CSS. Drawings and found pictures can share a page: found ones show the world around the client,
drawings show the client's own things.

- **Draw the subject's own things,** not decoration: the stool's three legs and the grain of its seat, the
  enamel sign over the door, the hut's two windows and stove pipe, the street plan, the invoice the tool
  produces. If you cannot name what a drawing depicts in the subject's world, it is decoration.
- **One graphic language:** flat filled shapes, no outlines or one consistent stroke, one corner and curve
  vocabulary, in the palette's real colours at full strength, not greys.
- **Colour is the material:** a product sold on its finish is drawn in that finish's colours.
- **Three levels of detail:** big shapes that read at a glance, middle shapes that describe the thing
  (the handle, the window frame), small details that reward a second look (the maker's mark, the house
  number, the chipped tile). Light from flat tone steps, not gradients. A drawing that would pass as a
  placeholder icon is not finished; jurors called simple drawings "basic" every time.
- **Draw large and let it work:** the hero's dominant element, a full-width band, the footer mark; small
  doodles scattered around read as filler. The same object returns at different scales as the motif.
- **Honesty:** say plainly, small, near the first drawing or in the footer, that pictures are drawn until
  photographs exist when a visitor might take them for real products; list them in your report.
- **Not this:** gradient-shaded 3D blobs, isometric clip art, generic line illustrations of people at
  laptops, floating abstract shapes, icons in squares.

## 9. Type and colour alone

A legitimate design, not a gap to disguise: the 7 studied sites with no imagery scored a median 7.5
against 7.2 for the set. Make the typography the image (one statement at 10-14vw, a list at 5vw,
numerals at display size); use colour at scale (a full field, an inverted section, a two-field split);
use the subject's own shape as one flat CSS motif cropped by the viewport. Never add icons in squares,
abstract gradients, dot grids, wave dividers, floating shapes, emoji, generic line illustrations or an
empty box where a picture "will go".

## 10. Markup and credits

```html
<img src="assets/fig-engraving.jpg" width="1920" height="2807" fetchpriority="high" decoding="async"
     alt="Hand-coloured engraving of a fig cut open, with its flowers and seeds, in black, pink and green">
```

```html
<p class="credits">Pictures: <a href="https://commons.wikimedia.org/wiki/File:…">“Fig (Ficus carica L.)”</a>,
<a href="https://creativecommons.org/publicdomain/mark/1.0/">public domain</a>, via Wikimedia Commons.</p>
```

- Always `width` and `height` (or `aspect-ratio`) so nothing jumps while loading.
- `loading="lazy"` on everything but the hero, which gets `fetchpriority="high"`.
- `alt` says what the picture shows in plain words (rewrite an archive's title); decorative repeats get
  `alt=""`.
- A `background-color` (ground or surface) on the container so the layout is whole before the image
  arrives.
- The credit line is part of the footer's design, at full contrast, with its links, at body size (one
  step smaller only on a page with plenty of running text); one line for all pictures; no credits laid
  over pictures; only pictures the page still uses.
- A broken image is a failure; check every picture in the screenshots.

## 11. Video

A moving picture of the subject's world can carry a section the way a photograph does: the river at the
end of the street, the roaster's drum turning, a timber frame going up. Open sources: Wikimedia Commons
(web-sized transcodes, the best for short clips), the Internet Archive's Prelinger Archives (industrial,
educational, city and home films, 1920s-1970s, mostly public domain and long), NASA (Earth from orbit,
launches, laboratories). The rest of the Internet Archive is out: anyone uploads, licences unchecked.

**Choosing a clip:** short (5-20s that loop without a visible jump: water, smoke, a turning drum,
traffic, leaves, a distant crowd; watch it to the end); light (under about 5MB for a section, 10MB for a
hero; 720p is plenty behind type; trim long archive films, or choose another); clean (no slate, title
card, logo, watermark, burned-in caption, or recognisable person who could pass for the client's
people); never the client's own (a found clip of a roastery is not this roastery). Found clips: one per
page, two at most; the project's own footage can carry more. One moving picture per screen.

**On the page:**

```html
<video autoplay muted loop playsinline preload="metadata" poster="assets/river-poster.jpg"
       width="854" height="480" aria-hidden="true"><source src="assets/river.webm" type="video/webm"></video>
```

- No sound and no controls on a decorative loop; `aria-hidden` because whatever matters is in the text
  beside it.
- **A poster is required** and works as a picture on its own (only 31% of studied clips had one; the
  blank boxes before playback read as faults). If the source still is a slate or a blur, take a frame.
- Play only in view, and not under reduced motion, where the poster shows:

```html
<script>
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const clips = [...document.querySelectorAll('video[autoplay]')];
  const inView = new Set();
  const sync = (v) => { if (calm.matches) return; if (inView.has(v)) v.play().catch(() => {}); else v.pause(); };
  const settle = () => {
    for (const v of clips) {
      if (calm.matches) { v.removeAttribute('autoplay'); v.pause(); v.load(); }
      else if (inView.has(v)) v.play().catch(() => {});
    }
  };
  const watch = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target); sync(e.target); }
  }, { threshold: 0.2 });
  clips.forEach((v) => watch.observe(v));
  settle();
  calm.addEventListener('change', settle);
</script>
```

- Crop and place like a photograph: `object-fit: cover`, one ratio, square corners, no frame, a ground
  `background-color` while loading.
- **Never under body text.** On a clip: one headline, one line, one action at most, with contrast checked
  where they sit across the whole loop (4.5:1, or 3:1 for 24px and up); if any frame fails, use the scrim
  or move the text off.
- It is motion: the page's one moving thing, or in a section where nothing else moves.
- Credit it with the pictures ("Pictures and footage:"), with each clip's length in your report.
- Nothing that matters plays on hover only; a full film with sound sits behind a play button opening a
  player with controls.

## 12. Where pictures and footage go

Measured on 100 recent Sites of the Day at 1440x900 and 390x844 (91 usable). Scores sit close together
(6.7-7.9) with about half a point of noise per score, so read the links as leanings.

### How much of each screen is picture

- **All or nothing.** The median scrolled screen is 16% picture, but 42% hold none and 19% are 90% or
  more; only 19% fall between 20% and 60%. A picture leads its screen or stays out of it.
- **About a third, with rests.** On sites that put pictures in the page the average screen is 36% picture;
  top sites sit at 30% and leave 28% of screens with none: screens of type are the rests.
- **The first screen:** a picture covers at least half on 41% of sites, nearly all on 32%; a full-bleed
  photograph or film is the whole first screen on 29%.
- **A scene is not a picture.** The lowest-scored sites often draw everything in a WebGL canvas and put
  two pictures at most in the page.
- **Text is small in area:** the median screen is 8% text, set large and sparse around the pictures.
- **Off-centre:** pictures sit left or right 939 times, centred 273, full-bleed or behind text 269.
- **The phone carries more picture:** 27% of the first phone screen against 17% on desktop; full-bleed
  pictures re-crop to portrait; splits put the picture first at full width.

### The placements, ranked

| Placement | Sites (of 91) | Top (of 36) | Lowest (of 16) | Mean score with / without |
|---|---|---|---|---|
| Split: picture in a half or two-thirds | 32 | 17 | 2 | 7.50 / 7.38 |
| Horizontal gallery | 32 | 13 | 4 | 7.44 / 7.41 |
| Full-bleed band between sections | 31 | 14 | 3 | 7.48 / 7.40 |
| Full-bleed picture or film as the first screen | 26 | 10 | 3 | 7.45 / 7.41 |
| Uneven mosaic | 25 | 11 | 1 | 7.49 / 7.40 |
| Picture held while text scrolls | 23 | 12 | 1 | 7.52 / 7.39 |
| Footage behind text | 22 | 8 | 2 | 7.46 / 7.41 |
| Even grid | 20 | 11 | 2 | 7.48 / 7.41 |
| Scattered collage | 19 | 6 | 3 | 7.47 / 7.41 |
| Panel sliding over a held picture | 19 | 8 | 2 | 7.48 / 7.41 |
| Inset frame that grows | 17 | 7 | 1 | 7.52 / 7.40 |
| One picture centred on a field | 14 | 5 | 3 | 7.38 / 7.43 |
| Cut-out object on a flat field | 13 | 7 | 1 | 7.57 / 7.40 |
| Index with hover preview | 12 | 6 | 1 | 7.49 / 7.41 |
| 3D gallery | 12 | 4 | 4 | 7.30 / 7.44 |
| Small card docked in a corner | 11 | 5 | 1 | 7.47 / 7.42 |
| Picture inside or in front of display type | 11 | 7 | 1 | 7.50 / 7.41 |
| One small picture beside a statement | 8 | 5 | 0 | 7.56 / 7.41 |
| Small pictures between words | 6 | 4 | 0 | 7.52 / 7.42 |

Over-represented on top pages and almost absent on the lowest: the split, the held picture, the uneven
mosaic, the inset frame that grows, the cut-out on a flat field, and pictures set with the type. The
horizontal gallery is common everywhere and lifts nothing; use it where browsing is the point. The 3D
gallery goes with lower scores and the lowest usability (5.9 against 6.35): do not build one; show the
pictures as an index with previews or a horizontal gallery. Sites using three or more placements average
about 7.5, two or fewer 7.31.

### Each placement

- **Split.** A claim and the picture that proves it. The picture takes 42% of the width at the median (up
  to two-thirds) at the section's full height (680x850, 720x900); 38% portrait (4:5, 3:4). Text starts on
  the 50% line or where the picture ends, top-aligned or docked low. Let the picture touch the viewport on
  its outer side. Alternate sides only across three or more rows. *Phone:* picture first at full width.
  *Fails:* the same split three sections running; a picture floating in its half; a text column under
  about 30 characters.
- **Full-bleed band.** One picture carries a screen between type screens, one every three or four screens.
  100% wide, 100-150vh tall (ratios 1.4-1.9), oversized 4-10% for a slow parallax and moving no further.
  Text: a headline and one line, or nothing, docked 32-64px from a corner over the calm part. *Phone:* a
  portrait re-crop with `object-position` on the subject, text in the bottom quarter. *Fails:* small
  white text over a bright area; three bands in a row; a band that only decorates.
- **Picture held while text scrolls.** A list, steps or long paragraph belonging to one picture. A 100vh
  sticky stage in a section two to six screens long; the picture holds a half, two-thirds or the whole
  screen with text passing on a solid panel; rows about 150px apart. *Phone:* release the stick, or keep a
  band in the top 40% if the picture swaps. *Fails:* long runways where the text has faded and only the
  picture is left; body copy on the held picture.
- **Inset frame that grows.** Once per page, for the film or picture the page is about. Starts centred at
  35-50% of the width (or a 16px inset round a full screen) and grows to full over 720-2,700px of scroll;
  any radius goes to 0 at the edges; nothing else moves on that screen. *Phone:* start at full width in
  the margins, or skip the growth. *Fails:* the growth alone for three scrolls; a spinner or blank first
  frame; used twice.
- **Uneven mosaic.** A body of work or one place seen several ways, five to twelve pictures: two columns,
  or rows of three on a 24-column grid; two or three widths (32%, 48%, 65%); neighbours offset 120-190px;
  one or two ratios; a caption under each in the text face at body size, unnumbered. *Phone:* one column
  alternating full and about 70% width. *Fails:* random ratios with random offsets; mono captions with
  index numbers.
- **Horizontal gallery.** A set people browse in any order. Cards 25-35% wide (three in full and a fourth
  cut by the edge), or a strip at one height with mixed widths, or a slider whose centre slide is about
  73% wide. A marquee of pictures moves slowly (60-120s per loop). *Phone:* one card at 75-80% with the
  next showing; swipe. *Fails:* arrows with no drag or swipe; a marquee of things people need to read; a
  carousel holding the page's one important picture.
- **Panel sliding over a held picture.** A change of chapter: the picture sticky at 100vh, the next
  section's ground sliding over at full width as a solid panel with square corners (its top edge straight
  or shaped from the subject). *Fails:* decks whose earlier cards linger as slivers.
- **Even grid.** Archives only (a shop range, the team, a menu, the full list of work): two to four
  across, equal cells, 8-16px gaps, one ratio (4:5 commonest), the label under the picture, never on a
  dark gradient at its foot. *Phone:* two across for products, one for work and people. *Fails:* three
  equal cards as "features".
- **Index with hover preview.** Eight or more projects or clients where names matter: rows on a 45-80px
  pitch, names at 30-60px, one picture at a time at a fixed place, swapped within 0.3s, the names in front
  of it; or a no-mouse version where names scroll across a fixed central picture. Rows separated by
  space, the active row by ink or a ground change, never hairlines. *Phone:* a 100px thumbnail per row.
  *Fails:* pictures that never appear on touch.
- **One picture on a field, or one small picture beside a statement.** A pause: a single 3:4 picture at
  75% of the viewport height on a ground taken from it; or a small picture 7-26% of the width beside or
  between the lines of a 48-136px statement, aligned to a line. *Fails:* used as the default for every
  picture.
- **Small pictures between words.** A statement about the things themselves, on its own screen: two to
  four chips from the cap height to three-quarters of the type size tall, one to one and a half times as
  wide, from one shoot, square, with width and height set. *Fails:* more than four; mixed shoots; a chip
  carrying information the words do not.
- **Picture inside or behind display type.** The object is the subject: a picture window inside
  150-200px type that later opens into the next screen, or the object behind the type showing between the
  letters, or touching the word's edge. The type stays in front. *Phone:* type at about 15vw, still
  readable. *Fails:* an object over the letters.
- **Cut-out object on a flat field.** Products and objects; the highest mean score. The object at 35-60%
  of the width on a ground from its own colours, standing on the bottom edge or running off one side,
  type behind or beside it. *Phone:* 80-90% under the headline. *Fails:* a render floating in a void; an
  added drop shadow (keep a contact shadow only if it was photographed).
- **Scattered collage.** Archives, ephemera, a festival of small things, sparingly: six to sixteen
  pictures of 100-300px around a centred heading, never over it. *Fails:* tilted prints and stickers with
  offset shadows; pictures crossing text.
- **Small card docked in a corner.** A standing pointer to the reel or the next thing, about 216x144 to
  240x140, 30-43px from the corner, one per page. *Phone:* drop it or move it into the flow. *Fails:*
  content scrolling under it; a second one.

### Footage

- Footage is on 42% of sites; a site with footage carries a median of three or four clips. Clips are
  short (median 10s; 88% at 20s or less), muted, looping, inline, without controls.
- Sources 1920x1080 (commonest) or 1280x720, tall 450x800 or 540x960 for phones. On the page: 16:9 41%,
  portrait 25%, square 19%; square corners on 75%; `object-fit: cover` on 84%.
- **Where it goes:** a full-bleed hero background (oversized 1-25% so a drift never shows an edge; one
  slow take, or a montage cutting every second or two); inline as a picture at about a third of the width
  (slow near-still subjects read as living photographs); the frame that grows; one small docked card.
  Full films sit behind a play button; sound behind a toggle, never on start.
- **Text on footage:** the name or a headline at 47-136px and one short line, docked bottom-left or
  centred, over footage graded dark where the type sits, dimmed under a 30-40% layer, or on a solid card.
  Body text at 11-14px on footage was a named fault, on top sites too.
- **Phone:** a full-screen portrait re-crop; inset frames go full-bleed; a 40% scrim where the type
  covers more of the picture.

### Crops and treatment

Of 1,356 pictures and clips: 4:5 21%, 16:9 19%, 1:1 16%, 16:10 10%, 3:2 7%, other ratios the rest;
landscape 52%, portrait 33%, square 15%. On sites with four pictures or more, two ratios hold 76%.
Square corners on 94%; where rounded, 5px or less on two-thirds of them, one value per site. Cover on
78%. Filters touch pictures on only 9 sites; several keep the interface black, white and grey and let
photographs carry the colour. A page-wide grain layer, duotones, glow copies and tilted prints are common
in the gallery and not treatments here. Oversize a moving picture only by the distance it moves. Serve
pictures at twice their CSS width, capped around 2,400px (17% of studied pictures were served smaller than
shown).

### Text over pictures

Text sits on pictures often and is checked rarely: 16 studied sites lost text over pictures (8-14px
labels and body over photographs, navigation with no backing). Where it works, the text is display size
over the calm part (sky, a dark wall, the shadow side), docked in a corner or along one edge; or on a
solid card in the ground colour; or on the white of a picture that fades into the page. Put only display
text, one short line and one action on a picture; body text, captions and labels go beside or under it.
Measure contrast at the text's position (4.5:1, or 3:1 for 24px and up); if it fails, move the text,
use a solid card, or the scrim.

### Rules

1. About a third of the page is picture (30-40% of the scrolled area), and at least one screen in four
   carries none.
2. A picture leads its screen (60% or more of it) or stays an accent (under 10%); avoid screen after
   screen at 20-40%.
3. Three to five placements per page; no two neighbouring sections with the same one.
4. Six to twelve pictures, never fewer than four.
5. Two ratios for at least 75% of pictures; defaults 4:5 portrait, 16:9 or 3:2 landscape.
6. Square corners on every picture; if rounded, one 4px radius for all.
7. Split pictures take 42-50% of the width, or two-thirds, at full section height, touching the viewport
   on their outer side; text starts on the 50% line; on the phone the picture goes first.
8. Full-bleed bands 100% wide and 100-150vh tall, one every three or four screens, oversized 10% at most,
   text only in one corner at least 32px in.
9. One inset frame that grows per page, from 35-50% to full screen over 720-2,700px, nothing else moving.
10. Horizontal galleries show three cards and a cut fourth (25-35% wide, 16-20px gaps); on a phone one at
    75-80% with the next showing.
11. One moving picture per screen: clips of 5-15s, muted, looped, inline, with a poster, paused out of
    view; a hero source of 1920x1080 under 10MB, inline clips at 1280x720 under 5MB.
12. Only display text on a picture, with contrast measured at its position across the whole loop; body
    text (16px or more) beside or under it.
