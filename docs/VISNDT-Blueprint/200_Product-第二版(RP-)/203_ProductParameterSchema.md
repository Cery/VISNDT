# Product Parameter Schema v2.0

Document ID

203

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Product Parameter Schema 是 VISNDT 产品中心的统一参数标准。

参数体系服务于：

• 产品展示
• 参数筛选
• 产品比较
• AI 检索
• RAG
• RFQ
• Demand Matching
• Specification Export
• API
• Open Data

参数体系不是数据库字段。

数据库只保存：

Parameter Definition

+

Parameter Value

实现无限扩展。

---

# 2. Parameter Architecture

Parameter Group

↓

Parameter Definition

↓

Parameter Option

↓

Parameter Value

↓

Search Index

↓

AI Embedding

---

# 3. Parameter Principles

统一定义

统一单位

统一类型

统一编码

统一国际化

统一校验

统一排序

统一搜索

统一 AI 标签

平台维护参数定义。

企业仅填写参数值。

---

# 4. Parameter Group

参数按 Group 管理。

第一阶段冻结：

Basic Information

Optical System

Imaging System

Probe

Articulation

Illumination

Measurement

Display

Storage

Communication

Power

Mechanical

Environment

Compatibility

Software

Certification

Package

Service

Extension

Custom

Group 允许继续增加。

---

# 5. Parameter Definition

每一个参数必须包含：

Parameter ID

Code

Chinese Name

English Name

Description

Group

Value Type

Unit

Required

Searchable

Comparable

Filterable

Sortable

AI Enabled

Public

Default Value

Validation Rule

Display Order

Status

Version

---

# 6. Parameter Value Type

支持：

Boolean

Integer

Decimal

String

Long Text

Enum

Multi Enum

Date

DateTime

JSON

URL

File

Image

Video

Range

Array

---

# 7. Parameter Unit

单位统一维护。

例如：

mm

cm

m

inch

μm

kg

g

℃

°F

°

pixel

MP

fps

GB

TB

V

A

W

Hz

kHz

MHz

GHz

Lux

IP

N

Pa

Bar

统一换算。

AI 使用统一标准单位。

---

# 8. Validation Rule

支持：

Min

Max

Regex

Precision

Length

Enum

Required

Unique

Custom Validation

Example：

Probe Diameter

0.5 mm

~

20 mm

---

# 9. Parameter Template

Category

↓

Parameter Template

↓

Family

↓

Series

↓

Standard Product

支持：

继承

覆盖

新增

禁止删除父级参数。

---

# 10. Industrial Borescope Parameter Groups

以工业电子内窥镜为例：

Basic

Product Name

Model

Manufacturer

Series

Probe

Probe Diameter

Probe Length

Probe Material

Working Channel

Insertion Tube

Bending Radius

Optical

Field of View

Depth of Field

Direction of View

Focus

Lens

Resolution

Imaging

Sensor

Pixel

Video Resolution

Photo Resolution

Frame Rate

Codec

Illumination

LED Type

Brightness

Fiber Lighting

Measurement

Stereo Measurement

3D Measurement

Comparison Measurement

Laser Measurement

Display

Screen Size

Resolution

Touch

Communication

USB

HDMI

Wi-Fi

Bluetooth

Ethernet

Power

Battery

Runtime

Charging

Mechanical

Weight

Dimension

Waterproof

Drop Resistance

Operating Temperature

Storage Temperature

Certification

CE

FCC

RoHS

IP Rating

Explosion Proof

---

# 11. AI Metadata

每个参数维护：

Synonym

Alias

Industry Mapping

Capability Mapping

Material Mapping

Inspection Mapping

Weight

Importance

Semantic Description

Embedding Weight

AI 自动生成：

Parameter Vector。

---

# 12. Search Strategy

支持：

Exact Match

Full Text

Synonym

Range Query

Comparison

Filter

Hybrid Search

Vector Search

Natural Language Search

Example：

"6毫米双镜头工业内窥镜"

AI 自动转换：

Probe Diameter=6mm

Dual Camera=True

Category=Industrial Borescope

---

# 13. Compare Strategy

参数支持：

Compare

Highlight Difference

Hide Same

Export Compare Sheet

AI Compare Summary

支持：

2~10 个产品比较。

---

# 14. RFQ Mapping

RFQ 自动引用：

Parameter Template。

采购方：

勾选参数。

系统自动生成：

RFQ 技术规格。

供应商：

直接填写：

报价。

无需重新输入参数。

---

# 15. Demand Matching

Demand：

引用 Parameter。

AI 自动匹配：

Product。

Offer。

Knowledge。

Supplier。

形成推荐列表。

---

# 16. Internationalization

Parameter 包含：

Chinese

English

Description

Alias

Synonym

AI Prompt

SEO Keywords

未来支持：

Japanese

German

French

Korean

Spanish

---

# 17. Version Control

Parameter Definition

Version

Parameter Template

Version

Product Parameter

Version

重要修改：

全部保留历史版本。

支持：

Diff。

Rollback。

Audit。

---

# 18. Data Governance

平台维护：

Parameter Definition

Parameter Group

Parameter Unit

Validation Rule

AI Metadata

企业：

只能维护：

Parameter Value。

禁止修改：

参数定义。

---

# 19. Extension Strategy

Release 2.0

预留：

Dynamic Formula

Derived Parameter

AI Generated Parameter

Industry Parameter Package

Template Marketplace

Customer Template

不会影响当前数据库设计。