"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Search, Globe, Users, BarChart3, Mic, Home, Zap, Linkedin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Web Search",
    icon: Search,
    url: "/web-search",
  },
  {
    title: "Social Media",
    icon: Users,
    url: "/social-media",
  },
  {
    title: "AI Insights",
    icon: BarChart3,
    url: "/ai-insights",
  },
  {
    title: "Voice Generation",
    icon: Mic,
    url: "/voice-generation",
  },
  {
    title: "LinkedIn Posts",
    icon: Linkedin,
    url: "/linkedin-posts",
  },
  {
    title: "Integrations",
    icon: Zap,
    url: "/integrations",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Brainfog</h1>
            <p className="text-sm text-muted-foreground">AI Content Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="h-12 rounded-xl transition-all duration-200 hover:bg-accent/50 data-[state=open]:bg-accent"
              >
                <button
                  onClick={() => (window.location.hash = item.url)}
                  className="flex items-center gap-3 px-4 w-full text-left"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-muted-foreground">admin@brainfog.ai</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
