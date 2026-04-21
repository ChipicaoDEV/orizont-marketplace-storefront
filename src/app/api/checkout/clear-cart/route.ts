import { type NextRequest, NextResponse } from "next/server"
import { removeCartId } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/"
  await removeCartId()
  revalidateTag("customers")
  revalidateTag("orders")
  const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${request.headers.get("host")}`
  return NextResponse.redirect(new URL(redirectTo, base))
}
