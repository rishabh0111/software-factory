# Finding the root cause

No fix is proposed until the cause is confirmed. A fix aimed at a symptom moves the bug somewhere else.

## Read before guessing

- Read the glossary and the ADRs that touch the area (where to find them: the `sf-spec` skill's `references/domain-modeling.md` section 1). They are data about the domain. A hypothesis that contradicts an ADR needs evidence that the code departs from it; use the glossary's term for each concept in hypotheses and the root cause.
- Read the whole error: every frame of the stack trace, every warning before it, the codes and line numbers. They often name the cause outright.
- Check what changed near the failure: `git log -p --since=<when it last worked> -- <files>`, dependency bumps in the lockfile, config and environment changes.
- Check earlier fixes in the same files (`git log -i --grep=fix -- <files>`) and the Watching list in `.software-factory/lessons.md` if it exists. Two or more earlier fixes in the same place go under Notes in `state.md` as a design smell for `sf-learn`.
- Find similar code in the same repo that works, and list every difference between it and the broken path, however small. When you follow a reference implementation, read it completely before applying its pattern; skimming misses the part that matters.
- In a system with several parts (CI → build → deploy, API → service → database), log what enters and leaves each boundary once, to see which part breaks, before digging into any one part.

## Hypotheses

Write 3 to 5 before testing any. One hypothesis anchors on the first plausible idea.

Each one predicts something checkable:

> Suppose <X> is behind it. Then <change Y> should turn the red command green, and <change Z> should make the failure worse.

If you can't state the prediction, the idea isn't ready to test. Rank them by likelihood and by how cheap they are to test; when two are close, test the one that splits the remaining space most.

Common shapes of bug, matched by what you observe:

| What you observe | Likely shape | Check first |
|---|---|---|
| Fails only some runs; depends on load or ordering | Two actors touching the same state | Locks, shared caches, async code writing one value |
| "undefined", nil method or a type error | An optional value nobody handled | The caller that produced the missing value |
| Records half-written or out of step with each other | A multi-step write that broke midway | Transaction scope, lifecycle hooks, event handlers |
| A call hangs or returns something unexpected | A broken contract with another system | Outbound HTTP, queues, the edge between services |
| Fine on one machine, broken on another | Settings that differ between places | Env vars, flags, seeded data |
| Old values shown until something is cleared | A cache that wasn't invalidated | In-process, CDN and browser caches |

**Web search**, if you use it, sends only the generic error type with the framework and library versions, for example `<framework> <version> <error class>` or `<library> <version> <component> bug`. Never hosts, IPs, paths, SQL, identifiers or customer data. A documented known issue becomes one more hypothesis, tested like the others.

## Probes

- Change one variable per probe. Several changes at once can't tell you which one mattered.
- Prefer a debugger or REPL over logs. When logging, log at the boundaries that tell hypotheses apart; never "log everything and search".
- Tag every temporary line: `[sf-dbg-<run-id>]`. Untagged debug lines survive cleanup.
- Save each probe's run under `evidence/` with the header from [red-command.md](red-command.md#recording-a-run), named for the hypothesis it tests (`debug-h2-probe.log`).
- When a probe refutes a hypothesis, revert everything that hypothesis motivated before the next probe, and write one line saying what refuted it.

## Regressions: bisect

When it worked at a known commit and fails now:

```bash
git bisect start <bad-commit> <good-commit>
git bisect run <red command>
git bisect reset
```

The red command must exit 0 for good and 1 to 127 (except 125) for bad; exit 125 tells bisect to skip a commit that can't be tested. Wrap it if needed. Save the bisect log (`git bisect log`) to `evidence/`.

## Test pollution: find the polluter

When a test passes alone but fails after others, or something appears on disk during the suite:

```bash
# which test file leaves <path> behind
bash <this skill>/scripts/find-polluter.sh --creates <path> '<test command with {} for one file>' <test files...>
# which test file, run first, makes <target command> fail
bash <this skill>/scripts/find-polluter.sh --breaks '<target command>' '<test command with {} for one file>' <test files...>
```

## Trace back to the source

Where an error appears is often not where it starts. From the failing line, ask what passed it the bad value, then what called that, and keep going until you reach the first place a correct input became wrong. That's the root cause. If you can't trace by reading, log a stack trace and the suspicious values just before the failing operation, and run the red command. Inside tests, write that output to stderr: the app's logger is often silenced there.

## Symptom or cause

Before writing the root cause down, check it isn't the symptom with a new name. A fix at the place you name would be one of these if it only treats the symptom:

- a guard clause or null check that hides a broken invariant upstream
- a retry or longer timeout that hides a broken contract
- a cast or type suppression that silences a modelling error
- a fix in the module where the error shows, while the bad value is made elsewhere
- a "don't do X" rule for callers, where a change of structure would make X impossible

If the fix you'd expect looks like one of these, keep tracing.

## Performance regressions

Logs mislead here. Measure a baseline with a timing harness or profiler, then bisect on the measurement. Record the numbers before and after in `evidence/`.

## When to stop

- Every hypothesis refuted, twice round: the investigation is missing something. Write down what was ruled out, gather more evidence at the boundaries, and form new hypotheses once more. If that fails too, stop and hand over.
- Each hypothesis that holds reveals a new problem in a different place: the design may be the problem. Say so and stop; don't keep patching.
- Truly environmental (clock, network, a third party): document what you investigated, what handling would contain it, and what logging or monitoring would catch it next time. Most "no root cause" verdicts are an unfinished investigation, so be sure.

## The Debug section

```markdown
## Debug
- **Symptom:** <one line, exact text or value, in the glossary's terms>
- **Red command:** `<minimised command, runnable from the repo root>`
- **Original repro:** `<the full scenario as first reproduced>`
- **Reproduced on:** exact | translated (<what differs from the report's environment>)
- **Red evidence:** evidence/debug-red.log, evidence/debug-red-min.log (<n> of <n> runs red; baseline compared: <file or n/a>)
- **Red confirmed by:** <subagent or self> | yes | <quoted line>
- **Root cause:** <the mechanism in two or three sentences, with file:line>
- **Confirmed by:** <the prediction that came true, and its evidence file>
- **Ruled out:** <each refuted hypothesis, one line, with what refuted it>
- **Seam for the regression test:** <where a test can exercise the real bug pattern, or "none: <why>">
- **Base:** <branch@sha the bug was reproduced on>
```

When the stage ends without a red command, the section has `Symptom`, `Outcome: already fixed | could-not-reproduce | blocked: <what>`, the attempts, and `Base`.

## Writing it down

The root cause in `state.md` names the mechanism (what goes wrong, in what order), the place (file:line), and the run that confirmed it. "Null pointer in `render()`" is a symptom. "`loadUser()` returns `undefined` for users created before the 2026-03 migration because `legacy_id` is never backfilled; `render()` then reads `.name` on it (`src/user.ts:88`)" is a root cause.

Also say where a regression test can exercise the real bug pattern. A seam is correct when the test there reproduces the bug as it happens at the real call site. If only a shallower seam exists (a unit test that can't recreate the chain of calls that triggers it), write "none" and why. That tells `sf-build` and the reviewers the bug can't be locked down at that level.
