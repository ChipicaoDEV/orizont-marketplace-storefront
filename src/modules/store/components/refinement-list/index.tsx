"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: HttpTypes.StoreProductCategory[]
  selectedCategoryIds?: string[]
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  categories = [],
  selectedCategoryIds = [],
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset page on filter change
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: SortOptions) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const toggleCategory = (id: string) => {
    const current = new Set(selectedCategoryIds)
    if (current.has(id)) {
      current.delete(id)
    } else {
      current.add(id)
    }
    const value = Array.from(current).join(",")
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("categories", value)
    } else {
      params.delete("categories")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-y-8" data-testid={dataTestId}>
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />

      {categories.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">
              Categorii
            </span>
            {selectedCategoryIds.length > 0 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete("categories")
                  params.delete("page")
                  router.push(`${pathname}?${params.toString()}`)
                }}
                className="text-[10px] text-[#F27A1A] hover:text-[#D4600E] transition-colors duration-200 underline"
              >
                Resetează
              </button>
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-x-3 py-2 px-4 rounded-xl cursor-pointer transition-all duration-200 border border-transparent w-full text-left ${
                    isSelected
                      ? "bg-black text-white shadow-xl shadow-black/10"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {/* Custom checkbox */}
                  <span
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-[#F27A1A] border-[#F27A1A]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default RefinementList
