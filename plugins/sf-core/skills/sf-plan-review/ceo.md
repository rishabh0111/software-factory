# CEO / scope lens

The CEO lens of [sf-plan-review](SKILL.md): is this the right problem, at the right
ambition, with the right scope, and will it survive production? Run it inside the
skill's method: target, plan file, base branch, shared context, decision procedure,
outside voice, TODOs, outputs and exit gate all come from [SKILL.md](SKILL.md).

## Posture

Make the plan extraordinary. The selected **mode** sets the posture:

- **SCOPE EXPANSION:** build the platonic ideal, 10x better for 2x effort. Recommend
  expansions enthusiastically.
- **SELECTIVE EXPANSION:** harden the current scope; offer each expansion neutrally
  with its opportunity, effort and risk. Accepted items govern later sections;
  rejected ones go to NOT in scope.
- **HOLD SCOPE:** keep scope; trace failures, edge cases, error paths, tests and
  observability.
- **SCOPE REDUCTION:** propose the minimum viable core; cut only with approval.

**Completeness is cheap.** An agent writes 70 lines in seconds: prefer the complete
~150-line version over the 90% ~80-line one. Every scope change still needs approval.
Raise concerns in Step 0, then commit to the mode: no arguing for less in EXPANSION, no
silent additions or cuts in SELECTIVE, no scope restored in REDUCTION. Mode controls
which work is included, never the depth or section coverage.

**Prime directives:**

1. Zero silent failures: every failure is visible to the system, the team and the user.
2. Every error has a name: its class, trigger, handler, user result and test; flag
   catch-alls.
3. Trace the happy, nil, empty/zero and upstream-error paths of every flow.
4. Map double-clicks, navigation away, slow links, stale state and the back button.
5. Dashboards, alerts and runbooks for the shipped system are launch scope.
6. ASCII diagrams for new flows, state, pipelines, dependencies and decisions.
7. Every deferral is recorded in TODOS.md (or in chat when writing is forbidden).
8. Optimize for the 6-month future; flag future harm.
9. Propose better approaches now, including "scrap it and do this instead".

Recommendations follow the **Engineering preferences** in
[engineering.md](engineering.md), plus: new codepaths need logs, metrics or traces and
a threat model; plan partial deploys, rollbacks and feature flags; keep ASCII comments
on complex state, pipelines, requests, mixins and test setup.

**Review depth**, set from the request: **implementation-ready** (default) names
interfaces, codepaths, rescue behavior and tests; **strategy-only** (the user asks for
strategy, scope or prioritization without implementation design) uses capability-level
rows and "implementation owner must prove ___" notes in every table, never invented
method contracts; **one narrow decision** (the user names a single choice) applies every
section to that choice and its dependencies. Sections 1–10 run at every depth. To grow
strategy-only into design for one capability, ask **A)** Keep this review strategy-only
**B)** Add implementation design for <capability>; recommend A unless a concrete blocker
needs B, which permits design for that capability only. Completing prioritization never
means the implementation is ready: report what is approved, what is verified and what
remains unchosen.

**Keep the stated limits.** Record each limit's measure, value, unit and prerequisite.
Count every deliverable, including reused code, against scope limits. Changing a limit
needs evidence and an answer.

**Preserve accepted requirements.** Compare the proposed implementation with the stated
invariants and acceptance criteria and report gaps with remedies, including mechanisms
HOLD SCOPE omitted. Never weaken a guarantee, accept its violation or change a test to
expect it; low frequency, bounded impact and documentation do not meet a stricter
requirement. Changing a requirement needs explicit authority; until then keep both the
proposal and the original gap unresolved.

## Pre-review

After the shared context in [SKILL.md](SKILL.md) step 4:

- **System map.** Current system state, in-flight PRs, branches and stashes, the pain
  points this plan touches, FIXME/TODOs in touched files. From TODOS.md: prior deferrals
  related to this plan, and work it touches, blocks, unlocks or depends on.
- **Retrospective.** Scrutinize problem areas from earlier reviews harder; a recurring
  problem is an architectural concern in Section 1.
- **UI scope.** Note `ui` scope for Section 11 if accepted work adds or changes screens,
  components, interactions, frontend frameworks, user-visible states,
  mobile/responsive behavior or the design system.
- **Taste calibration** (EXPANSION and SELECTIVE): pick 2-3 well-built files or patterns
  as references and 1-2 poor ones to avoid. Report them before Step 0.
- **Landscape check.** Before challenging scope, research (Web research in
  [SKILL.md](SKILL.md)): `[product category] landscape {current year}`, `[key feature]
  alternatives`, `why [incumbent/conventional approach] [succeeds/fails]`; up to 8
  bullets per query, each with its source URL. Synthesize: Layer 1, what is tried and
  true here; Layer 2, what the results say; Layer 3, where conventional wisdom may be
  wrong. Use it in 0A and 0C; surface any eureka as differentiation in the expansion
  ceremony.

## Step 0: Scope challenge and mode

Record evidence for 0A–0C, ask 0D only for a required approach choice, select the mode
in 0E, then follow that mode's route. A **required choice** is one where continuing
unanswered would change scope, hide a blocker or produce the wrong output.

### 0A. Premise challenge

Name the real problem, the target outcome and the cost of doing nothing. Say whether
the plan solves the pain directly or only a proxy.

**Still exploring?** If the user cannot state a stable problem, says "I'm not sure", or
is exploring rather than reviewing, ask: "It sounds like you're still figuring out what
to build. That's what `/sk-brainstorming` is for. Want to pause the review, settle the
design there, then run `/sf-plan-review` again?" **A)** Yes, pause **B)** No, keep going.
On A, record Step 0A progress in the plan file so the next run skips answered
questions, then stop. On B, continue without asking again.

### 0B. Existing code leverage

Map each sub-problem to code that already solves it. For any rebuild, explain why
refactoring the existing path is worse.

**Reality rows (required):** work the rows in [reality-rows.md](reality-rows.md): every
tier 1 row (never `n/a`), and tier 2 rows for the detected scopes. Each row cites a
file:line receipt (with no linked issue, deferred-asks is `pass`); the premise table
counts `unverified=<n>`. End with one `REALITY:` line per row, then the `PLAN_REALITY`
check; repair a missing row twice, then warn at the gate.

### 0C. Dream state

Describe the 12-month ideal and whether this plan moves toward it:

```
  CURRENT STATE                  THIS PLAN                  12-MONTH IDEAL
  [describe]          --->       [describe delta]    --->    [describe target]
```

### 0D. Approach choice

When the approach is unresolved, ask through the decision procedure: **A)** the current
or requested plan, **B)** the smallest scoped alternative, **C)** a larger approach or
rewrite, offered only with evidence. Each option's description carries S/M/L/XL effort
(an option with no implementation is effort S with zero implementation work, never 0),
low/medium/high risk (one value each, never a range), reuse and verification coverage.
Weigh diff size and long-term architecture equally: state each option's immediate
changed-file cost and its future maintenance cost in the recommendation. With no
required choice, say "No new approach decision was needed" after the mode handoff.

Keep three kinds of test work apart: a code change and its required regressions travel
together; an approved change with an open test method is decided once, with every
option preserving the approved behavior; tests for existing behavior are separate,
independently selectable additions. Tests for undecided behavior stay pending.

### 0E. Mode selection

1. An explicit choice wins and skips the question: "go big", "ambitious" or "cathedral"
   is SCOPE EXPANSION; "hold scope but tempt me", "show me options" or "cherry-pick" is
   SELECTIVE EXPANSION.
2. Otherwise recommend without selecting. Count distinct planned file additions, edits
   and deletions (mark estimates; unchanged reuse is excluded from this count) and take
   the first matching rule: more than 15 changed files → SCOPE REDUCTION; categories
   overlap or are unclear → HOLD SCOPE, saying why; a new product or system → SCOPE
   EXPANSION; added capability → SELECTIVE EXPANSION; a fix or refactor → HOLD SCOPE.
   The recommendation's `because` ties a concrete plan fact to the mode's real benefit
   or tradeoff, not just the count.
3. Offer all four modes in one AskUserQuestion with that recommendation (they differ in
   kind: no completeness score) and stop for the answer. The user's choice wins.
4. **Mode handoff.** Before any other tool call, plan write or section, send one line
   filled in exactly: `Mode: <selected mode>; approved decisions: <row IDs with answer
   references, or none>. <How the mode applies and why>.` Then record provenance: the
   explicit instruction, or the question and its answer.

Selecting a mode approves no change: each proposed addition or cut, including those a
file-count threshold prompted, gets its own question. **Mode change:** pause, ask with
the four-mode menu, keep the current mode until answered; if it changes, repeat the
handoff and do the newly applicable Step 0 work, reusing completed work and answers.

| Mode | Remaining Step 0 work |
|---|---|
| SCOPE EXPANSION / SELECTIVE EXPANSION | 0F → 0G → 0H → 0I |
| HOLD SCOPE | 0G → 0I |
| SCOPE REDUCTION | 0G |

### 0F. Expansion framing (EXPANSION and SELECTIVE)

Prepare 0G's candidates, each with its user experience, the addition, S/M/L/XL effort,
risk and impact. EXPANSION frames them enthusiastically; SELECTIVE balances benefit and
tradeoff without unsupported promises. Mark one `(recommended)`; the user decides each.

### 0G. Mode-specific analysis

**SCOPE EXPANSION:**
1. **10x check:** describe 10x value for 2x effort.
2. **Platonic ideal:** what would the best engineer with unlimited time and perfect
   taste build? Start from the user's experience.
3. **Delight scan:** at least 5 adjacent 30-minute improvements that would delight users.
4. **Opt-in ceremony:** lead each proposal with the felt user experience, then its
   shape, effort and impact.

**SELECTIVE EXPANSION:** run the three HOLD SCOPE checks below with their defer/keep
decisions; then describe the 10x ambition, run the delight scan and assess platform
potential. **Cherry-pick ceremony:** present the candidates with effort and risk; with
more than 8, present the top 5–6 and offer the rest on request.

For both expansion modes, ask each addition separately, in turn: **A)** Add to this
plan's scope **B)** Defer to TODOS.md **C)** Skip. Accepted items govern the remaining
sections.

**HOLD SCOPE:**
1. Complexity: at more than 8 files or more than 2 new classes/services, challenge
   whether fewer moving parts reach the same goal.
2. Find the minimum changes for the goal; flag work deferrable without blocking it.
3. Keep stated invariants and acceptance criteria; repairs needed to meet them are in
   scope.

**SCOPE REDUCTION:** propose the minimum scope.

**Deferring current scope** (REDUCTION, HOLD, SELECTIVE's HOLD checks): ask per item
**A)** Defer this item to TODOS.md **B)** Keep it in scope. A deferral changes only
delivery scope; other approvals and limits stay as they are.

Dispositions: **Add / Keep** become accepted scope; **Defer** goes to TODOS.md with
context and to NOT in scope with its reason (postponed, not rejected); **Skip / Cut**
goes to NOT in scope with its reason, no TODO. Implementation choices inside accepted
scope stay pending until answered.

### 0H. CEO plan (EXPANSION and SELECTIVE)

Prepare the full amended working plan and a separate, consistent CEO summary; the
summary never stands in for the plan. Write the summary as its own section of the plan
file, above the terminal report, replacing this review's earlier one:

```markdown
## CEO Plan: {Feature Name}
Status: ACTIVE
Generated by sf-plan-review (CEO lens) on {date}
Branch: {branch} | Mode: {EXPANSION / SELECTIVE EXPANSION}
Repo: {owner/repo}

### Plan under review
{plan file path, or "complete text in chat; not persisted"}

### Vision
#### 10x Check
{10x vision}
#### Platonic Ideal
{EXPANSION only}

### Scope Decisions
| # | Proposal | Effort | Decision | Reasoning |
|---|----------|--------|----------|-----------|
| 1 | {proposal} | S/M/L/XL | ACCEPTED / DEFERRED / SKIPPED | {why} |

### Accepted Scope (added to this plan)
- {what is now in scope}

### Deferred to TODOS.md
- {items with context}

### Reviewer Concerns
- {unresolved spec-review issues with their owning input, or "None"}
Spec review: iterations=I issues_found=F issues_fixed=X remaining=R quality_score=S
```

**Spec review loop.** Before presenting the documents, dispatch one reviewer subagent
(blocking: `run_in_background: false` when the Agent tool offers it; otherwise wait for
its completion notice, editing nothing meanwhile) with both saved absolute paths (or
both complete texts when not persisted) and no other conversation context:

"Read both inputs in full. Evaluate them together on five dimensions: Completeness
(requirements and edge cases), Consistency (no contradictions), Clarity (implementable
without follow-up questions), Scope (no unapproved creep or YAGNI), Feasibility
(buildable with the stated approach). Flag contradictions, unsupported accepted
expansions and required behavior missing from both. Cite the input and requirement for
each finding. Return a 1-10 quality score and, per dimension, PASS or numbered issues
with suggested fixes; overall PASS only if every dimension passes. If either input is
unavailable or incomplete, report that instead of grading partial input."

- **PASS:** stop the loop.
- **Issues:** resolve new or reopened choices through the decision procedure, amend both
  documents consistently and re-dispatch with the same instructions. Stop after the third
  launch, or when consecutive reviews repeat the same unresolved issues. At the cap,
  never re-review unchanged input: list the remaining issues as numbered gaps and
  report `issues verified: k of N` against the amended text, or `N fixes unconfirmed`
  with a `spec not re-verified` note.
- **Unavailable** (launch fails, times out, or cannot read both inputs): say "Spec review
  unavailable — presenting unreviewed doc." and continue to record that outcome.

Record the `Spec review:` line with actual counts (I = launches; F, X, R = reported,
reviewer-confirmed fixed and remaining issues; S = the latest grade of both full
inputs, or `null`), and list unresolved issues under Reviewer Concerns. This record is
required whenever writing is permitted, even when the reviewer failed.

Then present both documents and ask (an admin question): **A)** Approve these documents
and continue to 0I **B)** Revise them **C)** Pause this review. Recommend A only if both
reflect the exact decisions. A approves these versions only, never pending amendments or
implementation; B resolves the changes through the decision procedure and asks again; C
stops.

### 0I. Temporal interrogation (EXPANSION, SELECTIVE, HOLD)

Resolve scope and feasibility blockers now; leave other design choices pending unless
the user asked for implementation planning.

```
  HOUR 1 (foundations):     What does the implementer need to know?
  HOUR 2-3 (core logic):    What ambiguities will they hit?
  HOUR 4-5 (integration):   What will surprise them?
  HOUR 6+ (polish/tests):   What will they wish they'd planned for?
```

Save the sequence, blockers and pending choices with human and agent effort.

## Review sections

Before Section 1, publish **Current scope** in chat: the selected mode and its
rationale, each governing row's ID, disposition and answer reference, and the accepted,
deferred, rejected and pending work. This is a scope update, not another handoff.

Sections 1–10 run for every plan; Section 11 runs with `ui` scope, else record
`SKIPPED (no UI scope)`. In strategy-only depth, diagrams and maps show candidate
boundaries, failure mechanisms, feasibility conditions and unresolved risks; material
blockers are resolved now, non-blocking implementation choices stay pending with an
owner and required verification. A recommended remedy is complete for its issue (rescue
behavior, verification, failure visibility) and excludes unrelated work.

| Step | SCOPE EXPANSION | SELECTIVE EXPANSION | HOLD SCOPE | SCOPE REDUCTION |
|---|---|---|---|---|
| Scope proposals | additions, each opt-in | cherry-picks, each opt-in | none | cuts, each opt-in |
| 10x check | required | required | skip | skip |
| Platonic ideal | required | skip | skip | skip |
| Delight opportunities | at least 5, opt-in | at least 5, opt-in | skip | skip |
| Complexity | accepted ambition | baseline + accepted additions | simplest correct scope | minimum valuable scope |
| 0I temporal | run | run | run | skip |
| 0H CEO plan | write | write | skip | skip |
| Section 10 | accepted trajectory | accepted cherry-picks | maintainability | maintainability of what remains |
| Section 11 | if UI scope | if UI scope | if UI scope | if UI scope |

### Section 1: Architecture

Evaluate and diagram:
- System design and component boundaries; draw the dependency graph.
- Data flow, all four paths, as an ASCII diagram for every new flow: happy (data flows
  correctly), nil (input missing), empty (present but zero-length), error (upstream
  call fails).
- State machines: an ASCII diagram for every new stateful object, including impossible
  transitions and what prevents them.
- Coupling: what new coupling exists and is it justified? Before/after dependencies.
- Scaling: what breaks first at 10x and 100x load?
- Single points of failure, mapped.
- Security architecture: auth boundaries, data access, API surfaces. For each new
  endpoint or mutation: who can call it, what do they get, what can they change?
- Production failures: one realistic failure per integration point, and whether the
  plan handles it.
- Rollback posture: if this ships broken, the rollback path and its time.
- **Value of artifacts about the work.** When the plan adds a status report, audit
  matrix, certificate, meta-report or conformance check that nothing consumes, ask:
  who uses it, what decision or behavior changes because it exists, why this is the
  smallest useful version, and when it retires. An explicit user request answers the
  first two (record it as provenance); the last two still need answers. A credible,
  named preventive risk is a valid answer without prior occurrence. Inventing a code
  consumer to pass the question is the pathology. Product observability (dashboards,
  alerts, runbooks), user-facing docs and agent-consumed instructions are product,
  never process artifacts.

EXPANSION and SELECTIVE add: what would make this architecture elegant and obvious to
a new engineer? What infrastructure makes it a platform for later features? SELECTIVE
also re-checks each accepted cherry-pick's architectural fit and flags coupling: a
chance to revisit with new information.

Required: an ASCII diagram of the full system showing new components and their
relationships to existing ones.

### Section 2: Error and rescue map

The section that catches silent failures. Implementation-ready depth maps every new
method, service or codepath that can fail; strategy-only maps each retained capability,
integration or data boundary. Same table shape for both:

```
  METHOD/CODEPATH          | WHAT CAN GO WRONG           | EXCEPTION CLASS
  -------------------------|-----------------------------|-----------------
  ExampleService#call      | API timeout                 | TimeoutError
                           | API returns 429             | RateLimitError
                           | malformed JSON              | JSONParseError

  EXCEPTION CLASS              | RESCUED?  | RESCUE ACTION          | USER SEES
  -----------------------------|-----------|------------------------|------------------
  TimeoutError                 | Y         | Retry 2x, then raise   | Temporary outage
  RateLimitError               | Y         | Backoff + retry        | Transparent
  JSONParseError               | N ← GAP   | —                      | 500 error ← BAD
```

- Catch-all handling (`rescue StandardError`, `catch (Exception e)`, `except
  Exception`) is a smell: name the specific exceptions.
- Generic-only logging is not enough: log what was attempted, with what arguments, for
  which user or request.
- Every rescued error retries with backoff, degrades gracefully with a user-visible
  message, or re-raises with added context. Swallow-and-continue is almost never
  acceptable.
- Each GAP gets its rescue action and what the user should see.
- LLM/AI calls: malformed, empty, invalid-but-plausible JSON and refusals are distinct
  failure modes.

### Section 3: Security and threat model

Its own section, never a sub-bullet of architecture:
- Attack surface: new endpoints, parameters, file paths, background jobs.
- Input validation for every new input: nil, empty string, string where an integer is
  expected, over max length, unicode edge cases, HTML/script injection. Rejected loudly?
- Authorization for every new data access: scoped to the right user or role? Can user A
  reach user B's data by changing an ID?
- Secrets: new ones in env vars, never hardcoded; rotatable?
- Dependency risk: new packages and their security record.
- Data classification: PII, payment data, credentials; handled like existing patterns?
- Injection: SQL, command, template, LLM prompt; check all.
- Audit logging for sensitive operations.

Each finding states the threat, likelihood (High/Med/Low), impact (High/Med/Low) and
whether the plan mitigates it.

### Section 4: Data flow and interaction edge cases

**Data flow tracing.** For every new flow, an ASCII diagram of `INPUT → VALIDATION →
TRANSFORM → PERSIST → OUTPUT` with shadow paths for nil/empty/wrong type,
invalid/too long, exception/timeout/OOM, conflict/duplicate/lock, and
stale/partial/encoding. For each node: what happens on each shadow path, and is it
tested?

**Async ordering**, for flows that share mutable state:
1. **Define the boundary.** State the invariant and its exact caller/time boundary.
   Draw one combined schedule: a column per operation and one for shared state.
2. **Exercise both orders.** For each pair of overlapping awaits that can affect the
   invariant, show both completion orders: at each relevant `await`, callback or job
   handoff, pause, let a competitor complete, resume, then start a fresh consumer.
   Exclude an order only by naming the mechanism that prevents it.
3. **Compare.** Show the observed result against the invariant; the invariant is a
   requirement, not proof. If safe, name the preventing mechanism. Separate diagrams,
   one favorable schedule, single-threaded execution and atomic calls do not prove
   ordering across awaits. An accepted exception needs its exact contract clause;
   bounded damage is not enough.
4. **Regression proof.** Test the relevant orders with controlled pause/release points;
   relevant pairs, not exhaustive permutations.

**Interaction edge cases.** For every new user-visible interaction: `INTERACTION | EDGE
CASE | HANDLED? | HOW?`, covering double-click and stale submit, navigate away, timeout
and retry, zero/large/changing lists, and failed, duplicate or backlogged jobs. Each
unhandled case is a gap with its fix.

### Section 5: Code quality

- Organization and module structure: does new code fit existing patterns?
- Duplicated behavior: the same logic elsewhere, with file and line (similar-looking
  code alone is no reason to extract).
- Naming: classes, methods and variables named for what they do, not how.
- Error-handling patterns (Section 2 maps the specifics; this reviews the patterns).
- Missing edge cases: nil, empty, 429s and timeouts, boundary values.
- Over-engineering: abstractions for problems that do not exist yet.
- Under-engineering: happy-path fragility, missing defensive checks.
- Cyclomatic complexity: flag any new method branching more than 5 times; propose the
  refactor.

### Section 6: Tests

Carry requested or approved coverage forward without re-asking. For an unresolved test
method or extra verification depth, name the regression existing tests miss and resolve
it through the decision procedure before prescribing it; an approved runtime contract
alone does not choose extra verification.

Diagram everything new: UX flows, data flows, codepaths, background and async work,
integrations and external calls, error and rescue paths (from Section 2). For each item:
which test type (unit, integration, system, E2E); does the plan have the test (if not,
draft its header within approved coverage and keep new proposals pending); the
happy-path test; the failure-path test (which failure); the edge-case test (nil, empty,
boundary, concurrent access).

For each behavior, check the assertion:
1. **Map the requirement.** Name its observable assertion, a wrong result it rejects,
   and its `no_claim`: one sentence on what a green result does not prove and which
   fixtures or mocks stand in for what (`no_claim=provider acceptance (mocked provider;
   unit only)`, or `no_claim=none beyond protects`). Write it yourself, never ask the
   user for it, and never let it waive a required live check. Map the assertion to the
   user's exact requirement or approved remedy; translate counts, conditions and
   quantifiers exactly, never weakening an exact count to a lower bound.
2. **Reuse settled proof.** Selecting an existing probe or spelling out a determined
   check is implementation work, not another approval. Verify the caller's path: helper
   coverage alone does not prove it.
3. **Resolve real gaps.** Explain what the existing requirement fails to cover before
   calling a check missing. Ask only for an unresolved behavioral choice, a new outcome
   or an independent uncovered failure mode. Never silently add, defer or waive a
   missing behavioral assertion.

Ambition, in every mode: the test that would make you confident shipping at 2am on a
Friday; the test a hostile QA engineer would write to break this; the chaos test.
Pyramid: many unit, fewer integration, few E2E, or inverted? Flakiness: flag tests on
time, randomness, external services or ordering. Load tests for frequently called or
data-heavy paths. LLM/prompt changes: if the plan touches the "Prompt/LLM changes" file
patterns in CLAUDE.md, state which eval suites must run, which cases to add and which
baselines to compare.

### Section 7: Performance

- N+1 queries: for ORM access, especially association traversal, preload or batch
  rather than query in a loop.
- Memory: the production maximum of every new data structure.
- Indexes for every new query.
- Caching for every expensive computation or external call.
- Background jobs: worst-case payload, runtime and retry behavior.
- The top 3 slowest new codepaths and their estimated p99.
- Connection pool pressure: new DB, Redis and HTTP connections.

### Section 8: Observability and debuggability

- Structured logs at entry, exit and each significant branch of every new codepath.
- A metric that says each new feature works, and one that says it broke.
- Trace IDs propagated across new cross-service or cross-job flows.
- New alerts; day-1 dashboard panels.
- A bug reported 3 weeks after ship: can logs alone reconstruct what happened?
- Admin tooling for new operational tasks.
- A runbook response for each new failure mode.

EXPANSION and SELECTIVE add: what observability would make this a joy to operate
(SELECTIVE includes the accepted cherry-picks)?

### Section 9: Deployment and rollout

- Migrations: backward-compatible, zero-downtime, table locks?
- Feature flags for any part?
- Rollout order: migrate first, deploy second?
- An explicit, step-by-step rollback plan.
- The deploy window when old and new code run together: what breaks?
- Environment parity: tested in staging?
- Post-deploy checks for the first 5 minutes and the first hour; automated smoke tests.

EXPANSION and SELECTIVE add: what deploy infrastructure would make shipping this
routine (SELECTIVE: do accepted cherry-picks change the deployment risk)?

### Section 10: Long-term trajectory

- Debt introduced: code, operational, testing, documentation.
- Path dependency: does this make future changes harder?
- Knowledge concentration: enough documentation for a new engineer?
- Reversibility, 1-5: 1 = one-way door, 5 = easily reversible.
- Ecosystem fit with this repo's framework conventions.
- The 1-year question: is this obvious to a new engineer in 12 months?

EXPANSION and SELECTIVE add: what comes after this ships (phase 2, phase 3) and does
the architecture support it? Platform potential for other features. SELECTIVE only: were
the right cherry-picks accepted, and did any rejected expansion turn out load-bearing?

### Section 11: Design and UX (only with UI scope)

The CEO calling in the designer: not a pixel audit (that is the Design lens), but
design intentionality.

- Information architecture: what the user sees first, second, third.
- Interaction state coverage: `FEATURE | LOADING | EMPTY | ERROR | SUCCESS | PARTIAL`.
- User journey coherence: storyboard the emotional arc.
- AI slop risk: does the plan describe generic UI patterns?
- DESIGN.md alignment.
- Responsive intention: is mobile designed or an afterthought?
- Accessibility basics: keyboard, screen readers, contrast, touch targets.

EXPANSION and SELECTIVE add: what would make this UI feel inevitable? Which 30-minute
touches would make users think "oh nice, they thought of that"?

Required: an ASCII user flow of screens, states and transitions. With significant UI
scope, recommend the Design lens before implementation, and a Design lens pass on the
live site after implementation for issues only rendered output shows.

## Outside voice

Run step 6 of [SKILL.md](SKILL.md) with the complete current working plan as THE PLAN
and the CEO summary when this mode wrote one.

## TODOs in this lens

Keep the selected mode. In HOLD SCOPE, a TODO must address an evidenced gap in accepted
scope or its required correctness and operability; hypothetical capacity, optional
features and alternatives to an adequate approved remedy are expansions, even labeled as
TODOs, and are not raised. Still audit observability and performance against the
requirements and ask each real deferred gap individually. Expansion modes keep their
expansion scan. A rough backlog estimate maps human to agent size as S→S, M→S, L→M,
XL→L (size categories, not time ratios); refine it from the Implementation Tasks
estimates. Option C applies only to work already within accepted scope in HOLD SCOPE
and SCOPE REDUCTION.

## Lens outputs

In the plan body, from approved changes only:

- **Reality rows:** the `REALITY:` lines and the `PLAN_REALITY` line, above the summary.
- **Dream state delta:** where this plan leaves us relative to the 12-month ideal.
- **Error & Rescue Registry** (from Section 2), at the approved depth: every method that
  can fail with its exception classes, rescue status and action, and user impact; or,
  strategy-only, capability rows with failure mechanisms, user impact, known safeguards
  and an owner who must verify each unknown. One narrow decision: its dependencies only.
- **Failure Modes Registry:**

  ```
    CODEPATH | FAILURE MODE   | RESCUED? | TEST? | USER SEES?     | LOGGED?
    ---------|----------------|----------|-------|----------------|--------
  ```

  A row with RESCUED=N, TEST=N and USER SEES=Silent is a **CRITICAL GAP**. Strategy-only
  rows name the capability and mark unknown coverage with its verification owner.
- **Scope Expansion Decisions** (EXPANSION and SELECTIVE): accepted, deferred and
  skipped items, referencing the CEO plan's record without asking again.
- **Diagrams**, every one that applies: system architecture, data flow with shadow
  paths, state machine, error flow, deployment sequence, rollback flowchart.
- **Stale diagram audit:** every ASCII diagram in files this plan touches; still
  accurate?
- **Implementation Tasks** within the approved depth: implementation-ready tasks
  describe the build; strategy-only tasks name the next research, design or
  verification action and its owner, never implementation contracts. Known files only,
  else "to be determined"; each with a concrete verification step.
- **Completion summary.** Lake score: among answered questions scored for coverage that
  offered a 10/10 option (a reopened choice counted once, by its latest answer), X chose
  it out of Y; `N/A` when Y is 0.

```
  +====================================================================+
  |            CEO PLAN REVIEW — COMPLETION SUMMARY                    |
  +====================================================================+
  | Mode selected        | [full mode name from 0E]                    |
  | System audit         | [key findings]                              |
  | Step 0               | [mode + key decisions]                      |
  | Section 1  (Arch)    | ___ issues found                            |
  | Section 2  (Errors)  | ___ error paths mapped, ___ GAPS            |
  | Section 3  (Security)| ___ issues found, ___ High severity         |
  | Section 4  (Data/UX) | ___ edge cases mapped, ___ unhandled        |
  | Section 5  (Quality) | ___ issues found                            |
  | Section 6  (Tests)   | diagram produced, ___ gaps                  |
  | Section 7  (Perf)    | ___ issues found                            |
  | Section 8  (Observ)  | ___ gaps found                              |
  | Section 9  (Deploy)  | ___ risks flagged                           |
  | Section 10 (Future)  | reversibility: _/5, debt items: ___         |
  | Section 11 (Design)  | ___ issues / SKIPPED (no UI scope)          |
  +--------------------------------------------------------------------+
  | NOT in scope         | written (___ items)                         |
  | What already exists  | written                                     |
  | Dream state delta    | written                                     |
  | Error/rescue registry| ___ rows, ___ CRITICAL GAPS                 |
  | Failure modes        | ___ total, ___ CRITICAL GAPS                |
  | TODOS.md updates     | ___ items proposed                          |
  | Scope proposals      | ___ proposed, ___ accepted (EXP + SEL)      |
  | CEO plan             | written / not persisted / skipped by mode   |
  | Outside voice        | completed / unavailable / disabled          |
  | Lake score           | X/Y chose the complete option               |
  | Diagrams produced    | ___ (list types)                            |
  | Stale diagrams found | ___                                         |
  | Unresolved decisions | ___ (listed below)                          |
  | Reality rows         | ___/___ rows (PLAN_REALITY), ___ unverified |
  +====================================================================+
```

## Report row

- **Fields:** `status`, `unresolved`, `critical_gaps` (Failure modes CRITICAL GAPS),
  `mode` (SCOPE_EXPANSION / SELECTIVE_EXPANSION / HOLD_SCOPE / SCOPE_REDUCTION),
  `scope_proposed`, `scope_accepted`, `scope_deferred` (0 in HOLD and REDUCTION),
  `commit` (`git rev-parse --short HEAD`), timestamp in UTC ISO 8601.
- **Status:** `clean` with 0 unresolved decisions and 0 critical gaps; otherwise
  `issues_open`.
- **Findings cell:** "{scope_proposed} proposals, {scope_accepted} accepted,
  {scope_deferred} deferred"; with no scope fields, "mode: {mode}, {critical_gaps}
  critical gaps".

## Next steps

From the published readiness:

- **Engineering lens:** the required shipping gate. Stress that a fresh one is needed
  when this review expanded scope, changed architectural direction or accepted
  expansions; an existing Eng row whose commit predates this review may be stale.
- **Design lens:** when Section 11 ran or accepted expansions are UI-facing; flag a stale
  design row. Skip in SCOPE REDUCTION.
- Both needed: Engineering first.

Ask with the applicable options: **A)** Run the Engineering lens next (required gate)
**B)** Run the Design lens next **C)** Skip — I'll handle reviews manually.

**Design doc promotion** (EXPANSION and SELECTIVE, when the vision produced a compelling
direction): "The vision from this review produced {N} accepted scope expansions. Want to
promote it to a design doc in the repo?" **A)** Promote to `{FEATURE}.md` in the designs
folder **B)** Keep it in the plan file only **C)** Skip. On A, with writes permitted, copy
the CEO plan to `{FEATURE}.md` in the designs folder that
[work-docs.md](../../references/work-docs.md) resolves (create it if needed) and set the
CEO plan's `Status` to `PROMOTED`; otherwise present it marked not persisted and claim no
promotion.
