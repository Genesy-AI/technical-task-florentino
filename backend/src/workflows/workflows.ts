import { proxyActivities } from '@temporalio/workflow'
import type * as activities from './activities'
import { VERIFY_EMAIL_ACTIVITY_OPTIONS } from './verifyEmailConfig'

const {
  verifyEmail,
  updateEmailVerificationStatus,
  saveEmailVerificationResult,
  markEmailVerificationFailed,
} = proxyActivities<typeof activities>(VERIFY_EMAIL_ACTIVITY_OPTIONS)

export type VerifyEmailWorkflowInput = {
  leadId: number
  email: string
}

export async function verifyEmailWorkflow({ leadId, email }: VerifyEmailWorkflowInput): Promise<void> {
  try {
    await updateEmailVerificationStatus(leadId, 'verifying')
    const isVerified = await verifyEmail(email)
    await saveEmailVerificationResult(leadId, isVerified)
  } catch {
    await markEmailVerificationFailed(leadId)
  }
}

export { enrichPhoneWorkflow } from './enrichPhoneWorkflow'
export type { EnrichPhoneWorkflowResult } from './enrichPhoneWorkflow'
