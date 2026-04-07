"use client"

import { createContext, useContext, useState } from "react"

type Method = "livrare" | "pickup"

type DeliveryMethodContextType = {
  method: Method
  setMethod: (m: Method) => void
}

const DeliveryMethodContext = createContext<DeliveryMethodContextType>({
  method: "livrare",
  setMethod: () => {},
})

export function DeliveryMethodProvider({ children }: { children: React.ReactNode }) {
  const [method, setMethod] = useState<Method>("livrare")
  return (
    <DeliveryMethodContext.Provider value={{ method, setMethod }}>
      {children}
    </DeliveryMethodContext.Provider>
  )
}

export function useDeliveryMethod() {
  return useContext(DeliveryMethodContext)
}
