#!/usr/bin/env node
import { appendFile, cp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'autopraxis.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const [, , command, ...args] = process.argv;

function usage(exitCode = 0) {
  const targets = Object.entries(manifest.installTargets)
    .map(([name, target]) => `  ${name.padEnd(16)} ${target.defaultDestination} — ${target.description}`)
    .join('\n');

  console.log(`Autopraxis ${manifest.version}

Usage:
  autopraxis install --target <target> [--dest <path>] [--marketplace-dest <path>] [--link] [--force] [--dry-run]
  autopraxis telemetry emit --workflow <name> --step <name> --event <event> --status <status> [--run-id <id>] [--path <file>]
  autopraxis telemetry validate --path <file>
  autopraxis telemetry summarize --path <file>
  autopraxis eval validate --fixtures <dir> [--baseline <file>]
  autopraxis eval summarize --fixtures <dir>
  autopraxis validate-package
  autopraxis list-targets

Targets:
${targets}

Examples:
  autopraxis install --target claude-plugin
  autopraxis install --target codex-plugin
  autopraxis install --target mewrite-plugin
  autopraxis install --target mewrite-skills --dest ~/.mewrite/agent/skills
`);
  process.exit(exitCode);
}

function parseOptions(values) {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) throw new Error(`Unexpected argument: ${value}`);
    const [rawKey, inlineValue] = value.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (['link', 'force', 'dryRun', 'help'].includes(key)) {
      options[key] = true;
    } else {
      const next = inlineValue ?? values[index + 1];
      if (!next || next.startsWith('--')) throw new Error(`Missing value for --${rawKey}`);
      options[key] = next;
      if (inlineValue === undefined) index += 1;
    }
  }
  return options;
}

function expandHome(path) {
  if (!path) return path;
  if (path === '~') return os.homedir();
  if (path.startsWith('~/')) return join(os.homedir(), path.slice(2));
  return path;
}

async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath, relativePath));
    else files.push(relativePath);
  }
  return files;
}

const excludedAgentFiles = new Set(['INDEX.md', '_overlay.md', '_rokt-overlay.md', '_overlay.md.example']);

async function agentFleetPersonaFiles() {
  const source = join(root, manifest.bundledAgentFleet.source);
  const files = [];
  for (const dir of [manifest.bundledAgentFleet.agentsDir, manifest.bundledAgentFleet.shipAgentsDir]) {
    for (const entry of await readdir(join(source, dir), { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md') || excludedAgentFiles.has(entry.name)) continue;
      files.push(join(source, dir, entry.name));
    }
  }
  return files;
}

// Place vendored agent-fleet council/ship skills and personas so council/ship
// behave like native Autopraxis skills. `skillsDir` is where skill dirs live for
// the target layout; agents go to a sibling agents/ dir.
async function copyOrLinkAgentFleet(skillsDir, agentsDir, options) {
  const source = join(root, manifest.bundledAgentFleet.source);
  const results = [];
  for (const skill of manifest.bundledAgentFleet.skills) {
    const target = join(skillsDir, skill);
    if (options.dryRun) { results.push({ name: `agent-fleet/${skill}`, target, action: options.link ? 'link' : 'copy' }); continue; }
    if (options.force) await rm(target, { recursive: true, force: true });
    if (existsSync(target) && !options.force) throw new Error(`${target} already exists; pass --force to replace it`);
    await mkdir(dirname(target), { recursive: true });
    if (options.link) await symlink(join(source, 'skills', skill), target, 'dir');
    else await cp(join(source, 'skills', skill), target, { recursive: true, force: false, errorOnExist: true });
    results.push({ name: `agent-fleet/${skill}`, target, action: options.link ? 'linked' : 'copied' });
  }
  for (const file of await agentFleetPersonaFiles()) {
    const target = join(agentsDir, file.split('/').pop());
    if (options.dryRun) { results.push({ name: `agent-fleet/agents/${target.split('/').pop()}`, target, action: options.link ? 'link' : 'copy' }); continue; }
    if (options.force) await rm(target, { force: true });
    if (existsSync(target) && !options.force) throw new Error(`${target} already exists; pass --force to replace it`);
    await mkdir(dirname(target), { recursive: true });
    if (options.link) await symlink(file, target);
    else await cp(file, target, { force: false, errorOnExist: true });
    results.push({ name: `agent-fleet/agents/${target.split('/').pop()}`, target, action: options.link ? 'linked' : 'copied' });
  }
  return results;
}

async function copyOrLinkSkill(skill, destination, options) {
  const source = join(root, skill.path);
  const target = join(destination, skill.name);
  if (options.dryRun) return { name: skill.name, target, action: options.link ? 'link' : 'copy' };
  if (options.force) await rm(target, { recursive: true, force: true });
  if (existsSync(target) && !options.force) throw new Error(`${target} already exists; pass --force to replace it`);
  await mkdir(dirname(target), { recursive: true });
  if (options.link) await symlink(source, target, 'dir');
  else await cp(source, target, { recursive: true, errorOnExist: true, force: false });
  return { name: skill.name, target, action: options.link ? 'linked' : 'copied' };
}

function packageRootEntries() {
  return ['.claude-plugin', '.codex-plugin', '.cave-plugin', 'skills', 'evals', 'examples', 'assets', 'releases', 'README.md', 'INSTALL.md', 'CHANGELOG.md', 'RELEASE.md', 'autopraxis.json', 'package.json'];
}

async function copyOrLinkPluginRoot(destination, options) {
  if (options.dryRun) return packageRootEntries().map((entry) => ({ name: entry, target: join(destination, entry), action: options.link ? 'link' : 'copy' }));
  if (options.force) await rm(destination, { recursive: true, force: true });
  if (existsSync(destination) && !options.force) throw new Error(`${destination} already exists; pass --force to replace it`);
  await mkdir(destination, { recursive: true });
  const results = [];
  for (const entry of packageRootEntries()) {
    const source = join(root, entry);
    const target = join(destination, entry);
    if (!existsSync(source)) continue;
    if (options.link) await symlink(source, target, 'dir');
    else await cp(source, target, { recursive: true, force: false, errorOnExist: true });
    results.push({ name: entry, target, action: options.link ? 'linked' : 'copied' });
  }
  return results;
}

async function writeBundleIndex(destination, targetName, options) {
  const lines = [
    '# Autopraxis Prompt Bundle',
    '',
    `Target: ${targetName}`,
    `Version: ${manifest.version}`,
    '',
    'Use each skill directory as a standalone workflow prompt. Native skill runtimes should read each `SKILL.md`; generic agents can paste the relevant file plus companion references.',
    '',
    '## Skills',
    '',
    ...manifest.skills.map((skill) => `- [${skill.name}](./${skill.name}/SKILL.md) — ${skill.kind}`),
    '',
    '## Optional Integrations',
    '',
    ...manifest.optionalIntegrations.map((integration) => `- ${integration.name}`),
    '',
  ];
  if (!options.dryRun) await writeFile(join(destination, 'AUTOPRAXIS.md'), lines.join('\n'));
}

async function writeInstallRecord(destination, targetName, options) {
  if (options.dryRun) return;
  await writeFile(
    join(destination, '_autopraxis-plugin.json'),
    `${JSON.stringify({ installedAt: new Date().toISOString(), target: targetName, version: manifest.version, skills: manifest.skills.map((skill) => skill.name) }, null, 2)}\n`,
  );
}

async function updateCodexMarketplace(destination, options, target) {
  const marketplacePath = resolve(expandHome(options.marketplaceDest ?? target.marketplaceDefault));
  const entry = {
    name: 'autopraxis',
    source: {
      source: 'local',
      path: destination,
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL',
    },
    category: 'Productivity',
    interface: {
      displayName: 'Autopraxis',
    },
  };

  if (options.dryRun) return marketplacePath;
  await mkdir(dirname(marketplacePath), { recursive: true });
  let marketplace = { name: 'autopraxis-local', plugins: [] };
  if (existsSync(marketplacePath)) {
    marketplace = JSON.parse(await readFile(marketplacePath, 'utf8'));
    if (!Array.isArray(marketplace.plugins)) marketplace.plugins = [];
  }
  marketplace.name ??= 'autopraxis-local';
  marketplace.plugins = marketplace.plugins.filter((plugin) => plugin.name !== 'autopraxis');
  marketplace.plugins.push(entry);
  await writeFile(marketplacePath, `${JSON.stringify(marketplace, null, 2)}\n`);
  return marketplacePath;
}

async function install(values) {
  const options = parseOptions(values);
  if (options.help) usage();
  const targetName = options.target;
  if (!targetName) throw new Error('Missing --target');
  const target = manifest.installTargets[targetName];
  if (!target) throw new Error(`Unknown target: ${targetName}`);
  const destination = resolve(expandHome(options.dest ?? target.defaultDestination));

  let results = [];
  if (target.layout === 'plugin-root') {
    results = await copyOrLinkPluginRoot(destination, options);
    results.push(...await copyOrLinkAgentFleet(join(destination, 'skills'), join(destination, 'agents'), options));
    if (targetName === 'codex-plugin') {
      const marketplacePath = await updateCodexMarketplace(destination, options, target);
      if (!options.dryRun) results.push({ name: 'codex-marketplace', target: marketplacePath, action: 'updated' });
      else results.push({ name: 'codex-marketplace', target: marketplacePath, action: 'would update' });
    }
  } else {
    if (!options.dryRun) await mkdir(destination, { recursive: true });
    for (const skill of manifest.skills) results.push(await copyOrLinkSkill(skill, destination, options));
    if (target.layout === 'skill-directories') results.push(...await copyOrLinkAgentFleet(destination, join(destination, '..', 'agents'), options));
    await writeInstallRecord(destination, targetName, options);
    if (target.layout === 'markdown-bundle') await writeBundleIndex(destination, targetName, options);
  }

  console.log(`${options.dryRun ? 'Would install' : 'Installed'} Autopraxis ${target.layout} to ${destination}`);
  for (const result of results) console.log(`- ${result.name}: ${result.action} -> ${result.target}`);
}

const telemetryEvents = new Set(['start', 'end', 'gate', 'loop', 'escalation', 'validation', 'human_response']);
const telemetryStatuses = new Set(['ok', 'fail', 'blocked', 'skipped', 'inconclusive']);
const telemetrySources = new Set(['provider_reported', 'estimated', 'user_supplied']);
const sensitiveKeyNames = ['rawprompt', 'prompt', 'rawlog', 'customerdata', 'secret', 'password', 'apikey', 'authorization', 'accesstoken', 'bearer', 'tokenvalue'];
const sensitiveValuePattern = /(sk-[A-Za-z0-9_-]{12,}|xox[baprs]-[A-Za-z0-9-]{10,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]+|BEGIN (RSA |OPENSSH |)?PRIVATE KEY|Authorization:\s*Bearer)/i;

function parseTelemetryOptions(values) {
  const options = { metrics: {}, artifactRefs: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) throw new Error(`Unexpected argument: ${value}`);
    const [rawKey, inlineValue] = value.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (key === 'help') {
      options.help = true;
      continue;
    }
    const next = inlineValue ?? values[index + 1];
    if (next === undefined || next.startsWith('--')) throw new Error(`Missing value for --${rawKey}`);
    if (inlineValue === undefined) index += 1;
    if (key === 'metric') {
      const [metricKey, metricValue] = next.split('=', 2);
      if (!metricKey || metricValue === undefined) throw new Error('--metric expects key=value');
      options.metrics[metricKey] = coerceValue(metricValue);
    } else if (key === 'artifactRef') {
      options.artifactRefs.push(next);
    } else {
      options[key] = next;
    }
  }
  return options;
}

function coerceValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

function numberOrNull(value, field, integer = false) {
  if (value === undefined || value === null) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) throw new Error(`${field} must be a non-negative ${integer ? 'integer' : 'number'}`);
  return parsed;
}

function makeRunId() {
  return `autopraxis-${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}`;
}

function defaultTelemetryPath(runId) {
  return join(process.cwd(), '.workflow-runs', runId, 'telemetry.jsonl');
}

function normalizedKey(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function inspectSensitive(value, path = '') {
  const failures = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => failures.push(...inspectSensitive(item, `${path}[${index}]`)));
  } else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      const nestedPath = path ? `${path}.${key}` : key;
      const keyNorm = normalizedKey(key);
      if (sensitiveKeyNames.some((name) => keyNorm.includes(name))) failures.push(`${nestedPath}: sensitive key is not allowed`);
      failures.push(...inspectSensitive(nested, nestedPath));
    }
  } else if (typeof value === 'string' && sensitiveValuePattern.test(value)) {
    failures.push(`${path || '<value>'}: sensitive-looking value is not allowed`);
  }
  return failures;
}

function validateTelemetryEvent(event) {
  const failures = [];
  for (const field of ['schema_version', 'ts', 'run_id', 'workflow', 'step', 'event', 'status']) {
    if (event[field] === undefined || event[field] === null || event[field] === '') failures.push(`missing required field ${field}`);
  }
  if (event.schema_version !== 1) failures.push('schema_version must be 1');
  for (const field of ['ts', 'run_id', 'workflow', 'step', 'event', 'status']) {
    if (event[field] !== undefined && typeof event[field] !== 'string') failures.push(`${field} must be a string`);
  }
  for (const field of ['provider', 'model', 'verdict', 'escalation_reason', 'notes']) {
    if (event[field] !== undefined && event[field] !== null && typeof event[field] !== 'string') failures.push(`${field} must be a string or null`);
  }
  if (event.tools !== undefined && (!Array.isArray(event.tools) || event.tools.some((item) => typeof item !== 'string'))) failures.push('tools must be an array of strings');
  if (event.artifact_refs !== undefined && (!Array.isArray(event.artifact_refs) || event.artifact_refs.some((item) => typeof item !== 'string'))) failures.push('artifact_refs must be an array of strings');
  if (event.metrics !== undefined && (event.metrics === null || Array.isArray(event.metrics) || typeof event.metrics !== 'object')) failures.push('metrics must be an object');
  if (event.event !== undefined && !telemetryEvents.has(event.event)) failures.push(`event must be one of ${[...telemetryEvents].join(', ')}`);
  if (event.status !== undefined && !telemetryStatuses.has(event.status)) failures.push(`status must be one of ${[...telemetryStatuses].join(', ')}`);
  for (const field of ['latency_ms', 'cost_usd', 'human_edit_rate']) {
    if (event[field] !== undefined && event[field] !== null && (typeof event[field] !== 'number' || event[field] < 0)) failures.push(`${field} must be a non-negative number or null`);
  }
  for (const field of ['tokens_in', 'tokens_out', 'loop_iteration', 'loop_cap']) {
    if (event[field] !== undefined && event[field] !== null && (!Number.isInteger(event[field]) || event[field] < 0)) failures.push(`${field} must be a non-negative integer or null`);
  }
  if (event.human_edit_rate !== undefined && event.human_edit_rate !== null && event.human_edit_rate > 1) failures.push('human_edit_rate must be between 0 and 1');
  if (event.cost_source !== undefined && event.cost_source !== null && !telemetrySources.has(event.cost_source)) failures.push(`cost_source must be one of ${[...telemetrySources].join(', ')} or null`);
  if (event.token_source !== undefined && event.token_source !== null && !telemetrySources.has(event.token_source)) failures.push(`token_source must be one of ${[...telemetrySources].join(', ')} or null`);
  if (event.cost_usd !== undefined && event.cost_usd !== null && !telemetrySources.has(event.cost_source)) failures.push('cost_source is required when cost_usd is set');
  if ((event.tokens_in !== undefined && event.tokens_in !== null) || (event.tokens_out !== undefined && event.tokens_out !== null)) {
    if (!telemetrySources.has(event.token_source)) failures.push('token_source is required when token counts are set');
  }
  failures.push(...inspectSensitive(event));
  return failures;
}

async function readTelemetryJsonl(path) {
  const text = await readFile(path, 'utf8');
  const events = [];
  const failures = [];
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch (error) {
      failures.push(`${path}:${index + 1}:1 invalid_json: ${error.message}; fix: write one valid JSON object per line`);
      continue;
    }
    const eventFailures = validateTelemetryEvent(event);
    for (const failure of eventFailures) failures.push(`${path}:${index + 1}:1 invalid_event: ${failure}; fix: update or remove the invalid telemetry field`);
    events.push(event);
  }
  return { events, failures };
}

async function telemetryEmit(values) {
  const options = parseTelemetryOptions(values);
  if (options.help) telemetryUsage();
  for (const field of ['workflow', 'step', 'event', 'status']) {
    if (!options[field]) throw new Error(`telemetry emit missing --${field.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`);
  }
  const runId = options.runId ?? makeRunId();
  const outputPath = resolve(expandHome(options.path ?? defaultTelemetryPath(runId)));
  const event = {
    schema_version: 1,
    ts: new Date().toISOString(),
    run_id: runId,
    workflow: options.workflow,
    step: options.step,
    event: options.event,
    status: options.status,
    latency_ms: numberOrNull(options.latencyMs, 'latency_ms'),
    cost_usd: numberOrNull(options.costUsd, 'cost_usd'),
    cost_source: options.costSource ?? null,
    token_source: options.tokenSource ?? null,
    tokens_in: numberOrNull(options.tokensIn, 'tokens_in', true),
    tokens_out: numberOrNull(options.tokensOut, 'tokens_out', true),
    provider: options.provider ?? null,
    model: options.model ?? null,
    tools: [],
    artifact_refs: options.artifactRefs,
    metrics: options.metrics,
    verdict: options.verdict ?? null,
    loop_iteration: numberOrNull(options.loopIteration, 'loop_iteration', true),
    loop_cap: numberOrNull(options.loopCap, 'loop_cap', true),
    human_edit_rate: numberOrNull(options.humanEditRate, 'human_edit_rate'),
    escalation_reason: options.escalationReason ?? null,
    notes: options.notes ?? null,
  };
  const failures = validateTelemetryEvent(event);
  if (failures.length) {
    for (const failure of failures) console.error(`telemetry emit: invalid_event: ${failure}`);
    process.exit(1);
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await appendFile(outputPath, `${JSON.stringify(event)}\n`);
  console.log(JSON.stringify({ path: outputPath, run_id: runId, event: event.event, status: event.status }));
}

async function telemetryValidate(values) {
  const options = parseOptions(values);
  if (options.help) telemetryUsage();
  if (!options.path) throw new Error('telemetry validate missing --path');
  const path = resolve(expandHome(options.path));
  const { events, failures } = await readTelemetryJsonl(path);
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }
  console.log(JSON.stringify({ path, valid: true, event_count: events.length }));
}

function increment(map, key) {
  map[key ?? 'unknown'] = (map[key ?? 'unknown'] ?? 0) + 1;
}

async function telemetrySummarize(values) {
  const options = parseOptions(values);
  if (options.help) telemetryUsage();
  if (!options.path) throw new Error('telemetry summarize missing --path');
  const path = resolve(expandHome(options.path));
  const { events, failures } = await readTelemetryJsonl(path);
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }
  const summary = {
    path,
    event_count: events.length,
    by_workflow: {},
    by_event: {},
    by_status: {},
    latency_ms_total: 0,
    cost: { total_usd: 0, observed_events: 0, missing_events: 0, by_source: {} },
    tokens: { in_total: 0, out_total: 0, observed_events: 0, missing_events: 0, by_source: {} },
    max_loop_iteration: 0,
    escalation_count: 0,
  };
  for (const event of events) {
    increment(summary.by_workflow, event.workflow);
    increment(summary.by_event, event.event);
    increment(summary.by_status, event.status);
    if (typeof event.latency_ms === 'number') summary.latency_ms_total += event.latency_ms;
    if (typeof event.cost_usd === 'number') {
      summary.cost.total_usd += event.cost_usd;
      summary.cost.observed_events += 1;
      summary.cost.by_source[event.cost_source] = (summary.cost.by_source[event.cost_source] ?? 0) + event.cost_usd;
    } else summary.cost.missing_events += 1;
    if (Number.isInteger(event.tokens_in) || Number.isInteger(event.tokens_out)) {
      summary.tokens.in_total += event.tokens_in ?? 0;
      summary.tokens.out_total += event.tokens_out ?? 0;
      summary.tokens.observed_events += 1;
      increment(summary.tokens.by_source, event.token_source);
    } else summary.tokens.missing_events += 1;
    if (Number.isInteger(event.loop_iteration)) summary.max_loop_iteration = Math.max(summary.max_loop_iteration, event.loop_iteration);
    if (event.event === 'escalation' || event.escalation_reason) summary.escalation_count += 1;
  }
  console.log(JSON.stringify(summary, null, 2));
}

function telemetryUsage() {
  console.log(`Autopraxis telemetry commands

Usage:
  autopraxis telemetry emit --workflow <name> --step <name> --event <event> --status <status> [--run-id <id>] [--path <file>]
  autopraxis telemetry validate --path <file>
  autopraxis telemetry summarize --path <file>

Emit options:
  --run-id <id>              Defaults to generated id; when --path is absent writes .workflow-runs/<run-id>/telemetry.jsonl
  --metric key=value         Repeatable structured metric field
  --artifact-ref <path>      Repeatable pointer; store pointers, not raw content
  --tokens-in <int>          Requires --token-source provider_reported|estimated|user_supplied
  --tokens-out <int>         Requires --token-source provider_reported|estimated|user_supplied
  --cost-usd <number>        Requires --cost-source provider_reported|estimated|user_supplied
`);
  process.exit(0);
}

async function telemetry(values) {
  const [subcommand, ...rest] = values;
  if (!subcommand || ['help', '--help', '-h'].includes(subcommand)) telemetryUsage();
  else if (subcommand === 'emit') await telemetryEmit(rest);
  else if (subcommand === 'validate') await telemetryValidate(rest);
  else if (subcommand === 'summarize') await telemetrySummarize(rest);
  else throw new Error(`Unknown telemetry subcommand: ${subcommand}`);
}

const evalModes = new Set(['lite', 'default', 'deep']);
const evalCouncilLevels = new Set(['none', 'single-lens', 'minimal-council', 'full-council']);
const evalTelemetryFields = new Set(['provider', 'model', 'tokens_in', 'tokens_out', 'token_source', 'cost_usd', 'cost_source', 'latency_ms', 'workflow_mode', 'loop_iteration', 'loop_cap', 'status', 'verdict']);

async function readEvalFixtures(fixturesPath) {
  const dir = resolve(expandHome(fixturesPath));
  const entries = await readdir(dir, { withFileTypes: true });
  const fixtures = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const path = join(dir, entry.name);
    const raw = await readFile(path, 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      fixtures.push({ path, parse_error: error.message });
      continue;
    }
    if (Array.isArray(parsed)) fixtures.push(...parsed.map((fixture) => ({ ...fixture, path })));
    else fixtures.push({ ...parsed, path });
  }
  return fixtures;
}

function workflowNamesFromManifest() {
  return manifest.skills.filter((skill) => skill.kind === 'workflow').map((skill) => skill.name).sort();
}

function validateEvalFixtures(fixtures) {
  const failures = [];
  const workflows = new Set(workflowNamesFromManifest());
  const seenIds = new Set();
  const covered = new Set();
  for (const fixture of fixtures) {
    const label = fixture.path ?? '<fixture>';
    if (fixture.parse_error) {
      failures.push(`${label}: invalid_json: ${fixture.parse_error}`);
      continue;
    }
    for (const field of ['schema_version', 'id', 'workflow', 'scenario', 'expected_mode', 'expected_council_level', 'expected_artifacts', 'required_telemetry', 'outcome_contract', 'privacy', 'metric_status']) {
      if (fixture[field] === undefined || fixture[field] === null || fixture[field] === '') failures.push(`${label}: missing required field ${field}`);
    }
    if (fixture.schema_version !== 1) failures.push(`${label}: schema_version must be 1`);
    if (typeof fixture.id !== 'string') failures.push(`${label}: id must be a string`);
    else if (seenIds.has(fixture.id)) failures.push(`${label}: duplicate id ${fixture.id}`);
    else seenIds.add(fixture.id);
    if (!workflows.has(fixture.workflow)) failures.push(`${label}: unknown workflow ${fixture.workflow}`);
    else covered.add(fixture.workflow);
    if (!evalModes.has(fixture.expected_mode)) failures.push(`${label}: expected_mode must be ${[...evalModes].join('|')}`);
    if (!evalCouncilLevels.has(fixture.expected_council_level)) failures.push(`${label}: expected_council_level must be ${[...evalCouncilLevels].join('|')}`);
    if (typeof fixture.scenario !== 'string') failures.push(`${label}: scenario must be a string`);
    if (!Array.isArray(fixture.expected_artifacts) || fixture.expected_artifacts.some((item) => typeof item !== 'string')) failures.push(`${label}: expected_artifacts must be an array of strings`);
    if (!Array.isArray(fixture.required_telemetry) || fixture.required_telemetry.some((item) => typeof item !== 'string')) failures.push(`${label}: required_telemetry must be an array of strings`);
    for (const field of fixture.required_telemetry ?? []) {
      if (!evalTelemetryFields.has(field) && !field.startsWith('metrics.')) failures.push(`${label}: unknown required_telemetry field ${field}`);
    }
    if (!fixture.outcome_contract || typeof fixture.outcome_contract !== 'object' || Array.isArray(fixture.outcome_contract)) failures.push(`${label}: outcome_contract must be an object`);
    else {
      if (typeof fixture.outcome_contract.primary !== 'string') failures.push(`${label}: outcome_contract.primary must be a string`);
      if (!Array.isArray(fixture.outcome_contract.guardrails) || fixture.outcome_contract.guardrails.some((item) => typeof item !== 'string')) failures.push(`${label}: outcome_contract.guardrails must be an array of strings`);
    }
    if (!fixture.privacy || fixture.privacy.synthetic !== true) failures.push(`${label}: privacy.synthetic must be true`);
    if (fixture.privacy && typeof fixture.privacy.source !== 'string') failures.push(`${label}: privacy.source must be a string`);
    if (fixture.metric_status !== 'contract_only') failures.push(`${label}: metric_status must be contract_only in v1`);
    for (const failure of inspectSensitive(fixture)) failures.push(`${label}: ${failure}`);
  }
  for (const workflow of workflows) {
    if (!covered.has(workflow)) failures.push(`missing fixture for workflow ${workflow}`);
  }
  return failures;
}

function summarizeEvalFixtures(fixtures) {
  const workflows = workflowNamesFromManifest();
  const summary = {
    schema_version: 1,
    fixture_count: fixtures.length,
    workflow_coverage: {
      expected: workflows.length,
      covered: 0,
      missing: [],
    },
    by_workflow: {},
    by_mode: {},
    by_council_level: {},
    metric_status: {},
    required_telemetry_fields: [],
  };
  const telemetryFields = new Set();
  for (const fixture of fixtures) {
    if (fixture.parse_error) continue;
    increment(summary.by_workflow, fixture.workflow);
    increment(summary.by_mode, fixture.expected_mode);
    increment(summary.by_council_level, fixture.expected_council_level);
    increment(summary.metric_status, fixture.metric_status);
    for (const field of fixture.required_telemetry ?? []) telemetryFields.add(field);
  }
  for (const mode of evalModes) summary.by_mode[mode] ??= 0;
  for (const level of evalCouncilLevels) summary.by_council_level[level] ??= 0;
  summary.metric_status.contract_only ??= 0;
  const covered = new Set(Object.keys(summary.by_workflow));
  summary.workflow_coverage.covered = workflows.filter((workflow) => covered.has(workflow)).length;
  summary.workflow_coverage.missing = workflows.filter((workflow) => !covered.has(workflow));
  summary.required_telemetry_fields = [...telemetryFields].sort();
  return summary;
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

async function evalValidate(values) {
  const options = parseOptions(values);
  if (options.help) evalUsage();
  if (!options.fixtures) throw new Error('eval validate missing --fixtures');
  const fixtures = await readEvalFixtures(options.fixtures);
  const failures = validateEvalFixtures(fixtures);
  if (options.baseline) {
    const baseline = JSON.parse(await readFile(resolve(expandHome(options.baseline)), 'utf8'));
    const summary = summarizeEvalFixtures(fixtures);
    if (baseline.schema_version !== summary.schema_version) failures.push('baseline schema_version differs');
    if (baseline.fixture_count !== summary.fixture_count) failures.push(`baseline fixture_count ${baseline.fixture_count} != current ${summary.fixture_count}`);
    if (stableJson(baseline.workflow_coverage) !== stableJson(summary.workflow_coverage)) failures.push('baseline workflow coverage differs');
    if (stableJson(baseline.by_mode) !== stableJson(summary.by_mode)) failures.push('baseline mode coverage differs');
    if (stableJson(baseline.by_council_level) !== stableJson(summary.by_council_level)) failures.push('baseline council-level coverage differs');
    if (stableJson(baseline.metric_status) !== stableJson(summary.metric_status)) failures.push('baseline metric status differs');
  }
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }
  console.log(JSON.stringify({ valid: true, fixture_count: fixtures.length, workflow_coverage: summarizeEvalFixtures(fixtures).workflow_coverage }));
}

async function evalSummarize(values) {
  const options = parseOptions(values);
  if (options.help) evalUsage();
  if (!options.fixtures) throw new Error('eval summarize missing --fixtures');
  const fixtures = await readEvalFixtures(options.fixtures);
  const failures = validateEvalFixtures(fixtures);
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exit(1);
  }
  console.log(JSON.stringify(summarizeEvalFixtures(fixtures), null, 2));
}

function evalUsage() {
  console.log(`Autopraxis eval commands

Usage:
  autopraxis eval validate --fixtures <dir> [--baseline <file>]
  autopraxis eval summarize --fixtures <dir>

Eval v1 is deterministic: it validates synthetic workflow fixtures and summarizes coverage. It does not call models.
`);
  process.exit(0);
}

async function evalCommand(values) {
  const [subcommand, ...rest] = values;
  if (!subcommand || ['help', '--help', '-h'].includes(subcommand)) evalUsage();
  else if (subcommand === 'validate') await evalValidate(rest);
  else if (subcommand === 'summarize') await evalSummarize(rest);
  else throw new Error(`Unknown eval subcommand: ${subcommand}`);
}

async function validatePackage() {
  const failures = [];
  for (const [runtime, manifestFile] of Object.entries(manifest.standardPluginManifests)) {
    if (!existsSync(join(root, manifestFile))) failures.push(`${runtime}: missing ${manifestFile}`);
  }
  for (const skill of manifest.skills) {
    const skillDir = join(root, skill.path);
    const skillFile = join(skillDir, 'SKILL.md');
    if (!existsSync(skillFile)) failures.push(`${skill.name}: missing SKILL.md`);
    const files = existsSync(skillDir) ? await listFiles(skillDir) : [];
    if (!files.length) failures.push(`${skill.name}: no package files found`);
  }
  for (const exclude of ['.git/**', 'node_modules/**', '.workflow-runs/**', '.env']) {
    if (!manifest.package.exclude.includes(exclude)) failures.push(`manifest package.exclude missing ${exclude}`);
  }
  const bundle = manifest.bundledAgentFleet;
  if (!bundle) failures.push('manifest missing bundledAgentFleet');
  else {
    const bundleRoot = join(root, bundle.source);
    for (const skill of bundle.skills) {
      if (!existsSync(join(bundleRoot, 'skills', skill, 'SKILL.md'))) failures.push(`bundled agent-fleet skill missing: ${skill}/SKILL.md`);
    }
    for (const dir of [bundle.agentsDir, bundle.shipAgentsDir]) {
      if (!existsSync(join(bundleRoot, dir))) failures.push(`bundled agent-fleet dir missing: ${dir}`);
    }
    const pinned = existsSync(join(bundleRoot, '.pinned-version')) ? (await readFile(join(bundleRoot, '.pinned-version'), 'utf8')).trim() : '';
    if (pinned !== bundle.version) failures.push(`bundled agent-fleet version drift: pinned ${pinned || '<none>'} != manifest ${bundle.version}; run npm run sync:agent-fleet`);
  }
  const codexManifest = JSON.parse(await readFile(join(root, '.codex-plugin/plugin.json'), 'utf8'));
  if (codexManifest.skills !== './skills/') failures.push('codex manifest must point skills to ./skills/');
  const claudeManifest = JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8'));
  if (claudeManifest.name !== 'autopraxis') failures.push('claude manifest name must be autopraxis');
  if (failures.length) {
    console.error('Package validation failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`Package manifests valid: ${manifest.skills.length} skills, ${Object.keys(manifest.installTargets).length} install targets.`);
}

if (!command || ['help', '--help', '-h'].includes(command)) usage();

try {
  if (command === 'install') await install(args);
  else if (command === 'telemetry') await telemetry(args);
  else if (command === 'eval') await evalCommand(args);
  else if (command === 'validate-package') await validatePackage();
  else if (command === 'list-targets') {
    for (const [name, target] of Object.entries(manifest.installTargets)) console.log(`${name}\t${target.defaultDestination}\t${target.description}`);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(`autopraxis: ${error.message}`);
  process.exit(1);
}
