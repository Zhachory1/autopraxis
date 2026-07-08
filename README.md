# Autopraxis

Self-improving workflow skills for AI agents.

Autopraxis turns messy goals into grounded briefs, reviewed plans, shipped work, and measured learning loops. Built for chaotic quests where planning, review, and adaptation matter as much as raw execution.

Each skill is a portable `SKILL.md` with YAML frontmatter, explicit input/output contracts, bounded loops, and telemetry hooks.

## Skills

High-level workflows:

- `dev-workflow` — PRD → DD → council → plan → ship → review → final council → launch PR.
- `ml-experiments` — problem/metric framing → data/EDA → tracking → hypothesis/train/validate loop → handoff.
- `pr-review` — context → architecture → line-level review → optional local test → feedback → human signoff.
- `debug-investigation` — symptom → evidence → repro → trace → hypothesis loop → RCA/handoff.
- `project-ideation` — OKR deconstruction → gap analysis → cross-functional jam → framing → feasibility.
- `roadmapping` — ROI scoring → dependency/capacity iteration → horizon themes → council → approval.
- `backprop` — ingest run history/telemetry → diagnose workflow failures → propose improvements → council → shadow/A-B → promote/rollback.

Reusable connective tissue:

- `grounding-brief`
- `council-review`
- `success-criteria-metrics`
- `task-decomposition-planning`
- `hypothesis-testing`
- `structured-doc-authoring`
- `handoff-packaging`
- `human-approval-gate`
- `run-telemetry`

## Tool awareness

Skills assume agents may have:

- native coding harness tools: read, bash, edit/write, task/subagent, git, gh.
- long-term memory MCP: `gbrain` or equivalent memory query/ingest tools over private docs, decisions, incidents, run notes.
- code RAG MCP: `coderag`, repo-index, semantic code search, dependency graph, or local fallback via repo exploration.
- `agent-fleet`: `AGENT_FLEET_HOME=/Users/zhach/code/agent-fleet` with `/council`, `/ship`, personas, transcripts, and journal files.
- telemetry store: `.workflow-runs/<run-id>/` in target repo or a caller-provided durable run directory.

Agents should prefer available MCP/RAG tools for recall and codebase context, but must fall back to local files, git, logs, and user-provided artifacts when tools are unavailable.

## Install locally

Autopraxis can be installed as a portable coding-agent plugin bundle.

```bash
node bin/autopraxis.mjs install --target mewrite
```

Supported targets:

- `mewrite`
- `claude-code`
- `generic-markdown`
- `cursor-rules`
- `windsurf-rules`

See `INSTALL.md` for custom destinations, symlink mode, manual fallback, upgrade, uninstall, and package validation.

## Validate

```bash
npm test
```

Validation checks frontmatter, description length, self-improvement sections, no ordered-list skill prose, workflow integration keywords, and key backprop data-source awareness.

## Run artifacts

Recommended per-run layout:

```text
.workflow-runs/<run-id>/
  brief.md
  telemetry.jsonl
  state.json
  tried-rejected.md
  council/
  handoff.md
```

`run-telemetry` defines event schema. `backprop` consumes these artifacts plus agent-fleet journals/transcripts, long-term memory MCP notes, code RAG/repo-index metadata, PR/CI data, and human edit outcomes.
