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
  turnstileToken: string
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error("[CereOferta] TURNSTILE_SECRET_KEY not set")
    return false
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  )

  const data = await res.json()
  return data.success === true
}

export async function submitQuoteRequest(
  payload: QuoteRequestPayload
): Promise<{ ok: true } | { error: string }> {
  // Verify Turnstile token first
  const valid = await verifyTurnstile(payload.turnstileToken)
  if (!valid) {
    return { error: "Verificarea de securitate a eșuat. Te rugăm să încerci din nou." }
  }

  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const { turnstileToken: _, ...safePayload } = payload

  try {
    const res = await fetch(`${backendUrl}/store/quote-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify(safePayload),
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
