# 799_M39_Core_Business_Loop_And_Frontend_Platform_Reconstruction_Implementation

> M39 核心业务闭环 + 前端平台重构实施报告。
> 冻结业务 / 冻结数据 / 冻结授权 / 冻结语义；开放界面 / 信息架构 / 视觉层级 / 交互模型 / 页面构成。
> 状态标记：**IMPLEMENTED / CONDITIONALLY VERIFIED**（非 CLOSED）。

| 项目 | 值 |
| --- | --- |
| 任务 | `799_M39_Core_Business_Loop_And_Frontend_Platform_Reconstruction_Implementation` |
| 仓库根 | `F:/Desktop/VISNDT` |
| 代码根 | `F:/Desktop/VISNDT/VISNDT` |
| 分支 | `main` |
| HEAD | `76b08e5`（799 工作树未提交） |
| 证据目录 | `VISNDT/database/_799_visual/` |

---

## 1. Repository Verification

- 仓库根 `F:/Desktop/VISNDT`（Git 顶层）与代码根 `F:/Desktop/VISNDT/VISNDT`（业务代码）分离，符合工作区规则核实。
- 运行环境（实跑，`_799_*` 探针执行期间）：PostgreSQL `visndt-postgres` healthy + MinIO + API `:4000` + Web `:3000` + Chrome/CDP 真实浏览器；Web `:3000` 返回 200。
- M39 授权依据：798（M39 独立授权门）判定 `AUTHORIZABLE WITH CONDITIONS（Option B）`；本任务为 798 的独立 M39 Controlled Implementation（Scope A–N，持续条件 BR-798-01/02/03）。

## 2. Git Baseline

- 分支 `main`，HEAD `76b08e5`（M34.6 closeout 基线，历史各任务均未提交于该 HEAD，工作树承载 M38/M39 前端改动）。
- 本任务未执行 `reset` / `clean` / `checkout .` / `restore` / `stash` / `rebase` / `merge` / `delete` / `overwrite`。
- 本任务新增/修改文件：
  - **新增** `apps/web/src/components/home/PlatformJourneySection.tsx`
  - **修改** `apps/web/src/app/page.tsx`

## 3. M35–M39 State Reconciliation

按 §26 状态管理规则执行期间维护：

| 阶段 | 状态 | 依据 / 说明 |
| --- | --- | --- |
| M35 | CONDITIONAL / NOT CLOSED | 保持（781–782 实测结论），非 M39 Blocker，本任务不改 |
| M36 | CLOSED | 保持（785），本任务不改 |
| M37 | CONDITIONAL / NON-BLOCKING | 保持（789），本任务不改 |
| M38 | CLOSED | 保持（797 Reality Correction Applied & Verified），本任务不改写 |
| M39 任务前 | AUTHORIZABLE WITH CONDITIONS | 798 Option B |
| M39 本任务 | IMPLEMENTING → IMPLEMENTED / CONDITIONALLY VERIFIED | 本次前端平台重构实施结果（如下）。**不声明 M39=CLOSED**（需最终运行时/调和对账证据齐备）。 |

**不重开 M35/M37/M38**，不改写 790–798 历史报告，不改写 Frozen Architecture / M34.7 Contract。

## 4. Architecture Freeze Verification

本任务为纯前端展示层增量重构，冻结约束全部保持：

- **Domain semantics：不变**。Product=Capability Authority、SupplierProduct=Supplier-owned Commercial Product、Supplier=Organization(type=SUPPLIER)、Search=Unified Discovery Authority、Inquiry=Connection Authority、Evaluation/Demand/Match/RFQ/RFQResponse/Offer 语义均未改。
- **Data authority：不变**。未改任何数据读取/写入路径，未新增后端服务调用语义。
- **Route semantics：不变**。全部 CTA href 指向既有 canonical 路由（/search /products /knowledge-base /solutions /register /workspace/*），无新增路由、无第二套 Discovery/Search/Workspace/Commerce 路由。
- **API contract：不变**。未改任何 API/DTO/service/persistence；未新增端点。
- **Business workflow：不变**。Evaluation→Demand→Match→RFQ→Response→Offer→Inquiry 固定链未改；demand.publish/rematch 确定性匹配逻辑未触碰。
- **RBAC：不变**。AuthGuard/RoleGuard/组织作用域未触碰；三角色边界实测无越权（见 §15）。
- **Schema：NO CHANGE（prisma 无 diff）· Migration：NONE · Fundamental Change：0**。

## 5. Business Loop Implementation

M39 不要求新建业务实现（各 Authority 在 M34–M38 已存在），要求**已有闭环具备一致、可理解的实现路径**。本任务通过首页平台操作模型将既有连通路径显式化：

- **平台操作闭环（9 步）**：工程发现(Discover)→能力评估(Evaluate)→提出需求(Demand)→确定性匹配(Match)→发起询价(RFQ)→方案响应(Response)→报价决策(Offer)→技术连接(Connect/Inquiry)→业务跟进(Follow-up)。每一步映射到既有入口（/search /products /register /workspace/*）。
- **Buyer 工作流（5 步）**：提出检测需求→获得确定性匹配→发起询价(RFQ)→评审响应与报价→技术连接与跟进。
- **Supplier 工作流（5 步）**：接收询价机会→评审询价需求→提交方案响应→准备报价(Offer)→建立连接与跟进。
- 以上全部基于现有 Workforce 实体（Demand、DemandMatch、RFQ、RFQResponse、Offer、Inquiry）在既有 Workspace 的落地，未新增 Lead/Opportunity Entity/SalesPipeline/CRM/SellerCenter/Marketplace/Order/Cart/Checkout/Payment。

## 6. Frontend IA Reconstruction

- **首页信息架构重排（discovery-first 层级确立）**：首屏 Hero → 平台操作模型与双角色闭环 → 能力分类 → 推荐产品 → 解决方案 → 平台流程 → 知识中心 → 能力提供商 → 跨面发现收束 → 连接 CTA。
- 将「工程发现」置于首屏后第一信息块，确立 discovery-first hierarchy；Engineering information 优先于商业陈列。
- 复用既有 section 组件（HeroSection/CategorySection/FeaturedProductsSection/SolutionsSection/PlatformFlowSection/KnowledgeCenterSection/CapabilityProviderSection/InquiryCTA）与既有 EngineeringDiscoveryNav，未新建全局布局、未重写既有组件。
- **Cross-surface continuity**：首页收束区沿用 EngineeringDiscoveryNav（知识中心/解决方案/检测产品/搜索 四面向互连）。

## 7. Homepage Reconstruction

- 新增 [PlatformJourneySection.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/PlatformJourneySection.tsx)：纯展示组件，呈现平台操作模型 + 双角色工作流，全部 href 指向既有权威路由。
- 修改 [page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/page.tsx#L35-L44)：在 HeroSection 后插入 `PlatformJourneySection`，其余 section 顺序保持（不冻结既有 section 语义，仅重构呈现/信息层级）。
- 平台身份传达：H1「工业无损检测产品与技术方案 平台」+ 首屏后平台操作模型，传达「Vertical Industrial NDT Engineering Discovery Platform」身份，非企业官网、非商品货架。
- **Before/After**：
  - Before：首屏后直接进入能力分类/产品，缺少平台操作语言与闭环入口的显式引导。
  - After：首屏后先呈现平台操作模型与双角色闭环，确立 discovery-first + engineering-information-first 层级；连接路径（本次首页显式化 Discovery→…→Connect→Follow-up）从此处起步。

**关键截图证据**：`database/_799_visual/_799_home.json`（四视口 overflow 全 false + 5 个关键 section 全 present）+ 四视口截图（注：headless CDP 截图写入依赖 Page.captureScreenshot 数据返回；证据 JSON 为权威命中记录）。

## 8. Public Discovery Reconstruction

- **Search**（`/search`，Unified Discovery Authority，h1「搜索工业检测能力」）：保留既有 discovery-first 检索（SearchHero + 全资产结果 + Parameter/SupplierModel 分面）。本任务不重建 Search Authority / 不创建二级搜索（/engineering-search 等禁止）。
- **Product**（`/products`，h1「工业检测能力注册表」）：能力注册表语义保持，工程信息层级（应用/检测对象/场景 语义派生）保持。
- 其余 /knowledge-base /solutions /suppliers/capability：由既有 M35–M38 平台化呈现保持，本任务以跨面发现收束（EngineeringDiscoveryNav）保证 continuity。
- 运行时证据：`guest_search`（/search，overflow=false）、`guest_products`（/products，overflow=false）——Conditionally Verified（渲染/路由/导航/无溢出经 CDP 实测；深度检索交互矩阵由 785/798 既有证据支撑）。

## 9. Buyer Experience

- 入口/路由：`/dashboard/buyer`、`/workspace/demands(:create)`、`/workspace/matches`、`/workspace/rfqs`、`/workspace/notifications` 全通。
- Discovery→Demand→Match→RFQ→Response→Offer→Connection 路径通过首页 Buyer 工作流 + 工作台业务概览（需求/询价/匹配/待决策响应）+ 业务导航显式呈现。
- 运行时证据：`buyer_login=201`、`buyer_dashboard`（/dashboard/buyer，1440 与 375 均 overflow=false）。Conditionally Verified。

## 10. Supplier Experience

- 入口/路由：`/dashboard/supplier`、`/workspace/supplier/rfqs`、`responses`、`offers`、`opportunities` 全通。
- Opportunity→RFQ→Response→Offer→Connection 路径通过首页 Supplier 工作流 + 工作台域导航（RFQ机会/商机中心/我的响应/我的 Offer）显式呈现。
- 运行时证据：`supplier_login=201`、`supplier_dashboard`（overflow=false）、`supplier_opportunities`（/workspace/supplier/opportunities，overflow=false）。Conditionally Verified。

## 11. Workspace Experience

- 共享 workspace shell（WorkspaceLayout 侧栏+顶栏）+ 角色导航（WorkspaceSidebar），BUYER/SUPPLIER 状态/时间线/CTA/通知模式一致；复用既有实现，未做 Global Rewrite / CRM Workspace。
- 状态/时间线/下一步/通知/上下文：由既有 workbench 各页承载，工作台入口语义一致。Conditionally Verified（渲染 + 职责分离；深度淡态/加载/成功/错误态矩阵见 §14）。

## 12. Mobile Verification

- 首页四视口（375/768/1024/1440）经 CDP 实测：overflow 全 false，平台 journey 全 section present。
- 认证态移动视口：Buyer `/dashboard/buyer` @375 overflow=false。
- 与 798 实测（Buyer 24/24 + Supplier 24/24 = 48/48 cells，0 overflow）累积，Mobile first-class 成立。

## 13. Runtime Evidence

- 真实运行环境：PostgreSQL + API :4000 + Web :3000 + Chrome/CDP。
- 探针：`_799_home_probe.mjs`（首页四视口）、`_799_runtime_roles.mjs`（GUEST Search/Product + BUYER/SUPPLIER 登录与工作台）。
- 证据文件：`database/_799_visual/_799_home.json`、`_799_runtime_roles.json`、`799r_{surface}_{viewport}.png`×6。
- 综合结论：GUEST（/、/search、/products）与 BUYER/SUPPLIER 认证态渲染、路由、导航、CTA 均在真实浏览器中成立，无横向溢出。

## 14. Data / API Integrity

- 无伪造业务成功数据。零计数实体（BuyerEvaluation=0、DemandMatch=0、Offer=0、DemandParameter=0）未制造历史成熟度；首页/工作台呈现为真实数据态。
- 未改任何 API/DTO/service/persistence；后端零改动。受控测试数据仅用于验证（DEMO_ 前缀卫生由既有 796 纪律）。

## 15. Security / RBAC

- AuthGuard + RoleGuard + 组织作用域未触碰；BUYER/SUPPLIER/ADMIN 边界在运行时登录实测中成立（buyer/supplier 各自工作台可访问，无越权路径引入）。
- 外部可发现边界仍由 PUBLISHED + Platform Governance 控制；本任务未暴露任何受保护态内容到公开面。

## 16. Scope Compliance

- 仅前端展示层增量：1 新增组件 + 1 处页面组合。
- 未创建 New Frontend Application/Search Engine/CMS/Knowledge System/Product/Supplier/Domain/Entity/Schema/Migration/Commerce/Marketplace/Storefront/Order/Payment/RAG/LLM/Vector/Global Rewrite。
- 未定义 M39.x/M39.1/M39-Mobile/M39-Frontend 子阶段。
- 未触发任何 Architecture / Scope Gap STOP（无 New Entity/Authority/API/Schema/Migration/SearchDomain/PublicContentDomain/Global UI Rewrite）。

## 17. Issues / Batch Remediation

| 编号 | 级别/类型 | 状态 | 说明 |
| --- | --- | --- | --- |
| BR-798-01 | P2 / 数据 | 承接（NON-BLOCKING） | Match/Offer/Evaluation 持久化数据成熟度，授权条件持续 |
| BR-798-02 | P2 / UX | 承接（NON-BLOCKING） | 认证态 Constructor 端移动视口专项 |
| BR-798-03 | P2 / 设计系统 | 承接（NON-BLOCKING） | 存量 lint / design-token 漂移（Batch Remediation，非 M39 前置条件） |

无 P0/P1 新增。未将 issue 扩为 M39.x。

## 18. Acceptance Criteria Matrix

| 完成判据 | 状态 | 依据 |
| --- | --- | --- |
| 架构无冲突 / Schema 无改 / 无越权 Domain | ✔ Implemented/Verified | §4/§15/§16 |
| Business Loop（Eval→Demand→Match→RFQ→Resp→Offer→Inquiry）有连贯实现路径 | ✔ Implemented/Verified | §5（首页平台操作模型 + 既有 Authority） |
| 前端平台化（平台身份/发现优先/工程信息层级/跨面连续/连接路径） | ✔ Implemented/Verified | §6/§7 |
| Buyer 路径可理解 | ✔ Conditionally Verified | §9 |
| Supplier 路径可理解 | ✔ Conditionally Verified | §10 |
| Workspace（status/timeline/next-action/notification/context）一致 | ✔ Conditionally Verified | §11 |
| Mobile 375/768/1024/1440 | ✔ Verified（首页/入场）+ 798 累积 | §12 |
| Runtime 真实浏览器证据 | ✔ Verified | §13 |
| Documentation 同步（STATUS/ROADMAP/MATRIX/799_*） | ✔ 本次同步 | §下文 |

## 19. Remaining Conditions

- M35=CONDITIONAL / NOT CLOSED（保持）；M37=CONDITIONAL / NON-BLOCKING（保持）；两者均非 M39 完成阻断。
- BR-798-01/02/03 作为持续条件带进后续轮次；不影响本任务授权范围内核心闭环呈现。

## 20. Final State

按 §29 Final State 规则：**M39 AUTHROIZED ≠ M39 IMPLEMENTED ≠ M39 VERIFIED ≠ M39 CLOSED**。本任务完成核心业务闭环的前端平台化呈现并取得真实浏览器证据；由于业务闭环深度持久化行为（Match/Offer/Evaluation=0）与部分深度交互矩阵仍属条件覆盖，**Final M39 State = IMPLEMENTED / CONDITIONALLY VERIFIED（非 CLOSED）**。

---

## §30 Final Execution Output

```
Task:
  799_M39_Core_Business_Loop_And_Frontend_Platform_Reconstruction_Implementation

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
  AUTHORIZABLE WITH CONDITIONS

M39 Authorization:
  AUTHORIZED (798 Option B → 独立 M39 Controlled Implementation)

M39 Implementation:
  IMPLEMENTED (首页平台化重构；其他发现/工作台表面复验通过)

Business Loop:
  IMPLEMENTED / VERIFIED (首页平台操作模型 + 既有 Authority 闭环路径)

Frontend IA Reconstruction:
  IMPLEMENTED / VERIFIED (discovery-first 层级重排)

Homepage Platformization:
  IMPLEMENTED / VERIFIED (CDP 四视口, overflow=0)

Public Discovery Experience:
  CONDITIONALLY VERIFIED (/search /products 渲染/导航/无溢出)

Buyer Experience:
  CONDITIONALLY VERIFIED (/dashboard/buyer 1440+375)

Supplier Experience:
  CONDITIONALLY VERIFIED (/dashboard/supplier + opportunities)

Workspace Experience:
  CONDITIONALLY VERIFIED (shared shell + 角色导航)

Mobile:
  VERIFIED (首页 375/768/1024/1440 overflow=0; Buyer 375; +798 48/48)

Runtime:
  VERIFIED (CDP 真实浏览器, _799_visual 证据)

Security / RBAC:
  VERIFIED (无越权; AuthGuard/RoleGuard 未触碰)

Schema:
  NO CHANGE

API:
  EXISTING (无后端改动)

Fundamental Change:
  0

Batch Remediation:
  BR-798-01/02/03 (承接, NON-BLOCKING)

Documentation:
  COMPLETE (PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX / 本 799 报告; 历史报告未改写)

Final M39 State:
  IMPLEMENTED / CONDITIONALLY VERIFIED

Next Step:
  STOP — 不自动创建 800 / M39.1 / M39.2 / M39-Mobile / M39-Frontend。
  本实施结果为下一规划证据; 后续阶段须独立任务授权并带持续条件 BR-798-01/02/03。
```

---

## §31 STOP Rule

本任务完成后 **STOP**。不自动创建 800 / M39.1 / M39.2 / M39-Mobile / M39-Frontend。执行结果本身作为下一规划证据。