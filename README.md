# Performaz API

NestJS REST API for the Performaz platform.

## Current Status

Done:

- Manager authentication with JWT and refresh tokens.
- Seller authentication by matricula.
- Seller password change with current-password validation.
- CRUD/API modules for vendors, clients, products, orders, routes, goals, quests, notifications, dashboard, and gamification.
- Route progress updates for orders, check-ins, and no-sale visits.
- No-sale endpoint: `POST /api/routes/:id/no-sale`.
- Public health endpoint: `GET /api/health`.
- Drizzle migrations for the current schema.
- Railway deployment support with Docker and `railway.toml`.
- Vercel serverless files removed; Railway/Docker is the active deployment path.

Still missing or limited:

- Password recovery email flow.
- Google login and self-registration.
- Restrictive production CORS policy.
- Stronger production RBAC/ownership checks before real customer data.
- Production monitoring/logging beyond Railway logs.

## Production

Public DNS:

```text
https://api.winvex.com.br
```

Base URL:

```text
https://api.winvex.com.br/api
```

Healthcheck:

```text
https://api.winvex.com.br/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "performaz-api"
}
```

## Required Environment Variables

Set these in Railway without surrounding quotes:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=strong_random_secret
JWT_REFRESH_SECRET=another_strong_random_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
```

Do not set `PORT` manually in Railway. Railway injects it and the app listens on `0.0.0.0`.

## Local Development

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm start:dev
```

Local URLs:

```text
http://localhost:3333/api
http://localhost:3333/docs
http://localhost:3333/api/health
```

## Database

The API uses PostgreSQL with Drizzle ORM.

Useful commands:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

The seed creates:

- Manager: `admin@performaz.com` / `admin123`
- Sellers: `V001` to `V005` / `vendor123`

Run the seed only on a fresh/demo database unless you intentionally want duplicate demo data.

## Railway Deploy

Railway settings:

- Service root directory: `/api`
- Dockerfile deployment: enabled automatically from `api/Dockerfile`
- Healthcheck path: `/api/health`

The Docker entrypoint runs:

```bash
drizzle-kit migrate
node dist/main
```

## Verification

Current baseline:

```bash
pnpm test
pnpm build
pnpm test:e2e
```

Latest verified status:

- Unit/integration specs: 11 suites / 25 tests.
- E2E baseline: 2 tests.
- Docker image build and container health smoke passed.
