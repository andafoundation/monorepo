# Spec template

Write the spec into the plans location the registry names, with the file naming it gives. Keep the sections and their numbers; write "Not applicable" under one the feature does not need. Take every stack detail (framework, annotations, directory layout, test tools) from the registry and the convention skills, not from this template.

Size: for a change in one scope the whole spec stays under 200 lines. Write contracts, signatures and rules. A code block shows only a signature, an interface, a request or response shape or a table's columns, at most about 10 lines. No method bodies, no full classes, no full test code and no full migration SQL: list columns, types and constraints instead. The implementing roles write the code; what the spec spells out in full, they copy.

## 1. Summary

Feature name and identifier. The user roles it affects. The value it brings and how success is measured. What is in scope and what is not.

## 2. User stories and acceptance criteria

```text
As a [role], I want to [action], so that [benefit].

Acceptance criteria:
- [ ] An outcome that can be checked
- [ ] An error case
- [ ] An access rule
```

Cover the main path, the alternative paths, the error cases and the edge cases.

## 3. Code references

Every existing item this spec relies on, and every item it adds.

| Item | Kind | Where |
|---|---|---|
| Endpoint (method and path), class, method or file | existing | `path:line` where you found it |
| File, class or directory the spec adds | new | Path of the existing file it is modelled on |

- Find each existing item by searching or reading the code. Never write one from memory or from a naming pattern.
- The model for a new item is a file you opened. Before you add a class, name the existing class you considered as its home and say why it does not fit.
- If you find no model for a new item, say so in section 10 and ask the user. Do not invent a location.

## 4. Technical design

### 4.1 Domain

The module the feature belongs to. Related modules and how they interact. Shared services it uses.

### 4.2 Data model

Per entity: fields with types, validation, relationships, enums with their values, indexes and database constraints.

### 4.3 Migrations

Each schema change, in order, following the repo's migration convention: the table, its columns with types and constraints, and indexes. Not the SQL.

### 4.4 API contract

Per endpoint: method and path, who may call it, request and response fields with types, validation rules, error responses, and paging or filter parameters for lists. In a repo that generates its contract or clients, specify the source types and a regeneration step instead of client-side types.

### 4.5 Service layer

Service methods with signatures and no bodies, the business rules, transaction boundaries and how errors are handled.

### 4.6 Client

Per client (web, mobile): routes or screens, component hierarchy, forms with their fields and validation, lists with their columns, data fetching and cache invalidation, user-facing text. List the real sibling directories of the target app before you place files; the layout differs per app.

## 5. Access control

Per operation: which roles may do it, how the backend enforces it, how each client hides or blocks it, and how data is separated between tenants or owners.

## 6. Integration points

Internal features the change touches, external services it calls, and dependencies between modules.

## 7. Implementation units

The work as units, in the order they run. One unit is one role, one scope and at most about eight files.

| # | Role | Scope | Unit | Files or modules | Needs unit |
|---|---|---|---|---|---|

Order: schema, backend, client, tests, CI/CD. Units that need nothing from each other can run in parallel.

## 8. Testing

Automated tests per scope: what is covered at unit level and at integration level, as a list of cases, not as test code. Manual test cases per user story, for each role.

## 9. Non-functional requirements

Performance, security, accessibility, supported browsers and devices, where they matter for this feature.

## 10. Open questions and risks

Unresolved questions, technical risks, external dependencies, and assumptions to confirm: per assumption the point, the option taken, and what the alternative would change.

## Revisions

When the approved spec changes materially, add a dated note here: what changed and why. Keep the superseded text in the document.
