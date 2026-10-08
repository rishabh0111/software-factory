## Lens: engineering (always applied)

Review the plans as the engineer who will be paged when this breaks. Trace current behaviour and proposed changes separately: the code is evidence of what exists, the plan is a proposal. Don't call a proposed problem observed.

### 1. Scope

- **What already exists.** For each part of the work, search for code that already does it or most of it: helpers, libraries, existing endpoints, earlier tickets' `Produces`. A plan that rebuilds something the repo has is a finding.
- **Smallest version that meets the spec.** Each step should be needed by a spec success check, a must-not-change line or a pinned failure mode. List anything that fails that test as "could be cut": extra options, generality no caller needs, features the spec lists as non-goals, refactors outside the ticket's path. Prefer the smaller change; don't ask for extra cases the spec and failure modes don't need.
- **Moving parts.** A ticket that touches 8 or more files or introduces 2 or more new modules or services is a smell. Say whether a smaller arrangement delivers the same behaviour, naming its files.
- **Cuts that change the spec.** If cutting something would drop or weaken a capability, say so: that is a user challenge for the planner, not a cut.
- **Boring by default.** A new runtime dependency, datastore, queue or framework needs a reason the existing stack can't do the job. Before accepting hand-rolled code, check the installed version's own API (its types, docs under `node_modules/` or the vendor folder, its changelog) for a built-in that already does it.
- **History.** `git log --oneline -i --grep='revert\|fix' -- <paths the plans touch>`: repeated fixes or reverts in a touched file are a finding to plan around (a higher `risk`, an extra failure mode).
- **Stubs.** A plan step, Delivers line or Decisions line saying "for now", "placeholder", "simplified" or "wired later" with no ticket that finishes the work is a high finding: split, never shrink.

### 2. Architecture and data flow

- Trace each new path from its entry point (route, exported function, command, event handler, component render): where input comes from, what transforms it, where it lands (database write, response, rendered output, side effect), and what can fail at each step (missing value, invalid input, empty collection, timeout, dependency down).
- **Fit and coupling.** Does each new module fit the structure the code already has? Does a ticket reach into another module's internals? Does a ticket depend on something no `after` edge guarantees?
- **Words.** A plan that uses a glossary term with a different meaning, or a word the glossary lists under `Avoid`, is a finding; so is a new name for a concept the glossary or the code already names.
- **Interfaces.** Every `Consumes` matches a `Produces` of an earlier plan or a signature in the code, by name and type. Check each `Produces` against the module design checks pasted below this lens: shallow pass-through modules, internal detail leaking into the interface, a seam with only one adapter, missing error and invariant statements.
- **Security at boundaries.** Who may call the new path, what data it can read or change, and whether input from outside is validated before use.

### 3. Failure modes and edge cases

- For each new path, name one realistic production failure (network timeout, duplicate submit, concurrent write, partial data, stale cache, permission denied) and check that a plan pins it with a test or handles it.
- A failure with no test, no handling and no visible error is critical: it would fail silently.
- Each plan's five failure modes are specific to its code (not "invalid input"), ordered by likelihood, and each names a test in the steps.

### 4. Tests per ticket

- Every capability in the ticket's `covers` and every must-not-change line has a test in the steps. Existing behaviour the change puts at risk, with no test guarding it, is critical.
- Each failure mode is pinned by its named test.
- Each proposed test can answer: what behaviour does it protect, what plausible regression makes it fail, and why don't existing tests already catch that? A test that can't answer is dropped or folded into an existing test (a new row in a table-driven test beats a near-duplicate).
- Tests go through the interface callers use. A test that needs a hook, flag or export no production caller needs is testing past the interface.
- A unit test is enough for pure logic. Ask for an integration test where mocks would hide the real failure: auth, payments, deleting data, or a chain such as API to queue to worker to database. End-to-end tests only for critical user flows; prefer the cheapest level that catches the regression. Assertions that only check "it renders" or "it doesn't throw" don't count as coverage.
- **Every branch.** Each branch of a new code path (both sides of a condition, each error handler, each early return) is named by a planned test or by a one-line reason it needs none. A branch with neither is a finding.
- **Seams under test.** The plan's seams-under-test line names an existing seam where one reaches the behaviour, the highest one, and as few as possible. A new seam with no reason, or tests spread over several seams where one would do, is a finding. A UI-only capability (every success check happens on a page) with neither a repeatable browser test nor a `browser test: none: <reason>` line is a finding ([plan-format.md](../plan-format.md#sections)).
- **Model calls.** A plan that changes a prompt, a tool definition, a model choice or the code that builds a model call names the eval, golden-output or recorded-response test that would catch a quality regression, with its cases and baseline, or says none exists and why. Silence is a high finding.

### 5. Performance

On per-request and looped paths, look for queries inside loops, unbounded queries or caches, loading whole files or tables, missing indexes for new query shapes, and blocking calls without a timeout. Give each finding its scale (rows, requests per second, bytes) or say the scale is unknown. Don't invent benchmarks.

### 6. Migration and rollout risk

- A schema, data or stored-format change says what happens to existing data, in which order deploy and migration run, and how it rolls back.
- A change that breaks many call sites follows expand, migrate, contract (add the new form beside the old, move call sites in batches, then delete the old form), and each PR batch leaves the default branch working when merged alone.
- Changes to shared state, config defaults or public behaviour are reversible: a flag, a fallback, or a revert that doesn't need a data fix.
- New behaviour defaults to safe: a new option defaults to the current behaviour, and a risky new path is opt-in until proven.
- A capability split over several PR batches whose partial version users could see sits behind a default-off flag added by the first ticket and removed by the last. A half-visible capability with no flag is a high finding.

### 7. Constitution, ADRs and lessons

- Read `.software-factory/constitution.md` if it exists. For each MUST rule the plans touch, check the plans meet it. A plan that conflicts with a MUST is **critical**: it is fixed in the plan, or, if the work truly needs the exception, raised as a user challenge that states why it's needed and which simpler option was rejected. Never reinterpret the rule to fit the plan. Rules still in template form (`<...>`) are skipped.
- For each ADR in the area the plans touch (`docs/adr/` or the project's ADR directory), check the plans don't contradict it. A contradiction the plan doesn't name is a high finding, quoted as "Contradicts ADR-NNNN: <rule>"; reopening an ADR is a user challenge, never a silent override.
- Rules in `.software-factory/lessons.md` for this area are hard rules; a plan that breaks one is a high finding.

Output a table after the findings: `Rule | Source (constitution, ADR, lesson) | Plans touching it | Met?`, or "No constitution, ADR or lesson applies" in one line.
