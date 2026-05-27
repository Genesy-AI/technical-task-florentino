export type LeadsVerifyEmailsInput = {
  leadIds: number[]
}

export type LeadsVerifyEmailsOutput = {
  success: boolean
  startedCount: number
  alreadyRunning: number[]
  errors: Array<{
    leadId: number
    leadName: string
    error: string
  }>
}

