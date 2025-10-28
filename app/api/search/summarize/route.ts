import { NextResponse } from "next/server"
import { z } from "zod"

const SERP_API = process.env.SERPAPI_API_KEY
const BING_API = process.env.BING_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const TAVILY_API = process.env.TAVILY_API_KEY
const SERPER_API = process.env.SERPER_API_KEY

type Item = { title?: string; link: string; snippet?: string }

async function search(q: string, max = 6): Promise<Item[]> {
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
  throw new Error("No search provider configured. Set SERPAPI_API_KEY or BING_API_KEY.")
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      query: z.string().trim().optional(),
      items: z
        .array(z.object({ title: z.string().optional(), link: z.string().url(), snippet: z.string().optional() }))
        .optional()
        .default([]),
      max: z.coerce.number().int().positive().max(10).default(6),
    })
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const { query: q, max } = parsed.data
    let items: Item[] = parsed.data.items

    if ((!items || items.length === 0) && q) {
      items = await search(q, max)
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items to summarize" }, { status: 400 })
    }

    const context = items
      .map((it, i) => `[#${i + 1}] ${it.title || it.link}\n${it.snippet || ""}\n${it.link}`)
      .join("\n\n")

    const prompt = `You are a diligent research assistant. Given search results below, produce a concise summary (120-220 words) with numbered inline citations like [#1], [#2] matching the sources list. Emphasize facts, avoid speculation, and mention disagreements if present.\n\nResults:\n${context}`

    if (OPENROUTER_API_KEY) {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            { role: "system", content: "Cite facts precisely with [#n] where n is source index." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ summary: content, sources: items })
    }

    if (OPENAI_API_KEY) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Cite facts precisely with [#n] where n is source index." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ summary: content, sources: items })
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
          temperature: 0.3,
          system: "Cite facts precisely with [#n] where n is source index.",
          messages: [{ role: "user", content: prompt }],
        }),
      })
      const data = await resp.json()
      const content = data?.content?.[0]?.text || ""
      return NextResponse.json({ summary: content, sources: items })
    }

    // Ollama local
    try {
      const resp = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: `System: Cite facts with [#n].\nUser: ${prompt}`,
          stream: false,
        }),
      })
      const data = await resp.json()
      if (data?.response) return NextResponse.json({ summary: data.response, sources: items })
    } catch (_) {}

    // Extractive fallback (no keys): stitch snippets and provide citations
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
      .join("\n\n")

    const fallbackSummary =
      stitched ||
      `No summary available. Sources: ${items
        .map((it, i) => `[#${i + 1}] ${it.title || it.link} (${it.link})`)
        .join("; ")}`

    return NextResponse.json({ summary: fallbackSummary, sources: items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Summarization failed" }, { status: 500 })
  }
}
