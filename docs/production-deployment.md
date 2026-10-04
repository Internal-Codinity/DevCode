# Production deployment

Codura runs three distinct services: the public Next.js web process, PostgreSQL, and a private judge worker. Do not run the judge inside the public web service, and never give the web service access to the Docker socket.

## Required infrastructure

- PostgreSQL 15+ with encrypted storage, daily backups, point-in-time recovery, and a private network path from web/worker only.
- A web deployment behind a TLS-terminating reverse proxy that forwards the original `Host` and `X-Forwarded-Proto` headers.
- One or more judge workers on dedicated hosts. Their container runtime must support enforced CPU, memory, PID, read-only filesystem, and network isolation. For untrusted public workloads, prefer a microVM runtime such as Firecracker/Kata over sharing a general-purpose Docker daemon.
- Transactional SMTP. Account verification and reset links intentionally fail closed in production if SMTP is absent.
- Central logs, metrics, alerting, backups, and secret storage. Do not put secrets in compose files, git, browser code, or `NEXT_PUBLIC_*` variables.

## Build and release

Run this from the application directory:

```bash
docker build --target web -t registry.example/codium-web:VERSION .
docker build --target worker -t registry.example/codium-worker:VERSION .
docker push registry.example/codium-web:VERSION
docker push registry.example/codium-worker:VERSION
```

Set `CODIUM_IMAGE`, `CODIUM_WORKER_IMAGE`, `POSTGRES_PASSWORD`, `APP_URL`, `DOCKER_GID` (the numeric group owning `/var/run/docker.sock` on the worker host), and SMTP variables in your deployment secret manager, then deploy `docker-compose.production.yml`. The migration service must complete before web or worker starts. Run `npm run db:seed` once after migrations to publish the bundled starter catalog. Subsequent problem changes should use versioned migrations or an audited admin import job, never browser code.

## Secrets and environment

`APP_URL` must be the canonical HTTPS origin, for example `https://codura.example`. Set `DATABASE_SSL=true` and use the provider’s CA in managed-database deployments. `RUNNER_WORKER=true` must exist only on judge workers. The web image must not receive it or any Docker socket mount.

Use immutable image digests in the deployment system. The compose file pins PostgreSQL; pin your own web/worker image digests as part of the release manifest too.

## Judge safety

The worker is the only component permitted to invoke the sandbox. It loads fixtures from PostgreSQL and sends only aggregate progress to the user; hidden test inputs, expected output, and actual output never pass through the browser API.

Runner images must be separately built, scanned, signed, and deployed by digest. The worker references fixed image names only. The current Docker runner uses disabled networking, an unprivileged UID, read-only root filesystem, dropped capabilities, PID/memory/CPU/file limits, and wall-time cancellation. Run it on a dedicated worker pool; do not colocate it with PostgreSQL or the public web process.

## Operations checklist

1. `npm run typecheck`, `npm run lint`, and `npm run build` must pass in CI.
2. Run database migrations and seed through a staging environment before production.
3. Probe `/api/health` from the internal load balancer.
4. Alert on migration failure, judge queue age, internal-error verdict rate, PostgreSQL connection exhaustion, and worker restarts.
5. Rotate database/SMTP credentials and invalidate compromised user sessions by deleting `user_sessions` rows.
6. Back up and restore-test PostgreSQL. Submission history and private fixtures are not recoverable without database backups.
