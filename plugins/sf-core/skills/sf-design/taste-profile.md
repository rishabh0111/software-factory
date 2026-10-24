# Taste profile

Read by consultation (Phase 1) and shotgun (Step 2); updated by shotgun after a
choice. The profile lives at `.claude/design/taste-profile.json` at the repo root.

## Reading it

Read this project's taste profile:

```bash
_TASTE_PROFILE="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.claude/design/taste-profile.json"
if [ -f "$_TASTE_PROFILE" ]; then
  # Schema v1: { dimensions: { fonts, colors, layouts, aesthetics }, sessions: [] }
  # Each dimension has approved[] and rejected[] entries with
  # { value, confidence, approved_count, rejected_count, last_seen }
  # Confidence decays 5% per week of inactivity — computed at read time.
  cat "$_TASTE_PROFILE" 2>/dev/null
  echo "TASTE_PROFILE_FOUND"
else
  echo "NO_TASTE_PROFILE"
fi
```

**If TASTE_PROFILE_FOUND:** Parse the full JSON; malformed/unreadable uses the legacy fallback. After decay, rank each dimension by confidence * approved_count (or rejected_count); take three per kind. Count retained sessions (at most 50, not lifetime). Include in the brief (in consultation, the Phase 1 product brief, later shared unchanged with both independent voices):

"Based on [number of retained sessions] recorded sessions, this user's taste leans toward:
fonts [top-3], colors [top-3], layouts [top-3], aesthetics [top-3]. Bias
generation toward these unless the user explicitly requests a different direction.
Also avoid their strong rejections: [top-3 rejected per dimension]."

**Legacy fallback:** Glob the designs directory for `**/approved.json`; Read the five newest. To view an approved image, resolve it as in **Resolving an approved image** below. Use explicit feedback only, never infer fonts/colors from variant letters. No usable files: continue without a taste profile.

**Conflict handling:** If the current user request contradicts a strong persistent
signal (e.g., "make it playful" when taste profile strongly prefers minimal), flag
it: "Note: your taste profile strongly prefers minimal. You're asking for playful
this time — I'll proceed, but want me to update the taste profile, or treat this
as a one-off?"

**Decay:** Multiply stored confidence by 0.95 raised to elapsed weeks since last_seen (minimum zero weeks). Skip invalid dates/confidence; do not rewrite the file while reading.

**Schema migration:** If the file has no `version` field or `version: 0`, it's
the legacy approved.json aggregate — the next update below migrates it to schema v1.

## Resolving an approved image

An `approved.json` names its image by `approved_path`, relative to the
`approved.json`'s own directory. A legacy record with only `approved_variant`
resolves to `variant-<letter>.png` in that directory. When the named image is
missing, say "approved image <path> is missing; reselect from the board" and never
substitute another image.

## Updating it

When the user picks a variant, record `approved` for the approved image; when they
explicitly reject a variant, record `rejected` for that variant's path. Edit
`.claude/design/taste-profile.json` with your file-write tool (create `.claude/design/`
and the file when missing):

```json
{
  "version": 1,
  "updated_at": "<ISO 8601>",
  "dimensions": {
    "fonts":      { "approved": [], "rejected": [] },
    "colors":     { "approved": [], "rejected": [] },
    "layouts":    { "approved": [], "rejected": [] },
    "aesthetics": { "approved": [], "rejected": [] }
  },
  "sessions": [
    { "ts": "<ISO>", "action": "approved", "variant": "<path>", "reason": "<optional>" }
  ]
}
```

1. **Migrate** a file with no `version` (or `version: 0`) into this shape first.
2. **Session:** always append `{ts, action, variant, reason}`; keep only the last 50 sessions.
3. **Dimensions:** write the reason as `fonts: X, Y; colors: Z; layouts: ...; aesthetics: ...`
   from the user's explicit feedback. For each named value, find its entry (case-insensitive)
   in that dimension's `approved` or `rejected` list, or add
   `{value, confidence: 0, approved_count: 0, rejected_count: 0, last_seen}`. Increment the
   matching count, set `last_seen` to now, and set `confidence` to
   (that list's count) / (approved_count + rejected_count + 1). A reason naming no dimension
   records the session only.
4. **Conflict:** if the opposite list holds the same value with 3+ total counts and
   confidence ≥ 0.6, say: "NOTE: taste drift — "<value>" previously <approved|rejected>
   with confidence <n>. Keep both signals; aggregate confidence will rebalance."
5. Set `updated_at`, then Read the file back to confirm it is valid JSON.
