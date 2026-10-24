# Discoverability check

Lessons only pay off when agents can find them. Capture runs this after the refresh check; refresh runs it after its report. It runs every time. Done when the instruction file passes, or the outcome for the run's mode below is recorded.

1. Find the project's root instruction file: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` or the equivalent this project uses. The substantive file is the target; ignore a shim that only `@`-includes another. None exists: record `not applicable — no project instructions` and stop.
2. Judge by meaning, not string match, whether a reader of that file would learn three things:
   - a searchable store of lessons exists, and where;
   - enough of its structure to search it: category folders, and frontmatter fields such as `title`, `module`, `tags`, `problem_type`;
   - when it is relevant: implementing, debugging or deciding in a documented area (lessons cover bugs, practices, workflow patterns and other institutional knowledge).

   A line in an architecture section, a gotchas bullet, or facts spread over several places all count. When an agent would reasonably find and use the store, the check passes.
3. When it fails, draft the smallest addition that teaches the three things, in the file's own style and density. Prefer one line in the nearest related section (a directory listing, architecture tree, docs or conventions block); add a headed section only when the file is clearly sectioned and nothing is related. Describe the store itself, so it reads right for an agent without this plugin. Keep the tone informational ("relevant when implementing or debugging in documented areas"); an imperative like "always search before implementing" causes redundant reads where a workflow already searches. Calibration, not templates:

   ```
   docs/solutions/  # lessons from past problems (bugs, practices, workflow patterns), by category, with YAML frontmatter (title, module, tags, problem_type)
   ```

   ```
   ## Lessons

   `docs/solutions/`: lessons from past problems (bugs, practices, workflow patterns), organized by category with YAML frontmatter (`title`, `module`, `tags`, `problem_type`). Relevant when implementing or debugging in documented areas.
   ```

   Use the resolved lessons folder in place of `docs/solutions/`.
4. Act by mode:
   - **Interactive Full capture, interactive refresh**: show the proposed change and where it goes, explain why (fresh sessions, other tools and collaborators without this plugin will not know the store exists otherwise), and ask for consent before editing.
   - **Lightweight capture** (either mode): no edit; record `gap noted — instruction-file tip emitted` and print the tip.
   - **Non-interactive Full capture**: no edit; record `Instruction-file edit: gap noted, not applied`.
   - **Non-interactive refresh**: no edit; add a `Discoverability recommendation` line under **Recommended**.
5. A refresh that edits the instruction file after its commit already ran amends that commit (same branch, not yet pushed) or adds a small follow-up commit, and pushes it when the branch was already pushed so an open PR includes it. When the user chose not to commit, leave the edit uncommitted with the rest.

The glossary needs no check of its own: `docs/agents/domain.md` already leads agents to it.
