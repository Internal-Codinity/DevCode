import { NextResponse } from "next/server"
import { listPublishedProblems } from "@/lib/problems/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return NextResponse.json({ problems: await listPublishedProblems() })
  } catch (error) {
    console.error("Unable to list problems", error)
    return NextResponse.json({ error: "Problem catalog is unavailable." }, { status: 503 })
  }
}
