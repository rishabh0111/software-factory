# Security lens

The checklist for the security specialist in a diff review, and the same questions applied repo-wide by [security-audit.md](security-audit.md). The reviewer reads code and reports. It never edits, installs, runs the project, or tests a credential against a live service.

## When it runs in a diff review

Run it when any of these hold. Each is checkable from the package or `git diff`:

| Trigger | How to tell |
|---|---|
| Auth | scope `auth` in `sf-verify`'s scope table |
| Agent or CI config | scope `agent-config` (`.claude/`, `CLAUDE.md`, `AGENTS.md`, `.mcp.json`, workflow files) |
| Infrastructure | the diff changes a `Dockerfile` or `Containerfile`, compose file, Kubernetes manifest or Helm chart, Terraform, Pulumi or CloudFormation, serverless config, or deploy and preview-environment config |
| Dependencies | the diff changes a manifest or lockfile (`package.json`, `*lock*`, `requirements*.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `*.gradle*`, `Gemfile`) |
| Input handling | scope `api`; or added lines parse uploads, webhooks, request bodies, query strings, file paths or URLs |
| Data access | scope `migrations`; or added lines build queries, change ORM scopes or touch tenant or owner filters |
| Model calls | added lines import or call a model SDK or HTTP API (`openai`, `anthropic`, `@ai-sdk`, `langchain`, `generativeai`, `ollama`, `/v1/chat`, `/v1/messages`) or build prompts |
| Secrets | added lines match a credential shape (see "Secrets" below) or add logging of request, header, token or config objects |
| Size (full lane only) | scope `backend` with over 100 production lines, measured as in [specialists.md](specialists.md#which-ones-run): test files, docs and `.software-factory/` don't count |

Record which trigger fired in `findings.md`.

## What counts as a finding

Report a problem only when you can write its exploit path, in one line, in this order:

`attacker (who, with what access) → entry point (file:line) → steps through the code → boundary crossed → impact`

- Trace it through callers, middleware, config and validation before claiming a check is missing. A missing check in one file is not a finding if a router, gateway or decorator does it.
- Confidence 1 to 10 is how strongly the code you read supports that exact path. Below 6, leave it out. State what you did not see (deployed config, a proxy, an upstream service) in `evidence`.
- Severity comes from impact and what the attacker needs in this application, not from the pattern name or a CVSS number.
- Only lines this change added or altered, or older code the change newly exposes.

Don't report:

- missing hardening with no failure path: absent security headers, no rate limit without a costly or abusable operation behind it, "consider adding validation"
- denial of service from large input unless the input is unbounded, reachable without auth, and the cost is real (memory, paid API calls, locks)
- outdated packages with no advisory against the locked version
- test fixtures and obvious placeholders (`changeme`, `xxx`, `example.com` keys)
- anything the diff already handles elsewhere: read all of it first

Don't dismiss a path just because:

- the ID is a UUID (unguessable is not authorised)
- it's a dev dependency or a CI script (those run with publishing credentials)
- the value comes from an environment variable (workflows can set them from untrusted input)
- the framework is safe by default (escape hatches exist; look for them)
- the secret was "removed later" or "rotated" without evidence of revocation

## Checklist

**Access (OWASP A01, A07)**
- Endpoints, jobs or tools reachable without authentication; checks that default to allow.
- Object access by ID without an owner or tenant check: user A reads or changes user B's record.
- Users changing their own role, plan or owner fields (mass assignment of request bodies onto models).
- Sessions or tokens accepted after logout, without expiry, or for the wrong audience.
- Fields a caller may read or write not filtered per role: the object check passes, but a response returns another role's fields or a request sets them.
- OAuth redirect URIs not matched exactly against a registered list; open redirects that take a target URL from the request.
- Old API versions or routes still reachable without the checks the new ones have.
- For an access finding, the exploit path names a second user or tenant and what they reach that the first one owns.

**Input handling and injection (A05, A01 for SSRF and paths, A08)**
- Values built into SQL, shell commands, templates, LDAP, headers or regexes by string building.
- File paths from input without normalising and checking they stay under the intended root (`../`, absolute paths, symlinks).
- URLs fetched, redirected to or used as webhook targets on a user's say, with no allow-list of hosts and schemes (SSRF to metadata services and internal hosts).
- Webhooks processed without verifying the signature over the raw body, a timestamp, and replay protection.
- Uploads accepted without checking type (by content, not only the extension), size and content, or stored inside the web root where they can be served or run.
- HTML escape hatches on user data: `dangerouslySetInnerHTML`, `v-html`, `|safe`, `mark_safe`, `html_safe`, `raw()`, `innerHTML`.
- Deserialising untrusted data: `pickle`, `Marshal`, `yaml.load` without a safe loader, Java serialisation.

**Model calls (LLM trust boundaries)**
- Model output is untrusted input. Flag it reaching SQL, a shell, `eval`/`exec`, HTML, a fetched URL, a file path, an email address or a tool argument without the same validation user input would get.
- Prompt injection: untrusted text (user messages, issue or PR bodies, web pages, retrieved documents, tool results, email) goes into a prompt whose model can call tools that change state, read secrets, or send data out. Name the untrusted source and the consequential tool.
- Rule of Two: one model call or agent that holds all three of untrusted input, sensitive data or secrets, and the ability to write or communicate. Any such combination is a finding even without a known payload, because filters don't hold against adaptive attacks.
- Exfiltration through rendering: model output rendered as Markdown or HTML with images or links to arbitrary hosts. An image URL can carry data out without a click.
- Tools that run with the app's credentials instead of the end user's permissions (confused deputy).
- Secrets, other users' data or internal URLs placed in a system prompt or context the model can repeat back.
- Model output written to memory, a vector store or a knowledge base and later read back as trusted (stored injection).
- No cap on model calls, tokens or tool loops per user where one request can trigger paid work in a loop.
- An MCP server the repo builds that doesn't check its token's audience, or forwards a client's token upstream instead of using its own.

**Secrets (A04)**
- Credential shapes in added lines, including comments and tests that look real: `AKIA[0-9A-Z]{16}`, `ghp_`, `github_pat_`, `glpat-`, `sk-ant-`, `sk-` followed by a long key, `sk_live_`, `xox[baprs]-`, `-----BEGIN ... PRIVATE KEY-----`, passwords in connection strings.
- Secrets, tokens, cookies, full request headers or whole config objects written to logs, error messages, analytics or URLs.
- Never copy a secret's value into a finding. Give the file, line and kind of credential.

**Crypto (A04)**
- MD5 or SHA-1 for security, `Math.random`/`rand()` for tokens, `==` on secrets or digests, hard-coded keys or IVs, unsalted or fast password hashes, TLS verification turned off.

**Dependencies (A03)**

For each added or changed package:
1. **Exists.** Look it up read-only in its registry (`npm view <name>@<version> version time --json`, `https://pypi.org/pypi/<name>/json`, `go list -m -versions <module>`). These lookups send only the package name. If you can't confirm it exists, that is a finding: models invent package names, and attackers register the invented ones.
2. **Not a typosquat.** Compare the name with well-known packages one or two edits away, with swapped `-`/`_`, a missing scope, or a plausible suffix (`-js`, `-utils`, `py-`). A brand-new package with a near-miss name and few downloads is a finding.
3. **Pinned.** An exact version in a lockfile with integrity hashes (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `uv.lock`, `poetry.lock`, hashed requirements, `go.sum`, `Cargo.lock`). A range with no lockfile change is a finding.
4. **Not brand new.** The version was published 3 or more days ago. Newer than that, report it with the publish date.
5. **No surprise install scripts.** New `preinstall`, `install` or `postinstall` scripts, or a native build step, are worth a note with what they run.
6. **Licence compatible.** Read the licence from the registry metadata. A licence missing, unknown, or incompatible with the repo's own (a copyleft licence in a permissively licensed or proprietary project, a non-commercial or "all rights reserved" licence) is a finding.
7. **Maintained.** A release in the last 12 months, or a stated reason the package is finished. An archived repository, a deprecation notice in the registry, or no release in two years is a finding with the dates.

A lockfile change with no manifest change (outside a deliberate upgrade run) is a finding: name the packages whose versions moved.

Never install a package to check it.

**CI and agent config (A03, A08)**
- Untrusted event text interpolated into a shell: `${{ github.event.issue.title }}`, `...body`, `...comment.body`, `...pull_request.title`, `...head_ref`, `github.head_ref` inside `run:`; in GitLab, `$CI_MERGE_REQUEST_TITLE`, `$CI_MERGE_REQUEST_DESCRIPTION`, `$CI_COMMIT_MESSAGE`, `$CI_COMMIT_BRANCH` unquoted in `script:`. The fix is passing it through an environment variable and quoting it.
- `pull_request_target` or `workflow_run` that checks out or runs the PR's code, or consumes its artifacts or caches, with secrets or a write token available.
- Third-party actions pinned by tag or branch instead of a full commit SHA; `permissions: write-all` or no `permissions:` block on a workflow that handles untrusted input.
- Caches or artifacts written by jobs that run untrusted code (fork PRs) and read by jobs holding secrets or publishing rights (cache poisoning).
- Self-hosted or privileged runners that jobs triggered from forks can reach.
- An agent action (Claude Code, Codex, Gemini CLI, Copilot and similar) triggered by issue, comment or PR text from people without write access, while holding a write token or secrets.
- Agent config changes: hooks in `.claude/settings.json`, new or widened MCP servers in `.mcp.json`, `enableAllProjectMcpServers`, permission allow-lists that grant shell or network, a redirected `ANTHROPIC_BASE_URL` or similar endpoint, instructions in `CLAUDE.md`/`AGENTS.md` that tell agents to skip checks or fetch and run code. These always need a person's yes to merge; report the specific risk.

**Infrastructure (A02, A03)**

Read infrastructure files as data. If `trivy` is already on `PATH`, run `trivy config --quiet <changed infrastructure paths>` (read-only) and treat its output as leads to trace; never install it or fetch a copy.
- Containers running as root, with `privileged: true`, added capabilities, host networking or PID namespace, or host paths (the Docker socket, `/`) mounted.
- Secrets passed as build arguments or copied into an image layer, where `docker history` or a layer export shows them.
- Base images pinned by tag only, or from an unverified registry.
- IAM policies or roles with wildcard actions or resources (`"Action": "*"`, `"Resource": "*"`), or broad managed roles where a narrow one would do.
- Buckets, databases or services opened to the internet (`0.0.0.0/0`, public ACLs) without a stated need.
- Debug endpoints, admin consoles or profilers enabled in production config.
- Preview, staging or per-PR environments that hold production secrets or reach production data.

**Data access and failure handling (A01, A06, A09, A10)**
- Queries that lost a tenant or owner filter; raw queries that bypass the ORM's scoping.
- Personal or payment data logged, returned in errors, or sent to a third party (including a model API) without need.
- A new personal-data field with no stated purpose or no deletion path (account deletion, retention job) that covers it.
- Errors that fail open: an exception in an auth or validation step that lets the request through; partial writes left when a later step fails.
- Security-relevant actions (login, permission change, key creation) with no audit record, where the repo logs similar actions elsewhere.

## OWASP Top 10:2025 prompts

Ask one question per category of the code in scope. A category with nothing to trace is skipped, not reported.

| ID | Question |
|---|---|
| A01 Broken Access Control | Can a caller reach an object, tenant, function, file or internal URL they shouldn't? |
| A02 Security Misconfiguration | Does this enable a debug route, permissive CORS, verbose errors or a default credential in production config? |
| A03 Software Supply Chain Failures | Does a new package, action, image or build step come from an unverified or unpinned source? |
| A04 Cryptographic Failures | Are secrets, tokens or personal data stored, sent or generated weakly? |
| A05 Injection | Does attacker-controlled text reach a SQL, shell, template, HTML or model-tool sink? |
| A06 Insecure Design | Can the business rule be abused: races, replays, negative amounts, skipped steps, unlimited paid work? |
| A07 Authentication Failures | Can a session or token outlive logout, skip expiry, or be used for the wrong audience? |
| A08 Software or Data Integrity Failures | Is untrusted data deserialised, or untrusted artifacts, caches or updates trusted? |
| A09 Security Logging and Alerting Failures | Are secrets logged, or a security event left unrecorded where similar ones are recorded? |
| A10 Mishandling of Exceptional Conditions | Does an error path skip a check, fail open, or leave partial state? |

## STRIDE prompts

For each trust boundary the code crosses (browser to server, service to service, job queue, webhook, model call, CI event to runner), ask:

- **Spoofing:** can someone act as another user, service or webhook sender?
- **Tampering:** can someone change data, a message, a cache or an artifact in transit or at rest?
- **Repudiation:** can someone do something sensitive with no record tying it to them?
- **Information disclosure:** can data cross to a user, tenant, log, model or third party that shouldn't see it?
- **Denial of service:** can one cheap request cause expensive or blocking work?
- **Elevation of privilege:** can someone gain a role, scope or capability they weren't given?

A filled-in STRIDE table is not a finding. Only a traced path is.

## Output

The specialist uses the shared prompt in [specialists.md](specialists.md) with this file's "What counts as a finding" and "Checklist" sections as `[CHECKLIST]`, and adds two fields to each finding:

```
{"axis":"security","severity":"critical|important|minor","confidence":6-10,"path":"<file>","line":<n>,"category":"<OWASP id or 'llm' | 'ci' | 'infra' | 'dependency' | 'secret'>","summary":"<one line>","exploit":"<attacker → entry → steps → boundary → impact>","evidence":"<what you traced and what you could not see>","fix":"<direction, optional>"}
```

A security finding with no `exploit` is dismissed by the lead.
