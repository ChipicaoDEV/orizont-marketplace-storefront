"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import PdpClientSection from "@modules/products/components/pdp-client-section"
import PdpTabs from "@modules/products/components/pdp-tabs"

type Props = {
  product: HttpTypes.StoreProduct
}

const PdpBody = ({ product }: Props) => {
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()

  return (
    <>
      <PdpClientSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
      />

      <div className="mt-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <PdpTabs product={product} selectedVariant={selectedVariant} />
      </div>
    </>
  )
}

export default PdpBody
