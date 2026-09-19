import {
  colorTokenGuideBlock,
  evidenceGridBlock,
  recordToBlocks,
  typographySpecimensBlock,
  verbalHierarchyBlock,
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

const EXTENDED_SECTION_ORDER = [
  ['source_grammar_application', 'Source-grammar application'],
  ['brand_positioning', 'Target-brand positioning'],
  ['landing_product_concept', 'Product family and lineup'],
  ['verbal_branding_and_copy_hierarchy', 'Verbal branding and copy hierarchy'],
  ['visual_branding_and_key_visual', 'Visual branding and key visual'],
  ['brand_mood_and_brand_imagery', 'Brand mood and brand imagery'],
  ['product_visual_traits_and_product_imagery', 'Product-native visual traits and imagery'],
  ['design_token_direction', 'Landing-page design-token direction'],
];

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

function assetsForSection(sectionKey, assets) {
  if (sectionKey === 'brand_mood_and_brand_imagery') {
    return assets.filter((asset) => /mood|world|imagery/i.test(firstText(asset.role, asset.communication_job)));
  }
  if (sectionKey === 'product_visual_traits_and_product_imagery') {
    return assets.filter((asset) => /product|hero|detail|proof/i.test(firstText(asset.role, asset.communication_job)));
  }
  if (sectionKey === 'visual_branding_and_key_visual') {
    return assets.filter((asset) => /key.visual|identity|anchor/i.test(firstText(asset.role, asset.communication_job)));
  }
  return [];
}

function sectionInsight(section) {
  const source = asRecord(section);
  const firstStringValue = Object.entries(source)
    .filter(([key, value]) => (
      typeof value === 'string'
      && !/(^|_)(id|url|path|status|version|evidence|reference)(_|$)/iu.test(key)
    ))
    .map(([, value]) => value)
    .find(Boolean);

  function nestedNarrativeValue(value) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value.map(nestedNarrativeValue).find(Boolean) || '';
    }
    if (!isRecord(value)) return '';

    const preferredKeys = [
      'key_insight',
      'summary',
      'positioning_statement',
      'promise',
      'one_line_definition',
      'brand_message',
      'family_usp',
      'communication_job',
      'target_direction',
      'premise',
      'description',
      'statement',
    ];
    const preferred = preferredKeys
      .map((key) => value[key])
      .map(nestedNarrativeValue)
      .find(Boolean);
    if (preferred) return preferred;

    return Object.entries(value)
      .filter(([key]) => !/(^|_)(id|url|path|status|version|evidence|reference)(_|$)/iu.test(key))
      .map(([, item]) => nestedNarrativeValue(item))
      .find(Boolean) || '';
  }

  return firstInsight(
    source.key_insight,
    source.keyInsight,
    source.insight,
    source.summary,
    source.positioning_statement,
    source.promise,
    source.one_line_definition,
    source.brand_message,
    source.family_usp,
    source.communication_job,
    source.headline,
    source.description,
    firstStringValue,
    nestedNarrativeValue(source),
  );
}

export function adaptExtendedBrandAnatomy(input, context = {}) {
  const model = asRecord(input);
  const target = asRecord(model.target);
  const sourceSections = asRecord(model.sections);
  const assetRegistry = asRecord(context.assetRegistry);
  const assetIndex = createAssetIndex(assetRegistry);
  const registered = asArray(model.registered_anchor_assets).map((asset) => resolveAsset(asset, assetIndex));
  const assets = uniqueAssets([...asArray(assetRegistry.assets), ...registered]);
  const review = normalizeReview(context.review);

  const sections = EXTENDED_SECTION_ORDER.map(([sectionKey, title], offset) => {
    const index = offset + 1;
    const section = asRecord(sourceSections[sectionKey]);
    let blocks;
    if (sectionKey === 'verbal_branding_and_copy_hierarchy') {
      const positioning = asRecord(sourceSections.brand_positioning);
      const genericVerbalFields = Object.fromEntries(
        Object.entries(section).filter(([key]) => ![
          'key_insight',
          'brand_purpose',
          'brand_essence',
          'brand_message',
          'brand_values',
          'voice',
          'vocabulary',
          'sentence_behavior',
          'message_hierarchy',
          'selected_narrative_route',
          'family_usp',
          'product_usps',
          'headline_direction',
          'supporting_copy_direction',
          'cta_direction',
        ].includes(key)),
      );
      blocks = [
        verbalHierarchyBlock(
          'Verbal brand hierarchy',
          {
            ...section,
            positioning: positioning.positioning_statement,
            brand_promise: positioning.promise,
            proof: positioning.proof,
          },
          {
            status: 'directional',
            description: 'The target verbal platform is ordered from brand foundation to landing-page activation.',
          },
        ),
        ...recordToBlocks(genericVerbalFields),
      ].filter(Boolean);
    } else if (sectionKey === 'design_token_direction') {
      const genericTokenFields = Object.fromEntries(
        Object.entries(section).filter(([key]) => ![
          'color',
          'typography',
          'typography_sources',
          'typography_specimens',
          'documentation_only',
          'webfont_gap',
        ].includes(key)),
      );
      blocks = [
        colorTokenGuideBlock(
          'Color token direction',
          section.color,
          { description: 'Target color direction shown with keep, tune, or new lineage. Documentation only.' },
        ),
        typographySpecimensBlock(
          'Typography hierarchy direction',
          {
            typography: section.typography_specimens ?? section.typography,
            typography_sources: section.typography_sources,
            webfont_gap: section.webfont_gap,
          },
          {
            explicitValueStatus: 'directional',
            description: 'Target typography direction shown as a standard web hierarchy with linked document fonts. It is not applied to the project theme.',
          },
        ),
        ...recordToBlocks(genericTokenFields),
      ].filter(Boolean);
    } else {
      blocks = recordToBlocks(section);
    }
    if (sectionKey === 'source_grammar_application') {
      blocks.unshift(
        ...recordToBlocks(model.source_analysis, { overviewTitle: 'Source analysis' }),
        ...recordToBlocks(model.boundaries, { overviewTitle: 'Protected boundaries' }),
      );
    }
    if (sectionKey === 'brand_positioning') {
      blocks.unshift(...recordToBlocks(target, { overviewTitle: 'Target scope' }));
    }
    if (sectionKey === 'brand_mood_and_brand_imagery') {
      blocks.push(...recordToBlocks(model.moodboard_inputs, { overviewTitle: 'Moodboard inputs' }));
    }
    const evidence = evidenceGridBlock(
      'Registered anchor assets',
      assetsForSection(sectionKey, assets),
      { assetIndex, publicBasePath: context.publicBasePath },
    );
    if (evidence) blocks.push(evidence);

    return makeSection({
      id: sectionKey,
      index,
      label: 'Stage 02',
      title,
      insight: sectionInsight(section),
      blocks,
    });
  });

  const positioning = asRecord(sourceSections.brand_positioning);
  const concept = asRecord(sourceSections.landing_product_concept);
  const brandName = firstText(target.working_name, 'Working brand');

  return {
    meta: {
      title: `${brandName} — Extended Brand Anatomy`,
      brandName,
      stage: 'extended_brand_anatomy',
      status: firstText(review?.status, target.direction_status, 'pending'),
      version: toText(model.schema_version),
      summary: firstText(
        positioning.positioning_statement,
        positioning.promise,
        concept.one_line_definition,
        [target.category, target.audience].filter(Boolean).join(' · '),
        'Extended target-brand anatomy.',
      ),
    },
    sections,
    ...(review ? { review } : {}),
  };
}
