# Implementation Plan: Issue #11 Council Escalation And Minimization

## Accepted Scope

- Add shared council escalation matrix reference.
- Update `council-review` to select and report a council level.
- Add short `Council Policy` pointers to workflows that invoke council.
- Add validation coverage.

## Non-Goals

- no new runtime behavior in agent-fleet.
- no eval harness.
- no token counting.
- no broad workflow rewrite.

## Tasks

### Task 1: Matrix reference

**Files**

- `skills/council-review/references/escalation-matrix.md`

**Acceptance**

- Defines `none`, `single-lens`, `minimal-council`, `full-council`.
- Includes behavior, cost caps, triggers, examples, telemetry/output fields, and anti-patterns.

### Task 2: Council-review skill update

**Files**

- `skills/council-review/SKILL.md`

**Acceptance**

- Execution chooses level before personas.
- Output includes council level and reason.
- Telemetry includes `metrics.council_level`, `metrics.council_reason`, `metrics.persona_count`, and `metrics.agent_fleet_invoked`.
- Matrix file is listed under companion references.

### Task 3: Workflow pointers

**Files**

- `skills/dev-workflow/SKILL.md`
- `skills/ml-experiments/SKILL.md`
- `skills/pr-review/SKILL.md`
- `skills/project-ideation/SKILL.md`
- `skills/roadmapping/SKILL.md`
- `skills/backprop/SKILL.md`
- `skills/debug-investigation/SKILL.md`

**Acceptance**

- Each has `Council Policy` section.
- Dev workflow final council is conditional on risk/conflict/blocker/design mismatch.
- ML full council remains likely for metric/statistical gates but still records level.

### Task 4: Validation

**Files**

- `tests/validate-skills.mjs`

**Acceptance**

- Matrix file exists and contains required level names, behavior, cost caps, triggers, and telemetry fields.
- Council-review references matrix.
- Every workflow skill that mentions `council-review` contains `Council Policy` and `escalation-matrix`.

## Validation

```bash
npm test
npm pack --dry-run
```
