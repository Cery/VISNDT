# 751_M34_Platform_Architecture_Consistency_And_Capability_Model_Challenge_Report

## 1. Task Summary

本任务是对 750 冻结的 **M34 Platform Architecture Contract** 进行一次**有界架构一致性挑战（Architecture Consistency Challenge）**。核心目标是：**尝试推翻（Challenge）**「Capability = Product 的发现语义角色」等核心契约，验证在 750 冻结模型下，Capability-led Discovery 是否真正成立，而非仅是「把 Product Catalog 重新包装成 Capability Platform」。

- Task: `751_M34_Platform_Architecture_Consistency_And_Capability_Model_Challenge`
- Stage: M34.0 — Platform Experience Architecture Reconstruction（Architecture Validation Gate）
- Execution Mode: READ-ONLY ARCHITECTURE VALIDATION + DECISION CHALLENGE + IMPLEMENTATION GATE REVALIDATION
- 核心原则：
  - Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State = Platform Experience State
  - Visual Transformation ≠ Platform Transformation
  - **Do not ask "Can the Product model be renamed Capability?" — Ask "Can the Product model actually support Capability-led discovery without becoming another Product Catalog?"**
- 本任务**不是**重跑 746/749/750，也**不是**全量项目扫描。
- 本任务零代码、零数据库、零存储、零 Schema、零路由、零 UI 变更；新发现只 Record / Classify / Trace / Gate。
- 本任务完成后 **STOP**，不得自动进入 M34.1。

### Challenge 方法
每项采用 `Claim → Counterexample → Evidence → Decision`。

---

## 2. Repository Verification

| 项 | 值 | 证据 |
|---|---|---|
| Repository Root | `F:\Desktop\VISNDT` | `git rev-parse --show-toplevel` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` | `.trae/rules/项目路径.md` 现场确认 |
| Branch | `main` | `git branch --show-current` |
| Commit | `ff03a9a368f3490094cf57015ce4799904ad283c` | `git rev-parse HEAD` |
| Working Tree | **OTHER** | `git status --short` |
| 变更计数 | 3 份文档 `M` + 契约/报告 untracked + M33 大量历史 untracked | `git status --short` |

**BEFORE_EXECUTION_WORKTREE_STATE**：Working Tree = OTHER（M33 visual redesign untracked 历史 + `docs/project-management/*.md` M + 750 报告/契约 untracked）。本任务仅新增 751 报告 + 契约状态更新 + 三份文档同步；未 reset / restore / checkout / clean，未删除任何 untracked。
**AFTER_EXECUTION_WORKTREE_STATE**：与 BEFORE 相比仅新增本任务产物。

---

## 3. Baseline Verification

已实际读取并核对：

- `docs/_review/746_PRE745_M34_Full_Project_Fact_Scan_Report.md`
- `docs/_review/747_M34-DATA-01_Controlled_Test_Data_Scan_Classification_Backup_Report.md`
- `docs/_review/748_M34-DATA-02_Controlled_Test_Data_Cleanup_Report.md`
- `docs/_review/749_M34_Platform_Experience_Architecture_Audit_Report.md`
- `docs/_review/750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate_Report.md`
- `docs/_architecture/M34_Platform_Architecture_Contract.md`（完整读取）
- `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md`

### M33 Protection
- **M33 = CLOSED**。本任务未 reopen M33、未修改 744、未创建 M33.14+、未进行任何 visual repair。

### Data / Storage Protection
- **Database Mutation = NONE**，**Storage Mutation = NONE**。未执行任何 DELETE/UPDATE/INSERT/UPSERT/TRUNCATE/DROP/MIGRATION/SEED。

### Runtime Boundary
- 容器：`visndt-postgres`（healthy）、`visndt-minio`（Up）。
- 端口：5432 / 9000 / 9001 / 3001(Web) / 4000(API) = True；3000 = False（历史遗留，与 750 一致）。
- 只读探针：`GET /api/v1/health` = 200，`GET :3001` = 200。仅 GET/HEAD 只读，未产生任何 Demand/RFQ/Inquiry/Product/SupplierProduct。

---

## 4. 750 Decision Set Under Challenge

在 750 冻结契约中，被挑战的核心决策集（Contract §1-§9）：

| 750 Claim（冻结） | 本任务反证目标 |
|---|---|
| Capability = Product 的发现语义角色（非独立实体） | Challenge A |
| Product = Capability Authority + Catalog 一体 | Challenge B |
| Capability(Product) 1 → N SupplyProduct；Secondary=FUTURE | Challenge C |
| Specification = 参数规格横切维度（Dictionary only，模板 DEFERRED） | Challenge D |
| Supplier = Organization + profile 语义（NO SCHEMA） | Challenge E |
| Search = 统一聚合 + 参数 facet + Capability 维度 + Supplier 暴露 | Challenge F |
| Public/Workspace 连续性 = 对象引用 + canonical URL + workspace 持久 | Challenge G |
| IA = DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN | H/I |
| Capability=Product ↔ SEO/LLM 语义锚 | J |
| Governance = Platform=Rules / Supplier=Assets / Buyer=Intent | K / Low-Operation |

---

## 5. Capability=Product Challenge（Challenge A）

### Claim
Capability = Product 的发现语义角色，足以支撑 Capability-led Discovery。

### Counterexample
用户不知道型号，只想「小直径检测/管内窥视」→ 架构是否允许以 Capability 为入口，还是只能先想 Product 再反推 Capability？若只能「输入 Product 名 → Product 结果 → 判断能力」，则 Capability-first = FAIL，且 `capabilities` 只是**语义别名（semantic alias）**。

### Evidence（现场复核）
- 数据库层：`schema.prisma` **无 `Capability` model/表**。Capability 语义唯一载体 = `Product`（`categoryId+name+model+slug+description`）+ `ProductCategory`。
- API 层：`capabilities.controller.ts` 仅 `@Controller('capabilities')` + `@Get(':id')` —— **只有单 Product 的详情投影，没有任何独立能力列表/检索端点**。
- 搜索层：`searchProducts` 关键字命中 `Product.name/model/description`；能力维度只落为 `categoryId` facet。
- 前端层：无 `/capabilities`；`/products` 被文案框定为「工业检测能力注册表」，Category 铁轨**逐项标注「检测能力」**，参数 facet 依分类上下文加载（见 `/products/page.tsx`）。

### Decision
- **Capability 当前无任何独立对象/检索/路由入口** —— 作为「对象」它 **FAIL**（确实只是语义角色）。
- 但 Capability-led **发现入口**可由 **Category（分类法粒度 = 能力粒度）** 承担：用户「小直径检测」→ 选 Category（=能力）→ 按参数 facet 收窄 → 定位 Product/Supplier。此路径**真实存在且被前端文案强化**。
- 关键结论：**Capability-led 是否成立，取决于「Category 是否以能力粒度治理」这一未在 750 明确强制的前置条件**。若 Category=能力粒度强制执行，则 Capability-first 成立；否则退化为 naming。
- 反证结果：**PARTIAL**（语义角色 + Category 锚可支撑；但 Capability 无独立发现表面，且依赖 Category=能力粒度的治理约束）。→ 需求记为一个**契约修订项（Amendment #2）**。

---

## 6. Product Semantics Challenge（Challenge B）

### Claim
Product = Capability Authority + Catalog 一体，用户看到的仍是「能力」。

### 6.1 Product Semantics Test
`Product` 字段混合两类语义：
- **能力语义（Capability）**：`name`（能力名）、`description`（能力描述）、`categoryId`（能力/检测对象归类）、`parameterValues`（典型规格）。
- **产品语义（Product）**：`model`（型号）、`slug`、`offers`（报价）、`supplierProducts`（供应商型号）、`compare`（前端比较）。
两者确实发生混合：没有字段把「Capability Definition / Scope / Application / Typical Specification」与「Product Name / Model / Technical Parameters」分开承载。这是**语义融合（fusion）**，不是严格矛盾，但要求 Category + 文案承担能力语义的区隔。

### 6.2 Product Catalog Regression Test
现场复核 `/products/page.tsx`：虽然标题为「能力注册表」，但交互组件为 `ProductGrid` + `ProductCard` + **浮层 `CompareBar`（Compare 最多 4）** + `/products/compare` 页 + 排序 + Pagination。→ **PRODUCT-CATALOG REGRESSION RISK 存在**（UI 呈现仍是 Product Gallery / Compare 语义）。
- 该风险是**前端接线**问题，不是数据/schema 矛盾；不受 Schema 影响，属 FRONTEND-ONLY 治理（M34.4）。
- 判定：**PRODUCT-CATALOG REGRESSION RISK = YES（非阻断 M34.1，但必须进入 M34.4 frontend discipline）**。

### Decision
- Product 作为能力权威 + 目录**在模型层成立（VALIDATED）**；但存在**产品目录回潮的 UI 隐患**（Compare/Gallery），需 frontend 治理，不阻断 M34.1 基础（M34.1 是 Product 基础，不在本任务实现 UI）。
- 反证结果：**PARTIAL（产品目录回潮风险存在，模型层 VALIDATED）**。

---

## 7. Capability ↔ SupplyProduct Challenge（Challenge C）

### Claim
Capability(Product) 1 → N SupplyProduct；Secondary=FUTURE 不影响 M34.1。

### Evidence
- `schema.prisma`：`SupplierProduct.platformProductId → Product`，多 SupplierProduct 指向一个 Product → **DB 层即 1:N，方向唯一**。
- `SearchSupplierProducts` 以 `platformProduct.status=PUBLISHED` 边界 + `platformProduct.categoryId` 作能力 facet。
- Scenario C1（一能力多产品）：`Small-Diameter Inspection → Product A/B/C` 由 1:N 表达，**成立**。
- Scenario C2（一产品多能力）：`SupplyProduct X` 同时适用 4 种能力 → 当前仅能为一个 `platformProductId`（primary）；**Secondary=FUTURE 无法表达**。
- 关键判断：M34.1 的**核心 Discovery 是 Category→Product→SupplyProduct→Supplier**，用户以「能力」为主词、以型号/供应商为结果。主能力 1:N **足以支撑该路径**；多能力归属是**型号级细分诉求**，属 M34 后期/M:N，不构成对第一轮核心发现路径的阻断。
- 判定：**VALID FOR M34.1**（1:N 现状成立；Secondary 不阻断第一轮 Discovery）。
- 反证结果：**VALAM（VALIDATED / 不升级为 BLOCKING ARCHITECTURE GAP）**。C2 标注为 FUTURE，不动契约 Cardinality。

---

## 8. Capability Specification Challenge（Challenge D）

这是第二个关键风险，也是本任务**最主要的实质发现之一**。

### Claim
Specification = 参数规格横切维度（Parameter Dictionary only），Capability 的 Specification 从而而来已可回答。

### Counterexample
Capability 非独立实体 → Capability 级「典型规格」（如 Small-Diameter Inspection 的 Typical Probe Diameter）从哪来？

### Evidence
- 参数字典模型完整：`ParameterDefinition / ParameterOption / ProductParameterValue / SupplierProductParameterValue / DemandParameter`（跨 Product/SupplyProduct/Demand 复用）。
- **没有任何 aggregation / typical / MIN / MAX / RANGE 逻辑**：`ProductParameterValue` 仅 `value + valueNumber`，按 `(productId, parameterDefinitionId)` 唯一。
- 因此 Capability 级规格聚合（3 个产品探径 2.8/1.8/1.2mm → Typical 1.8mm）在**当前模型/代码中不存在**——既非 MIN/MAX/RANGE 聚合，也非常量/典型字段。

### Challenge D 权威判定（本任务必须裁决）
**Capability Specification Authority = Hybrid（Product-derived + Admin-curated）：**
- **权威来源**：以 `Product` 描述参数的**原始值集合（PRODUCT-DERIVED）**为基础；「典型值」（TYPICAL）由 **Admin 在 Category/Capability 维度人工策展**。
- **谁改**：Admin（策展/Guard），Supplier 仅维护其 SupplyProduct 自身参数。
- **谁审**：Admin / Platform（参数字典 governance）。
- **谁显示**：Capability/Product 详情 + 搜索 facet。
- **谁用于 Search**：原始参数值作 facet（现有 `searchProducts`/`searchSupplierProducts` 已按参数值过滤）。
- **谁用于 Match**：`DemandParameter`（现有确定性撮合用需求参数对能力参数）——沿用原始值，不需典型值。
- **实现方式**：Capability 级聚合为**展示层/检索层投影**，**不新建表、不新增字段、不做迁移**；无独立 `capability_spec` 表。

### Decision
- 750 契约（E 组 + §1.5）**未声明** Capability Spec 的权威来源与聚合语义 —— 这是本挑战识别出的**契约缺口**。
- 但它是**可零变更解决**的（声明 authority = Product-derived + Admin-curated typical；用现有原始参数值即可 Search/Match），**不是 Schema 缺口**。
- 判定：**PARTIAL（模型完整度取决于 authority 声明；即时声明为修订项 Chief #1）**。不阻断 M34.1 的 Product 基础（Product 参数已可用于 Search/Match），但必须在 M34.1 实施前把 authority 写入契约修订。

---

## 9. Supplier Discovery Challenge（Challenge E）

### Claim
Supplier = Organization + profile 语义；不依赖已有交易即可被发现。

### Evidence
- `searchSuppliers` 只按 **Offer** 聚合（`Offer.status in SUBMITTED/ACCEPTED`）→ **当前实现中，无 Offer 的供应商无法被检索**（DISCOVERY MODEL INCOMPLETE，作为实现现状成立）。
- 但 schema 支持概念模型 `Organization → SupplierProfile(语义) → SupplyProduct(PUBLISHED) → Capability(platformProduct)`；`SupplierProduct.organizationId + status=PUBLISHED` 已存在 → **无需 Offer 即可描述供给能力**。
- 即：**意图成立（Organization+Published SupplyProduct 模型支持无交易发现），实现不成立（searchSuppliers 依赖 Offer）**。

### Decision
- **反证结果：PARTIAL**。概念模型支持，但**当前接线把 Supplier 发现绑死在 Offer（交易行为）上**。
- 必须修订：**Supplier 发现改为以 PUBLISHED SupplyProduct 为基线**（Organization 汇总其发布型号 → Capability），二手搜索供应商聚合成 org 维度；旧 `searchSuppliers`(Offer) 标记 legacy。**NO SCHEMA**（API + Frontend，归 M34.4/M34.6）。
- 该修订与 750 契约 §8 G（Mon 供应商暴露修复）方向一致，本任务将其**显式化为实施条件**。

---

## 10. Search Capability-led Challenge（Challenge F）

### Claim
Search 能从 Product-centric 转化为 Capability-led Discovery。

### 10.1 架构级模拟（五种 intent）
| query | Capability 解释 | Specification 解释 | 判定 |
|---|---|---|---|
| `2mm flexible video endoscope` | 按字面匹配 Product.name/model/description | 需参数 facet（探径 2mm） | **PARTIALLY SUPPORTED**（仅当 Product 字面含关键词；探径需落到 facet） |
| `remote visual inspection` | 仅当能力名字面匹配 | 无 Spec 解释层 | **PARTIALLY SUPPORTED** |
| `pipe inspection` | 仅字面 | 无 | **PARTIALLY SUPPORTED** |
| `small-diameter inspection` | 仅字面；或经 Category 锚 | 无自动解释 | **PARTIALLY SUPPORTED / 依赖 Category=能力** |
| `high-temperature visual inspection` | 仅字面；或参数（耐温）facet | 需耐温参数 | **PARTIALLY SUPPORTED** |

**共同根因**：搜索是**纯关键字**（name/model/description），**无 intent→Capability 解释层、无 intent→Specification 解释层**。用户必须先落进 Category/参数 facet，才能「按能力」检索。

### 10.2 Search Regression Test
- Capability=Product → **Capability Search 在实现上 = Product 关键字搜索（semantic regression）**，除非用 Category 作能力入口 + 参数 facet 收窄。
- 判定：**capability discovery semantic regression = 已记录**；能力语义搜索需在 M34.4 增加「能力意图→Category 映射（taxonomy/synonym）」层（NO SCHEMA）。

### Decision
- 反证结果：**PARTIAL**。搜索支持「Category→参数 facet→Product/Supplier」能力路径，但**不支持从自然语言意图自动进入 Capability Context**；无非要在 M34.1 前解决，但须作为 M34.4 搜索方向契约的显式前置（主导 + 修订）。

---

## 11. Public / Workspace Challenge（Challenge G）

### Claim
Public → Object URL → Workspace 围绕相同对象持续。

### Evidence（路由现场）
- Public：`/products/[slug]`、`/categories/[slug]`、`/suppliers/[id]`、`/search`、`/knowledge-base`。
- Workspace：`/workspace/demands`、`/workspace/demands/[id]`、`/dashboard/buyer`；`/workspace/matches/[matchId]`、`/workspace/rfqs`；`/dashboard/supplier`。
- 对象关联：`DemandMatch.productId`、`RFQ.sourceMatchId`、`RFQ.targetOrganizationId`、`RFQResponse.offerId`、`Inquiry` —— DB reference 链完整。
- Search query 状态不跨工作区（URL query），与 750 §6 一致。

### Decision
- Capability/Product/Supplier 经 canonical URL + object id 进入工作台；Demand/Match/RFQ 以工作台持久对象 + DB 引用存在。**连续性三重复合（对象引用 + canonical URL + workspace 持久）结构成立**。
- 反证结果：**VALIDATED**（Discovery→Action→Work 的闭环对象接线成立；非「网站→登录→另一系统」）。

---

## 12. Platform Mental Model Challenge（Challenge H）

### 三角色重审视
- **Guest**：能否 Find Capability/Product/Supplier/Compare → 能（`/products` 能力注册表 + Categories + 统一搜索），但 Compare 是 Product 语义 UI（回归面）。
- **Buyer**：Intent → Discovery → Capability → Product → Supplier → **成立**（Demand→Match→RFQ→Inquiry 链路存在）。
- **Supplier**：Identity → SupplyAsset → Capability → Discovery Exposure → **概念成立**（SupplyProduct.published），但 supplier 发现接线未臻（Challenge E）。

### Decision
- Platform-first 是否真 interaction model？**部分是**：Buyer 的 Intent 到工作闭环是 interaction；Guest/Supplier 的发现体验仍由**产品目录式 UI（Gallery/Compare）主导**，风险被产品语义拉动。
- 反证结果：**PARTIAL**（interaction 闭环成立；发现表面存在 product-first 回潮风险，需 frontend 治理）。

---

## 13. Architecture → UI Trace（Challenge I）

| Object | Route | 组件/交互 | CTA | 判定 |
|---|---|---|---|---|
| Capability | /products（能力注册表） | ProductGrid/ProductCard/Filter | Search/Compare(≤4) | **架构=Capability，UI=ProductGallery+Compare → Architecture/Experience Contradiction 风险记录** |
| Product(Capability Authority) | /products/[slug] | ProductDetail + Parameter | Demand/RFQ/Inquiry | 一致（detail 已是能力详情） |
| Supplier | /suppliers/[id] | SupplierProfile(Organization) | Contact/RFQ | 对象接线存在 |
| Specification | 参数字典（非路由） | facet/Parameter display | 过滤 | 横切一致 |
| Search | /search | SearchPageContent（聚合六组 tab） | 关键词+分类+参数 | 聚合一致 |
| Demand/Match/RFQ | /workspace/demands、/matches、/rfqs | 工作台对象 | 创建/撮合/报价 | 一致 |

### Decision
- 核心对象→路由→组件→交互 CTA 映射**基本成立**；主要不一致是 **Capability 与 Product 在 UI 上不可区分**（ProductCard/CompareBar 仍是产品语义）。
- 反证结果：**PARTIAL**（映射成立；Capability 在 UI 无独立标识 → 入选 frontend discipline，M34.4）。

---

## 14. Architecture → SEO / LLM Trace（Challenge J）

### Evidence
- `seo.tsx`：`buildProductJsonLd`（Product 语义）、`SITE_URL=next.env || https://visndt.example.com`（占位）。
- `sitemap.ts`：收录 `/products`、`/products/[id]`、`/knowledge`、`/knowledge-base`、`/solutions`、`/articles`、`/insights`、`/business`。
- **无 Capability URL / entity**：Capability=Product → **Search Engine Entity = Product**。Capability 独立语义只能经「Product 页 + Category 落地页 + 参数结构化内容」表达，**无法表达独立 Capability 实体/URL**。

### Decision
- 反证结果：**PARTIAL**。SEO/LLM 只能把能力寄生于 Product 实体（products/[slug]）+ Category landing + 参数内容；**无独立 Capability entity/URL**。这是 Capability=Product 语义角色的**结构性 SEO 限定**，不是缺陷，但须在契约中**文档化为既定边界**（Product 承担 Projet 的 SEO 语义锚），并保留 SITE_URL 配置 follow-up（留契约）。

---

## 15. Low-Operation Challenge（Challenge K）

### 运营负担估算（Administrator/Supplier/Platform）
| 主体 | 负担源 | 等级 |
|---|---|---|
| Admin | 维护 Product/Capability 语义 + Category 治理 + 参数字典 + 发布 | **中**（Category=能力粒度约束会增加经手，但沿用现有模型） |
| Admin | Capability 级典型规格策展（若启用 TYPICAL） | **中-高**（新策展负担，需在 M34 权衡） |
| Supplier | 提交 SupplyProduct + 参数值 | **低-中**（复用现有提交/审核流程） |
| Platform | 自动映射（SupplyProduct→Product）、自动撮合（DemandParameter→能力参数评分）、Audit | **低**（确定性规则，不动 AI） |
- 结论：模型**支持低运营基座**（自动撮合 + 供应商自助提交 + 现有审核流）；风险集中在 **Capability 典型规格的 Admin 策展** 与 **Category=能力粒度治理**。
- 反证结果：**PARTIAL**（低运营可达成，但 Capability 规格权威若引 Admin 手工策展会拉高负担 → 纳入修订权衡，不必第一轮）。

---

## 16. Architecture Challenge Decision Matrix

| Challenge | 750 Claim | Evidence | Result | Impact |
|---|---|---|---|---|
| A Capability=Product | 语义角色足以 Capability-led | 无独立 capability 表/API/路由；Category=能力锚；/products 文案强化 | **PARTIAL** | 需 Category=能力粒度治理约束（修订 #2） |
| B Product Semantics | = 能力权威+目录 | 字段两义混合；Compare/Gallery 存在 | **PARTIAL** | PRODUCT-CATALOG REGRESSION RISK，frontend 治理 |
| C Capability 1:N SupplyProduct | 1:N 成立；Secondary=FUTURE | DB 层 platformProductId 1:N；C1成立 | **PASS** | 不阻塞 M34.1，C2 归 FUTURE |
| D Capability Specification | 横切参数维度已可答 | 无 aggregation/typical/authority 声明 | **PARTIAL** | Chair 修订 #1：声明 Product-derived+Admin typical |
| E Supplier Discovery | Organization 维度可发现 | searchSuppliers 依赖 Offer | **PARTIAL** | 改为基于 PUBLISHED SupplyProduct（API+frontend，NO SCHEMA） |
| F Search Capability-led | 统一聚合+参数 facet | 纯关键字，无 intent 解释层 | **PARTIAL** | Category=能力入口 + 能力意图映射（M34.4） |
| G Public/Workspace | 对象引用连续性 | URL+object id+workspace 持久链完整 | **PASS** | 无 |
| H Platform Mental Model | interaction model | Buyer 闭环成立；Guest/Supplier 发现面有产品回潮 | **PARTIAL** | frontend discipline |
| I Architecture→UI | 真实用户对象 | 映射成立；Capability 与 Product UI 不可区分 | **PARTIAL** | 需独立能力标识，M34.4 |
| J Architecture→SEO/LLM | Product 承担语义锚 | SE Entity=Product；无独立 capability URL | **PARTIAL** | 文档化边界 + SITE_URL follow-up |
| K Low-Operation | 低运营 | 自动撮合+自助提交成立；Capability 策展拉高风险 | **PARTIAL** | 纳入修订权衡 |

统计：PASS = 2，PARTIAL = 9，FAIL = 0。

---

## 17. Critical Contradictions

**Critical（阻塞性）架构矛盾 = 0。**
说明：750 冻结决策内部无自相冲突——Cardinality（1:N）经 DB 验证、Category/Capability/Spec 边界一致、Public/Workspace 接线完整、确定性撮合沿用 DemandParameter。全部挑战项（A–K）为**部分成立 + 前置条件/实现差距**，均可在不触碰 Schema 的前提下，通过**契约修订（声明 authority / 约束 / 接线方向）**与 **M34.1→M34.6 实施 gate** 消化。

---

## 18. Required Amendments

本任务识别需**写入契约的修订项（Amendment，均为零 Schema / 声明 / 接线方向）**：

1. **Capability 级 Specification 权威声明（Chief）**：Capability Spec = Product-derived 原始参数 + Admin 策展的 Typical；Search/Match 沿用原始参数值（DemandParameter）。此权威在 750 未声明，须在 M34.1 前写入。
2. **Category=能力粒度治理约束**：Category 必须按**能力/检测对象粒度**治理并作为 Capability-led 入口锚；否则 Capability 退化为 naming。写入 Governance。
3. **Supplier 发现接线修正**：Supplier 搜索改为基于 **PUBLISHED SupplyProduct**（Organization 汇总），解除对 Offer 的依赖；旧 searchSuppliers(Offer) 标 legacy。API+Frontend，NO SCHEMA（M34.4/M34.6）。
4. **Search 能力意图映射前置**：M34.4 增加「能力意图 → Category」taxonomy/synonym 映射层，使 intent 可自动进入 Capability Context（NO SCHEMA）。
5. **Frontend Capability-led 纪律**：能力注册表减少 Product Gallery/Compare 语义表面，强化 Category 铁轨 + 参数 facet 为能力路径；Capability 与 Product 在 UI 上可区分（M34.4，FRONTEND ONLY）。
6. **SEO/LLM 语义锚文档化**：确认「Product 承担能力 SEO 实体」「无独立 Capability URL」为既定边界；SITE_URL 配置 follow-up。

**Required Contract Amendments = 6（0 项 Schema 变更）。**

---

## 19. M34.1 Authorization Gate

依据 §18 修订项均为**零 Schema 的声明/约束/接线方向**，且均在 M34.1 至 M34.6 实施 gate 内可消化：

- Capability 基础（M34.1）以 Product 承载 => 可行（修订 #1 为声明，#2 为治理约束）。
- 1:N / 撮合 / Public-Workspace 均验证有效（C/G PASS）。

**GATE B — VALIDATED WITH CONDITIONS**
- 核心模型成立（Capability/Product/SupplyProduct/Supplier/Spec/Search 内部无矛盾）。
- 存在有限**非阻断条件**（6 项修订：声明 authority、Category 治理、Supplier 接线、Search 意图、Frontend 纪律、SEO 边界）。
- 条件**显式进入实施 Gate（M34.1–M34.6）**，不阻止 M34.1 启动。
- **本任务不授权 M34.1 执行**；正式授权须下一条独立 TRAE 指令。

### M34.1 Authorization State：**CONDITIONAL / AUTHORIZABLE（须新独立授权）**

---

## 20. Roadmap Progress Alignment

M34 Platform Experience Reconstruction

```
746  Full Project Fact Base
████████████████████  COMPLETE
747  Data Safety Baseline
████████████████████  COMPLETE / CONDITIONAL
748  Controlled Data Cleanup
████████████████████  COMPLETE / CONDITIONAL / CLOSED
749  Platform Experience Architecture Audit
████████████████████  COMPLETE / CONDITIONAL
750  Architecture Decision Consolidation
████████████████████  COMPLETE / CONDITIONAL
751  Architecture Consistency Challenge
████████████████████  COMPLETE / CONDITIONAL   ← 本任务
M34.1 First-Round Implementation
....................  NOT STARTED
```

- **Current Position**：751（M34.0 最后的 Architecture Validation Gate）。
- **Current Gate**：GATE B — VALIDATED WITH CONDITIONS。
- **Next Gate**：M34.1 First-Round Implementation（NOT AUTHORIZED，须新授权）。
- **Implementation Started**：NO。
- **Overall M34.0 Preparation Progress**：约 55%（746→751 全部完成；契约+Gate 就绪）。
- **M34 Productization（实施）Progress**：0%（M34.1 未启动）；M34.0 Preparation 进度不得与 Productization 进度混淆。

---

## 21. Documentation Synchronization

- `docs/_architecture/M34_Platform_Architecture_Contract.md` → 状态更新为 **VALIDATED WITH CONDITIONS**，追加「751 Validation Conditions / Required Amendments」小节（保留全部历史契约，不删除）。
- `docs/project-management/PROJECT_STATUS.md` → 新增 751 条目（CONDITIONAL PASS）。
- `docs/project-management/PROJECT_ROADMAP.md` → 新增 751 条目 + M34.1 NOT AUTHORIZED。
- `docs/project-management/MODULE_COMPLETION_MATRIX.md` → 新增 751 行。

---

## 22. Final Decision

- **750 Claim**：**VALIDATED WITH CONDITIONS**。Capability=Product 模型经严格反证后**核心成立**，但凸出 6 项前置条件（尤以 **Capability 级 Specification 权威未声明**、**Category=能力粒度约束未强制**、**Supplier 发现依赖 Offer** 为著）。
- **Capability-led Discovery**：在 **Category=能力粒度 + 参数 facet** 路径下**成立**；若绕过 Category，则仍退化为 Product 关键字搜索。故 Capability-led 成立**有条件成立**，绝不等于「把 Product 改名为 Capability」。
- **M34.1**：**AUTHORIZABLE（CONDITIONAL）** —— 须本任务后由下一条独立指令正式授权，不得自动进入。
- 本任务零代码 / 零数据库 / 零存储 / 零 Schema / 零路由 / 零 UI 变更；无数据删除；M33 保持 CLOSED。

**Final Action：STOP。**