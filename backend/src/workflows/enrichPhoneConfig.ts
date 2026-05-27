export const ENRICH_PHONE_ACTIVITY_OPTIONS = {
  startToCloseTimeout: '15 seconds',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1 second',
    backoffCoefficient: 2,
  },
} as const

export const ENRICH_PHONE_WORKFLOW_TIMEOUT = '2 minutes'

export const ENRICH_PHONE_WORKFLOW_ID_PREFIX = 'enrich-phone'
