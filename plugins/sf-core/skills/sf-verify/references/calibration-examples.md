# Calibration examples

Good and bad verdicts for [goal-backward-verification.md](../goal-backward-verification.md). Each good example shows evidence at every level it claims; each bad one shows the shortcut it took.

## Good

**Every level checked, with evidence.** Must-have: `docs/workflows/context-bridge.md`, over 50 lines.

> **L1 exists:** `docs/workflows/context-bridge.md`, 187 lines.
> **L2 substantive:** no TODO/FIXME; four defined sections (`updateContextTier`, `getContextBudget`, `injectContextWarning`, `resetTierState`) with real threshold logic.
> **L3 wired:** referenced from `docs/workflows/execute.md` step 3 and from `agents/executor-rules.md`; the argument it receives matches the expected parameter.
> **Status: VERIFIED**

Why good: each level checked separately, with a path, a count, the symbols and the call site.

**FAILED, shown by running it.** Truth: `validate-commit.js rejects commits missing scope parentheses`.

> **Method:** `grep -n "scope" bin/validate-commit.js`: lines 34–41, regex `/^(feat|fix|refactor|test|docs|chore)\(/` requires an opening paren only.
> **Ran:** `echo "feat(: test" | node bin/validate-commit.js`: exit 0 (accepted).
> **Status: FAILED.** An empty scope `feat(: desc)` is accepted; the truth does not hold for that edge case.

Why good: it did not trust the code's intent; it ran an edge case and quoted the exit code.

**Missing wiring caught.** Key link: `check-output.js imports and calls feedback-loop.js extractFeedback()`.

> **Method:** `grep -n "feedback-loop\|extractFeedback" bin/check-output.js`: zero matches. `feedback-loop.js` exists (172 lines) and its own test passes (229 lines), but `grep -rn "require.*feedback-loop" bin/` finds no consumer.
> **Status: FAILED:** exists and tested, never wired.

Why good: levels 1 and 2 pass, level 3 fails. This is the most common gap: code that exists and is tested but that nothing calls.

**A mismatch between layers.** Truth: `config flags features.graph and features.guard exist with defaults`.

> **Method:** `grep "graph\|guard" lib/config-schema.json`: zero matches; `grep` in `lib/config.cjs` finds both in the defaults (lines 426, 428).
> **Status: FAILED.** The defaults exist but schema validation strips unknown fields on load, so they are unreachable.

Why good: config needs schema, defaults and code to agree; checking one layer misses the mismatch.

**A planning gap told apart from an execution failure.** Truth: `all path regexes consolidated into one shared module`.

> **Method:** `grep -rn` finds two inline copies in `commands/misc.md`, a file created by later work after this plan was written.
> **Assessment:** every planned task was done; the copies are out of the plan's reach. Recorded as a follow-up under the gaps summary, attributed to planning order, not to this work.

Why good: code that changed after the plan was written is a planning gap; calling it an execution failure would be a false FAIL.

## Bad

**A blanket pass.** Must-haves: 5 truths, 3 artifacts, 2 links.

> All must-haves have been verified. The implementation matches the plan. Files exist and are properly connected. Status: passed.

Why bad: no must-have listed, no path, no line, no command output. It restates the plan as passing and would miss every stub, orphan and broken link.

**Stopping at existence.** Must-have: `lib/audit-checks/index.cjs`, over 100 lines.

> **L1:** exists, 142 lines. **Status: VERIFIED**

Why bad: 142 lines of `// TODO: implement` stubs would pass this. Levels 2 and 3 were skipped.

## Where gaps usually are

In past verifications, about a third of gaps were missing wiring (exists and tested, never imported or called), a quarter were missing or never-run tests (excluded from CI, skipped), and the rest were layer mismatches, planning-order issues and schema gaps. Look at wiring first.
