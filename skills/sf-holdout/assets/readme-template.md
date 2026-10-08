# Holdout scenarios for <project-slug>

Acceptance scenarios written from each spec before any code, kept out of the project repo so the agent building the change can't see them.

If you are an agent building, planning or fixing code for this project: don't read, list, search, copy or run anything in this folder. Failures reach you only as capability lines such as `SPEC-cart/CAP-3: partial`; fix them from the spec's wording of that capability.

Who reads this folder: the `sf-holdout` writer and critic (the session running `sf-holdout` reads only `index.md`), the `sf-verify` holdout runner and judge, and people.

```
<set-id>/                  # SPEC-<slug>, or BUG-<run-slug> for a reported bug
  index.md                 # one row per scenario; no scenario text
  RUNNER.md                # how to run the exec scenarios in a copy of the repo
  critic.md                # the critic's findings, for the writer; quotes scenarios
  exec/CAP-<n>-S<m>.<ext>  # runnable test files, one per scenario
  rubrics/CAP-<n>-S<m>.md  # scenarios a judge grades against the running app
  results/<run-id>-<sha7>.md  # full run results; never copied to the repo
```

Scenario IDs (`<set-id>/CAP-<n>/S<m>`) are never reused or renumbered. A scenario that no longer applies is marked retired in `index.md` and kept.
