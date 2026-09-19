#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  access,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..', '..');
const REGISTER_SCRIPT = path.join(SCRIPT_DIRECTORY, 'register-brand-report.mjs');
const REGISTRY_PATH = path.join(PROJECT_ROOT, 'public', 'brand-reports', 'registry.json');
const RECEIPT_NAME = 'registration-receipt.json';
const RECEIPT_SCHEMA_VERSION = '1.0.0';

const STAGES = [
  {
    canonicalPath: 'outputs/source-brand-analysis.json',
    stage: 'source_brand_analysis',
    validator: '.agents/skills/research-brand-anatomy/scripts/validate_analysis.py',
    validatorArguments: ['all'],
  },
  {
    canonicalPath: 'outputs/extended-brand-anatomy.json',
    stage: 'extended_brand_anatomy',
    validator: '.agents/skills/build-brand-from-anatomy/scripts/validate_extended.py',
    validatorArguments: ['current'],
  },
  {
    canonicalPath: 'outputs/landing-materials.json',
    stage: 'landing_materials',
    validator: '.agents/skills/build-landing-materials/scripts/validate_landing.py',
    validatorArguments: [],
  },
];

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  const result = { packageDirectory: '', id: '', check: false, registrationOnly: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--check') {
      result.check = true;
      continue;
    }
    if (argument === '--registration-only') {
      result.registrationOnly = true;
      continue;
    }
    if (argument === '--id') {
      const value = argv[index + 1];
      if (!value || value.startsWith('-')) fail('--id requires a value.');
      result.id = value;
      index += 1;
      continue;
    }
    if (argument.startsWith('--id=')) {
      result.id = argument.slice('--id='.length);
      continue;
    }
    if (argument.startsWith('-')) fail(`Unknown option: ${argument}`);
    if (result.packageDirectory) fail('Provide exactly one package directory.');
    result.packageDirectory = argument;
  }
  if (!result.packageDirectory) fail('A Stage package directory is required.');
  return result;
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, { capture = false, echo = true } = {}) {
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  });
  if (result.error) fail(`${command} failed to start: ${result.error.message}`);
  if (result.status !== 0) {
    if (capture && result.stdout) process.stdout.write(result.stdout);
    if (capture && result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  if (capture && echo && result.stdout) process.stdout.write(result.stdout);
  if (capture && echo && result.stderr) process.stderr.write(result.stderr);
  return result.stdout || '';
}

function startTimer() {
  return process.hrtime.bigint();
}

function elapsedMilliseconds(startedAt) {
  return Math.max(
    0,
    Math.round(Number(process.hrtime.bigint() - startedAt) / 1_000_000),
  );
}

function durationLabel(value) {
  return value === null ? 'skipped' : `${value}ms`;
}

async function readJson(filePath, label) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read ${label} at ${filePath}: ${error.message}`);
  }
}

async function readReceipt(packageRoot, stage, { required = false } = {}) {
  const receiptPath = path.join(packageRoot, RECEIPT_NAME);
  if (!(await pathExists(receiptPath))) {
    if (required) fail(`Registration receipt is missing: ${receiptPath}`);
    return null;
  }
  const receipt = await readJson(receiptPath, 'registration receipt');
  if (
    receipt?.artifact_type !== 'brand_report_registration_receipt'
    || receipt?.schema_version !== RECEIPT_SCHEMA_VERSION
    || receipt?.stage !== stage.stage
    || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(receipt?.report_id || ''))
  ) {
    fail(`Invalid registration receipt contract at ${receiptPath}.`);
  }
  return receipt;
}

async function writeAtomic(filePath, contents) {
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

async function registryEntry(reportId) {
  const registry = await readJson(REGISTRY_PATH, 'brand-report registry');
  const entry = Array.isArray(registry?.reports)
    ? registry.reports.find((item) => item?.id === reportId)
    : null;
  if (!entry) fail(`Registered report is missing from registry: ${reportId}`);
  return entry;
}

async function writeReceipt(packageRoot, stage, reportId) {
  const entry = await registryEntry(reportId);
  const review = await readJson(path.join(packageRoot, 'stage-review.json'), 'stage review');
  const receipt = {
    schema_version: RECEIPT_SCHEMA_VERSION,
    artifact_type: 'brand_report_registration_receipt',
    stage: stage.stage,
    report_id: reportId,
    package_sha256: entry.package_sha256,
    review_status: review.status,
    finalized_at: new Date().toISOString(),
  };
  await writeAtomic(
    path.join(packageRoot, RECEIPT_NAME),
    `${JSON.stringify(receipt, null, 2)}\n`,
  );
}

function reportIdFromOutput(output) {
  const match = output.match(/^Registered ([a-z0-9]+(?:-[a-z0-9]+)*) /m);
  if (!match) fail('Registration completed without a machine-readable report id.');
  return match[1];
}

async function identifyStage(packageDirectory) {
  const packageRoot = path.resolve(process.cwd(), packageDirectory);
  const details = await stat(packageRoot).catch(() => null);
  if (!details?.isDirectory()) fail(`Package directory does not exist: ${packageRoot}`);
  const matches = [];
  for (const stage of STAGES) {
    if (await pathExists(path.join(packageRoot, stage.canonicalPath))) matches.push(stage);
  }
  if (matches.length !== 1) {
    fail(`Expected exactly one canonical Stage JSON under ${packageRoot}; found ${matches.length}.`);
  }
  return { packageRoot, stage: matches[0] };
}

async function main() {
  const totalStartedAt = startTimer();
  const options = parseArguments(process.argv.slice(2));
  const { packageRoot, stage } = await identifyStage(options.packageDirectory);
  const validatorPath = path.join(PROJECT_ROOT, stage.validator);
  const receipt = await readReceipt(packageRoot, stage, { required: options.registrationOnly });
  if (receipt && options.id && receipt.report_id !== options.id) {
    fail(`Report id is locked to ${receipt.report_id}; received ${options.id}.`);
  }
  const lockedId = receipt?.report_id || options.id;
  let validationMilliseconds = null;

  if (!options.registrationOnly) {
    const validationStartedAt = startTimer();
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    run(pythonCommand, [validatorPath, packageRoot, ...stage.validatorArguments], {
      capture: true,
      echo: false,
    });
    validationMilliseconds = elapsedMilliseconds(validationStartedAt);
  }

  const registerArguments = [REGISTER_SCRIPT, packageRoot];
  if (lockedId) registerArguments.push('--id', lockedId);
  if (options.check) {
    const driftCheckStartedAt = startTimer();
    run('node', [...registerArguments, '--check'], { capture: true, echo: false });
    const driftCheckMilliseconds = elapsedMilliseconds(driftCheckStartedAt);
    process.stdout.write(
      `CHECKED stage=${stage.stage} report=${lockedId || 'derived'} `
      + `validation=${durationLabel(validationMilliseconds)} registration=skipped `
      + `drift_check=${driftCheckMilliseconds}ms total=${elapsedMilliseconds(totalStartedAt)}ms `
      + `package=${packageRoot}\n`,
    );
    return;
  }

  const registrationStartedAt = startTimer();
  const output = run('node', registerArguments, { capture: true, echo: false });
  const registrationMilliseconds = elapsedMilliseconds(registrationStartedAt);
  const reportId = lockedId || reportIdFromOutput(output);
  const driftCheckStartedAt = startTimer();
  run('node', [REGISTER_SCRIPT, packageRoot, '--id', reportId, '--check'], {
    capture: true,
    echo: false,
  });
  const driftCheckMilliseconds = elapsedMilliseconds(driftCheckStartedAt);
  await writeReceipt(packageRoot, stage, reportId);
  process.stdout.write(
    `FINALIZED stage=${stage.stage} report=${reportId} `
    + `validation=${durationLabel(validationMilliseconds)} `
    + `registration=${registrationMilliseconds}ms drift_check=${driftCheckMilliseconds}ms `
    + `total=${elapsedMilliseconds(totalStartedAt)}ms package=${packageRoot}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.message}\n`);
  process.exitCode = 1;
});
