export type PhoneProviderId = 'orion' | 'astra' | 'nimbus'

export type LeadPhoneEnrichmentContext = {
  leadId: number
  firstName: string
  lastName: string
  email: string
  jobTitle: string | null
  companyName: string | null
}

export type PhoneLookupResult = {
  phone: string | null
  countryCode?: string | null
}

export interface PhoneProvider {
  id: PhoneProviderId
  displayName: string
  lookup(context: LeadPhoneEnrichmentContext): Promise<PhoneLookupResult>
}
