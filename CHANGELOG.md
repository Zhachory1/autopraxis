# Changelog

All notable changes to Autopraxis are documented here.

Autopraxis uses SemVer-style versions before `1.0.0`:

- patch: docs, template, validation, installer, or compatibility fixes.
- minor: new workflows, skills, install targets, or reusable reference packs.
- major: breaking skill layout, manifest, installer, telemetry, or workflow contract changes.

## [Unreleased]

### Added

- Spawn model routing research covering cheaper-model tiers, evaluation gates, telemetry, pricing catalog, and shadow rollout controls.
- Bundled the agent-fleet council/ship payload under `vendor/agent-fleet/` (version-pinned to `@zhachory1/agent-fleet@0.4.0`). Skill and plugin installs now place `council`/`ship` skills plus council personas and ship agents alongside Autopraxis skills, so `/council` and `/ship` work without a separate agent-fleet install. Added `npm run sync:agent-fleet` to re-vendor and a validation guard against version drift.

### Changed

- Removed the in-repo `council-review` skill. Workflows now call agent-fleet `/council` directly for required minimal/full councils.

## [0.1.0] - 2026-07-08

Initial public release.

### Added

- Autopraxis project identity, README, lead image, and public GitHub repo.
- 16 YAML-frontmatter skills:
  - workflow skills: `dev-workflow`, `ml-experiments`, `pr-review`, `debug-investigation`, `project-ideation`, `roadmapping`, `backprop`.
  - shared connective skills: `grounding-brief`, `council-review`, `success-criteria-metrics`, `task-decomposition-planning`, `hypothesis-testing`, `structured-doc-authoring`, `handoff-packaging`, `human-approval-gate`, `run-telemetry`.
- Structured doc-authoring standards and templates for PRDs, DDs/RFCs, technical plans/task lists, ADRs, roadmaps, and RCAs.
- Visual documentation guidance using Mermaid and Graphviz/DOT diagrams for non-trivial docs.
- Native skills-plugin manifests:
  - `.claude-plugin/plugin.json`
  - `.codex-plugin/plugin.json`
  - `.cave-plugin/plugin.json`
- Codex local marketplace metadata at `.agents/plugins/marketplace.json`.
- Cross-runtime `autopraxis.json` manifest.
- `bin/autopraxis.mjs` installer with native plugin, direct skill, and generic markdown targets.
- Install docs in `INSTALL.md`.
- Package validation and smoke tests through `npm test`.

### Install targets

- `claude-plugin`
- `codex-plugin`
- `mewrite-plugin`
- `mewrite-skills`
- `claude-skills`
- `codex-skills`
- `generic-markdown`
- `cursor-rules`
- `windsurf-rules`

### Validation

Validated before release:

```bash
npm test
npm pack --dry-run
```

### Known limitations

- npm publishing is intentionally disabled with `"private": true` while install flows stabilize.
- Claude, Codex, and Me Write plugin marketplace publishing is not automated yet.
- No formal workflow eval suite yet; tracked separately in issue #5.
- Token/cost optimization is not implemented yet; tracked separately in issue #6.
- Additional workflow discovery is tracked separately in issue #4.

[0.1.0]: https://github.com/Zhachory1/autopraxis/releases/tag/v0.1.0
