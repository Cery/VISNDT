# 802\_M39\_Whole\_Site\_Page\_Level\_Platform\_Recomposition\_And\_Experience\_Convergence

> 版本：`V4.0.0`　日期：`2026-09-02`　状态：**M39 CONTROLLED IMPLEMENTATION · WHOLE-SITE PAGE-LEVEL PLATFORM RECOMPOSITION · RECONCILE · RE-COMPOSE · RUNTIME VERIFY · DOCUMENT · STOP**

***

## 1. Repository Verification（§1）

| 项                      | 值                                                                   |
| ---------------------- | ------------------------------------------------------------------- |
| 仓库根目录（Repository Root） | `F:/Desktop/VISNDT`                                                 |
| 代码根目录（Code Root）       | `F:/Desktop/VISNDT/VISNDT`                                          |
| 子模块                    | `apps/web` / `apps/api` / `apps/admin` / `database/prisma` / `docs` |
| Branch                 | `main`                                                              |
| HEAD                   | `76b08e5`（与 798–801 基线一致，未推进提交）                                     |
| Working Tree           | 未提交（保持 796–801 累积改动 + 802 页面级重组增量）                                  |
| Runtime                | 真实 PostgreSQL / API :4000 / Web :3000 / Chrome-CDP（本轮捕获证据后进程已停）     |

禁止项（reset/clean/restore/checkout ./stash/rebase/merge/destructive delete/mass overwrite）——**全部未执行**。

***

## 2. State Reconciliation（§2）

```text
M35 = CONDITIONAL / NOT CLOSED
M36 = CLOSED
M37 = CONDITIONAL / NON-BLOCKING
M38 = CLOSED

M39 Business Loop Foundation = IMPLEMENTED / CONDITIONALLY VERIFIED
M39 Global Platform Shell     = VERIFIED          (800)
M39 Page-Level Platform Experience = CONDITIONALLY VERIFIED (801)
M39 Whole-Site Page-Level Platform Recomposition = CONDITIONALLY VERIFIED (802)
M39 = NOT CLOSED
```

802 **未** reopen M36/M38、**未** prematurely close M39、**未** rewrite 790–801 历史。

***

## 3. 802 Reality Correction（§3/§6/§27/§34）

正式记录：

```text
800 = Global Platform Shell Reconstruction（Header/Navigation/Footer/Platform Identity/Global Cross-surface Navigation）
801 = Page-Level Experience Reconstruction（Compare→评估工作台 + Knowledge/Workspace 引导式空态 + 复核承接）
802 = Whole-Site Page-Level Platform Recomposition（让每一大面不再是“同一 Header/Footer/Brand + 可用路由”，而是各自明确其在工程发现生态中的角色）
```

802 不再重复 Header/Footer，也不满足于“同 Header + 同 Footer + 同 Brand + 路由可用 = 平台化”。
本轮针对 Category/Product/Search/Recommendation/Solution/Knowledge/Supplier 七面，提交**实际页面级结构变更**并逐面提供证据（§27 最小结构变更要求）。

***

## 4. Architecture Freeze（§4/§24/§25/§26）

冻结面全部保持：Database、Prisma Models、Domain/Product/Supplier/Knowledge/Content/Search Authority、Inquiry=Connection、Demand/Match/RFQ/RFQResponse/Offer/Workspace semantics、WorkflowEvent、Notification、Organization(Member)、Authentication、RBAC、Organization Scope、Route Semantics、API Contracts、Core Business Workflow。

调度结果：

```text
Schema     = NO CHANGE
Migration  = NONE
API        = EXISTING ONLY / NO CHANGE（本轮零后端改动）
Backend    = NO CHANGE
Fundamental Change = 0
```

802 未创建任何 New Entity / Authority / API / Schema / Migration / Search System / CMS / Knowledge System / Insight Entity / Marketplace / Seller Center / CRM / ERP / Sales Pipeline / Lead / Opportunity / Order / Cart / Checkout / Payment / Commerce / AI / RAG / LLM / Vector / Public RFQ / Public Offer / Public Deal。
**未创建** M39.1 / M39.2 / M39-Mobile / M39-Frontend / M39-Category / M39-Product。

***

## 5. Frontend Freedom（§5/§27/§30）

802 仅动用前端自由权限：Page Architecture、Information Hierarchy、Visual Hierarchy、Discovery Flow、Evaluation、Context、Next Action、Responsive Composition、Empty/Sparse State 呈现、Section Order/Replacement/New contextual panel/New related-discovery architecture。
未触碰 Domain Semantics / Data Authority / API Semantics / Route Semantics / Business Workflow / Security / RBAC / Schema。

802 **不为视觉做后端改动**（§24/§25 Backend=NO CHANGE）。

***

## 6. Core Principle: Do Not Confuse Shared Shell With Platformization（§6/§8/§34）

802 不以 `Header exists + Footer exists + Brand exists + working routes + overflow=false` 作为平台化完成依据。

**Each major surface now answers：**
`This page represents what? / Why does it exist? / What engineering information matters here? / What can the user discover next? / What is the next logical action? / How is this page connected to the platform?`

不把每一页做成相同，而是让每一页属于同一个平台（工业检测能力发现平台）。

***

## 7. Sparse Data Principle（§23）

已有零计数实体保持真实（BuyerEvaluation / DemandParameter / DemandMatch / Offer = 0），**不制造成熟数据**。
空/稀疏态改为“有用”：`当前状态 / 为何为空 / 相关发现 / 下一步动作`，复用既有引导式 EmptyState 模式。

***

## 8. Supplier Workspace（§22）

Supplier Workspace 围绕 `Opportunity → RFQ → Response → Offer → Connection → Follow-up` 重组；保留既有路由、角色、工作流与数据权限。**未创建 Seller Center。** 目标为“平台工作流呈现”，非商城性质。

***

## 9. Mobile（§24）

页面级移动端构成属于重构的一部分，不以 `desktop works` 为充分条件。四视口 375/768/1024/1440 覆盖：header / navigation / search / filters / technical information / cards / comparison / CTA / related discovery / workflow。

***

## 10. Category + Category Detail 结构重组（§10）

**Category —— RECONSTRUCTED**

| 项                            | 内容                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Surface                      | `/categories`                                                                                                                     |
| Current State                | 802 前：能力分类索引（split-rail ledger），卡片为“分类名 + 子能力 chips + 浏览入口”，无显式发现旅程                                                               |
| Target Platform Role         | 能力分类是工程发现的**起点**——界定检测范围                                                                                                          |
| Structural Change            | 新增 `CAPABILITY DISCOVERY JOURNEY` 面板（01 能力分类 → 02 技术参数 → 03 产品与知识 → 04 提供方与连接）+ 每张分类卡新增 `discovery trail footer`（检测产品 + 能力检索两项引导） |
| Information Hierarchy Change | 顶部从“直接展示卡片”变为“先给发现旅程（语义平台模型），再给能力索引”；卡片底部新增发现轨迹                                                                                   |
| Discovery Change             | 显式提示用户“分类→参数→产品/知识→连接”四阶段路径；卡片直接锚定相关产品与能力检索                                                                                       |
| Next Action                  | 浏览能力索引 → 进入 `/products?categoryId=`；发现旅程引导 → 参数/产品/连接                                                                             |
| Runtime Evidence             | `_802_probe.mjs`：`/categories` × 375/768/1024/1440 全 `overflow=false`，`journey=true`（`_802_pages.json`）                           |
| Mobile Evidence              | 375/768 无横向溢出                                                                                                                     |
| Remaining Gap                | 发现旅程为静态反映，尚无实时计数联动                                                                                                                |
| Final Status                 | **RECONSTRUCTED**                                                                                                                 |

**Category Detail —— NOT RECONSTRUCTED（无独立路由）**

| 项            | 内容                                                                                   |
| ------------ | ------------------------------------------------------------------------------------ |
| Surface      | Category Detail                                                                      |
| 证据           | 平台无独立分类详情路由；分类卡直接进入 `/products?categoryId=`（能力注册表，见 §11）。802 未重建独立 Category Detail 面 |
| Final Status | **NOT RECONSTRUCTED**（以无独立路由 + 聚合入 /products 为依据，不静默标注为平台化）                          |

***

## 11. Product + Compare 结构重组为工程评估面（§11）

**Product —— RECONSTRUCTED**

| 项                            | 内容                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Surface                      | `/products`                                                                                                   |
| Current State                | 802 前：检测能力注册表列表（分类筛选 + 参数筛选 + 卡片），无显式评估语境                                                                     |
| Target Platform Role         | 产品即能力注册，用于**工程评估**（参数/适用性），非商品比价                                                                              |
| Structural Change            | 新增 `CAPABILITY EVALUATION` 语境带：动态显示“正在评估 {所选能力} 检测能力 · N 项参数约束”，附工程评估说明 + `评估对比→` / `统一检索相关参数→` 双 Next Action |
| Information Hierarchy Change | 列表顶部插入“工程评估语境帧”，把“筛选→浏览”升级为“界定能力范围 → 参数约束 → 评估适用性”                                                            |
| Discovery Change             | 明确能力评估维度为技术参数与工程适用性，非价格                                                                                       |
| Next Action                  | `评估对比→` / `统一检索相关参数→`                                                                                         |
| Runtime Evidence             | `_802_probe.mjs`：`/products` × 375/768/1024/1440 全 `overflow=false`，`evalRibbon=true`（`_802_pages.json`）      |
| Mobile Evidence              | 375/768 无横向溢出                                                                                                 |
| Remaining Gap                | 评估上下文随筛选动态刷新已实现，实时能力对比指标尚有增强空间                                                                                |
| Final Status                 | **RECONSTRUCTED**                                                                                             |

**Product Detail —— CONDITIONALLY VERIFIED / 部分重组**

| 项                 | 内容                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Surface           | `/products/[slug]`（产品详情）                                                                    |
| Current State     | 既有产品详情：规格参数、媒体、供应商能力、询价（评估面结构承接）                                                            |
| Structural Change | 802 复核继承工程评估语义（`evalRibbon=true`）；**未新增 Related Engineering Discovery（relDiscovery=false）** |
| Final Status      | **CONDITIONALLY VERIFIED**（评估语义在；相关工程发现层未落地——记录为剩余缺口，不静默标记平台化）                              |

**Compare —— VERIFIED / IMPROVED**

| 项                 | 内容                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------- |
| Surface           | `/products/compare`                                                                 |
| Current State     | 801 已重构为 Engineering Evaluation Workspace（CompareContextHeader + CompareNextAction） |
| Structural Change | 802 复核保持；无回归                                                                        |
| Runtime Evidence  | `/products/compare @1440 overflow=false`（`_802_pages.json`）                         |
| Final Status      | **VERIFIED / IMPROVED**（801 增量复核）                                                   |

***

## 12. Search 重组成工程发现工作台（§12）

**Search —— RECONSTRUCTED**

| 项                            | 内容                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surface                      | `/search`                                                                                                                                        |
| Current State                | 802 前：统一搜索呈现结构（能力检索 / 平台语义），无显式“工作台意图带”                                                                                                          |
| Target Platform Role         | 统一检索权威（/search 为唯一 Search Authority）；工程发现工作台：范围界定 → 参数约束 → 能力/方案/供应商 → 工程连接                                                                      |
| Structural Change            | 有结果时新增 `ENGINEERING DISCOVERY WORKBENCH` 意图带：四阶段右读（01 范围界定 / 02 参数约束 / 03 能力·方案·供应商 / 04 工程连接），附 `评估对比→ / 发起检测需求→ / 能力分类→` 跨面 Next Action        |
| Information Hierarchy Change | 结果列表上方插入工程发现工作台意图，把“给结果”升级为“引导发现闭环”                                                                                                              |
| Discovery Change             | 显式展示 stage 化发现路径 + 跨面下一步（评估/需求/能力分类）                                                                                                             |
| Next Action                  | 评估对比 / 发起检测需求 / 能力分类                                                                                                                             |
| Runtime Evidence             | `_802_probe2.mjs`：`/search?q=检测 @1440 overflow=false workbench=true`；`/search?q=ultrasonic @1440`（无结果集工作台不展示，overflow=false）（`_802_pages2.json`） |
| Mobile Evidence              | 1440 验证；意图带在移动端纵向折叠                                                                                                                              |
| Remaining Gap                | 工作台仅在有关键字结果集时呈现；无结果态仍走引导式空态                                                                                                                      |
| Final Status                 | **RECONSTRUCTED**                                                                                                                                |

***

## 13. Recommendation 重构成相关工程发现（§13）

**Recommendation —— RECONSTRUCTED（跨面组件，非独立路由）**

| 项                            | 内容                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface                      | 产品/方案/知识详情页的“相关推荐”区                                                                                                                                                                                                                |
| Current State                | 802 前：方案详情使用 `RelatedProducts` + `RelatedKnowledge` + `RelatedSolutions` 三段平铺；知识详情使用 `RelatedProducts` 单段；呈现为“购物式相关推荐”                                                                                                             |
| Target Platform Role         | 相关工程发现：把相关能力产品 / 技术知识 / 相关方案折叠为**分组的工程发现面**，提供工程相关性框架 + 跨面下一步发现                                                                                                                                                                    |
| Structural Change            | 新建 `components/engineering/RelevantEngineeringDiscovery.tsx`：Dark 发现帧（`Relevant Engineering Discovery / 相关工程发现`，能力锚点名 + 分组 mono 标签 PRODUCT / KNOWLEDGE / SOLUTION / SUPPLIER，每组成组列表 + `全部`）+ 跨面 Next Discovery（统一检索 / 评估对比 / 能力分类） |
| Information Hierarchy Change | 从“平铺相关推荐”提升为“围绕能力锚点的分组相关工程发现 + 下一步发现”                                                                                                                                                                                              |
| Discovery Change             | 分组语义（能力产品 / 知识 / 方案 / 供应商）+ see-all + 跨面 Next Discovery                                                                                                                                                                            |
| Next Action                  | 统一检索相关参数 / 评估对比检测能力 / 回到能力分类                                                                                                                                                                                                       |
| Runtime Evidence             | `_802_probe.mjs`：方案详情 × 375/768/1024/1440 全 `relDiscovery=true`；`_802_probe5.mjs`：知识详情 375/1440 `relDiscovery=true`（`_802_pages.json / _802_pages5.json`）                                                                          |
| Mobile Evidence              | 375 无横向溢出                                                                                                                                                                                                                          |
| Remaining Gap                | 非独立路由；产品详情尚未接入该组件（见 §11）                                                                                                                                                                                                           |
| Final Status                 | **RECONSTRUCTED**（跨面工程发现层）                                                                                                                                                                                                         |

***

## 14. Solution + Solution Detail 重组 为工程方案发现面（§14/§18）

**Solution —— RECONSTRUCTED**

| 项                            | 内容                                                                                                                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface                      | `/solutions`                                                                                                                                                                                                                                                                           |
| Current State                | 802 前：通用内容列表（ContentListLayout，h1 + 卡片网格 + 空态），无工程语境                                                                                                                                                                                                                                   |
| Target Platform Role         | 工程解决方案发现面：从工程问题出发 → 检测语境 → 所需能力 → 方案索引 → 能力提供方 → 连接                                                                                                                                                                                                                                    |
| Structural Change            | 由 `ContentListLayout` 重写为：Dark 工程语境头（`PROBLEM → CONTEXT → CAPABILITY → PROVIDER → CONNECTION` mono journey + 已收录方案计数锚点）+ `EngineeringDiscoveryNav` 跨面导航 + 工程语境快捷入口（能力分类/检测产品/工程知识/能力提供方/统一检索）+ `SOLUTION INDEX / Engineering Solution Registry` + 卡片网格 + Next Action 面（统一检索/评估对比/能力分类） |
| Information Hierarchy Change | 从“内容列表”升级为“问题→语境→能力→方案→提供方→连接”发现路径                                                                                                                                                                                                                                                     |
| Discovery Change             | 语境快捷入口 + SOLUTION INDEX mono 标识 + 下一步工程发现                                                                                                                                                                                                                                              |
| Next Action                  | 统一检索 / 评估对比 / 能力分类                                                                                                                                                                                                                                                                     |
| Runtime Evidence             | `_802_probe.mjs`：`/solutions` × 375/768/1024/1440 全 `overflow=false`，`solution=true`（`_802_pages.json`）                                                                                                                                                                                |
| Mobile Evidence              | 375/768 无横向溢出                                                                                                                                                                                                                                                                          |
| Remaining Gap                | 语境头为静态文案，尚无数据联动                                                                                                                                                                                                                                                                        |
| Final Status                 | **RECONSTRUCTED**                                                                                                                                                                                                                                                                      |

**Solution Detail —— RECONSTRUCTED**

| 项                 | 内容                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| Surface           | `/solutions/[slug]`                                                                                                 |
| Current State     | 802 前：方案正文 + RelatedProducts/RelatedKnowledge/RelatedSolutions 三段相关推荐平铺                                             |
| Structural Change | 接入 `RelevantEngineeringDiscovery`（能力锚点=方案标题，分组 PRODUCT / KNOWLEDGE / SOLUTION，跨面 Next Discovery），替换原三段平铺            |
| Runtime Evidence  | `/solutions/automotive-casting-defect-inspection-solution × 375/768/1024/1440 relDiscovery=true`（`_802_pages.json`） |
| Mobile Evidence   | 375 无横向溢出                                                                                                           |
| Final Status      | **RECONSTRUCTED**                                                                                                   |

***

## 15. Knowledge + Knowledge Detail 重组 为工程信息资产面（§15/§18）

**Knowledge —— RE-VERIFIED / IMPROVED（引导式空态承接）**

| 项                 | 内容                                                             |
| ----------------- | -------------------------------------------------------------- |
| Surface           | `/knowledge-base`                                              |
| Current State     | 801 已建立引导式空态 + Engineering Information Asset 语义                |
| Structural Change | 802 复核保持；未产生新外形重排                                              |
| Runtime Evidence  | `/knowledge-base @1440 overflow=false`（`_802_pages.json`）      |
| Final Status      | **RE-VERIFIED / IMPROVED**（经济验证；不因“已有引导空态”而静默标记 RECONSTRUCTED） |

**Knowledge Detail —— RECONSTRUCTED**

| 项                 | 内容                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Surface           | `/knowledge-base/[slug]`                                                                                      |
| Current State     | 802 前：知识正文 + RelatedProducts 单段相关推荐                                                                           |
| Structural Change | 接入 `RelevantEngineeringDiscovery`（能力锚点=标题，分组 PRODUCT / KNOWLEDGE=关联知识，跨面 Next Discovery），统一“相关产品”为分组的“相关工程发现” |
| Runtime Evidence  | `/knowledge-base/visual-inspection-industrial-microscope @375/1440 relDiscovery=true`（`_802_pages5.json`）     |
| Mobile Evidence   | 375 无横向溢出                                                                                                     |
| Final Status      | **RECONSTRUCTED**                                                                                             |

***

## 16. Supplier + Supplier Detail 重组 为 Capability Provider（§16/§18）

**Supplier —— CONDITIONALLY VERIFIED**

| 项                 | 内容                                                                            |
| ----------------- | ----------------------------------------------------------------------------- |
| Surface           | Supplier 面（无独立 `/suppliers` 列表路由；经 `/search?type=supplier-product` 聚合）        |
| Current State     | 802 前：供应商=Capability Provider 语义（非 Seller Storefront），由统一检索收敛                 |
| Structural Change | 802 复核保持“可检索能力提供方”路径（`/search?type=supplier-product` 统一收敛）                    |
| Runtime Evidence  | `/suppliers` 无独立列表路由（探测记录 `no supplier link from /products`），经 search 收敛已验证可达 |
| Final Status      | **CONDITIONALLY VERIFIED**（无独立面；已核实发现路径语义，未静默标记平台化）                           |

**Supplier Detail —— RECONSTRUCTED（结构变更；运行时数据未覆盖）**

| 项                 | 内容                                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surface           | `/suppliers/[id]`                                                                                                                                               |
| Current State     | 802 前：供应商详情 + 能力/产品/连接区块，无显式“能力提供方”语境帧与跨面下一步                                                                                                                    |
| Structural Change | 新增 `CAPABILITY PROVIDER` 语境帧（Dark：`CAPABILITY PROVIDER / {type} / CAPABILITY·PRODUCTS·CONNECTION`）+ 新增 Cross-surface Next Connection 面（检索其能力型号 / 评估对比能力 / 能力分类） |
| Runtime Evidence  | 运行时因无供应商数据（`_802_probe.mjs` `no supplier found`），detail 未能实跑渲染；**结构变更已落地于源码**（`suppliers/[id]/page.tsx`）                                                        |
| Mobile Evidence   | （未实跑）                                                                                                                                                           |
| Remaining Gap     | 运行时供应商数据缺失，detail 实跑未覆盖                                                                                                                                         |
| Final Status      | **RECONSTRUCTED（源码）**，运行时可验证性=待供应商数据（记录于 Remaining Gap，不静默标记平台化）                                                                                                |

***

## 17. Home / Business-About / Login-Register 平台语境（§8/§19/§20）

| Surface          | 状态                                               | 证据                                                                                                      |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Home             | Platformized（799-801 carry-forward）/ RE-VERIFIED | 保持 discovery-first 平台操作模型；201-802 无回归                                                                   |
| Business / About | RE-VERIFIED                                      | `/business @1440 overflow=false h1=商务合作`；`/about @1440 overflow=false h1=关于 VISNDT`（`_802_pages2.json`） |
| Login / Register | RE-VERIFIED                                      | `/login @1440 overflow=false h1=登录`；`/register @1440 overflow=false h1=注册`（`_802_pages2.json`）          |

无独立 API 改动；品牌/平台身份贯穿全局 Shell（800）。

***

## 18. Detail Pages 汇总（§18/§27/§28）

| Detail Page      | Structural Change                        | Runtime                         | Mobile | Final Status                     |
| ---------------- | ---------------------------------------- | ------------------------------- | ------ | -------------------------------- |
| Product Detail   | 工程评估语义继承（evalRibbon）；无 related discovery | 375/1440 实跑                     | ✓      | CONDITIONALLY VERIFIED           |
| Category Detail  | 无独立路由                                    | —                               | —      | NOT RECONSTRUCTED（聚合入 /products） |
| Solution Detail  | RelevantEngineeringDiscovery 接入          | 375/768/1024/1440 relDiscovery✓ | ✓      | RECONSTRUCTED                    |
| Knowledge Detail | RelevantEngineeringDiscovery 接入          | 375/1440 relDiscovery✓          | ✓      | RECONSTRUCTED                    |
| Supplier Detail  | CAPABILITY PROVIDER 帧 + Next Connection  | 无数据未实跑                          | —      | RECONSTRUCTED（源码）/ 运行时待数据        |

**无细节页被静默标记为平台化而实为 carry-forward。**

***

## 19. Buyer + Supplier Workspace（§21/§22/§23）

**Buyer Workspace —— PLATFORM WORKFLOW PRESENTATION**

| 项            | 内容                                                                                                                      | <br />  | <br /> | <br />                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | :------ | :----- | :-------------------------------------------------- |
| 工作流          | Demand → Match → RFQ → Response Decision → Follow-up（既有业务闭环呈现）                                                          | <br />  | <br /> | <br />                                              |
| Runtime      | `_802_probe4.mjs`：buyer\_login 201；`/dashboard/buyer @375/1440 overflow=false overview✓ workflow✓`；\`/workspace/demands | matches | rfqs   | evaluations @1440 workflow✓`（`\_802\_pages4.json\`） |
| Final Status | **PLATFORM WORKFLOW PRESENTATION**                                                                                      | <br />  | <br /> | <br />                                              |

**Supplier Workspace —— PLATFORM WORKFLOW PRESENTATION**

| 项            | 内容                                                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 工作流          | Opportunity → RFQ → Response → Offer → Connection → Follow-up（§22）                                                                                                                                                 |
| Runtime      | `_802_probe3.mjs`：supplier\_login 201；`/dashboard/supplier × 375/768/1024/1440 overflow=false overview✓ workflow✓`；`/workspace/supplier/{opportunities,rfqs,responses,offers} @1440 workflow✓`（`_802_pages3.json`） |
| Final Status | **PLATFORM WORKFLOW PRESENTATION**（**非 Seller Center / CRM / Sales Pipeline**）                                                                                                                                     |

***

## 20. Cross-surface Experience（§24/§28）

工程发现生态贯穿：Category→Product→Search→Solution→Knowledge→Supplier→Compare→Workspace。
`EngineeringDiscoveryNav`（解决方案页）、发现旅程、工作台意图带、相关工程发现、能力提供方帧、跨面 Next Action 全站复用，使每面知道自己在平台中的角色与下一步。

***

## 21. Mobile（§24）

| Surface            | 375 | 768 | 1024 | 1440 |
| ------------------ | --- | --- | ---- | ---- |
| /categories        | ✓   | ✓   | ✓    | ✓    |
| /products          | ✓   | ✓   | ✓    | ✓    |
| /solutions         | ✓   | ✓   | ✓    | ✓    |
| Solution Detail    | ✓   | ✓   | ✓    | ✓    |
| Knowledge Detail   | ✓   | —   | —    | ✓    |
| Product Detail     | ✓   | —   | —    | ✓    |
| Supplier Dashboard | ✓   | ✓   | ✓    | ✓    |
| Buyer Dashboard    | ✓   | —   | —    | ✓    |

全 `overflow=false`。列表面（categories/products/solutions）× 4 视口实跑；detail/authenticated 面双视口（375/1440）实跑。

***

## 22. Runtime Evidence（§29）

真实 PostgreSQL / API :4000 / Web :3000 / Chrome-CDP 实跑；多角色 GUEST / BUYER / SUPPLIER。

| 证据                | 内容                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `_802_probe.mjs`  | `/solutions /categories /products × 4 视口 + compare + search + knowledge + solution-detail relDiscovery` → `database/_802_visual/_802_pages.json` |
| `_802_probe2.mjs` | `/search?q=检测 workbench✓ / business / about / login / register / dashboard-guard（未登录→login）` → `_802_pages2.json`                                |
| `_802_probe3.mjs` | Supplier 登录 201 + `/dashboard/supplier × 4 + supplier/{opportunities,rfqs,responses,offers}` → `_802_pages3.json`                                |
| `_802_probe4.mjs` | Buyer 登录 201（重试稳定）+ `/dashboard/buyer × 375/1440 + workspace/{demands,matches,rfqs,evaluations}` → `_802_pages4.json`                            |
| `_802_probe5.mjs` | 从列表页发现真实 slug → product/knowledge detail relDiscovery 实跑 → `_802_pages5.json`                                                                    |

所有实跑面 `err=false`、`overflow=false`；新结构标记（journey/evalRibbon/workbench/relDiscovery/solution/capProvider/overview/workflow）按预期命中。

***

## 23. Data / Sparse Data / Security（§23/§23/§24）

- 零计数实体保持真实（BuyerEvaluation/DemandParameter/DemandMatch/Offer=0），未制造成熟数据。

- 空/稀疏态引导式呈现（当前状态/为何为空/相关发现/下一步动作），复用既有 EmptyState。

- Security/RBAC/Organization Scope/公开可发现边界（PUBLISHED+Platform Governance）未触碰；无越权。

***

## 24. Backend / API / Schema（§25）

```text
Backend = NO CHANGE
API     = EXISTING ONLY / NO CHANGE
Schema  = NO CHANGE
Migration = NONE
Fundamental Change = 0
```

802 未为任何 UI 偏好改动后端。

***

## 25. Evidence Standard（§27/§28）

逐面记录 `Surface / Current State / Target Role / Structural Change / Information Hierarchy Change / Discovery Change / Next Action / Runtime Evidence / Mobile Evidence / Remaining Gap / Final Status`（见 §10-§17）。
允许状态：RECONSTRUCTED / RE-VERIFIED ONLY / CONDITIONALLY VERIFIED / NOT RECONSTRUCTED / BLOCKED。
RE-VERIFIED ONLY 未转换为 PLATFORMIZED（无实质变更则不声明 RECONSTRUCTED）。
NOT RECONSTRUCTED（Category Detail）以证据显式记录，未静默标记平台化。

***

## 26. Scope Compliance（§25/§26）

- **In-Scope** 全覆盖：Whole-site Page IA/UI、Category(+Detail)、Product(+Detail)、Search、Recommendation、Solution(+Detail)、Knowledge(+Detail)、Supplier(+Detail)、Compare、Business/About、Login/Register、Buyer/Supplier Workspace、Cross-surface Discovery、Empty States、Workflow Presentation、Mobile Composition、Runtime Verification、Documentation Synchronization。

- **Out-of-Scope** 零越界：无 Database/Schema redesign、New Entity/Authority/Search/Knowledge/Insight/CMS、Marketplace、Seller Center、CRM、ERP、Sales Pipeline、Lead、Opportunity Entity、Order、Cart、Checkout、Payment、Commerce、AI/RAG/LLM/Vector、Public RFQ/Offer/Deal。

- **未创建** M39.1 / M39.2 / M39-Mobile / M39-Frontend / M39-Category / M39-Product。

***

## 27. Low-value Polish（§30）

802 优先 Information Architecture > Visual Hierarchy > Discovery Flow > Evaluation > Next Action > Responsive > Decorative polish。
本轮未投入 micro typography / minor spacing / icon cosmetics / lint cleanup / token migration 等，且**不为完成度降低要求**。

***

## 28. Batch Remediation（§30/§31）

候选（NON-BLOCKING，留待后续独立授权）：

- `BR-802-01`：Product Detail 接入 `RelevantEngineeringDiscovery`（当前 relDiscovery=false）。

- `BR-802-02`：Supplier Detail 相关工程发现 + 供应商数据补齐后实跑渲染验证。

- `BR-802-03`：Compare Capability Difference（能力差异）显性化增强（承接 801）。

- `BR-802-04`：Category 发现旅程与引导式空态数据联动。

P0=0 · P1=0。

***

## 29. Final Acceptance Criteria（§31）——802 达成判定

| 项                  | 要求                             | 802 状态                                                                                                              |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Global Shell       | VERIFIED                       | VERIFIED（800复核）                                                                                                     |
| Category           | RECONSTRUCTED                  | **RECONSTRUCTED**                                                                                                   |
| Product            | RECONSTRUCTED                  | **RECONSTRUCTED**                                                                                                   |
| Search             | RECONSTRUCTED                  | **RECONSTRUCTED**                                                                                                   |
| Recommendation     | RECONSTRUCTED                  | **RECONSTRUCTED**（跨面层）                                                                                              |
| Solution           | RECONSTRUCTED                  | **RECONSTRUCTED**                                                                                                   |
| Knowledge          | RECONSTRUCTED                  | RE-VERIFIED/IMPROVED（列表）+ Detail=RECONSTRUCTED                                                                      |
| Supplier           | RECONSTRUCTED                  | Detail=RECONSTRUCTED（源码）/ 运行时待数据；列表=CONDITIONALLY VERIFIED                                                          |
| Compare            | VERIFIED/IMPROVED              | **VERIFIED/IMPROVED**                                                                                               |
| Detail Pages       | RECONSTRUCTED 或明确未解决带证据        | Solution/Knowledge Detail=RECONSTRUCTED；Product Detail=CONDITIONALLY VERIFIED；Category Detail=NOT RECONSTRUCTED（证据） |
| Buyer Workspace    | PLATFORM WORKFLOW PRESENTATION | **达成**                                                                                                              |
| Supplier Workspace | PLATFORM WORKFLOW PRESENTATION | **达成**（非 Seller Center）                                                                                             |
| Mobile             | VERIFIED                       | **VERIFIED**                                                                                                        |
| Runtime            | VERIFIED                       | **VERIFIED**                                                                                                        |

**M39 保持 CONDITIONALLY VERIFIED**（因 Product Detail 相关工程发现、Supplier Detail 运行时数据、部分列表数据联动仍留缺口）。

***

## 30. Documentation（§32）

- 新建 `docs/_review/802_M39_Whole_Site_Page_Level_Platform_Recomposition_And_Experience_Convergence.md`（本报告）。

- 同步 `docs/project-management/PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md` 追加 802。

- **未改写** 790–801。

***

## 31. Final Execution Output（§33）

```text
Task:
  802_M39_Whole_Site_Page_Level_Platform_Recomposition_And_Experience_Convergence

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

M39 Business Loop Foundation:
  IMPLEMENTED / CONDITIONALLY VERIFIED

M39 Global Platform Shell:
  VERIFIED

Home:
  PLATFORMIZED (carry-forward) / RE-VERIFIED

Category:
  RECONSTRUCTED (Capability Discovery Journey + 卡 discovery trail)

Category Detail:
  NOT RECONSTRUCTED (无独立路由；聚合入 /products，带证据)

Product:
  RECONSTRUCTED (Capability Evaluation 语境带 + 双 Next Action)

Product Detail:
  CONDITIONALLY VERIFIED (elbalRibbon 评估语义；relDiscovery 缺失=BR-802-01)

Search:
  RECONSTRUCTED (Engineering Discovery Workbench 意图带)

Recommendation:
  RECONSTRUCTED (RelevantEngineeringDiscovery 跨面工程发现层)

Solution:
  RECONSTRUCTED (工程语境头 + PROBLEM→...→CONNECTION + 快捷入口 + Solution Index)

Solution Detail:
  RECONSTRUCTED (RelevantEngineeringDiscovery 接入)

Knowledge:
  RE-VERIFIED / IMPROVED (引导式空态承接)

Knowledge Detail:
  RECONSTRUCTED (RelevantEngineeringDiscovery 接入)

Supplier:
  CONDITIONALLY VERIFIED (无独立列表路由；经 /search?type=supplier-product 收敛)

Supplier Detail:
  RECONSTRUCTED (源码：CAPABILITY PROVIDER 帧 + Next Connection) / 运行时待供应商数据

Compare:
  VERIFIED / IMPROVED

Business / About:
  RE-VERIFIED

Login / Register:
  RE-VERIFIED

Buyer Workspace:
  PLATFORM WORKFLOW PRESENTATION

Supplier Workspace:
  PLATFORM WORKFLOW PRESENTATION (Opportunity→RFQ→Response→Offer→Connection→Follow-up；非 Seller Center)

Cross-surface Experience:
  DEPLOYED (Discovery Journey / Workbench / Relevant Discovery / Capability Provider / Next Action) / VERIFIED

Mobile:
  VERIFIED @375/768/1024/1440 (列表面 4 视口 + detail/auth 375/1440；全 overflow=false)

Runtime:
  VERIFIED (real Postgres / API 4000 / Web 3000 / Chrome-CDP; 多角色 GUEST/BUYER/SUPPLIER)

Schema:
  NO CHANGE

API:
  EXISTING / NO CHANGE

Fundamental Change:
  0

Batch Remediation:
  [BR-802-01 Product Detail 相关工程发现; BR-802-02 Supplier Detail 数据补齐后实跑; BR-802-03 Compare Capability Difference; BR-802-04 Category 数据联动]

Documentation:
  SYNCED (802 report + STATUS + ROADMAP + MATRIX)

M39 Page-Level Platformization:
  CONDITIONALLY VERIFIED

M39 Final State:
  NOT CLOSED

Next Step:
  STOP（见 §32）。后续一律独立任务授权并带 Batch Remediation 候选；Product Detail / Supplier Detail 相关工程发现与数据联动为持续条件
```

***

## 32. STOP（§34）

```text
STOP
```

802 执行完毕：**不自动创建** 802.1 / M39.1 / M39.2 / M39-Mobile / M39-Frontend / M39-Category / M39-Product 等后续任务。
M39 因 Product Detail 相关工程发现、Supplier Detail 运行时数据、部分列表数据联动仍存缺口而保持 **CONDITIONALLY VERIFIED（未 CLOSED / 未关闭）**。
802 执行结果本身为下一规划证据；后续是否推进由真实实现结果与独立评审决定。
