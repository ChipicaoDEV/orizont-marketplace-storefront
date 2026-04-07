import { Suspense } from "react"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"

type Props = {
  query: string
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

export default function SearchResultsTemplate({
  query,
  sortBy,
  page,
  countryCode,
}: Props) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList sortBy={sort} />

      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Rezultate pentru{" "}
            <span className="text-[#F27A1A]">„{query}"</span>
          </h1>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            search={query}
          />
        </Suspense>
      </div>
    </div>
  )
}
