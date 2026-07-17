# MVP Engineering Implementation Plan v1.0

本文档是 VISNDT Blueprint v1.0 的工程实施计划，用于指导从 Blueprint 到实际工程代码实现的转换。

生成时间：2026-07-16

版本：v1.0

状态：FROZEN

---

# 1. Document Purpose

- 本文档用于指导 VISNDT Blueprint v1.0 到实际工程代码实现的转换。
- 本文档不是新的架构设计。
- 本文档是工程执行计划。
- AI Coding Agent 后续开发必须遵循本文档。

---

# 2. Engineering Baseline

## 2.1 Baseline Source

引用：[TECH_STACK_DECISION.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/TECH_STACK_DECISION.md)

## 2.2 Frozen Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js | FROZEN |
| Frontend Language | TypeScript | FROZEN |
| Frontend UI | React | FROZEN |
| Client State | Zustand | FROZEN |
| Server State | TanStack Query | FROZEN |
| Backend | NestJS | FROZEN |
| Backend Language | TypeScript | FROZEN |
| ORM | Prisma | FROZEN |
| Database | PostgreSQL | FROZEN |
| Storage | S3 Compatible Object Storage | FROZEN |
| Deployment | Container Based | FROZEN |
| MVP Search | PostgreSQL Full Text Search + pg_trgm | FROZEN |
| AI (Phase 2) | pgvector | FROZEN |

## 2.3 Prohibited Historical Technologies

不得使用以下历史技术方案：

| Technology | Reason |
|-----------|--------|
| Vue3 | Historical alternative — Blueprint v1.0 freezes Next.js |
| Hono | Historical alternative — Blueprint v1.0 freezes NestJS |
| SQLite | Not for production — Blueprint v1.0 freezes PostgreSQL |
| Elasticsearch MVP | MVP uses PostgreSQL built-in search — Phase 2 may introduce vector search |
| Pinia | Historical state management — migrated to Zustand + TanStack Query |

---

# 3. Repository Target Architecture

## 3.1 Monorepo Structure

未来代码仓库目标结构：

```
VISNDT/
├── apps/
│   ├── web/                    # Next.js Application
│   └── api/                    # NestJS Application
├── packages/
│   ├── shared-types/           # Shared TypeScript types
│   └── common-utils/           # Common utilities
├── database/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma Schema
│   │   └── migrations/         # Prisma Migrations
│   └── seeds/                  # Seed data
├── docker/
│   ├── docker-compose.yml      # Development containers
│   ├── postgres/               # PostgreSQL configuration
│   └── minio/                  # S3-compatible storage (dev)
├── docs/
│   ├── VISNDT-Blueprint/       # Blueprint v1.0 (source of truth)
│   ├── _review/                # Review & validation reports
│   └── _implementation/        # Implementation plans
└── README.md
```

## 3.2 Architecture Principle

采用前后端分离、Monorepo 管理模式。

- `apps/web` — Next.js 前端，通过 API 层与后端通信
- `apps/api` — NestJS 后端，通过 Prisma 与 PostgreSQL 通信
- `packages/shared-types` — 前后端共享的 TypeScript 类型定义
- `database/prisma` — 数据库 Schema 和 Migration，单一数据源

---

# 4. MVP Implementation Philosophy

## 4.1 Core Principle

开发顺序必须按照业务闭环，而不是按照文档目录顺序。

## 4.2 Core Business Loop

```
Organization
    ↓
Standard Product
    ↓
Offer
    ↓
Demand
    ↓
RFQ
    ↓
Organization Response
    ↓
Workflow
    ↓
Notification
```

## 4.3 Implementation Priority

每个 Phase 必须产生可验证的业务价值，而非纯技术基础。

---

# 5. MVP Development Phases

## Phase M0: Foundation

### 目标

建立运行环境。

### 包含

- Repository initialization
- Monorepo setup (Turborepo or npm workspaces)
- Next.js initialization (`apps/web`)
- NestJS initialization (`apps/api`)
- PostgreSQL Docker environment (`docker-compose.yml`)
- Prisma initialization (`database/prisma/schema.prisma`)
- Environment configuration (`.env`, `.env.example`)

### 验收标准

| Component | Acceptance Criteria |
|-----------|-------------------|
| Next.js | `npm run dev` starts successfully |
| NestJS | `npm run start:dev` starts successfully |
| PostgreSQL | `docker-compose up` starts, connection test passes |
| Prisma | `npx prisma migrate dev` executes successfully |

---

## Phase M1: Identity & Organization

### 实现

- User
- Organization
- Organization Member
- Role

### 数据模型

| Entity | Description |
|--------|-------------|
| User | 平台用户（登录、基本信息） |
| Organization | 供应组织（企业信息、资质） |
| OrganizationMember | 组织成员关联 |
| Role | 角色与权限 |

### 目标

建立身份和权限基础。后续所有业务模块依赖此 Phase。

### 验收标准

- 用户注册/登录流程可运行
- Organization 创建/管理流程可运行
- 角色权限框架就绪

---

## Phase M2: Standard Product Center

### 实现

- Product
- Category
- Parameter Definition
- Parameter Template
- Dynamic Parameter Value

### 数据模型

| Entity | Description |
|--------|-------------|
| Product | 标准产品（平台统一维护） |
| Category | 产品分类 |
| ParameterDefinition | 参数定义 |
| ParameterTemplate | 参数模板（关联分类） |
| ProductParameterValue | 产品参数值（EAV 模型） |

### 重要规则

- 禁止创建 Supplier Product。
- 产品由平台维护。
- 供应商不能修改 Product。
- 供应商仅通过 Offer 引用 Product。

### 验收标准

- 产品 CRUD 完整可运行
- 参数定义、模板、实例化链路完整
- 产品分类与参数筛选可运行

---

## Phase M3: Offer Center

### 实现

- Organization Offer
- Product Offer Relationship

### 数据模型

| Entity | Description |
|--------|-------------|
| Offer | 组织供应能力（报价、产能、服务） |
| OfferProduct | Offer 与 Standard Product 的关联 |

### 规则

Offer 是 Organization 与 Standard Product 的连接对象。

### 验收标准

- Organization 可以创建 Offer
- Offer 可以关联 Standard Product
- Offer 列表和详情页可运行

---

## Phase M4: Demand Center

### 实现

- Demand Creation
- Demand Parameters
- Demand Status

### 数据模型

| Entity | Description |
|--------|-------------|
| Demand | 采购需求 |
| DemandParameter | 需求参数（关联产品/检测对象） |
| DemandStatus | 需求状态流转 |

### 验收标准

- 用户可以提交 Demand
- Demand 可以关联产品和参数
- Demand 状态流转可运行

---

## Phase M5: RFQ Workflow

### 实现流程

```
Demand
    ↓
RFQ Creation
    ↓
Organization Response
    ↓
Workflow Status
```

### 数据模型

| Entity | Description |
|--------|-------------|
| RFQ | 询价单 |
| RFQResponse | 组织响应（报价） |
| RFQStatus | 询价状态流转 |

### 验收标准

- Demand 可以触发 RFQ 创建
- Organization 可以查看和响应 RFQ
- RFQ 状态流转完整可运行

---

## Phase M6: Search

### MVP

使用：

- PostgreSQL Full Text Search
- pg_trgm

### 禁止

- Elasticsearch

### 验收标准

- 产品搜索（全文 + 模糊匹配）
- 分类浏览
- 参数筛选搜索
- Demand 搜索

---

## Phase M7: Notification

### 实现

- Notification
- Event
- User Inbox

### 数据模型

| Entity | Description |
|--------|-------------|
| Notification | 通知记录 |
| NotificationEvent | 通知事件（Demand 更新、RFQ 响应等） |
| UserInbox | 用户通知收件箱 |

### 验收标准

- 站内通知可运行
- 通知事件触发正常
- 用户通知列表和已读状态可运行

---

# 6. Database Implementation Strategy

## 6.1 Migration Approach

数据库采用 Migration 逐步演进。

## 6.2 Migration Sequence

| Migration | Content | Phase |
|-----------|---------|-------|
| Migration 001 | Identity (User, Organization, Role) | M1 |
| Migration 002 | Organization + Product (Category, ParameterDefinition, ParameterTemplate) | M1 + M2 |
| Migration 003 | Offer + Demand + RFQ (OfferProduct, DemandParameter, RFQResponse) | M3 + M4 + M5 |
| Migration 004 | Notification + Audit (Notification, NotificationEvent, UserInbox) | M7 |

## 6.3 Migration Rules

- 每个 Migration 必须是可回滚的。
- 不允许手动修改数据库。
- 所有 Schema 变更通过 Prisma Migration 执行。
- Migration 命名遵循：`YYYYMMDDHHMMSS_description`

---

# 7. API Implementation Sequence

## 7.1 API Domain Order

```
/auth
    ↓
/organizations
    ↓
/products
    ↓
/offers
    ↓
/demands
    ↓
/rfqs
    ↓
/notifications
```

## 7.2 API Contract Requirements

API 必须遵循：

- [502_API_Design_Specification.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/500_Backend/502_API_Design_Specification.md)
- [503_OpenAPI_Specification.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/500_Backend/503_OpenAPI_Specification.md)

## 7.3 API Boundary Rules

| API Domain | Responsibility | Prohibited |
|-----------|---------------|------------|
| Product API | Standard Product 查询 | Organization 创建 Product |
| Parameter Metadata API | 参数定义、模板、渲染元数据 | — |
| Offer API | Organization 管理供应能力 | 修改 Product |
| Demand API | 采购需求创建与查询 | 直接修改 RFQ |
| RFQ API | 询价流程、响应与状态流转 | 绕过 Demand 创建 RFQ |
| Notification API | 站内通知与状态读取 | — |
| Organization API | 组织管理 | 创建 Product |

---

# 8. Frontend Implementation Sequence

## 8.1 Public Side

| # | Page | Route | Key Components |
|---|------|-------|---------------|
| 1 | Home | `/` | SearchBar, ProductCard, CategoryNav |
| 2 | Product List | `/products` | FilterPanel, ProductCard, Pagination |
| 3 | Product Detail | `/products/[id]` | ProductInfo, ParameterTable, OfferList |
| 4 | Demand Entry | `/demand/submit` | DemandForm, ProductSelector |

## 8.2 Organization Side

| # | Page | Route | Key Components |
|---|------|-------|---------------|
| 1 | Dashboard | `/dashboard` | StatsCard, ActivityFeed |
| 2 | Offer Management | `/dashboard/offers` | OfferList, OfferForm, ProductSelector |
| 3 | RFQ Inbox | `/dashboard/rfqs` | RFQList, RFQCard, FilterBar |
| 4 | Response Management | `/dashboard/rfqs/[id]` | ResponseForm, QuotationForm |
| 5 | Notification Center | `/dashboard/notifications` | NotificationList |

## 8.3 Frontend Architecture Rules

- 统一使用 Next.js App Router
- 页面组件默认 Server Component
- 交互组件标记 `'use client'`
- 业务组件（ProductCard, ParameterTable, DemandForm）标记为 Client Component
- Client State: Zustand
- Server State: TanStack Query
- 样式：CSS Modules / Tailwind CSS
- 图片：next/image

---

# 9. AI Coding Constraints

## 9.1 Prohibited

AI Coding Agent 明确禁止：

| # | Prohibition | Reason |
|---|------------|--------|
| 1 | ❌ 创建 Supplier Product | 业务模型已冻结为 Standard Product + Offer |
| 2 | ❌ 使用 Vue | 前端已冻结为 Next.js + React |
| 3 | ❌ 使用 Hono | 后端已冻结为 NestJS |
| 4 | ❌ 使用 SQLite | 数据库已冻结为 PostgreSQL |
| 5 | ❌ 使用 Elasticsearch 作为 MVP Search | MVP Search 使用 PostgreSQL Full Text Search |
| 6 | ❌ 修改 Blueprint 决策 | Blueprint 是唯一设计来源 |
| 7 | ❌ 使用 Requirement/Matching/Supplier 术语 | 术语已统一为 Canonical Naming Specification |
| 8 | ❌ 绑定特定云厂商 | 部署必须 Provider 无关 |

## 9.2 Required

AI Coding Agent 必须：

| # | Requirement | Rationale |
|---|------------|-----------|
| 1 | ✅ TypeScript | 全栈 TypeScript 类型安全 |
| 2 | ✅ Domain Module | 按业务领域组织代码 |
| 3 | ✅ Prisma Migration | 所有数据库变更通过 Migration |
| 4 | ✅ API Contract First | 先定义 API 契约，再实现 |
| 5 | ✅ 遵循 Blueprint v1.0 | 以 Blueprint 为唯一设计来源 |
| 6 | ✅ EAV Parameter Model | 参数不是固定字段 |
| 7 | ✅ Server/Client Component Boundary | 遵循 Next.js 渲染模型 |
| 8 | ✅ S3 Compatible Storage | 文件存储不绑定厂商 |

---

# 10. First Engineering Milestone

## 10.1 Milestone: MVP-001 Foundation Ready

### 验收标准

| Component | Requirement | Verification |
|-----------|------------|-------------|
| Frontend | Next.js 可以启动 | `curl http://localhost:3000` returns 200 |
| Backend | NestJS 可以启动 | `curl http://localhost:4000/api/health` returns OK |
| Database | PostgreSQL 可以连接 | `psql` connection test passes |
| Prisma | Migration 可以执行 | `npx prisma migrate dev` runs without errors |
| Docker | 开发环境完整启动 | `docker-compose up` all services healthy |

## 10.2 Milestone Dependencies

```
MVP-001 Foundation Ready
    ├── Repository initialized
    ├── Monorepo configured
    ├── Next.js app scaffolded
    ├── NestJS app scaffolded
    ├── PostgreSQL running (Docker)
    ├── Prisma initialized
    └── Environment variables configured
```

---

# 11. Future Implementation Roadmap

## 11.1 Phase 1 (MVP): Business Loop

| Phase | Content | Status |
|-------|---------|--------|
| M0 | Foundation | Planning |
| M1 | Identity & Organization | Planning |
| M2 | Standard Product Center | Planning |
| M3 | Offer Center | Planning |
| M4 | Demand Center | Planning |
| M5 | RFQ Workflow | Planning |
| M6 | Search | Planning |
| M7 | Notification | Planning |

## 11.2 Phase 2: Platform Enhancement

| Capability | Status |
|-----------|--------|
| AI Search | Design Reserved |
| pgvector | Design Reserved |
| Recommendation | Design Reserved |
| Knowledge Enhancement | Design Reserved |
| Advanced Workflow | Design Reserved |

## 11.3 Phase 3: Long-term Extension

| Capability | Status |
|-----------|--------|
| RAG | Planning Reserved |
| Knowledge Graph | Planning Reserved |
| AI Agent | Planning Reserved |
| Ecosystem API | Planning Reserved |

---

# 12. Appendix

## 12.1 Reference Documents

| Document | Path |
|----------|------|
| Blueprint Readme | [Readme.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/Readme.md) |
| Tech Stack Decision | [TECH_STACK_DECISION.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/TECH_STACK_DECISION.md) |
| Document Index | [DOCUMENT_INDEX.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/DOCUMENT_INDEX.md) |
| Canonical Naming Spec | [399_CanonicalNamingSpecification](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/300_Architecture-第二版（增加文件）/399_CanonicalNamingSpecification-第二版（增加）.md) |
| MVP Scope & Phase | [108_MVP_Scope_and_Phase.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/100_Business/108_MVP_Scope_and_Phase.md) |
| API Design Spec | [502_API_Design_Specification.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/500_Backend/502_API_Design_Specification.md) |
| OpenAPI Spec | [503_OpenAPI_Specification.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/500_Backend/503_OpenAPI_Specification.md) |
| Frontend Architecture | [601_Frontend_Architecture.md](file:///f:/Desktop/VISNDT/docs/VISNDT-Blueprint/600_Frontend/601_Frontend_Architecture.md) |
| Consolidation Result | [06_Blueprint_v1_0_Consolidation_Result.md](file:///f:/Desktop/VISNDT/docs/_review/06_Blueprint_v1_0_Consolidation_Result.md) |
| AI Readiness Report | [07_AI_Development_Readiness_Report.md](file:///f:/Desktop/VISNDT/docs/_review/07_AI_Development_Readiness_Report.md) |

## 12.2 Version History

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-07-16 | Initial release — based on Blueprint v1.0 |

---

# MVP Engineering Implementation Plan

Version:

```
V1.0
```

Status:

```
FROZEN
```

Completion:

```
100%
```