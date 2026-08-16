# VISNDT Project Status

## Snapshot

- Last calibrated: `2026-08-16`
- Repository Root: `F:\Desktop\VISNDT`
- Code Root: `F:\Desktop\VISNDT\VISNDT`
- Branch baseline: `main`
- Current product stage: `D. AI & Platform Enhancement（AI 增强与平台化升级）`
- Current M stage: `M21 AI & Platform Enhancement（M19 COMPLETED；M20 CLOSED；M21.0（511）PASS；M21.1（512）PASS；M21.1c（512.1）PASS；M21.2（513）PASS——68%/C+；M21.2.x.1（513.1）COMPLETED——Web Runtime Experience Hardening；M21.2.x.2（513.2）COMPLETED——SEO Structured Data Enhancement（515 主体 + 516 Product List Metadata Complement），SEO 覆盖率 100%（12/12 路由），P0 SEO 缺口 3/3 已解决；M21.2.x.3.1（517）COMPLETED——Content Contextual CTA Optimization，5 文件（1 新增 ContentProductCTA 组件 + 4 页面替换），Content→Contextual Product Discovery→Inquiry 体验路径建立；M21.2.x.3.2.1（518）COMPLETED——Product Inquiry Context Presentation，4 文件（1 新增 ProductInquiryContext 组件 + 3 文件修改），Product→Context Confirmation→Inquiry Entry 体验链路建立，"提交询价"→"咨询此设备"；M21.2.x.3.2.2（518.2）COMPLETED——Inquiry Entry Experience Optimization，2 文件（SupplierInquirySection + InquiryForm），6 处术语去交易化（"询价对象"→"已选择供应商"、"发送询价"→移除、"提交询价失败"→"提交咨询失败"等），成功状态增强（产品名称 + 返回产品详情 + 继续咨询）；M21.2.x.3.3（519）COMPLETED——Conversion Tracking Foundation，7 文件（3 新增：events.ts + tracker.ts + TrackOnMount.tsx + 4 集成：Product Detail + Content CTA + Inquiry Flow），5 事件类型（product_view/cta_click/inquiry_start/inquiry_submit/page_view）+ Adapter Pattern，Conversion Flow 完整追踪链。M21.2 Web Platform Experience Evolution — CLOSED（513-519 全部完成）。M21.3（520）COMPLETED——Data Intelligence Infrastructure Architecture Audit，Audit Only（29 Model 数据资产盘点 + 5 维度评级：Business Data B+/Event Tracking B/Analytics Readiness C+/BI D/AI Data C），M21.3 Readiness = CONDITIONAL PASS（阻塞：L1 Events 无持久化），M21.3 Roadmap 5 子阶段规划（Data Asset Governance → Analytics Event Persistence → BI Foundation → Data-Driven Optimization → AI Data Preparation）。M21.3.1（521）COMPLETED——Data Asset Governance Audit，Audit Only（29 Model + 20 Enum 全量盘点 + 7 域数据质量矩阵：Content A-/Product B+/Buyer B+/System B+/Offer B/Inquiry B/Identity B- + 13 项 Gap（P0:3/P1:6/P2:4）+ 生命周期评估 + Entity Relationship），Data Maturity = B。M21.3.2 Pre-Development Audit（522）COMPLETED——Analytics Event Persistence Pre-Development Audit，Audit Only（ConversionEvent 模型设计冻结 + 11 Event Types 定义 + API Boundary 设计 + Index Strategy 7 Index + Storage Strategy PostgreSQL + Responsibility Separation 确认）。M21.3.2 Development（522）COMPLETED——Analytics Event Persistence Foundation，Database（ConversionEventType Enum + ConversionEvent Model + Migration 009）+ Backend（AnalyticsModule + POST /api/analytics/events Batch Write）+ Frontend（ApiTrackingAdapter + PageViewTracker + 4 新事件类型集成：page_view/content_view/search/product_filter），ConversionEvent Persistence Foundation Completed。Next: 523_M21.3.3_BI_Foundation）。M21.3.3 Pre-Development Audit（523）COMPLETED——BI Foundation Pre-Development Audit，Audit Only（Current Analytics Data Inventory + BI Data Requirement Analysis + Query Architecture Decision: Option B Analytics Query Service + Admin BI Boundary + RBAC: ADMIN Only + 6 Conditions），Readiness = CONDITIONAL PASS（No Schema Change + No New Dependencies + Read-Only API + ADMIN Only + No Aggregation Tables + No AI/ML）。Next: 523_M21.3.3_BI_Foundation_Development）。M21.3.3 Development（523）COMPLETED——BI Foundation Development，Backend（AnalyticsReadService + AnalyticsReadController + 3 GET APIs：dashboard/statistics/events + ADMIN-only RBAC）+ Admin（Analytics Page + OverviewCards + TrendChart + TopProductsTable + TopContentTable + Menu Integration），BI Foundation Completed：Analytics Query Layer + Admin Dashboard。Next: 524_M21.3.4_Data_Driven_Optimization）。M21.3.4 Pre-Development Audit（524）COMPLETED——Data-Driven Optimization Pre-Development Audit，Audit Only（Current Capability M21.3.3 Baseline: Backend B+/API B/DB B+/Admin B，8 Gaps Identified：G1 memory load+G2 no time range+G3 UUID display+G4 groupBy broken+G5 no DatePicker+G6 no date truncation+G7 no entity filter+G8 no conversion rate），Proposed M21.3.4 Scope：Backend Query Optimization（4 tasks）+ API Enhancement（3 tasks）+ Admin UI Enhancement（3 tasks）+ Data Quality（2 tasks），Impact Level 1（Analytics Module Enhancement），0 Permission Requests，6 Conditions MET，Readiness = CONDITIONAL PASS。Next: 524_M21.3.4_Data_Driven_Optimization_Development）。M21.3.4 Development（524）COMPLETED——Data-Driven Optimization Development，Backend（DATE_TRUNC via $queryRaw + Time Range + Entity Name Resolution + Memory Optimization）+ Admin（RangePicker + Refresh + Real Names），6/8 Gaps Resolved（G1 memory load+G2 time range+G3 UUID display+G4 groupBy fixed+G5 DatePicker+G6 date truncation），Impact Level 1，0 Schema Changes，0 Migrations，0 New Dependencies。Next: 525_M21.3.5_AI_Data_Preparation_Pre_Development_Audit）。M21.3.5 Pre-Development Audit（525）COMPLETED——AI Data Preparation Pre-Development Audit，Audit Only（7 Domain Data Asset Inventory：30 Model/239 Field/8 Event Types + 6 Dimension AI Readiness：Structured Data B+/Event Data B+/Semantic Metadata B/Entity Relationship B+/User Context B-/Knowledge Asset B+ + 10 Gaps（P0:3 G1 Vector Infrastructure/G2 Content Chunking/G4 Embedding Pipeline，P1:4 G3 Product slug/seoTitle/G5 User Profile/G6 Semantic Mapping/G10 Metadata，P2:3 G7 Session/G8 Knowledge Graph/G9 Data Quality）+ Architecture：3-Phase AI Data Preparation（pgvector + Embedding VECTOR(1536) + ContentChunk + EmbeddingService + Admin UI + Product slug），M21.3.5 Readiness = PASS，AI Data Foundation = B+。M21.3.5 Development（525）COMPLETED——AI Data Preparation Development，Database（Migration 010：pgvector extension + Content.embedding/Product.embedding VECTOR(1536) + Product.slug/seoTitle + ContentChunk table）+ Backend（EmbeddingModule + EmbeddingService + EmbeddingController + 8 ADMIN-only endpoints）+ Admin（EmbeddingManagement page + router + menu），AI Data Preparation Foundation Completed。M21.3 Data Intelligence Infrastructure — CLOSED（M21.3.1-M21.3.5 全部完成）。M21.4.0 Semantic Layer Pre-Development Audit（526）COMPLETED——Audit Only（7 Dimension Readiness：B+/B/B+/B+/B/C/C + 11 Gaps：P0:3/P1:4/P2:4 + Architecture：Vector Index + Semantic Module + RetrievalService + RankingService + Search API + Unified Search），M21.4 Readiness = CONDITIONAL PASS。M21.4.1 Vector Index Foundation（527）COMPLETED——Database-Only（Migration 011：3 IVFFlat indexes + cosine_similarity function），P0 GAP-01/GAP-02 RESOLVED。M21.4.2 Embedding Data Population（528）COMPLETED——Data Population（OpenRouter text-embedding-3-small：8 Content + 5 Product + 8 Chunk，100% Coverage，21/21 embeddings 1536-dim），P1 GAP-04 RESOLVED。M21.4.3 Semantic Module Foundation（529）COMPLETED——SemanticModule + RetrievalService + EmbeddingCacheService + SemanticController，P0 GAP-03 RESOLVED。M21.4.4 Semantic Search API Foundation（530）COMPLETED——SemanticQueryService + SemanticQueryController + DTO + Query Contract Frozen，Internal API。M21.4.5 Semantic Retrieval Enhancement（531）COMPLETED——threshold filtering + diagnostics + unified retrieve() + metadata + query normalization，P1 GAP-05 RESOLVED。M21.4.6 Semantic Ranking Foundation（532）COMPLETED——RankingService + RankingStrategy + Contract Frozen，semanticScore + rankingScore，P1 GAP-06 RESOLVED。M21.4.7 Unified Search Ranking Foundation（533）COMPLETED——UnifiedSearchService + UnifiedSearchContract + UnifiedSearchDto，Retrieval→Ranking→Unified Response orchestration，P1 GAP-07 RESOLVED。M21.4 CLOSED——3/3 P0 GAPs + 4/4 P1 GAPs 全部解决。M21.5.0 Pre-Development Architecture Audit（534）COMPLETED——Audit PASS：API/Auth Ready，Semantic Protected，BFF Deferred，Responsive Web → PWA → Native App 路径。M21.5.1 Responsive Web Foundation（535）COMPLETED——2 new files + 18 modified files，Responsive Layout + Mobile Navigation + WorkspaceLayout + Responsive Hooks + 三端适配（Mobile/Tablet/Desktop），apps/web build exit 0，零 API/Schema/Migration 变更。M21.5.2 Progressive Web App Foundation（536）COMPLETED——6 new files + 1 modified file，PWA Manifest + Service Worker（Cache-First Static / Network-First Pages / Offline Fallback）+ PWA Icons + Offline Page + Root Layout PWA Integration（viewport/manifest/AppleWebApp），apps/web build compiled successfully，零 API/Schema/Migration 变更。M21.5.3 Mobile Experience Optimization（537）COMPLETED——12 modified files，Workspace Mobile UX（Sidebar close button + 44px touch targets + responsive padding）+ Product Experience（ProductCard + Specifications responsive）+ Form Experience（Demand/RFQ Create 44px buttons）+ Touch Optimization（all buttons/pagination 40-44px），apps/web build exit 0，零 API/Schema/Migration 变更。M21.5 Mobile Experience — CLOSED（534-537 全部完成，Responsive Web + PWA + Mobile UX Optimization）。M21.6.0 Pre-Development Architecture Audit（538）COMPLETED——Audit PASS：Admin UI 19 pages，Admin API 11 endpoints（ADMIN-only），Analytics 8 event types（dashboard + statistics + events），Monitoring（Matching + System status），Audit（full trail + filter + export），Embedding（coverage status + manual trigger），Semantic Boundary PROTECTED，13 data sources READY，8 Gaps（0 P0 / 3 P1 / 5 P2），Overall Readiness B+。M21.6.1 Admin Operational Dashboard Enhancement（539）COMPLETED——8 modified files（4 backend + 4 frontend），1 new API endpoint（GET /admin/dashboard/trend）+ 2 enhanced API responses（stats + pending），Dashboard Enhancement：Platform KPIs（6 cards）+ Business KPIs（6 cards）+ Matching Intelligence（4 cards）+ Pending Items（5 cards）+ Real Trend（7-day ConversionEvent）+ Business Funnel（7-stage real data）+ Entity Comparison（10 entities），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。M21.6.2 Admin Business Analytics Enhancement（540）COMPLETED——11 files（2 new backend + 3 new frontend + 6 modified），4 new API endpoints（GET /admin/analytics/business/{funnel,lifecycle,conversion,matching}，ADMIN-only），Business Analytics Page（4 tabs：Demand Funnel 6-stage + RFQ Lifecycle 5-stage + Business Conversion 9-stage pipeline + Matching Analysis 6-stage），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。Next: M21.6.3_Admin_Monitoring_Enhancement。M21.6.3 Admin Monitoring Enhancement（541）COMPLETED——9 files（2 new backend + 3 new frontend + 4 modified），1 new API endpoint（GET /admin/monitoring/overview，ADMIN-only），Monitoring Page（5 sections：System Health + Business Risk + Matching Health + Embedding Coverage + Analytics Pipeline），10 code-level thresholds（NORMAL/WARNING/CRITICAL），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。Next: M21.6.4_Admin_Audit_Intelligence_Enhancement。M21.6.4 Admin Audit Intelligence Enhancement（542）COMPLETED——9 files（2 new backend + 3 new frontend + 4 modified），1 new API endpoint（GET /admin/audit-intelligence/overview?days=7，ADMIN-only），Audit Intelligence Page（5 sections：Audit Overview + Audit Trend + Entity Distribution + Actor Activity + Risk Indicators），6 code-level risk indicators（DELETE/STATUS_CHANGE/Event Rate/Login Rate/Actor Activity/Actor Concentration），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。M21.6 Admin Intelligence Closure Audit（543）COMPLETED——Audit Only：539-542 全能力验证 PASS + 架构边界 PROTECTED（Monitoring/Alert Engine/Audit/Security）+ Semantic Boundary PROTECTED + Database 零变更 + API 全部 ADMIN-only + 三端 Build PASS + 文档同步完成，M21.6 CLOSED。Next: M21.7 AI Agent Integration。`

## Current Phase Judgment

VISNDT 已经完成基础建设、后端主域与 Admin 运营底座，也已完成 Buyer / Supplier 双侧 Workspace 主链。当前项目最准确的状态是：

`M15 技术债治理已全面收口，M16 业务深化前稳定性审计已完成，M17 内容域建设完成，M18 内容运营成熟化完成（M18.5 阶段关闭），M19 产品体验架构演进完成（M19.1~M19.4 CLOSED），M19 COMPLETED，M20 Frontend Platformization 全部闭环（M20.1~M20.4 CLOSED），M20 COMPLETED。M21.0-M21.4 CLOSED（AI 基础设施 + Semantic Layer + Unified Search）。M21.5 Mobile Experience CLOSED（534-537 全部完成：Responsive Web + PWA + Mobile UX Optimization）。M21.6 Admin Intelligence CLOSED（538 Audit + 539 Dashboard + 540 Business Analytics + 541 Monitoring + 542 Audit Intelligence + 543 Closure Audit 全部完成）。Next: M21.7 AI Agent Integration。`

## Completed Baseline

### M0-M13 已完成

- NestJS + Prisma + PostgreSQL 后端基座
- Auth / User / Organization / Product / Category / Parameter 主数据体系
- Demand / Matching / RFQ / RFQ Response / Offer / Notification / Inquiry 核心模型与接口
- Admin 运营后台与 Dashboard
- Public Website、Product Center、Buyer 侧 MVP、部署与安全加固

### M14 已基本完成

- Buyer Workspace 与 Dashboard
- Supplier Workspace 与 Dashboard
- Buyer Demand 创建、详情、编辑
- Buyer RFQ 创建、详情、响应决策
- Supplier RFQ 列表、详情、响应跟踪
- Workspace 路由归属与业务边界收口

### M15 已完成

- TD-006 访问边界加固已落地
- TD-001 Service Boundary 收口已推进到最终验证阶段
- TD-002 WorkflowEvent 生命周期治理已完成
  - Match 事件主体归一化（entityType=MATCH）
  - Demand / RFQ 生命周期边界已收敛
  - RFQ Response 创建事件已补齐
  - Rematch 事件处理已规范（MATCH+CREATED+trigger=rematch）
  - 所有 WorkflowAction 复用现有枚举，未新增
- TD-005 Generic Mutation Boundary 收口已完成

### M16 审计阶段（429_M16.0）

- M16.0 业务深化前稳定性审计已完成
- 审计结论：M15 治理成果稳定，业务闭环完整，可进入 M16 开发阶段
- 审计范围：WorkflowEvent 基础、业务闭环完整度、前端架构、后端架构、数据库 Schema

### M16.1 开发阶段（430_M16.1）

- 公开询价链路的真实数据绑定已完成
- 产品详情页 InquirySection 已接入完整 `productId + offerId + organizationId` 数据链
- 后端 `GET /products/:id` 返回关联 `offers`（含 organization），供详情页推导可询价报价
- 询价提交链路：产品详情 → Inquiry 提交 → 关联 Product/Organization → 后台 Inquiry 管理形成闭环
- 未新增业务模型、未改 Schema、未改 API Contract、未触碰冻结模块

### M16.2 开发阶段（431_M16.2）

- 前端 API 层规范化已完成
- 统一数据访问模式：`Page → Service → API Wrapper → Backend API`
- 迁移直接调用 `lib/api/*` 的页面：`categories`、`workspace/rfqs/create`
- 补充 `rfq.service.ts` 缺失的 `createRfq` 方法
- 页面层运行时已无直接业务 API 调用；仅保留类型导入与 API Wrapper 错误类引用
- 未改后端、未改 Schema、未改 API Contract、未改业务流程

### M16.3 开发阶段（432_M16.3）

- 公开站 SEO Metadata 基础能力已完成
- 新增 `apps/web/src/lib/seo.ts` 站点元数据常量（站点名/URL/描述/关键词）
- 根布局 `layout.tsx` 完善 metadataBase、title 模板、Open Graph、Twitter Card、robots、keywords
- 首页补充 metadata；静态页（about/business/knowledge/solutions）标题规范化，避免平台名重复
- 产品详情页 `products/[slug]` 新增 `generateMetadata` 动态 SEO（复用 service 层 getProduct）
- 未改后端、未改 Schema、未改 Migration、未改 API Contract，未创建 CMS / SEO 管理系统

### M16.4 评估阶段（433_M16.4）

- 内容管理 MVP 架构评估已完成（只读审计，无代码改动）
- 确认现状：无内容数据模型、无内容 API、无 Admin 内容入口、无内容详情页，仅有静态 `/knowledge`、`/solutions` 展示壳
- 评估结论：**M16 阶段不实施内容管理系统**，内容域推迟至 M17 开发（符合"禁止提前实施"原则）
- 已定义 M17 内容域 MVP 范围与开工前置清单，并明确复用 M16.3 SEO 机制与 M15 WorkflowEvent 基础

### M16.5 组件层 API 规范化（434_M16.5）

- 完成组件层运行时 API 调用规范化：扫描 `apps/web/src/components`，将 3 个组件（`InquiryForm`、`CategorySection`、`FeaturedProductsSection`）直接调用 `@/lib/api/*` 的运行时调用迁移至 Service 层
- 复用已有 Service 方法（`inquiry.service` / `category.service` / `product.service`），无需新增 Service 方法
- 前端数据访问架构统一为 `Component → Service → API Wrapper → Backend API`，组件层**无**运行时直接业务 API 调用、无 `fetch`/`client` 直连
- 仅修改 3 个组件的 import 路径，业务逻辑、页面行为、用户流程完全不变
- 未改后端、未改 Schema、未改 Migration、未改 API Contract；`apps/web` build 通过（exit code 0）
- 剩余项：组件层仍存在 5 处 `import type`（`RfqItem`/`RfqDetailItem`/`RfqResponseItem`/`DemandItem`/`DemandDetailItem`）为编译期类型引用，非运行时数据访问，属低风险可后续清理项

## Real Architecture State

- `apps/api`: 业务主域已经成型，具备 CRUD、workflow transition、workspace aggregate、admin aggregate。
- `apps/web`: 公共站点 + Buyer Workspace + Supplier Workspace + Dashboard 已成型。
- `apps/admin`: 平台运营与主数据管理能力完整，不是占位工程。
- `database/prisma`: Schema 覆盖身份、产品、供需撮合主链、治理审计与文件资产。

## Current Risks

1. `前端分层历史包袱基本清理`
   - 页面层运行时直接调用 `lib/api/*` 已迁移至 service 层（M16.2），组件层运行时直接调用已迁移至 service 层（M16.5）；组件层仍存在 5 处 `import type` 类型引用（`RfqItem`/`RfqDetailItem`/`RfqResponseItem`/`DemandItem`/`DemandDetailItem`），为编译期类型引用、非运行时数据访问，属低风险可后续清理项。
2. `内容体系排版与运营能力待深化`
   - 内容域后端/Admin/Web 已落地（M17），Markdown 编辑与 Web 安全渲染已完成（M18.1），Content Media 管理已实现（M18.2 Implementation：Content→ContentMedia→FileAsset 链路 + 媒体下载发布状态校验），SEO 深化已完成（M18.3：OpenGraph / JSON-LD / Sitemap / Canonical）；工作流增强（M18.4）已完成架构规划（Revision History / Scheduled Publish / Reviewer Record / Approval History），待实施。
3. `SEO 基础依赖站点正式域名`
   - `SITE_URL` 默认占位域名，生产环境需通过 `NEXT_PUBLIC_SITE_URL` 配置正式域名。
4. `存在局部重复建设/兼容遗留`
   - 典型表现为 Dashboard / Workspace 双入口兼容；组件层运行时 API 直连已清理，仅剩 5 处 `import type` 低风险类型引用。

### M16 阶段关闭（435_M16_Closeout_Audit）

- **M16 状态：`IN_PROGRESS` → `COMPLETED`（M16 CLOSED）**
- M16.0-M16.5 全部任务完成并通过关闭审计（报告 429-434 均在 `docs/_review/`）
- 稳定化目标达成：公开询价链路稳定、前端 API 分层统一（页面+组件运行时均走 Service 层）、SEO 基础能力完成、内容管理边界明确（推迟 M17）、组件层 API 治理完成
- 冻结模块状态：Auth / WorkflowEvent / Notification / AuditLog / Database Schema 均无变化，无 Schema 变更、无新增 Migration、无 API Contract 变更
- 架构约束保持：后端 `Controller → Service → Domain Logic → Persistence → WorkflowEvent → Notification/Audit`；前端 `Page → Component → Service → API Wrapper → Backend API`
- 业务闭环可运行：`Product → Demand → Matching → RFQ → RFQ Response → Inquiry → Notification → Admin Operation`
- **M16 关闭条件已满足，允许进入 M17 内容域立项（仅规划，不实施）**

## M17 启动（436_M17.0_Content_Domain_Architecture_Planning）

- **M17 状态：`PLANNED` → `IN_PROGRESS`（启动规划）**
- 完成内容域架构规划（只读设计，无代码改动）：
  - 定位：工业检测行业知识内容平台（非商城/广告/供应商店铺）
  - Content 实体提案：统一单表 + `type` 判别（ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT），含 title/slug/summary/content/status/publishedAt/author/SEO 内联字段
  - 工作流映射：DRAFT(CREATED)→REVIEW(SUBMITTED/REVIEWED)→PUBLISHED(OPENED)→ARCHIVED(CLOSED)，复用现有 WorkflowAction/WorkflowEvent
  - API 提案：Public GET `/content` 列表+详情；Admin POST/PATCH + submit/review/publish/archive 生命周期
  - 前端规划：Web `/knowledge`、`/knowledge/[slug]`、`/solutions`、`/solutions/[slug]`+动态 SEO；Admin Content List/Editor/Publish
- 冻结区域未触碰：Schema/Migration/Auth/WorkflowEvent/Notification/AuditLog/已有 API Contract 均无变化
- 治理提示：WorkflowEntityType 需在 M17.1 评审批准新增 `CONTENT` 值（当前仅设计，未实施）

## M17.1 内容模型设计评审（437_M17.1_Content_Model_Design_Review）

- **M17.1 评审完成（437）**：对 436 内容域设计进行正式评审，**评审通过（Conditional Approved）**，设计冻结
- **Content Model Decision**：统一 `Content` 实体冻结（type/title/slug/summary/content/coverImageId/status/authorId/publishedAt/archivedAt/SEO 内联字段）；能力覆盖 Knowledge/Solution/Article，预留 Insight
- **ContentType Decision**：MVP 仅启用 ARTICLE / KNOWLEDGE / SOLUTION；INSIGHT 延期
- **ContentStatus Workflow Decision**：DRAFT(CREATED)→REVIEW(SUBMITTED/REVIEWED)→PUBLISHED(OPENED)→ARCHIVED(CLOSED)，复用现有 WorkflowAction，状态流转由 Domain Logic 强制校验
- **Workflow EntityType Decision**：M17.2 允许新增 `CONTENT` 值（本任务仅记录决策，未修改枚举）
- **API Contract 冻结**：Public GET `/content` 列表+详情（仅 PUBLISHED）；Admin POST/PATCH + submit/review/publish/archive
- **Frontend/Admin 冻结**：Web `/knowledge`、`/knowledge/[slug]`、`/solutions`、`/solutions/[slug]`（复用 M16.3 SEO）；Admin Content List/Editor/Publish
- 冻结区域未触碰：Schema/Migration/Auth/WorkflowEvent/Notification/AuditLog/已有 API Contract 均无变化

## M17.2 内容域基础实现（438_M17.2_Content_Domain_Foundation_Implementation）

- **M17.2 Started & Completed（438）**：Content Domain 后端基础落地，构建与运行验证通过
- **WorkflowEntityType 扩展**：新增 `CONTENT` 值（仅此一项触碰 Workflow 枚举；WorkflowAction 未改）
- **Content Schema Added**：新增 `ContentType`/`ContentStatus` 枚举 + `Content` 模型（author→User、coverImage→FileAsset、slug unique、[type,status] 索引）
- **Migration Added & Applied**：`20260811154853_m17_2_content_domain`（本地 PostgreSQL 已执行）
- **Content Module 创建**：`apps/api/src/content/`（module/controller/service + create/update/query DTO）
- **API**：新增 `/api/v1/content`（ADMIN 保护：GET/POST/PATCH + submit/review/publish/archive）；Public API 未开放
- **Security**：沿用 JwtAuthGuard + RolesGuard + ADMIN；Auth/Notification/AuditLog/既有模块未改动
- **Build**：`apps/api` build ✅、运行 ✅（Content 路由映射成功）；admin/web 未改动，无需重建

## M17.3 内容管理 Admin 基础（439_M17.3_Content_Admin_Foundation）

- **M17.3 Started & Completed（439）**：Content Domain Admin 管理基础落地，Admin build 通过（exit code 0）
- **Admin Menu**：`AdminLayout` 新增「内容管理」入口（`/content`）
- **Admin Route**：新增 `/content`（列表）、`/content/create`（创建）、`/content/:id`（编辑/生命周期管理）
- **Service Layer**：新增 `apps/admin/src/api/content.service.ts`，封装 getList/getById/getBySlug/create/update/submit/review/publish/archive
- **组件**：新增 `ContentForm` 共享表单组件（基本信息 + SEO）
- **页面**：`ContentList`（type/status 筛选 + 分页）、`ContentCreate`（创建草稿）、`ContentEdit`（编辑 + 生命周期操作）
- **生命周期操作**：DRAFT→提交审核(submit)、REVIEW→审核通过(review)、PUBLISHED→归档(archive)，均带 Modal 确认
- **架构约束保持**：`Page → Service → API Wrapper → Backend API`，页面无直接 `fetch`/`axios`
- **冻结区域未触碰**：Schema / Migration / Auth / WorkflowAction / Notification / AuditLog / Content API Contract 均无变化
- **Build**：`apps/admin` build ✅（exit code 0），验证通过

## M17.4 内容公开 Web 接入（440_M17.4_Content_Public_Web_Integration）

- **M17.4 Started & Completed（440）**：Web 公共内容域接入落地，`apps/web` 编译/类型检查通过
- **后端公开读接口（用户审批新增，增量非破坏）**：`GET /content/public`（仅 PUBLISHED，支持 type 筛选 + 分页）、`GET /content/public/:slug`（按 slug 返回 PUBLISHED 内容）；沿用 `Controller → Service → Prisma`，不改既有 ADMIN 端点路径/参数/返回，不触碰 Schema/Migration
- **Service Layer**：新增 `apps/web/src/services/content.service.ts`（getContentList / getContentBySlug）+ API Wrapper `apps/web/src/lib/api/content.ts` + 类型 `apps/web/src/types/content.ts`
- **Knowledge 动态化**：`/knowledge` 列表页改为动态 Content API（type=KNOWLEDGE），新增 `/knowledge/[slug]` 详情页
- **Solutions 动态化**：`/solutions` 列表页改为动态 Content API（type=SOLUTION），新增 `/solutions/[slug]` 详情页
- **SEO 接入**：详情页 `generateMetadata()` 复用 M16.3 `seo.ts`，来源 `seoTitle / seoDescription / title / summary`
- **架构约束保持**：`Page → Service → API Wrapper → Backend API`，页面无直接 `fetch`
- **冻结区域未触碰**：Schema / Migration / Auth / WorkflowAction / Notification / AuditLog / 既有 Content API Contract / Admin Content 均无变化
- **Build**：`apps/web` `tsc --noEmit` exit 0 ✅；`next build` 全阶段成功（编译 + 类型校验 + 27 静态页），exit -1 为机器 SWC 原生 DLL 环境问题（非代码引入）

## M17.4 Public Content API Security Audit（441_M17.4_Public_Content_API_Security_Audit）

- **M17.4 Audit Completed（441）**：对 Public Content API 完成专项安全与架构审计，核心隔离项全部通过
- **PUBLISHED 隔离** ✅：列表 `findAllPublic` 与详情 `findPublishedBySlug` 均在 **DB 层**强制 `status=PUBLISHED`（`where` 条件），无先全量 `findMany` 再前端过滤
- **slug 隔离** ✅：详情 `findFirst({ where: { slug, status: PUBLISHED } })`，slug 与 PUBLISHED 双条件同处数据库查询
- **响应边界（审计整改，最小修复）**：公开端点原返回原始 Prisma Model，暴露 `status / archivedAt / authorId / author.email`（PII）。已新增 `publicContentSelect` 公开安全投影，仅暴露 `id / type / title / slug / summary / content / publishedAt / seoTitle / seoDescription / seoKeywords / createdAt / updatedAt / author.name / coverImage(Name)`，剔除内部字段与作者邮箱
- **分页（审计整改，最小修复）**：`pageSize` 原仅 Swagger docs 声明 max=100，无运行时校验。已补 `@Min(1)` / `@Max(100)` 运行时校验，限制 `MAX_PAGE_SIZE <= 100`
- **Rate Limit** ✅：公开端点继承全局 `ThrottlerGuard`（APP_GUARD，100 req/60s），无需单独配置
- **SEO 来源** ✅：`seoTitle / seoDescription / title / summary`，与 M16.3 SEO Foundation 一致，未新增 SEO 体系
- **冻结区域未触碰**：本任务仅最小修复 `apps/api/src/content/*`（公开投影 + DTO 校验）；Schema / Migration / Auth / Workflow / Notification / Audit / 既有 ADMIN Content API 均无变化
- **Build**：`apps/api` `tsc --noEmit` exit 0 ✅

## M17.5 Content Domain Enhancement Planning（442_M17.5_Content_Domain_Enhancement_Planning）

- **M17.5 Planning Completed（442，Architecture Planning Only，No Code Change）**：对 Content Domain 完成阶段性增强规划评审，MVP 闭环完整性确认，后续增强方向定稿，作为 M18 实施范围基线
- **MVP 闭环评估** ✅：`Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata` 已形成完整闭环，满足当前 MVP
- **内容编辑策略（推荐）**：**Option A — Markdown Content + Preview Rendering**（当前 `content` 为纯文本 `prose` + `whitespace-pre-wrap`；推荐演进为 Markdown 存储 + 预览渲染，成本低、易迁移、与 SEO/纯文本兼容）；Rich Text（Option B）与 Headless CMS（Option C）暂不采用
- **媒体管理演进**：当前 `Content.coverImageId → FileAsset` 单封面；规划未来 `ContentMedia → FileAsset` 一对多，支持多图/图文混排/案例图/检测报告附件（M18 规划，不实施）
- **SEO 演进**：当前 `seoTitle/seoDescription/seoKeywords` 满足 MVP；规划未来 OpenGraph / Structured Data / Sitemap / Canonical / SEO Metadata 管理（M18 规划，不拆分 SeoMetadata 模型）
- **工作流演进**：当前 DRAFT→REVIEW→PUBLISHED→ARCHIVED 满足 MVP；规划未来 Draft Version / Revision History / Scheduled Publish / Reviewer / Approval Record（M18 规划，不新增 Role）
- **内容类型演进**：当前 ARTICLE/KNOWLEDGE/SOLUTION，预留 INSIGHT；规划未来 Case Study / Technical Guide / Industry Report / Product Application（M18 规划）
- **架构约束保持**：保持 `WorkflowEntityType.CONTENT` 与既有 `WorkflowAction`（CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED），不新增 ContentWorkflowAction；不新建独立 CMS 子系统
- **冻结区域未触碰**：Schema / Migration / Auth / Workflow / Notification / AuditLog / Content API / Admin / Web 均无修改；Build Not Required

## M18 Content Operation Capability Implementation Planning（443_M18.0_Content_Operation_Capability_Implementation_Planning）

- **M18 Started（443，Architecture Planning Only，No Code Change）**：基于 442 增强规划基线，制定 M18 内容运营能力五优先级实施路线，作为 M18 各子阶段开发范围基线
- **M17 复核** ✅：Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata 端到端闭环达成，MVP 状态 **Complete**
- **M18 实施优先级**：
  1. **Priority 1 — Markdown Content Rendering Foundation**（M18.1）：Markdown 存储 + Admin 预览 + Web 安全渲染 + XSS 防护 + 既有内容兼容（复用 `Content.content`，零数据迁移）
  2. **Priority 2 — Content Media Management Foundation**（M18.2）：规划 `Content → ContentMedia → FileAsset` 一对多，支持图片/附件/报告文件/排序/描述
  3. **Priority 3 — SEO Enhancement Foundation**（M18.3）：OpenGraph image / JSON-LD / Sitemap / Canonical（不拆分 SeoMetadata 模型）
  4. **Priority 4 — Content Workflow Operation Enhancement**（M18.4）：Revision History / Scheduled Publish / Reviewer Record / Approval History（不新增 WorkflowAction）
  5. **Priority 5 — Extended Content Types**（M18.5）：规划 CASE_STUDY / TECHNICAL_GUIDE / INDUSTRY_REPORT / PRODUCT_APPLICATION（当前阶段不新增枚举）
- **M18 子阶段**：M18.1 Markdown → M18.2 Content Media → M18.3 SEO → M18.4 Workflow → M18.5 Content Type Expansion
- **架构约束保持**：Content 保持统一内容领域模型，不拆分 Article/Knowledge/Solution 独立模型；不引入 Headless CMS / 独立 CMS / 新权限系统；SEO 延续 `Content.seoTitle/seoDescription/seoKeywords`；Workflow 延续 `WorkflowEntityType.CONTENT`，不新增 ContentWorkflowAction
- **冻结区域未触碰**：Schema / Migration / Auth / Workflow / Notification / AuditLog / Content API / Admin / Web 均无修改；Build Not Required

## M18.1 Markdown Content Enhancement Implementation（444_M18.1）

- **M18.1 Started & Completed（444）**：内容增强第一阶段（Markdown）落地，三个应用构建全部通过（API / Admin / Web build exit 0）
- **Markdown 存储复用** ✅：`Content.content`（TEXT）保持不变，零数据迁移，直接承载 Markdown；Database State = No Change
- **Admin Markdown 编辑器 + 预览面板** ✅：新增 `apps/admin/src/components/content/MarkdownEditor.tsx`（编辑 / 预览 Segmented 切换，react-markdown + remark-gfm），`ContentForm` 正文由 `TextArea` 升级为 `MarkdownEditor`；支持标题/列表/表格/引用/图片引用/链接
- **Admin INSIGHT 类型支持** ✅：`ContentForm` 类型下拉新增「参数百科（Insight）」，`ContentList` 类型筛选新增 INSIGHT；Admin 类型定义（Create/Update/FormData）扩展 INSIGHT
- **Web Markdown 安全渲染** ✅：新增 `apps/web/src/components/markdown/MarkdownRenderer.tsx`（服务端渲染，react-markdown + remark-gfm + `skipHtml` + 链接/图片协议白名单），`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页已由纯文本升级为安全 Markdown 渲染；SEO metadata 逻辑保留
- **Web 排版依赖** ✅：安装 `@tailwindcss/typography` 并启用 `prose` 插件（原 `prose` 类此前未生效），Markdown 排版正确呈现
- **后端 DTO 校验扩展（最小变更）** ✅：`CreateContentDto` / `UpdateContentDto` 的 `@IsIn` 允许 `INSIGHT`（DB enum 已含 INSIGHT），支持参数百科示例内容创建；未改动端点/路径/返回结构（API Contract 保持）
- **参数百科定位** ✅：`type=INSIGHT` 内容仅作为关联内容基础，不创建独立导航入口、不生成公开链接、不实现独立模块；通过产品详情页参数字段弹窗/关联方式展示（规划，未实施）
- **示例 Content 数据** ✅：新增 `database/seed_content.ts`（幂等 upsert，tsx 执行），已入库 8 条 PUBLISHED 示例：KNOWLEDGE 3 / SOLUTION 2 / INSIGHT（参数百科）3
- **Security** ✅：Web 渲染 `skipHtml` 不执行原始 HTML（含 script/style/iframe），链接/图片仅允许 http/https/mailto/tel 及站内相对路径，拦截 javascript:；无公开安全边界扩大
- **Freeze 兼容** ✅：Schema / Migration / Auth / Role / Permission / WorkflowAction / Notification / Audit / Content API 端点契约 均无变化
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（仅 img/alt 非阻塞 lint 提示）

## M18.2 Content Media Architecture Planning（445_M18.2）

- **M18.2 Planning Completed（445，Architecture Planning Only，No Code Change）**：Content Media Management 架构设计评审完成，为 M18.2 Implementation 提供冻结设计基线
- **推荐模型** ✅：`Content → ContentMedia → FileAsset` 中间表模式（完全复用 `Product → ProductMedia → FileAsset` 成熟链路，含 `createWithUpload` 原子上传-create 与删除级联 S3 清理）
- **候选字段** ✅：`id / contentId / fileAssetId / type(IMAGE|ATTACHMENT) / caption / sortOrder / createdAt / updatedAt`
- **Schema Impact 评估** ✅：未来新增 `ContentMedia` 模型 + `FileEntityType.CONTENT` 枚举扩展 + `Content.media` 反向关系；`Content.coverImageId` 与 `FileAsset` 实体字段保持不变；需 1 个新 Migration（本任务未创建）
- **Public API 策略** ✅：推荐方案 A（详情 `GET /content/public/:slug` include `media`，向后兼容，列表保持轻量，不新增公开端点）；Public 投影永不暴露 storageKey
- **Admin 方向** ✅：内容编辑页新增媒体管理区块（多图/附件/排序/图注/封面/删除替换），复用 FileAssetService 能力
- **Web 方向** ✅：详情页新增 Media Gallery + Attachments 展示（图片经大图、附件经预签名 URL 下载）
- **Security** ✅：识别关键缺口——`GET /files/:id/download` 无「实体→发布状态」归属校验，需在 Implementation 落地「仅 PUBLISHED 内容媒体可公开下载」；storageKey 保护与 Public 字段投影保持
- **Freeze 兼容** ✅：Schema / Migration / Auth / Workflow / Notification / Audit / Content API / Role 均无变化

## M18.2 Content Media Implementation（446_M18.2）

- **M18.2 Implementation Started & Completed（446）**：基于 445 冻结设计基线，Content Media Management 第一阶段能力落地，三端 build 全部通过（API / Admin / Web exit 0）
- **Database** ✅：新增 `ContentMediaType`（IMAGE/ATTACHMENT）枚举 + `ContentMedia` 模型（contentId/fileAssetId/type/caption/altText/sortOrder，contentId 与 fileAssetId 索引，content 级联删除）；扩展 `FileEntityType.CONTENT`；`Content.coverImageId` 继续作为封面保持；新增 Migration `20260812104939_m18_2_content_media`（表 + 2 索引 + 2 外键 + 枚举扩展）
- **Backend** ✅：新增 `apps/api/src/content-media/`（module/controller/service + create/update DTO）；Admin：`POST /content/:contentId/media`、`POST /content/:contentId/media/upload`（原子上传-create，复用 FileAssetService，entityType=CONTENT）、`PATCH /content/:contentId/media/:mediaId`、`DELETE /content/:contentId/media/:mediaId`；Public：`GET /content/:contentId/media`（列表，Public 投影永不暴露 storageKey）；`FileAssetService.upload` 增加 entityType 参数；`publicContentSelect` 扩展 include `media`（含 fileAsset，不含 storageKey）
- **Security（关键修复）** ✅：`GET /files/:id/download` 增加「实体→发布状态」归属校验——`entityType=CONTENT` 的文件仅当其所属 Content 为 `PUBLISHED` 时允许公开下载；DRAFT / REVIEW / ARCHIVED 与未关联内容的文件一律拒绝（ForbiddenException）
- **Admin** ✅：内容编辑页新增「媒体管理」区块（`ContentMediaManager.tsx`）：上传（按 MIME 自动判别图片/附件）、列表（图片经签名 URL 预览）、编辑（类型/说明/Alt/排序）、删除（级联删除 FileAsset + S3）
- **Web** ✅：详情页新增 Media Gallery + Attachments 展示（`components/content/MediaGallery.tsx`），图片经 `/files/:id/download` 大图展示、附件经预签名 URL 下载；`/knowledge/[slug]` 已接入
- **Freeze 兼容** ✅：未创建 Article/Knowledge/Solution 独立模型、未建 CMS、未建 Insight 模块、未建参数百科页面、未新增 Role、未建 Permission System、未改 WorkflowAction / Notification / Audit System
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（仅既有非阻塞 img/alt 提示）

## M18.3 SEO Enhancement Implementation（447_M18.3）

- **M18.3 SEO Enhancement Started & Completed（447）**：基于 443 规划与 446 实施成果，Content SEO 展示层能力落地，`apps/web` build 通过（exit 0）
- **OpenGraph** ✅：`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页 `generateMetadata()` 增强 OpenGraph（title/description/url/images），图片优先取 `coverImage`（`ContentCoverImage`），其次媒体首图（`media` 中首个 IMAGE 的 fileAsset）；Solution 页 OpenGraph type 为 `website`
- **JSON-LD Structured Data** ✅：新增 `apps/web/src/lib/seo.ts` 的 `buildContentJsonLd()`，Knowledge 详情输出 `Article`、Solution 详情输出 `TechArticle`；仅暴露无敏感展示字段（headline/description/url/image/datePublished/dateModified/author.name + publisher），不含内部 ID 与 storageKey
- **Sitemap** ✅：新增 `apps/web/src/app/sitemap.ts`，`/sitemap.xml` 仅收录 PUBLISHED 内容（公开 API DB 层强制），含静态核心路由（/、/knowledge、/solutions、/products、/business、/about）+ 知识/解决方案详情页（带 lastModified）；内容拉取失败时降级仅返回静态路由
- **Canonical** ✅：两个详情页均输出 `alternates.canonical`（基于 `SITE_URL` 的绝对 URL）
- **Content 单模型保持** ✅：未新增 SeoMetadata 模型、未新建 SEO Module、未改 Prisma Schema、未创建 Migration、未改 Content Model、未创建 CMS、未做 AI SEO 自动生成
- **架构约束** ✅：SEO 元数据完全复用 `Content.seoTitle / seoDescription / seoKeywords / coverImage`，无新增数据模型
- **Freeze 兼容** ✅：Schema / Migration / Auth / Workflow / Notification / Audit / Content API / Admin 均无变化
- **Build** ✅：`pnpm --filter @visndt/web build` 通过（exit 0），`/sitemap.xml`、`/knowledge/[slug]`、`/solutions/[slug]` 均成功生成（SWC Native DLL 警告为机器环境问题，非代码引入）

## M18.4 Workflow Operation Enhancement Architecture Planning（448_M18.4）

- **M18.4 Architecture Planning Completed（448，Architecture Planning Only，No Code Change）**：Content Workflow Operation Enhancement 架构规划评审完成，输出 M18.4 Implementation 冻结设计
- **当前 Workflow 复核** ✅：Content 生命周期 `create(DRAFT/CREATED)→submit(REVIEW/SUBMITTED)→review|publish(PUBLISHED/REVIEWED|OPENED)→archive(ARCHIVED/CLOSED)`；`update` 仅 DRAFT/REVIEW 可编辑；复用 `WorkflowEntityType.CONTENT` + 既有 `WorkflowAction`，未新增 ContentWorkflowAction
- **关键发现** ✅：`WorkflowEventsService.create()` 要求 operator 有 organizationId，Content 按 author/user 维度操作导致 `emitEvent()` 用 try/catch 吞掉错误，**Content 工作流事件可能被静默丢弃**；Content 生命周期未接入 AuditLog 系统审计；Notification 无 CONTENT 类型
- **Revision History 评估** ✅：推荐 **方案 A — ContentRevision 独立历史表**（数据完整性/查询效率/审计能力/未来扩展优于 AuditLog 承担或 Content JSON snapshot；避免污染 AuditLog「系统审计」边界）
- **Scheduled Publish 评估** ✅：Content 新增 `scheduledPublishAt DateTime?` + 轻量后台轮询；**不新增 Schedule 模型**、不引入 CMS Scheduler；复用 WorkflowEvent（`OPENED` + metadata 标记 scheduled）；不新增 WorkflowAction
- **Reviewer Record 评估** ✅：复用 `WorkflowEvent.operatorId` + User，**不新增 Reviewer 表**
- **Approval History 边界** ✅：WorkflowEvent（业务时间线 APPROVAL TIMELINE）与 AuditLog（系统审计 old/new）**分离不混用**；纳入 Implementation 整改：修复 Content WorkflowEvent 可靠性 + 补齐 Content AuditLog 审计
- **Freeze 兼容** ✅：未改 Schema / Migration / API / Admin / Web / WorkflowAction / Role / Permission / Notification / AuditLog
- **Build** ✅：Not Required

## M18.4.1 Workflow Reliability Foundation Implementation（449）

- **M18.4.1 Workflow Reliability Foundation Started & Completed（449）**：基于 448 设计基线，实施 Workflow Reliability Foundation 前置整改，API / Admin build 通过（exit 0）
- **WorkflowEvent 可靠性修复** ✅：`apps/api/src/workflow-events/workflow-events.service.ts` 放宽 `create()` 组织约束——仅对组织绑定实体（Demand/RFQ/...）强制校验 `organizationId`，对 `WorkflowEntityType.CONTENT`（author/user 维度）豁免；`apps/api/src/content/content.service.ts` `emitEvent()` 移除 try/catch 吞错，WorkflowEvent 失败不再静默丢失，改为向上抛出（数据完整性 > 静默成功）
- **Content 生命周期 AuditLog 接入** ✅：`content.service.ts` 注入 `AuditLogService`，新增审计记录点——`create`（CREATE，newValue=title/status/SEO/coverImageId）、`update`（UPDATE，old/new 对比）、`transition`（submit/review/publish/archive 均记 STATUS_CHANGE，oldValue=from / newValue=to）；`content.controller.ts` 的 `update` 端点补传 `@CurrentUser` 以提供 operatorId
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线，不承担 old/new 数据审计）与 AuditLog（系统审计 actor/action/entityType/entityId/oldValue/newValue）分离不混用；AuditLog 未公开返回
- **Security** ✅：无新公开 API、无新权限、无新 Role、无新数据泄露
- **Freeze 兼容** ✅：未改 Schema / Migration / ContentRevision / Scheduler / WorkflowAction / Role / Permission / Notification / Web
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 无需修改

## M18.4.2 Content Revision Implementation（450）

- **M18.4.2 Content Revision Implementation Started & Completed（450）**：基于 448 设计基线 + 449 前置整改，实施 Content Revision History 能力，为 M18.4.3 Scheduled Publish / M18.4.4 Approval Timeline 提供版本基础
- **ContentRevision 独立版本历史模型** ✅：`database/prisma/schema.prisma` 新增 `ContentRevision`（`content_revision` 表），与 `Content` 1:N（`@@index([contentId, version])`，`onDelete: Cascade`）；快照字段 `title/summary/content/seoTitle/seoDescription/seoKeywords/coverImageId/snapshot/createdBy/createdAt`；生成并应用迁移 `20260812043433_m18_4_2_content_revision`（`pnpm prisma migrate status` 显示 23 迁移、schema 同步、up to date）
- **Content 版本快照保存** ✅：`apps/api/src/content-revision/` 新增模块（`content-revision.module/service/controller`）；`ContentService.create()` 在事务内创建 revision v1，`update()` 在事务内创建 revision v(n+1)（`max(version)+1`）；Revision 写入失败则 Content 写入回滚（数据完整性 > 静默成功）；状态变更（submit/review/publish/archive `transition`）不创建 revision（状态属 WorkflowEvent，操作属 AuditLog）
- **Admin Revision History UI** ✅：`apps/admin/src/components/content/ContentRevisionHistory.tsx` 新增版本历史区块（版本/创建人/创建时间 + 查看版本快照 Modal），集成于 `ContentEdit.tsx`；`content.service.ts` 新增 `listRevisions` / `getRevision`，`content.types.ts` 新增 `ContentRevisionSummary` / `ContentRevisionDetail`；暂不实现 Restore / Diff
- **职责边界保持** ✅：WorkflowEvent（流程时间线）/ AuditLog（系统审计）/ ContentRevision（历史内容快照）三者分离不混用；Revision 仅 Admin 可查，不公开暴露
- **Security** ✅：Revision API 均 `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`；无新公开 API、无权限/Role/数据泄露
- **Freeze 兼容** ✅：未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API；未新增 ContentWorkflowAction / ArticleWorkflow / KnowledgeWorkflow / SolutionWorkflow / CMS Scheduler / Revision Permission System
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（Web 未触碰 `apps/web`，仅验证）

## M18.4.3 Content Scheduled Publish Implementation（451）

- **M18.4.3 Content Scheduled Publish Implementation Started & Completed（451）**：基于 448 设计基线 + 449 前置整改 + 450 ContentRevision 基础，实施 Content 定时发布能力，满足「不新增 WorkflowAction / 不新增 Schedule 模型 / 不引入 CMS Scheduler / 保持 Content 单模型」
- **Content.scheduledPublishAt** ✅：`database/prisma/schema.prisma` `Content` 模型新增可空 `scheduledPublishAt DateTime?`（`@map("scheduled_publish_at")`）+ `(status, scheduledPublishAt)` 复合索引；生成并应用迁移 `20260812054723_m18_4_3_scheduled_publish`（`pnpm prisma migrate status` 显示 24 迁移、schema 同步、up to date；`m18_4_2_content_revision → m18_4_3_scheduled_publish` 顺序正确）
- **ContentSchedulerService** ✅：`apps/api/src/content/content.scheduler.ts` 新增轻量调度器——`onModuleInit` 启动 `setInterval`（60s，`unref` 不阻塞退出），`running` 标志防重入；仅扫描 `status=REVIEW AND scheduledPublishAt <= now()`，逐条复用 `ContentService.publish()`（不复制发布逻辑）；`ensureSystemUser()` 幂等创建 `system@visndt.com` 系统身份（无组织关联）作为执行主体保证可追踪
- **幂等与失败恢复** ✅：`ContentService.transition()` 改为原子条件更新（`updateMany where {id, status: from}`，count=0 视为已变更），并发/重复扫描下只产生一次 OPENED 与一次 STATUS_CHANGE；单条发布失败 catch 记录错误日志不阻塞其他内容，下一轮扫描自动重试，不修改 `scheduledPublishAt`
- **生命周期约束** ✅：`UpdateContentDto` 新增可空 `scheduledPublishAt`（`@IsDateString`）；`ContentService.update()` 仅允许 REVIEW 状态设置/清除，DRAFT/PUBLISHED/ARCHIVED 禁止；发布成功自动清除 `scheduledPublishAt`
- **WorkflowEvent 复用** ✅：自动发布产生 `action=OPENED`，metadata `{ scheduled: true, scheduledAt }`；无新增 WorkflowAction
- **AuditLog 复用** ✅：自动发布产生 STATUS_CHANGE，`oldValue:{status:REVIEW}` `newValue:{status:PUBLISHED, scheduled:true}`
- **Admin 定时发布配置 UI** ✅：`apps/admin/src/components/content/ContentScheduledPublish.tsx` 新增（REVIEW 状态选择时间/设置/清除 + 计划状态 Tag 展示），集成 `ContentEdit.tsx`；`content.types.ts` 新增 `scheduledPublishAt`
- **Security** ✅：Scheduler 无公开接口、不绕过审核、不新增 Role/Permission、不泄露 REVIEW/DRAFT 内容；Public Content API 仍强制 `status=PUBLISHED`
- **Freeze 兼容** ✅：未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API / ContentRevision；未新增 Schedule / SchedulerJob / ContentSchedule / PublishTask 模型；`apps/web` 未修改
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 无需修改（公开内容仍按 `status=PUBLISHED`）

## M18.4.4 Content Approval Timeline Enhancement（452）

- **M18.4.4 Content Approval Timeline Enhancement Started & Completed（452）**：基于现有 WorkflowEvent 实现 Content 审核历史查询，完成 M18.4 Workflow Operation Enhancement 阶段闭环；仅实现查询 + Admin 展示 + WorkflowEvent 查询增强
- **Backend 查询能力** ✅：`WorkflowEventsService.findContentTimeline(contentId)` 新增按 Content 的业务流程时间线查询——`where { entityType: CONTENT, entityId: contentId }`、`createdAt` 升序、投影 `id/action/operator(id,name)/metadata/createdAt`；Reviewer 复用 `WorkflowEvent.operatorId + User`（无 Reviewer/ApprovalUser/ContentReviewer 模型）
- **Admin 接口** ✅：新增 `GET /content/:id/approval-timeline`（`@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`，不公开）；由 `ContentController` 注入 `WorkflowEventsService` 提供
- **Admin Approval Timeline UI** ✅：`apps/admin/src/components/content/ContentApprovalTimeline.tsx` 新增（antd Timeline 展示 Created→Submitted→Reviewed→Published→Archived，每项显示 Action/Operator/Time/Status Transition），集成 `ContentEdit.tsx`「审核时间线」卡片；`content.service.ts` 新增 `getApprovalTimeline`，`content.types.ts` 新增 `ContentApprovalTimelineItem`/`ContentWorkflowAction`
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）三者分离；Timeline 仅来源于 WorkflowEvent，不读取 AuditLog / Revision；仅展示不落地审批动作
- **Security** ✅：Timeline 接口 ADMIN-only、不公开；不返回 AuditLog / Revision 内容 / storageKey / 用户邮箱等敏感字段（operator 仅 id + name）
- **Freeze 兼容** ✅：无 schema / migration 变化；未改 WorkflowEvent Schema、WorkflowAction、Role、Permission、Notification、Public Content API、ContentRevision、`apps/web`
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0；`apps/web` 未修改（Not Required）

## M18.5 Content Operation Stabilization（453，稳定化基线审计）

- **M18.5.1 Content Operation Stability Audit（453）已完成**：M18.5 Stabilization Phase Started。对 M18.4 Content Operation Enhancement 全量能力执行稳定性审计，结论为达稳定运营状态（无高风险、无代码变更）
- **Database Stability** ✅：`schema.prisma` 中 Content（status/publishedAt/archivedAt/scheduledPublishAt + `(status, scheduledPublishAt)` 复合索引）、ContentRevision（`@@index([contentId, version])` + Content 1:N cascade）、WorkflowEvent（`@@index([entityType, entityId])`）、AuditLog 均一致；`pnpm prisma migrate status` → 24 migrations up to date
- **Workflow Boundary** ✅：WorkflowEvent（业务流程时间线，CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED，metadata 仅含 to/scheduled，不存 old/new/快照）、AuditLog（系统审计，CREATE/UPDATE/STATUS_CHANGE，含 oldValue/newValue）、ContentRevision（版本快照，title/summary/content/SEO/coverImage，不含 workflow/audit）三层职责保持分离
- **Scheduler Reliability** ✅：`ContentSchedulerService` 分钟级扫描（仅 REVIEW + scheduledPublishAt<=now）、`running` 防重入、复用 `publish()`、transition 原子条件更新幂等、单条失败隔离 + 下轮重试、`system@visndt.com` 可追踪身份
- **Admin Operation** ✅：`ContentEdit.tsx` 完整组合「内容信息/生命周期按钮/内容表单/媒体管理/定时发布/审核时间线/版本历史」七个区块；Revision/Schedule/Timeline 组件均含错误处理、空状态、状态门控（仅 REVIEW 可配置定时发布）
- **API Contract** ✅：Content CRUD + submit/review/publish/archive + approval-timeline（ADMIN-only）+ Revision endpoints + public 读接口（仅 PUBLISHED）契约稳定
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0、`apps/web` build exit 0（警告均为既有非阻断告警）
- **Code Change** ✅：None（本任务仅审计，未新增功能/Schema/Migration/WorkflowAction/Role/Permission/NotificationType/Public API/`apps/web`）

## M18.5.2 Content Operation Type & Bundle Optimization（454，稳定化优化）

- **M18.5.2 Content Operation Type And Bundle Optimization（454）已完成**：Content Operation Stability Optimization Completed。治理 453 审计中的非业务风险项（TypeScript 类型导入规范 + Admin Bundle 结构）
- **Type Import 优化** ✅：审计确认 453 所列 5 处组件层类型引用（RfqItem/DemandItem 等）已随类型重命名全部使用 `import type`，全局 `apps/admin/src` 无 value-style 类型导入残留，无需改动（已确认）
- **Bundle 优化** ✅：`ContentEdit.tsx` 将 ContentMediaManager / ContentRevisionHistory / ContentScheduledPublish / ContentApprovalTimeline 改为 `React.lazy` + `Suspense` 按需加载（`ContentForm` 保持急切加载为主表单）；`components/content/index.ts` 移除 4 个被 lazy 化的组件静态重导出（仅保留 ContentForm）
- **Bundle Size 对比** ✅：主 chunk `index-*.js` **1854.61 kB → 1844.77 kB**（gzip 562.89 → 559.82 kB）；新增 4 个独立 lazy chunk（ContentApprovalTimeline 1.45 kB / ContentScheduledPublish 1.54 kB / ContentRevisionHistory 3.66 kB / ContentMediaManager 4.41 kB），仅在 ContentEdit 渲染对应面板时按需加载
- **功能完整性** ✅：ContentEdit 七区块（内容信息/生命周期按钮/内容表单/媒体管理/定时发布/审核时间线/版本历史）能力不减少；Revision/Schedule/Timeline/Media 仅改为按需加载，未改业务逻辑/API 调用/权限判断/UI 交互流程
- **职责边界保持** ✅：WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）职责不变
- **Freeze 兼容** ✅：无 schema / migration / API / 后端业务逻辑变化；未改 WorkflowAction / Role / Permission / Notification / Public Content API / `apps/web`
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 警告为既有非阻断告警）、`apps/web` build exit 0（Next 编译通过，警告为既有项）

## M18.5.3 Content SEO Operation Enhancement（455）

- **M18.5.3 Content SEO Operation Enhancement（455）已完成**：Content Operation Stabilization 阶段推进。增强 Admin Content SEO 管理能力（SEO 运营面板 + 质量提示 + 搜索结果预览），验证 Web 前台 SEO Metadata 输出链路。能力增强，不引入独立 SEO 系统。
- **SEO Operation Panel** ✅：`ContentEdit.tsx` 新增「SEO 运营面板」（`ContentSeoPanel`，`React.lazy` 按需加载，独立 chunk 3.71 kB），展示 SEO Title / SEO Description / SEO Keywords / Slug / Cover Image（封面图经 `fileAssetService.getSignedUrl` 渲染），与 Content Form 数据一致，复用现有 update API，不新增保存接口
- **SEO Validation（非阻断）** ✅：`ContentSeoPanel` 内置长度质量提示——SEO 标题建议 30-60 字符、SEO 描述建议 120-160 字符，状态为 符合建议/过短/过长/未设置（Tag 展示 + Alert 非阻断提示）；关键词为可选不强制
- **SEO Preview** ✅：新增 `ContentSeoPreview` 组件，Mock 搜索结果预览（Title / URL / Description），URL 按内容类型映射前台路由（KNOWLEDGE/SOLUTION 等）；仅展示，不生成 SEO
- **Web SEO 验证** ✅：审计确认 `apps/web` 知识/解决方案详情页 `generateMetadata` 已正确输出 `title` / `description` / `keywords` / `canonical`（alternates）/ OpenGraph / JSON-LD（Article/TechArticle），封面+媒体首图回退，Twitter Card 继承根布局；无缺失，无需修复
- **边界保持** ✅：SEO 信息继续属于 Content（seoTitle/seoDescription/seoKeywords）；未新增 SeoConfig/SeoKeyword/SeoHistory/SeoAnalytics 表、未新增 SEO Module/Service；WorkflowEvent/AuditLog/ContentRevision 职责不变；SEO 编辑仍复用 Content UPDATE AuditLog
- **Freeze 兼容** ✅：无 schema / migration / API / 后端业务逻辑变化；未改 WorkflowAction / Role / Permission / Notification / Public Content API
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 警告为既有非阻断告警）、`apps/web` build exit 0（Next 编译通过，警告为既有项）

## M18.5.4 Content Operation Final Audit（456）

- **M18.5.4 Content Operation Final Audit（456）已完成**：基于 448-455 基线执行 Content Operation 最终稳定性审计，**M18.5 Content Operation Stabilization Closed（阶段关闭）**。Audit First，无代码变更（Code Change None）。
- **Content Architecture** ✅：Content 实体（status/publishedAt/archivedAt/scheduledPublishAt/seoTitle/seoDescription/seoKeywords）完整；WorkflowEvent（业务时间线，仅 action+metadata，无快照/oldValue-newValue，CONTENT 实体豁免组织校验）、AuditLog（系统审计，CREATE/UPDATE/STATUS_CHANGE 含 operator/action/oldValue/newValue，不作为 Timeline 来源）、ContentRevision（内容快照，title/summary/content/SEO/coverImageId，不存 workflow 状态/approval timeline，contentId 1:N + version strategy max+1）三层职责边界无混用
- **Database / Migration** ✅：`pnpm prisma migrate status` → **24 migrations found，Database schema is up to date**；Content 索引（type+status/status/status+scheduledPublishAt）、ContentMedia（contentId+fileAssetId）、ContentRevision（contentId+version）合理
- **Workflow Reliability** ✅：Create（Content→WorkflowEvent CREATED→AuditLog CREATE→Revision v1，原子事务）；Update（DRAFT/REVIEW only→Revision v(n+1)→AuditLog UPDATE，原子事务）；Transition（原子 updateMany 条件更新保证幂等→WorkflowEvent→AuditLog STATUS_CHANGE）；Scheduler（仅 REVIEW + scheduledPublishAt≤now + running 锁 + 原子 transition + 失败隔离重试 + system 身份，无重复发布风险）；Timeline（WorkflowEvent.findContentTimeline，CONTENT 升序）
- **Admin Operation** ✅：ContentEdit 七区块完整——内容信息、生命周期操作（submit/review/publish/archive）、媒体管理、版本历史、定时发布、审核时间线、SEO 运营面板；加载/错误/空状态与权限控制均存在
- **Security** ✅：所有 Admin Content 接口 `@Roles(ADMIN)` + `@ApiBearerAuth()`；Public API（`/public`、`/public/:slug`）数据库层强制 `status=PUBLISHED` + `publicContentSelect` 显式投影（排除 status/archivedAt/authorId/scheduledPublishAt/工作流元数据），ThrottlerGuard 限流；Web SEO（knowledge/solutions generateMetadata 输出 title/description/keywords/canonical/OpenGraph/JSON-LD，无独立 SEO 架构）
- **Build** ✅：`apps/api` build exit 0、`apps/admin` build exit 0（vite 大 chunk 警告为既有非阻断项）、`apps/web` build exit 0
- **Risk Assessment** ✅：无 High Risk；无 Medium Risk；Low 建议（非阻断）——Admin 主 chunk >500k 警告为既有项，可后续按需 manualChunks 优化（不属本阶段范围）

## M19 Product Experience Architecture Evolution（457-460，架构冻结）

- **M19 阶段定位**：产品体验架构重构阶段（非普通开发阶段），目标为产品体验重构、供应商能力展示、搜索体验升级、运营体系规划。
- **M19 架构冻结（457 平台能力重评审计）**：产品体系为 **A 平台标准产品库（Global Catalog）**；内容体系完整（High）；前端产品/供应商展示与参数筛选体验不足；确定 M19 前最高优先级为供应商展示断层与搜索能力闲置。
- **M19 架构再评估 Blueprint（458）**：推荐 **Product Global Catalog + Offer Supplier Display**；不默认引入 `Product.organizationId`；不新增 `ProductFamily/Model/SupplierOffering`；梳理 Web/Admin M19-M20 演进路线与 AI Readiness 底座（Embedding/Vector/RAG 为 M20 规划）。
- **M19 实施 Blueprint（459）**：冻结 Product Center 定位（工业检测设备标准产品目录 + 供应商能力展示 + 需求撮合 + 知识内容 + 未来 AI 选型入口）；定义产品列表/详情信息架构、动态参数搜索（ParameterDefinition 驱动）、Admin 产品运营中心、API 消费边界与数据复用原则（Backend Capability First，前端消费现有能力，零 Schema 变更）；拆分 M19.0-M19.4 阶段。
- **M19.1 Product Center V2 实施规划（460）**：细化产品列表（Category Navigation + Search + Dynamic Parameter Filter + Sort + Grid + Pagination）与详情（Overview / Media Center / Technical Specification / Certification / Supplier Capability / Inquiry Entry）信息架构；识别前端改造范围（lib/api/products.ts 需透传 parameterFilters、ProductParameters 需按 ParameterGroup 分组、询价需改选供应商、ManufacturerInfo 需接入 offers）；确认 **Schema Change = None / Migration = None / API Change = None**；拆分 7 项开发任务（P0-P2）。
- **M19 架构冻结结论**：保持 `Product Global Catalog + Offer Supplier Display`；禁止 `Product.organizationId`、`ProductFamily/Model/SupplierOffering`；**零 Schema 变更**；前端应消费后端已有能力（`GET /products` 参数筛选、`GET /products/:id` offers）。

## M19.1.1 Product Search Capability Frontend Integration（462，M19.1 Development 第一阶段）

- **M19.1.1 Started & Completed（462）**：基于 460 实施规划与 461 文档同步冻结结论，完成 Product Center V2 第一阶段能力接入——将后端已有产品搜索能力（`parameterFilters` 动态参数筛选）接入 Web 前端，`apps/web` build 通过（exit 0）。
- **API Client（透传 parameterFilters）** ✅：`apps/web/src/lib/api/products.ts` 新增 `buildProductsQuery()`，将 `parameterFilters` 序列化为后端 qs 括号记法（`parameterFilters[0][parameterDefinitionId]` / `[value]` / `[valueMin]` / `[valueMax]`），经 endpoint 透传 `GET /products`；**API Contract 未改**（复用后端已有参数筛选能力）。
- **Type Definition（扩展）** ✅：`apps/web/src/types/product.ts` 新增 `ParameterOption`、`ProductParameterFilter` 类型，`ProductSearchParams.parameterFilters` 复用 `ProductParameterFilter[]`，`ParameterDefinition` 增加可选 `options`（ENUM 选项）。
- **动态参数数据源** ✅：新增 API Wrapper `apps/web/src/lib/api/parameter-definitions.ts`（`getParameterDefinitions` / `getParameterDefinition`，均 public）+ Service `apps/web/src/services/parameter-definition.service.ts`（`getFilterParameterDefinitions` 前端合并 ENUM options，遵循 `Page → Service → API Wrapper → Backend API`）。
- **New Component（ParameterFilterPanel）** ✅：新增 `apps/web/src/components/products/ParameterFilterPanel.tsx`，由 `ParameterDefinition` 驱动，支持 NUMBER（范围 valueMin/valueMax，非法区间不提交）、ENUM（options 下拉）、STRING（文本精确）、BOOLEAN（是/否）；内联「清除」重置全部筛选；无硬编码业务参数（管径/像素/长度等）。
- **Product Filter / Page State 接入** ✅：`ProductFilter.tsx` 集成动态参数筛选区块；`app/products/page.tsx` 增加 `parameterFilters` state、`handleParameterFilterChange`（变更后重置 page=1）、Defined 数据 query、`parameterFilters` 纳入 react-query queryKey 与 `getProducts` 调用，实现「UI State → 筛选数组 → GET /products → 列表更新」可预测链路。
- **回归验证** ✅：原有关键词搜索、分类筛选、排序、分页均保持正常；`/products` 路由正常生成（5.46 kB）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Product Detail（`products/[slug]`）、Supplier Display、Admin。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Design System / AI Search / Vector Search / ProductFamily / Supplier Product Ownership。
- **Build** ✅：`apps/web` `next build` exit 0（首次告警为既有机身 SWC Native DLL 环境警告 + 过时 `.next` 缓存，清理 `.next` 后全阶段成功；类型校验通过，仅既有非阻断 lint 警告）。

## M19.1.4 Product Center V2 Experience Stabilization（465，M19.1 Development 收尾）

- **M19.1.4 Started & Completed（465）**：基于 459-464 冻结结论，完成 Product Center V2 全链路体验稳定化——产品列表空状态/结果统计/筛选指示、详情页 section 结构一致性/空数据状态、询价错误状态重试，`apps/web` build 通过（exit 0）。
- **产品列表体验优化** ✅：新增结果计数（"共 N 个产品"）；空状态区分「无筛选结果」（搜索图标 + 调整筛选建议）与「无产品」（包裹图标 + 建设中文案）；`ParameterFilterPanel` 清除按钮显示激活筛选数（"清除 (N)"）。
- **产品详情页结构一致性** ✅：添加 `id` 锚点（`#media`/`#overview`/`#specifications`/`#documents`）；技术参数无数据时显示 `EmptyState` 空状态；文档与证书无数据时同样显示空状态。
- **询价错误状态完善** ✅：`InquiryForm` 错误状态新增「重新填写」按钮，提交失败后可直接恢复表单。
- **通用组件增强** ✅：`EmptyState` 组件升级为支持图标（search/package/document/default）+ 描述文案，提升全站空状态一致性。
- **回归验证** ✅：产品列表分类筛选、参数筛选、排序、分页均正常；产品详情 Overview / Media / Specs / Supplier / Inquiry / Documents 全链路正常；`/products` 路由 6.17 kB，`/products/[slug]` 路由 4.38 kB。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；`ProductCard` 仅消费 `Product` 类型可用字段；未触碰 Admin / Backend / Database。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## M19.2.0 Supplier Display Capability Architecture Audit（466，M19.2 开发前架构审计）

- **M19.2.0 Audit Started & Completed（466）**：基于 457-465 历史报告冻结结论，对 M19.2 Supplier Display Capability Enhancement 进行开发前架构审计，审计通过，M19.2 进入开发阶段。**Code Change = None / Schema Change = None**。
- **Repository Verification** ✅：`F:\Desktop\VISNDT`（main branch），工作区未提交修改为既有 M18.5 文件，不影响历史任务。
- **M19.1 Completion Verification** ✅：462-465 全部完成，产品列表/详情/供应商/询价全链路体验稳定化。
- **Database Capability Assessment** ✅：Product → Offer → Organization 关系链完整；Organization 当前 name/type/status 可支撑基础 Supplier Display；**Zero Schema Change 可行**。
- **API Capability Assessment** ✅：`GET /products/:id`（含 offers + organization）、`GET /organizations/:id`（public）、`GET /offers`（public）可复用；M19.2 可基于现有 API 完成，无需新增端点。
- **Frontend Capability Assessment** ✅：`SupplierCapabilityList` / `SupplierInquirySection` / `ManufacturerInfo` 基础组件已完成（M19.1.2-3），可作为 M19.2 增量增强基础；未来入口：Public Supplier Page（P0）/ Product Detail Enhancement（P1）/ Workspace Supplier Center（P2）。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；禁止 Product.organizationId / SupplierStore / Marketplace / Transaction；Supplier = Capability Provider。
- **M19.2 Development Boundary** ✅：P0 — Public Supplier Capability Page（`/suppliers/[id]`）；P1 — Product Detail Supplier Section Enhancement；P2 — Workspace Supplier Display Management。
- **Risk Assessment** ✅：No High Risk；Medium — Organization 字段不足（可通过前端展示优化缓解）、Offer 数据质量依赖；Low — 架构冻结突破、功能蔓延。
- **SEO / Content Relationship** ✅：Supplier Display 不直接依赖 Content Center；Supplier 页面 SEO 可复用 M16.3 模式；Content Center 与 Supplier 关联为 M19.3+ 规划。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.1 Supplier Capability Page Development（467，M19.2 Development 第一阶段）

- **M19.2.1 Started & Completed（467）**：基于 466 审计结论，完成 Public Supplier Capability Page 开发——新增 `/suppliers/[id]` 路由、`SupplierPublicProfile` 组件、`SupplierOfferList` 组件、API 与服务层封装，`apps/web` build 通过（exit 0）。
- **Supplier Public Page** ✅：新增 `app/suppliers/[id]/page.tsx`（动态路由，server-rendered），包含 Breadcrumb 导航、SupplierPublicProfile 区块、SupplierOfferList 区块；支持 `generateMetadata` 动态 SEO。
- **SupplierPublicProfile** ✅：新增 `components/supplier/SupplierPublicProfile.tsx`，展示 organization.name（首字母头像）、organization.type（中文标签）、organization.status（状态徽章）；使用 API 真实字段，不虚构不存在字段。
- **SupplierOfferList** ✅：新增 `components/supplier/SupplierOfferList.tsx`，展示供应商 Offer 列表（title/description/status），支持点击跳转对应产品详情页；空状态显示 EmptyState（"暂无供应产品"）。
- **API Wrapper** ✅：新增 `lib/api/offers.ts`（`getOffers`，支持 `organizationId` 过滤），遵循现有 `apiClient` 模式。
- **Service Layer** ✅：新增 `services/organization.service.ts`、`services/offer.service.ts`，遵循 `Page → Service → API Wrapper → Backend API` 分层。
- **Backend Adaptation** ✅：`SearchParamsDto` 新增 `organizationId` 可选参数（`IsOptional`/`@IsString`）；`OffersService.findAll` 新增 `organizationId` where 过滤；`OrganizationsService.findOnePublic` 新增 `status`/`createdAt`/`updatedAt` 返回字段。**Schema Change = None / Migration = None**。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；未引入 `Product.organizationId` / SupplierStore / Marketplace / Transaction；未展示 Price / Inventory / 交易状态。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None**；未改 `database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；`/suppliers/[id]` 路由 164 B（ƒ dynamic）；仅既有非阻断 lint 警告。

## M19.2.2 Product Detail Supplier Section Enhancement（468，M19.2 Development 第二阶段）

- **M19.2.2 Started & Completed（468）**：基于 466-467 冻结结论，增强 Product Detail 页面供应商展示能力——ManufacturerInfo 和 SupplierCapabilityList 新增供应商主页链接，建立 Product Detail → Supplier Public Profile 公开浏览链路。**Code Change = Minimal（Frontend only）**。
- **ManufacturerInfo Enhancement** ✅：新增「查看供应商详情 →」链接（`/suppliers/[organizationId]`），位于制造商信息卡片底部，分隔线区隔，点击跳转至 Supplier Public Profile 页。
- **SupplierCapabilityList Enhancement** ✅：每个供应商卡片底部新增「供应商主页」链接（`/suppliers/[organizationId]`），使用 `e.stopPropagation()` 防止触发展开选择，点击跳转至 Supplier Public Profile 页。
- **Supplier Information Source** ✅：所有 Supplier Display 数据保持 `Offer.organization` 为唯一来源，未使用 `Product.createdBy.organization`。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；Product → Offer → Organization → Supplier Public Profile；未引入 `Product.organizationId` / SupplierStore / Marketplace / Transaction。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；`/products/[slug]` 路由 4.51 kB；仅既有非阻断 lint 警告。

## M19.2.3 Pre-Audit Workspace Supplier Display Management Architecture Audit（469，M19.2 开发前架构审计）

- **M19.2.3 Pre-Audit Started & Completed（469）**：基于 466-468 完成状态，对 M19.2.3 Workspace Supplier Display Management 进行开发前架构审计，审计通过。**Code Change = None**。
- **Workspace Capability Audit** ✅：Workspace API 为 RFQ/Response 协作导向（`GET /workspace/supplier/overview` / `rfqs` / `responses`），无 Offer 管理、无 Profile 管理 API；`PATCH /organizations/:id` 仅 ADMIN，Supplier 不可自助更新 Profile；`PATCH /offers/:id` 已支持 org-scoped 更新。
- **Database Capability Audit** ✅：Organization（name/type/status）+ Offer（title/description/status）+ OrganizationMember（role）可支撑基础 Display Management；**Zero Schema Change 可行**。
- **API Capability Audit** ✅：可复用 `GET /organizations/:id`（读取 Profile）+ `GET /offers?organizationId=`（读取自有 Offer）+ `PATCH /offers/:id`（更新 Offer 状态）；无需新增 API 端点。
- **Frontend Capability Audit** ✅：`/dashboard/supplier` Domain Navigation 可扩展「展示管理」入口；`SupplierPublicProfile` / `SupplierOfferList` 组件可复用；`WorkspaceSidebar` / `WorkspaceHeader` 布局可复用。
- **M19.2.3 Development Boundary** ✅：M19.2.3a — Supplier Display Management（Read-Only View）——Profile Preview（只读）+ Offer Management（状态管理）；禁止 Profile 编辑（需 ADMIN）、禁止 Schema 变更、禁止 Supplier Store/Marketplace。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；M19.2.3 可保持 Zero Schema Change + Zero API Change。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.3 Information Architecture Audit（470，M19.2.3 信息架构冻结）

- **M19.2.3 Information Architecture Audit Started & Completed（470）**：基于 466-469 完成状态，完成 Supplier Display Management 信息架构冻结——设计 7 模块页面结构（Display Overview / Company Identity / Capability Overview / Product Capability / Offer Management / Public Preview / Display Completeness），输出现有字段能力矩阵（50+ 字段评估），冻结 M19.2.3 开发边界。**Code Change = None**。
- **Information Architecture Design** ✅：页面结构 7 模块（概览 / 企业身份 / 能力概览 / 产品能力 / 供应管理 / 公开预览 / 展示完整度）；路由 `/workspace/supplier/display`；Dashboard Domain Navigation 新增「展示管理」入口。
- **Supplier Display Data Matrix** ✅：输出 7 模块 × 50+ 字段评估矩阵——Each=Existing 字段可直接支持（Organization 6/Offer 10/Product 3/ProductCategory 2/OrganizationMember 3/Inquiry 3）；Missing（logo/description/website/location）标记为 M19.3+ Future Enhancement。
- **Capability Classification** ✅：Existing Capability（35+ fields 可直接支持）→ Frontend Derived（Display Completeness / Product Coverage / Category Coverage 无需 Schema）→ Future Enhancement（6 fields 需独立 Schema/API 审计，M19.3+）。
- **Semantic Freeze** ✅：所有展示语义使用「Products Supplier Can Provide」，禁止「Supplier Products / Store Products」；Supplier = Capability Provider。
- **Architecture Decision** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Zero Schema Change 可行；Zero API Change 可行；5 个现有 API 可复用。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.2.3 Workspace Supplier Display Management Development（471，M19.2.3a Development）

- **M19.2.3 Development Started & Completed（471）**：基于 466-470 完成状态，完成 Supplier Display Management 工作台开发——Dashboard Domain Navigation 新增「展示管理」入口，`/workspace/supplier/display` 页面实现 5 模块（Display Overview / Company Identity / Product Capability / Offer Management / Public Preview）。**Code Change = Frontend only**。
- **Dashboard Navigation** ✅：`/dashboard/supplier` Domain Navigation 新增「展示管理」入口（图标 📋，跳转 `/workspace/supplier/display`）。
- **Module 1 — Display Overview** ✅：统计卡片（活跃 Offer / 产品覆盖 / RFQ / 展示完整度），前端计算 Display Completeness（5 项检查）。
- **Module 2 — Company Identity** ✅：只读展示 Organization 信息（name/type/status/createdAt/updatedAt），含公开页面链接。
- **Module 3 — Product Capability** ✅："Products Supplier Can Provide" 列表（Offer → Product → ProductCategory），语义合规。
- **Module 4 — Offer Management** ✅：Offer 表格（标题/描述/状态/关联产品/时间），只读展示。
- **Module 5 — Public Preview** ✅：复用 SupplierPublicProfile + SupplierOfferList，预览公开页面效果。
- **Component Reuse** ✅：复用 SupplierPublicProfile / SupplierOfferList / WorkspaceSidebar / WorkspaceHeader / StatCard / EmptyState / ErrorState / Loading；无重复组件。
- **Architecture Freeze** ✅：继续 `Product Global Catalog + Offer Supplier Display`；Supplier = Capability Provider；未引入 Supplier Store / Marketplace / Transaction。
- **Zero Impact** ✅：**Schema Change = None / Migration = None / New API = None**；仅前端新增 1 文件 + 修改 1 文件。
- **Build** ✅：`apps/web` `npx next build` exit 0（编译 + 类型校验通过，33/33 静态页，`/workspace/supplier/display` 5.41 kB）；仅既存非阻断 lint 警告（no-page-custom-font / no-img-element / no-unused-vars）。

## M19.2.4 Supplier Display Capability Closure Audit（472，M19.2 闭环审计）

- **M19.2.4 Closure Audit Started & Completed（472）**：对 M19.2 阶段进行最终闭环审计——验证 466-471 全部完成、Architecture Freeze 保持、Data Flow 链路完整、Frontend 8 项能力全部就绪、Component/API/Permission 边界清晰、Schema/Migration 均 None。**M19.2 CLOSED**。**Code Change = None**。
- **Architecture Freeze** ✅：Product Global Catalog（Product 无 organizationId/supplierId）+ Offer Supplier Display（Offer.organizationId + Offer.productId）+ Supplier = Capability Provider。
- **Data Flow** ✅：Product → Offer → Organization → Supplier Public Profile → Workspace Display Management 完整链路。
- **Frontend Capability Matrix** ✅：8 项能力全部就绪——Product Detail Supplier Display / Product→Supplier Navigation / Public Profile / Dashboard Nav / Display Overview / Company Identity / Product Capability / Offer Management / Public Preview。
- **Component Boundary** ✅：三层边界清晰（components/products / components/supplier / components/workspace），无组件逻辑复制。
- **API Boundary** ✅：5 个现有 API 可复用，100% 无新增端点。
- **Permission Boundary** ✅：Supplier 可查看自身展示 + 管理 Offer；禁止修改 Organization Profile（ADMIN only）；Public 可查看公开页面。
- **M19.2 Closure Decision** ✅：**READY FOR CLOSE**——全部 6 任务完成、架构冻结保持、Zero Schema Change、Zero New API、Supplier 定位正确、无 Supplier Store/Marketplace。
- **Future Enhancement** ✅：M19.3+ 候选（Organization Profile 编辑/Logo/Description/Website/Display Ranking/AI）标记为记录，不进入开发。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.3.0 Search Experience Enhancement Architecture Audit（473，M19.3 开发前架构审计）

- **M19.3.0 Audit Started & Completed（473）**：基于 M19.2 CLOSED 状态，对 M19.3 Search Experience Enhancement 进行开发前架构审计——明确 VISNDT 搜索体系定位为「Industrial Inspection Capability Discovery（工业检测能力发现）」，冻结搜索信息架构，划定四类搜索边界，评估现有能力，确认零 Schema/API 变更。**Code Change = None**。
- **Search Positioning** ✅：VISNDT Search = Industrial Inspection Capability Discovery（工业检测能力发现），不等于普通电商搜索；禁止定位为商品商城搜索 / 店铺搜索 / 卖家搜索。
- **Search Domain Boundary** ✅：四类搜索边界明确——Product Search（检测设备寻找，数据源 Product/ProductCategory/ProductParameter）、Supplier Capability Search（供应能力寻找，数据源 Offer/Organization/Supplier Public Profile，Supplier = Capability Provider）、Knowledge Search（内容资产搜索，数据源 Content，未来规划，当前不开发）、Matching Search（需求匹配，保持 RFQ Matching Domain，禁止合并为普通 Search）。
- **Search Information Architecture** ✅：四层 IA 冻结——Product Discovery（Keyword Search / Category Filter / Parameter Filter / Product Detail）→ Supplier Capability Discovery（Supplier Identity / Capability / Offer Coverage / Public Profile）→ Knowledge Discovery（Articles / Solutions / Technical Knowledge，未来规划）→ Matching Discovery（Demand / RFQ / Match Result，独立域）。
- **Existing Capability Assessment** ✅：
  - Product Search：后端 `GET /products` 支持 keyword（name/model/description）+ categoryId + parameterFilters（AND 逻辑，精确匹配/数值范围）+ sortBy/sortOrder + pagination；前端 `/products` 已集成 SearchBar + ProductFilter（分类+动态参数筛选 NUMBER/ENUM/STRING/BOOLEAN）+ ProductGrid（结果计数+空状态）+ Pagination；**Capability = Existing，M19.3 仅需 UX 增强**。
  - Supplier Capability Search：后端 `GET /organizations/:id`（public）+ `GET /offers?organizationId=`（keyword 搜索 title/description）；前端 `/suppliers/[id]`（SupplierPublicProfile + SupplierOfferList）；**Capability = Partial**——无 Supplier 列表/搜索页，Supplier 发现仅通过 Product Detail → Supplier Public Profile 间接链路；M19.3 可新增 Supplier Discovery Entry。
  - Knowledge Search：后端 `GET /content/public`（仅 PUBLISHED，type 筛选+分页）；前端 `/knowledge`、`/solutions` 列表页（无搜索 UI）；**Capability = Missing**——M19.3 仅规划边界，不开发。
  - Matching Search：后端 Demand/Match API 已存在；前端 Buyer Workspace 内；**Capability = Existing**——保持 RFQ Matching Domain，不纳入通用搜索。
- **Search Engine Decision** ✅：**Database Query First**——当前数据规模不需 Elasticsearch/Algolia/Meilisearch；`GET /products` 已支持 keyword + category + parameterFilters + sort + pagination，满足当前搜索需求；引入搜索引擎为 M20+ 规划。
- **M19.3 Development Boundary** ✅：
  - **Included**：Product Search UX Enhancement（搜索框/建议/高亮/无结果引导）、Filter Experience Enhancement（筛选状态持久化/URL 同步/筛选面包屑/清除全部）、Search Result UX（结果计数/排序优化/Loading Skeleton/空状态区分）、Supplier Discovery Entry（产品搜索页 Supplier 入口/`/suppliers` 列表页）。
  - **Excluded**：Knowledge CMS / AI Search / Semantic Search / Vector Database / Intelligent Recommendation / Elasticsearch / 第三方搜索服务。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**；M19.3 完全基于现有 API 能力，前端消费后端已有能力（Backend Capability First）。
- **Architecture Decision** ✅：**M19.3 Search Experience Enhancement Architecture Ready**——搜索边界冻结、四层 IA 明确、现有能力可支撑、零 Schema/API 变更、Database Query First、Development Allowed。
- **Freeze 兼容** ✅：**Code Change = None / Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/web`、`apps/admin`。
- **Build** ✅：Not Required（本任务仅审计，无代码变更）。

## M19.3.1 Search Experience Development（474，M19.3 第一阶段搜索体验增强）

- **M19.3.1 Development Started & Completed（474）**：基于 473 已冻结的搜索架构，完成 VISNDT 工业检测能力发现（Industrial Inspection Capability Discovery）的第一阶段搜索体验增强。**Code Change = Frontend Only**。
- **Search Input Enhancement** ✅：`SearchBar.tsx` 新增清除 (X) 按钮 + `initialValue` prop（URL 恢复）+ `onClear` 回调 + 输入框 focus 自动恢复；用户明确知道当前搜索关键词。
- **Search State Management (URL Sync)** ✅：`products/page.tsx` 全面改写——使用 `useSearchParams` + `useRouter` 实现 URL Query State Sync（keyword/categoryId/sortBy/sortOrder/page/pf），支持浏览器前进/后退、页面刷新状态保持、可分享搜索 URL；`router.replace` 避免浏览器历史膨胀。
- **Active Filter Chips** ✅：搜索结果区域上方新增 Active Filter Chips（关键词/分类/参数筛选），每个 Chip 可单独清除，底部「清除全部」一键重置；侧边栏 `ProductFilter` 新增 `hasActiveFilters` + `onClearAll` 双入口清除。
- **Keyword Highlight** ✅：新增 `HighlightText.tsx` 组件——前端仅关键字高亮（case-insensitive），`<mark>` 标签 amber 背景色；`ProductCard` 集成 name/model/description 三字段高亮。**零后端修改**。
- **Supplier Discovery Entry** ✅：`ProductCard` 底部新增「查看供应商能力」入口（图标 + 文字），为 M19.3.2+ Supplier Discovery 建立预留位置；hover 时颜色联动 Product Card 交互。
- **Search Result Experience** ✅：`ProductGrid` 已有 result count + loading skeleton + empty state（区分筛选/无数据），本次增强 `searchKeyword` prop 透传至 ProductCard 以支持关键词高亮。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**；完全基于现有 `GET /products` API 能力，纯前端消费后端已有能力（Backend Capability First）。
- **Architecture Freeze 兼容** ✅：**Product Global Catalog + Offer Supplier Display 保持**；未修改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Elasticsearch/Algolia/第三方搜索服务；未新增 Search API；未修改 SearchProductDto；未修改 Prisma Schema。
- **Build** ✅：`apps/web` `npx next build` exit 0，type check 通过，33 static pages 生成，`/products` 7.68 kB；pre-existing ESLint warnings only（layout fonts, img element, unused var）。

## M19.3.2 Search Experience Enhancement Development（475，Search Result UX） + M19.3.2.1 Boundary Correction（476）

- **M19.3.2 Development Started & Completed（475）**：基于 473-474 已冻结的搜索架构与 Product Search UX 增强，完成 VISNDT 工业检测能力发现（Industrial Inspection Capability Discovery）的搜索体验增强——Search Result UX 增强。**Code Change = Frontend Only**。
- **Search Result UX Enhancement** ✅：
  - **Loading Skeleton** ✅：`ProductGrid.tsx` 新增 `isLoading` 状态——加载中显示头部骨架屏（`animate-pulse`）+ 6 个产品卡片骨架屏。
  - **Empty State Enhancement** ✅：`ProductGrid.tsx` 空状态根据场景动态展示——有筛选条件时区分"未找到匹配产品"（带关键词上下文）vs "暂无产品"（无筛选时"产品目录正在建设中"）。
  - **Result Count Context** ✅：`ProductGrid.tsx` 结果计数增加搜索上下文展示。
  - **Pagination Navigation** ✅：`Pagination.tsx` 新增页码指示器（`currentPage / totalPages`）。
- **Supplier Discovery Entry** ✅：`ProductCard.tsx` 底部「查看供应商能力」Link（`/products/${product.id}#suppliers`），保持 Product-driven Capability Discovery。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Architecture Freeze 兼容** ✅：**Product Global Catalog + Offer Supplier Display 保持**。

- **M19.3.2.1 Boundary Correction（476）**：475 中新增的 `/suppliers` 公开供应商列表页违反了 Supplier = Capability Provider 架构原则，形成了 Public Supplier Directory。**Code Change = Frontend Only**。
- **Boundary Correction Actions** ✅：
  - **Deleted** ✅：`apps/web/src/app/suppliers/page.tsx`——公开供应商列表页（`/suppliers`）已删除，消除 Public Supplier Directory 入口。
  - **Removed Entry** ✅：`apps/web/src/app/products/page.tsx` 头部「浏览供应商能力」Link（→ `/suppliers`）已删除。
  - **Kept Product-driven** ✅：`ProductCard.tsx`「查看供应商能力」→ `/products/${product.id}#suppliers`（Product Context 驱动），保持。
  - **Kept Supplier Profile** ✅：`/suppliers/[id]` 保持为 Supplier Public Capability Profile（非 Directory）。
- **Correct Discovery Flow** ✅：`Product Search → Product Detail → Supplier Capability Section → Supplier Public Profile`（Find Product → Discover Capability Provider）。
- **Forbidden Flow Removed** ✅：`/suppliers` (Supplier Directory → Browse Suppliers → Choose Supplier) 已删除。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Build** ✅：`apps/web` `npx next build` exit 0，type check 通过，`/suppliers` 静态页已移除；pre-existing ESLint warnings only。

## M19.3.3 Search Experience Enhancement Closure Audit（477，M19.3 Final Closure）

- **M19.3.3 Closure Audit Started & Completed（477）**：基于 473-476 基线，执行 M19.3 Search Experience Enhancement 最终闭环审计。**Code Change = None（Audit Only）**。
- **Architecture Closure Verification** ✅：
  - **Industrial Capability Discovery** ✅：搜索定位保持，非 E-Commerce Search。
  - **Product Search** ✅：Keyword + Category + Parameter Filter + Sort + Pagination，基于 `GET /products`。
  - **Supplier Capability Discovery** ✅：Product → Offer → Organization → Supplier Capability Profile（`/suppliers/[id]`），Product-driven。
  - **No Supplier Directory** ✅：`/suppliers` 已删除，仅保留 `/suppliers/[id]` Capability Profile。
  - **No Marketplace** ✅：无 Supplier Store / Ranking / Seller。
  - **No Search Engine** ✅：Database Query First，未引入 Elasticsearch / Algolia / Meilisearch。
  - **No AI Search** ✅：未引入 Vector / Semantic / AI Search。
  - **Knowledge Search** ✅：Content Search 未进入 M19.3，保持独立域。
  - **Matching Search** ✅：Demand → DemandMatch → RFQ 保持独立域，未合并为 General Search。
- **476 Correction Verified** ✅：`/suppliers` 公开供应商列表页已删除；`/products` 头部供应商入口已移除；ProductCard 保持 `/products/${id}#suppliers`（Product-driven）。
- **Route Verification** ✅：允许的路由 `/products`、`/products/[slug]`、`/suppliers/[id]`、`/knowledge`、`/solutions`；`/suppliers` 不存在。
- **Component Boundary** ✅：`components/products`（Product）、`components/supplier`（Supplier Profile）、`components/workspace`（Workspace）无职责混乱，无 Supplier Directory / Marketplace UI。
- **API/Schema Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（473-476 全部确认）。
- **Documentation Synchronized** ✅：PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md / BUSINESS_CAPABILITY_MAP.md 全部同步。
- **Decision** ✅：**M19.3 Search Experience Enhancement — CLOSED**。Architecture FROZEN。Code State = Documentation State。Next Stage: M19.4 Admin Product Operation Center。

## M19.4.0 Admin Product Operation Center Architecture Audit（478，M19.4 Architecture Audit）

- **M19.4.0 Architecture Audit Started & Completed（478）**：基于 M19.3 CLOSED 状态，对 VISNDT Admin Product Operation Center 进行开发前全面架构审计。**Code Change = None（Audit Only）**。
- **Admin Positioning** ✅：**Admin = Platform Governance Center**（数据治理 + 内容治理 + 产品治理 + 供应商治理 + 运营审计），非 Supplier Store Management / Transaction Management。
- **Admin Frontend Capability Audit** ✅：Admin 前端已有 18 类管理能力——Dashboard（stats/activities/pending/status）、Product CRUD + Media、Category CRUD、ParameterGroup CRUD、ParameterDefinition CRUD、User CRUD、Organization CRUD、Demand List/Detail/Edit、Matching Monitor + Match Detail、RFQ CRUD、RFQ Response Detail、Offer List/Detail、Inquiry List/Detail、Notification List/Detail、FileAsset Orphan Cleanup、AuditLog List、Content CRUD（含 Markdown 编辑 + Media + Revision History + Scheduled Publish + SEO + Approval Timeline）。
- **Database Governance Audit** ✅：Prisma Schema 完整审计——28 个模型全覆盖（Product Domain 8 个、Supplier Capability Domain 3 个、Demand/Matching Domain 5 个、Content Domain 3 个、Governance Domain 4 个、Identity Domain 4 个、Inquiry 1 个）。
- **Entity Ownership** ✅：Product = Platform Global Catalog（无 supplierId/organizationId）；ProductCategory/ParameterDefinition = Platform；Offer = Supplier Capability（organizationId → Organization）；Content = Platform；Organizations = Supplier Identity。
- **Relation Boundary** ✅：Product → Offer → Organization 间接关联保持；Product 无直接 Organization 绑定；Demand → DemandMatch → RFQ 独立匹配域。
- **Lifecycle State** ✅：Offer（OfferStatus enum: DRAFT/ACTIVE/INACTIVE/SUBMITTED/ACCEPTED/REJECTED/WITHDRAWN）；Content（ContentStatus enum: DRAFT/REVIEW/PUBLISHED/ARCHIVED）；Demand（DemandStatus enum）；RFQ（RFQStatus enum）。Product.status 当前为 String 字段（"DRAFT"），非正式 ProductStatus enum——**Future Candidate**。
- **Audit/Workflow Capability** ✅：AuditLog（entityType + action + oldValue/newValue JSONB + operatorId + ipAddress）；WorkflowEvent（entityType + action + operatorId + metadata JSONB）；FileAsset（entityType + fileType + storageKey + uploadedBy）。
- **API Capability Audit** ✅：后端 API 全覆盖——Products（CRUD + batch）、Offers（CRUD + lifecycle submit/accept/reject/withdraw）、Organizations（CRUD + batch）、Content（CRUD + lifecycle submit/review/publish/archive + public + approval-timeline）、Admin Dashboard（stats/activities/pending/status）、Admin Inquiry（CRUD + batch）、Admin Demand（PATCH）、Admin Matching（stats）、Admin AuditLog（list/detail）、ProductCategories/ParameterGroups/ParameterDefinitions（CRUD）、FileAsset（upload + orphan cleanup）、Users（CRUD）、Notifications（CRUD）、Workspace（aggregated APIs）。
- **Permission Boundary** ✅：Admin API 使用 `@Roles(Role.ADMIN)` + `RolesGuard`，Admin 仅允许 Platform Governance，禁止 Supplier Identity Modification / Supplier Operation Impersonation。
- **Schema Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None**（M19.4 可基于现有数据模型开发）。
- **M19.4 Development Boundary** ✅：Allowed——Admin Product Management Enhancement、Category Governance、Parameter Governance、Content Governance、Operation Audit Enhancement；Not Included——Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU。
- **Decision** ✅：**M19.4 Admin Product Operation Center — Architecture Audit PASS**。现有 Admin 基础设施完备（18 类管理能力 + 28 个 Prisma 模型 + 全 CRUD API + RBAC + AuditLog + WorkflowEvent），M19.4 可基于现有数据模型开发，无需 Schema/API 变更。Next Step: M19.4.1 Pre-Development Design Audit。

## M19.4.1 Admin Product Operation Center Pre-Development Design Audit（479，M19.4 Design Freeze）

- **M19.4.1 Pre-Development Design Audit Started & Completed（479）**：基于 478 架构审计，执行开发前设计审查。**Code Change = None（Audit Only）**。
- **Design Freeze** ✅：
  - **Admin Positioning** ✅：Admin = Platform Governance Center（数据治理 + 产品治理 + 内容治理 + 供应商能力审查 + 运营审计），非 Supplier Store / Marketplace / ERP / Transaction。
  - **Product Governance Boundary** ✅：Allowed——Catalog Governance（Product CRUD）、Parameter Governance（ParameterGroup/Definition/Option）、Media Governance（ProductMedia/FileAsset）、Lifecycle Planning（Product.status 评估）；Forbidden——Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU。
  - **Product Ownership** ✅：Product = Global Platform Catalog（无 organizationId / supplierId / ownerId），Product → Offer → Organization 间接关联。
  - **Supplier Boundary** ✅：Supplier = Capability Provider，Admin 仅允许 Review Supplier Capability（查看 Offer/Organization），禁止 Supplier Store / Product Ownership / Inventory / Pricing。
  - **Lifecycle Governance** ✅：Product.status 当前为 `String @default("DRAFT")`（非正式 ProductStatus enum），WorkflowEntityType 无 PRODUCT 条目。**Future Candidate**：M19.4.x Product Lifecycle Governance Audit（不在此阶段修改 Schema）。
  - **Audit Governance** ✅：AuditLog（entityType + action + oldValue/newValue JSONB + operatorId + ipAddress）统一治理。无 ProductHistory / SupplierHistory / CustomOperationLog 等冗余模型。
  - **File Governance** ✅：FileAsset 统一文件管理。无 ProductImage / SupplierLogoAsset / StoreMedia 等重复模型。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（Design Freeze 阶段，不修改任何数据模型或 API）。
- **M19.4 Development Boundary Freeze** ✅：
  - **Allowed**：Admin Product Management Enhancement（Product CRUD + Media CRUD + Category CRUD + Parameter CRUD）、Category Governance、Parameter Governance、Content Governance（已有完备 CRUD）、Operation Audit Enhancement。
  - **Excluded**：Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU / Price Management。
- **Decision** ✅：**M19.4.1 Design Freeze — PASS**。Admin Product Operation Center 开发边界明确，现有基础设施满足开发需求，零 Schema/API 变更。Next Step: M19.4.2 Admin Product Operation Center Development。

## M19.4.2 Admin Product Operation Center Development（480，M19.4 Development）

- **M19.4.2 Development Started & Completed（480）**：基于 478 架构审计与 479 设计冻结结论，完成 Admin Product Operation Center 前端治理能力增强。**Code Change = Frontend Only（apps/admin）**。
- **Product Governance Enhancement** ✅：`ProductList.tsx` 新增治理统计卡片（产品总数/已上架/草稿/已下架/分类数）+ 分类筛选下拉框 + 面包屑导航；`ProductDetail.tsx` 新增面包屑导航 + 媒体资源/参数/供应能力统计卡片。
- **Category Governance Enhancement** ✅：`ProductCategoryList.tsx` 新增分类治理统计卡片（分类总数/树深度/叶子分类），树形统计基于客户端递归计算，不依赖后端新增接口。
- **Parameter Governance Enhancement** ✅：`ParameterGroupList.tsx` 新增参数治理统计卡片（参数组数量/参数定义数量），通过已有 API 获取总数。
- **Media Governance Enhancement** ✅：`ProductMediaList.tsx` 新增媒体治理统计卡片（媒体总数/图片/文档/证书数量），按 mediaType 分组统计。
- **Architecture Constraint** ✅：`Product = Global Catalog`，无 `Product.organizationId` / `Product.supplierId`；`Supplier = Capability Provider`，无 Supplier Store / Marketplace；`Admin = Platform Governance Center`，无 Seller Backend / ERP。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（纯前端体验增强，复用已有 API）。
- **Build** ✅：`apps/admin` `npm run build` exit 0（tsc + vite build 通过）。
- **Decision** ✅：**M19.4.2 Admin Product Operation Center Development — COMPLETED**。Admin Product Governance 治理能力增强完成，Product/Category/Parameter/Media 四类治理统计可视化落地。Code State = Documentation State。Next Step: 等待架构审核后进入下一阶段。

## M19.4.3 Product Model and Capability Architecture Audit（481，M19.4 Architecture Audit）

- **M19.4.3 Architecture Audit Started & Completed（481）**：基于 478-480 和 M19.3 CLOSED 状态，执行 VISNDT 产品能力模型长期架构审核。**Code Change = None（Audit Only）**。
- **Product Ownership Boundary** ✅：Product 模型无 `organizationId` / `supplierId` / `ownerId`；`Product = Global Platform Catalog` 确认；`Product → Offer → Organization` 间接关联链完整。
- **Industrial Product Scenario Validation** ✅：6mm 工业视频内窥镜多供应商/多型号场景验证通过——每个型号 = 独立 Product，每个供应商 = 一个 Offer；`@@unique([organizationId, productId])` 防止重复报价；Product 名称去重由 Admin 治理保证。
- **Parameter System Assessment** ✅：4 种数据类型（STRING/NUMBER/BOOLEAN/ENUM）覆盖全部工业参数；`value` + `valueNumber` 双字段支持展示+范围搜索；ParameterFilter API 支持 AND 逻辑 + 精确匹配 + 数值范围；复合索引支持高效参数搜索。
- **Search Compatibility** ✅：Product Search（keyword + categoryId + parameterFilters）完全支持；Supplier Capability Search（offers + organizations）完全支持；Database Query First 满足当前规模。
- **Matching Compatibility** ✅：加权参数匹配 + 分类过滤；DemandParameter vs ProductParameterValue 评分；Match → RFQ → Response 工作流完整；AI 评分增强可通过替换 ScoringService 实现。
- **AI Future Compatibility** ✅（B+）：数据结构足够结构化用于知识图谱；文本字段足够用于 Embedding；JSONB 可扩展性支持未来 AI 数据；无 AI 增强的架构障碍。
- **Future Candidates** ✅：ProductStatus enum（替换 String）、WorkflowEntityType.PRODUCT、Product @@unique([name, model])、ParameterTemplate、Vector embedding（M20+）、Knowledge Graph tables（M20+）、Semantic alias model（M20+）。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**。
- **Decision** ✅：**M19.4.3 Product Model and Capability Architecture Audit — PASS**。VISNDT 产品能力模型架构健全、完整、可持续支撑工业检测设备平台长期发展。`Product (Global Catalog) + Parameter (typed, indexed) + Offer (capability mapping) + Organization (supplier identity) + Search (database query) + Matching (weighted scoring)` 架构正确分离关注点，防止架构漂移，为未来 AI 增强提供坚实基础。Next Step: M19.4.4 Closure Audit。

## M19.4.4 Product Capability Governance Closure Audit（482，M19.4 Closure）

- **M19.4.4 Closure Audit Started & Completed（482）**：基于 478-481 审计链，执行 M19.4 阶段最终治理闭环审核。**Code Change = None（Audit Only）**。
- **M19.4 Completion Review** ✅：478 Architecture Audit → 479 Design Freeze → 480 Development → 481 Product Model Audit，全部完成。交付物：Admin Product/Category/Parameter/Media 四类治理统计可视化落地，产品能力模型长期架构审核通过。
- **Final Architecture Decision** ✅：Product = Global Catalog（无 organizationId/supplierId/ownerId）；Supplier = Capability Provider（Product → Offer → Organization）；Offer = Capability Mapping Layer（@@unique 防重复）；Parameter = Industrial Search Foundation（4 types + dual-field + range + AND）；Search = Database Query First（4 boundaries frozen）；Matching = Weighted Scoring（AI enhancement path open）。
- **Future Candidate Registry** ✅：9 items registered and frozen——ProductStatus enum, WorkflowEntityType.PRODUCT, Product @@unique([name, model]), ParameterTemplate, Semantic Alias, Vector embedding, Knowledge Graph, AI Matching, Supplier Product Model。全部不进入当前开发。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（M19.4 全阶段零变更）。
- **Decision** ✅：**M19.4 Product Capability Governance Closure Audit — CLOSED**。M19.4 Admin Product Operation Center 阶段关闭条件全部满足。**M19.4 CLOSED。M19 COMPLETED。**Code State = Documentation State。Next Step: M20 Frontend Platformization。

## M20.0.0 M20 Architecture Planning Pre-Audit（483，M20 Architecture Planning）

- **M20.0.0 Pre-Audit Started & Completed（483）**：基于 M19 全阶段完成状态，执行 M20 Architecture Planning 前置架构审核。**Code Change = None（Audit Only）**。
- **M20 Direction Freeze** ✅：Frontend Platformization (P1) — 提升平台使用体验，不引入新业务模型；Content Asset Planning (P2) — Product-Content 关联、Content Discovery、Scenario Framework（规划阶段）；AI Readiness Planning (P3) — 数据质量评估、标签体系设计、文本资产规范（规划阶段，AI 基础设施推迟至 M21+）。
- **Platform Inventory** ✅：`apps/web` 33 pages（Product Discovery, Search, Supplier Capability, Content, Workspace, Dashboard）；`apps/admin` 50 pages（Product/Category/Parameter/Content/Organization/User/Demand/RFQ/Offer/Inquiry/Notification/Matching/Audit/FileAsset 全 CRUD）；12 API services。
- **Scope Freeze** ✅：Allowed — Frontend Experience, Platformization, Content Integration Planning；Excluded — Marketplace, Supplier Store, Transaction, ERP, AI Infrastructure, Schema Change（without dedicated audit）。
- **Future Candidate Registry** ✅：9 items registered and frozen；M20 only evaluates ParameterTemplate, Semantic Alias, Vector/KG (planning only, no implementation)。
- **Decision** ✅：**M20 Architecture Planning — PASS**。M20 Frontend Platformization 方向冻结，三优先级明确，Scope Control 边界清晰，9 Future Candidates 保持冻结。Next Step: M20.1 Frontend Platformization Development Planning。

## M20.1 Frontend Platformization Development Planning Audit（484，M20.1 Planning Audit）

- **M20.1 Planning Audit Started & Completed（484）**：基于 483 M20 方向冻结，完成 M20.1 Frontend Platformization Development Planning。**Code Change = None（Planning Audit Only）**。
- **Frontend Architecture Assessment** ✅：`apps/web`（Next.js 15 + React 18 + Tailwind + TanStack Query，33 pages + 15 services + 12 API wrappers）— `next build` exit 0；`apps/admin`（React 18 + Vite 6 + Ant Design 5 + Zustand，50 pages + 22 API services）— `tsc -b && vite build` exit 0。数据流架构 `Page → Service → API Wrapper → Backend API` 验证通过。
- **M20.1 Development Scope Freeze** ✅：
  - M20.1.1 Product Discovery Enhancement（5 enhancements：产品对比、视觉层级、参数展示、图片画廊、信息架构）
  - M20.1.2 Search Experience Unification（6 enhancements：统一搜索入口、搜索类型 Tab、筛选 UX、搜索建议、空状态增强、结果高亮）
  - M20.1.3 Workspace Optimization（6 enhancements：任务中心、需求工作流、RFQ 状态、快捷入口、导航优化、通知集成）
  - M20.1.4 Supplier Capability Showcase（5 enhancements：Profile 增强、Offer 覆盖可视化、导航优化、信任信息、身份展示）
  - M20.1.5 Admin Operation Efficiency（6 enhancements：批量操作、治理仪表盘、效率指标、快速筛选、数据导出、列表视图增强）
- **Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None / Backend Change = None**。全部 28 项增强为前端-only，消费现有 API。
- **Architecture Freeze Maintained** ✅：Product Global Catalog / Supplier Capability Boundary / Database Query First Search / Backend Capability First / Admin Platform Governance — 全部保持。
- **Decision** ✅：**M20.1 Planning Audit — COMPLETED**。M20.1.1~M20.1.5 开发边界冻结，28 项前端体验增强规划完成，Development Authorization: READY。Next Step: M20.1.1 Product Discovery Enhancement Architecture Design。

## M20.1.1 Product Discovery Enhancement Architecture Design Audit（485，M20.1.1 Architecture Design）

- **M20.1.1 Architecture Design Audit Started & Completed（485）**：基于 483/484 冻结方向，完成 M20.1.1 Product Discovery Enhancement 架构设计审计。**Code Change = None（Audit Only）**。
- **Current Architecture Audit** ✅：`/products`（URL sync + filters + skeleton + pagination）、`/products/[slug]`（SEO + breadcrumb + gallery + params + supplier + docs）、`ProductCard`（basic info layout）、`ProductGallery`（thumbnail selection）、`ProductParameters`（grouped table）、`/categories`（grid cards）。数据流 `Page → Service → API Wrapper → Backend` 验证通过。
- **M20.1.1 Experience Architecture Design** ✅：
  - **Product List UX**：Enhanced ProductCard（visual hierarchy）、CompareBar（floating bottom bar）、Sort Controls in Main Area、View Mode Toggle（grid/list）
  - **Product Detail UX**：Tabbed IA（Overview/Specifications/Suppliers/Docs）、Anchor Nav（sticky sidebar）、Info Enhancement（status badge, description toggle, last updated）
  - **Product Comparison**：`/products/compare?ids=`（ComparePage + CompareTable）、Parameter Matrix with difference highlighting、Max 4 products、React state only（no Redux/Zustand）
  - **Parameter Visualization**：Type-Specific Renderers（`ParameterValueRenderer` for NUMBER/BOOLEAN/ENUM）、Group Collapse（accordion）
  - **Gallery Architecture**：Lightbox（fullscreen + keyboard）、Touch/Swipe、Image Counter、Keyboard Navigation
- **Development Scope** ✅：12 component tasks in 3 phases — Phase 1 (P0: 5 tasks: Tabs, Nav, Info, CompareBar, ComparePage)、Phase 2 (P1: 5 tasks: Type Renderer, Collapse, Lightbox, Gallery, Card)、Phase 3 (P2: 2 tasks: Sort Controls, View Mode)。
- **Impact Assessment** ✅：**Schema Change = None / Migration = None / API Change = None / Backend Change = None**。1 new page (`/products/compare`) + 6 new components + 5 modified components。所有数据消费现有 API。
- **Future Candidates (NOT in M20.1.1)**：Product list include media/parameterValues、Category product count、Parameter comparison context、Related Products — 标记为 Future Candidate，需要 API Audit。
- **Decision** ✅：**M20.1.1 Architecture Design — COMPLETED**。12 项组件开发任务设计冻结，3 阶段开发路线明确，Development Authorization: READY。Next Step: 486_M20.1.1 Product Discovery Enhancement Development。

## M20.1.1 Product Discovery Enhancement Development（486，M20.1.1 Phase 1/P0 Development）

- **M20.1.1 Phase 1 (P0) Development Started & Completed（486）**：基于 485 架构设计，完成 M20.1.1 Product Discovery Enhancement Phase 1 前端开发。**Backend/Schema/API Change = None**。
- **New Components** ✅：`ProductDetailTabs`（4-tab navigation with URL hash sync）、`ProductDetailNav`（sticky sidebar, scroll-spy, desktop only）、`ProductDetailContent`（client wrapper with tabs + info enhancement + description toggle）、`CompareBar`（floating bottom bar, max 4 products）、`CompareTable`（parameter matrix with group header, difference highlighting, best-value detection）、`ComparePage`（`/products/compare?ids=`, URL-driven, Suspense boundary）。
- **Modified Files** ✅：`products/[slug]/page.tsx`（two-column layout with tabs + nav）、`products/page.tsx`（compareIds state + CompareBar integration）、`ProductCard.tsx`（compare checkbox, top-right absolute）、`ProductGrid.tsx`（compareIds/onCompareToggle props）。
- **Product Info Enhancement** ✅：Status badge（color-coded: ACTIVE/DRAFT/REVIEW/ARCHIVED）、Last updated date、Description expand/collapse（>200 chars）。
- **Build Verification** ✅：`apps/web` build exit 0。Route `/products/compare` — 4.06 kB, First Load JS 119 kB。
- **Impact** ✅：Frontend 6 new files + 4 modified files。Backend/Schema/Migration/API = None。
- **Decision** ✅：**M20.1.2 Search Experience Unification Development — COMPLETED**。10 new components + 1 new page + 1 new service + 1 modified component。GlobalSearchBar integrated into PublicHeader。Unified /search page with 5-domain tabs, result cards, suggestions, empty states。Parallel API requests via search.service.ts。apps/web build exit 0。Backend/Schema/Migration/API = None。
- **Decision** ✅：**M20.1.3 Search Experience Optimization Architecture Design Audit — COMPLETED (489)**。Architecture Audit Only, Code Change = None。12 files audited (1 service + 10 components + 1 page)。17 gaps identified: 3 P0 (suggestion integration, zero-result sections, pagination) + 6 P1 (retry button, product images, tab caching, code dedup, partial errors, sticky search) + 8 P2 (deferred)。Architecture Decision: PROCEED。Backend/Schema/Migration/API = None。Next Step: 490_M20.1.3_Search_Experience_Optimization_Development。
- **Decision** ✅：**M20.1.3 Search Experience Optimization Development — COMPLETED (490)**。3 P0 + 5 P1 items implemented。P0-1: SearchSuggestionDropdown integrated into GlobalSearchBar。P0-2: Zero-result sections hidden in "全部" mode。P0-3: Pagination / Load More with append logic。P1-1: Retry button on error state。P1-2: Product images skipped (Product API no media)。P1-3: Tab result caching via useRef。P1-4: Shared utilities extracted to search-utils.tsx。P1-5: Promise.allSettled partial error handling。P1-6: Sticky search bar on /search。apps/web build exit 0。Backend/Schema/Migration/API = None。Next Step: M20.1.4 or M20.2 Planning。
- **Decision** ✅：**M20.1.4 Search Experience Final Audit — COMPLETED (491)**。Architecture Audit Only, Code Change = None。M20.1 Search Experience Phase: PASS。14 files verified (13 search + 1 layout)。17 resolved gaps, 9 deferred, 7 future candidates, 3 accepted limitations。Architecture: FROZEN。Backend/Schema/Migration/API/Infrastructure: ALL NONE。M20.1 → M20.2 Transition: AUTHORIZED。Next Step: M20.2 Content Asset Planning。

## M21.0 Platform Next Phase Architecture Audit（511，M21 Architecture Audit）

- **M21.0 Platform Next Phase Architecture Audit Started & Completed（511）**：基于 M20.4 全阶段闭环状态，执行 M21 平台下一阶段架构审计。**Code Change = None（Audit Only）**。
- **Platform Capability Assessment** ✅：
  - **Admin Operation Center**: 72%（用户运营 75%、供应商运营 45%、产品运营 75%、商业运营 75%、内容运营 85%、数据运营 50%、系统运营 70%）
  - **Web Platform**: 80%（Public 18 页 + Buyer Workspace 4 页 + Supplier Workspace 3 页，Content→Product→Inquiry 商业转化路径完整）
  - **Mobile Experience**: 35%（Desktop 75%、Tablet 40%、Mobile 25%，基础响应式，操作体验待优化）
  - **Data Architecture**: 65%（25+ Prisma 模型、15 Enums，结构化数据完整，缺少时间序列/行为追踪/分析模型）
  - **AI Readiness**: 15%（数据基础就绪，向量/Embedding/RAG 基础设施为零）
- **M21 Direction Freeze** ✅：AI & Platform Enhancement。6 阶段路线图：M21.1 AI Readiness Foundation → M21.2 Data & Analytics Infrastructure → M21.3 Mobile Experience Enhancement → M21.4 Admin Intelligence Upgrade → M21.5 AI Agent Integration → M21.6 Supplier Product Model Re-evaluation。**⚠️ 路线已重校准（526.1）：M21.4 已从 Admin Intelligence 调整为 Semantic Intelligence Layer Preparation，Mobile 移至 M21.5，Admin Intelligence 移至 M21.6，AI Agent 移至 M21.7，Supplier 移至 M21.8。**
- **Supplier Product Model** ✅：481 文档重新评估——触发条件未满足（无 Supplier 型号页面需求、无 RFQ 精准匹配需求、无 AI Matching 需求）。**Decision: KEEP FROZEN**。
- **AI Agent Architecture** ✅：数据基础具备（结构化产品参数 + 内容标签体系），但基础设施缺失（向量数据库、Embedding pipeline、LLM 集成）。渐进路线：Infrastructure → Foundation → Intelligence。
- **Risk Assessment** ✅：High Risk 3 项（AI 过度建设、数据质量不足、Schema 膨胀）；Medium Risk 3 项（移动端投入产出比、第三方服务依赖、性能退化）；Low Risk 2 项（路线偏离、文档不同步）。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None**（Audit Only）。
- **Decision** ✅：**M21.0 Platform Next Phase Architecture Audit — PASS**。VISNDT 平台具备进入 M21+ AI & Platform Enhancement 阶段的基础。M21 路线图冻结，6 阶段渐进路线获批。**M21 AUTHORIZED**。Next Step: 512_M21.1_AI_Readiness_Foundation_Architecture_Audit。

## M21.1 AI Readiness Foundation Architecture Audit（512，M21.1 Architecture Audit）

- **M21.1 AI Readiness Foundation Architecture Audit Started & Completed（512）**：基于 M21.0 平台审计基线，执行 AI/Data Readiness 基础能力审计。**Code Change = None（Audit Only）**。
- **Data Quality Assessment** ✅：
  - **Content Domain**: 85%（Full SEO + Tags + Revisions + Public Projection，最佳 AI 候选）
  - **Business Domain**: 70%（Structured Matching + ScoringService + DemandMatch，可 AI 增强）
  - **Product Domain**: 65%（Excellent Parameter System + Category Tree，但缺少 SEO/Slug 字段）
- **Search Audit** ✅：当前搜索为 Prisma `contains` + `mode: 'insensitive'`（LIKE 风格），无 PostgreSQL full-text search（tsvector），无外部搜索引擎，无语义搜索。M20.1 Search FROZEN 维持。
- **Matching Audit** ✅：ScoringService 为规则驱动加权评分（exact match + range match + enum match），可通过 AI embedding 增强但不需要替换。
- **UserEvent Model Design** ✅：Proposed UserEvent 模型（userId, sessionId, eventType, entityType, entityId, metadata）——为未来推荐/个性化/转化漏斗分析提供基础。**Design Only，不实现**。
- **Vector Architecture Evaluation** ✅：**Recommendation: PostgreSQL + pgvector（Option A）**。零额外基础设施，原生 SQL 集成，适合当前数据规模。**Embedding 模型推荐: bge-large-zh-v1.5**（中文优化，自托管，1024 维）。
- **AI Capability Architecture** ✅：4 层架构确立：L1 Structured Data Layer（当前）→ L2 Semantic Layer（Embedding + Vector Search）→ L3 AI Capability Layer（LLM + RAG + AI Scoring）→ L4 Agent Layer（Admin AI Agent + Content AI Assistant）。
- **Product SEO Gap** ✅：Product 模型缺少 SEO 字段（seoTitle, seoDescription, seoKeywords, slug）——M21.3 需要补充以支持 Product Semantic Search。
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None / AI SDK = None / Vector DB = None / LLM = None**（Audit Only）。
- **Decision** ✅：**M21.1 AI Readiness Foundation Architecture Audit — PASS**。Content 85% AI-ready，Business 70% AI-ready，Product 65%（需 SEO 补充）。pgvector + bge-large-zh-v1.5 推荐。M21.2 Data & Analytics Infrastructure 获批（pgvector 启用 + Content Embedding + UserEvent 实现 + Semantic Search MVP）。**M21.2 AUTHORIZED**。Next Step: 513_M21.2_Data_Analytics_Infrastructure_Architecture_Audit。

## M21 Roadmap Recalibration（512.1，M21 Transition Adjustment）

- **M21 Roadmap Recalibration Audit Completed（512.1）**：基于 511 + 512 审计结论，重新校准 M21 路线。**Code Change = None（Audit + Documentation Only）**。
- **Recalibration Reason** ✅：511 审计中 Web 80% 评分未反映 Discovery/SEO/Conversion/UX Architecture 缺口，且 Data Analytics 依赖 Web 平台行为数据，需先完善 Web 再建数据体系。路线校准原则：「用户可见层优先 → 数据层其次 → 智能层最后」。
- **Old Roadmap（511）** ✅：M21.0 Audit → M21.1 AI Readiness → M21.2 Data Analytics → M21.3 Mobile → M21.4 Admin Intelligence → M21.5 AI Agent → M21.6 Supplier Model。
- **New Roadmap（512.1）** ✅：M21.0 Audit (511) → M21.1 AI Readiness (512) → **M21.2 Web Platform Experience (513)** → **M21.3 Data & Analytics (514)** → M21.4 Mobile → M21.5 Admin Intelligence → M21.6 AI Agent → M21.7 Supplier。**⚠️ 路线已二次重校准（526.1）：M21.4 调整为 Semantic Intelligence Layer Preparation，Mobile 移至 M21.5，Admin Intelligence 移至 M21.6，AI Agent 移至 M21.7，Supplier 移至 M21.8。**
- **Key Changes** ✅：
  - **新增 M21.2 Web Platform Experience**（Public Web + Buyer/Supplier Workspace + Navigation + Discovery + SEO + Conversion + UX Architecture，Frontend Only）
  - M21.2 Data → M21.3（依赖 Web 平台行为数据）
  - M21.3 Mobile → M21.4（Web 体验成熟后适配）**⚠️ 已二次重校准：M21.4 = Semantic Intelligence Layer**
  - M21.4 Admin → M21.5（需 Data 层支撑）**⚠️ 已二次重校准：M21.5 = Mobile Experience**
  - M21.5 AI Agent → M21.6（需 Admin 智能化基础）
  - M21.6 Supplier → M21.7（平台能力成熟后评估）
- **Six Capability Tracks** ✅：Web（Exp. Platform）、Data（Analytics）、Mobile（Full Op.）、Admin（Intelligence）、AI（Agent）、Supplier（Cond. Eval.）。
- **Capability Evolution Matrix** ✅：
  | Capability | Current | Target |
  |------------|---------|--------|
  | Admin | Operation Center (72%) | Intelligence |
  | Web | Discovery Platform (80%) | Experience Platform |
  | Data | Structured Data (65%) | Analytics Layer |
  | Mobile | Responsive (35%) | Full Operation |
  | AI | Ready (15%) | Agent |
  | Supplier | Offer Model (FROZEN) | Conditional Evolution |
- **Frozen Modules** ✅：Product Global Catalog、M20.1 Search、Supplier Product Model、Content Schema、Matching Algorithm、RBAC 全部维持冻结。
- **Constraints** ✅：M21.2 Web（Frontend Only, No Schema/API/Search）、M21.3 Data（Schema 需独立审核, No AI）、M21.4 Mobile（Frontend Only）、M21.5 Admin（Based on M21.3, No AI Agent）、M21.6 AI（Based on M21.3+M21.5, No Business Logic Replaced）、M21.7 Supplier（Condition Evaluation Only）。**⚠️ 已二次重校准（526.1）：M21.4 = Semantic Intelligence Layer（Database-Only→Backend→API→Admin），M21.5 = Mobile Experience（Frontend Only），M21.6 = Admin Intelligence，M21.7 = AI Agent，M21.8 = Supplier。**
- **Schema/API Impact** ✅：**Schema Change = None / Migration = None / API Change = None / Search Change = None**（Audit + Documentation Only）。
- **Decision** ✅：**512.1_M21_Roadmap_Recalibration_Audit — PASS**。M21 Revised Roadmap Authorized。六条能力路线冻结。**M21.2 AUTHORIZED**。Next Step: 513_M21.2_Web_Platform_Experience_Architecture_Audit。

## M21.2 Web Platform Experience Architecture Audit（513，M21.2 Architecture Audit）

- **M21.2 Web Platform Experience Architecture Audit Completed（513）**：对 VISNDT Web 平台进行完整体验架构审计。**Code Change = None（Audit Only）**。
- **Route Inventory** ✅：17 条公开路由 100% 存在（/、/products、/products/[slug]、/categories、/search、/knowledge、/knowledge/[slug]、/solutions、/solutions/[slug]、/articles、/articles/[slug]、/insights、/insights/[slug]、/tags/[slug]、/suppliers/[id]、/business、/about）。
- **Public Web Experience Score: 65%** ✅：Route 100%，SEO Metadata 100%，但 Loading States 0%、Error Boundaries 0%、OpenGraph 29%（仅 5/17 详情页）、JSON-LD 23%（仅 4/17 内容详情页）。
- **Buyer Workspace Score: 80%** ✅：Content→Product→Inquiry→Demand→RFQ 完整闭环，Buyer 7 页路由完备。缺口：无引导流程、无首次用户引导、无通知中心、无多 Offer 比较工具。
- **Supplier Workspace Score: 78%** ✅：Supplier = Capability Provider 定位完全合规，无 Store/Marketplace/Catalog。Display + RFQ 响应完整。缺口：Display 完整性指标可操作性弱、无公开预览、无能力分析。
- **Conversion Architecture Score: 85%** ✅：ContentCommercialCTA 统一入口，InquiryForm + SupplierInquirySection 双入口，Demand→RFQ 路径完整。缺口：所有内容 CTA 指向同一 /products（无上下文链接）、无转化追踪、页面缺少 Demand 创建入口。
- **SEO Architecture Score: 55%** ⚠️：Content 详情页 SEO 强（OpenGraph + JSON-LD），但 Product 页缺 JSON-LD（Product schema）、Homepage 缺 Organization/WebSite JSON-LD、列表页缺 OpenGraph、Product 模型缺 SEO 字段（seoTitle/seoDescription/seoKeywords/slug，Schema 层缺口）。
- **Navigation Architecture Score: 71%** ✅：三层导航（Discovery/Business/Workspace）结构清晰，WorkspaceSidebar + Breadcrumb 完整。缺口：移动端导航仅 Hamburger（无 Bottom Nav）、Breadcrumb 不全、无搜索建议。
- **Design System Score: 65%** ✅：40+ 组件按域组织良好，Tailwind 自定义主题。缺口：无 Design Token 系统、无组件文档（Storybook）、无共享 UI 原语库。
- **Mobile Readiness: 35%** ⚠️：基础响应式，Workspace 桌面端设计，Dashboard 移动端差，RFQ 表单未适配。
- **Gap Analysis** ✅：P0 缺口 5 项（Loading States、Error Boundaries、Product JSON-LD、Homepage JSON-LD、CTA 上下文链接）、P1 缺口 9 项（OpenGraph 列表页、Breadcrumb JSON-LD、Empty States、Design Token 等）、P2 缺口 7 项、Future 缺口 4 项（M21.3-M21.4）。
- **Decision** ✅：**513_M21.2_Web_Platform_Experience_Architecture_Audit — PASS**。Web Platform Experience Score 68%/C+。推荐进入 M21.2.x Development Phase（Frontend Only，~20-30 文件，零 Schema/API/Search 变更）。Next: 513.x_M21.2.x_Web_Platform_Experience_Development 或 514_M21.3_Data_Analytics_Infrastructure。



Current Major Stage:

M21.4 Semantic Intelligence Layer


Previous Route:

M21.4 Mobile Experience Platformization


Route Status:

REPLACED


Current Execution:

533_M21.4.7_Unified_Search_Ranking_Foundation — COMPLETED

M21.4 Semantic Intelligence Layer Preparation — CLOSED

Next: M21.5 Mobile Experience

---

## M21.5 Mobile Experience

### 534_M21.5_Pre_Development_Architecture_Audit — COMPLETED

- **Status** ✅：**Audit PASS**。Architecture Audit Only，No Code Change。
- **Audit Report** ✅：`docs/_review/534_M21.5_Pre_Development_Architecture_Audit_Report.md`。
- **Key Findings** ✅：
  - **API Ready**：13+ Public API + 6+ Workspace API 可直接被 Mobile 消费
  - **Auth Ready**：JWT Bearer Token 原生支持 Mobile
  - **Semantic Protected**：Semantic Layer 保持 Internal Capability，Mobile 不直接消费
  - **BFF Deferred**：当前 API 足够 Mobile Phase 1，BFF 延后至 M21.5.x
  - **No Blocking Risks**：无架构风险阻止 Mobile 开发
- **Recommended Path** ✅：Responsive Web (P0) → PWA (P1) → Native App (P2)
- **Impact** ✅：Schema Change = None / Migration = None / API Change = None / Frontend Change = None / Code Change = None（Audit Only）
- **Next** ✅：535_M21.5.1_Responsive_Web_Foundation



## Future Architecture Candidates

### 481_Supplier_Product_Model_Architecture_Future_Design_Candidate（481，Documentation Only）

- **Status** ✅：**Frozen / Not For Development**。Future Architecture Candidate。
- **Design Document** ✅：`docs/_architecture/future/481_Supplier_Product_Model_Architecture_Future_Design_Candidate.md`。
- **Content** ✅：供应商型号能力模型（Supplier Product Model）未来架构设计候选——解决平台标准产品能力与供应商型号分离、同一能力多供应商提供、型号参数继承与覆盖、Admin 审核治理等工业检测行业需求。明确禁止演变为 Supplier Store / Marketplace / Seller Backend / Inventory / SKU / ERP。
- **Constraint** ✅：必须保持 Product Global Catalog 架构，禁止 Product.organizationId / Product.supplierId / Supplier Product Catalog。
- **Trigger** ✅：Supplier Capability 页面需求增强 / RFQ 精准匹配需要型号级 / AI Matching 需要型号参数 / SEO 需要供应商型号页面 / 供应商数据规模增长后，通过正式 M19.4.x / M20 架构审计重新激活。
- **Decision** ✅：**DO NOT DEVELOP**。当前架构 Product Global Catalog + Offer Supplier Capability 保持。不纳入 M19.4 开发范围。

## M19.1.3 Product Supplier Capability & Inquiry Experience Enhancement（464，M19.1 Development 第三阶段）

- **M19.1.3 Started & Completed（464）**：基于 459-463 冻结结论，完成 Product Center V2 供应商能力与询价体验完善——ManufacturerInfo 接入 offers.organization 数据、SupplierCapabilityList 展示增强、Inquiry 交互流程完善，`apps/web` build 通过（exit 0）。
- **ManufacturerInfo 数据统一** ✅：`ManufacturerInfo.tsx` 新增 `offers` prop，优先从 `offers` 中推导制造商信息（取第一个 ACTIVE/SUBMITTED offer 的 organization），统一制造商信息与供应商能力数据源；产品详情页改为传入 `offers={product.offers}` 替代 `organization={null}`。
- **SupplierCapabilityList 展示增强** ✅：空状态增加引导性图标与文案（"如果您是该产品的供应商，请联系我们加入平台"）；供应商卡片增加 organization.type 标签；选中状态增加「已选择供应商」指示器；提示文案根据是否选中动态切换。
- **Inquiry 交互流程完善** ✅：`SupplierInquirySection` 选中供应商后展示选中横幅（"询价对象：XXX"）+「切换供应商」按钮；`InquiryForm` 新增 `organizationName` prop，选中供应商时显示"向 XXX 询价 YYY"。
- **防无供应商提交** ✅：`SupplierInquirySection` 仅在 `selectedOffer` 非 null 时展示 InquiryForm，`InquiryForm` 的 `offerId`/`organizationId` 为必填，无 fallback 逻辑。
- **回归验证** ✅：产品详情页整体布局不变，原有 ProductGallery、ProductParameters、Breadcrumb、Documents 均保持正常；`/products/[slug]` 路由正常生成（4.34 kB，dynamic）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Admin / Backend / Database；未展示 Price / Inventory / Transaction。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## M19.1.2 Product Detail Experience Enhancement（463，M19.1 Development 第二阶段）

- **M19.1.2 Started & Completed（463）**：基于 459-462 冻结结论，完成 Product Center V2 详情体验升级——技术参数从平铺展示升级为 ParameterGroup 分组展示、接入 Offer.organization 供应商能力展示、禁止 Inquiry 自动选择第一个 Offer，`apps/web` build 通过（exit 0）。
- **Technical Specification 分组展示** ✅：`ProductParameters.tsx` 升级为 `ParameterGroup` 分组展示，接收 `parameterGroups` 参数（通过 `GET /parameter-groups` public endpoint 加载），按 `parameterDefinition.parameterGroupId` 分组，未分组参数归入「其他参数」；无硬编码参数组名。
- **ParameterGroup 数据源** ✅：新增 `lib/api/parameter-groups.ts`（`getParameterGroups`，public）+ `services/parameter-group.service.ts`，遵循 `Page → Service → API Wrapper → Backend API`；**API Change = None**（复用已有 public endpoint）。
- **Supplier Capability 展示** ✅：新增 `SupplierCapabilityList.tsx`（产品页供应商列表，显示 Offer 的 organization.name / title / status / description，支持选中高亮）+ `SupplierInquirySection.tsx`（client component，管理 Offer 选择状态，选中后展示 InquiryForm）。
- **Inquiry Flow 改造** ✅：产品详情页移除 `inquirateOffer` 自动推导逻辑（原 `product.offers.find(...)`），改为 `SupplierInquirySection` 要求用户明确选择 Offer 后才展示 InquiryForm；`InquiryForm.tsx` 移除 `offerId || productId` / `organizationId || productId` fallback，改为必填 props。
- **Type 扩展** ✅：`types/product.ts` 新增 `ParameterGroup` 接口（id/name/code/description）。
- **回归验证** ✅：产品详情页整体布局不变（Overview / Media Center / Technical Specification / Documents），原有 ManufacturerInfo、ProductGallery、Breadcrumb 均保持正常；`/products/[slug]` 路由正常生成（3.86 kB，dynamic）。
- **架构约束保持** ✅：`Product Global Catalog + Offer Supplier Display`；未引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`；未触碰 Admin / Backend / Database。
- **Freeze 兼容** ✅：**Schema Change = None / Migration = None / API Change = None**；未改 `apps/api`、`database/prisma`、`apps/admin`；未引入 Design System / AI Search / Vector Search / ProductFamily / Supplier Product Ownership。
- **Build** ✅：`apps/web` `next build` exit 0（编译 + 类型校验 + 静态页 28/28 通过）；仅既有非阻断 lint 警告。

## Next Step

### M20.1 Frontend Platformization Development Planning（M20 Architecture Planning）

M18.4.1（449）Workflow Reliability Foundation、M18.4.2（450）Content Revision、M18.4.3（451）Scheduled Publish、M18.4.4（452）Approval Timeline 均已实现，**M18.4 Workflow Operation Enhancement 阶段闭环完成**；**M18.5.1 Content Operation Stability Audit（453）已完成（稳定化基线审计，无风险结论）**；**M18.5.2 Content Operation Type & Bundle Optimization（454）已完成（类型导入规范治理 + Admin Bundle 优化，主 chunk 1854.61→1844.77 kB + 4 个 lazy chunk）**；**M18.5.3 Content SEO Operation Enhancement（455）已完成（Admin SEO 运营面板 + 质量提示 + 搜索结果预览，Web SEO 链路验证通过）**；**M18.5.4 Content Operation Final Audit（456）已完成（最终稳定性审计，三层职责边界/数据库/调度/Admin/安全全 PASS，M18.5 Content Operation Stabilization 阶段关闭）**。**M19 阶段已启动（架构冻结完成）**：**M19 架构冻结（457-460 已完成）**——457 平台能力重评审计、458 M19 架构再评估 Blueprint、459 M19 实施 Blueprint、460 M19.1 Product Center V2 实施规划均已生成，**M19 产品体验架构状态冻结**；**M19.1.1 Product Search Frontend Integration（462）已完成**——后端已具备的 `parameterFilters` 动态参数筛选能力已接入 Web 前端（`lib/api/products.ts` 透传 + `ParameterFilterPanel` 动态面板 + 页面 state/query 同步，`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.2 Product Detail Experience Enhancement（463）已完成**——技术参数 ParameterGroup 分组展示、Supplier Capability 展示（Offer.organization）、Inquiry 禁止自动选择 Offer（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.3 Supplier Capability & Inquiry Experience Enhancement（464）已完成**——ManufacturerInfo 接入 offers.organization、Supplier 展示增强、Inquiry 交互完善（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.1.4 Product Center V2 Experience Stabilization（465）已完成**——产品列表/详情/供应商/询价全链路体验稳定化（`apps/web` build exit 0，Schema/Migration/API 均 None）；**M19.2.0 Supplier Display Architecture Audit（466）已完成**——架构审计通过（Code Change = None）；**M19.2.1 Supplier Capability Page（467）已完成**——Public Supplier Page（`apps/web` build exit 0）；**M19.2.2 Product Detail Supplier Section（468）已完成**——ManufacturerInfo + SupplierCapabilityList 供应商主页链接（`apps/web` build exit 0）；**M19.2.3 Pre-Audit（469）已完成**——审计通过（Code Change = None）；**M19.2.3 Information Architecture Audit（470）已完成**——信息架构冻结（Code Change = None）；**M19.2.3 Workspace Supplier Display Management（471）已完成**——Dashboard 展示管理入口 + 5 模块 Display Management 页面（`apps/web` build exit 0）；**M19.2.4 Supplier Display Capability Closure Audit（472）已完成**——闭环审计通过，M19.2 CLOSED；**M19.3.0 Search Experience Enhancement Architecture Audit（473）已完成**——搜索架构冻结，搜索边界明确，四层 IA 冻结，零 Schema/API 变更，M19.3 开发边界冻结；**M19.3.2.1 Supplier Discovery Boundary Correction（476）已完成**——删除公开供应商目录/恢复 Product-driven Capability Discovery，Supplier = Capability Provider 边界重新对齐，`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.3.3 Search Experience Enhancement Closure Audit（477）已完成**——M19.3 CLOSED，架构冻结保持，四类搜索边界验证通过，零 Schema/API 变更，Code State = Documentation State；**M20.0.0 M20 Architecture Planning Pre-Audit（483）已完成**——M20 方向冻结：Frontend Platformization (P1) + Content Asset Planning (P2) + AI Readiness Planning (P3)；**M20.1 Frontend Platformization Development Planning Audit（484）已完成**——M20.1.1~M20.1.5 开发边界冻结；**M20.1.1 Product Discovery Enhancement Architecture Design Audit（485）已完成**——12 项组件设计冻结；**M20.1.1 Phase 1 Development（486）已完成**——5 P0 components implemented, build exit 0；**M20.1.2 Search Experience Unification Architecture Design Audit（487）已完成**——架构设计 PASS，开发授权 READY，Code Change = None（Architecture Design Only）；**M20.1.2 Search Experience Unification Development（488）已完成**——10 组件 + 1 页面 + 1 服务 + 1 修改，build exit 0，Backend/Schema/Migration/API = None；**M20.1.3 Search Experience Optimization Architecture Design Audit（489）已完成**——Architecture Audit PASS，17 gaps identified (3 P0 + 6 P1 + 8 P2)，Development Authorization: PROCEED；**M20.1.3 Search Experience Optimization Development（490）已完成**——3 P0 + 5 P1 implemented，build exit 0，Backend/Schema/Migration/API = None；**M20.1.4 Search Experience Final Audit（491）已完成**——M20.1 Search Experience Phase: PASS，Architecture: FROZEN，M20.1 → M20.2 Transition: AUTHORIZED；**Code State = Documentation State**；下一步 M20.2 Content Asset Planning。

M18.5 进入前要求：
- [x] 449 报告生成（M18.4.1 Workflow Reliability Foundation 完成）
- [x] 450 报告生成（M18.4.2 Content Revision Implementation 完成）
- [x] 451 报告生成（M18.4.3 Content Scheduled Publish Implementation 完成）
- [x] 452 报告生成（M18.4.4 Content Approval Timeline Enhancement 完成）
- [x] 453 报告生成（M18.5.1 Content Operation Stability Audit 完成）
- [x] M18.4 阶段闭环（Revision History / Scheduled Publish / Reviewer Record / Approval History 全部落地）
- [x] M18.5 稳定化基线审计通过（无高风险，无代码变更）
- [x] 保持 WorkflowEvent / AuditLog / ContentRevision 三层职责分离、Public Content API 稳定

### Priority 2 — 已记录待办（低优先级）

1. **配置生产正式域名 SEO 参数** — 部署时设置 `NEXT_PUBLIC_SITE_URL`（影响 canonical / OpenGraph url / Sitemap / JSON-LD url）
2. **（可选）清理组件层 5 处 `import type` 类型引用** — 低风险，可后续处理

## Maintenance Rule

以后所有代码开发任务完成后，必须同步校准以下文件，确保“代码状态 = 文档状态”：

- `docs/project-management/PROJECT_STATUS.md`
- `docs/project-management/PROJECT_ROADMAP.md`
- `docs/project-management/MODULE_COMPLETION_MATRIX.md`
- `docs/project-management/BUSINESS_CAPABILITY_MAP.md`
- `docs/project-management/CONTENT_MANAGEMENT_PLAN.md`
