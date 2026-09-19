import { asArray, asRecord, firstText, isRecord, toText } from './helpers.js';

const PUBLIC_PROTOCOL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

export function toPublicAssetUrl(path, publicBasePath = '/') {
  const original = toText(path).replaceAll('\\', '/');
  if (!original) return '';
  if (PUBLIC_PROTOCOL.test(original) || original.startsWith('#')) {
    return original;
  }

  if (original.startsWith('/brand-reports/')) {
    const normalizedBase = toText(publicBasePath).replaceAll('\\', '/');
    const markerIndex = normalizedBase.indexOf('/brand-reports/');
    const deploymentPrefix = markerIndex >= 0 ? normalizedBase.slice(0, markerIndex) : '';
    return `${ deploymentPrefix }${ original }`;
  }

  if (original.startsWith('/')) return original;

  const publicMarker = original.lastIndexOf('/public/');
  const relative = (publicMarker >= 0 ? original.slice(publicMarker + 8) : original)
    .replace(/^(?:\.\.\/|\.\/)+/, '')
    .replace(/^\/+/, '');

  const base = toText(publicBasePath) || '/';
  if (base === '/') return `/${relative}`;
  return `/${[trimSlashes(base), trimSlashes(relative)].filter(Boolean).join('/')}`;
}

export function createAssetIndex(assetRegistry) {
  const registry = asRecord(assetRegistry);
  const assets = Array.isArray(assetRegistry)
    ? assetRegistry
    : asArray(registry.assets);

  return new Map(
    assets
      .filter(isRecord)
      .map((asset) => [firstText(asset.asset_id, asset.evidence_id, asset.id), asset])
      .filter(([id]) => id),
  );
}

export function resolveAsset(assetOrId, assetIndex) {
  if (isRecord(assetOrId)) {
    const id = firstText(assetOrId.asset_id, assetOrId.evidence_id, assetOrId.id);
    return { ...asRecord(assetIndex?.get(id)), ...assetOrId };
  }
  const id = toText(assetOrId);
  return { asset_id: id, ...asRecord(assetIndex?.get(id)) };
}
