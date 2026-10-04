import { NextResponse } from "next/server"
import { z } from "zod"
import { assertSameOrigin } from "@/lib/auth/session"
import { AuthConflictError, AuthRateLimitError, AuthValidationError, registerUser } from "@/lib/auth/service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({ email: z.string(), displayName: z.string(), password: z.string() }).strict()

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const body = bodySchema.parse(await request.json())
    const created = await registerUser(body, request)
    return NextResponse.json({ user: created.user, developmentVerificationUrl: created.developmentVerificationUrl }, { status: 202 })
  } catch (error) {
    return authError(error)
  }
}

function authError(error: unknown) {
  if (error instanceof AuthConflictError) return NextResponse.json({ error: error.message }, { status: 409 })
  if (error instanceof AuthRateLimitError) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
  if (error instanceof AuthValidationError || error instanceof z.ZodError) return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid registration." }, { status: 422 })
  console.error("Registration failed", error)
  return NextResponse.json({ error: "Unable to create the account." }, { status: 503 })
}
