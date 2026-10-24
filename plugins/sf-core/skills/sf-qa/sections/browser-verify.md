# Browser repair verification

Only for a reproduced browser defect after its repair; functional repairs never load
this section.

Re-run the original interaction and an adjacent happy path. The Phase 5 evidence is the
before (`issue-NNN-result.jpg` for an interactive defect, `issue-NNN.png` for a static
one); capture the after now:

1. Run the Phase 3 read and flow sequence in [qa-patterns.md](qa-patterns.md) from the
   affected URL, starting with `new_page`, as one sequence. For an interaction bug, set
   its actions and waits to the original reproduction; for a static defect, skip the flow
   step. Keep the snapshot, console output and tool-error check.
2. Save the after screenshot as `issue-NNN-after.jpg` (a suffix if the name exists) with
   `take_screenshot` straight into `$REPORT_DIR/screenshots/`, then Read it.
3. Compare the snapshot tree, the `DIFF` and `CONSOLE_ERRORS=` with the before evidence.
   Does the change look correct at each viewport the defect touched (CSS layout, spacing,
   color, loading and transition, empty and error states)?
4. Confirm the console is clean on the affected page and run the automated tests that
   cover it.
