import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

export function Dashboard() {
  const [articles, setArticles] = useState<Array<{ title: string; link: string; source?: string; thumbnail?: string }>>([])
  const [news, setNews] = useState<Array<{ title: string; link: string }>>([])
  const [topic, setTopic] = useState("technology")
  const [yt, setYt] = useState<Array<{ title: string; link: string; thumbnail?: string; source?: string }>>([])
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState<1 | 7>(7)
  const [q, setQ] = useState("")
  const [ans, setAns] = useState("")
  const [sources, setSources] = useState<Array<{ title?: string; link: string }>>([])
  const [voiceText, setVoiceText] = useState("Quick intro about latest tech news")
  const [audioUrl, setAudioUrl] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const loadFor = async (t: string) => {
    setLoading(true)
    try {
      const [rY, rR, rH] = await Promise.all([
        fetch(`/api/videos/search?q=${encodeURIComponent(t)}&max=6`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`/api/reddit/search?q=${encodeURIComponent(t)}&max=6&days=${days}`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`/api/hn/search?q=${encodeURIComponent(t)}&max=6&days=${days}`).then((r) => r.json()).catch(() => ({ items: [] })),
      ])
      let ytItems = Array.isArray(rY.items) ? rY.items : []
      let redditItems = Array.isArray(rR.items) ? rR.items : []
      let hnItems = Array.isArray(rH.items) ? rH.items : []

      // Retry with a wider window if both are empty
      if (redditItems.length === 0 && hnItems.length === 0) {
        const [rR2, rH2] = await Promise.all([
          fetch(`/api/reddit/search?q=${encodeURIComponent(t)}&max=6&days=30`).then((r) => r.json()).catch(() => ({ items: [] })),
          fetch(`/api/hn/search?q=${encodeURIComponent(t)}&max=6&days=30`).then((r) => r.json()).catch(() => ({ items: [] })),
        ])
        redditItems = Array.isArray(rR2.items) ? rR2.items : redditItems
        hnItems = Array.isArray(rH2.items) ? rH2.items : hnItems
      }

      setYt(ytItems)
      setArticles(redditItems)
      setNews(hnItems)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFor(topic)
  }, [])

  const askCohost = async () => {
    if (!q.trim()) return
    setLoading(true)
    setAns("")
    setSources([])
    try {
      const resp = await fetch(`/api/cohost/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, max: 6 }),
      })
      const data = await resp.json()
      setAns(data.answer || "")
      setSources(Array.isArray(data.sources) ? data.sources : [])
    } finally {
      setLoading(false)
    }
  }

  const generateVoice = async () => {
    if (!voiceText.trim()) return
    setLoading(true)
    setAudioUrl("")
    try {
      const resp = await fetch(`/api/voice/speak`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: voiceText }) })
      if (resp.ok) {
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center justify-between px-8 glass rounded-xl mx-4 my-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Welcome back</h1>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full border border-border/50 p-0.5">
              <button
                className={`px-3 py-1 text-sm rounded-full ${days === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setDays(1)}
                disabled={loading}
                aria-pressed={days === 1}
              >Today</button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${days === 7 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                onClick={() => setDays(7)}
                disabled={loading}
                aria-pressed={days === 7}
              >Week</button>
            </div>
            <Button size="sm" className="rounded-full" onClick={() => loadFor(topic)} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Row 1: three tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Topic */}
            <Card className="rounded-2xl border-border/40 glass hover-lift min-h-[260px]">
              <CardHeader>
                <CardTitle className="text-xl">Quick Topic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input className="rounded-full" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., technology, ai, iphone reviews" />
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400" onClick={() => loadFor(topic)} disabled={loading}>{loading ? "Loading..." : "Go"}</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">YouTube</h3>
                  <div className="space-y-2">
                    {yt.slice(0, 5).map((v, i) => (
                      <a key={i} href={v.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/30">
                        {v.thumbnail && (
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <p className="text-xs font-medium line-clamp-1">{v.title}</p>
                      </a>
                    ))}
                    {yt.length === 0 && <p className="text-xs text-muted-foreground">No results.</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Cohost */}
            <Card className="rounded-2xl border-border/40 glass hover-lift min-h-[260px]">
              <CardHeader>
                <CardTitle className="text-xl">AI Cohost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input className="rounded-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question (e.g., What's new in AI?)" />
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400" onClick={askCohost} disabled={loading}>{loading ? "Thinking..." : "Ask"}</Button>
                </div>
                {ans && <div className="p-3 rounded-lg bg-muted/30 whitespace-pre-wrap text-sm max-h-40 overflow-auto">{ans}</div>}
                {sources.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs max-h-24 overflow-auto">
                    {sources.map((s, i) => (
                      <li key={i}><a className="underline" target="_blank" rel="noreferrer" href={s.link}>{s.title || s.link}</a></li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Quick Voice */}
            <Card className="rounded-2xl border-border/40 glass hover-lift min-h-[260px]">
              <CardHeader>
                <CardTitle className="text-xl">Quick Voice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea value={voiceText} onChange={(e) => setVoiceText(e.target.value)} placeholder="Enter text to generate a short audio preview" />
                <div className="flex gap-2">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400" onClick={generateVoice} disabled={loading}>{loading ? "Generating..." : "Generate"}</Button>
                  {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="w-full" />}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: two tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/40 glass hover-lift min-h-[260px]">
              <CardHeader>
                <CardTitle className="text-xl">Trending Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {articles.length > 0 ? (
                  <div className="space-y-2">
                    {articles.map((a, i) => (
                      <a key={i} href={a.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/30">
                        {a.thumbnail && (
                          <img
                            src={a.thumbnail}
                            alt={a.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.source || new URL(a.link).hostname}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No articles loaded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 glass hover-lift min-h-[260px]">
              <CardHeader>
                <CardTitle className="text-xl">Trending News</CardTitle>
              </CardHeader>
              <CardContent>
                {news.length > 0 ? (
                  <div className="space-y-2">
                    {news.map((n, i) => (
                      <a key={i} href={n.link} target="_blank" rel="noreferrer" className="block p-2 rounded-lg border border-border/40 hover:bg-muted/30">
                        <p className="text-sm font-medium line-clamp-1">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new URL(n.link).hostname}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No news loaded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
