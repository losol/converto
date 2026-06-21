# Dockerfile for ConvertoAPI (HTML to PDF conversion microservice)
#
# Build from the repo root:
#   docker build -t converto:latest .
#
##################
# Stage 1: Build #
##################
FROM mcr.microsoft.com/playwright:v1.61.0-noble AS builder

WORKDIR /app

# Enable the pinned pnpm version
RUN corepack enable && \
    COREPACK_ENABLE_STRICT=0 corepack prepare pnpm@11.4.0 --activate

# Install all dependencies (incl. devDependencies for the build) using the
# lockfile only, so this layer is cached until dependencies change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the app
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
RUN pnpm run build

# Drop devDependencies, leaving only production deps in node_modules.
RUN pnpm prune --prod --ignore-scripts


##################################
# Stage 2: Run from a fresh base #
##################################
FROM mcr.microsoft.com/playwright:v1.61.0-noble

# Install tini for proper signal handling (SIGTERM in k8s)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends tini && \
    rm -rf /var/lib/apt/lists/*

# Get generated files from the previous stage (read-only for non-root user)
WORKDIR /app
COPY --chmod=555 --from=builder /app/node_modules /app/node_modules
COPY --chmod=444 --from=builder /app/package.json /app/package.json
COPY --chmod=555 --from=builder /app/dist /app/dist
COPY --chmod=555 --from=builder /app/public /app/public

# Switch to non-root user
USER pwuser

ENTRYPOINT ["tini", "--"]
CMD ["node", "dist/app.js"]
