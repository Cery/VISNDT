# 790 — M38 Unified Discovery, Frontend Platformization & Multi-surface Discoverability — Authorization Gate Report

## 1. Task Identity

- **Task**: 790_M38_Unified_Discovery_Frontend_Platformization_And_Multi_Surface_Discoverability_Authorization_Gate
- **性质**: M38 独立授权门（READ-ONLY · VERIFY · RECONCILE · PLAN · FREEZE · DOCUMENT · STOP）
- **权限模式**: READ-ONLY / NON-IMPLEMENTATION / 非 M38 实施 / 非 M38.x / 非平行 Stream
- **Change Gate**: Schema=NO · Migration=NONE · API=NO · Backend=NO · Frontend=NO · Data Mutation=NONE
- **本任务无设计前提 / 结论不以预设为导向**：最终授权判定完全依据实际代码 / 路由 / 元数据 / Schema / Runtime 证据。

## 2. Repository & Git Baseline

- **Repository Root**: `F:\Desktop\VISNDT`
- **Code Root**: `F:\Desktop\VISNDT\VISNDT`
- **Branch**: `main`
- **HEAD**: `76b08e508325b7c094c7b7f1234fc18e8e37014e`
- **Working Tree**: 与 789 一致——786/787/788/789 及历史 M34-M37 改动全部保留；**未 reset/clean/checkout./restore/stash/rebase/merge/delete/overwrite**；790 未产生生产代码改动，仅追加文档（STATUS/ROADMAP/MATRIX/本报告）。
- **目录核验**: `VISNDT/apps/web` · `VISNDT/apps/api` · `VISNDT/database/prisma` · `docs` 全部存在。

## 3. Previous State / 前序状态对账

| 阶段 | 状态 | 证据 |
|---|---|---|
| M35 | **CONDITIONAL / NOT CLOSED** | 781/782/785 决策保持；780-782 复验 |
| M36 | **CLOSED** | 785=IMPLEMENTED / VERIFIED |
| M37 | **CONDITIONAL**（789 非阻断 carry-forward 收口） | 786/787/788/789 |
| M38 | **NOT AUTHORIZED / NOT STARTED** | 789 Route Gate = AUTHORIZABLE（≠ AUTHORIZED） |

未改写 785-789 历史报告、Frozen ADR、M34 Contract 正文。

## 4. M37 Reconciliation Rule（从 790 起固定 Route Gate 规则）

- **NON-BLOCKING ≠ 必须在当前阶段全部清零；CLOSED ≠ 所有未来优化全部完成**。
- 核心完成条件 + 无 P0 + 无架构矛盾 + 无安全/数据完整性/授权阻断 + 固定路线完整 = 可带 NON-BLOCKING carry-forward 继续路线。
- M37=CONDITIONAL 且剩余问题全部 NON-BLOCKING → 路线可继续进入 M38 授权门。
- 790 不重新开发 M37、不重做 M35/M36。

## 5. M38 North Star

**统一工业检测能力发现前端**：
- 统一信息入口 + 统一内容/产品/方案/知识表面 + 统一外部可发现结构 + 低运营可持续发现机制。
- **不是** SEO Project / Homepage Redesign / AI Search Project。

## 6. Frontend Current State（以 Code 为准）

| 表面 | 实际现状（代码/路由证据） |
|---|---|
| 平台壳 | `apps/web/src/app/layout.tsx`：PublicHeader + PublicFooter + Providers + analytics + PWA + toast |
| Header | DISCOVER 主线 NAV（Search/Category/Product/Supplier-via-search/Solution/Knowledge）+ GlobalSearchBar（桌面 + 移动菜单）|
| Footer | 产品/解决方案/平台/支持/联系 |
| Home | Hero + Category + FeaturedProducts + Solutions + PlatformFlow + Knowledge + CapabilityProvider + InquiryCTA + JSON-LD（Organization/WebSite/SearchAction）|
| Product Detail | Product + Breadcrumb JSON-LD + 动态 SEO（canonical/OG/twitter）+ 确定性 related knowledge/products/solutions + Capability Discovery（supplierModels）+ M37 参数注释 |
| Search | 统一 `/search`（SearchPageContent，client）+ Header 全局入口（M36 已 CLOSED）|
| Solution | ContentListLayout（ContentType.SOLUTION）+ ContentCommercialCTA |
| Knowledge | `/knowledge-base`（canonical 0.9）+ EngineeringDiscoveryNav + 域/条目；**存在 `/knowledge` 与 `/knowledge-base` 双路由（header 链 /knowledge · sitemap 权重 /knowledge-base）→ M38 需 canonical 归并** |
| Insight | 已退役 → `/knowledge-base` 重定向（788/789）；禁止恢复 /insights Library/Detail/Category/Search |
| Business | Content-managed ARTICLE + 静态 fallback + ContentCommercialCTA（submit-inquiry）；**非** Generic B2B Marketplace/Storefront/Transaction（不引入 Order/Cart/Payment/Checkout/Marketplace/Seller Store）|
| 其他公开面 | About / Suppliers 公开档案 / supplier-models / categories / compare 均在 |

## 7. Frontend Target State（Controlled Convergence，非 Global Rewrite）

- **Shared IA + Shared Navigation + Shared Search Entry + Shared Card + Shared Metadata + Shared Cross-link Pattern + Existing Components + Existing Routes + Existing Data Models**。
- **重点是 Convergence，不是 Rebuild**。

## 8. 分项表面（§20 要求）

### 8.1 Home
- Current：平台化信息表达雏形（Hero/Category/Featured/Solutions/PlatformFlow/Knowledge/CapabilityProvider/CTA + JSON-LD）。
- Strategy：**CONTROLLED EXTENSION**（B 首页平台化信息表达）——复用既有 sections，统一信息层级与 discoverability 表达；不 Full Homepage Rewrite。

### 8.2 Product Center / Product Detail
- Current：Product Center + 确定性 related + JSON-LD + Capability Discovery（supplierModels）+ 参数注释。
- Strategy：**CONTROLLED EXTENSION**（C 跨面发现增强）——复用既有路由/卡片/详情/related*；统一 Product/Category JSON-LD 覆盖。

### 8.3 Search
- Current：M36 CLOSED，统一 `/search` 一级表面。
- Strategy：**REUSE + CONTROLLED EXTENSION**（D Search 全站一级平台入口统一呈现）——复用统一 Search Authority；仅收敛 Header 入口与跨面引接。

### 8.4 Solution
- Current：ContentListLayout + ContentCommercialCTA。
- Strategy：**CONTROLLED EXTENSION**（E 跨导航）——复用 Content Authority；纳入平台 JSON-LD 结构化数据。

### 8.5 Knowledge
- Current：`/knowledge-base` canonical + EngineeringDiscoveryNav；存在 /knowledge 双路由。
- Strategy：**CONTROLLED EXTENSION**（K/归一）——`/knowledge`↔`/knowledge-base` canonical 归并（非新建系统）。

### 8.6 Business Cooperation
- Current：Content-managed ARTICLE + 静态 fallback + CTA（submit-inquiry）。
- Strategy：**CONTROLLED EXTENSION**（G Business 平台角色收敛）——保持非 marketplace 定位；纳入平台导航/元数据。

### 8.7 Header / Footer / Navigation
- Current：DISCOVER 主线 + GlobalSearchBar + EngineeringDiscoveryNav。
- Strategy：**CONTROLLED EXTENSION / REUSE**（F 最小平台化调整）——不 Global Header/Admin Rewrite。

### 8.8 Cross-surface IA / Cross-navigation
- Current：跨面导航（Knowledge/Solution/Product/Search）+ 确定性交叉链接存在。
- Strategy：**REUSE + CONTROLLED EXTENSION**（A/E/M）——统一 Cross-link Pattern 自动驱动。

### 8.9 Mobile
- Current：375/768/1440 = 0 overflow PASS；1024 = 19px 全局既有 carry-forward（非 M38 新增）。
- Strategy：**CONTROLLED EXTENSION**（H Mobile First-Class 关键路径）——不 Global Mobile Rewrite。

### 8.10 External Discoverability / External Search
- Current：sitemap（static+products+knowledge-base entries+content，排除 INSIGHT per 788 + /search）；robots（allow / · disallow /api/+ /search · sitemap 指向）。
- Strategy：**CONTROLLED EXTENSION**（I/J）Google/Bing indexability + sitemap 完备化；高价值面 indexable 边界已备、JSON-LD 覆盖待统一。

### 8.11 AI/LLM Discoverability
- Current：JSON-LD + 确定性相关关系 + 清晰 Entity/Canonical 身份 + 机器可读关系导出（Semantic HTML/Structured Metadata）基础已备。
- Strategy：**CONTROLLED EXTENSION**（L）AI/LLM Discoverability 基础结构；**禁止 RAG/LLM Platform/AI Agent/AI Search Engine/Vector/Embedding/AI Content Generator**。

## 9. Discoverability 对象边界（§7-§9）

- **不建** SEO / AI / LLM / Discovery Entity（Insight Entity 已冻结退役）。
- 仅复用 Existing Content / Product / Knowledge / Solution / Category / Supplier / Metadata / Sitemap / JSON-LD。
- Application / Detection Object = SEMANTIC / DERIVED，M38 不为其建 Object/App Entity。

## 10. Multi-surface 矩阵（Code/Route/Metadata/Schema/Runtime 证据）

| 表面 | On-site Discoverability | External Search (Google/Bing) | AI/LLM |
|---|---|---|---|
| Home | 有（+JSON-LD）| 有（static in sitemap）| JSON-LD |
| Product Center | 有 | 有 | 待统一 |
| Product Detail | 有（确定性命中 related）| 有 | Product JSON-LD |
| Category | 有 | 有（indexable）| 待统一 |
| Search | 有（统一 /search Authority）| /search 不收录（robots disallow /search）| 结构基础 |
| Solution | 有 | 有 | 待统一 |
| Knowledge | 有（/knowledge-base canonical）| 有 | 待统一 |
| Supplier | 有（公开档案）| 有 | 待统一 |
| Business | 有 | 有 | 待统一 |
| App/Detection Context | SEMANTIC/DERIVED | 无独立 landing | 结构基础 |

## 11. Supplier Controlled Publication Alignment（§19）

- SupplierProduct → Platform Validation → Platform Review → **PUBLISH**。
- 不因 External Discoverability 将 **Supplier draft** 直接暴露到 Google/Bing/AI/Public Search。
- 公开可发现边界继续由 **PUBLISHED + Platform Governance** 控制（复用 M35 Publication Governance）。

## 12. Low-operation（§18/§26）

- M38 不负责大量人工内容生产。
- Template/Metadata/Canonical/Tag/Structured Relationship/Sitemap/Structured Data/Indexability/Cross-links = **Automatic · Rule-driven · Reusable · Supplier Self-service · Minimal Human Review**。
- 禁止：Manual SEO per page / Manual Link Maintenance / Manual Sitemap Maintenance / Manual Search Indexing / Manual AI Metadata Entry / Manual Product Recreation。

## 13. Reuse / Controlled Extension / New / Defer 分类（§20/§21/§22）

| 项 | 分类 |
|---|---|
| 既有路由/组件/数据模型 | REUSE |
| sitemap / robots / JSON-LD / seo-config | REUSE（基础）|
| GlobalSearchBar / EngineeringDiscoveryNav / Related* | REUSE |
| 首页平台化信息表达 | CONTROLLED EXTENSION |
| /knowledge↔knowledge-base canonical 归并 | CONTROLLED EXTENSION |
| 高价值面 JSON-LD 统一（Product/Category/Solution/Knowledge/Supplier）| CONTROLLED EXTENSION |
| 确定性跨面交叉链接 | CONTROLLED EXTENSION |
| 移动关键路径 | CONTROLLED EXTENSION |
| Business 平台角色收敛 | CONTROLLED EXTENSION |
| AI 友好结构化元数据 / sitemap 完备化 | CONTROLLED EXTENSION |
| 1024 全局 carry-forward | DEFER |
| 海量数据 | DEFER |
| workspace/RFQ/Offer/Inquiry（M39）| DEFER |
| 性能/UX 深度优化 | DEFER |
| **FUNDAMENTAL CHANGE** | **0**（页面多/视觉不一/组件重复/移动不一/SEO 不完善/导航较弱 ≠ 重构前端）|

任何出现 `L + Major Rewrite + New Domain + New Architecture` 的项 → STOP → Fundamental Change Candidate → 独立 ADR。**当前 0 项触发**，不继续自行设计实施。

## 14. Fundamental Change Gate（§27）

- 默认 Fundamental Change Candidates = **0**。
- 未出现任何证据表明 Existing Frontend Architecture 无法通过 `Reuse + Controlled Extension` 实现 M38 核心目标。
- 输出：**Fundamental Change Candidates = 0**。

## 15. Data Scale / Content Scale（§29）

| 数据项 | 实测 |
|---|---|
| Product | 4 |
| ProductCategory | 14 |
| KnowledgeEntry | 6 |
| Solution | 2 |
| SupplierProduct | ≈3 |
| Content | 有限 |
- **Architecture Ready / Data Coverage Limited**；足以支撑 M38 模式验证。
- **禁止为 M38 创建 fake data / 批量灌入虚构产品·供应商·知识·技术文档**。

## 16. Runtime Verification（§30/§36）

- **Web :3000 = 200** / **API :4000 health = 200**（本只读门实测确认）。
- 790 为 READ-ONLY Gate：仅验证 existing environment/routes/metadata/sitemap/structured data/public pages。
- **不实施** 代码/数据库/配置/业务数据修改。

## 17. Implementation Readiness（§28，以证据判定，不使用"理论上/应该/看起来可以"）

| 维度 | 判定 |
|---|---|
| Architecture | **READY** |
| Frontend | **READY** |
| Backend/API | **READY**（重用既有契约）|
| Data | **READY WITH CONDITIONS**（覆盖有限，非阻塞）|
| Runtime | **READY** |
| Mobile | **READY WITH CONDITIONS**（1024 carry-forward，非 M38 新增）|
| Discoverability | **READY WITH CONDITIONS**（JSON-LD 覆盖待扩，非阻塞）|
| Low-operation | **READY** |
| Documentation | **READY** |

无 P0 / 无 Architecture Contradiction / 无 Security / 无 Data Integrity / 无 Authorization 阻断。

## 18. Batch Remediation（§24/§33/BR-790）

- **BR-790-01**: `/knowledge` 与 `/knowledge-base` 双路由 canonical 归并 → P2 / NON-BLOCKING / Record。
- **BR-790-02**: 高价值面 JSON-LD 覆盖待扩 → P2 / NON-BLOCKING / Batch。
- **BR-790-03**: 1024 全局 19px carry-forward（非 M38 新增）→ P2 / NON-BLOCKING / Defer。
- **BR-790-04**: 数据覆盖有限（4/14/6/2）→ P2 / NON-BLOCKING / 禁止 fake data。
- **BR-790-05**: 认证态 E2E 凭证缺口 → P2 / NON-BLOCKING / carry-forward。

无 P0 / P1；不产生 Issue → New M38 任务；不使用 M38.x。

## 19. M38 Scope Freeze = LOCKED（A-N）

- A 全站用户前端信息架构收敛
- B 首页平台化信息表达
- C Product Center / Product Detail 跨面发现增强
- D Search 作为全站一级平台入口的统一呈现
- E Solution / Knowledge / Product / Search Cross-navigation
- F Global Header / Footer / Navigation 的最小平台化调整
- G Business Cooperation 页面平台角色收敛
- H Mobile First-Class 关键路径优化
- I External Search Discoverability
- J Google/Bing indexability
- K Sitemap / Canonical / Metadata / Structured Data
- L AI/LLM Discoverability 基础结构
- M Existing structured relationship 自动化发现面
- N Runtime / Browser / Mobile / Discoverability verification

## 20. M38 Explicit Out-of-Scope（绝对禁止）

New Frontend Application / New Search Engine / New Search Architecture / New CMS / New Knowledge System / New Product System / New Supplier System / New Solution Domain / New Insight Entity / New SEO Entity / New AI Entity / New Discovery Domain / New Schema / New Migration / New Commerce（Marketplace Storefront Order Payment Cart Checkout）/ RAG Platform / LLM Platform / AI Agent / Vector Platform / Embedding Platform / Global Backend Rewrite / Global Database Rewrite / Global Mobile Rewrite / Homepage Full Rewrite / Full Product Rewrite / Full Content Rewrite。

以及：发现问题 → 新增 M38.x **禁止**；继续使用 Issue Register → Priority → Batch Remediation。

## 21. Benchmark Boundary（§25）

- 仅作为 **Reference**：GlobalSpec / DirectIndustry / ThomasNet。
- 允许借鉴：Engineering Discovery / Product Discovery / Supplier Discovery / Technical Information / Discoverability。
- 禁止复制：Entity Model / Business Model / Commercial Model / Ranking Model / IA Structure / Marketplace Model。
- 必须保持：**Vertical NDT > Generic B2B**。

## 22. Fixed Route Protection（§32）

- 固定路线：**M35 → M36 → M37 → M38 → M39 → Final Assessment**。
- 禁止产生 M38.1/M38.2/M38.3 / M38-SEO / M38-Mobile / M38-Frontend / M38-AI / M38-Home / M38-Search。

## 23. 文档同步

仅追加 790 M38 Authorization Gate / M38 Scope / Frontend Platformization Contract / Discoverability Contract / Implementation Readiness；未重写 775-789 与 Frozen Architecture。

- [PROJECT_STATUS.md](file:///f:/Desktop/VISNDT/docs/project-management/PROJECT_STATUS.md) — M38 Authorization Gate 段落已追加
- [PROJECT_ROADMAP.md](file:///f:/Desktop/VISNDT/docs/project-management/PROJECT_ROADMAP.md) — 790 行已追加
- [MODULE_COMPLETION_MATRIX.md](file:///f:/Desktop/VISNDT/docs/project-management/MODULE_COMPLETION_MATRIX.md) — 790 行已追加

Code State = Documentation State = Architecture State = Roadmap State。

## 24. Authorization Decision（§34，结论基于实际证据，不予预设）

- 证据：现有 Frontend 已有平台化收敛雏形 + 统一 /search + Discoverability 基础（sitemap/robots/JSON-LD/canonical）+ 确定性跨面关系 + Mobile 375/768/1440 PASS + 无 P0 + 无 Fundamental Change。
- 条件：全部 NON-BLOCKING（/knowledge canonical 归并 · JSON-LD 覆盖待扩 · 1024 carry-forward · 数据覆盖有限 · 认证态 E2E 凭证缺口）。
- **决定 = OPTION B · M38 = AUTHORIZABLE WITH CONDITIONS**。

> **AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED ≠ CLOSED。** 本任务仅输出授权判定；不自动实施 M38。

## 25. Expected M38 Scope Freeze / Final Output

- M38 = AUTHORIZABLE → 锁定 Frontend Platformization + Unified Discovery Surface + Multi-surface Discoverability + Mobile First-Class + External Search + AI/LLM Discoverability。
- 保持 Existing Architecture / Existing Models / Existing Routes / Existing APIs / Existing Search Authority / Existing Content Authority。

---

## Final Execution Output

```
Task:
790_M38_Unified_Discovery_Frontend_Platformization_And_Multi_Surface_Discoverability_Authorization_Gate

Repository Root:
F:\Desktop\VISNDT

Code Root:
F:\Desktop\VISNDT\VISNDT

Branch:
main

HEAD:
76b08e508325b7c094c7b7f1234fc18e8e37014e

Working Tree:
VERIFIED（789 一致，改动保留，未 reset/clean/overwrite）

M35:
CONDITIONAL / NOT CLOSED

M36:
CLOSED

M37:
CONDITIONAL（789 NON-BLOCKING carry-forward）

M38:
NOT AUTHORIZED / NOT STARTED

Frontend Platformization:
CONTROLLED CONVERGENCE 计划（Shared IA/Nav/Search/Card/Metadata/Cross-link + Existing Assets）

Home:
平台化信息表达雏形 / CONTROLLED EXTENSION（B）

Product Center:
确定性 related + JSON-LD / CONTROLLED EXTENSION（C）

Search:
M36 CLOSED / M38 Surface Integration（D，统一 /search 一级入口）

Solution:
ContentListLayout / CONTROLLED EXTENSION（E）

Knowledge:
/knowledge-base canonical / CONTROLLED EXTENSION（K，/knowledge 归并）

Business Cooperation:
Content-managed ARTICLE 非 marketplace / CONTROLLED EXTENSION（G）

Navigation:
DISCOVER 主线 + GlobalSearchBar / REUSE + CONTROLLED EXTENSION（F）

Cross-surface IA:
既有跨面导航 + 确定性 cross-link / REUSE + CONTROLLED EXTENSION（A/E/M）

Mobile:
375/768/1440=PASS · 1024=19px 全局 carry-forward / CONTROLLED EXTENSION（H）

External Discoverability:
sitemap/robots/canonical 基础 STRONG，覆盖待扩 / CONTROLLED EXTENSION（I/J/K）

AI/LLM Discoverability:
JSON-LD + 确定性关系结构基础 / CONTROLLED EXTENSION（L，非 AI 平台）

Low-operation:
RETAINED（Automatic/Rule-driven/Reusable/Supplier self-service/Minimal review）

Data Scale:
Architecture Ready / Data Coverage Limited（Product=4·Category=14·Knowledge=6·Solution=2）

Runtime:
VERIFIED（只读）· Web:3000=200 · API:4000 health=200

Architecture:
PASS（无漂移、无新 Domain/Entity/Schema/Authority）

Implementation Readiness:
READY（Architecture/Frontend/Backend-API/Runtime/Low-op/Docs）+
READY WITH CONDITIONS（Data/Mobile/Discoverability）

Reuse:
既有路由/组件/数据模型/sitemap/robots/JSON-LD/seo-config/GlobalSearchBar/EngineeringDiscoveryNav/Related*

Controlled Extension:
首页平台化·/knowledge canonical 归并·JSON-LD 统一·跨面 cross-link·移动关键路径·Business 收敛·sitemap 完备化·AI 友好元数据

Fundamental Change:
Candidates = 0

Batch Remediation:
BR-790-01..05（全 P2/NON-BLOCKING，Record/Batch/Defer，无 Issue→New M38 任务）

M38 Scope:
LOCKED（A-N）

M38 Authorization:
OPTION B · AUTHORIZABLE WITH CONDITIONS
（AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED ≠ CLOSED）

Documentation:
COMPLETE（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX 已追加 790；未改写 775-789 与 Frozen Architecture）

Roadmap:
M35→M36(CLOSED)→M37(CONDITIONAL)→M38(AUTHORIZABLE WITH CONDITIONS·NOT STARTED)→M39→Final

Next Authorized Step:
M38 Implementation 须后续独立「M38 Implementation Authorization」任务，且仅在 A-N 冻结范围内 Reuse + Controlled Extension

STOP:
CONFIRMED
```

---

## 最终固定原则（本门复核）

- VISNDT = Vertical NDT Platform
- Product = Capability / Product Discovery Core
- Search = Unified Engineering Discovery Authority（M36 CLOSED）
- Knowledge = Public Engineering Information Asset
- Insight = Contextual Engineering Annotation（已冻结）
- Solution = Engineering Solution Asset
- Content = Unified Content Infrastructure
- Supplier = Capability Provider
- SupplierProduct = Supplier-owned Commercial Product（PUBLISHED + Governance 控制公开边界）
- Mobile = First-Class Platform Surface
- External Discoverability = M38
- AI/LLM Discoverability = M38
- Workflow / Demand / Match / RFQ / Offer / Inquiry = M39

实施约束复核：
- 平台化 ≠ 重做网站
- 统一 ≠ 新建系统
- SEO ≠ SEO 子系统
- AI Discoverability ≠ AI Platform
- Mobile First-Class ≠ Global Mobile Rewrite
- 发现问题 ≠ 创建新阶段
- 覆盖不足 ≠ 架构不足
- 数据少 ≠ 新建数据系统
- Benchmark ≠ Architecture Authority
- **Reuse > Controlled Extension > Fundamental Change**

**本任务完成后必须 STOP。不得自动实施 M38。**