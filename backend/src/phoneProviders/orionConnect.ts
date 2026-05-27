import type { LeadPhoneEnrichmentContext, PhoneLookupResult, PhoneProvider } from './types'
import { providerFetch } from './throttle'
import { buildCompanyWebsite, buildFullName, normalizePhone } from './utils'

const ORION_BASE_URL = 'https://api.enginy.ai/api/tmp/orionConnect'
const ORION_AUTH_KEY = 'mySecretKey123'

export const orionConnectProvider: PhoneProvider = {
  id: 'orion',
  displayName: 'Orion Connect',
  async lookup(context: LeadPhoneEnrichmentContext): Promise<PhoneLookupResult> {
    const response = await providerFetch('orion', ORION_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-me': ORION_AUTH_KEY,
      },
      body: JSON.stringify({
        fullName: buildFullName(context),
        companyWebsite: buildCompanyWebsite(context),
      }),
    })

    if (!response.ok) {
      throw new Error(`Orion Connect failed with status ${response.status}`)
    }

    const data = (await response.json()) as { phone?: string | null }
    return { phone: normalizePhone(data.phone) }
  },
}
