# Lesson format

What a lesson file looks like. [schema.yaml](schema.yaml) is the contract for every frontmatter field, enum value and suggested default; this file holds the rules for choosing values, the folder layout, YAML safety and the body templates. Capture writes to it, refresh checks against it, and both paste it with the schema into any subagent that writes a lesson.

## Lookup keys

`sf-plan` and `sf-debug` find lessons by searching frontmatter before they read bodies, so the frontmatter is written for that search:

- `title`: the problem (bug track) or the guidance (knowledge track) in one line, in the words someone hitting it would search for. "Webhook retries double-charge after timeout", not "Payments fix".
- `tags`: 1-8 lowercase, hyphenated keywords: the module, technology, error and concept words.
- `module` and `component`: the area, in the corpus's spelling.
- `symptoms` (bug track): the observable errors and behaviour, with exact error text where there is one.
- `applies_when` (knowledge track): the situations the guidance governs.

## Tracks

`problem_type` sets the track. **Bug** (a defect diagnosed and fixed) requires `symptoms`, `root_cause` and `resolution_type`. **Knowledge** (a practice, pattern, convention, decision or workflow improvement) requires nothing beyond the shared fields and carries `applies_when`; it takes the bug fields only when they genuinely apply. Prefer the narrowest knowledge value; `best_practice` is the fallback. The schema lists which `problem_type` values belong to each track.

Optional fields worth knowing: `framework_version` (bug track only, e.g. `rails 7.1.2`), `related_components`, and `retire_when`: the change outside the repo that would retire the lesson and how refresh can check for it without changing the repo, set only when the guidance holds just while something external holds (an open upstream bug, a tool or platform version, a dependency's behaviour). A verification that needs a repo change belongs in the body as the step before removal.

## Corpus-first vocabulary

`component` and `root_cause` are open vocabulary, and the category folders are a default layout, not a fixed one. A repo that already holds lessons has its own values and folder names, and its searches are keyed on them: a lesson written to this skill's defaults instead is a lesson the repo cannot find.

So sample the existing lessons' frontmatter (`component`, `root_cause`, `problem_type`, `tags`) and folder names before classifying:

- `component`: the value existing lessons use for this **area**.
- `root_cause`: the value existing lessons use for this same **cause**, wherever they live; an area's usual cause does not carry over to a lesson whose verified cause differs.
- Several spellings for one area or cause: the one most lessons use (tie: the most recently dated lesson). Reuse values as spelled; never coin a near-synonym.
- The schema's suggested defaults apply only when no lesson covers the area (component) or names the cause (root_cause). A new fallback value is lowercase and underscore-separated.
- The folder: the existing one that covers this area; the mapping below only when none does.

`problem_type`, `severity` and `resolution_type` stay closed enums.

## Category folders

The default layout under the lessons folder, used when no existing folder covers the area:

| `problem_type` | Folder |
|---|---|
| `build_error` | `build-errors/` |
| `test_failure` | `test-failures/` |
| `runtime_error` | `runtime-errors/` |
| `performance_issue` | `performance-issues/` |
| `database_issue` | `database-issues/` |
| `security_issue` | `security-issues/` |
| `ui_bug` | `ui-bugs/` |
| `integration_issue` | `integration-issues/` |
| `logic_error` | `logic-errors/` |
| `architecture_pattern` | `architecture-patterns/`: structural shape decisions (agent, pipeline, workflow shape) |
| `design_pattern` | `design-patterns/`: reusable non-architectural approaches |
| `tooling_decision` | `tooling-decisions/`: language, library or tool choices with lasting rationale |
| `convention` | `conventions/`: team-agreed ways of working, kept so they survive turnover |
| `workflow_issue` | `workflow-issues/` |
| `developer_experience` | `developer-experience/` |
| `documentation_gap` | `documentation-gaps/` |
| `best_practice` | `best-practices/`: fallback when no narrower knowledge value fits |

`patterns/` holds pattern docs: generalized rules derived from several lessons.

## YAML safety

Strict YAML parsers reject an array item that starts with a reserved indicator. In every array-of-strings field (`symptoms`, `applies_when`, `tags`, `related_components`, any later array), wrap the item in double quotes when it starts with `` ` ``, `[`, `*`, `&`, `!`, `|`, `>`, `%`, `@` or `?`, or contains `: `.

```yaml
symptoms:
  - "`sudo dscacheutil -flushcache` does not restore in-container mDNS"
```

A top-level scalar containing ` #` or `: ` is quoted whole; the frontmatter parser-safety check in [validation.md](validation.md) enforces that.

## Bug track template

```markdown
---
title: [The problem in one searchable line]
date: [YYYY-MM-DD]
category: [lessons subfolder]
module: [Module or area]
problem_type: [schema enum, bug track]
component: [corpus value, else schema suggested default]
symptoms:
  - [Observable symptom or exact error text]
root_cause: [corpus value, else schema suggested default]
resolution_type: [schema enum]
severity: [schema enum]
retire_when: [only when an outside change would retire this lesson, else omit]
tags: [keyword-one, keyword-two]
---

# [Title]

## Problem
[1-2 sentences: the issue and its user-visible impact]

## Symptoms
- [Observable symptom or error]

## What Didn't Work
- [Attempted fix and why it failed]

## Solution
[The fix that worked, with code before/after when it helps]

## Why This Works
[The root cause and why the fix addresses it]

## Prevention
- [A concrete practice, test, lint rule or guardrail, with code where it applies]

## Related Issues
- [Related lessons or issues, if any]
```

## Knowledge track template

```markdown
---
title: [The guidance in one searchable line]
date: [YYYY-MM-DD]
category: [lessons subfolder]
module: [Module or area]
problem_type: [schema enum, knowledge track]
component: [corpus value, else schema suggested default]
severity: [schema enum]
applies_when:
  - [Situation where this applies]
retire_when: [only when an outside change would retire this lesson, else omit]
tags: [keyword-one, keyword-two]
---

# [Title]

## Context
[The situation, gap or friction that prompted this guidance]

## Guidance
[The practice, pattern or recommendation, with code when it helps]

## Why This Matters
[What following or ignoring it does]

## When to Apply
- [Conditions where this applies]

## Examples
[Concrete before/after or usage examples]

## Related
- [Related lessons or issues, if any]
```

## Older lessons

Lessons written before parts of the schema stay valid: bug fields on a knowledge-track lesson, values from an earlier closed vocabulary, a `rails_version` field (now `framework_version`), or a missing `title`, `category` or `tags`. Refresh leaves those as they are unless it rewrites the lesson for another reason, and then brings it to the current format. New lessons follow every rule above.
