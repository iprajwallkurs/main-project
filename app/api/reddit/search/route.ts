import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "9", 10), 30)
  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "1", 10) || 1, 1), 30)
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 })

  try {
    const limit = Math.max(max, 25)
    const base = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=${limit}&sort=new`
    const resp = await fetch(base, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
    const data = await resp.json()
    const now = Math.floor(Date.now() / 1000)
    const cutoff = now - 60 * 60 * 24 * days
    const all = (data?.data?.children || [])
      .map((c: any) => c?.data)
      .filter(Boolean)
      // Only last 24 hours
    const filtered = all.filter((p: any) => typeof p?.created_utc === "number" && p.created_utc >= cutoff)
    const toUse = filtered.length > 0 ? filtered : all
    const items = toUse
      .map((p: any) => {
        const previewSrc = p?.preview?.images?.[0]?.source?.url
        const cleanPreview = typeof previewSrc === "string" ? previewSrc.replace(/&amp;/g, "&") : undefined
        const thumb = cleanPreview && /^https?:\/\//.test(cleanPreview)
          ? cleanPreview
          : (p.thumbnail && /^https?:\/\//.test(p.thumbnail) ? p.thumbnail : undefined)
        return {
          title: p.title,
          link: `https://www.reddit.com${p.permalink}`,
          thumbnail: thumb,
          source: p.subreddit_name_prefixed,
        }
      })
      .slice(0, max)
    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Reddit search failed" }, { status: 500 })
  }
}
