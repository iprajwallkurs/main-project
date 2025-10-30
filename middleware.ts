import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_EXCLUDED = ["/login", "/_next/", "/favicon.ico", "/public/"]

// Use an env var when available so CI can inject a unique build marker; fallback to the
// same date used elsewhere in the app.
const DEPLOYED_BUILD = process.env.DEPLOYED_BUILD || "2025-10-30T00:00:00Z"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Emit a deployment header for API and verification endpoints so requests can be
  // correlated to a specific build. We return early here because API routes are
  // intentionally allowed (auth is opt-in) and we should not interfere with their
  // normal handling.
  if (pathname.startsWith("/api") || pathname.startsWith("/deploy-check")) {
    const res = NextResponse.next()
    res.headers.set("X-Deployed-Build", DEPLOYED_BUILD)
    return res
  }

  // Auth is opt-in: enforce only if explicitly enabled
  if (process.env.ENABLE_AUTH !== "true") {
    return NextResponse.next()
  }

  // Allow excluded paths
  if (AUTH_EXCLUDED.some((p) => pathname.startsWith(p))) {
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
