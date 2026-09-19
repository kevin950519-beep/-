#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { normalizeBrandReport } from '../../src/utils/brand-reports/index.js';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..', '..');
const REPORTS_ROOT = path.join(PROJECT_ROOT, 'public', 'brand-reports');
const GENERATED_STORIES_ROOT = path.join(
  PROJECT_ROOT,
  'src',
  'stories',
  'brand-reports',
  'generated',
);
const REGISTRY_PATH = path.join(REPORTS_ROOT, 'registry.json');

const REGISTRY_SCHEMA_VERSION = '1.0.0';
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp)$/i;
const REMOTE_OR_EMBEDDED_URL = /^(?:data:|https?:|blob:|\/\/)/i;

const STAGES = [
  {
    canonicalPath: 'outputs/source-brand-analysis.json',
    artifactType: 'source_brand_analysis',
    stage: 'source_brand_analysis',
    stageLabel: 'Stage 1 — Source Brand Analysis',
    idSuffix: 'source-analysis',
  },
  {
    canonicalPath: 'outputs/extended-brand-anatomy.json',
    artifactType: 'extended_brand_anatomy',
    stage: 'extended_brand_anatomy',
    stageLabel: 'Stage 2 — Extended Brand Anatomy',
    idSuffix: 'extended-anatomy',
  },
  {
    canonicalPath: 'outputs/landing-materials.json',
    artifactType: 'landing_materials',
    stage: 'landing_materials',
    stageLabel: 'Stage 3 — Landing Materials',
    idSuffix: 'landing-materials',
  },
];

const HELP = `Register a Stage 1, 2, or 3 brand report package for Storybook.

Usage:
  node scripts/brand-reports/register-brand-report.mjs <package-directory> [--id <report-id>]
  node scripts/brand-reports/register-brand-report.mjs <package-directory> [--id <report-id>] --check

Options:
  --id <report-id>  Stable lowercase URL/file slug. If omitted, one is derived.
  --check           Verify registered files without changing any file.
  -h, --help        Show this help.

Canonical inputs (exactly one must exist):
  outputs/source-brand-analysis.json
  outputs/extended-brand-anatomy.json
  outputs/landing-materials.json
`;

function fail(message) {
  throw new Error(message);
}

function parseArguments(argv) {
  const result = { packageDirectory: '', id: '', idWasExplicit: false, check: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--help' || argument === '-h') {
      return { help: true };
    }

    if (argument === '--') {
      continue;
    }

    if (argument === '--check') {
      if (result.check) fail('--check may be provided only once.');
      result.check = true;
      continue;
    }

    if (argument === '--id') {
      if (result.idWasExplicit) fail('--id may be provided only once.');
      const value = argv[index + 1];
      if (!value || value.startsWith('-')) fail('--id requires a value.');
      result.id = value;
      result.idWasExplicit = true;
      index += 1;
      continue;
    }

    if (argument.startsWith('--id=')) {
      if (result.idWasExplicit) fail('--id may be provided only once.');
      result.id = argument.slice('--id='.length);
      if (!result.id) fail('--id requires a value.');
      result.idWasExplicit = true;
      continue;
    }

    if (argument.startsWith('-')) fail(`Unknown option: ${argument}`);
    if (result.packageDirectory) fail('Provide exactly one package directory.');
    result.packageDirectory = argument;
  }

  if (!result.packageDirectory) fail('A Stage 1, 2, or 3 package directory is required.');
  return result;
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

function validateId(id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(
      `Invalid report id "${id}". Use lowercase ASCII letters, numbers, and single hyphens only.`,
    );
  }
  return id;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function jsonBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath, label) {
  let contents;
  try {
    contents = await readFile(filePath, 'utf8');
  } catch (error) {
    fail(`Cannot read ${label} at ${filePath}: ${error.message}`);
  }

  try {
    const parsed = JSON.parse(contents);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      fail(`${label} must contain a JSON object: ${filePath}`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) fail(`Invalid JSON in ${label} at ${filePath}: ${error.message}`);
    throw error;
  }
}

async function loadSourcePackage(packageArgument) {
  const requestedRoot = path.resolve(process.cwd(), packageArgument);
  let packageRoot;

  try {
    const details = await stat(requestedRoot);
    if (!details.isDirectory()) fail(`Package path is not a directory: ${requestedRoot}`);
    packageRoot = await realpath(requestedRoot);
  } catch (error) {
    if (error.message.startsWith('Package path')) throw error;
    fail(`Cannot access package directory ${requestedRoot}: ${error.message}`);
  }

  const matches = [];
  for (const stage of STAGES) {
    const canonicalFile = path.join(packageRoot, ...stage.canonicalPath.split('/'));
    if (await pathExists(canonicalFile)) matches.push({ stage, canonicalFile });
  }

  if (matches.length === 0) {
    fail(
      `No canonical Stage 1/2/3 JSON found under ${packageRoot}. Expected one of:\n${STAGES.map((item) => `- ${item.canonicalPath}`).join('\n')}`,
    );
  }
  if (matches.length > 1) {
    fail(
      `Package is ambiguous: found multiple canonical report JSON files:\n${matches.map((item) => `- ${item.stage.canonicalPath}`).join('\n')}`,
    );
  }

  const [{ stage, canonicalFile }] = matches;
  const report = await readJson(canonicalFile, 'canonical report JSON');
  if (report.artifact_type !== stage.artifactType) {
    fail(
      `Invalid artifact_type in ${canonicalFile}: expected "${stage.artifactType}", received ${JSON.stringify(report.artifact_type)}.`,
    );
  }

  const reviewPath = path.join(packageRoot, 'stage-review.json');
  const assetRegistryPath = path.join(packageRoot, 'asset-registry.json');
  const review = (await pathExists(reviewPath)) ? await readJson(reviewPath, 'stage review') : null;
  const assetRegistry = (await pathExists(assetRegistryPath))
    ? await readJson(assetRegistryPath, 'asset registry')
    : null;

  if (review) {
    if (review.artifact_type !== 'stage_review') {
      fail(`Invalid artifact_type in ${reviewPath}: expected "stage_review".`);
    }
    if (review.stage !== stage.stage) {
      fail(
        `Invalid stage in ${reviewPath}: expected "${stage.stage}", received ${JSON.stringify(review.stage)}.`,
      );
    }
  }

  if (!review) {
    fail(`Required stage review is missing: ${reviewPath}`);
  }
  if (stage.stage !== 'source_brand_analysis' && !assetRegistry) {
    fail(`Required asset registry is missing: ${assetRegistryPath}`);
  }

  if (assetRegistry) {
    const allowedType =
      stage.stage === 'landing_materials' ? 'landing_product_asset_registry' : 'brand_asset_registry';
    if (assetRegistry.artifact_type !== allowedType) {
      fail(
        `Invalid artifact_type in ${assetRegistryPath}: expected "${allowedType}", received ${JSON.stringify(assetRegistry.artifact_type)}.`,
      );
    }
    if (assetRegistry.stage && assetRegistry.stage !== stage.stage) {
      fail(
        `Invalid stage in ${assetRegistryPath}: expected "${stage.stage}", received ${JSON.stringify(assetRegistry.stage)}.`,
      );
    }
  }

  return {
    packageRoot,
    stage,
    report,
    review,
    assetRegistry,
    documents: [
      { name: 'report.json', sourcePath: canonicalFile, value: report },
      ...(review ? [{ name: 'review.json', sourcePath: reviewPath, value: review }] : []),
      ...(assetRegistry
        ? [{ name: 'asset-registry.json', sourcePath: assetRegistryPath, value: assetRegistry }]
        : []),
    ],
  };
}

function inferBrand(report, stage, packageRoot) {
  const candidates =
    stage.stage === 'source_brand_analysis'
      ? [report.brand?.name]
      : stage.stage === 'extended_brand_anatomy'
        ? [report.target?.working_name, report.brand?.name]
        : [
            report.brand?.name,
            report.target?.working_name,
            report.landing_narrative?.brand_name,
            report.product_introduction?.family_name,
          ];

  const brand = candidates.find((value) => typeof value === 'string' && value.trim())?.trim();
  return brand || path.basename(packageRoot);
}

function collectImageReferences(value, references) {
  if (typeof value === 'string') {
    const candidate = value.trim();
    if (
      candidate &&
      IMAGE_EXTENSION.test(candidate) &&
      !REMOTE_OR_EMBEDDED_URL.test(candidate) &&
      !candidate.startsWith('/brand-reports/')
    ) {
      references.add(candidate);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageReferences(item, references));
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectImageReferences(item, references));
  }
}

async function resolveImageReference(packageRoot, reference) {
  const requestedPath = path.isAbsolute(reference)
    ? path.normalize(reference)
    : path.resolve(packageRoot, reference.split('/').join(path.sep));

  let resolvedPath;
  try {
    resolvedPath = await realpath(requestedPath);
    const details = await stat(resolvedPath);
    if (!details.isFile()) fail(`Referenced image is not a file: ${reference}`);
  } catch (error) {
    if (error.message.startsWith('Referenced image')) throw error;
    fail(`Referenced local image does not exist: ${reference} (resolved as ${requestedPath})`);
  }

  if (!isWithin(packageRoot, resolvedPath)) {
    fail(`Referenced image escapes the source package: ${reference} -> ${resolvedPath}`);
  }

  return resolvedPath;
}

function safeAssetStem(filePath) {
  const extension = path.extname(filePath);
  return (
    slugify(path.basename(filePath, extension)) ||
    `asset-${sha256(path.basename(filePath)).slice(0, 8)}`
  );
}

function rewriteStrings(value, replacements) {
  if (typeof value === 'string') return replacements.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => rewriteStrings(item, replacements));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteStrings(item, replacements)]),
    );
  }
  return value;
}

async function preparePackage(sourcePackage, id) {
  const references = new Set();
  sourcePackage.documents.forEach((document) => collectImageReferences(document.value, references));

  const replacementMap = new Map();
  const assetsByOutputName = new Map();

  for (const reference of [...references].sort((left, right) => left.localeCompare(right, 'en'))) {
    const sourcePath = await resolveImageReference(sourcePackage.packageRoot, reference);
    const contents = await readFile(sourcePath);
    const digest = sha256(contents);
    const extension = path.extname(sourcePath).toLowerCase();
    const outputName = `${safeAssetStem(sourcePath)}-${digest}${extension}`;
    const existing = assetsByOutputName.get(outputName);

    if (existing && existing.digest !== digest) {
      fail(`Asset output collision for ${reference}. Refusing to overwrite ${outputName}.`);
    }

    assetsByOutputName.set(outputName, { sourcePath, contents, digest });
    replacementMap.set(reference, `/brand-reports/${id}/assets/${outputName}`);
  }

  const files = new Map();
  for (const document of sourcePackage.documents) {
    files.set(document.name, jsonBytes(rewriteStrings(document.value, replacementMap)));
  }
  for (const [outputName, asset] of [...assetsByOutputName.entries()].sort(([left], [right]) =>
    left.localeCompare(right, 'en'),
  )) {
    files.set(`assets/${outputName}`, asset.contents);
  }

  const digestInput = [...files.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'en'))
    .map(([relativePath, contents]) => `${relativePath}\0${sha256(contents)}`)
    .join('\n');

  return {
    files,
    packageSha256: sha256(digestInput),
    assetCount: assetsByOutputName.size,
  };
}

function buildStory(id, brand, stageLabel) {
  const title = `Brand Reports/${brand.replaceAll('/', '／')}/${stageLabel}`;
  return `import { RegisteredBrandReport } from '../RegisteredBrandReport.jsx';

const meta = {
  title: ${JSON.stringify(title)},
  component: RegisteredBrandReport,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Docs = {
  args: {
    reportId: ${JSON.stringify(id)},
  },
};
`;
}

function buildRegistryEntry({ id, brand, sourcePackage, prepared }) {
  const baseUrl = `/brand-reports/${id}`;
  return {
    id,
    brand,
    stage: sourcePackage.stage.stage,
    stage_label: sourcePackage.stage.stageLabel,
    artifact_type: sourcePackage.stage.artifactType,
    schema_version: sourcePackage.report.schema_version ?? null,
    report_url: `${baseUrl}/report.json`,
    review_url: sourcePackage.review ? `${baseUrl}/review.json` : null,
    asset_registry_url: sourcePackage.assetRegistry ? `${baseUrl}/asset-registry.json` : null,
    story_path: `src/stories/brand-reports/generated/${id}.stories.jsx`,
    package_sha256: prepared.packageSha256,
  };
}

function emptyRegistry() {
  return {
    schema_version: REGISTRY_SCHEMA_VERSION,
    artifact_type: 'brand_report_registry',
    reports: [],
  };
}

async function loadRegistry({ required }) {
  if (!(await pathExists(REGISTRY_PATH))) {
    if (required) fail(`Brand report registry is missing: ${REGISTRY_PATH}`);
    return emptyRegistry();
  }

  const registry = await readJson(REGISTRY_PATH, 'brand report registry');
  if (
    registry.artifact_type !== 'brand_report_registry' ||
    registry.schema_version !== REGISTRY_SCHEMA_VERSION ||
    !Array.isArray(registry.reports)
  ) {
    fail(
      `Invalid registry contract at ${REGISTRY_PATH}; expected brand_report_registry schema ${REGISTRY_SCHEMA_VERSION}.`,
    );
  }

  const seen = new Set();
  for (const item of registry.reports) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string') {
      fail(`Invalid report entry in ${REGISTRY_PATH}.`);
    }
    if (seen.has(item.id)) fail(`Duplicate report id "${item.id}" in ${REGISTRY_PATH}.`);
    seen.add(item.id);
  }

  return registry;
}

function updateRegistry(registry, entry, idWasExplicit) {
  const existing = registry.reports.find((item) => item.id === entry.id);
  if (
    existing &&
    !idWasExplicit &&
    (existing.brand !== entry.brand || existing.artifact_type !== entry.artifact_type)
  ) {
    fail(
      `Derived id "${entry.id}" is already registered to a different report. Re-run with a unique explicit --id.`,
    );
  }

  const reports = registry.reports
    .filter((item) => item.id !== entry.id)
    .concat(entry)
    .sort((left, right) => left.id.localeCompare(right.id, 'en'));

  return {
    schema_version: REGISTRY_SCHEMA_VERSION,
    artifact_type: 'brand_report_registry',
    reports,
  };
}

async function ensureOutputRootsSafe(sourceRoot) {
  const projectRootReal = await realpath(PROJECT_ROOT);
  for (const outputRoot of [REPORTS_ROOT, GENERATED_STORIES_ROOT]) {
    if (isWithin(sourceRoot, outputRoot)) {
      fail(
        `Refusing to register because output directory ${outputRoot} is inside the source package ${sourceRoot}.`,
      );
    }
    await mkdir(outputRoot, { recursive: true });
    const outputRootReal = await realpath(outputRoot);
    if (!isWithin(projectRootReal, outputRootReal)) {
      fail(`Output directory resolves outside the project root: ${outputRoot} -> ${outputRootReal}`);
    }
    if (isWithin(sourceRoot, outputRootReal)) {
      fail(
        `Refusing to register because resolved output directory ${outputRootReal} is inside the source package ${sourceRoot}.`,
      );
    }
  }
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

async function captureFile(filePath) {
  if (!(await pathExists(filePath))) return { existed: false, contents: null };
  return { existed: true, contents: await readFile(filePath) };
}

async function restoreFile(filePath, snapshot) {
  if (snapshot.existed) {
    await writeAtomic(filePath, snapshot.contents);
  } else {
    await rm(filePath, { force: true });
  }
}

async function register({ sourcePackage, id, idWasExplicit, brand, prepared, story }) {
  await ensureOutputRootsSafe(sourcePackage.packageRoot);
  const registry = await loadRegistry({ required: false });
  const entry = buildRegistryEntry({ id, brand, sourcePackage, prepared });
  const nextRegistry = updateRegistry(registry, entry, idWasExplicit);
  const destination = path.join(REPORTS_ROOT, id);
  const storyPath = path.join(GENERATED_STORIES_ROOT, `${id}.stories.jsx`);
  if (isWithin(sourcePackage.packageRoot, destination) || isWithin(sourcePackage.packageRoot, storyPath)) {
    fail(`Refusing to overwrite a path inside the source package ${sourcePackage.packageRoot}.`);
  }
  const temporaryPackage = await mkdtemp(path.join(REPORTS_ROOT, '.register-'));
  const backupPackage = path.join(REPORTS_ROOT, `.backup-${id}-${process.pid}-${randomUUID()}`);
  const registrySnapshot = await captureFile(REGISTRY_PATH);
  const storySnapshot = await captureFile(storyPath);
  let destinationBackedUp = false;
  let destinationCommitted = false;
  let registrationSucceeded = false;

  try {
    await mkdir(path.join(temporaryPackage, 'assets'), { recursive: true });
    for (const [relativePath, contents] of [...prepared.files.entries()].sort(([left], [right]) =>
      left.localeCompare(right, 'en'),
    )) {
      const outputPath = path.join(temporaryPackage, ...relativePath.split('/'));
      if (!isWithin(temporaryPackage, outputPath)) fail(`Unsafe output path: ${relativePath}`);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, contents, { flag: 'wx' });
    }

    if (await pathExists(destination)) {
      await rename(destination, backupPackage);
      destinationBackedUp = true;
    }
    await rename(temporaryPackage, destination);
    destinationCommitted = true;

    await writeAtomic(REGISTRY_PATH, jsonBytes(nextRegistry));
    await writeAtomic(storyPath, story);

    if (destinationBackedUp) await rm(backupPackage, { recursive: true, force: true });
    registrationSucceeded = true;
    return entry;
  } catch (error) {
    const rollbackErrors = [];
    await restoreFile(REGISTRY_PATH, registrySnapshot).catch((rollbackError) => {
      rollbackErrors.push(`registry restore failed: ${rollbackError.message}`);
    });
    await restoreFile(storyPath, storySnapshot).catch((rollbackError) => {
      rollbackErrors.push(`story restore failed: ${rollbackError.message}`);
    });
    if (destinationCommitted) {
      await rm(destination, { recursive: true, force: true }).catch((rollbackError) => {
        rollbackErrors.push(`new package cleanup failed: ${rollbackError.message}`);
      });
    }
    if (destinationBackedUp && (await pathExists(backupPackage))) {
      await rename(backupPackage, destination).catch((rollbackError) => {
        rollbackErrors.push(
          `previous package remains at ${backupPackage}; restore failed: ${rollbackError.message}`,
        );
      });
    }
    if (rollbackErrors.length > 0) {
      error.message = `${error.message}\nRollback warning:\n- ${rollbackErrors.join('\n- ')}`;
    }
    throw error;
  } finally {
    await rm(temporaryPackage, { recursive: true, force: true });
    if (registrationSucceeded) await rm(backupPackage, { recursive: true, force: true });
  }
}

async function listFiles(directory, prefix = '') {
  const items = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const item of items.sort((left, right) => left.name.localeCompare(right.name, 'en'))) {
    const relativePath = prefix ? `${prefix}/${item.name}` : item.name;
    const absolutePath = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...(await listFiles(absolutePath, relativePath)));
    else if (item.isFile()) files.push(relativePath);
    else fail(`Registered package contains a non-file entry: ${absolutePath}`);
  }
  return files;
}

function equalJson(left, right) {
  const normalize = (value) => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.keys(value)
          .sort((first, second) => first.localeCompare(second, 'en'))
          .map((key) => [key, normalize(value[key])]),
      );
    }
    return value;
  };

  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

async function checkRegistration({ sourcePackage, id, brand, prepared, story }) {
  const errors = [];
  const destination = path.join(REPORTS_ROOT, id);
  const storyPath = path.join(GENERATED_STORIES_ROOT, `${id}.stories.jsx`);
  const expectedPaths = [...prepared.files.keys()].sort((left, right) => left.localeCompare(right, 'en'));

  if (!(await pathExists(destination))) {
    errors.push(`Missing registered package: ${destination}`);
  } else {
    let actualPaths = [];
    try {
      actualPaths = await listFiles(destination);
    } catch (error) {
      errors.push(error.message);
    }

    if (!equalJson(actualPaths, expectedPaths)) {
      errors.push(
        `Registered package file set differs. Expected [${expectedPaths.join(', ')}], received [${actualPaths.join(', ')}].`,
      );
    }

    for (const [relativePath, expectedContents] of prepared.files.entries()) {
      const actualPath = path.join(destination, ...relativePath.split('/'));
      if (!(await pathExists(actualPath))) continue;
      const actualContents = await readFile(actualPath);
      if (!actualContents.equals(expectedContents)) errors.push(`Content mismatch: ${actualPath}`);
    }
  }

  let registry;
  try {
    registry = await loadRegistry({ required: true });
  } catch (error) {
    errors.push(error.message);
  }
  if (registry) {
    const expectedEntry = buildRegistryEntry({ id, brand, sourcePackage, prepared });
    const actualEntry = registry.reports.find((item) => item.id === id);
    if (!actualEntry) errors.push(`Registry has no report entry for id "${id}".`);
    else if (!equalJson(actualEntry, expectedEntry)) errors.push(`Registry entry mismatch for id "${id}".`);
    const orderedIds = registry.reports.map((item) => item.id);
    const sortedIds = [...orderedIds].sort((left, right) => left.localeCompare(right, 'en'));
    if (!equalJson(orderedIds, sortedIds)) errors.push('Registry reports are not deterministically sorted by id.');
  }

  if (!(await pathExists(storyPath))) {
    errors.push(`Missing generated story: ${storyPath}`);
  } else {
    const actualStory = await readFile(storyPath, 'utf8');
    if (actualStory !== story) errors.push(`Generated story mismatch: ${storyPath}`);
  }

  if (errors.length > 0) {
    fail(`Registration check failed for "${id}":\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP);
    return;
  }

  const sourcePackage = await loadSourcePackage(options.packageDirectory);
  const brand = inferBrand(sourcePackage.report, sourcePackage.stage, sourcePackage.packageRoot);
  const fallbackBrandSlug = `brand-${sha256(brand).slice(0, 8)}`;
  const id = validateId(options.id || `${slugify(brand) || fallbackBrandSlug}-${sourcePackage.stage.idSuffix}`);
  try {
    normalizeBrandReport(sourcePackage.report, {
      review: sourcePackage.review,
      assetRegistry: sourcePackage.assetRegistry,
      publicBasePath: `/brand-reports/${id}`,
    });
  } catch (error) {
    fail(`Fixed React report contract failed: ${error.message}`);
  }
  const prepared = await preparePackage(sourcePackage, id);
  const story = buildStory(id, brand, sourcePackage.stage.stageLabel);

  if (options.check) {
    await checkRegistration({ sourcePackage, id, brand, prepared, story });
    process.stdout.write(
      `PASS ${id}: registered package, ${prepared.assetCount} asset(s), registry, and generated story match.\n`,
    );
    return;
  }

  const entry = await register({
    sourcePackage,
    id,
    idWasExplicit: options.idWasExplicit,
    brand,
    prepared,
    story,
  });
  process.stdout.write(
    `Registered ${entry.id} (${entry.stage_label}) with ${prepared.assetCount} asset(s).\n` +
      `Report: ${entry.report_url}\n` +
      `Story: ${entry.story_path}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`ERROR: ${error.message}\n`);
  process.exitCode = 1;
});
