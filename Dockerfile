# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3333

CMD ["sh", "entrypoint.sh"]
