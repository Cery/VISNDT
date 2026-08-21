# 638_M25 全站评估报告（Project Audit）

> 报告编号：638_M25_Project_Audit
> 报告类型：Comprehensive Project Audit（全站评估）
> 评估日期：2026-08-21
> 评估范围：Web（:3000）、Admin（:3001）、数据库后端（:4000 / PostgreSQL :5432）
> 评估方式：Repository Inspection + Code Review + 历史报告（01~637）交叉核对
> 执行指令：VISNDT Trae Execution Instruction V3.2.3（Read-Only，零代码变更）
> 数据基线：产品 6 / 内容 15 / RFQ 11 / Offer 6 / Demand 6 / Inquiry 5 / KnowledgeEntry 6 / Organization 10 / ProductCategory 12 / ParameterDefinition 45

---

## 一、任务概述

针对 VISNDT 工业检测设备信息与撮合平台，基于项目实际代码（`F:\Desktop\VISNDT\VISNDT`）与历史报告（01~637），从 **UI 设计、功能设计、逻辑功能实现、流程处理、运营管理** 五个维度对 Web、Admin、数据库后端做全量健康度评估，输出分级问题清单（P0/P1/P2）与改进目标。本报告为纯只读审计，不修改任何代码、数据库、API 或冻结模块。

---

## 二、运行时与环境现状（V3.2.3 §0.3）

| 服务 | 端口 | 状态 | 说明 |
|------|------|------|------|
| PostgreSQL（Docker） | 5432 | ✅ | 容器 `visndt-postgres`，含 `vector(1536)` 扩展 |
| API（NestJS） | 4000 | ✅ | `/api/v1/health` → `database connected` |
| Web（Next.js 15） | 3000 | ✅ | 公开站 + 双角色 Workspace |
| Admin（Vite + AntD 5） | 3001 | ✅ | 工业运营中心 |
| MinIO（S3 兼容） | 9000 | ✅ | 对象存储 |

**数据量级说明**：当前为演示数据量级（个位数到十位数），各列表/筛选/分页逻辑在现量级下功能正常，但「编号体系缺失」「ID 不可见」「批量操作弱」等问题在数据量级放大后才显性化，需以「数据上规模后的运营可管理性」为前提评判。

---

## 三、数据库后端评估

### 3.1 Schema 总体结论

**评价：合理（Good），领域边界清晰，冻结约束落地到位。**

| 维度 | 结论 |
|------|------|
| Model 数量 | 34 个，覆盖 身份/产品/报价/需求/匹配/工作流/通知/文件/询盘/内容/分析/知识/AI数据准备 |
| Enum 数量 | 18 个，业务语义完整 |
| 命名规范 | PascalCase Model + snake_case 列（`@map`），主键一律 `uuid()` @db.Uuid |
| 业务术语 | Organization（非 Supplier）、Demand（非 Requirement）、RFQ（非 Inquiry）语义冻结正确 |
| 供应商关系 | `Offer` 以 `@@unique([organizationId, productId])` 约束「一供应商一产品一报价」，符合「产品 Global Catalog + Offer 供应商展示」冻结架构 |
| 确定性匹配 | `Demand → DemandParameter → ProductParameterValue → DemandMatch(matchScore)` 链路清晰，无 AI/语义替代参数 |
| 知识映射 | `ProductCategoryKnowledgeMapping` 承载「产品类目 ↔ 知识类目」确定性映射 |
| 内容版本 | `ContentRevision`（version + snapshot）已为版本化提供范式 |

### 3.2 数据库领域现状

| 领域 | 核心模型 | 闭环状态 |
|------|---------|---------|
| 身份与组织 | User, RefreshToken, Organization, UserInvitation, OrganizationMember | ✅ 完整 |
| 产品 | ProductCategory, Product, ProductMedia, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | ✅ 完整 |
| 报价 | Offer | ✅ 完整 |
| 需求/询价 | Demand, DemandParameter, DemandMatch, RFQ, RFQResponse | ✅ 完整 |
| 工作流/通知 | WorkflowEvent, Notification | ✅ 完整 |
| 文件/审计 | FileAsset, AuditLog | ⚠️ 媒体资产域刚补隔离/生命周期（B.2） |
| 询盘 | Inquiry | ✅ 完整 |
| 内容 | Content, ContentMedia, ContentRevision, ContentTag, ContentTagRelation | ✅ 完整 |
| 分析 | ConversionEvent | ✅ 基础 |
| AI 数据准备 | ContentChunk | ⚠️ 仅数据准备，无 runtime |
| 知识库 | KnowledgeDomain, KnowledgeCategory, KnowledgeEntry, KnowledgeContentRef, KnowledgeRelation, ProductCategoryKnowledgeMapping | ✅ 完整 |

### 3.3 数据库已知缺口

| # | 缺口 | 影响 | 级别 |
|---|------|------|------|
| DB1 | 媒体资产域「文件夹/标签」「版本历史」未落地（选项 3 远期） | 媒体规模起来后 DAM 能力不足 | P2 |
| DB2 | 媒体 `FileAsset` 已加 `organizationId/status/deletedAt`（B.2），但**版本历史仍缺失**（区别于 `ContentRevision`） | 媒体替换/回滚不可追溯 | P2 |
| DB3 | `Product.status` 与 `FileAsset.status` 均用 `String` 默认值或独立枚举，但 `Product.status` 仍为 `String @default("DRAFT")`（未枚举化），与其他 enum 化状态不一致 | 状态语义统一性弱，易脏值 | P2 |
| DB4 | `User.organizationId` 与 `OrganizationMember` 双轨并存，无显式「主组织 vs 成员组织」区分 | 多组织成员身份歧义 | P2 |
| DB5 | `ConversionEvent`/`AuditLog` 为聚合审计数据，但**无数据归档/分区策略** | 长期运行表膨胀 | P2 |

---

## 四、UI 设计评估

### 4.1 总体结论

**评价：Web 骨架结构完成度高，但双端设计系统割裂、Web 缺图标体系与原子组件层，未达「平台化」统一专业标准（631 已定 CONDITIONAL PASS）。**

### 4.2 双端设计系统现状对比

| 维度 | Web（:3000） | Admin（:3001） |
|------|-------------|----------------|
| 技术栈 | Next 15 + Tailwind CSS + 手写组件，**无 UI 组件库、无 icon 库** | Vite + Ant Design 5 + @ant-design/icons + recharts + zustand |
| Design Token | `globals.css` CSS 变量（`--primary ≈ #3b82f6`）+ `tailwind.config.ts` | `design-system/tokens.ts`（primary `#2563eb`）+ antd ConfigProvider |
| 原子组件层 | ❌ 无 `ui/` 层；`common/` 仅 EmptyState/ErrorState/Loading/Pagination/MediaImage | ✅ `operation/` + `design-system/` + `operation-center/` 成熟 |
| 图标 | ❌ 77 处 emoji（workspace 为重灾区） | ✅ @ant-design/icons（emoji 仅 4 处残留） |
| SectionHeader | `brand/SectionHeader` 仅 home/brand 使用 | `dashboard/SectionHeader` + `operation-center/OperationSectionHeader` |

### 4.3 UI 设计问题清单（承接 631 九项 G 差距）

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| G1 | 双端设计系统割裂（Tailwind 手写 vs AntD） | 平台视觉语言分裂为两套 | **P0** |
| G2 | Web 无图标体系，用 77 处 emoji | workspace 专业感破坏 | **P0** |
| G3 | Web 缺原子 UI 组件层 | 各页手写样式，一致性难保证 | P1 |
| G4 | 双端 primary 色值不一致（`#3b82f6` vs `#2563eb`） | 品牌色未对齐 | P1 |
| G5 | SectionHeader 三套实现 + 未全量推广 | 页面标题区割裂 | P1 |
| G6 | 列表分页不统一（Web Pagination 仅 3 文件用） | 各列表分页策略不一 | P1 |
| G7 | 登录/注册表单规范（密码可见性/强度提示缺失，625 P1） | 认证体验不达平台标准 | P1 |
| G8 | 信息架构/导航/面包屑未统一 | 双端导航不统一 | P2 |
| G9 | 媒体资产体系 4.5/10（已从 B.1/B.2 缓解但仍缺 DAM） | 平台资产专业度 | P2 |

---

## 五、功能设计评估

### 5.1 Web 页面清单与完成度（承接 625）

| 路由 | 模块 | 业务连接 | 评分 | 状态 |
|------|------|---------|------|------|
| `/` | 首页 | ✅ Hero+分类+精选+方案+知识+CTA | 8.0 | 骨架完整 |
| `/products` `/products/[slug]` | 产品中心/详情 | ✅ getProducts + 相关产品/知识推荐 | 7.5 | 完整 |
| `/products/compare` | 产品对比 | ✅ | 6.5 | 可增强 |
| `/categories` | 产品分类 | ✅ | 7.0 | 二级筛选弱 |
| `/knowledge` `/knowledge/[slug]` | 知识中心 | ✅ | 7.0 | CTA 弱 |
| `/knowledge-base` `/domains/[slug]` | 知识库 | ✅ | 6.5 | 与 knowledge 信息架构重叠 |
| `/solutions` `/solutions/[slug]` | 解决方案 | ✅ | 7.0 | 关联弱 |
| `/articles` `/insights` | 文章/洞察 | 部分 | 6.0 | 内容少、入口重复 |
| `/business` `/about` | 商务/关于 | 静态 | 7.0 | 静态为主 |
| `/search` | 搜索 | ✅ unifiedSearch | 7.5 | 多类型切换 |
| `/login` `/register` | 认证 | ✅ useAuth | 6.5 | 密码规范缺失（P1） |
| `/suppliers/[id]` `/tags/[slug]` | 供应商/标签 | ✅ | 6.5 | 供应商展示面薄 |
| `/workspace` `/dashboard` | 工作总览 | ✅ | 7.5 | 按角色渲染 |
| `/dashboard/buyer / supplier` | 角色工作台 | ✅ | 7.5 | KPI 充分 |
| `/workspace/demands/*` | 需求发布 | ✅ | 7.0 | 参数录入可优化 |
| `/workspace/rfqs/*` | RFQ 流程 | ✅ | 6.5 | 流转可视化不足 |
| `/workspace/matches/*` | 匹配结果 | ✅ | 6.5 | 评分解释性弱 |
| `/workspace/notifications` | 通知中心 | ✅ | 6.5 | 批量操作可增强 |
| `/workspace/settings` `/profile` | 个人/组织 | ✅ | 6.5 | 组织管理入口偏浅 |
| `/workspace/supplier/*` | 供应商工作区 | ✅ | 6.5 | 部分子页内联 |

### 5.2 Admin 模块完成度（承接 625/630）

| 模块 | 列表字段 | 筛选 | 批量 | 发布 | 状态 |
|------|---------|------|------|------|------|
| Home Dashboard | StatCard | — | — | — | 完整 |
| ProductList | 名称/型号/分类/组织/创建者/状态/时间 | ✅ AdvancedFilter | ✅ BatchActionBar | ✅ 状态发布 | 成熟 |
| ContentList | 字段裁剪 | ✅ | — | ✅ scheduler | 完整 |
| User / Organization | 字段裁剪 | ✅ | — | — | 完整 |
| Rfq / RfqResponse / Demand / Offer | 字段裁剪 | 部分 | 部分 | — | 批量弱 |
| Match / Analytics / Monitoring / AuditIntelligence | — | — | — | — | 已超设计稿 |
| MediaList | （B.1 后）统一文件库+筛选+分页 | ✅ | — | — | B.2 已补隔离/生命周期 |

### 5.3 功能设计问题清单

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| F1 | `/workspace/supplier` 为占位/跳转页，与正式工作区双入口（625 P0 已记账，633 续记） | 入口混淆 | P1 |
| F2 | `/knowledge-base` 与 `/knowledge` 信息架构重叠；`/articles`/`/insights` 入口重复 | 用户导航困惑、SEO 分流 | P1 |
| F3 | Web 相关产品/知识推荐「单向 vs 双向」受架构约束，未闭环 | 知识反查产品入口弱 | P2 |
| F4 | Admin Category/ParameterGroup 管理偏工程化，运营可读性弱 | 运营使用门槛高 | P1 |
| F5 | Admin Rfq/Demand/Offer 列表批量操作弱 | 批量状态/审批低效 | P1 |
| F6 | 供应商详情页身份信息（资质/能力）展示偏薄 | 供应商「我是哪家」感弱 | P1 |

---

## 六、逻辑功能实现评估

### 6.1 核心业务逻辑链路（已冻结，UNCHANGED）

| 链路 | 实现 | 状态 |
|------|------|------|
| 认证链 | JWT + HttpOnly Cookie + RefreshToken + CSRF + RBAC（WorkspaceRole 契约 M14.2.4） | ✅ 完整 |
| 需求链 | Demand 发布 → 参数结构化 → 触发匹配 | ✅ 完整 |
| 匹配链（冻结） | Demand 参数 → 候选 Product（ACTIVE + ACTIVE Offer + 分类过滤）→ ScoringService → DemandMatch | ✅ 确定性，无 AI 介入 |
| RFQ 链 | DemandMatch → RFQ（含 sourceMatchId）→ 定向组织 → RFQResponse → 决策 | ✅ 完整 |
| 通知链 | WorkflowEvent → Notification（RFQ/响应/匹配事件触发） | ✅ 完整 |
| 内容链 | Content → ContentMedia → FileAsset + ContentRevision 版本 | ✅ 完整 |
| 媒体链 | FileAsset（B.2 后含 organizationId/status/deletedAt）→ ProductMedia/ContentMedia | ⚠️ 补强中 |
| 搜索链 | unifiedSearch + Semantic Ranking（冻结，M21.4） | ✅ 完整 |
| 知识链 | KnowledgeDomain → Category → Entry + ProductCategoryKnowledgeMapping 确定性映射 | ✅ 完整 |

### 6.2 逻辑实现问题清单

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| L1 | 产品列表 `ProductCard` 链接用 `product.id`，详情路由用 `[slug]`，同一实体双标识口径（633 W1） | 深层链接失效、SEO/引用不一致 | **P0** |
| L2 | 认证 Token 存储口径不一致：前端历史读 response body，后端存 HttpOnly Cookie（技术债） | 已用 cookie fallback 弥合，但需统一契约 | P1 |
| L3 | 匹配评分解释性弱（MatchDetail 评分拆解不透明） | 用户/运营难以理解为何匹配 | P1 |
| L4 | 知识相关产品发现已落地（M24.1.6），但**相关产品仅显示 active/published** 的约束需逐项校验 | 草稿泄漏风险 | P1 |
| L5 | Admin 媒体中心「产品媒体/内容媒体/孤立文件」三视图割裂（633 A3），B.1 已建统一 `GET /files`，但跨类型聚合视图未全面推广 | 无法全局看某供应商全部资料 | P1 |

---

## 七、流程处理评估

### 7.1 业务闭环流程状态（按业务闭环顺序）

| 流程阶段 | 状态 | 说明 |
|---------|------|------|
| Organization → 标准产品 | ✅ 闭环 | 组织与 Global Catalog 产品模型冻结正确 |
| 标准产品 → Offer | ✅ 闭环 | 供应商经 Offer 展示能力 |
| Offer → Demand | ✅ 闭环 | 需求发布触发匹配 |
| Demand → RFQ | ✅ 闭环 | 匹配 → 定向 RFQ（M14.3.2） |
| RFQ → Organization Response | ✅ 闭环 | RFQResponse 提交/决策（M14.3.2.6） |
| Response → Workflow | ✅ 闭环 | WorkflowEvent 状态流转 |
| Workflow → Notification | ✅ 闭环 | 事件触发通知（M15.2） |

### 7.2 流程处理问题清单

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| P1 | RFQ 流转节点可视化不足（Web 侧 `rfqs/[id]`） | 买卖双方对流程位置感知弱 | P1 |
| P2 | Demand/RFQ/Offer 状态流转时间线可读性弱（633） | 跨页沟通引用困难 | P1 |
| P3 | 询盘 Inquiry → Offer/报价 自动流转未自动化（当前为手工状态推进） | 运营介入成本高 | P1 |
| P4 | 通知中心已读/未读批量操作待增强 | 通知管理效率 | P2 |

---

## 八、运营管理评估

### 8.1 编号 / ID 体系现状（633 核心发现）

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| O1 | Admin 各管理列表普遍**不展示实体 ID/业务编号列**（633 A1） | 数据量大后无法精确复核/导出/对账 | P1 |
| O2 | Web 列表卡片不展示「业务编号」（产品型号/需求单号/RFQ 单号）（633 W3） | 多条目同名前缀无法快速锁定 | P1 |
| O3 | Demand/RFQ/Offer 详情链接用 UUID，页面不暴露可读编号（633 W4） | 跨页引用困难 | P1 |
| O4 | 供应商详情路由 `[id]`，页面不显示组织 ID/统一编号（633 W2） | 供应商身份感弱、对账定位难 | P1 |

### 8.2 角色视角运营差距

- **buyer**：需求/询价流程字段齐全，但缺「单号体系」与「状态时间线」可读性。
- **supplier**：Offer 列表缺「关联产品型号/编号」「报价单号」；供应商身份信息展示偏弱。
- **admin**：媒体中心已从「导航壳」（633 A2 P0）进化到 B.1 统一文件库 + B.2 隔离/生命周期；但各业务列表编号列仍缺失。

### 8.3 运营管理问题清单

| # | 问题 | 影响 | 级别 |
|---|------|------|------|
| O5 | 媒体中心 B.2 已落地组织隔离，但**媒体生命周期状态流转 UI 未全面接入**（archived/恢复操作） | 媒体治理只完成一半 | P1 |
| O6 | AuditLog/Analytics 有数据但**缺运营视角的聚合看板联动** | 审计数据未转化为运营决策 | P2 |

---

## 九、全站问题汇总与分级

### P0（阻断级，必须优先）

| # | 问题 | 维度 | 所属报告 |
|---|------|------|---------|
| 1 | 双端设计系统割裂（Web Tailwind vs Admin AntD） | UI | 631 G1 |
| 2 | Web 无图标体系，77 处 emoji | UI | 631 G2 |
| 3 | 产品列表 `product.id` vs 详情 `[slug]` 双标识口径 | 逻辑 | 633 W1 |

### P1（重要，需本轮或下轮收敛）

| # | 问题 | 维度 |
|---|------|------|
| 4 | Web 缺原子 UI 组件层 | UI |
| 5 | 双端 primary 色不一致（#3b82f6 vs #2563eb） | UI |
| 6 | SectionHeader 三套实现未统一 | UI |
| 7 | 登录/注册表单密码规范缺失 | UI |
| 8 | 各管理列表缺实体 ID/业务编号列 | 运营 |
| 9 | `/workspace/supplier` 占位双入口 | 功能 |
| 10 | Admin Category/ParameterGroup 运营可读性弱 | 功能 |
| 11 | Admin Rfq/Demand/Offer 批量操作弱 | 功能/流程 |
| 12 | 匹配评分解释性弱 | 逻辑 |
| 13 | 认证 Token 口径不一致（技术债） | 逻辑 |
| 14 | RFQ 状态流转可视化不足 | 流程 |
| 15 | 询盘→报价自动流转未自动化 | 流程 |
| 16 | 媒体生命周期 UI 未全面接入 | 运营 |

### P2（细节完善，可延后）

| # | 问题 | 维度 |
|---|------|------|
| 17 | 媒体资产版本历史/DAM 缺失 | 数据库 |
| 18 | `Product.status` 未枚举化 | 数据库 |
| 19 | 相关产品草稿泄漏校验 | 逻辑 |
| 20 | 信息架构/面包屑未统一 | UI |
| 21 | 通知批量操作增强 | 流程 |

---

## 十、改进目标（Goal）

1. **设计系统地基**（M24.6 主线）：落地跨端 Design Token 单一事实源（`packages/design-tokens/tokens.json`）、Web 采用 lucide-react 去 emoji、Web 建 `ui/` 原子组件层 —— 消灭 G1/G2/G3/G4/G5/G6。
2. **编号/ID 规范化**（C.1 主线）：Admin 列表补齐实体 ID/业务编号列；Web 统一 `slug` 为唯一链接口径；为 Demand/RFQ/Offer 生成可读业务单号 —— 解决 P0-3 与 O1~O4，回应「多角色操作便利性」诉求。
3. **媒体资产收敛**（B 主线收尾）：B.1 统一文件库 + B.2 隔离/生命周期已完成；补齐媒体状态流转 UI 与跨类型聚合视图 —— 回应「不同供应商资料分开管理」诉求。
4. **流程可读性**：RFQ/状态流转时间线可视化 + 匹配评分拆解 —— 服务买卖双方操作与运营管理。
5. **数据库可持续性**（远期）：媒体版本历史、状态枚举化、审计数据归档策略 —— 服务数据上规模后的可管理性。

> 说明：Matching / Scoring / Product Model / Search Ranking / AI 全程冻结 UNCHANGED，本报告未触及。改进目标均落在前端体验层、设计系统层、媒体资产域与运营编号体系，符合 V3.2.3 冻结边界。