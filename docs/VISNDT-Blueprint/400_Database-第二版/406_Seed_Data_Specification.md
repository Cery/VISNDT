# Document Identity

| Item          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Document ID   | 406                                                          |
| Document Name | Seed Data Specification                                      |
| Version       | 2.0 Final                                                    |
| Status        | Draft                                                        |
| Repository    | VISNDT Repository Documentation Edition 2.0                  |
| Directory     | docs/400_Database/                                           |
| File Name     | 406_Seed_Data_Specification.md                               |
| Purpose       | 定义数据库初始化数据规范                                     |
| Dependency    | 402_PostgreSQL_Table_Specification.md、403_PostgreSQL_DDL.sql、404_Prisma_Schema_Specification.md、405_prisma.schema |
| Referenced By | Database Migration、Deployment、Environment Setup、Testing   |

------

# 1. 文档目标

本文档用于定义：

VISNDT 平台数据库初始化数据规范。

本文档定义：

- 系统必须存在的基础数据
- 平台默认配置
- 参数体系初始数据
- 产品分类初始数据
- 能力库初始数据
- 功能库初始数据
- 权限角色初始数据

本文档不定义：

- SQL INSERT 语句
- Migration Script
- 业务测试数据

SQL 初始化脚本将在后续文档中生成：

```
408_Seed_SQL.sql
```

------

# 2. Seed Data Design Principles

## 2.1 Seed Data Definition

Seed Data：

指：

> 系统首次部署后，为保证核心功能运行必须存在的数据。

例如：

```
产品分类

参数定义

角色权限

系统配置

字典数据
```

------

# 2.2 Seed Data Classification

平台初始化数据分为：

```
System Seed

        ↓

Platform Master Seed

        ↓

Business Reference Seed

        ↓

Demo Data
```

------

# 2.3 Data Ownership

所有 Seed Data：

默认：

```
Owner:

Platform
```

禁止：

Organization

User

Supplier

修改。

------

# 2.4 Environment Strategy

Seed Data 分为：

## Production Seed

生产环境必须初始化：

```
Category

Parameter

Capability

Feature

Dictionary

Role

Permission

System Setting
```

------

## Development Seed

开发环境额外包含：

```
Demo Organization

Demo Product

Demo Knowledge

Demo RFQ
```

------

## Test Seed

测试环境包含：

```
Automated Test Dataset
```

------

# 3. Seed Data Architecture

整体结构：

```
                    Seed Data


                         │


        ┌────────────────┼────────────────┐


        ▼                ▼                ▼


 Platform Master     Security        Business


        │                │                │


 Product             User/RBAC       Demo Reference


 Parameter

 Capability

 Feature

 Dictionary
```

------

# 4. Seed Data Scope

## 4.1 Mandatory Seed

系统启动必须存在：

| Domain                | Required |
| --------------------- | -------- |
| Product Category      | Yes      |
| Parameter Group       | Yes      |
| Parameter Definition  | Yes      |
| Capability Definition | Yes      |
| Feature Definition    | Yes      |
| Dictionary            | Yes      |
| Role                  | Yes      |
| Permission            | Yes      |
| System Setting        | Yes      |

------

## 4.2 Optional Seed

按环境加载：

| Domain           | Required |
| ---------------- | -------- |
| Organization     | Optional |
| Standard Product | Optional |
| Knowledge        | Optional |
| Offer            | Optional |
| Demand           | Optional |
| RFQ              | Optional |

------

# 5. Seed Version Control

所有 Seed 数据：

必须支持版本。

统一字段：

```
version
```

示例：

```
seed_version:

2.0.0
```

------

# 6. Seed Execution Order

初始化顺序必须遵循：

```
001_System


        ↓


002_Dictionary


        ↓


003_Product_Category


        ↓


004_Parameter


        ↓


005_Capability


        ↓


006_Feature


        ↓


007_RBAC


        ↓


008_System_Config


        ↓


009_Demo_Data
```

原因：

数据库存在引用依赖。

------

# 7. Seed Data Naming Convention

## Code

所有 Seed 主数据：

必须具有：

```
code
```

例如：

```
PRODUCT_ENDOSCOPE


PARAM_PROBE_DIAMETER


CAP_AI_RECOGNITION


ROLE_ADMIN
```

------

## Name

支持国际化：

```
name

name_zh

name_en
```

------

## Status

统一：

```
ACTIVE

INACTIVE
```

------

# 8. Seed Data Freeze Rule

平台主数据：

冻结规则：

```
Production Seed

        ↓

Version Control

        ↓

Migration Update
```

禁止：

直接修改生产基础数据。

------

# 9. Initial Seed Domain List

## Product Seed

包含：

```
product_category

product_sub_category

product_family

product_series
```

------

## Parameter Seed

包含：

```
parameter_group

parameter_definition

parameter_template

parameter_template_item
```

------

## Capability Seed

包含：

```
capability_definition
```

------

## Feature Seed

包含：

```
feature_definition
```

------

## Dictionary Seed

包含：

```
dictionary

dictionary_item
```

------

## Security Seed

包含：

```
role

permission

role_permission
```

------

## System Seed

包含：

```
system_setting

sequence
```

------

# 10. Seed Data Status

| Module            | Status  |
| ----------------- | ------- |
| Seed Architecture | Defined |
| Version Strategy  | Defined |
| Execution Order   | Defined |
| Production Scope  | Defined |
| Development Scope | Defined |

------

# 11. Next Section

下一部分继续定义：

```
406 BLOCK 02/N

Product Master Seed Specification
```

内容：

- 产品分类初始化数据
- 产品族初始化数据
- 产品系列初始化数据
- 工业内窥镜分类体系

# 12. Product Master Seed Overview

## 12.1 Purpose

Product Master Seed 用于初始化：

VISNDT 平台产品主数据体系。

对应数据库：

```
Product Domain
```

涉及表：

```
product_category

product_sub_category

product_family

product_series
```

------

# 12.2 Design Principle

产品主数据遵循：

```
Category

    ↓

Sub Category

    ↓

Family

    ↓

Series

    ↓

Standard Product
```

其中：

- Category：行业分类
- Sub Category：产品类型
- Family：能力族
- Series：产品系列
- Standard Product：具体标准产品

------

# 12.3 Seed Ownership

所有 Product Master Seed：

Owner:

```
Platform
```

维护角色：

```
Platform Administrator
```

供应商：

```
无权限修改
```

------

# 13. Product Category Seed

## Table

```
product_category
```

------

## Initial Records

### Category 001

| Field   | Value                           |
| ------- | ------------------------------- |
| code    | INDUSTRIAL_INSPECTION           |
| name_zh | 工业检测设备                    |
| name_en | Industrial Inspection Equipment |
| status  | ACTIVE                          |

Description:

```
工业无损检测及视觉检测设备总分类。
```

------

### Category 002

| Field   | Value                          |
| ------- | ------------------------------ |
| code    | ENDOSCOPE                      |
| name_zh | 工业内窥检测设备               |
| name_en | Industrial Endoscope Equipment |
| status  | ACTIVE                         |

Description:

```
用于设备内部视觉检查的内窥检测设备。
```

------

### Category 003

| Field   | Value                             |
| ------- | --------------------------------- |
| code    | NDT_EQUIPMENT                     |
| name_zh | 无损检测设备                      |
| name_en | Non Destructive Testing Equipment |
| status  | ACTIVE                            |

------

# 14. Product Sub Category Seed

## Table

```
product_sub_category
```

------

# 14.1 Industrial Endoscope Sub Categories

## Electronic Video Endoscope

Code:

```
ELECTRONIC_ENDOSCOPE
```

中文：

```
电子视频内窥镜
```

Description:

```
集成摄像头、显示终端及柔性探头的视频检测设备。
```

------

## Fiber Optic Endoscope

Code:

```
FIBER_OPTIC_ENDOSCOPE
```

中文：

```
光纤内窥镜
```

Description:

```
采用光纤传像技术的柔性检测设备。
```

------

## Optical Rigid Endoscope

Code:

```
OPTICAL_RIGID_ENDOSCOPE
```

中文：

```
光学硬杆镜
```

Description:

```
采用硬质镜管及光学系统的工业检测设备。
```

------

## Pipeline Inspection Camera

Code:

```
PIPELINE_INSPECTION_CAMERA
```

中文：

```
管道检测设备
```

Description:

```
用于管道内部检测的视频检测设备。
```

------

# 15. Product Family Seed

## Table

```
product_family
```

------

# 15.1 Electronic Endoscope Family

Code:

```
ELECTRONIC_ENDOSCOPE_FAMILY
```

Name:

```
电子内窥镜系列
```

Description:

```
通用工业视频内窥检测产品族。
```

------

# 15.2 Measurement Endoscope Family

Code:

```
MEASUREMENT_ENDOSCOPE_FAMILY
```

Name:

```
测量型内窥镜系列
```

Capabilities:

```
Stereo Measurement

3D Measurement

Dimension Analysis
```

------

# 15.3 High Temperature Endoscope Family

Code:

```
HIGH_TEMPERATURE_ENDOSCOPE_FAMILY
```

Name:

```
高温检测内窥镜系列
```

Capabilities:

```
High Temperature Resistance

Heat Protection
```

------

# 15.4 Explosion Proof Endoscope Family

Code:

```
EXPLOSION_PROOF_ENDOSCOPE_FAMILY
```

Name:

```
防爆型内窥镜系列
```

Capabilities:

```
Explosion Proof Certification

Hazardous Area Inspection
```

------

# 15.5 Pipeline Inspection Family

Code:

```
PIPELINE_INSPECTION_FAMILY
```

Name:

```
管道检测系列
```

Capabilities:

```
Long Distance Inspection

Pipe Navigation
```

------

# 16. Product Series Seed

## Table

```
product_series
```

------

# 16.1 Example Series

## Portable Video Endoscope Series

Code:

```
VIS_PORTABLE_SERIES
```

Name:

```
便携式视频内窥镜系列
```

Parent:

```
ELECTRONIC_ENDOSCOPE_FAMILY
```

------

## Advanced Measurement Series

Code:

```
VIS_MEASUREMENT_SERIES
```

Name:

```
高级测量内窥镜系列
```

Parent:

```
MEASUREMENT_ENDOSCOPE_FAMILY
```

------

## Pipeline Robot Series

Code:

```
VIS_PIPELINE_ROBOT_SERIES
```

Name:

```
管道机器人检测系列
```

Parent:

```
PIPELINE_INSPECTION_FAMILY
```

------

# 17. Standard Product Seed Strategy

## Table

```
standard_product
```

------

# 17.1 Production Rule

生产环境：

不强制初始化具体型号。

原因：

Standard Product 属于：

平台产品库。

需要经过：

```
Product Research

        ↓

Technical Review

        ↓

Product Approval

        ↓

Publish
```

------

# 17.2 Development Seed

开发环境允许：

初始化 Demo Product。

示例：

```
VIS-300

VIS-600

VIS-900
```

------

# 17.3 Demo Product Example

## VIS-600

| Field  | Value                              |
| ------ | ---------------------------------- |
| code   | VIS600                             |
| name   | VIS-600 Industrial Video Endoscope |
| family | Electronic Endoscope Family        |
| status | ACTIVE                             |

------

Technical Tags:

```
Portable

HD Camera

Flexible Probe

LED Illumination
```

------

# 18. Product Master Seed Constraints

## Constraint 01

禁止：

Seed 中保存供应商。

错误：

```
product.vendor_id
```

正确：

```
standard_product

        ↑

offer

        ↑

organization
```

------

## Constraint 02

禁止：

Seed 保存价格。

错误：

```
product.price
```

正确：

```
offer_price
```

------

## Constraint 03

禁止：

Product 分类复制。

统一引用：

```
product_category

product_sub_category
```

------

# 19. Product Master Seed Status

| Table                     | Status  |
| ------------------------- | ------- |
| product_category          | Defined |
| product_sub_category      | Defined |
| product_family            | Defined |
| product_series            | Defined |
| standard_product strategy | Defined |

# 20. Parameter Master Seed Overview

## 20.1 Purpose

Parameter Master Seed 用于初始化：

VISNDT 平台统一参数体系。

对应数据库：

```
Parameter Domain
```

涉及表：

```
parameter_group

parameter_definition

parameter_template

parameter_template_item
```

------

# 20.2 Parameter Architecture

平台参数体系遵循：

```
Parameter Group

        ↓

Parameter Definition

        ↓

Parameter Template

        ↓

Product Parameter Value
```

原则：

```
定义（Definition）

与

取值（Value）

完全分离
```

------

# 20.3 Ownership

Parameter Master Seed：

Owner:

```
Platform
```

维护：

```
Platform Administrator
```

供应商：

禁止创建平台参数。

------

# 21. Parameter Group Seed

## Table

```
parameter_group
```

------

# 21.1 Basic Information

Code:

```
BASIC_INFORMATION
```

Name:

中文：

```
基础信息
```

English:

```
Basic Information
```

Description:

```
描述产品基础属性。
```

------

# 21.2 Optical Group

Code:

```
OPTICAL
```

Name:

```
光学系统
```

包含：

```
Sensor

Resolution

Lens

Field Of View

Depth Of Field

Viewing Direction
```

------

# 21.3 Probe Group

Code:

```
PROBE
```

Name:

```
探头系统
```

包含：

```
Probe Diameter

Probe Length

Probe Material

Articulation

Insertion Tube
```

------

# 21.4 Imaging Group

Code:

```
IMAGING
```

Name:

```
成像系统
```

包含：

```
Image Sensor

Pixel

Image Processing

Video Format
```

------

# 21.5 Lighting Group

Code:

```
LIGHTING
```

Name:

```
照明系统
```

包含：

```
LED

Fiber Illumination

Laser Illumination

Brightness Control
```

------

# 21.6 Measurement Group

Code:

```
MEASUREMENT
```

Name:

```
测量能力
```

包含：

```
Measurement Accuracy

Measurement Mode

3D Measurement

Stereo Measurement
```

------

# 21.7 Display Group

Code:

```
DISPLAY
```

Name:

```
显示系统
```

包含：

```
Screen Size

Resolution

Touch Screen

Display Type
```

------

# 21.8 Communication Group

Code:

```
COMMUNICATION
```

Name:

```
通信接口
```

包含：

```
USB

WiFi

Bluetooth

Ethernet
```

------

# 21.9 Power Group

Code:

```
POWER
```

Name:

```
电源系统
```

包含：

```
Battery Capacity

Battery Type

Charging Time

Working Time
```

------

# 21.10 Mechanical Group

Code:

```
MECHANICAL
```

Name:

```
机械结构
```

包含：

```
Weight

Dimension

Housing Material
```

------

# 21.11 Environment Group

Code:

```
ENVIRONMENT
```

Name:

```
环境适应
```

包含：

```
Operating Temperature

Storage Temperature

IP Rating

Waterproof Level
```

------

# 21.12 Certification Group

Code:

```
CERTIFICATION
```

Name:

```
认证标准
```

包含：

```
CE

FCC

RoHS

ATEX

Explosion Proof
```

------

# 22. Core Parameter Definition Seed

## Table

```
parameter_definition
```

------

# 22.1 Probe Diameter

Code:

```
PROBE_DIAMETER
```

Name:

中文：

```
探头直径
```

English:

```
Probe Diameter
```

Group:

```
PROBE
```

Value Type:

```
NUMBER
```

Unit:

```
mm
```

Searchable:

```
YES
```

Filterable:

```
YES
```

Comparable:

```
YES
```

------

# 22.2 Probe Length

Code:

```
PROBE_LENGTH
```

Name:

```
探管长度
```

Type:

```
NUMBER
```

Unit:

```
m
```

Searchable:

```
YES
```

------

# 22.3 Sensor Type

Code:

```
SENSOR_TYPE
```

Name:

```
图像传感器类型
```

Type:

```
ENUM
```

Values:

```
CMOS

CCD
```

------

# 22.4 Resolution

Code:

```
IMAGE_RESOLUTION
```

Name:

```
图像分辨率
```

Type:

```
NUMBER
```

Unit:

```
pixel
```

Example:

```
300000

1000000

2000000

3000000
```

------

# 22.5 Viewing Direction

Code:

```
VIEWING_DIRECTION
```

Name:

```
镜头视向
```

Type:

```
ENUM
```

Values:

```
STRAIGHT_VIEW

SIDE_VIEW

DUAL_VIEW
```

------

# 22.6 Field Of View

Code:

```
FIELD_OF_VIEW
```

Name:

```
视场角
```

Type:

```
NUMBER
```

Unit:

```
degree
```

------

# 22.7 Depth Of Field

Code:

```
DEPTH_OF_FIELD
```

Name:

```
景深
```

Type:

```
RANGE
```

Unit:

```
mm
```

------

# 22.8 Articulation

Code:

```
PROBE_ARTICULATION
```

Name:

```
镜头导向
```

Type:

```
ENUM
```

Values:

```
NONE

MANUAL_180

MANUAL_360

ELECTRIC_180

ELECTRIC_360
```

------

# 22.9 Light Source

Code:

```
LIGHT_SOURCE
```

Name:

```
光源类型
```

Type:

```
ENUM
```

Values:

```
LED

FIBER

LASER

INFRARED
```

------

# 22.10 Screen Size

Code:

```
DISPLAY_SIZE
```

Name:

```
显示屏尺寸
```

Type:

```
NUMBER
```

Unit:

```
inch
```

------

# 22.11 Operating Temperature

Code:

```
OPERATING_TEMPERATURE
```

Name:

```
工作温度
```

Type:

```
RANGE
```

Unit:

```
℃
```

------

# 22.12 IP Rating

Code:

```
IP_RATING
```

Name:

```
防护等级
```

Type:

```
ENUM
```

Values:

```
IP54

IP65

IP67

IP68
```

------

# 23. Parameter Template Seed

## Table

```
parameter_template
```

------

# 23.1 Industrial Endoscope Template

Code:

```
TPL_INDUSTRIAL_ENDOSCOPE
```

Name:

```
工业内窥镜参数模板
```

Contains:

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
```

------

# 23.2 Pipeline Inspection Template

Code:

```
TPL_PIPELINE_INSPECTION
```

Name:

```
管道检测设备参数模板
```

Contains:

```
Probe

Camera

Cable

Navigation

Distance

Protection
```

------

# 24. Parameter Template Item Rules

## Table

```
parameter_template_item
```

------

每个模板项必须定义：

```
parameter_definition_id

display_order

required

filterable

searchable

comparable

display_mode
```

------

# 25. Parameter Seed Constraints

## Rule 01

禁止：

产品保存参数名称。

错误：

```
product.parameter_name
```

正确：

```
product_parameter_value

        ↓

parameter_definition
```

------

## Rule 02

参数代码永久稳定。

例如：

```
PROBE_DIAMETER
```

禁止修改为：

```
DIAMETER_OF_PROBE
```

------

## Rule 03

新增参数：

必须经过：

```
Parameter Review

        ↓

Version Update

        ↓

Migration
```

------

# 26. Parameter Master Seed Status

| Table                   | Status  |
| ----------------------- | ------- |
| parameter_group         | Defined |
| parameter_definition    | Defined |
| parameter_template      | Defined |
| parameter_template_item | Defined |

# 27. Capability & Feature Master Seed Overview

## 27.1 Purpose

Capability & Feature Master Seed 用于初始化：

VISNDT 平台产品能力体系与产品功能体系。

对应数据库：

```
Capability Domain

Feature Domain
```

涉及表：

```
capability_definition

feature_definition
```

------

# 27.2 Design Principle

平台严格区分：

```
Capability

能力
```

与：

```
Feature

功能
```

定义：

## Capability

描述：

产品能够完成什么检测能力。

例如：

```
360° Articulation

Stereo Measurement

High Temperature Inspection

Explosion Proof
```

------

## Feature

描述：

产品提供哪些操作功能。

例如：

```
Photo Capture

Video Recording

Image Freeze

Report Export
```

------

# 27.3 Ownership

Capability：

```
Platform Master Data
```

Feature：

```
Platform Master Data
```

供应商：

仅引用。

禁止：

创建平台能力。

------

# 28. Capability Definition Seed

## Table

```
capability_definition
```

------

# 28.1 Imaging Capability

## HD Imaging

Code:

```
HD_IMAGING
```

Name:

中文：

```
高清成像
```

English:

```
High Definition Imaging
```

Category:

```
IMAGING
```

Description:

```
支持高清图像采集和显示。
```

Search Weight:

```
80
```

AI Weight:

```
80
```

------

## Ultra High Resolution

Code:

```
ULTRA_HIGH_RESOLUTION
```

Name:

```
超高清分辨率
```

Description:

```
支持高像素图像检测。
```

AI Weight:

```
90
```

------

# 28.2 Probe Capability

## Flexible Probe

Code:

```
FLEXIBLE_PROBE
```

Name:

```
柔性探头
```

Description:

```
适用于复杂内部空间检测。
```

------

## Small Diameter Inspection

Code:

```
SMALL_DIAMETER_INSPECTION
```

Name:

```
小孔径检测
```

Description:

```
适用于狭小空间内部检查。
```

Search Weight:

```
95
```

------

## Long Reach Inspection

Code:

```
LONG_REACH_INSPECTION
```

Name:

```
深度检测能力
```

Description:

```
支持较长距离内部检测。
```

------

# 28.3 Measurement Capability

## Stereo Measurement

Code:

```
STEREO_MEASUREMENT
```

Name:

```
立体测量
```

Description:

```
通过双目视觉实现尺寸测量。
```

AI Weight:

```
95
```

------

## 3D Measurement

Code:

```
THREE_DIMENSIONAL_MEASUREMENT
```

Name:

```
三维测量
```

Description:

```
支持三维尺寸分析。
```

------

## Dimension Analysis

Code:

```
DIMENSION_ANALYSIS
```

Name:

```
尺寸分析
```

------

# 28.4 Environment Capability

## High Temperature Resistance

Code:

```
HIGH_TEMPERATURE_RESISTANCE
```

Name:

```
耐高温检测
```

Description:

```
适用于高温环境内部检测。
```

------

## Explosion Proof

Code:

```
EXPLOSION_PROOF
```

Name:

```
防爆能力
```

Description:

```
适用于危险区域检测。
```

------

## Waterproof

Code:

```
WATERPROOF
```

Name:

```
防水能力
```

------

# 28.5 AI Recognition Capability

## AI Defect Recognition

Code:

```
AI_DEFECT_RECOGNITION
```

Name:

```
AI缺陷识别
```

Description:

```
利用人工智能辅助识别检测缺陷。
```

AI Weight:

```
100
```

------

# 29. Capability Seed List Summary

| Code                          | Name         |
| ----------------------------- | ------------ |
| HD_IMAGING                    | 高清成像     |
| ULTRA_HIGH_RESOLUTION         | 超高清分辨率 |
| FLEXIBLE_PROBE                | 柔性探头     |
| SMALL_DIAMETER_INSPECTION     | 小孔径检测   |
| LONG_REACH_INSPECTION         | 深度检测能力 |
| STEREO_MEASUREMENT            | 立体测量     |
| THREE_DIMENSIONAL_MEASUREMENT | 三维测量     |
| DIMENSION_ANALYSIS            | 尺寸分析     |
| HIGH_TEMPERATURE_RESISTANCE   | 耐高温检测   |
| EXPLOSION_PROOF               | 防爆能力     |
| WATERPROOF                    | 防水能力     |
| AI_DEFECT_RECOGNITION         | AI缺陷识别   |

------

# 30. Feature Definition Seed

## Table

```
feature_definition
```

------

# 30.1 Image Operation Features

## Photo Capture

Code:

```
PHOTO_CAPTURE
```

Name:

```
拍照
```

Description:

```
保存检测图片。
```

------

## Video Recording

Code:

```
VIDEO_RECORDING
```

Name:

```
录像
```

Description:

```
保存检测过程视频。
```

------

## Image Freeze

Code:

```
IMAGE_FREEZE
```

Name:

```
图像冻结
```

------

## Image Rotation

Code:

```
IMAGE_ROTATION
```

Name:

```
图像旋转
```

------

# 30.2 Measurement Features

## Measurement Report

Code:

```
MEASUREMENT_REPORT
```

Name:

```
测量报告生成
```

------

## Annotation

Code:

```
IMAGE_ANNOTATION
```

Name:

```
图像标注
```

------

# 30.3 Communication Features

## WiFi Preview

Code:

```
WIFI_PREVIEW
```

Name:

```
WiFi实时预览
```

------

## Remote Control

Code:

```
REMOTE_CONTROL
```

Name:

```
远程控制
```

------

## Data Export

Code:

```
DATA_EXPORT
```

Name:

```
数据导出
```

------

# 30.4 System Features

## Firmware Upgrade

Code:

```
OTA_UPGRADE
```

Name:

```
OTA升级
```

------

## Multi Language

Code:

```
MULTI_LANGUAGE
```

Name:

```
多语言支持
```

------

# 31. Feature Seed List Summary

| Code               | Name       |
| ------------------ | ---------- |
| PHOTO_CAPTURE      | 拍照       |
| VIDEO_RECORDING    | 录像       |
| IMAGE_FREEZE       | 图像冻结   |
| IMAGE_ROTATION     | 图像旋转   |
| MEASUREMENT_REPORT | 测量报告   |
| IMAGE_ANNOTATION   | 图像标注   |
| WIFI_PREVIEW       | WiFi预览   |
| REMOTE_CONTROL     | 远程控制   |
| DATA_EXPORT        | 数据导出   |
| OTA_UPGRADE        | OTA升级    |
| MULTI_LANGUAGE     | 多语言支持 |

------

# 32. Capability / Feature Relation Rules

## Rule 01

Capability 不直接存入 Product。

错误：

```
standard_product.capability
```

正确：

```
standard_product

        ↓

product_capability

        ↓

capability_definition
```

------

## Rule 02

Feature 不直接存入 Product。

错误：

```
standard_product.features
```

正确：

```
standard_product

        ↓

product_feature

        ↓

feature_definition
```

------

## Rule 03

Capability 用于：

```
AI Matching

Search

Recommendation

Compare
```

Feature 用于：

```
Product Display

User Selection

Specification Presentation
```

------

# 33. AI Search Weight Rules

Capability:

影响：

```
需求匹配
```

权重：

```
70-100
```

Feature:

影响：

```
产品展示
```

权重：

```
30-70
```

------

# 34. Capability & Feature Seed Status

| Table                 | Status  |
| --------------------- | ------- |
| capability_definition | Defined |
| feature_definition    | Defined |

# 35. Organization & Offer Master Seed Overview

## 35.1 Purpose

Organization & Offer Master Seed 用于初始化：

VISNDT 平台组织体系及供应能力关联基础数据。

对应数据库：

```
Organization Domain

Commercial Domain
```

涉及核心表：

```
organization

organization_type

offer

offer_capability

offer_service_type
```

------

# 35.2 Business Positioning

VISNDT 平台不是供应商商城。

组织体系设计原则：

```
Platform

    │

    ├── Manufacturer

    │

    ├── Supplier

    │

    ├── Service Provider

    │

    └── Partner
```

平台负责：

- 产品信息组织
- 能力匹配
- 需求撮合

不负责：

- 商品交易
- 库存管理
- 在线报价

------

# 35.3 Organization Ownership

Organization：

属于：

```
Business Entity
```

创建来源：

```
Platform Admin

Supplier Registration

Business Verification
```

------

# 36. Organization Type Seed

## Table

```
organization_type
```

------

# 36.1 Manufacturer

Code:

Name:

中文：

```
制造商
```

English:

```
Manufacturer
```

Description:

```
拥有产品研发、生产能力的企业。
```

------

# 36.2 Supplier

Code:

Name:

```
供应商
```

English:

Description:

```
提供产品销售、渠道服务的企业。
```

------

# 36.3 Distributor

Code:

Name:

```
经销商
```

Description:

```
区域销售和渠道合作伙伴。
```

------

# 36.4 Service Provider

Code:

Name:

```
检测服务商
```

Description:

```
提供检测、维修、技术服务。
```

------

# 36.5 Research Institution

Code:

Name:

```
科研机构
```

Description:

```
高校、实验室及研究机构。
```

------

# 37. Organization Status Seed

## Table

------

## Status Values

### Pending

Code:

说明：

```
待审核
```

------

### Verified

Code:

说明：

```
已认证
```

------

### Suspended

Code:

说明：

```
暂停合作
```

------

### Archived

Code:

说明：

```
归档
```

------

# 38. Organization Seed Rules

## Rule 01

平台默认：

不创建真实企业数据。

Production Seed：

只创建：

```
Organization Type
```

不创建：

```
organization
```

------

## Rule 02

开发环境：

允许：

```
Demo Organization
```

示例：

```
Demo Inspection Equipment Manufacturer
```

------

# 39. Offer Master Seed

## 39.1 Purpose

Offer 表示：

组织提供的产品或服务能力。

关系：

```
Organization

        ↓

Offer

        ↓

Product / Capability
```

------

# 39.2 Offer Type Seed

## Product Supply

Code:

Name:

```
产品供应
```

说明：

```
提供标准产品销售能力。
```

------

## Technical Service

Code:

Name:

```
技术服务
```

说明：

```
提供检测、培训、维修等服务。
```

------

## Custom Solution

Code:

Name:

```
定制解决方案
```

说明：

```
提供行业应用解决方案。
```

------

# 40. Offer Status Seed

## Active

Code:

说明：

```
当前有效。
```

------

## Review

Code:

说明：

```
审核中。
```

------

## Expired

Code:

说明：

```
已失效。
```

------

# 41. Offer Capability Seed

## Table

```
offer_capability
```

------

Offer 与 Capability 关联：

例如：

Organization：

```
某工业检测设备企业
```

Offer：

```
视频内窥检测设备供应
```

关联 Capability：

```
HD_IMAGING

SMALL_DIAMETER_INSPECTION

STEREO_MEASUREMENT
```

------

# 42. Offer Service Type Seed

## Table

```
offer_service_type
```

------

# 42.1 Product Sales

Code:

中文：

```
产品销售
```

------

# 42.2 Technical Support

Code:

中文：

```
技术支持
```

------

# 42.3 Installation

Code:

中文：

```
安装调试
```

------

# 42.4 Training

Code:

中文：

```
培训服务
```

------

# 42.5 Repair

Code:

中文：

```
维修服务
```

------

# 43. Organization & Offer Relationship Rules

## Rule 01

一个 Organization：

可以：

```
多个 Offer
```

------

## Rule 02

一个 Offer：

可以：

```
多个 Capability
```

------

## Rule 03

Offer 不等于 Product。

错误：

```
Offer = Product
```

正确：

```
Product

        +

Organization

        +

Capability

        ↓

Offer
```

------

# 44. Supplier Visibility Rules

平台展示：

允许：

```
Organization Name

Verified Status

Capability Tags
```

------

禁止：

```
Supplier Direct Contact

Private Price

Transaction Data
```

------

# 45. Organization & Offer Seed Status

| Table               | Status  |
| ------------------- | ------- |
| organization_type   | Defined |
| organization_status | Defined |
| offer_type          | Defined |
| offer_status        | Defined |
| service_type        | Defined |
| capability_relation | Defined |

# 46. Dictionary & System Configuration Overview

## 46.1 Purpose

Dictionary & System Configuration Seed 用于初始化：

VISNDT 平台通用字典、枚举值及系统运行配置。

对应数据库：

```
Dictionary Domain

System Configuration Domain
```

涉及表：

```
dictionary

dictionary_item

system_setting
```

------

# 46.2 Design Principle

系统字典负责：

```
统一编码

统一显示

统一枚举

统一状态
```

系统配置负责：

```
平台运行参数

业务规则参数

功能开关
```

------

# 46.3 Ownership

Dictionary：

```
Platform Master Data
```

System Setting：

```
Platform Configuration
```

供应商：

无权限修改。

------

# 47. Dictionary Seed Specification

## Table

```
dictionary
```

------

# 47.1 Product Type Dictionary

Code:

Name:

```
产品类型
```

Items:

## Portable

Code:

Name:

```
便携式
```

------

## Desktop

Code:

Name:

```
台式
```

------

## Tablet

Code:

Name:

```
平板式
```

------

# 47.2 Inspection Industry Dictionary

Code:

Name:

```
检测行业
```

Items:

## Aerospace

Code:

Name:

```
航空航天
```

------

## Automotive

Code:

Name:

```
汽车制造
```

------

## Energy

Code:

Name:

```
能源电力
```

------

## Petrochemical

Code:

Name:

```
石油化工
```

------

## Manufacturing

Code:

Name:

```
机械制造
```

------

# 47.3 Product Status Dictionary

Code:

Items:

## Draft

Code:

Name:

------

## Review

Code:

Name:

------

## Published

Code:

Name:

------

## Archived

Code:

Name:

------

# 47.4 Requirement Status Dictionary

Code:

Items:

## Submitted

Code:

Name:

------

## Matching

Code:

Name:

------

## Contacted

Code:

Name:

------

## Completed

Code:

Name:

------

## Closed

Code:

Name:

------

# 47.5 Verification Status Dictionary

Code:

Items:

## Unverified

Code:

Name:

------

## Verified

Code:

Name:

------

## Rejected

Code:

Name:

------

# 48. Parameter Value Dictionary

## 48.1 Viewing Direction

Dictionary:

Items:

| Code          | Name     |
| ------------- | -------- |
| STRAIGHT_VIEW | 直视     |
| SIDE_VIEW     | 侧视     |
| DUAL_VIEW     | 直侧一体 |

------

## 48.2 Light Source

Dictionary:

Items:

| Code     | Name     |
| -------- | -------- |
| LED      | LED光源  |
| FIBER    | 光纤光源 |
| LASER    | 激光光源 |
| INFRARED | 红外光源 |

------

## 48.3 Guidance Type

Dictionary:

Items:

| Code         | Name     |
| ------------ | -------- |
| NONE         | 无导向   |
| MANUAL_180   | 手动180° |
| MANUAL_360   | 手动360° |
| ELECTRIC_180 | 电动180° |
| ELECTRIC_360 | 电动360° |

------

# 49. System Configuration Seed

## Table

```
system_setting
```

------

# 49.1 Platform Information

## Platform Name

Key:

Value:

------

## Platform Version

Key:

Value:

------

# 49.2 Search Configuration

## Default Page Size

Key:

Value:

------

## Maximum Filter Count

Key:

Value:

------

## Enable Semantic Search

Key:

Value:

------

# 49.3 Matching Configuration

## Capability Weight

Key:

Value:

------

## Parameter Weight

Key:

Value:

------

## Industry Weight

Key:

Value:

------

# 49.4 Contact Protection Configuration

## Hide Demand Contact

Key:

Value:

说明：

```
需求方联系方式默认保护。
```

------

## Supplier Contact Through Platform

Key:

Value:

说明：

```
供应商联系需经过平台流程。
```

------

# 49.5 Upload Configuration

## Maximum File Size

Key:

Value:

------

## Allowed Image Type

Key:

Value:

------

# 50. Dictionary Management Rules

## Rule 01

Dictionary Code 永久稳定。

例如：

```
VIEWING_DIRECTION
```

禁止：

```
VIEW_DIRECTION_TYPE
```

------

## Rule 02

删除字典项：

只能：

```
Deprecated
```

禁止：

物理删除。

------

## Rule 03

新增字典：

流程：

```
Business Requirement

        ↓

Schema Review

        ↓

Seed Update

        ↓

Migration
```

------

# 51. System Configuration Rules

## Rule 01

生产配置：

必须版本管理。

------

## Rule 02

敏感配置：

禁止进入 Seed。

例如：

```
Database Password

API Key

Secret Token
```

------

## Rule 03

环境差异配置：

通过：

```
Environment Variable
```

管理。

------

# 52. Dictionary & System Seed Status

| Table           | Status  |
| --------------- | ------- |
| dictionary      | Defined |
| dictionary_item | Defined |
| system_setting  | Defined |

# 53. Security & RBAC Seed Overview

## 53.1 Purpose

Security & RBAC Seed 用于初始化：

VISNDT 平台身份、角色、权限及访问控制体系。

对应数据库：

```
Identity Domain

Authorization Domain
```

涉及核心表：

```
role

permission

role_permission

system_user_role
```

------

# 53.2 Security Design Principle

平台采用：

```
RBAC

(Role Based Access Control)
```

访问模型：

```
User

 ↓

Role

 ↓

Permission

 ↓

Resource
```

------

# 53.3 Security Boundary

VISNDT 平台角色分为：

```
Platform Layer

        │

        ├── Super Admin

        ├── Platform Admin

        ├── Content Manager

        ├── Product Manager


Business Layer

        │

        ├── Organization Admin

        ├── Supplier User

        ├── Buyer User


Public Layer

        │

        └── Visitor
```

------

# 54. Role Master Seed

## Table

```
role
```

------

# 54.1 SUPER_ADMIN

Code:

Name:

```
超级管理员
```

Scope:

```
SYSTEM
```

Description:

```
拥有平台全部管理权限。
```

Permissions:

```
ALL
```

------

# 54.2 PLATFORM_ADMIN

Code:

Name:

```
平台管理员
```

Scope:

Description:

```
负责平台日常运营管理。
```

Permissions:

```
USER_MANAGEMENT

ROLE_MANAGEMENT

SYSTEM_CONFIGURATION

AUDIT_VIEW
```

------

# 54.3 CONTENT_MANAGER

Code:

Name:

```
内容管理员
```

Scope:

Description:

```
负责平台内容维护。
```

Permissions:

```
CONTENT_CREATE

CONTENT_UPDATE

CONTENT_PUBLISH

CONTENT_ARCHIVE
```

------

# 54.4 PRODUCT_MANAGER

Code:

Name:

```
产品管理员
```

Scope:

Description:

```
负责产品库维护。
```

Permissions:

```
PRODUCT_CREATE

PRODUCT_UPDATE

PRODUCT_REVIEW

PRODUCT_PUBLISH
```

------

# 54.5 ORGANIZATION_ADMIN

Code:

Name:

```
企业管理员
```

Scope:

Description:

```
管理所属企业资料。
```

Permissions:

```
ORGANIZATION_UPDATE

OFFER_CREATE

OFFER_UPDATE

TEAM_MANAGEMENT
```

------

# 54.6 SUPPLIER_USER

Code:

Name:

```
供应商用户
```

Scope:

Description:

```
企业普通用户。
```

Permissions:

```
OFFER_VIEW

REQUIREMENT_RESPONSE
```

------

# 54.7 BUYER_USER

Code:

Name:

```
采购用户
```

Scope:

Description:

```
需求提交用户。
```

Permissions:

```
REQUIREMENT_CREATE

REQUIREMENT_VIEW

MATCHING_VIEW
```

------

# 54.8 VISITOR

Code:

Name:

```
游客
```

Scope:

Permissions:

```
PUBLIC_VIEW
```

------

# 55. Permission Master Seed

## Table

```
permission
```

------

# 55.1 User Management Permissions

## USER_VIEW

Code:

Name:

------

## USER_CREATE

Code:

Name:

------

## USER_UPDATE

Code:

Name:

------

## USER_DELETE

Code:

Name:

------

# 55.2 Product Permissions

## PRODUCT_VIEW

Code:

Name:

------

## PRODUCT_CREATE

Code:

Name:

------

## PRODUCT_UPDATE

Code:

Name:

------

## PRODUCT_PUBLISH

Code:

Name:

------

# 55.3 Requirement Permissions

## REQUIREMENT_CREATE

Code:

Name:

------

## REQUIREMENT_VIEW

Code:

Name:

------

## REQUIREMENT_MATCH

Code:

Name:

------

## REQUIREMENT_RESPONSE

Code:

Name:

------

# 55.4 Organization Permissions

## ORGANIZATION_VIEW

Code:

Name:

------

## ORGANIZATION_UPDATE

Code:

Name:

------

## OFFER_CREATE

Code:

Name:

------

## OFFER_UPDATE

Code:

Name:

------

# 55.5 System Permissions

## SYSTEM_CONFIG

Code:

Name:

------

## AUDIT_VIEW

Code:

Name:

------

# 56. Role Permission Mapping Seed

## SUPER_ADMIN

拥有：

```
ALL
```

------

## PLATFORM_ADMIN

Mapping:

```
USER_VIEW

USER_CREATE

USER_UPDATE

ROLE_MANAGEMENT

SYSTEM_CONFIG

AUDIT_VIEW
```

------

## PRODUCT_MANAGER

Mapping:

```
PRODUCT_VIEW

PRODUCT_CREATE

PRODUCT_UPDATE

PRODUCT_PUBLISH
```

------

## CONTENT_MANAGER

Mapping:

```
CONTENT_CREATE

CONTENT_UPDATE

CONTENT_PUBLISH
```

------

## ORGANIZATION_ADMIN

Mapping:

```
ORGANIZATION_VIEW

ORGANIZATION_UPDATE

OFFER_CREATE

OFFER_UPDATE
```

------

## SUPPLIER_USER

Mapping:

```
OFFER_VIEW

REQUIREMENT_RESPONSE
```

------

## BUYER_USER

Mapping:

```
REQUIREMENT_CREATE

REQUIREMENT_VIEW

MATCHING_VIEW
```

------

## VISITOR

Mapping:

```
PUBLIC_VIEW
```

------

# 57. Data Access Scope Rules

## Rule 01

Platform Role:

可访问：

```
ALL ORGANIZATION DATA
```

------

## Rule 02

Organization Role:

只能访问：

```
CURRENT ORGANIZATION DATA
```

------

## Rule 03

Supplier User:

禁止查看：

```
Other Supplier Data

Private Requirement Contact

Commercial Information
```

------

## Rule 04

Buyer User:

默认隐藏：

```
Supplier Private Contact
```

------

# 58. Security Seed Constraints

## Rule 01

权限代码永久稳定。

例如：

```
PRODUCT_CREATE
```

禁止修改。

------

## Rule 02

删除角色：

必须：

```
Disable
```

禁止：

物理删除。

------

## Rule 03

新增权限：

必须经过：

```
Security Review

        ↓

Permission Definition

        ↓

Migration
```

------

# 59. Security & RBAC Seed Status

| Table              | Status  |
| ------------------ | ------- |
| role               | Defined |
| permission         | Defined |
| role_permission    | Defined |
| access_scope_rules | Defined |

# 60. Audit & Operational Seed Overview

## 60.1 Purpose

Audit Log & Operational Data Seed 用于初始化：

VISNDT 平台运行审计体系、操作事件体系以及系统运营基础数据。

对应数据库：

```
Audit Domain

Operation Domain
```

涉及核心表：

```
audit_log

operation_event

system_operation_type
```

------

# 60.2 Design Principle

平台所有关键操作：

必须：

```
可追踪

可审计

可回溯
```

审计数据用于：

- 安全分析
- 问题追踪
- 用户行为分析
- 系统运营管理

------

# 60.3 Audit Data Ownership

Audit Log：

系统自动生成。

原则：

```
User Action

        ↓

Application Layer

        ↓

Audit Record
```

禁止：

用户直接修改。

------

# 61. Audit Event Type Seed

## Table

```
system_operation_type
```

------

# 61.1 Authentication Events

## LOGIN_SUCCESS

Code:

Name:

```
登录成功
```

Description:

```
用户成功登录系统。
```

------

## LOGIN_FAILED

Code:

Name:

```
登录失败
```

Description:

```
用户认证失败。
```

------

## LOGOUT

Code:

Name:

```
退出登录
```

------

# 61.2 User Management Events

## USER_CREATED

Code:

Name:

```
创建用户
```

------

## USER_UPDATED

Code:

Name:

```
修改用户
```

------

## USER_DISABLED

Code:

Name:

```
禁用用户
```

------

# 61.3 Product Management Events

## PRODUCT_CREATED

Code:

Name:

```
创建产品
```

------

## PRODUCT_UPDATED

Code:

Name:

```
修改产品
```

------

## PRODUCT_PUBLISHED

Code:

Name:

```
发布产品
```

------

## PRODUCT_ARCHIVED

Code:

Name:

```
归档产品
```

------

# 61.4 Requirement Events

## REQUIREMENT_CREATED

Code:

Name:

```
创建需求
```

------

## REQUIREMENT_MATCHED

Code:

Name:

```
需求匹配
```

------

## REQUIREMENT_RESPONDED

Code:

Name:

```
供应响应
```

------

# 61.5 Organization Events

## ORGANIZATION_CREATED

Code:

Name:

```
创建企业
```

------

## ORGANIZATION_VERIFIED

Code:

Name:

```
企业认证
```

------

## OFFER_CREATED

Code:

Name:

```
创建供应能力
```

------

# 62. Audit Log Data Structure Rules

## 62.1 Required Fields

每条 Audit Log：

必须包含：

```
actor_id

operation_type

resource_type

resource_id

timestamp

result
```

------

# 62.2 Resource Type Dictionary

Code:

Values:

| Code         | Meaning  |
| ------------ | -------- |
| USER         | 用户     |
| ORGANIZATION | 企业     |
| PRODUCT      | 产品     |
| OFFER        | 供应能力 |
| REQUIREMENT  | 需求     |
| SYSTEM       | 系统     |

------

# 62.3 Result Dictionary

Code:

Values:

| Code    | Meaning |
| ------- | ------- |
| SUCCESS | 成功    |
| FAILED  | 失败    |
| BLOCKED | 阻止    |

------

# 63. Operational Data Seed

## 63.1 Purpose

Operational Seed 用于初始化：

平台运行所需的基础运营规则。

------

# 63.2 Workflow Status Seed

## Product Workflow

Code:

状态：

```
DRAFT

REVIEW

APPROVED

PUBLISHED

ARCHIVED
```

------

## Requirement Workflow

Code:

状态：

```
CREATED

MATCHING

CONTACTING

COMPLETED

CLOSED
```

------

## Organization Workflow

Code:

状态：

```
REGISTERED

VERIFYING

VERIFIED

SUSPENDED
```

------

# 64. Notification Event Seed

## Table

```
notification_event_type
```

------

# 64.1 Requirement Notification

## New Requirement

Code:

Name:

```
新需求通知
```

------

## Requirement Match

Code:

Name:

```
需求匹配通知
```

------

# 64.2 Product Notification

## Product Review Required

Code:

Name:

```
产品审核通知
```

------

## Product Published

Code:

Name:

```
产品发布通知
```

------

# 65. Audit Retention Policy Seed

## Default Retention

Key:

Value:

说明：

```
默认保存两年审计记录。
```

------

## Login Audit

Key:

Value:

------

## Data Change Audit

Key:

Value:

------

# 66. Operational Seed Constraints

## Rule 01

Audit Event Code：

永久稳定。

例如：

```
PRODUCT_CREATED
```

禁止：

修改含义。

------

## Rule 02

历史审计数据：

禁止删除。

------

## Rule 03

运营状态：

禁止硬删除。

采用：

```
Inactive

Archived
```

------

# 67. Audit & Operational Seed Status

| Table                 | Status  |
| --------------------- | ------- |
| system_operation_type | Defined |
| audit_event_type      | Defined |
| workflow_status       | Defined |
| notification_event    | Defined |
| retention_policy      | Defined |

# 68. Development & Test Seed Overview

## 68.1 Purpose

Development & Test Seed 用于初始化：

VISNDT 开发环境、测试环境以及自动化测试所需基础数据。

目标：

```
快速部署

环境一致

自动测试

功能验证
```

------

# 68.2 Scope

Development Seed：

用于：

```
Developer Local Environment

CI/CD Environment

Staging Environment
```

Test Seed：

用于：

```
Automated Testing

Integration Testing

Demo Verification
```

------

# 68.3 Production Isolation

原则：

```
Development Seed

        ≠

Production Seed
```

禁止：

开发测试数据进入生产数据库。

------

# 69. Environment Data Classification

## 69.1 Master Seed

所有环境共享：

```
Dictionary

Parameter

Capability

Feature

Role
```

------

## 69.2 Demo Seed

仅：

```
Development

Demo
```

包含：

- 示例企业
- 示例产品
- 示例需求

------

## 69.3 Test Seed

仅：

```
Automated Test
```

包含：

- 测试用户
- 测试数据
- 边界数据

------

# 70. Development User Seed

## Table

```
system_user
```

------

# 70.1 Super Admin Demo Account

Username:

Role:

Purpose:

```
平台开发测试管理员
```

Status:

------

# 70.2 Product Manager Demo Account

Username:

Role:

Purpose:

```
测试产品管理流程
```

------

# 70.3 Supplier Demo Account

Username:

Role:

Purpose:

```
测试供应商流程
```

------

# 70.4 Buyer Demo Account

Username:

Role:

Purpose:

```
测试需求流程
```

------

# 71. Demo Organization Seed

## Table

```
organization
```

------

# 71.1 Demo Manufacturer

Code:

Name:

Type:

Status:

Capabilities:

```
HD_IMAGING

FLEXIBLE_PROBE

STEREO_MEASUREMENT
```

------

# 71.2 Demo Supplier

Code:

Name:

Type:

Status:

------

# 72. Demo Product Seed

## Table

```
standard_product
```

------

# 72.1 Demo Product 001

Code:

Name:

Category:

Family:

Status:

Capabilities:

```
HD_IMAGING

FLEXIBLE_PROBE

LED_ILLUMINATION
```

------

# 72.2 Demo Product 002

Code:

Name:

Family:

Status:

Capabilities:

```
STEREO_MEASUREMENT

DIMENSION_ANALYSIS
```

------

# 72.3 Demo Product 003

Code:

Name:

Family:

Status:

Capabilities:

```
LONG_REACH_INSPECTION

WATERPROOF
```

------

# 73. Demo Product Parameter Seed

## VIS-V100

Parameters:

| Parameter         | Value           |
| ----------------- | --------------- |
| Probe Diameter    | 6.0 mm          |
| Resolution        | 1,000,000 Pixel |
| Viewing Direction | Straight View   |
| Light Source      | LED             |
| Display Size      | 5 inch          |
| Probe Length      | 3 m             |

------

## VIS-M200

Parameters:

| Parameter         | Value           |
| ----------------- | --------------- |
| Probe Diameter    | 4.0 mm          |
| Resolution        | 2,000,000 Pixel |
| Measurement       | Stereo          |
| Viewing Direction | Dual View       |
| Display Size      | 8 inch          |

------

## VIS-P300

Parameters:

| Parameter       | Value               |
| --------------- | ------------------- |
| Cable Length    | 30 m                |
| Camera Diameter | 28 mm               |
| Waterproof      | IP68                |
| Lighting        | LED                 |
| Application     | Pipeline Inspection |

------

# 74. Demo Requirement Seed

## Table

```
requirement
```

------

# 74.1 Requirement Example 001

Title:

Description:

```
需要检测直径5mm以内内部孔洞。
```

Parameters:

```
{
  "probe_diameter": "<=5mm",
  "inspection_type": "internal_visual"
}
```

Expected Capability:

```
SMALL_DIAMETER_INSPECTION
```

------

# 74.2 Requirement Example 002

Title:

Description:

```
需要进行长距离管道内部检测。
```

Expected Capability:

------

# 75. Automated Test Data Rules

## Rule 01

测试数据必须：

带前缀：

```
TEST_
```

或者：

------

## Rule 02

测试数据：

必须可重复初始化。

流程：

```
Clean

    ↓

Seed

    ↓

Test
```

------

## Rule 03

测试数据：

禁止包含：

真实客户信息。

------

# 76. CI/CD Seed Execution

## Development

执行：

```
npm run seed:dev
```

------

## Test

执行：

```
npm run seed:test
```

------

## Production

执行：

```
npm run seed:production
```

限制：

```
仅执行 Master Seed
```

------

# 77. Development Seed Status

| Category           | Status  |
| ------------------ | ------- |
| Demo Users         | Defined |
| Demo Organizations | Defined |
| Demo Products      | Defined |
| Demo Requirements  | Defined |
| Test Rules         | Defined |

# 78. Seed Execution Overview

## 78.1 Purpose

Seed Execution & Migration Strategy 用于定义：

VISNDT 数据初始化执行流程、版本控制方式以及环境迁移规范。

目标：

```
可重复部署

可追踪版本

可安全升级

可快速恢复
```

------

# 78.2 Seed Execution Architecture

整体流程：

```
Seed Definition Files

        ↓

Seed Runner

        ↓

Database Transaction

        ↓

Seed Validation

        ↓

Environment Ready
```

------

# 78.3 Seed Categories

Seed 分为：

```
001_Master Seed

002_Business Seed

003_Demo Seed

004_Test Seed
```

------

# 79. Seed Execution Order

## Phase 01

# System Foundation Seed

执行：

```
Dictionary

System Configuration

Role

Permission
```

目的：

建立平台基础能力。

------

## Phase 02

# Product Knowledge Seed

执行：

```
Product Category

Product Family

Parameter Definition

Capability

Feature
```

目的：

建立产品知识模型。

------

## Phase 03

# Organization Seed

执行：

```
Organization Type

Organization Status

Offer Type

Service Type
```

目的：

建立供应体系。

------

## Phase 04

# Workflow Seed

执行：

```
Product Workflow

Requirement Workflow

Organization Workflow
```

目的：

建立业务流程。

------

## Phase 05

# Demo/Test Seed

执行：

仅：

```
Development

Testing
```

------

# 80. Seed Version Management

## 80.1 Version Format

采用：

```
SEED_VERSION_MAJOR.MINOR.PATCH
```

例如：

------

# 80.2 Version Meaning

## Major

重大结构变化：

例如：

```
新增核心领域
```

------

## Minor

新增数据：

例如：

```
新增Capability
```

------

## Patch

修正数据：

例如：

```
修改显示名称
```

------

# 81. Seed File Naming Convention

目录：

```
database/

 └── seed/

      ├── 001_system/

      ├── 002_product/

      ├── 003_business/

      ├── 004_security/

      └── 005_demo/
```

------

文件命名：

格式：

```
{sequence}_{domain}_{description}.seed
```

例如：

```
002_product_category.seed

003_capability_master.seed
```

------

# 82. Transaction Strategy

## Rule 01

每个 Seed Batch：

必须事务执行。

流程：

```
BEGIN

 ↓

Insert

 ↓

Validate

 ↓

COMMIT
```

------

## Rule 02

失败：

自动：

```
ROLLBACK
```

------

## Rule 03

禁止：

部分成功状态。

------

# 83. Seed Validation Rules

## 83.1 Reference Validation

检查：

```
Foreign Key Exists
```

例如：

Product Capability：

必须存在：

```
Capability Definition
```

------

## 83.2 Duplicate Validation

检查：

```
Unique Code
```

例如：

禁止：

```
HD_IMAGING

HD_IMAGING
```

------

## 83.3 Business Validation

检查：

```
Status Compatibility

Relationship Validity
```

例如：

禁止：

```
Archived Product

Active Offer
```

------

# 84. Migration Execution Rules

## Development Environment

流程：

```
Reset Database

        ↓

Run Schema Migration

        ↓

Run Master Seed

        ↓

Run Demo Seed
```

------

## Test Environment

流程：

```
Create Database

        ↓

Schema Migration

        ↓

Master Seed

        ↓

Test Seed

        ↓

Execute Tests
```

------

## Production Environment

流程：

```
Backup

        ↓

Schema Migration

        ↓

Master Seed Update

        ↓

Validation

        ↓

Release
```

------

# 85. Production Seed Rules

## Rule 01

生产环境：

只允许：

```
Master Seed
```

------

禁止：

```
Demo Seed

Test Seed
```

------

## Rule 02

生产 Seed 修改：

必须：

```
Code Review

Migration Review

Rollback Plan
```

------

## Rule 03

删除数据：

采用：

```
Deprecated Flag
```

禁止：

直接删除。

------

# 86. Rollback Strategy

## 86.1 Seed Rollback

每个 Seed：

需要记录：

```
Migration Version

Executed Time

Operator

Affected Records
```

------

## 86.2 Rollback Methods

### Method 01

反向 Migration:

```
Down Script
```

------

### Method 02

数据恢复：

```
Backup Restore
```

------

# 87. Seed Monitoring

## Required Metrics

记录：

```
Seed Execution Time

Inserted Count

Updated Count

Failed Count

Validation Result
```

------

# 88. Seed Execution Command Standard

## Initialize

```
npm run db:seed
```

------

## Development Reset

```
npm run db:reset:dev
```

------

## Validate

```
npm run db:seed:validate
```

------

# 89. 406 Seed Specification Final Status

| Block                 | Status    |
| --------------------- | --------- |
| Document Strategy     | Completed |
| Product Master Seed   | Completed |
| Parameter Master Seed | Completed |
| Capability Seed       | Completed |
| Organization Seed     | Completed |
| Dictionary Seed       | Completed |
| Security Seed         | Completed |
| Audit Seed            | Completed |
| Development Seed      | Completed |
| Execution Strategy    | Completed |