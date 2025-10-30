import type { NextRequest } from 'next/server'

export async function GET() {
  const now = new Date().toISOString()
  const payload = {
    deployed: true,
    marker: `deploy-check-${now}`,
    timestamp: now,
    note: 'This response is SSR from /deploy-check and proves the latest main was deployed.',
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
