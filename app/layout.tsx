import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Starfield from '@/components/Starfield'

export const metadata: Metadata = {
  title: 'Brainfog',
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