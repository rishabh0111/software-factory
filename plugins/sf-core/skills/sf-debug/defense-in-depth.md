# Defence in depth

Reached from `sf-debug` Phase 5 when invalid data caused the bug. After fixing it at the source, one validation point feels sufficient, but other code paths, later refactoring and mocks can each bypass a single check.

**Core principle:** validate at every layer the data passes through, so the bug becomes structurally impossible rather than merely fixed.

## Apply it

1. **Trace the data flow**: where the bad value originates and where it is used ([root-cause-tracing.md](root-cause-tracing.md)).
2. **Map every checkpoint** the data passes through.
3. **Add the check that fits each layer**, from the four below.
4. **Test each layer**: bypass layer 1 and show layer 2 catches it, and so on.

Done when every checkpoint on the map has a check, and each check has a test that bypasses the layers above it.

## The four layers

### 1. Entry-point validation

Reject obviously invalid input at the API boundary.

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... proceed
}
```

### 2. Business-logic validation

Ensure the data makes sense for this operation.

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... proceed
}
```

### 3. Environment guards

Refuse dangerous operations in specific contexts.

```typescript
async function gitInit(directory: string) {
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));
    if (!normalized.startsWith(tmpDir)) {
      throw new Error(`Refusing git init outside temp dir during tests: ${directory}`);
    }
  }
  // ... proceed
}
```

### 4. Debug instrumentation

Capture context for forensics when the other layers miss something. This layer is permanent and goes through the project's logger at debug level, unlike the tagged `[DEBUG-...]` probes that Phase 6 removes.

```typescript
async function gitInit(directory: string) {
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack: new Error().stack,
  });
  // ... proceed
}
```

## Worked example

**Bug:** an empty `projectDir` made `git init` run in the source tree.

**Data flow:** test setup yields `''` → `Project.create(name, '')` → `WorkspaceManager.createWorkspace('')` → `git init` runs in `process.cwd()`.

**Layers added:**

- Layer 1: `Project.create()` validates the directory is non-empty, exists and is writable.
- Layer 2: `WorkspaceManager` validates `projectDir` is non-empty.
- Layer 3: `WorktreeManager` refuses `git init` outside the temp dir in tests.
- Layer 4: a stack-trace log before `git init`.

Every layer earned its place: other code paths bypassed the entry check, mocks bypassed the business-logic check, platform edge cases needed the environment guard, and the debug log exposed structural misuse.
