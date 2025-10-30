import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SocialMediaSection() {
  const [videoQuery, setVideoQuery] = useState("")
  const [videos, setVideos] = useState<Array<{ title: string; link: string; thumbnail?: string; source?: string; date?: string }>>([])
  const [loadingVid, setLoadingVid] = useState(false)
  const [_videoError, setVideoError] = useState<string>("")
  
  const [reddit, setReddit] = useState<Array<{ title: string; link: string; thumbnail?: string; source?: string }>>([])
  const [_redditLoading, setRedditLoading] = useState(false)
  const [_redditError, setRedditError] = useState<string>("")
  const [hn, setHn] = useState<Array<{ title: string; link: string; thumbnail?: string; source?: string }>>([])
  const [_hnLoading, setHnLoading] = useState(false)
  const [_hnError, setHnError] = useState<string>("")

  const searchVideos = async () => {
    if (!videoQuery.trim()) return
    setLoadingVid(true)
    setVideos([])
    setVideoError("")
    
    // reddit & hn in parallel
    setReddit([])
    setRedditError("")
    setRedditLoading(true)
    setHn([])
    setHnError("")
    setHnLoading(true)
    try {
      const resp = await fetch(`/api/videos/search?q=${encodeURIComponent(videoQuery)}&max=12`)
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        setVideoError(err.error || `Search failed (status ${resp.status})`)
        return
      }
      const data = await resp.json()
      const items = Array.isArray(data.items) ? data.items : []
      setVideos(items)
      if (items.length === 0) {
        setVideoError("No videos found. Try another keyword. A no-key fallback is active; SERPER/Bing keys improve results.")
      }
    } finally {
      setLoadingVid(false)
    }
    
    try {
      const rr = await fetch(`/api/reddit/search?q=${encodeURIComponent(videoQuery)}&max=9`)
      if (!rr.ok) {
        const err = await rr.json().catch(() => ({}))
        setRedditError(err.error || `Reddit search failed (status ${rr.status})`)
      } else {
        const data = await rr.json()
        const items = Array.isArray(data.items) ? data.items : []
        setReddit(items)
        // If backend provided a note (e.g., blocked by Reddit), surface it to the user.
        if (items.length === 0) setRedditError(data.note || "No Reddit posts found for this query.")
      }
    } finally {
      setRedditLoading(false)
    }
    try {
      const rh = await fetch(`/api/hn/search?q=${encodeURIComponent(videoQuery)}&max=9`)
      if (!rh.ok) {
        const err = await rh.json().catch(() => ({}))
        setHnError(err.error || `HN search failed (status ${rh.status})`)
      } else {
        const data = await rh.json()
        const items = Array.isArray(data.items) ? data.items : []
        setHn(items)
        if (items.length === 0) setHnError(data.note || "No HN stories found for this query.")
      }
    } finally {
      setHnLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="px-8 py-6 flex flex-col items-center text-center gap-3 glass rounded-xl mx-4 my-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Social Media</h1>
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <Input
              placeholder="Search topic videos (e.g., AI safety)"
              value={videoQuery}
              onChange={(e) => setVideoQuery(e.target.value)}
              className="rounded-full w-full h-12 text-base"
            />
            <Button className="rounded-full h-12 px-5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400" onClick={searchVideos} disabled={loadingVid}>
              {loadingVid ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="rounded-2xl border-border/40 glass hover-lift">
            <CardHeader>
              <CardTitle className="text-xl">YouTube Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {videos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
                  {videos.map((v, i) => (
                    <a
                      key={i}
                      href={v.link}
                      target="_blank"
                      rel="noreferrer"
                      className="snap-start min-w-[280px] max-w-[320px] rounded-xl overflow-hidden border border-border/40 hover:bg-muted/30"
                    >
                      {v.thumbnail && (
                        <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                      )}
                      <div className="p-3">
                        <p className="text-sm font-medium line-clamp-2">{v.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{v.source || new URL(v.link).hostname}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {videos.length === 0 && (
                <p className="text-sm text-muted-foreground">No videos yet. Try a broader topic.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Reddit</CardTitle>
            </CardHeader>
            <CardContent>
              {reddit.length > 0 && (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
                  {reddit.map((r, i) => (
                    <a key={i} href={r.link} target="_blank" rel="noreferrer" className="snap-start min-w-[280px] max-w-[320px] rounded-xl overflow-hidden border border-border/40 hover:bg-muted/30">
                      {r.thumbnail && <img src={r.thumbnail} alt={r.title} className="w-full aspect-video object-cover" />}
                      <div className="p-3">
                        <p className="text-sm font-medium line-clamp-2">{r.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.source || "reddit"}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {reddit.length === 0 && (
                <p className="text-sm text-muted-foreground">{_redditError || "No Reddit posts yet. Showing row for demo consistency."}</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Hacker News</CardTitle>
            </CardHeader>
            <CardContent>
              {hn.length > 0 && (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
                  {hn.map((h, i) => (
                    <a key={i} href={h.link} target="_blank" rel="noreferrer" className="snap-start min-w-[280px] max-w-[320px] rounded-xl overflow-hidden border border-border/40 hover:bg-muted/30">
                      <div className="p-3">
                        <p className="text-sm font-medium line-clamp-2">{h.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hacker News</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {hn.length === 0 && (
                <p className="text-sm text-muted-foreground">No HN stories yet. Showing row for demo consistency.</p>
              )}
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  )
}