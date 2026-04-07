import { retrieveCart } from "@lib/data/cart"
import NavCartDropdown from "@modules/layout/components/nav-cart-dropdown"

const HeaderCartButton = async () => {
  const cart = await retrieveCart().catch(() => null)
  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0

  return <NavCartDropdown cart={cart} itemCount={itemCount} />
}

export default HeaderCartButton
