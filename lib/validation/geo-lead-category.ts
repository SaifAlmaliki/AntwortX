/** Max length for GEO lead industry / category (matches API storage). */
export const GEO_LEAD_CATEGORY_MAX_LENGTH = 100;

/**
 * Normalize user-entered category for validation and API payload.
 */
export function normalizeGeoLeadCategoryInput(raw: string): string {
  return raw.trim().slice(0, GEO_LEAD_CATEGORY_MAX_LENGTH);
}

/**
 * True if the value is a usable industry phrase: non-empty after normalize and at least two words.
 * Aligns with LLM extraction guidance (natural phrase, not a single token).
 */
export function isValidGeoLeadCategoryNormalized(normalized: string): boolean {
  if (!normalized) return false;
  const words = normalized.split(/\s+/).filter(Boolean);
  return words.length >= 2;
}
