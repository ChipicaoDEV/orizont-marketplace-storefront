import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  {
    name: "Materiale de construcții",
    slug: "materiale-de-constructii",
    color: "#E65100",
    image: "/categorii/Materiale-construcții.jpg",
  },
  {
    name: "Acoperișuri și sisteme",
    slug: "acoperisuri-si-sisteme",
    color: "#4527A0",
    image: "/categorii/Acoperișuri-sisteme.jpg",
  },
  {
    name: "Finisaje",
    slug: "finisaje",
    color: "#00838F",
    image: "/categorii/Finisaje.jpg",
  },
  {
    name: "Instalații sanitare",
    slug: "instalatii-sanitare",
    color: "#1565C0",
    image: "/categorii/Instalații-sanitare.jpg",
  },
  {
    name: "Instalații electrice",
    slug: "instalatii-electrice",
    color: "#F57F17",
    image: "/categorii/Instalații-electrice.jpg",
  },
  {
    name: "Curte și grădină",
    slug: "curte-si-gradina",
    color: "#2E7D32",
    image: "/categorii/curte-gradina.jpeg",
  },
  {
    name: "Scule și echipamente",
    slug: "scule-si-echipamente",
    color: "#37474F",
    image: "/categorii/Scule-echipamente.jpg",
  },
] as const

const CategoriesSection = () => {
  return (
    <section className="content-container py-12 md:py-16">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
          Categorii de produse
        </h2>
        <LocalizedClientLink
          href="/store"
          className="hidden sm:flex items-center gap-x-1 text-sm font-medium text-[#F27A1A] hover:text-[#D4600E] transition-colors"
        >
          Vezi toate
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <LocalizedClientLink
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="
              group flex flex-col items-center text-center
              bg-white rounded-xl p-5 md:p-6
              border border-gray-100
              shadow-sm hover:shadow-md
              transition-all duration-300 hover:-translate-y-1
            "
          >
            {/* Image container */}
            <div
              className={`
                relative w-20 h-20 md:w-24 md:h-24 
                rounded-2xl overflow-hidden mb-4 
                border-2 border-transparent
                transition-all duration-300 
                group-hover:scale-105 group-hover:shadow-md
              `}
              style={{ borderColor: cat.color + "33" }}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Category name */}
            <span className="text-sm md:text-base font-bold text-[#1A1A1A] leading-snug group-hover:text-[#F27A1A] transition-colors duration-150">
              {cat.name}
            </span>
          </LocalizedClientLink>
        ))}
      </div>

      {/* Mobile "see all" link */}
      <div className="flex sm:hidden justify-center mt-6">
        <LocalizedClientLink
          href="/store"
          className="flex items-center gap-x-1 text-sm font-medium text-[#F27A1A] hover:text-[#D4600E] transition-colors"
        >
          Vezi toate categoriile
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default CategoriesSection
