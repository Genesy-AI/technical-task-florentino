import type { PhoneProviderId } from '../phoneProviders/types'

export const PHONE_PROVIDER_SEQUENCE: PhoneProviderId[] = ['orion', 'astra', 'nimbus']

export const PROVIDER_STATUS_BY_ID: Record<PhoneProviderId, string> = {
  orion: 'querying_orion',
  astra: 'querying_astra',
  nimbus: 'querying_nimbus',
}
