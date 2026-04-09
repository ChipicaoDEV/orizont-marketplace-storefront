import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { retrieveOrder } from "@lib/data/orders"
import { orderStatusConfig, formatRon, formatDate } from "@modules/account/components/cont-shared/utils"

export const metadata: Metadata = {
  title: "Detalii comandă | Orizont",
}

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { countryCode, id } = await params
  const order = await retrieveOrder(id).catch(() => null)

  if (!order) notFound()

  const { label, className } = orderStatusConfig(order.status)

  const shippingAddress = order.shipping_address

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/cont/comenzi`}
              className="text-sm text-gray-400 hover:text-[#F27A1A] transition-colors flex items-center gap-x-1 mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la comenzi
            </Link>
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              Comanda #{order.display_id}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Plasată pe {formatDate(order.created_at)}
            </p>
          </div>
          <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${className}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1A1A]">Produse comandate</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-x-4 px-5 py-4">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                {item.variant_title && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.variant_title}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Cantitate: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#1A1A1A]">
                  {formatRon(item.unit_price * item.quantity)}
                </p>
                <p className="text-xs text-gray-400">{formatRon(item.unit_price)} / buc.</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-[#1A1A1A] mb-4">Sumar comandă</h2>
          <dl className="flex flex-col gap-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium text-[#1A1A1A]">{formatRon(order.subtotal)}</dd>
            </div>
            {(order.discount_total ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Reducere</dt>
                <dd className="font-medium text-green-600">-{formatRon(order.discount_total)}</dd>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Transport</dt>
              <dd className="font-medium text-[#1A1A1A]">
                {(order.shipping_total ?? 0) === 0 ? "Gratuit" : formatRon(order.shipping_total)}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">TVA</dt>
              <dd className="font-medium text-[#1A1A1A]">{formatRon(order.tax_total)}</dd>
            </div>
            <div className="h-px bg-gray-100 my-1" />
            <div className="flex justify-between text-sm font-bold">
              <dt className="text-[#1A1A1A]">Total</dt>
              <dd className="text-[#1A1A1A]">{formatRon(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-4">Adresă de livrare</h2>
            <address className="not-italic text-sm text-gray-600 flex flex-col gap-y-1">
              <span className="font-semibold text-[#1A1A1A]">
                {shippingAddress.first_name} {shippingAddress.last_name}
              </span>
              {shippingAddress.company && <span>{shippingAddress.company}</span>}
              <span>{shippingAddress.address_1}</span>
              {shippingAddress.address_2 && <span>{shippingAddress.address_2}</span>}
              <span>
                {shippingAddress.postal_code} {shippingAddress.city}
                {shippingAddress.province ? `, ${shippingAddress.province}` : ""}
              </span>
              {shippingAddress.phone && <span>{shippingAddress.phone}</span>}
            </address>
          </div>
        )}
      </div>
    </div>
  )
}
