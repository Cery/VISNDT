# Public Page UI Foundation

------

# 1. Purpose

定义 VISNDT 公共页面前端 UI 设计规范。

目标：

建立平台基础展示能力：

- 首页品牌展示；
- 内容入口；
- 技术知识传播；
- 行业应用展示；
- SEO 流量承接。

------

# 2. Public Page Position

公共页面定位：

```
Brand Entrance

+

SEO Content

+

Industry Knowledge

+

Platform Trust
```

------

# 3. Public Page Scope

包含：

```
Home

About

News

Technical Center

Applications

Contact
```

------

# 4. Information Architecture

结构：

```
/

├── Home

├── Products

├── Solutions

├── News

├── Technology

├── Applications

└── Contact
```

------

# 5. Header Navigation

组件：

```
GlobalHeader
```

------

导航：

```
Home

Products

Solutions

Applications

Technology

News

Contact
```

------

# 6. Header Design Rule

要求：

- 简洁；
- 工业风格；
- 强调专业性。

------

禁止：

```
复杂营销动画

过度商业广告
```

------

# 7. Homepage Position

首页目标：

```
Explain Platform

Guide Product

Generate Requirement
```

------

# 8. Homepage Structure

布局：

```
Hero Banner

↓

Core Categories

↓

Featured Products

↓

Application Scenarios

↓

Technical Articles

↓

Requirement CTA

↓

Footer
```

------

# 9. Hero Section

组件：

```
HeroBanner
```

------

展示：

```
Platform Title

Value Description

Main Entry Buttons
```

------

按钮：

```
Explore Products

Submit Requirement
```

------

# 10. Category Section

组件：

```
CategoryGrid
```

------

展示：

```
Electronic Endoscope

Optical Endoscope

Fiber Endoscope

Pipeline Inspection

Crawler Robot
```

------

# 11. Featured Product Section

组件：

```
FeaturedProductList
```

------

展示：

```
Product Image

Product Name

Core Capability

Application
```

------

# 12. Application Section

组件：

```
ApplicationGrid
```

------

场景：

```
Aerospace

Automotive

Energy

Manufacturing

Research
```

------

# 13. Technology Section

组件：

```
TechnologyPreview
```

------

内容：

```
Inspection Knowledge

Parameter Explanation

Application Guide
```

------

目的：

SEO 内容沉淀。

------

# 14. News Section

组件：

```
NewsList
```

------

内容：

```
Industry News

Exhibition

Technology Update
```

------

# 15. Requirement CTA Section

组件：

```
RequirementCTA
```

------

展示：

```
Need Inspection Solution?

Submit Requirement
```

------

# 16. Footer Design

组件：

```
GlobalFooter
```

------

包含：

```
Platform Description

Navigation

Contact

Copyright
```

------

# 17. About Page

目标：

建立平台可信度。

------

内容：

```
Platform Introduction

Positioning

Service Model

Cooperation Method
```

------

# 18. Contact Page

目标：

承接业务联系。

------

展示：

```
Company Information

Contact Form

Requirement Entry
```

------

# 19. Public Page Responsive

PC：

```
Multi Column Layout
```

------

Mobile：

```
Single Column

Card Layout
```

------

# 20. Public Page Component Mapping

| Component         | Function   |
| ----------------- | ---------- |
| GlobalHeader      | Navigation |
| HeroBanner        | Homepage   |
| CategoryGrid      | Category   |
| NewsList          | Content    |
| TechnologyPreview | SEO        |
| GlobalFooter      | Common     |

------

# 21. Public Page Foundation Checklist

| Item           | Status  |
| -------------- | ------- |
| Navigation     | Defined |
| Homepage       | Defined |
| Category Entry | Defined |
| Content Entry  | Defined |
| SEO Structure  | Defined |
| Footer         | Defined |
| Responsive     | Defined |

# Homepage Detailed Design

------

# 22. Purpose

定义 VISNDT 首页详细 UI 结构。

目标：

实现：

- 平台定位展示；
- 产品入口导流；
- 行业内容传播；
- 需求转化。

------

# 23. Homepage User Goal

用户进入首页后：

```
了解平台

↓

寻找设备

↓

查看方案

↓

提交需求
```

------

# 24. Homepage Overall Layout

页面：

```
Header

↓

Hero Banner

↓

Product Category

↓

Featured Products

↓

Application Scenarios

↓

Technical Content

↓

Requirement CTA

↓

Footer
```

------

# 25. Hero Banner Design

组件：

```
HeroBanner
```

------

结构：

```
--------------------------------

Title

Description

Action Buttons

Industrial Image

--------------------------------
```

------

# 26. Hero Content

标题方向：

```
Industrial Inspection Technology Platform
```

------

描述：

```
Connecting inspection equipment,
technical solutions and industrial applications.
```

------

# 27. Hero Action

按钮：

主按钮：

```
探索检测设备
```

跳转：

```
/Product
```

------

次按钮：

```
提交检测需求
```

跳转：

```
/Requirement
```

------

# 28. Product Category Section

组件：

```
CategoryGrid
```

------

布局：

PC：

```
5 Columns
```

------

Mobile：

```
Single Column
```

------

# 29. Category Card

组件：

```
CategoryCard
```

------

内容：

```
Icon/Image

Category Name

Short Description

View Products
```

------

# 30. Featured Product Section

目的：

展示重点设备。

------

组件：

```
FeaturedProductCard
```

------

展示：

```
Image

Name

Key Parameters

Application
```

------

数量：

```
3-6 Products
```

------

# 31. Application Scenario Section

目的：

从应用角度进入平台。

------

组件：

```
ScenarioGrid
```

------

场景：

```
Aerospace

Automotive

Energy

Manufacturing

Research
```

------

# 32. Scenario Card

展示：

```
Industry

Inspection Object

Recommended Category
```

------

点击：

进入：

```
/Solutions
```

------

# 33. Technical Content Section

目的：

SEO 内容入口。

------

组件：

```
ArticlePreview
```

------

展示：

```
Article Title

Category

Summary

Date
```

------

内容类型：

```
Inspection Knowledge

Equipment Guide

Industry Application
```

------

# 34. Requirement CTA Section

组件：

```
RequirementCTA
```

------

位置：

首页底部。

------

展示：

```
Need Professional Inspection Solution?
```

------

按钮：

```
Submit Requirement
```

------

# 35. Homepage SEO Design

页面元素：

```
Title

Description

Keywords

Structured Data
```

------

关键词方向：

```
Industrial Endoscope

Inspection Equipment

NDT Solution
```

------

# 36. Homepage Performance Design

要求：

图片：

```
WebP

Lazy Loading

Compressed
```

------

组件：

```
Dynamic Import
```

------

# 37. Homepage Responsive

## Desktop

布局：

```
Max Width 1200px

Grid Layout
```

------

## Mobile

布局：

```
Stack Layout

Card Scroll
```

------

# 38. Homepage Component Mapping

| Component      | Function        |
| -------------- | --------------- |
| HeroBanner     | Brand Entry     |
| CategoryGrid   | Product Entry   |
| ProductCard    | Product Display |
| ScenarioGrid   | Application     |
| ArticlePreview | SEO             |
| RequirementCTA | Conversion      |

------

# 39. Homepage Interaction Checklist

| Item                | Status  |
| ------------------- | ------- |
| Hero Banner         | Defined |
| Category Entry      | Defined |
| Product Display     | Defined |
| Application Display | Defined |
| Content Entry       | Defined |
| Requirement CTA     | Defined |
| SEO                 | Defined |
| Responsive          | Defined |

# Content Pages Design

------

# 40. Purpose

定义 VISNDT 内容型公共页面 UI 设计。

目标：

建立：

- 技术内容入口；
- 行业知识沉淀；
- SEO 长尾流量页面；
- 平台专业形象。

------

# 41. Content Page Scope

包含：

```
News

Technology Center

Application Cases

About

Contact
```

------

# 42. Content Page Common Layout

统一结构：

```
Header

↓

Breadcrumb

↓

Page Banner

↓

Main Content

↓

Related Content

↓

Footer
```

------

# 43. Breadcrumb Design

组件：

```
Breadcrumb
```

------

展示：

```
Home

>

Technology

>

Article
```

------

作用：

- 页面定位；
- SEO 结构。

------

# 44. News Page Design

路径：

```
/news
```

------

目的：

展示：

- 行业动态；
- 展会信息；
- 平台资讯。

------

# 45. News List Layout

组件：

```
NewsList
```

------

结构：

```
--------------------------------

Image

Title

Summary

Date

Category

--------------------------------
```

------

# 46. News Detail Page

结构：

```
Title

↓

Meta Information

↓

Article Content

↓

Related News

↓

Requirement CTA
```

------

# 47. Technology Center Design

路径：

```
/technology
```

------

定位：

工业检测知识中心。

------

内容：

```
Inspection Principle

Equipment Guide

Parameter Explanation

Selection Guide
```

------

# 48. Technology Article Layout

组件：

```
ArticleDetail
```

------

结构：

```
Title

Summary

Content

Parameter Table

Related Products
```

------

# 49. Technical Article Product Connection

文章关联：

```
Technology Article

↓

Related Category

↓

Related Product

↓

Requirement
```

------

作用：

提升转化。

------

# 50. Application Case Design

路径：

```
/applications
```

------

定位：

展示工业应用场景。

------

# 51. Application List Layout

组件：

```
ApplicationGrid
```

------

展示：

```
Industry

Inspection Object

Challenge

Solution
```

------

# 52. Application Detail Page

结构：

```
Scenario Title

↓

Industry Background

↓

Inspection Challenge

↓

Recommended Solution

↓

Related Equipment
```

------

# 53. Application Solution Connection

流程：

```
Application Case

↓

Product Category

↓

Product Detail

↓

Requirement
```

------

# 54. About Page Design

路径：

```
/about
```

------

内容：

```
Platform Introduction

Service Model

Value Proposition

Cooperation Method
```

------

# 55. About Page Position

强调：

```
Platform Neutrality

Technical Capability

Industry Connection
```

------

避免：

```
Single Supplier Website Impression
```

------

# 56. Contact Page Design

路径：

```
/contact
```

------

结构：

```
Contact Information

↓

Business Inquiry

↓

Requirement Entry
```

------

# 57. Contact Form

字段：

```
Company

Name

Email

Phone

Message
```

------

提交：

进入：

```
Requirement Center
```

------

# 58. Content Component Mapping

| Component       | Function   |
| --------------- | ---------- |
| Breadcrumb      | Navigation |
| NewsList        | News       |
| ArticleDetail   | Content    |
| ApplicationGrid | Case       |
| ContactForm     | Contact    |
| RelatedContent  | SEO        |

------

# 59. Content SEO Design

所有内容页支持：

```
SEO Title

SEO Description

Keywords

Canonical URL

Structured Data
```

------

# 60. Internal Linking

规则：

内容之间互联：

```
Article

↓

Category

↓

Product

↓

Requirement
```

------

# 61. Content Page Responsive

Desktop：

```
Main Content

+

Sidebar
```

------

Mobile：

```
Single Column
```

------

# 62. Content Page Checklist

| Item              | Status  |
| ----------------- | ------- |
| News Page         | Defined |
| Technology Center | Defined |
| Article Page      | Defined |
| Application Page  | Defined |
| About Page        | Defined |
| Contact Page      | Defined |
| SEO Structure     | Defined |
| Internal Linking  | Defined |
| Responsive        | Defined |

# Public Page UI Acceptance Specification

------

# 63. Purpose

定义 VISNDT 公共页面最终验收标准。

目标：

确认：

- 平台展示完整；
- 内容结构合理；
- SEO 基础完善；
- 用户访问路径清晰。

------

# 64. Acceptance Scope

范围：

```
Homepage

+

Navigation

+

News

+

Technology

+

Applications

+

About

+

Contact

+

SEO
```

------

# 65. Global Navigation Acceptance

检查：

导航包含：

```
Home

Products

Solutions

Applications

Technology

News

Contact
```

------

要求：

- 层级清晰；
- 页面可访问；
- 移动端正常。

状态：

```
PASS
```

------

# 66. Homepage Acceptance

检查：

首页包含：

```
Hero

Category

Products

Applications

Content

CTA
```

------

要求：

完成：

```
Brand Presentation

Traffic Guidance

Requirement Conversion
```

状态：

```
PASS
```

------

# 67. Product Entry Acceptance

检查：

首页：

可进入：

```
Product Category

Product Detail

Requirement
```

------

状态：

```
PASS
```

------

# 68. News Center Acceptance

检查：

支持：

```
News List

News Detail

Related Content
```

------

要求：

内容结构支持持续发布。

状态：

```
PASS
```

------

# 69. Technology Center Acceptance

检查：

支持：

```
Knowledge Article

Parameter Explanation

Selection Guide
```

------

要求：

形成 SEO 内容资产。

状态：

```
PASS
```

------

# 70. Application Page Acceptance

检查：

包含：

```
Industry

Object

Challenge

Solution

Equipment
```

------

状态：

```
PASS
```

------

# 71. About Page Acceptance

检查：

展示：

```
Platform Position

Service Model

Cooperation Method
```

------

要求：

避免单一供应商网站形象。

状态：

```
PASS
```

------

# 72. Contact Page Acceptance

检查：

包含：

```
Contact Information

Inquiry Form

Requirement Entry
```

------

状态：

```
PASS
```

------

# 73. SEO Acceptance

检查：

页面具备：

```
Title

Description

Keywords

Canonical

Structured Data
```

------

要求：

支持搜索引擎收录。

状态：

```
PASS
```

------

# 74. Internal Link Acceptance

检查：

页面连接：

```
Article

↓

Application

↓

Product

↓

Requirement
```

------

状态：

```
PASS
```

------

# 75. Responsive Acceptance

检查：

设备：

```
Desktop

Tablet

Mobile
```

------

要求：

布局正常。

状态：

```
PASS
```

------

# 76. Performance Acceptance

检查：

包括：

```
Image Optimization

Lazy Loading

Static Rendering

Cache Strategy
```

------

状态：

```
PASS
```

------

# 77. Public Page Checklist

| Item          | Status |
| ------------- | ------ |
| Navigation    | PASS   |
| Homepage      | PASS   |
| Product Entry | PASS   |
| News          | PASS   |
| Technology    | PASS   |
| Applications  | PASS   |
| About         | PASS   |
| Contact       | PASS   |
| SEO           | PASS   |
| Responsive    | PASS   |
| Performance   | PASS   |

------

# 78. 608_Public_Page_UI Final Status

| Module            | Status    |
| ----------------- | --------- |
| Public Foundation | Completed |
| Homepage Design   | Completed |
| Content Pages     | Completed |
| Acceptance        | Completed |

------

# 608_Public_Page_UI

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