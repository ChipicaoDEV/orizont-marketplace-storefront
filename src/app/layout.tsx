import { getBaseURL } from "@lib/util/env"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Orizont — Materiale de construcții",
    template: "%s | Orizont",
  },
  description:
    "Depozit de materiale de construcții. Ciment, cărămizi, izolații, acoperiș, oțel și multe altele. Livrare rapidă, prețuri competitive.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-mode="light" className={inter.variable}>
      <body className="antialiased">
        {props.children}
      </body>
    </html>
  )
}
