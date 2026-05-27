import { describe, expect, it } from 'vitest'
import { buildCompanyWebsite, buildFullName, normalizePhone } from './utils'
import type { LeadPhoneEnrichmentContext } from './types'

const baseContext: LeadPhoneEnrichmentContext = {
  leadId: 1,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  jobTitle: 'CTO',
  companyName: 'Analytical Engines',
}

describe('phone provider utils', () => {
  it('builds full name from lead context', () => {
    expect(buildFullName(baseContext)).toBe('Ada Lovelace')
  })

  it('derives company website from company name', () => {
    expect(buildCompanyWebsite(baseContext)).toBe('analyticalengines.com')
  })

  it('falls back to email domain when company is missing', () => {
    expect(
      buildCompanyWebsite({
        ...baseContext,
        companyName: null,
      })
    ).toBe('example.com')
  })

  it('normalizes empty phone values to null', () => {
    expect(normalizePhone(null)).toBeNull()
    expect(normalizePhone('')).toBeNull()
    expect(normalizePhone('  +123  ')).toBe('+123')
  })
})
