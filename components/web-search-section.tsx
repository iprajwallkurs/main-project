import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Play, Pause, Settings, Plus, Trash2, Clock, CheckCircle, Bot, Code, Terminal, Zap } from "lucide-react"

export function WebSearchSection() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Web Search & Automation</h1>
            <p className="text-muted-foreground">Configure search commands and browser automation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              New Command
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Play className="h-4 w-4 mr-2" />
              Run All
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Commands */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Search Commands */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Search Commands
                    </CardTitle>
                    <CardDescription>Automated web search and data collection</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "AI News Scraper",
                    query: "latest AI developments 2024",
                    status: "running",
                    lastRun: "2 min ago",
                    results: 47,
                  },
                  {
                    name: "Tech Industry Updates",
                    query: "technology industry news trends",
                    status: "completed",
                    lastRun: "1 hour ago",
                    results: 23,
                  },
                  {
                    name: "Podcast Market Research",
                    query: "podcast industry statistics growth",
                    status: "scheduled",
                    lastRun: "Tomorrow 9:00 AM",
                    results: 0,
                  },
                ].map((command, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{command.name}</h4>
                          <Badge
                            variant={
                              command.status === "running"
                                ? "default"
                                : command.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {command.status === "running" && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                            )}
                            {command.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {command.status === "scheduled" && <Clock className="w-3 h-3 mr-1" />}
                            {command.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 font-mono bg-muted/50 px-2 py-1 rounded">
                          {command.query}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Last run: {command.lastRun}</span>
                          <span>Results: {command.results}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {command.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Create New Command */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Create Search Command
                </CardTitle>
                <CardDescription>Set up automated web search and data extraction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="command-name">Command Name</Label>
                  <Input id="command-name" placeholder="e.g., Daily Tech News" className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-query">Search Query</Label>
                  <Textarea
                    id="search-query"
                    placeholder="Enter your search terms and keywords..."
                    className="rounded-xl min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option>Every hour</option>
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-results">Max Results</Label>
                    <Input id="max-results" type="number" placeholder="50" className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable JavaScript Rendering</Label>
                      <p className="text-xs text-muted-foreground">For dynamic content and SPAs</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Follow Redirects</Label>
                      <p className="text-xs text-muted-foreground">Automatically follow URL redirects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Extract Images</Label>
                      <p className="text-xs text-muted-foreground">Download and analyze images</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button className="w-full rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Command
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Browser Automation Sessions */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Browser Automation Sessions
              </CardTitle>
              <CardDescription>Manage persistent browser sessions for authenticated content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "LinkedIn Session",
                    status: "active",
                    lastActivity: "5 min ago",
                    cookies: 24,
                    domain: "linkedin.com",
                  },
                  {
                    name: "Twitter/X Session",
                    status: "expired",
                    lastActivity: "2 days ago",
                    cookies: 18,
                    domain: "x.com",
                  },
                  {
                    name: "Reddit Session",
                    status: "active",
                    lastActivity: "1 hour ago",
                    cookies: 31,
                    domain: "reddit.com",
                  },
                ].map((session, index) => (
                  <Card key={index} className="rounded-xl border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{session.name}</h4>
                          <p className="text-xs text-muted-foreground">{session.domain}</p>
                        </div>
                        <Badge variant={session.status === "active" ? "default" : "secondary"} className="text-xs">
                          {session.status === "active" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                          )}
                          {session.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Last Activity:</span>
                          <span>{session.lastActivity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cookies:</span>
                          <span>{session.cookies}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs bg-transparent">
                          Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs bg-transparent">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Session Card */}
                <Card className="rounded-xl border-border/40 border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[160px]">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-sm mb-1">New Session</h4>
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Create a new browser automation session
                    </p>
                    <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                      Add Session
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Proxy & Network Settings */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Network Configuration
                </CardTitle>
                <CardDescription>Proxy settings and request optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Proxy Server (Optional)</Label>
                  <Input placeholder="http://proxy.example.com:8080" className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Request Timeout</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option>30 seconds</option>
                      <option>60 seconds</option>
                      <option>120 seconds</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Concurrent Requests</Label>
                    <Input type="number" placeholder="5" className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Rotate User Agents</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Respect robots.txt</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable Caching</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Processing */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Processing
                </CardTitle>
                <CardDescription>Content analysis and extraction settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Extraction Model</Label>
                  <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                    <option>GPT-4 Turbo</option>
                    <option>Claude 3.5 Sonnet</option>
                    <option>Gemini Pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Summary Length</Label>
                  <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                    <option>Brief (50-100 words)</option>
                    <option>Medium (100-200 words)</option>
                    <option>Detailed (200-300 words)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Extract Key Topics</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sentiment Analysis</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Generate Tags</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Duplicate Detection</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
