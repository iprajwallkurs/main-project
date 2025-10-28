import { NextResponse } from "next/server"
import { getAuthUrl } from "@/lib/google"

export async function GET() {
  try {
    const url = getAuthUrl()
    return NextResponse.json({ url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to generate auth URL" }, { status: 500 })
  }
}
