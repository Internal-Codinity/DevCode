# Isolated code runner

This project now exposes a Docker-backed execution API rather than executing code in the browser or on the Next.js host:

- `POST /api/run` creates a reviewed Python or JavaScript execution with validated CPU, memory, and wall-time limits.
- `GET /api/run/:jobId/events` streams stdout, stderr, logs, progress, status, and measured Docker metrics through SSE.
- `GET` / `DELETE /api/job/:jobId` fetches or cancels a job.
- `GET /api/fs/:problemId` and `GET /api/fs/:problemId/:file` expose only canonical, read-only problem files. They never resolve host paths.

## Security boundary

The runner fails closed unless `RUNNER_ENABLED=true`. Each container is started with no outbound network, a read-only root filesystem, dropped Linux capabilities, no-new-privileges, an anonymous user, PID/file-descriptor limits, a bounded `/tmp`, and the requested cgroup CPU/memory limits. Only a random, ephemeral submission workspace is writable. Output and `results.json` artifacts are size-limited and terminal escape sequences are removed before streaming.

The Docker daemon is itself a high-trust dependency. Run it on dedicated Linux worker nodes, not on a shared web host; Docker Desktop does not provide the same cgroup production boundary. The intended production topology is an authenticated API gateway, queue, and isolated worker fleet (gVisor or Firecracker where the risk model requires a stronger boundary). The local in-process job registry is suitable for one persistent development worker only; replace it with Redis/queue state plus Postgres and object storage before running multiple replicas or deploying on serverless infrastructure.

## Local development

1. Start a Docker daemon.
2. Build both reviewed runner images:

   ```sh
   docker build -t codium-runner-python:3.11 runner-images/python
   docker build -t codium-runner-node:22 runner-images/node
   ```

3. Copy `.env.example` to `.env.local`, then start Next.js with `npm run dev`.

   If Docker tooling is pointed at a stale Docker Desktop socket, add
   `RUNNER_DOCKER_HOST=unix:///var/run/docker.sock` to `.env.local`. The runner
   uses that value for Docker commands without changing the rest of your shell.

The supplied Python and JavaScript images have no third-party packages and run with network disabled by Docker. In production, configure `RUNNER_PYTHON_IMAGE` and `RUNNER_NODE_IMAGE` to allowlisted digest-pinned images. If a challenge needs approved packages or another language, add a separately reviewed and scanned runner image before exposing that language in the editor.

## Production requirements

Set `RUNNER_ENABLED=true` and configure allowlisted image digests with `RUNNER_PYTHON_IMAGE` and `RUNNER_NODE_IMAGE`; pre-pull them on worker nodes. The public app persists an authenticated submission, then a private worker claims and runs it. `RUNNER_WORKER=true` belongs only on that private worker, never the web deployment.

The submission lifecycle is durable in PostgreSQL: jobs, per-case results, aggregate runtime/memory, and SSE history survive web and worker restarts. The in-memory execution object exists only inside a worker while one fixture is running; it is not exposed in the production web API. Add end-to-end safety tests for network isolation, timeout enforcement, memory limits, cancellation, and worker failover before every runner-image or sandbox-runtime change.
