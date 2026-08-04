import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const cli = join(root, 'bin/autopraxis.mjs');
const failures = [];

function run(args, options = {}) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8', ...options });
}

let result = run(['telemetry', 'validate', '--path', 'examples/telemetry/valid.jsonl']);
if (result.status !== 0) failures.push(`valid fixture failed validation: ${result.stderr || result.stdout}`);

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/invalid.jsonl']);
if (result.status === 0) failures.push('invalid fixture unexpectedly passed validation');
if (!result.stderr.includes('invalid_json')) failures.push('invalid fixture error missing invalid_json code');

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/sensitive.jsonl']);
if (result.status === 0) failures.push('sensitive fixture unexpectedly passed validation');
if (!result.stderr.includes('sensitive key')) failures.push('sensitive fixture error missing sensitive key message');

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/sensitive-value.jsonl']);
if (result.status === 0) failures.push('sensitive value fixture unexpectedly passed validation');
if (!result.stderr.includes('sensitive-looking value')) failures.push('sensitive value fixture error missing sensitive value message');

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/type-mismatch.jsonl']);
if (result.status === 0) failures.push('type mismatch fixture unexpectedly passed validation');
if (!result.stderr.includes('ts must be a string') || !result.stderr.includes('tools must be an array')) failures.push('type mismatch fixture error missing type messages');

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/bad-source.jsonl']);
if (result.status === 0) failures.push('bad source fixture unexpectedly passed validation');
if (!result.stderr.includes('cost_source must be one of') || !result.stderr.includes('token_source must be one of')) failures.push('bad source fixture error missing source messages');

result = run(['telemetry', 'validate', '--path', 'examples/telemetry/private-key-value.jsonl']);
if (result.status === 0) failures.push('private key value fixture unexpectedly passed validation');
if (!result.stderr.includes('sensitive-looking value')) failures.push('private key value fixture error missing sensitive value message');

result = run(['telemetry', 'emit', '--help']);
if (result.status !== 0) failures.push('telemetry emit --help should exit 0');

result = run(['telemetry', 'summarize', '--path', 'examples/telemetry/valid.jsonl']);
if (result.status !== 0) failures.push(`summary failed: ${result.stderr || result.stdout}`);
else {
  const summary = JSON.parse(result.stdout);
  if (summary.event_count !== 3) failures.push(`summary event_count expected 3, got ${summary.event_count}`);
  if (summary.by_workflow['plan-to-launch'] !== 3) failures.push('summary missing plan-to-launch count');
  if (summary.by_status.ok !== 2) failures.push('summary missing ok status count');
  if (summary.by_status.skipped !== 1) failures.push('summary missing skipped status count');
  if (summary.tokens.in_total !== 100 || summary.tokens.out_total !== 20) failures.push('summary token totals wrong');
  if (summary.cost.total_usd !== 0.01) failures.push('summary cost total wrong');
}

const temp = await mkdtemp(join(tmpdir(), 'autopraxis-telemetry-'));
try {
  const path = join(temp, 'telemetry.jsonl');
  result = run([
    'telemetry', 'emit',
    '--path', path,
    '--run-id', 'emit-test',
    '--workflow', 'plan-to-launch',
    '--step', 'test',
    '--event', 'start',
    '--status', 'ok',
    '--tokens-in', '7',
    '--tokens-out', '3',
    '--token-source', 'user_supplied',
    '--cost-usd', '0.02',
    '--cost-source', 'user_supplied',
    '--metric', 'workflow_mode=lite',
  ]);
  if (result.status !== 0) failures.push(`emit failed: ${result.stderr || result.stdout}`);
  if (!existsSync(path)) failures.push('emit did not create telemetry file');
  else {
    const line = (await readFile(path, 'utf8')).trim();
    const event = JSON.parse(line);
    if (event.schema_version !== 1) failures.push('emit missing schema_version 1');
    if (event.metrics.workflow_mode !== 'lite') failures.push('emit missing metric workflow_mode');
  }
  result = run(['telemetry', 'validate', '--path', path]);
  if (result.status !== 0) failures.push(`emitted file failed validation: ${result.stderr || result.stdout}`);

  // M1 skill-lifecycle signal: field validation + cross-run aggregation.
  const badDisp = run(['telemetry', 'emit', '--path', join(temp, 'bad.jsonl'), '--run-id', 'x', '--workflow', 'pr-review', '--step', 'end', '--event', 'end', '--status', 'ok', '--metric', 'run_disposition=accepted']);
  if (badDisp.status === 0) failures.push('run_disposition on end event unexpectedly passed');
  if (!badDisp.stderr.includes('late human_response')) failures.push('run_disposition wrong-event error missing message');

  const badSkills = run(['telemetry', 'emit', '--path', join(temp, 'bad2.jsonl'), '--run-id', 'x', '--workflow', 'pr-review', '--step', 'route', '--event', 'escalation', '--status', 'ok', '--metric', 'skills_invoked=["a"]']);
  if (badSkills.status === 0) failures.push('skills_invoked on escalation event unexpectedly passed');

  const lifePath = join(temp, 'life.jsonl');
  for (const id of ['r1', 'r2', 'r3']) {
    run(['telemetry', 'emit', '--path', lifePath, '--run-id', id, '--workflow', 'plan-to-launch', '--step', 'end', '--event', 'end', '--status', 'ok', '--metric', 'skills_invoked=["plan-to-launch"]']);
  }
  let life = run(['telemetry', 'lifecycle', '--path', lifePath]);
  if (life.status !== 0) failures.push(`lifecycle (3 runs) failed: ${life.stderr || life.stdout}`);
  else if (JSON.parse(life.stdout).status !== 'insufficient_signal') failures.push('lifecycle below floor should report insufficient_signal');

  run(['telemetry', 'emit', '--path', lifePath, '--run-id', 'r4', '--workflow', 'pr-review', '--step', 'end', '--event', 'end', '--status', 'ok', '--metric', 'skills_invoked=["pr-review"]']);
  run(['telemetry', 'emit', '--path', lifePath, '--run-id', 'r5', '--workflow', 'pr-review', '--step', 'route', '--event', 'escalation', '--status', 'ok', '--metric', 'unmet_need=true', '--metric', 'unmet_need_note=no release workflow']);
  life = run(['telemetry', 'lifecycle', '--path', lifePath]);
  if (life.status !== 0) failures.push(`lifecycle (5 runs) failed: ${life.stderr || life.stdout}`);
  else {
    const out = JSON.parse(life.stdout);
    if (out.status !== 'ok') failures.push('lifecycle at floor should report ok');
    if (out.run_count !== 5) failures.push(`lifecycle run_count expected 5, got ${out.run_count}`);
    if (out.unmet_need_count !== 1) failures.push('lifecycle should count 1 unmet_need');
    if (!out.never_invoked_skills.includes('backprop')) failures.push('lifecycle should flag never-invoked backprop');
    if (out.skill_usage['pr-review'] !== 1) failures.push('lifecycle skill_usage wrong for pr-review');
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}

if (failures.length) {
  console.error('Telemetry CLI validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Telemetry CLI validated.');
