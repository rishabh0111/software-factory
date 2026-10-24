# Retro

The **retro** branch of [SKILL.md](SKILL.md): read a session and suggest improvements to the coding agent's **environment** (its instruction files, checks, docs and tools) so future runs go better. The retro suggests; the user decides what to change.

## Steps

1. Load the writing guide: call the Skill tool with `sk-writing-for-agents` when it is installed. Its rules (context pointers, no-ops, single source of truth) are the yardstick for every suggestion about a document an agent reads.
2. Read the primary sources for the session the user names; with none named, the current session. For another session's logs on this machine, find and extract them with the discovery and extraction steps in [references/session-history.md](references/session-history.md), with the user's description of that session as the topic. Done when you can point at the moments in the session where the agent lost time, made a mistake, or lacked information.
3. Check every category below against the session. A category yields a candidate when its _use when_ condition held.
   - **Navigation**: how easily did the agent find the right files? Are there hidden dependencies between files? Would a **navigation pointer** help? _Use when_ the session took long to find a piece of information.
   - **Automated checks**: could a check have caught an error the agent made: lint, types, tests, a filesystem linter? Read the repo's own check command first (its `package.json` or build-tool `lint`/`check` scripts, its CI workflow): a check that exists but sits unwired or silently broken is the finding, not a new one. A repo with no **guardrail** (no pre-commit hook and no CI job running lint, typecheck or tests) is itself a finding. _Use when_ the agent made a mistake a check could have caught, or the repo has no guardrail.
   - **Coding standards**: should the **reviewer agent** get a new rule, or an existing rule be removed or clarified? Classify the violation first. A **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check: a custom rule in the repo's linter, a pre-commit hook, or a CI job, whichever the repo's language and guardrail make cheapest. `CODING_STANDARDS.md` holds only **judgement calls** (cross-file consistency, matching the surrounding style, anything no check could replace). _Use when_ the reviewer agent missed a mistake.
   - **Instruction files**: should steering in `AGENTS.md` / `CLAUDE.md` move to coding standards or an automated check? _Use when_ the instruction file is large, in the repo or the user's global scope.
   - **Tool economy**: were tool calls more expensive than they had to be? Is a custom CLI or MCP server token-hungry? _Use when_ the agent made an expensive tool call.
   - **No-ops**: instructions in steering files that change nothing the agent would do anyway. _Use when_ the steering files are large and unwieldy.
   - **Information access**: could the agent get information it lacked: teed dev-server logs, read-only access to a third-party service? _Use when_ a crucial piece of information was out of the agent's reach.
   - **Lessons**: a solved problem in the session that meets the capture bar in [capture.md](capture.md). _Use when_ the session fixed something a future engineer would otherwise rediscover; suggest `/sf-learn capture` for it.
4. Present the candidates to the user, most severe first, each with the session moment it comes from and the concrete change (file and wording, or the check to add). Done when every category has been checked and every candidate presented.

## Where things belong

**Implementation and review.** Work goes through two stages. The implementation agent carries the most **context pressure**: it explores, writes code and debugs. The review agent carries the least: it receives a diff and seldom writes code. So the review agent enforces coding standards, and the implementation agent's context stays for the work.

**Files an agent reads:**

- `CLAUDE.md` / `AGENTS.md` load into every agent's context in this repo. Keep them to **navigation pointers** to other files, almost nothing else.
- `CODING_STANDARDS.md` is read at review, not implementation. Past about 1,000 lines, split it behind navigation pointers into a docs folder.
- Docs are reference files reached by pointers from other files. Look for an existing doc before writing a new one.
- Skills suit reference whose description earns a place in every context, and user-invoked commands. Write them by the `sk-writing-for-agents` rules.
