# Recording evidence

Every gate's result is a record bound to the content it ran on. A record proves a gate passed only while the working tree's content fingerprint (`wtree.sh`) still equals the one in the record.

## The record

One JSON object per line in `.software-factory/runs/<run-id>/evidence/records.jsonl`:

```json
{"ts":"2026-10-07T09:12:44Z","label":"test","cmd_sha256":"<64 hex>","exit":0,"wtree":"<40 hex>","log":"evidence/test.log"}
```

| Field | Meaning |
|---|---|
| `ts` | UTC time the command finished |
| `ran_ts` | on a carried record only: the `ts` of the record it was copied from, so age counts from when the gate really ran |
| `label` | the gate name: `build`, `lint`, `typecheck`, `test`, `regression`, `floor-guard`, `scanners`, `mutation`, `coverage`, `holdouts`, `migrations`, `eval`, `app`, `api`, `explore`, `design`, `dx`, `perf`; and step records that feed a gate: `test-rerun-<n>`, `regression-<n>`, `scan-<tool>`, `migrate-up-<n>`, `migrate-down`, `perf-head-<n>` |
| `cmd_sha256` | SHA-256 of the exact command string, as the recorder builds it below; no other normalisation. A changed command is a different record |
| `exit` | the command's exit code |
| `wtree` | the fingerprint, present only when it was the same before and after the command. Empty when the content changed during the run |
| `log` | the full output, relative to the run folder |

The command itself is in the log header, not in the record, so the JSON never needs escaping and a secret in a command line doesn't spread further.

Gates that aren't a single command (holdouts, app, explore, design, dx, perf) get a record too: `label` is the gate, the command is a short description (`holdout runner SPEC-cart`), `exit` is 0 for pass and 1 for fail, and `log` points to the summary or the checker's results file. Write these lines yourself with the values typed out, for example `echo '{"ts":"...","label":"app",...}' >> <run>/evidence/records.jsonl`; `cmd_sha256` is the hash of the description, and `wtree` follows that gate's rule (`W` only when `wtree.sh` printed `W` both before and after).

## The recorder

`.software-factory/bin/record.sh`, copied there by `sf-setup`. Run it from the repo root. It takes the command as arguments after `--`, never as a `bash -c` string held in a variable: agent harnesses refuse or can't check a shell string they can't read, so an unattended run would have every gate refused.

```bash
bash .software-factory/bin/record.sh <label> .software-factory/runs/<run-id>/evidence/<label>.log -- <command> [args...]
```

- Write the command's words literally: `-- npm test`, `-- node .software-factory/bin/floor-guard.mjs --base main`.
- A configured command that needs the shell (`&&`, `|`, redirects) goes in as `-- bash -c '<the literal command from config>'`, with the text written out, not a variable.
- It writes the log header (`cmd`, `commit`, `fingerprint`, `date`), appends the output to the log only, appends `--- exit: <code>`, then appends the record to `records.jsonl` in the same evidence folder. On the terminal it prints only `recorded <label> exit=<n> wtree=<w>`, plus the last 5 output lines when the exit isn't 0; read the log for the rest. `record.sh --tee <label> <log> -- ...` also echoes the full output.
- It exits with the command's own exit code. Exit 125 means the evidence couldn't be written (bad arguments, a log outside an evidence folder, a failed write): the gate is `error`.
- `cmd_sha256` is the hash of the command string: the arguments joined by single spaces, or the `<s>` of `bash -c <s>`. So it matches the hash of the config string. `bash .software-factory/bin/record.sh --hash -- <command>` prints it without running anything.
- The conductor's setup check at run start makes `bin/` match the installed `sf-setup/scripts/`. If `.software-factory/bin/record.sh` is missing anyway (a stage called directly on an old setup), copy it from `sf-setup/scripts/` into `.software-factory/runs/<run-id>/bin/` beside a copy of `wtree.sh`, run it from there, and say in Notes and the report to run `sf-setup upgrade`. If it exists but differs from the installed copy (`cmp -s`), keep using `bin/` for the whole run, so fingerprints stay comparable, and write `bin/ older than installed sf-setup; run sf-setup upgrade after this run` in Notes and the report. Never switch copies silently.

Rules:

- The recorder never changes the exit code. A bookkeeping failure (can't write the log) is reported, and the gate is `error`; it never turns a failing command green.
- The fingerprint is taken before the command starts and again after it ends. If they differ, the command changed tracked or untracked content while it ran (a generated file that isn't gitignored, a formatter, a snapshot update). The record gets no `wtree`, so the gate can't count as passed. Report which files changed (`git status --porcelain`) as the reason.
- Several records for the same label are fine. The latest one counts.
- Don't pass the environment from a `.env` file into the command unless the project's own command loads it. Evidence must come from the same environment a developer or CI would use.

## Freshness

A gate's `pass` is current when all of these hold:

1. its latest record has `exit` 0
2. the record's `wtree` is a 40- or 64-character hex string
3. it equals the current output of `bash .software-factory/bin/wtree.sh`
4. its `cmd_sha256` equals the hash of the command the config names now (`record.sh --hash -- <command>`)
5. it is younger than the maximum age: `limits.evidence_max_age_h` from config, else 24 hours, counted from `ran_ts` when present, else `ts`. Dependencies, services, advisories and dates move even when the content doesn't; a day-old pass is re-run at ship time, not trusted

If any fails, the result is stale: re-run the gate. Committing the exact tested content doesn't change the fingerprint, and neither does a rebase that keeps the content. Any new untracked source file does.

## Carrying records over a .software-factory-only commit

A commit confined to `.software-factory/` (a `verify.md` fix, a setup update to `bin/` scripts or `config.yaml`, decision or lesson lines) changes the fingerprint but not the product. Records from gates whose inputs didn't change stay good: re-stamp them instead of re-running. The `verify.md`-only commit is one case of this rule.

1. Let `W0` be the old fingerprint and `W1` the new one. List the changed paths with `git diff --name-only W0 W1`. If any path is outside `.software-factory/`, or git can't read `W0`, nothing carries: restart as usual.
2. For each changed path, mark the gates that must re-run. A gate carries only when no changed path marks it.

| Changed path | Gates that re-run |
|---|---|
| `verify.md`, `verify/` | app, API contract, migrations, explore, design, DX, and perf in the web fallback (they follow `verify.md`); scope, and so every gate, when its `API files:` or `Prompt files:` line changed |
| `bin/floor-guard.mjs` | floor-guard |
| `bin/record.sh` | none: it records, it doesn't judge. Carried records are re-stamped |
| `bin/wtree.sh` | all: it defines the fingerprint, so nothing carries |
| any other file in `bin/` | every gate that runs it |
| `config.yaml` | a gate whose command hash no longer matches (freshness rule 4); gates 7 to 12 when `app` or `tools` changed; scanners when `tools.scanners` changed; mutation, coverage and perf when `quality` changed; evals when `commands.eval` changed; holdouts when `holdouts` or `commands.install`/`run` changed; floor-guard when `code` changed; gates 1 and 2 when `baseline` changed and they were `pre-existing`. `limits.evidence_max_age_h` changes only freshness rule 5. Other keys (`policy`, `tracker`, other `limits`) no gate reads |
| `decisions.md` | floor-guard (its append-only check) |
| `lessons.md`, `constitution.md`, `out-of-scope/`, `maps/` | none: no gate reads them |
| `specs/` | holdouts, app, API contract, explore, design, DX (they check behaviour against the spec), only when the diff (`git diff W0 W1 -- .software-factory/specs/`) changes a capability: a line inside a `### CAP-<n>` block (Intent, Success, Failure paths), a capability added or retired, or `Data`, `Constraints`, `Non-goals` or `Do not touch`. Holdouts then re-run targeted on those capabilities ([holdout-runner-prompt.md](holdout-runner-prompt.md#full-or-targeted)). A change only to `Overrides`, the frontmatter or notes (`Why`, `Assumptions`, `Open questions`, `Clarifications` that edit no capability) re-runs none: carried records are re-stamped |
| anything else under `.software-factory/` | all |

3. For each carrying gate whose latest record has `wtree` `W0`, and whose `cmd_sha256` still matches the config command, append a copy of that record with `ts` now, `ran_ts` the original's (`ran_ts` if it had one, else its `ts`), `wtree` `W1` and `"carried_from":"W0"`, values typed out.
4. Holdouts: the runner's summary names the commit it ran on. It still counts when holdouts carry and `git diff --name-only <its sha> HEAD` lists only `.software-factory/` paths; say `carried from <sha7>` in the evidence line.
5. Re-run the marked gates on `W1`.
6. The report's Notes list the changed `.software-factory/` paths, the carried gates and the re-run gates.

## Reading logs

Quote just the lines that matter for the verdict, such as the summary with its counts, the name and assertion of a failing test, or the score. Read the whole log before deciding; a pass summary above an error later in the output is not a pass. Check that tests actually ran: `0 tests`, `no tests collected` or an empty suite is a fail for the test gate.
