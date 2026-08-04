# VISNDT Platform Capability Report

**Date**: 2026-08-04  
**Phase**: M13.9.2 Asset Documentation Audit  
**Scope**: Full Platform (apps/api, apps/admin, apps/web, database, packages)  
**Status**: M13.9 Freeze  

---

## 1. 项目概述

VISNDT 是一个工业无损检测设备信息平台。平台采用前后端分离架构，当前处于 M13.9 Web MVP Freeze 阶段。

### 1.1 项目定位

- **核心价值**：连接工业检测设备买家与制造商，提供产品信息、技术参数查询和询价通道
- **目标用户**：工业检测设备采购方（Buyer）、设备制造商/供应商（Supplier）
- **当前阶段**：MVP — Buyer 端 Web 已冻结，Supplier 端待开发

### 1.2 项目规模

| 维度 | 数值 |
|------|------|
| 总代码仓库 | Monorepo (5 个子项目) |
| 后端模块 | 24 个 NestJS 模块 |
| 后端控制器 | 25 个 |
| 数据模型 | 23 个 Prisma 模型 + 16 个枚举 |
| 数据库迁移 | 16 次 |
| Admin 页面 | 44 个 |
| Web 路由 | 20 个 |
| 共享包 | 2 个 (config, shared-types) |

---

## 2. 当前技术架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     VISNDT PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  apps/web    │  │ apps/admin   │  │  External     │       │
│  │  Next.js 15  │  │  React 19    │  │  API Clients  │       │
│  │  (Buyer UI)  │  │  Antd 5      │  │               │       │
│  │  Port 3000   │  │  Port 3001   │  │               │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘       │
│         │                 │                 │                │
│         └────────┬────────┘                 │                │
│                  │                          │                │
│                  ▼                          ▼                │
│  ┌──────────────────────────────────────────────────┐        │
│  │              apps/api (NestJS 11)                │        │
│  │        24 Modules  │  25 Controllers             │        │
│  │        JWT Auth + CSRF + Swagger                 │        │
│  └──────────────────────┬───────────────────────────┘        │
│                         │                                     │
│          ┌──────────────┼──────────────┐                     │
│          ▼              ▼              ▼                     │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────┐             │
│  │  PostgreSQL  │ │  S3      │ │  Prisma ORM  │             │
│  │  (Primary)   │ │  (Files) │ │  (database/) │             │
│  └──────────────┘ └──────────┘ └──────────────┘             │
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │              packages/                            │        │
│  │  config (shared config) + shared-types            │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈明细

| 层次 | 技术 | 版本 |
|------|------|------|
| **Frontend (Web)** | Next.js App Router, React, Tailwind CSS, TanStack Query | 15.5.20 / 19 / 4 / 5.101 |
| **Frontend (Admin)** | React, Vite, Ant Design, React Router, Zustand | 19 / 6 / 5.29 / 7.18 / 5 |
| **Backend** | NestJS, TypeScript, Passport JWT, Swagger | 11 / 5.7 / 0.7 / 11.4 |
| **Database** | PostgreSQL, Prisma ORM | — / 7.8 |
| **Storage** | AWS S3 Compatible | SDK 3.1096 |
| **Auth** | JWT (HttpOnly Cookie), CSRF (Double Submit), Refresh Token | — |
| **Security** | Helmet, Throttler, Bcrypt | 8.3 / 6.5 / 6.0 |
| **Validation** | class-validator, class-transformer | 0.15 / 0.5 |

---

## 3. Backend 能力

### 3.1 技术栈

| 组件 | 技术 |
|------|------|
| Runtime | Node.js (NestJS 11) |
| Language | TypeScript 5.7 (strict) |
| HTTP | Express (NestJS Platform) |
| ORM | Prisma 7.8 |
| Auth | JWT + Passport + RefreshToken |
| CSRF | Double Submit Cookie |
| File Upload | Multer + S3 SDK |
| API Docs | Swagger (OpenAPI) |
| Validation | class-validator + DTO |
| Rate Limiting | @nestjs/throttler |
| Security Headers | Helmet |

### 3.2 Module 清单 (24 Modules)

| # | Module | Controllers | Scope |
|---|--------|------------|-------|
| 1 | Auth | auth, invitation | Login, Register, Refresh, CSRF, Invitation |
| 2 | Users | users | User CRUD, Profile |
| 3 | Organizations | organizations, organization-members | Organization CRUD, Member management |
| 4 | Products | products | Product CRUD, Search, Filter |
| 5 | Product Categories | product-categories | Category CRUD, Tree |
| 6 | Product Parameters | parameter-definitions, parameter-groups, product-parameters | Parameter schema + values |
| 7 | Product Media | product-media | Product images, documents, certificates |
| 8 | File Asset | file-asset | S3 file upload, orphan cleanup |
| 9 | Demands | demands | Demand CRUD, My Demands |
| 10 | Offers | offers | Offer lifecycle (DRAFT→SUBMITTED→ACCEPTED/REJECTED) |
| 11 | RFQs | rfqs | RFQ CRUD, RFQ lifecycle |
| 12 | RFQ Responses | rfq-responses | RFQ Response submission |
| 13 | Matching | — | Demand-Product matching engine |
| 14 | Inquiries | inquiries | Product inquiry submission |
| 15 | Notifications | notifications | Notification CRUD, Read/Unread |
| 16 | Workflow Events | workflow-events | Entity lifecycle audit trail |
| 17 | Admin | admin, admin-audit-log, admin-demand, admin-inquiry, admin-matching | Admin management endpoints |
| 18 | Health | health | Health check endpoint |
| 19 | Prisma | — | Database service |
| 20 | Common | — | Filters, interceptors, security, throttling |

### 3.3 API 规模

| 分类 | 控制器数 | 估计端点 |
|------|---------|---------|
| Public (无需认证) | 5 | ~15 |
| JWT (需登录) | 8 | ~30 |
| Admin (管理员) | 7 | ~40 |
| System | 2 | ~3 |
| **总计** | **25** | **~88** |

### 3.4 数据模型 (23 Models)

| 域 | 模型 | 描述 |
|----|------|------|
| **Identity** | User, RefreshToken, Organization, UserInvitation, OrganizationMember | 用户、组织、邀请、成员 |
| **Product** | ProductCategory, Product, ProductMedia, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | 产品目录、分类、参数体系 |
| **Offer** | Offer | 供应商报价 |
| **Demand/RFQ** | Demand, DemandParameter, DemandMatch, RFQ, RFQResponse | 需求、匹配、询价、响应 |
| **Workflow** | WorkflowEvent, Notification | 工作流事件、通知 |
| **System** | FileAsset, AuditLog, Inquiry | 文件资产、审计日志、询价 |

### 3.5 已实现业务能力

| 能力 | 状态 | 说明 |
|------|------|------|
| 用户认证 | ✅ | JWT Login/Register + RefreshToken + CSRF |
| 组织管理 | ✅ | Organization CRUD + Member 邀请 |
| 产品管理 | ✅ | Product CRUD + 分类 + 参数 + 媒体 |
| 参数体系 | ✅ | Parameter Group → Definition → Option → Value |
| 文件存储 | ✅ | S3 上传 + Orphan 清理 |
| 需求管理 | ✅ | Demand CRUD + 参数化需求 |
| 智能匹配 | ✅ | Demand-Product 自动匹配 + 评分 |
| 报价管理 | ✅ | Offer 生命周期 (DRAFT→SUBMITTED→ACCEPTED/REJECTED) |
| RFQ 流程 | ✅ | RFQ CRUD + Response + 生命周期 |
| 询价通道 | ✅ | Public Inquiry 提交 |
| 通知系统 | ✅ | Notification 创建/查询/已读 |
| 工作流事件 | ✅ | WorkflowEvent 审计追踪 |
| 审计日志 | ✅ | AuditLog 全量操作记录 |
| Admin 管理 | ✅ | Admin 专用管理接口 |
| API 文档 | ✅ | Swagger 自动生成 |

---

## 4. Admin 能力

### 4.1 技术栈

| 组件 | 技术 |
|------|------|
| Framework | React 19 + Vite 6 |
| UI Library | Ant Design 5.29 |
| Routing | React Router 7.18 |
| State | Zustand 5 |
| HTTP | Axios |
| Auth | Login page + Token |

### 4.2 已完成页面 (44 Pages)

| 分类 | 页面 | 功能 |
|------|------|------|
| **Dashboard** | Home | 首页仪表盘 |
| **用户管理** | UserList, UserCreate, UserDetail, UserEdit | 用户 CRUD |
| **组织管理** | OrganizationList, OrganizationCreate, OrganizationDetail, OrganizationEdit | 组织 CRUD |
| **产品管理** | ProductList, ProductCreate, ProductDetail, ProductEdit | 产品 CRUD |
| **分类管理** | ProductCategoryList, ProductCategoryCreate, ProductCategoryEdit | 分类 CRUD |
| **参数管理** | ParameterGroupList/Create/Edit, ParameterDefinitionList/Create/Edit | 参数体系管理 |
| **媒体管理** | ProductMediaList, ProductMediaCreate, ProductMediaEdit | 产品媒体管理 |
| **需求管理** | DemandList, DemandDetail | Demand 查看 |
| **报价管理** | OfferList, OfferDetail | Offer 查看 |
| **RFQ 管理** | RfqList, RfqDetail, RfqCreate | RFQ CRUD |
| **RFQ 响应** | RfqResponseDetail | Response 查看 |
| **询价管理** | InquiryList, InquiryDetail | Inquiry 查看 |
| **匹配监控** | MatchingMonitor, MatchDetail | 匹配结果查看 |
| **通知管理** | NotificationList, NotificationDetail | 通知查看 |
| **审计日志** | AuditLogList | 审计日志查询 |
| **文件资产** | FileAssetOrphanList | 孤儿文件清理 |
| **系统** | Login, NotFound, Placeholder | 登录、404、占位 |

### 4.3 当前状态

| 维度 | 状态 |
|------|------|
| 管理覆盖面 | 完整 — 覆盖所有数据模型 |
| CRUD 完整性 | 核心实体有完整 CRUD，部分仅查看 |
| 认证 | Login 页面，Token 管理 |
| 运营能力 | 审计日志、孤儿文件清理 |

---

## 5. Web MVP 能力

### 5.1 技术栈

| 组件 | 技术 |
|------|------|
| Framework | Next.js 15.5.20 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Data Fetching | TanStack React Query 5.101 |
| Auth | HttpOnly Cookie JWT + CSRF |

### 5.2 路由清单 (20 Routes)

**公共页面 (10 routes):**

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Static | 首页 |
| `/about` | Static | 关于我们 |
| `/business` | Static | 商务合作 |
| `/categories` | Static | 分类浏览 |
| `/products` | Static | 产品列表（搜索+筛选+分页） |
| `/products/[slug]` | Dynamic | 产品详情 |
| `/knowledge` | Static | 知识中心 |
| `/solutions` | Static | 解决方案 |
| `/login` | Static | 登录 |
| `/register` | Static | 注册 |

**用户页面 (9 routes, AuthGuard):**

| Route | Type | Purpose |
|-------|------|---------|
| `/dashboard` | Static | 仪表盘 |
| `/workspace` | Static | 工作台 |
| `/workspace/demands` | Static | 需求列表 |
| `/workspace/demands/[id]` | Dynamic | 需求详情 |
| `/workspace/demands/create` | Static | 创建需求 |
| `/workspace/rfqs` | Static | RFQ 列表 |
| `/workspace/rfqs/[id]` | Dynamic | RFQ 详情 |
| `/workspace/rfqs/create` | Static | 创建 RFQ |
| `/workspace/matches` | Static | 匹配列表 |
| `/workspace/settings` | Static | 账户设置 |

**系统 (1 route):**

| Route | Type | Purpose |
|-------|------|---------|
| `/_not-found` | Static | 404 页面 |

### 5.3 用户流程

当前闭环流程：

```
用户注册
    │
    ▼
用户登录
    │
    ▼
浏览产品 (产品列表/详情)
    │
    ├── 提交询价 (Inquiry)
    │
    ▼
进入 Workspace
    │
    ▼
创建需求 (Demand)
    │
    ▼
系统自动匹配 (Match)
    │
    ▼
查看匹配结果
    │
    ▼
基于需求创建 RFQ
    │
    ▼
查看 RFQ 响应
```

---

## 6. 用户业务流程

### 6.1 Buyer 完整旅程

```
1. 访客浏览
   └── 首页 → 分类浏览 → 产品列表 → 产品详情

2. 提交询价
   └── 产品详情页 → 填写询价表单 → 提交成功

3. 注册/登录
   └── 注册 → 登录 → Dashboard

4. 需求管理
   └── Workspace → 创建需求 → 需求列表 → 需求详情

5. 匹配查看
   └── Workspace → 匹配列表 → 查看系统推荐产品

6. RFQ 流程
   └── 选择需求 → 创建 RFQ → RFQ 列表 → RFQ 详情 → 查看响应
```

### 6.2 当前业务闭环

| 步骤 | 已实现 | 说明 |
|------|--------|------|
| 用户注册 | ✅ | Email + Password |
| 登录 | ✅ | JWT Cookie |
| 浏览产品 | ✅ | 搜索 + 筛选 + 分页 |
| 产品详情 | ✅ | 参数 + 媒体 + 制造商 |
| 提交询价 | ✅ | Inquiry 表单 |
| 创建需求 | ✅ | Demand 表单 |
| 系统匹配 | ✅ | 自动匹配引擎 |
| 查看匹配 | ✅ | Match 列表 |
| 创建 RFQ | ✅ | 从 Demand 创建 |
| 查看 RFQ 响应 | ✅ | Response 列表 |
| 供应商响应 RFQ | ❌ | 待 M14 实现 |
| 交易推进 | ❌ | 待 M14+ 实现 |
| 平台运营 | ⚠️ | Admin 有基础，运营流程待完善 |

---

## 7. 当前已完成模块

### 7.1 完成度评分

| 模块 | 成熟度 | 评分 |
|------|--------|------|
| 用户认证 (Auth) | 完整 | 95/100 |
| 产品管理 (Product) | 完整 | 90/100 |
| 分类体系 (Category) | 完整 | 90/100 |
| 参数体系 (Parameter) | 完整 | 90/100 |
| 文件存储 (FileAsset) | 完整 | 85/100 |
| 需求管理 (Demand) | 完整 | 95/100 |
| 智能匹配 (Matching) | 完整 | 85/100 |
| 报价管理 (Offer) | 完整 | 65/100 |
| RFQ 流程 (RFQ) | Buyer 端完整 | 70/100 |
| 询价通道 (Inquiry) | 基础 | 40/100 |
| 通知系统 (Notification) | 完整 | 90/100 |
| 工作流事件 (Workflow) | 完整 | 75/100 |
| 审计日志 (AuditLog) | 完整 | 80/100 |
| Admin 管理面板 | 完整 | 85/100 |
| Web Buyer 端 | 完整 | 90/100 |
| 组织管理 (Organization) | 完整 | 85/100 |

---

## 8. 当前限制

### 8.1 功能限制

| 限制 | 影响 | 优先级 |
|------|------|--------|
| 无 Supplier 端 | 供应商无法在平台运营 | P0 |
| RFQ 只有 Buyer 创建 | 缺少 Supplier 响应和竞价 | P0 |
| Offer 管理不完整 | 供应商无法管理报价 | P0 |
| 无产品图片 | 所有产品显示占位符 | P1 |
| 静态页面硬编码 | About/Business 等内容不可编辑 | P2 |
| RoleGuard 未实现 | 无角色区分 | P1 |
| Inquiry 只有 POST | 无列表/管理功能 | P1 |

### 8.2 技术限制

| 限制 | 影响 | 优先级 |
|------|------|------|
| 无 E2E 测试 | 回归风险 | P1 |
| 无单元测试 | 后端逻辑无覆盖 | P1 |
| Match N+1 查询 | 性能影响 | P2 |
| 无图片优化 | 加载性能 | P2 |
| 6 个未使用组件 | 代码整洁度 | P2 |

---

## 9. 后续发展方向

### 9.1 M14 核心方向

| 方向 | 描述 | 优先级 |
|------|------|--------|
| Supplier 体系 | Supplier Workspace + Offer 管理 + RFQ 响应 | P0 |
| 业务闭环 | RFQ 完整流程 (Buyer→Supplier→Response→Accept) | P0 |
| 平台运营 | Admin 运营增强 + 数据分析 | P1 |
| 质量提升 | 测试 + 性能优化 + 图片 | P1 |

### 9.2 长期愿景

| 阶段 | 目标 |
|------|------|
| M14 | Supplier 上线 + 业务闭环 |
| M15 | 智能匹配增强 + 数据分析 |
| M16 | 交易推进 + 平台生态 |
| M17+ | AI 辅助 + 行业标准 |

---

## 10. 当前版本状态

| 维度 | 状态 |
|------|------|
| 版本 | M13.9 Freeze |
| 后端 | 24 Modules, 25 Controllers, ~88 Endpoints |
| 数据库 | 23 Models, 16 Enums, 16 Migrations |
| Admin | 44 Pages, 覆盖所有数据模型 |
| Web | 20 Routes, Buyer 端完整 |
| 架构 | Monorepo, 前后端分离 |
| 安全 | JWT + CSRF + RefreshToken + Helmet |
| 文档 | Swagger + 3份 Review 报告 |
| 测试 | 0 (待 M14 建立) |
| 构建 | Web + API 均通过 |