import {
  asArray,
  asRecord,
  displayValue,
  firstText,
  hasContent,
  isRecord,
  meaningfulEntries,
  pickValue,
  slugify,
  titleize,
  toText,
  uniqueStrings,
} from './helpers.js';
import { resolveAsset, toPublicAssetUrl } from './paths.js';

export function proseBlock(title, paragraphs) {
  const normalized = asArray(paragraphs).map(toText).filter(Boolean);
  if (!normalized.length) return null;
  return {
    type: 'prose',
    ...(toText(title) ? { title: toText(title) } : {}),
    paragraphs: normalized,
  };
}

export function listBlock(title, items, options = {}) {
  const normalized = asArray(items)
    .map((item) => (isRecord(item) ? displayValue(item) : toText(item)))
    .filter(Boolean);
  if (!normalized.length) return null;
  return {
    type: 'list',
    ...(toText(title) ? { title: toText(title) } : {}),
    items: normalized,
    ...(options.ordered ? { ordered: true } : {}),
  };
}

function normalizedColumns(columns, rows) {
  const supplied = asArray(columns);
  if (supplied.length) {
    return supplied.map((column, index) => {
      if (isRecord(column)) {
        const key = firstText(column.key, column.id, column.label, `column_${index + 1}`);
        return { key, label: firstText(column.label, titleize(key)) };
      }
      const key = toText(column) || `column_${index + 1}`;
      return { key, label: titleize(key) };
    });
  }

  const keys = [];
  asArray(rows).forEach((row) => {
    Object.keys(asRecord(row)).forEach((key) => {
      if (!keys.includes(key)) keys.push(key);
    });
  });
  return keys.map((key) => ({ key, label: titleize(key) }));
}

export function tableBlock(title, columns, rows) {
  const sourceRows = asArray(rows).filter(isRecord);
  if (!sourceRows.length) return null;
  const normalized = normalizedColumns(columns, sourceRows);
  if (!normalized.length) return null;

  return {
    type: 'table',
    ...(toText(title) ? { title: toText(title) } : {}),
    columns: normalized,
    rows: sourceRows.map((row) =>
      Object.fromEntries(normalized.map(({ key }) => [key, displayValue(row[key])])),
    ),
  };
}

export function keyValueTable(title, record) {
  const rows = meaningfulEntries(record)
    .filter(([, value]) => !isRecord(value) && !Array.isArray(value))
    .map(([key, value]) => ({ field: titleize(key), value: displayValue(value) }));
  return tableBlock(title, [
    { key: 'field', label: 'Field' },
    { key: 'value', label: 'Value' },
  ], rows);
}

function cardFields(record, ignoredKeys) {
  return meaningfulEntries(record)
    .filter(([key, value]) =>
      !ignoredKeys.has(key) && !Array.isArray(value) && !isRecord(value),
    )
    .map(([key, value]) => ({ label: titleize(key), value: displayValue(value) }));
}

export function toCard(item, index, options = {}) {
  if (!isRecord(item)) {
    const body = toText(item);
    return { id: `${options.idPrefix || 'card'}-${index + 1}`, title: body, body: '' };
  }

  const titleKeys = ['title', 'name', 'product_name', 'working_name', 'headline', 'grammar_id', 'claim_id', 'asset_id', 'evidence_id', 'section'];
  const eyebrowKeys = ['eyebrow', 'role', 'lineup_role', 'status', 'epistemic_status', 'domain', 'asset_id', 'evidence_id'];
  const bodyKeys = ['body', 'description', 'summary', 'copy', 'promise', 'product_usp', 'claim', 'communication_job', 'intended_effect', 'meaning'];
  const title = firstText(...titleKeys.map((key) => item[key]), `Item ${index + 1}`);
  const eyebrow = firstText(...eyebrowKeys.map((key) => item[key]));
  const body = firstText(...bodyKeys.map((key) => item[key]));
  const ignoredKeys = new Set([...titleKeys, ...eyebrowKeys, ...bodyKeys]);
  const items = meaningfulEntries(item)
    .filter(([key, value]) => !ignoredKeys.has(key) && Array.isArray(value))
    .flatMap(([key, value]) =>
      value.map((entry) => `${titleize(key)}: ${displayValue(entry)}`).filter(Boolean),
    );
  const nestedRecords = meaningfulEntries(item)
    .filter(([key, value]) => !ignoredKeys.has(key) && isRecord(value))
    .map(([key, value]) => `${titleize(key)}: ${displayValue(value)}`);

  const fields = cardFields(item, ignoredKeys);
  const detailLines = [
    body,
    ...fields.map(({ label, value }) => `${label}: ${value}`),
    ...items,
    ...nestedRecords,
  ].filter(Boolean);

  return {
    id: slugify(firstText(item.id, item.asset_id, item.evidence_id, item.product_name, item.claim_id, item.grammar_id, title), `${options.idPrefix || 'card'}-${index + 1}`),
    ...(eyebrow ? { eyebrow } : {}),
    title,
    body: detailLines.join('\n'),
    ...(fields.length ? { fields } : {}),
    ...(items.length ? { items } : {}),
  };
}

export function cardGridBlock(title, items, options = {}) {
  const cards = asArray(items).filter(hasContent).map((item, index) => toCard(item, index, options));
  if (!cards.length) return null;
  return {
    type: 'card-grid',
    ...(toText(title) ? { title: toText(title) } : {}),
    items: cards,
  };
}

function assetMeta(asset) {
  const fields = [
    ['Role', firstText(asset.role, asset.product_image_job, asset.product_representation_job)],
    ['Source tier', asset.source_tier],
    ['Market', asset.market],
    ['Era / date', firstText(asset.era_or_date, asset.generated_at)],
    ['Credit', asset.credit],
    ['Rights', asset.rights_note],
    ['Status', asset.status],
  ];
  return fields
    .map(([label, value]) => ({ label, value: toText(value) }))
    .filter(({ value }) => value);
}

export function toEvidenceItem(item, index, { assetIndex, publicBasePath } = {}) {
  const asset = resolveAsset(item, assetIndex);
  const id = firstText(asset.evidence_id, asset.asset_id, asset.id, `asset-${index + 1}`);
  const localPath = firstText(asset.local_path, asset.file_path, asset.path, asset.src);
  const sourceUrl = firstText(asset.source_url, asset.url);
  const title = firstText(asset.title, asset.product_name, asset.subject, asset.role, id);
  const description = firstText(asset.analysis_notes, asset.communication_job, asset.description);
  const src = toPublicAssetUrl(localPath, publicBasePath);

  const meta = assetMeta(asset);
  return {
    id,
    title,
    ...(description ? { description } : {}),
    ...(src ? { src, alt: firstText(asset.alt, `${title} — ${id}`) } : {}),
    ...(sourceUrl ? { sourceUrl } : {}),
    role: firstText(asset.role, asset.product_image_job, asset.product_representation_job),
    provenance: {
      sourceId: id,
      credit: toText(asset.credit),
      filePath: localPath,
      capturedAt: firstText(asset.captured_at, asset.generated_at),
      ...(sourceUrl ? { url: sourceUrl } : {}),
    },
    ...(meta.length ? { meta } : {}),
  };
}

export function evidenceGridBlock(title, items, options = {}) {
  const normalized = asArray(items)
    .map((item, index) => toEvidenceItem(item, index, options))
    .filter((item) => item.title || item.image);
  if (!normalized.length) return null;
  return {
    type: 'evidence-grid',
    ...(toText(title) ? { title: toText(title) } : {}),
    items: normalized,
  };
}

function sourceRows(value) {
  const source = asRecord(value);
  return asArray(source.source_tables)
    .flatMap((table) => asArray(asRecord(table).rows))
    .filter(isRecord);
}

function nestedRecords(value, keys) {
  if (Array.isArray(value)) return value.filter(isRecord);
  const source = asRecord(value);
  return keys.flatMap((key) => asArray(source[key])).filter(isRecord);
}

function extractCssColor(value) {
  const text = toText(value);
  return text.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|(?:ok)?lch\([^)]*\)|lab\([^)]*\)|color\([^)]*\)/iu)?.[0] || '';
}

export function colorTokenGuideBlock(title, value, options = {}) {
  const records = [
    ...nestedRecords(value, ['color_tokens', 'tokens', 'observed_references', 'color']),
    ...sourceRows(value),
  ];
  const seen = new Set();
  const items = records.map((record, index) => {
    const explicitValue = firstText(pickValue(record, [
      'Value',
      'Hex',
      'Color value',
      'Observed value',
      'Target value',
    ]));
    const description = firstText(pickValue(record, [
      'Description',
      'Target direction',
      'Observed role',
      'Meaning',
      'Notes',
    ]));
    const colorValue = extractCssColor(explicitValue) || extractCssColor(description);
    const name = firstText(pickValue(record, [
      'Name',
      'Token',
      'Token name',
      'Role',
      'Observed role',
    ]), `Color ${ index + 1 }`);

    return {
      id: slugify(firstText(record.id, record.token_id, name), `color-${ index + 1 }`),
      name,
      value: colorValue || explicitValue,
      layer: firstText(pickValue(record, ['Color layer', 'Layer']), 'Unclassified layer'),
      role: firstText(pickValue(record, ['Role', 'Observed role', 'Usage', 'Surface'])),
      relationship: firstText(pickValue(record, ['Relationship', 'Source relationship', 'Keep tune or new'])),
      status: firstText(pickValue(record, ['Status', 'Epistemic status', 'Value status'])),
      description,
      evidence: firstText(pickValue(record, [
        'Evidence and scope',
        'Evidence and limits',
        'Evidence ids',
        'Evidence',
        'Channel / market / date',
      ])),
      sourceBasis: firstText(pickValue(record, ['Source basis', 'Source token or principle'])),
      scope: firstText(pickValue(record, ['Scope'])),
    };
  }).filter((item) => {
    if (!item.value && !item.description && !item.role) return false;
    const key = `${ item.value }|${ item.layer }|${ item.role }`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!items.length) return null;
  return {
    type: 'color-token-guide',
    ...(toText(title) ? { title: toText(title) } : {}),
    description: firstText(
      options.description,
      'Observed and directional color values are rendered as a documentation guide, not as active project tokens.',
    ),
    documentOnly: options.documentOnly !== false,
    items,
  };
}

function hierarchyValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (isRecord(item)
        ? firstText(item.statement, item.message, item.summary, item.value, item.name, displayValue(item))
        : toText(item)))
      .filter(Boolean);
  }
  if (isRecord(value)) {
    return firstText(
      value.statement,
      value.message,
      value.summary,
      value.text,
      value.target_direction,
      value.description,
      value.value,
    );
  }
  return toText(value);
}

function hierarchyItem(id, label, value, options = {}) {
  const normalizedValue = hierarchyValue(value);
  const source = asRecord(value);
  const status = firstText(source.epistemic_status, source.value_status, source.status, options.status);
  if (!hasContent(normalizedValue) && status !== 'gap') return null;
  return {
    id,
    label,
    value: hasContent(normalizedValue) ? normalizedValue : 'Explicit evidence gap',
    ...(options.emphasis ? { emphasis: options.emphasis } : {}),
    ...(status ? { status } : {}),
    description: firstText(source.scope, source.description_note, options.description),
    evidence: firstText(
      source.evidence_and_scope,
      source.evidence_ids,
      source.source_basis,
      source.channel_market_date,
    ),
  };
}

function hierarchyCollectionItem(id, label, value, options = {}) {
  const records = asArray(value);
  const entries = records.map((entry, index) => {
    if (!isRecord(entry)) {
      const text = toText(entry);
      return text ? { id: `${id}-${ index + 1 }`, title: text, status: options.status } : null;
    }
    const title = firstText(entry.name, entry.value, entry.title, entry.product_name, entry.label);
    const description = firstText(entry.statement, entry.description, entry.usp, entry.summary, entry.message);
    const status = firstText(entry.epistemic_status, entry.value_status, entry.status, options.status);
    if (!title && !description && status !== 'gap') return null;
    return {
      id: firstText(entry.id, entry.value_id, entry.product_name, `${id}-${ index + 1 }`),
      title: title || 'Explicit evidence gap',
      description,
      status,
    };
  }).filter(Boolean);

  if (!entries.length && isRecord(value)) {
    const gap = hierarchyItem(id, label, value, options);
    return gap;
  }
  if (!entries.length) return null;
  return { id, label, entries };
}

function compactHierarchyTier(id, title, description, items) {
  const normalized = items.filter(Boolean);
  if (!normalized.length) return null;
  return { id, title, description, items: normalized };
}

/** Normalize source-observed or target-directional verbal-brand data into fixed semantic tiers. */
export function verbalHierarchyBlock(title, value, options = {}) {
  const source = asRecord(value);
  const status = options.status;
  const tiers = [
    compactHierarchyTier(
      'foundation',
      'Brand foundation',
      'Why the brand exists and the shortest internal idea it protects.',
      [
        hierarchyItem('brand-purpose', 'Brand purpose', source.brand_purpose ?? source.purpose, { status }),
        hierarchyItem('brand-essence', 'Brand essence', source.brand_essence ?? source.essence, { status }),
      ],
    ),
    compactHierarchyTier(
      'strategy',
      'Strategic definition',
      'The chosen position and the promise made to the audience.',
      [
        hierarchyItem('positioning', 'Positioning', source.positioning ?? source.positioning_statement, { status }),
        hierarchyItem('brand-promise', 'Brand promise', source.brand_promise ?? source.promise, { status }),
      ],
    ),
    compactHierarchyTier(
      'core-verbal-platform',
      'Core verbal platform',
      'The principles the brand acts by and the message it repeats most consistently.',
      [
        hierarchyCollectionItem('core-values', 'Core brand values', source.core_values ?? source.brand_values, { status }),
        hierarchyItem(
          'brand-message',
          'Brand message',
          source.brand_message ?? source.message,
          { status, emphasis: 'brand-message' },
        ),
      ],
    ),
    compactHierarchyTier(
      'expression',
      'Expression system',
      'How the core platform sounds in language.',
      [
        hierarchyItem('voice-principles', 'Voice principles', source.voice_principles ?? source.voice, { status }),
        hierarchyItem('vocabulary', 'Vocabulary', source.vocabulary, { status }),
        hierarchyItem('sentence-behavior', 'Sentence behavior', source.sentence_behavior, { status }),
      ],
    ),
    compactHierarchyTier(
      'activation',
      'Activation and proof',
      'How the platform descends into narrative, USP, proof, headlines, and actions.',
      [
        hierarchyItem('message-architecture', 'Message architecture', source.message_architecture ?? source.message_hierarchy, { status }),
        hierarchyItem('narrative-route', 'Selected narrative route', source.selected_narrative_route, { status }),
        hierarchyItem('family-usp', 'Family USP', source.family_usp, { status }),
        hierarchyCollectionItem('product-usps', 'Product USPs', source.product_usps, { status }),
        hierarchyItem('proof-principles', 'Reasons to believe / proof', source.proof_principles ?? source.reasons_to_believe ?? source.proof, { status }),
        hierarchyItem('headline-direction', 'Headline direction', source.headline_direction, { status }),
        hierarchyItem('support-direction', 'Supporting-copy direction', source.supporting_copy_direction, { status }),
        hierarchyItem('cta-direction', 'CTA direction', source.cta_direction, { status }),
        hierarchyItem('activation-principles', 'Activation principles', source.activation_principles, { status }),
      ],
    ),
  ].filter(Boolean);

  if (!tiers.length) return null;
  return {
    type: 'verbal-brand-hierarchy',
    ...(toText(title) ? { title: toText(title) } : {}),
    description: firstText(
      options.description,
      'The report separates foundational decisions, the core verbal platform, expression rules, and activation copy.',
    ),
    tiers,
  };
}

const TYPOGRAPHY_HIERARCHY = [
  { role: 'display', label: 'Display', fontSize: 'clamp(4rem, 9vw, 8rem)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.05em' },
  { role: 'h1', label: 'Heading 1', fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.04em' },
  { role: 'h2', label: 'Heading 2', fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', fontWeight: 650, lineHeight: 1.05, letterSpacing: '-0.03em' },
  { role: 'h3', label: 'Heading 3', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 650, lineHeight: 1.12, letterSpacing: '-0.02em' },
  { role: 'body', label: 'Body', fontSize: '1.0625rem', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0' },
  { role: 'label', label: 'Label', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.02em' },
  { role: 'caption', label: 'Caption', fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.02em' },
];

function typographyRole(value) {
  const normalized = toText(value).toLowerCase().replace(/[\s_-]+/gu, ' ').trim();
  if (/^(?:display|hero|masthead)/u.test(normalized)) return 'display';
  if (/^(?:h1|heading 1|headline 1)/u.test(normalized)) return 'h1';
  if (/^(?:h2|heading 2|headline 2)/u.test(normalized)) return 'h2';
  if (/^(?:h3|heading 3|headline 3)/u.test(normalized)) return 'h3';
  if (/body|paragraph|long form/u.test(normalized)) return 'body';
  if (/label|button|navigation|nav/u.test(normalized)) return 'label';
  if (/caption|metadata|meta|footnote/u.test(normalized)) return 'caption';
  return '';
}

function normalizeFontSource(record, index) {
  const url = firstText(pickValue(record, [
    'URL',
    'Source URL',
    'Source url',
    'First-party source URL',
    'Stylesheet URL',
    'Font URL',
  ]));
  const family = firstText(pickValue(record, ['Family', 'Font family']));
  if (!url || !/^https?:\/\//iu.test(url)) return null;
  const id = slugify(firstText(record.id, record.source_id, family), `font-source-${ index + 1 }`);
  return {
    id,
    family,
    url,
    sourceType: firstText(pickValue(record, ['Source type', 'Type'])),
    format: firstText(pickValue(record, ['Format'])),
    weight: pickValue(record, ['Weight', 'Weights']),
    style: firstText(pickValue(record, ['Style']), 'normal'),
    status: firstText(pickValue(record, ['Status'])),
    label: firstText(pickValue(record, ['Label', 'Channel / locale / date'])),
    licenseNote: firstText(pickValue(record, ['License note', 'Fallback and license boundary', 'Rights note'])),
  };
}

function typographyRows(value) {
  if (Array.isArray(value)) return value.filter(isRecord);
  const source = asRecord(value);
  return [
    ...nestedRecords(source, ['specimens', 'typography_specimens', 'observed_references', 'typography']),
    ...sourceRows(source).filter((record) => (
      pickValue(record, ['Information role', 'Role', 'Source role', 'Font size', 'Size', 'Specimen']) !== undefined
    )),
  ];
}

function typographySources(value) {
  const source = asRecord(value);
  const records = [
    ...nestedRecords(source, ['documentation_webfonts', 'typography_sources', 'font_sources', 'webfonts']),
    ...sourceRows(source).filter((record) => (
      pickValue(record, ['First-party source URL', 'Stylesheet URL', 'Font URL']) !== undefined
    )),
  ];
  const seen = new Set();
  return records
    .map(normalizeFontSource)
    .filter((record) => {
      if (!record) return false;
      const key = `${ record.family }|${ record.url }`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeTypographySpecimen(record, fallback, fontSources, options) {
  const family = firstText(pickValue(record, ['Family', 'Font family']), fontSources[0]?.family);
  const explicitSize = firstText(pickValue(record, ['Size', 'Font size']));
  const explicitWeight = pickValue(record, ['Weight', 'Font weight']);
  const explicitLeading = pickValue(record, ['Line height', 'Leading']);
  const explicitTracking = pickValue(record, ['Letter spacing', 'Tracking']);
  const sourceId = firstText(pickValue(record, ['Font source id', 'Source id']));
  const matchedSource = fontSources.find((source) => (
    source.id === sourceId || (family && source.family === family)
  ));
  const hasObservedScale = Boolean(explicitSize || explicitWeight || explicitLeading || explicitTracking);

  return {
    id: slugify(firstText(record.id, fallback.role), fallback.role),
    role: fallback.role,
    label: firstText(pickValue(record, ['Label', 'Information role', 'Role', 'Source role']), fallback.label),
    fontFamily: family,
    fontSourceId: firstText(matchedSource?.id, sourceId),
    fontSize: explicitSize || fallback.fontSize,
    fontWeight: explicitWeight ?? fallback.fontWeight,
    fontStyle: firstText(pickValue(record, ['Style', 'Font style']), 'normal'),
    lineHeight: explicitLeading ?? fallback.lineHeight,
    letterSpacing: explicitTracking ?? fallback.letterSpacing,
    script: firstText(pickValue(record, ['Script', 'Locale', 'Language'])),
    sample: firstText(
      pickValue(record, ['Specimen', 'Sample', 'Text']),
      options.sample,
      'Design systems make decisions visible. 디자인 시스템은 결정을 보이게 합니다. 0123',
    ),
    valueStatus: firstText(
      pickValue(record, ['Value status', 'Epistemic status', 'Status']),
      hasObservedScale ? options.explicitValueStatus : '',
      'documentation-preview',
    ),
    description: firstText(
      pickValue(record, ['Evidence and scope', 'Evidence and limits', 'Channel / market / date', 'Description']),
      hasObservedScale
        ? 'Recorded scale rendered for documentation.'
        : 'Scale supplied by the report preview hierarchy; it is not a brand token.',
    ),
  };
}

export function typographySpecimensBlock(title, value, options = {}) {
  const records = typographyRows(value);
  const fontSources = typographySources(value);
  if (!records.length && !fontSources.length) return null;

  const specimens = TYPOGRAPHY_HIERARCHY.map((fallback) => {
    const matching = records.find((record) => (
      typographyRole(pickValue(record, ['Information role', 'Role', 'Source role', 'Label'])) === fallback.role
    ));
    return normalizeTypographySpecimen(matching ?? {}, fallback, fontSources, options);
  });
  const source = asRecord(value);

  return {
    type: 'typography-specimens',
    ...(toText(title) ? { title: toText(title) } : {}),
    description: firstText(
      options.description,
      'Web hierarchy specimens use linked research fonts inside this report only. Preview-only scale values never become active design tokens.',
    ),
    documentOnly: true,
    fontSources,
    webfontGap: firstText(source.webfont_gap, source.webfontGap),
    items: specimens,
  };
}

export function codeBlock(title, value, language = 'json') {
  if (!hasContent(value)) return null;
  const code = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return {
    type: 'code',
    ...(toText(title) ? { title: toText(title) } : {}),
    language,
    code,
  };
}

export function recordToBlocks(record, options = {}) {
  const source = asRecord(record);
  const blocks = [];
  const primitiveRecord = Object.fromEntries(
    meaningfulEntries(source).filter(([, value]) => !Array.isArray(value) && !isRecord(value)),
  );
  const overview = keyValueTable(options.overviewTitle, primitiveRecord);
  if (overview) blocks.push(overview);

  meaningfulEntries(source).forEach(([key, value]) => {
    const title = titleize(key);
    if (Array.isArray(value)) {
      const block = value.some(isRecord)
        ? cardGridBlock(title, value, { idPrefix: slugify(key) })
        : listBlock(title, uniqueStrings(value));
      if (block) blocks.push(block);
      return;
    }
    if (isRecord(value)) {
      const nested = recordToBlocks(value, { overviewTitle: title });
      blocks.push(...nested);
    }
  });

  return blocks;
}
