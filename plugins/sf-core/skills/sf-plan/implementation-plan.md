# Implementation plan branch

Write the plan for an engineer who has seen neither this codebase nor this spec. Assume they write idiomatic code in the project's language once they know the exact interface and the exact test, and make a reasonable choice wherever the plan leaves one open. What they cannot know is what you decided: which files, which names and signatures, which values from the spec, which tests prove each task. The plan records those decisions as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Save the plan in the plans folder named in [work-docs.md](../../references/work-docs.md), as `YYYY-MM-DD-<feature-name>.md`.

## 1. Scope check

A plan produces working, testable software on its own. When the spec covers several independent subsystems, suggest one plan per subsystem and ask which to write first.

## 2. File structure

Before defining tasks, map which files will be created or modified and what each one is responsible for. This is where decomposition gets locked in.

- Design units with clear boundaries and well-defined interfaces, one clear responsibility per file.
- Prefer smaller, focused files: you reason best about code you can hold in context at once, and edits to focused files are more reliable.
- Files that change together live together. Split by responsibility, not by technical layer.
- In an existing codebase, follow its established patterns. Restructure only a file the plan modifies that has grown unwieldy, and then as a task of its own.

Each task's changes make sense on their own.

## 3. Task boundaries

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. Fold setup, configuration, scaffolding and documentation into the task whose deliverable needs them; split only where a reviewer could meaningfully reject one task while approving its neighbor. Each task ends with an independently testable deliverable.

Each step inside a task is one action with a checkable result: write the failing test; run it and see it fail; implement the minimal code; run it and see it pass; commit.

## 4. Write the plan

Every plan starts with this header:

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** this plan runs task by task under `/sf-execute` (inline or subagent-driven mode). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [one sentence describing what this builds]

**Architecture:** [two or three sentences about the approach]

**Tech Stack:** [key technologies and libraries]

**Spec:** [path or tracker reference of the spec this plan implements; the plan argues from the spec, so the spec travels with it and executors read both]

## Global Constraints

[The spec's project-wide requirements (version floors, dependency limits, naming and copy rules, platform requirements), one line each, with exact values copied verbatim from the spec. Every task's requirements implicitly include this section.]

## Review Focus

[The five input classes or failure modes the spec implies but no task's tests exercise that are most likely to bite a person using this software, one line each, most likely first: the input or condition, and the behavior a reasonable person would expect. The spec is a vision document: it says what the software must do, not everything it will meet, and its silence on an input is not permission for that input to break the program. For each line, add the test that pins it to the task that owns the code, in that task's own step style.]

---
```

Then one block per task:

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks, with exact signatures]
- Produces: [what later tasks rely on: exact function names, parameter and return types]

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Implement `function(input: InputType) -> ResultType` in `exact/path/to/file.py`**

One line on the approach when the signature and the test leave a choice (which library call, which data structure); a code block only for an algorithm they do not determine.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

The **Files** and **Interfaces** blocks do two jobs. A task's implementer sees only its own task, so Interfaces is how it learns the names and types its neighbors use. And `/sf-execute` reads both blocks to decide which tasks are independent enough to run in parallel, so Files lists every file the task touches, shared ones included (a manifest, a lockfile, a fixture, a route table).

### What a step contains

A step is done when the implementer can write exactly one reasonable thing from it: unambiguous, not complete. Each kind of step carries what makes it unambiguous and nothing more:

- **A test step:** the test's name and its assertions, as code, with the spec's exact values in them.
- **A code step:** the exact signature (name, parameters, return type), the file it lives in, and the specific values the spec pins. The implementer writes the body. A body appears only for an algorithm the signature and tests do not determine, or for exact copy the spec fixes.
- **A verification step:** the command to run and the `Expected:` output that means it passed.
- **A reference to another task:** that task's Interfaces block says what to use; the plan does not repeat its code.

A plan is the set of decisions the implementer cannot make alone. A plan longer than the code it describes has written the code instead. Lines that decide nothing ("TBD", "handle edge cases", "add appropriate validation", "write tests for the above", a type or function no task defines) are the opposite failure. The self-review catches both.

## 5. Self-review

With the complete plan written, read the spec again with fresh eyes and check the plan against it yourself, as a checklist:

1. **Spec coverage:** for each section and requirement of the spec, point to the task that implements it. A requirement with no task gets one.
2. **Step scan:** every step lets the implementer write exactly one reasonable thing, and no more. A line that decides nothing is a gap; a function body the signature and tests already determine is a transcript.
3. **Type consistency:** the types, signatures and property names used in later tasks match those defined in earlier ones. `clearLayers()` in Task 3 and `clearFullLayers()` in Task 7 is a bug.
4. **Review Focus:** for each input class or failure mode the spec implies, a task's tests exercise it. The five uncovered ones most likely to bite a person are in Review Focus, each with its test added to the owning task. An empty section means you checked and found none.
5. **Proportion:** a plan several times longer than its spec is a transcript of the program. When code blocks are most of the document, replace bodies with signatures, test names and assertions, and check each step is still unambiguous.
6. **Parallel-readiness:** every task's Files block lists every file it touches, shared files included.

Fix what you find inline and move on. Done when all six checks pass.

## 6. Hand off

Link the plan for the user to read. When they have already named an execution mode, ask them to review the plan and confirm it captures what they want. Otherwise ask them to review it and choose a mode, with your recommendation:

**"Plan complete and saved to `<plan path>`. Please review it. Which execution mode would you prefer?**

- **Inline**: I implement every task myself in this session, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end. Runs well on a mid-tier session model, since the plan carries the design.
- **Subagent-driven**: a fresh subagent implements each task and a fresh reviewer checks it before the task counts as done, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review. Independent tasks can run in parallel.

**For this plan I recommend <one of the two>, because <one sentence from the plan: how much the tasks depend on each other's interfaces, how many there are, what a shipped mistake would cost>. Does the plan capture what you want, and which mode should we use?"**

Done when the user has reviewed the plan and a mode is settled. End by suggesting the user run `/sf-execute <plan path>` in that mode.
