# Performance gate

Gate 12. `sf-verify` runs it itself, after the explorer returns. It compares head with the merge base on the same machine and fails on a timing regression beyond the threshold and the noise, or on a budget the repo set, with the numbers. A feature that adds code adds bytes and requests; those alone never fail the gate. It never installs a benchmark tool and never changes a budget.

## Applies when

Take the first that fits:

1. **Benchmarks.** The repo already has them: a `bench` or `benchmark` script in `package.json`, `*.bench.*` files with Vitest, `func Benchmark` in Go tests, a `benches/` folder with `cargo bench`, `pytest-benchmark` or `asv` in dev dependencies, JMH, a hyperfine script, or a benchmark command named in `verify.md`.
2. **Budget.** The repo has a performance budget: `.size-limit.*` or `size-limit` in `package.json`, `bundlesize`, a Lighthouse CI config (`lighthouserc.*`) with assertions, a `budget.json`, bundler `performance` hints set to `error`, or a `Performance budget:` line in `verify.md` (for example `page weight 200 KB, 20 requests`).
3. **Web fallback.** Neither exists, the scope includes frontend or a route behind a web page, `verify.md` describes a web UI, and a browser is available (the MCP, or the headless CDP fallback in [gates.md](gates.md#browser-check-and-fallback)).

Otherwise `n/a (no benchmarks or budget)`. Docs-only or tests-only diffs: `n/a (no source change)`.

## Threshold

Use the project's own threshold if it has one (in the benchmark config, `verify.md`, CI, or `quality.perf_threshold_pct` in config). Otherwise 10%. The first time the default is used in a run, append to `runs/<run-id>/decisions.md`: `- YYYY-MM-DD · verify · perf threshold · no project threshold; using 10% (run <run-id>)`.

## Base and head

- Head runs in the repo through the recorder ([evidence.md](evidence.md)), one record per round: `bash .software-factory/bin/record.sh perf-head-<n> .software-factory/runs/<run-id>/evidence/perf/head-<n>.log -- <benchmark command>`, so each round keeps its log and fingerprint.
- Base runs in a temp copy outside the repo: `git worktree add --detach "$TMP/sf-perf-<sha7>" <merge-base>`, install with `commands.install`, run the same command, log to `evidence/perf/base.log`. Remove the copy afterwards (`git worktree remove --force`).
- Same machine, same command, same data. Alternate them: base, head, base, head, base, head (3 rounds each), unless the tool already repeats internally and reports a median or mean with spread, in which case one run each is enough.
- If the base doesn't build or run, the gate is `error (base won't run: <reason>)`, not pass. A budget (case 2) is absolute, so it can still be judged on head alone; say `base not compared`.

## Judging

For each metric, use the median across rounds. Mind the direction: time and memory are worse when higher; throughput and operations per second are worse when lower.

**What gates.** Timing and throughput metrics gate. Size metrics (transfer size, bundle size, page weight) and request count gate only against a budget the repo defines (case 2): over budget is a regression whatever the base shows. Without a budget they are reported, never judged against the base: write `<metric>: <base> → <head> (+<pct>%), no budget, reported only` in the summary's notes. Memory gates only when the repo's own benchmark measures it.

A timing or throughput metric regresses when all three hold:

- head is worse than base by more than the threshold,
- the difference is larger than the base's own spread (max minus min across its rounds, or the tool's reported error margin), and
- the difference is larger than an absolute floor: 50 ms for page timings (TTFB, FCP, DOM content loaded, full load, LCP), unless `verify.md` or the project sets another. For a benchmark, the floor is the tool's error margin; when the tool reports none and the base spread is 0, re-run 5 rounds each before calling it, and a spread still at 0 needs the same regression in both runs.

A difference above the threshold but inside the spread or below the floor is `noisy`: report it, re-run that benchmark or page once with 5 rounds each, and judge again. Still inside the spread or below the floor: not a regression.

A budget failure (the tool exits non-zero or reports over budget) is a regression whatever the base shows.

Gate 12 passes when no metric regresses. Report each regression as `<metric>: <base> → <head> (+<pct>%, spread <s>, threshold <t>%)`, and improvements over the threshold as a note.

## Web fallback

When there are no benchmarks or budget, measure page load through the browser MCP for each page the diff touches (from `verify.md`'s feature map), on the base app and the head app.

1. Launch base and head as [design-review.md](design-review.md#the-base-app) describes. Prefer a production build if `verify.md` has one; with a dev server, write `dev server` in the evidence line, since its numbers are rougher.
2. For each page, load it once to warm up, then 5 times each, alternating base and head, with the cache disabled if the tool allows.
3. After each load, read the timing entries with the browser tool's script evaluation, stringified inside the page (the entries' fields don't survive the bridge otherwise): `JSON.stringify({nav: performance.getEntriesByType("navigation")[0], paint: performance.getEntriesByType("paint"), res: performance.getEntriesByType("resource").map(e => ({url: e.name, kind: e.initiatorType, bytes: e.transferSize, ms: e.duration}))})`. Scripts only read timing; [browser safety](exploratory-qa.md#browser-safety) applies.
   - TTFB = `responseStart - requestStart`
   - FCP = the `first-contentful-paint` paint entry's `startTime`
   - DOM content loaded = `domContentLoadedEventEnd - startTime`
   - full load = `loadEventEnd - startTime`
   - transfer total = sum of resource `transferSize`, the request count, and the JS and CSS bytes (resources ending `.js`/`.mjs` and `.css`, or `initiatorType` `script` and `link`)
   - the 10 slowest resources by duration, each marked first-party (same origin as the page) or third-party
   With chrome-devtools, a performance trace may add LCP and CLS; record them when available, `n/a` otherwise, never 0.
4. Judge with the rule above: TTFB, FCP, DOM content loaded, full load and LCP gate; transfer total, request count, JS and CSS bytes, and CLS are reported only, unless `verify.md` or the repo gives a budget for them (a CLS of 0.1 or more is worth a note). A page that fails to load is a functional failure for gate 9, not a slow page.

Save the raw numbers to `evidence/perf/web.json`.

## Record

Write the comparison table (metric, base, head, change, spread, verdict: `regression`, `noisy`, `ok`, `improved` or `reported`) to `evidence/perf/summary.md`; for the web fallback, add each page's slowest-resources list. Then add the gate's own record, as for holdouts: `label: perf`, a short description as the command (`perf base vs head`, or `web timing base vs head`), `exit` 0 for pass and 1 for a regression, `log: evidence/perf/summary.md`. Its `wtree` is `W` only when every `perf-head-<n>` record has `wtree` equal to `W` (for the web fallback: when `wtree.sh` printed `W` both before the first load and after the last); otherwise leave it empty, which makes the gate stale.
