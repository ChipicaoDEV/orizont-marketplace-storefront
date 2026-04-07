import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="py-8">
      <Heading level="h2" className="text-2xl font-bold tracking-tight text-gray-900 mb-8 uppercase text-[10px] tracking-[0.2em] text-gray-400">
        Detalii Livrare
      </Heading>
      <div className="grid grid-cols-1 small:grid-cols-3 gap-12">
        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-address-summary"
        >
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">
            Adresă de Livrare
          </Text>
          <div className="flex flex-col text-sm font-semibold text-gray-900 leading-relaxed shadow-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </span>
            <span>
              {order.shipping_address?.address_1}{" "}
              {order.shipping_address?.address_2}
            </span>
            <span>
              {order.shipping_address?.postal_code},{" "}
              {order.shipping_address?.city}
            </span>
            <span>
              {order.shipping_address?.country_code?.toUpperCase()}
            </span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-contact-summary"
        >
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Contact</Text>
          <div className="flex flex-col gap-y-1 text-sm font-semibold text-gray-900 shadow-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span>{order.shipping_address?.phone}</span>
            <span className="text-gray-500 font-medium">{order.email}</span>
          </div>
        </div>

        <div
          className="flex flex-col gap-y-3"
          data-testid="shipping-method-summary"
        >
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Metodă</Text>
          <div className="flex flex-col gap-y-1 text-sm font-semibold text-gray-900 shadow-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <span>{(order as any).shipping_methods[0]?.name}</span>
            <span className="text-gray-500 font-medium">
              ({convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
