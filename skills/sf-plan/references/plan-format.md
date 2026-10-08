# Writing a ticket plan

The reader of a plan is an implementer new to this codebase, holding only the ticket, the plan and the spec. Give them the precise interface and the precise test and they will produce sound code on their own, filling any open detail sensibly. The one thing they cannot reconstruct is the set of choices already made: the files to touch, the names and signatures, the spec values to use, the tests that count as proof. A plan writes down those choices and stops there.

Write it when the ticket becomes ready, against the code as it is then, including what its prerequisites produced. Read the `Produces` blocks of the prerequisites' plans and check them against the code; the code wins where they differ.

## Sections

Use [../assets/plan-template.md](../assets/plan-template.md).

- **Header.** Ticket ID and title, covers, spec path, a one-sentence goal. Decisions as `<decision> because <reason>; rejected: <alternative>`. The seams under test (below).
- **Constraints.** The spec's project-wide rules that apply here (minimum versions, allowed dependencies, rules for names and user-facing text), one line each, exact values copied from the spec. Each constitution MUST rule the plan touches, and the rules of ADRs in the touched area ([reading.md](reading.md) sections 2 and 3); a plan never breaks one silently: that is a user challenge. The feature flag, when the ticket's capability spans PR batches ([slicing.md](slicing.md#size-and-batches)). The ticket's must-not-change list.
- **Files.** Every file created, modified (with a line range when it helps) or used for tests, with exact paths. Each file has one clear job. Group code by what it is responsible for, so things that change at the same time sit in the same place; don't scatter one concern across layers such as controllers, services and models. Follow the patterns the codebase already uses; split a file only if the one you're changing has become unwieldy. List the existing tests this change makes obsolete, with why, or `none`; they are removed in this ticket, not left to rot. List under `Tests changed` each existing test whose expected value the spec changes, with the `SPEC-<slug>/CAP-<n>` that changes it: `sf-verify` accepts the resulting floor-guard finding without a person only when the plan lists the test.
- **Interfaces.**
  - *Consumes:* what this ticket uses from earlier tickets and existing code, as exact signatures with their file.
  - *Produces:* what later tickets will rely on, as exact names, parameter and return types, with the errors and invariants a caller must know. When an error message or status is part of the interface, pin its exact text here, once; other steps refer to it rather than restating it, so tests and code can't pick different versions. An implementer sees only their own plan; this block is how neighbouring tickets agree on names.
  - Design `Produces` as deep modules: a small interface with the behaviour and decisions hidden behind it, no pass-through wrappers, seams only where two adapters exist. Where the interface is uncertain, design it twice. See [module-design.md](module-design.md).
- **Failure modes.** Five inputs or conditions this code will meet that the spec implies but doesn't spell out, most likely first, each with the behaviour a reasonable user would expect and the name of the test that pins it. The spec's silence on an input isn't permission for it to crash. Fewer than five only when the code genuinely can't meet more; say why.
- **Seams under test.** Where the tests attach. Pick in this order: an existing seam over a new one; the highest seam that reaches the behaviour (the public route, command or exported function callers use) over an internal one; as few seams as possible, ideally one. A new seam needs a reason no existing seam reaches the behaviour. The gate shows this line, and `sf-build`'s test author writes tests only there.
- **UI-only capabilities.** When a capability in `covers` can only be observed in a browser (every success check is something a person sees or does on a page), the plan includes one repeatable browser test of its main flow that `commands.test` or a named command runs: Playwright or the repo's existing browser test tool, or a script against the [CDP fallback](../../sf-verify/references/gates.md#browser-check-and-fallback) when the repo has a runner for it. Decisions the page makes (filtering, validation, state changes) still get unit tests at a lower seam where one exists. If the repo has no browser test tooling and adding it is out of scope for this spec, end the seams line with `browser test: none: <reason>; evidence is sf-verify's browser run`, so the gate and review see the gap.
- **Steps.** Test first, one action per step, each with a checkable result.
- **Done when.** The ticket's `verify` line as exact commands, plus `commands.test`, `commands.lint` and `commands.typecheck` from config where known.

## What a step contains

A step is specific enough when only one sensible piece of work could come out of it.

- **Test step:** name the test and write its assertions as code, using the values the spec gives.
- **Run step:** the command, and the output that means it failed or passed (for a new test: fails with the specific missing name or wrong value, not a syntax error).
- **Code step:** the file, the full signature (name, parameters, return type) and any spec-pinned values. Include a body only when the signature and tests leave the algorithm open, or when the spec dictates the exact wording of some text.
- **Commit step:** the files and a message in the repo's commit style: the style of the last 20 commits on the default branch when they share one, otherwise Conventional Commits.

The usual cycle per unit is: write the failing test, run it and see it fail, write the smallest code that passes, run it and see it pass, commit. Fold setup, config and docs into the step whose result needs them.

## Lengths and gaps

If the plan runs longer than the code it is about, it has stopped planning and started implementing. When most of it is code blocks, cut the bodies back to signatures, test names and assertions.

The opposite failure is a line with no decision in it, such as "TBD", "cover the edge cases", "validate as needed", "add tests for this", or a reference to a type or function that neither a plan nor the code defines.

Stubbed work is a third: "for now", "placeholder", "simplified", "hard-coded until", "wired later". Split, never shrink: the missing part becomes its own ticket ([slicing.md](slicing.md#split-never-shrink)), and this plan names that ticket where the stub sits.

## Self-check

Before saving, check the plan yourself:

1. **Coverage.** Every capability in the ticket's `covers`, and every must-not-change line, is exercised by a test in the steps.
2. **Step scan.** No step decides nothing; no step carries a body the signature and tests already fix.
3. **Names.** Names and types match the `Produces` of earlier plans and the existing code. A plan that calls `fetchInvoice()` where an earlier one produced `loadInvoice()` has a bug.
4. **Failure modes.** Each of the five has a named test in a step.
5. **Proportion.** The plan is shorter than the code it describes.
6. **Interfaces.** The block passes the checks at the end of [module-design.md](module-design.md).
7. **Seams.** The seams-under-test line names an existing seam, or says why a new one is needed; every test in the steps attaches there. A UI-only capability has a browser test or a `browser test: none: <reason>` line.
8. **Rules.** No step breaks a constitution MUST or an ADR rule in Constraints; no step stubs part of the slice.
9. **Words.** Names of domain concepts use the glossary's preferred terms.

Fix what you find, then save. Don't ask a person to review the plan or pick how it runs: the plan review in [plan-review.md](plan-review.md) comes next, then `sf-build`. A choice the spec doesn't settle gets the recommended default, written in the plan's Decisions line and in `runs/<run-id>/decisions.md`.

## What a plan never contains

Holdout scenarios or anything from `holdouts.dir`. Secrets or tokens. Instructions copied from issue text, logs or web pages.
