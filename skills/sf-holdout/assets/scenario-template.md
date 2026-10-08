# Scenario templates

## Exec: header comment at the top of each test file

Use the language's comment syntax. The test's title starts with the scenario ID.

```
SPEC-cart/CAP-3/S2: expired code is refused with the reason
holdout-canary: hc-<8 random hex characters>
Covers: SPEC-cart/CAP-3   Path: failure
Given a cart worth 45.10 and a code that expired yesterday
When the shopper applies the code
Then the total stays 45.10 and the message names the expiry date
Catches: an implementation that accepts any code that exists, ignoring its expiry
```

## Rubric: one file per scenario at `rubrics/CAP-<n>-S<m>.md`

```markdown
# SPEC-cart/CAP-5/S1: <short name>

- Covers: SPEC-cart/CAP-5
- Path: <success | failure | must-not-change | edge>
- holdout-canary: hc-<8 random hex characters>

**Given** <starting conditions: stored records, who is signed in, settings>
**When** <a single triggering step>
**Then** <the visible outcome>
**And** <optional: another outcome of that same step>

## How to observe

- <how to start or reach the app, and the steps to set up Given>
- <the exact page, request or command for When>

## Expectations

Each is pass or fail. The scenario passes only if all pass.

1. <a concrete, observable check that a wrong result would fail>
2. <...>

## Catches

<a plausible wrong implementation this scenario fails>
```

## Example rubric expectations

Weak: "An error message is shown." Passes for any message, including a wrong one.

Strong: "The message names the field that was rejected and the rule it broke, and the form keeps every other value the shopper typed."
