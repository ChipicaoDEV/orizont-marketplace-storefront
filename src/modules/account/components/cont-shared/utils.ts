export function orderStatusConfig(status: string): { label: string; className: string } {
  switch (status) {
    case "pending":
      return { label: "Plasată", className: "bg-blue-50 text-blue-600" }
    case "processing":
      return { label: "În procesare", className: "bg-orange-50 text-[#F27A1A]" }
    case "shipped":
      return { label: "Expediată", className: "bg-purple-50 text-purple-600" }
    case "completed":
      return { label: "Livrată", className: "bg-green-50 text-green-600" }
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
