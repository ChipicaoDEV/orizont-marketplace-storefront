import { HttpTypes } from "@medusajs/types"

// ─── Status resolution ───────────────────────────────────────────────────────

type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

function statusFromQuantity(qty: number): StockStatus {
  if (qty > 10) return "in_stock"
  if (qty > 0) return "low_stock"
  return "out_of_stock"
}

/**
 * Converts a Medusa variant into an effective quantity number that can be
 * passed directly to StockBadge or used elsewhere.
 *
 * Rules:
 *   - manage_inventory = false  → treat as unlimited (999)
 *   - allow_backorder = true    → treat as unlimited (999)
 *   - otherwise                 → use inventory_quantity (0 if missing)
 */
function getVariantQuantity(
  variant?: HttpTypes.StoreProductVariant & { inventory_quantity?: number }
): number {
  if (!variant) return 0
  if (!variant.manage_inventory) return 999
  if (variant.allow_backorder) return 999
  return variant.inventory_quantity ?? 0
}

// ─── Badge rendering ─────────────────────────────────────────────────────────

type StockBadgeProps = {
  /** Raw inventory quantity. Use getVariantQuantity() to derive this from a variant. */
  quantity: number
  className?: string
}

const StockBadge = ({ quantity, className = "" }: StockBadgeProps) => {
  const status = statusFromQuantity(quantity)

  const config = {
    in_stock: {
      dot: "bg-[#2E7D32]",
      text: "text-[#2E7D32]",
      label: "În stoc",
    },
    low_stock: {
      dot: "bg-[#F27A1A]",
      text: "text-[#F27A1A]",
      // Show exact count so buyers know how many are left
      label: `Stoc limitat (${quantity} buc.)`,
    },
    out_of_stock: {
      dot: "bg-[#D32F2F]",
      text: "text-[#D32F2F]",
      label: "Stoc epuizat",
    },
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 ${className}`}
      aria-label={config.label}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`}
        aria-hidden="true"
      />
      <span className={`text-xs font-medium ${config.text}`}>
        {config.label}
      </span>
    </span>
  )
}

export { getVariantQuantity, statusFromQuantity }
export type { StockStatus }
export default StockBadge
