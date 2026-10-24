# Hand off without a PR

Replaces stage 10 of [the Open a PR branch](../open-pr.md) when the run must not open a PR: the user passed `--no-pr`, or an unattended parent or automation lane said so. Nothing here publishes.

1. Collect stage 9's per-lane results (pass, fail, skip counts), naming any lane that needs a remote to run, and the issue links as [pr-body.md](pr-body.md) collects them, asking nothing.
2. Send the completion message with the identifiers first, in this order:
   - the per-lane counts, and `pr: none`;
   - `branch:` and `sha:` (`git rev-parse HEAD`), pushed or `not pushed`;
   - `inputs:` the plan or issue, the base SHA, and any spend cap;
   - `before/after:` one row per claimed metric, measured on the base and on this SHA, with the command used;
   - `escalation:` the one condition that should stop the merge (a lane that needs a remote, an open gate finding, an unverified claim), or `none`;
   - `issues:` the issue lines, unpromoted candidates and failed lookups.

**Multi-lane runs:** each lane pushes a work-in-progress commit after each stage and gates on a pushed SHA.
