import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = { ...((init?.headers as Record<string, string>) ?? {}) }

  try {
    const locale = (await getLocaleHeader())["x-medusa-locale"]
    // Only set the header when we actually have a non-null locale string.
    // Spreading a { "x-medusa-locale": null } object into headers would add
    // a null-valued header, which some fetch implementations (Node/undici)
    // reject, causing "Error setting up the request" on every SDK call.
    if (locale != null) {
      headers["x-medusa-locale"] ??= locale
    }
  } catch {}

  return originalFetch(input, { ...init, headers })
}
