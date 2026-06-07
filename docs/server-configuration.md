# Server configuration

The server is configured entirely through environment variables. In development
these are loaded from a `.env` file (copy `.env.template` and fill it in); in
production set them in the container/orchestrator.

## Environment variables

| Variable                            | Required | Default        | Description                                                                   |
| ----------------------------------- | -------- | -------------- | ----------------------------------------------------------------------------- |
| `BASE_URL`                          | **Yes**  | —              | Public base URL. Used as the OIDC issuer and in the `/token` endpoint URL.    |
| `JWT_SECRET`                        | **Yes**  | —              | Secret for signing JWTs. Generate with `openssl rand -base64 64`.             |
| `CLIENT_ID`                         | **Yes**  | —              | Client id accepted at `/token`.                                               |
| `CLIENT_SECRET`                     | **Yes**  | —              | Client secret accepted at `/token`.                                           |
| `HOST`                              | No       | `0.0.0.0`      | Interface the server binds to.                                                |
| `PORT`                              | No       | `3100`         | Port the server listens on.                                                   |
| `RATE_LIMIT_MAX`                    | No       | `5`            | Max requests per second (1 s window). Values `< 1` or invalid fall back to 5. |
| `PUBLIC_PATH`                       | No       | `<cwd>/public` | Directory served as static files.                                             |
| `PLAYWRIGHT_NOSANDBOX`              | No       | unset          | Set to `true` to launch Chromium with `--no-sandbox`.                         |
| `PLAYWRIGHT_DISABLE_SETUID_SANDBOX` | No       | unset          | Set to `true` to launch Chromium with `--disable-setuid-sandbox`.             |

> The app fails fast on startup if `BASE_URL` or `JWT_SECRET` is missing.
> `CLIENT_ID` / `CLIENT_SECRET` are required for `/token` to issue tokens.

## Rate limiting

Requests are rate limited globally via `@fastify/rate-limit` to `RATE_LIMIT_MAX`
requests per second (default 5).

## Chromium sandbox

Chromium runs sandboxed by default. In restricted environments (e.g. some
containers) you may need to disable parts of the sandbox by setting
`PLAYWRIGHT_NOSANDBOX=true` and/or `PLAYWRIGHT_DISABLE_SETUID_SANDBOX=true`.
The provided Docker image and Kubernetes setup are configured to run without
these flags by relying on container isolation — see [`k8s/README.md`](../k8s/README.md).

## Deployment

A Helm chart and Kubernetes manifests live under [`k8s/`](../k8s/). The chart
sets the image to `losolio/converto` with the tag provided by CI/CD.
