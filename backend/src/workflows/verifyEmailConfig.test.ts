import { describe, expect, it } from 'vitest'
import { VERIFY_EMAIL_ACTIVITY_OPTIONS, VERIFY_EMAIL_WORKFLOW_TIMEOUT } from './verifyEmailConfig'

describe('verifyEmail Temporal configuration', () => {
  describe('Given the email verification workflow runs a slow provider', () => {
    it('When the activity is configured, Then it allows enough time to finish before timing out', () => {
      expect(VERIFY_EMAIL_ACTIVITY_OPTIONS.startToCloseTimeout).toBe('30 seconds')
    })

    it('When the activity fails, Then retries are bounded instead of retrying forever', () => {
      expect(VERIFY_EMAIL_ACTIVITY_OPTIONS.retry.maximumAttempts).toBe(3)
    })

    it('When the workflow is executed, Then the overall execution has a bounded timeout', () => {
      expect(VERIFY_EMAIL_WORKFLOW_TIMEOUT).toBe('45 seconds')
    })
  })
})
