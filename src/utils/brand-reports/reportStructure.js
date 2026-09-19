function freezeStructure(items) {
  return Object.freeze(items.map((item) => Object.freeze(item)));
}

export const REPORT_STRUCTURES = Object.freeze({
  source_brand_analysis: freezeStructure([
    ['terminology', 'Terminology'],
    ['source-brand-anatomy', 'Source brand anatomy'],
    ['evidence', 'Evidence and authorship'],
    ['strategy', 'Strategic and cultural anatomy'],
    ['verbal', 'Verbal anatomy'],
    ['identity-channel-tokens', 'Identity and channel tokens'],
    ['key-visual', 'Key-visual system'],
    ['brand-mood', 'Brand mood and world'],
    ['photography-film', 'Photography and film'],
    ['product-representation', 'Product representation'],
    ['product-native-visual-language', 'Product-native visual and cognitive language'],
    ['composition', 'Composition and cross-channel grammar'],
    ['product-interface-service', 'Product, interface, and service behavior'],
    ['grammar', 'Causal brand grammar'],
    ['global-brand-system-framework', 'Global brand-system framework'],
    ['core-claims', 'Core claims'],
    ['evidence-index', 'Evidence index'],
    ['structured-data-handoff', 'Structured data handoff'],
  ]),
  extended_brand_anatomy: freezeStructure([
    ['source-grammar-application', 'Source-grammar application'],
    ['brand-positioning', 'Target-brand positioning'],
    ['landing-product-concept', 'Product family and lineup'],
    ['verbal-branding-and-copy-hierarchy', 'Verbal branding and copy hierarchy'],
    ['visual-branding-and-key-visual', 'Visual branding and key visual'],
    ['brand-mood-and-brand-imagery', 'Brand mood and brand imagery'],
    ['product-visual-traits-and-product-imagery', 'Product-native visual traits and imagery'],
    ['design-token-direction', 'Landing-page design-token direction'],
  ]),
  landing_materials: freezeStructure([
    ['landing-narrative', 'Landing narrative and hierarchy'],
    ['brand-value', 'Brand value copy'],
    ['brand-story', 'Brand story copy'],
    ['product-family', 'Product-family introduction'],
    ['product-lineup', 'Product-lineup copy'],
    ['product-assets-and-map', 'Product images and landing-section map'],
  ]),
});

export function reportStructureFor(artifactType) {
  const structure = REPORT_STRUCTURES[artifactType];
  if (!structure) {
    throw new TypeError(`Unsupported brand report artifact_type "${artifactType || 'missing'}".`);
  }
  return structure;
}

export function assertFixedReportStructure(report, artifactType) {
  const expected = reportStructureFor(artifactType);
  const sections = Array.isArray(report?.sections) ? report.sections : [];
  const actualIds = sections.map((section) => section?.id);
  const expectedIds = expected.map(([id]) => id);

  if (actualIds.length !== new Set(actualIds).size) {
    throw new TypeError(`${artifactType} report contains duplicate section IDs.`);
  }
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    throw new TypeError(
      `${artifactType} report section contract mismatch. Expected [${expectedIds.join(', ')}], received [${actualIds.join(', ')}].`,
    );
  }

  sections.forEach((section, index) => {
    if (section.index !== index + 1) {
      throw new TypeError(`${artifactType} section "${section.id}" has an invalid index.`);
    }
    if (typeof section.insight !== 'string' || !section.insight.trim()) {
      throw new TypeError(`${artifactType} section "${section.id}" requires one insight sentence.`);
    }
    if (!Array.isArray(section.blocks)) {
      throw new TypeError(`${artifactType} section "${section.id}" requires a blocks array.`);
    }
  });

  return report;
}
