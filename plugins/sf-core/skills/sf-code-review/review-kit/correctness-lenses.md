# Correctness: agreements, probes and refutation

Depth for the Quality axis's **Correctness** check (in [axes.md](axes.md)), and for the performance and security specialists, which reuse the refutation rules below. Read it when the diff crosses a boundary: two functions, two callbacks, a producer and a consumer, a write now and a read later. Most diffs do.

The defects reviewers miss are rarely visible inside one file. They are disagreements between two participants that each look reasonable alone. So the unit of correctness review is the **agreement**, not the file or the hunk.

## Map, then look for broken agreements

Build one small map first: inputs, the main execution flows, who owns which state, external dependencies, observable effects. Then, for each consequential agreement the diff touches, hold in working notes (not in the report):

```
Participants:
Value, entity or effect exchanged:
Authority (who decides the real answer):
Identity and lifetime/version:
Required relationship:
Evidence for that relationship:
Relevant transitions or orderings:
Observable consumer or consequence:
```

A boundary is semantic, not a file split: a caller and a callee, two executions of the same function, a value written now and read later.

**Establish the obligation without inventing intent.** Evidence comes from the spec, a documented contract, language or protocol semantics, a test that encodes an expectation, or a necessary producer and consumer relationship. A consumer's implementation alone does not prove the consumer is right. When the contradiction is certain but which side should change is open, say so. Missing documentation is a limitation, not a finding by itself.

**Start where agreements break most:** values transformed or negotiated, identities reassigned, work becoming asynchronous, state persisted and reloaded, several effects that must agree. Then make a local pass over ordinary decisions, arithmetic, boundaries and error branches, so the anchor does not filter out plain bugs.

**Introduced or revealed.** A changed line can create a defect or merely make an old one reachable. Report both, and mark which: only an introduced defect blocks this change; a revealed one is reported as pre-existing.

## Force a violating execution

A suspicion is a finding only once you construct the execution that breaks it. Where the code permits:

- make the **requested** value differ from the **accepted or effective** one;
- keep two operations live at once and vary their completion order;
- change the identity or generation between observation and use;
- compare two transitions that should end in equivalent state;
- inject a failure between effects, and an interruption before completion;
- feed empty, exact-boundary and adjacent-boundary inputs.

Establish that each case is reachable in the real system.

## The lenses

Overlapping lenses, not a quota. One defect can sit under two; report the root cause once. Lenses 1 and 2 are the ones strong reviewers most often never report at all, because the code reads sensibly at each participant: run their **probes**, since a read-through returns nothing there.

1. **Authority reconciliation.** Follow a proposed value through validation, normalisation, negotiation or commit, and find downstream state still derived from the proposal where the authority can return something different. A requested value is not an applied value. **Probe:** force the effective answer away from the requested one, then ask which stored state, UI, later call and log line still carry the request.
2. **Identity and correlation.** Trace how a result finds its originating entity; establish that the key is unique, stable and live long enough under overlap, reordering, removal and reuse. A label, index, position or arrival order is suspect exactly when one of those can fail. **Probe:** run two operations concurrently, complete them out of order, then remove one mid-flight and reuse its slot.
3. **Freshness and generations.** Mark every value captured before an await, callback, timer or lock release; decide what can change before it is used, whether the operation still targets the intended entity and version, and what the code does with a stale result.
4. **Lifecycle and derived state.** Compare every construction, replacement, restoration, reset, failure and termination path for derived fields or cached decisions re-established on one path and wrongly kept on another.
5. **Atomicity and partial failure.** Split multi-effect operations at each failure and cancellation point. Is partial state allowed, recoverable and honestly reported? Look for success reported before the effects are durable.
6. **Replay and effect count.** Follow retries, duplicate delivery, repeated callbacks and re-entry. Compare the real delivery guarantee with the required effect count, above all where an effect costs money, sends a message or changes a shared total; check deduplication scope, lifetime and behaviour after partial success.
7. **Composition and precedence.** Trace independently produced pieces through merge, reduction, ordering and dispatch; compare the real overwrite and selection rules with the intended priority, including transforms after the merge that re-order or re-key it.
8. **Bounds, units and accounting.** Follow counts, lengths, offsets, capacities and totals through every transform: empty and boundary cases, overflow, rounding, and whether measurement and consumption use the same unit.
9. **Framing and incremental processing.** Compare logical item boundaries with real read, write, iterator and callback boundaries: split and combined items, partial writes, early termination, buffering, flush and the last item.
10. **Representation and information loss.** The most frequent class: give it more than one pass. Compare what a producer can emit with the distinctions a consumer relies on, through round trips and derived outputs.
    - *The nullish family:* pending, absent, empty, zero, false and failed are six states that collapse easily (a failed read returning an empty list, a guard excluding `null` but not `undefined`, the string `"false"` in a boolean, `-1` meaning "no answer" and then counted). **Probe:** for each value that can be missing, list which of the six it can be, and check the consumer tells apart the ones that matter.
    - *Projection drift:* a query, DTO, serialiser or mapper stops emitting a field and consumers degrade silently. **Probe:** diff the field set the producer selects against every field its consumers and renderers read, including a field read under a name the producer never emits.
    - *Unresolved stored as resolved:* a promise, future, lazy handle or loading state persisted or compared as the settled value. **Probe:** wherever a value has a "not ready yet" state, find who reads it without checking.
    - Then signed and unsigned, canonical forms, precision, encoding, equality semantics. A cast, `any`, non-null assertion or suppressed warning **on a boundary** marks where two sides disagreed and someone silenced the compiler: treat each as a candidate.
11. **Ownership, completion and progress.** Who may mutate, release, cancel and complete an operation or resource? Inspect exceptional exits and competing terminal paths for premature release, missing completion, deadlock, use after hand-off.
12. **Decisions and dispatch.** Enumerate the meaningful states and inputs of consequential predicates and dispatch tables: overlapping conditions, inverted tests, missing cases, what the fallback and the framework's unstated default actually do. Include **reachability**: can any input reach this branch; does anything start this scheduled or registered job? A predicate that is never true, a handler never wired, a scheduler never started all read as correct code.
13. **Verification and observability.** Follow what happens when each step fails and what would make the failure visible: checks that cannot fail, oracles measuring something else, exceptions swallowed into success, gates that skip their subject, effects whose absence nothing detects. **Probe:** for each guarantee the system claims, name the observation that would break if it stopped holding; with none, the guarantee is decorative. Silent failure is rare in planted-bug corpora and common in real fix histories, so look here even when a checklist does not prompt it.

When a lens seems not to apply, say which property of the system makes it so.

## Refutation

A candidate becomes a finding only with all five:

1. **A supported obligation:** what must hold, and the evidence for it.
2. **A feasible execution:** inputs, state and ordering the real system permits.
3. **A concrete contradiction:** where the obligation fails.
4. **An observable consequence:** wrong output, state, effect, completion or progress.
5. **An examined counterargument:** the strongest mechanism that would prevent or repair it.

Hunt for the refutation: an enclosing guarantee that makes the execution impossible, synchronisation that excludes the interleaving, reconciliation before any consequential read, an intentional contract, a precondition that excludes the input, another owner responsible for it.

| Outcome | Rule |
|---|---|
| **Keep** | The evidence establishes the defect; the counterargument checked does not prevent it. |
| **Drop** | Cited evidence defeats the execution, the obligation or the consequence. |
| **Unresolved** | An essential contract or runtime fact is unknown. List it under "Unexamined and unknown", apart from findings. |

- **Absorption is not prevention.** A cache that usually holds the value, a retry that usually succeeds, a default that is usually right hides the defect by good odds; it fails the day the absorber is cold, evicted or reconfigured. Drop only on a mechanism that makes the execution impossible, and name it.
- **"It works nearly always" describes a race.** A timing window that usually resolves correctly is a finding; having to reason about which side usually wins is the evidence.
- Passing tests, unfamiliar code, a suspicious name, a missing test and a sibling difference are leads to investigate: none is proof, none is refutation.
- A correctness defect can harm only the person who triggered it and still be serious. The attacker-and-victim test belongs to security alone ([specialists/security.md](specialists/security.md)); apply each test only to its own dimension.
- Deduplicate by violated agreement and root cause, never by file. Cite **every participant** of a cross-boundary defect, so the relationship stays visible.

## Splitting the work

When the correctness pass is split across sub-agents, split by **complete flows or connected groups of agreements**, never by file and never one agent per lens: partitioning by file is the split that hides cross-boundary defects. Each worker gets a bounded flow, its participants and open questions, reads both sides of its agreements, and may follow dependencies outside its list; overlapping reads are cheap. The coordinator reconciles relationships that cross assignments, so none stays unexamined between two workers.

## Reporting a correctness finding

Inside the axis's one-line format, the fix arrow carries the remedy; under it, add the parts that make it checkable:

```
[Severity] (confidence N/10) file:line: consequence → minimal correction
  Expectation:  required behaviour, and its evidence
  Trigger:      feasible preconditions and execution
  Evidence:     file:line for every participant
  Refutation:   strongest counterargument checked, and why it fails
  Verification: what was executed, versus established from source
  Origin:       introduced | revealed (pre-existing)
```
