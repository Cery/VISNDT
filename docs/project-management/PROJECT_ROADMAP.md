# VISNDT Project Roadmap

## Roadmap Principle

本路线图以当前真实代码、Prisma Schema、页面路由、API 模块和 `docs/_review` 证据链为准，不再沿用已经过时的“Buyer-only / Supplier 缺失”判断。

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
| `M20` | 前端平台化与体验升级（Frontend Platformization / 内容资产规划 / AI 准备） | **M20.0.0 Architecture Planning Pre-Audit（483 已完成）**：M20 方向冻结——Frontend Platformization (P1) + Content Asset Planning (P2) + AI Readiness Planning (P3)；Excluded: Marketplace, Supplier Store, Transaction, ERP, AI Infrastructure, Schema Change；M20 = Experience Upgrade, not Business Expansion | `PLANNING`（M20.0.0 前置审核完成，M20 方向冻结，进入 M20.1 开发规划） | 路由：M20.0 Architecture Planning → M20.1 Frontend Platformization → M20.2 Content Asset Planning → M20.3 AI Readiness → M21+ AI Enhancement；三优先级：P1 Frontend Platformization (apps/web+apps/admin 体验升级)、P2 Content Asset (Product-Content 关联+Content Discovery+Scenario)、P3 AI Readiness (数据质量+标签体系+文本规范，仅规划)；Future Candidates 保持冻结 |

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

## Future Architecture Candidates

以下为未来架构演进候选，当前 **FROZEN / NOT FOR DEVELOPMENT**，待满足触发条件后通过正式架构审计重新激活。

### Supplier Product Model Architecture

| Field | Value |
|-------|-------|
| Status | **Candidate (Frozen / Not For Development)** |
| Priority | Future |
| Related Stage | M19.4+ / M20 Architecture Audit |
| Design Document | `docs/_architecture/future/481_Supplier_Product_Model_Architecture_Future_Design_Candidate.md` |

**Reason**: 工业检测行业存在供应商型号级能力表达需求——同一平台产品能力由多个供应商提供不同型号。当前架构 Product = Global Catalog + Offer = Supplier Capability 已满足当前能力表达，供应商型号体系为未来架构演进候选。

**Constraint**: 必须保持 Product Global Catalog 架构，禁止 Product.organizationId / Product.supplierId / Supplier Product Catalog / Supplier Store / Marketplace。

**Trigger Conditions**:
- Supplier Capability 页面需求增强
- RFQ 精准匹配需要型号级能力
- AI Matching 需要型号参数
- SEO 需要供应商型号页面
- 供应商数据规模增长
