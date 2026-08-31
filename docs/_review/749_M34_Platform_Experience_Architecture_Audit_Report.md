# 749_M34_Platform_Experience_Architecture_Audit_Report

> Task ID: 749_M34_Platform_Experience_Architecture_Audit
> Task Type: Architecture Audit + Platform Product Audit + Object Model Audit + IA Audit + UX Architecture Audit + Search/Discovery Audit + Governance Audit + SEO/LLM Audit + Mobile Audit + Target-State Definition + Implementation Readiness
> Execution Mode: READ-ONLY ARCHITECTURE AUDIT + CURRENT-STATE RECONCILIATION + TARGET-STATE DEFINITION
> Stage: M34.0 — Platform Experience Architecture Reconstruction
> Date: 2026-08-30

---

## 1. Task Summary

本次任务基于 746 / 747 / 748 已建立的事实与数据基线，对 VISNDT 当前平台对象模型、信息架构、搜索与发现机制、Buyer/Supplier/Admin 体验、Public/Workspace 边界、治理机制、SEO/LLM 语义结构及移动端体验进行统一架构审计，并形成可供下一阶段架构冻结与实施规划使用的 **M34 Target-State Architecture Baseline**。

核心结论（一句话）：VISNDT 当前属于 **Hybrid（Website-first 强、Platform Object 弱、Platform Experience 未建立）**，核心对象是 **Product（Capability Authority）→ SupplierProduct → Offer** 的三层混合模型；**Capability 尚未平台化**（无独立模型/表/前端路由，仅后端只读投影）；**Specification 仅参数层、非独立平台对象**；**Search 是 Product/SupplierProduct/Knowledge/Content/Solution/Supplier 六类聚合检索，非规格驱动发现**；**Buyer 围绕能力发现的任务链完整但数据为空、Supplier 供给侧资产为空、Admin 治理端最成熟但缺 Capability 治理**。平台需要从「视觉平台化（M33）」进入「对象平台化（M34）」。

本任务**零生产代码修改、零数据库修改、零 API 修改、零 Schema 修改、零 Route/UI 修改、零数据清理**。

---

## 2. Repository Verification

| 项 | 值 | 证据 |
|---|---|---|
| 仓库根目录 | `F:\Desktop\VISNDT` | `pwd` / `git rev-parse --show-toplevel` |
| 代码根目录 | `F:\Desktop\VISNDT\VISNDT` | `.trae/rules/项目路径.md` |
| 分支 | `main` | `git branch --show-current` |
| Commit | `ff03a9a368f3490094cf57015ce4799904ad283c` | `git rev-parse HEAD` |
| Working Tree | **OTHER**（130 条改动：M33 前端改动 + 未跟踪报告/脚本/CDP 产物 + 本次 3 文档修改） | `git status --short` |

> 未执行 `git reset / restore / checkout / clean`。全部历史未提交改动保留。

---

## 3. Environment Verification

| 服务 | 运行态 | 端口 | 归属 | 证据 |
|---|---|---|---|---|
| PostgreSQL | UP (healthy) | 5432 | database（docker：`visndt-postgres`） | `docker ps` |
| MinIO | UP | 9000-9001 | storage（`visndt-minio`） | `docker ps` |
| Web (Next.js) | **UP** | **3001** | web 前端（HTML） | `http://127.0.0.1:3001/` → 200 text/html |
| API (NestJS) | **UP** | **4000** | api 后端（JSON） | `http://127.0.0.1:4000/api/v1/health` → `{"status":"ok"}` |
| Admin (Vite) | **未确认独立端口** | — | 无独立监听（3000/3002/8000 均无）；Admin 为独立 SPA，经 3001 Web 的 `NEXT_PUBLIC_ADMIN_CONSOLE_URL` 引导（默认 localhost:3001） | `dashboard/page.tsx` |

**端口差异解释（746 vs 748 vs 本次）**：
- 746 记录 Web `:3000` DOWN
- 748 记录 Web `:3001` UP
- **本次现场确认**：`:3000` DOWN，`:3001` = Web（HTML），`:4000` = API（JSON）。748 的 `:3001` 判断为**正确**；本任务以当前仓库/运行时事实为准（指令要求不能继承错误端口判断）。Admin 未发现独立监听端口，其入口经 Web 引导，归属为「Web 同源 / 或未单独拉起」——记录为 **AMBIGUOUS**（不扩大核查）。

环境类型：**Development**。Web / API 本次均可读，无需「UNAVAILABLE」标注。

---

## 4. Data Baseline Verification

| 项 | 值 |
|---|---|
| M34-DATA-02 状态 | COMPLETE / CONDITIONAL PASS |
| 本任务 Database Mutation | **NONE** |
| 本任务 Storage Mutation | **NONE** |
| 数据清理行为 | **未执行**（严格只读审计，禁止借架构审计再次清理） |

**当前数据实测基线（读库 SELECT，只读）**：

| 实体 | 数量 | 说明 |
|---|---|---|
| `product_category` (ProductCategory) | 28 | 分类 28（含 12 测试 TC713/715/716 + 16 真实） |
| `product` (Product) | **0** | Capability Authority 供给侧空 |
| `supplier_product` (SupplierProduct) | **0** | 供给侧资产空 |
| `organization` | 15 | org（含 platform/admin/supplier/buyer 基线 + re-seed 重复） |
| `user` | 1 | 账户（仅受保护基线） |
| `organization_member` | 5 | 成员关系 |
| `offer` | 0 | 报价空 |
| `demand` | 3 | 需求（保留基线） |
| `demand_match` | 0 | 匹配空 |
| `rfq` | 2 | RFQ（保留） |
| `rfq_response` | 1 | RFQ 响应（保留） |
| `inquiry` | 0 | 询价空 |
| `parameter_definition` | 54 | 参数定义（真实 52 + 测试 2） |
| `knowledge_entry` | 6 | 知识条目（保留） |
| `content` | 8 | 内容（ARTICLE/INSIGHT 等，保留） |
| `file_asset` | 0 | 文件资产空 |
| `audit_log` | 2857 | 审计（保留/受保护） |
| `conversion_event` | 376 | 转化事件（保留） |
| `workflow_event` | 22 | 工作流事件（保留） |

> **关键数据事实**：M34-DATA-02 清理后，平台处于「分类/参数/知识/内容体系完整、但 product / supplier_product / offer / demand_match / inquiry 供给侧与匹配侧为空」的 **干运行（dry-run）状态**。这使 749 面向「目标对象定义与 IA 设计」而非「验证存量交易数据」，是本次审计的重要输入。

---

## 5. Documentation Baseline

| 文档 | 当前反映 |
|---|---|
| PROJECT_STATUS.md | M33 CLOSED（724-744 全链）✔ / M34 PRE-IMPLEMENTATION ✔ / 747=CONDITIONAL ✔ / 748=CONDITIONAL ✔ / **749=未记录（本任务目标）** |
| PROJECT_ROADMAP.md | M33 → M34 方向 ✔ / 749 未记录（本任务目标） |
| MODULE_COMPLETION_MATRIX.md | M33 CLOSED / M34 未标 749（本任务目标） |

**Documentation Drift**：无功能性 drift——文档对 M33 CLOSED、M34 PRE-IMPLEMENTATION、Data Cleanup Complete 的反映**准确**。唯一缺失是 749 条目本身，本任务完成后补齐。未扩大到项目文档治理重构。

---

## 6. M33 Closure Verification

| 项 | 状态 |
|---|---|
| M33 = CLOSED | ✔（744 Final Closeout PASS） |
| M33 Visual Transformation = CLOSED | ✔（733/735/737/739/743 链） |
| M33 Runtime Verification = CLOSED | ✔（743 Final Gate E2E PASS） |
| M33 Architecture Freeze = CLOSED | ✔ |
| M33 无 M33.14+ / 无 Reopen | ✔ 保持 |
| M33 Visual Reverification | **未触发**（本任务为架构审计，非视觉再验证） |

本任务**未 reopen M33、未修改 M33 closeout、未改写 744**。

---

## 7. Current Architecture Classification

| 维度 | 当前事实 | 证据 |
|---|---|---|
| 公开 Web | Next.js App Router 内容/能力发现站 | `apps/web/src/app`（products/categories/search/knowledge/articles/solutions/suppliers） |
| Admin | Vite+AntD 独立治理 SPA | `apps/admin/src`（OperationCenter/Product/Organization/…） |
| API/Backend | NestJS 服务层（单模块聚合） | `apps/api/src` |
| Database | PostgreSQL + Prisma | `database/prisma/schema.prisma` |
| Journey 后端闭环 | Demand→Match→RFQ→Response→Offer | schema Demand/DemandMatch/RFQ/RFQResponse/Offer |
| Directories 结构 | monorepo：apps/{admin,api,web} + database + packages | `VISNDT/` 根 |

**结论**：当前架构属于 **Website-first 偏重的 Hybrid**。业务闭环在**数据层和 API 层完整**（能跑 Demand→Match→RFQ→Offer），但在**发现对象层未平台化**：Capability 仅是投影、Specification 仅是参数、Supplier 是 Organization 别名。这造成「能创建交易闭环，但发现入口是内容站式产品目录」的平台感失衡。

---

## 8. Platform Mental Model

分别从 Guest / Buyer / Supplier / Admin 视角评估（仅观察页面结构/对象/导航/数据/CTA，不读宣传文案）：

| 视角 | 直觉判断 | 依据 |
|---|---|---|
| Guest | **Catalog Website / 内容站**（Level 1） | 首页 Hero/品牌叙事 + 产品中心/知识中心/新闻栏目，CTA 多为「联系我们/立即询价」；进入 `/products` 看到的是产品目录卡片 + 分类 — **Corporate/Catalog 属性显著** |
| Buyer | **Discovery Website（Level 2）**，有 Industrial Platform 影子 | 有 `/search` 聚合检索 + 参数筛选 + 对比 + Demand 创建入口；但「能力/规格」对象不独立呈现，Buyer 需要靠关键词+分类猜测 |
| Supplier | **Catalog/兼容层**（Level 1/2） | 供给侧进入了 `/dashboard/supplier`（正式工作台），但产品录入是「挂到平台 Product 下的 SupplierProduct」，缺独立 Capability 发布心智 |
| Admin | **Industrial Platform / Governance（Level 3）** | 独立治理端管理 分类/参数/产品/供应产品/知识/内容/需求/匹配/RFQ/Offer — **最平台化的一块** |

**Current Platform Maturity Level（诚实评估，不为平台化强抬等级）= Level 2（Discovery Website）**，且有 Level 3 的治理端雏形。判定为 **Level 2 / 向 Level 3 迁移中**。理由：发现功能存在（search+filter+compare）、需求/匹配/QRF 闭环存在（数据层），但**Capability 无独立对象、Specification 非对象、供给侧为空**，无法撑起 Level 3「Industrial Discovery Platform」的实体语义。禁止声称当前已是 Level 3/4。

---

## 9. Core Object Model Audit

本节回答「当前到底有哪些对象、各对象六大维度的现状」。表: 38.1 Object Reality Matrix 详列。

**核心结论**（逐对象）：

- **Capability**：无独立 Model/Table；无 CRUD 生命周期；仅 `GET /api/v1/capabilities/:id` 只读投影（输入是 Product UUID，返回 Product→SupplierProduct→Offer 聚合图）；前端**无 `/capabilities` 路由**；无独立 Search/Facet/Category/Specification/Supplier 关系。→ 见 §10。
- **SupplyProduct(=SupplierProduct)**：有完整 Model/Table（`supplier_product`）+ API + 生命周期（DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED）+ 治理（reviewedBy）+ 参数/媒体。是真实的 supplier-owned commercial product entity，但当前 **0 条数据**，且仅通过 `platform_product_id → Product` 维护能力归属。→ 见 §11。
- **Product**：有完整 Model/Table/API/Frontend 路由（`/products`、`/products/[slug]`）。**职责 = 平台能力权威（Capability Authority）**（search.service 注释明确），但同时扮演「Catalog Product」+「Canonical Product」。→ 见 §12。
- **Supplier**：**无独立 Model/Table**，= `Organization` 的别名（type=SUPPLIER 视角）；无 Role/Permission 表；`/suppliers/[id]` 前端路由由 Organization 数据渲染；搜索里的「Supplier」是从 Offer 聚合的弱聚合。→ 见 §13。
- **Category(=ProductCategory)**：table 28；承担「产品分类」职责，但**与 Capability 分类/产品类型边界冲突**。→ 见 §14。
- **Specification**：**无独立对象**，仅 ParameterGroup→ParameterDefinition→(ParameterOption/Value) 参数体系；无前端 `/specifications` 路由。→ 见 §15。
- **Demand/Match/RFQ/RFQResponse/Offer**：数据模型完整（Demand/DemandMatch/RFQ/RFQResponse/Offer），业务闭环存在，但当前数据接近空（demand=3, rfq=2, rfq_response=1, 其余 0）。→ 见 §18。
- **Knowledge**：KnowledgeDomain→KnowledgeCategory→KnowledgeEntry 完整 + KnowledgeContentRef + product_category_knowledge_mapping；是**辅助知识层**，非 Core Object。→ 见 §19。
- **Workspace**：Buyer `/dashboard/buyer`、Supplier `/dashboard/supplier`；与 Public 的连续性未打通（见 §22）。

---

## 10. Capability Audit

**核心问题：Capability 是否独立？**

| 检查项 | 当前状态 | 证据 |
|---|---|---|
| DB Model / Table | **否 / 无表** | `schema.prisma` 无 Capability 模型、无 capability 表 |
| CRUD / Lifecycle | **否** | 无 Capability crud；capabilities.controller 仅 GET :id |
| API | **有（只读投影）** | `discovery/capabilities.controller.ts` `GET :id` |
| Frontend Route | **无** | `apps/web/src/app` 无 `/capabilities`；仅有 `lib/capability-glossary.ts`（展示层术语） |
| Search | **否** | search 以 Product/SupplierProduct 为单位；无 Capability facet |
| Facet | **否** | facet 建立在 category/brand/series/parameter/commercial，非 capability |
| Category Relation | 间接（ProductCategory） | search SupplierProduct 经 platformProduct.categoryId |
| Specification Relation | 否 | Capability 无 spec 关联 |
| Product Relation | 投影=Product | capabilities.controller 以 Product UUID 为入参 |
| Supplier Relation | 间接（经 SupplierProduct） | graph 返回 SupplierProducts |
| Knowledge Relation | 否 | 知识经 ProductCategoryKnowledgeMapping 关联 Category，非 Capability |
| SEO | 无独立页 | 无 /capabilities 无 JSON-LD |

**验证 `GET /api/v1/capabilities/:id` 判定**：

- **它是 Projection，不是 Independent Entity。**
  - 证据：`capabilities.controller.ts` 参数 `id` 实为 **Platform Product UUID**；`discovery.service.ts::findCapabilityGraph(platformProductId)` 直接 `prisma.product.findUnique`，capability = platformProduct 的 select 字段，再聚合 SupplierProducts→Offers。**capability = Product 的能力图投影**，无独立身份、无独立生命周期。
  - 明确结论（非模糊）：该端点只是把既有 Product/SupplierProduct/Offer 关系**重新打包成 transport 层图**，没有引入任何新的领域实体。

```
CURRENT:  Capability = Product 的只读能力图投影（无 Model / Table / CRUD / Route / Lifecycle / Governance）。
TARGET:   Capability 作为独立平台一级对象（Model / CRUD / Lifecycle / Canonical Route / Search Facet / Spec/Supplier/Category 关系），由 ProductCategory 语义升级或独立 Capability 模型承载（见 §33，属 DECISION CANDIDATE，本任务不落地）。
```

---

## 11. SupplyProduct Audit

`SupplierProduct` 是否是「Supplier-owned commercial product entity」？

| 维度 | 当前事实 | 证据 |
|---|---|---|
| Ownership | **是**（organizationId → Organization） | schema L538 SupplierProduct.organization |
| Lifecycle | **是**（DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED + reviewedBy/reviewedAt） | schema L555-560 |
| Submission/Review/Publish | **是** | reviewer 关系 |
| Specification | **是**（SupplierProductParameterValue）+ Technical override | schema L603；discovery.service (ParameterValues 供 Compare) |
| Media/Document | **是**（SupplierProductMedia） | schema L581 |
| Capability Mapping | **仅经 platformProductId→Product**，非直接 capability 关联 | schema L541 |
| Offer / RFQ | Offer supplierProductId；RFQ 经 Demand/DemandMatch | schema L509/RFQ |

**结论**：SupplierProduct **是、且定义合理**为「supplier-owned commercial product entity」。它是供给侧资产的核心承载，生命周期/治理完整。唯一缺口：**能力归属仅通过 `platform_product_id` 间接表达，缺独立 Capability 概念**；且当前 **0 条数据**（供给侧待重建）。

---

## 12. Product Audit

**Product = 什么？**

| 假设 | 判断 |
|---|---|
| Platform Product? | **接近** — Product 被 search/discovery 明确当作 **Capability Authority**（search.service.ts 注释「Platform Product = the Capability Authority」） |
| Catalog Product? | **部分** — `/products` 前端把它当产品目录渲染（ProductCard/Grid/Compare） |
| Canonical Product? | **部分** — 平台级唯一产品身份（SupplierProduct 挂靠） |

> 注意：当前**无技术原因**在 Catalog/Canonical/Platform 间冲突，因为 **没有 Product 数据（0 条）**，职责差异化尚未暴露。但从 Schema 上看 Product 同时承担「能力权威」与「目录商品」双重语义，**存在 Single-object-multi-responsibility 隐患**，是 Capability 独立化前的主要模糊点。

**产品职责边界矩阵**：

| 对象 | Platform 职责 | Admin 职责 | Supplier 职责 | Buyer 职责 |
|---|---|---|---|---|
| Product | 能力权威/目录 | 维护+发布 | 挂靠 SupplierProduct | 浏览/发现 |
| SupplierProduct | 供应商品 | 审核 | **创建/提交/发布** | 对比/询价 |
| Offer | 商业报价 | — | 创建 | 查看（RFQ capture） |
| Organization | 主体 | 治理 | 身份 | 身份 |

---

## 13. Supplier Audit

| 检查项 | 当前事实 | 证据 |
|---|---|---|
| Supplier 作为 Platform Entity | **否**（= Organization） | schema 无 supplier 表；org.type=SUPPLIER 视角 |
| Role/Permission | **无表**（String role + 后端 Role ADMIN/MEMBER/SUPPLIER + workspaceRole BUYER/SUPPLIER 分散） | schema organization_member.role=String；auth/role.enum.ts |
| Supplier Identity | 弱（Organization 别名） | 搜索 supplier 从 offer 聚合 |
| Supplier Discovery | **弱** | searchSuppliers 用 `SUBMITTED/ACCEPTED`（与 DB `ACTIVE/DRAFT` 不匹配 → 恒返回 0 结果）；facet search 里没有 supplier 一级 |

**结论**：**Supplier 未作为 Platform Entity**，而是 Organization 的视图别名。Supplier Listing/Profile（`/suppliers/[id]`）存在（Organization 渲染），但 Supplier Capability 对象缺失，Supplier Product 存在。`Supplier 搜索`是历史「供应商搜索」违规项残留（searchSuppliers 硬编码 offer status 不匹配 DB → 恒 0），应停用或修正为 Active-offer 聚合。Supplier 是否升级为独立 Platform Entity → §31 ADR-Candidate ADR-M34-08。

---

## 14. Category / Taxonomy Audit

**ProductCategory 是否承担过多职责？**

当前 `product_category`（table，28）承担：**产品分类**（products.categoryId）、**能力分类**（search 里它作为 Capability facet 的 label）、**Demand 分类**（demand.categoryId）、**知识映射**（product_category_knowledge_mapping→knowledge_category）。

**认知冲突**：同一个 ProductCategory 实体，同时被当作「产品类型」「能力分类」「需求分类」。746 已记录此类发现（Category/Capability/Product Type 混用）。

**Taxonomy Boundary 拆解**（当前 vs 应有）：

| 概念 | 当前持有者 | 应有语义 |
|---|---|---|
| Product Category（产品/能力分类） | product_category | 平台能力/产品分类骨架 |
| Capability Category（能力分类） | **不存在**（借用 product_category） | 若 Capability 独立，应有独立能力分类语义 |
| Inspection Scenario / Application / Technology Route | 无独立模型（content 的 tag 部分承担） | 洞察/知识分类 |
| Specification Domain | parameter_group | 参数域 |

**Target Taxonomy Boundary（建议）**：保留 ProductCategory 作为**能力/产品分类骨架**（Canonical），明确其是「Capability 归类维度」而非「商品枚举」；Knowledge/Insight 层面用 knowledge_domain/category 承载"场景/应用/技术路线"；Specification 域用 parameter_group。**职责归属放 §31 ADR-M34-05**（本任务不实施）。

---

## 15. Specification / Parameter Audit

审查：ParameterGroup / ParameterDefinition / ParameterOption / ProductParameterValue / ProductParameterDefinition / SupplierProductParameterValue / DemandParameter。

**Specification = Platform Standard 还是 Product Attribute？**

- 当前体系：`ParameterGroup→ParameterDefinition→(ParameterOption | ProductParameterValue | ProductParameterDefinition | DemandParameter | SupplierProductParameterValue)` —— 这是一套**参数定义体系（parameter-level）**。
- ProductParameterValue / SupplierProductParameterValue **绑定具体 Product / SupplierProduct**，属于「Product Attribute」。
- ParameterDefinition / ParameterGroup 是**平台级参数字典**（global），更接近「Platform Standard 的雏形」，但**没有「模板」概念**把一组参数定义归类成某个 Category/Capability 的 Spec Template。

**结论**：当前 Specification 处于**「参数字典 + 产品属性」阶段，未形成「Platform Specification Template」**（Category→Spec Template→Capability→SupplyProduct 的模板链不存在）。Path `Specification→Facet→Search→Comparison→Matching`：Facet/Search/Compare 已有（search + supplier-model-facet + compare），Matching 经 parameterDefinition 关联，但**缺 Spec Template 使 facet/compare/match 只能按零散参数，无法按能力级规格模板展开**。→ §31 ADR-M34-06。

---

## 16. Capability ↔ SupplyProduct Architecture

**核心架构决策评估（不创建 Schema，仅分析）**：

候选模型 A（指令给出）：
```
Capability ↕ M:N ProductCapability  ↕ SupplyProduct ↕ Supplier
```
候选模型 B：
```
Capability ↓ Specification ↓ Applicable Product Types ↓ SupplyProduct
```

**关系现状与差距**：

| 关系 | Current Reality | Evidence | Gap | Target |
|---|---|---|---|---|
| Capability ↔ SupplyProduct | **间接 N:1**（SupplierProduct.platformProduct_id→Product；Product=投影 capability） | schema L541 | 非直接能力关联，N:1 单向 | Capability 独立后 N:1（一个能力→多个供应产品），经 Capability 而非 Product |
| Capability ↔ Supplier | 经 SupplierProduct 间接 | graph 返回 SupplierProducts | Supplier 非实体 | 能力→供应商 Profile（独立 Supplier Entity） |
| Capability ↔ Category | 经 ProductCategory 间接 | search facet | 无能力级分类 | Capability 归类于 Category |
| Capability ↔ Specification | **无** | schema | **MISSING** | 能力→规格模板 |
| SupplyProduct ↔ Supplier | 直接（organizationId） | schema | — | 保持 |
| Product ↔ Specification | ProductParameterValue/Definition | schema | 无模板 | 经 Spec Template |
| Demand ↔ Match | 直接 | schema 686-709 | — | 保持 |
| Match ↔ RFQ | sourceMatchId | schema RFQ | — | 保持 |

**结论**：**Capability↔SupplyProduct 采用「Capability（独立）→ SupplyProduct（N:1）经组织（Supplier）」比「Capability↔SupplyProduct M:N + join 表」更契合当前架构**（因 SupplierProduct 天然归属一个平台能力），可避免引入 ProductCapability join 表的复杂度。是否独立 Capability 模型、是否引入 join 表 → §31 ADR-M34-01 / ADR-M34-04（DECISION CANDIDATE，需在新任务中冻结，本任务不决策落地）。

---

## 17. Search / Discovery Audit

**完整追踪 Search Intent → … → Rendering**（基于 746 + code 复核）：

```
Search Intent → SearchPage (/search) → URL State (keyword/categoryId/brand/series/pf/filters) 
→ lib/api/search.ts → GET /search → search.controller → search.service.search() 
→ prisma 六路并行（product/supplierProduct/knowledgeEntry/content(content+solution)/offer聚合supplier）
→ DTO 投影 → 前端分区渲染（products/supplierProducts/knowledge/content/solutions/suppliers）
```

**当前 Search 搜索什么？** 分类如下：

| 类别 | 实现 | 现状 |
|---|---|---|
| Keyword Search | 六实体全字段 contains | ✅ |
| Product Search | product.status='ACTIVE' + category + parameter facet | ✅（但数据=0） |
| SupplierProduct Search | PUBLISHED 边界 + brand/series/capability(category)/parameter/commercial | ✅ |
| Content Search | ARTICLE/INSIGHT + SOLUTION | ✅ |
| Knowledge Search | KnowledgeEntry PUBLISHED | ✅ |
| Capability Search | **无**（以 `platformProduct`/category 近似） | ⚠️ 近似 |
| Specification Search | **无独立**（仅参数 facet） | ⚠️ 近似 |
| Supplier Search | **违规残留**（`searchSuppliers` offer status SUBMITTED/ACCEPTED ≠ DB ACTIVE/DRAFT → 恒 0） | ❌ 恒空 |

**9.1 Current Search Capability（基于 746 事实逐项）**：

| 能力 | 状态 |
|---|---|
| Keyword | ✅ |
| Category | ✅（categoryId facet） |
| Parameter Filter | ✅（Product + SupplierProduct parameter facet） |
| Brand | ✅（SupplierProduct facet） |
| Series | ✅（SupplierProduct facet） |
| Offer Availability | ✅（hasActiveOffer） |
| Pagination | ✅（filter-before-pagination） |
| Sorting | ✅（createdAt/publishedAt desc + id） |
| URL State | ✅（可恢复/可分享） |

> **不得把「Parameter Filtering」描述成「Specification-driven Discovery」**。当前参数 facet 是对**全量参数定义的零散筛选**，无「能力级规格模板驱动」，且匹配上下文是 Search Context（Search→Product Population→Category Context→Relevant Parameters），不构成规格驱动的发现编排。

**Target Discovery（9.2）**：

| 发现内容 | 现有架构直接支持 | 需 API | 需数据模型 | 仅需前端 |
|---|---|---|---|---|
| Capability 发现 | ⚠️（现为 Product 近似） | 扩展 capabilities 只读 → 列表/筛选 | **Cad всех M32 零改动** | Capability listing route |
| Product 发现 | ✅ | — | — | 已有 |
| Supplier 发现 | ⚠️（现 offer 聚合坏） | 修正 searchSuppliers/或独立 supplier | 若升级 Supplier Entity | 已有 /suppliers |
| Specification 发现 | ⚠️ | Spec Template API | 若引入模板 | specification 呈现 |
| Application 发现 | 依赖 knowledge/tag | — | — | 内容层 |

---

## 18. Demand / Match / RFQ Audit

真实链：`Demand → DemandParameter → Matching → DemandMatch → RFQ → RFQResponse → Decision/Offer`。

| 环节 | Schema | 数据现状 | 端到端连续? |
|---|---|---|---|
| Demand（创建+参数） | Demand + DemandParameter | 3 | 后端完整 |
| Matching（评分） | DemandMatch（matchScore/matchStatus/matchDetails） | 0 | 后端程序化（ScoringService） |
| RFQ（源自 Match） | RFQ（sourceMatchId） | 2 | 存在 |
| RFQResponse | RFQResponse | 1 | 存在 |
| Decision/Offer | Offer link | 0 | 存在 |

**Business Workflow 与 Platform Discovery 是否连接？**
- 数据层 **Business Workflow 完整**（能 Demand→Match→RFQ→Response→Offer）。
- 但 **Discovery→Demand 环节弱**：发现对象（Capability/Specification）不独立，Buyer 从「浏览产品」到「建 Demand」缺一个明确的能力语义入口；且当前 demand=3/match=0 说明该管道在干运行状态未被真实数据驱动。
- **结论**：这条链在**业务/数据层成立，在发现语义层未真实连接**（发现对象不平台化是根因）。这是「业务闭环强、发现对象弱」的又一明证。

---

## 19. Buyer Journey

| 步骤 | 现状 | 分类 | Gap |
|---|---|---|---|
| Intent | 明确（检测能力需求） | 平台愿景 | — |
| Discovery / Search | `/search` 六类聚合 + 参数 facet | **PARTIAL** | 无能力独立入口/语义 |
| Filter / Compare | `/products/compare` + 参数 facet | **PARTIAL** | 基于零散参数，无规格模板 |
| Capability | 无独立页（产品详情「供应商型号」区投影） | **MISSING** | Capability 无对象 |
| Product | `/products/[slug]` | **SUPPORTED**（但数据=0） | 数据为空 |
| Supplier | `/suppliers/[id]`（Organization） | **PARTIAL** | Supplier 非实体 |
| Demand | `/workspace/demands/create` | **SUPPORTED** | — |
| Match | `/workspace/matches` | **SUPPORTED**（算法） | match=0 |
| Inquiry/RFQ | `/workspace/rfqs` | **SUPPORTED** | — |
| Response / Decision | `/workspace/rfqs/[id]` | **SUPPORTED** | — |

**Buyer 是否围绕「发现检测能力」完成任务？**
**部分**。Buyer 能走完采购任务链（Demand→Match→RFQ），但**「发现能力」环节未平台化**——Buyer 只能通过关键词/分类猜测产品的「能力」，没有独立 Capability/规格维度来"围绕一个检测能力浏览所有可供应源"。核心语义缺口在 Discovery 阶段的 Capability/Specification 对象。

---

## 20. Supplier Journey

| 步骤 | 现状 | 分类 | Gap |
|---|---|---|---|
| Supplier / Organization | `/dashboard/supplier` 正式工作台 | **SUPPORTED** | — |
| SupplyProduct（创建/规格/媒体） | `/workspace/supplier/...` | **SUPPORTED** | 数据=0 |
| Specification | SupplierProductParameterValue | **SUPPORTED** | 无模板 |
| Capability Mapping | 仅选 platformProduct | **PARTIAL** | 无独立能力对象 |
| Submit/Review/Publish | 生命周期 + reviewedBy | **SUPPORTED** | Admin 审核 |
| Discovery 呈现 | search PUBLISHED 边界 | **SUPPORTED** | 数据=0 |
| Lead/Inquiry | inquiryAvailable | **SUPPORTED** | inquiry=0 |
| RFQ → Response | supplier rfqs 页 | **SUPPORTED** | — |

**SupplierProduct 是否真正形成供应侧资产？**
**架构上**是（完整生命周期/治理），**实务上是空壳**（0 条）。供给侧资产等待 M34 平台化后重建。Supplier 的 Capability 发布心智（挂到哪个能力下）依赖 Capability 独立化。

---

## 21. Admin Governance

**Platform Rule Ownership Matrix**：

| Domain | Admin | Supplier | Buyer | Platform Automatic |
|---|---|---|---|---|
| Category | ✅维护 | — | — | — |
| Capability | **缺（无对象）** | — | — | — |
| Specification | ✅（parameter-definitions/groups） | — | — | — |
| Mapping | ✅（product-category-knowledge-mappings） | — | — | 部分 |
| Product | ✅维护+发布 | 挂靠 | — | — |
| Media | ✅（media/fileAsset orphan 治理） | 上传 | — | — |
| Document | ✅（fileType） | — | — | — |
| Review | ✅（SupplierProduct review） | 提交 | — | — |
| Publish | ✅ | 经审核 | — | — |
| Search Index | ⚠️（无独立索引控制） | — | — | ✅（WHERE 实时查） |
| Match | ✅（matching monitor） | — | — | ✅（ScoringService） |
| RFQ | ✅ | ✅ 响应 | ✅ 发起 | — |

**Admin 是否真正承担 Platform Governance？** **是，且是当前最成熟的一块**：Admin SPA 管理 Product/Category/Parameter/Demand/Match/User/Org/RFQ/Offer/SupplierProduct/Knowledge/Content/Mapping/Media/Audit。**唯一缺：Capability 治理**（因 Capability 无对象）。Controls：Admin 审核 SupplierProduct、维护 taxonomy/参数、管理 Mapping。搜索索引无显式管道（实时 WHERE → 可视为自动化）。

---

## 22. Public / Workspace Boundary

当前是「**Website + 角色重定向**」还是「**Continuous Platform**」？

| 连续性 | 现状 | 证据 |
|---|---|---|
| Navigation | 分离（Public 导航 vs 登录后 dashboard） | dashboard/page re-route 按 workspaceRole |
| Identity | 登录后分流到 Buyer/Supplier Dashboard | dashboard page |
| Context | 弱（Public→Workspace 无对象上下文传递） | — |
| Object Continuity | **弱**（产品→需求→匹配在各自 workspace 页，经 URL+store 跳转） | — |
| Search Continuity | **弱**（search 独立，不携带到 workspace） | — |
| Saved State / Demand / RFQ Continuity | 单个流程内连续；跨 Public/Workspace 无 | — |
| Buyer workspace | `/dashboard/buyer`（独立） | — |
| Supplier workspace | `/dashboard/supplier`（正式）+ `/workspace/supplier`（redirect 兼容层） | workspace/supplier page redirect |

**结论**：当前是 **「Website（Public 内容发现）+ Workspace 按钮/闸门」**，而非 Continuous Platform。Public 的发现对象（Product/Supplier/…）与登录后的工作区（Demand/Match/RFQ）靠链接/重定向串联，**缺乏平台级对象上下文连续（同一 Capability/Demand 贯穿 public→工作区）**。→ §31 ADR-M34-09。

---

## 23. Route / Information Architecture Audit

**当前实际 Route 清单与分类**：

| Route | 分类 |
|---|---|
| `/` | CANONICAL（home） |
| `/products`、`/products/[slug]`、`/products/compare` | CANONICAL（平台产品=能力目录） |
| `/categories` | CANONICAL/SECONDARY |
| `/search` | CANONICAL（统一发现） |
| `/suppliers/[id]` | SECONDARY（Org 渲染） |
| `/knowledge`、`/knowledge/[slug]`、`/knowledge-base`、`/knowledge-base/[slug]`、`/knowledge-base/domains/[slug]` | **DUPLICATE**（knowledge 与 knowledge-base 并存） |
| `/articles`、`/articles/[slug]` | SECONDARY（content） |
| `/insights`、`/insights/[slug]` | SECONDARY（content） |
| `/solutions`、`/solutions/[slug]` | SECONDARY（content） |
| `/business`、`/about`、`/offline`、`/tags/[slug]` | SECONDARY/INFORMATIONAL |
| `/dashboard`、`/dashboard/buyer`、`/dashboard/supplier` | CANONICAL（正式工作区） |
| `/workspace`、`/workspace/demands/*`、`/workspace/matches/*`、`/workspace/rfqs/*`、`/workspace/notifications`、`/workspace/settings` | CANONICAL（Buyer 工作区） |
| `/workspace/supplier/**` | **SECONDARY/COMPATIBILITY**（正式在 /dashboard/supplier；此分支为 Supplier runtime 页，与 dashboard 功能重叠） |
| `/supplier-models` | **LEGACY/ORPHAN**（遗留入口） |
| `/login`、`/register` | CANONICAL（auth） |

**15.1 Route Architecture Decision（Target Strategy，不实施）**：

| Target Route | Strategy | 说明 |
|---|---|---|
| `/capabilities`、`/capabilities/[slug]` | **INTRODUCE**（若 Capability 独立） | 能力目录/详情 |
| `/products`、`/products/[slug]` | **KEEP**（若 Product 仍为能力权威+目录）或 **REDIRECT→/capabilities** | 待 ADR |
| `/suppliers`、`/suppliers/[slug]` | **KEEP/INTRODUCE**（若 Supplier 独立 Entity） | 现为 /suppliers/[id] |
| `/categories`、`/categories/[slug]` | **KEEP** | — |
| `/search` | **KEEP** | — |
| `/knowledge` vs `/knowledge-base` | **MERGE**（统一为一条） | 消除 DUPLICATE |
| `/supplier-models` | **DEPRECATE** | 遗留 |
| `/workspace/supplier/**` | **REDIRECT→/dashboard/supplier**（已部分具备） | 收敛 |

> 仅定义 Target Strategy（KEEP/INTRODUCE/MERGE/REDIRECT/DEPRECATE/UNRESOLVED），**不迁移、不删除旧 Route**。

---

## 24. Interaction Model

| 模型 | 行为 |
|---|---|
| **Current Interaction** | **View → Learn → Contact**（浏览产品/内容 → 阅读 → 联系/询价 CTA） |
| **Target Interaction** | **Discover → Filter → Compare → View Supplier → Create Demand → View Match → Send Inquiry → Create RFQ → Respond → Quote** |

**Gap**：当前 CTA 偏「接触/询价」型（Corporate），目标应为「发现/比较/建需求/发起匹配/RFQ」型（Platform）。Buyer 应有明确的「对比/建需求/看匹配」主 CTA；Supplier 应有「发布能力/处理询价/响应 RFQ/报价」主 CTA。**不进行文案修改**（本任务只定义交互模型）。

---

## 25. Information Density

**信息是否围绕 Specification / Capability / Supplier / Product / Status / Availability / Match / Demand / RFQ 组织？**

- **有组织**：产品详情页含 Specification 参数区、SupplierProduct 区内含规格/媒体、Offer 商业层（价格/货币）、Compare 对比、matchScore/matchStatus、demand 参数、RFQ 流程。
- **未平台化**：Capability 无独立信息对象；Specification 仅嵌套参数；Availability 仅 hasActiveOffer 布尔；无能力级「可供应来源/厂商」聚合视图（除非在 capability graph API）。

**Hero / Marketing Copy / Brand Story / Corporate Claims 的角色**：首页以 Hero/品牌叙事/解决方案为重，属 **Corporate/Catalog 信息结构主导**；业务规格/能力密度低、宣传密度高。**Platform Information Density Assessment**：当前为「Catalog/内容站密度」，目标是「规格/能力/供应源/txn 状态密度」为主导的平台密度。视觉重设计（M33）未改变信息分布，仍是信息架构层问题。

---

## 26. Knowledge / Insight Architecture

| 对象 | 当前角色 |
|---|---|
| Core Platform Object | Product(=Capability Authority)/SupplierProduct/Demand/Match/RFQ —— **交易与能力承载** |
| Supporting Knowledge Layer | KnowledgeDomain→Category→Entry + Content(ARTICLE/INSIGHT/SOLUTION) + content tags —— **学习/洞察辅助层** |

**边界判定**：Knowledge/Article/Insight/Standard/Reference**应作为辅助层（Supporting Layer）**，不应与 Core Object（Capability/Product/Supplier）同级竞争一级对象身份。理由：
- 知识经 `ProductCategoryKnowledgeMapping`（确定性映射）接入能力上下文，是**能力发现的知识增强**，不是发现主链。
- 若把 Knowledge 也提为一级对象，会造成 IA 与 Governance 的双重竞争。

**架构价值对比**：
- `Specification → Specification Insight`：把规格参数与知识/参考打通（Buyer 理解参数意义），**价值高**、是能力上下文的自然延伸。
- `Article → Product`：内容→产品（钩子式内容营销），价值普通。

**结论**：Knowledge 定位为 **Conset 辅助知识层**，重点建设 `Specification/Capability → 相关标准/Insight` 的知识增强，而非把 Knowledge 提为一级平台对象。→ §31 ADR-M34-11（DECISION CANDIDATE）。

---

## 27. SEO / LLM Discoverability

| 项 | 现状 | 证据 |
|---|---|---|
| Metadata/OG | ✅ 基础扎实（title/desc/OG/Twitter 全站） | lib/seo-config.ts + generateMetadata |
| Canonical | ✅（absoluteUrl 基于 SITE_URL） | seo-config |
| Robots | ✅（robots.ts） | — |
| Sitemap | ✅（sitemap.ts） | — |
| JSON-LD | ✅（block/breadcrumb） | seo.tsx |
| Structured Data | 部分（无 Capability/Specification/Product schema.org） | — |
| Heading/Semantic HTML | ✅ | — |
| Internal Linking | 中等 | — |
| Indexability | ✅ | — |
| **SITE_URL** | **⚠️ 占位 `https://visndt.example.com`** | lib/seo.tsx L13 `process.env.NEXT_PUBLIC_SITE_URL || 'https://visndt.example.com'` → canonical/sitemap/OG url 全部指向占位域名 |

**Capability/Product/Supplier/Category/Specification 被 Google/Bing/LLM 如何理解？**
- **Product**：有独立 URL + metadata，可索引；但 **状态=ACTIVE 字段非枚举**（schema status=String），语义不标准。
- **Category**：有 URL + name/slug，实体清晰。
- **Capability / Specification**：**无独立 URL / 无 JSON-LD / 无语义锚点** → Google/Bing/LLM 不能作为独立实体理解（除非经产品详情嵌套文本）。746 已标记。
- **Supplier**：有 `/suppliers/[id]` + metadata（name/type/status），但**无 schema.org Organization/Product 结构化标记**。
- **Platform Semantic Anchors**：缺失（除 Product/Category 外，Capability/Specification/Supplier 无 schema.org 锚点）。

**结论**：SEO 基建（metadata/canonical/robots/sitemap/JSON-LD）扎实，但**实体语义层缺失 + SITE_URL 占位**。LLM 无法把 Capability/Specification 当独立实体消费。**不修改 SEO**，记录为 M34 Gap。

---

## 28. Mobile Experience Architecture

**Target Pattern（375 / 768 / 1024 / 1440）**：

| 断点 | 视口 | Target Pattern |
|---|---|---|
| 375 | Mobile | Phone：单列、底部导航/抽屉 filter、折叠规格、单列卡片、CTA 常驻 |
| 768 | Tablet | Tablet：双列、抽屉仍可用、表单半屏 |
| 1024 | Intermediate | 双列+侧栏、facet 侧栏 |
| 1440 | Desktop | 宽版：三列、full facet 侧栏、对比表 |

**重点组件（Mobile/Tablet/Intermediate/Desktop 信息层级）**：

| 组件 | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | 底部 tab + 汉堡 | 折叠 + tab | 全宽顶导 |
| Search | 全屏抽屉/顶栏 | 顶栏 | 顶栏+侧栏 |
| Filter / Facet | MobileFilterDrawer | 抽屉 | 固定侧栏 |
| Compare | 底部 CompareBar | 折叠 | 宽对比表 |
| Specification | 折叠/手风琴 | 手风琴/表 | 全参数表 |
| Capability | 卡片 | 卡片 | 详情+侧栏 |
| Supplier | 卡片 | 卡片+部分 | 完整 Profile |
| Demand Form / RFQ | 单列长表单 | 半屏 | 多列 |
| CTA | 常驻底部 | 悬浮 | 侧栏/内联 |

> **不是简单缩放**。M33 已做 responsive 视觉，但平台对象的移动呈现（Capability/Spec 折叠、Supplier Profile、对比）需在 Target IA 中结构化定义。**不修改 UI**。

---

## 29. Existing Capability Reuse

| Existing Capability | Current Reality | Reuse 建议 |
|---|---|---|
| Product | 能力权威 + 目录，0 数据 | ✅ Direct / 升级为 Capability 载体 |
| SupplierProduct | 完整供应商品实体 + 生命周期 | ✅ **Adapt**（保留，作为 Capability 的 N:1 供应来源） |
| Supplier（Org 别名） | `/suppliers/[id]` + search 弱 | Adapt（若升级 Supplier Entity） |
| Parameter | 完整字典 + facet | ✅ **Adapt**（升级为 Specification Template 数据源） |
| Search | 六类聚合 + 参数 facet | ✅ **Adapt**（扩展 capability/spec dimensions，修正 supplier 恒0） |
| Demand | 完整模型 + 参数 | ✅ **Direct** |
| Match | 评分 + 状态 | ✅ **Direct** |
| RFQ | 完整流程 | ✅ **Direct** |
| Knowledge | 域名/分类/条目 + 映射 | ✅ **Adapt**（作为辅助知识层） |
| Admin Governance | **最完整**（全对象治理） | ✅ **Direct / Adapt**（补 Capability 治理） |

**尤其寻找**：
- **Already Exists + Not Exposed**：① Capability 能力图（discovery.service 已有聚合）已存在但仅单 `GET :id`，未暴露为列表/可搜索/可导航；② SupplierProduct comparison/technical data 已存在（discovery.service 已 select parameterValues）但用户入口弱；③ Parameter 字典已存在但未组织为 Spec Template；④ Admin 治理能力已存在但缺 Capability 治理页。
- **Already Exists + Wrongly Positioned**：① Product 同时身兼能力权威+目录商品；② Supplier 搜索从 Offer 聚合且 status 硬编码错误（恒 0）；③ `/knowledge` 与 `/knowledge-base` 重复；④ `/supplier-models` 遗留入口。

---

## 30. Architecture Gap Register

> Architecture Gap ≠ Visual Issue。视觉问题不在此登记（M33 范畴）。

| ID | Severity | Domain | Current State | Evidence | Gap | Candidate Resolution | Layer | M34 Priority |
|---|---|---|---|---|---|---|---|---|
| G-01 | P1 | OBJECT_MODEL | Capability 无对象（仅投影） | schema 无 capability；discovery 投影 | 能力无身份/无生命周期/无治理 | 独立 Capability 对象（ADR-M34-01） | DB+API+Front | High |
| G-02 | P1 | OBJECT_MODEL | Product 双重职责（能力权威+目录） | search 注释 + /products 页 | 语义混叠 | 定义 Capability/Product 边界（ADR-M34-03） | DB | High |
| G-03 | P1 | SUPPLIER | Supplier 非实体（=Org 别名），搜索恒 0 | searchSuppliers status 硬编码 | 无供应商发现 | Supplier Entity + 修正 search（ADR-M34-08） | API+DB | High |
| G-04 | P1 | SPECIFICATION | 无 Spec Template | 仅 parameter 字典 | 无法按能力规格模板扩展 | Specification Template（ADR-M34-06） | DB+API | High |
| G-05 | P1 | IA / ROUTE | Capability/Specification 无 canonical route | app 无 /capabilities /specifications | 无可索引发现入口 | Canonical Route（ADR-M34-10） | Front | Medium |
| G-06 | P1 | TAXONOMY | Category 兼任产品/能力/需求分类 | product_category 复用 | 职责冲突 | Taxonomy Boundary（ADR-M34-05） | DB | Medium |
| G-07 | P1 | SEARCH | Search 非规格驱动 | 参数 facet 零散 | 发现缺能力语义 | SearchObject Model（ADR-M34-07） | API | High |
| G-08 | P2 | IA / ROUTE | /knowledge 与 /knowledge-base DUPLICATE；/supplier-models ORPHAN | route 清单 | 冗余路由 | Merge/Deprecate（ADR-M34-10） | Front | Low |
| G-09 | P2 | OBJECT_MODEL | SupplierProduct 能力归属仅 platformProductId 间接 | schema L541 | 无直接能力关联 | Capability↔SupplyProduct（ADR-M34-04） | DB | Medium |
| G-10 | P2 | SEO | SITE_URL 占位 visndt.example.com | seo.tsx L13 | canonical/sitemap/OG 错域 | 配置真实域名 | Config | High |
| G-11 | P2 | SEO | Capability/Specification/Supplier 无 schema.org 语义 | 无 JSON-LD 实体 | LLM 无法理解实体 | 结构化语义锚点 | Front | Medium |
| G-12 | P2 | GOVERNANCE | 缺 Capability 治理 | Admin 无 capability 页 | 无法治理能力 | Admin Governance（ADR-M34-12） | Front+API | Medium |
| G-13 | P2 | DISCOVERY | public/workspace 连续性弱 | 各工作区独立 | 平台体验断裂 | Continuity（ADR-M34-09） | Front | Medium |
| G-14 | P2 | IA | workspace/supplier 与 dashboard/supplier 冗余 | redirect 壳 | 入口冗余 | 收敛 | Front | Low |
| G-15 | P3 | DATA | product/supplier_product 供给侧空 | count=0 | 干运行 | 平台化后重建（M34 后续） | Data | — |
| G-16 | P3 | BACKEND | Product.status=String 非枚举 | schema L362 | 语义不标准 | 可选枚举化（非优先） | DB | Low |
| G-17 | P3 | ROUTE | AdminConsole 入口默认 localhost:3001 | dashboard/page | 无独立 admin 端口确认 | 运行时核验 | Config | Low |

---

## 31. Architecture Decision Candidates

> 以下仅作为 **DECISION CANDIDATE**，除非项目流程明确授权，否则**不创建正式 ADR、不修改 ADR**。

| Candidate | 议题 | 状态 |
|---|---|---|
| ADR-M34-01 | Capability 独立对象 | CANDIDATE |
| ADR-M34-02 | SupplyProduct Canonical Definition | CANDIDATE（当前已基本合理） |
| ADR-M34-03 | Product / SupplyProduct Relationship | CANDIDATE |
| ADR-M34-04 | Capability ↔ SupplyProduct M:N | CANDIDATE（初步倾向 N:1 via Capability，需冻结） |
| ADR-M34-05 | Category / Capability / Specification Boundary | CANDIDATE |
| ADR-M34-06 | Specification Template Governance | CANDIDATE |
| ADR-M34-07 | Search / Discovery Object Model | CANDIDATE |
| ADR-M34-08 | Supplier Discovery Architecture | CANDIDATE |
| ADR-M34-09 | Public / Workspace Continuity | CANDIDATE |
| ADR-M34-10 | Canonical Route Strategy | CANDIDATE |
| ADR-M34-11 | Knowledge / Insight Supporting Layer | CANDIDATE |
| ADR-M34-12 | Platform Governance Model | CANDIDATE |

共 **12 个** DECISION CANDIDATE。无正式 ADR 创建/修改。

---

## 32. Backend / API / Schema Change Gate

> 每个 Target Change 分类，**不得因目标架构"看起来更合理"就判定必须改 DB**。

| Change | Category | Why / Evidence |
|---|---|---|
| Capability 独立对象 | **SCHEMA CHANGE + BACKEND + API + FRONTEND** | 需 capability(表)+生命周期+CRUD+路由 → 真实新对象（G-01） |
| Product 职责收敛（Capability Authority vs 目录） | **SCHEMA CHANGE**（若独立 Capability）或 **FRONTEND ONLY**（若保持 Product 为能力载体） | 取决于 ADR-M34-01/03 |
| Specification Template | **SCHEMA CHANGE + API**（新增模板关联）或仅 API（用现有参数组合） | 若需 Category→Template 关联 → schema；否则 API/FRONTEND |
| Search 规格驱动 | **API ADAPTATION + 可能 FRONTEND**（若 Capability/Spec 对象存在）；否则 FRONTEND ONLY | search 已有 facets，主要补 capability dimension |
| Supplier 独立 Entity | **SCHEMA CHANGE + API**（若升级独立表）或 **API ADAPTATION + FRONTEND**（若仅修正搜索聚合） | 倾向 API+Front 修正 searchSuppliers 恒 0（NO SCHEMA） |
| Route Architecture | **FRONTEND ONLY**（新增/合并/redact routes） | 无 DB 影响 |
| Knowledge 辅助层 | **FRONTEND + 可选 API ADAPTATION** | 复用现有知识 → NO SCHEMA |
| Admin Capability 治理 | **FRONTEND + 若 Capability 独立则 BACKEND/API** | 依赖 ADR-M34-01 |
| SITE_URL | **CONFIG ONLY** | 占位符 → 真实域名，无代码变更 |

**计数**：Frontend-only=2（Route、Knowledge 呈现）；API Adaptation=2（Search 规格驱动、Supplier 搜索修正）；Backend Change=2（Capability、Admin Capability 若独立）；Schema Change=2-3（Capability 对象、Spec Template 若新增、Supplier 若独立）；Migration Required=仅当 schema 变更落地（本轮定义，不实施）。

---

## 33. Target Platform Object Model

> TARGET CANDIDATE，非预先确定答案。需 ADR 冻结后落地。

```
Capability（独立一级对象，能力权威）
    ↕ N:1（Capability → 多 SupplyProduct）
SupplyProduct（supplier-owned commercial product，保留）
    ↓ 1:N Organization(=Supplier)
Supplier（若升级：独立 Profile Entity）

Capability ↕ Specification Template（能力→规格模板）
Capability ↕ Category（能力归类于能力/产品分类）
Demand ↓ DemandParameter ↓ Match ↓ (Capability/Product) ↓ RFQ ↓ Response ↓ Offer
Knowledge（辅助层）↔（Category ∝ Capability Spec Insight）
```

| 对象 | Definition | Ownership | Lifecycle | Discovery | Navigation | Frontend | Governance |
|---|---|---|---|---|---|---|---|
| Capability | 检测能力（平台级） | Platform | CRUD | 独立 | /capabilities | 独立页+卡片 | Admin |
| SupplyProduct | 供应商商品 | Supplier | 现有 | PUBLISHED | /capabilities/[id] | — | Admin review |
| Supplier | 能力提供方 | — | — | 修复 | /suppliers | — | Admin |
| Category | 能力/产品分类 | Admin | — | facet | /categories | — | Admin |
| Specification | 规格模板/参数 | Admin+Supplier | — | facet | 详情 | — | Admin |
| Demand/Match/RFQ | txn 闭环 | Buyer | 现有 | — | workspace | — | Admin |
| Search | 发现加速层 | — | — | core | /search | — | auto |

---

## 34. Target Information Architecture

依据审计结果建议（非机械复制；DISCOVER 为首位）：

```
DISCOVER   ├── Capabilities
           ├── Products（或并入 Capabilities）
           ├── Suppliers
           ├── Categories
           └── Specifications
PUBLISH    ├── Supplier（/dashboard/supplier）
           ├── SupplyProducts（规格/媒体/文档/提交/审核/发布）
CONNECT    ├── Demand → Match（Buyer workspace）
           ├── Inquiry / RFQ / Response
LEARN      ├── Knowledge（辅助层）
           ├── Standards / Insights
WORKSPACE  ├── Buyer（/dashboard/buyer）
           └── Supplier（/dashboard/supplier）
ADMIN      └── Governance（Product/Category/Parameter/Capability/SupplierProduct/Demand/…）
```

> 依据：Capability 独立化后 DISCOVER 首位；PUBLISH 归入 Supplier 工作台；LEARN 作为辅助层；Workspace 明确 Buyer/Supplier。

---

## 35. Target Buyer / Supplier / Admin Journey

**Buyer（Current → Target → Gap）**：
- Current：Keyword+Cate→Product→Filter→Inquiry
- Target：Intent→Capability→Spec→Supplier(可选)→Product→Demand→Match→RFQ→Response→Decision
- Gap：能力独立入口 + 规格模板 + 供应源聚合（G-01/04/05/07）

**Supplier（Current → Target → Gap）**：
- Current：Org→SupplierProduct→（数据=0）
- Target：Supplier→SupplyProduct→Spec→Capability Mapping→Publish→Discovery→Lead/Inquiry→RFQ→Response
- Gap：Capability 发布心智 + 供应侧重建（G-01/03/15）

**Admin Target Operating Model**：
- Admin：Taxonomy→Capability→Spec→Mapping→Validation→Review→Publish→Governance
- Supplier：Product→Data→Media→Document→Submit
- Platform：Index(实时) Match(Scoring) Discover Connect Record(audit/conversion/workflow)

---

## 36. Target Operating Model

| 工作 | 人工 | 规则化 | 自动 | 保留审核 |
|---|---|---|---|---|
| Taxonomy/分类维护 | Admin | ✅ | — | — |
| Capability 定义 | Admin | — | — | — |
| Specification 模板 | Admin | 部分 | — | — |
| 参数 facet / 搜索索引 | — | ✅ | ✅ | — |
| Matching 评分 | — | ✅ | ✅ | — |
| 供应数据提交 | Supplier | ✅ | — | — |
| 媒体/文档 | Supplier | — | — | — |
| SupplierProduct 审核 | — | 部分 | — | **✅ Admin 审核** |
| RFQ 决策 | Buyer | — | — | — |
| 转化/审计记录 | — | — | ✅ | — |

**Low-Operation + Supplier-driven + Platform-governed**：Admin 收缩到税法/能力/规格/审核；Supplier 驱动供给；平台自动化 index/match/discover；人工决策仅在审核+RFQ。

---

## 37. Monetization Boundary（架构边界分析，不实施）

| 层 | 是否 Core Platform | 说明 |
|---|---|---|
| Basic Exposure（能力/产品公开可见） | ✅ Core | 当前 |
| Premium Exposure | Monetization Layer | 后续 |
| Lead / Inquiry | Core（inquiryAvailable） | 当前为消息链路，非计费 |
| RFQ | Core | 交易连接，非收费 |
| Advertising | Monetization Layer | 后续 |
| Data / Intelligence | Monetization Layer | 后续 |

**明确**：不实施收费能力；不把 Marketplace/Transaction 提升为当前核心范围。当前 Core = DISCOVER + PUBLISH + CONNECT + GOVERN。

---

## 38. M34 First-Round Implementation Scope

**5-7 主任务（Target，受审计结果约束，AG 门控）**：

| # | Task Name | Objective | Scope | Completion Criteria | Expansion Gate | Out of Scope | Dependencies | Layer |
|---|---|---|---|---|---|---|---|---|
| T1 | Capability Object Definition | 冻结 Capability 是否独立+如何建模 | ADR-M34-01/03/04 起草+冻结 Capability 对象定义 | ADR 冻结；Model 定义明确 | 需 750 决策 | 不建表 | 749 基线 | ADR/DB |
| T2 | Product/Capability 语义收敛 | 明确 Product vs Capability 边界 | ADR-M34-03 + IA 判定 | 边界定义清晰 | 750 | 不迁移 | T1 | ADR/IA |
| T3 | Supplier Discovery 修复 | 修复 supplier 搜索恒0 + 定位 Supplier 边界 | searchSuppliers 修正 + ADR-M34-08 | 供应商发现可用 | 是否独立实体待 ADR | 不建 Supplier 表（除非获批） | T1 | API |
| T4 | Specification Template 规划 | 定义 Category→Spec Template→Capability 链 | ADR-M34-06 + 模板数据模型草案 | 模板定义完成 | 若需 schema 变更入 750 | 不实施 CRUD | T1/T2 | DB/API |
| T5 | Canonical IA & Route 策略 | 定义 capability/products/suppliers/categories/search/knowledge 合并 | ADR-M34-10 + Target IA 冻结 | Route 策略定稿 | 750 | 不迁移路由 | T1/T2 | Front/IA |
| T6 | SEO/LLM 语义锚点 | Capability/Spec/Supplier schema.org + SITE_URL | 语义实体 JSON-LD 设计 + 域名配置 | 语义结构设计完成 | 750 | 不动线上 SEO | T5 | Front/Config |
| T7 | Public/Workspace 连续性设计 | 平台级上下文连续 | ADR-M34-09 + 对象连续性方案 | 连续性方案定稿 | 750 | 不改代码 | T5 | Front/UX |

**不提前规划**：M34.8+ / M34.9+ / 无限子任务。

---

## 39. Implementation Readiness

| 条件 | 达成? |
|---|---|
| Core Object Model Stable | **NOT STABLE**（Capability/Product 边界未定，ADR 未冻结） |
| Relationships Stable | **NOT STABLE**（Capability↔SupplyProduct 未定） |
| IA Stable | **NOT STABLE**（Capability route 未定） |
| Journey Stable | 业务闭环 stable，但发现对象 journey 未定 |
| Search Direction Stable | 方向明确（补 capability/spec dimension），细节未定 |
| Scope Stable | 本轮已定义 7 主任务 | 
| 架构决策集合 | 12 个 CANDIDATE 已识别，未冻结 |

**结论**：存在「Capability Definition unresolved / Product 语义 unresolved / Core Relationship unresolved / Canonical IA unresolved」，按指令 §34 **NOT READY — 需在 750 冻结关键决策后才能进入实现**。

> **STOP IMPLEMENTATION**（749 不进入实现；进入 750 Architecture Freeze gate）。

---

## 40. M34 Roadmap Progress Alignment

**按 PROJECT_ROADMAP 重新计算的 M34 进度**（非机械复制 40%）：

```
M34 Pre-Implementation Baseline
[█████████░░░░░░░░░░░░] ≈ 45%

├─ 746 Current-State Fact Base
│   [████████████████████] COMPLETE
├─ 747 Data Safety Baseline
│   [████████████████████] COMPLETE
├─ 748 Controlled Data Cleanup
│   [████████████████████] CONDITIONAL PASS / CLOSED
├─ 749 Platform Experience Architecture Audit
│   [████████████████░░░] COMPLETE / CONDITIONAL（本次）
└─ 750 Architecture Freeze + Implementation Gate
   [........................] NOT STARTED
```

- **Overall M34 Progress**：≈ 45%（4/7 个规划门已完成或进行中）
- **Current Task Progress**：749 = COMPLETE（CONDITIONAL）
- **Next Planned Gate**：750_M34_Platform_Architecture_Freeze_And_Implementation_Gate（NOT STARTED）

> 说明：45% 由「M34 规划内门（746/747/748 完成，749 完成，750 未开始，实现未开始）」按 5 个主要门中已完成 3 个 + 1 个正在完成估算，非机械复制 40%。最终以项目路线为准。

---

## 41. Documentation Synchronization

同步以下单元，反映 **749 = COMPLETE / CONDITIONAL**、**750 = NEXT GATE**、**M34 Implementation = NOT STARTED**：

| 文档 | 变更 |
|---|---|
| PROJECT_STATUS.md | 新增 §749 M34 Platform Experience Architecture Audit — CONDITIONAL PASS |
| PROJECT_ROADMAP.md | 新增 749 条目；Next Gate: 750 |
| MODULE_COMPLETION_MATRIX.md | 新增 749 行（COMPLETE/CONDITIONAL）；750 NOT STARTED |

> 未写成「Implementation Ready」（因 749 判定 NOT READY INTO IMPLEMENTATION，见 §39）。

---

## 42. Final Decision

**Task Status：CONDITIONAL PASS**

- ✔ Current Architecture Fully Audited（对象/IA/Search/Journey/Admin/SEO/Mobile 全覆盖）
- ✔ Core Object Model Audited（Capability/Product/SupplierProduct/Supplier/Spec 全复核）
- ✔ IA Audited（route 分类 + Target IA）
- ✔ Search Audited（六类聚合 + 规格驱动缺口）
- ✔ Buyer/Supplier/Admin Audited（journey + governance matrix）
- ✔ Target State Defined（§33 对象 + §34 IA + §35 journey）
- ✔ Gap Register Defined（§30，17 项）
- ✔ M34 Scope Boundary Defined（§38，7 主任务）
- ✔ Implementation Gate Defined（§39 NOT READY → 750）
- ✔ Roadmap Progress Aligned（§40）
- ✔ Documentation Synchronized（§41）

**Condition（明确）**：
- **Impact**：Capability 与 Product 的最终关系、Specification 是否引入模板、Supplier 是否独立实体，需在 750 冻结；不阻断 Target State 定义（本任务已给出候选方向）。
- **Required Follow-up**：750_M34_Platform_Architecture_Freeze_And_Implementation_Gate —— 冻结 ADR-M34-01/03/04/05/06/08 等决策，确认 Capability 建模方向与 First-Round scope。

**明确**：**NOT READY INTO IMPLEMENTATION**；**STOP**；不自动进入 750 / M34.1 / Capability 实现 / Schema 设计等。下一项工作须由新独立任务授权。

---

## 38. Mandatory Architecture Tables

### 38.1 Object Reality Matrix

| Object | Current Model | DB | API | Frontend | Runtime | Current Status | Target Direction |
|---|---|---|---|---|---|---|---|
| Capability | 无 | 无表 | discovery/capabilities GET:id 投影 | 无 | 后端可返回图形 | RUNTIME-ONLY / PROJECTION | 独立一级对象 |
| SupplyProduct | SupplierProduct | supplier_product | supplier-products | dashboard/supplier 间接 | search 使用 | FULL（0 数据） | 保留为供应实体 |
| Product | Product | product | products | /products、/products/[slug] | 能力权威 | FULL（0 数据） | 能力载体或收敛 |
| Supplier | 无（=Organization） | =organization | =organizations | /suppliers/[id] | — | AMBIGUOUS（别名） | 独立 Profile（候选） |
| Category | ProductCategory | product_category | product-categories | /categories | facet | FULL | 能力分类骨架 |
| Specification | 无独立（参数层） | parameter_* | parameter-definitions | 详情内参数区 | compare/facet | PARTIAL | Spec Template |
| Demand | Demand | demand | demands | /workspace/demands | 3 | FULL | 保持 |
| Match | DemandMatch | demand_match | matching | /workspace/matches | 0 | FULL | 保持 |
| RFQ | RFQ | rfq | rfqs | /workspace/rfqs | 2 | FULL | 保持 |

### 38.2 Relationship Matrix

| Relationship | Current Reality | Evidence | Gap | Target |
|---|---|---|---|---|
| Capability ↔ SupplyProduct | 间接 N:1（platformProductId） | schema L541 | 非直接 | N:1 via Capability |
| Capability ↔ Supplier | 经 SupplierProduct 间接 | graph | 无直接 | 经独立 Supplier |
| Capability ↔ Category | 经 product.categoryId | search | 无独立 | 能力归类于分类 |
| Capability ↔ Specification | **无** | schema | MISSING | 经 Spec Template |
| SupplyProduct ↔ Supplier | 直接 organizationId | schema | — | 保持 |
| Product ↔ Specification | ParameterValue/Definition | schema | 无模板 | 经模板 |
| Demand ↔ Match | 直接 | schema | — | 保持 |
| Match ↔ RFQ | sourceMatchId | schema | — | 保持 |

### 38.3 Ownership Matrix

| Object | Platform | Admin | Supplier | Buyer |
|---|---|---|---|---|
| Capability | 定义 | 维护/治理 | 选择/挂靠 | 发现 |
| Category | 定义 | 维护 | — | 浏览 |
| Specification | 字典/模板 | 维护 | 填值 | 比较 |
| Product | 能力权威 | 维护+发布 | 挂靠 | 浏览 |
| SupplierProduct | 发布边界 | 审核 | 创建/提交/发布 | 对比/询价 |
| Supplier Product | — | 治理 | 维护 | 浏览 |
| Demand | — | 查看 | — | 创建/管理 |
| RFQ | — | 查看 | 响应 | 发起 |

### 38.4 Architecture Change Matrix

| Change | Current | Gap | Needed Layer | Priority |
|---|---|---|---|---|
| Capability Object | 投影 | 无对象 | DB+API+Front | High |
| SupplyProduct | FULL | 0 数据 | (重建数据) | — |
| Category/Capability | 混用 | 边界 | DB/IA | Medium |
| Specification Template | 参数层 | 无模板 | DB+API | High |
| Search Discovery | 六类聚合 | 非规格驱动 | API+Front | High |
| Supplier Discovery | 恒 0 | 坏聚合 | API | High |
| Route Architecture | /knowledge 重复等 | 冗余 | Front | Low |
| Governance | 缺 Capability | 无能力治理 | Front+API | Medium |

---

## 39. Evidence Requirement（关键证据索引）

| 判定 | 证据 |
|---|---|
| Capability=Projection | `apps/api/src/discovery/capabilities.controller.ts`（入参=Product UUID）；`discovery.service.ts::findCapabilityGraph`；`schema.prisma` 无 capability 模型 |
| Product=Capability Authority | `apps/api/src/search/search.service.ts` L275「Platform Product = Capability Authority」；`/products` 路由 |
| SupplierProduct 完整 | `schema.prisma` L538-579（生命周期+reviewedBy）；`discovery.service.ts` |
| Supplier=Org 别名 | schema 无 supplier 表；`dashboard/page.tsx` org.type；search.service `searchSuppliers` |
| Supplier search 恒 0 | `search.service.ts` L526 status `SUBMITTED/ACCEPTED` vs DB `ACTIVE/DRAFT` |
| Search 六类聚合 | `search.service.ts` search() 六并行（products/supplierProducts/knowledge/content/solutions/suppliers） |
| Specification=参数层 | `schema.prisma` L425-499 ParameterDefinition/Value + search facet |
| Category 多职责 | `schema.prisma` L337 ProductCategory（products/demands/knowledgeMappings） |
| SITE_URL 占位 | `apps/web/src/lib/seo.tsx` L13 `'https://visndt.example.com'` |
| Route 重复/遗留 | `apps/web/src/app`（knowledge vs knowledge-base；supplier-models） |
| Admin 治理缺 Capability | `apps/admin/src/router/index.tsx`（无 capabilities 路由） |
| 数据基线 | 本次读库 SELECT（product=0, supplier_product=0, offer=0, demand=3, rfq=2, knowledge=6, content=8, audit=2857） |

---

## 44. Final Execution Output

- Task ID: **749**
- Task: **M34 Platform Experience Architecture Audit**
- Task Status: **CONDITIONAL PASS**
- Repository: `F:\Desktop\VISNDT`
- Code Root: `F:\Desktop\VISNDT\VISNDT`
- Branch: `main`
- Commit: `ff03a9a368f3490094cf57015ce4799904ad283c`
- Working Tree: OTHER（未提交改动保留）
- Environment: Development（Web :3001 / API :4000 / PG :5432 / MinIO :9000-9001）
- Mutation: **NONE**；Database Mutation: **NONE**；Storage Mutation: **NONE**
- M33: CLOSED / UNCHANGED
- 746: COMPLETE；747: COMPLETE / CONDITIONAL；748: COMPLETE / CONDITIONAL
- **Current Platform Classification**: Hybrid（Website-first 偏重 / Platform Object 弱）
- **Current Platform Maturity**: **Level 2（Discovery Website，向 Level 3 迁移中）**
- **Capability**: RUNTIME-ONLY / Projection（无对象）
- **SupplyProduct**: 完整供应实体（0 数据）
- **Product**: 能力权威 + 目录双重职责
- **Supplier**: Organization 别名（非实体）
- **Specification**: 参数层（非平台对象）
- **Search**: 六类聚合检索 + 参数 facet；非规格驱动；Supplier 维度恒 0
- **Buyer Experience**: Discovery→Demand 弱（能力无独立入口）
- **Supplier Experience**: 工作台完整但供给侧空
- **Admin Governance**: 最成熟，缺 Capability 治理
- Major P0: 0；Major P1: 7；Major P2: 7；Major P3: 3
- Architecture Decision Candidates: 12
- Backend Changes Required: 2；API Changes Required: 2；Schema Changes Required: 2-3；Frontend-only Changes: 2
- Target Platform Object Model: Capability(独立)↔N:1 SupplyProduct→Supplier + Spec Template + txn 闭环（§33）
- Target IA: DISCOVER(Capabilities/Products/Suppliers/Categories/Specifications) / PUBLISH / CONNECT / LEARN / WORKSPACE / ADMIN（§34）
- M34 First-Round Scope: 7 bounded workstreams（§38）
- Implementation Readiness: **NOT READY**（需 750 冻结关键决策）
- Next Gate: **750_M34_Platform_Architecture_Freeze_And_Implementation_Gate**
- Review Report: `docs/_review/749_M34_Platform_Experience_Architecture_Audit_Report.md`

---

## 45. M34 Roadmap Progress Alignment — Mandatory

```
M34 Pre-Implementation Reconstruction   ≈45%
  746 Current-State Fact Base           COMPLETE
  747 Data Safety Baseline              COMPLETE / CONDITIONAL
  748 Controlled Data Cleanup           COMPLETE / CONDITIONAL / CLOSED
  749 Platform Experience Architecture  COMPLETE / CONDITIONAL（本次）
  750 Platform Architecture Freeze      NOT STARTED
  M34 First-Round Implementation        NOT STARTED
```

- Current Position: M34 规划 5 个主要门中的第 4 个（749）
- Current Task: 749
- Completed Gates: 746 / 747 / 748 / 749
- Next Gate: 750
- Implementation Started: **NO**
- Remaining Planned Work: 750 Freeze → M34 First-Round (T1-T7)
- Overall Progress: ≈45%

> 禁止：完成后自动执行 750。

---

## 48. Execution Principle Reconfirmation

`Verify → Read → Measure → Reconcile → Classify → Model → Analyze Relationships → Analyze Journeys → Analyze IA → Define Target State → Define Gap → Define Scope → Define Implementation Gate → Align Roadmap → STOP`

## 49. Final Governance Statement

本任务目的是**证明并定义** VISNDT = Capability + SupplyProduct + Supplier + Specification + Discovery + Demand + Match + Inquiry/RFQ + Governance + Workspace 能否成为一个**可发现、可搜索、可比较、可连接、可发布、可持续增长、低运营成本**的工业 B2B Discovery Platform。已完成 Current State + Gap + Target State + Scope Boundary + Implementation Readiness + Roadmap Alignment。然后 **STOP**。

Not done: 未自动进入 750 / M34.1 / Capability 实现 / Schema 设计 / 搜索实现 / 首页重设计 / 路由迁移 / UI 开发。