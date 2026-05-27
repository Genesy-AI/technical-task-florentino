import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'
import { isIso3166Alpha2, normalizeCountryCode, stripCsvBom } from './countryCode'
import { parseCsv } from './csvParser'

const docsDir = join(dirname(fileURLToPath(import.meta.url)), '../../../docs')

describe('normalizeCountryCode', () => {
  describe('Given a valid ISO 3166-1 alpha-2 value', () => {
    it('When the value is lowercase, Then it is normalized to uppercase', () => {
      expect(normalizeCountryCode('us')).toBe('US')
    })

    it('When the value has surrounding whitespace, Then it is trimmed and normalized', () => {
      expect(normalizeCountryCode('  es  ')).toBe('ES')
    })
  })

  describe('Given a value with encoding artifacts', () => {
    it('When the value contains a UTF-8 BOM prefix, Then the BOM is stripped before normalization', () => {
      expect(normalizeCountryCode('\uFEFFUS')).toBe('US')
    })

    it('When the value contains a non-breaking space, Then it is normalized to a valid alpha-2 code', () => {
      expect(normalizeCountryCode('US\u00A0')).toBe('US')
    })
  })

  describe('Given an ISO 3166-1 alpha-3 country value', () => {
    it('When the value is USA, Then it is normalized to US', () => {
      expect(normalizeCountryCode('USA')).toBe('US')
    })

    it('When the value is usa in lowercase, Then it is normalized to US', () => {
      expect(normalizeCountryCode('usa')).toBe('US')
    })
  })

  describe('Given an invalid country value', () => {
    it('When the value is not a known alpha-2 or alpha-3 code, Then it returns undefined', () => {
      expect(normalizeCountryCode('XXX')).toBeUndefined()
      expect(normalizeCountryCode('12')).toBeUndefined()
      expect(normalizeCountryCode('VVM=')).toBeUndefined()
    })
  })
})

describe('CSV import country codes (ISO 3166-1 alpha-2)', () => {
  describe('Given a CSV with a "country" column header', () => {
    it('When the file is parsed, Then country codes are valid ISO alpha-2', () => {
      const csv = `firstName,lastName,email,country
John,Doe,john@test.com,us`

      const result = parseCsv(csv)

      expect(result[0].countryCode).toBe('US')
      expect(isIso3166Alpha2(result[0].countryCode!)).toBe(true)
    })
  })

  describe('Given the example leads-ok-1.csv file', () => {
    it('When the file is parsed, Then each lead has a valid ISO 3166-1 alpha-2 country code', () => {
      const csv = readFileSync(join(docsDir, 'leads-ok-1.csv'), 'utf8')
      const result = parseCsv(csv)

      expect(result.map((lead) => lead.countryCode)).toEqual(['TV', 'PK', 'SM', 'HR', 'KP'])
      result.forEach((lead) => {
        if (lead.countryCode) {
          expect(isIso3166Alpha2(lead.countryCode)).toBe(true)
        }
      })
    })
  })

  describe('Given CSV content with a UTF-8 BOM at the start of the file', () => {
    it('When the file is parsed, Then country codes are not garbled by the BOM', () => {
      const csv = stripCsvBom(`\uFEFFfirstName,lastName,email,countryCode
Jane,Doe,jane@test.com,US`)

      const result = parseCsv(csv)

      expect(result[0].countryCode).toBe('US')
    })
  })

  describe('Given a CSV row with country value USA', () => {
    it('When the file is parsed, Then the country code is stored as US', () => {
      const csv = `firstName,lastName,email,country
Jane,Smith,jane@example.com,USA`

      const result = parseCsv(csv)

      expect(result[0].countryCode).toBe('US')
    })
  })

  describe('Given a CSV with a countryCode header in uppercase', () => {
    it('When the file is parsed, Then the country code is preserved as ISO alpha-2', () => {
      const csv = `FIRSTNAME,LASTNAME,EMAIL,JOBTITLE,COUNTRYCODE,COMPANYNAME
John,Doe,john@example.com,Developer,US,Tech Corp`

      const result = parseCsv(csv)

      expect(result[0].countryCode).toBe('US')
    })
  })
})
