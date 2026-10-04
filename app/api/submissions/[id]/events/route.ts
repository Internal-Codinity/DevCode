import { AuthenticationError, requireUser } from "@/lib/auth/session"
import { getSubmissionEventsForUser, getSubmissionForUser } from "@/lib/submissions/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser()
    const id = (await params).id
    if (!(await getSubmissionForUser(id, user.id))) return Response.json({ error: "Submission not found." }, { status: 404 })

    const encoder = new TextEncoder()
    let cursor = Number(request.headers.get("last-event-id") ?? 0)
    if (!Number.isSafeInteger(cursor) || cursor < 0) cursor = 0
    let closed = false
    let poll: ReturnType<typeof setInterval> | undefined
    let heartbeat: ReturnType<typeof setInterval> | undefined

    const stream = new ReadableStream({
      async start(controller) {
        const close = () => {
          if (closed) return
          closed = true
          if (poll) clearInterval(poll)
          if (heartbeat) clearInterval(heartbeat)
          controller.close()
        }
        const sendPending = async () => {
          if (closed) return
          try {
            const events = await getSubmissionEventsForUser(id, user.id, cursor)
            for (const event of events) {
              cursor = Number(event.id)
              controller.enqueue(encoder.encode(`id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`))
              if (event.type === "complete") close()
            }
          } catch {
            close()
          }
        }
        await sendPending()
        if (!closed) {
          poll = setInterval(() => void sendPending(), 500)
          heartbeat = setInterval(() => {
            if (!closed) controller.enqueue(encoder.encode(": keepalive\n\n"))
          }, 15_000)
        }
        request.signal.addEventListener("abort", close)
      },
      cancel() {
        closed = true
        if (poll) clearInterval(poll)
        if (heartbeat) clearInterval(heartbeat)
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
    if (error instanceof AuthenticationError) return Response.json({ error: error.message }, { status: 401 })
    console.error("Submission event stream failure", error)
    return Response.json({ error: "Submission stream is unavailable." }, { status: 503 })
  }
}
