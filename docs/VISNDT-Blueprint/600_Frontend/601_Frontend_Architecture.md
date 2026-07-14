# Frontend Architecture Foundation

------

# 1. Purpose

本文档定义 VISNDT 前端应用架构规范。

目标：

建立：

- 可维护；
- 可扩展；
- SEO 友好；
- 高性能。

的前端体系。

------

# 2. Frontend Position

VISNDT 前端定位：

```
Industrial Equipment Platform UI
```

主要服务：

三类用户：

------

## 2.1 Buyer

采购人员。

需求：

- 查找设备；
- 比较参数；
- 提交需求。

------

## 2.2 Engineer

技术人员。

需求：

- 查看规格；
- 查询方案；
- 获取资料。

------

## 2.3 Organization

供应组织。

需求：

- 企业展示；
- Offer 管理；
- RFQ 响应。

------

# 3. Frontend Architecture Model

整体：

```
Presentation Layer

        |

Component Layer

        |

Business Logic Layer

        |

API Service Layer

        |

Backend API
```

------

# 4. Application Structure

推荐：

```
src/

├── pages/

├── components/

├── layouts/

├── services/

├── stores/

├── utils/

├── assets/

└── router/
```

------

# 5. Page Layer

负责：

页面组合。

例如：

```
Home

ProductList

ProductDetail

RequirementCreate

UserCenter
```

------

# 6. Component Layer

负责：

通用 UI。

例如：

```
ProductCard

FilterPanel

ParameterTable

SearchBox

Pagination
```

------

# 7. Service Layer

负责：

API 通信。

例如：

```
productService

requirementService

userService
```

------

# 8. State Layer

负责：

共享状态。

例如：

- 用户状态；
- 搜索条件；
- 筛选条件。

------

# 9. Frontend Data Flow

标准流程：

```
User Action

↓

Component

↓

Store

↓

Service

↓

API

↓

Backend

↓

Update UI
```

------

# 10. Routing Design

主要路由：

```
/                  首页

/products          产品中心

/products/:id      产品详情

/solutions          解决方案

/requirements       需求中心

/account            用户中心
```

------

# 11. Frontend Security

要求：

- Token 安全保存；
- 输入校验；
- XSS 防护；
- 权限控制。

------

# 12. Architecture Checklist

| Item                | Status  |
| ------------------- | ------- |
| Layer Design        | Defined |
| Directory Structure | Defined |
| Data Flow           | Defined |
| Routing Model       | Defined |
| Security Principle  | Defined |

# Frontend Technology Stack Specification

------

# 13. Technology Selection Principle

VISNDT 前端技术选择遵循：

------

## 13.1 Stability First

优先：

- 成熟生态；
- 长期维护；
- 社区支持。

------

## 13.2 SEO Friendly

必须支持：

- 搜索引擎抓取；
- 页面预渲染；
- Meta 管理；
- Structured Data。

------

## 13.3 Business Expansion Ready

支持未来：

- 产品规模扩大；
- 行业分类扩展；
- 用户体系扩展；
- 撮合功能增强。

------

# 14. Recommended Frontend Stack

整体：

```
Frontend Framework

        ↓

Vue 3

        ↓

TypeScript

        ↓

Vite

        ↓

UI Component System

        ↓

API Service Layer

        ↓

Backend API
```

------

# 15. Framework Selection

## Vue 3

作为主要前端框架。

原因：

- 学习成本低；
- 生态成熟；
- 组件开发效率高；
- 适合中大型平台。

------

应用：

```
Page Rendering

Component System

State Binding

Interaction Logic
```

------

# 16. Type System

采用：

```
TypeScript
```

------

目的：

提高：

- 类型安全；
- 代码可维护性；
- 团队协作效率。

------

重点应用：

包括：

```
API Model

Product Schema

Parameter Definition

User Object
```

------

# 17. Build Tool

采用：

```
Vite
```

------

作用：

负责：

- 开发服务器；
- 模块打包；
- 生产构建。

------

优势：

- 启动快；
- 配置简单；
- 现代浏览器支持好。

------

# 18. UI Component Strategy

采用：

```
Component Based Design
```

------

组件分类：

```
Basic Components

↓

Business Components

↓

Page Components
```

------

# 19. Basic Components

基础组件：

例如：

```
Button

Input

Dialog

Table

Pagination

Card
```

------

特点：

高复用。

------

# 20. Business Components

业务组件：

对应 VISNDT。

例如：

------

## ProductCard

产品展示卡片。

------

## ParameterFilter

参数筛选。

------

## RequirementForm

需求提交表单。

------

## SupplierBadge

供应商信息展示。

------

# 21. Styling Strategy

采用：

组件化样式。

原则：

- 统一设计变量；
- 避免页面独立 CSS；
- 保持视觉一致。

------

# 22. State Management

推荐：

```
Pinia
```

------

管理：

包括：

- 用户状态；
- 搜索状态；
- 筛选条件；
- 临时业务状态。

------

# 23. Routing Solution

推荐：

```
Vue Router
```

------

负责：

页面：

- 路由；
- 权限；
- 页面切换。

------

# 24. API Communication

统一：

Service Layer。

结构：

```
Component

↓

Service

↓

HTTP Client

↓

Backend API
```

------

禁止：

组件直接调用 API。

------

# 25. SEO Technology Strategy

VISNDT 前端必须支持：

------

## Meta Management

包括：

- Title；
- Description；
- Keywords。

------

## Structured Data

支持：

```
Product Schema

Organization Schema

Article Schema
```

------

## URL Structure

推荐：

```
/products/video-endoscope

/solutions/automotive-inspection
```

------

# 26. Performance Strategy

重点：

------

## Code Splitting

按页面加载。

------

## Lazy Loading

图片、组件延迟加载。

------

## Asset Optimization

包括：

- 图片压缩；
- CDN；
- 缓存。

------

# 27. Technology Stack Summary

| Layer     | Technology             |
| --------- | ---------------------- |
| Framework | Next.js                |
| Language  | TypeScript             |
| Build     | Next.js Build          |
| Router    | Next.js Router         |
| State     | React State            |
| UI        | Component System       |
| API       | Service Layer          |
| SEO       | Meta + Structured Data |

------

# 28. Frontend Architecture Layers

VISNDT Frontend 分为两个主要侧面：

## Public Side

面向公众用户：

- Home
- Product Center
- Knowledge 
- Search
- Demand Entry

## Organization Side  

面向供应组织：

- Organization Dashboard
- Offer Management
- RFQ Inbox
- Response Management
- Notification Center

## Architecture Requirements

Frontend 统一使用：

- **Next.js + TypeScript**
- **Responsive Web**  
- **Single Codebase**

**禁止：PC/Mobile 双项目**

------

# 29. Technology Checklist

| Item                 | Status  |
| -------------------- | ------- |
| Framework            | Defined |
| Language             | Defined |
| Build Tool           | Defined |
| Component Strategy   | Defined |
| SEO Strategy         | Defined |
| Performance Strategy | Defined |

# Frontend Application Structure Specification

------

# 29. Purpose

本文档定义 VISNDT 前端应用目录和模块结构。

目标：

建立：

- 清晰代码组织；
- 可扩展业务模块；
- 高复用组件体系。

------

# 30. Frontend Directory Structure

推荐：

```
src/

├── app/

├── pages/

├── layouts/

├── components/

├── modules/

├── services/

├── stores/

├── router/

├── utils/

├── assets/

└── types/
```

------

# 31. Application Layer

目录：

```
src/app/
```

负责：

应用初始化。

包括：

- 全局配置；
- 插件注册；
- 初始化逻辑。

------

# 32. Page Layer

目录：

```
src/pages/
```

负责：

页面级组合。

------

页面分类：

```
pages/

├── Home

├── Products

├── Solutions

├── Demands

├── Account

└── Admin
```

------

# 33. Home Module

首页：

```
Home
```

功能：

- 平台介绍；
- 产品入口；
- 行业方案；
- 最新内容。

------

组件：

```
HeroBanner

CategoryEntry

FeaturedProducts

IndustrySolutions

NewsList
```

------

# 34. Product Module

产品中心：

```
Products
```

核心模块。

包含：

```
ProductList

ProductDetail

ProductCompare

ProductFilter
```

------

功能：

- 产品搜索；
- 参数筛选；
- 产品详情；
- 技术参数展示。

------

# 35. Solution Module

解决方案：

```
Solutions
```

包括：

- 行业应用；
- 检测案例；
- 技术方案。

------

结构：

```
SolutionList

SolutionDetail

ApplicationCase
```

------

# 36. Demand Module

需求撮合中心：

```
Demands
```

包含：

```
DemandCreate

DemandDetail

DemandStatus
```

------

用户流程：

```
选择检测需求

↓

填写参数

↓

提交 Demand

↓

生成 RFQ

↓

Organization 响应
```

------

# 37. Account Module

用户中心：

```
Account
```

包括：

- 登录；
- 企业资料；
- 收藏；
- 我的需求。

------

结构：

```
Login

Profile

Favorites

MyRequirements
```

------

# 38. Admin Module

管理端：

```
Admin
```

用于：

平台运营。

包括：

- 产品管理；
- 内容管理；
- 需求审核。

------

# 39. Component Structure

目录：

```
components/
```

分三层：

------

## Common Components

公共组件：

```
Button

Modal

Table

Pagination

SearchBox
```

------

## Business Components

业务组件：

```
ProductCard

ParameterTable

FilterPanel

RequirementForm
```

------

## Layout Components

布局组件：

```
Header

Footer

Sidebar

Navigation
```

------

# 40. Module Structure

复杂业务：

独立模块。

例如：

```
modules/

└── product/

    ├── components/

    ├── services/

    ├── types/

    └── store/
```

------

# 41. Service Layer

目录：

```
services/
```

负责：

Backend API 调用。

------

结构：

```
services/

├── productService

├── requirementService

├── userService

└── contentService
```

------

规则：

页面禁止：

直接请求 API。

------

# 42. Type Definition

目录：

```
types/
```

定义：

业务数据模型。

例如：

```
Product

Parameter

Supplier

Requirement

User
```

------

# 43. Asset Management

目录：

```
assets/
```

管理：

- 图片；
- 图标；
- 样式资源。

------

# 44. Router Structure

路由：

```
router/

├── publicRoutes

├── userRoutes

└── adminRoutes
```

------

# 45. Frontend Data Organization

数据流：

```
Page

↓

Module Store

↓

Service

↓

API

↓

Backend
```

------

# 46. Naming Convention

规则：

组件：

PascalCase

例如：

```
ProductCard.vue
```

Service：

camelCase

例如：

```
productService.ts
```

------

# 47. Structure Checklist

| Item                | Status  |
| ------------------- | ------- |
| Directory Structure | Defined |
| Page Module         | Defined |
| Component Layer     | Defined |
| Service Layer       | Defined |
| Type Layer          | Defined |
| Naming Rule         | Defined |

# Frontend Architecture Acceptance

------

# 48. Purpose

本文档定义 VISNDT 前端架构验收标准。

目标：

确认前端架构：

- 稳定；
- 清晰；
- 可维护；
- 可扩展。

------

# 49. Architecture Acceptance Scope

验收范围：

```
Technology Stack

+

Directory Structure

+

Component System

+

Data Flow

+

Security

+

Performance
```

------

# 50. Technology Acceptance

确认：

## Framework

满足：

- Vue 3 正常运行；
- TypeScript 支持。

------

## Build System

确认：

- Vite 构建成功；
- 生产环境打包正常。

------

## Dependency

确认：

- 依赖版本固定；
- 无高风险依赖。

------

# 51. Directory Structure Acceptance

检查：

目录：

```
pages

components

modules

services

stores

types
```

------

要求：

- 职责明确；
- 无重复代码；
- 无跨层调用。

------

# 52. Component Architecture Acceptance

检查：

组件是否：

------

## Reusable

公共组件：

可被多个页面使用。

------

## Independent

组件：

不绑定具体业务。

------

## Maintainable

修改：

不会影响大量页面。

------

# 53. Module Architecture Acceptance

业务模块：

必须：

独立。

例如：

```
Product Module

Requirement Module

User Module
```

------

禁止：

业务逻辑散落在页面。

------

# 54. Data Flow Acceptance

标准：

```
Page

↓

Component

↓

Store

↓

Service

↓

API
```

------

检查：

禁止：

组件直接访问数据库或 Backend。

------

# 55. API Layer Acceptance

确认：

所有接口：

通过：

```
Service Layer
```

管理。

------

要求：

统一：

- 请求格式；
- 错误处理；
- Token 管理。

------

# 56. SEO Architecture Acceptance

确认支持：

------

## Meta

包括：

- Title；
- Description。

------

## Structured Data

支持：

- Product；
- Article；
- Organization。

------

## URL Structure

要求：

语义化。

例如：

```
/products/video-endoscope
```

------

# 57. Performance Acceptance

检查：

------

## Loading

确认：

- 首屏速度合理；
- 资源优化。

------

## Rendering

确认：

- 页面无明显阻塞。

------

## Asset

确认：

- 图片优化；
- 缓存策略。

------

# 58. Security Acceptance

检查：

------

## Authentication

确认：

- Token 管理安全。

------

## Input

确认：

- 用户输入校验。

------

## Data

确认：

- 敏感数据保护。

------

# 59. Development Standard Acceptance

确认：

代码符合：

- 命名规范；
- 目录规范；
- 组件规范。

------

# 60. Documentation Acceptance

必须完成：

```
Architecture Document

+

Component Guide

+

Development Guide
```

------

# 61. Final Acceptance Checklist

| Item                | Status |
| ------------------- | ------ |
| Technology Stack    | PASS   |
| Directory Structure | PASS   |
| Component Design    | PASS   |
| Module Design       | PASS   |
| API Layer           | PASS   |
| SEO Support         | PASS   |
| Performance         | PASS   |
| Security            | PASS   |

------

# 62. 601_Frontend_Architecture Final Status

| Module                  | Status    |
| ----------------------- | --------- |
| Architecture Foundation | Completed |
| Technology Stack        | Completed |
| Application Structure   | Completed |
| Architecture Acceptance | Completed |

------

# 601_Frontend_Architecture

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