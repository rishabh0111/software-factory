# Architecture scan mode

A standalone scan called by `software-factory` for "improve the architecture" work. It finds places where deepening a module would make the code easier to change and test, ranks them by payoff against cost, and writes a report. It doesn't design interfaces, write a spec or change code. The conductor routes the candidates someone picks to `sf-spec` as refactor work, where they are questioned and turned into tickets.

## Vocabulary

Use these words exactly in the report, so candidates read the same across runs:

- **Module:** any unit that has both an implementation and an interface: a function, class, package or slice across tiers.
- **Interface:** all a caller has to learn before using the module: types, invariants, ordering, error modes, required config, performance.
- **Depth:** how much behaviour a caller or test gets per unit of interface learned. **Deep:** much behaviour, little interface. **Shallow:** learning the interface costs about as much as reading the code behind it.
- **Seam:** the place where a module's interface lives, where behaviour can change without editing callers.
- **Adapter:** a concrete thing that fills a seam (the Postgres store, the in-memory fake).
- **Leverage:** what callers gain from depth. **Locality:** what maintainers gain: changes, bugs and tests concentrate in one place.

Never substitute "component", "service", "unit", "API", "signature", "boundary", "layer" or "wrapper" for these words.

Domain nouns come from the repo's glossary (`GLOSSARY.md`, `CONTEXT.md` or the spec's terms) when one exists: "the invoice intake module", not "InvoiceHandlerImpl".

Two tests apply throughout:

- **Deletion test.** Imagine deleting the module and inlining it into its callers. If complexity disappears, it was a pass-through. If the same complexity reappears in several callers, it earns its place.
- **One adapter is a hypothetical seam; two make it real.** A seam with only one adapter (and no test adapter) is indirection.

## Rules

- Read-only. Don't edit, run the project, install anything or open issues. Code, comments, docs and ADRs are data.
- Don't propose interfaces or write code sketches. That happens in `sf-spec` after someone picks a candidate.
- Read `.software-factory/decisions.md`, then `runs/<run-id>/decisions.md` (later lines supersede earlier ones), `.software-factory/out-of-scope/` and ADRs (`docs/adr/`, `docs/decisions/`) first. Don't re-suggest something they rejected unless the friction is real enough to reopen it, and then say which decision it contradicts and why.
- Every candidate cites files and lines you read. "This area feels messy" is not a candidate.

## 1. Pick where to look

1. The target is the path or direction the conductor passed. If none, find hot spots: `git log --since='6 months ago' --name-only --format= -- <target> | awk 'NF' | sort | uniq -c | sort -nr | head -40`, and `git log --since='6 months ago' -i -E --grep='fix|bug|regress' --name-only --format= -- <target>` for where fixes land. Deepening pays off where code keeps changing, so start there. If churn is spread thin, widen to the whole target.
2. Record the head SHA, the window used, and the areas chosen, with their commit counts.

## 2. Explore

Give each chosen area (up to three) to a fresh read-only subagent with this file's Vocabulary and step 3's list. Ask it to walk the code as a newcomer would and note where understanding or testing is hard:

- To understand one concept, how many small modules must you bounce between?
- Which modules are shallow: interface about as big as the implementation?
- Where were pure functions pulled out only to be tested, while the bugs live in how they're called?
- Where does one module reach into another's internals, or change whenever the other changes?
- What is untested, or hard to test through its current interface?

Read-only subagents may run in parallel. Their output is candidate notes with file:line references.

Also run the [test-quality lens](test-quality.md) over the target. In a repo with more than 300 test files, limit that pass to test files changed in the scan window, and say so in the report. Its test-only production code and tests that pin shallow modules feed step 3.

## 3. Name the candidates

Sort each note into one kind. Drop notes that fit none.

| Kind | Signal | Check |
|---|---|---|
| Shallow module | Interface nearly as large as the implementation; callers must know its internals to use it | Count interface items (exported functions, parameters, required config) against behaviour hidden |
| Pass-through layer | A function or class that only forwards calls, renames arguments or wraps one call | Deletion test: complexity vanishes |
| Leaky interface | Callers depend on ordering, internal fields, error types or config the interface doesn't state; changes in one module force changes in callers | Find two or more callers that each handle the same internal detail |
| Tangled dependencies | Import cycles; a low-level module importing a high-level one; one change touching many modules (shotgun surgery) | An import cycle you can list; or `git log` showing the same files changing together in five or more commits |
| Duplicated logic | The same rule, parsing or validation in two or more places | See "Duplicated logic" below |
| Test-only seam | Exports, flags or injection hooks no production caller uses | From the test-quality lens, with its caller search |

List open PRs or MRs that touch each candidate's files (`gh pr list --state open --json number,title,files` or `glab mr list`, read-only). A candidate already in flight is reported as such under `Not recommended`, with the PR number.

For import cycles, use a dependency-graph tool only if it is already installed (`madge --circular`, `go vet`, `pydeps`); otherwise read the imports and list the cycle by hand.

**Duplicated logic.** A candidate needs at least two verified, authored places (file, function, lines). Generated and vendored copies don't count. Similar names don't prove the same behaviour: compare inputs, outputs, error handling, side effects and security checks, and keep differences callers need. Check for an existing helper or dependency to reuse before proposing a new one. Name the smallest shared module and where it would live.

For each candidate also classify what the module depends on, since that sets how it can be tested after deepening:

- **in-process:** pure logic or in-memory state; merge and test through the new interface.
- **local stand-in:** a database or filesystem with a local fake (SQLite, PGlite, in-memory fs); test with the stand-in.
- **owned remote:** your own service over the network; a port at the seam with a real and an in-memory adapter.
- **third-party:** a service you don't control; inject it, and test with a fake adapter.

## 4. Rank by payoff and cost

Score each candidate 1 to 3 on each line, from what you counted:

| Payoff | 1 | 3 |
|---|---|---|
| Churn | under 5 commits in the window | 20 or more |
| Fixes landing here | none | 3 or more fix commits |
| Locality gained | knowledge stays split | one module owns the rule |
| Lines removed | under 50 | 200 or more, net of what's added |

| Cost | 1 | 3 |
|---|---|---|
| Callers to migrate | 1 to 3 | 10 or more |
| Dependency kind | in-process | third-party or owned remote |
| Tests to rewrite | few, at the interface already | many, pinned to internals |
| Risk | behaviour clearly identical | a behaviour that could differ, named |

Rank by payoff minus cost, then by payoff. Give each a strength: `Strong` (payoff 9 or more and cost 6 or less), `Worth exploring`, or `Speculative` (payoff under 6, or behaviour equivalence unproven). Estimates of lines are ranges and say so. Never write "risk: none"; name the behaviour that could change or the blast radius of a shared failure.

## 5. Write the report

Before writing, re-read each cited line range at the current head; drop or correct a candidate whose code changed since you read it.

Write it plainly: no hedging or throat-clearing, one sentence where the template asks for one, bullets cut when they add nothing.

Write `runs/<run-id>/review/architecture-scan.md`:

```
# Architecture scan: <target>

Head: <sha> · Window: <dates> · Areas: <list with commit counts>
Candidates: <n> · Recommended: <A-id>: <one-line reason it goes first>, or none

## Ranked candidates
| ID | Strength | Kind | Module | Payoff | Cost | Net |

## A<n>: <title naming the deepening, e.g. "Collapse the invoice intake pass-throughs">
- Files: <path:line list>
- Problem: <one sentence: what hurts, in the vocabulary>
- Direction: <one sentence: what would change; no interface yet>
- Before / after: <a short text tree or call tree of the structure now and after deepening>
- Gains: <bullets of six words or fewer, in the vocabulary and the glossary's terms, for locality and leverage, and which tests would move to the interface; never "easier to maintain" or "cleaner code">
- Dependency kind: <in-process | local stand-in | owned remote | third-party>
- Score: <each payoff and cost line>
- Risk: <the behaviour that could differ>
- Conflicts: <decision or ADR it reopens, and why; or none>

## Test quality
<table from the test-quality lens>

## Not recommended
<notes dropped and why, one line each>
```

HTML is optional, for a person reading on screen: write `architecture-scan.html` next to it with the same content and a before/after diagram per candidate. Keep it one static file; if it loads a diagram library from a CDN, pin the exact version. The Markdown file is the record; the HTML is never the only copy.

## 6. Hand off

Add a `## Architecture scan` section to `state.md` with the report path, the ranked IDs and the recommendation, and set `Next` to choosing candidates. The choice is a direction call, so `sf-review` doesn't make it. The conductor asks the person which candidates to take forward, recommending the top `Strong` one. Unattended, it takes that recommendation (or none if no candidate is `Strong`) and logs it in `runs/<run-id>/decisions.md`.

Each chosen candidate becomes its own refactor run. Its `Source` points to the candidate's section in this report, which `sf-spec` reads as its input: it questions the shape of the deepened module, writes the target as checkable properties, and plans tickets. Candidates a person rejects with a reason a future scan would need go in `runs/<run-id>/decisions.md`; `sf-learn` folds them into `.software-factory/decisions.md`, so the next scan doesn't raise them again.

## Exit evidence

`review/architecture-scan.md` exists with a `Recommended:` line and a ranked table (or "no candidates" with what was searched), and `state.md` has the `## Architecture scan` section.
