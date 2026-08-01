VISNDT Documentation Context Architecture V1.0

目录：

F:\Desktop\VISNDT

docs
│
├── _review
│
│   ├── 228_M13.2.5.4_ProductMedia_Display_Report.md
│   ├── 229_M13.2.6_ProductMedia_E2E_Report.md
│   ├── 230_M13.2.7.1_Delete_Audit_Report.md
│   └── 231_M13.2.7.2_Delete_Fix_Report.md
│
│
└── _context
    │
    ├── 00_PROJECT_MASTER_CONTEXT.md
    │
    ├── 01_ARCHITECTURE_DECISION_LOG.md
    │
    ├── 02_FREEZE_ZONE.md
    │
    ├── 03_TECH_STACK_CONTEXT.md
    │
    ├── 04_DATABASE_CONTEXT.md
    │
    ├── 05_API_CONTEXT.md
    │
    ├── 06_SECURITY_CONTEXT.md
    │
    └── M13.2_ProductMedia_Context_Handoff_V1.0.md
一、00_PROJECT_MASTER_CONTEXT.md
定位：

VISNDT 项目唯一总入口

任何：

ChatGPT 新聊天
Trae 新账号
新开发人员

第一读取。

内容：

# VISNDT Project Master Context


## 1. Project Identity

项目名称：
VISNDT Industrial Inspection Platform


## 2. Current Status

Current Phase:
M13.2 Completed


## 3. System Overview

Backend:
NestJS

Frontend:
React + Vite + Ant Design

Database:
PostgreSQL + Prisma


## 4. Business Domains

Product
Supplier
Demand
Matching
RFQ
FileAsset


## 5. Current Metrics

Backend Modules:
20+

API:
80+

Models:
22


## 6. Current Development Phase


## 7. Latest Context

Latest Handoff:

M13.2_ProductMedia_Context_Handoff_V1.0


## 8. Rules

Always read:

ARCHITECTURE_DECISION_LOG

FREEZE_ZONE

before modification
二、01_ARCHITECTURE_DECISION_LOG.md

这个非常重要。

解决：

为什么这么设计？

例如：

ADR-001
Decision

采用：

Hugo + Vercel + Turso

Reason

原因：

SEO优先
静态性能
降低维护成本
ADR-002
Decision

Backend:

NestJS + Prisma

Reason:

模块化
类型安全
ADR-003
Decision

FileAsset 独立模型

Reason:

统一管理：

产品图片
认证文件
文档
ADR-004
Decision

ProductMedia删除必须同步FileAsset

Date:

2026-08-01

Reason:

M13.2.7.1发现生命周期漏洞

以后重大架构变化都记录这里。

三、02_FREEZE_ZONE.md

这个非常符合你现在和 Trae 配合方式。

明确：

Frozen

例如：

Database Schema

禁止：
- 随意增加字段
- 修改关系
- 修改migration


API Contract

禁止：
- 修改已有Endpoint
- 修改Response结构


Core Modules

禁止：
- Product
- Demand
- Matching
Change Procedure

如果需要修改冻结区域：

必须：

提交 Architecture Review
评估影响
更新 Decision Log
才执行
四、03_TECH_STACK_CONTEXT.md

记录：

Backend

NestJS
Prisma
PostgreSQL
JWT


Frontend

React
TypeScript
Vite
Ant Design


Storage

MinIO/S3


Deployment

Vercel
五、04_DATABASE_CONTEXT.md

记录：

不是完整schema。

而是：

核心模型关系：

User

Organization

Product

ProductMedia

FileAsset

Demand

Matching

以及：

重要关系。

六、05_API_CONTEXT.md

记录：

核心API。

例如：

ProductMedia:

GET /products/:id/media

POST /products/:id/media

DELETE /products/:id/media/:id

并注明：

状态：

Stable

七、06_SECURITY_CONTEXT.md

记录：

例如：

已完成：

JWT
RBAC
Organization isolation

风险：

CSRF
AuditLog
Request ID
八、阶段 Handoff

例如：

M13.2_ProductMedia_Context_Handoff_V1.0.md

只负责：

“现在做到哪里”

包含：

完成事项

修改文件

当前代码状态

测试状态

遗留问题

下一阶段入口
九、以后 ChatGPT 工作流程

新聊天：

第一条：

复制：

读取以下VISNDT项目上下文：

1. 00_PROJECT_MASTER_CONTEXT
2. 01_ARCHITECTURE_DECISION_LOG
3. 02_FREEZE_ZONE
4. 当前阶段Context_Handoff


继续按照：
规划→审核→Trae指令→执行结果审核
模式工作。
十、以后 Trae 新账号流程

第一任务：

你正在接手VISNDT项目。

请先读取：

docs/_context/

必须阅读：

00_PROJECT_MASTER_CONTEXT.md

01_ARCHITECTURE_DECISION_LOG.md

02_FREEZE_ZONE.md

以及当前阶段Handoff。

不要修改代码。

先输出：
1. 当前项目理解
2. 当前阶段
3. 禁止修改区域
4. 下一步等待任务

十一、和原来的方案关系

不是替代：

而是升级。

最终：

_context

├── 项目长期记忆
│
├── 架构决策
│
├── 冻结规则
│
├── 技术状态
│
└── 阶段状态

形成五层：

长期记忆
    ↓
架构原则
    ↓
约束边界
    ↓
技术状态
    ↓
阶段任务
十二、对当前 M13.2 的执行建议调整

因此下一步不只是生成：

132_ProductMedia_Context_Handoff_V1.0.md

而应该首次补齐：

docs/_context/

00_PROJECT_MASTER_CONTEXT.md

01_ARCHITECTURE_DECISION_LOG.md

02_FREEZE_ZONE.md

03_TECH_STACK_CONTEXT.md

04_DATABASE_CONTEXT.md

05_API_CONTEXT.md

06_SECURITY_CONTEXT.md

132_ProductMedia_Context_Handoff_V1.0.md

以后这些作为项目基础设施长期维护。

这个调整我认为非常适合 VISNDT 当前阶段，也能最大程度解决你之前担心的：

ChatGPT 新聊天失忆
Trae 换账号无法接续
项目越做越大后设计漂移
后续开发误修改核心架构