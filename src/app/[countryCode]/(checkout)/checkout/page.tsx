import { retrieveCart, clearCartShippingMethods } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Finalizare comandă | Orizont",
  description: "Finalizează comanda ta de materiale de construcții.",
}

type Props = {
  searchParams: Promise<{ step?: string; method?: string }>
}

export default async function Checkout({ searchParams }: Props) {
  const { step = "delivery", method = "livrare" } = await searchParams

  // When entering the delivery step (fresh start or back-navigation), clear any
  // stale shipping method so the dynamic cost preview and total start clean.
  // clearCartShippingMethods always returns the current cart; fall back to a
  // normal retrieve only if it throws.
  let cart = step === "delivery"
    ? await clearCartShippingMethods().catch(() => retrieveCart().catch(() => null))
    : await retrieveCart().catch(() => null)

  if (!cart || !cart.items?.length) {
    return notFound()
  }

  const customer = await retrieveCustomer().catch(() => null)

  return <CheckoutForm cart={cart} customer={customer} step={step} method={method} />
}
