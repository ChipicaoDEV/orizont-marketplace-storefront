import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
        <Text className="text-gray-600 font-medium">
          Am trimis detaliile de confirmare a comenzii la{" "}
          <span
            className="text-gray-900 font-bold underline underline-offset-4"
            data-testid="order-email"
          >
            {order.email}
          </span>
          .
        </Text>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Data Comenzii</span>
          <Text className="text-lg font-bold text-gray-900 tracking-tight" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString('ro-RO', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </div>
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Număr Comandă</span>
          <Text className="text-lg font-bold text-gray-900 tracking-tight" data-testid="order-id">
            #{order.display_id}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-x-8 pt-6 border-t border-gray-100">
        {showStatus && (
          <>
            <div className="flex flex-col gap-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status Comandă</span>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest self-start" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status Plată</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest self-start" sata-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
