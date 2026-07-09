import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const cli = join(root, 'bin/autopraxis.mjs');
const failures = [];

function run(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8', ...options });
}

let result = run(['eval', 'validate', '--fixtures', 'evals/workflows', '--baseline', 'evals/baselines/v0.1.0.json']);
if (result.status !== 0) failures.push(`eval validate failed: ${result.stderr || result.stdout}`);

result = run(['eval', 'summarize', '--fixtures', 'evals/workflows']);
if (result.status !== 0) failures.push(`eval summarize failed: ${result.stderr || result.stdout}`);
else {
  const summary = JSON.parse(result.stdout);
  if (summary.fixture_count !== 7) failures.push(`expected 7 fixtures, got ${summary.fixture_count}`);
  if (summary.workflow_coverage.covered !== 7) failures.push(`expected 7 workflows covered, got ${summary.workflow_coverage.covered}`);
  if (summary.workflow_coverage.missing.length !== 0) failures.push(`expected no missing workflows, got ${summary.workflow_coverage.missing.join(',')}`);
  if (!summary.required_telemetry_fields.includes('workflow_mode')) failures.push('summary missing required telemetry field workflow_mode');
}

const temp = await mkdtemp(join(tmpdir(), 'autopraxis-evals-'));
try {
  await mkdir(join(temp, 'fixtures'));
  await writeFile(join(temp, 'fixtures', 'unknown.json'), JSON.stringify({
    schema_version: 1,
    id: 'unknown-workflow',
    workflow: 'not-real',
    scenario: 'Synthetic invalid workflow.',
    expected_mode: 'lite',
    expected_council_level: 'none',
    expected_artifacts: [],
    required_telemetry: [],
    outcome_contract: { primary: 'n/a', guardrails: [] },
    privacy: { synthetic: true, source: 'invented' },
    metric_status: 'contract_only'
  }));
  result = run(['eval', 'validate', '--fixtures', join(temp, 'fixtures')]);
  if (result.status === 0) failures.push('unknown workflow fixture unexpectedly passed');
  if (!result.stderr.includes('unknown workflow')) failures.push('unknown workflow error missing expected message');

  await writeFile(join(temp, 'fixtures', 'unknown.json'), JSON.stringify({
    schema_version: 1,
    id: 'bad-mode',
    workflow: 'dev-workflow',
    scenario: 'Synthetic invalid mode.',
    expected_mode: 'maximum',
    expected_council_level: 'none',
    expected_artifacts: [],
    required_telemetry: [],
    outcome_contract: { primary: 'n/a', guardrails: [] },
    privacy: { synthetic: true, source: 'invented' },
    metric_status: 'contract_only'
  }));
  result = run(['eval', 'validate', '--fixtures', join(temp, 'fixtures')]);
  if (result.status === 0) failures.push('bad mode fixture unexpectedly passed');
  if (!result.stderr.includes('expected_mode must be')) failures.push('bad mode error missing expected message');

  await writeFile(join(temp, 'fixtures', 'unknown.json'), JSON.stringify({
    schema_version: 1,
    id: 'bad-contract',
    workflow: 'dev-workflow',
    scenario: 'Synthetic invalid contract.',
    expected_mode: 'lite',
    expected_council_level: 'none',
    expected_artifacts: [],
    required_telemetry: ['not_a_telemetry_field'],
    outcome_contract: 'not-object',
    privacy: { synthetic: true, source: 'invented' },
    metric_status: 'contract_only'
  }));
  result = run(['eval', 'validate', '--fixtures', join(temp, 'fixtures')]);
  if (result.status === 0) failures.push('bad contract fixture unexpectedly passed');
  if (!result.stderr.includes('unknown required_telemetry field') || !result.stderr.includes('outcome_contract must be an object')) failures.push('bad contract fixture error missing expected messages');

  await writeFile(join(temp, 'fixtures', 'unknown.json'), JSON.stringify({
    schema_version: 1,
    id: 'sensitive-eval',
    workflow: 'dev-workflow',
    scenario: 'Authorization: Bearer x',
    expected_mode: 'lite',
    expected_council_level: 'none',
    expected_artifacts: [],
    required_telemetry: [],
    outcome_contract: { primary: 'n/a', guardrails: [] },
    privacy: { synthetic: true, source: 'invented' },
    metric_status: 'contract_only'
  }));
  result = run(['eval', 'validate', '--fixtures', join(temp, 'fixtures')]);
  if (result.status === 0) failures.push('sensitive eval fixture unexpectedly passed');
  if (!result.stderr.includes('sensitive-looking value')) failures.push('sensitive eval error missing expected message');

  await writeFile(join(temp, 'baseline.json'), JSON.stringify({
    schema_version: 1,
    fixture_count: 7,
    workflow_coverage: { expected: 7, covered: 7, missing: [] },
    by_mode: { lite: 999, default: 4, deep: 1 },
    by_council_level: { none: 3, 'single-lens': 2, 'minimal-council': 2, 'full-council': 0 },
    metric_status: { contract_only: 7 }
  }));
  result = run(['eval', 'validate', '--fixtures', 'evals/workflows', '--baseline', join(temp, 'baseline.json')]);
  if (result.status === 0) failures.push('stale baseline unexpectedly passed');
  if (!result.stderr.includes('baseline mode coverage differs')) failures.push('stale baseline error missing expected message');
} finally {
  await rm(temp, { recursive: true, force: true });
}

if (failures.length) {
  console.error('Eval fixture validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Eval fixtures validated.');
