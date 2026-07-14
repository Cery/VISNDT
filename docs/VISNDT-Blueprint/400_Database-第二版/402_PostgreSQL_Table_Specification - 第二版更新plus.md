# VISNDT Repository Documentation Edition 2.0

---

# Document Identity

| Item          | Value                                       |
| ------------- | ------------------------------------------- |
| Document ID   | 402                                         |
| Document Name | PostgreSQL Table Specification              |
| Version       | 2.0 Final Freeze Edition                    |
| Status        | In Progress                                 |
| Repository    | VISNDT Repository Documentation Edition 2.0 |
| Directory     | docs/400_Database/                          |
| File Name     | 402_PostgreSQL_Table_Specification.md       |

---

# 1. Purpose

本规范定义 VISNDT 平台全部 PostgreSQL 数据表。

本文档是整个 Repository 中唯一的数据结构来源（Single Source of Truth）。

后续所有数据库相关文档均引用本文档：

- 403_PostgreSQL_DDL_Specification.md
- 404_Prisma_Schema.md
- 405_schema.prisma
- 406_Migration_Strategy.md
- 407_Seed_Data.md
- 408_Index_Strategy.md
- 409_Performance_Optimization.md
- 410_Database_Final_Checklist.md

本文档负责定义：

- Database Domain
- Table Structure
- Business Responsibility
- Field Specification
- Relationship
- Ownership
- Lifecycle
- Constraint
- Repository Rule

本文档不包含：

- SQL
- Prisma Code
- Migration Script

---

# 2. Repository Dependency

399_CanonicalNamingSpecification.md

↓

401_PostgreSQL_ER_Model.md

↓

402_PostgreSQL_Table_Specification.md

↓

403_PostgreSQL_DDL_Specification.md

↓

404_Prisma_Schema.md

↓

405_schema.prisma

---

# 3. Universal Database Convention

## 3.1 Naming Convention

所有数据库对象统一采用：

```
snake_case
```

示例：

```
standard_product

product_category

organization

workflow_instance
```

禁止：

```
StandardProduct

tbl_product

ProductTable
```

---

## 3.2 Primary Key Convention

所有业务表统一：

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

organization_id
```

作为主键名称。

---

## 3.3 Foreign Key Convention

统一：

```
xxx_id
```

例如：

```
product_id

organization_id

category_id

series_id

workflow_id
```

---

## 3.4 Timestamp Convention

统一采用 UTC。

所有业务表统一包含：

```
created_at

updated_at

deleted_at
```

---

## 3.5 Operator Convention

所有业务表统一包含：

```
created_by

updated_by

deleted_by
```

引用：

```
user.id
```

---

## 3.6 Version Convention

统一：

```
version
```

用于：

乐观锁。

版本控制。

---

## 3.7 Status Convention

统一：

```
status
```

用于：

业务状态。

统一：

```
workflow_state
```

用于：

审批状态。

---

# 4. Universal Audit Fields

除特殊系统表外，所有业务实体统一包含以下字段：

| Field      | Type        | Required | Description     |
| ---------- | ----------- | -------- | --------------- |
| id         | UUID        | Yes      | Primary Key     |
| created_at | TIMESTAMP   | Yes      | 创建时间（UTC） |
| created_by | UUID        | Yes      | 创建人          |
| updated_at | TIMESTAMP   | Yes      | 更新时间        |
| updated_by | UUID        | Yes      | 更新人          |
| deleted_at | TIMESTAMP   | No       | 删除时间        |
| deleted_by | UUID        | No       | 删除人          |
| version    | INTEGER     | Yes      | 乐观锁版本号    |
| status     | VARCHAR(32) | Yes      | 数据状态        |

---

# 5. Universal Delete Policy

平台统一采用：

```
Logical Delete
```

默认：

```
deleted_at IS NULL
```

禁止：

Physical Delete。

除日志类数据外：

任何业务实体不得直接物理删除。

---

# 6. Universal Index Rules

所有业务表默认包含：

Primary Key：

```
PRIMARY KEY(id)
```

Foreign Key：

所有外键字段必须建立索引。

Business Code：

所有唯一编码建立：

```
UNIQUE INDEX
```

搜索字段：

建立：

```
BTREE INDEX
```

全文检索：

后续：

统一采用 PostgreSQL Full Text Search。

---

# 7. Product Domain

---

## Domain Identity

| Item      | Value                  |
| --------- | ---------------------- |
| Domain    | Product                |
| Owner     | Platform               |
| Lifecycle | Permanent              |
| Purpose   | 平台唯一产品主数据管理 |
| Mutable   | Revision Only          |

Product Domain 保存：

平台产品标准数据。

不保存：

- 商业价格
- 库存
- 供应商
- 销售信息

商业数据统一属于：

Offer Domain。

---

# Table 7.1

## product_category

### Table Identity

| Item           | Value            |
| -------------- | ---------------- |
| Canonical Name | Product Category |
| Chinese Name   | 产品一级分类     |
| Table Name     | product_category |
| Owner          | Platform         |
| Lifecycle      | Permanent        |

---

### Business Purpose

维护平台一级产品分类。

示例：

- 工业内窥镜
- 光纤内窥镜
- 光学硬杆镜
- 管道检测设备

属于平台主数据。

---

### Relationships

Parent：

None

Child：

```
product_sub_category
```

Referenced By：

```
parameter_template

capability_definition

feature_definition
```

---

### Field Specification

| Field            | Type         | Required | Description      |
| ---------------- | ------------ | -------- | ---------------- |
| id               | UUID         | Yes      | Primary Key      |
| category_code    | VARCHAR(64)  | Yes      | 分类编码（唯一） |
| category_name_zh | VARCHAR(255) | Yes      | 中文名称         |
| category_name_en | VARCHAR(255) | No       | 英文名称         |
| description      | TEXT         | No       | 分类描述         |
| display_order    | INTEGER      | Yes      | 排序             |
| status           | VARCHAR(32)  | Yes      | 状态             |
| version          | INTEGER      | Yes      | 乐观锁版本       |

公共审计字段继承 Universal Audit Fields。

---

### Indexes

Primary Key：

```
id
```

Unique：

```
category_code
```

Search：

```
category_name_zh

category_name_en
```

---

### Delete Policy

Archive Only

Logical Delete

---

### Repository Notes

产品分类属于平台主数据。

禁止组织自行创建。

禁止引用商业信息。

---

# Table 7.2

## product_sub_category

### Table Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Product Sub Category |
| Chinese Name   | 产品二级分类         |
| Table Name     | product_sub_category |
| Owner          | Platform             |
| Lifecycle      | Permanent            |

---

### Business Purpose

维护一级分类下的产品子分类。

示例：

工业电子内窥镜：

- 普通电子内窥镜
- 双镜头电子内窥镜
- 测量型电子内窥镜
- 高温电子内窥镜

---

### Relationships

Parent：

```
product_category
```

Child：

```
product_family
```

---

### Field Specification

| Field                | Type         | Required | Description  |
| -------------------- | ------------ | -------- | ------------ |
| id                   | UUID         | Yes      | Primary Key  |
| category_id          | UUID         | Yes      | 一级分类     |
| sub_category_code    | VARCHAR(64)  | Yes      | 二级分类编码 |
| sub_category_name_zh | VARCHAR(255) | Yes      | 中文名称     |
| sub_category_name_en | VARCHAR(255) | No       | 英文名称     |
| description          | TEXT         | No       | 描述         |
| display_order        | INTEGER      | Yes      | 排序         |
| status               | VARCHAR(32)  | Yes      | 状态         |
| version              | INTEGER      | Yes      | 乐观锁版本   |

（公共审计字段省略，统一继承 Universal Audit Fields）

---

### Indexes

Primary Key

```
PRIMARY KEY (id)
```

Foreign Key

```
INDEX(category_id)
```

Unique

```
UNIQUE(sub_category_code)
```

Search

```
INDEX(sub_category_name_zh)

INDEX(sub_category_name_en)
```

---

### Unique Constraints

```
sub_category_code
```

平台范围唯一。

---

### Reference Rules

必须引用：

```
product_category.id
```

不得保存：

```
category_name
```

等冗余数据。

业务系统统一通过关联查询获得分类名称。

---

### Lifecycle Rules

创建：

Platform Administrator

修改：

Platform Administrator

发布：

立即生效

历史：

保留版本记录。

---

### Delete Policy

Archive Only

Logical Delete

若仍存在：

```
product_family
```

引用：

禁止删除。

---

### Audit Fields

继承：

Universal Audit Fields

---

### Repository Notes

产品子分类属于平台主数据。

标准产品仅引用：

```
product_sub_category.id
```

禁止复制分类信息。

---

# Table 7.3

## product_family

### Table Identity

| Item           | Value          |
| -------------- | -------------- |
| Canonical Name | Product Family |
| Chinese Name   | 产品族         |
| Table Name     | product_family |
| Domain         | Product        |
| Owner          | Platform       |
| Lifecycle      | Permanent      |

---

### Business Purpose

产品族用于描述具有相同能力模型及参数模板的一组产品。

产品族是：

产品模板的继承单位。

典型示例：

```
Measurement Family

High Temperature Family

Explosion Proof Family

Dual Camera Family
```

产品族主要负责：

- 参数模板继承
- 能力模板继承
- Feature 默认集合
- 产品系列组织

---

### Relationships

Parent

```
product_sub_category
```

Child

```
product_series
```

Referenced By

```
parameter_template

capability_definition

feature_definition
```

---

### Field Specification

| Field                 | Type         | Required | Description  |
| --------------------- | ------------ | -------- | ------------ |
| id                    | UUID         | Yes      | Primary Key  |
| sub_category_id       | UUID         | Yes      | 所属二级分类 |
| family_code           | VARCHAR(64)  | Yes      | 产品族编码   |
| family_name_zh        | VARCHAR(255) | Yes      | 中文名称     |
| family_name_en        | VARCHAR(255) | No       | 英文名称     |
| parameter_template_id | UUID         | No       | 默认参数模板 |
| description           | TEXT         | No       | 产品族说明   |
| display_order         | INTEGER      | Yes      | 排序         |
| workflow_state        | VARCHAR(32)  | Yes      | 生命周期状态 |
| status                | VARCHAR(32)  | Yes      | 状态         |
| version               | INTEGER      | Yes      | 乐观锁版本   |

公共审计字段继承 Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Foreign Key

```
INDEX(sub_category_id)

INDEX(parameter_template_id)
```

Unique

```
UNIQUE(family_code)
```

Search

```
INDEX(family_name_zh)

INDEX(family_name_en)
```

---

### Unique Constraints

```
family_code
```

平台唯一。

---

### Reference Rules

Parameter Template：

引用：

```
parameter_template.id
```

不得复制模板信息。

---

### Lifecycle Rules

平台维护。

发布后：

允许新增：

Series。

禁止：

直接改变产品族语义。

---

### Delete Policy

Archive Only

存在：

```
product_series
```

引用时：

禁止删除。

---

### Audit Fields

继承 Universal Audit Fields

---

### Repository Notes

Family 是平台产品建模的重要抽象层。

标准产品不得直接跳过 Family。

所有产品均应属于唯一 Product Family。

---

# Table 7.4

## product_series

### Table Identity

| Item           | Value          |
| -------------- | -------------- |
| Canonical Name | Product Series |
| Chinese Name   | 产品系列       |
| Table Name     | product_series |
| Domain         | Product        |
| Owner          | Platform       |
| Lifecycle      | Permanent      |

---

### Business Purpose

产品系列用于组织同一产品族下具有统一市场定位或代际关系的标准产品。

例如：

```
VIS-300

VIS-600

VIS-900

VIS-PRO
```

Series 是：

产品型号管理单位。

不是：

商业销售单位。

---

### Relationships

Parent

```
product_family
```

Child

```
standard_product
```

Referenced By

```
offer

knowledge

search
```

---

### Field Specification

| Field          | Type         | Required | Description  |
| -------------- | ------------ | -------- | ------------ |
| id             | UUID         | Yes      | Primary Key  |
| family_id      | UUID         | Yes      | 所属产品族   |
| series_code    | VARCHAR(64)  | Yes      | 系列编码     |
| series_name_zh | VARCHAR(255) | Yes      | 中文名称     |
| series_name_en | VARCHAR(255) | No       | 英文名称     |
| generation     | VARCHAR(64)  | No       | 产品代际     |
| description    | TEXT         | No       | 系列说明     |
| display_order  | INTEGER      | Yes      | 排序         |
| workflow_state | VARCHAR(32)  | Yes      | 生命周期状态 |
| status         | VARCHAR(32)  | Yes      | 状态         |
| version        | INTEGER      | Yes      | 乐观锁版本   |

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Foreign Key

```
INDEX(family_id)
```

Unique

```
UNIQUE(series_code)
```

Search

```
INDEX(series_name_zh)

INDEX(series_name_en)
```

---

### Reference Rules

Series：

统一引用：

```
product_family.id
```

不得保存：

Family 名称。

---

### Lifecycle Rules

允许：

持续新增：

Standard Product。

历史产品：

保留。

不得覆盖历史系列。

---

### Delete Policy

Archive Only

若存在：

```
standard_product
```

引用：

禁止删除。

---

### Repository Notes

Series 是产品型号归属层。

供应商不得修改。

商业信息不得进入 Series。

# Table 7.5

## standard_product

---

### Table Identity

| Item           | Value            |
| -------------- | ---------------- |
| Canonical Name | Standard Product |
| Chinese Name   | 标准产品         |
| Table Name     | standard_product |
| Domain         | Product          |
| Owner          | Platform         |
| Lifecycle      | Permanent        |
| Mutable        | Revision Only    |

---

### Business Purpose

Standard Product 是整个 VISNDT 平台唯一的产品主数据（Master Data）。

所有业务模块统一引用 Standard Product。

包括但不限于：

- Offer
- RFQ
- Demand Recommendation
- Knowledge Mapping
- AI Search
- Product Compare
- Workflow

Standard Product 保存：

- 产品身份
- 产品型号
- 分类关系
- 参数模板引用
- 参数值
- 能力映射
- 功能映射
- 生命周期

Standard Product 不保存：

- 销售价格
- 库存
- 供应商
- 商业政策
- 销售区域
- MOQ
- Lead Time

所有商业信息统一归属于：

Offer Domain。

---

### Relationships

Parent

```
product_series
```

Child

```
product_parameter_value

product_capability

product_feature

product_attachment

product_version

product_workflow
```

Referenced By

```
offer

knowledge

product_knowledge_mapping

rfq_item

demand_recommendation

vector_chunk

search_index

workflow_instance
```

---

### Field Specification

| Field                 | Type         | Required | Description  |
| --------------------- | ------------ | -------- | ------------ |
| id                    | UUID         | Yes      | Primary Key  |
| product_code          | VARCHAR(64)  | Yes      | 产品唯一编码 |
| model_no              | VARCHAR(128) | Yes      | 产品型号     |
| product_name_zh       | VARCHAR(255) | Yes      | 中文名称     |
| product_name_en       | VARCHAR(255) | No       | 英文名称     |
| category_id           | UUID         | Yes      | 一级分类     |
| sub_category_id       | UUID         | Yes      | 二级分类     |
| family_id             | UUID         | Yes      | 产品族       |
| series_id             | UUID         | Yes      | 产品系列     |
| parameter_template_id | UUID         | No       | 参数模板     |
| short_description     | TEXT         | No       | 产品简介     |
| release_date          | DATE         | No       | 发布时间     |
| end_of_life_date      | DATE         | No       | 停产日期     |
| workflow_state        | VARCHAR(32)  | Yes      | 生命周期状态 |
| status                | VARCHAR(32)  | Yes      | 数据状态     |
| version               | INTEGER      | Yes      | 乐观锁版本   |

所有公共字段继承：

```
Universal Audit Fields
```

---

### Field Constraints

Product Code

必须：

```
唯一

不可修改
```

Model No

允许：

显示修改。

Product Name

允许：

多语言。

Category

必须引用：

```
product_category.id
```

Series

必须引用：

```
product_series.id
```

Parameter Template

允许：

为空。

产品可继承：

Family Template。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Unique Index

```
UNIQUE(product_code)
```

Business Index

```
INDEX(model_no)

INDEX(product_name_zh)

INDEX(product_name_en)
```

Foreign Key Index

```
INDEX(category_id)

INDEX(sub_category_id)

INDEX(family_id)

INDEX(series_id)

INDEX(parameter_template_id)
```

Workflow Index

```
INDEX(status)

INDEX(workflow_state)
```

---

### Unique Constraints

平台唯一：

```
product_code
```

平台允许：

```
model_no
```

重复。

（不同品牌未来可扩展）

---

### Reference Rules

分类：

统一引用：

```
product_category
```

不得保存：

分类名称。

能力：

统一引用：

```
capability_definition
```

功能：

统一引用：

```
feature_definition
```

参数：

统一引用：

```
parameter_definition
```

文件：

统一引用：

```
file_object
```

知识：

统一引用：

```
knowledge
```

禁止复制：

上述任何主数据。

---

### Lifecycle Rules

创建：

Platform Administrator

审核：

Workflow

发布：

Published

修改：

生成新 Revision。

历史版本：

永久保留。

禁止：

覆盖历史版本。

---

### Delete Policy

Archive Only

Logical Delete

若：

Offer

RFQ

Demand

Knowledge

Workflow

仍引用：

禁止删除。

---

### Audit Fields

统一继承：

Universal Audit Fields

---

### Repository Notes

Standard Product 是：

VISNDT Repository

唯一产品主数据。

任何业务模块：

不得：

建立：

自己的 Product 表。

不得：

复制 Product 信息。

必须：

统一引用：

```
standard_product.id
```

这是整个 Repository 的核心约束。

---

# Product Domain Constraints

所有 Product Domain 必须遵循以下原则：

## Rule 1

平台产品唯一来源：

```
standard_product
```

任何业务系统：

不得维护第二套产品数据。

---

## Rule 2

商业数据统一属于：

```
Offer Domain
```

Product 不保存：

价格。

库存。

供应商。

交货周期。

销售区域。

---

## Rule 3

参数采用：

```
Definition

+

Value
```

模型。

禁止：

宽表。

---

## Rule 4

Capability

Feature

全部采用：

Mapping。

禁止：

保存文本。

---

## Rule 5

所有附件统一引用：

```
File Domain
```

禁止：

保存：

OSS 地址。

本地路径。

URL。

---

## Rule 6

所有知识统一引用：

```
Knowledge Domain
```

禁止：

Product

保存：

文章正文。

PDF。

视频。

---

# Product Domain Status

| Table                | Status |
| -------------------- | ------ |
| product_category     | Frozen |
| product_sub_category | Frozen |
| product_family       | Frozen |
| product_series       | Frozen |
| standard_product     | Frozen |

---

# Product Domain Summary

Domain：

Product

包含：

5 张核心主表

9 张扩展业务表

统一组成：

VISNDT Product Master Data。

Product Domain 至此冻结。

---

# Part 8

# Parameter Domain

---

## Domain Identity

| Item      | Value                |
| --------- | -------------------- |
| Domain    | Parameter            |
| Owner     | Platform             |
| Lifecycle | Permanent            |
| Purpose   | 建立平台统一参数体系 |
| Mutable   | Platform Only        |

---

## Business Purpose

Parameter Domain 用于统一管理：

- 参数定义
- 参数模板
- 参数值
- 参数继承
- 参数校验

统一支撑：

- Product
- Search
- AI
- Compare
- RFQ
- Recommendation
- Knowledge

---

## Repository Principle

平台采用：

```
Parameter Definition

↓

Parameter Template

↓

Parameter Value
```

禁止：

```
Product

↓

Parameter Columns
```

即：

禁止：

一个产品对应：

```
100+

字段
```

统一采用：

Entity + Value

设计。

---

## Domain Structure

```
parameter_group
        │
        ▼
parameter_definition
        │
        ▼
parameter_template
        │
        ▼
parameter_template_item
        │
        ▼
product_parameter_value
```

---

# Table 8.1

## parameter_group

---

### Table Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Parameter Group |
| Chinese Name   | 参数分组        |
| Table Name     | parameter_group |
| Domain         | Parameter       |
| Owner          | Platform        |
| Lifecycle      | Permanent       |

---

### Business Purpose

参数分组用于组织 Parameter Definition。

典型示例：

```
Basic Information

Optical

Probe

Imaging

Lighting

Measurement

Display

Communication

Power

Mechanical

Environment

Certification

Software

Package

Service

Extension

Custom
```

参数组仅用于：

逻辑组织。

不保存：

参数值。

---

### Relationships

Parent

```
None
```

Child

```
parameter_definition
```

Referenced By

```
parameter_template
```

---

### Field Specification

| Field         | Type         | Required | Description |
| ------------- | ------------ | -------- | ----------- |
| id            | UUID         | Yes      | Primary Key |
| group_code    | VARCHAR(64)  | Yes      | 参数组编码  |
| group_name_zh | VARCHAR(255) | Yes      | 中文名称    |
| group_name_en | VARCHAR(255) | No       | 英文名称    |
| description   | TEXT         | No       | 描述        |
| display_order | INTEGER      | Yes      | 排序        |
| status        | VARCHAR(32)  | Yes      | 状态        |
| version       | INTEGER      | Yes      | 乐观锁版本  |

继承：

Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Unique

```
UNIQUE(group_code)
```

Search

```
INDEX(group_name_zh)

INDEX(group_name_en)
```

---

### Reference Rules

Parameter Group：

不得：

直接引用 Product。

不得保存：

参数值。

---

### Delete Policy

Archive Only

Logical Delete

若存在：

```
parameter_definition
```

引用：

禁止删除。

---

### Repository Notes

Parameter Group 仅负责：

参数分类。

不是：

参数模板。

不是：

参数实例。

---

# Table 8.2

## parameter_definition

---

### Table Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Parameter Definition |
| Chinese Name   | 参数定义             |
| Table Name     | parameter_definition |
| Domain         | Parameter            |
| Owner          | Platform             |
| Lifecycle      | Permanent            |

---

### Business Purpose

Parameter Definition 定义：

平台中的每一个参数。

例如：

```
Probe Diameter

Probe Length

Resolution

Sensor

Battery Capacity

Depth Of Field

Operating Temperature

IP Rating

Weight
```

所有参数：

平台唯一。

不得：

重复定义。

---

### Relationships

Parent

```
parameter_group
```

Child

```
parameter_template_item

product_parameter_value
```

Referenced By

```
AI

Search

RFQ

Compare

Recommendation
```

---

### Field Specification

| Field             | Type         | Required | Description |
| ----------------- | ------------ | -------- | ----------- |
| id                | UUID         | Yes      | Primary Key |
| group_id          | UUID         | Yes      | 所属参数组  |
| parameter_code    | VARCHAR(64)  | Yes      | 参数编码    |
| parameter_name_zh | VARCHAR(255) | Yes      | 中文名称    |
| parameter_name_en | VARCHAR(255) | No       | 英文名称    |
| description       | TEXT         | No       | 参数说明    |
| value_type        | VARCHAR(32)  | Yes      | 数据类型    |
| unit              | VARCHAR(64)  | No       | 单位        |
| validation_rule   | TEXT         | No       | 校验规则    |
| default_value     | VARCHAR(255) | No       | 默认值      |
| searchable        | BOOLEAN      | Yes      | 是否可搜索  |
| comparable        | BOOLEAN      | Yes      | 是否可比较  |
| filterable        | BOOLEAN      | Yes      | 是否可筛选  |
| sortable          | BOOLEAN      | Yes      | 是否可排序  |
| ai_enabled        | BOOLEAN      | Yes      | AI是否启用  |
| required          | BOOLEAN      | Yes      | 是否必填    |
| display_order     | INTEGER      | Yes      | 排序        |
| status            | VARCHAR(32)  | Yes      | 状态        |
| version           | INTEGER      | Yes      | 乐观锁版本  |

统一继承：

Universal Audit Fields。

---

### Value Type

允许：

```
STRING

INTEGER

DECIMAL

BOOLEAN

DATE

ENUM

JSON
```

未来允许扩展。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Foreign Key

```
INDEX(group_id)
```

Unique

```
UNIQUE(parameter_code)
```

Search

```
INDEX(parameter_name_zh)

INDEX(parameter_name_en)
```

---

### Reference Rules

Product：

不得：

复制 Parameter Definition。

统一引用：

```
parameter_definition.id
```

---

### Lifecycle Rules

Parameter Definition：

平台统一维护。

发布后：

不得：

修改参数语义。

允许：

新增版本。

---

### Delete Policy

Archive Only

若：

```
parameter_template

product_parameter_value
```

仍引用：

禁止删除。

---

### Repository Notes

Parameter Definition 是：

整个 Repository 参数体系唯一来源。

AI、

搜索、

产品比较、

推荐系统

全部引用：

```
parameter_definition
```

不得：

维护：

第二套参数定义。

# Table 8.3

## parameter_template

---

### Table Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Parameter Template |
| Chinese Name   | 参数模板           |
| Table Name     | parameter_template |
| Domain         | Parameter          |
| Owner          | Platform           |
| Lifecycle      | Permanent          |
| Mutable        | Platform Only      |

---

### Business Purpose

Parameter Template 定义：

某一类产品应包含哪些参数。

Parameter Template 是：

产品参数标准。

例如：

工业电子内窥镜模板

↓

包含：

```
Probe Diameter

Probe Length

Sensor

Resolution

Depth Of Field

Field Of View

Battery Capacity

Working Time

Display

Video Format

Operating Temperature

Protection Level
```

一个模板：

允许：

几十至数百个参数。

---

### Relationships

Parent

```
None
```

Child

```
parameter_template_item
```

Referenced By

```
product_family

product_series

standard_product
```

---

### Field Specification

| Field                  | Type         | Required | Description  |
| ---------------------- | ------------ | -------- | ------------ |
| id                     | UUID         | Yes      | Primary Key  |
| template_code          | VARCHAR(64)  | Yes      | 模板编码     |
| template_name_zh       | VARCHAR(255) | Yes      | 中文名称     |
| template_name_en       | VARCHAR(255) | No       | 英文名称     |
| applicable_category_id | UUID         | No       | 适用一级分类 |
| applicable_family_id   | UUID         | No       | 默认产品族   |
| description            | TEXT         | No       | 模板说明     |
| display_order          | INTEGER      | Yes      | 排序         |
| workflow_state         | VARCHAR(32)  | Yes      | 生命周期状态 |
| status                 | VARCHAR(32)  | Yes      | 状态         |
| version                | INTEGER      | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Unique

```
UNIQUE(template_code)
```

Foreign Key

```
INDEX(applicable_category_id)

INDEX(applicable_family_id)
```

Search

```
INDEX(template_name_zh)

INDEX(template_name_en)
```

---

### Reference Rules

Template：

仅维护：

参数集合。

不得保存：

参数值。

---

### Lifecycle Rules

发布后：

允许：

新增 Parameter。

禁止：

改变模板业务语义。

---

### Delete Policy

Archive Only

若：

```
standard_product

product_family
```

仍引用：

禁止删除。

---

### Repository Notes

Template 是：

产品参数结构。

不是：

产品实例。

---

# Table 8.4

## parameter_template_item

---

### Table Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Parameter Template Item |
| Chinese Name   | 参数模板项              |
| Table Name     | parameter_template_item |
| Domain         | Parameter               |
| Owner          | Platform                |

---

### Business Purpose

维护：

Template

包含哪些 Parameter。

每条记录：

表示：

一个模板

↓

一个参数。

支持：

继承。

覆盖。

排序。

显示控制。

默认值。

是否必填。

---

### Relationships

Parent

```
parameter_template
```

Referenced Table

```
parameter_definition
```

---

### Field Specification

| Field         | Type         | Required | Description  |
| ------------- | ------------ | -------- | ------------ |
| id            | UUID         | Yes      | Primary Key  |
| template_id   | UUID         | Yes      | 所属模板     |
| parameter_id  | UUID         | Yes      | 参数定义     |
| display_order | INTEGER      | Yes      | 显示顺序     |
| required      | BOOLEAN      | Yes      | 是否必填     |
| readonly      | BOOLEAN      | Yes      | 是否只读     |
| visible       | BOOLEAN      | Yes      | 是否显示     |
| default_value | VARCHAR(255) | No       | 默认值       |
| inherit_flag  | BOOLEAN      | Yes      | 是否允许继承 |
| override_flag | BOOLEAN      | Yes      | 是否允许覆盖 |
| status        | VARCHAR(32)  | Yes      | 状态         |
| version       | INTEGER      | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Foreign Key

```
INDEX(template_id)

INDEX(parameter_id)
```

Composite Unique

```
UNIQUE(template_id, parameter_id)
```

---

### Repository Notes

Template Item：

定义：

模板结构。

不得保存：

产品参数值。

---

# Table 8.5

## product_parameter_value

---

### Table Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Product Parameter Value |
| Chinese Name   | 产品参数值              |
| Table Name     | product_parameter_value |
| Domain         | Parameter               |
| Owner          | Platform                |
| Lifecycle      | Revision Only           |

---

### Business Purpose

保存：

某一个 Product

某一个 Parameter

对应的实际参数值。

采用：

```
Product

+

Parameter

+

Value
```

模式。

例如：

```
VIS-600

↓

Probe Diameter

↓

6 mm
```

又例如：

```
VIS-600

↓

Battery Capacity

↓

9800 mAh
```

数据库：

每条记录：

仅保存：

一个参数值。

---

### Relationships

Parent

```
standard_product
```

Referenced Table

```
parameter_definition
```

Referenced By

```
Search

Compare

AI

Recommendation

RFQ
```

---

### Field Specification

| Field         | Type        | Required | Description                  |
| ------------- | ----------- | -------- | ---------------------------- |
| id            | UUID        | Yes      | Primary Key                  |
| product_id    | UUID        | Yes      | 产品                         |
| parameter_id  | UUID        | Yes      | 参数定义                     |
| value_string  | TEXT        | No       | 字符串值                     |
| value_number  | DECIMAL     | No       | 数值                         |
| value_boolean | BOOLEAN     | No       | 布尔值                       |
| value_date    | DATE        | No       | 日期值                       |
| value_json    | JSONB       | No       | JSON值                       |
| unit          | VARCHAR(64) | No       | 单位（展示用途）             |
| source        | VARCHAR(32) | Yes      | 来源（Manual / Import / AI） |
| status        | VARCHAR(32) | Yes      | 状态                         |
| version       | INTEGER     | Yes      | 乐观锁版本                   |

统一继承：

Universal Audit Fields。

---

### Value Rules

一个参数：

同一时间：

仅允许：

一个有效值。

实际值类型：

必须与：

```
parameter_definition.value_type
```

保持一致。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Foreign Key

```
INDEX(product_id)

INDEX(parameter_id)
```

Composite Unique

```
UNIQUE(product_id, parameter_id)
```

Search

```
GIN(value_json)
```

（适用于 JSONB 查询）

---

### Delete Policy

Revision Archive

逻辑删除。

保留历史版本。

---

### Repository Notes

平台统一采用：

```
Parameter Definition

+

Parameter Value
```

模型。

禁止：

在：

```
standard_product
```

增加：

大量参数字段（Wide Table）。

---

# Parameter Domain Constraints

## Rule 1

平台仅维护一套 Parameter Definition。

任何业务模块：

不得维护第二套参数定义。

---

## Rule 2

Template：

仅定义参数结构。

不得保存参数值。

---

## Rule 3

Product：

仅保存 Parameter Value。

不得复制 Parameter Definition。

---

## Rule 4

Parameter Value：

必须引用：

```
parameter_definition.id
```

不得保存：

参数名称。

参数编码。

参数说明。

---

## Rule 5

所有参数查询、

产品比较、

AI 检索、

RFQ 匹配、

推荐引擎：

统一基于：

```
product_parameter_value
```

实现。

---

# Parameter Domain Status

| Table                   | Status |
| ----------------------- | ------ |
| parameter_group         | Frozen |
| parameter_definition    | Frozen |
| parameter_template      | Frozen |
| parameter_template_item | Frozen |
| product_parameter_value | Frozen |

---

# Parameter Domain Summary

Domain：

Parameter

包含：

5 张核心数据表。

平台统一参数体系至此冻结（Frozen）。

---

# Part 9

# Capability Domain

---

## Domain Identity

| Item      | Value                |
| --------- | -------------------- |
| Domain    | Capability           |
| Owner     | Platform             |
| Lifecycle | Permanent            |
| Purpose   | 建立平台统一能力体系 |
| Mutable   | Platform Only        |

---

## Business Purpose

Capability 用于描述：

产品具备什么能力（Capability）。

例如：

```
360° Articulation

Dual Camera

Stereo Measurement

AI Recognition

High Temperature

Explosion Proof

IP68 Waterproof

Long Distance Transmission
```

Capability：

不是参数。

不是功能按钮。

属于：

产品能力标签（Capability Model）。

统一用于：

- AI 理解
- 搜索
- 推荐
- 产品比较
- RFQ 匹配
- Semantic Search

---

## Domain Structure

```
capability_definition
            │
            ▼
product_capability
```

---

# Table 9.1

## capability_definition

---

### Table Identity

| Item           | Value                 |
| -------------- | --------------------- |
| Canonical Name | Capability Definition |
| Chinese Name   | 能力定义              |
| Table Name     | capability_definition |
| Domain         | Capability            |
| Owner          | Platform              |
| Lifecycle      | Permanent             |

---

### Business Purpose

维护：

平台统一能力库。

每一个 Capability：

仅定义一次。

例如：

```
High Temperature

Explosion Proof

Dual Camera

Stereo Measurement

Infrared

Waterproof

AI Inspection

Remote Control
```

Capability：

允许：

被多个 Product 引用。

---

### Relationships

Parent

```
None
```

Child

```
product_capability
```

Referenced By

```
Search

Compare

AI

Recommendation
```

---

### Field Specification

| Field              | Type         | Required | Description |
| ------------------ | ------------ | -------- | ----------- |
| id                 | UUID         | Yes      | Primary Key |
| capability_code    | VARCHAR(64)  | Yes      | 能力编码    |
| capability_name_zh | VARCHAR(255) | Yes      | 中文名称    |
| capability_name_en | VARCHAR(255) | No       | 英文名称    |
| category           | VARCHAR(128) | No       | 能力分类    |
| description        | TEXT         | No       | 能力说明    |
| keywords           | TEXT         | No       | 检索关键词  |
| synonyms           | JSONB        | No       | 同义词      |
| ai_weight          | DECIMAL      | No       | AI 权重     |
| search_weight      | DECIMAL      | No       | 搜索权重    |
| display_order      | INTEGER      | Yes      | 排序        |
| status             | VARCHAR(32)  | Yes      | 状态        |
| version            | INTEGER      | Yes      | 乐观锁版本  |

统一继承：

Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Unique

```
UNIQUE(capability_code)
```

Search

```
INDEX(capability_name_zh)

INDEX(capability_name_en)

GIN(synonyms)
```

---

### Repository Notes

Capability：

平台统一维护。

禁止：

业务模块：

新增：

第二套 Capability。

---

# Table 9.2

## product_capability

---

### Table Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Product Capability |
| Chinese Name   | 产品能力           |
| Table Name     | product_capability |
| Domain         | Capability         |
| Owner          | Platform           |
| Lifecycle      | Revision Only      |

---

### Business Purpose

建立：

```
Product

↓

Capability
```

Mapping。

支持：

Many To Many。

一个 Product：

允许：

多个 Capability。

一个 Capability：

允许：

关联多个 Product。

---

### Relationships

Parent

```
standard_product
```

Referenced Table

```
capability_definition
```

---

### Field Specification

| Field            | Type        | Required | Description                  |
| ---------------- | ----------- | -------- | ---------------------------- |
| id               | UUID        | Yes      | Primary Key                  |
| product_id       | UUID        | Yes      | 产品                         |
| capability_id    | UUID        | Yes      | 能力                         |
| source           | VARCHAR(32) | Yes      | 来源（Manual / Import / AI） |
| confidence_score | DECIMAL     | No       | AI 识别置信度                |
| display_order    | INTEGER     | Yes      | 排序                         |
| status           | VARCHAR(32) | Yes      | 状态                         |
| version          | INTEGER     | Yes      | 乐观锁版本                   |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

INDEX(product_id)

INDEX(capability_id)

UNIQUE(product_id, capability_id)
```

---

### Constraints

Capability：

统一引用：

```
capability_definition
```

不得保存：

能力文本。

---

# Capability Domain Constraints

## Rule 1

Capability：

统一平台维护。

---

## Rule 2

Product：

仅保存 Mapping。

---

## Rule 3

Capability：

不得复制：

Parameter。

不得替代：

Feature。

---

## Rule 4

Semantic Search：

统一引用：

Capability。

---

# Capability Domain Status

| Table                 | Status |
| --------------------- | ------ |
| capability_definition | Frozen |
| product_capability    | Frozen |

---

# Part 10

# Feature Domain

---

## Domain Identity

| Item      | Value                |
| --------- | -------------------- |
| Domain    | Feature              |
| Owner     | Platform             |
| Lifecycle | Permanent            |
| Purpose   | 建立统一产品功能体系 |
| Mutable   | Platform Only        |

---

## Business Purpose

Feature：

描述：

产品具有哪些功能。

例如：

```
Photo

Video Recording

Freeze Image

Image Rotation

Zoom

Measurement

QR Recognition

WiFi Preview

OTA Upgrade

Remote Control
```

Feature：

主要用于：

- UI 展示
- 软件功能
- 产品说明
- AI 检索
- 产品比较

---

## Domain Structure

```
feature_definition
        │
        ▼
product_feature
```

---

# Table 10.1

## feature_definition

---

### Table Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Feature Definition |
| Chinese Name   | 功能定义           |
| Table Name     | feature_definition |
| Domain         | Feature            |

---

### Business Purpose

维护：

平台统一功能库。

所有 Feature：

平台唯一。

统一维护。

---

### Field Specification

| Field            | Type         | Required | Description  |
| ---------------- | ------------ | -------- | ------------ |
| id               | UUID         | Yes      | Primary Key  |
| feature_code     | VARCHAR(64)  | Yes      | 功能编码     |
| feature_name_zh  | VARCHAR(255) | Yes      | 中文名称     |
| feature_name_en  | VARCHAR(255) | No       | 英文名称     |
| category         | VARCHAR(128) | No       | 功能分类     |
| description      | TEXT         | No       | 功能说明     |
| software_related | BOOLEAN      | Yes      | 是否软件功能 |
| firmware_related | BOOLEAN      | Yes      | 是否固件功能 |
| display_order    | INTEGER      | Yes      | 排序         |
| status           | VARCHAR(32)  | Yes      | 状态         |
| version          | INTEGER      | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(feature_code)

INDEX(feature_name_zh)

INDEX(feature_name_en)
```

---

# Table 10.2

## product_feature

---

### Table Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Product Feature |
| Chinese Name   | 产品功能        |
| Table Name     | product_feature |
| Domain         | Feature         |

---

### Business Purpose

建立：

```
Product

↓

Feature
```

Mapping。

支持：

Many To Many。

支持：

软件版本。

许可证。

固件版本。

启用状态。

---

### Field Specification

| Field            | Type        | Required | Description    |
| ---------------- | ----------- | -------- | -------------- |
| id               | UUID        | Yes      | Primary Key    |
| product_id       | UUID        | Yes      | 产品           |
| feature_id       | UUID        | Yes      | 功能           |
| firmware_version | VARCHAR(64) | No       | 固件版本要求   |
| software_version | VARCHAR(64) | No       | 软件版本要求   |
| license_required | BOOLEAN     | Yes      | 是否需要许可证 |
| enabled          | BOOLEAN     | Yes      | 是否启用       |
| display_order    | INTEGER     | Yes      | 排序           |
| status           | VARCHAR(32) | Yes      | 状态           |
| version          | INTEGER     | Yes      | 乐观锁版本     |

统一继承：

Universal Audit Fields。

---

### Constraints

Feature：

统一引用：

```
feature_definition
```

禁止：

保存：

Feature 文本。

---

# Feature Domain Constraints

## Rule 1

Feature：

平台统一维护。

---

## Rule 2

Product：

统一采用：

Mapping。

---

## Rule 3

Capability ≠ Feature

Capability：

描述：

产品能力。

Feature：

描述：

产品功能。

不得混用。

---

# Feature Domain Status

| Table              | Status |
| ------------------ | ------ |
| feature_definition | Frozen |
| product_feature    | Frozen |

---

# Domain Summary

Capability Domain

```
2 Tables
```

Feature Domain

```
2 Tables
```

全部冻结（Frozen）。

---

# Part 11

# Organization Domain

---

## Domain Identity

| Item      | Value                                    |
| --------- | ---------------------------------------- |
| Domain    | Organization                             |
| Owner     | Platform                                 |
| Lifecycle | Permanent                                |
| Purpose   | 建立平台统一组织主体模型                 |
| Mutable   | Organization Administrator（受平台约束） |

---

## Business Purpose

Organization 表示：

平台中的业务主体。

包括：

```
Manufacturer

Brand Owner

Supplier

Distributor

Dealer

Service Provider

Platform Operator
```

Organization：

负责：

- 发布 Offer
- 管理企业信息
- 管理联系人
- 管理地址
- 管理企业附件
- 管理企业成员

Organization：

不拥有：

```
Product
```

所有 Product：

统一属于：

Platform Master Data。

---

## Repository Principle

平台采用：

```
Organization

↓

Offer

↓

Standard Product
```

禁止：

```
Organization

↓

Own Product
```

Organization：

不得：

维护：

产品参数。

产品能力。

产品功能。

---

## Domain Structure

```
organization
      │
      ├────────────┬──────────────┐
      ▼            ▼              ▼
organization_contact
organization_address
organization_attachment
```

---

# Table 11.1

## organization

---

### Table Identity

| Item           | Value        |
| -------------- | ------------ |
| Canonical Name | Organization |
| Chinese Name   | 组织         |
| Table Name     | organization |
| Domain         | Organization |
| Owner          | Platform     |
| Lifecycle      | Permanent    |

---

### Business Purpose

保存：

平台所有组织主体。

例如：

```
Olympus

Evident

Microvision

Waygate

某代理商

某经销商

某制造商
```

Organization：

是：

Offer

User

Workflow

权限体系

共同引用对象。

---

### Relationships

Parent

```
None
```

Child

```
organization_contact

organization_address

organization_attachment
```

Referenced By

```
offer

user

workflow_instance

audit_log

notification
```

---

### Field Specification

| Field                   | Type         | Required | Description  |
| ----------------------- | ------------ | -------- | ------------ |
| id                      | UUID         | Yes      | Primary Key  |
| organization_code       | VARCHAR(64)  | Yes      | 企业编码     |
| organization_name       | VARCHAR(255) | Yes      | 企业名称     |
| organization_short_name | VARCHAR(128) | No       | 企业简称     |
| organization_type       | VARCHAR(64)  | Yes      | 企业类型     |
| country_code            | VARCHAR(8)   | Yes      | 国家代码     |
| registration_no         | VARCHAR(128) | No       | 注册号       |
| tax_number              | VARCHAR(128) | No       | 税号         |
| website                 | VARCHAR(255) | No       | 官网         |
| email                   | VARCHAR(255) | No       | 官方邮箱     |
| phone                   | VARCHAR(64)  | No       | 官方电话     |
| logo_file_id            | UUID         | No       | Logo 文件    |
| introduction            | TEXT         | No       | 企业简介     |
| certification_status    | VARCHAR(32)  | Yes      | 认证状态     |
| workflow_state          | VARCHAR(32)  | Yes      | 生命周期状态 |
| status                  | VARCHAR(32)  | Yes      | 状态         |
| version                 | INTEGER      | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

Primary Key

```
PRIMARY KEY(id)
```

Unique

```
UNIQUE(organization_code)
```

Business Index

```
INDEX(organization_name)

INDEX(organization_short_name)

INDEX(country_code)

INDEX(organization_type)
```

---

### Reference Rules

Logo：

统一引用：

```
file_object.id
```

Country：

统一引用：

Dictionary。

不得保存：

国家名称。

---

### Lifecycle Rules

创建：

Platform

审核：

Workflow。

发布：

Approved。

停用：

Logical Disable。

---

### Delete Policy

Archive Only

若：

Offer

User

Workflow

仍引用：

禁止删除。

---

### Repository Notes

Organization：

仅保存：

企业主体信息。

不得：

保存：

产品。

价格。

库存。

报价。

---

# Table 11.2

## organization_contact

---

### Table Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Organization Contact |
| Chinese Name   | 企业联系人           |
| Table Name     | organization_contact |

---

### Business Purpose

维护：

企业联系人。

支持：

```
Sales

Marketing

Engineer

After-sales

Finance

Purchasing

Manager
```

允许：

一个企业：

多个联系人。

---

### Relationships

Parent

```
organization
```

Referenced By

```
offer

rfq

workflow
```

---

### Field Specification

| Field           | Type         | Required | Description    |
| --------------- | ------------ | -------- | -------------- |
| id              | UUID         | Yes      | Primary Key    |
| organization_id | UUID         | Yes      | 所属企业       |
| contact_name    | VARCHAR(128) | Yes      | 联系人姓名     |
| department      | VARCHAR(128) | No       | 部门           |
| job_title       | VARCHAR(128) | No       | 职位           |
| mobile          | VARCHAR(64)  | No       | 手机           |
| telephone       | VARCHAR(64)  | No       | 电话           |
| email           | VARCHAR(255) | No       | 邮箱           |
| wechat          | VARCHAR(128) | No       | 微信           |
| is_primary      | BOOLEAN      | Yes      | 是否默认联系人 |
| remark          | TEXT         | No       | 备注           |
| status          | VARCHAR(32)  | Yes      | 状态           |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

INDEX(organization_id)

INDEX(contact_name)

INDEX(email)

INDEX(mobile)
```

---

### Constraints

一个 Organization：

允许：

多个联系人。

允许：

一个默认联系人。

---

# Table 11.3

## organization_address

---

### Table Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Organization Address |
| Chinese Name   | 企业地址             |
| Table Name     | organization_address |

---

### Business Purpose

保存：

企业地址。

支持：

```
Head Office

Factory

Warehouse

Branch

Service Center
```

允许：

多个地址。

---

### Field Specification

| Field           | Type         | Required | Description |
| --------------- | ------------ | -------- | ----------- |
| id              | UUID         | Yes      | Primary Key |
| organization_id | UUID         | Yes      | 企业        |
| address_type    | VARCHAR(64)  | Yes      | 地址类型    |
| country_code    | VARCHAR(8)   | Yes      | 国家        |
| province        | VARCHAR(128) | No       | 省          |
| city            | VARCHAR(128) | No       | 市          |
| district        | VARCHAR(128) | No       | 区县        |
| postal_code     | VARCHAR(32)  | No       | 邮编        |
| address_line    | TEXT         | Yes      | 详细地址    |
| is_default      | BOOLEAN      | Yes      | 默认地址    |
| status          | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

国家：

统一引用：

Dictionary。

一个 Organization：

允许：

多个地址。

---

# Table 11.4

## organization_attachment

---

### Table Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Organization Attachment |
| Chinese Name   | 企业附件                |
| Table Name     | organization_attachment |

---

### Business Purpose

关联：

```
Business License

ISO Certificate

Authorization

Quality Certificate

Company Profile

Catalog

Other Documents
```

统一引用：

```
file_object
```

---

### Field Specification

| Field           | Type        | Required | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | UUID        | Yes      | Primary Key |
| organization_id | UUID        | Yes      | 企业        |
| file_id         | UUID        | Yes      | 文件对象    |
| attachment_type | VARCHAR(64) | Yes      | 附件类型    |
| description     | TEXT        | No       | 描述        |
| display_order   | INTEGER     | Yes      | 排序        |
| status          | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

禁止：

保存：

OSS URL。

文件路径。

统一引用：

```
file_object.id
```

---

# Organization Domain Constraints

## Rule 1

Organization：

不得拥有：

Product。

---

## Rule 2

Offer：

是：

Organization

与

Standard Product

唯一关联。

---

## Rule 3

联系人、

地址、

附件：

全部属于：

Organization。

---

## Rule 4

企业附件：

统一引用：

File Domain。

---

## Rule 5

企业类型、

国家、

认证状态：

统一引用：

Dictionary。

---

# Organization Domain Status

| Table                   | Status |
| ----------------------- | ------ |
| organization            | Frozen |
| organization_contact    | Frozen |
| organization_address    | Frozen |
| organization_attachment | Frozen |

---

# Organization Domain Summary

Organization Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 12

# Offer Domain

---

## Domain Identity

| Item      | Value                              |
| --------- | ---------------------------------- |
| Domain    | Offer                              |
| Owner     | Organization                       |
| Lifecycle | Business Data                      |
| Purpose   | 建立组织与标准产品之间唯一商业关联 |
| Mutable   | Organization Administrator         |

---

## Business Purpose

Offer 表示：

Organization

针对

Standard Product

发布的一份商业供给。

Offer 保存：

- 是否销售
- 销售区域
- 价格
- 库存
- MOQ
- Lead Time
- 服务能力
- 商业附件

Offer：

不保存：

- 产品参数
- 产品能力
- 产品功能
- 产品分类

全部引用：

Platform Product。

---

## Repository Principle

平台统一采用：

```
Organization

↓

Offer

↓

Standard Product
```

一个 Product：

允许：

多个 Offer。

例如：

```
VIS600

↓

Offer A

↓

中国总代理

Offer B

↓

欧洲总代理

Offer C

↓

OEM 工厂
```

---

## Domain Structure

```
organization
      │
      ▼
offer
 │   │   │   │
 ▼   ▼   ▼   ▼
offer_price
offer_inventory
offer_service
offer_attachment
```

---

# Table 12.1

## offer

---

### Table Identity

| Item           | Value         |
| -------------- | ------------- |
| Canonical Name | Offer         |
| Chinese Name   | 产品供给      |
| Table Name     | offer         |
| Domain         | Offer         |
| Owner          | Organization  |
| Lifecycle      | Business Data |

---

### Business Purpose

Offer 是：

Organization

销售

Standard Product

唯一商业实体。

Offer：

建立：

```
Organization

↓

Standard Product
```

之间关系。

---

### Relationships

Parent

```
organization
```

Referenced Table

```
standard_product
```

Child

```
offer_price

offer_inventory

offer_service

offer_attachment
```

Referenced By

```
rfq_quotation

demand_recommendation

workflow_instance
```

---

### Field Specification

| Field                   | Type         | Required | Description  |
| ----------------------- | ------------ | -------- | ------------ |
| id                      | UUID         | Yes      | Primary Key  |
| offer_code              | VARCHAR(64)  | Yes      | Offer 编号   |
| organization_id         | UUID         | Yes      | 所属组织     |
| product_id              | UUID         | Yes      | 标准产品     |
| offer_name              | VARCHAR(255) | No       | 商业名称     |
| sales_region            | VARCHAR(255) | No       | 销售区域     |
| minimum_order_quantity  | DECIMAL      | No       | MOQ          |
| lead_time_days          | INTEGER      | No       | 交货周期     |
| oem_supported           | BOOLEAN      | Yes      | 是否支持 OEM |
| odm_supported           | BOOLEAN      | Yes      | 是否支持 ODM |
| customization_supported | BOOLEAN      | Yes      | 是否支持定制 |
| recommended             | BOOLEAN      | Yes      | 是否推荐     |
| workflow_state          | VARCHAR(32)  | Yes      | 生命周期     |
| status                  | VARCHAR(32)  | Yes      | 状态         |
| version                 | INTEGER      | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(offer_code)

INDEX(organization_id)

INDEX(product_id)

INDEX(status)

INDEX(workflow_state)
```

---

### Constraints

Offer：

必须引用：

```
organization
```

及：

```
standard_product
```

不得：

保存：

产品参数。

---

### Lifecycle Rules

Draft

↓

Submitted

↓

Approved

↓

Published

↓

Disabled

↓

Archived

---

### Delete Policy

Archive Only

若：

RFQ

Workflow

Quotation

仍引用：

禁止删除。

---

# Table 12.2

## offer_price

---

### Business Purpose

维护：

Offer

价格体系。

支持：

```
Market Price

Dealer Price

Distributor Price

VIP Price

Project Price
```

价格：

采用：

版本管理。

---

### Field Specification

| Field         | Type          | Required | Description |
| ------------- | ------------- | -------- | ----------- |
| id            | UUID          | Yes      | Primary Key |
| offer_id      | UUID          | Yes      | Offer       |
| price_type    | VARCHAR(32)   | Yes      | 价格类型    |
| currency_code | VARCHAR(8)    | Yes      | 币种        |
| unit_price    | DECIMAL(18,4) | Yes      | 单价        |
| valid_from    | TIMESTAMP     | No       | 生效时间    |
| valid_to      | TIMESTAMP     | No       | 失效时间    |
| status        | VARCHAR(32)   | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

币种：

统一引用：

Dictionary。

允许：

一个 Offer：

多个价格版本。

---

# Table 12.3

## offer_inventory

---

### Business Purpose

维护：

库存信息。

包括：

```
Available Quantity

Reserved Quantity

Safety Stock

Warehouse

Update Time
```

库存：

属于：

Offer。

不是：

Product。

---

### Field Specification

| Field                | Type         | Required | Description |
| -------------------- | ------------ | -------- | ----------- |
| id                   | UUID         | Yes      | Primary Key |
| offer_id             | UUID         | Yes      | Offer       |
| warehouse_name       | VARCHAR(255) | No       | 仓库        |
| available_quantity   | DECIMAL      | Yes      | 可售库存    |
| reserved_quantity    | DECIMAL      | No       | 已预留库存  |
| safety_stock         | DECIMAL      | No       | 安全库存    |
| inventory_updated_at | TIMESTAMP    | Yes      | 更新时间    |
| status               | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

# Table 12.4

## offer_service

---

### Business Purpose

维护：

售后服务能力。

例如：

```
Warranty

Maintenance

Training

Remote Support

On-site Service

Upgrade

Calibration
```

---

### Field Specification

| Field              | Type        | Required | Description |
| ------------------ | ----------- | -------- | ----------- |
| id                 | UUID        | Yes      | Primary Key |
| offer_id           | UUID        | Yes      | Offer       |
| warranty_month     | INTEGER     | No       | 质保（月）  |
| remote_support     | BOOLEAN     | Yes      | 远程支持    |
| onsite_service     | BOOLEAN     | Yes      | 上门服务    |
| training_supported | BOOLEAN     | Yes      | 培训支持    |
| upgrade_supported  | BOOLEAN     | Yes      | 升级支持    |
| remark             | TEXT        | No       | 服务说明    |
| status             | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

# Table 12.5

## offer_attachment

---

### Business Purpose

关联：

```
Quotation

Catalog

Datasheet

Video

Certificate

Case Study

Other Documents
```

统一引用：

```
file_object
```

---

### Field Specification

| Field           | Type        | Required | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | UUID        | Yes      | Primary Key |
| offer_id        | UUID        | Yes      | Offer       |
| file_id         | UUID        | Yes      | 文件对象    |
| attachment_type | VARCHAR(64) | Yes      | 类型        |
| description     | TEXT        | No       | 描述        |
| display_order   | INTEGER     | Yes      | 排序        |
| status          | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

# Offer Domain Constraints

## Rule 1

Offer：

不得拥有：

Product。

仅引用：

```
standard_product
```

---

## Rule 2

价格、

库存、

服务、

附件：

全部属于：

Offer。

---

## Rule 3

商业信息：

不得写入：

Product。

---

## Rule 4

所有附件：

统一引用：

```
file_object
```

---

## Rule 5

Offer：

允许：

多个版本。

统一采用：

Revision 管理。

---

# Offer Domain Status

| Table            | Status |
| ---------------- | ------ |
| offer            | Frozen |
| offer_price      | Frozen |
| offer_inventory  | Frozen |
| offer_service    | Frozen |
| offer_attachment | Frozen |

---

# Offer Domain Summary

Offer Domain

包含：

```
5 Tables
```

全部冻结（Frozen）。

---

# Part 13

# Knowledge Domain

---

## Domain Identity

| Item      | Value                           |
| --------- | ------------------------------- |
| Domain    | Knowledge                       |
| Owner     | Platform                        |
| Lifecycle | Permanent                       |
| Purpose   | 建立平台统一知识资产模型        |
| Mutable   | Platform Editor / Administrator |

---

## Business Purpose

Knowledge 用于沉淀平台知识资产。

包括：

```
Product Manual

Application Guide

Inspection Solution

Case Study

FAQ

Technical Article

Maintenance Guide

Training Material

Troubleshooting

Industry Standard Interpretation
```

Knowledge：

统一支持：

- AI（RAG）
- Search
- Product
- Demand
- RFQ
- Recommendation

---

## Repository Principle

知识：

独立存在。

通过 Mapping：

关联：

```
Product

Offer（可扩展）

Demand（可扩展）
```

禁止：

复制：

知识内容。

---

## Domain Structure

```
knowledge
      │
      ├──────────────┐
      ▼              ▼
knowledge_attachment
product_knowledge_mapping
```

---

# Table 13.1

## knowledge

---

### Table Identity

| Item           | Value     |
| -------------- | --------- |
| Canonical Name | Knowledge |
| Chinese Name   | 知识      |
| Table Name     | knowledge |
| Domain         | Knowledge |
| Owner          | Platform  |
| Lifecycle      | Permanent |

---

### Business Purpose

维护：

平台知识主体。

支持：

```
产品说明

操作教程

检测方案

故障处理

案例分享

技术文章

培训资料

行业标准解析
```

Knowledge：

作为：

平台统一知识入口。

---

### Relationships

Parent

```
None
```

Child

```
knowledge_attachment

product_knowledge_mapping
```

Referenced By

```
AI

Search

Workflow

Recommendation
```

---

### Field Specification

| Field          | Type         | Required | Description            |
| -------------- | ------------ | -------- | ---------------------- |
| id             | UUID         | Yes      | Primary Key            |
| knowledge_code | VARCHAR(64)  | Yes      | 知识编号               |
| title          | VARCHAR(255) | Yes      | 标题                   |
| knowledge_type | VARCHAR(64)  | Yes      | 知识类型               |
| summary        | TEXT         | No       | 摘要                   |
| content        | TEXT         | No       | 正文（可为空，仅附件） |
| language_code  | VARCHAR(16)  | Yes      | 语言                   |
| keywords       | TEXT         | No       | 检索关键词             |
| source         | VARCHAR(64)  | No       | 来源                   |
| author         | VARCHAR(128) | No       | 作者                   |
| publish_time   | TIMESTAMP    | No       | 发布时间               |
| workflow_state | VARCHAR(32)  | Yes      | 生命周期               |
| status         | VARCHAR(32)  | Yes      | 状态                   |
| version        | INTEGER      | Yes      | 乐观锁版本             |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(knowledge_code)

INDEX(title)

INDEX(knowledge_type)

INDEX(language_code)

GIN(keywords)
```

---

### Constraints

Knowledge：

不得：

保存：

Organization。

价格。

库存。

商业信息。

---

### Lifecycle Rules

Draft

↓

Review

↓

Approved

↓

Published

↓

Archived

---

### Delete Policy

Version Archive

逻辑删除。

保留历史版本。

---

# Table 13.2

## knowledge_attachment

---

### Table Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Knowledge Attachment |
| Chinese Name   | 知识附件             |
| Table Name     | knowledge_attachment |

---

### Business Purpose

维护：

Knowledge

关联附件。

包括：

```
PDF

Word

Excel

PPT

Image

Video

Audio

ZIP

CAD

Other Documents
```

统一引用：

```
file_object
```

---

### Relationships

Parent

```
knowledge
```

Referenced Table

```
file_object
```

---

### Field Specification

| Field           | Type        | Required | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | UUID        | Yes      | Primary Key |
| knowledge_id    | UUID        | Yes      | 所属知识    |
| file_id         | UUID        | Yes      | 文件对象    |
| attachment_type | VARCHAR(64) | Yes      | 附件类型    |
| description     | TEXT        | No       | 描述        |
| display_order   | INTEGER     | Yes      | 排序        |
| status          | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

禁止：

保存：

文件路径。

OSS URL。

统一引用：

```
file_object.id
```

---

# Table 13.3

## product_knowledge_mapping

---

### Table Identity

| Item           | Value                     |
| -------------- | ------------------------- |
| Canonical Name | Product Knowledge Mapping |
| Chinese Name   | 产品知识关联              |
| Table Name     | product_knowledge_mapping |

---

### Business Purpose

建立：

```
Standard Product

↓

Knowledge
```

多对多关联。

支持：

一个 Product：

关联：

多个 Knowledge。

一个 Knowledge：

关联：

多个 Product。

---

### Relationships

Parent

```
standard_product
```

Referenced Table

```
knowledge
```

---

### Field Specification

| Field         | Type        | Required | Description |
| ------------- | ----------- | -------- | ----------- |
| id            | UUID        | Yes      | Primary Key |
| product_id    | UUID        | Yes      | 标准产品    |
| knowledge_id  | UUID        | Yes      | 知识对象    |
| relation_type | VARCHAR(64) | Yes      | 关联类型    |
| priority      | INTEGER     | Yes      | 优先级      |
| remark        | TEXT        | No       | 备注        |
| status        | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

INDEX(product_id)

INDEX(knowledge_id)

UNIQUE(product_id, knowledge_id)
```

---

### Constraints

Knowledge：

统一引用。

不得：

复制：

Knowledge Content。

---

# Knowledge Domain Constraints

## Rule 1

Knowledge：

属于：

Platform。

---

## Rule 2

Knowledge：

不得保存：

Offer。

库存。

报价。

Organization。

---

## Rule 3

所有附件：

统一引用：

```
file_object
```

---

## Rule 4

Product：

统一采用：

Mapping。

不得：

保存：

Knowledge。

---

## Rule 5

AI：

统一引用：

Knowledge。

不得：

复制：

知识正文。

---

# Knowledge Domain Status

| Table                     | Status |
| ------------------------- | ------ |
| knowledge                 | Frozen |
| knowledge_attachment      | Frozen |
| product_knowledge_mapping | Frozen |

---

# Knowledge Domain Summary

Knowledge Domain

包含：

```
3 Tables
```

全部冻结（Frozen）。

---

# Part 14

# Demand Domain

---

## Domain Identity

| Item      | Value                            |
| --------- | -------------------------------- |
| Domain    | Demand                           |
| Owner     | Platform                         |
| Lifecycle | Business Data                    |
| Purpose   | 建立统一需求管理模型             |
| Mutable   | Demand Owner（受 Workflow 控制） |

---

## Business Purpose

Demand 用于记录：

用户真实采购或检测需求。

典型场景：

```
航空发动机检测

汽车铸件检测

石化管道检测

风电叶片检测

铁路车辆检测

核电设备检测
```

Demand：

统一作为：

- AI 推荐
- Product 匹配
- Offer 推荐
- RFQ 生成
- Workflow 流转

的输入数据。

---

## Repository Principle

Demand：

仅保存：

需求事实。

禁止保存：

- Offer
- Price
- Supplier
- Order

商业信息。

---

## Domain Structure

```
demand
    │
    ├──────────────┬──────────────────┐
    ▼              ▼                  ▼
demand_item
demand_attachment
demand_recommendation
```

---

# Table 14.1

## demand

---

### Table Identity

| Item           | Value         |
| -------------- | ------------- |
| Canonical Name | Demand        |
| Chinese Name   | 需求          |
| Table Name     | demand        |
| Domain         | Demand        |
| Owner          | Platform      |
| Lifecycle      | Business Data |

---

### Business Purpose

保存：

需求主信息。

包括：

- 标题
- 行业
- 应用场景
- 检测对象
- 数量
- 预算
- 地区
- 交付要求
- AI 分析状态
- Workflow 状态

---

### Relationships

Parent

```
None
```

Child

```
demand_item

demand_attachment

demand_recommendation
```

Referenced By

```
workflow_instance

notification

audit_log
```

---

### Field Specification

| Field                  | Type          | Required | Description  |
| ---------------------- | ------------- | -------- | ------------ |
| id                     | UUID          | Yes      | Primary Key  |
| demand_code            | VARCHAR(64)   | Yes      | 需求编号     |
| title                  | VARCHAR(255)  | Yes      | 标题         |
| industry_code          | VARCHAR(64)   | Yes      | 行业         |
| application_scene      | VARCHAR(255)  | No       | 应用场景     |
| inspection_target      | TEXT          | No       | 检测对象     |
| expected_quantity      | DECIMAL       | No       | 数量         |
| budget_amount          | DECIMAL(18,2) | No       | 预算         |
| currency_code          | VARCHAR(8)    | No       | 币种         |
| delivery_region        | VARCHAR(128)  | No       | 交付地区     |
| expected_delivery_date | DATE          | No       | 期望交付日期 |
| ai_analysis_status     | VARCHAR(32)   | Yes      | AI 分析状态  |
| workflow_state         | VARCHAR(32)   | Yes      | 生命周期     |
| status                 | VARCHAR(32)   | Yes      | 状态         |
| version                | INTEGER       | Yes      | 乐观锁版本   |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(demand_code)

INDEX(industry_code)

INDEX(workflow_state)

INDEX(status)
```

---

### Lifecycle Rules

Draft

↓

Submitted

↓

AI Analysis

↓

Recommendation Ready

↓

RFQ Generated（可选）

↓

Completed

↓

Archived

---

### Delete Policy

Archive Only

若：

RFQ

Workflow

Recommendation

仍引用：

禁止删除。

---

# Table 14.2

## demand_item

---

### Table Identity

| Item           | Value       |
| -------------- | ----------- |
| Canonical Name | Demand Item |
| Chinese Name   | 需求项      |
| Table Name     | demand_item |

---

### Business Purpose

支持：

一个 Demand：

拆分多个检测对象。

例如：

```
航空发动机检测

↓

压气机

↓

燃烧室

↓

叶片
```

每个 Item：

允许：

独立推荐产品。

---

### Relationships

Parent

```
demand
```

---

### Field Specification

| Field                 | Type         | Required | Description |
| --------------------- | ------------ | -------- | ----------- |
| id                    | UUID         | Yes      | Primary Key |
| demand_id             | UUID         | Yes      | 所属需求    |
| item_name             | VARCHAR(255) | Yes      | 需求项名称  |
| inspection_object     | TEXT         | No       | 检测对象    |
| quantity              | DECIMAL      | No       | 数量        |
| technical_requirement | TEXT         | No       | 技术要求    |
| priority              | INTEGER      | Yes      | 优先级      |
| status                | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

一个 Demand：

允许：

多个 Item。

---

# Table 14.3

## demand_attachment

---

### Table Identity

| Item           | Value             |
| -------------- | ----------------- |
| Canonical Name | Demand Attachment |
| Chinese Name   | 需求附件          |
| Table Name     | demand_attachment |

---

### Business Purpose

关联：

```
Image

PDF

CAD

STEP

Word

Excel

ZIP

Video
```

统一引用：

```
file_object
```

---

### Field Specification

| Field           | Type        | Required | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | UUID        | Yes      | Primary Key |
| demand_id       | UUID        | Yes      | 所属需求    |
| file_id         | UUID        | Yes      | 文件对象    |
| attachment_type | VARCHAR(64) | Yes      | 类型        |
| description     | TEXT        | No       | 描述        |
| display_order   | INTEGER     | Yes      | 排序        |
| status          | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

禁止：

保存：

文件路径。

统一引用：

```
file_object.id
```

---

# Table 14.4

## demand_recommendation

---

### Table Identity

| Item           | Value                 |
| -------------- | --------------------- |
| Canonical Name | Demand Recommendation |
| Chinese Name   | 需求推荐              |
| Table Name     | demand_recommendation |

---

### Business Purpose

保存：

AI 推荐结果。

包括：

- 推荐 Product
- 推荐 Offer
- 推荐理由
- 推荐分数
- 置信度
- 推荐模型版本

---

### Relationships

Parent

```
demand
```

Referenced Table

```
standard_product

offer
```

---

### Field Specification

| Field                 | Type         | Required | Description |
| --------------------- | ------------ | -------- | ----------- |
| id                    | UUID         | Yes      | Primary Key |
| demand_id             | UUID         | Yes      | 所属需求    |
| product_id            | UUID         | Yes      | 推荐产品    |
| offer_id              | UUID         | No       | 推荐供给    |
| recommendation_reason | TEXT         | No       | 推荐理由    |
| score                 | DECIMAL(5,2) | Yes      | 综合评分    |
| confidence            | DECIMAL(5,2) | Yes      | AI 置信度   |
| ranking               | INTEGER      | Yes      | 排名        |
| model_version         | VARCHAR(64)  | No       | AI 模型版本 |
| status                | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

INDEX(demand_id)

INDEX(product_id)

INDEX(offer_id)

INDEX(score)
```

---

### Constraints

AI：

仅生成：

Recommendation。

不得：

修改：

Demand。

---

# Demand Domain Constraints

## Rule 1

Demand：

仅保存需求事实。

---

## Rule 2

供应商、

报价、

订单：

不得：

保存在 Demand。

---

## Rule 3

AI：

统一生成：

Recommendation。

---

## Rule 4

所有附件：

统一引用：

```
file_object
```

---

## Rule 5

Demand：

允许：

生成多个 RFQ。

但：

RFQ：

不得：

修改 Demand 原始数据。

---

# Demand Domain Status

| Table                 | Status |
| --------------------- | ------ |
| demand                | Frozen |
| demand_item           | Frozen |
| demand_attachment     | Frozen |
| demand_recommendation | Frozen |

---

# Demand Domain Summary

Demand Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 15

# RFQ Domain

---

## Domain Identity

| Item      | Value                |
| --------- | -------------------- |
| Domain    | RFQ                  |
| Owner     | Platform             |
| Lifecycle | Business Data        |
| Purpose   | 建立统一询价管理模型 |
| Mutable   | Workflow Controlled  |

---

## Business Purpose

RFQ（Request For Quotation）

表示：

平台发起的一次询价。

RFQ：

来源可以是：

```
Demand

Manual Create

AI Generate

Import
```

RFQ：

用于：

邀请多个 Organization

针对同一需求

提交报价。

---

## Repository Principle

RFQ：

负责：

商业询价。

不负责：

订单。

付款。

合同。

发货。

RFQ：

结束后：

可生成：

Order（后续 Domain）。

---

## Domain Structure

```
rfq
   │
   ├─────────────┬─────────────────┐
   ▼             ▼                 ▼
rfq_item
rfq_attachment
rfq_quotation
```

---

# Table 15.1

## rfq

---

### Table Identity

| Item           | Value         |
| -------------- | ------------- |
| Canonical Name | RFQ           |
| Chinese Name   | 询价单        |
| Table Name     | rfq           |
| Domain         | RFQ           |
| Owner          | Platform      |
| Lifecycle      | Business Data |

---

### Business Purpose

维护：

RFQ 主单。

包括：

```
来源

标题

截止时间

采购地区

状态

Workflow
```

支持：

多个报价。

---

### Relationships

Parent

```
None
```

Child

```
rfq_item

rfq_attachment

rfq_quotation
```

Referenced By

```
workflow_instance

notification

audit_log
```

---

### Field Specification

| Field              | Type         | Required | Description |
| ------------------ | ------------ | -------- | ----------- |
| id                 | UUID         | Yes      | Primary Key |
| rfq_code           | VARCHAR(64)  | Yes      | RFQ 编号    |
| demand_id          | UUID         | No       | 来源需求    |
| title              | VARCHAR(255) | Yes      | 标题        |
| source_type        | VARCHAR(32)  | Yes      | 来源类型    |
| quotation_deadline | TIMESTAMP    | Yes      | 截止时间    |
| delivery_region    | VARCHAR(128) | No       | 交付地区    |
| workflow_state     | VARCHAR(32)  | Yes      | 生命周期    |
| status             | VARCHAR(32)  | Yes      | 状态        |
| version            | INTEGER      | Yes      | 乐观锁版本  |

统一继承：

Universal Audit Fields。

---

### Lifecycle Rules

```
Draft

↓

Published

↓

Quoting

↓

Quoted

↓

Closed

↓

Archived
```

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(rfq_code)

INDEX(demand_id)

INDEX(workflow_state)

INDEX(status)
```

---

### Delete Policy

Archive Only

若：

Quotation

仍存在：

禁止删除。

---

# Table 15.2

## rfq_item

---

### Table Identity

| Item           | Value    |
| -------------- | -------- |
| Canonical Name | RFQ Item |
| Chinese Name   | 询价项   |
| Table Name     | rfq_item |

---

### Business Purpose

一个 RFQ：

允许：

多个询价产品。

例如：

```
Item 1

↓

工业电子内窥镜

Item 2

↓

测量探头

Item 3

↓

附件
```

统一引用：

```
standard_product
```

---

### Relationships

Parent

```
rfq
```

Referenced Table

```
standard_product
```

---

### Field Specification

| Field                 | Type        | Required | Description |
| --------------------- | ----------- | -------- | ----------- |
| id                    | UUID        | Yes      | Primary Key |
| rfq_id                | UUID        | Yes      | 所属 RFQ    |
| product_id            | UUID        | Yes      | 标准产品    |
| quantity              | DECIMAL     | Yes      | 数量        |
| expected_delivery     | DATE        | No       | 交付日期    |
| technical_requirement | TEXT        | No       | 技术要求    |
| remark                | TEXT        | No       | 备注        |
| status                | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

Product：

统一引用：

```
standard_product
```

不得复制：

产品信息。

---

# Table 15.3

## rfq_attachment

---

### Table Identity

| Item           | Value          |
| -------------- | -------------- |
| Canonical Name | RFQ Attachment |
| Chinese Name   | RFQ 附件       |
| Table Name     | rfq_attachment |

---

### Business Purpose

关联：

```
Drawing

Specification

CAD

Image

PDF

Agreement

Other Documents
```

统一引用：

```
file_object
```

---

### Field Specification

| Field           | Type        | Required | Description |
| --------------- | ----------- | -------- | ----------- |
| id              | UUID        | Yes      | Primary Key |
| rfq_id          | UUID        | Yes      | 所属 RFQ    |
| file_id         | UUID        | Yes      | 文件对象    |
| attachment_type | VARCHAR(64) | Yes      | 类型        |
| description     | TEXT        | No       | 描述        |
| display_order   | INTEGER     | Yes      | 排序        |
| status          | VARCHAR(32) | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

禁止：

保存：

OSS URL。

文件路径。

---

# Table 15.4

## rfq_quotation

---

### Table Identity

| Item           | Value         |
| -------------- | ------------- |
| Canonical Name | RFQ Quotation |
| Chinese Name   | 报价          |
| Table Name     | rfq_quotation |

---

### Business Purpose

保存：

供应商报价。

包括：

```
Offer

Price

Currency

Lead Time

Remark

Quotation Time
```

一个 RFQ：

允许：

多个报价。

---

### Relationships

Parent

```
rfq
```

Referenced Table

```
offer
```

---

### Field Specification

| Field            | Type          | Required | Description |
| ---------------- | ------------- | -------- | ----------- |
| id               | UUID          | Yes      | Primary Key |
| rfq_id           | UUID          | Yes      | 所属 RFQ    |
| offer_id         | UUID          | Yes      | 引用 Offer  |
| quoted_price     | DECIMAL(18,2) | Yes      | 报价        |
| currency_code    | VARCHAR(8)    | Yes      | 币种        |
| lead_time_days   | INTEGER       | No       | 交期        |
| quotation_remark | TEXT          | No       | 报价说明    |
| quotation_time   | TIMESTAMP     | Yes      | 报价时间    |
| status           | VARCHAR(32)   | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

报价：

统一引用：

Offer。

不得：

复制：

Offer 数据。

---

# RFQ Domain Constraints

## Rule 1

RFQ：

统一来源：

Demand

或：

人工创建。

---

## Rule 2

RFQ：

不得保存：

Product 参数。

统一引用：

```
standard_product
```

---

## Rule 3

报价：

统一引用：

Offer。

---

## Rule 4

所有附件：

统一引用：

```
file_object
```

---

## Rule 5

RFQ：

结束后：

可生成：

Order。

RFQ：

本身：

不是订单。

---

# RFQ Domain Status

| Table          | Status |
| -------------- | ------ |
| rfq            | Frozen |
| rfq_item       | Frozen |
| rfq_attachment | Frozen |
| rfq_quotation  | Frozen |

---

# RFQ Domain Summary

RFQ Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 16

# Workflow Domain

---

## Domain Identity

| Item      | Value                  |
| --------- | ---------------------- |
| Domain    | Workflow               |
| Owner     | Platform               |
| Lifecycle | Infrastructure         |
| Purpose   | 建立统一流程管理模型   |
| Mutable   | Platform Administrator |

---

## Business Purpose

Workflow：

统一管理：

平台所有审批流程。

包括：

```
Product Publish

Offer Publish

Knowledge Publish

Demand Review

RFQ Review

Organization Certification

Future Business Approval
```

Workflow：

作为：

所有业务：

统一审批入口。

---

## Repository Principle

所有业务：

统一：

引用：

Workflow。

禁止：

各业务：

重复开发：

审批流程。

---

## Domain Structure

```
workflow_definition
        │
        ▼
workflow_instance
        │
        ▼
workflow_task
        │
        ▼
workflow_history
```

---

# Table 16.1

## workflow_definition

---

### Table Identity

| Item           | Value               |
| -------------- | ------------------- |
| Canonical Name | Workflow Definition |
| Chinese Name   | 流程定义            |
| Table Name     | workflow_definition |
| Domain         | Workflow            |
| Owner          | Platform            |
| Lifecycle      | Permanent           |

---

### Business Purpose

保存：

流程模板。

例如：

```
Offer Publish

Product Publish

Knowledge Review

Demand Approval

RFQ Approval
```

统一：

版本管理。

---

### Relationships

Parent

```
None
```

Child

```
workflow_instance
```

---

### Field Specification

| Field              | Type         | Required | Description |
| ------------------ | ------------ | -------- | ----------- |
| id                 | UUID         | Yes      | Primary Key |
| workflow_code      | VARCHAR(64)  | Yes      | 流程编码    |
| workflow_name      | VARCHAR(255) | Yes      | 流程名称    |
| business_type      | VARCHAR(64)  | Yes      | 业务类型    |
| definition_version | INTEGER      | Yes      | 流程版本    |
| description        | TEXT         | No       | 描述        |
| status             | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(workflow_code)

INDEX(business_type)

INDEX(status)
```

---

# Table 16.2

## workflow_instance

---

### Table Identity

| Item           | Value             |
| -------------- | ----------------- |
| Canonical Name | Workflow Instance |
| Chinese Name   | 流程实例          |
| Table Name     | workflow_instance |

---

### Business Purpose

每一次：

业务审批。

对应：

一个：

Workflow Instance。

支持：

```
Demand

Offer

RFQ

Knowledge

Organization
```

统一流程实例。

---

### Relationships

Parent

```
workflow_definition
```

Child

```
workflow_task

workflow_history
```

---

### Field Specification

| Field                  | Type         | Required | Description |
| ---------------------- | ------------ | -------- | ----------- |
| id                     | UUID         | Yes      | Primary Key |
| workflow_definition_id | UUID         | Yes      | 流程定义    |
| business_type          | VARCHAR(64)  | Yes      | 业务类型    |
| business_id            | UUID         | Yes      | 业务对象 ID |
| current_node           | VARCHAR(128) | Yes      | 当前节点    |
| starter_user_id        | UUID         | Yes      | 发起人      |
| current_status         | VARCHAR(32)  | Yes      | 当前状态    |
| finished_at            | TIMESTAMP    | No       | 完成时间    |

统一继承：

Universal Audit Fields。

---

### Constraints

Workflow：

统一采用：

```
Business Type

+

Business ID
```

关联：

业务对象。

不得：

保存：

业务内容。

---

# Table 16.3

## workflow_task

---

### Table Identity

| Item           | Value         |
| -------------- | ------------- |
| Canonical Name | Workflow Task |
| Chinese Name   | 工作流任务    |
| Table Name     | workflow_task |

---

### Business Purpose

保存：

当前待办。

包括：

```
审批人

负责人

截止日期

优先级

审批意见
```

支持：

多个审批节点。

---

### Field Specification

| Field                | Type         | Required | Description |
| -------------------- | ------------ | -------- | ----------- |
| id                   | UUID         | Yes      | Primary Key |
| workflow_instance_id | UUID         | Yes      | 所属流程    |
| node_name            | VARCHAR(128) | Yes      | 节点名称    |
| assignee_user_id     | UUID         | Yes      | 办理人      |
| priority             | INTEGER      | Yes      | 优先级      |
| due_time             | TIMESTAMP    | No       | 截止时间    |
| approval_comment     | TEXT         | No       | 审批意见    |
| task_status          | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

一个 Workflow：

允许：

多个 Task。

---

# Table 16.4

## workflow_history

---

### Table Identity

| Item           | Value            |
| -------------- | ---------------- |
| Canonical Name | Workflow History |
| Chinese Name   | 流程历史         |
| Table Name     | workflow_history |

---

### Business Purpose

保存：

完整审批历史。

包括：

```
Operator

Node

Action

Comment

Time

Status Change
```

永久保存。

不可修改。

---

### Field Specification

| Field                | Type         | Required | Description |
| -------------------- | ------------ | -------- | ----------- |
| id                   | UUID         | Yes      | Primary Key |
| workflow_instance_id | UUID         | Yes      | 流程实例    |
| node_name            | VARCHAR(128) | Yes      | 节点        |
| operator_user_id     | UUID         | Yes      | 操作人      |
| action_type          | VARCHAR(64)  | Yes      | 动作        |
| comment              | TEXT         | No       | 备注        |
| operation_time       | TIMESTAMP    | Yes      | 操作时间    |
| previous_status      | VARCHAR(32)  | No       | 原状态      |
| current_status       | VARCHAR(32)  | Yes      | 新状态      |

统一继承：

Universal Audit Fields。

---

### Constraints

History：

仅追加。

禁止：

修改。

禁止：

删除。

---

# Workflow Domain Constraints

## Rule 1

所有审批：

统一：

Workflow。

---

## Rule 2

Workflow：

不得：

保存：

业务数据。

仅引用：

```
Business Type

Business ID
```

---

## Rule 3

Task：

表示：

当前待办。

---

## Rule 4

History：

永久保存。

不可修改。

---

## Rule 5

Workflow：

支持：

跨业务统一审批。

---

# Workflow Domain Status

| Table               | Status |
| ------------------- | ------ |
| workflow_definition | Frozen |
| workflow_instance   | Frozen |
| workflow_task       | Frozen |
| workflow_history    | Frozen |

---

# Workflow Domain Summary

Workflow Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 17

# Dictionary Domain

---

## Domain Identity

| Item      | Value                  |
| --------- | ---------------------- |
| Domain    | Dictionary             |
| Owner     | Platform               |
| Lifecycle | Master Reference Data  |
| Purpose   | 全平台统一基础字典管理 |
| Mutable   | Platform Administrator |

---

## Business Purpose

Dictionary Domain 用于维护：

```
国家（Country）

地区（Region）

语言（Language）

币种（Currency）

单位（Unit）

行业（Industry）

检测对象（Inspection Object）

检测方法（Inspection Method）

检测标准（Inspection Standard）

认证（Certification）

材料（Material）

产品状态（Product Status）

Offer 状态

Workflow 状态

通知类型

AI 模型类型

……
```

统一作为：

所有业务模块：

唯一引用来源。

---

## Repository Principle

平台：

所有下拉框、

所有枚举、

所有固定分类，

统一引用：

Dictionary。

禁止：

业务模块：

自行维护：

重复字典。

---

## Domain Structure

```
dictionary
      │
      ▼
dictionary_item
```

---

# Table 17.1

## dictionary

---

### Table Identity

| Item           | Value      |
| -------------- | ---------- |
| Canonical Name | Dictionary |
| Chinese Name   | 字典分类   |
| Table Name     | dictionary |
| Domain         | Dictionary |
| Owner          | Platform   |
| Lifecycle      | Permanent  |

---

### Business Purpose

维护：

字典分类。

例如：

```
Country

Currency

Industry

Language

Unit

Certification

Inspection Standard

Inspection Method

Material

Notification Type
```

一个 Dictionary：

对应：

多个 Dictionary Item。

---

### Relationships

Parent

```
None
```

Child

```
dictionary_item
```

Referenced By

```
All Business Domains
```

---

### Field Specification

| Field           | Type         | Required | Description  |
| --------------- | ------------ | -------- | ------------ |
| id              | UUID         | Yes      | Primary Key  |
| dictionary_code | VARCHAR(64)  | Yes      | 字典编码     |
| dictionary_name | VARCHAR(255) | Yes      | 字典名称     |
| description     | TEXT         | No       | 描述         |
| is_system       | BOOLEAN      | Yes      | 是否系统内置 |
| status          | VARCHAR(32)  | Yes      | 状态         |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(dictionary_code)

INDEX(status)
```

---

### Delete Policy

系统内置字典：

禁止删除。

业务字典：

允许：

Archive。

---

# Table 17.2

## dictionary_item

---

### Table Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Dictionary Item |
| Chinese Name   | 字典项          |
| Table Name     | dictionary_item |
| Domain         | Dictionary      |

---

### Business Purpose

维护：

具体字典值。

例如：

Dictionary：

```
Currency
```

↓

Items：

```
CNY

USD

EUR

JPY
```

例如：

Dictionary：

```
Language
```

↓

Items：

```
Chinese

English

Japanese

German
```

---

### Relationships

Parent

```
dictionary
```

Referenced By

```
All Business Domains
```

---

### Field Specification

| Field         | Type         | Required | Description |
| ------------- | ------------ | -------- | ----------- |
| id            | UUID         | Yes      | Primary Key |
| dictionary_id | UUID         | Yes      | 所属字典    |
| item_code     | VARCHAR(64)  | Yes      | 字典值编码  |
| item_name     | VARCHAR(255) | Yes      | 字典值名称  |
| item_name_en  | VARCHAR(255) | No       | 英文名称    |
| sort_order    | INTEGER      | Yes      | 排序        |
| is_default    | BOOLEAN      | Yes      | 是否默认    |
| is_enabled    | BOOLEAN      | Yes      | 是否启用    |
| remark        | TEXT         | No       | 备注        |
| status        | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

INDEX(dictionary_id)

INDEX(item_code)

INDEX(sort_order)

INDEX(status)
```

---

### Constraints

同一 Dictionary：

```
item_code
```

必须唯一。

支持：

国际化。

支持：

排序。

支持：

启用/停用。

---

# Dictionary Domain Constraints

## Rule 1

所有业务：

统一引用：

Dictionary。

---

## Rule 2

业务数据库：

不得：

重复维护：

固定枚举。

---

## Rule 3

Dictionary：

属于：

平台主数据（Master Data）。

---

## Rule 4

Dictionary Item：

必须：

归属于：

一个 Dictionary。

---

## Rule 5

系统内置 Dictionary：

禁止删除。

允许：

禁用。

---

# Dictionary Domain Status

| Table           | Status |
| --------------- | ------ |
| dictionary      | Frozen |
| dictionary_item | Frozen |

---

# Dictionary Domain Summary

Dictionary Domain

包含：

```
2 Tables
```

全部冻结（Frozen）。

---

# Part 18

# File Domain

---

## Domain Identity

| Item      | Value                    |
| --------- | ------------------------ |
| Domain    | File                     |
| Owner     | Platform                 |
| Lifecycle | Infrastructure           |
| Purpose   | 建立统一文件资源管理模型 |
| Mutable   | Platform / File Owner    |

---

## Business Purpose

File Domain：

统一管理：

平台所有文件资源。

包括：

```
Image

PDF

Word

Excel

PowerPoint

Video

Audio

ZIP

CAD

STEP

STL

Other Binary Files
```

所有业务模块：

仅保存：

```
file_object.id
```

禁止：

保存：

文件路径。

OSS URL。

对象存储 Key。

---

## Repository Principle

统一：

引用：

```
file_object
```

所有业务：

禁止：

重复保存：

文件信息。

---

## Domain Structure

```
file_object
      │
      ├─────────────┬─────────────┐
      ▼             ▼             ▼
file_version
file_permission
file_tag
```

---

# Table 18.1

## file_object

---

### Table Identity

| Item           | Value       |
| -------------- | ----------- |
| Canonical Name | File Object |
| Chinese Name   | 文件对象    |
| Table Name     | file_object |
| Domain         | File        |
| Owner          | Platform    |
| Lifecycle      | Permanent   |

---

### Business Purpose

统一维护：

文件主对象。

负责记录：

- 文件唯一标识
- 文件类型
- 文件大小
- 存储方式
- 当前版本
- 文件状态

业务模块仅引用 `file_object.id`。

---

### Relationships

Parent

```
None
```

Child

```
file_version

file_permission

file_tag
```

Referenced By

```
organization_attachment

offer_attachment

knowledge_attachment

demand_attachment

rfq_attachment

product_attachment
```

---

### Field Specification

| Field            | Type         | Required | Description      |
| ---------------- | ------------ | -------- | ---------------- |
| id               | UUID         | Yes      | Primary Key      |
| file_code        | VARCHAR(64)  | Yes      | 文件编码         |
| original_name    | VARCHAR(255) | Yes      | 原始文件名       |
| extension        | VARCHAR(32)  | Yes      | 文件扩展名       |
| mime_type        | VARCHAR(128) | Yes      | MIME 类型        |
| file_size        | BIGINT       | Yes      | 文件大小（Byte） |
| storage_provider | VARCHAR(64)  | Yes      | 存储提供方       |
| current_version  | INTEGER      | Yes      | 当前版本         |
| checksum         | VARCHAR(128) | Yes      | 文件校验值       |
| status           | VARCHAR(32)  | Yes      | 状态             |

统一继承：

Universal Audit Fields。

---

### Indexes

```
PRIMARY KEY(id)

UNIQUE(file_code)

INDEX(original_name)

INDEX(mime_type)

INDEX(status)
```

---

### Constraints

File Object：

不保存：

业务关联。

统一由：

业务 Mapping

引用。

---

# Table 18.2

## file_version

---

### Table Identity

| Item           | Value        |
| -------------- | ------------ |
| Canonical Name | File Version |
| Chinese Name   | 文件版本     |
| Table Name     | file_version |

---

### Business Purpose

维护：

文件版本历史。

支持：

```
Version

Upload Time

Checksum

Storage Key

Storage Provider

Current Version
```

支持：

历史追溯。

---

### Relationships

Parent

```
file_object
```

---

### Field Specification

| Field       | Type         | Required | Description |
| ----------- | ------------ | -------- | ----------- |
| id          | UUID         | Yes      | Primary Key |
| file_id     | UUID         | Yes      | 文件对象    |
| version_no  | INTEGER      | Yes      | 版本号      |
| storage_key | VARCHAR(512) | Yes      | 存储标识    |
| checksum    | VARCHAR(128) | Yes      | 校验值      |
| uploaded_at | TIMESTAMP    | Yes      | 上传时间    |
| is_current  | BOOLEAN      | Yes      | 当前版本    |
| status      | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

一个 File：

允许：

多个 Version。

仅允许：

一个：

Current Version。

---

# Table 18.3

## file_permission

---

### Table Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | File Permission |
| Chinese Name   | 文件权限        |
| Table Name     | file_permission |

---

### Business Purpose

维护：

文件访问权限。

支持：

```
Owner

Organization

Role

Public

Private

Read

Write

Delete
```

统一权限控制。

---

### Field Specification

| Field            | Type        | Required | Description |
| ---------------- | ----------- | -------- | ----------- |
| id               | UUID        | Yes      | Primary Key |
| file_id          | UUID        | Yes      | 文件对象    |
| permission_scope | VARCHAR(64) | Yes      | 权限范围    |
| role_code        | VARCHAR(64) | No       | 角色        |
| organization_id  | UUID        | No       | 组织        |
| allow_read       | BOOLEAN     | Yes      | 读取        |
| allow_write      | BOOLEAN     | Yes      | 写入        |
| allow_delete     | BOOLEAN     | Yes      | 删除        |

统一继承：

Universal Audit Fields。

---

### Constraints

权限：

统一：

RBAC。

不得：

业务模块：

单独维护。

---

# Table 18.4

## file_tag

---

### Table Identity

| Item           | Value    |
| -------------- | -------- |
| Canonical Name | File Tag |
| Chinese Name   | 文件标签 |
| Table Name     | file_tag |

---

### Business Purpose

维护：

文件标签。

支持：

```
Category

Keyword

AI Search

Document Type

Language

Business Tag
```

用于：

全文检索。

AI 检索。

分类浏览。

---

### Field Specification

| Field    | Type         | Required | Description |
| -------- | ------------ | -------- | ----------- |
| id       | UUID         | Yes      | Primary Key |
| file_id  | UUID         | Yes      | 文件对象    |
| tag_name | VARCHAR(128) | Yes      | 标签        |
| tag_type | VARCHAR(64)  | Yes      | 标签类型    |
| weight   | INTEGER      | Yes      | 权重        |
| status   | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

标签：

允许：

多个。

支持：

AI 检索。

---

# File Domain Constraints

## Rule 1

所有业务：

统一引用：

```
file_object
```

---

## Rule 2

业务表：

不得：

保存：

OSS URL。

Storage Key。

本地路径。

---

## Rule 3

所有文件：

统一版本管理。

---

## Rule 4

权限：

统一采用：

RBAC。

---

## Rule 5

文件：

允许：

AI 检索。

全文搜索。

分类浏览。

---

# File Domain Status

| Table           | Status |
| --------------- | ------ |
| file_object     | Frozen |
| file_version    | Frozen |
| file_permission | Frozen |
| file_tag        | Frozen |

---

# File Domain Summary

File Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 19

# AI Domain

---

## Domain Identity

| Item      | Value                          |
| --------- | ------------------------------ |
| Domain    | AI                             |
| Owner     | Platform                       |
| Lifecycle | Infrastructure                 |
| Purpose   | 建立 AI 检索与知识推理基础模型 |
| Mutable   | AI Service                     |

---

## Business Purpose

AI Domain

负责维护：

```
Embedding Metadata

Vector Chunk

Search Index

Knowledge Graph
```

为：

```
Semantic Search

RAG

AI Recommendation

Knowledge Reasoning

Vector Retrieval
```

提供基础能力。

---

## Repository Principle

AI：

统一引用：

业务实体。

不得：

复制：

业务数据。

AI：

仅维护：

索引。

Embedding。

向量。

图谱关系。

---

## Domain Structure

```
embedding
      │
      ├──────────────┬──────────────┐
      ▼              ▼              ▼
vector_chunk
search_index
knowledge_graph
```

---

# Table 19.1

## embedding

---

### Table Identity

| Item           | Value          |
| -------------- | -------------- |
| Canonical Name | Embedding      |
| Chinese Name   | 向量元数据     |
| Table Name     | embedding      |
| Domain         | AI             |
| Owner          | AI Service     |
| Lifecycle      | Infrastructure |

---

### Business Purpose

维护：

Embedding 元信息。

包括：

```
Embedding Provider

Embedding Model

Dimension

Version

Status
```

支持：

不同 AI Provider。

不同模型。

统一管理。

---

### Relationships

Parent

```
None
```

Child

```
vector_chunk
```

Referenced By

```
AI Retrieval

Knowledge

Product

Document
```

---

### Field Specification

| Field              | Type         | Required | Description |
| ------------------ | ------------ | -------- | ----------- |
| id                 | UUID         | Yes      | Primary Key |
| embedding_provider | VARCHAR(64)  | Yes      | 向量提供方  |
| model_name         | VARCHAR(128) | Yes      | 模型名称    |
| model_version      | VARCHAR(64)  | No       | 模型版本    |
| dimension          | INTEGER      | Yes      | 向量维度    |
| status             | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

Embedding：

仅保存：

元信息。

不得：

保存：

业务正文。

---

# Table 19.2

## vector_chunk

---

### Table Identity

| Item           | Value        |
| -------------- | ------------ |
| Canonical Name | Vector Chunk |
| Chinese Name   | 向量切片     |
| Table Name     | vector_chunk |

---

### Business Purpose

维护：

文本切片。

对应：

Embedding。

支持：

```
Knowledge

Product

Document

Manual
```

统一：

RAG 检索。

---

### Relationships

Parent

```
embedding
```

Referenced Table

```
Business Entity
```

---

### Field Specification

| Field         | Type         | Required | Description |
| ------------- | ------------ | -------- | ----------- |
| id            | UUID         | Yes      | Primary Key |
| embedding_id  | UUID         | Yes      | Embedding   |
| business_type | VARCHAR(64)  | Yes      | 业务类型    |
| business_id   | UUID         | Yes      | 业务对象    |
| chunk_index   | INTEGER      | Yes      | 切片序号    |
| token_count   | INTEGER      | Yes      | Token 数    |
| vector_hash   | VARCHAR(128) | Yes      | 向量标识    |
| status        | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

业务正文：

仍保存：

业务域。

Vector：

仅保存：

引用关系。

---

# Table 19.3

## search_index

---

### Table Identity

| Item           | Value        |
| -------------- | ------------ |
| Canonical Name | Search Index |
| Chinese Name   | 搜索索引     |
| Table Name     | search_index |

---

### Business Purpose

维护：

统一全文检索索引。

支持：

```
Product

Knowledge

Offer

Demand

RFQ
```

统一：

搜索入口。

---

### Relationships

Referenced Table

```
Business Entity
```

---

### Field Specification

| Field         | Type         | Required | Description |
| ------------- | ------------ | -------- | ----------- |
| id            | UUID         | Yes      | Primary Key |
| business_type | VARCHAR(64)  | Yes      | 业务类型    |
| business_id   | UUID         | Yes      | 业务对象    |
| title         | VARCHAR(512) | Yes      | 标题        |
| keywords      | TEXT         | No       | 检索关键词  |
| language_code | VARCHAR(16)  | No       | 语言        |
| weight        | INTEGER      | Yes      | 检索权重    |
| status        | VARCHAR(32)  | Yes      | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

Search：

仅维护：

索引。

不得：

保存：

业务内容。

---

# Table 19.4

## knowledge_graph

---

### Table Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Knowledge Graph |
| Chinese Name   | 知识图谱        |
| Table Name     | knowledge_graph |

---

### Business Purpose

维护：

知识图谱。

包括：

```
Entity

Relation

Node

Edge

Semantic Link
```

支持：

AI 推理。

实体关联。

知识导航。

---

### Relationships

Referenced Table

```
Business Entity
```

---

### Field Specification

| Field         | Type         | Required | Description  |
| ------------- | ------------ | -------- | ------------ |
| id            | UUID         | Yes      | Primary Key  |
| source_type   | VARCHAR(64)  | Yes      | 源实体类型   |
| source_id     | UUID         | Yes      | 源实体 ID    |
| relation_type | VARCHAR(64)  | Yes      | 关系类型     |
| target_type   | VARCHAR(64)  | Yes      | 目标实体类型 |
| target_id     | UUID         | Yes      | 目标实体 ID  |
| confidence    | DECIMAL(5,2) | No       | 关系置信度   |
| status        | VARCHAR(32)  | Yes      | 状态         |

统一继承：

Universal Audit Fields。

---

### Constraints

Knowledge Graph：

统一引用：

业务实体。

不得：

复制：

业务数据。

---

# AI Domain Constraints

## Rule 1

AI：

统一引用：

业务实体。

---

## Rule 2

Embedding：

仅保存：

元信息。

---

## Rule 3

Vector：

仅保存：

引用关系。

---

## Rule 4

Search Index：

统一维护：

全文索引。

---

## Rule 5

Knowledge Graph：

维护：

实体关系。

支持：

AI 推理。

---

# AI Domain Status

| Table           | Status |
| --------------- | ------ |
| embedding       | Frozen |
| vector_chunk    | Frozen |
| search_index    | Frozen |
| knowledge_graph | Frozen |

---

# AI Domain Summary

AI Domain

包含：

```
4 Tables
```

全部冻结（Frozen）。

---

# Part 20

# User & Permission Domain

---

## Domain Identity

| Item      | Value                          |
| --------- | ------------------------------ |
| Domain    | User & Permission              |
| Owner     | Platform                       |
| Lifecycle | Infrastructure                 |
| Purpose   | 建立统一身份认证与权限管理模型 |
| Mutable   | Platform Administrator         |

---

## Business Purpose

统一管理：

```
User

Profile

Role

Permission

RBAC

Organization Member
```

支持：

```
Platform Administrator

Organization Administrator

Operator

Sales

Engineer

Viewer

Future Custom Roles
```

---

## Repository Principle

所有业务：

统一引用：

User。

统一采用：

RBAC。

禁止：

业务模块：

自行维护：

权限。

---

## Domain Structure

```
user
 │
 ├──────────────┐
 ▼              ▼
user_profile  user_role
                  │
                  ▼
role
 │
 ▼
role_permission
 │
 ▼
permission
```

---

# Table 20.1

## user

### Business Purpose

维护平台账号主体。

负责：

- 登录账号
- 身份认证
- 所属组织
- 用户状态

### Relationships

Child：

```
user_profile

user_role
```

Referenced By：

```
workflow

audit_log

notification

organization
```

### Core Fields

| Field           | Description  |
| --------------- | ------------ |
| id              | 主键         |
| username        | 登录账号     |
| password_hash   | 密码摘要     |
| organization_id | 所属组织     |
| account_status  | 账号状态     |
| last_login_at   | 最后登录时间 |

统一继承：

Universal Audit Fields。

---

# Table 20.2

## user_profile

### Business Purpose

维护：

用户资料。

包括：

```
姓名

头像

邮箱

手机

语言

时区

职位

签名
```

### Relationships

Parent：

```
user
```

### Core Fields

| Field        | Description |
| ------------ | ----------- |
| id           | 主键        |
| user_id      | 用户        |
| display_name | 显示名称    |
| avatar       | 头像        |
| mobile       | 手机        |
| email        | 邮箱        |
| locale       | 语言        |
| timezone     | 时区        |

统一继承：

Universal Audit Fields。

---

# Table 20.3

## role

### Business Purpose

维护：

RBAC：

角色。

例如：

```
Platform Admin

Organization Admin

Sales

Engineer

Operator

Viewer
```

### Core Fields

| Field       | Description |
| ----------- | ----------- |
| id          | 主键        |
| role_code   | 角色编码    |
| role_name   | 名称        |
| description | 描述        |
| status      | 状态        |

统一继承：

Universal Audit Fields。

---

# Table 20.4

## permission

### Business Purpose

维护：

平台权限点。

包括：

```
API

Menu

Button

Data Permission

File Permission
```

### Core Fields

| Field           | Description |
| --------------- | ----------- |
| id              | 主键        |
| permission_code | 权限编码    |
| permission_name | 权限名称    |
| permission_type | 权限类型    |
| resource        | 资源        |
| action          | 操作        |

统一继承：

Universal Audit Fields。

---

# Table 20.5

## user_role

### Business Purpose

维护：

User

↓

Role

关联。

支持：

多角色。

### Relationships

Parent：

```
user
```

Referenced：

```
role
```

### Core Fields

| Field          | Description |
| -------------- | ----------- |
| id             | 主键        |
| user_id        | 用户        |
| role_id        | 角色        |
| effective_from | 生效时间    |
| effective_to   | 失效时间    |

统一继承：

Universal Audit Fields。

---

### Constraints

一个 User：

允许：

多个 Role。

---

# Table 20.6

## role_permission

### Business Purpose

维护：

Role

↓

Permission

关联。

### Relationships

Parent：

```
role
```

Referenced：

```
permission
```

### Core Fields

| Field         | Description |
| ------------- | ----------- |
| id            | 主键        |
| role_id       | 角色        |
| permission_id | 权限        |
| granted       | 是否授予    |

统一继承：

Universal Audit Fields。

---

### Constraints

Role：

统一管理：

Permission。

User：

不得：

直接关联：

Permission。

---

# User & Permission Domain Constraints

## Rule 1

统一采用：

RBAC。

---

## Rule 2

User：

统一引用：

Role。

---

## Rule 3

Role：

统一引用：

Permission。

---

## Rule 4

业务模块：

不得：

自行维护：

权限。

---

## Rule 5

权限：

支持：

菜单、

API、

数据、

文件。

---

# User Domain Status

| Table           | Status |
| --------------- | ------ |
| user            | Frozen |
| user_profile    | Frozen |
| role            | Frozen |
| permission      | Frozen |
| user_role       | Frozen |
| role_permission | Frozen |

---

# User Domain Summary

User & Permission Domain

包含：

```
6 Tables
```

全部冻结（Frozen）。

---

# Part 21

# System Domain

---

## Domain Identity

| Item      | Value                    |
| --------- | ------------------------ |
| Domain    | System                   |
| Owner     | Platform                 |
| Lifecycle | Infrastructure           |
| Purpose   | 提供平台公共基础设施能力 |
| Mutable   | Platform Administrator   |

---

## Business Purpose

System Domain：

统一维护：

```
Audit Log

Operation Log

Notification

System Setting

Sequence

Scheduled Job
```

为：

```
Business

Workflow

AI

User

Platform Service
```

提供统一公共能力。

---

## Repository Principle

System Domain：

属于：

平台基础设施。

不得：

保存：

业务事实数据。

---

## Domain Structure

```
audit_log
      │
operation_log
      │
notification
      │
system_setting
      │
sequence
      │
scheduled_job
```

---

# Table 21.1

## audit_log

---

### Table Identity

| Item           | Value          |
| -------------- | -------------- |
| Canonical Name | Audit Log      |
| Chinese Name   | 审计日志       |
| Table Name     | audit_log      |
| Domain         | System         |
| Lifecycle      | Infrastructure |

---

### Business Purpose

保存：

平台审计记录。

用于：

```
Security Audit

Compliance

History Trace

Operation Verification
```

---

### Core Fields

| Field            | Description |
| ---------------- | ----------- |
| id               | 主键        |
| business_type    | 业务类型    |
| business_id      | 业务对象    |
| operator_id      | 操作人      |
| operation_type   | 操作类型    |
| operation_time   | 操作时间    |
| before_data_hash | 操作前摘要  |
| after_data_hash  | 操作后摘要  |
| ip_address       | IP 地址     |

统一继承：

Universal Audit Fields。

---

### Constraints

审计记录：

永久保存。

禁止修改。

禁止删除。

---

# Table 21.2

## operation_log

---

### Business Purpose

保存：

平台操作日志。

例如：

```
Login

Logout

API Call

Export

Import

Download

Upload
```

---

### Core Fields

| Field            | Description |
| ---------------- | ----------- |
| id               | 主键        |
| user_id          | 用户        |
| operation_name   | 操作名称    |
| operation_result | 操作结果    |
| client_type      | 客户端      |
| ip_address       | IP 地址     |
| operation_time   | 操作时间    |

统一继承：

Universal Audit Fields。

---

### Constraints

用于：

系统分析。

问题定位。

性能统计。

---

# Table 21.3

## notification

---

### Business Purpose

统一通知中心。

支持：

```
Workflow

Demand

RFQ

Offer

Knowledge

Organization

System
```

统一消息。

---

### Core Fields

| Field             | Description |
| ----------------- | ----------- |
| id                | 主键        |
| receiver_user_id  | 接收人      |
| notification_type | 通知类型    |
| title             | 标题        |
| content           | 内容摘要    |
| is_read           | 是否已读    |
| sent_time         | 发送时间    |

统一继承：

Universal Audit Fields。

---

### Constraints

通知：

支持：

站内消息。

后续可扩展：

邮件。

短信。

Webhook。

---

# Table 21.4

## system_setting

---

### Business Purpose

维护：

平台配置。

例如：

```
Upload Size

Default Language

Storage Provider

AI Provider

Theme

Security Policy

Login Policy
```

---

### Core Fields

| Field         | Description  |
| ------------- | ------------ |
| id            | 主键         |
| setting_key   | 配置键       |
| setting_value | 配置值       |
| value_type    | 数据类型     |
| is_system     | 是否系统配置 |
| description   | 描述         |

统一继承：

Universal Audit Fields。

---

### Constraints

系统配置：

统一管理。

禁止：

业务模块：

重复配置。

---

# Table 21.5

## sequence

---

### Business Purpose

统一编号生成。

例如：

```
VIS-PD-202600001

VIS-RFQ-202600001

VIS-DM-202600001

VIS-KN-202600001
```

支持：

按业务类型：

独立流水。

---

### Core Fields

| Field         | Description |
| ------------- | ----------- |
| id            | 主键        |
| sequence_code | 编号规则    |
| business_type | 业务类型    |
| current_value | 当前值      |
| prefix        | 前缀        |
| suffix        | 后缀        |

统一继承：

Universal Audit Fields。

---

### Constraints

所有业务编号：

统一由：

Sequence。

生成。

---

# Table 21.6

## scheduled_job

---

### Business Purpose

维护：

平台定时任务。

包括：

```
Index Rebuild

Embedding Refresh

Workflow Timeout

Notification Retry

Cache Refresh

Statistics Update
```

---

### Core Fields

| Field             | Description |
| ----------------- | ----------- |
| id                | 主键        |
| job_code          | 任务编码    |
| job_name          | 名称        |
| cron_expression   | Cron 表达式 |
| executor          | 执行器      |
| last_execute_time | 上次执行    |
| next_execute_time | 下次执行    |
| status            | 状态        |

统一继承：

Universal Audit Fields。

---

### Constraints

所有后台任务：

统一管理。

统一调度。

---

# System Domain Constraints

## Rule 1

System Domain：

不得：

保存：

业务事实数据。

---

## Rule 2

日志：

永久保存。

---

## Rule 3

编号：

统一：

Sequence。

---

## Rule 4

系统配置：

统一：

System Setting。

---

## Rule 5

后台任务：

统一：

Scheduled Job。

---

# System Domain Status

| Table          | Status |
| -------------- | ------ |
| audit_log      | Frozen |
| operation_log  | Frozen |
| notification   | Frozen |
| system_setting | Frozen |
| sequence       | Frozen |
| scheduled_job  | Frozen |

---

# System Domain Summary

System Domain

包含：

```
6 Tables
```

全部冻结（Frozen）。

---

# Part 22

# Universal Database Standards

---

## 22.1 Purpose

本章节定义：

VISNDT Repository

数据库统一规范。

适用于：

```
403_PostgreSQL_DDL.sql

404_Prisma_Schema.md

405_prisma.schema

所有 Migration

所有 Repository

所有 Service
```

任何模块：

不得：

自行修改规范。

---

# 22.2 Universal Audit Fields

所有业务实体统一包含以下字段：

| Field      | Type                     | Required | Description     |
| ---------- | ------------------------ | -------- | --------------- |
| id         | UUID v7                  | Yes      | 主键            |
| created_at | TIMESTAMP WITH TIME ZONE | Yes      | 创建时间（UTC） |
| created_by | UUID                     | Yes      | 创建人          |
| updated_at | TIMESTAMP WITH TIME ZONE | Yes      | 更新时间        |
| updated_by | UUID                     | Yes      | 更新人          |
| deleted_at | TIMESTAMP WITH TIME ZONE | No       | 删除时间        |
| deleted_by | UUID                     | No       | 删除人          |
| version    | INTEGER                  | Yes      | 乐观锁版本      |
| status     | VARCHAR(32)              | Yes      | 生命周期状态    |

---

统一原则：

```
所有业务表：

必须包含。

```

例外：

```
Mapping Table

可根据实际情况：

简化：

created_by

updated_by

等字段。

但：

id

created_at

status

原则上仍建议保留。
```

---

# 22.3 Primary Key Standard

统一：

```
UUID Version 7
```

禁止：

```
AUTO_INCREMENT

SERIAL

BIGSERIAL

Snowflake

业务编号

字符串主键
```

作为：

Primary Key。

---

统一字段名：

```
id
```

禁止：

```
product_id

offer_id

user_id

organization_id

……
```

作为：

Primary Key。

---

# 22.4 Foreign Key Standard

统一：

```
xxx_id
```

例如：

```
product_id

organization_id

offer_id

workflow_id

knowledge_id

dictionary_id
```

禁止：

```
ProductID

OrganizationID

fk_product

productRef
```

---

# 22.5 Timestamp Standard

统一采用：

```
TIMESTAMP WITH TIME ZONE
```

全部：

UTC。

前端：

负责：

本地化显示。

---

统一字段：

```
created_at

updated_at

deleted_at
```

禁止：

```
createTime

gmtCreate

create_date

CreateDate
```

---

# 22.6 Version Control Standard

所有业务数据：

统一采用：

```
Optimistic Lock
```

字段：

```
version
```

更新：

必须：

Version +1。

避免：

并发覆盖。

---

# 22.7 Logical Delete Standard

统一：

逻辑删除。

字段：

```
deleted_at

deleted_by
```

禁止：

物理删除。

以下例外：

```
Temporary Cache

Job Runtime Cache

Vector Cache

Session
```

允许：

物理删除。

---

# 22.8 Status Standard

统一：

```
status
```

表示：

生命周期。

例如：

```
Draft

Published

Enabled

Disabled

Archived

Deleted
```

禁止：

每张表：

自行定义：

不同状态字段。

---

# 22.9 Workflow State Standard

涉及：

审批。

流程。

统一增加：

```
workflow_state
```

例如：

```
Draft

Pending

Approved

Rejected

Published
```

Workflow：

统一管理。

---

# 22.10 Naming Convention

统一：

```
snake_case
```

例如：

```
product_series

offer_inventory

knowledge_attachment
```

禁止：

```
ProductSeries

tbl_product

Product_Table
```

---

# 22.11 Index Naming Standard

统一：

```
pk_

fk_

idx_

uk_
```

例如：

```
pk_standard_product

fk_offer_product

idx_product_status

uk_product_code
```

---

# 22.12 Constraint Naming Standard

统一：

```
chk_

uq_

fk_
```

例如：

```
chk_price_positive

uq_product_code

fk_offer_product
```

---

# 22.13 Enum Standard

业务：

禁止：

数据库 Enum。

统一：

```
Dictionary Domain
```

维护：

固定值。

数据库：

统一：

VARCHAR。

---

# 22.14 Attachment Standard

所有附件：

统一：

引用：

```
file_object
```

业务：

不得：

保存：

```
URL

OSS Key

Storage Path
```

---

# 22.15 Workflow Standard

所有审批：

统一：

Workflow Domain。

禁止：

业务模块：

自行维护：

审批字段。

---

# 22.16 Search Standard

全文检索：

统一：

```
search_index
```

AI：

统一：

```
vector_chunk
```

业务：

不得：

重复建立：

搜索索引。

---

# 22.17 Internationalization Standard

所有支持国际化字段：

建议采用：

```
name

name_en

description

description_en
```

如后续扩展更多语言：

统一接入：

i18n Resource。

---

# 22.18 Security Standard

敏感字段：

必须：

加密或脱敏。

例如：

```
password_hash

access_token

api_key

secret

refresh_token
```

禁止：

明文存储。

---

# 22.19 Repository Dependency

数据库规范：

依赖关系：

```
399

↓

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

逆向修改。

---

# Universal Database Standards Status

Status：

```
Frozen
```

---

# Part 23

# Database Statistics

---

## 23.1 Purpose

本章节用于统计：

VISNDT Repository Database

全部实体。

作为：

Repository Release

Architecture Review

DDL Validation

Migration Validation

的重要依据。

本章节：

不定义业务。

仅用于：

统计与验证。

---

# 23.2 Domain Statistics

| Domain            | Tables | Category       | Status |
| ----------------- | -----: | -------------- | ------ |
| Product           |     14 | Business       | Frozen |
| Organization      |      4 | Business       | Frozen |
| Offer             |      5 | Business       | Frozen |
| Knowledge         |      3 | Business       | Frozen |
| Demand            |      4 | Business       | Frozen |
| RFQ               |      4 | Business       | Frozen |
| Workflow          |      4 | Infrastructure | Frozen |
| Dictionary        |      2 | Infrastructure | Frozen |
| File              |      4 | Infrastructure | Frozen |
| AI                |      4 | Infrastructure | Frozen |
| User & Permission |      6 | Infrastructure | Frozen |
| System            |      6 | Infrastructure | Frozen |

---

# Total Domains

```
12
```

---

# Total Tables

```
60
```

---

# 23.3 Business Entity Statistics

Business Tables

包括：

```
Product

Organization

Offer

Knowledge

Demand

RFQ
```

统计：

| Category        | Count |
| --------------- | ----: |
| Business Tables |    34 |

---

# 23.4 Infrastructure Statistics

Infrastructure：

包括：

```
Workflow

Dictionary

File

AI

User

System
```

统计：

| Category              | Count |
| --------------------- | ----: |
| Infrastructure Tables |    26 |

---

# Total

```
60
```

---

# 23.5 Master Data Statistics

Master Data：

包括：

```
standard_product

parameter_definition

parameter_group

capability_definition

feature_definition

dictionary

dictionary_item

organization
```

Total：

```
8
```

---

# 23.6 Mapping Table Statistics

Mapping Tables：

```
product_capability

product_feature

product_knowledge_mapping

user_role

role_permission
```

Total：

```
5
```

---

# 23.7 Attachment Tables

Attachment：

```
product_attachment

organization_attachment

offer_attachment

knowledge_attachment

demand_attachment

rfq_attachment
```

Total：

```
6
```

---

# 23.8 Workflow Related Tables

Workflow：

```
workflow_definition

workflow_instance

workflow_task

workflow_history
```

Total：

```
4
```

---

# 23.9 AI Related Tables

AI：

```
embedding

vector_chunk

search_index

knowledge_graph
```

Total：

```
4
```

---

# 23.10 Repository Validation

Repository

Statistics：

```
Domain：

12

Table：

60

Master Data：

8

Attachment：

6

Workflow：

4

AI：

4

Mapping：

5
```

Validation：

```
Passed
```

---

Status：

Frozen



---

# Part 24

# Frozen Design Principles

---

```
## 24.1 Purpose

本章节用于冻结：

VISNDT Repository Database Architecture

的核心设计原则。

所有后续数据库实现：
```

403_PostgreSQL_DDL.sql

404_Prisma_Schema_Specification.md

405_prisma.schema

406_Seed_Data_Specification.md

407_Migration_Strategy.md

```
必须遵循本章节。

---

# 24.2 Principle 01

# Standard Product Is The Only Product Master Data

## Rule

平台产品体系：

唯一产品主数据：
```

standard_product

```
---

## Relationship
```

Product Category

↓

Product Family

↓

Product Series

↓

Standard Product

```
---

## Restrictions

禁止：

Offer 保存产品信息。

禁止：

Organization 保存产品信息。

禁止：

RFQ 创建临时产品。

禁止：

Demand 直接定义产品。

---

## Reason

保证：
```

Product Identity

=

Platform Single Source Of Truth

```
---

# 24.3 Principle 02

# Offer Is The Only Commercial Bridge

## Rule

商业供给关系：

统一通过：
```

Offer

```
表达。

---

## Relationship
```

Organization

```
   │

   ▼

 Offer

   │

   ▼
```

Standard Product

```
---

## Offer Responsible For
```

Price

Inventory

Service

Commercial Attachment

Sales Policy

```
---

## Offer Must Not Store
```

Technical Parameter

Capability

Feature

```
---

# 24.4 Principle 03

# Parameter Definition And Value Separation

## Rule

参数体系：

严格分离：
```

Parameter Definition

```
    +
```

Product Parameter Value

```
---

## Definition Owner

Platform

---

## Value Owner

Product Instance

---

## Forbidden

禁止：

产品表：

增加：
```

resolution

probe_length

sensor

battery

```
等固定字段。

---

## Reason

支持：
```

Dynamic Parameter

Search

Compare

AI Reasoning

```
---

# 24.5 Principle 04

# Capability And Feature Are Reusable Assets

## Rule

能力与功能：

统一资产化。

---

## Capability
```

capability_definition

```
    ↓
```

product_capability

```
---

## Feature
```

feature_definition

```
    ↓
```

product_feature

```
---

## Forbidden

禁止：

Product：

保存：

文本能力描述。

---

# 24.6 Principle 05

# File Resource Centralization

## Rule

所有文件：

统一：

File Domain。

---

## Reference
```

Business Table

```
  ↓
```

file_object

```
  ↓
```

file_version

```
---

## Forbidden

业务表：

不得保存：
```

file_url

storage_path

oss_key

```
---

# 24.7 Principle 06

# Workflow Centralization

## Rule

所有流程：

统一：

Workflow Domain。

---

## Supported Business
```

Demand

RFQ

Offer

Knowledge

Product Review

Organization Review

```
---

## Forbidden

业务表：

不得重复设计：
```

approval_status

approve_user

approve_time

```
---

# 24.8 Principle 07

# AI Does Not Duplicate Business Data

## Rule

AI Domain：

只保存：
```

Index

Embedding

Relation

Metadata

```
---

## Business Data Owner

仍然属于：

原业务 Domain。

---

## Relationship
```

Business Entity

```
   ↓
```

AI Reference

```
   ↓
```

Vector / Search

```
---

## Forbidden

AI：

复制：

Product

Knowledge

Offer

Demand

完整数据。

---

# 24.9 Principle 08

# Dictionary Centralization

## Rule

所有枚举：

统一：

Dictionary Domain。

---

## Examples
```

Unit

Country

Industry

Certification

Language

Currency

```
---

## Forbidden

业务表：

自行维护：
```

ENUM

Hard Code Value

```
---

# 24.10 Principle 09

# UUID v7 Primary Key Standard

所有实体：

统一：
```

id UUID v7

```
---

Advantages:
```

Distributed Generation

Time Ordered

Database Friendly

Future Scaling

```
---

Forbidden:
```

Auto Increment

Business Number

String ID

```
---

# 24.11 Principle 10

# Logical Delete Standard

业务数据：

统一：

逻辑删除。

---

Fields:
```

deleted_at

deleted_by

```
---

Reason:

支持：
```

Audit

Recovery

History

Compliance

```
---

# 24.12 Principle 11

# Database Is Not Business Workflow

Database:

负责：
```

Storage

Integrity

Relationship

Constraint

```
---

Business Layer:

负责：
```

Workflow

Permission

Business Rule

Calculation

```
---

# 24.13 Principle 12

# Single Source Of Truth

所有核心数据：

必须：

唯一来源。

---

Examples:

| Data | Owner |
|-|-|
| Product | Standard Product |
| Organization | Organization |
| Commercial Supply | Offer |
| File | File Domain |
| User | User Domain |
| Permission | Permission Domain |
| Workflow | Workflow Domain |

---

# 24.14 402 Freeze Declaration

## Document Status
```

FINAL FREEZE

```
---

## Version
```

2.0 Final

```
---

## Effective Date

Repository Release:
```

VISNDT Documentation Edition 2.0

```
---

## Freeze Scope

包含：
```

60 PostgreSQL Tables

12 Domains

Universal Database Standards

Entity Relationship Rules

Naming Rules

Lifecycle Rules

```
---

## Modification Policy

后续修改：

必须：

经过：
```

Architecture Review

Database Impact Review

Migration Review

```
---

# 24.15 Downstream Dependency

402 输出：

作为：

唯一数据库实体来源。

---

## Dependency Chain
```

399 Naming Specification

```
      ↓
```

401 ER Model

```
      ↓
```

402 Table Specification

```
      ↓
```

403 PostgreSQL DDL

```
      ↓
```

404 Prisma Specification

```
      ↓
```

405 Prisma Schema

```
      ↓
```

406 Seed Data

```
      ↓
```

407 Migration

```
---

# 402 PostgreSQL Table Specification

## FINAL FREEZE COMPLETE

Status:

Frozen

---
```
