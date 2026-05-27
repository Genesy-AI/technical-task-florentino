export const VERIFY_EMAIL_ACTIVITY_OPTIONS = {
  startToCloseTimeout: '30 seconds',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1 second',
    backoffCoefficient: 2,
  },
} as const

export const VERIFY_EMAIL_WORKFLOW_TIMEOUT = '45 seconds'
