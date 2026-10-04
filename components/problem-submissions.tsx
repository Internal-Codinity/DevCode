"use client"

import { useCallback, useEffect, useState } from "react"
import { Clock3, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Submission {
  id: string
  language: string
  judgeScope: "sample" | "all"
  status: string
  verdictMessage: string | null
  testsTotal: number
  testsPassed: number
  runtimeMs: number | null
  memoryKb: number | null
  createdAt: string
}

export default function ProblemSubmissions({ problemId, refreshToken = 0 }: { problemId: string; refreshToken?: number }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [state, setState] = useState<"loading" | "ready" | "signed-out" | "error">("loading")

  const load = useCallback(async (signal?: AbortSignal) => {
    setState("loading")
    try {
      const response = await fetch(`/api/submissions?problemId=${encodeURIComponent(problemId)}`, { cache: "no-store", signal })
      if (signal?.aborted) return
      if (response.status === 401) {
        setSubmissions([])
        setState("signed-out")
        return
      }
      const payload = await response.json() as { submissions?: Submission[] }
      if (!response.ok) throw new Error()
      setSubmissions(payload.submissions ?? [])
      setState("ready")
    } catch {
      if (!signal?.aborted) setState("error")
    }
  }, [problemId])

  useEffect(() => {
    const controller = new AbortController()
    // Delay the initial request until after paint. The component is already in
    // its loading state, and this avoids synchronously cascading an effect.
    const timer = window.setTimeout(() => void load(controller.signal), 0)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [load, refreshToken])

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div><CardTitle>Submission history</CardTitle><CardDescription>Durable judge records for your account.</CardDescription></div>
        <Button variant="outline" size="sm" onClick={() => void load()}><RefreshCw className="mr-1 h-4 w-4" />Refresh</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {state === "loading" ? <p className="text-sm text-muted">Loading submissions…</p> : null}
        {state === "signed-out" ? <p className="text-sm text-muted">Sign in to view your submission history.</p> : null}
        {state === "error" ? <p className="text-sm text-destructive">Submission history is temporarily unavailable.</p> : null}
        {state === "ready" && submissions.length === 0 ? <p className="rounded-md border border-dashed p-5 text-center text-sm text-muted">No submissions for this problem yet.</p> : null}
        {state === "ready" && submissions.map((submission) => <article key={submission.id} className="rounded-md border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><Status status={submission.status} /><Badge variant="outline">{submission.language}</Badge><Badge variant="outline">{submission.judgeScope === "all" ? "Full judge" : "Samples"}</Badge></div><span className="flex items-center gap-1 text-xs text-muted"><Clock3 className="h-3.5 w-3.5" />{new Date(submission.createdAt).toLocaleString()}</span></div>
          <p className="mt-2 text-sm">{submission.testsPassed} / {submission.testsTotal} tests passed{submission.runtimeMs !== null ? ` · ${submission.runtimeMs} ms` : ""}{submission.memoryKb !== null ? ` · ${(submission.memoryKb / 1024).toFixed(1)} MB` : ""}</p>
          {submission.verdictMessage ? <p className="mt-1 text-xs text-muted">{submission.verdictMessage}</p> : null}
        </article>)}
      </CardContent>
    </Card>
  )
}

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = { accepted: "bg-green-500/20 text-green-500", queued: "bg-yellow-500/20 text-yellow-500", running: "bg-blue-500/20 text-blue-500", wrong_answer: "bg-red-500/20 text-red-500", runtime_error: "bg-red-500/20 text-red-500", time_limit_exceeded: "bg-red-500/20 text-red-500", cancelled: "bg-slate-500/20 text-slate-400", internal_error: "bg-red-500/20 text-red-500" }
  return <Badge className={styles[status] ?? styles.internal_error}>{status.replaceAll("_", " ")}</Badge>
}
