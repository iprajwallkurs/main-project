import { NextResponse } from "next/server"
import { z } from "zod"

const SERP_API = process.env.SERPAPI_API_KEY
const BING_API = process.env.BING_API_KEY
const TAVILY_API = process.env.TAVILY_API_KEY
const SERPER_API = process.env.SERPER_API_KEY

export async function GET(req: Request) {
  const url = new URL(req.url)
  const schema = z.object({ q: z.string().trim().min(1, "Missing q"), max: z.coerce.number().int().positive().max(20).default(10) })
  const parsed = schema.safeParse({ q: url.searchParams.get("q") || "", max: url.searchParams.get("max") || undefined })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { q, max } = parsed.data

  try {
    // Prefer free providers
    if (TAVILY_API) {
      const resp = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TAVILY_API}` },
        body: JSON.stringify({ query: q, max_results: max, search_depth: "basic" }),
      })
      const data = await resp.json()
      const items = (data.results || []).map((r: any) => ({
        title: r.title,
        link: r.url,
        snippet: r.content,
        source: "tavily",
      }))
      return NextResponse.json({ items })
    }

    if (SERPER_API) {
      const resp = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": SERPER_API },
        body: JSON.stringify({ q, num: max }),
      })
      const data = await resp.json()
      const items = (data.organic || []).slice(0, max).map((r: any) => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
        source: "serper",
      }))
      return NextResponse.json({ items })
    }

    if (SERP_API) {
      const resp = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&num=${max}&api_key=${SERP_API}`)
      const data = await resp.json()
      const items = (data.organic_results || []).map((r: any) => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
        source: "serpapi",
      }))
      return NextResponse.json({ items })
    }
    if (BING_API) {
      const resp = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(q)}&count=${max}`, {
        headers: { "Ocp-Apim-Subscription-Key": BING_API },
      })
      const data = await resp.json()
      const web = data.webPages?.value || []
      const items = web.map((r: any) => ({
        title: r.name,
        link: r.url,
        snippet: r.snippet,
        source: "bing",
      }))
      return NextResponse.json({ items })
    }
    // Free, no-key fallbacks
    // 1) Wikipedia search
    const wiki = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(
        q,
      )}`,
    )
    const wjson = await wiki.json().catch(() => ({ query: { search: [] } }))
    const witems = (wjson?.query?.search || []).slice(0, Math.ceil(max / 2)).map((s: any) => ({
      title: s.title,
      link: `https://en.wikipedia.org/wiki/${encodeURIComponent(s.title.replace(/\s/g, "_"))}`,
      snippet: s.snippet?.replace(/<[^>]+>/g, " ") || "",
      source: "wikipedia",
    }))

    // 2) Hacker News Algolia search
    const hn = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=${Math.max(
        5,
        Math.ceil(max / 2),
      )}`,
    )
    const hjson = await hn.json().catch(() => ({ hits: [] }))
    const hitems = (hjson?.hits || []).slice(0, Math.ceil(max / 2)).map((h: any) => ({
      title: h.title,
      link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      snippet: h._highlightResult?.title?.value?.replace(/<[^>]+>/g, " ") || "",
      source: "hackernews",
    }))

    const items = [...witems, ...hitems].slice(0, max)
    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Search failed" }, { status: 500 })
  }
}
