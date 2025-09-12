import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Mic,
  Play,
  Pause,
  Download,
  Settings,
  Plus,
  Volume2,
  AudioWaveform as Waveform,
  Clock,
  User,
  Zap,
  FileAudio,
  BarChart3,
  Headphones,
  Upload,
  Trash2,
  Copy,
  RefreshCw,
} from "lucide-react"

export function VoiceGenerationSection() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Audio & Voice Generation</h1>
            <p className="text-muted-foreground">Create high-quality podcasts and audio content with AI</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Upload Script
            </Button>
            <Button size="sm" className="rounded-xl">
              <Mic className="h-4 w-4 mr-2" />
              Generate Audio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Voice Generation Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Text Input & Configuration */}
            <Card className="lg:col-span-2 rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Generation Studio
                </CardTitle>
                <CardDescription>Convert text to high-quality audio with AI voices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="script-title">Podcast Title</Label>
                  <Input
                    id="script-title"
                    placeholder="e.g., Weekly Tech Roundup - Episode 42"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="script-content">Script Content</Label>
                  <Textarea
                    id="script-content"
                    placeholder="Enter your podcast script here. The AI will convert this text into natural-sounding speech..."
                    className="rounded-xl min-h-[200px]"
                    defaultValue="Welcome to this week's tech roundup! Today we're diving into the latest developments in artificial intelligence, including breakthrough announcements from major tech companies and emerging trends that are shaping the future of technology. Let's start with the most significant news from this week..."
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Characters: 347 / 10,000</span>
                    <span>Estimated duration: ~2.5 minutes</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Voice Model</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option>Sarah - Professional Female</option>
                      <option>David - Professional Male</option>
                      <option>Emma - Conversational Female</option>
                      <option>James - Authoritative Male</option>
                      <option>Alex - Neutral Voice</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Speaking Speed</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option>Slow (0.8x)</option>
                      <option>Normal (1.0x)</option>
                      <option>Fast (1.2x)</option>
                      <option>Very Fast (1.5x)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Add Background Music</Label>
                      <p className="text-xs text-muted-foreground">Subtle ambient music for podcasts</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-pause Detection</Label>
                      <p className="text-xs text-muted-foreground">Natural pauses at punctuation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Emotion Enhancement</Label>
                      <p className="text-xs text-muted-foreground">AI-powered emotional expression</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 rounded-xl">
                    <Play className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                  <Button variant="outline" className="rounded-xl bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voice Preview & Controls */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Audio Preview
                </CardTitle>
                <CardDescription>Listen to generated audio and adjust settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Audio Player */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Weekly Tech Roundup</span>
                      <span>2:34 / 2:34</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-full">
                        <Pause className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Voice Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Volume</Label>
                      <span className="text-xs text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pitch</Label>
                      <span className="text-xs text-muted-foreground">Normal</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Emphasis</Label>
                      <span className="text-xs text-muted-foreground">Medium</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quality Metrics</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Clarity</p>
                      <p className="font-bold">94%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Naturalness</p>
                      <p className="font-bold">91%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Emotion</p>
                      <p className="font-bold">87%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-muted-foreground">Pace</p>
                      <p className="font-bold">92%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TTS Engines & Generated Audio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Supported TTS Engines */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      TTS Engines
                    </CardTitle>
                    <CardDescription>Manage text-to-speech providers and voice models</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "ElevenLabs",
                    status: "active",
                    voices: 47,
                    quality: "Premium",
                    usage: "2.3k minutes",
                    limit: "10k minutes",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    name: "OpenAI TTS",
                    status: "active",
                    voices: 6,
                    quality: "High",
                    usage: "1.8k minutes",
                    limit: "5k minutes",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    name: "Google Cloud TTS",
                    status: "configured",
                    voices: 220,
                    quality: "Standard",
                    usage: "890 minutes",
                    limit: "Unlimited",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    name: "Amazon Polly",
                    status: "inactive",
                    voices: 60,
                    quality: "Standard",
                    usage: "0 minutes",
                    limit: "1M characters",
                    color: "from-purple-500 to-pink-600",
                  },
                ].map((engine, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg bg-gradient-to-br ${engine.color} flex items-center justify-center`}
                        >
                          <Volume2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{engine.name}</h4>
                          <p className="text-xs text-muted-foreground">{engine.voices} voices available</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={engine.status === "active" ? "default" : "secondary"} className="text-xs">
                          {engine.status === "active" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                          )}
                          {engine.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Quality:</span>
                        <span className="font-medium text-foreground">{engine.quality}</span>
                      </div>
                      <div>
                        <span className="block">Usage:</span>
                        <span className="font-medium text-foreground">{engine.usage}</span>
                      </div>
                    </div>

                    {engine.status === "active" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Monthly Usage</span>
                          <span>
                            {engine.usage} / {engine.limit}
                          </span>
                        </div>
                        <Progress
                          value={
                            engine.limit === "Unlimited"
                              ? 15
                              : (Number.parseFloat(engine.usage) / Number.parseFloat(engine.limit)) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Generated Audio */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileAudio className="h-5 w-5" />
                      Generated Audio
                    </CardTitle>
                    <CardDescription>Recent podcast episodes and audio files</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Weekly Tech Roundup - Episode 42",
                    duration: "15:34",
                    size: "14.2 MB",
                    voice: "Sarah",
                    created: "2 hours ago",
                    status: "completed",
                  },
                  {
                    title: "AI News Summary - December 2024",
                    duration: "8:12",
                    size: "7.8 MB",
                    voice: "David",
                    created: "1 day ago",
                    status: "completed",
                  },
                  {
                    title: "Industry Insights Podcast",
                    duration: "22:45",
                    size: "20.1 MB",
                    voice: "Emma",
                    created: "2 days ago",
                    status: "completed",
                  },
                  {
                    title: "Product Launch Announcement",
                    duration: "5:23",
                    size: "4.9 MB",
                    voice: "James",
                    created: "3 days ago",
                    status: "processing",
                  },
                ].map((audio, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Waveform className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-pretty leading-relaxed">{audio.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{audio.voice}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{audio.created}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={audio.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {audio.status === "processing" && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1" />
                        )}
                        {audio.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                      <div>
                        <span className="block">Duration:</span>
                        <span className="font-medium text-foreground">{audio.duration}</span>
                      </div>
                      <div>
                        <span className="block">File Size:</span>
                        <span className="font-medium text-foreground">{audio.size}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 rounded-lg bg-transparent">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-lg bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Voice Analytics */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Voice Generation Analytics
              </CardTitle>
              <CardDescription>Performance metrics and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    metric: "Total Audio Generated",
                    value: "47.2 hours",
                    change: "+23%",
                    description: "This month",
                  },
                  {
                    metric: "Average Quality Score",
                    value: "92.4%",
                    change: "+5%",
                    description: "Across all engines",
                  },
                  {
                    metric: "Processing Speed",
                    value: "3.2x realtime",
                    change: "+12%",
                    description: "Average generation speed",
                  },
                  {
                    metric: "Cost Efficiency",
                    value: "$0.08/minute",
                    change: "-15%",
                    description: "Average cost per minute",
                  },
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{stat.metric}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
