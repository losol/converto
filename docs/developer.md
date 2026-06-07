# Developer guide

ConvertoAPI is a [Fastify](https://www.fastify.io/) service that turns HTML or a
URL into a PDF using [Playwright](https://playwright.dev/) / Chromium.

## Prerequisites

- Node `>=24`
- [pnpm](https://pnpm.io/) (pinned via `packageManager` in `package.json`)

## Getting started

```bash
pnpm install
pnpm exec playwright install --with-deps chromium   # browser for PDF generation
cp .env.template .env                               # then fill in the values
pnpm dev
```

See [server-configuration.md](./server-configuration.md) for the environment
variables.

## Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `pnpm dev`              | Run the app with tsx                           |
| `pnpm build`            | Type-check and emit to `dist/`                 |
| `pnpm start`            | Run the built app from `dist/`                 |
| `pnpm lint`             | ESLint (`--max-warnings 0`)                    |
| `pnpm format`           | Format with Prettier                           |
| `pnpm typecheck`        | `tsc --noEmit`                                 |
| `pnpm test`             | Unit tests (excludes the integration suite)    |
| `pnpm test:integration` | Integration tests (needs a Playwright browser) |
| `pnpm test:coverage`    | Unit tests with coverage                       |

## Architecture

The code is feature-sliced under `src/features/<feature>/`. Each feature exposes
a `register*` function from its `index.ts`, and `buildApp()` in
[`src/app.ts`](../src/app.ts) composes them — registration order matters:

```text
ratelimit → openapi → auth → pdf → health → homepage
```

| Feature     | Responsibility                                                              |
| ----------- | --------------------------------------------------------------------------- |
| `ratelimit` | Global rate limiting (`@fastify/rate-limit`)                                |
| `openapi`   | Swagger + Scalar API reference served at `/openapi`                         |
| `auth`      | OAuth2 client-credentials: `/token` and `/.well-known/openid-configuration` |
| `pdf`       | `POST /v1/pdf` — HTML/URL → PDF, SSRF-guarded, behind JWT                   |
| `health`    | `GET /healthz`                                                              |
| `homepage`  | Static files (`@fastify/static`)                                            |

## Security model

- **Authentication** — `POST /token` with HTTP Basic (`client_id:client_secret`)
  returns a 1-hour JWT. `POST /v1/pdf` is protected by the `verifyJWT`
  preHandler.
- **SSRF protection** — when generating a PDF from a URL, `urlValidator`
  enforces http/https only, resolves DNS (both A and AAAA records to defeat
  rebinding), and rejects private, loopback, and link-local addresses
  (including the cloud metadata endpoint `169.254.169.254`).
- **Browser** — a single Chromium instance is shared; each request gets its own
  `BrowserContext`, and the browser is closed gracefully via Fastify's `onClose`
  hook.

## Testing

- **Unit tests** live next to the code (e.g. `urlValidator.test.ts`).
- **Integration tests** (`src/integration.test.ts`) boot the app via
  `app.inject()` and generate a real PDF, so they need a Chromium browser:

  ```bash
  pnpm exec playwright install --with-deps chromium
  pnpm test:integration
  ```

## CI/CD

GitHub Actions:

- **CI** (`.github/workflows/ci.yml`) — on every push/PR to `main`: lint, format
  check, typecheck, unit tests, build, and the integration suite.
- **Docker** (`.github/workflows/docker.yml`) — builds and publishes the
  container image. See [docker.md](./docker.md) for build instructions and the
  image tag scheme.
- **Release** (`.github/workflows/release.yml`) — Changesets-based releases.

Dependency updates are managed by Dependabot for npm, GitHub Actions, and the
Docker base image.

## Releases

Versioning and changelog are managed with
[Changesets](https://github.com/changesets/changesets):

1. Include a changeset with any release-worthy change: `pnpm changeset` (pick the
   bump type, write a summary) and commit the file in `.changeset/`.
2. When changesets land on `main`, the Release workflow opens/updates a
   **"Version Packages"** PR that bumps the version and updates `CHANGELOG.md`.
3. Merging that PR tags `v<version>`, creates a GitHub Release, and triggers the
   Docker workflow to publish `losolio/converto:<version>` + `latest`.

The package is `private` and is never published to npm — Changesets only drives
the version, changelog, and release tag.
