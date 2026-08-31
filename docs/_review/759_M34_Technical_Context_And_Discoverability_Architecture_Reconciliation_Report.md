# 759 M34 Technical Context + Discoverability Architecture Reconciliation Report

> Task ID: `759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation`
> Final Status: **CONDITIONAL PASS**
> Change Surface: **Production Code = NONE（纯架构审计 + 语义契约 + 文档同步）**
> Date: 2026-08-31

---

## 1. Repository / Branch / Commit / Working Tree

| Item | Value |
|---|---|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| Commit | `ff03a9a` |
| Working Tree | OTHER（既有改动来自 prior tasks M31/M33/M34.1-M34.5/757/758 及 759 文档同步；759 **不再改生产代码**） |
| M33 | CLOSED（未重开） |
| 历史报告 | 746–758 **PRESERVED（未修改）** |

> 说明：工作树中的 `search.service.ts`、`PublicHeader.tsx`、web/admin 前端文件等改动均为 prior tasks（755/757/758）已声明的变更，非 759 引入。759 本身 **Change Attribution = Production Code = NONE**。

---

## 2. 759 Change Attribution

| Domain | 759 变更 |
|---|---|
| Production Code | **NONE** |
| Schema | **NO CHANGE** |
| Migration | **NONE** |
| Database Mutation | **NONE** |
| Storage Mutation | **NONE** |
| Test Data Creation | **NONE** |
| AI Runtime | **NONE** |
| Vector / RAG / Embedding / Semantic / Search Index / Intent | **NONE** |
| Matching | **NO CHANGE** |
| RFQ | **NO CHANGE** |
| Global UI / Header / Homepage Rewrite | **NONE** |
| New Domain Authority / Table | **NONE** |

759 为**纯架构审计 + 语义契约建立 + 文档同步**任务，不落地任何生产代码或数据变更。

---

## 3. Existing Technical Context Inventory

基于既有模型、路由、API、文档盘点，现有 Technical Context 相关对象如下：

| 对象 | 现状载体 | 说明 |
|---|---|---|
| Insight | Content.type 体系（现有 publication domains 的衍生） | 无独立领域表；由 Content 内容体系承载 |
| Knowledge | KnowledgeEntry / KnowledgeCategory / KnowledgeDomain / ProductCategoryKnowledgeMapping（PCKM） | CONTENT type=KNOWLEDGE 已废止路线；KnowledgeEntry 为正式载体 |
| Solution | Content type=SOLUTION（`/solutions`）+ Product 应用场景 | 现有展示层 |
| Application | 数据中无独立实体 | **FUTURE Candidate** |
| Detection Object | 数据中无独立实体 | **FUTURE Candidate** |
| Standard | 数据中无独立实体 | **FUTURE Candidate** |
| Document | FileAsset / FileEntityType 可承载 | 展示层挂载；**FUTURE（一级对象）** |
| Certification | 数据中无独立实体 | **FUTURE Candidate** |
| Evidence | FileAsset（FileEntityType 双形态） | 附件层可承载；**FUTURE（一级对象）** |
| Media | FileAsset + ProductMedia / Content cover | CONTENT·FUTURE |

---

## 4. Entity / Context Classification

**Contract 级类型化 Context Block**（不建表）：

```
Capability(Product)
  + SupplierProduct(Model)
  + Organization(Provider · type=SUPPLIER)
  + Category
  + Parameter / Spec（ParameterDefinition Authority + 三层值表）
  + Evidence(FileAsset)
  + Knowledge / Solution（轻量挂载）
```

- 一级 Context 对象（Capability/Product/SupplierProduct/Organization/Category/Spec/Evidence/Knowledge/Solution）= 全部为**既有实体投影**。
- Application / DetectionObject / Standard / Certification / Evidence（一级对象）= **FUTURE Candidate**，759 只做角色边界，不实施。

---

## 5. Insight Architecture

- Insight = Content publication domain 的衍生角色，非独立领域表。
- 无 AI/自动生成；未激活任何 Insight 运行时。
- Status：**FOUNDATION / CONTENT-DERIVED / FUTURE FOR FULL**。

---

## 6. Application Architecture

- **FUTURE Candidate**。现有数据无独立 Application 实体。
- 759 仅登记分类边界（Application = 能力应用场景的潜在一级对象），**不建表、不实施**。

---

## 7. Detection Object Architecture

- **FUTURE Candidate**。现有数据无独立 Detection Object 实体。
- 759 仅登记分类边界，**不建表、不实施**。

---

## 8. Knowledge / Standard Architecture

**Knowledge**：
- 既有 Publication Domains：KnowledgeEntry / KnowledgeCategory / KnowledgeDomain / PCKM。
- 确定性映射保持：`Product → ProductCategory → PCKM → KnowledgeCategory → KnowledgeEntry`（**无 AI / 无关键字猜测**）。
- Search `knowledge` 域 = CANONICAL。

**Standard**：
- **FUTURE Candidate**。无独立表 / 无独立 Authority。
- Specification 权威 = `ParameterDefinition`（唯一 Dictionary Authority），非 Standard 实体。

---

## 9. Document / Certification / Evidence Architecture

- **Document** = FileAsset / FileEntityType 可承载；展示层挂载，**FUTURE（一级对象）**。
- **Certification** = **FUTURE Candidate**（无独立实体）。
- **Evidence** = FileAsset（FileEntityType）附件层可承载；**FUTURE（一级对象）**。759 保持附件层语义，不建 Evidence 表。

---

## 10. Solution Architecture

- Solution = Content `type=SOLUTION`（`/solutions`）+ Product 应用场景。
- Search `solution` 域 = CANONICAL。
- Solution 为 Supporting Layer，非核心 Discovery Entity，但纳入统一 Search 聚合与 External Discoverability。

---

## 11. Media Architecture

- Media = FileAsset（+ ProductMedia / Content cover）。
- Status：**CONTENT·FUTURE**；保持现有媒体层，不新增 Media 独立对象。

---

## 12. Internal Search Mapping

统一 `/search`（unified）六类聚合：
- products（product / Capability Authority）
- supplierProducts（supplier-product / Capability Model）
- suppliers（supplier / Provider，PUBLISHED SupplierProduct → Organization(type=SUPPLIER) 聚合）
- knowledge（knowledge）
- content / solutions（solution）
- + `category` facet + 参数 facet bundle（SupplierProduct dimension facets）

其他 Internal 入口：`/categories`（能力分类）、`/products`（能力权威/产品）、`/suppliers/[id]`（供应商详情）、`/search?type=*`（类型 Tab）。

---

## 13. External Search Mapping

- SEO Metadata + canonical URL（`absoluteUrl`）。
- JSON-LD Structured Data：`Organization`、`WebSite`（含 `SearchAction`）、`Article`、`TechArticle`、`Product`。
- External Search 暴露的 Entity 与 Internal Search **共享同一套 Canonical Entity + Semantic + URL**。
- `SITE_URL` 当前为 placeholder（`https://visndt.example.com`）= **既有 Config Follow-up / Historical**（759 不修改）。

---

## 14. AI / LLM Discoverability Mapping

- AI·LLM 可发现性 = **被动理解**：推广/爬取方阅读现有公开页面与结构化数据，无专供 LLM 的结构化 API。
- **无运行时 AI**、无 Embedding、无 Vector、无 RAG、无 Semantic Search、无 AI 内容自动生成。
- 约束：**不可因 AI 可发现而变更 Entity / Semantic / Relationship / Evidence**；三者（Internal / External / AI·LLM）必须共享同一 Canonical 语义。

---

## 15. Canonical URL / Semantic Contract

| Semantic | Canonical 判定 |
|---|---|
| `product` | **CANONICAL**（Capability Authority；`/products`） |
| `capability` | **ALIAS → product**（前端 Tab「检测能力」映射 `type=product`；不新增独立搜索域） |
| `supplier-product` | **CANONICAL**（Supplier-owned Capability Model；`supplierProducts` API 组） |
| `supplier` | **CANONICAL**（Capability Provider / Supplier Entity；`suppliers` API 组） |
| `knowledge` | **CANONICAL**（`knowledge` API 组） |
| `solution` | **CANONICAL**（`solutions` API 组，Content type=SOLUTION） |
| `category` | **CANONICAL（FACET / IA）**，非搜索 type（facet 参数 `selectedCategoryTab` + `/categories`） |
| `/search/supplier-models`（API） | **LEGACY → Remove Later**（SearchPageContent 已不消费；unified /search 附带 facet bundle） |
| `/supplier-models`（路由） | **LEGACY / DEPRECATE → Remove Later**（757 已登记 Future Candidate） |

---

## 16. Search type Semantic Reconciliation

`supplier` vs `supplier-product`（专项判定）：

> **NOT DUPLICATE / NOT CONFLICT — CANONICAL（双视图，粒度不同）**

| 维度 | `supplier` | `supplier-product` |
|---|---|---|
| 视图 | 供应商实体视图（Provider） | 能力型号视图（Model） |
| 投影粒度 | Organization 级（`Organization(type=SUPPLIER)` 聚合，`SupplierDiscoveryItem`） | SupplierProduct 级（Model） |
| 数据源 | PUBLISHED SupplierProduct → Organization 聚合 | PUBLISHED SupplierProduct 直出 |
| UI 语义 | 「供应商」Tab | 「能力型号」Tab |
| 关系 | Provider→Models 上卷（聚合 published SupplyProduct） | Model→Provider 下钻（`supplier-product.organization → /suppliers/[id]`） |

- 两者共享**同一 PUBLISHED 种群**，但投影粒度 / UI 语义不同，**非重复、非冲突**。
- 纪律：**两 Tab 语义固定，不得合并、不得互相承载列表**；禁止继续双重语义。
- 其余类型均已收敛为 CANONICAL / ALIAS / LEGACY（见 §15），无未解决冲突。

---

## 17. Relationship Graph（759 冻结）

```
SupplierProduct ──> Organization(Provider · type=SUPPLIER)
      │
      └──> Product(Capability Authority · platformProductId)
                └──> Category
                         └──> PCKM ──> KnowledgeCategory ──> KnowledgeEntry（确定性，无 AI）
Knowledge ──> KB（既有知识资产中心）
Solution ──> Content(type=SOLUTION) / Product 应用场景
Evidence ──> FileAsset（FileEntityType 附件层）
```

- 全部为既有实体确定性映射；无 AI / 关键字猜测；无第二套 Authority。

---

## 18. M34.6 Technical Context + Evaluation Blueprint（契约级，非实施）

- **Technical Context Model**：类型化 Context Block = `Capability(Product) + SupplierProduct(Model) + Organization(Provider) + Category + Parameter/Spec + Evidence(FileAsset) + Knowledge/Solution`，作为 `/products/[slug]` Comparative Surface 的只读投影；**不建表**。
- **Evaluation Flow（M34.6）**：`Technical Context（结构化） → Compare（CompareBar/Compare 复用既有） → Shortlist → Inquiry → RFQ/Buyer↔Supplier`；复用既有 `Demand/RFQ/RFQResponse/Inquiry`；**禁止重新设计交易系统**。
- **依赖**：M34.6 实施需在数据就绪下进行 Real-data 验证；当前 **NOT AUTHORIZED**。

---

## 19. Expansion Gates

| Gate | 定义 | 759 状态 |
|---|---|---|
| **Gate A — Authority** | ONE Capability / Product / Supplier / Specification Authority | **HOLD（成立）** |
| **Gate B — Context** | 所有 Technical Context 对象完成角色分类 | **PASS（分类完成；一级对象=FUTURE）** |
| **Gate C — Discoverability** | 每类对象明确 Internal / External / AI·LLM 职责 | **PASS（契约建立）** |
| **Gate D — Evaluation** | Technical Context → Compare → Shortlist | **Blueprint 建立；实施 NOT AUTHORIZED** |
| **Gate E — Implementation** | 仅 759 PASS/CONDITIONAL PASS 后才允许规划 M34.6 | **759=CONDITIONAL PASS → M34.6 可规划但独立授权** |

---

## 20. Roadmap State

| Milestone | Status |
|---|---|
| M33 | CLOSED |
| M34.0 | CONDITIONAL |
| M34.1 / M34.2 / M34.3 | COMPLETE / CONDITIONAL |
| M34.4 | CONDITIONAL PASS |
| M34.4R | CONDITIONAL PASS |
| M34.5 | CONDITIONAL PASS |
| 758 | CONDITIONAL PASS |
| **759** | **CONDITIONAL PASS（CURRENT）** |
| M34.6 | NOT AUTHORIZED / **READY FOR INDEPENDENT AUTHORIZATION**（Blueprint+Contract 达成，唯真实数据空不作为授权） |
| M34.7 | NOT AUTHORIZED |
| M34-FINAL | NOT STARTED |

> READY ≠ AUTHORIZED。759 未授权 M34.6。

---

## 21. C2 / C5 / C6

- **C2 = CONDITIONAL**（保持）
- **C5 = FOUNDATION / NOT FULL DISCOVERY**（保持）
- **C6 = FOUNDATION / NOT FULL CAPABILITY-LED SEARCH**（保持）

759 **未升级**三态。

---

## 22. Final Decision

### 检查项判定

| 判定子 | 结果 |
|---|---|
| Technical Context boundary 足够冻结 | ✅ PASS（Contract 级分类完成） |
| Discoverability Contract 建立 | ✅ PASS（Internal/External/AI·LLM 共享） |
| Search semantics 收敛 | ✅ PASS（无未解决矛盾；supplier vs supplier-product 已判定 CANONICAL 双视图） |
| M34.6 Blueprint 建立 | ✅ PASS（契约级） |
| No architecture violation | ✅ PASS |
| Existing data limitation | ⚠️ Real Product/Supplier/Capability Population = **UNVERIFIED**（合法空数据） |
| Historical gap / Future Candidate | ⚠️ legacy `/search/supplier-models`、768≈140px overflow、`/supplier-models` 路由、SITE_URL placeholder、Application/DetectionObject/Standard/Certification/Evidence 一级对象 |

### 阻塞判定

New Domain Authority / Schema / Migration / Fake Data / AI Runtime / Vector / RAG / Semantic Search / Search Index / Matching Modification / RFQ Modification / Global UI Rewrite / Undeclared Functional Change = **均未出现** → 非 **BLOCKED**。

因存在 Existing data limitation + Historical gap + Future Candidate → 非 **PASS**（PASS 要求全部 Context 分类 / Discoverability / Search 矛盾 / Evaluation Blueprint / 架构矛盾全部完成且无残留）。

> **Final = CONDITIONAL PASS**

---

## Final Execution Output

```
Task ID:  759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation
Task Status: CONDITIONAL PASS
Repository Root: F:\Desktop\VISNDT
Code Root:       F:\Desktop\VISNDT\VISNDT
Branch:    main
Commit:    ff03a9a
Working Tree: OTHER（既有改动；759 不新增生产代码）

M33:       CLOSED
M34.0:     CONDITIONAL
M34.1:     COMPLETE / CONDITIONAL
M34.2:     COMPLETE / CONDITIONAL
M34.3:     COMPLETE / CONDITIONAL
M34.4:     CONDITIONAL PASS
M34.4R:    CONDITIONAL PASS
M34.5:     CONDITIONAL PASS
758:       CONDITIONAL PASS
759:       CONDITIONAL PASS
M34.6:     NOT AUTHORIZED
M34.7:     NOT AUTHORIZED
M34-FINAL: NOT STARTED

C2:        CONDITIONAL
C5:        FOUNDATION / NOT FULL DISCOVERY
C6:        FOUNDATION / NOT FULL CAPABILITY-LED SEARCH

Technical Context Model:      FROZEN（Contract 级，不建表）
Insight:                      FOUNDATION / CONTENT-DERIVED
Application:                  FUTURE Candidate
Detection Object:             FUTURE Candidate
Knowledge:                    FOUNDATION（既有 Publication Domains，确定性映射）
Standard:                     FUTURE Candidate（Spec 权威=ParameterDefinition）
Document:                     FUTURE（FileEntityType 可承载）
Certification:                FUTURE Candidate
Evidence:                     FUTURE（FileAsset 附件层）
Solution:                     FOUNDATION（Content type=SOLUTION + 应用场景）
Media:                        CONTENT·FUTURE
Internal Search:              ESTABLISHED（统一 /search 六类聚合）
External Search:              ESTABLISHED（SEO Metadata + JSON-LD + canonical）
AI / LLM Discoverability:     ESTABLISHED（被动可读，无运行时 AI）
Canonical Semantic Contract:  ESTABLISHED
Search Type Semantic Reconciliation: DONE
supplier vs supplier-product: RESOLVED（NOT DUPLICATE / NOT CONFLICT — CANONICAL 双视图）
Relationship Graph:           FROZEN
M34.6 Blueprint:              ESTABLISHED（契约级）
M34.6 Recommendation:         READY FOR INDEPENDENT AUTHORIZATION（READY ≠ AUTHORIZED）

Production Code:            NONE
Schema:                     NO CHANGE
Migration:                  NONE
Database Mutation:          NONE
Test Data Creation:         NONE
AI Runtime:                 NONE
Vector / RAG / Embedding:   NONE
Matching:                   NO CHANGE
RFQ:                        NO CHANGE
Mobile:                     STRUCTURAL
768 Overflow:               CARRY FORWARD（归 M34.7/未来，不作为本任务修复）
Documentation:              UPDATED（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / M34 Contract §19）
Review Report:              docs/_review/759_M34_Technical_Context_And_Discoverability_Architecture_Reconciliation_Report.md
```

---

## Mandatory STOP

759 已完成。**STOP**：

- 不得自动执行 **M34.6**（Compare / Shortlist / Inquiry / RFQ / Buyer↔Supplier）。
- 不得自动实施 **Insight / Application / Detection Object / Knowledge / Standard / Document / Evidence / Solution**。
- 不得自动实施 **SEO / Structured Data / LLM Runtime / AI Search / Embedding / Vector / RAG**。
- 即使 **M34.6 = READY FOR INDEPENDENT AUTHORIZATION**，仍必须 **STOP**；后续所有任务（含 M34.6/M34.7/M34-FINAL）须重新独立授权，并在数据就绪下做真实数据验证。