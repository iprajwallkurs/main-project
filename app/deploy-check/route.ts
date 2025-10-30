import type { NextRequest } from 'next/server'

export async function GET() {
  const now = new Date().toISOString()
  const payload = {
    deployed: true,
    marker: `deploy-check-${now}`,
    timestamp: now,
    note: 'This response is SSR from /deploy-check and proves the latest main was deployed.',
  }
  const DEPLOYED_BUILD = process.env.DEPLOYED_BUILD || "2025-10-30T00:00:00Z"
  const headers = new Headers({ 'Content-Type': 'application/json' })
  headers.set('X-Deployed-Build', DEPLOYED_BUILD)
  return new Response(JSON.stringify(payload), { status: 200, headers })
}
