# Engineering lens

The Engineering lens of [sf-plan-review](SKILL.md) and the required shipping gate: will
this plan build cleanly, fail visibly and stay covered by tests? Run it inside the
skill's method: target, plan file, base branch, shared context, findings format,
decision procedure, outside voice, TODOs, outputs and exit gate all come from
[SKILL.md](SKILL.md). Use existing tests, examples and bounded probes of current
behavior for evidence; never build the proposed features, acceptance suites or
benchmarks.

## Engineering preferences

Every recommendation (in this lens and the CEO lens) traces to one of these:

- **Shared code** only for common behavior that improves reliability or saves net code;
  similar-looking code alone is not enough.
- **Tests:** every behavior tested; no test without a regression it would catch.
- **Enough engineering:** no fragile hacks, premature abstraction or needless complexity.
- **Edge cases** handled thoroughly, over speed.
- **Explicit over clever.**
- **Right-sized diff:** the smallest clear change; rewrite a broken foundation when it
  is the cheaper path.

## How great engineering managers think

Apply these throughout, not as extra checks:

1. **State diagnosis:** is the team falling behind, treading water, repaying debt or
   innovating (Larson)?
2. **Blast radius:** trace the worst-case harm to systems and people.
3. **Boring by default:** three innovation tokens; otherwise proven technology (McKinley).
4. **Incremental change:** strangler migrations and canaries over big bangs (Fowler).
5. **Systems over heroes:** design for tired humans at 3am.
6. **Reversibility:** flags and incremental rollouts make mistakes cheap to undo.
7. **Failure is information:** blameless postmortems, error budgets, chaos engineering
   (Allspaw, Google SRE).
8. **Conway's Law:** design team and system boundaries together (Skelton/Pais).
9. **DX signals quality:** slow CI, local dev and deploys predict quality and retention
   trouble.
10. **Essential vs accidental complexity:** the real problem, or a self-made one (Brooks)?
11. **Two-week smell:** a small feature taking two weeks suggests onboarding trouble.
12. **Glue work:** value coordination without trapping people in it (Reilly).
13. **Make the change easy first:** refactor before changing behavior, separately (Beck).
14. **Own production:** dev and ops share responsibility (Majors).
15. **Error budgets:** spend the 0.1% a 99.9% SLO allows; avoid uptime at any cost.

**Diagrams.** ASCII diagrams for flows, states, dependencies, pipelines and decisions in
plans and docs; propose inline diagrams in complex models, controllers, concerns,
services and tests. Nearby diagrams change in the same commit as the code; flag stale
ones even outside scope.

## Evidence by target

| Target | Evidence to examine |
|---|---|
| Plan or design doc | Proposed paths, checked against existing interfaces and tests |
| Branch diff | Changed behavior and surrounding code, traced from entry points |
| File or directory | Existing behavior and its callers and tests |

Trace current behavior and proposed changes separately. Read any `## CEO Plan:` section
for its accepted, deferred and skipped scope.

## Step 0: Scope challenge

Mandatory before Section 1.

### A. Assess the target

Complete these before the complexity decision; write no findings or scope changes yet.

- **What already solves each sub-problem?** Helpers, libraries, callers, reusable
  outputs: their behavior and dependency/deployment boundaries. Cite authored sources;
  label proposed callers with their motivating plan requirement and assumptions.
- **Minimum changes** that reach the goal; flag work deferrable without blocking it and
  challenge scope creep.
- **Complexity count** of the selected work, not files read as evidence: for a plan, its
  proposed changed files and new classes/services; for a diff, changed files and the
  classes/services it introduces; for a path, the files in it and any explicitly
  proposed new classes/services. Count each once, label estimates.
- **Search check.** For each new architectural pattern, infrastructure component or
  concurrency approach, research (Web research in [SKILL.md](SKILL.md)), one request per
  pattern: `{framework} {pattern} built-in`, `{pattern} best practice {current year}`,
  `{framework} {pattern} pitfalls`, up to 8 bullets with source URLs. Prefer built-ins;
  label recommendations with their layer and explain departures from standard practice.
- **TODOS cross-reference:** what in TODOS.md blocks this plan, fits this PR without
  growing scope, or needs a new TODO?
- **Completeness:** full tests, edges and errors cost 10-100x less with an agent; prefer
  completeness when the shortcut saves only agent minutes.
- **Distribution:** for new artifacts, the build and publish CI/CD, target OS and
  architectures, and download or install channels. Deferrals go to NOT in scope.
- **Reality rows (required):** work [reality-rows.md](reality-rows.md): every tier 1 row
  (never `n/a`), tier 2 rows for detected scopes, each with a file:line receipt (with
  no linked issue, deferred-asks is `pass`; the premise table counts `unverified=<n>`).
  End with one `REALITY:` line per row and the `PLAN_REALITY` check; repair a missing
  row twice, then warn at the gate.

### B. Complexity gate

Fewer than 8 files and fewer than 2 new classes/services: go to C. Otherwise stop
before Section 1; while a question here awaits its answer, start no section and write
no findings or fixes (an unchanged copy of the original plan is allowed).

1. Explain the complexity. Ask each proposed feature cut or deferral separately.
2. Always ask the structure question when the gate trips, even with no cuts. Compare
   only the arrangement, labeled `Original arrangement` and `Smaller arrangement`, with
   files and classes per option. Both keep the same approved features, contracts and
   approved security, error, test and performance fixes; include `Pending remedies not
   decided here: <ids>`. If no smaller arrangement keeps those commitments, say so and
   offer confirming the original or pausing to investigate one. A pause leaves the
   arrangement undecided: investigate only that question, then ask again.
3. Save the answers as one scope record: `feature answers: <refs>; structure: <A/B +
   ref>; accepted scope: <exact scope>; pending remedies: <ids or none>`, and Read it
   back. These are admin answers: they approve no remedy.

Apply only the accepted scope changes. Do not re-argue the reduction or skip approved
components.

### C. Resolve findings

Present the numbered Scope Challenge findings (or "No issues found"), resolve each
remedy through the decision procedure, and report the dispositions. Record the result:
`scope reduced per recommendation` when accepted changes reduced scope, otherwise
`scope accepted as-is` (including when B was skipped; a smaller arrangement that keeps
scope is not a reduction). Keep it current if later answers change scope. Continue to
Section 1 only when no answer is pending.

## Review sections

Architecture → Code quality → Tests → Performance, each in full.

### 1. Architecture

- System and component boundaries, dependencies and coupling.
- Data flow, bottlenecks, scaling and single points of failure.
- Security: auth, data access and API boundaries.
- Key flows that need ASCII diagrams in the plan or the code.
- One realistic production failure per new path or integration; does the plan handle it?
- **Distribution architecture:** how new artifacts are built, published and updated;
  CI/CD included or deferred.

### 2. Code quality

- Organization and module structure.
- Shared-code opportunities in the target and its callers, judged by the rubric below
  (no standalone history sweep, no quotas); check proposed caller assumptions against
  existing interfaces.
- Error-handling gaps and missing edge cases, called out explicitly.
- Technical debt, fragility and needless complexity against the preferences.
- Accuracy of the ASCII diagrams in touched files.

**Shared-code rubric:**

- **Prove the callers.** At least two verified first-party source locations, with
  functions and lines; added or uncommitted source qualifies. Only a plan review may use
  proposed callers, labeled as assumptions. Similar names or formatting do not establish
  equivalent behavior. Generated and third-party copies are never callers and add no
  savings: follow generated copies back to their templates. Existing dependencies stay
  valid reuse targets.
- **Reuse before extracting.** Inspect existing libraries and helpers first. Compare
  behavior, inputs, outputs, errors, side effects, security, dependencies and
  deployment/runtime boundaries; keep differences callers need. Do not bridge languages
  or isolated deployments without a practical shared contract.
- **Keep the helper small.** Name its destination and contract, the callers to migrate
  and the smallest adoption sequence. No option-heavy helpers, no coupling of unrelated
  components. Point to existing tests or use; specify shared-contract and
  caller-integration coverage and the blast radius of a shared failure.
- **Account for the whole change.** Name removed blocks and their replacements. Show
  implementation lines removed, added and saved separately from totals including tests
  and integration (savings = removed − added). Count moved code on both sides, exclude
  generated and vendored lines, use ranges when uncertain, and never count one removal
  twice. Say when tests or integration may make the total grow.
- **Rank.** Favor reliability gains and total net savings, then low adoption and
  testing risk; prefer proven code used by several callers. Recent activity breaks ties,
  never decides alone. Reject similarities with incompatible contracts, and extractions
  whose benefit does not justify the abstraction.

Scope approval does not approve an extraction: each is its own decision.

### 3. Tests

**Coverage goal:** every changed behavior is protected by a test that would catch a real
regression. Test count is not a goal. Carry required proof of approved behavior forward
without asking; new policies and optional verification depth go through the decision
procedure before their tests become accepted work. For shared-code changes, audit the
shared-contract tests (behavior, errors, side effects, boundaries) and each migrated
caller's integration; rejected extractions still need coverage for real duplicated-code
defects.

**Framework.** Use CLAUDE.md's `## Testing` section when it names a command and
framework. Otherwise gather evidence (markers, not commands to run):

```bash
setopt +o nomatch 2>/dev/null || true
[ -f manage.py ] && echo "RUNTIME:python FRAMEWORK:django"
{ [ -f pyproject.toml ] || [ -f pytest.ini ] || [ -f tox.ini ] || [ -f setup.cfg ] || [ -f requirements.txt ]; } && echo "RUNTIME:python"
{ [ -f Gemfile ] || [ -f Rakefile ] || [ -f .rspec ]; } && echo "RUNTIME:ruby"
[ -f package.json ] && echo "RUNTIME:node"
[ -f go.mod ] && echo "RUNTIME:go"
[ -f Cargo.toml ] && echo "RUNTIME:rust"
[ -f pubspec.yaml ] && echo "RUNTIME:dart"
[ -f pom.xml ] && echo "RUNTIME:jvm BUILD:maven"
{ [ -f build.gradle ] || [ -f build.gradle.kts ]; } && echo "RUNTIME:jvm BUILD:gradle"
ls jest.config.* vitest.config.* playwright.config.* cypress.config.* .rspec pytest.ini tox.ini phpunit.xml dart_test.yaml 2>/dev/null
[ -f package.json ] && grep -q '"test"[[:space:]]*:' package.json && echo "SCRIPT:package.json test"
[ -f Makefile ] && grep -qE '^(test|check):' Makefile && echo "TARGET:make test"
git ls-files | grep -cE '(^|/)(tests?|spec|__tests__)/|(^|/)tests?\.py$|(^|/)test_[^/]+\.py$|_test\.(go|py|rb|ts|js|exs|dart)$|\.(test|spec)\.[jt]sx?$|_spec\.rb$|Test\.(java|kt)$' | sed 's/^/TESTFILES:/'
```

With no framework found, say so and continue the diagram and planned assertions. A
proposed new framework is a decision in step 5 below; install nothing.

A **targeted audit** reviews named source/test files or a branch diff; a **prototype** is
existing runnable code the plan references, never a proposed component. Run these five
steps once, inside this section:

**Step 1. Trace every codepath.** For each planned feature, service, endpoint or
component, follow the planned execution through existing code. When grounded in concrete
source and tests, read them in a dedicated call before drawing (`cat -n src/f && echo --
&& cat -n test/f`), with no diff, grep or commentary mixed in. From each entry point
(route handler, exported function, event listener, component render) follow the data:
where input comes from, what transforms it, where it goes, what can go wrong at each
step. Diagram every function in scope, every conditional branch (if/else, switch,
ternary, guard, early return), every error path (try/catch, rescue, error boundary,
fallback), every call into another function (trace into it: does it have untested
branches?) and every edge: null, empty array, invalid type.

**Step 2. Map user flows, interactions and error states.** For each feature: the full
journey ("clicks Pay → form validates → API call → success or failure screen");
interaction edge cases (double-click or rapid resubmit, navigating away mid-operation,
stale data after 30 minutes or an expired session, a 10-second API, two tabs on one
form); the errors a user sees (a clear message or a silent failure? can they recover?
no network, a 500, invalid server data); and empty, zero and boundary states (zero
results, 10,000 results, one-character and maximum-length input). Add them to the
diagram: an untested user flow is as much a gap as an untested branch.

**Step 3. Check each branch against existing tests.** Search for a test per branch:
`processPayment()` → `billing.test.ts`, `billing.spec.ts`, `test/billing_test.rb`; an
if/else needs both paths; an error handler needs a test that triggers that error; a
called helper's branches need tests too; a user flow needs an integration or E2E test;
an interaction edge case needs a test that simulates it. Rate each: ★★★ behavior with
edge cases and error paths; ★★ correct behavior, happy path only; ★ smoke, existence or
trivial assertion ("it renders", "it doesn't throw"), which never counts as coverage.

**Test value bar.** Propose a test only with all four answers; otherwise extend an
existing test or drop it:
1. What observable behavior, invariant or independent contract does it protect?
2. What credible regression makes it fail?
3. Why does existing coverage not catch that? Prefer a row in an existing table-driven
   test or shared fixture over a near-duplicate.
4. Does it need a production seam (export, flag, wrapper, injection hook) no production
   caller needs? Then test at the real boundary instead.

A test that breaks under a behavior-preserving refactor asserts implementation: rewrite
it at the owning boundary, unless exact output is the declared contract (goldens, prompt
bytes, wire formats). Keep a test that independently enforces a public API, protocol,
config, migration, storage, security, platform, default, prompt-byte, golden, package,
release or architecture contract; static or slow is no reason to delete it.

Value card, one per proposed test: `Value: protects=<...>; fails_when=<...>;
why_new=<...>; seam=none; no_claim=<...>` (seam is `none` or its name; `no_claim` is one
sentence on what green does not prove and which fixtures or mocks stand in for what; it
never waives a required live check). Each field at most 160 UTF-8 bytes (clamp to 157
plus `...`). A missing upstream card never blocks: derive it.

Example: `Value: protects=refundPayment rejects an empty reason; fails_when=the reason
guard is removed or inverted; why_new=billing.test.ts covers processPayment only;
seam=none; no_claim=provider acceptance (mocked provider; unit only)`. Rejected
(covered_elsewhere): "checkout renders"; checkout.e2e.ts:15 covers it, so extend that
test.

Coverage measures: X = paths with a ★★ or ★★★ test / all paths (value-weighted; gates
use X); Y = paths with any test / all paths. `/sf-ship` computes them from the cards.

**Unit, E2E or eval:**
- **[→E2E]:** a common flow across 3+ components or services (signup → verify email →
  first login); an integration point where mocks hide real failures (API → queue →
  worker → DB); auth, payment and data-destruction flows.
- **[→EVAL]:** a critical LLM call that needs a quality bar; changes to prompt
  templates, system instructions or tool definitions.
- **Unit:** pure functions, side-effect-free helpers, one function's edge cases, rare
  non-customer-facing flows.

**Regression rule.** When a planned change puts existing behavior at risk without
regression coverage, that coverage is a P0 requirement. Carry an exact approved
regression contract forward; otherwise settle it in one dedicated question (the
behavior to preserve, intended changes, acceptance assertions) before adding it to the
plan. Ask how to cover it, never whether to skip it, and never fold it into a test-depth
question. A proposed rewrite is a regression risk, not proof that running code broke:
name the callers and behavior at risk.

**Step 4. The coverage diagram.** Targeted audits open the section with it; full reviews
place it inside the section. Code paths and user flows together:

```
CODE PATHS                                            USER FLOWS
[+] src/services/billing.ts                           [+] Payment checkout
  ├── processPayment()                                  ├── [★★★ TESTED] Complete purchase — checkout.e2e.ts:15
  │   ├── [★★★ TESTED] happy + declined + timeout      ├── [GAP] [→E2E] Double-click submit
  │   ├── [GAP]         Network timeout                 └── [GAP]        Navigate away mid-payment
  │   └── [GAP]         Invalid currency
  └── refundPayment()                                 [+] Error states
      ├── [★★  TESTED] Full refund — :89                ├── [★★  TESTED] Card declined message
      └── [★   TESTED] Partial (non-throw only) — :101  └── [GAP]        Network timeout UX

LLM integration: [GAP] [→EVAL] Prompt template change — needs eval test

COVERAGE: 5/13 paths tested (38%)  |  Code paths: 3/5 (60%)  |  User flows: 2/8 (25%)
QUALITY: ★★★:2 ★★:2 ★:1  |  GAPS: 8 (2 E2E, 1 eval)
Legend: ★★★ behavior + edge + error | ★★ happy path | ★ smoke | [→E2E] integration test | [→EVAL] LLM eval
```

Use `[GAP]`, `[★★ TESTED]`, `[→E2E]`, `[→EVAL]`, never bare `[ ]`/`[x]`; keep user-flow
markers off code-path rows. All paths covered: "Test review: All new code paths have
test coverage ✓", then still check eval scope and write the Test Plan.

LLM/eval scope: if the plan touches the "Prompt/LLM changes" file patterns in
CLAUDE.md, state which eval suites must run, which cases to add and which baselines to
compare; unapproved eval scope is one of step 5's choices.

**Step 5. Add the missing tests to the plan.** For each GAP and the eval scope, specify
the test file (matching naming conventions), what it asserts (inputs → expected
behavior), unit, E2E or eval, and its value card; regression risks are flagged **P0**
with the behavior they protect. A proposal that fails the value bar becomes "extend
<existing test>" or is dropped with a one-line reason. Also list **tests made obsolete
by this plan** (proposals only; retiring one needs a retirement card at implementation
time, see `sf-code-review`). Resolve this section's new or reopened choices through the
decision procedure, one at a time.

**Test Plan.** Then write the `## Test Plan` section of the plan file, above the
terminal report, replacing this review's earlier one, even while some choices are
pending (list those separately, never as required work). `/sf-qa` reads it as its
primary test input and `sf-code-review` seeds retirement candidates from `Tests to
Retire`, so it says what to test and where, not how to implement. Update it when later
answers change the tests.

```markdown
## Test Plan
Generated by sf-plan-review (Engineering lens) on {date}
Branch: {git branch --show-current}
Repo: {owner/repo from `git remote get-url origin`, or local-only}

### Affected Pages/Routes
- {URL path} — {what to test and why}

### Key Interactions to Verify
- {interaction} on {page}

### Edge Cases
- {edge case} on {page}
  Value: protects={...}; fails_when={...}; why_new={...}; seam=none; no_claim={...}

### Critical Paths
- {end-to-end flow that must work}
  Value: protects={...}; fails_when={...}; why_new={...}; seam=none; no_claim={...}

### Tests to Retire
- {existing test made obsolete by this plan and why, or none}

### Pending Decisions
- {unapproved test requirement and its ledger row, or none}
```

### 4. Performance

- N+1 queries and database access patterns.
- Memory usage.
- Caching opportunities.
- Slow or complex paths.

On per-request or looped paths, check queries in loops, unbounded queries or caches,
missing indexes, whole-file loads and blocking calls without timeouts. Give each
finding's scale (rows, requests/s, bytes) or mark it unknown; never invent benchmarks.

## Outside voice

Run step 6 of [SKILL.md](SKILL.md) with the current working plan, the target evidence
and the actual decisions as THE PLAN, plus any CEO plan's scope decisions and vision.

## Lens outputs

- **Reality rows:** the `REALITY:` lines and the `PLAN_REALITY` line.
- **What already exists** also references accepted shared-code choices with their full
  rubric evidence, and explains safer separation or net growth.
- **Diagrams:** non-trivial flows, states and pipelines in ASCII; name the files that
  need inline diagrams for complex model, service or mixin behavior.
- **Failure modes:** for each new diagrammed path, a realistic production failure, its
  test and error-handling coverage, and whether the user sees a clear error or a silent
  failure. No test, no handling and silent is a **critical gap**.
- **Worktree parallelization.** With one primary module or fewer than 2 independent
  workstreams: "Sequential implementation, no parallelization opportunity." Otherwise a
  dependency table by module, never guessed files:

  | Step | Modules touched | Depends on |
  |------|----------------|------------|
  | (step name) | (directories/modules) | (other steps, or —) |

  Then **parallel lanes** (disjoint modules together, shared modules sequential:
  `Lane A: step1 → step2 (shared models/)` / `Lane B: step3 (independent)`), the
  **execution order** ("Launch A + B. Merge both. Then C."), and **conflict flags** for
  modules shared across lanes. Lanes run in parallel git worktrees (`isolation:
  "worktree"`) or workspaces.
- **Test Plan:** written in Section 3; update it only if later answers changed it.
- **Completion summary:**
  - Step 0: Scope Challenge — ___ (scope accepted as-is / scope reduced per recommendation)
  - Reality rows: ___/___ applicable rows (`PLAN_REALITY`), ___ unverified premises
  - Architecture: ___ issues · Code quality: ___ issues · Tests: diagram produced, ___ gaps · Performance: ___ issues
  - NOT in scope: written · What already exists: written
  - TODOS.md updates: ___ items proposed
  - Failure modes: ___ critical gaps flagged
  - Unresolved decisions: ___ in this review
  - Outside voice: completed / unavailable / disabled (reason)
  - Parallelization: ___ lanes, ___ parallel / ___ sequential
  - Lake score: X/Y answers chose the 10/10 option among answers scored for completeness; N/A if Y=0

## Report row

- **Fields:** `status`, `unresolved` (this review only), `critical_gaps`,
  `issues_found` (Architecture + Code quality + Performance + Test gaps; Scope Challenge
  and outside-voice findings are reported separately), `mode` (FULL_REVIEW for "scope
  accepted as-is", SCOPE_REDUCED for "scope reduced per recommendation"), `commit`,
  timestamp in ISO 8601.
- **Status:** `clean` with issues_found, unresolved and critical_gaps all 0; otherwise
  `issues_open` (which can mean mapped work, not failure).
- **Findings cell:** "{issues_found} issues, {critical_gaps} critical gaps".

## Next steps

From the published readiness, offer only what applies:

- **A)** Run the Design lens: unreviewed UI scope (frontend, CSS, views or interactions in
  the diagrams or findings).
- **B)** Run the CEO lens: optionally, for an unreviewed significant product change (new
  user-facing features, changed direction, substantial scope expansion).
- **C)** Ready to implement — run `/sf-ship` when done.

Flag CEO or design rows made stale by contradicting assumptions or commit drift. With no
further review needed: "All relevant reviews complete. Run `/sf-ship` when ready." The
question copies the plan's task prerequisites and order without adding to them: a test
required before editing one function does not make every independent lane wait.
