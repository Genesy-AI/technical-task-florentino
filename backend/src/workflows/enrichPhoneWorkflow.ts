import { proxyActivities } from '@temporalio/workflow'
import type { LeadPhoneEnrichmentContext, PhoneProviderId } from '../phoneProviders/types'
import { PHONE_PROVIDER_SEQUENCE, PROVIDER_STATUS_BY_ID } from '../phoneEnrichment/constants'
import { PHONE_ENRICHMENT_STATUS, type PhoneEnrichmentStatus } from '../phoneEnrichment/status'
import type * as activities from './activities'
import { ENRICH_PHONE_ACTIVITY_OPTIONS } from './enrichPhoneConfig'

const {
  lookupPhoneFromProvider,
  updatePhoneEnrichmentStatus,
  saveEnrichedPhone,
  markPhoneEnrichmentNoData,
  markPhoneEnrichmentFailed,
} = proxyActivities<typeof activities>(ENRICH_PHONE_ACTIVITY_OPTIONS)

export type EnrichPhoneWorkflowResult = {
  leadId: number
  phone: string | null
  provider: PhoneProviderId | null
  status: 'found' | 'no_data_found' | 'failed'
}

export async function enrichPhoneWorkflow(
  context: LeadPhoneEnrichmentContext
): Promise<EnrichPhoneWorkflowResult> {
  try {
    await updatePhoneEnrichmentStatus(context.leadId, PHONE_ENRICHMENT_STATUS.pending)

    for (const providerId of PHONE_PROVIDER_SEQUENCE) {
      await updatePhoneEnrichmentStatus(
        context.leadId,
        PROVIDER_STATUS_BY_ID[providerId] as PhoneEnrichmentStatus
      )

      const result = await lookupPhoneFromProvider(providerId, context)
      if (result.phone) {
        await saveEnrichedPhone(context.leadId, result.phone, providerId, result.countryCode)
        return {
          leadId: context.leadId,
          phone: result.phone,
          provider: providerId,
          status: 'found',
        }
      }
    }

    await markPhoneEnrichmentNoData(context.leadId)
    return {
      leadId: context.leadId,
      phone: null,
      provider: null,
      status: 'no_data_found',
    }
  } catch {
    await markPhoneEnrichmentFailed(context.leadId)
    return {
      leadId: context.leadId,
      phone: null,
      provider: null,
      status: 'failed',
    }
  }
}
