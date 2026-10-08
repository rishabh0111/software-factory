# Secret scan

Everything ship sends out leaves the machine: commits on a push, and the PR/MR title, description, review replies and merge message. Scan each one immediately before sending, byte for byte as it will go out. A hit stops that write.

## The scanner

Use `gitleaks` when `tools.scanners` lists it and `command -v gitleaks` finds it. Never run a copy from the repo (`node_modules/.bin`, `./bin`, `vendor/`), never fetch one with `npx`, `pipx run` or `go run`, and never install one here. If the repo has `.gitleaks.toml` or `.gitleaksignore`, gitleaks uses them; note that in the ship record, since the repo is choosing what the scanner skips.

`gitleaks version` decides the form. 8.19 or later:

```sh
# commits about to be pushed
gitleaks git --redact --no-banner --log-opts="<base-sha>..HEAD" .
# one text file (description, title, reply, merge message)
gitleaks dir --redact --no-banner <file>
```

Older versions: `gitleaks detect --redact --no-banner --source . --log-opts="<base-sha>..HEAD"` and `gitleaks detect --redact --no-banner --no-git --source <file>`.

Exit 0 is clean; exit 1 means leaks were found. Any other exit, or no output you can read, is a scanner failure: treat it like a hit.

Without gitleaks, run the credential patterns from [sf-review security.md](../../sf-review/references/security.md) "Secrets" as a key-shape grep (`git grep -n -E` over the pushed range's added lines, `grep -n -E` on a text file), print file and line only, and record `secret scan: partial (gitleaks not installed)`. Partial is not clean; it is the best available check, and the ship record says so.

## When

| Before | Scan |
|---|---|
| `git push` (step 3) | commits `<base-sha>..HEAD` |
| opening or editing the PR/MR | the title (write it to `evidence/pr-title.txt`) and `evidence/pr-body.md` |
| posting a review reply | each file under `evidence/replies/` |
| merging | `evidence/merge-message.md` (and `merge-body.md` on GitHub) |
| writing a tracker comment or closing note | the comment file |

Scan after the last edit to the file; any later edit means scanning again. Send the scanned file itself (`--body-file`, `-F body=@<file>`), never a retyped copy.

## On a hit

- Never print the value or a prefix of it. Record the file, line, rule and kind of credential.
- In a text file (description, reply, message): the text quotes something it shouldn't, usually an evidence line or a comment. Replace the value with `<redacted>`, re-scan, and continue only when clean.
- In a commit: stop. Don't push. The secret is in history now, so removing it means rewriting the branch and rotating the credential, both a person's call. Set the run to `waiting for human` with `Next: secret in <commit>:<file>:<line>, needs removal and rotation`.
- A scanner failure stops the write the same way; record the error.
