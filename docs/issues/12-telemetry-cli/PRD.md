# PRD: Issue #12 Executable Run Telemetry

## Decision Need

- decision: Add minimal CLI tooling so run telemetry can be emitted, validated, and summarized.
- owner: Autopraxis maintainer.
- linked issue: https://github.com/Zhachory1/autopraxis/issues/12
- base branch: `feat/issue-10-workflow-modes`

## Problem

`run-telemetry` defines useful JSONL events, but Autopraxis has no executable support for creating, checking, or summarizing them. Evals and backprop need trustworthy local telemetry data.

## Goals

- Add `autopraxis telemetry emit`.
- Add `autopraxis telemetry validate`.
- Add `autopraxis telemetry summarize`.
- Add schema docs under `skills/run-telemetry/references/` and fixtures.
- Reject/warn on sensitive raw-content fields.
- Keep commands local and dependency-free.

## Non-Goals

- Build remote telemetry service.
- Auto-capture model tokens from runtimes.
- Implement full eval harness.
- Persist private artifacts or raw prompts.

## Primary Metric

- valid JSONL telemetry can be emitted, validated, and summarized from CLI.

## Acceptance Criteria

- valid JSONL fixture passes.
- malformed JSONL fixture fails with actionable errors.
- summary reports deterministic aggregates: event count, workflow/event/status counts, latency total, cost/tokens totals with observed/missing coverage, max loop iteration, and escalation count.
- secret/raw-content fixture is rejected.
- `run-telemetry` references CLI commands and schema.
- telemetry events include `schema_version: 1`; no multi-version migration framework.
