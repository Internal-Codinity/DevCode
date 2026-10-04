# Terminal Component — Real-world Implementation Suggestions

This document maps the simulated ("vibecoded") terminal, logs, metrics, and controls found in `components/system-simulation.tsx` to concrete implementation approaches for a real execution environment. It lists each placeholder/behavior and provides recommended architecture, APIs, security controls, and implementation notes.

## Summary of placeholders found
- Simulated prompts: `user@Codura:~/workspace$ _`
- Hard-coded command outputs for `ls`, `cat solution.py`, `cat test_data.json`, `clear`, `help`, `cd` errors
- Simulated environment run commands: `python solution.py`, `kubectl apply`, `aws lambda invoke`, `func start`
- Simulated success and error traces (stack traces, MemoryError, JSON Lambda responses)
- Simulated Kubernetes/AWS/Azure CLI outputs (pods, logs, function responses)
- Simulated metrics (CPU, Memory, Network, Disk I/O) generated on the client
- Simulated logs with levels (info, warning, error, success)
- Resource limits UI control values (cpu, memory, timeout, network)
- Progress simulation and randomized success/failure behavior

## Implementation goals
- Provide reproducible, secure execution for user-submitted code and commands
- Stream stdout/stderr, logs, and metrics in real time to the browser
- Respect user-configured resource limits and timeouts
- Store execution history and artifacts (results.json, logs) per submission
- Keep system safe (no host compromise, network isolation, secrets protection)

## Architecture (recommended)
- Frontend: existing Next.js app. Replace client-only simulation with WebSocket or SSE updates from backend.
- Backend API / Job Queue: an API server that accepts run requests and enqueues jobs (Redis + BullMQ, RabbitMQ, or similar).
- Runner Workers: isolated execution workers that run jobs in containers (Docker, Podman) or lightweight VMs (Firecracker, gVisor). Workers enforce cgroups limits, seccomp and network egress controls.
- Storage: object store (S3 / local disk) for artifacts, and a relational DB (Postgres) for metadata and logs.
- Orchestration (optional): use Kubernetes Jobs for scale, or a simple fleet of worker processes for small projects.

## Endpoints & data flow (examples)
- POST `/api/run` — request body: { userId, problemId, codeArchive, language, resourceLimits } → returns jobId
- WS `/api/run/:jobId/ws` — server sends streaming messages: { type: 'stdout'|'stderr'|'progress'|'metrics'|'log'|'status', payload }
- GET `/api/job/:jobId` — fetch job metadata and final artifacts (results.json, exitCode)
- GET `/api/fs/:problemId/*` — read-only access to problem files for UI `ls`/`cat` (sanitized)

## Mapping placeholders → concrete implementation

- `ls`, `cat`: Implement read-only file API that lists files from the canonical problem workspace (not arbitrary host paths). Example: frontend sends `GET /api/fs/:problemId` or uses the WS to request file listing; backend reads from the problem bundle stored by the app and returns safe contents.

- `python solution.py` / run commands: Submit the user's code to `/api/run`. The runner unpacks code into an ephemeral workspace, installs minimal dependencies inside a locked environment (prefer offline/airgapped registries where possible), executes with `timeout`, capture stdout/stderr, and streams logs back to the client via WS/SSE.

- `kubectl` flows: If you want to demonstrate Kubernetes behavior, implement a dedicated integration that either (A) talks to a dedicated demo cluster using a service account with restricted namespace and RBAC, or (B) uses a mocked Kubernetes service that translates `kubectl` commands to simulated job lifecycle events. Do NOT execute arbitrary `kubectl` from user input on production clusters.

- `aws lambda` / `azure func`: Provide an abstraction layer in the backend that can either (A) invoke a configured test Lambda (with strict IAM role and sandboxed input), or (B) emulate the function runtime by executing the packaged code inside the runner with the provider-specific handler signature. Prefer emulation for safety.

- Success / error messages and stack traces: Capture stdout and stderr streams from the runner. Parse known runtime stack traces and present sanitized, actionable messages. Provide links to source lines when available.

- Metrics (CPU/Memory/Network/Disk): Collect container-level metrics using Docker Engine API (`docker stats`) or cgroup metrics (read from /sys/fs/cgroup) in the worker. Stream periodic metric snapshots over the WS channel and render with the existing UI components.

- Logs: Instead of generating random messages client-side, centralize logging in the backend. Runner should emit logs with levels. Persist logs per job to DB or object store for later retrieval.

- Resource limits UI: Pass user-specified limits to the runner when creating the container / process (docker run --memory, --cpus, ulimit, and enforcing timeouts). Validate limits on the server side to avoid escalation.

- Progress bar: Emit real progress events from the runner (for known phases: queued → started → running → tests → done). For unknown runtime workloads, approximate progress with heartbeat metrics or step-based progress (e.g., 'compiling', 'running tests', 'uploading results').

## Security considerations (must-haves)
- Do not execute untrusted code directly on the host. Use containers or microVMs with restricted privileges.
- Disable or control outbound network access by default. Use a proxy or allowlist for external fetches if the problem requires network I/O.
- Limit filesystem access to the ephemeral workspace only. Mount problem resources read-only.
- Enforce CPU, memory, and wall-time limits at the kernel/container level; kill runaway processes and surface a clear error to the user.
- Sanitize outputs to avoid secrets leakage and terminal control sequences that could break the UI.

## Developer implementation checklist
- [ ] Add backend job queue and runner workers.
- [ ] Implement `/api/run` and `/api/fs` endpoints with authentication and rate limits.
- [ ] Replace client-side simulation in `components/system-simulation.tsx` with real-time WS/SSE connection to job updates.
- [ ] Worker: implement container creation, resource limits, timeout, and capture streams to storage and WS.
- [ ] Implement metrics collection in worker and stream to frontend.
- [ ] Add persistence for job metadata, logs and artifacts in DB/object store.
- [ ] Add admin controls for safe `kubectl`/cloud interactions or keep them mocked.
- [ ] E2E tests for runner safety: ensure network isolation, timeouts, and resource limits are enforced.

## Minimal tech choices / examples
- Queuing: Redis + BullMQ (Node), or RabbitMQ
- Runner: Docker + cgroups, or Firecracker for stronger isolation
- Streaming: WebSocket (Socket.IO or ws) or Server-Sent Events
- Storage: Postgres for metadata, S3-compatible store for artifacts
- Language sandboxing: use pre-built images per language (python:3.11-slim) with entrypoint that runs user submission

## UX notes & small incremental steps
- Start by wiring `ls`/`cat` calls to a read-only file API for immediate improvement.
- Add an endpoint to submit runs but initially run in a limited, local Docker container with strict limits and no network — this provides immediate value and safety.
- Replace fake log/metric generation with live streams once the runner is operational.

---
If you want, I can scaffold the initial backend endpoints and a basic worker script (Node.js) that runs user code inside a Docker container and streams output back to the frontend. Tell me whether you prefer WebSockets or SSE for streaming, and whether you already have a backend service where this should be integrated.
