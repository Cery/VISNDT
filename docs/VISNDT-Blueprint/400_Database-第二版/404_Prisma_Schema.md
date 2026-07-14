# 1. 文档定位（Document Purpose）

## Purpose

本文档定义：

> **Prisma ORM 建模规范（Prisma Schema Specification）**

它的职责不是保存 `schema.prisma` 源文件，而是规定：

- PostgreSQL 如何映射到 Prisma
- Prisma 如何映射 Repository 数据模型
- AI IDE 如何自动生成 `schema.prisma`
- ORM 层命名、关系、索引、字段映射规则

因此：

```
401
ER Model

↓

402
Table Specification

↓

403
DDL Specification

↓

404
Prisma Specification

↓

405
schema.prisma
```

404 是 **405 的唯一设计依据**。

------

# 2. Document Dependency

AI IDE 必须按照以下顺序读取：

```
399_CanonicalNamingSpecification

↓

401_PostgreSQL_ER_Model

↓

402_PostgreSQL_Table_Specification

↓

403_PostgreSQL_DDL_Specification

↓

404_Prisma_Schema

↓

405_schema.prisma
```

禁止：

跳过任何前置文档。

------

# 3. ORM Design Principles

Prisma：

负责：

数据库映射。

禁止：

承担：

业务逻辑。

Repository：

负责：

业务。

因此：

Prisma Model：

仅：

描述：

```
Table

Column

Relation

Index

Constraint Mapping
```

禁止：

业务计算。

禁止：

流程。

禁止：

审批。

------

# 4. Design Goals

Repository：

ORM：

必须满足：

```
Deterministic

Consistent

Repeatable

Maintainable

Readable
```

所有 Model：

必须：

由：

402

唯一决定。

------

# 5. Naming Strategy

所有 Model：

统一：

PascalCase。

例如：

```
Product

ProductCategory

ParameterDefinition

WorkflowInstance

KnowledgeDocument
```

禁止：

```
product

PRODUCT

tblProduct
```

------

数据库：

统一：

snake_case。

例如：

```
standard_product
```

Prisma：

统一：

```
model StandardProduct
```

通过：

```
@@map
```

映射。

------

# 6. Model Mapping Policy

统一：

一张数据库表：

对应：

一个 Prisma Model。

禁止：

多个 Model：

映射：

同一张表。

禁止：

一个 Model：

映射：

多个 Table。

------

# 7. Table Name Mapping

数据库：

```
standard_product
```

↓

Prisma：

```
model StandardProduct
```

↓

```
@@map("standard_product")
```

统一：

全部：

采用：

@@map。

禁止：

数据库：

CamelCase。

------

# 8. Column Mapping Policy

数据库：

```
created_at
```

↓

Prisma：

```
createdAt
```

↓

```
@map("created_at")
```

统一：

数据库：

snake_case。

Prisma：

camelCase。

------

# 9. ID Mapping

数据库：

```
UUID
```

↓

Prisma：

```
String
```

例如：

```
id String @id @db.Uuid
```

禁止：

Int。

BigInt。

------

# 10. UUID Strategy

统一：

全部：

UUID。

Prisma：

统一：

```
@db.Uuid
```

AI IDE：

禁止：

自动：

Int。

------

# 11. Timestamp Mapping

数据库：

```
timestamptz
```

↓

Prisma：

```
DateTime
```

统一：

UTC。

例如：

```
createdAt DateTime
```

映射：

```
created_at
```

------

# 12. Decimal Mapping

数据库：

```
NUMERIC
```

↓

Prisma：

```
Decimal
```

统一：

使用：

Prisma Decimal。

禁止：

Float。

------

# 13. Boolean Mapping

数据库：

```
BOOLEAN
```

↓

Prisma：

```
Boolean
```

统一：

default(false)。

------

# 14. JSON Mapping

数据库：

```
JSONB
```

↓

Prisma：

```
Json
```

禁止：

String。

------

# 15. Array Mapping

数据库：

```
TEXT[]
```

↓

Prisma：

```
String[]
```

统一：

仅用于：

标签。

关键词。

辅助搜索。

禁止：

业务关联。

------

# 16. Nullable Mapping

数据库：

NULL

↓

Prisma：

```
?
```

例如：

```
updatedBy String?
```

数据库：

NOT NULL。

↓

Prisma：

必填。

------

# 17. Default Mapping

数据库：

DEFAULT。

↓

Prisma：

统一：

```
@default()
```

例如：

```
status String @default("draft")
```

禁止：

遗漏默认值映射。

------

# 18. Comment Strategy

Repository：

业务说明：

保留在：

402。

DDL 注释：

保留在：

403。

Prisma：

不承担：

业务注释来源。

因此：

AI IDE：

可生成适量注释。

但不得：

修改：

业务定义。

# Part 2：Relation Mapping Specification（关系映射规范）

------

# 19. Relation Design Principles

Prisma Relation 的职责：

统一表达数据库实体之间的关系。

Relation：

必须来源于：

```
401 ER Model
        ↓
402 Table Specification
        ↓
403 DDL Specification
```

禁止：

AI IDE：

自行推断：

新的 Relation。

------

# 20. One-to-One Relation

适用于：

例如：

```
User

↓

UserProfile
```

数据库：

唯一外键。

Prisma：

统一：

```
User

↓

profile

↓

UserProfile
```

原则：

拥有 FK 的一方：

保存：

```
@relation
```

另一方：

仅：

反向引用。

------

# 21. One-to-Many Relation

例如：

```
Organization

↓

Product
```

Prisma：

统一：

```
Organization

↓

products

↓

Product[]
```

Product：

统一：

```
organization

↓

Organization
```

命名：

集合：

统一：

复数。

------

# 22. Many-to-Many Relation

Repository：

统一：

Mapping Table。

例如：

```
Product

↓

ProductCapability

↓

Capability
```

禁止：

Prisma：

Implicit Many-to-Many。

原因：

Repository：

需要：

Mapping：

业务字段。

例如：

```
status

version

createdBy

createdAt
```

因此：

统一：

Explicit Relation。

------

# 23. Self Relation

允许：

例如：

```
Category

↓

Parent Category
```

统一：

命名：

```
parent

children
```

例如：

```
ProductCategory

↓

parent

↓

children
```

禁止：

多个：

同名：

Self Relation。

------

# 24. Relation Naming Rules

统一：

| Relation Type | Field Name       |
| ------------- | ---------------- |
| Parent        | parent           |
| Children      | children         |
| Owner         | owner            |
| Creator       | createdByUser    |
| Updater       | updatedByUser    |
| Organization  | organization     |
| Product       | product          |
| Category      | category         |
| Workflow      | workflowInstance |

命名必须体现业务含义。

禁止：

```
relation1

relation2

obj
```

------

# 25. Relation Field Order

Model：

字段顺序：

统一：

```
ID

↓

Business Fields

↓

FK Fields

↓

Relation Fields

↓

Audit Fields
```

避免：

Relation：

穿插：

业务字段。

------

# 26. @relation Strategy

所有：

Relation：

必须：

显式：

指定：

```
fields

references
```

禁止：

依赖：

Prisma：

自动推断。

例如：

统一：

```
@relation(
fields:[organizationId],
references:[id]
)
```

------

# 27. Relation Name Strategy

当存在多个关联：

必须：

命名：

Relation。

例如：

```
createdBy

updatedBy
```

分别：

关联：

User。

必须：

使用：

```
CreatedBy

UpdatedBy
```

Relation Name。

避免：

歧义。

------

# 28. Cascade Strategy

Prisma：

Relation：

统一：

映射：

403：

DDL。

例如：

数据库：

```
ON DELETE RESTRICT
```

Prisma：

不得：

定义：

Cascade。

保持：

一致。

------

# 29. Optional Relation

允许：

例如：

```
updatedBy

deletedBy

workflowInstance
```

统一：

```
User?
```

禁止：

强制：

Required。

------

# 30. Required Relation

例如：

```
Product

↓

Organization
```

统一：

Required。

不得：

Nullable。

------

# 31. Circular Relation Policy

允许：

业务：

循环引用。

禁止：

Prisma：

循环：

命名。

例如：

统一：

通过：

Mapping。

避免：

复杂：

Relation。

------

# 32. Composite Relation

允许：

Composite Unique。

禁止：

Composite Primary Key。

Repository：

统一：

UUID。

------

# 33. Mapping Model Rules

所有：

Mapping：

统一：

独立：

Model。

例如：

```
ProductCapability

RolePermission

ProductFeature
```

禁止：

省略：

Mapping。

------

# 34. Dictionary Relation

所有：

Dictionary：

统一：

Relation。

例如：

```
Status

↓

DictionaryItem
```

而不是：

String。

Repository：

统一：

Dictionary。

------

# 35. File Relation

统一：

业务表：

引用：

```
FileObject
```

禁止：

保存：

URL。

Storage Key。

------

# 36. Workflow Relation

统一：

所有：

审批类：

业务：

引用：

```
WorkflowInstance
```

Workflow：

不得：

引用：

业务：

实现：

统一：

流程引擎。

------

# 37. AI Domain Relation

Embedding：

Chunk。

Knowledge。

统一：

Relation。

禁止：

复制：

Metadata。

------

# 38. Relation Loading Strategy

默认：

Repository：

统一：

Lazy Query。

不是：

Prisma Lazy Loading（Prisma 本身不支持真正懒加载）。

原则：

由 Service 层按需：

```
include

select
```

避免：

默认：

查询：

全部关联。

------

# 39. Include Strategy

统一：

禁止：

```
include: true
```

必须：

显式：

指定：

字段。

例如：

```
Organization

↓

id

name
```

避免：

过度查询。

------

# 40. Select Strategy

统一：

优先：

Select。

其次：

Include。

原则：

最小数据集。

避免：

返回：

全部字段。

------

# 41. Relation Depth Policy

默认：

最大：

```
2
```

例如：

```
Offer

↓

Product

↓

Organization
```

禁止：

无限：

嵌套。

避免：

循环：

JSON。

------

# 42. Bidirectional Relation Policy

允许：

双向：

Relation。

必须：

双方：

命名：

一致。

保持：

401：

ER：

一致。

------

# 43. Relation Validation Checklist

AI IDE：

生成 Prisma Relation 前：

必须检查：

```
✓ Relation 数量与 ER 一致

✓ FK 与 DDL 一致

✓ fields 正确

✓ references 正确

✓ Relation Name 正确

✓ 无重复 Relation

✓ 无隐式 Many-to-Many

✓ Mapping Model 完整

✓ 无循环命名

✓ 双向 Relation 一致
```

# Part 3：Field Annotation & Prisma Feature Specification（字段注解与 Prisma 特性规范）

> 本章节定义 Prisma 字段注解（Attribute）和 Model 注解（Block Attribute）的统一使用规范，确保所有 ORM 模型保持一致，并能够稳定映射 PostgreSQL。

------

# 44. Prisma Attribute Design Principles

Prisma Attribute（注解）用于表达数据库元数据。

统一原则：

- 一个字段只承担一种业务语义。
- 一个 Attribute 只表达一种数据库特性。
- 所有 Attribute 必须来源于 403 DDL 规范。

禁止：

- 为了简化代码删除 Attribute。
- 使用与数据库不一致的 Attribute。

------

# 45. Primary Key Annotation

所有业务 Model：

统一：

```
@id
```

数据库类型：

统一：

```
@db.Uuid
```

原则：

- 每个 Model 仅允许一个 `@id`
- 禁止 Composite Primary Key
- 主键字段统一命名 `id`

------

# 46. Default Value Annotation

默认值必须与数据库保持一致。

统一：

```
@default(...)
```

典型映射：

| 数据库            | Prisma              |
| ----------------- | ------------------- |
| CURRENT_TIMESTAMP | `@default(now())`   |
| false             | `@default(false)`   |
| 1                 | `@default(1)`       |
| "draft"           | `@default("draft")` |

禁止：

数据库存在默认值，而 Prisma 未声明。

------

# 47. Updated Time Annotation

更新时间统一：

```
@updatedAt
```

适用于：

```
updatedAt
```

禁止：

应用层手工维护更新时间。

统一：

由 Prisma 自动更新。

------

# 48. Database Type Annotation

统一使用：

```
@db.*
```

常用映射：

| PostgreSQL  | Prisma             |
| ----------- | ------------------ |
| UUID        | `@db.Uuid`         |
| NUMERIC     | `@db.Decimal(x,y)` |
| VARCHAR     | `@db.VarChar(n)`   |
| TEXT        | `@db.Text`         |
| TIMESTAMPTZ | `@db.Timestamptz`  |
| JSONB       | `@db.JsonB`        |
| BOOLEAN     | 默认 Boolean       |

原则：

数据库类型必须显式声明。

------

# 49. @map Specification

所有数据库字段：

统一：

```
@map("snake_case")
```

例如：

数据库：

```
created_at
```

Prisma：

```
createdAt @map("created_at")
```

禁止：

数据库使用 camelCase。

------

# 50. @@map Specification

所有 Model：

统一：

```
@@map("table_name")
```

例如：

```
model StandardProduct {

@@map("standard_product")

}
```

禁止：

数据库表名与 Model 名称直接一致（除完全符合命名规则外，仍建议显式声明）。

------

# 51. @@index Specification

索引统一采用：

```
@@index(...)
```

例如：

```
@@index([organizationId])

@@index([status])

@@index([createdAt])
```

原则：

所有数据库索引必须在 Prisma 中保持一致。

------

# 52. @@unique Specification

唯一约束：

统一：

```
@@unique(...)
```

例如：

```
@@unique([code])

@@unique([organizationId, code])
```

禁止：

仅依赖数据库唯一约束。

------

# 53. Composite Index Rules

允许：

复合索引。

建立原则：

```
WHERE

↓

ORDER BY

↓

LIMIT
```

例如：

```
@@index([
organizationId,
status,
createdAt
])
```

保持与 PostgreSQL 索引策略一致。

------

# 54. Composite Unique Rules

允许：

业务唯一键。

例如：

```
organizationId

+

code
```

统一：

```
@@unique([
organizationId,
code
])
```

禁止：

作为主键。

------

# 55. Enum Strategy

Repository：

默认：

不使用：

Prisma Enum。

统一：

Dictionary。

原因：

支持：

- 多语言
- 动态配置
- 在线维护
- 后续扩展

仅在以下情况允许 Prisma Enum：

- 数据库同步使用固定 CHECK 约束；
- 生命周期稳定且不会由业务动态维护。

------

# 56. Decimal Strategy

金额：

统一：

```
Decimal
```

禁止：

```
Float

Double
```

原因：

避免：

精度误差。

------

# 57. JSON Strategy

统一：

```
Json
```

仅用于：

- Metadata
- ProviderConfig
- AI Response
- 扩展配置

禁止：

存储：

核心业务字段。

------

# 58. Array Strategy

统一：

```
String[]
```

仅适用于：

- Tags
- Keywords
- Search Hint

禁止：

业务关系。

业务关系统一：

Mapping Table。

------

# 59. Unsupported Type Policy

对于 PostgreSQL 原生扩展类型：

例如：

- pgvector
- PostGIS Geometry
- 自定义 Domain

统一策略：

- 优先采用 Prisma 官方支持。
- 不支持时使用 `Unsupported()`。
- 不影响 Repository 的数据库设计。

------

# 60. Prisma Preview Features Policy

Repository：

默认：

不依赖：

Preview Features。

原则：

- 优先稳定版本。
- Preview 仅作为可选增强能力。
- 不得成为核心架构依赖。

------

# 61. Generated Field Policy

Prisma：

允许：

映射数据库 Generated Column。

禁止：

在 Prisma 中重新计算业务字段。

计算逻辑：

统一：

数据库或业务层。

------

# 62. Client Generation Policy

统一：

使用：

```
prisma generate
```

生成：

- Prisma Client
- TypeScript 类型
- Repository 基础能力

不得：

手工修改生成文件。

------

# 63. Annotation Validation Checklist

AI IDE：

生成 Prisma Model 后必须检查：

```
✓ @id 完整

✓ @default 完整

✓ @updatedAt 正确

✓ @map 完整

✓ @@map 完整

✓ @@index 完整

✓ @@unique 完整

✓ @db.* 类型正确

✓ Decimal 使用正确

✓ Json 使用正确

✓ Array 使用正确

✓ 无多余 Annotation
```

# Part 4：Model Organization & Repository Convention（Model 组织与 Repository 规范）

> 本章节定义整个 `schema.prisma` 的组织方式，而不是单个 Model 的定义方式。目标是在模型数量持续增加时，仍保持良好的可读性、可维护性和自动生成的一致性。

------

# 64. Repository Layer Position

Prisma 在整个 Repository 中的位置：

```
Business Blueprint
        │
        ▼
ER Model（401）
        │
        ▼
Table Specification（402）
        │
        ▼
DDL Specification（403）
        │
        ▼
Prisma Specification（404）
        │
        ▼
schema.prisma（405）
        │
        ▼
Prisma Client
        │
        ▼
Repository Layer
        │
        ▼
Service Layer
```

Prisma：

负责：

**ORM 映射层。**

不负责：

- Service
- Business Logic
- Workflow
- Permission Decision

------

# 65. Module Organization

Repository 按业务域组织 Model。

建议顺序如下：

| Module       | Scope    |
| ------------ | -------- |
| Dictionary   | 字典体系 |
| Product      | 产品中心 |
| Parameter    | 参数体系 |
| Knowledge    | 知识库   |
| Organization | 企业体系 |
| User         | 用户权限 |
| Demand       | 需求中心 |
| RFQ          | 询报价   |
| Offer        | 报价中心 |
| Workflow     | 工作流   |
| File         | 文件中心 |
| AI           | AI 能力  |
| System       | 系统配置 |

新增模块时：

统一追加。

禁止：

打乱已有顺序。

------

# 66. Model Ordering Rules

每个 Model：

统一排列：

```
Model Name

↓

Scalar Fields

↓

Foreign Keys

↓

Relation Fields

↓

Indexes

↓

Unique Constraints

↓

Table Mapping
```

禁止：

Relation：

穿插：

业务字段。

------

# 67. Scalar Field Ordering

Scalar 字段：

统一顺序：

```
Primary Key

↓

Business Identifier

↓

Business Fields

↓

Configuration Fields

↓

Status

↓

Version

↓

Audit Fields
```

例如：

```
id

↓

code

↓

name

↓

description

↓

status

↓

version

↓

createdAt

updatedAt

deletedAt
```

整个 Repository 保持一致。

------

# 68. Relation Field Ordering

Relation 字段统一放置在：

Foreign Key 字段之后。

例如：

```
organizationId

↓

organization

↓

productId

↓

product
```

禁止：

先 Relation 后 FK。

------

# 69. Index Block Ordering

统一：

```
@@index

↓

@@unique

↓

@@map
```

例如：

```
@@index([organizationId])

@@index([status])

@@unique([organizationId, code])

@@map("standard_product")
```

------

# 70. Common Field Convention

所有业务 Model：

统一包含：

```
id

status

version

createdAt

createdBy

updatedAt

updatedBy

deletedAt

deletedBy
```

保持：

与 402、403 一致。

不得：

遗漏。

------

# 71. Infrastructure Model Convention

以下模型：

```
FileObject

AuditLog

OperationLog

Embedding

VectorChunk
```

允许：

不同于普通业务模型。

例如：

可以：

- 更少业务字段
- 更多 Metadata
- 更偏向性能设计

但仍遵守：

命名规范。

------

# 72. Dictionary Model Convention

Dictionary：

保持：

轻量。

禁止：

增加：

业务逻辑字段。

统一：

```
Dictionary

↓

DictionaryItem
```

避免：

不同业务建立：

重复枚举表。

------

# 73. Configuration Model Convention

Configuration：

统一：

JSON + Code。

例如：

```
SystemSetting

NotificationTemplate

WorkflowDefinition
```

配置：

统一：

Json。

不得：

混入：

业务数据。

------

# 74. AI Model Convention

AI 相关模型：

统一：

保存：

```
Metadata

Reference

Status
```

不保存：

模型推理逻辑。

AI Provider：

保持：

可替换。

------

# 75. File Organization Strategy

最终：

Repository：

建议：

```
database/

prisma/

schema.prisma

migrations/

seed/
```

其中：

```
schema.prisma
```

保持：

唯一。

禁止：

多人维护：

多个 Schema。

------

# 76. Prisma Client Convention

统一：

生成：

一个：

Prisma Client。

禁止：

多个：

Client。

避免：

连接管理复杂化。

------

# 77. Datasource Convention

整个 Repository：

统一：

一个：

Datasource。

统一：

PostgreSQL。

禁止：

多数据库混合。

除非：

Major Version。

------

# 78. Generator Convention

Generator：

统一：

TypeScript。

后续：

GraphQL。

OpenAPI。

SDK：

均基于：

同一 Prisma Client。

------

# 79. Extension Strategy

允许：

未来：

增加：

Prisma Extension。

例如：

- Soft Delete
- Audit
- Pagination

原则：

扩展：

不能：

改变：

Model。

只能：

增强：

Repository 能力。

------

# 80. AI IDE Organization Rules

AI IDE：

生成：

schema.prisma：

必须：

按照：

```
generator

↓

datasource

↓

Dictionary

↓

Product

↓

Parameter

↓

Knowledge

↓

Organization

↓

User

↓

Demand

↓

RFQ

↓

Offer

↓

Workflow

↓

File

↓

AI

↓

System
```

禁止：

随机排列。

------

# 81. Repository Consistency Rules

以下文档：

必须：

保持一致：

```
401

↓

402

↓

403

↓

404

↓

405
```

任何字段调整：

必须：

同步：

更新。

不得：

单独修改：

`schema.prisma`。

------

# 82. Organization Validation Checklist

AI IDE：

生成：

Prisma：

必须检查：

```
✓ Module 顺序正确

✓ Model 顺序正确

✓ 字段顺序正确

✓ Relation 顺序正确

✓ @@index 顺序正确

✓ @@unique 顺序正确

✓ @@map 完整

✓ Datasource 唯一

✓ Generator 唯一

✓ Prisma Client 唯一
```

# Part 5：Prisma Generation Workflow & Validation（Prisma 自动生成流程与验证规范）

> 本章节规定 AI IDE 如何依据 Repository 文档自动生成 `schema.prisma`，以及生成后的验证、审查、版本控制和交付流程。

------

# 83. Generation Workflow

AI IDE 生成 Prisma Schema 必须遵循固定流程：

```
399 Canonical Naming
        │
        ▼
401 ER Model
        │
        ▼
402 Table Specification
        │
        ▼
403 PostgreSQL DDL Specification
        │
        ▼
404 Prisma Specification
        │
        ▼
Generate schema.prisma
        │
        ▼
Static Validation
        │
        ▼
Repository Review
        │
        ▼
Accepted
```

禁止：

跳过任何步骤。

------

# 84. Input Document Validation

AI IDE 在生成前必须确认：

```
✓ 399 已冻结

✓ 401 已冻结

✓ 402 已冻结

✓ 403 已冻结

✓ 404 已冻结（生成 405 时）

✓ 文档版本一致
```

若存在版本冲突：

不得：

继续生成。

------

# 85. Schema Generation Policy

生成原则：

```
Deterministic

Repeatable

Idempotent

Traceable
```

要求：

- 同一输入生成同一输出。
- 不允许随机排序。
- 不允许推断不存在字段。
- 不允许自动增加业务结构。

------

# 86. Model Generation Order

生成顺序固定：

```
Dictionary

↓

Product

↓

Parameter

↓

Capability

↓

Feature

↓

Knowledge

↓

Organization

↓

User

↓

Demand

↓

RFQ

↓

Offer

↓

Workflow

↓

File

↓

AI

↓

System
```

所有 Model：

保持稳定顺序。

------

# 87. Relation Generation Rules

Relation 必须满足：

```
FK

↓

Relation

↓

Back Relation

↓

Index

↓

Constraint
```

禁止：

遗漏：

反向 Relation。

禁止：

生成隐式多对多关系。

------

# 88. Index Synchronization

Prisma 中：

```
@@index

@@unique
```

必须与：

403 DDL：

完全一致。

检查内容：

- 字段数量
- 顺序
- 联合索引字段排列
- 唯一约束一致性

------

# 89. Mapping Synchronization

AI IDE：

必须验证：

```
@Table

↓

@@map

↓

Column

↓

@map
```

保证：

数据库命名与 Prisma 命名双向一致。

------

# 90. Type Synchronization

所有字段：

必须保持：

```
PostgreSQL

↓

Prisma

↓

TypeScript
```

类型一致。

例如：

| PostgreSQL  | Prisma   | TypeScript       |
| ----------- | -------- | ---------------- |
| UUID        | String   | string           |
| NUMERIC     | Decimal  | Prisma.Decimal   |
| BOOLEAN     | Boolean  | boolean          |
| JSONB       | Json     | Prisma.JsonValue |
| TIMESTAMPTZ | DateTime | Date             |

------

# 91. Version Synchronization

生成时必须检查：

```
Repository Version

↓

Schema Version

↓

Migration Version
```

三者一致。

禁止：

跨版本生成。

------

# 92. Prisma Format Rules

生成后统一执行：

```
prisma format
```

要求：

- 字段对齐
- Model 排序保持
- Relation 保持
- Annotation 排列统一

禁止：

人工重新排版。

------

# 93. Prisma Validate Rules

统一执行：

```
prisma validate
```

检查：

```
Schema Syntax

Relation

Datasource

Generator

Mapping

Index
```

必须：

全部通过。

------

# 94. Client Generation Validation

统一执行：

```
prisma generate
```

验证：

```
Prisma Client

TypeScript Type

Repository API
```

必须：

生成成功。

------

# 95. Migration Compatibility Check

生成完成后：

检查：

```
schema.prisma

↓

Migration

↓

Database
```

三者一致。

禁止：

Migration 与 Schema 不一致。

------

# 96. Difference Detection

AI IDE：

必须自动比对：

```
402

↓

403

↓

405
```

检查：

```
Model

Field

Relation

Index

Constraint

Mapping
```

全部一致。

------

# 97. Automatic Review Report

AI IDE：

必须生成：

```
prisma-review.md
```

建议内容：

```
Model Count

Field Count

Relation Count

Index Count

Unique Count

Map Count

Validation Result
```

作为生成报告。

------

# 98. Error Handling Policy

若生成失败：

统一输出：

```
Syntax Error

↓

Relation Error

↓

Mapping Error

↓

Type Error

↓

Generator Error
```

不得：

静默忽略。

------

# 99. Regeneration Policy

允许：

重新生成。

要求：

输入保持一致时：

```
Schema

100%

一致
```

禁止：

同样输入产生不同 Schema。

------

# 100. Acceptance Checklist

Repository：

生成 Prisma 后：

必须检查：

```
□ Model 数量一致

□ 字段一致

□ Relation 一致

□ FK 一致

□ Index 一致

□ Unique 一致

□ @map 完整

□ @@map 完整

□ Type 一致

□ Validate 成功

□ Generate 成功

□ Migration 可执行

□ Review Report 完整
```

全部完成：

Prisma Layer：

Accepted。

# Part 6：AI Integration Protocol & Final Acceptance（AI 集成协议与最终验收）

> 本章节定义 Repository 中 Prisma ORM 层的最终集成协议，规定 AI IDE 如何依据 Repository 文档生成 `405/schema.prisma`，并作为 `404_Prisma_Schema.md` 的最终冻结章节。

------

# 101. Repository Dependency Matrix

Prisma ORM 的依赖关系固定如下：

```
399_CanonicalNamingSpecification
                │
                ▼
401_PostgreSQL_ER_Model
                │
                ▼
402_PostgreSQL_Table_Specification
                │
                ▼
403_PostgreSQL_DDL_Specification
                │
                ▼
404_Prisma_Schema_Specification
                │
                ▼
405_schema.prisma
                │
                ▼
Prisma Client
                │
                ▼
Repository Layer
                │
                ▼
Service Layer
                │
                ▼
API Layer
```

任何阶段不得绕过 `404` 直接维护 `405`。

------

# 102. AI IDE Input Protocol

生成 `405/schema.prisma` 时，AI IDE 必须读取：

```
399_CanonicalNamingSpecification.md

401_PostgreSQL_ER_Model.md

402_PostgreSQL_Table_Specification.md

403_PostgreSQL_DDL_Specification.md

404_Prisma_Schema.md
```

不得：

- 推断不存在的 Model。
- 自动增加字段。
- 自动增加 Relation。
- 自动修改命名。

------

# 103. AI Generation Priority

当多个文档出现冲突时：

统一优先级：

```
404 Prisma Specification

↓

403 DDL Specification

↓

402 Table Specification

↓

401 ER Model

↓

Business Blueprint
```

原因：

- 404：定义 ORM 规则；
- 403：定义数据库实现；
- 402：定义数据结构；
- 401：定义实体关系；
- Blueprint：提供业务背景。

------

# 104. Generated Artifact Scope

AI IDE 依据 404 生成的成果应包括：

```
schema.prisma

Prisma Client

Type Definitions

Validation Report

Review Report
```

404 本身不包含可执行代码，仅定义生成规则。

------

# 105. Repository Workflow

ORM 层工作流：

```
Business Blueprint
        │
        ▼
ER Design
        │
        ▼
Table Design
        │
        ▼
DDL Design
        │
        ▼
Prisma Specification
        │
        ▼
schema.prisma
        │
        ▼
Prisma Client
        │
        ▼
Repository
        │
        ▼
Service
```

保持单向依赖。

禁止：

反向修改。

------

# 106. Synchronization Rules

任何数据结构调整：

必须同步更新：

```
401

↓

402

↓

403

↓

404

↓

405
```

不得：

仅修改：

```
schema.prisma
```

否则：

Repository：

视为：

不同步。

------

# 107. AI Output Requirements

AI IDE：

生成：

`schema.prisma`：

必须满足：

```
100%

Deterministic

Repeatable

Auditable

Consistent
```

保证：

不同时间：

相同输入：

生成：

相同结果。

------

# 108. Validation Workflow

生成后：

统一执行：

```
prisma format

↓

prisma validate

↓

prisma generate

↓

Migration Check

↓

Repository Review
```

全部成功：

方可提交。

------

# 109. ORM Acceptance Criteria

Prisma 层验收：

```
□ 所有 Model 已生成

□ 所有 Relation 已生成

□ 所有 @map 正确

□ 所有 @@map 正确

□ 所有 @db.* 正确

□ 所有 @@index 正确

□ 所有 @@unique 正确

□ prisma format 成功

□ prisma validate 成功

□ prisma generate 成功

□ Migration 一致

□ Review Report 完整
```

全部通过：

ORM Layer：

Accepted。

------

# 110. Repository Freeze Policy

冻结以下内容：

- ORM 建模原则
- Prisma 命名规范
- 字段映射规范
- Relation 映射规范
- Annotation 使用规范
- Model 组织规范
- 自动生成流程
- AI 集成协议
- 验证流程
- 验收标准

除 **Major Version** 外：

不得修改。

------

# 111. Repository Evolution Policy

未来允许：

新增：

- Module
- Model
- Field
- Relation

但必须：

遵循：

404 全部规范。

禁止：

破坏：

已有结构。

------

# 112. AI IDE Prompt Standard

统一 Prompt：

```
Input

399

401

402

403

404

Goal

Generate schema.prisma

Requirements

100% follow Repository Specification

Do NOT redesign business model

Do NOT rename Model

Do NOT rename Field

Do NOT infer missing structures

Output

schema.prisma

Validation Report
```

该 Prompt 为所有 AI IDE 的统一输入模板。

------

# 113. ORM Layer Completion Statement

完成以下文档：

```
399

401

402

403

404
```

即可认为：

Prisma Specification：

完整。

下一阶段：

正式生成：

```
405/schema.prisma
```

------

# 114. Final Acceptance Statement

满足以下条件：

```
ER

↓

Table

↓

DDL

↓

Prisma Specification

↓

schema.prisma

↓

Prisma Client

↓

Repository
```

全部一致。

Repository：

ORM Layer：

正式完成。