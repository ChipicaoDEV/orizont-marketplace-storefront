"use client"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  {
    name: "Materiale de construcții",
    slug: "materiale-de-constructii",
    description: "Structuri, izolații, hidroizolații și materiale de bază",
    subcategories: [
      { name: "Armături și fundații",     slug: "armaturi-si-fundatii" },
      { name: "Produse metalurgice",       slug: "produse-metalurgice" },
      { name: "Țevi și profile",           slug: "tevi-si-profile" },
      { name: "Materiale prăfoase",        slug: "materiale-prafoase" },
      { name: "Termoizolații",             slug: "termoizolatii" },
      { name: "Hidroizolații și etanșări", slug: "hidroizolatii-si-etansari" },
      { name: "Utilaje și echipamente",    slug: "utilaje-si-echipamente" },
      { name: "Produse din lemn",          slug: "produse-din-lemn" },
    ],
  },
  {
    name: "Acoperișuri și sisteme",
    slug: "acoperisuri-si-sisteme",
    description: "Țiglă, tablă, membrane, jgheaburi și accesorii",
    subcategories: [
      { name: "Țiglă ceramică și beton",  slug: "tigla-ceramica-si-beton" },
      { name: "Tablă pentru acoperiș",    slug: "tabla-pentru-acoperis" },
      { name: "Membrane bituminoase",     slug: "membrane-bituminoase" },
      { name: "Jgheaburi și burlane",     slug: "jgheaburi-si-burlane" },
      { name: "Accesorii acoperiș",       slug: "accesorii-acoperis" },
    ],
  },
  {
    name: "Finisaje",
    slug: "finisaje",
    description: "Vopsele, gresie, parchet, tencuieli și adezivi",
    subcategories: [
      { name: "Vopsele și grunduri",          slug: "vopsele-si-grunduri" },
      { name: "Tencuieli decorative",         slug: "tencuieli-decorative" },
      { name: "Glet și șpaclu",               slug: "glet-si-spaclu" },
      { name: "Gresie și faianță",            slug: "gresie-si-faianta" },
      { name: "Parchet și laminat",           slug: "parchet-si-laminat" },
      { name: "Plăci și panouri decorative",  slug: "placi-si-panouri-decorative" },
      { name: "Adezivi și chituri finisaje",  slug: "adezivi-si-chituri-finisaje" },
    ],
  },
  {
    name: "Instalații sanitare",
    slug: "instalatii-sanitare",
    description: "Țevi, robineți, obiecte sanitare și canalizare",
    subcategories: [
      { name: "Țevi și fitinguri",        slug: "tevi-si-fitinguri" },
      { name: "Robineți și racorduri",    slug: "robineti-si-racorduri" },
      { name: "Obiecte sanitare",         slug: "obiecte-sanitare" },
      { name: "Canalizare interioară",    slug: "canalizare-interioara" },
      { name: "Canalizare exterioară",    slug: "canalizare-exterioara" },
      { name: "Cămine de inspecție",      slug: "camine-de-inspectie" },
      { name: "Sisteme de încălzire",     slug: "sisteme-de-incalzire" },
    ],
  },
  {
    name: "Instalații electrice",
    slug: "instalatii-electrice",
    description: "Cabluri, prize, tablouri și corpuri de iluminat",
    subcategories: [
      { name: "Cabluri și conductori",          slug: "cabluri-si-conductori" },
      { name: "Prize și întrerupătoare",        slug: "prize-si-intrerupatoare" },
      { name: "Tablouri electrice",             slug: "tablouri-electrice" },
      { name: "Corpuri de iluminat",            slug: "corpuri-de-iluminat" },
      { name: "Tuburi și accesorii instalații", slug: "tuburi-si-accesorii-instalatii" },
      { name: "Doze și conectori",              slug: "doze-si-conectori" },
    ],
  },
  {
    name: "Curte și grădină",
    slug: "curte-si-gradina",
    description: "Pavaje, garduri, irigații și iluminat exterior",
    subcategories: [
      { name: "Pavaje și borduri",            slug: "pavaje-si-borduri" },
      { name: "Garduri metalice și panouri",  slug: "garduri-metalice-si-panouri" },
      { name: "Beton și prefabricate",        slug: "beton-si-prefabricate" },
      { name: "Sisteme de irigații",          slug: "sisteme-de-irigatii" },
      { name: "Iluminat exterior",            slug: "iluminat-exterior" },
    ],
  },
  {
    name: "Scule și echipamente",
    slug: "scule-si-echipamente",
    description: "Scule electrice, manuale, protecție și consumabile",
    subcategories: [
      { name: "Scule electrice",            slug: "scule-electrice" },
      { name: "Scule manuale",              slug: "scule-manuale" },
      { name: "Echipamente de protecție",   slug: "echipamente-de-protectie" },
      { name: "Accesorii și consumabile",   slug: "accesorii-si-consumabile" },
    ],
  },
] as const

type CategorySlug = typeof CATEGORIES[number]["slug"]

export default function CategoryNav() {
  const pathname = usePathname()
  const [activeSlug, setActiveSlug] = useState<CategorySlug | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The ONLY place we schedule a close is on the outer wrapper's mouseLeave.
  // This means moving from a tab into the dropdown panel never triggers a close.
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveSlug(null), 150)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const handleTabEnter = (slug: CategorySlug) => {
    cancelClose()
    setActiveSlug(slug)
  }

  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug) ?? null

  return (
    // Outer wrapper: mouseLeave here is the ONLY close trigger
    <div
      className="relative"
      onMouseLeave={scheduleClose}
    >
      {/* ── Tab bar ── */}
      <nav className="bg-white border-b border-gray-200" aria-label="Categorii produse">
        <div className="content-container">
          <ul className="flex items-center overflow-x-auto no-scrollbar -mx-1">
            {CATEGORIES.map((cat) => {
              const isActive = pathname.includes(`/categories/${cat.slug}`)
              const isOpen   = activeSlug === cat.slug

              return (
                <li key={cat.slug} className="flex-shrink-0">
                  {/* onMouseEnter only — no onMouseLeave on individual tabs */}
                  <div onMouseEnter={() => handleTabEnter(cat.slug)}>
                    <LocalizedClientLink
                      href={`/categories/${cat.slug}`}
                      className={`flex items-center gap-x-1 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                        isActive || isOpen
                          ? "border-[#F27A1A] text-[#F27A1A]"
                          : "border-transparent text-[#333333] hover:border-[#F27A1A] hover:text-[#F27A1A]"
                      }`}
                    >
                      {cat.name}
                      <svg
                        className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* ── Mega-menu panel ── */}
      <div
        className={`absolute left-0 right-0 z-40 transition-all duration-200 origin-top ${
          activeCategory
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Keeps the panel "hot" even while animating out so mouse can re-enter */}
        <div className="bg-white border-b border-gray-200 shadow-2xl">
          {activeCategory && (
            <div className="content-container py-6">
              <div className="flex gap-x-10">

                {/* Left: category header */}
                <div className="w-52 flex-shrink-0 flex flex-col gap-y-2 pt-1">
                  <LocalizedClientLink
                    href={`/categories/${activeCategory.slug}`}
                    onClick={() => setActiveSlug(null)}
                    className="group flex items-center justify-between"
                  >
                    <span className="text-base font-bold text-[#1A1A1A] group-hover:text-[#F27A1A] transition-colors">
                      {activeCategory.name}
                    </span>
                    <svg className="w-4 h-4 text-[#F27A1A] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {activeCategory.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <LocalizedClientLink
                      href={`/categories/${activeCategory.slug}`}
                      onClick={() => setActiveSlug(null)}
                      className="inline-flex items-center gap-x-1.5 text-xs font-semibold text-[#F27A1A] hover:text-[#D4600E] transition-colors"
                    >
                      Vezi toate
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-100 self-stretch" />

                {/* Right: subcategory grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-0.5">
                  {activeCategory.subcategories.map((sub) => (
                    <LocalizedClientLink
                      key={sub.slug}
                      href={`/categories/${sub.slug}`}
                      onClick={() => setActiveSlug(null)}
                      className="group flex items-center gap-x-2 px-3 py-2 rounded-lg hover:bg-[#FFF3E6] transition-colors duration-150"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#F27A1A] flex-shrink-0 transition-colors" />
                      <span className="text-sm text-[#333333] group-hover:text-[#F27A1A] transition-colors font-medium">
                        {sub.name}
                      </span>
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
