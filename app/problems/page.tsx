"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Problem } from "@/types/problem"

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [accepted, setAccepted] = useState(new Set<string>())
  const [query, setQuery] = useState("")
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    void Promise.all([fetch("/api/problems", { cache: "no-store" }), fetch("/api/submissions", { cache: "no-store" })])
      .then(async ([problemResponse, submissionResponse]) => {
        const problemPayload = await problemResponse.json() as { problems?: Problem[]; error?: string }
        if (!problemResponse.ok) throw new Error(problemPayload.error ?? "Problem catalog is unavailable.")
        const submissionPayload = submissionResponse.ok ? await submissionResponse.json() as { submissions?: { problemId: string; status: string }[] } : { submissions: [] }
        setProblems(problemPayload.problems ?? [])
        setAccepted(new Set((submissionPayload.submissions ?? []).filter((submission) => submission.status === "accepted").map((submission) => submission.problemId)))
        setState("ready")
      })
      .catch(() => setState("error"))
  }, [])

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return problems
    return problems.filter((problem) => `${problem.title} ${problem.category} ${problem.tags.join(" ")}`.toLowerCase().includes(text))
  }, [problems, query])

  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
    <header><h1 className="text-3xl font-bold">Problems</h1><p className="mt-1 text-muted">Submit to the durable judge; only accepted full submissions mark a problem as solved.</p></header>
    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, category, or tag" /></div>
    {state === "loading" ? <p className="text-muted">Loading problems…</p> : null}
    {state === "error" ? <Card><CardContent className="p-6 text-destructive">The problem catalog is unavailable. Configure PostgreSQL, apply migrations, and seed the catalog.</CardContent></Card> : null}
    {state === "ready" && visible.length === 0 ? <Card><CardContent className="p-6 text-muted">No problems match this search.</CardContent></Card> : null}
    {state === "ready" && visible.map((problem) => <Card key={problem.id}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3">{accepted.has(problem.id) ? <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" /> : <div className="mt-1 h-5 w-5 shrink-0 rounded-full border-2" />}<div><Link className="font-semibold hover:underline" href={`/problems/${problem.id}`}>{problem.title}</Link><p className="mt-1 text-sm text-muted">{problem.category}</p><div className="mt-2 flex flex-wrap gap-1">{problem.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div></div></div><div className="flex items-center gap-2"><Badge className={difficultyClass(problem.difficulty)}>{problem.difficulty}</Badge><Button asChild size="sm"><Link href={`/problems/${problem.id}`}>{accepted.has(problem.id) ? "Review" : "Solve"}</Link></Button></div></CardContent></Card>)}
  </main>
}

function difficultyClass(difficulty: string) { return difficulty === "Easy" ? "bg-green-500/20 text-green-500" : difficulty === "Hard" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500" }
