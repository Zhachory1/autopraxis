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
- `council-review`
- `task-decomposition-planning`
- agent-fleet `ship`
- `pr-review`
- `council-review`
- `handoff-packaging`
- `human-approval-gate`
- `run-telemetry` throughout
