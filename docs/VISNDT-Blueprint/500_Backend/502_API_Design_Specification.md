# 1. Document Purpose

本文档定义 VISNDT Backend 的 API 设计规范。

所有 HTTP API、REST API、OpenAPI 规范均必须遵循本文件。

本规范统一：

- REST API Design
- URL Design
- HTTP Method
- Request Format
- Response Format
- Version Strategy
- Error Design
- API Lifecycle

------

# 2. API Design Goals

VISNDT API 应满足：

```
Consistency

↓

Readability

↓

Predictability

↓

Scalability

↓

Backward Compatibility
```

------

# 3. Repository Position

API Design 位于：

```
500_Backend
```

依赖：

```
501_Backend_Architecture
```

输出：

```
503_OpenAPI_Specification
```

关系：

```
Frontend

↓

REST API

↓

Backend

↓

Database
```

------

# 4. REST Architecture Principle

VISNDT API：

采用：

RESTful Architecture。

遵循：

```
Resource Oriented

↓

HTTP Standard

↓

Stateless

↓

Cache Friendly
```

------

# 5. API Design Principles

API 必须遵循：

```
Uniform Naming

↓

Predictable URL

↓

Consistent Response

↓

Minimal Coupling
```

------

# 6. API Style

统一：

JSON API。

请求：

```
Content-Type:

application/json
```

响应：

```
application/json
```

禁止：

XML。

------

# 7. API Version Strategy

统一：

URL Version。

例如：

```
/api/v1/
```

未来：

```
/api/v2/
```

禁止：

Header Version。

------

# 8. Resource Oriented Design

API 围绕：

Resource。

例如：

```
Product

Organization

Offer

Demand

RFQ

Notification

Parameter Metadata
```

禁止：

Action API。

例如：

```
/getProduct

/createOrganization
```

------

# 9. URL Naming Convention

统一：

```
lowercase

plural

kebab-case
```

例如：

```
/products

/product-categories

/system-users
```

禁止：

```
/Products

/GetProduct

/ProductList
```

------

# 10. URI Hierarchy

采用：

资源层级。

例如：

```
/products

/products/{id}

/organizations/{id}

/offers/{id}

/demands/{id}

/rfqs/{id}
```

子资源：

例如：

```
/products/{id}/images

/products/{id}/parameters
```

------

# 11. Stateless Principle

API：

必须：

Stateless。

每次请求：

包含：

```
Authentication

Authorization

Request Data
```

服务器：

不得：

保存 Session 状态。

------

# 12. API Design Status

| Item                | Status  |
| ------------------- | ------- |
| REST Style          | Defined |
| URL Convention      | Defined |
| Version Strategy    | Defined |
| JSON Standard       | Defined |
| Stateless Principle | Defined |

# 13. HTTP Method Overview

## 13.1 Purpose

HTTP Method 用于定义资源允许执行的标准操作。

所有 API 必须严格遵循 HTTP RFC 语义。

目标：

```
Standard

↓

Predictable

↓

RESTful

↓

Idempotent
```

------

## 13.2 Supported Methods

VISNDT Backend 支持：

| Method  | Purpose        |
| ------- | -------------- |
| GET     | 查询资源       |
| POST    | 创建资源       |
| PUT     | 全量更新资源   |
| PATCH   | 部分更新资源   |
| DELETE  | 删除资源       |
| HEAD    | 获取 Header    |
| OPTIONS | 获取允许的方法 |

禁止：

```
CONNECT

TRACE
```

------

# 14. GET

GET：

用于：

读取资源。

例如：

```
GET /api/v1/products

GET /api/v1/products/{id}

GET /api/v1/organizations

GET /api/v1/demands

GET /api/v1/rfqs
```

特点：

```
Safe

Idempotent

Cacheable
```

禁止：

修改服务器数据。

------

# 15. POST

POST：

用于：

创建资源。

例如：

```
POST /api/v1/offers

POST /api/v1/demands

POST /api/v1/rfqs
```

特点：

```
Not Idempotent
```

成功：

返回：

```
201 Created
```

并返回：

新资源。

------

# 16. PUT

PUT：

用于：

整体替换资源。

例如：

```
PUT /api/v1/products/{id}
```

要求：

客户端：

提交：

完整资源。

特点：

```
Idempotent
```

------

# 17. PATCH

PATCH：

用于：

部分更新。

例如：

```
PATCH /api/v1/products/{id}
```

更新：

例如：

```
{
  "status": "published"
}
```

特点：

```
Partial Update

Idempotent
```

推荐：

大部分更新使用 PATCH。

------

# 18. DELETE

DELETE：

用于：

删除资源。

例如：

```
DELETE /api/v1/products/{id}
```

特点：

```
Idempotent
```

建议：

采用：

Soft Delete。

而不是：

Physical Delete。

------

# 19. HEAD

HEAD：

返回：

Header。

例如：

```
HEAD /api/v1/products/{id}
```

用途：

- 检查资源存在
- 获取 ETag
- 获取 Last-Modified

响应：

不包含：

Body。

------

# 20. OPTIONS

OPTIONS：

返回：

允许的方法。

例如：

```
OPTIONS /api/v1/products
```

返回：

```
Allow:

GET

POST

PATCH

DELETE
```

------

# 21. Safe Methods

Safe Method：

包括：

```
GET

HEAD

OPTIONS
```

特点：

不会修改：

服务器数据。

------

# 22. Idempotent Methods

幂等方法：

```
GET

PUT

PATCH

DELETE

HEAD

OPTIONS
```

非幂等：

```
POST
```

------

# 23. Resource Operation Matrix

| Operation            | Method  |
| -------------------- | ------- |
| Query List           | GET     |
| Query Detail         | GET     |
| Create               | POST    |
| Replace              | PUT     |
| Partial Update       | PATCH   |
| Delete               | DELETE  |
| Metadata             | HEAD    |
| Capability Discovery | OPTIONS |

------

# 24. Batch Operations

批量操作：

统一：

```
POST /api/v1/products/batch
```

例如：

```
POST /api/v1/products/batch-delete

POST /api/v1/products/batch-import

POST /api/v1/products/batch-export
```

说明：

批量操作作为资源行为接口，避免将 DELETE、PATCH 扩展为复杂批处理。

------

# 25. Unsupported Method

若资源：

不支持某 Method。

返回：

```
405 Method Not Allowed
```

并包含：

```
Allow:

GET

POST
```

------

# 26. Method Naming Rules

禁止：

```
/create

/update

/delete

/query

/getList
```

统一：

资源路径：

配合：

HTTP Method。

例如：

```
POST /products

PATCH /products/{id}

DELETE /products/{id}
```

------

# 27. Resource State Transition

资源生命周期：

```
Create

↓

Draft

↓

Published

↓

Archived

↓

Deleted
```

状态变更：

统一：

PATCH。

例如：

```
PATCH /products/{id}
```

------

# 28. Method Security

修改资源：

必须：

验证：

```
Authentication

↓

Authorization

↓

Business Permission
```

GET：

也必须：

校验：

访问权限。

------

# 29. HTTP Method Checklist

## Query

□ GET

□ HEAD

------

## Write

□ POST

□ PATCH

□ DELETE

------

## Compliance

□ RESTful

□ Idempotent

□ RFC Compliant

------

# 30. HTTP Method Status

| Item        | Status  |
| ----------- | ------- |
| GET         | Defined |
| POST        | Defined |
| PUT         | Defined |
| PATCH       | Defined |
| DELETE      | Defined |
| HEAD        | Defined |
| OPTIONS     | Defined |
| Idempotency | Defined |

# 31. URL Design Overview

## 31.1 Purpose

URL 是 REST API 的资源标识。

统一规范 URL 可保证：

```
Consistency

↓

Readability

↓

Discoverability

↓

Scalability
```

------

## 31.2 URL Design Principles

所有 URI 必须遵循：

```
Resource First

↓

Lowercase

↓

Plural Resource

↓

Hierarchical

↓

Predictable
```

------

# 32. URL Base Structure

统一：

```
/api/v1/{resource}
```

例如：

```
/api/v1/products

/api/v1/organizations

/api/v1/offers

/api/v1/demands

/api/v1/rfqs

/api/v1/notifications
```

------

# 33. Resource Naming

资源名称：

统一：

```
Plural

lowercase

kebab-case
```

例如：

```
products

product-categories

organizations

offers

demands

rfqs

notifications
```

禁止：

```
Product

Products

productList

getProducts

product_list
```

------

# 34. Path Parameter

资源主键：

统一：

```
/products/{id}
```

例如：

```
GET /products/123

PATCH /products/123

DELETE /products/123
```

Path Parameter：

表示：

唯一资源。

------

# 35. Nested Resource

资源关系：

采用：

Nested Resource。

例如：

```
/products/{id}/images

/products/{id}/parameters

/organizations/{id}/offers

/demands/{id}/rfqs
```

建议：

层级：

不超过：

```
3
```

例如：

推荐：

```
/products/{id}/images
```

不推荐：

```
/products/{id}/images/{imageId}/metadata/version
```

------

# 36. Collection Resource

资源集合：

统一：

```
/products

/organizations

/offers

/demands

/rfqs

/notifications
```

支持：

```
Pagination

Filtering

Sorting

Search
```

------

# 37. Singleton Resource

系统唯一资源：

使用：

Singleton。

例如：

```
/system/profile

/system/config

/account/profile
```

无需：

ID。

------

# 37A. VISNDT Core API Boundary

VISNDT Blueprint v1.0 的核心 API 资源统一为：

- Product API
- Parameter Metadata API
- Offer API
- Demand API
- RFQ API
- Notification API
- Organization API

## 37A.1 Product API

Product API 负责：

- 读取平台标准产品
- 读取分类
- 读取参数展示信息
- 读取产品详情

必须明确：

`Product API` 面向平台标准产品读取。  
`Organization` 不允许通过 API 创建 `Standard Product`。

## 37A.2 Parameter Metadata API

Parameter Metadata API 负责：

- 参数定义
- 参数模板
- 参数分组
- 参数渲染元数据

## 37A.3 Offer API

Offer API 负责：

- 管理 `Organization` 提供能力
- 创建与更新 Offer
- 读取 Offer 列表与详情

## 37A.4 Demand API

Demand API 负责：

- 采购需求提交
- 需求状态流转
- 需求详情查询

## 37A.5 RFQ API

RFQ API 负责：

- 询价流程
- RFQ 状态
- 响应与沟通

## 37A.6 Notification API

Notification API 负责：

- 站内通知
- 邮件通知状态
- 未读消息与消息列表

## 37A.7 Naming Replacement Rule

旧资源命名统一替换为：

- `Supplier API` -> `Organization API`
- `Requirement API` -> `Demand API`
- `Inquiry API` -> `RFQ API`

------

# 38. Query Parameter

查询条件：

统一：

Query Parameter。

例如：

```
GET /products?page=1

GET /products?page=2&pageSize=20

GET /products?status=published

GET /products?keyword=endoscope
```

禁止：

把查询条件写入：

Path。

------

# 39. Sorting

排序：

统一：

```
sort
```

例如：

```
GET /products?sort=name

GET /products?sort=-createdAt
```

约定：

```
字段名

=

升序

-字段名

=

降序
```

------

# 40. Filtering

过滤：

例如：

```
GET /products?status=published

GET /products?category=industrial-video-endoscope

GET /products?brand=visndt
```

多个条件：

AND。

------

# 41. Search

全文搜索：

统一：

```
keyword
```

例如：

```
GET /products?keyword=borescope
```

禁止：

```
q

query

searchText
```

------

# 42. Pagination URL

统一：

```
GET /products?page=1&pageSize=20
```

默认：

```
page=1

pageSize=20
```

最大：

```
pageSize=100
```

------

# 43. Resource Identifier

统一：

ID。

例如：

```
/products/10001
```

禁止：

```
/products/product-10001
```

如果需要：

Slug。

例如：

```
/products/by-slug/iplex-gx
```

------

# 44. Reserved Path

保留：

```
search

batch

export

import

statistics

health

version
```

例如：

```
/products/search

/products/export

/products/statistics
```

------

# 45. Action URL

REST 原则：

避免：

Action URL。

禁止：

```
/products/create

/products/delete

/products/update
```

统一：

Method：

决定行为。

------

# 46. File Resource

文件资源：

统一：

```
/files

/files/{id}

/files/{id}/download
```

禁止：

```
/downloadFile
```

------

# 47. URI Length

建议：

URI：

不超过：

```
2048 Characters
```

Path：

尽量：

简洁。

------

# 48. URL Compatibility

URI：

发布后：

保持：

Backward Compatible。

禁止：

无版本：

直接修改。

------

# 49. URI Naming Checklist

## Naming

□ lowercase

□ plural

□ kebab-case

------

## Resource

□ Resource First

□ Predictable

□ RESTful

------

## Query

□ Pagination

□ Filter

□ Sort

□ Search

------

# 50. URL Design Status

| Item                | Status  |
| ------------------- | ------- |
| Resource Naming     | Defined |
| Path Parameter      | Defined |
| Query Parameter     | Defined |
| Nested Resource     | Defined |
| Collection Resource | Defined |
| Singleton Resource  | Defined |
| Reserved Path       | Defined |
| URL Compatibility   | Defined |

# 51. Request & Response Overview

## 51.1 Purpose

统一 Backend API 的 Request 与 Response 结构。

目标：

```
Consistent

↓

Predictable

↓

Easy Integration

↓

Easy Debugging

↓

Machine Readable
```

------

## 51.2 Design Principles

所有接口遵循：

```
One Request

↓

One Response

↓

Unified Structure

↓

Explicit Semantics
```

------

# 52. Request Format

HTTP Request：

统一：

```
Content-Type: application/json
Accept: application/json
```

Body：

采用：

JSON。

例如：

```
{
  "name": "VISNDT X500",
  "categoryId": "CAT-001",
  "supplierId": "SUP-001",
  "status": "draft"
}
```

------

# 53. Request Body Rules

Request Body：

适用于：

```
POST

PUT

PATCH
```

GET：

禁止：

Request Body。

DELETE：

默认：

不使用：

Body。

------

# 54. Path Parameter

例如：

```
GET /products/{id}
```

Path Parameter：

必须：

```
Required

Validated

Unique
```

------

# 55. Query Parameter

Query Parameter：

统一用于：

```
Pagination

Filtering

Sorting

Searching
```

例如：

```
GET /products?page=1&pageSize=20&status=published
```

------

# 56. Request Header

统一 Header：

| Header        | Required          |
| ------------- | ----------------- |
| Authorization | Yes（受保护接口） |
| Content-Type  | Yes               |
| Accept        | Yes               |
| X-Request-ID  | Recommended       |
| X-Trace-ID    | Recommended       |

------

# 57. Authorization Header

统一：

```
Authorization: Bearer <JWT>
```

禁止：

```
Token xxx

JWT xxx
```

------

# 58. Success Response

统一：

HTTP Status：

```
200

201

202

204
```

Body：

统一结构。

------

# 59. Standard Response Envelope

所有成功响应：

统一：

```
{
  "success": true,
  "code": 0,
  "message": "OK",
  "data": {},
  "meta": {},
  "traceId": "trace-123456",
  "timestamp": "2026-07-10T08:30:00Z"
}
```

------

# 60. Response Fields

| Field     | Description |
| --------- | ----------- |
| success   | 是否成功    |
| code      | 业务状态码  |
| message   | 描述信息    |
| data      | 返回数据    |
| meta      | 元数据      |
| traceId   | 请求追踪 ID |
| timestamp | UTC 时间    |

------

# 61. Empty Response

例如：

```
DELETE /products/1001
```

返回：

```
204 No Content
```

Body：

为空。

------

# 62. Error Response

统一：

```
{
  "success": false,
  "code": 1002001,
  "message": "Product Not Found",
  "errors": [
    {
      "field": "id",
      "reason": "Not Found"
    }
  ],
  "traceId": "trace-123456",
  "timestamp": "2026-07-10T08:30:00Z"
}
```

------

# 63. Validation Error

字段校验失败：

返回：

```
400 Bad Request
```

例如：

```
{
  "success": false,
  "code": 1001001,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "name",
      "reason": "Required"
    }
  ]
}
```

------

# 64. Meta Object

Meta：

用于：

分页及扩展信息。

例如：

```
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 356,
    "totalPages": 18
  }
}
```

------

# 65. Timestamp

统一：

ISO 8601。

例如：

```
2026-07-10T08:30:00Z
```

统一：

UTC。

------

# 66. Trace ID

所有请求：

生成：

Trace ID。

例如：

```
trace-9f6c3d18ab42
```

作用：

```
Request Tracking

↓

Distributed Logging

↓

Error Investigation
```

------

# 67. Null Handling

统一规则：

```
Unknown

↓

null
```

空集合：

```
[]
```

禁止：

```
null
```

表示：

集合。

------

# 68. Boolean Representation

统一：

JSON Boolean。

例如：

```
{
  "published": true,
  "deleted": false
}
```

禁止：

```
0

1

Yes

No
```

------

# 69. Number Representation

金额：

统一：

Decimal。

数量：

Integer。

禁止：

字符串数字。

例如：

```
{
  "price": 1250.50,
  "quantity": 8
}
```

------

# 70. Request & Response Checklist

## Request

□ JSON

□ UTF-8

□ Valid Header

------

## Response

□ Unified Envelope

□ Trace ID

□ Timestamp

□ Meta

------

## Error

□ Standard Error

□ Validation Detail

□ HTTP Status Correct

------

# 71. Request & Response Status

| Item                | Status  |
| ------------------- | ------- |
| Request Body        | Defined |
| Response Envelope   | Defined |
| Error Response      | Defined |
| Validation Response | Defined |
| Meta Object         | Defined |
| Trace ID            | Defined |
| Timestamp           | Defined |

# 72. Query Capability Overview

## 72.1 Purpose

统一 VISNDT Backend 所有列表接口的查询规范。

目标：

```
Efficient Query

↓

Consistent Interface

↓

High Performance

↓

Scalable
```

------

## 72.2 Supported Query Features

所有 Collection API 应支持：

```
Pagination

↓

Filtering

↓

Sorting

↓

Searching

↓

Field Selection

↓

Relationship Expansion
```

------

# 73. Pagination Strategy

默认采用：

Offset Pagination。

格式：

```
GET /api/v1/products?page=1&pageSize=20
```

默认值：

| Parameter | Default |
| --------- | ------- |
| page      | 1       |
| pageSize  | 20      |

------

# 74. Page Size Limitation

统一限制：

```
Minimum:

1

Maximum:

100

Default:

20
```

超过：

100

自动：

限制为：

100。

------

# 75. Pagination Response

统一：

```
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 235,
    "totalPages": 12,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

------

# 76. Cursor Pagination

超大数据集：

推荐：

Cursor Pagination。

例如：

```
GET /products?cursor=eyJpZCI6MTAwMX0&pageSize=20
```

特点：

```
Stable

↓

Fast

↓

Large Dataset Friendly
```

------

# 77. Filtering

统一：

Query Parameter。

例如：

```
GET /products?status=published

GET /products?supplierId=SUP-1001

GET /products?categoryId=CAT-1002
```

多个条件：

默认：

AND。

------

# 78. Multi-value Filtering

支持：

多个值。

例如：

```
GET /products?status=draft,published
```

表示：

```
status

IN

(draft,published)
```

------

# 79. Range Filtering

范围查询：

统一：

```
GET /products?priceMin=1000&priceMax=5000
```

日期：

例如：

```
GET /products?createdAfter=2026-01-01

GET /products?createdBefore=2026-12-31
```

------

# 80. Sorting

统一参数：

```
sort
```

例如：

```
GET /products?sort=name

GET /products?sort=-createdAt

GET /products?sort=brand,-createdAt
```

规则：

```
field

=

Ascending

-field

=

Descending
```

------

# 81. Search

统一参数：

```
keyword
```

例如：

```
GET /products?keyword=industrial endoscope
```

搜索范围：

```
Product Name

Brand

Model

Description
```

------

# 82. Exact Match

精确查询：

例如：

```
GET /products?productCode=VIS-10001
```

不得：

使用：

模糊搜索。

------

# 83. Field Selection

支持：

字段选择。

例如：

```
GET /products?fields=id,name,status
```

返回：

仅：

指定字段。

------

# 84. Relationship Expansion

支持：

Expand。

例如：

```
GET /products/1001?expand=supplier
```

多个：

```
GET /products/1001?expand=supplier,category
```

作用：

减少：

多次请求。

------

# 85. Default Ordering

若：

未指定：

排序。

默认：

```
createdAt DESC
```

保证：

分页稳定。

------

# 86. Query Validation

统一验证：

```
Page

PageSize

Sort Field

Filter Field

Expand Field
```

非法字段：

返回：

```
400 Bad Request
```

------

# 87. Performance Rules

查询：

不得：

返回：

无限数据。

必须：

```
Pagination

↓

Index

↓

Limited Response
```

------

# 88. Maximum Query Complexity

限制：

```
Maximum Expand

=

3

Maximum Sort Field

=

3

Maximum Filter

=

20
```

防止：

复杂查询。

------

# 89. Cache Friendly Query

GET 查询：

允许：

HTTP Cache。

推荐：

支持：

```
ETag

Last-Modified

Cache-Control
```

------

# 90. Query Security

所有查询：

必须：

校验：

```
Permission

↓

Data Scope

↓

Organization Scope
```

禁止：

越权查询。

------

# 91. Query Checklist

## Pagination

□ page

□ pageSize

□ meta

------

## Query

□ Filter

□ Sort

□ Search

□ Expand

□ Fields

------

## Performance

□ Index

□ Limit

□ Cache

------

# 92. Query Status

| Item                   | Status  |
| ---------------------- | ------- |
| Pagination             | Defined |
| Filtering              | Defined |
| Sorting                | Defined |
| Search                 | Defined |
| Field Selection        | Defined |
| Relationship Expansion | Defined |
| Query Validation       | Defined |
| Performance Rules      | Defined |

# 93. HTTP Status Code Overview

## 93.1 Purpose

统一 Backend API 的 HTTP Status Code 使用规范。

目标：

```
Standard

↓

Predictable

↓

RESTful

↓

Easy Debugging

↓

Machine Readable
```

------

## 93.2 Design Principles

HTTP Status：

负责描述：

HTTP 请求结果。

Business Code：

负责描述：

业务状态。

两者：

必须：

分离。

------

# 94. Status Code Classification

统一分类：

| Category      | Range | Description |
| ------------- | ----- | ----------- |
| Informational | 1xx   | 信息响应    |
| Success       | 2xx   | 成功        |
| Redirection   | 3xx   | 重定向      |
| Client Error  | 4xx   | 客户端错误  |
| Server Error  | 5xx   | 服务端错误  |

------

# 95. Success Status Code

统一：

| Status         | Usage                |
| -------------- | -------------------- |
| 200 OK         | 查询成功             |
| 201 Created    | 创建成功             |
| 202 Accepted   | 已接受异步处理       |
| 204 No Content | 删除成功或无返回内容 |

------

# 96. 200 OK

适用于：

```
GET

PUT

PATCH

POST（非创建）
```

例如：

```
HTTP/1.1 200 OK
```

------

# 97. 201 Created

创建资源：

统一：

```
HTTP/1.1 201 Created
```

建议：

Header：

```
Location:

/api/v1/products/10001
```

------

# 98. 202 Accepted

适用于：

异步任务。

例如：

```
Export

Import

AI Processing

Image Processing
```

表示：

任务：

已进入队列。

------

# 99. 204 No Content

适用于：

```
DELETE

Empty Update
```

Response：

无：

Body。

------

# 100. Client Error (4xx)

统一：

| Status | Description            |
| ------ | ---------------------- |
| 400    | Bad Request            |
| 401    | Unauthorized           |
| 403    | Forbidden              |
| 404    | Not Found              |
| 405    | Method Not Allowed     |
| 409    | Conflict               |
| 410    | Gone                   |
| 412    | Precondition Failed    |
| 415    | Unsupported Media Type |
| 422    | Unprocessable Entity   |
| 429    | Too Many Requests      |

------

# 101. 400 Bad Request

适用于：

```
Validation Failed

Invalid Parameter

Malformed JSON
```

------

# 102. 401 Unauthorized

表示：

未认证。

例如：

```
Missing Token

Expired Token

Invalid Token
```

客户端：

需要：

重新认证。

------

# 103. 403 Forbidden

表示：

身份有效。

但是：

没有权限。

例如：

```
Permission Denied

Role Not Allowed

Organization Restricted
```

------

# 104. 404 Not Found

表示：

资源不存在。

例如：

```
GET /products/999999
```

返回：

404。

------

# 105. 405 Method Not Allowed

例如：

```
DELETE /system/profile
```

资源：

不支持：

DELETE。

必须：

返回：

```
Allow:

GET

PATCH
```

------

# 106. 409 Conflict

适用于：

资源冲突。

例如：

```
Duplicate Product Code

Duplicate Username

Duplicate Email
```

------

# 107. 422 Unprocessable Entity

表示：

JSON：

合法。

但：

业务规则：

失败。

例如：

```
Invalid State Transition

Business Rule Violation
```

------

# 108. 429 Too Many Requests

触发：

Rate Limit。

返回：

```
Retry-After: 60
```

单位：

秒。

------

# 109. Server Error (5xx)

统一：

| Status | Description           |
| ------ | --------------------- |
| 500    | Internal Server Error |
| 501    | Not Implemented       |
| 502    | Bad Gateway           |
| 503    | Service Unavailable   |
| 504    | Gateway Timeout       |

------

# 110. 500 Internal Server Error

表示：

未知服务器异常。

Response：

不得：

暴露：

```
Stack Trace

Database SQL

Password

Secret
```

------

# 111. Business Error Code

HTTP Status：

不能代替：

业务状态码。

统一：

```
{
  "success": false,
  "code": 2003001,
  "message": "Product Already Exists"
}
```

Business Code：

详见：

```
506_Error_Code_Specification
```

------

# 112. Validation Error Format

统一：

```
{
  "success": false,
  "code": 1001001,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "name",
      "reason": "Required"
    }
  ]
}
```

支持：

多个错误。

------

# 113. Retry Strategy

允许：

自动重试：

```
502

503

504
```

禁止：

自动重试：

```
400

401

403

404

422
```

------

# 114. Error Logging

所有：

5xx：

必须：

记录：

```
Trace ID

Request ID

User ID

Stack

Timestamp
```

------

# 115. Error Security

错误信息：

不得：

泄露：

```
Database Schema

SQL

Filesystem

Internal IP

Secret Key
```

------

# 116. HTTP Status Checklist

## Success

□ 200

□ 201

□ 202

□ 204

------

## Client Error

□ 400

□ 401

□ 403

□ 404

□ 409

□ 422

------

## Server Error

□ 500

□ 503

□ Error Logging

------

# 117. HTTP Status Specification Status

| Item              | Status  |
| ----------------- | ------- |
| Success Codes     | Defined |
| Client Errors     | Defined |
| Server Errors     | Defined |
| Business Errors   | Defined |
| Validation Errors | Defined |
| Retry Strategy    | Defined |
| Error Security    | Defined |

# 118. API Security Overview

## 118.1 Purpose

API Security Specification 用于定义 VISNDT Backend API 的统一安全规范。

目标：

```
Secure

↓

Reliable

↓

Traceable

↓

Auditable

↓

Production Ready
```

------

## 118.2 Security Principles

所有 API 必须遵循：

```
Zero Trust

↓

Least Privilege

↓

Defense in Depth

↓

Secure by Default
```

------

# 119. HTTPS Requirement

所有生产环境 API：

必须：

```
HTTPS Only
```

禁止：

```
HTTP
```

TLS：

最低：

```
TLS 1.2
```

推荐：

```
TLS 1.3
```

------

# 120. Authentication

统一采用：

```
JWT Bearer Token
```

Header：

```
Authorization: Bearer <access_token>
```

不得：

通过：

```
URL

Query Parameter
```

传递 Token。

------

# 121. Authorization

权限验证：

统一流程：

```
Authentication

↓

Role Validation

↓

Permission Validation

↓

Data Scope Validation
```

全部通过：

允许：

访问资源。

------

# 122. Permission Model

Backend 支持：

```
Role

Permission

Resource

Action
```

例如：

```
Product.Read

Product.Create

Product.Update

Product.Delete
```

------

# 123. Resource Scope

数据权限：

包括：

```
Self

Department

Organization

Platform
```

不得：

跨组织：

读取资源。

------

# 124. Idempotency

POST：

支持：

```
Idempotency-Key
```

Header：

```
Idempotency-Key:

550e8400-e29b-41d4-a716-446655440000
```

作用：

防止：

重复创建。

------

# 125. Replay Attack Protection

对于：

```
Payment

Order

Requirement Submission

Import
```

必须：

校验：

```
Token

↓

Timestamp

↓

Nonce

↓

Idempotency-Key
```

------

# 126. Token Expiration

Access Token：

建议：

```
30 Minutes
```

Refresh Token：

建议：

```
30 Days
```

Token：

过期：

必须：

重新获取。

------

# 127. Token Revocation

支持：

Token 撤销。

例如：

```
Logout

Password Changed

Permission Changed

Account Disabled
```

Token：

立即：

失效。

------

# 128. CORS Policy

允许：

指定：

Origin。

例如：

```
https://visndt.com

https://admin.visndt.com
```

禁止：

```
*
```

用于：

生产环境。

------

# 129. CSRF Protection

采用：

JWT Bearer：

默认：

无需：

CSRF Token。

若：

使用 Cookie：

必须：

开启：

```
SameSite

CSRF Token
```

------

# 130. Rate Limiting

统一：

Rate Limit。

建议：

| API Type      | Limit       |
| ------------- | ----------- |
| Anonymous     | 60 req/min  |
| Authenticated | 600 req/min |
| Login         | 10 req/min  |
| Upload        | 30 req/min  |

超过：

返回：

```
429 Too Many Requests
```

------

# 131. Input Validation

所有输入：

必须：

验证：

```
Type

Length

Range

Format

Enum

Required
```

禁止：

直接进入：

业务层。

------

# 132. Output Encoding

所有输出：

必须：

JSON Encode。

禁止：

直接：

输出：

```
HTML

Script

Unsafe Content
```

------

# 133. File Upload Security

上传文件：

必须：

检查：

```
File Type

MIME

Extension

File Size

Virus Scan (Optional)
```

禁止：

执行：

上传文件。

------

# 134. API Logging

安全日志：

记录：

```
User ID

IP

Method

URI

Status

Trace ID

Timestamp
```

不得：

记录：

```
Password

JWT

Secret

Private Key
```

------

# 135. Security Header

推荐：

统一返回：

```
X-Content-Type-Options

X-Frame-Options

Referrer-Policy

Content-Security-Policy
```

------

# 136. API Security Checklist

## Authentication

□ JWT

□ Expiration

□ Revocation

------

## Authorization

□ Role

□ Permission

□ Data Scope

------

## Protection

□ HTTPS

□ Rate Limit

□ Idempotency

□ Validation

------

## Logging

□ Trace ID

□ Audit Log

□ Sensitive Data Masking

------

# 137. API Security Status

| Item             | Status  |
| ---------------- | ------- |
| HTTPS            | Defined |
| Authentication   | Defined |
| Authorization    | Defined |
| Idempotency      | Defined |
| Rate Limiting    | Defined |
| CORS             | Defined |
| Logging          | Defined |
| Security Headers | Defined |

# 138. API Lifecycle Overview

## 138.1 Purpose

API Lifecycle 用于规范 VISNDT API 从设计到废弃的完整生命周期。

目标：

```
Design

↓

Implement

↓

Release

↓

Maintain

↓

Deprecate

↓

Retire
```

------

## 138.2 Lifecycle Principles

所有 API 必须遵循：

```
Stable

↓

Backward Compatible

↓

Version Controlled

↓

Observable
```

------

# 139. API Versioning Strategy

统一采用：

```
URI Versioning
```

例如：

```
/api/v1/products

/api/v2/products
```

禁止：

```
Header Version

Media Type Version

Query Version
```

------

# 140. Version Naming

统一：

```
v1

v2

v3
```

禁止：

```
version1

V1.0

release1
```

------

# 141. Major Version

以下情况：

必须：

升级：

Major Version。

例如：

```
Breaking Change

↓

Field Removed

↓

Response Changed

↓

Authentication Changed
```

例如：

```
v1

↓

v2
```

------

# 142. Minor Change

允许：

无需：

升级 Version。

包括：

```
Add Optional Field

↓

Performance Improvement

↓

Internal Optimization
```

要求：

保持：

Backward Compatibility。

------

# 143. Patch Update

Patch：

用于：

```
Bug Fix

↓

Documentation Update

↓

Security Fix
```

不得：

修改：

API Contract。

------

# 144. Backward Compatibility

新增字段：

允许。

删除字段：

禁止。

修改字段类型：

禁止。

修改字段语义：

禁止。

------

# 145. Deprecated API

API 不立即删除。

先进入：

```
Deprecated
```

阶段。

响应 Header：

建议：

```
Deprecation: true
```

------

# 146. Sunset Policy

废弃 API：

必须：

提供：

```
Sunset: 2028-01-01
```

同时：

提供：

迁移说明。

------

# 147. API Migration

Deprecated API：

必须：

提供：

```
Migration Guide
```

包括：

```
Old API

↓

New API

↓

Example

↓

Timeline
```

------

# 148. Breaking Change Management

Breaking Change：

必须：

完成：

```
Architecture Review

↓

API Review

↓

Version Upgrade

↓

Documentation Update
```

禁止：

直接上线。

------

# 149. API Release Stages

统一阶段：

```
Draft

↓

Internal

↓

Beta

↓

GA

↓

Deprecated

↓

Retired
```

------

# 150. Draft API

Draft：

特点：

```
Not Stable

May Change

Internal Only
```

不得：

公开。

------

# 151. Beta API

Beta：

允许：

外部试用。

要求：

```
Feature Complete

↓

Collect Feedback

↓

Improve Stability
```

------

# 152. GA API

GA：

表示：

```
Production Ready

Stable

Supported
```

允许：

长期维护。

------

# 153. Retired API

Retired：

特点：

```
Unavailable

No Support

No Maintenance
```

返回：

```
410 Gone
```

------

# 154. API Governance

所有 API：

必须：

经过：

```
Architecture Review

↓

Security Review

↓

Performance Review

↓

Documentation Review
```

------

# 155. Documentation Synchronization

API 更新：

必须：

同步：

```
502_API_Design_Specification

503_OpenAPI_Specification

505_Backend_Business_Service

Frontend SDK

API Changelog
```

------

# 156. Changelog

统一维护：

```
CHANGELOG.md
```

格式：

```
Version

Date

Author

Change Summary

Impact
```

------

# 157. Lifecycle Checklist

## Version

□ URI Version

□ Backward Compatible

------

## Release

□ Draft

□ Beta

□ GA

------

## Retirement

□ Deprecated

□ Sunset

□ Migration Guide

------

# 158. Lifecycle Status

| Item                   | Status  |
| ---------------------- | ------- |
| Version Strategy       | Defined |
| Backward Compatibility | Defined |
| Deprecation Policy     | Defined |
| Sunset Policy          | Defined |
| Migration Guide        | Defined |
| API Governance         | Defined |
| Release Lifecycle      | Defined |

# 159. API Documentation Overview

## 159.1 Purpose

API Documentation 用于规范 VISNDT Backend API 的描述、维护和使用方式。

目标：

```
Clear

↓

Complete

↓

Machine Readable

↓

Developer Friendly
```

------

## 159.2 Documentation Principles

API 文档必须：

```
Accurate

Consistent

Versioned

Executable
```

------

# 160. OpenAPI Standard

VISNDT API 文档：

采用：

```
OpenAPI Specification
```

版本：

```
OpenAPI 3.1
```

------

# 161. OpenAPI Document Structure

统一：

```
openapi:

info:

servers:

paths:

components:

schemas:

security:
```

------

# 162. API Documentation Location

Repository：

统一：

```
docs/api/
```

结构：

```
docs/

└── api/

    ├── openapi.yaml

    ├── schemas/

    ├── examples/

    └── changelog/
```

------

# 163. API Description Requirement

每个 API：

必须包含：

```
Summary

Description

Authentication

Parameters

Request Body

Response

Error
```

------

# 164. Endpoint Documentation Example

示例：

```
/products/{id}:

  get:

    summary:

      Get Product Detail

    description:

      Retrieve product information by id
```

------

# 165. Schema Definition

所有对象：

必须：

定义 Schema。

例如：

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

# 166. Schema Reuse

公共对象：

统一：

components。

例如：

```
components:

 schemas:

  Product:

  Organization:

  Offer:

  Demand:

  RFQ:

  Notification:

  Pagination:
```

禁止：

重复定义。

------

# 167. Response Schema

统一：

Response Wrapper。

例如：

```
ApiResponse:

 type: object

 properties:

  success:

   type: boolean

  code:

   type: integer

  data:

   type: object
```

------

# 168. API Example

每个 API：

必须：

提供：

Request Example。

例如：

```
{
  "name": "Industrial Endoscope",
  "status": "draft"
}
```

Response Example：

```
{
  "success": true,
  "data": {}
}
```

------

# 169. Swagger UI

开发环境：

支持：

```
Swagger UI
```

用途：

```
API Browse

↓

Try Request

↓

Debug
```

------

# 170. Redoc

生产文档：

推荐：

```
Redoc
```

特点：

```
Readable

Static

Developer Friendly
```

------

# 171. Mock Server

API 开发：

支持：

Mock。

流程：

```
OpenAPI

↓

Mock Server

↓

Frontend Development
```

用途：

前后端并行开发。

------

# 172. SDK Generation

支持：

自动生成 SDK。

流程：

```
OpenAPI

↓

Generator

↓

Client SDK
```

支持：

```
JavaScript

TypeScript

Python

Java
```

------

# 173. SDK Version

SDK：

独立版本：

例如：

```
visndt-sdk-js

v1.0.0
```

要求：

与 API Version 对应。

------

# 174. API Documentation Testing

文档必须：

自动检查：

```
Schema Valid

↓

Example Valid

↓

Response Match
```

------

# 175. Contract Testing

采用：

API Contract Test。

验证：

```
Frontend Expectation

=

Backend Response
```

避免：

接口漂移。

------

# 176. API Change Detection

API 修改：

自动检测：

```
Breaking Change

↓

Schema Difference

↓

Endpoint Difference
```

------

# 177. Documentation Release

API 发布：

必须同步：

```
OpenAPI

↓

Changelog

↓

Migration Guide

↓

Frontend Notice
```

------

# 178. API Documentation Checklist

## Specification

□ OpenAPI 3.1

□ Schema Complete

□ Example Complete

------

## Tools

□ Swagger UI

□ Redoc

□ Mock Server

------

## Development

□ SDK Generation

□ Contract Test

□ Change Detection

------

# 179. Documentation Status

| Item              | Status  |
| ----------------- | ------- |
| OpenAPI Standard  | Defined |
| Swagger UI        | Defined |
| Redoc             | Defined |
| Schema Management | Defined |
| Mock Server       | Defined |
| SDK Generation    | Defined |
| Contract Testing  | Defined |
| Change Detection  | Defined |

# 180. Performance Overview

## 180.1 Purpose

Performance Specification 用于统一 Backend API 的性能目标、缓存策略及优化规范。

目标：

```
Fast

↓

Stable

↓

Scalable

↓

Observable

↓

Production Ready
```

------

## 180.2 Performance Principles

Backend API 必须满足：

```
Low Latency

↓

High Throughput

↓

Efficient Resource Usage

↓

Predictable Performance
```

------

# 181. Performance Targets

生产环境建议目标：

| API Type       | Target  |
| -------------- | ------- |
| Simple Query   | <100 ms |
| Standard Query | <300 ms |
| Complex Query  | <800 ms |
| File Upload    | <5 s    |
| File Download  | <10 s   |

P99：

建议：

```
<1000 ms
```

------

# 182. Database Query Optimization

数据库查询必须：

```
Use Index

↓

Avoid Full Table Scan

↓

Avoid N+1 Query

↓

Limit Returned Columns
```

禁止：

```
SELECT *
```

------

# 183. Pagination Optimization

列表接口：

必须：

分页。

禁止：

```
Return All Records
```

默认：

```
page=1

pageSize=20
```

------

# 184. HTTP Cache

GET 接口：

允许：

HTTP Cache。

推荐 Header：

```
Cache-Control

ETag

Last-Modified
```

------

# 185. Cache-Control Strategy

推荐：

| Resource        | Cache Policy          |
| --------------- | --------------------- |
| Static Resource | public, max-age=86400 |
| Product Detail  | private, max-age=300  |
| Search Result   | no-cache              |
| Authentication  | no-store              |

------

# 186. ETag

支持：

ETag。

例如：

```
ETag: "8fd2b9ef"
```

客户端：

发送：

```
If-None-Match
```

服务器：

若：

未修改：

返回：

```
304 Not Modified
```

------

# 187. Last-Modified

支持：

```
Last-Modified
```

客户端：

发送：

```
If-Modified-Since
```

服务器：

返回：

```
304 Not Modified
```

------

# 188. Compression

启用：

HTTP Compression。

推荐：

```
gzip

br (Brotli)
```

禁止：

未压缩：

大型 JSON。

------

# 189. Payload Optimization

Response：

应：

最小化。

例如：

```
Only Required Fields

↓

Pagination

↓

Compression
```

避免：

返回：

未使用字段。

------

# 190. CDN Strategy

静态资源：

推荐：

CDN。

包括：

```
Image

Video

PDF

Attachment

Static Asset
```

API：

默认：

不缓存动态数据。

------

# 191. Connection Reuse

支持：

```
HTTP Keep-Alive

↓

HTTP/2

↓

HTTP/3 (Optional)
```

减少：

连接建立成本。

------

# 192. Batch Optimization

多个资源：

推荐：

Batch API。

例如：

```
POST /api/v1/products/batch
```

避免：

大量：

重复请求。

------

# 193. Large File Processing

超过：

20 MB：

采用：

```
Chunk Upload

↓

Resume Upload
```

后台：

异步处理。

------

# 194. Async Processing

耗时任务：

采用：

```
Queue

↓

Worker

↓

Async Job
```

例如：

```
Import

Export

AI Analysis

Image Processing
```

返回：

```
202 Accepted
```

------

# 195. Performance Monitoring

统一监控：

```
Response Time

↓

Request Count

↓

Error Rate

↓

CPU

↓

Memory
```

------

# 196. Performance Metrics

建议：

采集：

| Metric     | Description  |
| ---------- | ------------ |
| TPS        | 每秒事务数   |
| QPS        | 每秒查询数   |
| P50        | 中位响应时间 |
| P95        | 95% 响应时间 |
| P99        | 99% 响应时间 |
| Error Rate | 错误率       |

------

# 197. Alert Threshold

建议：

| Metric     | Threshold |
| ---------- | --------- |
| Error Rate | >1%       |
| P95        | >500 ms   |
| CPU        | >80%      |
| Memory     | >85%      |

超过：

触发：

告警。

------

# 198. Performance Checklist

## Query

□ Index

□ Pagination

□ Projection

------

## Cache

□ Cache-Control

□ ETag

□ Compression

------

## Runtime

□ Monitoring

□ Alert

□ Metrics

------

# 199. Performance Status

| Item               | Status  |
| ------------------ | ------- |
| Performance Target | Defined |
| Query Optimization | Defined |
| Cache Strategy     | Defined |
| Compression        | Defined |
| Async Processing   | Defined |
| Monitoring         | Defined |
| Metrics            | Defined |
| Alert Strategy     | Defined |

# 200. Performance Specification Complete

Document：

```
502_API_Design_Specification
```

BLOCK：

```
10/10
```

Status：

```
FINAL
```

Completion：

```
100%
```

Repository Status：

```
API Design Specification Completed
```

------

# 502 DOCUMENT COMPLETE

Version：

```
V1.0
```

Status：

```
FINAL
```

Repository：

```
Ready For 503_OpenAPI_Specification
```
