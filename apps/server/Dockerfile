FROM oven/bun:1.2.1 AS base

FROM base AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun turbo run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/server/server.js ./apps/server/server.js

EXPOSE 3001

CMD ["bun", "apps/server/server.js"]