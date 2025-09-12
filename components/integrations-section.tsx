import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Key,
  Shield,
  MessageSquare,
  Webhook,
  Database,
  Mail,
  Calendar,
  FileText,
  Bot,
  Globe,
  Code,
  Play,
  Pause,
} from "lucide-react"

export function IntegrationsSection() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Integrations</h1>
            <p className="text-muted-foreground">Connect external services and automate workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
              <Code className="h-4 w-4 mr-2" />
              API Docs
            </Button>
            <Button size="sm" className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Integration Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Slack",
                status: "connected",
                icon: MessageSquare,
                color: "from-purple-500 to-indigo-600",
                description: "Team notifications",
              },
              {
                name: "Webhooks",
                status: "active",
                icon: Webhook,
                color: "from-blue-500 to-cyan-600",
                description: "Custom endpoints",
              },
              {
                name: "Database",
                status: "connected",
                icon: Database,
                color: "from-green-500 to-emerald-600",
                description: "Data storage",
              },
              {
                name: "Email",
                status: "pending",
                icon: Mail,
                color: "from-orange-500 to-red-500",
                description: "Email notifications",
              },
            ].map((integration, index) => (
              <Card key={index} className="rounded-2xl border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center`}
                    >
                      <integration.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge
                      variant={
                        integration.status === "connected" || integration.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {(integration.status === "connected" || integration.status === "active") && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {integration.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {integration.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{integration.name}</h3>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Slack Integration Setup */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Slack Integration
              </CardTitle>
              <CardDescription>Configure Slack notifications and bot interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Setup Guide */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Setup Guide
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          title: "Create Slack App",
                          description: "Create a new Slack app in your workspace",
                          status: "completed",
                        },
                        {
                          step: 2,
                          title: "Configure Permissions",
                          description: "Set up OAuth scopes and bot permissions",
                          status: "completed",
                        },
                        {
                          step: 3,
                          title: "Install to Workspace",
                          description: "Install the app to your Slack workspace",
                          status: "completed",
                        },
                        {
                          step: 4,
                          title: "Configure Webhooks",
                          description: "Set up incoming webhooks for notifications",
                          status: "in-progress",
                        },
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.status === "completed"
                                ? "bg-green-500 text-white"
                                : step.status === "in-progress"
                                  ? "bg-blue-500 text-white"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.status === "completed" ? <CheckCircle className="h-4 w-4" /> : step.step}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{step.title}</h5>
                            <p className="text-xs text-muted-foreground text-pretty">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Environment Configuration
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="slack-bot-token">Slack Bot Token</Label>
                        <div className="flex gap-2">
                          <Input
                            id="slack-bot-token"
                            type="password"
                            placeholder="xoxb-your-bot-token"
                            className="rounded-xl"
                            defaultValue="xoxb-1234567890-abcdefghijk"
                          />
                          <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slack-signing-secret">Signing Secret</Label>
                        <div className="flex gap-2">
                          <Input
                            id="slack-signing-secret"
                            type="password"
                            placeholder="Your signing secret"
                            className="rounded-xl"
                            defaultValue="a1b2c3d4e5f6g7h8i9j0"
                          />
                          <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slack-webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="slack-webhook-url"
                            placeholder="https://hooks.slack.com/services/..."
                            className="rounded-xl"
                            defaultValue="https://hooks.slack.com/services/T1234/B5678/abcdef"
                          />
                          <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration & Testing */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Permissions & Scopes
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          scope: "channels:read",
                          description: "View basic information about public channels",
                          enabled: true,
                        },
                        { scope: "chat:write", description: "Send messages as Brainfog", enabled: true },
                        { scope: "files:write", description: "Upload files and content", enabled: true },
                        { scope: "users:read", description: "View people in the workspace", enabled: false },
                      ].map((permission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium text-sm font-mono">{permission.scope}</p>
                            <p className="text-xs text-muted-foreground text-pretty">{permission.description}</p>
                          </div>
                          <Switch checked={permission.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Test Integration
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="test-channel">Test Channel</Label>
                        <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                          <option>#general</option>
                          <option>#brainfog-notifications</option>
                          <option>#tech-updates</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="test-message">Test Message</Label>
                        <Textarea
                          id="test-message"
                          placeholder="Enter a test message..."
                          className="rounded-xl"
                          defaultValue="🤖 Brainfog integration test - AI content curation is now active!"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 rounded-xl">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Test Message
                        </Button>
                        <Button variant="outline" className="rounded-xl bg-transparent">
                          <Play className="h-4 w-4 mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Integrations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Integrations */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Available Integrations
                </CardTitle>
                <CardDescription>Connect popular services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Discord",
                    description: "Send notifications to Discord channels",
                    icon: MessageSquare,
                    status: "available",
                    color: "from-indigo-500 to-purple-600",
                  },
                  {
                    name: "Microsoft Teams",
                    description: "Integrate with Teams workflows",
                    icon: MessageSquare,
                    status: "available",
                    color: "from-blue-500 to-indigo-600",
                  },
                  {
                    name: "Zapier",
                    description: "Connect to 5000+ apps via Zapier",
                    icon: Zap,
                    status: "available",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    name: "Google Calendar",
                    description: "Schedule content generation",
                    icon: Calendar,
                    status: "coming-soon",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    name: "Notion",
                    description: "Save content to Notion databases",
                    icon: FileText,
                    status: "coming-soon",
                    color: "from-gray-500 to-gray-600",
                  },
                ].map((integration, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center`}
                        >
                          <integration.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{integration.name}</h4>
                          <p className="text-xs text-muted-foreground text-pretty">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={integration.status === "available" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {integration.status === "available" ? "Available" : "Coming Soon"}
                        </Badge>
                        {integration.status === "available" && (
                          <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card className="rounded-2xl border-border/40">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Endpoints
                </CardTitle>
                <CardDescription>Custom webhook integrations and API endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      name: "Content Generated",
                      url: "https://api.brainfog.ai/webhooks/content",
                      method: "POST",
                      status: "active",
                      events: ["content.created", "content.updated"],
                    },
                    {
                      name: "Podcast Published",
                      url: "https://api.brainfog.ai/webhooks/podcast",
                      method: "POST",
                      status: "active",
                      events: ["podcast.generated", "podcast.published"],
                    },
                    {
                      name: "Analytics Update",
                      url: "https://api.brainfog.ai/webhooks/analytics",
                      method: "POST",
                      status: "paused",
                      events: ["analytics.daily", "analytics.weekly"],
                    },
                  ].map((webhook, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{webhook.name}</h4>
                          <p className="text-xs text-muted-foreground font-mono">{webhook.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={webhook.status === "active" ? "default" : "secondary"} className="text-xs">
                            {webhook.status === "active" && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                            )}
                            {webhook.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {webhook.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {webhook.method}
                          </Badge>
                          <span className="text-muted-foreground">Events:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs font-mono">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Add New Webhook</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-name">Webhook Name</Label>
                      <Input id="webhook-name" placeholder="My Custom Webhook" className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Endpoint URL</Label>
                      <Input id="webhook-url" placeholder="https://your-app.com/webhook" className="rounded-xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>HTTP Method</Label>
                        <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                          <option>POST</option>
                          <option>PUT</option>
                          <option>PATCH</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Content Type</Label>
                        <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                          <option>application/json</option>
                          <option>application/x-www-form-urlencoded</option>
                        </select>
                      </div>
                    </div>

                    <Button className="w-full rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Webhook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Analytics */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl">Integration Performance</CardTitle>
              <CardDescription>Monitor integration health and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    metric: "Active Integrations",
                    value: "8",
                    change: "+2",
                    description: "Connected services",
                  },
                  {
                    metric: "Webhook Calls",
                    value: "2,847",
                    change: "+23%",
                    description: "This month",
                  },
                  {
                    metric: "Success Rate",
                    value: "99.2%",
                    change: "+0.3%",
                    description: "Delivery success",
                  },
                  {
                    metric: "Avg Response Time",
                    value: "245ms",
                    change: "-12ms",
                    description: "Integration latency",
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
