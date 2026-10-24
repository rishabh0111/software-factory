#!/usr/bin/env bash
# block-dangerous-git.sh: persistent PreToolUse hook installed by the
# /sf-guard git-guardrails mode. Reads the hook JSON on stdin and exits 2
# (blocked) when tool_input.command matches a dangerous git pattern.
#
# Fails closed: a payload that no available parser can read is blocked.
# The first version parsed with jq alone, so on a machine without jq the
# command came back empty and every git push was allowed.

INPUT=$(cat)

extract_command() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$INPUT" | jq -r '(.tool_input.command // "") | strings' 2>/dev/null && return 0
  fi
  if command -v python3 >/dev/null 2>&1; then
    printf '%s' "$INPUT" | python3 -c 'import sys,json
d = json.loads(sys.stdin.read())
c = (d.get("tool_input") or {}).get("command", "") if isinstance(d, dict) else ""
sys.stdout.write(c if isinstance(c, str) else "")' 2>/dev/null && return 0
  fi
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let j;try{j=JSON.parse(s)}catch(e){process.exit(3)}const c=j&&j.tool_input&&j.tool_input.command;process.stdout.write(typeof c==="string"?c:"")})' 2>/dev/null && return 0
  fi
  return 1
}

if ! COMMAND=$(extract_command); then
  echo "BLOCKED: could not parse the tool payload (needs jq, python3 or node on PATH), so the git guardrail cannot check this command. The user has prevented unchecked commands." >&2
  exit 2
fi

DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if printf '%s' "$COMMAND" | grep -qE -- "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

exit 0
