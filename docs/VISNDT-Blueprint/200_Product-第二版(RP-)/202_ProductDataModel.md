# Product Data Model

Document ID

202

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Product Data Model 定义 VISNDT Product Center 的核心数据结构。

目标：

建立一个长期稳定、支持国际化、支持 AI、支持参数模板复用、支持多供应商引用的标准产品模型。

该模型作为：

- PostgreSQL
- Prisma
- NestJS
- OpenAPI
- Frontend
- AI Knowledge Graph

唯一数据依据。

---

# 2. Core Design Principles

原则一

平台维护标准产品。

企业维护商业信息。

原则二

产品描述技术属性。

Offer 描述商业属性。

原则三

参数模板独立。

参数值独立。

能力独立。

原则四

所有业务统一引用 Product ID。

禁止引用产品名称。

原则五

所有层级采用 UUID。

---

# 3. Final Product Hierarchy（冻结）

Inspection Domain

↓

Category

↓

SubCategory

↓

Family

↓

Series

↓

Standard Product

↓

Offer

说明：

Category：

产品分类。

Family：

技术能力集合。

Series：

产品系列。

Standard Product：

平台标准产品。

Offer：

企业商业产品。

---

# 4. Entity Relationship

Inspection Domain

1

↓

N

Category

1

↓

N

SubCategory

1

↓

N

Family

1

↓

N

Series

1

↓

N

Standard Product

1

↓

N

Offer

所有关系均为单向引用。

禁止反向依赖。

---

# 5. Standard Product Definition

Standard Product 是平台维护的最小业务单元。

必须唯一。

不可重复。

包含：

Product ID

Code

Chinese Name

English Name

Alias

Category

SubCategory

Family

Series

Parameter Template

Capability Template

Inspection Method

Material

Industry

Defect

Standard

Status

Version

Images

Attachments

AI Metadata

Search Metadata

---

# 6. Product Code Rule

统一编码规则：

SP-00000001

SP-00000002

SP-00000003

……

Code 永久唯一。

产品名称允许修改。

Code 永不修改。

数据库所有引用均使用 UUID。

Code 仅用于：

展示。

接口。

搜索。

导入导出。

---

# 7. Product Model（型号）

Model 作为 Standard Product 的属性。

而不是独立实体。

例如：

Standard Product

↓

Model

VIS-600

Model Number

VIS600-6-2M-DM

Manufacturer Model

VIS600 PRO

Internal Model

VIS600-2026

Model 不建立独立数据表。

避免：

重复维护。

数据冗余。

---

# 8. Product Variant（冻结决定）

Repository 第一阶段：

不建立 Product Variant。

原因：

工业检测设备主要通过：

参数

配置

型号

区分。

无需采用电商 SKU 模式。

未来若涉及：

颜色。

包装。

地区版本。

软件许可。

可在 Release 2.0 增加 Variant。

---

# 9. Product Platform（冻结决定）

第一阶段：

不建立 Product Platform 实体。

原因：

当前平台聚焦检测设备。

产品数量有限。

Platform 概念容易与软件平台混淆。

如未来出现：

大型设备平台。

机器人平台。

无人机平台。

可升级增加。

---

# 10. Product Line（冻结决定）

第一阶段：

不建立 Product Line。

Series 已满足需求。

避免：

层级过深。

数据库复杂化。

---

# 11. Parameter Template Relationship

Category

↓

Parameter Template

↓

Family

↓

Series

↓

Standard Product

参数支持：

继承。

覆盖。

新增。

禁止：

删除父级参数。

---

# 12. Capability Relationship

Category

↓

Capability Template

↓

Family

↓

Series

↓

Standard Product

能力模板：

统一维护。

支持：

继承。

覆盖。

扩展。

---

# 13. Product Reference Matrix

Offer

必须引用：

Standard Product。

Knowledge

必须引用：

Standard Product。

Demand

可引用：

Standard Product。

RFQ

必须引用：

Standard Product。

AI

必须引用：

Standard Product。

Statistics

必须引用：

Standard Product。

Workflow

引用：

Product ID。

---

# 14. Search Metadata

每个 Product 自动生成：

Search Title

Keywords

Synonyms

Alias

Chinese

English

Slug

Vector Metadata

Embedding ID

SEO Metadata

全部由平台维护。

---

# 15. AI Metadata

AI Metadata 包括：

Industry Tags

Capability Tags

Inspection Tags

Material Tags

Defect Tags

Application Tags

Environment Tags

Language Tags

Embedding Version

Chunk Version

RAG Source

AI Metadata 不参与业务展示。

仅用于：

AI。

搜索。

推荐。

---

# 16. Product Version

每个 Product：

维护版本号。

Version：

1.0

↓

1.1

↓

1.2

↓

2.0

重要变更：

保留历史版本。

支持：

比较。

回滚。

审计。

---

# 17. Product Status

Planning

Draft

Review

Published

Deprecated

Archived

统一 Workflow 控制。

禁止直接修改状态。

---

# 18. Attachment Strategy

所有附件统一管理：

Image

Video

PDF

Word

Excel

CAD

STEP

IGES

ZIP

Manual

Certificate

Inspection Report

数据库仅保存：

File ID

Object Key

Metadata

文件统一存储：

Cloudflare R2。

---

# 19. Data Constraints

一个 Family

必须属于一个 SubCategory。

一个 Series

必须属于一个 Family。

一个 Product

必须属于一个 Series。

一个 Offer

必须属于一个 Product。

任何业务对象：

不得跳级引用。

例如：

Offer

禁止直接引用：

Family。

必须引用：

Standard Product。

---

# 20. Future Extension

Release 2.0

预留：

Product Variant

Product Bundle

Accessory Relationship

Compatible Product

Replacement Product

Upgrade Product

Lifecycle Policy

这些能力不影响第一阶段数据库设计。