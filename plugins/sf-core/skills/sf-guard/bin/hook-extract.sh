#!/usr/bin/env bash
# hook-extract.sh — SHARED JSON and path helpers for the guard PreToolUse hooks.
# Sourced (never executed) by bin/check-careful.sh, bin/check-freeze.sh and
# bin/freeze-state.sh via a path relative to each script.
#
# ONE copy on purpose. These two hooks previously carried separate extractor
# copies; the escaped-quote truncation bug got fixed in careful's copy while
# freeze silently kept the broken one. Any future parsing fix lands here and
# reaches both hooks by construction.

# guard_hook_extract_field PAYLOAD FIELD
#   Prints tool_input.FIELD when PAYLOAD is valid JSON and the field is a
#   string ("" when absent or non-string). Returns 1 when no parser is
#   available or the payload is not parseable JSON — the CALLER decides the
#   polarity for that case (careful asks, freeze denies).
#
#   python3 is tried first because it ships with macOS and most Linux distros
#   and is reliably on PATH in a hook environment; node is the fallback.
guard_hook_extract_field() {
  _ghef_payload="$1"
  _ghef_field="$2"
  if command -v python3 >/dev/null 2>&1; then
    printf '%s' "$_ghef_payload" | python3 -c 'import sys,json
field = sys.argv[1]
d = json.loads(sys.stdin.read())
c = d.get("tool_input", {}).get(field, "")
sys.stdout.write(c if isinstance(c, str) else "")' "$_ghef_field" 2>/dev/null && return 0
  fi
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$_ghef_payload" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const c=(j&&j.tool_input&&j.tool_input[process.argv[1]])||"";process.stdout.write(typeof c==="string"?c:"")}catch(e){process.exit(3)}})' "$_ghef_field" 2>/dev/null && return 0
  fi
  return 1
}

# guard_hook_extract_tool PAYLOAD FIELD [FIELD...]
#   One parser call that reads the top-level tool_name together with the first
#   non-empty string among tool_input.FIELD..., so tool dispatch costs no
#   extra fork on the per-command hot path. Sets three globals (stdout stays
#   the hook's decision channel):
#     GUARD_HOOK_TOOL   tool_name ("" when absent or non-string)
#     GUARD_HOOK_FIELD  the FIELD that supplied the value ("" when none did)
#     GUARD_HOOK_VALUE  that field's string value, trailing newlines dropped
#                        (the same shape $(guard_hook_extract_field ...) gave)
#   Returns 1 when no parser is available or the payload is not parseable
#   JSON; the caller decides the polarity, exactly as for the field extractor.
#   Python reads and writes bytes: Windows text-mode stdout turns every "\n"
#   into "\r\n", which left tool_name as "PowerShell\r" and never matched.
#   Payload shapes (Claude Code hooks reference, PreToolUse input): Bash and
#   PowerShell carry tool_input.command; Edit and Write carry file_path;
#   NotebookEdit carries notebook_path.
GUARD_HOOK_TOOL=""
GUARD_HOOK_FIELD=""
GUARD_HOOK_VALUE=""
guard_hook_extract_tool() {
  _ghet_payload="$1"
  shift
  _ghet_out=""
  _ghet_ok=1
  if command -v python3 >/dev/null 2>&1; then
    _ghet_out=$(printf '%s' "$_ghet_payload" | python3 -c 'import sys,json
d = json.loads(sys.stdin.buffer.read())
t = d.get("tool_name", "") if isinstance(d, dict) else ""
i = d.get("tool_input", {}) if isinstance(d, dict) else {}
i = i if isinstance(i, dict) else {}
f = v = ""
for k in sys.argv[1:]:
    c = i.get(k, "")
    if isinstance(c, str) and c:
        f, v = k, c
        break
sys.stdout.buffer.write(((t if isinstance(t, str) else "").replace("\n", " ") + "\n" + f + "\n" + v.rstrip("\n") + ".").encode("utf-8", "surrogatepass"))' "$@" 2>/dev/null) && _ghet_ok=0
  fi
  if [ "$_ghet_ok" -ne 0 ] && command -v node >/dev/null 2>&1; then
    _ghet_out=$(printf '%s' "$_ghet_payload" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let j;try{j=JSON.parse(s)}catch(e){process.exit(3)}const o=j&&typeof j==="object"?j:{};const t=typeof o.tool_name==="string"?o.tool_name:"";const i=o.tool_input&&typeof o.tool_input==="object"?o.tool_input:{};let f="",v="";for(const k of process.argv.slice(1)){const c=i[k];if(typeof c==="string"&&c){f=k;v=c;break}}process.stdout.write(t.replace(/\n/g," ")+"\n"+f+"\n"+v.replace(/\n+$/,"")+".")})' "$@" 2>/dev/null) && _ghet_ok=0
  fi
  [ "$_ghet_ok" -eq 0 ] || return 1
  _ghet_out="${_ghet_out%.}"
  GUARD_HOOK_TOOL="${_ghet_out%%$'\n'*}"
  _ghet_out="${_ghet_out#*$'\n'}"
  GUARD_HOOK_FIELD="${_ghet_out%%$'\n'*}"
  GUARD_HOOK_VALUE="${_ghet_out#*$'\n'}"
  return 0
}

# Windows bash (Git Bash / MSYS / Cygwin), read from bash's own OSTYPE so the
# check never costs a fork: careful sources this file on every Bash call.
case "${OSTYPE:-}" in
  msys*|cygwin*|win32*) GUARD_HOOK_IS_WINDOWS=1 ;;
  *) GUARD_HOOK_IS_WINDOWS=0 ;;
esac
_GUARD_HOOK_AZ_UPPER=ABCDEFGHIJKLMNOPQRSTUVWXYZ
_GUARD_HOOK_AZ_LOWER=abcdefghijklmnopqrstuvwxyz
GUARD_HOOK_PATH=""

# guard_hook_normalize_path PATH
#   The one path canonicalization for freeze's boundary AND the tool's
#   file_path. Leaves the result in GUARD_HOOK_PATH (stdout is the
#   hook's decision channel, and $(...) would cost a fork):
#     C:\dev\x  c:/dev/x  -> /c/dev/x      (separators, drive-letter case)
#     \\srv\share\x       -> //srv/share/x (UNC: the leading // is kept)
#     /cygdrive/c/x       -> /c/x          (Windows bash only)
#   Drive-letter and UNC shapes are recognised lexically on every platform.
#   A path without those shapes is rewritten only on Windows bash: on POSIX
#   '\' is a legal filename character, and rewriting it would let a name like
#   'a\..\..\etc\x' change which directory the check sees. Remaining case
#   differences on Windows are handled by comparing under nocasematch.
#   Builtins only, bash 3.2 compatible.
guard_hook_normalize_path() {
  GUARD_HOOK_PATH="$1"
  case "$GUARD_HOOK_PATH" in
    [A-Za-z]:[\\/]*|[A-Za-z]:|\\\\[!\\]*) ;;
    *) [ "$GUARD_HOOK_IS_WINDOWS" = 1 ] || return 0 ;;
  esac
  GUARD_HOOK_PATH="${GUARD_HOOK_PATH//\\//}"
  case "$GUARD_HOOK_PATH" in
    [A-Za-z]:/*|[A-Za-z]:)
      _ghnp_d="${GUARD_HOOK_PATH%%:*}"
      _ghnp_pre="${_GUARD_HOOK_AZ_UPPER%%"$_ghnp_d"*}"
      [ "$_ghnp_pre" = "$_GUARD_HOOK_AZ_UPPER" ] || _ghnp_d="${_GUARD_HOOK_AZ_LOWER:${#_ghnp_pre}:1}"
      GUARD_HOOK_PATH="/$_ghnp_d${GUARD_HOOK_PATH#?:}"
      ;;
    /cygdrive/[A-Za-z]/*|/cygdrive/[A-Za-z]) GUARD_HOOK_PATH="${GUARD_HOOK_PATH#/cygdrive}" ;;
  esac
  return 0
}

# guard_hook_json_string TEXT
#   Prints TEXT as a JSON string literal (surrounding quotes included),
#   encoding quotes, backslashes, control characters and newlines. Never build
#   hook JSON with printf/sed interpolation: a path containing a quote or a
#   newline produces malformed JSON, and Claude Code silently ignores the
#   whole decision — a deny that no-ops exactly when it matters.
guard_hook_json_string() {
  _ghjs_text="$1"
  if command -v python3 >/dev/null 2>&1; then
    printf '%s' "$_ghjs_text" | python3 -c 'import sys,json; sys.stdout.write(json.dumps(sys.stdin.read()))' 2>/dev/null && return 0
  fi
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$_ghjs_text" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(JSON.stringify(s)))' 2>/dev/null && return 0
  fi
  # Last-resort fallback (no parser on PATH): strip to a safe charset so the
  # envelope stays valid JSON even if the message loses characters.
  printf '"%s"' "$(printf '%s' "$_ghjs_text" | tr -cd 'a-zA-Z0-9 ._/:@=+-' )"
}

# guard_hook_decision DECISION REASON
#   Emits the full PreToolUse hookSpecificOutput envelope with REASON safely
#   JSON-encoded. DECISION is "ask" or "deny". The decision MUST be nested
#   under hookSpecificOutput — Claude Code ignores a top-level
#   permissionDecision, which silently no-ops the block.
guard_hook_decision() {
  _ghd_decision="$1"
  _ghd_reason="$2"
  _ghd_encoded=$(guard_hook_json_string "$_ghd_reason")
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":%s}}\n' "$_ghd_decision" "$_ghd_encoded"
}

# guard_hook_state_root
#   Print the guard state root: .claude/guard under the project. Writers
#   (freeze-state.sh, run from the Bash tool) and readers (the hooks) resolve
#   it through this one function, so they always agree on the same root.
#   $CLAUDE_PROJECT_DIR wins when set; otherwise the git top level, then cwd.
#   Printed WITHOUT a trailing newline: callers capture with a sentinel
#   (`r="$(guard_hook_state_root; printf x)"; r="${r%x}"`).
guard_hook_state_root() {
  _ghsr_proj="${CLAUDE_PROJECT_DIR:-}"
  [ -n "$_ghsr_proj" ] || _ghsr_proj="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  printf '%s' "${_ghsr_proj%/}/.claude/guard"
}
