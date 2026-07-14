Version: V1.0

Status: FINAL

------

# 1. Document Purpose

本文档定义 VISNDT Backend 的整体架构规范。

Backend Architecture 是整个 Repository 中 Backend 部分的最高层设计文档。

本文档用于统一：

- Backend Architecture
- Service Layer
- API Layer
- Business Layer
- Data Layer
- Security Layer
- Infrastructure Layer

所有 Backend 文档均必须遵循本规范。

------

# 2. Backend Design Goals

VISNDT Backend 应满足：

```
High Availability

High Maintainability

High Scalability

High Security

Low Coupling

High Cohesion
```

------

# 3. Backend Responsibilities

Backend 负责：

```
Business Logic

↓

Authentication

↓

Authorization

↓

Data Validation

↓

Database Access

↓

Audit Logging

↓

API Response
```

Backend 不负责：

- 页面渲染
- UI
- 浏览器状态管理

------

# 4. Backend Technology Stack

推荐技术：

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js LTS                   |
| Language       | TypeScript                    |
| Framework      | NestJS                        |
| ORM            | Prisma                        |
| Database       | PostgreSQL                    |
| Validation     | Zod                           |
| Authentication | JWT                           |
| Storage        | S3 Compatible Object Storage  |
| Cache          | Redis（可选）                 |
| Queue          | Worker / Queue（Phase 2 预留） |

------

# 5. Repository Position

Backend 位于：

```
500_Backend
```

依赖：

```
400_Database
```

输出：

```
600_Frontend
```

关系：

```
Frontend

↓

Backend API

↓

Business Service

↓

Prisma

↓

PostgreSQL
```

------

# 6. Architecture Principles

Backend 必须遵循：

```
Controller

↓

Service

↓

Repository

↓

Database
```

禁止：

```
Controller

↓

Database
```

禁止 Controller 直接访问数据库。

------

# 7. Layered Architecture

Backend 分为：

```
API Layer

↓

Application Layer

↓

Business Service

↓

Repository Layer

↓

Database
```

每层职责唯一。

------

# 8. API Layer

负责：

- HTTP Routing
- 参数解析
- Request Validation
- Response Formatting

禁止：

- Business Logic
- SQL
- Prisma

------

# 9. Service Layer

负责：

- 全部业务逻辑
- 权限判断
- Workflow
- Transaction

所有业务必须在此实现。

------

# 10. Repository Layer

Repository 负责：

```
CRUD

↓

Prisma

↓

Database
```

Repository 不包含：

业务规则。

------

# 11. Infrastructure Layer

负责：

- Logger
- Cache
- Queue
- File Storage
- Config
- Email
- Scheduler

统一抽象。

------

# 12. Backend Architecture Status

| Item                | Status  |
| ------------------- | ------- |
| Layer Definition    | Defined |
| Responsibility      | Defined |
| Technology Stack    | Defined |
| Dependency          | Defined |
| Repository Position | Defined |

# 13. Directory Design Principles

## 13.1 Purpose

Backend Directory Structure 用于统一整个 Backend Repository 的目录组织。

目标：

```
Clear Structure

↓

Easy Maintenance

↓

Module Isolation

↓

Scalable
```

------

## 13.2 Design Principles

Backend 目录遵循：

```
Business First

↓

Module Isolation

↓

Shared Infrastructure

↓

Low Coupling
```

------

# 14. Root Directory Layout

Backend 根目录：

```
backend/

├── src/
├── prisma/
├── docs/
├── scripts/
├── tests/
├── config/
├── public/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

------

# 15. Source Directory

所有业务代码位于：

```
src/
```

内部划分：

```
src/

├── app/
├── modules/
├── common/
├── infrastructure/
├── middleware/
├── config/
├── types/
├── utils/
└── main.ts
```

------

# 16. app Directory

app 用于：

系统启动。

包含：

```
app/

bootstrap.ts

router.ts

server.ts

application.ts
```

职责：

- 初始化
- 注册路由
- 加载配置
- 启动 Server

禁止：

业务逻辑。

------

# 17. modules Directory

所有业务模块位于：

```
modules/
```

例如：

```
modules/

identity/

organization/

product/

offer/

demand/

rfq/

workflow/

search/

notification/

file/
```

一个模块负责：

一个业务领域。

------

# 18. Module Internal Structure

每个模块统一：

```
product/

controller/

service/

repository/

dto/

entity/

validator/

mapper/

types/

index.ts
```

------

# 19. Controller Directory

Controller：

负责：

HTTP 请求。

例如：

```
product.controller.ts
```

职责：

- Receive Request
- Validate Input
- Call Service
- Return Response

禁止：

业务计算。

------

# 20. Service Directory

Service：

负责：

业务逻辑。

例如：

```
product.service.ts
```

包括：

- Workflow
- Transaction
- Permission
- Business Rule

------

# 21. Repository Directory

Repository：

负责：

数据库访问。

例如：

```
product.repository.ts
```

职责：

```
CRUD

↓

Prisma

↓

PostgreSQL
```

禁止：

业务逻辑。

------

# 22. DTO Directory

DTO：

负责：

数据传输对象。

例如：

```
create-product.dto.ts

update-product.dto.ts

query-product.dto.ts
```

统一：

输入输出格式。

------

# 23. Validator Directory

Validator：

负责：

参数校验。

推荐：

```
Zod Schema
```

例如：

```
product.validator.ts
```

------

# 24. Entity Directory

Entity：

负责：

业务对象定义。

例如：

```
product.entity.ts
```

说明：

不是数据库 Entity。

用于：

业务领域模型。

------

# 25. Mapper Directory

Mapper：

负责：

对象转换。

例如：

```
Database

↓

Entity

↓

DTO

↓

Response
```

统一：

数据映射。

------

# 26. Common Directory

公共能力：

```
common/

constants/

exceptions/

response/

validation/

decorators/
```

特点：

所有模块共享。

------

# 27. Infrastructure Directory

基础设施：

```
infrastructure/

logger/

cache/

storage/

queue/

email/

scheduler/
```

职责：

统一第三方能力。

------

# 28. Middleware Directory

中间件：

```
middleware/

auth/

cors/

logging/

rate-limit/

error-handler/
```

统一注册。

------

# 29. Config Directory

配置：

```
config/

database.ts

auth.ts

storage.ts

security.ts

app.ts
```

禁止：

硬编码配置。

------

# 30. Types Directory

统一类型：

```
types/

api.ts

auth.ts

database.ts

common.ts
```

避免：

重复定义。

------

# 31. Utils Directory

工具：

```
utils/

date.ts

string.ts

crypto.ts

pagination.ts
```

特点：

无状态。

可复用。

------

# 32. Directory Dependency Rule

依赖方向：

```
Controller

↓

Service

↓

Repository

↓

Prisma
```

禁止：

```
Repository

↓

Controller
```

禁止：

循环依赖。

------

# 33. Naming Rules

目录：

全部：

```
lowercase
```

文件：

统一：

```
kebab-case
```

类：

统一：

```
PascalCase
```

变量：

统一：

```
camelCase
```

------

# 34. Directory Architecture Checklist

## Root

□ src

□ prisma

□ tests

□ scripts

------

## Module

□ controller

□ service

□ repository

□ dto

□ validator

------

## Infrastructure

□ logger

□ storage

□ cache

□ middleware

------

# 35. Directory Architecture Status

| Item                  | Status  |
| --------------------- | ------- |
| Root Layout           | Defined |
| Module Layout         | Defined |
| Common Layout         | Defined |
| Infrastructure Layout | Defined |
| Naming Convention     | Defined |
| Dependency Rule       | Defined |

# 36. Layer Responsibility Overview

## 36.1 Purpose

Backend Layer Responsibilities 用于定义 Backend 各层职责边界。

目标：

```
Single Responsibility

↓

Clear Boundary

↓

Loose Coupling

↓

Easy Testing
```

------

## 36.2 Backend Layer Model

Backend 统一采用五层架构：

```
HTTP Request

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

------

# 37. Controller Layer

## Responsibilities

Controller 负责：

```
Receive Request

↓

Validate Request

↓

Call Service

↓

Return Response
```

------

Controller 可以：

- 接收 HTTP 请求
- 获取 Path Parameter
- 获取 Query Parameter
- 获取 Body
- 获取 JWT 用户信息
- 调用 Validator
- 调用 Service
- 返回 Response

------

Controller 禁止：

```
Business Logic

Database Query

Transaction

Business Calculation
```

------

原则：

每个 Controller 应尽量保持简短。

建议：

100 行以内。

------

# 38. Service Layer

Service 是 Backend 核心。

负责：

```
Business Rule

↓

Workflow

↓

Permission

↓

Transaction

↓

Repository Call
```

------

Service 可以：

- 调用多个 Repository
- 调用多个 Service
- 控制事务
- 权限判断
- 状态流转
- 数据聚合

------

Service 禁止：

```
HTTP Operation

NestJS Request Context

Request Parsing
```

------

# 39. Repository Layer

Repository：

负责：

```
CRUD

↓

Prisma

↓

Database
```

------

Repository 可以：

- findUnique
- findMany
- create
- update
- delete
- aggregate

------

Repository 禁止：

```
Business Rule

Permission

Workflow
```

------

# 40. Infrastructure Layer

Infrastructure：

负责：

```
Logger

Storage

Email

SMS

Cache

Queue

Scheduler
```

------

特点：

完全独立于业务模块。

------

# 41. Validator Layer

Validator：

负责：

```
Schema Validation
```

推荐：

Zod。

验证：

- Required
- Type
- Enum
- Range
- Format

------

Validator 不负责：

```
Business Validation
```

例如：

库存是否足够。

属于：

Service。

------

# 42. DTO Layer

DTO：

负责：

接口数据。

例如：

```
CreateProductDto

UpdateProductDto

QueryProductDto
```

DTO：

不能包含：

业务逻辑。

------

# 43. Entity Layer

Entity：

表示：

领域对象。

例如：

```
Product

Supplier

Requirement
```

Entity：

不直接等于：

Prisma Model。

------

# 44. Mapper Layer

负责：

对象转换。

例如：

```
DTO

↓

Entity

↓

Database Model

↓

Response DTO
```

统一：

所有转换。

------

# 45. Dependency Direction

Backend 依赖方向：

```
Controller

↓

Service

↓

Repository

↓

Prisma

↓

Database
```

允许：

Infrastructure

被任意层调用。

------

禁止：

```
Repository

↓

Controller
```

禁止：

```
Service

↓

Controller
```

禁止：

```
Database

↓

Business
```

------

# 46. Dependency Injection

所有依赖：

采用：

Dependency Injection。

例如：

```
Controller

↓

Inject Service

↓

Inject Repository
```

禁止：

```
new Repository()

new Service()
```

业务代码中直接创建对象。

------

# 47. SOLID Principles

Backend 应遵循：

```
S

Single Responsibility

O

Open Closed

L

Liskov Substitution

I

Interface Segregation

D

Dependency Inversion
```

------

# 48. Clean Architecture

VISNDT Backend：

遵循：

```
Interface

↓

Application

↓

Domain

↓

Infrastructure
```

其中：

Application：

对应：

Service。

Infrastructure：

对应：

Prisma、Logger、Storage 等。

------

# 49. Cross Module Communication

模块之间：

禁止：

直接访问 Repository。

例如：

```
Product Module

×

Supplier Repository
```

必须：

```
Product Service

↓

Supplier Service
```

------

# 50. Transaction Boundary

事务：

只能位于：

```
Service Layer
```

禁止：

```
Controller Transaction

Repository Transaction
```

------

# 51. Exception Handling Boundary

异常：

统一抛出：

```
Business Exception
```

最终：

由：

Global Error Middleware

统一处理。

------

# 52. Logging Boundary

日志：

统一：

Infrastructure Logger。

禁止：

```
console.log()
```

生产环境。

------

# 53. Layer Responsibility Checklist

## Controller

□ No Business Logic

□ No Database

□ Only HTTP

------

## Service

□ Business Logic

□ Permission

□ Transaction

------

## Repository

□ CRUD Only

□ No Workflow

------

## Infrastructure

□ Logger

□ Cache

□ Storage

□ Queue

------

# 54. Backend Layer Status

| Item                          | Status  |
| ----------------------------- | ------- |
| Controller Responsibility     | Defined |
| Service Responsibility        | Defined |
| Repository Responsibility     | Defined |
| Infrastructure Responsibility | Defined |
| Dependency Rule               | Defined |
| SOLID Principle               | Defined |
| Clean Architecture            | Defined |

# 55. Module Architecture Overview

## 55.1 Purpose

Backend Module Architecture 用于定义 VISNDT Backend 业务模块的设计规范。

目标：

```
Business Isolation

↓

Independent Development

↓

Reusable Capability

↓

Easy Expansion
```

------

## 55.2 Module Design Principle

Backend 采用：

Domain Module Architecture。

结构：

```
Business Domain

        ↓

Module

        ↓

Internal Layers

        ↓

External Interface
```

------

# 56. Module Definition

Module：

代表：

一个独立业务领域。

例如：

VISNDT Backend：

```
identity

organization

product

offer

demand

rfq

workflow

search

notification

file
```

------

# 57. Module Responsibility

每个 Module 必须：

拥有：

```
Own Business Logic

Own Service

Own Repository

Own DTO

Own Validation
```

------

禁止：

多个模块共享业务代码。

------

# 58. VISNDT Core Modules

VISNDT Blueprint v1.0 的 Backend Core Modules 统一为：

## 58.1 Identity Module

负责：

身份认证与账号上下文。

包括：

```
Account

Role

Permission

Authentication
```

------

## 58.2 Organization Module

负责：

组织主体、企业资料与业务身份。

包括：

```
Organization Profile

Certification

Contact

Organization Status
```

------

## 58.3 Product Module

负责：

平台标准产品主数据。

包括：

```
Standard Product

Category

Parameter Metadata

Capability

Media
```

必须明确：

`Standard Product` 为 Platform Managed。

------

## 58.4 Offer Module

负责：

Organization 对 Standard Product 的供应能力表达。

包括：

```
Offer

Commercial Terms

Availability

Offer Attachment
```

必须明确：

`Offer` 连接 `Organization` 与 `Standard Product`。  
禁止 `Supplier owns Product`。

------

## 58.5 Demand Module

负责：

采购侧需求生命周期。

包括：

```
Demand

Demand Parameter

Demand Status

Demand Submission
```

------

## 58.6 RFQ Module

负责：

Demand 转化后的询价流程。

包括：

```
RFQ

Response

Communication

RFQ Status
```

------

## 58.7 Workflow Module

负责：

Demand 与 RFQ 的基础流程状态管理。

包括：

```
Workflow State

Transition

Approval Node

Processing Step
```

------

## 58.8 Search Module

负责：

Product、Offer、Demand、RFQ 的检索与过滤能力。

包括：

```
Full Text Search

Parameter Filter

Category Search

Result Ranking
```

------

## 58.9 Notification Module

负责：

站内通知与邮件通知。

包括：

```
Internal Notification

Email Notification

Delivery Status

Notification Event
```

------

## 58.10 File Module

负责：

文件与附件引用管理。

包括：

```
Image

Attachment

Document Reference

Storage Metadata
```

------

## 58.11 MVP Boundary

Phase 1 激活模块：

```
Product

Organization

Offer

Demand

RFQ

Search

Notification

Workflow Basic
```

Phase 2 增强模块：

```
AI

Recommendation

Embedding
```

说明：

- Phase 1 先建立标准产品、组织供给、需求、RFQ 和通知闭环。
- Phase 2 再引入 AI、Recommendation、Embedding 等增强能力。

------

# 59. Module Internal Structure

标准模块：

```
product/

├── controller/

├── service/

├── repository/

├── dto/

├── validator/

├── entity/

├── mapper/

├── types/

├── constants/

└── index.ts
```

------

# 60. Module Entry Point

每个模块：

必须提供：

```
index.ts
```

作用：

统一暴露：

```
Controller

Service

Routes

Types
```

------

# 61. Module Registration

所有模块：

通过：

Module Registry 注册。

流程：

```
Module

↓

Register

↓

Load

↓

Application
```

------

# 62. Module Dependency Rule

模块依赖：

必须明确。

例如：

```
Matching

↓

Requirement

↓

Product

↓

Parameter
```

------

禁止：

隐式依赖。

------

# 63. Cross Module Communication

模块之间：

推荐：

Service Interface。

例如：

```
Matching Service

↓

Product Service
```

------

禁止：

直接：

```
Matching Repository

↓

Product Repository
```

------

# 64. Module Interface

模块暴露：

```
Public Service

Public Types

Public Events
```

------

隐藏：

```
Internal Repository

Internal Entity

Internal Logic
```

------

# 65. Module Lifecycle

模块生命周期：

```
Create

↓

Register

↓

Initialize

↓

Running

↓

Update

↓

Disable
```

------

# 66. Module Configuration

模块配置：

独立管理。

例如：

```
product.config.ts

matching.config.ts

auth.config.ts
```

------

禁止：

散落环境变量。

------

# 67. Module Event Communication

复杂场景：

支持：

Event Driven。

例如：

```
Requirement Created

↓

Matching Event

↓

Organization Notification
```

------

Event：

必须：

定义：

```
Event Name

Payload

Version
```

------

# 68. Module Testing Boundary

每个模块：

必须包含：

```
Unit Test

Service Test

Repository Test

API Test
```

------

测试：

独立运行。

------

# 69. Module Version Management

模块变化：

需要：

记录版本。

例如：

```
Product Module

v1.0

v1.1

v2.0
```

------

# 70. Module Security Rules

模块必须：

遵守：

```
Permission Check

Input Validation

Audit Logging

Data Protection
```

------

# 71. Module Architecture Checklist

## Structure

□ Module Exists

□ Entry Point Exists

□ Internal Layers Complete

------

## Dependency

□ Dependency Defined

□ No Circular Dependency

□ Interface Used

------

## Security

□ Permission Checked

□ Audit Supported

□ Validation Applied

------

# 72. Module Architecture Status

| Item                | Status  |
| ------------------- | ------- |
| Module Definition   | Defined |
| Core Modules        | Defined |
| Internal Structure  | Defined |
| Registration        | Defined |
| Dependency Rules    | Defined |
| Communication Rules | Defined |
| Security Rules      | Defined |

# 73. Configuration Management Overview

## 73.1 Purpose

Backend Configuration & Environment Management Specification 用于定义 VISNDT Backend 的配置管理体系。

目标：

```
Configuration Separation

↓

Environment Isolation

↓

Secure Secret Management

↓

Consistent Deployment

↓

Easy Maintenance
```

------

## 73.2 Design Principles

Backend 配置遵循：

```
Configuration As Code

↓

Environment Driven

↓

Immutable Configuration

↓

No Hard Coding
```

------

# 74. Environment Classification

VISNDT Backend 定义以下环境：

| Environment | Description  |
| ----------- | ------------ |
| Local       | 本地开发环境 |
| Development | 开发环境     |
| Testing     | 测试环境     |
| Staging     | 预发布环境   |
| Production  | 生产环境     |

------

所有环境：

必须：

独立配置。

------

# 75. Configuration Categories

Backend 配置包括：

```
Application

Database

Authentication

Storage

Email

Cache

Queue

Logging

Security

Monitoring
```

------

# 76. Configuration Directory

统一目录：

```
src/config/

app.config.ts

database.config.ts

auth.config.ts

storage.config.ts

cache.config.ts

logger.config.ts

security.config.ts

email.config.ts

monitor.config.ts
```

------

每类配置：

单独维护。

------

# 77. Environment Variables

配置来源：

```
.env

↓

Environment Variables

↓

Config Loader

↓

Application
```

------

禁止：

```
const DATABASE_URL = "...";
```

任何硬编码。

------

# 78. Required Environment Variables

建议：

| Variable         | Required |
| ---------------- | -------- |
| DATABASE_URL     | Yes      |
| JWT_SECRET       | Yes      |
| JWT_EXPIRES      | Yes      |
| APP_ENV          | Yes      |
| APP_PORT         | Yes      |
| STORAGE_PROVIDER | Yes      |
| LOG_LEVEL        | Yes      |

------

# 79. Secret Management

敏感配置包括：

```
JWT Secret

Database Password

SMTP Password

API Key

Cloud Secret

Storage Secret
```

------

要求：

不得进入：

Git Repository。

------

# 80. Secret Loading Strategy

加载流程：

```
Environment

↓

Secret Manager

↓

Config Loader

↓

Runtime
```

------

生产环境：

推荐：

统一 Secret Manager。

------

# 81. Configuration Loader

统一：

Config Loader。

流程：

```
Read Environment

↓

Validate

↓

Transform

↓

Export Config
```

------

禁止：

业务代码：

直接读取：

```
process.env
```

------

# 82. Configuration Validation

所有配置：

启动时：

必须验证。

包括：

```
Required

Type

Enum

Format

Range
```

------

推荐：

Zod。

------

# 83. Application Configuration

包括：

```
Application Name

Version

Host

Port

Timezone

Language
```

------

# 84. Database Configuration

包括：

```
Database URL

Pool Size

Timeout

SSL

Migration
```

------

数据库配置：

集中管理。

------

# 85. Authentication Configuration

包括：

```
JWT Secret

JWT Expiration

Refresh Token

Cookie Policy

Password Policy
```

------

# 86. Storage Configuration

包括：

```
Storage Provider

Bucket

Region

Upload Limit

File Size
```

支持：

```
S3 Compatible Storage

Cloudflare R2（实现选项）
```

------

# 87. Cache Configuration

包括：

```
Redis

TTL

Key Prefix

Cache Strategy
```

缓存：

允许关闭。

------

# 88. Logging Configuration

包括：

```
Log Level

Output

Rotation

Retention
```

推荐：

```
Error

Warn

Info

Debug
```

------

# 89. Security Configuration

包括：

```
Rate Limit

CORS

Helmet

TLS

Allowed Origin
```

生产环境：

默认开启。

------

# 90. Feature Toggle

Backend 支持：

Feature Flag。

例如：

```
Enable Matching

Enable AI

Enable Notification

Enable Queue
```

------

便于：

灰度发布。

------

# 91. Configuration Versioning

配置：

需要版本管理。

例如：

```
v1.0

v1.1

v2.0
```

修改：

需要记录。

------

# 92. Configuration Checklist

## Environment

□ Local

□ Development

□ Testing

□ Staging

□ Production

------

## Security

□ Secret Managed

□ Validation Enabled

□ No Hard Coding

------

## Runtime

□ Config Loaded

□ Startup Validated

□ Environment Isolated

------

# 93. Configuration Status

| Item                     | Status  |
| ------------------------ | ------- |
| Environment Definition   | Defined |
| Configuration Categories | Defined |
| Secret Management        | Defined |
| Validation               | Defined |
| Runtime Loading          | Defined |
| Feature Toggle           | Defined |

# 94. Dependency Injection Overview

## 94.1 Purpose

Backend Dependency Injection（DI）用于统一 Backend 中对象创建、生命周期管理及依赖关系。

目标：

```
Loose Coupling

↓

Easy Testing

↓

Centralized Object Management

↓

High Maintainability
```

------

## 94.2 Design Principles

Backend 遵循：

```
Dependency Inversion

↓

Interface First

↓

Constructor Injection

↓

Lifecycle Managed
```

------

# 95. IoC (Inversion of Control)

Backend 控制对象创建。

对象：

不自行创建依赖。

流程：

```
Application

↓

DI Container

↓

Create Object

↓

Inject Dependency

↓

Run Service
```

------

# 96. Constructor Injection

统一采用：

Constructor Injection。

例如：

```
ProductController

↓

ProductService

↓

ProductRepository
```

------

禁止：

```
new ProductRepository()

new ProductService()
```

业务代码直接实例化。

------

# 97. Dependency Registration

所有依赖：

统一注册。

例如：

```
Repository

Service

Infrastructure

Configuration

Logger
```

------

集中管理：

避免重复实例。

------

# 98. Service Lifecycle

Backend 默认：

```
Singleton
```

特点：

- 全局唯一实例
- 生命周期贯穿整个应用
- 无状态设计

------

# 99. Repository Lifecycle

Repository：

默认：

```
Singleton
```

依赖：

Prisma Client。

不得：

频繁创建实例。

------

# 100. Infrastructure Lifecycle

基础设施组件：

统一：

Singleton。

包括：

```
Logger

Storage

Cache

Queue

Mailer

Scheduler
```

------

# 101. Scoped Object

特殊场景：

支持：

```
Scoped
```

例如：

```
Request Context

Current User

Transaction Context
```

生命周期：

一次请求。

------

# 102. Transient Object

仅用于：

临时对象。

例如：

```
DTO Builder

Temporary Converter

Parser
```

特点：

每次重新创建。

------

# 103. Application Bootstrap

Backend 启动流程：

```
Load Environment

↓

Load Configuration

↓

Initialize Logger

↓

Initialize Database

↓

Register Modules

↓

Register Routes

↓

Start HTTP Server
```

------

# 104. Module Initialization

模块初始化：

顺序：

```
Configuration

↓

Infrastructure

↓

Repository

↓

Service

↓

Controller

↓

Route
```

不得：

跳过依赖初始化。

------

# 105. Runtime Lifecycle

应用运行：

生命周期：

```
Bootstrap

↓

Ready

↓

Running

↓

Maintenance

↓

Shutdown
```

------

# 106. Graceful Shutdown

应用关闭：

执行：

```
Stop Receiving Request

↓

Finish Active Request

↓

Close Database

↓

Flush Logger

↓

Release Resources

↓

Exit
```

------

禁止：

强制中断：

正在执行事务。

------

# 107. Health Check

Backend 提供：

健康检查接口。

建议：

```
GET /health
```

返回：

```
Application Status

Database Status

Storage Status

Cache Status

Version
```

------

# 108. Startup Validation

启动时：

验证：

```
Environment

Configuration

Database Connection

Migration Version

Storage Access
```

任何关键检查失败：

禁止启动。

------

# 109. Resource Management

统一管理：

```
Database Connection

Cache Connection

Storage Client

HTTP Client

Queue Client
```

避免：

资源泄漏。

------

# 110. Dependency Rules

允许：

```
Service

↓

Repository

↓

Infrastructure
```

禁止：

```
Infrastructure

↓

Service
```

禁止：

基础设施反向依赖业务。

------

# 111. Testing Support

DI 容器：

支持：

```
Mock Service

Mock Repository

Mock Logger

Mock Storage
```

方便：

单元测试。

------

# 112. Lifecycle Checklist

## Startup

□ Environment Loaded

□ Config Validated

□ Modules Registered

□ Routes Registered

------

## Runtime

□ Singleton Managed

□ Resources Managed

□ Health Check Enabled

------

## Shutdown

□ Graceful Shutdown

□ Connection Closed

□ Logger Flushed

------

# 113. Dependency Injection Status

| Item                  | Status  |
| --------------------- | ------- |
| IoC                   | Defined |
| Constructor Injection | Defined |
| Singleton Lifecycle   | Defined |
| Scoped Lifecycle      | Defined |
| Bootstrap Process     | Defined |
| Shutdown Strategy     | Defined |
| Health Check          | Defined |

# 114. Scalability Overview

## 114.1 Purpose

Backend Scalability & Extension Architecture Specification 用于定义 VISNDT Backend 的可扩展架构规范。

目标：

```
Scalable

↓

Extensible

↓

Replaceable

↓

Maintainable

↓

Future Ready
```

------

## 114.2 Design Principles

Backend 扩展架构遵循：

```
Module First

↓

Interface Driven

↓

Event Driven

↓

Configuration Driven
```

------

# 115. Scalability Layers

Backend 扩展能力包括：

```
Business Module

↓

Infrastructure

↓

Third-party Integration

↓

Event System

↓

Future Microservice
```

------

# 116. Module Expansion

新增业务：

必须：

新增 Module。

例如：

```
inspection/

quotation/

order/

notification/

ai/

report/
```

不得：

直接修改已有模块职责。

------

# 117. Plug-in Architecture

Backend 支持：

Plugin Architecture。

插件结构：

```
Plugin

↓

Registration

↓

Initialization

↓

Execution
```

插件：

独立启用。

------

# 118. Feature Module

大型功能：

采用：

Feature Module。

例如：

```
AI Recommendation

Supplier Portal

Workflow Engine

Statistics Center
```

每个 Feature：

拥有独立生命周期。

------

# 119. Event Driven Architecture

Backend 支持：

Domain Event。

事件流程：

```
Business Action

↓

Event

↓

Subscriber

↓

Async Processing
```

------

# 120. Standard Domain Events

建议统一事件命名：

```
RequirementCreated

RequirementUpdated

ProductPublished

SupplierApproved

UserRegistered

FileUploaded
```

事件名称：

统一使用：

PascalCase。

------

# 121. Event Payload Specification

事件必须定义：

```
Event ID

Event Name

Version

Timestamp

Source Module

Payload
```

禁止：

Payload 包含敏感凭据。

------

# 122. Event Bus

统一：

Event Bus。

流程：

```
Publish

↓

Dispatch

↓

Subscriber

↓

Handler
```

支持：

同步、异步事件。

------

# 123. External Integration

Backend 支持：

第三方能力。

包括：

```
SMTP

SMS

Cloud Storage

AI API

Payment

Map Service
```

统一：

Adapter。

------

# 124. Adapter Pattern

所有第三方：

统一：

```
Interface

↓

Adapter

↓

Vendor SDK
```

禁止：

业务代码：

直接调用 SDK。

------

# 125. Storage Provider Extension

支持：

多个 Storage Provider。

例如：

```
S3 Compatible Storage

Amazon S3

Cloudflare R2

MinIO
```

统一：

Storage Interface。

------

# 126. AI Capability Reservation

Backend 预留：

AI Module。

包括：

```
AI Search

AI Matching

AI Recommendation

AI Report

AI Chat
```

AI：

独立模块。

不得：

侵入业务层。

------

# 127. Notification Extension

通知：

统一：

Notification Service。

支持：

```
Email

SMS

Webhook

Push

Internal Message
```

统一：

接口。

------

# 128. Queue Expansion

异步任务：

统一：

Queue。

例如：

```
Email

Image Processing

Matching

Statistics

Export
```

同步代码：

不得：

处理长耗时任务。

------

# 129. Future Microservice Compatibility

当前：

采用：

Modular Monolith。

未来：

支持：

```
Service Split

Independent Deployment

API Gateway

Event Bus
```

无需：

重写业务代码。

------

# 130. Public Interface Rule

模块：

只暴露：

```
Service Interface

DTO

Events
```

隐藏：

Repository。

------

# 131. Extension Versioning

扩展接口：

必须：

版本化。

例如：

```
v1

v2

v3
```

禁止：

破坏性升级。

------

# 132. Compatibility Policy

新版本：

必须：

保持：

```
Backward Compatible
```

重大变更：

采用：

Major Version。

------

# 133. Scalability Checklist

## Module

□ Independent

□ Registerable

□ Configurable

------

## Extension

□ Interface Defined

□ Adapter Used

□ SDK Isolated

------

## Future

□ Event Ready

□ Queue Ready

□ Microservice Ready

------

# 134. Scalability Status

| Item                       | Status  |
| -------------------------- | ------- |
| Module Expansion           | Defined |
| Plug-in Architecture       | Defined |
| Event Architecture         | Defined |
| Adapter Pattern            | Defined |
| AI Extension               | Defined |
| Queue Strategy             | Defined |
| Microservice Compatibility | Defined |

# 135. Backend Architecture Verification Overview

## 135.1 Purpose

Backend Architecture Final Checklist 用于完成 Backend Architecture 的最终验收。

目标：

```
Architecture Approved

↓

Production Ready

↓

Repository Consistent

↓

Documentation Complete
```

------

## 135.2 Verification Scope

最终检查覆盖：

```
Architecture

Layer Design

Module Design

Dependency

Configuration

Lifecycle

Scalability

Documentation
```

------

# 136. Layer Verification

检查内容：

| Item                       | Status |
| -------------------------- | ------ |
| Layer Architecture Defined | □      |
| Responsibility Defined     | □      |
| Dependency Rule Defined    | □      |
| Layer Boundary Clear       | □      |

------

# 137. Module Verification

检查：

```
Module Isolation

Module Registration

Module Dependency

Module Interface

Module Security
```

验收：

□ Completed

------

# 138. Configuration Verification

检查：

```
Environment

Configuration Loader

Secret Management

Configuration Validation

Feature Toggle
```

验收：

□ Completed

------

# 139. Dependency Injection Verification

检查：

```
IoC

Constructor Injection

Lifecycle

Resource Management

Health Check
```

验收：

□ Completed

------

# 140. Scalability Verification

检查：

```
Plugin Architecture

Adapter Pattern

Event Bus

Future Microservice

AI Extension
```

验收：

□ Completed

------

# 141. Repository Dependency Matrix

Backend Repository 依赖关系：

| Document | Depends On    |
| -------- | ------------- |
| 501      | 400           |
| 502      | 501           |
| 503      | 501、502      |
| 504      | 501、502、503 |
| 505      | 501、502、504 |
| 506      | 501、502、505 |
| 507      | 501~506       |
| 508      | 501~507       |

------

# 142. Backend Architecture Principles Review

Backend 最终确认遵循：

```
Single Responsibility

Open Closed

Dependency Inversion

Module Isolation

Configuration Driven

Event Driven
```

------

# 143. Production Readiness

Backend 发布前必须确认：

```
Application Bootstrap Verified

↓

Configuration Validated

↓

Database Connected

↓

Migration Completed

↓

Health Check Passed

↓

Security Enabled
```

全部通过后：

允许部署。

------

# 144. Backend Quality Attributes

Backend 应满足：

| Attribute       | Status  |
| --------------- | ------- |
| Maintainability | Defined |
| Scalability     | Defined |
| Security        | Defined |
| Performance     | Defined |
| Testability     | Defined |
| Observability   | Defined |

------

# 145. Documentation Consistency

Backend 文档要求：

```
Naming Consistent

Version Consistent

Reference Consistent

Structure Consistent
```

修改任意 Backend 文档：

必须同步检查：

```
501

502

503

504

505

506

507

508
```

------

# 146. Version Management

Backend Repository：

采用：

```
Semantic Versioning
```

版本格式：

```
Major.Minor.Patch
```

例如：

```
1.0.0

1.1.0

2.0.0
```

------

# 147. Architecture Freeze Rule

501 文档冻结后：

允许：

```
Bug Fix

Documentation Improvement

New Appendix
```

禁止：

```
Breaking Architecture Change
```

若必须修改：

需要：

- Architecture Review
- Version Upgrade
- Repository Synchronization

------

# 148. Backend Architecture Acceptance Checklist

## Architecture

□ Layered Architecture Complete

□ Module Architecture Complete

□ Dependency Rules Complete

------

## Runtime

□ Configuration Complete

□ Lifecycle Complete

□ Resource Management Complete

------

## Future

□ Event Ready

□ Plugin Ready

□ Microservice Ready

------

## Repository

□ Documentation Complete

□ Dependency Matrix Complete

□ Version Defined

------

# 149. Backend Architecture Completion Status

| Item                     | Status    |
| ------------------------ | --------- |
| Architecture Overview    | Completed |
| Directory Architecture   | Completed |
| Layer Responsibilities   | Completed |
| Module Architecture      | Completed |
| Configuration Management | Completed |
| Dependency Injection     | Completed |
| Scalability              | Completed |
| Final Verification       | Completed |

------

# 150. Document Completion

Document：

```
501_Backend_Architecture.md
```

Version：

```
V1.0
```

Status：

```
FINAL
```

Repository Status：

```
Backend Architecture Completed
```

------

# 501 BLOCK 08/N 完成
