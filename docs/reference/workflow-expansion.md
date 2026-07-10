# Workflow Expansion Research

Autopraxis should add workflows only when composition of existing workflows is not enough. Prefer recipes and router entries before new top-level skills.

## Evidence Basis

This is a planning-grade ranking, not measured demand. Inputs:

- current Autopraxis workflow coverage.
- roadmap council synthesis from maintainers/agents.
- open issues #4-#12.
- expected overlap with developer, PM, and leadership workflows.

Confidence is medium for release/oncall/security candidates because they recur across software teams and map cleanly to existing Autopraxis artifacts. Confidence is low for niche candidates until real usage data exists.

## Scoring Criteria

Score 1-5 for each criterion. The recommendation favors high overlap and measurability over raw idea count:

| Criterion | Meaning |
|---|---|
| Frequency | How often devs/PMs/leaders hit this task |
| Pain | Cost of doing it ad hoc |
| Risk | Blast radius if done poorly |
| Repeatability | Whether steps can be standardized |
| Measurability | Whether eval/telemetry can judge success |
| Overlap Fit | Reuses existing shared skills and workflows |
| Token Risk | Can be run in lite/default without heavy context |

## Ranked Candidates

| Rank | Candidate | Score | Confidence | Recommendation |
|---:|---|---:|---|---|
| 1 | Release readiness / post-launch monitoring | 33/35 | medium | build as recipe + eval fixture first |
| 2 | Incident response / oncall workflow | 31/35 | medium | build next only if distinct from debug |
| 3 | Security review / threat modeling | 30/35 | medium | build as deep-mode recipe |
| 4 | Data pipeline change workflow | 28/35 | medium-low | build after eval fixtures grow |
| 5 | Performance / capacity planning | 26/35 | medium-low | recipe, not skill yet |
| 6 | Experiment readout / A-B interpretation | 26/35 | medium-low | extend `ml-experiments` first |
| 7 | Customer feedback synthesis | 26/35 | low | project-ideation recipe |
| 8 | Vendor/build-vs-buy evaluation | 22/35 | low | roadmap/decision brief recipe |
| 9 | Research synthesis / literature review | 17/35 | low | defer |
| 10 | Hiring/interview loop support | 14/35 | low | reject for now |

Detailed scores are planning estimates; future eval telemetry should replace them.

## Top Candidates

### Release Readiness / Post-Launch Monitoring

**Goal:** Decide whether a change is ready to launch and what to watch after launch.

**Current workaround:** use `dev-workflow` deep, then manually assemble release evidence from PR review, handoff, validation, and human approval. Gap: no single launch readiness packet with monitoring/rollback/post-launch checks.

**Likely shape:** thin recipe that composes `dev-workflow`, `pr-review`, `handoff-packaging`, `human-approval-gate`, and `run-telemetry`.

**Inputs:** PR/package, release notes, rollout plan, validation, monitoring links, rollback plan.

**Outputs:** launch checklist, go/no-go recommendation, rollback trigger list, post-launch monitoring plan.

**Success:** human can approve launch with evidence and rollback clarity.

**Why first:** highest overlap with existing repo workflows and easiest to eval from PR/release artifacts.

### Incident Response / Oncall Workflow

**Goal:** Coordinate active incident handling from detection to mitigation to RCA.

**Likely shape:** extend `debug-investigation` first; only create new workflow if active incident coordination differs enough from RCA.

**Inputs:** alert, severity, blast radius, logs/traces/metrics, owner, mitigation status.

**Outputs:** incident brief, timeline, mitigation plan, escalation ask, RCA handoff.

**Success:** incident owner can act without re-gathering state.

### Security Review / Threat Modeling

**Goal:** Identify and mitigate security/privacy risk before release.

**Likely shape:** deep-mode recipe for `dev-workflow` or `pr-review` using agent-fleet `/council` only on high-risk changes.

**Inputs:** design/diff, data handled, auth boundaries, threat assumptions, rollout plan.

**Outputs:** threat model, risk table, required fixes, signoff ask.

**Success:** high-risk security issues are caught before merge/launch without forcing every PR into security theater.

### Data Pipeline Change Workflow

**Goal:** Safely change schemas, ETL/ELT, lineage, backfills, and data quality checks.

**Likely shape:** top-level workflow only if repeated data changes need more than `dev-workflow` + data-oriented review.

**Inputs:** schema/pipeline change, lineage, backfill plan, idempotency plan, data quality checks.

**Outputs:** migration/backfill plan, validation checklist, rollback constraints, data-quality evidence.

**Success:** downstream data consumers are protected from silent bad data.

### Performance / Capacity Planning

**Goal:** Evaluate latency/capacity/cost risks before and after performance-sensitive changes.

**Likely shape:** recipe using `pr-review`, `success-criteria-metrics`, `run-telemetry`, and council only for hot-path/high-scale changes.

**Inputs:** workload, SLO, capacity, benchmark/profile, expected change.

**Outputs:** perf risk assessment, benchmark plan, capacity recommendation, monitoring guardrails.

**Success:** performance claims have evidence and cost/latency guardrails.

## Rejected Or Deferred

- hiring/interview loop support: outside core repo workflow and privacy-heavy.
- research synthesis/literature review: useful but low overlap with current developer/PM/leadership execution loops.
- vendor/build-vs-buy: better as roadmap/decision-brief recipe until demand proves need.
- customer feedback synthesis: better as project-ideation recipe.
- experiment readout/A-B interpretation: extend `ml-experiments` before creating new top-level workflow.

## Recommendation

Build **Release Readiness / Post-Launch Monitoring** next as a recipe plus eval fixture, not a full skill.

Reasons:

- highest frequency across developers, PMs, and leadership.
- reuses existing skills with low new surface area.
- measurable via launch checklist completeness, rollback clarity, validation evidence, and post-launch telemetry.
- naturally follows `dev-workflow` and `pr-review`.

Next issue should be: “Add release-readiness recipe and eval fixture.”
