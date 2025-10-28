# Providers Setup

Configure environment variables in a local `.env` file:

## Search
Use one of:
- SERPAPI_API_KEY=...
- BING_API_KEY=...

## LLM
Use one of:
- OPENAI_API_KEY=...
- ANTHROPIC_API_KEY=...

## Text-to-Speech
Use one of:
- ELEVENLABS_API_KEY=...
- PLAYHT_API_KEY=...
- PLAYHT_USER_ID=...

Optional:
- REDIS_URL=... (if adding caching later)

Endpoints added in this project:
- GET /api/search?q=...&max=8 — Web search (SerpAPI/Bing)
- POST /api/fetch — Basic HTML fetch & text extraction
- POST /api/insights/outline — Generate podcast outline (OpenAI/Anthropic)
- POST /api/voice/speak — TTS preview (ElevenLabs or PlayHT placeholder)

After setting env vars:
1. npm install
2. npm run dev
3. In the app UI, use Web Search, AI Insights (Outline Generator), and Voice Generation (Generate Preview).
