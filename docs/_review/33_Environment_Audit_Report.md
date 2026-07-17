# Backend Environment Audit Report

**日期**: 2026-07-17  
**范围**: `VISNDT/apps/api/`, `VISNDT/.env*`  
**最终状态**: **WARNING**

---

## 1. 结果摘要

| # | 检查项 | 状态 |
|---|--------|:---:|
| 1 | .env 文件结构 | WARNING |
| 2 | .env.example 存在 | PASS |
| 3 | DATABASE_URL 配置 | PASS |
| 4 | PORT 配置 | PASS |
| 5 | ConfigModule 使用 | WARNING |
| 6 | CORS 配置 | WARNING |
| 7 | Swagger 配置 | PASS |
| 8 | Prisma 连接配置 | PASS |
| 9 | 硬编码 secret | PASS |
| 10 | 开发配置泄漏 | WARNING |

---

## 2. 详细检查

### 2.1 .env 文件结构

| 文件 | 路径 | 存在 | .gitignore |
|------|------|:---:|:---:|
| `.env` (root) | `VISNDT/.env` | 是 | 是 |
| `.env.example` (root) | `VISNDT/.env.example` | 是 | 否 |
| `.env` (api) | `VISNDT/apps/api/.env` | 是 | 是 |
| `.env.example` (api) | `VISNDT/apps/api/.env.example` | **否** | — |

**WARNING**: `apps/api/.env.example` 不存在。建议补充。

### 2.2 .env.example 内容

**WARNING**: `.env.example` 与 `.env` 内容完全一致，包含实际凭证而非占位符：

```
VISNDT/.env          → 22 lines (with credentials)
VISNDT/.env.example  → 22 lines (identical to .env)
```

| 变量 | .env.example 中的值 | 风险 |
|------|-------------------|------|
| `DATABASE_URL` | `postgresql://visndt:visndt_dev@localhost:5432/visndt` | 暴露开发密码 |
| `S3_ACCESS_KEY` | `minioadmin` | 暴露开发凭证 |
| `S3_SECRET_KEY` | `minioadmin` | 暴露开发凭证 |
| `NODE_ENV` | `development` | 环境模式明确 |

**建议**: `.env.example` 应使用占位符（如 `CHANGE_ME`）而非实际凭证。

### 2.3 DATABASE_URL 配置

| 属性 | 值 |
|------|-----|
| 配置方式 | 环境变量 `DATABASE_URL` |
| 读取方式 | PrismaClient 自动读取 (PrismaService extends PrismaClient) |
| 连接地址 | `localhost:5432` |
| 数据库名 | `visndt` |
| 用户名 | `visndt` |
| 密码 | `visndt_dev` (开发环境) |

PASS — Prisma 原生支持 DATABASE_URL 环境变量，无需额外配置。

### 2.4 PORT 配置

| 属性 | 值 |
|------|-----|
| 配置位置 | `main.ts:25` |
| 读取方式 | `process.env.PORT ?? 4000` |
| 默认值 | 4000 |
| .env 设置值 | 4000 |

PASS — 有默认回退值，配置正确。

### 2.5 ConfigModule 使用

| 属性 | 值 |
|------|-----|
| 注册 | `ConfigModule.forRoot({ isGlobal: true })` |
| 位置 | `app.module.ts:21` |
| ConfigService 注入 | **未使用** |

**WARNING**: ConfigModule 已注册为全局模块，但整个应用中没有任何地方使用 `ConfigService` 注入。当前代码直接用 `process.env.PORT` 读取环境变量。这不影响功能，但 ConfigModule 成为了冗余依赖。

### 2.6 CORS 配置

```typescript
// main.ts:12
app.enableCors();
```

**WARNING**: CORS 已启用但**无任何限制**。当前配置允许所有来源访问。

| 风险 | 说明 |
|------|------|
| 允许任意 Origin | 任何网站均可调用 API |
| 允许任意 Method | 未限制 HTTP 方法 |
| 允许任意 Header | 未限制请求头 |
| 允许 Credentials | 未明确限制 |

**生产环境建议**: 配置明确的 `origin` 白名单。

### 2.7 Swagger 配置

| 属性 | 值 |
|------|-----|
| 标题 | VISNDT API |
| 描述 | VISNDT Platform API — MVP v1.0 |
| 版本 | 1.0 |
| 路径 | `/api/docs` |
| 配置位置 | `main.ts:17-23` |

PASS — Swagger 配置完整，无泄漏敏感信息。

### 2.8 Prisma 数据库连接

| 属性 | 值 |
|------|-----|
| 模块 | `@Global()` PrismaModule |
| 连接时机 | `OnModuleInit` → `$connect()` |
| 断开时机 | `OnModuleDestroy` → `$disconnect()` |
| 数据源 | 自动读取 `DATABASE_URL` |

PASS — 标准 NestJS Prisma 集成，连接管理正确。

### 2.9 硬编码 secret

**PASS** — 未发现硬编码 secret。

| 搜索项 | 结果 |
|--------|------|
| JWT token | 无 |
| API key | 无 |
| private key | 无 |
| password (代码中) | 仅 `passwordHash` 字段名 (DTO) |
| secret | 无 |

所有 secret 仅存在于 `.env` 文件中（已通过 `.gitignore` 排除提交）。

### 2.10 开发环境配置泄漏

**WARNING** — 发现以下问题：

| # | 问题 | 位置 | 风险 |
|---|------|------|------|
| 1 | `.env.example` 包含真实凭证 | `VISNDT/.env.example` | 中 |
| 2 | `.env` 与 `.env.example` 内容相同 | — | 中 |
| 3 | `NODE_ENV=development` 在 .env.example | `VISNDT/.env.example` | 低 |
| 4 | `console.log` 在 main.ts | `main.ts:27` | 低 |

**console.log 详情**:

```typescript
// main.ts:27
console.log(`NestJS API running on http://localhost:${port}`);
```

仅启动消息，不输出敏感信息，可接受。

---

## 3. 环境变量清单

| 变量 | 用途 | .env | .env.example | 代码引用 |
|------|------|:---:|:---:|:---:|
| `DATABASE_URL` | PostgreSQL 连接 | 是 | 是 | PrismaService (自动) |
| `PORT` | API 监听端口 | 是 | 是 | `main.ts:25` |
| `NODE_ENV` | 运行环境 | 是 | 是 | 未引用 |
| `S3_ENDPOINT` | S3 存储地址 | 是 | 是 | 未引用 |
| `S3_REGION` | S3 区域 | 是 | 是 | 未引用 |
| `S3_BUCKET` | S3 存储桶 | 是 | 是 | 未引用 |
| `S3_ACCESS_KEY` | S3 访问密钥 | 是 | 是 | 未引用 |
| `S3_SECRET_KEY` | S3 秘密密钥 | 是 | 是 | 未引用 |
| `NEXT_PUBLIC_API_URL` | 前端 API 地址 | 是 | 是 | 未引用 |

**注**: S3 和 NEXT_PUBLIC_API_URL 变量已定义但未被 Backend 代码引用，属于预留配置。

---

## 4. 最终判定

```
Environment Audit: WARNING
```

| 级别 | 问题 | 影响 |
|:---:|------|------|
| WARNING | `.env.example` 包含真实凭证 | 安全实践 |
| WARNING | CORS 无限制 (`enableCors()` 无参数) | 生产安全 |
| WARNING | ConfigModule 已注册但未使用 | 代码整洁 |
| WARNING | `apps/api/.env.example` 缺失 | 开发体验 |
| PASS | 无硬编码 secret | — |
| PASS | .env 文件已 gitignore | — |
| PASS | Prisma 连接配置正确 | — |
| PASS | Swagger 配置正确 | — |

### 修复建议 (按优先级)

| 优先级 | 建议 |
|:---:|------|
| 高 | `.env.example` 中替换真实凭证为占位符 (`CHANGE_ME`) |
| 高 | CORS 配置添加 origin 白名单 |
| 中 | 补充 `apps/api/.env.example` |
| 低 | 使用 ConfigService 替代 `process.env` 直接访问 |
| 低 | `.env.example` 中 `NODE_ENV` 改为 `development` 或注释说明 |