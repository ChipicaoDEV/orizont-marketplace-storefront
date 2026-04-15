import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoriesSection from "@modules/home/components/categories-section"
import PopularProducts from "@modules/home/components/popular-products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Orizont — Materiale de construcții",
  description:
    "Depozit de materiale de construcții. Ciment, cărămizi, izolații, acoperiș, oțel și multe altele. Livrare rapidă, prețuri competitive.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoriesSection />
      <PopularProducts region={region} />
    </>
  )
}
