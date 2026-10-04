export const SUPPORTED_LANGUAGES = ["python", "javascript"] as const

export type ExecutionLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "cancelled"
export type LogLevel = "info" | "warning" | "error" | "success"

export interface ResourceLimits {
  cpuPercent: number
  memoryMb: number
  timeoutSeconds: number
}

export interface RunRequest {
  problemId: string
  language: ExecutionLanguage
  code: string
  /** A canonical fixture owned by the problem definition. */
  fixtureIndex?: number
  /** Ad-hoc input for a manual run. This is never used to grade a fixture. */
  testInput?: string
  resourceLimits?: Partial<ResourceLimits>
}

export interface ExecutionMetrics {
  cpuPercent: number
  memoryMb: number
  memoryLimitMb: number
  networkBytes: number
  diskBytes: number
}

export interface ExecutionEvent {
  id: number
  type: "stdout" | "stderr" | "progress" | "metrics" | "log" | "status"
  payload: unknown
  timestamp: string
}

export interface JobArtifact {
  name: string
  contentType: "application/json" | "text/plain"
  content: string
  size: number
}

export interface ExecutionJob {
  id: string
  problemId: string
  language: ExecutionLanguage
  status: JobStatus
  limits: ResourceLimits
  createdAt: string
  startedAt?: string
  completedAt?: string
  exitCode?: number
  error?: string
  artifacts: JobArtifact[]
  events: ExecutionEvent[]
}

export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
  cpuPercent: 100,
  memoryMb: 256,
  timeoutSeconds: 15,
}

export const LIMIT_BOUNDS = {
  cpuPercent: { min: 10, max: 100 },
  memoryMb: { min: 64, max: 1024 },
  timeoutSeconds: { min: 1, max: 30 },
} as const
