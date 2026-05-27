export const PHONE_ENRICHMENT_STATUS = {
  pending: 'pending',
  queryingOrion: 'querying_orion',
  queryingAstra: 'querying_astra',
  queryingNimbus: 'querying_nimbus',
  found: 'found',
  noDataFound: 'no_data_found',
  failed: 'failed',
} as const

export type PhoneEnrichmentStatus =
  (typeof PHONE_ENRICHMENT_STATUS)[keyof typeof PHONE_ENRICHMENT_STATUS]
