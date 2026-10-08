# Resolving a prototype ticket

A prototype is throwaway code that answers one design question by giving a person something concrete to react to. It is HITL: the person tries it and gives the verdict. The prototype is evidence for a decision, never the start of the build. Unattended, don't start one.

## Pick the shape

Ask which question is being answered, with your recommendation:

- **Logic:** "Does this state model, rule or data shape hold up?", or "What should this API look like?" before writing it. Build one self-contained HTML file.
- **UI:** "What should this look like?" Build a few variants on one route of the app.
- **Outline or stub:** a question that needs no running code: the structure of a document or flow, a rough first take, an interface or API signature stub, a config shape. Write it as one markdown file (types or signatures in code blocks) and post it on the ticket or link it as an asset.

If the person isn't sure, pick logic for a backend rule, data shape or API, UI for a page or component, and an outline or stub when nothing needs to run. State that guess in the prototype's opening lines.

## Rules for the code shapes

An outline or stub needs only rules 2, 5 and 7: it lives on the ticket, not on a branch.

1. **On a throwaway branch.** Create `sf/proto-<map-slug>-<ticket-slug>` from the default branch, in a separate worktree if the current one has uncommitted changes. Never merge it, and never open a PR/MR for it.
2. **Named as a prototype.** Paths or file names include `prototype`, so no one mistakes it for real code. Place it next to the module or page it explores, following the project's existing layout.
3. **One command or one double-click to run it.** Write that command at the top of the prototype and in the resolution.
4. **No persistence and no real data.** State lives in memory. If the question is about storage, use a scratch file or database named `PROTOTYPE-wipe-me`. Never point it at shared, staging or production data, and put no secrets in it. Variants hosted on a real page may read its data, but every action that would change something (save, delete, submit, send) calls a stub that only updates in-memory state, never the real mutation.
5. **No polish.** Skip tests and future-proof abstractions; handle errors only as far as needed to keep it running.
6. **Show the state.** After every action, or on every variant switch, show the full state that matters so the person can see what changed.
7. **Install nothing new** unless the person agrees. Prefer what the project already has.

## Logic shape

- Write the question in a visible paragraph at the top of the page.
- Put the logic in one pure module inside the file, in the shape the question needs, not the one easiest to wire to a page. Choose a reducer if the state is a single value changed by separate events; a state machine if the question includes which actions are allowed at a given moment; plain pure functions if nothing is held between calls and inputs simply map to outputs; a class or module with well-defined methods if the logic keeps state over time. The module never touches the DOM: calls go from the page into it, and it never calls the page. This module is the part the spec may reuse.
- Plain HTML, CSS and JavaScript, all inline. No framework, bundler or server.
- Use the domain's words on labels, not code names.
- Sections, top to bottom: the question; the current state as labelled fields; one button per action, always available; scenarios as tabs, each a short description plus the buttons to press in order, starting from a fixed initial state. Include the happy path, an awkward edge case, and an attempt at something that should be refused.
- Keep the styling quiet: readable type, plenty of white space, a single accent colour. Leave out animation and any decoration that pulls the eye away from the state display and the action buttons.

## UI shape

- Write a one-line plan at the top of the switcher file: the question, the number of variants, the switch parameter and the route.
- Prefer an existing page as the host, with the variants switched by a `?variant=` URL parameter, so they are judged against real layout and data. Keep the page's data fetching, params and auth where they are, above one switcher component; only the rendered subtree changes per variant. Use a new throwaway route (`/prototype/<name>`) only when nothing existing can host it.
- Three variants by default, five at most. Each serves the page's purpose with the data it actually has, uses the project's component library and styling, and is its own named component (`VariantA`, `VariantB`…, with a short name such as "Sidebar layout").
- They differ in structure (layout, hierarchy, main action), not only in colour or copy. Variants may share small pieces such as a header, never a layout component. Compare the drafts: if two look alike, redo one with an explicit exclusion ("not a card grid").
- The switcher: one shared component, placed where the project keeps shared UI, rendered as a small fixed bar at the bottom centre, visually distinct from the page (a high-contrast pill) so nobody judges it as part of the design. Previous and next arrows wrap around; the label shows the key and name, e.g. `B (Sidebar layout)`. Arrows and the left and right arrow keys (ignored while an input, textarea or contenteditable has focus) update `?variant=` through the framework's router, so a link or a reload shows the same variant. Hide it in production builds (`process.env.NODE_ENV !== 'production'` or the framework's equivalent) as a second guard behind never merging the branch.

## Hand it over

Give the person the way in: the file to open (logic), the URL with each `?variant=` key (UI), or the posted outline or stub. They try it when they can. The reactions worth catching are surprise that something was allowed, or a wish to combine parts of two variants (say, one variant's header on another's layout): each is a finding about the idea. When they ask for another action, scenario or variant, add it and hand it back; prototypes change until the question is answered.

## Capturing the answer

1. Commit the prototype on its branch with a message naming the ticket. Pushing the branch makes it visible to others: ask (recommended: yes, when others will read the map).
2. The person gives the verdict: which option, what to keep, what surprised them. Their words decide, not yours.
3. Post the resolution comment: the question, the verdict, `Decided by: <person>`, the branch name, the run command (and for UI the URL and variant keys), and which part (for example the pure logic module) the spec or plan should reuse.
4. Don't fold anything into real code. The decision goes into the spec through the map; the build happens later in `sf-build`.
