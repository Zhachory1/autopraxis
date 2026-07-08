import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const skillsDir = join(root, 'skills');
const workflowSkills = new Set([
  'dev-workflow',
  'ml-experiments',
  'pr-review',
  'debug-investigation',
  'project-ideation',
  'roadmapping',
  'backprop',
]);
const sharedSkillNames = [
  'grounding-brief',
  'council-review',
  'success-criteria-metrics',
  'task-decomposition-planning',
  'hypothesis-testing',
  'structured-doc-authoring',
  'handoff-packaging',
  'human-approval-gate',
  'run-telemetry',
];

const failures = [];
const dirs = (await readdir(skillsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (dirs.length < 16) failures.push(`expected at least 16 skills, found ${dirs.length}`);

for (const dir of dirs) {
  const file = join(skillsDir, dir, 'SKILL.md');
  const text = await readFile(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    failures.push(`${dir}: missing YAML frontmatter`);
    continue;
  }

  const frontmatter = match[1];
  const body = text.slice(match[0].length);
  const name = frontmatter.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter.match(/^description:\s*"([\s\S]*?)"\s*$/m)?.[1];

  if (name !== dir) failures.push(`${dir}: frontmatter name ${name ?? '<missing>'} does not match directory`);
  if (!description) failures.push(`${dir}: missing quoted description`);
  if (description && description.length > 1024) failures.push(`${dir}: description exceeds 1024 chars (${description.length})`);
  if (!body.includes('## Self-Improvement')) failures.push(`${dir}: missing Self-Improvement section`);
  if (/^\s*\d+[.)]\s+/m.test(body)) failures.push(`${dir}: ordered-list prose found; use bullets/bold headers`);
  if (!body.includes('run-telemetry')) failures.push(`${dir}: missing run-telemetry integration`);
}

for (const dir of workflowSkills) {
  const text = await readFile(join(skillsDir, dir, 'SKILL.md'), 'utf8');
  for (const token of ['grounding-brief', 'handoff-packaging', 'human-approval-gate']) {
    if (!text.includes(token)) failures.push(`${dir}: missing workflow connective skill ${token}`);
  }
  if (!text.includes('Loop Controls')) failures.push(`${dir}: missing Loop Controls section`);
}

const dev = await readFile(join(skillsDir, 'dev-workflow', 'SKILL.md'), 'utf8');
for (const token of ['council-review', 'ship', 'code-reviewer', 'PRD', 'DD']) {
  if (!dev.includes(token)) failures.push(`dev-workflow: missing ${token}`);
}

const backprop = await readFile(join(skillsDir, 'backprop', 'SKILL.md'), 'utf8');
for (const token of ['long-term memory MCP', 'code RAG', 'agent-fleet', 'A/B', 'promote-or-rollback']) {
  if (!backprop.includes(token)) failures.push(`backprop: missing ${token}`);
}

const council = await readFile(join(skillsDir, 'council-review', 'SKILL.md'), 'utf8');
for (const token of ['AGENT_FLEET_HOME', '/Users/zhach/code/agent-fleet', 'pass-with-nits', 'block']) {
  if (!council.includes(token)) failures.push(`council-review: missing ${token}`);
}

if (failures.length) {
  console.error('Skill validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${dirs.length} skills.`);
