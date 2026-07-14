# Product Relationship Model

Document ID

205

Version

2.0 Final

Status

Frozen

---

# 1. Design Goal

Relationship Model 定义 Product Center 与平台其它业务域之间的关系。

目标：

建立统一、稳定、低耦合的数据引用体系。

所有业务均通过 Product ID 建立关联。

禁止跨业务域复制产品数据。

---

# 2. Core Relationship

                    Product Center
                          │
 ┌──────────────┬──────────┼──────────┬─────────────┐
 │              │          │          │             │
 ▼              ▼          ▼          ▼             ▼
Offer      Knowledge    Demand      RFQ      AI Knowledge Graph
 │              │          │          │             │
 └──────────────┴──────────┴──────────┴─────────────┘
                          │
                    Statistics
                          │
                     Workflow

# 3. Product → Organization

Relationship

Many To Many

说明：

一个企业：

可以维护多个 Offer。

多个企业：

可以引用同一个 Product。

因此：

Product 与 Organization

不直接关联。

关联路径：

Organization

↓

Offer

↓

Product

优势：

避免：

重复产品。

重复参数。

重复图片。

---

# 4. Product → Offer

Relationship

One To Many

Product

1

↓

N

Offer

一个标准产品：

允许：

多个供应商。

多个地区。

多个报价。

多个售后方案。

Offer 为商业数据。

Product 为技术数据。

二者严格分离。

# 5. Product → Knowledge

Relationship

One To Many

Product

↓

Knowledge

Knowledge 类型：

Article

Case

FAQ

Solution

Manual

Video

Download

White Paper

一个 Product

允许关联：

无限知识。

知识：

允许关联：

多个 Product。

数据库采用：

中间关联表。

Product Knowledge Mapping。

# 6. Product → Demand

Relationship

Optional

Demand

可引用：

多个 Product。

例如：

采购需求：

6mm 工业内窥镜。

AI：

自动推荐：

多个 Product。

Demand

无需固定绑定。

允许：

AI 自动匹配。

---

# 7. Product → RFQ

RFQ

必须引用：

Product。

RFQ：

可包含：

多个 Product。

因此：

采用：

RFQ Item。

RFQ

↓

RFQ Item

↓

Product

避免：

RFQ 与 Product

直接：

Many To Many。

# 8. Product → Capability

Relationship

Many To Many

Product

↓

Product Capability

↓

Capability

原因：

一个 Capability：

可属于：

多个 Product。

一个 Product：

拥有：

多个 Capability。

# 9. Product → Feature

Relationship

Many To Many

Product

↓

Product Feature

↓

Feature

Feature：

可根据：

软件版本。

许可证。

固件。

动态启用。

数据库：

独立维护。

# 10. Product → Parameter

Relationship

One To Many

Product

↓

Parameter Value

↓

Parameter Definition

Parameter Template

独立维护。

Product：

仅保存：

参数值。

参数定义：

平台统一维护。

# 11. Product → Attachment

Relationship

One To Many

支持：

Image

Video

PDF

CAD

STEP

IGES

Manual

Certificate

Report

所有附件：

统一 File Center。

Product

保存：

Attachment ID。

# 12. Product → AI

Product：

建立：

Embedding。

Chunk。

Knowledge Graph。

Capability Graph。

Industry Graph。

Material Graph。

Defect Graph。

AI：

统一引用：

Product ID。

禁止复制产品信息。

# 13. Product → Statistics

统计对象：

View Count

Search Count

Compare Count

Favorite Count

RFQ Count

Demand Match Count

Knowledge Click

AI Recommend Count

统计：

异步更新。

避免影响业务性能。

# 14. Product → Workflow

Workflow：

管理：

创建。

审核。

发布。

修改。

废弃。

归档。

Workflow

不保存：

Product 数据。

仅保存：

流程状态。

审批记录。

# 15. Product → Search

Search：

维护：

Index。

Keyword。

Synonym。

Embedding。

Product：

不直接维护：

搜索索引。

索引：

异步更新。

# 16. Product → Version

Version：

独立实体。

Product

↓

Product Version

记录：

修改历史。

参数变化。

图片变化。

能力变化。

Feature 变化。

支持：

Diff。

Rollback。

Audit。

# 17. Product → Dictionary

Product

引用：

Dictionary。

例如：

单位。

国家。

地区。

币种。

行业。

检测方法。

材料。

缺陷。

统一：

Dictionary Center。

避免：

硬编码。

# 18. Relationship Matrix

| Domain       | Relationship | Direction          |
| ------------ | ------------ | ------------------ |
| Organization | Indirect     | Offer              |
| Offer        | 1:N          | Product → Offer    |
| Knowledge    | M:N          | Mapping Table      |
| Demand       | Optional     | AI Match           |
| RFQ          | 1:N          | RFQ Item           |
| Parameter    | 1:N          | Parameter Value    |
| Capability   | M:N          | Product Capability |
| Feature      | M:N          | Product Feature    |
| Attachment   | 1:N          | File Mapping       |
| Workflow     | 1:N          | Workflow Instance  |
| Statistics   | 1:N          | Async Statistics   |
| AI           | 1:N          | Embedding          |
| Search       | 1:N          | Search Index       |
| Version      | 1:N          | Product Version    |
| Dictionary   | Reference    | Dictionary ID      |

# 19. Design Constraints

禁止：

Organization

直接修改：

Product。

禁止：

Offer

保存：

Parameter Definition。

禁止：

Knowledge

复制：

Product 参数。

禁止：

Demand

复制：

Product 信息。

统一：

引用 Product。

统一：

Product ID。

统一：

UUID。

# 20. Future Extension

Release 2.x

预留：

Accessory Relationship

Compatible Product

Replacement Product

Upgrade Product

Product Bundle

Cross Product Recommendation

Lifecycle Dependency

Digital Twin

IoT Device Binding

上述扩展均采用关联实体实现。

不修改 Product 主模型。

