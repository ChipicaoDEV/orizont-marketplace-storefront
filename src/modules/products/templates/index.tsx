import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PdpClientSection from "@modules/products/components/pdp-client-section"
import PdpTabs from "@modules/products/components/pdp-tabs"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate = ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  if (!product?.id) return notFound()

  // ── Breadcrumb category ─────────────────────────────────────────────────────
  const primaryCategory = product.categories?.[0] ?? null

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
      <PdpClientSection product={product} />

      {/* ── Tabs (below both columns) ── */}
      <div className="mt-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <PdpTabs product={product} />
      </div>
    </div>
  )
}

export default ProductTemplate
