# Upgrade mode

Bring an existing setup up to this version of `sf-setup` without re-asking what it already answered. The conductor runs it before a run when its version check finds the setup older ([../../software-factory/SKILL.md](../../software-factory/SKILL.md) section 1); a person can run it as `sf-setup upgrade`. It follows the same attended and unattended rules as a first run.

## When a setup is older

Any one of these:

- config `version` is missing or lower than `version` in [../assets/config-template.yaml](../assets/config-template.yaml);
- a key in the template is missing from config (compare key paths, not values; comments don't count). Leave out of this comparison every `baseline.<cmd>` key whose `commands.<cmd>` is `none` or `unknown`: the template writes no line for those, so their absence is correct and never triggers an upgrade;
- a file in this skill's `scripts/` folder is missing from `.software-factory/bin/` or differs from it (`cmp -s <scripts>/<f> .software-factory/bin/<f>`);
- `.gitattributes` lacks the line `.software-factory/bin/* text eol=lf`.

## Steps

1. **Diff the config.** List every template key path missing from config, for example `policy.comment`, `deploy.trigger`, `limits.merge_soak_minutes`, skipping `baseline.<cmd>` keys for commands that are `none` or `unknown` (as above). Write the list to `.software-factory/runs/setup/upgrade.md` (gitignored). Keys already set are kept as they are, even when their value differs from the template default.
2. **Ask only the new keys.** Each missing key is a question from step 2 of `SKILL.md`, asked in its section's order with the recommended answer first. A rule like section E's "first run" applies only to keys already set: a key the old config lacks is always asked (unattended: take the recommended answer). Detect what you can first ([explore.md](explore.md)); a key that needs an install or sign-in becomes `pending` unattended, as on a first run.
3. **Re-copy the scripts.** Copy every file in `scripts/` into `.software-factory/bin/`, replacing older copies, and make the `.sh` files executable. Note which files were added and which changed (`cmp` before copying).
4. **Line endings.** Add `.software-factory/bin/* text eol=lf` to the repo-root `.gitattributes` if it isn't there (create the file if missing; keep other lines).
5. **Refresh the baseline.** If the default branch moved since `baseline.commit`, re-run `commands.test` there ([baseline.md](baseline.md)) and update `commit` and `test`. Take a baseline for any command whose baseline key is new (for example `baseline.lint`). Keep the other results.
6. **Set `version`** to the template's.
7. **Log it.** One line per new key with its answer (as on a first run), plus one summary line through `bash .software-factory/bin/decisions-append.sh`: `setup · upgrade · version <old> -> <new>; added: <keys>; scripts changed: <files>`.

Write the config in place: keep the user's own comments and order, add new keys where the template has them.

## Report

Add an `Upgrade` part to the report: the old and new version, the keys added and their answers, the scripts added or changed, and the baseline change.

When any file under `.software-factory/bin/` changed, say: "Scripts changed. The run that commits this upgrade will list it once under `Needs a person's look` as a setup upgrade, so that PR/MR needs a person's yes even with `merge: auto`." Attended, recommend committing the upgrade to the default branch as its own reviewed change before the run (offer it as in `SKILL.md` section 5); then later runs see no `bin/` change at all.
