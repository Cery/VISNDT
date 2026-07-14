# Website Information Architecture Foundation

------

# 1. Purpose

本文档定义 VISNDT 前端页面信息架构。

目标：

建立：

- 清晰的网站结构；
- 用户访问路径；
- SEO 页面体系；
- 业务入口体系。

------

# 2. Website Position

VISNDT 网站定位：

```
Industrial Inspection Equipment Platform
```

不是：

单品牌企业官网。

而是：

工业检测设备信息与需求撮合平台。

------

# 3. Target User Journey

核心用户路径：

```
Traffic Entry

↓

Homepage

↓

Category / Search

↓

Product Detail

↓

Solution / Application

↓

Demand Submission

↓

RFQ Service
```

------

# 4. Global Information Structure

整体导航：

```
Home

├── Products

├── Solutions

├── Applications

├── Knowledge Center

├── Demands

└── About Platform
```

------

# 5. Top Navigation Design

顶部导航：

------

## Home

路径：

```
/ 
```

作用：

平台入口。

展示：

- 平台定位；
- 核心产品；
- 行业入口。

------

## Products

路径：

```
/products
```

作用：

设备查询中心。

包括：

- 产品分类；
- 参数筛选；
- 产品详情。

------

## Solutions

路径：

```
/solutions
```

作用：

解决方案展示。

包括：

- 行业应用；
- 检测案例；
- 技术方案。

------

## Applications

路径：

```
/applications
```

作用：

按应用场景组织内容。

例如：

- 汽车制造；
- 航空航天；
- 管道检测；
- 工业维护。

------

## Knowledge Center

路径：

```
/knowledge
```

作用：

SEO 内容中心。

包括：

- 技术文章；
- 选型指南；
- 行业知识。

------

## Demands

路径：

```
/demands
```

作用：

需求撮合入口。

包括：

- 发布 Demand；
- 查看 RFQ 状态。

------

# 6. Product Information Architecture

产品中心结构：

```
Products

↓

Category

↓

Parameter Filter

↓

Product List

↓

Product Detail

↓

Demand Request
```

------

# 7. Product Category Structure

一级分类：

```
Industrial Endoscope

├── Video Endoscope

├── Optical Endoscope

├── Fiber Endoscope

└── Pipeline Inspection
```

未来扩展：

```
NDT Equipment

├── Endoscope

├── Thickness Gauge

├── Detector

└── Robot System
```

------

# 8. Product Detail Page Structure

产品详情：

```
Product Title

↓

Main Image

↓

Key Parameters

↓

Technical Specification

↓

Application Scenario

↓

Supplier Information

↓

Request Button
```

------

# 9. Demand Architecture

需求中心：

```
Demand Center

↓

Create Demand

↓

Parameter Input

↓

Submit

↓

RFQ Generation

↓

Organization Response
```

------

# 10. Organization Side Architecture

Organization 管理界面：

```
Organization Dashboard

├── Dashboard
├── Offers  
├── RFQ
└── Notifications
```

## Dashboard

Organization 主页：

- 企业概况
- 数据统计
- 快速操作

## Offers

Offer 管理：

- 创建 Offer
- 管理 Offer
- 绑定 Standard Product

## RFQ

RFQ 处理：

- RFQ Inbox
- Response Management
- 状态跟踪

## Notifications

通知中心：

- 新 RFQ 通知
- 系统消息
- 业务提醒

------

# 11. User Center Architecture

用户中心：

```
Account

├── Profile

├── Favorites

├── My Demands

└── Messages
```

------

# 11. SEO Page Structure

SEO 页面：

采用：

```
Category Page

+

Product Page

+

Knowledge Page

+

Solution Page
```

------

# 12. URL Planning

规则：

语义化。

示例：

产品：

```
/products/video-endoscope
```

分类：

```
/products/categories/pipeline
```

方案：

```
/solutions/aerospace-inspection
```

知识：

```
/knowledge/how-to-select-endoscope
```

------

# 13. Page Hierarchy

网站层级：

```
Level 0

Website


Level 1

Navigation


Level 2

Category


Level 3

Detail


Level 4

Action
```

------

# 14. Information Architecture Checklist

| Item                 | Status  |
| -------------------- | ------- |
| Navigation Structure | Defined |
| Product Structure    | Defined |
| Requirement Flow     | Defined |
| User Center          | Defined |
| SEO Structure        | Defined |
| URL Rule             | Defined |

# Homepage Information Architecture

------

# 15. Purpose

本文档定义 VISNDT 首页结构。

目标：

实现：

- 平台品牌展示；
- 产品入口；
- 行业入口；
- SEO 内容入口；
- 需求转换入口。

------

# 16. Homepage Position

首页定位：

```
Industrial Inspection Platform Entry
```

核心任务：

不是销售单个产品。

而是：

```
展示平台能力

↓

帮助用户找到设备

↓

促进需求产生
```

------

# 17. Homepage Overall Layout

首页结构：

```
Header

↓

Hero Section

↓

Category Navigation

↓

Featured Products

↓

Application Areas

↓

Solution Center

↓

Knowledge Center

↓

Requirement CTA

↓

Footer
```

------

# 18. Header Design

顶部区域：

组成：

```
Logo

+

Navigation

+

Search

+

Requirement Button
```

------

功能：

## Logo

展示：

VISNDT 平台品牌。

------

## Navigation

入口：

- Products；
- Solutions；
- Applications；
- Knowledge；
- Requirements。

------

## Search

支持：

关键词搜索。

例如：

```
video endoscope

pipeline inspection

3mm probe
```

------

## Requirement Button

突出：

```
Submit Requirement
```

作为撮合入口。

------

# 19. Hero Section Design

首屏目的：

3秒理解平台。

------

结构：

```
Main Title

↓

Platform Description

↓

Search Box

↓

Primary Action
```

------

示例表达：

```
Industrial Inspection Equipment Platform

Find suitable inspection solutions by parameters and applications.
```

------

# 20. Search Center

首页核心模块。

位置：

Hero 区域。

------

支持：

关键词：

```
产品名称

型号

参数

应用场景
```

------

未来扩展：

智能推荐搜索。

------

# 21. Category Navigation

作用：

帮助用户快速进入设备分类。

------

展示：

```
Video Endoscope

Optical Endoscope

Fiber Endoscope

Pipeline Inspection
```

------

形式：

卡片入口。

------

每个入口：

包含：

- 图标；
- 分类名称；
- 简短说明。

------

# 22. Featured Products

展示：

精选设备。

目的：

帮助用户快速了解平台内容。

------

产品卡片：

```
Image

↓

Product Name

↓

Key Parameters

↓

View Detail
```

------

不展示：

价格。

------

# 23. Application Areas

应用入口：

按行业组织。

------

例如：

```
Automotive

Aerospace

Manufacturing

Energy

Pipeline
```

------

目的：

符合工业用户搜索习惯。

------

# 24. Solution Center Entry

展示：

解决方案。

结构：

```
Industry

↓

Inspection Problem

↓

Recommended Solution
```

------

例如：

汽车：

```
Engine Internal Inspection

↓

Video Endoscope Solution
```

------

# 25. Knowledge Center Entry

SEO 内容入口。

展示：

- 技术文章；
- 选型指南；
- 行业知识。

------

目的：

提升：

搜索流量。

------

# 26. Requirement CTA Section

首页重要转化区域。

位置：

页面底部。

------

内容：

```
Describe Your Inspection Need

↓

Submit Requirement
```

------

字段：

包括：

- 产品类型；
- 应用场景；
- 技术参数。

------

# 27. Footer Design

Footer 内容：

```
Platform Introduction

Product Categories

Solutions

Contact

Legal Information
```

------

# 28. Homepage Responsive Design

PC：

```
1200px+
```

布局：

多栏。

------

Mobile：

```
<768px
```

布局：

单列。

------

# 29. Homepage SEO Structure

首页：

必须包含：

## Title

平台定位关键词。

------

## Description

说明：

工业检测设备平台。

------

## Structured Data

包含：

```
Organization

WebSite

SearchAction
```

------

# 30. Homepage Component Mapping

| Module      | Component       |
| ----------- | --------------- |
| Header      | HeaderNav       |
| Hero        | HeroSection     |
| Search      | GlobalSearch    |
| Category    | CategoryCards   |
| Products    | ProductCarousel |
| Application | IndustryCards   |
| CTA         | RequirementCTA  |
| Footer      | Footer          |

------

# 31. Homepage Checklist

| Item              | Status  |
| ----------------- | ------- |
| Layout Structure  | Defined |
| Navigation        | Defined |
| Search Entry      | Defined |
| Product Entry     | Defined |
| Requirement Entry | Defined |
| SEO Structure     | Defined |

# Product Page Information Architecture

------

# 32. Purpose

本文档定义 VISNDT 产品中心页面架构。

目标：

建立：

- 参数驱动产品查询；
- 产品信息展示；
- 技术比较；
- 需求转化入口。

------

# 33. Product Center Position

产品中心定位：

```
Industrial Inspection Equipment Database
```

不是：

传统商城。

不包含：

- 在线交易；
- 价格展示；
- 购物流程。

------

# 34. Product Page Structure

整体：

```
Product Center

↓

Category Page

↓

Product List

↓

Product Detail

↓

Requirement Request
```

------

# 35. Product Category Page

路径：

```
/products/category
```

作用：

分类入口。

------

展示：

```
Category Introduction

↓

Sub Categories

↓

Parameter Filters

↓

Product List
```

------

# 36. Product List Page

路径：

```
/products
```

核心页面。

布局：

```
Left

Filter Panel


Right

Product Results
```

------

# 37. Filter Panel Design

筛选原则：

参数优先。

------

结构：

```
Category

↓

Diameter

↓

Length

↓

Pixel

↓

Direction

↓

Guidance

↓

Application
```

------

# 38. Core Parameter Filters

VISNDT 工业内窥镜：

重点参数：

------

## Probe Diameter

示例：

```
0.85mm

1.0mm

3.0mm

6.0mm
```

------

## Insertion Length

示例：

```
1m

3m

5m

10m+
```

------

## Camera Resolution

示例：

```
300K

1M

2M

3M
```

------

## Viewing Direction

例如：

```
Forward

Side

Dual
```

------

## Articulation

例如：

```
Fixed

180°

360°
```

------

# 39. Product Card Design

产品列表卡片：

结构：

```
+----------------+

Image

Product Name

Key Parameters

Application

Supplier

View Detail

+----------------+
```

------

显示：

重点参数。

不显示：

价格。

------

# 40. Product Detail Page

路径：

```
/products/{id}
```

------

页面结构：

```
Product Header

↓

Gallery

↓

Key Parameters

↓

Technical Specification

↓

Application

↓

Documents

↓

Supplier

↓

Requirement Button
```

------

# 41. Product Header

包含：

- 产品名称；
- 产品分类；
- 核心特点。

------

示例：

```
High Resolution Video Endoscope

Portable Industrial Inspection Camera
```

------

# 42. Product Image Area

支持：

- 主图；
- 多角度图片；
- 应用图片。

------

原则：

图片服务于理解。

不是电商展示。

------

# 43. Key Parameter Section

重点展示：

快速判断。

例如：

```
Probe Diameter

Camera Pixel

Insertion Length

View Direction

Articulation
```

------

# 44. Technical Specification Table

完整参数：

表格形式。

------

示例：

| Parameter  | Value |
| ---------- | ----- |
| Diameter   | 3mm   |
| Resolution | 2MP   |
| Length     | 5m    |
| Light      | LED   |

------

# 45. Application Section

说明：

设备适用场景。

例如：

```
Automotive

Aerospace

Casting

Pipeline
```

------

# 46. Document Section

支持：

技术资料。

包括：

- Datasheet；
- Manual；
- Inspection Guide。

------

# 47. Supplier Display

展示：

供应商信息。

规则：

显示：

- 企业名称；
- 企业属性。

不作为：

店铺入口。

------

# 48. Product Comparison

支持：

参数比较。

流程：

```
Select Products

↓

Compare Parameters

↓

Choose Suitable Model
```

------

比较：

重点参数。

------

# 49. Requirement Conversion

产品详情：

提供：

```
Request This Solution
```

------

进入：

需求提交流程。

自动携带：

- 产品；
- 参数；
- 分类。

------

# 50. Product SEO Structure

每个产品页面：

支持：

Meta：

```
Title

Description

Keywords
```

------

Structured Data：

```
Product Schema
```

------

# 51. Product Page Component Mapping

| Module  | Component         |
| ------- | ----------------- |
| Filter  | ParameterFilter   |
| List    | ProductCard       |
| Table   | ParameterTable    |
| Gallery | ProductGallery    |
| Compare | ProductCompare    |
| CTA     | RequirementButton |

------

# 52. Product Page Checklist

| Item               | Status  |
| ------------------ | ------- |
| Category Structure | Defined |
| Parameter Filter   | Defined |
| Product List       | Defined |
| Detail Page        | Defined |
| Compare Function   | Defined |
| Requirement Link   | Defined |
| SEO                | Defined |

# Page Architecture Acceptance Specification

------

# 53. Purpose

本文档定义 VISNDT 页面信息架构验收标准。

目标：

确认：

- 页面结构完整；
- 用户路径清晰；
- 业务入口有效；
- SEO 基础完善。

------

# 54. Acceptance Scope

验收范围：

```
Website Navigation

+

Homepage

+

Product Pages

+

Requirement Flow

+

SEO Structure

+

Responsive Design
```

------

# 55. Navigation Acceptance

确认：

顶部导航：

包含：

```
Home

Products

Solutions

Applications

Knowledge

Requirements
```

------

要求：

用户能够：

最多三次点击：

进入目标内容。

------

# 56. Homepage Acceptance

检查：

## Platform Introduction

确认：

首页能够表达：

- VISNDT 是什么；
- 服务什么行业；
- 提供什么能力。

------

## Entry Points

确认：

首页具备：

```
Product Entry

Solution Entry

Requirement Entry
```

------

# 57. Product Center Acceptance

检查：

------

## Category

确认：

产品分类清晰。

------

## Search

确认：

支持：

- 关键词搜索；
- 参数筛选。

------

## Product Detail

确认：

展示：

- 基础信息；
- 技术参数；
- 应用场景。

------

# 58. Product Decision Flow Acceptance

验证用户流程：

```
Find Product

↓

View Parameters

↓

Compare

↓

Request Solution
```

------

要求：

流程完整。

------

# 59. Requirement Entry Acceptance

确认：

产品页面和首页：

均可进入：

```
Requirement Submission
```

------

并支持：

自动携带：

- 产品信息；
- 参数信息。

------

# 60. SEO Architecture Acceptance

检查：

------

## Page Metadata

每类页面：

支持：

- Title；
- Description。

------

## URL

确认：

URL：

语义化。

例如：

```
/products/video-endoscope
```

------

## Structured Data

支持：

```
Product

Organization

Article
```

------

# 61. Responsive Acceptance

设备：

包括：

```
Desktop

Tablet

Mobile
```

------

检查：

- 导航适配；
- 产品列表适配；
- 参数表适配。

------

# 62. Performance Acceptance

检查：

------

## Loading

确认：

- 首屏加载正常；
- 图片优化。

------

## Interaction

确认：

- 筛选响应正常；
- 页面切换正常。

------

# 63. Accessibility Acceptance

基础要求：

包括：

- 清晰文字层级；
- 合理颜色对比；
- 可操作按钮。

------

# 64. Content Management Acceptance

确认：

未来内容可扩展：

包括：

- 新产品；
- 新方案；
- 新文章。

------

# 65. Page Architecture Checklist

| Item              | Status |
| ----------------- | ------ |
| Navigation        | PASS   |
| Homepage          | PASS   |
| Product Center    | PASS   |
| Requirement Flow  | PASS   |
| SEO Structure     | PASS   |
| Responsive        | PASS   |
| Content Expansion | PASS   |

------

# 66. 602_Page_Information_Architecture Final Status

| Module                    | Status    |
| ------------------------- | --------- |
| Website Structure         | Completed |
| Homepage Architecture     | Completed |
| Product Page Architecture | Completed |
| Page Acceptance           | Completed |

------

# 602_Page_Information_Architecture

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