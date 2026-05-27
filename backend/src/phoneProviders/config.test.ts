import { afterEach, describe, expect, it } from 'vitest'
import { getAllProviderThrottleConfigs, getProviderThrottleConfig } from './config'

describe('phone provider throttle config', () => {
  afterEach(() => {
    delete process.env.PHONE_PROVIDER_ORION_LIMIT
    delete process.env.PHONE_PROVIDER_ORION_INTERVAL_MS
    delete process.env.PHONE_PROVIDER_ASTRA_LIMIT
    delete process.env.PHONE_PROVIDER_NIMBUS_LIMIT
  })

  it('returns default limits per provider', () => {
    expect(getProviderThrottleConfig('orion')).toEqual({ limit: 2, intervalMs: 1000 })
    expect(getProviderThrottleConfig('astra')).toEqual({ limit: 10, intervalMs: 1000 })
    expect(getProviderThrottleConfig('nimbus')).toEqual({ limit: 5, intervalMs: 1000 })
  })

  it('reads provider limits from environment variables', () => {
    process.env.PHONE_PROVIDER_ORION_LIMIT = '4'
    process.env.PHONE_PROVIDER_ORION_INTERVAL_MS = '2000'

    expect(getProviderThrottleConfig('orion')).toEqual({ limit: 4, intervalMs: 2000 })
  })

  it('exposes all provider configs', () => {
    const configs = getAllProviderThrottleConfigs()
    expect(Object.keys(configs).sort()).toEqual(['astra', 'nimbus', 'orion'])
  })
})
