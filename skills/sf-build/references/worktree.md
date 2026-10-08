# Branch and worktree

Where the build works, and how to keep the user's checkout and the run's files safe.

## Is this checkout already isolated?

Check before creating anything:

```bash
git rev-parse --git-dir          # differs from the next line in a linked worktree
git rev-parse --git-common-dir
git rev-parse --show-superproject-working-tree   # non-empty inside a submodule
```

If the first two differ and you're not in a submodule, the host or a person already gave you a linked worktree. Work here: check out or create `sf/<run-id>` in it, and don't nest another worktree inside it. A submodule isn't isolation; treat it like a normal checkout.

## The conductor's checkout first

The conductor creates `sf/<run-id>` without checking it out and gives the run its checkout before spec ([../../software-factory/references/start.md](../../software-factory/references/start.md#branch-and-checkout)): a worktree for unattended runs or a dirty tree, the main checkout for attended runs with a clean tree. It records `Checkout:` and `Run files:` in `state.md`.

- **`Checkout:` is set:** work there. Check that it exists and has `sf/<run-id>` checked out (`git -C <checkout> branch --show-current`). Don't make another worktree. If `commands.install` hasn't run there yet (no `evidence/build-install.log`), run it as in step 2 below.
- **`sf/<run-id>` is already checked out in the current checkout and no `Checkout:` is set** (a run started before this rule): `git worktree add` would fail with "already checked out". If the tree has nothing this run didn't make, work in that checkout and record it as `Checkout:`. Otherwise stop with `waiting for human` and the reason; never switch that checkout to another branch to free the branch.

## When to make one (no checkout from the conductor)

Only when `sf-build` is called without a `Checkout:` line and the branch isn't checked out anywhere:

- **Unattended runs** always build in their own worktree, so a scheduled run never works in a checkout someone else uses.
- **Attended runs** make one when the working tree has changes this run didn't make. Leave those changes alone.
- Otherwise work in the current checkout on `sf/<run-id>`.

## Making it

1. Use the agent host's own worktree tool if it has one: the host then knows where the work lives. Otherwise: `git worktree add <repo>/../<repo-name>-sf-<run-id> sf/<run-id>` (add `-b` when the branch doesn't exist yet, from the base SKILL.md section 2 names).
2. Run `commands.install` in the new worktree, when it's known and not `none`, before the first ticket. A fresh worktree has no dependencies, and the first test run would fail for that reason alone. Save it with the header from [guards.md](guards.md#recording-a-run) as `evidence/build-install.log`. If it fails, retry once; still failing, stop with `waiting for human` and the error.
3. Record the worktree path as `Checkout:` in `state.md`, and the run folder as `Run files:`. Run files stay in the original checkout's `.software-factory/runs/`; use its absolute path from inside the worktree.

**If the worktree can't be created** (the sandbox refuses `git worktree add`, no write access beside the repo): say so. With changes in the tree this run didn't make, don't work over them: attended, ask the person to commit or stash them or to allow working in place (recommended: they stash); unattended, stop with `waiting for human` and the reason. With a clean tree, work in place and ledger `run: no worktree: <reason>`.

## Resuming

Before the first dispatch on a resumed run, confirm the place is still the run's:

- the `Checkout:` path exists and has `sf/<run-id>` checked out
- `git rev-parse sf/<run-id>` is the last commit the ledger names, or a descendant whose extra commits all carry this run's `Ticket:` footers (an implementer committed and the session ended before the ledger line)
- `git status --porcelain` shows nothing this run didn't make

On any mismatch, stop and report what differs. Never reset, clean, stash or check out another task's branch to make it match.

## Never `git clean -x`

`.software-factory/runs/` is gitignored, so `git clean -x`, `-X` or `-fdx` in the original checkout deletes the ledger, briefs, reports and evidence of every run. Don't run them, and don't put them in a subagent's brief. To drop a subagent's stray files, remove those paths by name. If run files are lost anyway, rebuild what you can from `git log` (each commit carries its `Ticket:` footer) and ledger `run: run files lost; rebuilt from git log`.
