# VISNDT Database Migration Guide

> 版本: 1.0
> 更新: 2026-07-27
> 适用: Production Deployment

---

## 1. Overview

VISNDT 使用 Prisma 管理数据库迁移。生产环境必须使用 `prisma migrate deploy`（非 `prisma migrate dev`）。

---

## 2. Prerequisites

| 要求 | 说明 |
|------|------|
| PostgreSQL 16+ | 数据库服务运行中 |
| `DATABASE_URL` | 环境变量已配置 |
| `prisma/` 目录 | 包含 `schema.prisma` 和 `migrations/` |

---

## 3. Production Migration Flow

### 3.1 Docker Compose

```bash
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Wait for healthy
docker compose ps postgres

# 3. Run migration
docker compose run --rm api sh -c "npx prisma migrate deploy"
```

### 3.2 Manual

```bash
# Via pnpm
pnpm --filter @visndt/database exec prisma migrate deploy

# Via npx
npx prisma migrate deploy --schema=database/prisma/schema.prisma
```

### 3.3 Verification

```bash
# Check applied migrations
npx prisma migrate status --schema=database/prisma/schema.prisma

# List tables
docker compose exec postgres psql -U visndt -d visndt -c "\dt"
```

---

## 4. Migration Command Reference

| 命令 | 用途 | 环境 |
|------|------|:---:|
| `prisma migrate dev` | 创建新迁移 | 开发 |
| `prisma migrate deploy` | 应用已有迁移 | **生产** |
| `prisma migrate status` | 查看迁移状态 | 生产 |
| `prisma migrate reset` | 重置数据库 | 开发 |
| `prisma db push` | 直接推送 schema | 开发 |
| `prisma generate` | 生成 Prisma Client | 构建 |

---

## 5. Safety Rules

### ✅ DO (Production)

- 使用 `prisma migrate deploy`
- 迁移前备份数据库
- 验证迁移状态
- 在 CI/CD 中自动化迁移

### ❌ DON'T (Production)

- 使用 `prisma migrate dev`
- 使用 `prisma db push`
- 使用 `prisma migrate reset`
- 手动修改数据库 schema

---

## 6. Troubleshooting

### Migration fails

```bash
# Check status
npx prisma migrate status

# Check logs
docker compose logs api

# Verify DATABASE_URL
docker compose exec api printenv DATABASE_URL
```

### Drift detected

If schema drift is detected (manual DB changes), resolve in development first, then re-deploy.

---

**Path: docs/deployment/database-migration.md**