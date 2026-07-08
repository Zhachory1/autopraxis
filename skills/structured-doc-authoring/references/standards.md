# Structured Document Standards

Use these standards before selecting a template. They reconcile the linked guidance into one Autopraxis quality bar for PRDs, DDs/RFCs, technical plans, ADRs, roadmaps, and RCAs.

## Source Synthesis

- SPADE decision framing: hard decisions need a clear setting, accountable people, feasible alternatives, an explicit decision, and broad explanation. Consensus is not ownership; listening matters, then the responsible owner decides.
- Engineering decision docs: PRDs define product intent, design docs/RFCs invite feedback before implementation, ADRs record important implementation decisions near the code.
- Google-style design docs: write before coding when design uncertainty or cross-team consensus matters. Focus on context, goals/non-goals, actual design, alternatives, tradeoffs, and cross-cutting concerns.
- PRD templates: align on problem, high-level approach, narrative, goals, non-goals, key features/flows/logic, launch plan, operational checklist, open questions, and reviewer state.
- ADR guidance: capture significant architecture decisions with context and consequences; maintain decision logs; supersede decisions when needed.
- Engineering roadmap guidance: start with strategic goal and success definition, prioritize themes/epics, break into horizons/sprints, map teams/dependencies, share visually, stay flexible.
- Plan-writing guidance: write for an implementer with little context; map files, right-size tasks, define exact inputs/outputs, acceptance tests, and execution handoff.
- Narrative guidance: be clear, concise, complete, and convincing. Use simple English, precise numbers, context, accountability, evidence, root cause, consequences, and actions.

## Document Selection

| Need | Use | Primary Question | Output Gate |
|---|---|---|---|
| Product/user/business alignment | PRD | What are we building and why? | Problem and success metric accepted |
| Technical approach and tradeoffs | DD/RFC | How should we build it? | Design accepted or issues listed |
| Execution sequencing | Technical plan/task list | What should implementers do, in what order? | Tasks independently actionable |
| Durable architecture decision | ADR | What decision did we make and what follows? | Decision logged and discoverable |
| Multi-project sequencing | Roadmap | What should happen now/next/later and why? | Leadership can approve tradeoffs |
| Incident/bug learning | RCA | What happened, why, and how do we prevent recurrence? | Cause and prevention actions accepted |

## Universal Quality Bar

**Audience and decision first.** Name the reader, decision owner, and specific decision the doc supports.

**Write why before what before how.** Do not let implementation detail hide weak problem framing.

**Use precise language.** Prefer absolute metrics, dates, owners, and source pointers over vague words like big, fast, many, soon, or significant.

**Separate facts, assumptions, and opinions.** Facts need evidence. Assumptions need validation. Opinions need owner and rationale.

**Make non-goals explicit.** Non-goals are plausible things intentionally excluded, not negated goals.

**Show alternatives and tradeoffs.** Important docs must explain why rejected paths lost.

**Preserve accountability.** Name a responsible owner for decisions and actions. Consultation is not ownership.

**Define success before execution.** Include primary metric, guardrails, acceptance criteria, or done criteria before implementation or launch.

**Expose risks early.** Include security, privacy, reliability, performance, cost, operability, data quality, and rollout risk when relevant.

**Keep docs readable.** Short enough to be read by busy people; split large docs into linked subdocs when scope grows.

**Make the next gate explicit.** End every doc with what happens next: council review, approval, implementation, launch, or monitoring.

## SPADE Decision Standard

Use this block inside PRDs, DDs, ADRs, roadmaps, and high-stakes RCAs when a hard decision is being made.

| SPADE Element | Required Content |
|---|---|
| Setting | What choice is being made, why it matters, when it must be decided, and why that timing matters |
| People | Responsible owner, approver if different, consulted stakeholders, informed audience |
| Alternatives | Feasible, diverse, realistic options with pros, cons, costs, risks, and success criteria |
| Decide | Chosen option, rationale, dissent, evidence, and decision date/status |
| Explain | Communication plan, commitment ask, next steps, owners, and where decision is recorded |

## Evidence Standard

Every major claim should include at least one source pointer:

- user/customer research, support tickets, sales notes, analytics, experiment results.
- code paths, logs, traces, metrics, dashboards, incidents, postmortems.
- prior PRD/DD/ADR/roadmap/RCA, memory MCP note, council transcript, PR/CI evidence.
- stakeholder statement with owner and date if no durable source exists.

Use confidence labels when evidence is weak:

- high: direct measurement or primary source.
- medium: indirect source, small sample, or partially stale evidence.
- low: informed assumption requiring validation.

## Review Gate Standard

Before a doc advances, check:

- problem or decision is clear in the first screen.
- owner and audience are named.
- primary success metric or done criteria exists.
- non-goals and risks are explicit.
- alternatives/tradeoffs are included when decision stakes justify them.
- open questions are owner-assigned.
- next gate and approval ask are explicit.

## Common Anti-Patterns

**Solution-first PRD.** Move technical detail to DD and re-establish user/business problem.

**Design doc as task list.** Keep architecture/tradeoffs in DD; move implementation sequencing to technical plan.

**ADR without consequences.** Add what becomes easier, harder, riskier, or constrained by the decision.

**Roadmap as backlog dump.** Group by themes and outcomes; show sequencing rationale and capacity.

**RCA as blame.** Focus on system conditions, evidence, contributing factors, and prevention actions.

**Plan with placeholders.** Replace “similar to above” and vague tasks with explicit inputs, outputs, files, and tests.

## File Naming

Suggested naming when creating durable docs:

- PRD: `PRD-<slug>.md`
- DD/RFC: `DD-<slug>.md` or `RFC-<slug>.md`
- Technical plan: `plan-<slug>.md`
- ADR: `ADR-0001-<slug>.md`
- Roadmap: `roadmap-<horizon>-<slug>.md`
- RCA: `RCA-<date>-<incident-or-bug-slug>.md`
