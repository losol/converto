#!/usr/bin/env bash
#
# End-to-end smoke test for the production Docker image.
#
# Runs the container with the same hardening the Helm chart applies in
# Kubernetes (read-only root filesystem, a single writable /tmp tmpfs,
# HOME=/tmp, all capabilities dropped, no privilege escalation) and then
# exercises the full request path: obtain a token, render a PDF.
#
# The point is to catch filesystem-permission regressions (e.g. EROFS from
# Chromium writing outside /tmp) that unit/integration tests run on the host
# cannot surface, since they never run under readOnlyRootFilesystem.
#
# Usage:
#   tests/e2e/smoke-docker.sh            # builds the image, then tests it
#   IMAGE=converto:abc123 tests/e2e/smoke-docker.sh   # tests a prebuilt image
#
# Requires: docker, curl. Exits non-zero on any failure.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A caller-provided IMAGE is treated as prebuilt (build is skipped). Without
# one we default the tag and always rebuild, so the smoke test can never pass
# against a stale cached image.
[[ -n "${IMAGE:-}" ]] && IMAGE_PREBUILT=1
IMAGE="${IMAGE:-converto:e2e-smoke}"
CONTAINER="converto-e2e-$$"
HOST_PORT="${HOST_PORT:-3199}"

CLIENT_ID="smoke-client"
CLIENT_SECRET="smoke-secret"
JWT_SECRET="smoke-jwt-secret-not-for-production"

# tmpfs size mirrors the chart's emptyDir sizeLimit (256Mi).
TMPFS_SIZE="256m"

log() { printf '\033[1;34m›\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# 1. Build the image, unless the caller opted into a prebuilt one via IMAGE.
if [[ -n "${IMAGE_PREBUILT:-}" ]]; then
  log "Using prebuilt image: $IMAGE"
  docker image inspect "$IMAGE" >/dev/null 2>&1 || fail "Prebuilt image not found: $IMAGE"
else
  log "Building image: $IMAGE"
  docker build -t "$IMAGE" "$ROOT_DIR"
fi

# 2. Run the container with the same security posture as the Helm chart.
#    --read-only + --tmpfs /tmp is the crux: it reproduces k8s
#    readOnlyRootFilesystem with a single writable, memory-backed /tmp.
log "Starting container with read-only rootfs (HOST_PORT=$HOST_PORT)"
docker run -d --name "$CONTAINER" \
  --read-only \
  --tmpfs "/tmp:rw,size=$TMPFS_SIZE" \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -e HOME=/tmp \
  -e HOST=0.0.0.0 \
  -e PORT=3100 \
  -e BASE_URL="http://localhost:$HOST_PORT" \
  -e PLAYWRIGHT_NOSANDBOX=true \
  -e JWT_SECRET="$JWT_SECRET" \
  -e CLIENT_ID="$CLIENT_ID" \
  -e CLIENT_SECRET="$CLIENT_SECRET" \
  -p "127.0.0.1:$HOST_PORT:3100" \
  "$IMAGE" >/dev/null

BASE="http://127.0.0.1:$HOST_PORT"

# 3. Wait for the health endpoint to come up.
log "Waiting for /healthz"
for i in $(seq 1 30); do
  if curl -fsS "$BASE/healthz" >/dev/null 2>&1; then
    break
  fi
  if ! docker ps --filter "name=$CONTAINER" --filter status=running -q | grep -q .; then
    docker logs "$CONTAINER" || true
    fail "Container exited before becoming healthy"
  fi
  sleep 1
  [[ "$i" == 30 ]] && { docker logs "$CONTAINER" || true; fail "Timed out waiting for /healthz"; }
done

# 4. Obtain an access token (OAuth client-credentials, HTTP Basic).
log "Requesting token"
BASIC="$(printf '%s:%s' "$CLIENT_ID" "$CLIENT_SECRET" | base64)"
TOKEN_JSON="$(curl -fsS -X POST "$BASE/token" \
  -H "Authorization: Basic $BASIC" \
  -H 'Content-Type: application/json' \
  -d '{"grant_type":"client_credentials"}')" \
  || fail "Token request failed"

# Extract access_token without depending on jq.
TOKEN="$(printf '%s' "$TOKEN_JSON" | sed -n 's/.*"access_token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
[[ -n "$TOKEN" ]] || fail "No access_token in response: $TOKEN_JSON"

# 5. Render a PDF — this is what actually writes to /tmp under read-only rootfs.
log "Rendering PDF"
OUT="$(mktemp)"
trap 'rm -f "$OUT"; cleanup' EXIT
HTTP_CODE="$(curl -sS -o "$OUT" -w '%{http_code}' -X POST "$BASE/v1/pdf" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"html":"<h1>E2E smoke test</h1>"}')"

[[ "$HTTP_CODE" == 200 ]] || { docker logs "$CONTAINER" || true; fail "PDF render returned HTTP $HTTP_CODE"; }

# 6. Verify the response is a real PDF (magic bytes %PDF).
MAGIC="$(head -c 4 "$OUT")"
[[ "$MAGIC" == "%PDF" ]] || fail "Response is not a PDF (first bytes: '$MAGIC')"

# 7. Sanity-check the logs for filesystem errors that read-only rootfs would surface.
if docker logs "$CONTAINER" 2>&1 | grep -qiE 'EROFS|read-only file system'; then
  docker logs "$CONTAINER" || true
  fail "Found read-only filesystem errors in container logs"
fi

printf '\033[1;32m✓ Docker smoke test passed (read-only rootfs, PDF rendered)\033[0m\n'
