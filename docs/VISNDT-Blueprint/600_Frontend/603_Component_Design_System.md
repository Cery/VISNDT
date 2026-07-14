# Component Design Foundation

------

# 1. Purpose

本文档定义 VISNDT 前端组件设计规范。

目标：

建立：

- 统一 UI 标准；
- 高复用组件体系；
- 可维护前端结构。

------

# 2. Component Design Position

VISNDT 组件体系：

服务：

```
Platform Website

+

Product Center

+

Requirement Center

+

User Center
```

------

# 3. Component Design Principle

------

## 3.1 Reusability

组件：

必须能够重复使用。

例如：

```
ProductCard
```

可用于：

- 首页推荐；
- 产品列表；
- 搜索结果。

------

## 3.2 Single Responsibility

组件：

只负责一个主要职责。

例如：

正确：

```
ParameterTable
```

负责：

参数展示。

------

错误：

一个组件同时负责：

- 数据请求；
- 页面跳转；
- 参数计算。

------

## 3.3 Business Driven

组件设计：

围绕业务。

不是：

单纯 UI 元素集合。

------

# 4. Component Architecture

结构：

```
src/components/

├── base/

├── layout/

├── business/

└── feedback/
```

------

# 5. Base Components

基础组件。

目录：

```
components/base/
```

------

包括：

## Button

按钮。

用途：

- 提交；
- 跳转；
- 操作。

------

## Input

输入框。

用途：

- 搜索；
- 表单。

------

## Select

选择器。

用途：

- 分类；
- 参数选择。

------

## Dialog

弹窗。

用途：

- 确认；
- 提示。

------

## Table

表格。

用途：

- 参数展示；
- 数据列表。

------

# 6. Layout Components

布局组件。

目录：

```
components/layout/
```

------

包括：

## Header

顶部导航。

功能：

- Logo；
- 导航；
- 搜索。

------

## Footer

底部区域。

功能：

- 平台信息；
- 联系方式。

------

## Container

页面容器。

统一：

- 宽度；
- 间距。

------

## Sidebar

侧边栏。

用于：

产品筛选。

------

# 7. Business Components

业务组件。

目录：

```
components/business/
```

------

这是 VISNDT 核心。

------

# 8. ProductCard Component

产品卡片。

用途：

展示：

产品摘要。

结构：

```
Image

↓

Product Name

↓

Key Parameters

↓

Application

↓

Action Button
```

------

应用：

- 首页；
- 产品列表。

------

# 9. ParameterTable Component

参数表组件。

用途：

展示设备规格。

结构：

```
Parameter

|

Value
```

------

支持：

- 多参数；
- 分类显示；
- 响应式。

------

# 10. ParameterFilter Component

参数筛选组件。

用途：

产品搜索。

结构：

```
Category

Diameter

Length

Resolution

Application
```

------

支持：

- 多选；
- 清除；
- 条件组合。

------

# 11. SearchBox Component

搜索组件。

用途：

全站搜索。

支持：

关键词：

- 产品；
- 参数；
- 行业。

------

# 12. RequirementForm Component

需求提交组件。

用途：

撮合入口。

字段：

包括：

```
Product Type

Application

Parameter

Description

Contact
```

------

# 13. SupplierBadge Component

供应商展示组件。

用途：

显示：

- 企业名称；
- 企业属性。

------

原则：

不形成独立商城。

------

# 14. Feedback Components

反馈组件。

目录：

```
components/feedback/
```

------

包括：

## Loading

加载状态。

------

## Empty

空数据状态。

------

## Error

错误提示。

------

# 15. Component Naming Rule

规则：

Vue 组件：

PascalCase。

例如：

```
ProductCard.vue

ParameterTable.vue
```

------

# 16. Component Props Rule

要求：

Props：

明确类型。

例如：

```
Product

Parameter

Config
```

------

禁止：

大量无定义对象传递。

------

# 17. Component Event Rule

事件：

统一命名。

例如：

```
update

change

submit

select
```

------

# 18. Component Documentation

每个核心组件：

需要：

- 功能说明；
- Props；
- Events；
- 使用示例。

------

# 19. Component Foundation Checklist

| Item                | Status  |
| ------------------- | ------- |
| Component Principle | Defined |
| Base Components     | Defined |
| Layout Components   | Defined |
| Business Components | Defined |
| Naming Rules        | Defined |
| Documentation Rule  | Defined |

# Product Business Components Specification

------

# 20. Purpose

本文档定义 VISNDT 产品中心业务组件规范。

目标：

建立：

- 产品展示组件；
- 参数查询组件；
- 产品比较组件；
- 产品详情组件。

------

# 21. Product Component Position

产品组件负责：

```
用户需求

↓

参数理解

↓

设备筛选

↓

技术判断

↓

需求提交
```

------

# 22. Product Component Structure

整体：

```
Product Components

├── ProductCard

├── ProductList

├── ParameterFilter

├── ParameterTable

├── ProductCompare

├── ProductGallery

└── ProductSummary
```

------

# 23. ProductCard Component

## Purpose

产品卡片。

用于：

- 首页推荐；
- 产品列表；
- 搜索结果。

------

结构：

```
+-----------------------+

Image

Product Name

Category

Key Parameters

Application

Action

+-----------------------+
```

------

显示内容：

必须包含：

- 产品名称；
- 核心参数；
- 应用方向。

------

不包含：

- 价格；
- 在线购买按钮。

------

# 24. ProductCard Data Model

输入：

```
ProductCardData
```

包含：

```
productId

name

category

image

parameters

application

supplier
```

------

# 25. ProductList Component

## Purpose

产品列表展示。

------

负责：

- 数据循环；
- 排序；
- 分页。

------

结构：

```
ProductList

↓

ProductCard

↓

ProductDetail
```

------

支持：

- PC 网格；
- 移动端列表。

------

# 26. ParameterFilter Component

## Purpose

工业设备筛选核心组件。

------

设计原则：

不是商城筛选。

而是：

技术条件匹配。

------

结构：

```
FilterPanel

├── Category

├── Diameter

├── Length

├── Resolution

├── Direction

├── Guidance

└── Application
```

------

# 27. Filter Interaction

流程：

```
选择参数

↓

生成条件

↓

调用 Product API

↓

刷新列表
```

------

支持：

- 多条件组合；
- 条件删除；
- 保存筛选状态。

------

# 28. ParameterTable Component

## Purpose

技术参数展示。

------

结构：

```
Parameter

Value

Unit

Description
```

------

示例：

| 参数   | 数值      |
| ------ | --------- |
| 管径   | 3mm       |
| 分辨率 | 200万像素 |
| 长度   | 5m        |

------

# 29. Parameter Classification

参数分组：

```
Basic

↓

Optical

↓

Mechanical

↓

Control

↓

Application
```

------

优势：

避免长表格难阅读。

------

# 30. ProductGallery Component

## Purpose

产品图片展示。

------

支持：

- 主图；
- 多角度图；
- 应用现场图。

------

要求：

图片：

服务于理解。

------

# 31. ProductSummary Component

## Purpose

产品摘要区域。

------

位置：

产品详情顶部。

------

内容：

```
Product Name

Short Description

Core Parameters

Request Button
```

------

# 32. ProductCompare Component

## Purpose

产品对比。

------

流程：

```
Select Product

↓

Compare

↓

Technical Decision
```

------

比较：

仅展示：

关键技术参数。

------

# 33. Compare Data Structure

比较对象：

```
Product A

VS

Product B
```

------

字段：

```
Diameter

Length

Resolution

Guidance

Application
```

------

# 34. Product Requirement Button

产品组件统一入口：

```
Request Solution
```

------

作用：

连接：

产品页面

↓

需求中心

------

自动传递：

```
Product ID

Category

Parameters
```

------

# 35. Product Component Responsive

PC：

```
Grid Layout
```

------

Mobile：

```
Single Column
```

------

参数表：

移动端：

支持横向滚动。

------

# 36. Product Component Checklist

| Item              | Status  |
| ----------------- | ------- |
| Product Card      | Defined |
| Product List      | Defined |
| Filter Component  | Defined |
| Parameter Table   | Defined |
| Compare Component | Defined |
| Requirement Link  | Defined |

# Requirement Business Components Specification

------

# 37. Purpose

本文档定义 VISNDT 需求中心业务组件规范。

目标：

建立：

- 需求创建组件；
- 参数输入组件；
- 状态展示组件；
- 撮合结果组件。

------

# 38. Requirement Component Position

需求组件负责：

```
User Need

↓

Structured Data

↓

Requirement Record

↓

Matching Process
```

------

# 39. Requirement Component Structure

整体：

```
Requirement Components

├── RequirementForm

├── ParameterInput

├── ScenarioSelector

├── RequirementSummary

├── RequirementStatus

└── MatchingResult
```

------

# 40. RequirementForm Component

## Purpose

需求提交主组件。

------

使用场景：

- 首页需求入口；
- 产品详情页；
- 需求中心。

------

结构：

```
Basic Information

↓

Inspection Requirement

↓

Technical Parameters

↓

Contact Information

↓

Submit
```

------

# 41. RequirementForm Fields

基础信息：

```
Title

Category

Industry

Application
```

------

检测需求：

```
Object Type

Inspection Position

Environment

Description
```

------

技术参数：

```
Diameter

Length

Resolution

Accuracy

Special Requirement
```

------

联系方式：

```
Company

Contact

Email

Phone
```

------

# 42. ParameterInput Component

## Purpose

结构化参数输入。

------

作用：

将：

用户描述

转换为：

系统可识别参数。

------

示例：

用户输入：

```
需要检测发动机内部
```

转换：

```
Industry:
Automotive

Object:
Engine

Device:
Video Endoscope
```

------

# 43. ParameterInput Types

支持：

------

## Select Input

用于：

固定参数。

例如：

```
Diameter

Resolution

Direction
```

------

## Range Input

用于：

范围。

例如：

```
Length:
1m - 10m
```

------

## Text Input

用于：

特殊说明。

------

# 44. ScenarioSelector Component

## Purpose

应用场景选择。

------

结构：

```
Industry

↓

Scenario

↓

Inspection Task
```

------

示例：

```
Aerospace

↓

Engine Inspection

↓

Blade Inspection
```

------

# 45. RequirementSummary Component

## Purpose

提交前确认。

------

展示：

```
Category

Application

Parameters

Description
```

------

作用：

减少错误提交。

------

# 46. RequirementStatus Component

## Purpose

需求状态展示。

------

状态：

```
Draft

↓

Submitted

↓

Reviewing

↓

Matching

↓

Completed
```

------

展示：

时间线形式。

------

# 47. MatchingResult Component

## Purpose

展示撮合结果。

------

内容：

```
Matched Solution

Recommended Supplier

Technical Response

Next Action
```

------

注意：

不是商城订单。

------

# 48. Requirement Interaction Flow

完整流程：

```
Open Requirement Page

↓

Fill Basic Info

↓

Select Parameters

↓

Submit

↓

Backend Processing

↓

Display Status

↓

Receive Response
```

------

# 49. Requirement Validation

前端校验：

包括：

- 必填字段；
- 格式检查；
- 参数范围。

------

例如：

电话：

格式验证。

------

# 50. Requirement Data Transfer

组件提交数据：

对应：

Backend Requirement Schema。

------

结构：

```
{
 category:"",
 application:"",
 parameters:{},
 description:"",
 contact:{}
}
```

------

# 51. Requirement Responsive Design

PC：

多列表单。

------

Mobile：

单列步骤流程。

------

# 52. Requirement Component Security

要求：

- 输入过滤；
- 防止恶意内容；
- 联系方式保护。

------

# 53. Requirement Component Checklist

| Item              | Status  |
| ----------------- | ------- |
| Requirement Form  | Defined |
| Parameter Input   | Defined |
| Scenario Selector | Defined |
| Status Display    | Defined |
| Matching Result   | Defined |
| Data Transfer     | Defined |

# Component System Acceptance Specification

------

# 54. Purpose

本文档定义 VISNDT 前端组件系统验收标准。

目标：

确认组件体系：

- 结构合理；
- 使用统一；
- 支持业务扩展。

------

# 55. Acceptance Scope

验收范围：

```
Base Components

+

Layout Components

+

Product Components

+

Requirement Components

+

Development Rules
```

------

# 56. Component Layer Acceptance

组件体系：

必须符合：

```
Base

↓

Business

↓

Page
```

结构。

------

禁止：

页面内部重复创建相同功能组件。

------

# 57. Base Component Acceptance

基础组件：

检查：

------

## Button

要求：

支持：

- 普通操作；
- 提交；
- 跳转。

------

## Input

要求：

支持：

- 文本；
- 参数；
- 搜索。

------

## Table

要求：

支持：

- 参数展示；
- 数据列表。

------

# 58. Business Component Acceptance

业务组件：

重点：

------

## ProductCard

验证：

是否可用于：

- 首页；
- 产品列表；
- 推荐区域。

------

## ParameterTable

验证：

是否支持：

- 不同设备参数；
- 参数分组。

------

## RequirementForm

验证：

是否支持：

- 产品来源需求；
- 独立需求提交。

------

# 59. Component Reusability Acceptance

要求：

一个组件：

可以被多个页面调用。

例如：

```
ProductCard

↓

Home

↓

ProductList

↓

SearchResult
```

------

# 60. Component Independence Acceptance

要求：

组件：

不依赖具体页面。

------

例如：

正确：

```
ParameterTable

receives data

renders table
```

------

错误：

```
ParameterTable

directly calls Product API
```

------

# 61. Data Flow Acceptance

标准：

```
Page

↓

Component

↓

Props / Events

↓

Store

↓

Service
```

------

禁止：

组件直接操作后台接口。

------

# 62. Naming Acceptance

规则：

------

组件：

```
ProductCard.vue

RequirementForm.vue
```

------

变量：

camelCase。

------

接口：

service 命名。

例如：

```
productService

requirementService
```

------

# 63. Documentation Acceptance

核心组件必须记录：

包括：

```
Component Purpose

Props

Events

Usage Example
```

------

# 64. Responsive Acceptance

组件必须支持：

------

Desktop：

```
PC Layout
```

------

Mobile：

```
Responsive Layout
```

------

重点：

- 产品卡片；
- 参数表；
- 表单。

------

# 65. Performance Acceptance

检查：

------

## Component Loading

支持：

按需加载。

------

## Rendering

避免：

大量重复渲染。

------

# 66. Final Component Checklist

| Item                   | Status |
| ---------------------- | ------ |
| Base Components        | PASS   |
| Layout Components      | PASS   |
| Product Components     | PASS   |
| Requirement Components | PASS   |
| Reusability            | PASS   |
| Naming Rules           | PASS   |
| Documentation          | PASS   |
| Responsive             | PASS   |

------

# 67. 603_Component_Design_System Final Status

| Module                 | Status    |
| ---------------------- | --------- |
| Component Foundation   | Completed |
| Product Components     | Completed |
| Requirement Components | Completed |
| Component Acceptance   | Completed |

------

# 603_Component_Design_System

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