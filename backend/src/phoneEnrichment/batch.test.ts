import { describe, expect, it, vi } from 'vitest'
import { processInBatches } from './batch'

describe('processInBatches', () => {
  it('processes all items in order across batches', async () => {
    const handled: number[] = []

    await processInBatches([1, 2, 3, 4, 5], 2, 0, async (item) => {
      handled.push(item)
    })

    expect(handled).toEqual([1, 2, 3, 4, 5])
  })

  it('waits between batches when delay is configured', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

    await processInBatches([1, 2, 3], 2, 100, async () => {})

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100)
    setTimeoutSpy.mockRestore()
  })
})
