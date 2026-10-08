# Smallest change

Read by the implementer. Get the result with the least code and the least new structure.

- **Every line you ship traces to evidence**: a failing test, the debug red command, or a line in the ticket's plan. A line you can't trace is a guess. Remove it.
- **"Might help" doesn't ship.** Extra guards, retries, fallbacks or checks added "to be safe" are hypotheses, not fixes. Add them only when a test shows they're needed.
- **When evidence refutes a hypothesis, revert everything it motivated**, not only the line you were testing.
- **Look for deletions before additions.** When improving code, removing something is often the change.
- **Replace, don't add alongside.** When the ticket replaces a path (a function, endpoint, flag or module), delete the old one in the same ticket and move its callers, unless something outside the repo still uses it; then say who in the report. Two live paths for one job is the change half done.
- **No small leaks.** Don't add a pass-through that only forwards a call, or let an internal representation leak through an interface. Remove any the ticket's own code introduced.
- **Keep the diff small.** Touch only what the ticket needs. No "while I'm here" clean-ups, renames or reformatting of code the ticket doesn't change; note them in the report instead.
- **Keep call chains flat.** If understanding the change means following it through more than three files or layers, look for a more direct route.
- **One place per decision.** A choice made once is made in one spot; other code receives its result instead of making the choice again.
- **Question threading.** When a new value seems to need carrying through a chain of types, schemas or layers, pause and hunt for a shorter route before building the chain. If there isn't one, say so in the report.
- **Follow the patterns already in the repo.** Don't introduce a new library, framework or style for one ticket.

The test: would a developer find this code tiring to maintain? If so, it's not the smallest change.
