# 773\_Admin\_IA\_Architecture\_Audit\_Decision\_Gate

> **Task**: `773_Admin_IA_Architecture_Audit_Decision_Gate`
>
> **Version**: `V3.2.3`
>
> **Status**: **Admin IA Architecture Audit / Decision Gate · READ-ONLY**
>
> **Date**: `2026-09-03`
>
> **Task Type**: Architecture Audit + IA Audit + Route/RBAC Impact Audit + Decision Gate
>
> **Execution**: READ-ONLY（禁止修改任何代码、路由、菜单、权限、数据库、配置、页面实现）

***

## 1. Executive Summary

对 VISNDT Admin 后台完成了一次**只读、事实驱动**的 IA（信息架构）审计。以 Repository 实际实现为准，逐项核验了实际菜单→路由→页面→权限→RBAC→页面职责，并与豆包方案、DeepSeek 方案进行了三方对照。

**核心结论：**

1. 当前实际 IA 已高度贴合 VISNDT 平台域模型（Product=Capability、SupplierProduct、Organization、Demand、Match、RFQ、Inquiry、Offer），**结构与两个候选方案在骨架上高度一致**，候选方案仅提供术语/分组层面的增量优化。
2. 两个候选方案均引入「交易 / 核心交易（Marketplace / Transaction）」顶层语义，**与 VISNDT「非 Marketplace / 非 Store / 非交易」平台定位冲突**，不建议直接采用。
3. **细粒度 Admin RBAC 处于“声明确认但未接线”状态**：前端定义了 `SUPER_ADMIN / ADMIN / OPERATOR / VIEWER` 及细粒度权限，但未应用于菜单、路由、页面；后端仅以 `Role.ADMIN` 做粗粒度鉴权。这是 IA 外的重要一致性问题（影响未来“角色权限”类菜单决策）。
4. **Active Menu 存在已知回归**：`selectedKeys={[location.pathname]}` 对详情/编辑路由（`/x/:id`、`/x/:id/edit`）无法命中菜单 key，导致进入详情页时菜单高亮丢失；`openKeys` 初始仅 `['knowledge']`，深层链接无法自展开。
5. **决策门：IMPLEMENTATION AUTHORIZED WITH CONDITIONS** —— Admin 菜单可在**不改变任何 Route / Page / API / Permission** 的前提下做「菜单分组重组 + 标签修正」这一 Class A（Menu-only）改造；但必须满足若干条件（不引入“交易”语义、修正 Active Menu、不新增 RBAC 管理菜单等）。

***

## 2. Repository Verification（§2 / C1）

- **Repository Root**: `F:/Desktop/VISNDT`

- **Admin Code Root**: `F:/Desktop/VISNDT/VISNDT/apps/admin`

- **Backend Code Root**: `F:/Desktop/VISNDT/VISNDT/apps/api`

- **Docs Root**: `F:/Desktop/VISNDT/docs`

- **Branch**: `main`

- **HEAD**: `76b08e5`（`768 M34.6 closeout docs …`）

- **Git State（`git status --short`）**：存在大量 **Modified**（M3x/M4x 既有变更，均保留）与 **Untracked**（各阶段证据/脚本/受控数据）。

- **Git 纪律**：未执行 `commit / push / reset / checkout / clean`，未清理、未恢复、未修改任何现有状态。**只读。**

> **治理提示（文件名碰撞）**：`docs/_review/` 下已存在历史报告 `773_M34.7_Runtime_Evidence_And_Implementation_Integrity_Closure_Report.md`（2026-09-01）。本任务按指令生成 `773_Admin_IA_Architecture_Audit_Decision_Gate.md`，两者**文件名不同、互不覆盖**，但共享「773」编号。本报告明确记录此差异，避免治理编号误读。历史 773\_M34.7 报告未做任何修改。

***

## 3. Actual Admin IA（§1.6 实核，非历史假设）

以下结构**直接读取自** `apps/admin/src/layouts/AdminLayout.tsx`（`menuGroups`）与 `apps/admin/src/router/index.tsx`，为**当前事实**。

| 一级分组   | 菜单项（key=Route）                                                                                                                                                      | 说明     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 首页     | `/home` 首页 · `/operation-center` 运营中心                                                                                                                               | 两部分页   |
| 能力中心   | `/products` 能力管理 · `/supplier-products` 能力型号审核 · `/product-categories` 能力分类 · `参数体系`\[`/parameter-groups` 参数组, `/parameter-definitions` 参数定义]                       | 能力/主数据 |
| 业务中心   | `/demands` 需求管理 · `/rfqs` RFQ 管理 · `/offers` 报价管理 · `/inquiries` 能力询价 · `/matching` 匹配管理                                                                            | 业务工作流  |
| 用户与供应商 | `/users` 用户管理 · `/organizations` 企业管理                                                                                                                               | <br /> |
| 内容中心   | `/content` 内容管理 · `知识库`\[`/knowledge/entries`, `/knowledge/domains`, `/knowledge/categories`, `/product-category-knowledge-mappings` 知识分类映射] · `/content/tags` 标签管理 | <br /> |
| 媒体中心   | `/media` 媒体管理                                                                                                                                                       | <br /> |
| 数据与分析  | `/analytics` 数据分析 · `/business-analytics` 业务分析 · `/monitoring` 运营监控 · `/audit-intelligence` 审计智能                                                                    | <br /> |
| 系统管理   | `/notifications` 通知管理 · `/audit-logs` 审计日志 · `/embedding` AI 数据准备                                                                                                   | <br /> |

**菜单量**：8 个一级分组；一级菜单项 23 个（`参数体系`、`知识库` 各计 1 个父项），二级子项 6 个（参数组/定义 2 + 知识 4）。

**实际路由**（`router/index.tsx`，全部位于 `RequireAuth` 包裹的 `AdminLayout` 之下）+ `/login`、`*`→NotFound、`/`→重定向 `/home`。

***

## 4. Actual Menu → Route → Page → Permission 映射（§3.1 / §5 / C2-C4）

### 4.1 完整映射（一级 + 二级 + 详情/编辑/无菜单路由）

| 当前菜单    | Route                                                       | Page 组件                           | API Service / 端点                                       | 权限层     | 判定                   |
| ------- | ----------------------------------------------------------- | --------------------------------- | ------------------------------------------------------ | ------- | -------------------- |
| 首页      | `/home`                                                     | Home.tsx                          | dashboardService `/admin/dashboard/*`                  | VO（仅鉴权） | 运营 KPI               |
| 首页      | `/operation-center`                                         | OperationCenter.tsx               | operationService `/admin/operation/*`                  | VO      | 业务工作台                |
| 能力管理    | `/products`                                                 | ProductList.tsx                   | productService                                         | VO      | 能力强列表                |
| 能力管理    | `/products/create` · `/products/:id` · `/products/:id/edit` | ProductCreate/Detail/Edit         | productService                                         | VO      | <br />               |
| 能力管理    | `/products/:productId/media[/create][/:id/edit]`            | ProductMedia\*                    | productMediaService                                    | VO      | 产品媒体子表               |
| 能力型号审核  | `/supplier-products` `/supplier-products/:id`               | SupplierProductList/Detail        | supplierProductService                                 | VO      | SupplierProduct 审核流  |
| 能力分类    | `/product-categories[/create][/:id/edit]`                   | ProductCategory\*                 | categoryService                                        | VO      | <br />               |
| 参数体系    | `/parameter-groups[/create][/:id][/:id/edit]`               | ParameterGroup\*                  | parameterGroupService                                  | VO      | 参数组                  |
| 参数体系    | `/parameter-definitions[/create][/:id][/:id/edit]`          | ParameterDefinition\*             | parameterDefinitionService                             | VO      | 参数定义                 |
| 需求管理    | `/demands[/:id][/:id/edit]`                                 | DemandList/Detail/Edit            | demandService                                          | VO      | <br />               |
| 需求管理    | `/demands/:demandId/matches/:matchId`                       | MatchDetail.tsx                   | matchService                                           | VO      | 匹配详情（深链）             |
| 匹配管理    | `/matching`                                                 | MatchingMonitor.tsx               | match/monitoring                                       | VO      | <br />               |
| RFQ 管理  | `/rfqs` `/rfqs/create` `/rfqs/:id`                          | RfqList/Create/Detail             | rfqService                                             | VO      | <br />               |
| —（无菜单）  | `/rfq-responses/:id`                                        | RfqResponseDetail.tsx             | rfqResponseService                                     | VO      | **孤儿路由（无菜单项）**       |
| 报价管理    | `/offers` `/offers/:id`                                     | OfferList/Detail                  | offerService                                           | VO      | <br />               |
| 能力询价    | `/inquiries` `/inquiries/:id`                               | InquiryList/Detail                | inquiryService                                         | VO      | <br />               |
| 用户管理    | `/users[/create][/:id][/:id/edit]`                          | UserList/Create/Detail/Edit       | userService                                            | VO      | <br />               |
| 企业管理    | `/organizations[/create][/:id][/:id/edit]`                  | Organization\*                    | organizationService                                    | VO      | <br />               |
| 内容管理    | `/content[/create][/:id]`                                   | ContentList/Create/Edit           | contentService                                         | VO      | <br />               |
| 标签管理    | `/content/tags[/create][/:id/edit]`                         | ContentTag\*                      | contentTagService                                      | VO      | <br />               |
| 知识库     | `/knowledge/entries[/create][/:id/edit]`                    | KnowledgeEntry\*                  | knowledgeService                                       | VO      | <br />               |
| 知识库     | `/knowledge/domains[/create][/:id/edit]`                    | KnowledgeDomain\*                 | knowledgeService                                       | VO      | <br />               |
| 知识库     | `/knowledge/categories[/create][/:id/edit]`                 | KnowledgeCategory\*               | knowledgeService                                       | VO      | <br />               |
| 知识库     | `/product-category-knowledge-mappings[/create][/:id/edit]`  | ProductCategoryKnowledgeMapping\* | productCategoryKnowledgeMappingService                 | VO      | <br />               |
| 媒体管理    | `/media`                                                    | MediaList.tsx                     | fileAssetService                                       | VO      | FileAsset 资产         |
| 数据分析    | `/analytics`                                                | Analytics.tsx                     | analyticsService `/analytics/dashboard`                | VO      | 站点分析                 |
| 业务分析    | `/business-analytics`                                       | BusinessAnalytics.tsx             | businessAnalyticsService `/admin/analytics/business/*` | VO      | 业务漏斗                 |
| 运营监控    | `/monitoring`                                               | Monitoring.tsx                    | monitoringService `/admin/monitoring/*`                | VO      | <br />               |
| 审计智能    | `/audit-intelligence`                                       | AuditIntelligence.tsx             | auditIntelligenceService `/admin/audit-intelligence`   | VO      | 风险画像                 |
| 通知管理    | `/notifications` `/notifications/:id`                       | NotificationList/Detail           | notificationService                                    | VO      | <br />               |
| 审计日志    | `/audit-logs`                                               | AuditLogList.tsx                  | auditLogService `/admin/audit-logs`                    | VO      | 含 RoleCapabilityCard |
| AI 数据准备 | `/embedding`                                                | EmbeddingManagement.tsx           | embeddingService                                       | VO      | AI 数据界面（FROZEN）      |
| —（无菜单）  | `/files/orphans`                                            | FileAssetOrphanList.tsx           | fileAssetService                                       | VO      | **孤儿路由（无菜单项）**       |

> 权限层备注：此处统一标注 **VO**（View Only / 需登录），因为使用 `RequireAuth` 仅作「是否登录」闸门；细粒度角色权限未生效（见 §6 与 §7）。

### 4.2 一页多菜单 / 一菜单多入口 / 无菜单路由识别

- **一菜单对应多个路由**：`/products*`（列表/创建/详情/编辑/媒体）、`/demands*`、`/rfqs*`、知识库四项，均正常（父菜单承载子路由）。

- **无菜单路由（孤儿）**：`/rfq-responses/:id`、`/files/orphans`——存在真实页面与 API，但侧栏无入口（经页面内跳转可达）。**IA 上属“隐藏能力”，改造时可决定是否纳入菜单。**

- **同一域双入口**：`/matching`（匹配管理）与 `/demands/:demandId/matches/:matchId`（MatchDetail 深链）同属 Match 域，分属两个菜单语义（独立管理页 vs 需求详情内联）。非重复，职责不同。

- **媒体双面**：`/products/:productId/media*`（产品媒体子表，挂在能力管理下）与 `/media`（媒体中心，全局 FileAsset 资产库）职责不同，非重复。

### 4.3 Redirect / 演绎

- `/` → `Navigate to="/home"`（redirect 自带）。

- 登录后按 `RequireAuth` 的 `state.from` 回跳。

- **未发现旧路由→新路由的 legacy redirect**；当前无需要维护的路由别名，改造若不动 route 则无 redirect 引入。

***

## 5. Route → Page → 业务职责 → API → Permission（§5.2 / C3）

对每一现有 Admin 页面完成「Primary Responsibility / 归属域 / 是否重复」判定。要点（完整清单以 §4.1 表为准）：

- **Home（`/home`）**：Executive KPI Dashboard（KpiCard / 趋势 / 状态 / 匹配统计），消费 `/admin/dashboard/*`。**Primary=高层运营总览**。

- **OperationCenter（`/operation-center`）**：业务工作台（operationQueue / DomainEntryCard / 各运营域 StatusGroup），消费 operationService。**Primary=运营工作台（事务性待办），与 Home 是互不相同的两个页面、两套 API，非重复入口。**

- **能力集（products / supplier-products / categories / parameters）**：Product=Capability Authority 的主数据 + SupplierProduct 审核流。`能力型号审核`=SupplierProduct 的平台审核（DRAFT→…→PUBLISHED）。**职责清晰，无重复。**

- **业务集（demands / rfqs / inquiries / offers / matching）**：Demand→Match→RFQ→RFQResponse→Inquiry→Offer 的业务闭环。**连续工作流，归属一致。**

- **用户与组织（users / organizations）**：用户 + 组织（企业）主数据。

- **内容/知识/标签**：内容资产 + 知识域/分类/条目 + 知识分类映射 + 内容标签。**同一内容资产体系。**

- **媒体（media）**：FileAsset 全局资产库。**与内容同属资产体系，但为独立运营对象（有独立实体/API）。**

- **数据与监控（analytics / business-analytics / monitoring / audit-intelligence / audit-logs）**：站点分析、业务分析、运营监控、审计智能、审计日志，职责各有侧重。

- **通知（notifications）**：通知中心。

- **Embedding（AI 数据准备）**：AI 向量数据准备界面。**AI 保持 FROZEN，此处仅为数据准备，非 AI 产品化能力。**

***

## 6. Permission / RBAC 映射（§5.3 / §5.4 / C3 · 关键发现）

### 6.1 前端 Admin RBAC（声明层）

`apps/admin/src/auth/roles.ts` 定义了：

- 角色：`SUPER_ADMIN / ADMIN / OPERATOR / VIEWER`；

- 权限：`product:manage/view`、`content:manage/view`、`user:manage/view`、`organization:manage/view`、`audit:view`、`system:manage`、`tag:manage`、`category:manage`、`file:manage`、`demand:manage`、`inquiry:manage`、`rfq:manage`、`offer:manage` 等；

- 组件：`usePermission()`、`PermissionGuard`、`PermissionButton`、`RoleCapabilityCard`。

### 6.2 接线情况（全量 grep 结果）

对 `apps/admin/src` 全部 207 个 ts/tsx 的 `PermissionGuard | PermissionButton | hasPermission | hasAnyPermission | checkPermission | RoleCapabilityCard` 命中分析：

- 命中仅存在于权限定义/组件自身及 `hooks/usePermission.ts`；

- **唯一消费方**：`AuditLogList.tsx` 引用 `RoleCapabilityCard`（一处**只读展示卡片**，不构成门禁）；

- **没有任何页面/路由/菜单使用** **`PermissionGuard`** **/** **`PermissionButton`** **/** **`hasPermission`** **做门禁**；

- **侧栏菜单** **`AdminLayout.tsx`** **无任何按角色过滤**——所有菜单项对任意已登录 Admin 全量显示。

> **结论：前端细粒度 RBAC 处于“已声明、未接线、未强制”状态。** 菜单仅由 `RequireAuth`（是否登录）这一层闸门保护；无 Menu-level、Route-level、Page-level 的角色过滤。

### 6.3 后端 Admin RBAC（强制层）

`apps/api/src`：

- `Role` 枚举：`ADMIN / MEMBER / SUPPLIER`（`auth/enums/role.enum.ts`）；

- `RolesGuard`（`auth/guards/roles.guard.ts`）：读取 `user.organizationId` + `organizationMember.role`，命中 `@Roles(...)` 要求即放行；

- 所有 Admin 控制器（admin-analytics / admin-audit-intelligence / admin-audit-log / admin-demand / …）统一 `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`。

> **结论：后端 Admin 边界为「单一粗粒度** **`Role.ADMIN`」强制门禁，无细粒度管理子角色。**

### 6.4 RBAC 一致性问题（§5.3 关键差异）

```text
Menu Guard   ≠  Route Guard   ≠  Page Guard   ≠  API Authorization
（前端无）      （前端仅登录）      （前端无）        （后端 Role.ADMIN 粗粒度）
```

- **前端 Admin 子角色（SUPER\_ADMIN/OPERATOR/VIEWER）在后端无对应强制项**：`Role.ADMIN` 是最细粒度，前端定义的角色层级在安全边界上**不具权威**。

- 由此：**不建议直接在菜单加入「角色权限」管理项**——因为后端没有对应的角色-权限管理 API，RBAC 运行时能力主要为粗粒度 `Role.ADMIN`，RBAC 管理 UI 的能力前提不成立（见 §5.4 区分：`RBAC Runtime Capability ≠ RBAC Management UI`）。

***

## 7. Page Responsibility 判定（§5.5 / C5）

| 页面/域                      | 是否重复       | 应合并？              | 应迁移？       | 应保留独立入口？    | 备注             |
| ------------------------- | ---------- | ----------------- | ---------- | ----------- | -------------- |
| 首页 vs 运营中心                | 否（两套 API）  | 否                 | 否          | 是           | 高层总览 + 事务工作台   |
| 能力管理/能力分类/参数体系            | 否          | 否                 | 否          | 是           | 能力主数据          |
| 能力型号审核（supplier-products） | 否          | 否                 | 否          | 是（Indep 入口） | 术语见 §9         |
| 需求/匹配/RFQ/报价/询价           | 否          | 否（同域不合并）          | 否          | 是           | 业务闭环各环节        |
| 用户管理 / 企业管理               | 否          | 否                 | 否          | 是           | <br />         |
| 内容/知识/标签                  | 否          | 否                 | 否          | 是           | 同内容资产体系        |
| 媒体管理                      | 否          | 可并入内容/知识（**可选择**） | 否          | 否/是（见 §9.5） | FileAsset 独立实体 |
| 数据分析/业务分析/运营监控            | 相互独立；两两边界细 | 运营监控可并入监控域        | 否          | 是           | 见 §9.6         |
| 审计智能 / 审计日志               | 否          | 否                 | 审计日志可留系统管理 | 是           | 见 §9.6         |
| 通知管理                      | 否          | —                 | —          | 是           | <br />         |
| AI 数据准备（embedding）        | 否          | —                 | —          | 是（FROZEN）   | 仅数据准备          |

***

## 8. 豆包方案映射（§6 / §1.4）

| 豆包分组           | 豆包项                        | 实际对应（存在？）                                                                         | 判定                                 |
| -------------- | -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------- |
| 首页（工作台，运营中心并入） | 工作台                        | `/home` + `/operation-center` 均存在                                                 | 豆包建议合并为「首页工作台」；实际为两页，见 §9.1        |
| 业务中心           | 需求/RFQ/能力询价/报价/匹配          | `/demands /rfqs /inquiries /offers /matching` 全部存在                                | ✔ 与豆包一致（豆包的「能力询价」即实际 `/inquiries`） |
| 能力主数据          | 能力/能力型号审核/能力分类/参数体系        | `/products /supplier-products /product-categories /parameter-*` 存在                | ✔ 实际「能力中心」= 豆包「能力主数据」的语义名差异        |
| 合作方管理          | 用户/企业                      | `/users /organizations` 存在                                                        | 术语「合作方」见 §9.4                      |
| 内容与知识库         | 内容/知识库/标签/媒体               | 内容/知识/标签存在；媒体 `/media` **实际为独立一级**                                                | 豆包将媒体并入「内容与知识库」→ 可选项               |
| 数据与监控          | 数据分析/业务分析/运营监控/审计智能/AI数据准备 | 全部存在（`/analytics /business-analytics /monitoring /audit-intelligence /embedding`） | ✔ 与豆包一致                            |
| 系统管理           | 通知/审计日志                    | `/notifications /audit-logs` 存在                                                   | 豆包将审计智能移出系统管理，与现状略异                |

**豆包结论**：与现状**骨架基本一致**；主要差异为「媒体降级为子项」「运营中心并入首页」「审计智能归数据」及术语「合作方管理 / 能力主数据」。**豆包未新增 Route/Page，可经纯菜单重组近似实现。**

***

## 9. DeepSeek 方案映射（§6 / §1.5）

| DeepSeek 分组  | DeepSeek 项                             | 实际存在？                             | 判定                                  |
| ------------ | -------------------------------------- | --------------------------------- | ----------------------------------- |
| 1 核心交易→供给管理  | 能力/能力型号审核/能力分类/参数体系                    | 存在                                | ❗顶层「核心交易」与 VISNDT 非交易定位冲突（§4.2 硬约束） |
| 1 核心交易→需求与交易 | 需求/RFQ/能力询价/报价/匹配                      | 存在                                | ❗同上                                 |
| 2 内容与知识库     | 内容/知识库/标签/媒体库                          | 内容缺「媒体库」独立项；媒体为 `/media`          | 术语差异                                |
| 3 用户与组织      | 用户/企业/**角色权限**                         | 用户/企业存在；**「角色权限」页面/后端管理 API 不存在** | ❗**不能新增**（§5.4）                     |
| 4 数据与智能      | 业务分析/数据分析/运营监控/审计智能/审计日志/通知/**AI数据准备** | 存在；AI数据准备=embedding（FROZEN）       | 分组可近似                               |
| 5 系统管理       | **通知模板配置/系统参数/操作日志**                   | **三者在 Admin 中均无对应页面/路由/API**      | ❗**不能当作已存在**（§4.7）                  |

**DeepSeek 结论**：框架合理但**含 3 类“能力不存在”项**（角色权限管理、通知模板配置、系统参数、AI 工具），且引入「核心交易」顶层语义。**若直接采纳会产生若干“有菜单无能力”的空壳入口。**

***

## 10. Three-Way IA 比较（§6.1 / §8-9 / C4）

| IA Area | Actual                            | Doubao        | DeepSeek    | Audit Judgment                         |
| ------- | --------------------------------- | ------------- | ----------- | -------------------------------------- |
| 首页/工作台  | `/home` + `/operation-center`（两页） | 合并为「工作台」      | 首页（工作台）     | 保留两页（合并需评估职责，见 §9.1）                   |
| 能力      | 能力中心（4项）                          | 能力主数据         | 供给管理        | 语义均合理；**能力中心**更贴合“运营操作心智”              |
| 业务      | 业务中心（5项）                          | 业务中心          | 核心交易/需求与交易  | **宜保留「业务中心」**；避免「交易」（§9.2）             |
| 用户/组织   | 用户与供应商（2项）                        | 合作方管理         | 用户与组织       | **推荐改为「用户与组织」**（修正 企业=供应商 误导，§9.4）     |
| 内容/知识   | 内容中心（内容/知识/标签）                    | 内容与知识库        | 内容与知识库      | 与现状一致，媒体归属待定                           |
| 媒体      | 媒体中心（一级）                          | 并入内容          | 并入内容        | 见 §9.5（**默认保留一级，可选并入**）                |
| 数据/监控   | 数据与分析（4项）                         | 数据与监控         | 数据与智能       | 归属一致                                   |
| AI      | 系统管理→AI数据准备                       | 数据与监控→AI数据准备  | 数据与智能→AI工具  | **AI 保持 FROZEN**，仅数据准备；不因名称推导新能力（§9.6） |
| 系统      | 系统管理（通知/审计日志/AI）                  | 系统管理（通知/审计日志） | 系统管理（含不存在项） | 仅保留存在项；**不新增空壳入口**                     |

***

## 11. Hidden Route / RBAC 风险（§8 / C5）

### 11.1 Route Regression（§8.1）

- 当前无 legacy route 别名与 redirect 依赖；**GD**。

- 若纯菜单重组不动 `/router/index.tsx` 的路由路径，则无路由回归。

- **风险（P2）**：`/rfq-responses/:id`、`/files/orphans` 为无菜单路由，改造若纳入菜单不影响现有路径。

### 11.2 RBAC Regression（§8.2）

- **P1**：前端细粒度 RBAC 未接线 + 后端仅 `Role.ADMIN` 粗粒度 → **Menu-guard ≠ Route-guard ≠ API-guard 三层不一致**。这并非本轮菜单改造所致，但任何“按角色隐藏菜单”的实现若只改前端菜单展示、而无后端对应强制，将制造「可见性假象」。

### 11.3 Active Menu Regression（§8.3）

- **P2（已存在缺陷）**：`selectedKeys={[location.pathname]}`，对详情/编辑路由（如 `/products/:id/edit`、`/demands/:id`）为完整路径，**无法匹配**任一菜单 key（key 均为列表级 `/products`、`/demands`）→ 进入详情页时侧栏高亮丢失。

- **P2（已存在缺陷）**：`openKeys` 初始仅 `['knowledge']`；深层链接到 `/parameter-groups`、`/knowledge/entries` 时，父级子菜单不会自动展开。

### 11.4 Breadcrumb / Page Title Regression（§8.4）

- `breadcrumbMap` 仅覆盖列表级路由；详情/编辑页（`/demands/:id`、`/products/:id/edit` 等）只落到父级标签，**无深层 crumb**。属可接受的现有精度，非阻塞。改造若移动菜单分组需同步 `breadcrumbMap` 文案。

### 11.5 Redirect Regression（§8.5）

- 未发现需维护的旧→新 redirect。**菜单重组不引入新的 redirect 需求。**

***

## 12. IA Architecture Findings（关键结论汇总）

1. **实际 IA 已贴近域模型，骨架健康**，无需架构级重构。
2. **两个候选方案不引入新 Route，只做分组/术语增量**——故“以豆包为基础优化”理论上可行，但**不应整体照搬**（交易语义 + 空壳入口问题）。
3. **「用户与供应商」命名存在域语义偏差**：`Organization` 可为 BUYER 亦可为 SUPPLIER，非恒等于 Supplier ；“用户与供应商”易造成 `Organization=Supplier` 错误认知 → 建议「用户与组织」或「合作方管理」。
4. **「能力型号审核」标签与域模型有轻微出入**：实际页面为 `SupplierProduct`（供应商持有商业产品）的平台审核，非通用“能力型号”。标签可保留（贴合审核心智），但需在文档中明确其对应 `SupplierProduct`。
5. **媒体归属**：`/media`（FileAsset）与 `/products/:productId/media`、内容/知识同属资产体系但为独立实体。默认建议**保留一级「媒体中心」**；若求精简可后续并入内容（**可选，非本轮必须**）。
6. **RBAC 接线空缺**是 IA 外最重要的架构一致性问题（§6.4），直接影响“角色权限”类后续菜单决策。
7. **审计智能 vs 审计日志**：两者皆存在且职责不同（风险画像 vs 明细日志）。“审计日志”留在系统管理合理（强治理属性）；“审计智能”归数据与监控亦合理。**维持现状即可。**

***

## 13. Implementation Feasibility（§10 / C7）

**改造类别判定**：以「是否可仅动菜单分组而达成目标」评估——**Class A（Menu-only）**。

- **必须**：`AdminLayout.tsx` 的 `menuGroups` 重组 + `breadcrumbMap` 文案同步 + 可选 Active-Menu 修正（`selectedKeys` 前缀匹配、`openKeys` 随路由同步）。

- **不需要**：Route 变更（`/router/index.tsx` 不动）、Page 重写、API 变更、Schema/迁移、权限变更（按条件保持）。

| 维度                        | 结论                         |
| ------------------------- | -------------------------- |
| Implementation Complexity | **LOW**（限于菜单配置 + 布局选中逻辑）   |
| Regression Risk           | **LOW**（路由/API/权限/页面不动）    |
| Route Migration Required  | **NO**                     |
| RBAC Change Required      | **NO**（本轮不动权限；RBAC 接线另立任务） |
| Page Refactor Required    | **NO**                     |
| API Change Required       | **NO**                     |
| Schema Change Required    | **NO**                     |

> 若未来要落实「按角色隐藏菜单」或「角色权限管理」，将升级为 **Class C（Menu+RBAC 变更）**，且需先补齐后端粗/细粒度权限——**不在本轮范围**。

***

## 14. Recommended Target IA（§12.2 / C6）

基于审计事实，推荐**当前实际 IA 的精修版**（而非整体照搬豆包/DeepSeek），作为 Decision Gate 输出（**本任务不实施**）：

```text
首页
  首页
  运营中心

能力中心
  能力管理          （/products）
  能力型号审核       （/supplier-products，SupplierProduct 审核流）
  能力分类          （/product-categories）
  参数体系
    参数组 / 参数定义

业务中心
  需求管理          （/demands）
  匹配管理          （/matching）
  RFQ 管理          （/rfqs）
  报价管理          （/offers）
  能力询价          （/inquiries）

用户与组织          ←（由“用户与供应商”更名，修正语义）
  用户管理          （/users）
  企业管理          （/organizations）

内容中心
  内容管理          （/content）
  知识库
    知识条目 / 知识领域 / 知识分类 / 知识分类映射
  标签管理          （/content/tags）

媒体中心
  媒体管理          （/media，可选并入内容中心）

数据与监控
  数据分析          （/analytics）
  业务分析          （/business-analytics）
  运营监控          （/monitoring）
  审计智能          （/audit-intelligence）

系统管理
  通知管理          （/notifications）
  审计日志          （/audit-logs）
  AI 数据准备       （/embedding，FROZEN）
```

> 与现状的差异均为**分组/标签/排序**，**零 Route 变更**。推荐业务中心内部的**建议排序**（需求→匹配→RFQ→报价→询价）贴合 Demand→Match→RFQ→Response→Offer→Inquiry 闭环，仅调整顺序，不涉及录入。

***

## 15. Migration Strategy（§12.3 / §10.1）

- **Phase 1 — Menu IA only（RECOMMENDED）**：重组 `AdminLayout.tsx` 的 `menuGroups`（按 §14），同步 `breadcrumbMap`，修正 Active Menu（`selectedKeys` 前缀匹配 + `openKeys` 随 `location` 展开）。**不动 route/page/api/permission。**

- **Phase 2 — Route / Permission reconciliation（NOT REQUIRED for IA goal = MENU-ONLY）**：本轮无需路由迁移；若未来引入 RBAC 接线/角色隐藏，需单独授权并先补齐后端权限。**标记 NOT REQUIRED（除非后续单独授权）。**

- **Phase 3 — Page consolidation（NOT REQUIRED）**：无强证据表明需合并页面；媒体并入内容为可选项，由独立决策，非本轮强制。**标记 NOT REQUIRED。**

***

## 16. Decision Gate（§11 / C8）

> **IMPLEMENTATION AUTHORIZED WITH CONDITIONS**

理由：当前实际 IA 已贴近域模型、骨架健康；两个候选方案仅提供分组/术语增量，且“以豆包为基础优化”可经\*\*纯菜单重组（Class A）\*\*低风险达成；Route/Page/API/Permission 均可保持不动。但存在若干非阻塞条件必须满足（+ 一个 RBAC 外部的已知 P1 一致性风险需另立任务处理）。

### 16.1 条件（Condition）

- **C1（命名边界）**：不得引入「交易 / 核心交易 / Marketplace / Store」作为顶层 IA 语义；保持 VISNDT 非交易/非商城定位。

- **C2（域语义）**：将「用户与供应商」更名（推荐「用户与组织」或「合作方管理」），消除 `Organization=Supplier` 误导；同步 `breadcrumbMap`。

- **C3（RBAC 边界）**：Phase 1 不得新增「角色权限」菜单，也不得按角色隐藏菜单——因后端无细粒度权限 API、前端 RBAC 未接线，任何此类改动须在补齐后端权限后另立任务。

- **C4（空壳禁止）**：不得新增无实际 Route/Page/API 的菜单项（DeepSeek 的「通知模板配置/系统参数/操作日志/角色权限/AI工具」均不落地）。

- **C5（改动范围）**：实施得到授权仅限「菜单分组重组 + 标签修正 + Active-Menu/面包屑适配」；**Route 路径、Page 组件、API、Permission、Schema 一律不得改动**；不得把本任务视作“顺手修复”其它问题。

### 16.2 Blocker（本轮不进入实施即无 blocker；实施须以单次、独立、明确小步提交为限）

**M39/主线的优先关系**：本任务是**非主线插入**的只读审计门；**不改变 M34.7 Buyer Workspace 主线的既定路线**，不得将 Admin IA 实施隐式并入 M34.7。任何实施须另立任务并在主线之外独立规划。

***

## 17. Conditions / Blocker（汇总）

- 见 §16.1（C1–C5）。

- **P1（非本轮阻塞，但必须记录）**：前端细粒度 RBAC 未接线 + 后端仅 `Role.ADMIN` 粗粒度 → Menu/Route/Page/API 权限三层不一致（§6.4）。应作为**独立后续治理项**（跨域权限接线或主动收敛），不在本菜单改造中处理。

***

## 18. Future Candidates（仅记录，不实施）

- **RBAC 管理 UI / 角色权限**：目前后端仅有粗粒度 `Role.ADMIN`；需先定义并落地后端角色-权限模型，再考虑管理界面。

- **跨属组权限接线**：将现有 `PERMISSIONS` 应用到菜单/路由门禁。

- **全站 Dashboard 统一 / 首页-运营中心合并**：当前两页职责不同，合并需产品决策。

- **媒体资产并入内容中心**：可选精简，需运营频率评估。

- **通知模板配置 / 系统参数 / 操作日志**：均无对应能力，未来若建设则归系统管理。

- **AI 工具集**：AI 保持 FROZEN，仅记录方向，不新增能力。

***

## 19. Out of Scope

- 不创建新的 Role/Permission 子系统；不建新 RBAC 系统。

- 不做 Admin Design System 改造、不做新 Dashboard、新数据分析/审计/内容/AI 系统。

- 不新增/删除 Route、Page、API、Schema、Migration。

- **不做任何“顺手修复”**（含 §11 中记录的 Active Menu 缺陷——该修正仅在**实施被授权后**并入 Phase 1，本只读审计阶段不落码）。

***

## 20. Final Status 与 Code/Documentation State（§13.1）

- **Code Change = NONE**；**Code State = unchanged**。

- **Documentation State = updated（新增本审计报告）**。

- **Audit-only Task；No implementation performed。**

***

## Final Review

| 项                          | 结果                                                              |
| -------------------------- | --------------------------------------------------------------- |
| Repository Verified        | **PASS**                                                        |
| Admin Menu Audited         | **PASS**（`AdminLayout.tsx` menuGroups 全量实核）                     |
| Route Mapping Audited      | **PASS**（`router/index.tsx` 全量实核）                               |
| Page Mapping Audited       | **PASS**（路由→页面→职责逐一映射）                                          |
| Permission Mapping Audited | **PASS**（前端声明层 + 后端 `RolesGuard` 实核）                            |
| RBAC Mapping Audited       | **PASS**（发现：前端细粒度 RBAC 未接线，后端粗粒度 `Role.ADMIN`）                  |
| IA Comparison Completed    | **PASS**（实际 vs 豆包 vs DeepSeek 三方对照）                             |
| Hidden Regression Audit    | **PASS**（识别 P2 级 Active-Menu/Breadcrumb 现有缺陷；P1 级 RBAC 不一致另立任务） |
| Implementation Feasibility | **LOW**（Class A Menu-only）                                      |
| Decision Gate              | **IMPLEMENTATION AUTHORIZED WITH CONDITIONS**（C1–C5）            |
| Final Status               | **COMPLETE**（只读审计；Code Change=NONE；未实施任何改动）                     |

