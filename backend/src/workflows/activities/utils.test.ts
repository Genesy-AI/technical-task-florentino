import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyEmail } from './utils'

describe('verifyEmail activity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Given a lead email address', () => {
    it('When the email contains john.doe, Then verification returns false', async () => {
      await expect(verifyEmail('john.doe@example.com')).resolves.toBe(false)
    })

    it('When the email contains a plus sign, Then verification returns false', async () => {
      await expect(verifyEmail('user+tag@example.com')).resolves.toBe(false)
    })

    it('When the email is valid and quick to verify, Then verification returns true', async () => {
      await expect(verifyEmail('ada.lovelace@example.com')).resolves.toBe(true)
    })

    it('When the email contains jane.smith, Then verification completes after the provider delay and returns true', async () => {
      const resultPromise = verifyEmail('jane.smith@example.com')

      await vi.advanceTimersByTimeAsync(20_000)

      await expect(resultPromise).resolves.toBe(true)
    })
  })
})
