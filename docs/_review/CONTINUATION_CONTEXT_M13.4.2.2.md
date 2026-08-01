# VISNDT M13.4 任务接续上下文

## 项目概述

VISNDT 是工业检测设备产品信息平台 + 需求撮合平台。技术栈：Next.js 15 (App Router) + React 19 + TypeScript（前端），NestJS + Prisma + PostgreSQL（后端），pnpm monorepo。

**项目根目录：** `F:\Desktop\VISNDT\VISNDT`

---

## 已完成阶段

| 阶段 | 内容 | 报告 |
|------|------|------|
| M13.4.0 | Web Frontend Architecture Review (3 份报告) | 242, 243, 244 |
| M13.4.0.2 | Business Model Final Alignment | 245 |
| M13.4.0.3 | Web Development Freeze Confirmation | 246 |
| M13.4.1 | Backend Web API Enhancement (3 批次) | 247-251 |
| M13.4.1 补充 | Blueprint 对齐审计 | 252 |
| **M13.4.2.1** | **Web Foundation Architecture** ✅ | **253** |

---

## 当前状态：M13.4.2.1 刚完成

### 已创建的文件 (23 个)

**路由骨架 (11 页面):**
```
apps/web/src/app/
├── products/page.tsx
├── products/[slug]/page.tsx
├── categories/page.tsx
├── solutions/page.tsx
├── knowledge/page.tsx
├── business/page.tsx
├── about/page.tsx
├── login/page.tsx
├── register/page.tsx
├── dashboard/page.tsx
└── workspace/page.tsx
```

**Layout 组件 (3):**
```
apps/web/src/components/layout/
├── PublicHeader.tsx    (导航: Home|Products|Categories|Solutions|Knowledge|About)
├── PublicFooter.tsx    (版权 + 链接)
└── DashboardLayout.tsx (侧边栏 + 内容区)
```

**Common 组件 (3):**
```
apps/web/src/components/common/
├── Loading.tsx         (转圈 spinner)
├── ErrorState.tsx      (错误 + 重试)
└── EmptyState.tsx      (空数据占位)
```

**Lib 基础 (3):**
```
apps/web/src/lib/
├── constants.ts        (API_BASE_URL, AUTH_TOKEN_KEY, ROUTES)
├── auth.ts             (getToken/setToken/removeToken → localStorage)
└── api-client.ts       (fetch 封装 + JWT Bearer 注入 + ApiError)
```

**Auth 基础 (3):**
```
apps/web/src/auth/
├── AuthProvider.tsx    (Context: user, token, login, logout)
├── AuthGuard.tsx       (路由保护 → 重定向到 /login)
└── RoleGuard.tsx       (角色: BUYER/SUPPLIER/ADMIN)
```

### Build 验证

```
pnpm --filter @visndt/web build → exit code 0, 14/14 routes compiled
```

### M13.4.1 后端 API (已在之前完成)

```
apps/api/src/ 已修改:
├── organizations.controller.ts  (GET /:id 公开化)
├── organizations.service.ts     (新增 findOnePublic)
├── demands.controller.ts        (新增 GET /mine)
├── rfqs/controller + service    (新增 GET /mine, org-scoped)
├── rfq-responses/controller + service (新增 GET /mine, org-scoped)
├── inquiries/ 模块 (新建)       (POST /inquiries, Public → Notification)
└── app.module.ts                (注册 InquiriesModule)
```

---

## 下一步：M13.4.2.2 Web Public Pages Foundation

**任务：** 将路由骨架升级为有实际内容的公共页面。

**待开发页面：**
- `/` 首页 (Product 精选 + ProductCategory)
- `/products` 产品列表 (搜索/过滤/分页)
- `/products/[slug]` 产品详情 (技术参数/图片/制造商信息/Inquiry 按钮)
- `/categories` 分类浏览
- `/about` 关于我们 (静态)

**API 对接：**
- `GET /products` (已有)
- `GET /products/:id` (已有)
- `GET /product-categories` (已有)
- `POST /inquiries` (M13.4.1 新增)

---

## 关键约束 (Freeze Rules)

### 禁止事项
- ❌ 修改 Backend API (apps/api/)
- ❌ 修改 Prisma Schema (database/prisma/schema.prisma)
- ❌ 创建 Migration
- ❌ 修改 apps/admin/
- ❌ Supplier Store / Shop / Product Catalog / Ranking / Rating / Follow
- ❌ `/suppliers` 独立页面
- ❌ Supplier SEO 页面

### 商业模型
- 产品中心是唯一主要公开流量入口
- 供应商只能作为产品来源展示（在产品详情页出现制造商信息）
- 供应商工作空间 = `/dashboard` (统一 User Dashboard，非独立 Portal)
- Buyer 和 Supplier 是同一 Dashboard 中的不同角色

### 技术栈
- 状态管理：Zustand (Blueprint 604)
- 数据缓存：TanStack Query (Blueprint 605)
- JWT 存储：localStorage (Admin 同款模式)
- 部署：Docker (非 Vercel)

### 重要参考文档
- `docs/VISNDT-Blueprint/600_Frontend/` (10 份冻结设计文档，~150K 行)
- `docs/_review/252_M13.4.1_Blueprint_Alignment_Conclusion.md` (Blueprint 对齐结论)
- `docs/_review/253_M13.4.2.1_Web_Foundation_Report.md` (刚完成的 Foundation 报告)

---

## 接续指令

请继续执行 **M13.4.2.2 — Web Public Pages Foundation**，将已有路由骨架升级为包含实际内容、API 对接、组件组合的公共页面。当前所有路由骨架和基础组件已就绪，Build 通过。