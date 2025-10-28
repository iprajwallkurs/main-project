import { NextResponse } from "next/server"
import { calendarClient, tokensFromCookie } from "@/lib/google"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const tokens = tokensFromCookie(req)
  if (!tokens) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const calendar = calendarClient(tokens)
    const now = new Date().toISOString()
    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: now,
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    })
    return NextResponse.json({ items: data.items || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to list events" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const tokens = tokensFromCookie(req)
  if (!tokens) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { summary, start, end, timezone } = body || {}
    if (!summary || !start || !end) {
      return NextResponse.json({ error: "Missing summary/start/end" }, { status: 400 })
    }
    const calendar = calendarClient(tokens)
    const { data } = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        start: { dateTime: start, timeZone: timezone },
        end: { dateTime: end, timeZone: timezone },
      },
    })
    return NextResponse.json({ item: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create event" }, { status: 500 })
  }
}
