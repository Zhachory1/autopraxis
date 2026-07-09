# Example Workflow Run

```text
Use dev-workflow for issue ISSUE-123 in repo ~/code/app.
Budget: doc loop max 2, implementation loop max 3.
Use AGENT_FLEET_HOME=/Users/zhach/code/agent-fleet.
Use long-term memory MCP for prior decisions and code RAG for impacted paths.
Telemetry: .workflow-runs/ISSUE-123-dev/telemetry.jsonl.
```

Expected skill chain:

- `grounding-brief`
- `structured-doc-authoring` for PRD
- `success-criteria-metrics`
- `structured-doc-authoring` for DD
- select `council_level` using `council-review/references/escalation-matrix.md`
  - low-risk example: record `council_level: none` and continue
  - high-risk example: invoke `council-review`
- `task-decomposition-planning`
- agent-fleet `ship`
- `pr-review`
- select final `council_level`
  - ordinary clean review: record `council_level: none`
  - unresolved blocker/conflict/design mismatch: invoke `council-review`
- `handoff-packaging`
- `human-approval-gate`
- `run-telemetry` throughout
