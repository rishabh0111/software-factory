# Shared-code opportunities

The Quality axis's check, on every diff of any size, for logic that should reuse an existing helper or become a shared one. Its output is **advice** (Optional, `"advisory": true`): never applied without the user's approval, never counted as a defect. A real defect in duplicated code (a divergent copy that gives a wrong result, misses error handling or breaks the same contract) is reported on its own, at its own severity; advice never suppresses, lowers or replaces it.

## When a proposal qualifies

- **Prove the callers.** At least one verified authored location changed in this diff, and at least two verified first-party source locations that need the shared behaviour, each with function and line. Added or uncommitted source counts; invented future callers do not. Similar names or formatting alone do not prove equivalent behaviour.
- **Exclude copies.** Generated and third-party code can be neither a caller nor a saving. Follow a generated copy back to its authored template or resolver.
- **Reuse before extracting.** Look for an existing library or helper first, and compare behaviour, inputs, outputs, error handling, side effects, security requirements, dependencies and runtime boundaries. Keep the differences callers need; do not bridge languages or separately deployed parts without a practical shared contract.
- **Keep the helper small.** Name its destination and contract, the callers to migrate and the smallest adoption sequence. Avoid option-heavy helpers and coupling unrelated components. Name the tests that cover the shared contract and each caller's integration, and the blast radius if the helper breaks.
- **Count the whole change.** Name the blocks removed and their replacement; estimate implementation lines removed, added and saved separately from the totals including tests and integration (saved = removed − added). Count moved code on both sides, exclude generated and vendor lines, use ranges when unsure, never count one removal twice across proposals, and say when tests or integration may make the change grow.
- **Rank by value.** Reliability gains and total net savings first, then low adoption and testing risk; proven code with several callers over new code. Recent activity breaks ties; it is not evidence. Reject similarities with incompatible contracts and extractions whose benefit does not pay for the abstraction.

Zero proposals is a valid result, and a compatible existing helper beats a new one.

## Finding format

Show the changed anchor, the verified callers, the smallest helper and destination, the differences kept, the compatibility tests and the shared-failure risk, plus the estimated savings. As a record:

```json
{"severity":"INFORMATIONAL","advisory":true,"confidence":N,"category":"shared-libs","path":"file","line":N,"summary":"...","fix":"...","evidence_paths":["src/a.ts","src/b.ts","src/shared.ts"],"helper_target":{"path":"src/shared.ts","symbol":"formatAmount"}}
```

`evidence_paths` lists every authored supporting path, including an existing helper's (so its contract is rechecked); a helper that does not exist yet appears only in `helper_target`.

**Identity**, for deduplication and for reusing a user's earlier Skip: `shared-libs:` plus the sorted, de-duplicated `evidence_paths`, `helper_target.path` and `helper_target.symbol`. Never a model-generated hash; missing or malformed metadata means the finding is new and must be judged afresh. Specialists do not repeat these proposals: equivalent advice from several sources is consolidated under this one, with every source kept and overlapping savings counted once.
