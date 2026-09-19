import {
  cardGridBlock,
  colorTokenGuideBlock,
  codeBlock,
  evidenceGridBlock,
  keyValueTable,
  listBlock,
  proseBlock,
  tableBlock,
  typographySpecimensBlock,
  verbalHierarchyBlock,
} from './blocks.js';
import {
  asArray,
  asRecord,
  firstInsight,
  firstText,
  hasContent,
  isRecord,
  makeSection,
  toText,
} from './helpers.js';
import { createAssetIndex, toPublicAssetUrl } from './paths.js';
import { normalizeReview } from './review.js';

const MATERIAL_LAYER_SECTIONS = [
  ['strategy', 'strategy', 'Strategic and cultural anatomy'],
  ['verbal', 'verbal_system', 'Verbal anatomy'],
  ['identity-channel-tokens', 'identity_and_channel_tokens', 'Identity and channel tokens'],
  ['key-visual', 'key_visual_system', 'Key-visual system'],
  ['brand-mood', 'brand_mood_and_world', 'Brand mood and world'],
  ['photography-film', 'photography_and_film', 'Photography and film'],
  ['product-representation', 'product_representation', 'Product representation'],
  ['product-native-visual-language', 'product_native_visual_and_cognitive_language', 'Product-native visual and cognitive language'],
  ['composition', 'composition_and_cross_channel_grammar', 'Composition and cross-channel grammar'],
  ['product-interface-service', 'product_interface_and_service_behavior', 'Product, interface, and service behavior'],
];

const CLAIM_DOMAIN_BY_LAYER = {
  strategy: 'strategy',
  verbal_system: 'verbal_system',
  identity_and_channel_tokens: 'identity_and_tokens',
  key_visual_system: 'key_visual',
  brand_mood_and_world: 'brand_mood',
  photography_and_film: 'photography_and_film',
  product_representation: 'product_representation',
  product_native_visual_and_cognitive_language: 'product_native_language',
  composition_and_cross_channel_grammar: 'composition',
  product_interface_and_service_behavior: 'product_interface_service',
  system_synthesis: 'system_and_other',
};

function topicBlocks(topic) {
  const source = asRecord(topic);
  const blocks = [];
  const prose = proseBlock(source.title, source.notes);
  if (prose) blocks.push(prose);
  asArray(source.tables).forEach((table, tableIndex) => {
    const value = asRecord(table);
    const block = tableBlock(
      `${firstText(source.title, 'Details')} · ${tableIndex + 1}`,
      value.columns,
      value.rows,
    );
    if (block) blocks.push(block);
  });
  return blocks;
}

function areaBlocks(area) {
  const source = asRecord(area);
  const blocks = [];
  const notes = proseBlock(source.title, source.source_notes);
  if (notes) blocks.push(notes);

  [
    ['Roles', source.roles],
    ['Relationships', source.relationships],
    ['Invariants', source.invariants],
    ['Variables and exceptions', source.variables_and_exceptions],
    ['Limits', source.limits],
  ].forEach(([title, items]) => {
    const block = listBlock(`${firstText(source.title, 'System')} · ${title}`, items);
    if (block) blocks.push(block);
  });

  asArray(source.source_tables).forEach((table, index) => {
    const value = asRecord(table);
    const block = tableBlock(
      `${firstText(source.title, 'System')} · Observations ${index + 1}`,
      value.columns,
      value.rows,
    );
    if (block) blocks.push(block);
  });
  return blocks;
}

function topicNotes(layer, titlePattern) {
  const topic = asArray(asRecord(layer).topics)
    .map(asRecord)
    .find((item) => titlePattern.test(firstText(item.title)));
  return firstText(asArray(topic?.notes));
}

function sourceVerbalBranding(model, layers) {
  if (hasContent(model.verbal_branding)) return model.verbal_branding;

  const synthesis = asRecord(layers.source_synthesis);
  const strategy = asRecord(layers.strategy);
  const verbal = asRecord(layers.verbal_system);
  return {
    brand_purpose: { status: 'gap', statement: 'Brand purpose was not explicitly synthesized in this source package.' },
    brand_essence: topicNotes(synthesis, /core causal model|contrasting qualities/iu),
    positioning: topicNotes(synthesis, /source positioning/iu),
    brand_promise: topicNotes(strategy, /promise/iu),
    core_values: { status: 'gap', statement: 'Core brand values were not explicitly synthesized in this source package.' },
    brand_message: { status: 'gap', statement: 'A single source brand message was not explicitly synthesized in this package.' },
    voice_principles: [
      topicNotes(verbal, /lexicon|semantic territories/iu),
      topicNotes(verbal, /syntax|rhetoric|cadence|emotional temperature/iu),
    ].filter(Boolean),
    activation_principles: [
      topicNotes(verbal, /message hierarchy/iu),
      topicNotes(verbal, /naming behavior/iu),
      topicNotes(verbal, /campaign|product|ui|transactional|support|error/iu),
    ].filter(Boolean),
  };
}

function sectionEvidence(layer, evidence, layerKey) {
  const ids = new Set(asArray(asRecord(layer).evidence_ids).map(toText).filter(Boolean));
  if (layerKey === 'evidence_and_authorship' && !ids.size) return evidence;
  return evidence.filter((item) => ids.has(toText(item.evidence_id)));
}

function layerInsight(layer, decisionIndex, layerKey) {
  const source = asRecord(layer);
  const topicNote = asArray(source.topics)
    .flatMap((topic) => {
      const notes = asRecord(topic).notes;
      return Array.isArray(notes) ? notes : [notes];
    })
    .map(toText)
    .find(Boolean);
  const claimDomain = CLAIM_DOMAIN_BY_LAYER[layerKey];
  const firstClaim = asRecord(asArray(decisionIndex[claimDomain])[0]);

  return firstInsight(
    source.key_insight,
    source.keyInsight,
    source.insight,
    source.summary,
    topicNote,
    firstClaim.claim,
    firstClaim.statement,
    firstClaim.summary,
  );
}

function reportIdentity(model, publicBasePath) {
  const identity = asRecord(model.report_identity);
  if (!hasContent(identity)) return undefined;
  const logo = asRecord(identity.logo);
  const src = toPublicAssetUrl(firstText(logo.local_path, logo.file_path), publicBasePath);
  const result = {
    backgroundColor: toText(identity.background_color),
    foregroundColor: toText(identity.foreground_color),
    colorLayer: toText(identity.color_layer),
    scope: toText(identity.identity_scope),
    logoSrc: src,
    logoAlt: firstText(logo.variant, 'Official masterbrand logo'),
    logoEvidenceId: toText(logo.evidence_id),
    logoSourceUrl: toText(logo.source_url),
    logoCredit: toText(logo.credit),
    logoRightsNote: toText(logo.rights_note),
    logoRenderTreatment: toText(logo.render_treatment),
  };
  return hasContent(result) ? result : undefined;
}

export function adaptSourceBrandAnalysis(input, context = {}) {
  const model = asRecord(input);
  const brand = asRecord(model.brand);
  const handoff = asRecord(model.handoff);
  const layers = asRecord(model.analysis_layers);
  const decisionIndex = asRecord(model.decision_index);
  const designSystem = asRecord(model.design_system);
  const evidence = asArray(model.evidence_index).filter(isRecord);
  const assetIndex = createAssetIndex(context.assetRegistry);
  const review = normalizeReview(context.review);

  const synthesis = asRecord(layers.source_synthesis);
  const synthesisSummary = asArray(synthesis.topics)
    .flatMap((topic) => asArray(asRecord(topic).notes))
    .map(toText)
    .find(Boolean);

  const sections = [];
  const addSection = ({ id, title, insight, blocks }) => {
    sections.push(makeSection({
      id,
      index: sections.length + 1,
      label: 'Stage 01',
      title,
      insight,
      blocks,
    }));
  };

  addSection({
    id: 'terminology',
    title: 'Terminology',
    insight: 'Observed findings are direct evidence; inferred findings are bounded interpretations that retain alternatives and exceptions.',
    blocks: [tableBlock('Epistemic labels', [
      { key: 'label', label: 'Label' },
      { key: 'meaning', label: 'Meaning' },
      { key: 'requirement', label: 'Requirement' },
    ], [
      { label: 'Observed', meaning: 'Directly visible or stated in registered evidence.', requirement: 'Cite at least one evidence ID.' },
      { label: 'Inferred', meaning: 'A bounded interpretation of repeated evidence.', requirement: 'Cite evidence, confidence, alternative, and exception.' },
    ])].filter(Boolean),
  });

  const scopeBlocks = [
    keyValueTable('Research scope', {
      entity_scope: brand.entity_scope,
      era_start: brand.era_start,
      era_end: brand.era_end,
      product_mode: brand.product_mode,
    }),
    listBlock('Markets', brand.markets),
    listBlock('Languages', brand.languages),
    listBlock('Channels', brand.channels),
    ...asArray(synthesis.topics).flatMap(topicBlocks),
  ].filter(Boolean);
  addSection({
    id: 'source-brand-anatomy',
    title: firstText(synthesis.title, 'Source brand anatomy'),
    insight: layerInsight(synthesis, decisionIndex, 'source_synthesis'),
    blocks: scopeBlocks,
  });

  const evidenceLayer = asRecord(layers.evidence_and_authorship);
  addSection({
    id: 'evidence',
    title: firstText(evidenceLayer.title, 'Evidence and authorship'),
    insight: layerInsight(evidenceLayer, decisionIndex, 'evidence_and_authorship'),
    blocks: [
      ...asArray(evidenceLayer.topics).flatMap(topicBlocks),
      evidenceGridBlock('Direct evidence', evidence, {
        assetIndex,
        publicBasePath: context.publicBasePath,
      }),
    ].filter(Boolean),
  });

  MATERIAL_LAYER_SECTIONS.forEach(([id, layerKey, fallbackTitle]) => {
    const layer = asRecord(layers[layerKey]);
    const claimDomain = CLAIM_DOMAIN_BY_LAYER[layerKey];
    const verbalBlock = layerKey === 'verbal_system'
      ? verbalHierarchyBlock(
        'Verbal brand hierarchy',
        sourceVerbalBranding(model, layers),
        {
          description: 'Source-observed and bounded inferred decisions are synthesized from foundation through activation. Explicit gaps remain visible.',
        },
      )
      : null;
    addSection({
      id,
      title: firstText(layer.title, fallbackTitle),
      insight: layerInsight(layer, decisionIndex, layerKey),
      blocks: [
        verbalBlock,
        ...asArray(layer.topics).flatMap(topicBlocks),
        claimDomain
          ? cardGridBlock('Material claims', decisionIndex[claimDomain], { idPrefix: 'claim' })
          : null,
        evidenceGridBlock(
          'Direct evidence',
          sectionEvidence(layer, evidence, layerKey),
          { assetIndex, publicBasePath: context.publicBasePath },
        ),
      ].filter(Boolean),
    });
  });

  const systemSynthesis = asRecord(layers.system_synthesis);
  addSection({
    id: 'grammar',
    title: 'Causal brand grammar',
    insight: firstInsight(
      layerInsight(systemSynthesis, decisionIndex, 'system_synthesis'),
      asRecord(asArray(model.grammar_rules)[0]).intended_effect,
    ),
    blocks: [
      ...asArray(systemSynthesis.topics).flatMap(topicBlocks),
      cardGridBlock('Causal grammar rules', model.grammar_rules, { idPrefix: 'grammar' }),
    ].filter(Boolean),
  });

  const globalLayer = asRecord(layers.global_brand_system);
  const globalBlocks = asArray(globalLayer.topics).flatMap(topicBlocks);
  globalBlocks.push(
    colorTokenGuideBlock(
      'Color token guide',
      designSystem.brand_color_scheme,
      { description: 'Source-observed color values shown by identity, status, and UI layer. Documentation only.' },
    ),
    typographySpecimensBlock(
      'Typography hierarchy',
      designSystem.typography_hierarchy,
      {
        explicitValueStatus: 'observed',
        description: 'Source-observed typography and verified webfonts rendered as a standard web hierarchy. Documentation only.',
      },
    ),
  );
  ['brand_color_scheme', 'typography_hierarchy', 'spacing_strategy', 'layout_strategy']
    .forEach((key) => globalBlocks.push(...areaBlocks(designSystem[key])));
  globalBlocks.push(
    proseBlock('Implementation boundary', [designSystem.implementation_boundary]),
  );
  addSection({
    id: 'global-brand-system-framework',
    title: firstText(globalLayer.title, 'Global brand-system framework'),
    insight: layerInsight(globalLayer, decisionIndex, 'global_brand_system'),
    blocks: globalBlocks.filter(Boolean),
  });

  const allClaims = Object.values(decisionIndex).flatMap(asArray);
  addSection({
    id: 'core-claims',
    title: 'Core claims',
    insight: firstInsight(
      asRecord(allClaims[0]).claim,
      asRecord(allClaims[0]).statement,
      'Material claims retain evidence, confidence, alternatives, and scope.',
    ),
    blocks: [cardGridBlock('Decision index', allClaims, { idPrefix: 'claim' })].filter(Boolean),
  });

  addSection({
    id: 'evidence-index',
    title: 'Evidence index',
    insight: 'Every displayed source remains traceable to its evidence ID, provenance, rights note, and local asset.',
    blocks: [evidenceGridBlock('Evidence index', evidence, {
      assetIndex,
      publicBasePath: context.publicBasePath,
    })].filter(Boolean),
  });

  const handoffBlocks = [
    keyValueTable('Package handoff', {
      status: handoff.status,
      package_version: handoff.package_version,
    }),
    listBlock('Protected surface families', handoff.protected_surface_families),
    listBlock('Approved grammar IDs', handoff.approved_grammar_ids),
    listBlock('Unresolved gaps', handoff.unresolved_gaps),
    codeBlock('Downstream contract', model.downstream_contract),
  ].filter(Boolean);
  addSection({
    id: 'structured-data-handoff',
    title: 'Structured data handoff',
    insight: firstInsight(
      handoff.key_insight,
      handoff.summary,
      asArray(handoff.unresolved_gaps)[0],
      'The handoff preserves approved grammar and makes unresolved gaps explicit for the next stage.',
    ),
    blocks: handoffBlocks,
  });

  return {
    meta: {
      title: `${firstText(brand.name, 'Source brand')} — Source Brand Analysis`,
      brandName: firstText(brand.name, 'Source brand'),
      stage: 'source_brand_analysis',
      status: firstText(review?.status, handoff.status, 'pending'),
      version: firstText(handoff.package_version, model.schema_version),
      summary: firstText(synthesisSummary, brand.entity_scope, 'Evidence-backed source-brand anatomy.'),
      ...(reportIdentity(model, context.publicBasePath)
        ? { identity: reportIdentity(model, context.publicBasePath) }
        : {}),
    },
    sections,
    ...(review ? { review } : {}),
  };
}
