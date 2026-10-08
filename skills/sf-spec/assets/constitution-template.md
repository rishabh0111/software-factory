# <Project> constitution

<!--
Optional. Save as .software-factory/constitution.md and commit it.
It holds the few project-wide rules every spec and plan must meet. sf-spec treats
each MUST as a constraint, and its pre-build check rates any conflict as critical.
sf-plan and sf-review check the MUST rules again against the plan and the code.
Rules still inside <...> placeholders are ignored until filled in.
Keep it short: three to seven principles. Each MUST is something a reviewer can check.
Delete these comments and any section you don't need.
-->

## Principles

### I. <Name, e.g. Test first>

<Rule in one or two sentences, using MUST for hard rules and SHOULD for defaults.
Example: Every behaviour change MUST land with a test that failed before the change.>

Why: <one line, when the reason isn't obvious. Example: tests written after the code tend to test what it does, not what it should do.>

### II. <Name, e.g. No new runtime dependencies without review>

<Rule. Example: A new runtime dependency MUST be named in the spec's Constraints and approved by a maintainer.>

Why: <optional>

### III. <Name, e.g. Public API stability>

<Rule. Example: Public endpoints MUST stay backwards compatible within a major version.>

Why: <optional>

## Additional constraints

<Optional: required stack, security or compliance rules, performance floors, deployment rules.>

## Required spec sections

<Optional: sections every spec in this repo MUST contain beyond the template, e.g. "Data retention" for anything storing personal data.>

## Changing this file

Changes go through a normal reviewed PR/MR. Bump the version: major when a rule is removed or reversed, minor when one is added, patch for wording. Each spec records the constitution version it was written against. A new or tightened MUST says how existing code that breaks it is handled: fixed in the same change, a ticket to fix it, or a listed set of grandfathered places.

**Version:** 1.0.0 · **Adopted:** YYYY-MM-DD · **Last changed:** YYYY-MM-DD
