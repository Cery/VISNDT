# VISNDT Business Capability Map

## Platform Positioning

VISNDT 当前支持的是：

`工业检测能力发现平台 + 商业撮合平台 + AI 辅助知识平台`

定位：
- **Industrial Inspection Capability Discovery Platform**（工业检测能力发现）
- **Commercial Matching Platform**（商业撮合）
- **AI Assisted Knowledge Platform**（AI 辅助知识，M21.6+）
- **AI Data Infrastructure**（AI 数据基础设施，M21.3.5：pgvector + Embedding + ContentChunk 数据准备基础层）
- **Semantic Layer**（语义层，M21.4 CLOSED。M21.4.0：审计 CONDITIONAL PASS。M21.4.1：Vector Index Foundation。M21.4.2：Embedding Data Population——100% Coverage。M21.4.3：Semantic Module Foundation。M21.4.4：Semantic Search API Foundation + Query Contract Frozen。M21.4.5：Retrieval Enhancement——threshold + diagnostics + unified retrieve()。M21.4.6：Ranking Foundation——RankingService + RankingStrategy + Contract Frozen。M21.4.7：Unified Search Ranking Foundation——UnifiedSearchService + orchestration + contract。P0 3/3 + P1 4/4 GAPs 全部解决，M21.4 CLOSED）
- **Mobile Experience**（移动端体验，M21.5 CLOSED。534：Pre-Development Architecture Audit PASS——API/Auth Ready，Semantic Protected，BFF Deferred。535：Responsive Web Foundation COMPLETED——2 new + 18 modified files，三端适配（Mobile/Tablet/Desktop）。536：Progressive Web App Foundation COMPLETED——6 new + 1 modified files，PWA Manifest + Service Worker + Offline Fallback。537：Mobile Experience Optimization COMPLETED——12 modified files，Workspace Mobile UX + Product Experience + Form Experience + Touch Optimization + PWA UX Enhancement。apps/web build exit 0，零 API/Schema/Migration 变更。Next: M21.6 Admin Intelligence）
- **Admin Intelligence**（运营智能，M21.6 CLOSED。538：Pre-Development Architecture Audit PASS——Admin UI 19 pages（B+），Admin API 11 endpoints（ADMIN-only），Analytics 8 event types，Monitoring（Matching + System），Audit（full trail + filter + export），Embedding（coverage status），Semantic Boundary PROTECTED，13 data sources READY，8 Gaps（0 P0 / 3 P1 / 5 P2），Overall Readiness B+。539：Admin Operational Dashboard Enhancement COMPLETED——8 modified files，1 new API endpoint + 2 enhanced responses，Dashboard Enhancement：Platform KPIs + Business KPIs + Matching Intelligence + Real Trend + Business Funnel + Entity Comparison。540：Admin Business Analytics Enhancement COMPLETED——11 files，4 new API endpoints（GET /admin/analytics/business/{funnel,lifecycle,conversion,matching}，ADMIN-only），Business Analytics Page（4 tabs：Demand Funnel + RFQ Lifecycle + Business Conversion + Matching Analysis），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。541：Admin Monitoring Enhancement COMPLETED——9 files，1 new API endpoint（GET /admin/monitoring/overview，ADMIN-only），Monitoring Page（5 sections：System Health + Business Risk + Matching Health + Embedding Coverage + Analytics Pipeline），10 code-level thresholds（NORMAL/WARNING/CRITICAL），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。542：Admin Audit Intelligence Enhancement COMPLETED——9 files，1 new API endpoint（GET /admin/audit-intelligence/overview?days=7，ADMIN-only），Audit Intelligence Page（5 sections：Audit Overview + Audit Trend + Entity Distribution + Actor Activity + Risk Indicators），6 code-level risk indicators（DELETE/STATUS_CHANGE/Event Rate/Login Rate/Actor Activity/Actor Concentration），apps/admin + apps/api build exit 0，零 Schema/Migration 变更。543：Admin Intelligence Closure Audit COMPLETED——M21.6 CLOSED）
- **AI Capability Preparation Layer**（AI 能力准备层，M21.7 CLOSED。544：Pre-Development AI Agent Architecture Audit PASS——M21.6 CLOSED 确认，M21.7 Readiness = READY。545：AI Agent Gateway Foundation COMPLETED——7 files，3 API endpoints（GET /ai/status /ai/capabilities /ai/boundaries，JWT protected），AI Capability Boundary + AI Request Audit + Capability Guard + AICapability Registry，apps/api build exit 0，零 Schema/Migration 变更。546：AI Agent Runtime Foundation COMPLETED——7 new files + 2 modified，AgentRuntimeService（context validation + capability routing + audit integration）+ AgentExecutionContext（humanReviewRequired=true）+ AgentExecutionContract，apps/api build exit 0，零 Schema/Migration 变更。547：AI Tool Layer Foundation COMPLETED——5 new files + 2 modified，ToolRegistryService（6 planned tools across 5 categories：SEMANTIC/BUSINESS/ANALYTICS/CONTENT/UTILITY，all mutationAllowed=false），apps/api build exit 0，零 Schema/Migration 变更。548：AI Tool Registry And Semantic Adapter Foundation COMPLETED——5 new files + 1 modified + 2 updated，ToolAdapterInterface + AdapterRegistry + SemanticAdapterContract + AbstractSemanticAdapter + Category-based Adapter Mapping，apps/api build exit 0，零 Schema/Migration 变更。549：AI Assistant Foundation COMPLETED——8 new files + 2 modified，AssistantService（4 planned capabilities：ASSIST-001/002/003/004，all PLANNED + mutationAllowed=false + requiresHumanReview=true）+ AssistantCapabilityRegistry + Audit Integration，apps/api build exit 0，零 Schema/Migration 变更。550：AI RAG Foundation COMPLETED——7 new files + 2 modified，RAGService（pipeline：receive → validate → retrieve → format → audit）+ KnowledgeSourceRegistry（4 planned sources：KS-001/002/003/004）+ RetrievalContract + RAGContextContract，apps/api build exit 0，零 Schema/Migration 变更，No LLM/Embedding/Vector DB。551：AI Knowledge Context Foundation COMPLETED——6 new files + 2 modified，ContextService（context lifecycle：create → validate → complete + context registry + trace + audit + KnowledgeContext）+ AIContext Contract + KnowledgeContext Contract + ContextTrace + ContextAuditRecord，apps/api build exit 0，零 Schema/Migration 变更，No LLM/Embedding/Vector DB。M21.7 七层架构：AI Gateway → Agent Runtime → Assistant → RAG → Context → Tool Layer → Adapter → Semantic/Business APIs；无 LLM Execution；无 Autonomous AI Decision；无 Business Mutation；Human Review Boundary PROTECTED）

它当前不支持：

- Supplier 独立商城
- 公开价格展示
- 订单 / 支付 / 交易结算

## End-to-End Capability

当前真实主链是：

`产品展示 -> 公开询价 / Buyer 创建 Demand -> 系统 Matching -> Buyer 创建 RFQ -> Supplier 提交 Response -> Buyer 接受/拒绝 -> Notification 回流`

公开询价链路已打通：`产品详情 -> Inquiry 提交 -> 关联 Product/Organization -> 后台 Inquiry 管理 -> 组织成员通知回流`。

## Public User Can Do What

- 浏览首页、关于、商务合作、知识中心、解决方案
- 浏览产品分类、产品列表、产品详情
- 查看产品参数、媒体、文档
- 浏览知识中心内容（动态 Content API，仅 PUBLISHED）与内容详情（**Markdown 安全渲染，M18.1**）
- 浏览解决方案（动态 Content API，仅 PUBLISHED）与方案详情（**Markdown 安全渲染，M18.1**）
- 浏览文章中心（**/articles + /articles/[slug]，M20.2.4**）与行业洞察（**/insights + /insights/[slug]，M20.2.4**）
- 浏览内容标签（**/tags/[slug] 标签聚合页，M20.2.3**）与按标签筛选内容（**GET /content/public?tag=slug，M20.2.3**）
- 内容发现增强（**M20.2.5**：内容详情页标签芯片展示 + "更多"导航链接，连通 Content Detail → Tag Landing → Type List 发现路径）
- 内容分享元数据（**OpenGraph，知识/方案详情页，M18.3**）
- 内容结构化识别（**JSON-LD Article / TechArticle，M18.3**）与站点抓取（**/sitemap.xml，仅 PUBLISHED，M18.3**）
- 从内容页面进入商业转化路径（**M20.3.1**：知识/方案/文章/洞察详情页 + 商务/关于页商业 CTA，引导至产品目录 / 询价）
- 对产品发起公开询价（关联产品与组织，进入后台运营处理）
- 注册 / 登录

### Current Limitation

- `/knowledge`、`/solutions` 已动态化（M17.4），内容详情已升级为 Markdown 安全渲染（M18.1），内容媒体管理已实现（M18.2：Content→ContentMedia→FileAsset 链路 + 媒体画廊/附件展示 + 下载发布状态校验），内容 SEO 展示层已完成（M18.3：OpenGraph / JSON-LD / Sitemap / Canonical），内容标签体系已建立（M20.2.3：ContentTag + ContentTagRelation + /tags/[slug] 标签聚合页 + 按标签筛选内容），生产正式域名 SEO 参数（NEXT_PUBLIC_SITE_URL）待部署配置
- 公开询价链路已打通，但依赖产品存在可询价状态的 Offer（ACTIVE/SUBMITTED）

## Buyer Can Do What

- 登录进入 Buyer Dashboard / Workspace
- 创建、查看、编辑 Demand
- 发布 / 关闭 Demand
- 查看 Match 结果
- 从 Demand 创建 RFQ
- 查看 RFQ 详情
- 查看 Supplier Response，并做接受 / 拒绝决策
- 查看通知与基础设置

## Supplier Can Do What

- 登录进入 Supplier Dashboard / Workspace
- 查看定向 RFQ 列表
- 查看 RFQ 详情
- 提交 RFQ Response
- 跟踪已提交 Response 的状态
- 查看通知与基础设置

### Boundary Note

当前 Supplier 能力是“参与撮合响应”，不是“运营独立店铺”。

## Admin Can Do What

- 登录 Admin 后台
- 管理 User / Organization
- 管理 Product / Category / Parameter / Product Media
- 查看 Demand / Match / RFQ / RFQ Response / Offer
- 管理 Inquiry / Notification
- 管理 Content（内容列表/创建/编辑/生命周期操作，M17.3；**正文 Markdown 编辑+预览，类型/筛选支持 INSIGHT 参数百科，M18.1**）
- 管理 Content Tags（**标签 CRUD + 内容标签关联，M20.2.3**）
- 查看 Audit Log
- 执行 FileAsset Orphan Cleanup
- **使用运营驾驶舱（M20.4.1：recharts 趋势图/分布图/商业漏斗 + 分组菜单 + 面包屑 + 响应式三端适配）**
- **管理 16 个核心列表页面（M20.4.1：统一 Table 横向滚动 + 固定操作列 + 响应式）**
- 查看 Dashboard 统计与待处理事项
- **导出数据（M20.4.2：CSV 导出——Product/Content/User/Organization 列表，支持当前页+全量导出）**
- **批量操作（M20.4.2：BatchActionBar——统一批量删除/状态变更框架，支持 Product/User/Organization）**
- **高级筛选（M20.4.2：AdvancedFilterPanel——关键词/选择器/日期范围统一筛选组件）**
- **导入数据（M20.4.2：ImportButton——CSV 文件解析+前端预览，基础导入能力建立）**
- **角色权限控制（M20.4.3：PermissionGuard 权限守卫 + PermissionButton 权限按钮 + RoleCapabilityCard 角色能力卡片 + usePermission Hook + AdminRole 4 级角色（SUPER_ADMIN/ADMIN/OPERATOR/VIEWER）+ 17 个权限点）**
- **审计日志增强（M20.4.3：AdvancedFilterPanel + ExportButton + 操作者姓名+邮箱展示 + 实体类型下拉 + 操作者关键词搜索）**
- **组件体系收敛（M20.4.4：BatchOperations→BatchActionBar 全量迁移 9 页，operation/ 10 组件 + permission/ 3 组件，零重复实现）**
- **管理 AI 数据准备（M21.3.5：Embedding 管理页面——Content/Product Embedding 状态监控 + 批量生成触发 + Content Chunk 管理 + Provider 状态指示）**

## What The Platform Already Proves

- 公共展示能力已经存在
- Buyer 主链已经存在
- Supplier 响应主链已经存在
- Admin 运营底座已经存在
- Workflow / Notification / Audit 的治理基础已经存在
- Business Lifecycle Event Tracking 能力已完善（Demand/RFQ/Match/Response 全生命周期事件覆盖）

## What Is Still Missing

- 内容管理后台（M17.3 已落地基础：列表/编辑器/生命周期操作；M18.1 已升级 Markdown 编辑+预览）
- 文章 / 解决方案公开详情体系（M17.4 已接入动态 Content API 与详情页；441 已完成 Public API 安全审计；**M18.1 已升级 Markdown 安全渲染**）
- 内容富文本/排版增强（M18.1 已完成 Markdown 编辑 + Web 安全渲染）
- 参数解释与 Insight 内容体系（M18.1 已建立 INSIGHT 类型内容模型支持与示例内容，参数百科定位为关联内容、非独立入口；完整参数百科业务系统待后续）
- 内容媒体管理（**M18.2 已实现（446：Content→ContentMedia→FileAsset 链路 + Admin 媒体区块 + Web 画廊 + 下载发布状态校验）**）
- 面向运营成熟阶段的数据化 SEO 能力（**M18.3 已完成（447）：OpenGraph / JSON-LD / Sitemap / Canonical**；公开询价入口已稳定启用）
- 内容工作流运营增强（**M18.4 已完成架构规划（448）：Revision History / Scheduled Publish / Reviewer Record / Approval History 冻结设计，M18.4.1（449）已完成前置整改：WorkflowEvent 可靠性修复 + Content 生命周期 AuditLog 接入，M18.4.2（450）已完成 Revision History：ContentRevision 独立表 + 版本快照事务保存 + Admin 版本历史 UI，M18.4.3（451）已完成 Scheduled Publish：Content.scheduledPublishAt + ContentSchedulerService 轻量扫描 + 幂等/可追踪/失败恢复，M18.4.4（452）已完成 Approval Timeline：WorkflowEvent 审核时间线 + Admin 展示，M18.4 阶段闭环**）
 97→- 内容→商业转化路径（**M20.3.1（503）已完成**：Content 页面商业 CTA 已实现，6 页面 + 1 新组件 `ContentCommercialCTA`，三端 build exit 0，零 Schema/API/Search 变更；**M20.3.2（504）闭环审计通过**：PASS，M20.3 CLOSED/FROZEN，Content → Product → Inquiry 商业转化路径已建立）

## M16.0 Audit Conclusion

M16.0 审计确认：
- M15 WorkflowEvent 治理成果稳定，所有核心业务生命周期事件已覆盖
- 业务闭环完整（产品展示→需求→匹配→RFQ→响应→通知→运营管理）
- 数据库 Schema 稳定，无冗余模型
- 后端架构符合 Controller→Service→Domain Logic 分层
- 前端存在少量直接 API 调用的历史包袱，建议在 M16 清理

## M16.2 Frontend Architecture Note

M16.2 已统一前端数据访问模式为 `Page → Service → API Wrapper → Backend API`，页面层运行时无直接业务 API 调用。该调整属工程化质量治理，不改变任何业务能力与 API Contract。

## M16.3 SEO Foundation Note

M16.3 已建立公开站 SEO 元数据基础：站点级 metadataBase / Open Graph / Twitter Card / robots，首页与静态页标题规范化，产品详情页动态生成产品级元数据。该能力属页面展示层，不改变业务能力、不新增数据访问。

## M16.4 Content Management MVP Assessment

M16.4 已完成内容管理 MVP 架构评估（只读审计，无代码改动）。评估范围覆盖数据模型、后端 API、Admin 后台入口、Web 前台详情页与发布流。评估结论：**M16 阶段不实施内容管理系统**，内容域推迟至 M17 开发（符合"禁止提前实现后续阶段能力"原则）。M16.3 SEO 元数据基础与 M15 WorkflowEvent 将作为 M17 内容的直接复用基础。当前 `/knowledge`、`/solutions` 仍为静态展示页，无内容后台与详情体系。

## M16.5 Component API Layer Normalization Note

M16.5 已清理组件层运行时直接调用 `@/lib/api/*`（`InquiryForm`、`CategorySection`、`FeaturedProductsSection`），前端数据访问架构统一为 `Component → Service → API Wrapper → Backend API`，组件层无运行时直接业务 API 调用、无 `fetch`/`client` 直连。该调整属工程化质量治理，不改变任何业务能力、页面行为与 API Contract。

## M16 Closeout Conclusion

M16 关闭审计（435）通过。M16 稳定化目标全部达成：公开询价链路稳定、前端 API 分层统一、SEO 基础建立、内容管理边界明确（推迟 M17）、组件层 API 治理完成。业务闭环 `Product → Demand → Matching → RFQ → RFQ Response → Inquiry → Notification → Admin Operation` 可运行。**M16 CLOSED**，允许进入 M17 内容域立项（仅规划，不实施）。

## M17.0 Content Domain Architecture Planning

M17.0 完成内容域架构规划（436，只读设计）。定位为**工业检测行业知识内容平台**（非商城/广告/供应商店铺）。核心设计：
- **Content 实体**：统一单表 + `type` 判别（ARTICLE/KNOWLEDGE/SOLUTION/INSIGHT），含 title/slug/summary/content/status/publishedAt/author/SEO 内联字段
- **工作流**：DRAFT(CREATED)→REVIEW(SUBMITTED/REVIEWED)→PUBLISHED(OPENED)→ARCHIVED(CLOSED)，复用现有 WorkflowAction/WorkflowEvent
- **API**：Public GET `/content` 列表+详情；Admin POST/PATCH + submit/review/publish/archive
- **前端**：Web `/knowledge`、`/knowledge/[slug]`、`/solutions`、`/solutions/[slug]` + 动态 SEO（复用 M16.3）；Admin Content List/Editor/Publish

**M17.1 Content Model Design Review（437）评审通过（Conditional Approved）**：Content 实体、ContentType（ARTICLE/KNOWLEDGE/SOLUTION 启用，INSIGHT 延期）、ContentStatus 生命周期、API Contract 定稿冻结；WorkflowEntityType 新增 `CONTENT` 决策已记录，待 M17.2 实施审批。

**M17.2 Content Domain Foundation（438）完成**：内容域后端基础已实现：
- **WorkflowEntityType 扩展**：新增 `CONTENT`（仅此一项触碰 Workflow 枚举，WorkflowAction 未改）
- **Content Schema**：新增 ContentType/ContentStatus 枚举 + `Content` 模型（author→User、coverImage→FileAsset、slug unique、[type,status] 索引）
- **Migration**：`20260811154853_m17_2_content_domain` 创建并应用
- **Content Module**：`apps/api/src/content/`（module/controller/service + create/update/query DTO）
- **API**：新增 `/api/v1/content`（ADMIN 保护 + submit/review/publish/archive 生命周期）；Public API 未开放
- **前端**：Web `/knowledge`、`/solutions` 仍为静态展示页，对接动态内容待 M17.4；Admin 内容管理基础已落地（M17.3）

**M17.3 Content Admin Foundation（439）完成**：Admin 内容管理基础已实现：
- **Admin Menu/Route**：新增「内容管理」菜单与路由（`/content`、`/content/create`、`/content/:id`）
- **Service Layer**：`apps/admin/src/api/content.service.ts` 封装 getList/getById/getBySlug/create/update/submit/review/publish/archive
- **组件/页面**：`ContentForm` 共享表单 + `ContentList`/`ContentCreate`/`ContentEdit` 页面
- **生命周期操作**：DRAFT→submit（提交审核）、REVIEW→review（审核通过）、PUBLISHED→archive（归档），均带确认
- **架构约束**：`Page → Service → API Wrapper → Backend API`，无页面直接 `fetch`
- **Security**：仍受 JwtAuthGuard + RolesGuard + ADMIN 保护
- **冻结区域**：Schema / Migration / Auth / WorkflowAction / Notification / AuditLog / Content API Contract 均无变化；Admin build 通过

**M17.4 Content Public Web Integration（440）完成**：Web 公共内容接入已实现：
- **后端公开读接口（用户审批新增，增量非破坏）**：`GET /content/public`（仅 PUBLISHED，type 筛选 + 分页）、`GET /content/public/:slug`；不改既有 ADMIN 端点路径/参数/返回，不触碰 Schema/Migration
- **Service Layer**：`apps/web/src/services/content.service.ts`（getContentList / getContentBySlug）+ `lib/api/content.ts` + `types/content.ts`
- **Web 页面**：`/knowledge`、`/solutions` 列表页动态化；新增 `/knowledge/[slug]`、`/solutions/[slug]` 详情页
- **SEO Metadata**：详情页 `generateMetadata()` 复用 M16.3 `seo.ts`（seoTitle/seoDescription/title/summary）
- **架构约束**：`Page → Service → API Wrapper → Backend API`，无页面直接 `fetch`
- **冻结区域**：Schema / Migration / Auth / RBAC / Permission 均无变化；`apps/web` `tsc --noEmit` exit 0，`next build` 全阶段成功（exit -1 为机器 SWC DLL 环境问题）

**M17.4 Public Content API Security Audit（441）完成**：Public Content API 专项安全审计通过：
- **PUBLISHED 隔离** ✅：列表 `findAllPublic` 与详情 `findPublishedBySlug` 均在 DB 层强制 `status=PUBLISHED`，无先全量再过滤
- **slug 隔离** ✅：详情 `findFirst({ where: { slug, status: PUBLISHED } })`
- **响应边界（整改）** ✅：新增 `publicContentSelect` 公开投影，剔除 `status/archivedAt/authorId/author.email`（PII），仅暴露公开字段
- **分页（整改）** ✅：`pageSize` 补 `@Min(1)/@Max(100)` 运行时校验，MAX_PAGE_SIZE≤100
- **Rate Limit** ✅：公开端点继承全局 `ThrottlerGuard`（100 req/60s）
- **SEO 来源** ✅：`seoTitle/seoDescription/title/summary`，与 M16.3 一致
- **冻结区域**：Schema / Migration / Auth / RBAC / Permission / Workflow / Notification / AuditLog / 既有 Admin Content API 均无变化；`apps/api` tsc 编译通过（exit 0）

**M17.5 Content Domain Enhancement Planning（442，Architecture Planning Only，No Code Change）完成**：Content Domain 增强规划评审通过：
- **MVP 闭环确认** ✅：`Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata` 端到端闭环达成
- **编辑策略**：推荐 **Markdown Content + Preview Rendering**（Rich Text / Headless CMS 暂不采用）
- **媒体演进**：规划 `ContentMedia → FileAsset`（当前仅 `coverImageId` 单封面），支持多图/图文混排/案例图/报告附件（M18）
- **SEO 演进**：当前 `seoTitle/seoDescription/seoKeywords` 满足 MVP；规划 OpenGraph / Structured Data / Sitemap / Canonical（M18，不拆分 SeoMetadata 模型）
- **工作流演进**：当前 DRAFT→REVIEW→PUBLISHED→ARCHIVED 满足 MVP；规划版本/修订历史/定时发布/审核人/审核记录（M18，不新增 Role）
- **内容类型演进**：当前 ARTICLE/KNOWLEDGE/SOLUTION，预留 INSIGHT；规划 Case Study/Technical Guide/Industry Report/Product Application（M18）
- **架构约束保持**：复用 `WorkflowEntityType.CONTENT` 与既有 `WorkflowAction`，不新增 ContentWorkflowAction；不新建独立 CMS 子系统
- **冻结区域**：Schema / Migration / API / Auth / RBAC / Permission / Workflow / Notification / AuditLog / Admin / Web 均无修改；Build Not Required

**M18.0 Content Operation Capability Implementation Planning（443，Architecture Planning Only，No Code Change）完成**：M18 内容运营能力实施规划通过：
- **M17 复核** ✅：Content Model → Admin Management → Lifecycle Workflow → Public API → Web Rendering → SEO Metadata 闭环达成，MVP 状态 **Complete**
- **实施优先级**：P1 Markdown Content Rendering（M18.1）→ P2 Content Media Management（M18.2）→ P3 SEO Enhancement（M18.3）→ P4 Workflow Operation（M18.4）→ P5 Extended Content Types（M18.5）
- **M18.1**：Markdown 存储（复用 `Content.content`）+ Admin 预览 + Web 安全渲染 + XSS 防护 + 既有内容兼容
- **M18.2**：`Content → ContentMedia → FileAsset` 一对多（图片/附件/报告文件/排序/描述）
- **M18.3**：OpenGraph image / JSON-LD / Sitemap / Canonical（不拆分 SeoMetadata 模型）
- **M18.4**：Revision History / Scheduled Publish / Reviewer Record / Approval History（不新增 WorkflowAction）
- **M18.5**：规划 CASE_STUDY / TECHNICAL_GUIDE / INDUSTRY_REPORT / PRODUCT_APPLICATION（当前阶段不新增枚举）
- **架构约束保持**：统一 Content 模型（不拆分 Article/Knowledge/Solution）、不引入 Headless CMS / 独立 CMS / 新权限系统、SEO 延续 Content.seoTitle/seoDescription/seoKeywords、Workflow 延续 WorkflowEntityType.CONTENT
- **冻结区域**：Schema / Migration / API / Auth / RBAC / Permission / Workflow / Notification / AuditLog / Admin / Web 均无修改；Build Not Required

**M18.1 Markdown Content Enhancement Implementation（444，已完成）**：内容增强第一阶段落地：
- **Markdown 存储** ✅：复用 `Content.content`（TEXT），零数据迁移，Database State = No Change
- **Admin Markdown 编辑+预览** ✅：`MarkdownEditor.tsx`（编辑/预览 Segmented 切换，react-markdown + remark-gfm），正文由 TextArea 升级为 MarkdownEditor；类型/筛选支持 INSIGHT 参数百科
- **Web 安全渲染** ✅：`MarkdownRenderer.tsx`（服务端渲染 + skipHtml + 链接/图片协议白名单，拦截 javascript:），`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页纯文本升级为安全 Markdown，SEO 保留；启用 `@tailwindcss/typography` prose 插件
- **参数百科定位** ✅：`type=INSIGHT` 关联内容基础，非独立导航/入口，未实现独立模块；通过产品详情页参数字段弹窗/关联方式展示（规划）
- **示例内容** ✅：`seed_content.ts` 幂等种子，已入库 KNOWLEDGE 3 / SOLUTION 2 / INSIGHT 3（均 PUBLISHED）
- **DTO 最小扩展** ✅：Create/Update DTO `@IsIn` 允许 INSIGHT（DB enum 已含），不改端点/响应结构
- **Freeze/安全** ✅：Schema / Migration / Auth / RBAC / Permission / WorkflowAction / Notification / Audit / Content API 端点契约 无变化；无公开边界扩大
- **Build** ✅：API / Admin / Web 三端 build 通过（exit 0）

**M18.2 Content Media Architecture Planning（445，Architecture Planning Only，No Code Change）**：内容媒体架构设计评审，为 M18.2 Implementation 提供冻结基线：
- **推荐模型** ✅：`Content → ContentMedia → FileAsset` 中间表（复用 Product→ProductMedia→FileAsset 成熟链路，含原子上传-create 与删除级联 S3 清理）
- **候选字段** ✅：`id / contentId / fileAssetId / type(IMAGE|ATTACHMENT) / caption / sortOrder / createdAt / updatedAt`
- **API 策略** ✅：Public 详情 `GET /content/public/:slug` include `media`（方案 A，向后兼容，列表轻量，不新增公开端点）；Public 投影永不暴露 storageKey
- **Admin/Web 方向** ✅：Admin 内容编辑页媒体区块（多图/附件/排序/图注/封面/删除替换）；Web 详情页 Media Gallery + Attachments（附件经预签名 URL 下载）
- **Security** ✅：识别关键缺口——媒体下载端点需补「实体→发布状态」归属校验（仅 PUBLISHED 内容媒体可公开下载）；storageKey 保护保持
- **Freeze** ✅：Schema / Migration / Auth / Workflow / Notification / Audit / Content API / Role 无变化

**M18.3 SEO Enhancement Implementation（447，已完成）**：Content SEO 展示层能力落地，未新增 SEO 数据模型：
- **OpenGraph** ✅：`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页 `generateMetadata()` 输出 title/description/url/images（图片优先封面其次媒体首图）
- **JSON-LD** ✅：`buildContentJsonLd()` 输出 Article（Knowledge）/ TechArticle（Solution），仅含无敏感展示字段，无内部 ID / storageKey
- **Sitemap** ✅：新增 `apps/web/src/app/sitemap.ts`，`/sitemap.xml` 仅收录 PUBLISHED 内容 + 静态核心路由，内容拉取失败降级
- **Canonical** ✅：详情页 `alternates.canonical`（基于 `SITE_URL` 绝对 URL）
- **架构约束** ✅：保持 Content 单模型（复用 `seoTitle/seoDescription/seoKeywords/coverImage`），未新增 SeoMetadata 模型、未建 SEO Module、未改 Schema / Migration / Content Model、未建 CMS
- **Build** ✅：`apps/web` build 通过（exit 0）

**M18.4 Workflow Operation Enhancement Architecture Planning（448，Architecture Planning Only，No Code Change）**：Content 工作流运营增强架构规划完成，输出 Implementation 冻结设计：
- **Revision History** ✅：推荐 **方案 A — ContentRevision 独立历史表**（数据完整性/查询效率/审计能力/扩展性优于 AuditLog 承担或 Content JSON snapshot；避免污染 AuditLog 边界）
- **Scheduled Publish** ✅：Content 新增 `scheduledPublishAt DateTime?` + 轻量后台轮询；不新增 Schedule 模型、不引入 CMS Scheduler；复用 WorkflowEvent（OPENED + metadata 标记 scheduled）；不新增 WorkflowAction
- **Reviewer Record** ✅：复用 `WorkflowEvent.operatorId` + User，不新增 Reviewer 表
- **Approval History** ✅：WorkflowEvent（业务时间线）与 AuditLog（系统审计）分离不混用
- **整改项** ✅：修复 Content WorkflowEvent 组织约束被吞问题（可靠性）+ 补齐 Content 生命周期 AuditLog 系统审计
- **Freeze** ✅：未改 Schema / Migration / API / Admin / Web / WorkflowAction / Role / Permission / Notification / AuditLog；Build Not Required

**M18.4.1 Workflow Reliability Foundation Implementation（449，已完成）**：实施 448 前置整改：
- **WorkflowEvent 可靠性修复** ✅：`WorkflowEventsService.create()` 对 `WorkflowEntityType.CONTENT` 豁免 `organizationId` 校验（仅组织绑定实体强制）；`ContentService.emitEvent()` 移除 try/catch 静默吞错，WorkflowEvent 失败不再丢失（数据完整性 > 静默成功）
- **Content 生命周期 AuditLog 接入** ✅：`create`（CREATE）/ `update`（UPDATE，old/new 对比）/ `transition`（submit/review/publish/archive 均 STATUS_CHANGE，oldValue=from/newValue=to）；`content.controller.ts` `update` 补传 `@CurrentUser`
- **职责边界** ✅：WorkflowEvent（业务流程时间线）与 AuditLog（系统审计）分离不混用，AuditLog 未公开返回
- **Security / Freeze** ✅：无新公开 API / 权限 / Role / 数据泄露；未改 Schema / Migration / ContentRevision / Scheduler / WorkflowAction / Role / Permission / Notification / Web
- **Build** ✅：API / Admin build 通过（exit 0）；Web 无需修改

**M18.4.2 Content Revision Implementation（450，已完成）**：实施 ContentRevision 版本历史能力：
- **ContentRevision 独立版本历史表** ✅：`content_revision`（`Content` 1:N，`@@index([contentId, version])`，`onDelete: Cascade`），快照字段 `title/summary/content/seoTitle/seoDescription/seoKeywords/coverImageId/snapshot/createdBy/createdAt`；迁移 `20260812043433_m18_4_2_content_revision`
- **版本快照事务保存** ✅：`ContentService.create()` 事务内建 v1、`update()` 事务内建 v(n+1)（`max(version)+1`），Revision 写入失败回滚 Content（数据完整性 > 静默成功）；状态变更（transition）不建 revision
- **Admin Revision History** ✅：`GET /content/:id/revisions`、`GET /content/:id/revisions/:version`（均 ADMIN-only，`@Roles(Role.ADMIN)` + `@ApiBearerAuth()`，不公开）；Admin `ContentRevisionHistory.tsx` 版本历史 UI（版本/创建人/创建时间 + 查看快照，暂不实现 Restore/Diff）
- **职责边界** ✅：WorkflowEvent（流程时间线）/ AuditLog（系统审计）/ ContentRevision（历史内容快照）分离不混用；Revision 不公开
- **Security / Freeze** ✅：Revision 仅 Admin 可查，无新公开 API / 权限 / Role / 数据泄露；未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API
- **Build** ✅：API / Admin / Web build 通过（exit 0；Web 未触碰 `apps/web` 仅验证）

**M18.4.3 Content Scheduled Publish Implementation（451，已完成）**：实施 Content 定时发布能力：
- **Content.scheduledPublishAt** ✅：`Content` 模型新增可空 `scheduledPublishAt DateTime?`（`@map("scheduled_publish_at")`）+ `(status, scheduledPublishAt)` 复合索引；迁移 `20260812054723_m18_4_3_scheduled_publish`（migrate status up to date，24 迁移，`m18_4_2 → m18_4_3` 顺序正确）
- **ContentSchedulerService** ✅：`apps/api/src/content/content.scheduler.ts` 轻量 `setInterval` 分钟级扫描（60s，`onModuleInit` 启动 / `unref` 不阻塞退出 / `running` 防重入）；仅扫描 `status=REVIEW AND scheduledPublishAt <= now()`，复用 `ContentService.publish()`（不复制发布逻辑）；单条失败 catch 记录日志不阻塞其他任务、下轮自动重试、不修改 scheduledPublishAt
- **幂等与系统身份** ✅：`ContentService.transition()` 改为原子条件更新（`updateMany where {id, status: from}`，count=0 视为已变更）保证并发/重复扫描仅产生一次 OPENED + 一次 STATUS_CHANGE；`ensureSystemUser()` 幂等创建 `system@visndt.com` 系统身份（无组织关联）作为执行主体保证可追踪
- **生命周期约束** ✅：`UpdateContentDto` 新增可空 `scheduledPublishAt`（`@IsDateString`）；`ContentService.update()` 仅允许 REVIEW 状态设置/清除（DRAFT/PUBLISHED/ARCHIVED 禁止）；发布成功自动清除 scheduledPublishAt
- **WorkflowEvent / AuditLog 复用** ✅：自动发布产生 `action=OPENED`（metadata `{scheduled:true, scheduledAt}`）+ AuditLog STATUS_CHANGE（`oldValue:{status:REVIEW}`、`newValue:{status:PUBLISHED, scheduled:true}`）；不新增 WorkflowAction
- **Admin 定时发布配置** ✅：`apps/admin` 新增 `ContentScheduledPublish.tsx`（REVIEW 状态选时间/设置/清除 + 计划状态 Tag），集成 `ContentEdit.tsx`；`content.types.ts` 新增 `scheduledPublishAt`
- **Security / Freeze** ✅：Scheduler 无公开接口、不绕过审核、不新增 Role/Permission、不泄露 REVIEW/DRAFT 内容；未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API / ContentRevision；未新增 Schedule / SchedulerJob / ContentSchedule / PublishTask 模型
- **Build** ✅：API / Admin build 通过（exit 0）；Web 无需修改（公开内容仍按 `status=PUBLISHED`）

**M18.4.4 Content Approval Timeline Enhancement（452，已完成）**：基于 WorkflowEvent 实现 Content 审核历史查询，完成 M18.4 阶段闭环：
- **Backend 查询能力** ✅：`WorkflowEventsService.findContentTimeline(contentId)` 新增按 Content 的业务流程时间线查询（`where { entityType: CONTENT, entityId: contentId }`、`createdAt` 升序、投影 `id/action/operator(id,name)/metadata/createdAt`）；Reviewer 复用 `WorkflowEvent.operatorId + User`（无 Reviewer / ApprovalUser / ContentReviewer 模型）
- **Admin 接口** ✅：新增 `GET /content/:id/approval-timeline`（`@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`，不公开）；`ContentController` 注入 `WorkflowEventsService`
- **Admin Approval Timeline UI** ✅：`ContentApprovalTimeline.tsx`（antd Timeline 展示 Created→Submitted→Reviewed→Published→Archived，Action/Operator/Time/Status Transition）集成 `ContentEdit.tsx`「审核时间线」卡片；`content.service.ts` 新增 `getApprovalTimeline`，`content.types.ts` 新增 `ContentApprovalTimelineItem`/`ContentWorkflowAction`；仅展示不落地审批
- **职责边界** ✅：WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）分离不混用；Timeline 仅来自 WorkflowEvent，不读取 AuditLog / Revision
- **Security / Freeze** ✅：Timeline 接口 ADMIN-only、不公开，不返回 AuditLog / Revision 内容 / storageKey / 用户邮箱（operator 仅 id + name）；无 schema / migration 变化，未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API / ContentRevision / `apps/web`
- **Build** ✅：API / Admin build 通过（exit 0）；Web 未修改（Not Required）

**M18.5.1 Content Operation Stability Audit（453，已完成）**：基于 448-452 基线执行 Content Operation Capability 稳定性审计，M18.5 Stabilization Phase Started，无代码变更：
- **Database Stability** ✅：`Content`（status/publishedAt/archivedAt/scheduledPublishAt + `(status, scheduledPublishAt)` 索引）、`ContentRevision`（`@@index([contentId, version])` + Content 1:N cascade）、`WorkflowEvent`（`@@index([entityType, entityId])`）、`AuditLog` 一致；`pnpm prisma migrate status` → 24 migrations up to date
- **Workflow Boundary** ✅：WorkflowEvent（业务流程时间线，CREATED/SUBMITTED/REVIEWED/OPENED/CLOSED，metadata 仅 to/scheduled，不存 old/new/快照）/ AuditLog（系统审计，CREATE/UPDATE/STATUS_CHANGE 含 old/new）/ ContentRevision（版本快照，title/summary/content/SEO/coverImage，不含 workflow/audit）三层职责分离保持
- **Scheduler Reliability** ✅：`ContentSchedulerService` 分钟级扫描（仅 REVIEW + scheduledPublishAt<=now）+ `running` 防重入 + 复用 publish() + transition 原子条件更新幂等 + 单条失败隔离下轮重试 + `system@visndt.com` 可追踪身份
- **Admin Operation** ✅：`ContentEdit.tsx` 完整组合「内容信息/生命周期按钮/内容表单/媒体管理/定时发布/审核时间线/版本历史」；Revision/Schedule/Timeline 组件含错误处理/空状态/状态门控（仅 REVIEW 配置定时发布）
- **API Contract** ✅：CRUD + submit/review/publish/archive + approval-timeline（ADMIN-only）+ Revision + public 读（仅 PUBLISHED）契约稳定
- **Build / Freeze** ✅：API/Admin/Web 均 exit 0（警告为既有非阻断告警）；Code Change None，未新增功能/Schema/Migration/WorkflowAction/Role/Permission/NotificationType/Public API/`apps/web`

**M18.5.2 Content Operation Type & Bundle Optimization（454，已完成）**：治理 453 审计中的非业务风险项（类型导入规范 + Admin Bundle 结构），Content Operation Stability Optimization Completed。**Type Import**——453 所列 5 处组件层类型引用已随类型重命名全部使用 `import type`，全局 `apps/admin/src` 无 value-style 类型导入残留，无需改动；**Bundle**——`ContentEdit.tsx` 将 ContentMediaManager / ContentRevisionHistory / ContentScheduledPublish / ContentApprovalTimeline 改为 `React.lazy` + `Suspense` 按需加载，`components/content/index.ts` 移除 4 个被 lazy 化组件静态重导出（仅保留 ContentForm）；**Bundle Size**——主 chunk 1854.61→1844.77 kB（gzip 562.89→559.82 kB）+ 4 个独立 lazy chunk（ContentApprovalTimeline 1.45 / ContentScheduledPublish 1.54 / ContentRevisionHistory 3.66 / ContentMediaManager 4.41 kB）；**功能完整性**——ContentEdit 七区块能力不减少；**Freeze**——无 schema/migration/API/后端业务逻辑变化，未改 WorkflowAction/Role/Permission/Notification/Public Content API/`apps/web`；**Build**——API/Admin/Web 均 exit 0。

**M18.5.3 Content SEO Operation Enhancement（455，已完成）**：增强 Admin Content SEO 管理能力，Content Management Capability SEO Operation Enhanced（Content Operation Stabilization 推进）。**Admin SEO Operation Panel**——`ContentEdit.tsx` 新增「SEO 运营面板」（`ContentSeoPanel`，React.lazy 按需加载，独立 chunk 3.71 kB）：展示 SEO Title / SEO Description / SEO Keywords / Slug / Cover Image（封面图经 `fileAssetService.getSignedUrl` 渲染），与 Content Form 数据一致，复用现有 update API，不新增保存接口；**SEO Validation（非阻断）**——SEO 标题建议 30-60 字符、SEO 描述建议 120-160 字符，状态 Tag（符合建议/过短/过长/未设置）+ Alert 非阻断提示，关键词可选不强制；**SEO Preview**——新增 `ContentSeoPreview` Mock 搜索结果预览（Title / URL / Description，URL 按类型映射前台 KNOWLEDGE/SOLUTION 路由），仅展示不生成 SEO；**Web SEO 验证**——`apps/web` 知识/解决方案详情页 `generateMetadata` 已正确输出 title/description/keywords/canonical/OpenGraph/JSON-LD（Article/TechArticle）+ 封面/媒体首图回退 + Twitter Card 继承根布局，无缺失无需修复；**边界保持**——SEO 信息仍属 Content（seoTitle/seoDescription/seoKeywords），未新增 SeoConfig/SeoKeyword/SeoHistory/SeoAnalytics 表、未新增 SEO Module/Service，SEO 编辑复用 Content UPDATE AuditLog，WorkflowEvent/AuditLog/ContentRevision 职责不变；**Freeze**——无 schema/migration/API/后端业务逻辑变化，未改 WorkflowAction/Role/Permission/Notification/Public Content API；**Build**——API/Admin/Web 均 exit 0。

**M18.5.4 Content Operation Final Audit（456，已完成）**：基于 448-455 基线执行 Content Operation 最终稳定性审计，**M18.5 Content Operation Stabilization Closed（阶段关闭）**，Content Management Capability Stable。Content Domain 架构完整性、WorkflowEvent/AuditLog/ContentRevision 三层职责边界、Scheduled Publish 自动发布可靠性（REVIEW only + lte now + running 锁 + 原子 transition + 失败隔离重试 + system 身份）、Admin ContentEdit 七区块能力（内容信息/生命周期/媒体/版本历史/定时发布/审核时间线/SEO 面板）、API/Database/Permission/Public Content API 稳定性全 PASS；`pnpm prisma migrate status` 24 migrations up to date；所有 Admin 接口 `@Roles(ADMIN)`+`@ApiBearerAuth()`、Public 接口 DB 层强制 PUBLISHED + `publicContentSelect` 显式投影排除敏感字段 + ThrottlerGuard；三端 build 均 exit 0；No High/Medium Risk、Low 建议（Admin 主 chunk >500k 为既有项，可后续 manualChunks）；无代码变更，Code State = Documentation State。

## M19 Product Center Capability Model（457-460 架构冻结）

M19 产品体验架构演进（架构冻结，零 Schema 变更，前端消费后端已有能力）。产品中心能力模型按「已完成后端能力 / 待实施前端体验升级」区分：

```
Product Data Foundation
        ↓
Search Capability
        ↓
Supplier Capability Display
        ↓
Demand Matching
        ↓
Future AI Discovery
```

- **Product Data Foundation（后端 ✅ 已完成）**：Product 标准目录（Global Catalog）+ Category 分类树 + ParameterGroup/Definition/Value + ProductMedia；不引入 `Product.organizationId` / `ProductFamily` / `ProductModel` / `SupplierOffering`。
- **Search Capability（后端 ✅ / 前端 ✅ M19.1.1）**：后端 `GET /products` 关键字 + 参数动态筛选（ParameterDefinition 驱动）能力已存在；前端动态参数筛选交互已由 **M19.1.1（462）** 接入 Web（`ParameterFilterPanel` NUMBER/ENUM/STRING/BOOLEAN + `lib/api/products.ts` 透传 parameterFilters + 页面 state/query 同步）；M19.3 搜索体验升级待后续。
- **Product Center V2 体验稳定化（前端 ✅ M19.1.4）**：产品列表/详情/供应商/询价全链路体验已由 **M19.1.4（465）** 稳定化——列表结果计数 + 空状态区分筛选/无数据 + 参数筛选清除计数（N）、详情页锚点（#media/#overview/#specifications/#documents）+ 参数/文档空状态、询价错误状态「重新填写」、`EmptyState` 组件图标化升级。
- **Supplier Capability Display（后端 ✅ / 前端 ✅ M19.1.2-3 / ✅ M19.2.1）**：供应商能力通过 Offer 挂载，`GET /products/:id` offers 提供制造商/供应商信息；前端供应商能力展示已由 **M19.1.2（463）** 实现基础版本（`SupplierCapabilityList` 展示 Offer.organization 供应商列表）+ **M19.1.3（464）** 展示增强（organization.type 标签、空状态引导图标、已选择指示器、ManufacturerInfo 接入 offers.organization）；**M19.2.0（466）架构审计已通过**：Zero Schema Change 可行，现有 API 可复用；**M19.2.1（467）已完成**：Public Supplier Page（`/suppliers/[id]`，SupplierPublicProfile + SupplierOfferList + SEO Metadata），Backend 适配（SearchParamsDto 新增 organizationId + OffersService 支持 organizationId 过滤 + OrganizationsService 扩展字段），Schema/Migration 均 None；M19.2.2 Product Detail Supplier Section Enhancement（468 已完成）：Product Detail → Supplier Public Profile 导航链路已建立（ManufacturerInfo + SupplierCapabilityList 供应商主页链接），Schema/Migration/API 均 None；**M19.2.3 Workspace Supplier Display Management（471 已完成）：Dashboard Domain Navigation 新增「展示管理」入口 + `/workspace/supplier/display` 5 模块（Display Overview / Company Identity / "Products Supplier Can Provide" / Offer Management / Public Preview），复用 SupplierPublicProfile + SupplierOfferList + Workspace 布局组件，`apps/web` build exit 0，Schema/Migration/API 均 None；**M19.2.4 Closure Audit（472 已完成）**：M19.2 闭环审计通过——Architecture Freeze 保持、Data Flow 完整、Frontend 8 项能力就绪、边界清晰、Schema/Migration 均 None；**M19.2 CLOSED**。Supplier Display 三端能力已建立：Public Supplier Page + Product Detail Supplier Navigation + Workspace Display Management。
- **Inquiry Flow（后端 ✅ / 前端 ✅ M19.1.2-3）**：询价链路后端已打通；前端已由 **M19.1.2（463）** 改为用户明确选择供应商后才展示 InquiryForm；**M19.1.3（464）** 完善交互——选中横幅"询价对象：XXX"+"切换供应商"按钮 + InquiryForm 新增 organizationName prop（"向 XXX 询价 YYY"）。
- **Demand Matching（后端 ✅ 已完成）**：Demand → Matching → RFQ → Response 撮合主链已闭环；产品中心与需求撮合衔接保持。
- **Search Experience（后端 ✅ / 前端 ✅ M19.3.1 / ✅ M19.3.2 / ✅ M19.3.2.1 / ✅ M19.3.3 CLOSED）**：搜索体系定位为 **Industrial Inspection Capability Discovery（工业检测能力发现）**，不等于电商搜索；四类搜索边界——Product Search（设备发现，GET /products keyword+category+parameterFilters）、Supplier Capability Search（能力发现，GET /organizations/:id + GET /offers?organizationId=）、Knowledge Search（内容资产，未来规划）、Matching Search（需求匹配，RFQ Domain）；**M19.3.0（473）架构审计通过**——四层搜索 IA 冻结（Product Discovery / Supplier Capability Discovery / Knowledge Discovery / Matching Discovery）、Database Query First（当前不需搜索引擎）、零 Schema/API 变更；**M19.3.1（474）Product Search UX 增强已完成**——URL 同步（useSearchParams+useRouter）、关键词高亮（HighlightText 前端 only）、Active Filter Chips + 清除全部、SearchBar 清除 (X) 按钮、Supplier Discovery 入口（ProductCard 预留）、`apps/web` build exit 0、Schema/Migration/API 均 None；**M19.3.2（475）Search Result UX 增强已完成**——Loading Skeleton + Empty State 场景化（关键词上下文/调整建议）+ Result Count 上下文（页码/筛选标记）+ Pagination 页码指示器（`currentPage / totalPages`）+ ProductCard 供应商链接（`/products/${id}#suppliers`，Product-driven Capability Discovery），`apps/web` build exit 0、Schema/Migration/API 均 None；**M19.3.2.1（476）Supplier Discovery Boundary Correction 已完成**——删除公开供应商目录（`/suppliers` 列表页 + 产品页入口），恢复 Product-driven Capability Discovery（Supplier = Capability Provider），`apps/web` build exit 0、Schema/Migration/API 均 None；**M19.3.3 CLOSED**。

- **Admin Platform Governance（后端 ✅ / 前端 ✅ / M19.4.0 Architecture Audit ✅ / M19.4.1 Design Freeze ✅ / M19.4.2 Development ✅ / M19.4.3 Product Model Audit ✅ / M19.4.4 Closure Audit ✅ / M19.4 CLOSED）**：Admin = **Platform Governance Center**（数据治理 + 内容治理 + 产品治理 + 供应商治理 + 运营审计），非 Supplier Store Management / Transaction Management。Admin 前端 18 类管理能力——Dashboard、Product CRUD + Media、Category CRUD、ParameterGroup/ParameterDefinition CRUD、User CRUD、Organization CRUD、Demand List/Detail/Edit、Matching Monitor + Match Detail、RFQ CRUD、RFQ Response Detail、Offer List/Detail、Inquiry List/Detail、Notification List/Detail、FileAsset Orphan Cleanup、AuditLog List、Content CRUD（含 Markdown 编辑 + Media + Revision History + Scheduled Publish + SEO + Approval Timeline）。后端全 CRUD API + 生命周期操作 + RBAC（@Roles(ADMIN) + RolesGuard）+ AuditLog + WorkflowEvent。**M19.4.4（482）Phase Closure Audit**——M19.4 CLOSED，M19 COMPLETED。Final Architecture: Product = Global Catalog, Supplier = Capability Provider, Offer = Capability Mapping, Parameter = Industrial Search Foundation, Search = Database Query First, Matching = Weighted Scoring。Future Candidates (Frozen): ProductStatus enum, WorkflowEntityType.PRODUCT, Product @@unique([name, model]), ParameterTemplate, Semantic Alias, Vector embedding (M20+), Knowledge Graph (M20+), AI Matching (M21+), Supplier Product Model (M20)。禁止：Supplier Store / Marketplace / Transaction / ERP / Inventory / Order / Payment / SKU。

- **Future AI Discovery（⏳ M20 规划）**：AI Readiness 底座（Embedding / Vector / RAG）为 M20 规划，当前不实施。

## M20 Architecture Planning Status（483，M20.0.0 Pre-Audit）

> M20.0.0 前置架构审核已完成（483，Audit Only，No Code Change）。M20 定位：**Frontend Platformization（前端平台化与体验升级）**，非业务模型扩张。

### M20 Direction Freeze

- **P1 — Frontend Platformization**：提升平台使用体验（`apps/web` 33 pages + `apps/admin` 50 pages 体验升级），不引入新业务模型。Zero Schema/API change；Backend Capability First。
- **P2 — Content Asset Planning**：构建 Product-Content 关联、Content Discovery、Scenario Framework。Planning phase；API additions require separate audit。
- **P3 — AI Readiness Planning**：数据质量评估、标签体系设计、文本资产规范。Planning/Audit phase only；No Vector DB / Embedding / AI Agent / AI Infrastructure。

### M20 Scope Freeze

**Allowed**: Frontend Experience Upgrade, Platformization (UX/UI/Workflow), Content Integration Planning, Data Quality Assessment, Label System Design, Text Asset Guidelines.

**Forbidden**: Marketplace, Supplier Store, Transaction, ERP, AI Infrastructure (Vector DB, Embedding, Agent), Schema Change (without dedicated audit), New Business Model.

### M20 Architecture Constraints

Product = Global Catalog, Supplier = Capability Provider, Offer = Capability Mapping, Search = Database Query First, Admin = Platform Governance — all maintained.

### Future Candidate Registry（Frozen）

ProductStatus enum, WorkflowEntityType.PRODUCT, Product @@unique([name, model]), ParameterTemplate, Semantic Alias, Vector embedding, Knowledge Graph, AI Matching, Supplier Product Model — all frozen；M20 evaluates only (no implementation).

**M20 Status**: `IN PROGRESS` — M20.0.0 前置审核完成，M20.1 Search Experience Phase 闭环，M20.2 Content Asset Integration 阶段闭环，M20.3 Commercial Conversion 阶段闭环，M20.4.0 Admin Platform Professionalization Architecture Audit（505）通过，M20.4.0.1 Admin Operation Center Experience Architecture Audit（506）通过——PASS，AUTHORIZED，Operation Center 体验架构评估完成，Desktop 75%/Tablet 10%/Mobile 5%，零 Schema/API 变更。Next Step: M20.4.1 Admin Operation Center Foundation Development（507）。

### M20.3 Commercial Conversion Architecture Audit（502，Completed）& M20.3.1 Development（503，Completed）& M20.3.2 Closure Audit（504，Completed）

> M20.3 商业转化架构审计（502，Architecture Audit Only，No Code Change）。M20.3 定位：商业转化架构定义，非业务模型扩张。

**Audit Result**: `PASS` — M20.3 AUTHORIZED（Frontend-only CTA，零 Schema/API 变更）。

**Commercial Conversion Funnel Assessment**:

```
Current Funnel: PARTIAL

SEO Traffic → Content Pages → [DEAD END] ← 无商业转化路径
SEO Traffic → Product Pages → Inquiry → Demand → RFQ → Offer ← 完整

Gap: Content → Product / Content → Inquiry
```

**Architecture Decisions**:

| Capability | Current | Decision |
|------------|---------|----------|
| Content → Product | Missing | AUTHORIZED（Frontend CTA） |
| Content → Inquiry | Missing | AUTHORIZED（复用 InquiryForm） |
| Content → RFQ | Missing | DEFERRED（M20.4+） |
| Content → Supplier | Missing | DEFERRED（M20.4+） |
| Content Recommendation | Missing | DEFERRED（M21+） |
| ContentProductRelation | Not exist | REJECTED（Schema 冻结） |
| ContentInquiryRelation | Not exist | REJECTED（不必要） |

**M20.3.1 Development Scope**（6 pages，Frontend-only，No Schema/API/Search change）:

| Page | CTA Type |
|------|----------|
| `/knowledge/[slug]` | "Explore Products" CTA |
| `/solutions/[slug]` | "Inquiry CTA" section |
| `/articles/[slug]` | "Explore Products" CTA |
| `/insights/[slug]` | "Inquiry CTA" section |
| `/business` | "Contact Us" CTA |
| `/about` | "Explore Platform" CTA |

**Phase Status**:
```
M20.0  Architecture Planning        -- CLOSED
M20.1  Search Experience            -- CLOSED (FROZEN)
M20.2  Content Asset Integration    -- CLOSED (FROZEN)
M20.3  Commercial Conversion        -- CLOSED (FROZEN)
M20.4  Admin Professionalization     -- CLOSED (507-510 完成)
M20.5  ContentProductRelation        -- FUTURE (pending)
M21    AI Enhancement                -- IN_PROGRESS (M21.0+M21.1+M21.1c 审计通过，M21.2 AUTHORIZED)
M21.0  Platform Next Phase Arch Audit -- COMPLETED (511 审计通过，PASS)
M21.1  AI Readiness Foundation        -- COMPLETED (512 审计通过，PASS)
M21.1c M21 Roadmap Recalibration      -- COMPLETED (512.1 审计通过，PASS)
M21.2  Web Platform Experience Evolution  -- CLOSED (513-519 全部完成：Runtime Hardening + SEO Foundation + Content CTA + Inquiry Optimization + Conversion Tracking，M21.2 CLOSED)
M21.3  Data Intelligence Infrastructure  -- CLOSED (520-525 全部完成：Data Governance + Event Persistence + BI Foundation + Data-Driven Optimization + AI Data Preparation)
M21.4  Semantic Intelligence Layer Preparation -- CLOSED (526.1 路线重校准完成；526 审计 CONDITIONAL PASS；527 Vector Index Foundation；528 Embedding Data Population；529 Semantic Module Foundation；530 Semantic Search API；531 Retrieval Enhancement；532 Ranking Foundation；533 Unified Search；M21.4 CLOSED——3/3 P0 + 4/4 P1 GAPs 全部解决)
M21.5  Mobile Experience              -- CLOSED (534 架构审计；535 Responsive Web；536 PWA；537 Mobile UX Optimization；M21.5 CLOSED)
M21.6  Admin Intelligence             -- CLOSED (538 Pre-Dev Audit；539 Dashboard；540 Business Analytics；541 Monitoring；542 Audit Intelligence；543 Closure Audit；M21.6 CLOSED)
M21.7  AI Agent Integration          -- CLOSED (544 Architecture Audit PASS；545 Gateway；546 Runtime；547 Tool Layer；548 Adapter；549 Assistant；550 RAG；551 Context；M21.7 CLOSED——7 层架构完整闭环)
M21.8  Platform Readiness              -- CLOSED (553 Architecture Audit PASS + 554 Frontend Experience Upgrade COMPLETED + 555 Admin Experience Upgrade COMPLETED + 556 Demo Dataset COMPLETED + 557 Full Business Flow Validation COMPLETED + 558 Platform Closure Stabilization COMPLETED——P1-01 修复，P0=0 / P1=0 / P2=2 deferred，Readiness Score A-，M21.8 CLOSED)。Next: M22.1 Supplier Experience
M22.1  Supplier Experience              -- IN_PROGRESS (559 Architecture Audit COMPLETED——9 模型复用 + 20+ API endpoints + 7 前端 routes，三边界 PASS，M22.1 Readiness = READY；560 Workspace Enhancement COMPLETED——5 文件修改，RFQ Detail + Response List + Dashboard + Navigation + API Client，三边界全 PASS，零 Schema/Migration/API Endpoint 变更)。Next: M22.1.2 Supplier Offer Management
```

### M20.4.0 Admin Platform Professionalization Architecture Audit（505，Completed）

> M20.4.0 Admin 专业化架构审计（505，Architecture Audit Only）。Admin 从 Development Management Panel 升级为 Professional Operation Center。

**Audit Result**: `PASS` — M20.4 AUTHORIZED，零 Schema/API 变更，Admin frontend-only。

**Capability Ratings**:
- Content Management: 90% (EXCELLENT)
- Product Management: 75% (GOOD)
- User Management: 70% (GOOD)
- Dashboard: 60% (BASIC)
- Commercial Operations: 60% (ADEQUATE)
- Import/Export: 0% (NONE) — Critical Gap
- Permission: 30% (BASIC) — No RBAC

**P0 Priority**: Dashboard charts + Product Import/Export

### M20.4.0.1 Admin Operation Center Experience Architecture Audit（506，Completed）

> M20.4.0.1 Admin Operation Center 体验架构审计（506，Architecture Audit Only）。Admin 从 Development Panel 升级为 Operation Center 的体验评估。

**Audit Result**: `PASS` — AUTHORIZED，零 Schema/API 变更，Admin frontend-only。

**Responsive Ratings**:
- Desktop (1440px): 75% (GOOD)
- Tablet (768px): 10% (NOT SUPPORTED)
- Mobile (375px): 5% (NOT SUPPORTED)

**Key UX Gaps**:
- P0: No Breadcrumb, No Multi-tab, No User Info in Header, No Charts, No Fixed Columns, No Horizontal Scroll
- P1: No Mobile Layout, No Card List View, No Funnel View, No Export
- P2: No Column Config, No Global Search, No Real-time Updates

**Revised M20.4 Structure**:
- M20.4.1 Admin Operation Center Foundation (Layout + Dashboard + Table)
- M20.4.2 Admin Operation Center Enhancement (Import/Export + Funnel + Column Config)
- M20.4.3 Admin Responsive & Mobile (Tablet/Mobile Layout + Card List)

### M20.1.1 Product Discovery Enhancement Development（486，Phase 1/P0 Completed）

M20.1.1 Phase 1 (P0) 前端开发完成（Zero Backend/Schema/API Change）：
- **Product Detail Tabs**: 4-tab navigation (Overview/Specifications/Suppliers/Documents) + URL hash sync
- **Product Detail Nav**: Sticky sidebar (desktop, scroll-spy, mobile hidden)
- **Product Info Enhancement**: Status badge (color-coded), last updated date, description expand/collapse
- **CompareBar**: Floating bottom bar, max 4 products, compare link
- **ComparePage**: `/products/compare?ids=`, parameter matrix with difference highlighting + best-value detection

Build: apps/web exit 0. Route `/products/compare` — 4.06 kB. 6 new files + 4 modified files. Phase 2 (P1) and Phase 3 (P2) remain planned.

**业务定位保持**：`工业检测设备信息平台 + 撮合平台`（信息展示 + 需求发布 + 平台撮合 + RFQ 响应协作），非 Supplier 独立商城 / 公开价格 / 交易结算。

## Lifecycle Event Coverage

WorkflowEvent 已覆盖以下业务生命周期：

| 实体 | 事件 | 状态 |
|------|------|------|
| Demand | CREATED, OPENED, CLOSED | ✅ 完整 |
| RFQ | CREATED, OPENED, RESPONDED, CLOSED, WITHDRAWN | ✅ 完整 |
| Match | CREATED, REVIEWED, ACCEPTED, REJECTED, SUBMITTED, RESPONDED | ✅ 完整 |
| RFQ Response | CREATED, REVIEWED, ACCEPTED, REJECTED | ✅ 完整 |
| Offer | SUBMITTED, ACCEPTED, REJECTED, WITHDRAWN | ✅ 状态变更事件完整 |
| Content | CREATED, SUBMITTED, REVIEWED, OPENED, CLOSED | ✅ 完整（M18.4.1 修复可靠性：事件不再因组织约束被吞） |

## Data Governance Capability（M21.3.1，521 Completed）

> M21.3.1 Data Asset Governance Audit — Audit Only，零 Schema/API/Code 变更。

### Data Asset Inventory

| Domain | Model Count | Field Count | Enum Count | Quality Rating |
|--------|------------|-------------|------------|---------------|
| Content | 5 | 42 | 4 | **A-** |
| Product | 8 | 50 | 1 | **B+** |
| Buyer (Demand/RFQ) | 5 | 53 | 4 | **B+** |
| System (Workflow/Audit) | 4 | 31 | 7 | **B+** |
| Offer | 1 | 11 | 1 | **B** |
| Inquiry | 1 | 9 | 1 | **B** |
| Identity & Organization | 5 | 33 | 2 | **B-** |
| **TOTAL** | **29** | **229** | **20** | **B** |

### Governance Gap Priority

| Priority | Count | Key Items |
|----------|-------|-----------|
| **P0** | 3 | ConversionEvent 持久化、Product.status Enum 化、Organization 字段扩展 |
| **P1** | 6 | Product SEO 字段、AuditLog 类型统一、Demand MATCHED 状态、Inquiry 回复追踪、ContentTag Index、Organization.type Enum |
| **P2** | 4 | Embedding 存储、Vector Index、Content language、Product 参数标准化 |

### Data Maturity

```
Overall Data Maturity: B

Strengths:
  - 29 Model + 20 Enum + 229 字段 + 75 Index + 12 Unique
  - Content 域 A-（SEO + Version + Tag + Audit 全覆盖）
  - 三层事件体系（L1 Conversion + L2 Workflow + L3 Audit）
  - 完整商业闭环数据链路（Content → Product → Offer → Inquiry + Demand → RFQ）

Weaknesses:
  - Organization 仅 5 字段（供应商画像不足）
  - Product.status 为 String（非 Enum）
  - AuditLog 与 WorkflowEvent 类型不一致（String vs Enum）
```

## Analytics Event Persistence Capability（M21.3.2，522 Development Completed）

> M21.3.2 Analytics Event Persistence Foundation — 全栈实现（Database + Backend + Frontend）。

### Architecture

```
Frontend (Browser)                    Backend (NestJS)                Database (PostgreSQL)
┌─────────────────────┐    POST      ┌──────────────────┐   INSERT   ┌──────────────────┐
│  ApiTrackingAdapter  │ ──────────→ │ AnalyticsModule  │ ────────→ │ conversion_event │
│  (Batch + Beacon)    │  /api/      │ POST /events     │           │ (7 Indexes)      │
│  PageViewTracker     │  analytics/ │ Batch Write      │           │                  │
│  trackEvent()        │  events     │ (accept/reject)  │           │                  │
└─────────────────────┘             └──────────────────┘           └──────────────────┘
```

### Database Layer

| Component | Details |
|-----------|---------|
| **Enum** | `ConversionEventType` — 8 values: PAGE_VIEW, PRODUCT_VIEW, CONTENT_VIEW, SEARCH, PRODUCT_FILTER, CTA_CLICK, INQUIRY_START, INQUIRY_SUBMIT |
| **Model** | `ConversionEvent` — 9 fields: id, event, userId(opt), organizationId(opt), sessionId(opt), entityType(opt), entityId(opt), source(opt), metadata(JsonB), createdAt |
| **Migration** | `009_analytics_event` — 1 Enum + 1 Table + 7 Indexes |
| **Indexes** | event, userId, organizationId, sessionId, (entityType, entityId), createdAt, (event, createdAt) |

### Backend Layer

| Component | Details |
|-----------|---------|
| **Module** | `AnalyticsModule` — Controller + Service |
| **API** | `POST /api/analytics/events` — Batch Write Only |
| **Auth** | Anonymous allowed (userId/orgId optional) |
| **Response** | `{ accepted: N, rejected: N }` — 静默丢弃失败事件 |

### Frontend Layer

| Component | Details |
|-----------|---------|
| **Adapter** | `ApiTrackingAdapter` — 生产环境批量上报（maxBatchSize=20, flushInterval=3s, sendBeacon/fetch fallback） |
| **Global Tracker** | `PageViewTracker` — 路由变化时触发 page_view 事件 |
| **Event Integration** | 4 新事件类型：page_view（全局路由）、content_view（4 详情页）、search（搜索页）、product_filter（产品列表页） |
| **Existing Events** | product_view、cta_click、inquiry_start、inquiry_submit（来自 M21.2.3.3，519） |

### Responsibility Boundary

```
ConversionEvent = User Behavior Analytics (本 Phase)
  ≠ WorkflowEvent (Business Workflow Events)
  ≠ AuditLog (System Audit Trail)
  ≠ Notification (User Notifications)
```

AI Capability Domain

Current:

Data Intelligence
    ↓
Semantic Layer
    ↓
AI Discovery Capability
