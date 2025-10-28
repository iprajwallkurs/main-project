import { google } from "googleapis"
import type { NextRequest } from "next/server"

export type Tokens = {
  access_token?: string
  refresh_token?: string
  scope?: string
  token_type?: string
  expiry_date?: number
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string

export function getOAuthClient() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error("Missing Google OAuth env vars")
  }
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export function getAuthUrl() {
  const oauth2Client = getOAuthClient()
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
  ]
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  })
}

export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = getOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens as Tokens
}

export function tokensFromCookie(req: NextRequest): Tokens | null {
  const cookie = req.cookies.get("gcal_tokens")?.value
  if (!cookie) return null
  try {
    return JSON.parse(cookie)
  } catch {
    return null
  }
}

export function tokensToCookie(tokens: Tokens): string {
  return JSON.stringify(tokens)
}

export function calendarClient(tokens: Tokens) {
  const oauth2Client = getOAuthClient()
  oauth2Client.setCredentials(tokens)
  return google.calendar({ version: "v3", auth: oauth2Client })
}
