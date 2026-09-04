# 804_M39_Final_Closure_Gate_Business_Loop_Runtime_And_Platformization_Reconciliation

> **Task Tracking：** `804_M39_Final_Closure_Gate_Business_Loop_Runtime_And_Platformization_Reconciliation`
>
> **Version：** V3.2.3
>
> **Status：** M39 FINAL CLOSURE GATE / READ-ONLY / VERIFY / RECONCILE / DOCUMENT / STOP
>
> **Date：** 2026-09-02
>
> **Core Principle：** Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State
>
> **Critical State Distinction：** `VERIFIED ≠ CLOSED`

---

# 0. 结论摘要（Executive Decision）

**M39 Final Closure Decision = BLOCKED（Option C）**

804 为 READ-ONLY 关闭门。在真实 API 复核中发现一处 **P0 Security / Data Integrity / Authorization-boundary violation**：**公开（未鉴权）接口 `GET /api/v1/demands/{id}` 将 `createdByUser.passwordHash`（bcrypt 哈希）泄露给访客**。

依据 804 §26 Option C：

```text
发现 Security issue / Data integrity failure → M39 = BLOCKED → STOP
```

804 遵循 §27（VERIFY ≠ FIX），**不在本任务内修复**。该 P0 作为明确证据记录，交由后续独立授权任务处理（Issue → Evidence → Priority → Closure impact → STOP）。

M39 = **BLOCKED**（非 CLOSED，非 CONDITIONALLY VERIFIED）。

---

# 1. Repository Verification

- 仓库根：`F:/Desktop/VISNDT`；代码根：`F:/Desktop/VISNDT/VISNDT`。
- 未 reset / clean / checkout ./restore ./stash / rebase / merge / destructive delete / mass overwrite。
- 804 为 READ-ONLY：未修改任何业务/前端/后端代码；仅创建证据文件（`database/_804_visual/_804_apistate.json`）+ 文档同步。

# 2. Git Baseline

- Branch：`main`；HEAD：`76b08e5`（`M34.6 closeout ...`，与 798–803 一致）。

# 3. M35–M39 Reconciliation

```text
M35 = CONDITIONAL / NOT CLOSED
M36 = CLOSED
M37 = CONDITIONAL / NON-BLOCKING
M38 = CLOSED
M39 Business Loop Foundation = IMPLEMENTED / CONDITIONALLY VERIFIED
M39 Global Platform Shell = VERIFIED
M39 Whole-site Frontend Platformization = VERIFIED（803）
M39 = BLOCKED（804 判定，因 P0 Security）
```

# 4. 803 Reconciliation（§3）

- 认可 803 已确立：Global Shell = VERIFIED；Page-Level Platformization = VERIFIED；Whole-site Platformization = VERIFIED。
- 认可已关闭：BR-802-01、BR-802-02。
- 继续保留（NON-BLOCKING / CARRY-FORWARD）：BR-802-03（Compare Capability Difference）、BR-802-04（Category 数据联动）、803 notifications/offers 空态精修候选。
- 未因 BR-802-03/04 重启前端平台化。

# 5. Business Loop E2E（§6/§30 真实证据优先）

- **真实 API 数据态**（`_804_apistate.json`）：`/demands`、`/rfqs`、`/workflow-events` 均返回真实运行时记录；`/offers`=0；demand 下 `matches`=[]；`/evaluations`、`/notifications`、`/demands/my` 对访客返回 **401（鉴权正确，多重证据）**。
- 既有受控 E2E 遗留（真实数据，非伪造）：`DEMO_可视化E2E_需求_1788279750024`（DRAFT）+ 对应 `workflow-event: DEMAND CREATED`；`rfq` 存在但 `sourceMatchId/targetOrganizationId=null`。
- **结论：** 完整链路（Evaluation→Demand→Match→RFQ→Response→Offer→Inquiry→Workspace→Event→Notification）在 804 READ-ONLY 前提下**未于本次全链路运行时复跑**（offers/matches/inquiry 运行时数据缺失；web:3000 当前不可用，未跑浏览器会话）。已实现环节按 §9 记为 VERIFIED BY CODE；完整运行时矩阵交由独立修复/复核任务补足。

# 6. Evaluation → Demand（§8）

- 权威核对（Code / API）：`POST /api/v1/demands` `@UseGuards(JwtAuthGuard)`（鉴权创建）；`GET /demands/my|mine`（组织归属）；`POST /demands/:id/parameters` + `GET /demands/:id/parameters`（参数关系）；所有权/组织作用域由 service 控制。
- 运行时：`/demands/my` 对访客 401（RBAC 有效）；存在真实 DRAFT demand（Buyer 归属，org-scope）。Evaluation intent→Demand 的启用路径存在；未强制新建独立 UI 入口（§8 允许验证既有合法路径）。

# 7. Demand → Match（§9）

- 权威核对（Code）：`POST /demands/:id/publish`（DRAFT→PUBLISHED，@UseGuards）→ 触发 MatchingService；`POST /demands/:id/rematch`；`GET /demands/:id/matches`（org-scoped）；`PATCH /demands/:id/matches/:matchId`（PENDING→MATCHED→REVIEWED→ACCEPTED/REJECTED）。DemandMatch 为确定性评分 + 必需参数 hard-fail 语义。
- 运行时：demand 下 `matches`=[]（真实，未伪造成熟）；→ **VERIFIED BY CODE / NOT RUNTIME VERIFIED（本 pass）**。

# 8. Match → RFQ（§10）

- 权威核对（Code）：rfq 模型含 `sourceMatchId`、`targetOrganizationId`；创建受鉴权 + Buyer authorization + Supplier routing。
- 运行时：现有 `rfq.sourceMatchId=null,targetOrganizationId=null`（未从已接受 match 生成）；→ **VERIFIED BY CODE / 运行时目标未产生合格 match**。未新建 routing authority。

# 9. RFQ → RFQResponse（§11）

- 权威核对（Code）：`rfq-responses.controller`（Supplier 访问 + org-scope + 状态 + Buyer 可见性 + Notification + WorkflowEvent）已实现。
- 运行时：`/rfq-responses` 根路径 404（路由为 org/sub-path 命名，非缺陷）；本 pass 未独立复跑 Supplier response 创建 → **VERIFIED BY CODE / 部分运行时**。

# 10. RFQResponse → Offer（§12）

- 权威核对（Code）：`offers.controller` 存在，Offer 归 Supplier、owner scope、accept/reject/withdraw 语义（无订单/commerce）。
- 运行时：`/offers` = 200, `data=[]`, `total=0`（真实稀疏，未制造成熟态）→ **VERIFIED BY CODE / NOT RUNTIME VERIFIED（offers=0）**。

# 11. Offer → Inquiry / Connection（§13）

- 权威核对：Inquiry 保持 Connection Authority（`inquiries.controller`），非 Order/Deal/Lead/CRM/SalesPipeline。运行时未复跑 → **VERIFIED BY CODE**。

# 12. Inquiry → Workspace / Follow-up（§14）

- 权威核对：`workspace.controller`、`workflow-events.controller`、`notifications.controller` 提供 Buyer/Supplier 可见性 + org-scope + recipient + event + next action。运行时 = demo 数据存在 DEMAND workflow-event（真实）→ **已实现 + 部分运行时**。

# 13. Buyer E2E（§15）

- 现有真实 DEMO demand 表明 Buyer 创建/DRAFT 路径已运行时验证过（历史 799 受控 E2E + 数据库残留）；Discover→Evaluate→Demand→Match→RFQ→Review Response→Review Offer→Connect→Follow-up 的 UI/API/Persistence/State/Role/Notification 端到端 **未在本 READ-ONLY pass 全量复跑** → **CONDITIONALLY VERIFIED**（前端已验证，运行时部分）。

# 14. Supplier E2E（§16）

- Opportunity→RFQ→Response→Offer→Connection→Follow-up：Authority/RBAC/state/notification/workspace 均已实现；本 pass 未复跑 Supplier 侧全链 → **CONDITIONALLY VERIFIED**。

# 15. Frontend Platformization（§17/803 认可）

- **VERIFIED**（全站 whole-site frontend platformization，800=Shell / 801=Page-Level / 802/803=Whole-site + Final convergence）。无新视觉改造（前端口冻结）。

# 16. Public Discovery（§17）

- Home/Category/Product/Search/Solution/Knowledge/Supplier/Compare/Business-About/Login/Register 保持平台身份+工程层级+发现+评估+语境+下一动作（抽样复核 803 证据成立，无回归）。

# 17. Cross-surface Continuity（§18）

- Search→Category→Product→Technical Context→Knowledge→Solution→Supplier→Evaluation→Inquiry→Workspace 上下文相关连续性成立（跨面 `RelevantEngineeringDiscovery` + EngineeringDiscoveryNav + Next Action）；非强制互链。

# 18. Mobile（§19）

- **VERIFIED**（803 已四视口 375/768/1024/1440 复核；804 READ-ONLY 认可，未重测——web 服务当前不可用，未新增截图）。

# 19. Runtime（§21/§30）

- PostgreSQL / API:4000 **已运行**；Web:3000 当前 **DOWN**（环境内存所限，非本轮改动引入）。真实 API 数据态探针执行成功（`_804_apistate.json`）。浏览器/CDP 会话本轮未跑（web down）。→ **CONDITIONALLY VERIFIED / ENVIRONMENT LIMITED**。

# 20. Security / RBAC（§20）

- **NOT PASS（P0）**：
  - `GET /api/v1/demands/{id}`（公开）返回 `createdByUser.passwordHash` → **凭证哈希泄露给访客**。
  - 根因：`demands.service.findOne` `include:{createdByUser:true}` 无安全投影/select 剥离 passwordHash；虽有 `!demand.contactVisible` 联系方式脱敏，但无凭证哈希脱敏；全局无 `@Exclude()`/sanitizer。
  - 正例：`/demands/my`、`/evaluations`、`/notifications` 对访客 401（RBAC/鉴权正确）。
  - 范围：demand **详情**（findOne 系）泄露；列表（findAll）项不含 createdByUser，未泄露。需在修复任务中审计其他 findOne 类公开详情面。
- Guest≠Buyer≠Supplier 的角色分离、受保护 API 鉴权正确；**综上 Security 不满足关闭门槛**。

# 21. Data Integrity（§22）

- Schema = NO CHANGE；Migration = NONE；未新增重复 authority / 未绕过状态机 / 未直接写库绕过 API（本任务零写入）。
- 泄露 passwordHash 属 **Data Authorization 边界破坏（Data Integrity 违规）** → 记入 P0。

# 22. External Discoverability Boundary（§21）

- 公开保持：Home/Search/Categories/Products/Solutions/Knowledge/Supplier Discovery/Business/About（平台公开语义）。
- 私域保持 PRIVATE/AUTHENTICATED/CONTROLLED：Demand 工作流细节、Match、RFQ、RFQResponse、Offer、Inquiry、Workspace、Notification。
- **注意：** Demand **列表搜索**为公开发现语义（联系方式受控）；但 Demand **详情**必须在修复任务中脱敏 passwordHash（不可因 SEO/LLM 暴露业务私域）。

# 23. Existing Conditional Items（§23）

- 保持：M35=CONDITIONAL/NOT CLOSED；M37=CONDITIONAL/NON-BLOCKING。不为关闭 M39 强行关闭；Conditional ≠ Blocking。M39 的 Blocking 由 P0 Security 独立构成，与 M35/M37 无关。

# 24. Blocking Issues（§26 Option C）

- **SEC-804-P0-01（阻塞，阻断 CLOSED）**：公开 `GET /api/v1/demands/{id}` 泄露 `createdByUser.passwordHash` 给访客（Security / Data Integrity / Authorization 边界）。→ M39 = **BLOCKED**。
- 其余无 P0/P1（BR-802-03/04 及空态精修为 NON-BLOCKING）。

# 25. Batch Remediation（§24）

- 保持 NON-BLOCKING / CARRY-FORWARD：BR-802-03（Compare Capability Difference）、BR-802-04（Category Discovery Journey Data Linkage）、803 notifications/offers 空态精修候选。未提升为 blocker。

# 26. Acceptance Matrix

| 验收项 | 状态 | 依据 |
| --- | --- | --- |
| Business Loop | CONDITIONALLY VERIFIED | 真实 API 数据态（demand/rfq/workflow-event）+ 已实现环节 BY CODE；未全链运行时 |
| Frontend Platformization | VERIFIED | 803 认可；无新改动 |
| Buyer E2E | CONDITIONALLY VERIFIED | 前端验证；运行时部分 |
| Supplier E2E | CONDITIONALLY VERIFIED | 前端验证；运行时部分 |
| Workspace | VERIFIED（Code + 部分运行时） | workspace/workflow-events/notifications 已实现 |
| Mobile | VERIFIED（803） | 四视口历史证据；804 未重测 |
| Runtime | CONDITIONALLY VERIFIED / ENV LIMITED | API 实跑；web:3000 down 未跑浏览器 |
| Security / RBAC | **NOT PASS（P0）** | 公开详情泄露 passwordHash |
| Data Integrity | **NOT PASS（P0）** | 凭证哈希泄露 |
| Documentation | IN SYNC | 本报告 + 三文档追加 804 |

# 27. Final Closure Decision（§26）

**M39 = BLOCKED（Option C）**——理由：**Security issue（公开接口泄露凭证哈希）**。

- 由于存在 P0 阻断项，M39 **不得 CLOSED**，亦不满足 **CONDITIONALLY VERIFIED** 的正面判定（Security/Data Integrity 门槛未过）。
- 804 **不修复**（VERIFY ≠ FIX）；该 P0 记为证据，由后续独立授权任务处理。

# 28. Documentation

- 新建：`docs/_review/804_M39_Final_Closure_Gate_Business_Loop_Runtime_And_Platformization_Reconciliation.md`（本文）。
- 追加：`PROJECT_STATUS.md`、`PROJECT_ROADMAP.md`、`MODULE_COMPLETION_MATRIX.md`（记 M39=BLOCKED，SEC-804-P0-01）。
- 历史 790–803 未改写。Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State。

---

# 29. Blocking Issue Register（提交给独立修复任务）

```text
ID           : SEC-804-P0-01
Severity     : P0
Type         : Security / Data Integrity / Authorization-boundary violation
Endpoint     : GET /api/v1/demands/{id}  (public, unauthenticated -> 200)
Leak         : createdByUser.passwordHash (bcrypt hash) returned to Guest
Root Cause   : demands.service.findOne(id) include:{ createdByUser: true } lacks safe projection
               (contact redaction exists; no passwordHash redaction; no global @Exclude()/sanitizer)
Repro Evidence: see database/_804_visual/_804_apistate.json + transcript probe
Closure Impact: Security/RBAC criterion NOT VERIFIED -> M39 blocked from CLOSED/CONDITIONALLY VERIFIED
Status       : RECORDED -> independent authorized fix required (NOT fixed in 804)
```

---

# 30. Final Execution Output

```text
Task:
  804_M39_Final_Closure_Gate_Business_Loop_Runtime_And_Platformization_Reconciliation

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

M39 Whole-site Frontend Platformization:
  VERIFIED

Evaluation → Demand:
  VERIFIED BY CODE / 部分运行时（真实 DRAFT demand + /demands/my=401 RBAC 有效）

Demand → Match:
  VERIFIED BY CODE / NOT RUNTIME VERIFIED（matches=[] 真实稀疏）

Match → RFQ:
  VERIFIED BY CODE / 运行时目标未产生合格 match（现有 rfq source/target=null）

RFQ → RFQResponse:
  VERIFIED BY CODE / 部分运行时

RFQResponse → Offer:
  VERIFIED BY CODE / NOT RUNTIME VERIFIED（offers=0 真实）

Offer → Inquiry:
  VERIFIED BY CODE（Inquiry=Connection，非 Order/Deal/Lead）

Inquiry → Workspace:
  VERIFIED BY CODE / 部分运行时（DEMAND workflow-event 真实存在）

Buyer E2E:
  CONDITIONALLY VERIFIED（前端验证；运行时部分）

Supplier E2E:
  CONDITIONALLY VERIFIED（前端验证；运行时部分）

Workspace:
  VERIFIED（Code + 部分运行时）

Public Discovery:
  VERIFIED（803 抽样认可，无回归）

Cross-surface Experience:
  VERIFIED

Mobile:
  VERIFIED（803 四视口认可；804 未重测）

Runtime:
  CONDITIONALLY VERIFIED / ENVIRONMENT LIMITED（API:4000 实跑；web:3000 当前 DOWN 未跑浏览器）

Security / RBAC:
  NOT VERIFIED（P0 SEC-804-P0-01：公开详情泄露 createdByUser.passwordHash 给访客）

Data Integrity:
  NOT VERIFIED（P0 SEC-804-P0-01 授权/数据边界破坏；Schema=NO CHANGE）

External Discoverability:
  PRIVATE / CONTROLLED business surfaces 保持；Demand 详情需在修复任务中脱敏

Schema:
  NO CHANGE

API:
  EXISTING ONLY

Migration:
  NONE

Fundamental Change:
  0

Blocking Issues:
  SEC-804-P0-01（公开 GET /api/v1/demands/{id} 泄露 createdByUser.passwordHash；Security/Data Integrity；阻断 CLOSED）

Batch Remediation:
  BR-802-03 / BR-802-04 + notifications/offers 空态精修候选（NON-BLOCKING / CARRY-FORWARD）

Documentation:
  COMPLETE（804 Review Report + STATUS/ROADMAP/MATRIX 追加 804；历史 790-803 未改写）

M39 Final Closure Decision:
  BLOCKED（Option C，因 P0 Security issue）

M39 Final State:
  BLOCKED（非 CLOSED；非 CONDITIONALLY VERIFIED）

Next Step:
  STOP —— 不自动创建后续任务；SEC-804-P0-01 交由独立授权修复任务处理；
  M39 关闭门只在 P0 清零后按独立验收复核重新评估
```

---

# 31. STOP

```text
STOP
```

804 完成。不自动创建 805 或任何后续任务；不创建 M39.x；不重开 M38。M39 = **BLOCKED**。P0（SEC-804-P0-01）作为证据留待独立授权修复与复核。