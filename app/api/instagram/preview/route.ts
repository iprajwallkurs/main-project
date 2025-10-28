import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const link = (url.searchParams.get("link") || "").trim()
  if (!link) return NextResponse.json({ error: "Missing link" }, { status: 400 })
  try {
    // Normalize and proxy through Jina reader to bypass IG blocking
    const normalized = link.startsWith("http") ? link : `https://${link}`
    const via = `https://r.jina.ai/http/${normalized.replace(/^https?:\/\//, "")}`
    const resp = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0" } })
    if (!resp.ok) return NextResponse.json({ error: `Fetch failed (${resp.status})` }, { status: 502 })
    const html = await resp.text()
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim()
    const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim()
    const title = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim()
    const thumbnail = og || tw || "https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png"
    return NextResponse.json({ title: title || link, link: normalized, thumbnail })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Preview failed" }, { status: 500 })
  }
}
