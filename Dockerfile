# Build from this application directory:
#   docker build --target web -t registry.example/codium-web:VERSION .
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]

# The worker has a Docker client, not a Docker daemon. It connects only to the
# socket mounted by the trusted, private worker deployment.
FROM node:22-bookworm-slim AS worker
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io \
  && groupadd --gid 10001 codium \
  && useradd --uid 10001 --gid codium --create-home --home-dir /home/codium --shell /usr/sbin/nologin codium \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=codium:codium . ./
ENV NODE_ENV=production
USER codium
CMD ["node", "node_modules/tsx/dist/cli.mjs", "scripts/judge-worker.ts"]
