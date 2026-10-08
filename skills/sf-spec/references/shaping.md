# Shaping an idea

Use this when the input is an idea, not a described behaviour: no current-versus-wanted behaviour, no concrete user, or a wish such as "add offline mode". Shaping is short. It ends with four answers, written to `runs/<run-id>/shaping.md`, that feed the spec's `Why`, `Capabilities` and `Non-goals`.

## 1. Restate it

Write the idea back in one sentence, in the user's terms. If you can't, the idea is too thin; go to step 5.

## 2. Ground it in the repo

Before forming any answer, look:

- code that already does part of this, or that this would change (cite `path:line`)
- recent commits touching that code (`git log -n 20 --oneline -- <paths>`), for work already in flight
- the README, docs and existing specs in `.software-factory/specs/`
- `.software-factory/out-of-scope/` for a matching rejection (if one matches, stop and report it)
- `.software-factory/constitution.md` for rules the idea must fit

If nothing related exists, say what you searched for.

## 3. Answer four questions

1. **Problem.** What can't someone do today, or do badly? Check it against the code: if the repo already does it, say so and cite where.
2. **Who it's for.** One primary user or system. A role ("an admin exporting reports"), not a market segment.
3. **Smallest useful version.** One slice that someone could use and that a demonstration could show working. List what you cut to get there.
4. **Non-goals.** At least one. Everything cut in answer 3 goes here.

Draft all four yourself, with a reason for each, before asking anything.

## 4. Confirm

- **Grilling mode** (a person is present): the four answers are the first decisions in the design tree. Ask them as round 1 of [grilling.md](grilling.md), each with your draft as the recommended answer, and record the confirmed answers here.
- **Batch mode:** show the four answers in one message and ask for corrections. Ask at most three questions, each with your recommended answer. They count toward the spec's limit of three open questions.
- **Unattended:** keep your draft. Each answer becomes an `Assumptions` line in the spec and a `default` line in `decisions.md`.

Not decided here: market, pricing, competitors, priority against other work, and whether the idea is worth building. If the idea depends on one of these, record it as a direction question for the user. It stays open even when unattended.

## 5. Too thin

If after grounding you can't name the problem and the user in one sentence each, stop shaping. In `state.md`, say the input is too thin and ask the user for three things: who it's for, what they can't do today, and what would show it's done. Set `Next` to that request and stop the stage.

## `shaping.md`

```markdown
# Shaping: <idea in one sentence>

- **Problem:** <sentence>. Evidence: <path:line or "searched X, Y; nothing found">
- **For:** <user or system>
- **Smallest useful version:** <sentence>
- **Cut:** <items deferred>
- **Non-goals:** <items>
- **Confirmed by:** <user on YYYY-MM-DD, grilling round <n> | user on YYYY-MM-DD | default, unattended>
```
