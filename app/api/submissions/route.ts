import { NextResponse } from "next/server"
import { z } from "zod"
import { assertSameOrigin, AuthenticationError, requireUser } from "@/lib/auth/session"
import { createSubmission, listSubmissions, SubmissionNotFoundError, SubmissionRateLimitError } from "@/lib/submissions/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const submissionSchema = z.object({
  problemId: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  language: z.enum(["python", "javascript"]),
  sourceCode: z.string().min(1).max(256 * 1024).refine((value) => value.trim().length > 0),
  judgeScope: z.enum(["sample", "all"]).default("all"),
}).strict()

export async function GET(request: Request) {
  try {
    const user = await requireUser()
    const problemId = new URL(request.url).searchParams.get("problemId") ?? undefined
    if (problemId && !/^[a-z0-9-]{1,120}$/.test(problemId)) return NextResponse.json({ error: "Invalid problem id." }, { status: 422 })
    return NextResponse.json({ submissions: await listSubmissions(user.id, problemId) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const user = await requireUser()
    const body = submissionSchema.parse(await request.json())
    if (Buffer.byteLength(body.sourceCode, "utf8") > 256 * 1024) return NextResponse.json({ error: "Code exceeds the 256 KiB submission limit." }, { status: 413 })
    const submission = await createSubmission({ userId: user.id, ...body })
    return NextResponse.json({ submission }, { status: 202 })
  } catch (error) {
    return errorResponse(error)
  }
}

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 })
  if (error instanceof SubmissionNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 })
  if (error instanceof SubmissionRateLimitError) return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": "60" } })
  if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid submission." }, { status: 422 })
  console.error("Submission API failure", error)
  return NextResponse.json({ error: "Submission service is unavailable." }, { status: 503 })
}
