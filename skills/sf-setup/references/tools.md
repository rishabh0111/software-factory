# Installing and signing in to tools

Show each command before running it, and run it only on the user's yes. Re-check the tool afterwards. Unattended, run none of these: record the tool as `pending` with its install or sign-in command.

## GitHub CLI (`gh`)

| OS | Install |
|---|---|
| Windows | `winget install --id GitHub.cli -e` |
| macOS | `brew install gh` |
| Debian/Ubuntu | Follow https://github.com/cli/cli/blob/trunk/docs/install_linux.md (adds GitHub's apt repository) |
| Fedora/RHEL | `sudo dnf install gh` |

Sign in (the user runs this; it's interactive): `gh auth login`

Check: `gh auth status`

## GitLab CLI (`glab`)

| OS | Install |
|---|---|
| Windows | `winget install --id GLab.GLab -e` |
| macOS | `brew install glab` |
| Linux | Follow https://gitlab.com/gitlab-org/cli#installation (packages for most distributions) |

Sign in (the user runs this; it's interactive):

- gitlab.com: `glab auth login`
- self-managed: `glab auth login --hostname <host>`, e.g. `glab auth login --hostname gitlab.example.com`. It asks for a personal access token created at `<host>/-/user_settings/personal_access_tokens` with the `api` scope. If the instance has no HTTPS (the remote URL starts with `http://`), add `--api-protocol http`.

Check: `glab auth status` or `glab auth status --hostname <host>`

## Docker

| OS | Install |
|---|---|
| Windows | `winget install --id Docker.DockerDesktop -e`. Needs WSL 2 and usually a restart; the user finishes it |
| macOS | `brew install --cask docker`, then open Docker Desktop once |
| Linux | Follow https://docs.docker.com/engine/install/ for the distribution. Don't pipe a remote script into a shell |

Check: `docker info`. "Cannot connect to the Docker daemon" means it's installed but not running: ask the user to start Docker Desktop, or `sudo systemctl start docker` on Linux.

## Node.js (needed for the browser MCP servers, which run through `npx`)

| OS | Install |
|---|---|
| Windows | `winget install --id OpenJS.NodeJS.LTS -e` |
| macOS | `brew install node` |
| Linux | The distribution's `nodejs` package, or https://nodejs.org |

Check: `node --version` and `npx --version`.

## Scanners (section M)

Deterministic checks that stages run on a run's diff when installed: `gitleaks` for secrets, `osv-scanner` for known-vulnerable dependencies. Recommend both for any repo with a forge remote. Pin the exact version: look up the latest release, show it, and install that version. Never an unpinned `latest` script piped into a shell.

| Tool | Find the release | Install pinned |
|---|---|---|
| gitleaks | `gh release view --repo gitleaks/gitleaks --json tagName -q .tagName` (or the releases page) | Go: `go install github.com/zricethezav/gitleaks/v8@v<version>`. Windows: `winget install --id Gitleaks.Gitleaks -e --version <version>`. Otherwise download `gitleaks_<version>_<os>_<arch>.tar.gz` and `gitleaks_<version>_checksums.txt` from the release, check the SHA-256, and put the binary on PATH |
| osv-scanner | `gh release view --repo google/osv-scanner --json tagName -q .tagName` | Go: `go install github.com/google/osv-scanner/v2/cmd/osv-scanner@v<version>`. Otherwise download the release binary for the OS and check it against the release's `osv-scanner_SHA256SUMS` |

Check: `gitleaks version` and `osv-scanner --version` print the pinned version. Add each working one to the `tools.scanners` list; a skipped install goes under `pending:` with its command, and a declined one is left out.

The ecosystem's own advisory command needs no extra install: add `npm-audit` to the list when the repo has a `package-lock.json` and `npm audit --audit-level=high` runs, and `pip-audit` when it is installed for a Python repo.

A secret-scan commit hook is offered with the other local gates: [pre-commit.md](pre-commit.md#secret-scan).
