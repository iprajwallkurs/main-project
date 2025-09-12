import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, BarChart3, Clock, TrendingUp, Users, Mic, Search, Calendar, ArrowRight } from "lucide-react"

export function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Welcome back</h1>
            <p className="text-muted-foreground">Manage your AI-powered content curation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Play className="h-4 w-4 mr-2" />
              Generate Podcast
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Articles Curated</p>
                    <p className="text-3xl font-bold">1,247</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">+12%</span>
                  <span className="text-muted-foreground ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Podcasts Generated</p>
                    <p className="text-3xl font-bold">89</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">+8%</span>
                  <span className="text-muted-foreground ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Sources</p>
                    <p className="text-3xl font-bold">24</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-muted-foreground">Monitoring feeds</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                    <p className="text-3xl font-bold">156</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-muted-foreground">Generated this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Curated Articles */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Articles</CardTitle>
                    <CardDescription>Latest curated content from your sources</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "The Future of AI in Content Creation",
                    source: "TechCrunch",
                    time: "2 hours ago",
                    category: "AI",
                  },
                  {
                    title: "Podcast Industry Growth Trends 2024",
                    source: "Podcast Insights",
                    time: "4 hours ago",
                    category: "Industry",
                  },
                  {
                    title: "Voice Technology Breakthrough",
                    source: "MIT Technology Review",
                    time: "6 hours ago",
                    category: "Technology",
                  },
                ].map((article, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-pretty leading-relaxed">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{article.source}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{article.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Scheduled Generation */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Scheduled Generation</CardTitle>
                    <CardDescription>Upcoming podcast and content generation</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Weekly Tech Roundup Podcast",
                    time: "Today, 3:00 PM",
                    duration: "15 min",
                    status: "ready",
                  },
                  {
                    title: "AI News Summary",
                    time: "Tomorrow, 9:00 AM",
                    duration: "8 min",
                    status: "pending",
                  },
                  {
                    title: "Industry Insights Podcast",
                    time: "Friday, 2:00 PM",
                    duration: "20 min",
                    status: "scheduled",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{item.duration}</span>
                      </div>
                    </div>
                    <Badge variant={item.status === "ready" ? "default" : "secondary"} className="text-xs capitalize">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Add New Source",
                    description: "Connect social media or RSS feeds",
                    icon: Plus,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Generate Podcast",
                    description: "Create audio content from articles",
                    icon: Mic,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "View Insights",
                    description: "Analyze content performance",
                    icon: BarChart3,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Setup Integration",
                    description: "Connect Slack or other tools",
                    icon: Users,
                    color: "from-orange-500 to-red-500",
                  },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-6 rounded-2xl border-border/40 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] bg-transparent"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground text-pretty">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
