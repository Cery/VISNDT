# Document Identity

| Item          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Document ID   | 402                                                          |
| Document Name | PostgreSQL Table Specification                               |
| Version       | 2.0 Final                                                    |
| Status        | In Progress                                                  |
| Repository    | VISNDT Repository Documentation Edition 2.0                  |
| Directory     | docs/400_Database/                                           |
| File Name     | 402_PostgreSQL_Table_Specification.md                        |
| Purpose       | 定义 PostgreSQL 全部业务实体的数据表规范                     |
| Dependency    | 401_PostgreSQL_ER_Model.md、399_CanonicalNamingSpecification.md |
| Referenced By | 403_PostgreSQL_DDL.sql、404_Prisma_Schema.md、405_prisma.schema |

------

# 1. 文档目标

本文档用于定义 PostgreSQL 数据表规范。

本文档**定义表，不定义 SQL**。

每张表统一说明：

- 表职责
- 所属业务域
- 主键
- 外键
- 生命周期
- 数据拥有者
- 引用关系
- 开发约束

SQL 类型、索引及约束将在后续文档中定义。

------

# 2. 数据库命名规范

## 2.1 表命名

统一采用：

```
snake_case
```

例如：

```
standard_product

product_series

organization

offer

knowledge

rfq
```

禁止：

```
StandardProduct

tbl_product

productTable
```

------

## 2.2 主键

所有表：

```
id
```

统一：

UUID v7

禁止：

```
product_id
organization_id
offer_id
```

作为主键。

------

## 2.3 外键

统一：

```
xxx_id
```

例如：

```
category_id

series_id

organization_id

product_id
```

------

## 2.4 时间字段

统一：

```
created_at

updated_at

deleted_at
```

------

## 2.5 操作人字段

统一：

```
created_by

updated_by

deleted_by
```

------

## 2.6 状态字段

统一：

```
status

workflow_state

version
```

------

# 3. Product Domain

------

# Table：product_category

## 基本信息

| 项目           | 内容             |
| -------------- | ---------------- |
| Canonical Name | Product Category |
| 中文名称       | 产品一级分类     |
| Table Name     | product_category |
| Domain         | Product          |
| Owner          | Platform         |
| Lifecycle      | Permanent        |

------

## Responsibility

维护平台一级产品分类。

例如：

- 工业内窥镜
- 光纤内窥镜
- 光学硬杆镜
- 管道检测设备

属于平台主数据。

------

## Primary Key

```
id
```

------

## Parent Table

无

------

## Child Table

```
product_sub_category
```

------

## Referenced By

```
parameter_template

capability_definition

feature_definition
```

------

## Mutable

```
Yes
```

平台维护。

------

## Delete Policy

```
Logical Delete

Archive Only
```

------

# Table：product_sub_category

## 基本信息

| 项目           | 内容                 |
| -------------- | -------------------- |
| Canonical Name | Product SubCategory  |
| 中文名称       | 产品二级分类         |
| Table Name     | product_sub_category |
| Domain         | Product              |
| Owner          | Platform             |
| Lifecycle      | Permanent            |

------

## Responsibility

维护二级产品分类。

例如：

工业电子内窥镜：

```
普通电子内窥镜

双镜头内窥镜

测量型内窥镜

高温内窥镜
```

------

## Parent Table

```
product_category
```

------

## Child Table

```
product_family
```

------

## Delete Policy

Archive Only

------

# Table：product_family

## 基本信息

| 项目           | 内容           |
| -------------- | -------------- |
| Canonical Name | Product Family |
| 中文名称       | 产品族         |
| Table Name     | product_family |
| Domain         | Product        |
| Owner          | Platform       |
| Lifecycle      | Permanent      |

------

## Responsibility

维护能力模板。

例如：

```
Measurement Family

High Temperature Family

Explosion Proof Family
```

------

## Parent Table

```
product_sub_category
```

------

## Child Table

```
product_series
```

------

## Referenced By

```
parameter_template

capability_definition
```

------

# Table：product_series

## 基本信息

| 项目           | 内容           |
| -------------- | -------------- |
| Canonical Name | Product Series |
| 中文名称       | 产品系列       |
| Table Name     | product_series |
| Domain         | Product        |
| Owner          | Platform       |
| Lifecycle      | Permanent      |

------

## Responsibility

维护产品系列。

例如：

```
VIS-300

VIS-600

VIS-900
```

系列继承 Family。

------

## Parent Table

```
product_family
```

------

## Child Table

```
standard_product
```

------

## Delete Policy

Archive Only

------

# Table：standard_product

## 基本信息

| 项目           | 内容             |
| -------------- | ---------------- |
| Canonical Name | Standard Product |
| 中文名称       | 标准产品         |
| Table Name     | standard_product |
| Domain         | Product          |
| Owner          | Platform         |
| Lifecycle      | Permanent        |

------

## Responsibility

平台唯一产品主数据。

保存：

- 产品名称
- 产品型号
- 分类
- 参数模板引用
- 能力引用
- 功能引用

不保存：

商业价格。

库存。

供应商。

------

## Parent Table

```
product_series
```

------

## Child Table

```
product_parameter_value

product_capability

product_feature

product_attachment

product_version

product_workflow
```

------

## Referenced By

```
offer

knowledge

rfq_item

demand_recommendation

ai_metadata
```

------

## Owner

Platform

------

## Mutable

Revision Only

Published Product：

禁止直接修改。

------

## Delete Policy

Archive Only

------

# 第一阶段 Product Domain 数据表清单

| Table                | Status  |
| -------------------- | ------- |
| product_category     | Defined |
| product_sub_category | Defined |
| product_family       | Defined |
| product_series       | Defined |
| standard_product     | Defined |

Product Domain 其余数据表将在下一部分继续定义：

- parameter_group
- parameter_definition
- parameter_template
- parameter_template_item
- product_parameter_value
- capability_definition
- feature_definition
- product_capability
- product_feature
- product_attachment
- product_version
- product_workflow
- product_audit

------

# Part 2：Parameter Domain（参数域）

> **Dependency**
>
> - RP-001 Part 4：Product Parameter Schema
> - 399_CanonicalNamingSpecification
> - 401_PostgreSQL_ER_Model

------

# Domain Identity

| Item          | Value                                     |
| ------------- | ----------------------------------------- |
| Domain        | Parameter                                 |
| Owner         | Platform                                  |
| Purpose       | 维护全平台统一参数体系                    |
| Mutable       | Platform Only                             |
| Referenced By | Product、AI、Search、RFQ、Demand、Compare |

------

# Parameter Domain Design

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

整个参数体系采用：

> Parameter Definition + Parameter Value

彻底避免：

> 一个产品一张宽表（Wide Table）

------

# Table：parameter_group

------

## Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Parameter Group |
| 中文名称       | 参数分组        |
| Table Name     | parameter_group |
| Domain         | Parameter       |
| Owner          | Platform        |
| Lifecycle      | Permanent       |

------

## Responsibility

维护参数分组。

例如：

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

------

## Parent Table

None

------

## Child Table

```
parameter_definition
```

------

## Referenced By

```
parameter_template
```

------

## Mutable

Platform Only

------

## Delete Policy

Archive Only

------

# Table：parameter_definition

------

## Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Parameter Definition |
| 中文名称       | 参数定义             |
| Table Name     | parameter_definition |

------

## Responsibility

定义：

一个参数是什么。

例如：

Probe Diameter

Probe Length

Sensor

Resolution

Depth Of Field

Field Of View

Battery Capacity

Weight

Operating Temperature

IP Rating

……

参数定义：

全平台唯一。

------

## Includes

维护：

Parameter Code

Chinese Name

English Name

Description

Group

Value Type

Unit

Validation Rule

Required

Searchable

Comparable

Filterable

Sortable

AI Enabled

Display Order

Status

Version

------

## Parent Table

```
parameter_group
```

------

## Child Table

```
parameter_template_item

product_parameter_value
```

------

## Referenced By

```
Search

AI

Compare

RFQ

Demand
```

------

## Mutable

Platform Only

------

## Delete Policy

Archive Only

------

# Table：parameter_template

------

## Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Parameter Template |
| 中文名称       | 参数模板           |
| Table Name     | parameter_template |

------

## Responsibility

定义：

某一类产品

需要哪些参数。

例如：

工业电子内窥镜模板

↓

包含：

80+

参数。

------

## Parent

None

------

## Child

```
parameter_template_item
```

------

## Referenced By

```
product_family

product_series

standard_product
```

------

## Mutable

Platform Only

------

# Table：parameter_template_item

------

## Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Parameter Template Item |
| 中文名称       | 参数模板项              |
| Table Name     | parameter_template_item |

------

## Source

RP-001

Parameter Schema

------

## Responsibility

维护：

Template

包含哪些 Parameter。

例如：

```
Template

↓

Probe Diameter

Probe Length

Sensor

Battery
```

支持：

排序

继承

覆盖

必填

默认值

显示控制

------

## Parent

```
parameter_template
```

------

## Child

None

------

## Referenced By

```
Product Editor

Parameter Engine
```

------

## Mutable

Platform Only

------

# Table：product_parameter_value

------

## Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Product Parameter Value |
| 中文名称       | 产品参数值              |
| Table Name     | product_parameter_value |

------

## Responsibility

保存：

某一个 Product

某一个 Parameter

对应的值。

例如：

```
Product

VIS600

↓

Probe Diameter

6mm
```

又例如：

```
Product

VIS600

↓

Battery

9800mAh
```

数据库：

每条记录

仅保存：

一个参数值。

------

## Parent

```
standard_product
```

------

## Referenced Table

```
parameter_definition
```

------

## Referenced By

```
Search

Compare

RFQ

Demand

AI
```

------

## Mutable

Revision Only

------

## Delete Policy

Archive Version

------

# Parameter Domain Constraints

必须遵循：

```
Parameter Definition

≠

Parameter Value
```

平台：

维护：

Definition。

产品：

维护：

Value。

禁止：

Parameter Definition

复制进入：

Product。

------

# Parameter Domain Status

| Table                   | Status  |
| ----------------------- | ------- |
| parameter_group         | Defined |
| parameter_definition    | Defined |
| parameter_template      | Defined |
| parameter_template_item | Defined |
| product_parameter_value | Defined |

------

# Part 3：Capability Domain（能力域）

------

# Domain Identity

| Item          | Value               |
| ------------- | ------------------- |
| Domain        | Capability          |
| Owner         | Platform            |
| Purpose       | 描述产品能力        |
| Referenced By | Product、AI、Search |

------

# Capability Domain

```
capability_definition

↓

product_capability
```

------

# Table：capability_definition

------

## Identity

| Item           | Value                 |
| -------------- | --------------------- |
| Canonical Name | Capability Definition |
| 中文名称       | 能力定义              |
| Table Name     | capability_definition |

------

## Responsibility

维护：

平台能力库。

例如：

```
360° Articulation

Dual Camera

Stereo Measurement

AI Recognition

IP68

High Temperature

Explosion Proof
```

能力：

全平台唯一。

------

## Includes

Code

Chinese Name

English Name

Category

Description

Keyword

Synonym

Search Weight

AI Weight

Display Order

Status

Version

------

## Parent

None

------

## Child

```
product_capability
```

------

## Mutable

Platform Only

------

# Table：product_capability

------

## Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Product Capability |
| 中文名称       | 产品能力           |
| Table Name     | product_capability |

------

## Responsibility

建立：

Product

Capability

Mapping。

支持：

Many To Many。

------

## Parent

```
standard_product
```

------

## Referenced Table

```
capability_definition
```

------

## Referenced By

```
AI

Search

Compare

Demand
```

------

## Mutable

Revision Only

------

# Capability Constraints

禁止：

Product

保存：

Capability 文本。

统一：

引用：

Capability Definition。

------

# Capability Domain Status

| Table                 | Status  |
| --------------------- | ------- |
| capability_definition | Defined |
| product_capability    | Defined |

------

# Part 4：Feature Domain（功能域）

------

# Domain Identity

| Item          | Value              |
| ------------- | ------------------ |
| Domain        | Feature            |
| Owner         | Platform           |
| Purpose       | 描述产品功能       |
| Referenced By | Product、Knowledge |

------

# Feature Domain

```
feature_definition

↓

product_feature
```

------

# Table：feature_definition

------

## Identity

| Item           | Value              |
| -------------- | ------------------ |
| Canonical Name | Feature Definition |
| 中文名称       | 功能定义           |
| Table Name     | feature_definition |

------

## Responsibility

维护：

平台功能库。

例如：

录像

拍照

镜头切换

冻结画面

图像旋转

测量报告

二维码识别

WiFi 实时预览

远程控制

OTA 升级

……

------

## Parent

None

------

## Child

```
product_feature
```

------

## Mutable

Platform Only

------

# Table：product_feature

------

## Identity

| Item           | Value           |
| -------------- | --------------- |
| Canonical Name | Product Feature |
| 中文名称       | 产品功能        |
| Table Name     | product_feature |

------

## Responsibility

建立：

Product

Feature

Mapping。

支持：

Many To Many。

支持：

软件版本。

许可证。

固件版本。

启用状态。

------

## Parent

```
standard_product
```

------

## Referenced Table

```
feature_definition
```

------

## Mutable

Revision Only

------

# Feature Constraints

Feature：

不得直接写入：

Standard Product。

统一采用：

Mapping。

------

# 当前 Product Domain 已完成数据表

```
product_category
product_sub_category
product_family
product_series
standard_product

parameter_group
parameter_definition
parameter_template
parameter_template_item
product_parameter_value

capability_definition
product_capability

feature_definition
product_feature
```

共：

**13 张核心数据表**（含参数、能力、功能三大子域）。

# Part 5：Organization Domain（组织域）

> **Dependency**
>
> - 100_Business Blueprint
> - 399_CanonicalNamingSpecification
> - 401_PostgreSQL_ER_Model

------

# Domain Identity

| Item          | Value                        |
| ------------- | ---------------------------- |
| Domain        | Organization                 |
| Owner         | Platform                     |
| Purpose       | 管理平台组织主体及其基础信息 |
| Referenced By | Offer、User、Workflow、File  |

------

# Organization Domain Design

```
organization
      │
      ├────────────┐
      ▼            ▼
organization_contact
organization_address
      │            │
      └────┬───────┘
           ▼
organization_attachment
```

> 第一阶段保持组织模型简单、稳定，不引入复杂集团层级，后续可通过扩展字段支持。

------

# Table：organization

## Identity

| Item           | Value        |
| -------------- | ------------ |
| Canonical Name | Organization |
| 中文名称       | 组织         |
| Table Name     | organization |
| Domain         | Organization |
| Owner          | Platform     |
| Lifecycle      | Permanent    |

------

## Responsibility

保存平台组织主体。

组织可以是：

- 制造商
- 品牌商
- 供应商
- 经销商
- 服务商
- 平台运营主体

组织负责：

- 发布 Offer
- 管理成员
- 管理联系方式
- 管理附件

组织**不直接拥有 Product**。

产品始终属于 Platform Master Data。

------

## Parent Table

None

------

## Child Table

```
organization_contact

organization_address

organization_attachment
```

------

## Referenced By

```
offer

user

workflow_instance
```

------

## Mutable

Organization Administrator

------

## Delete Policy

Logical Delete

Archive Only

------

# Table：organization_contact

## Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Organization Contact |
| 中文名称       | 组织联系人           |
| Table Name     | organization_contact |

------

## Responsibility

保存组织联系人。

支持：

- 姓名
- 职位
- 手机
- 邮箱
- 微信
- 电话
- 默认联系人
- 联系人状态

允许：

一个组织

对应多个联系人。

------

## Parent

```
organization
```

------

## Child

None

------

## Referenced By

```
offer

rfq

workflow
```

------

## Delete Policy

Logical Delete

------

# Table：organization_address

## Identity

| Item           | Value                |
| -------------- | -------------------- |
| Canonical Name | Organization Address |
| 中文名称       | 组织地址             |
| Table Name     | organization_address |

------

## Responsibility

保存组织地址。

支持：

- 国家
- 省
- 市
- 区县
- 邮编
- 地址
- 是否默认

支持：

多个地址。

例如：

总部

工厂

售后中心

仓库

------

## Parent

```
organization
```

------

## Delete Policy

Logical Delete

------

# Table：organization_attachment

## Identity

| Item           | Value                   |
| -------------- | ----------------------- |
| Canonical Name | Organization Attachment |
| 中文名称       | 组织附件                |
| Table Name     | organization_attachment |

------

## Responsibility

关联：

营业执照

认证证书

品牌授权

检测报告

质量体系

其他附件

实际文件：

统一引用：

File Domain。

------

## Parent

```
organization
```

------

## Referenced Table

```
file_object
```

------

## Delete Policy

Archive Only

------

# Organization Domain Constraints

统一规定：

Organization

仅负责：

主体信息。

禁止：

保存：

产品技术参数。

产品图片。

产品规格。

统一引用：

Offer。

------

# Organization Domain Status

| Table                   | Status  |
| ----------------------- | ------- |
| organization            | Defined |
| organization_contact    | Defined |
| organization_address    | Defined |
| organization_attachment | Defined |

------

# Part 6：Offer Domain（供给域）

------

# Domain Identity

| Item          | Value                            |
| ------------- | -------------------------------- |
| Domain        | Offer                            |
| Owner         | Organization                     |
| Purpose       | 管理组织向平台发布的产品供给信息 |
| Referenced By | RFQ、Demand、Search              |

------

# Offer Domain Design

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

------

# Table：offer

## Identity

| Item           | Value    |
| -------------- | -------- |
| Canonical Name | Offer    |
| 中文名称       | 产品供给 |
| Table Name     | offer    |

------

## Responsibility

Offer 是：

组织

销售

Standard Product

的唯一桥梁。

Offer 保存：

销售信息。

不保存：

产品技术信息。

------

## Includes

维护：

- 上架状态
- 销售区域
- 是否推荐
- MOQ
- Lead Time
- 是否支持 OEM
- 是否支持 ODM
- 是否支持定制

------

## Parent

```
organization
```

------

## Referenced Table

```
standard_product
```

------

## Child Table

```
offer_price

offer_inventory

offer_service

offer_attachment
```

------

## Referenced By

```
rfq_item

demand_recommendation

search
```

------

## Mutable

Organization

------

# Table：offer_price

## Responsibility

维护：

Offer

价格体系。

支持：

- 市场价
- 经销价
- 代理价
- VIP价
- 币种
- 生效时间
- 失效时间

价格采用：

版本管理。

------

# Table：offer_inventory

## Responsibility

维护：

库存信息。

包括：

- 可售库存
- 安全库存
- 仓库
- 更新时间

库存：

不属于：

Product。

属于：

Offer。

------

# Table：offer_service

## Responsibility

维护：

售后服务。

例如：

质保期

维修周期

远程支持

现场服务

培训

升级

------

# Table：offer_attachment

## Responsibility

保存：

报价单

彩页

PDF

视频

案例

认证资料

文件统一引用：

File Domain。

------

# Offer Domain Constraints

Offer：

不得：

保存：

参数。

能力。

功能。

统一引用：

Standard Product。

------

# Offer Domain Status

| Table            | Status  |
| ---------------- | ------- |
| offer            | Defined |
| offer_price      | Defined |
| offer_inventory  | Defined |
| offer_service    | Defined |
| offer_attachment | Defined |

------

# Part 7：Knowledge Domain（知识域）

------

# Domain Identity

| Item          | Value                    |
| ------------- | ------------------------ |
| Domain        | Knowledge                |
| Owner         | Platform                 |
| Purpose       | 管理知识内容及与产品关联 |
| Referenced By | AI、Search、Product      |

------

# Knowledge Domain Design

```
knowledge
      │
      ├──────────────┐
      ▼              ▼
knowledge_attachment
product_knowledge_mapping
```

------

# Table：knowledge

## Identity

| Item           | Value     |
| -------------- | --------- |
| Canonical Name | Knowledge |
| 中文名称       | 知识库    |
| Table Name     | knowledge |

------

## Responsibility

保存平台知识。

例如：

- 产品说明
- 使用教程
- 检测方案
- 应用案例
- 故障处理
- 常见问题
- 技术文章
- 培训资料

------

## Referenced By

```
AI

Search

Product
```

------

## Delete Policy

Version Archive

------

# Table：knowledge_attachment

## Responsibility

关联：

PDF

图片

视频

PPT

Word

ZIP

统一引用：

File Domain。

------

# Table：product_knowledge_mapping

## Responsibility

建立：

Product

Knowledge

多对多关系。

支持：

一个知识

关联多个产品。

一个产品

关联多个知识。

------

# Knowledge Domain Constraints

Knowledge：

属于：

平台内容。

不得：

保存：

Offer。

库存。

价格。

供应商信息。

------

# Knowledge Domain Status

| Table                     | Status  |
| ------------------------- | ------- |
| knowledge                 | Defined |
| knowledge_attachment      | Defined |
| product_knowledge_mapping | Defined |

------

# 当前累计完成数据表

## Product Domain

```
product_category
product_sub_category
product_family
product_series
standard_product

parameter_group
parameter_definition
parameter_template
parameter_template_item
product_parameter_value

capability_definition
product_capability

feature_definition
product_feature
```

**14 张表**

------

## Organization Domain

```
organization
organization_contact
organization_address
organization_attachment
```

**4 张表**

------

## Offer Domain

```
offer
offer_price
offer_inventory
offer_service
offer_attachment
```

**5 张表**

------

## Knowledge Domain

```
knowledge
knowledge_attachment
product_knowledge_mapping
```

**3 张表**

------

## 当前累计

**26 张核心数据表已完成规范定义。**



# Part 8：Demand Domain（需求域）

> **Dependency**
>
> - 100_Business Blueprint
> - RP-001
> - 401_PostgreSQL_ER_Model

------

# Domain Identity

| Item          | Value                    |
| ------------- | ------------------------ |
| Domain        | Demand                   |
| Owner         | Platform                 |
| Purpose       | 管理用户需求及AI推荐     |
| Referenced By | AI、Offer、RFQ、Workflow |

------

# Domain Structure

```
demand
    │
    ├──────────────┐
    ▼              ▼
demand_item   demand_attachment
    │
    ▼
demand_recommendation
```

Demand 是平台所有业务流程的起点。

用户提出需求以后：

```
Demand

↓

AI分析

↓

推荐 Product

↓

推荐 Offer

↓

生成 RFQ（可选）
```

Demand 自身：

不保存：

供应商。

报价。

订单。

仅保存：

需求事实。

------

# Table：demand

## Identity

| Item           | Value  |
| -------------- | ------ |
| Canonical Name | Demand |
| 中文名称       | 需求   |
| Table Name     | demand |
| Domain         | Demand |

------

## Responsibility

保存：

用户需求。

包括：

需求标题

行业

应用场景

检测对象

预算

采购数量

交付时间

采购地区

需求状态

AI分析状态

Workflow状态

------

## Parent

None

------

## Child

```
demand_item

demand_attachment

demand_recommendation
```

------

## Referenced By

```
workflow

notification
```

------

## Mutable

Demand Owner

------

# Table：demand_item

## Responsibility

一个需求：

允许：

多个检测对象。

例如：

需求：

航空发动机检测

↓

Item

燃烧室

↓

Item

压气机

↓

Item

叶片

支持：

复杂需求拆分。

------

# Table：demand_attachment

## Responsibility

关联：

图片

PDF

CAD

视频

Word

ZIP

统一引用：

File Domain。

------

# Table：demand_recommendation

## Responsibility

保存：

AI 推荐结果。

包括：

推荐 Product

推荐 Offer

推荐原因

评分

置信度

排序

推荐时间

推荐模型版本

------

## Constraints

AI：

不修改：

Demand。

仅生成：

Recommendation。

------

# Demand Domain Status

| Table                 | Status  |
| --------------------- | ------- |
| demand                | Defined |
| demand_item           | Defined |
| demand_attachment     | Defined |
| demand_recommendation | Defined |

------

# Part 9：RFQ Domain（询价域）

------

# Domain Identity

| Item          | Value           |
| ------------- | --------------- |
| Domain        | RFQ             |
| Owner         | Platform        |
| Purpose       | 管理询价流程    |
| Referenced By | Offer、Workflow |

------

# Domain Structure

```
rfq
   │
   ├──────────────┐
   ▼              ▼
rfq_item    rfq_attachment
   │
   ▼
rfq_quotation
```

------

# Table：rfq

## Identity

| Item           | Value  |
| -------------- | ------ |
| Canonical Name | RFQ    |
| 中文名称       | 询价单 |
| Table Name     | rfq    |

------

## Responsibility

保存：

询价主单。

支持来源：

Demand

Manual Create

AI Generate

Import

------

## Child

```
rfq_item

rfq_attachment

rfq_quotation
```

------

## Workflow

Draft

Published

Quoted

Completed

Closed

Cancelled

------

# Table：rfq_item

## Responsibility

一个 RFQ

包含：

多个产品。

每一项：

引用：

Standard Product。

允许：

不同数量。

不同备注。

不同交期。

------

# Table：rfq_attachment

## Responsibility

关联：

图纸

规格

附件

技术协议

统一：

File Domain。

------

# Table：rfq_quotation

## Responsibility

保存：

供应商报价。

包括：

Offer

Price

Currency

Delivery

Remark

Version

Quoted Time

------

## Constraints

Quotation：

引用：

Offer。

不得：

复制：

Offer 数据。

------

# RFQ Domain Status

| Table          | Status  |
| -------------- | ------- |
| rfq            | Defined |
| rfq_item       | Defined |
| rfq_attachment | Defined |
| rfq_quotation  | Defined |

------

# Part 10：Workflow Domain（工作流域）

------

# Domain Identity

| Item    | Value        |
| ------- | ------------ |
| Domain  | Workflow     |
| Owner   | Platform     |
| Purpose | 统一流程管理 |

------

# Domain Structure

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

------

# Table：workflow_definition

## Responsibility

保存：

流程模板。

例如：

需求流程。

RFQ流程。

产品审核。

知识审核。

Offer审核。

------

# Table：workflow_instance

## Responsibility

流程实例。

关联：

业务对象。

统一：

Business Type

Business ID

实现：

跨业务流程。

------

# Table：workflow_task

## Responsibility

保存：

待办任务。

包括：

负责人

状态

截止日期

优先级

审批意见

------

# Table：workflow_history

## Responsibility

保存：

完整审批历史。

包括：

操作人

时间

动作

备注

状态变化

------

# Workflow Domain Constraints

所有业务：

统一：

引用：

Workflow。

不得：

业务系统：

重复开发：

审批逻辑。

------

# Workflow Domain Status

| Table               | Status  |
| ------------------- | ------- |
| workflow_definition | Defined |
| workflow_instance   | Defined |
| workflow_task       | Defined |
| workflow_history    | Defined |

------

# Part 11：Dictionary Domain（字典域）

------

# Domain Identity

| Item    | Value                  |
| ------- | ---------------------- |
| Domain  | Dictionary             |
| Owner   | Platform               |
| Purpose | 全平台基础数据统一维护 |

------

# Domain Structure

```
dictionary
      │
      ▼
dictionary_item
```

------

# Table：dictionary

## Responsibility

维护：

字典分类。

例如：

国家

地区

语言

币种

单位

行业

材料

检测方法

标准

证书

接口类型

协议

……

------

# Table：dictionary_item

## Responsibility

维护：

具体字典项。

例如：

单位：

mm

cm

inch

语言：

Chinese

English

Japanese

……

支持：

排序。

国际化。

启用状态。

版本。

------

# Constraints

平台：

所有：

下拉框。

枚举。

统一：

引用：

Dictionary。

禁止：

业务模块：

重复维护。

------

# Dictionary Domain Status

| Table           | Status  |
| --------------- | ------- |
| dictionary      | Defined |
| dictionary_item | Defined |

------

# 当前累计完成数据表

## Product Domain

14 张

## Organization Domain

4 张

## Offer Domain

5 张

## Knowledge Domain

3 张

## Demand Domain

4 张

## RFQ Domain

4 张

## Workflow Domain

4 张

## Dictionary Domain

2 张

------

## 当前累计

**40 张核心数据表已完成规范定义。**



# Part 12：File Domain（文件域）

> **Dependency**
>
> - 401_PostgreSQL_ER_Model
> - 399_CanonicalNamingSpecification

------

# Domain Identity

| Item          | Value                                                |
| ------------- | ---------------------------------------------------- |
| Domain        | File                                                 |
| Owner         | Platform                                             |
| Purpose       | 全平台统一文件资源管理                               |
| Referenced By | Product、Knowledge、Organization、Offer、Demand、RFQ |

------

# Domain Structure

```
file_object
      │
      ├─────────────┐
      ▼             ▼
file_version    file_permission
      │
      ▼
file_tag
```

------

# Table：file_object

## Identity

| Item           | Value       |
| -------------- | ----------- |
| Canonical Name | File Object |
| 中文名称       | 文件对象    |
| Table Name     | file_object |

------

## Responsibility

统一管理所有文件资源。

包括：

- 图片
- PDF
- Word
- Excel
- PPT
- 视频
- 音频
- ZIP
- CAD
- STEP
- STP
- STL
- 其他附件

业务模块仅保存：

```
file_object.id
```

禁止保存：

文件路径。

对象存储地址。

------

## Referenced By

```
organization_attachment

offer_attachment

knowledge_attachment

demand_attachment

rfq_attachment

product_attachment
```

------

# Table：file_version

## Responsibility

维护：

文件版本。

支持：

Version

Upload Time

Checksum

File Size

Storage Provider

Storage Key

MIME Type

Current Version

------

# Table：file_permission

## Responsibility

维护：

文件访问权限。

包括：

Owner

Organization

Public

Private

Role

Permission Scope

------

# Table：file_tag

## Responsibility

维护：

文件标签。

支持：

分类。

搜索。

AI 检索。

------

# File Domain Constraints

统一规定：

所有业务域：

不得：

保存文件路径。

统一：

引用：

File Object。

------

# File Domain Status

| Table           | Status  |
| --------------- | ------- |
| file_object     | Defined |
| file_version    | Defined |
| file_permission | Defined |
| file_tag        | Defined |

------

# Part 13：AI Domain（人工智能域）

------

# Domain Identity

| Item    | Value                        |
| ------- | ---------------------------- |
| Domain  | AI                           |
| Owner   | Platform                     |
| Purpose | AI 检索、Embedding、知识推理 |

------

# Domain Structure

```
embedding
      │
      ├──────────────┐
      ▼              ▼
vector_chunk   search_index
      │
      ▼
knowledge_graph
```

------

# Table：embedding

## Responsibility

保存：

Embedding 元数据。

包括：

Embedding Provider

Model

Dimension

Create Time

Status

------

# Table：vector_chunk

## Responsibility

保存：

向量切片。

关联：

Knowledge

Product

Document

支持：

RAG 检索。

------

# Table：search_index

## Responsibility

统一全文索引。

支持：

Product

Knowledge

Offer

Demand

RFQ

搜索。

------

# Table：knowledge_graph

## Responsibility

维护：

知识图谱节点。

知识图谱关系。

实体引用。

AI 推理。

------

# AI Domain Constraints

AI：

不得：

复制业务数据。

统一：

引用：

Business ID。

------

# AI Domain Status

| Table           | Status  |
| --------------- | ------- |
| embedding       | Defined |
| vector_chunk    | Defined |
| search_index    | Defined |
| knowledge_graph | Defined |

------

# Part 14：User & Permission Domain（用户与权限域）

------

# Domain Identity

| Item    | Value                    |
| ------- | ------------------------ |
| Domain  | User                     |
| Owner   | Platform                 |
| Purpose | 用户、角色、权限统一管理 |

------

# Domain Structure

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

------

# Table：user

## Responsibility

统一平台账号。

包括：

登录账号。

认证信息。

状态。

所属组织。

------

# Table：user_profile

## Responsibility

维护：

姓名。

头像。

手机。

邮箱。

语言。

时区。

------

# Table：role

## Responsibility

统一 RBAC 角色。

例如：

Platform Admin

Organization Admin

Operator

Viewer

------

# Table：permission

## Responsibility

维护：

权限点。

API。

菜单。

按钮。

资源权限。

------

# Table：user_role

## Responsibility

用户角色关联。

支持：

多角色。

------

# Table：role_permission

## Responsibility

角色权限关联。

支持：

RBAC。

------

# User Domain Status

| Table           | Status  |
| --------------- | ------- |
| user            | Defined |
| user_profile    | Defined |
| role            | Defined |
| permission      | Defined |
| user_role       | Defined |
| role_permission | Defined |

------

# Part 15：System Domain（系统域）

------

# Domain Identity

| Item    | Value            |
| ------- | ---------------- |
| Domain  | System           |
| Owner   | Platform         |
| Purpose | 提供公共基础设施 |

------

# System Tables

------

## audit_log

保存：

审计日志。

------

## operation_log

保存：

操作日志。

------

## notification

保存：

系统通知。

消息中心。

------

## system_setting

保存：

平台配置。

------

## sequence

统一编号生成。

例如：

```
VIS-PD-202600001

VIS-RFQ-202600001

VIS-DM-202600001
```

------

## scheduled_job

保存：

定时任务。

------

# System Domain Status

| Table          | Status  |
| -------------- | ------- |
| audit_log      | Defined |
| operation_log  | Defined |
| notification   | Defined |
| system_setting | Defined |
| sequence       | Defined |
| scheduled_job  | Defined |

------

# 数据库公共字段规范

所有业务表统一包含：

```
id

created_at

created_by

updated_at

updated_by

deleted_at

deleted_by

version

status
```

统一采用：

- UUID v7 主键
- 逻辑删除
- 乐观锁 Version
- UTC 时间存储
- snake_case 命名

------

# 全平台数据库实体统计

| Domain            | Tables |
| ----------------- | ------ |
| Product           | 14     |
| Organization      | 4      |
| Offer             | 5      |
| Knowledge         | 3      |
| Demand            | 4      |
| RFQ               | 4      |
| Workflow          | 4      |
| Dictionary        | 2      |
| File              | 4      |
| AI                | 4      |
| User & Permission | 6      |
| System            | 6      |

------

# 数据库实体总计

```
60 张核心数据表
```

其中：

```
业务实体（Business）          40

平台基础设施（Infrastructure）20
```

------

# 数据库设计原则（冻结）

所有后续数据库开发均遵循以下原则：

1. **标准产品（Standard Product）是唯一产品主数据。**
2. **Offer 是组织与标准产品之间的唯一商业关联。**
3. **所有附件统一引用 File Domain。**
4. **所有审批统一引用 Workflow Domain。**
5. **所有枚举统一引用 Dictionary Domain。**
6. **AI 仅引用业务实体，不复制业务数据。**
7. **所有业务模块遵循统一公共字段规范。**
8. **所有实体采用 UUID v7 主键及逻辑删除。**

------



