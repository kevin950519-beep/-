#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(SCRIPT_DIRECTORY, '..', '..');
const FIXTURE_ROOT = path.join(SOURCE_ROOT, 'tests', 'fixtures', 'brand-reports');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function run(projectRoot, command, args, { expectedStatus = 0 } = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });
  const status = result.status ?? 1;
  if (status !== expectedStatus) {
    throw new Error([
      `Expected exit ${expectedStatus}, received ${status}: ${command} ${args.join(' ')}`,
      result.stdout,
      result.stderr,
    ].filter(Boolean).join('\n'));
  }
  return `${result.stdout}${result.stderr}`;
}

function runAsync(projectRoot, command, args, { expectedStatus = 0 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (status) => {
      if ((status ?? 1) !== expectedStatus) {
        reject(new Error([
          `Expected exit ${expectedStatus}, received ${status}: ${command} ${args.join(' ')}`,
          stdout,
          stderr,
        ].filter(Boolean).join('\n')));
        return;
      }
      resolve(`${stdout}${stderr}`);
    });
  });
}

const FAKE_WORKER_SOURCE = String.raw`
const { writeFileSync } = require('node:fs');
const [resultPath, stage, jobId, delay] = process.argv.slice(1);
setTimeout(() => {
  writeFileSync(resultPath, JSON.stringify({
    schema_version: '1.0.0',
    artifact_type: 'brand_pipeline_job_result',
    stage,
    job_id: jobId,
    status: 'completed',
    lineage: [{ source: 'isolated-fixture' }],
    unresolved_gaps: [],
    files: [],
  }, null, 2) + '\n', 'utf8');
}, Number(delay));
`;

function copyRuntime(projectRoot) {
  for (const relativePath of [
    '.agents',
    'package.json',
    'scripts/brand-reports',
    'src/utils/brand-reports',
  ]) {
    cpSync(path.join(SOURCE_ROOT, relativePath), path.join(projectRoot, relativePath), {
      recursive: true,
    });
  }
}

function setPipelineReviewLink(packageRoot, statePath) {
  const reviewPath = path.join(packageRoot, 'stage-review.json');
  const review = readJson(reviewPath);
  review.pipeline_state_path = statePath;
  writeJson(reviewPath, review);
}

function createPipeline(projectRoot) {
  const pipelineRoot = path.join(projectRoot, 'fixture-pipeline');
  const packages = {
    stage_1: path.join(pipelineRoot, '01-source-brand'),
    stage_2: path.join(pipelineRoot, '02-extended-brand'),
    stage_3: path.join(pipelineRoot, '03-landing-materials'),
  };
  cpSync(path.join(FIXTURE_ROOT, 'stage-1'), packages.stage_1, { recursive: true });
  cpSync(path.join(FIXTURE_ROOT, 'stage-2'), packages.stage_2, { recursive: true });
  cpSync(path.join(FIXTURE_ROOT, 'stage-3'), packages.stage_3, { recursive: true });

  const stage2InputPath = path.join(packages.stage_2, 'transfer-input.json');
  const stage2Input = readJson(stage2InputPath);
  stage2Input.source_analysis.package_path = packages.stage_1;
  writeJson(stage2InputPath, stage2Input);

  const stage3InputPath = path.join(packages.stage_3, 'landing-input.json');
  const stage3Input = readJson(stage3InputPath);
  stage3Input.extended_brand_source.package_path = packages.stage_2;
  writeJson(stage3InputPath, stage3Input);

  const statePath = path.join(pipelineRoot, 'pipeline-state.json');
  const state = readJson(path.join(
    projectRoot,
    '.agents/skills/reconstruct-brand-system/assets/pipeline-state.json',
  ));
  state.created_at = '2026-08-23T00:00:00Z';
  state.updated_at = '2026-08-23T00:00:00Z';
  state.stages.stage_1.started_at = '2026-08-23T00:00:00Z';
  for (const [stageId, packageRoot] of Object.entries(packages)) {
    state.stages[stageId].package_path = packageRoot;
  }
  writeJson(statePath, state);
  Object.values(packages).forEach((packageRoot) => setPipelineReviewLink(packageRoot, statePath));
  return { packages, pipelineRoot, statePath };
}

function planStage(projectRoot, statePath, stageId, { expectedStatus = 0 } = {}) {
  return run(projectRoot, 'python3', [
    path.join(
      projectRoot,
      '.agents/skills/reconstruct-brand-system/scripts/plan_stage_jobs.py',
    ),
    statePath,
    '--stage',
    stageId,
  ], { expectedStatus });
}

function updateJobArguments(projectRoot, statePath, stageId, jobId, status, owner) {
  return [
    path.join(
      projectRoot,
      '.agents/skills/reconstruct-brand-system/scripts/update_job.py',
    ),
    statePath,
    '--stage',
    stageId,
    '--job',
    jobId,
    '--status',
    status,
    '--owner',
    owner,
  ];
}

function updateJob(
  projectRoot,
  statePath,
  stageId,
  jobId,
  status,
  owner,
  { expectedStatus = 0 } = {},
) {
  return run(
    projectRoot,
    'python3',
    updateJobArguments(projectRoot, statePath, stageId, jobId, status, owner),
    { expectedStatus },
  );
}

function stageJobs(statePath, stageId) {
  return readJson(statePath).execution.jobs.filter((job) => job.stage === stageId);
}

function runFakeWorker(projectRoot, job, delay) {
  return runAsync(projectRoot, process.execPath, [
    '-e',
    FAKE_WORKER_SOURCE,
    job.expected_output,
    job.stage,
    job.job_id,
    String(delay),
  ]);
}

async function assertParallelWorkersBeatSerial(projectRoot, jobs) {
  const delay = 120;
  const serialStartedAt = performance.now();
  for (const job of jobs) {
    await runFakeWorker(projectRoot, job, delay);
  }
  const serialMilliseconds = performance.now() - serialStartedAt;
  const parallelStartedAt = performance.now();
  await Promise.all(jobs.map((job) => runFakeWorker(projectRoot, job, delay)));
  const parallelMilliseconds = performance.now() - parallelStartedAt;
  assert.ok(
    parallelMilliseconds < serialMilliseconds * 0.75,
    `Fake parallel wave must beat serial execution (${parallelMilliseconds}ms vs ${serialMilliseconds}ms).`,
  );
}

async function completePlannedStage(
  projectRoot,
  statePath,
  stageId,
  { exerciseConcurrentStateWrites = false, delay = 10 } = {},
) {
  const jobs = stageJobs(statePath, stageId);
  const waves = [...new Set(jobs.map((job) => job.wave))];
  for (const wave of waves) {
    const waveJobs = jobs.filter((job) => job.wave === wave);
    if (exerciseConcurrentStateWrites) {
      await Promise.all(waveJobs.map((job, index) => runAsync(
        projectRoot,
        'python3',
        updateJobArguments(
          projectRoot,
          statePath,
          stageId,
          job.job_id,
          'running',
          `fake-worker-${index + 1}`,
        ),
      )));
      const runningJobs = stageJobs(statePath, stageId).filter((job) => job.wave === wave);
      assert.equal(runningJobs.length, waveJobs.length);
      assert.equal(runningJobs.every((job) => job.status === 'running'), true);
    } else {
      waveJobs.forEach((job, index) => updateJob(
        projectRoot,
        statePath,
        stageId,
        job.job_id,
        'running',
        `fake-worker-${index + 1}`,
      ));
    }
    await Promise.all(waveJobs.map((job) => runFakeWorker(projectRoot, job, delay)));
    waveJobs.forEach((job, index) => updateJob(
      projectRoot,
      statePath,
      stageId,
      job.job_id,
      'completed',
      `fake-worker-${index + 1}`,
    ));
  }
  const completed = stageJobs(statePath, stageId);
  assert.equal(completed.length, jobs.length);
  assert.equal(completed.every((job) => job.status === 'completed'), true);
  assert.equal(completed.every((job) => job.outputs.includes(job.expected_output)), true);
}

function registryEntry(projectRoot, stage) {
  const registry = readJson(path.join(projectRoot, 'public/brand-reports/registry.json'));
  const entry = registry.reports.find((item) => item.stage === stage);
  assert.ok(entry, `Registry must contain ${stage}.`);
  return entry;
}

function registeredReview(projectRoot, stage) {
  const entry = registryEntry(projectRoot, stage);
  return readJson(path.join(projectRoot, 'public', ...entry.review_url.split('/').filter(Boolean)));
}

function finalize(projectRoot, packageRoot, { id = '' } = {}) {
  const args = [
    path.join(projectRoot, 'scripts/brand-reports/finalize-brand-report.mjs'),
    packageRoot,
  ];
  if (id) args.push('--id', id);
  return run(projectRoot, 'node', args);
}

function advance(projectRoot, statePath, { expectedStatus = 0 } = {}) {
  return run(projectRoot, 'python3', [
    path.join(projectRoot, '.agents/skills/reconstruct-brand-system/scripts/advance_pipeline.py'),
    statePath,
    '--decision',
    'accepted',
    '--feedback',
    'Automated fixture acceptance.',
  ], { expectedStatus });
}

function assertRegisteredStatus(projectRoot, stage, status) {
  assert.equal(registeredReview(projectRoot, stage).status, status);
}

function assertSamePath(actual, expected) {
  assert.equal(realpathSync(actual), realpathSync(expected));
}

function assertImageParallelismGate(projectRoot) {
  const probeRoot = path.join(projectRoot, 'image-parallelism-init-probe');
  const output = run(projectRoot, 'python3', [
    path.join(
      projectRoot,
      '.agents/skills/reconstruct-brand-system/scripts/init_pipeline.py',
    ),
    probeRoot,
    '--enable-image-parallelism',
  ]);
  assert.match(output, /IMAGE_PARALLELISM=enabled/);
  const probeStatePath = path.join(probeRoot, 'pipeline-state.json');
  const state = readJson(probeStatePath);
  assert.equal(state.execution.image_parallelism.mode, 'enabled');
  const fallbackOutput = run(projectRoot, 'python3', [
    path.join(
      projectRoot,
      '.agents/skills/reconstruct-brand-system/scripts/plan_stage_jobs.py',
    ),
    probeStatePath,
    '--stage',
    'stage_1',
    '--serial-fallback-reason',
    'Fixture has no worker slots.',
  ]);
  assert.match(fallbackOutput, /JOBS=serial_fallback/);
  const fallbackState = readJson(probeStatePath);
  assert.equal(fallbackState.execution.jobs[0].status, 'skipped');
  assert.equal(
    fallbackState.execution.serial_fallback_reason.stage_1,
    'Fixture has no worker slots.',
  );
  rmSync(probeRoot, { recursive: true, force: true });
}

async function testPipeline(projectRoot) {
  assertImageParallelismGate(projectRoot);
  const { packages, statePath } = createPipeline(projectRoot);
  assert.equal(
    readJson(statePath).execution.image_parallelism.mode,
    'pilot_pending',
  );
  const finalizerPath = path.join(projectRoot, 'scripts/brand-reports/finalize-brand-report.mjs');
  const disabledFinalizerPath = `${finalizerPath}.disabled`;

  const sourceFinalizationOutput = finalize(projectRoot, packages.stage_1, {
    id: 'fixture-source-stable',
  });
  assert.match(
    sourceFinalizationOutput,
    /^FINALIZED stage=source_brand_analysis report=fixture-source-stable validation=\d+ms registration=\d+ms drift_check=\d+ms total=\d+ms package=.+$/m,
  );
  assert.equal(sourceFinalizationOutput.trim().split('\n').length, 1);
  assert.doesNotMatch(sourceFinalizationOutput, /Analysis:|Stage: brief|Registered /);
  assertRegisteredStatus(projectRoot, 'source_brand_analysis', 'pending');

  const missingPlanOutput = advance(projectRoot, statePath, { expectedStatus: 1 });
  assert.match(missingPlanOutput, /CHAIN_REASON=PARALLEL_MERGE_BARRIER_INCOMPLETE/);
  assert.match(missingPlanOutput, /no fixed parallel job plan/);
  assert.match(
    planStage(projectRoot, statePath, 'stage_2', { expectedStatus: 1 }),
    /cannot plan inactive Stage stage_2/,
  );
  assert.match(planStage(projectRoot, statePath, 'stage_1'), /PLANNED_STAGE=stage_1/);
  const plannedBarrierOutput = advance(projectRoot, statePath, { expectedStatus: 1 });
  assert.match(plannedBarrierOutput, /parallel jobs are not at the merge barrier/);
  const sourceJobs = stageJobs(statePath, 'stage_1');
  assert.equal(sourceJobs.length, 3);
  await assertParallelWorkersBeatSerial(projectRoot, sourceJobs);
  const firstSourceJob = sourceJobs[0];
  updateJob(
    projectRoot,
    statePath,
    'stage_1',
    firstSourceJob.job_id,
    'running',
    'fake-worker-1',
  );
  rmSync(firstSourceJob.expected_output, { force: true });
  const missingResultOutput = updateJob(
    projectRoot,
    statePath,
    'stage_1',
    firstSourceJob.job_id,
    'completed',
    'fake-worker-1',
    { expectedStatus: 1 },
  );
  assert.match(missingResultOutput, /required job result is missing/);
  await completePlannedStage(projectRoot, statePath, 'stage_1', {
    exerciseConcurrentStateWrites: true,
  });
  const parallelSummary = JSON.parse(run(projectRoot, 'python3', [
    path.join(
      projectRoot,
      '.agents/skills/reconstruct-brand-system/scripts/summarize_parallel_run.py',
    ),
    statePath,
    '--stage',
    'stage_1',
  ]));
  assert.equal(parallelSummary.artifact_type, 'brand_parallel_run_summary');
  assert.equal(parallelSummary.job_count, 3);
  assert.equal(parallelSummary.waves.length, 1);

  renameSync(finalizerPath, disabledFinalizerPath);
  const failureOutput = run(projectRoot, 'python3', [
    path.join(projectRoot, '.agents/skills/reconstruct-brand-system/scripts/advance_pipeline.py'),
    statePath,
    '--decision',
    'accepted',
    '--feedback',
    'This acceptance must roll back.',
  ], { expectedStatus: 1 });
  assert.match(failureOutput, /CHAIN_REASON=STORYBOOK_REGISTRATION_STALE/);
  assert.equal(readJson(path.join(packages.stage_1, 'stage-review.json')).status, 'pending');
  assert.equal(readJson(statePath).current_stage, 'stage_1');
  assertRegisteredStatus(projectRoot, 'source_brand_analysis', 'pending');
  renameSync(disabledFinalizerPath, finalizerPath);

  const sourceValidatorPath = path.join(
    projectRoot,
    '.agents/skills/research-brand-anatomy/scripts/validate_analysis.py',
  );
  const disabledSourceValidatorPath = `${sourceValidatorPath}.disabled`;
  renameSync(sourceValidatorPath, disabledSourceValidatorPath);
  const sourceAcceptanceOutput = advance(projectRoot, statePath);
  assert.match(sourceAcceptanceOutput, /CHECKED .*validation=skipped/);
  assert.match(sourceAcceptanceOutput, /FINALIZED .*validation=skipped/);
  assert.match(sourceAcceptanceOutput, /NEXT_STAGE=stage_2/);
  assert.doesNotMatch(sourceAcceptanceOutput, /Analysis:|Stage: brief/);
  renameSync(disabledSourceValidatorPath, sourceValidatorPath);
  assert.equal(readJson(path.join(packages.stage_1, 'stage-review.json')).status, 'accepted');
  assertRegisteredStatus(projectRoot, 'source_brand_analysis', 'accepted');
  const sourceReceipt = readJson(path.join(packages.stage_1, 'registration-receipt.json'));
  assert.equal(sourceReceipt.review_status, 'accepted');
  assert.equal(
    sourceReceipt.report_id,
    registryEntry(projectRoot, 'source_brand_analysis').id,
  );
  const stage2Input = readJson(path.join(packages.stage_2, 'transfer-input.json'));
  assertSamePath(stage2Input.source_analysis.package_path, packages.stage_1);
  assert.equal(stage2Input.source_analysis.review_status, 'accepted');

  finalize(projectRoot, packages.stage_2);
  assertRegisteredStatus(projectRoot, 'extended_brand_anatomy', 'pending');
  assert.match(
    advance(projectRoot, statePath, { expectedStatus: 1 }),
    /has no parallel job record or serial fallback reason/,
  );
  assert.match(planStage(projectRoot, statePath, 'stage_2'), /PLANNED_STAGE=stage_2/);
  await completePlannedStage(projectRoot, statePath, 'stage_2');
  assert.match(advance(projectRoot, statePath), /NEXT_STAGE=stage_3/);
  assertRegisteredStatus(projectRoot, 'extended_brand_anatomy', 'accepted');
  const stage3Input = readJson(path.join(packages.stage_3, 'landing-input.json'));
  assertSamePath(stage3Input.extended_brand_source.package_path, packages.stage_2);

  finalize(projectRoot, packages.stage_3);
  assertRegisteredStatus(projectRoot, 'landing_materials', 'pending');
  assert.match(planStage(projectRoot, statePath, 'stage_3'), /PLANNED_STAGE=stage_3/);
  await completePlannedStage(projectRoot, statePath, 'stage_3');
  assert.match(advance(projectRoot, statePath), /CHAIN_ACTION=COMPLETE/);
  assertRegisteredStatus(projectRoot, 'landing_materials', 'accepted');

  const finalState = readJson(statePath);
  assert.equal(finalState.status, 'complete');
  assert.equal(finalState.transition_log.length, 3);
  const registry = readJson(path.join(projectRoot, 'public/brand-reports/registry.json'));
  assert.equal(registry.reports.length, 3);

  for (const entry of registry.reports) {
    run(projectRoot, 'node', [
      path.join(projectRoot, 'scripts/brand-reports/finalize-brand-report.mjs'),
      packages[
        entry.stage === 'source_brand_analysis'
          ? 'stage_1'
          : entry.stage === 'extended_brand_anatomy'
            ? 'stage_2'
            : 'stage_3'
      ],
      '--registration-only',
      '--check',
    ]);
  }

  const landingEntry = registry.reports.find((entry) => entry.stage === 'landing_materials');
  assert.ok(landingEntry);
  const unregisterScript = path.join(
    projectRoot,
    'scripts/brand-reports/unregister-brand-report.mjs',
  );
  assert.match(
    run(projectRoot, 'node', [unregisterScript, landingEntry.id, '--dry-run']),
    /WOULD_UNREGISTER/,
  );
  assert.match(run(projectRoot, 'node', [unregisterScript, landingEntry.id]), /UNREGISTERED/);
  run(projectRoot, 'node', [unregisterScript, landingEntry.id, '--check']);
  const registryAfterUnregister = readJson(
    path.join(projectRoot, 'public/brand-reports/registry.json'),
  );
  assert.equal(registryAfterUnregister.reports.length, 2);
  assert.equal(
    registryAfterUnregister.reports.some((entry) => entry.id === landingEntry.id),
    false,
  );
}

async function main() {
  assert.ok(existsSync(FIXTURE_ROOT), `Fixture root is missing: ${FIXTURE_ROOT}`);
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'brand-report-pipeline-'));
  const keepFixture = process.env.KEEP_BRAND_REPORT_FIXTURE === '1';
  try {
    copyRuntime(temporaryRoot);
    await testPipeline(temporaryRoot);
    process.stdout.write('PASS parallel brand report fixture finalization and router acceptance path.\n');
    if (keepFixture) process.stdout.write(`FIXTURE_PROJECT=${temporaryRoot}\n`);
  } finally {
    if (!keepFixture) rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
