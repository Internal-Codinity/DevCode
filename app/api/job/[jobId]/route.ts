import { NextResponse } from "next/server"
import { ExecutionRequestError, cancelExecution, getExecution, tokenMatches } from "@/lib/execution/runner"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ jobId: string }>
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Direct execution is disabled." }, { status: 410 })
    assertGatewayAuthentication(request)
    const job = getExecution((await params).jobId)
    if (!job) return NextResponse.json({ error: "Execution not found." }, { status: 404 })
    return NextResponse.json(job)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Direct execution is disabled." }, { status: 410 })
    assertGatewayAuthentication(request)
    const job = await cancelExecution((await params).jobId)
    if (!job) return NextResponse.json({ error: "Execution not found." }, { status: 404 })
    return NextResponse.json(job)
  } catch (error) {
    return errorResponse(error)
  }
}

function assertGatewayAuthentication(request: Request) {
  if (process.env.NODE_ENV !== "production") return
  const expectedToken = process.env.RUNNER_GATEWAY_TOKEN
  if (!expectedToken || !tokenMatches(request.headers.get("x-codium-runner-token"), expectedToken)) {
    throw new ExecutionRequestError("Authentication is required to access executions.", 401)
  }
}

function errorResponse(error: unknown) {
  if (error instanceof ExecutionRequestError) return NextResponse.json({ error: error.message }, { status: error.status })
  return NextResponse.json({ error: "Unable to access execution." }, { status: 500 })
}
