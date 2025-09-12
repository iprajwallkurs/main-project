import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  Plus,
  Settings,
  Calendar,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  AlertCircle,
  Play,
  Pause,
  BarChart3,
} from "lucide-react"

export function SocialMediaSection() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Social Media Monitoring</h1>
            <p className="text-muted-foreground">Track and analyze social media content across platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Collection
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Twitter/X", icon: Twitter, accounts: 3, posts: 1247, color: "from-blue-500 to-cyan-500" },
              { name: "LinkedIn", icon: Linkedin, accounts: 2, posts: 89, color: "from-blue-600 to-blue-700" },
              { name: "Instagram", icon: Instagram, accounts: 1, posts: 456, color: "from-pink-500 to-purple-600" },
              { name: "YouTube", icon: Youtube, accounts: 1, posts: 23, color: "from-red-500 to-red-600" },
              { name: "Facebook", icon: Facebook, accounts: 2, posts: 234, color: "from-blue-500 to-indigo-600" },
            ].map((platform, index) => (
              <Card key={index} className="rounded-2xl border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                    >
                      <platform.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {platform.accounts} accounts
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{platform.name}</h3>
                  <p className="text-2xl font-bold mb-1">{platform.posts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">posts collected</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connected Accounts & Feed Collection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Connected Social Media Accounts */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Connected Accounts
                    </CardTitle>
                    <CardDescription>Manage your social media login sessions</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    platform: "Twitter/X",
                    username: "@techinsights",
                    status: "active",
                    lastSync: "2 min ago",
                    followers: "12.5K",
                    icon: Twitter,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    platform: "LinkedIn",
                    username: "Tech Insights Co.",
                    status: "active",
                    lastSync: "15 min ago",
                    followers: "8.2K",
                    icon: Linkedin,
                    color: "from-blue-600 to-blue-700",
                  },
                  {
                    platform: "Instagram",
                    username: "@tech_daily",
                    status: "expired",
                    lastSync: "2 days ago",
                    followers: "5.1K",
                    icon: Instagram,
                    color: "from-pink-500 to-purple-600",
                  },
                ].map((account, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <account.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{account.platform}</h4>
                          <p className="text-xs text-muted-foreground">{account.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{account.followers} followers</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">Last sync: {account.lastSync}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.status === "active" ? "default" : "secondary"} className="text-xs">
                          {account.status === "active" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                          )}
                          {account.status === "expired" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {account.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Account */}
                <div className="p-4 rounded-xl border-2 border-dashed border-border/40 hover:border-border/60 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Add New Account</p>
                      <p className="text-xs">Connect another social media platform</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Feed Collection */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Scheduled Collection
                    </CardTitle>
                    <CardDescription>Automated content monitoring schedules</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Daily Tech News",
                    platforms: ["Twitter", "LinkedIn"],
                    frequency: "Every 2 hours",
                    nextRun: "In 45 minutes",
                    status: "active",
                    collected: 156,
                  },
                  {
                    name: "Industry Influencers",
                    platforms: ["Twitter", "Instagram"],
                    frequency: "Every 6 hours",
                    nextRun: "In 3 hours",
                    status: "active",
                    collected: 89,
                  },
                  {
                    name: "Competitor Analysis",
                    platforms: ["LinkedIn", "Facebook"],
                    frequency: "Daily at 9 AM",
                    nextRun: "Tomorrow 9:00 AM",
                    status: "paused",
                    collected: 234,
                  },
                ].map((schedule, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-sm">{schedule.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {schedule.platforms.map((platform, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={schedule.status === "active" ? "default" : "secondary"} className="text-xs">
                          {schedule.status === "active" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                          )}
                          {schedule.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {schedule.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Frequency:</span>
                        <span className="font-medium text-foreground">{schedule.frequency}</span>
                      </div>
                      <div>
                        <span className="block">Next Run:</span>
                        <span className="font-medium text-foreground">{schedule.nextRun}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block">Posts Collected:</span>
                        <span className="font-medium text-foreground">{schedule.collected}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Social Media Posts */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Posts & Engagement
                  </CardTitle>
                  <CardDescription>Latest collected social media content with analytics</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    platform: "Twitter",
                    icon: Twitter,
                    color: "from-blue-500 to-cyan-500",
                    author: "@elonmusk",
                    content:
                      "The future of AI is looking incredibly promising. Excited to see what innovations emerge in 2024!",
                    timestamp: "2 hours ago",
                    engagement: {
                      likes: 15420,
                      retweets: 3240,
                      comments: 892,
                      views: 234000,
                    },
                  },
                  {
                    platform: "LinkedIn",
                    icon: Linkedin,
                    color: "from-blue-600 to-blue-700",
                    author: "Satya Nadella",
                    content:
                      "Thrilled to announce our latest breakthrough in quantum computing. This technology will revolutionize how we approach complex problems.",
                    timestamp: "4 hours ago",
                    engagement: {
                      likes: 8920,
                      retweets: 1240,
                      comments: 456,
                      views: 89000,
                    },
                  },
                  {
                    platform: "Instagram",
                    icon: Instagram,
                    color: "from-pink-500 to-purple-600",
                    author: "@techcrunch",
                    content: "Behind the scenes at the latest tech conference. Amazing innovations on display! 🚀",
                    timestamp: "6 hours ago",
                    engagement: {
                      likes: 5670,
                      retweets: 890,
                      comments: 234,
                      views: 45000,
                    },
                  },
                ].map((post, index) => (
                  <div key={index} className="p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <post.icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sm">{post.author}</h4>
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                        </div>

                        <p className="text-sm text-pretty leading-relaxed mb-4">{post.content}</p>

                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.engagement.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share className="h-4 w-4" />
                            <span>{post.engagement.retweets.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.engagement.comments.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.engagement.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monitoring Settings */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl">Monitoring Configuration</CardTitle>
                <CardDescription>Customize content collection and filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Keywords to Monitor</Label>
                  <Input placeholder="AI, machine learning, technology..." className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Exclude Keywords</Label>
                  <Input placeholder="spam, promotional..." className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Engagement</Label>
                    <Input type="number" placeholder="100" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>All Languages</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Include Media Content</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Monitor Hashtags</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Track Mentions</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl">Scheduling Best Practices</CardTitle>
                <CardDescription>Optimize your content collection strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      title: "Peak Hours Collection",
                      description: "Schedule during 9-11 AM and 2-4 PM for maximum engagement",
                      status: "recommended",
                    },
                    {
                      title: "Rate Limit Awareness",
                      description: "Respect platform API limits to avoid temporary blocks",
                      status: "important",
                    },
                    {
                      title: "Content Freshness",
                      description: "Collect every 2-4 hours for trending topics",
                      status: "tip",
                    },
                    {
                      title: "Weekend Scheduling",
                      description: "Reduce frequency on weekends for B2B content",
                      status: "tip",
                    },
                  ].map((practice, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-2 w-2 rounded-full mt-2 ${
                            practice.status === "recommended"
                              ? "bg-green-500"
                              : practice.status === "important"
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium text-sm mb-1">{practice.title}</h4>
                          <p className="text-xs text-muted-foreground text-pretty">{practice.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
