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

export function DeliveryMethodProvider({
  children,
  initialMethod = "livrare",
}: {
  children: React.ReactNode
  initialMethod?: Method
}) {
  const [method, setMethod] = useState<Method>(initialMethod)
  return (
    <DeliveryMethodContext.Provider value={{ method, setMethod }}>
      {children}
    </DeliveryMethodContext.Provider>
  )
}

export function useDeliveryMethod() {
  return useContext(DeliveryMethodContext)
}
