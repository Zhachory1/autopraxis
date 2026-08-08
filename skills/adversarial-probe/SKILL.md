---
name: adversarial-probe
description: "Exploratory adversarial testing workflow for agents. Use for stress testing, load/soak/spike test, chaos engineering, fault injection, fuzzing, boundary/malformed input, resource exhaustion, concurrency/race probing, red-teaming, jailbreak, prompt injection, tool-abuse, spec-gaming, eval robustness, agent safety-boundary probing, find where it breaks, attack surface mapping. Targets software services, software tools, and AI-agent workflows. Enforces locked breakage thresholds before attack, threat model, bounded attack loop, mandatory approval before destructive/live probes, confirmed-breakage handoff to debug-investigation, telemetry, long-term memory, and code RAG."
---

# Adversarial Probe

Attack a system to generate failure signals before any symptom exists. Map the attack surface, lock what "broken" means, then probe with load, chaos, fuzzing, boundary abuse, or adversarial inputs until breakages surface or the budget is exhausted. Hand confirmed breakages to `debug-investigation`; never turn probing into open-ended root-cause work.

## Core Principles

**Attack surface before attacks.** Enumerate entry points, trust boundaries, resource limits, and agent tool/permission surfaces first. Unmapped surface is untested surface.

**Define "broken" before probing.** Lock breakage thresholds and SLOs up front so a failure is recognizable and not rationalized away after the fact.

**Attacks are hypotheses.** "It breaks if X" is a testable claim with a payload and an expected failure. Keep a tried/broke/held ledger.

**Isolation over blast radius.** Prefer staging, sandboxes, and synthetic payloads. Live or destructive probing requires explicit human approval and blast-radius signoff.

**Probe generates, debug diagnoses.** This workflow produces confirmed failure signals. Root cause belongs to `debug-investigation`.

## Inputs

- target: service, tool, or AI-agent workflow, plus environment (sandbox/staging/prod).
- attack surface hints: endpoints, inputs, resource limits, tools, permissions, prompts.
- SLOs, invariants, or safety boundaries that must hold.
- allowed attack modes and hard constraints (no prod writes, rate caps, data handling).
- access to load tooling, chaos/fault injection, fuzzers, logs, traces, metrics.
- severity/risk of the target and escalation owner.
- run id for `run-telemetry`.

## Attack Surfaces

**Software services and tools.** Load, soak, spike, and stress; chaos and fault injection (latency, dependency loss, resource starvation); fuzzing and malformed/boundary input; resource exhaustion (memory, fds, connections, disk); concurrency and race conditions; error-path and retry-storm behavior.

**AI-agent workflows.** Adversarial and out-of-distribution prompts; jailbreak and prompt injection; tool-abuse and unsafe-action attempts; spec-gaming and reward-hacking; context poisoning; eval robustness and consistency; loop, cost, and token blowups; permission and boundary escapes.

## Tool Awareness

Use `grounding-brief` with long-term memory MCP for prior incidents, known weak spots, and past probe results, and code RAG for implicated paths, dependencies, and tool/permission wiring. Use `success-criteria-metrics` to lock breakage thresholds. Use `hypothesis-testing` for the attack loop. Use load/chaos/fuzz tooling, logs, traces, and metrics for evidence. Use agent-fleet `/council` for prod chaos, security probing, or agent safety-boundary tests. Use `human-approval-gate` before any destructive or live-system probe. Use `run-telemetry` throughout.

## Council Policy

Use agent-fleet council levels. Sandbox probing with synthetic payloads usually needs no council. Escalate to `single-lens`, `minimal-council`, or `full-council` for production or live-system attacks, security/red-team probing, agent safety-boundary tests, or ambiguous breakage severity. Required `minimal-council`/`full-council` must block if agent-fleet preflight fails.

## Safety Gates

**No destructive or live probe without approval.** Any attack against production, shared, or stateful live systems requires `human-approval-gate` with explicit blast-radius signoff before execution.

**Synthetic payloads by default.** Never use real customer data, credentials, or PII as attack input unless the user explicitly approves and the environment is authorized.

**Contained by construction.** Prefer isolated targets, rate caps, and rollback/stop conditions. State the stop signal before starting.

## Workflow Modes

- `lite`: single surface, sandbox target, bounded synthetic attack set; report breakages or clean result. Budget: no council, one attack loop, no live/destructive probes.
- `default`: multi-vector probe against a mapped surface with a threat model and breakage thresholds. Budget: focused refs, loop cap from risk, `council_level` max `single-lens`, live probes only with approval.
- `deep`: production, live, security red-team, or agent safety-boundary probing. Budget: full threat model, council allowed with reason, mandatory approval and blast-radius signoff, explicit stop conditions.
- Escalate: any live/destructive target, security or safety-boundary probing, ambiguous breakage severity, or evidence of production risk.
- Load: start with target and surface; load council protocol, threat-model template, chaos/fuzz playbooks, or prior probe history only when needed.

## Execution

**Map attack surface.** Use `grounding-brief` over entry points, trust boundaries, resource limits, tools, permissions, dependencies, and prior incidents. Build a threat model of what could break and why it matters.

**Lock breakage thresholds.** Use `success-criteria-metrics` to define SLOs, invariants, and safety boundaries that constitute "broken" before any attack runs.

**Plan attacks.** Select attack modes for the surface, order by risk and yield, and set hard constraints, rate caps, and stop conditions.

**Gate live or destructive probes.** Use `human-approval-gate` with blast-radius signoff before any attack on production, shared, or stateful live systems. Escalate to council per policy.

**Run attack loop.** Use `hypothesis-testing`: form "it breaks if X," craft payload, execute against isolated target when possible, capture logs/traces/metrics, and record broke/held in a ledger.

**Confirm and classify breakages.** For each breakage capture the trigger, observed failure, threshold violated, severity, and reproducibility. Distinguish confirmed breakage from noise or environment artifact.

**Hand off.** Use `handoff-packaging` to route confirmed breakages to `debug-investigation` for root cause, or to `plan-to-launch`/`ship` if a fix is already specified and safe. Do not diagnose root cause here.

**Escalate when needed.** Use agent-fleet `/council` for prod chaos, security, or safety-boundary findings; use `human-approval-gate` for unresolved production risk or newly discovered high-severity exposure.

## Loop Controls

**Attack hypothesis loop.** Iterate until target breakage thresholds are hit, the planned attack set is exhausted, budget cap is reached, or human escalation.

**No-breakage cap.** If no breakage surfaces after the planned attacks, stop and report the surface covered, attacks tried, and residual untested surface. A clean result is a valid result.

**Blast-radius stop.** Halt immediately if an attack risks exceeding approved blast radius or affecting real users/data; escalate.

**State carry-forward.** Maintain attack surface map, locked thresholds, attack plan, tried/broke/held ledger, and confirmed-breakage inventory.

## Output Contract

```markdown
# Adversarial Probe

## Target And Surface
- target:
- environment:
- surface mapped:
- untested surface:

## Threat Model
- vector:
  why it matters:

## Breakage Thresholds
- SLO/invariant/boundary:
- source:

## Attack Ledger
- attack:
  payload:
  result (broke/held):
  evidence:

## Confirmed Breakages
- trigger:
  observed failure:
  threshold violated:
  severity:
  reproducible:

## Approval And Safety
- live/destructive: yes/no
- approval:
- blast radius:
- stop condition:

## Handoff
- routed to:
- owner:
- telemetry path:
```

## Success Criteria

- attack surface is enumerated and untested surface is stated.
- breakage thresholds are locked before attacks run.
- any live or destructive probe cites explicit approval and blast-radius signoff.
- synthetic payloads used unless real data is explicitly authorized.
- confirmed breakages cite evidence and the threshold they violated.
- a clean (no-breakage) result reports coverage and residual surface.
- confirmed breakages are handed to `debug-investigation` rather than diagnosed here.
- `run-telemetry` events emitted.

## Common Failure Modes

**Root-cause creep.** Fix by handing confirmed breakages to `debug-investigation` instead of diagnosing.

**Post-hoc thresholds.** Fix by locking "broken" via `success-criteria-metrics` before attacking.

**Blast-radius surprise.** Fix by approval gate, isolation, rate caps, and a pre-stated stop condition.

**Real-data payloads.** Fix by synthetic payloads unless explicitly authorized.

**Green-washing a clean run.** Fix by reporting covered vs untested surface so "no breakage" is not read as "safe."

## Self-Improvement

Track high-yield attack vectors, recurring breakage classes, weak thresholds, and surfaces that repeatedly go untested. Feed into `backprop` to improve probe playbooks, threat-model templates, safety gates, and code RAG indexing of attack surfaces.
