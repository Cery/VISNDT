# 1. Document Purpose

本文档定义 VISNDT Backend 的统一认证(Authentication)与授权(Authorization)规范。

所有 Backend 服务必须遵循本规范。

------

# 2. Objectives

安全体系目标：

```
Identity

↓

Authentication

↓

Authorization

↓

Audit

↓

Security Governance
```

------

# 3. Repository Position

位于：

```
500_Backend
```

依赖：

```
501_Backend_Architecture

↓

502_API_Design_Specification

↓

503_OpenAPI_Specification
```

输出：

```
505_Backend_Business_Service

↓

507_Backend_Testing

↓

508_Backend_Deployment
```

------

# 4. Security Principles

Backend：

统一遵循：

```
Zero Trust

↓

Least Privilege

↓

Defense In Depth

↓

Secure By Default
```

------

# 5. Authentication Scope

Authentication：

负责：

```
Who Are You
```

包括：

```
User Login

Token Validation

Identity Verification

Session Lifecycle
```

------

# 6. Authorization Scope

Authorization：

负责：

```
What Can You Do
```

包括：

```
Permission Check

Role Assignment

Resource Access

Operation Control
```

------

# 7. Security Architecture

整体模型：

```
Client

↓

Identity

↓

Authentication

↓

Authorization

↓

Business Service

↓

Audit Log
```

------

# 8. Identity Types

VISNDT：

统一支持：

```
Platform User

Supplier User

Administrator

System Account

API Client
```

后续：

可扩展：

```
Third-party Application

OAuth Account
```

------

# 9. Security Boundaries

所有请求：

必须经过：

```
Authentication

↓

Authorization

↓

Business Logic
```

禁止：

绕过：

认证。

------

# 10. Document Status

| Item                 | Status  |
| -------------------- | ------- |
| Objectives           | Defined |
| Repository Position  | Defined |
| Security Principles  | Defined |
| Authentication Scope | Defined |
| Authorization Scope  | Defined |
| Identity Model       | Defined |
| Architecture         | Defined |

# 11. Identity Overview

## 11.1 Purpose

Identity Model 用于定义 VISNDT Backend 的统一身份模型。

目标：

```
Unique Identity

↓

Unified Account

↓

Permission Mapping

↓

Security Foundation
```

------

## 11.2 Design Principles

所有身份：

统一遵循：

```
Identity

↓

Account

↓

Credential

↓

Permission
```

身份信息：

不得：

直接绑定业务数据。

------

# 12. Identity Domain

Identity：

表示：

```
Who You Are
```

统一包含：

```
Identity ID

Account

Credential

Profile

Status
```

------

# 13. Identity Object

统一结构：

```
Identity

├── identityId

├── accountId

├── userId

├── status

└── tenantId
```

Identity：

作为：

安全主键。

------

# 14. User Types

VISNDT：

统一支持：

```
Platform User

Supplier User

Administrator

System Account

API Client
```

所有类型：

继承：

统一身份模型。

------

# 15. Account Object

Account：

负责：

登录身份。

统一：

```
Account

├── accountId

├── username

├── email

├── phone

├── loginMethod
```

Account：

不保存：

业务权限。

------

# 16. User Profile

User：

负责：

业务资料。

包括：

```
Nickname

Avatar

Department

Organization

Language

Timezone
```

User：

可独立扩展。

------

# 17. Credential Model

Credential：

负责：

认证凭据。

统一：

```
Password

JWT

Refresh Token

API Key

OAuth Credential
```

Credential：

不得：

混入：

业务数据。

------

# 18. Identity Lifecycle

生命周期：

```
Created

↓

Activated

↓

Suspended

↓

Disabled

↓

Archived
```

任何身份：

必须：

处于唯一状态。

------

# 19. Account Status

统一：

```
Pending

Active

Locked

Disabled

Deleted
```

状态：

必须：

可审计。

------

# 20. User Identifier

统一：

采用：

```
UUID
```

例如：

```
userId

accountId

identityId
```

禁止：

使用：

用户名：

作为主键。

------

# 21. Tenant Preparation

当前版本：

```
Single Tenant
```

数据模型：

预留：

```
tenantId
```

未来：

支持：

Multi-Tenant。

------

# 22. Identity Relationship

统一关系：

```
Identity

↓

Account

↓

User

↓

Role

↓

Permission
```

所有权限：

最终：

绑定：

Identity。

------

# 23. Identity Constraints

必须：

保证：

```
Identity Unique

↓

Account Unique

↓

Email Optional Unique

↓

Phone Optional Unique
```

禁止：

重复身份。

------

# 24. Identity Audit

所有身份：

记录：

```
CreatedBy

CreatedAt

UpdatedBy

UpdatedAt

LastLoginAt
```

支持：

完整审计。

------

# 25. Identity Best Practices

建议：

```
Identity Independent

↓

Credential Independent

↓

Permission Independent

↓

Business Independent
```

四层：

完全解耦。

------

# 26. Identity Checklist

## Identity

□ Identity ID

□ Account

□ User

------

## Lifecycle

□ Status

□ Audit

□ UUID

------

## Extension

□ Tenant Ready

□ API Client Ready

□ OAuth Ready

------

# 27. Identity Status

| Item               | Status  |
| ------------------ | ------- |
| Identity Model     | Defined |
| Account Model      | Defined |
| User Profile       | Defined |
| Credential Model   | Defined |
| Lifecycle          | Defined |
| Account Status     | Defined |
| Tenant Preparation | Defined |
| Audit Fields       | Defined |

# 28. Authentication Overview

## 28.1 Purpose

Authentication Flow 用于规范用户身份认证全过程及登录生命周期管理。

目标：

```
Secure Login

↓

Reliable Identity Verification

↓

Short-lived Access

↓

Controlled Session
```

------

## 28.2 Design Principles

所有认证：

统一遵循：

```
Authenticate

↓

Issue Token

↓

Access Resource

↓

Refresh

↓

Logout
```

------

# 29. Login Flow

标准登录流程：

```
Login Request

↓

Credential Validation

↓

Identity Verification

↓

Issue Access Token

↓

Issue Refresh Token

↓

Login Success
```

------

# 30. Authentication Pipeline

所有请求：

统一流程：

```
Receive Request

↓

Extract Token

↓

Validate Signature

↓

Validate Expiration

↓

Load Identity

↓

Permission Check

↓

Business Logic
```

认证失败：

立即返回：

401。

------

# 31. Login Methods

当前版本：

支持：

```
Username + Password

Email + Password

Phone + Password
```

未来：

预留：

```
OAuth2

SSO

Passkey

MFA
```

------

# 32. Password Authentication

密码认证：

流程：

```
Receive Password

↓

Hash Compare

↓

Verify Identity

↓

Issue Token
```

服务器：

禁止：

保存明文密码。

------

# 33. Password Hash

统一采用：

```
Argon2id
```

兼容：

```
bcrypt
```

禁止：

```
MD5

SHA1

SHA256（直接存储）
```

作为密码存储算法。

------

# 34. Access Token

Access Token：

统一：

JWT。

特点：

```
Short-lived

Stateless

Signed

Self-contained
```

默认：

有效期：

15 分钟。

------

# 35. Refresh Token

Refresh Token：

用于：

```
Renew Access Token
```

建议：

有效期：

```
7 Days
```

支持：

Rotation。

------

# 36. Refresh Flow

流程：

```
Refresh Request

↓

Validate Refresh Token

↓

Issue New Access Token

↓

Issue New Refresh Token

↓

Invalidate Old Refresh Token
```

------

# 37. Session Lifecycle

统一：

生命周期：

```
Login

↓

Authenticated

↓

Refresh

↓

Logout

↓

Expired
```

所有状态：

必须：

可追踪。

------

# 38. Logout Flow

退出：

统一：

```
Receive Logout

↓

Invalidate Refresh Token

↓

Record Audit

↓

Logout Success
```

Access Token：

自然过期。

------

# 39. Token Expiration

建议：

```
Access Token

15 Minutes

Refresh Token

7 Days
```

高权限账号：

可缩短：

有效期。

------

# 40. Token Revocation

支持：

主动撤销：

```
Refresh Token

API Key

Service Credential
```

JWT：

无需实时存储。

------

# 41. Concurrent Login

默认：

允许：

```
Multiple Devices
```

后台：

可配置：

```
Single Session
```

模式。

------

# 42. Authentication State Machine

统一状态：

```
Unauthenticated

↓

Authenticating

↓

Authenticated

↓

Refreshing

↓

Expired

↓

Logged Out
```

------

# 43. Authentication Audit

记录：

```
Login Time

Logout Time

IP

Device

User Agent

Failure Reason
```

用于：

安全审计。

------

# 44. Authentication Checklist

## Login

□ Credential

□ Identity

□ Token

------

## Session

□ Refresh

□ Logout

□ Expiration

------

## Audit

□ Login Record

□ Logout Record

□ Failure Log

------

# 45. Authentication Status

| Item                    | Status  |
| ----------------------- | ------- |
| Login Flow              | Defined |
| Authentication Pipeline | Defined |
| Password Authentication | Defined |
| JWT                     | Defined |
| Refresh Token           | Defined |
| Session Lifecycle       | Defined |
| Logout Flow             | Defined |
| Authentication Audit    | Defined |

# 46. JWT Overview

## 46.1 Purpose

JWT（JSON Web Token）用于在客户端与服务端之间安全传递身份声明（Claims）。

目标：

```
Stateless

↓

Secure

↓

Compact

↓

Verifiable
```

------

## 46.2 Design Principles

JWT：

统一遵循：

```
Signed

↓

Immutable

↓

Short-lived

↓

Self-contained
```

JWT：

不得：

保存业务状态。

------

# 47. JWT Structure

标准结构：

```
Header

↓

Payload

↓

Signature
```

表示：

```
xxxxx.yyyyy.zzzzz
```

------

# 48. JWT Header

统一：

```
{
  "alg": "RS256",
  "typ": "JWT"
}
```

默认：

采用：

```
RS256
```

禁止：

```
alg = none
```

------

# 49. JWT Payload

Payload：

保存：

Claims。

统一包括：

```
sub

iss

aud

iat

nbf

exp

jti
```

以及：

自定义 Claims。

------

# 50. Standard Claims

统一支持：

```
iss

sub

aud

exp

iat

nbf

jti
```

符合：

RFC 7519。

------

# 51. Custom Claims

VISNDT：

统一增加：

```
identityId

accountId

tenantId

roles

permissions
```

禁止：

加入：

业务对象。

例如：

```
Order

Product

Requirement
```

------

# 52. Signature Algorithm

默认：

```
RS256
```

兼容：

```
ES256
```

禁止：

```
HS256（跨服务共享密钥场景）
```

作为默认算法。

------

# 53. Access Token Claims

统一：

包含：

```
sub

identityId

roles

permissions

exp
```

建议：

控制：

Payload：

不超过：

```
4 KB
```

------

# 54. Refresh Token

Refresh Token：

建议：

随机字符串。

不得：

使用：

JWT。

统一：

存储：

哈希值。

------

# 55. Token Rotation

统一：

采用：

Rotation。

流程：

```
Old Refresh Token

↓

Validate

↓

Generate New Refresh Token

↓

Invalidate Old Token
```

------

# 56. Token Validation

统一检查：

```
Signature

↓

Expiration

↓

Not Before

↓

Issuer

↓

Audience

↓

Revocation
```

全部通过：

方可认证成功。

------

# 57. Expiration Strategy

建议：

```
Access Token

15 Minutes

Refresh Token

7 Days
```

支持：

后台：

配置。

------

# 58. Token Revocation

支持：

撤销：

```
Refresh Token

↓

API Key

↓

System Credential
```

Access Token：

自然失效。

------

# 59. Key Management

签名密钥：

统一：

```
Private Key

↓

Public Key
```

支持：

定期轮换。

不得：

硬编码。

------

# 60. Key Rotation

支持：

```
Old Key

↓

New Key

↓

Grace Period

↓

Old Key Retired
```

保证：

不停机升级。

------

# 61. Clock Skew

统一：

允许：

```
±60 Seconds
```

避免：

服务器时间微小偏差导致认证失败。

------

# 62. Token Blacklist

默认：

仅针对：

```
Refresh Token
```

如需：

紧急注销：

可启用：

Access Token Blacklist。

------

# 63. JWT Security Best Practices

建议：

```
HTTPS Only

↓

Short Expiration

↓

Key Rotation

↓

Minimal Claims

↓

Rotation Refresh Token
```

------

# 64. JWT Checklist

## Claims

□ Standard Claims

□ Custom Claims

□ No Business Data

------

## Security

□ RS256

□ Rotation

□ Validation

------

## Lifecycle

□ Expiration

□ Revocation

□ Audit

------

# 65. JWT Status

| Item              | Status  |
| ----------------- | ------- |
| JWT Structure     | Defined |
| Header            | Defined |
| Payload           | Defined |
| Standard Claims   | Defined |
| Custom Claims     | Defined |
| Rotation Strategy | Defined |
| Key Management    | Defined |
| Validation Rules  | Defined |

# 66. Authorization Overview

## 66.1 Purpose

Authorization 用于规范 VISNDT Backend 的统一权限模型及访问控制体系。

目标：

```
Least Privilege

↓

Role Driven

↓

Fine-grained Control

↓

Auditable
```

------

## 66.2 Design Principles

统一采用：

```
Identity

↓

Role

↓

Permission

↓

Resource

↓

Action
```

权限：

不得：

直接绑定：

业务代码。

------

# 67. RBAC Model

VISNDT：

采用：

RBAC。

模型：

```
Identity

↓

Role

↓

Permission
```

Identity：

可拥有：

多个 Role。

Role：

可包含：

多个 Permission。

------

# 68. Identity–Role Relationship

关系：

```
Identity

1

↓

N

Role
```

支持：

多角色：

同时生效。

------

# 69. Role–Permission Relationship

关系：

```
Role

1

↓

N

Permission
```

权限：

统一：

由 Role 授予。

------

# 70. Permission Object

统一结构：

```
Permission

├── permissionId

├── code

├── name

├── resource

├── action
```

------

# 71. Resource Model

Resource：

表示：

受保护对象。

例如：

```
Product

Supplier

Requirement

User

Order

System
```

------

# 72. Action Model

Action：

统一采用：

CRUD。

包括：

```
Read

Create

Update

Delete
```

扩展：

```
Publish

Approve

Export

Import
```

------

# 73. Permission Code

统一格式：

```
<Resource>.<Action>
```

例如：

```
Product.Read

Product.Update

Organization.Create

Demand.Delete

RFQ.Read

System.Export
```

------

# 74. Permission Group

权限：

按模块：

组织：

```
Product

Organization

Offer

Demand

RFQ

Notification

User

System
```

每组：

独立维护。

------

# 75. Role Hierarchy

支持：

角色继承。

例如：

```
Administrator

↓

Manager

↓

Operator

↓

Viewer
```

高层角色：

自动继承：

低层权限。

------

# 76. Scope Permission

权限：

支持：

作用域：

```
Global

Organization

Department

Self
```

便于：

后续扩展：

多组织访问控制。

------

# 77. Permission Resolution

统一解析：

```
Identity

↓

All Roles

↓

Merge Permissions

↓

Remove Duplicates

↓

Final Permission Set
```

------

# 78. Authorization Pipeline

授权流程：

```
Identity

↓

Load Roles

↓

Load Permissions

↓

Match Resource

↓

Match Action

↓

Authorize
```

失败：

返回：

403。

------

# 79. Default Roles

建议：

预置：

```
Super Administrator

Administrator

Supplier

Operator

Viewer
```

可：

继续扩展。

------

# 80. Permission Constraints

禁止：

```
Wildcard Permission

Anonymous Admin

Hard-coded Permission
```

所有权限：

必须：

可配置。

------

# 81. ABAC Preparation

当前版本：

采用：

RBAC。

预留：

```
Department

Project

Region

Owner
```

等属性：

用于：

ABAC。

------

# 82. Authorization Audit

所有授权：

记录：

```
Identity

Role

Permission

Resource

Decision

Timestamp
```

支持：

安全审计。

------

# 83. RBAC Best Practices

建议：

```
Least Privilege

↓

Role Reuse

↓

Permission Reuse

↓

No Business Logic
```

------

# 84. RBAC Checklist

## Model

□ Identity

□ Role

□ Permission

------

## Permission

□ Resource

□ Action

□ Scope

------

## Governance

□ Audit

□ Role Hierarchy

□ ABAC Ready

------

# 85. RBAC Status

| Item                | Status  |
| ------------------- | ------- |
| RBAC Model          | Defined |
| Role Model          | Defined |
| Permission Model    | Defined |
| Resource Model      | Defined |
| Action Model        | Defined |
| Scope Permission    | Defined |
| Role Hierarchy      | Defined |
| Authorization Audit | Defined |

# 86. Purpose

本章节定义 VISNDT 平台后台统一的权限判定流程。

所有业务接口在进入 Business Service 前，必须完成权限校验。

------

# 87. Authorization Pipeline

统一流程：

```
HTTP Request

↓

Authentication

↓

Load Identity

↓

Load Roles

↓

Load Permissions

↓

Business Authorization

↓

Execute Service
```

未通过授权：

返回：

```
HTTP 403 Forbidden
```

------

# 88. Permission Evaluation Order

统一按照以下顺序进行：

```
Identity

↓

Role

↓

Permission

↓

Resource

↓

Action
```

只有全部满足，才允许访问。

------

# 89. Resource Mapping

VISNDT 平台资源统一定义如下：

| Resource    | 对应模块   |
| ----------- | ---------- |
| Product     | 产品中心   |
| Supplier    | 供应商中心 |
| Requirement | 采购需求   |
| News        | 新闻资讯   |
| Category    | 分类管理   |
| User        | 用户管理   |
| File        | 文件资源   |
| System      | 系统配置   |

------

# 90. Action Definition

统一动作：

```
View

Create

Update

Delete

Publish

Approve

Export
```

业务模块可增加专有动作，但必须登记到权限表。

------

# 91. Authorization Rule

统一采用：

```
Identity

+

Role

+

Permission

↓

Allow
```

任何条件缺失：

默认拒绝。

------

# 92. Default Strategy

采用：

```
Default Deny
```

即：

没有明确授权，

一律禁止访问。

------

# 93. Permission Cache

权限信息允许缓存。

建议缓存：

```
Role

Permission

Menu

Resource Mapping
```

用户权限发生变化后：

立即刷新缓存。

------

# 94. Backend Middleware

所有 REST API：

统一经过：

```
Authentication Middleware

↓

Authorization Middleware

↓

Business Service
```

业务 Service 不重复进行权限判断。

------

# 95. Frontend Cooperation

前端仅负责：

```
隐藏菜单

隐藏按钮

显示无权限提示
```

最终权限判定：

必须以后端结果为准。

------

# 96. Typical Permission Examples

供应商账号：

允许：

```
查看自己企业

修改自己企业资料

管理自己的产品
```

禁止：

```
修改其他供应商

系统配置

用户管理
```

------

# 97. Administrator Permission

平台管理员：

允许：

```
产品管理

供应商审核

新闻发布

需求审核

系统配置

用户管理
```

所有操作均记录审计日志。

------

# 98. Procurement User Permission

采购用户：

允许：

```
发布采购需求

浏览产品

浏览供应商

收藏产品

提交询价
```

默认不能进入后台管理。

------

# 99. Audit Requirements

每次权限判定记录：

```
User ID

Role

Resource

Action

Decision

Time

IP
```

便于问题追踪与安全审计。

------

# 100. Permission Status

| Item                   | Status  |
| ---------------------- | ------- |
| Authorization Pipeline | Defined |
| Resource Mapping       | Defined |
| Action Definition      | Defined |
| Permission Cache       | Defined |
| Middleware             | Defined |
| Frontend Cooperation   | Defined |
| Audit                  | Defined |

# 101. Purpose

定义 VISNDT 平台统一角色体系。

所有后台菜单、API、数据权限均以本章节为依据。

------

# 102. Platform Roles

平台统一定义以下角色：

| Role                   | 说明           |
| ---------------------- | -------------- |
| Super Administrator    | 超级管理员     |
| Platform Administrator | 平台管理员     |
| Content Editor         | 内容编辑       |
| Organization Manager   | 组织管理员     |
| Organization Staff     | 组织员工       |
| Procurement User       | 采购企业用户   |
| Guest                  | 游客（未登录） |

后续如新增角色，应保持与 RBAC 模型兼容。

------

# 103. Super Administrator

负责：

```
平台全部资源
```

权限包括：

- 用户管理
- 角色管理
- 权限管理
- 系统配置
- 分类管理
- 产品审核
- 组织审核
- 新闻审核
- 日志查看
- 数据导出

拥有全部系统权限。

------

# 104. Platform Administrator

负责平台日常运营。

允许：

- 产品管理
- 新闻管理
- 应用案例管理
- 供应商审核
- 采购需求审核
- Banner 管理
- 首页推荐管理

不得修改：

- 超级管理员
- 权限模型
- 系统安全配置

------

# 105. Content Editor

负责内容维护。

允许：

- 新闻发布
- 技术文章
- 应用案例
- 展会资讯
- SEO 内容维护

不得：

- 审核供应商
- 修改系统配置
- 删除用户

------

# 106. Organization Manager

对应组织企业管理员。

允许管理：

- 企业资料
- 企业 Logo
- 联系方式
- Offer 信息
- Offer 附件
- RFQ 响应
- 企业新闻

仅能管理：

本企业数据。

------

# 107. Organization Staff

企业普通员工。

允许：

- 创建 Offer
- 编辑 Offer
- 上传附件
- 回复 RFQ

不得：

- 修改企业认证信息
- 删除企业
- 管理企业账号

------

# 108. Procurement User

采购企业账号。

允许：

- 浏览产品
- 收藏产品
- 发布采购需求
- 管理自己的需求
- 查看历史询价
- 联系 Organization（按平台规则）

不得：

- 发布标准产品
- 管理 Organization 信息
- 进入后台管理

------

# 109. Guest

游客默认允许：

- 浏览产品
- 浏览供应商
- 浏览新闻
- 浏览案例
- 使用产品筛选

需要登录后才能：

- 收藏
- 发布需求
- 联系供应商
- 下载资料（可配置）

------

# 110. Backend Menu Mapping

后台菜单建议对应如下：

| 菜单       | 超管 | 平台管理员 | 编辑 | 供应商管理员 |
| ---------- | ---- | ---------- | ---- | ------------ |
| Dashboard  | ✔    | ✔          | ✔    | ✔            |
| 产品管理   | ✔    | ✔          | ×    | ✔            |
| 供应商管理 | ✔    | ✔          | ×    | ×            |
| 新闻中心   | ✔    | ✔          | ✔    | ×            |
| 分类管理   | ✔    | ✔          | ×    | ×            |
| 用户管理   | ✔    | ×          | ×    | ×            |
| 系统配置   | ✔    | ×          | ×    | ×            |

------

# 111. Frontend Capability

前台根据登录身份动态展示功能。

例如：

游客：

```
浏览

搜索

筛选
```

采购用户：

增加：

```
收藏

询价

采购需求
```

供应商：

增加：

```
企业中心

产品管理

消息通知
```

------

# 112. Data Permission

所有业务数据默认遵循：

```
平台数据

↓

企业数据

↓

个人数据
```

供应商只能访问：

本企业数据。

采购用户只能访问：

本人创建的数据。

------

# 113. Role Extension

角色设计应支持后续新增：

- 区域运营
- 行业审核员
- AI 助手账号
- API 集成账号

新增角色不得影响现有权限模型。

------

# 114. Platform Role Checklist

## Role

□ Super Administrator

□ Platform Administrator

□ Content Editor

□ Organization Manager

□ Organization Staff

□ Procurement User

□ Guest

------

## Permission

□ Menu Permission

□ API Permission

□ Data Permission

------

## Platform

□ Supplier Isolation

□ Procurement Isolation

□ Backend Menu Control

------

# 115. Platform Role Status

| Item                | Status  |
| ------------------- | ------- |
| Platform Roles      | Defined |
| Backend Menu        | Defined |
| Frontend Capability | Defined |
| Data Permission     | Defined |
| Role Extension      | Defined |
| Permission Matrix   | Defined |

# 116. Purpose

本章节定义 VISNDT 平台运行期间的安全策略。

适用于：

- 平台后台
- 供应商中心
- 采购中心
- 管理接口

------

# 117. Login Security Policy

连续登录失败：

建议：

```
5 次
```

之后：

```
账户锁定 30 分钟
```

管理员可手动解除锁定。

------

# 118. Password Policy

密码要求：

- 长度不少于 8 位
- 包含字母和数字
- 建议包含特殊字符

禁止使用：

- 12345678
- password
- 企业名称
- 用户名

------

# 119. Password Change Policy

以下情况要求重新登录：

- 修改密码
- 管理员重置密码
- 长时间未登录后首次修改密码

修改密码后：

所有 Refresh Token 立即失效。

------

# 120. File Upload Security

平台允许上传：

- 产品图片
- 企业 Logo
- 产品资料（PDF）
- 新闻图片

统一要求：

- 校验文件类型
- 校验文件大小
- 重命名保存
- 禁止执行脚本上传

------

# 121. File Type Restrictions

建议允许：

| 类型             | 用途         |
| ---------------- | ------------ |
| JPG / PNG / WebP | 图片         |
| PDF              | 产品资料     |
| XLSX             | 数据导入     |
| CSV              | 数据导入导出 |

默认禁止：

- EXE
- BAT
- JS
- PHP
- ASP
- DLL

------

# 122. Backend Access Policy

后台管理入口：

建议：

- 必须登录
- 全站 HTTPS
- JWT 校验
- 权限校验

禁止匿名访问任何后台 API。

------

# 123. API Rate Limiting

建议接口限流：

| 类型     | 建议                 |
| -------- | -------------------- |
| 登录接口 | 10 次 / 分钟 / IP    |
| 普通 API | 120 次 / 分钟 / 用户 |
| 文件上传 | 20 次 / 分钟 / 用户  |

超过限制：

返回：

```
HTTP 429 Too Many Requests
```

------

# 124. Security Audit Log

以下操作必须记录日志：

- 登录
- 登出
- 修改密码
- 新建用户
- 删除用户
- 修改角色
- 删除产品
- 发布新闻
- 系统配置修改

日志至少保存：

```
180 Days
```

------

# 125. Sensitive Operations

以下操作建议二次确认：

- 删除产品
- 删除供应商
- 删除分类
- 删除用户
- 清空缓存
- 系统配置修改

必要时要求再次输入密码。

------

# 126. Security Notification

建议通知管理员：

- 多次登录失败
- 异常登录地区（预留）
- 管理员账号被锁定
- 权限异常变更
- 系统配置修改

------

# 127. HTTPS Policy

生产环境：

必须：

- 全站 HTTPS
- HSTS（可开启）
- Cookie 设置 Secure（如使用 Cookie）

所有 Token 不得通过 URL 传递。

------

# 128. Operational Checklist

## Login

□ 登录限制

□ 密码策略

□ Token 失效

------

## Upload

□ 文件类型检查

□ 文件大小检查

□ 重命名

------

## Operation

□ HTTPS

□ Rate Limit

□ Audit Log

------

# 129. Operational Security Status

| Item            | Status  |
| --------------- | ------- |
| Login Security  | Defined |
| Password Policy | Defined |
| Upload Security | Defined |
| Backend Access  | Defined |
| Rate Limiting   | Defined |
| Audit Log       | Defined |
| HTTPS Policy    | Defined |

# 130. Module Integration

认证授权模块作为 Backend 公共基础能力。

所有业务模块统一调用，不允许各模块自行实现登录、权限校验。

统一调用关系：

```
Client

↓

Authentication

↓

Authorization

↓

Business Service

↓

Database
```

------

# 131. Integration with OpenAPI

所有需要登录的 API：

必须在 OpenAPI 中声明：

- Authentication Required
- Security Scheme
- Required Role（可选）
- Required Permission（可选）

API 文档与实际实现保持一致。

------

# 132. Integration with Business Service

505 中所有业务模块：

包括：

- 产品中心
- 供应商中心
- 采购需求
- 新闻中心
- CMS
- 文件管理

均通过统一认证中间件访问。

业务代码不直接解析 JWT。

------

# 133. Frontend Integration

前端统一负责：

- 登录
- Token 保存
- Token 自动刷新
- 登录状态维护
- 根据权限显示菜单

权限最终以后台返回结果为准。

------

# 134. Backend Middleware

Backend 建议统一提供：

| Middleware     | 作用     |
| -------------- | -------- |
| Authentication | 身份认证 |
| Authorization  | 权限校验 |
| Audit          | 操作审计 |
| Rate Limit     | 接口限流 |

所有业务接口按统一顺序执行。

------

# 135. Security Directory

建议安全相关代码统一维护：

```
backend/

├── auth/
├── authorization/
├── middleware/
├── security/
├── audit/
└── token/
```

避免权限逻辑分散到各业务模块。

------

# 136. Repository Deliverables

504 最终交付内容包括：

- 身份模型
- 登录流程
- JWT 规范
- RBAC 权限模型
- 平台角色体系
- 安全策略
- 中间件规范

作为 Backend 安全基础模块。

------

# 137. Acceptance Criteria

504 完成后，应满足：

- 所有接口均可接入认证
- 所有角色均可完成权限判定
- 前后台权限保持一致
- 安全策略统一执行
- 支持后续业务模块直接复用

------

# 138. Future Extension

预留扩展能力：

- OAuth2 登录
- 企业单点登录（SSO）
- 多租户
- 双因素认证（MFA）
- OpenID Connect
- 第三方 API 授权

不影响现有架构。

------

# 139. Repository Checklist

## Authentication

□ Identity

□ JWT

□ Login Flow

------

## Authorization

□ RBAC

□ Permission

□ Platform Roles

------

## Security

□ Audit

□ Upload Security

□ Rate Limiting

------

## Integration

□ OpenAPI

□ Business Service

□ Middleware

------

# 140. Final Status

| Item                   | Status  |
| ---------------------- | ------- |
| Authentication         | Defined |
| Authorization          | Defined |
| Platform Roles         | Defined |
| Security Policy        | Defined |
| Middleware Integration | Defined |
| Repository Delivery    | Defined |
| Future Extension       | Defined |

------

# 141. 504 Document Completion

Document：

```
504_Authentication_And_Authorization
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

下一阶段：

```
505_Backend_Business_Service
```
