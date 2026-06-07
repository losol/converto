# ConvertoAPI pdf generator

A Fastify service that converts HTML or a URL into a PDF using Playwright/Chromium.

## Documentation

- **[Developer guide](docs/developer.md)** — architecture, local setup, scripts,
  testing, CI/CD, and the release flow.
- **[Server configuration](docs/server-configuration.md)** — environment
  variables, rate limiting, Chromium sandbox, and deployment.

## Quick start

```bash
pnpm install
pnpm exec playwright install --with-deps chromium
cp .env.template .env   # then fill in the values
pnpm dev
```

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

The `/token` endpoint uses `client_secret_basic` authentication: send the
`client_id` and `client_secret` as HTTP Basic credentials, with
`grant_type=client_credentials` in the body. You get back a 1-hour JWT.

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
