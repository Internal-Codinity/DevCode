import { NextResponse } from "next/server"
import { AuthenticationError, requireUser } from "@/lib/auth/session"
import { getSubmissionSourceForUser } from "@/lib/submissions/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser()
    const source = await getSubmissionSourceForUser((await params).id, user.id)
    if (!source) return NextResponse.json({ error: "Submission not found." }, { status: 404 })
    return NextResponse.json(source)
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 })
    console.error("Submission source API failure", error)
    return NextResponse.json({ error: "Submission service is unavailable." }, { status: 503 })
  }
}
