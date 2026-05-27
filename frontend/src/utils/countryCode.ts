/** ISO 3166-1 alpha-2: exactly two uppercase ASCII letters (e.g. US, ES). */
export const ISO_3166_ALPHA2_REGEX = /^[A-Z]{2}$/

export function isIso3166Alpha2(code: string): boolean {
  return ISO_3166_ALPHA2_REGEX.test(code)
}

/**
 * Normalizes a raw CSV country value to ISO 3166-1 alpha-2.
 * Strips BOM/zero-width chars, quotes, and non-letters so encoding artifacts do not surface as garbled text.
 */
export function normalizeCountryCode(value: string | undefined): string | undefined {
  if (!value) return undefined

  const cleaned = value
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim()
    .replace(/^["']+|["']+$/g, '')

  if (!cleaned) return undefined

  const lettersOnly = cleaned.replace(/[^A-Za-z]/g, '')
  if (lettersOnly.length !== 2) return undefined

  const alpha2 = lettersOnly.toUpperCase()
  return isIso3166Alpha2(alpha2) ? alpha2 : undefined
}

export function stripCsvBom(content: string): string {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content
}
