# Words

Copy is the first design decision. A headline that needs four lines cannot be rescued by typography, and
a page of slogans cannot be rescued by layout. Write the page as plain text before any markup. On app
screens the same honesty holds in labels, empty states and errors (words of the trade, the finding
stated, the baseline named): see [app-screens.md](app-screens.md#before-building-data-question-finding).

## Contents

1. Write the argument first
2. The two-line headline
3. Headline shapes that work
4. Supporting line, body, buttons
5. Proof without inventing it
6. Things that read as generated
7. Micro-typography

## 1. Write the argument first

Answer in one line each, in a scratch note:

- Who is reading, and what do they already know?
- What is this, said the way its maker would say it to a friend?
- What single thing should the reader believe after one screen?
- What would make them believe it (a picture of the thing, a number, a name, a demonstration)?
- What do they do next?

Then list the page as claims, one per section, each with its proof:

```
1. It is a three-legged oak stool, made to order.             -> the stool, large
2. Each seat is cut from one board, so the grain is yours.    -> three close-ups
3. It takes six weeks, and you can follow it.                 -> the stages, photographed
4. It costs 240 and is delivered by the maker.                -> price, button
```

A section with no claim is filler; delete it. The order of the argument is the order of the page, which
is how you escape hero, logos, features, testimonial, pricing, call to action.

**The first screen answers the visitor's first question in large type.** An event: what, when and where
(the dates in the headline or at the second size, never only in small text). A product: what it is and
what it costs or does. A person: who and what they do. Every section the visitor came for (the line-up,
the menu, the rooms, the price) has its own heading and its own place in the navigation.

**Write the full content.** Every section the brief asks for delivers its information completely: the
whole menu with prices, each room with its own details, every speaker and talk, the price with what it
includes, an answer to each real question. Thin sections are the commonest reason a clean page loses to
a busier one.

## 2. The two-line headline

A headline is a title, held in one glance. Gallery heroes have a median of 5 words and 32 characters,
and 70% sit on one or two lines at desktop width. Every headline, at every viewport, fits in **two lines
or fewer**. Do the arithmetic before falling for a sentence:

```
characters per line ≈ line width in px ÷ (font size in px × k)

k ≈ 0.40  condensed faces
k ≈ 0.50  most grotesks and serifs at display size, tight tracking
k ≈ 0.58  wide / extended faces, all-caps settings
```

| Where | Line width | Size | Per line | Two-line budget |
|---|---|---|---|---|
| Phone 390, 20px gutters | 350px | 44px | ~16 | **~32 characters** |
| Phone 390, 20px gutters | 350px | 34px | ~21 | ~42 characters |
| Tablet 768 | 690px | 64px | ~22 | ~44 characters |
| Desktop, 12-col measure | 1100px | 104px | ~21 | ~42 characters |
| Desktop, half width | 620px | 72px | ~17 | ~34 characters |

About 32 characters (four to six words) survives everywhere at a confident size; up to about 42 works if
the phone size drops to the mid-30s. Past that you are writing a sentence: move the rest into the
supporting line.

- Give the headline a `max-width` in `ch` and `text-wrap: balance`.
- Author the break where it matters (`Stools for<br> small kitchens`); check the phone, and hide the
  `<br>` under a breakpoint or shorten if it wraps there.
- Never fix a long headline only by shrinking it: five words at 64px beat nine at 28px.
- No orphan word on line two; rebalance by cutting a word, not nudging the width.

Section headings follow the same rule and are shorter: two to five words.

**A statement is not a headline.** An intro sentence or quotation set large is a paragraph: `<p>` or
`<blockquote>`, about 25 words, at statement size (36px or less on desktop, 32px on a tablet, 24px on a
phone), running to about three lines (four on a phone). Set larger, marked up as a heading, or placed as
the first screen's main line, it is a headline and gets two lines. Jurors read a big sentence over three
or more lines as a long headline every time, whatever its markup.

## 3. Headline shapes that work

Pick the plainest one that is true:

- **The name,** very large, with a one-line description elsewhere; strongest when short and the subject
  is visual.
- **What it is:** "A vinyl shelf in your pocket." Category, with one specific word.
- **The claim:** "Your bank won't do this." One sentence a competitor could not sign.
- **The instruction:** "Understand your money." Verb first, short.
- **The place or the moment:** "Antarctica." "Lisbon, since 1984."

Shapes that are the average of every landing page: the mad-lib ("The AI-powered platform for modern
teams"); the tricolon ("Fast. Simple. Secure."); the correction ("It's not just a tool, it's a
workflow", "More than a…"); "X, reimagined / redefined / made simple", "Welcome to…", "Meet…" for a
product nobody has met; a question the reader did not ask; a headline that needs its colon ("Ledgerly:
invoicing for freelancers"; the name is in the navigation); one word styled differently.

Sentence case. No full stop unless the voice uses them everywhere.

## 4. Supporting line, body, buttons

**Supporting line.** One sentence, at most about 22 words, directly under the headline (32-48px below)
and shown with it, never docked at the foot of the first screen or held back by an animation. It says
concretely what the thing is and who it is for (plainly, when the headline is a name or a figure of
speech), never repeats the headline in other words.

**Body.** Short paragraphs of plain statements. The specific noun and the real number ("ships in a week",
"38 seats"). If a different company could print a sentence unchanged, sharpen it or cut it.

**Buttons.** Name the action or the thing: "Book a table", "See the plans", "Download for Mac". One to
three words. The primary action keeps one name everywhere and is a real button on the first screen; one
primary per screen, a second action as a plain text link. At most one arrow, on the primary action.

**Controls and errors.** Controls name their action; errors name the problem and the recovery ("Card
declined. Try another card or call your bank."); empty states say what will appear and the first step.

**Navigation.** The wordmark, up to five plain links, one action. Link labels are single nouns.

## 5. Proof without inventing it

Never invent customers, quotes from named people, press logos, user counts, ratings or benchmarks:
invented proof is dishonest and a recognised tell. When the brief supplies none, use what is true by
construction: show the thing itself large; state how it works, specifically; use facts from the brief
(price, place, year, materials, what is included). If a testimonial or logo section is explicitly
requested and none exist, build it with plainly fictional sample content, no real companies or people,
and name it in your report for replacement.

**Sample details are expected.** Where the brief gives the shape of the content but not every detail
(six rooms "from €140", "a short menu", twelve speakers), write the full plausible set: each room with a
name, bed, view and its own rate; each dish with its price; each speaker with a talk title. A design can
only be judged at its real density. List every sample detail in your report.

## 6. Things that read as generated

- The genre's verbs and adjectives: unlock, unleash, supercharge, elevate, empower, streamline, seamless,
  effortless, robust, cutting-edge, next-generation, world-class, all-in-one, blazing fast.
- Labels pretending to be editorial: "Field notes", "The details", "Our philosophy", "Quietly trusted
  by". A section heading can simply be "Pricing".
- Furniture text: locale or time strips, "Est. 2024", coordinates, version stamps, "Scroll", "(Scroll to
  explore)", fake photo credits, "Available for work" with a dot, strings joined by middle dots or
  slashes.
- The em dash as a habit: one or two read as writing, ten as a model. Use a full stop.
- Captions that narrate the design ("A clean, minimal layout for…").
- Step labels duplicating numbers ("Step 1", "Phase 02").
- Three parallel items everywhere (three features, three stats, three steps). Use the number the content
  has.
- "Get started" and "Learn more" as labels; lorem ipsum.
- A sentence on the page about where the pictures come from or what they are not ("none of these shows
  our bar"): a caption says what the picture is; the credit sits small in the footer.

## 7. Micro-typography

- Curly quotes and apostrophes (“ ” ’), a real ellipsis (…), an en dash for ranges (9–5).
- A non-breaking space between a number and its unit, and before a headline's last short word when it
  would orphan (`&nbsp;`).
- `font-variant-numeric: tabular-nums` where numbers line up.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- No all-caps for anything over three words; caps get 0.02-0.06em tracking.
- No text under 13px on pages. No centred paragraphs over three lines. No justified text.
