const EMPTY_VALUES = new Set([null, undefined, '']);

export function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function asRecord(value) {
  return isRecord(value) ? value : {};
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function hasContent(value) {
  if (EMPTY_VALUES.has(value)) return false;
  if (Array.isArray(value)) return value.some(hasContent);
  if (isRecord(value)) return Object.values(value).some(hasContent);
  return true;
}

export function toText(value) {
  if (EMPTY_VALUES.has(value)) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(' · ');
  if (isRecord(value)) return JSON.stringify(value);
  return String(value).trim();
}

export function titleize(value) {
  return toText(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

export function slugify(value, fallback = 'section') {
  const slug = toText(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

export function uniqueStrings(values) {
  return [...new Set(asArray(values).map(toText).filter(Boolean))];
}

export function firstText(...values) {
  return values.map(toText).find(Boolean) || '';
}

export function oneSentence(value) {
  const text = toText(value).replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const firstSentence = text.match(/^.*?[.!?](?=\s|$)/u)?.[0];
  return firstSentence?.trim() || text;
}

export function firstInsight(...values) {
  return values.map(oneSentence).find(Boolean) || '';
}

export function firstContent(...values) {
  return values.find(hasContent);
}

export function pickValue(record, candidates) {
  const entries = Object.entries(asRecord(record));
  const normalizeKey = (value) => value.trim().toLowerCase().replace(/[-_]+/gu, ' ');
  const match = entries.find(([key]) =>
    candidates.some((candidate) => normalizeKey(key) === normalizeKey(candidate)),
  );
  return match?.[1];
}

export function displayValue(value) {
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(' · ');
  if (isRecord(value)) {
    return Object.entries(value)
      .filter(([, item]) => hasContent(item))
      .map(([key, item]) => `${titleize(key)}: ${displayValue(item)}`)
      .join(' · ');
  }
  return toText(value);
}

export function meaningfulEntries(record) {
  return Object.entries(asRecord(record)).filter(([, value]) => hasContent(value));
}

export function makeSection({ id, index, label, title, insight, description, blocks = [] }) {
  const normalizedInsight = firstInsight(insight);

  return {
    id: slugify(id || title, `section-${index}`),
    index,
    label: toText(label) || `Section ${String(index).padStart(2, '0')}`,
    title: toText(title) || 'Untitled section',
    ...(normalizedInsight ? { insight: normalizedInsight } : {}),
    ...(toText(description) ? { description: toText(description) } : {}),
    blocks: asArray(blocks).filter(Boolean),
  };
}
