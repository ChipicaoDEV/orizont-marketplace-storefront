"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCartId } from "./cookies"

export type EuplatescFormData = {
  action_url: string
  form_fields: {
    amount: string
    curr: string
    invoice_id: string
    order_desc: string
    merch_id: string
    timestamp: string
    nonce: string
    fp_hash: string
    back_ref: string
    cancel_back_ref: string
  }
}

/**
 * Calls the Medusa backend to generate EuPlătesc payment form fields.
 * Returns the form data on success, or an error string on failure.
 *
 * The backend signs the request with HMAC-MD5 using the merchant's
 * EuPlătesc HMAC key (EUPLATESC_KEY env var).
 */
export async function getEuplatescFormData(
  countryCode: string
): Promise<EuplatescFormData | string> {
  const cartId = await getCartId()
  if (!cartId) return "Coșul nu a fost găsit. Adaugă produse și încearcă din nou."

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Retrieve cart total from the Medusa store API.
  // The total is passed to the backend route so it can generate the correct
  // EuPlătesc payment amount (the backend verifies cart existence).
  const cart = await sdk.client
    .fetch<{ cart: { id: string; total: number | null } }>(`/store/carts/${cartId}`, {
      method: "GET",
      query: { fields: "id,total" },
      headers,
    })
    .then(({ cart }) => cart)
    .catch(() => null)

  if (!cart) return "Coșul nu a fost găsit. Încearcă din nou."
  if (!cart.total || cart.total <= 0) return "Totalul coșului este invalid."

  const result = await sdk.client
    .fetch<EuplatescFormData | { error: string }>("/store/euplatesc/payment-url", {
      method: "POST",
      body: {
        cart_id: cartId,
        total: cart.total,
        country_code: countryCode,
      },
      headers,
    })
    .catch((e: any) => ({ error: e?.message ?? "Eroare la inițierea plății." }))

  if ("error" in result) {
    return (result as { error: string }).error
  }

  return result as EuplatescFormData
}
