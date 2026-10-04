import { ExecutionRequestError, getExecution, subscribeToExecution, tokenMatches } from "@/lib/execution/runner"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{ jobId: string }>
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    if (process.env.NODE_ENV === "production") return Response.json({ error: "Direct execution is disabled." }, { status: 410 })
    assertGatewayAuthentication(request)
    const jobId = (await params).jobId
    if (!getExecution(jobId)) return Response.json({ error: "Execution not found." }, { status: 404 })

    const encoder = new TextEncoder()
    let unsubscribe: (() => void) | undefined
    let heartbeat: ReturnType<typeof setInterval> | undefined
    let closed = false

    const stream = new ReadableStream({
      start(controller) {
        const send = (value: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(value)}\n\n`))
        const close = () => {
          if (closed) return
          closed = true
          if (heartbeat) clearInterval(heartbeat)
          unsubscribe?.()
          controller.close()
        }
        const listener = (event: { type: string; payload: unknown }) => {
          if (closed) return
          send(event)
          if (event.type === "status") {
            const status = (event.payload as { status?: string }).status
            if (["succeeded", "failed", "timed_out", "cancelled"].includes(status ?? "")) close()
          }
        }
        unsubscribe = subscribeToExecution(jobId, listener)

        // Send the full in-memory history after subscribing. Clients de-duplicate by event id,
        // which closes the narrow race between attaching and replaying events.
        for (const event of getExecution(jobId)?.events ?? []) listener(event)
        if (!closed) heartbeat = setInterval(() => controller.enqueue(encoder.encode(": keepalive\n\n")), 15_000)

        request.signal.addEventListener("abort", () => {
          close()
        })
      },
      cancel() {
        if (heartbeat) clearInterval(heartbeat)
        unsubscribe?.()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error) {
    const message = error instanceof ExecutionRequestError ? error.message : "Unable to stream execution."
    const status = error instanceof ExecutionRequestError ? error.status : 500
    return Response.json({ error: message }, { status })
  }
}

function assertGatewayAuthentication(request: Request) {
  if (process.env.NODE_ENV !== "production") return
  const expectedToken = process.env.RUNNER_GATEWAY_TOKEN
  if (!expectedToken || !tokenMatches(request.headers.get("x-codium-runner-token"), expectedToken)) {
    throw new ExecutionRequestError("Authentication is required to access executions.", 401)
  }
}
