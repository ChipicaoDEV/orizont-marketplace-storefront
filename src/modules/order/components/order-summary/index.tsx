import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] text-gray-400">
        Sumar Comandă
      </h2>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
          <span>Subtotal</span>
          <span className="text-gray-900 font-bold">{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-4 pt-4 border-t border-gray-100">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-green-600">
              <span>Reducere</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-green-600">
              <span>Card Cadou</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Livrare</span>
            <span className="text-gray-900 font-bold">{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Taxe</span>
            <span className="text-gray-900 font-bold">{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 uppercase tracking-tighter">Total</span>
          <span className="text-3xl font-bold text-gray-900 tracking-tighter" data-testid="order-total">
            {getAmount(order.total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
