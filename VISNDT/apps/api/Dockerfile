# ===========================================
# VISNDT Backend Dockerfile
# Multi-stage build for production (Alpine)
# ===========================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN echo "node-linker=hoisted" > .npmrc

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY database/package.json database/

# Install all deps (needed for build and prisma generate)
RUN pnpm install --frozen-lockfile

# --- Stage 2: Prisma Generate ---
FROM deps AS prisma
WORKDIR /app

COPY database/prisma/ database/prisma/

# Generate Prisma Client with OpenSSL 3.0 engine for Alpine 3.23+
# The BINARY_TARGETS env var tells prisma generate which engine to download
RUN cd database && BINARY_TARGETS='["native","linux-musl-openssl-3.0.x"]' npx prisma generate

# --- Stage 3: Build ---
FROM deps AS build
WORKDIR /app

COPY --from=prisma /app/node_modules/.prisma node_modules/.prisma
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/src apps/api/src/

RUN pnpm --filter @visndt/api build

# --- Stage 4: Production ---
FROM node:20-alpine AS production
WORKDIR /app

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy production deps (use --prod deps to keep image small)
COPY --from=deps /app/node_modules node_modules

# Copy Prisma engines from prisma stage
COPY --from=prisma /app/node_modules/.prisma node_modules/.prisma

# Copy build output
COPY --from=build /app/apps/api/dist apps/api/dist

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/api/package.json apps/api/
COPY database/package.json database/

# Copy Prisma schema and migrations (for migrate deploy)
COPY database/prisma/schema.prisma database/prisma/
COPY database/prisma/migrations/ database/prisma/migrations/

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/v1/health || exit 1

CMD ["node", "apps/api/dist/main"]