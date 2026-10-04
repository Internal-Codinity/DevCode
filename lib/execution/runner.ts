import { ChildProcess, execFile, spawn } from "node:child_process"
import { chmod, lstat, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { randomUUID, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import {
  DEFAULT_RESOURCE_LIMITS,
  LIMIT_BOUNDS,
  type ExecutionEvent,
  type ExecutionJob,
  type ExecutionLanguage,
  type ExecutionMetrics,
  type JobArtifact,
  type JobStatus,
  type ResourceLimits,
  type RunRequest,
} from "@/lib/execution/contracts"
import { getProblemFixture, getProblemWorkspace } from "@/lib/execution/problem-workspaces"

const execFileAsync = promisify(execFile)
const MAX_CODE_BYTES = 256 * 1024
const MAX_OUTPUT_BYTES = 256 * 1024
const MAX_TEST_INPUT_BYTES = 64 * 1024
const MAX_ARTIFACT_BYTES = 64 * 1024
const JOB_RETENTION_MS = 15 * 60 * 1000
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 8

type JobListener = (event: ExecutionEvent) => void

interface ActiveJob extends ExecutionJob {
  listeners: Set<JobListener>
  process?: ChildProcess
  workspace?: string
  outputBytes: number
  timeout?: NodeJS.Timeout
  metricsTimer?: NodeJS.Timeout
  finishing?: boolean
  stdout: string
  stderr: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RunnerStore {
  jobs: Map<string, ActiveJob>
  requestCounts: Map<string, RateLimitEntry>
}

/*
 * App Router route handlers are compiled into separate bundles. A module-level
 * Map is therefore not reliably shared by POST /api/run, GET /api/job, and the
 * SSE route, even when they execute in the same Node process. Keep the local
 * development store on globalThis instead. Production still needs the durable
 * queue/store described in docs/isolated-runner.md for multiple processes.
 */
const runnerGlobal = globalThis as typeof globalThis & { __codiumRunnerStore?: RunnerStore }
const runnerStore = runnerGlobal.__codiumRunnerStore ?? (runnerGlobal.__codiumRunnerStore = {
  jobs: new Map<string, ActiveJob>(),
  requestCounts: new Map<string, RateLimitEntry>(),
})
const jobs = runnerStore.jobs
const requestCounts = runnerStore.requestCounts

const LANGUAGE_CONFIG: Record<ExecutionLanguage, { image: string; fileName: string; command: string[] }> = {
  // These images must be built/pre-pulled and vulnerability-scanned by the deployment pipeline.
  // The runner only refers to fixed image names; it never accepts an image from a request.
  python: {
    image: process.env.RUNNER_PYTHON_IMAGE ?? "codium-runner-python:3.11",
    fileName: "solution.py",
    command: ["python3", "-I", "/workspace/solution.py"],
  },
  javascript: {
    image: process.env.RUNNER_NODE_IMAGE ?? "codium-runner-node:22",
    fileName: "solution.js",
    command: ["node", "--disable-proto=throw", "/workspace/solution.js"],
  },
}

type ValidatedRunRequest = RunRequest & {
  resourceLimits: ResourceLimits
  expectedOutput?: string
}

export class ExecutionRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export function assertRunnerAvailable() {
  if (process.env.RUNNER_ENABLED !== "true") {
    throw new ExecutionRequestError("Code execution is not enabled on this deployment.", 503)
  }

  if (process.env.NODE_ENV === "production" && process.env.RUNNER_TRUSTED_GATEWAY !== "true") {
    throw new ExecutionRequestError("Code execution requires a trusted authenticated gateway in production.", 503)
  }
}

/** The queue worker is deployed inside the trusted runner network, rather
 * than behind the browser-facing execution gateway. */
export function assertJudgeWorkerAvailable() {
  if (process.env.RUNNER_ENABLED !== "true") {
    throw new ExecutionRequestError("Code execution is not enabled for this worker.", 503)
  }
  if (process.env.NODE_ENV === "production" && process.env.RUNNER_WORKER !== "true") {
    throw new ExecutionRequestError("Set RUNNER_WORKER=true only on the trusted judge worker deployment.", 503)
  }
}

/** Verify the worker can reach the fixed, operator-provided sandbox images
 * before it claims a submission. This prevents a misconfigured worker from
 * turning user programs into misleading runtime-error verdicts. */
export async function assertJudgeRuntimeReady() {
  try {
    await execFileAsync("docker", ["version", "--format", "{{.Server.Version}}"], { timeout: 5_000, maxBuffer: 16 * 1024, env: dockerEnvironment() })
    await Promise.all(Object.values(LANGUAGE_CONFIG).map(({ image }) => execFileAsync("docker", ["image", "inspect", image], { timeout: 5_000, maxBuffer: 16 * 1024, env: dockerEnvironment() })))
  } catch {
    throw new ExecutionRequestError("The isolated runner is not ready. Check the Docker socket and approved runner images.", 503)
  }
}

export function enforceRateLimit(clientKey: string) {
  const now = Date.now()
  const existing = requestCounts.get(clientKey)

  if (!existing || existing.resetAt <= now) {
    requestCounts.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new ExecutionRequestError("Too many execution requests. Try again in a minute.", 429)
  }

  existing.count += 1
}

export function validateRunRequest(value: unknown): ValidatedRunRequest {
  if (!value || typeof value !== "object") {
    throw new ExecutionRequestError("Request body must be a JSON object.", 400)
  }

  const request = value as Partial<RunRequest>
  if (typeof request.problemId !== "string" || !getProblemWorkspace(request.problemId)) {
    throw new ExecutionRequestError("Unknown problem workspace.", 400)
  }
  if (!request.language || !Object.hasOwn(LANGUAGE_CONFIG, request.language)) {
    throw new ExecutionRequestError("Unsupported execution language.", 422)
  }
  if (typeof request.code !== "string" || request.code.length === 0) {
    throw new ExecutionRequestError("A non-empty code submission is required.", 400)
  }
  if (Buffer.byteLength(request.code, "utf8") > MAX_CODE_BYTES) {
    throw new ExecutionRequestError("Code exceeds the 256 KiB submission limit.", 413)
  }
  if (request.testInput !== undefined && (typeof request.testInput !== "string" || Buffer.byteLength(request.testInput, "utf8") > MAX_TEST_INPUT_BYTES)) {
    throw new ExecutionRequestError("Test input must be text no larger than 64 KiB.", 413)
  }

  let testInput = request.testInput
  let expectedOutput: string | undefined
  if (request.fixtureIndex !== undefined) {
    if (typeof request.fixtureIndex !== "number" || !Number.isInteger(request.fixtureIndex)) {
      throw new ExecutionRequestError("Fixture index must be an integer.", 400)
    }
    if (request.testInput !== undefined) {
      throw new ExecutionRequestError("Fixture input is owned by the problem and cannot be overridden.", 400)
    }
    const fixture = getProblemFixture(request.problemId, request.fixtureIndex)
    if (!fixture) throw new ExecutionRequestError("Unknown problem fixture.", 400)
    testInput = fixture.input
    expectedOutput = fixture.expected
  }

  return {
    problemId: request.problemId,
    language: request.language,
    code: request.code,
    fixtureIndex: request.fixtureIndex,
    testInput,
    resourceLimits: normalizeLimits(request.resourceLimits),
    expectedOutput,
  }
}

export function createExecution(request: ValidatedRunRequest) {
  const id = randomUUID()
  const job: ActiveJob = {
    id,
    problemId: request.problemId,
    language: request.language,
    status: "queued",
    limits: request.resourceLimits,
    createdAt: new Date().toISOString(),
    artifacts: [],
    events: [],
    listeners: new Set(),
    outputBytes: 0,
    stdout: "",
    stderr: "",
  }

  jobs.set(id, job)
  emit(job, "status", { status: "queued" })
  void execute(job, request.code, request.testInput, request.expectedOutput)
  scheduleCleanup(job)

  return snapshot(job)
}

/** Starts a trusted worker-side fixture execution. This API never accepts data
 * from a browser; the worker loads both test input and expected output from
 * PostgreSQL. */
export function createJudgeExecution(input: {
  problemId: string
  language: ExecutionLanguage
  code: string
  testInput: string
  expectedOutput: string
  resourceLimits?: Partial<ResourceLimits>
}) {
  if (!getProblemWorkspace(input.problemId)) throw new ExecutionRequestError("Unknown problem workspace.", 400)
  if (!Object.hasOwn(LANGUAGE_CONFIG, input.language)) throw new ExecutionRequestError("Unsupported execution language.", 422)
  if (Buffer.byteLength(input.code, "utf8") > MAX_CODE_BYTES) throw new ExecutionRequestError("Code exceeds the 256 KiB submission limit.", 413)
  if (Buffer.byteLength(input.testInput, "utf8") > MAX_TEST_INPUT_BYTES) throw new ExecutionRequestError("Test input exceeds the 64 KiB limit.", 413)
  return createExecution({
    problemId: input.problemId,
    language: input.language,
    code: input.code,
    testInput: input.testInput,
    expectedOutput: input.expectedOutput,
    resourceLimits: normalizeLimits(input.resourceLimits),
  })
}

export function getExecution(id: string) {
  const job = jobs.get(id)
  return job ? snapshot(job) : undefined
}

export function subscribeToExecution(id: string, listener: JobListener) {
  const job = jobs.get(id)
  if (!job) return undefined

  job.listeners.add(listener)
  return () => job.listeners.delete(listener)
}

export async function waitForExecution(id: string): Promise<ExecutionJob> {
  const current = getExecution(id)
  if (!current) throw new ExecutionRequestError("Execution not found.", 404)
  if (isTerminal(current.status)) return current
  return new Promise<ExecutionJob>((resolve, reject) => {
    const unsubscribe = subscribeToExecution(id, (event) => {
      if (event.type !== "status") return
      const status = (event.payload as { status?: JobStatus }).status
      if (!status || !isTerminal(status)) return
      unsubscribe?.()
      const completed = getExecution(id)
      if (completed) resolve(completed)
      else reject(new ExecutionRequestError("Execution expired before completion.", 410))
    })
    const afterSubscribe = getExecution(id)
    if (afterSubscribe && isTerminal(afterSubscribe.status)) {
      unsubscribe?.()
      resolve(afterSubscribe)
    }
  })
}

export async function cancelExecution(id: string) {
  const job = jobs.get(id)
  if (!job) return undefined
  if (!isTerminal(job.status) && !job.finishing) {
    job.process?.kill("SIGTERM")
    await removeContainer(job.id)
    await complete(job, "cancelled", undefined, "Execution cancelled by user.")
  }
  return snapshot(job)
}

function normalizeLimits(input?: Partial<ResourceLimits>): ResourceLimits {
  return {
    cpuPercent: boundedNumber(input?.cpuPercent, DEFAULT_RESOURCE_LIMITS.cpuPercent, LIMIT_BOUNDS.cpuPercent),
    memoryMb: boundedNumber(input?.memoryMb, DEFAULT_RESOURCE_LIMITS.memoryMb, LIMIT_BOUNDS.memoryMb),
    timeoutSeconds: boundedNumber(
      input?.timeoutSeconds,
      DEFAULT_RESOURCE_LIMITS.timeoutSeconds,
      LIMIT_BOUNDS.timeoutSeconds,
    ),
  }
}

function boundedNumber(value: unknown, fallback: number, bounds: { min: number; max: number }) {
  if (value === undefined) return fallback
  if (typeof value !== "number" || !Number.isInteger(value) || value < bounds.min || value > bounds.max) {
    throw new ExecutionRequestError(`Resource limit must be an integer between ${bounds.min} and ${bounds.max}.`, 400)
  }
  return value
}

async function execute(job: ActiveJob, code: string, testInput?: string, expectedOutput?: string) {
  const config = LANGUAGE_CONFIG[job.language]
  const containerName = containerNameFor(job.id)

  try {
    job.workspace = await mkdtemp(join(tmpdir(), "codium-execution-"))
    // The container runs as the anonymous uid. The workspace is random, ephemeral, and contains
    // only the submission, so it is the sole writable bind mount exposed to that uid.
    await chmod(job.workspace, 0o777)
    await writeFile(join(job.workspace, config.fileName), code, { mode: 0o666 })
    if (testInput !== undefined) await writeFile(join(job.workspace, "test_input.txt"), testInput, { mode: 0o666 })

    // A user can cancel while the temporary workspace is being prepared.
    // Never allow that queued job to continue into Docker after cancellation.
    if (isTerminal(job.status) || job.finishing) {
      await rm(job.workspace, { recursive: true, force: true })
      return
    }

    job.status = "running"
    job.startedAt = new Date().toISOString()
    emit(job, "status", { status: "running", startedAt: job.startedAt })
    emit(job, "progress", { phase: "running", value: 20 })
    emit(job, "log", { level: "info", message: "Started isolated container with outbound network disabled." })

    const args = dockerRunArgs(containerName, job.workspace, config.image, config.command, job.limits)
    const child = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"], windowsHide: true, env: dockerEnvironment() })
    job.process = child
    job.metricsTimer = setInterval(() => void collectMetrics(job), 1000)

    child.stdout?.on("data", (chunk: Buffer) => emitOutput(job, "stdout", chunk.toString("utf8")))
    child.stderr?.on("data", (chunk: Buffer) => emitOutput(job, "stderr", chunk.toString("utf8")))
    child.on("error", (error) => {
      emit(job, "log", { level: "error", message: `Unable to start Docker: ${sanitize(error.message)}` })
    })

    job.timeout = setTimeout(() => {
      void timeoutExecution(job)
    }, job.limits.timeoutSeconds * 1000)

    const exitCode = await new Promise<number | null>((resolve) => child.once("close", resolve))
    if (!isTerminal(job.status) && !job.finishing) {
      await collectMetrics(job)
      const fixtureError = exitCode === 0 && expectedOutput !== undefined ? verifyFixtureOutput(job.stdout, expectedOutput) : undefined
      const status: JobStatus = exitCode === 0 && !fixtureError ? "succeeded" : "failed"
      await complete(job, status, exitCode === 0 && fixtureError ? 1 : exitCode ?? 1, fixtureError ?? (status === "failed" ? "Container process exited with an error." : undefined))
    }
  } catch (error) {
    if (!isTerminal(job.status)) {
      await complete(job, "failed", 1, error instanceof Error ? sanitize(error.message) : "Unable to run execution.")
    }
  }
}

async function timeoutExecution(job: ActiveJob) {
  if (isTerminal(job.status)) return
  emit(job, "log", { level: "warning", message: `Wall-time limit of ${job.limits.timeoutSeconds}s reached; stopping container.` })
  job.process?.kill("SIGTERM")
  await removeContainer(job.id)
  await complete(job, "timed_out", 124, `Execution exceeded the ${job.limits.timeoutSeconds}s wall-time limit.`)
}

async function complete(job: ActiveJob, status: JobStatus, exitCode?: number, error?: string) {
  if (isTerminal(job.status) || job.finishing) return
  job.finishing = true
  if (job.timeout) clearTimeout(job.timeout)
  if (job.metricsTimer) clearInterval(job.metricsTimer)

  job.status = status
  job.exitCode = exitCode
  job.error = error
  job.completedAt = new Date().toISOString()
  job.artifacts = await collectArtifacts(job.workspace)

  const level = status === "succeeded" ? "success" : status === "cancelled" ? "warning" : "error"
  emit(job, "progress", { phase: "complete", value: 100 })
  emit(job, "log", { level, message: error ?? "Execution completed successfully." })
  emit(job, "status", {
    status,
    exitCode,
    error,
    completedAt: job.completedAt,
    artifacts: job.artifacts.map(({ name, contentType, size }) => ({ name, contentType, size })),
  })

  if (job.workspace) await rm(job.workspace, { recursive: true, force: true })
}

function emitOutput(job: ActiveJob, type: "stdout" | "stderr", output: string) {
  const safeOutput = sanitize(output)
  if (!safeOutput || job.outputBytes >= MAX_OUTPUT_BYTES) return

  const remaining = MAX_OUTPUT_BYTES - job.outputBytes
  const truncated = Buffer.from(safeOutput, "utf8").subarray(0, remaining).toString("utf8")
  job.outputBytes += Buffer.byteLength(truncated, "utf8")
  if (type === "stdout") job.stdout += truncated
  else job.stderr += truncated
  emit(job, type, { text: truncated })

  if (truncated.length < safeOutput.length) {
    emit(job, "log", { level: "warning", message: "Output was truncated at 256 KiB." })
  }
}

async function collectMetrics(job: ActiveJob) {
  if (job.status !== "running") return
  try {
    const { stdout } = await execFileAsync(
      "docker",
      ["stats", "--no-stream", "--format", "{{json .}}", containerNameFor(job.id)],
      { timeout: 1500, maxBuffer: 16 * 1024, env: dockerEnvironment() },
    )
    const parsed = JSON.parse(stdout.trim()) as Record<string, string>
    const metrics: ExecutionMetrics = {
      cpuPercent: parsePercent(parsed.CPUPerc),
      memoryMb: parseMemory(parsed.MemUsage?.split("/")[0]),
      memoryLimitMb: job.limits.memoryMb,
      networkBytes: parseIo(parsed.NetIO),
      diskBytes: parseIo(parsed.BlockIO),
    }
    emit(job, "metrics", metrics)
  } catch {
    // The container may finish between the status check and docker stats. Metrics are best-effort.
  }
}

function dockerRunArgs(
  name: string,
  workspace: string,
  image: string,
  command: string[],
  limits: ResourceLimits,
) {
  return [
    "run",
    "--rm",
    "--init",
    "--name",
    name,
    "--network",
    "none",
    "--read-only",
    "--tmpfs",
    "/tmp:rw,noexec,nosuid,nodev,size=64m",
    "--pids-limit",
    "64",
    "--memory",
    `${limits.memoryMb}m`,
    "--memory-swap",
    `${limits.memoryMb}m`,
    "--cpus",
    `${limits.cpuPercent / 100}`,
    "--ulimit",
    "nofile=64:64",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges=true",
    "--user",
    "65534:65534",
    "--workdir",
    "/workspace",
    "--mount",
    `type=bind,source=${workspace},target=/workspace,bind-propagation=rprivate`,
    "--env",
    "HOME=/tmp",
    "--env",
    "PYTHONUNBUFFERED=1",
    "--env",
    "PYTHONDONTWRITEBYTECODE=1",
    image,
    ...command,
  ]
}

async function collectArtifacts(workspace?: string): Promise<JobArtifact[]> {
  if (!workspace) return []
  try {
    const files = await readdir(workspace)
    if (!files.includes("results.json")) return []

    const location = join(workspace, "results.json")
    const stats = await lstat(location)
    if (!stats.isFile() || stats.isSymbolicLink() || stats.size > MAX_ARTIFACT_BYTES) return []

    const content = await readFile(location, "utf8")
    JSON.parse(content)
    return [{ name: "results.json", contentType: "application/json", content, size: stats.size }]
  } catch {
    return []
  }
}

async function removeContainer(jobId: string) {
  try {
    await execFileAsync("docker", ["rm", "--force", containerNameFor(jobId)], { timeout: 3000, maxBuffer: 16 * 1024, env: dockerEnvironment() })
  } catch {
    // Docker removes containers that have already exited; cancellation remains idempotent.
  }
}

function emit(job: ActiveJob, type: ExecutionEvent["type"], payload: unknown) {
  const event: ExecutionEvent = {
    id: job.events.length + 1,
    type,
    payload,
    timestamp: new Date().toISOString(),
  }
  job.events.push(event)
  for (const listener of job.listeners) listener(event)
}

function snapshot(job: ActiveJob): ExecutionJob {
  const { listeners: _listeners, process: _process, workspace: _workspace, outputBytes: _outputBytes, timeout: _timeout, metricsTimer: _metricsTimer, finishing: _finishing, stdout: _stdout, stderr: _stderr, ...snapshot } = job
  return { ...snapshot, artifacts: [...job.artifacts], events: [...job.events] }
}

function scheduleCleanup(job: ActiveJob) {
  setTimeout(() => {
    if (isTerminal(job.status)) jobs.delete(job.id)
  }, JOB_RETENTION_MS).unref()
}

function containerNameFor(jobId: string) {
  return `codium-${jobId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32)}`
}

function isTerminal(status: JobStatus) {
  return status === "succeeded" || status === "failed" || status === "timed_out" || status === "cancelled"
}

function sanitize(value: string) {
  return value
    .replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
}

function parsePercent(value?: string) {
  const parsed = Number.parseFloat(value ?? "0")
  return Number.isFinite(parsed) ? parsed : 0
}

function parseMemory(value?: string) {
  if (!value) return 0
  const matched = value.trim().match(/^([\d.]+)\s*([KMGT]?i?B)?$/i)
  if (!matched) return 0
  const amount = Number.parseFloat(matched[1])
  const unit = (matched[2] ?? "B").toUpperCase()
  const multipliers: Record<string, number> = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, KIB: 1024, MIB: 1024 ** 2, GIB: 1024 ** 3 }
  return (amount * (multipliers[unit] ?? 1)) / 1024 ** 2
}

function parseIo(value?: string) {
  if (!value) return 0
  return value.split("/").reduce((total, part) => total + parseMemory(part) * 1024 ** 2, 0)
}

function verifyFixtureOutput(actual: string, expected: string) {
  if (normalizeOutput(actual) === normalizeOutput(expected)) return undefined
  return "Output did not match the canonical fixture expected output."
}

function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, "\n").trimEnd()
}

function dockerEnvironment() {
  const configuredHost = process.env.RUNNER_DOCKER_HOST
  // Codex and other desktop setups can leave DOCKER_HOST pointing at a stopped Docker Desktop socket.
  // Prefer an explicitly configured host, and transparently use the Linux daemon when that stale socket is detected.
  const inheritedHost = process.env.DOCKER_HOST
  const fallbackHost = inheritedHost?.includes(".docker/desktop") && existsSync("/var/run/docker.sock") ? "unix:///var/run/docker.sock" : inheritedHost
  return { ...process.env, DOCKER_HOST: configuredHost ?? fallbackHost }
}

// Retained for a gateway integration that validates a server-side token before forwarding requests.
export function tokenMatches(value: string | null, expected: string) {
  if (!value) return false
  const provided = Buffer.from(value)
  const configured = Buffer.from(expected)
  return provided.length === configured.length && timingSafeEqual(provided, configured)
}
