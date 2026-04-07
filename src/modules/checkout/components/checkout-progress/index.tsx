const STEPS = [
  { key: "delivery", label: "Livrare", num: 1 },
  { key: "address", label: "Date", num: 2 },
  { key: "payment", label: "Plată", num: 3 },
  { key: "confirmation", label: "Confirmare", num: 4 },
] as const

type StepKey = (typeof STEPS)[number]["key"]

type CheckoutProgressProps = {
  step: StepKey
}

export default function CheckoutProgress({ step }: CheckoutProgressProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === step)

  return (
    <nav aria-label="Pași checkout" className="flex items-center justify-center gap-x-0">
      {STEPS.map((s, i) => {
        const isDone = i < currentIdx
        const isActive = i === currentIdx

        return (
          <div key={s.key} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-y-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                  isDone
                    ? "bg-[#2E7D32] text-white"
                    : isActive
                    ? "bg-[#F27A1A] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-[#F27A1A]" : isDone ? "text-[#2E7D32]" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-10 sm:w-16 mx-2 mb-5 transition-colors duration-200 ${
                  i < currentIdx ? "bg-[#2E7D32]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
