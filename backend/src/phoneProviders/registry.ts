import { astraDialerProvider } from './astraDialer'
import { nimbusLookupProvider } from './nimbusLookup'
import { orionConnectProvider } from './orionConnect'
import type { LeadPhoneEnrichmentContext, PhoneLookupResult, PhoneProvider, PhoneProviderId } from './types'

const providersById: Record<PhoneProviderId, PhoneProvider> = {
  orion: orionConnectProvider,
  astra: astraDialerProvider,
  nimbus: nimbusLookupProvider,
}

export function getPhoneProvider(providerId: PhoneProviderId): PhoneProvider {
  return providersById[providerId]
}

export async function lookupPhoneWithProvider(
  providerId: PhoneProviderId,
  context: LeadPhoneEnrichmentContext
): Promise<PhoneLookupResult> {
  return getPhoneProvider(providerId).lookup(context)
}
