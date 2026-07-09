# Implementation Plan: Issue #10 Workflow Modes

## Accepted Scope

- Add `## Workflow Modes` to top-level workflows.
- Add structured mode telemetry fields to `run-telemetry`.
- Update README mode selection wording.
- Add validation for mode sections and fields.

## Non-Goals

- no CLI mode flags.
- no exact token counting.
- no repeated per-workflow mode tables.
- no eval harness.
- no compact skill-card rewrite.

## Tasks

### Task 1: Add workflow modes

**Files**

- `skills/dev-workflow/SKILL.md`
- `skills/ml-experiments/SKILL.md`
- `skills/pr-review/SKILL.md`
- `skills/debug-investigation/SKILL.md`
- `skills/project-ideation/SKILL.md`
- `skills/roadmapping/SKILL.md`
- `skills/backprop/SKILL.md`

**Acceptance**

- each file has compact `## Workflow Modes`.
- each file defines `lite`, `default`, `deep`.
- each file includes `Escalate:` triggers and `Load:` progressive-disclosure guidance.

### Task 2: Telemetry mode fields

**Files**

- `skills/run-telemetry/SKILL.md`

**Acceptance**

- documents `workflow_mode`, structured `mode_budget`, `mode_escalation_reason`.

### Task 3: Validation

**Files**

- `tests/validate-skills.mjs`

**Acceptance**

- tests all top-level workflows for mode sections.
- tests `Escalate:` and `Load:` lines.
- tests run telemetry fields.
- tests README no longer calls modes future work.

## Validation

```bash
npm test
npm pack --dry-run
```
