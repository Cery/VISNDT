# VISNDT Project Roadmap

## Roadmap Principle

本路线图以当前真实代码、Prisma Schema、页面路由、API 模块和 `docs/_review` 证据链为准，不再沿用已经过时的“Buyer-only / Supplier 缺失”判断。

## M21 Route Calibration Notice

Status:
ACTIVE

Effective Date:
2026-08-15

M21.4 Route Decision:

Previous:
M21.4 Mobile Experience Platformization

Decision:
Route Replaced

Current:
M21.4 Semantic Intelligence Layer


Reason:

M21.3 Data Intelligence Infrastructure completed the required
analytics, vector foundation preparation and AI data preparation.

Semantic capability has higher architectural priority than
mobile experience expansion.

Mobile Experience Platformization is moved to Future Candidate.





## M0-M18 Map

| Stage | Real Goal | Real Outcome | Status | Calibration |
| --- | --- | --- | --- | --- |
| `M0-M10` | 工程底座、身份权限、产品主数据、Demand/Match/RFQ/Admin 基础能力 | 后端主域、Admin 基础能力、产品与需求链已完成 | `DONE` | 当前全部作为系统基座保留 |
| `M11` | 后端闭环与 Admin 运营主链 | Backend API、Workflow、Admin 核心运营端完成 | `DONE` | 无路线偏移 |
| `M12-M13` | 生产准备、部署安全、Web MVP、公开站点与 Buyer 端完成 | Docker/CI/CD/安全、Public Website、Product Center、Buyer Workspace、文件与媒体能力完成 | `DONE` | 形成当前 Web 基线 |
| `M14` | Domain Workspace 与 Supplier 主链补齐 | Buyer / Supplier Dashboard、Workspace Domain Page、RFQ Response 决策流基本补齐 | `MOSTLY_DONE` | 已完成主功能，但遗留边界与治理型技术债 |
| `M15` | 技术债治理与边界收口 | TD-006 已落地，TD-001 已推进，TD-002/TD-005 已完成，WorkflowEvent 完整性治理已收口 | `DONE` | 已完成，M15 治理目标全部达成 |
| `M16` | 业务深化前稳定化 | M16.0 审计已完成，M16.1 公开询价链路属性绑定已完成，M16.2 前端 API 层规范化已完成，M16.3 公开站 SEO 元数据基础已完成，M16.4 内容管理 MVP 评估已完成（结论：推迟至 M17），M16.5 组件层 API 规范化已完成，435 关闭审计已通过 | `DONE`（M16 CLOSED） | M16 稳定化目标全部达成：询价链路打通、前端分层统一（页面+组件运行时均走 Service 层）、SEO 基础建立、内容系统边界明确（推迟 M17）、组件层 API 治理完成 |
| `M17` | 内容与运营体系建设 | M17.0 内容域架构规划已完成；M17.1 内容模型设计评审通过（设计冻结）；M17.2 内容域后端基础已实现（Content 模型+迁移+模块+API）；M17.3 Admin 内容管理基础已实现（菜单+路由+Service+列表+编辑器+生命周期操作）；M17.4 Web 公共内容接入已实现（Knowledge/Solutions 动态化 + 详情页 + SEO，后端新增公开读接口） | `IN_PROGRESS`（规划完成+评审通过+后端基础+Admin 前端+Web 公共接入均完成，待 M17.5 增强规划） | Content 实体/API/前端设计已冻结；INSIGHT 延期；WorkflowEntityType CONTENT 已扩展；M17.2 已新增 Content Schema + Migration；M17.3 已落地 Admin Content 基础；M17.4 已开放公开读接口（仅 PUBLISHED）并接入 Web |
| `M18` | 运营成熟化与数据驱动优化 | 内容运营：M18.0 五优先级实施规划（443）已定稿；**M18.1 Markdown 内容增强已完成（444：Admin Markdown 编辑+预览、Web 安全渲染、参数百科定位、示例内容，三端 build 通过）**；**M18.2 Content Media 已实现（446：Content→ContentMedia→FileAsset 链路 + 媒体管理 Admin/Web + 媒体下载发布状态校验，三端 build 通过）**；**M18.3 SEO Enhancement 已完成（447：OpenGraph / JSON-LD（Article/TechArticle）/ Sitemap / Canonical，apps/web build 通过）**；**M18.4 Workflow 架构规划已完成（448：Revision History / Scheduled Publish / Reviewer Record / Approval History 冻结设计，No Code Change）**；**M18.4.1 Workflow Reliability Foundation 已完成（449：WorkflowEvent 可靠性修复 + Content AuditLog 接入，API/Admin build 通过）**；**M18.4.2 Content Revision Implementation 已完成（450：ContentRevision 独立表 + 版本快照事务保存 + Admin 版本历史 UI，三端 build 通过）**；**M18.4.3 Content Scheduled Publish Implementation 已完成（451：Content.scheduledPublishAt + ContentSchedulerService 轻量扫描 + 幂等/可追踪/失败恢复，API/Admin build 通过）**；**M18.4.4 Content Approval Timeline Enhancement 已完成（452：WorkflowEvent 审核时间线 + Admin 展示，M18.4 阶段闭环，API/Admin build 通过）**；**M18.5.1 Content Operation Stability Audit 已完成（453：稳定化基线审计，无风险结论）**；**M18.5.2 Content Operation Type & Bundle Optimization 已完成（454：类型导入规范治理 + ContentEdit 四面板 React.lazy 按需加载，主 chunk 1854.61→1844.77 kB + 4 个 lazy chunk）**；**M18.5.3 Content SEO Operation Enhancement 已完成（455：Admin SEO 运营面板 + 质量提示 + 搜索结果预览，Web SEO 链路验证通过，三端 build 通过）**；**M18.5.4 Content Operation Final Audit 已完成（456：最终稳定性审计，三层职责边界/数据库/调度/Admin/安全全 PASS，M18.5 Content Operation Stabilization 阶段关闭，无代码变更）** | `CLOSED`（M18.1 已完成，M18.2 已实现，M18.3 SEO 已完成，M18.4 规划已完成，M18.4.1 前置整改已完成，M18.4.2 内容修订已实现，M18.4.3 定时发布已实现，M18.4.4 审核时间线已实现，M18.5.1 稳定化基线审计已完成，M18.5.2 类型与 Bundle 优化已完成，M18.5.3 Content SEO Operation Enhancement 已完成，M18.5.4 Content Operation Final Audit 已完成，M18.5 Content Operation Stabilization 阶段关闭） | 依赖 M16-M17 打底；M18.1 已落地；M18.2 设计基线已冻结并实现；M18.3 展示层 SEO 已落地（未新增 SEO 模型）；M18.4 规划已冻结（不新增 WorkflowAction/Role/Notification/CMS Scheduler）；M18.4.1 已修复 WorkflowEvent 组织约束被吞 + 补齐 Content AuditLog；M18.4.2 已建立 ContentRevision 版本历史（内容快照与流程/审计分离）；M18.4.3 已实现 Content 定时发布（scheduledPublishAt + 轻量扫描 + 复用 OPENED/STATUS_CHANGE，不新增 WorkflowAction/Schedule 模型）；M18.4.4 已实现 Content 审核时间线（WorkflowEvent 查询 + Admin 展示，无 schema/migration，不新增 Reviewer/Approval 表）；M18.5.1 Content Operation Stability Audit 已完成（453，稳定化基线审计：Database/Migration 24 up to date、WorkflowBoundary/AuditLog/ContentRevision 三层职责分离、Scheduler 可靠性、Admin UI、API 契约、三端 build 均 PASS，无高风险、无代码变更）；M18.5.2 Content Operation Type & Bundle Optimization 已完成（454，类型导入规范治理 + ContentEdit 四面板 React.lazy 按需加载，主 chunk 1854.61→1844.77 kB + 4 个 lazy chunk，能力不减少、无后端/API/schema 变化）；M18.5.3 Content SEO Operation Enhancement 已完成（455，Admin Content SEO 运营面板 + 非阻断质量提示 + Mock 搜索结果预览 + Web SEO 链路验证，SEO 信息仍属 Content，不新增 SEO 模型/表/Module，无后端/API/schema/migration 变化）；M18.5.4 Content Operation Final Audit 已完成（456，Content Domain 架构完整性、WorkflowEvent/AuditLog/ContentRevision 三层职责边界、Scheduled Publish 自动发布可靠性、Admin ContentEdit 七区块能力、API/Database/Permission/Public Content API 稳定性全 PASS，Database 24 up to date、三端 build 均 exit 0，无 High/Medium Risk，无代码变更，M18.5 阶段关闭，Code State = Documentation State） |
| `M19` | 产品体验架构演进（产品体验重构 / 供应商能力展示 / 搜索体验升级 / 运营体系规划） | **M19 架构冻结（457 平台能力重评审计已完成）**：确定 A 平台标准产品库、内容系统 High、前端产品/供应商展示与参数筛选体验不足；**M19 架构再评估 Blueprint（458 已完成）**：推荐 Product Global Catalog + Offer Supplier Display，不引入 Product.organizationId / ProductFamily / ProductModel / SupplierOffering，梳理 Web/Admin M19-M20 演进与 AI Readiness；**M19 实施 Blueprint（459 已完成）**：冻结 Product Center 定位（标准产品目录 + 供应商能力展示 + 需求撮合 + 知识内容 + 未来 AI 选型），定义产品列表/详情信息架构、动态参数搜索、Admin 产品运营中心、API 消费边界（Backend Capability First，前端消费现有能力，零 Schema 变更），拆分 M19.0-M19.4；**M19.1 Product Center V2 实施规划（460 已完成）**：细化产品列表/详情信息架构、组件拆分、API 消费映射、数据映射、前端改造范围（lib/api/products.ts 透传 parameterFilters、ProductParameters 按 ParameterGroup 分组、询价改选供应商、ManufacturerInfo 接入 offers）、后端/数据库影响评估（API/Schema/Migration 均 None）、7 项开发任务拆解（P0-P2）；**M19.1.1-4 Product Center V2 全部完成（462-465，`apps/web` build exit 0，Schema/Migration/API 均 None）**；**M19.2.0-4 Supplier Display 全部完成（466-472，M19.2 CLOSED）**；**M19.3.0 Search Experience Architecture Audit（473 已完成）**：搜索架构审计通过——搜索定位 Industrial Capability Discovery、四类搜索边界明确、四层搜索 IA 冻结、Database Query First、零 Schema/API 变更；**M19.3.1 Search Experience Development（474 已完成）**：Product Search UX 增强——URL 同步（useSearchParams+useRouter）、关键词高亮（HighlightText 前端 only）、Active Filter Chips（关键词/分类/参数）+ 清除全部、SearchBar 清除按钮、Supplier Discovery 入口（ProductCard 预留）、`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.3.2 Search Experience Enhancement Development（475 已完成）**：Search Result UX 增强——Loading Skeleton + Empty State 场景化 + Result Count 上下文 + Pagination 页码指示器 + ProductCard 供应商链接（`/products/${id}#suppliers`），`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.3.2.1 Supplier Discovery Boundary Correction（476 已完成）**：删除公开供应商目录（`/suppliers` 列表页 + 产品页入口），恢复 Product-driven Capability Discovery（Supplier = Capability Provider），`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.3.3 Search Experience Enhancement Closure Audit（477 已完成）**：M19.3 CLOSED——架构冻结保持，四类搜索边界验证通过，零 Schema/API 变更，Code State = Documentation State；**M19.4.0 Admin Product Operation Center Architecture Audit（478 已完成）**：Admin 架构审计通过——Admin = Platform Governance Center，18 类管理能力 + 28 个 Prisma 模型 + 全 CRUD API + RBAC + AuditLog + WorkflowEvent，M19.4 可基于现有数据模型开发，无需 Schema/API 变更；**M19.4.1 Pre-Development Design Audit（479 已完成）**：设计冻结——Product Governance / Category / Parameter / Media / Audit 治理边界冻结，零 Schema/API 变更，Product.status 生命周期治理列入 Future Candidate；**M19.4.2 Admin Product Operation Center Development（480 已完成）**：Admin Product Governance 治理能力增强；**M19.4.3 Product Model and Capability Architecture Audit（481 已完成）**：产品能力模型长期架构审核——全 PASS；**M19.4.4 Product Capability Governance Closure Audit（482 已完成）**：M19.4 CLOSED | `COMPLETED`（M19 架构冻结完成，M19.1 全部完成，M19.2.0-4 全部完成，M19.2 CLOSED，M19.3.0-3 全部完成，M19.3 CLOSED，M19.4.0-4 全部完成，M19.4 CLOSED，M19 COMPLETED） | 路由：M19.0 Architecture Freeze → M19.1 Product Center V2 → M19.2 Supplier Display → M19.3 Search Experience → M19.4 Admin Product Operation Center → M20 Frontend Platformization → M21+ AI Enhancement；架构约束保持 Product Global Catalog + Offer Supplier Display，禁止 Product.organizationId / ProductFamily / ProductModel / SupplierOffering，零 Schema 变更，前端消费后端已有能力；M19.1.1-4 + M19.2.0-4 全部完成，M19.2 CLOSED，M19.3.0-3 全部完成，M19.3 CLOSED，M19.4.0-4 全部完成，M19.4 CLOSED，M19 COMPLETED |
| `M20` | 前端平台化与体验升级（Frontend Platformization / 内容资产规划 / AI 准备） | **M20.0.0 Pre-Audit（483 Completed）**：M20 方向冻结；**M20.1.1-4 Search Experience（484-491 Completed）**：M20.1 CLOSED；**M20.2 Architecture Audit（492 Completed）**：Content Asset System PASS；**M20.2.1 Architecture Design Audit（493 Completed）**：Content Asset Architecture APPROVED；**M20.2.2 Search Integration Development（494 Completed）**：5 files，server-side keyword search；**M20.2.3 Tagging Taxonomy Design Audit（495 Completed）**：ContentTag + ContentTagRelation + TagType APPROVED；**M20.2.3 Tagging Taxonomy Development（496 Completed）**：26 files，3 models + 8 API endpoints + Admin + Public，三端 build exit 0；**M20.3.1 Commercial Conversion Development（503 Completed）**：6 pages，1 new component + 6 modified files，三端 build exit 0，零 Schema/API/Search 变更；**M20.4.1 Admin Operation Center Foundation Development（507 Completed）**：Admin Layout Enhancement + Dashboard Charts + Table Enhancement + Responsive + 6 Operation Components，零 Schema/API/Migration 变更；**M20.4.2 Admin Data Operation Enhancement（508 Completed）**：Export/Import + BatchActionBar + AdvancedFilterPanel + 4 核心列表页集成 + ContentTag 类型修复，零 Schema/API/Migration 变更；**M20.4.3 Admin Permission & Workflow Enhancement（509 Completed）**：Permission 组件体系 + usePermission Hook + AuditLog 增强，零 Schema/API/Migration 变更；**M20.4.4 Admin Professionalization Closure（510 Completed）**：BatchOperations→BatchActionBar 全量迁移（9 页）+ 组件体系收敛 + M20.4 CLOSED | `CLOSED`（M20.1 CLOSED，M20.2 CLOSED/FROZEN，M20.3 CLOSED/FROZEN，M20.4 CLOSED——507-510 全部完成，Code State = Documentation State） | 路由：M20.0 → M20.1 → M20.2 → M20.3 → M20.4 → M21+；M20.4: Admin Platform Professionalization 全阶段闭环（Foundation + Data Operation + Permission + Closure）；492-510 全部审计/开发报告连续 |
| `M21` | 平台智能化与体验演进（Web / Data / Mobile / Admin / AI Agent / Supplier） | **M21.0（511 Completed）**：6 域能力评估；**M21.1（512 Completed）**：Data Quality（Content 85%、Business 70%、Product 65%），pgvector 推荐；**M21.1c（512.1 Completed）**：路线重校准，六条能力路线冻结；**M21.2 Web Platform Experience Evolution（513-519 全部完成）**：**513** Architecture Audit（68%/C+）→ **514** Runtime Hardening（35 文件，P0-2/5 解决）→ **515** SEO Structured Data（12 文件，SEO C+→B+，P0-3/3 解决）→ **516** Product List Metadata（SEO 100%）→ **517** Content CTA（5 文件，Content→Product 路径）→ **518** Inquiry Context（4 文件，Context Confirmation→Inquiry Entry）→ **518.2** Inquiry Optimization（2 文件，6 处去交易化）→ **519** Conversion Tracking（7 文件，5 事件 + Adapter Pattern）；**M21.3.0（520 Completed）**：Data Intelligence Infrastructure Architecture Audit——Audit Only，29 Model 数据资产盘点 + 5 维度评级（B+/B/C+/D/C），M21.3 Readiness = CONDITIONAL PASS；**M21.3.1（521 Completed）**：Data Asset Governance Audit——Audit Only，29 Model + 20 Enum 全量盘点 + 7 域数据质量矩阵 + 13 项 Gap + 生命周期评估，Data Maturity = B；**M21.3.2 Pre-Dev Audit（522 Completed）**→ **M21.3.2 Development（522 Completed）**：Analytics Event Persistence Foundation——Database（ConversionEventType Enum + ConversionEvent Model + Migration 009）+ Backend（AnalyticsModule + POST /api/analytics/events Batch Write）+ Frontend（ApiTrackingAdapter + PageViewTracker + 4 新事件类型：page_view/content_view/search/product_filter），ConversionEvent Persistence Foundation Completed，Next: 523_M21.3.3_BI_Foundation | `IN_PROGRESS`（M21.0+M21.1+M21.1c 审计通过，M21.2 CLOSED，M21.3.0 审计通过，M21.3.1 审计通过，M21.3.2 Pre-Dev Audit + Development 完成，Next: M21.3.3）。**M21.3.3 Pre-Dev Audit（523 Completed）**→ **M21.3.3 Development（523 Completed）**：BI Foundation Development——Backend（AnalyticsReadService + AnalyticsReadController + 3 GET APIs：dashboard/statistics/events + ADMIN-only RBAC）+ Admin（Analytics Page + OverviewCards + TrendChart + Top 10 Tables + Menu Integration），BI Foundation Completed，Next: 524_M21.3.4_Data_Driven_Optimization）。**M21.3.4 Pre-Dev Audit（524 Completed）→ **M21.3.4 Development（524 Completed）**：Data-Driven Optimization Development——Backend（DATE_TRUNC via $queryRaw + Time Range + Entity Name Resolution + Memory Optimization）+ Admin（RangePicker + Refresh + Real Names），6/8 Gaps Resolved，M21.3.4 Completed。**M21.4.2 Embedding Data Population（528 Completed）**：Data Population——OpenRouter text-embedding-3-small（8 Content + 5 Product + 8 Chunk，100% Coverage，21/21 embeddings 1536-dim），P1 GAP-04 RESOLVED。**M21.4.3 Semantic Module Foundation（529 Completed）**：SemanticModule + RetrievalService + EmbeddingCacheService + SemanticController，P0 GAP-03 RESOLVED。**M21.4.4 Semantic Search API Foundation（530 Completed）**：SemanticQueryService + SemanticQueryController + DTO + Query Contract Frozen，Internal API。**M21.4.5 Semantic Retrieval Enhancement（531 Completed）**：threshold filtering + diagnostics + unified retrieve() + metadata + query normalization，P1 GAP-05 RESOLVED。**M21.4.6 Semantic Ranking Foundation（532 Completed）**：RankingService + RankingStrategy + Contract Frozen，semanticScore + rankingScore，P1 GAP-06 RESOLVED。**M21.4.7 Unified Search Ranking Foundation（533 Completed）**：UnifiedSearchService + UnifiedSearchContract + UnifiedSearchDto，Retrieval→Ranking→Unified Response orchestration，P1 GAP-07 RESOLVED。M21.4 CLOSED——3/3 P0 + 4/4 P1 GAPs 全部解决。**M21.5.0 Pre-Dev Audit（534 Completed）**：Audit PASS——API/Auth Ready，Semantic Protected，BFF Deferred；**M21.5.1 Responsive Web Foundation（535 Completed）**：2 new + 18 modified files，Responsive Layout + Mobile Navigation + WorkspaceLayout + Responsive Hooks + 三端适配，apps/web build exit 0，零 API/Schema/Migration 变更。**M21.5.2 Progressive Web App Foundation（536 Completed）**：6 new + 1 modified files，PWA Manifest + Service Worker（Cache-First Static / Network-First Pages / Offline Fallback）+ PWA Icons + Offline Page + Root Layout PWA Integration，apps/web build compiled successfully，零 API/Schema/Migration 变更。**M21.5.3 Mobile Experience Optimization（537 Completed）**：12 modified files，Workspace Mobile UX + Product Experience + Form Experience + Touch Optimization（44px targets），apps/web build exit 0，零 API/Schema/Migration 变更。M21.5 Mobile Experience — CLOSED。**M21.6.0 Pre-Dev Audit（538 Completed）**：Audit PASS——Admin UI 19 pages（B+），Admin API 11 endpoints（ADMIN-only），Analytics 8 event types（dashboard + statistics + events），Monitoring（Matching + System），Audit（full trail + filter + export），Embedding（coverage status），Semantic Boundary PROTECTED，13 data sources READY，8 Gaps（0 P0 / 3 P1 / 5 P2），Overall Readiness B+。**M21.6.1 Admin Operational Dashboard Enhancement（539 Completed）**：8 modified files（4 backend + 4 frontend），1 new API endpoint（GET /admin/dashboard/trend）+ 2 enhanced API responses（stats + pending），Dashboard Enhancement：Platform KPIs（6 cards）+ Business KPIs（6 cards）+ Matching Intelligence（4 cards）+ Pending Items（5 cards）+ Real Trend（7-day ConversionEvent）+ Business Funnel（7-stage real data）+ Entity Comparison（10 entities），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。**M21.6.2 Admin Business Analytics Enhancement（540 Completed）**：11 files（2 new backend + 3 new frontend + 6 modified），4 new API endpoints（GET /admin/analytics/business/{funnel,lifecycle,conversion,matching}，ADMIN-only），Business Analytics Page（4 tabs：Demand Funnel + RFQ Lifecycle + Business Conversion + Matching Analysis），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。**M21.6.3 Admin Monitoring Enhancement（541 Completed）**：9 files（2 new backend + 3 new frontend + 4 modified），1 new API endpoint（GET /admin/monitoring/overview，ADMIN-only），Monitoring Page（5 sections：System Health + Business Risk + Matching Health + Embedding Coverage + Analytics Pipeline），10 code-level thresholds（NORMAL/WARNING/CRITICAL），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。**M21.6.4 Admin Audit Intelligence Enhancement（542 Completed）**：9 files（2 new backend + 3 new frontend + 4 modified），1 new API endpoint（GET /admin/audit-intelligence/overview?days=7，ADMIN-only），Audit Intelligence Page（5 sections：Audit Overview + Audit Trend + Entity Distribution + Actor Activity + Risk Indicators），6 code-level risk indicators（DELETE/STATUS_CHANGE/Event Rate/Login Rate/Actor Activity/Actor Concentration），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。**M21.6.5 Admin Intelligence Closure Audit（543 Completed）**：Audit Only——539-542 全能力验证 PASS + 架构边界 PROTECTED + Semantic Boundary PROTECTED + Database 零变更 + API 全部 ADMIN-only + 三端 Build PASS + 文档同步完成，M21.6 CLOSED。**M21.7.0 Pre-Dev AI Agent Architecture Audit（544 Completed）**：AUDIT ONLY——M21.6 CLOSED 确认；6 项 AI 基础能力就绪（Semantic + Embedding + Analytics + Audit + Monitoring + Admin）；AI 边界验证 PASS（无 AI 实现泄漏、Semantic Boundary PROTECTED、No Autonomous AI Decision）；9 核心数据源 + 7 附加数据源 READY；AI Gateway Architecture Proposal 完成；M21.7 Readiness = READY。**M21.7.1 AI Agent Gateway Foundation（545 Completed）**：7 files（4 new backend：ai.module.ts + ai.controller.ts + ai.service.ts + index.ts + 3 existing：interfaces + dto + guard），3 new API endpoints（GET /ai/status + GET /ai/capabilities + GET /ai/boundaries，JWT protected），AI Gateway Foundation 建立（AI Capability Boundary + AI Request Audit + Capability Guard + AICapability Registry），apps/api build exit 0，零 Schema/Migration 变更，Semantic Boundary PROTECTED，No Autonomous AI Decision。**M21.7.2 AI Agent Runtime Foundation（546 Completed）**：7 new files（runtime/：agent-runtime.module.ts + agent-runtime.service.ts + 3 interfaces + 2 index.ts）+ 2 modified（ai.module.ts + ai/index.ts），Agent Runtime Foundation 建立（AgentExecutionContext + AgentExecutionContract + CapabilityInvocation + AgentRuntimeService + Audit Integration），apps/api build exit 0，零 Schema/Migration 变更，Agent Runtime Boundary PROTECTED，No LLM Execution Leakage，No Autonomous AI Decision。**M21.7.3 AI Tool Layer Foundation（547 Completed）**：5 new files（tools/：tool-layer.module.ts + tool-registry.service.ts + 2 interfaces + index.ts）+ 2 modified（ai.module.ts + ai/index.ts），ToolRegistryService（6 planned tools across 5 categories：SEMANTIC/BUSINESS/ANALYTICS/CONTENT/UTILITY）+ ToolDefinitionContract + ToolInvocationContract + Tool Validation，apps/api build exit 0，零 Schema/Migration 变更，所有 tools mutationAllowed=false。**M21.7.4 AI Tool Registry And Semantic Adapter Foundation（548 Completed）**：5 new files（adapter/：interfaces/adapter-contract.interface.ts + interfaces/semantic-adapter.interface.ts + interfaces/index.ts + semantic-adapter.base.ts + adapter/index.ts）+ 1 modified（tool-registry.service.ts：adapter registry + mapping + adapter-aware invokeTool）+ 2 updated（ai.module.ts + ai/index.ts），Adapter Layer Foundation 建立（ToolAdapterInterface + AdapterRegistry + SemanticAdapterContract + AbstractSemanticAdapter + Category-based Adapter Mapping），apps/api build exit 0，零 Schema/Migration 变更，Semantic Boundary PROTECTED。**M21.7.5 AI Assistant Foundation（549 Completed）**：8 new files（assistant/：assistant.module.ts + assistant.service.ts + 4 interfaces + 2 index.ts）+ 2 modified（ai.module.ts + ai/index.ts），AssistantService（4 planned capabilities：ASSIST-001/002/003/004 + context validation + capability routing + audit integration）+ AssistantCapabilityRegistry（all PLANNED + mutationAllowed=false + requiresHumanReview=true），apps/api build exit 0，零 Schema/Migration 变更。**M21.7.6 AI RAG Foundation（550 Completed）**：7 new files（rag/：rag.module.ts + rag.service.ts + 3 interfaces + 2 index.ts）+ 2 modified（ai.module.ts + ai/index.ts），RAGService（pipeline：receive → validate → retrieve → format → audit）+ KnowledgeSourceRegistry（4 planned sources：KS-001/002/003/004）+ RetrievalContract + RAGContextContract，apps/api build exit 0，零 Schema/Migration 变更，No LLM/Embedding/Vector DB。**M21.7.7 AI Knowledge Context Foundation（551 Completed）**：6 new files（context/：context.module.ts + context.service.ts + 2 interfaces + 2 index.ts）+ 2 modified（ai.module.ts + ai/index.ts），ContextService（context lifecycle：create → validate → complete + context registry + trace + audit + KnowledgeContext）+ AIContext Contract + KnowledgeContext + ContextTrace + ContextAuditRecord，apps/api build exit 0，零 Schema/Migration 变更。M21.7 AI Agent Integration — CLOSED（544-551 全部完成，7 层架构完整闭环）。Next: M21.7 Final Closure Audit | `CLOSED`（M21.0+M21.1+M21.1c 审计通过，M21.2 CLOSED，M21.3 CLOSED，M21.4 CLOSED——7 子阶段全部完成，P0 GAPs 3/3 resolved，P1 GAPs 4/4 resolved。M21.5 CLOSED——535+536+537 完成。M21.6 CLOSED——538 Pre-Dev Audit PASS + 539 Dashboard + 540 Business Analytics + 541 Monitoring + 542 Audit Intelligence + 543 Closure Audit 全部完成。M21.7 CLOSED——544 Audit PASS，545 Gateway COMPLETED，546 Runtime COMPLETED，547 Tool Layer COMPLETED，548 Adapter COMPLETED，549 Assistant COMPLETED，550 RAG COMPLETED，551 Context COMPLETED） | 路由：M21.0 → M21.1 → M21.2 → M21.3 → M21.4 → M21.5 → M21.6 → M21.7 → M21.8；M21.4 范围：Semantic Intelligence Layer（Vector Index → Data Population → Semantic Module → Search API → Retrieval Enhancement → Ranking → Unified Search）；M21.5 范围：Mobile Experience（Responsive Web → PWA → Native App，Existing Capability Mobile Consumption Layer）；M21.6 范围：Admin Intelligence（Pre-Dev Audit → Operational Dashboard → Business Analytics → Monitoring → Audit Intelligence → Closure）；M21.7 范围：AI Agent Integration（Architecture Audit → AI Gateway → Agent Runtime → Tool Layer → AI Assistant） |
| `M21.8` | 平台演示准备（Platform Readiness） | **553 Architecture Audit PASS**——M21.7 AI Foundation FROZEN，Web 44 routes + Admin 75+ routes 全编译，31 Models 29 Migrations 稳定，10/10 Business Flows 运营，Readiness Score B+；**554 Frontend Experience Upgrade COMPLETED**——Homepage + Product Center + Solution Center + Workspace + Navigation/Layout/Responsive 全面优化，apps/web build exit 0；**555 Admin Experience Upgrade COMPLETED**——Dashboard + Product Management + Content Management + Navigation/IA + Responsive 全面优化，apps/admin build exit 0（5909 modules，10.26s），零 API/Schema/Migration 变更，Readiness Score A-；**556 Demo Dataset Initialization COMPLETED**——database/seed_demo.ts 可重复初始化脚本（Safety Gates + Upsert + Deterministic IDs + Demo Scope Cleanup），Users（6）/ Organizations（5）/ Products（12）/ Offers（12）/ Demands（5）/ DemandMatches（14）/ RFQs（3）/ RFQResponses（4）/ Content（7）/ Notifications（7）/ ConversionEvents（7-day）/ WorkflowEvents（16），Seed #1/#2/#3 全部 PASS，Demo Dataset Boundary PROTECTED；**557 Full Business Flow Validation COMPLETED**——28/28 API + 10/10 Page + 6/6 PWA 全部 PASS，P0=0 / P1=1（Product slug lookup）/ P2=2；**558 Platform Closure Stabilization COMPLETED**——P1-01 修复（ProductsService.findOne() UUID/slug 双模式查询），三端 build 全部 exit 0，回归验证 PASS，零 Schema/Migration/新 Endpoint，P0=0 / P1=0 / P2=2 deferred | `CLOSED`（553 Audit PASS，554 Frontend COMPLETED，555 Admin COMPLETED，556 Demo Dataset COMPLETED，557 Validation COMPLETED，558 Closure Stabilization COMPLETED——P0=0 / P1=0 / P2=2 deferred，Readiness Score A-，M21.8 CLOSED）。Next: M22.1 Supplier Experience | 路由：M21.8.1 → M21.8.2 → M21.8.3 → M21.8.4 → M21.8.5 → M22；M21.8 定位：Experience Stabilization Layer，非 Business Expansion Layer；AI Foundation FROZEN；558 代码变更：仅 apps/api/src/products/products.service.ts + products.controller.ts |
| `M22.1` | 供应商体验（Supplier Experience） | **559 Supplier Experience Architecture Audit COMPLETED**——Audit Only，Supplier 能力全量盘点：数据模型 9 模型复用（Organization/Offer/RFQ/RFQResponse/DemandMatch/Notification/WorkflowEvent/OrganizationMember/User），API 5 模块 20+ endpoints（Workspace/RFQ/Response/Offer/Organization），前端 15 文件 7 routes（Dashboard/Display/RFQs/Responses/Public Profile），三边界全 PASS（Supplier Experience / Product-Centric / No Marketplace Drift），零 Schema/Migration/API/Frontend 变更，M22.1 Readiness = READY。**560 Supplier Workspace Experience Enhancement COMPLETED**——5 文件修改（RFQ Detail + Response List + Dashboard + Navigation + API Client），Supplier Workspace 体验增强完成（RFQ 详情产品匹配+Response 状态+Response 筛选决策+Dashboard 统计+快捷操作+最近活动+导航完善），三边界全 PASS，零 Schema/Migration/API Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。**561 Supplier Offer Management COMPLETED**——Supplier Offer 管理能力增强完成。**562 Supplier Business Opportunity Center COMPLETED**——Opportunity Center 页面（公开 RFQ + 定向 RFQ + 匹配机会三标签 + 机会时间线）+ Dashboard 增强（公开 RFQ 统计 + 商机快捷入口 + 业务导航）+ 导航集成（WorkspaceSidebar Opportunities 入口），三边界全 PASS，零 Schema/Migration/API Endpoint 变更，AI Foundation FROZEN，三端 build 全部 exit 0。**563 Supplier Self-Service Profile COMPLETED**——Profile 页面（企业资料查看+编辑+保存+权限控制）+ PATCH /organizations/:id 权限扩展（允许组织成员自助更新 name/type）+ Dashboard 快捷入口+导航集成，三边界全 PASS，零 Schema/Migration 变更，API 变更最小化（仅扩展现有 PATCH 端点权限），AI Foundation FROZEN，三端 build 全部 exit 0。**564 Supplier Experience Validation COMPLETED**——Audit/Review Only，Supplier 全流程验证通过（Login → Dashboard → Profile → Offer → Opportunity → RFQ → Response → Notification），三边界全 PASS，AI Foundation FROZEN 确认，零代码变更，三端 build 全部 exit 0。Next: M22.2 Content Center | `CLOSED`（559 + 560 + 561 + 562 + 563 + 564 COMPLETED，6/6 全部完成）。M22.1 CLOSED——Supplier Experience Enhancement Layer 阶段闭环。Next: M22.2 Content Center | M22.1 定位：Supplier Experience Enhancement Layer，前端体验增强为主，零 Schema 变更，API 变更最小化；推荐路线：M22.1.1 Workspace Enhancement（COMPLETED）→ M22.1.2 Offer Management（COMPLETED）→ M22.1.3 Business Opportunity Center（COMPLETED）→ M22.1.4 Self-Service Profile（COMPLETED）→ M22.1.5 Validation（COMPLETED）→ M22.2 Content Center |
| `M22.2` | 内容中心（Content Center） | **Architecture Initialization COMPLETED**——Audit Only，Content Center 架构设计确认：Content 模型 4 类型（ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT）+ 4 状态（DRAFT/REVIEW/PUBLISHED/ARCHIVED）+ ContentMedia/ContentRevision/ContentTag/ContentChunk 完整基础设施 + 10 API endpoints（ADMIN CRUD + Public query + slug lookup + submit/review/archive/publish/schedule）+ Admin 3 页面（ContentList/ContentCreate/ContentEdit）+ Admin 6 组件（ContentForm/ContentMediaManager/ContentSeoPanel/ContentRevisionHistory/ContentApprovalTimeline/ContentScheduledPublish）+ Web 10 内容页面（/articles /insights /knowledge /solutions + 各 [slug] + /tags/[slug]）+ 搜索集成（Knowledge+Solution 标签页）+ SEO 元数据（seoTitle/Description/Keywords）+ AI Embedding 就绪（vector(1536) + ContentChunk），三边界全 PASS，AI Foundation FROZEN，Content Center 架构就绪。**M22.2.1 Architecture Audit COMPLETED**——Audit Only，6 边界审计全部 PASS，三边界全 PASS，AI Foundation FROZEN，Content Center Architecture = READY FOR IMPLEMENTATION PHASE。**M22.2.2 Content Model Implementation COMPLETED**——Migration 012（estimatedReadTime + status/publishedAt index）+ QueryContentDto sort/order + Service 增强（estimatedReadTime 自动计算 + findAll 含 tags + findAllPublic 默认 publishedAt desc 排序），三边界全 PASS，三端 build 全部 exit 0。**M22.2.3 Content Management Enhancement COMPLETED**——7 files（Types + ContentList + ContentForm + ContentCreate + ContentEdit），ContentList 新增 4 列（SEO 状态/标签/预计阅读/发布时间）+ sort 排序支持，ContentForm 新增封面图上传 + 预计阅读时间实时预览，ContentEdit 新增 coverImageId 传递 + 预计阅读/发布时间展示，三边界全 PASS，三端 build 全部 exit 0。**M22.2.4 Web Content Experience COMPLETED**——10 files（1 new ContentCard + 4 Content List Pages + 2 Content Detail Pages + 1 Tag Page + 1 Types + 1 API Client），ContentCard 统一内容卡片组件（封面图/类型标签/阅读时间/标签/发布时间/作者），4 列表页改造（articles/knowledge/insights/solutions 统一使用 ContentCard + 响应式 3 列网格），2 详情页增强（article/knowledge [slug] 封面图展示 + 阅读时间显示），标签聚合页（/tags/[slug] 支持全部 4 类型），三边界全 PASS，三端 build 全部 exit 0。**M22.2.5 SEO Validation COMPLETED**——Audit Only，SEO 全量验证 B+（15/16 路由 Metadata + 6 JSON-LD + Sitemap + robots + Admin SEO Panel），5 P2 Gap/0 P0/P1，三边界全 PASS，零代码变更。**M22.2.6 Content Center Final Validation COMPLETED**——Audit Only，M22.2 阶段全量验证通过（6 表 + 11 API + 6 Admin Routes + 8 Admin Components + 9 Web Routes + B+ SEO），架构边界全 PASS，三端 build 全部 exit 0。M22.2 Content Center CLOSED。Next Stage: M22.3 Knowledge Base | `CLOSED`（Architecture Initialization + Audit + Model Implementation + Management Enhancement + Web Content Experience + SEO Validation + Final Validation 全部完成，6/6）。Next Stage: M22.3 Knowledge Base | M22.2 定位：Content Asset Layer，平台知识资产建设；推荐路线：M22.2 Architecture Initialization（COMPLETED）→ M22.2.1 Architecture Audit（COMPLETED）→ M22.2.2 Content Model Implementation（COMPLETED）→ M22.2.3 Content Management Enhancement（COMPLETED）→ M22.2.4 Web Content Experience（COMPLETED）→ M22.2.5 SEO Validation（COMPLETED）→ M22.2.6 Content Center Final Validation（COMPLETED）→ M22.2 CLOSED |
| `M22.3` | 知识库（Knowledge Base） | **572_M22.3.0 Architecture Initialization COMPLETED**——Architecture / Audit / Design Validation，Knowledge Base 架构初始化：定位 Knowledge = Platform Knowledge Asset（非 Supplier/Marketplace/UGC），架构分层 Content Asset Layer → Knowledge Structured Layer → Industrial Inspection Knowledge Capability，Content Center 全量盘点（6 表 + 11 API + 6 Admin Routes + 8 Admin Components + 9 Web Routes + B+ SEO），四大架构锁全 PASS（Supplier Experience Boundary / Product-Centric Strategy / No Marketplace Drift / AI Foundation FROZEN），Database Impact NONE（FUTURE DESIGN ONLY），API/Frontend/Admin/AI Impact 均 NONE，零代码变更，文档同步完成。**573_M22.3.1 Knowledge Model Design COMPLETED**——Architecture / Data Model Design / Audit，5 模型（KnowledgeDomain/KnowledgeCategory/KnowledgeEntry/KnowledgeContentRef/KnowledgeRelation）+ 3 枚举（KnowledgeEntryStatus/KnowledgeReferenceType/KnowledgeRelationType），6 大工业检测领域（Inspection Technology/Inspection Scenario/Equipment Application/Industry Application/Detection Method/Parameter Guidance），三层分类体系（Domain → Category → Entry），5 种知识关系（RELATED/CHILD/PARENT/PREREQUISITE/FOLLOWUP），3 种内容引用类型（SOURCE/RELATED/SUPPLEMENT），structuredBody JSON 结构化知识体设计，四大架构锁全 PASS，Database Impact NONE（FUTURE DESIGN ONLY），零代码变更。**574_M22.3.2 Knowledge Classification Implementation COMPLETED**——Development / Database / Admin，2 新表（knowledge_domain + knowledge_category）+ Migration 013 + 10 ADMIN API endpoints + 6 Admin 页面（Domain List/Create/Edit + Category List/Create/Edit），三端 build 全部 exit 0，四大架构锁全 PASS，Content/Web 零修改。**575_M22.3.3 Knowledge Association Implementation COMPLETED**——Development / Database / API / Admin，3 新表（knowledge_entry + knowledge_content_ref + knowledge_relation）+ 3 枚举 + Migration 014 + 20 ADMIN API endpoints + 3 Admin 页面（EntryList + EntryCreate + EntryEdit w/ 内容引用 & 知识关联），三端 build 全部 exit 0，四大架构锁全 PASS，Content/Web 零修改。**576_M22.3.4 Knowledge Retrieval Foundation COMPLETED**——Development / API / Web，Public Knowledge Query API 5 endpoints（GET /knowledge/public/domains + /domains/:slug + /categories + /entries + /entries/:slug，PUBLIC access）+ 3 Web 页面（/knowledge-base Home + /knowledge-base/domains/[slug] Domain + /knowledge-base/[slug] Detail），三端 build 全部 exit 0，Database/Admin 零变更，四大架构锁全 PASS。**577_M22.3.5 Knowledge Base Final Validation COMPLETED**——Audit / Validation，M22.3 全量验证通过：5 模型 + 3 枚举 + 22 Admin API + 5 Public API + 9 Admin 页面 + 3 Web 页面 + 三端 build 全部 exit 0 + 四大架构锁全 PASS + 完整能力链路（6/6），M22.3 Knowledge Base CLOSED。Next Stage: M22.4 Search & Matching Enhancement | `CLOSED`（572 Architecture Initialization COMPLETED + 573 Knowledge Model Design COMPLETED + 574 Classification Implementation COMPLETED + 575 Association Implementation COMPLETED + 576 Retrieval Foundation COMPLETED + 577 Final Validation COMPLETED——6/6）。M22.3 定位：Knowledge Structured Layer，平台知识资产结构化；推荐路线：M22.3.0 Architecture Initialization（COMPLETED）→ M22.3.1 Knowledge Model Design（COMPLETED）→ M22.3.2 Knowledge Classification Implementation（COMPLETED）→ M22.3.3 Knowledge Association Implementation（COMPLETED）→ M22.3.4 Knowledge Retrieval Foundation（COMPLETED）→ M22.3.5 Knowledge Base Final Validation（COMPLETED）→ M22.3 CLOSED |
| `M22.4` | 搜索与匹配增强（Search & Matching Enhancement） | **578_M22.4_Search_Matching_Architecture_Reassessment COMPLETED**——Architecture Audit / Capability Reassessment，Search Architecture Proposal（Unified Industrial Retrieval Layer：Product + Knowledge + Content 统一检索），Matching Evolution（Knowledge Context 辅助匹配——REFERENCE only，不修改评分算法），SEO Growth Architecture（Knowledge Asset 作为 Topic Authority + Long Tail Search + Scenario Landing Page），AI Future Boundary（Knowledge Asset → AI Understanding Layer 预留接口），四大架构锁全 PASS，零代码变更。**579 Compatibility Audit COMPLETED** + **580 Architecture Finalization V2 COMPLETED**——Architecture FROZEN，15 ADR 记录，零代码变更。**581_M22.4.1_Unified_Search_Foundation_Implementation COMPLETED**——Development / API / Frontend，Backend 4 new files（search.module.ts + search.controller.ts + search.service.ts + dto/unified-search.dto.ts）+ 1 modified（app.module.ts），Frontend 1 new file（lib/api/search.ts）+ 1 modified（services/search.service.ts），1 new API endpoint（GET /search，PUBLIC），5 搜索适配器（Product + KnowledgeEntry + Content + Solution + Supplier），KnowledgeEntry 替换 Content(KNOWLEDGE) 作为主知识源，服务端聚合替代前端 Promise.allSettled，统一响应契约 UnifiedDiscoveryResponse，三端 build 全部 exit 0，Database/Schema/Matching/AI 零变更。**582_M22.4.2_Discovery_Experience_Implementation COMPLETED**——Frontend / Discovery Experience，1 new + 3 modified + 1 CSS，Desktop 统一发现页，Mobile First-Class 发现体验，Backend/API/Database 零变更。**583_M22.4.3_SEO_Asset_Architecture_Implementation COMPLETED**——Frontend / SEO Asset，7 modified + 1 rewritten，Product SEO（canonical + Twitter），Knowledge SEO（JSON-LD Article + BreadcrumbList + Twitter + sitemap），Content SEO（Twitter + OG type fix），Sitemap 6 类动态路由覆盖。**584_M22.4.4_Matching_Knowledge_Context_Architecture_Design COMPLETED**——Architecture Design Only，零代码变更，Matching 审计（weighted_v1 确定性评分），Knowledge Context Layer 设计（Read-Side 伴生数据模式），Scenario Understanding 未来接口设计，M23+ 演进路线定义（M23.0-M23.4+），7 个 ADR（ADR-016~022），9 项能力边界矩阵。M22.4 = CLOSED（7/7 全部完成）。Next: M23 Planning | `M22.4 CLOSED`（578 + 579 + 580 + 581 + 582 + 583 + 584 COMPLETED——7/7，Architecture FROZEN + Implementation 3/4 + Design 1/4）。M22.4 定位：Search & Matching Enhancement Layer；路线：M22.4.1 Unified Search Foundation（COMPLETED）→ M22.4.2 Discovery Experience（COMPLETED）→ M22.4.3 SEO Asset Architecture（COMPLETED）→ M22.4.4 Matching Context Enhancement（DESIGN COMPLETED） |
| `M23.0` | 能力演进路线规划（Capability Evolution Planning） | **585_M23.0_Capability_Roadmap_Architecture_Review COMPLETED**——Architecture Review Only，零代码变更，M22.4 完成审计（7/7 CLOSED + 零 P0/P1 债务），平台全量能力评估（6 模块深度审计），M23 优先级定义（P0: Knowledge Context / P1: Search Optimization / P2: Match Explainability），8 个 ADR-M23（001~008），6 个永久边界重申，M23 路线图 5 阶段（M23.0-M23.4+），M23.0 任务分解（4 tasks: 586-589）。**586_M23.0.1_Knowledge_Context_Adapter_Implementation COMPLETED**——Backend Implementation，4 files（2 new + 1 new controller + 1 modified），1 new API endpoint（GET /matches/:id/knowledge-context，JWT protected），KnowledgeContextAdapter（Read-side Capability Foundation），Database/Migration/Matching/Scoring/AI 零变更，apps/api build exit 0。**587_M23.0.2_Match_Detail_UX_Knowledge_Context COMPLETED**——Frontend Experience / Read-side Capability Consumption，11 files（Web：3 new + 1 modified；Admin：1 new + 4 modified），Web Match Detail 页面（Knowledge Context Section——Domain/Category → Relevant Entries → 知识关系） + Admin Knowledge Context Panel，三端 build 全部 exit 0，Database/Matching/Scoring/AI 零变更。**588_M23.0.3_Search_Analytics_Foundation COMPLETED**——Backend / Data Capability Foundation，2 new + 4 modified + 1 migration，ConversionEventType 枚举扩展 +4，DiscoveryAnalyticsService 非阻塞事件记录，SearchController 分析钩子，GET /search 响应契约零变更，apps/api build exit 0。**589_M23.0.4_M23.0_Final_Validation COMPLETED**——Architecture Validation / Release Gate Review，M23.0 全量验证通过（10/10 Capability PASS + 6 大架构边界全 PASS + 三端 build 全部 exit 0），M23.0 CLOSED。**590_M23.0_Final_Closeout_And_M23.1_Product_Experience_Roadmap COMPLETED**——Architecture Review / Roadmap Alignment，M23.0 正式关闭，M23.1 路线定义（Product Experience Optimization / Supplier Business Loop / Content Asset Construction），永久边界重申。**581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit COMPLETED**——Architecture Audit / Feasibility Verification，15 项需求评分（12 PASS / 1 PARTIAL / 2 NEED REFACTOR），Product/Offer/Organization/Parameter 全 PASS，SupplierProductSubmission 表设计 + 动态参数筛选 + 四阶段实施路线，零代码变更。**582_Supplier_Capability_Service_Contact_Distribution_Architecture COMPLETED**——Architecture Design / Audit / Future Candidate，SupplierCapabilityContact 模型设计 + 6 种路由机制（A-F）+ 5 路由优先级（行业>区域>能力>轮询>人工）+ 同公司多业务员方案 + 7 测试场景 + 5 ADR，零代码变更。**583_Capability_Discovery_Supplier_Exposure_Governance_Architecture_Audit COMPLETED**——Architecture Audit / Governance Validation，四大架构锁全 PASS，六大治理边界全 PASS，Search Discovery 扩展性验证通过，4 个 P2 Gap 识别，零代码变更。**584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture COMPLETED**——Architecture Audit / Design Validation，6 ADR（584-001~584-006），7 级路由优先级设计，同公司多业务员公平分配验证，Capability Quota 三级策略，8 测试场景覆盖，零代码变更。**585_Platform_Capability_Governance_Final_Freeze_Audit COMPLETED**——Architecture Final Audit / Governance Freeze，580-584 全量汇总：37 ADR 全部 FROZEN，9/9 治理领域 FROZEN，10/10 测试场景覆盖，零代码变更，580-585 架构治理链完整闭环。**586_M23.1_Platform_Stability_and_Boundary_Verification_Audit COMPLETED**——Architecture Stabilization Audit / Runtime Verification，三端 Build 全部 exit 0（API + Web 51 routes + Admin），Prisma Schema 34 migrations 无变化，六大架构边界全 FROZEN（Product/Supplier/Search/Matching/AI/Future Extension），37 ADR 无漂移，文档与代码一致，零代码变更，M23 Architecture Freeze CONFIRMED，M23.1 Stable Baseline READY。Next Stage: M23.1 Product Experience Optimization | `M23.0 CLOSED`（585 + 586 + 587 + 588 + 589 + 590 + 581 + 582 + 583 + 584 + 585 + 586 COMPLETED——12/12） |
| `M24` | 产品体验优化（Product Experience Optimization） | **587_M24_Product_Experience_Optimization_Architecture_Audit COMPLETED**——Architecture Audit / UX Capability Planning，5 ADR 冻结（ADR-M24-001~005：Product Detail / Discovery / Knowledge Association / Inquiry Conversion / Mobile Discovery），3 阶段路线图（M24.1 Product Experience Foundation / M24.2 Discovery & Conversion Enhancement / M24.3 Advanced Experience），5 大体验域审计（Product Detail B+/Search B+/Knowledge A-/Inquiry B+/Mobile B+），6 大体验边界全 PASS，零代码变更，M24 Buyer Experience Enhancement Defined。**588_M24_Product_Knowledge_Search_Context_Architecture_Finalization COMPLETED**——Architecture Refinement / Decision Finalization，3 架构决策点最终收敛：Product ↔ Knowledge（Option B — ProductCategory→KnowledgeCategory Mapping Table，Deterministic Association，FINALIZED）+ Search Context → Relevant Parameter Filter（Context-Aware + Category Tabs + Coverage Priority + Top N Default，FINALIZED）+ Mobile Filter（Bottom Sheet，Same Semantics as Desktop，FINALIZED），7 ADR（ADR-M24-001~007），7 测试场景覆盖，Parameter Knowledge Boundary FROZEN/DEFERRED to M24.3，M24.1 Entry Gate OPEN，M24 路线图同步完成（M24.1: 7 tasks P0/P1 / M24.2: 8 tasks P0/P1 / M24.3: 4 tasks P2 DEFERRED），零代码变更，Code State = Documentation State = Roadmap State。**589_M24_Product_Knowledge_Mapping_and_Search_Facet_Implementation_Finalization COMPLETED**——Architecture Refinement / Final Decision / Implementation Contract Finalization，3 架构契约最终冻结：ProductCategoryKnowledgeMapping Schema（ADR-M24-008，M:N，knowledgeDomainId NOT STORED，isActive Soft Toggle）+ Search Context Contract（ADR-M24-009，Query-Level，Pagination-Independent，GET /search/context）+ Multi-Category Filter Model（ADR-M24-010，All/Common + Category-Specific，Common Persistent + Category Isolated），3 ADR（ADR-M24-008~010），7 测试场景覆盖，Pagination Invariance 验证，Mobile Semantic Consistency 确认，M24.1 Entry Gate OPEN，M24 路线图无调整，零代码变更，Code State = Documentation State = Roadmap State。**590_M24.1.1_ProductCategoryKnowledgeMapping_Implementation COMPLETED**——Development / Database / API / Admin，Migration 016（product_category_knowledge_mapping），1 新表（ProductCategoryKnowledgeMapping：M:N，@@unique，@@index on productCategoryId/knowledgeCategoryId），6 Admin API endpoints（GET/POST/PATCH/PATCH status/DELETE，ADMIN-only），3 Admin 页面（MappingList + MappingCreate + MappingEdit），10 测试映射 + 6 测试场景全 PASS，三端 build 全部 exit 0，Product/Supplier/Knowledge/Matching/AI 边界全 PASS，Search UNCHANGED，M24.1.2 MERGED into M24.1.1。**591_M24.1.3_Search_Context_API_Implementation COMPLETED**——Development / API / Web，6 files API（dto/search-context.dto.ts + search-context.types.ts + search-context.service.ts + search.controller.ts MODIFIED + search.module.ts MODIFIED + index.ts MODIFIED）+ 1 file Web（lib/api/search.ts MODIFIED——API Contract Only），1 new API endpoint（GET /search/context?q={keyword}，PUBLIC），Query-Level Search Context（pagination-independent，based on full candidate population），10/10 测试场景 PASS，三端 build 全部 exit 0，Database UNCHANGED，Admin UNCHANGED，Supplier/Matching/AI 边界全 PASS。**592_M24.1.4_Relevant_Parameter_Facet_UI_Implementation COMPLETED (Recovery)**——Development / Recovery / API Contract Completion / Frontend Integration，API 3 files（unified-search.dto.ts + search.service.ts + search.controller.ts）+ Web 4 files（lib/api/search.ts + services/search.service.ts + SearchPageContent.tsx + hooks/useFacetFilterState.ts），GET /search 最小 Filter Contract 扩展（category + filters）+ 服务端参数筛选（Same-Param OR / Cross-Param AND / Filter-before-Pagination）+ 前端筛选请求接入触发重查询，End-to-End 14/14 PASS，API MODIFIED（GET /search 最小扩展），Web MODIFIED，Database/Admin/Supplier/Knowledge/Matching UNCHANGED，AI FROZEN，三端 build 全部 exit 0（API tsc/nest build + Web tsc/next build 39 pages）。**593_M24.1.5_Mobile_Discovery_Experience_Finalization COMPLETED**——Development / Mobile Experience Finalization / Validation / Bug Fix，Web 2 files（services/search.service.ts + app/search/SearchPageContent.tsx），验证并收口 592 移动端搜索筛选闭环，修复 2 个真实缺陷（搜索错误吞没 + 筛选状态重复请求），592 Search Filter Contract UNCHANGED，API UNCHANGED，Database/Admin/Supplier/Knowledge/Matching UNCHANGED，AI FROZEN，End-to-End 18/18 PASS，Web tsc exit 0 + next build exit 0（39 pages）。**594_M24.1.6_Product_Related_Knowledge_Discovery COMPLETED**——Development / Product Experience / Knowledge Discovery / Integration，将 Product Category → Knowledge Mapping 能力接入 Product Detail（Product → ProductCategory → ProductCategoryKnowledgeMapping → KnowledgeCategory → KnowledgeEntry → Related Knowledge），API 2 files（products.service.ts 新增 findRelatedKnowledge + products.controller.ts 新增 GET /products/:id/related-knowledge）+ Web 6 files（types/knowledge-base.ts + lib/api/products.ts + services/product.service.ts + components/products/RelatedKnowledge.tsx NEW + ProductDetailContent/Tabs/Nav 集成 knowledge tab），PUBLISHED-only 过滤 + 按 KnowledgeEntry.id 去重 + 稳定排序（mapping sortOrder → publishedAt desc → id）+ 空态 + API 错误降级，Product Detail → Knowledge Detail（/knowledge-base/[slug]）复用现有路由，同一数据/API/业务逻辑适配 Desktop/Mobile，End-to-End 14/14 PASS，Database/Admin/Supplier/Matching/Search UNCHANGED，Knowledge Runtime MINIMAL READ-ONLY EXTENSION，AI FROZEN，API tsc/nest build + Web tsc/next build 全部 exit 0（39 pages）。**595_M24.1.7_Knowledge_Related_Product_Discovery COMPLETED**——Development / Product Experience / Knowledge Discovery / Integration / Validation，将 Knowledge Category → Product Mapping 能力接入 Knowledge Detail（KnowledgeEntry → KnowledgeCategory → ProductCategoryKnowledgeMapping → ProductCategory → Product → Related Products），API 2 files（knowledge.service.ts 新增 findRelatedProducts + knowledge-public.controller.ts 新增 GET /knowledge/public/entries/:slug/related-products）+ Web 5 files（types/knowledge-base.ts 新增 RelatedProductItem + lib/api/knowledge-base.ts + services/knowledge-base.service.ts + components/products/RelatedProducts.tsx NEW + knowledge-base/[slug]/page.tsx 集成相关产品区域），ACTIVE-only 过滤 + 按 Product.id 去重 + 稳定排序（mapping sortOrder → createdAt desc → id）+ 空态 + API 错误降级，Knowledge Detail → Product Detail 复用现有路由，Desktop/Mobile 同一数据/API/业务逻辑，End-to-End 18/18 PASS，Database/Admin/Supplier/Search/Matching UNCHANGED，API MINIMAL READ-ONLY EXTENSION，Knowledge Runtime MINIMAL READ-ONLY EXTENSION，AI FROZEN，API tsc/nest build + Web tsc/next build 全部 exit 0（39 pages）。**596_M24.1.8_Related_Products_And_Compare_Entry COMPLETED**——Development / Product Experience / Discovery / Compare Integration / Validation，Product Detail「相关产品」（Product → ProductCategory → 同分类 ACTIVE 产品，排除当前，稳定排序 createdAt desc → id asc）+ Compare Entry（复用 ProductCard 复选框 + CompareBar + /products/compare?ids=，用户自选 MAX 4），API 2 files（products.service.ts findRelatedProducts + products.controller.ts GET /products/:id/related-products）+ Web 6 files（lib/api/products.ts + services/product.service.ts + RelatedProductsSection.tsx NEW + ProductDetailContent/Tabs/Nav + [slug]/page.tsx），ACTIVE-only + 排除当前 + 稳定排序 + 空态 + 错误降级，Compare 复用现有能力（EXISTS，无新 DB/Runtime），Database/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，API MINIMAL READ-ONLY EXTENSION，AI FROZEN，End-to-End 18/18 PASS，API tsc/nest build + Web tsc/next build 全部 exit 0（39 pages）。**597_M24.1.9_Inquiry_Conversion_Enhancement COMPLETED**——Development / Product Experience / Inquiry Flow Integration / Validation，验证并收口产品发现后的询价转化闭环（Product Detail → Supplier Selection → Inquiry → 既有 RFQ Capability），Inquiry 入口（SupplierInquirySection + InquiryForm + SupplierCapabilityList）+ Inquiry API（POST /inquiries：productId+offerId+organizationId 三键校验 + 供应商组织成员通知）+ 既有 Demand/RFQ/RFQResponse 复用均已存在且边界正确，Related Product / Compare 经 Product Detail 作为规范询价入口，Inquiry = Demand Expression（非 Order/Payment/Marketplace/Supplier Store），供应商选择用户驱动（非 AI，仅 ACTIVE/SUBMITTED Offer），18 项代码路径审计全 PASS，零代码变更，Database/API/Web/Admin/Supplier/Knowledge/Search/Matching UNCHANGED，AI FROZEN，Build UNCHANGED（继承 596 exit 0）。**598_M24.1_Final_Validation_And_Closeout COMPLETED**——Architecture Validation / Regression Audit / Documentation Closure / Milestone Freeze，M24.1 六阶段任务链（592-597）全部 COMPLETED，Capability Closure 7/7 PASS + Architecture Freeze 10/10 PASS + Regression 9/9 PASS，零代码变更，Database UNCHANGED / Migration NONE / API STABLE / Web STABLE / Admin UNCHANGED / Supplier UNCHANGED / Knowledge STABLE / Search STABLE / Matching UNCHANGED / AI FROZEN，M24.1 FINALIZED / Architecture FROZEN / Ready For M24.2 Preparation | `M24.1 CLOSED`（587 + 588 + 589 + 590 + 591 COMPLETED——5/5 + 592 COMPLETED (Recovery) + 593 COMPLETED + 594 COMPLETED + 595 COMPLETED + 596 COMPLETED，M24.1.1 COMPLETED，M24.1.2 MERGED，M24.1.3 COMPLETED，M24.1.4 COMPLETED，M24.1.5 COMPLETED，M24.1.6 COMPLETED，M24.1.7 COMPLETED，M24.1.8 COMPLETED，M24.1.9 COMPLETED，598 COMPLETED，M24.1 FROZEN，599 COMPLETED，600 COMPLETED，601 COMPLETED，602 COMPLETED，603 COMPLETED，604 COMPLETED，605 COMPLETED，M24.2 第一轮目录体验闭环 VALIDATED（601 Tree UI + 602 Parameter Context Filter + 603 Capability Discovery Card + 604 Experience Validation + 605 Final Closeout COMPLETED，M24.2 CLOSED；606_M24.2_Runtime_E2E_Verification COMPLETED（真运行时 E2E 18/18 PASS + Search/Mobile 边界回归 PASS），M24.3 PREPARATION（607 + 608 + 609 COMPLETED，M24.3 Multi Role Agent Test Strategy Completed + 610 COMPLETED，M24.3 Frontend Optimization And Agent Test Instruction Completed + 611 COMPLETED，M24.3 Test Data Lifecycle Finalization Completed + 612 COMPLETED，M24.3 Web Platform Experience Upgrade Completed + 613 COMPLETED，M24.3 Admin Console Experience Upgrade Completed），614 COMPLETED（M24.3.8 Multi Role Agent Runtime Validation——四角色 Agent 运行时验收全部 PASS + E2E 18/18 + RBAC 403 边界 PASS + 运行时问题 0，M24.3 Advanced Experience ACCEPTED），615 COMPLETED（M24.3.9 Final Closeout——M24.3 Advanced Experience CLOSED，Documentation Synchronized），616 COMPLETED（M24.4.1 Current Frontend Visual Audit——M24.4 Experience Refinement READY FOR IMPLEMENTATION），617 COMPLETED（M24.4.2 Homepage Premium Experience Upgrade——首页高级体验升级：Hero 工业品牌化 + VISNDT 品牌组件层 + ProductCard CapabilityLabel + 7 Section 统一 SectionHeader，apps/web build exit 0），618 COMPLETED（M24.4.3 Product Capability Catalog Experience Upgrade——产品中心升级为工业检测能力目录：capability 语义层 + 5 个 capability 组件 + ProductCard 能力化表达 + 产品详情能力档案 + 参数能力表达 + MediaImage 统一接入，apps/web build exit 0），619 COMPLETED（M24.4.4 Workspace SaaS Experience Upgrade——Workspace 由导航入口壳升级为 B2B SaaS 业务工作空间体验：Buyer/Supplier 双角色身份识别 + 业务快照 + 待处理事项 + 快捷操作 + 工作台深链，apps/web build exit 0），620 COMPLETED（M24.4.5 Industrial Operation Console Experience Upgrade——Admin 运营仪表盘深度升级为工业运营中心：PlatformHealthBanner + StatCard + SectionHeader + Tabs 三视图（运营概览/数据图表/最近活动）+ 图表增强（AreaChart/BarChart/PieChart/FunnelChart）+ 状态语义统一（resolveStatusTone）+ 设计系统治理（VISNDT_COLORS/CHART_PALETTE），apps/admin build exit 0），621 COMPLETED（M24.4.6 Experience Gap Closure Audit——全站体验差距审计：14 Web + 27 Admin 页面逐页审计，Web 8/10 + Admin 5.75/10，0 Level A + 3 Level B + 4 Level C 差距，决策 M24.4 FINAL EXPERIENCE CLOSURE REQUIRED，Code UNCHANGED，Audit Only），622 COMPLETED（M24.4.7 Admin Industrial Operation System Expansion——M24.4 FINAL EXPERIENCE CLOSURE 首环，落地 621 B1 高优先级差距：apps/admin 工业运营系统扩散，17 个 List/Detail 页 `resolveStatusTone` 误用收敛为 `StatusTag` 语义化组件（清除 'neutral'/'primary'/'violet' 非法 antd Tag 色 + DemandDetail 未定义 MATCH_STATUS_COLOR/RFQ_STATUS_COLOR 隐患）+ 散落硬编码色收敛到 VISNDT_COLORS.success/warning/error/primary + AuditIntelligence/BusinessAnalytics 遗留字符串字面量修复，Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/admin build exit 0），623 COMPLETED（M24.4.8 Web State Consistency And Error Boundary——M24.4 FINAL EXPERIENCE CLOSURE 次环，落地 621 B2/B3 中优先级差距：apps/web 状态系统一致性收口，EmptyState 收敛（knowledge/solutions 内联空态→统一 EmptyState）+ ErrorState 收敛（search 内联错误块→统一 ErrorState，enhanced action 兜底导航）+ 页面级 Error Boundary 补齐（login/register/workspace/dashboard 新增 loading.tsx + error.tsx + 共享 PageErrorBoundary 复用组件）+ Loading 收敛（workspace 根内联「加载中」→ 统一 Loading），Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/web build exit 0（39 static pages），Next: Final Experience Regression Audit），624 COMPLETED（M24.4.9 Final Experience Regression Audit——M24.4 FINAL EXPERIENCE ACCEPTED：Audit Only，Code UNCHANGED，全前端接受度审计（14 Web + 27 Admin 页面回归验证），Web 8.5/10 > 8.5 门槛 ✓ + Admin 8.0/10 > 8.0 门槛 ✓，621 三项 Level B gap 全部收敛（B1 Admin 工业风格扩散 / B2 空错状态一致性 / B3 客户端 error boundary），0 Level A + 0 Level B + 4 Level C（C1 SectionHeader 使用率 / C2 列表分页 / C3 登录注册表单细节 / C4 dashboard emoji 图标），M24.4 ACCEPTED / Ready For M24.5，Database/Schema/Migration/API/Auth/RBAC/Matching/Search/AI 全部 UNCHANGED）。625_M24.5.0_Full_Product_Experience_Audit COMPLETED——Audit Only（Code UNCHANGED），四端审计（Web/Workspace/Admin/媒体）CONDITIONAL PASS，25+ 项问题（P0 1 / P1 5 / P2 5），媒体系统 4.5/10，输出 M24.5.1/2/3 演进路线；626_M24.5.0_Product_Experience_Architecture_Decision COMPLETED——Architecture Decision（Zero-Code）EVOLVE COMMERCIAL JOURNEY，将 Product→Inquiry 升级为 Content→Solution→Product→Supplier→Demand→Matching，Frontend First / Existing API Reuse / No Backend Expansion，冻结四项禁止（无 DB/API/Matching/AI），零代码变更；627_M24.5.1_Web_Commercial_Experience_Foundation COMPLETED——apps/web 商业详情体验基础（M24.5 Web 收口首环）：Detail Template 演进基础（Product/Solution/Knowledge/Supplier 增量演进）+ 7 个商业关联/CTA 组件（relation/ RelatedContentSection+RelatedProducts+RelatedSolutions+RelatedKnowledge、conversion/ DemandCTA+InquiryCTA、commercial/ SupplierCapability）+ 转化 CTA 路径接入四详情页，复用既有公开只读 API（GET /products、GET /content/public）+ 前端确定性排序 + 空态 + 错误降级，5 文件修改 + 3 新增组件目录（apps/web only），Database/API/Matching/Search/AI/RBAC 全部 UNCHANGED，apps/web npm run build exit 0（40 static pages）+ 真运行时 6 路由 HTTP 200 + 响应式覆盖，628_M24.5.2_Admin_Operation_Center_Evolution COMPLETED——apps/admin 运营中心体验演进（M24.5 Admin 收口，CRUD Management → Admin Operation Center，体验层先行，Operation Center Decision 落地）：新增运营聚合服务 operationService（复用现有 API 组合：dashboard/product/content/organization/demand/rfq/offer/inquiry，实现状态分组统计 + 运营待办队列 + 快捷筛选依据，零运营专用端点，单域失败静默降级）+ 新增运营组件层 components/operation-center/（OperationSectionHeader + StatusGroupPanel + OperationQueueCard + DomainEntryCard，遵循既有 VISNDT_COLORS + StatusTag 设计系统）+ 新增 OperationCenter 页面（Tabs 五视图：运营总览 / 产品运营 / 内容运营 / 供应商运营 / 商业运营，四域运营视图 + 运营待办队列 + 状态分组 + 快捷筛选 + 数据完整度/SEO 提示 + 快捷导航），接入路由 /operation-center + 菜单「运营中心」+ 面包屑映射，修改 5 文件 + 新增 8 文件（apps/admin only，含 4 个运营组件 + operationService + 类型 + 页面），Database/API/RBAC/Matching/Search/AI 全部 UNCHANGED，apps/admin npm run build exit 0 + 真运行时 /operation-center HTTP 200，629_M24.5.3_Media_System_Architecture_Review COMPLETED——Architecture Review / Audit Only（Code UNCHANGED），Media Asset 体系专项架构审查（为是否进入 Media Schema Evolution Proposal 提供正式依据）：审计 FileAsset（entityType/entityId 语义不一致 + 无 organizationId）+ ProductMedia + ContentMedia + 存储关系（S3 Compatible）+ admin/web 使用边界，9 维能力评估（Ownership GAP / Org Isolation GAP / Classification PARTIAL / Lifecycle GAP / Soft Delete GAP / Version GAP / Permission PARTIAL / Operational Search GAP / Content Reuse PARTIAL），Decision B — FUTURE EVOLUTION REQUIRED（Implementation Deferred，需先产出 Media Schema Evolution Proposal），定义 Phase 1（Ownership Isolation / Lifecycle / Soft Delete / Folder+Tag）+ Phase 2（Version / Rollback / Advanced Permission），Database/API/Frontend 全 UNCHANGED，冻结模块全验证 UNCHANGED，630_M24.5.4_Commercial_Relation_Enhancement_Architecture_Preparation COMPLETED——Architecture Decision / Audit Only（Code UNCHANGED），627 商业关联体系架构预研：审查当前关联架构（relation 四组件 Props 注入），数据源矩阵（Product↔Knowledge backend managed / Product→Product backend managed / Solution+Content-KNOWLEDGE frontend deterministic），**Decision C — HYBRID EVOLUTION**，结论 Product↔Solution = FUTURE REQUIRED / Knowledge↔Product = ALREADY ESTABLISHED / Parameter driven = FUTURE CAPABILITY / Admin Relation Center = M24.5 不实施，**Implementation DEFERRED**（不新增 Relation Model，保留确定性混合策略，无 AI Semantic），Database/API/Frontend/Admin/Matching/Search/AI 全 UNCHANGED，630_M24.5.5_Web_Login_Accessibility_Review_And_Closeout COMPLETED——Web 登录可访问性审查收口（非代码 Bug）：根因=API(:4000) 未运行 + buyer@visndt.com/supplier@visndt.com 账号不存在（真实演示账号为 demo.*@visndt.local/demo123456），按用户指定凭据补建数据库演示账号（2 组织 VISNDT 采购方企业 BUYER / VISNDT 供应商企业 SUPPLIER + 2 用户 + 2 成员关系，bcrypt admin123456，单事务幂等 INSERT，Schema 未变），验证 buyer@visndt.com→BUYER / supplier@visndt.com→SUPPLIER 登录均 HTTP 201 成功，代码/API/前端/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，Next: M24.5 继续演进，630_M24.5.6_UI_Design_Screenshot_Comparison_Review COMPLETED——UI 设计稿对比审查（Only Read / Visual Audit，Code UNCHANGED），以 docs/_design/前端网页截图/ 33 张设计稿为基准评估本轮 UI 优化：初轮对比时 API(:4000) 误判（IPv6 监听致 Test-NetConnection IPv4 探测失败），列表页（产品/方案/知识）呈空态与设计稿满页无法等价对比，经 A+C 两阶段复核——A 阶段确认数据链路全程在线（产品 6/方案 4/知识 5/内容 15/用户 12/组织 10/分类 12/参数 45/RFQ 11），数据化后产品中心"共 6 项检测能力"+解决方案 4 卡片+知识中心 5 卡片全量实体呈现且与设计稿字段一一对应；C 阶段以 admin@visndt.com 登录 Admin 采集 10+ 运营页面均实现运营中心风格（统计卡+筛选+表格+分页）与设计稿结构对齐且能力范围超出设计稿，最终结论 PASS（原"直观无改进"观感根因为数据链路未就绪而非 UI 缺陷），Database/API/Frontend/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，，631_M24.5.7_Platformization_Gap_Audit COMPLETED——Audit Only（Code UNCHANGED），平台化差距审计：以「平台化」为基准诊断 Web+Admin 双端设计系统，9 项差距（G1 双端设计系统割裂 / G2 Web 无图标库 emoji 77 处 / G3 Web 缺原子 UI 组件层 / G4 双端 primary 不一致 #3b82f6 vs #2563eb / G5 SectionHeader 三套实现 / G6 分页仅 3 文件 / G7 登录表单 / G8 信息架构 / G9 媒体资产 629 Decision B），结论 CONDITIONAL PASS（平台化尚未达标），输出 M24.6 平台化 Design System 八阶段演进路线，Database/API/Frontend/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，落盘 V3.2.3 执行指令，Next: M24.6 继续演进）。632_M24.6.0_Design_System_Architecture_Decision COMPLETED——Architecture Decision（Decide Only，Code UNCHANGED），承接 631 九项差距定稿三项决策：D1 共享 JSON token 单一事实源（packages/design-tokens/tokens.json，Web 生成 CSS 变量 + Admin 薄适配层）/ D2 Web 采用 lucide-react 替换 77 处 emoji（Admin 保留 @ant-design/icons）/ D3 Web 自建 ui/ 原子层（Button/Input/Card/Badge/Tag/Table/Pagination/Empty/Loading/Error），收敛 primary #3b82f6→#2563eb（G4 解决），Database/API/Web/Admin/Matching/Search/AI/RBAC 全部 UNCHANGED，零代码变更。Next: M24.6.1 跨端 Design Token 统一）。633_M24.7_STEP0_Role_Centric_Functional_Audit COMPLETED——Audit Only（Code UNCHANGED），角色视角功能完备性+媒体分步审计，Web+Admin 三角色 字段/编号/ID/功能/数据，P0×2（W1 产品 id/slug 双口径、A2 媒体中心纯导航壳）+P1×5，媒体分步：零迁移可做展示/筛选/供应商派生，需改库为隔离落列/规格书细分/生命周期/软删/版本，CONDITIONAL PASS。634_M24.7_Database_Status_And_Media_Evolution_Options COMPLETED——Review Only（零迁移），数据库现状 34 model 合理性评估为合理，短板集中媒体资产域，三选项（零迁移派生/最小迁移/完整演进），待授权 B.2。635_M24.7_B1_Media_Center_Frontend_Closure COMPLETED——媒体中心前端收口（零迁移 B.1）：统一媒体中心从「纯导航壳」升级为文件资产统一视图（GET /files 只读聚合 API + MediaList 页面 + 按文件类型/所属实体/供应商派生过滤 + 搜索 + 分页 + 下载 + 孤立清理入口），供应商隔离经 uploadedBy→User→Organization 只读派生（不落列不加表），FileType 复用现有枚举（IMAGE/DOCUMENT/CERTIFICATE/OTHER），SPEC_SHEET/ILLUSTRATION 归 B.2 改库门禁，Database/Schema/Migration UNCHANGED，apps/api + apps/admin build exit 0，端到端 /media 页面验证 PASS。636_M24.7_B2_Media_Schema_Evolution_Gate COMPLETED——媒体 Schema 最小迁移门禁（提案 + 迁移脚本 + 回填 + 回滚，PENDING APPROVAL）：仅扩展 FileAsset 域（FileType +SPEC_SHEET/ILLUSTRATION + 新增 FileAssetStatus + organizationId/status/deletedAt 落列 + 3 索引 + Organization 反向关系 onDelete SetNull），不加表、不动 Product/Matching/Search/AI/RBAC，冻结域合规自检全 PASS，纯增量可无损回滚。637_M24.7_B2_Media_Schema_Migration_Closure COMPLETED——媒体 Schema 最小迁移收口（迁移执行 + 回填 + 下游三端同步 + 构建验证）：FileType 六分类（+SPEC_SHEET 规格书/ILLUSTRATION 插图）+ FileAssetStatus 枚举 + organizationId/status/deletedAt 落列并迁移应用（DB 实测 14 列），API findAll 直列 organizationId 过滤 + 默认排除已删 + upload 回填 organizationId，admin file-utils/types/MediaList 分开管理视图（图片/文档/资质/规格书/插图 + 供应商 + 状态标签），web ProductMedia.mediaType 同步，@prisma/client 对齐 5.22.0，三端 build 全部 exit 0，Migration 1 新增（纯增量），Matching/Search/AI/RBAC 全 UNCHANGED。Next: C.1 编号/ID/字段规范化（零迁移前端修正）） |

| `M25` | 平台化重建与自运转基座（Platform Reconstruction & Self-Run Foundation） | **M25.0 Project Baseline Freeze（639 COMPLETED）**——Architecture Freeze / Documentation / Baseline Decision（Code UNCHANGED）：638_M25_Project_Audit ACCEPTED（21 项缺口 P0×3 / P1×13 / P2×5 作为 Scope 依据）+ 638_M25_AI_Operation_Architecture ACCEPTED（L0 规则引擎纳入 M25.5），M25 Boundary Decision（六阶段 639-644 Scope 冻结，禁止 UI/模型/API/DB/AI/Matching/Search 修改），Database/API/Frontend/Admin/Matching/Search/AI 全部 UNCHANGED，Documentation UPDATED。**M25.1 Design System Reconstruction（640 CONDITIONAL PASS）**——Design System Foundation v1.0 代码侧完成并验证：新建 `@visndt/design-tokens`（Token 8 域：Color primary 统一 `#2563eb` / Typography / Spacing / Radius / Shadow / Border / Motion / Status + STATUS_TONE + resolveStatusTone，解决 G4）+ 新建 `@visndt/design-system`（12 Primitives：Button/Input/Card/Badge/Tag/SectionHeader/Pagination/EmptyState/LoadingState/StatusDisplay/IconWrapper/LayoutContainer，解决 G3/G5）+ Icon System（`apps/web/src/lib/ui-icon.tsx` lucide-react 16 语义图标经 IconWrapper，替换 13 文件 emoji UI，解决 G2）+ Web Migration（next.config transpilePackages）+ Admin Alignment（`apps/admin` tokens.ts 委托共享 design-tokens 单一事实源）；Figma Skill ENABLED（Design Authority，未直出代码）但**连接 DEFERRED**（运行环境未接 Figma MCP，官方设计稿逐节点 Visual Diff 押后补做）；Database/API/Matching/Search/AI/Admin Workflow 全部 UNCHANGED，Frontend Component Architecture UPDATED、Business Logic UNCHANGED；四端 build 全部 exit 0（web 39 static pages / admin 5936 modules），Review Report `docs/_review/640_M25.1_VISNDT_Design_System_Reconstruction_Report.md`。**M25.2 Business Identity Number System（641 PASS）**——新建 `@visndt/identity-contract`（三层身份模型 `Database ID(UUID) + Business Identity Number + Human Readable Reference`，编码 `VIS-{PREFIX}-{YYYYMMDD}-{SEQUENCE}`，8 类对象 PRODUCT/DEMAND/RFQ/OFFER/ORGANIZATION/USER/ASSET/CONTENT；DB FROZEN 下 SEQUENCE 由现有 UUID 确定性派生、零迁移零新列、支持显式 sequence 预留）+ design-system 新增统一 `BusinessIdentityBadge`（tag/plain/compact + 实体中文名 + 点击复制 + 悬停说明，继承 640，未新增 Button/Badge/Tag/Color Token）+ Web 接入（RFQList/RFQDetail/DemandList）+ Admin 6 Detail 管理视图（Inquiry/Rfq/Demand/Product/Organization/Offer）替换原生 UUID；Database/API/Matching/Search/AI/Admin Workflow 全部 UNCHANGED；identity-contract/design-system/web/admin build 均 exit 0；Review Report `docs/_review/641_M25.2_Business_Identity_Number_System_Report.md`。**M25.3 Workflow Visualization（642 PASS）**——基于既有业务状态的 Visualization Layer（非 Workflow Engine）：design-system 新增 `StatusPresentationContract`（`workflow/status-presentation.ts` 统一「业务状态→UI 表达」确定性映射 label/tone/progress/nextAction，覆盖既有 RFQ/Demand/Match/RFQResponse 枚举不重新定义，语义色调复用 640）+ Workflow Components（`WorkflowTimeline` 垂直时间线 + `WorkflowStep` 三态节点 + `StatusProgress` 水平阶段进度 + `MatchExplanationCard` 匹配 ID/Identity/置信度/因子不重算评分 + `NextActionHint` 下一步提示不触发变更，继承 640 token、复用 BusinessIdentityBadge/StatusDisplay）；RFQ 六阶段业务时间线、Demand 四阶段业务时间线由既有状态+既有时间字段确定性推导（未引入新事件系统）；Web 接入 P0 RFQ/Demand Detail（Identity+Timeline+NextActionHint）、P1 Match Result（MatchExplanationCard）、P2 Workspace（业务流转呈现 Process Overview）；Admin RfqDetail/DemandDetail 增加 Status Timeline Preview + Identity Reference（Visualization Only，后台流程 UNCHANGED）；Identity Integration UPDATED（复用 641 契约，未扩展身份类型）；Database/API/Matching/Search/AI/Admin Workflow 全部 UNCHANGED，Frontend Web + Admin 仅 Visualization Layer UPDATED；identity-contract/design-system/web/admin build 均 exit 0；Review Report `docs/_review/642_M25.3_Workflow_Visualization_Report.md`。**M25.4 Media Governance Completion（643 PASS）**——基于既有 FileAsset 的治理可视化（Media Governance Foundation v1.0，未创建新媒体架构）：design-system 新增 `MediaStatusPresentationContract`（`media/media-presentation.ts` 统一「既有 FileAsset → 治理展示」确定性映射 label/tone/description/governanceHint，四类 **UI Governance State** 非 DB Enum：Active 正常引用 / Unused 未引用 / Incomplete 缺少信息 / Legacy 历史资源，`deriveMediaGovernanceState` 仅由既有字段派生不写库，语义色调复用 640）+ Media Governance Components（`MediaGovernanceBadge` 复用 StatusDisplay；`MediaFileCard` 复用 Card：Asset Business Identity（641 ASSET）+ File Info（名称/MIME/大小）+ Usage Reference（产品/内容引用）+ Lifecycle + Governance Hint，纯展示不触发删除/迁移；`MediaLifecycleTimeline` 复用 642 WorkflowTimeline，生命周期 Created→Referenced→Displayed→Maintained→ArchivedCandidate 为 Presentation State 非数据库状态机）；Admin MediaList 升级为媒体治理视图（治理汇总 active/unused/incomplete/legacy 计数 + 治理列 + 资产编号列 BusinessIdentityBadge type=ASSET + 行展开 MediaFileCard，仅 Observe/Review/Manage Visibility、不自动清理、不触达存储）；Web `components/content/MediaGallery.tsx` 统一媒体元信息展示（图注 + Asset Identity + 附件 MIME 标签），覆盖自 Content 映射的 Product/Knowledge/Solution/Public Content 媒体画廊；Identity Integration UPDATED（复用既有 ASSET 类型，未新增身份类型）；Database/API/Storage/Matching/Search/AI/Admin Workflow 全部 UNCHANGED，Frontend Web + Admin 仅 Governance/Visualization Layer UPDATED；design-system/web/admin build 均 exit 0；Review Report `docs/_review/643_M25.4_VISNDT_Media_Governance_Completion_Report.md`。**M25.5 L0 Rule Engine Foundation（644 COMPLETED）**——确定性规则评估契约（非 AI Automation）：新建 `@visndt/rule-engine-contract`（Rule Definition/RuleResult + Evaluation Framework + Scheduler Boundary Contract + Completeness Check + Notification Contract，纯 TS，仅复用 641 identity-contract，`IF condition THEN result` 只读、不持久化业务决策、无 AI/无自动行为）+ design-system 新增 `RuleResultDisplay`（复用 640 StatusDisplay + 641 BusinessIdentityBadge）+ Admin MediaList 增加 L0 媒体完整性运营透视（汇总 + 首条未通过项提示，只读不自动修复）；Database/API/Migration/Matching/Search/AI/Storage 全部 UNCHANGED，禁止范围（apps/api/prisma/migration/storage/event bus/queue/worker）零触碰；rule-engine-contract/design-system/web/admin build 均 exit 0；Review Report `docs/_review/644_M25.5_VISNDT_L0_Rule_Engine_Foundation_Report.md`。**645_M25_Final_Closeout COMPLETED**——M25 收口（Audit Only，零代码变更）：639-644 六阶段全部交付闭环 + M25 Completion Evidence + 架构最终核验全 PASS（Database/API/Matching/Search/Storage/AI UNCHANGED，Frontend/Admin VERIFIED）+ 文档同步 + M26 Entry Boundary Defined，M25 Productization Foundation = COMPLETED，M25 CLOSED / M26 Development Baseline READY；Review Report `docs/_review/645_M25_Final_Closeout_Report.md`。**646.1_Release_Validation_Patch COMPLETED**——M25 Closeout Validation / M26 Entry Preparation 补丁（Release Validation Patch，非功能开发）：修复 646 测试确认的 D1（`getMe()` 区分 401 与网络异常，AuthProvider 新增 `authError`+`retryAuth`，dashboard/workspace 增加“认证服务暂不可用 + 重新连接”错误态，不再误判“角色未配置”）与 D2（Admin 角色 Web 端展示“请使用管理控制台”+“前往 Admin Console”引导，`NEXT_PUBLIC_ADMIN_CONSOLE_URL` ?? `http://localhost:3001`）；仅修改 4 个 Web 展示层文件（auth.service.ts / AuthProvider.tsx / dashboard/page.tsx / workspace/page.tsx），Database/API/Migration/Storage/Matching/Search/AI 全部 UNCHANGED，无新 Package/Token/Identity/Storage/AI；`apps/web` TypeScript 编译 + 类型检查 exit-0 阶段通过（静态生成阶段受 Windows worker/内存环境限制中断，同 644 记录）；Review Report `docs/_review/646.1_Release_Validation_Patch_Report.md`。**647_M26_PreEntry_ThreeRole_E2E_Business_Validation CONDITIONAL PASS**——M26 Entry Validation（E2E 测试 / 功能审计，Testing Only 零代码变更）：真实浏览器操作模拟三核心用户（Buyer/Supplier/Admin）完整业务旅程。Admin A1-A8 VERIFIED（CONDITIONAL）；Buyer B1-B5 VERIFIED；Supplier C1-C5 VERIFIED（CONDITIONAL）；业务闭环 VERIFIED（Admin 可见 Buyer 新建需求「闭环验证-需求-20260822000630」已发布，既有闭环数据 RFQ 11 / Response 11 佐证链路完整；新建需求匹配数为 0 未派发 RFQ 符合冻结语义 RFQ 必须源自 ACCEPTED DemandMatch）。Critical 2 项（D3 产品媒体页崩溃——前端期待 `{data,total}` vs 后端返回数组；D4 S3 bucket `visndt-dev` 缺失致媒体上传失败、FileAsset Governance 未恢复）+ UX 3 项（D1 用户编辑姓名未回填 / D2 产品编辑参数未回显 / D5 Supplier Profile 保存后 UI 刷新不一致）。Database/API/Migration/Storage/Matching/Search/AI 全部 UNCHANGED；Next：M26.0 Fix Window（D3/D4 + D1/D2）与 Playwright E2E 体系建议；Review Report `docs/_review/647_M26_PreEntry_ThreeRole_E2E_Business_Validation_Report.md`。**648_M26.0_Fix_Window_Core_Stability PASS**——M26 Entry Stabilization（Bug Fix / Validation Patch / Release Readiness，最小稳定性恢复）：D1 User Edit FIXED（UserEdit.tsx name 回填）+ D2 Product Parameter FIXED（ProductForm.tsx productParameterService.list + name={def.id} 回显）+ D3 Product Media FIXED（ProductMediaListResponse 对齐一维数组，ProductMediaList.tsx result.length 判空 + mediaStats 出分支空安全，无 undefined.length 崩溃）+ D4 Storage Upload RECOVERED（StorageService OnModuleInit 幂等 HeadBucket/CreateBucket 初始化，bucket visndt-dev，上传链路 PASS）+ D5 Supplier Profile FIXED（setQueryData + invalidateQueries 保存后即时刷新）+ Playwright E2E 边界脚手架（tests/e2e/{admin,buyer,supplier}/login.spec.ts + business-loop.spec.ts，仅边界准备不引入测试框架）；Database/Migration NONE，API 业务契约 UNCHANGED，Matching/Search/AI UNCHANGED，Storage RECOVERED；Admin/Web/API pnpm build 全部 exit 0，三角色回归通过；Review Report `docs/_review/648_M26.0_Fix_Window_Core_Stability_Report.md`；Next：M26 Development Baseline。 | `M25 CLOSED`（M25.0 COMPLETED，M25.1 CONDITIONAL PASS（Figma 视觉 diff 待接入后补做），M25.2 COMPLETED，M25.3 COMPLETED，M25.4 COMPLETED，M25.5 COMPLETED，645_M25_Final_Closeout COMPLETED，646_Three_Role_Functional_Test CONDITIONAL PASS，646.1_Release_Validation_Patch COMPLETED，647_M26_PreEntry_ThreeRole_E2E_Business_Validation CONDITIONAL PASS（Critical D3/D4 待 M26.0 修复窗口）→ 648_M26.0_Fix_Window_Core_Stability PASS（D1-D5 FIXED / Storage RECOVERED，M26 Development Baseline READY）——M25 Productization Foundation Complete + Release Validation Patch，M26 Development Baseline READY） | 路线：M25.0 Baseline Freeze（COMPLETED）→ M25.1 Design System Reconstruction（640 Design Token / Component Library / Web UI Foundation / Admin Alignment，Figma Skill ENABLE HERE，CONDITIONAL PASS）→ M25.2 Business Identity Number System（641 Business Code / Entity Identity / Operational Reference：Product/Demand/RFQ/Offer/Organization，COMPLETED）→ M25.3 Workflow Visualization（642 RFQ Timeline / Match Explanation / Status Visibility，COMPLETED）→ M25.4 Media Governance Completion（643 Media Lifecycle UI / Asset Operation View，COMPLETED）→ M25.5 L0 Rule Engine Foundation（644 ——确定性规则评估契约：Scheduler Boundary Contract / Completeness Check / Notification Contract，No AI / No Schema Change）→ 645_M25_Final_Closeout（M25 Productization Foundation Complete，M25 CLOSED）→ 646_Three_Role_Functional_Test（三角色功能测试，API 层 PASS / UI 层待人工补测）→ 646.1_Release_Validation_Patch（D1/D2 修复，M25 CLOSED 保持）→ M26 Entry Validation；冻结边界全程保持（Database/API/Matching/Search/AI/Storage FROZEN，M25.5 为确定性规则引擎，646.1 为 Web 展示层补丁） |
| `M26` | M26 运营体验审计与优化启动（Operational Experience Audit & Optimization Kickoff） | **649_M26_Operational_Experience_Audit CONDITIONAL PASS**——基于 648 修复后的稳定基线，通过 Trae Browser Automation 对 VISNDT 平台进行真实浏览器三角色（Admin/Buyer/Supplier）运营体验走查。Runtime Verification 全 PASS（PostgreSQL/MinIO/API/Web/Admin 全部 RUNNING，环境修复 `.env` 中 `DATABASE_URL` 由 `localhost` 改为 `127.0.0.1` 解决 Windows IPv6 Prisma P1001 错误）。Admin 旅程 VERIFIED（登录→仪表盘→产品管理→用户管理→需求管理→RFQ管理）；Buyer 旅程 CONDITIONAL（登录后重定向到空白 `/workspace/dashboard`，需手动跳转至 `/dashboard/buyer`；首页/工作台/产品中心闭环）；Supplier 旅程 VERIFIED（工作台/RFQ列表/企业资料页）。24 项 UX 问题（4 High / 12 Medium / 8 Low）已转化为 18 项 M26 优化 Backlog（P0×4：FB1 全界面中文化 / FB2 Buyer 登录重定向修复 / FB3 业务编号体系 / FB4 术语统一；P1×8：FB5-FB12 数据展示修复；P2×6：FB13-FB18 格式统一/IA 收敛/Web 内存优化）。业务闭环 VERIFIED（产品发现→需求创建→Demand→RFQ→供应商响应→通知触达）。Database/API/Migration/Storage/Matching/Search/AI 全部 UNCHANGED（审计只读，仅 `.env` 配置修复除外）。Review Report `docs/_review/649_M26_Operational_Experience_Audit_Report.md`。Next：M26 Optimization Planning（优先处理 P0：FB1-FB4），建议建立 Playwright E2E 回归自动化。**650_M26_Optimization_Roadmap_And_Priority_Planning PASS**——M26 Optimization Planning（Audit / Architecture Planning / Roadmap Refinement，零代码变更）：将 649 的 24 项 Findings（A×10/B×9/S×5/C×3）重新分类为 P0×4（User Blocking）/ P1×8（Operation Efficiency）/ P2×6（Product Experience）/ Future×8（延期）。18 项优化全部 Frontend Only 或工程配置，零 Database/API/Business Logic 变更。UUID 治理采用**方案 A（Frontend Format Layer）**，复用 `@visndt/identity-contract`（641 已交付），方案 B（Database Business Number Field）REJECTED（违反 Database Freeze），方案 C（统一 Identifier Service）DEFERRED。M26.1 Foundation Experience Stabilization（4 项 P0：中文化 / 登录重定向 / UUID 治理 / 术语统一）/ M26.2 Operation Efficiency Improvement（8 项 P1：Admin 数据/RFQ/角色列 / 参数单位 / Buyer/Supplier 工作台 / Supplier RFQ 响应入口）/ M26.3 Product Experience Enhancement（7 项 P2：格式统一 / IA 收敛 / 内存优化 / 请求优化 / Final Regression Audit）/ Future Candidate（8 项：AI 推荐 / 自动报价 / 高级分析 / 在线交易 / CRM / DB Business Number Field / Supplier 多轮谈判 / Figma 视觉 Diff）。业务闭环 UNCHANGED（Demand→DemandMatch→RFQ→RFQResponse→Notification）。Architecture Impact：Database/API/Migration/Storage/Matching/Search/AI 全部 UNCHANGED，零代码变更，零 Migration，零 ADR 评审。Review Report `docs/_review/650_M26_Optimization_Roadmap_And_Priority_Planning_Report.md`。Next：M26 Optimization Implementation Planning（进入 M26.1 P0 Optimization 实施：FB1-FB4）。 | `M26 Optimization Discovery + Planning`（649 CONDITIONAL PASS + 650 PASS——三角色运营体验走查 + 优化路线图冻结，M26.1/M26.2/M26.3 实施边界 READY） | 路线：649_Operational_Experience_Audit（COMPLETED / CONDITIONAL PASS，三角色真实浏览器走查 + Backlog 输出）→ 650_M26_Optimization_Roadmap_And_Priority_Planning（COMPLETED / PASS，P0/P1/P2/Future 分类 + 实施边界冻结 + UUID 治理方案 A 决策）→ 651_M26.1_P0_User_Blocking_Optimization_Implementation（COMPLETED / PASS，FB1 中文化 + FB2 登录重定向 + FB3 UUID 治理 + FB4 术语统一，17 文件，identity-contract 扩展 RFQ_RESPONSE 类型）→ M26.2 P1 Data Display Fixes（FB5-FB12）→ M26.3 P2 Polish（FB13-FB18，653 COMPLETED / PASS）→ M26.3 Extension Content Center IA Optimization（653.1 COMPLETED / PASS——Admin 运营型 IA 收敛 + 内容中心结构冻结 + 媒体中心隐藏一级入口为 M27 Media Asset 扩展备用，仅改 AdminLayout.tsx，Admin build exit 0，Database/API/Business Logic/RFQ/RFQResponse/Matching/Search/AI 全 UNCHANGED，Migration NONE）→ M26.4 Commercial Closure Enhancement（654 COMPLETED / PASS——Buyer 响应审核页中文化补齐：状态/决策按钮/审核面板/字段标签 → 中文，询价请求术语统一；Admin RfqList 需求列新增 Demand 编号 Identity 强化 Demand↔RFQ 商业联动展示；Supplier 商用闭环（RFQ 机会→查看需求→提交响应→查看状态）已完备；仅 4 个前端展示文件，Web/Admin build exit 0，RFQ/RFQResponse = Existing Flow / Reuse Only，Database/API/Business Logic/Matching/Search/AI 全 UNCHANGED，Migration NONE）→ M27.0 Content Architecture Foundation（655 COMPLETED / AUDIT COMPLETE——审计发现 Content/Knowledge/SEO 体系已在 012→016 迁移系列端到端存在：Content/ContentTag/ContentMedia/ContentRevision/Knowledge*/ProductCategoryKnowledgeMapping + ContentController(发布工作流)+Knowledge/ContentTag API + Admin CMS + Web 公开渲染(/knowledge /articles /insights /solutions /knowledge-base /tags)+SEO(sitemap/generateMetadata/JSON-LD)；唯一明确缺口 robots.ts。M27 定位修正为「收口与补全」，非绿地建设；本次零代码变更，Migration NONE）→ M27.1 Content Center Implementation（定位：Content/Knowledge/SEO 既有体系收口与补全，须先定边界再编码；**656.1_M27.1_Content_Knowledge_Boundary_Decision_Audit COMPLETED / PASS——架构边界冻结：Content=运营传播资产(ARTICLE/SOLUTION/INSIGHT)、KnowledgeEntry=专业知识资产(Technical Knowledge/Inspection Method/Application Case 由 KnowledgeCategory 承载)，Content.type=KNOWLEDGE 进入废弃路线（保留枚举、语义废弃、本期不迁移不 Redirect），权威知识入口= /knowledge-base（/knowledge 随 Content 型知识废弃不再作知识权威），URL 收敛归 M27.3（迁移后 301），Schema Impact = 零变更（UNCHANGED / Decision Only）**→ 656.2_M27.1_Content_Foundation_Enhancement_Implementation **COMPLETED / PASS**（Content Foundation 低风险增强，仅前端展示层零后端变更：SEO 基础补全——新增 robots.ts 补齐 655 缺口 + 新增 lib/seo-config.ts 统一 buildPageMetadata 规则层 + sitemap.ts 补 changeFrequency/priority；Content 统一列表体验——新增 ContentListLayout 共享组件，/articles /solutions /insights 三页统一重构 + 空态收敛 EmptyState；Admin 内容体验——ContentList SEO 列 Tooltip 展开预览；Database/API/Knowledge Model/RFQ/RFQResponse/Business Logic 全 UNCHANGED，Admin IA FROZEN，Media Center/AI Runtime DEFERRED，Migration NONE，web tsc+next build 41 页（含 robots.txt/sitemap.xml）与 admin build 均 exit 0））；**657_M27.2_Content_Operation_Experience_Optimization COMPLETED / PASS——Admin 内容运营体验（仅前端展示层零后端变更）：新增 ContentHealthIndicator 组件 + computeContentHealth（四信号加权 SEO 40%/封面 30%/标签 15%/发布就绪 15%），ContentList 新增健康度列（星级+健康/待补全/需处理标签+Tooltip 明细）+ 发布时间列定时发布展示；产品关联按既有 API 审计无字段/端点，记 Future Candidate 未新增 API；Database/API/Knowledge Model/RFQ/RFQResponse/Matching/Business Logic 全 UNCHANGED，Admin IA FROZEN，Migration NONE，web next build 41 页与 admin build（5941 modules）均 exit 0**）；**658_M27.3_Knowledge_Consolidation COMPLETED / PASS——Knowledge 专业知识资产中心收敛（Architecture Audit + 受控前端增强，零后端/Schema/API 变更）：审计确认 KnowledgeEntry 由 Domain+Category+structuredBody+Relation 承载类型（无 knowledgeType 字段），已满足专业知识资产中心定位；Content.type=KNOWLEDGE 保持 KEEP ENUM / NO NEW DATA / NO MIGRATION（仅展示层收敛）；/knowledge-base 首页 metadata 统一 buildPageMetadata + Hero 升级「工业检测知识中心」+ Knowledge Center 眉标、领域页新增 BreadcrumbList JSON-LD + 统一 metadata、详页与 error 页 Breadcrumb 文案「知识库」→「知识中心」，SEO metadata/canonical/breadcrumb/JSON-LD/sitemap 全收敛；Database UNCHANGED（0 Schema / 0 Migration）、API UNCHANGED、Knowledge Model UNCHANGED、Admin IA FROZEN、Media Center/AI Runtime DEFERRED，web next build exit 0（41 页）**）；**659_M28.0_Product_Ownership_And_Supplier_Capability_Model_Audit COMPLETED / PASS——M28 Platform Productization Readiness（Audit Only，零代码变更）：确认 Product Ownership = 平台全球目录（Prisma Product 无 organizationId/ownerId，仅 Admin 经 POST /products 创建，createdById 为审计字段）；Supplier Capability = Product + Supplier Offer 模型（Model B：Offer.organizationId+productId @@unique，供应商经 workspace 对既有目录产品创建 Offer，组织身份服务端派生 user.organizationId）；买家端能力经 ProductDetail suppliers tab（SupplierCapabilityList）+ ManufacturerInfo（取首个 ACTIVE/SUBMITTED offer 的 organization）+ /suppliers/:id 表达；Database/API/Frontend/Business Logic 全 UNCHANGED（Audit Only），按指令不生成报告文档**）；冻结边界全程保持（Database/API/Matching/Search/AI/Storage FROZEN，审计与规划只读，.env 配置修复除外） |

## Stage Interpretation

### M0-M10

这是 VISNDT 的系统骨架搭建阶段，今天看到的绝大多数后端模型和主业务模块都起源于这一段，不需要重复建设。

### M11

M11 已把“后端可用 + Admin 可运营”打穿，所以今天项目并不是“只有前台页面而没有运营后端”。

### M12-M13

M12-M13 把部署、安全和 Web MVP 基线补齐，并完成商业模型回正，明确平台定位是“信息发布展示 + 平台撮合”，而不是 Supplier 独立商城。

### M14

M14 的实际成果不是小修小补，而是把 Buyer / Supplier Workspace 真正接到了业务主链上，因此它是从 MVP 走向业务闭环的关键阶段。

### M15

M15 不是路线跑偏，而是对 M14 暴露出来的访问边界、服务边界、WorkflowEvent 完整性和 Mutation Boundary 做工程化治理，目前已全部完成。

### M16

M16 不建议直接新增大块新业务，更适合做"稳定化 + 内容入口 + SEO + 公开询价链路真实可运营化"。M16.0 审计已确认 M15 治理成果稳定，M16.1 已打通公开询价链路的真实数据绑定（产品详情 → Inquiry → 后台闭环），M16.2 已统一前端 `Page → Service → API Wrapper → Backend API` 分层，M16.3 已建立公开站 SEO 元数据基础（metadataBase / Open Graph / 动态产品元数据），M16.4 已评估内容管理 MVP 范围并确认**推迟至 M17 实施**（符合"禁止提前实现后续阶段能力"原则），M16.5 已清理组件层运行时直接调用 `lib/api/*`，前端数据访问架构统一为 `Component → Service → API Wrapper → Backend API`。435 关闭审计确认稳定化目标全部达成，**M16 CLOSED**，允许进入 M17 内容域立项（仅规划、不实施）。

### M17-M18

M17-M18 才是内容管理和运营成熟化的合理窗口，包括：

- Knowledge / Article / Insight / Solution 内容域（M17.0 已完成架构规划：统一 Content + type 判别，工作流 DRAFT→REVIEW→PUBLISHED→ARCHIVED，Public/Admin 内容 API，Web 列表/详情页 + 动态 SEO；M17.2 已实现后端基础：Content 模型+迁移+模块+API；M17.3 已实现 Admin 内容管理基础：菜单+列表+编辑器+生命周期操作；M17.4 已实现 Web 公共内容接入：Knowledge/Solutions 动态化 + 详情页 + SEO；M17.4 已完成 Public Content API 安全审计：PUBLISHED 隔离/响应边界/分页限制，Security PASS；M17.5 已完成增强规划（442，Architecture Planning Only）：MVP 闭环确认，编辑策略推荐 Markdown+Preview，媒体/SEO/工作流/内容类型演进方向定稿；M18.0 已完成实施规划（443，Architecture Planning Only）：五优先级路线 P1 Markdown / P2 Media / P3 SEO / P4 Workflow / P5 Content Type，子阶段 M18.1-M18.5，作为 M18 开发基线；**M18.1 已完成 Markdown 内容增强（444）：Admin Markdown 编辑+预览、Web 安全 Markdown 渲染（XSS 防护）、参数百科（INSIGHT）定位校准、示例内容入库，三端 build 通过**；**M18.2 已完成 Content Media 实现（446）：Content→ContentMedia→FileAsset 链路 + Admin 媒体区块 + Web 媒体画廊 + 媒体下载发布状态校验，三端 build 通过**；**M18.3 已完成 SEO Enhancement（447）：OpenGraph / JSON-LD（Article/TechArticle）/ Sitemap / Canonical / SEO 读取优化，apps/web build 通过，未新增 SEO 数据模型**；**M18.4 已完成 Workflow 架构规划（448，Architecture Planning Only）：Revision History（ContentRevision 独立表）/ Scheduled Publish（Content.scheduledPublishAt + 轻量轮询）/ Reviewer Record（复用 WorkflowEvent.operatorId）/ Approval History（WorkflowEvent 时间线 + AuditLog 系统审计分离）冻结设计，含 Content WorkflowEvent 可靠性修复与 AuditLog 补齐整改项，不新增 WorkflowAction / Role / Notification 类型 / CMS Scheduler**；**M18.4.1 已完成 Workflow Reliability Foundation（449）：修复 Content WorkflowEvent 组织约束被吞（emitEvent 移除 try/catch 静默吞错，WorkflowEventsService.create 对 CONTENT 豁免 organizationId）+ 补齐 Content 生命周期 AuditLog（CREATE / UPDATE / STATUS_CHANGE，含 old/new），API/Admin build 通过**；**M18.4.2 已完成 Content Revision Implementation（450）：新增 ContentRevision 独立版本历史表（content_revision，Content 1:N，快照字段 title/summary/content/SEO/coverImageId/snapshot/createdBy）+ 迁移 20260812043433_m18_4_2_content_revision；ContentService create 事务内建 v1、update 事务内建 v(n+1)（max+1，写入失败回滚 Content）；新增 apps/api/src/content-revision 模块（GET /content/:id/revisions、GET /content/:id/revisions/:version，均 ADMIN-only）；Admin 新增 ContentRevisionHistory 版本历史 UI（版本/创建人/创建时间 + 查看快照，暂不实现 Restore/Diff）；WorkflowEvent/AuditLog/ContentRevision 职责分离保持；未改 WorkflowAction/Role/Permission/Notification/Public Content API；三端 build 通过**；**M18.5.1 已完成 Content Operation Stability Audit（453）：Content Operation Enhancement 稳定化基线审计——Database/Migration（24 up to date）、WorkflowEvent/AuditLog/ContentRevision 三层职责分离、Scheduler 可靠性（幂等/失败恢复）、Admin Operation UI、API 契约一致性、三端 build 均 PASS，无高风险、无代码变更，M18.5 稳定化阶段已启动**）
- Parameter Explanation 参数解释体系
- SEO Metadata 数据化
- 运营看板和内容分发能力

M17 遵循"先设计、再评审、再开发"：M17.0 规划 → M17.1 Content Model Design Review → 评审通过后进入 M17.x 实现（Schema 变更需单独立项批准）。

## What Is Not On The Roadmap

以下方向不应进入后续路线：

- Supplier Store
- Supplier 独立商城
- 公开价格体系
- 交易支付闭环

这些都与当前项目已校准的业务定位不一致。

## M28.0 Product Domain Model Decision（659.2 FROZEN）

以下是 659.2 冻结的 Product Domain 业务模型决策，作为 M28/M29 及 660 架构设计的权威依据。

### Final Product Domain Model（冻结）

```
Platform Product
      |
Supplier Product（派生供应商变体）
      |
      Offer
      |
Supplier Organization
```

**Entity Responsibility**：
- **Platform Product**：Category / Standard Capability / Standard Parameter / Search Index / SEO Entry / Public Capability Node；NOT Supplier Brand / Supplier Model / Commercial Offer / Quotation
- **Supplier Product**：Supplier Brand / Series / Model Number / Product Description / Supplier Media / Supplier Parameters / Technical Documents / Application Information；归属 Supplier Organization；状态流 `Draft→Submitted→Reviewing→Approved→Published/Rejected`（落变体层）
- **Offer**：Commercial Capability / Availability / Inquiry Response / Quotation / RFQ Relation / Supplier Business Commitment；**Offer != Product**（商业层 vs 能力层解耦）

**Governance**：Admin 唯一维护全局 Platform Product + Supplier 变体 Draft→Submit→Review→Approve→Publish。审批流只落变体层，不污染全库 Product status。

**Permission**：Admin = 全局目录/分类/参数治理 + 变体审批 + Content/纠错；Supplier = 变体 Draft + Own Info/Media/Capability + Offer 管理；Supplier 禁止修改 Platform Product / Global Category / Standard Parameter Definition。

**Buyer Discovery（三层）**：① Platform Capability → ② Supplier Products → ③ Commercial Offers。能力驱动，非店铺/卖家驱动。

### 长期 Architecture Constraint（冻结）

**保留**：Product Global Capability Node
**新增方向**：Supplier Product Domain
**保持**：Offer Commercial Layer
**长期禁止**：Product.organizationId / Supplier Marketplace / Supplier Store / Order System / Payment System / ERP

**Next**: 660_Hybrid_Model_C_Architecture_Design（模型决策已冻结）→ **660 已完成（Domain Architecture Design PASS）**：领域边界已冻结（见下「660 M28.0 Hybrid Model C Domain Architecture」）。

### 660 M28.0 Hybrid Model C Domain Architecture Design（660 FROZEN）

以下是 660 冻结的 **Domain Architecture Design**（架构设计层，非 Schema/实现层），作为 660.1 数据库架构设计的权威依据。

**三层架构**：

```
Platform Product（Capability Node，全局权威，现有 Product 演化）
      │
Supplier Product（Route A：Independent Domain Entity，独立实体）
      │
      Offer（Commercial Capability Layer，Offer != Product）
      │
Supplier Organization
```

**关键架构决策**：
- **Platform Product = Capability Node**：Category + Capability Node + Standard Capability Definition + Standard Parameter Definition；平台回答「用户需要什么检测能力？」；禁止含 Supplier Brand/Model/Price/Media/Description。
- **Supplier Product = Route A（独立领域实体）**：负责 Brand/Series/Model/Description/Media/Tech Docs/Supplier Params/Application；不负责 Global Category/Capability/Standard Param/Commercial Offer。避免 `Product.organizationId`（Platform 维持无属主全局目录）。
- **Offer 关系（架构建议）**：`Offer → SupplierProduct + PlatformProduct（双绑，推荐）`；现有 Offer→Product 迁移为兼容过渡，交 660.1。
- **Gov 边界**：Phase 1 Admin Central Governance（Admin → Supplier Product Pool → Admin Approval → Public）；Phase 2 Supplier Draft 为预留扩展点（NOT IMPLEMENTED）。
- **Ownership/Parameter/Media/Search/SEO**：均已在 660 冻结（详见报告）。

**零代码**：Database / API / Frontend / Migration NONE。红线保留：NO Product.organizationId / Supplier Store / Marketplace / Payment / Order / ERP。

**Review Report**: `docs/_review/660_M28.0_Hybrid_Model_C_Domain_Architecture_Design_Report.md`
**Next**: 660.1 Database Architecture Design（Schema 层设计，仍不落地迁移）→ **660.1 已完成（Database Architecture Design PASS）**：见下「660.1 Hybrid Model C Database Architecture」。

### 660.1 Hybrid Model C Database Architecture Design（660.1 FROZEN）

以下是 660.1 冻结的 **Database Architecture Design**（数据库层设计，非 Schema 落库/迁移），作为 660.2 Schema Implementation Design 的权威依据。

**Future Database Domain Model（冻结方向）**：
```
PlatformProduct 1:N SupplierProduct 1:N Offer N:1 Organization
```

**关键数据库决策**：
- **Offer = Option C 兼容双绑**：`productId`（能力聚合，供 Search/SEO/Matching/RFQ）+ `supplierProductId`（型号事实源）；弃 Option A（丢型号）与纯 B（破坏大）。
- **SupplierProduct 独立实体（未来）**：organizationId + platformProductId + brand/series/modelNumber/description + status；生命周期 DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED 落本实体层；belongsTo PlatformProduct + belongsTo Organization。红线：不触碰 `Product.organizationId`。
- **Parameter**：Standard=Platform；Override=SupplierProduct（引用同 ParameterDefinition）；Extension=SupplierProduct（复用 ParameterDefinition+SupplierProductParameterValue）。
- **Media**：Platform（ProductMedia）/ SupplierProduct（新 SupplierProductMedia）/ Organization（FileAsset.org）/ Content（ContentMedia）。
- **Document**：复用 `FileAsset` + SupplierProductMedia（Manual/Spec/Cert/InspectionCase），不新增独立实体；`FileEntityType` 缺 SUPPLIER_PRODUCT 为扩展点（交 660.2）。
- **Migration Strategy**：推荐 Strategy B（兼容双绑）配合 C 渐进节奏，分阶段0-3；本任务不执行迁移。

**零代码**：Database / Schema / Migration / API / Frontend / Admin / Supplier 全 UNCHANGED/NONE。红线保留：NO Product.organizationId / Supplier Store / Marketplace / Payment / Order / ERP。

**Review Report**: `docs/_review/660.1_M28.0_Hybrid_Model_C_Database_Architecture_Design_Report.md`
**Next**: 660.2 Hybrid Model C Schema Implementation Design（Prisma Model 级落库设计，仍先设计后实现）→ **660.2 已完成（Schema Implementation Design PASS）**：见下「660.2 Hybrid Model C Schema Implementation Design」。

### 660.2 Hybrid Model C Schema Implementation Design（660.2 FROZEN）

以下是 660.2 冻结的 **Schema Implementation Design**（Prisma Model 级设计，非落库/迁移），作为 660.3 API Architecture + M28 开发阶段的权威依据。

**Future Prisma Domain Model（冻结方向）**：
```
PlatformProduct(Product) 1:N SupplierProduct 1:N Offer(Option C 双绑) N:1 Organization
```

**关键 Schema 决策**：
- **SupplierProduct（独立实体，未来）**：id/organizationId/platformProductId/brand/series/modelNumber/slug/description/technicalDescription/applicationInfo + governance(status/submittedAt/reviewedAt/reviewedBy/reviewedNote/publishedAt)；`@@unique([organizationId, platformProductId, modelNumber])` + index；`platformProductId→Product onDelete: Restrict`。
- **SupplierProductStatus 冻结**：`DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED / ↘REJECTED`（独立 enum，`Product.status` 平台语义互不混用）。
- **Offer Evolution**：`productId`(能力聚合,保留) + `supplierProductId`(新增可空商业源, FK→SupplierProduct Ristrict, index)；保留 `@@unique([organizationId, productId])`。
- **Parameter**：Standard=Platform；Override=`SupplierProductParameterValue`（引用同 ParameterDefinition）；Extension=**方案 A 复用 ParameterDefinition + SupplierProductParameterValue**。
- **Media**：`SupplierProductMedia`（supplierProductId/fileAssetId/mediaType/documentType/title/altText/isPrimary/displayOrder）；`FileEntityType` 需增 `SUPPLIER_PRODUCT`（交实现阶段落库）。
- **Document**：复用 `FileAsset + SupplierProductMedia.documentType`（Manual/Spec/Cert/InspectionCase），不新增独立实体。
- **Migration Impact**：Product/DemandMatch/RFQ/RFQResponse/Search/SEO/Inquiry = NONE；仅 `Offer ADD supplierProductId` 可空；Strategy B 兼容双绑 + C 渐进（阶段0-3）。
- **Migration Strategy**：阶段0 现状稳定 → 阶段1 新增 SupplierProduct 相关表 + Offer 可空列 + FileEntityType → 阶段2 存量回填 → 阶段3 productId 收敛能力聚合冗余；本任务不落库/不迁移。

**零代码**：Database / Schema / Migration / API / Frontend / Admin / Supplier 全 UNCHANGED/NONE。红线保留：NO Product.organizationId / Supplier Store / Marketplace / Payment / Order / ERP。

**Review Report**: `docs/_review/660.2_M28.0_Hybrid_Model_C_Schema_Implementation_Design_Report.md`
**Next**: 660.3 Hybrid Model C API Architecture Design（Schema 冻结 → API 契约层设计，仍先设计后实现；进入 M28 实际开发前须先完成本链路设计冻结）→ **660.3 已完成（API Architecture Design PASS）**：见下「660.3 Hybrid Model C API Architecture Design」。

### 660.3 Hybrid Model C API Architecture Design（660.3 FROZEN）

以下是 660.3 冻结的 **API Architecture Design / API Contract Freeze**（API 契约层设计，非 Controller/Service 实现），作为 660.4 Readiness + M28 开发阶段的权威依据。

**API 分层冻结**：
```
Capability Domain API    → /products（Platform Product = Capability Node，Admin 治理）
Supplier Product Domain API → /supplier-products（新）
Commercial Offer API     → /offers（进化：productId * supplierProductId 双绑）
Discovery API            → /search + /capabilities（聚合）
RFQ API                  → /rfqs + /matches（既有链路，NONE）
```

**关键 API 决策**：
- **SupplierProduct API（Admin Pool）**：`POST /admin/supplier-products`（Draft）+ `:id/submit|review|approve|reject|publish` + `GET`（query/detail）；Buyer Query = `GET /products/:id/suppliers`（capability→型号）+ `GET /supplier-products/:slug|:id/media|:id/parameters`。状态流 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED / ↘REJECTED`（Workflow 归 SupplierProduct Domain，不污染 `Product.status`）。
- **Offer Dual Binding**：`organizationId(派生) + productId + supplierProductId?(可选)`；创建强校验 `supplierProduct.organizationId === Offer.organizationId` 且 `supplierProduct.platformProductId === Offer.productId`；Supplier 仅改自家 Offer 商业字段；查询返回 Capability→SupplierProduct→Offer 三级结构。
- **Buyer Discovery**：`CapabilityDetailDTO`（platformProduct + supplierProducts[{ supplierProduct, offers[] }]），Buyer API 不暴露数据库结构；与 `/search`（找能力）互补。
- **Permission**：Admin=Platform Product + SupplierProduct Approve/Publish + Governance；Supplier=阶段1 Offer only（预留阶段2 Draft，禁直发/改平台/改全局参数）；Buyer=Read Only + Inquiry + RFQ。

**Impact**：Backend API HIGH；Prisma/Migration/Frontend NONE；Admin Future HIGH；Supplier Workspace 当前 LOW/未来 HIGH；Matching/RFQ/Search/SEO/Content NONE。

**零代码**：Database / Prisma / Migration / Frontend / Admin UI / Supplier UI 全 UNCHANGED/NONE。红线保留：NO Product.organizationId / Supplier Store / Marketplace / Payment / Order / ERP。

**Review Report**: `docs/_review/660.3_M28.0_Hybrid_Model_C_API_Architecture_Design_Report.md`
**Next**: 660.4 Hybrid Model C Implementation Readiness Assessment（验证 M28 开发就绪度，进入 M28 实际开发前的最后设计审计关卡）→ **660.4 已完成（Implementation Readiness Assessment PASS）**：见下「660.4 Hybrid Model C Implementation Readiness Assessment」。

### 660.4 Hybrid Model C Implementation Readiness Assessment（660.4 FROZEN）

以下是 660.4 冻结的 **Implementation Readiness / Development Entry Gate** 结论，作为 M28 进入开发的准入依据。

**Gate 结论：PASS — M28 Implementation = APPROVED**。演进链 `Business Model(659.2) → Domain Architecture(659/660) → Database Schema(660.1/660.2) → API Contract(660.3) → Permission → Migration Strategy → Implementation Plan` 全 FROZEN/DEFINED 且闭合。

**Readiness Matrix（全 READY/PASS）**：Business Model（职责非重叠）；Database（SupplierProduct/Media/ParameterValue 可实施 + Offer+supplierProductId 可空 + 枚举 SupplierProductStatus/FileEntityType+SUPPLIER_PRODUCT、Product 零修改）；API（SupplierProduct Domain/Offer 双绑/Capability Discovery/Approval、走 DTO 不暴露 DB Join）；Permission（Admin=Platform+Approval+Publish；Supplier=Offer only、Draft Future；Buyer=Read+Inquiry+RFQ）；Migration（Strategy B+C，阶段0-3）。

**Implementation Sequence（冻结，无 parallel frontend-first）**：Phase1 Prisma Schema → Phase2 Migration(B+C) → Phase3 Backend Service → Phase4 API Controller+DTO → Phase5 Admin Supplier Pool → Phase6 Buyer Discovery → Phase7 Supplier Workspace(未来候选)。

**Risk（全可控）**：R1 归属（organizationId 双 FK+Offer 校验）；R2 Offer 兼容（保留 productId/unique）；R3 Search/Matching（Platform Based NONE）；R4 SEO（Platform Canonical）；R5 Permission 扩展（self-service Future）；R6 回填（阶段2 低风险独立任务）。

**零代码**：Database / Prisma / Migration / API / Controller / Service / DTO / Frontend / Admin / Supplier / Product Model 全 UNCHANGED/NONE。红线（永禁）：NO Product.organizationId / Supplier Store / Marketplace / Payment / Order / ERP。

**Review Report**: `docs/_review/660.4_M28.0_Hybrid_Model_C_Implementation_Readiness_Assessment_Report.md`
**Next**: 660.5 / M28.1 首个子任务 = Prisma Schema Implementation（Phase 1，M28 实际开发首步，先落 Schema 再逐阶段迁移/Gate）→ **660.5 已完成（Prisma Schema Implementation PASS）**：见下「660.5 Hybrid Model C Prisma Schema Implementation」。

### 660.5 Hybrid Model C Prisma Schema Implementation（660.5 IMPLEMENTED）

以下是 660.5 已在 `database/prisma/schema.prisma` 落库的 **Hybrid Model C Schema**（M28 Phase 1 首个子任务），作为 Phase 2 Migration 前唯一权威 Schema。

**Future Database Domain Model（已落库）**：
```
Product (Platform Capability Node, NO ownership) 1:N SupplierProduct 1:N Offer(Option C 双绑) N:1 Organization
```

**Schema 新增（落在 schema.prisma）**：
- `SupplierProductStatus`：DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED
- `SupplierProduct`：organizationId+platformProductId+brand/series/modelNumber/slug+description/technicalDescription/applicationInfo+governance；`@@unique([organizationId,platformProductId,modelNumber])`；platformProductId→Product Restrict
- `SupplierProductMedia`：supplierProductId+fileAssetId?+mediaType+documentType?+title?+altText?+isPrimary+displayOrder（supplier Cascade）
- `SupplierProductParameterValue`：supplierProductId+parameterDefinitionId+value+valueNumber?（`@@unique([supplierProductId,parameterDefinitionId])`）

**Schema 扩展**：
- `Offer`：+`supplierProductId String?`（双绑商业源）+ supplierProduct `onDelete: Restrict` + `@@index([supplierProductId])`；保留 `@@unique([organizationId,productId])`
- `FileEntityType`：+`SUPPLIER_PRODUCT`
- 反向关系字段（Organization/Product/User/FileAsset/ParameterDefinition，纯 Prisma 关系，无 DB 列）

**Forbidden 验证**：Product 无 organizationId/ownerId/supplierId/supplierBrand；Demand/DemandMatch/RFQ/RFQResponse/Inquiry/Search/Content 未改；NO SupplierCustomKeyValue/SupplierProductDocument/SupplierStore/Marketplace/Order/Payment/ERP；NO API/Service/DTO/Frontend。

**Validation**：`prisma validate` PASS + `prisma format` PASS（Prisma 5.22.0）。

**Status**: **PASS — Schema Implemented**（Migration 未生成、Business Code 未动、Frontend 未动）。

**Review Report**: `docs/_review/660.5_M28.0_Hybrid_Model_C_Prisma_Schema_Implementation_Report.md`
**Next**: 660.6 Hybrid Model C Migration Planning（由冻结 Schema 生成迁移方案/依赖/回滚/回填策略，阶段0→1；不执行迁移直到单独 Gate）→ **660.6 已完成（Migration Planning PASS）**：见下「660.6 Hybrid Model C Migration Planning」。

### 660.6 Hybrid Model C Migration Planning（660.6 PLANNED）

以下是 660.6 已冻结的 **Phase 1 Database Migration Plan**（纯规划，Migration 未执行）。

```text
目标:  Model B → Hybrid Model C Database Foundation（M28 Phase 1）
Change Set:
  A  SupplierProductStatus enum (DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED, append-only)
  B  FileEntityType.SUPPLIER_PRODUCT
  C  supplier_product（identity/product identity/content/governance/audit + unique(org,platform,model) + 4 index + slug）
  D  supplier_product_media（supplier Cascade + fileAssetId? + mediaType/documentType/title/altText/isPrimary/displayOrder）
  E  supplier_product_parameter_value（supplier Cascade + parameterDefinition + unique(SP,PD)）
  F  offer +supplier_product_id nullable + index（保留 unique(org,product)）
Execution Order: Enum → supplier_product → media → parameter_value → FK → Index → ALTER offer → Schema Validate → Verify
FK: org RESTRICT / platformProduct RESTRICT / media CASCADE / paramValue CASCADE / offer.supplier_product RESTRICT
Compatibility: 现存 Offer.supplier_product_id = NULL；禁止 Phase1 UPDATE；backfill 需 Org+Platform+Model 匹配（独立 M28.x 任务）；零 breaking change
Rollback: NO destructive；受控 Reverse Migration 删新增表；禁直接删 offer.supplier_product_id（有数据时）；Migrate→Observe→Validate→Enable
Risks: R1 Enum LOW / R2 双绑空值 MEDIUM / R3 FK LOW / R4 backfill MEDIUM（全可控）
Impact: Offer/Org/FileAsset/ParameterDefinition LOW，其余 Domain NONE
Status: PASS — Migration PLANNED, Execution NOT EXECUTED, Database/Schema/Runtime UNCHANGED
```

**Review Report**: `docs/_review/660.6_M28.0_Hybrid_Model_C_Migration_Planning_Report.md`
**Next**: 660.7 Hybrid Model C Migration Execution（由本计划执行迁移；未到独立 Runtime Enablement Gate 前禁止开放业务写入）→ **660.7 已完成（Migration Execution PASS）**：见下「660.7 Hybrid Model C Migration Execution」。

### 660.7 Hybrid Model C Migration Execution（660.7 MIGRATED）

以下是 660.7 已应用的 **Phase 1 Database Migration**（Database Structure Activation; Runtime/Business 未开放）。

```text
Migration File:  database/prisma/migrations/20260822195411_hybrid_model_c_supplier_product/migration.sql
生成方式:  prisma migrate dev 因 010_ai_data_preparation 依赖 vector 扩展（shadow 库缺失）报 P3006；
          改用 prisma migrate diff(--from-schema-datasource→data-model) + prisma migrate deploy 应用（36 migrations all applied）
SQL:  CREATE TYPE SupplierProductStatus / ALTER TYPE FileEntityType ADD SUPPLIER_PRODUCT /
      CREATE TABLE supplier_product·media·parameter_value /
      ALTER TABLE offer ADD supplier_product_id UUID（可空）/
      11 Index + 8 FK（org·platformProduct·offer RESTRICT; media·paramValue CASCADE; reviewedBy·fileAsset SET NULL; paramDef RESTRICT）
Forbidden:  无 DROP / ALTER NOT NULL / DELETE / UPDATE offer
Validation:  prisma validate PASS + migrate status PASS（up to date）;
     新表存在; offer.supplier_product_id=uuid is_nullable=YES; Offer 总数 7 不变; IS NOT NULL=0（未回填）
Status:  PASS — Migration CREATED, Database UPDATED, Schema UNCHANGED, Existing Data UNCHANGED,
         Backfill NOT EXECUTED, API UNCHANGED, Frontend UNCHANGED
```

**Review Report**: `docs/_review/660.7_M28.0_Hybrid_Model_C_Migration_Execution_Report.md`
**Next**: 660.8 Hybrid Model C Backend Domain Service Implementation（前提 Migration PASS + Database Validation PASS 已满足）→ **660.8 已完成（Backend Domain Service PASS）**：见下「660.8 Hybrid Model C Backend Domain Service Implementation」。

### 660.8 Hybrid Model C Backend Domain Service Implementation（660.8 IMPLEMENTED）

以下是 660.8 已交付的 **Backend Domain Service Layer**（仅 service 层，API/Frontend 未暴露）。

```text
新增 Service:
  supplier-products/supplier-products.service.ts   — createDraft / findOne(org-scoped) / findAllByOrganization /
                                                    validateForOrganization / ensurePlatformProductExists（能力绑定）
  discovery/discovery.service.ts                   — findCapabilityGraph(Product→SupplierProducts→Offers) /
                                                    findSupplierProductCommercials(归属隔离)；纯内部读聚合
  supplier-products.module.ts / discovery.module.ts — 导出 service（无 controller）
扩展:
  offers.service.ts   — create() 注入 validateSupplierBinding：offer.organizationId==sp.organizationId
                        && offer.productId==sp.platformProductId，不一致 reject；legacy(无 spId) no-op；
                        写入 supplierProductId ?? null（旧 Offer 兼容）
  offers.module.ts / app.module.ts — DI 接线（SupplierProductsModule、DiscoveryModule）
Boundary: Product/Model 未改（无 orgOwner）；Schema UNCHANGED；Migration NOT CREATED；Offer NO breaking；
          RFQ/Search/Matching 未改；NO SupplierStore/Marketplace/Order/Payment/ERP
Validation: prisma generate PASS + pnpm --filter @visndt/api build PASS（nest build exit 0）
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, Database UNCHANGED, API NOT EXPOSED, Frontend UNCHANGED
```

**Review Report**: `docs/_review/660.8_M28.0_Hybrid_Model_C_Backend_Domain_Service_Implementation_Report.md`
**Next**: 660.9 Hybrid Model C API Controller and DTO Implementation（在 Service 层之上暴露 transport/validation）

### 660.9 Hybrid Model C API Controller and DTO Implementation（660.9 IMPLEMENTED）

以下是 660.9 已交付的 **API Transport Layer**（在 660.8 Service 之上暴露 controller + DTO；Frontend/Admin 未暴露）。

```
API Runtime Contract（660.9）:
  SupplierProduct Governance（ADMIN 路由）
    - POST   /admin/supplier-products            # 创建 DRAFT（能力绑定校验；orgId 由用户上下文派生）
    - GET    /admin/supplier-products            # 按管理组织列出
    - GET    /admin/supplier-products/:id        # 读取单个
    - POST   /admin/supplier-products/:id/submit   # DRAFT → SUBMITTED
    - POST   /admin/supplier-products/:id/review   # SUBMITTED → REVIEWING
    - POST   /admin/supplier-products/:id/approve  # REVIEWING → APPROVED
    - POST   /admin/supplier-products/:id/reject   # REVIEWING → REJECTED（必填 reviewedNote）
    - POST   /admin/supplier-products/:id/publish  # APPROVED → PUBLISHED

  Capability Discovery Read
    - GET /capabilities/:id                      # CapabilityDetailDTO（platformProduct → supplierProducts[].offers[]）

  Offer DTO Extension
    - CreateOfferDto.supplierProductId?（可选双绑；旧 Offer NULL 兼容）

DTO: CreateSupplierProductDto / RejectSupplierProductDto / CapabilityDetailDTO 家族
Guard: JwtAuthGuard + RolesGuard + @Roles(Role.ADMIN)（Phase 1 禁止 Role.SUPPLIER）
Boundary: Product=Capability Authority / SupplierProduct=Supplier Model Entity / Offer=Commercial Layer / API=Transport Only
Validation: npm run build（apps/api）exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, Database UNCHANGED, API IMPLEMENTED, Frontend UNCHANGED
```

**Review Report**: `docs/_review/660.9_M28.0_Hybrid_Model_C_API_Controller_and_DTO_Implementation_Report.md`
**Next**: 661.0_M28.0_Hybrid_Model_C_Admin_Supplier_Product_Pool_Implementation

### 661.0 Admin Supplier Product Pool（661.0 IMPLEMENTED）

完成 Hybrid Model C 的 **Admin Governance Layer 审核闭环**（主交付 apps/admin；apps/api 仅 660.9 Contract 适配）。

```
Admin Governance Interface（661.0）:
  Pool  /supplier-products                List / Status Filter / Pagination / Status View
         （DRAFT|SUBMITTED|REVIEWING|APPROVED|PUBLISHED|REJECTED）

  Detail /supplier-products/:id           SupplierProduct Identity + Capability Binding
                                          + Parameters + Media + Governance Status/Review History

  Approval Workflow UI（状态机映射）:
    DRAFT      → 提交（/submit）
    SUBMITTED  → 开始审核（/review）
    REVIEWING  → 通过（/approve）| 拒绝（/reject，Modal 必填 reviewedNote）
    APPROVED   → 发布（/publish）
    REJECTED/PUBLISHED → 终态

API Client: apps/admin/src/api/supplier-product.service.ts（消费 /admin/supplier-products*）
后端 Contract 适配: service findAllAdmin/findOneAdmin（Admin Pool org-agnostic）+ controller GET 改走
Permission: ADMIN ONLY（禁止 Role.SUPPLIER）→ Field边界: Product=Capability Authority
Validation: apps/api build exit 0 PASS；apps/admin build（tsc -b && vite build）exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, API CONSUMED,
        SupplierProduct Governance IMPLEMENTED, Approval Workflow IMPLEMENTED,
        Frontend ADMIN ONLY, Supplier Workspace NOT IMPLEMENTED
```

**Review Report**: `docs/_review/661.0_M28.0_Hybrid_Model_C_Admin_Supplier_Product_Pool_Implementation_Report.md`
**Next**: 661.1_M28.0_Hybrid_Model_C_Public_Discovery_Integration

### 661.1 Public Discovery Integration（661.1 IMPLEMENTED）

完成 Hybrid Model C 的 **Buyer Discovery 公开接口集成**：将治理闭环后的 `PUBLISHED SupplierProduct` 接入公开 Discovery Layer。

```
Public Discovery Data Flow（661.1）:
  GET /capabilities/:id
        ↓
  DiscoveryService
        +--------------+--------------+
        |              |              |
        v              v              v
  Product         SupplierProduct  Offer Summary
  (Capability)    (PUBLISHED only) (ACTIVE price band)
        ↓
  CapabilityDetailDTO（含 CapabilityCommercialSummaryDTO）

Frontend（apps/web）:
  Product Detail 新增「供应商型号」Tab（SupplierModelsSection）:
    Platform Product → Published Supplier Models → Supplier Offers Summary
    展示: Brand / Series / Model Number / Technical Description / Commercial Availability
    状态: PUBLISHED = Approved Supplier Model
    不展示: Draft / Review Status / Rejected / 治理内部数据

Backend: discovery.service select 补 description/technicalDescription；
         controller 逐 SupplierProduct 计算 commercialSummary（仅 ACTIVE Offer 价格带）
新 DTO: CapabilityCommercialSummaryDTO（offerCount / activeOfferCount / priceFrom / priceTo / currency）
Validation: apps/api build exit 0 PASS；apps/web build (next build) exit 0 PASS；tsc --noEmit exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED,
        Backend UPDATED (apps/api/src/discovery/**), Frontend UPDATED (apps/web),
        Published Discovery IMPLEMENTED
```

**Review Report**: `docs/_review/661.1_M28.0_Hybrid_Model_C_Public_Discovery_Integration_Report.md`
**Next**: 661.2_M28.0_Hybrid_Model_C_Inquiry_Integration

### 661.2 Inquiry Integration（661.2 IMPLEMENTED）

完成 Hybrid Model C 的 **Buyer Inquiry Entry 集成**：将 661.1 公开 Discovery 的 `PUBLISHED SupplierProduct` 接入 Buyer Inquiry → 既有 RFQ/Response 流程。

```
Inquiry Flow（661.2）:
  Published SupplierProduct（仅 PUBLISHED, Discovery 661.1）
        ↓
  Buyer Interest（Inquiry 携带 supplierProductId + platformProductId）
        ↓
  Inquiry 校验（存在 + PUBLISHED + Capability Binding）
        ↓
  既有 Inquiry/Notification + 既有 RFQ Workflow（零改动）

Backend（apps/api/src/inquiries/**）:
  create-inquiry.dto: 新增可选 supplierProductId（@IsUUID @IsOptional）
  inquiries.service: Step 3.5 校验 supplierProductId → PUBLISHED=放行, 中间态=Forbidden;
                    platformProductId===productId=放行; 通知/响应携带 supplierModelLabel
  transport-only reference（不落库，无 schema 字段）

Frontend（apps/web）:
  SupplierModelsSection 每型号「咨询此型号」入口, 展示 品牌/型号/能力名 上下文;
  InquiryForm 携带 supplierProductId + supplierModelLabel; types/inquiry 扩展
Validation: apps/api build exit 0 PASS；apps/web next build exit 0 PASS；tsc --noEmit exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, Database UNCHANGED,
        Backend UPDATED (apps/api/src/inquiries/**), Frontend UPDATED (apps/web),
        RFQ Domain UNCHANGED, Order/Payment NOT IMPLEMENTED
```

**Review Report**: `docs/_review/661.2_M28.0_Hybrid_Model_C_Inquiry_Integration_Report.md`
**Next**: M28.0 后续（型号级 Interest 持久化评估 / Supplier 工作区推进，超本任务范围）

### 661.3 Supplier Runtime Preparation（661.3 IMPLEMENTED）

完成 Hybrid Model C 的 **Supplier Capability Operation Boundary（Supplier Runtime）准备**：供应商能力操作边界（非 Store / Marketplace / Seller Center），只读查看自身 SupplierProduct / Buyer Interest / Inquiry Context，准备商业响应入口。

```
Supplier Runtime（661.3）:
  Supplier Capability Operation Boundary（非 Store/Marketplace/Seller Center）
        ↓
  查看自身 SupplierProduct（Organization 隔离）
        ↓
  查看 Buyer Interest / Inquiry Context（只读）
        ↓
  准备商业响应入口（不负责 订单/支付/合同/库存/交易闭环）

Backend（apps/api/src/workspace/**）:
  Role.SUPPLIER 只读标记（未放宽 @Roles(ADMIN) 约束）
  workspace-supplier-product.dto / workspace-supplier-inquiry-context.dto
  workspace.service: getSupplierProducts / getSupplierInquiryContext
  端点: GET /workspace/supplier/runtime/products
        GET /workspace/supplier/runtime/products/:supplierProductId/inquiry-context

Frontend（apps/web）:
  lib/api/workspace + services/workspace.service 扩展
  WorkspaceSidebar「运行时能力」; /workspace/supplier/runtime (+ inquiry-context 只读视图)
Validation: apps/api build exit 0 PASS；apps/admin build exit 0 PASS；apps/web build exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, Product UNCHANGED, RFQ UNCHANGED,
        Search/Matching UNCHANGED, Supplier Runtime IMPLEMENTED
```

**Review Report**: `docs/_review/661.3_M28.0_Hybrid_Model_C_Supplier_Runtime_Preparation_Report.md`
**Next**: 661.4_M28.0_Hybrid_Model_C_Search_Facet_Enhancement

### 661.4 Search Facet Enhancement（661.4 IMPLEMENTED）

完成 Hybrid Model C 的 **Search Facet 增强**：`PUBLISHED SupplierProduct` 进入公开 Discovery Search，能力/品牌/系列/技术参数/商用可用性多维 Facet，独立端点 `GET /search/supplier-models`。

```
Search Facet Flow（661.4）:
  Published SupplierProduct（仅 PUBLISHED, 服务端强制）
        ↓
  Facet 过滤（能力 category / 品牌 brand / 系列 series /
              技术参数 parameterFilters(复用既有 Parameter System) / 商用可用性 hasOffer=ACTIVE Offer）
        ↓
  DTO Projection（capability + supplierProduct + facetSummary + commercialSummary + inquiryAvailable）

Backend（apps/api/src/search/**）:
  supplier-model-facet-search.service + dto 新增
  search.controller: GET /search/supplier-models
Frontend（apps/web）:
  lib/api/search + services/search.service: supplierModelSearch
  独立页面 /supplier-models（Facet 侧栏 + 结果 + 加载更多）
  PublicHeader 新增「供应商型号」导航（661.5 收敛）
Validation: apps/api build exit 0 PASS；apps/web build exit 0 PASS
Status: PASS — Schema UNCHANGED, Migration NOT CREATED, Product UNCHANGED, RFQ UNCHANGED,
        Matching UNCHANGED, Search Facet IMPLEMENTED, Inquiry PRESERVED
```

**Review Report**: `docs/_review/661.4_M28.0_Hybrid_Model_C_Search_Facet_Enhancement_Report.md`
**Next**: 661.5_M28.0_Hybrid_Model_C_Unified_Discovery_Search_Consolidation

### 661.5 Unified Discovery Search Consolidation（661.5 IMPLEMENTED）

将 661.4 新增的 SupplierProduct Search **正式收敛进 Unified Search（/search）**，形成唯一主搜索入口 + 统一 Facet，避免第二套独立搜索入口。

```
Unified Search（661.5 收敛后）:
  /search  （唯一主搜索入口）
     |── Capability（products）
     |── SupplierProduct（supplierProducts / type=supplier-product）
     |── Supplier（suppliers）
     |── Knowledge（knowledge）
     |── Content（content）
     |── Solution（solutions）
     +── Unified Facets（category / brand / series / 技术参数 / commercial availability）

Backend（apps/api/src/search/**）:
  search.service.search() 并行检索 6 维度（新增 searchSupplierProducts 适配器）
  UnifiedDiscoveryResponse 新增 supplierProducts 维度（既有 5 维度契约保持）
  unified-search.dto: 新增 brand / series / hasOffer 统一 Facet 参数
  GET /search/supplier-models（661.4 端点保留）

Frontend（apps/web）:
  lib/api/search + services/search.service: supplier-product domain + mapSupplierProduct
  SearchPageContent: supplier-product Tab + SupplierProductResultCard + SupplierModelFacetPanel
  SearchTypeTabs / GlobalSearchBar: 新增「供应商型号」类型切换（非独立入口）
  /supplier-models → redirect('/search?type=supplier-product')（仅向后兼容, robots noindex）
  PublicHeader: 移除「供应商型号」一级导航（Navigation = CONSOLIDATED）

Boundary:
  Published Boundary: status=PUBLISHED 服务端强制（Draft NOT FOUND / Published FOUND）
  DTO Projection（不暴露裸 Prisma relation）；Product = Capability Authority UNCHANGED
  Schema UNCHANGED / Migration NOT CREATED / Matching UNCHANGED / RFQ UNCHANGED / Inquiry PRESERVED
Validation: apps/api tsc 类型检查 exit 0 PASS；apps/web next build exit 0 PASS（43 页, 仅既有 warnings）
Status: PASS — Unified Search VERIFIED, SupplierProduct Search INTEGRATED, Facet UNIFIED,
        Navigation CONSOLIDATED, Published Boundary VERIFIED, Schema UNCHANGED,
        Migration NOT CREATED, Product UNCHANGED, Matching UNCHANGED, RFQ UNCHANGED, Inquiry PRESERVED
```

**Review Report**: `docs/_review/661.5_M28.0_Hybrid_Model_C_Unified_Discovery_Search_Consolidation_Report.md`
**Next**: M28.0 后续（型号级 Interest 持久化评估 / Supplier 工作区推进，超本任务范围）

### 661.6 Unified Search Runtime Consolidation（661.6 IMPLEMENTED）

将 661.5 的 Unified Search Architecture 在**真实运行时**进一步收敛，消除 SupplierProduct 独立搜索运行路径，冻结 Unified Search Runtime。

```
Unified Search Runtime（661.6 冻结后）:
  SearchPage
     ↓
  ONLY /search
     ↓
  supplierProducts + supplierProductFacets（唯一正式运行路径）

  /supplier-models → meta refresh 重定向 → /search?type=supplier-product（HTTP 实测 200 + noindex）

Backend（apps/api/src/search/**）:
  /search 返回 supplierProductFacets（pagination-independent, 非阻塞 try/catch）
  recordSearchAnalytics 纳入 supplierProducts（entityTypes + resultCounts, 非阻塞）
  /search/supplier-models 保留为 Legacy Compatibility Endpoint（SearchPage 不消费）

Frontend（apps/web）:
  SearchPageContent: 唯一数据源 /search（searchUnified）; 无 searchSupplierModels 调用
  统一分页: page 由 URL searchParams 派生（单一状态, pageSize=20 常量）
  统一 Facet: sb/ss/sh + category/filters 全进 /search（URL = API = Rendered）
  Query Persistence: q/type/category/sb/ss/sh/page 全部 URL 可恢复
  search.service.ts supplierModelSearch wrapper 无 UI 消费（Future Deprecation Candidate）

Analytics:
  conversion_event 实测 SEARCH_SUBMITTED / RESULT_VIEWED 含 supplierProduct 维度
  未新建 SupplierProductAnalyticsService（复用既有 recordSearchAnalytics）

Boundary:
  Schema UNCHANGED / Migration NOT CREATED / Product UNCHANGED / Matching UNCHANGED
  RFQ UNCHANGED / Inquiry PRESERVED / No Paid Ranking / No Supplier Marketplace
Validation: apps/api build exit 0 PASS；apps/web next build exit 0 PASS；
        HTTP runtime：/search 200（supplierProducts+facets）、/search/supplier-models 200 legacy、
        /search/context 200、/supplier-models redirect 页（meta refresh + noindex）
Status: PASS — SearchPage ONLY /search, SupplierProduct Search UNIFIED,
        Legacy Endpoint COMPATIBILITY ONLY, /supplier-models REDIRECT VERIFIED,
        Pagination UNIFIED, Facet State UNIFIED, Query Persistence VERIFIED,
        Search Analytics SUPPLIERPRODUCT INTEGRATED, Existing Search REGRESSION PASS,
        Schema UNCHANGED, Migration NOT CREATED, Product UNCHANGED, Matching UNCHANGED,
        RFQ UNCHANGED, Inquiry PRESERVED
```

**Review Report**: `docs/_review/661.6_M28.0_Hybrid_Model_C_Unified_Search_Runtime_Consolidation_Report.md`
**Next**: M28.0 后续（型号级 Interest 持久化评估 / Supplier 工作区推进，超本任务范围）。**Unified Search Runtime = FROZEN**（661.5 Architecture Consolidation → 661.6 Runtime Consolidation）。

### 661.7 Product Discovery Experience Audit（661.7 AUDITED）

对 M28.0 Hybrid Model C 第一阶段能力执行「真实运行 + 三角色旅程 + 信息架构 + 产品体验」综合审查。**NO FEATURE DEVELOPMENT / NO CODE CHANGE**（Audit Before Improvement / Report Before Fix）。

```
Product Discovery Experience Audit（661.7 结论）:
  状态: CONDITIONAL PASS（无 P0；P1=2 其中 1 项为数据准备缺口；若干 P2 产品化问题）
  Buyer Journey:    CONDITIONAL（SupplierProduct 0 条 → 型号链路空态）
  Supplier Journey: CONDITIONAL（无型号池数据可操作）
  Admin Journey:    VERIFIED
  Search:           VERIFIED（661.6 FROZEN 保持，SearchPage→ONLY /search→supplierProducts）

  Runtime 数据（psql 实查）:
    User=13 / Organization=11 / Product=7 / SupplierProduct=0 / Offer=7
    Inquiry=6 / Rfq=11 / RfqResponse=12 / SupplierProductMedia=0

  Defects:
    P0 = 0
    P1 = 2（D1 SupplierProduct 数据缺口——seed_demo.ts 无创建逻辑 / D2 /offers/mine 无独立路由 500）
    P2 = 5（D3 ManufacturerInfo「制造商」命名与 Supplier 模型冲突 / D4 四个分析入口重叠
            / D5 媒体中心无一级菜单 / D6 知识分类·域术语混用 / D7 Solution 无 Admin 入口）
    P3 = 2（D8 型号无批量操作 / D9 空态无 CTA）
    Future = 3（F1 Product Series 分层 / F2 供应商产品池 / F3 Media Folder·Owner 筛选）

  Productization Score: 3.0 / 5（Discovery 4 / Search 4 / Product Understanding 3
        / Supplier Model Understanding 3 / Inquiry 3 / Supplier Operation 3
        / Admin Governance 3 / IA 3 / Naming 2 / Scalability 2）

  Architecture Impact: Database/Schema/Migration/API/Matching/Search/RFQ/AI/Storage 全 UNCHANGED/NONE

  三层关系（schema 实证）:
    Product（平台能力 / Global Catalog）→ SupplierProduct（供应商型号, platformProductId 归属）
      → Offer（商业能力, supplierProductId 双绑）
```

**Review Report**: `docs/_review/661.7_M28.0_Hybrid_Model_C_Product_Discovery_Experience_Audit_Report.md`
**Next**: 662 Product Experience Refinement（先补 SupplierProduct 真实数据链 D1，再统一命名 D3）

### 662 Product Experience Refinement（662 IMPLEMENTED）

基于 661.7 真实审计结果，只处理已验证产品化缺口（D1 SupplierProduct 数据 / D2 Offer 入口 / D3 命名 / D6 知识术语 / D7 Solution 入口）。**Real Data Before UX / Terminology Before Expansion / No Scope Expansion**。

```
Product Experience Refinement（662 结论）:
  状态: PASS
  D1 SupplierProduct Demo Data: CREATED（真实数据链补齐）
  D2 Offer Entry: CLARIFIED（/offers/mine = Legacy/Unused，正式入口 /workspace/supplier/offers）
  D3 Manufacturer Terminology: FIXED（SupplierInfo 替换 ManufacturerInfo，核心页面术语=供应商）
  D6 Knowledge Terminology: FIXED（Domain=知识领域 / Category=知识分类 / Entry=知识条目）
  D7 Solution Management: DEFINED（Solution = Content 子类型 ContentType.SOLUTION，
        Admin 路径=内容中心→内容管理→类型=解决方案，不新增独立 CRUD）

  Demo Data（prisma 实查）:
    supplier_product=13（PUBLISHED=6 / DRAFT=2 / SUBMITTED=2 / REVIEWING=1 / APPROVED=1 / REJECTED=1）
    supplier_product_media=5 / supplier_product_parameter_value=13 / offer_with_supplier_product=6
    组织: 明视 5 / 锐视 5 / 中科 3；Offer 绑定 6 条全 org/product 一致 + PUBLISHED

  Runtime 验证:
    Case A PUBLISHED 搜索可见 ✅  Case B DRAFT 不可见 ✅  Case C 详情数据链正确 ✅
    Case D 型号 Inquiry 上下文 ✅（SupplierModelsSection→InquiryForm supplierProductId）
    Case E Supplier→Offer ✅（/workspace/supplier/offers）  Case F Inquiry Context ✅
    Case G Admin 治理 ✅（/admin/supplier-products* 全治理动作）
    Case H /offers/mine 正式 UI 不依赖 ✅（零引用）  Case I 制造商命名 ✅（仅企业类型字典保留）
    Case J 知识域/分类一致 ✅  Case K Solution 管理路径明确 ✅

  Build: apps/api exit 0 / apps/admin exit 0 / apps/web exit 0（全 PASS）

  Architecture Impact: Database/Schema/Migration/Product/SupplierProduct/Offer
        /Search(FROZEN)/Matching/RFQ/AI/Storage 全 UNCHANGED/NONE
```

**Review Report**: `docs/_review/662_M28.0_Product_Experience_Refinement_Report.md`
**Next**: 由实际验证结果决定 → 建议 663 Admin IA Optimization（D4 分析入口 / D5 媒体中心一级菜单） / 664 Supplier Product Management Scaling（D8 批量 / F1 Series / F2 产品池）

### 662.1 Three Role Scale Validation（662.1 IMPLEMENTED）

基于 662 PASS 基线，在真实数据规模开始增长时验证 Hybrid Model C 产品模型（Platform Product → SupplierProduct → Offer → Supplier Organization）是否仍可理解/可发现/可管理/可审核/可比较/可运营。**Validate Scale Before Designing Scale / Real Data Before New Feature / Report Before Refactor**。

```
Three Role Scale Validation（662.1 结论）:
  状态: PASS（基线 3.0/5 → 3.8/5，Improved）

  Runtime Data（DB 实查）:
    supplier_product=13（基线）→ 21（+8 受控 Scale，全部 DRAFT / slug 前缀 scale- 可回滚）
    status: DRAFT 10 / SUBMITTED 2 / REVIEWING 1 / APPROVED 1 / PUBLISHED 6 / REJECTED 1
    supplier_product_media=5 / parameter_value=13 / offer=7（SP-bound=6）/ inquiry=8 / rfq=11 / rfq_response=12
    明视 11 / 锐视 6 / 中科 4；VX-6000 = 7 型号 / 3 供应商（多 Supplier 竞争同 Capability）

  三角色旅程: Buyer VERIFIED（Search/Facet/Capability/Compare/型号 Inquiry）
              Supplier VERIFIED（Runtime 11 models + Offers + Inquiry Context + RFQ）
              Admin VERIFIED（治理池 status 过滤 + 分页 + review/approve/publish）

  决策门:
    Supplier Product Pool  = NOT YET REQUIRED（100+ 投影 RECOMMENDED，F2 Future Candidate）
    Batch Operation        = NOT YET REQUIRED（100 型号审核队列 15 时 RECOMMENDED，D8 Future Candidate）
    Media Governance       = A（Current sufficient，entityType=SUPPLIER_PRODUCT 归属已具备）
    Series Model           = KEEP AS STRING（18 组多 1:1，暂不成实体）

  Review Interaction Cost: LOW（List→Detail→Review→Approve→Publish ≈ 6 次点击 / 7 次 API）

  Defect: P0=0 / P1=0 / P2=5（Supplier Runtime 列表无分页/搜索/Series 分组、搜索卡无组织名、
         offer 维度无价格列、Admin 无批量）/ P3=1

  Architecture Impact: Database/Schema/Migration/Product/SupplierProduct/Offer
        /Search(FROZEN)/Matching/RFQ/AI 全 UNCHANGED/NONE
  Hybrid Model C: FROZEN（保持）
```

**Review Report**: `docs/_review/662.1_M28.0_Hybrid_Model_C_ThreeRole_Scale_Validation_Report.md`
**Next**: 授权进入 663 Admin IA Optimization（D4 分析入口 / D5 媒体中心一级菜单）+ 664 Supplier Product Management Scaling（D8 批量 / F1 Series 分组 / F2 产品池）—— D 组为 20+ 型号规模前置治理

### 663 Admin IA and Governance Optimization（663 IMPLEMENTED）

基于 662.1 PASS 基线，只处理 Admin 信息架构与治理体验缺口（D4 Analytics 入口重叠 / D5 媒体中心一级入口缺失 / D6 Knowledge 术语 / D7 Solution 入口），**Information Architecture Before Feature Expansion / Governance Before Scale / No Schema Expansion / No Business Workflow Rewrite**。

```
Admin IA and Governance Optimization（663 结论）:
  状态: PASS

  D4 Analytics Entry: IA Decision = C（KEEP ROUTES BUT GROUP UNDER ONE ANALYTICS SECTION）
    数据分析=指标趋势 / 业务分析=漏斗·生命周期·转化·匹配 / 运营监控=系统健康·业务风险
    / 审计智能=审计概览·风险；data 组标签「数据与监控」→「数据与分析」；路由/breadcrumb/deep link 保留

  D5 Media Center: 一级入口恢复（媒体中心→媒体管理 /media，PictureOutlined；此前隐藏）
    /files GET 200，entityType 筛选正常；SUPPLIER_PRODUCT 实体标签补全（展示层）
    架构事实: SupplierProductMedia 走独立 supplier_product_media 表（非 FileAsset），/files 以 FileAsset 体系为主
    Media Governance = A（无 Folder/Collection）

  D6 Knowledge Terminology: 全量复核一致（知识领域/知识分类/知识条目）Admin+Web+API 无混淆，无需再改

  D7 Solution Entry: Solution = Content.type = SOLUTION；Admin ContentList「解决方案」筛选 Tab 已具备
    创建/编辑/发布复用既有 Content CRUD；未新增 SolutionController/Service/Table/Model/Migration

  Navigation: CONSOLIDATED —— 首页/产品中心/业务中心/用户与供应商/内容中心/媒体中心(新增一级)/数据与分析/系统管理
    Task A /products ≤2 决策 ✅；Task B 产品中心→供应商型号审核 ✅；Task C 媒体中心一级可达 ✅
    Task D 内容中心→内容管理→解决方案 ✅；Task E 数据与分析（数据/业务/监控/审计可分）✅

  Naming: CONSISTENT —— Web/Admin/API 核心语义一致；「制造商」残留均为企业类型字典（662 D3 边界）

  Build: apps/api exit 0 PASS；apps/admin exit 0 PASS（仅既有 chunk-size/dynamic-import 提示）
         apps/web exit 0 PASS（43 页，仅既有 ESLint warnings）

  Runtime: API 4000 / Admin 3001 / Web 3000 全 200；Admin 三角色全链路可达
  Regression: Unified Search total=6 全 PUBLISHED（661.6 FROZEN 保持）；SearchPage//search/context//supplier-models 未改

  Defect: P0=0 / P1=0 / P2=1（/files 媒体中心未覆盖 supplier_product_media 表，架构既有事实）/ P3=0

  Architecture Impact: Database/Schema/Migration(NONE)/Product/SupplierProduct/Offer
        /Search(FROZEN)/Matching/RFQ/AI/API 全 UNCHANGED；Admin UPDATED；Web UNCHANGED
  Hybrid Model C: FROZEN（保持）
```

**Review Report**: `docs/_review/663_M28.0_Admin_IA_and_Governance_Optimization_Report.md`
**Next**: 授权进入 664 Supplier Product Management Scaling（D8 批量 / F1 Series 分组 / F2 产品池 / Supplier Runtime 列表分页-搜索-分组 / 搜索 offer 价格列）—— Future Candidate（F1/F2/D8/F3）不得提前实现

### 664 Supplier Product Management Scaling（664 IMPLEMENTED）

基于 662.1 PASS（P2-A~E 实测缺口）+ 663 PASS Admin IA 基线，仅处理 Supplier Product 规模化可管理性问题，**Scale Evidence Before Scale Feature / Existing Model Before New Model / Runtime Before Schema Expansion / Selection Before Batch Workflow / No Scope Expansion**。

```
Supplier Product Management Scaling（664 结论）:
  状态: PASS

  P2-A Supplier Runtime Scaling: IMPLEMENTED + VERIFIED
    GET /workspace/supplier/runtime/products（唯一入口，不新增 Pool API）
    +page/pageSize(default=20)/q/status/series；skip/take+count 分页
    实测: page2/page3 切页正确（total=11）；status=PUBLISHED→2；q=3DSC→2
          series=精密扫描系列→2；status+series→1；pageSize=100 正常
    Status 模型六档全保留; q 检索 brand/series/modelNumber/capability

  P2-A UX: 搜索框/状态下拉/Series 下拉/分页(上页·下页·X/Y·共 total 条)/重置
  P2-D URL 状态: page/q/status/series 写入地址栏 + parseUrlState 恢复
          deep-link/refresh 存活；无第二套状态体系

  P2-B 供应商组织展示: DTO projection supplierProduct.organization={id,name}
    结果卡「供应商：名 / 品牌 / 系列 / 型号」；实测 org=明视工业检测设备有限公司
    （仅公开必要字段，无内部/Member/权限数据）

  P2-C 价格摘要: 复用既有 commercialSummary（offerCount/activeOfferCount/priceFrom/priceTo/currency）
    结果卡「有效 Offer：N 个」+「价格：X~Y」+「可购/可询价」徽章
    不新增 Ranking/Sponsored/Paid；价格仅信息展示不参与排序

  P2-D 规模验证: 20+(库内 Total=21 实测切页正确)/50+(pageSize 至 100 skip/take 幂等确定性)
    Admin Table pageSizeOptions=['10','20','50']+showSizeChanger

  P2-E Admin Batch Preparation: Selection Model（rowSelection+selectedRowKeys+已选 N Alert+取消选择）
    NO actual batch approve/reject/publish、NO batch API、NO batch workflow（D8 FROZEN）
    判断: 队列<15 未触发 D8；选择模型低风险、保留 UI 扩展边界

  P3 状态可视化: StatusTag/色阶徽章（PUBLISHED 绿/APPROVED 蓝/REJECTED 红/审核琥珀/DRAFT 灰）
    中文六档（草稿/已提交/审核中/已通过/已发布/已拒绝）；Supplier Runtime + Admin 一致

  Build: apps/api exit 0 PASS；apps/admin exit 0 PASS（仅既有 chunk-size 提示）
         apps/web exit 0 PASS（43 页，仅既有 ESLint warnings）

  Runtime: API 4000 全链路；三角色 login 201
  Regression: Buyer(/search 明视 total=2 全 PUBLISHED+org+价格+可询价) PASS
        Supplier(Runtime 分页/过滤/offer/inquiry-context 200) PASS
        Admin(/supplier-products total=21 status 过滤 PUBLISHED→6；dashboard/stats 200 403修复) PASS

  Defect: P0=0 / P1=0 / P2=0 / P3=0

  Architecture Impact: Database/Schema/Migration(NONE)/Product/SupplierProduct/Offer
        /Search(FROZEN)/Matching/RFQ/AI 全 UNCHANGED；API MINIMAL EXTENSION
        （仅 /workspace/supplier/runtime/products 增可选 query+DTO 增 page/pageSize）
        Frontend UPDATED；Admin UPDATED
  Hybrid Model C: FROZEN（保持）；Unified Search: FROZEN（保持）
```

**Review Report**: `docs/_review/664_M28.0_Supplier_Product_Management_Scaling_Report.md`
**Next**: 进入下一阶段 M28.x Supplier/Discovery 产品化优化；Future Candidate（F1 Series Entity / F2 Supplier Product Pool / D8 Batch Operation / F3 Media Folder）触发条件未达，不得提前实现

### 665 Platform Productization End-to-End Experience Audit（665 COMPLETED）

665 Platform Productization E2E Experience Audit（665 结论）:
```text
Status:                    PASS
Demo Scale Fixture:        VERIFIED
Buyer Journey:             VERIFIED
Supplier Journey:          VERIFIED
Admin Journey:             VERIFIED
Business Loop:             VERIFIED
Product Discovery:         VERIFIED
Unified Search:            FROZEN
Product Semantics:         VERIFIED
Supplier Differentiation:  VERIFIED
Inquiry:                   VERIFIED
RFQ:                       VERIFIED
Media Governance:          ASSESSED
Information Architecture:  ASSESSED
Scale:                     ASSESSED
P0 / P1 / P2 / P3:         0 / 0 / 3 / 2
Productization Score:      4.2 / 5
M28.0 Productized Baseline:READY
Hybrid Model C:            FROZEN
Database / Schema:         UNCHANGED
Migration:                 NONE
API:                       UNCHANGED
Matching / RFQ / AI:       UNCHANGED
Documentation:             SYNCED
M28.1 Recommendation:      Demo Fixture FORMALIZE（P2①）+ SupplierProduct 比较页深度验证（P2②）+ Admin IA 残余收敛（P3）；F1/F2/D8/F3 保持 Future Candidate
```

**Review Report**: `docs/_review/665_M28.0_Platform_Productization_End_to_End_Experience_Audit_Report.md`
**Next**: **M28.1**（Demo Scale Fixture FORMALIZE → SupplierProduct 比较体验深度验证 → Admin IA/Media 治理收敛）；F1 Series Entity / F2 Supplier Product Pool / D8 Batch Operation / F3 Media Folder 触发条件未达，不得提前实现

### 666 Demo Scale Fixture Formalization（666 COMPLETED）

666 Demo Scale Fixture Formalization（666 结论）:
```text
Status:                    PASS
Repository:                VERIFIED
Fixture Architecture:      Option C（database/fixture/ master runner：seed / clean / reset）
Fixture Identification:    slug 前缀 (scale|mingshi|ruishi|zhongke)-（21/21 命中，missing=0）
Core Demo Data:            PRESERVED（offer=7 / inquiry=9 / rfq=12 / rfq_response=12 清理后不变）
SupplierProduct Fixture:   VERIFIED（21 Models / 3 Orgs / 6 Capabilities / 6 PUBLISHED / 6 Offer-bound）
Scale Fixture:             VERIFIED（+8 DRAFT scale 记录，idempotent）
Idempotency:               PASS（Before == First Seed == Second Seed = 21/6/6）
Rollback:                  SAFE（--clean 仅删 Fixture，Core Demo 保留；seed 可还原）
Supplier Isolation:        PASS（s1=明视 n=11 / s2=锐视 n=6 / crossVisible=0）
Published Boundary:        PASS（公开 /search 仅 PUBLISHED=6，onlyPublished=true）
Admin Governance:          PASS（pool n=21 跨 3 组织 / detail / PUBLISHED 过滤）
Buyer Discovery:           PASS（Keyword / Brand / Series / hasOffer / Pagination 全验证）
Inquiry:                   PASS（inquiry-context=200）
Multi-Supplier:            PASS（DB 级 6 Capability 多组织；Observed=3 orgs REAL，Projected=50+ QUERY-CAPABILITY）
Media:                     PASS（5 Media：IMAGE 4 + SPEC_SHEET 1）
Parameter:                 PASS（13 ParameterValues / 13 型号覆盖）
Regression:                PASS（api/web/admin build exit 0；Unified Search/Product/Offer/Inquiry/Demand/RFQ/Matching/Dashboard 全 200）
Observed Scale:            21 Models（REAL DATA VERIFIED）
Projected Scale:           50+ Models（CONTRACT / QUERY CAPABILITY VERIFIED）
P0 / P1 / P2 / P3:         0 / 0 / 1 / 0
Hybrid Model C:            FROZEN
Unified Search:            FROZEN
Database / Schema:         UNCHANGED
Migration:                 NONE
API:                       UNCHANGED
Matching / RFQ / Inquiry:  UNCHANGED
Documentation:             SYNCED
M28 Demo Scale Fixture:    = Controlled / Reproducible / Non-Production Dataset
Next:                      667 M28.1 SupplierProduct Comparison Experience（P2②）
```

### 667 SupplierProduct Comparison Experience（667 COMPLETED）

667 SupplierProduct Comparison Experience（667 结论）:
```text
Status:                    PASS
Repository:                VERIFIED
Comparison Architecture:   EXISTING + MINIMAL EXTENSION（复用 /products/compare URL 状态 + capability 图数据源）
Buyer Comparison:          VERIFIED（Search → Capability → 勾选 → Compare → 参数差异 → 商业摘要 → Inquiry）
Supplier Organization Identity: PASS（每列「供应商：组织名」；同 Brand 不同 Org 可区分）
Brand / Series / Model:    PASS（第二/三层）
Parameter Comparison:      PASS（Option B：共同参数 + 差异高亮 + 最优值绿标）
Commercial Summary:        PASS（Offer 数 / 价格区间 / 货币 / 可询价状态；无 Ranking）
Inquiry:                   PASS（每列「咨询此型号」，supplierProductId 上下文保持）
Search → Compare:          PASS（/search?type=supplier-product → 详情页勾选 → /products/compare）
Product Detail → Compare:  PASS（SupplierModelsSection 勾选 + 底部比较条）
Compare State:             PASS（?ids&type=supplier-product&capability=，deep link / refresh / back-forward 稳定）
Scale:                     ASSESSED（2/3/4/7 型号 + 3 Supplier × 7 SupplierProduct 全通过）
Edge Cases:                ASSESSED（0/1/2/3/4+/unpublished/no-offer/different series/same brand 全验证）
Supplier Regression:       PASS（Runtime 200 / inquiry-context 200 / 跨组织 403 正确阻断）
Admin Regression:          PASS（Admin = UNCHANGED，仅 Audit）
Build:                     PASS（api/web build exit 0；admin UNCHANGED）
P0 / P1 / P2 / P3:         0 / 0 / 2 / 2
F1 Series Entity:          FUTURE CANDIDATE
F2 Supplier Product Pool:  FUTURE CANDIDATE
D8 Batch Operation:        FUTURE CANDIDATE
F3 Media Folder:           FUTURE CANDIDATE
Hybrid Model C:            FROZEN
Unified Search:            FROZEN
Database / Schema:         UNCHANGED
Migration:                 NONE
API:                       MINIMAL EXTENSION（capability 图加载 parameterValues + CreateInquiryDto UUID loose）
Matching / RFQ:            UNCHANGED
Documentation:             SYNCED
Review Report:             docs/_review/667_M28.1_SupplierProduct_Comparison_Experience_Report.md
Next:                      668 M28.1 Admin / Media Residual Productization（不得提前实现）
```

### 668 Platform Productization Final Audit（668 COMPLETED）

668_M28.2_Platform_Productization_Final_Audit（668 结论）:
```text
Status:                    PASS
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  667 = PASS / 666 = PASS / 665 = PASS / 664 = PASS / 663 = PASS / 662.1 = PASS / 661.6 = PASS
Architecture:              STABLE（Hybrid Model C = FROZEN / Unified Search = FROZEN / Database-Schema-UNCHANGED / Migration-NONE）
Architecture Drift:        NONE（无第二套 Search / Compare / Compare State；无新 Domain / 新 Model / 新 Migration）
Buyer Runtime:             PASS（18/18：Search → Capability → Compare 2/3/4/7 → URL Restore → 参数差异 → 商业摘要 → Inquiry → Invalid SP 拒绝）
Supplier Regression:       PASS（runtime 200 / own inquiry-context 200 / cross-org 403 / offers 200；Runtime UNCHANGED）
Admin Regression:          PASS（dashboard stats/pending/supplier-products 200；Admin = UNCHANGED）
Permission / Isolation:    PASS（无 Cross-org / Unpublished / Offer / Inquiry Context leakage）
Scale:                     PASS（3 orgs / 7 SupplierProducts / 多品牌多系列多型号 / With-Offer=3 / No-Offer=4 / Published / Unpublished）
Build:                     PASS（api nest build exit 0；web tsc exit 0 + next build exit 0；admin UNCHANGED）
P0 / P1 / P2 / P3:         0 / 0 / 2 / 3（均非阻断）
F1 Series Entity:          FUTURE CANDIDATE（最密同系列 4<5，未触发）
F2 Supplier Product Pool:  FUTURE CANDIDATE（单供应商 ≤13<50，未触发）
D8 Batch Operation:        FUTURE CANDIDATE（队列 <15，未触发）
F3 Media Folder:           FUTURE CANDIDATE（entity 治理足够，未触发）
Hybrid Model C:            FROZEN
Unified Search:            FROZEN
Database / Schema:         UNCHANGED
Migration:                 NONE
API:                       MINIMAL EXTENSION（仅 667 Read-only + UUID 兼容修正）
Matching / RFQ / Inquiry:  UNCHANGED
M28 Closeout:              CLOSED
M29 Entry Gate:            READY（P2-1/P2-2/P3-3 优化项 + F1/F2/D8/F3 Future Candidate，仅 Readiness Assessment，不实施）
Documentation:             SYNCED
Review Report:             docs/_review/668_M28.2_Platform_Productization_Final_Audit_Report.md
Next:                      M29（Entry Gate = READY，按候选分类正式规划）
```

### 700 M29.0 Search Function And UI Audit（700 COMPLETED / CONDITIONAL PASS）

700_M29.0_Search_Function_And_UI_Audit（指令 646_M26.0，按用户要求以 700 M29 编号，700 结论）:
```text
Status:                    CONDITIONAL PASS
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  668 = PASS / M28 = CLOSED / M29 Entry Gate = READY；Unified Search = FROZEN
Search Architecture:       VERIFIED（单一 /search + 统一响应契约；/search/context；/supplier-models 仅 legacy/redirect；无 Search Rewrite）
Search Implementation:     ISSUES FOUND（核心链路 VERIFIED；F3 supplier 状态值缺陷）
Search API:                UNCHANGED
Search Ranking:            VERIFIED（确定性排序，无 AI/语义/Supplier 加权）
Search Filter / Facet:     VERIFIED（Filter→URL→API→Refresh 闭环运行时复验：超声波 3→1 US-800；上下文 3 候选/1 分类/14 参数）
Search UI:                 VERIFIED（搜索框/结果卡/空/加载/错误/移动端全通过）
Header Navigation:         CROWDED（F2，P2：7 导航 + 内嵌搜索框 + 双 CTA 竞争 1200px 行宽，lg 下搜索框被压缩）
Supplier Search:           FOUND / SCOPE VIOLATION（F1，P1：GlobalSearchBar 搜索域 + Tab + 结果卡 + 后端 searchSuppliers + 首页 CTA + /suppliers/[id] 直出；依指令 8.1 本任务不删除，仅 Removal Recommendation）
Design System:             COMPLIANT（Token 同源；P3 观察：未直接复用 design-system 组件）
Identity Contract:         ISSUES FOUND（P3：搜索结果未挂接 identity-contract；未修改契约）
P0 / P1 / P2 / P3:         0 / 1 / 2 / 3
M25 / M28:                 CLOSED / CLOSED
M29:                       ACTIVE / SEARCH AUDIT
Database / Migration:      UNCHANGED / NONE
Matching / Storage / AI:   UNCHANGED
Documentation:             SYNCED
Review Report:             docs/_review/700_M29.0_Search_Function_And_UI_Audit_Report.md
Next:                      701 M29.1 Search Supplier Removal And Header IA Optimization（独立实施任务）
```

### 701 M29.1 Search Boundary Cleanup（701 COMPLETED / PASS）

701_M29.1_Search_Boundary_Cleanup（指令 V3.2.3，Frontend Boundary Cleanup + Search Scope Correction + Architecture Compliance Fix）:
```text
Status:                    PASS
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  700 = CONDITIONAL PASS / M25 = CLOSED / M28 = CLOSED / M29 = ACTIVE / SEARCH
Search Boundary:           RESTORED（Industrial Inspection Capability Discovery）
Supplier Search:           REMOVED FROM SEARCH ENTRY（GlobalSearchBar 搜索域 + SearchTypeTabs Tab + SupplierResultCard + 首页 CTA）
Supplier Domain:           PRESERVED（Capability Provider 上下文；supplier-product 能力发现保留）
Frontend:                  UPDATED（1 删除 + 7 修改）
API:                       UNCHANGED（后端 searchSuppliers / UnifiedSearchDto 未改，仅前端收窄读取类型）
Database / Migration:      UNCHANGED / NONE
Mobile:                    VERIFIED（375 / 768 / 1440 三断点无 Supplier Search Entry）
Build:                     Web tsc exit 0 + next build exit 0（43 pages）
P0 / P1:                   0 / 0
Documentation:             SYNCED
Review Report:             docs/_review/701_M29.1_Search_Boundary_Cleanup_Report.md
Next:                      702 M29.2 Search Entry And Hero Optimization
```

### 702 M29.2 Search Entry And Hero Optimization（702 COMPLETED / PASS）

702_M29.2_Search_Entry_And_Hero_Optimization（指令 V3.2.3，Search Entry Visual Weight + Search Hero + Responsive Verification）:
```text
Status:                    PASS
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  701 = PASS（Supplier Search REMOVED / SupplierProduct PRESERVED）
Search Hero:               ADDED（/search 无关键词首屏独立 Hero，复用 GlobalSearchBar，无新 API/DB）
Search Entry:              IMPROVED（GlobalSearchBar 新增 variant=hero 大尺寸响应式变体）
Search Core:               FROZEN（query/filter/pagination/ranking/entity scope 语义不变）
API / Service:             UNCHANGED（GET /search + /search/context 零改动）
Database / Migration:      UNCHANGED / NONE
Supplier Search:           STILL REMOVED（无 supplier 搜索域回归）
SupplierProduct:           PRESERVED（supplier-product 能力发现保留）
Frontend:                  UPDATED（1 新增 SearchHero + 2 修改 GlobalSearchBar/SearchPageContent）
Mobile:                    VERIFIED（375/390/768/1024/1440；Hero 响应式 + Header 移动搜索入口保留）
Build:                     Web tsc exit 0 + next build exit 0（43 pages）
P0 / P1:                   0 / 0
Documentation:             SYNCED
Review Report:             docs/_review/702_M29.2_Search_Entry_And_Hero_Optimization_Report.md
Next:                      703 M29.3 Search Result Presentation Optimization
```

### 703 M29.3 Search Result Presentation Optimization（703 COMPLETED / CONDITIONAL PASS）

703_M29.3_Search_Result_Presentation_Optimization（指令 V3.2.3，Search Result IA + Capability Discovery Presentation + Responsive UI + Search Regression Verification）:
```text
Status:                    CONDITIONAL PASS（完整浏览器交互 E2E 待补，与 702 同口径）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  702 = PASS；701 = PASS（Supplier Search ABSENT / SupplierProduct PRESENT）
Result Summary:            ADDED（SearchResultSummary：发现 N 项相关检测能力 + 产品/检测方案/能力型号/知识，基于既有 /search counts）
Result IA:                 REORDERED（Product Capability → Solution → SupplierProduct → Knowledge；Presentation Only）
Product Card:              ENHANCED（检测能力 badge + 型号 + 摘要 + 分类 + CTA 查看能力 + 高亮）
Solution Card:             ELEVATED（检测方案 badge + 摘要 + 适用场景 tags + CTA 查看方案）
Knowledge / Content:       AUXILIARY（相关知识，权重不压过核心能力）
Terminology:               CONVERGED（搜索域 供应商型号 → 能力型号；内部模型/DB/API/Identity 未改）
Search Core:               FROZEN（Search API/Service/Ranking/Matching/AI/DB/Storage 全 UNCHANGED）
Filter / Pagination / URL: PRESERVED（category/fc/f_*/sb/ss/sh/page 链路无回归）
Supplier Search:           STILL ABSENT（前端 UnifiedDiscoveryResponse 无 suppliers；SupplierResultCard 不存在）
SupplierProduct:           PRESERVED（能力型号 discovery 保留）
Frontend:                  UPDATED（新增 SearchResultSummary；修改 SearchPageContent/ProductResultCard/SolutionResultCard/SearchTypeTabs/GlobalSearchBar/SearchEmptyState/SupplierModelFacetPanel）
Build:                     Web tsc exit 0 + next build exit 0（清理 .next 缓存冲突后）
P0 / P1 / P2 / P3:         0 / 0 / 0 / 0（Observation 3 条 + Future Candidate 1 条，无缺陷）
Documentation:             SYNCED
Review Report:             docs/_review/703_M29.3_Search_Result_Presentation_Optimization_Report.md
Next:                      704 M29.4 Search Final Productization Audit
```

### 704 M29.4 Search Final Productization Audit（704 COMPLETED / CONDITIONAL PASS）

704_M29.4_Search_Final_Productization_Audit（指令 V3.2.3，M29 Search Experience 最终收口审计）:
```text
Status:                    CONDITIONAL PASS（AUDIT ONLY，零代码改动）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
700-703 Evidence Chain:     VERIFIED（700 CONDITIONAL PASS → 701 PASS → 702 PASS → 703 CONDITIONAL PASS）
Search Boundary:            VERIFIED（Product/SupplierProduct/Knowledge/Content/Solution；No supplier domain）
Supplier Search:            ABSENT（SupplierResultCard 已删 / 无 searchSuppliers / 无供应商 Tab / CTA）
SupplierProduct:            PRESERVED（能力型号 discovery）
Search Entry + Hero:        VERIFIED（GlobalSearchBar + SearchHero 工业检测能力发现定位）
Result Summary:             VERIFIED（情况 A：检测能力语义，不含 content，未暗示全部结果）
Result Presentation:        VERIFIED（Product → Solution → SupplierProduct → Knowledge；Presentation ≠ Ranking）
Filter / Pagination / URL:  VERIFIED（category/fc/f_*/sb/ss/sh/page 无回归；supplier 参数不存在）
Mobile / Desktop:           VERIFIED / PARTIAL（代码级多断点；浏览器视觉未跑）
Accessibility / Design:     VERIFIED(PARTIAL 静态) / COMPLIANT（复用 Tailwind token，无独立 Search 体系）
Build:                      Web tsc --noEmit exit 0 + pnpm --filter @visndt/web build exit 0（43 页）
Architecture:               DB/API/Search Service/Ranking/Matching/Storage/AI 全 UNCHANGED，Migration NONE
Browser E2E:                UNAVAILABLE（无浏览器驱动工具，不伪造）
P0 / P1 / P2 / P3:          0 / 0 / 0 / 0（Observation 3 条 + Future Candidate 4 条）
M29:                        CONDITIONAL（Implementation COMPLETED / Validation CONDITIONAL PASS）
Documentation:              SYNCED
Review Report:              docs/_review/704_M29.4_Search_Final_Productization_Audit_Report.md
Next:                       M30 Candidate Review（本任务不自行进入）
```

### 705 M30.1 Capability Semantic Productization P0 Fix Implementation（705 COMPLETED / PASS）

705_M30.1_Capability_Semantic_Productization_P0_Fix_Implementation（指令 V3.2.3，M30 Capability Productization 第一阶段）:
```text
Status:                    PASS（Frontend Semantic Alignment / SEO Productization Fix）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Commit=2143efc）
Modified Files:             3（seo.tsx / seo-config.ts / HeroBanner.tsx）
SEO Description:            FIXED（工业无损检测设备平台 → 工业检测能力发现平台）
SEO Keywords:               FIXED（移除设备品类，新增 Capability 语义）
Default Title:              FIXED（VISNDT – 工业检测设备平台 → VISNDT – 工业检测能力发现平台）
HeroBanner:                 FIXED（h1/副标题/CTA 全部收敛为 Capability Discovery 语义）
M29.5 P0 Closure:           CLOSED（P0-01/P0-02/P0-03 全部修复）
Build:                      Web tsc --noEmit exit 0 + next build exit 0（43 页）
Architecture:               DB/API/Schema/Search Service/Matching/AI 全 UNCHANGED，Migration NONE
P0 / P1:                    0 / 0
M30.1:                      PASS
Documentation:              SYNCED
Review Report:              docs/_review/705_M30.1_Capability_Semantic_Productization_P0_Fix_Implementation_Report.md
Next:                       706 M30.2 Capability Vocabulary Unification And Admin Web Alignment
```

### 706 M30.2 Capability Vocabulary Unification And Admin Web Alignment（706 COMPLETED / PASS）

706_M30.2_Capability_Vocabulary_Unification_And_Admin_Web_Alignment（指令 V3.2.3，M30 Capability Productization 第二阶段）:
```text
Status:                    PASS（Frontend Semantic Unification + Admin UX Alignment + CRUD Completion）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Commit=2143efc）
Web Vocabulary:            UNIFIED（Search / Product Catalog / SupplierProduct / Home，全部 Capability 术语）
Admin Vocabulary:          UNIFIED（Navigation / Product Management / SupplierProduct / Demand / Category）
Capability Vocabulary:     产品→能力 / 供应商型号→能力型号 / 产品分类→能力分类 / 产品参数→能力参数 / 产品询价→能力询价
ProductForm CRUD:          VERIFIED（slug/seoTitle/seoDescription: API DTO 不支持 → Future Candidate 4 项）
Product Media:             VERIFIED（编辑模式现有媒体回显 + 主图识别 + 管理入口）
DemandEdit:                VERIFIED（contactVisible + status 合法转换；categoryId: API DTO 不支持 → Future Candidate）
Search Regression:         VERIFIED（Supplier Search=ABSENT / SupplierProduct=PRESENT）
SEO Safety:                VERIFIED（705 语义未回退 / 行业关键词保留）
Mobile:                    VERIFIED（375/390/768）
Accessibility:             VERIFIED
Build:                     Web tsc --noEmit exit 0 + next build exit 0（43 pages）；Admin tsc --noEmit exit 0 + build exit 0（5944 modules）
Architecture:              DB/API/Schema/Search/Matching/Storage/AI 全 UNCHANGED，Migration NONE
P0 / P1 / P2 / P3:        0 / 0 / 0 / 0（Future Candidate 4 项）
P1-16:                     CLOSED / FIXED（705 已完成）
Gates:                     20/20 PASS
M30.2:                     PASS
Documentation:             SYNCED
Review Report:             docs/_review/706_M30.2_Capability_Vocabulary_Unification_And_Admin_Web_Alignment_Report.md
Next:                      707 M30.3 Capability Productization Validation Audit
```

### 707 M30.3 Capability Productization Validation Audit（707 COMPLETED / CONDITIONAL PASS）

707_M30.3_Capability_Productization_Validation_Audit（指令 V3.2.3，M30.3 Productization Validation / Audit Only / 零代码变更）:
```text
Status:                    CONDITIONAL PASS（M30 Gate Review / Audit Only / 零代码变更）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Commit=2143efc）
Evidence Chain:            704 CONDITIONAL PASS → 704-R1 PASS → 705 PASS → 706 PASS → 707 CONDITIONAL PASS
Capability Domain:         VERIFIED（Product = Platform Capability in code behavior）
Capability Identity:       VERIFIED（Full chain Search → Product → SupplierProduct → Offer → Inquiry intact）
Capability Model:          VERIFIED（SupplierProduct = Capability Model；Supplier = Capability Provider）
Commercial Closure:        VERIFIED（Offer lifecycle / Inquiry immutable / RFQ Demand-derived）
Search:                    VERIFIED（Supplier Search ABSENT / SupplierProduct PRESENT / API UNCHANGED）
Web:                       VERIFIED（Core Capability pages aligned；2 P1 metadata residuals）
Admin:                     VERIFIED（UX = Capability Operation Center）
SEO:                       VERIFIED（705 P0 preserved；root layout P1 residual）
Mobile:                    VERIFIED（375/390/768）
Accessibility:             VERIFIED
Design System:             VERIFIED（No drift）
Architecture:              FROZEN（DB/API/Schema/Search/Matching/Storage/AI 全 UNCHANGED）
Scope Compliance:          PASS（No Schema/API/Search/Matching/AI/Storage changes in 705/706）
P0 / P1 / P2 / P3:        0 / 2 / 8 / 1（Future Candidate 4 + 704-FC FROZEN）
P1 Details:                R-707-01 layout.tsx root metadata / R-707-02 products/layout.tsx metadata
M30 Completion:             11/13 PASS, 2/13 CONDITIONAL
M30 Gate:                  CONDITIONAL（READY，2 P1 Frontend-only metadata fixes）
M31 Gate:                  CONDITIONAL（P1 fixes required before M31 entry）
Documentation:             SYNCED
Review Report:             docs/_review/707_M30.3_Capability_Productization_Validation_Audit_Report.md
Next:                      M30 Final Closeout（含 P1 metadata fixes）→ M31 Entry
```

### 708 M30.4 P1 Metadata Residual Fix（708 COMPLETED / PASS）

708_M30.4_P1_Metadata_Residual_Fix（指令 V3.2.3，M30 Final Closeout Preparation / Frontend Semantic Alignment）:
```text
Status:                    PASS（P1 Metadata Closure / M30 Closeout Preparation）
R-707-01:                  CLOSED（layout.tsx 3 处 工业检测设备平台→工业检测能力发现平台）
R-707-02:                  CLOSED（products/layout.tsx 产品中心→能力目录 / 工业检测设备产品目录→工业检测能力目录）
Root Metadata:             ALIGNED（title/description/OG/twitter 全部 Capability 语义）
Products Metadata:         ALIGNED（title/description/OG 全部 Capability Catalog 语义）
705 Baseline:              PRESERVED（SITE_DESCRIPTION/defaultTitle/SITE_KEYWORDS/HeroBanner）
Industry Keywords:         PRESERVED（NDT/无损检测/工业检测/内窥镜/超声/射线/测量系统）
Global Residual Scan:      PASS（核心 metadata 零残余；P2=9 deferred / P3=1 deferred）
Build:                     Web tsc --noEmit exit 0 + next build exit 0（43 pages）
Architecture:              DB/API/Schema/Search/Matching/Storage/AI 全 UNCHANGED，Migration NONE
P0 / P1 / P2 / P3:        0 / 0 / 9 / 1（existing deferred）
M30 Closeout:              READY
M31:                       PENDING FINAL CLOSEOUT
Review Report:             docs/_review/708_M30.4_P1_Metadata_Residual_Fix_Report.md
Next:                      709_M30_Final_Closeout
```

### 709 Trirole Data Compliance E2E And Defect Fix（709 COMPLETED / PASS）

709_Trirole_Data_Compliance_E2E_And_Defect_Fix（指令 4 连任务：1 数据合规修复 / 2 三角色 E2E / 3 缺陷修复）:
```text
Status:                    PASS（Test Data Compliance + Trirole E2E + Defect Fix）
任务 1 数据合规:          PASS（组织名违规后缀清理；admin@visndt.com / admin123456 组织与密码修复）
任务 2 三角色 E2E:        PASS（81/81，_trirole_m30_e2e.mjs，TC_M30 数据运行后清理）
Admin E2E:                PASS（分类/参数/能力/组织/用户/内容/标签/知识/能力型号/报价/需求/RFQ CRUD）
Buyer E2E:                PASS（浏览 + inquiries + demands + rfqs）
Supplier E2E:             PASS（响应 RFQ + 报价 + 工作台 + 能力型号自助创建 403=设计内只读）
真实缺陷:                 1（GET /content/tags 路由被 :id 抢占 → app.module.ts 模块顺序修复）
设计内约束:               8 项（无 DELETE 路由/无 PATCH/供应商 403/约束保护 400/404）非缺陷
供应商自助创建能力型号:    Future（self-service=Future，冻结设计，不新增 API/入口）
Build:                    api build exit 0 + /content/tags 200 + /health 200
Architecture:             DB/API/Schema/Search/Matching/Storage/AI 全 UNCHANGED
P0 / P1:                  0 / 0
Review Report:            docs/_review/709_Trirole_Data_Compliance_E2E_And_Defect_Fix_Report.md
Next:                     710_Trirole_Manuals_Optimization
```

### 710 Trirole Manuals Optimization（710 COMPLETED / PASS）

710_Trirole_Manuals_Optimization（指令任务 4：优化完善管理员/用户/供应商手册）:
```text
Status:                    PASS（Documentation Optimization，零代码/零DB/零API/零架构变更）
管理员手册 05:             V2.0→V2.1（导航对齐 Admin 实际菜单；能力型号治理；术语统一）
用户手册 06:               V1.0→V1.1（能力目录/搜索域对齐/能力询价）
供应商手册 07:             V1.0→V2.0（运行时能力只读修正；能力型号由平台治理；FAQ 补充）
Validation:               旧术语扫描通过；手册与系统行为一致
Review Report:            docs/_review/710_Trirole_Manuals_Optimization_Report.md
Next:                     M30 Final Closeout → M31 Entry
```

### 711 Demand RFQ Parameter Chain Audit（711 COMPLETED / AUDIT ONLY）

711_Demand_RFQ_Parameter_Chain_Audit（指令：Demand Technical Parameter 数据链断裂识别，仅审计不改代码）:
```text
Status:                    AUDIT ONLY（零代码/零 Schema/零 API 变更）
核心结论:                  需求技术参数链路三处断裂（录入缺失→接口不含参数→展示缺失且结构不匹配）
D-1｜P1·Defect:            需求参数录入能力前端完全缺失（后端 /demands/:id/parameters 已存在未消费）
D-2｜P1·Defect:            RFQ 详情接口不返回需求参数（findOne 未 include demand.parameters）
D-3｜P2·Defect:            需求参数展示缺失（需求详情 / Buyer RFQ / Supplier RFQ 均无）
D-4｜P2·UX Issue:          前后端 DemandParameter 结构不匹配（平铺 vs value/valueMin/valueMax+嵌套 definition）
Repair Option:            前端优先（复用既有 API）+ 最小 API projection 扩展 → 授权 712
Review Report:            docs/_review/711_Demand_RFQ_Parameter_Chain_Audit_Report.md
Next:                     712_M30.4_Demand_RFQ_Matching_Data_Closure
```

### 712 M30.4 Demand RFQ Matching Data Closure（712 COMPLETED / PASS）

712_M30.4_Demand_RFQ_Matching_Data_Closure（指令 V3.2.3 M30.4：修复并贯通 Demand Technical Parameter 数据链）:
```text
Status:                    PASS（D-1~D-4 CLOSED / 数据链 Web→API→Matching→RFQ 贯通）
D-1 录入:                  CLOSED（Web create/edit + Admin DemandEdit 参数录入/回显/增量 diff，DemandParameterEditor 复用组件）
D-2 RFQ projection:        CLOSED（rfqs.service.ts findOne include demand.parameters 含 options；demands.service.ts 同）
D-3 展示:                  CLOSED（Buyer RFQ + Supplier RFQ 复用 DemandParameters；修复空态/格式化）
D-4 结构对齐:              CLOSED（Web/Admin 统一后端嵌套结构，区间/ENUM/BOOLEAN 正确映射）
契约:                     Web demands.ts 参数 CRUD API + rfqs.ts RfqDemandSummary.parameters + Admin demand.service.ts CRUD
Build:                    API nest build exit 0 + Admin tsc&&vite build exit 0 + Web next build exit 0（43 pages）
Runtime:                  API /health 200 / Web 路由 200 / Admin 3001 / PostgreSQL 5432
参数链路 E2E:             11/11 PASS（verify_712_param_chain.ts，临时 ENUM 定义运行后清理）
三角色回归:               81/81 PASS（_trirole_m30_e2e.mjs，无回归 + 残留 CLEAN）
Matching:                 publish 触发匹配无回归；matches 200 分页结构（temp ENUM 下 total=0 预期）
Architecture:             DB/Schema/Migration NONE；Matching/Search/AI/Storage/SupplierProduct/Offer UNCHANGED
Defect:                   P0=0 / P1=0 / P2=0 / P3=0
Review Report:            docs/_review/712_M30.4_Demand_RFQ_Matching_Data_Closure_Report.md
Next:                     M30.4 Closure 后按既有路线推进 M30 Closeout → M31 Entry
```

### 713 M30.5 Transaction Data Surface Completion（713 COMPLETED / CONDITIONAL PASS）

713_M30.5_Transaction_Data_Surface_Completion（指令 V3.2.3 M30.5：核心交易数据面收口）:
```text
Status:                    CONDITIONAL PASS（Match Explanation / RFQ Context / Offer↔SupplierProduct / Supplier Inquiry 数据面 / Transaction Detail 收口；P0=0 P1=0）
Match Explanation:         Web Buyer 详情消费真实 matchDetails（algorithm/factors/parameterScores/hardFail/matchScore），无 matchDetails 诚实空态；MatchScore 0-100 直接映射；MatchItem 类型对齐
RFQ Context:               rfqs.service.ts findOne projection + sourceMatch/targetOrganization/responses（角色权限控制）；Admin RfqDetail 来源匹配/需求参数卡片
Offer↔SupplierProduct:     offers.service.ts findAll/findOne include supplierProduct；Web Offer 编辑页报价对象区块；validateSupplierBinding 组织一致性守卫
Inquiry Tracking:          Supplier「收到的询价」列表+详情补齐（能力/能力型号/提供商/状态/时间/联系人）；Inquiry 按接收方组织归属无 Buyer 所有权字段 → Buyer「我的询价」= Future Candidate（禁止 schema/migration，非当前缺陷）
一致性/契约:               Demand→Match→RFQ→SupplierProduct→Offer→Inquiry 逐链无空区块/未消费字段；API 变更均 projection-only（PROJECTION-EXTENDED）
Build:                    API nest build exit 0 + Admin tsc&&vite build exit 0 + Web next build exit 0
Runtime:                  verify_713_surface.ts 36/36 PASS（Match state machine / Offer ownership guard / RFQ/Offer/Inquiry 边界 / 跨链 X01-X05）
三角色回归:               81/81 PASS（712 baseline 继承，无回归）
移动端+无障碍:             overflow-x-auto 参数表 / 响应式 grid / 状态色对比度 / 空态/错误态齐全
Architecture:             DB/Schema/Migration NONE；Matching/Search/AI/Storage UNCHANGED；API PROJECTION-EXTENDED
Defect:                   P0=0 / P1=0 / P2=0 / P3=0；Future Candidate=1（Buyer 询价所有权视图）；Observation 若干
Review Report:            docs/_review/713_M30.5_Transaction_Data_Surface_Completion_Report.md
Next:                     M30 Final Validation / Final Closeout
```

### 714 M30 Final Validation And M31 Entry Baseline Audit（714 COMPLETED / PASS）

714_M30_Final_Validation_And_M31_Entry_Baseline_Audit（指令 V3.2.3 M30 Final Closeout / Transition M30→M31 Entry / Architecture Audit + Final Validation / Audit Only）:
```text
Status:                    PASS（M30 Phase CLOSED / READY；M31 Entry APPROVED）
M30 Task Matrix:           704 CONDITIONAL → 705 PASS → 706 PASS → 707 CONDITIONAL(2 P1) → 708 PASS(707 P1 CLOSED) → 709 PASS(81/81) → 710 PASS → 711 AUDIT ONLY → 712 PASS(D-1~D-4 CLOSED) → 713 CONDITIONAL(FC=1 非缺陷)
Capability Closure:        Demand Parameter Chain(712) / Matching Explanation(713) / RFQ Context(713) / SupplierProduct Binding(713) / Offer Surface(713) / Inquiry Surface(Supplier 侧, Buyer=FC) 全 CLOSED；Role Boundary VERIFIED；Runtime VERIFIED（712 11/11+713 36/36+709 81/81）；Doc SYNCED
Architecture:              FROZEN（DB/Schema UNCHANGED、Migration NONE、API Projection-only、Matching/Search/AI/Storage UNCHANGED；十项边界全 MUST HOLD）
Impact:                   Frontend 无 fake data / 无前端重算 / 无隐藏 fallback / 无权限绕过；Inquiry 组织域+归属校验 403；RFQ 角色投影
Future Candidate Register: 5 项（Buyer 询价所有权视图 / 供应商自助能力型号 / 供应商搜索 / Search V2·AI·Vector·RAG / ProductForm 4 字段 API DTO）— 仅登记不实现
M31 Entry:                APPROVED（架构保持 FROZEN；FC 仅登记；后续遵守 V3.2.3 边界）
Review Report:            docs/_review/714_M30_Final_Validation_And_M31_Entry_Baseline_Audit_Report.md
Next:                     M31 Entry
```

### 715 M31.1 Core User Experience Hardening（715 COMPLETED / PASS）

715_M31.1_Core_User_Experience_Hardening（指令 V3.2.3 M31 主任务之 1 / Development + UX Hardening + Frontend Data Surface Verification + Runtime Validation）:
```text
Status:                    PASS
Buyer Experience:          VERIFIED（Demand Create/Edit/Detail + Parameters + Contact Visibility + Match Detail + RFQ）
Supplier Experience:       VERIFIED（RFQ「为什么收到+如何响应」+ Offer 对象 + Inquiry 收口）
Demand:                    VERIFIED（categoryId / quantityUnit / 联系人 + contactVisible 掩码 / NUMBER·ENUM·BOOLEAN 参数展示）
Matching Explanation:      VERIFIED（真实 matchDetails：factors/parameterScores/hardFail，仅映射不重算，无详情诚实空态）
RFQ:                       VERIFIED（Supplier sourceMatch 仅目标组织 + Offer 下拉响应 + 已有响应状态）
Offer:                     VERIFIED（能力/型号/提供商/价格/币种/状态/生命周期；GET /offers/:id 新增所有者组织校验 404）
Inquiry:                   LIMITED（Supplier 收到询价完成；Buyer 所有权 = Future Candidate 713-FC-01）
Role Boundary:             VERIFIED（Buyer 读供应商 Offer 详情 404；sourceMatch 无跨组织泄漏）
Runtime:                   verify_715_surface.ts 36/36 PASS；verify_713_surface.ts 回归 40/40 PASS
Build:                     API nest build exit 0 + Web tsc --noEmit exit 0 + Admin tsc -b exit 0
Mobile+Accessibility:      代码级多断点 375/390/768/1024/1440 响应式 + overflow-x-auto 参数表 + label/focus/aria-hidden 齐全
Architecture:              Schema UNCHANGED / Migration NONE；Matching/Search/AI/Storage UNCHANGED；API PROJECTION-EXTENDED（Role Safe）
Defect:                    P0=0 / P1=0 / P2=0 / P3=0；Observation 4；Future Candidate=5（继承 714，未新增未实现）
Review Report:            docs/_review/715_M31.1_Core_User_Experience_Hardening_Report.md
Next:                     716_M31.2_Admin_Data_Governance_Hardening
```

### 716 M31.2 Admin / Data Governance Hardening（716 COMPLETED / PASS）

716_M31.2_Admin_Data_Governance_Hardening（指令 V3.2.3 M31 主任务之 2 / Development + Admin Governance Hardening + CRUD Consistency + Lifecycle / Permission Surface Verification + Runtime Validation）:
```text
Status:                    PASS
Product Governance:        VERIFIED（List↔Detail↔Edit 字段一致 + createdBy/status/category 投影 + ENUM label；slug/SEO=706-FC 复核）
Parameter Governance:      VERIFIED（products findOne 投影 parameterDefinition.options；712 回归 11/11）
SupplierProduct:           VERIFIED（DRAFT→…→PUBLISHED + REJECT；非法跃迁 400；审核字段完整）
Demand:                    VERIFIED（categoryId/contact/contactVisible/quantity·unit/org/createdBy List=Detail=Edit；Edit 补齐分类）
Offer:                     VERIFIED（能力/型号/提供商/价格/币种/状态/生命周期；foreign org 404）
Inquiry:                   VERIFIED（Admin 列表/详情上下文完整；Buyer 所有权 = 713-FC-01）
RFQ:                       VERIFIED（sourceMatch/targetOrganization/demand.parameters 上下文完整）
Content/Article/Solution/Knowledge: VERIFIED（SOLUTION=ContentType；slug/SEO/author；lifecycle DRAFT→REVIEW→PUBLISHED）
List Detail Edit Symmetry: VERIFIED（八模块全对称）
Lifecycle:                 VERIFIED（无非法跃迁/Bypass/UI-only/Stale Label/Missing Guard）
Permission:                VERIFIED（buyer/supplier 读 Admin 端点 403；无权限扩大）
Auditability:              VERIFIED（createdBy/reviewedBy/reviewedAt/reviewedNote/publishedAt 正确展示）
Data Surface:              CONSISTENT（Backend + Admin）
API:                       PROJECTION-EXTENDED（1 处：products findOne parameterDefinition.options）
Schema:                    UNCHANGED / Migration: NONE
Matching/Search/AI/Storage: UNCHANGED
Mobile+Accessibility:      代码级多断点 375/390/768/1024/1440 + AntD 响应式 + label/状态/错误/空/禁用态
Runtime:                   verify_716_admin_governance.ts 65/65 PASS
Regression:                87/87 PASS（712 11/11 + 713 40/40 + 715 36/36）
Build:                     API nest build exit 0 + Web next build exit 0 + Admin tsc -b && vite build exit 0
Defect:                    P0=0 / P1=0 / P2=0 / P3=0；Observation 3；Future Candidate=5（继承，未实现）
Review Report:            docs/_review/716_M31.2_Admin_Data_Governance_Hardening_Report.md
Next:                     717_M31.3_Productization_QA_Stability_Validation
```

### 717 M31.3 Productization QA / Stability Validation（717 COMPLETED / PASS）

717_M31.3_Productization_QA_Stability_Validation（指令 V3.2.3 M31 主任务之 3 / Productization QA / Stability Validation + Golden Path + Cross-Domain + Runtime Verification + 真实 Web 渲染 Boundary）:

```text
Status:                    PASS（M31 产品化最终质量验收）
Golden Path (Buyer/Supplier/Admin): VERIFIED（Buyer 建需求→发布→匹配→RFQ→View→Accept；Supplier 接收→需求上下文→响应→关联报价；Admin 治理各实体）
Match Details:             VERIFIED（真实 matchDetails，无 AI/LLM/语义/embedding 渗入；F8 正修无误报）
Domain Data Consistency:   VERIFIED（Demand/Matching/RFQ/Offer/Inquiry/Content/Knowledge 逐域一致）
Cross-Domain Consistency:  VERIFIED（DB truth vs API truth；J2 sourceMatchId 校正；J4 Inquiry 无 offerId 列=J4x 边界）
Error/Empty/Boundary:      VERIFIED（加载/空/错误/404/401/403 全态正确引导）
Permission:                VERIFIED（角色边界无越权；No Marketplace surface）
Mobile+Accessibility:      VERIFIED（CDP 真实渲染 375/390/768/1024/1440 无溢出；Workspace 诚实边界）
Production Build:          PASS（API nest build / Web next build / Admin tsc -b && vite build exit 0）
Runtime:                   verify_717_productization_qa.ts 108/108 PASS（A–K，临时数据清理）
Regression:                152/152 PASS（712 11/11 + 713 40/40 + 715 36/36 + 716 65/65）
Schema:                    UNCHANGED / Migration: NONE
Matching/Search/AI/Storage: UNCHANGED
API:                       UNCHANGED（业务代码变更 = 0，仅新增验证脚本）
Defect:                    P0=0 / P1=0 / P2=0 / P3=0；Observation 3；Future Candidate=5（继承，未实现）
Review Report:            docs/_review/717_M31.3_Productization_QA_Stability_Validation_Report.md
Next:                     718_M31_Final_Closeout
```

### 718 M31 Final Closeout（718 COMPLETED / CLOSED）

718_M31_Final_Closeout（指令 V3.2.3 M31 最终关闭 / Architecture Audit + Productization Closeout + Release Readiness Final Validation）:

```text
Status:                    PASS（M31 Final Closeout）
M31:                       CLOSED（M31 Productization Stability And Core Experience Closeout 全阶段完成）
M30→M31 汇总:              M30 = Capability + Transaction Data Closure / 715 = UX Closure / 716 = Admin Governance Closure / 717 = Productization QA / 718 = Final Closeout
Release Readiness:         APPROVED
Architecture:              FROZEN
Schema:                    UNCHANGED
Migration:                 NONE
Matching:                  FROZEN
Search:                    FROZEN
AI:                        FROZEN
Marketplace/Supplier Store/Transaction Engine: NONE
Catalog:                   Capability Management / Demand / Matching / RFQ / Offer / Inquiry / Content Center / Knowledge Surface / Admin Governance / Productization QA 全 CLOSED
Defect:                    P0=0 / P1=0 / P2=0 / P3=0
Future Candidate:          REGISTERED（5 项，继承 714/715/716/717，未实施）
Review Report:            docs/_review/718_M31_Final_Closeout_Report.md
Next:                     720_M32.0_Foundation_DesignToken_Freeze_And_RuntimeGate
```

```text
Status:                    PASS（720 M32.0 Foundation Design Token Freeze And Runtime Gate）
M32.0：                    M32 Frontend Platform Productization Foundation 完成（Design Token Freeze + Design System Baseline + Admin Mobile Runtime Gate + Scope Gate）
M32 定位:                  Frontend Platform Productization ≠ Pure Visual Redesign；让前端从「工业企业网站 + 产品目录 + 管理后台」收口为「工业检测能力发现 + 能力/型号展示 + 需求匹配 + RFQ/Offer 撮合平台」
M32 固定路线:              6 主任务 + 1 最终验收（720 Foundation → 721 Confirmed Blocker+Platform Identity → 722 Brand System → 723 Core Page UX → 724 Interaction+Final Polish → 725 Final QA/M32 Closeout），不拆 M32.3–M32.6
Repository Root:          F:/Desktop/VISNDT（代码根 F:/Desktop/VISNDT/VISNDT）
Working Tree:             PRESERVED（704–719 未提交变更未被覆盖）
Design Token:             FROZEN（唯一规范源 docs/design-system/：COLOR_SYSTEM / TYPOGRAPHY / SPACING / COMPONENT_RULE / UI_GUIDE；Primary #2563EB / Secondary #0EA5E9 / Accent #F59E0B / Success #10B981 / Warning #F59E0B / Error #EF4444 + Neutral 灰阶 + Radius + Spacing + Elevation + CTA hierarchy + Status semantics）
Cross-App Principle:       Same Design Tokens + Same Semantic Language + Same Interaction Principles + Different Application Theme（统一品牌 ≠ 统一组件库）
Admin Mobile Runtime:     VERIFIED（375px/768px：Login/Nav/List/Detail/Filter/Edit/Save/Pagination 0 横向溢出、0 确认阻断；review/publish = NOT APPLICABLE；modal 路由式创建流 = 探针假阴性非缺陷）
Mobile Triage:            Confirmed Blocker(P0-F)=0 / UX Issue(P1/P2)=0 / Acceptable=modal 路由流
Backend:                  UNCHANGED
Schema:                   UNCHANGED / FROZEN
Migration:                NONE
Matching / Search / AI:   FROZEN
New Runtime Dependency:   NONE（无 framer-motion / styled-components / 新 UI 库 / 新图标库 / 新图表系统；无 packages/design-system —— docs/design-system 唯一规范源 → Web/Admin manual consumption）
Finding Matrix:           P0-G=0 / P0-F=0 / P0-S=0 / P1=0 / P2=0；Observation 1（Admin modal 路由式创建流，探针假阴性）；Deferred = token-vs-code 对齐（722）、719 设计审计 UX 项（722/723/724 分期收敛）
Documentation:            UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 720 Review Report）
M32.0:                    COMPLETED
Progress Snapshot:        M31=CLOSED / 719=M32 BASELINE APPROVED / 720=FOUNDATION COMPLETE / 721=NEXT
Review Report:            docs/_review/720_M32.0_Foundation_DesignToken_Freeze_And_RuntimeGate_Report.md
Next:                     721_M32.0_Confirmed_Blocker_And_Platform_Identity
```

```text
Status:                    PASS（721 M32.1 Core Page UX And Platform Identity Implementation）
M32.1：                    M32 Frontend Core Page UX 落地（Design Token Consumption + Platform Identity + Product Discovery UX + Product Detail UX + Content Surface UX + Admin UX + Runtime Validation）
M32 定位:                  Frontend Platform Productization；收口为「工业检测能力发现 + 能力/型号展示 + 需求匹配 + RFQ/Offer 撮合平台」
Repository Root:          F:/Desktop/VISNDT（代码根 F:/Desktop/VISNDT/VISNDT）
Baseline:                 720 = PASS / M32.0 = COMPLETED / M32 = IN PROGRESS（不提前 M32 CLOSED）
Design Token:             ALIGNED（DEF-1 token-vs-code：design-tokens 语义色+industrialCyan；Web globals.css industrial-cyan/amber；Admin Login 品牌化；--primary=#2563EB 已一致）
Platform Identity:        PASS（Hero 主 CTA Primary 实底、Secondary/outline 分层；Home 平台能力表达完整）
Home UX:                  PASS（结构 + CTA 层级，Runtime 0 溢出）
Product Discovery UX:     PASS（P0-F1 移动筛选 Drawer；P1-1 栅格 1/2/3 列降密度；P1-6 CompareBar 底部占位+safe-area）
Product Detail UX:        PASS（Tabs 移动横滚 sticky / Nav 结构完备，无阻断）
Content Surface UX:       PASS（VISNDT prose + 表格 overflow 防护；静态 TOC 因无稳定 heading id → Deferred）
Admin UX:                 PASS（Login P0-S2 平台治理身份 + 共享语义状态；未改造 AntD→Tailwind）
Mobile:                   PASS（375/768/1024 Runtime via Edge CDP：0 溢出、Drawer 开合、栅格 1/2/3 列）
Accessibility:            PASS（focus/aria 保留；Drawer role=dialog/aria-modal/ESc）
Interaction:              PASS（Drawer 开合/Esc/遮罩；hover/focus/active 保留）
Production Build:         Web exit 0（8GB flag OOM → 4096 heap 重跑通过）/ Admin exit 0
Runtime:                  PASS
Regression:               PASS（后端/Schema/Migration/API 未触碰）
Schema:                   UNCHANGED
Migration:                NONE
Backend:                  UNCHANGED
Matching / Search / AI:   FROZEN
New Runtime Dependency:   NONE
Finding Matrix:           P0-G=0 / P0-F=0 / P0-S=0 / P1=0 / P2=0；Deferred = Content Detail 静态 TOC（无稳定 heading id）；Observations 见 721 报告
M32:                      IN PROGRESS
Progress Snapshot:        720=PASS / 721=PASS(M32.1 Core Page UX) / 722=NEXT
Review Report:            docs/_review/721_M32.1_Core_Page_UX_And_Platform_Identity_Implementation_Report.md
Next:                     722_M32.2_Interaction_And_Final_Polish
```

```text
Status:                    PASS（722 M32.2 Interaction And Final Polish）
M32.2：                    M32 Interaction & Final Polish（轻量页面过渡 + 按钮反馈 + 卡片反馈 + Toast/Message + Loading/Success/Error + Pagination/Tab scroll + Back To Top + CSS stagger + Reduced Motion + 品牌微动效 + Runtime QA）
M32 定位:                  Frontend Platform Productization；CSS First / Native React First / Existing Dependency First；不追求世界级动画
Repository Root:          F:/Desktop/VISNDT（代码根 F:/Desktop/VISNDT/VISNDT）
Baseline:                 720 = PASS / 721 = PASS（M32.1 Core Page UX）/ M32 = IN PROGRESS（不提前 M32 CLOSED）
Web Interaction:          PASS（template.tsx page-enter 路由过渡；globals.css 统一 Reduced Motion 基础 + card-lift/btn-press/stagger-item/hero-enter 工具类；Toast/ToastViewport 零依赖 + aria-live；BackToTop >480px smooth；Pagination 激活态纯 Primary；ProductGrid stagger 入场）
Admin Interaction:        PASS（AdminLayout Outlet key=pathname admin-route-enter 路由淡入；index.css admin-route-enter/admin-btn-press + 统一 Reduced Motion；login 保留 loading/AntD Alert）
Animation / Reduced Motion: PASS（CSS First：transition/transform/opacity/shadow/color + keyframes，无 JS 循环/无重型运行时；CDP 实测 reduced-motion 下动画时长 1e-05s）
Toast / Message / State:  PASS（Web 零依赖 Toast；Admin AntD message/Alert/Button loading；Loading/Empty/Error/骨架屏沿承）
Scroll / Pagination / Tab: PASS（Back To Top；Pagination 激活态纯 Primary；Table/Content 表格 overflow-x-auto 横滚）
Mobile:                   PASS（375/768 Runtime via Chrome Headless + CDP：Web Home/Products + Admin Login 全 overflowXpx=0、无溢出/裁剪/遮挡）
Accessibility:            PASS（focus/focus-visible 可见；ToastViewport role=status + aria-live=polite；BackToTop aria-label；Pagination 语义化 nav/button）
Production Build:         Web exit 0（NODE_OPTIONS=--max-old-space-size=4096 构建堆规避；.next 增量残留删除后全新构建通过）/ Admin exit 0
Runtime:                  PASS（真实浏览器 CDP 375/768 + Loading/Success/Error + Reduced Motion 探针）
Regression:               PASS（720 Runtime Gate + 721 Core UX 无回归：MobileFilterDrawer/CompareBar/ProductGrid/ProductCard/Admin Login/Product Detail/Content Surface/Home CTA 全保留）
Schema:                   UNCHANGED
Migration:                NONE
Backend:                  UNCHANGED
Matching / Search / AI:   FROZEN
New Runtime Dependency:   NONE（未新增任何 package/library/runtime）
Finding Matrix:           P0=0 / New P1=0 / New P2=0 / New P3=0；Observation 若干；Deferred/Future Candidate 若干（Content TOC / Advanced Content UX / Advanced Recommendation / Dark Mode / Advanced Animation / Advanced Analytics / Advanced CMS / Search V2 / AI/RAG/Vector / Supplier Search / Supplier Self-Service / Buyer Inquiry Ownership / ProductForm DTO expansion 全继承注册，不重包装）
Documentation:            UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 722 Review Report）
M32:                      IN PROGRESS
Progress Snapshot:        720=PASS / 721=PASS(M32.1 Core Page UX) / 722=PASS(M32.2 Interaction & Final Polish) / Final QA=NEXT / M32=IN PROGRESS
Review Report:            docs/_review/722_M32.2_Interaction_And_Final_Polish_Report.md
Next:                     Final QA / Release Validation（不创建 M32.3–M32.6）
```

### 723 M32 Final QA / Release Validation And Closeout — PASS（M32 唯一最终发布级门禁 / Frontend Productization Baseline Completion / 审计型关闭）

```yaml
Task:                     723_M32_Final_QA_Release_Validation_And_Closeout
Status:                   PASS
M32 定位:                  Frontend Productization Baseline Completion（非 Infinite UI Optimization）
Baseline:                 719=BASELINE APPROVED / 720=PASS / 721=PASS / 722=PASS / 723=PASS
Repository:               VERIFIED（repo root F:\Desktop\VISNDT / code root VISNDT / branch main / 工作树无 backend·schema·migration）
Architecture:             FROZEN（Schema UNCHANGED / Migration NONE / Backend UNCHANGED / Matching/Search/AI FROZEN）
Design Token:             ALIGNED（Web/Admin 品牌 token 与 design-system 冻结规范全对齐）
Web Build:                PASS（`.next` 全清后 next build exit 0，无 MODULE_NOT_FOUND chunk）
Admin Build:              PASS（tsc -b && vite build exit 0，28.2s，既有 >500kB 告警非错误）
Web Runtime:              PASS（:3100 核心路由全 200 OK）
Admin Runtime:            PASS（:4100 就绪，Login 渲染正常）
Mobile 375:               PASS
Mobile 768:               PASS
Interaction:              PASS（btn-press / page-enter / BackToTop / Toast aria-live）
Reduced Motion:           PASS（Web CDP 实测 1e-05s；Admin 全局 CSS reduce 规则）
Console / Runtime Error:  PASS（EXC=0；仅 API :4000 断连 NETFAIL = 环境性，非前端缺陷）
Visual Regression:        PASS（720/721/722 无回归，仅前端展示层）
Performance Sanity:       PASS（Web shared 102kB/page ~130kB；Admin main 2.6MB 非阻断）
Release Blocker:          0
P1:                       0
P2:                       0
P3:                       1（Admin main 2.6MB >500kB 体积，打磨非阻断）
Observation:              1（Admin login 首帧无 .admin-route-enter 节点，reduced-motion 由全局 CSS 保证）
Deferred:                 1（DEF-1 实时认证核心流 E2E 需 Postgres+API；本环境未拉起，非前端缺陷，719-722 基线已 PASS）
Future Candidate:         2（Admin bundle 代码分包 / M33 更广 interaction·a11y 增强）
Documentation:            UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 723 Review Report）
M32:                      CLOSED（Frontend Productization Baseline Completion）
Final Stop Line:          719=BASELINE APPROVED / 720=PASS / 721=PASS / 722=PASS / 723=PASS / M32=CLOSED
Next:                     724 M33 Runtime Environment E2E Readiness And Entry Baseline
```

### 724 M33 Runtime Environment E2E Readiness And Entry Baseline（724 COMPLETED / PASS）

724_M33_Runtime_Environment_E2E_Readiness_And_Entry_Baseline（指令 V3.2.3，M33 Planning Entry Runtime Baseline / Architecture Audit + Real Runtime E2E + Environment Readiness / 仅补证零业务代码变更）:
```text
Task:                      724_M33_Runtime_Environment_E2E_Readiness_And_Entry_Baseline
Type:                      Runtime Environment E2E Readiness / M33 Entry Baseline（补充 723 DEF-1 唯一缺失的真实运行证据）
M32:                      CLOSED（保持，未重开）
Repository:                VERIFIED（F:/Desktop/VISNDT，branch=main，Working Tree=PRESERVED）
Baseline:                  719=BASELINE APPROVED / 720=PASS / 721=PASS / 722=PASS / 723=PASS / M32=CLOSED
Environment:               PASS（PostgreSQL 5432 / MinIO 9000-9001 / API 4000 / Web 3000 / Admin 3001 五端在线）
PostgreSQL:                READY（真实 DB 读写全通过；/api/v1/health 200 database connected；No migration/schema mutation）
API:                       READY（NestJS 启动无异常，health 200；err.log 全为 HttpExceptionFilter 预期边界响应）
Authentication:            PASS（Buyer/Supplier/Admin 三账号 cookie+Bearer 登录 201；/auth/me 200；未认证 401）
Buyer E2E:                 PASS（REAL，API+DB：登录→浏览→Inquiry→Demand→RFQ→Publish(触发匹配)；Web /products 真浏览器渲染 25 卡片）
Supplier E2E:              PASS（REAL，API+DB：登录→响应 RFQ→Create Offer→Workspace/Supplier/Overview；SupplierProduct 写入 403=冻结只读边界）
Admin E2E:                 PASS（REAL，API+DB：登录→全实体 CRUD→SupplierProduct submit/review/approve/publish 生命周期→Offer/Demand/RFQ 治理）
HTTP Boundary:             PASS（401/403/404/200 全符合权限设计；未认证/错误角色/不存在路由/授权成功）
Browser Runtime:           PASS（Edge headless + CDP：Web /products 真实 API 数据入页 + Admin 登录/auth 态；无 fatal runtime error）
Console / Runtime Error:   PASS（Unhandled/Fatal/Hydration/Chunk/Unexpected500/Unexpected404=0；exceptionThrown=0；network_loading_failed=0）
E2E Classification:        Category A REAL E2E PASS（三角色 81/81 + Boundary 14/14 + Browser 8/8；临时数据 TC_M30/tc-m30 清理无残留）
Schema:                    UNCHANGED
Migration:                 NONE
Backend Business Logic:    UNCHANGED
Matching / Search / AI:    FROZEN / FROZEN / FROZEN
New Runtime Dependency:    NONE
Defect:                    Release Blocker=0 / P1=0 / P2=0 / P3=0
Observation:               3（登录 429 限流=throttler 预期 / content·supplier-products PATCH·DELETE 404=设计内无路由 / Admin 主包>500kB=723 P3 既有项）
Deferred:                  NONE（723 遗留 DEF-1 已解决 CLOSED）
Environment Blocked:       NONE
Future Candidate:          14 项继承注册未实现（Admin Bundle 分包 / Dark Mode / Advanced Animation / Advanced Accessibility / Advanced Recommendation / Advanced CMS / Search V2 / AI / RAG / Vector / Supplier Search / Supplier Self-Service / Buyer Inquiry Ownership / ProductForm DTO expansion）
M33 Entry:                 APPROVED（PASS）
Next:                      M33 Planning（本任务已 STOP，不自动进入 M33 implementation）
Review Report:             docs/_review/724_M33_Runtime_Environment_E2E_Readiness_And_Entry_Baseline_Report.md
```

### 725 M33.0 Frontend Visual Redesign Audit And Design Direction（725 COMPLETED / PASS）

725_M33.0_Frontend_Visual_Redesign_Audit_And_Design_Direction（指令 V3.2.3，M33.0 Frontend Visual Redesign Audit / Architecture Audit + Visual Design Audit + Runtime Evidence + Redesign Planning / 审计型零代码变更）:
```text
Task:                      725_M33.0_Frontend_Visual_Redesign_Audit_And_Design_Direction
Type:                      Architecture Audit + Visual Design Audit + Runtime Evidence + Redesign Planning（M33 Visual Redesign 前置审计，产出 M33 Visual Design Contract 唯一审计输入之一）
Repository:                VERIFIED（F:/Desktop/VISNDT，code root VISNDT，branch=main，工作树保留 719-723 + _725_shots/*.png Before-State 证据）
Baseline:                  719=BASELINE APPROVED / 720-723=PASS / M32=CLOSED（保持未重开） / 724=M33 Entry APPROVED
M32:                      CLOSED
Runtime:                   VERIFIED（API 4000 health 200 / Web 3000 200 / Admin 3001 200）
Web Visual Audit:          PARTIAL
Admin Visual Audit:        PARTIAL
Design Token Utilization:  4
Typography:                3
Color:                     4
Component System:          3
Layout Composition:        3
Brand Expression:          3
Responsive Visual:         4
Overall Visual Score:      67
Visual Redesign Gap:       C（Significant Visual Redesign Required）
Visual Transformation:     NOT CONFIRMED（本阶段仅审计，未经实施）
Web Redesign:              REQUIRED
Admin Redesign:            REQUIRED
Core Page Redesign:        REQUIRED
Component Redesign:        REQUIRED
M33 Visual Direction:      DEFINED（Industrial Precision + Technical Professional + Modern B2B；Layout 留白/节奏；Surface 分层；Typography 四级节奏；KPI emoji→图标）
Visual Transformation Gate: DEFINED（G1-G7：P0 页 Before 对比显著差异 + KPI 图标化 + P0 组件 Token 化表面分层 + 响应式无溢出 + 零硬编码 hex + 对比度≥4.5/reduced-motion + 零范围扩张/后端/schema/migration/matching/search/AI）
Schema:                    UNCHANGED
Migration:                 NONE
Backend Business Logic:    UNCHANGED
Matching / Search / AI:    FROZEN / FROZEN / FROZEN
New Runtime Dependency:    NONE
New UI Library:            NONE
Defect:                    Release Blocker=0 / P1=0 / P2=0 / P3=0
Observation:               3（双端组件语汇依赖 token 中枢无共享可视契约 / Non-content 页排版节奏不统一 / Admin>500kB=723 P3 既有不重开）
Deferred:                  0
Future Candidate:          14 项继承注册未实现（Admin Bundle 分包 / Dark Mode / Advanced Animation / Advanced Accessibility / Advanced Recommendation / Advanced CMS / Search V2 / AI / RAG / Vector / Supplier Search / Supplier Self-Service / Buyer Inquiry Ownership / ProductForm DTO expansion）
Documentation:             UPDATED
M32:                      CLOSED
M33:                      PLANNING
Next:                     M33 Visual Design Contract（本任务已 STOP After Audit，不进入 M33 implementation）
Review Report:             docs/_review/725_M33.0_Frontend_Visual_Redesign_Audit_And_Design_Direction_Report.md
```

### 726 M33.0 Frontend Visual Design Contract And Redesign Specification（726 COMPLETED / PASS）

726_M33.0_Frontend_Visual_Design_Contract_And_Redesign_Specification（指令 V3.2.3，M33.0 Visual Design Contract / Architecture+Design Contract / Visual Specification+Planning / 契约型零代码变更，M33 Implementation=NOT STARTED）:
```text
Task:                      726_M33.0_Frontend_Visual_Design_Contract_And_Redesign_Specification
Type:                      Architecture / Design Contract / Visual Specification / Planning（M33 Visual Design Contract，产出 725 Direction→可执行视觉合同）
Repository:                VERIFIED（F:/Desktop/VISNDT，code root VISNDT，branch=main，工作树保留 719-725 改动+文档+QA 脚本+_725_shots/*.png，无 reset/checkout/clean/stash/restore/commit）
Baseline:                  719=BASELINE APPROVED / 720-723=PASS / M32=CLOSED（保持未重开） / 724=M33 Entry APPROVED / 725=Visual Audit PASS（Overall 67/100、Gap=C、Redesign=REQUIRED、Visual Transformation=NOT CONFIRMED）
M32:                      CLOSED
M33:                      PLANNING
Visual Direction:         DEFINED
Visual Design Contract:   DEFINED（docs/design-system/VISNDT_M33_FRONTEND_VISUAL_DESIGN_CONTRACT_V1.md，交付物 25 项全满足）
Brand Contract:           DEFINED（Industrial Precision × Technical Professional × Modern B2B）
Typography Contract:      DEFINED（四级信息层级 + 角色化排印 + 跨页 rhythm；数字 Mono）
Surface Contract:         DEFINED（Surface 0/1/2/Elevated/Overlay）
Layout Contract:          DEFINED（业务页通用模板 + Home Narrative Flow，非 Component Stack）
Component Contract:       DEFINED（21 组件含 ProductCard→Industrial Capability Card）
Web Page Contract:        DEFINED（P0 Home/Products/Search、P1 Detail/Knowledge/Workspace）
Admin Page Contract:      DEFINED（Industrial Operations Console；P0 Login/Dashboard + P1 List·Detail·Operation）
Responsive Contract:      DEFINED（375/768/1024/1440 Responsive Transformation 非 Desktop Shrink）
Accessibility Contract:   DEFINED（Contrast≥4.5 / Focus / Keyboard / aria / Reduced Motion 全保留，不牺牲 a11y）
Before/After Gate:        DEFINED（725 _725_shots/ 基线；Before→After→Difference→Acceptance）
Visual Transformation Gate: DEFINED（VT-1..VT-12，全满足才 CONFIRMED）
Anti-Cosmetic Gate:       DEFINED（只改颜色/圆角/阴影/字体/padding/icon/hover/Button 不算；页面构成无变化→NOT CONFIRMED）
Token Gap Register:       5 项（TG-01..TG-05，命名化/语义化，不引入新色值，未改 core token）
Scope Expansion:          NONE
Backend:                  UNCHANGED
Schema:                   UNCHANGED
Migration:                NONE
API:                      UNCHANGED
Matching:                 UNCHANGED
Search:                   UNCHANGED
AI:                       UNCHANGED
Runtime Dependency:       UNCHANGED
UI Library:               UNCHANGED
Implementation:           NOT STARTED
Visual Transformation:    NOT CONFIRMED（尚未实施）
Documentation:            UPDATED
M32:                      CLOSED
M33:                      PLANNING
Next:                     M33 Visual Redesign Implementation — P0 Foundation（本任务已 STOP After Contract，不进入 M33 implementation）
Review Report:             docs/_review/726_M33.0_Frontend_Visual_Design_Contract_And_Redesign_Specification.md
```

### 727 M33.1 Frontend Visual Redesign Foundation Implementation（727 CONDITIONAL PASS）

727_M33.1_Frontend_Visual_Redesign_Foundation_Implementation（指令 V3.2.3，M33.1 Frontend Visual Foundation / Architecture-Constrained Implementation + Runtime Verification + Documentation Sync / 仅前端 Foundation，后端零修改）:
```text
Task:                      727_M33.1_Frontend_Visual_Redesign_Foundation_Implementation
Type:                      Frontend Visual Foundation Implementation（将 726 Contract 的 Foundation 视觉规则落入 Web/Admin；非 Home/Products/Search/Admin Dashboard 完整重设计）
Repository:                VERIFIED（F:/Desktop/VISNDT，code root VISNDT，branch=main，无 reset/checkout/stash/commit）
Baseline:                  725=PASS（Visual Audit）/ 726=CONTRACT（Visual Design Contract）/ M32=CLOSED（保持未重开）
M32:                      CLOSED
M33:                      IMPLEMENTATION IN PROGRESS
Foundation:                COMPLETED
Surface Foundation:        IMPLEMENTED（surface-0/1/2/elevated/overlay，design-tokens+双端 CSS）
Typography Foundation:     IMPLEMENTED（H1-H4 base 基线，双端）
Container Foundation:      IMPLEMENTED（content 1280 / wide 1480 / reading 760-820 + PageContainer.tsx）
Spacing Foundation:        IMPLEMENTED（8px rhythm 语义工具类 vds-space-y-*）
Border / Focus Foundation: IMPLEMENTED（focus-visible 复用 primary #2563eb）
Icon Foundation:           IMPLEMENTED（复用既有 lucide-react + @ant-design/icons，无新依赖）
Emoji P0 Scope:            NO NEW EMOJI（未引入 emoji 换图标）
Responsive Foundation:     IMPLEMENTED（375/768/1024+/1440 + clamp 留白，无横向溢出）
Core Visual Primitive:     IMPLEMENTED（PageContainer.tsx 单一事实源容器原语）
Token Gap TG-01:           IMPLEMENTED（Surface）
Token Gap TG-02:           REUSED（Focus ring 复用 primary）
Token Gap TG-03:           IMPLEMENTED（Container）
Token Gap TG-04:           IMPLEMENTED（Responsive padding）
Token Gap TG-05:           IMPLEMENTED（Typography）
New Runtime Dependency:    NONE
New UI Library:            NONE
New Icon Runtime:          NONE
New Animation Runtime:     NONE
packages/design-system:    NOT CREATED（F14 合规）
Second Token System:       NOT CREATED（F13 合规）
Backend:                   UNCHANGED
API:                       UNCHANGED
Schema:                    UNCHANGED
Migration:                 NONE
Matching:                  UNCHANGED
Search:                    UNCHANGED
AI / RAG / Vector:         UNCHANGED
Business Workflow:         UNCHANGED
TypeScript:                PASS（Web build 含 tsc / Admin tsc -b，均 exit 0）
Lint:                      Web PASS（exit 0，仅既有 warnings）；Admin NOT RUNNABLE（eslint.config.* 缺失=722/723 既有限制，非本任务）
Build:                     Web PASS（exit 0）/ Admin PASS（exit 0，仅既有 chunk-size warning）
Runtime:                   Web 3000=HTTP 200 / Admin 3001=HTTP 200；API 4000 本会话不可运行（Postgres:5432+Docker 未就绪，P1001，环境限制、API UNCHANGED、724 已 E2E）
Visual Runtime:            PASS（Edge Headless+CDP 375/1440 无溢出，shots 存 database/_727_shots/，未覆盖 _725_shots）
Visual Transformation:     NOT CONFIRMED（Foundation PASS ≠ Visual Transformation CONFIRMED）
Documentation:             UPDATED
M32:                      CLOSED
M33:                      IMPLEMENTATION IN PROGRESS
Status:                   CONDITIONAL PASS（Condition= 重启 PostgreSQL+API 后复核 API 运行态；前端全部 Acceptance 条件已满足）
Next:                     M33.2 Core Visual Components / P0 Implementation（本任务已 STOP，等待下一轮审计）
Review Report:             docs/_review/727_M33.1_Frontend_Visual_Redesign_Foundation_Implementation_Report.md
```

### 728 M33.2 Core Visual Components P0 Implementation（728 COMPLETED / PASS）

```
728_M33.2_Core_Visual_Components_P0_Implementation（指令 V3.2.3，M33.2 Core Visual Components / Frontend Visual Component Redesign + Architecture-Constrained Implementation + Runtime Visual QA / 仅前端 Core P0 组件重设计，后端零修改）
```

| Field | Value |
|-------|-------|
| Status | **728 COMPLETED / PASS** |
| M32 | CLOSED（保持未重开） |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| 725 / 726 / 727 | VERIFIED（Audit / Contract / Foundation） |
| 728 Deliverable | P0 Core Visual Components = COMPLETED：ProductCard / ProductGrid / HeroSection / SectionHeader / Core Surface / Admin KPI（KpiCard + OverviewCards） |
| KPI Emoji | 0（OverviewCards/KpiCard 无 emoji；CDP emojiOnPage=false；复用 @ant-design/icons） |
| Responsive | 375 / 768 / 1024 / 1440 全 VERIFIED；无横向溢出（CDP 8 页全 overflow=false）；ProductGrid 源码 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3（375/1·768/2·1024/3·1440/3） |
| Anti-Cosmetic | PASS（Component Structure / Visual Hierarchy / Surface Strategy / Responsive Composition 四类结构性变化） |
| Build / Type | Web build exit 0（PASS）/ Admin tsc -b + vite build exit 0（PASS） |
| Lint | Web PASS（exit 0，仅既有 warnings）；Admin NOT RUNNABLE（既有 eslint.config 缺失，如实记录不伪造 PASS） |
| Runtime | Web :3000=200 / Admin :3001=200；API :4000 /api/v1/health=200（本会话已拉起 PostgreSQL:5432+Docker）；截图存 database/_728_shots/（10 张，未覆盖 _725/_727） |
| Accessibility | PASS（Contrast≥4.5 / focus-visible 保留 / keyboard / semantic / aria / reduced-motion） |
| Architecture / Impact | Backend·API·Schema·Migration·Matching·Search·AI·Business Workflow 全 UNCHANGED；New Runtime Dependency=NONE；packages/design-system=NOT CREATED |
| Scope Audit | Task-728 Files=6 组件+_728_shots.mjs+截图+文档；Pre-existing=721-727 已提交工作树 PRESERVED；Unexpected=无 |
| Foundation Follow-up | 登记 ADMIN-FOCUS-TOKEN-01（Admin styles/index.css focus 直写 #2563eb，建议后续消费 border.focus Token，不在 728 修复） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 728 报告） |
| Review Report | docs/_review/728_M33.2_Core_Visual_Components_P0_Implementation_Report.md |
| Next | **M33.3 Web P0 Redesign**（本任务已 STOP，不自动进入页面级 Redesign） |

明确：**728 = Core Visual Components Only**；**Component Redesign ≠ Page Redesign**；**Visual Transformation = NOT CONFIRMED**（尚未进入 M33.3 页面级重设计）。

### 729 M33.3 Web P0 Industrial Tech Visual Redesign（729 CONDITIONAL PASS）

| Field | Value |
|-------|-------|
| Iteration | `729_M33.3_Web_P0_Industrial_Tech_Visual_Redesign`（指令 V3.2.3，M33.3 Web P0 页面级视觉重设计 / Frontend Page Redesign + Industrial Technical Visual Language + Runtime + Accessibility / 仅前端展示层，后端零修改） |
| Baseline | 725=Audit PASS + 726=Contract + 727=Foundation COMPLETED + 728=Core Visual Components COMPLETED；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Home | IMPLEMENTED（Hero 延续 + Classification 左右分栏「能力数组视觉锚 + 分类 rail」+ Solutions「特色方案深色档案 + 方案技术 rail」；Card Stack → 空间化技术展示） |
| Product Center | IMPLEMENTED（白 intro 盒 → Dark Industrial Capability Header 带 + mono 能力总数数据锚 + 分类能力 rail；功能/Search/Filter/Pagination/CompareBar 保留） |
| Product Category | IMPLEMENTED（平铺列表 → 工业分类体验 Dark Header + 分类/子类 mono 数据锚 + 分类 rail mono 序号/技术刻度/子类 chip） |
| Industrial Tech Visual Language | IMPLEMENTED（Precision/Engineering/Technical；Surface 分层 + 受控 Technical Grid/分隔线/测量刻度；Glow/Gradient 受控；无新品牌主色） |
| Information Hierarchy | IMPLEMENTED（Primary/Secondary/Technical/Meta/CTA 可辨，杜绝均匀等权） |
| 728/727 Consumption | ProductGrid / ProductCard / Hero / IndustrialBadge / SectionHeader / PageContainer（727）/ surface-* / bg-grid / mono-tabular 全消费；无第二套 Design System |
| Anti-Cosmetic Gate | Gate A-F：A/B/C/D/F=PASS；E=内容区四视口无溢出，1024 横向溢出为既有共享 Header（`/about` 复测同值）非本任务引入 |
| Responsive | 375/768/1024/1440 CDP 实测；内容区全无溢出；gridCols：Home 2/2/4/4、Products 2/2/3/3、Categories 2/2/3/3（探针）；移动端为真 Stack/Reorder 非 Desktop 缩小 |
| Accessibility | PASS（emptyA11yName=0 / imgsNoAlt=0 / focusVisibleDefined=true / emoji=false / Contrast≥4.5 / reduced-motion 保留） |
| Build / Type / Lint | Web Build exit 0（44/44 路由）/ Web TS PASS / Web Lint exit 0（仅既有 warnings） |
| Runtime | Web `:3000` `/`=200；CDP 截图 12 张存 `database/_729_shots/`（未覆盖 `_725/_727/_728`） |
| Architecture / Impact | Backend·API·Schema·Migration·Matching·Search·AI·Business Workflow 全 UNCHANGED；New Runtime Dependency=NONE；UI/Icon/Animation/Chart Library=NONE；packages/design-system=NOT CREATED |
| Scope Audit | Task-729 Files=3 P0 页 + Home 依赖组件 + `_729_shots.mjs` + `_729_probe.mjs` + 截图 + 文档；Pre-existing=721-728 PRESERVED；Unexpected=无 |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 729 报告） |
| Review Report | docs/_review/729_M33.3_Web_P0_Industrial_Tech_Visual_Redesign_Report.md |
| Status | **CONDITIONAL PASS（M33.3 Web P0 Redesign = COMPLETED）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.3 | **COMPLETED** |
| Visual Transformation | **NOT CONFIRMED** |
| Next | **M33.4 Admin P0 Industrial Tech Visual Redesign** |

明确：**729 = Web P0 页面级视觉重设计**；**Page Redesign ≠ Visual Transformation CONFIRMED**（页面级重构完成，但整体 Visual Transformation 需 M33.4-33.7 全部推进后才可判定）；1024 横向溢出为既有共享 Site Header，归因 721 前既有，Defer 不擅自扩大。

### 730 M33.4 Admin P0 Industrial Tech Visual Redesign（730 CONDITIONAL PASS）

| Field | Value |
|-------|-------|
| Iteration | `730_M33.4_Admin_P0_Industrial_Tech_Visual_Redesign`（指令 V3.2.3，M33.4 Admin P0 页面级视觉重设计 / Admin Dashboard → Industrial Operations Center / 仅 Admin 前端展示层，后端零修改） |
| Baseline | 725=Audit PASS + 726=Contract + 727=Foundation COMPLETED + 728=Core Visual Components COMPLETED + 729=Web P0 CONDITIONAL PASS；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Admin P0 Route | **`/home` = `apps/admin/src/pages/Home.tsx`**（确认真实导航入口；`/operation-center` 为非入口备选） |
| Visual Redesign | IMPLEMENTED（普通 AntD Dashboard 信息堆叠 → Industrial Operations Center；Masthead 深色锚点 + Tech Grid + mono 遥测 + 受控 accent 分隔线；KPI Zone + Operational Context + Surface 0/1/2 层级） |
| Industrial Tech Visual Language | IMPLEMENTED（Precision/Operations/Technical；受控深色锚点 + 技术网格 + mono 元数据 + 受控增强线 + 测量/坐标语言；无 Cyberpunk/Neon/Glassmorphism 泛化、无渐变泛滥、无巨字号噪声） |
| 728 Consumption | `KpiCard` + `SectionHeader`（`@components/dashboard`）全量消费；21 张 KpiCard（能力总览 / 业务流转 / 匹配引擎 / 待处理事项）；无第二套 KPI/Card/Token/Container/Icon System |
| Information Hierarchy | IMPLEMENTED（Industrial Operations Masthead(H1) → Executive KPI → Operational Meaning(hint/meta) → Technical Signals → Action/Status；杜绝标题→KPI→白卡堆叠） |
| Anti-Cosmetic Gate | Gate A-F：A(结构重组)/B(Hierarchy)/C(工业语言)/D(内容呈现)/E(Responsive)/F(无业务回归) 全已满足；非换色/换圆角/换字体/换 padding 类表层改动 |
| Responsive | 375/768/1024/1440 CDP 实测；**admin 内容区全视口无横向溢出**（sw: 375/753/1009/1425 ≤ iw）；移动端真 Stack/Reorder（KpiGrid xs=12 单列、sm/lg 分栏）；1024 Web 既有 Header overflow 按指令不擅自修复 |
| Accessibility | PASS（hierarchy h1=1/h=6；focusVisibleDefined=true；无 emoji；装饰 SVG aria-hidden；emptyA11yName=3 均为既有布局 chrome——AdminLayout 折叠钮 ×2 + AntD Tabs more 触发钮（具 aria-haspopup/aria-controls），非 730 引入） |
| Build / Type / Lint | Admin Build exit 0（tsc -b + vite build 通过，仅既有 P3 chunk>500kB 告警）；Admin Lint **NOT RUNNABLE**（`eslint.config.js|mjs|cjs` 缺失，792/728 同因；按指令未新建 ESLint 架构） |
| Runtime | Admin `:3001` `/home`=200 真实运行态数据（demo.admin 登录；既有 API）：`sw:screens/sections/ability总览·业务流转·匹配引擎·待处理·快捷操作`；截图 5 张存 `database/_730_shots/`（未覆盖 `_725/_727/_728`） |
| Before/After Evidence | 生成 `admin_p0_{375,768,1024,1440}.png` + `admin_p0_full_1440.png`（After）；Before 参照 728 普通面板基线 `_728_shots/admin_analytics_375.png` + 725 Audit + Home.tsx git 结构性 diff（728/729 无 admin_home 专用基线，如实登记） |
| Architecture / Impact | Backend·API·Schema·Migration·Matching·Search·AI·Business Workflow 全 UNCHANGED；New Runtime Dependency=NONE；UI/Icon/Animation/Chart Library=NONE；packages/design-system=NOT CREATED |
| Scope Audit | Task-730 Files=`apps/admin/src/pages/Home.tsx`（P0 页视觉层）+ `_730_shots.mjs` + `_730_a11y_probe.mjs` + 截图 + 文档；Pre-existing=721-729 PRESERVED；Unexpected=无（apps/api / prisma / migration 零改动） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 730 报告） |
| Review Report | docs/_review/730_M33.4_Admin_P0_Industrial_Tech_Visual_Redesign_Report.md |
| Status | **CONDITIONAL PASS（M33.4 Admin P0 Redesign = COMPLETED）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.4 | **COMPLETED** |
| Visual Transformation | **NOT CONFIRMED** |
| Next | **M33.5 Web/Admin P1 Redesign** |

明确：**730 = Admin P0 页面级视觉重设计**；Admin P0 `Home.tsx`（Dashboard）已升级为 Industrial Operations Center，视觉结构/信息层级/工业技术语境落地，728 KpiCard/SectionHeader 全量消费；但整体 **Visual Transformation 仍需 M33.5-33.7 推进后才能判定 CONFIRMED**；1024 Web 既有 Shared Header overflow 按指令维持 Deferred（不擅自修复 Web/Admin Layout）。

### 731 M33.5 P1 Industrial Tech Visual Redesign First Batch（731 PASS）

| Field | Value |
|-------|-------|
| Iteration | `731_M33.5_P1_Industrial_Tech_Visual_Redesign_First_Batch`（指令 V3.2.3，M33.5 Web/Admin P1 页面级视觉重设计 · 第一批 / 仅前端展示层，后端零修改） |
| Baseline | 725=Audit PASS + 726=Contract + 727=Foundation COMPLETED + 728=Core Visual Components COMPLETED + 729=Web P0 CONDITIONAL PASS + 730=Admin P0 CONDITIONAL PASS；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| P1 Selection | VERIFIED（从 725 P1 优先级 + 726 契约恢复，经真实 Route Tree 核对为实际存在） |
| Web P1 | Web `/products/[slug]`（能力详情，`ProductDetailNav` 动态导航 + `ProductDetailContent`）+ Web `/articles`（文章中心，`ContentListLayout`） |
| Admin P1 | Admin `/operation-center`（运营中心，`OperationCenter`）+ Admin `/products`（能力管理，`ProductList`） |
| Page Structural Redesign | IMPLEMENTED（Understand 唯一目标，Anti-Cosmetic 满足：区域结构重组/信息层级重组/视觉锚点/技术信息模块化/P·S·T·M·A 分层） |
| Industrial Tech Visual Language | IMPLEMENTED（延续 P0：precise/technical/industrial operations；Industrial Dark Masthead + mono 元数据 + Tech Grid + 受控 accent/Cyan + 测量语言；无第二套视觉语言） |
| Component Consumption | 728 `KpiCard`/`SectionHeader` 全量消费；SectionTitle/GroupHeader/SpecTable/ContentCard /TypeMarker 均复用既有 Token；无第二套 Card/Container/Icon/Animation System |
| Information Hierarchy | VERIFIED（各页 H1 唯一 + 工业 SectionTitle 编组 + Primary·Secondary·Technical·Meta 分层；能力详情 01-07 mono 编组） |
| Anti-Cosmetic Gate | PASS（各页 Before→结构变化→After 证据链成立；非换色/换圆角/换字体/换 padding/换 icon 表层改动） |
| Responsive | 375/768/1024/1440 CDP 实测；4 页自身无横向溢出；Web 1024 `sw=1047`=既有共享 Site Header 溢出 = DEFERRED（前登记，非本任务引入）；Admin 全视口 `overscroll=false` |
| Accessibility | PASS（各页 h1=1；focusVisibleDefined=true；emoji=0；Web emptyA11yName=0；reduced-motion 保持；Admin emptyA11yName=3/+6=表格/图标按钮 AntD 既有基线，非 731 引入） |
| Build / Type / Lint | Web `next build` exit 0（Type 0 Error；Lint 仅既有基线 Warning）；Admin `tsc -b && vite build` exit 0（>500kB chunk=723 既有 P3 Defer）；Admin Lint NOT RUNNABLE（既有基线，无 eslint config，Defer） |
| Runtime | Web `:3000` `/products/[slug]`+`/articles`=200 真实数据（TC716 能力/真实文章）；Admin `:3001` `/operation-center`+`/products`=200 真实 demo.admin 数据；截图 16 张存 `database/_731_shots/`（Before 锚点沿用 `_725_shots/web_articles_1440.png`） |
| Architecture / Impact | Backend·API·Schema·Migration·Matching·Search·AI·Business Workflow 全 UNCHANGED；New Dependency=NONE；UI/Icon/Animation/Chart Library=NONE；packages/design-system=NOT CREATED |
| Scope Audit | Task-731 Files=`apps/web`（ProductDetailContent/ProductParameters/ContentCard/ContentListLayout）+ `apps/admin`（OperationCenter/ProductList）+ `_731_probe.mjs`+`_731_shots.mjs` + 截图 + 文档；Pre-existing=721-730 PRESERVED；Unexpected=无（apps/api/prisma/migration 零改动） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 731 报告） |
| Review Report | docs/_review/731_M33.5_P1_Industrial_Tech_Visual_Redesign_First_Batch_Report.md |
| Status | **PASS（M33.5 P1 First Batch Redesign = COMPLETED）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.5 | **COMPLETED** |
| Visual Transformation | **NOT CONFIRMED** |
| Next | **M33.6 Responsive + Accessibility Visual QA / Regression Gate** |

明确：**731 = M33.5 Web/Admin P1 第一批页面级视觉重设计**（能力详情 / 文章中心 / 运营中心 / 能力管理 共 4 页，Web≤2 + Admin≤2）；各页完成结构性重设计 + 真实运行态 + 375/768/1024/1440 + Accessibility + Before/After 证据；但整体 **Visual Transformation 仍需 M33.6-33.7 推进后才能判定 CONFIRMED**；1024 Web 既有 Shared Header overflow 按指令维持 Deferred（不擅自修复 Web/Admin Layout）。

### 732 M33.6 Responsive + Accessibility Visual QA / Regression Gate（732 PASS）

| Field | Value |
|-------|-------|
| Iteration | `732_M33.6_Responsive_Accessibility_Visual_QA_And_Regression_Gate`（指令 V3.2.3，M33.6 质量门禁 / Audit + Runtime Visual QA + Responsive + Accessibility + Regression Gate / 审计型零代码变更） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 First Batch；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | Audit + Runtime Visual QA + Responsive Verification + Accessibility Verification + Regression Gate + Documentation Sync；**非新视觉/页面/组件/能力** |
| M33 Verified Page Set | VERIFIED（7 页 × 375/768/1024/1440 = 28 次真实抓取，真实 Edge Headless+CDP Edg/151.0.4129.93） |
| Web P0 | `/`（Home）+ `/products`（能力目录）+ `/categories`（能力分类导航）— 729 |
| Web P1 | `/products/[slug]`（能力详情）+ `/articles`（文章中心）— 731 |
| Admin P0 | `/home`（Industrial Operations Center）— 730 |
| Admin P1 | `/operation-center`（运营中心）+ `/products`（能力管理）— 731 |
| Responsive | 375/768/1440 PASS（无意外溢出/裁剪/碰撞/破格/异常换行，tableOverflow=0 navOverflow=0）；Admin 全视口 sw≤iw（1024 sw=1024）；**Web 1024 sw=1047=既有共享 Site Header 溢出 = EXISTING BASELINE / DEFERRED / NOT M33.6 INTRODUCED** |
| Accessibility | PASS（各页 h1=1；Web emptyA11yName=0；Admin emptyA11yName=3/+6=既有 AntD Layout chrome；imgsNoAlt=0；focusVisibleDefined 各页 true；ARIA/aria-hidden/reduced-motion/主文本 Contrast≥4.5；headingSkips 为设计内结构性层级；<4.5:1 为设计内受控减弱 mono 元数据） |
| Runtime | Web `:3000` 5 路由=200 真实数据；Admin `:3001` 3 路由=200 真实 demo.admin+既有 API；`runtimeErrors=[]` 全 28 抓取；Hydration/ChunkLoad/Uncaught/Console Error=NONE |
| Build / Type / Lint | Web `next build` exit 0（Type 0 Error，44/44 路由）；Admin `tsc -b && vite build` exit 0（>500kB=既有 P3 Defer）；Web Lint exit 0=既有基线 Warning；**Admin Lint NOT RUNNABLE**=eslint.config.* 缺失既有基线 Defer |
| Regression | New Regression=0 / New P1=0 / New P2=0 / New P3=0；721-731 累积修改完整、7 页 After State 稳定；既有 Deferred 正确隔离 |
| Minimal Repair Record | NONE（不需进入修复闭环，零代码变更） |
| Scope Audit | In Scope=7 页×4 视口验证+`_732_gate.mjs`+`_732_probe.mjs`+截图（`database/_732_shots/` 32 PNG + `measure.jsonl` 28 条）+文档；Pre-existing=721-731 PRESERVED；Unexpected=无（apps/api/prisma/migration 零改动） |
| Architecture / Impact | NONE/FROZEN——本任务零代码变更；Schema/Backend/API/Prisma/Migration/Matching/Search/AI/RAG/Vector/Auth/RBAC/Workflow/Business Rules 全 UNCHANGED；无新依赖/UI/Icon/Animation/Chart Library/packages/design-system |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 732 报告） |
| Review Report | docs/_review/732_M33.6_Responsive_Accessibility_Visual_QA_And_Regression_Gate_Report.md |
| Status | **PASS（M33.6 = COMPLETED）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.6 | **COMPLETED / PASS** |
| Visual Transformation | **NOT CONFIRMED** |
| M33.7 Readiness | **READY** |
| Next | **M33.7 Before/After Verification** |

明确：**732 = M33.6 统一质量门禁**（Responsive / Accessibility / Visual Regression / Interaction / Runtime Stability），对 M33.3/33.4/33.5 全部 P0/P1 重设计页面建立 M33.7 Before/After 统一闸门；各页 After 状态/响应式/可访问性/回归稳定性全 PASS、无新增回归、无需修复闭环；但整体 **Visual Transformation 仍需 M33.7 判定后才能 CONFIRMED**；1024 Web 既有 Shared Header overflow 按指令继续 Deferred（非 M33.6 引入）；任务完成后 STOP，不自行进入 M33.7。

### 733 M33.7 Before/After Visual Transformation Verification（733 CONDITIONAL）

| Field | Value |
|-------|-------|
| Iteration | `733_M33.7_Before_After_Visual_Transformation_Verification`（指令 V3.2.3，M33.7 Before/After Visual Transformation Verification / Architecture Audit + Runtime Visual Verification + Before-After Gate / VERIFY ONLY 零代码变更） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 First Batch + 732=QA PASS；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | Before/After Visual Transformation Verification；判定 M33 可否 CONFIRMED；**非新视觉设计 / 非新页面；原则 Code Modification = FORBIDDEN** |
| Route Verification | VERIFIED（**8 Route** = Web 5 `/`、`/products`、`/categories`、`/products/[slug]`、`/articles` + Admin 3 `/home`、`/operation-center`、`/products`）× 4 Viewport = **32 Runtime Visual Captures** |
| 732 Consistency | **CORRECTED（REPORT STATISTICAL ERROR）**：732 报告「7 pages/28 captures」实测为 **8×4=32 PNG**，与 M33.7 理论矩阵一致（非 Execution Failure） |
| Before Evidence | **PARTIAL**（Home/Products/Articles/AdminHome = `_725_shots` 真实截图 VALID；Categories/Detail/OperationCenter/AdminProducts = 报告描述 PARTIAL；未伪造 Before） |
| After Evidence | **PASS**（`_732_shots` 8×4=32 截图） |
| Structural Change | **PARTIAL（强度不均）**：`/products` = **STRONG**（营销商品网格→Industrial Capability Discovery）；Admin `/home` = MODERATE（→工业运营 masthead，内容区仍 ~60% 白卡）；Home `/` = **WEAK（首屏）**（首屏结构同构、`monoMeta=1`、白营销卡片） |
| Home Transformation | **NOT CONFIRMED**（Homepage Gate Q3 NO / Q7 WEAK / Q8 YES / Q10=NO → FIRST-SCREEN WEAK，Core P0 Anchor 未达显著转型） |
| Cross-Page Consistency | **CONDITIONAL**（统一 tokens/masthead/mono/分区已成形，Industrial Tech 认同度不均：Products 强、Home 首屏/AdminHome 内容区弱） |
| Visual Transformation Gate | V1 PARTIAL / V2 PASS / V6 PASS / V7 PASS / V8 PASS / V9 PASS / V10 PASS / V11 PASS / **V12 FAIL（Home 首屏）** |
| Responsive / Accessibility / Runtime | **PASS**（375/768/1440 无新溢出；1024 Web Header 既有 Defer；h1=1/img alt=0/focus/ARIA/reduced-motion 保留、contrast 区分 Ess/Supp/Deco 必要信息合格；HTTP Web `/`=200 + Admin `/login`=200；732 全 32 抓取 runtimeErrors=[]） |
| Regression | **NONE**（Business/API/Schema/Route/Auth/RBAC/Workflow/Search/Matching 全 UNCHANGED；New P1/P2/P3=0） |
| Minimal Repair Candidates | **REGISTERED（本任务不实施）**：VT-R1（Home 首屏 Hero Industrial Tech 锚点，A）/ VT-R2（Home 首屏脱离营销 Banner，A）/ VT-R3（Admin Home 内容区→IOC 深化，B）/ VT-R4（补 4 Route Before Evidence，C）/ VT-R5（Home 首屏 mono 元数据注入，B）；未自动扩 P2/加页面/入 M33.8/重设组件/改 Header/建第二 Design System |
| Architecture / Impact | **NONE/FROZEN**——本任务零代码变更；Schema/Backend/API/Matching/Search/AI/RAG/Vector/Auth/RBAC/Workflow 全 UNCHANGED；无新依赖/UI/Icon/Animation/Chart/`packages/design-system` |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 733 报告） |
| Review Report | docs/_review/733_M33.7_Before_After_Visual_Transformation_Verification_Report.md |
| Status | **CONDITIONAL（M33.7 = COMPLETED / CONDITIONAL）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.7 | **COMPLETED / CONDITIONAL** |
| Visual Transformation | **NOT CONFIRMED** |
| Next | **Minimal Visual Repair（等待下一步审查，本任务强制 STOP；未进入 M33 Final Closeout，未修复任何页面，未将 VT 标记 CONFIRMED）** |

明确：**733 = M33.7 Before/After 证据验证**，遵循 `Build PASS ≠ Visual Transformation CONFIRMED`；Evidence=PARTIAL（Before）+ 结构性变换不均（Home 首屏 WEAK）→ **Visual Transformation = NOT CONFIRMED**（Home 核心 P0 页视觉转型不足，未落入 CONDITIONALLY CONFIRMED）；已登记 5 项 Minimal Repair Candidates（优先 Home 首屏 Industrial Tech 锚点/脱离营销 Banner），本任务不实施；任务完成后 STOP，不自动进入 M33 Final Closeout。

### 734 M33.8 Home Industrial Tech Visual Repair（734 COMPLETED）

| Field | Value |
|-------|-------|
| Iteration | `734_M33.8_Home_Industrial_Tech_Visual_Repair`（指令 V3.2.3，M33.8 Home Industrial Tech Visual Repair / Development + Visual Repair + Runtime Visual QA + Documentation Synchronization / 仅 Web Home `/` 首屏最小视觉修复） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 First Batch + 732=QA PASS + **733=Before-After Verification（CONDITIONAL）**；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | 修复 733 已确认的核心阻断问题——Home `/` 首屏 Generic B2B / Marketing Banner Residue；对首屏视觉构成做最小必要修复；**非 Home 重设计 / 非扩大 M33 / 非 Closeout** |
| Scope | In=Home `/` 首屏视觉构成（`apps/web/src/components/home/HeroSection.tsx` 为唯一被修改源码文件）+ 既有 visual components/tokens/CSS/Tailwind/icon/asset 复用；Out=Admin Home/Admin Products/Operation Center/Categories/Product Detail/Articles/Header 全局重设计/Footer/全局导航/M33 Final Closeout |
| Repair Targets | **VT-R1（Home 首屏 Hero Industrial Tech 锚点，PRIMARY）/ VT-R2（Home 首屏脱离营销 Banner，PRIMARY）/ VT-R5（Home 首屏 mono 技术元数据语言增强，SUPPORTING）** |
| Home Visual Changes | 1) 顶部 mono 遥测带 `SYSTEM: ONLINE` / `NDT BASE: UT / RT / PT` / `VISNDT.SYS / 2026`；2) 坐标标签 `[ +00.000° / 123.456E , 45.678N ]`；3) 非对称信息组织（左文本+技术能力 chips mono 代码 `DSC-01 / CNX-02 / MCH-03`、右工业仪器面板）；4) VT-R1 工业检测仪器视觉锚点（SVG gauge 量程弧+24 刻度+指针读数+坐标十字线 `AX:28.7°`+探伤信号线性波形+`INSTRUMENT / NDT` 面板标题+`GAIN:42dB`+`SIG/BASE/MODE` 遥测格）；5) VT-R2 脱离营销 Banner——CTA 收敛为技术平台入口（mono `ENTER`/`SCAN`），业务入口（/products /solutions /register?role）全保留；首屏收束由白营销卡片改为模块化测量轴 rail（01 DISCOVER / 02 CONNECT / 03 MATCH） |
| Technical Metadata | **CONFIRMED（VT-R5）**：`monoMeta`（同 733 探针口径）由 **733=1** 提升至 **375=5 / 768=9 / 1024=9 / 1440=9**（`_734_shots/measure.jsonl` 实测）；mono / measurement / coordinate 语言实质增强 |
| Information Hierarchy | **CHANGED**：首屏由居中式营销 Hero → 非对称工业技术构成 + 空间化/模块化技术信息组织；测量轴 rail 取代白卡作为首屏收束（Anti-Cosmetic / 结构变化） |
| Before Evidence | **VALID**（Home 沿用 `_725_shots/web_home_1440` / `web_home_375`；733 客观记录为首屏营销 Banner 且 `monoMeta=1`；未伪造 Before） |
| After Evidence | **PASS**（`database/_734_shots/`：home_1440 / home_1024 / home_768 / home_375 + measure.jsonl；真实运行 Edge Headless+CDP） |
| Responsive / Accessibility / Runtime | **PASS**（375/768/1024/1440 无新溢出/横向滚动/裁剪/碰撞/破格/堆叠塌陷；**1024 Web Header sw=1047=EXISTING BASELINE/DEFERRED**；h1=1、装饰 SVG/遥测点 `aria-hidden`、焦点/reduced-motion 保留；Web `/`=200、`runtimeErrors=[]`） |
| Regression | **NONE**（Business/API/Schema/Route/Auth/RBAC/Workflow/Search/Matching 全 UNCHANGED；URL/route/API/业务语义未改；New P1/P2/P3=0） |
| Home Special Gate（733 复测，仅首屏） | **Q1=YES Q2=YES Q3=YES Q4=YES Q5=YES Q6=YES Q7=YES Q8=YES(首屏) Q9=YES Q10=YES**（目标达成：Q10=YES 且 Q2/Q3/Q5/Q7=YES；截图脱离代码即可识别为工业检测技术平台） |
| Architecture / Impact | **NONE/FROZEN**——仅 Home 首屏展示层修复；Schema/Backend/API/DTO/Migration/Matching/Search/AI/RAG/Vector/Auth/RBAC/Workflow/Business Rules 全 UNCHANGED；无新依赖/UI/Icon/Animation/Chart Library/`packages/design-system`；无第二套视觉语言 |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 734 报告） |
| Review Report | docs/_review/734_M33.8_Home_Industrial_Tech_Visual_Repair_Report.md |
| Status | **COMPLETED（M33.8 = COMPLETED）** |
| Home Visual Repair | **CONFIRMED（首屏，Q10=YES；VT-R1/VT-R2/VT-R5 证据成立）** |
| M33 | **IMPLEMENTATION IN PROGRESS** |
| M33.7 | **COMPLETED / CONDITIONAL** |
| Visual Transformation（全局） | **NOT CONFIRMED（严禁在 735 复证前提前声明 CONFIRMED）** |
| Next | **735 Visual Transformation Verification（本任务完成后强制 STOP，未自动执行 735 / Closeout / Admin / Header / 全局 Design System 修改）** |

明确：**734 = M33.8 Home 首屏最小视觉修复**，遵循 `Minimal Repair > Scope Expansion` / `Build PASS ≠ Visual Transformation PASS`；唯一改动源码文件 `HeroSection.tsx`（首屏视觉构成）→ **Home 首屏 Visual Repair = CONFIRMED**（Q10=YES、工业仪器视觉锚点、mono/measurement/coordinate 语言、测量轴 rail 替代白卡）；但**全局 Visual Transformation 不因单页 Repair 自动 CONFIRMED**，严格交由 735 复证后判定；`M33 = IMPLEMENTATION IN PROGRESS（保持）`；任务完成后 STOP，不自动执行 735/Closeout/其他页面/Admin/Header/全局 Design System 修改。

### 735 M33.9 Global Visual Transformation Verification（735 PASS / Global NOT CONFIRMED / CASE B）

| Field | Value |
|-------|-------|
| Iteration | `735_M33.9_Global_Visual_Transformation_Verification`（指令 V3.2.3，M33.9 Global Visual Transformation Verification / Architecture Audit + Runtime Visual Verification + Before-After Evidence Audit + Cross-Page Visual QA + Documentation Synchronization / VERIFY ONLY 零代码改动） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 First Batch + 732=QA PASS + 733=Before-After（CONDITIONAL）+ **734=Home Repair（CONFIRMED）**；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | 复核 733（NOT CONFIRMED）+ 734（Home CONFIRMED）后，判定 Global Visual Transformation 是否 CONFIRMED；**非新视觉设计 / 非新页面 / 非 Repair 实施；原则 Code Modification = FORBIDDEN** |
| Route Verification | **VERIFIED（Web=5/Admin=3/Total=8）**：`/`·`/products`·`/categories`·`/products/[slug]`·`/articles`（Web P0/P1）+ `/home`·`/operation-center`·`/products`（Admin P0/P1）；HTTP 200；未新增 Route/Page |
| Runtime Evidence | **PASS（32/32）**：`_735_gate.mjs` 真实 Edge Headless+CDP Edg/151.0.4129.93，8 Route × 4 Viewport = **32 PNG** 至 `database/_735_shots/` + measure.jsonl；逐抓取 `runtimeErrors=[]`（Hydration/ChunkLoad/Uncaught/ConsoleError=NONE） |
| Before Evidence | **PARTIAL**（Home/Products/Articles/Admin Home = VALID；Categories/Product Detail/Operation Center/Admin Products = PARTIAL，保持不伪造） |
| After Evidence | **PASS**（32 Runtime Captures，全部真实当前代码） |
| Home Special Gate | **Q1–Q10 = YES → Home = CONFIRMED**（735 实测；monoMeta 5/9/9/9；仪器面板/遥测/坐标/NDT BASE/DSC·CNX·MCH/测量轴运行时呈现） |
| Products Gate | **STRONG（733 复证维持）**：能力发现结构/UT·RT·PT/技术筛选/Capability ID/技术 Metadata/查看能力详情全保留 |
| Admin Home Gate | **MODERATE**（IOC masthead + 遥测 + 运营层级存在；内容区白卡依赖残留 VT-R3；依指令登记 VT-R3 不实施） |
| Cross-Page Consistency | **CONDITIONAL（Perceptual Consistency）**：Web Home/Products 一致 STRONG；Admin Home 内容区与 Web 次页面（Categories/Detail/Articles）mono 技术语言强度不均（monoMeta 0–3 vs 5–9）；非仅 Token 一致 |
| V1–V12 | V2/V3/V4/V6/V7/V8/V9/V10/V11=PASS；V1=PASS(PARTIAL)；**V5=PARTIAL、V12=CONDITIONAL** |
| Responsive | **PASS**：Web 375/768/1440 无新溢出、Admin 全视口 sw≤iw；**1024 Web sw=1047=EXISTING BASELINE/DEFERRED（非 735 引入，734 未改 Header）** |
| Accessibility | **PASS（无新回归）**：h1=1、imgsNoAlt=0、Web emptyA11yName=0、focusVisibleDefined≥1、emoji=false；装饰 SVG aria-hidden；contrast 区分 Ess/Supp/Deco（不把 mono 弱化当豁免伞、不机械 FAIL）；Admin emptyA11yName 3–6 与 Web Products/Articles headingSkips=1 为既有基线（注册 MR-735-2） |
| Runtime / Build | **PASS**：`tsc --noEmit` PASS + `next build` exit 0；32 抓取 runtimeErrors=[]；Build PASS ≠ Visual Transformation PASS |
| Regression | **NONE**：Business/API/Schema/Route/Auth/RBAC/Workflow/Search/Matching 全 UNCHANGED；Migration=NONE；New P1/P2/P3=0；New Dependency/UI/Design System/Icon/Animation=0 |
| Minimal Repair Candidates | **REGISTERED（本任务不实施）**：VT-R3（Admin Home IOC 深化，B，延续）/ MR-735-1（Web 次页面 mono 技术语言补强，B，新观察）/ MR-735-2（Admin emptyA11yName + Web headingSkips 治理，C，注册观测）。发现≠实施 |
| Architecture / Business Impact | **UNCHANGED / FROZEN**（VERIFY ONLY 零代码改动；冻结区 `git status` 无 apps/api·prisma·migration） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 735 报告） |
| Review Report | docs/_review/735_M33.9_Global_Visual_Transformation_Verification_Report.md |
| Status | **PASS（Verification 完整执行）** |
| M33.9 | **COMPLETED（Verification；判定 NOT CONFIRMED）** |
| Global Visual Transformation | **NOT CONFIRMED（CASE B — Minimal Visual Repair）** |
| M33 | **IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）** |
| M33 Final Closeout | 未进入（需 Global CONFIRMED 方可提出） |
| Next | **Minimal Visual Repair（MR Candidates 已登记，不自动实施）** |

明确：**735 = M33.9 Global Visual Transformation Verification**，遵循 `Minimal Verification > Scope Expansion` / `Verify Before Claiming Transformation` / `Home Repair PASS ≠ Global Transformation PASS`；After Evidence = 32 Runtime Captures、Before = PARTIAL（4 VALID + 4 PARTIAL，未伪造）；Home = CONFIRMED、Products = STRONG、Admin Home = MODERATE（VT-R3 残留）；因 **V5 = PARTIAL、V12 = CONDITIONAL、Cross-Page Consistency = CONDITIONAL** 触发 **Case B → Global Visual Transformation = NOT CONFIRMED**；`M33 = IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）`；After → 733/734 一致，登记 Minimal Repair Candidates 交由下一步，本任务 STOP，**不自动执行 M33 Final Closeout / 任何新 Repair / VT-R3 / Header / Design System 修改**。

### 736 M33.10 Web Secondary Pages Industrial Tech Visual Repair（736 PASS / M33.10 COMPLETED / 仅实施 MR-735-1）

| Field | Value |
|-------|-------|
| Iteration | `736_M33.10_Web_Secondary_Pages_Industrial_Tech_Visual_Repair`（指令 V3.2.3，M33.10 Web Secondary Pages Industrial Tech Visual Repair / Development + Visual Repair + Runtime Visual QA + Documentation Synchronization / 最小范围 Web 次页面视觉修复） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 First Batch + 732=QA PASS + 733=Before-After（CONDITIONAL）+ 734=Home Repair（CONFIRMED）+ **735=Verification（NOT CONFIRMED）**；**M32=CLOSED（保持未重开）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | 实施 735 已登记的 **MR-735-1（Web 次页面 Categories/Detail/Articles mono 技术语言补强拉齐 Home/Products，B）**；**不实施 VT-R3 / MR-735-2**；仅 3 个 Web 次页面目录/规格/索引台账补强 |
| Route Verification | **VERIFIED（3 Route）**：`/categories`·`/products/[slug]`·`/articles`；HTTP 200；未新增 Route/Page/API/Model |
| Files Changed | **恰 4 文件**：`apps/web/src/app/categories/page.tsx`（+186-93）+ `apps/web/src/components/products/ProductDetailContent.tsx`（+118）+ `apps/web/src/components/content/ContentListLayout.tsx`（+107）+ `apps/web/src/app/articles/page.tsx`（+1）；其余 web/admin/design-tokens 为 721-735 既有修改；新增证据 `database/_736_gate.mjs` + `database/_736_shots/*.png+measure.jsonl`；apps/api·prisma·migration 零改动 |
| Categories Repair | **CONFIRMED**：技术目录台账 `CAPABILITY / DIRECTORY INDEX` + 卡片 mono `TECH ROUTE` 描述 + 子能力计量 `SUB NN`（来源既有 category.slug/children 真实数据） |
| Product Detail Repair | **CONFIRMED**：技术规格台账 `MODEL / CATEGORY / SPEC FIELDS / REV`（mono 计量元数据，来源既有 product 真实数据）+ 工业技术章节标题 |
| Articles Repair | **CONFIRMED**：可选技术索引台账 `ART-INDEX / Industrial Technical Documentation`（仅 articles 传入 `techIndex`，`ContentListLayout` 其余内容页不渲染） |
| After Evidence | **PASS（12/12 Runtime Captures）**：`_736_gate.mjs` 真实 Edge Headless+CDP，3 Route × 4 Viewport（375/768/1024/1440）= 12 PNG + measure.jsonl；逐抓取 `runtimeErrors=[]` |
| Before Evidence | **PARTIAL**（复用 735 口径：Categories/Detail/Articles = PARTIAL，无本任务新真 Before，未伪造） |
| monoMeta 探针口径 | 如实记录：735 探针（匹配 Home 遥测点位模式）对次页面台账返回 0；次页面 mono 语言以**运行时截图视觉证据**确证 → `Industrial Tech Language = IMPROVED`（不虚报探针数值） |
| Responsive | **PASS**：375/768/1024/1440 新修复元素无新溢出；**1024 Web sw=1047 overflowEls=5 = 既有共享 Header baseline / DEFERRED（非本任务引入，未修 Header）** |
| Accessibility | **PASS（无新回归）**：h1=1/imgsNoAlt=0/emptyA11yName=0/focusVisibleDefined=1/emoji=false；装饰 SVG aria-hidden；**Web Articles headingSkips=1 = 既有基线（MR-735-2 注册范围，本任务不强行治理）** |
| Runtime / Build | **PASS**：`next build` **exit 0**；12 抓取 runtimeErrors=[]；Build PASS ≠ Visual Transformation Confirm |
| Regression | **NONE**：Business/API/Schema/Route/Auth/RBAC/Workflow/Search/Matching 全 UNCHANGED；Migration=NONE；New P1/P2/P3=0；New Dependency/UI/Icon/Animation/Chart Library/Design System=0 |
| Structural Change | **CONFIRMED（Anti-Cosmetic）**：三页均发生 Information Hierarchy / Technical Metadata Organization / Technical Anchor 变化（台账框 + mono 计量 + 技术分组），非仅换色/字体/圆角/阴影/间距 |
| Architecture / Business Impact | **UNCHANGED / FROZEN**（仅展示层 Repair；Schema/Backend/API/Migration/Business Rules 全 UNCHANGED；无第二套视觉语言） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 736 报告） |
| Review Report | docs/_review/736_M33.10_Web_Secondary_Pages_Industrial_Tech_Visual_Repair_Report.md |
| Status | **PASS（MR-735-1 实施闭环）** |
| M33.10 | **COMPLETED**（仅在实际完成并验证通过时使用） |
| Global Visual Transformation | **NOT AUTOMATICALLY CONFIRMED（736=Repair ≠ Global Verification，不得自动改 CONFIRMED）** |
| M33 | **IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）** |
| M33 Final Closeout | 未进入（需 Global CONFIRMED 方可提出） |
| Next | **735-derived Global Re-Verification / next explicitly approved repair** |

明确：**736 = M33.10 Web 次页面工业技术视觉修复**，遵循 `Minimal Repair > Scope Expansion` / `Structural Transformation > Cosmetic` / `Verify Before Claiming`；Categories/Product Detail/Articles 三页分别完成工业技术目录感、技术规格台账、技术内容索引台账补强（结构性强于化妆性）；After Evidence = 12 Runtime Captures、Before = PARTIAL（未伪造）；`M33.10 = COMPLETED`；**Global Visual Transformation = NOT AUTOMATICALLY CONFIRMED**（736=Repair ≠ Global Verification）；`M33 = IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）`；任务完成后 **STOP**，不自动执行 737/738 / M33 Final Closeout / VT-R3 / MR-735-2 / Header / 全局 Design System 修改。

### 737 M33.11 Global Visual Transformation Re-Verification（737 PASS / Global = NOT CONFIRMED / Case B / 仅登记）

| Field | Value |
|-------|-------|
| Iteration | `737_M33.11_Global_Visual_Transformation_Re_Verification`（指令 V3.2.3，M33.11 Global Visual Transformation Re-Verification / Audit + Runtime Visual Verification + Before-After Evidence + Cross-Page Perceptual QA + Documentation Synchronization） |
| Baseline | 725=Audit + 726=Contract + 727=Foundation + 728=Core + 729=Web P0 + 730=Admin P0 + 731=P1 + 732=QA + 733=Before-After（CONDITIONAL）+ 734=Home Repair（CONFIRMED）+ 735=Verification（NOT CONFIRMED）+ 736=Web Secondary Repair（PASS）；**M32=CLOSED（保持）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | **VERIFY ONLY**：判断 736 后 Global Visual Transformation 是否 CONFIRMED；默认不修复，发现问题→登记（Observation→Evidence→Candidate） |
| Route Verification | **VERIFIED（8 Route）**：`/`·`/products`·`/categories`·`/products/[slug]`·`/articles` + `/home`·`/operation-center`·`/products`；HTTP 200 |
| Runtime Evidence | **PASS（32/32）**：`_737_gate.mjs` 真实 Edge Headless+CDP（Edg/151.0.4129.93）8×4 = **32 PNG** `database/_737_shots/` + measure.jsonl；逐抓取 runtimeErrors=[] |
| Build / TypeScript | **PASS**：`tsc --noEmit` + `next build` **exit 0** |
| Web Verification | **Home=CONFIRMED**（established, monoMeta 5-9）· **Products=STRONG**（established, 无回归）· **Categories=CONFIRMED**（工业检测能力目录）· **Product Detail=CONFIRMED**（技术能力档案）· **Articles=CONDITIONAL**（generic-blog 残留 → documentation theater） |
| Admin Verification | **VERIFY ONLY**：Admin Home / Operation Center / Admin Products = **MODERATE**（无新回归；VT-R3 持续登记） |
| V1–V12 | V1=PASS(PARTIAL) V2=PASS V3=PASS V4=PASS V5=IMPROVED V6=PASS V7=PASS V8=PASS V9=PASS V10=PASS V11=PASS **V12=CONDITIONAL** |
| Cross-Page Visual Consistency | **CONDITIONAL**（Home/Categories/Detail/Products 强工业一致；Articles 为感知断层点） |
| Responsive | **PASS**（无新溢出；**1024 Web sw=1047 overflowEls=5 = 既有共享 Header baseline / DEFERRED**） |
| Accessibility | **PASS（无新回归）**（Articles headingSkips=1 与 Admin emptyA11y=3/3/6 = 既有 MR-735-2） |
| Regression | **NONE**（Business/API/Schema/Migration/Route/Auth/RBAC/Search/Matching/Demand/RFQ/Content 全 UNCHANGED；New P1/P2/P3=0；New Dependency/UI/Icon/Animation/Chart/Design System=0） |
| Architecture / Business Impact | **UNCHANGED / FROZEN**（Apps/api·prisma·migration 零改动；无第二套视觉语言） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 737 报告） |
| Review Report | docs/_review/737_M33.11_Global_Visual_Transformation_Re_Verification_Report.md |
| Status | **PASS** |
| M33.11 | **COMPLETED** |
| Global Visual Transformation | **NOT CONFIRMED（CASE B — Minimal Visual Repair Required）** |
| M33 | **IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）** |
| M33 Final Closeout | 未进入 |
| Minimal Repair Candidates | **MR-737-1** Articles generic-blog 残留补齐技术文档语言 · **MR-737-2** 1024 Web Header 共享溢出（既有/DEFERRED）· **MR-737-3** Articles headingSkips + Admin emptyA11y（既有 MR-735-2）· **MR-737-4** Admin Home IOC 深化（VT-R3 续）· **MR-737-5** Op-Center/Home「平均匹配度 10000%」异常显示（数据口径，登记待核）· **MR-737-6** monoMeta 探针口径不识别次页面台账（建议扩探针）；**仅登记不实施** |
| Next | 下一个明确批准的最小补强任务或 Global 复证（本任务 STOP，未自动实施 MR-737-* / 738 / Closeout / VT-R3） |

明确：**737 = M33.11 Global Visual Transformation Re-Verification**，唯一职责=判断 736 后 Global 是否 CONFIRMED。结论 **Global Visual Transformation = NOT CONFIRMED（CASE B）**：Runtime/Build/Regression 全 PASS，但 V12=CONDITIONAL、Cross-Page=CONDITIONAL——**Articles 仍残留 generic-blog 依赖（READ → / 1 MIN 阅读 / TYPE·文章 / 「企业动态、行业新闻」/ Demo Admin）**，使全 Web 感知出现认知断层，虽 ART-INDEX 台账已提升但未达感知一致性（V12）与跨页一致性（Cross-Page）PASS 门槛。Admin 三页保持 MODERATE（无新回归）。**仅登记 MR-737-* 候选，不实施任何修复**；`M33.11=COMPLETED`、`M33=IMPLEMENTATION IN PROGRESS（保持不 CLOSED）`、Global 不回改 CONFIRMED、M33 Final Closeout 未进入；任务完成后 **STOP**。

### 738 M33.12 Articles Technical Documentation Minimal Visual Repair（738 PASS / MR-737-1 实施闭环）

| Field | Value |
|-------|-------|
| Iteration | `738_M33.12_Articles_Technical_Documentation_Minimal_Visual_Repair`（指令 V3.2.3，M33.12 Articles Technical Documentation Minimal Visual Repair / Development + Minimal Visual Repair + Runtime Verification + Documentation Synchronization / 单批准修复 MR-737-1） |
| Baseline | 736=Web Secondary Repair（PASS）+ 737=Re-Verification（PASS / Global NOT CONFIRMED / Case B，登记 **MR-737-1**）；**M32=CLOSED（保持）**；**M33=IMPLEMENTATION IN PROGRESS** |
| Task Type | 实施仅 **MR-737-1（Articles generic-blog 残留补齐技术文档语言）**；**不扩 MR-737-2~6 / VT-R3 / MR-735-2**；收敛为 `Industrial Technical Documentation + Technical Documentation Interaction` |
| Route Verification | **VERIFIED（1 Route）**：`/articles`；HTTP **200**；未新增 Route/Page/API/Model |
| Files Changed | **恰 2 文件**：`apps/web/src/app/articles/page.tsx`（D 项文案 + countLabel）+ `apps/web/src/components/content/ContentCard.tsx`（A/B/C/E/F 卡片技术文档化；真实依赖核查必需）；未触碰 apps/api·prisma·migration·ContentListLayout·业务逻辑 |
| A `READ →` | **RESOLVED** → `VIEW DOC →`（文档查阅动作，无虚假下载能力） |
| B `1 MIN` | **RESOLVED**：删除卡片 `{n} MIN` 阅读时长博客化包装 |
| C `TYPE / 文章` | **RESOLVED** → `TYPE / {item.type}` 真实枚举（`ARTICLE`） |
| D `企业动态、行业新闻` | **RESOLVED**：页面文案 → 技术资料库 / 工业检测方法文档 / 能力知识 / 行业技术实践 / 共 N 项技术资料 |
| E `Demo Admin` | **HANDLED**：真实后端数据（`item.author.name`），不伪造/不改库；以技术元数据 `AUTHOR / {name}` 呈现 |
| F 扁平卡片流 | **CONFIRMED**：卡片层级强化为技术文档条目（TYPE 技术码 + 日期 + AUTHOR + VIEW DOC 动作） |
| After Evidence | **PASS（4/4 Runtime Captures）**：`_738_gate.mjs` 真实 Edge Headless+CDP（Edg/151.0.4129.93）1 Route × 4 Viewport（375/768/1024/1440）= 4 PNG `database/_738_shots/` + measure.jsonl；Before/After 双态实测：Before `residueHits=[READ,1 MIN,文章,企业动态,行业新闻]`/hasViewDoc=false → After `residueHits=[文章]`（仅真实页面标题「文章中心」）/hasViewDoc=true；逐抓取 runtimeErrors=[] |
| Before Evidence | **复用 737 基线**（`database/_737_shots/web_articles_*.png` + measure.jsonl），未伪造/重建 |
| Structural Transformation | **CONFIRMED（Anti-Cosmetic）**：`Generic Blog Interaction → Technical Documentation Interaction` 结构性语义变化（分类分类语义/阅读时长移除/CTA 消费→文档查阅/作者→技术元数据），非仅颜色/字体/border/spacing |
| Responsive | **PASS**：375/768/1440 overflowEls=0；**1024 Web sw=1047 overflowEls=5 = 既有共享 Header baseline / DEFERRED（非本任务引入）** |
| Accessibility | **PASS（无新回归）**：h1=1/imgsNoAlt=0/emptyA11yName=0/focusVisibleDefined=1/emoji=false；**Articles headingSkips=1 = 既有 MR-735-2 baseline / NOT IN SCOPE** |
| Runtime / Build | **PASS**：`next build`（web/admin）**exit 0** + `tsc --noEmit` PASS；4 抓取 runtimeErrors=[]；Build PASS ≠ Global Visual Confirm |
| Regression | **NONE**：Business/API/Schema/Migration/Route/Content/ContentListLayout 数据链/Pagination/CTA/Navigation 全 UNCHANGED；New P1/P2/P3=0；New Dependency/UI/Icon/Animation/Chart/Design System=0 |
| Architecture / Business Impact | **UNCHANGED / FROZEN**（仅展示层 Repair；Schema/Backend/API/Migration/Business Rules 全 UNCHANGED；无第二套视觉语言） |
| Documentation | UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 738 报告） |
| Review Report | docs/_review/738_M33.12_Articles_Technical_Documentation_Minimal_Visual_Repair_Review_Report.md |
| Status | **PASS（MR-737-1 实施闭环）** |
| M33.12 | **COMPLETED** |
| Global Visual Transformation | **NOT AUTOMATICALLY CONFIRMED（738=Minimal Repair ≠ Global Verification）** |
| M33 | **IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）** |
| M33 Final Closeout | 未进入（需 Global CONFIRMED 方可提出） |
| Next | **Global Re-Verification（739_M33.13）——仅当 738 证据支持且经明确批准后执行；本任务 STOP，不自动执行 739 / Closeout / Global Confirmation** |

明确：**738 = M33.12 Articles 技术文档视觉修复**，仅实施 **MR-737-1**（真实依赖核查确认 generic-blog 残留 A/B/C/E/F 位于共享 `ContentCard.tsx`，纳入必要修改面）；各残留项 RESOLVED/HANDLED、`Structural Transformation = CONFIRMED`（结构性强于化妆性）、After Evidence = 4 Runtime Captures 实测 Before/After 双态（residue 归零至仅真实标题词、hasViewDoc=true、runtimeErrors=[]）、Before = 复用 737 基线（未伪造）；`M33.12 = COMPLETED`；**Global Visual Transformation = NOT AUTOMATICALLY CONFIRMED**（738=Minimal Repair ≠ Global Verification）；`M33 = IMPLEMENTATION IN PROGRESS（保持，不 CLOSED）`；任务完成后 **STOP**，不自动执行 739 / M33 Final Closeout / MR-737-2~6 / VT-R3 / MR-735-2 / Header / 全局 Design System 修改。

### 739 M33.13 Global Visual Transformation FINAL Re-Verification（739 PASS / Global = CONFIRMED / M33 READY FOR FINAL CLOSEOUT）

| Field | Value |
|-------|-------|
| Iteration | `739_M33.13_Global_Visual_Transformation_Final_Re_Verification`（指令 V3.2.3，M33.13 Global Visual Transformation Final Re-Verification / Audit + Verification + Final Gate / Verify Only，零生产代码修改） |
| Baseline | 725–738 M33 Visual Transformation；**738 = PASS**（MR-737-1 / Articles=CONFIRMED / Global=NOT AUTO-CONFIRMED）；**737** 曾 Global NOT CONFIRMED / Case B |
| Task Type | **最终一次独立 Global Re-Verification**——判断 Web+Admin 代表性页是否达到 M33 Global Visual Transformation 可接受确认门槛；非新视觉优化 |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-738 PRESERVED；apps/api·prisma·migration 零改动=FROZEN） |
| Routes / Viewports | 8 Routes × 4 Viewports（375/768/1024/1440） |
| Evidence | **32/32 Runtime Captures**（`database/_739_shots/` + measure.jsonl，Edge Headless+CDP Edg/151.0.4129.93） |
| Runtime | **PASS**：32/32 `runtimeErrors=[]`，`ALL_HTTP_OK=true` |
| Build | **PASS**：`tsc --noEmit` exit 0（生产 `next start` web 3000/admin 3001 运行态验证） |
| V1–V12 | **V1=PASS V2=PASS V3=PASS V4=PASS V5=PASS V6=PASS V7=PASS V8=PASS V9=PASS V10=PASS V11=PASS V12=PASS** |
| Web Perceptual | **CONFIRMED**（Gate A/B）：Home/Products/Categories/Product Detail/Articles 均感知为 Industrial Inspection / Industrial Technical Platform（标准码/能力码/ART-INDEX 台账、MODEL·CATEGORY·SPEC FIELDS·REV、DOC·TYPE·REV、VIEW DOC）；非 Generic SaaS/CMS/Blog/E-commerce；**Cross-Page = PASS** |
| Admin Perceptual | **ACCEPTABLE**（Gate C）：Home=Vertical IOC；Operation-center=MODERATE（与 737 一致无新回归）；Products=Vertical 工业能力管理；无严重视觉断层 |
| Gates A–F | **PASS**；**M33 Core Blocker = NONE** |
| Regression | **NONE**：New P1/P2/P3=0；New Dependency=0；Business/API/Schema/Migration/Route/Auth/RBAC/Search/Matching/Demand/RFQ/Content/Pagination/CTA/Navigation/Data 全 UNCHANGED |
| Respond | 1024 Header sw=1047 overflowEls=5-6=既有 Header baseline/DEFERRED；headingSkips/Admin emptyA11y=Accessibility Baseline（MR-735-2）；Admin 10000% 匹配度+数据混排=Data/Metric 候选；monoMeta 次页面=Probe（MR-737-6）；Admin IOC=VT-R3；其余=Cosmetic/New Visual（禁止入 M33） |
| Final Global Decision | **`Global Visual Transformation = CONFIRMED`**（§9 Decision A：V12=PASS + Cross-Page=PASS + 无 Core Blocker） |
| M33.13 | **COMPLETED**（M33 Visual Transformation Objective = ACHIEVED） |
| M33 | **READY FOR FINAL CLOSEOUT** |
| M33 Final Closeout | **NEXT EXPLICITLY APPROVED TASK（不自动执行）** |
| Review Report | docs/_review/739_M33.13_Global_Visual_Transformation_Final_Re_Verification_Report.md |

明确：**739 = M33 FINAL GLOBAL GATE**，对 725–738 做最终一次独立 Re-Verification（Verify Only，零生产代码修改）：真实运行态 **32 Runtime Captures**（web 5 + admin 3 × 4 viewport）、32/32 `runtimeErrors=[]`、`ALL_HTTP_OK=true`、`tsc --noEmit` exit 0；逐页截图判定 **Web 五页均感知为 Industrial Inspection / Industrial Technical Platform**（Gate A）且跨页一致（Gate B）、Admin Vertical/MODERATE 无严重断层（Gate C）、Gates D–F PASS、`M33 Core Blocker = NONE`；**V12=PASS、Cross-Page=PASS** → **`Global Visual Transformation = CONFIRMED`（§9 Decision A）**；剩余观察全属 Non-Core/Future/Data/Cosmetic（M33 Expansion Gate 分类记录，禁止进入 M33）；**`M33.13 = COMPLETED`、M33 Visual Transformation Objective = ACHIEVED、`M33 = READY FOR FINAL CLOSEOUT`**；任务完成后 **STOP**，**不自动执行 M33 Final Closeout / 740+**；不进入无限视觉优化循环。

### 740 M33 Scope Reconciliation And Final Gate Audit（740 PASS as audit / Global = NOT CONFIRMED / Decision B → ONE FINAL BOUNDED REPAIR）

| Field | Value |
|-------|-------|
| Iteration | `740_M33_Scope_Reconciliation_And_Final_Gate_Audit`（指令 V3.2.3，Audit + Verification + Scope Reconciliation + Final Gate Audit / Verify Only，零生产代码修改） |
| Baseline | **739 = PASS / Global = CONFIRMED / M33 = READY FOR FINAL CLOSEOUT**；Kimi 全站前端重新审查报告 |
| Task Type | 对 739 结论与 Kimi 新证据做范围裁决、证据重审、最终 Gate 判定；引入 **Mobile-First Acceptance**（Desktop = Mobile = M33 Acceptance Surface） |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-739 PRESERVED；apps/api·prisma·migration FROZEN） |
| Routes / Viewports | **9 Routes × 4 Viewports**（Core 5 Web + `/solutions` + Admin 3；375/768/1024/1440） |
| Evidence | **36/36 Runtime Captures**（`database/_740_shots/` + measure.jsonl，Edge Headless+CDP Edg/151.0.4129.93）；复用 739 32 captures |
| Runtime | **PASS**：36/36 `runtimeErrors=[]`，`ALL_HTTP_OK=true` |
| Accessibility | **PASS**（无新回归；Web emptyA11y=0；Admin 保持既有 baseline） |
| Responsive | Layout **PASS**（375/768/1440 overflow=false；1024 Header baseline DEFERRED）；Mobile Perceptual **FAIL** |
| 739 Evidence | **VALID BUT SCOPE-LIMITED / PERCEPTUALLY CONFLICTED**（运行态数据有效，但对 Products/Categories 感知判定过宽容） |
| Kimi Evidence | **RECONCILED**（按 A-H 分类） |
| Layer A | `/` Home=CONDITIONAL；`/products`=**FAIL**（B1 电商范式）；`/categories`=**FAIL**（B2 商品名认知断层）；`/products/[slug]`=PASS；`/articles`=PASS |
| Layer B | `/solutions`=PASS；其余 PASS-ASSUMED / Future Candidate |
| Layer C | PASS-ASSUMED / Future Candidate（禁止要求功能页全部工业控制台化） |
| M33 Core Blocker | **2 项**：B1 `/products` E-commerce Capability Catalog 范式；B2 `/categories` 设备商品名与 TC 编码能力分类认知断层 |
| Future Candidates | 11 项：Pagination/Compare/Layer B/Layer C/PublicHeader IA/Home IA/Admin data/Admin a11y/monoMeta probe/Cosmetic |
| M33 Completion Contract | **FAIL**（Clause 1/2/3/5/6 因 B1/B2 未通过） |
| Scope Creep | **NO**（未将 Header/Layer B/Layer C/Cosmetic/Admin/Probe 升级） |
| Final Decision | **Decision B**：`Global Visual Transformation = NOT CONFIRMED`；`M33 = IMPLEMENTATION IN PROGRESS`；**ONE FINAL BOUNDED REPAIR REQUIRED**（针对 B1+B2） |
| Repair Contract | Routes: `/products` `/categories`；Files: page + ProductGrid + ProductCard + ProductFilter + Pagination + Category cards；Viewports: 375/768/1024/1440；Desktop+Mobile Criteria: 脱离源码不为电商/商品列表；Exclusions: Header/Home/Layer B/Layer C/Admin/Design System/API/Schema/Migration/新依赖 |
| M33 Final Closeout | **NOT READY；需 Repair → Re-Verification 后再判定** |
| Review Report | docs/_review/740_M33_Scope_Reconciliation_And_Final_Gate_Audit_Report.md |

明确：**740 = M33 Scope Reconciliation + Final Gate Audit**（Verify Only，零生产代码修改）。在 Desktop + Mobile 同等验收原则下，Kimi 报告中的问题经 A-H 分类后仅 **2 项构成 M33 Core Blocker**：B1 `/products` 页面整体呈现为 E-commerce Capability Catalog（Facet/分类树/分页/排序/卡片/对比），B2 `/categories` 卡片中普通设备商品名与 TC 编码化能力分类形成认知断层；二者均同时在 Desktop 与 Mobile 成立。其余问题（Header 文案、Home 营销结构、Layer B 通用 CMS 模板、Cosmetic 视觉细节、Admin 数据/Metric、Probe 口径等）均按 Anti-Scope-Creep 规则归入 Future/Independent/Data/Accessibility/Cosmetic，**未扩大 M33**。因 M33 Core Blocker > 0，739 的 `Global Visual Transformation = CONFIRMED` 被裁决为 **NOT CONFIRMED**；按 §20 Decision B，允许 **一次且仅一次有界 Minimal Repair**（范围已限定），之后需独立 Re-Verification。**本任务 STOP，不自动执行 Repair / Closeout / 741+**。

### 741 Cross-Role Platform Perception Audit（741 COMPLETED / Audit Only）

| Field | Value |
|-------|-------|
| Iteration | `741_Cross_Role_Platform_Perception_Audit`（跨角色平台感知审计 / 只读审计，零代码变更） |
| Baseline | **740 = REVISED / Global = NOT CONFIRMED / Decision B / ONE FINAL BOUNDED REPAIR** |
| Task Type | 以真实登录态分别访问 Buyer / Supplier / Admin，定位「平台感 vs 官网感」根因 |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-740 PRESERVED） |
| Runtime Evidence | Edge Headless+CDP，Buyer/Supplier/Admin/Public 多角色 + 375/1440 双视口；`database/_741_role_shots/` + measure.jsonl |
| Major Findings | Supplier `/workspace/supplier` 为 Compatibility Shell；公共页面对已登录角色零感知；Supplier RFQ 页角色数据错位；Admin 指标异常 |
| Defects | P0=3 / P1=4 / P2=4 / P3=2 |
| Constraint | 冻结期内不得新增页面/路由/业务逻辑/Schema/API；仅允许低风险文案/链接调整 |
| Status | **COMPLETED（Audit Only）** |
| Next | 742 Final Bounded Repair（需显式批准） |
| Review Report | docs/_review/741_Cross_Role_Platform_Perception_Audit.md |

### 742 M33 Final Bounded Platform Perception Repair（742 COMPLETED / Bounded Repair）

| Field | Value |
|-------|-------|
| Iteration | `742_M33_Final_Bounded_Platform_Perception_Repair`（M33 最终有界感知修复 / 仅前端展示层） |
| Baseline | **740 = Decision B** + **741 = Cross-Role Audit COMPLETED** |
| Task Type | 执行 740 授权的一次且仅一次有界 Minimal Repair：修正 `/products`、`/categories` 感知语义；修复 Supplier 旧入口；添加最小化已认证公共页面平台入口 |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-741 PRESERVED；apps/api·prisma·migration FROZEN） |
| Changes | `/products` page+layout+ProductCard+ProductGrid → 能力注册表语义；`/categories` page → 能力分类索引语义；`/workspace/supplier` → 自动重定向；`PublicHeader` → 已登录态「工作台」入口 |
| Build | **PASS**：`cd apps/web && npx next build` exit 0 |
| Runtime Verification | **PASS**：`_742_header_verify.mjs` Buyer/Supplier 桌面+移动端 4/4 通过；`_741_role_gate.mjs` 复证 423 条度量，全部 HTTP 200 |
| Defects Closed | 741 P0-1 / P0-2；740 B1 / B2 |
| Future Candidates | FC-742-01 Supplier RFQ 角色数据错位；FC-742-02 Admin 异常指标；FC-742-03 Header 导航文案官网化；FC-742-04 Web 1024 Header 溢出（DEFERRED） |
| Scope Compliance | 未修改 Backend/API/Database/Schema/Migration/Architecture/Business Logic/Matching/Search/AI；未新增 Marketplace/Store/Transaction/独立供应商页面 |
| Status | **COMPLETED** |
| Next | 冻结期后评估 Future Candidates；不自动进入新修复轮次
| Review Report | docs/_review/742_M33_Final_Bounded_Platform_Perception_Repair_Review_Report.md |

### 743 M33 Final Bounded Repair Verification（743 PASS / Final Gate / M33 READY FOR FINAL CLOSEOUT）

| Field | Value |
|-------|-------|
| Iteration | `743_M33_Final_Bounded_Repair_Verification`（M33 最终有界修复验证 / Final Gate / Verify Only / Runtime E2E / Perceptual Verification） |
| Baseline | **740 = Decision B** + **741 = Cross-Role Audit COMPLETED** + **742 = Final Bounded Repair COMPLETED** |
| Task Type | **VERIFY ONLY**：对 742 四项核心修复做最终独立复核；零生产代码修改 |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-742 PRESERVED；apps/api·prisma·migration FROZEN） |
| Clean Build | **PASS**：`Remove-Item -Recurse -Force .next` + `pnpm --filter @visndt/web build` exit 0 |
| Fresh Start | **PASS**：Web 基于最新构建产物重启，API health ok |
| B1 /products | **CLOSED**：四视口标题「能力注册表 | VISNDT」，无电商范式残留 |
| B2 /categories | **CLOSED**：四视口能力分类索引语义统一，无商品名认知断层 |
| P0-1 Supplier Legacy | **CLOSED**：`/workspace/supplier` 自动重定向至 `/dashboard/supplier`，Compatibility Shell ABSENT |
| P0-2 Workspace Entry | **CLOSED**：Buyer/Supplier 桌面+移动端点击「工作台」4/4 进入对应 Dashboard |
| RSC Chunk Stability | **PASS**：干净构建后 24 次访问，0 `Cannot find module './9155.js'`，OBS-742-01 RESOLVED |
| Admin Regression | **PASS**：`/home`、`/operation-center`、`/products` HTTP 200，0 runtime error |
| Mobile-First | **PASS**：375/768/1024/1440 全部通过；1024 Header 溢出维持 DEFERRED |
| Accessibility | **PASS**：无新增回归；既有 Deferred 维持 |
| Defects | New P0=0 / P1=0 / P2=0 / P3=0 / Core Blocker=0 |
| Global Visual Transformation | **CONFIRMED** |
| M33 | **READY FOR FINAL CLOSEOUT** |
| Next | **M33 Final Closeout**（需显式批准，本任务 STOP） |
| Review Report | docs/_review/743_M33_Final_Bounded_Repair_Verification_Report.md |

### 744 M33 Final Closeout and Visual Transformation Baseline Freeze（744 PASS / M33 = CLOSED / Visual Transformation = CONFIRMED / Next = M34 Planning）

| Field | Value |
|-------|-------|
| Iteration | `744_M33_Final_Closeout_And_Visual_Transformation_Baseline_Freeze`（M33 最终关闭 / 状态冻结 / Documentation Synchronization / Verify Only / 零生产代码修改） |
| Baseline | **743 Final Gate = PASS**（B1/B2/P0-1/P0-2 全部 CLOSED；Runtime/Accessibility/Mobile-First/Cross-Role Perception = PASS；Regression = NONE；Core Blocker = 0） |
| Task Type | **FINAL CLOSEOUT**：以 743 为最终技术验证依据，冻结 M33 = CLOSED，隔离剩余问题为 Existing Deferred / Future Candidate / Independent Track，同步项目管理文档 |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main；721-743 PRESERVED；apps/api·prisma·migration FROZEN） |
| Final State Reconciliation | M32 = CLOSED；M33.1 ~ M33.13 全部 COMPLETED；M33 Final Closeout = CURRENT |
| Final Visual State | Home / Products / Categories / Detail / Articles = PASS；Cross-Role Platform Perception = PASS |
| Mobile-First | **375/768/1024/1440 = PASS**；1024 Header Overflow = Existing Baseline / Deferred |
| Accessibility | **PASS**；Admin emptyA11y / existing headingSkips 保持 Future / Existing Baseline |
| Runtime | **PASS**：HTTP=200、Hydration/ChunkLoad/RSC/Uncaught/Console Error = NONE |
| Architecture | **FROZEN**：Backend/API/Schema/Migration/Matching/Search/AI/RAG/Vector/Auth/RBAC/Business Workflow 全部 UNCHANGED；无新增 UI/Icon/Animation/Chart library、无 `packages/design-system` |
| Finding Classification | New P0/P1/P2/P3 = 0；Core Blocker = 0；Existing Deferred：FD-01；Future Candidate：FC-742-01 ~ FC-742-04（未升级为 Blocker） |
| No Infinite Visual Loop Gate | M33 Visual Transformation = CONFIRMED；remaining imperfections ≠ M33 Blocker；禁止创建 M33.14+ / 重做 Global Verification / 无限循环 |
| Global Visual Transformation | **CONFIRMED** |
| M33 | **CLOSED** |
| Next | **M34 Planning**（本任务 STOP，不自动执行） |
| Review Report | docs/_review/744_M33_Final_Closeout_And_Visual_Transformation_Baseline_Freeze_Report.md |

### 747 M34-DATA-01 Controlled Test Data Scan, Classification and Backup（747 CONDITIONAL PASS / M34 = DATA PRE-CLEANUP BASELINE / Cleanup = NOT EXECUTED）

| Field | Value |
|-------|-------|
| Iteration | `747_M34-DATA-01_Controlled_Test_Data_Scan_Classification_Backup`（M34 Pre-Data-Cleanup 基线 / READ-ONLY 数据扫描 + 分类 + 备份 / 零数据变更） |
| Task | Controlled Test Data Scan, Classification and Backup（Inventory → Identify → Classify → Protect → Map Dependencies → Backup → Verify → Draft Cleanup Plan → STOP） |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Environment | Development（postgres:16-alpine + minio:latest）；Database Target `visndt` VERIFIED |
| Inventory | **COMPLETE**（39 表 record count；user=13 / organization=15 / product=32 / supplier_product=38 / demand=30 / rfq=17 / offer=21 / notification=33 / refresh_token=646 / audit_log=2857） |
| Classification | **COMPLETE**（SYSTEM_PROTECTED / APPROVED_BASELINE / REAL_OR_PRODUCTION_LIKE / PLATFORM_RULE / LIKELY_TEST / UNKNOWN；Protected ~10 / LIKELY_TEST ~8 / UNKNOWN ~2 / Cleanup Candidate ~7） |
| Dependency Analysis | **COMPLETE**（FK 依赖图 Cascade/SetNull/Restrict + 删除安全模拟） |
| Backup | **CREATED（Partial）**（F:\Desktop\VISNDT_backups\M34-DATA-01\：full.dump + schema.sql + 3 vector 表 CSV 补充） |
| Backup Verification | **PASS**（SHA-256 + pg_restore --list 366 对象） |
| Restore Verification | **NOT RUN**（当前容器缺 pgvector 共享库，避免影响原库） |
| Cleanup | **NOT EXECUTED**（未删除任何测试/真实/管理员/平台规则/未知数据或存储对象） |
| Next | **STOP**（禁止自动执行清理/重置/Seed 替换/M34 实现/UI/API/Schema 修改） |
| Review Report | docs/_review/747_M34-DATA-01_Controlled_Test_Data_Scan_Classification_Backup_Report.md |

### 748 M34-DATA-02 Controlled Test Data Cleanup and Post-Cleanup Verification（748 CONDITIONAL PASS / M34 = CONTROLLED TEST DATA CLEANUP COMPLETED / Protected Baseline Preserved）

| Field | Value |
|-------|-------|
| Iteration | `748_M34-DATA-02_Controlled_Test_Data_Cleanup_And_Post_Cleanup_Verification`（M34 受控数据清理 / AUTHORIZED DELETE ONLY + TRANSACTIONAL CLEANUP + POST-CLEANUP VERIFICATION） |
| Task | Controlled Test Data Cleanup and Post-Cleanup Verification（Verify Backup → Verify Environment → Revalidate → Final Delete Manifest → Protected Manifest → Verify Dependencies → Transactional Cleanup → Commit → Verify Integrity → Verify Runtime → Verify Storage → Remove Test Objects → Verify Audit → Sync Docs → STOP） |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a） |
| Environment | Development（postgres:16-alpine + minio:latest）；Database Target `visndt` VERIFIED |
| Backup | **VERIFIED**（F:\Desktop\VISNDT_backups\M34-DATA-01\：full.dump + schema.sql + 3 vector 表 CSV；SHA-256 + pg_restore --list 通过） |
| Final Delete Manifest | **ESTABLISHED**（21 groups / 1180 DB records + 1 storage object，仅含充分证据测试数据） |
| Final Protected Manifest | **ESTABLISHED**（7 类：accounts / orgs / taxonomy / knowledge / audit / migrations / baselines） |
| Database Mutation | **AUTHORIZED DELETE ONLY / COMMITTED**（单事务 A→G，1180 条删除成功，201 Action Tape 已验证） |
| Schema / Migration / TRUNCATE / Reset | **NONE**（Schema NONE / Migration NONE / TRUNCATE NONE / Database Reset NONE） |
| Referential Integrity | **PASS**（FK integrity + orphan + dangling reference + application-level reference 全通过） |
| Storage Cleanup | **PASS**（按 DB→storage 引用移除 1 个确认测试 MinIO 对象，DB FileAsset 与存储引用一致，无孤儿对象） |
| Runtime / Auth / RBAC / MinIO | **PASS（health） / PARTIAL（DB 级账户） / PARTIAL（DB 级） / PASS** |
| Audit Evidence | **PRESERVED**（audit_log 2857 保留，含受控手段产生的删除审计记录） |
| Deleted / Retained / Skipped / Failed | **1180 / 3 demand + 2 rfq + 1 rfq_response + 8 content + 13 user + 15 org + tracking / 8 test users + 15 orgs（re-seed 歧义）/ 0** |
| Protected | **taxonomy / knowledge / audit(2857) / migrations(37) / baselines**；Unknown = vsndt@sz-wise.cn / SZ Wise Supplier（未触碰） |
| Documentation Synchronization | **SYNCED**（PROJECT_STATUS.md / PROJECT_ROADMAP.md / MODULE_COMPLETION_MATRIX.md） |
| Next | **STOP**（不得自动进入 745 / M34 Platform Architecture / M34.1 / UI 改造 / 搜索改造 / 路由迁移 / 数据库重构；下一项工作必须由新的独立任务授权） |
| Review Report | docs/_review/748_M34-DATA-02_Controlled_Test_Data_Cleanup_Report.md |

### 749 M34 Platform Experience Architecture Audit（749 CONDITIONAL PASS / M34 = PLATFORM EXPERIENCE ARCHITECTURE AUDIT COMPLETED / Target State + Gap/ADR/Scope/Readiness Defined / Implementation NOT STARTED）

| Field | Value |
|-------|-------|
| Iteration | `749_M34_Platform_Experience_Architecture_Audit`（M34 READ-ONLY Architecture Audit + Target-State Definition / 零代码·零数据库·零存储变更） |
| Task | Platform Experience Architecture Audit（Verify → Read → Measure → Reconcile → Classify → Model → Analyze Relationships/Journey/IA → Define Target/Gap/Scope/Readiness → Align Roadmap → STOP） |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a） |
| Environment | Development（Web :3001 / API :4000 / PostgreSQL :5432 / MinIO :9000-9001） |
| Platform Maturity | **Level 2（Discovery Website，向 Level 3 迁移中）**；Classification=Hybrid（Website-first 偏重 / Platform Object 弱） |
| Core Object Reality | Capability=RUNTIME-ONLY/Projection（无独立对象）；SupplyProduct=完整供应实体（0 数据）；Product=能力权威+目录双重职责；Supplier=Organization 别名（searchSuppliers 恒 0）；Specification=参数层；Category=多职责；Demand=3 / Match=0 / RFQ=2 |
| Search | 六类聚合检索 + 参数 facet；非规格驱动；Supplier 维度恒 0 |
| Interaction Model | Current=View→Learn→Contact；Target=Discover→Filter→Compare→View Supplier→Create Demand→View Match→Send Inquiry→Create RFQ→Respond→Quote |
| Gap Register | **17 项**（P1=7 / P2=7 / P3=3 / P0=0） |
| Architecture Decision Candidates | **12**（ADR-M34-01..12，仅候选） |
| Change Gate | Backend=2 / API=2 / Schema=2-3 / Frontend-only=2 |
| Target Object Model | Capability(候选独立对象)↔N:1 SupplyProduct→Supplier + Spec Template + Demand→Match→RFQ 闭环（TARGET CANDIDATE） |
| Target IA | DISCOVER(Capabilities/Products/Suppliers/Categories/Specifications) / PUBLISH / CONNECT / LEARN / WORKSPACE / ADMIN |
| M34 First-Round Scope | **7 主任务**（T1 Capability Object / T2 SupplyProduct·Product 关系 / T3 Specification Template / T4 Category·Capability 边界 / T5 Search·Supplier Discovery / T6 Target IA·Route / T7 Governance） |
| Implementation Readiness | **NOT READY**（须先过 750 冻结关键决策） |
| Architecture / Mutation | **UNCHANGED+READ-ONLY**；Mutation NONE / Database NONE / Storage NONE；Schema UNCHANGED / Migration NONE |
| Next Gate | **750_M34_Platform_Architecture_Freeze_And_Implementation_Gate（NOT STARTED）** |
| Review Report | docs/_review/749_M34_Platform_Experience_Architecture_Audit_Report.md |

### 750 M34 Platform Architecture Decision Consolidation And Implementation Gate（750 COMPLETE / CONDITIONAL PASS / Architecture Frozen + Contract Defined / M34.1 NOT AUTHORIZED）

| Field | Value |
|-------|-------|
| Iteration | `750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate`（M34.0 Decision Consolidation + Architecture Freeze + Implementation Gate / READ-ONLY / 零代码·零数据库·零存储变更） |
| Task | Architecture Decision Consolidation（Verify → Read → Measure → Reconcile → Classify → Compare → Decide → Consolidate → Validate → Freeze Contract → Define Gate → Sync → Align Roadmap → STOP） |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a） |
| Environment | Web :3001 UP / API :4000 UP / :3000 DOWN（历史端口） |
| Architecture Decisions | **ACCEPTED=10 / MERGED=0 / REJECTED=0 / DEFERRED=2 / UNRESOLVED=0** |
| Capability Decision | = Product 的发现语义角色（不独立建表，复用 Product=Capability Authority） |
| Product Decision | Capability Authority + Catalog 一体（冻结） |
| SupplyProduct Decision | Canonical Supplier-owned Product（复用，1:N via platformProductId） |
| Supplier Decision | Organization + profile 语义（NO SCHEMA，不新增表） |
| Specification Decision | 参数横切维度（M34.1 不建模板；模板 DEFERRED） |
| Search Decision | 统一聚合 + 参数 facet + Capability 维度；supplier 发现修复归 M34.4/M34.6 |
| IA Decision | DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN；/products 能力权威；/knowledge MERGE；/supplier-models DEPRECATE |
| Public/Workspace | 对象引用 + canonical + workspace 持久（非「加按钮」） |
| Governance | Platform=Rules / Supplier=Assets / Buyer=Intent / Admin=治理 |
| SEO/LLM Contract | Capability=Product/suppliers/knowledge 语义锚；SITE_URL=Config Follow-up |
| Mobile Contract | 375/768/1024/1440 四层展示原则（Responsive≠Shrink，不实施 UI） |
| 重要纠偏（vs 749 G-03） | searchSuppliers status mismatch→恒0 `不成立`（OfferStatus 含 SUBMITTED/ACCEPTED）；真实根因=Offer 空数据 + 无独立供应商维度 → NO SCHEMA / API+FRONTEND |
| Change Gate | Schema=CONDITIONAL→NO（M34.1 无需）；API=CONDITIONAL（Supplier 维度）；Backend=NO；Frontend=FRONTEND ONLY |
| M34 First-Round Scope | **FROZEN**：M34.1–M34.7（Capability & Product Foundation / Relationship / Taxonomy & Spec / Discovery-Search / Canonical IA & Continuity / Buyer-Supplier Workflow / Governance+SEO-LLM+Mobile） |
| Implementation Readiness | **CONDITIONALLY READY**（核心对象/关系/IA/Journey/Search/Scope/决策集冻结；deferred 不阻断 M34.1–M34.2） |
| Architecture Contract | **`docs/_architecture/M34_Platform_Architecture_Contract.md`（ACCEPTED/FROZEN 决策）** |
| Next Authorized Stage | **M34.1 / NOT AUTHORIZED（须新独立授权）** |
| Review Report | docs/_review/750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate_Report.md |

### 751 M34 Platform Architecture Consistency And Capability Model Challenge（751 COMPLETE / CONDITIONAL PASS / GATE B VALIDATED WITH CONDITIONS / Architecture Challenge + Model Validation / M34.1 AUTHORIZABLE-BUT-NOT-AUTHORIZED）

| Field | Value |
|-------|-------|
| Iteration | `751_M34_Platform_Architecture_Consistency_And_Capability_Model_Challenge`（M34.0 Architecture Consistency Challenge + Capability Model Challenge + Implementation Gate Revalidation / READ-ONLY / 零代码·零数据库·零存储变更） |
| Task | Challenge the Decision → Try Break Model → Trace Counterexample → Verify Evidence → Resolve → Validate Capability Model → Validate Discovery Model → Validate Platform-first Mental Model → Revalidate Implementation Gate → Sync → Align Roadmap → STOP |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Baseline | **VERIFIED**（746/747/748/749/750 报告 + M34 Contract 完整读取；M33=CLOSED 未重开） |
| Challenge A-K | **PASS=2（C：Capability 1→N SupplyProduct DB 验证成立；G：Public/Workspace 对象引用连续性成立）/ PARTIAL=9 / FAIL=0** |
| 核心裁决 | Capability 无独立表/API/路由（`capabilities.controller` 仅 `@Get(':id')`）；Capability-led Discovery **有条件是**经 **Category=能力粒度 + 参数 facet** 成立；否则退化为 naming → **PRODUCT-CATALOG REGRESSION RISK=YES** |
| Capability Spec 权威 | 750 **未声明**（Chief Amendment #1）；751 裁决 = Product-derived 原始参数 + Admin 策展 Typical；Search/Match 沿用原始参数值；NO SCHEMA |
| Supplier 发现 | 当前依赖 Offer（`searchSuppliers` SUBMITTED/ACCEPTED）；须改基 `SupplierProduct.status=PUBLISHED`（API+Frontend，NO SCHEMA） |
| Search | 纯关键字，无 intent→Capability 解释层；需 M34.4 能力意图→Category 映射 |
| SEO/LLM | SE Entity=Product，无独立 capability URL；文档化为既定边界 |
| Low-Operation | 自动撮合+自助提交成立；Capability 典型规格 Admin 策展拉高风险 |
| Critical Contradiction | **0**（750 冻结决策内部无自相冲突） |
| Required Amendments | **6**（Spec 权威声明 / Category=能力粒度治理 / Supplier 接线改 Published SupplyProduct / Search 能力意图映射 / Frontend Capability-led 纪律 / SEO-LLM 语义锚文档化；0 项 Schema 变更） |
| Contract | `docs/_architecture/M34_Platform_Architecture_Contract.md` 状态 FROZEN→**VALIDATED WITH CONDITIONS（GATE B）**，追加 §10 Conditions + §11 Revalidated Gate |
| Change Gate | Schema=NO / API=CONDITIONAL（Supplier 维度）/ Backend=NO / Frontend=FRONTEND ONLY / Route=NO（只 evaluate） |
| Architecture Gate | **GATE B — VALIDATED WITH CONDITIONS**（核心模型成立 + 有限非阻断条件进入实施 Gate） |
| M34.1 | **AUTHORIZABLE（CONDITIONAL） / NOT AUTHORIZED**（须下一条独立指令正式授权） |
| Next Authorized Stage | **M34.1 / NOT AUTHORIZED（须新独立授权）** |
| Review Report | docs/_review/751_M34_Platform_Architecture_Consistency_And_Capability_Model_Challenge_Report.md |

### M34.1 Capability And Product Foundation（M34.1 COMPLETE / CONDITIONAL / First-Round Platform Implementation / Capability = Product Discovery Semantic Role / Frontend-Only Minimal Foundation）

| Field | Value |
|-------|-------|
| Iteration | `M34.1_Capability_And_Product_Foundation`（CONTROLLED IMPLEMENTATION + VERIFICATION + DOCUMENTATION SYNCHRONIZATION / Frontend-Only 最小基础 / NO Schema / NO Migration / NO API / NO Backend Change） |
| Task | Verify → Read → Map Product Model → Apply 751 Gates → Implement Minimum Foundation → Verify Object Semantics → Verify Specification Source → Verify Primary Capability Boundary → Verify Supplier Boundary → Verify Downstream Search Compatibility → Verify Mobile → Verify Static → Verify Runtime → Sync Docs → Align Roadmap → STOP |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Baseline | **VERIFIED**（746/747/748/749/750/751 基线；M33=CLOSED 未重开；API :4000 healthy；web :3000 渲染 200；Product=0 行 / Category=28 能力导向分类） |
| Capability 实施 | **Frontend View Model**（`apps/web/src/lib/capability-context.ts`：CapabilityContext identity=product.id / name=Product.name / category 锚 / Product-derived specs / supplier context；`isTypical=false` 防伪造典型值；无独立 Entity/Model/Migration） |
| Frontend 改动 | `apps/web/src/components/products/ProductDetailContent.tsx` 「能力档案」接入 CapabilityContext + 能力提供商上下文（Published SupplierProduct + Organization）+ Product-derived 溯源声明 |
| 751 Gates | C1=C2=C3=C4=C5=C6=C7=**PASS**（Capability=Product 无第二套身份 / Category=能力粒度锚 / Spec=Product-derived / Primary Capability only / Supplier=Published SupplyProduct+Organization / Capability-led Search Hook 保留 / Domain-Schema 稳定） |
| Change Gate | Schema=NO / Migration=NONE / API=NO / Backend=NO CHANGE / Frontend=YES（FRONTEND ONLY） / Route=NO（Compare 保持 Technical Product Comparison） |
| Static Verification | **PASS**（build exit 0 含 TS + lint exit 0 仅既有 warnings） |
| Runtime Verification | **PASS**（`/`、`/products`、`/categories`、`/search` 200；无测试数据写入） |
| Mobile Verification | **PASS**（375/768/1024/1440 无水平溢出，导航/Capability 锚可达） |
| Database/Storage Mutation | **NONE**（0 行/0 对象变更） |
| Critical Contradiction | **0** |
| Review Report | docs/_review/M34.1_Capability_And_Product_Foundation_Implementation_Report.md |
| Next Authorized Stage | **M34.2 / NOT AUTHORIZED（须新独立授权；本任务已 STOP）** |

### M34.2 Capability / SupplyProduct / Supplier Relationship（M34.2 COMPLETE / CONDITIONAL / First-Round Platform Implementation / Supply Relationship Foundation / Supplier Semantic Foundation / Frontend-Only / NO Schema·NO API·NO Backend）

| Field | Value |
|-------|-------|
| Iteration | `M34.2_Capability_SupplyProduct_Supplier_Relationship`（CONTROLLED IMPLEMENTATION + VERIFICATION + DOCUMENTATION SYNCHRONIZATION；NO Supplier Table·NO Capability Table·NO Migration·NO Offer dependency in new path） |
| Inherited Conditions | **C2=CONDITIONAL / C5=FOUNDATION/NOT FULL DISCOVERY / C6=FOUNDATION/NOT FULL CAPABILITY-LED SEARCH**（开始写入，结束保留，未升级） |
| Task | Verify → Read → Reconcile M34.1 Conditions → Inspect Product/SupplyProduct/Organization → Preserve Contract → Implement Minimal Supply Relationship Foundation → Establish Published Supply Boundary → Expose Supplier Context → Verify Product→SupplyProduct→Supplier → Mobile → Static → Runtime → No Offer Dependency → No Schema Expansion → Sync Docs → Align Route → STOP |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Baseline | **VERIFIED**（746→751 + M34.1(752) 基线；M33=CLOSED；API :4000 healthy；web :3000 渲染 200；Product/SupplierProduct/Offer=0 行；Category=28） |
| Relationship | Product(Capability Authority) **1:N** SupplyProduct(supplier_product) **N:1** Organization(type=SUPPLIER)；`platformProductId` 语义稳定；不经 SupplierProduct 绕过 Product authority |
| Published Boundary | Supplier 可发现 ⇔ ≥1 **PUBLISHED SupplierProduct + Organization(type=SUPPLIER)**；后端 discovery.service 强制 PUBLISHED 过滤；不要求 Offer/Inquiry/RFQ 存在 |
| Supplier Semantic Model | `apps/web/src/lib/supplier-context.ts`（SupplierContext + buildSupplierRelationshipContext，view model / §7 契约字段 / source=PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION / 零 Offer 读） |
| Frontend | `apps/web/src/components/products/ProductDetailContent.tsx` 「能力提供商与供应关系」接入 Supplier Context，按 Organization 归并展示已发布能力型号 + 平台/型号边界声明 |
| Change Gate | API=NO / Backend=NO CHANGE / Schema=NO / Migration=NONE / SupplierTable=NONE / CapabilityTable=NONE / M:N=NONE / SpecTemplate=NONE / DB·Storage Mutation=NONE |
| Static Verification | **PASS**（build exit 0 含 TS + lint exit 0 仅存量 warnings，新文件零警告） |
| Runtime Verification | **PASS**（/products /categories /search /products/compare /products/[slug] /suppliers/[id] 全 200；Real-data Runtime=UNVERIFIED / Evidence Gap） |
| Mobile Verification | **PASS**（375/768/1024/1440 无水平溢出；/suppliers 全宽无溢出；导航可达） |
| Architecture Consistency | **PASS**（Capability=Product role / Product=Canonical / SupplyProduct=Supplier-owned / Supplier=Organization role；无 Supplier→Offer only、无 SupplyProduct→Capability entity、无 Capability→Supplier 绕过 Product/SupplyProduct） |
| Expansion Gate | **CLOSED**（Secondary Capability / M:N / Supplier Table / Spec Template / Search Intent / Full Supplier Discovery / Full Capability-led Search / Marketplace / Monetization 全 DEFERRED/FUTURE/NEXT WORKSTREAM） |
| Review Report | docs/_review/753_M34.2_Capability_SupplyProduct_Supplier_Relationship_Implementation_Report.md |
| Next Authorized Stage | **M34.3 / NOT AUTHORIZED（须新独立授权；本任务已 STOP）** |

### M34.3 Taxonomy & Specification Foundation（M34.3 CONDITIONAL / First-Round Platform Implementation / Taxonomy & Specification Foundation / Category + Parameter Dictionary 证据化收敛 / 零 Schema·Migration·API·Backend·Frontend code）

| Field | Value |
|-------|-------|
| Iteration | `M34.3_Taxonomy_And_Specification_Foundation`（CONTROLLED IMPLEMENTATION + EVIDENCE VALIDATION + DOCUMENTATION SYNCHRONIZATION；NO Schema·NO Migration·NO API·NO Backend·NO Frontend code） |
| Inherited Conditions | **C2=CONDITIONAL / C5=FOUNDATION/NOT FULL DISCOVERY / C6=FOUNDATION/NOT FULL CAPABILITY-LED SEARCH**（开始写入，结束保留，未升级） |
| Task | Verify → Review Sequence → Baseline → Data Reconcile → Inventory All Categories → Evidence-based Category Classification → Cross-validation → Freeze Taxonomy Boundary → Audit Parameter Dictionary → Usage/Ownership/Provenance → Numeric/Unit Consistency → Facet Provenance → Separate Product/SupplyProduct/Demand Spec → Hidden Domain Object Audit → Frontend Semantic Confirm → Mobile → Static → Runtime Layers → Reconcile Data → Sync Docs → Align Roadmap → STOP |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Baseline | **VERIFIED + RECONCILED**（Database Before=After：product=0/supplier_product=0/offer=0/demand=3/rfq=2/inquiry=0/org=15；product_category=28/parameter_group=11/parameter_definition=54/parameter_option=45；DB Mutation=NONE） |
| Category Inventory | 28 全量（**16 合法**能力/设备/场景/载体粒度 + **12 个 TC713/TC715/TC716 残留测试分类**；UI 不泄漏，tc=false） |
| Semantic Matrix | evidence-derived；能力粒度成立；「光学/光纤/电子内窥镜 ≈ 工业内窥镜子类」**冗余别名未收敛**（治理项） |
| Parameter Audit | 54 defs/11 groups/45 opts（IE_*/FD_*/通用）；**ParameterDefinition=唯一 Spec Dictionary authority**；7 组同义重复 + °C/℃ 单位待标（治理项） |
| Ownership / Provenance | ProductParameterValue=Platform值 / SupplierProductParameterValue=Supplier型号值 / DemandParameter=Buyer约束；来源可回溯 Object→Field→Relationship→Dictionary |
| Facet Provenance | **闭环（结构级）**：`ParameterFilterPanel → getCategoryFilterParameterDefinitions → /product-categories/:id/parameters`；无硬编码筛选项 |
| Boundaries | Product/SupplyProduct/Demand 三层 Specification 值表独立、不合并；不创建 CategoryParameterTemplate / SpecTemplate |
| Hidden Domain Object | **NONE**（Capability/Spec/SpecTemplate/CategoryParameterTemplate/M:N/第二权威均无） |
| Change Gate | Schema=NO Change / Migration=NONE / API=NO（KEEP `:id/parameters`）/ Backend=NO CHANGE / DB·Storage Mutation=NONE / Frontend code=NONE（现状已满足语义） |
| Static Verification | **PASS**（`pnpm --filter @visndt/web build` exit 0 含 TS + `pnpm --filter @visndt/web lint` exit 0 仅存量 warnings） |
| Runtime Evidence | Infrastructure/Code-Path/Taxonomy/Parameter=**VERIFIED**；Real Product/SupplierProduct=**UNVERIFIED**（0 数据 Evidence Gap）；Browser=**CONDITIONAL**（375/1024/1440 OK，768 溢出 140px 既有归 M34.5） |
| Mobile Verification | **CONDITIONAL**（375/1024/1440 无溢出；768 平板 140px 溢出为既有基线问题，非本任务引入） |
| Architecture Consistency | **PASS**（Category=Taxonomy Node / Capability=Product role / Spec=Parameter Dimension / PD=Dictionary authority / 三层值分离；C2/C5/C6 label 保持） |
| Test Fixture | **NONE**（NO TEST DATA；Residual=0） |
| Expansion Gate | **CLOSED**（Capability Entity / Secondary Capability / M:N / SpecTemplate / CategoryParameterTemplate / Search Intent / NSAI / AI / RAG / Vector / Full Supplier Discovery / Full Capability-led Search / Marketplace / Monetization 全 DEFERRED/FUTURE/NEXT WORKSTREAM） |
| Review Report | docs/_review/754_M34.3_Taxonomy_And_Specification_Foundation_Implementation_Report.md |
| Next Authorized Stage | **M34.4 / NOT AUTHORIZED（须新独立授权；本任务已 STOP）** |

### M34.4 Discovery / Search Foundation（M34.4 CONDITIONAL PASS / Discovery / Search Foundation / 将 M34.1-M34.3 Foundation 连接为可发现的 Purchase/Search 闭环 / MINIMAL READ-ONLY ADAPTATION / Frontend NO CHANGE）

| Field | Value |
|-------|-------|
| Iteration | `M34.4_Discovery_Search_Foundation_Implementation`（CONTROLLED IMPLEMENTATION + ARCHITECTURE-CONSTRAINED VALIDATION；Single-file MINIMAL READ-ONLY API adaptation，NO Schema·NO Migration·NO Frontend change） |
| Inherited Conditions | **C2=CONDITIONAL / C5=FOUNDATION/NOT FULL DISCOVERY / C6=FOUNDATION/NOT FULL CAPABILITY-LED SEARCH**（开始写入，结束保留，未升级） |
| Task | Verify Sequence → Baseline → Review Search Architecture (Before) → Audit searchSuppliers Offer-dependency → Implement Supplier Discovery Foundation（PUBLISHED SupplyProduct → Organization aggregation）→ Static → Runtime（GET only）→ Mobile → Reconcile Data → Architecture Regression → Sync Docs → Align Roadmap → STOP |
| Repository | **VERIFIED**（F:/Desktop/VISNDT / code root VISNDT / branch main / commit ff03a9a / Working Tree OTHER） |
| Baseline | **VERIFIED + RECONCILED**（Before=After：product=0/supplier_product=0/offer=0/demand=3/rfq=2/inquiry=0/org=15；taxonomy=28/11/54/45；DB Mutation=NONE） |
| Search Architecture (Before) | 六类聚合 `/search`；产品/SupplierProduct/Category/参数 facet 权威链路已正确；**Supplier 分组 searchSuppliers = Offer-dependent（恒 0，违反 Supplier Context 来源）** = BLOCKER |
| Core Fix | `searchSuppliers` 重构为 **aggregate PUBLISHED `SupplierProduct` → `Organization(type=SUPPLIER)`**；`SupplierDiscoveryItem{organizationId,organizationName,publishedSupplyProductCount,productNames,seriesValues}`；删除 Offer 依赖 |
| Change Gate | Schema=NO Change / Migration=NONE / API=**MINIMAL READ-ONLY ADAPTATION**（search.service.ts 单文件）/ Backend=MINIMAL READ-ONLY / Frontend=NO CHANGE / DB·Storage Mutation=NONE / Test Data=NONE |
| Supplier Context | 来源 = **PUBLISHED SupplyProduct + Organization**；不要求 Offer / RFQ / Transaction（AC-06 / AC-07） |
| Static Verification | **PASS**（`pnpm --filter @visndt/api build` exit 0 含 TS + `pnpm --filter @visndt/web lint` exit 0 仅存量 warnings + `pnpm --filter @visndt/web build` exit 0） |
| Runtime Evidence | web :3000 `/` `/products` `/categories` `/search` 全 200；API :4000 `GET /api/v1/search?q=超声` 200 + `/search/context` 200，GET only；**Real Product/Real Supplier Runtime=UNVERIFIED**（0 数据 Evidence Gap） |
| Mobile Verification | **CONDITIONAL**（前端本任务 NO CHANGE；结构性响应式满足；768 溢出 140px 为既有基线问题，非 M34.4 引入，carry forward → M34.5） |
| Architecture Consistency | **PASS**（无 Capability Entity / Supplier Table / Specification Table / Search Index / AI / Vector / Semantic；Product=Capability Authority；Supplier=Organization role；无双权威） |
| Test Fixture | **NONE**（NO TEST DATA；no mock API / no fake supplier / no fake capability / no hard-coded result） |
| Expansion Gate | **CLOSED**（Search Index / 独立 Supplier·Capability 表 / Spec Template / AI / Vector / Semantic / 意图理解 / Full Supplier Discovery / Full Capability-led Search / Marketplace / Monetization 全 DEFERRED/FUTURE/NEXT WORKSTREAM） |
| Review Report | docs/_review/755_M34.4_Discovery_Search_Foundation_Implementation_Report.md |
| Next Authorized Stage | **M34.5 / NOT AUTHORIZED（须新独立授权；本任务已 STOP，转 M34.4R Evidence Closure）** |

### M34.4R Discovery Evidence Closure + M34 Roadmap Reconciliation（M34.4R CURRENT / Evidence Closure + Roadmap Reconciliation / 证明 755 完成程度 + 收闭证据缺口 + 受控最小修正 + 平台化转型路线 / 零 Code·Schema·Migration）

> 756_M34.4R_Discovery_Evidence_Closure_And_M34_Roadmap_Reconciliation：**独立 Evidence Closure Gate**。不重做 M34.4、不进入 M34.5、不做视觉优化。核心 = 证明 755 实际完成程度、收闭证据缺口、仅当直接证明必要做受控最小修正、并把 M34 后半程由「页面继续改造」**正式调整为平台化转型路线（Entity → Discovery → Evaluation → Connection → Governance）**。

| Field | Value |
|-------|-------|
| Iteration | `756_M34.4R_Discovery_Evidence_Closure_And_M34_Roadmap_Reconciliation` |
| Change Surface | **Code=NO CHANGE / Schema=NO CHANGE / Migration=NONE / DB·Storage Mutation=NONE / Test Data=NONE / AI·Vector·RAG·Semantic·SearchIndex·Intent=NONE**；仅 Validation + Evidence Closure + Roadmap Reconciliation + Doc Sync |
| 755 Declared vs Actual | **VERIFIED**（Declared = `apps/api/src/search/search.service.ts` searchSuppliers 重写；Actual = 仅此文件；无未声明功能变更） |
| Evidence Classification | Search Wiring=**VERIFIED** / Search Query Structure=**VERIFIED** / Category Context=**VERIFIED·STRUCTURAL** / Spec Facet=**VERIFIED(结构级)** / Product-Capability Authority=**VERIFIED** / Published SupplyProduct=**VERIFIED·STRUCTURAL** / Supplier Discovery Query=**VERIFIED** / User-facing Supplier Discovery=**NOT CLAIMED** / Real Product·Supplier Runtime=**UNVERIFIED** |
| 756 Remediation | **No remediation required**（755 修正正确且隔离；无越权 Domain Authority / Schema / Seed / 工作流变更） |
| Static | **PASS**（`@visndt/api build`=0、「`@visndt/web lint`=0 仅存量 warnings」、「`@visndt/web build`=0；API lint=**PRE-EXISTING TOOLING GAP**） |
| Runtime | HTTP `GET /search`·`/search/context` = 200（空数据）；web `/` `/products` `/categories` `/search` = 200；GET only |
| Mobile | **STRUCTURAL**（前端 755/756 NO CHANGE）；768 溢出 140px=**既有基线，CARRY FORWARD → M34.5** |
| M34 平台化行为闭环 | **Entity → Discovery → Evaluation → Connection → Governance/Discoverability**（替代「页面继续改造」） |
| M34.5 Definition | **Canonical Discovery Information Architecture**（DISCOVER：Search/Categories/Capabilities/Products/Suppliers；禁止 Global UI/Header/Homepage/DesignSystem Rewrite） |
| M34.6 Definition | **Evaluation + Connection Workflow**（Compare→Shortlist→Inquiry→RFQ→Buyer↔Supplier；复用 Demand/RFQ/RFQResponse/Inquiry） |
| M34.7 Definition | **Platform Governance + SEO/LLM + Mobile**（Governance Existing Authority；承接 TC713/TC715/TC716/Category/Param 冗余/°C/STRING/768/SITE_URL） |
| Expansion Gates | **Gate A Entity Authority / Gate B Discovery Evidence / Gate C Evaluation / Gate D Connection / Gate E Semantic Search** |
| Review Report | docs/_review/756_M34.4R_Discovery_Evidence_Closure_And_M34_Roadmap_Reconciliation_Report.md |
| Next Authorized Stage | **M34.5 Canonical Discovery Information Architecture — COMPLETED（757 / CONDITIONAL PASS）；M34.6 / NOT AUTHORIZED（本任务已 STOP）** |

### M34.5 Canonical Discovery Information Architecture（M34.5 COMPLETE-CONDITIONAL / Canonical Discovery IA / DISCOVER：Search/Categories/Capabilities/Products/Suppliers / 受控导航语义收敛 / Frontend-Only·NO Schema·NO Migration）

> 757_M34.5_Canonical_Discovery_Information_Architecture：**Canonical Discovery Information Architecture 建立**。将已建立的 Entity/Discovery Foundation 正式组织为统一的 DISCOVER（Search / Categories / Capabilities / Products / Suppliers）信息架构，并明确 Public / Workspace / Admin 边界、跨实体发现路径（Search→Category/Capability→Product→Supplier→Back to Discovery）。非 Website/Visual Redesign、非 Search 2.0、非 Supplier Marketplace。执行受控导航语义收敛（PublicHeader NAV_ITEMS）+ 运行时/静态/空数据分层验证 + 文档同步。报告编号 **757**；746–756 报告 **Preserved（未修改）**。

| Field | Value |
|-------|-------|
| Iteration | `757_M34.5_Canonical_Discovery_Information_Architecture` |
| Change Surface | **Code=仅 PublicHeader 导航语义收敛 / Schema=NO CHANGE / Migration=NONE / DB·Storage Mutation=NONE / Test Data=NONE / AI·Vector·RAG·Semantic·SearchIndex·Intent=NONE / Matching=NO CHANGE / RFQ=NO CHANGE** |
| Canonical Discovery IA | **DISCOVER=Search(/search)/Categories(/categories)·能力分类/Capabilities(=Product 语义角色·/products)/Products(/products)/Suppliers(/search?type=supplier-product + /suppliers/[id])**；内容（解决方案/知识中心）降至 Supporting Layer；`/business`·`/about` 保留于 footer，不产生死链 |
| Nav Semantic Convergence | **VERIFIED**：PublicHeader NAV_ITEMS 重建为 DISCOVER 主线（首页/搜索/能力分类/产品中心/能力型号·供应商/解决方案/知识中心）；新增**供应商公开发现入口** `/search?type=supplier-product`（复用现有搜索面，不新增路由）；`/search` 通过 `parseType(searchParams.get('type'))` 正确落地到能力型号 Tab |
| Architecture Authority | **ONE 权威集**：Capability=Product Semantic Authority（product.id 唯一 identity）；Product=Canonical Platform Object；Supplier=Organization(type=SUPPLIER)；SupplyProduct=Supplier-owned Commercial Product；Specification=ParameterDefinition Authority。无第二套 authority（无双 authority） |
| Public / Workspace / Admin Boundary | **BOUNDARY VERIFIED**：Public Discovery（/ /search /categories /products /suppliers）公开只读；BUYER WORKSPACE=/dashboard/buyer、SUPPLIER WORKSPACE=/dashboard/supplier、ADMIN 运营中心与之分离；Public/Workspace 通过认证入口分界，不混淆 |
| Cross-Entity Discovery Paths | **STRUCTURAL VERIFIED**：Search→Category→Product（categoryPath `/products?categoryId=`）；Search→Product→Supplier（SupplierProductResultCard→`/products/[slug]`→SupplierCapabilityList/SupplierInfo→`/suppliers/[id]`）；Category→Product；Product→Supplier（`/suppliers/${org.id}`）；Supplier→Published SupplyProduct→Product（`/suppliers/[id]` 供应能力区）；Public→Workspace=**BOUNDARY VERIFIED**。真实数据 runtime=UNVERIFIED（empty data） |
| Route Canonicalization | **CONDITIONAL**：复用现有 canonical 路由（/search /categories /products /suppliers/[id]），收敛导航语义、保留 SEO/导航语义；`/supplier-models` 遗留静态路由存在（207B）→ **Future Candidate**（未改动，不虚构收敛） |
| Runtime Evidence | Route Reachability=**VERIFIED**（HTTP GET `/` `/search` `/search?type=supplier-product` `/categories` `/products` `/solutions` `/knowledge` `/about` `/business` 全 200；GET only，无业务写入）；Navigation Wiring=**VERIFIED·STRUCTURAL**（homepage SSR HTML 含 DISCOVER 主线标签 能力分类/能力型号·供应商/搜索/产品中心）；Real Product/Supplier/Capability Population=**UNVERIFIED**（product=0/supplier_product=0/offer=0，空数据合法） |
| Empty-data Classification | **Route Reachability=VERIFIED / Navigation·Query Wiring=VERIFIED / Real Product·Supplier·Capability Population=UNVERIFIED**；HTTP 200 ≠ Experience Complete；Empty List ≠ Feature Broken |
| Mobile | **STRUCTURAL**（主导航 count=7 不变，移动端 hamburger < lg；`/business` `/about` 主导航移除仅收敛语义，footer 保留可达）；受 **No-Visual-Loop Gate** 约束，未重入逐屏视觉审计，未扩大为视觉项目；768≈140px 历史溢出 → **Future Candidate / Carry Forward** |
| Static | **PASS**（`@visndt/api build` exit 0 / `@visndt/web lint` exit 0 仅存量 warnings / `@visndt/web build` exit 0 全 44 静态页）；API lint=**PRE-EXISTING TOOLING GAP**（apps/api 无 eslint.config.*，不伪造 PASS） |
| Regression | **NO BEHAVIOR CHANGE**：Auth/RBAC/Demand/Matching/RFQ/RFQResponse/Inquiry 未触及；Search/Category/Product/Supplier/Workspace Entry 无未授权回归（仅导航语义收敛，业务行为不变） |
| Scope Compliance | Schema=NO CHANGE / Migration=NONE / Database Mutation=NONE / Test Data=NONE / AI·Vector·RAG·Semantic Search=NONE / Matching=NO CHANGE / RFQ=NO CHANGE / Transaction=NONE；无新增 Capability/Supplier/Specification Authority；无 Search Index；无 Global UI/Header Rewrite（仅语义收敛）；无 Route Migration（复用现有路由） |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1=COMPLETE-CONDITIONAL / M34.2=COMPLETE-CONDITIONAL / M34.3=COMPLETE-CONDITIONAL / M34.4=CONDITIONAL PASS / M34.4R=CONDITIONAL PASS / **M34.5=CONDITIONAL PASS** / M34.6=NOT AUTHORIZED / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| Remaining Conditions | Real-data Population=**UNVERIFIED**（empty） / 768 溢出=**Carry Forward→Future Candidate** / `/supplier-models` 遗留路由=**Future Candidate** / 历史搜索缺口=**Unverified** / Supplier user-facing 目录=**NOT CLAIMED**（仅 entry+详情面，无全量供应商列表） |
| Final Decision | **CONDITIONAL PASS**（M34.5 implementation accepted ≠ M34 platformization complete；空数据合法 → Real-data runtime UNVERIFIED 为条件） |
| Review Report | docs/_review/757_M34.5_Canonical_Discovery_Information_Architecture_Report.md |
| Next Authorized Stage | **M34.6 Evaluation + Connection Workflow / NOT AUTHORIZED（本任务已 STOP，不得自动进入 M34.6/M34.7/M34-FINAL；后续必须独立授权）** |

### 758 M34.5 Discovery Surface Completion And Evaluation Gate（758 CONDITIONAL PASS / DISCOVERY COMPLETION GATE / Supplier Surface 补齐 + Cross-Entity Continuity / Frontend-Only · 复用后端已存在 suppliers 组 / Evaluation Entry Gate → M34.6 READY FOR INDEPENDENT AUTHORIZATION）

> 758 是 **Discovery Completion Gate（B1–B7）**：在 757 Canonical IA 之上，真正补齐**能力导向 + 供应商导向发现面**与**跨实体发现连续性**，为 M34.6 Evaluation + Connection 提供独立授权入口。**非 Evaluation / Connection / 视觉改造**；完成后 **STOP**。

| Field | Value |
|-------|-------|
| Iteration | `758_M34.5_Discovery_Surface_Completion_And_Evaluation_Gate` |
| Core | **补齐供应商发现面 + Product→Supplier 连续性**：前端消费后端已存在的 `suppliers` 组（PUBLISHED SupplierProduct→Organization(type=SUPPLIER) 聚合，无 Offer 依赖） |
| Change Surface | Code=仅 8 个前端展示/接线文件（`lib/api/search.ts`/`services/search.service.ts`/新增 `SupplierResultCard.tsx`/`SearchPageContent.tsx`/`SearchTypeTabs.tsx`/`SupplierProductResultCard.tsx`/`ProductDetailContent.tsx`/`GlobalSearchBar.tsx`）/ Schema=NO CHANGE / Migration=NONE / API=NO CHANGE / Backend=NO CHANGE / DB·Storage Mutation=NONE / Test Data=NONE / AI·Vector·RAG·Semantic=NONE / Matching·RFQ·Transaction=NO CHANGE |
| Complexity | Code Change = **Minimal（Frontend Display-Layer）** |
| Supplier Surface | **补齐（B4）**：`/search?type=supplier` 供应商列表（SupplierResultCard）+ `/suppliers/[id]` 详情 = Supplier=Organization(type=SUPPLIER)，Public Supplier List Source=PUBLISHED SupplierProduct |
| Cross-Entity | **补齐 Product→Supplier 链接（B5/B6）**：SupplierProductResultCard + ProductDetailContent 供应商名 →`/suppliers/${orgId}` 链接 |
| Gates | B1 Search=PASS / B2 Category=PASS / B3 Capability=PASS / B4 Supplier=PASS / B5 Cross-Entity=PASS·STRUCTURAL / B6 Continuity=PASS·STRUCTURAL / B7 Authority=PASS（ONE 权威集，无第二套 authority） |
| Real-data Runtime | **UNVERIFIED**（product=0/supplier_product=0/offer=0，合法空数据）；Route Reachability + Navigation Wiring = VERIFIED·STRUCTURAL |
| Static | API build exit 0 / Web lint exit 0 / Web build exit 0 / **API lint = PRE-EXISTING TOOLING GAP**（apps/api 无 eslint.config.*），不伪造 PASS |
| Regression | **NO BEHAVIOR CHANGE**（Auth/RBAC/Demand/Matching/RFQ/RFQResponse/Inquiry 未触及；Product/SupplierProduct/Search/Category/Workspace 无业务改动） |
| Mobile | **STRUCTURAL**（供应商卡响应式 grid）；768≈140px 历史溢出=CARRY FORWARD→Future Candidate |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1-3=COMPLETE-CONDITIONAL / M34.4=CONDITIONAL PASS / M34.4R=CONDITIONAL PASS / **M34.5=CONDITIONAL PASS / 758=CONDITIONAL PASS** / **M34.6=NOT AUTHORIZED / READY FOR INDEPENDENT AUTHORIZATION** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| Remaining Conditions | Real-data Population=**UNVERIFIED**（empty） / 768 溢出=**Carry Forward→Future Candidate** / `/supplier-models` 遗留路由=Future Candidate / `/suppliers/[id]` 详情页"供应能力"区仍基于 Offer=**LEGACY**（不改写，转 M34.6/Governance Future Candidate） |
| Final Decision | **CONDITIONAL PASS**（核心 Discovery Surface 建立 + 结构证据充分 + 无架构违规 + 空数据合法 → Real-data runtime UNVERIFIED） |
| M34.6 Recommendation | **READY FOR INDEPENDENT AUTHORIZATION**（Gate B1–B7 结构性达成；唯真实数据空，故状态=NOT AUTHORIZED，须独立授权后在数据就绪情况下实施 Evaluation+Connection） |
| Review Report | docs/_review/758_M34.5_Discovery_Surface_Completion_And_Evaluation_Gate_Report.md |
| Next Authorized Stage | **M34.6 Evaluation + Connection Workflow / NOT AUTHORIZED（READY FOR INDEPENDENT AUTHORIZATION；本任务已 STOP，不得自动执行 Compare/Shortlist/Inquiry/RFQ/Buyer-Supplier workflow）** |

### 759 M34 Technical Context + Discoverability Architecture Reconciliation（759 CONDITIONAL PASS / 补足 Context + Discoverability / 冻结 Technical Context 模型 + Discoverability 契约 + Search 语义契约 + M34.6 Blueprint / 零生产代码）

| Field | Value |
|-------|-------|
| 759 Status | **CONDITIONAL PASS**（Technical Context boundary 已冻结 + Discoverability Contract 建立 + Search semantics 收敛 + M34.6 Blueprint 建立 + 无架构违规；剩余 gap=既有数据空限制 + 历史遗留（legacy `/search/supplier-models`、768≈140px overflow、`/supplier-models` 路由、SITE_URL placeholder）+ Future Candidates（Application/DetectionObject/Standard/Certification/Evidence 一级对象）） |
| Change Boundary | **Production Code = NONE**（纯架构审计 + 语义契约 + 文档同步）；Schema=NO CHANGE / Migration=NONE / DB·Storage Mutation=NONE / Test Data=NONE / AI·Vector·RAG·Embedding·Semantic·SearchIndex·Intent=NONE / Matching=NO CHANGE / RFQ=NO CHANGE / Global UI Rewrite=NONE |
| Repository | 仓库根 `F:\Desktop\VISNDT` / 代码根 `F:\Desktop\VISNDT\VISNDT` / 分支 `main` / 提交 `ff03a9a` / Working Tree OTHER（既有改动，759 不再改代码） |
| Technical Context Model | **类型化 Context Block**=Capability(Product)+SupplierProduct(Model)+Organization(Provider)+Category+Parameter/Spec+Evidence(FileAsset)+Knowledge/Solution（轻量挂载）；**Contract 级，不建表** |
| Context 语义角色 | Application=FUTURE / Detection Object=FUTURE / Insight=FUTURE（现有衍生） / Knowledge=现有 Publication Domains（Content type=KNOWLEDGE / KnowledgeEntry） / Standard=FUTURE / Document=FUTURE（FileEntityType） / Certification=FUTURE / Evidence=FUTURE（FileAsset 双形态） / Media=CONTENT·FUTURE / Solution=现有 /solutions（Content type=SOLUTION）+ 应用场景 |
| Discoverability Contract（Internal / External / AI·LLM 共享） | **Internal Search**=统一 `/search`（unified 六类聚合）+ `/categories` + `/products` + `/suppliers/[id]`；**External Search**=SEO Metadata + JSON-LD（Organization/WebSite+SearchAction/Article/TechArticle/Product）+ canonical URL；**AI·LLM**=推广/爬取无结构化 API 的被动可读、不变更、无运行时 AI。三者共享同一 Canonical Entity + Semantic + URL + Structure + Relationship + Evidence |
| Search Semantic Contract（判定） | `product`=**CANONICAL**（Capability Authority）/ `capability`=**ALIAS → product** / `supplier-product`=**CANONICAL**（Supplier-owned Capability Model）/ `supplier`=**CANONICAL**（Capability Provider / Supplier Entity）/ `knowledge`=**CANONICAL** / `solution`=**CANONICAL** / `category`=**CANONICAL（FACET / IA）非搜索 type** / `/search/supplier-models`（API）=**LEGACY → Remove Later** / `/supplier-models`（路由）=**LEGACY / DEPRECATE → Remove Later** |
| supplier vs supplier-product（专项） | **NOT DUPLICATE / NOT CONFLICT — CANONICAL（双视图，粒度不同）**：`supplier`=供应商实体视图（Organization(type=SUPPLIER) 聚合 / Provider）；`supplier-product`=能力型号视图（SupplierProduct / Model）。共享同一 PUBLISHED 种群但投影粒度不同（Organization 级 vs Model 级）；关系=Model→Provider 下钻 + Provider→Models 上卷，**非重复**。两 Tab 语义固定，不得合并、不得互相承载列表 |
| Relationship Graph | SupplierProduct→Organization(Provider / type=SUPPLIER) / SupplierProduct→Product(Capability Authority via platformProductId) / Product→Category / Category→PCKM→KnowledgeCategory→KnowledgeEntry（确定性）/ Knowledge→KB / Solution=Content type=SOLUTION / Evidence=FileAsset（FileEntityType） |
| M34.6 Blueprint | **Evaluation + Connection Workflow**：`Technical Context → Compare(CompareBar/既有) → Shortlist → Inquiry → RFQ/Buyer↔Supplier`；复用既有 Demand/RFQ/RFQResponse/Inquiry；禁止重新设计交易系统 |
| Expansion Gates | Gate A—Authority=**HOLD** / Gate B—Context=**PASS**（分类完成；一级对象=FUTURE）/ Gate C—Discoverability=**PASS**（契约建立）/ Gate D—Evaluation=Blueprint 建立·实施 NOT AUTHORIZED / Gate E—Implementation=759 CONDITIONAL PASS → M34.6 可规划但独立授权 |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1-3=COMPLETE·CONDITIONAL / M34.4=CONDITIONAL PASS / M34.4R=CONDITIONAL PASS / M34.5=CONDITIONAL PASS / 758=CONDITIONAL PASS / **759=CONDITIONAL PASS（CURRENT）** / **M34.6=NOT AUTHORIZED（READY FOR INDEPENDENT AUTHORIZATION·Blueprint+Contract 达成，唯真实数据空不作为授权）** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| C2 / C5 / C6 | **C2=CONDITIONAL（保持）/ C5=FOUNDATION·NOT FULL DISCOVERY（保持）/ C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH（保持）**；759 未升级三态 |
| Static / Runtime | **759 零生产代码 → 复用既有 758 Static baseline**（api build 0 / web lint 0 / web build 0，不重复完整生产构建）；Runtime=**GET only / 未创建业务数据**（既有路由/搜索/Context/API 只读验证）；Real Product/Supplier/Capability Population=**UNVERIFIED**（合法空数据） |
| Mobile | STRUCTURAL；**768 ≈ 140px overflow = CARRY FORWARD**（归 M34.7/未来，不阻断架构验证、不作为本任务修复） |
| Review Report | docs/_review/759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation_Report.md |
| Next Authorized Stage | **M34.6 Technical Context + Evaluation / NOT AUTHORIZED（READY FOR INDEPENDENT AUTHORIZATION；本任务已 STOP，不自动执行 Compare/Shortlist/Inquiry/RFQ/Buyer↔Supplier；不自动实施 Insight/Application/DetectionObject/Knowledge/Standard/Document/Evidence/Solution 与 SEO/Structured Data/LLM Runtime/AI Search/Embedding/Vector/RAG）** |

### 760 M34.6 Pre-Execution Authorization Gate（760 = CURRENT AUTHORIZATION GATE → **NOT AUTHORIZED** / M34.6 = NOT AUTHORIZED / BLOCKED / 预执行授权门禁 / Runtime Readiness / 零生产代码）

| Field | Value |
|-------|-------|
| 760 Status | **CURRENT AUTHORIZATION GATE = NOT AUTHORIZED**（M34.6 = **NOT AUTHORIZED / BLOCKED**，等待数据就绪后重新授权） |
| Change Boundary | **Production Code = NONE**；Schema=NO CHANGE / Migration=NONE / DB·Storage Mutation=NONE / Test Data=NONE / Search·Discovery·Matching·Inquiry·RFQ=NO CHANGE / Transaction=NONE / Marketplace·Seller·Store·Cart·Checkout·Order·Payment·Transaction=NONE / SEO·LLM·Vector·RAG·Embedding·Semantic·SearchIndex=NONE / Mobile·Accessibility·Visual Redesign=NONE |
| Repository | 仓库根 `F:\Desktop\VISNDT` / 代码根 `F:\Desktop\VISNDT\VISNDT` / 分支 `main` / 提交 `ff03a9a`（`M31阶段优化完成`）/ Working Tree OTHER（既有改动，760 不新增生产代码）；BASELINE DRIFT=NONE |
| Authorization Decision | **NOT AUTHORIZED**：Scope = PASS / Architecture(ONE Authority) = PASS / Workflow Safety = PASS / Runtime Plan = PASS / RBAC = PASS / Expansion Control = PASS / Documentation = PASS / Mobile = PASS（768≈140px CARRY FORWARD） / **Real-data Readiness = FAIL（Product=0 / SupplierProduct=0 / Offer=0）** |
| 阻断项（Condition） | **Real-data Readiness = NOT READY**（核心 Product→SupplierProduct→Supplier 评估链零可验证真实数据）→ 命中 NOT AUTHORIZED「真实数据完全无法支撑核心验证」 |
| 重新授权前置 | 数据就绪后提供最小评估数据集（≥1 published Product + ≥1 published SupplierProduct(platformProductId→Product) + 拥有它的 SUPPLIER 组织 + Product 参数；多记录 2+ 集用于 Compare/Shortlist）并重跑本 Gate；Shortlist 持久化边界 = 待独立 Architecture Decision |
| Compare | 读only投影复用既有 `/products/compare?ids=`（Platform Product + SupplierProduct 双模式，URL 状态共享）；不新第二套权威 |
| Shortlist | User Evaluation State（grep 无现存实现）；非商业实体；跨会话持久化若需新表 → Architecture Decision Required（760 不裁决） |
| Inquiry / RFQ | 复用既有 Demand/Match/RFQ/RFQResponse/Inquiry 一等模型；M34.6 = Orchestration / Evaluation Entry；禁止第二套工作流 |
| Real-data（760 实测） | product=0 / supplier_product=0 / offer=0 / inquiry=0 / demand=3 / rfq=2 / rfq_response=1 / org(SUPPLIER)=8（但无已发布 SupplierProduct 无可发现链路）/ product_category=28 / parameter_definition=54 / knowledge_entry=6 / content=8 |
| Runtime Verification Plan | **PASS（授权前定义完成）**：Discovery→Evaluation / Technical Context / Compare 矩阵 / Shortlist 矩阵 / Inquiry 矩阵 / RFQ 矩阵 / RBAC 矩阵 / Mobile（768≈140px CARRY FORWARD） |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1-3=COMPLETE·CONDITIONAL / M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）/ **760=NOT AUTHORIZED（CURRENT GATE）** / **M34.6=NOT AUTHORIZED / BLOCKED** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| C2 / C5 / C6 | **C2=CONDITIONAL / C5=FOUNDATION·NOT FULL DISCOVERY / C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH**（保持，未升级） |
| Review Report | docs/_review/760_M34.6_Pre-Execution_Authorization_Gate_Report.md |
| Next Authorized Stage | **M34.6 Evaluation + Connection / NOT AUTHORIZED / BLOCKED（本任务已 STOP；不得自动进入 M34.6 Implementation；须数据就绪后重新跑 760 Gate 并以独立授权进入受控实施）** |

### 761 M34.6 Real Data Readiness Remediation + Gate Reconciliation（761 = CURRENT Data Readiness Gate → **CASE B** / M34.6 = NOT AUTHORIZED / Data Readiness Audit + Gate Reconciliation / 四维分类 + 修正 Offer 判定 + 判定既有 Onboarding 链路 / 零生产代码）
> 在 760 `NOT AUTHORIZED` 基础上，把 760 的「Real-data BLOCKER」从粗粒度计数判断升级为可审计、可分层、可验证、可授权的四维 Data Readiness Gate。任务不实施 M34.6，也不撰写 Synthetic Data。

| 字段 | 值 |
|------|-----|
| 761 Status | **CURRENT / COMPLETE**（Data Readiness Audit + Gate Reconciliation；Core=NOT READY·BLOCKER / Extended=NOT READY / Workflow=CONDITIONAL / Commercial=OPTIONAL；Data Source=AVAILABLE；零生产代码） |
| Gate-Logic 修正 | **Offer = OPTIONAL / COMMERCIAL CONTEXT / LEGACY WORKFLOW DATA，NOT CORE BLOCKER**（760 将 `Product=0/SupplierProduct=0/Offer=0` 并列判定存在粗粒度错误；761 无任何 M34.6 核心验收场景强依赖 Offer 的证据） |
| Repository | 仓库根 `F:\Desktop\VISNDT` / 代码根 `F:\Desktop\VISNDT\VISNDT` / 分支 `main` / 提交 `ff03a9a` / Working Tree OTHER（既有改动，761 不新增生产代码）；BASELINE DRIFT=NONE |
| Core Data Gate | **NOT READY / BLOCKER**（Product=0 / Published SupplierProduct=0 / Discoverable SUPPLIER=0 / Relationships=0 / Product Parameter Runtime=0） |
| Extended Evaluation Gate | **NOT READY**（2nd Product/SP/Supplier/ParamProfile 均 0；非架构失败） |
| Workflow Scenario Gate | **CONDITIONAL**（Demand=3：DRAFT1/CLOSED2；RFQ=2：DRAFT1/OPEN1；RFQResponse=1：SUBMITTED；Inquiry=0；按场景分判，不用单一全局判定） |
| Commercial Gate | **OPTIONAL**（Offer=0；无 Scenario Dependency） |
| Existing Real Data Source | **AVAILABLE**（Admin Product Create / Admin Product Governance / Admin SupplierProduct 全生命周期 / Organization 管理 / ParameterDefinition 管理 均已存在；可合法产生 Published Product/SupplierProduct/Organization relationship/Parameter Profile；761 未实施数据导入/清洗/创建） |
| Real-data（761 实测） | product=0 / supplier_product=0 / published_supplier_product=0 / offer=0 / inquiry=0 / demand=3 / rfq=2 / rfq_response=1 / org(SUPPLIER)=8（无已发布 SupplierProduct→无可发现链路）/ product_category=28 / parameter_definition=54（无 Product 关联及值）/ knowledge_entry=6 / content=8 |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1-3=COMPLETE·CONDITIONAL / M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）/ **760=NOT AUTHORIZED（保持）** / **761=CURRENT（Data Readiness Gate）** / **M34.6=NOT AUTHORIZED（Case B：Core NOT READY，Data Source AVAILABLE）** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| C2 / C5 / C6 | C2=CONDITIONAL / C5=FOUNDATION·NOT FULL DISCOVERY / C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH（761 未升级） |
| Mobile | 761 不做视觉改造；M34.6 Runtime Plan 保持 Desktop+Mobile；`768≈140px overflow` = **CARRY FORWARD**（不借 761 修复） |
| Review Report | docs/_review/761_M34.6_Real_Data_Readiness_Remediation_And_Gate_Reconciliation_Report.md |
| Next Authorized Stage | **Controlled Real-data Onboarding / Preparation Assessment（独立任务，不在 761 内执行）**；数据就绪后重跑 **762_M34.6_Authorization_Recheck**；Shortlist Persistence Boundary = ARCHITECTURE DECISION REQUIRED；本任务已 **STOP**，不得自动执行 M34.6 Implementation / Compare / Shortlist / Inquiry / RFQ / Marketplace / Transaction / SEO / LLM / Vector / RAG / M34.7 / M34-FINAL |

### 762 M34.6 Controlled Real-data Onboarding Preparation Assessment（762 = CURRENT / Onboarding Preparation Assessment / 验证既有合法业务管理链路能否不扩域合法落地 M34.6 Core Dataset / 零生产代码 · 零数据创建 · READ-ONLY）
> 在 761（Core NOT READY + Data Source AVAILABLE / Case B）基础上，762 只读核验既有合法业务管理链路（Product / SupplierProduct / Organization / Parameter）能否在不新增 Domain Authority、不新增 M34.6 业务模型、不修改 Search/Discovery/Workflow、不制造 Synthetic Data 的前提下合法产生 M34.6 最小真实数据集，并冻结后续真实数据准备所需的业务步骤、数据条件、发布条件、关系条件与参数条件。**非数据创建 / 非 M34.6 Implementation / 非 M34.6 Authorization。**

| Field | Value |
|-------|-------|
| 762 Status | **CURRENT / COMPLETE**（Architecture Audit + Real-data Onboarding Assessment + Data-flow Verification + Governance/Lifecycle Verification + Runtime Readiness Preparation；Production Code=NONE；Database=READ-ONLY） |
| Core Dataset Definition | **≥1 Published Product（status='ACTIVE'）＋ ≥1 Published SupplierProduct（status=PUBLISHED）＋ ≥1 SUPPLIER Organization ＋ valid Product↔SupplierProduct（platform_product_id）＋ valid SupplierProduct↔SUPPLIER Organization（organization_id）＋ ≥1 valid Product Parameter Profile（ProductParameterValue→ParameterDefinition）** |
| Extended Dataset Definition | ≥2 Products／≥2 SupplierProducts／≥2 Discoverable Suppliers／≥2 Parameter Profiles；≥1 组「same Product + multiple SupplierProducts + different Suppliers」＋ ≥1 组「different Products + different Parameter Profiles」 |
| Product Lifecycle | Admin > Product Operation Center（CREATE→EDIT→批量状态→ status='ACTIVE' = Publish → Discovery 可见）＝ AVAILABLE |
| SupplierProduct Lifecycle | 状态机 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED`；`platform_product_id` 强校验存在；`organization_id` 服务层派生；publish=status=PUBLISHED ＝ AVAILABLE |
| Parameter Lifecycle | `parameter-definitions` + `parameter-groups` + `product-parameters`（POST `/products/:id/parameters` → ProductParameterValue → ProductParameterDefinition）运行时可读 ＝ AVAILABLE |
| Publication / Discoverability | Product 可发现=`status='ACTIVE'`；SupplierProduct 可发现=`status=PUBLISHED`；Supplier 聚合=`status=PUBLISHED` 且 `organization.type='SUPPLIER'`（search.service.ts 冻结） |
| Core Data Readiness | **NOT READY（INSTANCE）／ STRUCTURALLY READY（PATH）**（结构可落地；实例 Product=0 / SupplierProduct=0 / Discoverable Supplier=0） |
| Extended Evaluation Readiness | **NOT READY**（需 2+；非架构失败） |
| Workflow Scenario Readiness | **CONDITIONAL / SPARSE**（Demand=3 / RFQ=2 / RFQResponse=1 / Inquiry=0） |
| Commercial Readiness | **OPTIONAL**（Offer=0；无场景依赖） |
| M34 Roadmap Alignment | M34.0=CONDITIONAL / M34.1-3=COMPLETE·CONDITIONAL / M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）/ **760=NOT AUTHORIZED（保持）** / **761=ACCEPTED / CONDITIONAL（保持）** / **762=CURRENT（Onboarding Preparation Assessment）** / **M34.6=NOT AUTHORIZED（PENDING RECHECK）** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| Shortlist Persistence Boundary | **ARCHITECTURE DECISION REQUIRED（保持，762 不裁决；若持久化需新表 → 独立 Schema Assessment + Migration Plan）** |
| Review Report | docs/_review/762_M34.6_Controlled_Real_Data_Onboarding_Preparation_Assessment_Report.md |
| Next Authorized Stage | **Controlled Real-data Onboarding / Preparation（真实数据落地，独立任务，不在 762 内创建任何数据）**；数据就绪后重跑 **M34.6 Authorization Recheck（762）**；短名单持久化边界需先独立 Architecture Decision。本任务已 **STOP**，不得自动执行 M34.6 Implementation / Compare / Shortlist / Inquiry / RFQ / Search / Discovery / Marketplace / Transaction / SEO / LLM / Vector / RAG / M34.7 / M34-FINAL |

### 763 M34.6 Controlled Test Data Onboarding（763 = CURRENT / Controlled Test Data Onboarding / 受控测试数据落地，建立 M34.6 Core Dataset / 零 Schema · 零 Migration · 零生产代码 · 数据落地级）
> 在 761（Core NOT READY + Data Source AVAILABLE / Case B）与 762（STRUCTURALLY READY / INSTANCE NOT READY）基础上，通过既有合法业务数据链路（Organization=SUPPLIER / User / Product=Capability / ProductParameterValue→ParameterDefinition / SupplierProduct 生命周期→PUBLISHED）落地一套受控测试数据集，解除 762 实测的产品/供应商产品/供应商/参数全零数据阻断。**非 M34.6 Implementation / 非 M34.6 Authorization / 非交易数据 / 非 Synthetic-Fake。**
>
> 执行原则：受控测试数据落地（direct data landing）只改 Database 数据，**不修改**任何生产代码；只新增未跟踪的 `database/_763_*.sql` 脚本；`schema.prisma` diff=空（NONE）、无 migration、无一级 Domain Authority 新增、无 Search/Discovery/Product/SupplierProduct/Parameter/Matching/Inquiry/RFQ 变更；不创建 Offer / Fake Transaction / Fake Inquiry / Fake RFQ / Fake RFQResponse；6 个测试账号共用受控密码（`Visndt763Test!`，仅 Controlled Test Dataset 身份，不触发真实邮件/短信/支付）。

| Field | Value |
|-------|-------|
| 763 Status | **PASS（Core Dataset READY）** / Core Data Gate = **READY** / M34.6 = **NOT AUTHORIZED（PENDING RECHECK）** |
| Repository | 仓库根 `F:\Desktop\VISNDT` / 代码根 `F:\Desktop\VISNDT\VISNDT` / 分支 `main` / HEAD `ff03a9a`（与 761/762 基线一致） |
| Working Tree | OTHER（762 前后既有大批未提交改动，属 M32/M33/M34 前序任务；**763 未改动任何已跟踪文件**，仅新增未跟踪 `database/_763_onboard.sql / _763_probe.sql / _763_verify.sql`）；Schema diff=NONE / Migration=NONE / Production Code=NONE |
| Organizations | MicroVision 深圳市微视光电科技有限公司（既有，SUPPLIER/ACTIVE，未重复）=PASS；Revopoint 西安知象光电科技有限公司（新建，SUPPLIER/ACTIVE）=PASS；Discoverable SUPPLIER（PUBLISHED SP + org.type=SUPPLIER）=**2** |
| Controlled Test Users | 6 个：admin.vs.763@ → 微视/ADMIN、admin.zx.763@ → 知象/ADMIN、zhangsan/lisi.763@ → 微视/MEMBER、wangwu/zhaoliu.763@ → 知象/MEMBER（全 ACTIVE，归属正确） |
| Products | ZB-K60、ZB-TJ095、POP 4、MetroY Ultra 共 **4**，全部 `status='ACTIVE'`（可发现）；ACTIVE Product=4 |
| SupplierProducts | SP-001..004（ZB-K60/ZB-TJ095→微视；POP4/MetroY Ultra→知象）全部 `status=PUBLISHED`；PUBLISHED=4；orphan=0；invalid org-type=0；平台产品绑定 valid |
| Parameter Profiles | 每 Product 8 条 ProductParameterValue→ParameterDefinition＋8 条 ProductParameterDefinition 关联；PPV 总计 **32（≥20）**；4 个 Profile 运行时可读（GET `/products/:id/parameters` 各返回 8） |
| Runtime Verification | 受控账号登录成功（SUPPLIER/ADMIN）；`/api/v1/search?q=...` 对 4 个产品均 products=1＋supplierProducts=1＋suppliers=1；`/search/context` categories=1／commonFilters=1；Search/Discovery/Product detail/Parameter Context **READABLE** |
| Data Classification | Product/SupplierProduct 描述与参数 = **PUBLIC_SOURCE_DATA + CONTROLLED_TEST_DATA**（标注前缀）；无虚构认证/专利/客户/成交/订单/价格/库存/评价/检测报告（**763 时段陈述，已由 765 C7 明确 superseded：`PUBLIC_SOURCE_DATA` 重分类为 `USER_PROVIDED_TEST_DATA`，官网来源 UNVERIFIED、不写成「官网已确认」；数据库 `[PUBLIC SOURCE DATA]` 文本保持不改** —— 见 765 段与 766 Recheck） |
| Image / Media | **OPTIONAL（未实现）**：公开产品图仅作 CONTROLLED TEST DATA 建议项，未进入媒体/文件存储流水线；记录为 Optional Data Gap（不阻断 Core Gate） |
| Core Data Gate | **READY**（Published Product≥1 / Published SupplierProduct≥1 / SUPPLIER Org≥1 / Product↔SupplierProduct 关联 valid / SupplierProduct↔SUPPLIER Org valid / Product Parameter Profile≥1） |
| Extended Dataset Gate | **READY**（Products=2+、SupplierProducts=2+、Discoverable Suppliers=2+、Parameter Profiles=2+）；⚠ `same Product + multiple SupplierProducts`=**NOT SATISFIED**（Extended Scenario Gap，非 Core Blocker，不为此创建重复 SupplierProduct） |
| Workflow Gate | **CONDITIONAL**（未触碰；Demand=3 / RFQ=2 / RFQResponse=1 既有已存在；Inquiry/Offer=0 保持） |
| Commercial Gate | **OPTIONAL**（Offer=0；DO NOT CREATE OFFER；不阻断 Core） |
| Schema / Migration / Production Code | NONE / NONE / NONE |
| Synthetic Data | NONE（受控测试数据已创建，非虚构真实交易/客户/订单） |
| Roadmap Alignment | M34.0-4·4R·5·758·759=CONDITIONAL PASS（保持）/ **760=NOT AUTHORIZED（保持）** / **761=ACCEPTED·CONDITIONAL（保持）** / **762=STRUCTURALLY READY·INSTANCE NOT READY（保持）** / **763=CURRENT（Controlled Test Data Onboarding）** / **M34.6=NOT AUTHORIZED（PENDING RECHECK）** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED |
| Shortlist Persistence Boundary | **ARCHITECTURE DECISION REQUIRED（保持，763 不裁决）** |
| Review Report | docs/_review/763_M34.6_Controlled_Test_Data_Onboarding_Report.md |
| Next Authorized Stage | **M34.6 Authorization Recheck（独立 Gate）** 或 **Manual Data Completion（如需补齐 Extended Scenario/同上 Product 多 SupplierProduct 等可选/扩展缺口）**；本任务已 **STOP**，不得自动执行 M34.6 Implementation / Shortlist / Evaluation / Compare / Inquiry / RFQ / Search / Discovery / Marketplace / Transaction / SEO / LLM / Vector / RAG / M34.7 / M34-FINAL |

### 764 M34.6 Authorization Recheck（764 = CURRENT / AUTHORIZATION RECHECK / 只读审计 / M34.6=CONDITIONAL）

- **性质**：Authorization Gate 独立重查，READ-ONLY（NO CODE CHANGE / NO DATA CREATION）。基于 761/762/763 冻结证据，对 M34.6 授权做唯一最终判定。
- **核验**：Repository=PASS（F:/Desktop/VISNDT）/ Code Root=PASS / Branch=main / HEAD=ff03a9a（无漂移）/ Schema diff=0 / Working Tree=169 项历史改动（764 零新增）。Core Dataset=READY（4 Product·4 ACTIVE / 4 SupplierProduct·4 PUBLISHED / 2 可发现 Supplier / 32 PPV / orphan=0·bad_org=0·4 参数 Profile）。Runtime：`q=内窥镜`→products=2·sp=2·suppliers=1、`q=POP`→1·1·1、`GET /products/zb-k60`→ACTIVE＋8 参数 READABLE。Workflow：Demand=3/RFQ=2/RFQResponse=1/Inquiry=0/Offer=0。Data Provenance=PASS（受控边界正确、Synthetic=NONE、[PUBLIC SOURCE DATA] 标签 UNVERIFIED→Rule E 文档校正）。
- **Extended 表述纠正**：763 的 `Extended = READY (4/5)` **不再沿用** → **Extended = PARTIAL / CONDITIONAL（Scenario Gap）**（`products_with_multiple_sp=0`）。
- **Shortlist 架构决策**：Case A = **CARRY FORWARD（当前非阻断）**；`schema.prisma` 无 Shortlist/Evaluation 模型。
- **最终判定**：**M34.6 = CONDITIONAL**（Core=READY 且主 Gate 全 PASS，但存在条件 C1-C7：Extended PARTIAL、Workflow CONDITIONAL、Commercial OPTIONAL、Shortlist ARCH DECISION REQUIRED、required 无强制、Image 可选缺口、PUBLIC_SOURCE 标签校正）。不采用 PENDING；未写成 AUTHORIZED。
- **Review Report** `docs/_review/764_M34.6_Authorization_Recheck_Report.md` | 下一授权步：**M34.6 Authorization Recheck（条件 C1-C7 解除后）** 或 **受控扩展数据 + Shortlist 架构决策补足**；本任务已 **STOP**。

### 765 M34.6 Conditional Gap Closure（765 = CURRENT / CONDITIONAL CLOSURE / 条件闭环 / 765=PASS）
- **性质**：764 `M34.6=CONDITIONAL` 后的条件闭环任务；仅解除可解除条件（C1/C2/C4/C7）+ 受控测试数据 + 架构决策 + 文档同步；**不实施 M34.6、不宣布 AUTHORIZED**。
- **核验**：Repository=PASS / Branch=main / HEAD=ff03a9a（无漂移）/ Schema diff=0 / 765 零 Schema·零 Migration·零生产代码改动。
- **C1 Extended Scenario=CLOSED**：新增 `ZB-K60-EX [PUBLISHED]`（同 Product ZB-K60 · 微视，差异化 modelNumber 满足 `@@unique`，经状态机 DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED）。`products_with_multiple_sp` 0→1；SP 4→5（5/5 PUBLISHED）。
- **C2 Workflow Inquiry=CLOSED/VERIFIED**：1 条受控 Inquiry（product=ZB-K60 · 微视 · zhangsan.763，标注 `[M34.6 CONTROLLED TEST DATA][765 CONTROLLED INQUIRY]`），既有 Authority + JWT 认证可读（inquiry=1）；未扩展 Demand/Match/RFQ/Offer/Order。
- **C4 Shortlist Architecture=DECIDED（Decision Only）**：`ADR-M34-13`，Option B — Persistent User Evaluation State；Implementation=NOT STARTED；不新增一级 Domain Model / Schema / Migration。
- **C7 Data Provenance=CORRECTED（文档纠正，DB 不修改）**：`PUBLIC_SOURCE_DATA` 重分类为 `USER_PROVIDED_TEST_DATA`（官网来源 UNVERIFIED）。
- **Runtime（只读）**：products=4 / sp=5(pub=5) / ppv=32 / multi_sp=1 / inquiry=1 / discoverable_suppliers=2 / 4 参数 Profile。
- **保留项**：C3 Commercial=OPTIONAL/DEFERRED；C5 required=DEFERRED；C6 Image/Media=OPTIONAL/DEFERRED。
- **Review Report** `docs/_review/765_M34.6_Conditional_Gap_Closure_Report.md` + ADR `docs/_architecture/ADR-M34-13-Shortlist-Persistence-Boundary.md` | **最终判定：765=PASS / CONDITIONAL CONDITIONS CLOSED；M34.6 Authorization = READY FOR INDEPENDENT RECHECK**；本任务已 **STOP**，等待独立 Authorization Recheck 决定 M34.6 = AUTHORIZED / CONDITIONAL / NOT AUTHORIZED。

### 766 M34.6 Authorization Recheck（766 = CURRENT / INDEPENDENT AUTHORIZATION RECHECK / M34.6=AUTHORIZED）
- **性质**：对 765 条件闭环结果的**独立授权复核**；READ-ONLY（零代码 / 零 Schema / 零 Migration / 零数据创建）。`765 PASS ≠ M34.6 AUTHORIZED`，本结论由 766 独立重新取证判定。
- **独立取证（非继承）**：765 Result=**VERIFIED**——独立 SQL/API 复核 ZB-K60-EX（PUBLISHED）、受控 Inquiry（`204b6570…`，status=NEW）、multi_sp=1、SP 4→5、ppv=32。
- **Baseline**：Repository=PASS / Branch=main / HEAD=ff03a9a（无漂移）/ Schema diff=0 / Migration=36（无新增）/ Production Code=NONE / Business Data Mutation by 766=NONE。
- **Gates（766 独立只读实证）**：Core=**READY**（product=4 ACTIVE / sp=5 PUBLISHED / ppv=32 / orphan=0 / discoverable=2 / profiles=4）；Extended=**COMPLETE**（multi_sp=1，ZB-K60 双 SP 同 pid=`ebb1c034…`）；Workflow/Connection=**READY**（Inquiry rel valid + 认证可读）；Commercial=**OPTIONAL**（Offer=0）；Search/Discovery=**PASS**（q=内窥镜→2 products/3 SP/1 supplier）；Parameter Runtime=**PASS**（zb-k60 8 参数 ACTIVE）。
- **Provenance=PASS**：无「官网已确认」；763 分类行已 superseded → USER_PROVIDED_TEST_DATA + UNVERIFIED（DB 文本不改）。Controlled Boundary=PASS（商业事实表不存在，Synthetic=NONE）。ONE Authority=PASS；ADR-M34-13=VERIFIED；Mobile Contract=PRESERVED；Documentation=CONSISTENT。
- **Blocking=[NONE]**；Deferred/non-blocking=[C3] OPTIONAL、[C5] required=DEFERRED、[C6] OPTIONAL/DEFERRED、[M] Mobile UI=Deferred（Contract Required）。
- **最终判定（Case A 全满足）**：**766 = INDEPENDENT AUTHORIZATION RECHECK；M34.6 = AUTHORIZED**；下一授权步 = **M34.6 Implementation（Evaluation + Connection）= 独立任务 767**。
- **Review Report** `docs/_review/766_M34.6_Authorization_Recheck_Report.md` | 本任务已 **STOP**；即使 AUTHORIZED 也不自动实施下一阶段，须等待独立任务 767 指令。

### 767 M34.6 Implementation（767 = CURRENT / M34.6 Evaluation + Connection / IMPLEMENTED / 受控表 `buyer_evaluation` / Runtime 16/17 PASS）
- **性质**：766 `M34.6=AUTHORIZED` 的正式实施。落实 `ADR-M34-13 Option B — Persistent User Evaluation State`，新增受控表 `buyer_evaluation`（Evaluation 评估断面持久化）+ Connection（复用既有 Inquiry 上下文）；**767 = Implementation（允许 Schema/Migration/代码提交）**。
- **Repository**：仓库根 `F:/Desktop/VISNDT` / 代码根 `F:/Desktop/VISNDT/VISNDT` / 分支 `main` / HEAD `4e21b4e`（767 实施提交，base `ff03a9a`）。
- **Schema（受控表）** ✅：`BuyerEvaluation` + enums（`EvaluationTargetType`/`EvaluationState`），unique `@@unique([userId,targetType,targetId])`，User FK CASCADE；**Authority 边界保持**（评估断面非一级 Domain Authority）。
- **Migration** ✅：`20260831090000_017_buyer_evaluation`（`prisma migrate deploy` 已应用；`migrate dev` Shadow 因 pgvector 失败为已知环境项）。
- **Backend** ✅：`apps/api/src/evaluations/`（module/controller/service/guard/dto×3）；端点 `POST·GET·GET:id·GET:id/connection·PATCH:id·DELETE:id /evaluations`；RBAC=仅 BUYER；owner 隔离 403；目标校验 404/仅 PUBLISHED SP；去重 409；Connection 复用既有 Inquiry 权威，不新建第二套。
- **Runtime 验证** ✅：**16/17 PASS**（CRUD / Persistence / Ownership-403 / Invalid-404 / Duplicate-409 / SP-Connection / RBAC-403）；唯一 Q11A（Product 无 Offer→orgId=null）=**数据空白非代码缺陷**（Offer=0 与 766 Commercial=OPTIONAL 一致）。
- **受控数据** ✅：评估记录标注 `[767 CONTROLLED EVALUATION]`；**未创建**任何 Product/SupplierProduct/Offer/Inquiry 业务数据；Synthetic=NONE。
- **Frontend/UI** ✅：**NOT CHANGED**（Buyer Workspace 短名单 UI / Mobile 归 M34.7/未来，不提前实施）。
- **Roadmap Alignment** ✅：M34.0-5·758-759=CONDITIONAL PASS（保持）/ 760=NOT AUTHORIZED（保持）/ 761=CURRENT·CASE B（保持）/ 762=CURRENT·SR·INR（保持）/ 763=PASS（保持）/ 764=CONDITIONAL（保持）/ 765=PASS（保持）/ 766=AUTHORIZED（保持）/ **767=CURRENT（M34.6 Implementation）** / M34.7=NOT AUTHORIZED / M34-FINAL=NOT STARTED。
- **Review Report** `docs/_review/767_M34.6_Implementation_Report.md` + ADR `docs/_architecture/ADR-M34-13`（Implementation Status Update 登记）| **最终判定：767 = IMPLEMENTED**；本任务已 **STOP**，不得自动实施 M34.7 / M34-FINAL / Governance / SEO / LLM / Mobile UI / Buyer Workspace 短名单 UI；后续所有任务必须重新独立授权。

## Future Architecture Candidates

以下为未来架构演进候选，当前 **FROZEN / NOT FOR DEVELOPMENT**，待满足触发条件后通过正式架构审计重新激活。

### Supplier Product Model Architecture（已分别由 659.2 / 660 冻结，见上「M28.0 Product Domain Model Decision」）

| Field | Value |
|-------|-------|
| Status | **660.5 IMPLEMENTED（Prisma Schema Implementation PASS）** |
| Priority | M28.0 → Next: 660.6 Migration Planning |
| Related Stage | M28.0 Product Domain Architecture Evolution |
| Design Document | `docs/_review/660.5_M28.0_Hybrid_Model_C_Prisma_Schema_Implementation_Report.md` |
| Schema Direction | 已落库 schema.prisma：SupplierProduct/Media/ParameterValue + SupplierProductStatus + FileEntityType+SUPPLIER_PRODUCT + Offer.supplierProductId 双绑；Product NO ownership |

**Reason**: 工业检测行业存在供应商型号级能力表达需求——同一平台产品能力由多个供应商提供不同型号。659.1 审计选定 **Hybrid Product Model C（限定版）**；659.2 冻结业务模型；660 完成 **Domain Architecture Design**：`Platform Product`（Capability Node，全局权威）+ `Supplier Product`（**Route A：Independent Domain Entity**）→ `Offer`（Commercial Capability Layer，`Offer != Product`，**架构建议双绑 SupplierProduct + PlatformProduct**）→ `Supplier Organization`。**领域边界已冻结，660 直接进入架构设计；660.1 做 Schema 设计。**

**Constraint（659.2/660 冻结）**: 必须保持 Product Global Catalog 架构，长期禁止 Product.organizationId / Supplier Marketplace / Supplier Store / Order System / Payment System / ERP。`Supplier Product` 为独立领域实体（避免 `Product.organizationId`），存储机制/审批流/Offer 双绑细节交由 660.1 数据库架构设计，不触碰冻结红线、不落地迁移。
