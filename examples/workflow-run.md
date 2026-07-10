# Example Workflow Run

```text
Use dev-workflow for issue ISSUE-123 in repo ~/code/app.
Budget: doc loop max 2, implementation loop max 3.
Set AGENT_FLEET_HOME=<path-to-agent-fleet> before required minimal/full councils.
Use long-term memory MCP for prior decisions and code RAG for impacted paths.
Telemetry: .workflow-runs/ISSUE-123-dev/telemetry.jsonl.
```

Expected skill chain:

- `grounding-brief`
- `structured-doc-authoring` for PRD
- `success-criteria-metrics`
- `structured-doc-authoring` for DD
- select `council_level` from risk
  - low-risk example: record `council_level: none` and continue
  - high-risk example: invoke agent-fleet `/council` after preflight
- `task-decomposition-planning`
- agent-fleet `ship`
- `pr-review`
- select final `council_level`
  - ordinary clean review: record `council_level: none`
  - unresolved blocker/conflict/design mismatch: invoke agent-fleet `/council` after preflight
- `handoff-packaging`
- `human-approval-gate`
- `run-telemetry` throughout
