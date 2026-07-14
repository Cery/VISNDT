# Error Code Specification

Version：V1.0

Status：FINAL

------

# 1. Purpose

本文档定义 VISNDT Backend 全局错误码规范。

统一：

- API 返回
- Business Service
- Validation
- Authentication
- Frontend Error Handling
- Log

所有模块均引用本规范。

------

# 2. Design Objectives

错误码设计目标：

```
Readable

↓

Stable

↓

Unique

↓

Traceable
```

错误码一经发布，不应修改语义。

如业务变化，应新增错误码，而非复用旧错误码。

------

# 3. Scope

适用于：

- REST API
- 后台管理
- Supplier Center
- Procurement Center
- CMS
- Search
- File Service

统一采用本规范。

------

# 4. Error Response Format

统一返回：

```
{
  "success": false,
  "code": "PRODUCT_1002",
  "message": "Product not found.",
  "requestId": "req_xxxxxxxxx",
  "timestamp": "2026-01-01T10:00:00Z"
}
```

字段保持固定。

------

# 5. Naming Convention

统一命名：

```
MODULE_CODE
```

例如：

```
AUTH_1001

PRODUCT_2001

SUPPLIER_3001
```

全部采用：

大写英文 + 下划线。

------

# 6. Error Classification

统一划分：

| 类型           | 前缀         |
| -------------- | ------------ |
| Authentication | AUTH         |
| User           | USER         |
| Product        | PRODUCT      |
| Organization   | ORGANIZATION |
| Offer          | OFFER        |
| Demand         | DEMAND       |
| RFQ            | RFQ          |
| CMS            | CMS          |
| Search         | SEARCH       |
| File           | FILE         |
| Notification   | NOTIFICATION |
| Dashboard      | DASHBOARD    |
| System         | SYSTEM       |

各模块维护自己的错误码区间。

------

# 7. Number Allocation

建议编号：

| 模块        | 编号范围  |
| ----------- | --------- |
| AUTH        | 1000~1999 |
| PRODUCT     | 2000~2999 |
| ORGANIZATION | 3000~3499 |
| OFFER        | 3500~3999 |
| DEMAND       | 4000~4499 |
| RFQ          | 4500~4999 |
| NOTIFICATION | 5000~5499 |
| CMS         | 6000~6999 |
| FILE        | 7000~7999 |
| SEARCH      | 8000~8999 |
| SYSTEM      | 9000~9999 |

预留未来扩展空间。

------

# 8. HTTP Mapping

统一建议：

| HTTP | 含义         |
| ---- | ------------ |
| 400  | 参数错误     |
| 401  | 未认证       |
| 403  | 权限不足     |
| 404  | 资源不存在   |
| 409  | 数据冲突     |
| 422  | 业务校验失败 |
| 429  | 请求过于频繁 |
| 500  | 系统异常     |

HTTP 状态码与业务错误码同时返回。

------

# 9. Localization

错误码保持不变。

Message 支持：

- 中文
- English

未来可扩展更多语言。

------

# 10. Document Status

| Item              | Status  |
| ----------------- | ------- |
| Purpose           | Defined |
| Scope             | Defined |
| Naming Convention | Defined |
| Number Allocation | Defined |
| HTTP Mapping      | Defined |
| Error Response    | Defined |

# Authentication & Authorization Error Codes

------

# 11. Purpose

本章节定义身份认证与权限控制相关错误码。

适用于：

- 平台后台
- Supplier Center
- Procurement Center
- OpenAPI

统一引用 504 Authentication 规范。

------

# 12. Module Mapping

## 对应 API

- `/auth/login`
- `/auth/logout`
- `/auth/refresh`
- `/auth/profile`
- 所有受保护接口

## 对应 Service

- Authentication Service
- Authorization Service

## 前端处理建议

- 登录页跳转
- Token 自动刷新
- 权限提示
- 会话失效处理

------

# 13. AUTH Error Code Table

| Error Code | HTTP | Description             | Frontend Action                |
| ---------- | ---- | ----------------------- | ------------------------------ |
| AUTH_1000  | 400  | Invalid request         | 表单校验提示                   |
| AUTH_1001  | 401  | Login failed            | 提示用户名或密码错误           |
| AUTH_1002  | 401  | Invalid token           | 跳转登录                       |
| AUTH_1003  | 401  | Token expired           | 自动刷新 Token，失败则重新登录 |
| AUTH_1004  | 403  | Permission denied       | 显示无权限页面                 |
| AUTH_1005  | 403  | Role not allowed        | 禁止访问当前功能               |
| AUTH_1006  | 429  | Too many login attempts | 提示稍后重试                   |
| AUTH_1007  | 401  | Session expired         | 清除登录状态并重新登录         |
| AUTH_1008  | 403  | Account locked          | 提示联系管理员                 |
| AUTH_1009  | 403  | Account disabled        | 提示账号已停用                 |

------

# 14. Error Handling Flow

认证失败统一流程：

```
Request

↓

Authentication

↓

AUTH_xxxx

↓

Standard Response

↓

Frontend Handling
```

------

# 15. Token Error Policy

Token 相关错误：

| 错误码    | 处理方式             |
| --------- | -------------------- |
| AUTH_1002 | 清除 Token，重新登录 |
| AUTH_1003 | 尝试刷新 Token       |
| AUTH_1007 | 强制退出登录         |

所有处理保持一致。

------

# 16. Authorization Policy

权限不足：

统一返回：

```
HTTP 403

AUTH_1004
```

不暴露内部权限结构。

------

# 17. Logging Requirement

以下错误必须记录安全日志：

- AUTH_1001
- AUTH_1002
- AUTH_1003
- AUTH_1006
- AUTH_1008
- AUTH_1009

用于安全审计与异常分析。

------

# 18. Business Rules

统一规则：

- 错误码保持稳定
- Message 可本地化
- 不返回敏感信息
- 所有认证接口统一返回格式
- 前端根据 Error Code 处理，不解析 Message

------

# 19. Service Status

| Item                 | Status  |
| -------------------- | ------- |
| Error Code Table     | Defined |
| Token Policy         | Defined |
| Authorization Policy | Defined |
| Logging Requirement  | Defined |
| Frontend Action      | Defined |
| Business Rules       | Defined |

# Product Error Codes

------

# 20. Purpose

本章节定义产品中心相关错误码。

适用于：

- 产品创建
- 产品编辑
- 产品审核
- 产品发布
- 产品上下架
- 产品查询
- 产品关联资源

------

# 21. Module Mapping

## 对应 API

- `/products`
- `/products/{id}`
- `/products/review`
- `/products/publish`

## 对应 Service

- Product Service
- File Service
- Search Service

## 对应数据库

- product
- product_parameter
- product_category
- file_reference

------

# 22. Product Error Code Table

| Error Code   | HTTP | Description                    | Frontend Action      |
| ------------ | ---- | ------------------------------ | -------------------- |
| PRODUCT_2000 | 400  | Invalid product request        | 提示参数错误         |
| PRODUCT_2001 | 404  | Product not found              | 返回产品不存在       |
| PRODUCT_2002 | 409  | Product already exists         | 提示重复产品         |
| PRODUCT_2003 | 400  | Product name required          | 提示填写产品名称     |
| PRODUCT_2004 | 400  | Category required              | 提示选择分类         |
| PRODUCT_2005 | 400  | Invalid parameter value        | 提示参数错误         |
| PRODUCT_2006 | 403  | No permission to edit product  | 提示无编辑权限       |
| PRODUCT_2007 | 409  | Product status conflict        | 提示当前状态不可操作 |
| PRODUCT_2008 | 422  | Product review failed          | 显示审核失败原因     |
| PRODUCT_2009 | 422  | Product publish failed         | 提示发布失败         |
| PRODUCT_2010 | 404  | Organization or offer not found | 提示组织或供给不存在 |
| PRODUCT_2011 | 409  | Product already published      | 提示产品已发布       |
| PRODUCT_2012 | 409  | Product already offline        | 提示产品已下架       |
| PRODUCT_2013 | 400  | Missing required specification | 提示完善技术参数     |

------

# 23. Product Lifecycle Errors

产品状态：

```
Draft

↓

Pending Review

↓

Published

↓

Offline

↓

Archived
```

状态错误示例：

| 操作               | 错误码       |
| ------------------ | ------------ |
| 已发布产品再次发布 | PRODUCT_2011 |
| 已下架产品重复下架 | PRODUCT_2012 |
| 非审核状态提交发布 | PRODUCT_2007 |

------

# 24. Product Creation Errors

创建产品检查：

必须存在：

- 产品名称
- 产品分类
- 平台标准产品分类
- 基础参数

缺失时：

返回对应 PRODUCT 错误码。

------

# 25. Product Review Errors

审核失败：

```
PRODUCT_2008
```

同时记录：

- 审核人
- 审核时间
- 失败原因

供供应商修改。

------

# 26. Product Publish Errors

发布前检查：

- 是否审核通过
- 是否存在供应商
- 是否完成必要参数
- 是否存在违规状态

失败：

返回：

```
PRODUCT_2009
```

------

# 27. Product Search Errors

搜索相关异常：

| Error Code   | Description              |
| ------------ | ------------------------ |
| PRODUCT_2014 | Search index unavailable |
| PRODUCT_2015 | Product filter invalid   |

由 Search Service 调用时返回。

------

# 28. Logging Requirement

以下错误记录业务日志：

- PRODUCT_2002
- PRODUCT_2007
- PRODUCT_2008
- PRODUCT_2009

用于：

- 产品审核追踪
- 异常分析
- 运营统计

------

# 29. Business Rules

统一规则：

- 产品错误码不可跨模块复用
- 状态错误必须返回明确错误码
- 前端禁止依赖 Message 判断逻辑
- 审核失败必须保留原因
- 删除产品采用逻辑删除

------

# 30. Service Status

| Item                | Status  |
| ------------------- | ------- |
| Product CRUD Errors | Defined |
| Lifecycle Errors    | Defined |
| Review Errors       | Defined |
| Publish Errors      | Defined |
| Search Errors       | Defined |
| Logging Rules       | Defined |

# Organization and Offer Error Codes

------

# 31. Purpose

本章节定义 `Organization` 与 `Offer` 模块相关错误码。

适用于：

- 企业注册
- 企业资料维护
- 企业认证
- 企业状态管理
- Offer 管理
- 企业展示

------

# 32. Module Mapping

## 对应 API

- `/organizations`
- `/organizations/{id}`
- `/organizations/verification`
- `/organizations/status`
- `/offers`
- `/offers/{id}`

## 对应 Service

- Organization Service
- Offer Service
- Product Service
- Notification Service

## 对应数据库

- organization
- organization_profile
- organization_verification
- offer
- standard_product

------

# 33. Organization and Offer Error Code Table

| Error Code    | HTTP | Description                    | Frontend Action  |
| ------------- | ---- | ------------------------------ | ---------------- |
| ORGANIZATION_3000 | 400  | Invalid organization request       | 提示参数错误     |
| ORGANIZATION_3001 | 404  | Organization not found             | 提示企业不存在   |
| ORGANIZATION_3002 | 409  | Organization already exists        | 提示企业已存在   |
| ORGANIZATION_3003 | 400  | Organization name required         | 提示填写企业名称 |
| ORGANIZATION_3004 | 400  | Missing organization information   | 提示完善资料     |
| ORGANIZATION_3005 | 403  | No permission to edit organization | 提示无权限       |
| ORGANIZATION_3006 | 422  | Verification failed                | 显示认证失败原因 |
| ORGANIZATION_3007 | 409  | Organization already verified      | 提示已认证       |
| ORGANIZATION_3008 | 409  | Invalid organization status        | 提示状态异常     |
| ORGANIZATION_3009 | 403  | Organization disabled              | 提示企业已停用   |
| ORGANIZATION_3010 | 409  | Organization has active offers     | 禁止删除         |
| ORGANIZATION_3011 | 400  | Invalid verification document      | 提示资料错误     |
| ORGANIZATION_3012 | 422  | Organization review rejected       | 显示审核原因     |
| OFFER_3500        | 400  | Invalid offer request              | 提示参数错误     |
| OFFER_3501        | 404  | Offer not found                    | 提示供给不存在   |
| OFFER_3502        | 409  | Offer already exists               | 提示供给已存在   |
| OFFER_3503        | 403  | No permission to edit offer        | 提示无权限       |
| OFFER_3504        | 409  | Invalid offer status               | 提示状态异常     |

------

# 34. Organization Lifecycle Errors

供应商生命周期：

```
Pending

↓

Verified

↓

Active

↓

Suspended

↓

Archived
```

状态限制：

| 操作             | 错误码        |
| ---------------- | ------------- |
| 已认证再次认证   | ORGANIZATION_3007 |
| 禁用企业访问业务 | ORGANIZATION_3009 |
| 状态无法转换     | ORGANIZATION_3008 |

------

# 35. Organization Registration Errors

企业注册检查：

必须包含：

- 企业名称
- 联系人
- 联系方式
- 所属地区

缺失：

返回：

```
ORGANIZATION_3004
```

------

# 36. Verification Errors

认证流程：

```
提交资料

↓

平台审核

↓

认证结果
```

失败情况：

| 情况         | 错误码        |
| ------------ | ------------- |
| 营业资料错误 | ORGANIZATION_3011 |
| 审核拒绝     | ORGANIZATION_3012 |
| 已认证       | ORGANIZATION_3007 |

------

# 37. Product Relationship Errors

Organization、Offer 与 Product 关系：

```
Organization

1

↓

N

Offer

N

↓

1

Standard Product
```

删除企业前：

检查：

- 是否存在有效 Offer
- 是否存在采购关联
- 是否存在历史记录

存在产品：

返回：

```
SUPPLIER_3010
```

------

# 38. Supplier Display Errors

企业展示前检查：

- 企业状态
- 认证状态
- 公开资料完整度

异常：

返回：

```
SUPPLIER_3008
```

------

# 39. Logging Requirement

以下错误记录：

- SUPPLIER_3006
- SUPPLIER_3012
- SUPPLIER_3009
- SUPPLIER_3010

用于：

- 企业审核追踪
- 风控分析
- 平台运营

------

# 40. Business Rules

统一规则：

- 企业认证结果必须可追踪
- 企业状态变化必须记录
- 删除采用逻辑删除
- 错误码不可跨模块复用
- 前端根据 Code 判断处理逻辑

------

# 41. Service Status

| Item                        | Status  |
| --------------------------- | ------- |
| Registration Errors         | Defined |
| Verification Errors         | Defined |
| Lifecycle Errors            | Defined |
| Product Relationship Errors | Defined |
| Display Errors              | Defined |
| Logging Rules               | Defined |

# Demand and RFQ Error Codes

------

# 42. Purpose

本章节定义 `Demand` 与 `RFQ` 模块相关错误码。

适用于：

- 采购需求创建
- 需求编辑
- 需求审核
- 需求发布
- 需求匹配
- RFQ 创建
- RFQ 响应

------

# 43. Module Mapping

## 对应 API

- `/demands`
- `/demands/{id}`
- `/demands/publish`
- `/demands/{id}/rfqs`
- `/rfqs`
- `/rfqs/{id}`

## 对应 Service

- Demand Service
- RFQ Service
- Organization Service

## 对应数据库

- demand
- demand_parameter
- rfq
- rfq_response

------

# 44. Demand and RFQ Error Code Table

| Error Code       | HTTP | Description                       | Frontend Action      |
| ---------------- | ---- | --------------------------------- | -------------------- |
| DEMAND_4000 | 400  | Invalid demand request       | 提示参数错误         |
| DEMAND_4001 | 404  | Demand not found             | 提示需求不存在       |
| DEMAND_4002 | 403  | No permission to edit demand | 提示无权限           |
| DEMAND_4003 | 400  | Title required               | 提示填写需求标题     |
| DEMAND_4004 | 400  | Category required            | 提示选择产品分类     |
| DEMAND_4005 | 400  | Missing demand description   | 提示完善描述         |
| DEMAND_4006 | 409  | Demand status conflict       | 提示当前状态不可操作 |
| DEMAND_4007 | 422  | Demand review failed         | 显示审核原因         |
| DEMAND_4008 | 409  | Demand already published     | 提示已发布           |
| DEMAND_4009 | 409  | Demand already closed        | 提示已关闭           |
| DEMAND_4010 | 422  | Matching failed              | 提示暂无匹配结果     |
| DEMAND_4011 | 403  | Contact access denied        | 提示无联系权限       |
| RFQ_4500    | 400  | Invalid RFQ request          | 提示参数错误         |
| RFQ_4501    | 404  | RFQ not found                | 提示询价不存在       |
| RFQ_4502    | 409  | RFQ status conflict          | 提示当前状态不可操作 |
| RFQ_4503    | 409  | RFQ response already exists  | 提示已响应           |

------

# 45. Demand Lifecycle Errors

需求生命周期：

```
Draft

↓

Pending Review

↓

Published

↓

Matching

↓

Closed

↓

Archived
```

状态错误：

| 操作           | 错误码           |
| -------------- | ---------------- |
| 已发布再次发布 | DEMAND_4008 |
| 已关闭修改     | DEMAND_4009 |
| 非正确状态操作 | DEMAND_4006 |

------

# 46. Demand Creation Errors

创建需求必须包含：

- 标题
- 产品分类
- 应用场景
- 基本需求描述

缺失：

返回：

```
DEMAND_4003

DEMAND_4004

DEMAND_4005
```

------

# 47. Demand Review Errors

审核流程：

```
提交需求

↓

平台审核

↓

发布
```

审核失败：

返回：

```
DEMAND_4007
```

同时记录：

- 审核人
- 审核时间
- 失败原因

------

# 48. Matching Errors

需求匹配：

```
Demand

↓

Category Matching

↓

Parameter Matching

↓

Supplier Matching
```

没有符合条件：

返回：

```
REQUIREMENT_4010
```

说明：

该错误不代表系统异常，仅表示当前无匹配结果。

------

# 49. RFQ Response Errors

RFQ 响应：

检查：

- Organization 状态
- 是否重复响应
- 是否具有权限

异常：

| 情况       | 错误码           |
| ---------- | ---------------- |
| 重复响应   | RFQ_4503 |
| 无响应权限 | DEMAND_4011 |

------

# 50. Contact Protection Errors

平台采用联系方式保护机制。

未满足条件：

禁止：

- 查看采购联系方式
- 导出联系方式
- 绕过平台沟通

返回：

```
DEMAND_4011
```

------

# 51. Logging Requirement

重点记录：

- DEMAND_4007
- DEMAND_4010
- DEMAND_4011
- RFQ_4503

用于：

- 撮合分析
- 平台运营
- 风控管理

------

# 52. Business Rules

统一规则：

- 需求状态不可非法跳转
- 审核失败必须保留原因
- 匹配失败不是系统错误
- 联系权限必须经过授权
- 历史需求不可修改核心信息

------

# 53. Service Status

| Item               | Status  |
| ------------------ | ------- |
| Creation Errors    | Defined |
| Lifecycle Errors   | Defined |
| Review Errors      | Defined |
| Matching Errors    | Defined |
| Response Errors    | Defined |
| Contact Protection | Defined |
| Logging Rules      | Defined |

# Notification / CMS / Search / File Error Codes

------

# 54. Purpose

本章节定义：

- 通知服务（Notification）

- 内容管理系统（CMS）
- 搜索服务（Search）
- 文件媒体服务（File）

相关错误码。

------

# 55. Module Mapping

## Notification

对应：

API：

- `/notifications`
- `/notifications/{id}`

Service：

- Notification Service

数据：

- notification
- notification_delivery

------

## CMS

对应：

API：

- `/cms/articles`
- `/cms/news`
- `/cms/banner`

Service：

- News & CMS Service

数据：

- article
- news
- banner
- page_content

------

## Search

对应：

API：

- `/search`
- `/products/search`

Service：

- Search Service

数据：

- search_index
- product
- news

------

## File

对应：

API：

- `/files/upload`
- `/files/{id}`

Service：

- File & Media Service

数据：

- file
- file_reference

------

# 56. CMS Error Code Table

## Notification Error Code Table

| Error Code         | HTTP | Description                  | Frontend Action   |
| ------------------ | ---- | ---------------------------- | ----------------- |
| NOTIFICATION_5000  | 400  | Invalid notification request | 提示参数错误      |
| NOTIFICATION_5001  | 404  | Notification not found       | 提示通知不存在    |
| NOTIFICATION_5002  | 403  | Notification access denied   | 提示无查看权限    |
| NOTIFICATION_5003  | 409  | Notification status conflict | 提示状态异常      |
| NOTIFICATION_5004  | 500  | Notification delivery failed | 提示稍后重试      |

------

# 56A. CMS Error Code Table

| Error Code | HTTP | Description               | Frontend Action   |
| ---------- | ---- | ------------------------- | ----------------- |
| CMS_6000   | 400  | Invalid content request   | 提示参数错误      |
| CMS_6001   | 404  | Content not found         | 提示内容不存在    |
| CMS_6002   | 403  | No publish permission     | 提示无发布权限    |
| CMS_6003   | 400  | Title required            | 提示填写标题      |
| CMS_6004   | 400  | Content body required     | 提示填写正文      |
| CMS_6005   | 409  | Content already published | 提示已发布        |
| CMS_6006   | 409  | Invalid content status    | 提示状态异常      |
| CMS_6007   | 422  | Review rejected           | 显示审核原因      |
| CMS_6008   | 500  | Publish failed            | 提示稍后重试      |
| CMS_6009   | 400  | Invalid SEO metadata      | 提示 SEO 信息错误 |

------

# 57. CMS Lifecycle Errors

内容状态：

```
Draft

↓

Review

↓

Published

↓

Offline

↓

Archived
```

状态异常：

| 情况           | 错误码   |
| -------------- | -------- |
| 已发布重复发布 | CMS_6005 |
| 状态非法转换   | CMS_6006 |
| 审核失败       | CMS_6007 |

------

# 58. CMS Publish Rules

发布前检查：

- 标题存在
- 内容存在
- 分类存在
- SEO 信息合法

失败：

返回：

```
CMS_6008
```

------

# 59. Search Error Code Table

| Error Code  | HTTP | Description                | Frontend Action  |
| ----------- | ---- | -------------------------- | ---------------- |
| SEARCH_8000 | 400  | Invalid search request     | 提示搜索参数错误 |
| SEARCH_8001 | 404  | No result found            | 展示空结果页     |
| SEARCH_8002 | 500  | Search service unavailable | 提示稍后重试     |
| SEARCH_8003 | 500  | Index unavailable          | 系统提示         |
| SEARCH_8004 | 400  | Invalid filter parameter   | 清除错误筛选条件 |
| SEARCH_8005 | 429  | Too many requests          | 请求限制提示     |

------

# 60. Search Business Rules

注意：

```
SEARCH_8001
```

不是系统异常。

含义：

> 搜索正常执行，但没有匹配结果。

前端应展示：

- 推荐分类
- 热门产品
- 相关内容

而不是错误页面。

------

# 61. File Error Code Table

| Error Code | HTTP | Description              | Frontend Action  |
| ---------- | ---- | ------------------------ | ---------------- |
| FILE_7000  | 400  | Invalid file request     | 参数提示         |
| FILE_7001  | 400  | Unsupported file type    | 提示文件格式错误 |
| FILE_7002  | 413  | File too large           | 提示文件过大     |
| FILE_7003  | 403  | Upload permission denied | 无上传权限       |
| FILE_7004  | 404  | File not found           | 文件不存在       |
| FILE_7005  | 409  | File already exists      | 提示重复文件     |
| FILE_7006  | 500  | Storage failed           | 存储异常         |
| FILE_7007  | 500  | File processing failed   | 处理失败         |
| FILE_7008  | 403  | File access denied       | 无访问权限       |

------

# 62. File Upload Flow Error

上传流程：

```
Upload

↓

Validation

↓

Storage

↓

Reference
```

对应错误：

| 阶段     | 错误码    |
| -------- | --------- |
| 文件验证 | FILE_7001 |
| 大小限制 | FILE_7002 |
| 权限验证 | FILE_7003 |
| 存储失败 | FILE_7006 |

------

# 63. Logging Requirement

重点记录：

CMS：

- CMS_6007
- CMS_6008

Search：

- SEARCH_8002
- SEARCH_8003

File：

- FILE_7006
- FILE_7007

用于：

- 系统监控
- 内容运营
- 存储故障分析

------

# 64. Business Rules

统一规则：

- CMS 错误不影响产品交易流程
- Search 无结果不视为异常
- File 删除需检查引用关系
- 错误码保持长期稳定
- 前端不得依赖 Message 判断

------

# 65. Service Status

| Item             | Status  |
| ---------------- | ------- |
| CMS Errors       | Defined |
| Search Errors    | Defined |
| File Errors      | Defined |
| Lifecycle Errors | Defined |
| Upload Errors    | Defined |
| Logging Rules    | Defined |

# System Error Codes

------

# 66. Purpose

本章节定义系统级通用错误码。

适用于：

- Backend Framework
- Database
- Cache
- Queue
- External Service
- Scheduled Task

------

# 67. Module Mapping

## 对应层级

```
API Layer

↓

Service Layer

↓

Infrastructure Layer

↓

External System
```

------

# 68. System Error Code Table

| Error Code  | HTTP | Description             | Frontend Action    |
| ----------- | ---- | ----------------------- | ------------------ |
| SYSTEM_9000 | 500  | Internal server error   | 提示系统异常       |
| SYSTEM_9001 | 503  | Service unavailable     | 提示服务暂不可用   |
| SYSTEM_9002 | 504  | Service timeout         | 提示请求超时       |
| SYSTEM_9003 | 500  | Database error          | 提示稍后重试       |
| SYSTEM_9004 | 500  | Cache error             | 系统自动处理       |
| SYSTEM_9005 | 429  | Rate limit exceeded     | 提示请求频繁       |
| SYSTEM_9006 | 503  | Maintenance mode        | 提示系统维护       |
| SYSTEM_9007 | 502  | External service failed | 提示第三方服务异常 |
| SYSTEM_9008 | 500  | Configuration error     | 联系管理员         |
| SYSTEM_9009 | 500  | Unknown exception       | 提示未知异常       |

------

# 69. Database Error Handling

数据库异常统一：

返回：

```
SYSTEM_9003
```

禁止返回：

- SQL 语句
- 表名称
- 字段结构
- 数据库错误详情

详细信息仅记录日志。

------

# 70. Service Availability

服务不可用：

例如：

- Search 服务停止；
- 文件存储异常；
- 外部接口失败。

统一：

```
SYSTEM_9001
```

前端：

显示：

> 服务暂时不可用，请稍后重试。

------

# 71. Timeout Handling

请求超过限制：

返回：

```
SYSTEM_9002
```

适用于：

- 查询超时
- 文件处理超时
- 第三方接口超时

------

# 72. Rate Limit

限制：

- 登录请求
- 搜索请求
- 文件上传

超过限制：

返回：

```
SYSTEM_9005
```

用于防止：

- 恶意请求
- 接口滥用

------

# 73. Maintenance Mode

系统维护期间：

所有非必要请求：

返回：

```
SYSTEM_9006
```

前端展示：

- 维护公告
- 预计恢复时间（可选）

------

# 74. External Service Errors

第三方服务：

例如：

- 邮件服务
- 云存储
- 企业通知接口

失败：

返回：

```
SYSTEM_9007
```

同时记录：

- 服务名称
- 请求时间
- Request ID

------

# 75. Exception Logging

系统异常必须记录：

- Error Code
- Request ID
- Stack Trace
- User ID（如有）
- API Path
- Timestamp

------

# 76. Security Rules

禁止返回：

- 数据库结构
- 服务器路径
- 内部 IP
- 密钥信息
- 第三方 Token

用户只接收：

```
错误码 + 用户提示
```

------

# 77. Business Rules

统一规则：

- 系统错误不可暴露技术细节
- 所有异常必须生成 Request ID
- 日志保存完整信息
- 用户提示保持友好
- 前端根据 Code 处理

------

# 78. Service Status

| Item            | Status  |
| --------------- | ------- |
| System Errors   | Defined |
| Database Errors | Defined |
| Timeout Errors  | Defined |
| Service Errors  | Defined |
| Security Rules  | Defined |
| Logging Rules   | Defined |

# Error Code Integration & Delivery

------

# 79. Purpose

本章节定义错误码在 VISNDT 平台中的集成规范。

确保：

- API
- Service
- Frontend
- Testing
- Logging

均使用统一错误体系。

------

# 80. API Integration

所有 API 必须返回统一结构：

```
{
  "success": false,
  "code": "PRODUCT_2001",
  "message": "Product not found.",
  "requestId": "req_xxxxxx",
  "timestamp": "2026-01-01T10:00:00Z"
}
```

要求：

- code 必须存在；
- message 可国际化；
- requestId 必须可追踪。

------

# 81. Service Integration

Business Service 内部：

禁止直接返回 HTTP。

统一：

```
Repository

↓

Service Exception

↓

API Exception Handler

↓

Error Response
```

------

# 82. Exception Mapping

示例：

Product Service：

业务：

```
产品不存在
```

转换：

```
PRODUCT_2001
```

最终：

```
HTTP 404
```

------

# 83. Frontend Handling Rules

前端根据 Code 判断逻辑。

禁止：

根据 message 判断。

------

## 示例：

### Token 过期

Code：

```
AUTH_1003
```

处理：

```
刷新 Token

↓

失败

↓

跳转登录
```

------

### 产品不存在

Code：

```
PRODUCT_2001
```

处理：

```
展示404页面
```

------

### 搜索无结果

Code：

```
SEARCH_8001
```

处理：

```
展示推荐内容
```

------

# 84. Error Handling Priority

处理优先级：

```
Security Error

↓

Business Error

↓

Validation Error

↓

System Error
```

安全问题优先处理。

------

# 85. Testing Requirements

每个错误码必须覆盖：

| 测试          | 要求          |
| ------------- | ------------- |
| API Test      | 返回正确 Code |
| Service Test  | 正确抛出异常  |
| Frontend Test | 正确展示      |
| Logging Test  | 正确记录      |

------

# 86. Documentation Relationship

错误码关联：

```
502 API Specification

↓

505 Business Service

↓

506 Error Code

↓

507 Testing
```

形成完整链路。

------

# 87. Version Management

错误码版本：

```
V1.0
```

规则：

允许：

- 新增错误码

禁止：

- 修改已有 Code 含义
- 删除已使用 Code

------

# 88. Repository Location

建议目录：

```
docs/

└── 500_Backend/

    ├── 501_Backend_Architecture.md

    ├── 502_API_Design.md

    ├── 503_OpenAPI.md

    ├── 504_Authentication.md

    ├── 505_Business_Service.md

    └── 506_Error_Code.md
```

------

# 89. Acceptance Checklist

506 完成标准：

□ 所有业务模块存在错误码

□ API 返回格式统一

□ Service 异常统一

□ 前端处理规则明确

□ 测试可引用

□ 文档完成版本冻结

------

# 90. Final Status

| Item                | Status    |
| ------------------- | --------- |
| Error Naming        | Completed |
| Module Mapping      | Completed |
| API Integration     | Completed |
| Service Integration | Completed |
| Frontend Rules      | Completed |
| Testing Rules       | Completed |
| Repository Delivery | Completed |

------

# 506_Error_Code_Specification

Version:

```
V1.0
```

Status:

```
FINAL
```

Completion:

```
100%
```
