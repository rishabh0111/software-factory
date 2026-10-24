# Typeset: hierarchy, reading and voice in type

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** nothing beyond the shared preamble; the faces in use are the evidence.

Typography carries information, hierarchy and voice. The move improves it inside
the established world: confirmed families stay and their use improves. It is the
wrong move when the change would replace the type identity (`/sf-design direction`,
which updates DESIGN.md).

By mode ([modes](../../sf-frontend-ui/SKILL.md#modes)):
- **Persuade, Experience**: display type may carry the voice, with decisive
  contrast and scale that responds to space.
- **Operate, Read**: stability, scanability and measure first; one well-tuned
  family and a fixed role scale are often right.
- **Native**: [ios.md](../../sf-frontend-ui/references/ios.md) and
  [android.md](../../sf-frontend-ui/references/android.md), including platform text
  scaling.

Craft depth: the floor's type line
([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)) and
[type.md](../../sf-frontend-ui/references/type.md) (sizes, measure, tracking, pairing,
loading).

## 1. Two isolated assessments

Run the design assessment before you see any mechanical findings, so they do not
anchor it. With a subagent tool, dispatch a general-purpose subagent for the scan
while you assess; otherwise assess first, then scan.

**Typographic assessment.** On representative pages and styles, answer each with a
file, selector or computed value:

- **Authority and fit**: which faces, weights and roles are established; whether
  they fit the product and world or are unexamined defaults; whether every family
  is needed.
- **Hierarchy**: whether heading, body, label, metadata and data roles are told
  apart at a glance, or adjacent sizes and weights are too close to carry
  different jobs.
- **Scale and consistency**: a deliberate role scale, or arbitrary values; repeated
  roles identical across screens and states.
- **Reading**: body measure, line height, paragraph rhythm, contrast and tracking
  tuned to the face, width, language and surface.
- **Stress**: long headings, localisation expansion, zoom, narrow containers,
  missing weights, fallback fonts.
- **Delivery**: only used assets loaded; fallback metrics, loading strategy and
  variable-font settings that avoid invisible text and disruptive reflow.

**Mechanical scan.** If the design-check CLI is present, run its
`detect --json --scope type` over the target files or directories. Otherwise write
a small script in the scratch area that lists every distinct `font-family`,
`font-size`, `font-weight`, `line-height` and `letter-spacing` value in the target's
styles with its file and line, and read the computed styles of each role on the
render (the browser's style inspection per [browser.md](../browser.md)). Either
way, also read dynamic or arbitrary font values a scan cannot interpret.

Synthesise both before editing, noting what each caught alone. A clean scan is a
floor, not proof of good typography. Done when every assessment question has
evidence and the scan's findings are listed.

## 2. Set the system

State the roles the interface needs, the contrast between them, the reading
measure and density, the authoritative faces and weights, and the performance,
localisation and accessibility constraints. Use the fewest roles and families that
make the hierarchy unmistakable; size, weight, space and tone work together.
Role names and tokens describe purpose, not values. A second family enters only
for a role it alone can perform. Done when the role list is written.

## 3. Apply

- Body copy stays readable and zoomable at the floor's sizes and measure; line
  height rises as the measure widens, tuned to face, width, language and contrast.
- Light text on dark grounds gets slightly more line height, a touch more
  tracking, and one weight step more when the face needs it.
- Repeated roles stay identical across screens and states.
- Numeric, tabular, code and label features where their content benefits.
- Only used font files and weights load, with metric-compatible fallbacks and
  non-blocking text.
- Marketing display type may respond to space; dense product and reading surfaces
  stay spatially predictable.
- Browser zoom, user font settings, Dynamic Type and platform scaling stay intact.
- Paragraphs are marked by spacing or a first-line indent, one of the two.
- Comprehension comes before decoration in every choice.

### Line breaks

After Butterick's *Practical Typography*, paraphrased; where his numbers differ
from these, these stand.

- `text-wrap: balance` on headings and short centred blocks, `text-wrap: pretty`
  on body. Both are progressive.
- `pretty` pulls a word down beside a lone last word; a two-word tail is fine.
- In a column too narrow for either to help, edit the copy or widen the column.
- Break a heading by hand only between phrases, and check the break at every width
  it renders at; a hard break landing mid-line on a phone is worse than the default.
- An uneven break can carry meaning (one word for weight, a poster line, a pull
  quote): make it deliberate with a hard break or a wrap rule on that element and
  keep it rare. Detector findings about stragglers and unbalanced headings are
  advisory for this reason; say which breaks are intended.

Done when every role in step 2 is applied in code.

## Done when

Answer each with rendered or source evidence, then rerun the scan:

- Primary, secondary, body and metadata roles are recognisable without reading.
- Long text stays comfortable across the relevant widths and languages.
- The type belongs to this product and its world.
- Loading causes no disruptive reflow or invisible text.
- Zoom, text scaling, focus, contrast and narrow viewports stay usable.
- The final scan has no unexplained findings.

## Variant parameter (shotgun live variants)

When shotgun mode's live browser variants run this move, every variant declares a
coarse `scale` parameter and authors its type ramp against `var(--p-scale, 1)`:

```json
{"id":"scale","kind":"range","min":0.85,"max":1.3,"step":0.05,"default":1,"label":"Scale"}
```

At most one more pairing or weight parameter, when it is a real system choice. The
parameter contract is in [shotgun.md](../shotgun.md).
