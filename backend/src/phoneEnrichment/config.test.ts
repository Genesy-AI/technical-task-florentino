import { afterEach, describe, expect, it } from 'vitest'
import { getEnrichBatchConfig } from './config'

describe('phone enrichment batch config', () => {
  afterEach(() => {
    delete process.env.PHONE_ENRICH_BATCH_SIZE
    delete process.env.PHONE_ENRICH_BATCH_INTERVAL_MS
    delete process.env.PHONE_ENRICH_BATCH_DELAY_MS
  })

  it('returns default batch config', () => {
    expect(getEnrichBatchConfig()).toEqual({ size: 5, delayMs: 1000 })
  })

  it('reads batch config from environment variables', () => {
    process.env.PHONE_ENRICH_BATCH_SIZE = '3'
    process.env.PHONE_ENRICH_BATCH_INTERVAL_MS = '250'

    expect(getEnrichBatchConfig()).toEqual({ size: 3, delayMs: 250 })
  })
})
