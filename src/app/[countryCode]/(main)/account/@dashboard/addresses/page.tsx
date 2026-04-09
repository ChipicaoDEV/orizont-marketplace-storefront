import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Adrese",
  description: "Vizualizează adresele tale",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-2">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Adrese de livrare</h1>
        <p className="text-sm text-gray-500">
          Vizualizează și actualizează adresele de livrare. Poți adăuga oricâte dorești — acestea vor fi disponibile în timpul comenzii.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
