"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { AlertTriangle, CheckCircle, Cpu, FileText, HardDrive, Network, Play, Square, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { ExecutionEvent, ExecutionLanguage, ExecutionMetrics, JobStatus, ResourceLimits } from "@/lib/execution/contracts"

interface SystemSimulationProps {
  problemId: string
  code?: string
  language?: ExecutionLanguage
}

type LogLevel = "info" | "warning" | "error" | "success"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
}

const prompt = "runner@Codura:~/workspace$"
const initialMetrics: ExecutionMetrics = {
  cpuPercent: 0,
  memoryMb: 0,
  memoryLimitMb: 256,
  networkBytes: 0,
  diskBytes: 0,
}
const initialCode = 'print("Connect this panel to the current editor submission.")\n'

export default function SystemSimulation({ problemId, code = initialCode, language = "python" }: SystemSimulationProps) {
  const [status, setStatus] = useState<JobStatus | "idle">("idle")
  const [jobId, setJobId] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [terminalInput, setTerminalInput] = useState("")
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [metrics, setMetrics] = useState(initialMetrics)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("console")
  const [limits, setLimits] = useState<ResourceLimits>({ cpuPercent: 100, memoryMb: 256, timeoutSeconds: 15 })
  const terminalRef = useRef<HTMLDivElement>(null)
  const logsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventsRef = useRef<EventSource | null>(null)
  const receivedEventIds = useRef(new Set<number>())
  const { toast } = useToast()

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight })
    logsRef.current?.scrollTo({ top: logsRef.current.scrollHeight })
  }, [history, logs])

  useEffect(() => {
    if (activeTab === "console") inputRef.current?.focus()
  }, [activeTab])

  useEffect(() => () => eventsRef.current?.close(), [])

  const appendTerminal = (value: string) => {
    const lines = value.replace(/\r/g, "").split("\n")
    setHistory((current) => [...current, ...lines].slice(-600))
  }

  const appendLog = (level: LogLevel, message: string, timestamp = new Date().toISOString()) => {
    setLogs((current) => [...current, { level, message, timestamp }].slice(-300))
  }

  const handleEvent = (event: ExecutionEvent) => {
    if (receivedEventIds.current.has(event.id)) return
    receivedEventIds.current.add(event.id)

    if (event.type === "stdout" || event.type === "stderr") {
      const payload = event.payload as { text?: string }
      if (payload.text) appendTerminal(payload.text)
      return
    }
    if (event.type === "metrics") {
      setMetrics(event.payload as ExecutionMetrics)
      return
    }
    if (event.type === "progress") {
      const payload = event.payload as { value?: number }
      if (typeof payload.value === "number") setProgress(payload.value)
      return
    }
    if (event.type === "log") {
      const payload = event.payload as { level?: LogLevel; message?: string }
      if (payload.message) appendLog(payload.level ?? "info", payload.message, event.timestamp)
      return
    }
    if (event.type === "status") {
      const payload = event.payload as { status?: JobStatus; exitCode?: number; error?: string }
      if (!payload.status) return
      setStatus(payload.status)
      if (payload.status === "succeeded") {
        toast({ title: "Execution completed", description: "Your isolated container exited successfully." })
      } else if (["failed", "timed_out", "cancelled"].includes(payload.status)) {
        toast({
          title: payload.status === "cancelled" ? "Execution stopped" : "Execution did not complete",
          description: payload.error ?? `Process exited with code ${payload.exitCode ?? 1}.`,
          variant: payload.status === "cancelled" ? "default" : "destructive",
        })
      }
    }
  }

  const connectToEvents = (id: string) => {
    eventsRef.current?.close()
    const source = new EventSource(`/api/run/${id}/events`)
    eventsRef.current = source
    source.onmessage = (message) => {
      try {
        handleEvent(JSON.parse(message.data) as ExecutionEvent)
      } catch {
        appendLog("warning", "Received an unreadable runner event.")
      }
    }
    source.onerror = () => {
      if (eventsRef.current === source) void recoverExecution(id, source)
    }
  }

  const recoverExecution = async (id: string, source: EventSource) => {
    try {
      const response = await fetch(`/api/job/${id}`)
      if (!response.ok) throw new Error("The execution stream disconnected and its job is no longer available.")
      const job = (await response.json()) as { status: JobStatus; events: ExecutionEvent[] }

      for (const event of job.events) handleEvent(event)
      if (["succeeded", "failed", "timed_out", "cancelled"].includes(job.status)) source.close()
      // A non-terminal EventSource reconnects automatically, and events are de-duplicated above.
    } catch (error) {
      source.close()
      const message = error instanceof Error ? error.message : "The execution stream disconnected."
      setStatus("failed")
      appendTerminal(`runner: ${message}`)
      appendLog("error", message)
      toast({ title: "Execution stream disconnected", description: message, variant: "destructive" })
    }
  }

  const startExecution = async ({ includeCommand = true }: { includeCommand?: boolean } = {}) => {
    if (status === "queued" || status === "running") return
    if (!code.trim()) {
      toast({ title: "Write some code first", description: "The sandbox runs the source currently shown in the editor.", variant: "destructive" })
      return
    }
    setStatus("queued")
    setProgress(0)
    setMetrics({ ...initialMetrics, memoryLimitMb: limits.memoryMb })
    receivedEventIds.current.clear()
    if (includeCommand) appendTerminal(`${prompt} run ${language}`)

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, language, code, resourceLimits: limits }),
      })
      const payload = (await response.json()) as { jobId?: string; error?: string }
      if (!response.ok || !payload.jobId) throw new Error(payload.error ?? "The runner did not return a job id.")

      setJobId(payload.jobId)
      connectToEvents(payload.jobId)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach the code runner."
      setStatus("failed")
      appendTerminal(`runner: ${message}`)
      appendLog("error", message)
      toast({ title: "Execution unavailable", description: message, variant: "destructive" })
    }
  }

  const stopExecution = async () => {
    if (!jobId || (status !== "queued" && status !== "running")) return
    try {
      await fetch(`/api/job/${jobId}`, { method: "DELETE" })
    } catch {
      appendLog("error", "Unable to request execution cancellation.")
    }
  }

  const readWorkspace = async (fileName?: string) => {
    const url = fileName
      ? `/api/fs/${encodeURIComponent(problemId)}/${encodeURIComponent(fileName)}`
      : `/api/fs/${encodeURIComponent(problemId)}`
    const response = await fetch(url)
    const payload = (await response.json()) as { files?: { name: string }[]; content?: string; error?: string }
    if (!response.ok) appendTerminal(`runner: ${payload.error ?? "Unable to read workspace."}`)
    else if (fileName) appendTerminal(payload.content ?? "")
    else appendTerminal((payload.files ?? []).map((file) => file.name).join("  "))
  }

  const handleTerminalInput = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    const command = terminalInput.trim()
    if (!command) return
    setTerminalInput("")
    appendTerminal(`${prompt} ${command}`)

    if (command === "clear") setHistory([])
    else if (command === "ls" || command === "ls -la") await readWorkspace()
    else if (/^cat\s+[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(command)) await readWorkspace(command.slice(4).trim())
    else if (command === "run" || command === `run ${language}`) await startExecution({ includeCommand: false })
    else if (command === "help") appendTerminal(`Available commands: ls, cat <file>, run, run ${language}, clear, help`)
    else appendTerminal("runner: interactive shells and cloud CLIs are disabled. Submit code through the isolated runner.")
  }

  const reset = () => {
    eventsRef.current?.close()
    eventsRef.current = null
    receivedEventIds.current.clear()
    setStatus("idle")
    setJobId(null)
    setHistory([])
    setLogs([])
    setProgress(0)
    setMetrics({ ...initialMetrics, memoryLimitMb: limits.memoryMb })
  }

  const statusStyle: Record<typeof status, string> = {
    idle: "bg-slate-500/20 text-slate-400",
    queued: "bg-yellow-500/20 text-yellow-500",
    running: "bg-green-500/20 text-green-500",
    succeeded: "bg-green-500/20 text-green-500",
    failed: "bg-red-500/20 text-red-500",
    timed_out: "bg-red-500/20 text-red-500",
    cancelled: "bg-slate-500/20 text-slate-400",
  }
  const isRunning = status === "queued" || status === "running"

  return (
    <Card className="w-full code-editor">
      <CardHeader className="code-editor-header">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Isolated code runner</CardTitle>
            <CardDescription>Docker sandbox · network disabled · server-enforced resource limits</CardDescription>
          </div>
          <Badge className={statusStyle[status]}>{status.replace("_", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <LimitSelect value={limits.cpuPercent} disabled={isRunning} values={[25, 50, 100]} label="CPU" suffix="%" onChange={(cpuPercent) => setLimits((current) => ({ ...current, cpuPercent }))} />
          <LimitSelect value={limits.memoryMb} disabled={isRunning} values={[64, 256, 512, 1024]} label="Memory" suffix=" MB" onChange={(memoryMb) => setLimits((current) => ({ ...current, memoryMb }))} />
          <LimitSelect value={limits.timeoutSeconds} disabled={isRunning} values={[5, 15, 30]} label="Timeout" suffix="s" onChange={(timeoutSeconds) => setLimits((current) => ({ ...current, timeoutSeconds }))} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void startExecution()} disabled={isRunning || !code.trim()}><Play className="mr-2 h-4 w-4" />Run in sandbox</Button>
          <Button variant="outline" onClick={stopExecution} disabled={!isRunning}><Square className="mr-2 h-4 w-4" />Stop</Button>
          <Button variant="ghost" onClick={reset} disabled={isRunning}>Reset view</Button>
        </div>

        {isRunning && <div><div className="mb-1 flex justify-between text-sm text-muted"><span>Runner progress</span><span>{progress}%</span></div><Progress value={progress} className="h-2" /></div>}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="console" className="flex-1"><Terminal className="mr-2 h-4 w-4" />Console</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1"><FileText className="mr-2 h-4 w-4" />Logs</TabsTrigger>
            <TabsTrigger value="metrics" className="flex-1"><Cpu className="mr-2 h-4 w-4" />Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="console">
            <div ref={terminalRef} className="h-[300px] overflow-y-auto rounded-md bg-black p-3 font-mono text-sm text-white" aria-live="polite">
              {history.map((line, index) => <div key={`${index}-${line}`}>{line || "\u00a0"}</div>)}
              <label className="flex items-center gap-2"><span>{prompt}</span><input ref={inputRef} value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} onKeyDown={handleTerminalInput} className="min-w-0 flex-1 bg-transparent outline-none" aria-label="Read-only workspace command" autoComplete="off" /></label>
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div ref={logsRef} className="h-[300px] space-y-2 overflow-y-auto rounded-md p-2 font-mono text-sm" aria-live="polite">
              {logs.length === 0 ? <p className="text-muted">Runner logs will appear here.</p> : logs.map((log, index) => <LogLine key={`${log.timestamp}-${index}`} log={log} />)}
            </div>
          </TabsContent>
          <TabsContent value="metrics">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={<Cpu className="h-4 w-4 text-blue-400" />} name="CPU" value={`${metrics.cpuPercent.toFixed(1)}%`} progress={Math.min(metrics.cpuPercent, 100)} />
              <Metric icon={<HardDrive className="h-4 w-4 text-purple-400" />} name="Memory" value={`${metrics.memoryMb.toFixed(1)} / ${metrics.memoryLimitMb} MB`} progress={(metrics.memoryMb / metrics.memoryLimitMb) * 100} />
              <Metric icon={<Network className="h-4 w-4 text-green-500" />} name="Network" value="Disabled" progress={0} />
              <Metric icon={<HardDrive className="h-4 w-4 text-orange-400" />} name="Disk I/O" value={formatBytes(metrics.diskBytes)} progress={0} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LimitSelect({ value, disabled, values, label, suffix, onChange }: { value: number; disabled: boolean; values: number[]; label: string; suffix: string; onChange: (value: number) => void }) {
  return <Select value={String(value)} onValueChange={(next) => onChange(Number(next))} disabled={disabled}><SelectTrigger><SelectValue placeholder={`${label} limit`} /></SelectTrigger><SelectContent>{values.map((option) => <SelectItem key={option} value={String(option)}>{label}: {option}{suffix}</SelectItem>)}</SelectContent></Select>
}

function LogLine({ log }: { log: LogEntry }) {
  const icon = log.level === "success" ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> : log.level === "warning" || log.level === "error" ? <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${log.level === "error" ? "text-red-500" : "text-yellow-500"}`} /> : <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
  return <div className="flex gap-2"><span className="text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>{icon}<span className={log.level === "error" ? "text-red-400" : ""}>{log.message}</span></div>
}

function Metric({ icon, name, value, progress }: { icon: ReactNode; name: string; value: string; progress: number }) {
  return <div className="rounded-md border p-3"><div className="mb-2 flex items-center gap-2 text-sm text-muted">{icon}{name}</div><p className="font-mono text-sm">{value}</p><Progress value={Math.max(0, Math.min(progress, 100))} className="mt-2 h-1.5" /></div>
}

function formatBytes(value: number) {
  if (value < 1024) return `${value.toFixed(0)} B`
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / 1024 ** 2).toFixed(1)} MB`
}
