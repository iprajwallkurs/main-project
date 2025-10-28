import { NextResponse } from "next/server"

const SERPER_API = process.env.SERPER_API_KEY

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "9", 10), 18)
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 })

  try {
    if (SERPER_API) {
      const resp = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": SERPER_API },
        body: JSON.stringify({ q: `${q} site:instagram.com`, num: max }),
      })
      const data = await resp.json()
      const org = Array.isArray(data.organic) ? data.organic : []
      let items = org
        .map((r: any) => ({ title: r.title, link: r.link, thumbnail: r.imageUrl || r.thumbnailUrl || undefined }))
        .filter((it: any) => /instagram\.com/.test(it.link))
      // prefer posts/reels first
      const posts = items.filter((it) => /\/p\//.test(it.link) || /\/reel\//.test(it.link) || /\/tv\//.test(it.link))
      items = (posts.length > 0 ? posts : items).slice(0, max)
      items = await enrichThumbnails(items, max)
      return NextResponse.json({ items })
    }

    // Fallback: DuckDuckGo HTML (best-effort, try direct and via Jina Reader)
    let html = ""
    try {
      const ddg = await fetch(
        `https://duckduckgo.com/html/?q=${encodeURIComponent(q + " site:instagram.com")}`,
        { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } },
      )
      html = await ddg.text()
    } catch {}
    if (!html) {
      try {
        const via = `https://r.jina.ai/http/duckduckgo.com/html/?q=${encodeURIComponent(q + " site:instagram.com")}`
        const prox = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" } })
        html = await prox.text()
      } catch {}
    }

    let items: Array<{ title: string; link: string; thumbnail?: string }> = []

    // Try to extract from result__a links
    const linkRegex = /<a[^>]+class=\"result__a\"[^>]+href=\"([^\"]+)\"[^>]*>(.*?)<\/a>/g
    let m: RegExpExecArray | null
    while (html && (m = linkRegex.exec(html)) && items.length < max) {
      const link = m[1]
      let title = m[2]?.replace(/<[^>]+>/g, " ").trim()
      if (!title) title = link
      if (link.includes("instagram.com")) {
        items.push({
          title,
          link,
          thumbnail: undefined,
        })
      }
    }

    // Prefer post/reel links if present
    const postFirst = items.filter((it) => /\/p\//.test(it.link) || /\/reel\//.test(it.link) || /\/tv\//.test(it.link))
    items = (postFirst.length > 0 ? postFirst : items).slice(0, max)

    items = await enrichThumbnails(items, max)
    if (items.length === 0) {
      // Hashtag/Profile fallback: try tag and simple profile pages, extract /p/ or /reel/ links
      const tokens = q
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.replace(/[^a-z0-9_#]/g, ""))
        .filter(Boolean)
      const candidates = Array.from(
        new Set(
          tokens
            .map((t) => t.replace(/^#/, ""))
            .flatMap((t) => [
              `https://www.instagram.com/explore/tags/${t}/`,
              `https://www.instagram.com/${t}/`,
            ]),
        ),
      ).slice(0, 4)

      const found: Array<{ title: string; link: string; thumbnail?: string }> = []
      for (const page of candidates) {
        try {
          const via = `https://r.jina.ai/http/${page.replace(/^https?:\/\//, "")}`
          const resp = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0" } })
          const html = await resp.text()
          const re = /href=["'](https?:\/\/www\.instagram\.com\/(?:p|reel)\/[^"'#?\s\/]+\/?)["']/g
          let m: RegExpExecArray | null
          while ((m = re.exec(html)) && found.length < max) {
            const link = m[1]
            if (!found.some((f) => f.link === link)) {
              found.push({ title: link, link })
            }
          }
        } catch {}
        if (found.length >= max) break
      }

      if (found.length > 0) {
        const enriched = await enrichThumbnails(found.slice(0, max), max)
        return NextResponse.json({ items: enriched, note: "hashtag_fallback" })
      }

      // Final trending fallback: Instagram Explore
      try {
        const via = `https://r.jina.ai/http/www.instagram.com/explore/`
        const resp = await fetch(via, { headers: { "User-Agent": "Mozilla/5.0" } })
        const html = await resp.text()
        const re = /href=["'](https?:\/\/www\.instagram\.com\/(?:p|reel)\/[^"'#?\s\/]+\/?)["']/g
        const links: string[] = []
        let m: RegExpExecArray | null
        while ((m = re.exec(html)) && links.length < max) {
          const link = m[1]
          if (!links.includes(link)) links.push(link)
        }
        if (links.length > 0) {
          const items2 = links.map((link) => ({ title: link, link }))
          const enriched2 = await enrichThumbnails(items2.slice(0, max), max)
          if (enriched2.length > 0) return NextResponse.json({ items: enriched2, note: "trending_fallback" })
        }
      } catch {}
    }
    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Instagram search failed" }, { status: 500 })
  }
}

async function enrichThumbnails(
  items: Array<{ title: string; link: string; thumbnail?: string }>,
  max: number,
) {
  const out = [...items]
  const need = out
    .map((it, idx) => ({ it, idx }))
    .filter(({ it }) => !it.thumbnail)
    .slice(0, Math.min(6, max))

  const withTimeout = (p: Promise<Response>, ms: number) =>
    Promise.race([
      p,
      new Promise<Response>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)) as any,
    ])

  const tasks = need.map(async ({ it, idx }) => {
    try {
      // Try via Jina Reader proxy to avoid IG blocking
      const proxied = it.link.startsWith("http") ? it.link : `https://${it.link}`
      const via = `https://r.jina.ai/http://${proxied.replace(/^https?:\/\//, "")}`
      const resp = await withTimeout(fetch(via, { headers: { "User-Agent": "Mozilla/5.0" } }), 5000)
      const html = await resp.text()
      const m1 = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      const m2 = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      const url = (m1?.[1] || m2?.[1])?.trim()
      if (url) out[idx] = { ...it, thumbnail: url }
      else if (!out[idx].thumbnail) {
        // last resort: IG favicon (only if nothing else)
        out[idx] = {
          ...it,
          thumbnail: "https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png",
        }
      }
    } catch (_) {
      if (!out[idx].thumbnail) {
        out[idx] = {
          ...it,
          thumbnail: "https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png",
        }
      }
    }
  })
  await Promise.allSettled(tasks)
  return out
}
