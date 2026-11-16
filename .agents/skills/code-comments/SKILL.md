---
name: code-comments
description: Use when writing, changing or reviewing a code comment, docblock or Javadoc, above all during planned, parallel or ticket-driven work. Holds what the always-on core rule leaves out, namely every banned form (plan phases, streams, revisions, handoffs, review finding ids, ticket ids, plan and design document references, design-screen labels), the exception for test labels, a before and after example, and the tokens a reviewer greps for.
---

# Code comments: banned forms and example

The rule itself is always loaded, in `.agents/rules/core.md` under "Code comments". This skill holds the full list of banned forms, an example and the review tokens.

## The rule

A code comment or docblock explains the reason in domain terms: what the code protects, and why it has this shape. It never mentions how the work was organised. Those words mean nothing to a later reader, and they are out of date as soon as the work is merged.

Before you write a comment, ask: "Will this still be true and useful after the feature is merged?" If not, leave it out. Process notes go in the plan or the handoff, not in code.

## Banned forms

- Process words: plan phases (`Phase 0`, `base phase`), streams (`Stream A`), revisions (`Revision 3`), orchestration, orchestrators, handoffs, review finding ids (`M1`, `m2`).
- Plan and design references: `§4.2`, "section 4.2", "plan section 4.5", "plan 4.5", a document path plus a section, "design p.3".
- The plan or the design as the reason: "the plan says", "the plan requires", "as the plan listed", "Design rule: ...", "the design requires". State the reason itself.
- Design-screen wording: level labels such as "Level-1", "Level 2" or "L1", "design term", "in the design", "the design shows". Name the thing by its domain name: "custom filter group", not "Level-1 filter".
- Ticket ids in any form: a plain id (`ABC-179`), an id in brackets (`(ABC-179)`), or an id next to a phase, stream or revision. The branch name, the commit message and the pull request already carry the ticket id.

## Scope

The rule applies to new and changed comments. Older comments that already hold one of these forms are not rewritten only because you touch the file. Do not copy them as a precedent.

## Test labels

Short labels taken from a plan are allowed in test display names, for example `A8.1`, `R8` or `V1.8`, because they match a test to a requirement. The test still does not point to the plan: no section numbers, no plan path, no "the plan says".

## Example

Before:

```java
/**
 * Controller log messages for Level-1 custom filter groups (ABC-179).
 *
 * Phase 0 of ABC-179 creates this file empty on purpose, so the parallel streams
 * that add the controller do not both create it.
 * Stream A (CategoryFilterAdminController / services) fills it.
 * Kept final with a private constructor to prevent instantiation or extension.
 */
```

After:

```java
/**
 * Controller log messages for custom filter groups.
 *
 * Kept final with a private constructor to prevent instantiation or extension.
 */
```

The "before" text describes the build process, not the code. Once the file is filled the text is wrong, and if the file is never filled the text hides the gap from a reader. That happened: a setup phase created an empty constant file with this comment, nobody filled it, and review did not catch it.

## Review tokens

A reviewer greps new and changed files for these. Each hit is a finding.

- Process words: `Phase`, `Stream A` / `Stream B` / `Stream C`, `Revision`, `orchestrator`, `handoff`, finding ids like `M1` / `m2`.
- Plan references: `§`, `section N.N`, `plan section`, the repo's plans directory, `design p.`, `the plan`.
- Ticket ids: any board prefix followed by a number, such as `ABC-179`.
- Design wording: `Level-1` / `Level-2` / `Level-3`, `Level 1`, `L1`, `design term`, `in the design`, `the design shows`, `Design rule`.
