#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { normalizeBrandReport, REPORT_STRUCTURES } from '../../src/utils/brand-reports/index.js';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIRECTORY, '..', '..');

const sourceLayers = Object.fromEntries([
  'source_synthesis',
  'evidence_and_authorship',
  'strategy',
  'verbal_system',
  'identity_and_channel_tokens',
  'key_visual_system',
  'brand_mood_and_world',
  'photography_and_film',
  'product_representation',
  'product_native_visual_and_cognitive_language',
  'composition_and_cross_channel_grammar',
  'product_interface_and_service_behavior',
  'system_synthesis',
  'global_brand_system',
].map((key) => [key, { title: key, key_insight: `${key} insight.`, topics: [] }]));

const typographySources = [{
  id: 'contract-font',
  family: 'Contract Sans',
  source_type: 'stylesheet',
  url: 'https://fonts.example.invalid/contract.css',
  license_note: 'Contract fixture only.',
}];
const typographyRoles = ['display', 'h1', 'h2', 'h3', 'body', 'label', 'caption'];
const typographyDirection = typographyRoles.map((role, index) => ({
  role,
  font_family: 'Contract Sans',
  font_source_id: 'contract-font',
  font_size: `${72 - index * 9}px`,
  font_weight: index < 4 ? 700 : 400,
  line_height: index < 4 ? 1 : 1.5,
  letter_spacing: '0',
  specimen: `${role} specimen`,
  relationship: 'tune',
  source_basis: 'Contract fixture hierarchy',
  target_direction: `${role} direction`,
  landing_use: `${role} use`,
  status: 'directional',
}));

const fixtures = {
  source_brand_analysis: {
    artifact_type: 'source_brand_analysis',
    schema_version: '1.2.0',
    brand: { name: 'Source', entity_scope: 'Masterbrand', product_mode: 'physical' },
    handoff: { status: 'pending', package_version: '1.0.0', unresolved_gaps: [] },
    analysis_layers: sourceLayers,
    verbal_branding: {
      brand_purpose: { statement: 'Source purpose.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' },
      brand_essence: { statement: 'Source essence.', epistemic_status: 'inferred', evidence_and_scope: 'EV-001 · EV-002' },
      positioning: { statement: 'Source position.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' },
      brand_promise: { statement: 'Source promise.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' },
      core_values: [{ name: 'Clarity', statement: 'Value statement.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' }],
      brand_message: { statement: 'Source brand message.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' },
      voice_principles: { statement: 'Direct voice.', epistemic_status: 'observed', evidence_and_scope: 'EV-001' },
      activation_principles: { statement: 'Promise then proof.', epistemic_status: 'inferred', evidence_and_scope: 'EV-001 · EV-002' },
    },
    decision_index: { strategy: [{ claim: 'Source claim.' }] },
    design_system: {
      brand_color_scheme: {
        color_tokens: [{ name: 'Canvas', value: '#F2EFE8', color_layer: 'identity', role: 'surface' }],
      },
      typography_hierarchy: {
        documentation_only: true,
        documentation_webfonts: typographySources.map((source) => ({ ...source, source_url: source.url })),
        specimens: typographyDirection.map((item) => ({
          role: item.role,
          family: item.font_family,
          font_source_id: item.font_source_id,
          size: item.font_size,
          weight: item.font_weight,
          line_height: item.line_height,
          specimen: item.specimen,
        })),
      },
    },
    grammar_rules: [{ intended_effect: 'Grammar effect.' }],
    evidence_index: [],
    downstream_contract: { target_direction: null },
  },
  extended_brand_anatomy: {
    artifact_type: 'extended_brand_anatomy',
    schema_version: '1.1.0',
    target: { working_name: 'Target', category: 'Category', audience: 'Audience' },
    sections: Object.fromEntries([
      'source_grammar_application',
      'brand_positioning',
      'landing_product_concept',
      'verbal_branding_and_copy_hierarchy',
      'visual_branding_and_key_visual',
      'brand_mood_and_brand_imagery',
      'product_visual_traits_and_product_imagery',
      'design_token_direction',
    ].map((key) => [key, key === 'brand_positioning' ? {
      key_insight: `${key} insight.`,
      positioning_statement: 'Target position.',
      promise: 'Target promise.',
      proof: ['Target proof.'],
    } : key === 'verbal_branding_and_copy_hierarchy' ? {
      key_insight: `${key} insight.`,
      brand_purpose: 'Target purpose.',
      brand_essence: 'Target essence.',
      brand_message: 'Target brand message.',
      brand_values: [{ value: 'Clarity', statement: 'Target value statement.' }],
      voice: ['Direct'],
      family_usp: 'Target family USP.',
    } : key === 'design_token_direction' ? {
      key_insight: `${key} insight.`,
      documentation_only: true,
      color: [{ name: 'Ink', value: '#17212B', color_layer: 'identity', role: 'text' }],
      typography_sources: typographySources,
      typography: typographyDirection,
    } : { key_insight: `${key} insight.` }])),
    registered_anchor_assets: [],
  },
  landing_materials: {
    artifact_type: 'landing_materials',
    schema_version: '1.1.0',
    selected_narrative_route: 'Route',
    landing_narrative: { key_insight: 'Narrative insight.', brand_message: 'Message.' },
    brand_value: { key_insight: 'Value insight.', values: [] },
    brand_story: { key_insight: 'Story insight.' },
    product_introduction: { key_insight: 'Family insight.', family_name: 'Family' },
    product_lineup_key_insight: 'Lineup insight.',
    product_lineup_copy: [],
    section_map_key_insight: 'Mapping insight.',
    section_map: [],
    registered_product_assets: [],
    boundaries: {},
  },
};

const reviewByType = {
  source_brand_analysis: 'source_brand_analysis',
  extended_brand_anatomy: 'extended_brand_anatomy',
  landing_materials: 'landing_materials',
};

for (const [artifactType, fixture] of Object.entries(fixtures)) {
  const report = normalizeBrandReport(fixture, {
    review: {
      artifact_type: 'stage_review',
      stage: reviewByType[artifactType],
      status: 'pending',
      adjustment_prompts: ['Review.'],
    },
    assetRegistry: { assets: [] },
    publicBasePath: '/brand-reports/contract-fixture',
  });
  const expectedIds = REPORT_STRUCTURES[artifactType].map(([id]) => id);
  const actualIds = report.sections.map(({ id }) => id);
  if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) {
    throw new Error(`${artifactType} section contract drifted.`);
  }

  if (artifactType === 'source_brand_analysis' || artifactType === 'extended_brand_anatomy') {
    const verbalSectionId = artifactType === 'source_brand_analysis'
      ? 'verbal'
      : 'verbal-branding-and-copy-hierarchy';
    const verbalSection = report.sections.find(({ id }) => id === verbalSectionId);
    const verbalHierarchy = verbalSection?.blocks.find(({ type }) => type === 'verbal-brand-hierarchy');
    const verbalTierIds = verbalHierarchy?.tiers.map(({ id }) => id);
    if (JSON.stringify(verbalTierIds) !== JSON.stringify([
      'foundation',
      'strategy',
      'core-verbal-platform',
      'expression',
      'activation',
    ])) {
      throw new Error(`${artifactType} no longer normalizes the fixed verbal-brand hierarchy.`);
    }
    const messageItem = verbalHierarchy.tiers
      .flatMap(({ items }) => items)
      .find(({ id }) => id === 'brand-message');
    if (messageItem?.emphasis !== 'brand-message') {
      throw new Error(`${artifactType} no longer emphasizes the canonical brand message.`);
    }

    const tokenSectionId = artifactType === 'source_brand_analysis'
      ? 'global-brand-system-framework'
      : 'design-token-direction';
    const tokenSection = report.sections.find(({ id }) => id === tokenSectionId);
    const colorGuide = tokenSection?.blocks.find(({ type }) => type === 'color-token-guide');
    const typographyGuide = tokenSection?.blocks.find(({ type }) => type === 'typography-specimens');
    if (!colorGuide?.documentOnly || !colorGuide.items?.[0]?.value) {
      throw new Error(`${artifactType} no longer normalizes a document-only color token guide.`);
    }
    if (!typographyGuide?.documentOnly || typographyGuide.items?.length !== typographyRoles.length) {
      throw new Error(`${artifactType} no longer normalizes the fixed typography hierarchy.`);
    }
    if (!typographyGuide.fontSources?.[0]?.url) {
      throw new Error(`${artifactType} no longer preserves typography source provenance.`);
    }
  }
}

const forbiddenLegacyFiles = [
  '.agents/skills/research-brand-anatomy/assets/report.css',
  '.agents/skills/research-brand-anatomy/scripts/render_report.py',
  '.agents/skills/research-brand-anatomy/scripts/unify_existing_report.py',
  '.agents/skills/research-brand-anatomy/scripts/validate_report_language.py',
  '.agents/skills/build-brand-from-anatomy/scripts/render_extended_report.py',
  '.agents/skills/build-landing-materials/scripts/render_landing_report.py',
];

for (const relativePath of forbiddenLegacyFiles) {
  try {
    await access(path.join(PROJECT_ROOT, relativePath));
    throw new Error(`Forbidden legacy report file exists: ${relativePath}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const parallelPlanPath = path.join(
  PROJECT_ROOT,
  '.agents/skills/reconstruct-brand-system/assets/parallel-job-plan.json',
);
const parallelPlan = JSON.parse(await readFile(parallelPlanPath, 'utf8'));
if (
  parallelPlan?.artifact_type !== 'brand_parallel_job_plan'
  || parallelPlan?.schema_version !== '1.0.0'
) {
  throw new Error('Parallel job plan identity drifted.');
}
const expectedParallelJobs = {
  stage_1: ['strategy_verbal_identity', 'visual_corpus', 'product_native_language'],
  stage_2: [
    'verbal_narrative',
    'product_lineup',
    'visual_tokens',
    'product_hero_anchor',
    'brand_mood_anchor',
  ],
  stage_3: ['landing_copy_map', 'product_render_lane_a', 'product_render_lane_b'],
};
for (const [stageId, expectedJobIds] of Object.entries(expectedParallelJobs)) {
  const stage = parallelPlan.stages?.[stageId];
  const actualJobIds = stage?.waves?.flatMap(({ jobs }) => jobs.map(({ job_id: jobId }) => jobId));
  if (JSON.stringify(actualJobIds) !== JSON.stringify(expectedJobIds)) {
    throw new Error(`${stageId} fixed parallel job plan drifted.`);
  }
}

for (const helper of [
  'plan_stage_jobs.py',
  'update_job.py',
  'summarize_parallel_run.py',
]) {
  await access(path.join(
    PROJECT_ROOT,
    '.agents/skills/reconstruct-brand-system/scripts',
    helper,
  ));
}

process.stdout.write('PASS fixed Stage 1–3 React report and bounded parallel job contracts.\n');
