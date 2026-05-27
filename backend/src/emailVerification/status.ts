export const EMAIL_VERIFICATION_STATUS = {
  verifying: 'verifying',
  completed: 'completed',
  failed: 'failed',
} as const

export type EmailVerificationStatus =
  (typeof EMAIL_VERIFICATION_STATUS)[keyof typeof EMAIL_VERIFICATION_STATUS]
