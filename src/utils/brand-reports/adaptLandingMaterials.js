import {
  cardGridBlock,
  evidenceGridBlock,
  keyValueTable,
  listBlock,
  proseBlock,
  tableBlock,
} from './blocks.js';
import {
  asArray,
  asRecord,
  firstInsight,
  firstText,
  isRecord,
  makeSection,
  toText,
} from './helpers.js';
import { createAssetIndex, resolveAsset } from './paths.js';
import { normalizeReview } from './review.js';

function compactBlocks(blocks) {
  return blocks.filter(Boolean);
}

function productLineupTable(products) {
  return tableBlock('Product-lineup copy matrix', [
    { key: 'product_name', label: 'Product' },
    { key: 'product_usp', label: 'USP' },
    { key: 'headline', label: 'Headline' },
    { key: 'description', label: 'Description' },
    { key: 'feature_copy', label: 'Features' },
    { key: 'proof_copy', label: 'Proof' },
    { key: 'cta', label: 'CTA' },
  ], products);
}

function sectionMapTable(items) {
  return tableBlock('Landing-section mapping', [
    { key: 'section', label: 'Section' },
    { key: 'communication_job', label: 'Communication job' },
    { key: 'copy', label: 'Copy' },
    { key: 'proof_of', label: 'Proof of' },
    { key: 'asset_id', label: 'Asset' },
    { key: 'cta', label: 'CTA / next action' },
  ], items);
}

function uniqueAssets(items) {
  const result = [];
  const seen = new Set();
  asArray(items).filter(isRecord).forEach((asset, index) => {
    const id = firstText(asset.asset_id, asset.evidence_id, asset.id, `asset-${index + 1}`);
    if (seen.has(id)) return;
    seen.add(id);
    result.push(asset);
  });
  return result;
}

export function adaptLandingMaterials(input, context = {}) {
  const model = asRecord(input);
  const narrative = asRecord(model.landing_narrative);
  const values = asRecord(model.brand_value);
  const story = asRecord(model.brand_story);
  const family = asRecord(model.product_introduction);
  const products = asArray(model.product_lineup_copy).filter(isRecord);
  const sectionMap = asArray(model.section_map).filter(isRecord);
  const assetRegistry = asRecord(context.assetRegistry);
  const assetIndex = createAssetIndex(assetRegistry);
  const registered = asArray(model.registered_product_assets).map((asset) => resolveAsset(asset, assetIndex));
  const assets = uniqueAssets([...asArray(assetRegistry.assets), ...registered]);
  const source = asRecord(model.extended_brand_source);
  const review = normalizeReview(context.review);

  const narrativeBlocks = compactBlocks([
    keyValueTable('Narrative route', {
      selected_narrative_route: model.selected_narrative_route,
      brand_message: narrative.brand_message,
      hero_eyebrow: narrative.hero_eyebrow,
      hero_headline: narrative.hero_headline,
      hero_support: narrative.hero_support,
      primary_cta: narrative.primary_cta,
    }),
    listBlock('Section sequence', narrative.section_sequence, { ordered: true }),
    keyValueTable('Message-to-visual map', model.message_visual_map),
    listBlock('Brand value to brand mood', asRecord(model.message_visual_map).brand_values_to_brand_mood),
    listBlock('Family and product USP to imagery', asRecord(model.message_visual_map).family_and_product_usp_to_product_imagery),
  ]);

  const valueBlocks = compactBlocks([
    proseBlock('Value statement', [values.statement]),
    cardGridBlock('Brand values', values.values, { idPrefix: 'value' }),
    listBlock('Supporting proof', values.proof),
    listBlock('Short-form variants', values.short_variants),
  ]);

  const storyBlocks = compactBlocks([
    proseBlock(story.headline, [story.body]),
    proseBlock('Product connection', [story.product_connection]),
  ]);

  const familyBlocks = compactBlocks([
    proseBlock(family.headline, [family.description]),
    keyValueTable('Product-family introduction', {
      family_name: family.family_name,
      shared_promise: family.shared_promise,
      family_usp: family.family_usp,
    }),
  ]);

  const lineupBlocks = compactBlocks([
    cardGridBlock('Product lineup', products, { idPrefix: 'product' }),
    productLineupTable(products),
  ]);

  const mappingBlocks = compactBlocks([
    evidenceGridBlock('Product-image renders', assets, {
      assetIndex,
      publicBasePath: context.publicBasePath,
    }),
    sectionMapTable(sectionMap),
    cardGridBlock('Landing-section roles', sectionMap, { idPrefix: 'landing-section' }),
  ]);

  mappingBlocks.push(...compactBlocks([
    listBlock('Unverified claims', asRecord(model.boundaries).unverified_claims),
    listBlock('Protected brand and product invariants', asRecord(model.boundaries).protected_brand_and_product_invariants),
    listBlock('Out of scope', asRecord(model.boundaries).out_of_scope),
  ]));

  const firstValue = asRecord(asArray(values.values)[0]);
  const firstProduct = asRecord(products[0]);
  const firstMappedSection = asRecord(sectionMap[0]);

  const sectionDefinitions = [
    [
      'landing-narrative',
      'Landing narrative and hierarchy',
      narrativeBlocks,
      firstInsight(narrative.key_insight, narrative.brand_message, narrative.hero_headline),
    ],
    [
      'brand-value',
      'Brand value copy',
      valueBlocks,
      firstInsight(values.key_insight, values.statement, firstValue.statement, firstValue.description),
    ],
    [
      'brand-story',
      'Brand story copy',
      storyBlocks,
      firstInsight(story.key_insight, story.headline, story.body),
    ],
    [
      'product-family',
      'Product-family introduction',
      familyBlocks,
      firstInsight(family.key_insight, family.shared_promise, family.family_usp, family.description),
    ],
    [
      'product-lineup',
      'Product-lineup copy',
      lineupBlocks,
      firstInsight(model.product_lineup_key_insight, firstProduct.product_usp, firstProduct.headline),
    ],
    [
      'product-assets-and-map',
      'Product images and landing-section map',
      mappingBlocks,
      firstInsight(
        model.section_map_key_insight,
        firstMappedSection.communication_job,
        firstMappedSection.proof_of,
      ),
    ],
  ];
  const sections = sectionDefinitions.map(([id, title, blocks, insight], offset) => makeSection({
    id,
    index: offset + 1,
    label: 'Stage 03',
    title,
    insight,
    blocks,
  }));

  const brandName = firstText(family.family_name, narrative.hero_eyebrow, 'Working brand');
  return {
    meta: {
      title: `${brandName} — Landing Materials`,
      brandName,
      stage: 'landing_materials',
      status: firstText(review?.status, source.review_status, 'pending'),
      version: toText(model.schema_version),
      summary: firstText(
        narrative.brand_message,
        narrative.hero_headline,
        family.shared_promise,
        'Landing-page source materials.',
      ),
    },
    sections,
    ...(review ? { review } : {}),
  };
}
