"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CalendarAgentSection() {
  const url = "https://huggingface.co/spaces/KevZ2001/Calendar-Agent"

  return (
    <div className="flex flex-col h-full">
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Calendar Agent</h1>
            <p className="text-sm text-muted-foreground">Talk to the AI agent for calendar help</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">Talk to the AI Agent</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Open Calendar Agent in new tab">
                <Button className="rounded-xl px-6 py-3">Talk to the AI agent</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarAgentSection
