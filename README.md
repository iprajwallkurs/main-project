# NEXA Platform

A Next.js app with a luxurious, tile-style dashboard, live space background, transparent headers, and free data sources (Reddit + Hacker News) for trending content. Includes AI utilities (cohost Q&A/outline), web search, and voice generation.

## Quick Start

- Prereqs
  - Node.js 18+
  - npm (or pnpm)
- Install
  - npm install
- Run (default: http://localhost:3000)
  - npm run dev
  - Or pick a port: PORT=3002 npm run dev

## Environment

- Copy `.env.example` to `.env.local` and fill in values locally.
- Secrets are not committed. `.env*` files are gitignored.
- Optional keys improve results but are not required:
  - SERPER_API_KEY, BING_API_KEY, OPENAI_API_KEY, HUGGINGFACE_API_KEY
- Google OAuth (optional for Calendar Agent):
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI

## Features

- Dashboard tiles
  - Quick Topic (fetches YouTube-like videos, Reddit, HN previews)
  - AI Cohost (ask/respond, optional speech)
  - Quick Voice (text-to-audio preview)
  - Trending Articles (Reddit, daily/weekly window)
  - Trending News (Hacker News, daily/weekly window)
- Sections
  - Web Search with summarize + history
  - Social Media (YouTube-like, Reddit, HN rows)
  - AI Insights (Q&A, outline generator)
  - Voice Generation (pitch/volume/accent + play/pause)
  - Calendar Agent (optional Google Calendar integration)
- Visuals
  - Live Starfield background and subtle gradient glow
  - Transparent headers, glass cards, rounded inputs/buttons

## API Routes (selected)

- /api/reddit/search?q=...&max=&days=
- /api/hn/search?q=...&max=&days=
- /api/search, /api/search/summarize
- /api/cohost/respond, /api/cohost/speak
- /api/voice/speak
- /api/google/auth/url, /api/google/auth/callback, /api/google/calendar/events

## Security & Privacy

- Never commit real secrets. Use `.env.local` (gitignored).
- Example variables live in `.env.example` only.
- No analytics or tracking added beyond `@vercel/analytics` (if configured).

## Troubleshooting

- See old UI after edits
  - Hard refresh (Shift+Reload)
  - Ensure you’re on the correct port shown in the terminal
- Port in use
  - lsof -nP -iTCP:3002 -sTCP:LISTEN
  - kill <PID>
- Images missing in Trending Articles
  - Some Reddit posts lack previews; UI falls back to text-only

## Customize the Background

- Edit `components/Starfield.tsx` for density, speed, and glow.
- Animation respects reduced-motion; if enabled, a static frame is drawn.

## Scripts

- npm run dev — start dev server
- npm run build — production build
- npm run start — start production server

## License

Proprietary. All rights reserved.
