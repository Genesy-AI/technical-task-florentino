import pThrottle from 'p-throttle'
import { getProviderThrottleConfig } from './config'
import type { PhoneProviderId } from './types'

type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

const throttledFetchByProvider = new Map<PhoneProviderId, FetchFn>()

function createThrottledFetch(providerId: PhoneProviderId): FetchFn {
  const { limit, intervalMs } = getProviderThrottleConfig(providerId)
  const throttle = pThrottle({
    limit,
    interval: intervalMs,
    strict: true,
  })

  return throttle((input: RequestInfo | URL, init?: RequestInit) => fetch(input, init))
}

function getThrottledFetch(providerId: PhoneProviderId): FetchFn {
  const existing = throttledFetchByProvider.get(providerId)
  if (existing) {
    return existing
  }

  const throttledFetch = createThrottledFetch(providerId)
  throttledFetchByProvider.set(providerId, throttledFetch)
  return throttledFetch
}

export function providerFetch(
  providerId: PhoneProviderId,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  return getThrottledFetch(providerId)(input, init)
}

export function resetProviderThrottles(): void {
  throttledFetchByProvider.clear()
}
