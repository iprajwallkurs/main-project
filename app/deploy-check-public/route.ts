export async function GET() {
  const marker = `deploy-check-public-${new Date().toISOString()}`
  const body = {
    deployed: true,
    marker,
    timestamp: new Date().toISOString(),
    note: "public verification route — no auth required"
  }

  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  })
}
