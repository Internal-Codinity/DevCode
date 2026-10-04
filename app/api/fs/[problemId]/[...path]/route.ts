import { NextResponse } from "next/server"
import { getWorkspaceFile } from "@/lib/execution/problem-workspaces"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ problemId: string; path: string[] }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { problemId, path } = await params
  if (path.length !== 1) return NextResponse.json({ error: "Nested paths are not available." }, { status: 404 })

  const file = getWorkspaceFile(problemId, path[0])
  if (!file) return NextResponse.json({ error: "Workspace file not found." }, { status: 404 })

  return NextResponse.json(file)
}
