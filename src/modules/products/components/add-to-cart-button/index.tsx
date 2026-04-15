"use client"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useTransition } from "react"
import { useCartDrawer } from "@modules/cart/context/cart-drawer-context"

type AddToCartButtonProps = {
  variantId: string | null
  disabled?: boolean
  productHandle: string
  productTitle?: string
  productThumbnail?: string | null
  productPrice?: number | null
}

const AddToCartButton = ({
  variantId,
  disabled = false,
  productHandle,
  productTitle = "",
  productThumbnail = null,
  productPrice = null,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { countryCode } = useParams() as { countryCode: string }
  const { openDrawer } = useCartDrawer()

  // Multiple variants — send user to product page to choose
  if (!variantId) {
    return (
      <a
        href={`/products/${productHandle}`}
        className="
          w-full flex items-center justify-center
          px-4 py-2.5 rounded-lg text-sm font-semibold
          border-2 border-[#F27A1A] text-[#F27A1A]
          hover:bg-[#F27A1A] hover:text-white
          transition-colors duration-150
        "
      >
        Alege varianta
      </a>
    )
  }

  const handleAdd = () => {
    if (disabled || isPending) return
    setError(null)
    startTransition(async () => {
      try {
        await addToCart({ variantId, quantity: 1, countryCode })
        const cart = await retrieveCart()
        const cartItemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0
        openDrawer(
          {
            title: productTitle,
            thumbnail: productThumbnail,
            price: productPrice,
            quantity: 1,
          },
          cart?.total ?? null,
          cartItemCount
        )
      } catch (e: any) {
        setError(e?.message ?? Produsul nu mai este disponibil.)
      }
    })
  }

  return (
    <>
    {error && (
      <p className=text-red-500 text-xs text-center mb-1>{error}</p>
    )}
    <button
      onClick={handleAdd}
      disabled={disabled || isPending}
      className="
        w-full flex items-center justify-center gap-x-2
        px-4 py-2.5 rounded-lg text-sm font-semibold
        border-2 border-[#F27A1A] text-[#F27A1A]
        hover:bg-[#F27A1A] hover:text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
      "
      aria-label="Adaugă în coș"
    >
      {isPending ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Se adaugă...
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Adaugă în coș
        </>
      )}
    </button>
    </>
  )
}

export default AddToCartButton
