import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { retrieveCart, initiatePaymentSession, placeOrder } from "@lib/data/cart"

export const metadata: Metadata = {
  title: "Procesare plată | Orizont",
}

// EuPlătesc returns these GET params on the back_ref redirect
type EpParams = {
  cart_id?: string
  amount?: string
  curr?: string
  invoice_id?: string
  ep_id?: string
  merch_id?: string
  action?: string    // "0" = approved
  message?: string
  approval?: string
  timestamp?: string
  nonce?: string
  fp_hash?: string
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<EpParams>
}

/**
 * /checkout/euplatesc/success
 *
 * EuPlătesc redirects the customer here after a payment attempt.
 * We check the `action` code, then complete the Medusa order.
 *
 * Note: Full HMAC verification of the response hash requires the EUPLATESC_KEY
 * on the server. For now we rely on the `action` field and the backend IPN for
 * authoritative payment confirmation.
 */
export default async function EuplatescSuccessPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const sp = await searchParams

  const cartId = sp.cart_id

  if (!cartId) {
    redirect(`/${countryCode}/checkout?step=payment`)
  }

  // EuPlătesc signals success with action="0"
  if (sp.action !== "0") {
    const msg = sp.message ? encodeURIComponent(sp.message) : ""
    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}${msg ? `&message=${msg}` : ""}`
    )
  }

  // Retrieve cart
  const cart = await retrieveCart(cartId)

  if (!cart) {
    redirect(`/${countryCode}/checkout?step=payment`)
  }

  // Initiate payment session (system_default = manual/COD-style capture).
  // This marks the payment as "initiated" in Medusa before completing the cart.
  // Ignore errors in case a session was already initiated.
  await initiatePaymentSession(cart, { provider_id: "pp_system_default" }).catch(() => {})

  // Complete the cart → creates the Medusa order.
  // placeOrder() calls redirect() internally on success (NEXT_REDIRECT throw).
  // We catch it and rethrow so Next.js can handle the navigation.
  try {
    await placeOrder(cartId)
    // placeOrder returns the cart object if the order was not created.
    // Redirect to fail page in that case.
    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent("Comanda nu a putut fi finalizată. Contactează-ne.")}`
    )
  } catch (e) {
    // Rethrow Next.js redirect errors so the navigation continues
    if (isRedirectError(e)) throw e

    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent("Eroare la finalizarea comenzii. Contactează-ne.")}`
    )
  }
}
