export async function processInBatches<T>(
  items: T[],
  batchSize: number,
  delayMs: number,
  handler: (item: T) => Promise<void>
): Promise<void> {
  if (items.length === 0) {
    return
  }

  const size = Math.max(1, batchSize)

  for (let index = 0; index < items.length; index += size) {
    const batch = items.slice(index, index + size)
    await Promise.all(batch.map((item) => handler(item)))

    const hasMore = index + size < items.length
    if (hasMore && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}
