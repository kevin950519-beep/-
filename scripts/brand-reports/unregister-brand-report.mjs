#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..', '..');
const REPORTS_ROOT = path.join(PROJECT_ROOT, 'public', 'brand-reports');
const GENERATED_STORIES_ROOT = path.join(PROJECT_ROOT, 'src', 'stories', 'brand-reports', 'generated');
const REGISTRY_PATH = path.join(REPORTS_ROOT, 'registry.json');

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  const options = { id: '', check: false, dryRun: false };
  for (const argument of argv) {
    if (argument === '--') continue;
    if (argument === '--check') {
      options.check = true;
      continue;
    }
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (argument.startsWith('-')) fail(`Unknown option: ${argument}`);
    if (options.id) fail('Provide exactly one report id.');
    options.id = argument;
  }
  if (!options.id) fail('A report id is required.');
  if (options.check && options.dryRun) fail('--check and --dry-run cannot be combined.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.id)) {
    fail(`Invalid report id "${options.id}".`);
  }
  return options;
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return relative && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function readRegistry() {
  let registry;
  try {
    registry = JSON.parse(await readFile(REGISTRY_PATH, 'utf8'));
  } catch (error) {
    fail(`Cannot read brand-report registry at ${REGISTRY_PATH}: ${error.message}`);
  }
  if (
    registry?.artifact_type !== 'brand_report_registry'
    || registry?.schema_version !== '1.0.0'
    || !Array.isArray(registry?.reports)
  ) {
    fail(`Invalid brand-report registry contract at ${REGISTRY_PATH}.`);
  }
  return registry;
}

async function writeAtomic(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporaryPath, contents, { flag: 'wx' });
    await rename(temporaryPath, filePath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

async function checkAbsent(id, registry, packagePath, storyPath) {
  const problems = [];
  if (registry.reports.some((item) => item.id === id)) problems.push('registry entry still exists');
  if (await pathExists(packagePath)) problems.push('registered package still exists');
  if (await pathExists(storyPath)) problems.push('generated story still exists');
  if (problems.length) fail(`Unregister check failed for "${id}": ${problems.join(', ')}.`);
  process.stdout.write(`PASS ${id}: registry entry, registered package, and generated story are absent.\n`);
}

async function unregister(id, registry, packagePath, storyPath) {
  const entry = registry.reports.find((item) => item.id === id);
  if (!entry) fail(`Registry has no report entry for id "${id}".`);

  const packageBackup = path.join(REPORTS_ROOT, `.unregister-${id}-${process.pid}-${randomUUID()}`);
  const storyBackup = path.join(
    GENERATED_STORIES_ROOT,
    `.unregister-${id}-${process.pid}-${randomUUID()}.stories.jsx`,
  );
  const registrySnapshot = await readFile(REGISTRY_PATH);
  let packageMoved = false;
  let storyMoved = false;
  let registryCommitted = false;

  try {
    if (await pathExists(packagePath)) {
      await rename(packagePath, packageBackup);
      packageMoved = true;
    }
    if (await pathExists(storyPath)) {
      await rename(storyPath, storyBackup);
      storyMoved = true;
    }
    const nextRegistry = {
      ...registry,
      reports: registry.reports.filter((item) => item.id !== id),
    };
    await writeAtomic(REGISTRY_PATH, `${JSON.stringify(nextRegistry, null, 2)}\n`);
    registryCommitted = true;
  } catch (error) {
    if (!registryCommitted) await writeAtomic(REGISTRY_PATH, registrySnapshot);
    if (storyMoved && await pathExists(storyBackup)) await rename(storyBackup, storyPath);
    if (packageMoved && await pathExists(packageBackup)) await rename(packageBackup, packagePath);
    throw error;
  }

  const warnings = [];
  if (packageMoved) {
    await rm(packageBackup, { recursive: true, force: true }).catch((error) => warnings.push(error.message));
  }
  if (storyMoved) {
    await rm(storyBackup, { force: true }).catch((error) => warnings.push(error.message));
  }
  process.stdout.write(`UNREGISTERED ${id}\n`);
  process.stdout.write('Source Stage packages were not modified. Re-run finalization to restore this report.\n');
  if (warnings.length) process.stderr.write(`Cleanup warning: ${warnings.join('; ')}\n`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const registry = await readRegistry();
  const packagePath = path.join(REPORTS_ROOT, options.id);
  const storyPath = path.join(GENERATED_STORIES_ROOT, `${options.id}.stories.jsx`);
  if (!isWithin(REPORTS_ROOT, packagePath) || !isWithin(GENERATED_STORIES_ROOT, storyPath)) {
    fail('Resolved unregister target is outside the generated report roots.');
  }
  if (options.check) {
    await checkAbsent(options.id, registry, packagePath, storyPath);
    return;
  }
  if (options.dryRun) {
    const entry = registry.reports.find((item) => item.id === options.id);
    if (!entry) fail(`Registry has no report entry for id "${options.id}".`);
    process.stdout.write(`WOULD_UNREGISTER ${options.id}\n${packagePath}\n${storyPath}\n`);
    return;
  }
  await unregister(options.id, registry, packagePath, storyPath);
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.message}\n`);
  process.exitCode = 1;
});
