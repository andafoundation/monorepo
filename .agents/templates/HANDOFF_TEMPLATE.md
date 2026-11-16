# Handoff template

Rules for the agent that keeps the file:

- Create the file before your first edit, and fill "Scope given" from your brief.
- After every finished sub-step, rewrite the sections so that they state the current truth. Do not append a log.
- Write for an agent that has not seen your conversation and must continue from this file alone: exact paths, commands and names.
- Keep every heading. Write "None" under a section with nothing in it.
- Status is `PARTIAL` from the first line you write until everything in scope is done and verified. Then it is `DONE`. It is `BLOCKED` when you cannot continue; the reason goes under "Open questions and items".

Copy everything below the line.

---

# Handoff: {feature} / {layer} / {subtask}

**Status:** PARTIAL

## Scope given

Role, project and scope. Directory and branch. The task. Files or modules you may touch. Files you were told to read first.

## Done so far

One line per file created or changed: the path, then what changed. Record exact names where the next step is written from this file:

- backend: every endpoint added or changed (method, path, request and response shape, access rule), or the path of the regenerated contract files;
- schema: every table, column, constraint, index and enum value, with its type;
- planning: the spec path and the recommended implementation order;
- review: the areas covered and which code meets which requirement;
- tests: the test files and what each covers.

## Verification

Each command you ran, the directory you ran it in, and its result. Say which sub-steps the result covers, and what you could verify only by inspection.

## Next step

What remains, with the exact next action first: file, symbol, what to change. "None" when the status is DONE.

## Open questions and items

Everything that someone else must act on:

- questions, each with what you assumed in the meantime, and the answer once you have it;
- changes needed outside your scope, and defects you found but may not fix;
- for a review, every finding in full: severity (critical, major or minor), confidence, `path:line`, what is wrong and why it counts, and the change to make.

## Decisions

Each choice that was not obvious, and why you made it.

## Placeholders

Each file, class or method you created empty for someone else to fill: the path and the role or unit that fills it. Remove an entry once it is filled.
