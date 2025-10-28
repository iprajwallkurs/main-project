import { NextResponse } from "next/server"

const SERPER_API = process.env.SERPER_API_KEY
const BING_API = process.env.BING_API_KEY

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "10", 10), 20)
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 })

  try {
    if (SERPER_API) {
      const resp = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": SERPER_API },
        body: JSON.stringify({ q }),
      })
      const data = await resp.json()
      const vids = (data.videos || []).slice(0, max).map((v: any) => ({
        title: v.title,
        link: v.link,
        source: v.source,
        thumbnail: v.imageUrl || v.thumbnailUrl,
        date: v.date,
      }))
      if (vids.length > 0) return NextResponse.json({ items: vids })
    }

    if (BING_API) {
      const resp = await fetch(`https://api.bing.microsoft.com/v7.0/videos/search?q=${encodeURIComponent(q)}&count=${max}`, {
        headers: { "Ocp-Apim-Subscription-Key": BING_API },
      })
      const data = await resp.json()
      const vids = (data.value || []).map((v: any) => ({
        title: v.name,
        link: v.contentUrl,
        source: v.publisher?.[0]?.name || "",
        thumbnail: v.thumbnailUrl,
        date: v.datePublished,
      }))
      if (vids.length > 0) return NextResponse.json({ items: vids })
    }

    // No-key fallback via public YouTube proxies (try multiple)
    const fallbacks = [
      (q: string) => `https://piped.video/api/v1/search?q=${encodeURIComponent(q)}&filter=videos`,
      (q: string) => `https://piped.video/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://piped.kavin.rocks/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://yt.artemislena.eu/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://yewtu.be/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://invidious.projectsegfau.lt/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
      (q: string) => `https://inv.n8pjl.ca/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
    ]

    let items: any[] = []
    for (const buildUrl of fallbacks) {
      try {
        const resp = await fetch(buildUrl(q), { headers: { Accept: "application/json" } })
        const json = await resp.json().catch(() => null)
        if (!json) continue
        const arr = Array.isArray(json) ? json : json.items || json.videos || []
        const vids = arr
          .filter((v: any) => (v.type ? v.type === "video" : (v.videoId || v.url || v.link)))
          .map((v: any) => {
            const link = v.url
              ? v.url.startsWith("http")
                ? v.url
                : `https://www.youtube.com${v.url}`
              : v.videoId
                ? `https://www.youtube.com/watch?v=${v.videoId}`
                : v.link || ""
            const thumb0 = v.thumbnail || v.thumbnailUrl || (Array.isArray(v.thumbnails) ? v.thumbnails[0]?.url : undefined) || (v.thumbnailUrls?.[0] ?? undefined)
            let vid: string | undefined = v.videoId
            if (!vid && link) {
              try {
                const u = new URL(link)
                vid = u.searchParams.get("v") || u.pathname.match(/youtu\.be\/([^?&/]+)/)?.[1] || undefined
              } catch {}
              if (!vid) {
                const m = link.match(/v=([^&]+)/) || link.match(/youtu\.be\/([^?&/]+)/)
                if (m) vid = m[1]
              }
            }
            const thumb = thumb0 || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined)
            const source = v.uploaderName || v.uploader || v.author || "YouTube"
            const date = v.uploadedDate || v.publishedText || v.uploaded || v.date || undefined
            return { title: v.title, link, source, thumbnail: thumb, date }
          })
          .filter((v: any) => v.link && v.title)
        for (const v of vids) {
          if (items.length >= max) break
          // de-duplicate by link
          if (!items.some((it) => it.link === v.link)) items.push(v)
        }
        if (items.length >= max) break
      } catch (_) {
        // try next instance
      }
    }

    // Sort and filter aggregated items by simple relevance score
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
    const score = (t?: string) => {
      if (!t) return 0
      const tl = t.toLowerCase()
      return tokens.reduce((acc, tok) => acc + (tl.includes(tok) ? 1 : 0), 0)
    }
    if (items.length > 0) {
      items.sort((a, b) => score(b.title) - score(a.title))
      const filtered = items.filter((it) => score(it.title) >= 1)
      if (filtered.length >= Math.min(3, items.length)) {
        items = filtered
      }
    }

    // Enrich with Dailymotion (no key) if still under max
    if (items.length < max) {
      try {
        const dm = await fetch(
          `https://api.dailymotion.com/videos?search=${encodeURIComponent(q)}&limit=${max}&fields=title,url,thumbnail_url,owner.screenname,created_time`,
          { headers: { Accept: "application/json" } },
        )
        const dj = await dm.json().catch(() => null)
        const list = Array.isArray(dj?.list) ? dj.list : []
        const dmItems = list
          .map((v: any) => ({
            title: v.title,
            link: v.url,
            source: v["owner.screenname"] || "Dailymotion",
            thumbnail: v.thumbnail_url,
            date: v.created_time ? new Date(v.created_time * 1000).toISOString() : undefined,
          }))
          .filter((v: any) => v.title && v.link)
          .sort((a: any, b: any) => score(b.title) - score(a.title))
        for (const v of dmItems) {
          if (items.length >= max) break
          if (score(v.title) < 1) continue
          if (!items.some((it) => it.link === v.link)) items.push(v)
        }
      } catch (_) {}
    }

    if (items.length === 0) {
      // Final fallback: show trending videos from any responsive instance
      const trendPaths = [
        (base: string) => `${base}/api/v1/trending`,
        (base: string) => `${base}/api/v1/popular`,
      ]
      const bases = [
        "https://piped.video",
        "https://piped.kavin.rocks",
        "https://yt.artemislena.eu",
        "https://yewtu.be",
        "https://inv.nadeko.net",
        "https://invidious.projectsegfau.lt",
        "https://inv.n8pjl.ca",
      ]
      for (const base of bases) {
        for (const build of trendPaths) {
          try {
            const resp = await fetch(build(base), { headers: { Accept: "application/json" } })
            const json = await resp.json().catch(() => null)
            if (!json) continue
            const arr = Array.isArray(json) ? json : json.items || json.videos || []
            const vids = arr
              .map((v: any) => {
                const link = v.url
                  ? v.url.startsWith("http")
                    ? v.url
                    : `https://www.youtube.com${v.url}`
                  : v.videoId
                    ? `https://www.youtube.com/watch?v=${v.videoId}`
                    : v.link || ""
                const thumb0 = v.thumbnail || v.thumbnailUrl || (Array.isArray(v.thumbnails) ? v.thumbnails[0]?.url : undefined) || (v.thumbnailUrls?.[0] ?? undefined)
                let vid: string | undefined = v.videoId
                if (!vid && link) {
                  try {
                    const u = new URL(link)
                    vid = u.searchParams.get("v") || u.pathname.match(/youtu\.be\/([^?&/]+)/)?.[1] || undefined
                  } catch {}
                  if (!vid) {
                    const m = link.match(/v=([^&]+)/) || link.match(/youtu\.be\/([^?&/]+)/)
                    if (m) vid = m[1]
                  }
                }
                const thumb = thumb0 || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined)
                const source = v.uploaderName || v.uploader || v.author || "YouTube"
                const date = v.uploadedDate || v.publishedText || v.uploaded || v.date || undefined
                return { title: v.title, link, source, thumbnail: thumb, date }
              })
              .filter((v: any) => v.link && v.title)

            // If possible, do a simple keyword filter; otherwise return top trending
            const qlower = q.toLowerCase()
            const filtered = vids.filter((v: any) => v.title && v.title.toLowerCase().includes(qlower))
            const pool = filtered.length > 0 ? filtered : vids
            // sort pool by simple relevance
            const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
            const score = (t?: string) => {
              if (!t) return 0
              const tl = t.toLowerCase()
              return tokens.reduce((acc, tok) => acc + (tl.includes(tok) ? 1 : 0), 0)
            }
            pool.sort((a: any, b: any) => score(b.title) - score(a.title))
            for (const v of pool) {
              if (items.length >= max) break
              if (score(v.title) < 1) continue
              if (!items.some((it) => it.link === v.link)) items.push(v)
            }
            if (items.length >= 1) {
              return NextResponse.json({ items, note: "trending_fallback" })
            }
          } catch (_) {
            // try next
          }
        }
      }
    }

    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Video search failed" }, { status: 500 })
  }
}
