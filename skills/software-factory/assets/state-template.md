# Run <run-id>

- **Status:** in progress   <!-- in progress | waiting for human | done | stopped -->
- **Owner:** <host>/<session> <UTC time>   <!-- refreshed on every update; cleared at finish. Another session finding it under 2 h old asks or stops -->
- **Mode:** attended   <!-- attended | unattended -->
- **Lane:** <set after spec: light | full>
- **Work type:** <feature | large effort | bug | machine failure | security | upgrade | refactor | small change | performance | removal | existing fix | verify upkeep | QA sweep | security audit | architecture>
- **Source:** <issue link, or a one-line summary of the request>
- **Spec:** <path, once written>
- **Branch:** <branch name, once created>
- **Checkout:** <absolute path where the run works and commits: a worktree, or the main checkout>
- **Run files:** <absolute path of .software-factory/runs/<run-id>/ in the main checkout>
- **PR/MR:** <link, once opened>
- **Fix loops:** 0 of <limits.max_fix_rounds>
- **Setup version:** <config `version` the run's stages ran under; updated after a re-check on resume. A state.md without this line is treated as older than the current setup>
- **Browser:** <run-start check: mcp <name> | headless CDP fallback (MCP failed: <error>) | none | n/a (no web UI)>

## Stages

<!-- one line per stage of the chosen path, in order -->
- [ ] triage
- [ ] spec
- [ ] holdout
- [ ] plan
- [ ] build
- [ ] verify
- [ ] review
- [ ] ship
- [ ] learn

## Next

<the one next step, specific enough that a fresh session can resume from this line alone>

## Notes

<!-- The chosen work type and path in one line; any switch to a heavier path or lane, with its reason. Stage skills append their own sections below: ## Triage, ## Spec, ## Debug, ## Build, ## Wayfind, ... -->

<stop reasons, gates waiting on a human, suspicious instructions found in input>
