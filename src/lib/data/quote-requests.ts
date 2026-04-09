"use server"

export type QuoteRequestPayload = {
  product_id: string
  variant_id: string | null
  product_title: string
  quantity: number
  delivery_type: "livrare" | "ridicare"
  full_name: string
  phone: string
  email: string
  address: string | null
}

export async function submitQuoteRequest(
  payload: QuoteRequestPayload
): Promise<{ ok: true } | { error: string }> {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const res = await fetch(`${backendUrl}/store/quote-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = data.message || data.error || `Eroare server (${res.status})`
      console.error("[CereOferta] backend error:", data)
      return { error: msg }
    }

    return { ok: true }
  } catch (e: any) {
    console.error("[CereOferta] fetch error:", e)
    return { error: e?.message ?? "A apărut o eroare de conexiune." }
  }
}
