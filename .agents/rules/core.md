# Core rules

These rules apply in every repository, to the main session and to every subagent. Facts about one repository (its projects and tech stacks, where docs and plans live, the lessons file, how secrets are supplied) are in that repo's `.agents/rules/00-project-registry.md`, called "the registry" below.

## Responses

- Give the result first. No preamble, no restating the request, no summary of what you just did, no filler ("Great question", "Let me..."), no emoji. Do not recap a diff the user can read.
- Write short, complete, grammatical sentences. Never drop articles or write fragments. Aim for the shortest text a colleague could act on without a follow-up question; a cut that costs the reader that question is not a saving.
- Prefer a sentence over a bullet and a bullet over a table. Use a table only to compare three or more items across the same fields.
- Reproduce code, error messages, file paths, commands, identifiers and log lines verbatim. Never paraphrase, truncate or abbreviate them.
- Write full prose, without the length limits above, for: commit messages and pull request descriptions; documentation, specs and other prose written into the repo; security findings and their impact; the confirmation before a destructive or irreversible action; assumptions, anything left unverified and known limitations; any answer where the user asked for detail, an explanation or reasoning.
- Never write an em dash (—) in any output: responses, code comments, commits, pull requests, docs, UI copy. Use a period, comma, colon or parentheses. Keep the tone concise and human.
- All of this also applies to subagent reports and handoff files.

## Act or plan

Size the task first. Every task is one of two kinds.

- **Act** on a bug report, a failing test, a failing CI job, or any other change of one or two steps. Do it without asking the user for guidance: find the logs, errors and failing tests yourself, then resolve them.
- **Plan first** for any other task of three or more steps, and for any task, bug fixes included, that needs an architectural decision. This holds even when the task touches only one domain. Present the plan (in plan mode where the tool has one) and wait for approval before editing. When unsure which kind a task is, plan: planning is cheap and rework is expensive.
- A task that arrives with an approved plan or a handoff is already planned. Follow it.
- If the implementation goes sideways, stop and re-plan.
- Settle ambiguous requirements in the plan or spec, before building.

## Plan format

A plan given in a response is a work order, not a document. It MUST use this structure and nothing else:

1. **Goal**: one sentence saying what will be true when this is done.
2. **Steps**: numbered, one line each: the action, the exact file path, and what changes. Add a second line only when a choice needs justifying. A step that needs more than three lines is two steps.
3. **Verification**: the exact commands that prove it worked, and what passing looks like.
4. **Risks**: only real ones, one line each. Omit the section when there are none.

Name exact file paths and symbols, never "the relevant service". Leave out: a background section, requirements the user already gave, "Phase 1 / Phase 2" scaffolding for single-pass work, effort or time estimates unless asked, and alternatives considered unless the choice is genuinely contested (then two lines). A plan touching many files may run long, but every line must be actionable.

A formal spec written into the repo follows `.agents/templates/spec-template.md` instead, in the plans location the registry names.

## Done means proven

- Never report a task as complete without proving that it works: run the tests, check the logs, demonstrate the result.
- Compilation and lint must pass before you hand work over.
- Where relevant, compare behavior between the main branch and your change.
- Challenge your own work before presenting it. The test: would a staff engineer approve this?
- When asked to commit, push or move finished work, do not run the checks again unless the user asks.
- Machine-wide services (Docker, a database, a VPN) are the user's: never start, stop or reconfigure one; report `BLOCKED` with the exact command. A process you start to verify your own change and stop again (a dev server, a test run) is fine.

## Code changes

- Make every change as simple as possible, and touch only what the task needs.
- Find the root cause. No temporary fixes.
- For a non-trivial change, ask whether there is a more elegant way. If a fix feels hacky, replace it with the solution you would choose knowing everything you know now. Skip this for simple, obvious fixes.

## Error handling: no silent failures

This applies to every language and every layer. Skills and code comments call it "rule 10".

- Every error path does at least one of: re-throw to the caller; log the error and surface it to the user (toast, banner, error state); route it to the error tracker.
- Empty catch blocks are prohibited. So are inert ones: the error is caught but never read, or only logged with no re-throw, no user-visible state and no tracker.
- A catch that is a no-op by design carries an annotation with a real reason, which code review checks. In TypeScript and JavaScript write `// eslint-disable-next-line no-empty -- reason: X`. In a language ESLint does not lint (Java, Kotlin, Swift) write `// rule-10-no-op -- reason: X`. The `reason:` part is never optional.
- For examples, the lint setup or the review checklist, load the `no-silent-failures` skill.

## Proposals, plans and specs: only real patterns

Code in a proposal, plan or spec MUST follow the patterns that exist in the codebase, so that the document can be used as an implementation guide.

- Before writing an example, search the codebase for similar implementations and read them. Check each layer the example touches: security and auth, controllers, services, entities, DTOs, repositories, or their equivalents in the stack.
- Match what you find exactly: annotations, naming, base classes, method signatures, structure. Do not invent an annotation or a pattern that the codebase does not have.
- Check that the example would compile against the existing dependencies.
- Use the language the codebase uses. Do not mix languages unless the codebase already does.

## Code comments

- A comment or docblock explains the reason in domain terms: what the code protects and why it has this shape.
- New and changed comments never mention how the work was organised: plan phases, streams, revisions, orchestration or handoffs, review finding ids, ticket ids, references to a plan or design document ("§4.2", "the plan says"), or design-screen labels. State the reason itself; the ticket id already lives in the branch, the commit and the pull request.
- Short requirement labels are allowed in test display names.
- The banned forms, an example and the review tokens are in the `code-comments` skill.

## Commits and pull requests

- Make every change on the task's own branch in a linked worktree (`git fetch origin`, then `git worktree add .claude/worktrees/<task> --no-track -b <branch> origin/<default branch>`), never on the default branch in the main checkout. Uncommitted work found there is moved to such a worktree, not committed.
- A commit message and a pull request description never credit an AI tool. No `Co-Authored-By` trailer that names one, no `Claude-Session` or other session link, no "Generated with" line. This overrides the default of any tool that adds such a line.

## Secrets

- Never commit a secret. The only env file that belongs in version control is `.env.example`, and it holds key names and placeholders, never real values.
- A tracked env file with real values is an incident: remove it from version control and report that its secrets must be rotated.
- How local values are supplied (a secret provider and its CLI, or local files) is in the registry. Follow it, and create no env file it does not call for.

## Lessons

After any correction from the user, record the lesson in the repo's lessons file (the registry names it), written as a rule that prevents the same mistake. Review the lessons at the start of a complex task. Delete a lesson once it is obsolete or superseded by a convention.
