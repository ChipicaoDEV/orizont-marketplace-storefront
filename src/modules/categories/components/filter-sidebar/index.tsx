"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export type FilterSidebarPassedProps = {
  availableBrands: string[]
  brandCounts: Record<string, number>
}

const FilterSidebar = ({
  availableBrands,
  brandCounts,
}: FilterSidebarPassedProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Brand + in-stock are read live from URL (instant update)
  const activeBrands = searchParams.get("brands")?.split(",").filter(Boolean) ?? []
  const inStockOnly = searchParams.get("inStock") === "1"

  // Price inputs use local state; applied only when "Aplică" is clicked
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")

  // Keep price inputs in sync when URL changes (e.g. "clear all" from outside)
  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") ?? "")
    setMaxPrice(searchParams.get("maxPrice") ?? "")
  }, [searchParams])

  const push = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === "") p.delete(k)
        else p.set(k, v)
      }
      p.delete("page") // reset pagination on filter change
      router.push(`${pathname}?${p.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handleApplyPrice = () => push({ minPrice: minPrice || null, maxPrice: maxPrice || null })
  const handleClearPrice = () => {
    setMinPrice("")
    setMaxPrice("")
    push({ minPrice: null, maxPrice: null })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const next = checked
      ? [...activeBrands, brand]
      : activeBrands.filter((b) => b !== brand)
    push({ brands: next.length > 0 ? next.join(",") : null })
  }

  const handleInStockChange = (checked: boolean) =>
    push({ inStock: checked ? "1" : null })

  const hasActiveFilters =
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice") ||
    searchParams.has("brands") ||
    searchParams.has("inStock")

  const clearAll = () => {
    setMinPrice("")
    setMaxPrice("")
    push({ minPrice: null, maxPrice: null, brands: null, inStock: null })
  }

  return (
    <div className="flex flex-col gap-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-base font-bold text-[#1A1A1A]">Filtrează</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-[#F27A1A] hover:text-[#D4600E] transition-colors"
          >
            Șterge toate
          </button>
        )}
      </div>

      {/* ── Price range ── */}
      <div className="border-t border-gray-100 py-5">
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Preț (lei)</h3>
        <div className="flex items-center gap-x-2">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
          />
          <span className="text-gray-400 flex-shrink-0">—</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
          />
        </div>
        <div className="flex gap-x-2 mt-2">
          <button
            onClick={handleApplyPrice}
            className="flex-1 h-9 bg-[#F27A1A] hover:bg-[#D4600E] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Aplică
          </button>
          {(searchParams.has("minPrice") || searchParams.has("maxPrice")) && (
            <button
              onClick={handleClearPrice}
              className="h-9 w-9 flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-600 transition-colors"
              aria-label="Șterge filtrul de preț"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Brands ── */}
      {availableBrands.length > 0 && (
        <div className="border-t border-gray-100 py-5">
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Producător</h3>
          <ul className="flex flex-col gap-y-2.5 max-h-56 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center justify-between gap-x-2 cursor-pointer group">
                  <span className="flex items-center gap-x-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={activeBrands.includes(brand)}
                      onChange={(e) => handleBrandChange(brand, e.target.checked)}
                      className="w-4 h-4 flex-shrink-0 rounded border-gray-300 text-[#F27A1A] accent-[#F27A1A] cursor-pointer"
                    />
                    <span className="text-sm text-[#333333] truncate group-hover:text-[#F27A1A] transition-colors">
                      {brand}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    ({brandCounts[brand]})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── In-stock toggle ── */}
      <div className="border-t border-gray-100 py-5">
        <label className="flex items-center justify-between cursor-pointer gap-x-3">
          <span className="text-sm font-medium text-[#333333]">
            Doar produse în stoc
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => handleInStockChange(!inStockOnly)}
            className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:ring-offset-2 ${
              inStockOnly ? "bg-[#F27A1A]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                inStockOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  )
}

export default FilterSidebar
