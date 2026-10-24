---
name: sf-debug
description: Root-cause debugging for bugs, test failures, flaky tests, build failures and performance regressions. Use when something is broken, throwing, failing, flaky or slow; when the user says "debug" or "diagnose"; when a quick fix or someone's confident diagnosis tempts you to change code before reproducing the bug; or when a fix did not work.
---

# Debugging

Find the root cause before you change anything, and find it with a loop that goes **red** on this bug. A fix aimed at a symptom is a failure, even when the symptom goes away.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIX WITHOUT A RED LOOP AND A ROOT CAUSE FIRST
```

Until Phase 1 has given you a command that goes red on this bug, you propose no fix: no patch, no config change, no cache flush, no retry. Every phase runs on every bug. A simple bug moves through them fast; it still has a root cause.

The process matters most exactly when it feels least affordable: under time pressure, when one quick fix looks obvious, when someone senior has already named the cause, and after a fix has failed.

## Before Phase 1

- **Domain.** Read `docs/agents/domain.md` when it exists and follow it; otherwise read `GLOSSARY.md` and the ADRs in the area, for a clear mental model of the modules involved.
- **Lessons.** Search the lessons folder named in [work-docs.md](../../references/work-docs.md) for past lessons on this symptom or module. A matching lesson is the first hypothesis to test, not a fix to apply.
- **Redact.** This skill has you show commands, outputs and captured artifacts. Write `<REDACTED>` in place of every secret first. Build loops against env vars, so the credential stays in the environment rather than in what you show. Captured artifacts carry auth headers: quote only the lines that carry the signal. If the redacted output is not enough to diagnose the bug, say so and ask the user.

## Phase 1: Build a feedback loop

**This is the skill.** With a **tight** pass/fail signal for the bug, one that goes red on _this_ bug, you will find the cause: bisection, hypothesis testing and instrumentation all just consume it. Without one, no amount of staring at code will save you. Spend disproportionate effort here. **Be relentless.**

### Read the evidence first

These feed the loop; they are not yet a theory.

- **Read the error completely.** Every warning, the full stack trace, line numbers, file paths, error codes. Errors often state the exact cause.
- **Check recent changes.** `git log` and the diff since it last worked, new dependencies, config changes, environment differences.
- **Pin the symptom.** The user's exact error message, wrong output or slow timing, in their words.

### Ways to construct a loop, roughly in this order

1. **Failing test** at whatever seam reaches the bug: unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** that drives the UI and asserts on DOM, console or network; use the browser tool recorded in `docs/agents/tools.md`, falling back to a scripted HTTP check of the same path.
5. **Replay a captured trace.** Save a real request, payload or event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** A minimal subset of the system (one service, mocked deps) that exercises the bug path with a single call.
7. **Property / fuzz loop.** For "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** When the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so `git bisect run` can drive it.
9. **Differential loop.** The same input through old and new version (or two configs), outputs diffed.
10. **Human-in-the-loop script.** Last resort. When a human must click, drive _them_ with `bash scripts/hitl-loop.template.sh` (copy it, edit the steps) so the loop stays structured and their answers come back to you.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, make it:

- **faster**: cache setup, skip unrelated init, narrow the test scope;
- **sharper**: assert on the specific symptom, not "didn't crash";
- **more deterministic**: pin time, seed the RNG, isolate the filesystem, freeze the network.

A 30-second flaky loop is barely better than none; a 2-second deterministic one is a debugging superpower.

### Non-deterministic bugs: the flake recipe

The goal is a **higher reproduction rate**, not a clean repro. Loop the trigger 100 times, parallelise, add stress, narrow timing windows. A 50% flake is debuggable; 1% is not, so keep raising the rate until it is.

A sleep or a longer timeout is never the fix for a timing flake: it hides the race and slows every run. For timing-dependent failures, wait on the condition the code depends on, per [condition-based-waiting.md](condition-based-waiting.md).

### When you genuinely cannot build a loop

Stop and say so. List what you tried. Ask the user for one of: access to an environment that reproduces it; a redacted captured artifact (HAR file, log dump, core dump, screen recording with timestamps); or permission to add temporary production instrumentation. Hypothesising without a loop is guessing.

### Completion criterion: a tight loop that goes red

Phase 1 is done when you can name **one command** (a script path, a test invocation, a curl) that you have **already run at least once**, with the invocation and its redacted output shown, and that is:

- [ ] **Red-capable**: it drives the real bug path and asserts the user's exact symptom, so it goes red on this bug and green once fixed. "Runs without erroring" does not count; it must be able to catch _this_ bug.
- [ ] **Deterministic**: the same verdict every run (flaky bugs: a pinned, high reproduction rate).
- [ ] **Fast**: seconds, not minutes.
- [ ] **Agent-runnable**: you can run it unattended; a human in the loop only through the HITL script.

Caught yourself reading code to build a theory before this command exists? **Stop: jumping straight to a hypothesis is the exact failure this skill prevents.** No red-capable command, no Phase 2.

## Phase 2: Reproduce and minimise

Run the loop and watch it go red. Confirm:

- [ ] It produces the failure mode the **user** described, not a nearby one. Wrong bug, wrong fix.
- [ ] It reproduces across runs (or, for flakes, at a rate high enough to debug against).
- [ ] You captured the exact symptom, so later phases can show the fix addresses it.

Then shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data and steps **one at a time**, re-running the loop after each cut, and keep only what is load-bearing. A minimal repro shrinks the hypothesis space and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing**: removing any one of them turns the loop green.

## Phase 3: Hypothesise

**Compare with what works first.**

- Find similar code in the codebase that works (a **working sibling**).
- When you are following a pattern or reference implementation, read it completely, every line. Skimming a reference and adapting it is how partial understanding ships.
- List every difference between working and broken, however small. "That can't matter" is an assumption to test.
- Note what the broken code depends on: other components, settings, config, environment, and the assumptions it makes.

Then write **3–5 ranked hypotheses** before testing any. A single hypothesis anchors on the first plausible idea. Someone's confident diagnosis, a past lesson, and your own first instinct each go on the list as one hypothesis among the others, ranked on the evidence.

Each hypothesis is **falsifiable**: it states the prediction it makes.

> "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

A hypothesis with no prediction is a vibe: sharpen it or discard it.

**Show the ranked list to the user before testing.** They often re-rank instantly ("we deployed a change to #3 yesterday") or have already ruled one out. It is a cheap checkpoint: when the user is away, proceed on your own ranking.

## Phase 4: Instrument and test

Test the hypotheses in rank order, one at a time. Each probe maps to one prediction from Phase 3, and you **change one variable at a time**. A probe is an observation or the smallest change that tests the prediction, run against the loop; it is not a fix.

- **Confirmed**: the prediction held. Go to Phase 5.
- **Refuted**: cross it off and test the next. Stack no further changes on a refuted one: revert its probe first.
- **List exhausted**: back to Phase 1 with what you learned, and re-rank.
- **You don't know**: say "I don't understand X". Research it or ask; pretending to know costs more.

Tool preference:

1. **Debugger / REPL inspection** where the environment supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish your hypotheses.
3. Logging everything and grepping is noise, not a probe.

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`, so cleanup is a single grep. Untagged logs survive; tagged logs die.

**Multi-component systems** (CI → build → signing, API → service → database), **errors deep in the call stack**, or **a test that passes alone but fails in the suite**: trace where the bad value enters, per [root-cause-tracing.md](root-cause-tracing.md).

**Performance regressions:** logs are usually the wrong probe. Establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5: Fix and regression test

Fix the **root cause**, at the source where the bad value or state originates, not where the error appears. One change, addressing the confirmed hypothesis: no "while I'm here" improvements, no bundled refactoring.

Write the regression test **before the fix**, at a **correct seam**: one where the test exercises the real bug pattern as it occurs at the call site. A seam that is too shallow (a single-caller test when the bug needs several callers, a unit test that cannot replicate the triggering chain) gives false confidence.

With a correct seam, follow `sf-tdd` for the test:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail. If you forced the red by mutating code or a fixture, `diff` against a pristine copy to prove the mutation landed before you trust it.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 loop against the original, un-minimised scenario.

**No correct seam exists:** that is itself a finding. The architecture is keeping the bug from being locked down. Record it in your report, and the Phase 1 loop serves as the failing check before the fix and the passing check after.

**Invalid data caused the bug:** after the source fix, validate at every layer it passed through, per [defense-in-depth.md](defense-in-depth.md).

**The fix did not work:** stop and count the fixes tried.

- **Fewer than 3:** revert it, return to Phase 1 and re-analyse with what it taught you.
- **3 or more, or each fix revealed a new problem somewhere else:** the architecture is in question, not the hypothesis. Signs: each fix exposes new shared state or coupling, fixes need "massive refactoring", each fix creates symptoms elsewhere. Ask whether the pattern is sound at all, or kept by inertia. Make no fourth fix: stop and put the evidence to the user before anything else changes. If the user, having seen it, still directs a change, make it and report it as unconfirmed by the loop.

Guesses made before a red loop existed (the sleeps, flushes and retries the red flags list) are not counted fixes: they are the reason to start Phase 1, not evidence about the architecture.

**The investigation finds the cause is truly environmental, timing-dependent or external:** document what you investigated, implement the appropriate handling (retry, timeout, error message), and add monitoring or logging for next time. Treat this verdict with suspicion: most "no root cause" findings are incomplete investigations.

Claims that the bug is fixed follow `sf-verify`: fresh output from the loop and the suite, not memory of an earlier run.

## Phase 6: Cleanup

Required before declaring done:

- [ ] The original repro no longer reproduces (the Phase 1 loop re-run)
- [ ] The regression test passes, or the absent seam is documented
- [ ] Every `[DEBUG-...]` line is removed (`grep` the prefix)
- [ ] Throwaway harnesses are deleted, or moved to a clearly marked debug location
- [ ] The hypothesis that proved correct is stated in the commit or PR message, so the next debugger learns

## Red flags: stop and return to Phase 1

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's obviously X", from you or from someone senior, with no red loop yet
- "Clear the cache / restart it / bump the timeout and check one page"
- "Add a sleep, it passed with a longer one"
- "Add several changes, then run the tests"
- "Skip the test, I'll verify by hand"
- "I don't fully understand it, but this might work"
- "The pattern says X, but I'll adapt it"
- Listing fixes before tracing the data flow
- "One more fix attempt", after two have failed
- Each fix reveals a new problem in a different place

When the user says any of these, you are doing it wrong:

- "Is that not happening?" (you assumed without verifying)
- "Will it show us...?" (you should have gathered evidence)
- "Stop guessing" (you are proposing fixes without understanding)
- "Ultra-think this" (question the fundamentals, not just the symptom)
- "We're stuck?" (the approach is not working)

**All of these mean: stop, return to Phase 1.** Three failed fixes mean the architecture question in Phase 5.

## Rationalisations

| Excuse | Reality |
|---|---|
| "The issue is simple, it doesn't need the process" | Simple issues have root causes too, and the process is fast for them. |
| "Emergency, no time for process" | Systematic debugging is faster than guess-and-check thrashing. A curl that reproduces the failure takes seconds. |
| "The senior dev says it's obviously the cache, just clear it and ship" | Their diagnosis is hypothesis #1 on your list, not a verdict. Test it against the red loop; that takes minutes. A flush followed by "one page looks right" proves nothing: a freshly emptied cache always serves fresh data, whatever the cause. |
| "Just try this first, then investigate" | The first fix sets the pattern. Do it right from the start. |
| "I'll write the test after confirming the fix works" | Untested fixes don't stick. The red-first test is what proves it. |
| "Several fixes at once saves time" | You can't tell which one worked, and they cause new bugs. |
| "The reference is too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing a symptom is not understanding the root cause. |
| "A longer sleep made it pass" | It made it pass more often. The race is still there; wait on the condition instead. |
| "I've already sunk 4 hours, a TODO will do" | Sunk cost. The hours bought you evidence that timing guesses fail; spend the next one on the loop. |
| "One more fix attempt" (after two or more failed) | Three failures mean an architectural problem. Question the pattern; don't fix again. |
