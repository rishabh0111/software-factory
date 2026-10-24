# Test quality audit

For [goal-backward-verification.md](../goal-backward-verification.md) Step 7: check that the tests linked to requirements **prove** what they claim. This catches the case every earlier check passes (files exist, are substantive, are wired, the suite is green) while the tests do not actually test the requirement.

## 1. Map requirements to tests

From the plan (each task's **Test** files and steps) and `$REPORT`, list the test files meant to prove each requirement or truth.

## 2. Disabled tests

```bash
grep -rn -E "it\.skip|describe\.skip|test\.skip|xit\(|xdescribe\(|xtest\(|@pytest\.mark\.skip|@unittest\.skip|#\[ignore\]|\.pending|it\.todo|test\.todo|t\.Skip\(" "$TEST_FILE"
```

A disabled test linked to a requirement means that requirement is not tested: 🛑 blocker when it is the only test proving the requirement, ⚠️ warning when other active tests also cover it.

## 3. Circular tests

```bash
grep -rn -E "writeFileSync|writeFile|fs\.write|open\(.*w\)" "$TEST_DIRS"
```

For each match, check whether the same script also imports the system under test. A script that imports the system and writes expected values is **circular**: it proves consistency, not correctness. Other signs: expected values commented "computed from engine" or "captured from baseline"; a filename with `capture`, `baseline`, `generate` or `snapshot` in a test context; expected values added in the same commit as the assertions. A circular test on a requirement is a 🛑 blocker.

## 4. Where expected values come from

When a requirement demands agreement with an external source ("identical to X", "matches Y", "same output as Z"): is X actually invoked or referenced by the test pipeline, and do fixtures hold data captured from it?

| Provenance | Meaning |
|---|---|
| VALID | From the external or legacy system's output, a manual capture, or an independent oracle |
| PARTIAL | Derived mathematically: proves the formula, not the match |
| CIRCULAR | From the system under test |
| UNKNOWN | No provenance: treat as suspect |

## 5. Assertion strength

Classify each linked test by its strongest assertion:

| Level | Examples | Proves |
|---|---|---|
| Existence | `toBeDefined()`, `!= null` | something came back |
| Type | `typeof x === 'number'` | the shape |
| Status | `code === 200` | no error |
| Value | `toEqual(expected)`, `toBeCloseTo(x)` | a specific value |
| Behavioural | multi-step workflow assertions | end-to-end correctness |

A requirement that needs value- or behaviour-level proof, tested only at existence, type or status level, is INSUFFICIENT: ⚠️ warning.

## 6. Quantity

When a requirement names a number of cases ("30 calculations"), count the active, non-skipped cases.

## Result

Fill the **Test quality audit** table of the verification file, then:

```markdown
**Disabled tests on requirements:** {N} ({blocker if a requirement has only disabled tests})
**Circular patterns:** {N} ({blocker if any})
**Insufficient assertions:** {N} (warning)
```

Any blocker here sets the status to `gaps_found` (Step 10, rule 1), whatever else passed.
