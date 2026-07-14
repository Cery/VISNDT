# Document Identity


| Item          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Document ID   | 404                                                          |
| Document Name | Prisma Schema Specification                                  |
| Version       | 2.0 Final                                                    |
| Status        | In Progress                                                  |
| Repository    | VISNDT Repository Documentation Edition 2.0                  |
| Directory     | docs/400_Database/                                           |
| File Name     | 404_Prisma_Schema_Specification.md                           |
| Purpose       | Define Prisma ORM modeling specification                     |
| Dependency    | 399_CanonicalNamingSpecification.md、401_PostgreSQL_ER_Model.md、402_PostgreSQL_Table_Specification.md、403_PostgreSQL_DDL.sql |
| Referenced By | 405_prisma.schema                                            |


---

# 1. Document Purpose


本文档定义：

VISNDT Platform

PostgreSQL

到

Prisma ORM

之间的映射规则。


本文档：

定义：

- Model规范
- Field规范
- Relation规范
- Type Mapping
- Index规范
- Enum规范
- Migration规范


本文档：

不包含：

- 实际 Prisma Schema 代码
- Migration SQL


代码将在：

405_prisma.schema

中生成。


---

# 2. Prisma Architecture Position


VISNDT Database Architecture:


```
Business Layer

        │

        ▼

PostgreSQL Database

        │

        ▼

Prisma ORM

        │

        ▼

Application Service

        │

        ▼

API Layer

```


Prisma:

负责：

- Database Access
- Relation Management
- Type Safety
- Migration Management


Prisma:

不负责：

- Business Workflow
- AI Logic
- Permission Decision


---

# 3. Prisma Naming Convention


## 3.1 Model Naming


PostgreSQL:

```
snake_case
```


Example:

```
standard_product
```


Prisma Model:

```
PascalCase
```


Example:

```
StandardProduct
```


Mapping:


```
model StandardProduct {

@@map("standard_product")

}
```


---

## 3.2 Field Naming


Database:


```
created_at
```


Prisma:


```
createdAt
```


Example:


```prisma
createdAt DateTime @map("created_at")
```


---

# 4. Primary Key Specification


所有业务模型：


必须：

```prisma
id String @id
```


Database:

```
UUID
```


Prisma:

```
String
```


原因：

Prisma 当前对 UUID v7 原生支持有限。


---

标准:


```prisma
id String
 @id
 @default(dbgenerated("uuid_generate_v7()"))
 @db.Uuid
```


---

禁止:


```prisma
Int @id
```


禁止:


```prisma
productId String @id
```


---

# 5. UUID Strategy


统一：

UUID v7


用途：

- Primary Key
- Foreign Key


优势：

- 时间有序
- 索引友好
- 分布式安全


Example:


```text
0195xxxx-xxxx-7xxx-xxxx
```


---

# 6. Common Fields Specification


所有核心业务 Model：

必须包含：


```prisma
createdAt

updatedAt

deletedAt

createdBy

updatedBy

version

status
```


Mapping:


```prisma
createdAt DateTime @default(now()) @map("created_at")

updatedAt DateTime @updatedAt @map("updated_at")

deletedAt DateTime? @map("deleted_at")

version Int @default(1)

status String
```


---

# 7. PostgreSQL Type Mapping


| PostgreSQL  | Prisma          |
| ----------- | --------------- |
| UUID        | String @db.Uuid |
| VARCHAR     | String          |
| TEXT        | String          |
| INTEGER     | Int             |
| BIGINT      | BigInt          |
| BOOLEAN     | Boolean         |
| NUMERIC     | Decimal         |
| JSONB       | Json            |
| TIMESTAMPTZ | DateTime        |
| VECTOR      | Unsupported     |


---

# 8. Special Type Mapping


## 8.1 JSONB


PostgreSQL:


```sql
JSONB
```


Prisma:


```prisma
Json
```


应用：


- metadata
- parameter_json
- extension_data


---

## 8.2 Vector


PostgreSQL:


```sql
VECTOR(1536)
```


Prisma:


```prisma
Unsupported("vector")
```


Example:


```prisma
vectorData Unsupported("vector")
```


原因：

Prisma 官方暂未完整支持 pgvector。


---

## 8.3 Decimal


用于：

- Price
- Weight
- Measurement


Mapping:


```prisma
Decimal @db.Decimal
```


---

# 9. Relation Specification


## 9.1 One To Many


Example:


Organization

has many

Offer


Database:


```
organization

       │

       ▼

offer

```


Prisma:


```prisma
model Organization {

offers Offer[]

}


model Offer {

organizationId String

organization Organization
@relation(
fields:[organizationId],
references:[id]
)

}
```


---

## 9.2 Many To Many


禁止：

Prisma 自动关系表。


必须：

显式 Mapping Table。


Example:


Product

Capability


使用：


```
product_capability
```


对应：


```prisma
ProductCapability
```


---

# 10. Relation Naming


Relation 必须明确。


禁止：


```prisma
products Product[]
```


推荐：


```prisma
standardProducts StandardProduct[]
```


---

# 11. Index Specification


对应 PostgreSQL:


```
CREATE INDEX
```


Prisma:


```prisma
@@index([])
```


Example:


```prisma
@@index([status])
```


---

Unique:


PostgreSQL:


```
UNIQUE
```


Prisma:


```prisma
@@unique([])
```


---

# 12. Soft Delete Specification


禁止：


```sql
DELETE FROM
```


业务删除:


更新:


```
deleted_at
```


Prisma:


```prisma
deletedAt DateTime?
```


Application Layer:

自动过滤。


---

# 13. Enum Specification


平台枚举：

不直接写 Prisma enum。


原因：

平台需要动态扩展。


统一使用：

Dictionary Domain。


例如：


错误：


```prisma
enum ProductStatus
```


正确：


```prisma
status String
```


引用：

dictionary_item


---

# 14. Transaction Specification


Prisma Transaction:

用于：

- 创建业务对象
- 更新关联数据
- Workflow操作


Example:


```
Demand

+

Recommendation

+

Workflow Instance


必须同事务提交

```


---

# 15. Migration Specification


Migration 来源：

```
Prisma Migration
```


流程:


```
Modify Prisma Schema

        ↓

prisma migrate dev

        ↓

Review SQL

        ↓

Production Migration

```


---

# 16. Prisma Model Organization


405 文件结构:


```
generator

datasource


Models:

Product

Parameter

Organization

Offer

Knowledge

Demand

RFQ

Workflow

Dictionary

File

AI

User

System

```


---

# 17. Model Generation Rule


每一个 PostgreSQL Table：

必须生成：

一个 Prisma Model。


Example:


Database:


```
standard_product
```


Generate:


```
model StandardProduct
```


---


# 18. Database Consistency Rule


三层必须一致：


```
402 Table Specification

        =

403 PostgreSQL DDL

        =

405 Prisma Schema

```


任何修改：

必须同步：

402

403

405


---

# 19. Frozen Rules


以下规则冻结：


1.

PostgreSQL 是 Source Of Truth。


2.

Prisma 不改变数据库设计。


3.

Model 名称 PascalCase。


4.

Field 使用 camelCase。


5.

Table 使用 snake_case。


6.

UUID v7。


7.

显式 Relation。


8.

显式 Mapping Table。


9.

Dictionary 替代 Enum。


10.

AI Vector 使用 Unsupported。


---

# Document Status


Version:

2.0 Final


Status:

Ready For 405 Generation