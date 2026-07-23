# VISNDT 项目上下文交接文档 — M9 Admin V1 完成

> 生成时间: 2026-07-23
> 会话范围: M9.1.5 Auth Persistence → M9.7 Admin V1 Final Audit
> 当前状态: **M9 Admin V1 全部完成并冻结**

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

## 二、当前代码状态快照

### Admin Frontend 完整文件清单 (46 文件, ~3,500 行)

```
apps/admin/src/
├── api/                             # 7 API Services
│   ├── client.ts                    # Axios: baseURL=/api/v1, JWT interceptor, 401 handler
│   ├── categories.service.ts        # categoriesService.getList()
│   ├── dashboard.service.ts         # dashboardService.getStats()
│   ├── demand.service.ts            # demandService: getList, getById
│   ├── organization.service.ts      # organizationService: getList, getById (M9.6)
│   ├── product.service.ts           # productService: getList, getById, create, update
│   ├── user.service.ts              # userService: getList, getById (M9.6)
│   └── index.ts
├── auth/
│   ├── auth.service.ts              # Login/logout
│   ├── auth.types.ts                # AuthUser interface
│   ├── RequireAuth.tsx              # Route guard + token expiry check
│   └── index.ts
├── components/
│   ├── product/
│   │   ├── ProductForm.tsx          # Shared Create/Edit form
│   │   └── index.ts
│   ├── common/index.ts
│   └── index.ts
├── hooks/
│   ├── useAuth.ts                   # Login/logout/checkTokenExpiry
│   ├── useAppStore.ts
│   └── index.ts
├── layouts/
│   └── AdminLayout.tsx              # Sider (collapsible) + Header + Content/Outlet
├── pages/                           # 14 页面组件
│   ├── DemandDetail.tsx             # Demand Detail (M9.4.2)
│   ├── DemandList.tsx               # Demand List (M9.4.1)
│   ├── Home.tsx                     # Dashboard (M9.2)
│   ├── Login.tsx                    # Login form
│   ├── MatchingMonitor.tsx          # Matching Monitor (M9.5.1)
│   ├── NotFound.tsx                 # 404 page
│   ├── OrganizationList.tsx         # Organization List (M9.6.2)
│   ├── Placeholder.tsx              # Placeholder for future use
│   ├── ProductCreate.tsx            # Product Create (M9.3.2)
│   ├── ProductDetail.tsx            # Product Detail (M9.3.1)
│   ├── ProductEdit.tsx              # Product Edit (M9.3.2)
│   ├── ProductList.tsx              # Product List (M9.3)
│   ├── UserList.tsx                 # User List (M9.6.1)
│   └── index.ts
├── providers/
│   ├── AppProvider.tsx
│   └── index.ts
├── router/
│   └── index.tsx                    # 13 routes, RequireAuth guard
├── stores/
│   ├── auth.store.ts                # Zustand + persist: accessToken, user, tokenExpiresAt
│   ├── app.store.ts
│   └── index.ts
├── types/                           # 6 type files
│   ├── api.ts                       # ApiResponse<T>
│   ├── dashboard.types.ts           # DashboardStats + 5 sub-interfaces
│   ├── demand.types.ts              # Demand, DemandParameter, DemandListResponse, SearchDemandParams
│   ├── organization.types.ts        # Organization, OrganizationStatus, OrganizationListResponse
│   ├── product.types.ts             # Product, ProductDetail, ProductFormData, ProductListResponse
│   ├── user.types.ts                # User, UserStatus, UserListResponse, SearchUserParams
│   └── index.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### 路由配置 (完整)

```typescript
'/login'      → <Login />                          (公开)
'/'           → <RequireAuth><AdminLayout /></>     (受保护)
  ├─ '/'              → Navigate to /home
  ├─ '/home'          → <Home />                    (Dashboard)
  ├─ '/products'      → <ProductList />             (M9.3)
  ├─ '/products/create' → <ProductCreate />         (M9.3.2)
  ├─ '/products/:id/edit' → <ProductEdit />         (M9.3.2)
  ├─ '/products/:id'  → <ProductDetail />           (M9.3.1)
  ├─ '/demands'       → <DemandList />              (M9.4.1)
  ├─ '/demands/:id'   → <DemandDetail />            (M9.4.2)
  ├─ '/matching'      → <MatchingMonitor />          (M9.5.1)
  ├─ '/users'         → <UserList />                (M9.6.1)
  └─ '/organizations' → <OrganizationList />        (M9.6.2)
'*'          → <NotFound />
```

---

## 三、项目完整进度时间线

### M6: Auth Foundation
### M7: Business Domain
### M8: Matching Engine + Technical Debt + Architecture Freeze

### M9: Admin System V1 ✅ 完成

#### M9.0: Admin Foundation
(8 sub-phases, Reports 93-100, complete)

#### M9.1: Auth Foundation
(5 sub-phases, Reports 101-105, complete)

#### M9.2: Dashboard V1
- M9.2.1 Dashboard API Service & Data Foundation
- M9.2.2 Dashboard Statistics Page
- M9.2.3 Dashboard Audit + Freeze
- M9.2.4 Context Governance & Documentation Alignment

#### M9.3: Product Management ✅ Frozen
- M9.3.1 Product Detail Page
- M9.3.2 Product Form Foundation (Create/Edit)
- M9.3.3 Product Management Audit & Freeze

#### M9.4: Demand Management ✅ Frozen
- M9.4.1 Demand List Page
- M9.4.2 Demand Detail Page
- M9.4.3 Demand Management Audit & Freeze

#### M9.5: Matching Monitor ✅ Frozen
- M9.5.1 Matching Monitor Page
- M9.5.2 Matching Capability Gap Audit

#### M9.6: User & Organization Management ✅ Frozen
- M9.6.1 User List Page
- M9.6.2 Organization List Page
- M9.6.3 User & Organization Management Audit & Freeze

#### M9.7: Admin V1 Final Audit ✅ Frozen
- M9.7 Final Audit & Freeze

---

## 四、M9 完成状态总结

### 模块完成度

| 模块 | 页面 | 状态 |
|---|---|---|
| Admin Foundation | App, Router, Layout, Providers | ✅ Frozen |
| Admin Auth | Login, RequireAuth, Store | ✅ Frozen |
| Dashboard | Home | ✅ Frozen |
| Product Management | List, Detail, Create, Edit | ✅ Frozen |
| Demand Management | List, Detail | ✅ Frozen |
| Matching Monitor | Monitor | ✅ Frozen |
| User Management | List | ✅ Frozen |
| Organization Management | List | ✅ Frozen |

### 数量统计

| 指标 | 数量 |
|---|---|
| 路由 | 13 |
| 页面组件 | 14 |
| API Service | 7 |
| API 方法 | 12 |
| Type 文件 | 6 |
| 代码行数 | ~3,500 |
| 技术债 | 10 (0 Critical/High) |

### 构建指标

```bash
pnpm --filter @visndt/admin build
# Exit code: 0
# Modules: 4942
# JS: 1,217.67 kB
# CSS: 0.26 kB
```

---

## 五、开发模式与约定

### 页面开发模板 (Discriminated Union)

```typescript
type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: SomeType; total: number };
```

### API Service 模板

```typescript
interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const someService = {
  async getList(params: SomeParams): Promise<SomeListResponse> {
    const response = (await apiClient.get('/path', {
      params,
    })) as unknown as ApiResponseWrapper<SomeListResponse>;
    return response.data;
  },
};
```

### 关键约束 (所有阶段)

1. **Backend 冻结**: 不修改 apps/api, Prisma schema, migration
2. **Auth 冻结**: 不修改 auth 模块, store, router 结构
3. **Layout 冻结**: 不修改 AdminLayout
4. **零依赖**: 不新增 npm 依赖
5. **TypeScript strict**: 零 any/TODO/FIXME
6. **Build 验证**: 每次修改后 exit code 0

---

## 六、已知技术债

| 编号 | 问题 | 位置 | 严重度 |
|---|---|---|---|
| TD1 | `as unknown as` Axios 类型转换 | 所有 service 文件 | Medium |
| TD2 | inline styles | Home.tsx 等 | Medium |
| TD3 | DashboardStatsResponse 在 service 内 | dashboard.service.ts | Low |
| TD4 | ApiResponseWrapper<T> 重复 | 4 个 service | Low |
| TD5 | ProductList inline styles | ProductList.tsx | Low |
| TD6 | loading/error/success 模式重复 | 所有页面 | Low |
| TD7 | STATUS_OPTIONS 重复 | UserList, OrgList | Low |
| TD8 | STATUS_COLOR_MAP 重复 | UserList, OrgList | Low |
| TD9 | passwordHash API 暴露 | Backend users.service | Low |
| TD10 | Placeholder.tsx 未使用 | pages/Placeholder.tsx | Low |

---

## 七、报告索引

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
| 114 | M9.4 | Demand Architecture Plan | Complete |
| 115 | M9.4.1 | Demand List Report | Complete |
| 116 | M9.4.2 | Demand Detail Report | Complete |
| 117 | M9.4 | Demand Management Audit & Freeze Report | Complete |
| 118 | M9.5.1 | Matching Architecture Plan | Complete |
| 119 | M9.5.1 | Matching Monitor Report | Complete |
| 120 | M9.5.2 | Matching Capability Gap Audit | Complete |
| 121 | M9.6.1 | User Management Architecture Plan | Complete |
| 122 | M9.6.1 | User List Report | Complete |
| 123 | M9.6.2 | Organization List Report | Complete |
| 124 | M9.6.3 | User & Organization Audit Report | Complete |
| 125 | M9.7 | Admin V1 Final Audit Report | Complete |
| 126 | M9 | Closeout Report | Complete |

---

## 八、关键文件路径速查

| 用途 | 路径 |
|---|---|
| Axios 客户端 | `apps/admin/src/api/client.ts` |
| Dashboard 服务 | `apps/admin/src/api/dashboard.service.ts` |
| Product 服务 | `apps/admin/src/api/product.service.ts` |
| Demand 服务 | `apps/admin/src/api/demand.service.ts` |
| User 服务 | `apps/admin/src/api/user.service.ts` |
| Organization 服务 | `apps/admin/src/api/organization.service.ts` |
| Product 类型 | `apps/admin/src/types/product.types.ts` |
| Demand 类型 | `apps/admin/src/types/demand.types.ts` |
| User 类型 | `apps/admin/src/types/user.types.ts` |
| Organization 类型 | `apps/admin/src/types/organization.types.ts` |
| Product List | `apps/admin/src/pages/ProductList.tsx` |
| Product Detail | `apps/admin/src/pages/ProductDetail.tsx` |
| Product Form | `apps/admin/src/components/product/ProductForm.tsx` |
| Demand List | `apps/admin/src/pages/DemandList.tsx` |
| Demand Detail | `apps/admin/src/pages/DemandDetail.tsx` |
| Matching Monitor | `apps/admin/src/pages/MatchingMonitor.tsx` |
| User List | `apps/admin/src/pages/UserList.tsx` |
| Organization List | `apps/admin/src/pages/OrganizationList.tsx` |
| Auth Guard | `apps/admin/src/auth/RequireAuth.tsx` |
| Auth Store | `apps/admin/src/stores/auth.store.ts` |
| Router | `apps/admin/src/router/index.tsx` |
| Backend Admin | `apps/api/src/admin/admin.controller.ts` |
| Backend Demand | `apps/api/src/demands/demands.controller.ts` |
| Prisma Schema | `database/prisma/schema.prisma` |
| 阶段报告目录 | `docs/_review/` |
| AI 上下文目录 | `docs/_context/` |