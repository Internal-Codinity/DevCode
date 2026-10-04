import { NextResponse } from "next/server"
import { findPublishedProblem } from "@/lib/problems/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const problem = await findPublishedProblem((await params).id)
    if (!problem) return NextResponse.json({ error: "Problem not found." }, { status: 404 })
    return NextResponse.json({ problem })
  } catch (error) {
    console.error("Unable to load problem", error)
    return NextResponse.json({ error: "Problem catalog is unavailable." }, { status: 503 })
  }
}
