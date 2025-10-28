"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mic,
  Play,
  Pause,
  Headphones,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function VoiceGenerationSection() {
  const [title, setTitle] = useState("")
  const [script, setScript] = useState(
    "Welcome to this week's tech roundup! Today we're diving into the latest developments in artificial intelligence, including breakthrough announcements from major tech companies and emerging trends that are shaping the future of technology. Let's start with the most significant news from this week...",
  )
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  const [accent, setAccent] = useState("en-US")
  const [playing, setPlaying] = useState(false)

  const handleGenerate = async () => {
    if (!script.trim()) return
    setLoading(true)
    setAudioUrl("")
    try {
      const resp = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script }),
      })
      if (resp.ok) {
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      } else {
        // Browser TTS fallback
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utter = new SpeechSynthesisUtterance(script)
          utter.lang = accent
          utter.rate = 1.0
          utter.pitch = pitch
          utter.volume = volume
          window.speechSynthesis.speak(utter)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePlayback = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  const playAudio = () => {
    const el = audioRef.current
    if (el) el.play()
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try { window.speechSynthesis.resume() } catch {}
    }
    setPlaying(true)
  }

  const pauseAudio = () => {
    const el = audioRef.current
    if (el) el.pause()
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try { window.speechSynthesis.pause() } catch {}
    }
    setPlaying(false)
  }

  // Sync playing state with audio element events
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)
    el.addEventListener("ended", onEnded)
    return () => {
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
      el.removeEventListener("ended", onEnded)
    }
  }, [audioRef.current])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Audio & Voice Generation</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl">
              <Mic className="h-4 w-4 mr-2" />
              Generate Audio
            </Button>
          </div>
        </div>
      </header>

      {/* Minimal Studio */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Input */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="script-title">Podcast Title</Label>
                  <Input id="script-title" placeholder="e.g., Weekly Tech Roundup - Episode 42" className="rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="script-content">Script Content</Label>
                  <Textarea
                    id="script-content"
                    placeholder="Enter your podcast script here. The AI will convert this text into natural-sounding speech..."
                    className="rounded-xl min-h-[200px]"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 rounded-xl" onClick={handleGenerate} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    {loading ? "Generating..." : "Generate Preview"}
                  </Button>
                  <Button
                    className={`rounded-xl ${playing ? "bg-green-600 text-white hover:bg-green-700" : "bg-transparent"}`}
                    variant={playing ? undefined : "outline"}
                    onClick={playAudio}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    className={`rounded-xl ${!playing ? "bg-red-600 text-white hover:bg-red-700" : "bg-transparent"}`}
                    variant={!playing ? undefined : "outline"}
                    onClick={pauseAudio}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pitch: {pitch.toFixed(1)}</Label>
                    <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label>Volume: {Math.round(volume * 100)}%</Label>
                    <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label>Accent</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" value={accent} onChange={(e) => setAccent(e.target.value)}>
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="en-IN">English (India)</option>
                      <option value="en-AU">English (Australia)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Preview */}
            <Card className="rounded-2xl border-border/40 h-fit">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                  {audioUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{title || "Generated Preview"}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full" onClick={togglePlayback}>
                            <Play className="h-4 w-4" /> / <Pause className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <audio ref={audioRef} src={audioUrl} controls className="w-full" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center mb-2">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
