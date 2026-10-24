# Performance Specialist Review Checklist

Scope: When SCOPE_BACKEND=true OR SCOPE_FRONTEND=true
Output: JSON objects, one finding per line. Schema:
{"severity":"CRITICAL|INFORMATIONAL","confidence":N,"path":"file","line":N,"category":"performance","summary":"...","fix":"...","fingerprint":"path:line:performance","specialist":"performance"}
Optional: line, fix, fingerprint, evidence, test_stub.
If no findings: output `NO FINDINGS` and nothing else.

---

## Workload first

Every finding tests one agreement: what the code **assumes about its workload** against what the workload **will be**. Code written against seed data agrees with a world that will not exist in production. A finding needs all three, or it is an observation:

1. **A reachable workload:** an input size, rate or concurrency the system will meet, established from the code and its context (a list view over a growing table, a handler hit per request, a loop over user-supplied items), never assumed.
2. **A cost and how it grows:** what is consumed, and how it scales with input size, concurrency and elapsed time. Superlinear growth in any of the three is the finding; the constant factor is not.
3. **A material consequence:** latency a user feels, a cost that is paid, a limit that is hit, a failure.

Refute against real bounds, amortisation, reuse, actual call frequency and deliberate trade-offs: a nested loop over a collection hard-capped at four, or a missing cache in code called once at startup, is no finding. A missing index, absent caching or a nested loop is never a finding on its own. Label each finding as **static deduction** or **measured**, and never invent a timing; put a directional estimate ("one query per row: 50 rows, 51 queries") in `evidence`.

Before the stack categories, apply the universal ones, which hold in any language:

- **Repeated work:** scans, parsing, serialisation, allocation, initialisation or I/O done again where one pass, a hoist or reuse would do.
- **Retention:** queues, buffers, caches and collections that grow with no bound, eviction policy or backpressure: a failure with a delay on it.
- **Copying and conversion:** data copied or converted between representations on a hot path, especially at a boundary where both sides could share one.
- **Serialisation and contention:** lock duration and scope, single-threaded chokepoints, head-of-line blocking, work held inside a critical section that did not need to be.
- **Amplification:** retries, polling, fan-out and cache misses that turn one logical request into many. Check the multiplier under failure, not under success.

## Categories

### N+1 Queries
- ActiveRecord/ORM associations traversed in loops without eager loading (.includes, joinedload, include)
- Database queries inside iteration blocks (each, map, forEach) that could be batched
- Nested serializers that trigger lazy-loaded associations
- GraphQL resolvers that query per-field instead of batching (check for DataLoader usage)

### Missing Database Indexes
- New WHERE clauses on columns without indexes (check migration files or schema)
- New ORDER BY on non-indexed columns
- Composite queries (WHERE a AND b) without composite indexes
- Foreign key columns added without indexes

### Algorithmic Complexity
- O(n^2) or worse patterns: nested loops over collections, Array.find inside Array.map
- Repeated linear searches that could use a hash/map/set lookup
- String concatenation in loops (use join or StringBuilder)
- Sorting or filtering large collections multiple times when once would suffice

### Bundle Size Impact (Frontend)
- New production dependencies that are known-heavy (moment.js, lodash full, jquery)
- Barrel imports (import from 'library') instead of deep imports (import from 'library/specific')
- Large static assets (images, fonts) committed without optimization
- Missing code splitting for route-level chunks

### Rendering Performance (Frontend)
- Fetch waterfalls: sequential API calls that could be parallel (Promise.all)
- Unnecessary re-renders from unstable references (new objects/arrays in render)
- Missing React.memo, useMemo, or useCallback on expensive computations
- Layout thrashing from reading then writing DOM properties in loops
- Missing loading="lazy" on below-fold images

### Over-fetching
- Fields selected or loaded that no consumer or renderer reads, and `SELECT *` on wide tables, feeding list or dashboard views. Before flagging a field unused, grep for dynamic access (`row[field]`, spreads into props, serialisers, CSV or export paths) that reads it invisibly.
- Payloads that embed full nested objects a view only counts or links to.

### Missing Pagination
- List endpoints that return unbounded results (no LIMIT, no pagination params)
- Database queries without LIMIT that grow with data volume
- API responses that embed full nested objects instead of IDs with expansion

### Blocking in Async Contexts
- Synchronous I/O (file reads, subprocess, HTTP requests) inside async functions
- time.sleep() / Thread.sleep() inside event-loop-based handlers
- CPU-intensive computation blocking the main thread without worker offload
