"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// badge/progress removed (unused)
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"

export function AIInsightsSection() {
  const [topic, setTopic] = useState("")
  const [facts, setFacts] = useState("")
  const [outline, setOutline] = useState("")
  const [loading, setLoading] = useState(false)

  // Cohost Q&A state
  const [cohostQuestion, setCohostQuestion] = useState("")
  const [cohostAnswer, setCohostAnswer] = useState("")
  const [cohostLoading, setCohostLoading] = useState(false)
  const [cohostAudioUrl, setCohostAudioUrl] = useState<string>("")
  const [cohostSources, setCohostSources] = useState<Array<{ title?: string; link: string; snippet?: string }>>([])

  const generateOutline = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setOutline("")
    try {
      const factCards = facts
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => ({ title: line, url: line.includes("http") ? line : undefined }))
      const resp = await fetch("/api/insights/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, facts: factCards, style: "balanced" }),
      })
      const data = await resp.json()
      if (data.outline) setOutline(data.outline)
    } finally {
      setLoading(false)
    }
  }

  const askAndSpeak = async () => {
    if (!cohostQuestion.trim()) return
    setCohostLoading(true)
    setCohostAnswer("")
    setCohostAudioUrl("")
    try {
      const resp = await fetch("/api/cohost/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cohostQuestion, max: 6 }),
      })
      const data = await resp.json()
      if (data.answer) setCohostAnswer(data.answer)
      if (Array.isArray(data.sources)) setCohostSources(data.sources)
      if (data.audioBase64) {
        const binary = atob(data.audioBase64 as string)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const blob = new Blob([bytes], { type: (data.mime as string) || "audio/mpeg" })
        const url = URL.createObjectURL(blob)
        setCohostAudioUrl(url)
      }
    } finally {
      setCohostLoading(false)
    }
  }

  const askCohost = async () => {
    if (!cohostQuestion.trim()) return
    setCohostLoading(true)
    setCohostAnswer("")
    setCohostAudioUrl("")
    try {
      const resp = await fetch("/api/cohost/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cohostQuestion, max: 6 }),
      })
      const data = await resp.json()
      if (data.answer) setCohostAnswer(data.answer)
    } finally {
      setCohostLoading(false)
    }
  }

  const speakCohost = async () => {
    if (!cohostAnswer.trim()) return
    setCohostLoading(true)
    setCohostAudioUrl("")
    try {
      const resp = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cohostAnswer }),
      })
      if (resp.ok) {
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        setCohostAudioUrl(url)
      } else {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utter = new SpeechSynthesisUtterance(cohostAnswer)
          utter.rate = 1.0
          utter.pitch = 1.0
          utter.volume = 1.0
          window.speechSynthesis.speak(utter)
        }
      }
    } finally {
      setCohostLoading(false)
    }
  }
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">AI Insights Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="rounded-xl">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Cohost Q&A */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Cohost Q&A</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="e.g., What changed in AI safety this week?" value={cohostQuestion} onChange={(e) => setCohostQuestion(e.target.value)} />
                <Button onClick={askCohost} disabled={cohostLoading}>{cohostLoading ? "Thinking..." : "Ask"}</Button>
                <Button variant="outline" onClick={speakCohost} disabled={cohostLoading || !cohostAnswer.trim()}>Speak</Button>
                <Button variant="outline" onClick={askAndSpeak} disabled={cohostLoading}>Ask & Speak</Button>
              </div>
              {cohostAnswer && (
                <div className="p-4 rounded-xl bg-muted/30 whitespace-pre-wrap text-sm">{cohostAnswer}</div>
              )}
              {cohostSources && cohostSources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sources</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {cohostSources.map((s, i) => (
                      <li key={i}>
                        <a href={s.link} target="_blank" rel="noreferrer" className="underline">
                          {s.title || s.link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cohostAudioUrl && <audio src={cohostAudioUrl} controls className="w-full" />}
            </CardContent>
          </Card>

          {/* Outline Generator */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Podcast Outline Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input placeholder="e.g., AI Safety in 2025" value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fact Cards (one per line, URLs optional)</Label>
                  <Textarea placeholder="OpenAI governance changes\nhttps://example.com/report" value={facts} onChange={(e) => setFacts(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={generateOutline} disabled={loading} className="rounded-xl">
                  Generate {loading ? "..." : "Outline"}
                </Button>
                {outline && (
                  <Button variant="outline" className="rounded-xl bg-transparent" onClick={() => navigator.clipboard.writeText(outline)}>
                    Copy Outline
                  </Button>
                )}
              </div>
              {outline && (
                <div className="p-4 rounded-xl bg-muted/30 whitespace-pre-wrap text-sm">
                  {outline}
                </div>
              )}
            </CardContent>
        </Card>

          {/* Metrics removed for simpler presentation */}

          {/* Content analysis and trending topics removed */}

          {/* AI insights and custom feeds removed */}

          {/* Analytics summary removed */}
        </div>
      </div>
    </div>
  )
}
