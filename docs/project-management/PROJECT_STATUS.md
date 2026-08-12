# VISNDT Project Status

## Snapshot

- Last calibrated: `2026-08-12`
- Repository Root: `F:\Desktop\VISNDT`
- Code Root: `F:\Desktop\VISNDT\VISNDT`
- Branch baseline: `main`
- Current product stage: `C. 业务闭环完善阶段`
- Current M stage: `M18 内容运营能力实施（M18.1 Markdown 已完成，M18.2 Content Media 已实现，M18.3 SEO 已完成，M18.4 规划已完成，M18.4.1 Workflow Reliability Foundation 已完成，M18.4.2 Content Revision 已实现，M18.4.3 Scheduled Publish 已实现，M18.4.4 Approval Timeline 已实现，M18.4 阶段闭环完成，待 M18.5 内容运营稳定化）`

## Current Phase Judgment

VISNDT 已经完成基础建设、后端主域与 Admin 运营底座，也已完成 Buyer / Supplier 双侧 Workspace 主链。当前项目最准确的状态是：

`M15 技术债治理已全面收口，M16 业务深化前稳定性审计已完成，可进入业务深化开发阶段。`

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

## Next Step

### Priority 4 — M18.4 Workflow Operation Enhancement 阶段闭环

M18.4.1（449）Workflow Reliability Foundation、M18.4.2（450）Content Revision、M18.4.3（451）Scheduled Publish 均已实现，**M18.4.4 Content Approval Timeline Enhancement（452）已完成（WorkflowEvent 审核时间线 + Admin 展示）**，**M18.4 Workflow Operation Enhancement 阶段闭环完成**。下一任务为 **M18.5 Content Operation Stabilization（内容运营稳定化）**。

进入前要求：
- [x] 449 报告生成（M18.4.1 Workflow Reliability Foundation 完成）
- [x] 450 报告生成（M18.4.2 Content Revision Implementation 完成）
- [x] 451 报告生成（M18.4.3 Content Scheduled Publish Implementation 完成）
- [x] 452 报告生成（M18.4.4 Content Approval Timeline Enhancement 完成）
- [x] M18.4 阶段闭环（Revision History / Scheduled Publish / Reviewer Record / Approval History 全部落地）
- [x] 不新增 WorkflowAction / Role / Notification 类型 / CMS Scheduler / ApprovalHistory / Reviewer 表

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
