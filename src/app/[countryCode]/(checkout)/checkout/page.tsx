import { retrieveCart } from "@lib/data/cart"
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

  const cart = await retrieveCart().catch(() => null)

  if (!cart || !cart.items?.length) {
    return notFound()
  }

  const customer = await retrieveCustomer().catch(() => null)

  return <CheckoutForm cart={cart} customer={customer} step={step} method={method} />
}
