import type { Client } from '@temporalio/client'
import {
  WorkflowExecutionAlreadyStartedError,
  WorkflowIdConflictPolicy,
  WorkflowIdReusePolicy,
} from '@temporalio/client'
import type { LeadPhoneEnrichmentContext } from '../phoneProviders'
import { enrichPhoneWorkflow } from '../workflows'
import {
  ENRICH_PHONE_WORKFLOW_ID_PREFIX,
  ENRICH_PHONE_WORKFLOW_TIMEOUT,
} from '../workflows/enrichPhoneConfig'
import { getEnrichBatchConfig } from './config'
import { processInBatches } from './batch'

export type StartPhoneEnrichmentResult = {
  started: number[]
  alreadyRunning: number[]
  errors: Array<{ leadId: number; leadName: string; error: string }>
}

type LeadForEnrichment = {
  id: number
  firstName: string
  lastName: string
  email: string
  jobTitle: string | null
  companyName: string | null
}

export function buildPhoneEnrichmentContext(lead: LeadForEnrichment): LeadPhoneEnrichmentContext {
  return {
    leadId: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    jobTitle: lead.jobTitle,
    companyName: lead.companyName,
  }
}

async function startEnrichmentWorkflow(
  client: Client,
  lead: LeadForEnrichment,
  result: StartPhoneEnrichmentResult
): Promise<void> {
  const workflowId = `${ENRICH_PHONE_WORKFLOW_ID_PREFIX}-${lead.id}`

  try {
    await client.workflow.start(enrichPhoneWorkflow, {
      taskQueue: 'myQueue',
      workflowId,
      args: [buildPhoneEnrichmentContext(lead)],
      workflowExecutionTimeout: ENRICH_PHONE_WORKFLOW_TIMEOUT,
      workflowIdReusePolicy: WorkflowIdReusePolicy.REJECT_DUPLICATE,
      workflowIdConflictPolicy: WorkflowIdConflictPolicy.FAIL,
    })
    result.started.push(lead.id)
  } catch (error) {
    if (error instanceof WorkflowExecutionAlreadyStartedError) {
      result.alreadyRunning.push(lead.id)
      return
    }

    result.errors.push({
      leadId: lead.id,
      leadName: `${lead.firstName} ${lead.lastName}`.trim(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export async function startPhoneEnrichmentWorkflows(
  client: Client,
  leads: LeadForEnrichment[]
): Promise<StartPhoneEnrichmentResult> {
  const result: StartPhoneEnrichmentResult = {
    started: [],
    alreadyRunning: [],
    errors: [],
  }

  const { size: batchSize, delayMs: batchIntervalMs } = getEnrichBatchConfig()

  await processInBatches(leads, batchSize, batchIntervalMs, async (lead) => {
    await startEnrichmentWorkflow(client, lead, result)
  })

  return result
}
