import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PdpGallery from "@modules/products/components/pdp-gallery"
import PdpActions from "@modules/products/components/pdp-actions"
import PdpTabs from "@modules/products/components/pdp-tabs"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate = ({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) => {
  if (!product?.id) return notFound()

  // ── Breadcrumb category ─────────────────────────────────────────────────────
  const primaryCategory = product.categories?.[0] ?? null

  // ── Meta fields ─────────────────────────────────────────────────────────────
  const brand = product.metadata?.brand as string | undefined
  const sku = (product as any).variants?.[0]?.sku as string | undefined

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ── Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
          <li>
            <LocalizedClientLink href="/" className="hover:text-[#F27A1A] transition-colors">
              Acasă
            </LocalizedClientLink>
          </li>

          {primaryCategory && (
            <li className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <LocalizedClientLink
                href={`/categories/${primaryCategory.handle}`}
                className="hover:text-[#F27A1A] transition-colors"
              >
                {primaryCategory.name}
              </LocalizedClientLink>
            </li>
          )}

          <li className="flex items-center gap-x-1.5">
            <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-[#1A1A1A] line-clamp-1" aria-current="page">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col md:flex-row md:gap-x-10 lg:gap-x-16 gap-y-8">

        {/* LEFT — Image gallery (50%) */}
        <div className="w-full md:w-1/2">
          <PdpGallery images={images ?? []} title={product.title ?? "Produs"} />
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

          {/* Actions: price, stock, quantity, add-to-cart, toast */}
          <PdpActions product={product} />
        </div>
      </div>

      {/* ── Tabs (below both columns) ── */}
      <div className="mt-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <PdpTabs product={product} />
      </div>
    </div>
  )
}

export default ProductTemplate
