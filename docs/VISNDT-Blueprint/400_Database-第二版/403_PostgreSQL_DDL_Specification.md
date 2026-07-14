# 1. 文档定位

## Purpose

本文档**不是 SQL 文件**。

本文档定义：

> PostgreSQL Database DDL Generation Specification

用于指导：

- Cursor
- Claude Code
- Codex
- Gemini CLI
- Windsurf
- Roo Code

自动生成：

```
CREATE TABLE

PRIMARY KEY

FOREIGN KEY

INDEX

CHECK

COMMENT

CONSTRAINT

UNIQUE

VIEW

ENUM（如采用）

Migration
```

保证所有生成结果：

**一致、稳定、可重复。**

------

# 2. 文档关系

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

AI IDE

↓

CREATE TABLE SQL

↓

404 Prisma Model

↓

405 prisma.schema
```

因此：

403

属于：

**代码生成规范。**

不是：

SQL 文件。

------

# 3. PostgreSQL Version

统一：

```
PostgreSQL 17+
```

最低：

```
16
```

推荐：

```
17
```

------

# 4. Extension Policy

AI 必须首先检查：

```
CREATE EXTENSION
```

要求：

```
uuid-ossp

pgcrypto

pg_trgm

btree_gin

btree_gist

unaccent
```

如果不存在：

自动：

```
IF NOT EXISTS
```

------

# 5. Naming Convention

## Table

统一：

```
snake_case
```

例如：

```
standard_product

parameter_definition

offer

workflow_instance
```

禁止：

```
tbl_product

Product

PRODUCT
```

------

## Column

统一：

```
snake_case
```

例如：

```
probe_diameter

created_at

organization_id
```

------

## PK

统一：

```
id
```

类型：

```
UUID v7
```

禁止：

```
product_id

offer_id
```

作为：

主键。

------

## FK

统一：

```
xxx_id
```

例如：

```
organization_id

product_id

category_id
```

------

## Index

统一：

```
idx_

uk_

fk_
```

例如：

```
idx_product_model

idx_offer_status

uk_parameter_code
```

------

## Constraint

统一：

```
ck_

fk_

uk_
```

例如：

```
ck_status

fk_offer_product

uk_product_code
```

------

# 6. UUID Policy

所有业务主键：

统一：

```
UUID v7
```

AI：

不得：

Integer。

不得：

BIGSERIAL。

------

## Foreign Key

全部：

UUID。

保持一致。

------

# 7. Timestamp Policy

统一：

```
TIMESTAMP WITH TIME ZONE
```

简称：

```
timestamptz
```

禁止：

```
timestamp
```

统一：

UTC。

------

## Default

统一：

```
CURRENT_TIMESTAMP
```

------

# 8. Boolean Policy

统一：

```
BOOLEAN
```

禁止：

```
char(1)

tinyint

0

1
```

------

# 默认值

统一：

```
FALSE
```

除非：

业务另行说明。

------

# 9. Text Policy

说明文字：

统一：

```
TEXT
```

名称：

统一：

```
VARCHAR
```

例如：

```
name

code

title
```

------

# 推荐长度

| 类型        | 长度 |
| ----------- | ---- |
| Code        | 64   |
| Name        | 255  |
| Short Name  | 128  |
| Email       | 255  |
| Phone       | 64   |
| URL         | 1024 |
| Storage Key | 1024 |

------

# 10. Decimal Policy

价格：

统一：

```
NUMERIC(18,2)
```

比例：

统一：

```
NUMERIC(8,4)
```

评分：

统一：

```
NUMERIC(5,2)
```

------

# 11. JSON Policy

允许：

```
JSONB
```

禁止：

```
JSON
```

适用：

扩展配置。

AI Metadata。

Provider Config。

搜索配置。

不得：

保存：

核心业务字段。

------

# 12. Enum Policy

Repository：

原则：

**优先 Dictionary。**

即：

不推荐：

PostgreSQL ENUM。

推荐：

```
dictionary

dictionary_item
```

实现：

业务枚举。

仅：

极少数：

系统级：

可使用：

CHECK。

例如：

```
status

version_state
```

------

# 13. Soft Delete Policy

统一：

```
deleted_at

deleted_by
```

禁止：

```
is_deleted
```

所有查询：

默认：

过滤：

```
deleted_at IS NULL
```

------

# 14. Version Policy

所有业务表：

统一：

```
version
```

类型：

```
INTEGER
```

默认：

```
1
```

用于：

Optimistic Lock。

------

# 15. Audit Policy

所有业务表：

必须：

```
created_at

created_by

updated_at

updated_by
```

删除：

```
deleted_at

deleted_by
```

------

# 16. Status Policy

统一：

```
status
```

采用：

Dictionary。

禁止：

Magic Number。

例如：

```
0

1

2

3
```

直接写入业务逻辑。

------

# 17. Comment Policy

AI：

必须：

生成：

```
COMMENT ON TABLE

COMMENT ON COLUMN
```

所有：

Table。

所有：

Column。

必须：

中文。

便于：

DBA。

BI。

维护。

------

# 18. Constraint Policy

所有：

NOT NULL：

必须：

明确声明。

禁止：

依赖：

默认行为。

所有：

UNIQUE：

必须：

命名。

例如：

```
uk_product_code
```

# Part 2：Field Mapping Specification（字段映射规范）

------

# 19. Field Mapping Design Principle

本章节定义：

**数据库字段标准模板（Field Template）**

后续：

全部 60 张业务表

必须引用本章节。

AI IDE：

禁止：

自行推断字段。

禁止：

同义字段。

禁止：

重复命名。

例如：

禁止：

```
productName

product_name

name

productTitle
```

混用。

必须：

统一：

```
name
```

------

# 20. Standard Primary Key Template

所有业务表：

统一：

| Field | Type | Null | Default |
| ----- | ---- | ---- | ------- |
| id    | UUID | NO   | UUID v7 |

------

AI：

统一：

```
PRIMARY KEY(id)
```

禁止：

Composite PK。

禁止：

Business PK。

------

# 21. Standard Audit Template

所有业务表：

必须包含：

| Field      | Type        | Null | Default           |
| ---------- | ----------- | ---- | ----------------- |
| created_at | timestamptz | NO   | CURRENT_TIMESTAMP |
| created_by | UUID        | YES  | NULL              |
| updated_at | timestamptz | NO   | CURRENT_TIMESTAMP |
| updated_by | UUID        | YES  | NULL              |

------

AI：

必须：

生成：

更新时间：

自动维护策略。

推荐：

Trigger。

------

# 22. Soft Delete Template

所有业务表：

统一：

| Field      | Type        |
| ---------- | ----------- |
| deleted_at | timestamptz |
| deleted_by | UUID        |

删除：

统一：

Logical Delete。

禁止：

Physical Delete。

除：

系统日志。

缓存。

临时表。

------

# 23. Version Template

所有业务表：

统一：

| Field   | Type    | Default |
| ------- | ------- | ------- |
| version | INTEGER | 1       |

更新：

统一：

Version +1。

用于：

Optimistic Lock。

------

# 24. Status Template

统一：

| Field  | Type        |
| ------ | ----------- |
| status | VARCHAR(64) |

来源：

Dictionary。

禁止：

Integer。

禁止：

Magic Number。

------

推荐：

例如：

```
draft

enabled

disabled

archived

deleted
```

------

# 25. Organization Reference Template

所有：

归属组织：

统一：

```
organization_id
```

类型：

UUID。

Foreign Key：

```
organization(id)
```

------

适用于：

Offer

User

Workflow

Notification

Attachment

……

------

# 26. Product Reference Template

统一：

```
product_id
```

引用：

```
standard_product(id)
```

不得：

直接：

保存：

产品型号。

产品名称。

统一：

JOIN。

------

# 27. Category Reference Template

统一：

```
category_id
```

引用：

```
product_category(id)
```

禁止：

Category Name。

------

# 28. Dictionary Reference Template

统一：

```
dictionary_item_id
```

所有：

行业。

单位。

币种。

语言。

状态。

统一：

Dictionary。

------

# 29. File Reference Template

统一：

```
file_object_id
```

引用：

```
file_object(id)
```

禁止：

业务表：

保存：

Storage URL。

Bucket。

OSS Key。

S3 URL。

------

# 30. Workflow Reference Template

统一：

```
workflow_instance_id
```

引用：

Workflow。

------

# 31. AI Reference Template

统一：

```
embedding_id

vector_chunk_id
```

不得：

复制：

Embedding。

统一：

引用。

------

# 32. Code Template

所有：

Code：

统一：

```
VARCHAR(64)
```

例如：

```
code

parameter_code

category_code

organization_code
```

唯一：

Unique。

必须：

建立：

Unique Index。

------

# 33. Name Template

统一：

```
VARCHAR(255)
```

例如：

```
name

display_name

english_name

short_name
```

------

# 34. Description Template

统一：

```
TEXT
```

例如：

```
description

remark

introduction

summary
```

------

# 35. URL Template

统一：

```
VARCHAR(1024)
```

适用于：

Website。

Video。

Document。

Image。

Download。

API。

------

# 36. Phone Template

统一：

```
VARCHAR(64)
```

------

# 37. Email Template

统一：

```
VARCHAR(255)
```

------

# 38. Coordinate Template

统一：

| Field     | Type          |
| --------- | ------------- |
| longitude | NUMERIC(12,8) |
| latitude  | NUMERIC(12,8) |

统一：

WGS84。

------

# 39. Money Template

统一：

```
NUMERIC(18,2)
```

包括：

价格。

预算。

金额。

合同额。

报价。

------

币种：

统一：

Dictionary。

------

# 40. Percentage Template

统一：

```
NUMERIC(8,4)
```

例如：

折扣。

税率。

利润率。

命中率。

推荐分值。

------

# 41. Score Template

统一：

```
NUMERIC(5,2)
```

例如：

AI Score。

Search Score。

Review Score。

Ranking。

------

# 42. JSON Template

统一：

```
JSONB
```

允许：

Metadata。

Provider Config。

AI Response。

扩展字段。

禁止：

保存：

核心业务字段。

------

# 43. Array Template

原则：

尽量：

关系表。

禁止：

大量：

Array。

例如：

```
Product

↓

Product Capability
```

而不是：

```
capability[]
```

仅允许：

标签。

关键词。

全文检索辅助。

使用：

```
TEXT[]
```

------

# 44. Attachment Template

统一：

Attachment：

不得：

直接：

保存：

Binary。

统一：

引用：

File Domain。

------

# 45. Default Value Policy

AI：

不得：

依赖：

NULL。

必须：

明确：

Default。

例如：

```
status

↓

draft

version

↓

1

created_at

↓

CURRENT_TIMESTAMP
```

------

# 46. Nullable Policy

所有字段：

必须：

明确：

Nullable。

禁止：

AI：

自行判断。

例如：

```
NOT NULL

NULL
```

必须：

写明。

------

# 47. Business Identifier Policy

业务编号：

例如：

```
RFQ No

Offer No

Demand No

Product Code
```

统一：

Code。

唯一。

建立：

Unique Index。

禁止：

使用：

Primary Key。

------

# 48. Generated Column Policy

允许：

PostgreSQL：

Generated Column。

仅：

统计。

缓存。

计算字段。

不得：

保存：

业务逻辑。

------

# 49. Table Classification

统一分类：

| Type           | Description |
| -------------- | ----------- |
| Master         | 主数据      |
| Transaction    | 业务数据    |
| Mapping        | 关联表      |
| Configuration  | 配置        |
| Dictionary     | 字典        |
| Log            | 日志        |
| Infrastructure | 基础设施    |

后续：

所有：

Table：

必须：

标注：

Classification。

------

# 50. AI IDE Generation Constraints

Cursor / Claude Code / Codex / Gemini CLI：

生成 DDL 时必须遵循：

1. 严格依据 402 数据表规范，不得新增或删除字段。
2. 严格采用本章字段模板，不得自定义数据类型。
3. 所有主键统一 UUID v7。
4. 所有时间字段统一 `timestamptz`。
5. 所有业务表统一审计字段、逻辑删除字段和 Version 字段。
6. 所有外键均采用显式命名。
7. 所有索引均采用统一命名规则。
8. 所有表和字段必须生成中文 `COMMENT`。
9. 所有约束必须显式命名，不允许依赖数据库默认命名。
10. 所有 DDL 输出必须可重复执行（支持迁移工具管理），不得混入业务初始化数据。

# Part 3：Constraint & Referential Integrity Specification（约束、外键与数据完整性规范）

------

# 51. Constraint Design Principles

数据库约束（Constraint）的目标：

不是为了限制开发。

而是：

保证：

```
Data Integrity

Data Consistency

Data Quality

Data Security
```

所有业务规则：

优先：

数据库保证。

其次：

程序保证。

禁止：

完全依赖：

Application。

------

# 52. Primary Key Specification

统一：

```
PRIMARY KEY(id)
```

要求：

```
UUID v7

NOT NULL

UNIQUE
```

AI：

禁止：

Composite PK。

禁止：

Business Key。

禁止：

Auto Increment。

------

适用：

全部：

Master

Transaction

Mapping

Dictionary

Infrastructure

------

# 53. Foreign Key Design

所有外键：

必须：

显式：

命名。

例如：

```
fk_offer_product

fk_offer_organization

fk_product_series

fk_workflow_user
```

禁止：

数据库：

自动命名。

------

# Foreign Key Naming

统一：

```
fk_

+

child_table

+

parent_table
```

例如：

```
fk_offer_product

fk_offer_price_offer

fk_offer_attachment_file
```

------

# 54. ON DELETE Policy

统一策略：

| Parent Entity | ON DELETE             |
| ------------- | --------------------- |
| Master Data   | RESTRICT              |
| Dictionary    | RESTRICT              |
| Product       | RESTRICT              |
| Organization  | RESTRICT              |
| User          | SET NULL              |
| Workflow      | SET NULL              |
| File          | RESTRICT              |
| Mapping Table | CASCADE（仅 Mapping） |

------

原因：

平台：

必须：

保护：

主数据。

避免：

误删除。

------

# 55. ON UPDATE Policy

统一：

```
ON UPDATE RESTRICT
```

UUID：

理论：

不更新。

因此：

统一：

Restrict。

------

# 56. Nullable Foreign Key Policy

分三类：

------

## Mandatory FK

例如：

```
product_id

organization_id

category_id
```

统一：

```
NOT NULL
```

------

## Optional FK

例如：

```
updated_by

deleted_by

workflow_instance_id
```

允许：

NULL。

------

## Temporary FK

例如：

Draft。

Import。

Migration。

允许：

初始化阶段：

NULL。

上线后：

补齐。

------

# 57. Unique Constraint Policy

唯一约束：

必须：

命名。

统一：

```
uk_
```

例如：

```
uk_product_code

uk_parameter_code

uk_dictionary_code

uk_role_code
```

------

允许：

Composite Unique。

例如：

```
organization_id

+

code
```

------

# 58. Check Constraint Policy

允许：

CHECK。

适用于：

数据库：

可保证：

的规则。

例如：

价格：

```
>=0
```

数量：

```
>=0
```

Version：

```
>0
```

Score：

```
0~100
```

Percentage：

```
0~1
```

禁止：

复杂业务：

CHECK。

例如：

审批流程。

权限。

库存。

统一：

Application。

------

# 59. Exclusion Constraint Policy

允许：

PostgreSQL：

EXCLUDE。

适用于：

时间段：

重叠。

例如：

报价有效期。

合同有效期。

优惠活动。

默认：

不开启。

需要：

明确说明。

------

# 60. Index Strategy Overview

所有索引：

统一：

独立：

CREATE INDEX。

禁止：

依赖：

Primary Key。

自动：

索引。

------

索引分类：

```
PRIMARY

UNIQUE

NORMAL

GIN

GIST

TRGM

PARTIAL

COMPOSITE
```

------

# 61. Index Naming

统一：

```
idx_

uk_

gin_

gist_
```

例如：

```
idx_offer_status

idx_product_category

gin_search_text

uk_parameter_code
```

------

# 62. Composite Index Policy

允许：

联合索引。

例如：

```
organization_id

status
```

例如：

```
product_id

status

created_at
```

AI：

按照：

查询：

设计。

禁止：

无意义：

联合索引。

------

# 63. Partial Index Policy

允许：

例如：

```
deleted_at IS NULL
```

例如：

```
status='enabled'
```

适用于：

大表。

提高：

查询性能。

------

# 64. Full Text Search Index

统一：

GIN。

使用：

```
to_tsvector
```

支持：

中文。

英文。

多语言。

适用于：

```
knowledge

product

offer
```

禁止：

LIKE。

全文检索。

------

# 65. Trigram Index

统一：

```
pg_trgm
```

适用于：

模糊搜索。

例如：

```
Model

Name

Code
```

支持：

```
ILIKE

Similarity
```

------

# 66. JSONB Index

JSONB：

统一：

GIN。

禁止：

普通：

BTree。

------

# 67. Array Index

TEXT[]：

统一：

GIN。

例如：

```
keywords

tags
```

------

# 68. Transaction Policy

所有：

DDL：

不得：

隐式：

Commit。

Migration：

统一：

事务。

失败：

Rollback。

------

# 69. Lock Policy

Migration：

避免：

长时间：

Exclusive Lock。

优先：

```
CREATE INDEX CONCURRENTLY
```

上线：

不停机。

------

# 70. Deferred Constraint Policy

允许：

```
DEFERRABLE
```

适用于：

批量导入。

复杂迁移。

默认：

关闭。

------

# 71. Circular Reference Policy

禁止：

循环外键。

例如：

```
A

↓

B

↓

C

↓

A
```

如确需引用：

通过：

业务编号。

或：

中间关联表。

解决。

------

# 72. Mapping Table Specification

所有：

Many-to-Many：

统一：

Mapping Table。

例如：

```
product_capability

product_feature

user_role

role_permission

product_knowledge_mapping
```

统一：

包含：

```
id

两侧FK

created_at

created_by

status

version
```

禁止：

省略：

审计字段。

------

# 73. Master Data Protection Policy

以下主数据：

禁止：

Cascade Delete。

包括：

```
Product

Dictionary

Category

Capability

Feature

Parameter

Knowledge
```

统一：

Archive。

------

# 74. Referential Integrity Checklist

AI IDE：

生成 DDL 前：

必须：

检查：

```
✓ 所有 FK 已命名

✓ 所有 FK 指向唯一主键

✓ 所有 UUID 类型一致

✓ 无循环引用

✓ Mapping 使用关联表

✓ 主数据禁止 Cascade Delete

✓ 所有 Constraint 已命名

✓ 所有索引符合命名规范

✓ 所有唯一约束已建立

✓ 所有 COMMENT 已生成
```

# 75. Table Classification（数据表分类）

平台全部数据表统一划分为六种类型：

| Type           | Description  | Typical Tables                      |
| -------------- | ------------ | ----------------------------------- |
| Master         | 主数据       | Product、Category、Parameter        |
| Transaction    | 业务数据     | Offer、Demand、RFQ                  |
| Mapping        | 多对多关联   | Product Capability、User Role       |
| Configuration  | 配置         | Workflow Definition、System Setting |
| Dictionary     | 基础字典     | Dictionary、Dictionary Item         |
| Infrastructure | 平台基础设施 | File、Audit Log、Embedding          |

AI IDE 必须首先识别数据表类型，再应用对应模板。

------

# 76. Master Table Generation Template

适用于：

```
Product

Category

Series

Family

Parameter

Capability

Feature

Knowledge
```

------

## 字段排列顺序（固定）

```
① Primary Key

② Business Code

③ Name

④ Parent Reference（如有）

⑤ Business Fields

⑥ Description

⑦ Status

⑧ Version

⑨ Audit Fields
```

------

## Index Layout

统一：

```
PK

↓

Business Code UNIQUE

↓

Parent FK

↓

Status Index

↓

Name Search Index
```

------

## Delete Strategy

统一：

```
Archive

Logical Delete

RESTRICT
```

------

# 77. Transaction Table Generation Template

适用于：

```
Offer

Demand

RFQ

Quotation

Workflow Instance
```

------

## 字段顺序

```
Primary Key

↓

Business No

↓

Owner

↓

Business Reference

↓

Status

↓

Business Data

↓

Workflow

↓

Audit
```

------

## Index Layout

统一：

```
Business No

Owner

Status

Created At

Updated At
```

------

## Delete Strategy

统一：

Logical Delete

禁止：

Cascade。

------

# 78. Mapping Table Generation Template

适用于：

```
Product Capability

Product Feature

User Role

Role Permission

Knowledge Mapping
```

------

## 字段顺序

```
Primary Key

↓

Left FK

↓

Right FK

↓

Status

↓

Version

↓

Audit
```

------

## Constraints

统一：

```
Unique

Left FK

+

Right FK
```

避免：

重复关联。

------

## Delete

允许：

Cascade。

仅：

Mapping。

------

# 79. Dictionary Table Generation Template

适用于：

```
Dictionary

Dictionary Item
```

统一：

字段：

```
Code

↓

Name

↓

Language

↓

Sort

↓

Status
```

------

禁止：

业务字段。

------

# 80. Configuration Table Template

适用于：

```
System Setting

Workflow Definition

Notification Template
```

------

统一：

字段：

```
Code

↓

Name

↓

Configuration(JSONB)

↓

Status

↓

Audit
```

------

JSON：

仅允许：

配置。

禁止：

业务数据。

------

# 81. Infrastructure Table Template

适用于：

```
Audit

File

Embedding

Search Index

Operation Log
```

------

统一：

优先：

写性能。

允许：

大字段。

允许：

Partition。

------

# 82. File Domain Generation Rules

File：

统一：

保存：

Metadata。

禁止：

Binary。

字段：

推荐：

```
File Name

Extension

MIME

Checksum

Size

Storage Provider

Storage Key
```

统一：

Object Storage。

------

# 83. AI Domain Generation Rules

Embedding：

统一：

Metadata。

Vector：

外部：

Vector Database

或：

PostgreSQL pgvector（后续可扩展）。

Repository：

不得：

绑定：

具体 AI Provider。

------

# 84. Workflow Generation Rules

Workflow：

统一：

引用：

Business Type

Business ID

禁止：

Workflow：

直接：

依赖：

Product。

Offer。

Demand。

实现：

统一流程引擎。

------

# 85. User Table Rules

统一：

用户：

仅：

保存：

身份。

Profile：

拆分。

Role：

拆分。

Permission：

拆分。

禁止：

User：

超宽表。

------

# 86. Business Number Generation Rules

所有业务编号：

统一：

Sequence。

例如：

```
VIS-PD-202600001

VIS-DM-202600001

VIS-RFQ-202600001

VIS-OF-202600001
```

数据库：

不负责：

生成规则。

统一：

Sequence Service。

------

# 87. Comment Generation Rules

AI IDE：

必须：

生成：

```
COMMENT ON TABLE

COMMENT ON COLUMN
```

要求：

- 表注释统一采用中文业务名称。
- 字段注释统一说明业务含义，不描述实现细节。
- 注释保持与 402 文档一致。
- 不允许遗漏任何业务字段。

------

# 88. Table Creation Order

为了避免外键依赖冲突，DDL 必须按照固定顺序生成。

```
Dictionary
        ↓
Category
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
Offer
        ↓
Demand
        ↓
RFQ
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

随机生成建表顺序。

------

# 89. Foreign Key Creation Order

所有外键：

统一：

第二阶段创建。

流程：

```
CREATE TABLE

↓

PRIMARY KEY

↓

UNIQUE

↓

INDEX

↓

FOREIGN KEY

↓

COMMENT
```

避免：

循环依赖。

------

# 90. AI IDE Output Structure

Cursor / Codex / Claude Code 等生成 DDL 时统一输出目录：

```
database/

ddl/

├──000_extensions.sql
├──001_dictionary.sql
├──010_product.sql
├──020_parameter.sql
├──030_capability.sql
├──040_feature.sql
├──050_knowledge.sql
├──060_organization.sql
├──070_user.sql
├──080_offer.sql
├──090_demand.sql
├──100_rfq.sql
├──110_workflow.sql
├──120_file.sql
├──130_ai.sql
├──140_system.sql
├──900_indexes.sql
├──910_foreign_keys.sql
├──920_comments.sql
└──999_verify.sql
```

所有 SQL 文件：

必须：

- 可重复执行（结合迁移工具）
- 保持命名一致
- 保持与 402 文档一一对应
- 不混入测试数据

# 91. Performance Design Principles

数据库性能优化遵循以下原则：

> **优先正确的数据模型，其次是索引，再其次是缓存。**

禁止：

- 为少量数据提前过度优化。
- 为未知场景建立大量冗余索引。
- 在业务表中保存重复数据用于查询加速。

允许：

- 使用合理索引。
- 使用物化视图（Materialized View）处理统计。
- 使用缓存层处理热点数据。

------

# 92. Index Optimization Strategy

索引建立原则：

| 查询场景         | 建议           |
| ---------------- | -------------- |
| 主键查询         | Primary Key    |
| 唯一编号查询     | UNIQUE INDEX   |
| 状态筛选         | BTree Index    |
| 时间排序         | BTree Index    |
| 全文搜索         | GIN            |
| JSONB 查询       | GIN            |
| 模糊搜索         | pg_trgm        |
| 地理位置（未来） | GiST / PostGIS |

------

禁止：

```
一个字段建立多个重复索引

大量低选择性索引

未使用索引长期保留
```

------

# 93. Composite Index Strategy

联合索引建立规则：

按照：

> **WHERE → ORDER BY → LIMIT**

排序。

例如：

```
organization_id

↓

status

↓

created_at DESC
```

优于：

```
created_at

↓

organization_id

↓

status
```

AI IDE：

根据查询模型自动推荐联合索引。

禁止：

仅根据字段数量建立联合索引。

------

# 94. Covering Index Policy

允许：

覆盖索引。

适用于：

高频查询。

例如：

```
Offer List

↓

organization_id

status

updated_at
```

避免：

回表。

------

# 95. Partition Strategy

默认：

不启用。

当满足：

```
>1000万记录
```

推荐：

Range Partition。

适用于：

```
audit_log

operation_log

notification

workflow_history
```

分区字段：

统一：

```
created_at
```

------

# 96. Archive Strategy

历史数据：

统一：

Archive。

推荐：

```
90天

180天

365天
```

根据业务：

配置。

归档：

不得：

影响：

业务查询。

------

# 97. Materialized View Strategy

允许：

Materialized View。

适用于：

```
Dashboard

Statistics

BI

Ranking
```

禁止：

业务事务。

依赖：

Materialized View。

------

# 98. Migration Version Policy

Migration：

统一：

语义化版本。

例如：

```
V1.0.0

V1.1.0

V2.0.0
```

每个 Migration：

仅完成：

一类变更。

禁止：

超大 Migration。

------

# 99. Migration Rules

允许：

```
CREATE TABLE

ALTER TABLE

CREATE INDEX

DROP INDEX

COMMENT
```

禁止：

Migration：

混入：

业务初始化数据。

------

# 100. Rollback Strategy

所有 Migration：

必须：

支持：

Rollback。

包括：

```
DROP TABLE

DROP INDEX

DROP CONSTRAINT
```

禁止：

不可逆 Migration。

------

# 101. Seed Data Strategy

Seed：

仅允许：

```
Dictionary

Country

Language

Currency

System Role
```

禁止：

测试客户。

测试产品。

测试报价。

------

# 102. Verification Strategy

AI IDE：

生成 DDL 后：

必须检查：

```
✓ SQL Syntax

✓ FK Reference

✓ Constraint Name

✓ Index Name

✓ UUID Type

✓ Comment

✓ Nullable

✓ Default Value
```

------

# 103. Naming Verification

自动检查：

```
Table

Column

Index

Constraint

Sequence

View
```

全部：

符合：

399 命名规范。

------

# 104. Dependency Verification

AI：

必须：

验证：

```
Dictionary

↓

Category

↓

Product

↓

Offer

↓

RFQ

↓

Workflow
```

不得：

存在：

依赖错误。

------

# 105. Database Compatibility

Repository：

统一：

支持：

```
PostgreSQL 17
```

兼容：

```
PostgreSQL 16
```

不考虑：

MySQL。

SQL Server。

Oracle。

SQLite。

------

# 106. ORM Compatibility

DDL：

必须：

兼容：

- Prisma ORM
- Drizzle ORM
- TypeORM（如未来需要）

禁止：

使用上述 ORM 普遍无法映射的数据库特性作为核心设计（可选增强能力除外）。

------

# 107. AI IDE Verification Checklist

AI IDE 在输出 DDL 前必须完成以下检查：

```
□ 表数量与 402 一致

□ 字段数量一致

□ 字段类型一致

□ 主键一致

□ 外键一致

□ COMMENT 完整

□ Index 完整

□ Constraint 完整

□ Migration 可执行

□ Prisma 可映射
```

------

# 108. Repository Acceptance Criteria

当且仅当满足以下条件：

```
100%

ER Model

↓

100%

Table Specification

↓

100%

DDL Specification

↓

AI IDE

↓

DDL

↓

Prisma

↓

NestJS

↓

Frontend
```

Repository：

视为：

Database Layer Complete。

# 109. Document Dependency Matrix（文档依赖矩阵）

AI IDE 生成数据库工程时，必须按照固定依赖顺序读取 Repository 文档。

```
399_CanonicalNamingSpecification.md
                │
                ▼
401_PostgreSQL_ER_Model.md
                │
                ▼
402_PostgreSQL_Table_Specification.md
                │
                ▼
403_PostgreSQL_DDL_Specification.md
                │
                ▼
Generate PostgreSQL DDL
                │
                ▼
404_Prisma_Schema.md
                │
                ▼
405_prisma.schema
                │
                ▼
NestJS Entity / DTO / Repository
                │
                ▼
API
                │
                ▼
Frontend
```

任何阶段不得跳过前置文档。

------

# 110. AI IDE Input Protocol

AI IDE 输入规范：

## Mandatory Input

必须输入：

```
399

401

402

403
```

缺少任何一份：

不得：

生成数据库。

------

## Optional Input

允许：

```
Business Blueprint

Repository README

API Design
```

用于：

补充：

业务理解。

不得：

覆盖：

数据库规范。

------

# 111. AI Generation Priority

AI IDE：

发生冲突时：

统一：

优先级：

```
403

↓

402

↓

401

↓

Business Blueprint
```

原因：

403：

定义：

DDL。

402：

定义：

Table。

401：

定义：

Relationship。

Blueprint：

定义：

Business。

------

# 112. Generation Rules

AI IDE：

生成：

DDL：

必须：

保证：

```
100%

Deterministic

Repeatable

Consistent
```

不得：

随机：

字段顺序。

Constraint 名称。

Index 名称。

Comment 内容。

------

# 113. Output Deliverables

生成完成后：

必须输出：

```
database/

ddl/

migration/

prisma/

verification/
```

其中：

## ddl/

保存：

全部：

DDL。

------

## migration/

保存：

Migration。

------

## prisma/

保存：

Schema。

------

## verification/

保存：

检查报告。

例如：

```
table-count.md

constraint-check.md

index-check.md

comment-check.md
```

------

# 114. Verification Report Standard

AI IDE：

必须：

输出：

数据库生成报告。

包括：

```
Table Count

Column Count

Constraint Count

Foreign Key Count

Index Count

Comment Count

Dictionary Reference Count
```

保证：

Repository：

可审计。

------

# 115. DDL Consistency Verification

必须检查：

```
Table

↓

Column

↓

Type

↓

Nullable

↓

Default

↓

Comment

↓

Constraint

↓

Index

↓

Foreign Key
```

全部：

与：

402：

一致。

------

# 116. Prisma Consistency Verification

必须检查：

```
DDL

↓

Prisma Model

↓

Prisma Relation

↓

Prisma Enum（如存在）

↓

Migration
```

全部：

一致。

禁止：

人工修改：

Prisma。

------

# 117. ORM Consistency Verification

统一：

检查：

```
DDL

↓

Prisma

↓

Repository

↓

DTO

↓

Entity

↓

Service
```

避免：

字段：

不一致。

------

# 118. Future Evolution Policy

Repository：

允许：

新增：

```
Module

Table

Column
```

禁止：

修改：

已冻结：

命名规范。

主键策略。

公共字段。

外键策略。

除：

Major Version。

------

# 119. Versioning Policy

Repository：

版本：

统一：

```
Major

Minor

Patch
```

例如：

```
2.0.0

2.1.0

2.1.1

3.0.0
```

规则：

- **Major**：允许架构调整（需重新冻结）。
- **Minor**：新增模块、数据表或字段，保持兼容。
- **Patch**：修正描述、注释、示例、错误，不改变数据模型。

------

# 120. AI Prompt Standard

建议为 AI IDE 建立统一 Prompt 模板。

```
Input:
399
401
402
403

Goal:
Generate PostgreSQL DDL

Requirements:
100% follow Repository Specification

Output:
DDL
Migration
Verification Report

Do NOT redesign business model.
Do NOT rename any table.
Do NOT rename any column.
Do NOT infer missing fields.
```

该 Prompt 作为所有 AI 工具的统一入口。

------

# 121. Database Acceptance Checklist

数据库层验收条件：

```
□ ER 模型与 401 一致

□ 数据表数量与 402 一致

□ 字段一致

□ 字段类型一致

□ 外键一致

□ 索引一致

□ COMMENT 完整

□ UUID 策略一致

□ 公共字段一致

□ Dictionary 引用一致

□ Workflow 引用一致

□ File 引用一致

□ Migration 可执行

□ Prisma 可生成

□ Verification Report 完成
```

全部完成后：

Database Layer：

Accepted。

------

# 122. Repository Freeze Statement

本文档冻结以下内容：

- PostgreSQL DDL 总体设计原则
- 字段映射规范
- 约束与引用完整性规范
- 数据表生成模板
- 性能与迁移规范
- AI IDE 生成协议
- Repository 数据库验收标准

除 Major Version 外，不允许修改上述规则。

