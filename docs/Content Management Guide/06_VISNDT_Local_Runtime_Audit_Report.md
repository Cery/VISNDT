# 06_VISNDT 本地运行环境审计报告

**版本**: V1.0  
**日期**: 2026-08-04  
**阶段**: M13.9 Web MVP Freeze  
**目的**: 本地运行环境检查与问题诊断  

---

## 1. 环境检查

### 1.1 项目根目录

| 项目 | 路径 | 状态 |
|------|------|------|
| 项目根目录 | `F:\Desktop\VISNDT\VISNDT` | ✅ 确认 |
| apps/web | Next.js 15.5.20 | ✅ 存在 |
| apps/admin | React 19 + Vite 6 | ✅ 存在 |
| apps/api | NestJS 11 | ✅ 存在 |
| database | Prisma 7.8 + PostgreSQL | ✅ 存在 |
| packages | config + shared-types | ✅ 存在 |

### 1.2 环境变量文件清单

| 文件 | 位置 | 存在 | 用途 |
|------|------|------|------|
| `.env` | 根目录 | ✅ | 全局环境变量 |
| `.env.example` | 根目录 | ✅ | 全局环境变量模板 |
| `.env` | `apps/api/` | ✅ | API 后端配置 |
| `.env.example` | `apps/api/` | ✅ | API 配置模板 |
| `.env` | `database/` | ✅ | 数据库连接配置 |
| `.env` | `apps/web/` | ❌ 缺失 | Web 前端配置 |
| `.env` | `apps/admin/` | ❌ 缺失 | Admin 管理后台配置 |

---

## 2. 三端运行状态

### 2.1 端口监听状态

| 端口 | 进程 | 状态 | 说明 |
|------|------|------|------|
| 3000 | node (PID 5912) | ✅ 监听中 | Next.js Web 前端 |
| 3001 | node (PID 6784) | ✅ 监听中 | Vite Admin 后台 |
| 4000 | — | ❌ 未监听 | API 后端（未启动） |
| 5432 | — | ❌ 未监听 | PostgreSQL（未启动） |
| 9000 | — | ❌ 未监听 | MinIO S3（未启动） |

### 2.2 各端详细状态

| 端 | URL | 可访问 | 状态 |
|----|-----|--------|------|
| **Web** | `http://localhost:3000` | ✅ 200 | HTML 正常返回，但 API 不可用 |
| **Admin** | `http://localhost:3001` | ✅ 200 | HTML 正常返回，但 API 不可用 |
| **API** | `http://localhost:4000` | ❌ | 未启动（数据库连接失败） |

---

## 3. API 地址配置分析

### 3.1 配置对比

| 配置位置 | 配置项 | 值 | 说明 |
|---------|--------|-----|------|
| `apps/api/.env` | `PORT` | `4000` | API 监听端口 |
| `apps/api/.env` | `CORS_ORIGIN` | `http://localhost:3000` | 仅允许 Web 跨域 |
| `apps/web/src/lib/constants.ts` | `API_BASE_URL` | `http://localhost:3001` | ⚠️ **错误** |
| `apps/admin/vite.config.ts` | proxy `/api` | `http://localhost:3000` | ⚠️ **错误** |
| `apps/admin/src/api/client.ts` | `baseURL` | `/api/v1` | 相对路径（通过 Vite proxy） |

### 3.2 🔴 关键问题：API 地址全链路不一致

```
期望链路:
  Web (3000) ──→ API (4000)
  Admin (3001) ──→ API (4000)

实际链路:
  Web (3000) ──→ 3001 ❌  (指向 Admin 端口，非 API)
  Admin (3001) ──→ 3000 ❌  (指向 Web 端口，非 API)
  API (4000) ──→ 未启动 ❌  (数据库未运行)
```

**问题 1: Web → API 地址错误**

- 文件: `apps/web/src/lib/constants.ts:2`
- 当前值: `'http://localhost:3001'`（这是 Admin 的端口）
- 期望值: `'http://localhost:4000'`（API 的端口）
- 影响: 所有 API 请求发往错误端口，导致 Web 页面因 API 失败而显示异常

**问题 2: Admin → API 代理错误**

- 文件: `apps/admin/vite.config.ts:10`
- 当前值: `target: 'http://localhost:3000'`（这是 Web 的端口）
- 期望值: `target: 'http://localhost:4000'`（API 的端口）
- 影响: Admin 的 API 请求被代理到 Web，导致所有管理功能不可用

**问题 3: CORS 只允许 Web**

- 文件: `apps/api/.env` 的 `CORS_ORIGIN`
- 当前值: `http://localhost:3000`（仅 Web）
- 缺失: `http://localhost:3001`（Admin 也需要）
- 期望值: `http://localhost:3000,http://localhost:3001`

---

## 4. 数据库状态

### 4.1 连接测试

```
✗ PostgreSQL 连接失败
  Error: P1001 — Can't reach database server at `localhost:5432`
```

### 4.2 Prisma 配置

| 项目 | 值 |
|------|-----|
| 数据库 URL | `postgresql://visndt:visndt_dev@localhost:5432/visndt` |
| 用户 | `visndt` |
| 密码 | `visndt_dev` |
| 数据库名 | `visndt` |
| 主机 | `localhost:5432` |

### 4.3 Migration 状态

| 项目 | 状态 |
|------|------|
| 迁移文件 | 16 个 migration |
| 迁移状态 | ❌ 无法检查（数据库未启动） |
| Schema 模型 | 23 个模型 |
| 枚举 | 16 个 |

### 4.4 数据模型概览

**User 模型 (简):**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | String (unique) | 邮箱 |
| passwordHash | String | 密码哈希 |
| name | String? | 姓名 |
| status | UserStatus | 状态 (ACTIVE/INACTIVE/SUSPENDED) |
| organizationId | UUID? | 所属组织 |

> ⚠️ **注意**: User 模型本身没有 `role` 字段。角色通过 `OrganizationMember.role` 管理。

---

## 5. 管理员账号状态

### 5.1 Seed 脚本分析

- 文件: `database/seed_admin.ts`
- 预设管理员账号:

| 字段 | 当前值 | 用户期望值 |
|------|--------|-----------|
| 邮箱 | `admin@vip.com` | `admin@visndt.com` |
| 密码 | `admin123456` | `admin123456` |
| 组织 | `Admin Organization` (type: ADMIN) | — |
| 角色 | `ADMIN` (via OrganizationMember) | — |

### 5.2 账号是否存在？

| 检查项 | 结果 |
|--------|------|
| 数据库是否可连接 | ❌ 无法连接 |
| 是否执行过 seed | ❌ 无法确认 |
| admin 用户是否存在 | ❌ 无法确认 |

> 🔴 **数据库未启动，无法验证管理员账号是否存在。** 需要先启动 PostgreSQL 并执行 `pnpm seed` (或 `tsx seed_admin.ts`) 来创建管理员账号。

### 5.3 预设账号建议调整

| 项目 | 当前值 | 建议值 | 原因 |
|------|--------|--------|------|
| 邮箱 | `admin@vip.com` | `admin@visndt.com` | 使用平台自有域名，更专业 |
| 密码 | `admin123456` | `admin123456` | 保持不变 |

---

## 6. 当前问题汇总

### 6.1 🔴 Critical (阻塞)

| # | 问题 | 文件 | 影响 |
|---|------|------|------|
| 1 | PostgreSQL 未启动 | — | 所有后端功能不可用 |
| 2 | API 无法启动 | — | 依赖数据库，连锁失败 |
| 3 | Web API 地址指向 `:3001` | [constants.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/lib/constants.ts#L2) | 所有 API 请求失败 |
| 4 | Admin proxy 指向 `:3000` | [vite.config.ts](file:///F:/Desktop/VISNDT/VISNDT/apps/admin/vite.config.ts#L10) | 所有管理功能不可用 |

### 6.2 🟡 Warning (需修复)

| # | 问题 | 文件 | 影响 |
|---|------|------|------|
| 5 | CORS 只允许 Web 端口 | `apps/api/.env` | Admin 被 CORS 拦截 |
| 6 | Seed 邮箱非平台域名 | [seed_admin.ts](file:///F:/Desktop/VISNDT/VISNDT/database/seed_admin.ts#L21) | 不专业，建议改为 `admin@visndt.com` |
| 7 | Web 缺少 `.env` 文件 | `apps/web/` | 默认 fallback 值不正确 |
| 8 | Admin 缺少 `.env` 文件 | `apps/admin/` | 无法覆盖 API 地址 |

### 6.3 ℹ️ Info (说明)

| # | 说明 |
|---|------|
| 9 | Web 页面全英文：项目未配置 i18n/多语言，所有 UI 文本为英文硬编码 |
| 10 | MinIO S3 未启动：如不上传文件，不影响核心功能测试 |

---

## 7. 修复方案

### 7.1 修复顺序

```
Step 1: 启动 PostgreSQL
   ↓
Step 2: 执行数据库 Migration + Seed
   ↓
Step 3: 修复 API 地址配置
   ↓
Step 4: 启动 API
   ↓
Step 5: 重启 Web 和 Admin
   ↓
Step 6: 验证全链路
```

### 7.2 各步骤详细操作

#### Step 1: 启动 PostgreSQL

```bash
# 如果使用 Docker:
cd F:\Desktop\VISNDT\VISNDT\docker
docker-compose up -d postgres

# 如果本地安装:
# 启动 PostgreSQL 服务
```

#### Step 2: 执行 Migration + Seed

```bash
cd F:\Desktop\VISNDT\VISNDT\database
npx prisma migrate deploy
npx tsx seed_admin.ts
```

#### Step 3: 修复 API 地址配置

**文件 1: `apps/web/src/lib/constants.ts`**

```diff
- export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
+ export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
```

**文件 2: `apps/admin/vite.config.ts`**

```diff
- target: 'http://localhost:3000',
+ target: 'http://localhost:4000',
```

**文件 3: `apps/api/.env` (CORS)**

```diff
- CORS_ORIGIN=http://localhost:3000
+ CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

**文件 4: `database/seed_admin.ts` (管理员邮箱)**

```diff
- email: 'admin@vip.com',
+ email: 'admin@visndt.com',
```

#### Step 4: 启动 API

```bash
cd F:\Desktop\VISNDT\VISNDT\apps\api
pnpm dev
```

#### Step 5: 重启 Web 和 Admin

```bash
# 终止当前进程后重启
cd F:\Desktop\VISNDT\VISNDT\apps\web
pnpm dev

cd F:\Desktop\VISNDT\VISNDT\apps\admin
pnpm dev
```

#### Step 6: 验证

| 验证项 | URL | 预期 |
|--------|-----|------|
| Web 首页 | `http://localhost:3000` | 正常显示，产品列表可加载 |
| Admin 登录 | `http://localhost:3001` | 登录页正常 |
| Admin 登录测试 | `admin@visndt.com` / `admin123456` | 登录成功 |
| API 健康检查 | `http://localhost:4000/health` | 返回 200 |

---

## 8. 下一步建议

### 8.1 立即执行

| 优先级 | 操作 | 说明 |
|--------|------|------|
| P0 | 启动 PostgreSQL | 所有后端功能的前置条件 |
| P0 | 修复 API 地址配置 | 3 个文件需要修改 |
| P0 | 执行 Migration + Seed | 初始化数据库结构和管理员账号 |
| P0 | 启动 API | 验证后端功能 |

### 8.2 后续优化

| 优先级 | 操作 | 说明 |
|--------|------|------|
| P1 | 创建 `apps/web/.env` | 设置 `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| P1 | 创建 `apps/admin/.env` | 设置 `VITE_API_URL=http://localhost:4000` |
| P2 | 添加中文 i18n | 解决页面全英文问题 |
| P2 | 启动 MinIO | 如需测试文件上传功能 |

---

## 9. 总结

| 维度 | 状态 |
|------|------|
| Web 启动 | ✅ 运行中 (端口 3000) |
| Admin 启动 | ✅ 运行中 (端口 3001) |
| API 启动 | ❌ 未启动 (数据库连接失败) |
| PostgreSQL | ❌ 未启动 |
| API 地址配置 | ❌ 3 处错误 |
| 管理员账号 | ❌ 无法确认 (需先启动 DB) |
| 整体状态 | 🔴 不可用 |

**根本原因**: PostgreSQL 未启动 → API 无法启动 → 所有功能不可用。  
**次要问题**: 3 处 API 地址配置错误，即使 API 启动，Web 和 Admin 也无法正确调用。

---

**文档版本**: V1.0 | **生成日期**: 2026-08-04 | **审计范围**: 本地运行环境