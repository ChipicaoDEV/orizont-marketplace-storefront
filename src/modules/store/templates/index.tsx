import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col gap-y-12 py-12 content-container bg-white"
      data-testid="category-container"
    >
      <div className="flex flex-col gap-y-2 border-b border-gray-100 pb-10">
        <h1 className="text-4xl font-bold tracking-tighter text-gray-900" data-testid="store-page-title">
          Toate Produsele
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Explorează selecția noastră completă de materiale de construcții și echipamente profesionale.
        </p>
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-x-12">
        <aside className="small:sticky small:top-24 w-full small:w-[280px] shrink-0">
          <RefinementList sortBy={sort} />
        </aside>
        
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
