# 797\_M38\_Frontend\_Platformization\_Reality\_Correction\_And\_M39\_Precondition\_Gate

> Task: `797_M38_Frontend_Platformization_Reality_Correction_And_M39_Precondition_Gate`
> Mode: CONTROLLED CORRECTION + FRONTEND PLATFORMIZATION + VERIFIED E2E + DOCUMENTATION SYNCHRONIZATION + STOP
> Date: 2026-09-02
> Repository Root: `F:/Desktop/VISNDT` · Code Root: `F:/Desktop/VISNDT/VISNDT`
> 核心原则：Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State
> 证据层级：Runtime/Browser Evidence > Code > API/Schema > Documentation > Historical Decision
> 关键规则：M38 declared CLOSED previously ≠ M38 visual/platformization reality permanently accepted。本任务不修改历史报告、不制造历史完成证据；以最新独立真实前端证据修正当前状态。

***

## 1. Repository Verification

| 项                                                         | 实测                                                                                  | 结论        |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| Repository Root                                           | `F:/Desktop/VISNDT`                                                                 | VERIFIED  |
| Code Root                                                 | `F:/Desktop/VISNDT/VISNDT`                                                          | VERIFIED  |
| apps/web · apps/api · apps/admin · database/prisma · docs | 全部在位                                                                                | VERIFIED  |
| Branch                                                    | `main`                                                                              | VERIFIED  |
| HEAD                                                      | `76b08e508325b7c094c7b7f1234fc18e8e37014e`（768 M34.6 closeout）                      | VERIFIED  |
| Working Tree                                              | 留驻：790-796 M38 前端改动 + M34.7 历史遗留 organization-members API 改动（schema 无 diff）+ 797 修正 | VERIFIED  |
| 禁止操作                                                      | 未执行 reset/clean/checkout ./restore ./stash/rebase/merge/delete/overwrite            | CONFIRMED |

## 2. Git Baseline

- HEAD = `76b08e5`（最近提交：768 M34.6 closeout docs）。

- 797 Baseline = Actual Current Code（工作树）+ Actual Current Runtime（PostgreSQL/API/Web/Admin/CDP 全在线）+ Latest E2E Evidence（796 Task1/Task2 两份独立评估）。

- 797 生产代码改动（全部为既有文件最小修正 + 1 个 server layout 承载元数据）：

  1. `apps/web/src/components/layout/PublicHeader.tsx` — 主导航断点 `lg:flex`→`xl:flex`、汉堡 `md:hidden`→`xl:hidden`（修 1024 溢出 + 768–1023 导航不可达）
  2. `apps/web/src/app/search/page.tsx` — 补 canonical（统一检索 Authority 规范地址）
  3. `apps/web/src/app/knowledge/page.tsx` — 补 canonical（列表页缺失）
  4. `apps/web/src/app/products/compare/layout.tsx` — **新增** server layout 承载 title/description/canonical/robots/openGraph（Compare=Product Discovery Support，非 Comparison Entity）
  5. `apps/admin/src/api/product-category-knowledge-mapping.service.ts` — 修复双重解包（`res.data.data`→`res.data`）

- 工作树另含前序会话已完成的 `RfqList.tsx` antd `columns.render`→`onCell` 迁移（P2 告警清理，保留）。

## 3. Historical State Reconciliation

790-796 报告全部读取对账（未改写）：

| 任务      | 历史判定                                                                                               |
| ------- | -------------------------------------------------------------------------------------------------- |
| 790     | M38 AUTHORIZABLE WITH CONDITIONS（授权门）                                                              |
| 791-794 | M38 IMPLEMENTED / CONDITIONAL PASS（四轮主线实施）                                                         |
| 795     | M38 Final Closeout = CASE B · CONDITIONAL（1024 19px carry-forward + lint + coverage + auth E2E 缺口） |
| 796     | M38 Reconciliation = **CLOSED**；M39 = AUTHORIZABLE WITH CONDITIONS（≠AUTHORIZED）                    |

历史文档状态：PROJECT\_STATUS/ROADMAP/MATRIX 中 M38=CLOSED（Reconciled）。

## 4. Latest Independent Audit Reconciliation

797 的两份新证据输入（796 任务产出，当前证据，可推翻历史乐观表述）：

**任务一：三角色真实浏览器 E2E**（`docs/_review/796_Task1_三角色浏览器E2E测试报告.md`）

- GUEST/BUYER/SUPPLIER 公开面与工作区总体 PASS；

- 发现：`/products/compare` title 错位（「能力注册表」）；`/workspace/supplier/dashboard` 404 死路由；Admin 28 模块中 13+ 空转/错误态。

**任务二：前端架构师 UI/平台性评估**（`docs/_review/796_Task2_前端架构师_UI与平台性评估.md`）

- 公开发现面 A / 角色分层 A / **Admin 治理面 D** / 设计系统单一事实源 C / IA 一致性 B+ / Mobile 未覆盖；

- P1：Admin 空转根因待查、供应商仪表盘死路由；P2：design-tokens 镜像漂移、compare 元信息、antd 告警；待办：375/768/1024 响应式回归。

**对账结论**：两份独立评估未推翻「公开读侧已平台化」，但推翻了「全部表面平台化完成」的乐观表述——存在真实可复现的导航可达性缺陷（768–1023 导航不可达、1024 溢出）、元数据缺口（/search、/knowledge canonical 缺失、compare title 错位）、Supplier 死链与 Admin 治理面空转。按任务规则，当前状态必须以最新证据修正。

## 5. Public Frontend Platformization Assessment

CDP 真实浏览器逐面审查 13 条公开路由（证据：`database/_797_audit/public.json` + 13 张截图）：

- 全站统一 Header NAV（首页/搜索/能力分类/产品中心/能力型号供应商/解决方案/知识中心）+ GlobalSearchBar + 统一 Footer；

- H1/Title 语义为「能力注册表 / 能力分类 / 知识中心 / 解决方案」——**能力发现语义，非商品货架、非企业官网**；

- 每面均有搜索入口（searchEntryCount≥1）；跨面发现经 EngineeringDiscoveryNav + 面包屑（详情页）表达；

- canonical/OG/JSON-LD 在位（修正后复验见 §10、§14）。

**判定**：公开读侧 = Vertical Industrial NDT Engineering Discovery Platform 体验成立（非 Generic B2B/Marketplace/Corporate Website）。

## 6. Home Platformization Assessment

- 首页具备：Platform Identity（title=「VISNDT – 工业检测能力发现平台」）+ Hero 首屏 GlobalSearchBar（统一发现入口，2 个搜索入口实测）+ 能力分类/产品中心/解决方案/知识中心/能力提供商/商务连接区 + Organization/WebSite JSON-LD ×2；

- IA + Experience + Visual Hierarchy + Discovery Flow 四维成立：Discovery→Understanding→Technical Context→Comparison→Connection 可从首页连续进入；

- 无 Storefront/Order/Cart/Checkout/Payment/Sponsored/Seller Ranking/Marketplace Listing；

- 797 未重组首页（792-794 已完成平台化收敛且本轮实测成立），判定 **PASS**。

## 7. Header / Navigation / Search Assessment

**发现（修正前基线** **`runtime_pre_fix_baseline.json`）**：

1. **1024 横向溢出**：导航+搜索+认证簇最小内容宽≈1116px，overflow=4px（sw=1028）；
2. **768–1023 导航不可达（P1）**：汉堡 `md:hidden` 在 768+ 隐藏，而内联导航 `lg:flex` 虽点亮但整行溢出不可用；768 实测 `burgerVisible=false && inlineNavVisible=false` = 导航完全不可达。

**修正（PublicHeader.tsx，最小受控）**：内联导航仅 `xl:flex`（≥1280），xl 以下统一走抽屉（汉堡 `xl:hidden`）。单一断点收敛，消除重叠区间。

**修正后实测（`runtime.json`** **+** **`header.json`）**：375/768/1024 汉堡可见可开（抽屉 19 链接）、1440 内联导航点亮；全视口 overflow≤0。Search 保持 Unified Engineering Discovery Authority（唯一 `/search`，未创建任何第二搜索系统）。

## 8. Public Surface Matrix

| 路由                       | HTTP  | 平台语义                        | 搜索入口 | canonical（修正后） | 判定                                  |
| ------------------------ | ----- | --------------------------- | ---- | -------------- | ----------------------------------- |
| `/`                      | 200   | 平台首页                        | 2    | ✅              | PASS                                |
| `/categories`            | 200   | 能力分类索引                      | 1    | ✅              | PASS                                |
| `/products`              | 200   | 能力注册表                       | 2    | ✅              | PASS                                |
| `/products/[slug]`       | 200   | 能力详情+面包屑                    | 1    | ✅              | PASS                                |
| `/search`                | 200   | 统一检索 Authority              | 2    | ✅（797 补）       | FIXED                               |
| `/solutions`             | 200   | 工程方案                        | 1    | ✅              | PASS                                |
| `/solutions/[slug]`      | 200   | 方案详情+面包屑                    | 1    | ✅              | PASS                                |
| `/knowledge-base`        | 200   | 知识中心主入口                     | 1    | ✅              | PASS                                |
| `/knowledge-base/[slug]` | 200\* | 知识条目                        | 1    | ✅              | PASS（\*slug 须用 KnowledgeEntry slug） |
| `/knowledge`             | 200   | 知识次级表面                      | 1    | ✅（797 补）       | FIXED                               |
| `/business`              | 200   | 商务合作（非 Marketplace）         | 1    | ✅              | PASS                                |
| `/suppliers/[id]`        | 200   | Capability Provider Profile | 1    | ✅              | PASS                                |
| `/products/compare`      | 200   | 产品对比（发现支持）                  | 1    | ✅（797 修）       | FIXED                               |

## 9. Supplier Route Integrity

- 调查 `/workspace/supplier/dashboard`：该路由**不存在于代码库**（apps 全量检索引用=0），历史菜单/CTA 已指向 canonical `/dashboard/supplier`（WorkspaceSidebar 实测）；

- 修正策略=修正既有链接而非创建第二个 Dashboard Domain：**未创建** SupplierDashboard2/SupplierHome2/New Supplier Workspace；

- 三角色 14 条工作区路由真实登录复验（`runtime.json`）：BUYER 5 条 + SUPPLIER 9 条全部 pathname 正确、无 404；

- 判定：**FIXED / PASS**（死链引用清零 + canonical 复用验证通过）。

## 10. Compare Metadata

修正前实测：`/products/compare` title=「能力注册表」、canonical 指向 `/products`（继承 products/layout）——语义错位。
修正：新增 `apps/web/src/app/products/compare/layout.tsx`（server component）：

- title=「产品对比」· description=能力选型语义 · canonical=`/products/compare` · robots=`index, follow` · openGraph（title/url）

- 修正后 HTML 实抓复验（`_797_meta_reverify.mjs`）：title/canonical/robots/ogTitle/ogUrl 全部生效；

- 边界保持：Compare = Product Discovery Support，**未创建** Comparison Entity/Comparison Domain。

- 判定：**FIXED**。

## 11. Admin P1 Root Cause Classification

对 796 Task1 报告的 16 个空转/错误态 Admin 模块执行 VERIFY + CLASSIFY + TRACE ROOT CAUSE（`admin_api.json` + `admin_render.json` + PCKM 专项探针）：

| 分类     | 数量 | 根因                                                                                                                                                                            | 处置                                                          |
| ------ | -- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 瞬时/环境态 | 15 | 探针时全部 18 个后端端点 HTTP 200（home/stats、analytics、monitoring、matching、users、organizations、supplier-products、inquiries、audit-logs、embedding、files、content 等）；渲染空转为前端挂载时序/空数据态，非后端缺陷 | Record（复测渲染正常，无代码改动）                                        |
| 真实前端缺陷 | 1  | `/product-category-knowledge-mappings`：service 双重解包（`res.data.data`）→ `undefined.length` 崩溃 → 页面永久 retry 态                                                                    | **最小局部修正**（单层解包，与 user.service 既有正确写法对齐）；复验 rows=9、retry 消失 |

- 未发现 Backend API defect / Permission defect / Data integrity defect / Architecture defect 需要扩张 797；

- 边界遵守：未进行 Admin Global Rewrite / 未重建 Admin Architecture / 未新增 Admin Domain / 未创建 Admin Stream。

## 12. Design Token Assessment

- 事实记录：`packages/design-tokens/tokens.json` 自述「说明性镜像，权威值以 src/index.ts 为准」；Web（Next.js+Tailwind）与 Admin（Vite+AntD 5）双前端未统一消费同一 token 源；

- 判定：**P2 架构负债（记录）**——存在视觉漂移风险，但现有架构可满足当前平台视觉约束；

- 处置：建立统一 token consumption contract 记录，修正明确小范围引用之外**不进行** Design System Rewrite；未触发 Fundamental Change Candidate。

## 13. Architecture / Scope Check

- Schema = NO CHANGE（database/prisma 无 diff）· Migration = NONE · API = EXISTING ONLY · Backend = REUSE（797 未改 apps/api）；

- 未创建：New Insight/Application/DetectionObject Entity、New Search/Knowledge/Solution/Supplier Authority、New Marketplace/CRM/Commerce/Admin Platform；

- 语义保持：Product=Capability Authority · SupplierProduct=Supplier-owned Commercial Product · Supplier=Organization(type=SUPPLIER) · Search=Unified Discovery Authority · Knowledge=Public Engineering Information · Insight=Contextual Annotation · Solution=Engineering Solution Asset · Inquiry=Connection Authority；

- 无 STOP 触发、无 Fundamental Change Candidate。

## 14. Runtime Evidence

- PostgreSQL + API(:4000 `/api/v1/health`=ok) + Web(:3000) + Admin(:3001) + Chrome/CDP(:9222) 全部在线实跑；

- 13 条公开路由全部 HTTP 200（`public.json`）；

- 元数据修正后 HTML 实抓复验：/search、/knowledge、/products/compare、/products、/categories 的 canonical+robots+OG 全部在位（`_797_meta_reverify.mjs`）。

## 15. Browser Evidence

- 真实 Chrome + CDP 隔离浏览器上下文（每角色独立 incognito context）；

- GUEST 13 面 + BUYER 5 路由 + SUPPLIER 9 路由真实登录导航验证；

- 截图证据：`database/_797_audit/pub_*.png` ×13；

- Admin 16 模块渲染复验 + PCKM 修复后复验（rows=9）。

## 16. Mobile Evidence

CDP 真实四视口度量（修正后，`runtime.json`；修正前基线 `runtime_pre_fix_baseline.json`）：

| 视口   | 修正前                | 修正后          | 导航可达性         |
| ---- | ------------------ | ------------ | ------------- |
| 375  | 无溢出                | 无溢出（sw=360）  | 汉堡 ✅          |
| 768  | 无溢出但**导航不可达**      | 无溢出（sw=753）  | 汉堡 ✅（19 链接抽屉） |
| 1024 | **溢出 4px** + 导航不可用 | 无溢出（sw=1009） | 汉堡 ✅          |
| 1440 | 无溢出                | 无溢出（sw=1425） | 内联导航 ✅        |

- 1024 历史 overflow 重新归因：**M38 可归因**（Header 导航簇宽度，797 断点修正后消除）——不沿用「全局既有 carry-forward」历史结论；

- 768 历史≈140px carry-forward：本轮实测 0，无复现。

## 17. Regression

- Search（/search + 参数过滤）/ Product Center / Product Detail / Knowledge / Solution / Business / Supplier / Compare / Header / Footer / Global Search / 三角色工作区：实跑确认无越权回归；

- 797 改动均为展示层断点/元数据/单层解包，不改 data/API/runtime 行为；

- 未修改模块基于 Runtime 实跑证据判定，非「未修改=PASS」。

## 18. AC Reconciliation

| 验收维度                | 判据                             | 结果            |
| ------------------- | ------------------------------ | ------------- |
| 公开 13 面平台语义         | 能力发现语义、非官网/商城                  | PASS          |
| 导航全视口可达             | 375–1440 导航可达 + 无溢出            | PASS（797 修正后） |
| Search 单一 Authority | 无第二搜索系统                        | PASS          |
| Supplier 路由完整性      | 死链清零 + canonical 复用            | PASS          |
| Compare 元数据         | title/canonical/robots/OG 语义一致 | PASS（797 修正后） |
| Admin P1 归因         | 16 模块分类 + 1 处最小修正              | PASS          |
| Mobile First-Class  | 四视口实测                          | PASS          |
| Schema/API 边界       | NO CHANGE / EXISTING ONLY      | PASS          |

## 19. Batch Remediation

BR-797 Register（全 P2/NON-BLOCKING，冻结入 Batch，不创建 M38.x）：

- BR-797-01 design-tokens 双前端统一消费（P2 架构负债，记录）；

- BR-797-02 存量 lint warnings（历史技术债）；

- BR-797-03 /knowledge 内容型覆盖受限（Coverage Limited）；

- BR-797-04 sitemap 产品/Supplier 详情覆盖受限（Coverage Limited）；

- BR-797-05 认证态 E2E 凭证缺口（历史遗留）；

- BR-797-06 Admin 空态模块的数据覆盖增长依赖（非缺陷）。

## 20. Fundamental Change Register

**0 / No Candidate**。Reuse > Controlled Extension 足以完成全部 797 修正目标；无「现有架构无法满足统一平台视觉约束」的证据；未触发 STOP→ADR。

## 21. Documentation Synchronization

- 本报告：`docs/_review/797_M38_Frontend_Platformization_Reality_Correction_And_M39_Precondition_Gate.md`；

- PROJECT\_STATUS.md / PROJECT\_ROADMAP.md / MODULE\_COMPLETION\_MATRIX.md 追加 797（仅追加，不改写 790-796 历史）；

- 当前状态如实描述：Previous M38 Closeout Claim（CLOSED）vs Latest Independent Frontend Evidence（存在真实缺口）→ 797 已实施修正并复验 → 当前 M38 状态见 §22。

## 22. Current M38 State

- 797 实测证明 M38 Visual Platformization 存在**真实但有限、可局部修正**的缺口（导航可达性/1024 溢出/元数据缺口/Supplier 死链），非系统性平台化未完成；

- 全部缺口已在 797 内修正并经 Runtime/Browser/Mobile 复验通过；

- **Current M38 State = CLOSED（797 Reality Correction Applied & Verified）**；

- 不保留无条件「CLOSED」掩盖真实状态：历史 795/796 的 CLOSED 判定所依赖的「1024=全局既有非 M38 carry-forward」结论已被 797 证据修正为「M38 可归因且已修复」。

## 23. M39 Precondition Gate

- 前置条件核验：M38 核心平台化缺口 = 0（修正后复验）· P0 = 0 · Architecture Contradiction = 0 · 固定路线完整（M35→M36→M37→M38→M39→Final）；

- **M39 Authorization = NOT AUTHORIZED**（797 不授予 M39 实施授权；796 的 AUTHORIZABLE WITH CONDITIONS 判定保持有效）；

- Gate 结论：已验证的 M38 核心平台化缺口不再存在 → **M39 独立授权/实施路径的前置门满足**，下一步可进入独立 M39 Authorization / Implementation 路径（须独立任务授权，797 不自动进入）。

## 24. STOP Confirmation

- 797 完成后停止：**CONFIRMED**；

- 不自动创建 798 · 不自动进入 M39 实施 · 不创建 M38.x · 不创建 Parallel Stream；

- Batch Remediation 已冻结；历史报告 790-796 未改写。

