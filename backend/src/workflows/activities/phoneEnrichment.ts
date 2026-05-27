import { PrismaClient } from '@prisma/client'
import {
  lookupPhoneWithProvider,
  type LeadPhoneEnrichmentContext,
  type PhoneLookupResult,
  type PhoneProviderId,
} from '../../phoneProviders'
import { PHONE_ENRICHMENT_STATUS, type PhoneEnrichmentStatus } from '../../phoneEnrichment/status'

const prisma = new PrismaClient()

export async function lookupPhoneFromProvider(
  providerId: PhoneProviderId,
  context: LeadPhoneEnrichmentContext
): Promise<PhoneLookupResult> {
  return lookupPhoneWithProvider(providerId, context)
}

export async function updatePhoneEnrichmentStatus(
  leadId: number,
  status: PhoneEnrichmentStatus
): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: { phoneEnrichmentStatus: status },
  })
}

export async function saveEnrichedPhone(
  leadId: number,
  phone: string,
  providerId: PhoneProviderId,
  countryCode?: string | null
): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      phone,
      phoneEnrichmentProvider: providerId,
      phoneEnrichmentStatus: PHONE_ENRICHMENT_STATUS.found,
      ...(countryCode ? { countryCode } : {}),
    },
  })
}

export async function markPhoneEnrichmentNoData(leadId: number): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      phoneEnrichmentStatus: PHONE_ENRICHMENT_STATUS.noDataFound,
      phoneEnrichmentProvider: null,
    },
  })
}

export async function markPhoneEnrichmentFailed(leadId: number): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      phoneEnrichmentStatus: PHONE_ENRICHMENT_STATUS.failed,
    },
  })
}
