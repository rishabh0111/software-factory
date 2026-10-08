# Designing the Interfaces block

How to decide what a plan's `Produces` looks like. Later tickets build against it, and their implementers see only their own plan, so a bad interface spreads. The aim: each module gives its callers a lot of behaviour for a small interface, and keeps its decisions to itself.

## Terms

- **Module:** any unit that pairs an implementation with an interface, whatever its size. One function is a module; so is a type, a library, or a feature cut through several layers.
- **Interface:** the full set of facts a caller depends on. Beyond the signature that includes invariants, call-order rules, the errors raised, config that must be present and limits on speed or size. Whatever a caller cannot safely ignore is interface, even where no type expresses it.
- **Depth:** how much behaviour a caller gets for each thing they have to learn about the interface. A deep module has a small interface over a lot of behaviour. A shallow one has an interface nearly as complex as what it does. Depth is leverage, not line count: padding an implementation doesn't deepen it.
- **Seam:** the place where the interface sits, where behaviour can be swapped without editing that place. **Adapter:** something that fills a seam (a Postgres store, an in-memory fake).
- **Implementation:** the code behind an interface. It is not the adapter: a small adapter can sit over a large implementation (a thin HTTP handler over the pricing engine), and a large adapter over a small one (a full in-memory fake of a one-call client).

Use these words exactly, and the glossary's words for domain concepts. Don't substitute "component", "service", "API" or "boundary": "boundary" is overloaded with bounded context; say seam or interface.

## Rules for `Produces`

1. **Small interface, much behind it.** Fewer entry points, fewer parameters, sensible defaults. Every entry in `Produces` has a named caller: a later ticket or existing code. One with no caller is cut.
2. **No pass-through modules.** Apply the deletion test: imagine deleting the module and inlining it. If no complexity moves anywhere, it was a pass-through; don't create it. A wrapper that forwards the same arguments to one other function, or a "service" that only calls a repository, is shallow.
3. **Hide decisions.** Callers don't learn the storage format, retry policy, cache, library, or the order of internal steps. `Produces` returns domain values, not a library's types or raw rows. If two tickets would both need to know the same internal detail, that detail belongs inside one module that both call.
4. **State errors and invariants.** For each produced function: what it returns or raises when input is missing, invalid or not found; whether it's idempotent; any ordering rule ("call `open()` before `read()`"). These are part of the interface, and the failure-mode tests exercise them.
5. **Seams only where something varies.** A seam with one adapter is hypothetical; don't add an interface or port for it. Production plus a test fake counts as two. By dependency:
   - in-process (pure logic, in-memory state): no seam; test it directly.
   - local stand-in exists (in-memory database, temp directory): use the stand-in in tests; the seam stays internal.
   - a remote service you own: a port at the seam, with a production adapter and an in-memory adapter for tests.
   - a third-party service: an injected port; tests use a fake.

   An external port exposes one function per operation (`getInvoice(id)`, `refund(id, amount)`), not a generic `fetch(endpoint, options)`, so each test fake returns one shape with no branching on the request.
6. **Design for testing through the interface.** Accept dependencies rather than constructing them inside. Return results rather than mutating inputs. Tests cross the same interface callers use; if a test needs to reach past it, the module is the wrong shape. A module may have internal seams for its own tests; don't expose them in `Produces`.
7. **Deepen, don't layer.** When the ticket's path runs through several shallow modules, consider a prefactor ticket that merges them behind one interface. Its tests are written at the new interface, and tests at the old shallow modules are removed in the same ticket rather than kept alongside.

## Design it twice

When the interface is uncertain, sketch more than one before choosing. It's uncertain when a `Produces` will be used by two or more later tickets, when it's a surface outside callers see, or when you can see two plausible shapes. Skip this when existing code already fixes the interface.

1. Frame the problem: the constraints any version must meet (callers, the dependencies and their kind per rule 5, the errors it must report) and a rough sketch of one call path, a few lines. Write both into the plan's `Decisions` so the gate can show them; don't wait for an answer.
2. Draft at least three versions that differ in kind, not detail, each under its own constraint: the fewest entry points possible; the most flexibility for future callers; the version that makes the most common call trivial; ports and adapters, if a remote dependency is involved. Where the host has subagents, give each draft to a parallel read-only subagent with its own brief: the files involved, the coupling to the code around it, the dependency kind, the Terms section above and the glossary terms in play.
3. For each: the signatures with errors, invariants and ordering rules; one example call; what it hides; the dependency strategy and adapters; and the trade-offs (where leverage is high, where it is thin).
4. Compare on depth, on where future change would land, and on where the seam sits. Pick one, or combine parts. Prefer the smaller interface when they're close.

The plan contains only the chosen interface. Put the choice and the runner-up in the plan's `Decisions` (`<choice> because <reason>; rejected: <runner-up>`), and in `runs/<run-id>/decisions.md`; it's a taste decision, so it's listed at the gate with the constraints and sketch.

## Checks on an Interfaces block

Used by the planner's self-check and pasted into the plan reviewer's prompt.

1. Every `Produces` entry names a caller (ticket ID or existing `path`).
2. No entry fails the deletion test: none just forwards to one other function with the same arguments.
3. No library type, raw row, file path or internal step order appears in a `Produces` signature unless the spec fixes it.
4. Each produced function states what it does on missing, invalid or not-found input, and any ordering rule.
5. Every new seam has two adapters (production and test count).
6. Every `Consumes` matches an earlier plan's `Produces` or a signature in the code, by name and type.
7. Where the interface was uncertain, the plan's `Decisions` line records the design chosen and the runner-up.
