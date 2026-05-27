/** ISO 3166-1 alpha-2: exactly two uppercase ASCII letters (e.g. US, ES). */
export const ISO_3166_ALPHA2_REGEX = /^[A-Z]{2}$/

export function isIso3166Alpha2(code: string): boolean {
  return ISO_3166_ALPHA2_REGEX.test(code)
}

export function normalizeCountryCode(value: string | undefined | null): string | null {
  if (!value) return null

  const cleaned = value
    .replace(/^\uFEFF/, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim()
    .replace(/^["']+|["']+$/g, '')

  if (!cleaned) return null

  const lettersOnly = cleaned.replace(/[^A-Za-z]/g, '')
  if (lettersOnly.length !== 2) return null

  const alpha2 = lettersOnly.toUpperCase()
  return isIso3166Alpha2(alpha2) ? alpha2 : null
}
