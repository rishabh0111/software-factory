# software-factory

A set of agent skills that takes software work from an idea to a merged, verified change. The skills are in `skills/`; `software-factory` is the entry point and the `sf-*` skills are its stages.

- Every skill follows [docs/skill-conventions.md](docs/skill-conventions.md): file layout, config fields, shared rules and writing rules.
- Keep each `SKILL.md` under 10,000 characters. Put detail in `references/` and `assets/`.
- Plain style: short sentences, specific and checkable rules, no marketing words.
- A skill that reads a new config field adds it to `skills/sf-setup/assets/config-template.yaml` and to `sf-setup`'s questions.
- Scripts in `skills/*/scripts/` keep LF line endings (see `.gitattributes`) and stay executable. Check them with `bash -n` or `node --check` after any change.
