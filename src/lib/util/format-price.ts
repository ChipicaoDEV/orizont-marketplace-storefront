/**
 * Format a price in Romanian style: "1.250,90 lei" or "1.250,90 lei / bucată"
 * Prices from Medusa are stored as-is (45.90 = 45.90 lei), never divide by 100.
 */
export function formatRonPrice(amount: number, unit?: string | null): string {
  const formatted = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return unit ? `${formatted} lei / ${unit}` : `${formatted} lei`
}

/**
 * Derive a display unit from product metadata, falling back to "bucată".
 */
export function getPricingUnit(metadata?: Record<string, unknown> | null): string {
  return (metadata?.pricing_unit as string | undefined) || "bucată"
}
