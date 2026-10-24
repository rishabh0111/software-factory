# Writing good tests

Reached from `sf-tdd` when you write or change a test, add a mock, or add a test-only helper. A test exists to catch a specific break, and two principles govern everything here:

```
1. Every test names the break it catches
2. Every test exercises the real thing
```

A test written first and watched failing against real code has already proven it can fail, and earns a mock only when the real dependency is slow or external. The rules below keep it that way.

## What a good test is

A good test verifies behaviour through the public interface at its seam, not implementation details. The code can change entirely; the test should not. It reads like a specification, "user can checkout with valid cart", and survives refactors because it does not care about internal structure.

```typescript
// GOOD: observable behaviour through the public API
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

It tests behaviour callers care about, uses the public API only, describes _what_ rather than _how_, and holds one logical assertion.

| Quality | Good | Bad |
|---|---|---|
| **Minimal** | One thing. "and" in the name? Split it. | `test('validates email and domain and whitespace')` |
| **Clear** | The name describes the behaviour | `test('test1')` |
| **Shows intent** | Demonstrates the desired API | Obscures what the code should do |

## Principle 1: Name the break

Before writing the test body, answer: **what production change should make this test fail, and is that change a bug or a decision?** A test earns its place by catching a wrong branch, a missing side effect, a wrong argument, a boundary case or a broken contract.

**Derive expectations independently.** Use literals and hand-checked fixtures; table-driven tests with literal `want` values are the preferred shape. A **tautological** test takes its expected value from the code under test, its helpers, or the same logic restated, so it passes by construction and can never disagree with the code:

```typescript
// BAD: the expected value recomputes the code's own logic
const items = [{ price: 10 }, { price: 5 }];
const expected = items.reduce((sum, i) => sum + i.price, 0);
expect(calculateTotal(items)).toBe(expected);

// BAD: the same builder computes both sides
expect(buildSearchQuery({ tag: 'urgent' })).toBe(buildSearchQuery({ tag: 'urgent' }));

// GOOD: hand-derived literals
expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
expect(buildSearchQuery({ tag: 'urgent' })).toBe('tag:"urgent"');
```

**No change detectors.** When only intentional decisions can fail a test (a constant's value, exact message wording, private structure), it fires on every redesign and sleeps through bugs. Test the behaviour that depends on the decision: not `expect(MAX_RETRIES).toBe(5)`, but "a failing call is retried 5 times and the 6th attempt never happens."

**Behaviour, not text.** Asserting that a script, skill or config contains an exact line proves only that the source is the source. Run scripts against controlled inputs and assert outputs, side effects or exit codes. A document that instructs agents is tested by pressure-testing the agent that consumes it; prose for humans earns no test at all.

**Your code, not the framework.** Test the contract your code makes at its boundaries: the route you register, the query you emit, the payload you produce. Upstream mechanics are their maintainers' tests (the classic: asserting your router invokes a registered handler). When upstream behaviour genuinely surprised you, write one narrow characterization test naming the assumption. The same line runs inside your code: constructors, getters, constants and trivial forwarding earn tests only when they validate, normalize, default, derive, enforce or cause side effects; otherwise assert the first consumer-visible result that depends on them.

**Ship only the tests the behaviour needs.** Trivial code and human prose earn none, and a test written to satisfy process costs maintenance forever.

### Gate: before writing the test body

```
Name the production change that would make this test fail.

  Cannot name one            → redesign around an observable behaviour
  "The source text changed"  → run the artifact and assert its effects
  Only intentional decisions → change detector; test the behaviour
                               that depends on the decision

Confirm the expected value is derived without the code under test.
  Reuses the code's logic or helpers → replace it with a literal
                                       or a hand-checked fixture
```

## Principle 2: Exercise the real thing

### Mock only at system boundaries

Mock what you do not control and cannot run cheaply:

- external APIs (payment, email)
- databases, sometimes (prefer a test database)
- time and randomness
- the file system, sometimes

Your own classes and modules, internal collaborators, and anything else you control stay real. Mocking them couples the test to the implementation: it breaks when you refactor without changing behaviour.

```typescript
// BAD: asserts an internal call, not an outcome
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});

// BAD: bypasses the interface to verify through a side channel
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: verifies through the interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

### The mock earns no assertions

A mock assertion passes when the mock is present and fails when it is absent: it says nothing about the component. Assert the real component's behaviour; if the mock is what you are checking, unmock it or delete the assertion. The question to ask yourself: "Are we testing the behaviour of a mock?"

```typescript
// BAD: vague name, asserts the mock's call count
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(3);
});

// GOOD: clear name, a real operation, the outcome asserted
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };
  const result = await retryOperation(operation);
  expect(result).toBe('success');
  expect(attempts).toBe(3);
});

// BAD: mock existence             GOOD: real behaviour
// expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
// expect(screen.getByRole('navigation')).toBeInTheDocument();
```

### Mock at the right level

Learn every side effect of the real method before replacing it; mock the slow or external operation and keep what the test depends on real. When unsure, run the test against the real implementation first and observe what actually needs to happen.

```typescript
// BAD: the mock swallows the config write that duplicate detection reads
vi.mock('ToolCatalog', () => ({
  discoverAndCacheTools: vi.fn().mockResolvedValue(undefined)
}));

// GOOD: mock only the slow server startup; the config write stays real
vi.mock('MCPServerManager');
```

**Make doubles specific.** When arguments, call counts or ordering are part of the boundary's contract, assert them: a fake that accepts anything verifies nothing. Give each branch (success, error, malformed) its own fixture or spy, so the wrong branch cannot satisfy the expectation.

**Mirror real data completely.** A mock response carries the complete structure as it exists in reality, every documented field, not just the ones your test reads. Partial mocks fail silently when downstream code reads an omitted field: the test passes while integration breaks.

**Prefer real components over complex mocks.** When mock setup outgrows the test logic, mocks miss methods the real components have, or tests break when the mock changes, switch to an integration test with real components. Ask: "Do we need to be using a mock here?"

### Design boundaries to be mockable

**Inject dependencies** rather than creating them inside:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**Prefer SDK-style interfaces over a generic fetcher:** one function per external operation, so each mock returns one specific shape, test setup needs no conditional logic, the endpoints a test exercises are visible, and each endpoint is typed.

```typescript
// GOOD: each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

### Production classes carry production methods only

Cleanup that only tests need lives in test utilities, never as a `destroy()` on the production class. Ask: is this method called only from tests? Does this class own this resource's lifecycle? Either answer pointing at tests means a test utility.

### Gate: before adding a mock or test helper

```
List the real method's side effects; keep the ones the test
depends on real, and mock the slow/external level below them.

Mock responses mirror the complete real structure.

A method only tests call lives in test utilities, not production.

About to assert on the mock itself?
  Unmock it or delete the assertion.
```

## The mutation check

Before finishing a test file, mentally mutate the production code; at least one test should fail for each realistic mutation:

- wrong constant or argument
- wrong branch handler
- missing state change or side effect
- empty or default return
- missing validation for zero, empty, nil, unauthorized or malformed input

A mutation nothing catches marks the behaviour as unprotected, or the test as tautological.

## Quick reference

| When you... | Do |
|---|---|
| Write any test | Name the break it catches: a bug, not a decision |
| Build an expected value | Derive it by hand, never with the code under test |
| Test a script or document | Run it, or pressure-test its consumer; never grep its text |
| Reach for a dependency test | Test your boundary contract, not their documented mechanics |
| Want to assert on a mocked element | Test the real component, or unmock it |
| Are about to mock a method | Learn its side effects; mock the slow/external level |
| Build a mock response | Mirror the real structure completely |
| Need cleanup only tests use | Put it in test utilities |
| Watch mock setup balloon | Switch to an integration test with real components |
| Finish a test file | Run the mutation check |

## Warning signs

- Setup and assertion share the same object, guaranteeing equality
- Expected values are hidden behind loops, builders or helpers
- The test fails on every intentional change, never on accidental breakage
- The test breaks on a refactor that did not change behaviour
- The test name describes _how_, not _what_
- It tests a private method, or verifies through a side channel instead of the interface
- It mocks an internal collaborator, or asserts call counts and order that are not part of a boundary's contract
- An assertion checks a `*-mock` test ID, or fails if you remove the mock
- Mock setup is more than half the test, or you can't explain why the mock is needed
- Mocking "just to be safe"
- A method is called only from test files
- The test can fail only through a panic, crash or missing selector
- The test greps source text, or asserts a removed symbol stays removed
- The test would still matter if only the framework remained
- The test exists for coverage, checking no side effect or outcome
