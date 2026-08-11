# Technical Debt / Deferred Fix Registry

Updated Date: `2026-08-11`

## Registry Rules

- 所有 `PASS WITH RISKS` 必须登记。
- 所有延期修复必须登记。
- 所有暂不修复事项必须登记。
- 所有历史兼容问题与架构债务必须登记。
- 修复前必须关联 `TD` 编号。
- 修复完成后必须关闭对应条目并补充验证结果。

## Status Definition

- `OPEN`
- `DEFERRED`
- `PLANNED`
- `FIXING`
- `DONE`

## Current Registry

### TD-001

- 编号：`TD-001`
- 名称：`Workspace Frontend Service Boundary Normalization`
- 来源：`408_M14.6.2.2, 413_M14.6.3.4`
- 发现时间：`2026-08-11`
- 问题描述：Workspace 前端当前存在多处未完全统一到 `page -> service -> api wrapper` 的调用边界，包括 Buyer RFQ Create 直接调用 API wrapper、Demand Create 绕过既有 service、Matches 页面读写边界混用，以及 Notifications 页面默认直接依赖 API wrapper 且缺少独立 service 封装。
- 风险等级：`MEDIUM`
- 影响范围：`apps/web workspace frontend service boundary for RFQ create, Demand create, Match mutation, and Notifications page API access`
- 当前状态：`DEFERRED`
- 延期原因：当前主流程均可用，问题主要影响前端分层一致性、错误归一、权限收口和后续维护治理，暂不阻断现阶段 M14.6 业务验证。
- 计划处理阶段：`M15 Technical Debt Cleanup`
- 修复约束：禁止绕过既有服务层约束；修复时应优先补齐或复用 service 层，不得通过页面继续直接绑定底层 API wrapper；修复任务必须显式关联 `TD-001`，并在关闭时补充验证报告。

### TD-002

- 编号：`TD-002`
- 名称：`WorkflowEvent Lifecycle Completeness`
- 来源：`409_M14.6.3.0, 411_M14.6.3.2`
- 发现时间：`2026-08-11`
- 问题描述：WorkflowEvent 生命周期覆盖存在已确认缺口，当前至少包括 `RFQResponse CREATE` 未形成对应事件、`MATCH_CREATED` 未形成对应事件，以及整体 Lifecycle Event Coverage Gap 仍需持续核对与补齐，导致业务生命周期与事件审计链路之间未完全闭环。
- 风险等级：`MEDIUM`
- 影响范围：`apps/api workflow event lifecycle coverage for RFQResponse CREATE, MATCH_CREATED, and lifecycle audit completeness`
- 当前状态：`OPEN`
- 延期原因：需要基于审计结果进一步梳理事件落点、命名一致性与补齐范围；当前风险已被识别，但尚未进入单独修复任务。
- 计划处理阶段：`M14.6 Workflow Audit Closure or M15 Hardening`
- 修复约束：不得脱离审计结论直接实施修复；修复任务必须显式关联 `TD-002`，完成后补充相关报告与验证结论。

### TD-003

- 编号：`TD-003`
- 名称：`Supplier RFQ Response Frontend State Gate`
- 来源：`408_M14.6.2.2, 411_M14.6.3.2`
- 发现时间：`2026-08-11`
- 问题描述：Supplier RFQ Response 前端操作入口虽已可用，但页面级动作可见性与可执行性对 RFQ 生命周期状态的表达仍偏弱，当前更多依赖后端校验兜底，尚未完全体现前端领域边界对非法状态的先行收口。
- 风险等级：`MEDIUM`
- 影响范围：`apps/web supplier RFQ response page state gating and lifecycle boundary expression`
- 当前状态：`OPEN`
- 延期原因：当前主流程已可用，问题属于前端领域边界强化与体验一致性治理，暂不阻断现阶段任务闭环。
- 计划处理阶段：`M15 Technical Debt Cleanup`
- 修复约束：不得新增未经批准业务能力；必须沿用既有 RFQ 生命周期语义与页面/service 分层，不得以绕过后端校验替代前端状态边界表达。

### TD-004

- 编号：`TD-004`
- 名称：`MATCH Entity Subject Canonicalization`
- 来源：`409_M14.6.3.0, 411_M14.6.3.2`
- 发现时间：`2026-08-11`
- 问题描述：MATCH 相关生命周期记录的 Entity Subject 尚未完全规范化，当前匹配实体的事件主体表达存在不一致风险，削弱了跨阶段审计、追踪与生命周期还原时的语义稳定性。
- 风险等级：`MEDIUM`
- 影响范围：`apps/api match workflow event subject consistency and lifecycle traceability`
- 当前状态：`OPEN`
- 延期原因：该问题主要影响审计一致性与治理可追溯性，虽不直接阻断当前业务流程，但需要后续结合事件补齐统一处理。
- 计划处理阶段：`M15 Technical Debt Cleanup`
- 修复约束：不得在未统一实体语义前分散修补单点事件；修复时必须与 WorkflowEvent 审计口径保持一致，并显式关联 `TD-004`。

### TD-005

- 编号：`TD-005`
- 名称：`Generic Lifecycle Mutation Boundary`
- 来源：`406_M14.6.2.0, 409_M14.6.3.0, 411_M14.6.3.2`
- 发现时间：`2026-08-11`
- 问题描述：当前仍存在 Generic Lifecycle Mutation Boundary 风险，即通用变更入口可能覆盖 Demand / RFQ 等生命周期状态修改路径，导致专用 workflow transition 边界被弱化，保留绕过状态机校验的遗留空间。
- 风险等级：`HIGH`
- 影响范围：`apps/api generic mutation surfaces for demand and RFQ lifecycle state changes`
- 当前状态：`DEFERRED`
- 延期原因：该问题涉及既有接口边界与历史兼容路径，直接调整可能影响现有调用链，需在明确替代方案与迁移路径后再进入实施。
- 计划处理阶段：`M15 Hardening`
- 修复约束：禁止直接破坏现有兼容调用；必须优先收敛到专用 workflow transition 接口，并在修复前完成影响面审计与任务编号关联。

### TD-006

- 编号：`TD-006`
- 名称：`Workspace Frontend Access Boundary Normalization`
- 来源：`413_M14.6.3.4`
- 发现时间：`2026-08-11`
- 问题描述：Supplier Workspace 相关页面当前将 `RoleGuard` 放置在数据加载内容组件内部，导致 `AuthGuard` 通过后内容组件仍可能先挂载并触发受限数据请求，再由 `RoleGuard` 返回拒绝态，前端 RBAC 的权限检查时序未完全收口到内容挂载之前。
- 风险等级：`HIGH`
- 影响范围：`apps/web supplier workspace frontend access boundary, RoleGuard placement, and RBAC execution order`
- 当前状态：`OPEN`
- 延期原因：当前错误角色用户仍会在 UI 层看到拒绝结果，问题主要集中在前端访问边界表达与执行时序，不阻断现阶段主业务闭环，但需要在后续硬化阶段规范化。
- 计划处理阶段：`M15 Hardening`
- 修复约束：不得新增未经批准权限模型；必须沿用现有 `AuthGuard` / `RoleGuard` 合约，并将角色校验前置到受保护内容组件挂载之前；修复任务必须显式关联 `TD-006`，并在关闭时补充验证报告。

## Attached Notes

- `Supplier` 双入口（`/dashboard/supplier` 与 `/workspace/supplier`）当前仍存在低风险认知残留，但基于 `401_M14.5.4` 已完成路由归属规范化，且 `413_M14.6.3.4` 将其定性为低风险 UX/导航表达问题，因此本轮不新增独立 TD，仅作为后续相关治理任务的附属说明。
