"use client"

import { clx } from "@medusajs/ui"
import { 
  ArrowRightOnRectangle, 
  SquaresPlus, 
  User, 
  MapPin, 
  Component 
} from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Cont</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">
              Bună, {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User />
                        <span>Profil</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin />
                        <span>Adrese</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package />
                      <span>Comenzi</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>Deconectare</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
          <div className="flex flex-col gap-y-1 pb-8 border-b border-gray-100 px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Contul meu</span>
            <span className="text-sm font-semibold text-gray-900 truncate" data-testid="customer-email">
              {customer?.email}
            </span>
          </div>

          <ul className="flex flex-col gap-y-2 text-sm font-semibold mt-6">
            <li>
              <AccountNavLink
                href="/account"
                route={route!}
                icon={<SquaresPlus />}
                data-testid="overview-link"
              >
                Prezentare generală
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/profile"
                route={route!}
                icon={<User />}
                data-testid="profile-link"
              >
                Profil
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/addresses"
                route={route!}
                icon={<MapPin />}
                data-testid="addresses-link"
              >
                Adrese
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/orders"
                route={route!}
                icon={<Package />}
                data-testid="orders-link"
              >
                Comenzi
              </AccountNavLink>
            </li>
            <li className="pt-4 mt-4 border-t border-gray-100">
              <button
                type="button"
                className="flex items-center gap-x-3 w-full px-4 py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <ArrowRightOnRectangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Deconectare</span>
              </button>
            </li>
          </ul>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  icon: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  icon,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center gap-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        {
          "bg-gray-900 text-white shadow-lg shadow-gray-200": active,
          "text-gray-500 hover:bg-gray-100 hover:text-gray-900": !active,
        }
      )}
      data-testid={dataTestId}
    >
      <div className={clx("transition-transform duration-200", {
        "group-hover:scale-110": !active
      })}>
        {icon}
      </div>
      <span className="font-medium">{children}</span>
    </LocalizedClientLink>
  )
}

export default AccountNav
