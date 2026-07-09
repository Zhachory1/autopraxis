# Autopraxis

<p align="center">
  <img src="assets/autopraxis.png" alt="Autopraxis" width="100%">
</p>

Self-improving workflow skills for AI agents.

Autopraxis turns messy goals into grounded briefs, reviewed plans, shipped work, and measured learning loops. Built for chaotic quests where planning, review, and adaptation matter as much as raw execution.

Each skill is a portable `SKILL.md` with YAML frontmatter, explicit input/output contracts, bounded loops, and telemetry hooks.

## Start here

Pick one top-level workflow first. Shared skills are connective primitives; top-level workflows call them when needed.

Workflow modes control how much process the agent should load. If the user names a mode, start there. Otherwise use the router depth. If no route fits, start `default`. Escalate `lite → default → deep` only when risk or ambiguity appears, and record why.

- `lite` — shortest useful path; avoid optional councils/templates unless risk appears.
- `default` — normal workflow gate for planned work; load only references needed for selected artifacts.
- `deep` — high-risk, ambiguous, cross-functional, irreversible, or leadership-visible work; full gates allowed with explicit reason.

Role quick paths:

- developer: `dev-workflow`, `pr-review`, or `debug-investigation`.
- PM/product: `project-ideation` or `roadmapping`.
- leadership: `roadmapping` for decision briefs and tradeoff packages.
- maintainer: `backprop` for workflow improvement; `roadmapping` for repo sequencing.

| If you have... | Role | Start with | Depth | Why |
|---|---|---|---|---|
| accepted feature/bug spec to implement | developer | `dev-workflow` | default | turns intent into plan, code, review, and PR package |
| small safe code change with clear acceptance | developer | `dev-workflow` | lite | avoids full ceremony unless scope/risk expands |
| PR or diff needing review | developer | `pr-review` | lite | reviews intent, architecture, correctness, tests, and feedback |
| failing test, non-prod bug, or unknown narrow symptom | developer | `debug-investigation` | default | defines symptom, gathers evidence, traces code, confirms root cause |
| production incident or high-risk fix | developer/lead | `debug-investigation` | deep | needs blast-radius evidence, RCA, prevention, and possible escalation |
| high-risk architecture or launch change | developer/lead | `dev-workflow` | deep | needs docs, gates, review, and likely council escalation |
| ML metric/model framing or experiment idea | ML/product | `ml-experiments` | default | locks metrics, data path, hypotheses, validation, and handoff |
| production/costly/disputed ML decision | ML/product | `ml-experiments` | deep | needs statistical rigor, guardrails, council escalation, and deploy handoff |
| fuzzy OKR or early product idea | PM/product | `project-ideation` | lite | frames problem and drivers before heavier discovery |
| evidence-backed product opportunity | PM/product | `project-ideation` | default | decomposes goals, finds gaps, frames candidate projects |
| set of candidate projects to sequence | PM/leadership | `roadmapping` | default | scores ROI, maps dependencies/capacity, prepares approval |
| executive decision brief or roadmap tradeoff | leadership | `roadmapping` | lite | produces concise recommendation and approval ask |
| recurring workflow failures or run logs | maintainer | `backprop` | default | analyzes telemetry/history and proposes measured improvements |
| new workflow idea for Autopraxis | maintainer | `roadmapping` | lite | sequences/triages before creating new skill surface |
| unclear request with no artifact yet | any | `project-ideation` | lite | frames problem before committing to execution |

## Skills

High-level workflows:

- `dev-workflow` — PRD → DD → council → plan → ship → review → final council → launch PR.
  - Use when: building or changing software from accepted intent.
  - Do not use when: you only need to review an existing PR or investigate an unexplained symptom.
- `ml-experiments` — problem/metric framing → data/EDA → tracking → hypothesis/train/validate loop → handoff.
  - Use when: model, feature, data, or experiment quality must be judged against locked metrics.
  - Do not use when: the task is ordinary application code or a product idea without ML/data experimentation.
- `pr-review` — context → architecture → line-level review → optional local test → feedback → human signoff.
  - Use when: a PR/diff exists and needs correctness, safety, maintainability, or test review.
  - Do not use when: no implementation exists yet; use `dev-workflow` or `project-ideation` instead.
- `debug-investigation` — symptom → evidence → repro → trace → hypothesis loop → RCA/handoff.
  - Use when: behavior is wrong and root cause is unknown.
  - Do not use when: the fix is already specified and only implementation remains.
- `project-ideation` — OKR deconstruction → gap analysis → cross-functional jam → framing → feasibility.
  - Use when: the opportunity/problem is fuzzy and needs framing before roadmap or build work.
  - Do not use when: candidates are already framed and need sequencing; use `roadmapping`.
- `roadmapping` — ROI scoring → dependency/capacity iteration → horizon themes → council → approval.
  - Use when: choosing, sequencing, or packaging project tradeoffs for PM/leadership decisions.
  - Do not use when: executing one approved project; use `dev-workflow`.
- `backprop` — ingest run history/telemetry → diagnose workflow failures → propose improvements → council → shadow-A/B → promote/rollback.
  - Use when: improving Autopraxis or another workflow from prior run evidence.
  - Do not use when: there is no run history, telemetry, or concrete failure pattern yet.

Reusable connective tissue:

These shared skills are connective primitives. Do not start here unless you explicitly need that artifact; top-level workflows call them as needed.

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

Autopraxis can be installed as a Claude/Codex-style skills plugin bundle.

```bash
node bin/autopraxis.mjs install --target claude-plugin
node bin/autopraxis.mjs install --target codex-plugin
```

Native plugin manifests:

- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `.cave-plugin/plugin.json`

Supported targets:

- `claude-plugin`
- `codex-plugin`
- `mewrite-plugin`
- `mewrite-skills`
- `claude-skills`
- `codex-skills`
- `generic-markdown`
- `cursor-rules`
- `windsurf-rules`

See `INSTALL.md` for custom destinations, marketplace wiring, symlink mode, manual fallback, upgrade, uninstall, and package validation.

## Validate

```bash
npm test
```

Validation checks frontmatter, description length, self-improvement sections, no ordered-list skill prose, workflow integration keywords, telemetry CLI behavior, eval fixture coverage, and key backprop data-source awareness.

Eval fixtures are deterministic and model-free:

```bash
node bin/autopraxis.mjs eval validate --fixtures evals/workflows --baseline evals/baselines/v0.1.0.json
node bin/autopraxis.mjs eval summarize --fixtures evals/workflows
```

## Release cycle

See `RELEASE.md` for release policy and checklist. Release notes live under `releases/`; notable changes live in `CHANGELOG.md`.

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
