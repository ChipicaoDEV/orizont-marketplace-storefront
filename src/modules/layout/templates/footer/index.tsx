import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CERT_LINKS = [
  { label: "ISO 9001 : 2008", href: "/certificari" },
  { label: "ISO 14001 : 2005", href: "/certificari" },
  { label: "ISO 18001 : 2008", href: "/certificari" },
]

const INFO_LINKS = [
  { label: "Despre noi", href: "/despre-noi" },
  { label: "Livrare", href: "/livrare" },
  { label: "Contact", href: "/contact" },
  { label: "Serviciu Clienți", href: "/customer-service" },
  { label: "Termeni și condiții", href: "/termeni-si-conditii" },
]

const ACCOUNT_LINKS = [
  { label: "Conectare", href: "/account" },
  { label: "Înregistrare", href: "/account" },
  { label: "Comenzile mele", href: "/account/orders" },
]

export default function Footer() {
  return (
    <footer className="w-full">
      {/* ── Banner row ── */}
      <div className="bg-[#F27A1A]">
        <div className="content-container py-4 flex items-center justify-center">
          <p className="text-white text-sm md:text-base font-medium text-center">
            <span className="font-bold">Orizont</span>
            {" — "}
            Materiale de construcții pentru proiectele tale
          </p>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="bg-[#1A1A1A]">
        <div className="content-container py-12 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">

            {/* Column 1 — Company info */}
            <div className="flex flex-col gap-y-4">
              <LocalizedClientLink
                href="/"
                className="inline-block"
              >
                <Image
                  src="/logo.png"
                  alt="Orizont Logo"
                  width={211}
                  height={55}
                  className="h-10 w-auto object-contain brightness-0 invert"
                  unoptimized
                />
              </LocalizedClientLink>
              <p className="text-sm text-gray-400 leading-relaxed">
                Depozit de materiale de construcții cu o gamă completă de produse
                pentru orice proiect, de la fundație până la finisaje.
              </p>
              <ul className="flex flex-col gap-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Str. Plevenei nr. 3, Sighetu Marmatiei</span>
                </li>
                <li className="flex items-center gap-x-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="" className="hover:text-white transition-colors">
                    0262-310960 sau  0262-310990
                  </a>
                </li>
                <li className="flex items-center gap-x-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:office@orizont-srl.ro" className="hover:text-white transition-colors">
                    office@orizont-srl.ro
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 — Info links */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Informații
              </h3>
              <ul className="flex flex-col gap-y-2">
                {INFO_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Certifications */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Certificări
              </h3>
              <ul className="flex flex-col gap-y-2">
                {CERT_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <LocalizedClientLink
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Account links */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Contul meu
              </h3>
              <ul className="flex flex-col gap-y-2">
                {ACCOUNT_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <LocalizedClientLink
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Schedule */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Program
              </h3>
              <ul className="flex flex-col gap-y-2 text-sm text-gray-400">
                <li className="flex justify-between gap-x-4">
                  <span>Luni–Vineri</span>
                  <span className="text-white font-medium">07:00–18:00</span>
                </li>
                <li className="flex justify-between gap-x-4">
                  <span>Sâmbătă</span>
                  <span className="text-white font-medium">08:00–14:00</span>
                </li>
                <li className="flex justify-between gap-x-4">
                  <span>Duminică</span>
                  <span className="text-[#D32F2F] font-medium">Închis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-800">
          <div className="content-container py-4 flex items-center justify-center">
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Orizont. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
