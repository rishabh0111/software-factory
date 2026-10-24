# Docs layout

`docs/agents/domain.md` tells every skill where the domain glossary and the decision records (ADRs) live and how to use them. Two layouts:

- **Single-context** (almost every repository): one `GLOSSARY.md` at the root, ADRs in `docs/adr/`.
- **Multi-context** (a monorepo with separate domains): a root `GLOSSARY-MAP.md` listing each context and its own `GLOSSARY.md`, system-wide ADRs in `docs/adr/`, and context ADRs in `<context path>/docs/adr/`.

When the survey found an existing glossary or ADR folder, record its actual path in place of the defaults.

## Template for `docs/agents/domain.md`

```markdown
# Domain docs

Layout: <single-context | multi-context>.

## Read before exploring

- The glossary: `<path to GLOSSARY.md>`, or `GLOSSARY-MAP.md` at the root, which points to one glossary per context; read the ones the topic touches.
- The ADRs in `<ADR folder>` that touch the area you are about to change. In a multi-context repository, also the context's own `docs/adr/`.

A file that does not exist yet is normal: carry on without it. The `sf-glossary` skill creates the glossary and the first ADR when a term or decision is settled.

## Speak the glossary's language

When your output names a domain concept (an issue title, a test name, a refactor proposal), use the glossary's term, and none of the words it lists to avoid. A concept the glossary lacks is a finding: either the project does not use that idea, or the glossary has a gap worth noting for the `sf-glossary` skill.

## Surface ADR conflicts

When your output contradicts an ADR, say so openly and give the reason to reopen it, for example: _Contradicts ADR-0007 (event-sourced orders), worth reopening because..._

## Layout

<the tree for this repository, single-context or multi-context, with real paths>
```

## Stubs

Create stubs only for the files the user agreed to. Each one is empty of content but valid for the `sf-glossary` skill:

- `GLOSSARY.md`:

  ```markdown
  # <Project or context name>

  <One sentence on what this context covers.>

  ## Language
  ```

- `GLOSSARY-MAP.md` (multi-context only): a `# Glossary map` heading, a `## Contexts` list with one line per context linking its `GLOSSARY.md`, and an empty `## Relationships` heading. Create each linked `GLOSSARY.md` stub too.
- ADR folder: create the folder with a `.gitkeep`. The first ADR is `0001-<slug>.md`, written by the `sf-glossary` skill when a decision is made.

An existing file is never overwritten by a stub.

## Template for `docs/agents/work-docs.md`

The defaults and the lookup rule live in [work-docs.md](../../references/work-docs.md); this file records this repository's answer.

```markdown
# Work docs

Where this repository keeps its work documents. A skill looking for prior work searches every folder below.

| Kind | Folder |
|---|---|
| Specs | `<docs/specs/ or the existing folder>` |
| Designs | `<docs/designs/ or the existing folder>` |
| Plans | `<docs/plans/ or the existing folder>` |
| Lessons | `<docs/solutions/ or the existing folder>` |
| Codebase map | `<docs/codebase/ or the existing folder>` |
```

Create no folder ahead of time: the skill that writes the first document of a kind creates its folder.
