# 425 Project Global Status Calibration Report

## 1. 执行前检查

| 项目 | 结果 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| 执行模式 | `ONLY READ ANALYSIS + DOCUMENT GENERATION` |
| 冻结范围 | `apps/api`、`apps/web`、`apps/admin`、`database/prisma`、业务代码全部只读 |
| 本次允许输出 | `docs/project-management/*`、`docs/_review/425_*` |

## 2. 执行摘要

本次校准结论：

- VISNDT 当前处于 `C. 业务闭环完善阶段`
- 当前 M 阶段处于 `M15 技术债治理进行中`
- 项目没有发生路线级跑偏，M15 属于 M14 落地后的正常治理收口
- 当前真正缺的不是核心业务模块，而是：
  - M15 边界治理尚未完全结束
  - 内容管理体系尚未建立
  - 公开站到业务闭环的最后一跳仍不够稳定

## 3. 项目架构现状

### 3.1 Backend

`apps/api/src` 已形成完整业务域，不是骨架工程。真实模块覆盖：

- 身份与权限：`auth`、`users`、`organizations`、`organization-members`
- 产品主数据：`products`、`product-categories`、`parameter-groups`、`parameter-definitions`、`product-parameters`、`product-media`
- 供需主链：`demands`、`matching`、`rfqs`、`rfq-responses`、`offers`
- 协同治理：`notifications`、`workflow-events`、`workspace`、`inquiries`
- 平台运营：`admin`、`audit-log`
- 基础设施：`prisma`、`storage`、`health`

后端已具备：

- CRUD
- workflow transition
- workspace aggregate
- admin aggregate
- Prisma 数据模型支撑

### 3.2 Web

`apps/web/src/app` 已形成三层前端：

- Public Website：`/`、`/products`、`/products/[slug]`、`/categories`、`/about`、`/business`、`/knowledge`、`/solutions`
- Identity：`/login`、`/register`
- Business Workspace：`/dashboard/*`、`/workspace/*`

Buyer / Supplier 双侧业务页都已真实存在，不再是 M13 时期的 Buyer-only 判断。

### 3.3 Admin

`apps/admin` 不是遗留目录，而是成熟运营后台，当前路由覆盖：

- Users / Organizations
- Products / Product Media / Categories / Parameters
- Demands / Matching / RFQs / RFQ Responses / Offers
- Notifications / Inquiries / Audit Logs / File Assets
- Admin Home Dashboard

### 3.4 Database / Prisma

当前 Prisma Schema 已覆盖：

- 身份组织：`User`、`Organization`、`OrganizationMember`、`UserInvitation`、`RefreshToken`
- 产品主数据：`ProductCategory`、`Product`、`ProductMedia`、`ParameterGroup`、`ParameterDefinition`、`ParameterOption`、`ProductParameterValue`、`ProductParameterDefinition`
- 供需撮合主链：`Demand`、`DemandParameter`、`DemandMatch`、`RFQ`、`RFQResponse`、`Offer`
- 治理支撑：`WorkflowEvent`、`Notification`、`FileAsset`、`AuditLog`
- 补充业务：`Inquiry`

## 4. 当前开发阶段判断

### 结论

`当前阶段 = C. 业务闭环完善阶段`

### 理由

1. 不是 A 基础建设  
   后端、Web、Admin、Schema 都已成型。

2. 已经超过 B MVP  
   Buyer / Supplier Workspace、Dashboard、RFQ Response 决策链已真实落地。

3. 还没到 D 运营成熟  
   项目当前主要工作仍是 M15 治理收口，而不是内容运营、SEO 规模化、数据化增长。

## 5. M 阶段地图

| Stage | 当前校准结果 | 状态 |
| --- | --- | --- |
| `M0-M10` | 底座、主数据、供需主链、Admin 基础能力完成 | `DONE` |
| `M11` | 后端闭环与 Admin 运营主链完成 | `DONE` |
| `M12-M13` | 部署安全、Web MVP、公开站点与 Buyer 主链完成 | `DONE` |
| `M14` | Buyer / Supplier Domain Workspace 基本完成 | `MOSTLY_DONE` |
| `M15` | 技术债治理与边界收口进行中 | `IN_PROGRESS` |
| `M16` | 稳定化、公开询价链、SEO 与内容基座 | `PLANNED` |
| `M17+` | 内容管理与运营深化 | `PLANNED` |

## 6. 模块完成度

### 6.1 Backend

| 模块 | 状态 | 完成度 | 主要判断 |
| --- | --- | --- | --- |
| Auth | `DONE` | `90%` | 认证、安全、刷新链完整 |
| User | `DONE` | `90%` | Admin 管理与模型完整 |
| Organization | `DONE` | `90%` | 组织与成员体系完整 |
| Product | `DONE` | `90%` | 产品、媒体、参数展示完整 |
| Category | `DONE` | `90%` | 分类树与前后台联动存在 |
| Parameter | `DONE` | `88%` | 参数体系完整，但缺内容解释层 |
| Demand | `MOSTLY_DONE` | `88%` | Buyer 主链完整 |
| Matching | `MOSTLY_DONE` | `82%` | 能力存在，语义治理仍需继续 |
| RFQ | `MOSTLY_DONE` | `85%` | 生命周期与工作区入口完整 |
| RFQ Response | `MOSTLY_DONE` | `82%` | Supplier 响应与 Buyer 决策已落地 |
| Offer | `DONE` | `80%` | 主要作为协同域存在，不是公开售卖域 |
| Notification | `DONE` | `85%` | 通知链完整 |
| Workflow | `IN_PROGRESS` | `75%` | 仍有事件覆盖缺口待 M15 收口 |
| Inquiry | `PARTIAL` | `65%` | 模型/API/Admin 存在，公开链路未完全稳定 |
| Admin | `DONE` | `90%` | 平台运营后台完整 |

### 6.2 Frontend

| 模块 | 状态 | 完成度 | 主要判断 |
| --- | --- | --- | --- |
| Public Website | `MOSTLY_DONE` | `78%` | 展示页存在，但内容管理未建立 |
| Buyer Workspace | `MOSTLY_DONE` | `88%` | 主链完整，仍有边界治理项 |
| Supplier Workspace | `MOSTLY_DONE` | `82%` | 供应商响应链已形成 |
| Dashboard | `MOSTLY_DONE` | `85%` | Buyer / Supplier Dashboard 已存在 |

## 7. 内容管理规划

### 7.1 当前状态

当前已存在：

- 前台路由：`/knowledge`、`/solutions`
- 导航入口：Header / Footer 已挂载内容入口
- 基础 SEO：部分静态页面有 `metadata`

当前缺失：

- Prisma 内容模型
- 内容 API
- Admin 内容入口
- 内容详情页
- 内容搜索 / 标签 / 分页
- 参数解释与 Insight 体系
- 动态 SEO Metadata

### 7.2 关键判断

当前 VISNDT 的内容管理状态不是“已存在 CMS”，而是：

`已有内容展示壳，但没有内容管理系统。`

### 7.3 后续设计建议

建议后续按以下顺序建设：

1. `Knowledge`
2. `Article`
3. `Solution`
4. `Insight`
5. `Parameter Explanation`
6. `SEO Metadata`

其中 `Parameter Explanation` 建议基于现有 `ParameterDefinition` 做内容扩展，而不是另起一套无关体系。

## 8. 历史规划校准

### 8.1 是否偏离原规划

结论：`未发生路线级偏离`

原因：

- M13 之后路线从 Buyer MVP 转向 Buyer / Supplier 闭环，是合理演进
- M15 技术债治理是 M14 真正接线后的正常收口，不是返工性失控

### 8.2 是否存在重复建设

结论：`存在局部重复/兼容遗留，但不构成主路线偏移`

典型表现：

- Dashboard / Workspace 双入口兼容痕迹
- 前端 `service` 层与直接 `@/lib/api/*` 调用并存
- 公共内容侧有静态展示壳，但未进入统一内容域

### 8.3 是否存在过早开发

结论：`存在轻度过早铺设，但总体可控`

表现：

- `/knowledge`、`/solutions` 在没有 CMS 的前提下先行上线静态页面
- 公开内容导航早于内容管理后台落地

这类前置建设属于市场展示占位，并未造成架构级失控。

## 9. 当前风险

1. `M15 未完全结束`
   - WorkflowEvent 与 Mutation Boundary 仍是当前最高优先级风险。
2. `内容管理能力缺失`
   - 当前内容页无法运营化、搜索化、SEO 化。
3. `公开询价链路不稳定`
   - 产品详情存在 InquirySection 结构，但当前未形成完整公开询价数据链。
4. `前端分层尚未完全统一`
   - 当前仍可检出多处直接 `@/lib/api/*` 调用文件。
5. `兼容入口仍有心智成本`
   - Buyer / Supplier 的 Dashboard 与 Workspace 仍有历史兼容表达。

## 10. 下一阶段建议

### 建议结论

下一阶段应优先开发：

`M15 收口 -> M16 稳定化 -> M17 内容管理`

### 具体建议

1. 先完成 M15 剩余治理  
   不要在边界仍不稳定时继续扩功能。

2. 启动 M16 稳定化  
   重点处理公开询价、SEO、残余 service boundary、运行稳定性。

3. 启动 M17 内容管理最小闭环  
   优先做 Knowledge / Article / Solution / SEO Metadata，不要一次性做全 CMS 大而全。

## 11. 项目状态文件说明

本次已建立长期项目状态目录：`docs/project-management/`

包含：

- `PROJECT_STATUS.md`
- `PROJECT_ROADMAP.md`
- `MODULE_COMPLETION_MATRIX.md`
- `BUSINESS_CAPABILITY_MAP.md`
- `CONTENT_MANAGEMENT_PLAN.md`

后续规则：

以后所有代码开发任务结束后，必须同步校准上述文档，确保：

`代码状态 = 文档状态`

## 12. 事实采样证据

以下结论直接来自本次对代码库的事实采样，而非仅复述历史报告：

| 证据点 | 采样文件 | 事实 |
| --- | --- | --- |
| 公共内容页真实存在 | `apps/web/src/app/knowledge/page.tsx`、`apps/web/src/app/solutions/page.tsx` | 两个页面都存在，且声明了 `metadata` |
| 内容入口已挂到前台导航 | `apps/web/src/components/layout/PublicHeader.tsx`、`apps/web/src/components/layout/PublicFooter.tsx` | Header / Footer 都存在 `/knowledge`、`/solutions` 入口 |
| 内容管理后台尚未建立 | `apps/admin/src/router/index.tsx` | 当前路由覆盖产品、需求、RFQ、询价、审计等，但无 Content / Knowledge / SEO 管理入口 |
| 内容域 Prisma 模型缺失 | `database/prisma/schema.prisma` | 可检出 `DemandMatch`、`RFQResponse`、`WorkflowEvent`、`Inquiry`，但未检出 `Knowledge`、`Article`、`Solution`、`Insight`、`SeoMetadata` |
| 公开询价仍是结构预留 | `apps/web/src/app/products/[slug]/page.tsx`、`apps/web/src/components/products/InquiryForm.tsx` | 产品详情页挂载了 `InquirySection`，但表单仍保留 `offerId` / `organizationId` 的 fallback 占位逻辑 |
| 前端 service boundary 尚未完全统一 | `apps/web/src/app/**`、`apps/web/src/components/**` | 当前仍可检出多处直接 `@/lib/api/*` 调用 |

## 13. 影响说明

| 项目 | 结果 |
| --- | --- |
| 修改业务代码 | `否` |
| 数据库影响 | `无` |
| API 影响 | `无` |
| 架构影响 | `仅新增项目状态治理文档` |
| Build 结果 | `未执行（本次为只读分析 + 文档生成任务）` |

## 14. 最终结论

本次任务结论为：

`PASS`

VISNDT 当前已经不是“还在搭系统”的项目，而是“业务闭环已经形成、正在做工程治理和长期状态管理”的项目。下一步最重要的不是盲目扩功能，而是完成 M15 收口，并以 M16-M17 的顺序进入稳定化和内容体系建设。
