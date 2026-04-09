import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col gap-y-4 small:gap-y-12 py-6 small:py-12 content-container">

      {/* Premium Collection Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-8 py-14 small:px-16 small:py-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F27A1A]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#F27A1A]/5 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#F27A1A]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-y-4 max-w-2xl">
          <nav className="flex items-center gap-x-3 text-[10px] uppercase tracking-[0.3em] text-[#F27A1A]">
            <LocalizedClientLink href="/" className="hover:text-white transition-colors duration-300">Acasă</LocalizedClientLink>
            <span className="text-gray-700">/</span>
            <LocalizedClientLink href="/store" className="hover:text-white transition-colors duration-300">Magazin</LocalizedClientLink>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">{collection.title}</span>
          </nav>

          <h1 className="text-3xl small:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            {collection.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col small:flex-row small:items-start gap-x-12 pt-4">
        <aside className="small:sticky small:top-24 w-full small:w-[280px] shrink-0">
          <RefinementList sortBy={sort} />
        </aside>

        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={collection.products?.length} />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
