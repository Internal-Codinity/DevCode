import { NextResponse } from "next/server"
import { getProblemWorkspace } from "@/lib/execution/problem-workspaces"

export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ problemId: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const workspace = getProblemWorkspace((await params).problemId)
  if (!workspace) return NextResponse.json({ error: "Problem workspace not found." }, { status: 404 })

  return NextResponse.json({
    files: workspace.map(({ name, contentType, content }) => ({ name, contentType, size: Buffer.byteLength(content, "utf8") })),
  })
}
