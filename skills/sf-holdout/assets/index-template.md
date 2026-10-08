# Holdouts: <set-id>

- **Spec:** <repo path>/.software-factory/specs/SPEC-<slug>.md
- **Spec fingerprint:** <the spec's body hash, frontmatter excluded, when these scenarios were written (sf-spec check.md step 1.3)>
- **Written by:** <codex | gemini | opencode | claude | subagent>, <YYYY-MM-DD>
- **Written before code:** <yes | no: reason>
- **Critic:** <done YYYY-MM-DD, findings=<n>; open items by finding ID and category, or "none" | skipped (light lane)>
- **Failure scenarios:** <"every capability", or one entry per exempt capability: `CAP-<n> failure: n/a (<reason>)`>

<!-- Path: success | failure | must-not-change | edge. Kind: exec | rubric.
     Status: active | retired <YYYY-MM-DD>: <reason>.
     Pre-code: red | green | green (exists) | n/a (rubric).
     No Given/When/Then, values or test code in this file: the conductor reads it. -->

| ID | Path | Kind | File | Status | Pre-code |
|---|---|---|---|---|---|
| SPEC-cart/CAP-1/S1 | success | exec | exec/CAP-1-S1.test.ts | active | red |
| SPEC-cart/CAP-1/S2 | failure | exec | exec/CAP-1-S2.test.ts | active | red |
| SPEC-cart/CAP-1/S3 | must-not-change | exec | exec/CAP-1-S3.test.ts | active | green |
| SPEC-cart/CAP-2/S1 | success | rubric | rubrics/CAP-2-S1.md | active | n/a |
| SPEC-cart/CAP-2/S2 | failure | exec | exec/CAP-2-S2.test.ts | retired 2026-10-08: misread CAP-2, replaced by S3 | red |
| SPEC-cart/CAP-2/S3 | failure | exec | exec/CAP-2-S3.test.ts | active | red |
