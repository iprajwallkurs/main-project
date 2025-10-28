import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const claim: string | undefined = body.claim
    const context: Array<{ title?: string; url?: string; snippet?: string }> = body.context || []
    const query: string | undefined = body.query
    if (!claim && !query) return NextResponse.json({ error: "Missing claim or query" }, { status: 400 })

    let sources = context
    if ((!sources || sources.length === 0) && query) {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/search?q=${encodeURIComponent(query)}&max=6`)
      const data = await resp.json()
      sources = data.items || []
    }
    if (!sources || sources.length === 0) return NextResponse.json({ error: "No sources available" }, { status: 400 })

    const ctx = sources
      .map((s: any, i: number) => `[#${i + 1}] ${s.title || s.url}\n${s.snippet || ""}\n${s.url || ""}`)
      .join("\n\n")

    const prompt = `Assess the following claim using the sources below. Answer with one of: TRUE, FALSE, or UNSURE, followed by a 1-2 sentence rationale. Cite with [#n] where n is the source index.\n\nClaim: ${claim || query}\n\nSources:\n${ctx}`

    if (OPENAI_API_KEY) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Return a verdict (TRUE/FALSE/UNSURE) then a short rationale with citations like [#1]." },
            { role: "user", content: prompt },
          ],
          temperature: 0,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ verdict: content, sources })
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
          max_tokens: 600,
          temperature: 0,
          system: "Return a verdict (TRUE/FALSE/UNSURE) then a short rationale with citations like [#1].",
          messages: [{ role: "user", content: prompt }],
        }),
      })
      const data = await resp.json()
      const content = data?.content?.[0]?.text || ""
      return NextResponse.json({ verdict: content, sources })
    }

    return NextResponse.json(
      { error: "No LLM configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY." },
      { status: 501 },
    )
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Fact-check failed" }, { status: 500 })
  }
}
