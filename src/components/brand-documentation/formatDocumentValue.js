/**
 * Convert an arbitrary report value into readable, deterministic text.
 *
 * @param {*} value - Value supplied by a normalized report block.
 * @returns {string} Display-safe text.
 */
export function formatDocumentValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
