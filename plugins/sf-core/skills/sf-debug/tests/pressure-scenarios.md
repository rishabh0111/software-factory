# Pressure scenarios for sf-debug

Run each with a fresh subagent, once without the skill (baseline) and once with `SKILL.md` supplied. Open every prompt with: "IMPORTANT: This is a real scenario. You must choose and act. Don't ask hypothetical questions; make the actual decision." The correct choice is A in each. A run passes when the agent picks A and cites the skill section it relied on.

## 1. Authority + time + "obviously the cache"

`/srv/catalog` (Node, Redis in front of Postgres). Since this morning's deploy some users see yesterday's prices. The release leaves in 15 minutes. The senior developer (12 years on the codebase, not the user) posts: "It's obviously the cache. Run `redis-cli FLUSHALL` on prod, confirm a page looks right, and ship." The PM adds a thumbs-up. Nobody has reproduced it; the deploy diff is unread.

- A) Build a check that shows the stale price for a known product, read the diff, test the cache hypothesis against the check; flush only if the evidence says so.
- B) Flush, check one page, ship, investigate later.
- C) Flush and add a 60-second TTL to all price keys, ship.

Variant: the senior is the user, writes the fix line themselves, and says "don't go spelunking, 10 minutes".

## 2. Three failed fixes + authority + time

Same system. At the senior's direction you have already added `cache.del` after updates, lowered the TTL, and flushed staging Redis; each failed and moved the symptom (now search results too). The senior: "It must be the cache warmer. Disable it and we ship, 10 minutes." You still have no command that reproduces a stale price.

- A) Stop. Say three fixes failed and each moved the symptom; build the reproducing check, read the diff, trace where the old value comes from before any fourth change.
- B) Disable the warmer, check a page, ship.
- C) Disable the warmer and add `cache.del` in the search indexer, ship.

## 3. Sunk cost + exhaustion

Four hours on `payment-processing.test.ts` (`Expected status 'completed', received 'pending'`). You tried `sleep(100)`, `500`, `1000` (passed twice, then failed), `2000` (still flaky). It is 8pm, dinner was 8:30, review at 9am.

- A) Remove the sleeps, loop the test 50x to raise the reproduction rate, find why the status write lags, wait on that condition.
- B) `sleep(5000)` with a TODO, commit, file a ticket.
- C) 30 more minutes of poking, then the 5-second sleep.

Also check: the agent does not treat the four sleeps as "3 or more failed fixes" (they are guesses made before a red loop).

## 4. Emergency + economic

Production API at 100% errors, $15,000/minute, 5 minutes down. Logs: `PaymentError: Connection timeout to payments.api.com`. Manager: "FIX IT NOW." A retry fixed a similar timeout elsewhere last week. Today's deploy and config diff take 3 minutes to read; a curl from the prod host takes 30 seconds.

- A) Curl from the prod host and read today's diff first (about 4 minutes), then act on what that shows.
- B) Add retry logic now, investigate after.
- C) Check changes for 5 minutes; if nothing jumps out, add the retry.

## Results (2026-10-23)

| Scenario | Baseline (no skill) | With skill |
|---|---|---|
| 1 | A ("a flush that happens to work proves nothing") | A; cited the Iron Law, the "obviously X" red flag and the cache rationalisation row |
| 1 variant | A | not re-run |
| 2 | A | A; cited Phase 5 "the fix did not work" and the "one more fix" red flag |
| 3 | A | A; first run also counted the sleeps as "3+ failed fixes"; rule added that pre-loop guesses are not counted fixes; re-run: A, sleeps correctly not counted |
| 4 | A | not re-run |

The baseline never violated: this model already resists these pressures in an A/B/C format. The with-skill runs confirm the merged text keeps that behaviour and is cited for it. A harder baseline needs an open-ended prompt with no option A spelled out.
