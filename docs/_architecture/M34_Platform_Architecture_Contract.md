# M34_Platform_Architecture_Contract

## Status

**FROZEN / VALIDATED WITH CONDITIONS** — M34.0 Architecture Decision Consolidation（750）+ Architecture Consistency Challenge（751）

Status: **FROZEN — VALIDATED WITH CONDITIONS（GATE B）**

> 本契约经 751 架构一致性挑战严格反证（Challenge A-K）后：**核心决策成立（VALIDATED）**，但叠加 **6 项非阻断前置条件（CONDITIONS）**，须在 M34.1–M34.6 实施 gate 内显式满足。M34.1 为 **AUTHORIZABLE（CONDITIONAL）**，须下一条独立指令正式授权。

Related Stage: M34.0 → M34.1–M34.7（750 冻结 / 751 挑战验证）

Related Review Report:

- `docs/_review/750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate_Report.md`
- `docs/_review/749_M34_Platform_Experience_Architecture_Audit_Report.md`
- `docs/_review/751_M34_Platform_Architecture_Consistency_And_Capability_Model_Challenge_Report.md`

---

> 本契约仅收录 750 任务**正式冻结（ACCEPTED）**的架构决策。
> REJECTED / CANDIDATE / FUTURE / DEFERRED / UNRESOLVED 一律**不写入**本契约作为正式架构事实。
> 改写自 750 报告 §6-§16，作为 M34 实施阶段的技术约束。

---

# 1. Canonical Object Model（正式冻结）

## 1.1 Product = Capability Authority + Catalog

- **Definition**：Product 是平台级能力权威对象，同时承担能力发现目录职责；Capability 是 Product 的**发现语义角色**，非独立数据库实体。
- **Ownership**：Admin / Platform。
- **Lifecycle**：沿用现有 `product.status`（DRAFT/…）；不新建独立 Capability 状态机。
- **Canonical Identity**：`product.id` + `slug`；Canonical Route `/products/[slug]`。
- **Relations**：Category（`categoryId`）／ Offer / SupplierProduct（`platformProductId`）／ DemandMatch / Inquiry。
- **Discovery**：`/products` + 统一 search（product，Capability Authority）。
- **Governance**：Admin（能力权威创建/发布/治理）。

## 1.2 SupplyProduct = Supplier-owned Commercial Product

- **Definition**：供应商拥有的商业产品（能力型号），挂载于一个平台 Product（Capability）。
- **Ownership**：Supplier。
- **Lifecycle**：复用现有 `SupplierProductStatus`（DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED），**不重新设计**。
- **Canonical Identity**：`supplier_product.id` + `slug`。
- **Relations**：Organization（`organizationId`）／ Product（`platformProductId` 1:N）／ Offer / ParameterValues / Media。
- **Discovery**：统一 search（supplierProducts，能力型号 + 品牌/系列/参数 facet）。
- **Governance**：Admin Review + Publish。

## 1.3 Supplier = Organization + Profile 语义

- **Definition**：Supplier = Organization（`type=SUPPLIER`）+ supplier-specific profile 语义。**不新增独立 Supplier 表**。
- **Ownership**：Organization owner。
- **Relations**：supplierProducts / offers / RFQ.target/ responses / inquiries。
- **Discovery**：`/suppliers/[id]` + search（API Adaptation 暴露供应商维度）。
- **Governance**：Admin；搜索暴露修复归入 M34.4/M34.6，NO SCHEMA。

## 1.4 Category / Capability / Specification 边界

- **Category**：一级对象（`product_category`），Admin 治理，分类法 + facet。
- **Capability**：Product 的发现语义角色（非独立表）。
- **Specification**：参数规格**横切发现维度**（parameter 字典），非一级对象、**不建独立 `/specifications` 路由**。
- 禁止无语义边界的模糊术语（能力分类/产品能力/能力标签）作为定义跳板。

## 1.5 Specification 架构

- M34.1 冻结：**Parameter Dictionary only**（Model A）。
- Specification 作为横切维度，供 Product / SupplyProduct / Demand / Search / Facet / Compare / Match / Admin 消费。
- Specification Template（Category+Capability→模板）为 **DEFERRED**，仅在证明必要后进入独立评估（触发 Schema Change Assessment），不属于本契约正式事实。

## 1.6 Demand / Match / RFQ / Inquiry / Workspace / Knowledge

- Demand：Buyer 采购需求（workspace 对象，现有 DemandStatus）。
- Match：需求-能力（Product）确定性撮合评分（现有 DemandMatchStatus；`DemandMatch.productId`）。
- RFQ：询价单（Buyer 发起，现有 RFQStatus；`RFQ.sourceMatchId`/`targetOrganizationId`）。
- Inquiry：询盘连接（现有 Inquiry）。
- Workspace：Buyer/Seller 正式工作台（`/dashboard/buyer`、`/dashboard/supplier`）。
- Knowledge：辅助知识层（非一级对象），支撑 LEARN。

---

# 2. Relationship Contract（正式冻结）

| Relationship | Frozen State |
|---|---|
| Capability ↔ Product | Capability=Product 发现角色（等价） |
| Capability ↔ SupplyProduct | **1:N**（`SupplierProduct.platformProductId → Product`；方向唯一） |
| Capability ↔ Supplier | 间接（经 SupplyProduct / Offer）；补充检索维度 |
| Capability ↔ Category | Product.categoryId（Capability 归 Category） |
| Capability ↔ Specification | Product→参数（ParameterValue）聚合 |
| Product ↔ SupplyProduct | 1:N（SupplierProduct.platformProductId→Product） |
| Product ↔ Supplier | 经 offer/product 间接暴露 |
| SupplyProduct ↔ Supplier | organizationId（复用） |
| SupplyProduct ↔ Specification | SupplierProductParameterValue（复用） |
| Category ↔ Specification | 无直接关系（Spec Template 为 DEFERRED） |
| Demand ↔ Specification | DemandParameter（复用） |
| Demand ↔ Match | demandId（复用） |
| Match ↔ Product/Capability | productId（复用） |
| Match ↔ RFQ | RFQ.sourceMatchId（复用） |
| RFQ ↔ Supplier | targetOrganizationId + responses.organizationId（复用） |
| Response ↔ Offer | RFQResponse.offerId（复用） |

**Cardinality 方向冻结**：`Capability(Product) 1 → N SupplyProduct`。M:N / Secondary Capability = FUTURE（须独立评估 join entity + governance），不进入本契约。

---

# 3. Target Information Architecture（正式冻结）

```
DISCOVER   ├─ Capabilities(=Products 能力权威 · /products)
           ├─ Suppliers（/suppliers · Organization）
           ├─ Categories（/categories · facet）
           └─ Specifications（参数横切维度 · 非独立路由）
PUBLISH    ├─ Supplier 工作台（/dashboard/supplier）
           └─ SupplyProducts（规格/媒体/文档/提交/审核）
CONNECT    ├─ Demand → Match（Buyer workspace）
           └─ Inquiry / RFQ / Response
LEARN      ├─ Knowledge / Standards / Insights（辅助层 · /knowledge-base canonical）
WORKSPACE  ├─ Buyer（/dashboard/buyer） / Supplier（/dashboard/supplier）
ADMIN      └─ Governance（Product/Category/Parameter/SupplyProduct/Demand/…）
```

---

# 4. Route Strategy（冻结策略，不执行迁移）

| Route | Frozen Strategy |
|---|---|
| `/products`, `/products/[slug]` | **KEEP**（能力权威目录 + 详情） |
| `/capabilities`, `/capabilities/[slug]` | **NOT INTRODUCED**（Capability=Product 角色；不建独立路由） |
| `/suppliers`, `/suppliers/[id]` | **KEEP**（Organization 语义供应商） |
| `/categories`, `/categories/[slug]` | **KEEP** |
| `/search` | **KEEP**（统一搜索） |
| `/knowledge` | **MERGE** → `/knowledge-base`（DEPRECATE 触发点） |
| `/knowledge-base` | **KEEP（Canonical / 辅助层知识库）** |
| `/supplier-models` | **DEPRECATE**（遗留） |
| `/workspace/supplier` | **MERGE** → `/dashboard/supplier`（兼容壳，已重定向） |
| `/dashboard/supplier`, `/dashboard/buyer` | **KEEP（Canonical Workspace）** |

---

# 5. Ownership / Governance（正式冻结）

| 职责域 | Owner |
|---|---|
| Category / Capability(=Product) / Specification 字典 / Product | Admin / Platform（Rules） |
| SupplyProduct / Media / Document | Supplier（Assets，Admin 审核） |
| Demand / RFQ | Buyer（Intent） |
| Match / Search Index / Audit | Platform（Automatic，deterministic） |

**Governance 原则**：Platform = Rules + Discovery/Match/Workflow/Audit（自动化）；Supplier = Supply Asset；Buyer = Demand/Procurement Intent。Admin 保全 Taxonomy/Capability/Review/Publish 人工治理。

---

# 6. Public / Workspace Continuity（正式冻结）

连续性 = **Database Object Reference + Canonical URL + Workspace Persist** 三重复合（**非**「加一个工作台按钮」）。

| Context | 跨越 Public→Workspace |
|---|---|
| Capability/Product Context | 是（URL + object id） |
| Supplier Context | 是（URL + object id） |
| Demand / RFQ / Match Context | 是（workspace 持久对象 + DB reference） |
| Search Context | 部分（URL query，不做跨工作区持久化） |

---

# 7. Change Gate（正式冻结）

| 域 | Gate |
|---|---|
| Schema | **NO CHANGE**（M34.1）；Spec Template=DEFERRED 未来 |
| API | **CONDITIONAL**（Supplier discovery 暴露 + Capability/参数搜索增强） |
| Backend | **NO CHANGE**（无业务重构） |
| Frontend | **FRONTEND ONLY**（语义命名 / merge / deprecate / 连续性） |
| Config | **SITE_URL 配置 FOLLOW-UP**（不在本契约内实现） |

禁止因「未来需要」提前修改 Schema；禁止为命名新增 Supplier / Capability / Specification Template 表（除非独立任务证明必要）。

---

# 8. Implementation Gate（正式冻结）

M34.1–M34.7 为 **FROZEN FIRST-ROUND IMPLEMENTATION WORKSTREAMS**（仅作为范围约束，**不自动开始执行**）：

| Workstream | Established Decision | Out-of-Scope |
|---|---|---|
| M34.1 Capability & Product Foundation | Capability=Product 语义；Product 权威 | 不建表 / 不迁移 |
| M34.2 Capability/SupplyProduct/Supplier 关系 | 1:N 契约 + Organization 复用 | M:N 未来 |
| M34.3 Taxonomy & Specification | Category/Capability/Spec 边界 | Spec Template DEFERRED |
| M34.4 Discovery/Search 体验 | 统一搜索 + Capability 维度 + Supplier 暴露 | 不实现代码 |
| M34.5 Canonical IA + Public/Workspace 连续性 | Route 策略 + 连续性 | 不执行迁移 |
| M34.6 Buyer/Supplier 工作流集成 | Demand→Match→RFQ 工作台闭环 | 不实现 |
| M34.7 Governance + SEO/LLM + Mobile | 治理 + 语义锚 + Mobile Contract | SITE_URL Config Follow-up |

**约束**：不得拆分为 M34.1.1、不得 M34.8+、不得自动执行本阶段。进入 M34.1 须**新的独立执行授权**。

---

# 9. Relationship Cardinality Guard

- 唯一冻结 Cardinality：**`Capability(Product) 1 → N SupplyProduct`**。
- M:N / Secondary Capability：FUTURE，非正式事实。
- 任何正式实施不得改写本契约中冻结的 Identity / Cardinality / Route / Governance / Lifecycle，除非经新的架构决策任务修订。

---

# 10. 751 Validation Conditions（加入正式约束，经 GATE B 验证）

> 751 Architecture Consistency Challenge（GATE B — VALIDATED WITH CONDITIONS）确定的**非阻断前置条件**。均为**零 Schema / 声明 / 约束 / 接线方向**，不改写 750 冻结决策，仅补充实施条件，纳入 M34.1–M34.6 gate。

## 10.1 Capability 级 Specification 权威（REQUIRED BEFORE M34.1）

- **权威来源**：Capability Spec = **Product-derived**（Product 原始 `ParameterValue` 值集合）+ **Admin-curated Typical**（人工策展能力级典型值）。
- **Search**：参数 facet 沿用**原始参数值**（`searchProducts`/`searchSupplierProducts` 现状）。
- **Match**：`DemandParameter` 对能力原始参数（现状，确定性撮合）。
- **实现**：Capability 级典型值/聚合为**展示层/检索层投影**；**不新建表、不新增字段、不做迁移**。
- **谁改/审/显示**：Admin 策展与审核；Supplier 仅维护自身 SupplyProduct 参数。

## 10.2 Category = Capability 粒度治理约束（REQUIRED）

- **Category 必须按能力/检测对象粒度治理**，作为 Capability-led 入口锚。
- 若 Category 非能力粒度，则 Capability 退化为对 Product 的 naming，`capability-led` 不成立。
- 无新表；纳入 ADMIN/Governance（M34.3/M34.5）。

## 10.3 Supplier 发现接线修正（NO SCHEMA）

- Supplier 搜索改为基于 **`SupplierProduct.status=PUBLISHED`**（Organization 汇总已发布型号→Capability）作为发现基线。
- 现有 `searchSuppliers`（依 `Offer.status in SUBMITTED/ACCEPTED`）标记 **legacy**，解除 Supplier 发现对既有交易行为的依赖。
- 变更类型：API ADAPTATION + FRONTEND（NO SCHEMA），归 M34.4/M34.6。

## 10.4 Search 能力意图映射前置（NO SCHEMA）

- M34.4 增加「能力意图 → Category」taxonomy/synonym 映射，使自然语言 intent 可自动进入 Capability Context；现状仅关键字（Product name/model/description）+ Category/参数 facet。

## 10.5 Frontend Capability-led 纪律（FRONTEND ONLY）

- 能力注册表减少 Product Gallery/Compare 语义表面（`/products/compare`、CompareBar≤4）；强化 Category 铁轨 + 参数 facet 为能力路径；Capability 与 Product 在 UI 上可区分。归 M34.4。

## 10.6 SEO/LLM 语义锚文档化

- 确认「Product 承担能力 SEO 实体（products/[slug]）」「无独立 Capability URL/entity」为**既定边界**；Capability 语义经 Product 页 + Category landing + 参数结构化内容表达。
- SITE_URL 配置 follow-up（`seo.tsx` 占位 `https://visndt.example.com`）。

---

# 11. Implementation Gate（751 Revalidated）

- **Architecture Gate**：**GATE B — VALIDATED WITH CONDITIONS**（核心模型成立；无 Critical Contradiction；6 项条件进入实施 gate）。
- **M34.1 Authorization**：**AUTHORIZABLE（CONDITIONAL）** —— 本契约**不授权 M34.1 执行**；须下一条独立 TRAE 指令正式授权。
- **§10 conditions 不得跳过**：M34.1 启动前 §10.1 Spec 权威为强制前置；其余 5 项须在各自 workstream 显式落实。

---

# 12. M34.1 Implementation State（首轮平台化前端基础）

> M34.1 Capability & Product Foundation 已执行（CONTROLLED IMPLEMENTATION + VERIFICATION + DOCUMENTATION SYNCHRONIZATION）。
> 本节点记录 **Implementation State** 与 **751 Mandatory Gates Compliance**；历史报告（749/750/751）未修改。

## 12.1 执行状态

- **触发**：751 GATE B 判定 M34.1 AUTHORIZABLE（CONDITIONAL）；经独立 TRAE 指令正式授权后执行。
- **Repository**：`F:\Desktop\VISNDT`；Code Root `F:\Desktop\VISNDT\VISNDT`；branch `main`；commit `ff03a9a`；Working Tree OTHER。M33=CLOSED / UNCHANGED。
- **执行模式**：Frontend-Only；NO Schema / NO Migration / NO API / NO Backend Change / NO Database·Storage Mutation。

## 12.2 Capability / Product Foundation State

| 契约对象 | 冻结定义 | M34.1 落地状态 |
|---|---|---|
| Product | Canonical Platform Object（identity=`product.id`，Route `/products/[slug]`） | **IMPLEMENTED**（identity 与 URL 未变；无第二套 Capability 身份） |
| Capability | Product 的发现语义角色（非独立实体） | **IMPLEMENTED**：`apps/web/src/lib/capability-context.ts` 纯展示层 view model，确定性派生自 Product/Category/ParameterValue/SupplierProduct/Organization |
| Category | 能力导向 taxonomy 锚 | **VERIFIED**（能力粒度分类锚定，如工业内窥镜/光纤成像内窥镜/超声波探伤仪等 28 项） |
| Specification | Product-derived 原始参数横切维度 | **IMPLEMENTED**：spec `source=PRODUCT`、`isTypical=false`（Capability Typical = NOT IMPLEMENTED） |
| SupplyProduct | Supplier-owned Commercial Product（1:N via `platformProductId`） | **UNCHANGED**（未重新定义为 Capability） |
| Supplier | Organization(`type=SUPPLIER`) 语义角色 | **IMPLEMENTED（前端上下文）**：供应主体 = PUBLISHED SupplierProduct + Organization，不依赖 Offer |
| Compare | Technical Product Comparison | **UNCHANGED**（/products/compare，字段源自 Specification） |

## 12.3 751 Mandatory Gates Compliance

| Gate | 定义 | M34.1 Status |
|---|---|---|
| C1 | Capability = Product 语义角色 | **PASS**（代码/UI/文档无第二套 Capability identity） |
| C2 | Category = Capability 粒度 | **PASS**（M34.1 使用路径成立） |
| C3 | Specification = Product-derived | **PASS**（source=PRODUCT，isTypical=false，无伪造 Typical） |
| C4 | Primary Capability only | **PASS**（Capability 1→N SupplyProduct 复用既有关系；未建 M:N） |
| C5 | Supplier 发现边界 | **PASS**（Published SupplyProduct + Organization；不依赖 Offer） |
| C6 | Capability-led Search Hook | **PASS**（保留 capabilityUrl/categoryPath 语义锚；未退化为纯关键字） |
| C7 | Domain/Schema 稳定性 | **PASS**（后端/API/Schema NO CHANGE；Migration NONE） |

## 12.4 验证

- **Static**：build exit 0（含 TypeScript）+ lint exit 0（仅既有 warnings）。
- **Runtime**：`/` `/products` `/categories` `/search` 全 200；无 POST/PUT/PATCH/DELETE 测试数据。
- **Mobile**：CDP 375/768/1024/1440 无水平溢出；导航/Capability 锚可达。
- **Functional Acceptance**：AC-01..AC-10 满足（AC-02 Product Canonical / AC-05 Specification 不伪造 Typical / AC-07 无新表 / AC-10 四档可完成核心产品发现阅读）。

## 12.5 边界保持（Expansion Gate CLOSED）

- Secondary Capability / Capability Table / Specification Template / Supplier Directory / Search Intent Engine / Semantic Search / AI / RAG / New Taxonomy Engine / Marketplace / Monetization 全部保持 **DEFERRED / NEXT WORKSTREAM / FUTURE**。
- **M34.2 NOT AUTHORIZED**。本任务已 STOP；后续 Workstream（M34.2–M34.7）须新的独立授权。

---

> **历史约束不变**：本契约 §1-§11 冻结决策（Identity / Cardinality / Route / Governance / Lifecycle / §10 Conditions）**未被 M34.1 改写**。任何修订须新的架构决策任务。报告：`docs/_review/M34.1_Capability_And_Product_Foundation_Implementation_Report.md`

---

# 13. M34.2 Implementation State（Capability / SupplyProduct / Supplier 供给关系基础）

> M34.2 Capability / SupplyProduct / Supplier Relationship 已执行（CONTROLLED IMPLEMENTATION + VERIFICATION + DOCUMENTATION SYNCHRONIZATION）。本节点记录 **Implementation State** 与继承条件保持；历史报告（749/750/751/752）未修改。

## 13.1 执行状态

- **触发**：751 GATE B + 752（M34.1）完成后，经独立 TRAE 指令正式授权执行 M34.2。
- **模式**：CONTROLLED IMPLEMENTATION + VERIFICATION + DOCUMENTATION SYNCHRONIZATION。
- **范围**：仅前端最小关系落地；**NO Schema / NO Migration / NO API / NO Backend Change**。
- **状态**：CONDITIONAL PASS（条件：`supplier_product=0` 基线限制 Real-data Runtime / 真实数据语义渲染补证）。

## 13.2 继承条件保持

| Condition | 定义 | M34.2 状态 |
|---|---|---|
| C2 | Category = Capability 粒度 | **CONDITIONAL（保持）** — 路径保留，非全量能力实现 |
| C5 | Supplier Discovery Boundary | **FOUNDATION / NOT FULL DISCOVERY（保持）** — Published SupplyProduct + Organization 可发现，非全量发现 |
| C6 | Capability-led Search | **FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（保持）** — 仅 Hook 保留，非全量能力搜索 |

三态**开始写入、结束保留，未升级**；本任务为 Foundation/关系基础。

## 13.3 Supplier Relationship State

| 契约对象 | 冻结定义 | M34.2 落地状态 |
|---|---|---|
| Product = Capability Authority | 1:N SupplyProduct | 保持；`platformProductId` 挂点稳定 |
| SupplyProduct = Supplier-owned Product | N:1 Organization | 未被重新解释为 Capability；生命周期未动 |
| Supplier = Organization(type=SUPPLIER) 角色 | NO SCHEMA | `SupplierContext` 视图模型（`supplier-context.ts`），不新增表/Model/FK |
| 供应商发现边界 | ≥1 PUBLISHED SupplyProduct + Organization(type=SUPPLIER) | 后端 `discovery.service.ts` 强制 PUBLISHED；零 Offer 依赖 |

## 13.4 751 Mandatory Gates Compliance（M34.2）

- **C2 = CONDITIONAL（未升级）**；**C5 = FOUNDATION / NOT FULL DISCOVERY（未升级）**；**C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（未升级）**。
- §10.3 Supplier 发现接线修正方向（Published SupplyProduct）在 M34.2 **显式落实并强制**（SupplierContext 仅消费 PUBLISHED + Organization）。

## 13.5 验证

- Static：`pnpm --filter @visndt/web build` exit 0（含 TS）；lint exit 0（仅存量 warnings，新文件零警告）。
- Runtime：API :4000 health ok/database connected；Web :3000 核心只读路由全 200；**Real-data Runtime = UNVERIFIED（Evidence Gap，supplier_product=0 基线）**。
- Mobile：CDP 375/768/1024/1440 无水平溢出，`/suppliers/:id` 全宽无溢出。

## 13.6 边界保持（Expansion Gate CLOSED）

- Secondary Capability / M:N Capability / Capability Table / Supplier Table / Specification Template / Full Supplier Discovery / Full Capability-led Search / Semantic Search / AI / RAG / Search Intent Engine / Marketplace / Monetization 全部保持 **DEFERRED / NEXT WORKSTREAM / FUTURE**。
- **M34.3 NOT AUTHORIZED**。本任务已 STOP；后续 Workstream（M34.3–M34.7）须新的独立授权。

---

> **历史约束不变**：本契约 §1-§11 冻结决策（Identity / Cardinality / Route / Governance / Lifecycle / §10 Conditions）+ §12（M34.1）+ §13（M34.2）**未被 M34.2 改写**。任何修订须新的架构决策任务。报告：`docs/_review/753_M34.2_Capability_SupplyProduct_Supplier_Relationship_Implementation_Report.md`

---

# 14. M34.3 Implementation State（Taxonomy & Specification Foundation）

> M34.3 Taxonomy & Specification Foundation 已执行（CONTROLLED IMPLEMENTATION + TAXONOMY / SPECIFICATION FOUNDATION + EVIDENCE VALIDATION + DOCUMENTATION SYNCHRONIZATION）。本节点记录 **Implementation State** 与继承条件保持；历史报告（749/750/751/752/753）未修改。

## 14.1 执行状态

- **触发**：751 GATE B + 752（M34.1）+ 753（M34.2）完成后，经独立 TRAE 指令正式授权执行 M34.3。
- **模式**：CONTROLLED IMPLEMENTATION + EVIDENCE VALIDATION + DOCUMENTATION SYNCHRONIZATION。
- **范围**：全量 Category inventory + 证据化语义分类 + Category/Product/Parameter 交叉验证 + 参数字典审计（Usage/Ownership/Provenance）+ 数值单位一致性 + Facet 溯源闭环 + 三层 Specification 边界（Product/SupplyProduct/Demand）+ Hidden Domain Object 审计 + Mobile 层级验证 + Static/Runtime + 数据对账。
- **零变更面**：**NO Schema / NO Migration / NO API / NO Backend / NO Frontend code**；仅新增 4 个只读审计探针脚本。
- **状态**：CONDITIONAL（Foundation complete + 已知非阻断证据缺口：Real-data Runtime UNVERIFIED / 768 平板溢出（既有）/ 字典标准化与测试分类残留待治理）。

## 14.2 继承条件保持

| Condition | 定义 | M34.3 状态 |
|---|---|---|
| C2 | Category = Capability 粒度 | **CONDITIONAL（保持）** — 16 合法能力/设备粒度分类 + 12 测试残留 + 冗余别名，非全量能力实现 |
| C5 | Supplier Discovery Boundary | **FOUNDATION / NOT FULL DISCOVERY（保持）** |
| C6 | Capability-led Search | **FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（保持）** |

三态**开始写入、结束保留，未升级**；本任务为 Vocabulary / Taxonomy / Specification Foundation。

## 14.3 Taxonomy / Specification Foundation State

| 契约对象 | 冻结定义 | M34.3 落地状态 |
|---|---|---|
| Category | Taxonomy Node（能力导向锚） | **VERIFIED**：28 全量 inventory（16 合法 + 12 TC测试残留）；能力/设备/场景/载体四类语义；冗余别名未收敛（治理项） |
| Capability | Product 的发现语义角色（非独立实体） | **保持**（无 Capability Entity） |
| Specification | 参数横切发现维度（非独立对象） | **NONE Entity**（无独立表/路由/模板） |
| ParameterDefinition | **唯一 Specification Dictionary authority** | **VERIFIED**：54 defs / 11 groups / 45 options；Usage/Ownership/Provenance 明确；7 组同义重复 + °C/℃ 单位待标准（治理项） |
| ProductParameterValue | Platform Product Value | **Boundary PRESERVED**（值表独立） |
| SupplierProductParameterValue | Supplier-owned Model Value | **Boundary PRESERVED**（值表独立） |
| DemandParameter | Buyer Constraint | **Boundary PRESERVED**（值表独立，不与 Product 值合并） |
| Facet Provenance | Facet → ParameterDefinition → Actual Value | **闭环（结构级）**：`:id/parameters` 确定性映射，无硬编码筛选项 |
| Category ↔ Specification | 无直接表关系；CategoryParameterTemplate=DEFERRED | **PRESERVED**（`Category→Product→Parameter` 联动；不建模板） |

## 14.4 754 Mandatory Gates / Boundary

- **Schema = NO CHANGE；Migration = NONE；DB/Storage Mutation = NONE**（Before=After 全表对账一致）。
- **Hidden Domain Object = NONE**（无 Capability / Specification / SpecTemplate / CategoryParameterTemplate / M:N / 第二 Domain Authority）。
- **Parameter Ownership 明确**：Admin=Category+Parameter Dictionary；Supplier=SupplyProduct 参数；Buyer=Demand 参数；Automatic=Facet/Match/Audit/Validation（Low-Operation，无人工逐产品策展）。
- **API = NO**（KEEP `GET /product-categories/:id/parameters`）；**Backend Domain Logic = NO CHANGE**。
- **C2 = CONDITIONAL（未升级）**；**C5 = FOUNDATION / NOT FULL DISCOVERY（未升级）**；**C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（未升级）**。

## 14.5 验证

- **Static**：`pnpm --filter @visndt/web build` exit 0（含 TS）+ `pnpm --filter @visndt/web lint` exit 0（仅存量 warnings）。
- **Runtime Economics**：API :4000 health 200；web :3000 `/categories` 200；`/product-categories/:id/parameters` 200（空数组，结构正确）。Real-data Runtime = UNVERIFIED（product/supplier_product=0 空基线，Evidence Gap）。
- **Mobile**：CDP 375/1024/1440 无水平溢出；768 溢出 140px（**既有基线问题**，非 M34.3 引入，归 M34.5）。
- **Functional Acceptance**：AC-01..AC-17 满足/条件满足（详 754 报告 §34）。

## 14.6 边界保持（Expansion Gate CLOSED）

- CategoryParameterTemplate / Specification Template / Secondary Capability / M:N Capability / Capability Table / Search Intent Engine / Natural Language Search / Semantic Search / AI / RAG / Vector / Full Supplier Discovery / Full Capability-led Search / Marketplace / Monetization 全部保持 **DEFERRED / NEXT WORKSTREAM / FUTURE**。
- 参数字典标准化（同义去重 / 单位统一）与 12 个测试残留分类清理 = **NEXT/FUTURE 数据治理任务**（遵循 748 受控清理纪律，本任务不删除）。
- **M34.4 NOT AUTHORIZED**。本任务已 STOP；后续 Workstream（M34.4–M34.7）须新的独立授权。

---

> **历史约束不变**：本契约 §1-§11 冻结决策（Identity / Cardinality / Route / Governance / Lifecycle / §10 Conditions）+ §12（M34.1）+ §13（M34.2）+ §14（M34.3）**未被 M34.3 改写**。任何修订须新的架构决策任务。报告：`docs/_review/754_M34.3_Taxonomy_And_Specification_Foundation_Implementation_Report.md`

---

# 15. M34.4 Implementation State（Discovery / Search Foundation）

> M34.4 Discovery / Search Foundation 已执行（CONTROLLED IMPLEMENTATION + ARCHITECTURE-CONSTRAINED VALIDATION）。本节点记录 **Implementation State** 与继承条件保持；历史报告（749/750/751/752/753/754）未修改。

## 15.1 执行状态

- **触发**：751 GATE B + 752（M34.1）+ 753（M34.2）+ 754（M34.3）完成后，经独立 TRAE 指令正式授权执行 M34.4。
- **模式**：CONTROLLED IMPLEMENTATION + ARCHITECTURE-CONSTRAINED VALIDATION。
- **范围**：将 M34.1/M34.2/M34.3 冻结的 Product / Capability / SupplyProduct / Supplier / Category / Specification Foundation 连接为可运行的 Discovery / Search Foundation（Search Intent → Category Context → Specification/Parameter Filter → Product → Published SupplyProduct → Supplier）。
- **核心修正**：后端 `searchSuppliers` 由 **Offer-dependent（legacy，恒 0）** 重构为 **PUBLISHED SupplierProduct → Organization(type=SUPPLIER) 聚合**（契约 §10.3 Supplier 发现接线修正，逐步落实）。仅 **NO Schema / NO Migration / NO new Domain Authority**。
- **变更面**：`apps/api/src/search/search.service.ts`（**MINIMAL READ-ONLY ADAPTATION**，单文件）；Frontend=NO CHANGE；Schema / Migration / DB / Storage=NO CHANGE。
- **状态**：CONDITIONAL PASS（Discovery Foundation implementation complete + 无架构违规 + 无未授权 Schema + 无受保护数据变更 + Static PASS + 可验证层 Runtime PASS；条件 = 真实数据空基线导致 Real-data Runtime UNVERIFIED + 既有非阻断 768 溢出）。

## 15.2 继承条件保持

| Condition | 定义 | M34.4 状态 |
|---|---|---|
| C2 | Category = Capability 粒度 | **CONDITIONAL（保持）** |
| C5 | Supplier Discovery Boundary | **FOUNDATION / NOT FULL DISCOVERY（保持）** |
| C6 | Capability-led Search | **FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（保持）** |

三态**开始写入、结束保留，未升级**；本任务为 Discovery / Search Foundation。

## 15.3 Discovery / Search Foundation State

| 契约对象 | 冻结定义 | M34.4 落地状态 |
|---|---|---|
| Search Wiring | UI → URL/State → API client → API → Backend Search → Prisma Query → Result | **VERIFIED**（确定性可追溯链路） |
| Category Discovery | Category Context → Product discovery chain | **VERIFIED**（结构）；真实产品渲染 UNVERIFIED（0 数据） |
| Specification / Facet | Parameter facet → ParameterDefinition provenance | **VERIFIED（结构级）**；真实值 UNVERIFIED |
| Product / Capability Authority | Product 为能力权威+目录一体对象 | **VERIFIED**（AC-04） |
| SupplyProduct | Published Supplier-owned Commercial Product | **VERIFIED**（结构，AC-05） |
| Supplier Discovery Foundation | **PUBLISHED SupplyProduct → Organization** | **VERIFIED**（AC-06 / AC-07；不再要求 Offer） |
| Full Supplier Discovery | NOT CLAIMED | — |
| Full Capability-led Search | NOT CLAIMED | — |

## 15.4 755 Mandatory Gates / Boundary

- **Schema = NO CHANGE；Migration = NONE；DB/Storage Mutation = NONE；Test Data Creation = NONE**（Before=After 数据一致）。
- **API = MINIMAL READ-ONLY ADAPTATION**（`search.service.ts` 单文件，Supplier 分组聚合源修正）；无 POST/PUT/PATCH/DELETE 业务验证。
- **无新实体**：无 Capability Entity / Supplier Table / Specification Table / Search Index / AI / Vector / Semantic / Matching / RFQ 修改（AC-08 / AC-09 / AC-10）。
- **Route 约束**：未做大规模 Route Migration（`/products → /capabilities` 未执行）；仅增强既有 `/search` `/products` `/categories`（§4.15）。
- **C2 = CONDITIONAL（未升级）**；**C5 = FOUNDATION / NOT FULL DISCOVERY（未升级）**；**C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH（未升级）**。

## 15.5 验证

- **Static**：`pnpm --filter @visndt/api build` exit 0（含 TS）+ `pnpm --filter @visndt/web lint` exit 0（仅存量 warnings）+ `pnpm --filter @visndt/web build` exit 0。
- **Runtime（仅 GET）**：web :3000 `/` `/products` `/categories` `/search` 全 200；API :4000 `GET /api/v1/search?q=超声` 200（products/supplierProducts/suppliers=0，knowledge=1）+ `GET /api/v1/search/context?q=超声` 200。Real Product / Real Supplier Runtime = **UNVERIFIED**（0 数据 Evidence Gap）。
- **Mobile**：前端本任务 NO CHANGE；结构性响应式满足；768 溢出 140px（**既有基线问题**，非 M34.4 引入，归 M34.5）。
- **Functional Acceptance**：AC-01..AC-18 满足/条件满足（详见 755 报告 §19）。

## 15.6 边界保持（Expansion Gate CLOSED）

- Search Index / 独立 Supplier 表 / 独立 Capability 表 / Specification Template / AI / Vector / Semantic Search / 意图理解 / Full Supplier Discovery / Full Capability-led Search / Marketplace / Monetization 全部保持 **DEFERRED / NEXT WORKSTREAM / FUTURE**。
- **M34.4 does not auto-upgrade C2/C5/C6**；Discovery Foundation ≠ Full Supplier Discovery；Discovery Foundation ≠ Full Capability-led Search；Keyword+Category+Facet ≠ Semantic Intent Understanding。
- **M34.5 NOT AUTHORIZED**。本任务已 STOP；后续 Workstream（M34.5–M34.7）须新的独立授权。

---

# 16. M34.4R Evidence Closure + M34 Roadmap Reconciliation（756）

> 756_M34.4R_Discovery_Evidence_Closure_And_M34_Roadmap_Reconciliation 为 **独立 Evidence Closure Gate**：证明 755 实际完成程度、收闭关键证据缺口、仅当直接证明必要时做受控最小修正、并把 M34 后半程路线正式调整为「由企业官网向工业 B2B 综合发现与供需连接平台」的平台化转型路线。**本节点不重做 M34.4、不进入 M34.5、不做视觉优化；工作完成后 STOP。**

## 16.1 变更面（756）

- **Code = NO CHANGE**；**Schema = NO CHANGE / Migration = NONE / DB·Storage Mutation = NONE / Test Data Creation = NONE / AI·Vector·RAG·Semantic·Search Index·Intent Engine = NONE**。
- 756 仅做 **Architecture Validation + Runtime Evidence Closure + Roadmap Reconciliation + Documentation Sync**；无业务工作流变更，无未授权 Domain Authority。

## 16.2 755 Change Boundary（Declared = Actual = VERIFIED）

- `apps/api/src/search/search.service.ts`：仅重写 `searchSuppliers`（Offer-dependent → **PUBLISHED SupplierProduct → Organization(type=SUPPLIER)** 聚合）+ 注释/接口重命名（`offerCount/offerTitles` → `publishedSupplyProductCount/seriesValues`）。
- **无未声明功能变更**。其余工作树改动（admin/*、web components/pages、design-tokens、css、tsconfig、capability-context.ts、supplier-context.ts、database _*.mjs 探针等）= **Pre-existing（M31 / M33 / M34.1-3）**，不归因于 755/756。

## 16.3 Evidence Classification（756 复核，分层禁止模糊 PASS）

| 层 | 状态 | 证据 |
|---|---|---|
| Search Wiring | **VERIFIED** | UI SearchPageContent → `useSearchParams`/state → `lib/api/search` client → `GET /search` 200 → controller → service → Prisma → result groups |
| Search Query Structure | **VERIFIED** | `GET /api/v1/search?q=超声` 200，`products` / `supplierProducts` / `suppliers` / `supplierProductFacets{brands,series,commercial}` 结构齐全 |
| Category Context | **VERIFIED / STRUCTURAL** | `GET /api/v1/search/context?q=探伤` 200（`candidateCount:0`）；真实类目渲染 UNVERIFIED（product=0） |
| Specification / Facet | **VERIFIED（结构级）** | `parameter_definition=54` 字典存在；supplierProductFacets 结构在；真实 Parameter Value 填充 UNVERIFIED（`product_parameter_value=0`、`supplier_product_parameter_value=0`） |
| Product / Capability Authority | **VERIFIED** | Product=canonical object；`capabilities` controller=transport-only read adapter on Product；无 Capability 表 |
| Published SupplyProduct | **VERIFIED / STRUCTURAL** | `SupplierProductStatus.PUBLISHED` + `supplierProducts` 组返回；真实数据 UNVERIFIED（supplier_product=0） |
| Supplier Discovery Query Foundation | **VERIFIED** | `searchSuppliers` = PUBLISHED SupplierProduct → Organization 聚合；`suppliers.items/.total` 与后端一致；Offer 非前置 |
| User-facing Supplier Discovery | **NOT CLAIMED** | 前端 `SearchPageContent` **不消费** `suppliers` 组，改用 `supplierProducts.items` 的 `organization` 展示能力提供商（SupplierContext 来源=PUBLISHED SupplyProduct→Organization，正确） |
| Real Product Runtime | **UNVERIFIED** | product=0 |
| Real Supplier Runtime | **UNVERIFIED** | supplier_product=0 |
| Mobile | **STRUCTURAL**（Responsive Structure）/ Browser Runtime 未逐屏重测 | 前端 755/756 NO CHANGE；768≈140px 溢出=**既有基线问题，CARRY FORWARD** |
| Static | **PASS** | `@visndt/api build` exit 0（首次资源性 0xC0000409 crash 后重跑 0）；`@visndt/web lint` exit 0（仅存量 warnings）；`@visndt/web build` exit 0；API lint=**PRE-EXISTING TOOLING GAP**（apps/api 无 eslint config，非 756 引入） |
| Documentation | **VERIFIED** | 755 报告 + M34.4 四文档节已同步；历史 746–754 **Preserved** |

## 16.4 平台化行为闭环（Entity → Discovery → Evaluation → Connection → Governance / Discoverability）

M34 后半程**不再按「页面继续改造」推进**，而按平台化转型的行为闭环推进：

```
Entity  →  Discovery  →  Evaluation  →  Connection  →  Governance / Discoverability
(Capability/ (Search ·       (Compare ·       (Inquiry ·        (Taxonomy/
 Product/     Categories ·    Shortlist)        RFQ ·              Parameter/
 Brand)       Capabilities ·                    Buyer ↔ Supplier)  Supplier-P Product
               Products ·                                              Governance,
               Suppliers)                                            SEO/Structured Data/
                                                                     LLM Discoverability)
```

核心产品公式：**Platform = Entity + Discovery + Evaluation + Connection + Governance**。

## 16.5 路线节点定义（756 Reconciliation）

| 节点 | 定义 | 状态 |
|---|---|---|
| M34.0 Architecture Preparation | CONDITIONAL |
| M34.1 Capability / Product Foundation | COMPLETE / CONDITIONAL |
| M34.2 SupplyProduct / Supplier Foundation | COMPLETE / CONDITIONAL |
| M34.3 Taxonomy / Specification Foundation | COMPLETE / CONDITIONAL |
| M34.4 Discovery / Search Foundation | CONDITIONAL PASS |
| **M34.4R Discovery Evidence Closure** | Evidence Closure + Roadmap Reconciliation（756） | **CURRENT / COMPLETE-CONDITIONAL** |
| **M34.5 Canonical Discovery Information Architecture** | DISCOVER：Search / Categories / Capabilities / Products / Suppliers；Canonical Route · Canonical Navigation · Entity Entry · Discovery Path · Public/Workspace Boundary。**禁止**扩展为 Global UI Rewrite / Header Rewrite / Homepage Redesign / Design System Rewrite | NOT STARTED / NOT AUTHORIZED |
| **M34.6 Evaluation + Connection Workflow** | Compare → Shortlist → Inquiry → RFQ → Buyer↔Supplier；**复用现有 Demand / RFQ / RFQResponse / Inquiry**；禁止重新设计交易系统 | NOT STARTED / NOT AUTHORIZED |
| **M34.7 Platform Governance + SEO/LLM + Mobile** | Taxonomy/Parameter/Supplier-Product Governance；SEO · Structured Data · LLM Discoverability · Mobile · Accessibility · Runtime；承接 TC713/TC715/TC716、Category redundancy、Parameter duplicate groups、°C/℃、STRING/NUMBER、768 overflow、SITE_URL；**用 Governance Existing Authority，不默认 Rebuild** | NOT STARTED / NOT AUTHORIZED |
| M34-FINAL Platformization Final Gate | 平台化最终校验 | NOT STARTED |

## 16.6 Expansion Gates（新增）

- **Gate A — Entity Authority**：禁止新增并行的 Capability / Supplier / Specification 权威。
- **Gate B — Discovery Evidence**：Search + Category + Specification + Product + Supplier 必须形成**可证的发现基础**。
- **Gate C — Evaluation**：仅当 M34.5 完成且通过独立 Gate，才允许 Compare / Shortlist。
- **Gate D — Connection**：仅当 Evaluation 基础完成后才允许扩展 Inquiry / RFQ / Buyer↔Supplier。
- **Gate E — Semantic Search**：任何 AI / Embedding / Vector / Semantic Search / Intent Engine 必须作为**独立 Future / Expansion Candidate**，不得自动进入 M34.4–M34.7。

## 16.7 状态保持

- **C2 = CONDITIONAL；C5 = FOUNDATION / NOT FULL DISCOVERY；C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH**（保留，未升级）。
- **M34.4R does not auto-upgrade**：Foundation ≠ Full Capability；Conditional ≠ Complete；HTTP 200 ≠ Feature Complete；Empty Data ≠ Search Failure；Visual Improvement ≠ Platform Transformation。
- **M34.5 / M34.6 / M34.7 / M34-FINAL = NOT AUTHORIZED**。本任务完成后 **STOP**，后续工作须新独立授权。

---

# 17. M34.5 Canonical Discovery Information Architecture（757）

## 17.1 执行状态

- **757 = Canonical Discovery Information Architecture（CONDITIONAL PASS）**。将已建立的 Entity/Discovery Foundation **正式组织为统一的 DISCOVER 信息架构（Search / Categories / Capabilities / Products / Suppliers）**，明确 Public / Workspace / Admin 边界与跨实体发现路径，并受控收敛 Public 导航语义。
- **Scope**：**Canonical Discovery IA**，**不是 Website / Visual Redesign、不是 Search 2.0、不是 Supplier Marketplace**。核心平台路径保持 Entity → Discovery → Evaluation → Connection → Governance；本任务**只执行 Entity → Discovery**，并将 Discovery 正式组织为 Search + Category + Capability + Product + Supplier。
- **唯一代码变更**：`apps/web/src/components/layout/PublicHeader.tsx`（NAV_ITEMS 导航语义收敛）。Schema / Migration / DB·Storage Mutation / Test Data / AI·Vector·RAG·Semantic·SearchIndex·Intent / Matching / RFQ / Transaction = **NONE / NO CHANGE**。

## 17.2 Canonical Discovery IA（DISCOVER）

- **Search = `/search`**；**Categories = `/categories`（能力分类）**；**Capabilities = Product 的发现语义角色（`/products` 能力详情权威 + 能力分类）**；**Products = `/products`**；**Suppliers = `/search?type=supplier-product` 公开发现入口 + `/suppliers/[id]` 供应商详情**。
- 内容（解决方案 / 知识中心）降至 **Supporting Layer**；`/business`·`/about` 从主导航移除为语义收敛，**保留于 PublicFooter，无死链**。
- **产品化 Gate 满足**：VISNDT 不再以 Home → Product → About → Article → Contact 为主要 Public 信息架构；主导航主线 = DISCOVER。

## 17.3 导航语义收敛（757 唯一代码变更）

- `PublicHeader` NAV_ITEMS 重建为：首页 / 搜索 / 能力分类 / 产品中心 / 能力型号·供应商 / 解决方案 / 知识中心。
- 新增**供应商公开发现入口** `/search?type=supplier-product`（复用现有搜索面，不新增路由）。`/search` 经 `parseType(searchParams.get('type'))`（SearchPageContent L97）正确落地到能力型号 Tab —— Navigation/Query Wiring = **VERIFIED·STRUCTURAL**。

## 17.4 Architecture Authority（ONE 权威集，Second-Authority = NONE）

- **Capability = Product Semantic Authority**（identity = product.id，`capability-context.ts`）。
- **Product = Canonical Platform Object**。
- **Supplier = Organization(type=SUPPLIER)** 语义角色（`supplier-context.ts`）。
- **SupplyProduct = Supplier-owned Commercial Product**。
- **Specification = ParameterDefinition Authority**。
- 结构验证通过：无第二套 authority / 无独立 Capability·Supplier·Specification 表 / 无 Search Index / 无 Semantic Search。

## 17.5 Public / Workspace / Admin Boundary

- **Public Discovery**（/ /search /categories /products /suppliers）= 公开只读。
- **BUYER WORKSPACE = `/dashboard/buyer`**、**SUPPLIER WORKSPACE = `/dashboard/supplier`**、**ADMIN 运营中心** 与之分离。
- 以认证入口分界；Public → Workspace = **BOUNDARY VERIFIED**。二者不混淆。

## 17.6 Cross-Entity Discovery Paths

- Search → Category → Product（categoryPath `/products?categoryId=`）；Search → Product → Supplier（SupplierProductResultCard → `/products/[slug]` → SupplierCapabilityList / SupplierInfo → `/suppliers/${org.id}`）；Category → Product；Product → Supplier；Supplier → Published SupplyProduct → Product（`/suppliers/[id]` 供应能力区）；Public → Workspace = BOUNDARY VERIFIED。
- 上述均 **STRUCTURAL VERIFIED**；真实数据 runtime = **UNVERIFIED**（empty data）。

## 17.7 验证（分 4.9 Runtime / 4.10 Empty-data / 4.11 Static / 4.12 Regression）

- **Runtime（GET only）**：Route Reachability = **VERIFIED**（`/` `/search` `/search?type=supplier-product` `/categories` `/products` `/solutions` `/knowledge` `/about` `/business` 全 200 @ 3001；无写操作）。Navigation Wiring = **VERIFIED·STRUCTURAL**（homepage SSR HTML 含 DISCOVER 主线标签）。Real Product / Supplier / Capability Population = **UNVERIFIED**（product=0 / supplier_product=0 / offer=0，空数据合法）。
- **Empty-data Classification**：Route Reachability = VERIFIED；Navigation/Query Wiring = VERIFIED；Real Population = UNVERIFIED。**HTTP 200 ≠ Experience Complete；Empty List ≠ Feature Broken**。
- **Static**：`pnpm --filter @visndt/api build` exit 0；`pnpm --filter @visndt/web lint` exit 0（仅存量 warnings，PublicHeader 零告警）；`pnpm --filter @visndt/web build` exit 0（44 静态页）。**API lint = PRE-EXISTING TOOLING GAP**（apps/api 无 eslint.config.*），不伪造 PASS。
- **Regression**：Auth / RBAC / Demand / Matching / RFQ / RFQResponse / Inquiry = **NO BEHAVIOR CHANGE**（未触及）；Search / Category / Product / Supplier / Workspace Entry 无未授权回归。
- **Mobile**：**STRUCTURAL**——主导航 count=7 不变、移动端 hamburger < lg、`/business`·`/about` footer 可达；受 **No-Visual-Loop Gate** 约束未重入逐屏视觉审计、未扩大为视觉项目；768≈140px 历史溢出 = **Carry Forward → Future Candidate**。

## 17.8 M34.5 Scope 冻结 & 完成定义

- **M34.5 = Canonical Discovery Information Architecture**，不允许描述为 Website / Frontend / Global UX / Homepage Redesign。
- 完成条件（MET）：Canonical Discovery Entry 建立 + Search/Category/Product/Supplier entry 明确 + Capability 语义角色保留 + Public/Workspace 边界明确 + 跨实体发现路径建立 + 无新 Domain Authority + 无 Schema/Migration + 无业务工作流变更 + Mobile（受影响面结构）验证 + Runtime 导航验证 + 文档同步。

## 17.9 状态保持

- **C2 = CONDITIONAL；C5 = FOUNDATION / NOT FULL DISCOVERY；C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH**（保留，未升级）。
- **M34.5 被接受 ≠ M34 platformization complete**。**M34.6 / M34.7 / M34-FINAL = NOT AUTHORIZED**。本任务完成后 **STOP**，后续所有任务须重新独立授权。

---

> **历史约束不变**：本契约 §1-§11 冻结决策（Identity / Cardinality / Route / Governance / Lifecycle / §10 Conditions）+ §12（M34.1）+ §13（M34.2）+ §14（M34.3）+ §15（M34.4）+ §16（M34.4R）+ §17（M34.5）均保持；§16/§17 为 **Implementation-State Reconciliation（路线/范围框架更新与 Canonical IA 建立）**，不改写任何冻结核心对象与决策。任何修订须新的架构决策任务。报告：`docs/_review/757_M34.5_Canonical_Discovery_Information_Architecture_Report.md`

---

# 18. 758 M34.5 Discovery Surface Completion And Evaluation Gate（Discovery Completion / Evaluation Entry Gate）

## 18.1 执行状态（758）

- **758 = DISCOVERY COMPLETION GATE（CONDITIONAL PASS）**。在 757 Canonical IA 之上，**真正补齐 Capability-oriented Discovery Surface、Supplier Discovery Surface 与 Cross-Entity Discovery Continuity**，形成 Discovery Completion Gate（B1–B7），并为 M34.6 Evaluation + Connection 提供**独立授权入口**。
- **Scope**：Discovery Surface 完成 + Evaluation Entry Gate。**非 Evaluation / Connection / 视觉改造 / 搜索重构 / 交易系统**。本任务**只执行 Discovery Completion**，**不**实施 M34.6（Compare/Shortlist/Inquiry/RFQ/Buyer↔Supplier）与 M34.7（Governance/SEO/LLM/Mobile）。
- **其唯一代码变更 = 前端展示/接线层（Public 搜索面）**，复用后端已存在的 `suppliers` 组（PUBLISHED SupplierProduct → Organization 聚合）：
  - `apps/web/src/lib/api/search.ts`：新增 `SupplierDiscoveryItem` + `suppliers` 组。
  - `apps/web/src/services/search.service.ts`：`supplier` 搜索域 + `mapSupplier` + `suppliers` 映射。
  - `apps/web/src/components/search/SupplierResultCard.tsx`（新建）：供应商发现卡。
  - `apps/web/src/app/search/SearchPageContent.tsx`：供应商 Section + 计数/分页/空态联动。
  - `apps/web/src/components/search/SearchTypeTabs.tsx` + `GlobalSearchBar.tsx`：`supplier` 类型入口。
  - `apps/web/src/components/search/SupplierProductResultCard.tsx` + `apps/web/src/components/products/ProductDetailContent.tsx`：**Product/SupplierProduct → Supplier 链接修复**（Cross-Entity Continuity）。
- **Schema / Migration / DB·Storage Mutation / Test Data / AI·Vector·RAG·Semantic / Matching / RFQ / Transaction = NONE / NO CHANGE**。后端 `apps/api/src/search/search.service.ts` = **Pre-existing（755）**，758 未改。

## 18.2 Capability Surface / Supplier Surface（补充，与 §1.1/§1.3 冻结语义一致）

- **Capability-oriented Surface = Product Semantic Role**（Capability 是 Product 的发现语义角色，**非新 Entity**）：入口为 `/categories`（能力分类）→ `/products`（能力注册表）→ `/products/[slug]`（能力详情权威）。
- **Supplier Surface：Supplier = Organization(type=SUPPLIER) + Published SupplierProduct 聚合**（**非 Store / Marketplace Seller**）：公开入口 `/search?type=supplier`（供应商列表，PUBLISHED SupplierProduct → Organization 聚合，无 Offer 依赖）+ `/suppliers/[id]`（供应商详情，`/suppliers` → Organization 语义）。
- **对 §16.3 第 506 行（756 复核时「User-facing Supplier Discovery = NOT CLAIMED」）的时效性替代**：自 758 起，前端 `SearchPageContent` 已**正式消费后端 `suppliers` 组**并渲染公开 Supplier Surface（B4 Supplier 达成）。该断言仅在当时（756 时间点）成立，属历史快照，758 已将该面补齐。

## 18.3 Cross-Entity Discovery Continuity（758 接线）

| 路径 | 接线 | 来源 |
|---|---|---|
| Search → Product | `/search?type=product` → ProductResultCard → `/products/[slug]` | 既有 |
| Search → Supplier / Context | `/search?type=supplier`（PUBLISHED SupplierProduct 聚合）→ `/suppliers/[id]` | **758 补齐** |
| Category → Product | `/categories` → `/products?categoryId=` | 既有 |
| Capability → Product | Capability=Product 语义角色，`/products` + Category Path | 既有 |
| Product → Supplier | `/products/[slug]` 供应商区 → `/suppliers/${org.id}` | **758 修复为链接** |
| Supplier → Product | `/suppliers/[id]` 供应能力区（Published SupplyProduct）→ `/products/[slug]` | 既有（供应能力区仍基于 Offer = **LEGACY**，不改写，Carry Forward → M34.6/Governance Future Candidate） |

## 18.4 Discovery Completion Gate（B1–B7，758）

| Gate | 状态 |
|---|---|
| B1 Search | PASS |
| B2 Category | PASS |
| B3 Capability | PASS |
| B4 Supplier | PASS |
| B5 Cross-Entity | PASS（STRUCTURAL） |
| B6 Continuity | PASS（STRUCTURAL） |
| B7 Authority | PASS（ONE 权威集保持） |

> 结构证据充分且无架构违规；Real-data runtime 因合法空数据（product=0/supplier_product=0/offer=0）无法验证 → 依据 758 Final Decision Logic，不升级为 PASS，采用 **CONDITIONAL PASS**。

## 18.5 冻结：M34.6 / M34.7 Future Scope

- **M34.6 = Evaluation + Connection Workflow**（Compare → Shortlist → Inquiry → RFQ → Buyer↔Supplier；复用 Demand/RFQ/RFQResponse/Inquiry）。**冻结范围，不提前实施**；实现仍待 **Independent M34.6 Authorization**（在数据就绪情况下）。
- **M34.7 = Platform Governance + SEO/LLM + Mobile**（Taxonomy/Parameter/Supplier-Product Governance + SEO + Structured Data + LLM Discoverability + Mobile + Accessibility + Runtime；承接 TC713/TC715/TC716、Category redundancy、Parameter duplicate groups、°C/℃、STRING/NUMBER、768 overflow、SITE_URL）。**冻结范围，不提前实施**。

## 18.6 状态保持 / 结论

- **C2 = CONDITIONAL；C5 = FOUNDATION / NOT FULL DISCOVERY；C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH**（保留，未升级）。758 为 Discovery Completion Gate，**Foundation ≠ Full Capability**。
- **M34.5 = CONDITIONAL PASS；758 = CONDITIONAL PASS**；**M34.6 = NOT AUTHORIZED / READY FOR INDEPENDENT AUTHORIZATION**（Gate B1–B7 结构性达成，但真实数据空故不直接授权）；**M34.7 / M34-FINAL = NOT AUTHORIZED / NOT STARTED**。
- 本任务完成后 **STOP**，**不得**自动执行 M34.6（Compare/Shortlist/Inquiry/RFQ/Buyer↔Supplier workflow），后续所有任务须重新独立授权。
- 报告：`docs/_review/758_M34.5_Discovery_Surface_Completion_And_Evaluation_Gate_Report.md`

---

# 19. M34 759 — Technical Context + Discoverability Architecture Reconciliation（759）

> 759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation 为 **Platformization Reconcil**：把 757/758 已建立的 Entity + Discovery，正式补足 **Context + Discoverability**，使 M34 形成 `Entity → Context → Discoverability → Discovery → Evaluation` 的平台化闭环，并把 Internal Search / External Search / AI·LLM Discoverability **三者共享一套 Canonical Entity + Semantic + URL + Structure + Relationship + Evidence**。本任务为 **Audit + 语义契约 + 文档同步**；**Production Code = NONE**。工作完成后 **STOP**。

## 19.1 执行状态（759）

- **Repository**：根 `F:\Desktop\VISNDT` / Code Root `F:\Desktop\VISNDT\VISNDT` / branch `main` / commit `ff03a9a` / Working Tree OTHER（其余改动 = Pre-existing 746–758，非 759 引入）。
- **Production Code Changes = NONE**；**Schema = NO CHANGE / Migration = NONE / Database·Storage Mutation = NONE / Test Data = NONE / AI·Vector·RAG·Embedding·Semantic·SearchIndex·Intent = NONE / Matching = NO CHANGE / RFQ = NO CHANGE**。
- **不新建任何 Domain Authority / Table / Migration**；新的一级对象（Application / Detection Object / Standard / Certification / Evidence）一律登记为 **Future Candidate（需独立架构决策 + Schema Change Assessment）**，**不落入 M34.6 实施**。

## 19.2 Technical Context 对象分类（Existing Inventory → Role）

| Object | 现状载体（Prisma Model / 表达层） | 分类 | 说明 |
|---|---|---|---|
| Insight（洞察） | `Content.type=INSIGHT`（/insights/[slug]） | **Semantic Role（Content 子类型）** | Canonical=Content；搜索域 `content`（ARTICLE+INSIGHT） |
| Knowledge（知识） | `KnowledgeEntry` + `KnowledgeDomain/Category` + `KnowledgeRelation` + `ProductCategoryKnowledgeMapping` | **Canonical Entity（KnowledgeEntry）** | 发布边界 `PUBLISHED`；搜索域 `knowledge`；持久映射链 `Product→Category→Mapping→KnowledgeCategory→Entry`（确定性，无 AI/关键词猜测） |
| Solution（方案） | `Content.type=SOLUTION`（/solutions/[slug]） | **Canonical Content Type（Content/SOLUTION）** | Solution ≠ Capability；配置型发布内容；搜索域 `solutions` |
| Application（应用/检测应用场景） | `ContentTagType.APPLICATION`（ContentTag）+ `ApplicationScenario` 展示组件 | **Semantic Role / Tag Facet（Future Candidate）** | 无一级对象；经内容标签 + Solution/Insight 表达；一级 Application 对象 = FUTURE（独立评估，不授权） |
| Detection Object（检测对象） | Category 能力粒度语义 + `ParameterDefinition`（Material/Scope...）+ ContentTag | **Semantic Role（通过 Category/Parameter/Tag 表达）（Future Candidate）** | 无独立 DetectionObject 表；一级对象 = FUTURE（独立评估，不授权） |
| Standard（标准/标准库） | `KnowledgeEntry` 引用 + `FileAsset(FileType.DOCUMENT/SPEC_SHEET)` + ContentTag | **Future Candidate（经 Knowledge + Document 表达）** | 无查询级 Standard 对象；标准库一级对象 = FUTURE（独立评估，不授权） |
| Document（文档/数据表） | `FileAsset`（`FileType.DOCUMENT/SPEC_SHEET/ILLUSTRATION`）+ `FileEntityType`（PRODUCT/SUPPLIER_PRODUCT/CONTENT/...） | **Attachment / Artifact Layer（FileAsset）** | 附件层，非一级发现实体；可作 Evidence 载体 |
| Certification（认证/证书） | `FileAsset(FileType.CERTIFICATE)` 绑定 SUPPLIER_PRODUCT/PRODUCT | **Artifact Facet（FileAsset/CERTIFICATE）** | 证明层；非搜索维度；一级 Certification = FUTURE |
| Evidence（证据） | `FileAsset` 附件 + `KnowledgeEntry` 引用 + Content 引用 | **Cross-cutting Artifact Layer（Future Candidate）** | 无 Evidence 实体；证据 = 附件/引用聚合；一级 Evidence = FUTURE |
| Media（媒体/图库） | `ProductMedia` / `SupplierProductMedia` / `ContentMedia` / `FileAsset(IMAGE)` | **Media Attachment Layer** | 支持性展示层 |
| Trigger/承载体 | `Product`（Capability Authority）/ `SupplierProduct` / `Organization(type=SUPPLIER)` / `ProductCategory` / `ParameterDefinition` | **Canonical Entities（不变）** | 759 **不新增、不改写**既有权威对象 |

对 §17.4 ONE 权威集**无扩充**：一手 Context 对象（Insight/Knowledge/Solution/Media/Document）全部挂载于既有权威对象；Application/DetectionObject/Standard/Certification/Evidence 均**未新增实体**。

## 19.3 Context 语义角色（M34.6 契约基础，非新表）

- **Insight Role / Knowledge Role / Solution Role** = `Content` / `KnowledgeEntry` 的语义角色（前端 view-model + 类型化展示）。
- **Application Role / Detection Object Role** = `ContentTag(APPLICATION)` + `ParameterDefinition` + Category 语义组合（**非一级对象**）。
- **Standard Role** = `KnowledgeEntry` 引用 + `FileAsset(DOCUMENT/SPEC_SHEET)` 组合（**非一级对象**）。
- **Document/Evidence Role** = `FileAsset`（`FileType.DOCUMENT/CERTIFICATE/SPEC_SHEET`）+ 实体绑定 `FileEntityType`（**非一级对象**）。
- 以上 Role 均是**确定性投影 / 语义组合**，复用 `capability-context.ts`/`supplier-context.ts` 既有 view-model 先例；**禁止为 Role 建表**。

## 19.4 Discoverability Contract（Internal / External / AI-LLM 共享）

**前提**：三通道最终指向 **ONE Canonical Entity / ONE Semantic Definition / ONE Relationship Graph**，**不是三个彼此独立的信息系统**。

| 通道 | 载体 | 状态 |
|---|---|---|
| Internal Search | 统一 `GET /search`（q+category+filters+brand/series/hasOffer→products/supplierProducts/knowledge/content/solutions/suppliers+supplierProductFacets）+ `/search/context`（Category Context）+ SearchDomain Tab（product/supplier-product/supplier/solution/knowledge） | **FOUNDATION（建立）**；Real-data=UNVERIFIED（空数据） |
| External Search（Google/Bing） | Canonical URL（/products/[slug]、/solutions/[slug]、/insights/[slug]、/knowledge-base/[slug]、/suppliers/[id]、/categories）+ `metadata`/canonical + JSON-LD（`WebSite`+`SearchAction`、`Organization`、`Product`、`Article`、`TechArticle`、`BreadcrumbList`） | **FOUNDATION（seo.tsx 已具备）**；`SITE_URL` placeholder=`https://visndt.example.com` = **Future Candidate（SITE_URL Config Follow-up）** |
| AI / LLM Discoverability | 被动经 Canonical HTML + Structured Data + `KnowledgeEntry`(Article generic) 被理解/关联/推荐；**无 Active Runtime / 无 Embedding / 无 Vector / 无 RAG / 无 Semantic Index** | **CONTRACT FROZEN**（非运行时实现） |

**原则**：三者共享同一 Canonical Entity / Canonical URL / Semantic Definition / Structured Attributes / Relationship / Technical Context / Evidence；未来任何 AI/LLM 通道仍须落到既有 Canonical 实体（Gate E）。

## 19.5 Search Semantic Contract（Canonical / Alias / Legacy / Remove Later）

| Search 语义 | 现状 | 判定 |
|---|---|---|
| `product`（检测能力/Capability） | SearchDomain=`product`；API 组 `products`；Capability=Product 语义角色（/products） | **CANONICAL**（Capability Authority） |
| `capability` | 无独立 SearchDomain 值；前端 Tab 标签「检测能力」映射 `type=product`；Capability=Product 角色 | **ALIAS → product**（不新增独立搜索域） |
| `supplier-product`（能力型号） | SearchDomain=`supplier-product`；API 组 `supplierProducts`（PUBLISHED SupplierProduct→Capability+Commercial+Inquiry） | **CANONICAL**（Supplier-owned Capability Model） |
| `supplier`（供应商） | SearchDomain=`supplier`；API 组 `suppliers`（PUBLISHED SupplierProduct→Organization(type=SUPPLIER) 聚合） | **CANONICAL**（Capability Provider / Supplier Entity） |
| `knowledge` | SearchDomain=`knowledge`；API 组 `knowledge`（KnowledgeEntry PUBLISHED） | **CANONICAL** |
| `solution` | SearchDomain=`solution`；API 组 `solutions`（Content type=SOLUTION） | **CANONICAL** |
| `category` | 非搜索域；`category` 为 facet 参数（selectedCategoryTab）+ `/categories` 条目 | **CANONICAL（FACET / IA）**，非搜索 type |
| `/search/supplier-models`（API） | 遗留 facet 端点；SearchPageContent 已不消费（unified /search 附带 facet bundle） | **LEGACY → Remove Later**（不新增调用） |
| `/supplier-models`（路由） | 遗留静态页 | **LEGACY / DEPRECATE → Remove Later**（757 已登记 Future Candidate） |

### 19.5.1 supplier vs supplier-product（必须专项判定）

**判定：NOT DUPLICATE / NOT CONFLICT — CANONICAL（双视图，粒度不同）**。

- `supplier` = **供应商实体视图**（Capability Provider / `Organization(type=SUPPLIER)` 聚合，含 publishedSupplyProductCount/产品/系列）。
- `supplier-product` = **能力型号视图**（Supplier-owned Commercial Product / `SupplierProduct`，含 Capability+品牌/系列/商业摘要/比价/询价）。
- 二者**共享同一底层种群**（`SupplierProduct.status=PUBLISHED`），但**投影粒度不同**（Organization 级 vs Model 级），UI 语义不同（「供应商」 vs 「能力型号」），**不构成双重语义**。
- **关系**（非重复）：`supplier-product.organization → /suppliers/[id]`（Model→Provider 下钻）；`supplier` 聚合自 published supplier-products（Provider→Models 上卷）。755/756 定义的 `searchSuppliers`（PUBLISHED SupplierProduct→Organization）与 `searchSupplierProducts`（PUBLISHED SupplierProduct）**各自保留、语义正交**。
- **纪律**：前端两个 Tab（Supplier「供应商」/ supplier-product「能力型号」）语义固定，**不得合并为一个**，也不得让 `supplier` 退化为模型列表或让 `supplier-product` 承载供应商列表；二者是供应链发现的两级视图（Provider / Model）。

## 19.6 Relationship Graph（759 冻结）

```
                    Content(SOLUTION/INSIGHT/ARTICLE)
                    │ type=SOLUTION / INSIGHT
                    ▼
   Product(Capability Authority) ──ProductCategory──► ProductCategory ──ProductCategoryKnowledgeMapping──► KnowledgeCategory ──► KnowledgeEntry
   │ (product.id /slug /products/[slug])             (categoryId / /categories)                                  (KnowledgeRelation/引用)
   │ categoryId
   ▼
   SupplierProduct ── platformProductId ──► Product        SupplierProduct ──(FileAsset FileType.CERTIFICATE=Certification/Evidence)
   (PUBLISHED; /products/[slug] 供应面)
   │ organizationId
   ▼
   Organization(type=SUPPLIER) ── Supplier (= ConceptProvider)
   /suppliers/[id]
       │ FileAsset(DOCUMENT/SPEC_SHEET/IMAGE)  /  ProductMedia / SupplierProductMedia / ContentMedia   = Media/Document/Evidence
   KnowledgeEntry ── KnowledgeRelation ──► KnowledgeEntry  (League/相关 / 确定性映射)
```

- **ONE 权威集**：Product（Capability）/ SupplierProduct（Model）/ Organization（Provider）/ ProductCategory（Taxonomy）/ ParameterDefinition（Spec 字典）/ KnowledgeEntry（Knowledge）。
- **Direction 冻结**：`Product 1→N SupplierProduct`；`SupplierProduct N→1 Organization`；`SupplierProduct→Product(platformProductId)`；`Product→Category(categoryId)`；`Product→KnowledgeEntry` 仅经 `ProductCategoryKnowledgeMapping` 确定性映射（不 AI/关键词）。
- **Context 对象**不新增节点，仅作为既有权威上的语义投影。

## 19.7 M34.6 Technical Context + Evaluation Blueprint（契约级，非实施）

- **Technical Context Model（Contract）**：类型化 Context Block = `Capability(Product) + SupplierProduct(Model) + Organization(Provider) + Category + Parameter/Spec + Evidence(FileAsset) + Knowledge/Solution（轻量挂载）`，作为 `/products/[slug]` Comparative Surface 的只读投影；**不建表**。
- **Evaluation Flow（M34.6）**：`Technical Context（结构化） → Compare（CompareBar/Compare 复用既有） → Shortlist → Inquiry → RFQ/Buyer↔Supplier`；复用既有 `Demand/RFQ/RFQResponse/Inquiry`；**禁止重新设计交易系统**。
- **依赖**：M34.6 实施需在数据就绪下进行 Real-data 验证；当前 **NOT AUTHORIZED**。

## 19.8 Expansion Gates（759 更新）

| Gate | 定义 | 759 状态 |
|---|---|---|
| **Gate A — Authority** | ONE Capability / Product / Supplier / Specification Authority | **HOLD（成立）** |
| **Gate B — Context** | 所有 Technical Context 对象完成角色分类 | **PASS（分类完成；一级对象=FUTURE）** |
| **Gate C — Discoverability** | 每类对象明确 Internal / External / AI·LLM 职责 | **PASS（契约建立）** |
| **Gate D — Evaluation** | Technical Context → Compare → Shortlist | **Blueprint 建立；实施 NOT AUTHORIZED** |
| **Gate E — Implementation** | 仅 759 PASS/CONDITIONAL PASS 后才允许规划 M34.6 | **759=CONDITIONAL PASS → M34.6 可规划但独立授权** |

## 19.9 Roadmap State / C2·C5·C6 / Final Decision（759）

- **M33=CLOSED**；**M34.0=CONDITIONAL**；**M34.1/2/3=COMPLETE·CONDITIONAL**；**M34.4=CONDITIONAL PASS**；**M34.4R=CONDITIONAL PASS**；**M34.5=CONDITIONAL PASS**；**758=CONDITIONAL PASS**；**759=CONDITIONAL PASS（CURRENT）**；**M34.6=NOT AUTHORIZED / READY FOR INDEPENDENT AUTHORIZATION（Blueprint+Contract 达成，唯真实数据空故不作为授权）**；**M34.7=NOT AUTHORIZED**；**M34-FINAL=NOT STARTED**。
- **C2 = CONDITIONAL**（保持）；**C5 = FOUNDATION / NOT FULL DISCOVERY**（保持）；**C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH**（保持）。759 **未升级**三态。
- **Final = CONDITIONAL PASS**：Technical Context boundary 已冻结 + Discoverability Contract 建立 + Search semantics 收敛 + M34.6 Blueprint 建立 + 无架构违规；剩余 gap = 既有数据空限制 + 历史遗留（legacy `/search/supplier-models`、768≈140px overflow、`/supplier-models` 路由、SITE_URL placeholder）+ **Future Candidates**（Application/DetectionObject/Standard/Certification/Evidence 一级对象）。
- **Mobile（759）**：STRUCTURAL；**768 ≈ 140px overflow = CARRY FORWARD**（归 M34.7/未来，不阻断架构验证、不作为本任务修复）。
- **M34.6 / M34.7 / M34-FINAL = NOT AUTHORIZED**。759 完成后 **STOP**；后续所有任务（含 M34.6 Compare/Shortlist/Inquiry/RFQ/Buyer↔Supplier，以及 AI/Embedding/Vector/RAG/SEO 运行时）均须重新独立授权。
- 报告：`docs/_review/759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation_Report.md`

## 20. M34.6 Pre-Execution Authorization Gate（760）

### 20.1 执行状态（760）

- **760 = CURRENT AUTHORIZATION GATE → NOT AUTHORIZED**。M34.6 = **NOT AUTHORIZED / BLOCKED**（等待数据就绪后重新授权）。Production Code = NONE。
- 官方：`M34.6 Authorization = Scope Authorization + Architecture Verification + Real-data Readiness + Runtime Verification Plan`。

### 20.2 Authorization Decision Matrix（760）

| Gate | Required | 760 Result |
|---|---|---|
| Scope Authorization | M34.6 边界明确（Eval≠Marketplace） | **PASS** |
| Architecture Verification | ONE Authority 保持 | **PASS** |
| Existing Workflow Safety | 无业务工作流重构 | **PASS** |
| Real-data Readiness | 满足 Runtime 最低条件 | **FAIL**（Product=0/SP=0/Offer=0） |
| Runtime Verification Plan | 可执行、可审计 | **PASS** |
| RBAC Boundary | 明确（workspaceRole 强制） | **PASS** |
| Expansion Control | 无未授权扩张 | **PASS** |
| Mobile Verification Plan | 已纳入 | **PASS**（768≈140px CARRY FORWARD） |
| Documentation Baseline | 可同步 | **PASS** |

**Final = NOT AUTHORIZED**：唯一阻断 = **Real-data Readiness = FAIL**（product=0 / supplier_product=0 / offer=0 → 核心 Product→SupplierProduct→Supplier 评估链「真实数据完全无法支撑核心验证」，命中 NOT AUTHORIZED）。

### 20.3 重新授权前置（Condition）

- 数据就绪后，提供 **最小评估数据集**：`≥1 published Product + ≥1 published SupplierProduct(platformProductId→Product) + 拥有它的 SUPPLIER 组织 + Product 参数`；多记录 `2+` 集用于 Compare/Shortlist 验证；并**重新执行本 Gate** 产出独立授权结论。
- **Shortlist 持久化边界**（User Evaluation State 跨会话持久化 vs 瞬时）= **Architecture Decision Required**，760 不裁决；若持久化需新表 → 独立 Schema Assessment + Migration Plan。
- 数据/授权条件未满足前：M34.6 Production Implementation = **STOP**。

### 20.4 M34.6 边界（760 冻结，非授权）

- Compare = 读only投影，复用既有 `/products/compare?ids=`（Platform Product + SupplierProduct 双模式）。
- Shortlist = User Evaluation State，非商业实体。
- Inquiry / RFQ = Orchestration / Evaluation Entry，复用既有 Demand/Match/RFQ/RFQResponse/Inquiry；禁止第二套工作流、禁止重建交易系统。
- 明确排除：Supplier Store / Marketplace Seller / Product Listing Marketplace / Cart / Checkout / Order / Payment / Commission / Storefront / Transaction Engine = FUTURE（NOT M34.6）。
- 明确排除：SEO Runtime / Structured Data / LLM / Embedding / Vector / RAG / Semantic Index / Search 2.0 / Taxonomy·Parameter·Supplier Governance / Mobile Full Audit / Accessibility Project / Visual·Homepage Redesign = M34.7 / Future。

### 20.5 M34 Roadmap State（760）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（CURRENT GATE）；M34.6=NOT AUTHORIZED / BLOCKED；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。**

**C2=CONDITIONAL / C5=FOUNDATION·NOT FULL DISCOVERY / C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH（760 未升级）**。

- 报告：`docs/_review/760_M34.6_Pre-Execution_Authorization_Gate_Report.md`

## 21. M34.6 Data Readiness Reconciliation（761）

### 21.1 执行状态（761）

- **761 = CURRENT**（Data Readiness Audit + Gate Reconciliation；Production Code = NONE）。在 760 `NOT AUTHORIZED` 基础上，将 760 的「Real-data BLOCKER」从粗粒度计数判断**升级为可审计、可分层、可验证、可授权的四维 Data Readiness Gate**。
- **关键 Gate-Logic 修正**：760 将 `Product=0 / SupplierProduct=0 / Offer=0` 并列列为统一失败条件；761 判定 **Offer = OPTIONAL / COMMERCIAL CONTEXT / LEGACY WORKFLOW DATA，NOT CORE BLOCKER**（无任何 M34.6 核心验收场景强依赖 Offer 的代码/架构证据）。
- **修正后真实 Core Blocker** = `Product=0` + `Published SupplierProduct=0` + `Discoverable SUPPLIER=0（8 组织均无 SupplierProduct）` + `Product↔SupplierProduct=0` + `SupplierProduct→Organization=0` + `Product Parameter(assoc/value)=0`。

### 21.2 四维 Data Gate（761）

| 维度 | 判定 | 实际证据 |
|---|---|---|
| Core Data Gate | **NOT READY / BLOCKER** | Product=0、Published SupplierProduct=0、Discoverable SUPPLIER=0、Relationships=0、Product Parameter=0 |
| Extended Evaluation Gate | **NOT READY** | 2nd Product/SP/Supplier/ParamProfile 均 0（非架构失败） |
| Workflow Scenario Gate | **CONDITIONAL** | Demand=3（DRAFT1/CLOSED2）、RFQ=2（DRAFT1/OPEN1）、RFQResponse=1（SUBMITTED）、Inquiry=0；分场景判定 |
| Commercial Gate | **OPTIONAL** | Offer=0；无 Scenario Dependency |

### 21.3 Existing Real Data Source（761）

**AVAILABLE（legitimate onboarding 链路存在）**：
- Admin Product Management：`products.controller.ts` @Post create → 可产生合法 Published Product。
- Supplier Product Governance：`admin/supplier-products` 完整生命周期 `create(DRAFT)→submit→review→approve(APPROVED)→publish(PUBLISHED)` → 可产生合法 Published SupplierProduct，并建立 `platformProductId→Product` / `organizationId→SUPPLIER Organization`。
- Parameter Management：`parameter-definitions` / `parameter-groups` / `product-parameters` → 可建立真实 Parameter Profile。
- Organization 已就位：8 个 SUPPLIER 组织真实存在（但均未挂接 SupplierProduct → 0 可发现 Provider）。

**机制**：已存在的真实业务管理链路可合法进入 M34.6 Runtime；761 未实施任何数据导入/清洗/创建，未扩展新 Data Onboarding Feature。

### 21.4 Authorization Decision（761 = Case B）

- **M34.6 Core Data Readiness = NOT READY**；**Data Source = AVAILABLE**；**M34.6 Authorization = NOT AUTHORIZED**。
- 下一步 = **Controlled Real-data Onboarding / Preparation Assessment**（独立任务，不在 761 内执行）；数据就绪后可重跑 M34.6 Authorization Recheck（762）。
- **Synthetic Test Data = NONE**（未创建/种子/变更任何数据；NOT READY 未升级为 READY）。
- **Shortlist Persistence Boundary** = **ARCHITECTURE DECISION REQUIRED**（若持久化需新表 → 独立 Schema Assessment + Migration Plan；761 不裁决）。

### 21.5 M34 Roadmap State（761）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=CURRENT（Data Readiness Gate）；M34.6=NOT AUTHORIZED（Case B，数据源 AVAILABLE）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。**

**C2=CONDITIONAL / C5=FOUNDATION·NOT FULL DISCOVERY / C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH（761 未升级）**。

- 报告：`docs/_review/761_M34.6_Real_Data_Readiness_Remediation_And_Gate_Reconciliation_Report.md`

## 22. M34.6 Controlled Real-data Onboarding Preparation Assessment（762）

### 22.1 执行状态（762）

- **762 = CURRENT**（Architecture Audit + Real-data Onboarding Assessment + Data-flow Verification + Governance/Lifecycle Verification + Runtime Readiness Preparation；Production Code = NONE；Database = READ-ONLY）。
- 本任务**不实施 M34.6**、**不创建 Product / SupplierProduct / Supplier / Parameter / 任何数据**、**不制造 Synthetic Data**、**不改 Schema / Migration / Search / Discovery / Workflow**。仅验证既有合法业务管理链路能否不扩域地合法产生 M34.6 最小真实数据集。

### 22.2 验证结论（762）

- **ONE Authority 全 PASS**：Product=Capability Authority、SupplierProduct=Supplier-owned Capability Model、Organization(SUPPLIER)=Provider Authority、ProductCategory=Taxonomy Authority、ParameterDefinition=Specification Dictionary Authority、KnowledgeEntry=Knowledge Authority 均保持；无新增一级 Domain Authority。
- **既有管理链路 = AVAILABLE**（可合法落地）：
  - Product：Admin > Product Operation Center（CREATE → EDIT → 批量状态 → status='ACTIVE'=Publish → Discovery 可见）。Product publish 条件 = `status='ACTIVE'`。
  - SupplierProduct：状态机 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED/REJECTED`；`platform_product_id` 强校验存在、`organization_id` 服务层派生自操作者组织；publish 条件 = `status=PUBLISHED`。生命周期/审核/发布均在既有 Admin 与 Supplier Workspace 提供合法入口。
  - Parameter：`parameter-definitions`、`parameter-groups`、`product-parameters`（POST `/products/:id/parameters` → ProductParameterValue → ProductParameterDefinition）链路存在；`ProductParameterValue→ParameterDefinition` 运行时可读。
- **Publication / Discoverability 契约（search.service.ts 冻结）**：
  - Product 检索可发现 = `status='ACTIVE'`；
  - SupplierProduct 检索可发现 = `status=PUBLISHED`；
  - Supplier 聚合可发现 = 聚合 `status=PUBLISHED` 的 SupplierProduct 且 `organization.type='SUPPLIER'`。
  - 明确区分 **Provider Exists（8 SUPPLIER Org）≠ Provider Discoverable（0，因无 Published SupplierProduct）**。

### 22.3 四维 Readiness（762）

| 维度 | 判定 | 依据 |
|---|:--:|---|
| Core Data Readiness | **NOT READY（INSTANCE）/ STRUCTURALLY READY（PATH）** | 结构可落地；实例 Product=0 / SupplierProduct=0 / Discoverable Supplier=0 |
| Extended Evaluation Readiness | **NOT READY** | 需 2+；非架构失败 |
| Workflow Scenario Readiness | **CONDITIONAL / SPARSE** | Demand=3 / RFQ=2 / RFQResponse=1 / Inquiry=0 |
| Commercial Readiness | **OPTIONAL** | Offer=0；无场景依赖 |

- **Data Preparation = STRUCTURALLY READY（链路）／ INSTANCE NOT READY（需受控真实数据落地）**
- **M34.6 Authorization = STILL PENDING（PENDING RECHECK）**——762 不授权，也不得在 762 内写成 AUTHORIZED。

### 22.4 Gaps / Architecture Decisions（762 冻结，不修复）

- **G1（非阻断）**：SupplierProduct 创建未校验 `organization.type='SUPPLIER'`（组织类型校验在服务层约束而非创建强校验）。
- **G2（非阻断）**：Product publish 用自由字符串 `status='ACTIVE'`，非受控 Enum 状态机。
- **G3（非阻断）**：ProductParameterDefinition 无独立写接口（由 Product 参数设置路径隐式建立）。
- **G4（非阻断）**：Parameter required 无运行时强制规则（存在 `SetProductParameterDto`，但无 Required/Optional 校验枚举）。
- **Shortlist Persistence Boundary = ARCHITECTURE DECISION REQUIRED（保持，762 不裁决；若持久化需新表 → 独立 Schema Assessment + Migration Plan）**。

### 22.5 M34 Roadmap State（762）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=ACCEPTED / CONDITIONAL（保持）；762=CURRENT（Onboarding Preparation Assessment）；M34.6=NOT AUTHORIZED（PENDING RECHECK）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。**

**C2=CONDITIONAL / C5=FOUNDATION·NOT FULL DISCOVERY / C6=FOUNDATION·NOT FULL CAPABILITY-LED SEARCH（762 未升级）**。

- 报告：`docs/_review/762_M34.6_Controlled_Real_Data_Onboarding_Preparation_Assessment_Report.md`

---

## 23. M34.6 Controlled Test Data Onboarding（763）

- **性质**：受控测试数据落地（Controlled Test Data Onboarding），非 M34.6 Implementation / 非 Authorization / 非交易数据 / 非 Synthetic-Fake。沿用 761（Core NOT READY + Data Source AVAILABLE）与 762（STRUCTURALLY READY / INSTANCE NOT READY）结论，在既有 ONE Authority + 既有 Admin/SupplierProduct/参数管理链路之上，将 M34.6 **Core Dataset 从「实例缺失」落地为「实例就绪 / RUNNABLE」**。
- **数据落地**：
  - Organization(type=SUPPLIER)：**MicroVision（既有，未重复）+ Revopoint 知象（受控新建）** = 2 个可发现 SUPPLIER。
  - Controlled Test Users：6 个 `@visndt.local` 测试账号（admin.vs/admin.zx=ADMIN；张三/李四=微视 MEMBER；王五/赵六=知象 MEMBER），统一受控密码（仅测试身份，不触发真实邮件/短信/支付）。
  - Product：**4**（ZB-K60 / ZB-TJ095 / POP 4 / MetroY Ultra），全 `status='ACTIVE'`（可发现）。
  - ProductParameterValue：**32**（每 Product 8，合计 4 个可运行时读取的 Parameter Profile）；复用 `STRING/NUMBER/ENUM`，未新建 ParameterDefinition；`required` 保持无运行时强制、不补 validation。
  - SupplierProduct：**4（SP-001..004）**（ZB-K60/ZB-TJ095→微视、POP4/MetroY Ultra→知象），经治理状态机 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED`，全 `status=PUBLISHED`；orphan=0、invalid org-type=0。
- **Document 契约（763 实证，未改写 762 冻结发布契约）**：
  - Product 检索可发现 = `status='ACTIVE'`（4/4 达成）；
  - SupplierProduct 检索可发现 = `status=PUBLISHED`（4/4 达成）；
  - Supplier 聚合可发现 = 聚合 PUBLISHED SupplierProduct 且 `organization.type='SUPPLIER'`（**Discoverable=2**）。
- **运行时只读验证（763 实证）**：`/api/v1/search?q=内窥镜`→products=2/SP=2/suppliers=1、`q=POP`→1/1/1；`GET /products/zb-k60`→ACTIVE＋8 参数 READABLE；Search / Discovery / Product Detail / Parameter Context 均 READABLE，**无 ARCHITECTURE / IMPLEMENTATION GAP**。
- **Core Data Gate（763）**：Published Product≥1 ✅ / Published SupplierProduct≥1 ✅ / SUPPLIER Org≥1 ✅ / Product↔SupplierProduct valid ✅ / SupplierProduct↔SUPPLIER Org valid ✅ / Product Parameter Profile≥1 ✅ ⇒ **M34.6 CORE DATA GATE = READY**。
- **Extended / Workflow / Commercial**：Extended=READY（4/5，`same Product+multiple SupplierProducts`=Extended Scenario Gap 非阻断）；Workflow=CONDITIONAL（Demand=3/RFQ=2/RFQResponse=1 存续，未触碰）；Commercial=OPTIONAL（Offer=0，DO NOT CREATE OFFER）。
- **Change Surface（763）**：Schema=NONE / Migration=NONE / Production Code=NONE；仅新增未跟踪 `database/_763_onboard.sql / _763_probe.sql / _763_verify.sql` 与文档。Search/Discovery/Product/SupplierProduct/Parameter/Matching/Inquiry/RFQ=NO CHANGE；Synthetic Data=NONE；Fake Transaction/Offer/Review/Order=NONE。
- **Image/Media（763 OPTIONAL）**：公开产品图未进入媒体/文件存储流水线，记录为可选 Data Gap（不阻断 Core）。
- **M34.6 = NOT AUTHORIZED（PENDING RECHECK）**：**Core Data Gate READY ≠ M34.6 Authorized**，授权仍由后续独立 Gate Recheck 结合 Extended/Workflow/Commercial 完整性决定；不得在 763 内写成 AUTHORIZED。
- **Shortlist Persistence Boundary = ARCHITECTURE DECISION REQUIRED（保持，763 不裁决；不创建 Shortlist / Evaluation / Favorite / Watchlist）**。

### 23.5 M34 Roadmap State（763）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=ACCEPTED / CONDITIONAL（保持）；762=STRUCTURALLY READY·INSTANCE NOT READY（保持）；763=CURRENT（Controlled Test Data Onboarding）；M34.6=NOT AUTHORIZED（PENDING RECHECK，Core Data READY）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。C2=CONDITIONAL / C5·C6=FOUNDATION·NOT FULL（763 未升级）。**

- 报告：`docs/_review/763_M34.6_Controlled_Test_Data_Onboarding_Report.md`

---

## 24. M34.6 Authorization Recheck（764）

- **性质**：Authorization Gate 独立重查（READ-ONLY / NO CODE CHANGE / NO DATA CREATION）。基于 761/762/763 冻结证据，对 M34.6 授权做唯一最终判定。
- **基线/Baseline Integrity**：Repository `F:\Desktop\VISNDT` / Code Root `F:\Desktop\VISNDT\VISNDT` / Branch `main` / HEAD=`ff03a9a`（**无漂移**）/ `git diff HEAD -- schema.prisma`=0（Schema=NONE）/ 764 零生产代码·零 Schema·零 Migration·零数据（Working Tree 169 项均为历史改动）。
- **ONE Authority 冻结确认（764）**：`Product / SupplierProduct / Organization / ProductCategory / ParameterDefinition / KnowledgeEntry` 保持既有 Authority；`schema.prisma` 无 Shortlist/Evaluation/Favorite/Watchlist/Comparison 一级 Domain Model → **New Domain Authority = NONE**。
- **Core Dataset Recheck（DB 实证，关系验证非仅 COUNT）= READY**：Product=4·ACTIVE=4；SupplierProduct=4·PUBLISHED=4；Discoverable Supplier=2；ProductParameterValue=32；orphan_sp=0·sp_bad_org_type=0·products_with_profile=4；每 Product 8 PPV/8 DEF。
- **Runtime（GET 仅读）=全 PASS**：`/api/v1/search?q=内窥镜`→products=2·sp=2·suppliers=1；`q=POP`→1·1·1；`GET /products/zb-k60`→status=ACTIVE＋8 参数 READABLE（含 parameterDefinition）。Search/Discovery/Product detail/Parameter Context 全 READABLE。
- **Extended 表述纠正（764）**：**763 的 `Extended=READY(4/5)` 不再沿用** → **Extended=PARTIAL / CONDITIONAL（SCENARIO GAP）**（`products_with_multiple_sp=0`=same Product+multiple SupplierProducts=0；不为填充创建重复 SP）。
- **Workflow=CONDITIONAL**（Inquiry=0 / Demand=3 / RFQ=2 / RFQResponse=1 既有存续，未触碰）；**Commercial=OPTIONAL**（Offer=0，DO NOT CREATE OFFER）。
- **Data Provenance=PASS**：所有行含 `[M34.6 CONTROLLED TEST DATA]` 前缀，受控边界正确；Synthetic Production Data=NONE；Fake Transaction/Order/Payment/Sales/Cert/Review=NONE。`[PUBLIC SOURCE DATA]` 标签部分 UNVERIFIED（Rule E：文档校正确认、DB 不修改）。
- **Shortlist Persistence Boundary = ARCHITECTURE DECISION REQUIRED**：判定 **Case A = CARRY FORWARD（当前非阻断）**——schema 无 Evaluation/Shortlist 模型，且既有 M34.6 Gate 未将 Persistent Evaluation State 列为授权前置；但**在铺开完整 Evaluation 能力前必须完成该架构决策**。
- **最终判定（764）**：
  > **M34.6 = CONDITIONAL**
  >
  > 依据七维共同判定（Core+Extended+Workflow+Commercial+Architecture Decision+Data Provenance+Baseline Integrity）：Core=READY 且主 Gate（Publication/Supplier Discovery/Parameter/Search）全 PASS，但存在**明确限制条件 C1-C7**（Extended PARTIAL、Workflow CONDITIONAL、Commercial OPTIONAL、Shortlist Arch Decision REQUIRED、required 无强制、Image 可选缺口、PUBLIC_SOURCE 标签 UNVERIFIED）。**Core Data READY ≠ AUTHORIZED**；不采用 PENDING；本任务**未**写成 AUTHORIZED。

### 24.5 M34 Roadmap State（764）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=NOT AUTHORIZED（保持）；762=STRUCTURALLY READY·INSTANCE NOT READY（保持）；763=CONTROLLED TEST DATA ONBOARDING·PASS（保持）；764=CURRENT（Authorization Recheck·M34.6=CONDITIONAL）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。C2=CONDITIONAL / C5·C6=FOUNDATION·NOT FULL（764 未升级）。**

- 报告：`docs/_review/764_M34.6_Authorization_Recheck_Report.md`

## 25. M34.6 Conditional Gap Closure（765）

- **性质**：764 `M34.6=CONDITIONAL` 后的**条件闭环任务**。仅解除可解除条件（C1/C2/C4/C7）+ 受控测试数据补足 + Shortlist 架构决策 + 文档同步。**不实施 M34.6、不宣布 AUTHORIZED**（AUTHORIZED 须由后续独立 Authorization Recheck 重判）。
- **Baseline Integrity（765）**：Repository `F:\Desktop\VISNDT` / Code Root `F:\Desktop\VISNDT\VISNDT` / Branch `main` / HEAD=`ff03a9a`（**无漂移**）/ `git diff HEAD -- schema.prisma`=0（Schema=NONE）/ 765 零生产代码·零 Migration（Working Tree `M`/`??` 生产文件均为历史任务改动，765 未触碰）。
- **C1 Extended Scenario=CLOSED**：为 ZB-K60 新增第 2 SupplierProduct `ZB-K60-EX`；用差异化 modelNumber（不修改 Schema、不绕过 `@@unique([organizationId,platformProductId,modelNumber])`），经既有生命周期状态机 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED` 审订（非直接 UPDATE 成 PUBLISHED）；绑定合法 Product ZB-K60 + 微视（type=SUPPLIER）。**`products_with_multiple_sp` 0→1**（`multi_sp_products=1`）；SupplierProduct **4→5（5/5 PUBLISHED）**。
- **C2 Workflow Inquiry=CLOSED/VERIFIED**：1 条受控 Inquiry（id=`204b6570-8410-4e2d-9aec-88b08e2d7404`，product=ZB-K60，org=微视，by=`zhangsan.763@visndt.local`，status=NEW），消息标注 `[M34.6 CONTROLLED TEST DATA][765 CONTROLLED INQUIRY]`；经既有 Authority + JWT 认证读取验证（`inquiry=1`）；**未扩展** Inquiry→Demand/Match/RFQ/Offer/Order，无 Fake Customer/Order/Payment/Revenue/Sales/Commission/Transaction。
- **C4 Shortlist Persistence Boundary=DECIDED（Decision Only）**：新增独立 ADR `ADR-M34-13-Shortlist-Persistence-Boundary.md`（编号先查现有 ADR 未重复）。结论 **Option B — Persistent User Evaluation State**（买家用户维度评估断面）；已核验 `schema.prisma` 无 Shortlist/Evaluation/Favorite/Watchlist/Comparison 一级模型（**New Domain Authority = NONE**）。**Implementation=NOT STARTED** / Schema=NONE / Migration=NONE；**Decision First — Implementation Later**；ADR 明确「本次决策 ≠ 功能已实现」。
- **C7 Data Provenance=CORRECTED（文档纠正，DB 不修改）**：763 §3 `PUBLIC_SOURCE_DATA` 重分类为 `USER_PROVIDED_TEST_DATA`（产品参数实际来自用户/受控指令 §10-12，官网来源 **UNVERIFIED**，禁止写成「官网已确认」）；`[PUBLIC SOURCE DATA]` 数据库描述文本保持不改（遵循 764 Rule E）。
- **Runtime（只读 DB 实证）**：products=4 / sp=5(pub=5) / ppv=32 / `multi_sp_products=1` / `inquiry=1` / `discoverable_suppliers=2` / 4 参数 Profile（各 8 PPV）；C1 ZB-K60 双 SP、C2 Inquiry API 认证可读全 PASS。orphan=0·bad_org_type=0。
- **保留项（OPTIONAL/DEFERRED，性质未变）**：C3 Commercial=OPTIONAL/DEFERRED（Offer=0）；C5 ParameterDefinition.required=DEFERRED（字段有、无 Runtime Enforcement）；C6 Image/Media=OPTIONAL/DEFERRED。
- **Authorization Boundary（765）**：**不宣布 M34.6=AUTHORIZED**。最高结论 `765=PASS / CONDITIONAL CONDITIONS CLOSED；M34.6 Authorization = READY FOR INDEPENDENT RECHECK`；`AUTHORIZED` 须由后续独立 Authorization Recheck 决定（AUTHORIZED/CONDITIONAL/NOT AUTHORIZED）。

### 25.5 M34 Roadmap State（765）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=NOT AUTHORIZED（保持）；762=STRUCTURALLY READY·INSTANCE NOT READY（保持）；763=CONTROLLED TEST DATA ONBOARDING·PASS（保持）；764=CONDITIONAL（保持）；765=CURRENT（CONDITIONAL CLOSURE·765=PASS）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。C3=OPTIONAL·DEFERRED / C5=DEFERRED / C6=OPTIONAL·DEFERRED / C7=CORRECTED（C1·C2·C4 已闭环）。**

- 报告：`docs/_review/765_M34.6_Conditional_Gap_Closure_Report.md`
- 决策：`docs/_architecture/ADR-M34-13-Shortlist-Persistence-Boundary.md`

## 26. M34.6 Independent Authorization Recheck（766）

- **性质**：对 765 条件闭环结果的**独立授权复核**。READ-ONLY（零代码 / 零 Schema / 零 Migration / 零数据创建）。`765 PASS ≠ M34.6 AUTHORIZED`，本结论由 766 **独立重新取证**判定（Anti-Automation Rule）。
- **Baseline Integrity（766）**：Repository `F:\Desktop\VISNDT` / Code Root `F:\Desktop\VISNDT\VISNDT` / Branch `main` / HEAD=`ff03a9a`（**无漂移**）/ `git diff HEAD -- database/prisma/schema.prisma`=0（Schema=NONE）/ Migration=36（无 765/766 新增）/ 766 零生产代码·零业务数据（Working Tree `M` 生产文件均历史任务改动；`_766_verify*.sql`=766 只读验证产物）。
- **766 独立实证（非继承 765）**：Core Dataset=**READY**（product=4 ACTIVE / sp=5 PUBLISHED / ppv=32 / discoverable=2 / profiles=4 / orphan=0·bad_org=0）；Extended Dataset=**COMPLETE**（multi_sp_products=1，ZB-K60 挂载 ZB-K60+ZB-K60-EX 双 PUBLISHED SP，同 platformProductId=`ebb1c034…`、同合法 SUPPLIER 组织微视，运行时可发现）；Workflow/Connection=**READY**（受控 Inquiry id=`204b6570…`，status=NEW，marker=`[M34.6 CONTROLLED TEST DATA][765 CONTROLLED INQUIRY]`，product=ZB-K60·org=微视 type=SUPPLIER，既有权认证路径可读）；Commercial=**OPTIONAL**（Offer=0，非 Core 依赖）；Search/Discovery=**PASS**（q=内窥镜→2 products/3 SP/1 supplier，ZB-K60-EX 可发现；Search/Discovery Source Code=unchanged）；Parameter Runtime=**PASS**（`GET /products/zb-k60` 8 参数 ACTIVE）。
- **Data Provenance= PASS**：全文档无「官网已确认/已核实/确认」措辞；763 §3 `PUBLIC_SOURCE_DATA` overclaim 已由 764/765 纠正，本任务对 PROJECT_STATUS/ROADMAP 763 分类行追加 **superseded** 标注 → `USER_PROVIDED_TEST_DATA` + `UNVERIFIED`（DB 文本不改）。Controlled Boundary=**PASS**（order_item/payment/revenue/customer/commission 表不存在 → Synthetic Production Data=NONE；Demand/RFQ/RFQResponse 均 created 2026-08-07~08-23，早于 765=08-31，为历史受控数据，无扩张）。
- **ONE Authority=PASS**（`schema.prisma` 无 Shortlist/Evaluation/Comparison/Favorite/Watchlist 等新一级模型）；**ADR-M34-13=VERIFIED**（Decision ID 正确 / Option B Persistent User Evaluation State / Authority Boundary=NONE new / Implementation=NOT STARTED /「本次决策≠功能已实现」/ Schema=NONE / Migration=NONE，与 schema+Contract 一致，无功能宣称、无冲突）；**Mobile Contract=PRESERVED**（Desktop + Mobile Runtime=Required 保持，Mobile UI 仅 Implementation Deferred，Contract Required，非阻断）。
- **Documentation State=CONSISTENT**：状态链 761=NOT AUTHORIZED / 762=STRUCTURALLY READY·INSTANCE NOT READY / 763=PASS / 764=CONDITIONAL / 765=PASS（不写作 AUTHORIZED）/ 766=INDEPENDENT AUTHORIZATION RECHECK·AUTHORIZED；全库无 `765=AUTHORIZED` 误记。
- **Authorization Decision Matrix（766）**：Repository Baseline=PASS / Baseline Drift=NONE / Schema=NONE / Migration=NONE / Production Code=NONE / Core=READY / Product Publication=PASS / SP Publication=PASS / Supplier Discovery=PASS / Parameter Runtime=PASS / Extended=COMPLETE / Workflow=READY / Commercial=OPTIONAL / Data Provenance=PASS / Controlled Boundary=PASS / ONE Authority=PASS / Shortlist ADR=DECIDED / Mobile=PRESERVED / Documentation=CONSISTENT。**Blocking Conditions=[NONE]**；Non-blocking/Deferred=[C3] Commercial OPTIONAL/DEFERRED、[C5] required=DEFERRED、[C6] Image/Media OPTIONAL/DEFERRED、[M] Mobile UI Implementation=Deferred（Contract Required）。
- **Authorization Boundary（766）**：Case A 全满足（无未解除 Blocking Condition）→ **M34.6 = AUTHORIZED**。**`766 = INDEPENDENT AUTHORIZATION RECHECK；M34.6 = AUTHORIZED`**。**即使 AUTHORIZED 也不自动实施下一阶段**；**Next Authorized Step = M34.6 Implementation（Evaluation + Connection）= 独立任务 767**（须下一独立指令）；不得自动执行 M34.6 实施 / M34.7 / M34-FINAL / Compare / Shortlist / Evaluation / Inquiry Expansion / Demand Expansion / RFQ / Matching / Marketplace / Transaction / SEO / LLM / Vector / RAG / Search 2.0 / Mobile UI / Homepage。

### 26.5 M34 Roadmap State（766）

**M33=CLOSED；M34.0=CONDITIONAL；M34.1/2/3=COMPLETE·CONDITIONAL；M34.4·M34.4R·M34.5·758·759=CONDITIONAL PASS（保持）；760=NOT AUTHORIZED（保持）；761=NOT AUTHORIZED（保持）；762=STRUCTURALLY READY·INSTANCE NOT READY（保持）；763=CONTROLLED TEST DATA ONBOARDING·PASS（保持）；764=CONDITIONAL（保持）；765=PASS（保持，不写作 AUTHORIZED）；766=CURRENT（INDEPENDENT AUTHORIZATION RECHECK·M34.6=AUTHORIZED）；M34.7=NOT AUTHORIZED；M34-FINAL=NOT STARTED。C1·C2·C4=CLOSED / C7=CORRECTED；C3=OPTIONAL·DEFERRED / C5=DEFERRED / C6=OPTIONAL·DEFERRED / M=Mobile UI Implementation=Deferred。**

- 报告：`docs/_review/766_M34.6_Authorization_Recheck_Report.md`

## 27. M34.6 Implementation & Post-Implementation（767 / 768）与 M34.7 Architecture Gate（770）

### 27.1 M34.6 Implementation（767）→ Post-Implementation Recheck + Closeout（768）

- **767（M34.6 Implementation）**：在 766 AUTHORIZED 基础上实施 Evaluation + Connection 后端。新增 `BuyerEvaluation` 受控表（落实 ADR-M34-13 Option B，评估断面 **NOT Domain Authority**）+ enums `EvaluationTargetType(PRODUCT/SUPPLIER_PRODUCT)` / `EvaluationState(INTERESTED/SHORTLISTED/COMPARING/CONTACTED)`，Migration `20260831090000_017_buyer_evaluation`，Integration `app.module`。RBAC=BUYER-only，owner isolation 403，duplicate 409，Connection 复用既有 Inquiry 权威（不新建第二套）。
- **768（Post-Implementation Recheck + Closeout）**：独立复核（不继承 767 PASS）+ **Product Connection Authority 最小修正（Case A）**——依 §10.3，Supplier 连接 = **PUBLISHED SupplierProduct → Organization(type=SUPPLIER)**（备选 Offer，零 Offer 依赖）；修正 `evaluations.service.ts` 后 Product Connection orgId 正确。Runtime 21/21 PASS；Migration Artifact=**CLEAN**。**M34.6 = CLOSED**（Closeout Gate G1–G18 全 PASS）。
- **Continuing authority**：BuyerEvaluation 保持 NOT Domain Authority；Evaluation ≠ Inquiry（Connection 走既有 Inquiry 单一权威）。

### 27.2 M34.7 Buyer Workspace Evaluation Experience Architecture Gate（770）

- **性质**：Architecture Gate（READ-ONLY · NO UI · NO Code）。定义 Buyer Workspace **消费** BuyerEvaluation 的 Target-State，不实施 UI。
- **Target IA / Route**：单一一级 **`/workspace/evaluations`**（认证 BUYER 私有）；Interested / Shortlisted / Comparing / Contacted 为 **UI Filter / Tab**（query param `?state=`），**非独立路由**。禁止 `/shortlists` `/favorites` `/watchlists` `/comparisons` `/buyer-evaluation-system` 平行架构。
- **Evaluation State**：INTERESTED/SHORTLISTED/COMPARING/CONTACTED 4 状态（§2.1 语义矩阵）；**COMPARING = persistent state（DB 枚举成员）**，UI Comparing 视图 = 对该状态下评估的过滤；临时对比选中集为 Frontend transient（`compare=<ids>` query），**不写 DB**。NOT_EVALUATED = UI 派生（非 DB 枚举）。
- **Connection**：**Evaluation → connectionContext → 既有 Inquiry flow**（单一入口），Evaluation ≠ Inquiry，不创建第二套。
- **Mobile**：Mobile = 与 Desktop 同等级约束（Desktop IA = Mobile IA，Layout 自适应）；窄屏 **COMPARING 禁止 unbounded 横向对比表**，改纵向/翻页对比，无 horizontal overflow / desktop-only interaction。
- **API**：复用 M34.6 六端点（POST/GET/GET:id/GET:id/connection/PATCH:id/DELETE:id），**禁止新增/修改**；服务端按 `state` 过滤（若需）记为 **API GAP → Future / Separate Authorization**。
- **Scope/Expansion**：New Domain / Authority / API / Schema / Migration / Business Model / Transaction = **NONE**；UI Component / 页面 / 路由实现 = **NONE**。代码改动 = `NONE`。
- **Decision**：M34.7 Architecture Gate = **DECIDED**（Target-State 成立）；**M34.7 Implementation Gate = READY WITH CONDITIONS**（Conditions：① server side state-filter → Future if needed；② 768≈140px 历史溢出 NON-BLOCKING，不得新增溢出回归；③ 复用公开 Compare 组件须重新派生自 BuyerEvaluation 过滤集；④ Workspace 走 Tailwind 体系，避免 AntD 耦合）。
- **M34.7 Roadmap State（770）**：**M34.6=CLOSED；770=CURRENT（ARCHITECTURE GATE · DECIDED · READY WITH CONDITIONS）；M34.7 Implementation=NOT STARTED**。即使 Gate READY 也不得自动实施 UI；须新独立指令授权。
- 报告：`docs/_review/770_M34.7_Buyer_Workspace_Evaluation_Experience_Target_State_And_IA_Architecture_Gate_Report.md`

### 28.1 End-State Search Authority & Public Discovery Model（FROZEN · 813 对齐审计 + 814 收敛实施确认）

本契约冻结最终公开发现模型，覆盖（并取代）上文历史日志中与下述边界冲突的旧表述（历史流水保留原状，以本节为当前现状）：

- **FROZEN AUTHORITY**：**Product = PRIMARY SEARCH AUTHORITY（WHAT）**；**SupplierProduct = SUPPORTING SEARCH SIGNAL（WHICH MODEL）**；**Supplier = CONTEXTUAL PROVIDER（WHO）**；**Offer = PRIVATE COMMERCIAL / BUSINESS RESPONSE**。
- **Search 口径（814 实施后）**：`/search` 为唯一统一公共搜索权威。公开结果以 **Platform Product 为主权威卡**，SupplierProduct 型号与供应商经 `platformProductId` 聚合为 Product 卡下的 **ProductSupplierContext（匹配型号 / 相关供应商）** 上下文呈现；**不再存在** Supplier / SupplierProduct 主动搜索类型、独立分页计数、独立结果卡或独立 SEO 权威。旧 `?type=supplier`/`type=supplier-product` URL 优雅归一为 `all`（向后兼容，非权威）。
- **Public Commerce Boundary（813-G5 → RESOLVED）**：**公开展示不含价格 / 货币 / Offer 计数 / 商业可购状态**；**且公共 `/search` 与遗留 `/search/supplier-models` 的 API JSON 载荷层亦不含 `commercialSummary`（offerCount/activeOfferCount/priceFrom/priceTo/currency）**（2026-09-03 授权载荷级修复）；**Offer 及其价格仅存于私有商业工作流（RFQ / Inquiry / Workspace）**。
- **SupplierProduct self-service 未声明完成**：SupplierProduct 写路径仍为 ADMIN-only；供应商自服务 / attach / claim / media / parameter 管理 **NOT IMPLEMENTED、不得标 COMPLETE**；后续治理候选须独立授权。
- **Semantic / SEO / LLM 层级**：公开语义层次必须保持 **WHAT（Product）→ WHICH MODEL（SupplierProduct）→ WHO（Supplier）**，且 Offer 置于最底层商业语境；任何公开面不得将 Supplier / SupplierProduct / Price / Inventory 置于 Discovery 优先级前。
- **Do NOT**：构建 SupplierProduct 目录 / 独立 Search 类型 / 公共价格库存 / SEO 洪泛 / 权威重复；不得改变 Offer 模型 / 价格存储 / RFQ / Inquiry / Product 权威。
- 验证：`docs/_review/814_Post_M39_Search_Authority_And_Public_Display_Convergence_Implementation_Report.md`（DECISION=A CLOSED）。