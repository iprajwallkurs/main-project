import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  const payload = {
    deployed: true,
    marker: 'deploy-check-2025-10-30T00:00:00Z',
    note: 'This response is SSR from /deploy-check and proves the latest main was deployed.',
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
