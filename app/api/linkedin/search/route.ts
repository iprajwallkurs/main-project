import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "6", 10), 18)
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 })
  try {
    // DuckDuckGo HTML search for site:linkedin.com
    let html = ""
    try {
      const ddg = await fetch(
        `https://duckduckgo.com/html/?q=${encodeURIComponent(q + " site:linkedin.com")}`,
        { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } },
      )
      html = await ddg.text()
    } catch {}
    if (!html) {
      try {
        const via = `https://r.jina.ai/http/duckduckgo.com/html/?q=${encodeURIComponent(q + " site:linkedin.com")}`
        const prox = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } })
        html = await prox.text()
      } catch {}
    }

    let items: Array<{ title: string; link: string; thumbnail?: string }>=[]
    if (html) {
      const linkRegex = /<a[^>]+class=\"result__a\"[^>]+href=\"([^\"]+)\"[^>]*>(.*?)<\/a>/g
      let m: RegExpExecArray | null
      while ((m = linkRegex.exec(html)) && items.length < max) {
        const link = m[1]
        let title = m[2]?.replace(/<[^>]+>/g, " ").trim()
        if (!title) title = link
        if (link.includes("linkedin.com")) {
          items.push({ title, link })
        }
      }
    }

    let enriched = await enrichThumbs(items.slice(0, max))
    if (enriched.length === 0) {
      // Trending fallback: broader queries for linkedin posts/pulse
      const queries = [
        "site:linkedin.com/posts",
        "site:linkedin.com/pulse",
        "site:linkedin.com/company",
      ]
      for (const q2 of queries) {
        try {
          const via = `https://r.jina.ai/http/duckduckgo.com/html/?q=${encodeURIComponent(q2)}`
          const resp = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } })
          const html2 = await resp.text()
          const linkRegex2 = /<a[^>]+class=\"result__a\"[^>]+href=\"([^\"]+)\"[^>]*>(.*?)<\/a>/g
          const temp: Array<{ title: string; link: string }> = []
          let m: RegExpExecArray | null
          while ((m = linkRegex2.exec(html2)) && temp.length < max) {
            const link = m[1]
            let title = m[2]?.replace(/<[^>]+>/g, " ").trim() || link
            if (link.includes("linkedin.com")) temp.push({ title, link })
          }
          if (temp.length > 0) {
            enriched = await enrichThumbs(temp.slice(0, max))
            if (enriched.length > 0) return NextResponse.json({ items: enriched, note: "trending_fallback" })
          }
        } catch {}
      }
    }
    return NextResponse.json({ items: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "LinkedIn search failed" }, { status: 500 })
  }
}

async function enrichThumbs(items: Array<{ title: string; link: string; thumbnail?: string }>) {
  const out = [...items]
  const tasks = out.map(async (it, idx) => {
    try {
      const proxied = it.link.startsWith("http") ? it.link : `https://${it.link}`
      const via = `https://r.jina.ai/http/${proxied.replace(/^https?:\/\//, "")}`
      const resp = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0" } })
      const html = await resp.text()
      const m1 = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      const m2 = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      const url = (m1?.[1] || m2?.[1])?.trim()
      if (url) out[idx] = { ...it, thumbnail: url }
    } catch {}
  })
  await Promise.allSettled(tasks)
  return out
}
