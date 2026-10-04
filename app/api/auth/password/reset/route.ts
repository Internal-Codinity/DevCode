import { NextResponse } from "next/server"
import { z } from "zod"
import { assertSameOrigin } from "@/lib/auth/session"
import { AuthValidationError, resetPassword } from "@/lib/auth/service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({ token: z.string().min(20).max(200), password: z.string() }).strict()

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const { token, password } = bodySchema.parse(await request.json())
    await resetPassword(token, password)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthValidationError || error instanceof z.ZodError) return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid reset request." }, { status: 422 })
    console.error("Password reset failed", error)
    return NextResponse.json({ error: "Unable to reset the password." }, { status: 503 })
  }
}
