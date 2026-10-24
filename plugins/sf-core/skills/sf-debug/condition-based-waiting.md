# Condition-based waiting

Reached from `sf-debug`'s flake recipe when a failure depends on timing. Arbitrary delays guess how long something takes, so tests pass on a fast machine and fail under load, in parallel, or in CI.

**Core principle:** wait for the condition you actually care about, not for a guess at how long it takes.

## When it applies

- A test sleeps or sets a fixed timeout (`setTimeout`, `sleep`, `time.sleep()`) before asserting.
- A test passes sometimes and fails under load, or times out when run in parallel.
- A test waits for an async operation to finish.

The exception is a test of timing behaviour itself (debounce, throttle, tick intervals): there a fixed wait can be correct, under the rules at the end.

## The pattern

```typescript
// BEFORE: guessing at timing
await new Promise(r => setTimeout(r, 50));
const result = getResult();
expect(result).toBeDefined();

// AFTER: waiting for the condition
await waitFor(() => getResult(), 'result to be available');
const result = getResult();
expect(result).toBeDefined();
```

| Scenario | Pattern |
|---|---|
| Wait for an event | `waitFor(() => events.find(e => e.type === 'DONE'), 'DONE event')` |
| Wait for a state | `waitFor(() => machine.state === 'ready', 'ready state')` |
| Wait for a count | `waitFor(() => items.length >= 5, '5 items')` |
| Wait for a file | `waitFor(() => fs.existsSync(path), 'file to exist')` |
| Complex condition | `waitFor(() => obj.ready && obj.value > 10, 'ready with value > 10')` |

Before writing your own, check whether the test framework already ships an equivalent (a `waitFor` in the testing library, an `eventually` matcher) and use that.

## Implementation

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const start = Date.now();
  while (true) {
    const result = condition(); // read fresh state on every poll
    if (result) return result;
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }
    await new Promise(r => setTimeout(r, 10)); // poll every 10ms
  }
}
```

Domain helpers are thin wrappers over it. For an event stream:

```typescript
function waitForEventCount(source: EventSource, type: string, count: number, timeoutMs = 5000) {
  return waitFor(() => {
    const matching = source.getEvents().filter(e => e.type === type);
    return matching.length >= count ? matching : undefined;
  }, `${count} ${type} events`, timeoutMs);
}
```

A flaky abort test, before and after:

```typescript
// BEFORE: fails at random
const messagePromise = agent.sendMessage('Execute tools');
await new Promise(r => setTimeout(r, 300)); // hope the tools start in 300ms
agent.abort();
await messagePromise;
await new Promise(r => setTimeout(r, 50));  // hope the results arrive in 50ms
expect(toolResults.length).toBe(2);

// AFTER: waits on what it needs
const messagePromise = agent.sendMessage('Execute tools');
await waitForEventCount(events, 'TOOL_CALL', 2);   // the tools have started
agent.abort();
await messagePromise;
await waitForEventCount(events, 'TOOL_RESULT', 2); // the results have arrived
expect(toolResults.length).toBe(2);
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Polling too fast (`setTimeout(check, 1)`) wastes CPU | Poll every 10ms |
| No timeout: loops forever if the condition never holds | Always time out, with an error naming the condition |
| Stale data: state cached before the loop | Call the getter inside the loop |

## When a fixed wait is correct

```typescript
// The tool ticks every 100ms; two ticks are needed to verify partial output
await waitForEventCount(events, 'TOOL_STARTED', 1); // first: wait for the trigger
await new Promise(r => setTimeout(r, 200));          // then: two known 100ms ticks
```

All three hold: you first wait for the triggering condition, the duration comes from known timing rather than a guess, and a comment says why.
