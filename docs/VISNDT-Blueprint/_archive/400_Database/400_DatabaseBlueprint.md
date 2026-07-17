# Database Blueprint

Version

2.0

Status

Frozen

---

# 1. Database Position

PostgreSQL 是 VISNDT 唯一业务数据库。

所有业务数据统一存储于 PostgreSQL。

Redis 仅用于：

- Cache
- Session
- Queue
- Rate Limit

Cloudflare R2 仅存储：

- 图片
- 视频
- PDF
- Word
- Excel
- CAD
- 其它附件

数据库不保存大型二进制文件。

---

# 2. Database Principles

Single Source of Truth

Soft Delete

Audit First

UUID Primary Key

UTC Time

Version Control

Foreign Key Constraint

Optimistic Concurrency

---

# 3. Naming Convention

Table

snake_case

Example

organization_member

Column

snake_case

Example

created_at

updated_at

deleted_at

Index

idx_

Unique

uk_

Foreign Key

fk_

Primary Key

pk_

---

# 4. Common Columns

所有业务表默认包含：

id

created_at

updated_at

deleted_at

created_by

updated_by

version

is_deleted

---

# 5. Data Layer

Identity

↓

Organization

↓

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

Workflow

↓

Statistics

Audit

---

# 6. Attachment Strategy

所有图片及附件：

仅保存：

file_id

object_key

url

mime_type

size

数据库不保存文件内容。

---

# 7. Enum Strategy

所有状态：

统一 Enum。

禁止字符串自由输入。

例如：

organization_status

offer_status

demand_status

workflow_status

统一维护。

---

# 8. Dictionary Strategy

行业

单位

地区

国家

币种

检测方法

材料

缺陷

统一 Dictionary。