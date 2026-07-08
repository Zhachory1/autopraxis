# Backprop Data Sources

Preferred inputs:

- `.workflow-runs/*/telemetry.jsonl`
- `.workflow-runs/*/handoff.md`
- `$HOME/.agent-fleet/journal.jsonl`
- `$HOME/.agent-fleet/agent-chat/rooms/*/log.jsonl`
- long-term memory MCP / gbrain query results for decisions, incidents, retros, and run notes
- code RAG / repo-index / coderag results for skill definitions and affected code paths
- git commit history and diffs
- GitHub PR review comments, CI status, merge/revert outcomes
- experiment tracker runs, validation logs, benchmark artifacts

Backprop should store pointers and summarized metrics by default. Persist raw sensitive content only with explicit operator approval.
