"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, Square } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CodeEditor from "@/components/code-editor"
import ProblemSubmissions from "@/components/problem-submissions"
import { useToast } from "@/hooks/use-toast"
import type { ExecutionLanguage } from "@/lib/execution/contracts"
import type { Problem } from "@/types/problem"

type JudgeScope = "sample" | "all"
type SubmissionStatus = "queued" | "running" | "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "cancelled" | "internal_error"
interface Submission { id: string; status: SubmissionStatus; judgeScope: JudgeScope; testsTotal: number; testsPassed: number; runtimeMs: number | null; memoryKb: number | null; verdictMessage: string | null }
interface SubmissionEvent { id: string; type: "status" | "progress" | "test" | "complete"; payload: { status?: SubmissionStatus; testsTotal?: number; testsPassed?: number; runtimeMs?: number; memoryKb?: number | null } }

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string; displayName: string } | null>(null)
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null)
  const [historyVersion, setHistoryVersion] = useState(0)
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false)
  const eventsRef = useRef<EventSource | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const mountedRef = useRef(true)
  const { toast } = useToast()

  useEffect(() => {
    const controller = new AbortController()
    void fetch(`/api/problems/${encodeURIComponent(id)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => ({ response, payload: await response.json() as { problem?: Problem; error?: string } }))
      .then(({ response, payload }) => {
        if (controller.signal.aborted) return
        if (!response.ok || !payload.problem) {
          setProblem(null)
          setLoadError(payload.error ?? "Problem not found.")
        } else {
          setProblem(payload.problem)
          setLoadError(null)
        }
      })
      .catch(() => { if (!controller.signal.aborted) setLoadError("Problem catalog is unavailable. Check the database configuration.") })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id])

  useEffect(() => {
    void fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ user: { id: string; email: string; displayName: string } | null }> : { user: null })
      .then((payload) => setUser(payload.user))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      eventsRef.current?.close()
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    }
  }, [])

  const handleEvent = (event: SubmissionEvent) => {
    if (event.type === "test" || event.type === "status") {
      setActiveSubmission((current) => current ? { ...current, status: event.payload.status ?? current.status, testsPassed: event.payload.testsPassed ?? current.testsPassed, testsTotal: event.payload.testsTotal ?? current.testsTotal } : current)
      return
    }
    if (event.type === "complete") {
      setActiveSubmission((current) => current ? { ...current, status: event.payload.status ?? current.status, testsPassed: event.payload.testsPassed ?? current.testsPassed, testsTotal: event.payload.testsTotal ?? current.testsTotal, runtimeMs: event.payload.runtimeMs ?? null, memoryKb: event.payload.memoryKb ?? null } : current)
      retryCountRef.current = 0
      setHistoryVersion((value) => value + 1); eventsRef.current?.close()
      toast({ title: verdictTitle(event.payload.status), description: event.payload.testsTotal ? `${event.payload.testsPassed ?? 0}/${event.payload.testsTotal} tests passed.` : undefined, variant: event.payload.status === "accepted" ? "default" : "destructive" })
    }
  }

  const streamSubmission = (submissionId: string) => {
    eventsRef.current?.close()
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    const stream = new EventSource(`/api/submissions/${submissionId}/events`)
    eventsRef.current = stream
    for (const type of ["status", "progress", "test", "complete"] as const) stream.addEventListener(type, (message) => { try { handleEvent(JSON.parse((message as MessageEvent<string>).data) as SubmissionEvent) } catch { /* ignore a malformed event */ } })
    stream.onerror = () => {
      stream.close()
      void fetch(`/api/submissions/${submissionId}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((payload: { submission?: Submission } | null) => {
        if (!mountedRef.current || !payload?.submission) return
        setActiveSubmission(payload.submission)
        if (isTerminal(payload.submission.status)) {
          retryCountRef.current = 0
          setHistoryVersion((value) => value + 1)
          return
        }
        const delay = Math.min(10_000, 500 * 2 ** retryCountRef.current++)
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) streamSubmission(submissionId)
        }, delay)
      }).catch(() => {
        if (!mountedRef.current) return
        const delay = Math.min(10_000, 500 * 2 ** retryCountRef.current++)
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) streamSubmission(submissionId)
        }, delay)
      })
    }
  }

  const startJudge = async (judgeScope: JudgeScope, nextCode: string, nextLanguage: ExecutionLanguage) => {
    if (!problem || isCreatingSubmission || (activeSubmission && !isTerminal(activeSubmission.status))) return
    if (!user) { toast({ title: "Sign in required", description: "Create an account or sign in before submitting code.", variant: "destructive" }); return }
    setIsCreatingSubmission(true)
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ problemId: problem.id, language: nextLanguage, sourceCode: nextCode, judgeScope }) })
      const payload = await response.json() as { submission?: Submission; error?: string }
      if (!response.ok || !payload.submission) throw new Error(payload.error ?? "Unable to queue the submission.")
      retryCountRef.current = 0
      setActiveSubmission(payload.submission); streamSubmission(payload.submission.id)
    } catch (error) { toast({ title: "Submission unavailable", description: error instanceof Error ? error.message : "Unable to queue the submission.", variant: "destructive" }) }
    finally { setIsCreatingSubmission(false) }
  }

  const cancelSubmission = async () => {
    if (!activeSubmission || isTerminal(activeSubmission.status)) return
    try { const response = await fetch(`/api/submissions/${activeSubmission.id}`, { method: "DELETE" }); if (!response.ok) throw new Error(); toast({ title: "Cancellation requested" }) } catch { toast({ title: "Unable to cancel submission", variant: "destructive" }) }
  }

  if (loading || problem?.id !== id) return <main className="mx-auto max-w-5xl p-8 text-muted"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading problem…</main>
  if (!problem) return <main className="mx-auto max-w-3xl space-y-4 p-8"><h1 className="text-2xl font-bold">Problem unavailable</h1><p className="text-muted">{loadError}</p><Button asChild variant="outline"><Link href="/problems">Back to problems</Link></Button></main>

  const pending = isCreatingSubmission || (activeSubmission !== null && !isTerminal(activeSubmission.status))
  return <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <section className="min-w-0 space-y-5">
      <header className="space-y-3"><div className="flex flex-wrap items-center gap-2"><Badge className={difficultyClass(problem.difficulty)}>{problem.difficulty}</Badge><Badge variant="outline">{problem.category}</Badge></div><h1 className="text-3xl font-bold">{problem.title}</h1><p className="text-muted">{problem.description}</p></header>
      <Card><CardHeader><CardTitle>Requirements</CardTitle></CardHeader><CardContent><ul className="list-inside list-disc space-y-2 text-sm">{problem.requirements?.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>
      {problem.exampleInput ? <Card><CardHeader><CardTitle>Example input</CardTitle></CardHeader><CardContent><pre className="overflow-auto rounded bg-muted p-3 text-sm">{problem.exampleInput}</pre></CardContent></Card> : null}
      {problem.exampleOutput ? <Card><CardHeader><CardTitle>Example output</CardTitle></CardHeader><CardContent><pre className="overflow-auto rounded bg-muted p-3 text-sm">{problem.exampleOutput}</pre></CardContent></Card> : null}
      <Card><CardHeader><CardTitle>Constraints</CardTitle></CardHeader><CardContent><ul className="list-inside list-disc space-y-2 text-sm">{problem.constraints?.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>
      <ProblemSubmissions problemId={problem.id} refreshToken={historyVersion} />
    </section>
    <section className="min-w-0 space-y-4">
      {!user ? <Card className="border-amber-500/40"><CardHeader><CardTitle className="text-base">An account is required to submit</CardTitle><CardDescription>Submission history, verdicts, and solved status are attached to your account.</CardDescription></CardHeader><CardContent className="flex gap-2"><Button asChild size="sm"><Link href="/login">Sign in</Link></Button><Button asChild size="sm" variant="outline"><Link href="/register">Create account</Link></Button></CardContent></Card> : null}
      <CodeEditor key={problem.id} problem={problem} isSubmitting={pending} onRunSamples={(code, selectedLanguage) => void startJudge("sample", code, selectedLanguage)} onSubmit={(code, selectedLanguage) => void startJudge("all", code, selectedLanguage)} />
      <Card><CardHeader><CardTitle className="flex items-center gap-2">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}Judge status</CardTitle><CardDescription>“Run samples” checks only the examples shown here. “Submit” also runs private test cases.</CardDescription></CardHeader><CardContent className="space-y-3">
        {!activeSubmission ? <p className="flex items-center gap-2 text-sm text-muted"><AlertCircle className="h-4 w-4" />No active submission.</p> : <><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Status status={activeSubmission.status} /><Badge variant="outline">{activeSubmission.judgeScope === "all" ? "Full judge" : "Samples"}</Badge></div>{pending ? <Button size="sm" variant="outline" onClick={() => void cancelSubmission()}><Square className="h-4 w-4" />Cancel</Button> : null}</div><p className="text-sm">{activeSubmission.testsPassed} / {activeSubmission.testsTotal} tests passed{activeSubmission.runtimeMs !== null ? ` · ${activeSubmission.runtimeMs} ms` : ""}{activeSubmission.memoryKb !== null ? ` · ${(activeSubmission.memoryKb / 1024).toFixed(1)} MB` : ""}</p>{activeSubmission.verdictMessage ? <p className="text-sm text-muted">{activeSubmission.verdictMessage}</p> : null}</>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Public sample cases</CardTitle><CardDescription>Private judge cases are intentionally not sent to the browser.</CardDescription></CardHeader><CardContent className="space-y-3">{problem.sampleTests?.map((test, index) => <article key={`${test.name}-${index}`} className="rounded border p-3"><p className="font-medium">Sample {index + 1}: {test.name}</p><pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">Input: {test.input}{"\n"}Expected: {test.expected}</pre></article>)}</CardContent></Card>
    </section>
  </main>
}

function isTerminal(status: SubmissionStatus) { return ["accepted", "wrong_answer", "runtime_error", "time_limit_exceeded", "cancelled", "internal_error"].includes(status) }
function verdictTitle(status?: SubmissionStatus) { return status === "accepted" ? "Accepted" : status === "wrong_answer" ? "Wrong answer" : status === "runtime_error" ? "Runtime error" : status === "time_limit_exceeded" ? "Time limit exceeded" : status === "cancelled" ? "Submission cancelled" : "Judge finished" }
function difficultyClass(difficulty: string) { return difficulty === "Easy" ? "bg-green-500/20 text-green-500" : difficulty === "Hard" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500" }
function Status({ status }: { status: SubmissionStatus }) { const colors: Record<SubmissionStatus, string> = { queued: "bg-yellow-500/20 text-yellow-500", running: "bg-blue-500/20 text-blue-500", accepted: "bg-green-500/20 text-green-500", wrong_answer: "bg-red-500/20 text-red-500", runtime_error: "bg-red-500/20 text-red-500", time_limit_exceeded: "bg-red-500/20 text-red-500", cancelled: "bg-slate-500/20 text-slate-400", internal_error: "bg-red-500/20 text-red-500" }; return <Badge className={colors[status]}>{status.replaceAll("_", " ")}</Badge> }
