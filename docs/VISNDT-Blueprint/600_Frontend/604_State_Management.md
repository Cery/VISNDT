# Frontend State Management Foundation

------

# 1. Purpose

定义 VISNDT 前端状态管理规范。

目标：

建立：

- 全局状态管理；
- 页面状态管理；
- 业务状态管理；
- 数据缓存策略。

------

# 2. State Management Position

状态管理负责：

```
用户操作

↓

前端状态

↓

页面响应

↓

API 数据同步
```

------

# 3. Design Principle

## 3.1 Minimum State

只保存必要状态。

禁止：

重复保存 Backend 数据。

------

## 3.2 Single Source Of Truth

同一业务数据：

保持唯一来源。

------

## 3.3 Business Separation

不同业务：

独立管理。

------

# 4. State Architecture

整体：

```
src/

└── stores/

    ├── appStore

    ├── userStore

    ├── productStore

    ├── requirementStore

    └── searchStore
```

------

# 5. State Classification

VISNDT 状态分为：

```
Global State

+

Business State

+

UI State

+

Temporary State
```

------

# 6. Global State

全局状态：

包括：

```
Language

Theme

System Config

Application Status
```

------

# 7. User State

用户状态：

Store:

```
userStore
```

------

管理：

```
User Info

Login Status

Permission

Token
```

------

数据结构：

```
UserState {

 userId

 company

 role

 authenticated

}
```

------

# 8. Product State

产品状态：

Store:

```
productStore
```

------

管理：

```
Current Product

Product List

Selected Product

Compare Products
```

------

# 9. Product Filter State

筛选状态：

包括：

```
Category

Diameter

Length

Resolution

Direction

Application
```

------

流程：

```
User Select

↓

Filter State

↓

Product API

↓

Result Update
```

------

# 10. Search State

Store:

```
searchStore
```

------

管理：

```
Keyword

Search History

Search Result

Search Condition
```

------

# 11. Requirement State

Store:

```
requirementStore
```

------

管理：

```
Draft Requirement

Submitted Requirement

Requirement Status

Matching Result
```

------

# 12. Requirement Flow State

状态：

```
Draft

↓

Editing

↓

Submitted

↓

Processing

↓

Completed
```

------

# 13. UI State

页面交互状态：

包括：

```
Dialog Open

Loading

Error

Pagination

Collapse
```

------

特点：

生命周期短。

------

# 14. Temporary State

临时状态：

例如：

```
Form Input

Current Selection

Filter Draft
```

------

原则：

无需长期保存。

------

# 15. Store Responsibility

| Store            | Responsibility   |
| ---------------- | ---------------- |
| appStore         | Global Config    |
| userStore        | User Session     |
| productStore     | Product Data     |
| searchStore      | Search           |
| requirementStore | Requirement Flow |

------

# 16. State Update Flow

标准：

```
Component

↓

Action

↓

Store

↓

Service

↓

API

↓

Update State
```

------

# 17. API Data Cache

缓存：

用于：

- 产品列表；
- 分类数据；
- 参数字典。

------

缓存策略：

```
Request

↓

Check Cache

↓

Return Data

↓

Refresh
```

------

# 18. Persistence Strategy

需要持久化：

```
User Token

Preference

Draft Requirement
```

------

不持久化：

```
Temporary UI State
```

------

# 19. Error State Handling

统一处理：

包括：

```
Network Error

Permission Error

Validation Error

Server Error
```

------

# 20. Loading State

统一：

```
Loading Component

+

Store Status
```

------

状态：

```
idle

loading

success

error
```

------

# 21. State Management Checklist

| Item               | Status  |
| ------------------ | ------- |
| State Architecture | Defined |
| User State         | Defined |
| Product State      | Defined |
| Requirement State  | Defined |
| Search State       | Defined |
| Cache Strategy     | Defined |
| Error Handling     | Defined |

# Pinia Store Design Specification

------

# 22. Purpose

定义 VISNDT 前端 Pinia Store 设计规范。

目标：

建立：

- 统一状态容器；
- 清晰业务边界；
- 可维护状态逻辑。

------

# 23. Store Architecture

目录：

```
src/stores/

├── appStore.ts

├── userStore.ts

├── productStore.ts

├── searchStore.ts

└── requirementStore.ts
```

------

# 24. appStore Design

## Responsibility

管理应用级状态。

------

State：

```
AppState {

 language

 systemConfig

 initialized

}
```

------

Actions：

```
initializeApp()

updateConfig()

resetApp()
```

------

用途：

- 初始化平台配置；
- 管理全局环境。

------

# 25. userStore Design

## Responsibility

管理用户状态。

------

State：

```
UserState {

 token

 userInfo

 loginStatus

}
```

------

Actions：

```
login()

logout()

refreshUser()

updateProfile()
```

------

Getters：

```
isAuthenticated

currentUser

userRole
```

------

# 26. ProductStore Design

## Responsibility

管理产品业务状态。

------

State：

```
ProductState {

 products[]

 currentProduct

 selectedProducts[]

 filters

 pagination

}
```

------

Actions：

```
loadProducts()

loadProductDetail()

setFilter()

clearFilter()

compareProduct()
```

------

Getters：

```
filteredProducts

compareList

currentProduct
```

------

# 27. Product Filter Store

筛选状态：

```
FilterState {

category

diameter

length

resolution

direction

application

}
```

------

更新：

```
setFilter()

removeFilter()

resetFilter()
```

------

# 28. SearchStore Design

## Responsibility

管理搜索状态。

------

State：

```
SearchState {

keyword

history[]

results[]

}
```

------

Actions：

```
search()

clearSearch()

saveHistory()
```

------

# 29. RequirementStore Design

## Responsibility

管理需求流程。

------

State：

```
RequirementState {

draft

currentRequirement

status

matchingResult

}
```

------

Actions：

```
createDraft()

updateDraft()

submitRequirement()

loadStatus()
```

------

# 30. Store Communication Rule

原则：

Store 之间：

禁止：

直接修改其他 Store 数据。

------

正确：

```
Store A

↓

Action

↓

Store B
```

------

错误：

```
Store A

↓

Direct Mutation

↓

Store B State
```

------

# 31. Store Data Ownership

| Data              | Owner            |
| ----------------- | ---------------- |
| User Info         | userStore        |
| Product List      | productStore     |
| Search Keyword    | searchStore      |
| Requirement Draft | requirementStore |
| System Config     | appStore         |

------

# 32. Store Naming Convention

文件：

```
xxxStore.ts
```

------

示例：

```
productStore.ts

requirementStore.ts
```

------

变量：

camelCase。

------

# 33. Store Action Naming

规则：

动作使用：

动词。

------

正确：

```
loadProducts()

submitRequirement()

updateProfile()
```

------

禁止：

```
productData()

user()
```

------

# 34. Store Getter Naming

规则：

描述状态结果。

------

示例：

```
isLogin

currentProduct

selectedCount
```

------

# 35. State Reset Design

每个 Store：

必须提供：

```
reset()
```

------

用途：

- 用户退出；
- 页面重置；
- 数据刷新。

------

# 36. Async Action Design

异步流程：

统一：

```
Start

↓

Loading

↓

Request

↓

Success/Error

↓

Update State
```

------

# 37. Store Error Handling

统一保存：

```
errorMessage

errorCode
```

------

页面负责：

展示。

Store负责：

管理。

------

# 38. Store Persistence

持久化：

允许：

```
userStore

requirementDraft
```

------

禁止：

```
productList

temporaryFilter
```

------

# 39. Store Performance

要求：

避免：

- 大量无效响应；
- 重复请求；
- 不必要刷新。

------

策略：

```
Cache

+

Lazy Loading

+

Selective Update
```

------

# 40. Store Security

敏感数据：

包括：

Token。

要求：

- 安全存储；
- 自动失效；
- 清理机制。

------

# 41. Pinia Store Checklist

| Item              | Status  |
| ----------------- | ------- |
| Store Structure   | Defined |
| User Store        | Defined |
| Product Store     | Defined |
| Search Store      | Defined |
| Requirement Store | Defined |
| Naming Rule       | Defined |
| Persistence Rule  | Defined |

# Frontend Data Flow Specification

------

# 42. Purpose

定义 VISNDT 前端数据流转规范。

目标：

明确：

- 页面如何获取数据；
- 组件如何传递数据；
- Store 如何管理状态；
- Service 如何连接 Backend。

------

# 43. Data Flow Architecture

标准流程：

```
User Action

↓

Page Component

↓

Business Component

↓

Store Action

↓

Service Layer

↓

Backend API

↓

Store Update

↓

UI Render
```

------

# 44. Layer Responsibility

前端数据层：

```
Page Layer

↓

Component Layer

↓

State Layer

↓

Service Layer

↓

API Layer
```

------

# 45. Page Layer

职责：

负责：

- 页面组合；
- 路由响应；
- 页面级状态初始化。

------

禁止：

直接调用 Backend API。

------

示例：

```
ProductPage

↓

ProductList

↓

ProductStore
```

------

# 46. Component Layer

职责：

负责：

- UI 展示；
- 用户交互；
- 数据接收。

------

数据来源：

```
Props

+

Store
```

------

禁止：

复杂业务逻辑。

------

# 47. State Layer

职责：

负责：

- 状态保存；
- 数据同步；
- 状态计算。

------

包括：

```
productStore

requirementStore

userStore
```

------

# 48. Service Layer

职责：

统一管理 API 请求。

目录：

```
src/services/
```

------

结构：

```
services/

├── productService.ts

├── requirementService.ts

├── userService.ts

└── searchService.ts
```

------

# 49. API Request Flow

产品查询：

```
User

↓

ParameterFilter

↓

productStore

↓

productService

↓

Backend API

↓

Product List
```

------

# 50. Product Data Flow

完整流程：

```
Open Product Page

↓

Load Category

↓

Load Filter Options

↓

Request Product List

↓

Update Store

↓

Render ProductCard
```

------

# 51. Product Detail Flow

流程：

```
Product ID

↓

ProductStore

↓

ProductService

↓

Backend

↓

ProductDetail Component
```

------

数据：

包括：

```
Basic Info

Parameters

Application

Supplier
```

------

# 52. Requirement Data Flow

流程：

```
User Input

↓

RequirementForm

↓

RequirementStore

↓

RequirementService

↓

Backend

↓

Status Update
```

------

# 53. Requirement Draft Flow

草稿：

```
Input

↓

Local State

↓

Save Draft

↓

Submit
```

------

目的：

避免用户填写丢失。

------

# 54. Search Data Flow

流程：

```
Keyword

↓

SearchBox

↓

SearchStore

↓

SearchService

↓

Backend

↓

Result Page
```

------

# 55. Error Data Flow

统一：

```
API Error

↓

Service

↓

Store

↓

Component

↓

Error UI
```

------

# 56. Loading Data Flow

统一：

```
Request Start

↓

loading=true

↓

API Response

↓

loading=false
```

------

# 57. Data Refresh Strategy

刷新：

包括：

```
Manual Refresh

Auto Refresh

Route Change Refresh
```

------

# 58. Cache Strategy

缓存对象：

```
Category

Parameter Dictionary

Product Basic Data
```

------

缓存目的：

减少：

重复请求。

------

# 59. Route Data Loading

页面进入：

执行：

```
Route

↓

Load Required Data

↓

Render Page
```

------

避免：

页面空白等待。

------

# 60. Data Security Flow

敏感数据：

处理：

```
API

↓

Service

↓

Store

↓

Protected Component
```

------

禁止：

直接暴露。

------

# 61. Frontend Data Flow Checklist

| Item             | Status  |
| ---------------- | ------- |
| Layer Separation | Defined |
| Page Flow        | Defined |
| Component Flow   | Defined |
| Store Flow       | Defined |
| API Flow         | Defined |
| Error Flow       | Defined |
| Cache Strategy   | Defined |

# State Management Acceptance Specification

------

# 62. Purpose

定义 VISNDT 前端状态管理验收标准。

目标：

确认：

- 状态划分合理；
- Store 职责明确；
- 数据流稳定；
- 前端状态可维护。

------

# 63. Acceptance Scope

验收范围：

```
Store Architecture

+

State Ownership

+

Data Flow

+

Cache Strategy

+

Error Handling
```

------

# 64. Store Architecture Acceptance

检查：

目录：

```
stores/

├── appStore

├── userStore

├── productStore

├── searchStore

└── requirementStore
```

------

要求：

业务边界清晰。

------

# 65. State Ownership Acceptance

确认：

数据唯一归属。

------

规则：

| Data        | Owner            |
| ----------- | ---------------- |
| User        | userStore        |
| Product     | productStore     |
| Search      | searchStore      |
| Requirement | requirementStore |
| Config      | appStore         |

------

禁止：

同一数据多 Store 保存。

------

# 66. Component-State Interaction Acceptance

标准：

```
Component

↓

Action

↓

Store

↓

State Update

↓

Render
```

------

禁止：

组件直接修改状态。

------

# 67. API-State Interaction Acceptance

标准：

```
Component

↓

Store

↓

Service

↓

API

↓

Store Update
```

------

禁止：

Component 直接调用 API。

------

# 68. Async State Acceptance

检查：

异步请求状态：

必须包含：

```
idle

loading

success

error
```

------

适用：

- 产品加载；
- 需求提交；
- 用户登录。

------

# 69. Cache Acceptance

检查：

缓存对象：

包括：

```
Category Data

Parameter Data

Product Basic Data
```

------

要求：

避免：

重复请求。

------

# 70. Persistence Acceptance

允许：

```
User Session

Requirement Draft
```

------

禁止：

```
Temporary UI State
```

------

# 71. Reset Acceptance

每个 Store：

必须支持：

```
reset()
```

------

场景：

- 用户退出；
- 数据清理；
- 页面重新初始化。

------

# 72. Error Handling Acceptance

检查：

错误统一处理。

包括：

```
Network Error

Permission Error

Validation Error

Server Error
```

------

# 73. Performance Acceptance

检查：

- 避免无效更新；
- 避免重复请求；
- 合理缓存。

------

# 74. Security Acceptance

检查：

敏感数据：

包括：

- Token；
- 用户信息。

------

要求：

- 安全存储；
- 退出清除。

------

# 75. State Management Checklist

| Item            | Status |
| --------------- | ------ |
| Store Structure | PASS   |
| State Ownership | PASS   |
| Data Flow       | PASS   |
| Cache Strategy  | PASS   |
| Error Handling  | PASS   |
| Security        | PASS   |
| Performance     | PASS   |

------

# 76. 604_State_Management Final Status

| Module             | Status    |
| ------------------ | --------- |
| State Foundation   | Completed |
| Pinia Store Design | Completed |
| Data Flow          | Completed |
| Acceptance         | Completed |

------

# 604_State_Management

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