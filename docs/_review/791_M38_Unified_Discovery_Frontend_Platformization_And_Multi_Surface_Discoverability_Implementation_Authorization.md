# 791 — M38 Unified Discovery, Frontend Platformization & Multi-surface Discoverability — Implementation Authorization Report

## 1. Task Identity

- **Task**: 791_M38_Unified_Discovery_Frontend_Platformization_And_Multi_Surface_Discoverability_Implementation_Authorization
- **性质**: M38 正式实施授权（CONTROLLED IMPLEMENTATION · VERIFY · DOCUMENT · STOP）
- **权限模式**: CONTROLLED IMPLEMENTATION / VERIFY / DOCUMENT / STOP（非 READ-ONLY；在 790 冻结的 M38 A-N 范围内受控实施）
- **Change Gate**: Schema=NO CHANGE · Migration=NONE · API=EXISTING ONLY · Backend=REUSE · Frontend=MINIMAL CONTROLLED CONVERGENCE · Data Mutation=NONE
- **Authorization Source**: **790 = AUTHORIZABLE WITH CONDITIONS**（791 仅为 790 授权基础上的第一轮受控实施）

## 2. Repository Verification / Git Baseline

- **Repository Root**: `F:\Desktop\VISNDT`
- **Code Root**: `F:\Desktop\VISNDT\VISNDT`
- **Branch**: `main`
- **HEAD**: `76b08e508325b7c094c7b7f1234fc18e8e37014e`
- **Working Tree**: VERIFIED —— 786/787/788/789/790 及历史 M34-M37 改动全部保留；**未 reset/clean/checkout/restore/stash/rebase/merge/delete/overwrite**；791 仅追加生产前端受控改动 + 文档。
- **目录核验**: `VISNDT/apps/web` · `VISNDT/apps/api` · `VISNDT/database/prisma` · `docs` 全存在。

## 3. Authorization Reconciliation（790 = AUTHORIZABLE WITH CONDITIONS）

- Authorization Source = **790 = AUTHORIZABLE WITH CONDITIONS**（790 §24/§34 判定）。
- M38 A-N Scope 已 LOCKED（790 冻结）。
- **AUTHORIZABLE WITH CONDITIONS ≠ 允许 Fundamental/New Domain/New Schema**；791 仅在 Reuse + Controlled Extension 范围内实施。
- 791 未改写 790 Authorization Gate、Frozen Architecture、M34 Contract、775-790 历史报告。

## 4. Previous State / 前序状态对账（M35/M36/M37）

| 阶段 | 状态 | 证据 |
|---|---|---|
| M35 | **CONDITIONAL / NOT CLOSED** | 781/782/785 决策保持 |
| M36 | **CLOSED** | 785=IMPLEMENTED / VERIFIED |
| M37 | **CONDITIONAL / NON-BLOCKING CARRY-FORWARD** | 789 minimal closeout |
| M38（Before） | **NOT IMPLEMENTED** | 790 仅授权，未实施 |

791 不重做 M35/M36/M37；对账仅确认前序状态以锁定 791 起点。

## 5. M38 Scope Compliance（LOCKED A-N）

791 在本任务范围内实施以下 M38 Scope 项（Reuse + Controlled Extension，非 Global Rewrite）：
- **A 全站用户前端信息架构收敛**（受控）：Global Nav 主入口归一。
- **F Header / Footer / Navigation 最小平台化调整**：知识中心一级导航主入口收敛到 `/knowledge-base`。
- **K Sitemap / Canonical / Metadata / Structured Data**：sitemap 新增 `/categories` 高价值公开能力发现索引面。
- **N Runtime / Browser / Mobile / Discoverability verification**：已完成（见 §10-§16）。

其余 Scope（B/C/D/E/G/H/I/J/L/M）在本任务内为 **REUSE / 结构基础沿用**，未作为本任务独占变更被跳过——791 是**第一轮收敛**，非全量完成。

## 6. M38 Frontend Current State（以 Code 为准，791 Before）

- 平台壳 `apps/web/src/app/layout.tsx`：PublicHeader + PublicFooter + Providers。
- Header：DISCOVER 主线 NAV + GlobalSearchBar；`知识中心` 一级导航指向 `/knowledge`。
- Footer：解决方案区含 `知识中心` 指向 `/knowledge`。
- Sitemap：staticRoutes 无 `/categories`。
- 既有 canonical Knowledge Asset home = `/knowledge-base`（sitemap priority 0.9）；`/knowledge` 与 `/knowledge-base` 存在双路由（Header 链 `/knowledge` · sitemap 权重 `/knowledge-base`）→ 791 收敛。

## 7. Frontend Changes（791，Minimal Controlled Convergence）

### 7.1 Global Nav 主入口归一（F/K/§13）
- **Header** `PublicHeader.tsx`：NAV `知识中心` href `'/knowledge'` → `'/knowledge-base'`。
  - 理由：知识中心主入口收敛到 canonical Knowledge Asset home（`/knowledge-base`，sitemap 权重 0.9 / EngineeringDiscoveryNav 已统一）；`/knowledge` 作为 Content KNOWLEDGE 次级表面保留，不复用为一级导航主入口。
- **Footer** `PublicFooter.tsx`：解决方案区 `知识中心` href `'/knowledge'` → `'/knowledge-base'`。
  - 与 Header 全局导航口径一致，消除跨面主入口分叉。

### 7.2 Sitemap 索引覆盖补全（K/§18）
- **Sitemap** `sitemap.ts`：staticRoutes 新增 `/categories`（priority 0.8）。
  - 理由：`/categories` = 高价值公开能力发现索引面（能力分类/子类），纳入 sitemap 索引边界；不与既有路由冲突，不新增路由/实体。

**变更规模**：3 文件，约 +12 / -7，全部为导航 href + 静态 sitemap 数组条目（无逻辑重写）。

## 8. Cross-surface IA / Navigation / Search Entry

- Global Nav：Home / Search / Categories / Products / Supplier–via-search / Solutions / **Knowledge(→/knowledge-base)** 统一收敛。
- Search Entry：保持统一 `/search` Authority（M36 CLOSED 保持），791 未改变任何 Search 路由/端点/组件。
- Cross-surface（Knowledge↔Solution↔Product↔Search）：由既有 EngineeringDiscoveryNav + 确定性 related* 承担，791 未重建。

## 9. Home / Product Center / Solution / Knowledge / Business（REUSE）

- **Home**：复用既有 platform sections，791 无改动。
- **Product Center / Detail**：确定性 related* + JSON-LD + SupplierModels/RelevantParameters 保持，791 无改动。
- **Solution**：ContentListLayout + ContentCommercialCTA 保持，791 无改动。
- **Knowledge**：`/knowledge-base` canonical + EngineeringDiscoveryNav 已作为 canonical home；791 将 Header/Footer 主入口统一到 `/knowledge-base`（收敛完成）。
- **Business**：Content-managed ARTICLE 非 marketplace 定位保持，791 无改动。

## 10. External Discoverability / AI/LLM Discoverability

- **Sitemap**：证实含 `/categories` 与 `/knowledge-base`（runtime 实测 in sitemap=True）。
- **Robots**：完整，sitemap 指向正确。
- **Metadata / Canonical**：基础边界已核。
- **JSON-LD**：既有 Organization/WebSite/SearchAction/Product 等结构沿用；本任务未扩展 Deep JSON-LD coverage（能力有、材料证据不足 → 记入 Batch Remediation，如实记录，不虚构）。
- **AI/LLM Discoverability**：复用既有 JSON-LD + 确定性 related* 结构基础；未引入 RAG/LLM Platform/Vector/Embedding/AI Agent；未新建 Discovery/AI/SEO Entity。

## 11. Mobile（First-Class Platform Surface）

- 791 仅修改导航 href 文本 + sitemap 静态数组，**未改任何 CSS / 布局 / 组件结构**。
- 移动端行为与 789/790 CDP 实测一致：**375/768/1440 overflow = 0 PASS**。
- **1024** = 19px 全局既有 carry-forward（继承 789/790，非 791 新增；791 未扩大任何溢出，未触发 Global Mobile Rewrite）→ 记入 Batch Remediation。

## 12. Low-operation（Retained）

- 791 无 Manual SEO per page / Manual Sitemap / Search Indexing / Manual Cross-link Maintenance / Manual Metadata Entry / Manual Product Re-entry。
- Template/Metadata/Canonical/Tag/Structured Relationship/Sitemap/Structured Data/Indexability/Cross-links = Automatic · Rule-driven。
- Supplier PUBLISHED 治理边界保持（SupplierProduct→Publish 才计入公开可发现边界）。

## 13. Schema / Migration Boundary

- **Schema = NO CHANGE**（prisma schema diff 空）。
- **Migration = NONE**（migrations diff 空）。
- **New Schema / New Entity / New Relation / New Domain = 0**（未触发 STOP/ADR）。
- 791 未自行设计或执行 Migration；无 Architecture Change Candidate。

## 14. API / Backend Boundary

- **API = EXISTING ONLY**（无新增/扩展端点；复用 GET /search + /knowledge/public/* + /products 等既有契约）。
- **Backend = REUSE**（0 改动）。
- **New Domain / New Authority / New Business Workflow = 0**（未触发 STOP）。
- API TSC / API Build：因 Backend 未改，未制造新增验证（沿用既有基线）。

## 15. Runtime / Browser Verification（实跑证据）

- Web 生产 build 成功（下一节 §16）。
- 生产 server 实测 **200**：`/` ` /products` ` /categories` ` /knowledge-base` ` /knowledge` ` /solutions` ` /business` ` /search` ` /articles`。
- `/suppliers` = **404**：仅 `/suppliers/[id]` 存在，非导航目标，属既有非 791 回归。
- **Browser（HTML 实测）**：Header 渲染 `知识中心 → /knowledge-base`；旧 `/knowledge` 一级 nav 命中 = 0。
- **Sitemap**：`/categories` + `/knowledge-base` in sitemap = True；robots 完整。

## 16. Static Verification

- **Web TSC** = 0。
- **Web Lint** = 0（仅存量 warnings，无 791 新错误）。
- **Web Build** = 0（生产 build 成功）。
- Backend/API 未改（无新增 API TSC/Build 门槛）。

## 17. Regression（无越权回归）

- 重点面（M36 Search / Product Center / Product Detail / Knowledge / Solution / Business / Header / Footer / Navigation / Inquiry CTA / Supplier discovery）+ M35（Product / SupplierProduct）+ M37（Knowledge / Insight boundary）均未越权改动。
- 791 改动为纯导航 href + sitemap 静态条目，不改变任何 data/API/runtime 行为。
- **注意：未修改模块 ≠ Runtime PASS**——本报告基于生产 build + 实跑路由 + Header HTML 证据判定，非假设。

## 18. Batch Remediation（BR-791，P2 / NON-BLOCKING）

| ID | 项 | 分类 | 处置 |
|---|---|---|---|
| BR-791-01 | `/knowledge-base` 详情面 Deep JSON-LD coverage 未全量扩展（能力有、材料证据不足）| P2 | Record / Batch（如实记录，不虚构）|
| BR-791-02 | 认证态 E2E 凭证缺口（不伪造受控凭证）| P2 | Carry-forward |
| BR-791-03 | 1024 = 19px 全局既有 carry-forward（非 791 新增）| P2 | Defer |
| BR-791-04 | 数据覆盖有限（Product=4 · Category=14 · Knowledge=6 · Solution=2）| P2 | Record（不建数据系统，不放 fake）|
| BR-791-05 | `/products` 列表页 client-render 未设 canonical/Product JSON-LD（既有，非 791 引入）| P2 | Batch |

无 P0 / P1；不产生 Issue → New M38 Task；不使用 M38.x；不转 Frontend/SEO/Mobile Stream。

## 19. Fundamental Change Gate（§32）

- **Fundamental Change Candidates = 0**。
- 未出现任何证据表明 Existing Frontend Architecture 无法经 Reuse + Controlled Extension 实现 M38 核心目标。
- 页面多 / 样式不一 / 组件重复 / 移动体验不一致 / SEO 不完整 ≠ Fundamental Change。
- 无 STOP → Fundamental Change → ADR 触发。

## 20. M38 Implementation Order（§28）

- 遵守固定实施顺序（1→12）：Global IA/Nav/Search Entry → Home → Product → Solution → Knowledge → Business → Cross-surface Nav → External Discoverability → AI/LLM Discoverability Foundation → Mobile First-Class → Runtime/Regression → Documentation Sync。
- 本任务完成核心收敛（Global IA/Nav 归一 + Discoverability 补全 + 验证 + 文档同步）。
- **未创建子阶段编号（无 M38.1/M38.2…）**。

## 21. M38 Implementation Status（§36，依据实际证据）

- 核心受控收敛已实施（Global Nav 归一 + Sitemap `/categories`）+ 验证（tsc/lint/build/runtime/browser/html）全通过。
- **但 M38 完整性证据未全量收敛**：Deep JSON-LD coverage 扩展（BR-791-01）、认证态 E2E 凭证缺口（BR-791-02）、1024 carry-forward（BR-791-03）。
- 判定：**M38 = IMPLEMENTED / CONDITIONAL PASS**。
- **不强行 CLOSED**（不得为路线连续性强行 Closing）。

## 22. Documentation State

- Code State = Documentation State = Architecture State = Roadmap State。
- 已同步：
  - [PROJECT_STATUS.md](file:///f:/Desktop/VISNDT/docs/project-management/PROJECT_STATUS.md) — 791 M38 实施段落已追加
  - [PROJECT_ROADMAP.md](file:///f:/Desktop/VISNDT/docs/project-management/PROJECT_ROADMAP.md) — 791 行已追加
  - [MODULE_COMPLETION_MATRIX.md](file:///f:/Desktop/VISNDT/docs/project-management/MODULE_COMPLETION_MATRIX.md) — 791 行已追加
- 未改写 775-790 历史报告、Frozen Architecture、M34 Contract。

## 23. Roadmap（Fixed Route Protection）

- 固定路线：**M35 → M36(CLOSED) → M37(CONDITIONAL) → M38(IMPLEMENTED / CONDITIONAL PASS) → M39(NOT AUTHORIZED) → Final Platformization Assessment**。
- 无 M38.x / 并行 Stream / 第二 Design/Component System / New Domain/Entity/Schema。
- 非阻塞问题进入 Batch Remediation，不无限建 M38 evidence task。

## 24. Next Authorized Step

- **M38 Closeout Required**（因 M38 = IMPLEMENTED / CONDITIONAL）。Closeout 仅当核心功能完成 + 无阻塞缺陷 + 无架构矛盾时准允。
- **M39** 必须经独立授权门，791 不自动进入。

---

## Final Execution Output

```
Task:
791_M38_Unified_Discovery_Frontend_Platformization_And_Multi_Surface_Discoverability_Implementation_Authorization

Repository Root:
F:\Desktop\VISNDT

Code Root:
F:\Desktop\VISNDT\VISNDT

Branch:
main

HEAD:
76b08e508325b7c094c7b7f1234fc18e8e37014e

Working Tree:
VERIFIED（改动保留，未 reset/clean/checkout/restore/stash/rebase/merge/delete/overwrite）

Authorization:
790 = AUTHORIZABLE WITH CONDITIONS

M35:
CONDITIONAL / NOT CLOSED

M36:
CLOSED

M37:
CONDITIONAL / NON-BLOCKING CARRY-FORWARD

M38 Before:
NOT IMPLEMENTED

M38 Scope:
LOCKED A-N（Reuse + Controlled Extension 内受控实施）

Frontend Platformization:
MINIMAL CONTROLLED CONVERGENCE（Global Nav 归一 / Knowledge canonical 主入口 / Sitemap categories；Convergence ≠ Rebuild）

Home:
REUSE（无改动）

Product Center:
REUSE（deterministic related*/JSON-LD/SupplierModels/RelevantParameters 保持）

Search:
M36 CLOSED 保持（统一 /search Authority；791 未改 Search 路由/端点/组件）

Solution:
REUSE（ContentListLayout + ContentCommercialCTA）

Knowledge:
/knowledge-base canonical 主入口归一完成（Header + Footer）

Business Cooperation:
REUSE（Content-managed ARTICLE 非 marketplace）

Header/Footer/Navigation:
知识中心一级导航 /knowledge → /knowledge-base（Header + Footer 统一）

Cross-surface IA:
既有 EngineeringDiscoveryNav + 确定性 related*（REUSE）

External Discoverability:
Sitemap /categories + /knowledge-base in sitemap=True；robots 完整

AI/LLM Discoverability:
JSON-LD + 确定性 related* 结构基础（非 AI 平台；无新 Discovery/AI Entity）

Mobile:
375/768/1440 = PASS（791 未改 CSS/布局，行为与 789 一致）；1024 = 19px 全局既有 carry-forward

Low-operation:
RETAINED（Rule-driven · Supplier Self-service · 无 Manual SEO/link/sitemap/索引）

Schema:
NO CHANGE（diff 空）

Migration:
NONE（diff 空）

API:
EXISTING ONLY（0 新增/扩展）

Backend:
REUSE（0 改动）

Runtime:
VERIFIED（生产 build 成功 · 生产 server 实测 200 路由）

Browser:
Header HTML 实测 知识中心 → /knowledge-base；旧 /knowledge nav 命中 = 0

Regression:
无越权回归（M36/M35/M37 边缘均未越权）

Batch Remediation:
BR-791-01..05（全 P2/NON-BLOCKING，Record/Batch/Defer；无 Issue→New M38 Task）

Fundamental Change:
Candidates = 0

Documentation:
COMPLETE（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX 已追加 791；未改写 775-790 与 Frozen Architecture）

Roadmap:
M35 → M36(CLOSED) → M37(CONDITIONAL) → M38(IMPLEMENTED/CONDITIONAL PASS) → M39(NOT AUTHORIZED) → Final

M38 Implementation State:
IMPLEMENTED / CONDITIONAL PASS

Next Authorized Step:
M38 Closeout Required；M39 须独立授权门（791 不自动进入）

STOP:
CONFIRMED
```

---

## 最终固定原则（本任务复核）

- VISNDT = Vertical NDT Platform
- Product = Capability / Product Discovery Core
- Search = Unified Engineering Discovery Authority
- Knowledge = Public Engineering Information Asset
- Insight = Contextual Engineering Annotation（已冻结退役）
- Solution = Engineering Solution Asset
- Content = Unified Content Infrastructure
- Supplier = Capability Provider
- SupplierProduct = Supplier-owned Commercial Product（PUBLISHED + Governance 控制公开边界）
- Mobile = First-Class Platform Surface
- M38 = Frontend Platformization + Unified Discovery + External Discoverability + AI/LLM Discoverability Foundation
- M39 = Workflow + Demand + Match + RFQ + Offer/Quote + Inquiry + Workspace + Platform Business Loop

实施约束复核：
- 平台化 ≠ 重做网站
- 统一 ≠ 新建系统
- Frontend Convergence ≠ Frontend Rewrite
- SEO ≠ SEO 子系统
- AI Discoverability ≠ AI Platform
- Mobile First-Class ≠ Global Mobile Rewrite
- 覆盖不足 ≠ 架构不足
- 数据少 ≠ 新建数据系统
- Benchmark ≠ Architecture Authority
- Issue ≠ New Stage
- **Reuse > Controlled Extension > Fundamental Change**
- **Verify before modify · Evidence before status · Existing architecture before new architecture · Fixed route before optimization · Low-operation before manual operation**

**本任务已在本任务范围内完成第一轮 M38 平台化实施，未创建 M38.x、并行 Stream 或新的架构路线。**
**完成后必须 STOP。不得自动进入 M39。**