import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "9", 10), 30)
  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "1", 10) || 1, 1), 30)
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 })
  try {
    const dayAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * days
    const resp = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=story&numericFilters=created_at_i>${dayAgo}&hitsPerPage=${Math.min(
        Math.max(max, 20),
        50,
      )}`,
    )
    const data = await resp.json()
    const items = (data?.hits || []).slice(0, max).map((h: any) => ({
      title: h.title,
      link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      source: "Hacker News",
      thumbnail: undefined,
    }))
    // If HN returned no items, provide a small demo fallback so the UI remains useful.
    if (!items || items.length === 0) {
      const demo = [
      { title: "Show HN: Sleek - AI mobile app mockup generator", link: "https://sleek.design", source: "Hacker News" },
      { title: "Show HN: Tiny CI improvements for fast feedback", link: "https://example.com/ci", source: "Hacker News" },
      ]
      return NextResponse.json({ items: demo, note: "Demo results (free mode)." })
    }

    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "HN search failed" }, { status: 500 })
  }
}
