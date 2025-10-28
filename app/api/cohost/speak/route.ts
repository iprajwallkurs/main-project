import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SERP_API = process.env.SERPAPI_API_KEY
const BING_API = process.env.BING_API_KEY
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY
const ELEVEN_VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"

type Item = { title?: string; link: string; snippet?: string }

async function webSearch(q: string, max = 6): Promise<Item[]> {
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

async function cohostAnswer(question: string, items: Item[]) {
  const context = items
    .map((it, i) => `[#${i + 1}] ${it.title || it.link}\n${it.snippet || ""}\n${it.link}`)
    .join("\n\n")
  const prompt = `You are a concise, friendly podcast co-host. The human asked: "${question}"\n\nUse the search results below to respond conversationally in 4-7 sentences.\n- Be factual and avoid speculation.\n- Include inline citations like [#1] where the fact appears.\n- If sources disagree, briefly note it.\n- End with a short suggestion question to keep the conversation going.\n\nResults:\n${context}`

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
    return data.choices?.[0]?.message?.content || ""
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
    return data?.content?.[0]?.text || ""
  }

  throw new Error("No LLM configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.")
}

async function tts(text: string) {
  if (!ELEVEN_KEY) throw new Error("No TTS configured. Set ELEVENLABS_API_KEY.")
  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
    }),
  })
  if (!resp.ok) throw new Error(`TTS failed: ${resp.status}`)
  const audio = await resp.arrayBuffer()
  return Buffer.from(audio)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const question: string | undefined = body.question
    const max = Math.min(parseInt(String(body.max || 6), 10), 10)
    if (!question || !question.trim()) return NextResponse.json({ error: "Missing question" }, { status: 400 })

    const items = await webSearch(question, max)
    const answer = await cohostAnswer(question, items)
    const audio = await tts(answer)

    // Return answer and audio as base64 for convenience
    const base64 = audio.toString("base64")
    return NextResponse.json({ answer, audioBase64: base64, mime: "audio/mpeg", sources: items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Cohost speak failed" }, { status: 500 })
  }
}
