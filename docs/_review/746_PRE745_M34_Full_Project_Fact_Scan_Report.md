# 746_PRE745_M34_Full_Project_Fact_Scan_Report

> 任务编号：PRE-745 — Full Project Fact Scan / M34 Platform Architecture Baseline
> 报告类型：Architecture Audit + Repository Audit + Frontend/Backend/Database/API Audit + Runtime Verification + Data Inventory + Documentation Reconciliation
> 执行日期：2026-08-29
> 执行模式：READ-ONLY INSPECTION（ZERO-MUTATION，生产代码/数据库/存储/路由/配置零修改）
> 阶段定位：Pre-M34 / Pre-745 — 建立 Current-State Fact Base
> 章节标记：`FACT`=代码/运行时/DB 实际验证；`INFERENCE`=基于证据的推断；`TARGET`=文档目标状态；`HISTORICAL`=历史结论/已归档

---

## 1. Task Summary

本任务对 VISNDT 项目做完整只读事实扫描，回答「项目实际是什么 / 已实现 / 部分实现 / 文档声称未验证 / 代码存在前端未暴露 / 数据存在未形成闭环 / 历史目标 vs 未来设想」，不对未来 M34 做设计、不实现、不修复、不清理数据。

**核心结论（一句话）**：VISNDT 是一个以「工业检测能力发现」为定位的 **Hybrid 平台**——公开 Web（Next.js）承担内容/能力发现，Admin SPA（Vite+AntD）承担治理，NestJS API + PostgreSQL/Prisma 承担完整业务闭环（Demand→Match→RFQ→Response→Offer），而 **Capability 尚未平台化**（无独立模型/表/前端路由，仅后端 API 投影）。

---

## 2. Repository Verification

| 项 | 结果 | 标记 |
|---|---|---|
| 仓库根目录 | `F:\Desktop\VISNDT`（`git rev-parse --show-toplevel`） | FACT |
| 代码根目录 | `F:\Desktop\VISNDT\VISNDT`（apps/ packages/ database/） | FACT |
| 当前分支 | `main` | FACT |
| 当前提交 | `ff03a9a368f3490094cf57015ce4799904ad283c` | FACT |
| `.git` 位置 | `F:/Desktop/VISNDT/.git`，仅单一 worktree | FACT |
| Working Tree | **DIRTY（OTHER）**：大量 `M`（修改）与 `??`（未跟踪） | FACT |

工作树脏污主要由历史审计产物构成（非本次扫描引入）：
- 未跟踪脚本/证据：`VISNDT/database/_*.mjs/*.sql/*.ts`（`_6621`~`_744` 系列）、`.edge-cdp-*`、`.chrome_profile/`
- 未跟踪报告：`docs/_review/719~745` 系列 Markdown、`docs/design-system/`
- 已修改源码：`apps/web/src/**`（categories/products/articles/workspace/supplier/components 等）、`apps/admin/src/**`（KpiCard/AdminLayout/Home/Login 等）、`packages/design-tokens/src/index.ts`
- 已修改项目管理文档：`PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md`

> 说明：M33 closeout（744）明确声明「721–743 累计修改保留，未 reset/restore/checkout」，本次扫描同样未执行任何 git 写操作。

---

## 3. Environment Verification

| 项 | 值 | 标记 |
|---|---|---|
| Web Runtime (`:3000`) | **DOWN（无法连接）** | FACT |
| Admin Runtime (`:3001`) | 200 | FACT |
| API Runtime (`:4000`) | `{"status":"ok","database":"connected"}` | FACT |
| Database Runtime | PostgreSQL 16（docker `visndt-postgres`） | FACT |
| Database Container | `visndt-postgres` | FACT |
| Database Name / Host / Port | `visndt` / `localhost` / `5432` | FACT |
| Schema | `public`（40 张业务表 + `_prisma_migrations`） | FACT |
| Storage Runtime | MinIO（docker `visndt-minio`），bucket `visndt-dev`，health 200 | FACT |
| Storage Port / UI | `9000`（S3）/ `9001`（console） | FACT |

敏感项（连接串/密钥/口令）**未写入本报告**。开发用凭据（visndt/visndt_dev、minioadmin）来自 `docker-compose.yml`，为开发默认值，不属生产密钥。

---

## 4. Toolchain Verification

| 项 | 实际版本 | 声明版本 | 标记 |
|---|---|---|---|
| Node | `v24.14.0` | engines `>=20.0.0` | FACT |
| pnpm | `9.15.9` | packageManager 字段 `pnpm@11.20.0`；CI 固定 `9` | FACT（**三处不一致** → P3） |
| Docker | `29.6.2` | — | FACT |
| Prisma | `5.22.0`（client + CLI 一致） | `^5.22.0` | FACT |
| NestJS | `^11.0.0` | — | FACT |
| Next.js | `^15.0.0` | — | FACT |
| React | `18.3.1` | — | FACT |
| Vite | `^6.0.0` | — | FACT |
| Ant Design | `^5.29.3` | — | FACT |
| Tailwind | `3` | — | FACT |
| TypeScript | `^5.7.0`（三端一致） | — | FACT |
| Zustand | `^5.0.14`（admin） | — | FACT |
| TanStack Query | `^5.101.4`（web） | — | FACT |
| react-router-dom | `^7.18.1`（admin） | — | FACT |
| Jest | `^29.7.0`（api e2e） | — | FACT |
| E2E 工具 | Playwright（`tests/e2e/*.spec.ts`，4 个 spec）；CDP 临时脚本（database/_*.mjs） | — | FACT |

构建/类型/测试命令在 package.json 中均已声明（`build`/`lint`/`test:e2e`/`db:generate`）；本次扫描**未执行**全量 build/lint（避免长时副作用；web runtime 当前 DOWN）。CI workflow `VISNDT/.github/workflows/ci.yml`：matrix Node 20 + pnpm 9，仅构建 `@visndt/api` 与 `@visndt/admin`，**未构建 web**。→ 工具链存在但 CI 覆盖缺口（P3）。

---

## 5. Documentation Baseline

| 文档 | 状态 | 标记 |
|---|---|---|
| `PROJECT_STATUS.md`（562KB） | 最新标记 `Next ⏸️ M34 Planning`，M33 = CLOSED | FACT |
| `PROJECT_ROADMAP.md` | 含 M33 关闭矩阵与 Future Candidate 注册 | FACT |
| `MODULE_COMPLETION_MATRIX.md` | 含 M33 Final Closeout | PASS | 100% | FACT |
| `docs/_review/744_*`（M33 closeout） | 存在，M33 = CLOSED / FROZEN | FACT |
| `docs/context/ARCHITECTURE_FREEZE.md` | **旧版（M13.2.9 / 2026-08-01）**，描述 Red/Yellow/Green 冻结 | FACT（**历史，较 744 冻结宽松**） |

> `TARGET`：ARCHITECTURE_FREEZE.md 描述的是历史分层冻结规则，非当前 744 级「Architecture/Backend/API/Schema/Matching/Search/AI 全冻结」口径。

---

## 6. Frozen State（当前冻结）

| 域 | 冻结状态 | 来源 |
|---|---|---|
| M33 | CLOSED（FROZEN） | 744 |
| M33.1 ~ M33.13 | COMPLETED | 744 |
| Architecture / Backend / API / Schema / Migration | FROZEN / UNCHANGED / NONE | 744 |
| Matching / Search | FROZEN | 744 |
| AI / RAG / Vector | FROZEN | 744 |
| Auth Logic / RBAC | UNCHANGED | 744 |
| Business Workflow | UNCHANGED | 744 |
| 已知 Deferred | FD-01（1024 Web Header Overflow） | 744 |
| Future Candidate | FC-742-01 ~ FC-742-04 | 744 |

本次扫描未修改、未重开任何冻结状态。

---

## 7. Repository Topology

```
F:\Desktop\VISNDT                      ← Repository Root（+ .git）
├── VISNDT/                            ← Code Root
│   ├── apps/
│   │   ├── web/       Next.js 15 公开站点 + workspace（App Router，:3000）
│   │   ├── admin/     Vite 6 + React + AntD SPA（:3001）
│   │   └── api/       NestJS 11 后端（:4000，global prefix /api/v1）
│   ├── packages/      pnpm workspace：design-system / design-tokens /
│   │                  identity-contract / rule-engine-contract / shared-types / config
│   ├── database/      prisma/schema.prisma + seed_*.ts + 历史审计脚本(_*.mjs)
│   ├── docker/        docker-compose.yml（postgres + minio）
│   ├── scripts/
│   └── tests/e2e/     Playwright（admin/buyer/supplier login + business-loop）
├── docs/
│   ├── _review/       ← 本报告及其他审计报告（719~745 未跟踪）
│   ├── _context/  context/  _architecture/
│   ├── project-management/（PROJECT_STATUS/ROADMAP/MODULE_COMPLETION_MATRIX）
│   ├── api/  database/  deployment/  design-system/  security/
│   └── VISNDT-Blueprint/
├── .trae/rules/（项目路径规则）
└── scripts/create_test_data.ps1
```

pnpm workspace packages 匹配 `apps/*`、`packages/*`、`database/*`。共 **6 个 packages**（含 `@visndt/identity-contract` 与 `@visndt/rule-engine-contract`，二者均被 web/admin/design-system 引用且实际存在）。

---

## 8. Backend Architecture

- 入口：`apps/api/src/main.ts` — global prefix `api/v1`，Swagger `/api/docs`，helmet/cookieParser/CSRF(double-submit)/ValidationPipe/HttpExceptionFilter/LoggingInterceptor。
- 根模块：`app.module.ts` 注册 **46 个 controller / ~70 个 service**，覆盖 Identity、Product、Parameter、Offer、Demand、RFQ、Response、Matching、Workspace、Content、Knowledge、Search、Discovery、SupplierProducts、AI/Semantic/Embedding、Analytics、Admin 治理等。
- 数据访问：全局 `PrismaModule / PrismaService`（含 AuditLog middleware 自动记录 mutating 操作）。
- 特殊模块：
  - `matching/scoring/scoring.service.ts` → 确定性匹配（FACT，见 §15）
  - `discovery/capabilities.controller.ts` → Capability 投影 API（FACT，见 §13）
  - `semantic/`、`embedding/`、`ai/` → 存在但按冻结定位为「接口/占位」，非运行时激活（INFERENCE，需 AI 冻结口径）

---

## 9. Database Architecture

- Prisma schema：`database/prisma/schema.prisma`，datasource postgresql，generator `prisma-client-js`。
- 业务表 **40 张**（snake_case `@@map`）。枚举 20+（OrganizationStatus/UserStatus/OfferStatus/DemandStatus/RFQStatus/RFQResponseStatus/SupplierProductStatus/ParameterDataType/ContentType/…）。
- **关键结构事实**：
  - 无 `capability` 表、无 `supplier` 表、无 `role` 表、无 `permission` 表、无 `quote` 表。
  - `OrganizationMember.role` 为 **String**（默认 MEMBER），非外键枚举。
  - `Organization.type` 为 **String**（非枚举），观测到 `ADMIN/BUYER/SUPPLIER`。
  - `Product.embedding` / `ContentChunk.embedding` 为 `Unsupported(vector(1536))`。
  - 关系矩阵（核心）：ProductCategory↔Product↔ProductParameterValue/Definition；Product↔Offer；Product↔SupplierProduct（platform_product_id）；Organization↔SupplierProduct/Offer/RFQ(target)/RFQResponse/Inquiry；Demand↔DemandParameter/DemandMatch/RFQ；RFQ↔RFQResponse；KnowledgeDomain↔KnowledgeCategory↔KnowledgeEntry↔KnowledgeContentRef；ProductCategory↔ProductCategoryKnowledgeMapping↔KnowledgeCategory。

---

## 10. API Architecture

统一响应 `ApiResponse.ok(data,msg)`；CSRF 对非安全方法强制 `X-CSRF-Token` + cookie；JWT Bearer（jwt.strategy）认证。

核心 controller（`@Controller(...)` 前缀）：
`users` `organizations` `organization-members` `product-categories` `products` `parameter-groups` `parameter-definitions` `product-parameters` `product-media` `offers` `demands` `rfqs` `rfq-responses` `workflow-events` `notifications` `inquiries` `file-asset` `audit-log` `content` `content-media` `content-revision` `content-tag` `knowledge` `knowledge-public` `search` `supplier-products` `discovery/capabilities` `matching` `workspace` `analytics` + `admin/*`（admin / admin-demand / admin-matching / admin-inquiry / admin-analytics / admin-monitoring / admin-audit-log / admin-audit-intelligence / admin-product-category-knowledge-mapping）+ `auth`（auth / invitation）。

---

## 11. Frontend Architecture

- **web（Next.js 15 App Router，Server Components + 少量 client）**：公开内容/发现站点 + 认证 workspace + buyer/supplier dashboard。认证：`AuthGuard/RoleGuard`（客户端）+ `AuthProvider`。状态：TanStack Query。设计：Tailwind + `@visndt/design-system`/`design-tokens`。
- **admin（Vite 6 SPA）**：React Router + AntD + Zustand + axios interceptor（JWT）。认证：`RequireAuth`。页面：Home / OperationCenter / ProductList/Edit / DemandList/Edit/Detail / RfqList/Create/Detail / OfferList/Detail / InquiryList/Detail / UserList/Create/Edit/Detail / Analytics / Monitoring / MediaList / AuditLogList / MatchDetail / content。
- 路由树共 **58 个 `page.tsx`**（见 §12）。

---

## 12. Route / IA Inventory

**Web 公开/内容**
`/` `/products` `/products/[slug]` `/products/compare` `/categories` `/articles` `/articles/[slug]` `/insights` `/insights/[slug]` `/solutions` `/solutions/[slug]` `/knowledge` `/knowledge/[slug]` `/knowledge-base` `/knowledge-base/[slug]` `/knowledge-base/domains/[slug]` `/business` `/about` `/search` `/login` `/register` `/offline` `/tags/[slug]` `/suppliers/[id]`

**Web 认证/工作区**
`/dashboard`（跳转）`/dashboard/buyer` `/dashboard/supplier` `/workspace` `/workspace/dashboard` `/workspace/demands` `/workspace/demands/create` `/workspace/demands/[id]` `/workspace/demands/[id]/edit` `/workspace/rfqs` `/workspace/rfqs/create` `/workspace/rfqs/[id]` `/workspace/matches` `/workspace/matches/[matchId]` `/workspace/notifications` `/workspace/settings` `/workspace/supplier`（→ /dashboard/supplier）`/workspace/supplier/offers`(+new/[id]/edit) `/workspace/supplier/inquiries`(+[id]) `/workspace/supplier/rfqs`(+[id]) `/workspace/supplier/responses` `/workspace/supplier/opportunities` `/workspace/supplier/runtime`(+products/[id]/inquiry-context) `/workspace/supplier/display` `/workspace/supplier/profile`

**Admin（React Router，RequireAuth）**
`/login` + `/products` `/demands` `/rfqs` `/offers` `/inquiries` `/users` `/knowledge` `/media` `/monitoring` `/analytics` `/audit-logs` 等（以 `router/index.tsx` 为准）。

**IA 关键事实（FACT）**：
- 无 `/capabilities` 前端路由（Capability 仅后端 API）。
- 无 `/suppliers` 列表页，仅 `/suppliers/[id]` 详情。
- `/knowledge` 与 `/knowledge-base` **双路由并存**（重复入口，P2）。
- `/supplier-models/page.tsx` 存在，745 E2E 记录其重定向 `/search`（残留入口，P3）。
- `/workspace/supplier` 为兼容入口 → 重定向 `/dashboard/supplier`（FACT，744）。

---

## 13. Core Object Model Inventory（FACT Matrix）

| Object/Capability | Model | Table | API | Frontend | Runtime | Classification |
|---|---|---|---|---|---|---|
| Capability | **无独立模型** | **无表** | 有（`discovery/capabilities` GET :id 投影） | **无路由** | 后端可返回 capability graph | **RUNTIME-ONLY / CODE-ONLY（投影）** |
| SupplyProduct(=SupplierProduct) | SupplierProduct | supplier_product | 有（supplier-products） | supplier runtime 间接 | 后端 search 使用 | FULL |
| Product | Product | product | 有（products） | `/products`+`[slug]` | 是 | FULL |
| Supplier | **无独立模型（= Organization）** | =organization | =organizations | `/suppliers/[id]` | — | AMBIGUOUS（别名） |
| Category | ProductCategory | product_category | 有（product-categories） | `/categories` | 是 | FULL |
| Specification/Parameter | ParameterDefinition(+Group/Option/Value) | parameter_* | 有 | 产品详情参数 | 是 | FULL |
| Search | — | —（无索引表） | 有（search） | `/search` | 是 | FULL（DB 级 where 过滤） |
| Demand | Demand | demand | 有（demands + admin-demand） | workspace | 是 | FULL |
| Match | DemandMatch | demand_match | 有（matching + admin-matching） | workspace/matches | 是 | FULL |
| Inquiry | Inquiry | inquiry | 有（inquiries + admin-inquiry） | supplier inquiries | 是 | FULL |
| RFQ | RFQ | rfq | 有（rfqs） | workspace/rfqs | 是 | FULL |
| Knowledge | KnowledgeDomain/Category/Entry | knowledge_* | 有（knowledge + public） | `/knowledge`+`/knowledge-base` | 是 | FULL |
| Insight | = Content(type=INSIGHT) | content | 有（content） | `/insights` | 是 | FULL（内容类型别名） |
| Workspace | WorkspaceModule（overview） | —（聚合） | 有（workspace） | dashboard/workspace | 是 | FULL |
| Quote | **无模型/表** | — | 无（RFQResponse 充当响应/报价） | — | — | MISSING（设计如此） |
| Role/Permission | **无表**（String role + 代码枚举） | organization_member.role | auth role enum ADMIN/MEMBER/SUPPLIER | — | — | MISSING（表）+ 代码枚举 |

### 13.1 Product / Capability Separation Audit（3.4 的明确回答）

| 问题 | 答案 | 标记 |
|---|---|---|
| Product 是核心发现对象？ | 是（`/products`、`Product` 表、`products.controller`） | FACT |
| Capability 是独立对象？ | **否** | FACT |
| Capability 只是 Product Tag？ | 不是 Tag，是 **Product 的「能力图」投影**（Product 作为 capability node → SupplierProducts → Offers） | FACT |
| Capability 有独立生命周期？ | 否 | FACT |
| Capability 有独立 API？ | 有（`GET /api/v1/capabilities/:id`，但只读投影，无 CRUD） | FACT |
| Capability 有独立路由？ | **否**（前端无 `/capabilities`） | FACT |
| Capability 有独立 Search/Facet？ | 否 | FACT |
| Capability 可独立关联多 Product？ | 否（无该模型） | FACT |
| Product 可关联多 Capability？ | 否（无 Capability 模型；Product 仅归属一个 ProductCategory） | FACT |

> 结论：**「Capability」目前只是展示/传输层术语**（`discovery.capabilities.controller` + 前端 `capability-glossary.ts`），**未平台化为独立对象**。这是 M34「Platform Experience Architecture」重建的核心输入（Gap：Object Model Gap）。

### 13.2 Supplier Ownership Audit（3.5）

- Product 归属：`Product.createdById`（User），经 `ProductCategory` 分类。
- SupplierProduct 归属：`SupplierProduct.organizationId`（Organization，即 Supplier）。
- 谁可编辑/发布 Product：Admin（products.controller 写接口）；Supplier 通过 `SupplierProduct`（提交/审核/发布，status: DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED）。
- 谁能看 RFQ：RFQ 带 `targetOrganizationId`（定向组织）→ Supplier 定向可见。
- 审核：`SupplierProduct.reviewedBy`（User，Admin）+ `status` 治理。

### 13.3 Category/Specification/Parameter Audit（3.6）

- Category→Product 真实存在（`Product.categoryId`→ProductCategory）。
- Category→Capability：**不存在**（无 Capability 模型）。
- Category→Specification：**无直接外键**；通过 Product→ProductParameterValue→ParameterDefinition 间接（分类不直接绑定参数组）。
- Parameter 体系完整：ParameterGroup→ParameterDefinition→(ParameterOption | ProductParameterValue | ProductParameterDefinition | DemandParameter | SupplierProductParameterValue)。
- 类型：STRING/NUMBER/BOOLEAN/ENUM（`ParameterDataType`），支持 unit、range（DemandParameter.valueMin/valueMax）。
- 结论：Parameter 规范化程度高（Implemented）；Category↔Specification 直接绑定缺失（MISSING/未用）；Facet 通过 ProductParameterValue 索引实现（Partial）。

---

## 14. Object Relationship Matrix（关系真实性）

| 关系 | DB | API | Frontend | 结论 |
|---|---|---|---|---|
| Capability ↔ SupplyProduct | 否（投影） | 是（capabilities 返回 SupplierProducts） | 否 | CODE-ONLY（投影） |
| SupplyProduct ↔ Supplier(=Org) | 是（organizationId） | 是 | 间接 | FULL |
| Capability ↔ Category | 否 | 否 | 否 | MISSING |
| Capability ↔ Specification | 否 | 否 | 否 | MISSING |
| SupplyProduct ↔ Specification | 是（SupplierProductParameterValue） | 是 | 间接 | FULL |
| SupplyProduct ↔ Media | 是（SupplierProductMedia） | 是 | 间接 | FULL |
| Supplier ↔ Organization | 同一实体 | — | — | 别名 |
| Demand ↔ Match | 是（DemandMatch.demandId） | 是 | workspace/matches | FULL |
| Match ↔ Product | 是（DemandMatch.productId） | 是 | — | FULL |
| Match ↔ RFQ | 是（RFQ.sourceMatchId，onDelete 未控为 Restrict 需核） | 是 | — | FULL |
| RFQ ↔ Organization | 是（RFQ.targetOrganizationId） | 是 | — | FULL |
| RFQ ↔ Response | 是（RFQResponse.rfqId） | 是 | supplier responses | FULL |
| Knowledge ↔ Capability | 否（Knowledge 通过 ProductCategoryKnowledgeMapping 关联 Category，非 Capability） | 是（知识关联分类） | 间接 | PARTIAL |
| Insight ↔ Specification | 否（Insight=Content，无参数外键） | 否 | 否 | MISSING |

---

## 15. Search / Discovery Chain（端到端事实）

链路（FACT，逐环真实）：
`/search` UI（`search/page.tsx` + `SearchPageContent.tsx`）→ URL state（q/type/category/fc/f_<cat>/sb/ss/sh）→ `lib/api/search.ts#searchUnified`（q/page/pageSize/category/filters/brand/series/hasOffer）→ `web/services/search.service.ts` → `GET /api/v1/search`（`search.controller` + `UnifiedSearchDto`）→ `SearchService.search()` → **Prisma `where`**：
- `product.findMany`：categoryId + keyword OR + parameter filter AND，server-side `filter-before-pagination`，`skip/take/orderBy`。
- `supplierProduct.findMany`：published boundary + keyword + category + brand + series + hasActiveOffer + parameter filters。
- `content/knowledge`：title/summary contains keyword + status/type + 分页。

**结论**：关键词/分类/规格 facet 筛选**确实进入 DB 查询**，排序/分页服务端实现，URL 可恢复（非「仅界面控件」）。Supplier 通过 SupplierProduct 参与检索（符合「Supplier Discovery」边界，非店铺/商城搜索）。

---

## 16. Demand / Match / RFQ Chain（端到端事实）

```
Demand 创建（demands.controller/service）
  → DemandParameter（demand_parameter，44 行）
  → Matching（matching.controller → matching.service → scoring.service.calculateScore）
      = 确定性打分：Demand 参数 vs Product 参数
        · 权重 = priority（默认 defaultPriority）
        · 类型匹配：NUMBER→rangeMatch / ENUM→enumMatch / STRING,BOOLEAN→exactMatch
        · required 参数未命中 → hardFail（totalScore 0）
  → DemandMatch（demand_match，21 行，@unique[demandId,productId]）
  → RFQ（rfqs.controller/service；RFQ.sourceMatchId → DemandMatch，RFQ.targetOrganizationId → Organization）
  → RFQResponse（rfq_response，17 行，@unique[rfqId,organizationId]）
  → 决策（RFQResponseStatus SUBMITTED→VIEWED→ACCEPTED/REJECTED，rfq-responses.controller）
  → Offer（offer，21 行，@unique[organizationId,productId]）
```

匹配为**确定性**（无 AI/semantic 参与打分），符合「Matching remains deterministic」约束。

---

## 17. Buyer Flow

Guest → Discovery（/products）→ Search/Filter → Compare（/products/compare）→ 产品详情（/products/[slug]）→ Supplier（/suppliers/[id]）→ Demand 创建（/workspace/demands/create）→ Inquiry/RFQ → Response → Decision。

| 步骤 | 状态 |
|---|---|
| Discover/Search/Filter/Compare | SUPPORTED |
| Product/Capability/Supplier 查看 | SUPPORTED（Capability 无独立页） |
| Demand 创建（参数） | SUPPORTED（workspace/demands/create） |
| Match 查看 | SUPPORTED（workspace/matches） |
| RFQ 发起/决策 | SUPPORTED（workspace/rfqs） |
| Buyer Inquiry 所有权视图 | Future Candidate（713-FC-01 继承） |

---

## 18. Supplier Flow

Supplier → Organization → Product Management（SupplierProduct）→ Specification/Media → Capability Mapping（无独立 Capability）→ Submission → Review → Publish → Discovery → Lead/Inquiry → RFQ → Response。

| 步骤 | 状态 |
|---|---|
| SupplierProduct 管理 | SUPPORTED（supplier-products API；前端供应商 runtime 间接） |
| 审核/发布 | SUPPORTED（SupplierProductStatus 生命周期 + reviewedBy） |
| Discovery/搜索者可见 | SUPPORTED（search 中 supplierProduct.findMany） |
| 收到的询价 | SUPPORTED（workspace/supplier/inquiries） |
| RFQ 响应/报价 | SUPPORTED（workspace/supplier/rfqs + responses） |
| 自助能力型号（Self-service） | Future Candidate（713-FC 继承） |

---

## 19. Admin Governance

Admin 可管理对象（基于 admin/* controller + admin SPA page）：User、Organization（经 organizations）、Product、Demand、RFQ、Offer、Inquiry、Knowledge、Content、Media/FileAsset、AuditLog、Analytics、Monitoring、ProductCategoryKnowledgeMapping。

治理模式：
- 管理员维护**规则/分类/映射**（ProductCategory、ParameterDefinition、ProductCategoryKnowledgeMapping、ContentTag）。
- 供应商维护**自己的 SupplierProduct 数据**（规格、媒体、品牌/型号）。
- 平台**自动产生**：WorkflowEvent、AuditLog、ConversionEvent、（若有）Notification。
- 平台**自动验证**：暂无（无独立校验引擎表）；Matching 评分由 ScoringService 程序化。
- 仍需**人工**：SupplierProduct 审核（reviewedBy）、RFQ 决策。

---

## 20. Runtime Verification

| 目标 | 结果 |
|---|---|
| API 健康 | `{"status":"ok","database":"connected"}`（FACT） |
| Admin Runtime | 200（FACT） |
| Web Runtime | **DOWN**（FACT，环境稳定性问题，非代码缺陷） |
| DB 连接 | connected（经 API health）|
| MinIO | health/live 200（FACT） |

Web `:3000` 当前不可连接，与前序审计（744/745 运行期正常）不一致 → 判定为「Unavailable Runtime / 环境不稳定」，不影响架构事实结论，但使本次 Browser Runtime（4.3）无法完整执行 → 记录为 CONDITIONAL。

---

## 21. Mobile Verification

> 说明：web runtime `:3000` DOWN，本次**无法做视觉复测**。以下「Mobile-usable」结论区分为三类标记：`HISTORICAL`=744/745 运行期基线；`CODE`=源码结构证据；`UNVERIFIED`=本次因 runtime DOWN 未能复测。均不改变现状、不修复。

| 维度 | 现状证据 | 分类 | 标记 |
|---|---|---|---|
| Responsive Layout | Tailwind 断点（sm/md/lg/xl）；`/products` `/categories` 375/768/1024/1440 = PASS | Desktop-compatible + Mobile-usable | HISTORICAL（744） |
| Navigation Model | `PublicHeader`（含移动端菜单）+ 工作区侧栏；1024 头部溢出 → FD-01 Deferred | Desktop-compatible；Mobile-usable（有已知 Deferred） | CODE + HISTORICAL |
| Search Interaction | `/search`（`SearchHero` + `SearchPageContent`），响应式 class | Desktop-compatible + Mobile-usable | CODE |
| Filter Interaction | `MobileFilterDrawer.tsx`（移动端筛选抽屉，新增未跟踪）+ 桌面 facet 侧栏 | Mobile-usable（抽屉）／Desktop-compatible（侧栏） | CODE |
| Compare Interaction | `/products/compare` + `CompareBar.tsx` | Desktop-compatible；Mobile 未系统复测 | CODE / UNVERIFIED |
| Product Info Density | `ProductCard/Grid/DetailContent` 多断点密度 | Desktop-compatible + Mobile-usable | CODE |
| Capability Info Density | 无独立 Capability 页；经产品详情「供应商型号」区投影 | 不适用（无独立页） | CODE（见 §13） |
| Supplier Info Density | `SupplierPublicProfile.tsx` / `/suppliers/[id]` | Desktop-compatible + Mobile-usable | CODE |
| Forms | Demand 创建 / RFQ 创建等 workspace 表单 | Desktop-compatible；Mobile 表单未系统复测 | CODE / UNVERIFIED |
| RFQ Workflow | workspace RFQ 列表/详情/响应（桌面表格导向） | Desktop-compatible；Mobile-usable 待复测 | CODE / UNVERIFIED |
| Tables | workspace 列表（RFQ/Demand/Match）为桌面表格 | Desktop-compatible 为主 | CODE |
| Touch Targets | 无系统化触控目标审计记录 | 未建立基线 | UNVERIFIED |

**结论**：移动端为「Desktop-compatible + 部分 Mobile-usable」；响应式基线与关键交互（筛选抽屉、对比）已落地，但表格/表单/RFQ 工作流与触控目标在移动端的可用性**以 744/745 历史基线为准，本次未复测**。→ 标记 Mobile Verification = HISTORICAL/PARTIAL。

---

## 22. SEO / LLM Discoverability

> 只审计当前实现，不改变 SEO。结论以源码文件级证据为准（FACT）；需运行时渲染验证项标记 UNVERIFIED。

| 检查项 | 现状（FACT，除非标注） | 结论 |
|---|---|---|
| Metadata | `layout.tsx` 定义全站 `Metadata`（title.template `%s \| VISNDT`、description、keywords、manifest、appleWebApp、robots index/follow、OG、twitter） | IMPLEMENTED |
| Title | 根布局 `title.template`；`seo-config.ts#buildPageMetadata` 统一单页标题；产品详情 `generateMetadata` 动态标题 | IMPLEMENTED |
| Description | `SITE_DESCRIPTION` 全局 + 各详情页（产品/内容/知识）动态 description（截断 160） | IMPLEMENTED |
| Canonical | `buildPageMetadata` 写入 `alternates.canonical = absoluteUrl(path)`；产品详情页注入 canonical | IMPLEMENTED |
| Robots | `robots.ts`：`allow:/`，`disallow: ['/api/','/search']`，指向 `/sitemap.xml` | IMPLEMENTED |
| Sitemap | `sitemap.ts`：静态核心页（/、/products、/knowledge-base、/knowledge、/solutions、/articles、/insights、/business、/about）+ 动态源（Product、KnowledgeEntry、KNOWLEDGE/ARTICLE/INSIGHT/SOLUTION 内容详情，pageSize=500） | IMPLEMENTED |
| Structured Data / Schema.org | `lib/seo.tsx` JSON-LD builders：`Organization`、`WebSite`(SearchAction)、`Product`、`BreadcrumbList`、`Article`/`TechArticle`(内容)、`Article`(知识条目)。产品详情页注入 `Product`+`BreadcrumbList` | IMPLEMENTED（核心对象） |
| Heading Hierarchy | 各页单一 `h1`（home/products/categories/articles/…）；**`/products/compare` 出现双 `h1`**（第 108、253 行均 `产品对比`） | PARTIAL（compare 页 h1 重复） |
| Semantic HTML | 根布局 `<main>`；面包屑用 `<nav>`；内容组件用 `<section>`/`<article>`；`<footer>` 存在 | IMPLEMENTED（基本语义） |
| Entity Naming | `SITE_NAME=VISNDT`、`SITE_DESCRIPTION`「工业检测能力发现平台」、`SITE_KEYWORDS`（工业检测能力/能力发现/无损检测/NDT…）；中文沿用「能力」术语 | IMPLEMENTED（术语与产品定位一致） |
| URL Structure | 语义化 slug：`/products/[slug]`、`/knowledge-base/[slug]`、`/articles/[slug]`、`/suppliers/[id]`；`/search` 主动不收录 | IMPLEMENTED |
| Indexability | `robots index=true` + sitemap 覆盖公开资产；`/search`、`/api` 排除 | IMPLEMENTED |
| Internal Linking | 面包屑、产品详情「相关产品/相关知识/相关方案」、`ProductDetailNav`、`CategorySection` | IMPLEMENTED（质量未深测，UNVERIFIED） |

**关键发现（FACT）**：`SITE_URL` 默认值 = `https://visndt.example.com`（占位符），通过 `NEXT_PUBLIC_SITE_URL` 覆写。若生产环境未注入该环境变量，则 canonical/OG/sitemap/JSON-LD 的绝对 URL 均指向 `example.com`，破坏可索引性与结构化数据地址 → **SEO Gap（配置治理，见 G-11）**。

**Capability/Product/Supplier/Category/Specification 语义结构（重点观察）**：
- Product：结构化最完整（`generateMetadata` + Product/Breadcrumb JSON-LD + 语义化 URL）；中文明示「能力」语境。
- Category：sitemap 未单独收录 `/categories`（仅 static 无 `/categories`；分类经产品页发现），语义列于 `Product.category`。
- Supplier：`/suppliers/[id]` 有 `SupplierPublicProfile`，但无列表页（IA 缺口，见 G-04/G-05 相关）且**无 Supplier 专属 JSON-LD**。
- Capability：**无独立语义结构**（无页/无 JSON-LD/schema；仅产品详情内「供应商型号」区块），与 §13「未平台化」一致。
- Specification：**无独立 URL 语义**，仅作为产品详情参数区呈现，无 Schema.org 结构化标记。

→ 标记 SEO = IMPLEMENTED（元数据/结构化基础扎实）但存在 `SITE_URL` 配置占位与 Capability/Specification 语义缺失两类缺口。

---

## 23. Data Inventory（只读记录量 FACT）

| 表 | rows | 表 | rows |
|---|---|---|---|
| user | 13 | parameter_option | 45 |
| organization | 15 | product_parameter_value | 181 |
| organization_member | 18 | product_parameter_definition | 176 |
| product | 32 | file_asset | 1 |
| product_category | 28 | notification | 33 |
| supplier_product | 38 | workflow_event | 38 |
| offer | 21 | audit_log | 2857 |
| demand | 30 | conversion_event | 505 |
| demand_match | 21 | content | 16 |
| demand_parameter | 44 | content_revision | 1 |
| rfq | 17 | content_media | 0 |
| rfq_response | 17 | content_tag | 0 |
| inquiry | 17 | content_chunk | 8 |
| parameter_group | 11 | product_media | 1 |
| parameter_definition | 54 | supplier_product_media | 5 |
| refresh_token | 646 | supplier_product_parameter_value | 50 |
| knowledge_domain | 3 | knowledge_content_ref | 0 |
| knowledge_category | 6 | knowledge_relation | 0 |
| knowledge_entry | 6 | user_invitation | 2 |
| product_category_knowledge_mapping | 9 | | |

---

## 24. Test Data Classification

| 分类 | 证据 | 实例 |
|---|---|---|
| Likely Test | `demo.` 命名空间（seed_demo.ts）、`test.user.`、`E2E` 前缀、`.edge-cdp-*`、`_*.mjs` 脚本 | `demo.buyer.01/.02@visndt.local`、`demo.supplier.01/.02/.03`、`demo.admin`、`test.user.647`、组织「E2E测试供应商企业」「SZ Wise Supplier」 |
| Likely Real / System | 非 demo 非 test 命名 | `admin@visndt.com`、`buyer@visndt.com`、`supplier@visndt.com`、`system@visndt.com`、`admin@vip.com`、`vsndt@sz-wise.cn`（对应「深圳市微视光电」） |
| System / Protected | system 账号 | `system@visndt.com` |
| Unknown | 未判定 | 无（全部可归因） |

Observations：组织名存在重复（「Admin Organization」×2、「VISNDT 平台运营中心」×2、「江南航空检测技术中心」×2、「中科检测设备有限公司」×2、「锐视检测技术有限公司」×2）。`refresh_token=646`、`audit_log=2857` 体量大，指向历史测试/探针活动。→ 全部归类 Candidate for Controlled Cleanup，**本任务不删除**。

### 24.1 Data Cleanup Candidate Table（仅登记，OUT OF SCOPE）

| Table | Record Count | Likely Classification | Evidence | Dependencies | Protected? | Cleanup Candidate? | Risk |
|---|---|---|---|---|---|---|---|
| refresh_token | 646 | Test（会话/令牌 churn） | E2E/CDP 探针产生的登录会话残留 | user（cascade 删除） | 否 | 是 | 低（清理不影响业务） |
| audit_log | 2857 | Test/Mixed（探针活动记录） | 体量与 .edge-cdp-* 探针次数吻合 | 无外键依赖（只读日志） | 否 | 是（需审计保留策略） | 中（审计完整性/合规） |
| conversion_event | 505 | Test（埋点探针） | analytics 探针产生 | 无业务外键 | 否 | 是 | 低 |
| workflow_event | 38 | Test | 业务流程探针 | 关联 rfq/demand/match | 否 | 候选 | 低 |
| notification | 33 | Test | 事件触发探针 | user（recipient） | 否 | 候选 | 低 |
| user（`demo.*`/`test.user.*`） | 13 中部分 | Test | `demo.buyer/supplier/admin`、`test.user.647` | organization_member / createdBy / refresh_token | 否 | 是 | 高（cascade 牵连 createdBy 引用） |
| organization（重复命名） | 15 中部分 | Test（seed 重复） | 「Admin Organization」×2 / 「VISNDT 平台运营中心」×2 等 | organization_member / supplier_product / offer | 否 | 是 | 高（member/supplier_product 关联） |
| product（demo 数据） | 32 中部分 | Test | seed_demo 创建 | product_parameter_value / supplier_product / offer / demand_match | 否 | 候选 | 高（多表 FK 引用） |
| system / 真实账号 | 13 中部分 | System/Real | `admin@visndt.com`、`buyer@visndt.com`、`system@visndt.com`、`admin@vip.com`、`vsndt@sz-wise.cn` | — | **是** | **否** | — |

> 全部仅 **IDENTIFY / CLASSIFY / REPORT**；**DO NOT DELETE / TRUNCATE / RESET / SEED-REPLACE**。清理策略与 cascade 边界需独立 Data Governance 任务确认，本任务不执行。

---

## 25. Storage Inventory

- MinIO bucket：`visndt-dev`（唯一业务 bucket，FACT）。
- DB 引用：`file_asset=1`、`product_media=1`、`supplier_product_media=5`。
- 观察（INFERENCE，未深查对象）：`supplier_product_media=5` > `file_asset=1`，怀疑 SupplierProductMedia 存在 `file_asset_id` 为空或被清理的孤儿引用。→ Data Dependency 异常，仅记录不处理。
- 依赖方向：Product/Content/SupplierProduct → FileAsset → MinIO object；FileAsset.onDelete 对 Organization 为 SetNull，媒体多为 Cascade。

---

## 26. Documentation Reconciliation

| 文档声明 | 代码 | DB | Runtime | 结论 |
|---|---|---|---|---|
| M33 = CLOSED | — | — | — | 一致（FACT） |
| Global Visual Transformation CONFIRMED | 源码大量 M 改动 | — | web DOWN（无法复测） | 部分可核（INFERENCE） |
| 业务闭环 Demand→RFQ→Response | controllers/services 齐全 | 表均非空 | API up | 一致（FACT，闭环成立） |
| Capability 定位为能力发现 | 无独立模型/路由 | 无表 | 仅 API 投影 | **文档定位 vs 代码不等（TARGET ≠ 实现）** |
| 供应商/制造商术语 | resolveWorkspaceRole 支持 MANUFACTURER | 实际 0 条 MANUFACTURER | — | 术语代码支持但未实例化 |

---

## 27. Historical Review Reconciliation

| 编号 | 结论 | 状态 |
|---|---|---|
| 740 M33 Scope Reconciliation | PASS | STILL VALID |
| 741 Cross-Role Platform Perception | PASS | STILL VALID |
| 742 M33 Bounded Repair | PASS | STILL VALID |
| 743 M33 Final Verification | PASS | STILL VALID |
| 744 M33 Final Closeout | PASS（M33 CLOSED） | STILL VALID |
| 745 CrossRole E2E + Field Localization | CONDITIONAL（英文文案/字段一致性问题） | **STILL VALID（与本次字段统一类发现一致）** |

---

## 28. Platform-first / Website-first Assessment

> 只做初步架构判断，不重构。逐项评价基于 §12 路由清单与 §13 对象模型事实（FACT）。

| 领域 | 倾向 | 事实依据（FACT） |
|---|---|---|
| Navigation | Hybrid | 公开侧 `PublicHeader`（内容/发现导航）；平台侧 `RoleGuard` + 工作区侧栏；`/dashboard/buyer` `/dashboard/supplier` 分角色入口 |
| Homepage | Website-first | `/` 营销/内容导向（HeroSection/SolutionsSection/CategorySection），无业务操作 |
| Discovery | Website-first | `/products` `/categories` 发现列表（无交易，浏览导向） |
| Product | Website-first（发现详情） | `/products/[slug]` 技术详情 + 相关推荐 + 询价入口（内容导向，交易在 workspace） |
| Capability | **未平台化** | 无独立路由/页；仅 `GET /api/v1/capabilities/:id` 投影 + 产品详情「供应商型号」区块 |
| Category | Website-first | `/categories` 能力索引页；分类作为产品/知识过滤维度 |
| Specification | **未平台化（无独立页面）** | 仅产品详情参数区呈现；无 `/specifications` 路由 |
| Supplier | Website-first（仅详情） | `/suppliers/[id]` 公开画像；无 `/suppliers` 列表（IA 缺口） |
| Search | Website-first（发现搜索） | `/search` 统一搜索（Product/SupplierProduct/Content/Knowledge），URL 可恢复 |
| Demand | Platform-first | `/workspace/demands/*` 需认证；后端 Demand+DemandParameter |
| Match | Platform-first | `/workspace/matches`；后端确定性打分，需认证 |
| RFQ | Platform-first | `/workspace/rfqs/*` + RFQ/RFQResponse/Offer 闭环，需认证 |
| Workspace | Platform-first | `/workspace/*` 认证工作台（buyer/supplier 双角色） |
| Admin | Platform-first | 独立 SPA（Vite+AntD）治理端，与企业平台而非公开内容耦合 |

**最终结论：Hybrid。**
- **Website-first 侧**：Navigation（公开）、Homepage、Discovery、Product、Category、Search、Supplier（详情）——以「能力发现/内容可发现性」为核心，SEO/robots/sitemap 完备。
- **Platform-first 侧**：Demand、Match、RFQ、Workspace、Admin——完整业务闭环已在 API + DB 落地，需认证、分角色。
- **未平台化的发现对象**：Capability、Specification——造成「业务闭环强、发现对象弱」的平台感失衡，是 M34 Platform Experience 重建的核心输入。

标记 Platform Assessment = **Hybrid**（事实依据见上表；非推断）。

---

## 29. Gap Register

| ID | 严重级 | 类型 | 描述 | 证据 |
|---|---|---|---|---|
| G-01 | P1 | Object Model Gap | Capability 未平台化（无模型/表/前端路由，仅 API 投影） | schema 无 capability 表；无 /capabilities 路由；discovery/capabilities.controller 只读投影 |
| G-02 | P1 | Frontend/Backend Field Gap | 角色字段口径不一致：后端 Role 枚举 ADMIN/MEMBER/SUPPLIER vs workspaceRole BUYER/SUPPLIER vs DB role=String | role.enum.ts / auth.service.resolveWorkspaceRole / schema OrganizationMember.role |
| G-03 | P2 | Governance Gap | 无 Role/Permission 表，RBAC 基于 String role + 代码枚举 | schema 无 role/permission 表 |
| G-04 | P2 | IA Gap | `/knowledge` 与 `/knowledge-base` 双路由并存（重复入口） | app 路由树两个 knowledge 目录 |
| G-05 | P2 | IA Gap | `/capabilities` 无前端路由，能力发现未在 web 暴露 | 路由树无 capabilities 目录 |
| G-06 | P2 | Legacy | `/supplier-models` 残留入口（重定向 /search）| supplier-models/page.tsx 存在；745 E2E |
| G-07 | P2 | Data Gap | 测试/演示数据重复（重复组织名、646 refresh_token、2857 audit_log）| DB 计数 + org 查询 |
| G-08 | P2 | Data Gap | 媒体引用异常（file_asset=1 vs supplier_product_media=5）| DB 计数 |
| G-09 | P3 | Tooling Gap | pnpm 版本三处不一致（declared 11.20 / actual 9.15.9 / CI 9）| package.json + CLI + ci.yml |
| G-10 | P3 | Tooling/Runtime | CI 不构建 web；web :3000 当前 DOWN | ci.yml；runtime 探测 |
| G-11 | P3 | SEO Gap / Governance | SITE_URL 默认 `https://visndt.example.com` 占位，未注入 `NEXT_PUBLIC_SITE_URL` 时 canonical/OG/sitemap/JSON-LD 绝对 URL 全指向 example.com | lib/seo.tsx；sitemap.ts；layout.tsx metadataBase |

漏洞分类计数：**P0 = 0，P1 = 2，P2 = 6，P3 = 3**。

---

## 30. Deferred / Future Candidates

| 编号 | 描述 | 现状 | 处置 |
|---|---|---|---|
| FC-742-01 | Supplier RFQ Legacy List Semantic Mismatch | Still Relevant | Remain Deferred |
| FC-742-02 | Admin Metric / Match % 数据异常 | Still Relevant | Remain Deferred |
| FC-742-03 | Public Header IA Refinement | Still Relevant | Remain Deferred |
| FC-742-04 | Future Platform IA / Role-Aware Nav | Still Relevant | Remain Deferred |
| FD-01 | 1024 Web Header Overflow | Still Relevant | Remain Deferred |
| F1/F2/F3/D8 | Supplier 系列/产品池/批处理/媒体文件夹 | Still Relevant | Remain Deferred |
| 713-FC 系列 | Buyer 询价所有权 / 供应商自助型号 / 供应商搜索 / Search V2·AI·Vector·RAG / ProductForm DTO | Still Relevant | Remain Deferred |

> 本任务**仅分类**，未执行任何一项。

---

## 31. M34 Architecture Input（供后续架构审查，不实施）

1. **Capability 平台化决策**：是否将 Capability 从「Product 投影」升级为独立一级对象（模型/表/路由/搜索 facet），是 M34 Platform Experience 的最大分叉点。
2. **角色/字段统一**：收敛 Role enum、workspaceRole、OrganizationMember.role 的口径（BUYER/SUPPLIER/ADMIN vs MEMBER）。
3. **术语/文案中文化**（承接 745）：Supplier/制造商、状态枚举中文映射单点化。
4. **IA 收敛**：`/knowledge` vs `/knowledge-base` 二选一；`/supplier-models` 处置；是否补 `/capabilities` 入口。
5. **Category↔Specification**：是否建立分类到参数组的直接绑定。
6. **RBAC 模型化**：是否需要 Role/Permission 表（当前冻结，M34 评估）。
7. **Data Governance**：测试数据清理候选（不属本任务范围）。

---

## 32. Final Status

```
Task ID:                 PRE-745
Task Status:             CONDITIONAL PASS

Repository Root:         F:\Desktop\VISNDT
Code Root:               F:\Desktop\VISNDT\VISNDT
Branch:                  main
Commit:                  ff03a9a368f3490094cf57015ce4799904ad283c
Working Tree:            OTHER（大量历史 M + untracked）
Mutation:                NONE
Database Mutation:       NONE
Storage Mutation:        NONE

Architecture Scan:       COMPLETE
Runtime Scan:            PARTIAL（api+admin up；web :3000 DOWN）
Data Inventory:          COMPLETE
Documentation Reconciliation: COMPLETE（关键标记） / PARTIAL（PROJECT_STATUS 562KB 仅定位关键行）

Major Findings:          Capability 未平台化；角色字段口径不一致；无 RBAC 表；IA 重复/残留；测试数据体量大
P0: 0   P1: 2   P2: 6   P3: 3

Test Data Cleanup Candidates:  refresh_token / audit_log / 重复组织 / demo.* 用户 等（仅登记）

Review Report:           docs/_review/746_PRE745_M34_Full_Project_Fact_Scan_Report.md
M33:                     CLOSED / UNCHANGED
M34:                     PRE-AUDIT COMPLETE（Fact Base 建立）
Next Authorized Action:  STOP
```

---

## 最终声明

- No automatic cleanup performed.
- No production code changed.
- No database mutation performed.
- No architecture implementation performed.
- No M33 reopening performed.

**核心原则**：What Exists ≠ What Documentation Says ≠ What We Expect ≠ What We Want to Build。本报告仅建立可信的 VISNDT Current-State 地图（Repository Truth + Code Truth + Database Truth + API Truth + Runtime Truth + Data Truth + Documentation Truth），供 M34 架构判断使用。完成后 STOP，不进入 745/M34.1/M34.2/数据清理/UI 重设计/Schema 迁移。