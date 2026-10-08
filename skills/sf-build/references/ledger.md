# Ledger format

`runs/<run-id>/ledger.md` is the run's record of what was built, what was found and what was decided. It's what survives a lost session: a controller that resumes reads it and `git log`, not its memory. Other stages read it too: `sf-verify` and `sf-review` look for parked findings and test changes, `software-factory` reports the rulings to the user.

## Rules

- Append only. Never edit or delete a line; a correction is a new line.
- When the required form of a line changes (a setup upgrade on resume, for example `test-change` now citing `SPEC-<slug>/CAP-<n>`), append the line again in the current form with `| amends: <first words of the old line>` at the end. The old line stays; readers take the later one.
- One line per entry, starting with the ticket ID and a colon, then the line type. Fields are separated by ` | `.
- First line: `# Ledger <run-id>`.
- Every line containing `Ruling:` also has `Cost if wrong:`.

## Line types

| Line | When |
|---|---|
| `<id>: start \| base <sha7>` | Before the first dispatch for a ticket |
| `<id>: tests \| <n> files by separate author \| evidence/<id>-red.log` | The test author's tests failed for the expected reason |
| `<id>: tests \| <n> characterisation files by separate author \| evidence/<id>-characterise.log` | A refactor over code with no covering test ([codemods.md](codemods.md#refactors-over-thin-tests)) |
| `<id>: no separate tests \| <reason>` | Refactor with no behaviour change, config-only or docs-only ticket |
| `<id>: codemod \| <tool>@<version> <recipe> \| <n> files \| residue <n> files` | A tool made the change |
| `<id>: review \| <n> critical, <n> important, <n> minor \| review/<id>-r0.diff` | First task review |
| `<id>: fix round <R>/<cap> (<x> addressed, <y> open: <one-liners>; commits <a7>..<b7>)` | After each round |
| `<id>: minor (deferred): <one line>` | A Minor finding, or a re-reviewer's out-of-scope note |
| `<id>: test-change \| <file>[::<test>] \| <what changed> \| <why, citing a spec ID, plan line or root cause>` | An existing test or gate changed: expectation, skip, deletion, suppression, threshold. For an assertion the spec changes, cite `SPEC-<slug>/CAP-<n>`: `sf-verify` accepts that floor-guard finding by rule when the plan also lists the test ([guards.md](guards.md#2-no-test-or-gate-weakened)) |
| `<id>: human-review \| <path> \| <why the ticket needed it>` | A protected path changed, or a bug fix spans more than 5 production files (see guards.md) |
| `<id>: Ruling: <decision> \| <why> \| Cost if wrong: <…>` | Any decision taken on the user's behalf |
| `<id>: parked: <finding> \| Ruling: <why the code stands or why it's deferred> \| Cost if wrong: <…>` | An open finding at the cap |
| `<id>: unfinished: <reason> \| Ruling: <…> \| Cost if wrong: <…>` | The ticket couldn't be finished |
| `<id>: skipped: waits on <other id>` | A prerequisite is unfinished |
| `<id>: verify deferred \| <verify line> \| browser check, no browser MCP \| sf-verify app gate` | A browser `verify` line the controller couldn't run ([guards.md](guards.md#5-the-tickets-check-and-the-suite-pass)) |
| `<id>: complete (commits <a7>..<b7>, review clean)` | Done with no open findings |
| `<id>: complete (commits <a7>..<b7>, <k> parked)` | Done with findings parked at the cap |
| `run: no subagents: roles shared one context, review independence lower` | The harness couldn't start subagents; the build ran inline ([inline-mode.md](inline-mode.md)) |
| `run: task reviews by <cli>` | Inline mode, with `tools.second_opinion` doing the task reviews |
| `<id>: review (self) \| <n> critical, <n> important, <n> minor \| review/<id>-r0.diff` | Inline mode's self-review against the plan |
| `run: pre-existing \| <signature> \| <evidence/baseline.log or config baseline>` | A failure also present in the baseline ([guards.md](guards.md#6-pre-existing-failures)): reported, not blocking |
| `<id>: Ruling: plan defect \| <chain of findings> \| Cost if wrong: <…>` | After round 3, each fix exposed a new failure elsewhere; the ticket goes back to plan or debug ([fix-loop.md](fix-loop.md#rounds)) |
| `run: no worktree: <reason>` | A worktree couldn't be created and the tree was clean ([worktree.md](worktree.md)) |
| `run: <note>` | Anything about the whole run, such as a command found by stack discovery |

## Example

```text
# Ledger 20261007-export-timeout
T1: start | base 4f1c2a9
T1: tests | 1 files by separate author | evidence/T1-red.log
T1: review | 0 critical, 1 important, 1 minor | review/T1-r0.diff
T1: minor (deferred): export.ts grows past 400 lines
T1: fix round 1/5 (1 addressed, 0 open; commits 9b2e011..c4d8f70)
T1: complete (commits 4f1c2a9..c4d8f70, review clean)
T2: start | base c4d8f70
T2: test-change | tests/api/export.test.ts::returns 504 after 30s | timeout now 60s | SPEC-export-timeout/CAP-3 raises the limit to 60s
T2: test-change | test.js::keeps whole words | rewritten by the test author: no longer treats a one-word cut as a hard cut | SPEC-export-timeout/CAP-4 allows "foo" for maxLength 4; implementer's evidence in reports/T2-impl.md
T2: complete (commits c4d8f70..e17a3b2, review clean)
```
