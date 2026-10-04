import { NextResponse } from "next/server"
import { z } from "zod"
import { assertSameOrigin } from "@/lib/auth/session"
import { AuthRateLimitError, AuthValidationError, requestPasswordReset } from "@/lib/auth/service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({ email: z.string() }).strict()

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const { email } = bodySchema.parse(await request.json())
    const developmentResetUrl = await requestPasswordReset(email, request)
    return NextResponse.json({ ok: true, developmentResetUrl })
  } catch (error) {
    if (error instanceof AuthRateLimitError) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
    if (error instanceof AuthValidationError || error instanceof z.ZodError) return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 })
    console.error("Password reset request failed", error)
    return NextResponse.json({ error: "Unable to process the request." }, { status: 503 })
  }
}
