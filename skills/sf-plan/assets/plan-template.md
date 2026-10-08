<!-- Format of runs/<run-id>/plans/<ticket-id>.md. See references/plan-format.md. Delete comment lines when filling. -->

# Plan <ticket-id>: <ticket title>

- **Ticket:** <ticket-id> in runs/<run-id>/tickets.md
- **Covers:** SPEC-<slug>/CAP-<n>
- **Spec:** .software-factory/specs/SPEC-<slug>.md
- **Goal:** <one sentence: what works when this is done>
- **Decisions:** <each as "<decision> because <reason>; rejected: <alternative>", also logged in runs/<run-id>/decisions.md; or "none">
- **Seams under test:** <where the tests attach: an existing seam first, the highest one that reaches the behaviour, as few as possible (ideally one), e.g. "the `POST /cart/code` route through the app's test client">; new seam: <none, or its name and why no existing seam reaches the behaviour>; browser test: <for a UI-only capability: the repeatable browser test and the command that runs it, or "none: <reason>; evidence is sf-verify's browser run"; else delete>

## Constraints

- <project-wide rule from the spec, exact value copied>
- Constitution: <each MUST rule this plan touches, by number and short name; or "none touched">
- ADR: <rule from each ADR in the touched area, e.g. "ADR-0007: money is integer cents"; or "none in the area">
- Behind flag: <flag name, default off, if the ticket's capability spans PR batches; else delete this line>
- Must not change: <from the ticket>

## Files

- Create: `<exact/path>`: <its one job>
- Modify: `<exact/path>:<lines>`: <what changes>
- Test: `<exact/test/path>`
- Tests changed: <existing test whose expected value the spec changes, as `<file>::<test>`, and the SPEC-<slug>/CAP-<n> that changes it; or "none">
- Tests made obsolete: <existing test and why it no longer applies, citing the SPEC-<slug>/CAP-<n> when the spec is the reason; or "none">

## Interfaces

<!-- Produces: small interface, decisions hidden, errors and invariants stated, a caller named for each entry. See references/module-design.md. -->

- **Consumes:** `<exact signature>` from `<path>` (<ticket-id or existing>)
- **Produces:** `<exact name(params: types) -> type>` in `<path>`, used by <ticket-ids or "later tickets">

## Failure modes

<!-- Five, most likely first. Each pinned by a test named in the steps. -->

1. <input or condition>: <expected behaviour>. Test: `<test name>`
2. ...
3. ...
4. ...
5. ...

## Steps

- [ ] **1. Write the failing test** `<test name>` in `<test path>`

  ```<lang>
  <test name and assertions, with the spec's exact values>
  ```

- [ ] **2. Run it and see it fail.** `<command>`. Expected: fails with `<missing name or wrong value>`.
- [ ] **3. Implement** `<exact signature>` in `<path>`. <one line on the approach, only if the signature and test leave a real choice>
- [ ] **4. Run it and see it pass.** `<command>`. Expected: `<pass output>`.
- [ ] **5. Commit** `<files>` with `<message in the repo's commit style; Conventional Commits if it has none>`.

<!-- Repeat the cycle per unit. Failure-mode tests go in the cycle of the code that owns them. -->

## Done when

- `<the ticket's verify line as exact commands>`
- `<commands.test>` passes
- `<commands.lint>` and `<commands.typecheck>` pass, where configured
