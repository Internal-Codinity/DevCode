import { NextResponse } from "next/server"
import { assertSameOrigin, revokeCurrentSession } from "@/lib/auth/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    await revokeCurrentSession()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unable to sign out." }, { status: 400 })
  }
}
