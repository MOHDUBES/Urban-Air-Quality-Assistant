let DOMPurify = null;

// Lazy-load DOMPurify if available in this environment
if (typeof window !== 'undefined') {
  try {
    // DOMPurify is an optional peer dependency; graceful fallback if missing
    import('dompurify')
      .then((mod) => {
        DOMPurify = mod.default || mod;
      })
      .catch(() => {
        // Not available; use regex fallback
      });
  } catch (_) {}
}

/**
 * Strips all HTML tags from a string.
 * Uses DOMPurify when available; falls back to a regex-based approach.
 * @param {string} str
 * @returns {string}
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  if (DOMPurify) {
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
  // Regex fallback: strip HTML tags and decode common entities
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Truncates a string to `max` characters, appending '…' if truncated.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max = 200) {
  if (typeof str !== 'string') return '';
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '…';
}
