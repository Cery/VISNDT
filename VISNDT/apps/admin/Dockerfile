# ===========================================
# VISNDT Admin Frontend Dockerfile
# Multi-stage build: Build → Nginx serve
# ===========================================

# --- Stage 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app

# 统一 pnpm 版本：见 apps/api/Dockerfile 注释——仓库 packageManager 声明 pnpm@11.20.0
# 与 lockfile 9.0 / 本地 pnpm@9 不一致，需禁用 corepack 读取项目 spec 以使用 pnpm@9。
ENV COREPACK_ENABLE_PROJECT_SPEC=0
RUN corepack enable && corepack prepare pnpm@9 --activate

# Use hoisted node_modules for Docker compatibility
RUN echo "node-linker=hoisted" > .npmrc

# Copy workspace config and lockfile
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy ALL workspace package.json files (required for pnpm resolution)
COPY packages/*/package.json packages/
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY database/package.json database/

# Install dependencies (workspace-aware)
RUN pnpm install --frozen-lockfile

# Copy workspace package sources and build them first.
# Admin depends on @visndt/design-system / design-tokens / identity-contract /
# rule-engine-contract（main 指向 dist，需先产出 dist 才能被 admin 引用）。
# 按依赖拓扑串行构建，避免 tsup DTS worker 并行解析 workspace 包时的竞态。
COPY packages/ packages/
RUN pnpm --filter @visndt/design-tokens build && \
    pnpm --filter @visndt/identity-contract build && \
    pnpm --filter @visndt/rule-engine-contract build && \
    pnpm --filter @visndt/design-system build

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