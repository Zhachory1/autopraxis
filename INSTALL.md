# Install Autopraxis

Autopraxis is a portable skills/plugin bundle. Use an agent runtime's own install/discovery tool when it exists. Use Autopraxis' fallback installer only where the runtime has no verified native installer for skill bundles.

Native manifests shipped in this repo:

- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.codex-plugin/plugin.json`
- `.cave-plugin/plugin.json`

`autopraxis.json` is the cross-runtime manifest used by validation and fallback installs. Runtime-native manifests above are the entry points for agent tools.

## Install by runtime

### Current verified install

Autopraxis is published as `@zhachory1/autopraxis` with CLI binary `autopraxis`.

#### Claude Code

Claude Code has native plugin marketplace/install commands. Add the GitHub marketplace, install the plugin, then verify it is enabled:

```bash
claude plugin marketplace add Zhachory1/autopraxis
claude plugin install autopraxis@autopraxis
claude plugin list
```

One-session test without persistent install:

```bash
claude --plugin-dir /path/to/autopraxis
```

Useful Claude plugin commands:

```bash
claude plugin list --available --json
claude plugin details autopraxis@autopraxis
claude plugin disable autopraxis@autopraxis
claude plugin uninstall autopraxis@autopraxis
claude plugin marketplace remove autopraxis
```

#### Codex

Codex support is fallback-only until a verified first-party non-interactive plugin install command exists. The fallback command writes a plugin root and Codex marketplace file, then Codex discovers it through `codex /plugins`.

Preview first:

```bash
npx @zhachory1/autopraxis@latest install --target codex-plugin --dry-run
```

Install:

```bash
npx @zhachory1/autopraxis@latest install --target codex-plugin
# restart Codex, then open:
codex /plugins
```

What the fallback writes:

- plugin root: `~/.codex/plugins/autopraxis`
- marketplace file: `~/.agents/plugins/marketplace.json`
- plugin manifest: `~/.codex/plugins/autopraxis/.codex-plugin/plugin.json`

Use temp paths for tests or review:

```bash
npx @zhachory1/autopraxis@latest install --target codex-plugin --dest /tmp/autopraxis-codex-plugin --marketplace-dest /tmp/autopraxis-marketplace.json
```

If the destination already exists and you intend to replace it, rerun with `--force`.

#### OpenCode

OpenCode discovers `SKILL.md` files from native skill directories and exposes `opencode debug skill` to verify discovery. Autopraxis is a skill bundle, not an OpenCode JavaScript plugin, so this path is fallback-only until a real OpenCode plugin entrypoint exists.

Preview first:

```bash
npx @zhachory1/autopraxis@latest install --target opencode-skills --dry-run
```

Install and verify:

```bash
npx @zhachory1/autopraxis@latest install --target opencode-skills
opencode debug skill
```

What the fallback writes:

- skill directories: `~/.opencode/skills/<skill-name>/SKILL.md`
- install record: `~/.opencode/skills/_autopraxis-plugin.json`

OpenCode's JavaScript plugin tool remains useful for JS plugins, but Autopraxis should not pretend to be one until it ships a real JS plugin entrypoint:

```bash
opencode plugin <npm-module> --global --force
opencode debug config
```

#### Me Write Code

Me Write Code uses the native `.cave-plugin/plugin.json` manifest. Until marketplace install is published, use the package fallback:

```bash
npx @zhachory1/autopraxis@latest install --target mewrite-plugin
```

Legacy direct skill install:

```bash
npx @zhachory1/autopraxis@latest install --target mewrite-skills
```

## Agent Fleet dependency for councils

Full council capability depends on the published `@zhachory1/agent-fleet` package: council protocol, persona prompts, transcript capture, journal capture, and blind-judge helpers. Autopraxis depends on `@zhachory1/agent-fleet@^0.4.0` and must not claim a required `minimal-council` or `full-council` completed unless agent-fleet preflight passes.

Verify package availability from this repo:

```bash
npm exec -- agent-fleet --version
npm exec -- agent-fleet home
```

Sync agent-fleet payloads into a runtime when needed:

```bash
npm exec -- agent-fleet install --tool claude
npm exec -- agent-fleet install --tool codex
npm exec -- agent-fleet install --tool opencode
npm exec -- agent-fleet install --tool cave --user
```

Local development override for unreleased agent-fleet changes:

```bash
export AGENT_FLEET_HOME=<path-to-agent-fleet>
test -f "$AGENT_FLEET_HOME/skills/council/SKILL.md"
test -f "$AGENT_FLEET_HOME/lib/transcript.sh"
test -f "$AGENT_FLEET_HOME/lib/journal.sh"
```

`AGENT_FLEET_HOME` is an explicit override only, never an implicit default.

## Supported fallback targets

| Target | Default Destination | Layout | Notes |
|---|---|---|---|
| `claude-plugin` | `~/.claude/skills/autopraxis` | plugin root | Claude Code plugin root with `.claude-plugin/plugin.json`; prefer `claude plugin ...` commands when possible |
| `codex-plugin` | `~/.codex/plugins/autopraxis` | plugin root | Codex plugin root with `.codex-plugin/plugin.json`; fallback updates marketplace file |
| `mewrite-plugin` | `~/.mewrite/plugins/Zhachory1/autopraxis` | plugin root | Me Write Code plugin with `.cave-plugin/plugin.json` |
| `mewrite-skills` | `~/.mewrite/agent/skills` | skill dirs | Legacy direct skill install |
| `claude-skills` | `~/.claude/skills` | skill dirs | Standalone Claude skill dirs, not namespaced as plugin |
| `codex-skills` | `~/.codex/skills` | skill dirs | Standalone Codex skill dirs, not marketplace plugin |
| `opencode-skills` | `~/.opencode/skills` | skill dirs | OpenCode native skill directories |
| `generic-markdown` | `~/.autopraxis/prompts` | markdown bundle | Copies skill dirs and writes `AUTOPRAXIS.md` index |
| `cursor-rules` | `.cursor/rules/autopraxis` | markdown bundle | Project-local rule/prompt fallback |
| `windsurf-rules` | `.windsurf/rules/autopraxis` | markdown bundle | Project-local rule/prompt fallback |

List targets:

```bash
npx @zhachory1/autopraxis@latest list-targets
```

## Package-runner fallback options

```bash
npx @zhachory1/autopraxis@latest install --target <target> [--dest <path>] [--marketplace-dest <path>] [--link] [--force] [--dry-run]
```

From a local checkout, replace `npx @zhachory1/autopraxis@latest` with `npm exec -- autopraxis`.

Options:

- `--target <target>` — install target from `autopraxis.json`.
- `--dest <path>` — override default destination; useful for custom agent homes and tests.
- `--marketplace-dest <path>` — override Codex marketplace file when using `codex-plugin`.
- `--link` — symlink package entries or skill directories instead of copying; useful during local development.
- `--force` — replace existing installed destination.
- `--dry-run` — print planned work without writing files.

Examples:

```bash
npx @zhachory1/autopraxis@latest install --target codex-plugin --marketplace-dest /tmp/marketplace.json
npx @zhachory1/autopraxis@latest install --target opencode-skills --dest ~/.opencode/skills
npx @zhachory1/autopraxis@latest install --target generic-markdown --dest ./autopraxis-prompts
```

## Runtime-native plugin layout

Autopraxis is shaped like a skills plugin repo:

```text
autopraxis/
  .claude-plugin/plugin.json
  .claude-plugin/marketplace.json
  .codex-plugin/plugin.json
  .cave-plugin/plugin.json
  .agents/plugins/marketplace.json
  skills/<skill-name>/SKILL.md
  skills/<skill-name>/references/...
  skills/<skill-name>/assets/...
```

Only manifest files belong under hidden plugin manifest directories. `skills/`, references, examples, and future hooks/MCP files stay at plugin root.

## Local Development Fallback

Direct Node commands are for Autopraxis development and fallback install tests only:

```bash
node bin/autopraxis.mjs list-targets
node bin/autopraxis.mjs install --target claude-plugin --dest /tmp/autopraxis-claude-plugin --force
node bin/autopraxis.mjs install --target codex-plugin --dest /tmp/autopraxis-codex-plugin --marketplace-dest /tmp/autopraxis-marketplace.json --force
node bin/autopraxis.mjs install --target opencode-skills --dest /tmp/autopraxis-opencode-skills --force
```

Manual direct skill copy, only when package tools are unavailable:

```bash
mkdir -p ~/.opencode/skills
cp -R skills/* ~/.opencode/skills/
opencode debug skill
```

## Upgrade

Runtime-native Claude install:

```bash
claude plugin update autopraxis@autopraxis
```

Package-runner fallback installs:

```bash
npx @zhachory1/autopraxis@latest install --target codex-plugin
npx @zhachory1/autopraxis@latest install --target opencode-skills
```

Symlink development installs follow the working tree automatically after `git pull`.

## Uninstall

Runtime-native Claude uninstall:

```bash
claude plugin uninstall autopraxis@autopraxis
claude plugin marketplace remove autopraxis
```

Fallback install directories:

```bash
rm -rf ~/.claude/skills/autopraxis
rm -rf ~/.codex/plugins/autopraxis
rm -rf ~/.mewrite/plugins/Zhachory1/autopraxis
```

For OpenCode fallback installs, remove only skill directories listed in `~/.opencode/skills/_autopraxis-plugin.json`; do not blindly delete unrelated skills.

For Codex fallback installs, also remove the `autopraxis` entry from `~/.agents/plugins/marketplace.json` if the fallback installer added it.

## Optional integrations

Autopraxis works without these, but skills become stronger when available.

| Integration | Purpose | How Skills Use It |
|---|---|---|
| `agent-fleet` | Required for full council capability | `/council`, `/ship`, personas, journals, transcripts |
| long-term memory MCP / `gbrain` | Recall prior context | decisions, plans, incidents, session notes, retros |
| code RAG / repo-index / `coderag` | Understand codebases | semantic code search, dependency graph, ownership, similar changes |
| `.workflow-runs/<run-id>/telemetry.jsonl` | Backprop data | latency, cost, loops, validation, human edits, outcomes |

## Validation

```bash
npm test
npx @zhachory1/autopraxis@latest validate-package
npm pack --dry-run
```

Local checkout validation:

```bash
node bin/autopraxis.mjs validate-package
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate . --strict
```

Validation checks:

- native Claude/Codex/Me Write plugin manifests.
- Claude marketplace manifest.
- skill frontmatter and required sections.
- workflow connective-skill references.
- structured-doc companion templates.
- cross-runtime manifest coverage.
- package excludes for local/private/generated data.
- markdown relative links.
- plugin-root and skill-directory smoke installs into temp directories.
- packed package contains runtime manifests, skills, assets, docs, and CLI.

## Distribution

Npm distribution uses scoped public package `@zhachory1/autopraxis` with CLI binary `autopraxis`.

Do not publish to a Claude marketplace, Codex marketplace, Me Write marketplace, or OpenCode package flow until post-publish install docs are validated with real agent runtimes.
