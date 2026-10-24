# Security Specialist Review Checklist

Scope: When SCOPE_AUTH=true OR (SCOPE_BACKEND=true AND diff > 100 lines)
Output: JSON objects, one finding per line. Schema:
{"severity":"CRITICAL|INFORMATIONAL","confidence":N,"path":"file","line":N,"category":"security","summary":"...","fix":"...","fingerprint":"path:line:security","specialist":"security"}
Optional: line, fix, fingerprint, evidence, test_stub.
If no findings: output `NO FINDINGS` and nothing else.

---

This checklist goes deeper than the main CRITICAL pass. The main agent already checks SQL injection, race conditions, LLM trust, and enum completeness. This specialist focuses on auth/authz patterns, cryptographic misuse, and attack surface expansion.

## Who is harmed

Run every candidate through this test before reporting it. If the only victim is the attacker, on their own machine, account, tenant or data, and no shared system or privilege boundary is crossed, drop it. This refutation is **forbidden** for: outbound-network sinks (SSRF), shared billing or quota, data exposure, cross-tenant or cross-principal flows, and server-side execution or rendering, since each harms someone other than the attacker by definition. A finding dropped here may still be a correctness defect with a real consequence; report it under correctness instead. Name the attacker, what they control, and the victim in `evidence`.

## Categories

### Input Validation at Trust Boundaries
- User input accepted without validation at controller/handler level
- Query parameters used directly in database queries or file paths
- Request body fields accepted without type checking or schema validation
- File uploads without type/size/content validation
- Webhook payloads processed without signature verification

### Auth & Authorization Bypass
- Endpoints missing authentication middleware (check route definitions)
- Authorization checks that default to "allow" instead of "deny"
- Role escalation paths (user can modify their own role/permissions)
- Direct object reference vulnerabilities (user A accesses user B's data by changing an ID)
- Session fixation or session hijacking opportunities
- Token/API key validation that doesn't check expiration
- Error pages that leak past a correct guard: the shared 403/404/500 renderer builds its body outside the authorization path, so a blocked request still returns internal names, counts or navigation the role must not see. Read the error template and its context builder, not just the guard
- Ownership that survives a role downgrade: a grant recorded at creation still opens the object after the user's role is reduced and they sign in again. Ownership must be re-checked against the current role on every read
- List, detail and file/download access to one object audited as a single entry: each usually resolves the object through a different code path, so check each against the role matrix separately
- Account or identity switch that clears, regenerates or rebinds the session before validating the callback's single-use state value: any forced navigation to that URL logs the user out (CSRF). Also check the denied, cancelled and error branches, where leaving the prior session live keeps the user acting as the previous identity

### Injection Vectors (beyond SQL)
- Command injection via subprocess calls with user-controlled arguments
- Template injection (Jinja2, ERB, Handlebars) with user input
- LDAP injection in directory queries
- SSRF via user-controlled URLs (fetch, redirect, webhook targets)
- Path traversal via user-controlled file paths (../../etc/passwd)
- Header injection via user-controlled values in HTTP headers

### Cryptographic Misuse
- Weak hashing algorithms (MD5, SHA1) for security-sensitive operations
- Predictable randomness (Math.random, rand()) for tokens or secrets
- Non-constant-time comparisons (==) on secrets, tokens, or digests
- Hardcoded encryption keys or IVs
- Missing salt in password hashing

### Secrets Exposure
- API keys, tokens, or passwords in source code (even in comments)
- Secrets logged in application logs or error messages
- Credentials in URLs (query parameters or basic auth in URL)
- Sensitive data in error responses returned to users
- PII stored in plaintext when encryption is expected

### XSS via Escape Hatches
- Rails: .html_safe, raw() on user-controlled data
- React: dangerouslySetInnerHTML with user content
- Vue: v-html with user content
- Django: |safe, mark_safe() on user input
- General: innerHTML assignment with unsanitized data

### Beyond the web surface
For a CLI, library, daemon or build tool, the same trust-boundary test applies to every less-trusted origin: arguments, environment, config files, stdin, filenames, archive members, network responses, plugin and extension surfaces, deserialised state, and model output.
- **Validator and consumer disagree:** an unanchored pattern, a prefix or substring allowlist, normalisation (case, encoding, slashes, path) applied on one side only, validation on one representation and use on another.
- **Fail-open branches:** error, timeout, cancellation, cache-miss and boundary branches that default to allow.
- **Check and action name different objects:** permission checked on one ID, action performed on another never proven to belong to it; the principal an operation runs as differs from the one checked.
- **Forgeable request signals:** an endpoint gated by `?source=cron`, a guessable header or an unsigned webhook-shaped payload instead of real authentication. Raise severity when it mutates data, sends email or triggers paid usage.

### Deserialization
- Deserializing untrusted data (pickle, Marshal, YAML.load, JSON.parse of executable types)
- Accepting serialized objects from user input or external APIs without schema validation
