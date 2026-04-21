import { type NextRequest, NextResponse } from "next/server"
import { removeCartId } from "@lib/data/cookies"

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/"
  await removeCartId()
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
