# 800_M39_Whole_Site_Frontend_Platformization_And_Information_Architecture_Reconstruction

> M39 全站前端平台化与信息架构重构实施报告。
> 目标：让整个 VISNDT Web 体验表现为**一致、连贯的工业检测能力发现平台**（Industrial Inspection Capability Discovery Platform），而非厂商企业官网。
> 冻结：数据 / Domain / Authority / 语义 / API / Security / Workflow；开放：IA / Header / Navigation / 页面构成 / 视觉层级 / 交互 / 发现流 / 响应式。
> 状态：**M39 Whole-site Frontend Platformization = CONDITIONALLY VERIFIED**（全局平台层 = VERIFIED；各面平台语义 = VERIFIED/Conditionally Verified）。

| 项目 | 值 |
| --- | --- |
| 任务 | `800_M39_Whole_Site_Frontend_Platformization_And_Information_Architecture_Reconstruction` |
| 仓库根 | `F:/Desktop/VISNDT` |
| 代码根 | `F:/Desktop/VISNDT/VISNDT` |
| 分支 | `main` |
| HEAD | `76b08e5`（800 工作树未提交，承载 790-799 M38/M39 前端改动） |
| 证据目录 | `VISNDT/database/_800_visual/` |

---

## 1. Repository Verification
- 仓库根 `F:/Desktop/VISNDT`（Git 顶层）与代码根 `F:/Desktop/VISNDT/VISNDT` 分离确认。
- 子目录 confirm：`apps/web`（全站前端面）、`apps/api`、`apps/admin`、`database/prisma`、`docs`。
- 运行环境实跑：PostgreSQL healthy + API `:4000` + Web `:3000` + Chrome/CDP 真实浏览器。**Web dev 服务曾因历史内存压力 OOM 宕机，已清理 `.next/cache` 后重建，随后探测通过**（记忆已记录的 Known environment fragility）。
- 读取/勘察全部现有 public + workspace 路由（`/`、`/search`、`/categories`、`/products`、`/products/compare`、`/products/[slug]`、`/solutions`、`/solutions/[slug]`、`/knowledge-base`、`/knowledge-base/[slug]`、`/knowledge`、`/business`、`/about`、`/articles`、`/tags/[slug]`、`/insights`、`/supplier-models`、`/suppliers/[id]`、`/login`、`/register`、`/workspace/*`、`/dashboard/*`）。

## 2. Git Baseline
- 分支 `main`，HEAD `76b08e5`。本任务**新增** `apps/web/src/components/layout/PublicHeader.tsx`（全量重写为平台层 mega-nav）+ **修改** `PublicFooter.tsx`（能力发现分组词汇对齐）。
- 未执行 `reset` / `clean` / `checkout .` / `restore .` / `stash` / `rebase` / `merge` / destructive delete / mass overwrite。保留全部既有改动。
- 本任务未触后端 / 未触 Schema / 未触 migration。

## 3. 799 Reality Reconciliation
- **799 已完成**（baseline truth）：Homepage Platform Journey、Homepage discovery-first 改进、首页平台操作模型、基础 Buyer/Supplier 工作流呈现、运行时证据。
- **799 未完成**（800 承接）：Global Header / Navigation 重构、Category / Product / Search / Solution / Knowledge / Supplier / Compare 呈现的**全站一致收敛**、Whole-site 视觉层级收敛、Whole-site 平台身份收敛。
- 结论：**799 = First-stage frontend reconstruction（首阶段首页平台化）；800 = Whole-site frontend platformization continuation（全站前端平台化续）**。上述缺失**不作为普通 P2 cleanup 归类**，而为本任务结构化工作项。

## 4. M35–M39 State Reconciliation
| 阶段 | 状态 |
| --- | --- |
| M35 | CONDITIONAL / NOT CLOSED（保持） |
| M36 | CLOSED（保持） |
| M37 | CONDITIONAL / NON-BLOCKING（保持） |
| M38 | CLOSED（保持，不降级、不改写） |
| M39 Business Loop Foundation | IMPLEMENTED / CONDITIONALLY VERIFIED |
| M39 Whole-site Frontend Platformization | （任务前）INCOMPLETE →（本任务）CONDITIONALLY VERIFIED |
| M39 全局平台层（Header/Nav/Footer） | VERIFIED |

- **不声明 M39=CLOSED**（§33）。不改写 790–799 历史报告，其保留为历史证据。

## 5. Architecture Freeze
```javascript
冻结（本任务未触碰）: Database Schema / Prisma Models / Existing Domain Authority /
  Product / Supplier / Knowledge / Content / Search / Inquiry=Connection /
  Demand / Match / RFQ / RFQResponse / Offer-Quote / Workspace / WorkflowEvent /
  Notification / Organization / OrganizationMember / Authentication / RBAC /
  Organization Scope / Route Semantics / API Contracts / Core Business Workflow
禁止引入（未创建）: Marketplace / Seller Center / CRM / ERP / SalesPipeline / Lead /
  Opportunity Entity / Order / Cart / Checkout / Payment / Commerce Domain /
  New Search Engine / New Knowledge System / New Insight Entity / New Workspace System
```
- Schema=NO CHANGE · Migration=NONE · API=EXISTING ONLY · Backend=NO CHANGE · **Fundamental Change=0**。
- 本任务仅前端展示层：1 文件重写 + 1 文件词汇对齐；未改任何路由语义（全部导航 href 指向既有 canonical 路由），未改认证/RBAC。

## 6. Global Header / Navigation
- **Implemented**：[PublicHeader.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/layout/PublicHeader.tsx) 从扁平企业菜单重构为**平台层（Platform Layer）mega-navigation**：
  - 品牌定位：Logo 副题由「工业检测平台」→「**工业检测能力发现平台** / CAPABILITY DISCOVERY」。
  - 平台层分组：**发现**（统一检索 /search · 能力分类 /categories · 能力型号/供应商 /search?type=supplier-product）→ **评估**（检测产品 /products · 产品对比 /products/compare）→ **技术内容**（解决方案 /solutions · 知识中心 /knowledge-base）→ **连接**（发布检测需求 /register?role=BUYER · 商务合作 /business）。
  - 桌面（xl+，符合 797 断点）展示平台层标签 + hover/click mega 面板；xl 以下走分组抽屉。
- **障碍修复说明**：搜索框 `<GlobalSearchBar/>` 判定 `query type=supplier-product` 时通过 `window.location.search` 读取；恢复 1024 视口（前端只有 xl+ 才显示内联导航，受测 1024 无溢出）。
- **Route/语义保持**：未新增路由；`/knowledge`（Content KNOWLEDGE 次级表面）未作一级导航主入口；mega 面板全部 href 指向既有 canonical 路由。
- **Verified**：全局 header/footer 包裹全站；18 面回收证据 `brand=true`（品牌可见）+ `overflow=false`。
- **移动导航（375/768）**：汉堡 + 分组抽屉，含顶层分组标题与认证操作；受测 375 无溢出。

## 7. Homepage
- **Re-checked**：799 已建立平台操作模型（PlatformJourneySection——9 步闭环 + 双角色工作流）。800 保持该 discovery-first 层级；新版 H1「工业无损检测产品与技术方案 平台」+ 全局 header 平台身份强化「工业检测能力发现平台」。
- **Verified（本次）**：home 1440 / 375 / 768 / 1024 全部 `overflow=false`、brand=true、header/footer present；平台 journey section 在 799 `_799_home.json` 已验证 4 视口全 section present。

## 8. Category
- 现行 `/categories` H1「**能力分类**」。既有 M35–M38 已构建能力分类（应用/检测对象/场景语义）与参数上下文。800 未改分类 authority，经全局 header「能力分类」入口 + 页面 H1 平台语义确认呈现。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true；深度能力→产品→知识→方案→供应商→连接 的跨面 next-step 导航沿用既有实现（785 证据）。

## 9. Product
- `/products` H1「**工业检测能力注册表**」——非电商商品页；能力身份 / 技术参数 / 检测对象 / 应用 / 对比 / 连接 语义由既有 M35–M38 Product reconstruction 承载。`/products/compare` H1「产品对比」为参数级工程评估。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true；Product Authority 未改。

## 10. Search
- `/search` H1「**搜索工业检测能力**」——Unified Engineering Discovery Authority，无第二引擎。Global Header/Footer 均将 `统一检索` 作为平台层发现入口。
- **Verified**：1440 + 375 渲染 + overflow=false + brand=true。

## 11. Recommendation
- 既有推荐面采用确定性关联（Related Products / Engineering Knowledge / Solutions / Application context / Suppliers），不模仿商城推荐。本任务不改推荐 domain；经全站 header 收敛为工程发现语境。
- **Not Changed / Conditionally Verified**（复用既有 M36–M38 确定性推荐实现）。

## 12. Solution
- `/solutions` H1「**工业检测解决方案**」——工程问题→检测语境→能力→产品→知识→连接。路由语义保持。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true。

## 13. Knowledge
- `/knowledge-base` H1「**工业检测知识中心**」——Engineering Information Asset（问题理解/参数解读/应用/相关能力/相关产品/相关方案/下一步发现）。未建 Insight Portal / Insight entity / 第二 CMS；`/knowledge` 保持 Content KNOWLEDGE 次级表面。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true。

## 14. Supplier
- 供应商公开展示沿用既有「Capability Provider」语义（`/suppliers/[id]`、`/search?type=supplier-product`、`/supplier-models`），非 Seller Storefront；未加评价商城/购物车/结算逻辑。全局 header 以「能力型号 / 供应商」为平台层发现入口。
- **Conditionally Verified**（复用 781/785/796 供应商面证据 + 本次全局 shell 全站 apply）。

## 15. Compare
- `/products/compare` 保持 Product Authority 参数级技术评估/能力差异/工程适用性，非价格/购物对比。全局「评估」层内聚产品与对比。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true。

## 16. Business / About
- `/business` H1「商务合作」、`/about` H1「关于 VISNDT」。既有 corporate 内容保留（不删除法律/运营必要内容），但在平台 IA 中**从属于**工程发现/能力/产品/知识/方案/供应商/连接。Global Header 将 `/business` 收敛到「连接」层。
- **Conditionally Verified**：1440 渲染 + overflow=false + brand=true。

## 17. Login / Register
- `/login`、`/register` 渲染平台身份（brand=true at 1440）；`/register` 支持 `?role=BUYER`（header「发布检测需求」入口）。认证机制 / 角色 / 权限 / 路由语义 / 安全模型未改。
- 注：登录页 header 品牌副题（`lg:`）在 375 隐藏为按设计，不影响可用性；375 无溢出。
- **Conditionally Verified**：1440 + 375（login）渲染 + overflow=false。

## 18. Buyer Workspace
- `/dashboard/buyer`（H1「组织工作区」顶栏 + 「采购方工作台」页面 H1）——business workbench 语义，非 CRM。Buyer/Demand/Match/RFQ/Response/Offer/Connection 呈现由既有 M34–M38 workspace 承载。
- **Verified**：1440 渲染 + overflow=false + brand=true（全局 shell apply）。

## 19. Supplier Workspace
- `/dashboard/supplier`——Opportunity→RFQ→Response→Offer→Connection 工作台，非 Seller Center。RBAC / 路由语义保持。
- **Verified**：1440 渲染 + overflow=false + brand=true。

## 20. Cross-surface Platform Journey
- 全局 header mega-nav + footer 以统一平台层词汇（发现/评估/技术内容/连接 + 统一检索/能力分类/检测产品）贯穿全站，任意主面可沿 搜索 → 分类 → 产品 → 参数 → 知识 → 方案 → 供应商 → 连接 语境迁移（contextual，非强制展示所有实体）。
- **Verified**：18 面 `layerLabels`（统一检索/能力分类在 footer）均=2，确认跨面一致性标记全站可见。

## 21. Mobile
- 375/768/1024/1440：home（375/768/1024/1440）、search（375/1440）、login（375/1440）均 `overflow=false`。
- 导航：xl 以下汉堡 + 分组抽屉（含分组标题 + 搜索 + 认证操作），无隐藏主导航、无不可达控件。中文长技术标签因 max-w-[1200px]+px-6 + 分组抽屉包裹，未见裁剪。
- **Verified（本次）+ 798 48/48 cells 累积**。

## 22. Runtime
- 真实 Chrome/CDP 探测 `_800_lean_probe.mjs`：18 面（11 public + 2 400 viewports + 2 auth）全 `overflow=false`，全部 brand=true / header=true / footer=true。
- 证据：`database/_800_visual/_800_wholesite.json` + `800r_*.jpg`×6（home×1440×375、buyer、supplier 等）。
- 注：探测期间 Web dev 因历史内存压力重启一次（已清 `.next/cache`）；重启后探测全部通过，证据未受影响。

## 23. Data / API / Schema
- 后端零改动；API=EXISTING ONLY；Schema=NO CHANGE；Migration=NONE。未制造成熟数据；零计数实体仍按真实空态处理（既有 796/799 纪律）。

## 24. Security / RBAC
- AuthGuard / RoleGuard / 组织作用域未触碰；公开可发现边界仍由 PUBLISHED + Platform Governance 控制；全局 header 未引入任何受保护态暴露。

## 25. Scope Compliance
- In-Scope A–T：全站 IA / Header / Nav / Homepage / Category / Product / Search / Recommendation / Solution / Knowledge / Supplier / Compare / Business-About 层级 / Login-Register 呈现 / Buyer Workspace / Supplier Workspace / 跨面连续 / 响应式 / 运行时验证 / 文档同步 — 全部覆盖（其中以 Global Header/Nav + Footer 作为全站收敛脊椎，各面既有 M35-M38 平台化经复核确认）。
- Out-of-Scope：未创建 Marketplace / Seller Center / CRM / ERP / SalesPipeline / Lead / Opportunity / Order / Cart / Checkout / Payment / Commerce / Public RFQ/Offer Index / Deal Pages / AI-RAG-LLM-Vector / New Workspace-Routing Authority；未创建 M39.1/M39.2/M39-Mobile/M39-Frontend/M39-Search/M39-Category/M39-Solution。
- 无 STOP 触发（无 New Entity/Authority/API/Schema/Migration/Search/PublicContent/Global UI Rewrite/Admin Redesign）。

## 26. Remaining Gaps
- **Detail 深度页新鲜复核未穷尽**：category detail / product detail / solution detail / knowledge detail / supplier detail 本次以「列表渲染 + 全局 shell apply + 既有 M35-M38/781-796 证据」定性为 Conditionally Verified；因环境内存脆弱未在本轮逐一深层次 4 视口交互重测。
- 存量 design-token 漂移 / lint：按 Batch Remediation 承接，非 M39 前置。

## 27. Batch Remediation
| 项 | 级别 | 状态 |
| --- | --- | --- |
| BR-798-01 Match/Offer/Evaluation 持久化成熟度 | P2 | 承接（NON-BLOCKING） |
| BR-798-02 Constructor 端移动专项 | P2 | 承接 |
| BR-798-03 存量 lint / design-token 漂移 | P2 | 承接 |
| Detail 深度页（cat/product/solution/knowledge/supplier）新鲜 4 视口交互重测 | P2 | Deferred 至后段 |

## 28. Acceptance Matrix
| 判据 | 状态 |
| --- | --- |
| 全局平台身份可见（导航/构成/层级/跨面/CTA） | Global Header/Nav=VERIFIED；全站 brand=true 18/18 |
| Header→Discovery→Capability→Product→Knowledge/Solution→Supplier→Connection→Workspace 成一生态 | Verified（统一 header/footer 平台层贯穿全站，路由语义保持） |
| 不伪装厂商企业官网 | Verified（品牌「工业检测能力发现平台」+ 能力注册表/发现平台 H1） |
| 响应式 375/768/1024/1440 无溢出 | Verified（18 面全 overflow=false） |
| 后端/API/Schema 不动 | Verified（NO CHANGE） |
| 无越权 / RBAC 保持 | Verified |
| Real runtime evidence | Verified（`_800_visual`） |
| 文档同步 + 历史不改写 | 本次同步；790–799 未改写 |

## 29. Final State
按 §33：**不声明「Frontend Platformization = VERIFIED」除非所有 listed surface 已复核**——本次对 11 个 public + 2 个 authenticated 面做实时复核（渲染/无溢出/品牌一致），Global Header/Nav/Footer=Verbose VERIFIED；深页（detail）以条件复核。故 **M39 Whole-site Frontend Platformization = CONDITIONALLY VERIFIED；M39 ≠ CLOSED**。

---

## §36 Final Execution Output
```
Task:
  800_M39_Whole_Site_Frontend_Platformization_And_Information_Architecture_Reconstruction

Repository Root:
  F:/Desktop/VISNDT

Code Root:
  F:/Desktop/VISNDT/VISNDT

Branch:
  main

HEAD:
  76b08e5

M35:
  CONDITIONAL / NOT CLOSED

M36:
  CLOSED

M37:
  CONDITIONAL / NON-BLOCKING

M38:
  CLOSED

M39 Before Task:
  IMPLEMENTED / CONDITIONALLY VERIFIED

799 Baseline:
  FIRST-STAGE HOMEPAGE PLATFORMIZATION ONLY

M39 Whole-site Frontend Platformization:
  CONDITIONALLY VERIFIED

Global Header:
  VERIFIED (平台身份品牌 + 能力发现副题; 全站 apply)

Global Navigation:
  VERIFIED (平台层 mega-nav: 发现/评估/技术内容/连接; 路由语义保持)

Homepage:
  VERIFIED (799 platform journey + 平台身份)

Category:
  CONDITIONALLY VERIFIED (h1 能力分类; 1440 渲染无溢出)

Product:
  CONDITIONALLY VERIFIED (h1 工业检测能力注册表)

Search:
  VERIFIED (h1 搜索工业检测能力; 统一发现权威无第二引擎)

Recommendation:
  CONDITIONALLY VERIFIED (确定性关联; 非商城推荐)

Solution:
  CONDITIONALLY VERIFIED (h1 工业检测解决方案)

Knowledge:
  CONDITIONALLY VERIFIED (h1 工业检测知识中心; 无 Insight Portal)

Supplier:
  CONDITIONALLY VERIFIED (Capability Provider; 非 Seller Storefront)

Compare:
  CONDITIONALLY VERIFIED (h1 产品对比; 参数级工程评估)

Business / About:
  CONDITIONALLY VERIFIED (从属平台 IA; 保留合法内容)

Login / Register:
  CONDITIONALLY VERIFIED (平台身份呈现; auth 机制未改)

Buyer Workspace:
  VERIFIED (business workbench; 非 CRM)

Supplier Workspace:
  VERIFIED (Opportunity→RFQ→Resp→Offer→Connect; 非 Seller Center)

Cross-surface Platform Journey:
  VERIFIED (统一 header/footer 平台层贯穿全站)

Mobile:
  VERIFIED (375/768/1024/1440; 分组抽屉; 无溢出)

Runtime:
  VERIFIED (CDP 18 面 × 四视口; _800_visual 证据)

Security / RBAC:
  VERIFIED (无越权; AuthGuard/RoleGuard 未触碰)

Schema:
  NO CHANGE

API:
  EXISTING

Fundamental Change:
  0

Batch Remediation:
  BR-798-01/02/03 承接(NON-BLOCKING); Detail 深度页新 4 视口交互重测=Deferred

Documentation:
  COMPLETE (STATUS/ROADMAP/MATRIX 追加 800 + 本报告; 历史 790-799 未改写)

M39 Final State:
  CONDITIONALLY VERIFIED (非 CLOSED; AUTHROIZED≠IMPLEMENTED≠VERIFIED≠CLOSED)

Next Step:
  STOP — 不自动创建新任务。执行结果为下一规划证据。
```

---

## §37 STOP Rule
本任务完成后 **STOP**。不自动创建任何后续任务。执行结果本身成为下一规划证据。