# VISNDT 项目上下文交接文档

> 生成时间: 2026-07-21
> 会话范围: M9.1.5 Auth Persistence → M9.2.3 Dashboard Audit Freeze
> 当前状态: M9.2 Dashboard V1 完成并冻结，准备进入 M9.3

---

## 一、项目概览

**项目名称**: VISNDT (Supplier-Demand Matching Platform)
**仓库路径**: `f:\Desktop\VISNDT\VISNDT`
**仓库结构**: pnpm monorepo

### 技术栈 (已冻结)

| 层 | 技术 |
|---|---|
| Frontend (Admin) | React 18 + TypeScript + Vite + Ant Design 5 + Zustand 5 |
| Frontend (Web) | Next.js + TypeScript |
| Backend | NestJS + TypeScript + Prisma |
| Database | PostgreSQL |
| Storage | S3 Compatible |
| Deployment | Container Based (Docker) |

### 业务术语

- Organization（非 Supplier）
- Demand（非 Requirement）
- RFQ（非 Inquiry/Matching）

---

## 二、项目目录结构

```
f:\Desktop\VISNDT\VISNDT\
├── apps/
│   ├── admin/          # Admin Frontend (React + Vite + Ant Design)
│   │   └── src/
│   │       ├── api/           # API services
│   │       │   ├── client.ts          # Axios instance (baseURL: /api/v1, JWT interceptor)
│   │       │   ├── dashboard.service.ts  # Dashboard API (M9.2.1)
│   │       │   └── index.ts           # Barrel export
│   │       ├── auth/          # Auth module
│   │       │   ├── auth.service.ts    # Login/logout
│   │       │   ├── auth.types.ts      # AuthUser interface
│   │       │   ├── RequireAuth.tsx    # Route guard (M9.1.3)
│   │       │   └── index.ts
│   │       ├── stores/        # Zustand stores
│   │       │   ├── auth.store.ts      # Auth state + persist + token expiry (M9.1.5)
│   │       │   ├── app.store.ts
│   │       │   └── index.ts
│   │       ├── hooks/         # Custom hooks
│   │       │   ├── useAuth.ts         # Auth hook (M9.1.5 updated)
│   │       │   ├── useAppStore.ts
│   │       │   └── index.ts
│   │       ├── types/         # TypeScript types
│   │       │   ├── api.ts             # ApiResponse<T>
│   │       │   ├── dashboard.types.ts # Dashboard stats types (M9.2.1)
│   │       │   └── index.ts
│   │       ├── pages/         # Page components
│   │       │   ├── Home.tsx           # Dashboard page (M9.2.2)
│   │       │   ├── Login.tsx          # Login page
│   │       │   ├── NotFound.tsx
│   │       │   ├── Placeholder.tsx    # Placeholder for undeveloped pages
│   │       │   └── index.ts
│   │       ├── layouts/
│   │       │   └── AdminLayout.tsx    # Sider + Header + Content/Outlet
│   │       ├── router/
│   │       │   └── index.tsx          # React Router v6 config
│   │       ├── components/
│   │       │   └── common/
│   │       ├── providers/
│   │       │   └── AppProvider.tsx
│   │       ├── App.tsx
│   │       └── main.tsx
│   ├── api/             # NestJS Backend
│   │   └── src/
│   │       ├── admin/           # Admin Dashboard + Demand + Matching controllers
│   │       ├── auth/            # JWT auth + invitation
│   │       ├── demands/         # Demand CRUD
│   │       ├── matching/        # Matching engine
│   │       ├── offers/          # Offer CRUD
│   │       ├── organizations/   # Organization CRUD
│   │       ├── products/        # Product CRUD + search
│   │       ├── rfqs/            # RFQ + RFQ Response
│   │       ├── suppliers/       # Supplier API
│   │       ├── users/           # User management
│   │       ├── workflow-events/ # Workflow events
│   │       └── common/          # Filters, interceptors, DTOs, throttling
│   └── web/             # Next.js Frontend (customer-facing)
├── database/            # Prisma schema + migrations
│   └── prisma/
│       └── schema.prisma       # 22 models
├── packages/
│   ├── shared-types/    # Shared TypeScript types
│   └── config/          # Shared config
├── docker/
│   └── docker-compose.yml
└── docs/
    └── _review/         # All phase reports (01-108)
```

---

## 三、项目完整进度时间线

### M6: Auth Foundation
- M6.2 Auth Module Skeleton
- M6.3 Authentication Business Logic
- M6.4 JWT Guard + Current User
- M6.5 RBAC Authorization
- M6.6 Authentication Security Audit

### M7: Business Domain
- M7.1 Organization Context Architecture
- M7.2 Product Domain (CRUD, Search, Parameter Filter, Media, Security)
- M7.3 Parameter DataType Enhancement + Numeric Range Filter
- M7.4 Demand Domain (Architecture, Schema, CRUD, Match, Search)
- M7.5 Demand API (Core, Publish/Close, Parameter CRUD, Search/Filter, Match, Status)
- M7.6 Demand Match API
- M7.7 DemandMatch Status Update API
- M7.8 Demand Domain E2E Verification

### M8: Matching Engine + Technical Debt + Architecture Freeze
- M8.1 Supplier Basic API
- M8.2 Matching Engine (Architecture, Implementation, E2E Tests)
- M8.3 Matching Enhancement (Category Filter, Category Helper Refactor, Rematch, Performance Benchmark)
- M8.4 Technical Debt (Rate Limit, Workflow Permission, User Registration, Demand Category)
- M8.5 Security Hardening (Users, Organizations, Core Domain Tests, Final Audit)
- M8.6 Admin Backend Contract Preparation
- M8.7 Architecture Freeze & Development Baseline (74 APIs, 22 models, 18 modules, 140+ tests)

### M9: Admin System V1

#### M9.0: Admin Foundation
- M9.0.1 Admin Project Init (Vite + React + Ant Design)
- M9.0.2 Admin Frontend Architecture Setup
- M9.0.3 Admin Routing Foundation
- M9.0.4 Admin API Client Foundation
- M9.0.5 Admin UI Foundation
- M9.0.6 Admin State Management Foundation
- M9.0.7 Admin Layout Shell
- M9.0.8 Admin Foundation Audit Freeze

#### M9.1: Auth Foundation
- M9.1.1 Auth Architecture Foundation
- M9.1.2 Auth Service + Login Page
- M9.1.3 Auth Guard + API Integration
- M9.1.4 Auth Audit Issue Resolution
- M9.1.5 Auth Persistence ← 本会话

#### M9.2: Dashboard V1 ← 本会话
- M9.2.1 Dashboard API Service & Data Foundation ← 本会话
- M9.2.2 Dashboard Statistics Page ← 本会话
- M9.2.3 Dashboard Audit + Freeze ← 本会话

---

## 四、本会话完成工作

### M9.1.5 Auth Persistence

**目标**: 完善 Admin Frontend 登录状态生命周期

**修改文件**:
| 文件 | 变更 |
|---|---|
| `src/stores/auth.store.ts` | 重写：添加 persist middleware + tokenExpiresAt + checkTokenExpiry + JWT decode |
| `src/auth/RequireAuth.tsx` | 更新：添加 useEffect token expiry check on mount |
| `src/hooks/useAuth.ts` | 更新：暴露 checkTokenExpiry，selector-based subscriptions |

**关键实现**:
- Zustand persist middleware → localStorage key `visndt-auth`
- JWT `exp` 解码：`atob(token.split('.')[1])` → `payload.exp * 1000`
- 三层过期防御：Rehydration → Route Guard → Backend 401
- `onRehydrateStorage` 在 hydration 后自动检测过期 token

**报告**: `docs/_review/105_M9.1.5_Auth_Persistence_Report.md`

---

### M9.2.1 Dashboard API Service & Data Foundation

**目标**: 建立 Dashboard 数据访问基础层

**新建文件**:
| 文件 | 内容 |
|---|---|
| `src/types/dashboard.types.ts` | 6个接口：DashboardStats, DashboardUserStats, DashboardOrganizationStats, DashboardProductStats, DashboardDemandStats, DashboardMatchingStats |
| `src/api/dashboard.service.ts` | `dashboardService.getStats()` → `apiClient.get('/admin/dashboard/stats')` |

**修改文件**:
| 文件 | 变更 |
|---|---|
| `src/api/index.ts` | 添加 `dashboardService` 导出 |
| `src/types/index.ts` | 添加所有 Dashboard 类型导出 |

**Backend 契约** (只读参考):
- `GET /api/v1/admin/dashboard/stats` → JWT + ADMIN role
- 返回: `{ users: {total, active}, organizations: {total}, products: {total}, demands: {total, published}, matching: {totalMatches} }`

**报告**: `docs/_review/106_M9.2.1_Dashboard_API_Service_Report.md`

---

### M9.2.2 Dashboard Statistics Page

**目标**: 将 Home.tsx 从 placeholder 升级为真实 Dashboard

**修改文件**:
| 文件 | 变更 |
|---|---|
| `src/pages/Home.tsx` | 重写：1行 placeholder → 138行 Dashboard 组件 |

**实现**:
- 3 种状态：loading (Spin) → error (Alert + Retry) → success (5 张 Statistic 卡片)
- 5 张统计卡片：Users, Organizations, Products, Demands, Matches
- 响应式布局：xs=1列, sm=2列, lg=3列
- useCallback + useEffect 自动请求数据
- 使用 Ant Design: Card, Statistic, Row, Col, Spin, Alert, Button, Typography

**报告**: `docs/_review/107_M9.2.2_Dashboard_Statistics_Page_Report.md`

---

### M9.2.3 Dashboard Audit + Freeze

**目标**: 对 Dashboard 模块进行架构、安全、代码质量审核

**审核结果**: **PASS — APPROVED**

**审核维度**:
- 架构：单向依赖，无循环引用 ✅
- API 层：正确复用 apiClient，无 auth 绕过 ✅
- 类型：零 any，可扩展接口设计 ✅
- 组件：清晰的 discriminated union 状态管理 ✅
- 安全：RequireAuth → JWT interceptor → Backend 验证链路完整 ✅
- 代码质量：零 any/TODO/FIXME，TypeScript strict ✅

**技术债** (仅登记，不阻塞):
| ID | 严重度 | 描述 |
|---|---|---|
| TD1 | Medium | `as unknown as` Axios 类型转换模式 |
| TD2 | Medium | Home.tsx 中有 5 处 inline styles |
| TD3 | Low | DashboardStatsResponse 接口在 service 文件内 |

**Dashboard 模块被批准为后续 Admin 页面开发模板**

**报告**: `docs/_review/108_M9.2.3_Dashboard_Audit_Freeze_Report.md`

---

## 五、当前代码状态快照

### Admin Frontend 完整文件清单

```
apps/admin/src/
├── api/
│   ├── client.ts            # Axios: baseURL=/api/v1, JWT interceptor, 401 handler
│   ├── dashboard.service.ts # dashboardService.getStats() → DashboardStats
│   └── index.ts             # exports: apiClient, dashboardService
├── auth/
│   ├── auth.service.ts      # login(email, password), logout()
│   ├── auth.types.ts        # AuthUser { id, email, name?, role, organizationId? }
│   ├── RequireAuth.tsx      # Route guard: isAuthenticated + checkTokenExpiry
│   └── index.ts             # exports: AuthUser, RequireAuth
├── components/
│   ├── common/index.ts
│   └── index.ts
├── hooks/
│   ├── useAuth.ts           # useAuth() → { user, accessToken, isAuthenticated, login, logout, checkTokenExpiry }
│   ├── useAppStore.ts
│   └── index.ts
├── layouts/
│   └── AdminLayout.tsx      # Sider (collapsible) + Header + Content/Outlet
├── pages/
│   ├── Home.tsx             # Dashboard: loading/error/success → 5 stat cards
│   ├── Login.tsx            # Login form with email/password
│   ├── NotFound.tsx         # 404 page
│   ├── Placeholder.tsx      # "Coming Soon" placeholder
│   └── index.ts
├── providers/
│   ├── AppProvider.tsx
│   └── index.ts
├── router/
│   └── index.tsx            # Routes: /login, / (RequireAuth > AdminLayout), /*
├── stores/
│   ├── auth.store.ts        # Zustand + persist: accessToken, user, isAuthenticated, tokenExpiresAt
│   ├── app.store.ts
│   └── index.ts
├── styles/
│   └── index.css
├── types/
│   ├── api.ts               # ApiResponse<T> { data, message? }
│   ├── dashboard.types.ts   # DashboardStats + 5 sub-interfaces
│   └── index.ts
├── utils/
│   └── index.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### 路由配置

```typescript
// 当前路由
'/login'      → <Login />                          (公开)
'/'           → <RequireAuth><AdminLayout /></>     (受保护)
  ├─ '/'      → Navigate to /home
  ├─ '/home'  → <Home />                           (Dashboard - 已完成)
  ├─ '/products'     → <Placeholder />              (待 M9.3)
  ├─ '/demands'      → <Placeholder />              (待 M9.4)
  ├─ '/matching'     → <Placeholder />              (待 M9.5)
  ├─ '/users'        → <Placeholder />              (待开发)
  └─ '/organizations' → <Placeholder />             (待开发)
'*'          → <NotFound />
```

---

## 六、开发模式与约定

### 页面开发模板 (Dashboard 模式)

```typescript
// 1. 状态定义
type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SomeType };

// 2. 数据获取
const fetchData = useCallback(async () => {
  setPageState({ status: 'loading' });
  try {
    const data = await someService.getData();
    setPageState({ status: 'success', data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load data';
    setPageState({ status: 'error', message });
  }
}, []);

// 3. 挂载请求
useEffect(() => { fetchData(); }, [fetchData]);

// 4. 条件渲染
if (pageState.status === 'loading') return <Spin />;
if (pageState.status === 'error') return <Alert type="error" action={<Button onClick={fetchData}>Retry</Button>} />;
// success: render data
```

### API Service 模板

```typescript
import { apiClient } from './client';
import type { SomeType } from '../types/some.types';

interface SomeResponse {
  success: boolean;
  data: SomeType;
  message: string;
  timestamp: string;
}

export const someService = {
  async getData(): Promise<SomeType> {
    const response = (await apiClient.get('/path')) as unknown as SomeResponse;
    return response.data;
  },
};
```

### 关键约束

1. **Backend 冻结**: 不修改 apps/api, Prisma schema, migration
2. **Auth 冻结**: 不修改 auth 模块, router 结构
3. **Store 冻结**: 不修改 store 文件
4. **Layout 冻结**: 不修改 AdminLayout
5. **零依赖**: 不新增 npm 依赖
6. **TypeScript strict**: 零 any/TODO/FIXME
7. **Build 验证**: 每次修改后 `pnpm --filter @visndt/admin build` 必须 exit code 0

---

## 七、下一步任务

### M9.3 Admin Product Management

**目标**: 实现 Product List 页面，替换 `/products` 路由的 Placeholder

**任务**:
1. 创建 `src/api/product.service.ts` — 复用 apiClient
2. 如需新类型，创建 `src/types/product.types.ts`
3. 重写 `src/pages/Placeholder.tsx` 或创建新页面组件
4. 更新路由配置（如需要）
5. 遵循 Dashboard 模板模式：loading/error/success

**参考 Backend 端点**:
- `GET /api/v1/products` — 产品列表（支持 search, filter, pagination）
- `GET /api/v1/products/:id` — 产品详情
- `POST /api/v1/products` — 创建产品 (ADMIN)
- `PATCH /api/v1/products/:id` — 更新产品 (ADMIN)
- `DELETE /api/v1/products/:id` — 删除产品 (ADMIN)

---

## 八、报告索引

| 编号 | 阶段 | 标题 | 状态 |
|---|---|---|---|
| 105 | M9.1.5 | Auth Persistence Report | Complete |
| 106 | M9.2.1 | Dashboard API Service & Data Foundation Report | Complete |
| 107 | M9.2.2 | Dashboard Statistics Page Report | Complete |
| 108 | M9.2.3 | Dashboard Audit Freeze Report | Complete |

所有报告位于: `f:\Desktop\VISNDT\docs\_review\`

---

## 九、构建命令

```bash
# Admin Frontend 构建
pnpm --filter @visndt/admin build

# 当前构建结果
# 4926 modules, 866.41 kB JS, 0.26 kB CSS
# exit code: 0
```

---

## 十、关键文件路径速查

| 用途 | 路径 |
|---|---|
| Axios 客户端 | `apps/admin/src/api/client.ts` |
| Dashboard 服务 | `apps/admin/src/api/dashboard.service.ts` |
| Dashboard 类型 | `apps/admin/src/types/dashboard.types.ts` |
| Dashboard 页面 | `apps/admin/src/pages/Home.tsx` |
| Auth Store | `apps/admin/src/stores/auth.store.ts` |
| Auth Guard | `apps/admin/src/auth/RequireAuth.tsx` |
| Admin Layout | `apps/admin/src/layouts/AdminLayout.tsx` |
| Router | `apps/admin/src/router/index.tsx` |
| Backend Admin Controller | `apps/api/src/admin/admin.controller.ts` |
| Backend Admin Service | `apps/api/src/admin/admin.service.ts` |
| Prisma Schema | `database/prisma/schema.prisma` |
| 报告目录 | `docs/_review/` |