import type { PhoneProviderId } from './types'

export type ProviderThrottleConfig = {
  limit: number
  intervalMs: number
}

const DEFAULT_PROVIDER_LIMITS: Record<PhoneProviderId, ProviderThrottleConfig> = {
  orion: { limit: 2, intervalMs: 1000 },
  astra: { limit: 10, intervalMs: 1000 },
  nimbus: { limit: 5, intervalMs: 1000 },
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function getProviderThrottleConfig(providerId: PhoneProviderId): ProviderThrottleConfig {
  const defaults = DEFAULT_PROVIDER_LIMITS[providerId]
  const prefix = `PHONE_PROVIDER_${providerId.toUpperCase()}`

  return {
    limit: parsePositiveInt(process.env[`${prefix}_LIMIT`], defaults.limit),
    intervalMs: parsePositiveInt(process.env[`${prefix}_INTERVAL_MS`], defaults.intervalMs),
  }
}

export function getAllProviderThrottleConfigs(): Record<PhoneProviderId, ProviderThrottleConfig> {
  return {
    orion: getProviderThrottleConfig('orion'),
    astra: getProviderThrottleConfig('astra'),
    nimbus: getProviderThrottleConfig('nimbus'),
  }
}
