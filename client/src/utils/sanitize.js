import DOMPurify from 'dompurify';

/**
 * Strips all HTML tags and malicious payloads from a string.
 * Uses DOMPurify when available; falls back to a robust regex-based approach.
 * @param {string} str
 * @returns {string}
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  if (typeof window !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
  }
  // Fallback: strip script and style tags with their contents, then all tags, then decode entities
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
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
