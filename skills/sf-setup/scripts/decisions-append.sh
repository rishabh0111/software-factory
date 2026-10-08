#!/usr/bin/env bash
# decisions-append.sh: append exactly one line to an append-only decision log
# and print that line. There is no way to edit or delete entries with it.
#
# Usage: bash decisions-append.sh [--file <log>] [--run <run-id>] [--kind <kind>]
#             [--date YYYY-MM-DD] <stage> <subject> <text | ->
# Line:  - <date> · <stage> · <subject> · [<kind>: ]<text>[ (run <run-id>)]
# Exit:  0 written, 1 write failed (or folder missing), 2 usage/validation error

NAME=decisions-append
DOT=$'\xc2\xb7'

help_text() {
	cat >&2 <<EOF
usage: decisions-append.sh [options] <stage> <subject> <text | ->

Appends one line to the decision log and prints it on stdout.

arguments:
  <stage>      who writes (setup, spec, plan, ...): letters, digits and '-'
  <subject>    what the entry is about (e.g. SPEC-cart, tracker); non-empty
  <text>       the entry; '-' reads it from stdin

options (before the arguments):
  --file <log>         log path (default .software-factory/decisions.md)
  --run <run-id>       add " (run <run-id>)" at the end of the line
  --kind <kind>        prefix the text with "<kind>: " (letters, digits, '-')
  --date YYYY-MM-DD    date to write (default: today, local time)
  -h, --help           show this help
  --                   end of options

line format:
  - <date> $DOT <stage> $DOT <subject> $DOT [<kind>: ]<text>[ (run <run-id>)]

Newlines, tabs and repeated spaces in any field become single spaces.
The log's folder must exist; the file is created if missing.
EOF
}

usage_error() {
	[ -n "$1" ] && printf '%s: %s\n' "$NAME" "$1" >&2
	help_text
	exit 2
}

invalid() {
	printf '%s: %s\n' "$NAME" "$1" >&2
	exit 2
}

clean() {
	local s
	s=$(printf '%s' "$1" | tr '\r\n\t' '   ')
	while [[ $s == *'  '* ]]; do
		s=${s//  / }
	done
	s=${s# }
	s=${s% }
	printf '%s' "$s"
}

file=.software-factory/decisions.md
run=""
kind=""
date=""
date_given=0

while [ "$#" -gt 0 ]; do
	case "$1" in
		--file | --run | --kind | --date)
			[ "$#" -ge 2 ] || usage_error "option $1 needs a value"
			case "$1" in
				--file) file=$2 ;;
				--run) run=$2 ;;
				--kind) kind=$2 ;;
				--date) date=$2; date_given=1 ;;
			esac
			shift 2
			;;
		-h | --help)
			help_text
			exit 0
			;;
		--)
			shift
			break
			;;
		-) break ;;
		-?*) usage_error "unknown option: $1" ;;
		*) break ;;
	esac
done

[ "$#" -eq 3 ] || usage_error "expected 3 arguments (stage, subject, text), got $#"

stage=$1
subject=$2
text=$3
if [ "$text" = - ]; then
	text=$(cat)
fi

stage=$(clean "$stage")
subject=$(clean "$subject")
text=$(clean "$text")
run=$(clean "$run")
kind=$(clean "$kind")
[ "$date_given" -eq 1 ] || date=$(date +%Y-%m-%d)
date=$(clean "$date")

[[ -n $stage && $stage != *[!A-Za-z0-9-]* ]] || invalid "bad stage (letters, digits and '-' only): '$stage'"
[[ $kind != *[!A-Za-z0-9-]* ]] || invalid "bad kind (letters, digits and '-' only): '$kind'"
[[ $date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || invalid "bad date (expected YYYY-MM-DD): '$date'"
[ -n "$subject" ] || invalid "empty subject"
[ -n "$text" ] || invalid "empty text"

line="- $date $DOT $stage $DOT $subject $DOT ${kind:+$kind: }$text${run:+ (run $run)}"

dir=$(dirname "$file")
if [ ! -d "$dir" ]; then
	printf '%s: folder does not exist: %s\n' "$NAME" "$dir" >&2
	exit 1
fi

lead=""
if [ -s "$file" ] && [ -n "$(tail -c 1 "$file" 2>/dev/null)" ]; then
	lead=$'\n'
fi

if ! printf '%s%s\n' "$lead" "$line" 2>/dev/null >>"$file"; then
	printf '%s: cannot write to %s\n' "$NAME" "$file" >&2
	exit 1
fi

printf '%s\n' "$line"
exit 0
