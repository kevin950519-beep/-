/**
 * Convert a full source URL into a compact visible hostname label.
 *
 * @param {string} url - Complete source URL preserved in the link destination.
 * @returns {string} Compact hostname or a generic source label.
 */
export function compactUrlLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./u, '') || 'View source';
  } catch {
    return 'View source';
  }
}
