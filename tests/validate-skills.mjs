import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

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
const requiredDocReferenceFiles = [
  'references/standards.md',
  'references/templates/prd-template.md',
  'references/templates/design-doc-template.md',
  'references/templates/technical-plan-template.md',
  'references/templates/adr-template.md',
  'references/templates/roadmap-template.md',
  'references/templates/rca-template.md',
];

const failures = [];

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

const docSkill = await readFile(join(skillsDir, 'structured-doc-authoring', 'SKILL.md'), 'utf8');
for (const token of ['references/standards.md', 'prd-template.md', 'design-doc-template.md', 'technical-plan-template.md', 'adr-template.md', 'roadmap-template.md', 'rca-template.md']) {
  if (!docSkill.includes(token)) failures.push(`structured-doc-authoring: missing reference to ${token}`);
}

for (const relativePath of requiredDocReferenceFiles) {
  const text = await readFile(join(skillsDir, 'structured-doc-authoring', relativePath), 'utf8');
  if (text.length < 1000) failures.push(`structured-doc-authoring: ${relativePath} looks too small`);
}

const standards = await readFile(join(skillsDir, 'structured-doc-authoring', 'references/standards.md'), 'utf8');
for (const token of ['SPADE', 'Evidence Standard', 'Review Gate Standard', 'PRD', 'Roadmap', 'RCA']) {
  if (!standards.includes(token)) failures.push(`structured-doc-authoring standards: missing ${token}`);
}

const manifest = JSON.parse(await readFile(join(root, 'autopraxis.json'), 'utf8'));
if (manifest.name !== 'autopraxis') failures.push('manifest: name must be autopraxis');
const manifestSkillNames = manifest.skills.map((skill) => skill.name).sort();
if (JSON.stringify(manifestSkillNames) !== JSON.stringify(dirs)) {
  failures.push(`manifest: skill list does not match skills directory (${manifestSkillNames.join(',')} vs ${dirs.join(',')})`);
}
for (const skill of manifest.skills) {
  if (!existsSync(join(root, skill.path, 'SKILL.md'))) failures.push(`manifest: ${skill.name} path missing SKILL.md`);
  if (!['workflow', 'shared'].includes(skill.kind)) failures.push(`manifest: ${skill.name} has invalid kind ${skill.kind}`);
}
for (const target of ['mewrite', 'claude-code', 'generic-markdown', 'cursor-rules', 'windsurf-rules']) {
  if (!manifest.installTargets[target]) failures.push(`manifest: missing install target ${target}`);
}
for (const integration of ['agent-fleet', 'long-term-memory-mcp', 'code-rag', 'run-telemetry']) {
  if (!manifest.optionalIntegrations.some((item) => item.name === integration)) failures.push(`manifest: missing optional integration ${integration}`);
}
for (const exclude of ['.git/**', 'node_modules/**', '.workflow-runs/**', '.env']) {
  if (!manifest.package.exclude.includes(exclude)) failures.push(`manifest package.exclude missing ${exclude}`);
}

const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (packageJson.bin?.autopraxis !== 'bin/autopraxis.mjs') failures.push('package.json: missing autopraxis bin');
for (const file of ['README.md', 'INSTALL.md', 'autopraxis.json', 'bin/', 'examples/', 'skills/']) {
  if (!packageJson.files.includes(file)) failures.push(`package.json: files missing ${file}`);
}

const markdownFiles = [
  'README.md',
  'INSTALL.md',
  ...await listFiles(skillsDir, 'skills').then((files) => files.filter((file) => file.endsWith('.md'))),
  ...await listFiles(join(root, 'examples'), 'examples').then((files) => files.filter((file) => file.endsWith('.md'))),
];
for (const relativeFile of markdownFiles) {
  const text = await readFile(join(root, relativeFile), 'utf8');
  const linkPattern = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const rawTarget = match[1].split('#')[0].trim();
    if (!rawTarget || rawTarget.startsWith('<') || rawTarget.includes(' ')) continue;
    const target = normalize(join(root, dirname(relativeFile), rawTarget));
    if (!target.startsWith(normalize(root))) failures.push(`${relativeFile}: link escapes repo: ${match[1]}`);
    else if (!existsSync(target)) failures.push(`${relativeFile}: broken relative link ${match[1]}`);
  }
}

const packageValidation = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'validate-package'], { cwd: root, encoding: 'utf8' });
if (packageValidation.status !== 0) failures.push(`validate-package failed: ${packageValidation.stderr || packageValidation.stdout}`);

const tempRoot = await mkdtemp(join(tmpdir(), 'autopraxis-install-'));
try {
  const install = spawnSync(process.execPath, ['bin/autopraxis.mjs', 'install', '--target', 'mewrite', '--dest', tempRoot], { cwd: root, encoding: 'utf8' });
  if (install.status !== 0) failures.push(`install smoke failed: ${install.stderr || install.stdout}`);
  for (const dir of dirs) {
    if (!existsSync(join(tempRoot, dir, 'SKILL.md'))) failures.push(`install smoke missing ${dir}/SKILL.md`);
  }
  for (const relativePath of requiredDocReferenceFiles) {
    if (!existsSync(join(tempRoot, 'structured-doc-authoring', relativePath))) failures.push(`install smoke missing structured-doc-authoring/${relativePath}`);
  }
  if (!existsSync(join(tempRoot, '_autopraxis-plugin.json'))) failures.push('install smoke missing _autopraxis-plugin.json');
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error('Skill validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${dirs.length} skills and plugin package.`);
