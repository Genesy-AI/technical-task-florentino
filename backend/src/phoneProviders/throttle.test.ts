import { afterEach, describe, expect, it, vi } from 'vitest'
import { providerFetch, resetProviderThrottles } from './throttle'

describe('providerFetch throttling', () => {
  afterEach(() => {
    resetProviderThrottles()
    vi.unstubAllGlobals()
    delete process.env.PHONE_PROVIDER_ASTRA_LIMIT
    delete process.env.PHONE_PROVIDER_ASTRA_INTERVAL_MS
  })

  it('limits concurrent provider calls according to config', async () => {
    process.env.PHONE_PROVIDER_ASTRA_LIMIT = '1'
    process.env.PHONE_PROVIDER_ASTRA_INTERVAL_MS = '1000'
    resetProviderThrottles()

    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    vi.useFakeTimers()

    const first = providerFetch('astra', 'https://example.com')
    const second = providerFetch('astra', 'https://example.com')

    await Promise.resolve()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1000)
    await Promise.all([first, second])

    expect(fetchMock).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})
