import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_EXCLUDED = ["/login", "/_next/", "/favicon.ico", "/public/"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Auth is opt-in: enforce only if explicitly enabled
  if (process.env.ENABLE_AUTH !== "true") {
    return NextResponse.next()
  }
  // Allow excluded paths
  if (AUTH_EXCLUDED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  // Allow all API routes (including auth)
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/(.*)"],
}
