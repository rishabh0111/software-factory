# Triage labels

The skills speak in **roles**; `docs/agents/triage-labels.md` maps each role to the label string this tracker uses. Write that file from the template below. On the default answer the two columns match; when the forge already has labels covering a role (`bug:triage` for `needs-triage`, say), put the existing string in the second column so the skills reuse it and create no duplicate.

## Template for `docs/agents/triage-labels.md`

```markdown
# Triage labels

Skills name a role; apply the label string in the second column.

| Role | Label here | Meaning |
|---|---|---|
| `bug` | `bug` | Category: something is broken |
| `enhancement` | `enhancement` | Category: a new feature or improvement |
| `needs-triage` | `needs-triage` | State: a maintainer has to evaluate it |
| `needs-info` | `needs-info` | State: waiting on the reporter |
| `ready-for-agent` | `ready-for-agent` | State: fully specified, an agent can take it unattended |
| `ready-for-human` | `ready-for-human` | State: needs a person to implement or merge |
| `wontfix` | `wontfix` | State: will not be done |

Each triaged ticket carries one category and one state.

`sf-decision-map` uses its own labels on maps and their tickets, never mixed with the roles above:
`decision-map:map`, `decision-map:research`, `decision-map:prototype`, `decision-map:decision-rounds`, `decision-map:task`.
```

## Creating them on the forge

Create every string from the second column and every `decision-map:` label that the forge lacks. Run the list command first and skip the ones already there.

- **GitHub**: `gh label create "<label>" --color <hex> --description "<meaning>"`.
- **GitLab**: `glab label create --name "<label>" --color "#<hex>" --description "<meaning>"`.
- **Bitbucket**: categories use the native `kind` field. State and `decision-map:` strings must exist as issue components, which only an admin can add in the repository settings. List the missing ones for the user in the final report.
- **Local files**: nothing to create; the strings go on `Status:` and `Category:` lines.

Colours, suggested: red `d73a4a` for `bug`, blue `a2eeef` for `enhancement`, yellow `fbca04` for `needs-triage` and `needs-info`, green `0e8a16` for `ready-for-agent`, purple `5319e7` for `ready-for-human`, grey `cccccc` for `wontfix`, and one shared colour for the `decision-map:` set.
