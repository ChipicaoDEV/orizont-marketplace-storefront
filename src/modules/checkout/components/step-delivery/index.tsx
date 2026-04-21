"use client"

import { useActionState, useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { saveDeliveryInfo } from "@lib/data/cart"

// ── Romanian counties ─────────────────────────────────────────────────────────

const JUDETE = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud",
  "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin",
  "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj",
  "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița",
  "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț",
  "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava",
  "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea",
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  pattern,
  title,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
  pattern?: string
  title?: string
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#333333]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        pattern={pattern}
        title={title}
        className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent placeholder:text-gray-400"
      />
    </div>
  )
}

function CountySelect({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#333333]">
        Județ<span className="text-red-500 ml-0.5">*</span>
      </label>
      <select
        id={name}
        name={name}
        required
        defaultValue={defaultValue ?? ""}
        className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
      >
        <option value="">Selectează județul</option>
        {JUDETE.map((j) => (
          <option key={j} value={j}>{j}</option>
        ))}
      </select>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ── Address form fields ───────────────────────────────────────────────────────

function AddressFields({
  addr,
  pre,
  defFullName,
  cart,
  customer,
  billing,
  onBillingChange,
  showCompanyToggle = true,
}: {
  addr: HttpTypes.StoreAddress | null | undefined
  pre: HttpTypes.StoreCustomerAddress | null | undefined
  defFullName: string
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  billing: boolean
  onBillingChange: (v: boolean) => void
  showCompanyToggle?: boolean
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field
            label="Nume complet"
            name="full_name"
            required
            placeholder="Prenume Nume"
            defaultValue={defFullName}
          />
        </div>

        <Field
          label="Telefon"
          name="phone"
          type="tel"
          required
          placeholder="07XX XXX XXX"
          defaultValue={addr?.phone ?? pre?.phone ?? ""}
          pattern="^(\+?40|0)[0-9]{9}$"
          title="Număr de telefon românesc valid (ex: 0740123456)"
        />

        <Field
          label="Email"
          name="email"
          type="email"
          required
          placeholder="adresa@exemplu.ro"
          defaultValue={cart?.email ?? customer?.email ?? ""}
        />

        <div className="sm:col-span-2">
          <Field
            label="Adresă"
            name="address_1"
            required
            placeholder="Strada, numărul, blocul, apartamentul"
            defaultValue={addr?.address_1 ?? pre?.address_1 ?? ""}
          />
        </div>

        <Field
          label="Oraș"
          name="city"
          required
          placeholder="București"
          defaultValue={addr?.city ?? pre?.city ?? ""}
        />

        <CountySelect name="province" defaultValue={addr?.province ?? pre?.province ?? ""} />

        <Field
          label="Cod poștal"
          name="postal_code"
          placeholder="123456"
          defaultValue={addr?.postal_code ?? pre?.postal_code ?? ""}
        />
      </div>

      {showCompanyToggle && (
        <div className="border-t border-gray-100 pt-4">
          <label className="flex items-center gap-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={billing}
              onChange={(e) => onBillingChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#F27A1A] accent-[#F27A1A]"
            />
            <span className="text-sm font-medium text-[#333333]">Facturare pe firmă</span>
          </label>

          {billing && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nume firmă"
                name="company"
                placeholder="S.C. Firma S.R.L."
                defaultValue={addr?.company ?? ""}
              />
              <Field
                label="CUI"
                name="cui"
                placeholder="RO12345678"
                defaultValue={addr?.address_2 ?? ""}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

type StepDeliveryProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  method: "livrare" | "pickup"
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StepDelivery({ cart, customer, method }: StepDeliveryProps) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()

  const isPickup = method === "pickup"

  const [step1State, formAction1, isPending1] = useActionState(saveDeliveryInfo, null)

  // "Facturare pe firmă" toggle — used only for pickup (billing details)
  const [billing, setBilling] = useState(false)

  // Separate billing address toggle — used only for livrare
  const [useDifferentBilling, setUseDifferentBilling] = useState(false)
  const [billingCompany, setBillingCompany] = useState(false)

  // Saved address selector
  const savedAddresses = customer?.addresses ?? []
  const [selectedAddrId, setSelectedAddrId] = useState<string>("")

  const addr = cart?.shipping_address
  const pre = savedAddresses.find((a) => a.id === selectedAddrId) ?? savedAddresses[0] ?? null

  const defFullName =
    addr?.first_name
      ? `${addr.first_name} ${addr.last_name ?? ""}`.trim()
      : pre?.first_name
      ? `${pre.first_name} ${pre.last_name ?? ""}`.trim()
      : ""

  const addressSaved =
    step1State !== null &&
    typeof step1State === "object" &&
    "ok" in (step1State as object)

  // After address + shipping method saved, redirect to payment
  useEffect(() => {
    if (addressSaved) {
      router.push(`/checkout?step=payment&method=${method}`)
    }
  }, [addressSaved, router, countryCode, method])

  // Show spinner while redirecting
  if (addressSaved) {
    return (
      <div className="flex flex-col items-center gap-y-4 py-10 text-gray-400">
        <Spinner />
        <span className="text-sm">Se redirecționează spre plată...</span>
      </div>
    )
  }

  // ── Address form ──────────────────────────────────────────────────────────────
  const formTitle = isPickup ? "Date de facturare" : "Informații de livrare"

  return (
    <form action={formAction1} className="flex flex-col gap-y-5">
      <input type="hidden" name="delivery_method" value={method} />
      {!isPickup && (
        <input
          type="hidden"
          name="use_different_billing"
          value={useDifferentBilling ? "true" : "false"}
        />
      )}

      {/* Back to delivery method */}
      <button
        type="button"
        onClick={() => router.push(`/checkout?step=delivery`)}
        className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[#F27A1A] transition-colors w-fit -mb-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Înapoi
      </button>

      {/* Badge showing selected method */}
      <div className="flex items-center gap-x-3">
        <div
          className={`inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isPickup
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-[#FFF3E6] text-[#D4600E] border border-[#F27A1A]/30"
          }`}
        >
          {isPickup ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          )}
          {isPickup ? "Ridicare Personală" : "Livrare la adresă"}
        </div>
      </div>

      {savedAddresses.length > 0 && (
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="saved_addr_select" className="text-sm font-medium text-[#333333]">
            Adresă salvată
          </label>
          <select
            id="saved_addr_select"
            value={selectedAddrId}
            onChange={(e) => setSelectedAddrId(e.target.value)}
            className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
          >
            <option value="">Adresă nouă</option>
            {savedAddresses.map((a) => (
              <option key={a.id} value={a.id ?? ""}>
                {[a.first_name, a.last_name].filter(Boolean).join(" ")}
                {a.address_1 ? ` — ${a.address_1}` : ""}
                {a.city ? `, ${a.city}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <h2 className="text-lg font-bold text-[#1A1A1A]">{formTitle}</h2>

      {/* ── Pickup: standard address fields with company toggle ─────────────── */}
      {isPickup && (
        <AddressFields
          key={selectedAddrId || "new"}
          addr={addr}
          pre={pre}
          defFullName={defFullName}
          cart={cart}
          customer={customer}
          billing={billing}
          onBillingChange={setBilling}
        />
      )}

      {/* ── Livrare: shipping fields + optional separate billing section ────── */}
      {!isPickup && (
        <>
          <AddressFields
            key={selectedAddrId || "new"}
            addr={addr}
            pre={pre}
            defFullName={defFullName}
            cart={cart}
            customer={customer}
            billing={false}
            onBillingChange={() => {}}
            showCompanyToggle={false}
          />

          {/* Billing toggle */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-y-3">
            <label className="flex items-center gap-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useDifferentBilling}
                onChange={(e) => setUseDifferentBilling(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#F27A1A]"
              />
              <div>
                <span className="text-sm font-medium text-[#333333]">Detalii facturare</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  Bifează dacă adresa de facturare diferă de cea de livrare
                </p>
              </div>
            </label>

            {useDifferentBilling && (
              <div className="mt-1 flex flex-col gap-y-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-[#1A1A1A]">Adresă de facturare</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field
                      label="Nume complet"
                      name="billing_full_name"
                      required
                      placeholder="Prenume Nume"
                    />
                  </div>

                  <Field
                    label="Telefon"
                    name="billing_phone"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    pattern="^(\+?40|0)[0-9]{9}$"
                    title="Număr de telefon românesc valid (ex: 0740123456)"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Adresă"
                      name="billing_address_1"
                      required
                      placeholder="Strada, numărul, blocul, apartamentul"
                    />
                  </div>

                  <Field
                    label="Oraș"
                    name="billing_city"
                    required
                    placeholder="București"
                  />

                  <CountySelect name="billing_province" />

                  <Field
                    label="Cod poștal"
                    name="billing_postal_code"
                    placeholder="123456"
                  />
                </div>

                {/* Company billing */}
                <div>
                  <label className="flex items-center gap-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={billingCompany}
                      onChange={(e) => setBillingCompany(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#F27A1A]"
                    />
                    <span className="text-sm font-medium text-[#333333]">Facturare pe firmă</span>
                  </label>

                  {billingCompany && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Nume firmă"
                        name="billing_company"
                        placeholder="S.C. Firma S.R.L."
                      />
                      <Field
                        label="CUI"
                        name="billing_cui"
                        placeholder="RO12345678"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {step1State && typeof step1State === "string" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {step1State}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending1}
        className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending1 ? (
          <><Spinner />Se procesează...</>
        ) : (
          <>
            Continuă spre plată
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
