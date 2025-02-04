FROM oven/bun:1.2.1 

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3001

CMD ["bun", "apps/server/src/main.ts"]