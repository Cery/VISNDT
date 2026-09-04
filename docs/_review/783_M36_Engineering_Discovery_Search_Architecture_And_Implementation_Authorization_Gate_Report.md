# 783 M36 Engineering Discovery Search — Architecture & Implementation Authorization Gate Report

**Task**: 783\_M36\_Engineering\_Discovery\_Search\_Architecture\_And\_Implementation\_Authorization\_Gate
**Review Number**: 783（仓库 `docs/_review/` 实测：不存在既有 783 文件，为下一正确编号）
**Type**: Architecture Audit / Scope Freeze / Implementation Readiness Assessment / Independent Authorization Gate
**Mode**: READ-ONLY / NO IMPLEMENTATION / NO FEATURE / NO SCHEMA / NO MIGRATION / NO API/Backend/Frontend CHANGE / NO DATA MUTATION
**Date**: 2026-09-01
**Baseline**: 775 Vertical Platform Calibration / 776 M35 ARCH COMPLETE / 777-781 CONDITIONAL PASS / 782 FINAL STATE RECONCILIATION / **M35=CONDITIONAL / NOT CLOSED / M36=AUTHORIZABLE WITH CARRY-FORWARD CONDITIONS (NOT AUTHORIZED · NOT STARTED)**
**核心纪律**: AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED——本任务只判断 M36 是否具备独立实施授权条件，不实施 M36。

***

## 1. Repository Verification（Absolute 1-2，实测）

- **仓库根**：`F:/Desktop/VISNDT`（实测 `git rev-parse --show-toplevel`）。

- **代码根**：`F:/Desktop/VISNDT/VISNDT`（实测存在 `apps/web`、`apps/api`、`database/prisma`、`docs`）。

## 2. Git Baseline（Absolute 3，实测，不得假设历史）

- **Branch**：`main`（实测）。

- **HEAD**：`76b08e508325b7c094c7b7f1234fc18e8e37014e`（实测，783 未提交）。

- **Remote**：`origin https://github.com/Cery/VISNDT.git`（fetch/push）。

- **Working Tree**：实测未提交改动保留（777-782 M35 前端 + organization-members + 文档同步 + 781 复验辅助脚本）；**未 reset / clean / checkout / restore / stash / rebase / merge / delete / overwrite**；783 未对任何生产代码/文档做改动性操作。

## 3. 776-782 Reconciliation（Absolute 4，实测确认）

- 775 = Vertical Platform Calibration / 776 = M35 ARCHITECTURE DECISION COMPLETE / 777-781 = CONDITIONAL PASS / 782 = FINAL STATE RECONCILIATION / ROUTE CONTINUATION GATE（全部保持）。

- **当前 M35 = CONDITIONAL / NOT CLOSED**（实测确认）。

- **当前 M36 = AUTHORIZABLE WITH CARRY-FORWARD CONDITIONS / NOT AUTHORIZED / NOT STARTED**（实测确认——无任何已实现 M36 代码/文档，Search 未重写）。

- 776-782 历史报告 **未修改**；Frozen Architecture **未修改**。

## 4. M35 Carry-forward Impact（BR-782-01..09 逐项，Absolute 31）

| BR        | Issue                                      | 是否影响 M36 Architecture | 是否影响 M36 Search Contract | 是否影响 M36 Data Model | 判定                                |
| --------- | ------------------------------------------ | --------------------- | ------------------------ | ------------------- | --------------------------------- |
| BR-782-01 | Authenticated Supplier Multi-user evidence | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-02 | Authenticated Invitation evidence          | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-03 | Authenticated Role Management evidence     | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-04 | Publication Governance runtime             | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-05 | Search deep regression matrix              | 否                     | 否                        | 否                   | NON-BLOCKING（属回归闭环，M36 强化）        |
| BR-782-06 | Parameter deep regression matrix           | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-07 | Compare deep regression matrix             | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-08 | Inquiry authenticated submit               | 否                     | 否                        | 否                   | NON-BLOCKING                      |
| BR-782-09 | 1024px global header 19px overflow         | 否                     | 否                        | 否                   | NON-BLOCKING（存量 UI carry-forward） |

**结论**：M35 遗留问题全部为 **evidence-gap / credential-unavailable / UI carry-forward** 类，**均不影响 M36 Search 架构 / Search Contract / Search Data Model / M36 Runtime / M36 Implementation Scope**。规则"**M35 evidence gap ≠ M36 blocker**"成立，且以实际证据判定（非机械套用）。BR-782-01..09 各证据仍保持冻结，不阻塞 M36 独立授权门。

## 5. Current Search Architecture（实际 code，非 774/775 报告）

以当前工作树代码为最高证据，实际审计：

- **单入口 Authority**：`GET /search`（[search.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/search.controller.ts)）+ `GET /search/context` + `GET /search/supplier-models`。

- **请求流**：`UnifiedSearchDto{q,page,pageSize,category,filters,brand,series,hasOffer}` → `SearchService.search()`（[search.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/search.service.ts)）并行查询 6 个实体维度。

- **结果模型**：统一 `UnifiedDiscoveryResponse{products, supplierProducts, knowledge, content, solutions, suppliers}`——**单一结果模型，无第二套 EngineeringResult/CapabilityResult**。

- **检索后端**：**Prisma PostgreSQL SQL** **`contains`（case-insensitive）**，非 ES/OpenSearch/向量。产品按 `status=ACTIVE`，SupplierProduct 仅 `PUBLISHED` 进入索引（Published Boundary 服务端强制）。

- **数据源**：`Product` / `SupplierProduct`+`platformProduct`+`offers` / `KnowledgeEntry`(PUBLISHED) / `Content`(ARTICLE/INSIGHT/SOLUTION) / `SupplierProduct→Organization(type=SUPPLIER)` 聚合。

- **Facet 模型**：

  - `/search/context`：[search-context.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/search-context.service.ts) 基于全量候选计算出 `relevantCategories` + `commonFilters` + `categorySpecificFilters`（ParameterFacet）+ `availableValues`（交集/含交集算法，确定性数据驱动，无 AI）。

  - `/search` 附加 `supplierProductFacets{brands,series,commercial}`（[supplier-model-facet-search.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/supplier-model-facet-search.service.ts)）。

- **Web 端**：[SearchPageContent.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/search/SearchPageContent.tsx) 消费统一 /search + facets，URL 深链（brand/series/hasOffer），多类型 ResultCard（Product/Knowledge/Solution/SupplierProduct/Supplier）。

- **Runtime 实跑**：API `:4000` alive，`GET /api/v1/search?q=内窥` = **200**（返回真实 ZB-K60 产品）；`GET /api/v1/search/context?q=内窥` = **200**（`candidateCount=2`、`relevantCategories=[电子视频内窥镜…]`）。**Search Architecture RUNTIME VERIFIED（当前，非历史）**。

## 6. Search Authority Boundary（§7）

- `/search` 依然是**统一 Search Authority**；`/search/supplier-models` 与`/search/context` 为其支撑构件，**非第二套主搜索系统**。

- **不得**建议创建 `/search-engine` `/engineering-search` `/technical-search` `/semantic-search` `/capability-search` 作为第二套主搜索系统（任何此类建议需 STOP + Fundamental Change Candidate）。

## 7. Search Object Boundary（§8）

- 当前允许对象：Product / SupplierProduct / Supplier / Category / Parameter / Knowledge / Content / Solution。

- **Application / Detection Object / Insight / Document / Standard**：只按 `existing model reuse + derived semantic indexing + content-backed search` 判断；**不得**因"搜索需要"自动创建 Application/DetectionObject/Insight/Document/Standard Entity（保持 776 决策：Application/Detection Object = SEMANTIC\_DERIVED，Insight/Document = Content/Knowledge reuse，Standard = DEFER）。

## 8. Parameter-driven Search Gate（§9）

- **已有能力（code + runtime）**：`ParameterDefinition`(54) / `ParameterGroup`(11) / `ProductParameterValue`(32) / `ProductParameterDefinition` / `Category`(16) / Facet 已能支撑 **技术参数 → 筛选 → 产品候选**。

- `/search/context` 的 ParameterFacet + `/search` 的 `filters`（`parameterId:value1,value2`，同参 OR/异参 AND，服务端 filter-before-pagination）已实现参数筛选。

- **判断**：M36 **最小增强可停留在**「现有参数字典 + 现有 Product Parameter + 现有 Facet + Search Query Extension」，**不需要** Specification Entity / Specification Table / Specification Marketplace。

- **确需新 Schema 的情形未发现**；若 M36 实施中出现新 Schema 需求 → STOP + 报告 Architecture Change Candidate + 不在 M36 设计 Migration。

## 9. Semantic Layer Assessment（§10-11，代码存在 ≠ 运行可用）

- **代码结构**：`semantic/` 含 `semantic-query.service` / `unified-search.service` / `retrieval.service` / `ranking.service` / `embedding-cache.service`；依赖 `../embedding/embedding.service`。

- **运行可用性**：**NOT runtime-ready for this environment**——`OpenAIEmbeddingProvider.generateEmbedding` 仅在 `OPENAI_API_KEY` 配置时激活，未配置则 `throw new Error('OPENAI_API_KEY not configured')`；`retrieval.service` 基于 pgvector 余弦相似度。**semantic/unified-search 为独立 orchestration，未接入公共** **`/search`（`SearchController`** **不调用 UnifiedSearchService）**。

- **判定**：不能因"存在 semantic module"就写 **L4 Search = READY**。**实际公共 Search = Prisma SQL（非语义）**。

- **授权边界**：M36 可研究 `现有 semantic/query → unifiedSearch` 的**受控适配**（controlled extension）；但**不得**自动扩大为 AI/LLM/RAG/Vector/Agent/NL Search Platform（AI 保持 FROZEN，接口/契约级，不激活运行时）。L4 语义检索属退出 M36 的架构候选，需独立 ADR。

## 10. Search Result Architecture（§12）

- 可保持**统一 Search Result**，通过 `type/category/parameters/supplier/knowledge/content` 表达不同发现对象。

- **禁止**设计第二套 `EngineeringResult/CapabilityResult/TechnicalResult/SemanticResult` 作为独立 Domain Authority——现有 UnifiedDiscoveryResponse 已能表达，无需证明"无法表达"，即可维持。

## 11. Search Facet Strategy（§13）

- M36 只沿 **Category / Parameter / Brand / Series / Supplier** 等已有维度增强（已具备全部）。**Parameter 视为 first-class engineering discovery dimension**（非装饰性 filter）：`/search/context` 已按交集计算 parameter facet，数量依据 `Category + Parameter + Keyword + Supplier` 可形成最小工程检索闭环。

## 12. Product / SupplierProduct Search Relationship（§14）

- 现有 JOIN/投影链路：`Product(platform) → SupplierProduct(PUBLISHED, @unique) → Organization`，在 `search.service` 已用 Prisma relation 投影。

- M36 可做 **JOIN / Aggregation / Projection 增强**（如 SupplierProduct 参数投影增强、Supplier 维度投影），但**禁止** Capability Search Entity / Supplier Search Entity 等新 Domain。

## 13. Knowledge / Content Search Relationship（§15）

- Knowledge(PUBLISHED KnowledgeEntry) + Content(ARTICLE/INSIGHT/SOLUTION) 已通过现有表进入统一搜索；ContentTag/Relation 可辅助检索。

- **M36 只审查"Search 能否安全消费现有 Knowledge/Content 数据"**；**不得**提前完成 M37 Knowledge + Insight 实现。

## 14. Search Ranking Boundary（§16）

- 当前排序=`createdAt desc` / `publishedAt desc`（简单确定性，无排名引擎）。

- M36 允许 review：keyword / category / parameter match / product authority / supplier relevance / knowledge-content relevance。

- **禁止**：Marketplace/Seller/Commercial/Sponsored/Paid/Reputation/Trust 排序。Ranking 必须服务 **Engineering Relevance**，非交易。

## 15. Low-Operation Assessment（§17）

- 当前 Search **完全自动索引**既有结构化数据（无手工索引、无人工逐产品排序、无手工 SEO/关系维护）。

- **Low-Operation = PASS**：`Existing Structured Data + Existing Parameter Dictionary + Existing Product Data + Existing Content + Automatic Indexable Fields + Reusable Search Logic` 均已成立。实现方案不依赖手工维护 → 非 "NOT READY"。

## 16. Data Scale Assessment（§18, 实测）

- **Runtime 实测数据规模**（`psql` 直连容器，非虚构）：

  - Product=**4** · SupplierProduct=**5** · Organization=**16** · ParameterDefinition=**54** · ProductCategory=**16** · Content=**8** · KnowledgeEntry=**6** · ProductParameterValue=**32** · **SupplierProductParameterValue=0** · ParameterGroup=**11**。

- **Current scale**：S（小）；**Expected next-round scale**：S→M（<1k 数量级）。

- **Search/query/facet cost**：Prisma SQL + 候选全量集合运算，当前规模可承载。

- **结论**：**不需要** New Search Index / Elasticsearch / OpenSearch / Meilisearch / Vector DB（当前架构已证明可承载）；若未来确有需求 → Architecture Candidate + 独立 ADR，不在 M36 实施。**注意** SPPV=0（SupplierProduct 参数值空）——参数驱动搜索在 Product 维度已可用，在 SupplierProduct 维度参数投影为空（数据侧缺口，非架构缺陷，进入 Batch Remediation/受控数据，不阻塞 Search 架构）。

## 17. Benchmark Alignment（§19-20）

- **GlobalSpec** 仅作 `Engineering Search / Specification Discovery / Technical Information / Parameter-driven Discovery` 外部参考；**禁止复制**其 IA / Entity Model / ranking / business model。借鉴"工程发现能力"，非复制。

- **DirectIndustry / ThomasNet** 仅作 Benchmark（Product/Category/Catalog/Inquiry 与 Supplier/Sourcing/Capability/RFQ）。主轴仍 = **GlobalSpec-style Engineering Discovery + Vertical NDT specialization**。

## 18. M36 Scope Freeze（§21-22）

若获授权，M36 唯一允许（A-J）：
A. Search 一级平台表面 · B. Search IA 提升 · C. Parameter-driven Search · D. Category+Parameter+Keyword 组合检索 · E. Supplier/SupplierProduct Search projection · F. Knowledge/Content Search projection · G. **现有 semantic/query 受控集成（controlled）** · H. Result relevance refinement · I. 现有 Search client/API **最小扩展（仅当 Search contract 需要）** · J. Runtime Search Verification。

**Explicit Out-of-Scope（绝对不得）**：New Search Architecture / New Search Engine / New Search Domain / Search Index Platform / AI / LLM / RAG / Vector / Agent / NL Search Platform / Marketplace / Paid / Sponsored；Product/Supplier/Knowledge/Insight/Document System 重写；M37/M38/M39；SEO/LLM SEO；Homepage/Global UI/Admin/Mobile 全量重写；Marketplace/Transaction/Commerce。

## 19. Schema / API / Backend Gate（§23）

- **默认**：Schema=**NO CHANGE** · Migration=**NONE** · Backend=**minimal / only if current Search contract requires** · API=**minimal extension only if strictly necessary**。

- 本任务自身 **NO IMPLEMENTATION**。

- **未发现 M36 需 major Schema / 新 Search Domain / 新 Search Architecture**；若实施审查中发现 → **M36=NOT AUTHORIZABLE** + 创建 Architecture Change Candidate + 不绕过本门。

## 20. Mobile Search Boundary（§24）

- M36 须把 Search 作为 **Mobile First-Class Capability**（375/768/1024/1440），但**本任务不实现**。

- 审查 Search IA 需求（entry/input/category/parameter/supplier filter/result list/card/sort/pagination/navigation）随实施设计。

- **1024px 既有全局 header overflow** 须纳入考虑，但**不得**因此把 Global Mobile Rewrite 纳入 M36（carry-forward，不进 M36）。

## 21. External Search / AI Discoverability Boundary（§25）

- M36 可关注：Search result semantic structure / Canonical Product URLs / Structured metadata compatibility。

- **External SEO Optimization / AI-LLM Discoverability / Sitemap Expansion / Structured Data Expansion** 正式属 **M38 Unified Discovery + Multi-surface Discoverability**，**不得**在 M36 提前实现。

## 22. Change Size Classification（§27）

- **REUSE**：统一 `/search` + Prisma 检索 + Facet + ParameterFacet + SupplierProduct facet + SearchPage（全部复用）。

- **CONTROLLED EXTENSION**：Search IA 提升 / Parameter-driven projection / Knowledge·Content 消费 / semantic 受控适配 / Search client-API 最小扩展。

- **FUNDAMENTAL CHANGE**：**0**（未发现需新 domain/新架构/新 DB/新 ranking/规范实体）。

- **DEFER**：L4 Semantic runtime / ES·Vector 索引 / External SEO / M37+。

- **Change Size = S/M**（REUSE + 受控扩展为主）。**若判 M36 需 L → M36=NOT AUTHORIZABLE**，当前 **非 L**，不自行扩展方案。

## 23. Implementation Readiness（§28，7 维，README 不得以"理论上可以"代替）

| 维度                      | 判定                        | 依据                                                                         |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------- |
| Architecture Readiness  | **READY**                 | 统一 /search 架构稳定、无新 domain、runtime VERIFIED                                 |
| Data Readiness          | **READY WITH CONDITIONS** | 现有数据够支撑 Product 参数搜索；**SPPV=0（SupplierProduct 参数投影数据空）为条件项**，进入受控数据/BR，非阻塞 |
| API Readiness           | **READY WITH CONDITIONS** | 现有 /search + /context 足够；最小扩展仅当 Search contract 需要，须独立授权                   |
| Frontend Readiness      | **READY WITH CONDITIONS** | SearchPage 已消费 facets；IA 提升需随授权实施，非本任务                                     |
| Runtime Readiness       | **READY WITH CONDITIONS** | API+DB runtime 实跑（/search 200）；semantic runtime 依赖外部 key=条件项（受控，不激活 AI）    |
| Mobile Readiness        | **READY WITH CONDITIONS** | 移动优先目标；1024 全局 overflow 为 carry-forward 条件，不进 M36                          |
| Low-Operation Readiness | **READY**                 | Search 自动索引既有结构化数据成立                                                       |
| Documentation Readiness | **READY**                 | 文档同步完成（本报告 + STATUS/ROADMAP/MATRIX）                                        |

## 24. M36 Authorization Decision（§34）

- **判定 = Option B：M36 = AUTHORIZABLE WITH CONDITIONS**。

- 满足：Architecture 稳定 ✓ / 剩余条件 **non-blocking** ✓ / 条件可 **carried into implementation** ✓ / **无 schema/domain 重设计** ✓（Parameter 能一线，现有模型足够）/ **无 route expansion** ✓ / Change Size=S/M ✓ / **无 FUNDAMENTAL CHANGE** ✓ / **无 Blocking dependency**（M35 carry-forward 全部 NON-BLOCKING）✓。

- **附带条件（须随 M36 独立授权实施时携带）**：

  1. M36 实施须**独立授权任务**（本门不授予实现本身；AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED）。
  2. Semantic layer 仅**受控适配**（不出 M36 的 AI/LLM/RAG/Vector/runtime 激活；保持 AI FROZEN）。
  3. Parameter 一线但 SupplierProduct 参数投影数据（SPPV）需以**受控数据**补齐/或标记 BR，不伪装为已完备。
  4. 任何需新 Schema / 新 Search Domain / 新 Search 架构的情况 → 立即 STOP + Architecture Change Candidate，**不得绕过本门**。
  5. 1024 全局 overflow carry-forward，不进 M36。

- **非 Option A**（M36=AUTHORIZABLE 无条件的条件项存在——semantic runtime 依赖 + SPPV 空 + API 最小扩展需授权）。

- **非 Option C/D**（无架构不稳定 / 契约不明 / 模型不足 / 参数模型不足 / semantic 需新架构 / change>M / M35 前置阻断；更无 security/integrity/arch-contradiction/unauthorized/repo/production 问题）。

## 25. Documentation Synchronization（§32）

- 追加 783 M36 Authorization Gate / M36 Readiness / M36 Scope Freeze / M36 Dependencies / M36 Conditions 至 `PROJECT_STATUS.md`、`PROJECT_ROADMAP.md`、`MODULE_COMPLETION_MATRIX.md`。

- **未把 M36=AUTHORIZED 写入实现状态**（AUTHORIZABLE WITH CONDITIONS ≠ AUTHORIZED；实施仍须独立授权）。

- 未改写 776-782 与 Frozen Architecture。

## 26. STOP Confirmation（Absolute 40）

- **STOP：CONFIRMED**。

- 783 为 M36 独立授权门（判断就绪度），**非实现**；不自动启动 M36 / 不创建 M36.1/2/3 / 不创建 Search·Semantic·SEO·Mobile Stream / 不进入 M37-M39 / 不实施 AI·LLM·RAG·Vector·Marketplace。

- **固定路线保持**：M35 → M36 → M37 → M38 → M39 → Final Platformization Assessment。

- 本任务完成后 **STOP**。

***

### Final Execution Output（783）

```
Task:  783_M36_Engineering_Discovery_Search_Architecture_And_Implementation_Authorization_Gate
Repository Root:  F:/Desktop/VISNDT
Code Root:        F:/Desktop/VISNDT/VISNDT
Branch:           main
HEAD:             76b08e508325b7c094c7b7f1234fc18e8e37014e
Working Tree:     present（未提交改动保留；783 未改生产代码/文档标题外内容）
Fast History:     775-782 全保持；M35=CONDITIONAL/NOT CLOSED；M36=NOT AUTHORIZED/NOT STARTED
M35 Carry-forward Impact: BR-782-01..09 全 NON-BLOCKING for M36（无影响 Search arch/contract/data-model/runtime/scope）
Current Search Architecture: 统一 GET /search（Prisma SQL contains，6 实体）+ /search/context(ParameterFacet) + SupplierProduct facet；RUNTIME VERIFIED（/search?q=内窥=200、/search/context=200）
Search Authority: /search 仍唯一 Authority；不建第二套 search engine/domain
Search Object: Product/SP/Supplier/Category/Parameter/Knowledge/Content/Solution；App/DO/Insight/Doc/Standard 仅 reuse/derived，不建 Entity
Parameter-driven: READY（现有字典+facet+query 扩展）· 无 Specification Entity 需求
Semantic Layer: code 存在但 runtime 依赖 OPENAI_KEY+pgvector 未接入公共入口 → 仅受控适配候选，不激活 AI
Change Size: S/M（REUSE + CONTROLLED EXTENSION）· FUNDAMENTAL=0
Implementation Readiness: Architecture=READY · Data=READY WITH CONDITIONS(SPPV=0) · API=READY WITH CONDITIONS · Frontend=READY WITH CONDITIONS · Runtime=READY WITH CONDITIONS(semantic) · Mobile=READY WITH CONDITIONS(1024 CF) · Low-Operation=READY · Documentation=READY
Data Scale（实测）: Product=4/SP=5/Org=16/ParamDef=54/Cat=16/Content=8/Know=6/PPV=32/SPPV=0
M36 Scope Freeze: A-J allowed；Out-of-Scope（new arch/engine/domain/AI/RAG/Vector/Marketplace/M35-M39 重写/SEO/global rewrite）绝对禁止
Schema: NO CHANGE · Migration: NONE · API: minimal extension only if needed · Backend: minimal only if needed · Frontend: NO CHANGE（本任务）
M35 Final State: CONDITIONAL / NOT CLOSED（保持）
M36 Authorization Decision: AUTHORIZABLE WITH CONDITIONS（Option B）
M36 Implementation: NOT AUTHORIZED（须独立授权任务；不自动 START）
Architecture: PASS（无漂移，无 new Search domain/arch/db）
Low-Operation: PASS（自动索引结构化数据）
Review Report: docs/_review/783_M36_Engineering_Discovery_Search_Architecture_And_Implementation_Authorization_Gate_Report.md
STOP: CONFIRMED
```

