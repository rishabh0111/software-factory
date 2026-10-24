# Intent documents (the `intent` focus)

The `intent` focus maps what the rest of the map leaves out: what the system is **meant** to allow. Who may do what, where authorisation is enforced in each flow, which values are secrets, what runs on a schedule or on its own. Code written fast, by people or agents, leaves no durable record of that intent, and without one no reviewer can tell whether it is safe to ship. These documents are the intended-state half of every later check: `sf-verify`'s documented-intent check, a security or performance audit, and `sf-tdd`'s coverage map all compare the code against them.

Two readers: a human reviewer and the next coding agent. Be honest about the current state without being paranoid: the job is an accurate map, not a clean bill of health. Each document is short, table and bullet heavy, describes this system only, and carries no generic theory or finished templates.

## Where the documents go

The repository's own setup comes first. Before the mapper runs, the dispatching skill looks for:

1. **Agent instructions** (`AGENTS.md`, `CLAUDE.md` and what they import or point to), which may name the docs folder, its files, who maintains each and how dates are recorded.
2. **A docs location** already in use (`docs/`, `documentation/`).
3. **Existing equivalents**: a document already covering what one below covers, under any name (`docs/security.md` for permissions, `docs/env.md` for variables). Match on what it covers, not on its name.

Then, per document: update the existing equivalent rather than writing a parallel file, and keep its naming and date conventions; use the codebase-map folder and the names below only where the repository has none. Check names case-insensitively before creating a file: `flows.md` beside `FLOWS.md` is one file on Windows and macOS (the write overwrites it) and two colliding files elsewhere. When the existing file covers something else, pick a name that collides with nothing. The report names every path written and whether it follows the repository's setup or this default. A document written outside the map folder goes through the same secret scan (step 6) and commit (step 7) of [SKILL.md](SKILL.md): add its path to both commands.

A name such as `PERMISSIONS.md` below means that document wherever, and under whatever name, the repository keeps it.

## Core documents (always)

Each: purpose · what it must capture · how a reviewer uses it.

1. **`TRUST-BOUNDARIES.md`**: how the system hangs together where it matters for safety.
   - Captures: a short product overview and its key assumptions; how authentication, sessions and claims flow end to end; every trust boundary (service role against client, server against provider, job against app, agent against tool, webhook against app); a **Known risks and assumptions** list, each item backed by where it shows up in the code; one line per absent capability ("No scheduled work, so no `CRON.md`."); a **Related documents** index of every intent document, `TESTING.md` and the coverage map.
   - Reviewer use: the root of the set; everything else is cross-referenced from here. `ARCHITECTURE.md` and `STACK.md` hold the general structure and stack: link them, do not restate them.
2. **`FLOWS.md`**: the journeys where permissions and side effects are exercised.
   - Captures, per load-bearing flow: actor, precondition and success outcome; the step sequence across UI, server, data, jobs, providers and agents; the **authorisation check at each protected step** (which claim, role or scope, on which resource, and the expected deny case); each trust-boundary crossing; the state changes and side effects each step causes (writes, emails queued, jobs triggered, outbound calls).
   - Reviewer use: the runtime view a static matrix cannot show: where and in what order authorisation is enforced, and where it can be skipped.
   - A flow belongs here only when it touches permissions, data integrity, external side effects, money, privacy or operational safety. This is a security and operations map, not a feature spec.
3. **`PERMISSIONS.md`**: who may do what.
   - Captures: roles and claims; where scope is derived (token or database); a resource × operation × role matrix; which tables have row-level security and which rely on checks in code.
   - Reviewer use: the baseline an access-control check compares the code against.
4. **`VARIABLES.md`**: configuration and secrets, mapped to risk.
   - Captures: a table of name · used by · scope (server or client) · source · rotation · risk; an explicit statement of whether any secret is bundled client-side; a pre-go-live checklist. Names only: never a value (see `<forbidden_files>` in [codebase-mapper.md](codebase-mapper.md)).
   - Reviewer use: the secrets and personal-data leak surface, and the rotation plan in an incident.

The verification map (which documented rules a test pins today) is derived from these, not read off a subsystem: `sf-tdd` writes it as the coverage map.

## Conditional documents (only when the capability exists)

5. **`EMAILS.md`**, when the app sends transactional or automated email: the queue → processor → provider path; templates and the variables they accept; retry and backoff; where to look when a send fails. Reviewer use: unvalidated template inputs and personal-data exposure.
6. **`CRON.md`**, when scheduled or background jobs exist: an inventory of job · schedule · function · secrets · limits · retry; how each job stays idempotent; how internal calls authenticate; where to see the last runs. Reviewer use: forgeable triggers and unbounded jobs.
7. **`SEO.md`**, when there are public, indexable or bot-facing routes: the preview approach (static meta, prerender, edge HTML); a route · needs SEO · public data only table; how dynamic metadata is sanitised; bot and human routing. Reviewer use: private fields on public routes, metadata injection on bot routes.
8. **`AUTOMATION.md`**, when the app embeds AI agents, model workflows, tool calling, webhooks or external automation. Per automation: trigger, owner, and whether it runs automatically or only after approval; the inputs it may read and the **exact tools and APIs it may call** (the tool surface is itself a hard guardrail); where steering lives (the prompt) against the hard guardrails outside the prompt; the output contract back to the app (schema, validation, failure handling); app-owned side effects against agent-owned suggestions; the controls (approval gates, audit logging, rate limits, retries, kill switch). Reviewer use: hidden automation paths, and the line between what an agent proposes and what the app enforces.

Skip a conditional document that does not apply, and record its absence as one line in `TRUST-BOUNDARIES.md` rather than writing an empty file.

## Mapper rules

- The code is the source of truth. Code too unclear to document confidently is listed under a **Gaps** heading in the document it belongs to: those are the first things to fix.
- Every claim carries the `file:line` it was read from.
- Keep the repository's date convention; with none, add no "updated" line (the `last_mapped_commit` stamp records freshness).
- The agent instruction file (`AGENTS.md` or `CLAUDE.md`) is a different artifact: instructions derived from these documents, not system documentation. Leave it to `/sf-ship`'s ship check.
