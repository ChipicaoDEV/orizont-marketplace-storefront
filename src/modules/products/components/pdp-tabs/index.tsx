"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type PdpTabsProps = {
  product: HttpTypes.StoreProduct
}

// Keys stored internally that shouldn't appear in the "Specificații tehnice" table
const HIDDEN_META_KEYS = new Set([
  "brand",
  "pricing_unit",
  "packaging",
  "vendor",
  "_score",
])

const TABS = ["Descriere", "Specificații tehnice", "Livrare"] as const
type Tab = (typeof TABS)[number]

const PdpTabs = ({ product }: PdpTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("Descriere")

  const specEntries = Object.entries(product.metadata ?? {}).filter(
    ([k]) => !HIDDEN_META_KEYS.has(k)
  )

  return (
    <div className="mt-10">
      {/* ── Desktop: horizontal tabs ── */}
      <div className="hidden sm:block border-b border-gray-200">
        <div className="flex gap-x-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors duration-150 -mb-px ${
                activeTab === tab
                  ? "border-[#F27A1A] text-[#F27A1A]"
                  : "border-transparent text-gray-500 hover:text-[#1A1A1A] hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile: accordion ── */}
      <div className="sm:hidden flex flex-col divide-y divide-gray-100 border-t border-gray-100">
        {TABS.map((tab) => (
          <MobileSection
            key={tab}
            label={tab}
            open={activeTab === tab}
            onToggle={() => setActiveTab(activeTab === tab ? ("" as Tab) : tab)}
          >
            <TabContent tab={tab} product={product} specEntries={specEntries} />
          </MobileSection>
        ))}
      </div>

      {/* ── Desktop: tab content ── */}
      <div className="hidden sm:block pt-6">
        <TabContent tab={activeTab} product={product} specEntries={specEntries} />
      </div>
    </div>
  )
}

// ── Mobile accordion section ──────────────────────────────────────────────────

function MobileSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-[#1A1A1A]"
        aria-expanded={open}
      >
        {label}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}

// ── Tab content switcher ──────────────────────────────────────────────────────

function TabContent({
  tab,
  product,
  specEntries,
}: {
  tab: Tab | ""
  product: HttpTypes.StoreProduct
  specEntries: [string, unknown][]
}) {
  if (tab === "Descriere") {
    return (
      <div className="prose prose-sm max-w-none text-[#333333]">
        {product.description ? (
          <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
        ) : (
          <p className="text-gray-400 italic">Descriere indisponibilă.</p>
        )}
      </div>
    )
  }

  if (tab === "Specificații tehnice") {
    if (specEntries.length === 0) {
      return <p className="text-sm text-gray-400 italic">Specificații tehnice indisponibile.</p>
    }

    return (
      <table className="w-full text-sm border-collapse">
        <tbody>
          {specEntries.map(([key, value]) => (
            <tr key={key} className="border-b border-gray-100 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-[#1A1A1A] w-1/3 capitalize">
                {key.replace(/_/g, " ")}
              </td>
              <td className="py-2.5 text-[#333333]">{String(value ?? "—")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (tab === "Livrare") {
    return (
      <div className="flex flex-col gap-y-6 text-sm text-[#333333]">
        <div className="flex items-start gap-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFF3E6] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Livrare rapidă</p>
            <p className="text-gray-500 leading-relaxed">
              Comanda ta va fi livrată în 2–5 zile lucrătoare la adresa indicată sau la un punct de ridicare.
              Pentru comenzi voluminoase (materiale de construcții în vrac), ne vom contacta pentru a stabili
              modalitatea de livrare.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFF3E6] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Livrare gratuită</p>
            <p className="text-gray-500 leading-relaxed">
              Livrare gratuită pentru comenzi peste 500 lei. Sub această valoare, taxa de livrare
              se calculează la finalizarea comenzii în funcție de greutate și destinație.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFF3E6] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Retururi</p>
            <p className="text-gray-500 leading-relaxed">
              Poți returna produsele în termen de 14 zile de la primire, dacă sunt în starea originală
              și ambalajul este intact. Contactează-ne la <span className="text-[#F27A1A]">contact@orizont.ro</span> pentru
              a iniția un retur.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default PdpTabs
