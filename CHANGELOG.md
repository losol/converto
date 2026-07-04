# @eventuras/convertoapi

## 2.0.0

### Major Changes

- 8bf000c: First release of ConvertoAPI as a standalone repository (`losol/converto`), extracted from the Eventuras monorepo. The project is now an independent Fastify + Playwright HTML-to-PDF microservice with its own build, test, and release pipeline.

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

## 1.0.1

### Patch Changes

- 7c9fe79: chore: update dependencies

## 1.0.0

First release of ConvertoAPI — a Fastify-based HTML-to-PDF microservice powered by Playwright/Chromium.

### Highlights

- **Enhanced security** — SSRF protection with DNS rebinding checks, hardened Docker image (read-only filesystem, non-root, tini), and Kubernetes security contexts (drop ALL capabilities, seccomp, no privilege escalation)
- **Reliable PDF generation** — Singleton Playwright browser with per-request BrowserContext for resource efficiency, graceful shutdown via Fastify onClose hook
- **Kubernetes-native** — Helm chart with startup/liveness/readiness probes, tmpfs /tmp, standard `app.kubernetes.io/*` labels
- **Tested** — 24 tests (unit + integration) covering auth, SSRF, PDF generation, and API contracts

### Security

- Add SSRF protection for URL-to-PDF with private IP blocking and DNS rebinding checks (A+AAAA records)
- Harden Dockerfile: read-only COPY (`--chmod=555`), tini for signal handling, non-root user
- Add pod-level security context (runAsNonRoot, seccomp RuntimeDefault)
- Add container-level security context (drop ALL capabilities, no privilege escalation)
- Use `--no-sandbox` with Chromium instead of SYS_ADMIN capability

### Features

- Reuse singleton Playwright browser with per-request BrowserContext
- Add graceful browser shutdown via Fastify onClose hook
- Make rate limiting configurable via `RATE_LIMIT_MAX` environment variable
- Add startup probe for Chromium cold-start tolerance

### Fixes

- Fix Docker Hub image name (`converto-api` → `converto`)
- Fix well-known endpoint auth method (`client_secret_post` → `client_secret_basic`)

### Infrastructure

- Add Helm chart with standard Kubernetes labels (`app.kubernetes.io/*`)
- Add Vitest unit and integration test suite (24 tests)
- Clean up dependencies: remove unused packages, move typescript to devDependencies

## 0.4.4

### Patch Changes

- chore: update deps

## 0.4.3

### Patch Changes

- chore: update dependencies across frontend packages

## 0.4.2

### Patch Changes

### 🧹 Maintenance

- chore(convertoapi,docsite,web,markdown,scribo,sdk): upgrade deps (b2de638) [@eventuras/convertoapi]

## 0.4.1

### Patch Changes

- - chore(convertoapi,docsite,web,markdown,scribo,sdk): upgrade deps (51e931b) [@eventuras/convertoapi]

## 0.4.0

### Minor Changes

- ## Initial history (pre-Changesets)
  - chore(convertoapi): upgrade docker image (a640690)
  - docs(converto): updates auth method in readme (cde0dce)
  - fix(converto): correct use of auth headers (b2f6af6)
  - chore(converto): upgrade to fastify v5 (1ad8985)
  - fix(converto): enable custom host binding (ef70bb9)
  - fix(converto): correct tsconfig and docker build (c373dd9)
  - feat(converto): add docker support (36e36c1)
  - feat(converto): rate limit apis (aeefa18)
  - feat(converto): add swagger docs (c610cce)
  - feat(converto): add .wellknown endpoint (9b89a2a)
