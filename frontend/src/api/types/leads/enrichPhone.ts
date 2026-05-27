export type LeadsEnrichPhoneInput = {
  leadIds: number[]
}

export type LeadsEnrichPhoneOutput = {
  success: boolean
  startedCount: number
  started: number[]
  alreadyRunning: number[]
  errors: Array<{
    leadId: number
    leadName: string
    error: string
  }>
}
