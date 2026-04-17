import { redirect } from "next/navigation"
import { Metadata } from "next"
import { retrieveCart, initiatePaymentSession, placeOrder } from "@lib/data/cart"

export const metadata: Metadata = {
  title: "Procesare plată | Orizont",
}

// EuPlătesc returns these GET params on the back_ref redirect.
// Note: EuPlătesc replaces (not appends to) the back_ref query string,
// so cart_id from our original back_ref URL is lost. We reconstruct it
// from invoice_id which is always echoed back by EuPlătesc.
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

export default async function EuplatescSuccessPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const sp = await searchParams

  // Prefer cart_id if somehow present, otherwise reconstruct from invoice_id
  const cartId = sp.cart_id ?? (sp.invoice_id ? `cart_${sp.invoice_id}` : null)

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

  const cart = await retrieveCart(cartId)

  if (!cart) {
    redirect(`/${countryCode}/checkout?step=payment`)
  }

  // Initiate payment session — ignore errors if already initiated
  await initiatePaymentSession(cart, { provider_id: "pp_system_default" }).catch(() => {})

  try {
    await placeOrder(cartId)
    // placeOrder returned without redirecting → cart complete failed
    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent("Comanda nu a putut fi finalizată. Contactează-ne.")}`
    )
  } catch (e: any) {
    // Next.js redirect() and notFound() throw objects with a `digest` field.
    // Always rethrow these — they are navigation signals, not errors.
    if (e?.digest) throw e

    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent("Eroare la finalizarea comenzii. Contactează-ne.")}`
    )
  }
}
