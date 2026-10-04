# Build, scan, and pin this image in CI. The application executes only this
# reviewed image name (or an explicitly configured digest), never user input.
FROM node:22-bookworm-slim

RUN mkdir -p /workspace \
  && chown 65534:65534 /workspace

USER 65534:65534
WORKDIR /workspace
ENV HOME=/tmp \
    NODE_ENV=production

# No package manager credentials, application secrets, or dependencies are
# included. The Docker invocation supplies the fixed Node command.
