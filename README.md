# ConvertoAPI pdf generator

## Installation

`pnpm install` as usual. But you might need to install playwright dependencies with
`npx playwright install`.

Copy `.env.template` to `.env` and fill in the values.

Then you may run the app with `pnpm dev`.

## Development

This repo uses [pnpm](https://pnpm.io/) (pinned via `packageManager`) and Node 24.

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `pnpm dev`              | Run the app with tsx (watch-free)              |
| `pnpm build`            | Type-check and emit to `dist/`                 |
| `pnpm start`            | Run the built app from `dist/`                 |
| `pnpm lint`             | ESLint (`--max-warnings 0`)                    |
| `pnpm format`           | Format with Prettier                           |
| `pnpm typecheck`        | `tsc --noEmit`                                 |
| `pnpm test`             | Unit tests (excludes the integration suite)    |
| `pnpm test:integration` | Integration tests (needs a Playwright browser) |
| `pnpm test:coverage`    | Unit tests with coverage                       |

The integration tests boot the Fastify app and generate a real PDF, so they
need a browser: `pnpm exec playwright install --with-deps chromium`.

## CI/CD

GitHub Actions:

- **CI** (`.github/workflows/ci.yml`) — on every push/PR to `main`: lint,
  format check, typecheck, unit tests, build, and the integration suite.
- **Docker** (`.github/workflows/docker.yml`) — builds the image and, on
  pushes to `main` and `v*` tags, publishes to Docker Hub (`losolio/converto`).
  - `main` → `canary` + `main-<sha>` (linux/amd64 + arm64)
  - `v*` tag → `<version>` + `latest`
  - Pull requests build only (no push)
- **Release** (`.github/workflows/release.yml`) — Changesets-based releases
  (see below).

Publishing requires two repository secrets: `DOCKERHUB_USERNAME` and
`DOCKERHUB_TOKEN`.

Dependency updates are managed by Dependabot (`.github/dependabot.yml`) for
npm, GitHub Actions, and the Docker base image.

### Releases

Versioning and changelog are managed with [Changesets](https://github.com/changesets/changesets):

1. Include a changeset with any release-worthy change: `pnpm changeset`
   (pick the bump type, write a summary) and commit the file in `.changeset/`.
2. When changesets land on `main`, the Release workflow opens/updates a
   **"Version Packages"** PR that bumps the version and updates `CHANGELOG.md`.
3. Merging that PR tags `v<version>`, creates a GitHub Release, and triggers
   the Docker workflow to publish `losolio/converto:<version>` + `latest`.

The package is `private` and is never published to npm — Changesets only drives
the version, changelog, and release tag.

## Run local

To run converto api locally with docker, you can use the following command:

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

## Usage

### Get a token

Token Endpoint Authentication Method is client_secret_post. Clients can authenticate to the /token endpoint using the client_secret_post method, where the client_id and client_secret are included in the request body as URL-encoded form parameters. This method is recommended for server-side clients where the client secret can be securely stored.

```bash
curl --request POST \
  --url http://localhost:3100/token \
  --header "Authorization: Basic $(echo -n 'client_id:client_secret' | base64)" \
  --header "Content-Type: application/json" \
  --data '{
    "grant_type": "client_credentials"
  }'
```

### Generate a PDF

Use the token you received in the previous step to generate a PDF.

```bash
curl --request POST \
  --url http://localhost:3100/v1/pdf \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {TOKEN_HERE}' \
  --data '{
    "url": "https://www.google.com"
  }' \
  --output generated.pdf
```

## Acknowledgements

- This project uses [Fastify](https://www.fastify.io/)
- The PDF generation is done with [Playwright](https://playwright.dev/)
- The pdf controller is based on the work done in [losol/converto](https://github.com/losol/converto)
