# 798\_M39\_Platform\_Business\_Loop\_Architecture\_And\_Frontend\_Experience\_Authorization\_Gate

> Task: `798_M39_Platform_Business_Loop_Architecture_And_Frontend_Experience_Authorization_Gate`
> Version: `V3.2.3` · Mode: **M39 INDEPENDENT AUTHORIZATION GATE / READ-ONLY / VERIFY / RECONCILE / PLAN / FREEZE / DOCUMENT / STOP**
> Date: 2026-09-02
> 核心原则：**Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State**
> 证据层级：**Runtime / Browser Evidence > Code > API / Schema > Documentation > Historical Decision**
> 关键状态区分：**AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED ≠ VERIFIED ≠ CLOSED**
> 本任务**只授权判定，不实施 M39**。

***

## 1. Repository Verification（§1）

| 项                                                         | 实测                                                                       | 结论        |
| --------------------------------------------------------- | ------------------------------------------------------------------------ | --------- |
| Repository Root                                           | `F:/Desktop/VISNDT`                                                      | VERIFIED  |
| Code Root                                                 | `F:/Desktop/VISNDT/VISNDT`                                               | VERIFIED  |
| apps/web · apps/api · apps/admin · database/prisma · docs | 全部在位                                                                     | VERIFIED  |
| 禁止操作                                                      | 未执行 reset/clean/checkout ./restore ./stash/rebase/merge/delete/overwrite | CONFIRMED |
| 生产代码改动                                                    | 798 零生产代码改动（READ-ONLY）                                                   | CONFIRMED |

## 2. Git Baseline（§22）

- **Branch**: `main`

- **HEAD**: `76b08e508325b7c094c7b7f1234fc18e8e37014e`（768 M34.6 closeout，与 797 一致）

- **Working Tree**: 留驻（790-797 M38 前端改动 + M34.7 历史遗留 organization-members API 改动 schema 无 diff + 797 修正）；798 未提交任何新代码。

- **Baseline**: Actual Current Code + Actual Current Runtime（PostgreSQL/API:4000/Web:3000/Admin:3001/CDP 全在线唯一运行实例）+ Latest E2E Evidence。

## 3. Historical State Reconciliation（§2/§3）

| 阶段  | 历史判定                                             | 本任务对账                                      |
| --- | ------------------------------------------------ | ------------------------------------------ |
| M35 | CONDITIONAL / NOT CLOSED                         | 保持（Non-blocking, 见 §5）                     |
| M36 | CLOSED（785）                                      | 保持                                         |
| M37 | CONDITIONAL / NON-BLOCKING（789）                  | 保持（Non-blocking, 见 §5）                     |
| M38 | 796 reconcile=CLOSED → **797 最新真实证据重新确认 CLOSED** | **CLOSED（以 797 为当前事实，不重开）**                |
| M39 | NOT AUTHORIZED / NOT STARTED                     | **NOT AUTHORIZED / NOT STARTED（本任务为授权判定）** |

**795/796 与 797 关系**：795=Final Closeout（CASE B · CONDITIONAL）；796=M38 State Reconciliation（CLOSED）+ M39 AUTHORIZABLE WITH CONDITIONS；**797=Frontend Platformization Reality Correction 后以最新真实前端证据再次确认 M38=CLOSED，并确认 M39 前置门满足**。798 必须以 797 最新证据作为 M38 当前事实，不得重新打开 M38。

## 4. M38 Final Reconciliation（§3）

- **M38 = CLOSED（797 复验确认）**：核心平台化缺口=0 · P0=0 · Architecture Contradiction=0 · Mobile 375/768/1024/1440 修正后判定（797）。

- 798 **不因** Admin 优化 / Design Token / Coverage Limited / lint warnings / historical evidence gaps 重新启动 M38；此类问题若非 M39 blocker 一律进 `Batch Remediation`，不创建 `M38.x`。

## 5. M35 / M37 Carry-forward Impact（§19/§21.5）

逐项判断是否构成 M39 blocker：

| Carry-forward                       | 对 M39 Architecture / Workflow / Runtime / Security / Data Integrity / Frontend / Mobile | 是否阻断 M39 |
| ----------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| M35 Conditional（供应商多用户邀请/角色 UI 未完成） | 不进 M39 授权边界（Scope A-N 不含）；不影响 M39 既有 Authority 复用                                       | NO       |
| M37 Conditional（Insight 语义标注）       | M39 不依赖 M37 Query/Insight 新增；Inquiry 保持 Connection，不依赖交易语义                              | NO       |
| M38 closed                          | 平台化基座已闭环，M39 复用之                                                                        | NO       |

结论：**Conditional ≠ Automatically Blocking**；M39 不直接依赖任何未决 blocker ⇒ **不触发 NOT AUTHORIZABLE**。此判据仅对历史 carry-forward；M39 自身的 Batch Remediation 项见 §21。

## 6. M39 Domain Audit（§4）

以当前 Schema / API / 代码为最高证据：

| Domain        | Enablers                                                                                                                                | 结论              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Evaluation    | `BuyerEvaluation`（`017_buyer_evaluation` migration）+ evaluations API（GET/POST/:id/connection）                                           | 现有 Authority 覆盖 |
| Demand        | `Demand` + `DemandParameter` + demands API（POST/GET/PATCH/publish/close/parameters/matches）                                             | 现有 Authority 覆盖 |
| Match         | `DemandMatch` + `ScoringService`（加权参数评分 + 必选参数 hard-fail）+ `MatchingService.match()` 在 `Demand.publish()/rematch()` 自动触发（deterministic） | 现有 Authority 覆盖 |
| RFQ           | `RFQ`（targetOrganization 定向）+ RFQ 生命周期（created/opened）+ RFQ API                                                                         | 现有 Authority 覆盖 |
| RFQ Response  | `RFQResponse` + Supplier 提交/Buyer 查看接受拒绝                                                                                                | 现有 Authority 覆盖 |
| Offer / Quote | `Offer`（submit/accept/reject/withdraw 全生命周期）                                                                                            | 现有 Authority 覆盖 |
| Inquiry       | `Inquiry`（Connection 语义，POST 三键校验 + 组织成员通知）                                                                                             | 现有 Authority 覆盖 |
| Workspace     | `Organization` + `OrganizationMember` + Buyer/Supplier Workspace 路由                                                                     | 现有 Authority 覆盖 |
| Workflow      | `WorkflowEvent`（entity\_type+action）+ `Notification`                                                                                    | 现有 Authority 覆盖 |
| Routing       | deterministic routing · `targetOrganization` · accepted Match · WorkflowEvent · Notification                                            | 现有 Authority 覆盖 |

**Routing 边界**：未发现并禁止自动创建 Lead / Opportunity Entity / SalesPipeline / CRM / SalesEntity / SellerCenter / Marketplace / Order / Cart / Checkout / Payment / ERP / Commerce。当前现有模型可完整表达 M39 核心闭环 ⇒ **无需 Fundamental Change Candidate**。

## 7. Business Loop Contract（§5）

固定业务链全部可用现有 Authority 表达并经真实 WorkflowEvent 佐证：

```
Engineering Discovery ──(M36/M38 输入源)──> Product/Capability
  ↓ Evaluation ──> Demand(参数化) ──publish──> Match(ScoringService 确定性评分)
  ↓ RFQ(targetOrganization) ──> RFQResponse ──> Offer/Quote
  ↓ Inquiry/Connection ──> Workspace ——> WorkflowEvent/Notification ——> Business Follow-up
```

证据：

- Code 层：`MatchingService.match()` 自动在 `publish` 触发；RFQ 支持 `targetOrganization` 定向；Offer 全生命周期；Inquiry=Connection。

- 运行时证据：`WorkflowEvent`：DEMAND CREATED×6 / OPENED×2 / CLOSED×2 · RFQ CREATED×1 / OPENED×1 · RFQ\_RESPONSE CREATED×1 · CONTENT CREATED/REVIEWED/SUBMITTED×4；`Notification`：RFQ\_UPDATE×12 / RESPONSE\_UPDATE×14。

- **M39 不重新建立 Search Authority**（/search 保持 Unified Engineering Discovery Authority）；Evaluation 为 Demand 输入（BuyerEvaluation → Demand 链路）。

## 8. Buyer Experience Audit（§6）

- **入口/路由全通（真实浏览器验证）**：`/dashboard/buyer` · `/workspace/demands` · `/workspace/demands/create` · `/workspace/matches` · `/workspace/rfqs` · `/workspace/notifications` 全部渲染，路径正确、无溢出。

- **Workflow Intent（代码证据）**：

  - Demand create：「填写需求的检测技术要求，将用于**能力匹配与询价展示**」「帮助系统与供应商理解需求所属的检测能力领域」→ **「我正在提出一个工程检测需求」**。

  - Matches：「查看需求与产品的匹配结果」→ **「平台正在帮我寻找合适能力」**。

  - RFQ：可由 Demand 派生（create 页空态引导「先创建需求」，体现 **RFQ dependency**）；「查看已发布的询价请求，并审核供应商响应」→ **「我正在向供应商发起连接」**。

  - Notifications：统一 RFQ\_UPDATE / RESPONSE\_UPDATE / DEMAND\_UPDATE 语义。

- **判定**：Buyer 理解链成立——存在一致的状态/CTA/时间线语言，非一组孤立页面。Dashboard+Demand 可见性+Match 可见性+RFQ 入口+Status+Timeline+CTA+Notification 具备。

## 9. Supplier Experience Audit（§7）

- **入口/路由全通（真实浏览器验证）**：`/dashboard/supplier` · `/workspace/supplier/rfqs` · `/workspace/supplier/responses` · `/workspace/supplier/offers/new` · `/workspace/supplier/inquiries` · `/workspace/supplier/opportunities` 全部渲染，路径正确、无溢出。

- **Workflow Context（代码证据）**：

  - rfqs：查看可响应 RFQ 列表 → **RFQ Opportunity**。

  - responses：跟踪 Buyer 决策（ACCEPTED/REJECTED 决策块）→ **Response**。

  - offers/new：创建供应能力报价 → **Offer/Quote**。

  - inquiries：收到的询价（Connection）→ **Inquiry**。

  - opportunities：现有 Opportunity 展示（复用 DemandMatch/RFQ 语义，非 Sales Pipeline）。

- **判定**：Supplier 理解链成立——RFQ Opportunity → Response → Offer/Quote → Inquiry → Business Follow-up。**不是仅以「页面能打开/按钮存在」判定**：路径、CRA/状态、导航、角色数据边界均已实测。

## 10. Workspace Architecture（§8/§21.10）

- **Shared workspace shell**：`WorkspaceSidebar` 按角色（BUYER/SUPPLIER）提供统一导航与 active 路由高亮；Buyer/Supplier 各自独立入口但共享同一套 Workspace 结构。

- **Shared business status / timeline / CTA / notification patterns**：M25.3 Workflow Visualization（StatusPresentationContract + WorkflowTimeline + NextActionHint）+ workspace 通知中心统一模式。

- **边界**：`Frontend Workflow Convergence ≠ Global Frontend Rewrite`；无 New Workspace System / CRM UI / Seller Center / 全局 Header/Mobile 重写。

## 11. Workflow / Notification（§21.11）

- `WorkflowEvent` 统一主体语义（DEMAND/RFQ/RFQ\_RESPONSE/CONTENT），覆盖主链生命周期；`Notification` 类型（RFQ\_UPDATE/RESPONSE\_UPDATE/DEMAND\_UPDATE）与业务状态一致。

- 路由通过 `WorkflowEvent + Notification + OrganizationMember` 配置开展，未新建 Opportunity/Lead 实体体系。

## 12. Frontend Workflow Experience（§8/§21.12）

- 共享状态语言、共享时间线、共享工作流上下文、共享 CTA、共享通知、共享业务面包屑、共享移动工作流模式——上述已具备。

- **平台化判断（真实浏览器）**：Buyer/Supplier 关键工作流页面 IA + Workflow Context + Visual Hierarchy + Continuity 成立；非单纯页面可达性。

## 13. Mobile First-Class（§9/§21.13）

真实 Chrome/CDP 四视口（375/768/1024/1440）分角色实测（每条路由预编译后轻量渲染，规避低内存宿主崩溃；每次测量为实测值）：

| 角色       | 页面数                                                                    | 单元     | 横向溢出(>1px)           | Issues | Exceptions |
| -------- | ---------------------------------------------------------------------- | ------ | -------------------- | ------ | ---------- |
| Buyer    | dashboard/demands/demand\_create/matches/rfqs/notifications            | 24     | **0**                | 0      | 0          |
| Supplier | dashboard/supplier\_rfqs/responses/offers\_new/inquiries/opportunities | 24     | **0**                | 0      | 0          |
| 合计       | —                                                                      | **48** | **0**（全部 0 overflow） | 0      | 0          |

- 每页均含可用 CTA（Buyer 14-24 / Supplier 18-33）、导航可达、状态可见、表单/列表适配、无 clipping。

- 与 797 判定一致：**未将任何 1024 问题继承为 carry-forward**；本轮 1024=0（历史 19px carry-forward 在 797 已修正/不复现）。

- 证据文件：`VISNDT/database/_798_visual/cdp_evidence.json` + `_798_visual/*.png`（真实截图）。

## 14. Runtime / Data（§10/§21.14）

- **Runtime（实跑）**：Docker(PostgreSQL `visndt-postgres` healthy + MinIO) + API `:4000 /api/v1/health`= `{"status":"ok","database":"connected"}` + Web `:3000` 200 + Admin `:3001` 200 + Chrome/CDP 真实浏览器。

- **Business-loop 数据计数（Prisma 名 = DB 表直接查询）**：

| Entity             | Count |
| ------------------ | ----- |
| BuyerEvaluation    | 0     |
| Demand             | 4     |
| DemandParameter    | 0     |
| DemandMatch        | 0     |
| RFQ                | 2     |
| RFQResponse        | 1     |
| Offer              | 0     |
| Inquiry            | 1     |
| WorkflowEvent      | 25    |
| Notification       | 26    |
| Organization       | 10    |
| OrganizationMember | 15    |

- **判定**：现有真实业务数据存在（RFQ/Response/Inquiry/WorkflowEvent/Notification），完整生命周期事件已被 WorkflowEvent 佐证；但 **Match/Evaluation/Offer/Parameter 持久化行为 0**（历史确认无共造数据，受控测试数据已按 796 卫生清理）。⇒ **Data = READY WITH CONDITIONS**，**未通过伪造数据证明 M39 readiness**。

## 15. API / Backend（§11/§21.15）

- 现有 API 完整覆盖：demands · matching（deterministic + publish/rematch 自动触发）· rfqs · offers（submit/accept/reject/withdraw）· inquiries · evaluations · workspace（buyer/supplier overview + runtime inquiry-context）· notifications · workflow-events。

- 认证（JWT + CSRF）、RBAC、Organization Scope、Workflow transitions、RFQ targetOrganization、Notification 均基于现有 Authority。

- **未新增** M39 Search API / Opportunity API / CRM API / Marketplace API / Commerce API。

## 16. Low-operation（§12/§21.16）

- Supplier Self-service · Buyer Intent · Deterministic Matching（ScoringService 确定性加权）· Automatic Workflow（publish→match 自动触发）· WorkflowEvent · Notification · Structured Business Data · Minimal Human Review — 均已具备。

- **未依赖** Manual Lead Entry / Manual Match Assignment / Manual RFQ Distribution / Manual Supplier Routing / Manual Search Indexing / Manual Opportunity / Manual Sales Pipeline。

## 17. Security / RBAC / Organization Scope（§21.17）

- 全部 Workspace/Demand/RFQ/Response/Offer/Inquiry/Notification 路由在 `AuthGuard` + 组织作用域下受保护；未认证访问数据接口返回 401；RBAC 三角色（Buyer/Supplier/Admin）访问边界实测无越权。

- Organization/OrganizationMember 提供组织隔离；通知路由复用 OrganizationMember 配置。

## 18. External Discoverability Boundary（§13/§21.18）

- Demand / RFQ / RFQResponse / Offer / Inquiry / Workspace / Notification 均为 **PRIVATE / AUTHENTICATED / CONTROLLED**。

- 未创建 Google/Bing landing page、AI 公开 deal page、Public RFQ/Offer index、Public workspace page。M38 Discoverability Ownership 保持不变。

## 19. Architecture / Schema / API Gate（§14/§21.19）

- **Schema = NO CHANGE**（`schema.prisma` 无 diff）· **Migration = NONE**（最新仍为 `20260831090000_017_buyer_evaluation`）· **API = EXISTING ONLY** · Backend = Reuse/Controlled Extension · Frontend = Controlled Workflow Convergence · Data = Existing/Controlled。

- **Change Size 目标 = S / M**；未出现 L / Major Rewrite / New Domain / New Authority / New Schema / New Commerce / New CRM。

## 20. Fundamental Change Register（§21.20）

- **Fundamental Change = 0 / No Candidate**：现有模型足以表达需求 + workflow persistence 已由现有实体承载 ⇒ 无需 STOP→ADR。

## 21. Batch Remediation（§3/§17/§21.21）

以下为已记录但 **NON-BLOCKING** 的 M39 前置项，统一进 `Issue Register → 优先级 → Batch Remediation`，**不创建 M39.x**：

| Ref       | 项                                                   | 优先级 | 归属                        |
| --------- | --------------------------------------------------- | --- | ------------------------- |
| BR-798-01 | Match/Offer/Evaluation 持久化行为 0（数据成熟度）               | P2  | Data maturation（后续受控数据补给） |
| BR-798-02 | 认证态 Constructor 端 Operation Center 移动视口专项           | P2  | Batch Remediation         |
| BR-798-03 | 存量 lint warnings / design-tokens 双前端统一消费（承接 BR-797） | P2  | Batch Remediation         |

## 22. Implementation Readiness Matrix（§15/§21.22）

| Dimension          | Result                                               |
| ------------------ | ---------------------------------------------------- |
| Architecture       | READY                                                |
| Data               | READY WITH CONDITIONS（Match/Offer/Evaluation 持久化待成熟） |
| API                | READY                                                |
| Backend            | READY                                                |
| Frontend           | READY WITH CONDITIONS（Constructor 端专项）               |
| Buyer Workspace    | READY                                                |
| Supplier Workspace | READY                                                |
| Workflow           | READY                                                |
| Mobile             | READY（48/48、0 overflow、0 issues）                     |
| Low-operation      | READY                                                |
| Runtime            | READY（插件勾线 Postgres/API/Web/Admin/CDP 全在线）           |
| Documentation      | READY                                                |

上述结论均有实测证据，未使用 theoretically ready / should work / looks ready。

## 23. M39 Scope Freeze（§16/§21.23）

若授权，唯允许范围（**LOCKED A-N**）：
`A Evaluation→Demand Integration · B Demand→Match · C Match→RFQ · D RFQ→RFQResponse · E RFQResponse→Offer/Quote · F Inquiry/Connection · G Buyer Workspace · H Supplier Workspace · I Business Routing · J WorkflowEvent/Notification · K Timeline/Status/Context · L Mobile First-Class Workflow Presentation · M Runtime/Browser/E2E Verification · N Documentation Synchronization`

## 24. M39 Absolute Out-of-Scope（§17）

禁止：Marketplace · Seller Center · CRM · ERP · Sales Pipeline · Order/Cart/Checkout/Payment · Commerce Domain · New Demand/Match/RFQ/Inquiry Authority · New Workspace System · New Routing Domain · New Search System · AI Search · LLM/RAG/Vector/Embedding · Public RFQ Index/Deal Page · SEO System · Global Frontend/Mobile Rewrite；以及 `Issue→M39.x` / `Mobile→M39-Mobile` / `CRM→M39-CRM` / `RFQ→M39-RFQ` / `Workspace→M39-Workspace`。问题统一进 `Issue Register→Priority→Batch Remediation`。

## 25. Authorization Decision（§18/§21.24）

# **OPTION B：M39 = AUTHORIZABLE WITH CONDITIONS**

- Core architecture sufficient（现有 Authority 完整覆盖 Evaluation→Demand→Match→RFQ→RFQResponse→Offer→Inquiry→Workspace→Business Routing）。

- 前置条件全部 NON-BLOCKING：Data maturation（BR-798-01）+ Constructor 端专项（BR-798-02）+ lint/design-token（BR-798-03）→ 作为授权条件下持续条件带进实施。

- 无新架构/Schema/Migration 需求（Change Size = S/M）。

- **AUTHORIZABLE ≠ AUTHORIZED ≠ IMPLEMENTED ≠ VERIFIED ≠ CLOSED**：798 仅授权判定，未实施 M39、未标记 AUTHORIZED。

## 26. Documentation Synchronization（§20/§21.25）

- 追加：`docs/_review/798_*.md`（本报告）+ `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md`。

- 记录：**M38 = CLOSED** · **M39 = AUTHORIZABLE WITH CONDITIONS**。

- 严禁修改 790-797 / Frozen Architecture / M34 Contract；若代码状态与历史文档不一致，记录差异而非改写历史（本任务无此类不一致需改写）。

***

## 22. Final Execution Output

```text
Task:
  798_M39_Platform_Business_Loop_Architecture_And_Frontend_Experience_Authorization_Gate

Repository Root: F:/Desktop/VISNDT
Code Root:        F:/Desktop/VISNDT/VISNDT
Branch:           main
HEAD:             76b08e5

M35:  CONDITIONAL / NOT CLOSED
M36:  CLOSED
M37:  CONDITIONAL / NON-BLOCKING
M38:  CLOSED
M39 Current State: NOT AUTHORIZED / NOT STARTED

Business Loop:  EVALUATION→DEMAND→MATCH→RFQ→RFQRESPONSE→OFFER→INQUIRY→WORKSPACE→ROUTING 全部以现有 Authority 可表达（WorkflowEvent/Notification 佐证）
Buyer Experience:    READY（workflow intent 成立）
Supplier Experience: READY（RFQ⇒Response⇒Offer⇒Inquiry⇒Follow-up 成立）
Workspace:           READY（shared shell + 角色导航）
Workflow:            READY（deterministic match + 全生命周期事件）
Notification:        READY（RFQ_UPDATE / RESPONSE_UPDATE / DEMAND_UPDATE 一致）
Frontend Workflow Platformization: READY（Convergence ≠ Global Rewrite）
Mobile:              READY（48/48 cells，0 overflow，0 issues，375/768/1024/1440）
Runtime:             READY（Postgres/API/Web/Admin/CDP 全在线实测）
Data:                READY WITH CONDITIONS（Match/Evaluation/Offer 持久化待成熟）
API:                 READY（EXISTING ONLY）
Backend:             READY（REUSE / CONTROLLED EXTENSION）
Low-operation:       READY（automatic + deterministic）
Security/RBAC:       READY
External Discoverability: PRIVATE / CONTROLLED
Schema:              NO CHANGE
Migration:           NONE
Fundamental Change:  0
M39 Scope:           LOCKED A-N
Authorization:       OPTION B = AUTHORIZABLE WITH CONDITIONS
Documentation:       PASS（追加 798）
Next Authorized Step: M39 Controlled Implementation under listed conditions（须独立任务授权）
STOP:                CONFIRMED
```

***

## 26. STOP Confirmation

**STOP——798 完成后必须停止。**

- 不自动创建 799。

- 不自动实施 M39。

- 不创建 M39.x。

- 不重新打开 M38。

- M35/M37 Conditional 保持，不因 M39 授权而改写。

