文档创建：2026.08.11

建立一个项目状态基准层（Project Knowledge Base）：

VISNDT/
│
├── docs/
│   ├── _review/                 # 每次开发审计报告（已有）
│   │
│   ├── project-management/      # 新增：长期项目状态管理
│       │
│       ├── PROJECT_STATUS.md
│       ├── PROJECT_ROADMAP.md
│       ├── MODULE_COMPLETION_MATRIX.md
│       ├── BUSINESS_CAPABILITY_MAP.md
│       ├── CONTENT_MANAGEMENT_PLAN.md
│       └── DEVELOPMENT_RULES.md

定位：

文件	作用	更新频率
PROJECT_STATUS.md	当前项目实时状态	每次阶段完成更新
PROJECT_ROADMAP.md	M阶段路线图	阶段调整更新
MODULE_COMPLETION_MATRIX.md	模块完成度	功能完成更新
BUSINESS_CAPABILITY_MAP.md	业务能力地图	架构变化更新
CONTENT_MANAGEMENT_PLAN.md	内容管理体系规划	CMS设计变化更新
DEVELOPMENT_RULES.md	开发规则	长期稳定

这样：

Trae 每次开发只更新状态
ChatGPT 每次规划读取状态
不需要重新扫描整个项目
防止代码进度超过文档
==============================后续开发规划==========================
根据 425 校准结果，VISNDT 已进入“业务闭环治理 → 稳定化 → 运营能力建设”的阶段。后续主线不建议继续按照传统“M阶段堆功能”的方式推进，而应调整为：

治理稳定线
+
业务深化线
+
运营能力线

三条线分阶段推进。

当前最重要调整：

不要直接进入 CMS 开发。

原因：

WorkflowEvent 未完全统一；
Mutation Boundary 未完全收口；
Service Boundary 仍有遗留；
公开询价链路仍未稳定。

如果现在建设 CMS，会把新的生命周期、权限、审核、SEO流程再次叠加到未完全稳定的架构上。

VISNDT 主线开发规划 V3.0
总路线
M15 技术治理收口
        ↓
M16 业务深化前稳定化
        ↓
M17 内容管理体系建设
        ↓
M18 运营增长体系
Phase 1：M15 Technical Governance Finish

目标：

让当前业务闭环成为稳定领域系统。

不新增大业务。

M15.1 WorkflowEvent Domain 完整化

优先级：

★★★★★

目标：

建立统一事件模型：

Domain Action

↓

WorkflowEvent

↓

Notification

↓

AuditLog

覆盖：

Demand

事件：

DEMAND_CREATED
DEMAND_SUBMITTED
DEMAND_UPDATED
DEMAND_CLOSED
Matching

事件：

MATCH_CREATED
MATCH_UPDATED
MATCH_CONFIRMED
RFQ

事件：

RFQ_CREATED
RFQ_SENT
RFQ_CLOSED
RFQ Response

事件：

RESPONSE_CREATED
RESPONSE_ACCEPTED
RESPONSE_REJECTED

完成标准：

所有核心状态变化必须产生事件；
Notification来源统一；
AuditLog可追踪。
M15.2 Mutation Boundary 收口

目标：

统一：

Frontend Action

↓

Service

↓

Business Logic

↓

Repository/API

↓

Event

禁止：

Component

↓

直接调用API修改业务状态

重点扫描：

apps/web/src/app/**
apps/web/src/components/**

清理：

@/lib/api/*

直接业务调用。

M15.3 Dashboard / Workspace边界统一

当前：

Dashboard
Workspace

存在历史兼容。

调整：

定义：

Dashboard:

业务概览入口

Workspace:

业务操作中心

例如：

Buyer：

/dashboard

查看：

需求数量
RFQ状态
通知


/workspace

执行：

创建Demand
查看Match
处理RFQ
Phase 2：M16 Business Stabilization

目标：

让平台真正具备运营准备能力。

M16.1 Public Inquiry闭环

优先级：

★★★★★

当前：

Product Detail

↓

InquiryForm

↓

Inquiry

但数据链不完整。

目标：

形成：

产品页面

↓

用户提交询价

↓

关联：

Product

Organization

Demand(可选)

↓

Admin处理

↓

Notification

↓

业务跟进
M16.2 SEO基础能力

不是CMS。

先建设：

SEO Foundation

包括：

动态Metadata
Sitemap
Structured Data
产品SEO字段
M16.3 Content Domain设计冻结

只设计，不开发。

输出：

CONTENT_DOMAIN_DESIGN.md

确定：

实体关系：

Content

├── Article

├── Knowledge

├── Solution

├── Insight

└── SEO Metadata
Phase 3：M17 Content Management System

正式建设：

VISNDT CMS

顺序：

M17.1 Content基础模型

Prisma：

Content
ContentCategory
ContentTag
SeoMetadata
M17.2 Article

行业文章。

M17.3 Knowledge

技术知识。

M17.4 Solution

行业方案。

M17.5 Insight

参数解释体系。

重点：

不要新建参数体系。

关系：

ParameterDefinition

↓

Insight

↓

产品选型说明

Phase 4：M18运营体系

建设：

内容运营
SEO增长
数据分析
推荐优化
匹配算法2.0
开发协作模式调整

以后采用：

新模式：Documentation Driven Development

即：

状态文件

↓

架构规划

↓

Trae执行

↓

代码变更

↓

自动更新状态文件

↓

ChatGPT审核
文件同步规则调整

以后每一个Trae任务必须同步检查：

一级状态文件
docs/project-management/

必须维护：

PROJECT_STATUS.md

PROJECT_ROADMAP.md

MODULE_COMPLETION_MATRIX.md

BUSINESS_CAPABILITY_MAP.md

CONTENT_MANAGEMENT_PLAN.md
二级任务文件

每个M阶段新增：

例如：

docs/project-management/M15/

包含：

M15_TASK_PLAN.md

M15_PROGRESS.md

M15_CLOSEOUT.md
三级审核文件

保持：

docs/_review/

格式：

编号_Module_Task_Report.md

例如：

426_M15.2_WorkflowEvent_Audit_Report.md

下面为后续所有
-------------------------精简后的模板--------------------
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

Repository Root:

* 检查真实 Git 根目录

Code Root:

* 确认 VISNDT 代码目录

Branch:

* 确认当前分支

禁止：

* 错误目录执行
* 创建重复项目目录
* 修改冻结区域
* 修改未授权模块

---

# 2. Scope Control

## Allowed

允许：

* 修改任务明确指定文件
* 新增任务明确指定目录
* 完成任务要求范围内代码调整

## Forbidden

禁止：

* 扩展未批准需求
* 重构无关模块
* 修改数据库 Schema（除非任务明确要求）
* 修改 API Contract（除非任务明确要求）
* 引入新的业务模型
* 提前实施后续阶段能力

---

# 3. Architecture Constraint

必须保持：

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

不得绕过现有分层。

---

# 4. Impact Verification

执行过程中必须检查：

## Business

* 是否影响现有业务闭环
* 是否破坏已有流程
* 是否引入未设计业务状态

## Security

* RBAC 是否保持兼容
* 权限边界是否变化

## Technical

* Prisma Schema 是否变化
* Migration 是否变化
* API 是否兼容
* Frozen Module 是否受影响

---

# 5. Project Documentation Synchronization

任务完成后，如产生任何能力变化，必须同步更新：

```
docs/project-management/

PROJECT_STATUS.md

PROJECT_ROADMAP.md

MODULE_COMPLETION_MATRIX.md

BUSINESS_CAPABILITY_MAP.md

CONTENT_MANAGEMENT_PLAN.md
```

必须同步记录：

* 当前完成状态
* 模块完成度
* 新增能力
* 架构变化
* 已知风险
* 下一阶段建议

原则：

> Code State = Documentation State

任何新增能力不得只存在代码中。

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

* Task ID
* Task Type
* Stage
* Scope

## 2. Repository Verification

* Root
* Branch
* Freeze Check

## 3. Modified Files

* 文件列表
* 修改目的

## 4. Architecture Impact

* Frontend Impact
* Backend Impact
* Domain Impact

## 5. Database Impact

* Schema
* Migration
* Data Impact

## 6. API Impact

* Endpoint Changes
* Compatibility

## 7. Security Impact

* RBAC
* Permission

## 8. Build Verification

记录：

* Build Status
* Test Status
* 未执行原因

## 9. Freeze Compatibility Check

确认：

* 是否违反冻结范围
* 是否影响历史模块

## 10. Project Status Update

记录：

* 状态文件更新情况

## 11. Next Recommendation

说明：

* 下一任务
* 是否允许进入下一阶段

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

# Current Recommended Execution Direction

当前进入：

428 - M15.2 WorkflowEvent Implementation

目标：

完成：

* WorkflowEvent 事件补齐
* Match 主体统一
* Demand 生命周期边界收敛
* RFQ 生命周期边界收敛

禁止扩展：

* Notification Schema 改造
* AuditLog Schema 改造
* CMS
* SEO
* Content Workflow

原因：

WorkflowEvent 是后续：

* Notification
* AuditLog
* CMS 审核流
* 内容发布流程
* SEO 状态管理

共同基础。

必须先稳定：

事件模型

↓

生命周期

↓

业务状态流转

再进入后续业务能力建设。
