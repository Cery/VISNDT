# VISNDT Content Management Plan

## Current State

### Already Exists

#### Frontend Pages

- `/knowledge`
- `/solutions`
- `/business`
- `/about`

其中：

- `/knowledge` 与 `/solutions` 已进入主导航
- 页面具备基础 `metadata` 文案
- 内容目前全部来自前端硬编码数组或静态 JSX

#### Related Existing Foundations

- `ProductCategory`、`ParameterGroup`、`ParameterDefinition` 已形成结构化业务数据基础
- Public Website 已具备 Next.js App Router 与基础 SEO metadata 机制
- Admin 已具备成熟的列表/详情/表单管理模式，可复用于未来内容后台

### Missing

#### Data Model

当前 Prisma Schema 中不存在以下内容模型：

- `Knowledge`
- `Article`
- `ContentCategory`
- `Insight`
- `Solution`
- `SeoMetadata`

#### API

当前后端不存在以下内容域接口：

- 内容列表 API
- 内容详情 API
- 内容发布 / 下线 API
- SEO Metadata 管理 API
- Parameter Explanation / Insight API

#### Admin Entry

当前 `apps/admin` 路由中不存在以下后台入口：

- 内容管理
- 文章管理
- 知识中心管理
- 解决方案管理
- SEO 管理

#### Frontend Capability

当前 Web 不存在：

- `/knowledge/[slug]`
- `/articles/[slug]`
- `/insights/[slug]`
- `/solutions/[slug]`
- 内容搜索、筛选、标签、分页
- 动态 SEO Metadata 生成

## Assessment

当前 VISNDT 的内容管理状态应定义为：

`已有前台展示壳，但没有内容管理系统。`

也就是说，平台已经有内容入口和导航位，但尚未形成“可被后台维护、可被搜索、可被 SEO 利用、可与产品/参数联动”的内容域。

## Design Recommendation

### Phase 1: Minimal Content Domain

先建立最小内容域，而不是一次性做全 CMS：

1. `Knowledge`
   - 用于技术知识、指南、案例、选型内容集合
2. `Article`
   - 具体文章实体，支持标题、摘要、正文、封面、slug、状态
3. `Solution`
   - 行业解决方案实体，支持场景、痛点、推荐产品、关联文章
4. `SeoMetadata`
   - 为内容页、分类页、解决方案页提供 title / description / keywords / og

### Phase 2: Insight + Parameter Explanation

结合现有参数体系，新增内容联动：

1. `Insight`
   - 行业观察、趋势、应用说明
2. `Parameter Explanation`
   - 以 `ParameterDefinition` 为中心，补充“参数是什么、为什么重要、如何选型”

推荐关系：

- `ParameterDefinition` -> 多条 `Insight`
- `ParameterDefinition` -> 一条或多条 `Parameter Explanation`
- `Solution` -> 关联 `Article` / `ProductCategory` / `Product`

### Phase 3: Admin Content Entry

在 `apps/admin` 新增内容管理入口：

- Knowledge / Article 列表
- Solution 列表
- Insight / Parameter Explanation 列表
- SEO Metadata 编辑页

## Suggested Information Architecture

### Knowledge

- 检测指南
- 技术文章
- 应用案例
- 选型指南

### Article

- 通用文章实体
- 支持多分类、多标签、关联产品、关联参数

### Insight

- 更偏“解释”和“洞察”
- 适合与参数体系、行业场景、技术路线绑定

### Solution

- 面向行业场景
- 可关联产品、分类、文章、案例

### SEO Metadata

- 首页 / 分类页 / 产品列表页 / 内容详情页 / 解决方案详情页统一管理

## Recommended Rollout Order

1. 已完成 `M15`（WorkflowEvent 完整性治理已收口，为 CMS 审核流/内容发布流程提供事件基础）
2. M16.0 审计已通过，M16.1 已打通公开询价链路的真实数据绑定，M16.2 已统一前端 API 分层（`Page → Service → API Wrapper → Backend API`），M16.3 已建立公开站 SEO 元数据基础（metadataBase / Open Graph / 动态产品元数据）
3. `M16.4` 已完成内容管理 MVP 架构评估（见 `docs/_review/433_M16.4_Content_Management_MVP_Assessment_Report.md`），确认 **M16 阶段不实施内容管理系统**，最小内容域范围与前置清单已定义，作为 M17 立项基线
4. `M16.5` 已清理组件层运行时直接调用 `lib/api/*`，前端数据访问架构统一为 `Component → Service → API Wrapper → Backend API`，为 M17 内容组件开发提供统一数据访问基线
5. `M16` 关闭审计（435）通过，**M16 CLOSED**，允许进入 M17 内容域立项（仅规划，不实施）
6. `M17.0` 已完成内容域架构规划（436）：统一 `Content` + `type` 判别实体提案、工作流映射（复用 WorkflowAction）、Public/Admin 内容 API 提案、Web/Admin 前端规划；仅设计，未实施
7. `M17.1` 已完成 Content Model Design Review（437，评审通过（Conditional Approved））：定稿 Content 实体字段、ContentType（MVP 启用 ARTICLE/KNOWLEDGE/SOLUTION，INSIGHT 延期）、ContentStatus 生命周期、API Contract、WorkflowEntityType CONTENT 扩展决策（待 M17.2 审批）
8. `M17.2` 已完成内容域基础实现（438）：WorkflowEntityType 新增 `CONTENT`；新增 ContentType/ContentStatus 枚举 + Content 模型；Migration `20260811154853_m17_2_content_domain` 创建并应用；创建 `apps/api/src/content/` 模块（module/controller/service + create/update/query DTO）；新增 `/api/v1/content`（ADMIN 保护 + submit/review/publish/archive 生命周期 API）；构建与运行验证通过
9. `M17.3` 已启动并完成 Admin 内容管理前端（439）：Admin 新增「内容管理」菜单与路由（`/content`、`/content/create`、`/content/:id`）；Service Layer 封装 `content.service.ts`；新增 `ContentForm` 共享表单与 `ContentList`/`ContentCreate`/`ContentEdit` 页面；实现生命周期操作（DRAFT→submit、REVIEW→review、PUBLISHED→archive）；遵循 `Page → Service → API Wrapper → Backend API`；Admin build 通过（exit code 0）；冻结区域无变化
10. 在 `M17.4` 接入 Web `/knowledge`、`/solutions` 动态内容（复用 M17.2 Public API 能力与 M16.3 SEO 机制）
11. `M17.4` 已完成 Public Content API 安全审计（441）：PUBLISHED 隔离（DB 层强制）、slug 隔离、响应边界（`publicContentSelect` 公开投影，剔除 `status/archivedAt/authorId/author.email`）、分页运行时限制（`@Min(1)/@Max(100)`）、Rate Limit 继承全局 ThrottlerGuard；Security PASS；冻结合规
12. `M17.5` 已完成 Content Domain Enhancement Planning（442，Architecture Planning Only，No Code Change）：MVP 闭环确认（Model→Admin→Workflow→Public API→Web→SEO）；内容编辑策略推荐 **Markdown + Preview**；媒体演进规划 `ContentMedia→FileAsset`；SEO 演进规划 OpenGraph/Structured Data/Sitemap/Canonical；工作流演进规划版本/定时发布/审核记录；内容类型演进规划 Case Study/Technical Guide/Industry Report/Product Application；冻结区域无修改，作为 M18 实施范围基线
13. `M18` 已启动内容运营能力实施规划（443，Architecture Planning Only，No Code Change）：制定五优先级实施路线 P1 Markdown Rendering / P2 Content Media / P3 SEO Enhancement / P4 Workflow Operation / P5 Extended Content Types；子阶段 M18.1-M18.5；保持统一 Content 模型、不拆分独立业务模型、不引入 Headless CMS / 独立 CMS / 新权限系统、不新增 ContentWorkflowAction、不拆分 SeoMetadata 模型；冻结区域无修改，作为 M18 开发范围基线
14. `M18.1` 已完成 Markdown 内容增强（444）：Admin Content 正文升级为 Markdown 编辑器+预览（`MarkdownEditor.tsx`）；Content 类型/筛选支持 INSIGHT 参数百科；Web 新增 `MarkdownRenderer.tsx`（服务端安全渲染 + skipHtml + 协议白名单），`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页纯文本升级为安全 Markdown 渲染并保留 SEO；启用 `@tailwindcss/typography` prose 插件；后端 Create/Update DTO 校验扩展允许 INSIGHT（DB enum 已含，不改端点/响应结构）；新增 `database/seed_content.ts` 幂等示例内容（已入库 KNOWLEDGE 3 / SOLUTION 2 / INSIGHT 3，均 PUBLISHED）；参数百科（INSIGHT）明确为关联内容基础、非独立导航/入口；Schema/Migration/Auth/Role/Permission/WorkflowAction/Notification/Audit/Content API 端点契约均无变化；三端 build 通过（API/Admin/Web）
15. 在 `M18.2-M18.5` 依序实施内容运营增强（以 443 规划为基线：M18.2 Media → M18.3 SEO → M18.4 Workflow → M18.5 Content Type）
16. `M18.2` 已完成 Content Media 架构规划（445，Architecture Planning Only，No Code Change）：评估并推荐 `Content → ContentMedia → FileAsset` 中间表模式（完全复用 Product→ProductMedia→FileAsset 成熟链路，含原子上传-create 与删除级联 S3 清理）；候选字段 `id/contentId/fileAssetId/type(IMAGE|ATTACHMENT)/caption/sortOrder`；未来新增 `FileEntityType.CONTENT` 枚举 + `Content.media` 反向关系；Public API 推荐详情 `GET /content/public/:slug` include `media`（方案 A，向后兼容，列表保持轻量，不新增公开端点）；Public 投影永不暴露 storageKey；识别安全缺口（`GET /files/:id/download` 无「实体→发布状态」归属校验，需在 Implementation 落地）；Schema/Migration/Auth/Workflow/Notification/Audit/Content API/Role 均无变化；作为 M18.2 Implementation 冻结设计基线
17. `M18.3` 已完成 Content SEO Enhancement（447）：Content SEO 展示层能力落地，未新增 SEO 数据模型。`apps/web/src/lib/seo.ts` 新增 `absoluteUrl` / `contentImageUrl` / `buildContentJsonLd`（Article/TechArticle）；`/knowledge/[slug]` 与 `/solutions/[slug]` 详情页 `generateMetadata()` 增强 OpenGraph（title/description/url/images）+ keywords + canonical（`alternates.canonical`），并注入 JSON-LD script；新增 `apps/web/src/app/sitemap.ts`（`/sitemap.xml` 仅收录 PUBLISHED 内容 + 静态核心路由，内容拉取失败降级）；`Content` 类型补充 `ContentCoverImage` / `coverImage` 字段；Image 经 `GET /files/:id/download` 预签名 URL（受发布状态保护）；未改 Prisma Schema / 未创建 Migration / 未改 Content Model / 未建 CMS；`apps/web` build 通过（exit 0）
18. `M18.4` 已完成 Workflow Operation Enhancement 架构规划（448，Architecture Planning Only，No Code Change）：Content 工作流运营增强冻结设计。Revision History 推荐 **方案 A（ContentRevision 独立历史表）**；Scheduled Publish 为 Content 新增 `scheduledPublishAt DateTime?` + 轻量后台轮询（不新增 Schedule 模型 / 不引入 CMS Scheduler，复用 WorkflowEvent OPENED）；Reviewer Record 复用 `WorkflowEvent.operatorId` + User（不新增 Reviewer 表）；Approval History 明确 WorkflowEvent（业务时间线）与 AuditLog（系统审计）分离不混用；识别前置整改（Content WorkflowEvent 组织约束被吞 + Content 未接入 AuditLog）；未改 Schema / Migration / API / Admin / Web / WorkflowAction / Role / Permission / Notification / AuditLog；Build Not Required
19. `M18.4.1` 已完成 Workflow Reliability Foundation Implementation（449）：实施 448 前置整改。**WorkflowEvent 可靠性修复**——`WorkflowEventsService.create()` 对 `WorkflowEntityType.CONTENT` 豁免 `organizationId` 校验，`ContentService.emitEvent()` 移除 try/catch 静默吞错（WorkflowEvent 失败不再丢失）；**Content 生命周期 AuditLog 接入**——`create`（CREATE）/ `update`（UPDATE，old/new 对比）/ `transition`（submit/review/publish/archive 均 STATUS_CHANGE）；`content.controller.ts` `update` 补传 `@CurrentUser`；WorkflowEvent 与 AuditLog 职责分离保持；无新公开 API / 权限 / Role / 数据泄露；未改 Schema / Migration / ContentRevision / Scheduler / WorkflowAction / Role / Permission / Notification / Web；API / Admin build 通过（exit 0）
20. `M18.4.2` 已完成 Content Revision Implementation（450）：实施 ContentRevision 版本历史能力。**ContentRevision 独立版本历史表**——`content_revision`（`Content` 1:N，`@@index([contentId, version])`，`onDelete: Cascade`），快照字段 `title/summary/content/seoTitle/seoDescription/seoKeywords/coverImageId/snapshot/createdBy/createdAt`，迁移 `20260812043433_m18_4_2_content_revision`；**版本快照事务保存**——`ContentService.create()` 事务内建 v1、`update()` 事务内建 v(n+1)（`max(version)+1`），Revision 写入失败回滚 Content（数据完整性 > 静默成功），状态变更（transition）不建 revision；**Admin Revision History**——新增 `apps/api/src/content-revision` 模块（`GET /content/:id/revisions`、`GET /content/:id/revisions/:version`，均 ADMIN-only + `@ApiBearerAuth()`，不公开），Admin `ContentRevisionHistory.tsx` 版本历史 UI（版本/创建人/创建时间 + 查看快照，暂不实现 Restore/Diff）集成 `ContentEdit.tsx`；WorkflowEvent（流程）/AuditLog（系统审计）/ContentRevision（历史快照）职责分离保持；未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API；三端 build 通过（API/Admin/Web exit 0，Web 未触碰 `apps/web` 仅验证）
21. `M18.4.3` 已完成 Content Scheduled Publish Implementation（451）：实施 Content 定时发布能力。**Content.scheduledPublishAt**——`Content` 模型新增可空 `scheduledPublishAt DateTime?`（`@map("scheduled_publish_at")`）+ `(status, scheduledPublishAt)` 复合索引，迁移 `20260812054723_m18_4_3_scheduled_publish`；**ContentSchedulerService**——`apps/api/src/content/content.scheduler.ts` 轻量 `setInterval` 分钟级扫描（60s，`onModuleInit` 启动 / `unref` 不阻塞退出），仅扫描 `status=REVIEW AND scheduledPublishAt <= now()`，复用 `ContentService.publish()`（不复制发布逻辑），`running` 标志防重入；**幂等与失败恢复**——`ContentService.transition()` 改为原子条件更新（`updateMany where {id, status: from}`，count=0 视为已变更），并发/重复扫描下只产生一次 OPENED 与一次 STATUS_CHANGE；单条失败 catch 记录日志不阻塞其他任务，下一轮自动重试，不修改 scheduledPublishAt；**系统身份**——幂等创建 `system@visndt.com` 系统用户（`ensureSystemUser` upsert，无组织关联）作为自动发布执行主体保证可追踪；**生命周期约束**——`UpdateContentDto` 新增 `scheduledPublishAt`（可空，`@IsDateString`），`ContentService.update()` 仅允许 REVIEW 状态设置/清除，DRAFT/PUBLISHED/ARCHIVED 禁止；**WorkflowEvent 复用**——自动发布产生 `action=OPENED`，metadata `{ scheduled: true, scheduledAt }`；**AuditLog 复用**——STATUS_CHANGE `oldValue:{status:REVIEW}` `newValue:{status:PUBLISHED, scheduled:true}`；**Admin 定时发布配置**——`ContentScheduledPublish.tsx` 集成 `ContentEdit.tsx`（REVIEW 状态选时间/设置/清除，自动发布成功清除 scheduledPublishAt）；未改 WorkflowAction / Role / Permission / Notification / AuditLog Schema / WorkflowEvent Schema / Public Content API / ContentRevision；未新增 Schedule/SchedulerJob/ContentSchedule 模型；Web 未修改（公开内容仍按 `status=PUBLISHED`）；API / Admin build 通过（exit 0）
22. `M18.4.4` 已完成 Content Approval Timeline Enhancement（452）：基于现有 WorkflowEvent 实现 Content 审核历史查询，完成 M18.4 Workflow Operation Enhancement 阶段闭环。**Backend 查询能力**——`WorkflowEventsService.findContentTimeline(contentId)` 新增按 Content 的业务流程时间线查询（`entityType=CONTENT AND entityId=contentId`，`createdAt` 升序，投影 `id/action/operator(id,name)/metadata/createdAt`，不返回 AuditLog/Revision/敏感字段）；新增 Admin 接口 `GET /content/:id/approval-timeline`（`@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` + `@ApiBearerAuth()`，不公开）；**Admin Approval Timeline UI**——`ContentApprovalTimeline.tsx` 新增（antd Timeline 展示 Created→Submitted→Reviewed→Published→Archived，每项显示 Action/Operator/Time/Status Transition），集成 `ContentEdit.tsx`「审核时间线」卡片；`content.service.ts` 新增 `getApprovalTimeline`、`content.types.ts` 新增 `ContentApprovalTimelineItem`/`ContentWorkflowAction`；**职责边界保持**——WorkflowEvent（业务流程时间线）/ AuditLog（系统审计）/ ContentRevision（版本快照）三者分离，Timeline 仅来自 WorkflowEvent，Reviewer 复用 `WorkflowEvent.operatorId + User`；仅展示不落地审批动作；未改 Database（无 schema/migration）、WorkflowEvent Schema、WorkflowAction、Role/Permission、Notification、Public Content API、ContentRevision、Web；API / Admin build 通过（exit 0）

## Conclusion

M17.2-M17.4 已建立内容域端到端闭环：后端基础（Content 模型/迁移/模块/ADMIN API）、Admin 内容管理（菜单/列表/编辑器/生命周期操作）、Web 公共内容动态展示（Knowledge/Solutions 列表 + 详情页 + 动态 SEO）、Public Content API 安全审计（441）。M17.5（442）完成增强规划评审，M18.0（443）制定五优先级实施路线（P1 Markdown / P2 Media / P3 SEO / P4 Workflow / P5 Content Type）。当前状态：

- 已上线的内容导航入口
- Content 端到端闭环基础设施（Content 模型 + Admin API + WorkflowEvent 事件扩展 + Public API）
- Admin 内容管理基础（M17.3：菜单/路由/Service/列表/编辑器/生命周期操作，build 通过）
- Web 动态内容展示（M17.4：Knowledge/Solutions 动态化 + 详情页 + 动态 SEO）
- Public Content API 安全边界（M17.4 审计：PUBLISHED 隔离 / 响应投影 / 分页限制）
- M17.5 增强规划基线（媒体 / 编辑 / SEO / 工作流 / 内容类型演进方向）
- M18.0 五优先级实施路线基线（443：P1-P5 与子阶段 M18.1-M18.5）
- **M18.1 Markdown 内容增强（444）已完成**：Admin Markdown 编辑+预览、Web 安全 Markdown 渲染（XSS 防护）、参数百科（INSIGHT）定位校准、示例内容入库（KNOWLEDGE 3 / SOLUTION 2 / INSIGHT 3）、Content API 端点契约保持
- **M18.2 Content Media 架构规划（445）已完成（Planning Only）**：推荐 `Content→ContentMedia→FileAsset` 中间表模式（复用 ProductMedia 成熟链路）；Public API 方案 A（详情 include media）；识别媒体下载归属校验安全缺口；作为 M18.2 Implementation 冻结设计基线
- **M18.3 Content SEO Enhancement（447）已完成**：OpenGraph（title/description/url/images）、JSON-LD（Article/TechArticle）、Sitemap（`/sitemap.xml` 仅 PUBLISHED）、Canonical（`alternates.canonical`）、keywords；未新增 SEO 数据模型（复用 `Content.seoTitle/seoDescription/seoKeywords/coverImage`）；`apps/web` build 通过
- **M18.4 Workflow Operation Enhancement 架构规划（448）已完成（Planning Only）**：Revision History（ContentRevision 独立表）、Scheduled Publish（Content.scheduledPublishAt + 轻量轮询）、Reviewer Record（复用 WorkflowEvent.operatorId）、Approval History（WorkflowEvent 时间线 + AuditLog 系统审计分离）；含 Content WorkflowEvent 可靠性修复与 AuditLog 补齐整改项；不新增 WorkflowAction / Role / Notification 类型 / CMS Scheduler
- **M18.4.1 Workflow Reliability Foundation Implementation（449）已完成**：WorkflowEvent 可靠性修复（CONTENT 豁免组织约束 + emitEvent 移除静默吞错）+ Content 生命周期 AuditLog 接入（CREATE / UPDATE / STATUS_CHANGE，含 old/new）；WorkflowEvent 与 AuditLog 职责分离保持；无新公开 API / 权限 / Role / 数据泄露；未改 Schema / Migration / ContentRevision / Scheduler / WorkflowAction / Role / Permission / Notification / Web；API / Admin build 通过
- **M18.4.2 Content Revision Implementation（450）已完成**：ContentRevision 独立版本历史表（content_revision，Content 1:N）+ 迁移 20260812043433_m18_4_2_content_revision；ContentService create 事务内建 v1、update 事务内建 v(n+1)（写入失败回滚 Content）；新增 content-revision 模块（GET /content/:id/revisions、REVISIONS/:version，均 ADMIN-only 不公开）；Admin ContentRevisionHistory 版本历史 UI（版本/创建人/创建时间 + 查看快照，暂不实现 Restore/Diff）；WorkflowEvent（流程）/AuditLog（系统审计）/ContentRevision（历史快照）职责分离保持；未改 WorkflowAction/Role/Permission/Notification/Public Content API；三端 build 通过
- **M18.4.3 Content Scheduled Publish Implementation（451）已完成**：Content 新增 `scheduledPublishAt DateTime?` + `(status, scheduledPublishAt)` 复合索引，迁移 20260812054723_m18_4_3_scheduled_publish；新增 ContentSchedulerService（轻量 setInterval 分钟级扫描，仅 REVIEW+scheduledPublishAt<=now，复用 publish()，`running` 防重入）；transition 原子条件更新保证幂等（并发/重复扫描仅一次 OPENED + 一次 STATUS_CHANGE）；幂等创建 `system@visndt.com` 系统身份保证可追踪；单条失败隔离并下轮重试；仅 REVIEW 可设置/清除定时发布；WorkflowEvent 复用 OPENED（metadata scheduled:true）、AuditLog STATUS_CHANGE（newValue scheduled:true）；Admin ContentScheduledPublish 定时发布配置 UI；未改 WorkflowAction/Role/Permission/Notification/Public Content API/ContentRevision，未新增 Schedule 模型；Web 未修改；API / Admin build 通过
- **M18.4.4 Content Approval Timeline Enhancement（452）已完成**：基于 WorkflowEvent 实现 Content 审核历史查询（`WorkflowEventsService.findContentTimeline`，entityType=CONTENT + entityId=contentId，投影 id/action/operator/metadata/createdAt）；新增 Admin 接口 `GET /content/:id/approval-timeline`（ADMIN-only + @ApiBearerAuth，不公开）；Admin ContentApprovalTimeline 审核时间线 UI（Created→Submitted→Reviewed→Published→Archived，Action/Operator/Time/Status Transition）集成 ContentEdit；Reviewer 复用 WorkflowEvent.operatorId + User；WorkflowEvent（流程）/AuditLog（系统审计）/ContentRevision（版本快照）职责分离保持，Timeline 仅来自 WorkflowEvent、仅展示不落地审批；无 schema/migration，未改 WorkflowAction/Role/Permission/Notification/Public Content API/ContentRevision/Web；API / Admin build 通过

因此，内容管理仍定义为：

`平台深化阶段的新能力建设，M17 已达成内容域 MVP 闭环（后端 + Admin + Web + Public API 安全审计），M17.5 已完成增强规划（442），M18.0 已完成实施规划（443），M18.1 已完成 Markdown 编辑与 Web 安全渲染（444），M18.2 已完成 Content Media 架构规划（445）与实现（446），M18.3 已完成 Content SEO 展示层增强（447），M18.4 已完成 Workflow 运营增强架构规划（448），M18.4.1 已完成 Workflow Reliability Foundation（449，WorkflowEvent 可靠性修复 + Content AuditLog 接入），M18.4.2 已完成 Content Revision（450，ContentRevision 版本历史），M18.4.3 已完成 Content Scheduled Publish（451，定时发布 + ContentSchedulerService 轻量扫描 + 幂等/可追踪/失败恢复），M18.4.4 已完成 Content Approval Timeline（452，WorkflowEvent 审核时间线 + Admin 展示，M18.4 阶段闭环），M18.5 将实施内容运营稳定化。`
