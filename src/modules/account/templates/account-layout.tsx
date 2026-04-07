import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 bg-gray-50/50" data-testid="account-page">
      <div className="content-container h-full max-w-7xl mx-auto flex flex-col py-8 small:py-16">
        <div className="grid grid-cols-1 small:grid-cols-[260px_1fr] gap-x-12">
          <aside className="hidden small:block sticky top-24 self-start">
            {customer && <AccountNav customer={customer} />}
          </aside>
          <main className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] p-6 small:p-10">
            {children}
          </main>
        </div>
        
        <div className="flex flex-col small:flex-row items-center justify-between border-t border-gray-100 mt-16 py-12 gap-8">
          <div className="text-center small:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Got questions?</h3>
            <p className="text-gray-500 max-w-md">
              Our customer service team is here to help with any inquiries regarding your account, orders, or profile.
            </p>
          </div>
          <div className="flex items-center gap-x-4">
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
