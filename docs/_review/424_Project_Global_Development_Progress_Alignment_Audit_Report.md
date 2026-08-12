# 424 Project Global Development Progress Alignment Audit Report

## 1. 执行前检查

### 1.1 Root / Branch 确认

| 项目 | 结果 |
| ---- | ---- |
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |

### 1.2 Git 状态记录

本次执行按 `ONLY READ ANALYSIS + REPORT GENERATION` 进行，仅记录当前状态。

| 命令 | 结果 |
| ---- | ---- |
| `git status --short` | 空输出，当前工作区为 clean |

### 1.3 审计范围说明

- 本次不修改源码、数据库、Prisma Schema、API、配置文件。
- 本次不执行格式化、不执行自动修复。
- 本次报告结论基于当前真实代码状态、`docs/_review` 历史报告链，以及当前目录结构交叉判断。

## 2. 执行摘要

当前 VISNDT 已经明显越过“基础架构建设”和“单纯 MVP 起步”阶段，实际处于`业务闭环完善阶段`。  
代码事实显示：后端核心域、Admin 运营端、Web 公共站点、Buyer Workspace、Supplier Workspace、通知、匹配、RFQ 与响应链路都已落地；M14 进一步把 Buyer / Supplier 的 Domain Workspace 补齐到了可运行状态；M15 的出现，不是路线跑偏，而是项目在进入下一阶段前，对 M14 暴露出的边界、治理与一致性问题做集中收口。

如果只看当前代码而不看旧计划，项目最接近的真实描述是：

`产品信息展示 + 需求撮合主链已成型，正在从“能跑”走向“能稳定扩展、能长期治理”。`

## 3. 项目整体架构扫描

### 3.1 apps/api 当前模块结构

当前 `apps/api/src` 下可见 `26` 个顶层模块、`26` 个 controller，已不是骨架状态，而是完整业务域服务。

核心模块可归类为：

| 类别 | 模块 |
| ---- | ---- |
| 基础设施 | `prisma`、`health`、`common`、`storage` |
| 身份与权限 | `auth`、`users`、`organizations`、`organization-members` |
| 产品主数据 | `product-categories`、`products`、`parameter-groups`、`parameter-definitions`、`product-parameters`、`product-media`、`file-asset` |
| 业务主链 | `demands`、`matching`、`rfqs`、`rfq-responses`、`offers`、`notifications`、`workflow-events`、`workspace`、`inquiries` |
| 平台运营 | `admin`、`audit-log` |

从 controller 暴露面看，后端已经具备：

- 标准 CRUD：用户、组织、产品、分类、参数、Demand、RFQ、Offer、Notification。
- 生命周期动作：`/demands/:id/publish`、`/demands/:id/close`、`/demands/:id/rematch`、`/rfqs/:id/publish`、`/rfqs/:id/close`、`/rfq-responses/:id/view|accept|reject`、`/offers/:id/submit|accept|reject|withdraw`。
- 聚合工作台：`/workspace/buyer/*`、`/workspace/supplier/*`。
- 平台运营：`/admin/stats`、`/admin/activities`、`/admin/pending`、`/admin/status`，以及 Inquiry / AuditLog 等运营接口。

判断：

- 后端模块数量：`高，且结构完整`
- 已完成业务模块：`身份、组织、产品、参数、Demand、Match、RFQ、RFQResponse、Notification、Inquiry、Admin、Workspace`
- API 完整程度：`高，已具备 CRUD + workflow transition + dashboard/workspace aggregate`
- 当前是否具备业务闭环能力：`是，但属于平台撮合型闭环，不是交易支付型闭环`

更准确地说，当前后端已经能支撑这条主流程：

`产品展示 -> 需求创建/发布 -> 匹配 -> RFQ -> 供应商响应 -> 买家决策 -> 通知回流`

### 3.2 apps/web 当前结构

当前 `apps/web/src/app` 下有 `29` 个 `page.tsx` 页面，已形成三层前端结构：

| 层级 | 当前事实 |
| ---- | ---- |
| 公共站点 | `/`、`/products`、`/products/[slug]`、`/categories`、`/about`、`/solutions`、`/knowledge`、`/business` |
| 身份入口 | `/login`、`/register` |
| 用户工作区 | `/dashboard`、`/dashboard/buyer`、`/dashboard/supplier`、`/workspace/*` |

当前 Workspace 已落地的真实页面包括：

- Buyer：`/workspace/demands`、`/workspace/demands/create`、`/workspace/demands/[id]`、`/workspace/demands/[id]/edit`
- Buyer：`/workspace/rfqs`、`/workspace/rfqs/create`、`/workspace/rfqs/[id]`
- Buyer：`/workspace/matches`
- 通用：`/workspace/notifications`、`/workspace/settings`
- Supplier：`/workspace/supplier`、`/workspace/supplier/rfqs`、`/workspace/supplier/rfqs/[id]`、`/workspace/supplier/responses`

Service 层结构已明确存在：

- `auth.service.ts`
- `category.service.ts`
- `demand.service.ts`
- `inquiry.service.ts`
- `match.service.ts`
- `notification.service.ts`
- `product.service.ts`
- `rfq.service.ts`
- `user.service.ts`
- `workspace.service.ts`

API wrapper 结构也已独立存在：

- `lib/api/categories.ts`
- `lib/api/demands.ts`
- `lib/api/inquiries.ts`
- `lib/api/notifications.ts`
- `lib/api/organizations.ts`
- `lib/api/products.ts`
- `lib/api/rfqs.ts`
- `lib/api/workspace.ts`

判断：

- 页面体系：`公共内容 + 身份认证 + Buyer/Supplier Workspace + Dashboard` 已成型
- Workspace 功能：`已不是壳子，已承接需求、RFQ、匹配、通知、设置、Supplier 响应`
- Service 层结构：`已建立，并在 M15 持续做边界规范化`
- API wrapper 结构：`已稳定`
- 用户端功能完成情况：`公共产品浏览完整，Buyer 主链完整，Supplier 响应链已形成，仍存在少量兼容性入口与分层历史包袱`

补充判断：

- 当前前端不是“只有 Buyer 页面”，而是 Buyer / Supplier 双侧都已具备实用工作台。
- 当前前端也不是“纯展示站点”，因为 Workspace 已承接业务变异。
- 但它也还不是“运营准备完成”的状态，因为边界治理、事件一致性和闭环验证仍在 M15 处理中。

### 3.3 apps/admin 当前结构

`apps/admin` 仍是当前项目的重要组成部分，不是废弃目录。  
实际可见 `47` 个页面级路由声明，覆盖：

- Dashboard / Home
- Users / Organizations
- Products / Product Media / Product Categories
- Demands / Match Detail / Matching Monitor
- RFQs / RFQ Responses / Offers
- Notifications
- Inquiries
- Parameter Groups / Parameter Definitions
- FileAsset Orphans
- Audit Logs

这说明平台并非只做了用户侧 Web，运营后台同样是成熟资产。  
因此当前项目整体更像“双前端协同”：

- `apps/web` 负责公开站点 + 用户工作区
- `apps/admin` 负责平台运营与主数据管理

### 3.4 Database / Prisma

当前 `database/prisma/schema.prisma` 中可见 `24` 个模型，覆盖度很高：

| 域 | 模型 |
| ---- | ---- |
| 身份与组织 | `User`、`RefreshToken`、`Organization`、`UserInvitation`、`OrganizationMember` |
| 产品主数据 | `ProductCategory`、`Product`、`ProductMedia`、`ParameterGroup`、`ParameterDefinition`、`ParameterOption`、`ProductParameterValue`、`ProductParameterDefinition` |
| 供需主链 | `Offer`、`Demand`、`DemandParameter`、`DemandMatch`、`RFQ`、`RFQResponse` |
| 治理与通知 | `WorkflowEvent`、`Notification`、`FileAsset`、`AuditLog` |
| 补充业务 | `Inquiry` |

当前核心数据模型支持的业务对象已经包括：

- 用户 / 组织 / 组织成员 / 邀请
- 产品 / 分类 / 参数模板 / 参数值 / 产品媒体
- Demand / Match / RFQ / RFQResponse / Offer
- WorkflowEvent / Notification / AuditLog / FileAsset / Inquiry

对“是否存在未使用模型”的判断：

- `RefreshToken`：被 `auth.service.ts` 与 `refresh-token.service.ts` 实际使用
- `UserInvitation`：被邀请与注册链路使用
- `FileAsset`：被 `file-asset`、`product-media` 与 Admin Orphan 清理实际使用
- `AuditLog`：有独立 Admin 查询接口和页面
- `Inquiry`：有 Web 提交、Admin 管理、后端查询
- `WorkflowEvent`：多条生命周期路径已实际写入

结论：

`当前 Schema 没有出现“明显完全孤立、纯占位未落地”的核心模型。`

真正的问题不是“模型没用”，而是：

- 某些治理型模型主要在后台或服务层使用，前台可见度较低
- WorkflowEvent / 生命周期语义在 M14 审计中发现仍有一致性缺口

### 3.5 docs/_review 证据链判断

本次重点参考的历史结论可以概括为：

| 证据链 | 反映的事实 |
| ---- | ---- |
| M11 (`147` / `165`) | 后端主域与 Admin 运营端在 M11 已形成完整业务能力，系统闭环在后端和 Admin 维度已经成立 |
| M13 (`245` / `265` / `297` / `300`) | 商业模型已从“店铺化风险”回正到“工业检测设备信息平台 + 需求撮合平台”；Web MVP、公开站点、Buyer 侧能力和系统验证完成 |
| M14 (`366` / `402` / `406`) | Workspace 从路由壳子演进为 Domain Workspace，Supplier 工作台与 Buyer Domain Flow 基本补齐，但暴露出服务边界、访问边界、事件一致性、Mutation Boundary 风险 |
| M15 (`415` / `417` / `424_M15.1.8`) | 当前阶段的主任务不是继续铺功能，而是把 M14 暴露出的技术债系统化治理；TD-006 与 TD-001 已进入落地收口 |

## 4. M0-M15 阶段地图

| 阶段 | 主要目标 | 已完成内容 | 完成度 | 当前状态 |
| ---- | ---- | ---- | ---- | ---- |
| M0-M10 | 搭建工程底座与核心业务域 | NestJS + Prisma + PostgreSQL 底座；身份认证；组织与权限；产品/分类/参数；Demand/Match/RFQ/Offer/Notification/Admin 基础能力 | 100% | 已完成，作为当前系统基座 |
| M11 | 完成后端闭环与 Admin 运营主链 | M11 报告确认 Backend API、Admin Frontend、Workflow E2E 均通过；业务能力矩阵 10/10 PASS | 100% | 已完成 |
| M12-M13 | 完成部署安全、Web MVP 与商业模型对齐 | Docker/CI/CD/安全加固；公开站点；产品浏览；登录注册；Buyer Dashboard/Workspace；Inquiry、文件、媒体、Admin 增强；M13.9 系统验证 | 100% | 已完成并冻结为后续前端基线 |
| M14 | 补齐 Domain Workspace 与 Supplier 侧业务闭环 | Buyer/Supplier Dashboard；Supplier RFQ 列表、详情、响应；Buyer RFQ/Match/Notification/编辑流；Workspace 路由归属与领域边界收口 | 90% | 基本完成，但以 PASS WITH RISKS 收口 |
| M15 | 治理 M14 暴露出的技术债与边界风险 | 技术债登记簿建立；治理顺序确定；TD-006 页面入口鉴权加固已落地；TD-001 Workspace service boundary 已进入闭合状态 | 35% | 进行中 |
| M16+ | 在治理完成后进入业务深化与运营稳定化 | 尚未正式开始 | 0% | 待启动 |

## 5. 核心业务模块完成度

| 功能模块 | 当前状态 | 完成程度 | 缺口 |
| ---- | ---- | ---- | ---- |
| 用户认证 | 登录、注册、JWT、Refresh Token、CSRF、Guard、RBAC 已落地 | 90% | 主要剩余是长期治理与真实运营验证，不是基础缺失 |
| 产品中心 | 产品列表、详情、分类过滤、参数展示、媒体、后台管理已落地 | 90% | 更偏运营质量、数据质量与搜索优化，不是结构缺失 |
| 分类体系 | 分类模型、后台管理、前台分类页、产品挂接已落地 | 90% | 主要是内容完备度和长期运营维护 |
| Demand需求 | Buyer 创建、列表、详情、编辑、发布、关闭、参数与匹配联动已落地 | 88% | 生命周期一致性与少量边界治理仍需收口 |
| Match匹配 | 匹配引擎、DemandMatch、查看、状态更新、重新匹配已落地 | 80% | WorkflowEvent 主体一致性、审计语义与边界仍有治理项 |
| RFQ询价 | 创建、列表、详情、发布、关闭、Supplier 查看与响应、Buyer 决策已落地 | 82% | RFQ create 旧路径事件覆盖、部分生命周期一致性仍需治理 |
| Notification通知 | 后端通知、未读数、列表、已读、批量已读、Workspace 通知页已落地 | 85% | 主要缺口在一致性治理与运行态验证 |
| Workspace | Buyer/Supplier 工作区、Dashboard、Sidebar、Settings、Notification、Domain 页面均已存在 | 85% | 仍有兼容入口、历史分层包袱和治理型技术债 |
| Supplier相关能力 | Supplier 仪表盘、RFQ 列表、详情、响应列表、响应提交已形成主链 | 78% | 按平台定位，Supplier 能力以撮合响应为主；不是独立商城，仍需闭环验证与表达收口 |
| Admin运营能力 | 用户、组织、产品、Demand、Match、RFQ、Offer、Inquiry、Category、Parameter、FileAsset、AuditLog 均有页面与 API | 90% | 更偏运营效率、数据治理与审计深度，不是能力空白 |

## 6. 当前项目真实阶段判断

### 结论

当前 VISNDT 更接近：

`C. 业务闭环完善阶段`

### 理由

1. `不是 A 基础架构建设阶段`
   - 代码里已经不是 skeleton。后端有 26 个模块、26 个 controller、24 个数据模型；Web 与 Admin 都是成体系应用。

2. `已经超过 B MVP 功能建设阶段`
   - M13 已完成 Web MVP、Buyer 工作区、公开站点和系统验证；M14 进一步补齐 Supplier 侧工作台与 Domain Workspace。

3. `还没到 D 产品运营准备阶段`
   - 当前还在做 M15 Technical Debt Governance，说明项目重心仍是边界正确性、治理一致性与扩展前收口，而不是正式转向运营规模化。

4. `最贴近现实的描述是“闭环已具雏形，治理正在补最后一层地基”`
   - 产品展示、Demand、Match、RFQ、Supplier 响应、Buyer 决策、通知回流都已落地。
   - 但 M14 审计明确暴露出 WorkflowEvent、服务边界、访问边界、Mutation Boundary 等问题，说明项目进入了闭环完善而非全新功能起步阶段。

## 7. M15 阶段定位分析

### 7.1 为什么当前进入 M15 Technical Debt Governance

因为 M14 把 Workspace 与 Domain Flow 真正跑起来后，项目暴露出的不再是“有没有页面/接口”，而是“边界是否稳定、一致性是否足够支撑后续扩展”。

M15 之所以存在，根因不是缺功能，而是 M14 的真实业务接线把以下问题显性化了：

- `TD-006`：页面入口层访问边界不足，存在未授权内容组件先挂载的风险
- `TD-001`：Workspace 前端 service boundary 不统一，页面直接绑底层 API wrapper 的历史包袱影响扩展纪律
- `TD-002` / `TD-004`：WorkflowEvent 覆盖与主体表达不完全一致
- `TD-005`：Generic Mutation Boundary 可能削弱专用 workflow transition 边界

换句话说：

`M15 不是为了“补一个新业务模块”，而是为了避免项目带着 M14 的历史偏差继续扩张。`

### 7.2 M15 属于哪一种

本次判断：

`M15 = 架构成熟后的正常治理阶段`

补充说明：

- 它当然带有对 M14 风险的“阶段性修正”性质；
- 但它不是偏离原规划后的被动救火；
- 它更像项目从 MVP / 闭环建设转入工程化治理时必然出现的一次收口阶段。

从历史证据看，M15 与既有路线是连续的：

- M13 解决的是`商业模型是否跑偏`
- M14 解决的是`Buyer/Supplier Workspace 是否真的接上业务主链`
- M15 解决的是`这条主链能否以正确边界长期维持`

因此，M15 的出现是合理的，而且是必要的。

### 7.3 M15 完成后是否具备进入业务深化阶段

判断：

`具备，但前提是 M15 必须完成到“治理闭环成立”，而不是只做一半。`

当前可以看到：

- `TD-006` 已实装
- `TD-001` 已基本闭合
- 但 `TD-002 / TD-005 / TD-004` 仍代表后端事件一致性与生命周期边界的治理任务

所以更准确的表述应是：

`M15 完成后，VISNDT 才适合进入 M16 的业务深化与运营稳定化阶段。`

## 8. 当前开发方向是否偏离最初规划

### 结论

`当前实际开发方向没有发生实质性偏离，但历史上出现过阶段性偏移，且已被纠正。`

### 事实判断

1. `早期确实存在过度规划倾向`
   - `05_MVP_Definition_Review.md` 已指出：项目最初的问题不是能力不足，而是“全平台蓝图倾向强、第一阶段边界不够收敛”。

2. `M13.4 曾出现过供应商店铺化方向风险`
   - `243_Business_Model_Alignment_Audit_Report.md` 明确指出过 `/suppliers`、Supplier Portal 等店铺化倾向。

3. `该偏移在规划层已被纠正，并在现代码中基本落实`
   - `245_M13.4.0.2_Business_Model_Final_Alignment_Report.md` 将项目重新冻结为：
     `工业检测设备产品信息平台 + 需求撮合平台`
   - 当前代码中也没有独立 Supplier Store、公开价格、支付交易链路。

4. `当前代码方向与原定位整体一致`
   - 公共入口围绕产品、分类、解决方案、知识、合作入口
   - 用户端围绕 Demand / Match / RFQ / Response
   - Supplier 不是独立商城，而是撮合链路中的响应方

### 因此结论

- `方向未偏离`
- `但文档与治理层面存在历史惯性，需要持续校准`

最典型的例子是：

- 商业模型已经校正
- 但仍保留兼容入口、旧分层路径、过时文档（如 README 仍写着 `Repository Skeleton Only`）

这说明项目的主要问题不是战略跑偏，而是“真实代码进度已经超过部分静态文档表达”。

## 9. 未来路线建议

以下建议以`不新增未经批准功能`为前提，只基于当前实际状态做阶段建议。

### 9.1 M16

**目标：**  
从“治理中项目”进入“闭环可稳定验证项目”。

**主要任务：**

- 完成 M15 剩余治理项，尤其是 WorkflowEvent Completeness 与 Mutation Boundary 收口
- 对现有 Buyer -> Match -> RFQ -> Supplier Response -> Buyer Decision 主链做统一 Golden Path 验证
- 清理兼容表达与阶段性残留文档，使代码事实、导航表达、报告结论一致
- 以真实账号与角色场景补齐运行态回归证据

**预计解决问题：**

- 解决“功能已存在但边界不够稳”的问题
- 解决“可以开发，但不适合继续无约束扩张”的问题
- 为后续业务深化建立可信基线

### 9.2 M17

**目标：**  
在既有定位下提升平台运营闭环与业务使用稳定性。

**主要任务：**

- 以现有 Admin + Workspace 能力为中心，强化运营流程的一致性与可追踪性
- 完善 Inquiry、Notification、AuditLog、FileAsset 等运营辅助链路的协同验证
- 继续围绕现有产品中心、Demand、RFQ、Match 做非交易型业务闭环优化
- 收敛仍然存在的重复表达、重复入口和认知分叉

**预计解决问题：**

- 解决“业务能跑但运维视角不够顺”的问题
- 让平台从工程完成态更接近可持续运营态

### 9.3 M18+

**目标：**  
在主业务闭环稳定后，进入优化与差异化增强阶段。

**主要任务：**

- 优化搜索、匹配质量、参数体系与内容质量
- 评估性能、可观测性、数据质量与运营分析能力
- 仅在主链稳定后，再考虑更高阶的智能化增强

**预计解决问题：**

- 解决“平台能用但还不够高效/高质量”的问题
- 在不改变“工业检测设备信息平台 + 需求撮合平台”定位的前提下提升平台竞争力

## 10. 风险检查

### 10.1 当前是否存在开发方向漂移

`不存在实质性漂移。`

说明：

- 历史上出现过 Supplier 店铺化表达风险，但已被 M13.4 对齐审计纠正。
- 当前代码仍遵守“信息发布展示 + 平台撮合模式”，未出现交易支付、公开价格、独立商城化落地。

### 10.2 是否存在重复建设

`存在轻中度重复表达，但不是大规模重复造轮子。`

主要体现在：

- Dashboard 与 Workspace 的双入口历史
- Supplier 兼容性入口仍保留
- Service 层治理是在修复历史直连 API wrapper 的重复接线方式
- 部分文档已落后于代码现实

这类问题更像“架构表达重复”，不是“新增了两套业务系统”。

### 10.3 是否存在过早开发问题

`历史上存在过早规划，当前阶段主要不是继续过早开发，而是需要收口。`

证据：

- 早期 Blueprint 曾有明显“全平台蓝图先行”倾向
- 当前代码现实说明很多基础能力确实已经做出来了
- 因此此刻最大的风险不是“做得太少”，而是“在治理未收口前继续扩功能”

### 10.4 当前应继续开发功能，还是先完善业务闭环

`应先完善业务闭环与治理闭环，再决定下一轮功能深化。`

原因：

- M15 仍在进行中
- 当前问题集中在边界正确性、事件一致性、生命周期治理，而不是主链不存在
- 若此时继续外扩功能，容易把 M14 暴露的问题复制到更多页面和流程中

## 11. 架构成熟度判断

### 11.1 当前成熟度

| 维度 | 判断 |
| ---- | ---- |
| 技术架构成熟度 | 高 |
| 业务主链完整度 | 中高 |
| 前端边界稳定度 | 中 |
| 生命周期治理成熟度 | 中 |
| 运营准备度 | 中低 |

### 11.2 总体判断

当前 VISNDT 的真实状态不是“还没做完 MVP”，而是：

`核心架构已成熟，主业务链已成形，但工程治理与闭环稳定性仍需 M15 收口。`

## 12. 最终结论

### 12.1 当前项目阶段判断

VISNDT 当前最接近：

`C. 业务闭环完善阶段`

### 12.2 M15 的真实定位

M15 不是路线偏离，也不是临时拼补；它是项目在 M14 完成业务接线后，进入下一阶段前必须经历的正常治理阶段。

### 12.3 与原规划一致性判断

当前代码事实与“工业检测设备信息平台 + 需求撮合平台”的原始定位总体一致。  
曾经出现的店铺化和过度规划风险，已在 M13-M14 之间被大体纠正。当前主要任务不是换方向，而是把现有方向收紧、做稳。

### 12.4 对下一阶段的建议

M16 不应直接理解为“大规模新功能开发”。  
更合理的进入方式是：

`先完成 M15 治理闭环 -> 再进入业务深化与运营稳定化。`

## 13. 最终状态

`PASS`

---

## 附：本次报告使用的关键事实来源

- 当前代码目录：`apps/api`、`apps/web`、`apps/admin`、`database/prisma/schema.prisma`
- 当前结构事实：
  - `apps/api/src` 顶层模块 `26`
  - backend controller `26`
  - Prisma model `24`
  - `apps/web/src/app` 页面 `29`
  - `apps/admin` 路由声明 `47`
- 关键报告链：
  - `147_M11.0_Architecture_Review.md`
  - `165_M11.3.4_System_Closeout_Report.md`
  - `245_M13.4.0.2_Business_Model_Final_Alignment_Report.md`
  - `265_M13.4_Final_Audit_Report.md`
  - `297_M13.9.2_Web_MVP_Baseline_Report.md`
  - `300_M13.9.3_System_Verification_Report.md`
  - `366_M14.2_Workspace_Release_Snapshot_Audit_Report.md`
  - `402_M14.6.0_Domain_Workspace_Integration_Architecture_Audit_Report.md`
  - `406_M14.6.2.0_Domain_Workflow_Boundary_Review_Report.md`
  - `415_M15.0_Technical_Debt_Governance_Planning_Report.md`
  - `417_M15.1.1_TD006_Frontend_Access_Boundary_Hardening_Report.md`
  - `424_M15.1.8_TD001_Final_Source_Closure_Verification_Report.md`
