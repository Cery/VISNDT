VISNDT 开发协作流程，不再只生成单阶段交接文档，而采用 “项目级上下文 + 架构决策 + 冻结规则 + 阶段交接”四层上下文体系。

后续新的阶段完成规则调整如下：

F:\Desktop\VISNDT\
│
└── docs\
    │
    ├── _review\
    │      ├── 229_M13.2.6_ProductMedia_E2E_Verification_Report.md
    │      ├── 230_M13.2.7.1_ProductMedia_Delete_Lifecycle_Audit_Report.md
    │      ├── 231_M13.2.7.2_ProductMedia_Delete_Lifecycle_Fix_Report.md
    │      └── ...
    │
    └── _context\
           ├── 00_PROJECT_MASTER_CONTEXT.md
           ├── ARCHITECTURE_DECISION_LOG.md
           ├── FREEZE_ZONE.md
           ├── M13.2_CONTEXT_HANDOFF.md
           ├── M13_CONTEXT_HANDOFF.md
           └── ...
新规则：
1. 00_PROJECT_MASTER_CONTEXT.md

定位：

项目唯一总上下文入口，长期维护。

内容包括：

项目定位
技术栈
当前架构状态
Backend 模块清单
Frontend 应用状态
Prisma Model 状态
API 总览
当前开发阶段
已完成阶段索引
未完成路线图
Trae 使用规则
ChatGPT 协作规则

用途：

新 ChatGPT 对话、新 Trae 账户、新开发人员进入项目时：

第一步读取它。

2. ARCHITECTURE_DECISION_LOG.md

定位：

记录为什么这样设计，而不是记录改了什么。

例如：

已经存在的重要决策：

ADR-001
选择 NestJS + Prisma + PostgreSQL

原因：
企业级业务平台
多租户需求
长期维护

状态：
Accepted
ADR-002
Backend API Schema Freeze

原因：
避免前后台耦合变化

状态：
Active
ADR-003
FileAsset 不直接暴露 GET /files/:id

原因：
当前业务通过 ProductMedia include 获取
避免增加无意义 API

状态：
Accepted

以后避免 Trae 或新 ChatGPT “重新设计”。

3. FREEZE_ZONE.md

定位：

防止误改核心区域。

例如：

# Freeze Zones

## Database

禁止：
- 修改 Prisma Schema
- 新增 Migration

除非：
Mxx 架构升级阶段批准


## Backend API

禁止：
- 修改已有 Endpoint
- 修改 Response 格式


## Matching Engine

状态：
Frozen


## Admin

允许：
- UI优化
- Bug修复

禁止：
- 改业务模型
4. 阶段 Context Handoff

例如：

M13.2_CONTEXT_HANDOFF.md

只在：

M13.2.1
M13.2.2
...
M13.2.7

全部完成后生成。

内容：

# M13.2 Context Handoff

## 阶段目标

## 完成列表

M13.2.1 xxx ✅
M13.2.2 xxx ✅
...
M13.2.7.2 xxx ✅


## 修改文件汇总


## API影响


## 数据库影响


## 架构影响


## 遗留问题


## 下一阶段入口


## 给下一 ChatGPT 的启动说明


## 给 Trae 的执行上下文
新 ChatGPT 开启方式

以后不要复制整个聊天。

新聊天第一条：

这是 VISNDT 项目，请先读取以下上下文：

docs/_context/
00_PROJECT_MASTER_CONTEXT.md

docs/_context/
FREEZE_ZONE.md

docs/_context/
ARCHITECTURE_DECISION_LOG.md

以及最新：
docs/_context/M13.2_CONTEXT_HANDOFF.md

请按照已有开发模式继续：

ChatGPT负责：
- 架构审查
- 方案设计
- 风险评估
- 生成Trae执行指令

Trae负责：
- 实施代码修改
- 生成docs/_review编号报告
- 返回执行结果

不要重新设计已有架构。

这样新聊天可以恢复 90%以上上下文。

新 Trae 账户接续方式

Trae 新账户启动：

第一条任务不要直接开发。

先：

任务：

你正在接手 VISNDT 项目。

请先阅读：

docs/_context/
00_PROJECT_MASTER_CONTEXT.md

docs/_context/
FREEZE_ZONE.md

docs/_context/
ARCHITECTURE_DECISION_LOG.md

docs/_context/
M13.2_CONTEXT_HANDOFF.md

要求：

1. 不修改任何代码
2. 输出当前项目理解报告
3. 检查当前代码状态是否符合Context
4. 等待下一步开发指令

确认无误后，再执行开发。

结合目前状态：

当前：

M13.2.7.2 ✅ 完成
等待：
M13.2.7.3

但按照新规则，我建议：

先不要进入 M13.2.7.3。

下一步应该补：

M13.2_CONTEXT_HANDOFF.md

因为 M13.2 已经接近结束，需要形成阶段冻结点。

然后继续：

M13.2.7.3 Orphan Detection & Cleanup

并最终生成：

M13.2_COMPLETE_CONTEXT_HANDOFF.md

这样以后即使：

Trae 换账户
ChatGPT 换窗口
对话长度限制
新开发人员加入

都可以从项目文件恢复完整状态。

============================================================
收到，继续保持当前开发协作模式。

先确认当前状态：

M13.2.7.2 ProductMedia Delete Lifecycle Fix 已完成
已完成审查基础：
发现问题 → M13.2.7.1 Audit
制定修复 → M13.2.7.2 Fix
修复范围符合冻结原则
未扩大 API、数据库、前端范围
当前不进入 M13.2.7.3，先完成架构级确认

关于你之前提出的 _context 体系，我确认纳入，并作为后续项目管理规范。

VISNDT 项目文档体系升级确认（V12.0）

以后文档体系调整为：

F:\Desktop\VISNDT
│
├── docs
│   │
│   ├── _review
│   │   ├── 229_M13.2.6_ProductMedia_E2E_Verification_Report.md
│   │   ├── 230_M13.2.7.1_ProductMedia_Delete_Lifecycle_Audit_Report.md
│   │   ├── 231_M13.2.7.2_ProductMedia_Delete_Lifecycle_Fix_Report.md
│   │   └── ...
│   │
│   └── _context
│       │
│       ├── 00_PROJECT_MASTER_CONTEXT.md
│       ├── 01_ARCHITECTURE_DECISION_LOG.md
│       ├── 02_FREEZE_ZONE.md
│       │
│       ├── M10_CONTEXT_HANDOFF.md
│       ├── M11_CONTEXT_HANDOFF.md
│       ├── M12_CONTEXT_HANDOFF.md
│       ├── M13.1_CONTEXT_HANDOFF.md
│       ├── M13.2_CONTEXT_HANDOFF.md
│       └── ...
一、三个永久维护文档
1. 00_PROJECT_MASTER_CONTEXT.md

定位：

项目的“总记忆文件”，给 ChatGPT、Trae、新开发者读取。

生命周期：

永久存在。

更新频率：

大阶段完成更新
架构变化更新
技术栈变化更新

内容包括：

# VISNDT Project Master Context


## 1. 项目定位

工业检测设备撮合平台


## 2. 当前技术栈

Frontend:
- React
- TypeScript
- Vite
- Ant Design

Backend:
- NestJS
- Prisma
- PostgreSQL

Storage:
- MinIO/S3


## 3. 当前规模

Backend Modules:
20+

API:
80+

Prisma Models:
22


## 4. 当前阶段

M13 Product Management Enhancement


## 5. 已完成模块

M10 Admin
M11 Architecture Review
M12 xxx
M13 Product Center


## 6. 当前重点

ProductMedia
FileAsset lifecycle


## 7. 下一阶段

M13.3 ...
2. ARCHITECTURE_DECISION_LOG.md

定位：

防止未来自己或 AI 推翻以前正确设计。

记录：

例如：

AD-001

日期：
2026-07

决策：

采用：

Backend:
NestJS + Prisma

Frontend:
React + Ant Design

原因：

企业后台适配
类型安全
快速开发

状态：

Accepted

AD-002

日期：
2026-08

决策：

ProductMedia 删除时：

采用：

ProductMedia
      ↓
FileAsset DB
      ↓
S3 Object

级联清理。

原因：

避免：

孤儿文件
数据泄露
存储增长

状态：

Accepted

未来如果 Trae 或 AI 提议：

修改 FileAsset 架构

必须先检查：

ARCHITECTURE_DECISION_LOG

3. FREEZE_ZONE.md

定位：

防止开发过程中破坏已经稳定部分。

例如：

# VISNDT Freeze Zone


## Database Freeze

以下禁止直接修改：

- Prisma Schema
- Migration history

除非：
Mxx Architecture Change


## API Freeze

已稳定 API：

Product API
Demand API
Offer API


修改要求：

必须：
1. 说明影响
2. 提供迁移方案


## Frontend Freeze

已完成页面：

Admin Dashboard
User Management
Product Management

禁止重构
二、阶段 Context Handoff

这个是你新增要求。

以后每完成：

例如：

M13.2

生成：

docs/_context/M13.2_CONTEXT_HANDOFF.md

不是每个小任务。

你的规则：

M13.2.6 不单独生成，等 M13.2 全部完成生成

确认。

M13.2_CONTEXT_HANDOFF 内容标准
# VISNDT M13.2 Context Handoff


日期：

阶段：

M13.2 Product Media


状态：

COMPLETE


---

# 1. 本阶段目标


# 2. 完成任务列表


M13.2.1

...


M13.2.6

ProductMedia E2E


M13.2.7

Lifecycle


---

# 3. 修改文件汇总


Backend:

xxx


Frontend:

xxx


Database:

None


---

# 4. API变化


新增:

None


修改:

None


删除:

None


---

# 5. 数据模型状态


ProductMedia:

xxx


FileAsset:

xxx


---

# 6. 已解决问题


## Problem 001

描述


解决:


---

# 7. 未解决技术债务


例如：

- atomic upload-create
- orphan cleanup


---

# 8. 当前冻结状态


允许：

xxx


禁止：

xxx


---

# 9. 下一阶段建议


M13.3
三、ChatGPT 新聊天使用方式

以后新聊天：

第一条消息不要重新描述项目。

直接：

上传：

docs/_context/00_PROJECT_MASTER_CONTEXT.md

docs/_context/M13.2_CONTEXT_HANDOFF.md

docs/_context/FREEZE_ZONE.md

然后输入：

继续VISNDT项目开发。

请先读取_context文件。

按照之前模式：
1. 审查Trae执行结果
2. 判断是否符合架构
3. 输出下一阶段规划
4. 生成Trae执行指令
5. 要求生成_review报告

即可恢复。

四、Trae 新账号接续方式

Trae 不需要“记忆”。

它需要：

第一阶段：

打开项目：

F:\Desktop\VISNDT

然后第一条指令：

你正在接管一个已有大型工程。

请先不要修改代码。

请读取：

docs/_context/

中的所有context文档。


确认：

1. 当前项目阶段
2. 已完成模块
3. 技术冻结区域
4. 禁止修改内容
5. 当前任务目标


输出：
《项目接管确认报告》

保存：

docs/_review/

然后才进入开发。

五、本次 M13.2.7.2 审查结论
通过 ✅

评价：

项目	结果
问题定位	正确
修改范围	合理
数据库影响	无
API影响	无
前端影响	无
安全风险降低	明显
架构破坏	无
一个需要记录到后续 M13.2 Context 的事项

M13.2.7.2虽然通过，但留下：

技术债务：
TD-FILE-001

问题：

上传与业务创建分离。


当前：

POST /files/upload

↓

POST /products/:id/media


风险：

第二步失败产生孤儿FileAsset。


计划：

M13.3+

这个不要现在修。

原因：

当前修复属于生命周期保护；

atomic upload 属于架构优化。

不要混在一起。