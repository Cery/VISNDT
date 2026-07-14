# Product Constraints & Engineering Specification

Document ID

207

Version

2.0 Final

Status

Frozen

---

# 1. Engineering Goal

本规范定义 Product Center 的工程实现约束。

适用于：

• PostgreSQL

• Prisma ORM

• NestJS

• OpenAPI

• Vue3

• 微信小程序

• AI

所有实现必须遵循本规范。

---

# 2. Naming Convention

数据库：

snake_case

例如：

standard_product

product_parameter_value

product_capability

product_feature

API：

kebab-case

例如：

GET

/products

/products/{id}

/product-series

JSON：

camelCase

例如：

productId

createdAt

parameterTemplateId

TypeScript：

PascalCase

例如：

ProductService

ProductController

ParameterTemplate

---

# 3. Primary Key

所有实体：

UUID v7

禁止：

Auto Increment

禁止：

业务编码作为主键

Code：

仅用于：

展示

搜索

导入

接口

数据库：

统一 UUID。

---

# 4. Logical Delete

所有 Product：

逻辑删除。

字段：

deleted_at

deleted_by

is_deleted

禁止：

DELETE。

统一：

Archive。

---

# 5. Audit Field

所有实体：

created_at

created_by

updated_at

updated_by

deleted_at

deleted_by

version

revision

status

workflow_state

---

# 6. Version Rule

每次：

Published

生成：

Major Version

编辑：

Minor Version

例如：

1.0

↓

1.1

↓

1.2

↓

2.0

历史永久保存。

---

# 7. Product Code

Code：

SP-

八位数字

例如：

SP-00001258

永久不变。

UUID：

数据库引用。

---

# 8. Parameter Constraint

Parameter Definition：

平台维护。

Parameter Value：

产品维护。

禁止：

Definition

写入：

Product。

---

# 9. Capability Constraint

Capability：

Dictionary。

Product：

Mapping。

禁止：

Capability

写入：

Product。

---

# 10. Feature Constraint

Feature：

Dictionary。

Product：

Mapping。

禁止：

Feature

重复定义。

---

# 11. Attachment Constraint

统一：

File Center。

Product：

仅保存：

Attachment Mapping。

禁止：

保存：

文件路径。

URL。

Base64。

---

# 12. Search Constraint

Search：

异步建立。

禁止：

业务查询：

直接全文扫描。

统一：

Search Service。

---

# 13. AI Constraint

AI：

不得：

直接访问：

业务数据库。

统一：

AI Index。

Embedding。

Knowledge Graph。

---

# 14. Workflow Constraint

所有：

Published

Product：

必须：

Workflow。

禁止：

直接 UPDATE。

---

# 15. Dictionary Constraint

Dictionary：

平台维护。

禁止：

业务模块：

重复维护：

单位。

行业。

国家。

地区。

材料。

标准。

检测方法。

---

# 16. API Constraint

API：

RESTful。

禁止：

RPC 风格。

统一：

OpenAPI。

统一：

JWT。

统一：

RBAC。

统一：

Version。

---

# 17. Data Quality

所有 Product：

必须：

Category。

Series。

Parameter。

Capability。

至少一张图片。

Version。

Workflow。

否则：

禁止：

Published。

---

# 18. Internationalization

所有：

Name

Description

Parameter

Capability

Feature

Dictionary

支持：

多语言。

Chinese

English

Release 2.x：

Japanese

German

French

Korean

Spanish

---

# 19. Performance Target

Product List：

≤500ms

Detail：

≤800ms

Search：

≤1s

Compare：

≤2s

AI Search：

≤3s

统计：

异步。

AI：

异步。

---

# 20. Final Engineering Rule

Product

永远作为：

Platform Master Data。

任何业务：

不得复制：

Product。

统一引用：

Product ID。

整个 Repository：

均遵循：

Single Source of Truth。