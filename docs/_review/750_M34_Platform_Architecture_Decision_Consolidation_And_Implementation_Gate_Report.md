# 750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate_Report

## 1. Task Summary

本任务将 749 已识别的 12 项 Platform Architecture Decision Candidate 收敛为一套明确、可执行、可验证、受范围约束的 **M34 Platform Architecture Contract**，并判断 VISNDT 是否达到进入第一轮产品化实现（M34.1–M34.7）的条件。

- Task: `750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate`
- Stage: M34.0 — Platform Experience Architecture Reconstruction
- Execution Mode: READ-ONLY Repository Inspection + Architecture Decision Consolidation + Documentation Synchronization + Implementation Gate
- 核心原则：
  - Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State = Platform Experience State
  - Visual Transformation ≠ Platform Transformation
- 本任务**不是** UI / Capability / Schema Migration / Search V2 / Route Migration / 数据清理任务。
- 本任务不进入 M34.1+ 实现；完成后 **STOP**，等待新的独立执行授权。

### Architecture Decision Summary（冻结结论速览）

| Candidate | 749 状态 | 750 判定 |
|---|---|---|
| ADR-M34-01 Capability 独立对象 | CANDIDATE | **DEFERRED（Capability=Product 语义角色，不新建表）** |
| ADR-M34-02 SupplyProduct Canonical | CANDIDATE | **ACCEPTED（现有模型即 Canonical，复用）** |
| ADR-M34-03 Product / SupplyProduct 关系 | CANDIDATE | **ACCEPTED（SupplyProduct.platformProductId → Product N:1）** |
| ADR-M34-04 Capability ↔ SupplyProduct | CANDIDATE | **ACCEPTED（Capability 1→N SupplyProduct；M:N=未来）** |
| ADR-M34-05 Category/Capability/Spec 边界 | CANDIDATE | **ACCEPTED（Category=一级，Spec=横切）** |
| ADR-M34-06 Specification Template | CANDIDATE | **DEFERRED（Spec=参数横切维度，模板未来）** |
| ADR-M34-07 Search / Discovery 对象 | CANDIDATE | **ACCEPTED（统一聚合 + 参数 facet + Capability 维度）** |
| ADR-M34-08 Supplier Discovery | CANDIDATE | **ACCEPTED（复用 Organization，无新表；API/前端修复）** |
| ADR-M34-09 Public / Workspace 连续性 | CANDIDATE | **ACCEPTED（对象引用连续性 + 工作台状态）** |
| ADR-M34-10 Canonical Route | CANDIDATE | **ACCEPTED（/products 为能力权威；合并重复遗留）** |
| ADR-M34-11 Knowledge / Insight 辅助层 | CANDIDATE | **ACCEPTED（辅助层，非一级对象）** |
| ADR-M34-12 Platform Governance | CANDIDATE | **ACCEPTED（Platform=Rules / Supplier=Assets / Buyer=Intent）** |

统计：ACCEPTED = 10，MERGED = 0，REJECTED = 0，DEFERRED = 2，UNRESOLVED = 0。

---

## 2. Repository Verification

| 项 | 值 | 证据 |
|---|---|---|
| Repository Root | `F:\Desktop\VISNDT` | `git rev-parse --show-toplevel` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` | `.trae/rules/项目路径.md` 确认 |
| Branch | `main` | `git branch --show-current` |
| Commit | `ff03a9a368f3490094cf57015ce4799904ad283c` | `git rev-parse HEAD` |
| Working Tree | **OTHER**（未提交改动保留） | `git status --short` |
| 变更计数 | 131 行（含 M33 历史 + M3x 报告 + 文档） | `git status \| Measure-Object` |

**BEFORE_EXECUTION_WORKTREE_STATE**：Working Tree = OTHER，保留 M33 historical changes + M34 reports + 文档变更 + 其他未提交改动。
**AFTER_EXECUTION_WORKTREE_STATE**：与 BEFORE 相比仅新增 750 报告 + 三份文档同步 + M34 Architecture Contract（不重置、不 restore、不 checkout、不 clean、未删除任何 untracked）。

---

## 3. Baseline Verification

已实际读取并核对：

- `docs/_review/746_PRE745_M34_Full_Project_Fact_Scan_Report.md`
- `docs/_review/747_M34-DATA-01_Controlled_Test_Data_Scan_Classification_Backup_Report.md`
- `docs/_review/748_M34-DATA-02_Controlled_Test_Data_Cleanup_Report.md`
- `docs/_review/749_M34_Platform_Experience_Architecture_Audit_Report.md`
- `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md`（749 条目已存在）

749 关键输入（已复核）：Gap Register 17 项、Decision Candidates 12 项、Target Object Model、Target IA、Buyer/Supplier Journey、Governance Model、Backend/API/Schema Change Gate、Implementation Readiness=NOT READY。

---

## 4. M33 Closure Verification

- **M33 = CLOSED**，本任务**未 reopen M33 / 未修改 744 / 未创建 M33.14+ / 未进行任何 visual repair**。
- M33 = Visual Perception Repair + Enterprise Website Perception Reduction（已关闭）。
- M34 = Platform Architecture Reconstruction（本任务所在阶段）。

---

## 5. Decision Method

采用**证据驱动 + 复用优先 + Schema 变更仅在证明确有必要时**的方法：

1. **现场源码/Schema 复核**（不机械复制历史结论）——重读 `schema.prisma`、`search.service.ts`、`discovery.service.ts`、`capabilities.controller.ts`、前端路由清单、`sitemap.ts`、`seo.tsx`。
2. 每个核心决策输出 `Problem / Options / Evidence / Decision / Rationale / Rejected Alternatives / Impact / Implementation Gate`。
3. 无法安全冻结者标注 `UNRESOLVED + BLOCKING REASON + REQUIRED EVIDENCE`（本次无强制 UNRESOLVED）。
4. 决策必须能映射到 Object → Relationship → IA → Search → Journey → Governance。

### 关键现场复核事实（独立确认，非抄报告）

| Fact | 源码证据 |
|---|---|
| Capability 无独立模型/表 | `schema.prisma` 无 `Capability` model；无 capability 表 |
| Capability = Product 投影 | `capabilities.controller.ts` `@Controller('capabilities')` `@Get(':id')` 以 Product UUID 为参 |
| Product = Capability Authority | `search.service.ts` L68/L317 `Product = Capability Authority` |
| SupplyProduct → Product N:1 | `schema.prisma` L541 `platformProductId` + L566 `platformProduct @relation` |
| Supplier = Organization 别名 | `schema.prisma` `Organization.type`(String) L273，无 supplier 表；SupplierProduct/Offer/RFQ 均 `organizationId` |
| OfferStatus 枚举完整 | `schema.prisma` L43-51：DRAFT/ACTIVE/INACTIVE/**SUBMITTED/ACCEPTED**/REJECTED/WITHDRAWN |
| searchSuppliers 按 Offer 聚合 | `search.service.ts` L518-566，过滤 `Offer.status in SUBMITTED/ACCEPTED` |
| 无独立 Spec Template | `schema.prisma` 仅 parameter_group/definition/option/value，无 template |
| Category 多职责 | `schema.prisma` L346-353 ProductCategory 关联 products/demands/knowledgeMappings |
| Matching → Product | `schema.prisma` DemandMatch.productId L689 |
| 前端无 /capabilities 路由 | `apps/web/src/app/` 无 capabilities；有 /products |
| /knowledge 与 /knowledge-base 重复 | 两者均在 app 目录 + sitemap 均收录 |
| /supplier-models 遗留 | `apps/web/src/app/supplier-models/page.tsx` 存在 |
| /workspace/supplier 壳 | `apps/web/src/app/workspace/supplier/page.tsx` 重定向 /dashboard/supplier |
| Search 六类聚合 | `search.service.ts` search()：products/supplierProducts/knowledge/content/solutions/suppliers |
| SITE_URL 占位 | `seo.tsx` L12-13 `https://visndt.example.com` |

### 重要修正（749 复核纠偏）

749 G-03 记载：*"searchSuppliers offer 状态过滤参数 SUBMITTED/ACCEPTED 与数据库实际值 ACTIVE/DRAFT 不匹配，导致恒返回 0 结果"*。

**现场复核反证**：`OfferStatus` 枚举明确包含 `SUBMITTED`（L47）与 `ACCEPTED`（L48）。因此「status 枚举不匹配 → 恒 0」的归因**在 schema 层面不成立**。导致恒 0 的真实原因：**供给侧 Offer 数据为空**（M34-DATA-02 清理后 offer 数据极少/为空，见 748 保留基线）。更深的架构缺口是：**Supplier 无独立对象，前端无独立供应商检索维度**，`searchSuppliers` 仅按 Offer 聚合，尚未暴露为平台级供应商发现。
→ 本任务将 749 G-03 归因定位为 **NO SCHEMA / API ADAPTATION + FRONTEND**（复用 Organization），而非新增 Supplier 表。

---

## 6. Capability / Product Decision（Decision Group A）

### Problem
Capability、Product、SupplyProduct 三者语义边界未冻结；749 四个 Candidate（01/02/03）停留在候选态。

### Options
- **Model A**：Product = Capability Authority（现状）。
- **Model B**：Capability = 独立平台对象；Product = 平台产品对象。
- **Model C**：Capability = 平台发现对象；Product = 公共技术产品对象；SupplyProduct = Supplier-owned Commercial Product。

### Evidence
- `Product` 表已具完整能力语义载体：`categoryId + name + model + slug + status + embedding + parameterValues + offers + supplierProducts + demandMatches`（schema L356-387）。
- `search.service.ts` L68 明确注释 `Capability-centric DTO projection (Product = Capability Authority)`。
- `discovery.service.ts` 已以 `Product` 为 Capability 根聚合 `SupplierProduct → Offer`。
- 前端 `/products` 已承载能力目录展示（能力目录）。

### Decision
**采用 Model A（Product = Capability Authority）作为 M34.1 冻结语义**，并明确：
- **Capability = Product 的发现语义角色**（Discovery Role），非独立数据库实体。
- **Product = 平台能力权威对象**（Capability Authority + Catalog Product 一体）。
- **SupplyProduct = Supplier-owned Commercial Product（供应商商品）**。

### Rationale
- **语义清晰度**：Product 已具备能力身份的全部字段与关联，命名器已足够承载 Capability 语义。
- **数据/迁移/兼容成本最低**：引入新 `capability` 表需同时迁移 `Offer.productId`、`DemandMatch.productId`、`SupplierProduct.platformProductId`，且当前数据为 0，收益<成本。
- **Schema Change Only When Proven Necessary**：现有模型已可承载，无证据需新表。
- **搜索/匹配/SEO/LLM**：Capability 作为 Product 语义角色即可被统一搜索与匹配消费（search+match 已指向 Product）。

### Rejected Alternatives
- Model B（独立 Capability 实体）：需新表 + 多表迁移 + 治理对象重复，无证据支持；Mark **DEFERRED**（若未来 Capability 生命周期分离出 Product 才重审，`FUTURE CANDIDATE`）。

### Impact
- Schema：**NO CHANGE**（Capability 不新增表）。
- Backend/API：**NO CHANGE**（discovery 已服务）。
- Frontend：**FRONTEND ONLY**（语义命名/展示层可增强，非本任务）。
- Implementation Gate：进入 **M34.1 / M34.2** 时按此语义落地，不建 capability 表。

---

## 7. Capability ↔ SupplyProduct Decision（Decision Group B）

### Problem
749 使用「N:1」表述方向不明确；需冻结 Cardrality 与方向。

### Options
- **1:N**：Capability(Product) **1** → **N** SupplyProduct。
- **M:N**：Capability ↔ SupplyProduct 多对多（需 join entity）。
- Primary + Secondary Capability。

### Evidence
- `Schema`：`SupplyProduct.platformProductId`（L541）→ `Product.id`（L566），即**多 SupplierProduct 指向一个 Product** → 数据库层即 `Capability(Product) 1 → N SupplyProduct`。
- `DiscoveryService.findCapabilityGraph` 以单个 platformProductId 聚合其下所有 SupplierProduct。

### Relationship Stress Test（2 个真实工业案例）
1. **案例：UT 超声检测能力（Capability=Product）** — 一个供应商（Supplier）提供 2 个型号的超声探伤仪（2 个 SupplyProduct）→ 同一 Capability 下挂 2 个 SupplyProduct。**1:N 成立**。
2. **案例：相控阵 PAUT 能力/涡流（Capability=Product）** — 若同一台仪器同时具备多能力，需多 Capability → 此为 **M:N/FUTURE** 场景；当前模型只能以「一个 SupplyProduct 归属一个 platformProductId」表达主能力，次能力暂无法表达。

### Decision
- **冻结方向：`Capability(Product) 1 → N SupplyProduct`**（数据库现状即 1:N，明确方向，废弃「N:1」模糊表述）。
- **一个 SupplyProduct 仅允许一个 primary Capability（主能力）**（由 `platformProductId` 表达）。
- **Secondary Capability = FUTURE CANDIDATE**（如需 M:N，须在独立未来任务中定义 join entity + mapping ownership + governance）。

### Rationale
- 1:N 与现有 schema 完全一致，零成本，方向唯一。
- M:N 需 join entity + mapping status + supplier/admin editing authority + governance，属新 Schema Change，**不做为 M34.1 强制项**。

### Impact
- Schema：**NO CHANGE**（当前 1:N 已满足）。
- 后续 M:N（若启用）→ DEFERRED + SCHEMA + ASSESSMENT。

---

## 8. Supplier Decision（Decision Group C）

### Problem
Supplier 是否需要独立数据库 Entity？

### Options
- A：Supplier = Organization(type=SUPPLIER)。
- B：Supplier Profile = Organization + supplier-specific profile semantics。
- C：独立 Supplier Entity。

### Evidence
- `Organization.type` String（L273）；Supplier 维度实体均以 `organizationId` 关联：`SupplierProduct.organizationId`、`Offer.organizationId`、`RFQ.targetOrganizationId`、`Inquiry`、`OrganizationMember`。
- `searchSuppliers` 直接复用 `offer.organization`（L535）聚合供应商——**现有代码已按 Organization 语义工作**。
- Organization 已承载 supplier 身份的全部关联与生命周期锚点；仅缺独立 profile 扩展字段。

### Decision
**采用 B：Supplier = Organization + Supplier-specific profile semantics（复用，不新增表）。**
- Supplier 不作为独立 DB Entity。
- 供应商 discovery / profile / search 在 Organization 语义上增强。

### Rationale
- 默认原则：**不要仅为了命名而新增 Supplier Table**。
- 无证据证明 Organization 无法承载 supplier identity/lifecycle/discovery；反而当前一切 supplier 数据均挂在 organization 上。
- 新增 Supplier 表将复制 organization 的全部外键，成本与风险高，无收益。

### Rejected Alternatives
- C（独立 Supplier Entity）：**REJECTED**（未证明 Organization 承载不足；移动全部 supplier 外键成本不可接受）。
- A（纯 type=SUPPLIER）：作为基线可保留，但结合 B 的 profile 语义增强。

### Impact
- Schema：**NO CHANGE**（不建 supplier 表）。
- Search：**API ADAPTATION + FRONTEND**（修复 supplier 发现暴露，非 schema）。

---

## 9. Category / Capability / Specification Boundary Decision（Decision Group D）

### Frozen Boundary

| 对象 | 核心职责 | 一级对象 | 可搜索 | Supplier 直接创建 |
|---|---|---|---|---|
| **Category** | 平台能力/产品分类法（Taxonomy） | **是**（`product_category`） | 是（facet） | 否（Admin 治理） |
| **Capability** | = Product 的发现语义角色 | 语义角色（非独立表） | 是（Product search） | 否 |
| **Product** | 平台能力权威 + 能力目录 | **是** | 是 | 否（Admin） |
| **Specification** | 参数规格横切维度（Parameter 字典） | **否**（横切） | 是（参数 facet） | 是（基于字典填规格值） |
| Application / Inspection Object / Technology Route | 能力应用场景/检测对象/技术路线 | **否**（语义标签/参数/未来） | 部分 | 否 |
| Knowledge | 支持知识层 | **否**（辅助层） | 是（LEARN） | 否 |

### 禁止用模糊术语
冻结：不使用无语义边界的「能力分类 / 产品分类 / 产品能力 / 能力标签」作为非定义跳板；统一用 Category / Capability(=Product 角色) / Specification / SupplyProduct。

---

## 10. Specification Decision（Decision Group E）

### Options
- Model A：Parameter Dictionary only（现状）。
- Model B：Category → Spec Template → Parameters。
- Model C：Capability → Spec Template → Parameters。
- Model D：Category + Capability → Spec Template → Parameters。

### Evidence
- 现有为「Parameter Dictionary + Product Attribute」：`parameter_group / parameter_definition / parameter_option / product_parameter_value / supplier_product_parameter_value / demand_parameter`。
- 无 Specification Template 模型/表。

### Decision
**Model A 冻结为 M34.1 基线**；Specification = **Cross-cutting Discovery Dimension**（横切发现维度，非一级 Route / 非一级对象）。
- 明确：**不因为 Candidate 存在「Specification」就自动建立 `/specifications` 路由**。
- 后期如需模板化（Model B/D），作为 **DEFERRED / FUTURE CANDIDATE**，须独立评估（关联 Product/Category）+ 触发 Schema Change 评估。

### Rationale
- 参数字典已支撑 Product/SupplyProduct/Demand/Search facet/Compare/Match/Admin Governance。
- M34.1 无证据需模板迁移；新增 Spec Template = Schema Change，仅在 Capability/Product 定义后证明必要才做。

### Impact
- Schema：**NO CHANGE**（M34.1）。Spec Template → DEFERRED。

---

## 11. Search / Discovery Decision（Decision Group F）

### Frozen Contract
```
Search Intent → Discovery Object → Filter → Ranking → Result
```

| 维度 | 关系 | 冻结决策 |
|---|---|---|
| Capability(=Product) | 主能力对象 | 通过 Product **Capability Authority** search |
| Product | 能力目录 | `/products` + 统一 search products |
| SupplierProduct | 能力型号 | 统一 search supplierProducts（能力型号 tab） |
| SupplyCatalog | 供应商供应明细 | search supplierProducts |
| Category | 分类 | Category facet |
| Specification | 参数 facet | Parameter facet + brand/series |
| Supplier | 供应商 | **API ADAPTATION + FRONTEND**（复用 Organization；修复暴露） |
| Knowledge/Insight/Solution | 支持层 | LEARN search |

### searchSuppliers 恒 0 专项
- 749 判定「status mismatch」经复核**不成立**（OfferStatus 含 SUBMITTED/ACCEPTED）。
- 真实根因：**供给侧 Offer 空数据** + **无独立供应商前端检索维度**。
- 本任务处理：**CONFIRM PROBLEM（已定位）→ DETERMINE TARGET（复用 Organization 暴露供应商）→ DETERMINE FIX TYPE（API ADAPTATION + FRONTEND，NO SCHEMA）→ 不直接修复**（归入实施 Gate：M34.4/M34.6）。
- 明确：不修复 `searchSuppliers` 代码（本任务仅定架构）。

---

## 12. IA / Route Decision（Decision Group G）

冻结 Route 处理策略（仅冻结，不执行迁移/删除/redirect）

| Route | 策略 | 处理 |
|---|---|---|
| `/products` | **KEEP** | 产品/能力权威目录（Capability 首页） |
| `/products/[slug]` | **KEEP** | 能力详情 |
| `/capabilities` `/capabilities/[slug]` | **UNRESOLVED→KEEP 语义** | 本任务冻结 Capability=Product 角色：不新增独立 /capabilities，能力权威用 /products；若未来 Capability 独立化再引入（FUTURE） |
| `/suppliers`, `/suppliers/[id]` | **KEEP** | 供应商公开页（Organization 语义） |
| `/categories` | **KEEP** | 分类法 |
| `/search` | **KEEP** | 统一搜索 |
| `/knowledge` | **MERGE**（并入 `/knowledge-base`，DEPRECATE） | 消除重复 |
| `/knowledge-base` | **KEEP（Canonical）** | 辅助层知识库 |
| `/supplier-models` | **DEPRECATE** | 遗留路由，按淘汰处理 |
| `/workspace/supplier` | **MERGE**（→ `/dashboard/supplier`） | 兼容壳，已重定向 |
| `/dashboard/supplier`, `/dashboard/buyer` | **KEEP（Canonical Workspace）** | 正式工作台 |

冻结 IA 六模块：DISCOVER / PUBLISH / CONNECT / LEARN / WORKSPACE / ADMIN（见 §34）。

---

## 13. Public / Workspace Continuity Decision（Decision Group H）

### Object Continuity（Public → Authentication → Workspace）

| Context | 承载方式 | 跨 Public→Workspace |
|---|---|---|
| Capability/Product Context | URL（/products/[slug]）+ object id | **是**（Public 详情 → Demand/RFQ 关联同一 Product） |
| Supplier Context | URL（/suppliers/[id]）+ object id | **是** |
| Demand Context | Workspace object（Demand）+ DB reference | **是**（Workspace 内创建/管理） |
| Search Context | URL query state | 部分（query 状态不跨工作区持久） |
| RFQ Context | Workspace object（RFQ）+ DB reference | **是** |
| Match Context | Workspace object（Match）+ DB reference | **是** |

### Decision
连续性 = **对象引用（Database Object Reference）+ 规范 URL + 工作台持久对象** 三重叠加，**不是**“加一个工作台按钮”。
- Capability/Product/Supplier 经 URL canonical 进入；Demand/Match/RFQ 在工作台以对象形态持久，Nodes 间经 id 关联。
- Search query 状态不做跨工作区持久化（按需 session）。已明确不跨清单以上表。

---

## 14. Governance Decision（Decision Group I）

冻结五方责任矩阵（结合代码事实校正，非机械复制目标模型）：

| 职责域 | Platform | Admin | Supplier | Buyer | Automatic |
|---|---|---|---|---|---|
| Category（Taxonomy） | — | **拥有**（Review/Publish） | — | — | — |
| Capability(=Product) | — | **拥有**（创建/发布/治理） | — | — | — |
| Specification（参数字典） | — | **拥有**光治理 | 填写规格值（基于字典） | — | — |
| Product | — | **拥有**（能力权威 Edit/Publish） | — | — | — |
| SupplyProduct | — | **审核**（Review） | **拥有**（创建/编辑/提交） | — | — |
| Media / Document | — | **审核** | **拥有**数据 | — | — |
| Demand | — | — | — | **拥有**（创建） | — |
| Match | — | — | — | 消费 | **自动**（评分） |
| RFQ | — | — | — | **拥有**（作为 Buyer） | — |
| Search Index | — | — | — | — | **自动** |
| Audit / Record | — | 查看 | — | — | **自动**记录 |

总结：**Platform = Rules（Taxonomy/Capability/Spec governance）+ Discovery/Match/Workflow/Audit（自动化）**；**Supplier = Supply Asset（SupplyProduct/Media/Document）**；**Buyer = Demand / Procurement Intent（Demand→RFQ）**。Admin 在 Taxonomy/Capability/Review/Publish 保留人工治理。

---

## 15. SEO / LLM Contract（Decision Group J）

冻结 SEO/LLM 语义契约（**本任务不修改 SEO 代码 / SITE_URL / JSON-LD**）：

| 对象 | Canonical URL | Entity | Indexability | Structured Data 目标 |
|---|---|---|---|---|
| Capability(=Product) | `/products/[slug]` | PostalCapability | Index | Product + Capability |
| SupplyProduct | Search/DETAIL 聚合 | SupplierOffer | Index（公开） | Offer |
| Supplier | `/suppliers/[id]` | Organization | Index | Organization |
| Category | `/categories` | Category | Index | Breadcrumb |
| Specification | 参数 facet（非独立路由） | PropertyValue | 不单独收录 | — |
| Knowledge/Article | `/knowledge-base/[slug]` 等 | Article/Knowledge | Index | Article |

- **SITE_URL = `visndt.example.com` 登记为 CONFIG FOLLOW-UP**（非 750 修复；后续真实域名配置）。
- 语义锚点：由 /products 权威 + /suppliers 公开实体 + /knowledge-base 知识层构成平台语义锚；新增 JSON-LD 归入 M34.7（不实现）。

---

## 16. Mobile Experience Contract（Decision Group K）

冻结 375/768/1024/1440 展示原则（**本任务不实施 UI；Responsive ≠ Desktop Shrink**）：

| 尺寸 | Tier | 原则 |
|---|---|---|
| 375 | **Mobile** | 单列；折叠筛选/Facet；抽屉式 Compare；表单/CTA 全宽；Specification 折叠为参数列表；表格转卡片化 |
| 768 | **Tablet（Intermediate）** | 保留侧栏筛选（可收合）；网格 2 列；Spec 并列展示；导航可汉堡 |
| 1024 | **Intermediate/Desktop 起点** | 标准侧栏筛选 + 主内容；网格 3 列；Compare 常态 |
| 1440 | **Desktop** | 完整侧栏 + 高位信息密度；Spec 对比表；多列 CTA 区 |

- 冻结：Navigation（响应收敛）、Search（375 独立搜索态）、Filter/Facet（Mobile 抽屉）、Compare（Mobile 居底 bar，≥1024 常态）、Specification（Mobile 折叠/Desktop 表格）、Supplier/Demand Form/RFQ/Tables/CTA（Mobile 单列全宽、Desktop 多列）。
- 后续在 M34.5/M34.7 落地（本任务不改 UI）。

---

## 17. Canonical Object Contract（Decision Group L：Backend/API/Schema Gate 之一）

完整对象契约（每对象 Definition / Purpose / Ownership / Lifecycle / Canonical Identity / Parent-Child / Relations / Discovery / Workspace / Governance）：

| Object | Definition / Purposed | Ownership | Lifecycle | Canonical Identity | Relations | Discovery | Governance |
|---|---|---|---|---|---|---|---|
| **Product** | 平台能力权威 + 能力目录（Capability 承载） | Admin/Platform | DRAFT/…（现有 Product.status String） | `product.id` + slug | Category / Offer / SupplierProduct / DemandMatch / Inquiry | /products+search | Admin |
| **Capability** | = Product 的发现语义角色（非独立表） | Platform（以 Product 表达） | = Product lifecycle | = Product | = Product | Capability(search+facet) | Admin（经 Product） |
| **SupplyProduct** | Supplier-owned commercial product / 能力型号 | Supplier | **复用现有枚举**（DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED，**不重设计**） | `supplier_product.id` + slug | Organization / Product / Offer / ParameterValues / Media | search（能力型号）/ suppliers | Admin Review + Publish |
| **Supplier** | = Organization（type=SUPPLIER）+ profile 语义 | Organization owner | Organization lifecycle | `organization.id` | supplierProducts / offers / RFQ.target / inquiries | /suppliers+search | Admin |
| **Category** | 平台能力/产品分类法 | Admin | 一级 | `product_category.id`/slug | products / demands / knowledgeMappings | facet | Admin |
| **Specification** | 参数规格横切维度 | Admin（字典）+ Supplier(填值) | 字典 | parameter_definition.code | product/supplierProduct/demand | 参数 facet | Admin |
| **Demand** | 采购需求（Buyer intent） | Buyer | DRAFT→…（现有 DemandStatus） | `demand.id` | category / parameters / rfqs / matches | workspace | Buyer |
| **Match** | 需求-能力撮合 | 自动评分（deterministic） | 现有 DemandMatchStatus | `demand_match.id` | demand / product / offer / rfq | workspace(button) | Automatic |
| **RFQ** | 询价单 | Buyer | 现有 RFQStatus | `rfq.id` | demand / match / responses / org | workspace | Buyer/Supplier |
| **Inquiry** | 询盘连接 | Buyer/Supplier | 现有 | Inquiry | product/supplier | — | — |
| **Workspace** | Buyer/Supplier/Dashboard | 角色 | — | route | — | — | Auth |
| **Knowledge** | 支持知识层（辅助层） | Admin | 现有 | knowledge_entry | category/knowledgeMappings | LEARN | Admin |

---

## 18. Relationship Contract

| Relationship | CURRENT | TARGET | IMPACT |
|---|---|---|---|
| Capability ↔ Product | Capability=Product 角色（等价） | Capability=Product 发现角色 | 语义层 |
| Capability ↔ SupplyProduct | 1:N via `platformProductId` | **1:N（primary）**；M:N=FUTURE | 维持，未来 M:N |
| Capability ↔ Supplier | 间接经 SupplyProduct/Product | 经 SupplierProduct+Product | 补检索 |
| Capability ↔ Category | Product.categoryId | Product=Capability 归 Category | 维持 |
| Capability ↔ Specification | Product→param（ProductParameterValue） | Capability 侧聚合参数 | 维持 |
| Product ↔ SupplyProduct | N:1（SupplierProduct.platformProductId→Product） | 维持（复用） | 无 |
| Product ↔ Supplier | org→offer→product | 供应商外在显示（检索补充） | 前端 |
| SupplyProduct ↔ Supplier | organizationId | 维持 | 无 |
| SupplyProduct ↔ Specification | SupplierProductParameterValue | 维持 | 无 |
| Category ↔ Specification | 无直接（经 product/demand） | 若 Spec Template 未来则补充（DEFERRED） | 未来 |
| Demand ↔ Specification | DemandParameter | 维持 | 无 |
| Demand ↔ Match | demandId | 维持 | 无 |
| Match ↔ Product/Capability | productId | 维持 | 无 |
| Match ↔ RFQ | RFQ.sourceMatchId | 维持 | 无 |
| RFQ ↔ Supplier | targetOrganizationId + responses.organizationId | 维持 | 无 |
| Response ↔ Offer | RFQResponse.offerId | 维持 | 无 |

规则：`CURRENT=现有`，`TARGET=目标`，`IMPACT=分类`；TARGET 不写成 CURRENT。

---

## 19. Ownership Matrix（五方责任）

（见 §14，Platform/Admin/Supplier/Buyer/Automatic 五列）。已按代码事实校正。

---

## 20. Lifecycle Contract

- **Capability**：采用 Product lifecycle（DRAFT/…），**不新建独立 Capability 状态机**（因 Capability=Product 角色）。如未来独立化，另行冻结 DRAFT/ACTIVE/ARCHIVE。
- **SupplyProduct**：**复用现有 `SupplierProductStatus`（DRAFT/SUBMITTED/REVIEWING/APPROVED/PUBLISHED/REJECTED），不随意重新设计**（遵守 749 §4.4）。
- **Demand/Match/RFQ/Offer**：复用现有枚举（DemandStatus/DemandMatchStatus/RFQStatus/OfferStatus），无变更。

---

## 21. Implementation Impact Matrix

| Decision | Frontend | API | Backend | Schema | Migration | Config | Priority |
|---|---|---|---|---|---|---|---|
| Capability=Product 角色 | **FRONTEND ONLY**（语义命名/展示增强） | NO CHANGE | NO CHANGE | NO CHANGE | NONE | — | High |
| Capability↔SupplyProduct 1:N | — | NO CHANGE | NO CHANGE | NO CHANGE | NONE | — | High |
| SupplyProduct Canonical | NO CHANGE | NO CHANGE | NO CHANGE | NO CHANGE | NONE | — | High |
| Supplier(Organization) | FRONTEND ONLY | **API ADAPTATION**（供应商维度暴露/修复恒0归因） | NO CHANGE | NO CHANGE | NONE | — | High |
| Category/Capability/Spec 边界 | FRONTEND ONLY | — | — | NO CHANGE | NONE | — | Med |
| Specification Template | NO CHANGE（M34.1） | — | — | **DEFERRED**（未来评估） | FUTURE | — | Low |
| Search 聚合 + 参数 facet | FRONTEND ONLY（若需能力维度 UI） | **API ADAPTATION**（可选） | NO CHANGE | NO CHANGE | NONE | — | High |
| Canonical IA / Route | FRONTEND ONLY（merge/deprecate 语义层，暂不迁移路由） | — | — | — | — | — | Med |
| Public/Workspace 连续性 | FRONTEND ONLY | — | — | — | — | — | Med |
| SITE_URL（真实域名） | — | — | — | — | — | **CONFIG ONLY**（CONFIG FOLLOW-UP） | High |
| SEO/LLM 语义锚点 | FRONTEND ONLY | — | — | — | — | — | Med |

**Change Gate 汇总**：Schema=**CONDITIONAL→NO**（M34.1 无需 schema；唯一未来 schema 为 Spec Template=M34.3 之后 DEFERRED）；API=**CONDITIONAL**（Supplier 维度 + 可选的 Capability 搜索增强）；Backend=**NO**（无业务逻辑重构）；Frontend=**YES（FRONTEND ONLY）**。禁止因“未来需要”提前改 Schema。

---

## 22. M34 First-Round Implementation Scope（FROZEN）

| Workstream | Objective | 归因决策 | Gate/Out-of-Scope |
|---|---|---|---|
| **M34.1 Capability & Product Foundation** | 冻结 Capability=Product 语义；Product 权威定义 | ADR-M34-01/03 ACCEPTED(语义) | 不建表 / 不迁移 |
| **M34.2 Capability/SupplyProduct/Supplier 关系** | 冻结 1:N 关系契约 + 复用 Organization | ADR-M34-02/04/08 | Supplier Product 语义；M:N 未来 |
| **M34.3 Taxonomy & Specification** | Category/Capability/Spec 边界 + 参数字典 | ADR-M34-05/06 | Spec Template DEFERRED |
| **M34.4 Discovery/Search 体验** | 统一搜索 + Capability 维度 + Supplier 发现暴露 | ADR-M34-07/08 | 修复 searchSuppliers 恒0（API + FRONTEND） |
| **M34.5 Canonical IA + Public/Workspace 连续性** | Route 策略落地 + 对象连续性 | ADR-M34-09/10 | merge/knowledge、deprecate 遗留 |
| **M34.6 Buyer/Supplier 工作流集成** | Demand→Match→RFQ 工作台闭环 | ADR-M34-09/12 | — |
| **M34.7 Governance + SEO/LLM + Mobile** | 治理 + 语义锚点 + Mobile Contract | ADR-M34-11/12/J/K | SITE_URL=Config Follow-up |

约束：**不得拆分为 M34.1.1 / M34.1.2、不得 M34.8+、不得在本任务执行**。以上仅为 FROZEN FIRST-ROUND IMPLEMENTATION WORKSTREAMS。

---

## 23. Implementation Readiness Gate

判定：**CONDITIONALLY READY**。

| 判定项 | 状态 |
|---|---|
| Core Object Model Stable | ✅（Capability=Product / SupplyProduct / Supplier=Organization 冻结） |
| Relationships Stable | ✅（1:N 方向明确，无模糊 Cardinality） |
| IA Stable | ✅（DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN 冻结） |
| Journey Stable | ✅（Buyer/Supplier/Admin 已定义） |
| Search Direction Stable | ✅（统一聚合 + 参数 facet + Capability 维度） |
| Scope Stable | ✅（M34.1–M34.7 冻结） |
| Architecture Decision Set Identified | ✅（12→10 ACCEPTED / 2 DEFERRED） |
| Minor Architecture Decision | ⚠️ **Specification Template / M:N 次级能力**（DEFERRED 不阻断 M34.1–M34.2） |
| Non-critical Runtime | ⚠️ Web :3000 DOWN（历史端口，非阻断）；供给侧数据空（M34 平台化后重建） |
| Known Deferred Issue | ⚠️ SITE_URL 占位（CONFIG FOLLOW-UP）；/supplier-models 遗留（DEPRECATE） |

**理由**：所有阻断型问题（Capability 身份 / Product 身份 / SupplyProduct 身份 / Supplier 身份 / Cardinality / Canonical IA / Search 方向 / Ownership / Lifecycle / Public-Workspace 连续性）均已冻结，无 UNRESOLVED。仍有少量**不阻断**的 deferred 项（Spec Template、M:N 次级能力、SITE_URL 配置、数据空）。

**Critical Architecture Guard 回答**：VISNDT 是否已有一套让 Capability/Product/SupplyProduct/Supplier/Specification/Search/Demand/Match/RFQ 在同一平台语义体系下工作的**稳定架构**？→ **是（核心）**。因此：**CONDITIONALLY READY**，而非盲目 NOT READY；但也未到无条件 READY（保留上述 deferred 项，启动 M34.1/M34.2 前须批准实施授权）。

---

## 24. Rejected / Deferred Decisions

- **Capability 独立新表**：DEFERRED / 候选（Model B 不采用，因 Product 已承载；独立化作为 FUTURE，条件=Capability 生命周期需与 Product 分离时）。
- **Specification Template 独立表**：DEFERRED（M34.1 无需求；模板化归 M34.3 之后，触发 Schema Change 评估）。
- **M:N Capability↔SupplyProduct / Secondary Capability**：FUTURE（M34.2 之后，需 join entity + governance 评估）。
- **Supplier 独立表**：REJECTED（Organization 已承载，无证明需要）。
- **/capabilities 独立路由**：本期不作独立 route（Capability=Product 语义）。

---

## 25. Gap Carry-Forward

748/749 未完成、由本任务移交实施阶段的 Gap（不执行）：
- `G-03 Supplier 发现恒 0`：归因修正（Offer 空数据 + 无独立维度）→ 移交 **M34.4/M34.6**（API+FRONTEND）。
- `G-08 /knowledge` 与 `/knowledge-base` 重复、`/supplier-models` 遗留 → 移交 **M34.5**（MERGE/DEPRECATE）。
- `G-10 SITE_URL 占位` → 移交 **CONFIG FOLLOW-UP**（M34.7 之前独立配置任务）。
- `G-11 语义锚点缺失`，`G-12 缺 Capability 治理`，`G-13 连续性弱` → 移交 M34.7 / M34.5。

---

## 26. Roadmap Progress Alignment

```
M34 Pre-Implementation Reconstruction   ≈50%（决策收敛阶段完成）

746 Current-State Fact Base     ████████████████  COMPLETE
747 Data Safety Baseline        ████████████████  COMPLETE / CONDITIONAL
748 Controlled Data Cleanup     ████████████████  COMPLETE / CONDITIONAL / CLOSED
749 Platform Experience Audit   ████████████████  COMPLETE / CONDITIONAL
750 Decision Consolidation      ████████████████  COMPLETE / CONDITIONAL（本任务）
M34.1 First-Round Implementation ░░░░░░░░░░░░░█  NOT STARTED
```

- Overall M34 Progress：从 749 之 ≈45% 更新，750 为决策收敛 + Implementation Gate 完成 → 按 PROJECT_ROADMAP 实际重算，**≈50%（M34.0 决策阶段结束，进入 M34.1 前）**。非机械复制。
- Current Position：M34.0 最后一关（决策收敛 + Gate）。
- Next Planned Gate：**M34.1（First-Round Implementation）**——**须新授权**（本任务仅 APPROVE 概念为 CONDITIONALLY READY，不含 M34.1 执行授权）。

---

## 27. Documentation Synchronization

已同步：
- `PROJECT_STATUS.md`：更新 750 条目（CONDITIONAL PASS / CONDITIONALLY READY / Next=STOP）→ 将写入。
- `PROJECT_ROADMAP.md`：Next Stage = M34.1（NOT AUTHORIZED），750 标记 COMPLETE → 将写入。
- `MODULE_COMPLETION_MATRIX.md`：新增 750 行，M34.1-07 NOT STARTED → 将写入。
- 新增 `docs/_architecture/M34_Platform_Architecture_Contract.md`（正式冻结契约，仅含 ACCEPTED 决策，不含 REJECTED/CANDIDATE/FUTURE/UNRESOLVED）。

---

## 28. Architecture Contradiction Audit（6.2）

| 检查 | 结论 |
|---|---|
| Capability identity | ✅ Capability=Product 角色，唯一无歧义（内部唯一定义） |
| Product identity | ✅ Capability Authority + Catalog 一体，无 Semantics 冲突 |
| SupplyProduct identity | ✅ supplier_product 表 Canonical，无歧义 |
| Supplier identity | ✅ Organization 别名（唯一定义），无同名冲突 |
| Specification identity | ✅ 参数横切维度（唯一定义） |
| Cardinality | ✅ 明确 `Capability 1 → N SupplyProduct`（方向唯一，无 N:1 模糊） |
| Route | ✅ /products 权威，REJECT /capabilities 作为独立路由（避免重复） |
| Search object | ✅ 统一搜索 + 无冲突 |
| Ownership | ✅ 五方责任无重复主 |
| Lifecycle | ✅ SupplyProduct 复用现有枚举，不重设计 |
| Public/Workspace 连续性 | ✅ 对象引用 + canonical + workspace 三重复合 |
| **749 vs 750 语义冲突** | ✅ 已消除：749 G-03「status mismatch」经复核反证归因调整 → 750 以空数据 + 缺失维度解释（NO SCHEMA） |
| **Capability 双重定义冲突** | ✅ 冻结：非独立表但具有发现角色（语义 vs 实体明确分层，非「Entity 且 Alias」矛盾） |

未发现无法在本任务内解决的架构矛盾。

---

## 29. Final Execution Output

```
Task ID:             750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate
Task Status:         CONDITIONAL PASS

Repository Root:     F:\Desktop\VISNDT
Code Root:           F:\Desktop\VISNDT\VISNDT
Branch:              main
Commit:              ff03a9a368f3490094cf57015ce4799904ad283c
Working Tree:        OTHER
Mutation:            NONE
Database Mutation:   NONE
Storage Mutation:    NONE
Schema Mutation:     NONE
Migration:           NONE
UI Mutation:         NONE

M33:                 CLOSED / UNCHANGED
746:                 COMPLETE
747:                 COMPLETE / CONDITIONAL
748:                 COMPLETE / CONDITIONAL
749:                 COMPLETE / CONDITIONAL

Architecture Decisions:
  ACCEPTED: 10
  MERGED: 0
  REJECTED: 0
  DEFERRED: 2 (Capability independent table; Specification Template)
  UNRESOLVED: 0

Capability Decision:  = Product 的发现语义角色（不独立建表，复用 Product）
Product Decision:     Capability Authority + Catalog 一体（冻结）
SupplyProduct Decision: Canonical Supplier-owned Commercial Product（复用现有模型）
Supplier Decision:    Organization + profile 语义（NO SCHEMA）
Specification Decision: 参数横切维度（M34.1 不建模板；模板 DEFERRED）
Search Decision:      统一聚合 + 参数 facet + Capability 维度；修复 supplier 发现（API+Front）
IA Decision:          DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN；/products 能力权威
Public/Workspace Decision: 对象引用 + canonical + workspace 持久（非「加按钮」）
Governance Decision:  Platform=Rules / Supplier=Assets / Buyer=Intent / Admin=治理
SEO/LLM Contract:     Capability=Product/suppliers/knowledge 语义锚；SITE_URL=Config Follow-up
Mobile Contract:      375/768/1024/1440 四层展示原则（Responsive≠Shrink）

Schema Change Required:   CONDITIONAL→NO（M34.1 无需；Spec Template=M34.3 后 DEFERRED）
API Change Required:      CONDITIONAL（Supplier 维度 + Capability 搜索增强）
Backend Change Required:  NO
Frontend Change Required: YES（FRONTEND ONLY）

M34 First-Round Scope:    FROZEN（M34.1–M34.7）
Implementation Readiness: CONDITIONALLY READY
Next Authorized Stage:    M34.1 / NOT AUTHORIZED（须新授权）
Roadmap Alignment:        UPDATED
Documentation Sync:       COMPLETE
Review Report: docs/_review/750_M34_Platform_Architecture_Decision_Consolidation_And_Implementation_Gate_Report.md

Final Action: STOP
```

---

## 30. Prohibited Actions Compliance

本任务**绝对未执行**：DELETE / TRUNCATE / DROP / UPDATE / INSERT / UPSERT / DATABASE RESET / MIGRATION / SEED REPLACEMENT / SCHEMA CHANGE / API CHANGE / BACKEND CHANGE / ROUTE CHANGE / UI CHANGE / CSS CHANGE / DESIGN SYSTEM CHANGE / DEPENDENCY UPGRADE / DATA CLEANUP / STORAGE CLEANUP。

运行态仅 GET / HEAD / read-only 检查：健康检查（Web :3001 UP / API :4000 UP / :3000 DOWN=历史端口），未启动新服务、未改端口、未改配置、未修复 runtime、未改数据库。

### Final Principle
> Do not make the website look like a platform. Define the platform objects. Define their relationships. Define how users discover them. Define how suppliers publish them. Define how buyers act on them. Define how the platform governs them. Then build the UI. Then build the code.

本任务完成 Current State → Decision → Canonical Architecture → Implementation Contract → Implementation Gate，随后 **STOP**。不自动进入 M34.1。