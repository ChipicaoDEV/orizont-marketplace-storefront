import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  selectedCategories,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  selectedCategories?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch all categories with explicit scalar fields so parent_category_id is available for filtering
  const allCategories = await listCategories({
    fields: "id,name,handle,parent_category_id",
    limit: 200,
  }).catch(() => [] as HttpTypes.StoreProductCategory[])

  // Root categories have parent_category_id === null
  const rootCategories = allCategories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => a.name.localeCompare(b.name, "ro"))

  // Parse selected category IDs from the comma-separated query param
  const selectedIds = selectedCategories
    ? selectedCategories.split(",").filter(Boolean)
    : []

  return (
    <div
      className="flex flex-col gap-y-4 small:gap-y-12 py-6 small:py-12 content-container bg-white"
      data-testid="category-container"
    >
      {/* Premium Store Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-8 py-16 small:px-16 small:py-24">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F27A1A]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#F27A1A]/5 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#F27A1A]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-y-6 max-w-3xl">
          <nav className="flex items-center gap-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#F27A1A]">
            <LocalizedClientLink href="/" className="hover:text-white transition-colors duration-300">Acasă</LocalizedClientLink>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">Magazin</span>
          </nav>

          <div className="space-y-4">
            <h1 className="text-4xl small:text-7xl font-black tracking-tight text-white leading-[1.1]" data-testid="store-page-title">
              Construiește <span className="text-[#F27A1A]">Fără</span> Limite.
            </h1>
            <p className="text-gray-400 font-medium text-lg small:text-xl leading-relaxed max-w-2xl">
              Explorați catalogul nostru complet de materiale de construcții și echipamente profesionale, selectate pentru performanță și durabilitate.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-x-12 pt-4">
        <aside className="small:sticky small:top-24 w-full small:w-[280px] shrink-0">
          <RefinementList
            sortBy={sort}
            categories={rootCategories}
            selectedCategoryIds={selectedIds}
          />
        </aside>

        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              categoryIds={selectedIds.length > 0 ? selectedIds : undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
