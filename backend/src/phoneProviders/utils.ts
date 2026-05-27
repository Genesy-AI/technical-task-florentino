import type { LeadPhoneEnrichmentContext } from './types'

export function buildFullName(context: LeadPhoneEnrichmentContext): string {
  return `${context.firstName} ${context.lastName}`.trim()
}

export function buildCompanyWebsite(context: LeadPhoneEnrichmentContext): string {
  if (context.companyName?.trim()) {
    const slug = context.companyName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
    if (slug) {
      return `${slug}.com`
    }
  }

  const domain = context.email.split('@')[1]?.trim()
  return domain || 'example.com'
}

export function normalizePhone(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null
  }

  const phone = String(value).trim()
  return phone.length > 0 ? phone : null
}
