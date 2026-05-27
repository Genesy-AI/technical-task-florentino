import type { LeadPhoneEnrichmentContext, PhoneLookupResult, PhoneProvider } from './types'
import { providerFetch } from './throttle'
import { normalizePhone } from './utils'

const ASTRA_BASE_URL = 'https://api.enginy.ai/api/tmp/astraDialer'
const ASTRA_API_KEY = '1234jhgf'

export const astraDialerProvider: PhoneProvider = {
  id: 'astra',
  displayName: 'Astra Dialer',
  async lookup(context: LeadPhoneEnrichmentContext): Promise<PhoneLookupResult> {
    const response = await providerFetch('astra', ASTRA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apiKey: ASTRA_API_KEY,
      },
      body: JSON.stringify({
        email: context.email,
      }),
    })

    if (!response.ok) {
      throw new Error(`Astra Dialer failed with status ${response.status}`)
    }

    const data = (await response.json()) as { phoneNmbr?: string | null }
    return { phone: normalizePhone(data.phoneNmbr) }
  },
}
