# VISNDT Business Capability Map

## Platform Positioning

VISNDT 当前支持的是：

`工业检测设备信息展示 + 需求发布 + 平台撮合 + RFQ 响应协作`

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
- 内容分享元数据（**OpenGraph，知识/方案详情页，M18.3**）
- 内容结构化识别（**JSON-LD Article / TechArticle，M18.3**）与站点抓取（**/sitemap.xml，仅 PUBLISHED，M18.3**）
- 对产品发起公开询价（关联产品与组织，进入后台运营处理）
- 注册 / 登录

### Current Limitation

- `/knowledge`、`/solutions` 已动态化（M17.4），内容详情已升级为 Markdown 安全渲染（M18.1），内容媒体管理已实现（M18.2：Content→ContentMedia→FileAsset 链路 + 媒体画廊/附件展示 + 下载发布状态校验），内容 SEO 展示层已完成（M18.3：OpenGraph / JSON-LD / Sitemap / Canonical），但仍无搜索、无标签，生产正式域名 SEO 参数（NEXT_PUBLIC_SITE_URL）待部署配置
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
- 查看 Audit Log
- 执行 FileAsset Orphan Cleanup
- 查看 Dashboard 统计与待处理事项

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
- **Search Experience（后端 ✅ / 前端 ✅ M19.3.1 / ✅ M19.3.2 / ✅ M19.3.2.1 / ✅ M19.3.3 CLOSED）**：搜索体系定位为 **Industrial Inspection Capability Discovery（工业检测能力发现）**，不等于电商搜索；四类搜索边界——Product Search（设备发现，GET /products keyword+category+parameterFilters）、Supplier Capability Search（能力发现，GET /organizations/:id + GET /offers?organizationId=）、Knowledge Search（内容资产，未来规划）、Matching Search（需求匹配，RFQ Domain）；**M19.3.0（473）架构审计通过**——四层搜索 IA 冻结（Product Discovery / Supplier Capability Discovery / Knowledge Discovery / Matching Discovery）、Database Query First（当前不需搜索引擎）、零 Schema/API 变更；**M19.3.1（474）Product Search UX 增强已完成**——URL 同步（useSearchParams+useRouter）、关键词高亮（HighlightText 前端 only）、Active Filter Chips + 清除全部、SearchBar 清除 (X) 按钮、Supplier Discovery 入口（ProductCard 预留）、`apps/web` build exit 0、Schema/Migration/API 均 None；**M19.3.2（475）Search Result UX 增强已完成**——Loading Skeleton + Empty State 场景化（关键词上下文/调整建议）+ Result Count 上下文（页码/筛选标记）+ Pagination 页码指示器（`currentPage / totalPages`）+ ProductCard 供应商链接（`/products/${id}#suppliers`，Product-driven Capability Discovery），`apps/web` build exit 0、Schema/Migration/API 均 None；**M19.3.2.1（476）Supplier Discovery Boundary Correction 已完成**——删除公开供应商目录（`/suppliers` 列表页 + 产品页入口），恢复 Product-driven Capability Discovery（Supplier = Capability Provider），`apps/web` build exit 0、Schema/Migration/API 均 None。
- **Future AI Discovery（⏳ M20 规划）**：AI Readiness 底座（Embedding / Vector / RAG）为 M20 规划，当前不实施。

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
