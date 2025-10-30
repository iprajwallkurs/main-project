import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, facts, style = "balanced" } = body || {}
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 })

    const prompt = `You are a podcast co-host. Build a concise, factual outline with segments and timecodes for a discussion on "${topic}".
Style: ${style}. Use the provided Fact Cards when helpful. Include 4-6 segments max, each with 2-4 bullets. End with 3 audience questions.
Fact Cards:\n${(facts || [])
      .map((f: any, i: number) => `- [${i + 1}] ${f.title || f.claim || ""} :: ${f.url || f.source || ""}`)
      .join("\n")}`

    // Prefer OpenRouter (free-capable); then OpenAI; then Anthropic; then local Ollama; else 501
    if (OPENROUTER_API_KEY) {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            { role: "system", content: "Be precise, cite within text when you use a fact card (like [1])." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ outline: content })
    }

    if (OPENAI_API_KEY) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Be precise, cite within text when you use a fact card (like [1])." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        }),
      })
      const data = await resp.json()
      const content = data.choices?.[0]?.message?.content || ""
      return NextResponse.json({ outline: content })
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
          max_tokens: 1200,
          temperature: 0.5,
          system: "Be precise, cite within text when you use a fact card (like [1]).",
          messages: [{ role: "user", content: prompt }],
        }),
      })
      const data = await resp.json()
      const content = data?.content?.[0]?.text || ""
      return NextResponse.json({ outline: content })
    }

    // Local Ollama (fully free, runs on device)
    try {
      const resp = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: `System: Be precise, cite with [1].\nUser: ${prompt}`,
          stream: false,
        }),
      })
      const data = await resp.json()
      if (data?.response) return NextResponse.json({ outline: data.response })
    } catch {
      // ignore local Ollama errors
    }

    return NextResponse.json(
      { error: "No LLM configured. Set OPENROUTER_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or run Ollama locally." },
      { status: 501 },
    )
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Outline failed" }, { status: 500 })
  }
}
