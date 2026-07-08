# Source Notes

These notes summarize how the supplied sources map into Autopraxis document standards. Use them for attribution and to understand why the templates are shaped this way.

## Gokul Rajaram S.P.A.D.E. Toolkit

Applied as decision framing across PRDs, DDs, ADRs, roadmaps, and high-stakes RCAs.

- hard decisions deserve process; low-importance decisions do not.
- consensus does not equal ownership; responsible decision owner decides and owns execution.
- setting requires precise what, when, and why.
- people requires responsible owner, approver, consulted stakeholders, and informed audience.
- alternatives should be feasible, diverse, comprehensive, and evaluated against success criteria.
- deciding should gather private feedback where hierarchy/groupthink could bias input.
- explaining requires communicating rationale, implications, commitment, and next steps.

## CloudSecDocs Engineering Decisions

Applied as document taxonomy.

- design docs/RFCs are for higher-level feedback before work begins.
- design docs should share context, suggested approach, requirements, architecture, and tradeoffs.
- ADRs document implementation decisions and usually live near code as living docs.
- writing things down spreads knowledge and improves engineering decision quality.

## Design Docs At Google

Applied to DD/RFC standards.

- write design docs before coding when design uncertainty, cross-team consensus, or hard tradeoffs exist.
- useful sections: context/scope, goals/non-goals, actual design, alternatives considered, cross-cutting concerns.
- non-goals are plausible goals intentionally excluded.
- alternatives are one of the most important sections because they show why the chosen tradeoffs win.
- include security, privacy, observability, and other cross-cutting concerns early.
- keep docs long enough to be useful but short enough busy people will read; split oversized docs.

## Kevinyien PRD Template

Applied to PRD structure.

- align first on problem, evidence, high-level approach, narrative, goals, and non-goals.
- do not continue when contributors are not aligned on the problem.
- include solution alignment through key features, key flows, and key logic.
- include launch plan, milestones, operational checklist, open questions, FAQ, and changelog when useful.

## Architecture Decision Record Repository

Applied to ADR structure.

- ADRs capture important architecture decisions with context and consequences.
- maintain a decision log for the system or organization.
- good ADRs include rationale, relevant pros/cons, consequences, lifecycle/status, and supersession links.
- decisions can be enforced with review guardrails or fitness functions.

## ProductPlan Engineering Roadmap

Applied to roadmap structure.

- engineering roadmap is a high-level overview of product development goals and milestones, not infrastructure-only planning.
- start with strategic goal and success definition.
- prioritize themes/epics, break long-term plan into shorter horizons/sprints, assign teams/responsibilities, integrate with project management, share with stakeholders, and stay flexible.
- presentation should start with why, be visual/concise, and keep supporting evidence available without dumping it.

## Obra Superpowers Writing Plans

Applied to technical plan/task-list structure.

- write plans for implementers with little codebase context.
- map file structure and responsibilities before tasks.
- right-size tasks so each has its own test cycle and reviewable output.
- include exact inputs, outputs, names, signatures, acceptance criteria, tests, and handoff.
- avoid placeholders such as “similar to above”.

## Obra Implementer Prompt

Applied to task handoff standards.

- each task should include description, context, before-you-begin questions, job, code organization, escalation rules, self-review, test rerun expectations, and report format.
- implementers should report `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, or `NEEDS_CONTEXT` with tests and concerns.

## Narrative Guidance Google Doc

Applied to universal writing and RCA standards.

- use clear, concise, complete communication that can convince a reader.
- provide context; do not assume reader knows or cares.
- use precise absolute terms with dates, deltas, counts, and baselines.
- do not rely on charts without explaining what to take from them.
- own negative outcomes; humility builds trust.
- question categories: focus, clarification, assumptions, evidence, causes, effects, actions.
- RCA should distinguish evidence, cause, consequences, containment, prevention, accountability, and risk management.

## Access Notes

- Coda, public web pages, GitHub files, and Google Docs were fetched as source text where accessible.
- No suspicious prompt-injection instructions were detected in fetched source text during ingestion.
- Templates are synthesized guidance, not verbatim copies.
