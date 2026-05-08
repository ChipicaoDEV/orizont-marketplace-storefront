"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import PdpGallery from "@modules/products/components/pdp-gallery"
import PdpActions from "@modules/products/components/pdp-actions"

type Props = {
  product: HttpTypes.StoreProduct
}

const PdpClientSection = ({ product }: Props) => {
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()

  const brand = product.metadata?.brand as string | undefined
  const sku = (product as any).variants?.[0]?.sku as string | undefined

  const displayImages = useMemo(() => {
    const v = selectedVariant as any
    if (v?.images?.length) {
      const ids = new Set(v.images.map((i: any) => i.id))
      return (product.images ?? []).filter((i) => ids.has(i.id))
    }
    return product.images ?? []
  }, [selectedVariant, product.images])

  return (
    <div className="flex flex-col md:flex-row md:gap-x-10 lg:gap-x-16 gap-y-8">

      {/* LEFT — Image gallery (50%) */}
      <div className="w-full md:w-1/2">
        <PdpGallery
          key={selectedVariant?.id ?? "default"}
          images={displayImages}
          title={product.title ?? "Produs"}
        />
      </div>

      {/* RIGHT — Product info (50%) */}
      <div className="w-full md:w-1/2 flex flex-col gap-y-4">

        {/* Brand */}
        {brand && (
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {brand}
          </span>
        )}

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight">
          {product.title}
        </h1>

        {/* SKU */}
        {sku && (
          <p className="text-xs text-gray-400">
            Cod produs: <span className="font-mono text-gray-500">{sku}</span>
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions: price, stock, quantity, add-to-cart, quote form */}
        <PdpActions product={product} onVariantChange={setSelectedVariant} />
      </div>
    </div>
  )
}

export default PdpClientSection
