# 1. Document Purpose

本文档定义 VISNDT Backend 的 OpenAPI（OAS）规范。

所有 REST API 必须能够依据本规范生成统一的：

- OpenAPI Document
- Swagger UI
- Redoc Documentation
- SDK
- Mock Server
- API Testing
- API Contract

------

# 2. Objectives

OpenAPI 规范目标：

```
Single Source of Truth

↓

Machine Readable

↓

Automatic Documentation

↓

SDK Generation

↓

Contract Driven Development
```

------

# 3. Repository Position

位于：

```
500_Backend
```

依赖：

```
502_API_Design_Specification
```

输出：

```
Swagger UI

↓

Redoc

↓

Client SDK

↓

Mock Server
```

------

# 4. Supported Specification

VISNDT Backend：

统一采用：

```
OpenAPI 3.1
```

YAML：

作为：

官方格式。

JSON：

允许：

自动生成。

------

# 5. Design Principles

OpenAPI：

必须满足：

```
Readable

↓

Reusable

↓

Consistent

↓

Extensible

↓

Tool Friendly
```

------

# 6. Specification Scope

包括：

```
Paths

Operations

Schemas

Components

Security

Servers

Examples

Responses
```

------

# 7. OpenAPI File Location

Repository：

统一：

```
docs/

└──api/

    openapi.yaml
```

大型项目：

允许：

```
docs/api/

components/

schemas/

paths/

responses/

parameters/

security/
```

最终：

Build：

生成：

```
openapi.yaml
```

------

# 8. Source of Truth

统一：

```
OpenAPI

↓

Generate

↓

Swagger

↓

SDK

↓

Mock

↓

API Test
```

不得：

多个版本：

人工维护。

------

# 9. API Contract

OpenAPI：

即：

API Contract。

Frontend：

Backend：

均：

必须：

遵守。

禁止：

接口实现：

偏离：

OpenAPI。

------

# 10. OpenAPI Document Status

| Item                | Status  |
| ------------------- | ------- |
| OpenAPI Version     | Defined |
| Repository Position | Defined |
| File Structure      | Defined |
| Scope               | Defined |
| Contract Principle  | Defined |

# 11. Root Object Overview

## 11.1 Purpose

Root Object 是整个 OpenAPI Document 的入口。

所有 API 描述均由 Root Object 开始。

统一结构：

```
OpenAPI

↓

Info

↓

Servers

↓

Tags

↓

Paths

↓

Components

↓

Security
```

------

# 12. Root Object Structure

OpenAPI 根对象统一采用：

```
openapi:

info:

jsonSchemaDialect:

servers:

tags:

externalDocs:

paths:

webhooks:

components:

security:
```

所有顶级节点顺序保持一致。

------

# 13. openapi

必须：

声明 OpenAPI 版本。

统一：

```
openapi: 3.1.0
```

禁止：

```
3.0

3.0.2

3.0.3
```

Repository：

统一：

OpenAPI 3.1。

------

# 14. info Object

info：

描述 API 基本信息。

统一：

```
info:

 title:

 summary:

 description:

 version:

 contact:

 license:
```

属于：

必填对象。

------

# 15. Title Convention

Title：

统一：

```
VISNDT Backend API
```

禁止：

```
Backend API

API

Test API

My API
```

------

# 16. Summary

Summary：

一句话说明：

例如：

```
Industrial Inspection Platform REST API
```

长度：

建议：

```
<120 Characters
```

------

# 17. Description

Description：

支持：

Markdown。

内容建议：

包括：

```
Overview

Authentication

Version

Contact

License
```

------

# 18. Version

Version：

统一：

Semantic Version。

例如：

```
1.0.0

1.1.0

2.0.0
```

不得：

使用：

```
Latest

Current

Final
```

------

# 19. Contact

Contact：

统一：

```
contact:

 name:

 url:

 email:
```

例如：

```
contact:

 name: VISNDT Platform Team

 email: api@visndt.com
```

------

# 20. License

License：

统一：

```
license:

 name:

 identifier:
```

例如：

```
license:

 name: Proprietary
```

若未来开源：

可改为：

```
MIT

Apache-2.0

GPL-3.0
```

------

# 21. jsonSchemaDialect

OpenAPI 3.1：

支持：

JSON Schema。

统一：

```
jsonSchemaDialect:

https://json-schema.org/draft/2020-12/schema
```

------

# 22. servers

Servers：

描述：

API Server。

统一：

```
servers:

 - url:

   description:
```

支持：

多个环境。

例如：

```
Development

Testing

Production
```

------

# 23. Development Server

示例：

```
url:

https://dev-api.visndt.com
```

用途：

开发。

------

# 24. Testing Server

示例：

```
url:

https://test-api.visndt.com
```

用途：

集成测试。

------

# 25. Production Server

示例：

```
url:

https://api.visndt.com
```

生产：

唯一官方地址。

------

# 26. Tags

Tags：

用于：

API 分类。

统一：

```
tags:

 - name:

   description:
```

例如：

```
Products

Organizations

Offers

Demands

RFQs

Notifications

ParameterMetadata

Users

Authentication
```

------

# 27. Tag Naming

统一：

使用：

Plural。

例如：

```
Products

Orders

Users

Files
```

禁止：

```
ProductAPI

ProductController

GetProducts
```

------

# 28. externalDocs

统一：

```
externalDocs:

 description:

 url:
```

用于：

链接：

Repository：

开发文档。

------

# 29. Root Object Checklist

## Root

□ openapi

□ info

□ servers

------

## Metadata

□ title

□ version

□ contact

□ license

------

## Organization

□ tags

□ externalDocs

□ jsonSchemaDialect

------

# 30. Root Object Status

| Item              | Status  |
| ----------------- | ------- |
| openapi           | Defined |
| info              | Defined |
| servers           | Defined |
| tags              | Defined |
| externalDocs      | Defined |
| jsonSchemaDialect | Defined |

# 31. Paths Overview

## 31.1 Purpose

Paths 对象用于描述所有 API 资源路径及其可执行操作。

所有接口均必须挂载在 `paths` 下，并且每个路径必须符合 REST 资源设计。

目标：

```
Resource Path

↓

Operation Mapping

↓

Consistent Interface

↓

Machine Readable
```

------

## 31.2 Path Structure Principle

每个 Path 对象代表一个资源或子资源。

例如：

```
/products:
/products/{id}:
/products/{id}/images:
/organizations/{id}/offers:
/demands/{id}/rfqs:
```

禁止：

```
/createProduct
/getProducts
/deleteRequirement
```

------

# 32. Path Item Object

每个路径项可以包含：

```
get

post

put

patch

delete

head

options
```

每个 Path Item：

只允许描述该资源支持的操作。

------

# 33. Operation Object

每个 HTTP 方法对应一个 Operation Object。

Operation Object 统一包含：

```
operationId:
summary:
description:
tags:
parameters:
requestBody:
responses:
security:
deprecated:
```

------

# 34. operationId

`operationId` 必须唯一。

统一规则：

```
{module}{Resource}{Action}
```

例如：

```
listProducts
getProductById
createProduct
updateProduct
deleteProduct
```

禁止：

```
get1
create2
actionA
```

------

# 35. Summary

summary：

一句话描述接口用途。

例如：

```
Get product list
```

要求：

简短、准确、可读。

------

# 36. Description

description：

可使用 Markdown 说明接口详情。

建议包含：

```
Business Purpose

Request Rules

Permission

Data Scope

Notes
```

------

# 37. Tags

每个 Operation 必须带 Tags。

例如：

```
tags:
  - Products
```

一个接口可属于多个标签，但建议保持单一主标签。

------

# 38. Parameters

Parameters 支持：

- path
- query
- header
- cookie

REST API 中：

路径参数必须显式定义。

例如：

```
parameters:
  - name: id
    in: path
    required: true
```

------

# 39. Path Parameters

Path 参数：

必须：

```
required: true
```

不得：

省略。

示例：

```
- name: id
  in: path
  required: true
  schema:
    type: string
```

------

# 40. Query Parameters

Query 参数：

用于：

分页、筛选、排序、搜索、扩展。

示例：

```
- name: page
  in: query
- name: pageSize
  in: query
- name: keyword
  in: query
```

------

# 41. Header Parameters

Header 参数：

适用于：

```
Trace ID

Idempotency Key

Request Locale
```

例如：

```
- name: X-Request-ID
  in: header
```

------

# 42. RequestBody

POST / PUT / PATCH 必须定义 `requestBody`。

示例：

```
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CreateProductRequest'
```

GET / DELETE：

默认不使用 requestBody。

------

# 43. Responses

每个 Operation 必须定义 Responses。

至少包含：

```
200

201

400

401

403

404

409

500
```

按接口类型选择实际需要的响应码。

------

# 44. Success Response

成功响应必须明确：

```
200:
  description: OK
```

创建成功：

```
201:
  description: Created
```

删除无返回：

```
204:
  description: No Content
```

------

# 45. Error Response Reference

错误响应应引用统一组件。

例如：

```
400:
  $ref: '#/components/responses/BadRequest'
```

避免：

每个接口重复定义错误结构。

------

# 46. Security Requirement

Operation 可声明安全要求。

例如：

```
security:
  - bearerAuth: []
```

公开接口可不声明或声明匿名访问策略。

------

# 47. Deprecated

弃用接口：

必须标记：

```
deprecated: true
```

同时：

提供替代接口和迁移说明。

------

# 48. Operation Idempotency Notes

对于幂等接口：

建议在说明中标记。

例如：

- GET：幂等
- PUT：幂等
- PATCH：通常幂等
- DELETE：幂等
- POST：默认非幂等

------

# 49. Operation Design Rules

## Rule 01

一个 Operation 只负责一个动作。

------

## Rule 02

不要将多个业务动作混在一个接口里。

------

## Rule 03

接口命名必须与资源和业务一致。

------

## Rule 04

操作说明必须与 502_API_Design_Specification 保持一致。

------

# 50. Paths & Operations Checklist

## Path

□ Resource Based

□ Lowercase

□ No Action Word

------

## Operation

□ operationId Unique

□ summary Present

□ responses Present

□ security Defined

------

## Request

□ parameters Defined

□ requestBody Defined

□ validation Clear

------

# 51. Paths & Operations Status

| Item             | Status  |
| ---------------- | ------- |
| Path Structure   | Defined |
| Operation Object | Defined |
| operationId Rule | Defined |
| Parameters       | Defined |
| RequestBody      | Defined |
| Responses        | Defined |
| Security         | Defined |
| Deprecation      | Defined |

# 52. Components Overview

## 52.1 Purpose

Components 用于定义整个 OpenAPI 中可复用的公共对象。

设计目标：

```
Define Once

↓

Reference Everywhere

↓

Consistency

↓

Maintainability
```

------

## 52.2 Components Structure

统一结构：

```
components:

  schemas:

  responses:

  parameters:

  requestBodies:

  headers:

  securitySchemes:

  examples:

  links:

  callbacks:
```

所有公共对象：

必须：

放置于 Components。

------

# 53. Component Design Principles

必须遵循：

```
Reusable

↓

Independent

↓

Stable

↓

Version Compatible
```

禁止：

接口内部重复定义相同对象。

------

# 54. Schemas

Schemas：

用于定义：

所有数据对象。

例如：

```
Product

Organization

Offer

Demand

RFQ

Notification

ParameterMetadata

User

Order
```

------

# 54A. VISNDT Core Resource Boundary

VISNDT Blueprint v1.0 的 OpenAPI 资源模型统一为：

- `Product API`
- `Parameter Metadata API`
- `Offer API`
- `Demand API`
- `RFQ API`
- `Notification API`
- `Organization API`

必须遵循以下边界：

1. `Product API` 只提供 `Standard Product` 查询。
2. `Parameter Metadata API` 提供参数定义、模板与渲染元数据。
3. `Offer API` 用于 `Organization` 管理供应能力。
4. `Demand API` 用于采购需求创建与查询。
5. `RFQ API` 用于询价流程、响应与状态流转。
6. `Notification API` 用于站内通知与通知状态读取。
7. 禁止 `Organization` 通过 API 创建 `Standard Product`。

旧资源命名统一收敛为：

- `Supplier` -> `Organization`
- `Requirement` -> `Demand`
- `Inquiry` -> `RFQ`

------

# 55. Schema Naming Convention

统一：

PascalCase。

例如：

```
Product

ProductSummary

ProductDetail

CreateProductRequest

UpdateProductRequest

ApiResponse
```

禁止：

```
product

product_schema

PRODUCT
```

------

# 56. Schema File Organization

大型项目：

建议：

```
schemas/

├── product/

├── supplier/

├── requirement/

├── user/

└── common/
```

最终：

统一生成：

```
components.schemas
```

------

# 57. Schema Object

标准 Schema：

示例：

```
Product:

  type: object

  properties:

    id:

      type: string

    name:

      type: string

    status:

      type: string
```

------

# 58. Required Fields

必填字段：

统一：

```
required:

  - id

  - name
```

不得：

依赖：

文档说明代替 required。

------

# 59. Property Definition

每个字段：

建议包含：

```
type

format

description

example

nullable
```

必要时增加：

```
minimum

maximum

enum

default
```

------

# 60. Schema Reuse

公共对象：

必须：

引用：

```
$ref:

#/components/schemas/Product
```

禁止：

复制同一 Schema。

------

# 61. Response Components

统一：

放置：

```
components:

  responses:
```

例如：

```
SuccessResponse

BadRequest

Unauthorized

NotFound

Conflict
```

------

# 62. Parameter Components

公共参数：

统一：

```
components:

  parameters:
```

例如：

```
Page

PageSize

Keyword

Sort

Expand
```

接口：

直接：

引用。

------

# 63. RequestBody Components

公共 Request：

统一：

```
components:

  requestBodies:
```

例如：

```
CreateProductRequest

UpdateProductRequest
```

------

# 64. Header Components

统一：

管理：

```
components:

  headers:
```

例如：

```
TraceId

RequestId

RateLimit
```

------

# 65. Example Components

所有公共示例：

统一：

```
components:

  examples:
```

例如：

```
ProductExample

DemandExample

ErrorExample
```

------

# 66. Link Components

支持：

统一定义：

```
components:

  links:
```

用于：

描述：

资源关联关系。

------

# 67. Callback Components

异步通知：

统一：

```
components:

  callbacks:
```

适用于：

```
Webhook

Async Job

Notification
```

------

# 68. Component Reference Rules

统一：

采用：

```
$ref
```

例如：

```
schema:

  $ref:

    '#/components/schemas/Product'
```

不得：

跨文件：

硬编码路径。

------

# 69. Circular Reference

禁止：

循环引用。

例如：

```
Product

↓

Supplier

↓

Product
```

必要时：

使用：

Summary Object。

------

# 70. Components Checklist

## Schemas

□ PascalCase

□ Required

□ Example

------

## Reuse

□ $ref

□ No Duplicate

□ Stable

------

## Components

□ Responses

□ Parameters

□ RequestBodies

□ Headers

□ Examples

------

# 71. Components Status

| Item          | Status  |
| ------------- | ------- |
| Schemas       | Defined |
| Responses     | Defined |
| Parameters    | Defined |
| RequestBodies | Defined |
| Headers       | Defined |
| Examples      | Defined |
| Links         | Defined |
| Callbacks     | Defined |

# 72. Schema Modeling Overview

## 72.1 Purpose

Schema Modeling 用于定义 OpenAPI 数据模型的统一建模规范。

目标：

```
Standardized

↓

Reusable

↓

Type Safe

↓

Language Independent
```

------

## 72.2 Design Principles

所有 Schema 必须遵循：

```
Explicit

↓

Consistent

↓

Composable

↓

Extensible
```

------

# 73. Primitive Data Types

统一支持：

| Type    | Description         |
| ------- | ------------------- |
| string  | 字符串              |
| integer | 整数                |
| number  | 浮点数              |
| boolean | 布尔值              |
| object  | 对象                |
| array   | 数组                |
| null    | 空值（OpenAPI 3.1） |

------

# 74. String

字符串：

统一：

```
type: string
```

常用约束：

```
minLength:

maxLength:

pattern:
```

例如：

产品名称：

```
type: string

maxLength: 200
```

------

# 75. Integer

整数：

统一：

```
type: integer
```

格式：

```
format: int32

format: int64
```

建议：

ID：

统一：

```
int64

或

string（UUID）
```

------

# 76. Number

浮点：

统一：

```
type: number

format: double
```

适用于：

```
Weight

Price

Score

Ratio
```

------

# 77. Boolean

布尔：

统一：

```
type: boolean
```

示例：

```
enabled: true
```

禁止：

```
0

1

yes

no
```

------

# 78. Object

对象：

统一：

```
type: object
```

必须：

定义：

```
properties:
```

禁止：

未定义字段结构。

------

# 79. Array

数组：

统一：

```
type: array

items:
```

例如：

```
type: array

items:

  $ref:

    '#/components/schemas/Product'
```

------

# 80. Enum

固定值：

统一：

```
enum:
  - draft
  - published
  - archived
```

建议：

增加：

```
description:
```

说明：

每个枚举值含义。

------

# 81. Nullable

允许为空：

统一：

```
type:

  - string

  - "null"
```

OpenAPI 3.1：

采用 JSON Schema 标准。

禁止：

旧版：

```
nullable: true
```

作为唯一表达方式。

------

# 82. Default Value

默认值：

统一：

```
default:
```

例如：

```
default: draft
```

不得：

影响：

实际业务逻辑。

------

# 83. Example

每个重要字段：

建议：

提供：

```
example:
```

例如：

```
example: IPX-8000
```

------

# 84. oneOf

表示：

多个类型：

任选其一。

例如：

```
oneOf:

  - $ref: '#/components/schemas/Company'

  - $ref: '#/components/schemas/Individual'
```

------

# 85. anyOf

表示：

满足：

一个或多个。

统一：

```
anyOf:
```

适用于：

兼容：

多个输入模型。

------

# 86. allOf

用于：

组合继承。

例如：

```
allOf:

  - $ref: '#/components/schemas/BaseEntity'

  - type: object
```

推荐：

BaseEntity：

包含：

```
id

createdAt

updatedAt
```

------

# 87. Additional Properties

默认：

```
additionalProperties: false
```

若支持：

动态 Key：

明确：

```
additionalProperties:

  type: string
```

------

# 88. ReadOnly & WriteOnly

支持：

```
readOnly: true

writeOnly: true
```

例如：

```
id

createdAt

password
```

------

# 89. Schema Composition Rules

推荐：

```
BaseEntity

↓

BusinessEntity

↓

DTO

↓

Response
```

避免：

复杂：

多层嵌套。

------

# 90. Schema Validation Checklist

## Data Type

□ type

□ format

□ enum

□ example

------

## Structure

□ properties

□ required

□ additionalProperties

------

## Composition

□ oneOf

□ anyOf

□ allOf

------

# 91. Schema Modeling Status

| Item                      | Status  |
| ------------------------- | ------- |
| Primitive Types           | Defined |
| Object                    | Defined |
| Array                     | Defined |
| Enum                      | Defined |
| Nullable                  | Defined |
| Composition               | Defined |
| Validation Rules          | Defined |
| JSON Schema Compatibility | Defined |

# 92. Response Schema Overview

## 92.1 Purpose

Response Schema 用于定义 VISNDT API 所有响应结构。

目标：

```
Unified Response

↓

Predictable Client Handling

↓

Reusable Contract

↓

Automatic Code Generation
```

------

## 92.2 Response Design Principles

所有 API Response：

必须遵循：

```
Same Envelope

↓

Clear Status

↓

Typed Data

↓

Structured Error
```

------

# 93. Standard API Response

统一：

```
ApiResponse
```

结构：

```
success

code

message

data

meta

traceId

timestamp
```

------

# 94. ApiResponse Schema

定义：

```
ApiResponse:

  type: object

  properties:

    success:

      type: boolean

    code:

      type: integer

    message:

      type: string

    data:

      type: object

    traceId:

      type: string

    timestamp:

      type: string
```

------

# 95. Success Response Schema

成功：

统一：

```
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {},
  "traceId": "abc123",
  "timestamp": "2026-07-10T08:00:00Z"
}
```

------

# 96. Data Object

data：

根据接口变化。

例如：

产品详情：

```
{
  "data":
  {
    "id": "P10001",
    "name": "Industrial Endoscope"
  }
}
```

------

# 97. List Response Schema

列表接口：

统一：

```
ListResponse
```

结构：

```
ApiResponse

+

Array Data

+

Pagination Meta
```

------

# 98. Pagination Response Schema

统一：

```
PaginationMeta
```

结构：

```
{
  "page":1,
  "pageSize":20,
  "total":200,
  "totalPages":10,
  "hasNext":true,
  "hasPrevious":false
}
```

------

# 99. PaginationMeta Schema

定义：

```
PaginationMeta:

 type: object

 properties:

  page:

   type: integer

  pageSize:

   type: integer

  total:

   type: integer

  totalPages:

   type: integer
```

------

# 100. Empty Response

无数据返回：

例如：

DELETE。

统一：

```
204 No Content
```

或者：

```
{
 "success":true,
 "code":0,
 "data":null
}
```

根据接口约定选择。

------

# 101. Error Response Overview

错误响应：

统一：

```
ErrorResponse
```

目标：

```
Readable

↓

Debuggable

↓

Machine Processable
```

------

# 102. ErrorResponse Schema

结构：

```
ErrorResponse:

 type: object

 properties:

  success:

   type:boolean

  code:

   type:integer

  message:

   type:string

  errors:

   type:array

  traceId:

   type:string
```

------

# 103. Validation Error Schema

字段校验错误：

统一：

```
ValidationError
```

结构：

```
{
 "field":"email",
 "reason":"Invalid Format"
}
```

------

# 104. ValidationError Schema

定义：

```
ValidationError:

 type: object

 properties:

  field:

   type:string

  reason:

   type:string
```

------

# 105. Business Error Schema

业务错误：

例如：

```
Product Already Exists

Invalid Status Transition

Supplier Not Approved
```

统一：

包含：

```
code

message

details
```

------

# 106. RFC Problem Details

支持：

RFC 9457。

标准字段：

```
type

title

status

detail

instance
```

用于：

复杂错误场景。

------

# 107. Error Response Components

统一：

```
components:

 responses:

  BadRequest

  Unauthorized

  Forbidden

  NotFound

  Conflict

  InternalError
```

------

# 108. Response Reuse Strategy

接口：

禁止：

重复定义。

例如：

错误：

统一引用：

```
$ref:

#/components/responses/NotFound
```

------

# 109. Response Naming Convention

统一：

PascalCase。

例如：

```
ApiResponse

ErrorResponse

PaginationMeta

ValidationError

NotFoundResponse
```

------

# 110. Response Schema Rules

## Success

必须：

```
success

code

data
```

------

## Error

必须：

```
success=false

code

message

traceId
```

------

## Debug

必须：

支持：

```
traceId
```

------

# 111. Response Checklist

## Wrapper

□ ApiResponse

□ ErrorResponse

□ Pagination

------

## Reuse

□ Components

□ $ref

□ No Duplicate

------

## Error

□ Validation

□ Business Error

□ Trace ID

------

# 112. Response Schema Status

| Item                | Status  |
| ------------------- | ------- |
| ApiResponse         | Defined |
| List Response       | Defined |
| Pagination Meta     | Defined |
| Error Response      | Defined |
| Validation Error    | Defined |
| Business Error      | Defined |
| RFC Problem Details | Defined |
| Response Components | Defined |

# 113. Security Overview

## 113.1 Purpose

Security Specification 用于定义 OpenAPI 中所有 API 的认证与授权机制。

目标：

```
Secure

↓

Standard

↓

Reusable

↓

Tool Compatible
```

------

## 113.2 Design Principles

所有认证：

统一：

```
Security Scheme

↓

Security Requirement

↓

Permission Scope
```

------

# 114. SecuritySchemes

统一：

定义：

```
components:

  securitySchemes:
```

所有认证方式：

均放置于：

SecuritySchemes。

------

# 115. Bearer Authentication

VISNDT：

统一采用：

JWT Bearer。

定义：

```
bearerAuth:

  type: http

  scheme: bearer

  bearerFormat: JWT
```

------

# 116. Global Security

整个 API：

默认：

统一：

```
security:

  - bearerAuth: []
```

所有接口：

默认：

需要登录。

------

# 117. Anonymous API

公开接口：

覆盖：

Global Security。

例如：

```
security: []
```

适用于：

```
Login

Health

Public Product

Open Search
```

------

# 118. Operation Security Override

单个接口：

允许：

覆盖：

全局安全配置。

例如：

```
get:

  security: []
```

或者：

```
post:

  security:

    - bearerAuth: []
```

------

# 119. OAuth2 Extension

未来：

支持：

OAuth2。

统一：

```
type: oauth2
```

Flow：

建议：

```
Authorization Code

Client Credentials
```

当前版本：

预留。

------

# 120. API Key Support

若：

开放合作伙伴 API。

支持：

```
type: apiKey

in: header

name: X-API-Key
```

默认：

不启用。

------

# 121. Cookie Authentication

管理后台：

若采用 Cookie：

统一：

```
type: apiKey

in: cookie
```

推荐：

后台仍采用 JWT。

------

# 122. Permission Scope

接口：

建议：

标注：

权限。

例如：

```
Product.Read

Product.Create

Product.Update

Product.Delete
```

用于：

SDK 说明。

------

# 123. Authorization Notes

Description：

建议：

说明：

```
Required Role

↓

Required Permission

↓

Organization Scope
```

------

# 124. Refresh Token

Refresh：

不作为：

OpenAPI Security。

属于：

业务接口。

例如：

```
/auth/refresh
```

------

# 125. Login Endpoint

登录：

统一：

匿名访问。

Response：

返回：

```
Access Token

Refresh Token

Expire Time
```

------

# 126. Logout Endpoint

退出：

必须：

Bearer。

作用：

```
Invalidate Token

↓

Audit Log
```

------

# 127. Security Components Reuse

所有接口：

统一：

引用：

```
bearerAuth
```

禁止：

重复定义：

JWT。

------

# 128. Security Best Practices

建议：

```
HTTPS Only

↓

Short-lived Access Token

↓

Refresh Token Rotation

↓

Least Privilege
```

------

# 129. OpenAPI Security Checklist

## Security

□ bearerAuth

□ Global Security

□ Override

------

## Authentication

□ Login

□ Logout

□ Refresh

------

## Permission

□ Role

□ Scope

□ Description

------

# 130. Security Status

| Item             | Status   |
| ---------------- | -------- |
| JWT Bearer       | Defined  |
| Global Security  | Defined  |
| Anonymous API    | Defined  |
| OAuth2 Extension | Reserved |
| API Key          | Reserved |
| Permission Scope | Defined  |
| Security Reuse   | Defined  |

# 131. Documentation Overview

## 131.1 Purpose

本章节规范 OpenAPI 文档的展示方式、组织结构及示例管理规范。

目标：

```
Readable

↓

Navigable

↓

Consistent

↓

Developer Friendly
```

------

## 131.2 Documentation Principles

所有 API 文档：

必须遵循：

```
Single Navigation

↓

Unified Style

↓

Reusable Examples

↓

Clear Classification
```

------

# 132. Tags Organization

Tags：

用于：

API 分类。

统一原则：

```
One Module

↓

One Tag
```

例如：

```
Authentication

Users

Products

Organizations

Offers

Demands

RFQs

Notifications

ParameterMetadata

Files

System
```

------

# 133. Tag Ordering

Swagger / Redoc：

统一顺序：

```
Authentication

↓

Users

↓

Products

↓

Organizations

↓

Offers

↓

Demands

↓

RFQs

↓

Notifications

↓

Files

↓

System
```

保持：

Repository：

一致。

------

# 134. Tag Description

每个 Tag：

必须：

提供：

```
name:

description:
```

例如：

```
name: Products

description: Product management APIs.
```

------

# 135. Example Object

公共示例：

统一：

```
components:

  examples:
```

例如：

```
ProductExample

OrganizationExample

OfferExample

DemandExample

RFQExample

NotificationExample

ParameterMetadataExample

LoginExample
```

------

# 136. Request Example

RequestBody：

建议：

提供：

```
example:
```

或：

```
examples:
```

支持：

多个场景。

------

# 137. Response Example

所有：

200 Response：

建议：

提供：

完整：

Example。

例如：

```
Success

Empty Result

Pagination

Partial Data
```

------

# 138. Error Example

错误响应：

统一：

示例：

```
400

401

403

404

409

422

500
```

方便：

SDK：

测试。

------

# 139. Markdown Guideline

Description：

统一：

Markdown。

允许：

```
Heading

List

Table

Code Block

Link
```

禁止：

HTML。

------

# 140. Code Example

接口：

建议：

同时提供：

```
cURL

JavaScript

TypeScript

Python
```

示例调用。

------

# 141. External Documentation

支持：

```
externalDocs:

 description:

 url:
```

链接：

Repository：

详细设计文档。

------

# 142. Documentation Navigation

Redoc：

建议：

导航：

```
Authentication

Products

Organizations

Offers

Demands

RFQs

Notifications

ParameterMetadata

Users

Files

System
```

保持：

固定。

------

# 143. Operation Summary Rule

Summary：

统一：

```
Verb

+

Resource
```

例如：

```
List Products

List Organizations

List Offers

List Demands

List RFQs

Create Product

Update Product

Delete Product
```

------

# 144. Description Rule

Description：

建议：

包括：

```
Purpose

Permission

Input

Output

Notes
```

------

# 145. Documentation Version

文档：

必须：

显示：

```
API Version

Document Version

Last Updated
```

------

# 146. Documentation Localization

默认：

英文。

允许：

增加：

```
Chinese Description
```

用于：

国内开发。

------

# 147. Documentation Quality Checklist

## Navigation

□ Tags

□ Order

□ Description

------

## Example

□ Request

□ Response

□ Error

------

## Documentation

□ Markdown

□ ExternalDocs

□ Version

------

# 148. Documentation Status

| Item              | Status  |
| ----------------- | ------- |
| Tags Organization | Defined |
| Examples          | Defined |
| Request Example   | Defined |
| Response Example  | Defined |
| Markdown Rule     | Defined |
| Navigation        | Defined |
| Localization      | Defined |
| Quality Checklist | Defined |

# 149. Version Management Overview

## 149.1 Purpose

Version Management 用于规范 OpenAPI 文档的版本控制、兼容策略及变更管理。

目标：

```
Stable

↓

Compatible

↓

Traceable

↓

Governed
```

------

## 149.2 Design Principles

所有 OpenAPI：

必须遵循：

```
Semantic Version

↓

Backward Compatible

↓

Controlled Evolution

↓

Contract First
```

------

# 150. Semantic Version

统一采用：

```
MAJOR.MINOR.PATCH
```

例如：

```
1.0.0

1.1.0

1.2.3

2.0.0
```

------

# 151. Major Version

以下情况：

必须：

升级：

Major。

例如：

```
Remove Field

↓

Remove Endpoint

↓

Change Data Type

↓

Authentication Change
```

示例：

```
1.x.x

↓

2.0.0
```

------

# 152. Minor Version

允许：

新增：

```
Endpoint

↓

Optional Field

↓

Enum Value

↓

Description
```

要求：

保持：

向后兼容。

------

# 153. Patch Version

Patch：

用于：

```
Documentation

↓

Typo Fix

↓

Example Fix

↓

Schema Description
```

不得：

修改：

API Contract。

------

# 154. Compatibility Rules

允许：

```
Add Optional Property

↓

Add Optional Endpoint

↓

Improve Description
```

禁止：

```
Rename Property

↓

Delete Property

↓

Change Type

↓

Change Required
```

------

# 155. Breaking Change

以下属于：

Breaking Change：

```
Field Removed

Field Renamed

Required Added

Response Changed

HTTP Status Changed
```

必须：

升级：

Major。

------

# 156. Deprecation Policy

弃用：

统一：

```
deprecated: true
```

同时：

提供：

```
Replacement

Migration Guide

Sunset Date
```

------

# 157. Sunset Policy

Deprecated：

接口：

必须：

公布：

```
Sunset:

2028-01-01
```

建议：

保留：

至少：

12 个月。

------

# 158. Changelog

Repository：

统一：

```
CHANGELOG.md
```

格式：

```
Version

Date

Author

Summary

Impact

Migration
```

------

# 159. Contract Evolution

所有：

Contract：

必须：

记录：

```
Added

Modified

Deprecated

Removed
```

保持：

完整历史。

------

# 160. Compatibility Testing

CI：

必须：

自动检测：

```
Schema Difference

↓

Response Difference

↓

Breaking Change
```

------

# 161. Contract Review

Merge：

之前：

必须：

完成：

```
Architecture Review

↓

API Review

↓

OpenAPI Validation
```

------

# 162. Migration Guide

Major Version：

必须：

提供：

```
Old API

↓

New API

↓

Example

↓

Timeline
```

帮助：

开发者升级。

------

# 163. Release Workflow

统一流程：

```
Draft

↓

Review

↓

Merge

↓

Generate OpenAPI

↓

Publish

↓

SDK Update
```

------

# 164. Version Checklist

## Version

□ Semantic Version

□ Compatibility

□ Changelog

------

## Change

□ Breaking Review

□ Migration Guide

□ Deprecation

------

## Governance

□ Contract Review

□ Validation

□ CI Check

------

# 165. Version Management Status

| Item             | Status  |
| ---------------- | ------- |
| Semantic Version | Defined |
| Compatibility    | Defined |
| Breaking Change  | Defined |
| Deprecation      | Defined |
| Changelog        | Defined |
| Migration Guide  | Defined |
| Contract Review  | Defined |
| CI Validation    | Defined |

# 166. Automation Overview

## 166.1 Purpose

Automation Specification 用于规范 OpenAPI 自动化生成体系。

目标：

```
Write Once

↓

Generate Everywhere

↓

Keep Consistent

↓

Reduce Manual Work
```

------

## 166.2 Design Principles

所有自动化：

统一：

```
OpenAPI

↓

Generator

↓

Artifact

↓

Verification
```

------

# 167. Single Source of Truth

统一：

```
openapi.yaml
```

所有生成内容：

必须：

来源于：

```
OpenAPI Contract
```

禁止：

人工维护：

多个版本。

------

# 168. Generated Artifacts

自动生成：

```
Swagger UI

↓

Redoc

↓

SDK

↓

Mock Server

↓

Contract Test

↓

API Client
```

------

# 169. SDK Generation

支持：

自动生成：

```
TypeScript

JavaScript

Python

Java

Go

C#
```

统一：

版本：

与 API 保持一致。

------

# 170. SDK Repository Structure

建议：

```
sdk/

├── typescript/

├── javascript/

├── python/

├── java/

└── go/
```

每个 SDK：

独立发布。

------

# 171. Client Library

SDK：

统一：

提供：

```
Configuration

Authentication

Retry

Pagination

Error Handling
```

开发者：

无需：

手写 HTTP 请求。

------

# 172. Mock Server

统一：

根据：

OpenAPI：

自动生成：

Mock。

流程：

```
OpenAPI

↓

Mock Server

↓

Frontend

↓

Integration
```

------

# 173. Mock Data

Mock：

统一：

来源：

```
example

↓

examples

↓

schema
```

禁止：

随机：

改变：

数据结构。

------

# 174. Swagger UI

自动生成：

Swagger UI。

用途：

```
Browse

↓

Try API

↓

Debug

↓

Verify
```

开发环境：

默认开启。

------

# 175. Redoc

自动生成：

Redoc。

定位：

```
Readable

↓

Static

↓

Publish Ready
```

适用于：

正式文档。

------

# 176. Contract Testing

自动生成：

Contract Test。

验证：

```
Schema

↓

Request

↓

Response

↓

Status Code
```

保证：

实现：

符合 Contract。

------

# 177. CI/CD Integration

CI：

自动执行：

```
OpenAPI Validation

↓

Lint

↓

SDK Generation

↓

Contract Test

↓

Publish
```

任何失败：

禁止：

发布。

------

# 178. Lint Rules

统一：

Lint：

检查：

```
Naming

↓

Schema

↓

Reference

↓

Description

↓

Example
```

确保：

文档质量。

------

# 179. Publish Pipeline

发布流程：

```
Merge

↓

Build

↓

Generate

↓

Test

↓

Publish

↓

Tag Release
```

所有产物：

版本一致。

------

# 180. Generated Output Structure

建议：

```
build/

├── openapi.yaml

├── swagger/

├── redoc/

├── sdk/

├── mock/

└── reports/
```

统一：

由 CI 自动生成。

------

# 181. Documentation Hosting

建议：

部署：

```
Swagger UI

↓

Redoc

↓

Version Archive
```

支持：

历史版本：

浏览。

------

# 182. Quality Gates

生成完成：

必须：

验证：

```
OpenAPI Valid

↓

SDK Build Success

↓

Mock Available

↓

Swagger Render Success

↓

Redoc Render Success
```

------

# 183. Automation Checklist

## Generation

□ SDK

□ Mock

□ Swagger

□ Redoc

------

## Validation

□ Lint

□ Contract Test

□ Build Success

------

## Release

□ CI/CD

□ Publish

□ Version Tag

------

# 184. Automation Status

| Item             | Status  |
| ---------------- | ------- |
| SDK Generation   | Defined |
| Mock Server      | Defined |
| Swagger UI       | Defined |
| Redoc            | Defined |
| Contract Testing | Defined |
| CI/CD            | Defined |
| Lint Rules       | Defined |
| Publish Pipeline | Defined |

# 185. Governance Overview

## 185.1 Purpose

Governance 用于规范 OpenAPI 文档的校验、审查、治理与质量保证。

目标：

```
Valid

↓

Consistent

↓

Governed

↓

Production Ready
```

------

## 185.2 Design Principles

所有 OpenAPI：

必须经过：

```
Validation

↓

Lint

↓

Review

↓

Approval
```

------

# 186. Validation Strategy

统一：

自动验证：

```
Syntax

↓

Schema

↓

Reference

↓

Contract
```

禁止：

未校验：

直接发布。

------

# 187. OpenAPI Validation

每次：

Build：

执行：

```
OpenAPI Parser

↓

Specification Validation

↓

JSON Schema Validation
```

要求：

Document：

符合：

OpenAPI 3.1。

------

# 188. Schema Validation

所有：

Schema：

检查：

```
Required

↓

Type

↓

Enum

↓

Format

↓

Example
```

禁止：

Schema：

定义不完整。

------

# 189. Reference Validation

所有：

`$ref`：

必须：

有效。

检查：

```
Broken Reference

↓

Circular Reference

↓

Unused Schema
```

禁止：

孤立对象。

------

# 190. Spectral Lint

统一：

采用：

```
Spectral
```

检查：

```
Naming

↓

Description

↓

Summary

↓

Tags

↓

Examples
```

------

# 191. Naming Rules

统一：

验证：

```
operationId

↓

Schema

↓

Parameter

↓

Response

↓

Component
```

命名：

必须符合：

Repository 规范。

------

# 192. Description Rules

检查：

所有：

```
summary

↓

description
```

不得：

为空。

建议：

长度：

合理。

------

# 193. Example Validation

Example：

必须：

符合：

Schema。

验证：

```
Field Exists

↓

Correct Type

↓

Enum Valid
```

禁止：

错误示例。

------

# 194. Tag Validation

所有：

Operation：

必须：

属于：

Tag。

检查：

```
Missing Tag

↓

Duplicate Tag

↓

Unknown Tag
```

------

# 195. Governance Workflow

统一流程：

```
Author

↓

Review

↓

Validation

↓

Approval

↓

Merge
```

任何一步失败：

禁止：

进入主分支。

------

# 196. Review Checklist

Review：

检查：

```
API Design

↓

Naming

↓

Compatibility

↓

Security

↓

Documentation
```

------

# 197. Repository Freeze Policy

Release：

之后：

Repository：

进入：

```
Freeze
```

仅允许：

```
Bug Fix

↓

Documentation

↓

Emergency Patch
```

------

# 198. Compliance Report

CI：

自动生成：

```
Validation Report

↓

Lint Report

↓

Coverage Report

↓

Reference Report
```

统一：

归档。

------

# 199. Governance Checklist

## Validation

□ Syntax

□ Schema

□ Reference

------

## Lint

□ Naming

□ Description

□ Example

------

## Review

□ Architecture

□ Compatibility

□ Approval

------

# 200. Governance Status

| Item                 | Status  |
| -------------------- | ------- |
| Validation           | Defined |
| Schema Validation    | Defined |
| Reference Validation | Defined |
| Spectral Lint        | Defined |
| Review Workflow      | Defined |
| Freeze Policy        | Defined |
| Compliance Report    | Defined |
| Governance Checklist | Defined |

# 201. Repository Integration Overview

## 201.1 Purpose

本章节定义 OpenAPI 在整个 VISNDT Repository 中的定位、依赖关系及最终交付规范。

目标：

```
Repository Integration

↓

Unified Delivery

↓

Version Consistency

↓

Long-term Maintainability
```

------

## 201.2 Design Principles

OpenAPI：

作为：

```
API Contract

↓

Documentation Source

↓

Automation Source

↓

Integration Hub
```

------

# 202. Repository Dependencies

503：

依赖：

```
501_Backend_Architecture

↓

502_API_Design_Specification
```

输出：

```
504 Authentication

505 Business Service

507 Testing

508 Deployment
```

------

# 203. Repository Relationship

关系：

```
501

↓

502

↓

503

↓

504

↓

505

↓

507

↓

508
```

503：

位于：

Backend Contract Core。

------

# 204. Deliverables

最终输出：

```
openapi.yaml

Swagger UI

Redoc

SDK

Mock Server

Contract Report
```

------

# 205. Generated Documents

统一：

自动生成：

```
API Documentation

↓

SDK Documentation

↓

Integration Guide

↓

Reference Manual
```

------

# 206. Repository Directory

建议：

```
docs/

api/

sdk/

mock/

reports/

release/
```

Build：

统一：

输出。

------

# 207. Integration Workflow

统一流程：

```
Design

↓

Review

↓

OpenAPI

↓

Generate

↓

Validate

↓

Publish
```

所有步骤：

自动记录。

------

# 208. Version Synchronization

以下版本：

必须一致：

```
Repository Version

API Version

OpenAPI Version

SDK Version

Release Version
```

禁止：

版本漂移。

------

# 209. Release Package

发布：

统一：

包含：

```
openapi.yaml

Swagger

Redoc

SDK

CHANGELOG

Migration Guide
```

------

# 210. Repository Validation

发布前：

必须：

验证：

```
Repository Complete

↓

Reference Complete

↓

OpenAPI Valid

↓

SDK Generated

↓

Documentation Generated
```

------

# 211. Acceptance Criteria

交付：

必须满足：

```
Build Success

↓

Validation Passed

↓

Contract Consistent

↓

Documentation Complete
```

------

# 212. Repository Freeze

Release：

完成：

统一：

冻结：

```
OpenAPI Contract

↓

Generated SDK

↓

Documentation
```

任何修改：

必须：

重新走：

发布流程。

------

# 213. Repository Audit

所有发布：

保留：

```
Version

Release Time

Reviewer

Commit

Artifacts
```

支持：

长期审计。

------

# 214. Repository Delivery Checklist

## Contract

□ OpenAPI Complete

□ Validation Passed

□ Version Consistent

------

## Artifacts

□ Swagger

□ Redoc

□ SDK

□ Mock

------

## Repository

□ Changelog

□ Migration Guide

□ Release Package

------

# 215. Final Repository Status

| Item                    | Status  |
| ----------------------- | ------- |
| Repository Integration  | Defined |
| Deliverables            | Defined |
| Directory Structure     | Defined |
| Version Synchronization | Defined |
| Release Package         | Defined |
| Acceptance Criteria     | Defined |
| Audit Strategy          | Defined |
| Repository Checklist    | Defined |

------

# 216. 503 Document Completion

Document：

```
503_OpenAPI_Specification
```

Version：

```
V1.0
```

Status：

```
FINAL
```

Completion：

```
100%
```

Repository：

```
Ready For 504_Authentication_And_Authorization
```
