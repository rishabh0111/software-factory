# Upstream sources

This file records where each skill, agent and command in software-factory came from: the upstream repo, the commit we copied, and the path in that repo. Use it to find what changed upstream since we copied, then port the fixes you want by hand. Kinds: **as-is** keeps the upstream text under our `sf-` prefix; **renamed** takes one upstream source under a new name; **merged** combines several sources into one skill, so upstream changes have to be applied by intent. A row with several upstream repos prefixes each path with its repo name (`repo:path`). `sf-start` was written here and has no upstream. Run `scripts/upstream-diff.sh <path-to-upstream-clone>` to list upstream commits touching each row's paths.

## Upstream repos

| Name | URL | Commit copied | Licence |
|---|---|---|---|
| mattpocock-skills | https://github.com/mattpocock/skills | `5beb35b040e3de97e54fa9e386d7e42d15c295c2` | MIT |
| superpowers | https://github.com/obra/superpowers | `b739a8af570e10a95898f2bdf6cec97467fa6c12` | MIT |
| gstack | https://github.com/garrytan/gstack | `b616d6c53dd8fc0d8db210444b44a131b553b83e` | MIT |
| gsd-core | https://github.com/open-gsd/gsd-core | `199ef8af028ca94fcede26c8f2455acdbe682a7c` | MIT |
| agent-skills | https://github.com/addyosmani/agent-skills | `aeac41d4d005999432bb7312f7ff06383a91d59d` | MIT |
| compound-engineering-plugin | https://github.com/EveryInc/compound-engineering-plugin | `8673dfb96ad62c5e0cb6bc50fce312e7a66487a0` | MIT |
| security-audit-skill | https://github.com/cloudflare/security-audit-skill | `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` | MIT |
| trailofbits-skills | https://github.com/trailofbits/skills | `a3131740a39291e42fd15b9eac07e0b393ad71b1` | CC-BY-SA-4.0 |
| knowledge-work-plugins | https://github.com/anthropics/knowledge-work-plugins | `bc8f6922cfeea215a202cdcc9f0d299a990889a8` | Apache-2.0 |
| claude-plugins-official | https://github.com/anthropics/claude-plugins-official | `d1adba47161a271799de7b548225d929310046bd` | Apache-2.0 |
| pm-skills | https://github.com/phuryn/pm-skills | `07b34f64ee828df08953f505b7f747aef85ae7c6` | MIT |
| taste-skill | https://github.com/Leonxlnx/taste-skill | `6010f91a9935f1c167dfc500fb1a475681892e6b` | MIT |
| impeccable | https://github.com/pbakaus/impeccable | `936867543ac2576920d663cc9803597f6044f3ac` | Apache-2.0 |

## Skills, agents and commands

| Ours | Upstream repo | Upstream path(s) | Kind |
|---|---|---|---|
| sf-align | mattpocock-skills | `skills/engineering/grill-with-docs` | renamed |
| sf-architecture-review | mattpocock-skills | `skills/engineering/improve-codebase-architecture` | renamed |
| sf-ask | mattpocock-skills | `skills/engineering/ask-matt` | renamed |
| sf-benchmark | gstack | `benchmark` | renamed |
| sf-code-review | mattpocock-skills, agent-skills, gstack, pm-skills | `mattpocock-skills:skills/engineering/code-review` `agent-skills:skills/code-review-and-quality` `agent-skills:references/performance-checklist.md` `agent-skills:references/security-checklist.md` `gstack:review` `gstack:ETHOS.md` `pm-skills:pm-ai-shipping/skills/code-review` | merged |
| sf-debug | mattpocock-skills, superpowers | `mattpocock-skills:skills/engineering/diagnosing-bugs` `superpowers:skills/systematic-debugging` | merged |
| sf-decision-map | mattpocock-skills | `skills/engineering/wayfinder` | renamed |
| sf-design | gstack, impeccable, taste-skill | `gstack:design-consultation` `gstack:design-shotgun` `gstack:design-html` `impeccable:.claude/skills/impeccable/reference/init.md` `impeccable:.claude/skills/impeccable/reference/shape.md` `impeccable:.claude/skills/impeccable/reference/new-work.md` `impeccable:.claude/skills/impeccable/reference/document.md` `impeccable:.claude/skills/impeccable/reference/extract.md` `impeccable:.claude/skills/impeccable/reference/visualize.md` `impeccable:.claude/skills/impeccable/reference/region-map.md` `impeccable:.claude/skills/impeccable/reference/component-review.md` `impeccable:.claude/skills/impeccable/reference/live.md` `impeccable:.claude/skills/impeccable/reference/live-setup.md` `impeccable:.claude/skills/impeccable/reference/generate.md` `impeccable:.claude/skills/impeccable/reference/routing.md` `impeccable:.claude/skills/impeccable/reference/polish.md` `impeccable:.claude/skills/impeccable/reference/bolder.md` `impeccable:.claude/skills/impeccable/reference/quieter.md` `impeccable:.claude/skills/impeccable/reference/distill.md` `impeccable:.claude/skills/impeccable/reference/harden.md` `impeccable:.claude/skills/impeccable/reference/onboard.md` `impeccable:.claude/skills/impeccable/reference/animate.md` `impeccable:.claude/skills/impeccable/reference/colorize.md` `impeccable:.claude/skills/impeccable/reference/typeset.md` `impeccable:.claude/skills/impeccable/reference/layout.md` `impeccable:.claude/skills/impeccable/reference/delight.md` `impeccable:.claude/skills/impeccable/reference/overdrive.md` `impeccable:.claude/skills/impeccable/reference/clarify.md` `impeccable:.claude/skills/impeccable/reference/adapt.md` `impeccable:.claude/skills/impeccable/reference/adapt.native.md` `impeccable:.claude/skills/impeccable/reference/optimize.md` `impeccable:.claude/skills/impeccable/reference/critique.md` `impeccable:.claude/skills/impeccable/reference/audit.md` `impeccable:.claude/skills/impeccable/reference/audit.native.md` `impeccable:.claude/skills/impeccable/reference/hooks.md` `impeccable:.claude/skills/impeccable/reference/doctor.md` `taste-skill:skills/taste-skill/SKILL.md` `taste-skill:skills/taste-skill/README.md` `taste-skill:skills/taste-skill/references/research.md` `taste-skill:skills/taste-skill/references/scenes.md` `taste-skill:skills/taste-skill/references/critique.md` `taste-skill:skills/taste-skill/references/app-screens.md` `taste-skill:skills/taste-skill/library` `taste-skill:skills/taste-skill/assets` `taste-skill:skills/taste-skill/scripts` `taste-skill:skills/taste-skill/evals` | merged |
| sf-devex-review | gstack | `devex-review` | renamed |
| sf-docs-and-adrs | agent-skills | `skills/documentation-and-adrs` | renamed |
| sf-doubt-check | agent-skills | `skills/doubt-driven-development` | renamed |
| sf-execute | superpowers, gsd-core | `superpowers:skills/executing-plans` `superpowers:skills/subagent-driven-development` `superpowers:skills/requesting-code-review` `superpowers:skills/using-superpowers/references` `gsd-core:agents/gsd-executor.md` | merged |
| sf-frontend-ui | agent-skills, impeccable, taste-skill | `agent-skills:skills/frontend-ui-engineering` `impeccable:.claude/skills/impeccable/SKILL.md` `impeccable:.claude/skills/impeccable/reference/craft-floor.md` `impeccable:.claude/skills/impeccable/reference/mode-persuade.md` `impeccable:.claude/skills/impeccable/reference/mode-read.md` `impeccable:.claude/skills/impeccable/reference/mode-operate.md` `impeccable:.claude/skills/impeccable/reference/operate.md` `impeccable:.claude/skills/impeccable/reference/ios.md` `impeccable:.claude/skills/impeccable/reference/android.md` `impeccable:.claude/skills/impeccable/reference/audit.md` `impeccable:.claude/skills/impeccable/reference/audit.native.md` `taste-skill:skills/taste-skill/SKILL.md` `taste-skill:skills/taste-skill/references/tells.md` `taste-skill:skills/taste-skill/references/app-screens.md` `taste-skill:skills/taste-skill/references/type.md` `taste-skill:skills/taste-skill/references/colour.md` `taste-skill:skills/taste-skill/references/motion.md` `taste-skill:skills/taste-skill/references/layout.md` `taste-skill:skills/taste-skill/references/imagery.md` `taste-skill:skills/taste-skill/references/copy.md` | merged |
| sf-glossary | mattpocock-skills | `skills/engineering/domain-modeling` | renamed |
| sf-guard | mattpocock-skills, gstack | `mattpocock-skills:skills/misc/git-guardrails-claude-code` `gstack:careful` `gstack:freeze` `gstack:guard` `gstack:unfreeze` | merged |
| sf-implement | mattpocock-skills | `skills/engineering/implement` | as-is |
| sf-incremental-build | agent-skills | `skills/incremental-implementation` | renamed |
| sf-learn | mattpocock-skills, compound-engineering-plugin | `mattpocock-skills:skills/engineering/retro` `compound-engineering-plugin:skills/ce-compound` `compound-engineering-plugin:skills/ce-compound-refresh` | merged |
| sf-map-codebase | gsd-core, pm-skills | `gsd-core:skills/gsd-map-codebase` `gsd-core:gsd-core/workflows/map-codebase.md` `gsd-core:agents/gsd-codebase-mapper.md` `gsd-core:gsd-core/templates/codebase` `pm-skills:pm-ai-shipping/skills/shipping-artifacts` `pm-skills:pm-ai-shipping/commands/document-app.md` | merged |
| sf-module-design | mattpocock-skills | `skills/engineering/codebase-design` | renamed |
| sf-plan | mattpocock-skills, superpowers | `mattpocock-skills:skills/engineering/to-spec` `mattpocock-skills:skills/engineering/to-tickets` `superpowers:skills/writing-plans` | merged |
| sf-plan-review | gstack | `plan-ceo-review` `plan-eng-review` `plan-design-review` `plan-devex-review` `review/TODOS-format.md` | merged |
| sf-prototype | mattpocock-skills | `skills/engineering/prototype` | as-is |
| sf-qa | agent-skills, gstack | `agent-skills:skills/browser-testing-with-devtools` `gstack:qa` `gstack:qa-only` | merged |
| sf-release-docs | gstack | `document-release` | renamed |
| sf-respond-to-review | superpowers | `skills/receiving-code-review` | renamed |
| sf-setup | mattpocock-skills | `skills/engineering/setup-matt-pocock-skills` | renamed |
| sf-ship | mattpocock-skills, superpowers, agent-skills, gstack, pm-skills | `mattpocock-skills:skills/engineering/pr` `superpowers:skills/finishing-a-development-branch` `agent-skills:skills/shipping-and-launch` `agent-skills:references` `gstack:ship` `gstack:land-and-deploy` `gstack:canary` `gstack:setup-deploy` `pm-skills:pm-ai-shipping/commands/ship-check.md` | merged |
| sf-simplify-code | agent-skills | `skills/code-simplification` | renamed |
| sf-source-check | agent-skills | `skills/source-driven-development` | renamed |
| sf-tdd | mattpocock-skills, superpowers, pm-skills | `mattpocock-skills:skills/engineering/tdd` `superpowers:skills/test-driven-development` `pm-skills:pm-ai-shipping/commands/derive-tests.md` | merged |
| sf-triage | mattpocock-skills | `skills/engineering/triage` | as-is |
| sf-verify | superpowers, gsd-core, pm-skills | `superpowers:skills/verification-before-completion` `gsd-core:agents/gsd-verifier.md` `gsd-core:gsd-core/references/gates.md` `gsd-core:gsd-core/references/thinking-models-verification.md` `gsd-core:gsd-core/references/verification-overrides.md` `gsd-core:gsd-core/references/verification-patterns.md` `gsd-core:gsd-core/references/verifier-evidence-gate.md` `gsd-core:gsd-core/references/verifier-wiring-patterns.md` `gsd-core:gsd-core/references/verify-mvp-mode.md` `pm-skills:pm-ai-shipping/skills/intended-vs-implemented` | merged |
| sf-worktrees | superpowers | `skills/using-git-worktrees` | renamed |
| sf-ci-cd-and-automation | agent-skills | `skills/ci-cd-and-automation` | as-is |
| sf-constraint-driven-development | agent-skills | `skills/constraint-driven-development` | as-is |
| sf-deprecation-and-migration | agent-skills | `skills/deprecation-and-migration` | as-is |
| sf-observability-and-instrumentation | agent-skills | `skills/observability-and-instrumentation` | as-is |
| sf-performance-optimization | agent-skills, pm-skills | `agent-skills:skills/performance-optimization` `pm-skills:pm-ai-shipping/commands/performance-audit-static.md` | merged |
| sf-deploy-checklist | knowledge-work-plugins | `engineering/skills/deploy-checklist` | as-is |
| sf-incident-response | knowledge-work-plugins | `engineering/skills/incident-response` | as-is |
| sf-security-and-hardening | agent-skills | `skills/security-and-hardening` | as-is |
| sf-security-audit | security-audit-skill, pm-skills | `security-audit-skill:skills/security-audit` `pm-skills:pm-ai-shipping/commands/security-audit-static.md` | merged |
| sf-differential-review | trailofbits-skills | `plugins/differential-review/skills/differential-review` | as-is |
| sf-variant-analysis | trailofbits-skills | `plugins/variant-analysis/skills/variant-analysis` | as-is |
| adversarial-modeler (agent, sf-security-deep) | trailofbits-skills | `plugins/differential-review/agents/adversarial-modeler.md` | as-is |
| diff-review (command, sf-security-deep) | trailofbits-skills | `plugins/differential-review/commands/diff-review.md` | as-is |
| code-reviewer (agent, sf-core) | agent-skills | `agents/code-reviewer.md` | as-is |
| security-auditor (agent, sf-core) | agent-skills | `agents/security-auditor.md` | as-is |
| test-engineer (agent, sf-core) | agent-skills | `agents/test-engineer.md` | as-is |
| web-performance-auditor (agent, sf-core) | agent-skills | `agents/web-performance-auditor.md` | as-is |
| guideline-reviewer (agent, sf-reviewers; renamed from code-reviewer) | claude-plugins-official | `plugins/pr-review-toolkit/agents/code-reviewer.md` | renamed |
| code-simplifier (agent, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/agents/code-simplifier.md` | as-is |
| comment-analyzer (agent, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/agents/comment-analyzer.md` | as-is |
| pr-test-analyzer (agent, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/agents/pr-test-analyzer.md` | as-is |
| silent-failure-hunter (agent, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/agents/silent-failure-hunter.md` | as-is |
| type-design-analyzer (agent, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/agents/type-design-analyzer.md` | as-is |
| review-pr (command, sf-reviewers) | claude-plugins-official | `plugins/pr-review-toolkit/commands/review-pr.md` | as-is |
| design-asset-producer (agent) | impeccable | `plugin/agents/impeccable-asset-producer.md` `.claude/skills/impeccable/reference/degraded/asset-producer.md` | merged |
| design-documenter (agent) | impeccable | `plugin/agents/impeccable-documenter.md` `.claude/skills/impeccable/reference/degraded/documenter.md` | merged |
| design-finish-reviewer (agent) | impeccable | `plugin/agents/impeccable-finish-reviewer.md` `.claude/skills/impeccable/reference/degraded/finish-reviewer.md` | merged |
| design-manual-edit-applier (agent) | impeccable | `plugin/agents/impeccable-manual-edit-applier.md` `.claude/skills/impeccable/reference/degraded/manual-edit-applier.md` | merged |

## How to port an upstream change

1. Clone the upstream repo (or `git pull` an existing clone) and run `scripts/upstream-diff.sh <clone>` from this repo to see which rows have new commits.
2. In the clone, read the change: `git diff <sha>..main -- <path>`, with the commit and path from the tables above.
3. For an as-is or renamed row, apply the diff to our copy, keeping our names, cross-references and tool rewrites.
4. For a merged row, read the change and apply its intent by hand to the part of our skill that came from that source.
5. Once ported, update the commit in the repo table only if every row from that upstream is now current.
