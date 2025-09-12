"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Dashboard } from "@/components/dashboard"
import { WebSearchSection } from "@/components/web-search-section"
import { SocialMediaSection } from "@/components/social-media-section"
import { AIInsightsSection } from "@/components/ai-insights-section"
import { VoiceGenerationSection } from "@/components/voice-generation-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { LinkedInPostsSection } from "@/components/linkedin-posts-section"
import { ThemeProvider } from "@/components/theme-provider"
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
      case "/linkedin-posts":
        return <LinkedInPostsSection />
      case "/integrations":
        return <IntegrationsSection />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">{renderSection()}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
