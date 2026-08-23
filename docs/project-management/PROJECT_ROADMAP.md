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
