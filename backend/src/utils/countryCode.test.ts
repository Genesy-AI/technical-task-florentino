import { describe, expect, it } from 'vitest'
import { isIso3166Alpha2, normalizeCountryCode } from './countryCode'

describe('normalizeCountryCode (backend)', () => {
  describe('Given a raw country value from a bulk import payload', () => {
    it('When the value is a valid lowercase alpha-2 code, Then it is stored as uppercase ISO 3166-1 alpha-2', () => {
      expect(normalizeCountryCode('pk')).toBe('PK')
      expect(isIso3166Alpha2(normalizeCountryCode('pk')!)).toBe(true)
    })

    it('When the value contains garbled non-letter characters, Then it is rejected', () => {
      expect(normalizeCountryCode('VVM=')).toBeNull()
    })

    it('When the value is an invalid three-letter code, Then it is rejected', () => {
      expect(normalizeCountryCode('XXX')).toBeNull()
    })
  })
})
