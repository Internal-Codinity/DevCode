import { randomUUID } from "node:crypto"
import type { PoolClient } from "pg"
import { query, transaction } from "@/lib/db"
import type { ExecutionLanguage } from "@/lib/execution/contracts"

export type SubmissionStatus = "queued" | "running" | "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "cancelled" | "internal_error"

export interface SubmissionSummary {
  id: string
  problemId: string
  language: ExecutionLanguage
  status: SubmissionStatus
  verdictMessage: string | null
  testsTotal: number
  testsPassed: number
  runtimeMs: number | null
  memoryKb: number | null
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  judgeScope: "sample" | "all"
}

export interface SubmissionForWorker extends SubmissionSummary {
  userId: string
  sourceCode: string
  cancelRequestedAt: string | null
}

export interface JudgeFixture {
  id: string
  ordinal: number
  input: string
  expectedOutput: string
}

const submissionFields = `id, problem_id AS "problemId", language, status, verdict_message AS "verdictMessage",
  tests_total AS "testsTotal", tests_passed AS "testsPassed", runtime_ms AS "runtimeMs", memory_kb AS "memoryKb",
  created_at AS "createdAt", started_at AS "startedAt", completed_at AS "completedAt", judge_scope AS "judgeScope"`

export async function createSubmission(input: { userId: string; problemId: string; language: ExecutionLanguage; sourceCode: string; judgeScope: "sample" | "all" }) {
  return transaction(async (client) => {
    // Serialize limits for a user. A plain count without this lock lets several
    // simultaneous requests all observe the same value and bypass the limit.
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1::text, 0))", [input.userId])
    const recent = await client.query<{ minute: string; hour: string; active: string }>(
      `SELECT
         COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 minute')::text AS minute,
         COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')::text AS hour,
         COUNT(*) FILTER (WHERE status IN ('queued', 'running'))::text AS active
       FROM submissions WHERE user_id = $1`,
      [input.userId],
    )
    const limits = recent.rows[0]
    if (Number(limits?.minute ?? 0) >= 12 || Number(limits?.hour ?? 0) >= 120 || Number(limits?.active ?? 0) >= 3) {
      throw new SubmissionRateLimitError()
    }
    const problem = await client.query("SELECT id FROM problems WHERE id = $1 AND is_published = TRUE", [input.problemId])
    if (!problem.rowCount) throw new SubmissionNotFoundError("Problem not found.")
    const count = await client.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM problem_test_cases WHERE problem_id = $1 AND ($2 = 'all' OR visibility = 'sample')", [input.problemId, input.judgeScope])
    const testsTotal = Number(count.rows[0]?.count ?? 0)
    if (!testsTotal) throw new Error("This problem has no judge fixtures configured.")
    const id = randomUUID()
    const result = await client.query<SubmissionSummary>(
      `INSERT INTO submissions (id, user_id, problem_id, language, source_code, judge_scope, status, tests_total)
       VALUES ($1, $2, $3, $4, $5, $6, 'queued', $7)
       RETURNING ${submissionFields}`,
      [id, input.userId, input.problemId, input.language, input.sourceCode, input.judgeScope, testsTotal],
    )
    await appendEvent(client, id, "status", { status: "queued", testsTotal })
    return result.rows[0]
  })
}

export async function listSubmissions(userId: string, problemId?: string) {
  const result = problemId
    ? await query<SubmissionSummary>(`SELECT ${submissionFields} FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY created_at DESC LIMIT 100`, [userId, problemId])
    : await query<SubmissionSummary>(`SELECT ${submissionFields} FROM submissions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`, [userId])
  return result.rows
}

export async function getSubmissionForUser(id: string, userId: string) {
  const result = await query<SubmissionSummary>(`SELECT ${submissionFields} FROM submissions WHERE id = $1 AND user_id = $2 LIMIT 1`, [id, userId])
  return result.rows[0] ?? null
}

export async function getSubmissionSourceForUser(id: string, userId: string) {
  const result = await query<{ sourceCode: string; language: ExecutionLanguage }>("SELECT source_code AS \"sourceCode\", language FROM submissions WHERE id = $1 AND user_id = $2 LIMIT 1", [id, userId])
  return result.rows[0] ?? null
}

export async function getSubmissionEventsForUser(id: string, userId: string, afterId = 0) {
  const result = await query<{ id: string; type: "status" | "progress" | "test" | "complete"; payload: unknown; createdAt: string }>(
    `SELECT submission_events.id::text AS id, submission_events.type, submission_events.payload, submission_events.created_at AS "createdAt"
     FROM submission_events JOIN submissions ON submissions.id = submission_events.submission_id
     WHERE submission_events.submission_id = $1 AND submissions.user_id = $2 AND submission_events.id > $3
     ORDER BY submission_events.id ASC`,
    [id, userId, afterId],
  )
  return result.rows
}

export async function requestSubmissionCancellation(id: string, userId: string) {
  return transaction(async (client) => {
    const result = await client.query<SubmissionSummary>(
      `UPDATE submissions SET cancel_requested_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status IN ('queued', 'running')
       RETURNING ${submissionFields}`,
      [id, userId],
    )
    const submission = result.rows[0]
    if (!submission) return null
    if (submission.status === "queued") {
      const cancelled = await client.query<SubmissionSummary>(
        `UPDATE submissions SET status = 'cancelled', verdict_message = 'Submission cancelled by user.', completed_at = NOW(), updated_at = NOW()
         WHERE id = $1 RETURNING ${submissionFields}`,
        [id],
      )
      await appendEvent(client, id, "complete", { status: "cancelled", testsPassed: 0, testsTotal: submission.testsTotal })
      return cancelled.rows[0]
    }
    await appendEvent(client, id, "status", { status: "running", cancellationRequested: true })
    return submission
  })
}

export async function claimNextSubmission(workerId: string): Promise<SubmissionForWorker | null> {
  return transaction(async (client) => {
    const result = await client.query<SubmissionForWorker>(
      `WITH candidate AS (
         SELECT id FROM submissions
         WHERE status = 'queued' OR (status = 'running' AND lease_expires_at < NOW())
         ORDER BY created_at ASC
         FOR UPDATE SKIP LOCKED
         LIMIT 1
       )
       UPDATE submissions
       SET status = 'running', worker_id = $1, started_at = COALESCE(started_at, NOW()),
           lease_expires_at = NOW() + INTERVAL '45 seconds', attempt_count = attempt_count + 1, updated_at = NOW()
       FROM candidate WHERE submissions.id = candidate.id
       RETURNING submissions.id, submissions.user_id AS "userId", submissions.problem_id AS "problemId", submissions.language,
         submissions.source_code AS "sourceCode", submissions.status, submissions.verdict_message AS "verdictMessage",
         submissions.tests_total AS "testsTotal", submissions.tests_passed AS "testsPassed", submissions.runtime_ms AS "runtimeMs",
         submissions.memory_kb AS "memoryKb", submissions.created_at AS "createdAt", submissions.started_at AS "startedAt",
         submissions.completed_at AS "completedAt", submissions.cancel_requested_at AS "cancelRequestedAt", submissions.judge_scope AS "judgeScope"`,
      [workerId],
    )
    const submission = result.rows[0]
    if (submission) await appendEvent(client, submission.id, "status", { status: "running", testsTotal: submission.testsTotal })
    return submission ?? null
  })
}

export async function getJudgeFixtures(problemId: string, judgeScope: "sample" | "all") {
  const result = await query<JudgeFixture>(
    `SELECT id, ordinal, input, expected_output AS "expectedOutput"
     FROM problem_test_cases WHERE problem_id = $1 AND ($2 = 'all' OR visibility = 'sample') ORDER BY ordinal ASC`,
    [problemId, judgeScope],
  )
  return result.rows
}

export async function isCancellationRequested(id: string) {
  const result = await query<{ cancelRequestedAt: string | null }>("SELECT cancel_requested_at AS \"cancelRequestedAt\" FROM submissions WHERE id = $1 LIMIT 1", [id])
  return Boolean(result.rows[0]?.cancelRequestedAt)
}

export async function renewSubmissionLease(id: string, workerId: string) {
  const result = await query(
    "UPDATE submissions SET lease_expires_at = NOW() + INTERVAL '45 seconds', updated_at = NOW() WHERE id = $1 AND worker_id = $2 AND status = 'running'",
    [id, workerId],
  )
  return Boolean(result.rowCount)
}

export async function recordJudgeResult(input: { submissionId: string; workerId: string; fixture: JudgeFixture; status: "passed" | "failed" | "runtime_error" | "timed_out" | "cancelled"; runtimeMs: number | null; memoryKb: number | null; stderr?: string }) {
  return transaction(async (client) => {
    const ownership = await client.query(
      "SELECT id FROM submissions WHERE id = $1 AND worker_id = $2 AND status = 'running' FOR UPDATE",
      [input.submissionId, input.workerId],
    )
    if (!ownership.rowCount) throw new SubmissionLeaseLostError()

    const inserted = await client.query(
      `INSERT INTO submission_test_results (id, submission_id, test_case_id, ordinal, status, runtime_ms, memory_kb, stderr)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (submission_id, test_case_id) DO NOTHING
       RETURNING id`,
      [randomUUID(), input.submissionId, input.fixture.id, input.fixture.ordinal, input.status, input.runtimeMs, input.memoryKb, input.stderr?.slice(0, 16 * 1024) ?? null],
    )
    const passed = await client.query<{ count: string }>("SELECT COUNT(*) FILTER (WHERE status = 'passed')::text AS count FROM submission_test_results WHERE submission_id = $1", [input.submissionId])
    const testsPassed = Number(passed.rows[0]?.count ?? 0)
    await client.query("UPDATE submissions SET tests_passed = $2, updated_at = NOW() WHERE id = $1", [input.submissionId, testsPassed])
    if (inserted.rowCount) await appendEvent(client, input.submissionId, "test", { ordinal: input.fixture.ordinal + 1, status: input.status, testsPassed })
    return testsPassed
  })
}

export async function completeSubmission(input: { id: string; workerId: string; status: Exclude<SubmissionStatus, "queued" | "running">; testsPassed: number; runtimeMs: number; memoryKb: number | null; verdictMessage?: string }) {
  return transaction(async (client) => {
    const result = await client.query<SubmissionSummary>(
      `UPDATE submissions SET
         status = CASE WHEN cancel_requested_at IS NOT NULL AND $2 <> 'cancelled' THEN 'cancelled' ELSE $2 END,
         tests_passed = $3,
         runtime_ms = $4,
         memory_kb = $5,
         verdict_message = CASE WHEN cancel_requested_at IS NOT NULL AND $2 <> 'cancelled' THEN 'Submission cancelled by user.' ELSE $6 END,
         completed_at = NOW(), lease_expires_at = NULL, updated_at = NOW()
       WHERE id = $1 AND worker_id = $7 AND status = 'running'
       RETURNING ${submissionFields}`,
      [input.id, input.status, input.testsPassed, input.runtimeMs, input.memoryKb, input.verdictMessage ?? null, input.workerId],
    )
    const submission = result.rows[0]
    if (!submission) throw new SubmissionLeaseLostError()
    await appendEvent(client, input.id, "complete", { status: submission.status, testsPassed: submission.testsPassed, testsTotal: submission.testsTotal, runtimeMs: submission.runtimeMs, memoryKb: submission.memoryKb })
    return submission
  })
}

export async function failSubmissionInternally(id: string, workerId: string, message: string) {
  return completeSubmission({ id, workerId, status: "internal_error", testsPassed: 0, runtimeMs: 0, memoryKb: null, verdictMessage: message })
}

async function appendEvent(client: PoolClient, submissionId: string, type: "status" | "progress" | "test" | "complete", payload: Record<string, unknown>) {
  await client.query("INSERT INTO submission_events (submission_id, type, payload) VALUES ($1, $2, $3::jsonb)", [submissionId, type, JSON.stringify(payload)])
}

export class SubmissionNotFoundError extends Error {}
export class SubmissionRateLimitError extends Error {
  constructor() {
    super("Too many submissions. Wait for a running submission to finish, then try again.")
  }
}
export class SubmissionLeaseLostError extends Error {}
