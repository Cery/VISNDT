# API Test Foundation

------

# 1. Purpose

定义 VISNDT 平台 API 接口测试规范。

目标：

确保：

- 接口功能正确；
- 请求响应稳定；
- 数据传输准确；
- 异常处理完善。

------

# 2. API Test Position

API 测试位于：

```
Frontend

↓

API Layer

↓

Backend Service

↓

Database
```

------

# 3. API Test Scope

覆盖：

```
Demand API

Product API

Category API

Content API

User API

System API
```

------

# 4. API Test Objectives

验证：

```
Availability

Correctness

Security

Performance

Consistency
```

------

# 5. API Test Types

包括：

```
Functional API Test

Parameter Test

Response Test

Error Test

Security Test

Regression Test
```

------

# 6. API Test Environment

环境：

```
Development API

Testing API

Production API
```

------

# 7. API Request Validation

检查：

```
Method

URL

Header

Parameter

Body
```

------

# 8. HTTP Method Test

支持：

```
GET

POST

PUT

DELETE
```

------

# 9. Response Validation

检查：

```
Status Code

Response Format

Data Structure

Business Result
```

------

# 10. Status Code Verification

标准：

| Code | Meaning         |
| ---- | --------------- |
| 200  | Success         |
| 201  | Created         |
| 400  | Invalid Request |
| 401  | Unauthorized    |
| 403  | Forbidden       |
| 404  | Not Found       |
| 500  | Server Error    |

------

# 11. Data Consistency Test

验证：

```
API Response

↓

Database Record

↓

Frontend Display
```

一致。

------

# 12. API Parameter Test

测试：

```
Required Parameter

Optional Parameter

Invalid Parameter

Empty Parameter
```

------

# 13. Error Handling Test

验证：

```
Invalid Input

Missing Data

Permission Error

Server Exception
```

------

# 14. API Documentation Alignment

检查：

```
Endpoint

Parameter

Response

Example
```

------

# 15. Demand API Test

范围：

```
Create Demand

Query Demand

Update Status

Response Submission
```

------

# 16. Product API Test

范围：

```
Product List

Product Detail

Category Query

Parameter Filter
```

------

# 17. Content API Test

范围：

```
Article List

Article Detail

Related Content
```

------

# 18. Authentication API Test

验证：

```
Token

Session

Permission

Expiration
```

------

# 19. API Test Case Example

编号：

```
TC-API-DEMAND-001
```

------

场景：

```
Create Demand
```

------

请求：

```
POST /demands
```

------

验证：

```
Request Accepted

Data Saved

Response Correct
```

------

# 20. API Foundation Checklist

| Item                | Status  |
| ------------------- | ------- |
| Scope               | Defined |
| Environment         | Defined |
| Request Validation  | Defined |
| Response Validation | Defined |
| Error Handling      | Defined |
| Data Consistency    | Defined |
| API Cases           | Defined |

# API Functional Test Cases

------

# 21. Purpose

定义 VISNDT API 功能测试用例。

目标：

验证：

- API 服务可用；
- 业务逻辑正确；
- 数据交互准确；
- 前后端连接正常。

------

# 22. API Functional Test Scope

覆盖：

```
Product Service

Demand Service

Content Service

RFQ Service

User Service
```

------

# 23. Product API Test

------

## 23.1 Product List API

接口：

```
GET /products
```

验证：

```
Request Success

Product List Returned

Pagination Correct
```

------

## 23.2 Product Detail API

接口：

```
GET /products/{id}
```

验证：

```
Product Information

Parameters

Category

Related Data
```

------

## 23.3 Product Filter API

接口：

```
GET /products/filter
```

验证：

```
Parameter Match

Multiple Filter

Empty Result
```

------

# 24. Demand API Test

------

## 24.1 Create Demand API

接口：

```
POST /demands
```

输入：

```
Title

Category

Description

Parameters

Contact
```

验证：

```
Created Successfully

ID Generated

Database Saved
```

------

## 24.2 Query Demand API

接口：

```
GET /demands/{id}
```

验证：

```
Demand Detail

Status

Timeline
```

------

## 24.3 Update Demand Status API

接口：

```
PUT /demands/{id}/status
```

验证：

```
Status Updated

History Recorded
```

------

# 25. RFQ API Test

验证：

```
Demand RFQ

Organization Response

Solution Data
```

------

测试：

```
Valid Demand

↓

RFQ Result

↓

Response Display
```

------

# 26. Content API Test

------

## 26.1 Article List API

接口：

```
GET /articles
```

验证：

```
List Returned

Category Correct

Pagination
```

------

## 26.2 Article Detail API

接口：

```
GET /articles/{id}
```

验证：

```
Content

Metadata

Related Information
```

------

# 27. User API Test

验证：

```
User Create

User Query

User Update

Permission
```

------

# 28. Validation Test Cases

测试：

```
Missing Field

Invalid Format

Too Long Input

Special Character
```

------

# 29. Exception Test Cases

测试：

```
Invalid ID

Non Existing Data

Server Exception

Timeout
```

------

# 30. API Response Test Matrix

| Test Item       | Expected   |
| --------------- | ---------- |
| Status Code     | Correct    |
| Response Format | Valid      |
| Data Structure  | Complete   |
| Error Message   | Clear      |
| Database Result | Consistent |

------

# 31. API Functional Test Priority

| Priority | API             |
| -------- | --------------- |
| P0       | Demand API      |
| P0       | Product API     |
| P1       | RFQ API         |
| P1       | Content API     |
| P2       | User API        |

------

# 32. API Functional Checklist

| Item            | Status  |
| --------------- | ------- |
| Product API     | Defined |
| Demand API      | Defined |
| RFQ API         | Defined |
| Content API     | Defined |
| User API        | Defined |
| Validation      | Defined |
| Exception       | Defined |

# API Regression Test

------

# 33. Purpose

定义 VISNDT API 回归测试规范。

目标：

确保：

- API 修改后稳定；
- 核心接口持续可用；
- 数据链路不受影响。

------

# 34. API Regression Trigger

触发：

```
API Modification

Database Change

Business Logic Change

Frontend Integration Change

Bug Fix
```

------

# 35. Regression Scope

覆盖：

```
Core API

Business API

Data API

Authentication API

Integration API
```

------

# 36. Product API Regression

测试：

```
Product List

Product Detail

Product Search

Product Filter

Parameter Query
```

验证：

```
Response Correct

Data Complete

Performance Stable
```

------

# 37. Demand API Regression

测试：

```
Create Demand

Query Demand

Update Status

Demand RFQ

Response Handling
```

验证：

```
Workflow Normal

Status Correct

Data Consistent
```

------

# 38. RFQ API Regression

验证：

```
Demand RFQ

Capability Matching

Organization Response
```

------

# 39. Content API Regression

测试：

```
Article List

Article Detail

Category

Related Content
```

------

# 40. Database Impact Regression

验证：

```
API Request

↓

Database Operation

↓

Response Result
```

------

# 41. Interface Compatibility Test

检查：

```
Field Name

Data Type

Response Structure

Version Compatibility
```

------

# 42. Error Handling Regression

测试：

```
Invalid Parameter

Missing Data

Permission Failure

Server Exception
```

------

# 43. API Performance Regression

检查：

```
Response Time

Concurrent Request

Resource Usage
```

------

# 44. API Security Regression

检查：

```
Authentication

Authorization

Input Validation

Data Exposure
```

------

# 45. Regression Execution Process

流程：

```
Select API Cases

↓

Execute Test

↓

Compare Result

↓

Analyze Difference

↓

Approve Release
```

------

# 46. API Regression Report

包含：

```
API Version

Test Scope

Cases

Result

Issues

Conclusion
```

------

# 47. API Regression Acceptance Rule

通过条件：

```
P0 API Passed

No Critical Error

Data Consistency Confirmed
```

------

# 48. API Regression Checklist

| Item            | Status  |
| --------------- | ------- |
| Product API     | Defined |
| Demand API      | Defined |
| RFQ API         | Defined |
| Content API     | Defined |
| Database Impact | Defined |
| Compatibility   | Defined |
| Performance     | Defined |
| Security        | Defined |
| Report          | Defined |

# API Test Acceptance Specification

------

# 49. Purpose

定义 VISNDT API 测试最终验收标准。

目标：

确认：

- API 服务稳定；
- 接口规范完整；
- 数据交互正确；
- 发布条件满足。

------

# 50. Acceptance Scope

范围：

```
API Availability

Request Validation

Response Verification

Business Logic

Data Consistency

Regression
```

------

# 51. API Availability Acceptance

检查：

接口：

```
Accessible

Responsive

Stable
```

------

状态：

```
PASS
```

------

# 52. Request Validation Acceptance

检查：

包含：

```
Method

Parameter

Header

Body

Format
```

------

状态：

```
PASS
```

------

# 53. Response Acceptance

检查：

包含：

```
Status Code

Response Structure

Data Format

Error Message
```

------

状态：

```
PASS
```

------

# 54. Business Logic Acceptance

检查：

核心接口：

```
Product Query

Demand Creation

RFQ

Status Update
```

------

状态：

```
PASS
```

------

# 55. Data Consistency Acceptance

验证：

```
Request

↓

Database

↓

Response
```

一致。

------

状态：

```
PASS
```

------

# 56. Exception Handling Acceptance

检查：

场景：

```
Invalid Request

Missing Parameter

Unauthorized Access

Server Error
```

------

状态：

```
PASS
```

------

# 57. Regression Acceptance

要求：

```
Core API Passed

No Critical Issue

No Data Error
```

------

状态：

```
PASS
```

------

# 58. API Test Checklist

| Item                  | Status |
| --------------------- | ------ |
| Availability          | PASS   |
| Request Validation    | PASS   |
| Response Verification | PASS   |
| Business Logic        | PASS   |
| Data Consistency      | PASS   |
| Exception Handling    | PASS   |
| Regression            | PASS   |

------

# 59. 703_API_Test Final Status

| Module              | Status    |
| ------------------- | --------- |
| API Foundation      | Completed |
| API Functional Test | Completed |
| API Regression      | Completed |
| Acceptance          | Completed |
| v1.0 Alignment      | Completed |

------

# Blueprint v1.0 Alignment

## Terminology Alignment

| Legacy Term | Canonical Term | Scope |
|-------------|---------------|-------|
| Requirement API | Demand API | Business Object |
| CREATE Requirement | Create Demand | Business Object |
| Query Requirement | Query Demand | Business Object |
| Requirement Matching | RFQ | Business Object |
| Matching API | RFQ API | Business Object |
| Matching Service | RFQ Service | Business Object |
| Supplier Response | Organization Response | Business Object |
| POST /requirements | POST /demands | API Endpoint |
| GET /requirements/{id} | GET /demands/{id} | API Endpoint |
| PUT /requirements/{id}/status | PUT /demands/{id}/status | API Endpoint |

## Historical Test Case ID Mapping

| Legacy ID | Canonical ID | Status |
|-----------|-------------|--------|
| TC-API-REQ-001 | TC-API-DEMAND-001 | Migrated |
| TC-API-REQ-* | TC-API-DEMAND-* | Migrated |

## Test Object Alignment

VISNDT Blueprint v1.0 统一测试对象：

| Test Object | API Endpoint |
|-------------|-------------|
| Standard Product | /products |
| Product Parameter Metadata | /parameter-definitions |
| Parameter Template | /parameter-templates |
| Product Parameter Value | /product-parameter-values |
| Offer | /offers |
| Demand | /demands |
| RFQ | /rfqs |
| Workflow | /workflows |
| Notification | /notifications |

## Technology Baseline Reference

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + TypeScript |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma |
| API | REST (OpenAPI) |
| API Testing | Supertest + Jest |

## Migration Notes

1. 所有 API 端点已统一为 Canonical Naming Specification 标准路径。
2. API 测试用例编号已迁移：`TC-API-REQ-*` → `TC-API-DEMAND-*`。
3. 业务服务名称已统一：`Requirement Service` → `Demand Service`，`Matching Service` → `RFQ Service`。
4. 测试对象覆盖范围已对齐 Blueprint v1.0 的 9 个核心业务对象。

------

# 703_API_Test

Version:

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