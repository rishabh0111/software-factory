#!/usr/bin/env bash
# hitl-loop.sh: walk a person through a UI reproduction one step at a time and
# print their observations as KEY=VALUE lines at the end.
#
# Usage: copy this file to the run's evidence/repro/ folder, edit the steps
# between the EDIT-START and EDIT-END markers (and the matching lines in the
# output block below them), then run `bash hitl-loop.sh` in a terminal the
# person can see. Exit 0 when every step completes; non-zero if input ends
# early or a step fails.
#
# Two helpers:
#   do_step "<instruction>"          show an instruction, wait for Enter
#   ask KEY "<question>"             show a question, store the answer as KEY
#
# NEVER ask for a password, token, API key or any other credential: answers
# are echoed and read by an agent. Signing in is an instruction step the
# person does themselves. Collect observations only.

set -euo pipefail

MARK='>>>'

read_line() {
	local line=""
	if ! IFS= read -r line && [ -z "$line" ]; then
		printf '\n%s\n' "input ended before all steps were done" >&2
		exit 1
	fi
	line=${line#"${line%%[![:space:]]*}"}
	line=${line%"${line##*[![:space:]]}"}
	REPLY_LINE=$line
}

do_step() {
	printf '\n%s %s\n' "$MARK" "$1"
	printf '    Press Enter when done: '
	read_line
}

ask() {
	local key=$1
	case "$key" in
		'' | [0-9]* | *[!A-Za-z0-9_]*)
			printf 'bad capture key: %s\n' "$key" >&2
			exit 1
			;;
	esac
	printf '\n%s %s\n' "$MARK" "$2"
	printf '    > '
	read_line
	printf -v "CAP_$key" '%s' "$REPLY_LINE"
}

# ---- EDIT-START: steps (keep in step with the output block below) ----------

do_step "Open http://localhost:3000 in your browser and sign in yourself."
ask EXPORT_ERROR "Click the 'Export CSV' button. Did an error appear? (y/n)"
ask ERROR_TEXT "What exact error message is shown? (type 'none' if there is none)"

# ---- EDIT-END ---------------------------------------------------------------

# Output block: one line per captured key, in this order.
printf '\n--- Captured ---\n'
printf '%s\n' "EXPORT_ERROR=$CAP_EXPORT_ERROR"
printf '%s\n' "ERROR_TEXT=$CAP_ERROR_TEXT"
