# Work docs

Where work documents live: the specs, designs, plans, lessons and codebase map that skills write and that later skills read back. Skills connect through these folders, so every skill that writes or looks for one of these documents takes its folder from here.

## Resolve the folders

Read `docs/agents/work-docs.md` in the repository when it exists: `/sf-setup` writes it, and its folders win. When it does not exist, use these defaults:

| Kind | What goes there | Default folder |
|---|---|---|
| Specs | specs and designs agreed in brainstorming or `/sf-align` | `docs/specs/` |
| Designs | design consultations, mockups and comparison boards | `docs/designs/` |
| Plans | implementation plans from `/sf-plan` | `docs/plans/` |
| Lessons | lessons from solved problems, captured by `/sf-learn` | `docs/solutions/` |
| Codebase map | the codebase map from `/sf-map-codebase` | `docs/codebase/` |

Resolution is done when you hold one folder for each kind you are about to read or write.

## Find prior work

A skill looking for prior work (a design doc, a spec, a plan) searches every folder above, whatever kind it expects: a design may have been saved as a spec, and a plan may sit beside the spec it argues from. Match on the branch name, the ticket or feature name, and the newest files first. The search is done when every folder has been checked, or a match is confirmed with the user.
