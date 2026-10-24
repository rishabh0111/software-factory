#!/usr/bin/env bash
# Usage: scripts/upstream-diff.sh <path-to-upstream-clone> [upstream-name]
# For every UPSTREAM.md row from that upstream, prints the upstream commits
# since the copied commit that touch the row's paths. The upstream is found
# by the clone's origin URL unless its name from UPSTREAM.md is given.
set -euo pipefail
clone=${1:?usage: $0 <path-to-upstream-clone> [upstream-name]}
doc="$(cd "$(dirname "$0")/.." && pwd)/UPSTREAM.md"
norm() { sed -E 's#^(git@|https?://)##; s#:#/#; s#\.git$##; s#/$##' | tr 'A-Z' 'a-z'; }
url=$(git -C "$clone" remote get-url origin 2>/dev/null | norm || true)

read -r name sha < <(awk -F'|' -v u="$url" -v n="${2:-}" '
  function t(s) { gsub(/^[ `]+|[ `]+$/, "", s); return s }
  $3 ~ /github\.com/ { x = tolower(t($3)); sub(/^https?:\/\//, "", x)
    if (t($2) == n || (n == "" && x == u)) { print t($2), t($4); exit } }' "$doc")
[ -n "${name:-}" ] || { echo "no upstream in $doc matches $clone" >&2; exit 1; }
echo "# $name since ${sha:0:10}"

awk -F'|' -v n="$name" '
  function t(s) { gsub(/^ +| +$/, "", s); return s }
  t($5) ~ /^(as-is|renamed|merged)$/ {
    repos = t($3); s = $4; out = ""
    while (match(s, /`[^`]+`/)) {
      p = substr(s, RSTART + 1, RLENGTH - 2); s = substr(s, RSTART + RLENGTH); i = index(p, ":")
      if (i && substr(p, 1, i - 1) == n) out = out " " substr(p, i + 1)
      else if (!i && repos == n) out = out " " p
    }
    if (out != "") print t($2) "\t" out
  }' "$doc" |
while IFS=$'\t' read -r ours paths; do
  echo "## $ours:$paths"
  # shellcheck disable=SC2086
  git -C "$clone" log --oneline "$sha..HEAD" -- $paths || echo "  (commit $sha not found in clone)"
done
