import { NextResponse } from "next/server"

const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY
const ELEVEN_VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" // Rachel default
const PLAYHT_KEY = process.env.PLAYHT_API_KEY
const PLAYHT_USER = process.env.PLAYHT_USER_ID

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing text" }, { status: 400 })

    // ElevenLabs REST (non-streaming) fallback
    if (ELEVEN_KEY) {
      const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
        }),
      })
      const audio = await resp.arrayBuffer()
      return new Response(Buffer.from(audio), { headers: { "Content-Type": "audio/mpeg" } })
    }

    // PlayHT REST fallback
    if (PLAYHT_KEY && PLAYHT_USER) {
      const resp = await fetch("https://api.play.ht/api/v2/tts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PLAYHT_KEY}`,
          "X-User-Id": PLAYHT_USER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice: "Sally",
          output_format: "mp3",
          text,
        }),
      })
      if (!resp.ok) {
        const err = await resp.text()
        return NextResponse.json({ error: err || "TTS failed" }, { status: 500 })
      }
      // PlayHT v2 returns a job; for MVP, return 501 to signal non-streaming not implemented
      return NextResponse.json({ error: "PlayHT async flow not implemented in MVP" }, { status: 501 })
    }

    return NextResponse.json(
      { error: "No TTS provider configured. Set ELEVENLABS_API_KEY or PLAYHT_API_KEY/PLAYHT_USER_ID." },
      { status: 501 },
    )
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "TTS failed" }, { status: 500 })
  }
}
