import { NextResponse } from "next/server"

// Optional Reddit OAuth (script app). If the following env vars are set
// REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD
// then the server will use the OAuth password grant to get an access token
// and call the OAuth endpoints (oauth.reddit.com). This is more reliable
// than scraping the public JSON endpoint and avoids 403 blocks.

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET
const REDDIT_USERNAME = process.env.REDDIT_USERNAME
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD

// Marker used in `app/layout.tsx`. If you set DEPLOYED_BUILD in your
// environment (for CI), it will be used here; otherwise a fallback is used.
const DEPLOYED_BUILD = process.env.DEPLOYED_BUILD || "2025-10-30T00:00:00Z"

function jsonWithBuild(body: any, init?: { status?: number; headers?: Record<string, string> }) {
  const status = init?.status ?? 200
  const headers = { ...(init?.headers || {}), "X-Deployed-Build": DEPLOYED_BUILD }
  return NextResponse.json(body, { status, headers })
}

let _redditToken: { token: string; expiresAt: number } | null = null

async function getRedditToken(): Promise<string | null> {
  if (!_redditToken) {
    // no token cached
  } else if (Date.now() < _redditToken.expiresAt - 1000) {
    return _redditToken.token
  }
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
    return null
  }

  const basic = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64")
  try {
    const resp = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "nexa/1.0 (by /u/your-reddit-username)",
      },
      body: `grant_type=password&username=${encodeURIComponent(REDDIT_USERNAME)}&password=${encodeURIComponent(REDDIT_PASSWORD)}`,
    })
    if (!resp.ok) return null
    const data = await resp.json().catch(() => null)
    if (!data?.access_token) return null
    const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 3600
    _redditToken = { token: data.access_token, expiresAt: Date.now() + expiresIn * 1000 }
    return _redditToken.token
  } catch (err) {
    return null
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim()
  const max = Math.min(parseInt(url.searchParams.get("max") || "9", 10), 30)
  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") || "1", 10) || 1, 1), 30)
  if (!q) return jsonWithBuild({ error: "Missing q" }, { status: 400 })

  try {
    const limit = Math.max(max, 25)

    // Prefer OAuth-backed Reddit API if credentials are available
    let resp: Response | null = null
    const token = await getRedditToken()
    if (token) {
      try {
        resp = await fetch(`https://oauth.reddit.com/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=new`, {
          headers: { Authorization: `Bearer ${token}`, "User-Agent": "nexa/1.0 (by /u/your-reddit-username)" },
        })
      } catch (e) {
        resp = null
      }
    }

    // Fallback to public JSON endpoint when OAuth not configured or failed.
    // Wrap the fetch in a try/catch so transient network errors don't bubble
    // up and cause a 500 — instead return a safe empty result with a note.
    if (!resp) {
      const base = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=${limit}&sort=new`
      try {
        resp = await fetch(base, { headers: { "User-Agent": "Mozilla/5.0" } })
      } catch (err) {
        return NextResponse.json(
          { items: [], note: `Network error contacting Reddit. Results unavailable.` },
          { status: 200 },
        )
      }
    }

    // If Reddit returns a non-OK status or non-JSON body, handle gracefully
    const contentType = resp.headers.get("content-type") || ""
    const text = await resp.text()
    if (!resp.ok) {
      // Reddit blocked or returned an error page (HTML). Return an empty result instead
      return jsonWithBuild(
        { items: [], note: `Reddit responded with status ${resp.status}. Results unavailable.` },
        { status: 200 },
      )
    }
    if (!contentType.includes("application/json")) {
      // Non-JSON response (likely an HTML block page). Return empty results so UI stays stable.
      return jsonWithBuild(
        { items: [], note: `Reddit returned non-JSON response. Results unavailable.` },
        { status: 200 },
      )
    }

    let data: any
    try {
      data = JSON.parse(text)
    } catch (err: any) {
      return jsonWithBuild(
        { items: [], note: `Failed to parse Reddit JSON. Results unavailable.` },
        { status: 200 },
      )
    }
    const now = Math.floor(Date.now() / 1000)
    const cutoff = now - 60 * 60 * 24 * days
    const all = (data?.data?.children || [])
      .map((c: any) => c?.data)
      .filter(Boolean)
      // Only last 24 hours
    const filtered = all.filter((p: any) => typeof p?.created_utc === "number" && p.created_utc >= cutoff)
    const toUse = filtered.length > 0 ? filtered : all
    const items = toUse
      .map((p: any) => {
        const previewSrc = p?.preview?.images?.[0]?.source?.url
        const cleanPreview = typeof previewSrc === "string" ? previewSrc.replace(/&amp;/g, "&") : undefined
        const thumb = cleanPreview && /^https?:\/\//.test(cleanPreview)
          ? cleanPreview
          : (p.thumbnail && /^https?:\/\//.test(p.thumbnail) ? p.thumbnail : undefined)
        return {
          title: p.title,
          link: `https://www.reddit.com${p.permalink}`,
          thumbnail: thumb,
          source: p.subreddit_name_prefixed,
        }
      })
      .slice(0, max)
    return jsonWithBuild({ items })
  } catch (e: any) {
    // Log for observability, but return a safe 200 with an explanatory note
    // so the frontend doesn't receive a 5xx and can render a friendly message.
    try {
      // eslint-disable-next-line no-console
      console.error("/api/reddit/search error:", e)
    } catch (_) {}
    return jsonWithBuild(
      { items: [], note: `Reddit search failed: ${e?.message || "unknown error"}` },
      { status: 200 },
    )
  }
}
