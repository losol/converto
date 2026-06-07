---
'@eventuras/convertoapi': major
---

First release of ConvertoAPI as a standalone repository (`losol/converto`), extracted from the Eventuras monorepo. The project is now an independent Fastify + Playwright HTML-to-PDF microservice with its own build, test, and release pipeline.

### Breaking changes

- **Standalone repository** — no longer part of the Eventuras monorepo; building, installing, and deploying no longer depend on `workspace:*` packages or `apps/*` / `libs/*` paths.
- The Docker image is published from this repo's own pipeline as `losolio/converto` (`:2.0.0`, `:latest`, `:canary`, `:main-<sha>`).

### Build & tooling

- Vendored a standalone ESLint flat config and `tsconfig.json`, dropping the `@eventuras/eslint-config` / `@eventuras/typescript-config` workspace dependencies.
- Pinned `pnpm@11.4.0` and Node `>=24`; added `lint` / `typecheck` / `format` / coverage scripts and wired Prettier in as a CI gate.

### CI/CD

- **CI** — lint, format check, typecheck, unit tests, build, and integration tests (with Playwright Chromium) on every push/PR.
- **Docker** — multi-arch (amd64 + arm64) build & push to Docker Hub; `canary` + `main-<sha>` from `main`, `<version>` + `latest` from `v*` tags.
- **Release** — Changesets-driven versioning, changelog, GitHub Releases, and a tag-triggered Docker publish.
- Dependabot for npm, GitHub Actions, and the Docker base image.

### Docker

- Rewrote the Dockerfile for the standalone layout (root build context, `pnpm prune --prod`), keeping the hardened runtime (non-root `pwuser`, read-only copies, `tini`).

### Fixes

- The JWT preHandler now returns the 401 instead of send-and-throw, avoiding noisy "reply already sent" errors in the logs.
