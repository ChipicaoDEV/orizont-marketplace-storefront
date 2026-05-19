import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { sortProducts } from "@lib/util/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

const ITEMS_PER_PAGE = 12

function resolveSort(raw?: string): SortOptions {
  if (raw === "price_asc" || raw === "price_desc" || raw === "created_at") return raw
  return "created_at"
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  selectedCategories,
  brands,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  selectedCategories?: string
  brands?: string
}) => {
  const sort = resolveSort(sortBy)
  const currentPage = Math.max(1, page ? parseInt(page) : 1)
  const activeBrands = brands ? brands.split(",").filter(Boolean) : []

  const selectedIds = selectedCategories
    ? selectedCategories.split(",").filter(Boolean)
    : []

  // ── Parallel fetches ────────────────────────────────────────────────────────
  const [allCategories, region, { response: { products: allProducts } }] =
    await Promise.all([
      listCategories({
        fields: "id,name,handle,parent_category_id",
        limit: 200,
      }).catch(() => [] as HttpTypes.StoreProductCategory[]),

      getRegion(countryCode),

      listProducts({
        pageParam: 1,
        queryParams: {
          limit: 200,
          ...(selectedIds.length > 0 && { category_id: selectedIds }),
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata",
        },
        countryCode,
      }).catch(() => ({
        response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
        nextPage: null,
      })),
    ])

  if (!region) notFound()

  const rootCategories = allCategories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => a.name.localeCompare(b.name, "ro"))

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sorted = sortProducts(allProducts, sort)

  const priceSort =
    sortBy === "price_asc" || sortBy === "price_desc" ? sortBy : null

  const afterSort = priceSort
    ? [...sorted].sort((a, b) => {
        const ap =
          getProductPrice({ product: a }).cheapestPrice
            ?.calculated_price_number ?? 0
        const bp =
          getProductPrice({ product: b }).cheapestPrice
            ?.calculated_price_number ?? 0
        return priceSort === "price_asc" ? ap - bp : bp - ap
      })
    : sorted

  // ── Filter by brand ─────────────────────────────────────────────────────────
  const filtered =
    activeBrands.length > 0
      ? afterSort.filter((p) => {
          const b = p.metadata?.brand as string | undefined
          return b && activeBrands.includes(b)
        })
      : afterSort

  // ── Paginate ────────────────────────────────────────────────────────────────
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const offset = (safePage - 1) * ITEMS_PER_PAGE
  const pageProducts = filtered.slice(offset, offset + ITEMS_PER_PAGE)

  // ── Brand counts (from all products, unfiltered by brand) ───────────────────
  const brandCounts: Record<string, number> = {}
  for (const p of allProducts) {
    const b = p.metadata?.brand as string | undefined
    if (b) brandCounts[b] = (brandCounts[b] ?? 0) + 1
  }
  const availableBrands = Object.keys(brandCounts).sort()

  return (
    <div
      className="flex flex-col gap-y-4 small:gap-y-12 py-6 small:py-12 content-container bg-white"
      data-testid="category-container"
    >
      {/* Premium Store Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-8 py-16 small:px-16 small:py-24">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F27A1A]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#F27A1A]/5 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#F27A1A]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-y-6 max-w-3xl">
          <nav className="flex items-center gap-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#F27A1A]">
            <LocalizedClientLink
              href="/"
              className="hover:text-white transition-colors duration-300"
            >
              Acasă
            </LocalizedClientLink>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">Magazin</span>
          </nav>

          <div className="space-y-4">
            <h1
              className="text-4xl small:text-7xl font-black tracking-tight text-white leading-[1.1]"
              data-testid="store-page-title"
            >
              Construiește <span className="text-[#F27A1A]">Fără</span> Limite.
            </h1>
            <p className="text-gray-400 font-medium text-lg small:text-xl leading-relaxed max-w-2xl">
              Explorați catalogul nostru complet de materiale de construcții și
              echipamente profesionale, selectate pentru performanță și
              durabilitate.
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
            availableBrands={availableBrands}
            brandCounts={brandCounts}
          />
        </aside>

        <div className="w-full">
          {pageProducts.length > 0 ? (
            <>
              <ul
                className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
                data-testid="products-list"
              >
                {pageProducts.map((p) => (
                  <li key={p.id}>
                    <ProductPreview product={p} region={region} />
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <Pagination
                  data-testid="product-pagination"
                  page={safePage}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 font-medium">Niciun produs găsit</p>
              <p className="text-sm text-gray-400">
                Încearcă să ajustezi filtrele aplicate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
