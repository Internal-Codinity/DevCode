"use client"

import { useEffect, useState } from "react"
import { CalendarClock, CheckCircle2, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CONTEST = {
  id: "practice-weekly",
  title: "Weekly Practice Contest",
  description: "A self-paced set of problems. Your registration is saved in this browser.",
  problems: 4,
}

export default function ContestsPage() {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    setRegistered(window.localStorage.getItem(`codium:contest:${CONTEST.id}`) === "registered")
  }, [])

  const toggleRegistration = () => {
    const next = !registered
    setRegistered(next)
    window.localStorage.setItem(`codium:contest:${CONTEST.id}`, next ? "registered" : "")
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contests</h1>
        <p className="text-muted">Practice events and registration.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" />{CONTEST.title}</CardTitle>
              <CardDescription className="mt-2">{CONTEST.description}</CardDescription>
            </div>
            <Badge variant="outline">{CONTEST.problems} problems</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm text-muted"><CalendarClock className="h-4 w-4" />Available now</span>
          <Button onClick={toggleRegistration} variant={registered ? "outline" : "default"}>
            {registered ? <CheckCircle2 className="mr-2 h-4 w-4" /> : null}
            {registered ? "Registered — cancel" : "Register"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
