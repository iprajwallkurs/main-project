import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const SERP_API = process.env.SERPAPI_API_KEY
const BING_API = process.env.BING_API_KEY
const TAVILY_API = process.env.TAVILY_API_KEY
const SERPER_API = process.env.SERPER_API_KEY

type Item = { title?: string; link: string; snippet?: string }

async function webSearch(q: string, max = 6): Promise<Item[]> {
  if (TAVILY_API) {
    const resp = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TAVILY_API}` },
      body: JSON.stringify({ query: q, max_results: max, search_depth: "basic" }),
    })
    const data = await resp.json()
    return (data.results || []).map((r: any) => ({ title: r.title, link: r.url, snippet: r.content }))
  }
  if (SERPER_API) {
    const resp = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": SERPER_API },
      body: JSON.stringify({ q, num: max }),
    })
    const data = await resp.json()
    return (data.organic || []).slice(0, max).map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet }))
  }
  if (SERP_API) {
    const resp = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&num=${max}&api_key=${SERP_API}`)
    const data = await resp.json()
    return (data.organic_results || []).map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet }))
  }
  if (BING_API) {
    const resp = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(q)}&count=${max}`, {
      headers: { "Ocp-Apim-Subscription-Key": BING_API },
    })
    const data = await resp.json()
    const web = data.webPages?.value || []
    return web.map((r: any) => ({ title: r.name, link: r.url, snippet: r.snippet }))
  }
  // Free fallbacks: Wikipedia + Hacker News
  const wiki = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(q)}`,
  )
  const wjson = await wiki.json().catch(() => ({ query: { search: [] } }))
  const witems = (wjson?.query?.search || []).slice(0, Math.ceil(max / 2)).map((s: any) => ({
    title: s.title,
    link: `https://en.wikipedia.org/wiki/${encodeURIComponent(s.title.replace(/\s/g, "_"))}`,
    snippet: s.snippet?.replace(/<[^>]+>/g, " ") || "",
  }))

  const hn = await fetch(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=${Math.max(5, Math.ceil(max / 2))}`,
  )
  const hjson = await hn.json().catch(() => ({ hits: [] }))
  const hitems = (hjson?.hits || []).slice(0, Math.ceil(max / 2)).map((h: any) => ({
    title: h.title,
    link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    snippet: h._highlightResult?.title?.value?.replace(/<[^>]+>/g, " ") || "",
  }))
  return [...witems, ...hitems].slice(0, max)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const question: string | undefined = body.question
    const max = Math.min(parseInt(String(body.max || 6), 10), 10)
    if (!question || !question.trim()) return NextResponse.json({ error: "Missing question" }, { status: 400 })

    // 1) Search
    const items = await webSearch(question, max)

    // 2) Build context
    const context = items
      .map((it, i) => `[#${i + 1}] ${it.title || it.link}\n${it.snippet || ""}\n${it.link}`)
      .join("\n\n")

    const prompt = `You are a concise, friendly podcast co-host. The human asked: "${question}"\n\nUse the search results below to respond conversationally in 4-7 sentences.\n- Be factual and avoid speculation.\n- Include inline citations like [#1] where the fact appears.\n- If sources disagree, briefly note it.\n- End with a short suggestion question to keep the conversation going.\n\nResults:\n${context}`

    // 3) LLM response
    if (OPENROUTER_API_KEY) {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            { role: "system", content: "Cite facts precisely with [#n] where n is source index; friendly, concise tone." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ answer: content, sources: items })
    }
    if (OPENAI_API_KEY) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Cite facts precisely with [#n] where n is source index; friendly, concise tone." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ answer: content, sources: items })
    }

    if (ANTHROPIC_API_KEY) {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          temperature: 0.4,
          system: "Cite facts precisely with [#n] where n is source index; friendly, concise tone.",
          messages: [{ role: "user", content: prompt }],
        }),
      })
      const data = await resp.json()
      const content = data?.content?.[0]?.text || ""
      return NextResponse.json({ answer: content, sources: items })
    }

    // Ollama local
    try {
      const resp = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: `System: Cite with [#n].\nUser: ${prompt}`,
          stream: false,
        }),
      })
      const data = await resp.json()
      if (data?.response) return NextResponse.json({ answer: data.response, sources: items })
    } catch (_) {}

    // Extractive fallback: stitched answer with links
    const stitched = items
      .map((it, i) => {
        const host = (() => {
          try {
            return new URL(it.link).hostname
          } catch {
            return ""
          }
        })()
        const snip = (it.snippet || "").replace(/\s+/g, " ").trim()
        return `${snip} [#${i + 1} - ${host}]`
      })
      .filter(Boolean)
      .join(" \n\n")
    const answer =
      stitched ||
      `I couldn't compose a detailed answer, but here are sources you can review: ${items
        .map((it, i) => `[#${i + 1}] ${it.title || it.link} (${it.link})`)
        .join("; ")}`
    return NextResponse.json({ answer, sources: items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Cohost response failed" }, { status: 500 })
  }
}
