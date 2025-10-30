import type { Metadata } from 'next'
// Removed unused Geist font imports (clean up lint warnings)
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import Starfield from '@/components/Starfield'

export const metadata: Metadata = {
  title: 'NEXA',
  description: 'Created by team 4',
  generator: 'team 04',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* SSR-visible marker so we can verify deployments via curl */}
        <meta name="x-deployed-build" content="2025-10-30T00:00:00Z" />
      </head>
      <body className="h-full font-sans antialiased bg-background text-foreground">
        {/* Live layers */}
        <div className="live-gradient" aria-hidden="true" />
        <Starfield />
        <div className="relative min-h-dvh">
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="bg-animated absolute inset-0" />
            <div className="bg-noise absolute inset-0 opacity-30 mix-blend-soft-light" />
          </div>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}