import type { LeadPhoneEnrichmentContext, PhoneLookupResult, PhoneProvider } from './types'
import { providerFetch } from './throttle'
import { normalizePhone } from './utils'

const NIMBUS_BASE_URL = 'https://api.enginy.ai/api/tmp/numbusLookup'
const NIMBUS_API_KEY = '000099998888'

export const nimbusLookupProvider: PhoneProvider = {
  id: 'nimbus',
  displayName: 'Nimbus Lookup',
  async lookup(context: LeadPhoneEnrichmentContext): Promise<PhoneLookupResult> {
    const url = new URL(NIMBUS_BASE_URL)
    url.searchParams.set('api', NIMBUS_API_KEY)

    const response = await providerFetch('nimbus', url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: context.email,
        jobTitle: context.jobTitle?.trim() || 'Unknown',
      }),
    })

    if (!response.ok) {
      throw new Error(`Nimbus Lookup failed with status ${response.status}`)
    }

    const data = (await response.json()) as {
      number?: number | null
      countryCode?: string | null
    }

    const number = normalizePhone(data.number)
    if (!number) {
      return { phone: null }
    }

    const countryCode = data.countryCode?.trim() || null
    const phone =
      countryCode && !number.startsWith('+') ? `+${countryCode}${number}` : number

    return { phone, countryCode }
  },
}
