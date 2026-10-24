# Clarify: interface text people understand

A move of [refine mode](../refine.md). The shared preamble, verification rules and
next steps are there.

**Needs:** the audience's knowledge and emotional state at this point in the flow.

Rewrite unclear interface text so users understand what happened, what matters and
what to do next, keeping factual meaning, product terminology and brand voice. It
is the wrong move when the state the text describes does not exist yet (harden
builds it) or when the screen has too much text because it has too much of
everything (distill).

Craft depth: [copy.md](../../sf-frontend-ui/references/copy.md) and the floor's copy
line ([quality floor](../../sf-frontend-ui/SKILL.md#quality-floor)).

## 1. Audit the language

Read the whole interaction path, not isolated strings. Mark: ambiguous nouns, verbs
and actions; internal jargon or assumed knowledge; vague labels, outcomes and
states; missing consequences, recovery or timing; inconsistent terms and
capitalisation; redundant headings, intros, helper text and confirmations; text
that breaks at real widths or in translation; tone that ignores stress, risk,
success or urgency. Infer audience and task from the product and surrounding UI.
Ask before changing factual claims, legal meaning, or a term that may be the
domain's own. Done when every marked string has its problem named.

## 2. Set the message hierarchy

For each state decide: the one fact the user needs now; the action available
next; the context that changes the decision; the tone for this moment. Say each
idea once: when the heading explains the state, the intro adds something new or
goes. Done when each state has its four answers.

## 3. Rewrite by function

- **Actions and navigation.** A specific verb and object when the outcome is not
  obvious; labels describe what happens, not the gesture. One noun and verb per
  concept across the product. Destructive actions name the object and the
  consequence; prefer undo over confirmation when recovery is safe; a necessary
  confirmation names the action on the message and on the button, never `Yes`,
  `No`, `OK` or `Submit`.
- **Forms.** Persistent labels; placeholders are examples. Format and eligibility
  requirements before submission; why information is asked only when not obvious;
  required and optional marked consistently. Validation says what needs attention
  and how to fix it, without blame, near the field, announced accessibly.
- **Errors and permissions.** Say what failed, why when known and useful, and how
  to recover or what alternative remains. Internal codes stay secondary; promise no
  cause or fix the system cannot know. Privacy, payment, deletion, lost access and
  blocked work get warmth and no jokes.
- **Loading, empty, success.** Loading names the real operation and sets an honest
  expectation when the wait matters; determinate progress when available, never
  invented. Empty states tell first use, no results, filters, permissions and
  failure apart, each with the next useful action. Success confirms the outcome and
  mentions the next consequence only when it changes what the user does; routine
  success is brief.
- **Help and instructions.** Helper text answers an implicit question rather than
  restating the control; uncommon detail behind progressive disclosure. Link text
  makes sense out of context; icon-only controls have accessible names.

Done when every string from step 1 is rewritten or deliberately kept.

## 4. Voice, accessibility, localisation

Voice stays consistent while tone fits the moment; plain language that keeps the
terms the audience genuinely knows.

- Complete translatable messages, never concatenated fragments.
- Variables and numbers structured so translators can reorder them.
- Room for expansion instead of early abbreviation.
- Alt text that carries the image's information; empty alt for decoration.
- Screen-reader names that match visible labels and outcomes.
- The message carried by words, with punctuation, colour and icons as support.

When inconsistency spans the product, keep a short terminology glossary; one word
per concept, never varied for literary effect.

## Done when

Read the flow in context and confirm:

- It is understood without hidden product knowledge.
- Errors, empty states and decision points are actionable.
- Facts are accurate and terminology consistent.
- It scans at target widths and at 200% zoom.
- Long names, localisation expansion, plurals and dynamic values fit.
- Accessible names and announced state changes are right.
- Tone fits consequence and emotional context.
- Each string is as short as it can be while keeping meaning and recovery.
