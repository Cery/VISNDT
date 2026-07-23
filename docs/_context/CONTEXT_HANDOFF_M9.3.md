# VISNDT 项目上下文交接文档

> 生成时间: 2026-07-23
> 会话范围: M9.2.3 Dashboard Audit Freeze → M9.3.3 Product Management Audit & Freeze
> 当前状态: M9.3 Admin Product Management 完成并冻结，准备进入 M9.4

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
f:\Desktop\VISNDT\
├── docs/                # 项目文档
│   ├── _context/        # AI 协作上下文 (M9.2.4 新建)
│   │   ├── VISNDT_CURRENT_CONTEXT.md       # 当前状态快照
│   │   ├── VISNDT_ARCHITECTURE_RULES.md    # 架构规则
│   │   ├── VISNDT_PHASE_HISTORY.md         # 阶段历史
│   │   └── CONTEXT_HANDOFF_M9.3.md         # 上下文交接 (本文件)
│   ├── _review/         # 阶段报告 (01-110)
│   └── api/             # API 契约
└── VISNDT/              # pnpm monorepo
    ├── apps/
    │   ├── admin/       # Admin Frontend (React + Vite + Ant Design)
    │   │   └── src/
    │   │       ├── api/           # API services
│   │       │   ├── client.ts              # Axios instance (baseURL: /api/v1, JWT interceptor)
│   │       │   ├── categories.service.ts  # Categories API (M9.3.2)
│   │       │   ├── dashboard.service.ts   # Dashboard API (M9.2.1)
│   │       │   ├── product.service.ts     # Product CRUD API (M9.3)
│   │       │   └── index.ts              # Barrel export
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
    │   │       │   ├── product.types.ts   # Product types (M9.3)
    │   │       │   └── index.ts
    │   │       ├── pages/         # Page components
│   │       │   ├── Home.tsx           # Dashboard page (M9.2.2)
│   │       │   ├── Login.tsx          # Login page
│   │       │   ├── ProductCreate.tsx  # Product Create page (M9.3.2)
│   │       │   ├── ProductDetail.tsx  # Product Detail page (M9.3.1)
│   │       │   ├── ProductEdit.tsx    # Product Edit page (M9.3.2)
│   │       │   ├── ProductList.tsx    # Product List page (M9.3)
│   │       │   ├── NotFound.tsx
│   │       │   ├── Placeholder.tsx    # Placeholder for undeveloped pages
│   │       │   └── index.ts
    │   │       ├── layouts/
    │   │       │   └── AdminLayout.tsx    # Sider + Header + Content/Outlet
    │   │       ├── router/
    │   │       │   └── index.tsx          # React Router v6 config
    │   │       ├── components/
│   │       │   ├── common/
│   │       │   ├── product/
│   │       │   │   ├── ProductForm.tsx   # Shared Create/Edit form (M9.3.2)
│   │       │   │   └── index.ts
│   │       │   └── index.ts
    │   │       ├── providers/
    │   │       │   └── AppProvider.tsx
    │   │       ├── App.tsx
    │   │       └── main.tsx
    │   ├── api/             # NestJS Backend (Frozen)
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
    ├── database/            # Prisma schema + migrations (Frozen)
    │   └── prisma/
    │       └── schema.prisma       # 22 models, 15 enums
    ├── packages/
    │   ├── shared-types/    # Shared TypeScript types
    │   └── config/          # Shared config
    └── docker/
        └── docker-compose.yml
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
- M9.1.5 Auth Persistence

#### M9.2: Dashboard V1
- M9.2.1 Dashboard API Service & Data Foundation
- M9.2.2 Dashboard Statistics Page
- M9.2.3 Dashboard Audit + Freeze
- M9.2.4 Context Governance & Documentation Alignment

#### M9.3: Product Management
- M9.3.1 Product List Page
- M9.3.2 Product Detail Page
- M9.3.3 Product Create/Edit Form
- M9.3.4 Product Management Audit & Freeze ← 本会话

---

## 四、本会话完成工作

### M9.3 Product Management (完整回顾)

**目标**: 实现 Admin Product Management 全部功能（List, Detail, Create, Edit）

**新建文件 (8)**:
| 文件 | 内容 |
|---|---|
| `src/types/product.types.ts` | 8 个接口：Product, ProductListResponse, ProductParameterValue, ProductMedia, ProductDetail, ProductFormData, SearchProductParams |
| `src/api/product.service.ts` | 4 个方法：getList, getById, create, update |
| `src/api/categories.service.ts` | 1 个方法：getList (分类选择器) |
| `src/pages/ProductList.tsx` | 240 行：搜索/筛选/排序/分页 |
| `src/pages/ProductDetail.tsx` | 180 行：基础信息/参数/媒体 |
| `src/pages/ProductCreate.tsx` | 16 行：复用 ProductForm |
| `src/pages/ProductEdit.tsx` | 89 行：预加载 + ProductForm |
| `src/components/product/ProductForm.tsx` | 162 行：共享 Create/Edit 表单 |

**修改文件 (6)**:
| 文件 | 变更 |
|---|---|
| `src/types/index.ts` | 添加 Product 系列类型导出 |
| `src/api/index.ts` | 添加 productService, categoriesService 导出 |
| `src/router/index.tsx` | 新增 /products, /create, /:id, /:id/edit 路由 |
| `src/pages/index.ts` | 添加 ProductList, ProductDetail, ProductCreate, ProductEdit |
| `src/components/product/index.ts` | 新建 barrel |
| `src/components/index.ts` | 添加 product 导出 |

**功能覆盖**:
- Product List: 关键词搜索, 状态筛选, 排序, 服务端分页, Reset
- Product Detail: 基础信息, 参数表格, 媒体 (Empty)
- Product Create: 分类选择器, 表单验证, 提交反馈
- Product Edit: 预加载数据, 表单填充, 状态修改

**报告**: `docs/_review/113_M9.3_Product_Management_Audit_Report.md`

---

## 五、当前代码状态快照

### Admin Frontend 完整文件清单

```
apps/admin/src/
├── api/
│   ├── client.ts              # Axios: baseURL=/api/v1, JWT interceptor, 401 handler
│   ├── categories.service.ts  # categoriesService.getList() → ProductCategory[]
│   ├── dashboard.service.ts   # dashboardService.getStats() → DashboardStats
│   ├── product.service.ts     # productService: getList, getById, create, update
│   └── index.ts               # exports: apiClient, categoriesService, dashboardService, productService
├── auth/
│   ├── auth.service.ts      # login(email, password), logout()
│   ├── auth.types.ts        # AuthUser { id, email, name?, role, organizationId? }
│   ├── RequireAuth.tsx      # Route guard: isAuthenticated + checkTokenExpiry
│   └── index.ts             # exports: AuthUser, RequireAuth
├── components/
│   ├── product/
│   │   ├── ProductForm.tsx  # Shared Create/Edit form: name, model, categoryId, status, description
│   │   └── index.ts
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
│   ├── ProductCreate.tsx    # Product Create: wraps ProductForm
│   ├── ProductDetail.tsx    # Product Detail: info, parameters, media
│   ├── ProductEdit.tsx      # Product Edit: preload + ProductForm
│   ├── ProductList.tsx      # Product List: search, filter, sort, pagination
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
│   ├── product.types.ts     # Product, ProductDetail, ProductFormData, ProductListResponse, ProductParameterValue, ProductMedia, SearchProductParams
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
  ├─ '/products'         → <ProductList />          (M9.3 - 已完成)
  ├─ '/products/create'  → <ProductCreate />        (M9.3.2 - 已完成)
  ├─ '/products/:id/edit' → <ProductEdit />         (M9.3.2 - 已完成)
  ├─ '/products/:id'     → <ProductDetail />        (M9.3.1 - 已完成)
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

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const someService = {
  async getData(): Promise<SomeType> {
    const response = (await apiClient.get('/path')) as unknown as ApiResponseWrapper<SomeType>;
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

### M9.4 Admin Demand Management

**目标**: 实现 Admin Demand List 页面，替换 `/demands` 路由的 Placeholder

**任务**:
1. 创建 `src/api/demand.service.ts` — 复用 apiClient
2. 创建 `src/types/demand.types.ts` — Demand 相关类型
3. 创建 `src/pages/DemandList.tsx` — 需求列表页面
4. 更新路由配置，替换 `/demands` 的 Placeholder
5. 遵循 Dashboard 模板模式：loading/error/success

**参考 Backend 端点**:
- `GET /api/v1/admin/demands` — 需求列表 (ADMIN)
- `GET /api/v1/demands/:id` — 需求详情

---

## 八、报告索引

| 编号 | 阶段 | 标题 | 状态 |
|---|---|---|---|
| 105 | M9.1.5 | Auth Persistence Report | Complete |
| 106 | M9.2.1 | Dashboard API Service & Data Foundation Report | Complete |
| 107 | M9.2.2 | Dashboard Statistics Page Report | Complete |
| 108 | M9.2.3 | Dashboard Audit Freeze Report | Complete |
| 109 | — | Project Baseline Audit Report | Complete |
| 110 | M9.2.4 | Context Governance Report | Complete |
| 111 | M9.3.1 | Product Detail Page Report | Complete |
| 112 | M9.3.2 | Product Form Foundation Report | Complete |
| 113 | M9.3 | Product Management Audit & Freeze Report | Complete |

所有报告位于: `f:\Desktop\VISNDT\docs\_review\`

---

## 九、构建命令

```bash
# Admin Frontend 构建
pnpm --filter @visndt/admin build

# 当前构建结果
# exit code: 0
```

---

## 十、关键文件路径速查

| 用途 | 路径 |
|---|---|
| Axios 客户端 | `apps/admin/src/api/client.ts` |
| Dashboard 服务 | `apps/admin/src/api/dashboard.service.ts` |
| Product 服务 | `apps/admin/src/api/product.service.ts` |
| Categories 服务 | `apps/admin/src/api/categories.service.ts` |
| Dashboard 类型 | `apps/admin/src/types/dashboard.types.ts` |
| Product 类型 | `apps/admin/src/types/product.types.ts` |
| Dashboard 页面 | `apps/admin/src/pages/Home.tsx` |
| Product List 页面 | `apps/admin/src/pages/ProductList.tsx` |
| Product Detail 页面 | `apps/admin/src/pages/ProductDetail.tsx` |
| Product Create 页面 | `apps/admin/src/pages/ProductCreate.tsx` |
| Product Edit 页面 | `apps/admin/src/pages/ProductEdit.tsx` |
| Product Form 组件 | `apps/admin/src/components/product/ProductForm.tsx` |
| Auth Store | `apps/admin/src/stores/auth.store.ts` |
| Auth Guard | `apps/admin/src/auth/RequireAuth.tsx` |
| Admin Layout | `apps/admin/src/layouts/AdminLayout.tsx` |
| Router | `apps/admin/src/router/index.tsx` |
| Backend Admin Controller | `apps/api/src/admin/admin.controller.ts` |
| Backend Admin Service | `apps/api/src/admin/admin.service.ts` |
| Prisma Schema | `database/prisma/schema.prisma` |
| 阶段报告目录 | `docs/_review/` |
| AI 上下文目录 | `docs/_context/` |