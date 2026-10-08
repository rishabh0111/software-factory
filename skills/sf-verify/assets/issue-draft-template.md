---
title: <area and symptom, never a guessed cause: "Saving an address with an apostrophe returns a 500 on /settings">
labels: [bug]
state: draft
severity: <critical | high | medium | low>
source: sf-verify <QA mode | maintain mode | gate explore | gate dx | gate test>, run <run-id>, finding <X-n | DX-n | B-n>
---

> Found by an AI agent during QA (sf-verify, run <run-id>). Not yet triaged.

## Summary

<One sentence: the observed problem and who it affects.>

## Expected

<What should happen at the end of the steps.> Source: <spec line, docs page, verify.md feature map, or the app's own text>.

## Observed

<What happens instead: the screen, message, status code, exit code or final state.>

## Steps to reproduce

Starting state: <fresh launch per verify.md; seed data used, synthetic>.

1. <step>
2. <step>
3. <the step where it goes wrong>

## Environment

- Commit: <full sha> on <branch><, dirty tree: fingerprint <W>>
- Surface: <web at <local URL> | API at <base URL> | CLI `<command>` | job `<name>`>
- Browser tool and viewport: <chrome-devtools | playwright, 1440x900 | n/a>
- Launched with: `<verify.md Launch command>` (environment variable names only)

## Frequency

<2 of 2 attempts from a fresh start.>

## Severity

<critical | high | medium | low>: <who is affected, and whether there is a workaround>.

## Evidence

Local to the run that found it; attach the screenshots when filing.

- <.software-factory/runs/<run-id>/evidence/qa/<file>>
- Console or response excerpt, secrets replaced by `<REDACTED>`:

```
<the few lines that show the problem>
```

## Notes

<Optional. Anything that helps the next investigation. A cause guessed but not shown is labelled "Guess:".>
