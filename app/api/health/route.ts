const DEPLOYED_BUILD = process.env.DEPLOYED_BUILD || "2025-10-30T00:00:00Z"

export async function GET() {
  const body = { ok: true, uptime: process.uptime() }
  const headers = new Headers({ "Content-Type": "application/json" })
  headers.set("X-Deployed-Build", DEPLOYED_BUILD)
  return new Response(JSON.stringify(body), { status: 200, headers })
}
