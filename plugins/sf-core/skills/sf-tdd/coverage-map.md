# Coverage map: tests derived from documented intent

The planning branch of `sf-tdd`: before a release, or when a repository has documented rules and an unknown share of them is tested, turn each load-bearing rule into a test case and record which rules a test pins **today**, which are only proposed, and which nothing verifies. The documents say what the system should do; an audit finds where the code does not; tests stop that gap reopening after the next edit.

The output is a coverage map and concrete cases, not a finished suite: each deterministic case is then implemented through the red-green cycle in [SKILL.md](SKILL.md).

## Prerequisite: documented intent

Rules come from the system documents: trust boundaries, flows, permissions, variables, and any email, scheduled-work, SEO or automation documents (the intent documents `/sf-map-codebase --focus intent` writes, or the repository's own equivalents). Flows, permissions and automation carry the most. When they are missing or thin, say so and recommend mapping them first; never invent rules to test.

**Where the map lives:** a test-coverage file the repository already keeps, under any name, is the map: update it. Match on what it covers: a `TESTING.md` describing how the repository tests is the method, not the map. With none, write `COVERAGE.md` in the codebase-map folder ([work-docs.md](../../references/work-docs.md)), checking names case-insensitively first. Say which you did.

## Workflow

### 1. Read the intent and the tests that exist

Read the applicable documents as claims, not proof (the method in `sf-verify`'s documented-intent check). Then inventory the **existing suite**: the test files, what each actually asserts, and what the gate runs today. The map must separate coverage that exists now from coverage being proposed; skipping the inventory yields a falsely green map. No tests at all is itself a finding: say so plainly.

Done when every document in scope is read and every test file is listed with what it asserts.

### 2. Extract the rules worth testing

Take the load-bearing, deterministic rules: the ones whose violation crosses a trust, data, money, tenant or privacy boundary.

- authorisation **allow and deny** cases, above all the boundary crossings in the flows and the permissions matrix;
- input validation and output encoding at each sink;
- idempotency of jobs, and deduplication keys;
- fail-closed defaults: error, timeout, cache-miss and flag paths that must deny;
- side-effect conditions: exactly when an email sends, a write commits, a paid action fires;
- public-data-only constraints on public and bot routes;
- the output contract and tool-surface limits of each automation.

A rule earns a test when getting it wrong harms someone other than the actor. Cosmetic behaviour stays out.

Done when every documented rule is either listed or dropped as cosmetic.

### 3. Build the map

One row per use case: rule → expected behaviour, including the deny case → evidence (document line and code line) → test type → status (**existing**, **proposed**, **none**). Mark a row existing only when a test in the repository asserts that rule today.

| Type | Means | Gates the default run? |
|---|---|---|
| **unit** | pure and deterministic, no external services | yes |
| **integration** | real wiring against a local or in-memory dependency (test database, mocked provider), same result every run | yes |
| **guarded live** | needs a real external database, email provider, model or third party; runs only behind an explicit flag | never |
| **manual** | visual or judgement checks: a reviewer checklist item | never |

Prefer unit where the decision logic can be isolated; use integration when the rule lives in the wiring (middleware, row-level security, auth guards) and only a real local dependency exercises it. Extracting a decision into a pure helper so it is unit-testable **complements** a test of the real enforcement and never replaces it: the unit test proves the helper's logic, not that the framework calls it. Without an integration or guarded-live check of the wiring, the helper becomes a policy shadow that passes while the real path is unprotected.

Done when every rule from step 2 has a row with a type and a status.

### 4. Propose the cases

For each rule a deterministic test can pin: the case name, its arrange, act and assert, and the negative case it must reject. Group the cases by the document or flow they defend. Prefer the smallest test that pins the rule: one clear assertion per boundary beats an integration test that fails for ten reasons. Each confirmed finding from a review or audit becomes a regression case here.

Done when every **proposed** row of type unit or integration has a case.

### 5. Recommend the gate

Start from the gate the repository states: its agent instructions, contributing guide or release docs may say what gates a merge or a release (a local command plus a human go, a hosted CI workflow). Where they do, that policy is the gate: record it with its source and check that the deterministic set runs inside it. When it does not, report that as a finding for the owner; recommend no other gate over the stated one.

Where the repository states none, recommend, as a labelled suggestion for the user to approve and never as an applied change, a CI setup matched to its stack and tooling: the deterministic set (unit and local integration) on every pull request; guarded-live tests opt-in (manual or scheduled, never blocking); merges to the main branch gated on green through a required status check and branch protection. Include the workflow file and the branch-protection setting.

External services stay out of the default run whatever the gate is: flaky live tests erode a gate until people ignore it.

## Output

```
Test coverage: [scope]

| Use case | Rule (doc) | Expected behaviour (+ deny case) | Evidence | Type | Status |
|---|---|---|---|---|---|

### Existing coverage
[tests in the repository today, each tied to the rule it pins]

### Proposed tests
[by flow or document: name · assert · negative case · type]

### Gate
[the stated gate policy with its source, and whether the deterministic set runs in it; or the suggested workflow and branch-protection note]

### Gaps: documented but unverified
[rules no test checks, ranked by what crossing them exposes]
```

Write the map to its file (above) and give the user the path. The gaps are the backlog: exactly where the next edit can silently break a boundary.

## Check-only mode

For a map kept by hand, so a release can confirm it is current without anything rewriting it. **Write no file.** Read the tests; do not run them. Thin or absent documents are listed under *Not checked*, not mapped.

1. Find the map as above. With none, say so and stop.
2. Compare it row by row with the documents and the suite. It is stale where a documented rule has no row, or a row cites a rule the documents no longer state or now state differently; a row marked existing names a test that is gone or does not assert the rule; a test pins a rule the map marks proposed or none; a cited path, test name or gate command no longer matches the tree.
3. Leave the verdict to the owner: the map may be behind, or a document or test may have drifted.

Print:

```
Coverage check: [scope], check-only, no files written

### Stale entries
1. [rule or row]
   - Map says: [entry], `[map path]:[line]`
   - Docs or tests say: [what they state or assert], `[path]:[line]`
   - Owner decides: fix the map, the doc, or the test.

### Not checked
- [thin or absent docs, tests whose assertion could not be read, areas out of scope]

### Summary
Coverage check, [date], commit [short SHA], scope [scope]: [N] map rows read, [N] stale entries, [N] not checked. Tests read, not run. No files written. Which side to fix is the owner's call.
```

An empty *Stale entries* section states what was read to reach it. Then stop.
