import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Zap,
  Eye,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  Lightbulb,
  PieChart,
  Activity,
} from "lucide-react"

export function AIInsightsSection() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">AI Insights Dashboard</h1>
            <p className="text-muted-foreground">Advanced analytics and content intelligence</p>
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Content Analyzed",
                value: "12,847",
                change: "+23%",
                trend: "up",
                icon: Brain,
                color: "from-purple-500 to-indigo-600",
              },
              {
                title: "AI Insights Generated",
                value: "3,456",
                change: "+18%",
                trend: "up",
                icon: Lightbulb,
                color: "from-yellow-500 to-orange-500",
              },
              {
                title: "Trending Topics",
                value: "89",
                change: "+12%",
                trend: "up",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "Engagement Score",
                value: "94.2%",
                change: "-2%",
                trend: "down",
                icon: Target,
                color: "from-blue-500 to-cyan-600",
              },
            ].map((metric, index) => (
              <Card key={index} className="rounded-2xl border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                    >
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge
                      variant={metric.trend === "up" ? "default" : "secondary"}
                      className={`text-xs ${metric.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Analysis & Trending Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Performance Analysis */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Content Performance
                    </CardTitle>
                    <CardDescription>AI-powered content analysis and scoring</CardDescription>
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
                    score: 94,
                    sentiment: "Positive",
                    topics: ["AI", "Content", "Innovation"],
                    engagement: "High",
                  },
                  {
                    title: "Podcast Industry Growth Trends 2024",
                    source: "Podcast Insights",
                    score: 87,
                    sentiment: "Neutral",
                    topics: ["Podcasts", "Growth", "Industry"],
                    engagement: "Medium",
                  },
                  {
                    title: "Voice Technology Breakthrough",
                    source: "MIT Technology Review",
                    score: 91,
                    sentiment: "Positive",
                    topics: ["Voice", "Technology", "Innovation"],
                    engagement: "High",
                  },
                ].map((content, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-pretty leading-relaxed mb-1">{content.title}</h4>
                        <p className="text-xs text-muted-foreground">{content.source}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-bold">{content.score}</p>
                          <p className="text-xs text-muted-foreground">AI Score</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Performance Score</span>
                        <span className="font-medium">{content.score}/100</span>
                      </div>
                      <Progress value={content.score} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {content.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant={content.sentiment === "Positive" ? "default" : "secondary"} className="text-xs">
                          {content.sentiment}
                        </Badge>
                        <Badge variant={content.engagement === "High" ? "default" : "secondary"} className="text-xs">
                          {content.engagement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trending Topics
                    </CardTitle>
                    <CardDescription>AI-identified trending themes and keywords</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    topic: "Artificial Intelligence",
                    mentions: 1247,
                    growth: "+34%",
                    sentiment: 0.82,
                    trend: "up",
                  },
                  {
                    topic: "Machine Learning",
                    mentions: 892,
                    growth: "+28%",
                    sentiment: 0.76,
                    trend: "up",
                  },
                  {
                    topic: "Voice Technology",
                    mentions: 634,
                    growth: "+19%",
                    sentiment: 0.71,
                    trend: "up",
                  },
                  {
                    topic: "Podcast Analytics",
                    mentions: 456,
                    growth: "+15%",
                    sentiment: 0.68,
                    trend: "up",
                  },
                  {
                    topic: "Content Automation",
                    mentions: 389,
                    growth: "+12%",
                    sentiment: 0.74,
                    trend: "up",
                  },
                ].map((topic, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{topic.topic}</h4>
                      <Badge
                        variant="default"
                        className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {topic.growth}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                      <div>
                        <span className="block">Mentions:</span>
                        <span className="font-medium text-foreground">{topic.mentions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block">Sentiment:</span>
                        <span className="font-medium text-foreground">{(topic.sentiment * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Sentiment Score</span>
                        <span className="font-medium">{(topic.sentiment * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={topic.sentiment * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights & Custom Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI-Generated Insights */}
            <Card className="lg:col-span-2 rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>Intelligent analysis and recommendations from your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    type: "Trend Analysis",
                    title: "AI Content Creation Surge",
                    insight:
                      "There's been a 340% increase in AI-related content creation discussions over the past month. Key drivers include new model releases and enterprise adoption.",
                    confidence: 94,
                    actionable: true,
                    tags: ["AI", "Content", "Trending"],
                  },
                  {
                    type: "Audience Insight",
                    title: "Peak Engagement Windows",
                    insight:
                      "Your audience shows highest engagement between 2-4 PM EST on weekdays. Consider scheduling podcast releases during these windows for maximum reach.",
                    confidence: 87,
                    actionable: true,
                    tags: ["Engagement", "Timing", "Strategy"],
                  },
                  {
                    type: "Content Gap",
                    title: "Voice Technology Coverage",
                    insight:
                      "Voice technology is trending but underrepresented in your current content mix. This presents an opportunity for targeted content creation.",
                    confidence: 91,
                    actionable: true,
                    tags: ["Voice", "Opportunity", "Content"],
                  },
                ].map((insight, index) => (
                  <div key={index} className="p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {insight.type}
                          </Badge>
                          <h4 className="font-semibold text-sm">{insight.title}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{insight.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed mb-4">{insight.insight}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {insight.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {insight.actionable && (
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                          <Zap className="h-4 w-4 mr-2" />
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Feeds Setup */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Custom Feeds
                </CardTitle>
                <CardDescription>Personalized content streams based on AI insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "AI Innovation Feed",
                    sources: 12,
                    articles: 89,
                    score: 92,
                    status: "active",
                  },
                  {
                    name: "Tech Industry News",
                    sources: 8,
                    articles: 156,
                    score: 87,
                    status: "active",
                  },
                  {
                    name: "Podcast Trends",
                    sources: 6,
                    articles: 34,
                    score: 94,
                    status: "paused",
                  },
                ].map((feed, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{feed.name}</h4>
                      <Badge variant={feed.status === "active" ? "default" : "secondary"} className="text-xs">
                        {feed.status === "active" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                        )}
                        {feed.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                      <div>
                        <span className="block">Sources:</span>
                        <span className="font-medium text-foreground">{feed.sources}</span>
                      </div>
                      <div>
                        <span className="block">Articles:</span>
                        <span className="font-medium text-foreground">{feed.articles}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Quality Score</span>
                        <span className="font-medium">{feed.score}%</span>
                      </div>
                      <Progress value={feed.score} className="h-2" />
                    </div>

                    <Button variant="outline" size="sm" className="w-full rounded-lg bg-transparent">
                      Configure Feed
                    </Button>
                  </div>
                ))}

                <div className="p-4 rounded-xl border-2 border-dashed border-border/40 hover:border-border/60 transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm mb-1">Create Custom Feed</p>
                    <p className="text-xs text-muted-foreground">AI-powered content curation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Summary */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Analytics Summary
              </CardTitle>
              <CardDescription>Comprehensive performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    metric: "Content Velocity",
                    value: "47 articles/day",
                    change: "+12%",
                    description: "Average content collection rate",
                  },
                  {
                    metric: "AI Processing Time",
                    value: "2.3 seconds",
                    change: "-8%",
                    description: "Average analysis time per article",
                  },
                  {
                    metric: "Topic Diversity",
                    value: "89 topics",
                    change: "+15%",
                    description: "Unique topics identified this week",
                  },
                  {
                    metric: "Insight Accuracy",
                    value: "94.2%",
                    change: "+3%",
                    description: "AI prediction accuracy rate",
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
                    <p className="text-xs text-muted-foreground text-pretty">{stat.description}</p>
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
