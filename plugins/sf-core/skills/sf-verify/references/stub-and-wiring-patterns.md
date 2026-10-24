# Stub, wiring and data-flow patterns

The grep catalogue behind [goal-backward-verification.md](../goal-backward-verification.md) Steps 4, 5 and 7. Read only the section for the stack you are verifying. A pattern match is a lead, not a verdict: read the code around it before classifying.

Four questions per artifact: does it **exist**, is it **substantive** (real implementation, not placeholder), is it **wired** (connected to the rest of the system), does real **data flow** through it? Grep answers the first three; the fourth often needs a spot-check or a human.

## Universal stub patterns

```bash
grep -E "(TODO|FIXME|XXX|HACK|PLACEHOLDER)" "$file"                 # stub comments
grep -i -E "implement|add later|coming soon|will be" "$file"
grep -E "// \.\.\.|/\* \.\.\. \*/|# \.\.\." "$file"
grep -i -E "placeholder|lorem ipsum|coming soon|under construction" "$file"   # placeholder output
grep -i -E "sample|example|test data|dummy" "$file"
grep -E "return null|return undefined|return \{\}|return \[\]" "$file"       # empty implementations
grep -E "pass$|\.\.\.|\bnothing\b" "$file"
grep -E "id.*=.*['\"].*['\"]" "$file"                                # hardcoded where dynamic is expected
grep -E "count.*=.*[0-9]+|length.*=.*[0-9]+" "$file"
```

## React / Next.js components

```bash
[ -f "$component" ] && grep -E "export (default |)function|export const.*=.*\(" "$component"   # exists, exports
grep -E "return.*<" "$component" | grep -v "return.*null" | grep -vi placeholder           # returns real JSX
grep -E "<[A-Z][a-zA-Z]+|className=|onClick=|onChange=" "$component"                     # more than a wrapper div
grep -E "props\.|useState|useEffect|useContext" "$component"                            # uses props or state
grep -E "fetch\(|axios\.|useSWR|useQuery|getServerSideProps|getStaticProps" "$component"  # fetches, if it should
```

Stubs:

```javascript
return <div>Component</div>
return <div>Placeholder</div>
return <div>{/* TODO */}</div>
return <p>Coming soon</p>
return null
return <></>
onClick={() => {}}
onChange={() => console.log('clicked')}
onSubmit={(e) => e.preventDefault()}   // only prevents default
```

Needs a human or a running app: does it render visible content, respond to clicks, load and show data, show error states?

## API routes (Next.js App Router, Express and similar)

```bash
grep -E "export (async )?(function|const) (GET|POST|PUT|PATCH|DELETE)" "$route"   # App Router handlers
grep -E "\.(get|post|put|patch|delete)\(" "$route"                                # Express-style
wc -l < "$route"                                                                   # more than 10-15 lines suggests real logic
grep -i -E "prisma\.|db\.|mongoose\.|sql|query|find|create|update|delete" "$route" # touches a data source
grep -E "try|catch|throw|error|Error" "$route"                                     # handles errors
grep -E "req\.json\(\)|req\.body|request\.json\(\)" "$route"                       # reads the body (POST/PUT)
grep -E "schema\.parse|validate|zod|yup|joi" "$route"                              # validates input
```

Stubs:

```typescript
export async function POST() { return Response.json({ message: "Not implemented" }) }
export async function GET() { return Response.json([]) }        // empty, no query
export async function PUT() { return new Response() }
export async function POST(req) { console.log(await req.json()); return Response.json({ ok: true }) }
```

Check functionally: GET returns real data, POST creates a record, errors carry the right status, auth is enforced.

## Database schema (Prisma, Drizzle, SQL)

```bash
grep -E "^model $model|CREATE TABLE $table|export const $table" "$schema"         # defined
grep -A 20 "model $model" "$schema" | grep -E "^\s+\w+\s+\w+"                       # more fields than id
grep -E "@relation|REFERENCES|FOREIGN KEY" "$schema"                                 # relations, if expected
grep -A 20 "model $model" "$schema" | grep -E "Int|DateTime|Boolean|Float|Decimal|Json"   # real types, not all String
ls prisma/migrations/ | wc -l; npx prisma migrate status                            # migrations exist and applied
[ -d node_modules/.prisma/client ]                                                   # client generated
```

Stubs: a model with only `id` and a `// TODO: add fields`; a `Message` with one real field; an `Order` missing `userId`, `items`, `total`, `status`, `createdAt`.

## Hooks and utilities

```bash
grep -E "useState|useEffect|useCallback|useMemo|useRef|useContext" "$hook"    # a custom hook uses hooks
grep -E "return \{|return \[" "$hook"                                         # meaningful return
grep -r "import.*$hook_name" src/ | grep -v "$hook"                           # imported elsewhere
grep -r "$hook_name()" src/ | grep -v "$hook"                                 # and called
```

Stubs:

```typescript
export function useAuth() { return { user: null, login: () => {}, logout: () => {} } }
export function useCart() { const [items] = useState([]); return { items, addItem: () => console.log('add') } }
export function useUser() { return { name: "Test User", email: "test@example.com" } }   // hardcoded
```

## Environment variables and configuration

Never read `.env` files: check variable **names** against `.env.example`, and check values only through the environment the checks run in, without printing them.

```bash
printenv "$VAR_NAME" >/dev/null                      # defined in this environment
v=$(printenv "$VAR_NAME"); case "$(printf %s "$v" | tr '[:upper:]' '[:lower:]')" in
  ""|*your-*-here*|*xxx*|*placeholder*|*todo*) exit 1;;   # missing or placeholder
esac
grep -r -E "process\.env\.$VAR_NAME|env\.$VAR_NAME" src/   # used in code
grep -E "$VAR_NAME" src/env.ts src/env.mjs                # in the env validation schema, if there is one
```

When a framework loads `.env.local` itself at runtime, the variable is not in the shell: ask the user to confirm it is set. Stub values: `your-database-url-here`, `sk_test_xxx`, `placeholder`, a production URL still pointing at `localhost`.

## Wiring patterns

Pieces that exist but are not connected are where most stubs hide.

### Component → API

```bash
grep -E "fetch\(['\"].*$api_path|axios\.(get|post).*$api_path" "$component"   # the call
grep -E "fetch\(|axios\." "$component" | grep -v "^.*//.*fetch"              # not commented out
grep -A 5 "fetch\|axios" "$component" | grep -E "await|\.then|setData|setState"   # response used
```

WIRED: call plus response handling. PARTIAL: call, response unused. NOT_WIRED: no call. Red flags: `fetch('/api/messages')` with no await or assignment; the fetch inside a comment; a typo'd endpoint (`/api/message`).

### API → Database

```bash
grep -E "prisma\.$model|db\.$model|$model\.(find|create|update|delete)" "$route"   # the query
grep -E "await.*prisma|await.*db\." "$route"                                       # awaited
grep -E "return.*json.*\w+|res\.json\(\w+" "$route"                               # result returned
```

WIRED: query plus result returned. PARTIAL: query, static return (`await prisma.message.findMany(); return Response.json({ ok: true })`). NOT_WIRED: no query. Also a red flag: an un-awaited query returned as data (a Promise).

### Form → Handler

```bash
grep -E "onSubmit=\{|handleSubmit" "$component"
grep -A 10 "onSubmit.*=" "$component" | grep -E "fetch|axios|mutate|dispatch"
```

WIRED: handler plus API call or mutation. STUB: the handler only logs or calls `preventDefault`. NOT_WIRED: no handler.

### State → Render

```bash
grep -E "useState.*$state_var|\[$state_var," "$component"
grep -E "\{.*$state_var.*\}|\{$state_var\." "$component"
grep -E "\.map\(|\.filter\(|\.reduce\(" "$component"
```

WIRED: the state is displayed. NOT_WIRED: state exists but the output is hardcoded (`const [messages] = useState([]); return <div>No messages</div>`), or a different variable is rendered.

## Data-flow trace (level 4)

For each artifact that passed level 3 and renders dynamic data (components, pages, dashboards; not utilities or config):

1. Find the rendered variable: `grep -n -E "useState|useQuery|useSWR|useStore|props\." "$artifact"`.
2. Find what fills it: `grep -n -A 5 "set${STATE_VAR}\|${STATE_VAR}\s*=" "$artifact" | grep -E "fetch|axios|query|store|dispatch|props\."`.
3. Check the source queries real data (`grep -n -E "prisma\.|db\.|query\(|findMany|findOne|select|FROM" "$source_file"`) rather than returning static data (`grep -n -E "return.*json\(\s*\[\]|return.*json\(\s*\{\}" "$source_file"`).
4. Check the call sites for props hardcoded empty: `grep -r -A 3 "<${COMPONENT_NAME}" src/ | grep -E "=\{(\[\]|\{\}|null)\}"`.

| Data source | Produces real data | Status |
|---|---|---|
| A query found | yes | ✓ FLOWING |
| A fetch exists, static fallback only | no | ⚠️ STATIC |
| No data source found | n/a | ✗ DISCONNECTED |
| Props hardcoded empty at the call site | no | ✗ HOLLOW_PROP |

A wired artifact whose data does not flow is HOLLOW (Step 4's status table).
