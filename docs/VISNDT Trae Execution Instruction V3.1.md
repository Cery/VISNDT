# VISNDT Trae Execution Instruction V3.1

## Task Definition

Task:

[任务编号 + 任务名称]

Task Type:

[Architecture / Development / Refactor / Audit]

Stage:

[M15 / M16 / M17]


---

# 1. Pre-Execution Verification

执行前必须确认：

## Repository Root

- 检查真实 Git 根目录
- 确认当前执行位置正确

## Code Root

- 确认 VISNDT 实际代码目录

## Branch

- 确认当前 Git 分支


禁止：

- 在错误目录执行任务
- 创建重复项目目录
- 修改冻结区域
- 修改未授权模块


---

# 2. Scope Control

## Allowed

允许：

- 修改任务明确指定文件
- 新增任务明确指定目录
- 完成当前任务要求范围内代码调整


## Forbidden

禁止：

- 扩展未批准需求
- 重构无关模块
- 修改数据库 Schema（除非任务明确要求）
- 新增数据库 Migration（除非任务明确要求）
- 修改 API Contract（除非任务明确要求）
- 引入新的业务模型
- 提前实施后续阶段能力


---

# 3. Architecture Constraint

必须保持现有架构：

## Frontend

Page

↓

Service

↓

API Wrapper

↓

Backend API


## Backend

Controller

↓

Service

↓

Domain Logic

↓

Persistence

↓

WorkflowEvent

↓

Notification / Audit


不得：

- 绕过 Service 层
- Controller 直接操作数据库
- 前端直接访问数据库
- 破坏已有业务边界


---

# 4. Impact Verification

执行过程中必须检查：


## Business Impact

确认：

- 是否影响已有业务闭环
- 是否破坏已有流程
- 是否引入未设计业务状态


## Security Impact

确认：

- RBAC 是否保持兼容
- 权限边界是否变化
- Authentication 是否受影响


## Technical Impact

确认：

- Prisma Schema 是否变化
- Migration 是否变化
- API 是否兼容
- Frozen Module 是否受影响
- Frontend / Admin 是否受影响


---

# 5. Project Documentation Synchronization

任务完成后：

如果产生任何能力变化，必须同步更新：

```
docs/project-management/

PROJECT_STATUS.md

PROJECT_ROADMAP.md

MODULE_COMPLETION_MATRIX.md

BUSINESS_CAPABILITY_MAP.md

CONTENT_MANAGEMENT_PLAN.md
```


必须记录：

- 当前完成状态
- 模块完成度
- 新增能力
- 架构变化
- 已知风险
- 下一阶段建议


核心原则：

> Code State = Documentation State


任何新增能力：

不得只存在代码中。

必须同步进入项目管理体系。


---

# 6. Review Report Requirement

必须生成：

```
docs/_review/
```


文件格式：

```
编号_任务名称_Report.md
```


报告必须包含：


## 1. Task Overview

包含：

- Task ID
- Task Type
- Stage
- Scope


## 2. Repository Verification

包含：

- Repository Root
- Code Root
- Branch
- Freeze Check


## 3. Modified Files

包含：

- 文件列表
- 修改目的


## 4. Architecture Impact

包含：

- Frontend Impact
- Backend Impact
- Domain Impact


## 5. Database Impact

包含：

- Schema Changes
- Migration Changes
- Data Impact


## 6. API Impact

包含：

- Endpoint Changes
- Compatibility Assessment


## 7. Security Impact

包含：

- RBAC
- Permission
- Authentication Impact


## 8. Build Verification

记录：

- Build Status
- Test Status
- 未执行原因


## 9. Freeze Compatibility Check

确认：

- 是否违反冻结范围
- 是否影响历史模块


## 10. Project Status Update

记录：

- 状态文件同步情况


## 11. Next Recommendation

说明：

- 下一任务
- 是否允许进入下一阶段


---

# 7. Final Execution Output

执行完成后必须输出：


## Modified Files

代码修改文件列表


## Documentation Updates

状态文件更新列表


## Review Report

报告路径


## Build Result

Build / Test 状态


## Risk Summary

剩余风险


## Next Step

下一执行建议


---

# Execution Principle

VISNDT 开发必须遵循：


1. 小范围治理优先

2. 架构稳定优先

3. 文档同步优先

4. 禁止无批准扩展

5. 后续阶段不得提前实现


---

# Current Task Context

当前任务：

[填写当前任务]


目标：

[填写任务目标]


必须完成：

- [事项1]
- [事项2]
- [事项3]


禁止扩展：

- Notification Schema
- AuditLog Schema
- CMS
- SEO
- Content Workflow

除非当前任务明确要求。


---

# Final Principle

任何开发任务必须满足：

代码状态

↓

项目文档状态

↓

业务能力状态


三者保持一致。


VISNDT 开发流程：

先稳定：

事件模型

↓

生命周期

↓

业务状态流转


再进入：

业务深化

↓

内容体系

↓

运营能力

↓

SEO 能力