## Lens: developer experience (when an API, CLI, SDK or library surface changes)

Review the plans as the developer who will call this surface for the first time, with only the docs and the error messages to go on. Who that developer is comes from the spec and the README; don't invent a persona. Ground every finding in the plans, the existing docs, help text, examples and error code you read; label anything you predict but didn't see as a prediction.

### 1. Time to first success

Count the steps from a clean start (install or upgrade, credentials, config) to the first call that returns a useful result, using only what the docs will say after these plans. Name each step and the command or code for it. Flag steps the plans could remove within their scope: a missing default, a required config value that could be inferred, a prerequisite nobody checks for. Don't propose new products or hosted services; note them as out of scope.

### 2. Naming and shape

- Names are guessable without docs and follow the grammar the surface already uses (verbs, plurals, casing, flag style). A new name for an existing concept is a finding.
- The simplest call does something useful; every parameter that can have a sensible default has one.
- Options are consistent across commands or endpoints: the same flag or field means the same thing everywhere.
- For a CLI: non-interactive use works (flags or env vars for every prompt), exit codes are stated, output meant for scripts is stable and parseable. A destructive command has a dry-run.
- For an API or SDK: callers never need raw HTTP or internals for a supported case; retry, rate-limit, timeout and idempotency behaviour is stated; the simple case comes first and advanced options don't crowd it.
- Types ship with the package where the language has them, and every platform the project supports (operating systems, architectures, runtime versions) still works.

### 3. Errors that say how to fix

Trace the three most likely errors a developer will hit on the new surface. For each, show the message the plans produce and the message they should produce. A good error says what happened, why, and the exact fix (the flag, value, permission or command). API errors are structured (a stable code, a message, the offending field). An error a developer can hit with no stated message, or with only a stack trace, is a high finding. Where failures need diagnosis, a verbose or debug mode exists and is documented.

### 4. Docs and examples

- Every new or changed command, endpoint, option or export has reference docs or help text updated in the same ticket that changes it.
- At least one example per new capability is complete enough to copy and run, shows its expected output, and is checked by a test or doc test where the project has one.
- The changelog or release notes say what changed for callers.
- A new installable artifact (CLI, library, binary, container image) names how it is built and published and which platforms are tested; anything deferred is listed.

### 5. Backwards compatibility

- List what existing callers, scripts or config files break. Each break is either avoided, or shipped with a deprecation that names the replacement, a version bump the project's policy calls for, and a migration note (or a codemod for a wide change).
- Removing or renaming a public name, flag, field or default the spec doesn't ask to change is a user challenge for the planner.
- Removing a public surface the spec does ask to remove needs a prior deprecation (a warning at use and a docs note naming the replacement, shipped in an earlier release) and evidence nothing still uses it, unless the spec says otherwise.

### Output

After the findings table, add the step list from section 1 (`Step | Developer does | Friction | Fix in plan?`) and the error table from section 3 (`Error | Plans produce | Should say`).
