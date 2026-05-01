"use client"

export default function AvailabilityBadge() {
  const now = new Date()
  const bucharest = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Bucharest" }))
  const day = bucharest.getDay()
  const t = bucharest.getHours() * 60 + bucharest.getMinutes()

  const available =
    (day >= 1 && day <= 5 && t >= 8 * 60 && t < 17 * 60) ||
    (day === 6 && t >= 8 * 60 && t < 13 * 60)

  if (available) {
    return (
      <span className="mt-1 inline-flex items-center gap-x-1 text-xs font-medium text-[#F27A1A]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Disponibil acum
      </span>
    )
  }

  return (
    <span className="mt-1 text-xs text-gray-400 leading-tight text-center">
      L–V 08:00–17:00 · Sâmbătă 08:00–13:00
    </span>
  )
}
