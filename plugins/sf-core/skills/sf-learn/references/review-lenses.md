# Review lenses

Step 8 of capture Full mode, interactive only (a non-interactive caller has no one to act on the findings). Start after the lesson is written and validated. Each lens is a read-only review of the **lesson**, not an audit of the codebase: its job is to make the lesson more correct and more reusable. Done when every lens that applies has run and its accepted suggestions are applied to the lesson.

## Choosing lenses

| The lesson | Lens |
|---|---|
| `problem_type: performance_issue` | Performance |
| `problem_type: security_issue` | Security |
| `problem_type: database_issue` | Data integrity |
| Code-heavy (examples carry the fix) | Code simplicity, inline in this context |
| Optional, any lesson | Recurring pattern, Best practice, Framework docs |

Run a lens as a generic subagent (never a named agent type) whose prompt holds the lesson, the lens text below, and: "Read-only: never edit files. Return suggested edits to the lesson, each with its evidence." Apply suggestions only to the lesson. Changing product code is a separate job: suggest `sf-simplify-code` or a review when a lens finds the code itself wanting.

## The lenses

**Performance.** Validate the lesson's account: the bottleneck class (algorithmic complexity, N+1 or missing index, unbounded memory, missing cache, network round trips, bundle or render cost), why the fix worked, which measurements prove it, which scaling assumptions matter (10x, 100x data), and what a future reader should monitor to catch a recurrence. Improve the lesson over proposing unrelated optimizations.

**Security.** Validate the vulnerability class (input validation, injection, XSS, authentication or authorization gap, secret or sensitive-data exposure, CSRF, unsafe redirect), the exploit path, why the fix reduces risk, the residual caveats, and the prevention a reader can apply. Report only credible threat paths the code's actual attack surface supports, each with a mitigation or verification step.

**Data integrity.** Name the invariant that was at risk and the failure path; check why the fix preserves it (constraints at model and database level, transaction boundaries and isolation, cascade and orphan handling, migration reversibility, NULL and default handling, lock duration); add how to verify it, the rollback or migration caveats, and any privacy obligation (PII, retention, deletion) the pattern touches.

**Code simplicity** (inline). Read the lesson's code examples for speculative abstractions, redundant wrappers, dead branches and just-in-case parameters, and for explanatory claims more complex than the fix. Simplify the examples in the lesson; leave the branch's code untouched.

**Recurring pattern.** Name the class of problem: the pattern that caused or would have prevented it (an anti-pattern, a naming inconsistency, duplicated logic, a layer or boundary violation), where else it appears in the codebase (search for it), what a reader should learn to recognize, and how the lesson should generalize. Prefer reusable insight to a broad quality audit; respect the project's stated conventions.

**Best practice.** Enrich the prevention guidance with authoritative practice. Source order: the repo's own guidance and installed skills (curated, highest authority), then official documentation, then community consensus; cite each and label its authority. Before endorsing an external API, SDK, OAuth flow or service, check it for deprecation and breaking changes. Return only guidance that changes the fix, its sequencing or its validation, and correct any part of the lesson that overreaches.

**Framework docs.** Back the lesson with version-correct references: find the installed version from the lockfile, read the official docs for that version (through a library-docs lookup tool or MCP server when the session has one, else web search), check for deprecations and breaking changes, read the dependency's own source or tests where the docs are thin, and add the links and version caveats that explain why the solution works.

## Reporting

List each lens that ran with a one-line verdict in the report's **Reviews** block.
