"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/dashboard"
import { WebSearchSection } from "@/components/web-search-section"
import { SocialMediaSection } from "@/components/social-media-section"
import { AIInsightsSection } from "@/components/ai-insights-section"
import { VoiceGenerationSection } from "@/components/voice-generation-section"
import { CalendarAgentSection } from "@/components/calendar-agent-section"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { navigationItems } from "@/components/app-sidebar"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

export default function Home() {
  const [currentSection, setCurrentSection] = useState("/")

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentSection(window.location.hash.slice(1) || "/")
    }

    window.addEventListener("hashchange", handleHashChange)
    handleHashChange() // Set initial state

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const renderSection = () => {
    switch (currentSection) {
      case "/web-search":
        return <WebSearchSection />
      case "/social-media":
        return <SocialMediaSection />
      case "/ai-insights":
        return <AIInsightsSection />
      case "/voice-generation":
        return <VoiceGenerationSection />
      case "/calendar-agent":
        return <CalendarAgentSection />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <div className="md:hidden fixed top-0 left-0 right-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.title}
                      onSelect={() => {
                        window.location.hash = item.url
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="ml-3 text-sm font-semibold">NEXA</div>
            </div>
          </div>
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="md:hidden h-14" />
            {renderSection()}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}