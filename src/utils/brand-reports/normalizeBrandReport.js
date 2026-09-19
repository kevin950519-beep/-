import { adaptExtendedBrandAnatomy } from './adaptExtendedBrandAnatomy.js';
import { adaptLandingMaterials } from './adaptLandingMaterials.js';
import { adaptSourceBrandAnalysis } from './adaptSourceBrandAnalysis.js';
import { asRecord, firstText } from './helpers.js';
import { assertFixedReportStructure } from './reportStructure.js';

const ADAPTERS = {
  source_brand_analysis: adaptSourceBrandAnalysis,
  extended_brand_anatomy: adaptExtendedBrandAnatomy,
  landing_materials: adaptLandingMaterials,
};

export function normalizeBrandReport(input, context = {}) {
  const model = asRecord(input);
  const artifactType = firstText(model.artifact_type, model.artifactType);
  const adapter = ADAPTERS[artifactType];

  if (!adapter) {
    const supported = Object.keys(ADAPTERS).join(', ');
    throw new TypeError(`Unsupported brand report artifact_type "${artifactType || 'missing'}". Expected one of: ${supported}.`);
  }

  return assertFixedReportStructure(adapter(model, asRecord(context)), artifactType);
}

export function isSupportedBrandReport(input) {
  const model = asRecord(input);
  return Boolean(ADAPTERS[firstText(model.artifact_type, model.artifactType)]);
}

export const supportedBrandReportTypes = Object.freeze(Object.keys(ADAPTERS));
