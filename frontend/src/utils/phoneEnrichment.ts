export const PHONE_ENRICHMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Starting…',
  querying_orion: 'Querying Orion Connect…',
  querying_astra: 'Querying Astra Dialer…',
  querying_nimbus: 'Querying Nimbus Lookup…',
  found: 'Phone found',
  no_data_found: 'No data found',
  failed: 'Enrichment failed',
}

export function isPhoneEnrichmentInProgress(status: string | null | undefined): boolean {
  if (!status) {
    return false
  }

  return ['pending', 'querying_orion', 'querying_astra', 'querying_nimbus'].includes(status)
}

export function getPhoneEnrichmentStatusLabel(status: string | null | undefined): string | null {
  if (!status) {
    return null
  }

  return PHONE_ENRICHMENT_STATUS_LABELS[status] ?? status
}
