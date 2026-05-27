import { describe, expect, it } from 'vitest'
import {
  ENRICH_PHONE_ACTIVITY_OPTIONS,
  ENRICH_PHONE_WORKFLOW_TIMEOUT,
  ENRICH_PHONE_WORKFLOW_ID_PREFIX,
} from './enrichPhoneConfig'

describe('enrichPhone Temporal configuration', () => {
  describe('Given a provider call activity runs', () => {
    it('When the activity is configured, Then it uses a short timeout', () => {
      expect(ENRICH_PHONE_ACTIVITY_OPTIONS.startToCloseTimeout).toBe('15 seconds')
    })

    it('When the activity fails, Then retries are bounded with exponential backoff', () => {
      expect(ENRICH_PHONE_ACTIVITY_OPTIONS.retry.maximumAttempts).toBe(3)
      expect(ENRICH_PHONE_ACTIVITY_OPTIONS.retry.backoffCoefficient).toBe(2)
    })

    it('When the workflow is executed, Then the overall execution has a bounded timeout', () => {
      expect(ENRICH_PHONE_WORKFLOW_TIMEOUT).toBe('2 minutes')
    })

    it('When starting enrichment, Then workflow ids are stable per lead', () => {
      expect(ENRICH_PHONE_WORKFLOW_ID_PREFIX).toBe('enrich-phone')
    })
  })
})
