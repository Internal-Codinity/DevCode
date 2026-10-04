import { NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/auth/session"
import { AuthValidationError, verifyEmail } from "@/lib/auth/service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const fallback = new URL("/login?verification=invalid", request.url)
  const token = new URL(request.url).searchParams.get("token")
  if (!token) return NextResponse.redirect(fallback)
  try {
    const userId = await verifyEmail(token)
    const session = await createSession(userId, request)
    await setSessionCookie(session.token, session.expiresAt)
    return NextResponse.redirect(new URL("/problems?verification=complete", request.url))
  } catch (error) {
    if (!(error instanceof AuthValidationError)) console.error("Email verification failed", error)
    return NextResponse.redirect(fallback)
  }
}
