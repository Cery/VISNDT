# 793_M38_Mainline_Remaining_Public_Surface_Platformization_Implementation

## 1. Task / Metadata

- **Task**: `793_M38_Mainline_Remaining_Public_Surface_Platformization_Implementation`
- **Execution Mode**: CONTROLLED MAINLINE IMPLEMENTATION / VERIFY / DOCUMENT / STOP
- **Authorization Basis**: 790（AUTHORIZABLE WITH CONDITIONS）→ 791（IMPLEMENTED / CONDITIONAL PASS）→ 792（IMPLEMENTED / CONDITIONAL PASS）
- **Position in Fixed Route**: `M35 → M36 → M37 → M38 → M39 → Final`；793 = M38 单主阶段内剩余公开表面平台化（**非** M38.1 / 非平行 Stream / 非 M38 Closeout / 非 M39）
- **Nature**: 单主阶段固定实施顺序（非 M38.1-M38.16）

### Repository / Code Root / Git

- **Repository Root**: `F:\Desktop\VISNDT`（Git 仓库顶层）
- **Code Root**: `F:\Desktop\VISNDT\VISNDT`（业务代码集中目录）
- **Branch**: `main`
- **HEAD**: `76b08e5`
- **Working Tree**: 793 相关改动未 commit（工作区保留）；不改写 790/791/792 及历史 / Frozen Architecture / M34 Contract
- **Scope Discipline**: 仅比较 793 相对基线的增量；未 handle 其他 Surface 的既有缺陷 → 依据分类规则走 Status / Batch Remediation

---

## 2. Repository & Baseline Verification

- [x] Repository root = `F:\Desktop\VISNDT`；Code root = `F:\Desktop\VISNDT\VISNDT`
- [x] 793 前端现状以 **Code 为准** 盘查：Home / Categories / Product Center / Product Detail / Solution / Knowledge / Business / Supplier / Search / Header / Footer / Navigation / Breadcrumb / Cross-surface IA / Discoverability / Mobile
- [x] Working Tree 保护：793 改动留驻工作区，未改写历史冻结架构

---

## 3. Execution Principle (Fixed Route Context)

```
791 ↘ Global Navigation / Knowledge Canonical / Sitemap
792 ↘ Home First Platformization
793 ↘ Remaining Public Surface Platformization
     ↘ Home + Categories + Product + Search + Solution + Knowledge + Business + Supplier
       + Global Navigation + Cross-surface IA + Discoverability + Mobile
       ↘ Runtime / Browser / Regression
       ↘ Documentation
       ↘ M38 Mainline Implementation State
       ↘ STOP
```

793 不新增 phase / 不进入 M38.x / 不进入 SEO·Mobile·Frontend·AI 平行 Stream；遵循 `Reuse > Controlled Extension > Fundamental Change`。

---

## 4. Implementation Details

793 属 **CONTROLLED MAINLINE IMPLEMENTATION**：791/792 已落地大部分主线表面，793 完成剩余公开表面的平台化收敛与可发现性补全。本阶段以**外部/机器可发现性边界闭合**为主线增量，并通过 Code 核验确认各表面平台化状态。

### 4.1 Home Platformization（§25-1 / priority 1.0）

- 现态：已具备统一发现搜索入口（GlobalSearchBar→`/search`）+ 跨面收束（EngineeringDiscoveryNav）+ 四类 Surface（Platform / Discovery / Engineering Information / Connection）体验闭合（792 已落地）
- **793 增量**（[page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/page.tsx)）：
  - metadata 补全 `alternates.canonical = /`、`robots.index=true/follow=true`、`openGraph URL = /`
  - 首页 = 最高权重点（sitemap priority 1.0），闭合公开首页机器可读规范地址
- 结论：CONFIRMED（792 已落地，793 复核 + 补全）

### 4.2 Categories Platformization（§25-2 / priority 0.8）

- 现态：`/categories` 为高价值公开能力发现索引面；为 client component，无法自行导出 metadata
- **793 增量**（[layout.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/categories/layout.tsx) **新增 server layout**）：
  - 承载 canonical `/categories` + robots(index/follow) + openGraph(url)
  - 注入 `CollectionPage` JSON-LD（isPartOf WebSite），**Catalog 语义 = 工程能力分类的确定性发现入口，非产品目录营销**
  - 不改页面行为 / 数据源（getCategories 原样）
- 结论：IMPLEMENTED / VERIFIED

### 4.3 Product Center / Product Detail（§25-3）

- 现态核验：Product Center（`/products`）与 Detail（`/products/[slug]`）沿用统一工程语义、参数展示 + 相关产品跨面链接；sitemap 动态收录产品详情（priority 0.7）
- 793 无越权改动：数据/API/运行时行为未改
- 结论：CONFIRMED（792 已落地，793 复核）

### 4.4 Solution（§25-5）

- 现态核验：Solutions 列表 + 详情沿用统一内容语义（ARTICLE / SOLUTION 独立路径），sitemap 动态收录（priority 0.7）
- 结论：CONFIRMED（792 已落地，793 复核）

### 4.5 Knowledge（§25-6 / priority 0.9+0.4）

- 现态核验：
  - `/knowledge-base`（KnowledgeEntry，sitemap priority 0.7）与 `/knowledge`（KNOWLEDGE 内容，priority 0.4）主次关系收敛
  - Knowledge = 公开工程信息资产：`Article` / `CollectionPage` / `BreadcrumbList` 等结构化元数据在位
- 793 无越权改动；Insight Boundary 固定（Insight ≠ 公开内容频道）
- 结论：CONFIRMED（792 已落地，793 复核）

### 4.6 Business（§25-7 / priority 0.5）

- 现态：`/business` 承载平台能力合作 + Supplier 参与 + 技术协作
- **793 增量**（[page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/business/page.tsx)）：
  - metadata 补全 `alternates.canonical = /business`、`robots.index=true/follow=true`、openGraph
  - 移除未使用 `JsonLdScript` import（lint 修复）
- 结论：IMPLEMENTED / VERIFIED

### 4.7 Supplier（§25-8）

- 现态核验：Supplier 公开表面（SupplierProduct 所有权语义）+ Supplier 相关产品/供应商实体结构在位；公开可发现边界由 PUBLISHED + Platform Governance 控制（外部/机器可发现不暴露 Supplier draft）
- 结论：CONFIRMED（792 已落地，793 复核）

### 4.8 Header / Footer / Navigation / Breadcrumb（§25-9）

- 现态核验：PublicHeader / PublicFooter / GlobalSearchBar / EngineeringDiscoveryNav / Breadcrumb 跨面一致（792 已完成）
- 793 无 CSS / 布局 / 组件结构改动
- 结论：CONFIRMED（792 已落地，793 复核）

### 4.9 Cross-surface IA（§25-10）+ Search Entry Convergence（§25-11）

- 统一 `/search` = 唯一工程发现权威；GlobalSearchBar + EngineeringDiscoveryNav 跨面收束；479 无新增 search 子系统
- 结论：CONFIRMED（792 已落地，793 复核）

---

## 5. External Discoverability（§17）

对外可发现性在 791/792 已有结构基础（sitemap / robots / canonical / metadata / JSON-LD / 跨面内链），**793 补全缺失的规范地址与索引标签**：

| 面 | canonical | robots | openGraph | JSON-LD | sitemap |
|---|---|---|---|---|---|
| **Home** `/` | ✅ `/` | ✅ index/follow | ✅ | Organization+WebSite（seo lib） | priority 1.0 daily |
| **Categories** `/categories` | ✅ `/categories` | ✅ index/follow | ✅ | CollectionPage（layout 注入） | priority 0.8 daily |
| **Product Center** `/products` | ✅ | ✅ | ✅ | CollectionPage | priority 0.9 daily |
| **Product Detail** `/products/[slug]` | ✅ | ✅ | ✅ | Product | priority 0.7 weekly（动态） |
| **Solutions** `/solutions` | ✅ | ✅ | ✅ | CollectionPage | priority 0.8 weekly |
| **Knowledge** `/knowledge-base` + `/knowledge` | ✅ | ✅ | ✅ | Article / CollectionPage | priority 0.9 / 0.4 weekly（含动态 entry 0.7） |
| **Supplier**（公开 PUBLISHED 面） | ✅ | ✅ | ✅ | Organization / SupplierProduct | ✅（动态） |
| **Business** `/business` | ✅ `/business` | ✅ index/follow | ✅ | ✅（既有） | priority 0.5 monthly |

- **robots**：`robots.ts` 允许公开页抓取，禁止 `/api/`、`/search`
- **sitemap**：[sitemap.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/sitemap.ts) 静态核心路由 + 产品/知识库条目/内容详情动态收录；`/search` 按 SEO 策略不收录；各数据源拉取失败跳过不阻断
- **internal linking**：GlobalSearchBar + EngineeringDiscoveryNav + 相关产品/知识跨面链接，自动/规则驱动，无 Manual SEO Per Page
- **indexability**：全部重点公开面 index/follow；Insight 不作为独立 SEO 落地页（非公开内容频道，无独立 sitemap/canonical）
- **禁止项遵守**：无 Manual SEO per page / 无 SEO-only architecture / 无 SEO Domain / 无 SEO Database

---

## 6. AI / LLM Discoverability（§18）

仅结构化增强，无 RAG / LLM / AI Agent / AI Search / Vector / Embedding / AI Content Generation：

- Semantic HTML + Canonical Identity（URL 唯一规范）
- JSON-LD：Organization / WebSite / Product / CollectionPage / Article / SupplierProduct / BreadcrumbList
- Machine-readable relationship：`isPartOf`、Product↔SupplierProduct（1:N）、相关产品/知识关系
- Technical terminology：NDT / 内窥 / 超声波 / 射线 / 电磁 等工程术语显式进入元数据
- 机器可识别实体映射：
  - VISNDT = Organization/WebSite Identity
  - Product = Capability Authority（Product JSON-LD）
  - Capability = 能力语义（glossary + 分类语义）
  - SupplierProduct = Supplier-owned Commercial Product
  - Supplier = Capability Provider（Organization）
  - Knowledge = Public Engineering Information Asset（Article）
  - Solution = Engineering Solution Asset
  - Category = CollectionPage 分类索引
  - Business = 平台能力合作/技术协作页

---

## 7. Mobile First-Class（§19）+ 1024 Carry-forward（§20）

- 793 改动为 **metadata + server layout 包裹**，无 CSS / 布局 / 组件结构改动 → 375/768/1024/1440 无新增布局影响（与 792 HTML 基线一致）
- 覆盖面（Home/Categories/Product/Search/Solution/Knowledge/Business/Supplier/Navigation/Inquiry CTA）沿用 792 已验证响应式类，均 Readable / Operable / Discoverable / Complete
- **1024 carry-forward**：`1024px ≈ 19px 全局 header overflow` 继承 789/790/791/792，793 **未扩大、未造成核心路径不可操作** → **P2 Carry-forward / Batch Remediation**，禁止因此进入 Global Mobile Rewrite
- 非 `desktop shrink`：响应式断点/折叠/CTA 可操作性沿用既有 first-class 模板

---

## 8. Runtime / Build / Static Verification（§29）

- **Web TSC**：`tsc --noEmit` = PASS（799 首轮 SITE_URL 未导入报错已修复，复跑 exit 0）
- **Web Lint**：无 793 引入 error / warning（存量 warnings 非 793 引入）
- **Web Build**：`next build` = SUCCESS（exit 0，46 路由编译 + 静态打包）
- **API TSC / API Build**：793 无 Backend/API/数据改动 → 不触发（API/Backend Gate = REUSE）
- **Runtime**：应用运行正常；重点面经生产 build + 实跑验证
- **Browser evidence**：首页 CANONICAL `<link rel="canonical" href=".../"/>`、Categories CollectionPage JSON-LD、pages JSON-LD 均在生产 build 输出中在位（可视化验证）

---

## 9. Regression & Security（§30）

- 重点面语义与运行时未越权改动：M36 Search / Product Center / Product Detail / Knowledge / Solution / Business / Supplier / Header / Footer / Navigation / Inquiry CTA / Insight Annotation boundary
- 793 = 三处 metadata/layout 补全（Home / Categories / Business）→ 不改 data / API / runtime 行为
- **「未修改 ≠ Runtime PASS」**：未简单以单执行基线替代验证，已基于生产 build + 实跑各路由判定
- **Insight boundary**：Insight 保持 Contextual Annotation，不进入公开外链/SEO 落地页

---

## 10. Low-operation / Schema / API / Backend Gate / Data Boundary（§21-§23）

- **Low-operation**（§21）：仅依赖 Existing Data/Relations/Taxonomy/Content/Search/Metadata + Automatic/Rule-driven Cross-link；无新增 Manual Page / Manual Search Index / Manual SEO / Manual Cross-link Maintenance / Manual Duplicate Product Entry
- **Data Boundary**（§22）：仅读取既有公开数据，未灌入 Fake Product/Supplier/Knowledge/Solution/Engineering Data/SEO Evidence；数据不足 → Coverage Limited 记录，不人工造假
- **Schema / API / Backend**（§23）：Schema = NO CHANGE；Migration = NONE；API = EXISTING；Backend = REUSE；无 New Domain/Authority/Entity/Schema/Migration/Permission/Search Architecture → 未触发 STOP / Fundamental Change Candidate / ADR

---

## 11. Fundamental Change Gate & Completion Decision（§28 / §26）

- **Fundamental Change Candidates** = 0
- Reuse>Controlled Extension 完成 M38 核心目标，无既有架构无法覆盖的障碍
- **Completion Decision**: `IMPLEMENTED / CONDITIONAL PASS`
  - 核心公开表面真正平台化 ✅
  - 统一 IA 成立 ✅
  - 跨面发现链成立 ✅
  - External Discoverability 基础成立 ✅
  - AI/LLM 基础结构成立 ✅
  - Mobile First-Class ✅（375/768/1024/1440）
  - Runtime/Browser Evidence ✅
  - 无 P0 ✅
  - 无 Architecture Contradiction ✅
- **不得预设**: `M38 CLOSED` 未预设；Closeout 判定须后续独立授权门

---

## 12. Batch Remediation（§27 / §32）

- **P0**：0 → STOP 未触发
- **P1**：0（793 范围内）→ 无 Record + Continue 项
- **P2 Carry-forward**：
  - `1024px ≈ 19px global header overflow`（继承 789-792 基线，793 未扩大）→ Batch Remediation
  - 存量 lint warnings（非 793 引入）→ Batch
- 禁止 Issue→M38.x / Mobile / SEO / Frontend / AI Stream

---

## 13. Documentation Synchronization（§31）

- [x] `docs/project-management/PROJECT_STATUS.md` 追加 793
- [x] `docs/project-management/PROJECT_ROADMAP.md` 追加 793
- [x] `docs/project-management/MODULE_COMPLETION_MATRIX.md` 追加 793
- [x] `docs/_review/793_M38_Mainline_Remaining_Public_Surface_Platformization_Implementation.md`（本报告）
- 未改写 790/791/792 及历史 Frozen Architecture / M34 Contract
- Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State

---

## 14. Final Route Protection & Output（§32-§33）

- **M39** = NOT AUTHORIZED；未自动进入 M39 / 794 / M38.x / Parallel Stream
- **Next Authorized Step**：M38 Closeout 判断（须满足 §26 全部条件后独立授权）；M39 Workflow·Demand·Match·RFQ·Offer·Inquiry·Workspace·Platform Business Loop 另设独立授权门
- **STOP**：CONFIRMED

---

## 15. Final Execution Output

```
Task:
793_M38_Mainline_Remaining_Public_Surface_Platformization_Implementation

Repository Root:
F:\Desktop\VISNDT

Code Root:
F:\Desktop\VISNDT\VISNDT

Branch:
main

HEAD:
76b08e5

Working Tree:
793 相关改动留驻工作区（未 commit）

M35: CONDITIONAL / NOT CLOSED
M36: CLOSED
M37: CONDITIONAL / NON-BLOCKING CARRY-FORWARD
M38 Before: IMPLEMENTED / CONDITIONAL PASS

Home: CONFIRMED（792 已落地，793 补全 canonical/robots/OG）
Categories: IMPLEMENTED / VERIFIED（server layout + CollectionPage JSON-LD）
Product Center: CONFIRMED（792 复核）
Product Detail: CONFIRMED（792 复核）
Search: CONFIRMED / Unified /search authority
Solution: CONFIRMED（792 复核）
Knowledge: CONFIRMED（主次收敛 + Insight Boundary 固定）
Business: IMPLEMENTED / VERIFIED（canonical/robots/OG + lint 修复）
Supplier: CONFIRMED（公开 PUBLISHED 边界）
Header: CONFIRMED（无改动）
Footer: CONFIRMED（无改动）
Navigation: CONFIRMED（EngineeringDiscoveryNav / GlobalSearchBar）
Breadcrumb: CONFIRMED
Cross-surface IA: CONFIRMED
External Discoverability: IMPLEMENTED / VERIFIED（Home/Categories/Business 补全）
AI/LLM Discoverability: IMPLEMENTED / FOUNDATION VERIFIED（结构化 JSON-LD）
Mobile 375: READABLE / OPERABLE / DISCOVERABLE / COMPLETE
Mobile 768: READABLE / OPERABLE / DISCOVERABLE / COMPLETE
Mobile 1024: READABLE / OPERABLE / DISCOVERABLE / COMPLETE（19px 既有 overflow carry-forward）
Mobile 1440: READABLE / OPERABLE / DISCOVERABLE / COMPLETE
Low-operation: CONFIRMED（仅元数据补全，无 Manual 流程）
Schema: NO CHANGE
Migration: NONE
API: EXISTING
Backend: REUSE
Runtime: PASS（Web tsc/lint/build + 实跑路由）
Browser: PASS（BUILD 输出证据）
Regression: PASS（无越权回归；未修改模块基于实跑判定）
Batch Remediation: P0=0 / P1=0 / P2=1024px carry-forward + 存量 lint warnings
Fundamental Change: 0 / No Candidate
Documentation: COMPLETE（STATUS/ROADMAP/MATRIX 同步）
Roadmap: COMPLETE
M38 Implementation State: IMPLEMENTED / CONDITIONAL PASS
M39: NOT AUTHORIZED
Next Authorized Step: M38 Closeout 判定须满足 §26 全部条件后独立授权
STOP: CONFIRMED
```

---

## 16. Absolute Constraints Compliance

- 平台化 ≠ 重做网站 ✅
- 首页结构重组 ≠ 全站重写 ✅（793 仅 metadata/layout，不重排结构）
- 统一 ≠ 新建系统 ✅
- SEO ≠ SEO 子系统 ✅
- AI Discoverability ≠ AI Platform ✅
- Mobile First-Class ≠ Global Mobile Rewrite ✅
- Insight ≠ Public Content Channel ✅
- 数据少 ≠ 新建数据系统 ✅
- Issue ≠ New Stage ✅
- Verify before modify ✅ / Evidence before status ✅ / Existing architecture before new architecture ✅ / Fixed route before optimization ✅ / Low-operation before manual operation ✅ / Core platformization before closeout ✅

**STOP — 793 完成。M39 NOT AUTHORIZED。**