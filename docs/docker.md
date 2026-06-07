# Docker

The service ships as a hardened container image based on the official Playwright
image (non-root `pwuser`, read-only copies, `tini` for signal handling).

## Build

```bash
docker build -t converto:local .
```

## Run

```bash
docker run -d --name converto_api \
  -e HOST=0.0.0.0 \
  -e BASE_URL=http://localhost \
  -e PORT=3100 \
  -e JWT_SECRET=jwt_secret \
  -e CLIENT_ID=client_id \
  -e CLIENT_SECRET=client_secret \
  -p 3100:3100 \
  losolio/converto
```

See [server-configuration.md](./server-configuration.md) for all environment
variables.

## Published images & tags

Images are published to Docker Hub as `losolio/converto` by the Docker workflow
(`.github/workflows/docker.yml`), multi-arch (linux/amd64 + arm64). Publishing
requires the `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets.

| Trigger            | Tag                  | Mutable? | Use                                         |
| ------------------ | -------------------- | -------- | ------------------------------------------- |
| Push to `main`     | `canary`             | moving   | Always the latest `main` build              |
| Push to `main`     | `2026.06.07.a1b2c3d` | pinned   | A specific `main` commit (date + short SHA) |
| Release (`v2.0.0`) | `2.0.0`              | pinned   | A specific release                          |
| Release (`v2.0.0`) | `latest`             | moving   | The most recent release                     |

Notes:

- The dated `main` tag is `<YYYY.MM.DD>.<short-sha>` (UTC) — the short SHA keeps
  it unique even with multiple merges on the same day, and traceable to a commit.
- The git tag is `v2.0.0` (git convention); the image tag is `2.0.0` (Docker
  convention, no `v` prefix).
- For production, pin to an immutable tag (`2.0.0` or a dated `main` build)
  rather than a moving one (`latest` / `canary`).
- Pull requests build the image but do not push it.
