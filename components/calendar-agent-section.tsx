"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarIcon, RefreshCcw, Plus, Clock } from "lucide-react"

type GCalEvent = {
  id: string
  summary?: string
  start?: { dateTime?: string; date?: string; timeZone?: string }
  end?: { dateTime?: string; date?: string; timeZone?: string }
}

export function CalendarAgentSection() {
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [events, setEvents] = useState<GCalEvent[]>([])

  // Form state
  const [summary, setSummary] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/google/calendar/events")
      if (res.status === 401) {
        setConnected(false)
        setEvents([])
        return
      }
      const data = await res.json()
      setConnected(true)
      setEvents(data.items || [])
    } catch (e) {
      setConnected(false)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectGoogle = async () => {
    const res = await fetch("/api/google/auth/url")
    const { url } = await res.json()
    window.location.href = url
  }

  const createEvent = async () => {
    if (!summary || !start || !end) return
    setLoading(true)
    try {
      const res = await fetch("/api/google/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, start, end, timezone }),
      })
      if (res.ok) {
        setSummary("")
        setStart("")
        setEnd("")
        await fetchEvents()
      } else if (res.status === 401) {
        setConnected(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-transparent bg-transparent supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Calendar Agent</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="rounded-xl bg-transparent" onClick={fetchEvents}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {!connected && (
              <Button size="sm" className="rounded-xl" onClick={connectGoogle}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Connect Google
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Create Event */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Event
              </CardTitle>
              <CardDescription>Quickly add a new Google Calendar event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Meeting with design team" value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input placeholder="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Start (ISO)</Label>
                  <Input placeholder="2025-10-28T15:00:00" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End (ISO)</Label>
                  <Input placeholder="2025-10-28T16:00:00" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>
              <Button className="rounded-xl" disabled={!connected || loading} onClick={createEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="rounded-2xl border-border/40">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Listing your next 10 events</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : !connected ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground">Not connected to Google Calendar.</p>
                  <Button size="sm" onClick={connectGoogle}>
                    Connect
                  </Button>
                </div>
              ) : events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events found.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => {
                    const startStr = ev.start?.dateTime || ev.start?.date || ""
                    const endStr = ev.end?.dateTime || ev.end?.date || ""
                    return (
                      <div key={ev.id} className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{ev.summary || "(No title)"}</p>
                            <p className="text-xs text-muted-foreground">{startStr} → {endStr}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
