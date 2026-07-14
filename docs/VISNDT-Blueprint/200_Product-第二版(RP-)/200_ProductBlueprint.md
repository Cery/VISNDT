# Product Blueprint

Document ID

200

Version

2.0 Final

Status

Frozen

Repository

VISNDT Documentation Edition 2.0

---

# 1. Purpose

Product Center 是 VISNDT 平台唯一的标准产品中心（Single Source of Truth）。

平台所有业务均围绕 Product Center 展开。

Product Center 不属于供应商。

Product Center 属于平台。

供应商仅可引用。

不得修改。

不得删除。

不得创建新的标准产品。

---

# 2. Product Center Position

Product Center 提供：

✓ 标准产品

✓ 产品分类

✓ 参数模板

✓ 能力模板

✓ 检测对象

✓ 材料

✓ 缺陷

✓ 检测方法

✓ 行业

✓ 标准

✓ AI标签

✓ 产品图片

✓ 产品附件

✓ 产品版本

✓ 生命周期

Product Center 不提供：

×

价格

×

库存

×

交货期

×

售后

×

报价

×

商务信息

以上全部属于 Offer Center。

---

# 3. Product Center Responsibility

平台负责：

建立统一产品数据库。

建立统一参数体系。

建立统一能力体系。

建立统一分类体系。

建立统一标准体系。

建立统一AI标签。

统一维护产品生命周期。

统一审核产品变更。

供应商负责：

引用标准产品。

补充自身 Offer。

维护商业信息。

维护服务能力。

平台与供应商职责完全分离。

---

# 4. Product Philosophy

Product

描述：

"是什么"

Offer

描述：

"谁提供"

Knowledge

描述：

"怎么使用"

Demand

描述：

"谁需要"

RFQ

描述：

"如何询价"

Workflow

描述：

"如何审批"

整个平台围绕 Product 建立业务关联。

---

# 5. Product Lifecycle

Planning

↓

Draft

↓

Review

↓

Published

↓

Revision

↓

Deprecated

↓

Archived

说明：

Planning

平台规划阶段。

Draft

编辑中。

Review

审核中。

Published

正式发布。

Revision

版本更新。

Deprecated

停止推荐。

Archived

历史归档。

任何产品不得物理删除。

采用逻辑删除。

---

# 6. Product Principles

Rule 1

平台拥有 Product。

Rule 2

供应商拥有 Offer。

Rule 3

一个 Product

可对应多个 Offer。

Rule 4

一个 Product

可关联多个 Knowledge。

Rule 5

一个 Product

可关联多个 Demand。

Rule 6

一个 Product

可关联多个 RFQ。

Rule 7

AI 永远围绕 Product 建立知识图谱。

---

# 7. Product Identifier

每个 Standard Product

拥有唯一：

Product ID

UUID

Product Code

Slug

English Name

Chinese Name

Alias

Version

Status

所有引用统一使用：

Product ID。

禁止使用产品名称作为关联键。

---

# 8. Product Visibility

Public

所有人可见。

Registered

登录后可见。

Organization

组织成员可见。

Platform

平台内部。

Archived

仅管理员可见。

Visibility

与 Workflow 独立。

---

# 9. Product Ownership

Product Owner

Platform

Offer Owner

Organization

Knowledge Owner

Organization

Demand Owner

Publisher

RFQ Owner

Buyer

平台统一管理 Product。

企业仅管理属于自己的业务数据。

---

# 10. Product Search

支持：

关键词

分类

行业

检测方法

能力

参数

材料

缺陷

品牌（Offer）

供应商（Offer）

地区（Offer）

AI语义搜索

向量搜索

混合搜索

全文搜索

Product 永远作为搜索核心。

---

# 11. Product AI

AI 基于：

Product

Parameter

Capability

Knowledge

Offer

Demand

建立统一知识图谱。

AI 不直接学习：

报价

库存

用户隐私

内部审批数据。

---

# 12. Product Attachment

支持：

图片

PDF

Word

Excel

PPT

视频

CAD

STEP

IGES

3D模型

说明书

检测报告

所有附件：

统一存储：

Cloudflare R2。

数据库仅保存：

File ID。

---

# 13. Product Internationalization

产品支持：

Chinese

English

预留：

Japanese

Korean

German

French

Spanish

所有参数支持：

国际化。

单位统一转换。

AI 支持多语言搜索。

---

# 14. Product Governance

平台统一维护：

分类。

参数。

能力。

行业。

材料。

缺陷。

检测方法。

标准。

AI标签。

供应商不能修改上述数据。

仅可提交新增申请。

审核通过后：

平台维护。

---

# 15. Product Relationship

Product

↓

Offer

↓

Knowledge

↓

Demand

↓

RFQ

↓

Statistics

↓

AI

Product 为整个平台唯一主数据中心。

任何模块不得绕过 Product 建立业务关系。