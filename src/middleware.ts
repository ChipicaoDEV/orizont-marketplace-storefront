import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ro"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Resolves the country code from the region map.
 * Since this is a Romania-only store, we always resolve to "ro" (or
 * whatever DEFAULT_REGION is configured to), without reading the URL path.
 */
async function getCountryCode(
  regionMap: Map<string, HttpTypes.StoreRegion | number>
): Promise<string | undefined> {
  try {
    if (regionMap.has(DEFAULT_REGION)) {
      return DEFAULT_REGION
    }

    // Fallback: use the first available country in any region
    const firstKey = regionMap.keys().next().value
    if (firstKey) {
      return firstKey as string
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

/**
 * Middleware to handle region selection.
 *
 * This store serves Romania only. Instead of redirecting visitors to a
 * /{countryCode}/... URL, we use Next.js URL rewrites so that the [countryCode]
 * dynamic segment receives "ro" while the browser always sees clean URLs
 * (e.g. /produse/..., /cos, /cont/...).
 *
 * If a URL already contains the country code prefix (e.g. /ro/cont from a
 * server-side redirect), we strip it and redirect to the clean URL.
 */
export async function middleware(request: NextRequest) {
  // Skip static assets
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(regionMap))

  if (!countryCode) {
    return new NextResponse(
      "No valid regions configured. Please set up regions with countries in your Medusa Admin.",
      { status: 500 }
    )
  }

  const pathname = request.nextUrl.pathname
  const queryString = request.nextUrl.search ?? ""

  // If the URL already has the country code prefix, strip it and redirect so
  // the browser always sees clean URLs (handles legacy links and server redirects).
  if (
    pathname === `/${countryCode}` ||
    pathname.startsWith(`/${countryCode}/`)
  ) {
    const cleanPath = pathname.slice(countryCode.length + 1) || "/"
    const cleanUrl = new URL(`${cleanPath}${queryString}`, request.url)
    const response = NextResponse.redirect(cleanUrl, 308)
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, { maxAge: 60 * 60 * 24 })
    }
    return response
  }

  // Rewrite the URL internally to /{countryCode}/... so that Next.js resolves
  // the [countryCode] dynamic segment, but the browser URL remains unchanged.
  const rewriteUrl = new URL(
    `/${countryCode}${pathname === "/" ? "" : pathname}${queryString}`,
    request.url
  )

  const response = NextResponse.rewrite(rewriteUrl)

  // Persist the cache id cookie if it wasn't already set
  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
