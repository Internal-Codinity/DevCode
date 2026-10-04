import { NextResponse } from "next/server"
import { assertSameOrigin, AuthenticationError, requireUser } from "@/lib/auth/session"
import { getSubmissionForUser, requestSubmissionCancellation } from "@/lib/submissions/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser()
    const submission = await getSubmissionForUser((await params).id, user.id)
    if (!submission) return NextResponse.json({ error: "Submission not found." }, { status: 404 })
    return NextResponse.json({ submission })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    assertSameOrigin(request)
    const user = await requireUser()
    const submission = await requestSubmissionCancellation((await params).id, user.id)
    if (!submission) return NextResponse.json({ error: "Submission cannot be cancelled." }, { status: 409 })
    return NextResponse.json({ submission })
  } catch (error) {
    return errorResponse(error)
  }
}

function errorResponse(error: unknown) {
  if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 })
  console.error("Submission detail API failure", error)
  return NextResponse.json({ error: "Submission service is unavailable." }, { status: 503 })
}
