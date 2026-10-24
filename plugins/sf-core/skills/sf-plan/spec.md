# Spec branch

Turn the conversation and what you know of the codebase into a spec, and publish it to the issue tracker. **Synthesize**: the design was agreed already, so write down what you know rather than interviewing the user. The one question this branch asks is the seams check in step 1.

## 1. Sketch the test seams

Name the seams at which the feature will be tested. Prefer existing seams to new ones, and the highest seam possible; a new seam goes at the highest point you can put it. The fewer seams across the codebase the better; the ideal number is one.

Check with the user that these seams match their expectations. Done when the user has confirmed or corrected them.

## 2. Write the spec

Fill this template. Follow the code rule in [SKILL.md](SKILL.md) (no file paths or snippets, except a prototype's decision-rich snippet).

<spec-template>

## Problem Statement

The problem the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A long, numbered list of user stories covering every aspect of the feature, each in the form:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

## Implementation Decisions

The decisions made, which can include:

- the modules that will be built or modified
- the interfaces of those modules that will change
- technical clarifications from the developer
- architectural decisions
- schema changes
- API contracts
- specific interactions

## Testing Decisions

- What makes a good test here: external behavior only, not implementation details.
- The seams confirmed in step 1, and which modules are tested through them.
- Prior art: similar tests already in the codebase.

## Out of Scope

What this spec does not cover.

## Further Notes

Anything else about the feature.

</spec-template>

## 3. Publish

Publish the spec with the tracker's Create operation, and apply the `ready-for-agent` label string with its Label operation; a spec written this way needs no further triage.

Done when the tracker holds the spec with the label applied and you have its reference (issue number, URL or file path). Report the reference, and suggest the next run: `/sf-plan` for tickets or an implementation plan, or `/sf-implement <reference>` when the work is small enough to build in one session.
