# Implementation Plan: Issue #6 Token Efficiency

## Accepted Scope

- Add token efficiency reference doc.
- Link it from README validation/release area if useful.
- Avoid runtime token counter, telemetry schema changes, and cost calculator.

## Tasks

### Task 1: Reference doc

**File**

- `docs/reference/token-efficiency.md`

**Acceptance**

- defines token usage as first-class target.
- covers modes, progressive disclosure, existing telemetry fields, quality guardrails, and up to 3 deferred low-risk changes.

### Task 2: README link

**File**

- `README.md`

**Acceptance**

- adds exactly one short pointer to token efficiency note.

### Task 3: Validation

**Validation**

```bash
npm test
```
