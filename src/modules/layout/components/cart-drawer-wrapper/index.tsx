"use client"

import { CartDrawerProvider } from "@modules/cart/context/cart-drawer-context"
import AddToCartDrawer from "@modules/cart/components/add-to-cart-drawer"

export default function CartDrawerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartDrawerProvider>
      {children}
      <AddToCartDrawer />
    </CartDrawerProvider>
  )
}
