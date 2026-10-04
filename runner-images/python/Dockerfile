# Build, scan, and pin this image in CI. The web application must only run a
# reviewed digest from a private registry, never an image supplied by a user.
FROM python:3.11-alpine

RUN mkdir -p /workspace \
  && chown 65534:65534 /workspace

USER 65534:65534
WORKDIR /workspace
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOME=/tmp \
    GOCACHE=/tmp/go-cache

# The application supplies a fixed Python command. This image deliberately
# contains no package manager credentials or application secrets.
