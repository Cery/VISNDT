# ADR-M34-13 — Shortlist Persistence Boundary

> **Status**: DECIDED（Decision Only — 不实施 Feature）
> **Comparable Context**: M34.6 Evaluation + Connection
> **Version**: V3.2.3
> **Date**: 2026-08-31
> **Related**: 764 C4（Case A Carry Forward）→ 本 ADR 将之落为正式决策

---

## Decision ID

`ADR-M34-13`

## Context

M34.6 涉及「Evaluation + Connection」工作流。买家（Buyer）在 Discovery / Search 中对 Product 与 SupplierProduct 进行评估时，需要**暂存 / 短名单 / 对比**能力以支撑后续 Connection（Inquiry / RFQ）。

当前系统：
- ONE Authority 已存在：Product / SupplierProduct / Organization(type=SUPPLIER) / ProductCategory / ParameterDefinition / KnowledgeEntry。
- 买家身份存在于 `User` + `Organization` + `OrganizationMember(role)`；Buyer Workspace 已存在（`workspaceRole=SUPPLIER / BUYER`）。
- **`schema.prisma` 无** `Shortlist` / `Evaluation` / `Favorite` / `Watchlist` / `Comparison` / `SelectionList` 任何一级 Domain Model（核验：grep schema，仅存在 Offer/Demand/DemandParameter/DemandMatch/RFQ/RFQResponse/Inquiry）。
- 既有 Search / Product detail / Parameter Context 均由既有 Authority 计算输出，均为**无状态只读计算**。

本决策要回答的核心问题：**Shortlist / Evaluation State 应属于哪种持久化边界？**

## Problem

在 M34.6 实施 Evaluation + Connection 工作流时，买家的「收藏 / 短名单 / 评估状态」应当：

- **A. Session / Temporary Evaluation State**（会话级、非持久化），还是
- **B. Persistent User Evaluation State**（持久化到数据库、跨设备跨会话）？

选择将影响：是否需要新增一级 Domain Model + 迁移；RBAC / Authorization 影响面；Buyer Workspace 的数据架构；Search→Evaluation→Connection 的数据流。

## Options

### Option A — Session / Temporary Evaluation State

- 评估状态仅存于客户端 / 会话（Session / Memory / Storage），不落入数据库。
- 优点：零 Schema 变更、零迁移、零新建 Authority、与「EAI 冻结/不扩充一级模型」最一致。
- 缺点：跨设备/跨会话不可用；无法做服务端审计、无法支撑「买家稍后再看、下次返回继续」；无法作为 RFQ/Inquiry 的可信引用；无法支撑 M34.7 治理/SEO/个人化。

### Option B — Persistent User Evaluation State（**CHOSEN**）

- 评估状态作为**买家用户维度的持久化评估状态**落库，但**不新建一级 Domain Model、不新增 Schema**，而是**钙化在既有 Buyer Workspace / User 上下文中作为“评估状态断面（snapshot）”**表达（见 Authority Boundary）。
- 优点：可跨会话、可审计、可为 Connection（Inquiry/RFQ）提供被评估对象快照引用、支撑 Buyer Workspace 连续性。
- 代价：需要在既有授权链路上承载承载该状态（详见实施边界，属**未来实施任务**）。

## Chosen Option

**Option B — Persistent User Evaluation State**（持久化用户评估状态），但收挈地为：
- **边界**：`Buyer 用户 × 评估对象（Product / SupplierProduct）` 的评估断面（Evaluation Snapshot）。
- **本次仅决策其“持久化方向 = Persistent”与“身份归属 = 买家用户”**；**不实施**任何 Feature / Model / Migration / API / UI / 持久化。

## Rationale

1. **买家工作流连续性（ADR-M34-09）**：Buyer Workspace 已在既有架构中承担“对象引用连续性 + 工作台状态”，持久化评估状态与该契约一致。
2. **Connection 前置**：M34.6 的 Evaluation → Connection（Inquiry/RFQ）需要把「被评估对象 + 快照」作为后续工作流通的可信输入，会话态无法提供服务端可信引用。
3. **审计与治理**：M34.7 的治理链路依赖服务端可查询状态；会话态不可审计。
4. **与冻结一致**：不新建一级 Domain Model（见 Authority Boundary），通过既有 Buyer/User/Workspace 上下文承载，避免破坏 ONE Authority 冻结与「Scheab=NONE / Migration=NONE」。

## Authority Boundary

- **不新增一级 Domain Authority**：`Product / SupplierProduct / Organization / ProductCategory / ParameterDefinition / KnowledgeEntry` 仍然构成既有 Authority；**不新增** `Shortlist` / `Evaluation` / `Comparison` 等一级模型。
- 评估状态作为**买家用户维度既有用户上下文的派生/引用态**（Evaluation Snapshot），**不引入独立权威**，权威仍归属被引用对象（Product / SupplierProduct / Supplier）。

## Persistence Boundary

- **持久化 = 是（Persistent）**：评估状态为买家用户维度的**持久化评估状态**，跨会话可见。
- **存储归属**：未来的持久化实现应作为 **Buyer User 上下文的评估断面（snapshot）**承载（沿用 ADR-M34-09 Buyer Workspace 连续性），**不在本 ADR 实施**。
- **本次决策 ≠ 已实现**。

## Security / RBAC Implications

- 数据归属：评估状态属**买家用户个人**（Buyers）→ 由既有 `OrganizationMember(role)` 与 `workspaceRole`（BUYER）约束。
- 访问控制：读取/写入需经既有 JWT + RBAC（买家身份）；Supplier/Admin 不越权读取买家私人评估状态。
- 隐私：评估状态为买家私人意图，不进入公开 Discovery / Search 输出。

## Mobile/Web Implications

- 该状态需跨 Web / Mobile 保持一致（持久化到服务端）→ 与「Desktop Runtime + Mobile Runtime = Required」的既有契约一致（764 Mobile CARRY FORWARD 项不因本 ADR 改变）。
- Mobile 首先消费该状态的只读视图（Buyer Workspace 用户「稍后」列表），不提新建独立 Mobile 架构。

## Future Implementation Boundary

> **Decision First — Implementation Later**。本 ADR **仅决策**；实施属后续独立任务（M34.6 实际实施阶段），届时需单独评估是否复用既有表（不新增模型的「评估断面持久化」）还是新增受控表（需单独 Gate 批准）。

- 未来实施范围（待授权）：买家「收藏/短名单」在 Buyer Workspace 的持久化读写 API + UI；Connection（Inquiry/RFQ）时引用评估对象快照。
- 未来实施禁止在本任务内进行。

## Non-Goals

- 本 ADR **不**实施 Shortlist / Favorite / Watchlist / Evaluation 的 API、UI、数据库持久化。
- 本 ADR **不**新增 Schema / Model / Migration。
- 本 ADR **不**改变 Search / Discovery / Matching / RFQ / Inquiry 生产逻辑。
- 本 ADR **不**裁决 Session 态的临时排序、比较等 UI 级能力实现细节。

## Migration Requirement

- **NONE**（本任务）。本 ADR 不产生 Migration。
- 未来若在实施时需要新增持久化载体（新表/新列），须**单独提交**并通过既有 Gate（Schema=NONE 解冻）批准，本任务不触发。

---

## 依据 / Traceability

- 依据：764 Report（C4 Case A Carry Forward）、ADR-M34-09（Public / Workspace 连续性：对象引用连续性 + 工作台状态）、ADR-M34-12（Platform Governance：Platform=Rules / Supplier=Assets / Buyer=Intent）。
- ONE Authority 冻结核验：`schema.prisma` 不含 Shortlist/Evaluation/Favorite/Watchlist/Comparison 模型（仅 Offer/Demand/DemandParameter/DemandMatch/RFQ/RFQResponse/Inquiry）。

## 结论

```
Shortlist / Evaluation State
    =
Persistent User Evaluation State (Option B)
Decision = DECIDED
Implementation = NOT STARTED
Schema Change = NONE
Migration = NONE
New Domain Authority = NONE
本次决策 ≠ 功能已实现
```

本 ADR 使 764 的 `Shortlist Architecture = REQUIRED（Case A Carry Forward）` 落为正式 **DECIDED / CARRY FORWARD**，不再视为开放阻断项。