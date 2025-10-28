import { NextResponse } from "next/server"
import { exchangeCodeForTokens, tokensToCookie } from "@/lib/google"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 })
  }

  try {
    const tokens = await exchangeCodeForTokens(code)
    const res = NextResponse.redirect(new URL("/#/calendar-agent", url.origin))
    res.cookies.set("gcal_tokens", tokensToCookie(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to exchange code" }, { status: 500 })
  }
}
