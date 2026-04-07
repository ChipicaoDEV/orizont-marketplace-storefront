import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import { getRegion } from "@lib/data/regions"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q")?.trim() ?? ""
  const countryCode = searchParams.get("countryCode") ?? "ro"

  if (q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return NextResponse.json({ products: [] })
  }

  const headers = await getAuthHeaders()

  try {
    const { products } = await sdk.client.fetch<{ products: any[] }>(
      "/store/products",
      {
        method: "GET",
        query: {
          q,
          limit: 5,
          region_id: region.id,
          fields:
            "*variants.calculated_price,+metadata,*categories",
        },
        headers,
        cache: "no-store",
      }
    )

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
