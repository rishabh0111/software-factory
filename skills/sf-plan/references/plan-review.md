# Plan review

A read-only review of tickets and plans before anything is built, by a context that didn't write them. The reviewer reports; the planner (`sf-plan`) revises. Run everything from the repo root; paths starting `runs/` are under `.software-factory/`.

## When

- `sf-plan <run-id>`: once, after section 5, over `tickets.md` and every plan written in this call.
- `sf-plan <run-id> plan <ticket-id>`: over that one plan, with `tickets.md` for context.

Each review is a `## Review <n>` section appended to `runs/<run-id>/plan-review.md`. It has one or two rounds, never more; in the light lane, one unless a critical was accepted (section 5).

Decisions logged here go to `runs/<run-id>/decisions.md` (gitignored), never to `.software-factory/decisions.md`.

## 1. Pick the lenses

Decide from the plans' `Files` lists and the tickets' `Delivers` lines. Path scopes are the ones in `sf-verify`'s [gates.md](../../sf-verify/references/gates.md#scope).

| Lens | Applies when | Brief |
|---|---|---|
| Engineering | always | [lenses/engineering.md](lenses/engineering.md) |
| Design | a plan creates or changes something a person sees or operates: a `frontend` path, or a `Delivers` line describing a screen, page, form, message or interaction | [lenses/design.md](lenses/design.md) |
| Developer experience | a plan adds or changes a surface other developers call or configure: an `api` path, CLI commands, flags or exit codes, exported symbols of a package others import, a config or file format users write, a webhook or event payload | [lenses/devex.md](lenses/devex.md) |

Record each lens as applied or not applied, with the reason in a few words. When unsure whether design or developer experience applies, apply it: an empty pass costs little.

## 2. Prepare

1. Record `git hash-object` for `tickets.md` and each plan under review, and the output of `git status --porcelain`. `runs/` is gitignored, so the hashes are what show whether the reviewer changed a plan.
2. Write the prompt file `runs/<run-id>/plan-review-prompt-<n>-<r>.md` with the script, from the repo root:

   ```
   bash <this skill>/scripts/plan-review-prompt -r <run-id> -s <slug> -n <n> -k <r>      -l engineering,design,devex -p <plan paths, comma-separated> [-q <prerequisite plans>] [-1 <round-1 file>]
   ```

   `-l` lists the applied lenses (engineering is always added). It fills the reviewer prompt ([../assets/reviewer-prompt.md](../assets/reviewer-prompt.md)), appends each applied lens file in full, then the `## Checks on an Interfaces block` section of [module-design.md](module-design.md), and prints the path. The reviewer reads only this file and the repo; it doesn't need the skill folder. If the script can't run, build the same file by hand in that order.
3. For round 2, first write round 1's findings table and the planner's decisions table to `runs/<run-id>/plan-review-round1-<n>.md` and pass it as `-1`; the script pastes it under `## Round 1 (data)`.
4. The prompt never names `holdouts.dir` or quotes a scenario, and never includes the planner's reasoning beyond what the plans say.

## 3. Run the reviewer

The reviewer is never the context that wrote the plans. In order of preference:

1. **Second opinion.** `tools.second_opinion` from config, if it isn't `none` or `pending`. A different model family catches different mistakes. Short prompt for every CLI: `Read .software-factory/runs/<run-id>/plan-review-prompt-<n>-<r>.md and follow it exactly. Do not create, modify or delete any file.`

   | `second_opinion` | Command |
   |---|---|
   | `codex` | `codex exec --sandbox read-only "<short prompt>"` |
   | `claude` | `claude -p --permission-mode plan "<short prompt>"` |
   | `gemini` | `gemini -p "<short prompt>"`, with its read-only or plan approval mode if `--help` lists one |
   | `opencode` | `opencode run --agent plan "<short prompt>"` |

   Never add flags that skip approvals (`--yolo`, `--dangerously-*`, `--approval-mode yolo`). Never pass tokens on the command line. If a flag is rejected, check `<cli> --help` once for the read-only mode. If the CLI fails, times out or isn't signed in, fall back to a subagent and record why.
2. **Subagent.** A fresh subagent with only read and search tools (in Claude Code, the `Explore` type), given the prompt file's contents. Its final message is the output.

In the full lane, when a second opinion is configured, run both the second opinion and a subagent on the same prompt file, record both outputs, and mark in the Decisions table the findings both raised (`both`). A critical only one voice raised is still decided on its quote, but say which voice raised it.
3. **None.** If the host has neither, don't review your own plans. Write the review section with `Reviewer: none (<reason>)` and `rounds=0`, append a line to the run's `decisions.md`, and list it in the report so a person knows the plans went unreviewed.

Afterwards compare the hashes and `git status --porcelain` with step 2. If anything changed, the review wasn't read-only: don't use its output, don't revert anything yourself, note the changed files in the review section, and try the next reviewer in the list once.

If the reply lacks the findings table (or the "no findings" sentence) or the final `critical=<n> high=<n> medium=<n> low=<n>` line, it was cut short: run the same reviewer once more. If the second reply is also incomplete, record it as it is with `Reviewer: <name> (incomplete output)` and treat the review as not done for that round: try the next reviewer once. Never fill in a missing table or count yourself.

Findings the reviewer put under "Low confidence" are read but not decided one by one; promote one to the table only if you can quote what motivates it.

## 4. Classify and decide

For each finding, the planner decides, in the `Decisions` table under that round:

| Class | What it is | What the planner does |
|---|---|---|
| Mechanical | One clearly right answer that stays inside the spec: a name that doesn't match `Produces`, a missing test name, a wrong path, an unpinned failure mode, work the spec doesn't ask for | Apply it. Record the row; it isn't shown at the gate |
| Taste | Several reasonable answers: two viable interfaces, a borderline cut, a reviewer recommendation that differs from the plan with a fair point | Decide, preferring the smaller change, the explicit option over the clever one, and reuse over new code. Record the row, append it to the run's `decisions.md`, and list it at the gate |
| User challenge | The fix would change what the spec or user asked for: add, drop, merge or split a capability; change a success check, constraint, non-goal or must-not-change item; change an interface the spec fixes; or the reviewer argues the spec's premise is wrong. Also: the plan needs an exception to a constitution MUST, or would contradict an ADR | Decide whether to keep the spec or to accept the change. See below |

A user challenge has two outcomes:

- **Spec stands.** The planner keeps the spec as written. This is a decision, not an open item: the row says `spec stands: "<spec line, quoted>" (<spec ID>)` and why the reviewer's point doesn't outweigh it. Append it to the run's `decisions.md` with the subject `spec stands <finding ID>`, list it at the plan gate, and list it under `For the merge gate:` in `state.md`'s `## Plan` section so the person deciding the merge sees it. It doesn't stop an unattended run.
- **Open.** The planner thinks the spec should change. Only a person can approve that, so the row stays `open` and the plan gate shows it. Unattended, it stops the run (the skill's section 7).

A low-severity finding about wording or typing (a type annotation, a parameter name, how a doc line reads) is never a user challenge, even when it says "ask the spec owner". Class it mechanical if it fits inside the spec, otherwise taste; a taste decision that would mean changing the spec is rejected with the spec line quoted.

A constitution conflict is fixed in the plan, never by reinterpreting the rule. If the work truly needs the exception, it's a user challenge whose row states why the exception is needed and which simpler option was rejected and why; it stays `open` for a person (a `spec stands` decision can't waive a MUST). An ADR contradiction is handled the same way, quoting the ADR ("Contradicts ADR-0007, but worth reopening because ...").

Any other finding the planner thinks is wrong is rejected with a reason that quotes the spec, plan or `path:line`. Rejecting a critical finding needs that quote; "disagree" isn't a reason.

Before revising, copy each plan and `tickets.md` that will change to `runs/<run-id>/plans/<id>.r<round>.md` and `runs/<run-id>/tickets.r<n>-<round>.md`, so the reviewed version can be compared with the revision.

Revise `tickets.md` and the plans for every accepted finding. Ticket changes follow [slicing.md](slicing.md): new IDs from `Next id`, `dropped` with a reason, never renumber. Re-run `scripts/tickets-check` and the plan self-check in [plan-format.md](plan-format.md) on every changed plan.

A finding accepted as "out of scope, worth doing later" is a deferred item: one line with what and why, listed at the gate and under `For the merge gate:` in `state.md` so `sf-ship` puts it in the PR description.

## 5. Second round

Run round 2, with the same lenses, when round 1 led to any accepted critical or high finding, or to a ticket being added, split, merged or dropped. Otherwise stop after round 1.

In the light lane (`Lane: light` in `state.md`), round 2 runs only when round 1 led to an accepted critical finding: a reviewer must see that the fix landed. Otherwise record `round 2 skipped: light lane` under the round's decisions. The other exception is a revised `Estimate:` line in `tickets.md` that no longer fits the light lane (more than 150 production lines, or more than one batch). Then the conductor will move the run to the full lane, so apply the rule above as for the full lane and add a line under Notes in `state.md` saying the estimate is over the light limit.

Round 2 reviews the revised files and checks that each accepted round-1 finding landed. The planner then decides round 2's findings as in step 4. There is no round 3. A critical finding still open when the review ends (after round 1 or 2) stops the stage (set `Next` to a person reviewing `plan-review.md`). Open user challenges go to the gate in the skill's section 7; unattended, they stop the run.

## 6. Record

Append to `runs/<run-id>/plan-review.md`:

```markdown
## Review <n>: <tickets + T1, T2 | T4>

### Round <r>

- Reviewer: <codex | claude | gemini | opencode | subagent | codex + subagent | none> (<reason for any fallback>)
- Lenses: engineering; design: <applied | not applied> (<why>); devex: <applied | not applied> (<why>)
- Hashes before: tickets.md <hash>; plans/T1.md <hash>; ...
- Date: YYYY-MM-DD

<reviewer output, unedited>

#### Decisions

| Finding | Class | Decision | Applied in |
|---|---|---|---|
| E-1 | mechanical | accepted: T3 Consumes renamed to `loadInvoice(id)` | plans/T3.md |
| E-3 | taste | rejected: kept one module; the split adds a seam with one adapter | none |
| D-2 | user challenge | open: CAP-2 requires an export; reviewer proposes dropping it | none |
| X-1 | user challenge | spec stands: "maxLength truncates at the last separator before the limit" (CAP-4); a hard cut would break CAP-4's success check | none |

sf-plan review=<n> rounds=<r> reviewer=<name> open-critical=<n> open-user-challenges=<n> taste=<n> spec-stands=<n>
```

The status line ends each review section and is the last line of the file. `open-critical` counts critical findings from the latest round not accepted or rejected with a quote; `open-user-challenges` counts user-challenge rows still `open`; `taste` counts taste rows in this review; `spec-stands` counts user-challenge rows decided `spec stands`. The conductor checks the last line.

When a person answers at the gate, append to the same review section:

```markdown
### Gate

- Approved by: <name or "the user">, YYYY-MM-DD
- D-2: <spec stands | change approved, back to sf-spec>
- Spec-stands decisions: <accepted as listed | changed: ...>
- Taste decisions: <accepted as listed | changed: ...>

sf-plan review=<n> rounds=<r> reviewer=<name> open-critical=<n> open-user-challenges=0 taste=<n> spec-stands=<n>
```

## The reviewer prompt

The prompt text is [../assets/reviewer-prompt.md](../assets/reviewer-prompt.md), with placeholders `{{RUN_ID}}`, `{{SLUG}}`, `{{PLANS}}` and `{{PREREQ_PLANS}}`. Don't fill it by hand: [../scripts/plan-review-prompt](../scripts/plan-review-prompt) fills the placeholders and appends the lens files and the module-design checks (section 2).
