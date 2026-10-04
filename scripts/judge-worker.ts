import { hostname } from "node:os"
import {
  assertJudgeWorkerAvailable,
  assertJudgeRuntimeReady,
  cancelExecution,
  createJudgeExecution,
  waitForExecution,
} from "../lib/execution/runner"
import type { ExecutionEvent, ExecutionJob, JobStatus } from "../lib/execution/contracts"
import {
  claimNextSubmission,
  completeSubmission,
  getJudgeFixtures,
  isCancellationRequested,
  recordJudgeResult,
  renewSubmissionLease,
  SubmissionLeaseLostError,
  type JudgeFixture,
  type SubmissionForWorker,
} from "../lib/submissions/repository"

const workerId = process.env.JUDGE_WORKER_ID ?? `${hostname()}:${process.pid}`
const pollDelayMs = Number(process.env.JUDGE_POLL_DELAY_MS ?? 750)
let stopping = false

process.on("SIGINT", () => { stopping = true })
process.on("SIGTERM", () => { stopping = true })

async function main() {
  assertJudgeWorkerAvailable()
  await assertJudgeRuntimeReady()
  console.info(`Codura judge worker ${workerId} is ready.`)
  while (!stopping) {
    const submission = await claimNextSubmission(workerId)
    if (!submission) {
      await delay(pollDelayMs)
      continue
    }
    try {
      await gradeSubmission(submission)
    } catch (error) {
      if (error instanceof SubmissionLeaseLostError) {
        console.warn(`Submission ${submission.id} was reclaimed by another worker; stopping this attempt.`)
        continue
      }
      console.error(`Submission ${submission.id} failed in the judge worker`, error)
      await completeSubmission({
        id: submission.id,
        workerId,
        status: "internal_error",
        testsPassed: submission.testsPassed,
        runtimeMs: 0,
        memoryKb: null,
        verdictMessage: "The judge encountered an internal error. Please resubmit.",
      })
    }
  }
  console.info(`Codura judge worker ${workerId} stopped.`)
}

void main().catch((error) => { console.error(error); process.exitCode = 1 })

async function gradeSubmission(submission: SubmissionForWorker) {
  const fixtures = await getJudgeFixtures(submission.problemId, submission.judgeScope)
  const started = Date.now()
  let testsPassed = submission.testsPassed
  let maximumMemoryKb: number | null = null
  let finalStatus: "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "cancelled" = "accepted"
  let verdictMessage: string | undefined

  for (const fixture of fixtures) {
    if (await isCancellationRequested(submission.id)) {
      finalStatus = "cancelled"
      verdictMessage = "Submission cancelled by user."
      break
    }

    if (!(await renewSubmissionLease(submission.id, workerId))) throw new SubmissionLeaseLostError()
    const outcome = await executeFixture(submission, fixture)
    if (outcome.leaseLost) throw new SubmissionLeaseLostError()
    if (outcome.memoryKb !== null) maximumMemoryKb = Math.max(maximumMemoryKb ?? 0, outcome.memoryKb)
    const recorded = await recordJudgeResult({
      submissionId: submission.id,
      workerId,
      fixture,
      status: outcome.status,
      runtimeMs: outcome.runtimeMs,
      memoryKb: outcome.memoryKb,
      stderr: outcome.stderr,
    })
    testsPassed = recorded
    if (outcome.status !== "passed") {
      finalStatus = outcome.status === "failed" ? "wrong_answer" : outcome.status === "runtime_error" ? "runtime_error" : outcome.status === "timed_out" ? "time_limit_exceeded" : "cancelled"
      verdictMessage = outcome.status === "failed" ? "Your program produced an incorrect result." : outcome.status === "runtime_error" ? "Your program exited with an error." : outcome.status === "timed_out" ? "Your program exceeded the time limit." : "Submission cancelled by user."
      break
    }
  }

  await completeSubmission({
    id: submission.id,
    workerId,
    status: finalStatus,
    testsPassed,
    runtimeMs: Date.now() - started,
    memoryKb: maximumMemoryKb,
    verdictMessage,
  })
}

async function executeFixture(submission: SubmissionForWorker, fixture: JudgeFixture) {
  const job = createJudgeExecution({
    problemId: submission.problemId,
    language: submission.language,
    code: submission.sourceCode,
    testInput: fixture.input,
    expectedOutput: fixture.expectedOutput,
  })
  const started = Date.now()
  let cancellationObserved = false
  let leaseLost = false
  const heartbeat = setInterval(() => {
    void renewSubmissionLease(submission.id, workerId).then((renewed) => {
      if (!renewed) {
        leaseLost = true
        void cancelExecution(job.id)
      }
    }).catch(() => {
      leaseLost = true
      void cancelExecution(job.id)
    })
    void isCancellationRequested(submission.id).then((requested) => {
      if (requested) {
        cancellationObserved = true
        void cancelExecution(job.id)
      }
    })
  }, 2_000)

  try {
    const completed = await waitForExecution(job.id)
    const metrics = latestMetrics(completed.events)
    const stderr = completed.events
      .filter((event) => event.type === "stderr")
      .map((event) => (event.payload as { text?: string }).text ?? "")
      .join("")
    return {
      status: cancellationObserved || completed.status === "cancelled" ? "cancelled" as const : mapJobStatus(completed.status, completed.error),
      leaseLost,
      runtimeMs: Date.now() - started,
      memoryKb: metrics?.memoryMb === undefined ? null : Math.round(metrics.memoryMb * 1024),
      stderr,
    }
  } finally {
    clearInterval(heartbeat)
  }
}

function mapJobStatus(status: JobStatus, error?: string) {
  if (status === "succeeded") return "passed" as const
  if (status === "timed_out") return "timed_out" as const
  if (status === "cancelled") return "cancelled" as const
  if (error === "Output did not match the canonical fixture expected output.") return "failed" as const
  return "runtime_error" as const
}

function latestMetrics(events: ExecutionEvent[]) {
  const event = [...events].reverse().find((item) => item.type === "metrics")
  return event?.payload as { memoryMb?: number } | undefined
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
