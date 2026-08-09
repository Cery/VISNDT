# 301_M14_Pre_Development_Audit_Report

**日期**: 2026-08-08  
**审查角色**: VISNDT 项目架构审查工程师  
**审查模式**: 代码事实审查 / 不执行开发 / 不修改业务代码  
**代码根目录**: `F:\Desktop\VISNDT\VISNDT`  
**文档根目录**: `F:\Desktop\VISNDT\docs`  
**当前分支**: `main`

---

## 0. 审查结论总览

### 0.1 M14 开发前真实基线

当前仓库**不是“原始 M13.9 Freeze 静态快照”**，而是：

`M13.9 Web MVP Freeze`  
`+ M13.9 后验证修补`  
`+ 2026-08-07 / 2026-08-08 数据层补丁迁移`

因此，M14 的真实起点应定义为：

> **Buyer MVP 已完成，Admin 运维骨架已完成，Supplier Web 入口缺失，内容中心缺失，数据库已进入 Freeze 后补丁态。**

### 0.2 当前平台真实状态

技术闭环现状：

`Buyer 用户 -> Demand -> Match -> RFQ` 可走通  
`RFQ -> Supplier Web 响应 -> Buyer 决策` 在 Web 端未闭环  

商业闭环现状：

- Buyer 侧 MVP 已成立
- Supplier 侧可用能力主要停留在 `API + Admin`
- 平台尚未形成“供应商持续入驻理由 + 内容沉淀 + SEO 内容资产 + 自动运营体系”

### 0.3 核心判断

M14 不应从“再做一轮 Buyer 页面”开始，而应从以下四个方向开始：

1. 建立 **Supplier 平台内工作台**，不是独立商城  
2. 建立 **RFQ Response 真正入口**，补齐 Buyer-Supplier 闭环  
3. 建立 **内容中心 / 知识库 / SEO 资产层**  
4. 重新定义 **M13.9 之后的新冻结基线**，承认数据库已发生后续漂移

---

## 1. 项目当前真实状态

### 1.1 根目录与结构确认

已确认 `F:\Desktop\VISNDT\VISNDT` 存在并包含：

```text
apps/
  api/
  admin/
  web/
database/
packages/
docs/
```

### 1.2 当前资产规模

| 维度 | 当前事实 |
|---|---|
| `apps/web` | 20 个页面 route，43 个组件，7 个 service |
| `apps/api` | AppModule 导入 25 个业务/基础模块，约 20+ controller |
| `apps/admin` | 44 个页面文件，已形成管理端主路由体系 |
| `database/prisma` | 24 个 model，16 个 enum，19 个 migration |
| `docs/_review` | 323 份报告/过程文档 |

### 1.3 Freeze 偏差

`database/prisma/migrations` 中存在以下 **Freeze 后新增迁移**：

- `20260807000000_add_audit_log_ip_address`
- `20260807074423_add_offer_price_currency`
- `20260808031506_add_offer_created_by`
- `20260808051535_add_product_created_by`

结论：

> 当前数据库基线已经晚于 `2026-08-04` 的 M13.9 Freeze 文档结论。  
> M14 设计必须以“当前 schema.prisma + 当前 migration 目录”为准，不能只以 296/297/299/300 报告为准。

---

## 2. 技术资产清单

### 2.1 `apps/web` 现状

#### Route 基线

| 路由 | 作用 | 主要组件 | API 依赖 |
|---|---|---|---|
| `/` | 首页/引流页 | `HeroSection`, `FeaturedProductsSection`, `CategorySection` | 产品/分类公开接口 |
| `/about` `/business` `/knowledge` `/solutions` | 静态内容页 | 公共布局组件 | 无动态依赖 |
| `/products` | 产品列表 | `SearchBar`, `ProductFilter`, `ProductGrid`, `Pagination` | `getProducts`, `getCategories` |
| `/products/[slug]` | 产品详情 | `ProductGallery`, `ProductParameters`, `ManufacturerInfo`, `InquirySection` | `getProduct` |
| `/login` | 登录 | 表单页 | `/auth/login` |
| `/register` | 注册 | 表单页 | `/auth/register` |
| `/dashboard` | 用户仪表盘 | `StatCard` | `getDemands`, `getMyInquiries`, `getUnreadCount` |
| `/workspace` | Buyer 工作台总览 | `DemandCard`, `RFQCard`, `WorkspaceEmpty` | `getDemands`, `getRfqs` |
| `/workspace/demands` | 需求列表 | `DemandList` | `getDemands` |
| `/workspace/demands/create` | 发布需求 | 工作台布局组件 | `createDemand` |
| `/workspace/demands/[id]` | 需求详情 | `DemandDetail` | `getDemand`, `getDemandMatches` |
| `/workspace/matches` | 匹配结果 | `MatchList`, `MatchCard` | `getAllMatches`, `updateMatchStatus`, `rematchDemand` |
| `/workspace/rfqs` | RFQ 列表 | `RFQList` | `getRfqs` |
| `/workspace/rfqs/create` | 创建 RFQ | 工作台布局组件 | `getMyDemands`, `createRfq` |
| `/workspace/rfqs/[id]` | RFQ 详情 | `RFQDetail`, `RFQResponseList` | `getRfq`, `getRfqResponses`, `publishRfq`, `closeRfq`, `deleteRfq` |
| `/workspace/settings` | 账户设置 | 工作台布局组件 | Auth 上下文 |

#### Buyer 用户流程现状

| 流程 | 当前状态 | 结论 |
|---|---|---|
| 注册 | 已实现，但要求 `inviteToken` | 不是公开注册 |
| 登录 | 已实现 | 可用 |
| 产品浏览 | 已实现 | 可用 |
| 需求发布 | 已实现 | 可用 |
| 匹配查看/处理 | 已实现 | 可用 |
| RFQ 创建/查看 | 已实现 | 可用 |
| 公共询价 | 后端有能力，前端详情页实际禁用 | **未真正可用** |

#### Web 真实问题

1. 产品详情页将 `InquirySection` 传入 `organization={null}`、`offerId` 缺失，导致公开询价实际显示“暂不可用”。
2. `WorkspaceSidebar` 提供 `/workspace/notifications` 菜单，但代码库不存在对应页面。
3. `workspace/rfqs/[id]` 提供“编辑”按钮，但不存在 `/workspace/rfqs/[id]/edit` 路由。
4. `workspace/demands` 与 `workspace/rfqs` 搜索框只保存输入，不参与查询条件，属于未接线状态。

#### Web 结论

`apps/web` 已完成 Buyer MVP，但还不是完整的平台 Web：

- 有 Buyer 工作流
- 无 Supplier 工作流
- 无内容中心
- 无通知中心
- 无真正可用的公共询价入口

---

### 2.2 `apps/api` 现状

#### 模块清单

当前可确认模块包括：

- `AuthModule`
- `UsersModule`
- `OrganizationsModule`
- `OrganizationMembersModule`
- `ProductsModule`
- `ProductCategoriesModule`
- `ProductParametersModule`
- `ProductMediaModule`
- `ParameterGroupsModule`
- `ParameterDefinitionsModule`
- `OffersModule`
- `DemandsModule`
- `MatchingModule`
- `RfqsModule`
- `RfqResponsesModule`
- `NotificationsModule`
- `InquiriesModule`
- `WorkflowEventsModule`
- `AuditLogModule`
- `FileAssetModule`
- `StorageModule`
- `AdminModule`
- `HealthModule`
- `PrismaModule`
- `SecurityModule / CsrfModule`

#### 主要 API 路由基线

| 域 | 基线路由 |
|---|---|
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/csrf`, `/auth/invitations` |
| User / Org | `/users`, `/organizations`, `/organizations/:id/members` |
| Product | `/products`, `/products/:productId/media`, `/products/:id/parameters`, `/product-categories` |
| Parameter | `/parameter-groups`, `/parameter-definitions` |
| Demand | `/demands`, `/demands/my`, `/demands/mine`, `/demands/:id/publish`, `/demands/:id/close`, `/demands/:id/rematch`, `/demands/:id/matches` |
| RFQ | `/rfqs`, `/rfqs/mine`, `/rfqs/:id/publish`, `/rfqs/:id/close` |
| RFQ Response | `/rfqs/:id/responses`, `/rfq-responses/mine`, `/rfq-responses/:id` |
| Offer | `/offers`, `/offers/:id/submit`, `/offers/:id/accept`, `/offers/:id/reject`, `/offers/:id/withdraw` |
| Notification | `/notifications`, `/notifications/unread-count`, `/notifications/:id/read`, `/notifications/read-all` |
| Inquiry | `/inquiries`, `/inquiries/mine` |
| File | `/files/upload`, `/files/orphans`, `/files/:id/download` |
| Workflow | `/workflow-events` |
| Admin | `/admin/dashboard/*`, `/admin/demands`, `/admin/matching/stats`, `/admin/inquiries`, `/admin/audit-logs` |
| Health | `/health` |

#### 已有但未形成 Web 闭环的能力

| 能力 | 后端状态 | Admin 状态 | Web 状态 | 判断 |
|---|---|---|---|---|
| Offer | 已完成 CRUD + 生命周期 | 列表/详情已接入 | 无 Supplier Web 入口 | 已有能力，缺入口 |
| RFQResponse | 已完成创建/更新/查询 | 详情已接入 | Buyer 仅只读查看，Supplier 无提交页 | 已有能力，缺入口 |
| Organization | 完整存在 | 已管理 | Web 无组织管理/组织主页 | 已有能力，缺入口 |
| Notification | 完整存在 | 已列表/详情 | Web 只有未读数，无通知中心页 | 已有能力，缺入口 |
| AuditLog | 写入服务 + Admin 查询存在 | 已列表 | Web 无入口 | 运维能力，不对外 |
| Matching | 算法、重匹配、评分存在 | 监控页存在 | Buyer 可看结果，但无聚合专用 API | 已有能力，入口粗糙 |

#### API 结论

`apps/api` 的问题不是“能力不够”，而是：

- Supplier 相关能力主要停留在 API 层
- 多个域只被 Admin 消费，未被 Web 正式产品化
- 当前 M14 应优先做入口设计，而不是继续扩模型

---

### 2.3 `apps/admin` 现状

#### 已有后台页面/能力

已落地的后台能力主要包括：

- Dashboard
- 产品管理
- 产品媒体管理
- 需求管理
- 匹配监控 / Match 详情
- 用户管理
- 组织管理
- RFQ 管理
- RFQ Response 详情
- 报价管理
- 询价管理
- 参数组管理
- 参数定义管理
- 分类管理
- 文件孤儿清理
- 通知管理
- 审计日志

#### 未完全实现或不完整模块

| 模块 | 当前现状 |
|---|---|
| Offer | 只有列表/详情，无 create/edit 路由 |
| Notification | 只有列表/详情，无 create/edit 路由 |
| RFQResponse | 只有详情，无列表总入口 |
| AuditLog | 只有列表，无详情页 |
| Placeholder | 占位页存在，但未挂载正式路由 |

#### Admin 结论

`apps/admin` 已能支撑运营与数据管理，但更偏“内部控制台”，不是 Supplier 运营前台。  
M14 不需要再把 Supplier 做进 Admin，而应做进 `apps/web` 的平台内工作台。

---

## 3. 数据资产清单

### 3.1 核心模型使用状态

| 模型 | 当前使用 | 入口情况 | 结论 |
|---|---|---|---|
| `User` | Auth/Admin/Notification/Audit 全部使用 | 充分 | 已使用 |
| `Organization` | Auth/Admin/Inquiry/Offer/RFQResponse 使用 | Web 入口弱 | 已使用但缺前台表达 |
| `Product` | Public Web + Admin + Matching 使用 | 充分 | 已使用 |
| `Offer` | API/Admin/Matching 使用 | Supplier Web 无 | 已使用但缺入口 |
| `Demand` | Buyer Web + Admin + Matching 使用 | 充分 | 已使用 |
| `DemandMatch` | Buyer Web + Admin + Matching 使用 | 充分 | 已使用 |
| `RFQ` | Buyer Web + Admin 使用 | 充分 | 已使用 |
| `RFQResponse` | API/Admin/Buyer 详情只读使用 | Supplier Web 无 | 已使用但缺入口 |
| `Notification` | API/Admin 使用 | Web 无中心页 | 已使用但缺入口 |
| `AuditLog` | 写入服务 + Admin 查询 | Web 无入口 | 已使用但偏内部 |
| `Inquiry` | API/Admin 使用 | Public Web 页面实际未打通 | 已使用但前台未闭环 |
| `WorkflowEvent` | Demand/RFQ/Offer/Match 变更使用 | 无独立产品入口 | 内部支撑能力 |

### 3.2 参数与知识基础

当前 schema 已具备内容中心和工业知识库的结构基础：

- `ParameterGroup`
- `ParameterDefinition`
- `ParameterOption`
- `ProductParameterDefinition`
- `ProductParameterValue`
- `DemandParameter`
- `ProductCategory`

这意味着：

> M14 做“工业参数知识库”时，核心不是重建数据结构，而是把现有参数字典从“匹配/管理用途”升级为“知识解释 + 内容关联 + SEO 内容资产用途”。

### 3.3 数据层结论

数据库结构已经足够支撑：

- Buyer 平台
- Supplier 工作台
- RFQ/Offer/Response 闭环
- 参数知识库
- 内容管理扩展

M14 不应优先改库，而应优先补产品入口与内容模型外层。

---

## 4. 商业资产清单

### 4.1 当前已形成的商业资产

| 资产 | 当前状态 |
|---|---|
| Buyer 使用路径 | 已有真实 MVP |
| 产品库 | 已有分类、参数、媒体、后台维护能力 |
| 需求池 | 已形成 Buyer 需求沉淀入口 |
| 匹配能力 | 已形成自动匹配基础 |
| RFQ 框架 | 已形成询价骨架 |
| Admin 运维 | 已形成基础运营后台 |

### 4.2 当前缺失的商业资产

| 资产 | 当前缺口 |
|---|---|
| 供应商加入理由 | 缺少 Supplier Web 工作台、RFQ 响应入口、持续运营界面 |
| 产品资产沉淀 | 有后台数据，但缺供应商自运营闭环 |
| 内容引流 | About/Business/Knowledge/Solutions 仍是静态页 |
| 知识库价值 | 参数未形成面向搜索/教育/选型的知识内容 |
| SEO 资产 | 缺 CMS、缺内容 schema、缺结构化内容扩展 |
| AI 运营 | 仅有结构基础，无自动化运营链路 |

### 4.3 商业闭环判断

当前平台的技术闭环是：

```text
Buyer用户
  -> Demand
  -> Match
  -> RFQ
```

当前平台的商业闭环仍然断在：

```text
RFQ
  -> Supplier持续响应
  -> Buyer筛选决策
  -> 平台重复撮合价值
```

结论：

> VISNDT 当前是“Buyer 侧可演示、Supplier 侧未产品化、内容价值未建立”的撮合平台 MVP。

---

## 5. 已完成能力

- Buyer 注册/登录
- Buyer 产品浏览
- Buyer 需求创建与管理
- 自动匹配与重匹配
- Buyer RFQ 创建/发布/关闭/查看
- Admin 产品/用户/组织/需求/RFQ/通知/审计日志管理
- Offer / RFQResponse / Notification / AuditLog / Inquiry 后端域模型
- 参数管理、分类管理、产品媒体管理
- 文件上传与孤儿文件清理

---

## 6. 未完成能力

- Supplier Web 工作台
- Supplier Offer 管理前台入口
- Supplier RFQ Response 提交前台入口
- Buyer 端真正可用的公开询价入口
- Web 通知中心页面
- RFQ 编辑页面
- 内容中心 / CMS / 知识库
- SEO 资产管理体系
- 工业参数解释与案例内容体系
- 明确的 M13.9 之后统一冻结基线文档

---

## 7. Docs 资产审查

### 7.1 当前 docs 目录结构

| 目录 | 文件数 | 当前有效性 |
|---|---:|---|
| `VISNDT-Blueprint` | 135 | 保留，作为蓝图参考；部分已落后于真实代码 |
| `_review` | 323 | **当前最有效**，是阶段事实和开发过程主证据 |
| `Content Management Guide` | 22 | 保留，但需与真实产品入口再校准 |
| `api` / `database` / `deployment` / `security` | 少量 | 保留，专项参考 |
| `context` / `_context` / `_design` / `_implementation` | 少量 | 保留，作为过程上下文，部分可能过期 |

### 7.2 关键文档有效性判断

| 编号/名称 | 作用 | 当前有效性 | 判断 |
|---|---|---|---|
| `296_M13.9_Web_MVP_Freeze_Report.md` | Web Freeze 结论 | 对 `apps/web` 仍基本有效 | 保留 |
| `297_M13.9.2_Web_MVP_Baseline_Report.md` | Web 基线说明 | 对 Web 路由仍较有效，但不是全仓真实基线 | 需要更新 |
| `299_M13.9.2_Project_Asset_Audit_Report.md` | 资产审计 | 迁移数、模型数等已落后当前仓库 | 需要更新 |
| `300_M13.9.3_System_Verification_Report.md` | 系统验证 | 可作历史验证依据，但不能替代今日基线 | 保留 |
| `298_VISNDT_M14_Roadmap_Decision_Report.md` | M14 决策建议 | 方向仍有效 | 保留 |
| `VISNDT M14开发起点_20260804.md` | M14 接续说明 | 作为上下文有效 | 保留 |
| `VISNDT M14启动上下文 V2.0 Final.md` | M14 启动主文档 | 仍有效 | 保留 |

### 7.3 docs 结论

M14 前应把文档体系分三层：

1. `_review` 作为事实历史  
2. `Blueprint` 作为理想设计  
3. 新增一份“当前真实基线”作为开发唯一起点

本报告即承担第三层角色。

---

## 8. M14 必须开发内容

### 8.1 Supplier 能力如何加入

结论：**加入 Supplier 平台内工作台，不做独立商城，不做店铺化。**

建议形态：

- Supplier 登录后进入平台内 `workspace`
- 基于组织角色区分 Buyer / Supplier
- Supplier 能力包含：
  - 我的产品
  - 我的报价 `Offer`
  - 待响应 RFQ
  - 已提交 RFQ Response
  - 基础组织资料

不建议内容：

- 独立 supplier storefront
- 公开报价列表
- 店铺装修/店铺主页

### 8.2 内容管理体系

当前静态页面：

- `about`
- `business`
- `knowledge`
- `solutions`

M14 应升级为：

- 内容中心首页
- 内容分类/标签
- 知识文章详情页
- SEO 字段（title, description, slug, keywords）
- 内容与产品/参数/案例关联

### 8.3 工业参数知识库

建议以现有参数体系为核心，扩展出知识对象：

- 参数定义：术语、单位、数据类型、标准值域
- 专业解释：参数意义、测量方式、行业影响
- 应用案例：适用场景、故障类型、选型建议
- 关联产品：绑定产品类目、参数定义、推荐设备

### 8.4 AI 自动运营可能性

当前适合做的 AI 方向：

- 自动生成知识文章初稿
- 自动生成产品标签/参数摘要
- 自动生成参数解释文案
- 匹配结果解释辅助
- 询盘分类与优先级标注

当前不建议做的 AI 方向：

- 自动交易决策
- 自动报价承诺
- 脱离人工审核的公开商机发布

---

## 9. M14 以后路线建议

### M14

- Supplier 平台内工作台
- RFQ Response Web 闭环
- Notification Center
- 内容中心 / 知识库一期
- 基线重冻结

### M15

- 参数知识库深化
- SEO 结构化资产
- 供应商运营面板
- 匹配解释能力增强

### M16+

- AI 内容生产流水线
- AI 参数知识助手
- 询盘智能分类
- 平台级运营自动化

---

## 10. 风险列表

### High

1. **基线漂移风险**  
   当前真实数据库基线已晚于 M13.9 Freeze 文档，若继续按旧 Freeze 文档设计，M14 设计输入会失真。

2. **Supplier 缺入口风险**  
   Offer、RFQResponse 等核心域已存在，但 Supplier Web 不存在，平台商业闭环无法成立。

3. **公共询价假闭环风险**  
   产品详情页的询价入口当前实际不可用，外部流量无法转成真实商机。

### Medium

4. **Web 路由残缺风险**  
   `/workspace/notifications` 菜单存在但页面缺失；RFQ detail 的 edit 路由按钮存在但页面缺失。

5. **前台交互假能力风险**  
   Demand / RFQ 列表搜索框未真正接入查询逻辑，容易造成“看起来有、实际上没工作”的误判。

6. **文档有效性漂移风险**  
   `299_M13.9.2_Project_Asset_Audit_Report.md` 的模型/迁移统计已落后真实代码库。

### Low

7. **匹配聚合效率风险**  
   Web 使用 `getAllMatches()` 前端聚合，后续数据量增大时会出现 N+1 放大。

8. **内容资产薄弱风险**  
   静态页尚未形成可增长内容系统。

---

## 11. 架构冻结建议

1. **立即承认新基线**  
   以当前 `schema.prisma + migrations + apps/web + apps/api + apps/admin` 作为 M14 唯一起点。

2. **冻结数据库新增字段冲动**  
   在 Supplier 工作台和内容中心方案明确前，避免继续随意扩表扩字段。

3. **先补入口，后扩能力**  
   Offer / RFQResponse / Notification 优先补 Web 入口，不优先继续增加新域。

4. **明确文档层级**  
   将 296/297/299/300 标记为“历史阶段文档”，本报告标记为“M14 开发前事实基线”。

5. **M14 启动前补一份统一 Freeze Delta**  
   需单独记录：M13.9 Freeze 后数据库/API/文档的实际偏移项。

---

## 12. Build 结果

本轮为只读审查，**未重新执行 build**。  
当前可引用的最近系统验证依据为：

- `F:\Desktop\VISNDT\docs\_review\300_M13.9.3_System_Verification_Report.md`

引用结论：

- API 编译：历史验证通过
- Web 页面：历史验证通过
- Admin 页面：历史验证通过

但需明确：

> 以上仅代表历史验证结果，**不等同于 2026-08-08 当日重新构建结论**。

---

## 13. 最终审查结论

VISNDT 当前最真实的 M14 起点不是“继续完善 Buyer 页面”，而是：

> **以已完成的 Buyer MVP 为底座，正式把 Supplier 入口、RFQ Response 闭环、内容中心、知识库体系和 Freeze 后新基线统一起来。**

如果不先解决这四件事，M14 将继续累积“后端有能力、Admin 有入口、Web 无产品化”的结构性偏差。

