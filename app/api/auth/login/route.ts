import { NextResponse } from "next/server"
import { z } from "zod"
import { assertSameOrigin, createSession, setSessionCookie } from "@/lib/auth/session"
import { AuthRateLimitError, AuthValidationError, EmailVerificationRequiredError, authenticateUser } from "@/lib/auth/service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({ email: z.string(), password: z.string() }).strict()

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const body = bodySchema.parse(await request.json())
    const user = await authenticateUser(body, request)
    const session = await createSession(user.id, request)
    await setSessionCookie(session.token, session.expiresAt)
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof EmailVerificationRequiredError) return NextResponse.json({ error: "Verify your email before signing in.", code: "EMAIL_UNVERIFIED" }, { status: 403 })
    if (error instanceof AuthRateLimitError) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
    if (error instanceof AuthValidationError || error instanceof z.ZodError) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
    console.error("Login failed", error)
    return NextResponse.json({ error: "Unable to sign in." }, { status: 503 })
  }
}
