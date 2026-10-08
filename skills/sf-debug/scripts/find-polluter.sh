#!/usr/bin/env bash
# find-polluter.sh: run candidate test files one at a time to find the one
# that pollutes shared state, either by leaving a path behind on disk or by
# making a target test fail when it runs first. Stops at the first hit.
#
# Usage: bash find-polluter.sh --creates <path> '<test cmd with {}>' <files...>
#        bash find-polluter.sh --breaks '<target cmd>' '<pair cmd with {}>' <files...>
# Exit:  0 none found, 1 polluter found, 2 usage error, 3 precondition failed

help_text() {
	cat >&2 <<'EOF'
usage:
  find-polluter.sh --creates PATH TEST_CMD FILE...
  find-polluter.sh --breaks TARGET_CMD PAIR_CMD FILE...

--creates  finds the candidate that leaves PATH (file or folder) behind.
           TEST_CMD runs one candidate; PATH must not exist beforehand.
--breaks   finds the candidate that makes the target test fail when run first.
           TARGET_CMD runs the target alone and must pass on its own.
           PAIR_CMD runs one candidate and then the target in the same run,
           so in-process state carries over (e.g. a test runner with random
           ordering off, naming {} and then the target file).

{} in TEST_CMD / PAIR_CMD stands for one candidate file (shell-quoted).
Every {} is replaced. Commands run through bash; their output is discarded.

Candidates run in the order given and nothing is cleaned up between them, so
state one leaves behind can carry into later ones. Confirm a hit by running
that candidate alone with the target. In --breaks mode a candidate that fails
on its own also shows as a hit unless PAIR_CMD reports only the target's result.

exit codes:
  0  no polluter found
  1  polluter found (and reported)
  2  usage error (too few arguments, unknown mode, template without {})
  3  precondition failed (--creates: PATH exists; --breaks: target fails alone)
EOF
}

run_quiet() {
	bash -c "$1" </dev/null >/dev/null 2>&1
}

# Replace every {} in a template with the shell-quoted file name.
build_command() {
	local template=$1 quoted out="" rest
	quoted=$(printf '%q' "$2")
	rest=$template
	while [[ $rest == *'{}'* ]]; do
		out=$out${rest%%'{}'*}$quoted
		rest=${rest#*'{}'}
	done
	printf '%s' "$out$rest"
}

path_exists() {
	[ -e "$1" ] || [ -L "$1" ]
}

if [ "$#" -lt 4 ]; then
	help_text
	exit 2
fi

mode=$1
case "$mode" in
	--creates)
		watch_path=$2
		template=$3
		shift 3
		if path_exists "$watch_path"; then
			printf 'precondition failed: %s already exists; remove it first\n' "$watch_path" >&2
			exit 3
		fi
		;;
	--breaks)
		target=$2
		template=$3
		shift 3
		if ! run_quiet "$target"; then
			printf 'precondition failed: the target fails on its own: %s\n' "$target" >&2
			exit 3
		fi
		;;
	*)
		help_text
		exit 2
		;;
esac

case "$template" in
	*'{}'*) ;;
	*)
		printf 'the test command must contain {} for the candidate file: %s\n' "$template" >&2
		exit 2
		;;
esac

total=$#
i=0
for file in "$@"; do
	i=$((i + 1))
	if [ ! -f "$file" ]; then
		printf '[%d/%d] skip (not a file): %s\n' "$i" "$total" "$file"
		continue
	fi
	cmd=$(build_command "$template" "$file")
	printf '[%d/%d] %s\n' "$i" "$total" "$file"

	if [ "$mode" = --creates ]; then
		run_quiet "$cmd"
		if path_exists "$watch_path"; then
			printf '\npolluter: %s\n' "$file"
			printf 'created:  %s\n' "$watch_path"
			ls -ld "$watch_path"
			printf 'confirm: remove %s, then run: %s\n' "$watch_path" "$cmd"
			exit 1
		fi
	else
		if ! run_quiet "$cmd"; then
			printf '\npolluter: %s\n' "$file"
			printf 'target failed when run after it: %s\n' "$cmd"
			if run_quiet "$target"; then
				printf 'target still passes alone: the state does not persist on disk (in-process state)\n'
			else
				printf 'target now fails alone too: persistent state left by this or an earlier candidate\n'
			fi
			exit 1
		fi
	fi
done

printf '\nno polluter found among %d candidate(s)\n' "$total"
exit 0
