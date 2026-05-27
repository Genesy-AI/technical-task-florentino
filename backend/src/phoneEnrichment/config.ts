function readPositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function getEnrichBatchConfig() {
  return {
    size: readPositiveInt(process.env.PHONE_ENRICH_BATCH_SIZE, 5),
    delayMs: readPositiveInt(
      process.env.PHONE_ENRICH_BATCH_INTERVAL_MS ?? process.env.PHONE_ENRICH_BATCH_DELAY_MS,
      1000
    ),
  }
}
