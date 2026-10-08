# CI and dependency updates

## K. A minimal CI job

Ask when Explore found no CI job that runs the test command on every PR/MR (`code.ci: missing`). Branch protection (G) requires a passing pipeline, and without one the merge gate falls back to a person. Recommend **yes**. Unattended: write nothing; record `code.ci: pending` with "re-run sf-setup attended and answer the CI question" under `pending:`.

What the job runs: `commands.install`, then `lint`, `typecheck`, `test` and `build`, in that order, skipping any that is `none` or `unknown`. Add `npm audit --audit-level=high` when `tools.scanners` lists `npm-audit` (or `pip-audit` likewise). Use only commands the baseline recorded as `pass`; a red one goes in only if the user says so, since it would fail every PR from the start. No secrets: the job needs none, and CI never gets production secrets.

Pin everything. Show each pinned value before writing.

- **GitHub Actions:** pin each action to a full commit SHA with the tag as a comment. Resolve the SHA of the release you show: `git ls-remote https://github.com/actions/checkout 'refs/tags/<tag>^{}'` (or the plain tag line when there is no `^{}` line). Set the runtime version from the repo (`.nvmrc`, `engines`, `.python-version`, `go.mod`).

```yaml
# .github/workflows/ci.yml
name: ci
permissions:
  contents: read
on:
  pull_request:
  push:
    branches: [<default branch>]
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@<sha> # <tag>
        with:
          persist-credentials: false
      - uses: actions/setup-node@<sha> # <tag>   (or setup-python, setup-go… for the stack)
        with:
          node-version: <from the repo>
      - run: <commands.install>
      - run: <commands.lint>
      - run: <commands.typecheck>
      - run: <commands.test>
      - run: <commands.build>
```

- **GitLab CI:** pin the image by version and digest (`image: node:<version>@sha256:<digest>`; get the digest with `docker buildx imagetools inspect node:<version>`, or by version alone if Docker isn't available, and say so).

```yaml
# .gitlab-ci.yml
check:
  image: <image>:<version>@sha256:<digest>
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - <commands.install>
    - <commands.lint>
    - <commands.typecheck>
    - <commands.test>
    - <commands.build>
```

- **Other CI:** show the same steps and ask the user to add them.

After writing, record `code.ci: pending` until a pipeline has run green on a PR/MR, then `present`, and list the file under `code.ci_files`. The file is CI config: later runs treat changes to it as needing a person's yes. On GitHub, once it has run, offer to add its check name to the branch protection's required checks ([protect-branch.md](protect-branch.md)).

## N. Dependency updates

Ask when no Renovate or Dependabot config was found and the remote is on GitHub or GitLab. Recommend **Renovate** (works on both, groups updates, and the dependency-upgrade path lets it make the bump); offer Dependabot on GitHub as the simpler choice, or **skip**. Unattended: skip and log it.

- Renovate: write `renovate.json` with `{"$schema": "https://docs.renovatebot.com/renovate-schema.json", "extends": ["config:recommended"], "prConcurrentLimit": 5}`. The user installs the Renovate app (GitHub) or runner (GitLab); that step is theirs, so record `code.dependency_bot: pending` until they confirm.
- Dependabot: write `.github/dependabot.yml` with one `updates` entry per ecosystem found (`npm`, `pip`, `gomod`, `cargo`, `github-actions`), a weekly schedule (`schedule.interval: weekly`) and at most five open PRs (`open-pull-requests-limit: 5`). Record `code.dependency_bot: dependabot`.
