"use client"

import { createContext, useContext, useState } from "react"

export type DrawerItem = {
  title: string
  thumbnail: string | null
  price: number | null
  quantity: number
}

type CartDrawerContextType = {
  isOpen: boolean
  item: DrawerItem | null
  cartTotal: number | null
  cartItemCount: number
  openDrawer: (item: DrawerItem, cartTotal: number | null, cartItemCount: number) => void
  closeDrawer: () => void
}

const CartDrawerContext = createContext<CartDrawerContextType>({
  isOpen: false,
  item: null,
  cartTotal: null,
  cartItemCount: 0,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [item, setItem] = useState<DrawerItem | null>(null)
  const [cartTotal, setCartTotal] = useState<number | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)

  const openDrawer = (newItem: DrawerItem, total: number | null, count: number) => {
    setItem(newItem)
    setCartTotal(total)
    setCartItemCount(count)
    setIsOpen(true)
  }

  const closeDrawer = () => setIsOpen(false)

  return (
    <CartDrawerContext.Provider value={{ isOpen, item, cartTotal, cartItemCount, openDrawer, closeDrawer }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  return useContext(CartDrawerContext)
}
