#!/usr/bin/env bash
# record.sh: run one command, keep its full output in a log and append an
# evidence record (exit code + content fingerprint) to records.jsonl in the
# log's evidence folder. It records; it never judges pass or fail.
#
# Usage: bash record.sh [--tee] <label> <log> -- <command> [args...]
#        bash record.sh --hash -- <command> [args...]
# Env:   SF_LOG_MAX_BYTES   log size cap in bytes (default 2097152)
# Exit:  the command's exit code; 127 command not found;
#        125 evidence could not be written (treat as an error, never a pass)

umask 077

NAME=record.sh
DEFAULT_MAX=2097152

die() {
	printf '%s: %s\n' "$NAME" "$*" >&2
	exit 125
}

usage() {
	die "usage: record.sh [--tee] <label> <log> -- <command> [args...] | record.sh --hash -- <command> [args...]"
}

# The string a command is known by: <s> for "bash -c <s>" / "sh -c <s>",
# otherwise the words joined by single spaces.
command_string() {
	if [ "$#" -eq 3 ] && { [ "$1" = bash ] || [ "$1" = sh ]; } && [ "$2" = -c ]; then
		printf '%s' "$3"
	else
		local IFS=' '
		printf '%s' "$*"
	fi
}

sha256_of() {
	local out
	if command -v sha256sum >/dev/null 2>&1; then
		out=$(printf '%s' "$1" | sha256sum 2>/dev/null)
	elif command -v shasum >/dev/null 2>&1; then
		out=$(printf '%s' "$1" | shasum -a 256 2>/dev/null)
	else
		return 1
	fi
	out=${out%%[!0-9a-f]*}
	[ "${#out}" -eq 64 ] || return 1
	printf '%s\n' "$out"
}

# Case-insensitive bracket pattern for a word: token -> [Tt][Oo][Kk][Ee][Nn]
ci() {
	local word=$1 out='' ch rest i
	local lower=abcdefghijklmnopqrstuvwxyz upper=ABCDEFGHIJKLMNOPQRSTUVWXYZ
	for ((i = 0; i < ${#word}; i++)); do
		ch=${word:i:1}
		rest=${lower%%"$ch"*}
		if [ "$rest" != "$lower" ]; then
			out="$out[${upper:${#rest}:1}$ch]"
		else
			out="$out$ch"
		fi
	done
	printf '%s' "$out"
}

redact() {
	local secret name scheme val
	secret="($(ci token)|$(ci password)|$(ci passwd)|$(ci secret)|$(ci api)[-_]?$(ci key))"
	name='[A-Za-z0-9_.-]*'
	scheme="(($(ci bearer)|$(ci basic)|$(ci token))[[:space:]]+)?"
	val="[^[:space:]'\"]+"
	printf '%s\n' "$1" | sed -E \
		-e "s#([A-Za-z][A-Za-z0-9+.-]*://)[^/@[:space:]'\"]+@#\\1[redacted]@#g" \
		-e "s#(($(ci proxy)-)?$(ci authorization)[[:space:]]*:[[:space:]]*)$scheme$val#\\1\\3[redacted]#g" \
		-e "s#($name$(ci api)[-_]?$(ci key)$name[[:space:]]*:[[:space:]]*)$scheme$val#\\1\\2[redacted]#g" \
		-e "s#(--?$name($secret|$(ci auth))$name)([= ]+)$val#\\1\\4[redacted]#g" \
		-e "s#($name$secret$name[[:space:]]*[=:][[:space:]]*)$val#\\1[redacted]#g"
}

now_utc() {
	date -u +%Y-%m-%dT%H:%M:%SZ
}

fingerprint() {
	local fp
	fp=$(bash "$SCRIPT_DIR/wtree.sh" 2>/dev/null) || fp=""
	case "$fp" in
		*[!0-9a-f]*) fp="" ;;
	esac
	if [ "${#fp}" -ne 40 ] && [ "${#fp}" -ne 64 ]; then
		fp=""
	fi
	printf '%s' "$fp"
}

json_escape() {
	local s=$1
	s=${s//\\/\\\\}
	s=${s//\"/\\\"}
	printf '%s' "$s"
}

# ---- arguments -----------------------------------------------------------

tee_mode=0
if [ "${1-}" = --tee ]; then
	tee_mode=1
	shift
fi

if [ "${1-}" = --hash ]; then
	shift
	[ "${1-}" = -- ] || usage
	shift
	[ "$#" -ge 1 ] || usage
	hash=$(sha256_of "$(command_string "$@")") || die "no SHA-256 tool found (need sha256sum or shasum)"
	printf '%s\n' "$hash"
	exit 0
fi

[ "$#" -ge 4 ] && [ "$3" = -- ] || usage
label=$1
log=$2
shift 3

case "$label" in
	'' | *[!A-Za-z0-9._-]*) die "bad label (letters, digits, '.', '_' and '-' only): $label" ;;
esac

case "$log" in
	*/evidence/*)
		evidence_dir="${log%/evidence/*}/evidence"
		log_rel="evidence/${log##*/evidence/}"
		;;
	evidence/*)
		evidence_dir=evidence
		log_rel=$log
		;;
	*) die "log must be inside an evidence folder (evidence/... or .../evidence/...): $log" ;;
esac
case "$log" in
	*/) die "log path names a folder: $log" ;;
esac
records="$evidence_dir/records.jsonl"

max_bytes=${SF_LOG_MAX_BYTES:-$DEFAULT_MAX}
case "$max_bytes" in
	'' | *[!0-9]*) max_bytes=$DEFAULT_MAX ;;
esac
max_bytes=$((10#$max_bytes))

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd) || die "cannot locate script folder"

cmd_string=$(command_string "$@")
cmd_hash=$(sha256_of "$cmd_string") || die "no SHA-256 tool found (need sha256sum or shasum)"

log_dir=$(dirname "$log")
mkdir -p "$log_dir" 2>/dev/null || die "cannot create folder: $log_dir"

# ---- run -----------------------------------------------------------------

fp_before=$(fingerprint)
commit=$(git rev-parse --verify -q HEAD 2>/dev/null) || commit=""

{
	printf 'cmd: %s\n' "$(redact "$cmd_string")"
	printf 'commit: %s\n' "${commit:-none}"
	printf 'fingerprint: %s\n' "${fp_before:-none}"
	printf 'date: %s\n' "$(now_utc)"
	printf '%s\n' '---'
} 2>/dev/null >"$log" || die "cannot write log: $log"

if [ "$tee_mode" -eq 1 ]; then
	"$@" </dev/null 2>&1 | tee -a "$log"
	rc=${PIPESTATUS[0]}
else
	"$@" </dev/null >>"$log" 2>&1
	rc=$?
fi

size=$(wc -c <"$log" 2>/dev/null | tr -d ' ') || die "cannot read log: $log"
case "$size" in
	'' | *[!0-9]*) die "cannot read log size: $log" ;;
esac
if [ "$size" -gt "$max_bytes" ]; then
	half=$((max_bytes / 2))
	removed=$((size - 2 * half))
	cut_tmp="$log.cut.$$"
	{
		head -c "$half" "$log" &&
			printf '\n--- truncated %s bytes ---\n' "$removed" &&
			tail -c "$half" "$log"
	} >"$cut_tmp" 2>/dev/null && mv -f "$cut_tmp" "$log" 2>/dev/null || {
		rm -f "$cut_tmp"
		die "cannot truncate log: $log"
	}
fi

if [ -n "$(tail -c 1 "$log" 2>/dev/null)" ]; then
	printf '\n' >>"$log" 2>/dev/null || die "cannot write log: $log"
fi
printf -- '--- exit: %s\n' "$rc" >>"$log" 2>/dev/null || die "cannot write log: $log"

fp_after=$(fingerprint)
wtree=""
if [ -n "$fp_before" ] && [ "$fp_before" = "$fp_after" ]; then
	wtree=$fp_before
fi

printf '{"ts":"%s","label":"%s","cmd_sha256":"%s","exit":%d,"wtree":"%s","log":"%s"}\n' \
	"$(now_utc)" "$label" "$cmd_hash" "$rc" "$wtree" "$(json_escape "$log_rel")" \
	2>/dev/null >>"$records" || die "cannot append record: $records"

printf 'recorded %s exit=%s wtree=%s\n' "$label" "$rc" "${wtree:-none}" >&2
if [ "$rc" -ne 0 ] && [ "$tee_mode" -eq 0 ]; then
	sed '1,5d;$d' "$log" | tail -n 5 >&2
fi
if [ -n "$fp_before" ] && [ -z "$wtree" ]; then
	printf '%s\n' "content changed while the command ran; no fingerprint recorded (see git status --porcelain)" >&2
fi

exit "$rc"
