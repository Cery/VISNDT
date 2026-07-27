# ===========================================
# VISNDT Admin Frontend Dockerfile
# Multi-stage build: Build → Nginx serve
# ===========================================

# --- Stage 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

# Use hoisted node_modules for Docker compatibility
RUN echo "node-linker=hoisted" > .npmrc

# Copy workspace config and lockfile
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy ALL workspace package.json files (required for pnpm resolution)
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY database/package.json database/

# Install dependencies (workspace-aware)
RUN pnpm install --frozen-lockfile

# Copy admin source code
COPY apps/admin/ apps/admin/

# Build
RUN pnpm --filter @visndt/admin build

# --- Stage 2: Nginx serve ---
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=build /app/apps/admin/dist /usr/share/nginx/html

# Copy Nginx config
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]