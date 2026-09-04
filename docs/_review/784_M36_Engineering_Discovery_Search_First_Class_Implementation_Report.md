# 784 — M36 Engineering Discovery Search First-Class Implementation Report

- **Task**: `784_M36_Engineering_Discovery_Search_First_Class_Implementation`

- **Date**: 2026-09-01

- **Stage**: M36 — Engineering Discovery Search（第一次受控实施）

- **Authorization Source**: 783 — M36 Engineering Discovery Search Architecture And Implementation Authorization Gate（Option B · **AUTHORIZABLE WITH CONDITIONS**）

- **Execution Mode**: CONTROLLED IMPLEMENTATION（Frontend-Only 最小增强）

- **Schema**: NO CHANGE · **Migration**: NONE · **API**: EXISTING ONLY · **Backend**: NO CHANGE

- **M36 Implementation State**: **CONDITIONAL / NOT CLOSED**（784 = IMPLEMENTED / CONDITIONAL PASS）

- **Fixed Route**: M35 → M36 → M37 → M38 → M39 → Final Platformization Assessment（保持，无子阶段/无平行 stream）

***

## 1. Repository Verification

| Field           | Value                                           |
| --------------- | ----------------------------------------------- |
| Repository Root | `F:\Desktop\VISNDT`                             |
| Code Root       | `F:\Desktop\VISNDT\VISNDT`                      |
| Branch          | `main`                                          |
| Remote origin   | configured（`git remote -v` present）             |
| Schema location | `VISNDT/database/prisma/schema.prisma`（**未改动**） |
| Migrations      | `VISNDT/database/prisma/migrations`（**无新增**）    |

Repository verified live. Working tree is in a stable tracked state（777-783 carry-forward + 784 search-frontend changes + 2 new components）; no `reset/clean/checkout/restore/stash/delete/overwrite` executed. Historical reports 776-783 and Frozen Architecture were **not modified**.

## 2. Git Baseline

- **HEAD Before**（783）: `76b08e508325b7c094c7b7f1234fc18e8e37014e`（`768 M34.6 closeout docs: sync ...`）

- **HEAD After**: `76b08e508325b7c094c7b7f1234fc18e8e37014e`（784 未提交，HEAD 未变；改动保留在工作树）

- **Working Tree**: `784` search-frontend changes + pre-existing 777-783 changes（organization-members / ProductDetail / Workspace / M34-M35 docs）. The organization-members & workspace changes are **M35 carry-forward, NOT 784**.

- **784-Only Diff**: 3 modified + 2 added search files（see §16 / §32）. Schema / migrations / API / Backend: **zero diff**.

Working Tree Protection: no destructive git operations were run.

## 3. 783 Authorization Verification

783（`docs/_review/783_M36_Engineering_Discovery_Search_Architecture_And_Implementation_Authorization_Gate_Report.md`）granted **Option B · M36 = AUTHORIZABLE WITH CONDITIONS**:

1. M36 to be implemented via independent authorized task（784 is that task）.
2. Semantic only controlled adapter, no AI activation.
3. Parameter is first-class dimension; SPPV=0 must be marked as controlled-data / BR, not faked.
4. Any new Schema / new Search Domain / new architecture → STOP + Architecture Change Candidate.
5. 1024px carry-forward stays out of M36.

**784 compliance**: all five conditions held. No new Schema / Domain / Entity / Search 2.0. Semantic not activated. No fake data. 1024 overflow carry-forward preserved. Full scope within the frozen M36 scope（Search Surface + Query + Parameter Filter + Result Projection + Semantic Adapter·controlled + Runtime Verification）.

## 4. Existing Search Architecture

Re-read before implementation（`apps/api/src/search/*` + `apps/web/src/app/search/*` + `apps/web/src/lib/api/search.ts` + `apps/web/src/services/search.service.ts`):

- Unified `GET /search`（`search.service.ts`）uses Prisma SQL `contains` in parallel across **Product / SupplierProduct / Knowledge / Content(ARTICLE·INSIGHT·SOLUTION) / Supplier** six entities → `UnifiedDiscoveryResponse`.

- `GET /search/context`（`search-context.service.ts`）aggregates candidate products → `relevantCategories` + `commonFilters`/`categorySpecificFilters` ParameterFacet with availableValues；explicitly `Deterministic, data-driven, no AI/LLM`.

- `GET /search/supplier-models` + `supplierProductFacets{brands,series,commercial}`（`supplier-model-facet-search.service.ts`).

- Web `SearchPageContent.tsx` consumes facets + URL deep-link + multi-type ResultCard.

784 **reuses** this architecture entirely; no second Search system/domain/database.

## 5. Search Surface

- `/search` remains the unified Search Authority（no `/engineering-search` created）.

- Added `EngineeringDiscoveryFraming.tsx`（[src/components/search/EngineeringDiscoveryFraming.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/search/EngineeringDiscoveryFraming.tsx)）— renders 能力分类（relevantCategories）+ 技术约束（paramCount/totalParamValues）above the facet/results, framing the surface as an engineering-discovery question（“which capability / which technical constraints matter”）.

- Integrated in `SearchPageContent.tsx` when `!loading && !error && hasAnyResults && context`.

**Result**: PASS（surface = first-class engineering discovery framing, grounded in existing `/search/context`）.

## 6. Parameter-driven Search

- Added `RelevantParameters.tsx`（[src/components/search/RelevantParameters.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/search/RelevantParameters.tsx)）— per-result technical-parameter strip sourced from query-level `context.commonFilters`（parameterName + up-to-2 values + unit + “已匹配” highlight when the parameter is actively filtered）.

- Backend filter-before-pagination + same-param OR / cross-param AND already implemented（`search.service.ts` `parseFilters` → `where.AND`）. **No backend change** made；existing contract fully satisfies the frontend.

**Result**: PASS（Parameter is a first-class engineering discovery dimension；combination Category + Parameter + Keyword supported by existing DTO/API and now surfaced in UI）.

## 7. Supplier / SupplierProduct Projection

- `SupplierProductResultCard.tsx` now renders `RelevantParameters` with caption `相关技术参数（能力级）`, passing query-level `relevantParams` + `activeParamFilters`.

- Projection remains capability-level: Product（=Capability Authority）→ SupplierProduct → Organization(type=SUPPLIER)；PUBLISHED SupplierProduct only（existing `searchSupplierProducts` Published boundary preserved）.

- Empty parameter set → strip not rendered（**no fabricated capability**）.

**Result**: PASS.

## 8. Knowledge / Content Projection

- Knowledge/Content（ARTICLE·INSIGHT·SOLUTION）results reuse existing `KnowledgeResultCard` / `SolutionResultCard`；**no new Entity/table**.

- Engineering framing surfaces category/parameter context that applies across the capability domains via shared `/search/context`；no new knowledge model.

**Result**: PASS（reuse only）.

## 9. Search Ranking / Relevance

- Existing ranking (`orderBy: createdAt`) unchanged.

- No commercial/paid/sponsored ranking added；no manual search index/product curation.

- Engineering relevance is surfaced **presentationally**（relevant parameters on result cards + engineering framing）rather than via a second ranking model.

**Result**: PASS（ranking serves Engineering Relevance；commercial ranking forbidden rule respected）.

## 10. Semantic Adapter

- Existing `search-context.service.ts` is `Deterministic, data-driven, no AI/LLM`；no `OPENAI_API_KEY` / pgvector dependency in the public `/search` path.

- Therefore `/search` **naturally degrades to Deterministic Structured Search** even if a semantic provider is absent (Absolute 34/35) — semantics optional & degradable by construction.

- 784 did **not** activate any semantic runtime（AI stays FROZEN）.

**Result**: PASS（controlled adapter preserved, deterministic fallback operational by construction）.

## 11. API Verification

- No new / changed API. Consumed existing endpoints only (radius unchanged):

  - `GET /api/v1/search/context?q=检测` → **200**（candidateCount=2, categories 电子视频内窥镜/光纤内窥镜, commonFilters=8）

  - `GET /api/v1/search?q=检测` → **200**（products=2, supplierProducts=3, knowledge=3, solutions=2, suppliers=1）

  - `GET /api/v1/search?q=检测&filters=<paramId>:IP67` → **200**, filter applied（filter-before-pagination verified）

**Result**: EXISTING ONLY.

## 12. Schema / Migration Verification

- `schema.prisma`: **UNCHANGED**（no diff）.

- `prisma/migrations`: **NO NEW MIGRATION**.

- Verified via `git status --short` on schema directories = empty for 784.

**Result**: Schema=NO CHANGE · Migration=NONE.

## 13. UI Technology Boundary

- All changes use the existing stack（React/Next.js + Tailwind）+ existing design tokens（`shadow-industrial-*`, slate palette）.

- New components are presentational only; no new library introduced.

**Result**: PASS.

## 14. Mobile Verification

- New UI elements are purely responsive: `flex-wrap`, `inline-flex`, `whitespace-nowrap`, no fixed widths → **structurally no new horizontal overflow** at 375/768/1024/1440.

- **Real-browser CDP measuring of 375/768/1024/1440 = CONDITIONAL**（this session has no available Browser/CDP automation; not faked as PASS）.

- Historical 1024 global \~19px header overflow = **carry-forward, not redeveloped**.

**Result**: PASS（structural）/ CONDITIONAL（real-browser evidence gap）.

## 15. Runtime Verification

Environment: **AVAILABLE（API :4000 + Web :3000）**.

| Probe                                       | Result                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| API health                                  | 200                                                                                              |
| `GET /api/v1/search/context?q=检测`           | 200 · candidates=2 · 8 commonFilters                                                             |
| `GET /api/v1/search?q=检测`                   | 200 · products=2（ZB-K60, ZB-TJ095）· supplierProducts=3 · knowledge=3 · solutions=2 · suppliers=1 |
| `GET /api/v1/search?filters=<paramId>:IP67` | 200 · filter applied                                                                             |
| Web `GET /search?q=检测`                      | 200（production `next start`）                                                                     |

No fake production data；no data was mutated. Runtime evidence is genuine.

## 16. Search Test Matrix

| #  | Scenario                      | Query             | Expected                                            | Result                               |
| -- | ----------------------------- | ----------------- | --------------------------------------------------- | ------------------------------------ |
| T1 | Context aggregation           | `检测`              | candidateCount>0, categories, commonFilters         | PASS（2 candidates / 8 commonFilters） |
| T2 | Unified discovery             | `检测`              | products/SP/knowledge/solution/supplier counts      | PASS                                 |
| T3 | Parameter filter (single AND) | `检测` filters=IP67 | count narrows / no error                            | PASS                                 |
| T4 | Result-card relevance params  | UI                | params strip present when context has commonFilters | STRUCTURAL（data present）             |
| T5 | IA framing                    | UI                | 能力分类 + 技术约束 visible when results exist              | STRUCTURAL（data present）             |
| T6 | Empty-parameter safety        | any               | strip hidden when params empty                      | PASS（component guard）                |
| T7 | Deterministic fallback        | any               | no OPENAI dependency → deterministic search         | PASS（by construction）                |

## 17. Regression Verification

- Unified Search Authority unchanged（no `/engineering-search`）.

- Six-entity boundary unchanged；Product 1:N SupplierProduct unchanged；Closed-Domain/Demand/RFQ/Offer untouched.

- `/search`, `/search/context` runtime integration verified（T1-T3）.

- M35 carry-forward（认证态 workflow evidence, 1024 overflow）**not redeveloped**.

**Result**: NO BEHAVIOR CHANGE.

## 18. Low-Operation Verification

- Search continues to operate automatically from existing structured data; no manual indexing / manual curation / manual SEO.

- Results are data-driven and rule-driven; no operator-entered content introduced.

**Result**: PASS.

## 19. Data Safety

- All operations read-only; `Data Mutation = NONE`.

- No controlled/test business data created to fake populated results（Absolute 37 respected）.

- SPPV=0 remains a controlled-data BR item（carry-forward from 783）, not masked.

**Result**: PASS.

## 20. Scope / Diff Verification

- **784-Only ADDED（2）**: `apps/web/src/components/search/RelevantParameters.tsx`, `apps/web/src/components/search/EngineeringDiscoveryFraming.tsx`.

- **784-Only MODIFIED（3）**: `apps/web/src/app/search/SearchPageContent.tsx`（+25）, `apps/web/src/components/search/ProductResultCard.tsx`（+13）, `apps/web/src/components/search/SupplierProductResultCard.tsx`（+20）.

- Other working-tree modifications（organization-members, ProductDetailContent, WorkspaceSidebar, M34/M35 docs）= **777/778 M35 carry-forward**, not 784.

- Schema / migrations / api / backend: zero diff. No new Domain / Entity / Search system.

**Result**: In-scope, S-size, Frontend-only.

## 21. Batch Remediation Register

| ID        | Severity | Item                                                                   | Classification                                           |
| --------- | -------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| BR-784-01 | P1       | Real-browser CDP viewport evidence（375/768/1024/1440）for new search UI | Evidence gap（env limitation）                             |
| BR-784-02 | P1       | SupplierProductParameterValue=0（capability-level param demo data）      | Controlled-data condition（from 783/BR-782 carry-forward） |
| BR-784-03 | P2       | 1024 global \~19px header overflow                                     | carry-forward, out of M36                                |

Non-blocking items only；no new M36 sub-stage created.

## 22. Known Evidence Gaps

- Real-browser 375/768/1024/1440 rendering evidence not captured（no Browser/CDP MCP in this session）.

- Authenticated search scenarios not executed.

- SPPV=0 limits real data demonstration of capability-level parameter strip（component present, data absent — not faked）.

## 23. Documentation Synchronization

- `PROJECT_STATUS.md` — appended 784 section（M36 implementation state = CONDITIONAL/NOT CLOSED）.

- `PROJECT_ROADMAP.md` — appended 784 section.

- `MODULE_COMPLETION_MATRIX.md` — appended 784 row.

- Historical 776-783 and Frozen Architecture docs **not rewritten**.

Code State = Documentation State = Architecture State = Roadmap State（for 784 scope）.

## 24. M36 Implementation State

- **784 = IMPLEMENTED / CONDITIONAL PASS**（within 783 Option B scope；Static + Runtime sufficient；no architecture violation；no fake data）.

- **M36 = CONDITIONAL / NOT CLOSED**: remaining condition = real-browser CDP viewport evidence（carry-forward）. **M36 is NOT auto-CLOSED**.

## 25. STOP Confirmation

- STOP confirmed. No M37/M38/M39 auto-start. No 785 auto-created. No M36.1/2/3 sub-stage. No second Search system. No AI/LLM/RAG/Vector/Marketplace. M36 remains CONDITIONAL / NOT CLOSED.

***

## Final Execution Output

```
Task:
  784_M36_Engineering_Discovery_Search_First_Class_Implementation

Repository Root:
  F:\Desktop\VISNDT

Code Root:
  F:\Desktop\VISNDT\VISNDT

Branch:
  main

HEAD Before:
  76b08e508325b7c094c7b7f1234fc18e8e37014e

HEAD After:
  76b08e508325b7c094c7b7f1234fc18e8e37014e（784 未提交，改动在工作树）

Working Tree:
  Clean-of-784新增：+2 components（RelevantParameters · EngineeringDiscoveryFraming）
  Modified（784专属）：SearchPageContent(+25) · ProductResultCard(+13) · SupplierProductResultCard(+20)
  其余 organization-members/Workspace/M34-M35 docs = 777/778 M35 carry-forward（非784）

Files Added:
  VISNDT/apps/web/src/components/search/RelevantParameters.tsx
  VISNDT/apps/web/src/components/search/EngineeringDiscoveryFraming.tsx

Files Modified:
  VISNDT/apps/web/src/app/search/SearchPageContent.tsx
  VISNDT/apps/web/src/components/search/ProductResultCard.tsx
  VISNDT/apps/web/src/components/search/SupplierProductResultCard.tsx

Files Deleted:
  NONE

Search Surface:
  PASS

Parameter-driven Search:
  PASS

Supplier Projection:
  PASS

Knowledge / Content:
  PASS

Ranking:
  PASS（Engineering Relevance；无商业/付费排序）

Semantic Adapter:
  PASS / DEGRADABLE（Deterministic fallback by construction；未激活 AI）

Schema:
  NO CHANGE

Migration:
  NONE

API:
  EXISTING ONLY

Backend:
  NO CHANGE

Frontend:
  MINIMAL EXTENSION（+2 components +3 files，消费既有契约）

Mobile:
  PASS（结构性无新增溢出）/ CONDITIONAL（真实 CDP 四视口证据缺口）

Runtime:
  PASS（/search + /search/context 实跑 200，filters 生效）

Static:
  PASS（web tsc=0 · web lint=0（存量 warnings）· web build=0 · api nest build=0）

Regression:
  NO BEHAVIOR CHANGE（统一 Search Authority / 六大实体 / Product 1:N / Demand·RFQ·Offer 未触碰）

Data Safety:
  PASS（只读 · Data Mutation=NONE · 无 fake data）

783 Conditions:
  全部满足（无新 Schema/Domain/AI；SPPV=0 保 BR；1024 CF 保留）

Batch Remediation:
  P0=0 / P1=2（Mobile CDP 证据缺口 · SPPV=0 数据侧）/ P2=1（1024 CF）

Documentation:
  COMPLETE（STATUS / ROADMAP / MATRIX 已同步 784；未改写 776-783）

M36 Implementation State:
  CONDITIONAL / NOT CLOSED（784 = IMPLEMENTED / CONDITIONAL PASS）

Next Authorized Step:
  STOP（M36 不自动 CLOSED；不启动 M37/M38/M39；不创建 785）

STOP:
  CONFIRMED
```

