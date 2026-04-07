/**
 * Normalises errors thrown by the Medusa JS SDK v2.
 *
 * The SDK v2 uses `fetch` internally and throws plain Error objects (or
 * FetchError subclasses) whose shape is:
 *
 *   { status: number, message: string }
 *
 * The original implementation here expected axios-style errors
 * ({ error.response.data, error.request, error.config }), which never match
 * SDK v2 errors — every real backend error fell through to the useless
 * "Error setting up the request: An unknown error occurred" message.
 *
 * This version handles both shapes so legacy code paths still work while
 * SDK v2 errors surface their actual message.
 */
export default function medusaError(error: any): never {
  // ── Axios-style (legacy / some SDK v1 paths) ─────────────────────────────
  if (error?.response?.data) {
    const data = error.response.data
    const raw: string = data.message ?? data ?? "A apărut o eroare."
    const msg = typeof raw === "string" ? raw : JSON.stringify(raw)
    throw new Error(msg.charAt(0).toUpperCase() + msg.slice(1))
  }

  // ── Medusa SDK v2 ─────────────────────────────────────────────────────────
  // Errors come back as plain Error / FetchError with .status and .message
  const message: string =
    error?.message ??
    (error?.status ? `Eroare HTTP ${error.status}` : "A apărut o eroare. Încearcă din nou.")

  throw new Error(message)
}
