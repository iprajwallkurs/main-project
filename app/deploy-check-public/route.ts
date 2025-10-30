export async function GET() {
  const marker = `deploy-check-public-${new Date().toISOString()}`
  const body = {
    deployed: true,
    marker,
    timestamp: new Date().toISOString(),
    note: "public verification route — no auth required",
  }
  const DEPLOYED_BUILD = process.env.DEPLOYED_BUILD || "2025-10-30T00:00:00Z"
  const headers = new Headers({ "Content-Type": "application/json" })
  headers.set("X-Deployed-Build", DEPLOYED_BUILD)
  return new Response(JSON.stringify(body), { status: 200, headers })
}
