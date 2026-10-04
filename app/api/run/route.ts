import { NextResponse } from "next/server"
import {
  ExecutionRequestError,
  assertRunnerAvailable,
  createExecution,
  enforceRateLimit,
  tokenMatches,
  validateRunRequest,
} from "@/lib/execution/runner"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Direct execution is disabled. Submit through the authenticated judge." }, { status: 410 })
    }
    assertGatewayAuthentication(request)
    assertRunnerAvailable()
    enforceRateLimit(clientKey(request))
    const job = createExecution(validateRunRequest(await request.json()))
    return NextResponse.json({ jobId: job.id, status: job.status }, { status: 202 })
  } catch (error) {
    return errorResponse(error)
  }
}

function assertGatewayAuthentication(request: Request) {
  if (process.env.NODE_ENV !== "production") return

  const expectedToken = process.env.RUNNER_GATEWAY_TOKEN
  if (!expectedToken || !tokenMatches(request.headers.get("x-codium-runner-token"), expectedToken)) {
    throw new ExecutionRequestError("Authentication is required to execute code.", 401)
  }
}

function clientKey(request: Request) {
  if (process.env.RUNNER_TRUSTED_GATEWAY === "true") {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  }
  return "local"
}

function errorResponse(error: unknown) {
  if (error instanceof ExecutionRequestError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  return NextResponse.json({ error: "Unable to start execution." }, { status: 500 })
}
