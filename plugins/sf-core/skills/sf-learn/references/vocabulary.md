# Glossary vocabulary

The glossary (see [SKILL.md](../SKILL.md)) defines the words that mean something specific in this codebase: the shared base lessons and `AGENTS.md` cite without redefining terms. The rules below decide which terms a run writes and what it may change; the entry shape is [GLOSSARY-FORMAT.md](../../sf-glossary/GLOSSARY-FORMAT.md)'s. Read this file unconditionally at the vocabulary step: its criteria are non-obvious, and "nothing qualifies" reached without reading it is a shortcut, not a result.

## Mutations

A run may **add** an entry, **refine** one, **fold** one into the entry that already carries its meaning, **retire** one to `## Retired`, **delete** one, or **scrub** violations from one it touched. Each run section below states its subset. **Update-only** withholds creation and seeding; it never widens a run's subset.

Every run applies its edits silently, in every mode: vocabulary is a side effect of the run, not a per-run decision for the user. The report's `Glossary:` line records what happened. "scanned, no qualifying terms" is correct only when the file is byte-for-byte as the run found it; any change at all reports its counts, whichever step made it.

## How terms enter

- **Accretion**: a lesson brings up a term whose meaning was not obvious, so it gets defined. This catches *peripheral* terms, because friction is what brings them up.
- **Seeding**: a run defines the **core domain nouns** of the area it works in. This catches the *stable-central* terms accretion never reaches: the nouns a system is built around rarely break, so they rarely appear in a lesson, yet a reader needs them to orient. Without seeding the file fills with peripheral mechanics and never names what the project is about.

**Seed goal.** Define the core domain nouns the area's **declared domain model** (schema, core types, primary models, top-level domain docs; not a full-codebase trawl) exposes that meet the bar below. The codebase sets the count: every term that qualifies, none added to reach a number.

**Scope of a seed.** A scoped run (a capture, or a refresh narrowed to an area) seeds only that area's core nouns, and only terms it investigated against code. A **repo-wide bootstrap** (an explicit "create the glossary" request) seeds the whole project's declared domain model; it is the only path to a coherent "what is this project" glossary.

## What earns a slot, and what keeps one

A term qualifies on two counts: its meaning here is precise enough that a new engineer would need it defined to follow conversations, tickets or code, and it is a concept in its own right rather than a property of one already defined. General programming vocabulary (caches, queues, jobs, sessions) and everyday domain English never qualify, however heavily used. Both counts apply when admitting a term and when deciding whether an entry keeps its heading.

An entry that loses its heading still has to resolve for whoever meets the term next in an old ticket, lesson or commit. **Fold** it into the surviving entry that can carry it (the neighbour whose property it always was, or the concept that replaced it): the meaning moves there, cross-references repoint, and the old term is named on that entry, worded so a reader can tell whether it meant this entry or was replaced by it. When nothing can carry it, **retire** it to `## Retired` if readers will still meet it in the project's own material, and **delete** it if they will not. Version history is the archive.

Remove an entry only on positive contrary evidence, and name where the concept went (what replaced it, absorbed it, or took it out). A deleted class, path or symbol is never that evidence: an entry is meant to outlive the code that implemented it. Neither is a missing corroboration. Uncertainty leaves the entry standing.

## Be opinionated

When the team uses several words for one concept, pick the best and drop the rest. A dropped synonym is not a retirement: the surviving entry carries the meaning, so the word goes on its `_Avoid_:` line, never to `## Retired`, which is only for a concept the project no longer has. The glossary is the team's agreed vocabulary, not a record of every word used.

## The file stands on its own

Each entry teaches its concept to a reader with no codebase, no PR history, no meetings, no chat. Scrub from every entry:

- implementation specifics: file paths, class names, function signatures, table names, library calls;
- status fields, dates, owners;
- current-config values that will change, such as thresholds, counts or enum values. State the behaviour, not the number: "each skill sets its own actionable threshold", not "surfaces at 50, fixes at 75";
- links to PRs, issues, channels or roadmap milestones;
- version-specific claims ("currently uses X; migrating to Y").

Cross-references between entries resolve internally and are fine. An entry that leans on another *project-specific* term needs that term defined too: an undefined project-specific sibling is itself a candidate to add.

## Entry shape and the tail sections

Each entry, cluster and relationship follows GLOSSARY-FORMAT.md: the term, a tight definition of what it is, and an `_Avoid_:` line for dropped synonyms. A term with non-obvious behavioural rules (lifecycle, cancellation semantics, ownership invariants) earns one more sentence for them.

- **Flagged ambiguities**: when two terms were used interchangeably and the team settled a distinction, one line: *"'account' had been used for both Customer and User — these are distinct."* The audit trail of opinions the team formed.
- **Retired** (present only when it has entries): one line per concept the project no longer has and nothing replaced: what the term meant and what removed it, enough for someone meeting it in an old ticket. The original entry is not carried over.

## The coherence neighbourhood

An entry's neighbourhood is its cluster siblings plus the terms it cross-references or that reference it. It bounds a capture-time pass: act only on evidence already in hand, never audit the whole file, and flag for refresh anything whose judgment needs investigation this run did not do.

## Capture

Mutations: add, refine, fold, scrub. Retiring and deleting belong to refresh, which investigates.

1. Scan the new lesson **and** the surrounding conversation for qualifying terms: they often live in the conversation, not the lesson.
2. Before writing an entry that asserts behaviour (states, transitions, limits, semantics), read the defining source in the current tree. An entry drafted from a session summary is how wrong semantics enter the glossary.
3. **Glossary absent** and at least one term qualifies: create it as GLOSSARY-FORMAT.md lays out (the context name as `#` heading, one or two sentences on what the context covers, entries under `## Language`), and seed the lesson's area alongside the term, so the new term does not dangle among undefined siblings. At creation, clear core nouns go in and borderline terms (or a class, table or file name dressed as an entity) wait for a later run.
4. **Refresh the neighbourhood** of the area the lesson touched, whether or not this run added anything: fix violations of "stands on its own", refresh entries the lesson's own evidence shows have drifted, and fold an entry whose whole meaning a neighbour already carries, repointing its cross-references. The test: every entry in the neighbourhood still holds a heading a reader needs and reads consistently with this lesson's terms.

**Lightweight capture is update-only**: with a glossary present it runs steps 1, 2 and 4; with none it creates nothing and leaves seeding to a Full run.

## Refresh

Mutations: all six. Runs after the per-lesson actions, over the terms investigation flagged.

1. **Aggregate** qualifying terms across the lessons in scope; one term seen at different shades of precision becomes one entry holding the union.
2. **Glossary present**: add missing terms, refine entries where the lessons surfaced new precision, then reconcile every entry the run's scope reaches against **What earns a slot**: backfill central-but-missing core nouns, and route each entry that fails the bar to fold, retire or delete as that section says. Retention reads the same declared domain model seeding reads, so presence and absence are judged against one source. An unscoped refresh reconciles the whole file (the pass an accreted glossary needs); a scoped one stays in its area.
3. **Glossary absent** and at least one term qualifies: bootstrap it with the in-scope area's core nouns plus the surfaced terms, holding the bar conservatively for borderline terms. 1-4 terms: a flat list; more: cluster by domain relationship.
4. **Scrub** "stands on its own" violations, duplicates and undefined project-specific siblings in the entries step 2 reconciled: the whole file on an unscoped run, the area's entries on a scoped one.
5. Stay within the run's scope, and add no `(see the glossary)` pointers to lessons.

**Repo-wide bootstrap** (refresh's glossary-only job): seed the whole declared domain model, clustered by domain relationship, in the GLOSSARY-FORMAT.md layout.
