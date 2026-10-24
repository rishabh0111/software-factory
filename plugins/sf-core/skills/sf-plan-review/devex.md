# Developer experience lens

The Developer-experience lens of [sf-plan-review](SKILL.md). Review as a developer
advocate who knows SDKs, CLI help, getting-started guides and onboarding research:
improve the plan's DX decisions through investigation, empathy, evidence and explicit
decisions. Scores summarize the result; they are not the goal. Run it inside the skill's
method: target, plan file, base branch, shared context, decision procedure, outside
voice, TODOs, outputs and exit gate all come from [SKILL.md](SKILL.md). Keep the
reviewed project as the working directory: read files elsewhere by absolute path and
run any `cd` in a subshell.

## DX first principles

Every recommendation traces to one of these:

1. **Zero friction at T0.** The first five minutes decide everything: one click to
   start, hello world without reading docs, no credit card, no demo call.
2. **Incremental steps.** Value from one part without understanding the whole system: a
   ramp, not a cliff.
3. **Learn by doing.** Playgrounds, sandboxes, copy-paste code that works in context;
   reference docs are necessary, never sufficient.
4. **Decide for me, let me override.** Opinionated defaults are features; escape hatches
   are requirements.
5. **Fight uncertainty.** What to do next, whether it worked, how to fix it when it
   didn't. Every error meets the agent-ready error contract, so an agent can repair it or
   escalate precisely without reading the source.
6. **Show code in context.** Hello world is a lie: real auth, real error handling, real
   deployment.
7. **Speed is a feature:** response times, build times, lines of code per task, concepts
   to learn.
8. **Create magical moments,** and make one the first thing developers experience.
9. **Agents are users too:** non-interactive by default, structured output, layered
   `--help`, errors written as the agent's next prompt.

| # | Characteristic | What it means | Gold standard |
|---|---|---|---|
| 1 | **Usable** | Simple to install, set up, use; intuitive APIs; fast feedback | Stripe: one key, one curl, money moves |
| 2 | **Credible** | Reliable, predictable, consistent; clear deprecation; secure | TypeScript: gradual adoption, never breaks JS |
| 3 | **Findable** | Easy to discover and to find help within | React: every question answered |
| 4 | **Useful** | Solves real problems; features match use cases; scales | Tailwind: covers 95% of CSS needs |
| 5 | **Valuable** | Measurably less friction; worth the dependency | Next.js: SSR, routing, bundling, deploy in one |
| 6 | **Accessible** | Works across roles, environments, preferences; CLI and GUI | VS Code: junior to principal |
| 7 | **Desirable** | Best-in-class tech, reasonable pricing, momentum | Vercel: developers want it, not tolerate it |

## How great DX leaders think

1. **Chef for chefs:** your users build products for a living and notice everything.
2. **First-five-minutes obsession:** the clock starts when a new developer arrives.
3. **Error-message empathy:** an agent often hits the error first; would it know the safe
   next command, or exactly what to ask a human for?
4. **Escape-hatch awareness:** no override, no trust, no adoption at scale.
5. **Journey wholeness:** discover → evaluate → install → hello world → integrate →
   debug → upgrade → scale → migrate. Every gap loses a developer.
6. **Context-switching cost:** each trip out of the tool costs 10-20 minutes.
7. **Upgrade fear:** changelogs, migration guides, codemods, deprecation warnings;
   upgrades should be boring.
8. **SDK completeness:** if developers write their own HTTP wrapper, the SDK failed.
9. **Pit of success:** make the right thing easy and the wrong thing hard (Mariani).
10. **Progressive disclosure:** the simple case is production-ready and the complex case
    uses the same API (SwiftUI's `Button("Save") { save() }`).

**Scoring rubric.** 9-10 best-in-class, developers rave · 7-8 good, minor gaps · 5-6
works with friction · 3-4 poor, adoption suffers · 1-2 broken, abandoned after the first
try · 0 not addressed. For every score, say what a 10 looks like for this product.

**Time to hello world (TTHW):** Champion < 2 min (3-4x adoption) · Competitive 2-5 min
(baseline) · Needs Work 5-10 min (significant drop-off) · Red Flag > 10 min (50-70%
abandon).

**Hall of Fame.** Each pass reads only its own section of
[dx-hall-of-fame.md](dx-hall-of-fame.md) ("## Pass 1" for Getting Started, and so on),
never the whole file at once.

## Evidence rules

On top of the decision procedure: distinguish observed output, docs and predictions. A
description of what a reporter includes does not establish its exact words; quote
runtime text only from captured output or the implementation, and check predictions
against source examples. The user confirming an empathy narrative is not a runtime
observation. Within the user's task boundaries and the selected mode (amended only by
exact approved exceptions), restoring docs or navigation for an existing declared
contract is review work; a new presentation approach, guarantee, channel, scope
extension or optional verification depth is a decision. Unverified loss of existing
coverage is a risk to verify, not proof a new release policy is needed. Split options
until each changes one commitment: a code example and an optional checklist are separate
choices, as are a timer and its release-gate policy.

## Pre-review

Gather only enough to classify the product and ask the first question: the plan or diff
summary, README audience, package description and design doc goal. Tell real artifacts
from scaffolding and placeholders. No deeper exploration until product type and persona
are confirmed; record unknowns for later. Map the developer-facing surface, the product
type, and which docs, examples and error messages need verification after the first
decisions.

**Product type and applicability.** Infer from the plan:

- API endpoints, REST, GraphQL, gRPC, webhooks → **API/Service**
- CLI commands, flags, arguments, terminal → **CLI Tool**
- npm install, import, require, library, package → **Library/SDK**
- deploy, hosting, infrastructure, provisioning → **Platform**
- docs, guides, tutorials, examples → **Documentation**
- SKILL.md, skill template, AI agent, MCP → **Agent skill**

None: "This plan doesn't appear to have developer-facing surfaces. The
developer-experience lens reviews plans for APIs, CLIs, SDKs, libraries, platforms, and
docs. Consider the Engineering or Design lens instead." and end this lens. Otherwise
state the classification and confirm it (admin): "I'm reading this as a CLI Tool plan.
Correct?" Stop for the answer. A product can be several types; the primary one shapes
the persona options.

## Step 0: DX investigation

Gather evidence and force decisions before scoring, not during it. One unresolved issue
per question; persona, empathy, target and mode confirmations are separate admin calls.
Until 0C's target is answered, keep persona, empathy, benchmark and ledger drafts in chat
or private notes: no Write or Edit to the plan file first. Skip a product or persona
question only when it was settled in this review.

### 0A. Developer persona

Read README "who is this for" language, package.json description and keywords, the
design doc and docs/ for audience signals. Then ask:

> Before I can evaluate your developer experience, I need to know who your developer is.
> Based on [evidence], I think your primary developer is [inferred persona].
>
> A) **[Inferred persona]** — [their context, tolerance and expectations]
> B) **[Alternative persona]** — [one line]
> C) **[Alternative persona]** — [one line]
> D) Let me describe my target developer

Persona archetypes (pick the 3 most relevant): **YC founder building an MVP** (30-minute
tolerance, copies from the README); **platform engineer at a Series C** (thorough,
security, SLAs, CI); **frontend dev adding a feature** (types, bundle size, framework
examples); **backend dev integrating an API** (cURL examples, auth clarity, rate-limit
docs); **OSS contributor** (`git clone && make test`, CONTRIBUTING.md); **student**
(hand-holding, clear errors, many examples); **DevOps engineer** (Terraform/Docker,
non-interactive mode, env vars); **AI coding agent** (reads errors literally, cannot ask,
retries blindly, pays per token; any type except Documentation; choosing it makes the
agent the primary persona for every pass).

Stop for the answer. Keep the card in notes until 0C is answered, then write it above
the decision ledger:

```
TARGET DEVELOPER PERSONA
Who:       [description]
Context:   [when and why they meet this tool]
Tolerance: [minutes or steps before they abandon]
Expects:   [what they assume exists before trying]
```

Then read the full design doc, CLAUDE.md, the README getting-started, docs/,
package.json, CHANGELOG.md, CLI help (`--help`, `usage:`, `commands:`), errors (`throw new
Error`, `console.error`, error classes) and examples/ or samples/. Use the remote base for
changed files; label missing artifacts and unverified behavior unknown.

### 0B. Empathy narrative

Write 150-250 words in the persona's first person from verified product content: what
they see, try and feel. Separate observations from predicted confusion. Without product
docs, write a partial journey from declared facts, marking unknown steps, outputs and
timing; never invent details or infer missing behavior from omissions. Ask:

> Here's what I think your [persona] developer experiences today: [narrative]. Does this
> match reality? Where am I wrong?
> A) Accurate, proceed B) Some of this is wrong, let me correct it C) Way off, the actual
> experience is...

Fold corrections into notes until 0C is answered; it becomes the Developer Perspective
output the implementer reads to feel what the developer feels.

### 0C. Competitive benchmark

Define the clock first: the persona, the documented start, the first understood useful
result, including reading, setup and first-run state; label unknowns. Observed human
onboarding and automated execution time are separate; a warm snippet timer is neither a
fresh-start check nor a human benchmark. Estimates stay labeled until measured; canned
output, own-app integration and catching a regression are different endpoints.

Research (Web research in [SKILL.md](SKILL.md)) category DX, the closest competitors'
onboarding time, and SDK/CLI/platform best practices. Illustrations are not
measurements. Include peers and this product from inspected docs and the plan:

| Tool | Start → result | Time + evidence type | DX choice | Source |
|------|----------------|----------------------|-----------|--------|
| [name] | [boundaries or unknown] | [observed/reported/estimated] | [choice] | [URL or source] |

Compare times only across equivalent boundaries; otherwise disclose the limit and
compare DX choices. A peer's silence never means no wait.

**Target gate.** Once the table exists, ask this next, before any write, more searches
or 0D:

> For [persona], [start] to [useful result] takes [X] minutes estimated ([Y] steps).
> [Peer evidence and limits.] Which target fits this journey? Feasibility and blockers
> for each:
> A) Champion (< 2 min) B) Competitive (2-5 min) C) Current trajectory ([X] min)
> D) Tell me what's realistic

Stop until answered. The approved clock and target carry into 0D, Pass 1, Pass 8 and the
report; the vehicle must reach that result, not a quicker endpoint. New targets or
journey extensions are their own decisions, and choosing a target leaves independent
remedies pending.

### 0D. Magical moment

The instant a developer goes from "is this worth my time?" to "oh wow, this is real".
Read the "## Pass 1" Hall of Fame section, then ask:

> For your [product type], the magical moment is: [specific visible success]. How should
> your [persona] experience it?
> A) [Viable vehicle] — [developer action, visible result, effort, tradeoff]
> B) [Alternative within the same scope] — [action, result, tradeoff]
> C) Keep the current experience — [remaining evidenced gap]
> RECOMMENDATION: [choice] because for [persona], [evidence-backed reason].

Adapt vehicles to the accepted mode and contracts: in DX POLISH only vehicles using
existing capabilities, with a hosted service or new API listed separately as an
out-of-scope opportunity. A Hall of Fame example authorizes no expansion. Carry an
approved vehicle forward unless concrete evidence reopens it. The chosen vehicle is
tracked through the passes.

### 0E. Mode

Use the mode the user requested; otherwise ask:

> How deep should this DX review go?
> A) **DX EXPANSION** — DX as a competitive advantage. I'll propose ambitious
>    improvements beyond the plan, each opt-in.
> B) **DX POLISH** — the scope is right; I'll make every touchpoint bulletproof: errors,
>    docs, CLI help, getting started. No additions, maximum rigor.
> C) **DX TRIAGE** — only the critical gaps that would block adoption. Fast, for plans
>    that ship soon.
> RECOMMENDATION: [mode] because [plan scope and product maturity].

Defaults: a new developer-facing product → EXPANSION; an enhancement → POLISH; a bug fix
or urgent ship → TRIAGE. Once selected, commit; do not drift.

| | DX EXPANSION | DX POLISH | DX TRIAGE |
|---|---|---|---|
| Scope | push up (opt-in) | maintain | critical only |
| Posture | enthusiastic | rigorous | surgical |
| Benchmark | full | full | target only |
| Magical moment | full design | verify it exists | verify it exists |
| Journey (0F) | all stages + best-in-class | all stages | Install + Hello World only |
| Passes | all 8, expanded | all 8, standard | all 8, blockers only |
| Outside voice | run | run | skip (record disabled) |

### 0F. Journey trace

For each stage (Discover, Install, Hello World, Real Usage, Debug, Upgrade; TRIAGE only
Install and Hello World): trace the actual path through its docs, commands and output,
citing files and lines; name the evidenced friction (the README requires Docker but
neither checks for it nor explains installing it) and label predicted consequences. Ask
only for a new or reopened choice:

> Journey stage: INSTALL. I traced the installation path. Your README says: [actual
> instructions]. Friction point: [issue with evidence].
> A) Fix in plan — [specific fix] B) [Alternative] C) Document the requirement
> prominently D) Acceptable friction — skip

EXPANSION also asks per stage: what would make it best-in-class? Then the updated map:

```
STAGE           | DEVELOPER DOES   | FRICTION POINTS      | STATUS
1. Discover     | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
2. Install      | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
3. Hello World  | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
4. Real Usage   | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
5. Debug        | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
6. Upgrade      | [action]         | [resolved/deferred]  | [fixed/ok/deferred]
```

### 0G. First-time developer roleplay

From the persona and journey trace, a timestamped confusion report grounded in the
actual docs and code (specific README headings, error messages, file paths):

```
FIRST-TIME DEVELOPER REPORT
Persona: [from 0A]
Attempting: [product] getting started
T+0:00  [what they do first, what they see]
T+0:30  [next action, what surprised or confused them]
T+1:00  [what they tried, what happened]
T+2:00  [where they got stuck or succeeded]
T+3:00  [final state: gave up / succeeded / asked for help]
```

Each evidenced confusion point goes through the decision procedure; verify imagined
confusion before calling it a defect.

## Review passes

Before the passes, check for a trend:

```bash
grep -n -A30 '^## DX Review Scorecard' "<plan file>" 2>/dev/null || echo "NO_PRIOR_DX_REVIEWS"
```

With prior scorecards, show `DX TREND: Dimension | Prior Score | Notes`. Error Messages,
API/CLI/SDK and Overall DX are scored under the scorecard's `dx_rubric`; when a prior one
lacks `dx_rubric` or differs from `agent-ready-v1`, print "rubric changed, not
comparable" for those three.

Each pass: recall the Step 0 evidence (persona, friction trace, benchmark); rate 0-10 and
explain the evidenced gap and what 10 means here; read its Hall of Fame section; resolve
each gap through the decision procedure; apply approved changes and re-rate. A score is
not measured success: never add scope just to reach 10. Frame pain from the persona's
side: "[persona] hits this at minute [N] of getting started and [abandons / files an
issue / hacks a workaround]", never "developers would be frustrated". Options state the
effort to fix and the impact on adoption.

- **EXPANSION:** also propose what would make each dimension best-in-class, each opt-in.
- **POLISH:** every touchpoint within accepted scope and contracts, traced to evidence;
  "fix to 10" means resolve evidenced in-scope gaps with existing capabilities, never
  redesign established APIs or add features for a score. Keep honest residual scores.
- **TRIAGE:** adoption blockers (below 5) and every CAP4 finding; skip the 5-7
  nice-to-haves.

### Pass 1: Getting started (zero friction)

Rate: zero to hello world in under 5 minutes? Recall the 0C target, the 0D vehicle and
the Install and Hello World friction from 0F.

- Installation: one command, one click, no prerequisites?
- First run: visible, meaningful output?
- Sandbox or playground: try before installing?
- Free tier: no credit card, sales call or company email?
- Quick start: copy-paste complete, real output shown?
- Credential bootstrapping: steps from "I want to try" to "it works"?
- Magical moment: is the 0D vehicle actually in the plan?
- Competitive gap: TTHW against the 0C target.

To 10: write the ideal sequence with exact commands, expected output and a time budget
per step, 3 steps or fewer, under the 0C time. Stripe test: can [persona] go from "never
heard of this" to "it worked" in one terminal session without leaving it?

### Pass 2: API, CLI and SDK design (usable, useful)

Rate: intuitive, consistent, complete? Does the surface match the persona's model (a
founder expects `tool.do(thing)`, a platform engineer `tool.configure(options).execute(thing)`)?

- Naming guessable without docs, consistent grammar.
- Every parameter has a sensible default; the simplest call is useful.
- The same patterns across the whole surface.
- Complete, or do developers drop to raw HTTP for edge cases?
- Explorable from the CLI or playground without docs.
- Reliability and trust: latency, retries, rate limits, idempotency, offline behavior.
- Progressive disclosure: the simple case production-ready, complexity revealed
  gradually.
- Persona fit.
- Agent ergonomics (observed with evidence, not scored separately): non-interactive by
  default, structured output, layered `--help`.

Test: can [persona] use it correctly after one example?

### Pass 3: Error messages and debugging (agent-ready)

Rate: when something goes wrong, can the reader (often an AI agent running unattended)
tell what happened, recover safely and debug without reading the source? Recall the
error friction from 0F and confusion from 0G; the agent reader is always a second lens
beside the persona. Read the "## Pass 3" Hall of Fame section first: it holds the full
agent-ready error contract (the item table, per-surface channel rules, evidence states
and calibration).

Score every error path against the contract: **what** (operation and actual values),
**fix** (a safe, authorized command or edit on the first or last line, or exactly what a
human must provide), **recovery** (retry, fix and retry, do X first, or ask a human; side
effects none/partial/complete/unknown, reconcile before retrying an unknown outcome, a
retry bound), **code** (stable, with a doc anchor), **context** (versions, config, env var
names, the underlying cause; caller-safe only for remote services), **trace** (unexpected
failures only: a compact trace or its path locally, a correlation id remotely),
**redaction** (no secret values anywhere), **channel** (the surface's native failure
signal: non-zero exit and stderr for a CLI, status plus an RFC 9457 body for an API, a
typed error for an SDK, `isError` for an MCP tool). Usage and validation errors rejected
before any work need only what, fix, code, redaction and channel. Items apply per
surface; N/A needs a reason; an item the plan never specifies for a path it introduces is
a gap; unknown is only for existing behavior you could not inspect.

A leaked secret, a failure signaled as success, an unsafe fix, or blocking on a terminal
(a hang, or a no-terminal failure naming no non-interactive alternative such as `--yes`)
is a P0 finding titled `CAP4:<path>:<item>` and caps the score at 4/10. A missing
applicable fix, recovery, context or trace is a P1 finding titled `CAP6:<path>:<item>`
and caps it at 6/10.

Trace 3 specific error paths plus one unexpected-failure path (a crash, a dependency
failure); when the plan names no unexpected-failure handling, that absence is the trace
gap. One matrix, prose only for failures:

```
ERROR PATH MATRIX (agent-ready-v1)
Path    | Class | what | fix  | recovery | code | context | trace | redaction | channel | Cap
[path]  | usage | pass | fail | N/A      | pass | N/A     | N/A   | pass      | pass    | CAP6:fix
```

For each capped path, show what an agent sees today and the corrected error line. Note
the permission and safety model (what can go wrong, how clear the blast radius is) and
whether a verbose or debug mode exists. TRIAGE reports the cap-triggering gaps only, and
always every CAP4.

### Pass 4: Documentation and learning (findable, learn by doing)

Rate: can a developer find what they need and learn by doing? Does the docs architecture
match the persona (copy-paste examples up front for a founder; architecture docs and API
reference for a platform engineer)?

- Information architecture: found in under 2 minutes?
- Progressive disclosure: beginners see simple, experts find advanced.
- Code examples complete, working as-is, in real context.
- Interactive elements: playgrounds, sandboxes, "try it".
- Docs versioned to match the version in use.
- Both tutorials and references exist.

### Pass 5: Upgrade and migration (credible)

Rate: can developers upgrade without fear?

- Backward compatibility: what breaks, and how limited is the blast radius?
- Deprecation warnings: advance notice, actionable ("use newMethod() instead").
- A step-by-step migration guide for every breaking change.
- Codemods for automated migration.
- A clear versioning policy (semantic versioning?).

### Pass 6: Developer environment and tooling (valuable, accessible)

Rate: does it fit developers' existing workflows and the persona's typical environment?

- Editor integration: language server, autocomplete, inline docs.
- CI/CD: works in GitHub Actions and GitLab CI; non-interactive mode.
- TypeScript types and good IntelliSense.
- Testing support: easy to mock, test utilities.
- Local development: hot reload, watch mode, fast feedback.
- Cross-platform: Mac, Linux, Windows, Docker, ARM and x86.
- Reproducible across OS, package managers, containers and proxies.
- Dry-run and verbose modes, sample apps, fixtures.

### Pass 7: Community and ecosystem (findable, desirable)

Rate: is there a community, and does the plan invest in ecosystem health?

- Open source and a permissive license?
- Where developers ask questions, and whether someone answers.
- Real-world, runnable examples beyond hello world.
- A plugin or extension ecosystem.
- A clear contributing process.
- Pricing transparency, no surprise bills.

### Pass 8: Measurement and feedback loops

Rate: does the plan measure and improve DX over time?

- TTHW tracking: is getting-started time instrumented?
- Journey analytics: where do developers drop off?
- Feedback: bug reports, NPS, a feedback button.
- Periodic friction audits.
- Boomerang readiness: will `/sf-devex-review` be able to measure reality against this
  plan?

Measure the approved 0C clock and 0D result from the full documented start state, never a
warm timer or a different endpoint, by the simplest method that measures the target. The
target tier approves no telemetry, automated release gate or recurring human process: ask
about each such policy separately, with its owner and frequency.

### Appendix: agent skill checklist

Only when the product type includes Agent skill; a checklist, not a scored pass. Read the
"## Claude Code Skill DX Checklist" Hall of Fame section, check each item, and for any
unchecked one explain what is missing and suggest the fix; items needing a design
decision go through the decision procedure.

## Outside voice

Run step 6 of [SKILL.md](SKILL.md) with the plan file (or the branch diff scope) as THE
PLAN, any CEO plan's scope decisions and vision, and a REVIEW CONTEXT block carrying the
requested mode and its boundaries, each approved decision (option, answer reference,
exact scope, including approved exceptions), and the persona, approved clock and target,
benchmark boundaries and evidence limits.

## TODOs in this lens

DX debt: missing error messages, unspecified upgrade paths, documentation gaps, missing
SDK languages. **Why** names the concrete developer pain; **Pros** name the gain in
adoption, retention or satisfaction.

## Lens outputs

Update existing sections in place, Step 0 evidence above the review decisions:

- **Developer Persona Card** (0A), at the top of the DX section.
- **Developer Empathy Narrative** (0B), with the user's corrections.
- **Competitive DX Benchmark** (0C), with this product's post-review scores.
- **Magical Moment Specification** (0D): the chosen vehicle with implementation
  requirements.
- **Developer Journey Map** (0F), with every friction point's resolution.
- **First-Time Developer Confusion Report** (0G), annotated with what was addressed.
- **DX Review Scorecard**, as its own `## DX Review Scorecard` section above the terminal
  report (never inside it), replacing this review's earlier one, with its verdict lines,
  a `dx_rubric: agent-ready-v1` line and the unresolved decisions:

```
+====================================================================+
|              DX PLAN REVIEW — SCORECARD                            |
+====================================================================+
| Dimension            | Score  | Prior  | Trend  |
| Getting Started      | __/10  | __/10  | __ ↑↓  |
| API/CLI/SDK          | __/10  | __/10  | __ ↑↓  |
| Error Messages       | __/10  | __/10  | __ ↑↓  |
| Documentation        | __/10  | __/10  | __ ↑↓  |
| Upgrade Path         | __/10  | __/10  | __ ↑↓  |
| Dev Environment      | __/10  | __/10  | __ ↑↓  |
| Community            | __/10  | __/10  | __ ↑↓  |
| DX Measurement       | __/10  | __/10  | __ ↑↓  |
+--------------------------------------------------------------------+
| TTHW                 | __ min | __ min | __ ↑↓  |
| Competitive Rank     | [Champion/Competitive/Needs Work/Red Flag]  |
| Magical Moment       | [designed/missing] via [vehicle]            |
| Product Type         | [type]                                      |
| Mode                 | [EXPANSION/POLISH/TRIAGE]                   |
| Overall DX           | __/10  | __/10  | __ ↑↓  |
+====================================================================+
| DX PRINCIPLE COVERAGE                                              |
| Zero Friction | Learn by Doing | Fight Uncertainty | Opinionated + |
| Escape Hatches | Code in Context | Magical Moments | Agents Are    |
| Users: each [covered/gap]                                          |
+====================================================================+
```

  All passes 8+: "DX plan is solid. Developers will have a good experience." Any below 6:
  flag critical DX debt with its adoption impact. TTHW over 10 minutes: flag a blocking
  issue.
- **DX Implementation Checklist:**

```
[ ] Time to hello world < [0C target]
[ ] Installation is one command
[ ] First run produces meaningful output
[ ] Magical moment delivered via [0D vehicle]
[ ] Every error message meets the agent-ready error contract (Pass 3)
[ ] API/CLI naming is guessable without docs
[ ] Every parameter has a sensible default
[ ] Docs have copy-paste examples that actually work
[ ] Examples show real use cases, not just hello world
[ ] Upgrade path documented with a migration guide
[ ] Breaking changes have deprecation warnings and codemods
[ ] TypeScript types included (if applicable)
[ ] Works in CI/CD without special configuration
[ ] Free tier available, no credit card required
[ ] Changelog exists and is maintained
[ ] Search works in the documentation
[ ] Community channel exists and is monitored
```

## Report row

- **Fields:** `status`, `initial_score`, `overall_score`, `product_type`, `tthw_current`,
  `tthw_target`, `mode`, `persona`, `competitive_tier`, `unresolved`, `dx_rubric`
  (`agent-ready-v1`), `dimension_scores` (getting_started, api_cli_sdk, error_messages,
  documentation, upgrade_path, dev_environment, community, dx_measurement; recorded in the
  scorecard), `commit`, timestamp in ISO 8601.
- **Status:** `clean` with an overall score of 8+ and 0 unresolved; otherwise
  `issues_open`.
- **Findings cell:** "score: {initial_score}/10 → {overall_score}/10, TTHW:
  {tthw_current} → {tthw_target}".

## Next steps

- **Engineering lens:** DX fixes often have architectural implications (API design
  problems, error-handling gaps, CLI ergonomics); Engineering validates them.
- **Design lens:** when end-user UI exists; this lens covers developer-facing surfaces
  only.
- **`/sf-devex-review` after implementation:** the boomerang. The plan said TTHW would be
  [0C target]; did reality match?

Ask with the applicable options: **A)** Run the Engineering lens next (required gate)
**B)** Run the Design lens **C)** Ready to implement, run `/sf-devex-review` after shipping
**D)** Skip, I'll handle next steps manually.
