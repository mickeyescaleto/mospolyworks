FROM oven/bun:1.2.1 AS base

FROM base AS installer
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun turbo run build

FROM base AS runner
WORKDIR /app
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
# COPY --from=installer /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
