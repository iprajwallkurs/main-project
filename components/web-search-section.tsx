"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// Removed unused UI controls and icons to reduce lint noise
// Badge, Switch, Label, CardDescription, and many icons were unused
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function WebSearchSection() {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ title: string; link: string; snippet?: string }>>([])
  const [summary, setSummary] = useState("")
  const [history, setHistory] = useState<Array<{ id: string; q: string; summary: string; when: number }>>([])

  const runSearch = async () => {
    if (!q.trim()) return
    setLoading(true)
    setResults([])
    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(q)}&max=8`)
      const data = await resp.json()
      setResults(data.items || [])
      setSummary("")
    } finally {
      setLoading(false)
    }
  }

  const runSummarize = async () => {
    if (!q.trim() && results.length === 0) return
    setLoading(true)
    setSummary("")
    try {
      const resp = await fetch(`/api/search/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, items: results, max: 6 }),
      })
      const data = await resp.json()
      if (data.summary) setSummary(data.summary)
      // Save to history
      const item = { id: String(Date.now()), q, summary: data.summary || "", when: Date.now() }
      const next = [item, ...history].slice(0, 20)
      setHistory(next)
      localStorage.setItem("web_search_history", JSON.stringify(next))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("web_search_history")
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  const restoreFromHistory = (id: string) => {
    const item = history.find((h) => h.id === id)
    if (!item) return
    setQ(item.q)
    setSummary(item.summary)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("web_search_history")
  }
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Web Search & Automation</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Live Web Search */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Live Web Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="e.g., latest AI safety news" value={q} onChange={(e) => setQ(e.target.value)} />
                <Button onClick={runSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
                <Button variant="outline" onClick={runSummarize} disabled={loading || (results.length === 0 && !q.trim())}>
                  Summarize
                </Button>
              </div>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30">
                    <a href={r.link} target="_blank" rel="noreferrer" className="font-medium text-sm underline">
                      {r.title}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{new URL(r.link).hostname}</p>
                    {r.snippet && <p className="text-xs text-muted-foreground mt-1">{r.snippet}</p>}
                  </div>
                ))}
                {!loading && results.length === 0 && <p className="text-xs text-muted-foreground">No results yet.</p>}
                {summary && (
                  <div className="p-4 rounded-lg bg-muted/30 whitespace-pre-wrap text-sm">
                    {summary}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Search History</CardTitle>
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={clearHistory}>
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => restoreFromHistory(h.id)}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium line-clamp-1">{h.q}</p>
                      <span className="text-xs text-muted-foreground">{new Date(h.when).toLocaleTimeString()}</span>
                    </div>
                    {h.summary && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{h.summary}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          


          {/* Advanced Configuration removed for simpler UX */}
        </div>
      </div>
    </div>
  )
}
