# VISNDT Trae Execution Instruction V3.2.3

> Version: V3.2.3
> Status: STABLE / LONG-TERM DEVELOPMENT CONTINUATION STANDARD
> Scope: VISNDT Project / Trae Controlled Development / Architecture Evolution
> Supersedes: V3.2.2（在保留 V3.2.2 全部框架的基础上，新增「开发过程安全」强化章节）

## Core Principle

```
Code State = Documentation State = Architecture State = Roadmap State
```

## Additional Principles

```
Product Value > Technical Complexity
```

```
Capability Expansion must be driven by:
Real User Demand + Business Feedback + Product Growth
```

```
Small Scope + Clear Boundary + Documented Change + Verified Impact
```

---

# 0. Development Process Safety（开发过程安全 — V3.2.3 新增）

> 本节为 V3.2.3 相对 V3.2.2 的核心加强，是所有执行动作的前置约束，优先级高于后续所有章节。

## 0.1 Safe Execution Gate（执行安全门禁）

任何变更执行前必须确认：

1. 明确「改什么、不改什么」，禁止空泛改动。
2. 明确「冻结模块」是否被触及（见 §3）。
3. 变更可被撤销（小步、可回滚、可重建）。

禁止：

- 无批准扩展范围
- 无批准重构无关模块
- 无批准删除/重命名既有能力
- 在未阅读代码前提出修改

## 0.2 Git Safety（仓库安全）

必须遵守：

- 不擅自 `git commit` / `git push`（除非用户明确要求）。
- 禁止 `push --force`、`reset --hard`、`checkout .`、`restore .`、`clean -f`、`branch -D`（除非用户明确要求）。
- 暂存时按文件精确 `git add`，禁止 `git add -A` / `git add .`（避免误纳入 `.env` / 凭据 / 大文件）。
- 不改动 `git config`。

## 0.3 Runtime Verification（运行时验证门禁）

「构建通过」不等于「功能正确」。任务完成必须同时验证：

- `npm run build` 全端 exit code = 0。
- 关键路由/接口真运行时 HTTP 状态（200/201/401 边界）。
- 数据链路（DB → API → Frontend）可读可写。
- 冻结模块回归未漂移。

## 0.4 Data Safety（数据安全）

涉及数据库 / 演示数据 / 凭据时：

- 变更必须幂等（重复执行不产生副作用）。
- 多步写操作使用事务，失败可回滚。
- 禁止在无确认时修改生产/真实凭据。
- seed 脚本必须是可重复初始化（Safety Gates + Upsert + Deterministic IDs）。
- 禁止把真实密钥写入代码/文档/提交。

## 0.5 Frozen Module Protection（冻结模块保护）

默认冻结（除非任务明确重新解冻）：

```
Matching Core        Scoring Algorithm
Product Core Model   Database Schema
AI Module            Search Ranking Logic
```

触及冻结模块前必须先经架构审核，否则视为违规。

## 0.6 Human Gate（人工确认门禁）

以下动作必须先经用户确认，不得自动执行：

- 数据库 Schema / Migration 变更
- API Contract 变更
- 新增业务模型 / 新表
- 依赖升级 / 技术栈变更
- 任何破坏性操作（删除、重置、回滚）

---

# 1. Task Definition

## Task

[Task ID + Task Name]

## Task Type

Architecture / Development / Refactor / Audit / Optimization / Validation

## Stage

[Mxx.x.x]

## Execution Mode

Trae Implementation / Trae Audit / Architecture Review / Documentation Sync

## Objective

明确本次任务唯一目标；说明「解决的问题 / 交付能力 / 不包含能力」。

禁止：扩大范围、引入未来阶段目标、提前实现未验证需求。

## Baseline

Previous Completed Task:
```
[Previous Task ID]
```
Reference Reports:
```
docs/_review/
```

---

# 2. Pre-Execution Verification

执行前必须确认：

- Repository Root 是否正确、Git 状态、当前分支。
- Code Root（Backend / Web / Admin / Database Root）。
- 当前模块 / API / 数据库 / 文档状态。

禁止基于假设修改代码。

---

# 3. Scope Control

## Allowed Scope

```
[明确允许目录]
```

## Forbidden Scope

```
[冻结模块]
```

## Expansion Control

禁止：

```
No Unrequested Feature     No Architecture Rewrite
No New Business Model      No Marketplace Expansion
No AI Automatic Decision
```

---

# 4. Architecture Constraint

## Product-Centric Principle

VISNDT 核心定位：

```
Industrial Inspection Product Discovery + Business Matching Platform
```

不是：AI Consultant Platform / Marketplace Platform / Automatic Decision System。

## Permanent Boundary Rules

```
Knowledge ≠ Score Input
AI ≠ Matching Engine
Search ≠ Ranking Engine
Analytics ≠ Automatic Optimization
```

## Data Boundary

新增能力优先：`Reuse Existing Model > Extend Existing Capability > Create New Entity`。
新增数据库必须经过架构审核。

---

# 5. Impact Verification

执行完成后必须验证：

- Backend Impact（API / Service / Module / 权限）
- Database Impact（Schema Change: YES/NO；YES 时说明 Model/Migration/Compatibility）
- Frontend Impact（Web / Admin / UI Flow）
- Architecture Impact（Matching/Search/AI/Product Model 各标 UNCHANGED/CHANGED）

---

# 6. Project Documentation Synchronization

任务完成后必须同步：

- Review Report → `docs/_review/`，命名 `[TaskID]_[TaskName]_Report.md`
- 项目文档 → `docs/project-management/`（PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX 等）

核心原则：`Code State = Documentation State`。禁止「代码完成但无报告 / 文档超前于代码 / Roadmap 与实现不一致」。

---

# 7. Review Report Requirement

报告必须包含：

1. Repository Verification
2. Implementation Summary
3. Architecture Boundary Verification
4. Impact Report（含 Safety Gate 逐项核对）
5. Build Verification（实际执行结果）
6. Risk Assessment
7. Final Review Status（PASS / CONDITIONAL PASS / FAILED）

Boundary Verification 必须验证：

```
Knowledge ≠ Score Input
AI ≠ Matching Engine
Search ≠ Ranking Engine
Analytics ≠ Automatic Optimization
```

---

# 8. Final Execution Output

最终输出必须包含：

```
Task / Status / Changed Files / Architecture Impact /
Database Impact / API Impact / Build Result
```

## Next Recommendation

必须说明 `Next Step` 或 `Stage Closed`。禁止强制扩大开发。

---

# Execution & Product Principle

## Development Principle

```
Small Scope + Clear Boundary + Documented Change + Verified Impact
```

## Product Principle

优先建设：Product Experience / Supplier Capability / Content Asset / Business Conversion。
而不是 Technical Complexity。

## Long-Term Evolution Principle

所有未来开发必须回答：是否提升产品发现 / 采购理解 / 供应商转化 / 平台资产。答案为 NO 则不进入开发。

---

# Current Project Freeze Reference

当前阶段状态以 `docs/project-management/PROJECT_STATUS.md` 为准。
后续重新启动开发时，必须首先执行：

```
Architecture Reassessment + Business Requirement Validation + Scope Confirmation
```
再进入具体开发任务。