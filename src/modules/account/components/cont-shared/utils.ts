import { HttpTypes } from "@medusajs/types"

export type OrderStatusDisplay = {
  label: string
  className: string
  step: number // 0=plasata, 1=confirmata, 2=pregatita, 3=livrata, 4=anulata
}

export function getOrderStatusDisplay(order: HttpTypes.StoreOrder): OrderStatusDisplay {
  const fulfillment = order.fulfillment_status
  const payment = order.payment_status
  const status = order.status

  if (status === "canceled") {
    return { label: "Anulată", className: "bg-red-50 text-red-500", step: 4 }
  }
  if (fulfillment === "delivered") {
    return { label: "Livrată / Ridicată", className: "bg-green-50 text-green-600", step: 3 }
  }
  if (fulfillment === "fulfilled" || fulfillment === "partially_fulfilled") {
    return { label: "Pregătită", className: "bg-blue-50 text-blue-600", step: 2 }
  }
  const paid = payment === "captured" || payment === "partially_captured"
  if (paid) {
    return { label: "Confirmată", className: "bg-orange-50 text-[#D4600E]", step: 1 }
  }
  return { label: "Plasată", className: "bg-gray-100 text-gray-500", step: 0 }
}

export function orderStatusConfig(status: string): { label: string; className: string } {
  switch (status) {
    case "pending":
      return { label: "Plasată", className: "bg-gray-100 text-gray-500" }
    case "completed":
      return { label: "Finalizată", className: "bg-green-50 text-green-600" }
    case "canceled":
      return { label: "Anulată", className: "bg-red-50 text-red-500" }
    case "requires_action":
      return { label: "Necesită acțiune", className: "bg-yellow-50 text-yellow-600" }
    default:
      return { label: status, className: "bg-gray-100 text-gray-500" }
  }
}

export function formatRon(amount: number | null | undefined): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
